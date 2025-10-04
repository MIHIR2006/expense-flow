"""
Expense service for expense management.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional, Tuple
from decimal import Decimal
from datetime import datetime
from ..models.expense import Expense, ExpenseStatus, ExpenseCategory
from ..models.approval_action import ApprovalAction, ApprovalActionStatus
from ..models.approval_rule import ApprovalRule, ApprovalRuleApprover
from ..models.audit_log import AuditLog, AuditAction
from ..models.user import User, UserRole
from ..schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseAction, ExpenseWithDetails
from ..schemas.common import PaginationParams
from ..utils.external_apis import exchange_rate_api
from ..utils.rbac import can_view_expense, can_approve_expense
import logging

logger = logging.getLogger(__name__)


class ExpenseService:
    """Expense service."""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def create_expense(self, expense_data: ExpenseCreate, submitter: User) -> Expense:
        """Create a new expense."""
        # Get exchange rate
        exchange_rate = await exchange_rate_api.get_exchange_rate(
            expense_data.currency, 
            submitter.company.base_currency
        )
        
        if not exchange_rate:
            raise ValueError(f"Could not get exchange rate for {expense_data.currency}")
        
        # Calculate amount in base currency
        amount_in_base = expense_data.amount * Decimal(str(exchange_rate))
        
        # Create expense
        expense = Expense(
            amount=expense_data.amount,
            currency=expense_data.currency,
            amount_in_base=amount_in_base,
            exchange_rate_to_base=Decimal(str(exchange_rate)),
            category=expense_data.category,
            description=expense_data.description,
            expense_date=expense_data.expense_date,
            status=ExpenseStatus.SUBMITTED,
            submitter_id=submitter.id,
            company_id=submitter.company_id
        )
        
        self.db.add(expense)
        self.db.flush()  # Get expense ID
        
        # Create approval actions based on rules
        await self._create_approval_actions(expense)
        
        # Update status to pending approval
        expense.status = ExpenseStatus.PENDING_APPROVAL
        
        self.db.commit()
        self.db.refresh(expense)
        
        # Create audit log
        self._create_audit_log(
            user_id=submitter.id,
            expense_id=expense.id,
            action=AuditAction.EXPENSE_SUBMITTED,
            description=f"Expense submitted: {expense.description}"
        )
        
        return expense
    
    async def _create_approval_actions(self, expense: Expense) -> None:
        """Create approval actions for an expense."""
        # Get applicable approval rules
        rules = self.db.query(ApprovalRule).filter(
            and_(
                ApprovalRule.company_id == expense.company_id,
                ApprovalRule.is_active == True
            )
        ).all()
        
        if not rules:
            # No rules, auto-approve
            expense.status = ExpenseStatus.APPROVED
            return
        
        # Use the first applicable rule (you might want more complex logic)
        rule = rules[0]
        sequence_order = 0
        
        # Add manager as first approver if required
        if rule.is_manager_approver and expense.submitter.manager_id:
            manager_action = ApprovalAction(
                expense_id=expense.id,
                approver_id=expense.submitter.manager_id,
                sequence_order=sequence_order,
                status=ApprovalActionStatus.PENDING
            )
            self.db.add(manager_action)
            sequence_order += 1
        
        # Add specific approver if set
        if rule.specific_approver_id:
            specific_action = ApprovalAction(
                expense_id=expense.id,
                approver_id=rule.specific_approver_id,
                sequence_order=sequence_order,
                status=ApprovalActionStatus.PENDING
            )
            self.db.add(specific_action)
            sequence_order += 1
        
        # Add rule approvers
        rule_approvers = self.db.query(ApprovalRuleApprover).filter(
            ApprovalRuleApprover.rule_id == rule.id
        ).order_by(ApprovalRuleApprover.sequence_order).all()
        
        for rule_approver in rule_approvers:
            action = ApprovalAction(
                expense_id=expense.id,
                approver_id=rule_approver.approver_id,
                sequence_order=sequence_order,
                status=ApprovalActionStatus.PENDING
            )
            self.db.add(action)
            sequence_order += 1
    
    def get_expense(self, expense_id: int, current_user: User) -> ExpenseWithDetails:
        """Get expense by ID with details."""
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise ValueError("Expense not found")
        
        # Check permissions
        if not can_view_expense(current_user, expense):
            raise ValueError("Access denied")
        
        # Get additional details
        submitter_name = expense.submitter.full_name if expense.submitter else None
        company_name = expense.company.name if expense.company else None
        
        # Get files
        files = expense.files
        
        # Get approval actions
        approval_actions = self.db.query(ApprovalAction).filter(
            ApprovalAction.expense_id == expense_id
        ).order_by(ApprovalAction.sequence_order).all()
        
        # Add approver names
        for action in approval_actions:
            action.approver_name = action.approver.full_name if action.approver else None
        
        return ExpenseWithDetails(
            **expense.__dict__,
            submitter_name=submitter_name,
            company_name=company_name,
            files=files,
            approval_actions=approval_actions
        )
    
    def get_expenses(
        self, 
        current_user: User, 
        pagination: PaginationParams,
        status: Optional[ExpenseStatus] = None,
        category: Optional[ExpenseCategory] = None,
        submitter_id: Optional[int] = None
    ) -> Tuple[List[ExpenseWithDetails], int]:
        """Get expenses with filtering and pagination."""
        query = self.db.query(Expense)
        
        # Apply company filter
        if current_user.role == UserRole.ADMIN:
            query = query.filter(Expense.company_id == current_user.company_id)
        elif current_user.role == UserRole.MANAGER:
            # Manager can see their own expenses and subordinates' expenses
            subordinate_ids = [u.id for u in current_user.subordinates]
            query = query.filter(
                and_(
                    Expense.company_id == current_user.company_id,
                    or_(
                        Expense.submitter_id == current_user.id,
                        Expense.submitter_id.in_(subordinate_ids)
                    )
                )
            )
        else:
            # Employee can only see their own expenses
            query = query.filter(Expense.submitter_id == current_user.id)
        
        # Apply filters
        if status:
            query = query.filter(Expense.status == status)
        if category:
            query = query.filter(Expense.category == category)
        if submitter_id:
            query = query.filter(Expense.submitter_id == submitter_id)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (pagination.page - 1) * pagination.per_page
        expenses = query.order_by(desc(Expense.created_at)).offset(offset).limit(pagination.per_page).all()
        
        # Convert to ExpenseWithDetails
        expense_details = []
        for expense in expenses:
            submitter_name = expense.submitter.full_name if expense.submitter else None
            company_name = expense.company.name if expense.company else None
            
            expense_details.append(ExpenseWithDetails(
                **expense.__dict__,
                submitter_name=submitter_name,
                company_name=company_name,
                files=expense.files,
                approval_actions=expense.approval_actions
            ))
        
        return expense_details, total
    
    async def approve_expense(
        self, 
        expense_id: int, 
        action_data: ExpenseAction, 
        approver: User
    ) -> ExpenseWithDetails:
        """Approve or reject an expense."""
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise ValueError("Expense not found")
        
        # Check permissions
        if not can_approve_expense(approver, expense):
            raise ValueError("Access denied")
        
        # Get approval action for this approver
        approval_action = self.db.query(ApprovalAction).filter(
            and_(
                ApprovalAction.expense_id == expense_id,
                ApprovalAction.approver_id == approver.id,
                ApprovalAction.status == ApprovalActionStatus.PENDING
            )
        ).first()
        
        if not approval_action:
            raise ValueError("No pending approval action found for this user")
        
        # Check sequential approval
        if expense.status == ExpenseStatus.PENDING_APPROVAL:
            # Check if all previous approvals are completed
            previous_actions = self.db.query(ApprovalAction).filter(
                and_(
                    ApprovalAction.expense_id == expense_id,
                    ApprovalAction.sequence_order < approval_action.sequence_order,
                    ApprovalAction.status == ApprovalActionStatus.PENDING
                )
            ).count()
            
            if previous_actions > 0:
                raise ValueError("Previous approvals must be completed first")
        
        # Update approval action
        approval_action.status = (
            ApprovalActionStatus.APPROVED if action_data.action == "approve" 
            else ApprovalActionStatus.REJECTED
        )
        approval_action.comment = action_data.comment
        approval_action.acted_at = datetime.utcnow()
        
        # Check if expense should be approved/rejected
        if action_data.action == "approve":
            await self._check_expense_approval(expense)
        else:
            expense.status = ExpenseStatus.REJECTED
            self._create_audit_log(
                user_id=approver.id,
                expense_id=expense.id,
                action=AuditAction.EXPENSE_REJECTED,
                description=f"Expense rejected: {action_data.comment}"
            )
        
        self.db.commit()
        self.db.refresh(expense)
        
        return self.get_expense(expense_id, approver)
    
    async def _check_expense_approval(self, expense: Expense) -> None:
        """Check if expense should be approved based on approval rules."""
        # Get approval rule
        rule = self.db.query(ApprovalRule).filter(
            and_(
                ApprovalRule.company_id == expense.company_id,
                ApprovalRule.is_active == True
            )
        ).first()
        
        if not rule:
            expense.status = ExpenseStatus.APPROVED
            return
        
        # Get approval actions
        actions = self.db.query(ApprovalAction).filter(
            ApprovalAction.expense_id == expense.id
        ).all()
        
        approved_count = sum(1 for action in actions if action.status == ApprovalActionStatus.APPROVED)
        total_count = len(actions)
        
        # Check if minimum approval percentage is met
        approval_percentage = (approved_count / total_count) * 100 if total_count > 0 else 0
        
        if approval_percentage >= rule.min_approval_percentage:
            expense.status = ExpenseStatus.APPROVED
            self._create_audit_log(
                user_id=expense.submitter_id,
                expense_id=expense.id,
                action=AuditAction.EXPENSE_APPROVED,
                description="Expense approved"
            )
    
    def _create_audit_log(
        self, 
        user_id: int, 
        expense_id: int, 
        action: AuditAction, 
        description: str
    ) -> None:
        """Create audit log entry."""
        audit_log = AuditLog(
            user_id=user_id,
            expense_id=expense_id,
            action=action,
            description=description
        )
        self.db.add(audit_log)
    
    def get_expense_statistics(self, company_id: int) -> dict:
        """Get expense statistics for a company."""
        stats = self.db.query(
            Expense.status,
            func.count(Expense.id).label('count'),
            func.sum(Expense.amount_in_base).label('total_amount')
        ).filter(
            Expense.company_id == company_id
        ).group_by(Expense.status).all()
        
        result = {}
        for stat in stats:
            result[stat.status.value] = {
                'count': stat.count,
                'total_amount': float(stat.total_amount or 0)
            }
        
        return result
