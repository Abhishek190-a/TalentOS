from backend.engine.team_builder import recommend_team

def test_recommend_team_shape():
    employees=[{"id":"E1","name":"A","years_exp":5,"capacity_hrs":40,"assigned_hrs":5,"skills":{"Python":5}}, {"id":"E2","name":"B","years_exp":3,"capacity_hrs":40,"assigned_hrs":5,"skills":{"SQL":4}}]
    projects=[{"id":"P1","name":"P","hours_needed":40,"team_size":2,"required":{"Python":{"level":3,"weight":0.5},"SQL":{"level":3,"weight":0.5}}}]
    result=recommend_team(employees,projects,"P1","optimized",{},[])
    assert len(result["team"]) == 2
    assert result["coverage"] == {"Python":True,"SQL":True}
