export interface Project {
  name: string;
  type: string;
  category: string; // e.g., "AI Projects", "AI Tools", "Client Projects", ...
  source: string; // section name
  what: string;
  why: string;
  how: string;
  github?: string;
  tech?: string[];
  order: number; // for sorting: AI Projects first, etc.
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ProfileData {
  summary: string;
  skills: Record<string, { type: string; level: number; since: number }>;
  experience: ExperienceEntry[];
  shippedApps: { name: string; what: string; platforms: string; downloads: string }[];
}

export interface Catalog {
  generatedAt: string;
  projects: Project[];
  profile: ProfileData;
}
