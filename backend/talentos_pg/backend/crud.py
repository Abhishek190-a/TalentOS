from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.models import Employee, Project, TrainingCourse, RelatedSkill

def employee_dict(row: Employee) -> dict:
    return {"id":row.id,"name":row.name,"role":row.role,"years_exp":row.years_exp,"capacity_hrs":row.capacity_hrs,"assigned_hrs":row.assigned_hrs,"skills":row.skills or {}}
def project_dict(row: Project) -> dict:
    return {"id":row.id,"name":row.name,"brief":row.brief,"hours_needed":row.hours_needed,"team_size":row.team_size,"required":row.required or {}}
def list_employees(db: Session): return [employee_dict(x) for x in db.scalars(select(Employee).order_by(Employee.id)).all()]
def list_projects(db: Session): return [project_dict(x) for x in db.scalars(select(Project).order_by(Project.id)).all()]
def get_employee(db: Session, employee_id: str):
    row=db.get(Employee, employee_id)
    return employee_dict(row) if row else None
def get_project(db: Session, project_id: str):
    row=db.get(Project, project_id)
    return project_dict(row) if row else None
def related_skills(db: Session): return {x.skill:x.related for x in db.scalars(select(RelatedSkill)).all()}
def training_data(db: Session): return [{"skill":x.skill,"course":x.course,"weeks":x.weeks} for x in db.scalars(select(TrainingCourse)).all()]
