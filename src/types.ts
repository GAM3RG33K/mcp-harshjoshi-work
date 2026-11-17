export interface Project {
  name: string;
  type: string;
  category: string; // e.g., "Created By Me", "Maintained Fork", "Client Project"
  source: string; // directory/section name
  what: string;
  why: string;
  how: string;
  tech?: string[];
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
