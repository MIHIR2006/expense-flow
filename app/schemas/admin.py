from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class AdminCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    company_name: str = Field(..., min_length=3, max_length=50)
    company_email: EmailStr
    
class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    company_name: str
    company_email: EmailStr

    class Config:
        orm_mode = True

class AdminUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = Field(None)
    company_name: Optional[str] = Field(None, min_length=3, max_length=50)
    company_email: Optional[EmailStr] = Field(None)

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    