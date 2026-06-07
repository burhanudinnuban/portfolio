import { Certification, Experience, Project, SkillCategory, SidebarData } from "./types";
import dataJson from "./data.json";

export const CERTIFICATIONS: Certification[] = dataJson.certifications as Certification[];
export const EXPERIENCE_HISTORY: Experience[] = dataJson.experiences as Experience[];
export const PROJECTS_LIST: Project[] = dataJson.projects as Project[];
export const SKILL_CATEGORIES: SkillCategory[] = dataJson.skills as SkillCategory[];
export const VULNERABLE_CODE_EXAMPLES = dataJson.vulnerableCodeExamples;
export const SIDEBAR_DEFAULT_DATA: SidebarData = dataJson.sidebar as SidebarData;
