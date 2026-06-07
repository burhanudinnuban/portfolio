import React, { useState, useEffect } from "react";
import { PROJECTS_LIST, EXPERIENCE_HISTORY, SKILL_CATEGORIES, SIDEBAR_DEFAULT_DATA } from "./data";
import { Project, Experience, SkillCategory, SidebarData } from "./types";
import Timeline from "./components/Timeline";
import SkillsRadar from "./components/SkillsRadar";
import CodeScanner from "./components/CodeScanner";
import PipelineSimulator from "./components/PipelineSimulator";
import AIAgent from "./components/AIAgent";
import AdminCMS from "./components/AdminCMS";
import { decryptPayload, getObscuredKey } from "./utils/crypto";
import {
  Shield,
  Briefcase,
  Terminal,
  Activity,
  Award,
  Send,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  Code,
  Layers,
  Sparkles,
  CheckCircle,
  Search,
  MessageSquare,
  Lock,
  Unlock,
  Download,
  Sun,
  Moon
} from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("app-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const [activeTab, setActiveTab] = useState<string>("journey");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dynamic content states sourced from encrypted/decrypted localStorage, with default fallbacks
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCE_HISTORY);
  const [skills, setSkills] = useState<SkillCategory[]>(SKILL_CATEGORIES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_LIST);
  const [sidebar, setSidebar] = useState<SidebarData>(SIDEBAR_DEFAULT_DATA);

  // GitHub Repos dynamic integration states
  const [projectSource, setProjectSource] = useState<"github" | "featured">("github");
  const [githubRepos, setGithubRepos] = useState<Project[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [repoError, setRepoError] = useState<string | null>(null);

  // Sync with live public GitHub Repositories
  useEffect(() => {
    async function syncGitHubRepos() {
      setLoadingRepos(true);
      setRepoError(null);
      try {
        const response = await fetch("/api/github/repos");
        const resJSON = await response.json();
        if (response.ok && resJSON.success && resJSON.projects && resJSON.projects.length > 0) {
          setGithubRepos(resJSON.projects);
        } else {
          setRepoError(resJSON.error || "GitHub public rate limits reached.");
        }
      } catch (err) {
        console.error("Failed to connect to local source synchronization bridge:", err);
        setRepoError("Source synchronization gateway offline.");
      } finally {
        setLoadingRepos(false);
      }
    }
    syncGitHubRepos();
  }, []);

  // Lifted Administrative Cryptographic CMS Authentication State
  const [isCmsAuthenticated, setIsCmsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("cms_auth_status") === "unlocked";
  });

  // Attempt to load dynamic data.json database structure on startup
  useEffect(() => {
    async function loadPortfolioDatabase() {
      try {
        const response = await fetch("/api/cms/load");
        const resJSON = await response.json();
        if (response.ok && resJSON.success && resJSON.data) {
          const { experiences, skills, projects, sidebar } = resJSON.data;
          if (experiences && skills && projects) {
            setExperiences(experiences);
            setSkills(skills);
            setProjects(projects);
          }
          if (sidebar) {
            setSidebar(sidebar);
          }
          // Preserve backup locally in cleartext json
          localStorage.setItem("cms_secured_db", JSON.stringify(resJSON.data));
        }
      } catch (srvErr) {
        console.warn("CMS could not reach remote server to synchronize active database.", srvErr);
        
        // Dynamic fallback to local storage cache if server offline
        const localBackup = localStorage.getItem("cms_secured_db");
        if (localBackup) {
          try {
            let parsed;
            if (localBackup.startsWith("{")) {
              parsed = JSON.parse(localBackup);
            } else {
              const decryptedRaw = decryptPayload(localBackup, getObscuredKey());
              parsed = JSON.parse(decryptedRaw);
            }
            if (parsed.experiences && parsed.skills && parsed.projects) {
              setExperiences(parsed.experiences);
              setSkills(parsed.skills);
              setProjects(parsed.projects);
            }
            if (parsed.sidebar) {
              setSidebar(parsed.sidebar);
            }
          } catch (err) {
            console.warn("Could not load local backup cache.", err);
          }
        }
      }
    }

    loadPortfolioDatabase();
  }, []);

  // Contact Form States
  const [senderName, setSenderName] = useState<string>("");
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [senderMessage, setSenderMessage] = useState<string>("");
  const [submittingForm, setSubmittingForm] = useState<boolean>(false);
  const [formDone, setFormDone] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Link skills clicking to automatic projects filtering
  const handleSkillInterception = (skillName: string) => {
    setSearchQuery(skillName);
    setSelectedCategory("All");
    setActiveTab("projects");
  };

  const categories = ["All", "Full-Stack", "DevSecOps", "Cloud Infrastructure"];

  // Filter projects based on selections and search term
  const activeProjectsList = projectSource === "github" ? (githubRepos.length > 0 ? githubRepos : projects) : projects;

  const filteredProjects = activeProjectsList.filter((proj) => {
    const matchesCategory =
      selectedCategory === "All" || proj.category === selectedCategory;
    const matchesQuery =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !senderMessage) return;

    setSubmittingForm(true);
    setFormError(null);
    setFormDone(false);

    try {
      // Constructs a dynamic mailto URL directed to burhanudinnuban@gmail.com
      const emailRecipient = "burhanudinnuban@gmail.com";
      const subject = encodeURIComponent(`Portfolio Message from ${senderName}`);
      const body = encodeURIComponent(
        `Hello,

You received a secure portfolio message from ${senderName} (${senderEmail}):

${senderMessage}

Best regards,
${senderName}`
      );
      const mailtoUrl = `mailto:${emailRecipient}?subject=${subject}&body=${body}`;
      
      // Trigger user's mail client directly
      window.location.href = mailtoUrl;

      setFormDone(true);
      // Reset fields
      setSenderName("");
      setSenderEmail("");
      setSenderMessage("");
      setTimeout(() => setFormDone(false), 8000); // fade confirmation out later
    } catch (err) {
      console.error("Transmitter connection error:", err);
      setFormError("Failed to launch dynamic mailto gateway.");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div
      id="app-theme-host"
      className={`min-h-screen ${
        theme === "light" ? "light-theme bg-slate-100 text-slate-900" : "bg-[#020204] text-slate-100"
      } flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-400 font-sans relative overflow-hidden`}
    >
      {/* Visual Ambient Orbs of Soft Light */}
      <div id="orb-1" className="absolute -top-[150px] -left-[150px] w-[500px] h-[500px] rounded-full bg-cyan-950/15 blur-[120px] pointer-events-none select-none" />
      <div id="orb-2" className="absolute -right-[150px] top-[20%] w-[500px] h-[500px] rounded-full bg-blue-950/15 blur-[120px] pointer-events-none select-none" />
      <div id="orb-3" className="absolute -bottom-[150px] left-[30%] w-[500px] h-[500px] rounded-full bg-slate-900/10 blur-[120px] pointer-events-none select-none" />

      {/* Main Structural Container */}
      <div id="main-frame" className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 z-10 flex-grow flex flex-col gap-8">
        {/* Dynamic Navigation & Title */}
        <header id="app-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900/90">
          <div id="branding-identity-box" className="space-y-1">
            <div className="flex items-center gap-2">
              <span id="branding-badge" className="text-[10px] font-mono uppercase bg-cyan-950/50 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-900/30 font-bold leading-none">
                Active CV Node
              </span>
              <span id="branding-status" className="text-[10px] font-mono uppercase bg-emerald-950/40 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-900/30 tracking-wide font-semibold flex items-center gap-1.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 animate-pulse" />
                Available for Roles
              </span>
            </div>
            
            <h1 id="branding-name" className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2 font-sans">
              Burhanudin Nuban
            </h1>
            <p id="branding-title" className="text-sm font-medium text-slate-400 font-mono flex items-center gap-1.5">
              <span>Full Stack Engineer</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">DevSecOps Engineer</span>
            </p>
          </div>

          {/* Social Links Panel */}
          <div id="branding-socials" className="flex items-center gap-3">
            {/* Interactive Dark/Light Theme Switching Lever */}
            <button
              id="theme-toggler"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-cyan-400 hover:border-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-500" />
              )}
            </button>

            <a
              id="social-github"
              href="https://github.com/burhanudinnuban"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-cyan-400 hover:border-slate-800 transition-all shadow-sm"
              title="GitHub Profile"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              id="social-linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-cyan-400 hover:border-slate-800 transition-all shadow-sm"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              id="social-mail"
              href="mailto:burhanudinnuban@gmail.com"
              className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-cyan-400 hover:border-slate-800 transition-all shadow-sm flex items-center gap-2 text-xs font-medium"
              title="Email Contact Direct"
            >
              <Mail className="w-4.5 h-4.5" />
              <span className="hidden sm:inline font-mono">burhanudinnuban@gmail.com</span>
            </a>
          </div>
        </header>

        {/* Modular Grid Layout Split */}
        <div id="app-grid-columns" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Info Sidebar Panel (Left) */}
          <aside id="sidebar-panel" className="lg:col-span-3 space-y-6">
            {/* Quick Summary Bio */}
            <div id="bio-card" className="p-5 rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/40 space-y-4">
              <div id="avatar-shell" className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 bg-cyan-950/10 flex items-center justify-center text-cyan-400 mx-auto relative overflow-hidden group shadow-lg">
                {/* Simulated Grid Matrix background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.35)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none opacity-80" />
                <Terminal className="w-8 h-8 group-hover:scale-110 transition-transform relative z-10" />
              </div>

              <div id="bio-text" className="text-center space-y-2">
                <h2 id="bio-username" className="text-base font-bold text-slate-100 select-all">{sidebar.username}</h2>
                <p id="bio-desc" className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
                  {sidebar.bio}
                </p>
              </div>

              {sidebar.bullets && sidebar.bullets.length > 0 && (
                <ul id="credentials-bullets" className="space-y-2 pt-3 border-t border-slate-900 text-xs">
                  {sidebar.bullets.map((bullet, idx) => (
                    <li key={idx} id={`cred-bullet-${idx}`} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sidebar.cvUrl && (
                <div id="cv-download-zone" className="pt-3 border-t border-slate-900">
                  <a
                    id="cv-download-link"
                    href={sidebar.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-950/40 to-slate-900 hover:from-cyan-900/30 hover:to-slate-850 text-cyan-400 hover:text-cyan-300 border border-slate-900 hover:border-cyan-500/20 text-[11px] font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download CV / Resume</span>
                  </a>
                </div>
              )}
            </div>

            {/* Premium Interactive CMS Access Gateway Control */}
            {/* <div id="cms-access-flow-card" className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.05),transparent_60%)] pointer-events-none" />
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCmsAuthenticated ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                  CMS Console
                </span>
                <span className={`text-[9px] font-mono leading-none px-1.5 py-0.5 rounded ${isCmsAuthenticated ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40" : "bg-slate-900 text-slate-500"}`}>
                  {isCmsAuthenticated ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>

              {isCmsAuthenticated ? (
                <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    You have active cryptographic clearance. All database editing nodes are editable.
                  </p>
                  <div className="flex gap-2">
                    <button
                      id="sidebar-btn-cms-open"
                      onClick={() => setActiveTab("cms")}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 text-[11px] font-mono font-medium rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1"
                    >
                      Console
                    </button>
                    <button
                      id="sidebar-btn-cms-logout"
                      onClick={() => {
                        setIsCmsAuthenticated(false);
                        sessionStorage.removeItem("cms_auth_status");
                      }}
                      className="flex-1 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border border-rose-900/20 text-[11px] font-mono font-medium rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    Authenticate to modify chronological experiences, technical proficiencies, or repository assets.
                  </p>
                  <button
                    id="sidebar-btn-cms-login"
                    onClick={() => {
                      setActiveTab("cms");
                    }}
                    className="w-full py-2 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-900/20 text-[11px] font-mono font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Access & Decrypt CMS</span>
                  </button>
                </div>
              )}
            </div> */}

            {/* Quick Contact Message Card */}
            <div id="contact-form-card" className="p-5 rounded-2xl border border-slate-900 bg-slate-950/10 space-y-4 relative">
              <div id="contact-header">
                <h4 id="contact-title" className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">
                  Send secure message
                </h4>
                <p id="contact-sub" className="text-[10px] text-slate-500 mt-1">Get directly in touch regarding roles</p>
              </div>

              <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  id="form-name-field"
                  type="text"
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                  disabled={submittingForm || formDone}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 rounded-lg transition-all"
                />
                <input
                  id="form-email-field"
                  type="email"
                  placeholder="Your Email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                  disabled={submittingForm || formDone}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 rounded-lg transition-all"
                />
                <textarea
                  id="form-msg-field"
                  placeholder="Inquiry message..."
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  required
                  rows={3}
                  disabled={submittingForm || formDone}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-900 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 rounded-lg transition-all resize-none"
                />

                <button
                  id="form-send-btn"
                  type="submit"
                  disabled={submittingForm || formDone || !senderName || !senderEmail}
                  className={`w-full py-2 bg-slate-100 hover:bg-white text-[#020204] font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    submittingForm || formDone ? "opacity-50 cursor-wait" : ""
                  }`}
                >
                  {submittingForm ? (
                    <span>Tuning transmission...</span>
                  ) : formDone ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Message Sent!
                    </span>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </button>
              </form>

              {formDone && (
                <p id="form-done-sub" className="text-[10px] text-emerald-400 text-center font-mono">
                  Transmitter confirmed receipt. Burhanudin will follow up!
                </p>
              )}

              {formError && (
                <p id="form-err-sub" className="text-[10px] text-rose-400 text-center font-mono border border-rose-950/40 bg-rose-950/10 py-1 px-2 rounded">
                  {formError}
                </p>
              )}
            </div>
          </aside>

          {/* Core Content Deck Workspace Panel (Right) */}
          <main id="workspace-deck" className="lg:col-span-9 space-y-6">
            {/* Dynamic Segment Selector Deck Tab list */}
            <div id="deck-tabs-wrapper" className="p-1 rounded-xl bg-transparent border-none flex flex-wrap gap-1 select-none">
              <button
                id="tab-btn-journey"
                onClick={() => setActiveTab("journey")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "journey"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience Journey</span>
                {activeTab === "journey" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>

              <button
                id="tab-btn-projects"
                onClick={() => setActiveTab("projects")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "projects"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Projects</span>
                {activeTab === "projects" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>

              <button
                id="tab-btn-scanner"
                onClick={() => setActiveTab("scanner")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "scanner"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Vulnerability Scanner</span>
                {activeTab === "scanner" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>

              <button
                id="tab-btn-pipeline"
                onClick={() => setActiveTab("pipeline")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "pipeline"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>CI/CD Deployer</span>
                {activeTab === "pipeline" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>

              {/* <button
                id="tab-btn-chat"
                onClick={() => setActiveTab("chat")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "chat"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Gemini</span>
                {activeTab === "chat" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button> */}

              <button
                id="tab-btn-cms"
                onClick={() => setActiveTab("cms")}
                className={`relative flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 bg-transparent ${
                  activeTab === "cms"
                    ? "text-cyan-400 font-bold border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-transparent border-transparent"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Secure CMS</span>
                {activeTab === "cms" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Active Render Area */}
            <div id="deck-tab-view-container" className="p-6 md:p-8 rounded-2xl border border-slate-900/70 bg-gradient-to-b from-slate-950/70 to-slate-950/10 min-h-[460px]">
              
              {/* Tab 1: Journey (Bio, Timelines & Proficiencies) */}
              {activeTab === "journey" && (
                <motion.div
                  id="tab-view-journey"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Timeline
                    experiences={experiences}
                    showCredentials={false}
                    rightContent={
                      <div className="space-y-6">
                        <h3 id="proficiencies-embedded-header" className="text-lg font-semibold tracking-tight text-cyan-400 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Technical Proficiencies
                        </h3>
                        <SkillsRadar onSkillClick={handleSkillInterception} skillCategories={skills} />
                      </div>
                    }
                  />
                </motion.div>
              )}

              {/* Tab 3: Projects (Filterable catalog grid) */}
              {activeTab === "projects" && (
                <motion.div
                  id="tab-view-projects"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Source Toggle Selector Header */}
                  <div id="project-source-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-slate-905 bg-slate-950/25 rounded-2xl select-none">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Github className="w-4 h-4 text-cyan-400" />
                        Repository Core Engine
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Synchronize matrix nodes dynamically with live public targets at Github.
                      </p>
                    </div>

                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900">
                      <button
                        onClick={() => setProjectSource("github")}
                        className={`px-3 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                          projectSource === "github"
                            ? "bg-cyan-950/60 text-cyan-400 font-bold border border-cyan-950/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Live GitHub Repos ({githubRepos.length || ""})
                      </button>
                      <button
                        onClick={() => setProjectSource("featured")}
                        className={`px-3 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                          projectSource === "featured"
                            ? "bg-cyan-950/60 text-cyan-400 font-bold border border-cyan-950/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Featured Matrix ({projects.length || ""})
                      </button>
                    </div>
                  </div>

                  {projectSource === "github" && loadingRepos && (
                    <div className="text-center py-20 border border-dashed border-slate-900 rounded-2xl bg-slate-950/10 space-y-3">
                      <Activity className="w-6 h-6 text-cyan-500 animate-spin mx-auto" />
                      <div className="text-xs font-mono text-cyan-400 animate-pulse">
                        Synchronizing dynamic registry nodes from GitHub API...
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Accessing public repository list at github.com/burhanudinnuban
                      </p>
                    </div>
                  )}

                  {projectSource === "github" && repoError && githubRepos.length === 0 && (
                    <div className="p-4 border border-rose-950/40 bg-rose-950/5 text-rose-400 rounded-xl text-xs flex justify-between items-center gap-3">
                      <span>⚠️ {repoError} Exhibiting offline fallback using stable local backup database.</span>
                      <button 
                        onClick={() => { setProjectSource("featured"); }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] rounded font-mono transition-all text-cyan-400"
                      >
                        Show Featured
                      </button>
                    </div>
                  )}

                  {/* Category Filter and Search parameters deck */}
                  <div id="projects-filter-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div id="category-pills" className="flex flex-wrap gap-1.5 select-none">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          id={`cat-pill-${cat.replace(/\s+/g, '-')}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-bold"
                              : "bg-slate-950/40 border-slate-905 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Simple filter matching query */}
                    <div id="search-box" className="relative w-full sm:max-w-xs select-text">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -content -translate-y-1/2" />
                      <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tech: snyk, react..."
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-900 rounded-full text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40 font-mono"
                      />
                      {searchQuery && (
                        <button
                          id="search-clear-btn"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold leading-none font-sans"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Empty state searches */}
                  {filteredProjects.length === 0 ? (
                    <div id="projects-empty-state" className="text-center p-12 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 max-w-md mx-auto">
                      <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <h4 className="text-sm font-semibold text-slate-400">Match Node Null</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        No projects found matching current queries. Try selecting another skill filter or search query.
                      </p>
                    </div>
                  ) : (
                    /* Grid Layout items rendering */
                    <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredProjects.map((proj, pIdx) => (
                        <div
                          key={proj.id}
                          id={`project-card-${proj.id}`}
                          className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-850 hover:bg-slate-950/90 transition-all flex flex-col justify-between gap-5 relative overflow-hidden group"
                        >
                          <div id={`project-headers-${proj.id}`} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span id={`project-category-${proj.id}`} className="text-[10px] font-bold font-mono text-cyan-400 px-2 py-0.5 bg-cyan-950/40 border border-cyan-850/50 rounded-full">
                                {proj.category}
                              </span>
                              <span id={`project-icon-status-${proj.id}`} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            </div>

                            <div className="space-y-1">
                              <h4 id={`project-title-${proj.id}`} className="text-base font-semibold group-hover:text-cyan-400 transition-colors">
                                {proj.title}
                              </h4>
                              <p id={`project-desc-${proj.id}`} className="text-xs text-slate-400 leading-relaxed font-sans">
                                {proj.description}
                              </p>
                              {proj.details && (
                                <p id={`project-details-${proj.id}`} className="text-[10px] text-slate-500 font-mono pt-1">
                                  {proj.details}
                                </p>
                              )}
                            </div>
                          </div>

                          <div id={`project-footers-${proj.id}`} className="space-y-4">
                            {/* Technology tags */}
                            <div id={`project-tags-${proj.id}`} className="flex flex-wrap gap-1">
                              {proj.tech.map((t) => (
                                <span
                                  key={t}
                                  id={`tag-${proj.id}-${t}`}
                                  onClick={() => setSearchQuery(t)}
                                  className="px-2 py-0.5 bg-slate-900 border border-slate-850 hover:border-cyan-500/30 text-[10px] text-slate-400 font-mono rounded cursor-pointer hover:text-cyan-400 transition-all"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div id={`project-links-${proj.id}`} className="flex justify-between items-center pt-3.5 border-t border-slate-900/60 text-xs font-mono select-none">
                              <a
                                id={`link-repository-${proj.id}`}
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Github className="w-3.5 h-3.5" />
                                <span>browse_source</span>
                              </a>

                              <span id={`link-status-${proj.id}`} className="text-[10px] text-slate-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                production_compiled
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 4: Vulnerability Sandbox CodeScanner */}
              {activeTab === "scanner" && (
                <motion.div
                  id="tab-view-scanner"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CodeScanner />
                </motion.div>
              )}

              {/* Tab 5: CD Pipeline Simulator */}
              {activeTab === "pipeline" && (
                <motion.div
                  id="tab-view-pipeline"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PipelineSimulator />
                </motion.div>
              )}

              {/* Tab 6: AIAgent chat bot */}
              {activeTab === "chat" && (
                <motion.div
                  id="tab-view-chat"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIAgent />
                </motion.div>
              )}

              {/* Tab 7: Administrative Cryptographic CMS */}
              {activeTab === "cms" && (
                <motion.div
                  id="tab-view-cms"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminCMS
                    currentData={{ experiences, skills, projects, sidebar }}
                    isAuthenticated={isCmsAuthenticated}
                    setIsAuthenticated={setIsCmsAuthenticated}
                    onDataChange={(updated) => {
                      setExperiences(updated.experiences);
                      setSkills(updated.skills);
                      setProjects(updated.projects);
                      if (updated.sidebar) {
                        setSidebar(updated.sidebar);
                      }
                    }}
                  />
                </motion.div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* Humble Footer containing no technical slop metadata, clean styling */}
      <footer id="app-footer" className={`w-full border-t py-6 px-4 shrink-0 backdrop-blur ${theme === "light" ? "border-slate-200 bg-white/70 text-slate-500" : "border-slate-950 bg-[#020204]/90 text-slate-400"}`}>
        <div id="footer-inner" className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-slate-500">
          <p id="footer-copyright">
            © {new Date().getFullYear()} Burhanudin Nuban. Secure digital software layouts.
          </p>

          <p id="footer-status-p" className="flex items-center gap-1.5 uppercase select-none">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Node Status: Encrypted & Live</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
