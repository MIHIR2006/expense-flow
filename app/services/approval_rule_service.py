"""
Approval Rule service for managing approval rules.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.approval_rule import ApprovalRule, ApprovalRuleApprover
from ..models.user import User, UserRole
from ..models.expense import Expense
from ..schemas.approval_rule import ApprovalRuleCreate, ApprovalRuleUpdate, ApprovalRuleWithApprovers
from ..utils.rbac import can_manage_user
import logging

logger = logging.getLogger(__name__)


class ApprovalRuleService:
    """Approval Rule service."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_rule(self, rule_data: ApprovalRuleCreate, created_by: User) -> ApprovalRuleWithApprovers:
        """Create a new approval rule."""
        # Check permissions
        if created_by.role != UserRole.ADMIN:
            raise ValueError("Only admins can create approval rules")
        
        # Validate approvers
        approvers = self.db.query(User).filter(
            and_(
                User.id.in_(rule_data.approvers),
                User.company_id == created_by.company_id,
                User.is_active == True
            )
        ).all()
        
        if len(approvers) != len(rule_data.approvers):
            raise ValueError("Some approvers are invalid or not in your company")
        
        # Create rule
        rule = ApprovalRule(
            name=rule_data.name,
            description=rule_data.description,
            is_manager_approver=rule_data.is_manager_approver,
            is_sequential=rule_data.is_sequential,
            min_approval_percentage=rule_data.min_approval_percentage,
            company_id=created_by.company_id,
            specific_approver_id=rule_data.specific_approver_id
        )
        
        self.db.add(rule)
        self.db.flush()  # Get rule ID
        
        # Create rule approvers
        for i, approver_id in enumerate(rule_data.approvers):
            rule_approver = ApprovalRuleApprover(
                rule_id=rule.id,
                approver_id=approver_id,
                sequence_order=i
            )
            self.db.add(rule_approver)
        
        self.db.commit()
        self.db.refresh(rule)
        
        return self.get_rule_with_approvers(rule.id, created_by)
    
    def get_rule(self, rule_id: int, current_user: User) -> ApprovalRule:
        """Get approval rule by ID."""
        rule = self.db.query(ApprovalRule).filter(ApprovalRule.id == rule_id).first()
        if not rule:
            raise ValueError("Approval rule not found")
        
        # Check permissions
        if rule.company_id != current_user.company_id:
            raise ValueError("Access denied")
        
        return rule
    
    def get_rule_with_approvers(self, rule_id: int, current_user: User) -> ApprovalRuleWithApprovers:
        """Get approval rule with approvers."""
        rule = self.get_rule(rule_id, current_user)
        
        # Get approvers
        approvers = self.db.query(ApprovalRuleApprover).filter(
            ApprovalRuleApprover.rule_id == rule_id
        ).order_by(ApprovalRuleApprover.sequence_order).all()
        
        # Add approver names
        for approver in approvers:
            approver.approver_name = approver.approver.full_name if approver.approver else None
        
        return ApprovalRuleWithApprovers(
            **rule.__dict__,
            approvers=approvers
        )
    
    def get_rules(self, company_id: int, current_user: User) -> List[ApprovalRuleWithApprovers]:
        """Get all approval rules for a company."""
        # Check permissions
        if current_user.company_id != company_id:
            raise ValueError("Access denied")
        
        rules = self.db.query(ApprovalRule).filter(
            and_(
                ApprovalRule.company_id == company_id,
                ApprovalRule.is_active == True
            )
        ).all()
        
        result = []
        for rule in rules:
            # Get approvers for each rule
            approvers = self.db.query(ApprovalRuleApprover).filter(
                ApprovalRuleApprover.rule_id == rule.id
            ).order_by(ApprovalRuleApprover.sequence_order).all()
            
            # Add approver names
            for approver in approvers:
                approver.approver_name = approver.approver.full_name if approver.approver else None
            
            result.append(ApprovalRuleWithApprovers(
                **rule.__dict__,
                approvers=approvers
            ))
        
        return result
    
    def update_rule(self, rule_id: int, rule_data: ApprovalRuleUpdate, updated_by: User) -> ApprovalRuleWithApprovers:
        """Update approval rule."""
        rule = self.get_rule(rule_id, updated_by)
        
        # Check permissions
        if updated_by.role != UserRole.ADMIN:
            raise ValueError("Only admins can update approval rules")
        
        # Update fields
        update_data = rule_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(rule, field, value)
        
        self.db.commit()
        self.db.refresh(rule)
        
        return self.get_rule_with_approvers(rule_id, updated_by)
    
    def deactivate_rule(self, rule_id: int, deactivated_by: User) -> bool:
        """Deactivate approval rule."""
        rule = self.get_rule(rule_id, deactivated_by)
        
        # Check permissions
        if deactivated_by.role != UserRole.ADMIN:
            raise ValueError("Only admins can deactivate approval rules")
        
        rule.is_active = False
        self.db.commit()
        
        return True
    
    def get_rule_by_expense(self, expense_id: int) -> Optional[ApprovalRule]:
        """Get approval rule for a specific expense."""
        # This would need to be implemented based on your business logic
        # For now, return the first active rule for the company
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return None
        
        return self.db.query(ApprovalRule).filter(
            and_(
                ApprovalRule.company_id == expense.company_id,
                ApprovalRule.is_active == True
            )
        ).first()
