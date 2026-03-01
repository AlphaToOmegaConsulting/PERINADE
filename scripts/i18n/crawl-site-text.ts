import fs from "node:fs";
import path from "node:path";

type Locale = "fr" | "en" | "es";

type CrawlEntry = {
  id: string;
  locale: Locale;
  url: string;
  file: string;
  text: string;
};

const root = process.cwd();
const distDir = path.join(root, "dist");
const outDir = path.join(root, "output", "i18n");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function toRel(absPath: string): string {
  return path.relative(root, absPath).split(path.sep).join("/");
}

function inferUrl(absFile: string): string {
  const rel = path.relative(distDir, absFile).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}/`;
  if (rel.endsWith(".html")) return `/${rel.slice(0, -".html".length)}/`;
  return `/${rel}`;
}

function inferLocale(url: string): Locale {
  if (url.startsWith("/en/")) return "en";
  if (url.startsWith("/es/")) return "es";
  return "fr";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripNonVisible(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");
}

function extractTexts(html: string): string[] {
  const visibleHtml = stripNonVisible(html)
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|div|section|article|header|footer|main|nav|a|button|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "\n");

  const lines = decodeHtmlEntities(visibleHtml)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => line.length >= 2)
    .filter((line) => !/^[\d\s.,:;!?"'()\-_/]+$/.test(line));

  return Array.from(new Set(lines));
}

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run `npm run build` first.");
  process.exit(1);
}

const htmlFiles = walk(distDir).filter((file) => file.endsWith(".html"));
const entries: CrawlEntry[] = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf-8");
  const url = inferUrl(file);
  const locale = inferLocale(url);
  const texts = extractTexts(html);
  texts.forEach((text, index) => {
    entries.push({
      id: `${locale}:${url}:${index}`,
      locale,
      url,
      file: toRel(file),
      text
    });
  });
}

const byLocale = {
  fr: entries.filter((entry) => entry.locale === "fr"),
  en: entries.filter((entry) => entry.locale === "en"),
  es: entries.filter((entry) => entry.locale === "es")
};

const summary = {
  generatedAt: new Date().toISOString(),
  pages: htmlFiles.length,
  totalSegments: entries.length,
  byLocale: {
    fr: byLocale.fr.length,
    en: byLocale.en.length,
    es: byLocale.es.length
  }
};

fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, "site-text-crawl.json");
const csvPath = path.join(outDir, "site-text-crawl.csv");
const summaryPath = path.join(outDir, "site-text-crawl-summary.json");

const csvHeader = "id,locale,url,file,text\n";
const csvRows = entries.map((entry) => {
  const esc = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [esc(entry.id), esc(entry.locale), esc(entry.url), esc(entry.file), esc(entry.text)].join(",");
});

fs.writeFileSync(jsonPath, JSON.stringify(entries, null, 2) + "\n", "utf-8");
fs.writeFileSync(csvPath, csvHeader + csvRows.join("\n") + "\n", "utf-8");
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n", "utf-8");

console.log(`Text crawl generated:
- ${toRel(summaryPath)}
- ${toRel(jsonPath)}
- ${toRel(csvPath)}`);
