"""
Approval Rule management routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..schemas.approval_rule import (
    ApprovalRule, ApprovalRuleCreate, ApprovalRuleUpdate, 
    ApprovalRuleWithApprovers, ApprovalRuleListResponse
)
from ..schemas.common import MessageResponse
from ..services.approval_rule_service import ApprovalRuleService
from ..utils.rbac import get_current_user, require_admin
from ..models.user import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=ApprovalRuleWithApprovers)
async def create_rule(
    rule_data: ApprovalRuleCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a new approval rule (admin only)."""
    try:
        rule_service = ApprovalRuleService(db)
        rule = rule_service.create_rule(rule_data, current_user)
        return rule
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Create rule error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/", response_model=List[ApprovalRuleWithApprovers])
async def get_rules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all approval rules for the company."""
    try:
        rule_service = ApprovalRuleService(db)
        rules = rule_service.get_rules(current_user.company_id, current_user)
        return rules
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        logger.error(f"Get rules error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{rule_id}", response_model=ApprovalRuleWithApprovers)
async def get_rule(
    rule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get approval rule by ID."""
    try:
        rule_service = ApprovalRuleService(db)
        rule = rule_service.get_rule_with_approvers(rule_id, current_user)
        return rule
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Get rule error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/{rule_id}", response_model=ApprovalRuleWithApprovers)
async def update_rule(
    rule_id: int,
    rule_data: ApprovalRuleUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update approval rule (admin only)."""
    try:
        rule_service = ApprovalRuleService(db)
        rule = rule_service.update_rule(rule_id, rule_data, current_user)
        return rule
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Update rule error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{rule_id}", response_model=MessageResponse)
async def deactivate_rule(
    rule_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Deactivate approval rule (admin only)."""
    try:
        rule_service = ApprovalRuleService(db)
        rule_service.deactivate_rule(rule_id, current_user)
        return MessageResponse(message="Approval rule deactivated successfully")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Deactivate rule error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
