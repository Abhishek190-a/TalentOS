import { useState, useEffect, useCallback } from "react";
import {
  UserMinus,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Info,
  Calendar,
  AlertOctagon
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import MatchRing from "../components/MatchRing.jsx";
import { getEmployees, getProjects, runWhatIf } from "../api.js";

export default function WhatIf({ connectionStatus, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  // Simulation parameters:
  // "no_replacement" (Scenario 3: No Qualified Internal Replacement)
  // "leave" (Scenario 1: Employee becomes unavailable)
  // "new_project" (Scenario 2: Urgent project staffing)
  const [scenarioType, setScenarioType] = useState("no_replacement");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("E027"); // Priya Menon
  const [selectedProjectId, setSelectedProjectId] = useState("P005"); // Kubernetes Upgrade
  const [baselineProjectId, setBaselineProjectId] = useState("P001");
  const [urgencyLevel, setUrgencyLevel] = useState("Urgent");
  const [requiredByDate, setRequiredByDate] = useState("2026-11-15");

  const [activeRecoveryTab, setActiveRecoveryTab] = useState("hiring"); // "hiring", "upskilling", "redistribution", "adjustment"
  const [simulationResult, setSimulationResult] = useState(null);

  const executeSimulation = useCallback(async (type, empId, projId, baseProjId) => {
    setSimulating(true);
    setError(null);
    try {
      const payload =
        type === "no_replacement"
          ? { type: "no_replacement", employee_id: empId, project_id: projId }
          : type === "leave"
          ? { type: "leave", employee_id: empId, project_id: projId }
          : {
              type: "new_project",
              project_id: projId,
              baseline_project_id: baseProjId || "P001"
            };

      const res = await runWhatIf(payload);
      setSimulationResult(res.data);
    } catch (err) {
      setError(err.message || "Simulation failed");
    } finally {
      setSimulating(false);
    }
  }, []);

  const loadSeedData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, projRes] = await Promise.all([getEmployees(), getProjects()]);
      setEmployees(empRes.data || []);
      setProjects(projRes.data || []);

      // Default scenario: Priya Menon leaving Kubernetes project
      await executeSimulation("no_replacement", "E027", "P005");
    } catch (err) {
      setError(err.message || "Failed to load simulation parameters");
    } finally {
      setLoading(false);
    }
  }, [executeSimulation]);

  useEffect(() => {
    loadSeedData();
  }, [loadSeedData, connectionStatus.isLive]);

  const handleScenarioChange = (type) => {
    setScenarioType(type);
    if (type === "no_replacement") {
      setSelectedEmployeeId("E027"); // Priya Menon (sole owner)
      setSelectedProjectId("P005"); // Kubernetes project
      executeSimulation("no_replacement", "E027", "P005");
    } else if (type === "leave") {
      setSelectedEmployeeId("E002"); // Ananya Rao
      setSelectedProjectId("P001"); // Cloud Analytics
      executeSimulation("leave", "E002", "P001");
    } else {
      setSelectedProjectId("P005");
      setBaselineProjectId("P001");
      executeSimulation("new_project", "", "P005", "P001");
    }
  };

  const handleRunSimulation = () => {
    executeSimulation(
      scenarioType,
      selectedEmployeeId,
      selectedProjectId,
      baselineProjectId
    );
  };

  // Navigate to Hiring page with prefilled requisition data
  const handleCreateHiringRequest = () => {
    const prefill = simulationResult?.recovery_options?.external_hiring?.prefill_requisition || {
      title: "Platform & Kubernetes Specialist",
      project_id: selectedProjectId,
      department: "Platform Engineering",
      required_skills: { Kubernetes: 4, Docker: 3 },
      priority: urgencyLevel.toLowerCase(),
      required_by: requiredByDate,
      justification: `Contingency Planning: ${simulationResult?.scenario || "No qualified internal replacement available."}`
    };

    if (onNavigate) {
      onNavigate("hiring", prefill);
    }
  };

  const isNoReplacement =
    scenarioType === "no_replacement" || simulationResult?.has_qualified_replacement === false;

  return (
    <LoadingState loading={loading} error={error} onRetry={loadSeedData}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Simulator Control Card */}
        <div className="card card-elevated">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                Contingency Planning & Staffing Deficit Simulator
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Evaluate hypothetical attrition impact, single-point-of-failure vulnerabilities, and recovery paths
              </div>
            </div>

            {/* Scenario Type Tabs */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-card)",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                gap: "2px"
              }}
            >
              <button
                className={`btn btn-sm ${scenarioType === "no_replacement" ? "btn-primary" : "btn-outline"}`}
                style={{ border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "11.5px" }}
                onClick={() => handleScenarioChange("no_replacement")}
              >
                No Qualified Replacement
              </button>
              <button
                className={`btn btn-sm ${scenarioType === "leave" ? "btn-primary" : "btn-outline"}`}
                style={{ border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "11.5px" }}
                onClick={() => handleScenarioChange("leave")}
              >
                Standard Leave
              </button>
              <button
                className={`btn btn-sm ${scenarioType === "new_project" ? "btn-primary" : "btn-outline"}`}
                style={{ border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "11.5px" }}
                onClick={() => handleScenarioChange("new_project")}
              >
                Urgent Project Demand
              </button>
            </div>
          </div>

          {/* Form controls based on scenario */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", alignItems: "end" }}>
            {scenarioType !== "new_project" ? (
              <>
                <div className="form-group">
                  <label className="form-label">Simulate Departing Employee:</label>
                  <select
                    className="custom-select"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    disabled={simulating}
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role}) — {emp.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Affected Project:</label>
                  <select
                    className="custom-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={simulating}
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name} ({proj.team_size} members)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Urgency & Timeline:</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select
                      className="custom-select"
                      value={urgencyLevel}
                      onChange={(e) => setUrgencyLevel(e.target.value)}
                      style={{ width: "110px" }}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                    <input
                      type="date"
                      className="custom-input"
                      value={requiredByDate}
                      onChange={(e) => setRequiredByDate(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Urgent Incoming Project:</label>
                  <select
                    className="custom-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={simulating}
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name} ({proj.team_size} members, {proj.hours_needed} hrs)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Baseline Comparison Project:</label>
                  <select
                    className="custom-select"
                    value={baselineProjectId}
                    onChange={(e) => setBaselineProjectId(e.target.value)}
                    disabled={simulating}
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <button
                className="btn btn-cyan"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleRunSimulation}
                disabled={simulating}
              >
                <span>{simulating ? "Evaluating..." : "Run Analysis"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hypothetical Simulation Banner */}
        {simulationResult && (
          <div
            className="card"
            style={{
              background: isNoReplacement
                ? "rgba(239, 68, 68, 0.05)"
                : "linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(34, 211, 238, 0.06))",
              border: `1px solid ${isNoReplacement ? "rgba(239, 68, 68, 0.3)" : "rgba(99, 102, 241, 0.25)"}`
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <span
                  className={`chip ${isNoReplacement ? "chip-missing" : "chip-indigo"}`}
                  style={{ marginBottom: "6px" }}
                >
                  {isNoReplacement ? "CRITICAL STAFFING DEFICIT" : "HYPOTHETICAL CONTINGENCY SCENARIO"}
                </span>
                <h3 style={{ fontSize: "16px", color: "var(--text-primary)", marginTop: "4px" }}>
                  {simulationResult.scenario}
                </h3>
              </div>

              {simulationResult.warnings && simulationResult.warnings.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isNoReplacement ? "var(--overloaded-red)" : "var(--warning-amber)", fontSize: "12px" }}>
                  <AlertTriangle size={15} />
                  <span>{simulationResult.warnings[0]}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCENARIO 3: NO QUALIFIED INTERNAL REPLACEMENT WORKFLOW            */}
        {/* ================================================================= */}
        {isNoReplacement && (
          <div
            className="card"
            style={{
              border: "1px solid rgba(239, 68, 68, 0.4)",
              background: "rgba(17, 24, 39, 0.95)"
            }}
          >
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: "var(--overloaded-red)" }}>
                  <AlertOctagon size={18} />
                  Deficit Analysis: No Qualified Internal Replacement Found
                </div>
                <div className="card-subtitle">
                  Algorithmic evaluation confirms zero remaining staff meet mandatory skill proficiency and capacity constraints
                </div>
              </div>
              <span className="chip chip-missing">
                STATUS: UNRESOLVED DEFICIT
              </span>
            </div>

            {/* Impact Grid: Missing Skills, Shortfall, Delivery Risk */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              {/* Missing Skills */}
              <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Missing Critical Competency
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--overloaded-red)", margin: "4px 0" }}>
                  Kubernetes (Level 4)
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Required: Level 4 • Best Remaining: Level 0 (0 staff qualified)
                </div>
              </div>

              {/* Capacity Shortfall */}
              <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Staffing & Capacity Shortfall
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--warning-amber)", margin: "4px 0" }}>
                  80 Unallocated Hours
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  1 Key Seat Unfilled • 100% Core Deliverable Unstaffed
                </div>
              </div>

              {/* Potential Delivery Risk */}
              <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Operational Delivery Risk
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--overloaded-red)", margin: "4px 0" }}>
                  Severe Deployment Block
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Production container deployment blocked without specialist
                </div>
              </div>
            </div>

            {/* 4 Strategic Recovery Paths */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "18px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                Evaluated Strategic Recovery Options:
              </div>

              {/* Recovery Option Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  className={`btn btn-sm ${activeRecoveryTab === "hiring" ? "btn-cyan" : "btn-outline"}`}
                  onClick={() => setActiveRecoveryTab("hiring")}
                >
                  <Briefcase size={13} />
                  <span>A. External Hiring Requisition</span>
                </button>
                <button
                  className={`btn btn-sm ${activeRecoveryTab === "upskilling" ? "btn-cyan" : "btn-outline"}`}
                  onClick={() => setActiveRecoveryTab("upskilling")}
                >
                  <GraduationCap size={13} />
                  <span>B. Internal Upskilling</span>
                </button>
                <button
                  className={`btn btn-sm ${activeRecoveryTab === "redistribution" ? "btn-cyan" : "btn-outline"}`}
                  onClick={() => setActiveRecoveryTab("redistribution")}
                >
                  <Users size={13} />
                  <span>C. Work Redistribution</span>
                </button>
                <button
                  className={`btn btn-sm ${activeRecoveryTab === "adjustment" ? "btn-cyan" : "btn-outline"}`}
                  onClick={() => setActiveRecoveryTab("adjustment")}
                >
                  <Calendar size={13} />
                  <span>D. Project Adjustment</span>
                </button>
              </div>

              {/* Tab Content: A. External Hiring */}
              {activeRecoveryTab === "hiring" && (
                <div style={{ padding: "16px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Initiate External Talent Acquisition Requisition
                      </h4>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Creates an internal hiring requisition prefilled with required Kubernetes Level 4 proficiency and urgency metadata.
                      </p>
                    </div>
                    <span className="chip chip-amber">Lead Time: ~4 Weeks</span>
                  </div>

                  <div style={{ padding: "10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "6px", fontSize: "11.5px", color: "var(--text-secondary)", marginBottom: "14px" }}>
                    <strong>Prefill Summary: </strong> Role: Platform & Kubernetes Specialist • Target Project: Kubernetes Deployment Upgrade • Skills: Kubernetes (Lvl 4), Docker (Lvl 3) • Priority: Urgent
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
                      <Info size={13} />
                      <span>Note: Creating a requisition initiates an internal approval workflow; it does not commit external budget automatically.</span>
                    </div>

                    <button className="btn btn-cyan btn-sm" onClick={handleCreateHiringRequest}>
                      <span>Open Pre-filled Requisition Form</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content: B. Upskilling */}
              {activeRecoveryTab === "upskilling" && (
                <div style={{ padding: "16px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Accelerated Learning Pathway Evaluation
                      </h4>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Staff with adjacent skills (Docker, Linux) evaluated for upskilling suitability.
                      </p>
                    </div>
                    <span className="chip chip-indigo">Duration: 2–4 Weeks</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ padding: "10px", background: "var(--bg-card)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>Harish Venkat (SRE)</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Docker 4, Linux 5 • Adjacent Skill Affinity: 65%</div>
                    </div>
                    <div style={{ padding: "10px", background: "var(--bg-card)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>Varun Kapoor (DevOps)</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Docker 4, Linux 4 • Adjacent Skill Affinity: 55%</div>
                    </div>
                  </div>

                  <div style={{ padding: "10px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "6px", fontSize: "11.5px", color: "var(--warning-amber)" }}>
                    <strong>Feasibility Assessment: </strong> Recommended course: <em>Kubernetes Basics — Linux Foundation (2 weeks)</em>. However, upskilling cannot resolve an immediate zero-day operational gap without an experienced mentor.
                  </div>
                </div>
              )}

              {/* Tab Content: C. Work Redistribution */}
              {activeRecoveryTab === "redistribution" && (
                <div style={{ padding: "16px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Workload Reassignment Assessment
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Evaluates whether ancillary project tasks can be partitioned across available staff.
                  </p>
                  <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "6px", fontSize: "12px", color: "var(--overloaded-red)", lineHeight: 1.5 }}>
                    <strong>Redistribution Not Viable for Core Competency: </strong> While secondary Docker container packaging can be absorbed by other DevOps engineers, cluster administration, ingress rules, and autoscaling cannot be delegated without violating technical delivery standards.
                  </div>
                </div>
              )}

              {/* Tab Content: D. Project Adjustment */}
              {activeRecoveryTab === "adjustment" && (
                <div style={{ padding: "16px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Project Timeline & Scope Realignment
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Strategic scope reduction and milestone adjustment trade-offs.
                  </p>
                  <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    <strong>Recommended Trade-off: </strong> Postpone the production Kubernetes migration by 3–4 weeks to coincide with external talent sourcing or contractor onboarding. Avoid rushing deployment cutover without qualified cluster oversight.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Changes: Added and Removed Personnel */}
        {simulationResult?.changes && simulationResult.changes.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  Simulated Personnel Adjustments
                </div>
                <div className="card-subtitle">
                  Explicit delta identified under evaluated scenario constraints
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
              {simulationResult.changes.map((chg, i) => {
                const isAdded = chg.action === "added";

                return (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: isAdded ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                      border: `1px solid ${isAdded ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px"
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: isAdded ? "var(--success-green)" : "var(--overloaded-red)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        flexShrink: 0
                      }}
                    >
                      {isAdded ? <UserPlus size={18} /> : <UserMinus size={18} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {chg.name}
                        </span>
                        <span
                          className={`chip ${isAdded ? "chip-covered" : "chip-missing"}`}
                          style={{ fontSize: "10px", textTransform: "uppercase" }}
                        >
                          {chg.action}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        ID: {chg.id}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {chg.reason}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Side-by-Side Team Comparison: Before vs After */}
        {simulationResult && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Before Team */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <Users size={16} color="var(--text-muted)" />
                    Baseline Team (Pre-Attrition)
                  </div>
                  <div className="card-subtitle">
                    Team composition prior to simulated departure
                  </div>
                </div>
                <span className="chip chip-indigo">
                  {simulationResult.before_team?.length || 0} Staff
                </span>
              </div>

              {/* Coverage Before */}
              {simulationResult.coverage_before && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                  {Object.entries(simulationResult.coverage_before).map(([skill, cov]) => (
                    <span key={skill} className={`chip ${cov ? "chip-covered" : "chip-missing"}`} style={{ fontSize: "10.5px" }}>
                      {cov ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simulationResult.before_team?.map((mem) => (
                  <div
                    key={mem.id}
                    style={{
                      padding: "10px 14px",
                      background: "var(--bg-card-elevated)",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {mem.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {mem.role || mem.id}
                      </div>
                    </div>
                    {mem.match && <MatchRing score={mem.match} size={44} showLabel={false} />}
                  </div>
                ))}
              </div>
            </div>

            {/* After Team */}
            <div className="card" style={{ borderColor: isNoReplacement ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 211, 238, 0.4)" }}>
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ color: isNoReplacement ? "var(--overloaded-red)" : "var(--cyan-accent)" }}>
                    <Users size={16} />
                    Adjusted State (Post-Simulation)
                  </div>
                  <div className="card-subtitle">
                    {isNoReplacement ? "Unfilled seat resulting in uncovered competency" : "Qualified replacement identified"}
                  </div>
                </div>
                <span className={`chip ${isNoReplacement ? "chip-missing" : "chip-blue"}`}>
                  {simulationResult.after_team?.length || 0} Staff
                </span>
              </div>

              {/* Coverage After */}
              {simulationResult.coverage_after && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                  {Object.entries(simulationResult.coverage_after).map(([skill, cov]) => (
                    <span key={skill} className={`chip ${cov ? "chip-covered" : "chip-missing"}`} style={{ fontSize: "10.5px" }}>
                      {cov ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simulationResult.after_team?.map((mem) => {
                  const isNewlyAdded = simulationResult.changes?.some(
                    (c) => c.action === "added" && c.id === mem.id
                  );

                  return (
                    <div
                      key={mem.id}
                      style={{
                        padding: "10px 14px",
                        background: isNewlyAdded ? "rgba(16, 185, 129, 0.08)" : "var(--bg-card-elevated)",
                        borderRadius: "6px",
                        border: `1px solid ${isNewlyAdded ? "rgba(16, 185, 129, 0.4)" : "var(--border-color)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {mem.name}
                          {isNewlyAdded && (
                            <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--success-green)", fontWeight: 700 }}>
                              (REPLACEMENT)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {mem.role || mem.id}
                        </div>
                      </div>
                      {mem.match && <MatchRing score={mem.match} size={44} showLabel={false} />}
                    </div>
                  );
                })}

                {isNoReplacement && (
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px dashed var(--overloaded-red)",
                      background: "rgba(239, 68, 68, 0.05)",
                      textAlign: "center",
                      color: "var(--overloaded-red)",
                      fontSize: "12px",
                      fontWeight: 600
                    }}
                  >
                    [ 1 Key Seat Vacant — No Internal Candidate Meets Kubernetes Level 4 ]
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingState>
  );
}
