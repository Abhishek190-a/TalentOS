from copy import deepcopy
from statistics import pvariance
from backend.workload.analytics import utilization, workload_report

def rebalance(employees: list[dict], dry_run: bool = True) -> dict:
    working = deepcopy(employees)
    before_report = workload_report(working)
    moves = []
    # Shift hours from >100% employees to <80% employees only when the receiver has a required skill.
    skill_owners = {}
    for e in working:
        for s, level in e.get("skills", {}).items():
            if level >= 2: skill_owners.setdefault(s, set()).add(e["id"])
    for source in sorted(working, key=utilization, reverse=True):
        while utilization(source) > 1.0 and float(source.get("assigned_hrs",0)) > 0:
            candidates=[]
            for target in working:
                if target["id"] == source["id"] or utilization(target) >= 0.8: continue
                common = sorted(s for s,l in source.get("skills",{}).items() if l>=2 and target.get("skills",{}).get(s,0)>=2)
                if common: candidates.append((target,common[0]))
            if not candidates: break
            target, skill = min(candidates,key=lambda pair: utilization(pair[0]))
            hours = min(4.0, float(source.get("assigned_hrs",0)), max(0.0, float(target.get("capacity_hrs",40))*0.8-float(target.get("assigned_hrs",0))))
            if hours <= 0: break
            source["assigned_hrs"] = round(float(source.get("assigned_hrs",0))-hours,2)
            target["assigned_hrs"] = round(float(target.get("assigned_hrs",0))+hours,2)
            moves.append({"from":{"id":source["id"],"name":source["name"]},"to":{"id":target["id"],"name":target["name"]},"hours":hours,"skill":skill})
    after_report=workload_report(working)
    before=before_report["variance"]; after=after_report["variance"]
    drop=((before-after)/before*100) if before else 0.0
    if not dry_run:
        for old,new in zip(employees,working): old["assigned_hrs"]=new["assigned_hrs"]
    return {"moves":moves,"before":{"variance":before,"per_emp":{e["id"]:round(utilization(e),3) for e in employees}},"after":{"variance":after,"per_emp":{e["id"]:round(utilization(e),3) for e in working}},"impact":{"variance_drop_pct":round(drop,2),"hours_moved":round(sum(m["hours"] for m in moves),2),"overloaded_before":sum(utilization(e)>1 for e in employees),"overloaded_after":sum(utilization(e)>1 for e in working)},"updated_employees":working}
