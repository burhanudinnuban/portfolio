import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "../types";
import {
  PlayCircle,
  Terminal,
  Send,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function renderFormattedText(text: string) {
  return text.split("\n").map((line, lineIdx, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="text-cyan-400 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (/^[🔹✅🔐🔍🛡️📋☁️📦🔄🏢📂🔗📧💼🎓📖📈💰🐳☸️📝💡🎂📍💻🏅]/.test(part.trim())) {
        return <span key={partIdx} className="block pl-1">{part}</span>;
      }
      return <span key={partIdx}>{part}</span>;
    });

    return (
      <span key={lineIdx} className="block">
        {rendered}
        {lineIdx < arr.length - 1 && line === "" && <span className="block h-1" />}
      </span>
    );
  });
}

const PRESET_QUESTIONS = [
  "skills", "experience", "devops", "projects",
  "certifications", "hire", "contact", "about",
];

const PRESET_LABELS: Record<string, string> = {
  skills: "🛠️ Tech Stack & Skills",
  experience: "💼 Work Experience",
  devops: "🔒 DevSecOps Expertise",
  projects: "🚀 Portfolio & Projects",
  certifications: "🏅 Certifications",
  hire: "🌟 Why Hire Burhanudin?",
  contact: "📬 Contact Information",
  about: "🧑‍💻 About Burhanudin",
};

export default function AIAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const lastBotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatColRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const shouldScrollRef = useRef(false);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ─────────────────────────────────────────
  // Scroll new bot response to TOP of chat
  // Only runs when shouldScrollRef is true
  // Waits until loading is done (response rendered)
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!shouldScrollRef.current || loading) return;

    const timer = setTimeout(() => {
      const container = chatScrollContainerRef.current;
      const target = lastBotRef.current;

      if (container && target) {
        container.scrollTo({
          top: target.offsetTop - 12,
          behavior: "smooth",
        });
      }

      shouldScrollRef.current = false;
    }, 120);

    return () => clearTimeout(timer);
  }, [messages, loading]);

  // ─────────────────────────────────────────
  // Auto-focus input after bot responds
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  // ─────────────────────────────────────────
  // Fetch welcome on mount
  // ─────────────────────────────────────────
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hi", history: [] }),
        });

        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        setMessages([{ role: "model", text: data.reply, timestamp: now() }]);
        if (data.suggestions) setSuggestions(data.suggestions);
        setIsOnline(true);
      } catch {
        setMessages([
          {
            role: "model",
            text: "👋 Welcome! I'm Burhanudin's Career Assistant. Type **menu** to see what I can help you with!",
            timestamp: now(),
          },
        ]);
        setSuggestions(["menu", "skills", "experience", "contact"]);
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const focusChatPanel = useCallback(() => {
    chatColRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  // ─────────────────────────────────────────
  // Send message
  // ─────────────────────────────────────────
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || loading) return;

      focusChatPanel();

      const userMsg: ChatMessage = {
        role: "user",
        text: messageText,
        timestamp: now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setSuggestions([]);
      setInputMessage("");
      shouldScrollRef.current = true;
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        if (!res.ok) throw new Error("Chat fetch failed");
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: data.reply || "Contact Burhanudin at burhanudinnuban@gmail.com!",
            timestamp: now(),
          },
        ]);
        if (data.suggestions) setSuggestions(data.suggestions);
        setIsOnline(true);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "Connection issue. Reach Burhanudin at **burhanudinnuban@gmail.com**!",
            timestamp: now(),
          },
        ]);
        setSuggestions(["menu", "contact"]);
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, focusChatPanel]
  );

  // ─────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────
  const resetChat = useCallback(async () => {
    setMessages([]);
    setSuggestions([]);
    setLoading(true);
    shouldScrollRef.current = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hi", history: [] }),
      });

      if (!res.ok) throw new Error("Reset failed");
      const data = await res.json();

      setMessages([{ role: "model", text: data.reply, timestamp: now() }]);
      if (data.suggestions) setSuggestions(data.suggestions);
    } catch {
      setMessages([
        { role: "model", text: "👋 Welcome back! Type **menu** to explore.", timestamp: now() },
      ]);
      setSuggestions(["menu", "skills", "experience", "contact"]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatScrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
      inputRef.current?.focus();
    }
  }, []);

  // Last bot message index
  const lastBotIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "model") return i;
    }
    return -1;
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100 h-[520px]">

      {/* LEFT PANEL */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-5 border border-slate-900 bg-slate-950/20 p-5 rounded-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">Quick Topics</h3>
            <p className="text-xs text-slate-500">Click to start a conversation</p>
          </div>

          <div className="space-y-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="w-full text-left p-2.5 text-xs rounded-xl border border-slate-900
                           bg-slate-950/40 text-slate-300
                           hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900/10
                           active:scale-[0.98] active:bg-cyan-950/20
                           cursor-pointer disabled:opacity-50 transition-all
                           flex items-center gap-2 group"
              >
                <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all shrink-0" />
                <span className="truncate">{PRESET_LABELS[q] || q}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-900 bg-black/40 flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-cyan-400" : "bg-amber-400"}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-cyan-500" : "bg-amber-500"}`} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block leading-none">
              {isOnline ? "Career Assistant Active" : "Reconnecting..."}
            </span>
            <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
              {isOnline ? "Interactive mode • type or click to explore" : "Fallback mode"}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        ref={chatColRef}
        className="lg:col-span-8 flex flex-col h-full rounded-2xl border border-slate-900 bg-slate-950/30 overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-950/80 border-b border-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Nuban Career Assistant</h4>
              <span className="text-[9px] text-slate-500 font-mono">v2.0.0 • interactive mode</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetChat}
              disabled={loading || messages.length <= 1}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-semibold
                         rounded-lg border border-slate-800 text-slate-400
                         hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900/30
                         active:scale-95 transition-all cursor-pointer
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3 h-3" />
              New Chat
            </button>

            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              READY
            </span>
          </div>
        </div>

        {/* ── Messages (scroll focus to first line of response) ── */}
        <div
          ref={chatScrollContainerRef}
          className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-950/30"
        >
          {messages.map((m, idx) => {
            const isModel = m.role === "model";
            const isLastBot = isModel && idx === lastBotIdx;

            return (
              <div
                key={idx}
                ref={isLastBot ? lastBotRef : null}
                className={`flex gap-3 max-w-[85%] animate-[fadeSlideIn_0.3s_ease-out] ${
                  isModel ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                <div
                  className={`p-2 rounded-xl border shrink-0 h-fit ${
                    isModel
                      ? "bg-cyan-950/40 border-cyan-900/30 text-cyan-400"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  {isModel ? <Sparkles className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans select-text whitespace-pre-line ${
                      isModel
                        ? "bg-slate-950/90 border-slate-900 text-slate-200 shadow-sm"
                        : "bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-900/30 text-cyan-100"
                    }`}
                  >
                    {isModel ? renderFormattedText(m.text) : m.text}
                  </div>
                  <span className={`text-[9px] text-slate-500 font-mono block ${isModel ? "pl-1" : "text-right pr-1"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%] animate-[fadeSlideIn_0.2s_ease-out]">
              <div className="p-2 rounded-xl border shrink-0 bg-cyan-950/40 border-cyan-900/30 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/20 text-xs text-slate-400 flex items-center gap-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Compiling response...
              </div>
            </div>
          )}
        </div>

        {/* Floating Suggestions */}
        {!loading && suggestions.length > 0 && (
          <div className="px-4 py-2.5 bg-zinc-950/60 border-t border-slate-900/50 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] text-slate-500 font-mono shrink-0">💡 Topics:</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="px-3 py-1 text-[10px] font-mono font-semibold rounded-full
                             border border-cyan-500/20 text-cyan-400
                             bg-cyan-950/20 hover:bg-cyan-500/10
                             hover:border-cyan-400/40 hover:text-cyan-300
                             active:scale-95 active:bg-cyan-500/20
                             transition-all cursor-pointer disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputMessage);
          }}
          className="p-3 bg-zinc-950/80 border-t border-slate-900 flex items-center gap-2.5 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder="Type skills, experience, devops, hire... or anything!"
            className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-900 text-xs text-slate-200
                       focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
                       rounded-xl transition-all font-sans placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className={`p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all
                        cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95 ${
              loading || !inputMessage.trim() ? "opacity-30 cursor-not-allowed shadow-none" : ""
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}