# TalentOS API contract (PostgreSQL version)

Base URL: `http://127.0.0.1:8000`. Interactive docs: `/docs`.

## Data model
- `employees`: id, name, role, years_exp, capacity_hrs, assigned_hrs, skills (JSON mapping skill names to proficiency 1-5).
- `projects`: id, name, brief, hours_needed, team_size, required (JSON mapping skills to `{level, weight}`).
- `training_courses`: skill, course, weeks.
- `related_skills`: skill and JSON list of related skills.
- `llm_cache`: cache key and JSON response (reserved for persistent cache integration).

PostgreSQL is the runtime data source. `data/*.json` files are only used to seed an empty database on first startup.

## Endpoints
- `GET /health`: database connection check.
- `GET /employees`: list employees.
- `POST /employees`: create employee; JSON example: `{"id":"E999","name":"Asha Rao","role":"Backend Developer","years_exp":2,"capacity_hrs":40,"assigned_hrs":12,"skills":{"Python":4,"SQL":3}}`.
- `GET /employees/{employee_id}`: employee detail.
- `PATCH /employees/{employee_id}`: partial update; example `{"assigned_hrs":20}`.
- `DELETE /employees/{employee_id}`: delete employee.
- `GET /projects`: list projects.
- `POST /projects`: create project; example `{"id":"P999","name":"Internal API","brief":"Build an API","hours_needed":80,"team_size":3,"required":{"Python":{"level":4,"weight":0.6},"Cloud Computing":{"level":3,"weight":0.4}}}`.
- `GET /projects/{project_id}`: project detail.
- `POST /team/recommend`: `{"project_id":"P001","mode":"optimized"}`. Mode is `greedy` or `optimized`.
- `GET /workload`: utilization and variance.
- `POST /workload/rebalance`: `{"dry_run":true}` preview; set false to persist assigned-hour changes.
- `GET /risks`: bus-factor and burnout risk.
- `POST /whatif`: employee leave example `{"type":"leave","employee_id":"E001","project_id":"P001"}`; urgent-project simulation example `{"type":"new_project","project_id":"P001"}`.
- `POST /brief-to-team`: `{"text":"Build a cloud analytics platform using Python, AWS and SQL. Need 4 engineers for 120 hours."}`.
- `POST /agent/chat`: `{"message":"Who is overloaded and what skills are missing?"}`.

## Matching formulas
- skill fit is the weighted normalized proficiency across required skills.
- experience = `min(years_exp / 10, 1)`.
- availability = clamped free hours divided by required hours per team member.
- match score = `100 * (0.55 * skill_fit + 0.15 * experience + 0.30 * availability)`.
- utilization = `assigned_hrs / capacity_hrs`; burnout risk is high above 100%, medium above 90%.
