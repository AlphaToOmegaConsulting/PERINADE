import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const outDir = path.join(root, "output", "i18n");

interface Finding {
  type: "shared_component_text" | "locale_file_mismatch" | "route_locale_mismatch";
  severity: "low" | "medium" | "high";
  file: string;
  detail: string;
  sample?: string;
}

const SHARED_COMPONENTS = [
  "src/components/sections/Contact.astro",
  "src/components/sections/Experience.astro",
  "src/components/domaine/TerroirSection.astro",
  "src/components/visits/BookingSection.astro",
  "src/components/shop/ShopHero.astro",
  "src/components/shop/ShopProductGrid.astro",
  "src/components/shop/ShopDomainSelection.astro",
  "src/components/shop/ShopCaseComposer.astro",
  "src/components/shop/ShopFinalCtaBand.astro",
  "src/components/shop/ShopFaq.astro"
];

const findings: Finding[] = [];

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

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf-8");
}

function toRel(absPath: string): string {
  return path.relative(root, absPath).split(path.sep).join("/");
}

function getMarkupSegment(astro: string): string {
  const frontmatterEnd = astro.indexOf("---", 3);
  const body = frontmatterEnd >= 0 ? astro.slice(frontmatterEnd + 3) : astro;
  const styleIndex = body.indexOf("<style");
  const scriptIndex = body.indexOf("<script");
  let cutoff = body.length;
  if (styleIndex >= 0) cutoff = Math.min(cutoff, styleIndex);
  if (scriptIndex >= 0) cutoff = Math.min(cutoff, scriptIndex);
  return body.slice(0, cutoff);
}

function collectHardcodedText(astro: string): string[] {
  const markup = getMarkupSegment(astro);
  const matches = Array.from(markup.matchAll(/>([^<{][^<]*)</g));
  return matches
    .map((m) => (m[1] || "").trim())
    .filter(Boolean)
    .filter((s) => !s.startsWith("{"))
    .filter((s) => !/^[\-–—•·\d\s]+$/.test(s));
}

for (const rel of SHARED_COMPONENTS) {
  const content = read(rel);
  const literals = collectHardcodedText(content);
  for (const literal of literals) {
    findings.push({
      type: "shared_component_text",
      severity: "medium",
      file: rel,
      detail: "Hardcoded UI text found in shared component.",
      sample: literal
    });
  }
}

const dataFiles = walk(path.join(srcDir, "data")).filter((f) => /-(fr|en|es)\.ts$/.test(f));
const englishLeakInFr = [/\bFrom airport\b/i, /\bTrain \+ transfer\b/i, /\bReady to Visit\b/i, /\bBook now\b/i, /\bMon\b.*\bTue\b/i, /\ben-US\b/];
const frenchLeakInEn = [/\bRéserver\b/i, /\bCréneau\b/i, /\bMois\b/i, /\bDemande\b/i];
const frenchLeakInEs = [/\bRéserver\b/i, /\bCréneau\b/i, /\bMois\b/i, /\bDemande\b/i];

for (const abs of dataFiles) {
  const rel = toRel(abs);
  const content = fs.readFileSync(abs, "utf-8");
  const locale = rel.endsWith("-fr.ts") ? "fr" : rel.endsWith("-en.ts") ? "en" : "es";
  const patterns = locale === "fr" ? englishLeakInFr : locale === "en" ? frenchLeakInEn : frenchLeakInEs;
  for (const pattern of patterns) {
    const hit = content.match(pattern);
    if (hit) {
      findings.push({
        type: "locale_file_mismatch",
        severity: "high",
        file: rel,
        detail: `Potential language mismatch in locale file (${locale}).`,
        sample: hit[0]
      });
    }
  }
}

const pageFiles = walk(path.join(srcDir, "pages")).filter((f) => f.endsWith(".astro"));
for (const abs of pageFiles) {
  const rel = toRel(abs);
  const content = fs.readFileSync(abs, "utf-8");
  let expectedLocale: "fr" | "en" | "es" = "fr";
  if (rel.includes("/pages/en/")) expectedLocale = "en";
  if (rel.includes("/pages/es/")) expectedLocale = "es";

  const localeMatch = content.match(/const locale = "(fr|en|es)";/);
  if (localeMatch && localeMatch[1] !== expectedLocale) {
    findings.push({
      type: "route_locale_mismatch",
      severity: "high",
      file: rel,
      detail: `Page path locale (${expectedLocale}) differs from declared locale (${localeMatch[1]}).`
    });
  }

  const canonicalMatch = content.match(/canonicalPath="([^"]+)"/);
  if (canonicalMatch) {
    const canonical = canonicalMatch[1];
    if (expectedLocale === "en" && !canonical.startsWith("/en")) {
      findings.push({
        type: "route_locale_mismatch",
        severity: "medium",
        file: rel,
        detail: `English page should have '/en' canonical path, found '${canonical}'.`
      });
    }
    if (expectedLocale === "es" && !canonical.startsWith("/es")) {
      findings.push({
        type: "route_locale_mismatch",
        severity: "medium",
        file: rel,
        detail: `Spanish page should have '/es' canonical path, found '${canonical}'.`
      });
    }
    if (expectedLocale === "fr" && (canonical.startsWith("/en") || canonical.startsWith("/es"))) {
      findings.push({
        type: "route_locale_mismatch",
        severity: "medium",
        file: rel,
        detail: `French/default page should not have '/en' or '/es' canonical path, found '${canonical}'.`
      });
    }
  }
}

const score = Math.max(0, 100 - findings.length * 4);

fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, "audit.json");
const mdPath = path.join(outDir, "audit.md");

const report = {
  generatedAt: new Date().toISOString(),
  score,
  totalFindings: findings.length,
  findings
};

fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2) + "\n", "utf-8");

const lines: string[] = [];
lines.push("# Language Audit");
lines.push("");
lines.push(`- Generated at: ${report.generatedAt}`);
lines.push(`- Score: ${score}/100`);
lines.push(`- Findings: ${findings.length}`);
lines.push("");

if (findings.length === 0) {
  lines.push("No language mismatches detected.");
} else {
  lines.push("## Findings");
  lines.push("");
  findings.forEach((finding, index) => {
    lines.push(`${index + 1}. [${finding.severity.toUpperCase()}] ${finding.type} in \`${finding.file}\``);
    lines.push(`   - ${finding.detail}`);
    if (finding.sample) {
      lines.push(`   - Sample: \`${finding.sample}\``);
    }
  });
}
lines.push("");
lines.push("Note: This audit is non-blocking by design.");

fs.writeFileSync(mdPath, lines.join("\n") + "\n", "utf-8");
console.log(`i18n audit generated: ${toRel(jsonPath)} and ${toRel(mdPath)}`);
process.exit(0);
