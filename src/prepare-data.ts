import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Catalog, Project, ProfileData } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ABOUT_ME_DIR = "/Users/w1n/ai/about-me";

function parseAllMyWork(content: string): Project[] {
  const projects: Project[] = [];
  const lines = content.split(/\r?\n/);

  let currentSection = "";
  let currentCategory = "";
  let pending: Partial<Project> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      currentCategory = "";
      continue;
    }

    if (line.startsWith("### ")) {
      currentCategory = line.replace("### ", "").trim();
      continue;
    }

    // Project header: **name** | Type
    const headerMatch = line.match(/^\*\*(.+?)\*\*\s*\|\s*(.+)$/);
    if (headerMatch) {
      if (pending?.name) {
        projects.push(pending as Project);
      }
      pending = {
        name: headerMatch[1].trim(),
        type: headerMatch[2].trim(),
        category: currentCategory,
        source: currentSection,
        what: "",
        why: "",
        how: "",
      };
      continue;
    }

    // Table rows for third party
    if (line.startsWith("| **") && line.includes("|")) {
      const cells = line.split("|").map((c) => c.trim());
      if (cells.length >= 5) {
        const name = cells[1].replace(/\*\*/g, "").trim();
        const type = cells[2];
        const author = cells[3];
        const notes = cells[4];
        if (name && name !== "Name") {
          projects.push({
            name,
            type,
            category: currentCategory,
            source: currentSection,
            what: notes,
            why: `Third-party project by ${author}`,
            how: "N/A",
          });
        }
      }
      continue;
    }

    if (!pending) continue;

    const whatMatch = line.match(/^What:\s*(.*)$/i);
    const whyMatch = line.match(/^Why:\s*(.*)$/i);
    const howMatch = line.match(/^How:\s*(.*)$/i);

    if (whatMatch) pending.what = whatMatch[1].trim();
    else if (whyMatch) pending.why = whyMatch[1].trim();
    else if (howMatch) pending.how = howMatch[1].trim();
  }

  if (pending?.name) {
    projects.push(pending as Project);
  }

  return projects;
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

function extractTechStack(how: string): string[] {
  const found = new Set<string>();
  const text = how.toLowerCase();
  for (const term of TECH_TERMS) {
    if (text.includes(term.toLowerCase())) {
      found.add(term.toLowerCase());
    }
  }
  return Array.from(found);
}

function parseProfessionalProfile(content: string): ProfileData {
  const profile: ProfileData = {
    summary: "",
    skills: {},
    experience: [],
    shippedApps: [],
  };

  // Summary: first paragraph under ## Summary
  const summaryMatch = content.match(/## Summary\s*\n\s*\n([^#]+?)(?=\n## |$)/s);
  if (summaryMatch) {
    profile.summary = summaryMatch[1].replace(/\s+/g, " ").trim();
  }

  // Skills table
  const skillsMatch = content.match(/## Skills\s*\n\n\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n\n|\n##)/);
  if (skillsMatch) {
    const rows = skillsMatch[1].trim().split("\n");
    for (const row of rows) {
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

  // Shipped apps table
  const appsMatch = content.match(/## Shipped Apps & Products\s*\n\n\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n\n|\n##)/);
  if (appsMatch) {
    const rows = appsMatch[1].trim().split("\n");
    for (const row of rows) {
      const cells = row.split("|").map((c) => c.trim());
      if (cells.length >= 5) {
        const name = cells[1].replace(/\*\*/g, "").trim();
        const what = cells[2];
        const platforms = cells[3];
        const downloads = cells[4];
        if (name && name !== "Name") {
          profile.shippedApps.push({ name, what, platforms, downloads });
        }
      }
    }
  }

  return profile;
}

function main() {
  const allMyWork = readFileSync(join(ABOUT_ME_DIR, "all_my_work.md"), "utf-8");
  const professionalProfile = readFileSync(
    join(ABOUT_ME_DIR, "professional_profile.md"),
    "utf-8"
  );

  const projects = parseAllMyWork(allMyWork).map((p) => ({
    ...p,
    tech: extractTechStack(`${p.how} ${p.what}`),
  }));

  const profile = parseProfessionalProfile(professionalProfile);

  const catalog: Catalog = {
    generatedAt: new Date().toISOString(),
    projects,
    profile,
  };

  writeFileSync(join(ROOT, "data", "catalog.json"), JSON.stringify(catalog, null, 2));
  console.log(`Prepared catalog with ${projects.length} projects`);
}

main();
