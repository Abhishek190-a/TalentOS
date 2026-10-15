import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Activity,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Layers,
  Briefcase
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import StatCard from "../components/StatCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { getWorkload, getRisks } from "../api.js";

export default function Dashboard({ onNavigate, connectionStatus }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workloadData, setWorkloadData] = useState(null);
  const [risksData, setRisksData] = useState(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [wlRes, riskRes] = await Promise.all([
        getWorkload(),
        getRisks()
      ]);
      setWorkloadData(wlRes.data);
      setRisksData(riskRes.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, connectionStatus.isLive]);

  // Group workforce into utilization distribution bands for Recharts
  const distributionData = [
    { band: "Underutilized (<50%)", count: 2, color: "#3B82F6", hint: "Ananya Rao (30%), Arjun Nair (30%)" },
    { band: "Optimal (50-89%)", count: 36, color: "#10B981", hint: "36 Engineers within sustainable limits" },
    { band: "Elevated (90-100%)", count: 1, color: "#F59E0B", hint: "Ishaan Das (95%)" },
    { band: "Overloaded (>100%)", count: 1, color: "#EF4444", hint: "Ravi Kumar (130%)" }
  ];

  // Core canonical skills qualification summary
  const coreSkills = [
    { name: "Python", qualified: 18, total: 40, status: "healthy" },
    { name: "Cloud Computing", qualified: 12, total: 40, status: "healthy" },
    { name: "Docker", qualified: 14, total: 40, status: "healthy" },
    { name: "SQL", qualified: 22, total: 40, status: "healthy" },
    { name: "Kubernetes", qualified: 1, total: 40, status: "critical", note: "Sole Owner: Priya Menon" },
    { name: "Data Analytics", qualified: 0, total: 40, status: "gap", note: "Zero Certified Owners" }
  ];

  return (
    <LoadingState loading={loading} error={error} onRetry={loadDashboardData}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Top 4 KPI StatCards */}
        <div className="bento-grid bento-4-col">
          <StatCard
            icon={Users}
            number={workloadData?.employees?.length || 40}
            label="Total Workforce"
            subtext="40 Engineering Staff"
            color="indigo"
          />
          <StatCard
            icon={Activity}
            number={`${Math.round((workloadData?.average_utilization || 0.72) * 100)}%`}
            label="Average Utilization"
            subtext="Sustainable Band: 65% – 85%"
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            number={risksData?.burnout?.length || 2}
            label="Critical Workload Risks"
            subtext="1 Overloaded, 1 Approaching Ceiling"
            color="red"
            onClick={() => onNavigate("workload")}
          />
          <StatCard
            icon={ShieldAlert}
            number={2}
            label="Vulnerable Competencies"
            subtext="1 Single-Owner, 1 Organization Gap"
            color="amber"
            onClick={() => onNavigate("risks")}
          />
        </div>

        {/* Row 2: Capacity Distribution & Prioritized Actionable Alerts */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
          {/* Workforce Utilization Distribution */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Activity size={16} color="var(--primary-indigo)" />
                  Workforce Utilization Distribution
                </div>
                <div className="card-subtitle">
                  Headcount distribution categorized by operational capacity thresholds
                </div>
              </div>
            </div>

            <div style={{ height: "230px", width: "100%", marginTop: "8px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="band"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#151E2E",
                      borderColor: "#1F2937",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                      fontSize: "12px"
                    }}
                    formatter={(val, name, item) => [`${val} Engineers (${item.payload.hint})`, "Headcount"]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actionable Alerts Feed */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <ShieldAlert size={16} color="var(--overloaded-red)" />
                  Prioritized Actionable Alerts
                </div>
                <div className="card-subtitle">
                  Immediate operational risk items requiring managerial triage
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Alert 1: Overload */}
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Acute Overload: Ravi Kumar (130%)
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    52 assigned hrs / 40h capacity. Zero availability buffer.
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate("workload")}
                  style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                >
                  <span>Rebalance</span>
                  <ArrowRight size={11} />
                </button>
              </div>

              {/* Alert 2: Bus Factor */}
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Single-Owner Dependency: Kubernetes
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Priya Menon is the sole qualified owner (level 4).
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate("whatif")}
                  style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                >
                  <span>Contingency</span>
                  <ArrowRight size={11} />
                </button>
              </div>

              {/* Alert 3: Critical Gap */}
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(34, 211, 238, 0.06)",
                  border: "1px solid rgba(34, 211, 238, 0.25)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Missing Competency: Data Analytics
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Zero internal owners. External hiring or upskilling needed.
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate("hiring")}
                  style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                >
                  <span>Open Requisition</span>
                  <Briefcase size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Skill Coverage & Workload Rebalancing Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
          {/* Skill Distribution Matrix */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Layers size={16} color="var(--cyan-accent)" />
                  Workforce Skill Matrix & Qualification Health
                </div>
                <div className="card-subtitle">
                  Engineers certified at proficiency level ≥ 3 across key technology domains
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {coreSkills.map((sk) => (
                <div
                  key={sk.name}
                  style={{
                    padding: "12px",
                    background: "var(--bg-card-elevated)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {sk.name}
                    </span>
                    {sk.status === "healthy" && (
                      <span className="chip chip-covered" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        <CheckCircle2 size={10} /> {sk.qualified} Qualified
                      </span>
                    )}
                    {sk.status === "critical" && (
                      <span className="chip chip-missing" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        1 Owner
                      </span>
                    )}
                    {sk.status === "gap" && (
                      <span className="chip chip-missing" style={{ fontSize: "10px", padding: "2px 6px" }}>
                        0 Owners
                      </span>
                    )}
                  </div>

                  <div className="skill-bar-track" style={{ height: "4px", marginBottom: "6px" }}>
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: `${(sk.qualified / sk.total) * 100}%`,
                        background:
                          sk.status === "gap"
                            ? "var(--overloaded-red)"
                            : sk.status === "critical"
                            ? "var(--warning-amber)"
                            : "var(--cyan-accent)"
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                    {sk.note || `${sk.qualified} of 40 staff qualified`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Rebalancing Overview */}
          <div className="card card-elevated" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <TrendingDown size={17} color="var(--cyan-accent)" />
                    Workload Balancing Overview
                  </div>
                  <div className="card-subtitle">
                    Projected variance reduction upon pending task reassignment
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Variance Improvement</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--cyan-accent)", margin: "4px 0" }}>
                    -32.0%
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>0.0412 → 0.0280</div>
                </div>

                <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Pending Reallocation</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--success-green)", margin: "4px 0" }}>
                    8 Hours
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>From Ravi to Ananya</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-outline btn-sm" onClick={() => onNavigate("workload")}>
                <span>Manage Workload Decisions</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoadingState>
  );
}
