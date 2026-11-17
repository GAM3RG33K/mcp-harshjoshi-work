import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildCatalog } from "./catalog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Data files ship inside this repo (data/). This is the single source of truth.
const DATA_DIR = join(ROOT, "data");

function main() {
  const allMyWork = readFileSync(join(DATA_DIR, "all_my_work.md"), "utf-8");
  const professionalProfile = readFileSync(join(DATA_DIR, "professional_profile.md"), "utf-8");

  const catalog = buildCatalog(allMyWork, professionalProfile);

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(join(DATA_DIR, "catalog.json"), JSON.stringify(catalog, null, 2));
  console.log(`Prepared catalog with ${catalog.projects.length} projects`);
}

main();
