import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Terminal, Loader2, PlayCircle, Sparkles } from "lucide-react";

// ─────────────────────────────────────────
// Simple Markdown-like renderer for bold text
// ─────────────────────────────────────────
function renderFormattedText(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Parse **bold** and regular text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="text-cyan-400 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Emoji bullets (🔹, ✅, 🔐, etc.)
      if (/^[🔹✅🔐🔍🛡️📋☁️📦🔄🏢📂🔗📧💼🎓📖📈💰🐳☸️📝💡🎂📍💻🏅]/.test(part.trim())) {
        return (
          <span key={partIdx} className="block pl-1">
            {part}
          </span>
        );
      }
      return <span key={partIdx}>{part}</span>;
    });

    return (
      <span key={lineIdx} className="block">
        {rendered}
        {lineIdx < lines.length - 1 && line === "" && <span className="block h-1" />}
      </span>
    );
  });
}

export default function AIAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const presetQuestions = [
    "skills",
    "experience",
    "devops",
    "projects",
    "certifications",
    "hire",
    "contact",
    "about",
  ];

  const presetLabels: Record<string, string> = {
    skills: "🛠️ Tech Stack & Skills",
    experience: "💼 Work Experience",
    devops: "🔒 DevSecOps Expertise",
    projects: "🚀 Portfolio & Projects",
    certifications: "🏅 Certifications",
    hire: "🌟 Why Hire Burhanudin?",
    contact: "📬 Contact Information",
    about: "🧑‍💻 About Burhanudin",
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      const container = chatScrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  // Fetch welcome message on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const fetchWelcome = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hi", history: [] }),
        });

        if (!response.ok) throw new Error("Failed to fetch welcome");

        const data = await response.json();
        setMessages([
          {
            role: "model",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        if (data.suggestions) setSuggestions(data.suggestions);
        setIsOnline(true);
      } catch {
        setMessages([
          {
            role: "model",
            text: "👋 Welcome! I'm Burhanudin's Career Assistant. Type **menu** to see what I can help you with!",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setSuggestions(["menu", "skills", "experience", "contact"]);
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcome();
  }, []);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSuggestions([]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) throw new Error("Chat fetch failed");

      const data = await response.json();
      const modelMsg: ChatMessage = {
        role: "model",
        text:
          data.reply ||
          "I'm having trouble right now. Please contact Burhanudin directly at burhanudinnuban@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      if (data.suggestions) setSuggestions(data.suggestions);
      setIsOnline(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Connection issue detected. Burhanudin is a professional Full Stack & DevSecOps Engineer — reach him at **burhanudinnuban@gmail.com**!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setSuggestions(["menu", "contact"]);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai-agent-container"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100 h-[480px]"
    >
      {/* ═══════════════════════════════════════ */}
      {/* LEFT PANEL — Quick Topics              */}
      {/* ═══════════════════════════════════════ */}
      <div
        id="ai-presets-col"
        className="lg:col-span-4 flex flex-col justify-between gap-5 border border-slate-900 bg-slate-950/20 p-5 rounded-2xl"
      >
        <div id="presets-header" className="space-y-4">
          <div id="presets-headline-box">
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">
              Quick Topics
            </h3>
            <p className="text-xs text-slate-500">
              Pick a topic or type anything in the chat
            </p>
          </div>

          <div id="presets-buttons-stack" className="space-y-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="w-full text-left p-2.5 text-xs rounded-xl border border-slate-900 bg-slate-950/40 text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900/10 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-2 group"
              >
                <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all shrink-0" />
                <span className="truncate">
                  {presetLabels[q] || q}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Indicator */}
        <div
          id="live-indicator-box"
          className="p-4 rounded-xl border border-slate-900 bg-black/40 flex items-center gap-3"
        >
          <div id="live-pulse-wrapper" className="relative flex h-3 w-3 shrink-0">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? "bg-cyan-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isOnline ? "bg-cyan-500" : "bg-amber-500"
              }`}
            />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block leading-none">
              {isOnline ? "Career Assistant Active" : "Reconnecting..."}
            </span>
            <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
              {isOnline
                ? "Interactive mode • type or click to explore"
                : "Fallback mode • basic responses available"}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* RIGHT PANEL — Chat Window              */}
      {/* ═══════════════════════════════════════ */}
      <div
        id="ai-chat-col"
        className="lg:col-span-8 flex flex-col h-full rounded-2xl border border-slate-900 bg-slate-950/30 overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div
          id="chat-header-bar"
          className="px-5 py-3.5 bg-zinc-950/80 border-b border-slate-900/90 flex items-center justify-between"
        >
          <div id="chat-header-identity" className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                Nuban Career Assistant
              </h4>
              <span className="text-[9px] text-slate-500 font-mono">
                v2.0.0 • interactive mode
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            READY
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div
          ref={chatScrollContainerRef}
          id="chat-scroller"
          className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-950/30"
        >
          {messages.map((m, idx) => {
            const isModel = m.role === "model";
            return (
              <div
                key={idx}
                id={`chat-msg-row-${idx}`}
                className={`flex gap-3 max-w-[85%] ${
                  isModel ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`p-2 rounded-xl border shrink-0 h-fit ${
                    isModel
                      ? "bg-cyan-950/40 border-cyan-900/30 text-cyan-400"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  {isModel ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Terminal className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Message Balloon */}
                <div className="space-y-1 min-w-0">
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans select-text whitespace-pre-line ${
                      isModel
                        ? "bg-slate-950/90 border-slate-900 text-slate-200 shadow-sm"
                        : "bg-gradient-to-br from-slate-900 to-zinc-900 border-slate-800/80 text-slate-200"
                    }`}
                  >
                    {isModel ? renderFormattedText(m.text) : m.text}
                  </div>
                  <span
                    className={`text-[9px] text-slate-500 font-mono block ${
                      isModel ? "pl-1" : "text-right pr-1"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="p-2 rounded-xl border shrink-0 bg-cyan-950/40 border-cyan-900/30 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/20 text-xs text-slate-400 flex items-center gap-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Compiling response...
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════ */}
          {/* Dynamic Suggestion Chips           */}
          {/* ═══════════════════════════════════ */}
          {!loading && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 pl-10">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="px-3 py-1.5 text-[10px] font-mono font-semibold rounded-full 
                             border border-cyan-500/20 text-cyan-400 
                             bg-cyan-950/20 hover:bg-cyan-500/10 
                             hover:border-cyan-400/40 hover:text-cyan-300
                             transition-all cursor-pointer disabled:opacity-50
                             active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          id="chat-submit-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputMessage);
          }}
          className="p-3 bg-zinc-950/80 border-t border-slate-900 flex items-center gap-2.5 shrink-0"
        >
          <input
            id="chat-input-field"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder="Type skills, experience, devops, hire... or anything!"
            className="flex-1 px-4 py-2 bg-slate-950/80 border border-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 rounded-xl transition-all font-sans"
          />

          <button
            id="chat-btn-submit"
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className={`p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] ${
              loading || !inputMessage.trim()
                ? "opacity-30 cursor-not-allowed shadow-none"
                : ""
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}