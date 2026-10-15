# TalentOS PostgreSQL backend

## Requirements
- Python 3.11+ recommended
- PostgreSQL 14+
- Groq API key optional (offline fallback remains available)

## Setup (Windows PowerShell)
1. Create a database in PostgreSQL:
   `CREATE DATABASE talentos;`
2. Create and activate the virtual environment:
   `py -m venv .venv`
   `\.venv\Scripts\Activate.ps1`
3. Install packages:
   `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL username/password. Set `LLM_API_KEY` to your Groq key if using LLM features.
5. Start the API from the repository root:
   `uvicorn backend.main:app --reload --port 8000`
6. Open `http://127.0.0.1:8000/docs`.

On first startup, SQLAlchemy creates tables and imports seed data from `data/*.json` into PostgreSQL if the tables are empty. JSON is only the initial seed source; runtime reads/writes use PostgreSQL.

## Endpoints
- `GET /health`, `GET /employees`, `POST /employees`, `GET /employees/{employee_id}`, `PATCH /employees/{employee_id}`, `DELETE /employees/{employee_id}`
- `GET /projects`, `POST /projects`, `GET /projects/{project_id}`
- `POST /team/recommend`, `GET /workload`, `POST /workload/rebalance`, `GET /risks`, `POST /whatif`, `POST /brief-to-team`, `POST /agent/chat`

## Notes
- `/workload/rebalance` defaults to `dry_run: true`. Use `{"dry_run": false}` to persist the new assigned hours.
- Table creation is automatic for the hackathon. For production, add Alembic migrations before schema changes.
- Keep `.env` private and never commit the Groq API key.
