from typing import Any

def score_employee(employee: dict[str, Any], project: dict[str, Any]) -> dict[str, Any]:
    required = project.get("required", {})
    if not required:
        skill_fit = 0.0
    else:
        weights_sum = sum(float(v.get("weight", 1 / len(required))) for v in required.values()) or 1.0
        skill_fit = sum(float(req.get("weight", 1 / len(required))) * min(float(employee.get("skills", {}).get(skill, 0)) / max(float(req.get("level", 1)), 1), 1.0) for skill, req in required.items()) / weights_sum
    experience = min(float(employee.get("years_exp", 0)) / 10.0, 1.0)
    capacity = max(float(employee.get("capacity_hrs", 40)), 1.0)
    needed_per_person = float(project.get("hours_needed", 0)) / max(int(project.get("team_size", 1)), 1)
    free_hours = capacity - float(employee.get("assigned_hrs", 0))
    availability = max(0.0, min(free_hours / needed_per_person, 1.0)) if needed_per_person > 0 else 1.0
    breakdown = {"skill": round(skill_fit * 100, 2), "exp": round(experience * 100, 2), "avail": round(availability * 100, 2)}
    match = 100 * (0.55 * skill_fit + 0.15 * experience + 0.30 * availability)
    return {"id": employee["id"], "name": employee["name"], "role": employee.get("role", ""), "match": round(match, 2), "breakdown": breakdown, "reason": _reason(employee, project, breakdown), "free_hours": round(free_hours, 2), "assigned_hrs": employee.get("assigned_hrs", 0), "capacity_hrs": employee.get("capacity_hrs", 40), "skills": employee.get("skills", {})}

def _reason(employee: dict[str, Any], project: dict[str, Any], b: dict[str, float]) -> str:
    matched = [s for s, req in project.get("required", {}).items() if employee.get("skills", {}).get(s, 0) >= req.get("level", 1)]
    skill_text = ", ".join(matched[:3]) if matched else "transferable skills"
    return f"Strongest evidence: {skill_text}; skill fit {b['skill']:.0f}%, experience {b['exp']:.0f}%, availability {b['avail']:.0f}%."
