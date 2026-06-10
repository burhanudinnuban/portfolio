import { useState } from "react";
import { VULNERABLE_CODE_EXAMPLES } from "../data";
import { ScanResult } from "../types";
import { Play, ShieldAlert, ShieldCheck, Terminal, HelpCircle, Check, AlertTriangle, AlertCircle, Copy, Info } from "lucide-react";
import { motion } from "motion/react";

export default function CodeScanner() {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [customCode, setCustomCode] = useState<string>(VULNERABLE_CODE_EXAMPLES[0].code);

  const [scanning, setScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [scanReport, setScanReport] = useState<ScanResult[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Toggle pre-made example snippets
  const handleSelectExample = (idx: number) => {
    setSelectedExampleIndex(idx);
    setCustomCode(VULNERABLE_CODE_EXAMPLES[idx].code);
    // Reset scanner outcomes for fresh interactions
    setHasScanned(false);
    setScanReport([]);
    setActiveReportId(null);
  };

  // Run audit against server
  const handleRunScan = async () => {
    if (scanning) return;
    setScanning(true);
    setHasScanned(false);
    setScanReport([]);
    setActiveReportId(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: customCode,
          fileType: VULNERABLE_CODE_EXAMPLES[selectedExampleIndex].fileType
        })
      });

      if (!response.ok) {
        throw new Error("Scan request failed");
      }

      const data = await response.json();
      const report: ScanResult[] = data.report || [];
      setScanReport(report);
      setHasScanned(true);
      if (report.length > 0) {
        setActiveReportId(report[0].id);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setScanReport([
        {
          id: "SCAN-FAIL",
          name: "Connection Interrupted",
          severity: "MEDIUM",
          line: 0,
          description: "Could not safely contact the live server scan worker. Please check the network context or environment secrets config.",
          recommendation: "Ensure server is properly listening on port 3000.",
          fixedCode: "// Connection to live analyzer failed."
        }
      ]);
      setHasScanned(true);
      setActiveReportId("SCAN-FAIL");
    } finally {
      setScanning(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-rose-955 text-rose-450 border-rose-950/70";
      case "HIGH":
        return "bg-orange-955 text-orange-450 border-orange-950/70";
      case "MEDIUM":
        return "bg-amber-955 text-amber-450 border-amber-950/70";
      default:
        return "bg-emerald-955 text-emerald-450 border-emerald-950/70";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case "HIGH":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case "MEDIUM":
        return <Info className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeReport = scanReport.find(r => r.id === activeReportId);

  return (
    <div id="scanner-container" className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-slate-100">
      {/* Code Editor & Snippet Select Column (Left) */}
      <div id="scanner-editor-col" className="xl:col-span-7 flex flex-col gap-5">
        <div id="scanner-header-selectors" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 id="scanner-title" className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">
              Vulnerability Sandbox
            </h3>
            <p id="scanner-sub" className="text-xs text-slate-500">Paste code to run active security compliance checks</p>
          </div>

          <div id="example-buttons-grid" className="flex flex-wrap gap-1.5">
            {VULNERABLE_CODE_EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                id={`example-btn-${idx}`}
                onClick={() => handleSelectExample(idx)}
                className={`px-3 py-1 text-[11px] font-mono rounded-full border transition-all ${
                  selectedExampleIndex === idx
                    ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-bold"
                    : "bg-slate-950/30 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pseudo Code Editor Window */}
        <div id="editor-wrapper" className="relative flex-1 flex flex-col rounded-2xl border border-slate-900 bg-[#070708] overflow-hidden group shadow-xl">
          {/* Editor Header Bar */}
          <div id="editor-header" className="px-4 py-2 bg-zinc-950/80 border-b border-slate-900/90 flex justify-between items-center select-none">
            <div id="editor-file-info" className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span id="editor-filename" className="text-xs font-mono text-slate-400">
                vulnerable_source.{VULNERABLE_CODE_EXAMPLES[selectedExampleIndex].fileType === "python" ? "py" : "js"}
              </span>
            </div>
            <span id="editor-mode" className="text-[10px] font-mono text-slate-500 uppercase">
              {VULNERABLE_CODE_EXAMPLES[selectedExampleIndex].fileType || "javascript"} input mode
            </span>
          </div>

          {/* Interactive Textarea area with slide glow lines when scanning */}
          <div id="editor-interior-relative" className="relative flex-1 flex flex-col">
            <textarea
              id="raw-code-pasted"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full flex-1 min-h-[300px] p-5 font-mono text-xs text-cyan-350 bg-transparent focus:outline-none resize-none leading-relaxed select-text"
              placeholder="// Paste your program source code blocks here for evaluation..."
            />

            {/* Sweep Scanner line when scanning */}
            {scanning && (
              <motion.div
                id="scanner-glow-line"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] opacity-70 pointer-events-none"
              />
            )}
          </div>

          {/* Editor Foot Action Button */}
          <div id="editor-footer-trigger" className="px-4 py-3 bg-zinc-950/60 border-t border-slate-900/60 flex items-center justify-between">
            <span id="editor-helper" className="text-[10px] text-slate-500 tracking-normal leading-none font-medium flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Tweak our sample payloads above to test different scan audits.
            </span>

            <button
              id="editor-btn-audit"
              onClick={handleRunScan}
              disabled={scanning}
              className={`flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-650 to-rose-650 hover:from-red-550 hover:to-rose-550 text-xs font-semibold text-white rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] ${
                scanning ? "opacity-60 cursor-wait animate-pulse" : ""
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {scanning ? "Sweeping Workload..." : "Execute Static Scan"}
            </button>
          </div>
        </div>
      </div>

      {/* Security Report Output details (Right) */}
      <div id="scanner-out-col" className="xl:col-span-5 flex flex-col gap-4">
        <h3 id="report-title" className="text-sm font-semibold tracking-wide text-slate-400 uppercase font-mono">
          Security Findings
        </h3>

        {!hasScanned && !scanning ? (
          <div id="no-report-state" className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-900 bg-slate-950/15 min-h-[350px]">
            <div id="no-report-shield-wrapper" className="p-4 rounded-full bg-slate-900/40 border border-slate-80</20 text-slate-600 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h4 id="no-report-h4" className="text-[13px] font-semibold text-slate-400">Scanner is Currently Standby</h4>
            <p id="no-report-p" className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
              Initiate a <strong>Static security scan (SAST)</strong> on the workspace editor to scan components using the Static audit engine.
            </p>
          </div>
        ) : scanning ? (
          <div id="scanning-loader-state" className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-900 bg-slate-950/15 min-h-[350px]">
            <div id="scanning-wheel" className="w-10 h-10 rounded-full border-2 border-red-500/25 border-t-red-500 animate-spin mb-4" />
            <span id="scanning-text" className="text-xs font-mono text-rose-500 animate-pulse tracking-wide uppercase font-bold">
              De-assembling code AST structures...
            </span>
            <p id="scanning-desc" className="text-[11px] text-slate-500 max-w-xs mt-2 leading-relaxed">
              Querying structural models via isolated developer sandboxes to compile safe secure recommendations.
            </p>
          </div>
        ) : scanReport.length === 0 ? (
          <div id="clear-report-state" className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-emerald-950/20 bg-emerald-950/5 min-h-[350px]">
            <div id="clear-shield-wrapper" className="p-4 rounded-full bg-emerald-950/35 border border-emerald-900/30 text-emerald-400 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h4 id="clear-h4" className="text-sm font-semibold text-emerald-400">0 Vulnerabilities Found</h4>
            <p id="clear-p" className="text-xs text-emerald-500/80 max-w-xs mt-1.5 leading-relaxed">
              Excellent! No high-density OWASP security gaps or API credential exposures caught. Code is structurally safe.
            </p>
          </div>
        ) : (
          <div id="vulnerabilities-list-panel" className="flex-1 flex flex-col gap-4">
            {/* List entries */}
            <div id="vuln-badges-grid" className="max-h-[145px] overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
              {scanReport.map((v) => {
                const isActive = activeReportId === v.id;
                return (
                  <div
                    key={v.id}
                    id={`vuln-badge-${v.id}`}
                    onClick={() => setActiveReportId(v.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-slate-900 border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.06)]"
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div id={`vuln-meta-row-${v.id}`} className="flex items-center gap-2.5">
                      {getSeverityIcon(v.severity)}
                      <div>
                        <span id={`vuln-name-${v.id}`} className="text-xs font-bold text-slate-200 block md:max-w-xs truncate">
                          {v.name}
                        </span>
                        <p id={`vuln-line-${v.id}`} className="text-[9px] font-mono text-slate-500 mt-0.5 uppercase">
                          Location: line {v.line || 'General Scope'}
                        </p>
                      </div>
                    </div>

                    <span id={`vuln-severity-${v.id}`} className={`text-[8px] font-mono font-bold uppercase py-0.5 px-2 rounded-full border ${getSeverityBadge(v.severity)}`}>
                      {v.severity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Analysis details details expanded */}
            {activeReport && (
              <div id="vuln-analysis-details" className="flex-1 p-5 rounded-2xl border border-slate-900 bg-slate-950/30 flex flex-col justify-between gap-5 animate-fadeIn min-h-[220px]">
                <div id="vuln-expanded-body" className="space-y-4">
                  <div id="vuln-expanded-header" className="flex justify-between items-start gap-3">
                    <h4 id="vuln-header-name" className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider leading-none">
                      Audit finding report
                    </h4>
                    <span id="vuln-header-id" className="text-[10px] font-mono text-rose-500 font-bold bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/30">
                      {activeReport.id}
                    </span>
                  </div>

                  <div id="vuln-expanded-desc" className="space-y-2 text-xs">
                    <p id="vuln-desc-text" className="text-slate-300 leading-relaxed">
                      <span className="text-rose-400 font-semibold font-mono">Risk description:</span> {activeReport.description}
                    </p>
                    <p id="vuln-remed-text" className="text-emerald-400/90 leading-relaxed font-sans">
                      <span className="text-emerald-400 font-semibold font-mono">Proposed Clean Fix:</span> {activeReport.recommendation}
                    </p>
                  </div>
                </div>

                {/* COMPARATIVE FIXED CODE PREVIEW */}
                <div id="vuln-remediation-box" className="space-y-2">
                  <div id="remediation-box-header" className="flex justify-between items-center bg-zinc-950/80 px-3 py-1.5 rounded-t-xl border-t border-x border-slate-900 select-none">
                    <div id="remediation-icon-col" className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span id="remediation-lbl" className="text-[10px] font-mono font-bold text-slate-450 uppercase">
                        Remediation Safe Snippet
                      </span>
                    </div>

                    <button
                      id="remediation-btn-copy"
                      onClick={() => handleCopyCode(activeReport.fixedCode)}
                      className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      title="Copy clean code snippet"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <pre id="remediation-code-scroller" className="p-3 bg-zinc-950 border-b border-x border-slate-900 text-[11px] font-mono text-emerald-400 rounded-b-xl overflow-x-auto whitespace-pre leading-relaxed max-h-[140px] scrollbar-thin">
                    {activeReport.fixedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
