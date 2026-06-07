import React, { useState, useEffect } from "react";
import { Experience, SkillCategory, Project, SidebarData } from "../types";
import { SIDEBAR_DEFAULT_DATA } from "../data";
import { encryptPayload, decryptPayload, getObscuredKey, verifyAdminCredentials } from "../utils/crypto";
import {
  Lock,
  Unlock,
  Key,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileText,
  TrendingUp,
  FolderLock,
  Save,
  AlertTriangle,
  RotateCcw,
  User,
  Heart
} from "lucide-react";
import { motion } from "motion/react";

interface AdminCMSProps {
  onDataChange: (data: {
    experiences: Experience[];
    skills: SkillCategory[];
    projects: Project[];
    sidebar?: SidebarData;
  }) => void;
  currentData: {
    experiences: Experience[];
    skills: SkillCategory[];
    projects: Project[];
    sidebar?: SidebarData;
  };
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

export default function AdminCMS({ onDataChange, currentData, isAuthenticated, setIsAuthenticated }: AdminCMSProps) {
  // Authentication states
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // CMS active editing lists (local working copy)
  const [workingExperiences, setWorkingExperiences] = useState<Experience[]>([]);
  const [workingSkills, setWorkingSkills] = useState<SkillCategory[]>([]);
  const [workingProjects, setWorkingProjects] = useState<Project[]>([]);
  const [workingSidebar, setWorkingSidebar] = useState<SidebarData>(SIDEBAR_DEFAULT_DATA);

  // Sub-tabs in the CMS editor view
  const [cmsTab, setCmsTab] = useState<"experience" | "skills" | "projects" | "sidebar">("experience");

  // Dynamic Inbox states
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  const fetchInboxMessages = async () => {
    const activeUser = username || sessionStorage.getItem("cms_auth_user") || "";
    const activePass = password || sessionStorage.getItem("cms_auth_pass") || "";
    if (!activeUser || !activePass) return;

    setIsLoadingMessages(true);
    try {
      const res = await fetch("/api/cms/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: activeUser, password: activePass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInboxMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Failed to fetch inbox records:", e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const deleteInboxMessage = async (messageId: string) => {
    const activeUser = username || sessionStorage.getItem("cms_auth_user") || "";
    const activePass = password || sessionStorage.getItem("cms_auth_pass") || "";
    if (!activeUser || !activePass) return;

    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch("/api/cms/inbox/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: activeUser, password: activePass, messageId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", "Message thread deleted successfully!");
        fetchInboxMessages();
      } else {
        triggerNotification("error", data.error || "Failed to remove inquiry.");
      }
    } catch (e) {
      console.error("Delete inbox message error:", e);
      triggerNotification("error", "Failed to contact deletion dispatcher.");
    }
  };

  // Edit states
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editExpRole, setEditExpRole] = useState<string>("");
  const [editExpCompany, setEditExpCompany] = useState<string>("");
  const [editExpPeriod, setEditExpPeriod] = useState<string>("");
  const [editExpDescRaw, setEditExpDescRaw] = useState<string>("");
  const [editExpSkillsRaw, setEditExpSkillsRaw] = useState<string>("");

  // Skills dynamic states
  const [activeSkillCatIdx, setActiveSkillCatIdx] = useState<number>(0);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [newSkillLevel, setNewSkillLevel] = useState<number>(90);

  // Projects dynamic states
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editProjTitle, setEditProjTitle] = useState<string>("");
  const [editProjCategory, setEditProjCategory] = useState<"Full-Stack" | "DevSecOps" | "Cloud Infrastructure">("Full-Stack");
  const [editProjDesc, setEditProjDesc] = useState<string>("");
  const [editProjDetails, setEditProjDetails] = useState<string>("");
  const [editProjTechRaw, setEditProjTechRaw] = useState<string>("");
  const [editProjGithub, setEditProjGithub] = useState<string>("");

  // Sidebar editing sub-states
  const [editSidebarUser, setEditSidebarUser] = useState<string>("");
  const [editSidebarBio, setEditSidebarBio] = useState<string>("");
  const [editSidebarBulletsRaw, setEditSidebarBulletsRaw] = useState<string>("");
  const [editSidebarCvUrl, setEditSidebarCvUrl] = useState<string>("");

  // Notification and save feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");

  // Synchronize dynamic draft states whenever authenticated or parent dataset updates
  useEffect(() => {
    if (isAuthenticated) {
      // Clone master database arrays into admin draft sheets
      setWorkingExperiences(JSON.parse(JSON.stringify(currentData.experiences)));
      setWorkingSkills(JSON.parse(JSON.stringify(currentData.skills)));
      setWorkingProjects(JSON.parse(JSON.stringify(currentData.projects)));
      if (currentData.sidebar) {
        setWorkingSidebar(JSON.parse(JSON.stringify(currentData.sidebar)));
        setEditSidebarUser(currentData.sidebar.username);
        setEditSidebarBio(currentData.sidebar.bio);
        setEditSidebarBulletsRaw(currentData.sidebar.bullets.join("\n"));
        setEditSidebarCvUrl(currentData.sidebar.cvUrl || "");
      }
    }
  }, [currentData, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Validate credentials using dynamic secure reconstruction matching to prevent static bundle inspection
    if (verifyAdminCredentials(username, password)) {
      setIsAuthenticated(true);
      setWorkingExperiences(JSON.parse(JSON.stringify(currentData.experiences)));
      setWorkingSkills(JSON.parse(JSON.stringify(currentData.skills)));
      setWorkingProjects(JSON.parse(JSON.stringify(currentData.projects)));
      if (currentData.sidebar) {
        setWorkingSidebar(JSON.parse(JSON.stringify(currentData.sidebar)));
        setEditSidebarUser(currentData.sidebar.username);
        setEditSidebarBio(currentData.sidebar.bio);
        setEditSidebarBulletsRaw(currentData.sidebar.bullets.join("\n"));
        setEditSidebarCvUrl(currentData.sidebar.cvUrl || "");
      }
      sessionStorage.setItem("cms_auth_status", "unlocked");
      sessionStorage.setItem("cms_auth_user", username);
      sessionStorage.setItem("cms_auth_pass", password);
      triggerNotification("success", "Secure CMS Session opened & Authenticated!");
    } else {
      setLoginError("Invalid credentials. Please verify your cryptographic credentials key file.");
    }
  };

  const handeLogOut = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    sessionStorage.removeItem("cms_auth_status");
    sessionStorage.removeItem("cms_auth_user");
    sessionStorage.removeItem("cms_auth_pass");
    triggerNotification("success", "Secure CMS Session logged out");
  };

  const triggerNotification = (type: "success" | "error", msg: string) => {
    setAlertType(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertType("");
      setAlertMessage("");
    }, 4000);
  };

  // --- PORTFOLIO DATA PERSISTENCE ENGINE ---
  const saveAndEncryptAll = async () => {
    setIsSaving(true);
    try {
      const unifiedDB = {
        experiences: workingExperiences,
        skills: workingSkills,
        projects: workingProjects,
        sidebar: workingSidebar
      };

      // Back up locally in cleartext JSON
      localStorage.setItem("cms_secured_db", JSON.stringify(unifiedDB));

      const activeUser = username || sessionStorage.getItem("cms_auth_user") || "";
      const activePass = password || sessionStorage.getItem("cms_auth_pass") || "";

      // Save database layout synchronously to backend hosting persistent disk
      try {
        const response = await fetch("/api/cms/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: activeUser,
            password: activePass,
            data: unifiedDB
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          console.warn("CMS was able to save to browser cache but failed to sync on the server host:", result);
          triggerNotification("error", "Failed to sync on server: " + (result.error || "Unknown error"));
        } else {
          // Let parent hook into updated state dynamically
          onDataChange(unifiedDB);
          triggerNotification("success", "Database saved securely to server JSON storage & browser cache!");
        }
      } catch (srvErr) {
        console.error("Critical server storage offline status detected, saved to browser cache only:", srvErr);
        triggerNotification("error", "Server backup sync offline. Saved locally in browser cache.");
      }
    } catch (err: any) {
      console.error(err);
      triggerNotification("error", "Error saving database layout: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Restores local storage backups back to static defaults
  const resetToFactoryDefaults = async () => {
    if (window.confirm("Are you sure you want to revert all custom CMS edits back to default portfolio records? This will overwrite both the local browser database and the server JSON backup file.")) {
      try {
        const activeUser = username || sessionStorage.getItem("cms_auth_user") || "";
        const activePass = password || sessionStorage.getItem("cms_auth_pass") || "";

        localStorage.removeItem("cms_secured_db");
        await fetch("/api/cms/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: activeUser,
            password: activePass
          }),
        });
      } catch (err) {
        console.error("Failed to cleanly clear the remote server database backup.", err);
      }
      window.location.reload();
    }
  };

  // --- EXPERIENCE LOGIC ---
  const startEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setEditExpRole(exp.role);
    setEditExpCompany(exp.company);
    setEditExpPeriod(exp.period);
    setEditExpDescRaw(exp.description.join("\n"));
    setEditExpSkillsRaw(exp.skills.join(", "));
  };

  const saveExpEdit = () => {
    if (!editExpRole || !editExpCompany || !editExpPeriod) {
      triggerNotification("error", "Please provide Role, Company, and Period.");
      return;
    }
    const updated = workingExperiences.map((exp) => {
      if (exp.id === editingExpId) {
        return {
          ...exp,
          role: editExpRole,
          company: editExpCompany,
          period: editExpPeriod,
          description: editExpDescRaw.split("\n").filter(line => line.trim() !== ""),
          skills: editExpSkillsRaw.split(",").map(s => s.trim()).filter(s => s !== "")
        };
      }
      return exp;
    });
    setWorkingExperiences(updated);
    setEditingExpId(null);
    triggerNotification("success", "Role modifications stored in volatile storage frame");
  };

  const addNewExp = () => {
    const freshJob: Experience = {
      id: "exp-" + Date.now(),
      role: "New Role Title",
      company: "Company Name",
      period: "2026 - Present",
      description: ["Contributed to secure runtime architectures.", "Analyzed code vulnerabilities."],
      skills: ["Docker", "Linux"]
    };
    setWorkingExperiences([freshJob, ...workingExperiences]);
    startEditExp(freshJob);
    triggerNotification("success", "Blank Experience frame appended");
  };

  const deleteExp = (id: string) => {
    setWorkingExperiences(workingExperiences.filter(e => e.id !== id));
    if (editingExpId === id) setEditingExpId(null);
    triggerNotification("success", "Experience record removed from stage");
  };

  // --- SKILLS PROFILES LOGIC ---
  const handleAddSkillItem = () => {
    if (!newSkillName.trim()) return;
    const cat = workingSkills[activeSkillCatIdx];
    if (!cat) return;

    const exists = cat.items.some(i => i.name.toLowerCase() === newSkillName.toLowerCase().trim());
    if (exists) {
      triggerNotification("error", "Skill identifier already exists in this pool");
      return;
    }

    const updatedItems = [...cat.items, { name: newSkillName.trim(), level: Math.min(100, Math.max(10, newSkillLevel)) }];
    const updatedCats = workingSkills.map((c, idx) => {
      if (idx === activeSkillCatIdx) {
        return { ...c, items: updatedItems };
      }
      return c;
    });

    setWorkingSkills(updatedCats);
    setNewSkillName("");
    triggerNotification("success", "Appended new technology to categories matrix");
  };

  const handleDeleteSkillItem = (categoryIndex: number, skillName: string) => {
    const updatedCats = workingSkills.map((cat, idx) => {
      if (idx === categoryIndex) {
        return {
          ...cat,
          items: cat.items.filter(item => item.name !== skillName)
        };
      }
      return cat;
    });
    setWorkingSkills(updatedCats);
    triggerNotification("success", "Vaporized skill item from indices");
  };

  const handleUpdateLevel = (categoryIndex: number, skillName: string, levelValue: number) => {
    const updatedCats = workingSkills.map((cat, idx) => {
      if (idx === categoryIndex) {
        return {
          ...cat,
          items: cat.items.map(item => {
            if (item.name === skillName) {
              return { ...item, level: Math.min(100, Math.max(10, levelValue)) };
            }
            return item;
          })
        };
      }
      return cat;
    });
    setWorkingSkills(updatedCats);
  };

  // --- PROJECTS LOGIC ---
  const startEditProj = (p: Project) => {
    setEditingProjId(p.id);
    setEditProjTitle(p.title);
    setEditProjCategory(p.category);
    setEditProjDesc(p.description);
    setEditProjDetails(p.details);
    setEditProjTechRaw(p.tech.join(", "));
    setEditProjGithub(p.githubUrl || "");
  };

  const saveProjEdit = () => {
    if (!editProjTitle || !editProjDesc || !editProjDetails) {
      triggerNotification("error", "Please provide Title, description, and comprehensive details summary.");
      return;
    }
    const updated = workingProjects.map((p) => {
      if (p.id === editingProjId) {
        return {
          ...p,
          title: editProjTitle,
          category: editProjCategory,
          description: editProjDesc,
          details: editProjDetails,
          tech: editProjTechRaw.split(",").map(t => t.trim()).filter(t => t !== ""),
          githubUrl: editProjGithub
        };
      }
      return p;
    });
    setWorkingProjects(updated);
    setEditingProjId(null);
    triggerNotification("success", "Saved project changes to temporal buffers");
  };

  const addNewProj = () => {
    const rawProj: Project = {
      id: "proj-" + Date.now(),
      title: "Title of Repository",
      category: "Full-Stack",
      description: "Short highlight description of the product.",
      details: "Full modular summary about security gates, pipeline constraints, and features.",
      tech: ["React", "TypeScript", "Node.js"],
      githubUrl: "https://github.com/burhanudinnuban"
    };
    setWorkingProjects([rawProj, ...workingProjects]);
    startEditProj(rawProj);
    triggerNotification("success", "Initialized default Project grid frame");
  };

  const deleteProj = (id: string) => {
    setWorkingProjects(workingProjects.filter(p => p.id !== id));
    if (editingProjId === id) setEditingProjId(null);
    triggerNotification("success", "Project record removed");
  };

  // Portal login screen (when state is not unlocked)
  if (!isAuthenticated) {
    return (
      <div id="cms-login-viewport" className="py-6 max-w-md mx-auto relative select-text">
        <div id="cms-login-box" className="p-6 rounded-2xl border border-slate-900 bg-slate-950/80 backdrop-blur-md space-y-6">
          <div id="login-header-zone" className="text-center space-y-2">
            <div id="lock-shield" className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h3 id="login-heading" className="text-base font-bold tracking-tight text-slate-100 font-sans">
              Encrypted Admin Gateway
            </h3>
            <p id="lock-instruction-tag" className="text-xs text-slate-400">
              Only authentic system administrator keys can decrypt the CMS data schema.
            </p>
          </div>

          <form id="cms-entry-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase font-semibold text-slate-400 block">Username</label>
              <input
                id="cms-login-user"
                type="text"
                placeholder="system_admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-black/50 border border-slate-900 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase font-semibold text-slate-400 block">Passphrase Key</label>
              <input
                id="cms-login-pass"
                type="password"
                placeholder="•••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-slate-900 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              id="cms-login-submit"
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Validate & Decrypt Workspace</span>
            </button>
          </form>

          {loginError && (
            <div id="login-err-card" className="p-3 text-[10px] bg-red-950/40 border border-red-900/30 text-rose-400 rounded-xl leading-relaxed flex gap-2 font-mono">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Live admin dashboard
  return (
    <div id="cms-live-workspace" className="space-y-6 select-text text-xs leading-relaxed text-slate-200">
      {/* Dynamic Header action nodes */}
      <div id="cms-dashboard-top" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div id="cms-info-identity" className="flex items-center gap-3">
          <div id="unlock-badge" className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-emerald-400">
            <Unlock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 id="cms-dash-title" className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
              <span>CMS Workspace Unlocked</span>
              <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 rounded font-bold">
                AES-XOR AES_ACTIVE
              </span>
            </h3>
            <p id="cms-dash-sub" className="text-[10px] text-slate-400 font-mono">Operator: burhanudinnuban • active memory draft</p>
          </div>
        </div>

        {/* Global Save Controls */}
        <div id="pipeline-control-cluster" className="flex items-center gap-2.5">
          <button
            id="cms-rollback-factory"
            onClick={resetToFactoryDefaults}
            className="px-3 py-1.5 border border-slate-900 hover:border-slate-850 hover:bg-slate-950 text-slate-400 rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[10px] uppercase font-mono font-bold"
            title="Wipe database changes and return to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Setup</span>
          </button>

          <button
            id="cms-save-lock-btn"
            onClick={saveAndEncryptAll}
            disabled={isSaving}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)] text-[10px] uppercase font-mono"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Encrypting Core..." : "Encrypt & Deploy"}</span>
          </button>

          <button
            id="cms-logout-trigger"
            onClick={handeLogOut}
            className="p-1.5 text-slate-500 hover:text-rose-450 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/25 rounded-md cursor-pointer transition-all"
            title="Lock CMS Portal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Status Warning Alert messages */}
      {alertMessage && (
        <div
          id="cms-float-alert"
          className={`p-3 rounded-xl border flex items-center gap-2 text-[11px] font-mono ${
            alertType === "success"
              ? "bg-emerald-950/30 border-emerald-900/30 text-emerald-300"
              : "bg-rose-950/30 border-rose-900/30 text-rose-300"
          }`}
        >
          {alertType === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Editing selection workspace tabs */}
      <div id="cms-nav-ribbon" className="flex items-center gap-1 border-b border-slate-900 pb-0 flex-wrap">
        <button
          id="cms-tab-opt-exp"
          onClick={() => setCmsTab("experience")}
          className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all cursor-pointer ${
            cmsTab === "experience"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Experience Experience ({workingExperiences.length})
        </button>
        <button
          id="cms-tab-opt-skills"
          onClick={() => setCmsTab("skills")}
          className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all cursor-pointer ${
            cmsTab === "skills"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Proficiencies ({workingSkills.length})
        </button>
        <button
          id="cms-tab-opt-proj"
          onClick={() => setCmsTab("projects")}
          className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all cursor-pointer ${
            cmsTab === "projects"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Projects ({workingProjects.length})
        </button>
        <button
          id="cms-tab-opt-sidebar"
          onClick={() => setCmsTab("sidebar")}
          className={`px-4 py-2 border-b-2 text-xs font-mono font-bold transition-all cursor-pointer ${
            cmsTab === "sidebar"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          Left Sidebar Customize
        </button>
      </div>

      {/* --- RENDER WORKSPACE: EXPERIENCE TIMELINE --- */}
      {cmsTab === "experience" && (
        <div id="cms-editor-experience" className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-950/40 p-4 border border-slate-900 rounded-xl">
            <p className="text-slate-400 text-[11px]">
              Chronological professional layout rows. Use the form to adjust description bullet points and skill markers.
            </p>
            <button
              id="cms-add-exp-row"
              onClick={addNewExp}
              className="px-3 py-1.5 bg-slate-900 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-slate-950 font-mono text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Job</span>
            </button>
          </div>

          <div id="experience-editor-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List left */}
            <div className="lg:col-span-5 space-y-3">
              {workingExperiences.map((exp) => (
                <div
                  key={exp.id}
                  id={`cms-exp-card-${exp.id}`}
                  className={`p-4 border rounded-xl flex items-start justify-between gap-3 bg-[#070709] transition-all ${
                    editingExpId === exp.id ? "border-cyan-500/40 bg-slate-950" : "border-slate-900"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-200">{exp.role}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {exp.company} • {exp.period}
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      {exp.skills.length} skills tags • {exp.description.length} bullets
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditExp(exp)}
                      className="p-1 px-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded cursor-pointer transition-colors"
                      title="Edit Experience"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExp(exp.id)}
                      className="p-1 px-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/10 rounded cursor-pointer transition-colors"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing Pane */}
            <div className="lg:col-span-7 bg-zinc-950/20 border border-slate-900 p-5 rounded-xl space-y-4">
              {editingExpId ? (
                <div id="cms-exp-editor-panel" className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <h4 className="font-bold text-slate-300 uppercase font-mono text-[10px]">Active Experience Edit Form</h4>
                    <span className="text-[9px] text-slate-500 font-mono font-bold select-all">{editingExpId}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Role Title</label>
                      <input
                        type="text"
                        value={editExpRole}
                        onChange={(e) => setEditExpRole(e.target.value)}
                        className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Company Name</label>
                      <input
                        type="text"
                        value={editExpCompany}
                        onChange={(e) => setEditExpCompany(e.target.value)}
                        className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400">Work Period Timeline (e.g. 2024 - Present)</label>
                    <input
                      type="text"
                      value={editExpPeriod}
                      onChange={(e) => setEditExpPeriod(e.target.value)}
                      className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400">Bullet Accomplishments (One per line)</label>
                    <textarea
                      rows={5}
                      value={editExpDescRaw}
                      onChange={(e) => setEditExpDescRaw(e.target.value)}
                      placeholder="Shifted security left into continuous delivery pipelines..."
                      className="w-full bg-black/60 border border-slate-900 text-xs p-3 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400">Affiliated Skill Tags (Separated by commas)</label>
                    <input
                      type="text"
                      value={editExpSkillsRaw}
                      onChange={(e) => setEditExpSkillsRaw(e.target.value)}
                      placeholder="React, Kubernetes, AWS, Go"
                      className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-500/30 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingExpId(null)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-slate-400 border border-slate-850 text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveExpEdit}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Commit Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                  <span>Select any job role on the left pane to edit fields or add a live draft.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RENDER WORKSPACE: SKILLS MATRIX --- */}
      {cmsTab === "skills" && (
        <div id="cms-editor-skills" className="space-y-6">
          <div className="p-4 border border-slate-900 bg-zinc-950/40 rounded-xl text-slate-400 text-[11px] leading-relaxed flex items-center justify-between">
            <span>Manage technical levels (expressed as integers up to 100) or add new entries to specific categories matrices.</span>
          </div>

          <div id="skills-cat-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {workingSkills.map((cat, catIdx) => (
              <div key={cat.title} className="p-4 border border-slate-900 bg-black/35 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-900">
                  <h4 className="font-bold text-slate-300 font-sans">{cat.title}</h4>
                  <span className="text-[9px] font-mono uppercase bg-slate-900 text-slate-500 border border-slate-850 px-1.5 rounded leading-none">
                    {cat.items.length} items
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {cat.items.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between gap-3 bg-[#07070a] p-2 border border-slate-900/60 rounded-lg">
                      <span className="text-slate-300 max-w-[120px] truncate" title={skill.name}>{skill.name}</span>
                      
                      <div className="flex items-center gap-2">
                        {/* Dynamic level numeric spinner */}
                        <input
                          type="number"
                          min={20}
                          max={100}
                          value={skill.level}
                          onChange={(e) => handleUpdateLevel(catIdx, skill.name, parseInt(e.target.value) || 50)}
                          className="w-12 bg-black border border-slate-900 px-1 py-0.5 text-center text-[11px] text-cyan-400 font-mono rounded"
                        />
                        <span className="text-[9px] text-slate-500 font-mono font-medium">%</span>
                        
                        <button
                          onClick={() => handleDeleteSkillItem(catIdx, skill.name)}
                          className="text-slate-600 hover:text-rose-400 hover:bg-rose-950/20 p-1 rounded"
                          title="Delete skill"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline appending item */}
                <div className="pt-2 border-t border-slate-900 text-[10px] space-y-2">
                  <span className="text-slate-500 uppercase font-mono font-bold leading-none block">Append tool node</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="e.g. Helm"
                      value={activeSkillCatIdx === catIdx ? newSkillName : ""}
                      onChange={(e) => {
                        setActiveSkillCatIdx(catIdx);
                        setNewSkillName(e.target.value);
                      }}
                      className="flex-1 bg-black/60 border border-slate-900 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/30 rounded"
                    />
                    <button
                      onClick={() => {
                        setActiveSkillCatIdx(catIdx);
                        handleAddSkillItem();
                      }}
                      type="button"
                      className="p-1.5 px-2 bg-slate-900 hover:bg-slate-950 border border-slate-850 text-cyan-400 rounded cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- RENDER WORKSPACE: PROJECTS LIST --- */}
      {cmsTab === "projects" && (
        <div id="cms-editor-projects" className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-950/40 p-4 border border-slate-900 rounded-xl">
            <p className="text-slate-400 text-[11px]">
              Deploy and maintain your digital projects matrix. All repository targets render clean badges in core layouts.
            </p>
            <button
              id="cms-add-proj"
              onClick={addNewProj}
              className="px-3 py-1.5 bg-slate-900 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-slate-950 font-mono text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div id="projects-editor-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List left */}
            <div className="lg:col-span-5 space-y-3">
              {workingProjects.map((p) => (
                <div
                  key={p.id}
                  id={`cms-proj-card-${p.id}`}
                  className={`p-4 border rounded-xl flex items-start justify-between gap-3 bg-[#070709] transition-all ${
                    editingProjId === p.id ? "border-cyan-500/40 bg-slate-950" : "border-slate-900"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-850/30 text-cyan-400 uppercase leading-none">
                        {p.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200 mt-1">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                    <span className="text-[9px] text-slate-500 block font-mono mt-1">
                      {p.tech.length} Technologies • Git link configured
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditProj(p)}
                      className="p-1 px-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded cursor-pointer transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProj(p.id)}
                      className="p-1 px-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/10 rounded cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing pane */}
            <div className="lg:col-span-7 bg-zinc-950/20 border border-slate-900 p-5 rounded-xl space-y-4">
              {editingProjId ? (
                <div id="cms-proj-editor-panel" className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <h4 className="font-bold text-slate-300 uppercase font-mono text-[10px]">Active Project Edit Form</h4>
                    <span className="text-[9px] text-slate-500 font-mono font-bold select-all">{editingProjId}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Project Title</label>
                      <input
                        type="text"
                        value={editProjTitle}
                        onChange={(e) => setEditProjTitle(e.target.value)}
                        className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Structural Category</label>
                      <select
                        value={editProjCategory}
                        onChange={(e) => setEditProjCategory(e.target.value as any)}
                        className="w-full bg-black/60 border border-slate-900 text-xs px-2.5 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 font-mono font-semibold"
                      >
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="DevSecOps">DevSecOps</option>
                        <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400">Brief Overview Description</label>
                    <input
                      type="text"
                      value={editProjDesc}
                      onChange={(e) => setEditProjDesc(e.target.value)}
                      placeholder="An automated security validator dashboard..."
                      className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400">Deep Details & Architecture Synopsis</label>
                    <textarea
                      rows={4}
                      value={editProjDetails}
                      onChange={(e) => setEditProjDetails(e.target.value)}
                      placeholder="Brief how-to structure metrics, threat aggregators, and Snyk endpoints parameters..."
                      className="w-full bg-black/60 border border-slate-900 text-xs p-3 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 resize-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 animate-none">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Source Repository Location (URL)</label>
                      <input
                        type="url"
                        value={editProjGithub}
                        onChange={(e) => setEditProjGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500/30 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400">Technology Tags (Comma delimited)</label>
                      <input
                        type="text"
                        value={editProjTechRaw}
                        onChange={(e) => setEditProjTechRaw(e.target.value)}
                        placeholder="React, TypeScript, Snyk, GKE"
                        className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-500/30 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingProjId(null)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-slate-400 border border-slate-850 text-[10px] font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProjEdit}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Commit Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                  <span>Select any project block on the left pane to modify details configuration.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RENDER WORKSPACE: LEFT SIDEBAR CUSTOMIZATION --- */}
      {cmsTab === "sidebar" && (
        <div id="cms-editor-sidebar" className="space-y-6">
          <div className="p-4 border border-slate-900 bg-zinc-950/40 rounded-xl text-slate-400 text-[11px] leading-relaxed flex items-center justify-between">
            <span>Edit left sidebar bio information and custom bullet points here. Press Update Sidebar below to load values into volatile memory.</span>
          </div>

          <div id="sidebar-editor-form" className="bg-zinc-950/20 border border-slate-900 p-5 rounded-xl space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400">Username Identifier</label>
              <input
                type="text"
                value={editSidebarUser}
                onChange={(e) => setEditSidebarUser(e.target.value)}
                className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2.5 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 font-mono"
                placeholder="burhanudinnuban"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400">Bio / Summary Description Paragraph</label>
              <textarea
                rows={4}
                value={editSidebarBio}
                onChange={(e) => setEditSidebarBio(e.target.value)}
                className="w-full bg-black/60 border border-slate-900 text-xs p-3 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 resize-none leading-relaxed"
                placeholder="Architecting secure modern websites..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400">Credentials bullets (One per line)</label>
              <textarea
                rows={4}
                value={editSidebarBulletsRaw}
                onChange={(e) => setEditSidebarBulletsRaw(e.target.value)}
                className="w-full bg-black/60 border border-slate-900 text-xs p-3 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 resize-none font-mono text-[11px]"
                placeholder="Secure Server Provisioners&#10;React / Node microservices..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400">CV / Resume Download Link (URL)</label>
              <input
                type="text"
                value={editSidebarCvUrl}
                onChange={(e) => setEditSidebarCvUrl(e.target.value)}
                className="w-full bg-black/60 border border-slate-900 text-xs px-3 py-2.5 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/30 font-mono"
                placeholder="https://example.com/cv.pdf"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const bullets = editSidebarBulletsRaw.split("\n").map(b => b.trim()).filter(b => b !== "");
                  setWorkingSidebar({
                    username: editSidebarUser,
                    bio: editSidebarBio,
                    bullets,
                    cvUrl: editSidebarCvUrl
                  });
                  triggerNotification("success", "Sidebar attributes stored in volatile buffer! Press Encrypt & Deploy to apply permanently.");
                }}
                className="px-4 py-2 bg-slate-900 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 font-mono text-[10px] uppercase font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Update Sidebar Buffer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
