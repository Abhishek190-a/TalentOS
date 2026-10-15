// TalentOS — Deterministic Mock Data Fixtures
// Strictly complies with API_CONTRACT.md for the 40-employee, 8-project workforce

export const MOCK_TRAINING = [
  {
    skill: "Data Analytics",
    course: "Google Data Analytics Professional Certificate",
    weeks: 4
  },
  {
    skill: "Kubernetes",
    course: "Kubernetes Basics — Linux Foundation",
    weeks: 2
  }
];

export const MOCK_RELATED_SKILLS = {
  "Data Analytics": ["Pandas", "SQL", "Statistics"],
  "Cloud Computing": ["AWS", "Azure", "Docker"],
  "Kubernetes": ["Docker", "Cloud Computing", "Linux"]
};

export const MOCK_EMPLOYEES = [
  {
    id: "E001",
    name: "Ravi Kumar",
    role: "Senior Backend Engineer",
    years_exp: 6,
    capacity_hrs: 40,
    assigned_hrs: 52,
    skills: { Python: 5, AWS: 4, SQL: 3, Docker: 2 }
  },
  {
    id: "E002",
    name: "Ananya Rao",
    role: "Cloud Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 12,
    skills: { Python: 3, AWS: 4, Docker: 3, Linux: 2 }
  },
  {
    id: "E003",
    name: "Arjun Nair",
    role: "DevOps Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 12,
    skills: { Python: 3, "Cloud Computing": 4, Linux: 3, Docker: 2 }
  },
  {
    id: "E004",
    name: "Diya Iyer",
    role: "Full Stack Developer",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 26,
    skills: { Python: 3, React: 4, SQL: 3, JavaScript: 4 }
  },
  {
    id: "E005",
    name: "Vikram Sethi",
    role: "Frontend Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 34,
    skills: { React: 5, JavaScript: 5, TypeScript: 4, CSS: 4 }
  },
  {
    id: "E006",
    name: "Sneha Sharma",
    role: "Backend Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 30,
    skills: { Java: 4, SQL: 4, SpringBoot: 3, Docker: 2 }
  },
  {
    id: "E007",
    name: "Aditya Verma",
    role: "Cloud Architect",
    years_exp: 8,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { "Cloud Computing": 5, AWS: 5, Azure: 4, Linux: 4 }
  },
  {
    id: "E008",
    name: "Pooja Hegde",
    role: "QA Automation Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 28,
    skills: { Selenium: 4, Python: 3, SQL: 3, Cypress: 3 }
  },
  {
    id: "E009",
    name: "Ishaan Das",
    role: "Systems Architect",
    years_exp: 8,
    capacity_hrs: 40,
    assigned_hrs: 38,
    skills: { Java: 4, AWS: 4, Microservices: 4, Docker: 3 }
  },
  {
    id: "E010",
    name: "Neha Kulkarni",
    role: "Data Analyst",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 24,
    skills: { Pandas: 3, SQL: 4, Excel: 4, PowerBI: 3 }
  },
  {
    id: "E011",
    name: "Rohan Gupta",
    role: "Mobile App Developer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { "Node.js": 4, React: 3, MongoDB: 3, AWS: 2 }
  },
  {
    id: "E012",
    name: "Tanvi Joshi",
    role: "UI/UX & Frontend Specialist",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 20,
    skills: { React: 4, Figma: 5, CSS: 4, JavaScript: 3 }
  },
  {
    id: "E013",
    name: "Manish Reddy",
    role: "Database Administrator",
    years_exp: 7,
    capacity_hrs: 40,
    assigned_hrs: 36,
    skills: { PostgreSQL: 5, SQL: 5, Linux: 3, Python: 2 }
  },
  {
    id: "E014",
    name: "Meera Shah",
    role: "Data Specialist",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 28,
    skills: { Pandas: 4, SQL: 4, Statistics: 4, Python: 3 }
  },
  {
    id: "E015",
    name: "Kabir Malhotra",
    role: "Security Engineer",
    years_exp: 6,
    capacity_hrs: 40,
    assigned_hrs: 34,
    skills: { Linux: 4, Security: 5, Python: 3, Docker: 3 }
  },
  {
    id: "E016",
    name: "Shreya Ghoshal",
    role: "Full Stack Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 30,
    skills: { "Node.js": 4, MongoDB: 4, React: 3, AWS: 3 }
  },
  {
    id: "E017",
    name: "Nikhil Chawla",
    role: "DevOps & Cloud Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 28,
    skills: { AWS: 4, "Cloud Computing": 4, Docker: 4, Linux: 3 }
  },
  {
    id: "E018",
    name: "Aarti Pillai",
    role: "Business Intelligence Analyst",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 26,
    skills: { PowerBI: 4, SQL: 4, Excel: 4, Statistics: 2 }
  },
  {
    id: "E019",
    name: "Karan Patel",
    role: "Data & BI Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { Pandas: 3, SQL: 4, Statistics: 3, Python: 3 }
  },
  {
    id: "E020",
    name: "Ritika Sen",
    role: "Frontend Developer",
    years_exp: 2,
    capacity_hrs: 40,
    assigned_hrs: 22,
    skills: { JavaScript: 4, CSS: 4, HTML: 5, React: 3 }
  },
  {
    id: "E021",
    name: "Gaurav Bhatt",
    role: "Backend Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 35,
    skills: { Python: 4, PostgreSQL: 4, Docker: 3, Redis: 3 }
  },
  {
    id: "E022",
    name: "Swati Deshmukh",
    role: "Cloud Ops Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 26,
    skills: { Azure: 4, "Cloud Computing": 3, Docker: 3, Linux: 3 }
  },
  {
    id: "E023",
    name: "Harish Venkat",
    role: "Site Reliability Engineer",
    years_exp: 6,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { Linux: 5, Docker: 4, Python: 3, Prometheus: 4 }
  },
  {
    id: "E024",
    name: "Divya Nambiar",
    role: "QA Engineer",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 25,
    skills: { Selenium: 3, Cypress: 4, JavaScript: 3, SQL: 3 }
  },
  {
    id: "E025",
    name: "Amitabh Banerjee",
    role: "Enterprise Java Lead",
    years_exp: 9,
    capacity_hrs: 40,
    assigned_hrs: 34,
    skills: { Java: 5, SpringBoot: 5, SQL: 4, Docker: 3 }
  },
  {
    id: "E026",
    name: "Simran Kaur",
    role: "Product Analyst",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 24,
    skills: { SQL: 4, Excel: 4, Statistics: 3, Pandas: 2 }
  },
  {
    id: "E027",
    name: "Priya Menon",
    role: "Platform & SRE Specialist",
    years_exp: 7,
    capacity_hrs: 40,
    assigned_hrs: 36,
    skills: { Kubernetes: 4, Docker: 4, "Cloud Computing": 4, Linux: 4 }
  },
  {
    id: "E028",
    name: "Rajesh Soni",
    role: "Python Data Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 30,
    skills: { Python: 4, Pandas: 4, SQL: 3, Docker: 2 }
  },
  {
    id: "E029",
    name: "Sunita Agarwal",
    role: "Frontend Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 28,
    skills: { React: 4, TypeScript: 4, JavaScript: 4, Redux: 3 }
  },
  {
    id: "E030",
    name: "Abhishek Roy",
    role: "Mobile Solutions Lead",
    years_exp: 6,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { "Node.js": 4, React: 4, AWS: 3, MongoDB: 3 }
  },
  {
    id: "E031",
    name: "Kavita Rao",
    role: "Security Analyst",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 26,
    skills: { Linux: 4, Security: 4, Python: 3, Docker: 2 }
  },
  {
    id: "E032",
    name: "Sameer Saxena",
    role: "Full Stack Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 34,
    skills: { Python: 4, React: 3, SQL: 4, Docker: 3 }
  },
  {
    id: "E033",
    name: "Deepa Bhat",
    role: "Cloud Support Engineer",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 22,
    skills: { AWS: 3, "Cloud Computing": 3, Linux: 3, SQL: 2 }
  },
  {
    id: "E034",
    name: "Siddharth Jain",
    role: "Data Infrastructure Engineer",
    years_exp: 5,
    capacity_hrs: 40,
    assigned_hrs: 32,
    skills: { Python: 4, PostgreSQL: 4, Pandas: 3, Linux: 3 }
  },
  {
    id: "E035",
    name: "Monika Yadav",
    role: "Backend Developer",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 24,
    skills: { Java: 3, SQL: 4, Docker: 2, SpringBoot: 3 }
  },
  {
    id: "E036",
    name: "Varun Kapoor",
    role: "DevOps Engineer",
    years_exp: 4,
    capacity_hrs: 40,
    assigned_hrs: 28,
    skills: { Docker: 4, Linux: 4, AWS: 3, "Cloud Computing": 3 }
  },
  {
    id: "E037",
    name: "Anjali Mishra",
    role: "QA Lead",
    years_exp: 6,
    capacity_hrs: 40,
    assigned_hrs: 30,
    skills: { Cypress: 4, Selenium: 4, JavaScript: 4, Python: 2 }
  },
  {
    id: "E038",
    name: "Chetan Pandita",
    role: "Cloud Migration Architect",
    years_exp: 7,
    capacity_hrs: 40,
    assigned_hrs: 35,
    skills: { AWS: 5, Azure: 4, "Cloud Computing": 4, Docker: 3 }
  },
  {
    id: "E039",
    name: "Pallavi Ghosh",
    role: "BI Dashboard Specialist",
    years_exp: 3,
    capacity_hrs: 40,
    assigned_hrs: 20,
    skills: { PowerBI: 4, SQL: 4, Excel: 4, Statistics: 3 }
  },
  {
    id: "E040",
    name: "Tarun Singhania",
    role: "Solutions Architect",
    years_exp: 8,
    capacity_hrs: 40,
    assigned_hrs: 36,
    skills: { "Node.js": 4, Python: 4, Docker: 4, AWS: 4 }
  }
];

export const MOCK_PROJECTS = [
  {
    id: "P001",
    name: "Cloud Analytics Platform",
    brief: "Build a cloud-hosted analytics platform with a Python data pipeline.",
    hours_needed: 120,
    team_size: 4,
    required: {
      Python: { level: 4, weight: 0.4 },
      "Cloud Computing": { level: 3, weight: 0.3 },
      "Data Analytics": { level: 4, weight: 0.3 }
    }
  },
  {
    id: "P002",
    name: "Customer Churn Predictor",
    brief: "Deploy an ML churn model on AWS with automated feature pipelines.",
    hours_needed: 100,
    team_size: 3,
    required: {
      Python: { level: 4, weight: 0.4 },
      SQL: { level: 3, weight: 0.3 },
      AWS: { level: 3, weight: 0.3 }
    }
  },
  {
    id: "P003",
    name: "Payments API Modernization",
    brief: "Refactor legacy payment services into resilient microservices with high throughput.",
    hours_needed: 160,
    team_size: 4,
    required: {
      Java: { level: 4, weight: 0.35 },
      Docker: { level: 3, weight: 0.35 },
      SQL: { level: 3, weight: 0.3 }
    }
  },
  {
    id: "P004",
    name: "Inventory Forecasting System",
    brief: "Build real-time inventory demand forecasting pipeline with alerting.",
    hours_needed: 120,
    team_size: 3,
    required: {
      Python: { level: 4, weight: 0.4 },
      Pandas: { level: 4, weight: 0.3 },
      PostgreSQL: { level: 3, weight: 0.3 }
    }
  },
  {
    id: "P005",
    name: "Kubernetes Deployment Upgrade",
    brief: "Migrate container workloads to production Kubernetes cluster with autoscaling.",
    hours_needed: 80,
    team_size: 2,
    required: {
      Kubernetes: { level: 4, weight: 0.6 },
      Docker: { level: 3, weight: 0.4 }
    }
  },
  {
    id: "P006",
    name: "Internal HR Analytics",
    brief: "Create talent attrition and resource allocation dashboards.",
    hours_needed: 90,
    team_size: 3,
    required: {
      SQL: { level: 4, weight: 0.4 },
      PowerBI: { level: 3, weight: 0.3 },
      Python: { level: 3, weight: 0.3 }
    }
  },
  {
    id: "P007",
    name: "Mobile App Backend",
    brief: "Scalable REST APIs for customer-facing iOS and Android applications.",
    hours_needed: 140,
    team_size: 4,
    required: {
      "Node.js": { level: 4, weight: 0.4 },
      MongoDB: { level: 3, weight: 0.3 },
      AWS: { level: 3, weight: 0.3 }
    }
  },
  {
    id: "P008",
    name: "Security Log Intelligence",
    brief: "Centralized SIEM security log processing and incident triage engine.",
    hours_needed: 110,
    team_size: 3,
    required: {
      Python: { level: 4, weight: 0.4 },
      Linux: { level: 4, weight: 0.3 },
      Docker: { level: 3, weight: 0.3 }
    }
  }
];

// Helper: compute candidate match score according to section 5.2
export function computeCandidateScore(employee, project) {
  let skillFit = 0;
  for (const [skillName, req] of Object.entries(project.required)) {
    const empLevel = employee.skills[skillName] || 0;
    const ratio = Math.min(empLevel / req.level, 1);
    skillFit += req.weight * ratio;
  }

  const experience = Math.min(employee.years_exp / 10, 1);
  const hoursPerMember = project.hours_needed / project.team_size;
  const availRatio = (employee.capacity_hrs - employee.assigned_hrs) / hoursPerMember;
  const availability = Math.max(0, Math.min(availRatio, 1));

  const skillContrib = 100 * (0.55 * skillFit);
  const expContrib = 100 * (0.15 * experience);
  const availContrib = 100 * (0.30 * availability);
  const totalMatch = skillContrib + expContrib + availContrib;

  let reason = "Meets foundational criteria for project contribution.";
  if (availability === 0) {
    reason = "Strong skill fit but currently at maximum capacity (0% availability score).";
  } else if (skillFit >= 0.6 && availability >= 0.7) {
    reason = "Strong skill fit and abundant available capacity.";
  } else if (skillFit >= 0.5) {
    reason = "Balanced technical qualifications and sufficient bandwidth.";
  } else if (availability >= 0.8) {
    reason = "High availability with complementary foundation skills.";
  }

  return {
    id: employee.id,
    name: employee.name,
    role: employee.role,
    match: Math.round(totalMatch * 10) / 10,
    breakdown: {
      skill: Math.round(skillContrib * 10) / 10,
      exp: Math.round(expContrib * 10) / 10,
      avail: Math.round(availContrib * 10) / 10
    },
    reason,
    assigned_hrs: employee.assigned_hrs,
    capacity_hrs: employee.capacity_hrs,
    available_hrs: Math.max(0, employee.capacity_hrs - employee.assigned_hrs),
    utilization: Math.round((employee.assigned_hrs / employee.capacity_hrs) * 100) / 100
  };
}

// Compute deterministic recommendations for a project
export function getMockRecommendTeam(projectId = "P001", mode = "optimized") {
  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];

  // Eligible employees have > 0 hours of available capacity
  const eligible = MOCK_EMPLOYEES.filter(
    (e) => e.capacity_hrs - e.assigned_hrs > 0
  );

  const scoredAll = eligible.map((e) => ({
    ...e,
    candidateScore: computeCandidateScore(e, project)
  }));

  // Sort by match descending
  scoredAll.sort((a, b) => b.candidateScore.match - a.candidateScore.match);

  const selected =
    mode === "greedy"
      ? scoredAll.slice(0, project.team_size)
      : scoredAll.slice(0, project.team_size);

  const team = selected.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    match: s.candidateScore.match,
    breakdown: s.candidateScore.breakdown,
    reason: s.candidateScore.reason,
    assigned_hrs: s.assigned_hrs,
    capacity_hrs: s.capacity_hrs,
    utilization: s.candidateScore.utilization
  }));

  // Check coverage (proficiency >= 3 in at least one member)
  const coverage = {};
  let totalWeightedCoverage = 0;
  for (const [skill, req] of Object.entries(project.required)) {
    const isCovered = selected.some((m) => (m.skills[skill] || 0) >= 3);
    coverage[skill] = isCovered;

    let bestProf = 0;
    selected.forEach((m) => {
      const p = m.skills[skill] || 0;
      if (p > bestProf) bestProf = p;
    });
    const capRatio = Math.min(bestProf / req.level, 1);
    totalWeightedCoverage += req.weight * capRatio;
  }

  const coverage_score = Math.round(totalWeightedCoverage * 1000) / 10;
  const avgTeamMatch = team.reduce((acc, t) => acc + t.match, 0) / (team.length || 1);
  const total_score = Math.round((coverage_score + avgTeamMatch * 0.01) * 10) / 10;

  // Gaps
  const gaps = [];
  for (const [skill, covered] of Object.entries(coverage)) {
    if (!covered) {
      const relSkills = MOCK_RELATED_SKILLS[skill] || [];
      const learners = [];

      MOCK_EMPLOYEES.forEach((emp) => {
        if (relSkills.length > 0) {
          let sumProf = 0;
          relSkills.forEach((rs) => {
            sumProf += emp.skills[rs] || 0;
          });
          const score = Math.round((sumProf / (relSkills.length * 5)) * 100) / 100;
          if (score > 0) {
            learners.push({ id: emp.id, name: emp.name, score });
          }
        }
      });

      learners.sort((a, b) => b.score - a.score);
      const topLearners = learners.slice(0, 3);

      // Mentor search: proficiency >= 3
      let mentor = null;
      let highestP = 0;
      MOCK_EMPLOYEES.forEach((emp) => {
        const p = emp.skills[skill] || 0;
        if (p >= 3 && p > highestP) {
          highestP = p;
          mentor = emp.name;
        }
      });

      const tr = MOCK_TRAINING.find((t) => t.skill === skill);
      gaps.push({
        skill,
        learners: topLearners,
        mentor,
        course: tr ? tr.course : "Internal guided learning plan",
        weeks: tr ? tr.weeks : 2
      });
    }
  }

  return {
    project_id: project.id,
    mode,
    team,
    coverage,
    coverage_score,
    total_score,
    gaps,
    compare: {
      greedy_score: 69.8,
      optimized_score: 70.7
    },
    requested_team_size: project.team_size,
    actual_team_size: team.length,
    warnings:
      team.length < project.team_size
        ? [`Only ${team.length} of ${project.team_size} members could be placed due to capacity constraints.`]
        : []
  };
}

// Workload metrics & state
export function getMockWorkload() {
  const employees = MOCK_EMPLOYEES.map((e) => {
    const util = Math.round((e.assigned_hrs / e.capacity_hrs) * 100) / 100;
    let risk = "low";
    if (util > 1.0) risk = "high";
    else if (util > 0.9) risk = "medium";

    return {
      id: e.id,
      name: e.name,
      role: e.role,
      capacity_hrs: e.capacity_hrs,
      assigned_hrs: e.assigned_hrs,
      utilization: util,
      risk
    };
  });

  const sumUtil = employees.reduce((acc, e) => acc + e.utilization, 0);
  const average_utilization = Math.round((sumUtil / employees.length) * 100) / 100;

  let sumSqDiff = 0;
  employees.forEach((e) => {
    sumSqDiff += Math.pow(e.utilization - average_utilization, 2);
  });
  const variance = Math.round((sumSqDiff / employees.length) * 10000) / 10000;

  const overloaded_count = employees.filter((e) => e.utilization > 1.0).length;
  const idle_count = employees.filter((e) => e.utilization < 0.5).length;

  return {
    employees,
    variance: variance || 0.0412,
    average_utilization,
    overloaded_count,
    idle_count
  };
}

// Rebalance simulation
export function getMockRebalance() {
  const beforeList = MOCK_EMPLOYEES.map((e) => ({
    id: e.id,
    name: e.name,
    assigned_hrs: e.assigned_hrs,
    utilization: Math.round((e.assigned_hrs / e.capacity_hrs) * 100) / 100
  }));

  const afterList = MOCK_EMPLOYEES.map((e) => {
    let assigned = e.assigned_hrs;
    if (e.id === "E001") assigned = 44; // Ravi Kumar: 52 -> 44
    if (e.id === "E002") assigned = 20; // Ananya Rao: 12 -> 20

    return {
      id: e.id,
      name: e.name,
      assigned_hrs: assigned,
      utilization: Math.round((assigned / e.capacity_hrs) * 100) / 100
    };
  });

  return {
    moves: [
      {
        from: "E001",
        from_name: "Ravi Kumar",
        to: "E002",
        to_name: "Ananya Rao",
        hours: 8,
        skill: "Python"
      }
    ],
    before: {
      variance: 0.0412,
      per_emp: beforeList
    },
    after: {
      variance: 0.028,
      per_emp: afterList
    },
    impact: {
      variance_drop_pct: 32.0,
      hours_moved: 8
    },
    warnings: []
  };
}

// Risks endpoint
export function getMockRisks() {
  return {
    bus_factor: [
      {
        skill: "Kubernetes",
        owner: "Priya Menon",
        owner_id: "E027",
        qualified_employee_count: 1,
        severity: "critical",
        explanation: "Only Priya Menon has level 4 Kubernetes proficiency across the entire 40-person engineering roster. Any unplanned leave blocks container deployment workflows."
      },
      {
        skill: "Data Analytics",
        owner: null,
        owner_id: null,
        qualified_employee_count: 0,
        severity: "critical",
        explanation: "Zero employees hold formal level 3+ Data Analytics certification. Learning path upskilling via Google Professional Certificate is required."
      }
    ],
    burnout: [
      {
        id: "E001",
        name: "Ravi Kumar",
        role: "Senior Backend Engineer",
        util: 1.3,
        assigned_hrs: 52,
        capacity_hrs: 40,
        risk: "high",
        explanation: "Allocated 52 hours/week against 40 hours standard capacity (130% utilization). Immediate workload delegation required."
      },
      {
        id: "E009",
        name: "Ishaan Das",
        role: "Systems Architect",
        util: 0.95,
        assigned_hrs: 38,
        capacity_hrs: 40,
        risk: "medium",
        explanation: "Approaching operational ceiling at 95% utilization. Vulnerable to acute spikes."
      }
    ]
  };
}

// Hiring Requisitions & Candidates Mock Data Fixtures
export const MOCK_HIRING_REQUESTS = [
  {
    id: "REQ-001",
    title: "Platform & Kubernetes Specialist",
    project_id: "P005",
    project_name: "Kubernetes Deployment Upgrade",
    department: "Platform Engineering",
    required_skills: {
      Kubernetes: 4,
      Docker: 3,
      Linux: 3
    },
    min_experience_years: 5,
    openings: 1,
    priority: "urgent",
    status: "open",
    salary_range: "$130,000 - $155,000",
    required_by: "2026-11-15",
    justification: "Sole qualified internal owner Priya Menon represents single-point-of-failure risk.",
    created_at: "2026-10-15T10:00:00Z",
    updated_at: "2026-10-15T10:00:00Z"
  },
  {
    id: "REQ-002",
    title: "Lead Data Analytics Engineer",
    project_id: "P001",
    project_name: "Cloud Analytics Platform",
    department: "Data Intelligence",
    required_skills: {
      "Data Analytics": 4,
      Python: 4,
      SQL: 3
    },
    min_experience_years: 4,
    openings: 1,
    priority: "high",
    status: "in_review",
    salary_range: "$120,000 - $145,000",
    required_by: "2026-11-30",
    justification: "Zero qualified internal owners for enterprise data analytics workflows.",
    created_at: "2026-10-14T09:30:00Z",
    updated_at: "2026-10-15T11:00:00Z"
  },
  {
    id: "REQ-003",
    title: "Senior Microservices Backend Engineer",
    project_id: "P003",
    project_name: "Payments API Modernization",
    department: "Core Backend",
    required_skills: {
      Java: 4,
      Docker: 3,
      SQL: 3
    },
    min_experience_years: 6,
    openings: 2,
    priority: "medium",
    status: "open",
    salary_range: "$125,000 - $150,000",
    required_by: "2026-12-15",
    justification: "High volume payment gateway migration requires resilient transaction processing talent.",
    created_at: "2026-10-13T14:15:00Z",
    updated_at: "2026-10-13T14:15:00Z"
  }
];

export const MOCK_CANDIDATES = [
  {
    candidate_id: "CAND-101",
    name: "Kavish Singhal",
    target_role: "Platform & Kubernetes Specialist",
    match_score: 88.5,
    years_experience: 6,
    skills: {
      Kubernetes: 4,
      Docker: 4,
      Linux: 4
    },
    missing_skills: [],
    availability: "Immediate",
    expected_salary: "$140,000",
    match_explanation: "Exceeds required Kubernetes proficiency level 4 with 6 years of production cluster operations experience."
  },
  {
    candidate_id: "CAND-102",
    name: "Pooja Chhabra",
    target_role: "Platform & Kubernetes Specialist",
    match_score: 74.0,
    years_experience: 4,
    skills: {
      Kubernetes: 3,
      Docker: 4,
      AWS: 3
    },
    missing_skills: ["Kubernetes (Level 4 required, candidate at Level 3)"],
    availability: "2 Weeks Notice",
    expected_salary: "$135,000",
    match_explanation: "Solid containerization background; requires slight leveling to hit target Kubernetes requirement."
  },
  {
    candidate_id: "CAND-103",
    name: "Siddhartha Roy",
    target_role: "Lead Data Analytics Engineer",
    match_score: 91.0,
    years_experience: 5,
    skills: {
      "Data Analytics": 5,
      Python: 4,
      SQL: 4
    },
    missing_skills: [],
    availability: "30 Days Notice",
    expected_salary: "$138,000",
    match_explanation: "Direct match for data pipeline architecture with advanced statistical analytics proficiency."
  }
];

// What-If & Contingency Simulation
export function getMockWhatIf(payload) {
  const type = payload?.type || "leave";

  // Scenario 3: Explicit No Qualified Replacement / Attrition Analysis
  // (Also auto-triggered if employee_id is E027 Priya Menon or project_id is P005 Kubernetes)
  if (type === "no_replacement" || (payload.employee_id === "E027" && (payload.project_id === "P005" || payload.project_id === "P001"))) {
    return {
      type: "no_replacement",
      scenario: "Priya Menon (E027) leaves Kubernetes Deployment Upgrade (P005).",
      has_qualified_replacement: false,
      status: "no_qualified_replacement",
      affected_role: "Platform & SRE Specialist",
      critical_missing_skills: [
        {
          skill: "Kubernetes",
          required_level: 4,
          best_available_internal_level: 0,
          qualified_internal_candidates_count: 0
        }
      ],
      shortfall: {
        unstaffed_hours: 80,
        unfilled_seats: 1,
        delivery_risk: "critical",
        risk_summary: "Production container migration blocked. Zero internal engineers meet baseline Kubernetes Level 4 proficiency."
      },
      recovery_options: {
        external_hiring: {
          prefill_requisition: {
            title: "Platform & Kubernetes Specialist",
            project_id: "P005",
            project_name: "Kubernetes Deployment Upgrade",
            department: "Platform Engineering",
            required_skills: { Kubernetes: 4, Docker: 3, Linux: 3 },
            min_experience_years: 5,
            openings: 1,
            priority: "urgent",
            salary_range: "$130,000 - $155,000",
            required_by: "2026-11-15",
            justification: "Critical attrition: Sole Kubernetes owner Priya Menon is unavailable. No qualified internal replacement exists."
          },
          estimated_lead_time_weeks: 4,
          action_label: "Create External Requisition"
        },
        upskilling: {
          best_candidates: [
            { id: "E023", name: "Harish Venkat", role: "Site Reliability Engineer", related_skills_score: 0.65, foundation: "Docker 4, Linux 5" },
            { id: "E036", name: "Varun Kapoor", role: "DevOps Engineer", related_skills_score: 0.55, foundation: "Docker 4, Linux 4" }
          ],
          course: "Kubernetes Basics — Linux Foundation",
          duration_weeks: 2,
          feasibility_assessment: "Upskilling requires 2-4 weeks; cannot bridge immediate zero-day operational gap without interim risk."
        },
        work_redistribution: {
          viable: false,
          reason: "Zero remaining employees hold Kubernetes proficiency >= 3. Reassigning generic DevOps tasks to Docker engineers leaves cluster orchestration unstaffed."
        },
        project_adjustment: {
          recommendation: "Postpone production container migration by 3-4 weeks or contract specialized external support.",
          trade_offs: "Minimizes deployment outage risk at the cost of delayed infrastructure modernization."
        }
      },
      before_team: [
        { id: "E027", name: "Priya Menon", role: "Platform & SRE Specialist", match: 88.5 },
        { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 }
      ],
      after_team: [
        { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 }
      ],
      changes: [
        {
          action: "removed",
          id: "E027",
          name: "Priya Menon",
          reason: "Simulated departure / unavailable."
        }
      ],
      coverage_before: { Kubernetes: true, Docker: true },
      coverage_after: { Kubernetes: false, Docker: true },
      warnings: [
        "Critical Deficit: No remaining employee meets mandatory skill thresholds for Kubernetes level 4.",
        "Do not select unqualified candidates to fill headcount quotas."
      ]
    };
  }

  if (type === "leave") {
    const empId = payload.employee_id || "E002";
    const emp = MOCK_EMPLOYEES.find((e) => e.id === empId) || MOCK_EMPLOYEES[1];
    const proj = MOCK_PROJECTS.find((p) => p.id === payload.project_id) || MOCK_PROJECTS[0];

    return {
      type: "leave",
      scenario: `${emp.name} is unavailable for ${proj.name}.`,
      has_qualified_replacement: true,
      before_team: [
        { id: "E002", name: "Ananya Rao", role: "Cloud Engineer", match: 78.4 },
        { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 },
        { id: "E007", name: "Aditya Verma", role: "Cloud Architect", match: 62.8 },
        { id: "E017", name: "Nikhil Chawla", role: "DevOps & Cloud Engineer", match: 59.4 }
      ],
      after_team: [
        { id: "E004", name: "Diya Iyer", role: "Full Stack Developer", match: 72.1 },
        { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 },
        { id: "E007", name: "Aditya Verma", role: "Cloud Architect", match: 62.8 },
        { id: "E017", name: "Nikhil Chawla", role: "DevOps & Cloud Engineer", match: 59.4 }
      ],
      changes: [
        {
          action: "removed",
          id: emp.id,
          name: emp.name,
          reason: "Simulated leave / unavailability."
        },
        {
          action: "added",
          id: "E004",
          name: "Diya Iyer",
          reason: "Best feasible replacement with strong Python skill and available capacity."
        }
      ],
      coverage_before: { Python: true, "Cloud Computing": true, "Data Analytics": false },
      coverage_after: { Python: true, "Cloud Computing": true, "Data Analytics": false },
      warnings: [
        "Replacement maintains Python and Cloud coverage, but overall team match dropped by 1.6 points."
      ]
    };
  }

  // Urgent new project
  const urgentProj = MOCK_PROJECTS.find((p) => p.id === payload.project_id) || MOCK_PROJECTS[4]; // Kubernetes upgrade
  return {
    type: "new_project",
    scenario: `Urgent mobilization for ${urgentProj.name}.`,
    has_qualified_replacement: true,
    before_team: [
      { id: "E002", name: "Ananya Rao", role: "Cloud Engineer", match: 78.4 },
      { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 }
    ],
    after_team: [
      { id: "E027", name: "Priya Menon", role: "Platform & SRE Specialist", match: 88.5 },
      { id: "E003", name: "Arjun Nair", role: "DevOps Engineer", match: 65.2 }
    ],
    changes: [
      {
        action: "added",
        id: "E027",
        name: "Priya Menon",
        reason: "Mandatory sole-owner allocation for Kubernetes requirement."
      }
    ],
    coverage_before: { Kubernetes: false, Docker: true },
    coverage_after: { Kubernetes: true, Docker: true },
    warnings: [
      "Mobilizing Priya Menon absorbs 36 hours of capacity, elevating organizational bus factor risk."
    ]
  };
}

// Brief parser mock
export function getMockBriefToTeam(text = "") {
  const briefKeywords = text.toLowerCase();
  const projectName = briefKeywords.includes("cloud")
    ? "Brief-created Cloud Analytics Platform"
    : "Brief-created Project";
  return {
    source: "rules",
    extracted: {
      name: projectName,
      hours_needed: 120,
      team_size: 4,
      required: {
        Python: { level: 4, weight: 0.4 },
        "Cloud Computing": { level: 3, weight: 0.3 },
        "Data Analytics": { level: 3, weight: 0.3 }
      }
    },
    team: [
      {
        id: "E002",
        name: "Ananya Rao",
        role: "Cloud Engineer",
        match: 78.4,
        breakdown: { skill: 44.0, exp: 6.0, avail: 28.4 },
        reason: "Strong Python and cloud fit; enough capacity for the requested hours."
      },
      {
        id: "E003",
        name: "Arjun Nair",
        role: "DevOps Engineer",
        match: 65.2,
        breakdown: { skill: 38.5, exp: 4.5, avail: 22.2 },
        reason: "Adds complementary cloud skills and has available capacity."
      },
      {
        id: "E004",
        name: "Diya Iyer",
        role: "Full Stack Developer",
        match: 61.8,
        breakdown: { skill: 34.0, exp: 4.5, avail: 23.3 },
        reason: "Supports data pipeline integration with active capacity."
      },
      {
        id: "E007",
        name: "Aditya Verma",
        role: "Cloud Architect",
        match: 59.2,
        breakdown: { skill: 36.0, exp: 8.0, avail: 15.2 },
        reason: "Senior cloud architecture oversight for deployment robustness."
      }
    ],
    coverage: {
      Python: true,
      "Cloud Computing": true,
      "Data Analytics": false
    },
    coverage_score: 70.0,
    total_score: 70.7,
    gaps: [
      {
        skill: "Data Analytics",
        learners: [
          { id: "E014", name: "Meera Shah", score: 0.8 },
          { id: "E019", name: "Karan Patel", score: 0.73 }
        ],
        mentor: null,
        course: "Google Data Analytics Professional Certificate",
        weeks: 4
      }
    ],
    compare: {
      greedy_score: 69.8,
      optimized_score: 70.7
    },
    warnings: [
      "Extracted skills from manager brief using deterministic rules fallback."
    ]
  };
}

// AI Agent response mock
export function getMockAgentChat(message = "") {
  const lower = message.toLowerCase();

  if (lower.includes("overload") || lower.includes("ravi") || lower.includes("burnout")) {
    return {
      answer:
        "Ravi Kumar is at 130% utilization (52 assigned hours against 40 standard capacity), placing him in the high burnout risk category. Meanwhile, Ananya Rao and Arjun Nair are underutilized at 30% (12 hrs). We recommend moving 8 hours of Python tasks to Ananya Rao to reduce variance by 32%.",
      source: "rules",
      suggested_actions: [
        { label: "Open Workload Rebalancer", action: "navigate", target: "workload" },
        { label: "View Burnout Risks", action: "navigate", target: "risks" }
      ]
    };
  }

  if (lower.includes("bus factor") || lower.includes("one owner") || lower.includes("kubernetes")) {
    return {
      answer:
        "Kubernetes has a severe bus factor risk (qualifying count = 1). Priya Menon (E027) is the only engineer with level 4 proficiency. Zero other employees have level 3 or higher. If Priya is unavailable, Kubernetes deployments stall.",
      source: "rules",
      suggested_actions: [
        { label: "View Risk Analysis", action: "navigate", target: "risks" },
        { label: "Simulate Priya Leave", action: "navigate", target: "whatif" }
      ]
    };
  }

  if (lower.includes("learn") || lower.includes("data analytics") || lower.includes("training")) {
    return {
      answer:
        "Nobody in the organization currently possesses the Data Analytics skill at level 1+. However, Meera Shah (learnability 0.80) and Karan Patel (learnability 0.73) have strong foundational skills in Pandas, SQL, and Statistics. We recommend the Google Data Analytics Professional Certificate (4 weeks).",
      source: "rules",
      suggested_actions: [
        { label: "View Gaps in Team Builder", action: "navigate", target: "teambuilder" }
      ]
    };
  }

  if (lower.includes("why") || lower.includes("team") || lower.includes("selected")) {
    return {
      answer:
        "The team was assembled to optimize overall weighted skill coverage while respecting capacity limits. Ravi was excluded from the primary team due to 0% availability (overloaded), allowing Ananya Rao (78.4 match) and Arjun Nair (65.2 match) to lead with high availability.",
      source: "rules",
      suggested_actions: [
        { label: "Inspect Match Breakdowns", action: "navigate", target: "teambuilder" }
      ]
    };
  }

  return {
    answer:
      "TalentOS is an explainable workforce decision-support platform. I can explain match scores, detect burnout and overload, analyze bus-factor single points of failure, or evaluate skill gap learning paths.",
    source: "rules",
    suggested_actions: [
      { label: "Explore Team Builder", action: "navigate", target: "teambuilder" },
      { label: "Check Workload Heatmap", action: "navigate", target: "workload" }
    ]
  };
}
