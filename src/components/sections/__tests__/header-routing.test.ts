import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const headerPath = path.resolve(currentDir, "../Header.astro");

describe("Header language routing", () => {
  it("does not persist the header across page transitions", () => {
    const source = readFileSync(headerPath, "utf8");

    expect(source).not.toContain("transition:persist");
  });
});
