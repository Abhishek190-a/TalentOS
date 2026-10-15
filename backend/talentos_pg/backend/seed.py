import json
from pathlib import Path
from sqlalchemy import select
from backend.database import Base, engine, SessionLocal
from backend.models import Employee, Project, TrainingCourse, RelatedSkill

DATA = Path(__file__).resolve().parent.parent / "data"
def load(name):
    with open(DATA / name, encoding="utf-8") as f: return json.load(f)
def seed_database():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.scalar(select(Employee.id).limit(1)) is None:
            db.add_all([Employee(id=str(x["id"]), name=x["name"], role=x.get("role","Employee"), years_exp=x.get("years_exp",0), capacity_hrs=x.get("capacity_hrs",40), assigned_hrs=x.get("assigned_hrs",0), skills=x.get("skills",{})) for x in load("employees.json")])
        if db.scalar(select(Project.id).limit(1)) is None:
            db.add_all([Project(id=str(x["id"]), name=x["name"], brief=x.get("brief",""), hours_needed=x.get("hours_needed",40), team_size=x.get("team_size",3), required=x.get("required",{})) for x in load("projects.json")])
        if db.scalar(select(TrainingCourse.id).limit(1)) is None:
            db.add_all([TrainingCourse(skill=x["skill"],course=x["course"],weeks=x["weeks"]) for x in load("training.json")])
        if db.scalar(select(RelatedSkill.skill).limit(1)) is None:
            db.add_all([RelatedSkill(skill=k,related=v) for k,v in load("related_skills.json").items()])
        db.commit()
