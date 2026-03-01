import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const outDir = path.join(root, "output", "i18n");

type Entry = {
  id: string;
  source: string;
  file: string;
};

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
      continue;
    }
    files.push(full);
  }
  return files;
}

function toRel(absPath: string): string {
  return path.relative(root, absPath).split(path.sep).join("/");
}

function unquote(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .trim();
}

const entries: Entry[] = [];
const frFiles = walk(dataDir).filter((file) => file.endsWith("-fr.ts"));

for (const absFile of frFiles) {
  const relFile = toRel(absFile);
  const content = fs.readFileSync(absFile, "utf-8");

  const literals = Array.from(content.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g));
  let index = 0;

  for (const literal of literals) {
    const value = unquote((literal[1] ?? literal[2] ?? "").trim());
    if (!value) continue;
    if (value.length < 3) continue;
    if (/^(#|\/|https?:|[a-z0-9_-]+)$/i.test(value)) continue;
    if (/^(fr|en|es|fr-FR|en-US|es-ES)$/i.test(value)) continue;

    entries.push({
      id: `${relFile}:${index}`,
      source: value,
      file: relFile
    });
    index += 1;
  }
}

fs.mkdirSync(outDir, { recursive: true });

const baseCatalog = {
  generatedAt: new Date().toISOString(),
  locale: "fr",
  count: entries.length,
  entries
};

const enCatalog = {
  generatedAt: new Date().toISOString(),
  locale: "en",
  count: entries.length,
  entries: entries.map((entry) => ({ ...entry, target: "" }))
};

const esCatalog = {
  generatedAt: new Date().toISOString(),
  locale: "es",
  count: entries.length,
  entries: entries.map((entry) => ({ ...entry, target: "" }))
};

const frPath = path.join(outDir, "catalog.fr.json");
const enPath = path.join(outDir, "catalog.en.json");
const esPath = path.join(outDir, "catalog.es.json");

fs.writeFileSync(frPath, JSON.stringify(baseCatalog, null, 2) + "\n", "utf-8");
fs.writeFileSync(enPath, JSON.stringify(enCatalog, null, 2) + "\n", "utf-8");
fs.writeFileSync(esPath, JSON.stringify(esCatalog, null, 2) + "\n", "utf-8");

console.log(`i18n catalogs generated: ${toRel(frPath)}, ${toRel(enPath)}, ${toRel(esPath)}`);
