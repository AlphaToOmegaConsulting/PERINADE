/**
 * Parse a display-formatted price string to a decimal number string.
 * Handles "15,90 € TTC", "15.90 € incl. VAT", etc.
 * Returns "15.90" format suitable for Schema.org price fields.
 */
export function parsePriceToDecimal(value: string): string {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const [integer = "0", decimal = "00"] = normalized.split(".");
  return `${integer}.${decimal.padEnd(2, "0").slice(0, 2)}`;
}
