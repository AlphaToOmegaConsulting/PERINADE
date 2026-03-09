import { describe, it, expect } from "vitest";
import { buildVisitsJsonLd } from "../json-ld";

const mockVisites = [
  { data: { titre: "Visite standard", sousTitre: "L'expérience essentielle", prix: 15 } },
  { data: { titre: "Visite gourmande", sousTitre: "Visite + accord gourmand", prix: 25 } },
];

describe("buildVisitsJsonLd", () => {
  it("returns valid JSON string", () => {
    const result = buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("produces ItemList @type at top level", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    expect(data["@type"]).toBe("ItemList");
    expect(data["@context"]).toBe("https://schema.org");
  });

  it("includes all visites as itemListElement", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    expect(data.itemListElement).toHaveLength(2);
    expect(data.numberOfItems).toBe(2);
  });

  it("each item is a ListItem with an Event", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    const first = data.itemListElement[0];
    expect(first["@type"]).toBe("ListItem");
    expect(first.position).toBe(1);
    expect(first.item["@type"]).toBe("Event");
  });

  it("Event offers contain numeric price string (not XX,XX € format)", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    const offer1 = data.itemListElement[0].item.offers;
    const offer2 = data.itemListElement[1].item.offers;
    expect(offer1.price).toBe("15");
    expect(offer2.price).toBe("25");
    expect(offer1.priceCurrency).toBe("EUR");
    expect(offer1.price).not.toContain("€");
    expect(offer1.price).not.toContain(",");
  });

  it("uses the provided siteUrl in item urls", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    const event = data.itemListElement[0].item;
    expect(event.url).toContain("https://www.perinade.fr");
  });

  it("booking url appends #booking anchor", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    const offer = data.itemListElement[0].item.offers;
    expect(offer.url).toBe("https://www.perinade.fr/visites#booking");
  });

  it("handles empty visites array without error", () => {
    const result = buildVisitsJsonLd("https://www.perinade.fr", "/visites", []);
    const data = JSON.parse(result);
    expect(data.numberOfItems).toBe(0);
    expect(data.itemListElement).toHaveLength(0);
  });

  it("reflects event names from visites data", () => {
    const data = JSON.parse(buildVisitsJsonLd("https://www.perinade.fr", "/visites", mockVisites));
    expect(data.itemListElement[0].item.name).toBe("Visite standard");
    expect(data.itemListElement[1].item.name).toBe("Visite gourmande");
  });
});
