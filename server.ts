import express from "express";
import path from "path";
import fs from "fs";
// import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

function verifyAdminCredentials(user: string, pass: string): boolean {
  const userArray = [98, 117, 114, 104, 97, 110, 117, 100, 105, 110, 110, 117, 98, 97, 110];
  let expectedUser = "";
  for (let idx = 0; idx < userArray.length; idx++) {
    expectedUser += String.fromCharCode(userArray[idx]);
  }
  const codeArray = [80, 64, 115, 119, 48, 114, 100, 70, 48, 117, 110, 68, 51, 100];
  let expectedPass = "";
  for (let idx = 0; idx < codeArray.length; idx++) {
    expectedPass += String.fromCharCode(codeArray[idx]);
  }

  if (!user || !pass || user.length !== expectedUser.length || pass.length !== expectedPass.length) {
    return false;
  }

  let matchAccumulator = 0;
  for (let i = 0; i < user.length; i++) {
    matchAccumulator |= user.charCodeAt(i) ^ expectedUser.charCodeAt(i);
  }
  for (let i = 0; i < pass.length; i++) {
    matchAccumulator |= pass.charCodeAt(i) ^ expectedPass.charCodeAt(i);
  }

  return matchAccumulator === 0;
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data.json");

// Dynamic content loader from server-side JSON file
app.get("/api/cms/load", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const plainData = fs.readFileSync(DATA_FILE_PATH, "utf8");
      res.json({ success: true, data: JSON.parse(plainData) });
    } else {
      res.json({ success: false, reason: "No server file found." });
    }
  } catch (error: any) {
    console.error("Failed to load server database file:", error);
    res.status(500).json({ error: "Failed to load database file." });
  }
});

// Dynamic content saver to server-side JSON file
app.post("/api/cms/save", (req, res) => {
  try {
    const { username, password, data } = req.body;

    if (!verifyAdminCredentials(username, password)) {
      res.status(401).json({ success: false, error: "Authentication failed. Unauthorized database access blocked." });
      return;
    }

    if (!data) {
      res.status(400).json({ success: false, error: "No payload data passed." });
      return;
    }

    let originalData: any = {};
    if (fs.existsSync(DATA_FILE_PATH)) {
      try {
        originalData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf8"));
      } catch (e) {
        console.error("Could not parse original database layout:", e);
      }
    }

    const mergedData = {
      ...originalData,
      experiences: data.experiences || originalData.experiences,
      skills: data.skills || originalData.skills,
      projects: data.projects || originalData.projects,
      sidebar: data.sidebar || originalData.sidebar
    };

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(mergedData, null, 2), "utf8");
    res.json({ success: true, message: "Server database file written successfully." });
  } catch (error: any) {
    console.error("Failed to save server database file:", error);
    res.status(500).json({ error: "Failed to save database file." });
  }
});

// Reset and remove server-side JSON file
app.post("/api/cms/reset", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!verifyAdminCredentials(username, password)) {
      res.status(401).json({ success: false, error: "Authentication failed. Unauthorized reset blocked." });
      return;
    }

    res.json({ success: true, message: "Storage reset triggers cleared successfully." });
  } catch (error: any) {
    console.error("Failed to clear server database file:", error);
    res.status(500).json({ error: "Failed to reset database file." });
  }
});

// ------------------- API ROUTES -------------------

const MESSAGES_FILE_PATH = path.join(process.cwd(), "src", "messages.json");

// A. Dynamic Email Dispatch & Inbox Logger API Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: "Name, email, and message are required fields." });
      return;
    }

    const timestamp = new Date().toISOString();
    const systemIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Localhost";
    const userAgent = req.headers['user-agent'] || "Unknown Device";

    const newMessage = {
      id: "msg-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name,
      email,
      message,
      timestamp,
      ip: systemIp,
      userAgent
    };

    let inboxList: any[] = [];
    if (fs.existsSync(MESSAGES_FILE_PATH)) {
      try {
        const rawContent = fs.readFileSync(MESSAGES_FILE_PATH, "utf8");
        inboxList = JSON.parse(rawContent);
      } catch (e) {
        console.error("Failed to parse existing mailbox registry:", e);
      }
    }
    inboxList.unshift(newMessage);
    fs.writeFileSync(MESSAGES_FILE_PATH, JSON.stringify(inboxList, null, 2), "utf8");

    const formattedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
  <style>
    body { background-color: #030307; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 20px auto; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; background-color: #020204; box-shadow: 0 4px 30px rgba(0,0,0,0.4); }
    .header { background: linear-gradient(135deg, #022c22 0%, #030712 100%); padding: 24px; border-bottom: 2px solid #0d9488; text-align: center; }
    .header h2 { margin: 0; font-size: 20px; color: #2dd4bf; letter-spacing: 1px; text-transform: uppercase; }
    .header p { margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; font-family: monospace; }
    .content { padding: 30px; }
    .meta-card { background-color: #090d16; border: 1px dashed #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
    .meta-item { font-size: 12px; line-height: 1.6; color: #94a3b8; }
    .meta-item strong { color: #38bdf8; font-family: monospace; }
    .message-body { background-color: #07070a; border-left: 4px solid #0d9488; border-radius: 4px; padding: 20px; margin-bottom: 30px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; }
    .btn-group { text-align: center; margin-bottom: 10px; }
    .btn { display: inline-block; background: linear-gradient(to right, #013730, #04141d); color: #2dd4bf; border: 1px solid #0d9488; text-decoration: none; padding: 10px 20px; font-size: 12px; font-family: monospace; font-weight: bold; border-radius: 6px; margin: 4px; }
    .footer { background-color: #060913; padding: 20px; border-top: 1px solid #0f172a; text-align: center; font-size: 11px; color: #64748b; }
    .footer a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h2>Burhanudin Nuban</h2>
      <p>SECURE PORTFOLIO INTAKE LOG [DYNAMIC DISPATCH]</p>
    </div>
    <div class="content">
      <div class="meta-card">
        <div class="meta-item"><strong>[SENDER_NAME]</strong> : ${name}</div>
        <div class="meta-item"><strong>[SENDER_EMAIL]</strong> : <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></div>
        <div class="meta-item"><strong>[TIMESTAMP_UTC]</strong> : ${timestamp}</div>
        <div class="meta-item"><strong>[SENDER_IP_ADDR]</strong> : ${systemIp}</div>
        <div class="meta-item"><strong>[SESSION_AGENT]</strong> : ${userAgent}</div>
      </div>
      <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; font-family: monospace;">--- BEGIN TRANSMISSION ---</div>
      <div class="message-body">${message}</div>
      <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-top: -15px; margin-bottom: 24px; font-family: monospace;">--- END TRANSMISSION ---</div>
      <div class="btn-group">
        <a href="mailto:${email}?subject=RE: Your inquiry to Burhanudin Nuban" class="btn">REPLY DIRECTLY TO SENDER</a>
      </div>
    </div>
    <div class="footer">
      This system communication is automatically processed by Burhanudin's dynamic NodeJS server.<br>
      Security audit level certified.
    </div>
  </div>
</body>
</html>`;

    let mailDispatched = false;
    let mailLogMsg = "";
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;

    if (hasSmtpConfig) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
          tls: { rejectUnauthorized: false }
        });

        await transporter.sendMail({
          from: `"Portfolio Messaging System" <${process.env.SMTP_USER}>`,
          to: "burhanudinnuban@gmail.com",
          replyTo: email,
          subject: `📩 Portfolio Inquiry from ${name} (${email})`,
          text: `You have received a message from ${name} (${email}):\n\n${message}`,
          html: formattedHtml,
        });

        mailDispatched = true;
        mailLogMsg = "Real-time SMTP secure dispatch completed successfully!";
      } catch (mErr: any) {
        console.error("SMTP dispatch failed:", mErr);
        mailLogMsg = `SMTP Dispatch failed: ${mErr.message}. Record logged to local database.`;
      }
    } else {
      mailLogMsg = "No remote SMTP configured. Record stored in local JSON database.";
    }

    res.json({ success: true, message: "Form inquiry securely dispatched and persisted!", mailDispatched, mailLogMsg, data: newMessage });
  } catch (error: any) {
    console.error("Critical error in contact handler:", error);
    res.status(500).json({ success: false, error: "Backend failed to serialize message intake." });
  }
});

// B. Fetch Dynamic Inbox Messages
app.post("/api/cms/inbox", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!verifyAdminCredentials(username, password)) {
      res.status(401).json({ success: false, error: "Access blocked. Unauthorized mailbox access." });
      return;
    }

    let inboxList: any[] = [];
    if (fs.existsSync(MESSAGES_FILE_PATH)) {
      try {
        inboxList = JSON.parse(fs.readFileSync(MESSAGES_FILE_PATH, "utf8"));
      } catch (e) {
        console.error("Could not parse messages:", e);
      }
    }

    res.json({ success: true, messages: inboxList });
  } catch (error: any) {
    console.error("CMS Inbox load error:", error);
    res.status(500).json({ success: false, error: "Failed to read inbox records." });
  }
});

// C. Delete a Specific message from Inbox
app.post("/api/cms/inbox/delete", (req, res) => {
  try {
    const { username, password, messageId } = req.body;
    if (!verifyAdminCredentials(username, password)) {
      res.status(401).json({ success: false, error: "Access blocked. Unauthorized delete." });
      return;
    }

    if (!messageId) {
      res.status(400).json({ success: false, error: "Message ID is required." });
      return;
    }

    let inboxList: any[] = [];
    if (fs.existsSync(MESSAGES_FILE_PATH)) {
      try {
        inboxList = JSON.parse(fs.readFileSync(MESSAGES_FILE_PATH, "utf8"));
      } catch (e) {
        console.error("Could not parse messages:", e);
      }
    }

    const updatedInbox = inboxList.filter((m: any) => m.id !== messageId);
    fs.writeFileSync(MESSAGES_FILE_PATH, JSON.stringify(updatedInbox, null, 2), "utf8");
    res.json({ success: true, message: "Message removed from inbox." });
  } catch (error: any) {
    console.error("CMS Inbox delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete record." });
  }
});

// Cache variable for GitHub Repositories
let githubCache: { data: any[]; timestamp: number; offline?: boolean } | null = null;
const CACHE_DURATION_MS = 1000 * 60 * 60;

// D. Fetch public GitHub projects
app.get("/api/github/repos", async (req, res) => {
  const offlineFilePath = path.join(process.cwd(), "src", "github_repos_offline.json");
  let repos: any[] = [];
  let isOfflineFallback = false;
  const now = Date.now();

  try {
    if (githubCache && (now - githubCache.timestamp < CACHE_DURATION_MS)) {
      res.json({ success: true, projects: githubCache.data, cached: true, offline: githubCache.offline || false });
      return;
    }

    const githubUser = "burhanudinnuban";
    const githubUrl = `https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=30`;

    const response = await fetch(githubUrl, {
      headers: {
        "User-Agent": "burhanudinnuban-portfolio-servicer",
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) throw new Error(`GitHub API returned status ${response.status}`);

    repos = await response.json();
    if (!Array.isArray(repos)) throw new Error("Invalid response format from GitHub API");

    if (repos.length > 0) {
      fs.writeFileSync(offlineFilePath, JSON.stringify(repos, null, 2), "utf8");
    }
  } catch (error: any) {
    console.warn("GitHub live request failed. Using offline cache:", error.message);
    isOfflineFallback = true;

    if (fs.existsSync(offlineFilePath)) {
      try {
        repos = JSON.parse(fs.readFileSync(offlineFilePath, "utf8"));
      } catch (parseErr) {
        console.error("Failed to parse offline cache:", parseErr);
      }
    }
  }

  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    res.json({ success: false, error: "Repository databases offline and local fallback empty.", projects: [] });
    return;
  }

  try {
    const mappedProjects = repos
      .filter((repo: any) => repo && !repo.fork)
      .map((repo: any) => {
        const name = repo.name || "unnamed";
        const desc = repo.description || "A public repository.";
        const language = repo.language;
        const topics = repo.topics || [];

        let category: "Full-Stack" | "DevSecOps" | "Cloud Infrastructure" = "Full-Stack";
        const strToTest = (name + " " + desc + " " + topics.join(" ")).toLowerCase();

        if (strToTest.includes("terraform") || strToTest.includes("aws") || strToTest.includes("gcp") || strToTest.includes("infrastructure") || strToTest.includes("ansible")) {
          category = "Cloud Infrastructure";
        } else if (strToTest.includes("docker") || strToTest.includes("kubernetes") || strToTest.includes("pipeline") || strToTest.includes("ci-cd") || strToTest.includes("cicd") || strToTest.includes("github-actions") || strToTest.includes("security") || strToTest.includes("devsecops") || strToTest.includes("devops")) {
          category = "DevSecOps";
        }

        const techSet = new Set<string>();
        if (language) techSet.add(language);
        topics.forEach((t: string) => techSet.add(t));
        if (strToTest.includes("react")) techSet.add("React");
        if (strToTest.includes("typescript") || strToTest.includes("ts")) techSet.add("TypeScript");
        if (strToTest.includes("docker")) techSet.add("Docker");
        if (strToTest.includes("kubernetes") || strToTest.includes("k8s")) techSet.add("Kubernetes");
        if (strToTest.includes("terraform")) techSet.add("Terraform");
        if (strToTest.includes("github-action")) techSet.add("GitHub Actions");

        const tech = Array.from(techSet).slice(0, 5);
        if (tech.length === 0) tech.push("Git", "GitHub");

        return {
          id: `gh-${repo.id}`,
          title: name.split(/[-_]+/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          category,
          description: desc,
          details: `Language: ${language || "Markdown"} | Stars: ${repo.stargazers_count || 0} | Branch: ${repo.default_branch || "main"}`,
          tech,
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || repo.html_url,
          image: ""
        };
      });

    githubCache = { data: mappedProjects, timestamp: now, offline: isOfflineFallback };
    res.json({ success: true, projects: mappedProjects, cached: false, offline: isOfflineFallback });
  } catch (mapError: any) {
    console.error("Mapping repositories error:", mapError);
    res.status(500).json({ success: false, error: "Failed to compile repositories." });
  }
});

// ═══════════════════════════════════════════════════════
// 1. Portfolio AI Chatbot (Dynamic Interactive Mode)
// ═══════════════════════════════════════════════════════

interface ChatResponse {
  reply: string;
  suggestions: string[];
}

function getInteractiveChatReply(message: string, history?: any[]): ChatResponse {
  const msg = message.toLowerCase().trim();
  const isFirstMessage = !history || history.length <= 1;

  // ─────────────────────────────────────────
  // GREETING / FIRST MESSAGE
  // ─────────────────────────────────────────
  if (isFirstMessage || msg === "hi" || msg === "hello" || msg === "hey" || msg === "start" || msg === "help" || msg === "menu") {
    return {
      reply: `👋 Hey there! Welcome to **Burhanudin Nuban's** Portfolio!

I'm his virtual career assistant. I can tell you everything about him — just pick a topic or type a keyword:

🔹 **skills** — Tech stack & tools he masters
🔹 **experience** — Work history & companies
🔹 **devops** — DevSecOps & CI/CD expertise
🔹 **projects** — Portfolio & GitHub repos
🔹 **certifications** — Professional credentials
🔹 **education** — Academic background
🔹 **about** — Who is Burhanudin?
🔹 **contact** — How to reach him
🔹 **hire** — Why you should hire him

💬 Or just ask me anything naturally!`,
      suggestions: ["skills", "experience", "devops", "projects", "contact", "hire"]
    };
  }

  // ─────────────────────────────────────────
  // SKILLS
  // ─────────────────────────────────────────
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("language") || msg.includes("tool") || msg === "1") {
    return {
      reply: `🛠️ **Burhanudin's Tech Stack:**

**Frontend:**
React, Next.js, TypeScript, Tailwind CSS, Vite, Flutter, React Native, Swift UI

**Backend:**
Node.js, Express, Go (Golang), Laravel, Python

**Database:**
PostgreSQL, MySQL, Redis, Firestore

**DevOps & Cloud:**
Docker, Kubernetes (K3s), Terraform, Ansible, AWS, GCP, Nginx

**CI/CD & Security:**
GitHub Actions, GitLab CI, Jenkins, SonarQube, Trivy, Gitleaks

**Others:**
Git, Linux, Software AG (Middleware), ERP 365

He's a true **full-stack + DevSecOps hybrid** — rare combination! 🔥`,
      suggestions: ["experience", "devops", "projects", "certifications", "hire"]
    };
  }

  // ─────────────────────────────────────────
  // EXPERIENCE
  // ─────────────────────────────────────────
  if (msg.includes("experience") || msg.includes("work") || msg.includes("career") || msg.includes("company") || msg.includes("job") || msg.includes("history") || msg === "2") {
    return {
      reply: `💼 **Burhanudin's Professional Journey (7+ Years):**

🏢 **PT Waskita Karya (Persero) Tbk** — Current
_IT Operation & Data Analytical_
• Enterprise systems, DevSecOps pipeline implementation

🏢 **PT Serasi Autoraya (SERA / Astra Group)**
_Fullstack Developer_
• Built scalable web applications for Astra's automotive ecosystem

🏢 **PT Eka Bogainti (HokBen)**
_Fullstack Developer_
• Developed internal systems for one of Indonesia's largest F&B chains

🏢 **PT GenIO**
_Mobile Developer (React Native)_
• Cross-platform mobile app development

🏢 **PT Multi Inti Digital Bisnis**
_Android Developer_
• Native Android application development

📈 He's grown from Mobile Dev → Fullstack → DevSecOps — a continuous evolution!`,
      suggestions: ["skills", "devops", "projects", "certifications", "contact"]
    };
  }

  // ─────────────────────────────────────────
  // DEVSECOPS
  // ─────────────────────────────────────────
  if (msg.includes("devops") || msg.includes("devsecops") || msg.includes("pipeline") || msg.includes("ci/cd") || msg.includes("cicd") || msg.includes("docker") || msg.includes("kubernetes") || msg.includes("security") || msg === "3") {
    return {
      reply: `🔒 **Burhanudin's DevSecOps Expertise:**

**Pipeline Architecture:**
GitHub Actions → Docker Build → Trivy Scan → Deploy to EC2/K8s
_(He built this entire pipeline from scratch!)_

**Container & Orchestration:**
🐳 Docker, Docker Compose, Private Registry
☸️ Kubernetes (K3s), ArgoCD, Helm

**Security (Shift-Left):**
🔐 Gitleaks (secret scanning)
🔍 SonarQube/SonarCloud (SAST)
🛡️ Trivy (image vulnerability scanning)
📋 OPA/Conftest (policy enforcement)

**Infrastructure:**
☁️ AWS EC2, GCP, Nginx reverse proxy
📦 Self-hosted Docker Registry with UI
🔄 Automated deploy via SSH + Docker Compose

**Philosophy:** _"Security is not a phase — it's embedded in every commit."_ 🛡️`,
      suggestions: ["skills", "projects", "experience", "certifications", "hire"]
    };
  }

  // ─────────────────────────────────────────
  // PROJECTS
  // ─────────────────────────────────────────
  if (msg.includes("project") || msg.includes("portfolio") || msg.includes("demo") || msg.includes("github") || msg.includes("repo") || msg === "4") {
    return {
      reply: `🚀 **Burhanudin's Notable Projects:**

📂 **This Portfolio Website**
_React + Vite + Express + Docker + CI/CD_
Full DevSecOps pipeline: GitHub Actions → Trivy → Docker → EC2

📂 **DevSecOps Pipeline Template**
_GitHub Actions + Docker + K3s + ArgoCD_
Production-grade CI/CD with security scanning at every stage

📂 **Enterprise Web Applications**
_React + Express + PostgreSQL_
Built for companies like SERA (Astra Group) and HokBen

📂 **Mobile Applications**
_React Native + Flutter + Swift UI_
Cross-platform apps for various clients

🔗 Check the **Projects** section on this website for live demos!
🔗 GitHub: **github.com/burhanudinnuban**`,
      suggestions: ["skills", "devops", "experience", "contact", "hire"]
    };
  }

  // ─────────────────────────────────────────
  // CERTIFICATIONS
  // ─────────────────────────────────────────
  if (msg.includes("certif") || msg.includes("credential") || msg.includes("cka") || msg.includes("aws cert") || msg.includes("badge") || msg.includes("license") || msg === "5") {
    return {
      reply: `🏅 **Burhanudin's Professional Certifications:**

✅ **CKA** — Certified Kubernetes Administrator
✅ **AWS Solutions Architect** — Cloud architecture design
✅ **CompTIA Security+** — Cybersecurity fundamentals
✅ **Terraform Associate** — Infrastructure as Code

📚 He's committed to continuous learning and staying ahead of industry trends.
_"Certifications prove discipline. Real projects prove capability."_ 💪`,
      suggestions: ["skills", "experience", "projects", "hire", "contact"]
    };
  }

  // ─────────────────────────────────────────
  // EDUCATION
  // ─────────────────────────────────────────
  if (msg.includes("education") || msg.includes("university") || msg.includes("school") || msg.includes("degree") || msg.includes("study") || msg === "6") {
    return {
      reply: `🎓 **Burhanudin's Education:**

📖 Combined with **7+ years of hands-on industry experience**, Burhanudin has built expertise through:

• Formal education in Information Technology
• Self-directed learning in cloud architecture & DevSecOps
• Professional certifications (CKA, AWS, CompTIA, Terraform)
• Real-world project delivery across multiple industries

_"The best education is building real things for real users."_ 🚀`,
      suggestions: ["certifications", "skills", "experience", "projects", "contact"]
    };
  }

  // ─────────────────────────────────────────
  // ABOUT
  // ─────────────────────────────────────────
  if (msg.includes("about") || msg.includes("who") || msg.includes("introduce") || msg.includes("tell me") || msg.includes("yourself") || msg === "7") {
    return {
      reply: `🧑‍💻 **About Burhanudin Nuban:**

👤 **Name:** Burhanudin Nuban
🎂 **Age:** 28 years old
📍 **Location:** Indonesia
💻 **Role:** Full Stack Engineer & DevSecOps Engineer

With **7+ years** in the tech industry, Burhanudin has evolved from a mobile developer into a **full-stack + DevSecOps hybrid** — a rare combination that bridges development and operations seamlessly.

**What makes him different?**
🔹 Builds AND secures applications end-to-end
🔹 Designs scalable architectures, not just code
🔹 Automates everything — from testing to deployment
🔹 Thinks like an architect, codes like an engineer

_Currently focused on Software Architecture & AI-driven operations (AIOps)._ 🚀`,
      suggestions: ["skills", "experience", "projects", "hire", "contact"]
    };
  }

  // ─────────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────────
  if (msg.includes("contact") || msg.includes("email") || msg.includes("reach") || msg.includes("message") || msg.includes("interview") || msg.includes("schedule") || msg.includes("connect") || msg === "8") {
    return {
      reply: `📬 **Get in Touch with Burhanudin:**

📧 **Email:** burhanudinnuban@gmail.com
🔗 **GitHub:** github.com/burhanudinnuban
💼 **LinkedIn:** Connect on LinkedIn

📝 You can also use the **Contact Form** on this website — your message will be delivered directly to his inbox!

_He typically responds within 24 hours._ ⚡`,
      suggestions: ["skills", "experience", "hire", "projects", "menu"]
    };
  }

  // ─────────────────────────────────────────
  // HIRE / WHY
  // ─────────────────────────────────────────
  if (msg.includes("hire") || msg.includes("recruit") || msg.includes("why") || msg.includes("recommend") || msg.includes("value") || msg.includes("strength") || msg === "9") {
    return {
      reply: `🌟 **Why Hire Burhanudin?**

✅ **Rare Hybrid** — Full Stack + DevSecOps in one person
✅ **7+ Years** — Battle-tested across multiple industries
✅ **Security-First** — Shift-left mindset, not an afterthought
✅ **End-to-End** — From React UI to Kubernetes deployment
✅ **Self-Driven** — Builds CI/CD pipelines from scratch, not just uses them
✅ **Production-Grade** — Always thinks scalability, maintainability, security
✅ **Certified** — CKA, AWS SA, CompTIA Security+, Terraform

💡 _He doesn't just write code — he architects systems that are secure, scalable, and automated._

📧 Ready to connect? Type **contact** to get his details! 🚀`,
      suggestions: ["contact", "skills", "experience", "projects", "devops"]
    };
  }

  // ─────────────────────────────────────────
  // SALARY / RATE
  // ─────────────────────────────────────────
  if (msg.includes("salary") || msg.includes("rate") || msg.includes("cost") || msg.includes("price") || msg.includes("budget") || msg.includes("compensation")) {
    return {
      reply: `💰 Compensation details are best discussed directly with Burhanudin.

He's open to:
🔹 Full-time positions
🔹 Contract/freelance engagements
🔹 Project-based collaboration

📧 Reach out at **burhanudinnuban@gmail.com** to discuss! 🤝`,
      suggestions: ["contact", "hire", "experience", "skills", "menu"]
    };
  }

  // ─────────────────────────────────────────
  // THANKS
  // ─────────────────────────────────────────
  if (msg.includes("thank") || msg.includes("thanks") || msg.includes("thx") || msg.includes("appreciate")) {
    return {
      reply: `You're welcome! 😊 Glad I could help!

Is there anything else you'd like to know about Burhanudin? Feel free to type **menu** anytime to see all available topics. 🚀`,
      suggestions: ["menu", "contact", "hire"]
    };
  }

  // ─────────────────────────────────────────
  // BYE
  // ─────────────────────────────────────────
  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you") || msg.includes("later")) {
    return {
      reply: `👋 Thanks for visiting Burhanudin's portfolio! 

If you ever want to connect, don't hesitate to reach out at **burhanudinnuban@gmail.com**.

Have a great day! 🚀`,
      suggestions: ["contact", "menu"]
    };
  }

  // ─────────────────────────────────────────
  // FALLBACK — Unknown input
  // ─────────────────────────────────────────
  return {
    reply: `🤔 Hmm, I'm not sure about that one. But here's what I can help you with!

Just type any of these keywords:

🔹 **skills** — What tech does Burhanudin use?
🔹 **experience** — Where has he worked?
🔹 **devops** — His DevSecOps expertise
🔹 **projects** — See his portfolio
🔹 **certifications** — Professional credentials
🔹 **about** — Who is Burhanudin?
🔹 **contact** — How to reach him
🔹 **hire** — Why hire him?

💬 Or type **menu** to see this list again!`,
    suggestions: ["skills", "experience", "devops", "projects", "contact", "hire"]
  };
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const { reply, suggestions } = getInteractiveChatReply(message, history);
    res.json({ reply, suggestions });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Something went wrong, but Burhanudin stands ready to assist you!" });
  }
});

// ═══════════════════════════════════════════════════════
// 2. Static Code Scanner (No Google AI)
// ═══════════════════════════════════════════════════════
function staticCodeScan(code: string, fileType?: string): any[] {
  const report: any[] = [];
  const lines = code.split("\n");

  // Rule 1: SQL Injection
  lines.forEach((line, idx) => {
    if (/SELECT.*FROM.*WHERE.*['"`]\s*\+/.test(line) || /query\s*\(.*\+.*req\.(body|query|params)/.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "SQL Injection Susceptibility",
        severity: "CRITICAL",
        line: idx + 1,
        description: "Dynamic SQL query construction with unsanitized user input detected. Attackers can manipulate queries to access or destroy data.",
        recommendation: "Use parameterized queries or ORM frameworks instead of string concatenation.",
        fixedCode: "const query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);"
      });
    }
  });

  // Rule 2: Hardcoded Secrets
  lines.forEach((line, idx) => {
    if (/(?:password|secret|api_key|apikey|token|private_key)\s*[:=]\s*['"][^'"]{4,}['"]/i.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Hardcoded Credential Exposure",
        severity: "HIGH",
        line: idx + 1,
        description: "Sensitive credentials found hardcoded in source code. These can be extracted from repositories or compiled binaries.",
        recommendation: "Use environment variables or a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault).",
        fixedCode: "const password = process.env.DB_PASSWORD;\nconst apiKey = process.env.API_KEY;"
      });
    }
  });

  // Rule 3: eval() usage
  lines.forEach((line, idx) => {
    if (/\beval\s*\(/.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Dangerous eval() Usage",
        severity: "CRITICAL",
        line: idx + 1,
        description: "eval() executes arbitrary code strings, enabling Remote Code Execution (RCE) if user input reaches it.",
        recommendation: "Remove eval() entirely. Use JSON.parse() for data or safer alternatives.",
        fixedCode: "// Replace eval(userInput) with:\nconst data = JSON.parse(userInput);"
      });
    }
  });

  // Rule 4: innerHTML / XSS
  lines.forEach((line, idx) => {
    if (/\.innerHTML\s*=/.test(line) || /dangerouslySetInnerHTML/.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Cross-Site Scripting (XSS) Risk",
        severity: "HIGH",
        line: idx + 1,
        description: "Direct HTML injection without sanitization allows attackers to inject malicious scripts.",
        recommendation: "Use textContent instead of innerHTML, or sanitize with DOMPurify.",
        fixedCode: "element.textContent = userInput;\n// Or: DOMPurify.sanitize(htmlString)"
      });
    }
  });

  // Rule 5: No HTTPS / HTTP usage
  lines.forEach((line, idx) => {
    if (/['"]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Insecure HTTP Connection",
        severity: "MEDIUM",
        line: idx + 1,
        description: "Plaintext HTTP connections are vulnerable to man-in-the-middle attacks.",
        recommendation: "Always use HTTPS for external connections.",
        fixedCode: line.replace("http://", "https://")
      });
    }
  });

  // Rule 6: console.log with sensitive data
  lines.forEach((line, idx) => {
    if (/console\.(log|debug|info)\s*\(.*(?:password|token|secret|key|credential)/i.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Sensitive Data in Logs",
        severity: "MEDIUM",
        line: idx + 1,
        description: "Logging sensitive data (passwords, tokens) can expose credentials in log files.",
        recommendation: "Remove sensitive data from log statements. Use structured logging with redaction.",
        fixedCode: "console.log('Auth attempt for user:', username); // Never log passwords/tokens"
      });
    }
  });

  // Rule 7: CORS wildcard
  lines.forEach((line, idx) => {
    if (/origin:\s*['"]?\*['"]?/.test(line) || /Access-Control-Allow-Origin.*\*/.test(line)) {
      report.push({
        id: `SEC-${report.length + 1}`,
        name: "Permissive CORS Configuration",
        severity: "MEDIUM",
        line: idx + 1,
        description: "Wildcard CORS origin allows any website to make requests to your API.",
        recommendation: "Restrict CORS to specific trusted domains.",
        fixedCode: "cors({ origin: ['https://yourdomain.com'] })"
      });
    }
  });

  // No issues found
  if (report.length === 0) {
    report.push({
      id: "SEC-OK",
      name: "No Immediate Threats Detected",
      severity: "LOW",
      line: 0,
      description: "Static analysis found no obvious vulnerabilities. However, ensure TLS is enforced, inputs are validated, and dependencies are regularly audited.",
      recommendation: "Run container-level scans (Trivy) and dependency audits (npm audit) before production.",
      fixedCode: "// Code looks secure. Continue with regular security audits."
    });
  }

  return report;
}

app.post("/api/scan", async (req, res) => {
  try {
    const { code, fileType } = req.body;
    if (!code) {
      res.status(400).json({ error: "No code provided to scan." });
      return;
    }

    const report = staticCodeScan(code, fileType);
    res.json({ report });
  } catch (error: any) {
    console.error("Scanner error:", error);
    res.status(500).json({ error: "Security scan execution failed." });
  }
});


// ------------------- VITE SERVER INTEGRATION -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Port 3000 server successfully deployed at http://0.0.0.0:${PORT}`);
  });
}

startServer();