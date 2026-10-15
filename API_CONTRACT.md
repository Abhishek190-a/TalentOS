# TalentOS --- API Contract

**Version:** 1.0\
**Purpose:** Shared implementation contract for the six-hour Hack Attack
hackathon.\
**Architecture:** React + Vite + Tailwind + Recharts; Python + FastAPI;
JSON seed data; deterministic core logic; optional LLM for text
extraction and language only.

## 1. Non-negotiable integration rules

1.  `API_CONTRACT.md` is the source of truth. Do not rename fields,
    endpoints, or enum values without agreement from all four people.
2.  The backend must return valid JSON from every endpoint within the
    first hour. The frontend must be able to use mock responses with the
    same schemas before the backend is ready.
3.  Matching, team selection, skill gaps, workload, risks, and what-if
    calculations are deterministic Python. An LLM must never calculate a
    match score or silently change an optimization result.
4.  AI is optional. Network/API/key failure must return a useful
    fallback response, never crash the app.
5.  JSON files are loaded at startup. No database or authentication is
    required.
6.  All API responses use JSON. Errors use
    `{"detail":"Human-readable explanation"}` with an appropriate HTTP
    status.
7.  All IDs are stable strings such as `E001` and `P001`.
8.  The API base URL is `http://localhost:8000`. Frontend dev server is
    `http://localhost:5173`. Enable permissive CORS for local hackathon
    development.
9.  Keep dependencies minimal. Required backend: `fastapi`, `uvicorn`,
    `pydantic`; `pandas` is optional. Prefer Python standard-library
    algorithms for the six-hour build. Do not make SciPy/PuLP mandatory.
10. Dates and persistent state are out of scope. What-if and rebalance
    responses are simulations unless explicitly applied by the UI; the
    original seed data must not be silently mutated.

## 2. Ownership and folder structure

``` text
talentos/
├── API_CONTRACT.md
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
├── data/
│   ├── employees.json
│   ├── projects.json
│   ├── training.json
│   └── related_skills.json
├── backend/
│   ├── main.py                  # Person 1: FastAPI app, data loading, routes
│   ├── schemas.py               # Person 1: request/response validation models
│   ├── engine/
│   │   ├── __init__.py
│   │   └── matching.py          # Person 2: scores, team selection, gaps
│   ├── workload/
│   │   ├── __init__.py
│   │   └── balancing.py         # Person 3: utilization, rebalance, what-if support
│   └── ai/
│       ├── __init__.py
│       └── assistant.py         # Person 3: brief parser, chat, fallbacks
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── styles/
        ├── components/
        └── pages/
```

Ownership: - **Person 1:** `data/*.json`, `backend/main.py`,
`backend/schemas.py`, root setup files. - **Person 2:**
`backend/engine/*`. - **Person 3:** `backend/workload/*`,
`backend/ai/*`. - **Person 4:** everything under `frontend/`; use mock
JSON shaped exactly like this contract until the API is available.

Avoid overlapping edits. Person 1 owns integration and route wiring.
Each owner must expose the exact functions listed in their task prompt
and avoid editing another owner's folder.

## 3. Data schemas

### 3.1 Employee (`data/employees.json`)

The file is a JSON array. Each employee object:

``` json
{
  "id": "E001",
  "name": "Ravi Kumar",
  "role": "Backend Engineer",
  "years_exp": 6,
  "capacity_hrs": 40,
  "assigned_hrs": 52,
  "skills": {
    "Python": 5,
    "AWS": 4,
    "SQL": 3
  }
}
```

Rules: - `id`: unique string. - `years_exp`: non-negative number. -
`capacity_hrs`: positive number, normally 40 hours/week. -
`assigned_hrs`: non-negative number; it may exceed capacity to represent
overload. - `skills`: map of canonical skill name to integer proficiency
from 1 to 5. - A missing skill means proficiency 0; do not add missing
skills to an employee's skill map just to simplify scoring.

### 3.2 Project (`data/projects.json`)

The file is a JSON array. Each project object:

``` json
{
  "id": "P001",
  "name": "Cloud Analytics Platform",
  "brief": "Build a cloud-hosted analytics platform with a Python data pipeline.",
  "hours_needed": 120,
  "team_size": 4,
  "required": {
    "Python": {"level": 4, "weight": 0.4},
    "Cloud Computing": {"level": 3, "weight": 0.3},
    "Data Analytics": {"level": 4, "weight": 0.3}
  }
}
```

Rules: - `hours_needed`: total project hours for the planning period,
not per person. - `team_size`: requested team size, integer 1--5 for
this demo. - Each required skill has `level` from 1 to 5 and `weight`
from 0 to 1. - Weights must sum to 1.0 (allow a small floating-point
tolerance of 0.001). Normalize weights on load if a seed typo occurs,
and log a warning. - Canonical skill names are used in all API
responses.

### 3.3 Training (`data/training.json`)

JSON array:

``` json
[
  {
    "skill": "Data Analytics",
    "course": "Google Data Analytics Professional Certificate",
    "weeks": 4
  },
  {
    "skill": "Kubernetes",
    "course": "Kubernetes Basics — Linux Foundation",
    "weeks": 2
  }
]
```

Every skill gap should receive the matching course when one exists. If
none exists, return `"course": "Internal guided learning plan"` and
`"weeks": 2`.

### 3.4 Related skills (`data/related_skills.json`)

JSON object mapping target skills to skills that help someone learn
them:

``` json
{
  "Data Analytics": ["Pandas", "SQL", "Statistics"],
  "Cloud Computing": ["AWS", "Azure", "Docker"],
  "Kubernetes": ["Docker", "Cloud Computing", "Linux"]
}
```

Related skills are evidence of learnability, not proof that an employee
already possesses the target skill.

## 4. Required seed dataset and planted demo cases

Seed exactly **40 employees** and **8 projects**. Use realistic Indian
names and varied roles (backend/frontend engineers, data analysts, cloud
engineers, QA, DevOps, product analysts). Include a broad mix of skill
levels, not identical profiles. The following cases are mandatory and
must be verified by a seed-data test:

1.  **Overload:** Ravi Kumar has Python level 5 and AWS level at least
    3, `capacity_hrs: 40`, `assigned_hrs: 52` (130% utilization). His
    skills make him a strong match, but his availability score is 0.
2.  **Idle talent:** at least two other employees have
    `assigned_hrs: 12` (30% utilization), capacity 40, and Python level
    at least 3 plus AWS or Cloud Computing level at least 3. They must
    be plausible recipients for work.
3.  **Bus factor:** exactly one employee has Kubernetes proficiency at
    least 3; no other employee may have Kubernetes at level 3 or higher.
4.  **Learnability:** nobody has a `Data Analytics` key in their skills
    map at level 1 or higher. At least three employees have at least two
    of Pandas, SQL, and Statistics, so the learning recommendations have
    real evidence.
5.  **Scenario A project:** one project is named exactly
    `Cloud Analytics Platform` and requires Python, Cloud Computing, and
    Data Analytics with weights summing to 1.0.
6.  **Scenario B:** at least one project requires a skill held by one or
    both idle employees, so the workload view can show an actionable
    transfer.
7.  **Dataset integrity:** all IDs are unique; all projects reference
    valid skills; all employee capacities are positive; every project
    has a team size no greater than 5.

Recommended eight project names: - Cloud Analytics Platform - Customer
Churn Predictor - Payments API Modernization - Inventory Forecasting
System - Kubernetes Deployment Upgrade - Internal HR Analytics - Mobile
App Backend - Security Log Intelligence

Do not rely on random generation for these cases. Store the cases
explicitly in the JSON fixtures so the demo is repeatable.

## 5. Exact formulas and deterministic behavior

### 5.1 Utilization and risk

`utilization = assigned_hrs / capacity_hrs` (ratio, not percent). UI may
display `utilization * 100`.

-   `utilization > 1.0`: risk `"high"`.
-   Else if `utilization > 0.9`: risk `"medium"`.
-   Otherwise: risk `"low"`.
-   `utilization < 0.5`: label as underutilized/idle for dashboard
    purposes.
-   Exactly 100% is not `"high"` under the defined strict comparison; it
    is `"medium"` because it is greater than 0.9.

### 5.2 Candidate match score

For employee `e` and project `p`:

`skill_fit = Σ(weight_s * min(employee_level_s / required_level_s, 1))`

Treat missing employee skill level as 0. Ensure required levels are
positive.

`experience = min(years_exp / 10, 1)`

`hours_per_member = project.hours_needed / project.team_size`

`availability = clamp((capacity_hrs - assigned_hrs) / hours_per_member, 0, 1)`

`match = 100 * (0.55 * skill_fit + 0.15 * experience + 0.30 * availability)`

-   `breakdown.skill`, `breakdown.exp`, and `breakdown.avail` are each
    percentage-point contributions to the final 0--100 match score, not
    raw 0--1 inputs. Their sum equals `match` within rounding tolerance.
-   Round displayed scores to one decimal place; calculate with full
    precision internally.
-   An overloaded employee can still have strong skill fit, but receives
    zero availability contribution.
-   `reason` is a short deterministic explanation,
    e.g. `"Strong Python fit; available for the requested hours."`

### 5.3 Team selection

Both modes return the same response schema.

**Greedy mode:** 1. Score all employees. 2. Choose the highest-match
candidate first. 3. Repeatedly add the candidate who covers the greatest
total weight of currently uncovered required skills; tie-break by higher
match, then stable employee ID. 4. Stop at `team_size` or when no
candidates remain. 5. A selected team may be smaller than requested only
if no eligible candidates remain. Never duplicate an employee.

**Optimized mode:** - Use deterministic bounded exhaustive search over
combinations of eligible employees, team size up to 5. With 40 employees
and team size 4 there are 91,390 combinations, which is reasonable for a
small local demo; cap candidate pool at the top 24 by match before
enumeration if runtime is a concern. - Eligible employees have at least
1 hour of available capacity. Do not select employees with zero
availability unless there are insufficient eligible people; if forced to
fill a seat, mark the person `capacity_constrained: true` in an optional
field. - Rank teams lexicographically: (1) maximum total weighted skill
coverage, (2) maximum sum of match scores, (3) maximum available hours,
(4) stable sorted IDs for deterministic tie-breaking. - Skill coverage
for each required skill is true if at least one selected member has
proficiency `>= 3` for that skill. For overall team coverage score, for
each required skill use the best selected proficiency divided by
required level, capped at 1, multiplied by its weight; sum and multiply
by 100. - Team `total_score` is
`coverage_score + (sum of member match scores / team_size) * 0.01`, a
tie-break-oriented metric. It is not a probability. Return the separate
`coverage_score` so judges can inspect coverage independently. - Do not
claim a globally optimal solution if candidate-pool capping is enabled.
Label the UI comparison `"Best team found"` when capped.

**Comparison card:** - Always compute greedy and optimized results from
the same data and constraints, independent of the requested display
mode. - `compare.greedy_score` and `compare.optimized_score` are the
respective `total_score` values. - The comparison must not be fabricated
or hardcoded.

### 5.4 Skill gaps and learnability

-   `coverage[skill]` is true when at least one selected team member has
    proficiency `>= 3` in that required skill.
-   A gap is each required skill with `coverage[skill] == false`.
-   Candidate learner score: average proficiency across the target
    skill's related skills, treating absent related skills as 0, divided
    by 5; return 0--1.
-   If the target skill has no related-skill list, score 0 for all
    employees.
-   Return the top three learners with score \> 0, sorted by descending
    score then employee ID.
-   `mentor`: employee name of the highest-proficiency employee with the
    target skill at level \>= 3, or `null` if nobody has the skill. For
    the planted Data Analytics case, mentor must be `null`; explain that
    no internal mentor currently owns the skill.
-   Course and weeks come from `training.json`; use the default course
    if no record exists.
-   Do not claim the employee already has the target skill merely
    because related skills are present.

### 5.5 Bus factor

For every canonical skill found in any employee skill map, count
employees with proficiency \>= 3. Return skills with count \<= 1.
`owner` is the sole qualifying employee's name or `null` if there are
zero owners. The planted Kubernetes skill must have exactly one owner.

### 5.6 Workload rebalance

-   `variance` is population variance of utilization ratios across all
    40 employees: mean of squared differences from the mean. Use the
    same formula before and after.
-   A move `{from,to,hours,skill}` transfers workload hours from an
    overloaded or higher-utilization employee to a lower-utilization
    employee who has the required skill at proficiency \>= 3.
-   Never move more than the source's assigned hours above its capacity
    when prioritizing overload relief; never increase recipient assigned
    hours above capacity.
-   If there is no project-specific required skill for a generic
    balancing move, the receiver must share at least one skill at
    proficiency \>= 3 with the source; return that skill in the move.
-   Use small deterministic increments (1-hour steps are acceptable) and
    choose the valid move that most reduces utilization variance. Stop
    when no valid move improves variance or after 100 moves.
-   Return simulated `before` and `after`; do not mutate seed data on
    the server.
-   `variance_drop_pct = 100 * (before_variance - after_variance) / before_variance`,
    or 0 when before variance is 0. Clamp displayed impact to 0--100; if
    variance rises, do not report a positive improvement.
-   `hours_moved` is the sum of transfer hours, counting each
    transferred hour once.

### 5.7 What-if simulation

-   `leave`: temporarily exclude `employee_id` from candidate selection;
    return before and after teams for the specified project.
-   `new_project`: use `project_id` as the urgent project; calculate a
    team for it and return the difference against the currently selected
    baseline project team if the request includes a baseline project ID.
    If no baseline is supplied, compare against the first existing
    project team and state that baseline in `changes`.
-   Never mutate the original employees or projects.
-   Return explicit additions/removals and a short explanation of the
    trade-off.

## 6. API conventions

-   Base URL: `http://localhost:8000`.
-   `Content-Type: application/json` for POST requests.
-   IDs are strings.
-   Return `200` for successful GET/POST operations.
-   Unknown employee/project IDs return
    `404 {"detail":"Employee not found: E999"}` or
    `404 {"detail":"Project not found: P999"}`.
-   Invalid request body returns FastAPI/Pydantic `422`.
-   For unexpected internal errors, return
    `500 {"detail":"Internal server error"}`; log the full exception
    server-side.
-   Scores are numeric JSON values, not strings.
-   Use `null` for an unknown mentor, not `"None"` or `"N/A"`.

## 7. API endpoint contract

### 7.1 `GET /employees`

Returns all 40 employees. The API exposes the seed fields without
renaming them.

**Example response (abbreviated to two records for readability; real
response contains all 40):**

``` json
[
  {
    "id": "E001",
    "name": "Ravi Kumar",
    "role": "Backend Engineer",
    "years_exp": 6,
    "capacity_hrs": 40,
    "assigned_hrs": 52,
    "skills": {"Python": 5, "AWS": 4, "SQL": 3}
  },
  {
    "id": "E002",
    "name": "Ananya Rao",
    "role": "Cloud Engineer",
    "years_exp": 4,
    "capacity_hrs": 40,
    "assigned_hrs": 12,
    "skills": {"Python": 3, "AWS": 4, "Docker": 3}
  }
]
```

### 7.2 `GET /projects`

Returns all eight projects in the project schema from section 3.2.

**Example response (one record shown; real response contains all
eight):**

``` json
[
  {
    "id": "P001",
    "name": "Cloud Analytics Platform",
    "brief": "Build a cloud-hosted analytics platform with a Python data pipeline.",
    "hours_needed": 120,
    "team_size": 4,
    "required": {
      "Python": {"level": 4, "weight": 0.4},
      "Cloud Computing": {"level": 3, "weight": 0.3},
      "Data Analytics": {"level": 4, "weight": 0.3}
    }
  }
]
```

### 7.3 `POST /team/recommend`

Request:

``` json
{"project_id":"P001","mode":"optimized"}
```

`mode` must be `"greedy"` or `"optimized"`.

Response:

``` json
{
  "project_id": "P001",
  "mode": "optimized",
  "team": [
    {
      "id": "E002",
      "name": "Ananya Rao",
      "match": 78.4,
      "breakdown": {"skill": 44.0, "exp": 6.0, "avail": 28.4},
      "reason": "Strong Python and cloud fit; enough capacity for the requested hours."
    },
    {
      "id": "E003",
      "name": "Arjun Nair",
      "match": 65.2,
      "breakdown": {"skill": 38.5, "exp": 4.5, "avail": 22.2},
      "reason": "Adds complementary cloud skills and has available capacity."
    }
  ],
  "coverage": {
    "Python": true,
    "Cloud Computing": true,
    "Data Analytics": false
  },
  "coverage_score": 70.0,
  "total_score": 70.7,
  "gaps": [
    {
      "skill": "Data Analytics",
      "learners": [
        {"id": "E014", "name": "Meera Shah", "score": 0.8},
        {"id": "E019", "name": "Karan Patel", "score": 0.73}
      ],
      "mentor": null,
      "course": "Google Data Analytics Professional Certificate",
      "weeks": 4
    }
  ],
  "compare": {"greedy_score": 69.8, "optimized_score": 70.7},
  "requested_team_size": 4,
  "actual_team_size": 2,
  "warnings": ["Example response only: values and team size are illustrative; runtime results are calculated from the loaded seed data."]
}
```

Implementation requirements: - Real response must contain the calculated
team and actual team size. The numeric values above are schema examples
only; do not hardcode them. - Include one team member object per
selected employee, never duplicate IDs. - Return a warning if the
requested team size could not be filled. - `compare` is computed on
every call, regardless of `mode`.

### 7.4 `GET /workload`

Response:

``` json
{
  "employees": [
    {"id": "E001", "name": "Ravi Kumar", "utilization": 1.3, "risk": "high"},
    {"id": "E002", "name": "Ananya Rao", "utilization": 0.3, "risk": "low"}
  ],
  "variance": 0.0412,
  "average_utilization": 0.72,
  "overloaded_count": 1,
  "idle_count": 2
}
```

The example is abbreviated; return all 40 employees. `utilization` is a
ratio such as `1.3`, not `130`. Counts and variance must be calculated
from current seed data.

### 7.5 `POST /workload/rebalance`

Request:

``` json
{}
```

No request fields are required. Optional future extension:
`{"max_moves":100}`; default is 100.

Response:

``` json
{
  "moves": [
    {"from": "E001", "to": "E002", "hours": 8, "skill": "Python"}
  ],
  "before": {
    "variance": 0.0412,
    "per_emp": [
      {"id": "E001", "name": "Ravi Kumar", "assigned_hrs": 52, "utilization": 1.3},
      {"id": "E002", "name": "Ananya Rao", "assigned_hrs": 12, "utilization": 0.3}
    ]
  },
  "after": {
    "variance": 0.028,
    "per_emp": [
      {"id": "E001", "name": "Ravi Kumar", "assigned_hrs": 44, "utilization": 1.1},
      {"id": "E002", "name": "Ananya Rao", "assigned_hrs": 20, "utilization": 0.5}
    ]
  },
  "impact": {"variance_drop_pct": 32.0, "hours_moved": 8},
  "warnings": []
}
```

`per_emp` contains all employees in the real response. Values above
illustrate shape only. A move must be feasible under section 5.6. If no
valid moves exist, return empty `moves`, identical before/after
snapshots, and zero impact.

### 7.6 `GET /risks`

Response:

``` json
{
  "bus_factor": [
    {"skill": "Kubernetes", "owner": "Priya Menon", "owner_id": "E027", "qualified_employee_count": 1}
  ],
  "burnout": [
    {"id": "E001", "name": "Ravi Kumar", "util": 1.3, "risk": "high"},
    {"id": "E009", "name": "Ishaan Das", "util": 0.95, "risk": "medium"}
  ]
}
```

-   Include all skills with at most one qualified employee in
    `bus_factor`, including zero-owner skills if a skill is known to the
    system through project requirements or related-skill metadata.
-   `burnout` includes only employees with medium or high risk.
-   For zero owners, `owner` and `owner_id` are `null`, and
    `qualified_employee_count` is `0`.

### 7.7 `POST /whatif`

Leave request:

``` json
{"type":"leave","employee_id":"E002","project_id":"P001"}
```

New urgent project request:

``` json
{"type":"new_project","project_id":"P002","baseline_project_id":"P001"}
```

Response:

``` json
{
  "type": "leave",
  "scenario": "Ananya Rao is unavailable for Cloud Analytics Platform.",
  "before_team": [
    {"id":"E002","name":"Ananya Rao","match":78.4},
    {"id":"E003","name":"Arjun Nair","match":65.2}
  ],
  "after_team": [
    {"id":"E004","name":"Diya Iyer","match":72.1},
    {"id":"E003","name":"Arjun Nair","match":65.2}
  ],
  "changes": [
    {"action":"removed","id":"E002","name":"Ananya Rao","reason":"Simulated leave."},
    {"action":"added","id":"E004","name":"Diya Iyer","reason":"Best feasible replacement under current constraints."}
  ],
  "coverage_before": {"Python":true,"Cloud Computing":true,"Data Analytics":false},
  "coverage_after": {"Python":true,"Cloud Computing":true,"Data Analytics":false},
  "warnings": []
}
```

Team arrays are abbreviated for illustration. Real response uses
calculated data. Validate `type`; `leave` requires `employee_id` and
`project_id`. `new_project` requires `project_id`; `baseline_project_id`
is optional. Unknown IDs return 404. Exclude the employee only from the
simulated scenario; never alter seed data.

### 7.8 `POST /brief-to-team`

Request:

``` json
{
  "text": "We need a cloud analytics platform. Use Python for data pipelines, cloud deployment, and analytics. Four people, about 120 hours. Python should be strong; cloud and analytics are important."
}
```

Response:

``` json
{
  "source": "rules",
  "extracted": {
    "name": "Brief-created project",
    "hours_needed": 120,
    "team_size": 4,
    "required": {
      "Python": {"level": 4, "weight": 0.4},
      "Cloud Computing": {"level": 3, "weight": 0.3},
      "Data Analytics": {"level": 3, "weight": 0.3}
    }
  },
  "team": [
    {
      "id": "E002",
      "name": "Ananya Rao",
      "match": 78.4,
      "breakdown": {"skill": 44.0, "exp": 6.0, "avail": 28.4},
      "reason": "Strong Python and cloud fit; enough capacity for the requested hours."
    }
  ],
  "coverage": {"Python":true,"Cloud Computing":true,"Data Analytics":false},
  "coverage_score": 70.0,
  "total_score": 70.7,
  "gaps": [
    {
      "skill":"Data Analytics",
      "learners":[{"id":"E014","name":"Meera Shah","score":0.8}],
      "mentor":null,
      "course":"Google Data Analytics Professional Certificate",
      "weeks":4
    }
  ],
  "compare": {"greedy_score":69.8,"optimized_score":70.7},
  "warnings": []
}
```

The response example is abbreviated; real values are calculated.
`source` is `"llm"` only if a valid LLM response was received and
schema-validated; otherwise `"rules"`. A rules fallback is mandatory.
Recognize aliases such as `AWS`, `Azure`, `Docker`, `cloud`, `Python`,
`Pandas`, `SQL`, `statistics`, `analytics`, `Kubernetes`, and
`JavaScript`. If no skill is detected, return
`422 {"detail":"No recognizable skills found in brief"}` with the UI
asking the user to add technologies or select a project. Clamp hours to
8--400 and team size to 1--5. Normalize extracted weights to sum to 1.

### 7.9 `POST /agent/chat`

Request:

``` json
{"message":"Why is Ravi a burnout risk, and who could take some Python work?"}
```

Response:

``` json
{
  "answer": "Ravi is at 130% utilization (52 assigned hours against 40 capacity), so he is in the high-risk band. An underutilized employee with Python level 3 or higher and spare capacity is a safer transfer candidate; check the Workload page for the proposed skill-compatible moves.",
  "source": "rules",
  "suggested_actions": [
    {"label":"Open workload rebalance","action":"navigate","target":"/workload"},
    {"label":"View workforce risks","action":"navigate","target":"/risks"}
  ]
}
```

`source` is `"llm"` or `"rules"`. Never return fabricated live
calculations. The rules fallback must answer basic questions about team
recommendations, skill gaps, bus factor, burnout, workload, and training
using loaded JSON/calculated metrics. For unknown questions, say what
the app can answer and point to a relevant page. Do not expose secrets,
`.env` values, or stack traces.

## 8. Environment and run commands

### Backend

`requirements.txt` minimum:

``` text
fastapi
uvicorn[standard]
pydantic
python-dotenv
```

Optional only if already installed and working: `httpx` for LLM calls,
`pandas` for display calculations. Core routes must not require an LLM
or an optimization package.

Run from repository root:

``` bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

If package imports require it, add empty `__init__.py` files in
`backend/`, `backend/engine/`, `backend/workload/`, and `backend/ai/`.

### Frontend

Create the Vite app in `/frontend`. Required packages: `react`,
`react-dom`, `axios` (or `fetch`), `recharts`, `lucide-react`; Tailwind
may be used if configured quickly, but do not block the UI on elaborate
styling setup.

Run:

``` bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Use `VITE_API_BASE_URL=http://localhost:8000` in `frontend/.env.local`
if desired. Never put an LLM secret in any `VITE_` variable because Vite
variables are browser-visible.

### `.env.example`

``` text
LLM_API_KEY=
LLM_MODEL=
```

No real API key is required for the core demo. Never commit `.env`.

## 9. Minimum acceptance tests

Run these before integration freeze:

1.  `GET /employees` returns HTTP 200 and exactly 40 employees.
2.  `GET /projects` returns HTTP 200 and exactly 8 projects.
3.  `POST /team/recommend` for `P001` returns a non-empty team, all
    requested skills in `coverage`, a `gaps` list, and both comparison
    scores.
4.  Every team member's breakdown values sum to `match` within 0.2
    points.
5.  `GET /workload` contains Ravi at utilization 1.3 and at least two
    employees at 0.3.
6.  `GET /risks` contains Kubernetes with one qualified owner and Ravi
    with high burnout risk.
7.  `POST /workload/rebalance` never causes a recipient to exceed 1.0
    utilization and reports non-negative variance reduction or zero when
    no feasible move exists.
8.  `POST /whatif` with leave changes the candidate pool and does not
    mutate subsequent `GET /employees`.
9.  `POST /brief-to-team` succeeds without an API key and returns
    `source: "rules"` for a recognized brief.
10. `POST /agent/chat` succeeds without an API key.
11. Invalid project IDs return 404; invalid request types return 422.
12. The frontend displays an error/empty state if the API is unavailable
    and does not render a blank page.

Example smoke tests:

``` bash
curl http://localhost:8000/employees
curl http://localhost:8000/projects
curl -X POST http://localhost:8000/team/recommend -H "Content-Type: application/json" -d "{\"project_id\":\"P001\",\"mode\":\"optimized\"}"
curl http://localhost:8000/workload
curl http://localhost:8000/risks
curl -X POST http://localhost:8000/workload/rebalance -H "Content-Type: application/json" -d "{}"
curl -X POST http://localhost:8000/whatif -H "Content-Type: application/json" -d "{\"type\":\"leave\",\"employee_id\":\"E002\",\"project_id\":\"P001\"}"
curl -X POST http://localhost:8000/brief-to-team -H "Content-Type: application/json" -d "{\"text\":\"Build a Python cloud analytics platform with Pandas and SQL, four people, 120 hours\"}"
curl -X POST http://localhost:8000/agent/chat -H "Content-Type: application/json" -d "{\"message\":\"Who is overloaded?\"}"
```

## 10. Frontend expectations

Six pages/views: 1. **Dashboard:** total employees, average utilization,
medium/high burnout count, uncovered skill count, impact summary. 2.
**Team Builder:** choose project or paste brief; Greedy/Optimized
toggle; score breakdown; deterministic reason; skill coverage; gaps with
learner/course/mentor; actual greedy-vs-optimized comparison. 3.
**Workload:** all employee utilization bars; overloaded red, balanced
green, underutilized blue; rebalance action; before/after variance;
transfer list. 4. **Risks:** bus-factor list and medium/high burnout
list. 5. **What-if:** leave or urgent-project scenario with before/after
teams and explicit additions/removals. 6. **Chat:** optional assistant
panel; never required for the primary workflow.

UI requirements: - Consistent spacing and typography, responsive cards,
clear labels, readable projector contrast. - Display ratios as
percentages in UI (`1.3` → `130%`). - Loading states, empty states, and
visible API error messages. - Do not show fake loading animations that
hide slow endpoints. - Do not display example numbers from this contract
as live results. - If a backend call fails, show a retry action and a
clear message.

## 11. Six-hour delivery order

-   **0:00--0:30:** create repo, install dependencies, commit contract
    and seed JSON skeleton; ensure all four owners can run their part.
-   **0:30--1:30:** backend routes return schema-correct data; frontend
    uses matching mocks; engine and workload functions developed in
    parallel.
-   **1:30--2:30:** connect project dropdown → recommendation → gaps;
    connect workload chart and risks.
-   **2:30--3:30:** integration freeze for names/schemas; test all nine
    endpoints; fix imports and CORS before adding polish.
-   **3:30--4:30:** add brief parser, chat fallback, what-if and
    rebalance comparison.
-   **4:30--5:15:** polish visuals, validate planted cases, fix
    demo-breaking bugs. **Code freeze at 5:15.**
-   **5:15--6:00:** rehearse the same demo three times, prepare
    screenshots/recording backup, and avoid risky new features.

## 12. Demo narrative and claims discipline

Demonstrate this sequence: 1. Open the dashboard: show overload, idle
capacity, and risk indicators. 2. Select `Cloud Analytics Platform`:
show match breakdowns, complementary team selection, uncovered Data
Analytics, learnability and training. 3. Toggle Greedy vs Optimized:
explain the measured coverage/score difference, even if both methods
happen to tie on a particular run. 4. Open Workload: show a
skill-compatible proposed transfer and before/after variance. 5. Run the
leave what-if: show the replacement and any coverage trade-off. 6. Paste
a brief: show extracted requirements; if the LLM is unavailable, visibly
label the deterministic fallback.

Do not claim a machine-learning prediction, guaranteed burnout
prevention, globally optimal solution when candidate capping is enabled,
or real HR-system integration. Describe results as deterministic
decision support based on the supplied sample workforce. Practical
impact percentages are calculated from the simulated seed data, not
measured production outcomes.
