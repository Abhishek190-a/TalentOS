export default function StatCard({
  icon: Icon,
  number,
  label,
  subtext,
  color = "indigo",
  badge,
  onClick
}) {
  const colorMap = {
    indigo: {
      bg: "rgba(99, 102, 241, 0.12)",
      text: "#818CF8",
      border: "rgba(99, 102, 241, 0.2)"
    },
    cyan: {
      bg: "rgba(34, 211, 238, 0.12)",
      text: "var(--cyan-accent)",
      border: "rgba(34, 211, 238, 0.2)"
    },
    green: {
      bg: "rgba(16, 185, 129, 0.12)",
      text: "var(--success-green)",
      border: "rgba(16, 185, 129, 0.2)"
    },
    red: {
      bg: "rgba(239, 68, 68, 0.12)",
      text: "var(--overloaded-red)",
      border: "rgba(239, 68, 68, 0.2)"
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.12)",
      text: "var(--warning-amber)",
      border: "rgba(245, 158, 11, 0.2)"
    },
    blue: {
      bg: "rgba(59, 130, 246, 0.12)",
      text: "var(--idle-blue)",
      border: "rgba(59, 130, 246, 0.2)"
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="card stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          className="stat-icon-wrapper"
          style={{
            backgroundColor: scheme.bg,
            color: scheme.text,
            border: `1px solid ${scheme.border}`
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
        {badge && (
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "9999px",
              background: scheme.bg,
              color: scheme.text,
              border: `1px solid ${scheme.border}`,
              fontWeight: 600
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
