import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Catalog, Project, ProfileData } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// GitHub raw URLs for the public data files
const ALL_MY_WORK_URL =
  "https://raw.githubusercontent.com/GAM3RG33K/resume-json/refs/heads/main/all_my_work.md";
const PROFESSIONAL_PROFILE_URL =
  "https://raw.githubusercontent.com/GAM3RG33K/resume-json/refs/heads/main/professional_profile.md";

// Fallback to local files if GitHub is unreachable (e.g., offline dev)
const LOCAL_ABOUT_ME_DIR = "/Users/w1n/ai/about-me";

const CATEGORY_ORDER: Record<string, number> = {
  "AI Projects": 1,
  "AI Tools": 2,
  "AI Skills": 3,
  "Non-AI Recent Tools": 4,
  "Non-AI Recent Projects": 5,
  "Client Projects": 6,
  "Everything Else": 7,
};

async function fetchMarkdown(url: string, fallbackPath: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "mcp-harshjoshi-work/prepare-data" },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    console.log(`Fetched ${url}`);
    return await response.text();
  } catch (err) {
    console.warn(`GitHub fetch failed for ${url}, using local fallback: ${err}`);
    return readFileSync(fallbackPath, "utf-8");
  }
}

function parseAllMyWork(content: string): Project[] {
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // New category section: "## AI Projects", "## AI Tools", etc.
    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      currentCategory = currentSection;
      continue;
    }

    // Agent Skills is a subheading under AI Skills, not its own section
    if (line.startsWith("### ")) {
      // Keep current category as AI Skills
      continue;
    }

    // Project header: **name** | Type
    const headerMatch = line.match(/^\*\*(.+?)\*\*\s*\|\s*(.+)$/);
    if (headerMatch) {
      if (pending?.name) {
        projects.push(pending as Project);
      }
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

  if (pending?.name) {
    projects.push(pending as Project);
  }

  // Sort by order
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

async function main() {
  const [allMyWork, professionalProfile] = await Promise.all([
    fetchMarkdown(ALL_MY_WORK_URL, join(LOCAL_ABOUT_ME_DIR, "all_my_work.md")),
    fetchMarkdown(PROFESSIONAL_PROFILE_URL, join(LOCAL_ABOUT_ME_DIR, "professional_profile.md")),
  ]);

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
