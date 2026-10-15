# TalentOS — API Integration Specification & Extension Contract

**Version:** 2.0 (Proposed)  
**Status:** PROPOSED — Pending Backend Implementation  
**Base URL:** `http://localhost:8000`  
**Governing Standard:** Extends root `API_CONTRACT.md` without modifying existing endpoints.

---

## 1. Overview & Purpose

This document specifies the proposed backend API endpoints required to support enterprise **Hiring Management** and advanced **Contingency Planning** in TalentOS.

All endpoints documented here are currently **PROPOSED**. The frontend maintains deterministic offline state and fallback fixtures until these routes are implemented and validated in `backend/main.py`.

---

## 2. Hiring Management Endpoints

### 2.1 `GET /hiring/requests`
Retrieves all hiring requisitions.

**Status:** `[PROPOSED]`  
**HTTP Method:** `GET`  
**Path:** `/hiring/requests`  
**Query Parameters (Optional):**
- `status`: Filter by status (`draft`, `open`, `in_review`, `filled`, `cancelled`)
- `priority`: Filter by priority (`low`, `medium`, `high`, `urgent`)
- `project_id`: Filter by associated project ID (e.g. `P001`)

**Response Schema (`200 OK`):**
```json
[
  {
    "id": "REQ-001",
    "title": "Platform & Kubernetes Specialist",
    "project_id": "P005",
    "project_name": "Kubernetes Deployment Upgrade",
    "department": "Platform Engineering",
    "required_skills": {
      "Kubernetes": 4,
      "Docker": 3,
      "Linux": 3
    },
    "min_experience_years": 5,
    "openings": 1,
    "priority": "urgent",
    "status": "open",
    "salary_range": "$130,000 - $155,000",
    "required_by": "2026-11-15",
    "justification": "Sole qualified internal owner Priya Menon represents single-point-of-failure risk.",
    "created_at": "2026-10-15T12:00:00Z",
    "updated_at": "2026-10-15T12:00:00Z"
  }
]
```

**Empty State (`200 OK`):**
```json
[]
```

---

### 2.2 `POST /hiring/requests`
Creates a new hiring requisition.

**Status:** `[PROPOSED]`  
**HTTP Method:** `POST`  
**Path:** `/hiring/requests`  
**Request Headers:** `Content-Type: application/json`

**Request Body Schema:**
```json
{
  "title": "Data Analytics Lead",
  "project_id": "P001",
  "department": "Data Intelligence",
  "required_skills": {
    "Data Analytics": 4,
    "Python": 4,
    "SQL": 3
  },
  "min_experience_years": 4,
  "openings": 1,
  "priority": "high",
  "salary_range": "$125,000 - $145,000",
  "required_by": "2026-11-30",
  "justification": "Zero qualified internal owners for Cloud Analytics Platform requirements."
}
```

**Validation Rules:**
- `title`: String, required, 3–100 characters.
- `required_skills`: Object mapping skill names to integer levels (1–5). At least 1 skill required.
- `openings`: Integer, minimum 1.
- `priority`: Enum (`"low"`, `"medium"`, `"high"`, `"urgent"`).
- `justification`: String, required, minimum 10 characters.

**Response Schema (`201 Created`):**
```json
{
  "id": "REQ-002",
  "title": "Data Analytics Lead",
  "project_id": "P001",
  "project_name": "Cloud Analytics Platform",
  "department": "Data Intelligence",
  "required_skills": {
    "Data Analytics": 4,
    "Python": 4,
    "SQL": 3
  },
  "min_experience_years": 4,
  "openings": 1,
  "priority": "high",
  "status": "open",
  "salary_range": "$125,000 - $145,000",
  "required_by": "2026-11-30",
  "justification": "Zero qualified internal owners for Cloud Analytics Platform requirements.",
  "created_at": "2026-10-15T14:30:00Z",
  "updated_at": "2026-10-15T14:30:00Z"
}
```

**Error Responses:**
- `422 Unprocessable Entity`: `{"detail": "Validation error: 'title' is required and must be at least 3 characters."}`
- `400 Bad Request`: `{"detail": "Project P999 not found."}`

---

### 2.3 `GET /hiring/requests/{request_id}`
Retrieves details of a specific hiring requisition.

**Status:** `[PROPOSED]`  
**HTTP Method:** `GET`  
**Path:** `/hiring/requests/{request_id}`

**Response (`200 OK`):** Full requisition object (same schema as section 2.2).  
**Error Response (`404 Not Found`):** `{"detail": "Hiring request REQ-999 not found."}`

---

### 2.4 `PATCH /hiring/requests/{request_id}`
Updates the lifecycle status of a requisition.

**Status:** `[PROPOSED]`  
**HTTP Method:** `PATCH`  
**Path:** `/hiring/requests/{request_id}`

**Request Body Schema:**
```json
{
  "status": "in_review"
}
```

**Allowed Status Transitions:**
- `draft` → `open`, `cancelled`
- `open` → `in_review`, `cancelled`
- `in_review` → `filled`, `open`, `cancelled`
- `filled` → (Terminal state)
- `cancelled` → `draft`

**Response (`200 OK`):** Updated requisition object.  
**Error Response (`422 Unprocessable Entity`):** `{"detail": "Invalid status transition from 'filled' to 'open'."}`

---

### 2.5 `POST /hiring/candidates/match`
Evaluates and scores external candidate profiles against an open hiring requisition or explicit criteria.

**Status:** `[PROPOSED]`  
**HTTP Method:** `POST`  
**Path:** `/hiring/candidates/match`

**Request Body Schema:**
```json
{
  "request_id": "REQ-001"
}
```
*Or with explicit ad-hoc criteria:*
```json
{
  "required_skills": {
    "Kubernetes": 4,
    "Docker": 3
  },
  "min_experience_years": 4
}
```

**Response Schema (`200 OK`):**
```json
{
  "request_id": "REQ-001",
  "matched_count": 2,
  "candidates": [
    {
      "candidate_id": "CAND-101",
      "name": "Kavish Singhal",
      "match_score": 88.5,
      "years_experience": 6,
      "skills": {
        "Kubernetes": 4,
        "Docker": 4,
        "Linux": 4
      },
      "missing_skills": [],
      "availability": "Immediate",
      "expected_salary": "$140,000",
      "match_explanation": "Exceeds required Kubernetes proficiency level 4 with 6 years relevant DevOps experience."
    },
    {
      "candidate_id": "CAND-104",
      "name": "Pooja Chhabra",
      "match_score": 74.0,
      "years_experience": 4,
      "skills": {
        "Kubernetes": 3,
        "Docker": 4,
        "AWS": 3
      },
      "missing_skills": ["Kubernetes (Level 4 required, candidate at Level 3)"],
      "availability": "2 Weeks Notice",
      "expected_salary": "$135,000",
      "match_explanation": "Strong containerization background; requires slight leveling to hit target Kubernetes requirement."
    }
  ]
}
```

**Disconnected / Empty Response (`200 OK`):**
```json
{
  "request_id": "REQ-001",
  "matched_count": 0,
  "candidates": [],
  "notice": "No external candidate pool connected. ATS integration required."
}
```

---

## 3. Contingency Planning Endpoint Extensions

The existing `POST /whatif` endpoint in `API_CONTRACT.md` supports `type: "leave"` and `type: "new_project"`. We propose extending the payload and response to formalize **No Qualified Replacement (Attrition Shortfall Analysis)**.

### 3.1 `POST /whatif` (Proposed Extension)

**Proposed Request Type:** `no_replacement`
```json
{
  "type": "no_replacement",
  "employee_id": "E027",
  "project_id": "P005"
}
```

**Proposed Response Schema (`200 OK`):**
```json
{
  "type": "no_replacement",
  "scenario": "Priya Menon (E027) leaves Kubernetes Deployment Upgrade (P005).",
  "has_qualified_replacement": false,
  "affected_role": "Platform & SRE Specialist",
  "critical_missing_skills": [
    {
      "skill": "Kubernetes",
      "required_level": 4,
      "best_available_internal_level": 0,
      "qualified_internal_candidates_count": 0
    }
  ],
  "shortfall": {
    "unstaffed_hours": 80,
    "unfilled_seats": 1,
    "delivery_risk": "critical"
  },
  "recovery_options": {
    "external_hiring": {
      "prefill_requisition": {
        "title": "Platform & Kubernetes Specialist",
        "project_id": "P005",
        "required_skills": {"Kubernetes": 4, "Docker": 3},
        "priority": "urgent"
      },
      "estimated_lead_time_weeks": 4
    },
    "upskilling": {
      "best_candidates": [
        {"id": "E023", "name": "Harish Venkat", "related_skills_score": 0.65}
      ],
      "course": "Kubernetes Basics — Linux Foundation",
      "duration_weeks": 2,
      "feasibility_assessment": "Upskilling requires 2-4 weeks; cannot bridge immediate zero-day operational gap."
    },
    "work_redistribution": {
      "viable": false,
      "reason": "Zero remaining employees hold Kubernetes proficiency >= 3."
    },
    "project_adjustment": {
      "recommendation": "Postpone production container migration by 3-4 weeks or contract specialized external support."
    }
  },
  "warnings": [
    "No remaining employee meets mandatory skill thresholds for Kubernetes level 4.",
    "Do not select unqualified candidates to fill headcount quotas."
  ]
}
```

---

## 4. Frontend Integration Status Matrix

| Module | Route / Action | Frontend Status | Backend Status |
| :--- | :--- | :---: | :---: |
| Requisitions List | `GET /hiring/requests` | Local State Active | `[PROPOSED]` |
| Create Requisition | `POST /hiring/requests` | Validated Local Form | `[PROPOSED]` |
| Status Transition | `PATCH /hiring/requests/{id}` | Local Lifecycle Active | `[PROPOSED]` |
| Candidate Matching | `POST /hiring/candidates/match` | Integration Preview Ready | `[PROPOSED]` |
| Contingency Analysis | `POST /whatif` (no_replacement) | Client Fallback Active | `[PROPOSED]` |
| Team Recommendation | `POST /team/recommend` | Ready | Implemented (`API_CONTRACT.md`) |
| Workload Balancer | `POST /workload/rebalance` | Ready | Implemented (`API_CONTRACT.md`) |
| Risk Audit | `GET /risks` | Ready | Implemented (`API_CONTRACT.md`) |
