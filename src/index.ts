#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Catalog, Project } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalog: Catalog = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "catalog.json"), "utf-8")
);

function scoreProject(project: Project, query: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = `${project.name} ${project.type} ${project.what} ${project.why} ${project.how} ${project.tech?.join(" ") ?? ""}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (project.name.toLowerCase().includes(term)) score += 5;
    if (text.includes(term)) score += 1;
  }
  return score;
}

const server = new Server(
  {
    name: "mcp-harshjoshi-work",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_projects",
        description: "Search Harshvardhan Joshi's project catalog by keyword, technology, or domain.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keywords to search across project names, descriptions, and tech stacks.",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default 10).",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_project_details",
        description: "Get full details for a specific project by exact name.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Exact project name (case-sensitive).",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "list_tech_stack",
        description: "List technologies Harshvardhan has used, with project counts.",
        inputSchema: {
          type: "object",
          properties: {
            tech: {
              type: "string",
              description: "Optional filter by a specific technology (e.g., 'python', 'typescript').",
            },
          },
        },
      },
      {
        name: "get_experience_summary",
        description: "Get a high-level summary of Harshvardhan's career and capabilities.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "find_projects_by_criteria",
        description: "Find projects by domain, technology, or career era.",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Domain keyword like 'ai', 'fintech', 'mobile', 'tooling'.",
            },
            tech: {
              type: "string",
              description: "Technology keyword like 'rust', 'flutter', 'mcp'.",
            },
            category: {
              type: "string",
              description: "Ownership category like 'Created By Me' or 'Maintained Fork'.",
            },
            limit: {
              type: "number",
              description: "Maximum results (default 10).",
              default: 10,
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "search_projects") {
    const query = String(args?.query ?? "");
    const limit = Number(args?.limit ?? 10);
    const results = catalog.projects
      .map((p) => ({ project: p, score: scoreProject(p, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => ({
        name: r.project.name,
        type: r.project.type,
        category: r.project.category,
        what: r.project.what,
        tech: r.project.tech,
      }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ query, count: results.length, results }, null, 2),
        },
      ],
    };
  }

  if (name === "get_project_details") {
    const projectName = String(args?.name ?? "");
    const project = catalog.projects.find(
      (p) => p.name.toLowerCase() === projectName.toLowerCase()
    );
    if (!project) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: `Project '${projectName}' not found.` }, null, 2),
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(project, null, 2),
        },
      ],
    };
  }

  if (name === "list_tech_stack") {
    const techFilter = String(args?.tech ?? "").toLowerCase();
    const counts: Record<string, number> = {};
    for (const project of catalog.projects) {
      for (const tech of project.tech ?? []) {
        counts[tech] = (counts[tech] || 0) + 1;
      }
    }
    let entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (techFilter) {
      entries = entries.filter(([tech]) => tech.includes(techFilter));
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: entries.length, tech: entries }, null, 2),
        },
      ],
    };
  }

  if (name === "get_experience_summary") {
    const summary = {
      headline: catalog.profile.summary,
      totalProjects: catalog.projects.length,
      shippedApps: catalog.profile.shippedApps,
      topSkills: Object.entries(catalog.profile.skills)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 10)
        .map(([name, data]) => ({ name, ...data })),
    };
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(summary, null, 2),
        },
      ],
    };
  }

  if (name === "find_projects_by_criteria") {
    const domain = String(args?.domain ?? "").toLowerCase();
    const tech = String(args?.tech ?? "").toLowerCase();
    const category = String(args?.category ?? "").toLowerCase();
    const limit = Number(args?.limit ?? 10);

    const results = catalog.projects
      .filter((p) => {
        if (category && !p.category.toLowerCase().includes(category)) return false;
        const text = `${p.name} ${p.type} ${p.what} ${p.why} ${p.how} ${p.tech?.join(" ") ?? ""}`.toLowerCase();
        if (domain && !text.includes(domain)) return false;
        if (tech && !p.tech?.some((t) => t.includes(tech))) return false;
        return true;
      })
      .slice(0, limit)
      .map((p) => ({
        name: p.name,
        type: p.type,
        category: p.category,
        what: p.what,
        tech: p.tech,
      }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ domain, tech, category, count: results.length, results }, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: `Unknown tool: ${name}` }, null, 2),
      },
    ],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
