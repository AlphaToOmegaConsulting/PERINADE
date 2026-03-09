import { describe, it, expect } from "vitest";
import { parsePriceToDecimal } from "../price";

describe("parsePriceToDecimal", () => {
  it("parses French comma-decimal format", () => {
    expect(parsePriceToDecimal("25,00 € TTC")).toBe("25.00");
  });

  it("parses simple integer price", () => {
    expect(parsePriceToDecimal("15 €")).toBe("15.00");
  });

  it("parses dot-decimal format", () => {
    expect(parsePriceToDecimal("15.90 € incl. VAT")).toBe("15.90");
  });

  it("parses zero price", () => {
    expect(parsePriceToDecimal("0 €")).toBe("0.00");
  });

  it("returns decimal string with exactly 2 decimal places", () => {
    const result = parsePriceToDecimal("79,00 € TTC");
    expect(result).toBe("79.00");
    expect(result.split(".")[1]).toHaveLength(2);
  });

  it("does not include currency symbols in output", () => {
    expect(parsePriceToDecimal("158,00 € TTC")).not.toContain("€");
    expect(parsePriceToDecimal("158,00 € TTC")).not.toContain("TTC");
  });
});
