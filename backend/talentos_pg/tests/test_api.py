from fastapi.testclient import TestClient
from backend.main import app

def test_health():
    with TestClient(app) as client:
        assert client.get('/health').status_code == 200
        assert len(client.get('/employees').json()) == 40
        assert len(client.get('/projects').json()) == 8
