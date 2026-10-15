import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Flame,
  ArrowRight,
  Briefcase,
  GitCompare,
  Info
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import { getRisks } from "../api.js";

export default function Risks({ connectionStatus, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [risksData, setRisksData] = useState(null);

  const loadRisks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRisks();
      setRisksData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load organizational risks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRisks();
  }, [loadRisks, connectionStatus.isLive]);

  const busFactorList = risksData?.bus_factor || [];
  const burnoutList = risksData?.burnout || [];

  return (
    <LoadingState loading={loading} error={error} onRetry={loadRisks}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Intro Banner */}
        <div className="card card-elevated">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #EF4444, #F59E0B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}
              >
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                  Workforce Risk & Single-Point-of-Failure Audit
                </h2>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Calculated indicators based on competency distributions and capacity commitments (not confirmed incidents)
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate("whatif")}
              >
                <GitCompare size={13} />
                <span>Contingency Planning</span>
              </button>
              <button
                className="btn btn-cyan btn-sm"
                onClick={() => onNavigate("workload")}
              >
                <ArrowRight size={13} />
                <span>Workload Balancer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Bus Factor Single-Owner Vulnerabilities */}
        <div className="card" style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}>
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: "var(--overloaded-red)" }}>
                <ShieldAlert size={18} />
                Single-Owner Competency Audit (Bus Factor ≤ 1)
              </div>
              <div className="card-subtitle">
                Canonical skills in the organization with ≤ 1 certified staff member (proficiency level ≥ 3)
              </div>
            </div>
            <span className="chip chip-missing">
              {busFactorList.length} Vulnerabilities Tracked
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
            {busFactorList.map((item, idx) => {
              const isZero = item.qualified_employee_count === 0 || !item.owner;

              return (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card-elevated)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {item.skill}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Qualified Staff: <strong>{item.qualified_employee_count}</strong>
                        </div>
                      </div>

                      <span
                        className={`chip ${isZero ? "chip-missing" : "chip-amber"}`}
                        style={{ fontSize: "10.5px" }}
                      >
                        {isZero ? "0 QUALIFIED OWNERS" : "SOLE OWNER (BUS FACTOR = 1)"}
                      </span>
                    </div>

                    {/* Owner status */}
                    <div
                      style={{
                        padding: "10px",
                        background: "rgba(0, 0, 0, 0.25)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      {isZero ? (
                        <>
                          <UserX size={16} color="var(--overloaded-red)" />
                          <div style={{ fontSize: "12px", color: "var(--overloaded-red)", fontWeight: 600 }}>
                            Zero qualified internal staff currently hold certification (level ≥ 3).
                          </div>
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} color="var(--cyan-accent)" />
                          <div style={{ fontSize: "12px", color: "var(--text-primary)" }}>
                            Sole Qualified Owner: <strong>{item.owner}</strong> {item.owner_id && `(${item.owner_id})`}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Risk narrative */}
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {item.explanation ||
                        (isZero
                          ? "Project demands requiring this competency must rely on external hiring or extended training."
                          : "If this sole individual takes leave or transitions projects, all related deployments become blocked.")}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigate("whatif")}
                      style={{ fontSize: "11px" }}
                    >
                      <GitCompare size={12} />
                      <span>Simulate Attrition</span>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onNavigate("hiring")}
                      style={{ fontSize: "11px" }}
                    >
                      <Briefcase size={12} />
                      <span>Open Requisition</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Burnout & Overload Risks */}
        <div className="card" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: "var(--warning-amber)" }}>
                <Flame size={18} />
                Calculated Burnout Risk Indicators (Capacity &gt; 90%)
              </div>
              <div className="card-subtitle">
                Employees exceeding or near standard 40h work-week baseline (calculated metric, not clinical diagnosis)
              </div>
            </div>
            <span className="chip chip-amber">{burnoutList.length} Staff Monitored</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
            {burnoutList.map((emp) => {
              const utilPct = Math.round((emp.util || (emp.assigned_hrs ? emp.assigned_hrs / 40 : 1.0)) * 100);
              const isHigh = emp.risk === "high" || utilPct > 100;

              return (
                <div
                  key={emp.id}
                  style={{
                    background: "var(--bg-card-elevated)",
                    borderRadius: "10px",
                    border: `1px solid ${isHigh ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "14px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {emp.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                          {emp.role || "Senior Staff"} • ID: {emp.id}
                        </div>
                      </div>

                      <span
                        className={`chip ${isHigh ? "chip-missing" : "chip-amber"}`}
                        style={{ fontSize: "11px" }}
                      >
                        {isHigh ? "OVER CAPACITY (>100%)" : "ELEVATED RISK (90–100%)"}
                      </span>
                    </div>

                    {/* Progress Bar & Capacity */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>Capacity Allocation</span>
                        <span style={{ fontWeight: 700, color: isHigh ? "var(--overloaded-red)" : "var(--warning-amber)" }}>
                          {utilPct}% ({emp.assigned_hrs || Math.round(utilPct * 0.4)} hrs / 40h standard)
                        </span>
                      </div>
                      <div className="skill-bar-track" style={{ height: "8px" }}>
                        <div
                          className="skill-bar-fill"
                          style={{
                            width: `${Math.min(utilPct, 100)}%`,
                            background: isHigh ? "var(--overloaded-red)" : "var(--warning-amber)"
                          }}
                        />
                      </div>
                    </div>

                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {emp.explanation ||
                        (isHigh
                          ? "Assigned significantly above 40h baseline. Task delegation recommended via Workload Balancer."
                          : "Approaching operational ceiling with minimal buffer for unexpected operational demand.")}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onNavigate("workload")}
                      style={{ fontSize: "11px" }}
                    >
                      <span>Review Reassignments</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-color)", fontSize: "11.5px", color: "var(--text-muted)" }}>
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Calculated risk scores represent algorithmic decision support from recorded hours and skill profiles. Real-world incident mitigation requires verified operational sign-off.</span>
        </div>
      </div>
    </LoadingState>
  );
}
