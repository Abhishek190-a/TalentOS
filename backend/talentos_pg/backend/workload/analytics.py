from statistics import pvariance

def utilization(employee: dict) -> float:
    return float(employee.get("assigned_hrs", 0)) / max(float(employee.get("capacity_hrs", 40)), 1.0)

def risk_level(util: float) -> str:
    if util > 1.0: return "high"
    if util > 0.9: return "medium"
    return "low"

def workload_report(employees: list[dict]) -> dict:
    per_emp = {e["id"]: round(utilization(e), 3) for e in employees}
    vals = list(per_emp.values())
    return {"employees": [{"id": e["id"], "name": e["name"], "assigned_hrs": e.get("assigned_hrs", 0), "capacity_hrs": e.get("capacity_hrs", 40), "utilization": per_emp[e["id"]], "risk": risk_level(per_emp[e["id"]])} for e in employees], "variance": round(pvariance(vals) if vals else 0.0, 6), "average_utilization": round(sum(vals)/len(vals), 3) if vals else 0.0}

def risk_report(employees: list[dict]) -> dict:
    owners = {}
    for e in employees:
        for skill, level in e.get("skills", {}).items():
            if level >= 3: owners.setdefault(skill, []).append(e)
    bus_factor = [{"skill": s, "owner": ({"id": xs[0]["id"], "name": xs[0]["name"]} if len(xs)==1 else None), "owner_count": len(xs)} for s,xs in owners.items() if len(xs)<=1]
    burnout = [{"id": e["id"], "name": e["name"], "util": round(utilization(e), 3), "risk": risk_level(utilization(e))} for e in employees if utilization(e)>0.9]
    return {"bus_factor": sorted(bus_factor,key=lambda x:x["skill"]), "burnout": sorted(burnout,key=lambda x:x["util"],reverse=True)}
