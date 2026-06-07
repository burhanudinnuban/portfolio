import { SkillCategory } from "../types";
import { Code, ShieldAlert, Cloud, Terminal, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SkillsRadarProps {
  onSkillClick?: (skillName: string) => void;
  skillCategories?: SkillCategory[];
}

export default function SkillsRadar({ onSkillClick, skillCategories }: SkillsRadarProps) {
  const categories = skillCategories || [];

  // Returns appropriate lucide icon map
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="w-4 h-4 text-cyan-400" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-4 h-4 text-rose-450" />;
      case "Cloud":
        return <Cloud className="w-4 h-4 text-emerald-400" />;
      default:
        return <Terminal className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getAccentColors = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return {
          text: "text-rose-400",
          border: "border-rose-950/55",
          bg: "bg-rose-950/15",
          barClass: "bg-rose-500"
        };
      case "Cloud":
        return {
          text: "text-emerald-400",
          border: "border-emerald-950/55",
          bg: "bg-emerald-950/15",
          barClass: "bg-emerald-500"
        };
      default:
        return {
          text: "text-cyan-400",
          border: "border-cyan-950/55",
          bg: "bg-cyan-950/15",
          barClass: "bg-cyan-500"
        };
    }
  };

  return (
    <div id="skills-vertical-container" className="space-y-6 text-slate-100 font-sans">
      <div id="skills-vertical-stack" className="space-y-4">
        {categories.map((category, catIdx) => {
          const colors = getAccentColors(category.icon);
          return (
            <div
              key={category.title}
              id={`skill-cat-${catIdx}`}
              className={`p-4 rounded-xl border border-slate-900 bg-slate-950/60 transition-all duration-350 hover:border-slate-800/80`}
            >
              {/* Category Header */}
              <div id={`skill-cat-header-${catIdx}`} className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-900/40 justify-between">
                <div className="flex items-center gap-2">
                  <div id={`skill-cat-icon-${catIdx}`} className={`p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-xs`}>
                    {getIcon(category.icon)}
                  </div>
                  <h4 id={`skill-cat-title-${catIdx}`} className="font-semibold text-xs tracking-wide uppercase text-slate-300">
                    {category.title}
                  </h4>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-mono border ${colors.border} ${colors.bg} ${colors.text}`}>
                  PRO LEVEL
                </div>
              </div>

              {/* Skills List in Vertical Stack */}
              <div id={`skill-cat-items-${catIdx}`} className="space-y-3 pt-0.5">
                {category.items.map((skill, sIdx) => (
                  <div
                    key={skill.name}
                    id={`skill-item-${catIdx}-${sIdx}`}
                    onClick={() => onSkillClick && onSkillClick(skill.name)}
                    className="space-y-1.5 group/item cursor-pointer"
                    title="Tap to highlight relevant projects"
                  >
                    <div id={`skill-meta-${catIdx}-${sIdx}`} className="flex justify-between items-center text-xs">
                      <span id={`skill-name-${catIdx}-${sIdx}`} className="text-slate-400 group-hover/item:text-white font-medium text-[11px] transition-colors flex items-center gap-1">
                        <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-cyan-400">•</span>
                        {skill.name}
                      </span>
                      <span id={`skill-lvl-${catIdx}-${sIdx}`} className="text-slate-500 font-mono text-[10px] group-hover/item:text-slate-300">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Enhanced Animating Progress Bar Track */}
                    <div id={`skill-track-${catIdx}-${sIdx}`} className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-900/60 relative">
                      <motion.div
                        id={`skill-bar-${catIdx}-${sIdx}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: sIdx * 0.04 + catIdx * 0.08 }}
                        className={`h-full rounded-full ${colors.barClass}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded interactive guide note */}
      <div id="skills-interactive-legend" className="p-3 rounded-lg border border-slate-900 bg-slate-950/25 flex items-start gap-2.5">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0 animate-pulse" />
        <p className="text-[10px] text-slate-500 leading-normal">
          <span className="text-cyan-400 font-bold">Interactive Stream:</span> Clicks on any skill name filter and highlight related projects on the matching grid directly.
        </p>
      </div>
    </div>
  );
}
