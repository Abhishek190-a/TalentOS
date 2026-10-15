from typing import Literal
from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    project_id: str
    mode: Literal["greedy", "optimized"] = "optimized"
class BriefRequest(BaseModel):
    text: str = Field(min_length=10, max_length=12000)
class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
class WhatIfRequest(BaseModel):
    type: Literal["leave", "new_project"]
    employee_id: str | None = None
    project_id: str | None = None
class RebalanceRequest(BaseModel):
    dry_run: bool = True
class EmployeeCreate(BaseModel):
    id: str
    name: str
    role: str = "Employee"
    years_exp: int = Field(default=0, ge=0)
    capacity_hrs: float = Field(default=40, gt=0)
    assigned_hrs: float = Field(default=0, ge=0)
    skills: dict[str, int] = Field(default_factory=dict)
class EmployeeUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    years_exp: int | None = Field(default=None, ge=0)
    capacity_hrs: float | None = Field(default=None, gt=0)
    assigned_hrs: float | None = Field(default=None, ge=0)
    skills: dict[str, int] | None = None
class ProjectCreate(BaseModel):
    id: str
    name: str
    brief: str = ""
    hours_needed: float = Field(default=40, gt=0)
    team_size: int = Field(default=3, ge=1, le=20)
    required: dict[str, dict] = Field(default_factory=dict)
