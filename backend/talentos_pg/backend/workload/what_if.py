from copy import deepcopy
from backend.engine.team_builder import recommend_team

def simulate(payload: dict, employees: list[dict], projects: list[dict], related: dict, training: list[dict]) -> dict:
    before_employees=deepcopy(employees)
    if payload["type"] == "leave":
        employee_id=payload.get("employee_id")
        if not employee_id: raise ValueError("employee_id is required for type='leave'")
        before_team = recommend_team(before_employees,projects,payload.get("project_id") or projects[0]["id"],"optimized",related,training)
        after_employees=[e for e in before_employees if e["id"] != employee_id]
        if len(after_employees)==len(before_employees): raise ValueError(f"Employee '{employee_id}' not found")
        after_team = recommend_team(after_employees,projects,payload.get("project_id") or projects[0]["id"],"optimized",related,training)
    else:
        project_id=payload.get("project_id")
        if not project_id: raise ValueError("project_id is required for type='new_project'")
        before_team = recommend_team(before_employees,projects,project_id,"optimized",related,training)
        # Simulate an urgent project consuming 8 hours from the current best team's free capacity.
        after_employees=deepcopy(before_employees)
        ids={m["id"] for m in before_team["team"]}
        for e in after_employees:
            if e["id"] in ids: e["assigned_hrs"] = float(e.get("assigned_hrs",0))+8
        after_team = recommend_team(after_employees,projects,project_id,"optimized",related,training)
    before_ids={m["id"] for m in before_team["team"]}; after_ids={m["id"] for m in after_team["team"]}
    return {"before_team":before_team["team"],"after_team":after_team["team"],"changes":{"added":sorted(after_ids-before_ids),"removed":sorted(before_ids-after_ids),"unchanged":sorted(before_ids&after_ids)},"note":"Simulation only; source employee/project JSON data was not modified."}
