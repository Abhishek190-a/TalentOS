import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowRight } from "lucide-react";
import { chatWithAgent } from "../api.js";

export default function Assistant({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "TalentOS Decision Support is ready. Inquire about workforce capacity, single-owner dependencies, burnout risks, or learnability pathways.",
      suggested_actions: [
        { label: "Review Team Builder", action: "navigate", target: "teambuilder" },
        { label: "Inspect Workload Heatmap", action: "navigate", target: "workload" },
        { label: "View Open Requisitions", action: "navigate", target: "hiring" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Who is overloaded?",
    "Which skills have only one owner?",
    "Why was this team selected?",
    "Who can learn Data Analytics fastest?"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const query = (messageText || input).trim();
    if (!query || loading) return;

    // Add user message
    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAgent(query);
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer || "No response received.",
          suggested_actions: data.suggested_actions || []
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Decision support service is currently unavailable. Please verify API service connectivity."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.action === "navigate" && action.target) {
      const page = action.target.replace("/", "");
      if (page === "workload") onNavigate("workload");
      else if (page === "risks") onNavigate("risks");
      else if (page === "teambuilder" || page === "team") onNavigate("teambuilder");
      else if (page === "whatif" || page === "contingency") onNavigate("whatif");
      else if (page === "hiring") onNavigate("hiring");
      else onNavigate("dashboard");
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="assistant-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Decision Support Assistant"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="assistant-panel">
          {/* Header */}
          <div className="assistant-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, var(--primary-indigo), var(--cyan-accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}
              >
                <Sparkles size={14} />
              </div>
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Decision Support
                </h4>
                <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                  Workforce Intelligence Query Engine
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages list */}
          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  {msg.sender === "user" ? (
                    <User size={12} style={{ opacity: 0.8 }} />
                  ) : (
                    <Bot size={12} color="var(--cyan-accent)" />
                  )}
                  <span style={{ fontSize: "10.5px", fontWeight: 600, opacity: 0.8 }}>
                    {msg.sender === "user" ? "You" : "TalentOS Intelligence"}
                  </span>
                </div>

                <div style={{ wordBreak: "break-word" }}>{msg.text}</div>

                {/* Interactive Action Buttons */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {msg.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        className="btn btn-outline btn-sm"
                        style={{
                          justifyContent: "space-between",
                          fontSize: "11px",
                          padding: "4px 8px",
                          borderRadius: "4px"
                        }}
                        onClick={() => handleActionClick(act)}
                      >
                        <span>{act.label}</span>
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-bubble bot" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bot size={14} color="var(--cyan-accent)" />
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                  Evaluating workforce metrics...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt chips */}
          <div className="assistant-prompts">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                className="prompt-chip"
                onClick={() => handleSend(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input box */}
          <form
            className="assistant-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Inquire regarding capacity, skills, or risk..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!input.trim() || loading}
              style={{ padding: "0 12px" }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
