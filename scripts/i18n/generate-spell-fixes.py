#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

from langdetect import detect_langs
from spellchecker import SpellChecker


ROOT = Path(__file__).resolve().parents[2]
INPUT_PATH = ROOT / "output" / "i18n" / "site-text-crawl.json"
OUT_DIR = ROOT / "output" / "i18n"

LANG_MAP = {"fr": "fr", "en": "en", "es": "es"}
LANGTECT_MAP = {"fr": "fr", "en": "en", "es": "es"}

# Domain terms to never auto-correct.
PROTECTED_TERMS = {
    "aoc",
    "aop",
    "arnal",
    "aude",
    "balade",
    "blanc",
    "cabernet",
    "carignan",
    "perinade",
    "périnade",
    "cultiva",
    "carcassonne",
    "cave",
    "finca",
    "fondus",
    "franc",
    "fresquel",
    "fundidos",
    "gastos",
    "garriga",
    "grenache",
    "hve",
    "igp",
    "iva",
    "know-how",
    "languedoc",
    "merlot",
    "midi",
    "minervois",
    "noir",
    "pays",
    "prestige",
    "reserve",
    "réserve",
    "savour",
    "sauvignon",
    "syrah",
    "taninos",
    "tanins",
    "terroir",
    "ttc",
    "vat",
    "verdot",
    "viognier",
    "visitas",
    "visites",
    "favourite",
    "cuvée",
    "cuvées",
    "domain",
    "domaine",
    "rosé",
    "caveau",
    "vigneron",
    "vignerons",
}

WORD_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*")


@dataclass
class Entry:
    id: str
    locale: str
    url: str
    file: str
    text: str


def should_skip_word(word: str) -> bool:
    if len(word) <= 2:
        return True
    if word.lower() in PROTECTED_TERMS:
        return True
    if word.isupper() and len(word) > 1:
        return True
    if any(ch.isdigit() for ch in word):
        return True
    # Elisions and contractions are noisy for dictionary checks.
    if "'" in word:
        return True
    return False


def should_skip_entry(entry: Entry, primary_lang: str | None) -> bool:
    text = entry.text.strip()
    lowered = text.lower()
    if primary_lang is not None and primary_lang != LANGTECT_MAP[entry.locale]:
        return True
    if " · " in text and len(WORD_RE.findall(text)) <= 4:
        return True
    if " | " in text:
        return True
    if "page not found" in lowered or "página no encontrada" in lowered:
        return True
    return False


def confidence_score(original: str, corrected: str) -> float:
    return SequenceMatcher(None, original.lower(), corrected.lower()).ratio()


def preserves_inflection(original: str, suggestion: str) -> bool:
    original_lower = original.lower()
    suggestion_lower = suggestion.lower()
    if "-" in original_lower or "-" in suggestion_lower:
        return original_lower == suggestion_lower
    if original_lower.endswith("s") != suggestion_lower.endswith("s"):
        return False
    if original_lower.endswith(("es", "as", "os")) != suggestion_lower.endswith(("es", "as", "os")):
        return False
    if original_lower.endswith(("é", "ée", "és", "ées")) != suggestion_lower.endswith(("é", "ée", "és", "ées")):
        return False
    return True


def detect_primary_lang(text: str) -> str | None:
    try:
        scores = detect_langs(text)
    except Exception:
        return None
    if not scores:
        return None
    code = scores[0].lang
    if code.startswith("fr"):
        return "fr"
    if code.startswith("en"):
        return "en"
    if code.startswith("es"):
        return "es"
    return None


def main() -> int:
    if not INPUT_PATH.exists():
        raise SystemExit(f"Missing input: {INPUT_PATH}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    payload = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    entries: list[Entry] = [Entry(**item) for item in payload]

    spell = {
        locale: SpellChecker(language=lang_code) for locale, lang_code in LANG_MAP.items()
    }

    findings: list[dict[str, object]] = []
    by_locale = defaultdict(int)

    for entry in entries:
        if entry.locale not in spell:
            continue

        primary_lang = detect_primary_lang(entry.text)
        if should_skip_entry(entry, primary_lang):
            continue

        current_spell = spell[entry.locale]
        words = WORD_RE.findall(entry.text)
        candidate_words = [w for w in words if not should_skip_word(w)]
        if len(candidate_words) < 2:
            continue
        unknown = current_spell.unknown([w.lower() for w in candidate_words])

        if not unknown:
            continue

        if len(unknown) > 2 or len(unknown) / len(candidate_words) > 0.2:
            continue

        segment_fixes = []
        for word in candidate_words:
            lower = word.lower()
            if lower not in unknown:
                continue
            suggestion = current_spell.correction(lower)
            if not suggestion or suggestion == lower:
                continue
            confidence = confidence_score(lower, suggestion)
            if confidence < 0.9:
                continue
            if suggestion.lower() in PROTECTED_TERMS:
                continue
            if not preserves_inflection(lower, suggestion):
                continue
            segment_fixes.append((word, suggestion, confidence))

        if not segment_fixes:
            continue

        proposed_text = entry.text
        for word, suggestion, _confidence in segment_fixes:
            replacement = suggestion.capitalize() if word[:1].isupper() else suggestion
            proposed_text = re.sub(
                rf"\b{re.escape(word)}\b", replacement, proposed_text, count=1
            )

        mismatch = False

        for word, suggestion, confidence in segment_fixes:
            findings.append(
                {
                    "id": entry.id,
                    "locale": entry.locale,
                    "url": entry.url,
                    "file": entry.file,
                    "text": entry.text,
                    "issue_word": word,
                    "suggestion": suggestion,
                    "proposed_text": proposed_text,
                    "confidence": round(confidence, 3),
                    "language_mismatch": mismatch,
                }
            )
            by_locale[entry.locale] += 1

    json_path = OUT_DIR / "spell-fixes.json"
    csv_path = OUT_DIR / "spell-fixes.csv"
    summary_path = OUT_DIR / "spell-fixes-summary.json"

    json_path.write_text(json.dumps(findings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    with csv_path.open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(
            fp,
            fieldnames=[
                "id",
                "locale",
                "url",
                "file",
                "text",
                "issue_word",
                "suggestion",
                "proposed_text",
                "confidence",
                "language_mismatch",
            ],
        )
        writer.writeheader()
        writer.writerows(findings)

    summary = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "totalFindings": len(findings),
        "byLocale": dict(by_locale),
        "outputJson": str(json_path.relative_to(ROOT)),
        "outputCsv": str(csv_path.relative_to(ROOT)),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Spell fixes generated:\n- {summary_path.relative_to(ROOT)}\n- {json_path.relative_to(ROOT)}\n- {csv_path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
