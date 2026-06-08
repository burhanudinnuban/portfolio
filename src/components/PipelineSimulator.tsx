import { useState, useEffect, useRef } from "react";
import { Play, RefreshCw, Terminal, CheckCircle2, AlertCircle, Cpu, ShieldCheck } from "lucide-react";
import { PipelineStage } from "../types";

export default function PipelineSimulator() {
  const [pipelineActive, setPipelineActive] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [pipelinePassed, setPipelinePassed] = useState<boolean | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const terminalScrollContainerRef = useRef<HTMLDivElement>(null);

  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: "stage-1",
      name: "Git Pull & Code Linting (Jenkins)",
      status: "idle",
      duration: 1000,
      logs: [
        "[INFO] Git Checkout: Pulling latest commits from branch 'main'...",
        "[GIT] Commit SHA: 8f3a9e2 - 'feat: implement feedback channel'",
        "[JENKINS] Init Workspace at /var/jenkins_home/workspace/portfolio-pipeline",
        "[EXEC] Running npm run lint / static formatting check...",
        "[PASS] 0 syntax issues or blocking errors found in Git payload."
      ]
    },
    {
      id: "stage-2",
      name: "SonarQube Security & Quality Analysis",
      status: "idle",
      duration: 1800,
      logs: [
        "[INFO] Initiating SonarQube Quality Scanner...",
        "[SONAR] Executing sonar-scanner with projectKey: b-nuban-portfolio",
        "[SONAR] Code Quality Index: A | Bugs Count: 0 | Code Smells: 4",
        "[SONAR] Security Rating: A (0 Vulnerabilities found)",
        "[PASS] SonarQube Quality Gate Status: SUCCESS (Meets production gate requirements)."
      ]
    },
    {
      id: "stage-3",
      name: "Image Compilation & Build Versioning",
      status: "idle",
      duration: 1500,
      logs: [
        "[INFO] Resolving latest release tag version identifier... ",
        "[VERSION] Git Tag found: v2.5.0, current commit distance: +1 -> Incrementing build tag to: v2.5.1-build.142",
        "[EXEC] docker build -t burhanudinnuban/app-prod:v2.5.1-build.142 .",
        "[DOCKER] Sending build context to Docker daemon  24.51MB",
        "[DOCKER] Step 1/5: FROM node:20-alpine AS builder ... Layer cached.",
        "[DOCKER] Step 5/5: COPY --from=builder /app/dist /usr/share/nginx/html",
        "[SUCCESS] Compact, secure multi-stage build compile completed successfully."
      ]
    },
    {
      id: "stage-4",
      name: "Push Docker Image to Secure Registry",
      status: "idle",
      duration: 1405,
      logs: [
        "[INFO] Authenticating in to Container Registry...",
        "[DOCKER_PUSH] Pushing tag: burhanudinnuban/app-prod:v2.5.1-build.142 to GHCR/DockerHub",
        "[DOCKER_PUSH] Layer 1/3: 4f4fb700ef54 - Push complete",
        "[DOCKER_PUSH] Layer 3/3: bc3dc8b8a5fc - Push complete",
        "[SUCCESS] Image digest: sha256:7b9b1ee... digitally signed and approved."
      ]
    },
    {
      id: "stage-5",
      name: "Run Docker via Kubernetes Deploy",
      status: "idle",
      duration: 1600,
      logs: [
        "[INFO] Injecting credential matrices and rolling Kubernetes manifest updates...",
        "[K8S] kubectl apply -f k8s/deployment.yaml --namespace=live-production",
        "[K8S] Deployment 'portfolio-app' modified. Cruising pod replicas (3 Active Pods)...",
        "[K8S] Status Verification: Pod/portfolio-app-df849-p2k82 running successfully (Readiness probe: Passed)",
        "[K8S] Ingress router streaming secure connections on port 3000 to cluster nodes.",
        "[SUCCESS] Workloads live on Kubernetes. Active pod routing fully functional!"
      ]
    },
    {
      id: "stage-6",
      name: "Restart Web Service & Verification",
      status: "idle",
      duration: 1200,
      logs: [
        "[INFO] Dispatched graceful web service daemon restart trigger...",
        "[EXEC] systemctl restart nginx.service",
        "[CACHE] Purged dynamic Varnish proxy endpoints and Redis replication caches.",
        "[HEALTH] Probing public endpoint URL: https://burhanudinnuban.dev... Success (HTTP 200 OK)",
        "[SUCCESS] Daemon restart workflow completed. Load-balancer active and routing!"
      ]
    }
  ]);

  const [activeConsoleLogs, setActiveConsoleLogs] = useState<string[]>([
    "===========================================================",
    "      BURHANUDIN NUBAN DEVSECOPS ORCHESTRATION TERMINAL    ",
    "===========================================================",
    "Status: System is currently resting. Awaiting pipeline trigger...",
    "Ready for code secure deployment check."
  ]);

  // Hook to handle active log scrolling
  useEffect(() => {
    if (pipelineActive && autoScroll && terminalScrollContainerRef.current) {
      const container = terminalScrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [activeConsoleLogs, autoScroll, pipelineActive]);

  const resetPipeline = () => {
    setPipelineActive(false);
    setCurrentStageIndex(-1);
    setPipelinePassed(null);
    setStages(prev => prev.map(s => ({ ...s, status: "idle" })));
    setActiveConsoleLogs([
      "===========================================================",
      "      BURHANUDIN NUBAN DEVSECOPS ORCHESTRATION TERMINAL    ",
      "===========================================================",
      "Reset command executed. System status: Standby.",
      "Awaiting pipeline trigger..."
    ]);
  };

  const executePipeline = async () => {
    if (pipelineActive) return;

    setPipelineActive(true);
    setPipelinePassed(null);
    setCurrentStageIndex(0);

    // Initial logs reset
    setActiveConsoleLogs([
      `[PIPELINE START] ${new Date().toISOString()} - Dispatched secure workflow`,
      "===========================================================",
      "Initializing DevSecOps continuous pipeline sequence..."
    ]);

    // Let's iterate through stages using sequence timeouts to create a beautiful simulation
    for (let i = 0; i < stages.length; i++) {
      setCurrentStageIndex(i);
      
      // Update state to running
      setStages(prev => {
        const next = [...prev];
        next[i].status = "running";
        return next;
      });

      // Stream initial logs for this stage
      setActiveConsoleLogs(prev => [
        ...prev,
        `>>> Starting Stage ${i + 1}: ${stages[i].name} ...`
      ]);

      // Fast-stagger stage internal logs simulation
      const stageJob = stages[i];
      for (const logItem of stageJob.logs) {
        await new Promise(resolve => setTimeout(resolve, stageJob.duration / stageJob.logs.length));
        setActiveConsoleLogs(prev => [...prev, logItem]);
      }

      // Complete stage
      setStages(prev => {
        const next = [...prev];
        next[i].status = "success";
        return next;
      });

      setActiveConsoleLogs(prev => [
        ...prev,
        `[SUCCESS] Stage ${i + 1} completed correctly. [Duration: ${(stageJob.duration / 1000).toFixed(2)}s]`,
        ""
      ]);
    }

    // Mark pipeline passed
    setPipelineActive(false);
    setPipelinePassed(true);
    setActiveConsoleLogs(prev => [
      ...prev,
      "===========================================================",
      " ✔ INTERACTIVE JENKINS PIPELINE INTEGRATION RUN COMPLETED!",
      ` ✔ SonarQube Gate Verified • Docker v2.5.1-build.142 -> Kubernetes Live Cluster`,
      "===========================================================",
    ]);
  };

  return (
    <div id="pipeline-simulator-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100">
      {/* Structural Pipeline Diagram Block (Left) */}
      <div id="pipeline-stages-flow" className="lg:col-span-4 space-y-5">
        <div id="stages-headline" className="flex items-center justify-between">
          <div>
            <h3 id="stages-title" className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">
              Pipeline Blueprint
            </h3>
            <p id="stages-sub" className="text-xs text-slate-500">Continuous Security Verification</p>
          </div>

          <div className="flex gap-2">
            {!pipelineActive && pipelinePassed === null ? (
              <button
                id="cmd-start-pipeline"
                onClick={executePipeline}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run CD Demo
              </button>
            ) : (
              <button
                id="cmd-reset-pipeline"
                onClick={resetPipeline}
                disabled={pipelineActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg transition-all ${
                  pipelineActive ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Pipeline
              </button>
            )}
          </div>
        </div>

        {/* Vertical Pipeline Stage Visualizers */}
        <div id="stages-cards-list" className="space-y-3.5 relative pl-4 border-l border-slate-900">
          {stages.map((stage, idx) => {
            const isRunning = currentStageIndex === idx && pipelineActive;
            const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && !pipelineActive && pipelinePassed);
            const isIdle = idx > currentStageIndex;

            return (
              <div
                key={stage.id}
                id={`pipe-stage-card-${stage.id}`}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between relative ${
                  isRunning
                    ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                    : isCompleted
                    ? "bg-slate-950/60 border-emerald-500/30"
                    : "bg-slate-950/20 border-slate-900"
                }`}
              >
                {/* Visual Connector Dot on the Left line */}
                <div
                  id={`pipe-stage-dot-${stage.id}`}
                  className={`absolute -left-[21.5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border transition-all ${
                    isRunning
                      ? "bg-cyan-500 border-cyan-400 animate-ping"
                      : isCompleted
                      ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      : "bg-slate-950 border-slate-800"
                  }`}
                />

                <div id={`pipe-stage-meta-${stage.id}`} className="space-y-1 flex-1 pr-2.5">
                  <div className="flex items-center gap-2">
                    <span id={`pipe-stage-num-${stage.id}`} className="text-[10px] font-mono text-slate-500 font-bold">
                      0{idx + 1}
                    </span>
                    <h4 id={`pipe-stage-name-${stage.id}`} className={`text-xs font-bold leading-none ${
                      isRunning ? "text-cyan-400" : isCompleted ? "text-emerald-400/90" : "text-slate-400"
                    }`}>
                      {stage.name}
                    </h4>
                  </div>
                  <p id={`pipe-stage-sub-${stage.id}`} className="text-[10px] text-slate-500 leading-normal">
                    {idx === 0 && "Git Pull • Prettier Lint"}
                    {idx === 1 && "SonarQube Gates • Quality Scan"}
                    {idx === 2 && "Docker Build • Semantic Tagging"}
                    {idx === 3 && "Secure Push • Container Registry"}
                    {idx === 4 && "Kubernetes Cluster Pod Rollout"}
                    {idx === 5 && "Web Service Restart & Health Probing"}
                  </p>
                </div>

                <div id={`pipe-stage-status-wrap-${stage.id}`}>
                  {isRunning ? (
                    <RefreshCw className="w-4.5 h-4.5 text-cyan-400 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-emerald-950/50" />
                  ) : (
                    <div id={`pipe-stage-idle-indicator-${stage.id}`} className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Build Terminal Panel (Right) */}
      <div id="pipeline-logs-terminal" className="lg:col-span-8 flex flex-col h-[420px] rounded-2xl border border-slate-900 bg-black overflow-hidden shadow-2xl relative">
        <div id="terminal-bar" className="px-4 py-3 bg-zinc-950/90 border-b border-slate-900 flex justify-between items-center shrink-0">
          <div id="terminal-tabs" className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span id="terminal-lbl" className="text-xs font-mono font-bold text-slate-400 tracking-wide select-none">
              orchestration_logs.sh
            </span>
          </div>

          <div id="terminal-stats" className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
            <span id="terminal-autoscroll" className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer hover:text-slate-400" onClick={() => setAutoScroll(!autoScroll)}>
              <span className={`w-1.5 h-1.5 rounded-full ${autoScroll ? "bg-emerald-500 animate-pulse" : "bg-zinc-700"}`} />
              AutoScroll: {autoScroll ? "ON" : "OFF"}
            </span>
            <span id="terminal-env">Target ENV: Production</span>
          </div>
        </div>

        {/* Live Terminal Log Stream Container */}
        <div ref={terminalScrollContainerRef} id="terminal-log-stream" className="flex-1 p-5 overflow-y-auto font-mono text-xs text-emerald-400 space-y-1.5 bg-[rgba(3,3,3,0.95)] shadow-inner scrollbar-thin scrollbar-thumb-zinc-900">
          {activeConsoleLogs.map((log, lIdx) => {
            const isWarn = log.includes("[WARN]");
            const isPass = log.includes("[PASS]") || log.includes("[SUCCESS]") || log.includes("✔");
            const isHighlight = log.includes(">>>") || log.includes("====");

            let rowColor = "text-zinc-300";
            if (isWarn) rowColor = "text-amber-400";
            else if (isPass) rowColor = "text-emerald-400";
            else if (isHighlight) rowColor = "text-cyan-400 font-semibold";

            return (
              <div key={lIdx} id={`terminal-log-row-${lIdx}`} className={`whitespace-pre-wrap select-text leading-relaxed tracking-normal ${rowColor}`}>
                {log}
              </div>
            );
          })}
          
          {pipelineActive && (
            <div id="cli-cursor-row" className="flex items-center gap-1 text-cyan-400 text-xs font-mono font-bold animate-pulse">
              <span>$ monitoring active logs...</span>
              <span className="w-2 h-4 bg-cyan-400" />
            </div>
          )}
        </div>

        {/* Top-level Success Seal Overlay */}
        {!pipelineActive && pipelinePassed && (
          <div id="success-bar-overlay" className="absolute bottom-4 right-4 bg-emerald-950/95 border border-emerald-500/40 p-3.5 rounded-xl flex items-center gap-3 shadow-xl backdrop-blur max-w-sm animate-bounce">
            <div id="seal-check-col" className="p-2 rounded bg-emerald-900 border border-emerald-700 text-white leading-none">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <h5 id="seal-approved" className="text-xs font-bold text-slate-100 whitespace-nowrap">Pipeline Audits Verify: Approved</h5>
              <p id="seal-verdict" className="text-[10px] text-slate-400 leading-normal mt-0.5">Deployment matches compliance norms.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
