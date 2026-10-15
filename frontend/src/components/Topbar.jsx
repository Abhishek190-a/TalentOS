import { Search, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function Topbar({
  currentPage,
  searchTerm,
  setSearchTerm,
  connectionStatus,
  onRefreshHealth
}) {
  const pageTitles = {
    dashboard: {
      title: "Command Center",
      tagline: "Executive overview of workforce capacity, utilization, and skill coverage"
    },
    teambuilder: {
      title: "Team Builder & Match Engine",
      tagline: "Explainable multi-objective candidate scoring and learnability pathways"
    },
    workload: {
      title: "Workforce Balancing",
      tagline: "Capacity optimization, burnout prevention, and pending reassignment decisions"
    },
    risks: {
      title: "Organizational Risks",
      tagline: "Bus-factor vulnerabilities and high burnout probability monitoring"
    },
    whatif: {
      title: "Contingency Planning",
      tagline: "Attrition impact analysis, critical skill shortfalls, and recovery pathways"
    },
    hiring: {
      title: "Talent Acquisition & Sourcing",
      tagline: "Open requisitions, external candidate alignment, and recruitment lifecycle"
    }
  };

  const currentInfo = pageTitles[currentPage] || {
    title: "TalentOS",
    tagline: "Workforce Intelligence"
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{currentInfo.title}</h1>
          <p className="page-tagline">{currentInfo.tagline}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Search */}
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees, skills, requisitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quiet Connection Indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: connectionStatus.isLive ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.04)",
            border: `1px solid ${connectionStatus.isLive ? "rgba(16, 185, 129, 0.25)" : "var(--border-color)"}`,
            fontSize: "11.5px"
          }}
          title={
            connectionStatus.isLive
              ? `Connected to live API at ${connectionStatus.baseUrl}`
              : "API backend offline. Displaying deterministic sample fixtures."
          }
        >
          {connectionStatus.isLive ? (
            <>
              <CheckCircle2 size={13} color="var(--success-green)" />
              <span style={{ color: "var(--success-green)", fontWeight: 600 }}>API Connected</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} color="var(--text-muted)" />
              <span style={{ color: "var(--text-secondary)" }}>Sample Data</span>
            </>
          )}

          <button
            onClick={onRefreshHealth}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center"
            }}
            title="Check API Connectivity"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* User Avatar */}
        <div className="avatar-badge" title="Director of Workforce Operations">
          WO
        </div>
      </div>
    </header>
  );
}
