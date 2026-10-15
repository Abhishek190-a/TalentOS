export default function SkillBar({ breakdown }) {
  const { skill = 0, exp = 0, avail = 0 } = breakdown || {};

  // Maximum contribution points per section 5.2:
  // 55% skill fit, 15% experience, 30% availability
  const skillPercent = Math.min(Math.max((skill / 55) * 100, 0), 100);
  const expPercent = Math.min(Math.max((exp / 15) * 100, 0), 100);
  const availPercent = Math.min(Math.max((avail / 30) * 100, 0), 100);

  return (
    <div className="skill-bar-container">
      {/* Skill Fit Bar */}
      <div className="skill-bar-row">
        <div className="skill-bar-meta">
          <span>Technical Skill Fit</span>
          <span style={{ fontWeight: 600, color: "var(--cyan-accent)" }}>
            {skill.toFixed(1)} <span style={{ opacity: 0.6 }}>/ 55 pts</span>
          </span>
        </div>
        <div className="skill-bar-track">
          <div
            className="skill-bar-fill"
            style={{
              width: `${skillPercent}%`,
              background: "linear-gradient(90deg, #6366F1, var(--cyan-accent))"
            }}
          />
        </div>
      </div>

      {/* Experience Bar */}
      <div className="skill-bar-row">
        <div className="skill-bar-meta">
          <span>Tenure & Seniority</span>
          <span style={{ fontWeight: 600, color: "var(--warning-amber)" }}>
            {exp.toFixed(1)} <span style={{ opacity: 0.6 }}>/ 15 pts</span>
          </span>
        </div>
        <div className="skill-bar-track">
          <div
            className="skill-bar-fill"
            style={{
              width: `${expPercent}%`,
              background: "linear-gradient(90deg, #F59E0B, #FBBF24)"
            }}
          />
        </div>
      </div>

      {/* Availability Bar */}
      <div className="skill-bar-row">
        <div className="skill-bar-meta">
          <span>Available Capacity</span>
          <span
            style={{
              fontWeight: 600,
              color: avail === 0 ? "var(--overloaded-red)" : "var(--success-green)"
            }}
          >
            {avail.toFixed(1)} <span style={{ opacity: 0.6 }}>/ 30 pts</span>
          </span>
        </div>
        <div className="skill-bar-track">
          <div
            className="skill-bar-fill"
            style={{
              width: `${availPercent}%`,
              background:
                avail === 0
                  ? "var(--overloaded-red)"
                  : "linear-gradient(90deg, #10B981, #34D399)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
