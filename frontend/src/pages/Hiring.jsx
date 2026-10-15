import { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
  Layers,
  Sparkles
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import MatchRing from "../components/MatchRing.jsx";
import {
  getHiringRequests,
  createHiringRequest,
  updateHiringRequestStatus,
  getCandidateMatches,
  getProjects
} from "../api.js";

export default function Hiring({ prefillData, onClearPrefill }) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [candidatesResult, setCandidatesResult] = useState(null);
  const [showCandidatePreview, setShowCandidatePreview] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    project_id: "P005",
    project_name: "Kubernetes Deployment Upgrade",
    department: "Platform Engineering",
    required_skills: { Kubernetes: 4, Docker: 3 },
    min_experience_years: 5,
    openings: 1,
    priority: "urgent",
    salary_range: "$130,000 - $155,000",
    required_by: "2026-11-15",
    justification: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(3);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, projRes] = await Promise.all([
        getHiringRequests(),
        getProjects()
      ]);
      setRequests(reqRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle prefill from Contingency Planning
  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        title: prefillData.title || prev.title,
        project_id: prefillData.project_id || prev.project_id,
        project_name: prefillData.project_name || prev.project_name,
        department: prefillData.department || prev.department,
        required_skills: prefillData.required_skills || prev.required_skills,
        priority: prefillData.priority || "urgent",
        required_by: prefillData.required_by || prev.required_by,
        justification: prefillData.justification || prev.justification
      }));
      setIsModalOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillData, onClearPrefill]);

  // Handle candidate match preview
  const handleInspectRequest = async (req) => {
    setSelectedRequest(req);
    try {
      const matchRes = await getCandidateMatches(req.id);
      setCandidatesResult(matchRes.data);
    } catch {
      setCandidatesResult(null);
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Job/role title is required.";
    }
    if (Object.keys(formData.required_skills).length === 0) {
      errors.skills = "At least one required skill must be specified.";
    }
    if (!formData.openings || Number(formData.openings) < 1) {
      errors.openings = "Number of openings must be at least 1.";
    }
    if (!formData.justification.trim() || formData.justification.trim().length < 10) {
      errors.justification = "Business justification is required (minimum 10 characters).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSkill = () => {
    const skill = newSkillName.trim();
    if (!skill) return;
    setFormData((prev) => ({
      ...prev,
      required_skills: {
        ...prev.required_skills,
        [skill]: Number(newSkillLevel)
      }
    }));
    setNewSkillName("");
    setNewSkillLevel(3);
  };

  const handleRemoveSkill = (skillName) => {
    setFormData((prev) => {
      const nextSkills = { ...prev.required_skills };
      delete nextSkills[skillName];
      return { ...prev, required_skills: nextSkills };
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const proj = projects.find((p) => p.id === formData.project_id);
    const payload = {
      ...formData,
      project_name: proj ? proj.name : formData.project_name,
      openings: Number(formData.openings),
      min_experience_years: Number(formData.min_experience_years)
    };

    const res = await createHiringRequest(payload);
    if (res.data) {
      setRequests((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        title: "",
        project_id: "P001",
        project_name: "Cloud Analytics Platform",
        department: "Engineering",
        required_skills: { Python: 4 },
        min_experience_years: 4,
        openings: 1,
        priority: "medium",
        salary_range: "$120,000 - $140,000",
        required_by: "2026-12-01",
        justification: ""
      });
      setFormErrors({});
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const res = await updateHiringRequestStatus(requestId, newStatus);
    if (res.data) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
      }
    }
  };

  // Filtered requests list
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Overview counts
  const openCount = requests.filter((r) => r.status === "open").length;
  const urgentCount = requests.filter((r) => r.priority === "urgent" && r.status !== "filled").length;
  const inReviewCount = requests.filter((r) => r.status === "in_review").length;
  const filledCount = requests.filter((r) => r.status === "filled").length;

  return (
    <LoadingState loading={loading}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Top KPI StatCards */}
        <div className="bento-grid bento-4-col">
          <StatCard
            icon={Briefcase}
            number={openCount}
            label="Open Requisitions"
            subtext="Active recruitment postings"
            color="indigo"
          />
          <StatCard
            icon={AlertTriangle}
            number={urgentCount}
            label="Critical Vacancies"
            subtext="High or urgent delivery impact"
            color="red"
          />
          <StatCard
            icon={Users}
            number={inReviewCount}
            label="Requisitions In Review"
            subtext="Candidate interviews in progress"
            color="amber"
          />
          <StatCard
            icon={CheckCircle2}
            number={filledCount}
            label="Filled Requisitions"
            subtext="Completed headcount cycles"
            color="green"
          />
        </div>

        {/* Action Header & Filter Bar */}
        <div className="card card-elevated">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                Talent Requisitions & External Sourcing Pipeline
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Manage requisition lifecycle: Draft → Open → In Review → Filled
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                className="btn btn-cyan btn-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={14} />
                <span>Create Requisition</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["all", "open", "in_review", "filled", "cancelled"].map((st) => (
                <button
                  key={st}
                  className={`btn btn-sm ${filterStatus === st ? "btn-secondary" : "btn-outline"}`}
                  style={{ textTransform: "capitalize", fontSize: "11px", padding: "4px 10px" }}
                  onClick={() => setFilterStatus(st)}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <div style={{ width: "240px" }}>
              <input
                type="text"
                className="custom-input"
                placeholder="Search requisitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "12px", padding: "6px 10px" }}
              />
            </div>
          </div>
        </div>

        {/* Main Grid: Requisitions List + Selected Details / Matching */}
        <div style={{ display: "grid", gridTemplateColumns: selectedRequest ? "1.2fr 1.4fr" : "1fr", gap: "20px" }}>
          {/* Requisitions List Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  Requisitions Roster ({filteredRequests.length})
                </div>
                <div className="card-subtitle">
                  Select a requisition to review qualification criteria and candidate matching
                </div>
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No requisitions match the selected criteria.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Req ID</th>
                      <th>Title & Project</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => {
                      const isSelected = selectedRequest?.id === req.id;
                      return (
                        <tr
                          key={req.id}
                          style={{
                            background: isSelected ? "rgba(99, 102, 241, 0.08)" : "transparent",
                            cursor: "pointer"
                          }}
                          onClick={() => handleInspectRequest(req)}
                        >
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                            {req.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {req.title}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                              {req.project_name || req.department} • {req.openings} opening(s)
                            </div>
                          </td>
                          <td>
                            <span
                              className={`chip ${
                                req.priority === "urgent"
                                  ? "chip-missing"
                                  : req.priority === "high"
                                  ? "chip-amber"
                                  : "chip-indigo"
                              }`}
                              style={{ fontSize: "10px", textTransform: "uppercase" }}
                            >
                              {req.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`chip ${
                                req.status === "open"
                                  ? "chip-covered"
                                  : req.status === "in_review"
                                  ? "chip-blue"
                                  : req.status === "filled"
                                  ? "chip-covered"
                                  : "chip-missing"
                              }`}
                              style={{ fontSize: "10px", textTransform: "capitalize" }}
                            >
                              {req.status?.replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectRequest(req);
                              }}
                              style={{ fontSize: "10.5px", padding: "3px 8px" }}
                            >
                              <span>Inspect</span>
                              <ChevronRight size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Requisition Details & Candidate Matching Drawer */}
          {selectedRequest && (
            <div className="card card-elevated" style={{ borderColor: "rgba(99, 102, 241, 0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--cyan-accent)", fontSize: "12px", fontWeight: 700 }}>
                      {selectedRequest.id}
                    </span>
                    <h3 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                      {selectedRequest.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Project: <strong>{selectedRequest.project_name}</strong> • Dept: {selectedRequest.department}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Transition Control */}
              <div style={{ padding: "10px 14px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  Lifecycle Status: <strong style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{selectedRequest.status.replace("_", " ")}</strong>
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  {selectedRequest.status !== "open" && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleStatusChange(selectedRequest.id, "open")}
                      style={{ fontSize: "10.5px" }}
                    >
                      Move to Open
                    </button>
                  )}
                  {selectedRequest.status !== "in_review" && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleStatusChange(selectedRequest.id, "in_review")}
                      style={{ fontSize: "10.5px" }}
                    >
                      Move to In Review
                    </button>
                  )}
                  {selectedRequest.status !== "filled" && (
                    <button
                      className="btn btn-cyan btn-sm"
                      onClick={() => handleStatusChange(selectedRequest.id, "filled")}
                      style={{ fontSize: "10.5px" }}
                    >
                      Mark Filled
                    </button>
                  )}
                  {selectedRequest.status !== "cancelled" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusChange(selectedRequest.id, "cancelled")}
                      style={{ fontSize: "10.5px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Requisition Details Meta */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px", fontSize: "11.5px" }}>
                <div style={{ padding: "8px 12px", background: "var(--bg-card)", borderRadius: "6px" }}>
                  <div style={{ color: "var(--text-muted)" }}>Target Skills & Required Levels</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                    {Object.entries(selectedRequest.required_skills || {}).map(([sk, lvl]) => (
                      <span key={sk} className="chip chip-indigo" style={{ fontSize: "10px" }}>
                        {sk}: Lvl {lvl}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "8px 12px", background: "var(--bg-card)", borderRadius: "6px" }}>
                  <div style={{ color: "var(--text-muted)" }}>Timeline & Budget</div>
                  <div style={{ color: "var(--text-primary)", marginTop: "4px" }}>
                    Target Date: {selectedRequest.required_by || "ASAP"} • {selectedRequest.salary_range || "Market Rate"}
                  </div>
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "6px", fontSize: "11.5px", color: "var(--text-secondary)", marginBottom: "18px", lineHeight: 1.45 }}>
                <strong>Operational Justification: </strong>
                {selectedRequest.justification}
              </div>

              {/* Candidate Matching Section */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      External Candidate Matching Alignment
                    </h4>
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      Integration Endpoint: <code>POST /hiring/candidates/match</code>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowCandidatePreview(!showCandidatePreview)}
                    style={{ fontSize: "10.5px" }}
                  >
                    <span>{showCandidatePreview ? "Hide Preview" : "Toggle Alignment Preview"}</span>
                  </button>
                </div>

                {/* Integration Notice / Empty State */}
                {!showCandidatePreview ? (
                  <div style={{ padding: "20px", background: "var(--bg-card)", borderRadius: "8px", border: "1px dashed var(--border-color)", textAlign: "center" }}>
                    <Users size={24} color="var(--text-muted)" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                      Candidate Matching Service Pending
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", maxWidth: "380px", margin: "4px auto 10px" }}>
                      Automated candidate scoring will activate once external applicant tracking (ATS) or candidate profile records are connected.
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowCandidatePreview(true)}
                      style={{ fontSize: "11px" }}
                    >
                      <Sparkles size={12} />
                      <span>View Sample Match Structure</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ padding: "6px 10px", background: "rgba(34, 211, 238, 0.08)", borderRadius: "4px", fontSize: "10.5px", color: "var(--cyan-accent)" }}>
                      Sample Schema Preview: Evaluated against {selectedRequest.title} requirements
                    </div>

                    {candidatesResult?.candidates?.map((cand) => (
                      <div
                        key={cand.candidate_id}
                        style={{
                          padding: "12px",
                          background: "var(--bg-card)",
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "13px" }}>
                              {cand.name}
                            </span>
                            <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                              {cand.candidate_id} • {cand.years_experience} yrs exp
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "3px" }}>
                            {cand.match_explanation}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--cyan-accent)", marginTop: "4px" }}>
                            Availability: {cand.availability} • Expectation: {cand.expected_salary}
                          </div>
                        </div>

                        <MatchRing score={cand.match_score} size={48} showLabel={false} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section: Internal vs External Options Comparison */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Layers size={16} color="var(--cyan-accent)" />
                Workforce Sourcing Strategic Options Comparison
              </div>
              <div className="card-subtitle">
                Trade-off analysis comparing external recruitment with internal upskilling and workload redistribution
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, color: "var(--cyan-accent)", fontSize: "13px" }}>A. External Hiring</span>
                <span className="chip chip-amber" style={{ fontSize: "10px" }}>4–8 Wks</span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Directly acquires certified senior proficiency without diluting existing teams. Involves external sourcing cycle and market compensation.
              </p>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, color: "var(--primary-indigo)", fontSize: "13px" }}>B. Internal Upskilling</span>
                <span className="chip chip-indigo" style={{ fontSize: "10px" }}>2–4 Wks</span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Builds long-term organizational resilience and promotes retention. Unsuitable for emergency zero-day delivery shortfalls without senior mentor guidance.
              </p>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, color: "var(--success-green)", fontSize: "13px" }}>C. Work Redistribution</span>
                <span className="chip chip-covered" style={{ fontSize: "10px" }}>1–2 Days</span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Immediate operational relief by transferring generic tasks to underutilized staff. Requires certified staff to oversee critical specialized workflows.
              </p>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-card-elevated)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "13px" }}>D. Scope Adjustment</span>
                <span className="chip chip-blue" style={{ fontSize: "10px" }}>Immediate</span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Realigns deliverable milestones or defers non-critical modules to avoid operational burnout. Requires stakeholder alignment on roadmaps.
              </p>
            </div>
          </div>
        </div>

        {/* Modal: Create Requisition Form */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <div
              className="card card-elevated"
              style={{
                width: "600px",
                maxWidth: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid var(--border-color-light)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                    Create Talent Acquisition Requisition
                  </h3>
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                    Fill required position requirements and business justification
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Position / Role Title *</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Platform & Kubernetes Specialist"
                  />
                  {formErrors.title && (
                    <span style={{ fontSize: "11px", color: "var(--overloaded-red)" }}>{formErrors.title}</span>
                  )}
                </div>

                {/* Project & Department */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Associated Project</label>
                    <select
                      className="custom-select"
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Unit</label>
                    <input
                      type="text"
                      className="custom-input"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>

                {/* Skills Builder */}
                <div className="form-group">
                  <label className="form-label">Required Skills & Proficiency Levels (1–5) *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                    {Object.entries(formData.required_skills).map(([sk, lvl]) => (
                      <span key={sk} className="chip chip-indigo" style={{ gap: "6px", fontSize: "11px" }}>
                        <span>{sk}: Level {lvl}</span>
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveSkill(sk)}
                        />
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="Skill name (e.g. Kubernetes)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <select
                      className="custom-select"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      style={{ width: "100px" }}
                    >
                      <option value={1}>Lvl 1</option>
                      <option value={2}>Lvl 2</option>
                      <option value={3}>Lvl 3</option>
                      <option value={4}>Lvl 4</option>
                      <option value={5}>Lvl 5</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddSkill}
                    >
                      Add Skill
                    </button>
                  </div>
                  {formErrors.skills && (
                    <span style={{ fontSize: "11px", color: "var(--overloaded-red)" }}>{formErrors.skills}</span>
                  )}
                </div>

                {/* Openings, Experience, Priority */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div className="form-group">
                    <label className="form-label">Openings *</label>
                    <input
                      type="number"
                      min={1}
                      className="custom-input"
                      value={formData.openings}
                      onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Experience (Yrs)</label>
                    <input
                      type="number"
                      min={0}
                      className="custom-input"
                      value={formData.min_experience_years}
                      onChange={(e) => setFormData({ ...formData, min_experience_years: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="custom-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Salary & Date */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                  <div className="form-group">
                    <label className="form-label">Salary / Budget Range (Optional)</label>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="e.g. $130,000 - $155,000"
                      value={formData.salary_range}
                      onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Required-By Date</label>
                    <input
                      type="date"
                      className="custom-input"
                      value={formData.required_by}
                      onChange={(e) => setFormData({ ...formData, required_by: e.target.value })}
                    />
                  </div>
                </div>

                {/* Justification */}
                <div className="form-group">
                  <label className="form-label">Operational & Business Justification *</label>
                  <textarea
                    className="custom-textarea"
                    rows={3}
                    placeholder="Describe delivery risk, missing competencies, or client commitments justifying external sourcing..."
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  />
                  {formErrors.justification && (
                    <span style={{ fontSize: "11px", color: "var(--overloaded-red)" }}>{formErrors.justification}</span>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cyan btn-sm">
                    Submit Requisition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LoadingState>
  );
}
