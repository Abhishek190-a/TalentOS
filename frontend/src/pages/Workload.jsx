import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";
import LoadingState from "../components/LoadingState.jsx";
import { getWorkload, rebalanceWorkload } from "../api.js";

export default function Workload({ connectionStatus, searchTerm }) {
  const [loading, setLoading] = useState(true);
  const [rebalancing, setRebalancing] = useState(false);
  const [error, setError] = useState(null);
  const [workloadData, setWorkloadData] = useState(null);
  const [rebalanceResult, setRebalanceResult] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "overloaded", "idle", "balanced"

  const loadWorkload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkload();
      setWorkloadData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load workload distribution");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkload();
  }, [loadWorkload, connectionStatus.isLive]);

  const handleRunRebalance = async () => {
    setRebalancing(true);
    try {
      const res = await rebalanceWorkload({});
      setRebalanceResult(res.data);
    } catch (err) {
      setError(err.message || "Failed to calculate rebalance proposals");
    } finally {
      setRebalancing(false);
    }
  };

  const handleReset = () => {
    setRebalanceResult(null);
    loadWorkload();
  };

  // Determine which employee list to show (proposed preview or baseline)
  const activeEmployees = rebalanceResult
    ? workloadData?.employees?.map((emp) => {
        const afterItem = rebalanceResult.after?.per_emp?.find((p) => p.id === emp.id);
        if (afterItem) {
          return {
            ...emp,
            assigned_hrs: afterItem.assigned_hrs,
            utilization: afterItem.utilization,
            isProposedReassignment: emp.assigned_hrs !== afterItem.assigned_hrs
          };
        }
        return emp;
      })
    : workloadData?.employees || [];

  // Filter employees for table
  const filteredEmployees = activeEmployees.filter((emp) => {
    const matchesSearch =
      !searchTerm ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "overloaded") return emp.utilization > 1.0;
    if (filterType === "idle") return emp.utilization < 0.5;
    if (filterType === "balanced")
      return emp.utilization >= 0.5 && emp.utilization <= 1.0;
    return true;
  });

  // Chart data: sample first 24 sorted by utilization descending
  const chartEmployees = [...activeEmployees]
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 24)
    .map((e) => ({
      name: e.name.split(" ")[0],
      fullName: e.name,
      id: e.id,
      utilizationPct: Math.round(e.utilization * 100),
      utilization: e.utilization,
      assigned_hrs: e.assigned_hrs,
      capacity_hrs: e.capacity_hrs || 40,
      color:
        e.utilization > 1.0
          ? "#EF4444"
          : e.utilization < 0.5
          ? "#3B82F6"
          : "#10B981"
    }));

  return (
    <LoadingState loading={loading} error={error} onRetry={loadWorkload}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Top Control & Impact Summary */}
        <div className="card card-elevated">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #4F46E5, var(--cyan-accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}
              >
                <BarChart3 size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                  Workforce Allocation & Load Balancing
                </h2>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Analyze capacity bottlenecks, alleviate burnout, and evaluate skill-safe task transfers
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {rebalanceResult ? (
                <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                  <RotateCcw size={13} />
                  <span>Clear Proposed Reassignments</span>
                </button>
              ) : (
                <button
                  className="btn btn-cyan"
                  onClick={handleRunRebalance}
                  disabled={rebalancing}
                >
                  <Sparkles size={14} />
                  <span>{rebalancing ? "Calculating Proposals..." : "Calculate Rebalance Proposals"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Variance & Capacity Benchmark Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginTop: "18px" }}>
            <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Current Variance</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "4px 0" }}>
                {rebalanceResult ? rebalanceResult.after?.variance : workloadData?.variance || 0.0412}
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>
                {rebalanceResult ? "Projected post-reassignment" : "Baseline across 40 staff"}
              </div>
            </div>

            <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Average Utilization</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--success-green)", margin: "4px 0" }}>
                {Math.round((workloadData?.average_utilization || 0.72) * 100)}%
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>Target Band: 65% – 85%</div>
            </div>

            <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Overloaded (&gt;100%)</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--overloaded-red)", margin: "4px 0" }}>
                {rebalanceResult ? "0 (Proposed Relief)" : workloadData?.overloaded_count || 1}
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>
                {rebalanceResult ? "Ravi proposed at 110%" : "Ravi Kumar (130%)"}
              </div>
            </div>

            <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Underutilized (&lt;50%)</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--idle-blue)", margin: "4px 0" }}>
                {rebalanceResult ? "1" : workloadData?.idle_count || 2}
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>Ananya proposed +8h</div>
            </div>
          </div>
        </div>

        {/* Proposed Reassignments Panel (Clearly labeled as Pending Decisions) */}
        {rebalanceResult && (
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(34, 211, 238, 0.06))",
              borderColor: "rgba(16, 185, 129, 0.4)"
            }}
          >
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: "var(--success-green)" }}>
                  <ShieldCheck size={18} />
                  Pending Reassignment Proposals (Awaiting Operational Approval)
                </div>
                <div className="card-subtitle">
                  Simulated decision support proposal. No live workforce data has been modified.
                </div>
              </div>
              <span className="chip chip-covered">
                {rebalanceResult.impact?.variance_drop_pct || 32.0}% Projected Variance Drop
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginTop: "10px" }}>
              {/* Metric Impact */}
              <div style={{ padding: "16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Variance Shift:
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "line-through" }}>
                    {rebalanceResult.before?.variance}
                  </span>
                  <ArrowRight size={18} color="var(--cyan-accent)" />
                  <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--cyan-accent)" }}>
                    {rebalanceResult.after?.variance}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "10px" }}>
                  Total Hours Proposed for Move: <strong>{rebalanceResult.impact?.hours_moved || 8} hrs</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", color: "var(--text-muted)", marginTop: "12px" }}>
                  <Info size={13} />
                  <span>Recipient assignments will not exceed standard 40h capacity.</span>
                </div>
              </div>

              {/* Proposed Transfer Moves List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {rebalanceResult.moves?.map((move, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="chip chip-missing" style={{ fontSize: "10.5px" }}>
                        FROM: {move.from_name || move.from} (130% → 110%)
                      </span>
                      <ArrowRight size={14} color="var(--cyan-accent)" />
                      <span className="chip chip-covered" style={{ fontSize: "10.5px" }}>
                        TO: {move.to_name || move.to} (30% → 50%)
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="chip chip-indigo">Skill: {move.skill}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {move.hours} hrs/week
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Utilization Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BarChart3 size={16} color="var(--cyan-accent)" />
                Workforce Capacity Utilization Chart
              </div>
              <div className="card-subtitle">
                Individual utilization ratio (ratio 1.3 = 130%). Red: &gt;100%, Green: 50–100%, Blue: &lt;50%.
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="chip chip-missing" style={{ fontSize: "10px" }}>Overloaded (&gt;100%)</span>
              <span className="chip chip-covered" style={{ fontSize: "10px" }}>Balanced (50–100%)</span>
              <span className="chip chip-blue" style={{ fontSize: "10px" }}>Underutilized (&lt;50%)</span>
            </div>
          </div>

          <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartEmployees} margin={{ top: 15, right: 10, left: -10, bottom: 35 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  unit="%"
                  domain={[0, 140]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151E2E",
                    borderColor: "#1F2937",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                    fontSize: "12px"
                  }}
                  formatter={(val, name, item) => [
                    `${val}% (${item.payload.assigned_hrs}h / ${item.payload.capacity_hrs}h)`,
                    item.payload.fullName
                  ]}
                />
                <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "100% Capacity Ceiling", fill: "#EF4444", fontSize: 10, position: "top" }} />
                <ReferenceLine y={50} stroke="#3B82F6" strokeDasharray="3 3" label={{ value: "50% Underutilization", fill: "#3B82F6", fontSize: 10, position: "bottom" }} />
                <Bar dataKey="utilizationPct" radius={[4, 4, 0, 0]}>
                  {chartEmployees.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Employee Roster Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                Workforce Capacity Roster ({filteredEmployees.length} profiles)
              </div>
              <div className="card-subtitle">
                Filter by capacity status to target workloads for intake or delegation
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "6px" }}>
              {["all", "overloaded", "balanced", "idle"].map((t) => (
                <button
                  key={t}
                  className={`btn btn-sm ${filterType === t ? "btn-secondary" : "btn-outline"}`}
                  style={{ textTransform: "capitalize", fontSize: "11px" }}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Assigned / Capacity</th>
                  <th>Utilization (%)</th>
                  <th>Status Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const utilPct = Math.round(emp.utilization * 100);
                  let badge = <span className="chip chip-covered">Optimal</span>;
                  if (emp.utilization > 1.0) {
                    badge = <span className="chip chip-missing">Overloaded</span>;
                  } else if (emp.utilization > 0.9) {
                    badge = <span className="chip chip-amber">Near Ceiling</span>;
                  } else if (emp.utilization < 0.5) {
                    badge = <span className="chip chip-blue">Underutilized</span>;
                  }

                  return (
                    <tr key={emp.id}>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
                        {emp.id}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {emp.name}
                        {emp.isProposedReassignment && (
                          <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--cyan-accent)" }}>
                            (Proposed Shift)
                          </span>
                        )}
                      </td>
                      <td>{emp.role || "Engineer"}</td>
                      <td>
                        {emp.assigned_hrs}h / {emp.capacity_hrs || 40}h
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 600 }}>{utilPct}%</span>
                          <div className="skill-bar-track" style={{ width: "60px", height: "4px" }}>
                            <div
                              className="skill-bar-fill"
                              style={{
                                width: `${Math.min(utilPct, 100)}%`,
                                background:
                                  emp.utilization > 1.0
                                    ? "var(--overloaded-red)"
                                    : emp.utilization < 0.5
                                    ? "var(--idle-blue)"
                                    : "var(--success-green)"
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{badge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LoadingState>
  );
}
