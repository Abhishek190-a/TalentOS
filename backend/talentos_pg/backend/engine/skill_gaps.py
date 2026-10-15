from typing import Any

def analyze_gaps(project: dict[str, Any], team: list[dict[str, Any]], employees: list[dict[str, Any]], related: dict[str, list[str]], training: list[dict[str, Any]]) -> tuple[dict[str, bool], list[dict[str, Any]]]:
    team_ids = {x["id"] for x in team}
    by_id = {e["id"]: e for e in employees}
    coverage = {}
    gaps = []
    for skill, req in project.get("required", {}).items():
        covered = any(by_id.get(i, {}).get("skills", {}).get(skill, 0) >= req.get("level", 1) for i in team_ids)
        coverage[skill] = covered
        if covered:
            continue
        rel = related.get(skill, [])
        learners = []
        for e in employees:
            if e["id"] in team_ids:
                score = sum(float(e.get("skills", {}).get(s, 0)) for s in rel) / (5 * max(len(rel), 1))
                if score > 0:
                    learners.append({"id": e["id"], "name": e["name"], "score": round(score, 3)})
        learners.sort(key=lambda x: x["score"], reverse=True)
        owners = [e for e in employees if e.get("skills", {}).get(skill, 0) >= req.get("level", 1)]
        if owners:
            mentor = {"id": owners[0]["id"], "name": owners[0]["name"], "type": "skill_owner"}
        else:
            # No exact-skill owner exists: nominate the strongest related-skill colleague as an internal learning mentor.
            mentor_candidates = sorted(employees, key=lambda e: sum(float(e.get("skills", {}).get(s, 0)) for s in rel) / max(len(rel), 1), reverse=True)
            mentor = ({"id": mentor_candidates[0]["id"], "name": mentor_candidates[0]["name"], "type": "related_skill_mentor"} if rel and mentor_candidates else None)
        course = next((t for t in training if t["skill"].lower() == skill.lower()), None)
        gaps.append({"skill": skill, "learners": learners[:3], "mentor": mentor, "course": course["course"] if course else f"Internal learning plan for {skill}", "weeks": course["weeks"] if course else 4})
    return coverage, gaps
