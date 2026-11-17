import type { Catalog, Project, ProfileData } from "./types.js";

const CATEGORY_ORDER: Record<string, number> = {
  "AI Projects": 1,
  "AI Tools": 2,
  "AI Skills": 3,
  "Non-AI Recent Tools": 4,
  "Non-AI Recent Projects": 5,
  "Client Projects": 6,
  "Everything Else": 7,
};

export function parseAllMyWork(content: string): Project[] {
  const projects: Project[] = [];
  const lines = content.split(/\r?\n/);

  let currentSection = "Everything Else";
  let currentCategory = currentSection;
  let pending: Partial<Project> | null = null;
  let orderCounter = 0;

  const sectionOrder = (section: string): number => {
    if (section.startsWith("AI Projects")) return CATEGORY_ORDER["AI Projects"];
    if (section.startsWith("AI Tools")) return CATEGORY_ORDER["AI Tools"];
    if (section.startsWith("AI Skills")) return CATEGORY_ORDER["AI Skills"];
    if (section.startsWith("Non-AI Recent Tools")) return CATEGORY_ORDER["Non-AI Recent Tools"];
    if (section.startsWith("Non-AI Recent Projects")) return CATEGORY_ORDER["Non-AI Recent Projects"];
    if (section.startsWith("Client Projects")) return CATEGORY_ORDER["Client Projects"];
    return CATEGORY_ORDER["Everything Else"];
  };

  for (const rawLine of lines) {
    const line = rawLine;

    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      currentCategory = currentSection;
      continue;
    }
    if (line.startsWith("### ")) {
      continue; // sub-headings keep parent category
    }

    const tableRowMatch = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
    if (tableRowMatch) {
      if (pending?.name) projects.push(pending as Project);
      pending = null;
      orderCounter += 1;
      projects.push({
        name: tableRowMatch[1].trim(),
        type: tableRowMatch[2].trim(),
        category: currentCategory,
        source: currentSection,
        what: tableRowMatch[3].trim(),
        why: "",
        how: "",
        order: sectionOrder(currentCategory) * 1000 + orderCounter,
      });
      continue;
    }

    const headerMatch = line.match(/^\*\*(.+?)\*\*\s*\|\s*(.+)$/);
    if (headerMatch) {
      if (pending?.name) projects.push(pending as Project);
      orderCounter += 1;
      pending = {
        name: headerMatch[1].trim(),
        type: headerMatch[2].trim(),
        category: currentCategory,
        source: currentSection,
        what: "",
        why: "",
        how: "",
        order: sectionOrder(currentCategory) * 1000 + orderCounter,
      };
      continue;
    }
    if (!pending) continue;

    const whatMatch = line.match(/^What:\s*(.*)$/i);
    const whyMatch = line.match(/^Why:\s*(.*)$/i);
    const howMatch = line.match(/^How:\s*(.*)$/i);
    const githubMatch = line.match(/^GitHub:\s*(.*)$/i);
    if (whatMatch) pending.what = whatMatch[1].trim();
    else if (whyMatch) pending.why = whyMatch[1].trim();
    else if (howMatch) pending.how = howMatch[1].trim();
    else if (githubMatch) pending.github = githubMatch[1].trim();
  }
  if (pending?.name) projects.push(pending as Project);
  return projects.sort((a, b) => a.order - b.order);
}

const TECH_TERMS = [
  "Flutter", "React Native", "Next.js", "Node.js", "TypeScript", "JavaScript", "Python", "Go", "Rust",
  "Kotlin", "Java", "Swift", "Dart", "React", "Vue", "Angular", "Svelte", "Express", "Fastify",
  "MongoDB", "PostgreSQL", "SQLite", "Redis", "Supabase", "Firebase", "AWS", "GCP", "Azure",
  "Docker", "Kubernetes", "GitHub Actions", "LangChain", "Ollama", "OpenRouter", "Claude", "Gemini",
  "GPT", "OpenAI", "Anthropic", "Llama", "Figma", "Tauri", "Tailwind", "shadcn", "Radix", "Vite",
  "Bun", "Deno", "Electron", "Puppeteer", "Playwright", "Selenium", "Jest", "Vitest", "Mocha",
  "Cypress", "Terraform", "Cloudflare", "Vercel", "Netlify", "Heroku", "CapRover", "Nginx",
  "GraphQL", "REST", "WebSocket", "Socket.io", "gRPC", "Protobuf", "OAuth", "SAML", "OIDC",
  "SCIM", "JWT", "RAG", "MCP", "LLM", "AI", "ML", "PyTorch", "TensorFlow", "ONNX", "GGUF",
  "llama.cpp", "FFmpeg", "OpenTelemetry", "Grafana", "Datadog", "Langfuse", "LangSmith",
  "Braintrust", "Sentry", "PostHog", "Plausible", "SmolLM",
];

export function extractTechStack(text: string): string[] {
  const found = new Set<string>();
  const t = text.toLowerCase();
  for (const term of TECH_TERMS) {
    if (t.includes(term.toLowerCase())) found.add(term.toLowerCase());
  }
  return Array.from(found);
}

export function parseProfessionalProfile(content: string): ProfileData {
  const profile: ProfileData = {
    summary: "",
    skills: {},
    experience: [],
    shippedApps: [],
  };

  const summaryMatch = content.match(/## Summary\s*\n\s*\n([^#]+?)(?=\n## |$)/s);
  if (summaryMatch) profile.summary = summaryMatch[1].replace(/\s+/g, " ").trim();

  const skillsMatch = content.match(/## Skills\s*\n\n\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n\n|\n##|$)/);
  if (skillsMatch) {
    for (const row of skillsMatch[1].trim().split("\n")) {
      const cells = row.split("|").map((c) => c.trim());
      if (cells.length >= 5) {
        const name = cells[1].replace(/\*\*/g, "").trim();
        const type = cells[2];
        const level = parseInt(cells[3], 10) || 0;
        const since = parseInt(cells[4], 10) || 0;
        if (name) profile.skills[name] = { type, level, since };
      }
    }
  }

  const appsMatch = content.match(/## Shipped Apps & Products\s*\n\n\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n\n|\n##|$)/);
  if (appsMatch) {
    for (const row of appsMatch[1].trim().split("\n")) {
      const cells = row.split("|").map((c) => c.trim());
      if (cells.length >= 5) {
        const name = cells[1].replace(/\*\*/g, "").trim();
        if (name && name !== "Name") {
          profile.shippedApps.push({ name, what: cells[2], platforms: cells[3], downloads: cells[4] });
        }
      }
    }
  }

  return profile;
}

export function buildCatalog(allMyWork: string, professionalProfile: string): Catalog {
  const projects = parseAllMyWork(allMyWork).map((p) => ({
    ...p,
    tech: extractTechStack(`${p.how} ${p.what}`),
  }));
  return {
    generatedAt: new Date().toISOString(),
    projects,
    profile: parseProfessionalProfile(professionalProfile),
  };
}
