from itertools import combinations
from typing import Any
from backend.engine.scoring import score_employee
from backend.engine.skill_gaps import analyze_gaps

def _team_score(team: list[dict[str, Any]], project: dict[str, Any]) -> float:
    required = project.get("required", {})
    employee_by_id = {e["id"]: e for e in team}
    coverage = sum(1 for skill, req in required.items() if any(e.get("skills", {}).get(skill, 0) >= req.get("level", 1) for e in employee_by_id.values()))
    coverage_ratio = coverage / max(len(required), 1)
    avg_match = sum(score_employee(e, project)["match"] for e in team) / max(len(team), 1)
    return round(coverage_ratio * 100 + avg_match, 2)

def greedy_team(employees: list[dict[str, Any]], project: dict[str, Any]) -> list[dict[str, Any]]:
    size = min(max(int(project.get("team_size", 1)), 1), len(employees))
    ranked = sorted(employees, key=lambda e: score_employee(e, project)["match"], reverse=True)
    chosen = [ranked.pop(0)] if ranked else []
    while ranked and len(chosen) < size:
        required = project.get("required", {})
        covered = {s for s, r in required.items() if any(e.get("skills", {}).get(s, 0) >= r.get("level", 1) for e in chosen)}
        def value(e):
            new_cover = sum(1 for s, r in required.items() if s not in covered and e.get("skills", {}).get(s, 0) >= r.get("level", 1))
            return (new_cover, score_employee(e, project)["match"])
        best = max(ranked, key=value)
        chosen.append(best); ranked.remove(best)
    return chosen

def optimized_team(employees: list[dict[str, Any]], project: dict[str, Any]) -> list[dict[str, Any]]:
    size = min(max(int(project.get("team_size", 1)), 1), len(employees))
    # Exhaustive search is practical for the seeded 40-person demo and team sizes <= 4.
    # Cap candidates to top 18 by individual score to bound worst-case runtime.
    candidates = sorted(employees, key=lambda e: score_employee(e, project)["match"], reverse=True)[:18]
    if size >= 5:
        candidates = candidates[:14]
    best_team, best_score = None, float("-inf")
    for combo in combinations(candidates, size):
        # Do not select people with no remaining hours unless necessary.
        viable = [e for e in combo if float(e.get("capacity_hrs", 40))-float(e.get("assigned_hrs", 0)) > 0]
        if len(viable) < size:
            continue
        score = _team_score(list(combo), project)
        if score > best_score:
            best_team, best_score = list(combo), score
    return best_team or greedy_team(employees, project)

def recommend_team(employees: list[dict[str, Any]], projects: list[dict[str, Any]], project_id: str, mode: str, related: dict[str, list[str]], training: list[dict[str, Any]]) -> dict[str, Any]:
    project = next((p for p in projects if p["id"] == project_id), None)
    if not project:
        raise ValueError(f"Project '{project_id}' not found")
    greedy = greedy_team(employees, project)
    optimized = optimized_team(employees, project)
    selected = greedy if mode == "greedy" else optimized
    ranked = [score_employee(e, project) for e in selected]
    coverage, gaps = analyze_gaps(project, selected, employees, related, training)
    return {"project": {"id": project["id"], "name": project["name"]}, "team": ranked, "coverage": coverage, "gaps": gaps, "compare": {"greedy_score": _team_score(greedy, project), "optimized_score": _team_score(optimized, project), "greedy_team_ids": [e["id"] for e in greedy], "optimized_team_ids": [e["id"] for e in optimized]}}
