import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldAlert,
  GitCompare,
  Briefcase,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Sidebar({ currentPage, setCurrentPage, connectionStatus }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "teambuilder", label: "Team Builder", icon: Users },
    { id: "workload", label: "Workload Balancing", icon: BarChart3 },
    { id: "risks", label: "Workforce Risks", icon: ShieldAlert },
    { id: "whatif", label: "Contingency Planning", icon: GitCompare },
    { id: "hiring", label: "Hiring & Requisitions", icon: Briefcase }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Zap size={20} />
        </div>
        <div>
          <div className="brand-title">
            Talent<span>OS</span>
          </div>
          <div className="brand-subtitle">Workforce Intelligence</div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Intelligence Modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={17} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="sidebar-footer">
        <div className="system-status-box">
          <div className="status-row">
            <span>Service Status</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 600,
                color: connectionStatus.isLive ? "var(--success-green)" : "var(--text-muted)"
              }}
            >
              {connectionStatus.isLive ? (
                <>
                  <CheckCircle2 size={12} color="var(--success-green)" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle size={12} color="var(--warning-amber)" />
                  Sample Data
                </>
              )}
            </span>
          </div>
          <div className="status-row" style={{ marginBottom: 0 }}>
            <span>Version</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              v1.2.0-enterprise
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
