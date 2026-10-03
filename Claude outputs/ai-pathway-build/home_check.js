const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); let fail = 0;
  for (const [w, h] of [[1600, 900], [1000, 800], [900, 800], [900, 560], [390, 844], [390, 640]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
    await p.goto("file:///home/claude/w/site-home/index.html");
    const sec = p.locator("section.spotlight-assessment", { has: p.locator(".image-tools-many") });
    await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const s = document.querySelector(".image-tools-many").closest("section"), img = s.querySelector(".image").getBoundingClientRect();
      const chips = [...s.querySelectorAll(".tool-chip")].map((c) => c.getBoundingClientRect());
      const out = chips.filter((c) => c.top < img.top - 1 || c.bottom > img.bottom + 1 || c.left < img.left - 1 || c.right > img.right + 1).length;
      return { n: chips.length, outside: out, overflow: document.documentElement.scrollWidth - window.innerWidth, img: [Math.round(img.width), Math.round(img.height)] };
    });
    const ok = r.n === 10 && !r.outside && r.overflow <= 0 && !errs.length;
    if (!ok) fail++;
    console.log(w + "x" + h, JSON.stringify(r), errs.length, ok ? "OK" : "FAIL");
    await sec.screenshot({ path: `home-card-${w}x${h}.png` });
    await p.close();
  }
  await b.close(); console.log(fail ? fail + " FAIL" : "HOME CARD PASS");
})();
