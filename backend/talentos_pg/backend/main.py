from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from backend.config import CORS_ORIGINS
from backend.database import get_db
from backend.seed import seed_database
from backend.models import Employee, Project
from backend.schemas import RecommendRequest, BriefRequest, ChatRequest, WhatIfRequest, RebalanceRequest, EmployeeCreate, EmployeeUpdate, ProjectCreate
from backend.crud import employee_dict, project_dict, list_employees, list_projects, get_employee, get_project, related_skills, training_data
from backend.engine.team_builder import recommend_team
from backend.workload.analytics import workload_report, risk_report
from backend.workload.rebalance import rebalance
from backend.workload.what_if import simulate
from backend.ai.brief_parser import parse_brief
from backend.ai.chat import answer_chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_database()
    yield

app = FastAPI(title="TalentOS Workforce Intelligence API", version="2.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS or ["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def context(db: Session):
    return list_employees(db), list_projects(db), related_skills(db), training_data(db)

@app.get("/")
def root(): return {"message":"TalentOS API is running", "docs":"/docs", "health":"/health"}

@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {"status":"ok", "database":"connected", "service":"TalentOS API"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database connection failed") from exc

@app.get("/employees")
def employees(db: Session = Depends(get_db)): return list_employees(db)

@app.post("/employees", status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    if any(level < 1 or level > 5 for level in payload.skills.values()): raise HTTPException(422, "Skill proficiency must be between 1 and 5")
    row=Employee(**payload.model_dump())
    db.add(row)
    try: db.commit(); db.refresh(row)
    except IntegrityError as exc: db.rollback(); raise HTTPException(409, "Employee ID already exists") from exc
    return employee_dict(row)

@app.get("/employees/{employee_id}")
def employee_detail(employee_id: str, db: Session = Depends(get_db)):
    result=get_employee(db, employee_id)
    if not result: raise HTTPException(404, "Employee not found")
    return result

@app.patch("/employees/{employee_id}")
def update_employee(employee_id: str, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    row=db.get(Employee, employee_id)
    if not row: raise HTTPException(404, "Employee not found")
    data=payload.model_dump(exclude_unset=True)
    if "skills" in data and data["skills"] is not None and any(v < 1 or v > 5 for v in data["skills"].values()): raise HTTPException(422, "Skill proficiency must be between 1 and 5")
    for key,value in data.items(): setattr(row,key,value)
    db.commit(); db.refresh(row)
    return employee_dict(row)

@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    row=db.get(Employee, employee_id)
    if not row: raise HTTPException(404, "Employee not found")
    db.delete(row); db.commit(); return None

@app.get("/projects")
def projects(db: Session = Depends(get_db)): return list_projects(db)

@app.post("/projects", status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    row=Project(**payload.model_dump()); db.add(row)
    try: db.commit(); db.refresh(row)
    except IntegrityError as exc: db.rollback(); raise HTTPException(409, "Project ID already exists") from exc
    return project_dict(row)

@app.get("/projects/{project_id}")
def project_detail(project_id: str, db: Session = Depends(get_db)):
    result=get_project(db,project_id)
    if not result: raise HTTPException(404,"Project not found")
    return result

@app.post("/team/recommend")
def team_recommend(request: RecommendRequest, db: Session = Depends(get_db)):
    emps,projs,related,training=context(db)
    try: return recommend_team(emps,projs,request.project_id,request.mode,related,training)
    except ValueError as exc: raise HTTPException(404,detail=str(exc)) from exc

@app.get("/workload")
def get_workload(db: Session = Depends(get_db)): return workload_report(list_employees(db))

@app.post("/workload/rebalance")
def rebalance_workload(request: RebalanceRequest, db: Session = Depends(get_db)):
    emps=list_employees(db); result=rebalance(emps,dry_run=True)
    if not request.dry_run:
        updated={x["id"]:x for x in result.pop("updated_employees",[])}
        for row in db.query(Employee).all():
            if row.id in updated: row.assigned_hrs=updated[row.id]["assigned_hrs"]
        db.commit()
    else: result.pop("updated_employees",None)
    return result

@app.get("/risks")
def get_risks(db: Session = Depends(get_db)): return risk_report(list_employees(db))

@app.post("/whatif")
def what_if(request: WhatIfRequest, db: Session = Depends(get_db)):
    emps,projs,related,training=context(db)
    try: return simulate(request.model_dump(exclude_none=True),emps,projs,related,training)
    except ValueError as exc: raise HTTPException(400,detail=str(exc)) from exc

@app.post("/brief-to-team")
async def brief_to_team(request: BriefRequest, db: Session = Depends(get_db)):
    emps,projs,related,training=context(db)
    parsed=await parse_brief(request.text,projs)
    synthetic={"id":"P-BRIEF","name":parsed.get("name","Brief project"),"brief":request.text,"hours_needed":parsed["hours_needed"],"team_size":parsed["team_size"],"required":parsed["required"]}
    try: recommendation=recommend_team(emps,projs+[synthetic],"P-BRIEF","optimized",related,training)
    except ValueError as exc: raise HTTPException(400,str(exc)) from exc
    recommendation["project"]={**synthetic,"source":parsed.get("source","offline_fallback")}
    return recommendation

@app.post("/agent/chat")
async def agent_chat(request: ChatRequest, db: Session = Depends(get_db)):
    emps,projs,_,_=context(db)
    context_data={"employee_count":len(emps),"project_count":len(projs),"workload":workload_report(emps),"risks":risk_report(emps)}
    return await answer_chat(request.message,context_data)
