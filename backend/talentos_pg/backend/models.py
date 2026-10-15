from sqlalchemy import String, Integer, Float, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON
from backend.database import Base

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(120), default="Employee", nullable=False)
    years_exp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    capacity_hrs: Mapped[float] = mapped_column(Float, default=40, nullable=False)
    assigned_hrs: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    skills: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    brief: Mapped[str] = mapped_column(Text, default="", nullable=False)
    hours_needed: Mapped[float] = mapped_column(Float, default=40, nullable=False)
    team_size: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    required: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

class TrainingCourse(Base):
    __tablename__ = "training_courses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    skill: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    course: Mapped[str] = mapped_column(String(240), nullable=False)
    weeks: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

class RelatedSkill(Base):
    __tablename__ = "related_skills"
    skill: Mapped[str] = mapped_column(String(120), primary_key=True)
    related: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

class LLMCache(Base):
    __tablename__ = "llm_cache"
    cache_key: Mapped[str] = mapped_column(String(64), primary_key=True)
    response: Mapped[dict] = mapped_column(JSON, nullable=False)
