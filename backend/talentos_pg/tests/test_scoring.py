from backend.engine.scoring import score_employee

def test_score_is_bounded():
    e={"id":"E1","name":"Test","years_exp":5,"capacity_hrs":40,"assigned_hrs":10,"skills":{"Python":4}}
    p={"hours_needed":40,"team_size":2,"required":{"Python":{"level":4,"weight":1}}}
    result=score_employee(e,p)
    assert 0 <= result["match"] <= 100
    assert set(result["breakdown"]) == {"skill","exp","avail"}
