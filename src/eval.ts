import { readFileSync } from "fs";
import { join } from "path";
import type { Catalog } from "./types.js";

const catalog: Catalog = JSON.parse(
  readFileSync(join(process.cwd(), "data", "catalog.json"), "utf-8")
);

interface EvalCase {
  name: string;
  tool: string;
  input: Record<string, unknown>;
  check: (result: unknown) => { pass: boolean; reason: string };
}

function runTool(tool: string, input: Record<string, unknown>): unknown {
  // Lightweight in-process simulation of tool logic (kept in sync with index.ts)
  if (tool === "search_projects") {
    const query = String(input.query ?? "").toLowerCase();
    const limit = Number(input.limit ?? 10);
    const terms = query.split(/\s+/).filter(Boolean);
    return catalog.projects
      .map((p) => {
        const text = `${p.name} ${p.type} ${p.what} ${p.why} ${p.how} ${p.tech?.join(" ") ?? ""}`.toLowerCase();
        let score = 0;
        for (const term of terms) {
          if (p.name.toLowerCase().includes(term)) score += 5;
          if (text.includes(term)) score += 1;
        }
        return { project: p, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.project.name);
  }

  if (tool === "get_project_details") {
    const name = String(input.name ?? "");
    const p = catalog.projects.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return p ? p.name : null;
  }

  if (tool === "list_tech_stack") {
    const techFilter = String(input.tech ?? "").toLowerCase();
    const counts: Record<string, number> = {};
    for (const project of catalog.projects) {
      for (const tech of project.tech ?? []) {
        counts[tech] = (counts[tech] || 0) + 1;
      }
    }
    return techFilter
      ? Object.keys(counts).filter((t) => t.includes(techFilter)).sort()
      : Object.keys(counts).sort();
  }

  if (tool === "get_experience_summary") {
    return Object.keys(catalog.profile.skills).length > 0;
  }

  if (tool === "find_projects_by_criteria") {
    const tech = String(input.tech ?? "").toLowerCase();
    return catalog.projects
      .filter((p) => (tech ? p.tech?.some((t) => t.includes(tech)) : true))
      .slice(0, Number(input.limit ?? 10))
      .map((p) => p.name);
  }

  return null;
}

const cases: EvalCase[] = [
  {
    name: "Search finds pixel-press",
    tool: "search_projects",
    input: { query: "pixel-press video compressor" },
    check: (result) => {
      const names = result as string[];
      const pass = names.includes("pixel-press");
      return { pass, reason: pass ? "pixel-press found" : "pixel-press missing" };
    },
  },
  {
    name: "Search finds AI projects",
    tool: "search_projects",
    input: { query: "LLM local inference" },
    check: (result) => {
      const names = result as string[];
      const pass = names.length > 0;
      return { pass, reason: pass ? `${names.length} results` : "no results" };
    },
  },
  {
    name: "Get project details for local-rag",
    tool: "get_project_details",
    input: { name: "local-rag" },
    check: (result) => {
      const pass = result === "local-rag";
      return { pass, reason: pass ? "found local-rag" : `got ${result}` };
    },
  },
  {
    name: "Tech stack lists python",
    tool: "list_tech_stack",
    input: { tech: "python" },
    check: (result) => {
      const techs = result as string[];
      const pass = techs.includes("python");
      return { pass, reason: pass ? "python listed" : `got ${techs.join(", ")}` };
    },
  },
  {
    name: "Experience summary loads",
    tool: "get_experience_summary",
    input: {},
    check: (result) => {
      const pass = result === true;
      return { pass, reason: pass ? "profile loaded" : "profile empty" };
    },
  },
  {
    name: "Find rust projects",
    tool: "find_projects_by_criteria",
    input: { tech: "rust", limit: 5 },
    check: (result) => {
      const names = result as string[];
      const pass = names.includes("pixel-press");
      return { pass, reason: pass ? "pixel-press found via rust filter" : `got ${names.join(", ")}` };
    },
  },
];

function main() {
  let passed = 0;
  let failed = 0;

  for (const c of cases) {
    const result = runTool(c.tool, c.input);
    const { pass, reason } = c.check(result);
    if (pass) {
      console.log(`✅ ${c.name}: ${reason}`);
      passed++;
    } else {
      console.log(`❌ ${c.name}: ${reason}`);
      failed++;
    }
  }

  console.log(`\n${passed}/${cases.length} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
