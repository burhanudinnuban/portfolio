import { useState, ReactNode } from "react";
import { CERTIFICATIONS } from "../data";
import { Experience } from "../types";
import { Briefcase, Award, Calendar, ChevronRight, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface TimelineProps {
  experiences?: Experience[];
  showCredentials?: boolean;
  rightContent?: ReactNode;
}

export default function Timeline({ experiences, showCredentials = false, rightContent }: TimelineProps) {
  const list = experiences || [];
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  return (
    <div id="timeline-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100">
      {/* Professional Journey Timeline */}
      <div id="experience-section" className={`${(showCredentials || rightContent) ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
        <h3 id="experience-header" className="text-xl font-semibold tracking-tight text-cyan-400 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          Professional Experience
        </h3>

        <div id="timeline-flow" className="relative pl-6 border-l border-slate-800 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-slate-800">
          {list.map((exp, idx) => {
            const isSelected = selectedExp === exp.id;
            const hasCompanyOverview = exp.company.toLowerCase().includes("hark") ||
              exp.company.toLowerCase().includes("hokben") ||
              exp.company.toLowerCase().includes("waskita") ||
              exp.company.toLowerCase().includes("sera") ||
              exp.company.toLowerCase().includes("generasi") ||
              exp.company.toLowerCase().includes("eka boga");
            
            return (
              <motion.div
                key={exp.id}
                id={`exp-item-${exp.id}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`relative p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900/95 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/30"
                }`}
                onClick={() => setSelectedExp(isSelected ? null : exp.id)}
              >
                {/* Timeline Bullet Anchor */}
                <div
                  id={`exp-bullet-${exp.id}`}
                  className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isSelected
                      ? "bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110"
                      : "bg-slate-950 border-slate-700 hover:border-cyan-400"
                  }`}
                />

                <div id={`exp-content-${exp.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 id={`exp-role-${exp.id}`} className="text-lg font-semibold text-slate-100 hover:text-cyan-400 transition-colors">
                      {exp.role}
                    </h4>
                    <p id={`exp-company-${exp.id}`} className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      {exp.company}
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-500/70" />
                    </p>
                  </div>
                  <div id={`exp-period-${exp.id}`} className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 text-xs text-slate-400 rounded-full w-fit">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {exp.period}
                  </div>
                </div>

                {/* Company Overview (First description paragraph) */}
                <div 
                  id={`exp-company-desc-${exp.id}`} 
                  className="text-xs text-slate-300 bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/80 leading-relaxed mb-3 mt-2 flex flex-col gap-1 hover:border-slate-800 transition-colors"
                >
                  <span className="text-cyan-400 font-mono text-[8px] uppercase tracking-wider font-bold">
                    {hasCompanyOverview ? "🏢 Company Profile" : "🚀 Primary Focus"}
                  </span>
                  <p className="italic opacity-90">{exp.description[0]}</p>
                </div>

                {/* Interactive read more/collapse bar */}
                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {!isSelected && exp.skills.slice(0, 3).map((skill) => (
                      <span 
                        key={skill} 
                        className="px-1.5 py-0.5 bg-slate-900/60 text-[9px] font-mono text-slate-500 rounded border border-slate-900/80"
                      >
                        {skill}
                      </span>
                    ))}
                    {!isSelected && exp.skills.length > 3 && (
                      <span className="text-[9px] font-mono text-slate-600 self-center">
                        +{exp.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <button
                    id={`read-more-btn-${exp.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExp(isSelected ? null : exp.id);
                    }}
                    className={`px-3 py-1 text-[10px] font-mono rounded-lg border font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-cyan-400 border-slate-800 hover:text-cyan-300 hover:bg-slate-850"
                        : "bg-cyan-950/20 text-cyan-400 border-cyan-950/40 hover:bg-cyan-950/45 hover:border-cyan-400/30"
                    }`}
                  >
                    {isSelected ? "Collapse Details" : "Read More"}
                    {isSelected ? <ChevronUp className="w-3 h-3 animate-pulse" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {isSelected && (
                  <motion.div
                    id={`exp-details-block-${exp.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 pt-4 border-t border-slate-800/80 space-y-4"
                  >
                    {exp.description.length > 1 && (
                      <div className="space-y-2.5">
                        <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider font-bold block mb-1">
                          🎯 Accomplishments & Task Scope
                        </span>
                        <ul id={`exp-desc-list-${exp.id}`} className="space-y-2 text-xs text-slate-350 bg-slate-950/10 p-1 rounded-lg">
                          {exp.description.slice(1).map((item, dIdx) => (
                            <li key={dIdx} id={`exp-desc-point-${exp.id}-${dIdx}`} className="leading-relaxed flex items-start gap-2.5">
                              <span className="text-cyan-500 font-mono mt-0.5 shrink-0 text-[10px] select-none">✦</span>
                              <span className="opacity-90">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div id={`exp-skills-block-${exp.id}`} className="space-y-2 pt-1 border-t border-slate-900/60">
                      <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider font-bold block">
                        🛡️ Technology stack integration
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            id={`exp-skill-tag-${exp.id}-${skill}`}
                            className="px-2 py-0.5 bg-cyan-950/35 border border-cyan-850/50 text-[10px] font-mono text-cyan-400 rounded-md hover:border-cyan-400/30 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Education Highlight */}
        <div id="education-sub-section" className="mt-8 pt-6 border-t border-slate-800/65">
          <h3 id="education-header" className="text-xl font-semibold tracking-tight text-cyan-400 flex items-center gap-2 mb-4">
            <GraduationCap className="w-5.5 h-5.5 text-cyan-400" />
            Education
          </h3>
          <div id="education-card" className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/40 flex items-start gap-4">
            <div id="education-icon-wrapper" className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/30 text-blue-400 mt-1">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 id="school-degree" className="text-base font-semibold text-slate-100">
                Bachelor Degree of Information System (S1)
              </h4>
              <p id="school-major" className="text-sm text-slate-400 mt-0.5">
                Gunadarma University • Graduated Sep 2020
              </p>
              <p id="school-timeline" className="text-xs text-slate-500 font-mono mt-2">
                Focused on Information Architects, Relational Database Management, and Enterprise Systems.
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Certifications & Badges */}
      {showCredentials && (
        <div id="certifications-section" className="lg:col-span-4 space-y-6">
          <h3 id="certications-header" className="text-xl font-semibold tracking-tight text-cyan-400 flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Credentials
          </h3>

          <div id="certs-grid" className="grid grid-cols-1 gap-3.5">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                id={`cert-item-${cert.id}`}
                className="p-4 rounded-xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-slate-950 to-slate-900/50 hover:border-cyan-500/30 transition-all flex items-center justify-between group"
              >
                <div id={`cert-info-${cert.id}`} className="flex items-center gap-3">
                  <div id={`cert-badge-wrapper-${cert.id}`} className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/30 text-cyan-400 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 id={`cert-name-${cert.id}`} className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                      {cert.name}
                    </h4>
                    <p id={`cert-issuer-${cert.id}`} className="text-xs text-slate-400 mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
                <span id={`cert-year-${cert.id}`} className="text-xs text-slate-500 font-mono pl-2">
                  {cert.year}
                </span>
              </div>
            ))}
          </div>

          {/* Security Compliance Seal */}
          <div id="compliance-seal-box" className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center">
            <div id="seal-shield" className="w-7 h-7 rounded-full bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span id="compliance-label" className="text-xs text-slate-400 font-medium">Verified DevSecOps Principles</span>
            <p id="compliance-description" className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
              Secure Coding • Least Privilege • CI/CD Hardness
            </p>
          </div>
        </div>
      )}

      {rightContent && (
        <div id="timeline-right-content-wrapper" className="lg:col-span-4 space-y-6">
          {rightContent}
        </div>
      )}
    </div>
  );
}
