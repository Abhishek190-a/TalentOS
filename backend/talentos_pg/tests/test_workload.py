from backend.workload.analytics import workload_report, risk_report
from backend.workload.rebalance import rebalance

def test_risk_and_rebalance():
    es=[{"id":"E1","name":"Overloaded","capacity_hrs":40,"assigned_hrs":52,"skills":{"Python":4}}, {"id":"E2","name":"Idle","capacity_hrs":40,"assigned_hrs":10,"skills":{"Python":3}}]
    assert workload_report(es)["employees"][0]["risk"] == "high"
    assert risk_report(es)["burnout"][0]["id"] == "E1"
    result=rebalance(es)
    assert result["impact"]["hours_moved"] > 0
    assert es[0]["assigned_hrs"] == 52  # dry run does not mutate source
