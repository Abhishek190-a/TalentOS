import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function LoadingState({
  loading = false,
  error = null,
  onRetry = null,
  emptyMessage = null,
  children
}) {
  if (loading) {
    return (
      <div
        style={{
          padding: "60px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          color: "var(--text-secondary)"
        }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          color="var(--cyan-accent)"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: "13px", fontWeight: 500 }}>
          Computing workforce intelligence metrics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="card"
        style={{
          padding: "40px 20px",
          textAlign: "center",
          borderColor: "rgba(239, 68, 68, 0.4)",
          background: "rgba(239, 68, 68, 0.05)"
        }}
      >
        <div style={{ display: "inline-flex", color: "var(--overloaded-red)", marginBottom: "12px" }}>
          <AlertCircle size={36} />
        </div>
        <h3 style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "6px" }}>
          Failed to load data
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto 18px" }}>
          {error}
        </p>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" onClick={onRetry}>
            <RefreshCw size={13} />
            <span>Retry Operation</span>
          </button>
        )}
      </div>
    );
  }

  if (emptyMessage) {
    return (
      <div
        className="card"
        style={{
          padding: "48px 20px",
          textAlign: "center",
          borderColor: "var(--border-color)"
        }}
      >
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>{emptyMessage}</p>
      </div>
    );
  }

  return children;
}
