from backend.workload.analytics import risk_report

def test_single_owner_bus_factor():
    report=risk_report([{"id":"E1","name":"One","capacity_hrs":40,"assigned_hrs":10,"skills":{"Kubernetes":4}}, {"id":"E2","name":"Two","capacity_hrs":40,"assigned_hrs":10,"skills":{"Python":3}}])
    assert any(x["skill"] == "Kubernetes" and x["owner"]["id"] == "E1" for x in report["bus_factor"])
