// Render and behaviour test for ai-act-digest.html with the site chrome, in Playwright Chromium.
const { chromium } = require("playwright");
const vis = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].filter((e) => e.offsetParent !== null).length`;
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const w of [1280, 1024, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    p.on("pageerror", (e) => errs.push(w + ": " + String(e)));
    p.on("console", (m) => { if (m.type() === "error" && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(w + ": " + m.text()); });
    await p.goto("file:///tmp/sitetest/ai-act-digest.html");
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null).length;
      const toc = document.getElementById("ai-toc");
      const cs = getComputedStyle(toc);
      return {
        entries: vis(".ai-entry"), groups: vis(".ai-group"), tocVisible: toc.offsetParent !== null, tocPos: cs.position, tocX: toc.getBoundingClientRect().left,
        fab: vis(".ai-toc-fab"), recBtns: document.querySelectorAll(".ai-rec-btn").length, flatItems: document.querySelectorAll("#ai-toc-flat .ai-toc-item").length,
        ovItems: document.querySelectorAll(".ai-ov-item").length, bodyW: document.body.scrollWidth, count: document.getElementById("ai-count-text").textContent,
        mainW: document.querySelector(".ai-main").getBoundingClientRect().width,
      };
    });
    console.log(w, JSON.stringify(info));
    await p.screenshot({ path: `/home/claude/aia/shot-${w}.png` });
    if (w === 1280) {
      // open chapter III in toc, then section 2
      await p.click('button[aria-controls="ai-tsub-ch-3"]');
      await p.click('button[aria-controls="ai-tsub-ch-3-s2"]');
      await p.waitForTimeout(200);
      let r = await p.evaluate(() => ({ sub: document.getElementById("ai-tsub-ch-3").hidden, s2: document.getElementById("ai-tsub-ch-3-s2").hidden, links: [...document.querySelectorAll('#ai-tsub-ch-3-s2 .ai-toc-link')].map((l) => l.textContent).slice(0, 2) }));
      console.log("toc chapter III / section 2", JSON.stringify(r));
      // click Article 10 link, expect scroll + active
      await p.click('#ai-tsub-ch-3-s2 a[data-target="art-10"]');
      await p.waitForTimeout(700);
      r = await p.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById("art-10").getBoundingClientRect().top), active: [...document.querySelectorAll(".ai-toc-link.is-active")].map((l) => l.textContent) }));
      console.log("jump art-10", JSON.stringify(r));
      await p.screenshot({ path: `/home/claude/aia/shot-art10.png` });
      // scroll to article 55 and check scrollspy
      await p.evaluate(() => document.getElementById("art-55").scrollIntoView({ block: "start" }));
      await p.waitForTimeout(600);
      r = await p.evaluate(() => ({ active: [...document.querySelectorAll(".ai-toc-link.is-active")].map((l) => l.textContent), chV: document.getElementById("ai-tsub-ch-5").hidden }));
      console.log("scrollspy art-55", JSON.stringify(r));
      // flat view
      await p.click('.ai-toc-view[data-view="flat"]');
      await p.waitForTimeout(200);
      r = await p.evaluate(() => ({ grouped: document.getElementById("ai-toc-grouped").hidden, flat: document.getElementById("ai-toc-flat").hidden, n: [...document.querySelectorAll("#ai-toc-flat .ai-toc-item")].filter((e) => e.offsetParent !== null).length, first: document.querySelector("#ai-toc-flat .ai-toc-link").textContent, last: [...document.querySelectorAll("#ai-toc-flat .ai-toc-link")].pop().textContent, activeFlat: [...document.querySelectorAll("#ai-toc-flat .ai-toc-link.is-active")].length }));
      console.log("flat view", JSON.stringify(r));
      await p.screenshot({ path: `/home/claude/aia/shot-flat.png` });
      await p.click('.ai-toc-view[data-view="grouped"]');
      // recital filter from overview grid
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.click('.ai-rec-grid-ov .ai-rec-btn[data-recital="12"]');
      await p.waitForTimeout(400);
      r = await p.evaluate(() => ({ shown: [...document.querySelectorAll(".ai-entry")].filter((e) => !e.hidden).length, count: document.getElementById("ai-count-text").textContent, clear: !document.getElementById("ai-clear").hidden, on: document.querySelectorAll(".ai-rec-btn.is-on").length, hiddenLinks: document.querySelectorAll(".ai-toc-link.is-hidden").length }));
      console.log("recital 12", JSON.stringify(r));
      await p.screenshot({ path: `/home/claude/aia/shot-recital.png` });
      // click a filtered-out toc link: should clear filters and jump
      await p.evaluate(() => { const b = document.querySelector('button[aria-controls="ai-tsub-ch-1"]'); if (b.getAttribute("aria-expanded") !== "true") b.click(); });
      await p.click('#ai-tsub-ch-1 a[data-target="art-4a"]');
      await p.waitForTimeout(500);
      r = await p.evaluate(() => ({ shown: [...document.querySelectorAll(".ai-entry")].filter((e) => !e.hidden).length, top: Math.round(document.getElementById("art-4a").getBoundingClientRect().top), on: document.querySelectorAll(".ai-rec-btn.is-on").length }));
      console.log("click filtered link art-4a", JSON.stringify(r));
      // Ctrl+K focuses search
      await p.keyboard.press("Control+K");
      await p.waitForTimeout(300);
      r = await p.evaluate(() => document.activeElement && document.activeElement.id);
      console.log("ctrl+k focus", r);
      // filters still work
      await p.fill("#ai-q", "biometric");
      await p.waitForTimeout(300);
      r = await p.evaluate(() => document.getElementById("ai-count-text").textContent);
      console.log("search biometric:", r);
      await p.click("#ai-clear");
      await p.selectOption("#ai-omni", "yes");
      await p.waitForTimeout(300);
      r = await p.evaluate(() => document.getElementById("ai-count-text").textContent);
      console.log("omnibus:", r);
      // overview screenshot
      await p.selectOption("#ai-omni", "");
      await p.evaluate(() => document.getElementById("ai-overview").scrollIntoView());
      await p.waitForTimeout(300);
      await p.screenshot({ path: `/home/claude/aia/shot-overview.png` });
    }
    if (w === 390) {
      await p.click("#ai-toc-open");
      await p.waitForTimeout(400);
      let r = await p.evaluate(() => { const t = document.getElementById("ai-toc"); const rr = t.getBoundingClientRect(); return { open: t.classList.contains("is-open"), left: Math.round(rr.left), width: Math.round(rr.width), closeVisible: document.getElementById("ai-toc-close").offsetParent !== null }; });
      console.log("drawer open", JSON.stringify(r));
      await p.screenshot({ path: `/home/claude/aia/shot-drawer.png` });
      await p.evaluate(() => { const b = document.querySelector('button[aria-controls="ai-tsub-ch-12"]'); if (b.getAttribute("aria-expanded") !== "true") b.click(); });
      await p.click('#ai-tsub-ch-12 a[data-target="art-99"]');
      await p.waitForTimeout(600);
      r = await p.evaluate(() => ({ open: document.getElementById("ai-toc").classList.contains("is-open"), top: Math.round(document.getElementById("art-99").getBoundingClientRect().top), bodyW: document.body.scrollWidth }));
      console.log("drawer jump art-99", JSON.stringify(r));
      await p.screenshot({ path: `/home/claude/aia/shot-390-art99.png` });
    }
    await p.close();
  }
  console.log("errors", JSON.stringify(errs));
  await b.close();
})();
