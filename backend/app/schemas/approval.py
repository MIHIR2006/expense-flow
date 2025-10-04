from pydantic import BaseModel
from typing import Literal

class ApprovalCreate(BaseModel):
    expense_id: int
    approver_id: int
    status: Literal["pending", "approved", "rejected"]

class ApprovalResponse(BaseModel):
    id: int
    expense_id: int
    approver_id: int
    status: str

    class Config:
        orm_mode = True
