# mcp-harshjoshi-work

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes **Harshvardhan Joshi's** project catalog and professional profile as searchable tools for AI agents.

Built as a portfolio piece for the **AI Platform Engineer** role at Polygon Labs — it demonstrates MCP server design, context/retrieval engineering, knowledge centralization, and tool-use.

## What it does

Any MCP-compatible client (Claude Code, Cursor, Windsurf, etc.) can ask:

- *"What AI projects has Harshvardhan shipped?"* → `search_projects`
- *"Tell me about pixel-press."* → `get_project_details`
- *"What technologies does he know?"* → `list_tech_stack`
- *"Summarize his experience."* → `get_experience_summary`
- *"Find his fintech or Rust projects."* → `find_projects_by_criteria`

## Tools

| Tool | Description |
|---|---|
| `search_projects` | Keyword search across project names, descriptions, and tech stacks. |
| `get_project_details` | Full details for a specific project by name. |
| `list_tech_stack` | List technologies with project counts. |
| `get_experience_summary` | High-level career summary, shipped apps, and top skills. |
| `find_projects_by_criteria` | Filter by domain, technology, or ownership category. |

## Data source

Data files ship **inside this repo** and are the single source of truth:

- [`data/all_my_work.md`](./data/all_my_work.md) — AI Projects → AI Tools → AI Skills → Non-AI Recent → Client Projects → Everything Else (recent first)
- [`data/professional_profile.md`](./data/professional_profile.md) — sanitized public profile (no private career notes)

At startup the server loads the catalog in this order:

1. Live `data/` files from this repo on GitHub (`raw.githubusercontent.com`) — so pushing an edit to this repo updates MCP responses immediately, no reinstall needed.
2. Bundled `data/` files (works offline).
3. Prebuilt `data/catalog.json` (last-resort fallback).

After editing the data files, regenerate the committed fallback and verify:

```bash
npm run prepare:data   # rebuilds data/catalog.json from data/*.md
npm run eval           # 6/6 assertions
npm run build
```

## Install

```bash
npm install
npm run prepare:data
npm run build
```

## Use with Claude Code

Add to your `claude_desktop_config.json` or `mcp-config.json`:

```json
{
  "mcpServers": {
    "harshjoshi-work": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-harshjoshi-work/dist/index.js"]
    }
  }
}
```

## Evals

```bash
npm run eval
```

Runs a small regression suite of tool-call assertions against the prepared catalog.

## Stack

TypeScript · MCP SDK · stdio transport

## Why this exists

This server is part of a deliberate shift toward AI platform engineering. It packages years of full-stack work into a structured, queryable context layer — the same kind of work required to build agent platforms: MCP connectors, evals, retrieval, and reusable skills.

## License

MIT
