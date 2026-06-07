export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  icon: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "Full-Stack" | "DevSecOps" | "Cloud Infrastructure";
  description: string;
  details: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  items: { name: string; level: number }[]; // Level out of 100
}

export interface ScanResult {
  id: string;
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  line: number;
  description: string;
  recommendation: string;
  fixedCode: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "failed";
  duration: number; // in ms
  logs: string[];
}

export interface SidebarData {
  username: string;
  bio: string;
  bullets: string[];
  cvUrl?: string;
}

