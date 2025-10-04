from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=3, max_length=50)
    date: date
    description: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str]
    user_id: int

    class Config:
        orm_mode = True
