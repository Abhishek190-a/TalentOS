export default function MatchRing({
  score = 0,
  size = 64,
  strokeWidth = 5.5,
  showLabel = true
}) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Determine color theme based on score threshold
  let strokeColor = "#6366F1"; // indigo
  if (safeScore >= 75) strokeColor = "#22D3EE"; // cyan
  else if (safeScore >= 60) strokeColor = "#10B981"; // green
  else if (safeScore < 40) strokeColor = "#EF4444"; // red

  return (
    <div
      className="match-ring-wrapper"
      style={{ width: size, height: size }}
      title={`Match Score: ${safeScore}/100`}
    >
      <svg
        className="match-ring-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className="match-ring-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated fill circle */}
        <circle
          className="match-ring-circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
        />
      </svg>
      <div className="match-ring-text">
        <span
          className="match-ring-value"
          style={{ fontSize: size * 0.28, color: strokeColor }}
        >
          {Math.round(safeScore)}
        </span>
        {showLabel && (
          <span
            className="match-ring-label"
            style={{ fontSize: size * 0.12 }}
          >
            SCORE
          </span>
        )}
      </div>
    </div>
  );
}
