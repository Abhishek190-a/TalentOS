import { useState, useEffect, useCallback } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Layers,
  GitCompare,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Play,
  Briefcase
} from "lucide-react";
import MatchRing from "../components/MatchRing.jsx";
import SkillBar from "../components/SkillBar.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { getProjects, recommendTeam, briefToTeam } from "../api.js";

export default function TeamBuilder({
  connectionStatus,
  onNavigate
}) {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("P001");
  const [mode, setMode] = useState("optimized"); // "optimized" or "greedy"
  const [briefText, setBriefText] = useState(
    "Build a cloud-hosted analytics platform with a Python data pipeline. Four people, 120 hours total. Require strong Python, Cloud Computing, and Data Analytics capabilities."
  );

  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const [error, setError] = useState(null);
  const [teamResult, setTeamResult] = useState(null);

  const fetchRecommendation = useCallback(async (projId, currentMode) => {
    setRecommending(true);
    setError(null);
    try {
      const res = await recommendTeam(projId, currentMode);
      setTeamResult(res.data);
    } catch (err) {
      setError(err.message || "Failed to generate team recommendation");
    } finally {
      setRecommending(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      const projList = res.data || [];
      setProjects(projList);

      const initialId = projList.find((p) => p.id === "P001")?.id || projList[0]?.id || "P001";
      setSelectedProjectId(initialId);
      await fetchRecommendation(initialId, mode);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [fetchRecommendation, mode]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, connectionStatus.isLive]);

  const handleProjectChange = (e) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    const p = projects.find((proj) => proj.id === newId);
    if (p) {
      setBriefText(p.brief || "");
    }
    fetchRecommendation(newId, mode);
  };

  const handleModeToggle = (newMode) => {
    setMode(newMode);
    fetchRecommendation(selectedProjectId, newMode);
  };

  const handleAnalyzeBrief = async () => {
    if (!briefText.trim()) return;
    setRecommending(true);
    setError(null);
    try {
      const res = await briefToTeam(briefText);
      setTeamResult(res.data);
    } catch (err) {
      setError(err.message || "Failed to parse brief requirements");
    } finally {
      setRecommending(false);
    }
  };

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <LoadingState loading={loading} error={error} onRetry={loadProjects}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* ================================================================= */}
        {/* SECTION 1: REQUIREMENTS FIRST                                     */}
        {/* ================================================================= */}
        <div className="card card-elevated">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                Project Requirements & Staffing Constraints
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Select a structured project or input an unstructured statement of work
              </div>
            </div>

            {/* Mode Toggle (Greedy vs Optimized) */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-card)",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)"
              }}
            >
              <button
                className={`btn btn-sm ${mode === "optimized" ? "btn-cyan" : "btn-outline"}`}
                style={{ borderRadius: "6px", border: "none", padding: "5px 14px" }}
                onClick={() => handleModeToggle("optimized")}
                disabled={recommending}
                title="Maximizes team-level weighted skill coverage and capacity buffer"
              >
                Optimized Combinatorial
              </button>
              <button
                className={`btn btn-sm ${mode === "greedy" ? "btn-primary" : "btn-outline"}`}
                style={{ borderRadius: "6px", border: "none", padding: "5px 14px" }}
                onClick={() => handleModeToggle("greedy")}
                disabled={recommending}
                title="Sequentially picks highest individual match candidate first"
              >
                Greedy Sequential
              </button>
            </div>
          </div>

          {/* Form fields: Project Selector + Brief */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px" }}>
            {/* Project dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="project-select">
                Target Project:
              </label>
              <select
                id="project-select"
                className="custom-select"
                value={selectedProjectId}
                onChange={handleProjectChange}
                disabled={recommending}
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} ({proj.team_size} members, {proj.hours_needed} hrs)
                  </option>
                ))}
              </select>

              {selectedProject && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    fontSize: "11.5px"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Mandatory Skill Thresholds & Weights:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {Object.entries(selectedProject.required || {}).map(([skill, req]) => (
                      <span key={skill} className="chip chip-indigo" style={{ fontSize: "10.5px" }}>
                        {skill}: Lvl {req.level} (w: {req.weight})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manager Brief Box */}
            <div className="form-group">
              <label className="form-label">
                Or Input Unstructured Statement of Work / Project Brief:
              </label>
              <textarea
                className="custom-textarea"
                rows={3}
                placeholder="Specify deliverables, tech stack, duration, and team constraints..."
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                disabled={recommending}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleAnalyzeBrief}
                  disabled={recommending || !briefText.trim()}
                >
                  <span>Extract & Align Team</span>
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => fetchRecommendation(selectedProjectId, mode)}
                  disabled={recommending}
                >
                  <Play size={13} />
                  <span>Run Recommendation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner if API returned fewer members */}
        {teamResult?.warnings && teamResult.warnings.length > 0 && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--warning-amber)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertTriangle size={15} />
            <span>{teamResult.warnings.join(" ")}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* SECTION 2: RECOMMENDATIONS SECOND                                 */}
        {/* ================================================================= */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="var(--primary-indigo)" />
              <h3 style={{ fontSize: "15px", color: "var(--text-primary)" }}>
                Recommended Team Members ({teamResult?.team?.length || 0} /{" "}
                {teamResult?.requested_team_size || selectedProject?.team_size || 4})
              </h3>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Ranked by explainable multi-objective score (Skill fit + Tenure + Capacity)
            </div>
          </div>

          {recommending ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Computing optimal candidate allocations...
            </div>
          ) : (
            <div className="team-grid">
              {teamResult?.team?.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <div key={member.id} className="member-card">
                    {/* Header: Avatar, Name, Role & Match Ring */}
                    <div className="member-header">
                      <div className="member-identity">
                        <div className="member-avatar">{initials}</div>
                        <div>
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role || "Specialist"}</div>
                          <div style={{ fontSize: "10.5px", color: "var(--cyan-accent)", marginTop: "2px" }}>
                            {member.id} • {member.assigned_hrs || 12}h assigned (
                            {Math.round((member.utilization || 0.3) * 100)}% util)
                          </div>
                        </div>
                      </div>

                      <MatchRing score={member.match} size={60} />
                    </div>

                    {/* Breakdown Contribution Bars */}
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                        Score Breakdown (0–100 pts)
                      </div>
                      <SkillBar breakdown={member.breakdown} />
                    </div>

                    {/* Deterministic Explanation */}
                    <div className="member-reason">
                      <strong>Selection Rationale: </strong>
                      {member.reason}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: EXPLANATIONS THIRD                                     */}
        {/* ================================================================= */}

        {/* Skill Coverage Verification */}
        <div className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={16} color="var(--cyan-accent)" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                Skill Coverage Verification:
              </span>
              <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                (Proficiency level ≥ 3 verified in at least one team member)
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {teamResult?.coverage &&
                Object.entries(teamResult.coverage).map(([skill, isCovered]) => (
                  <span
                    key={skill}
                    className={`chip ${isCovered ? "chip-covered" : "chip-missing"}`}
                  >
                    {isCovered ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <XCircle size={13} />
                    )}
                    <span>{skill}</span>
                    <span style={{ opacity: 0.7, fontSize: "10px" }}>
                      {isCovered ? "COVERED" : "UNCOVERED"}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Strategy Benchmark: Greedy vs Optimized */}
        {teamResult?.compare && (
          <div
            className="card"
            style={{
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0.06), rgba(34, 211, 238, 0.06))",
              border: "1px solid rgba(99, 102, 241, 0.25)"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <GitCompare size={20} color="var(--cyan-accent)" />
                <div>
                  <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Team Selection Strategy Comparison
                  </h4>
                  <p style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Greedy prioritizes individual highest-fit candidates sequentially. Optimized explores candidate combinations to maximize total weighted skill coverage.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Greedy Score</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {teamResult.compare.greedy_score.toFixed(1)}
                  </div>
                </div>

                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>vs</div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--cyan-accent)" }}>Optimized Score</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--cyan-accent)" }}>
                    {teamResult.compare.optimized_score.toFixed(1)}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--success-green)" }}>Team Coverage</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--success-green)" }}>
                    {teamResult.coverage_score ? `${teamResult.coverage_score.toFixed(1)}%` : "70.0%"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skill Gaps & Learnability Pathway Section */}
        {teamResult?.gaps && teamResult.gaps.length > 0 && (
          <div className="card" style={{ borderColor: "rgba(245, 158, 11, 0.4)" }}>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: "var(--warning-amber)" }}>
                  <GraduationCap size={18} />
                  Uncovered Skill Gaps & Upskilling Pathways
                </div>
                <div className="card-subtitle">
                  Deterministic candidate learnability scoring based on adjacent knowledge graphs
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {teamResult.gaps.map((gap) => (
                <div
                  key={gap.skill}
                  style={{
                    background: "var(--bg-card-elevated)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    padding: "16px"
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <span className="chip chip-missing" style={{ marginRight: "10px" }}>
                        Missing Skill: {gap.skill}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {gap.mentor ? (
                          <>Internal Mentor: <strong>{gap.mentor}</strong></>
                        ) : (
                          <strong style={{ color: "var(--overloaded-red)" }}>
                            No internal mentor currently owns this skill at proficiency ≥ 3
                          </strong>
                        )}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-primary)" }}>
                        <BookOpen size={14} color="var(--cyan-accent)" />
                        <span>{gap.course}</span>
                        <span className="chip chip-indigo" style={{ fontSize: "10.5px" }}>
                          {gap.weeks} Wks Duration
                        </span>
                      </div>

                      {onNavigate && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onNavigate("hiring")}
                          style={{ fontSize: "11px" }}
                        >
                          <Briefcase size={12} />
                          <span>Open Requisition</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Top Learners List */}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
                      Top Recommended Internal Learners (Adjacent Knowledge Affinity):
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                      {gap.learners.map((learner, idx) => (
                        <div
                          key={learner.id}
                          style={{
                            padding: "10px 14px",
                            background: "var(--bg-card)",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                              #{idx + 1} {learner.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              ID: {learner.id} • Foundation in Pandas/SQL
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--cyan-accent)" }}>
                              {Math.round(learner.score * 100)}%
                            </div>
                            <div style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>LEARNABILITY</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </LoadingState>
  );
}
