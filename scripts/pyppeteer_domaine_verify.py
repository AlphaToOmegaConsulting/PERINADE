import asyncio
import json
import os
from pathlib import Path
from datetime import datetime
from pyppeteer import launch
from pyppeteer.errors import NetworkError

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:4330/domaine")
OUT_ROOT = Path("output/pyppeteer")
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
OUT_DIR = OUT_ROOT / f"domaine-{STAMP}"
CHROME_EXECUTABLE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 2200},
    "tablet": {"width": 1024, "height": 2000},
    "mobile": {"width": 390, "height": 2400},
}

async def collect_image_audit(page):
    return await page.evaluate('''() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img, i) => ({
        index: i,
        src: img.currentSrc || img.src,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        broken: !img.complete || img.naturalWidth === 0
      }));
    }''')

async def warmup_lazy_content(page):
    await page.evaluate(
        """async () => {
          const total = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
          const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
          for (let y = 0; y <= total; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 80));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 250));
        }"""
    )

    await page.evaluate(
        """() => Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 3000);
            });
          })
        )"""
    )


async def capture_for_viewport(browser, name, viewport):
    page = await browser.newPage()
    await page.setViewport(viewport)
    await page.goto(BASE_URL, {"waitUntil": "networkidle2", "timeout": 120000})
    await asyncio.sleep(1.0)
    for _ in range(3):
        try:
            await warmup_lazy_content(page)
            break
        except NetworkError:
            await page.waitFor(500)

    await page.screenshot({"path": str(OUT_DIR / f"{name}-full.png"), "fullPage": True})

    # Hero
    hero = await page.querySelector(".domaine-hero")
    if hero:
      box = await hero.boundingBox()
      if box:
        await page.screenshot({
          "path": str(OUT_DIR / f"{name}-hero.png"),
          "clip": {
            "x": max(box["x"], 0),
            "y": max(box["y"], 0),
            "width": min(box["width"], viewport["width"]),
            "height": min(box["height"], viewport["height"]),
          }
        })

    # Timeline section
    timeline = await page.querySelector(".timeline")
    if timeline:
      await timeline.screenshot({"path": str(OUT_DIR / f"{name}-timeline.png")})

    # Tabs interaction (mainly desktop/tablet)
    tab_shots = []
    tab_labels = await page.evaluate('''() => {
      const tabs = Array.from(document.querySelectorAll('[data-timeline-tabs] [data-tab-id]'));
      return tabs.map(t => ({ id: t.getAttribute('data-tab-id'), label: t.textContent.trim() }));
    }''')

    for t in tab_labels:
      selector = f"[data-timeline-tabs] [data-tab-id=\"{t['id']}\"]"
      btn = await page.querySelector(selector)
      if not btn:
        continue
      await btn.click()
      await asyncio.sleep(0.3)
      active = await page.evaluate('''() => {
        const panel = document.querySelector('[data-timeline-tabs] .timeline-panel.is-active');
        if (!panel) return null;
        const h = panel.querySelector('h3');
        const p = panel.querySelector('p');
        return {
          panelId: panel.getAttribute('data-panel-id'),
          title: h ? h.textContent.trim() : '',
          detail: p ? p.textContent.trim() : ''
        };
      }''')
      shot_path = OUT_DIR / f"{name}-timeline-tab-{t['id']}.png"
      if timeline:
        await timeline.screenshot({"path": str(shot_path)})
      tab_shots.append({"tab": t, "activePanel": active, "screenshot": str(shot_path)})

    # Hero CTA href + contact CTA href check
    cta_links = await page.evaluate('''() => {
      const heroPrimary = document.querySelector('.domaine-hero__cta-primary');
      const heroSecondary = document.querySelector('.domaine-hero__cta-secondary');
      const contactBtn = Array.from(document.querySelectorAll('a,button')).find(el => (el.textContent || '').toLowerCase().includes('nous contacter'));
      return {
        heroPrimaryHref: heroPrimary && heroPrimary.tagName === 'A' ? heroPrimary.getAttribute('href') : null,
        heroSecondaryHref: heroSecondary && heroSecondary.tagName === 'A' ? heroSecondary.getAttribute('href') : null,
        contactHref: contactBtn && contactBtn.tagName === 'A' ? contactBtn.getAttribute('href') : null,
      }
    }''')

    image_audit = await collect_image_audit(page)

    await page.close()
    return {
      "viewport": name,
      "ctaLinks": cta_links,
      "tabs": tab_shots,
      "images": image_audit,
    }


async def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    browser = await launch(
      headless=True,
      executablePath=CHROME_EXECUTABLE,
      args=[
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    )

    results = []
    try:
      for name, viewport in VIEWPORTS.items():
        res = await capture_for_viewport(browser, name, viewport)
        results.append(res)
    finally:
      await browser.close()

    report = {
      "baseUrl": BASE_URL,
      "outputDir": str(OUT_DIR.resolve()),
      "results": results,
    }

    report_path = OUT_DIR / "report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    # Human-readable summary
    lines = []
    lines.append(f"Output: {OUT_DIR.resolve()}")
    for res in results:
      broken = [img for img in res["images"] if img["broken"]]
      lines.append(f"[{res['viewport']}] images: {len(res['images'])}, broken: {len(broken)}")
      links = res["ctaLinks"]
      lines.append(f"[{res['viewport']}] heroPrimary={links['heroPrimaryHref']} heroSecondary={links['heroSecondaryHref']} contact={links['contactHref']}")
      if res["tabs"]:
        lines.append(f"[{res['viewport']}] tabs screenshots: {len(res['tabs'])}")

    summary_path = OUT_DIR / "summary.txt"
    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))


if __name__ == "__main__":
    asyncio.run(main())
