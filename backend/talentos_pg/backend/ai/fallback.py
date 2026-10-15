import re

def parse_brief_fallback(text: str, projects: list[dict]) -> dict:
    known = sorted({s for p in projects for s in p.get("required", {})}, key=len, reverse=True)
    lower=text.lower()
    required={}
    aliases={"cloud":"Cloud Computing","analytics":"Data Analytics","data analysis":"Data Analytics","data analytics":"Data Analytics","aws":"AWS","python":"Python","pandas":"Pandas","sql":"SQL","react":"React","javascript":"JavaScript","docker":"Docker","kubernetes":"Kubernetes","statistics":"Statistics","fastapi":"FastAPI"}
    for token,skill in aliases.items():
        if token in lower:
            required.setdefault(skill,{"level":3,"weight":1})
    if not required:
        required={"Python":{"level":3,"weight":0.5},"SQL":{"level":3,"weight":0.5}}
    # Normalize weights, with a little extra weight for terms mentioned more than once.
    total=sum(v["weight"] for v in required.values())
    for v in required.values(): v["weight"]=round(v["weight"]/total,3)
    m=re.search(r"team\s*(?:size|of)\s*(\d+)",lower)
    team_size=max(1,min(int(m.group(1)),8)) if m else 4
    h=re.search(r"(\d+)\s*hours?",lower)
    hours=max(8,min(int(h.group(1)),1000)) if h else 120
    return {"name":"Brief project","brief":text,"hours_needed":hours,"team_size":team_size,"required":required,"source":"offline_fallback"}

def fallback_chat(message: str) -> str:
    m=message.lower()
    if "burnout" in m or "overload" in m: return "Open Risks or Workload to inspect utilization. TalentOS flags utilization above 90% as medium risk and above 100% as high risk; use Rebalance to preview suggested hour transfers."
    if "skill gap" in m or "training" in m: return "Use Team Builder to inspect uncovered required skills. TalentOS ranks learners by related-skill proficiency and suggests a course from the local training catalogue."
    if "bus factor" in m or "single" in m: return "The bus-factor panel flags skills held by at most one employee at proficiency level 3 or higher. Cross-train a second owner for critical skills."
    if "team" in m or "match" in m: return "Choose a project in Team Builder and compare Greedy with Optimized selection. Each recommended member includes skill, experience and availability breakdowns."
    return "I can explain team matching, skill gaps, workload balancing, burnout risk, bus factor and what-if scenarios. The deterministic backend remains available even when the LLM is offline."
