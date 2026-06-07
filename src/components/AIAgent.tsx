import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Terminal, Loader2, PlayCircle, HelpCircle, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function AIAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hi there! I am Burhanudin Nuban's AI Career Assistant, built to discuss his portfolio achievements. Feel free to ask me anything about his technical stack, cloud expertise, work certifications, or continuous integration approaches!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "What is your overall tech stack?",
    "Tell me about your automated security scanning.",
    "Are you certified? What credentials do you hold?",
    "How can I contact Burhanudin for interviews?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, loading]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-10).map(m => ({ role: m.role, text: m.text })) // submit active thread context
        })
      });

      if (!response.ok) {
        throw new Error("Chat token fetch failed");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.reply || "I am awaiting connection, but please rest assured Burhanudin can answer this directly at burhanudinnuban@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "I experienced a connection fluctuation, but I am happy to summarize: Burhanudin Nuban is a professional Full Stack and DevSecOps engineer who specializes in securing code pipelines, building React apps, and deploying Docker/Kubernetes architectures. I highly recommend contacting him directly at burhanudinnuban@gmail.com!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-agent-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100 h-[480px]">
      {/* Preset interview questions (Left) */}
      <div id="ai-presets-col" className="lg:col-span-4 flex flex-col justify-between gap-5 border border-slate-900 bg-slate-950/20 p-5 rounded-2xl">
        <div id="presets-header" className="space-y-4">
          <div id="presets-headline-box">
            <h3 id="presets-heading text" className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">
              Quick Interviews
            </h3>
            <p id="presets-subtext" className="text-xs text-slate-500">Pick standard questions to interview his AI persona</p>
          </div>

          <div id="presets-buttons-stack" className="space-y-2.5">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="w-full text-left p-2.5 text-xs rounded-xl border border-slate-900 bg-slate-950/40 text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900/10 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-2 group"
              >
                <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all shrink-0" />
                <span className="truncate">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live server indicator */}
        <div id="live-indicator-box" className="p-4 rounded-xl border border-slate-900 bg-black/40 flex items-center gap-3">
          <div id="live-pulse-wrapper" className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <div>
            <span id="live-status-label" className="text-[10px] font-mono uppercase font-bold text-slate-400 block leading-none">
              Gemini Interface Active
            </span>
            <p id="live-status-sub" className="text-[9px] text-slate-500 mt-0.5 font-medium">Listening to recruiter interrogatives.</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Panel (Right) */}
      <div id="ai-chat-col" className="lg:col-span-8 flex flex-col h-full rounded-2xl border border-slate-900 bg-slate-950/30 overflow-hidden shadow-xl">
        <div id="chat-header-bar" className="px-5 py-3.5 bg-zinc-950/80 border-b border-slate-900/90 flex items-center justify-between">
          <div id="chat-header-identity" className="flex items-center gap-2.5">
            <div id="chat-bot-avatar" className="p-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 id="chat-header-name" className="text-xs font-bold text-slate-100">Nuban Career Assistant</h4>
              <span id="chat-header-v" className="text-[9px] text-slate-500 font-mono">v1.2.0 • powered by gemini-3.5-flash</span>
            </div>
          </div>
          <span id="chat-status-glow" className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            READY
          </span>
        </div>

        {/* Message Thread Scroll Area */}
        <div id="chat-scroller" className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-950/30">
          {messages.map((m, idx) => {
            const isModel = m.role === "model";
            return (
              <div
                key={idx}
                id={`chat-msg-row-${idx}`}
                className={`flex gap-3 max-w-[85%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Embedded Character Icon */}
                <div id={`chat-avatar-wrapper-${idx}`} className={`p-2 rounded-xl border shrink-0 h-fit ${
                  isModel
                    ? "bg-cyan-950/40 border-cyan-900/30 text-cyan-400"
                    : "bg-slate-900 border-slate-800 text-slate-300"
                }`}>
                  <Terminal className="w-3.5 h-3.5" />
                </div>

                {/* Message Balloon */}
                <div id={`chat-msg-balloon-${idx}`} className="space-y-1">
                  <div id={`chat-msg-content-${idx}`} className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans select-text ${
                    isModel
                      ? "bg-slate-950/90 border-slate-900 text-slate-200 shadow-sm"
                      : "bg-gradient-to-br from-slate-900 to-zinc-900 border-slate-800/80 text-slate-200"
                  }`}>
                    {m.text}
                  </div>
                  <span id={`chat-msg-time-${idx}`} className={`text-[9px] text-slate-500 font-mono block ${
                    isModel ? "pl-1" : "text-right pr-1"
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div id="chat-msg-row-loading" className="flex gap-3 mr-auto max-w-[85%]">
              <div id="chat-avatar-loading" className="p-2 rounded-xl border shrink-0 bg-cyan-950/40 border-cyan-900/30 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div id="chat-loading-bubble" className="p-4 rounded-2xl border border-slate-900 bg-slate-950/20 text-xs text-slate-400 flex items-center gap-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Nuban system compiles response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Control Deck */}
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
            placeholder="Type your message or ask about his journey..."
            className="flex-1 px-4 py-2 bg-slate-950/80 border border-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 rounded-xl transition-all font-sans"
          />

          <button
            id="chat-btn-submit"
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className={`p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] ${
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
