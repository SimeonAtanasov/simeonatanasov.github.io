// Full link and action audit of ai-act-digest.html with the site chrome (Playwright Chromium).
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error" && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  await p.goto("file:///tmp/sitetest/ai-act-digest.html");
  await p.waitForTimeout(600);
  const out = {};

  // 1. static link inventory
  out.links = await p.evaluate(() => {
    const all = [...document.querySelectorAll("a[href]")];
    const internal = all.filter((a) => a.getAttribute("href").startsWith("#"));
    const broken = internal.filter((a) => !document.getElementById(a.getAttribute("href").slice(1))).map((a) => a.getAttribute("href"));
    const ext = all.filter((a) => /^https?:/.test(a.getAttribute("href")));
    const extNoBlank = ext.filter((a) => a.target !== "_blank" || !/noopener/.test(a.rel)).length;
    const hosts = {};
    ext.forEach((a) => { const h = new URL(a.href).host; hosts[h] = (hosts[h] || 0) + 1; });
    const site = all.filter((a) => !a.getAttribute("href").startsWith("#") && !/^https?:|^mailto:/.test(a.getAttribute("href"))).map((a) => a.getAttribute("href"));
    return { total: all.length, internal: internal.length, brokenInternal: broken, external: ext.length, externalWithoutNoopenerBlank: extNoBlank, hosts, siteLinks: [...new Set(site)], entryTitleLinks: document.querySelectorAll(".ai-title a[href^='http']").length, entries: document.querySelectorAll(".ai-entry").length, recitalLinks: document.querySelectorAll(".ai-rec a").length };
  });

  // 2. every TOC link (grouped + flat) jumps to a visible entry; every toggle opens
  out.toc = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = { toggles: 0, toggleFail: [], links: 0, linkFail: [], overviewLink: null };
    const toc = document.getElementById("ai-toc");
    for (const btn of toc.querySelectorAll(".ai-toc-ch, .ai-toc-sec")) {
      btn.click(); res.toggles++;
      const sub = document.getElementById(btn.getAttribute("aria-controls"));
      if (!sub || sub.hidden || btn.getAttribute("aria-expanded") !== "true") res.toggleFail.push(btn.textContent.trim().slice(0, 40));
    }
    for (const l of toc.querySelectorAll(".ai-toc-link")) {
      res.links++;
      const id = l.getAttribute("data-target"); const t = document.getElementById(id);
      if (!t) { res.linkFail.push(id + " missing"); continue; }
      if (l.offsetParent === null) continue; // in the hidden flat view
      l.click(); await sleep(30);
      const r = t.getBoundingClientRect();
      const vis = t.offsetParent !== null && r.top >= -2 && r.top < window.innerHeight;
      if (!vis) res.linkFail.push(id + " top=" + Math.round(r.top) + " hidden=" + t.hidden);
    }
    document.getElementById("ai-toc-overview-link").click(); await sleep(50);
    res.overviewLink = Math.round(document.getElementById("ai-overview").getBoundingClientRect().top);
    return res;
  });

  // 3. flat view links
  await p.click('.ai-toc-view[data-view="flat"]');
  await p.waitForTimeout(200);
  out.flat = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = { links: 0, fail: [] };
    for (const l of document.querySelectorAll("#ai-toc-flat .ai-toc-link")) {
      res.links++; const t = document.getElementById(l.getAttribute("data-target"));
      l.click(); await sleep(20);
      const r = t.getBoundingClientRect();
      if (!(r.top >= -2 && r.top < window.innerHeight) || t.hidden) res.fail.push(l.getAttribute("data-target"));
    }
    return res;
  });
  await p.click('.ai-toc-view[data-view="grouped"]');

  // 4. copy link
  await p.evaluate(() => { const b = document.querySelector('button[aria-controls="ai-tsub-ch-2"]'); if (b.getAttribute("aria-expanded") !== "true") b.click(); });
  await p.hover('#ai-tsub-ch-2 .ai-toc-item');
  await p.click('#ai-tsub-ch-2 .ai-toc-copy');
  await p.waitForTimeout(300);
  out.copy = await p.evaluate(async () => { try { return await navigator.clipboard.readText(); } catch (e) { return "clipboard error " + e; } });
  out.copyExternal = await p.evaluate(() => document.querySelector('#ai-tsub-ch-2 .ai-toc-actions a').href);

  // 5. overview cards and part 2 jump list
  out.overview = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = { cards: 0, fail: [], jump: 0, jumpFail: [] };
    document.querySelectorAll(".ai-group").forEach((d) => { d.open = false; });
    for (const a of document.querySelectorAll(".ai-ov-item")) {
      res.cards++; const t = document.getElementById(a.getAttribute("href").slice(1));
      a.click(); await sleep(30);
      const d = t.tagName === "DETAILS" ? t : t.closest("details");
      const r = t.getBoundingClientRect();
      if (!d.open || !(r.top >= -2 && r.top < window.innerHeight) || t.offsetParent === null) res.fail.push(a.getAttribute("href") + " open=" + d.open + " top=" + Math.round(r.top));
    }
    document.querySelectorAll(".ai-group").forEach((d) => { d.open = false; });
    for (const a of document.querySelectorAll(".ai-index a")) {
      res.jump++; const t = document.getElementById(a.getAttribute("href").slice(1));
      a.click(); await sleep(30);
      const r = t.getBoundingClientRect();
      if (!t.open || !(r.top >= -2 && r.top < window.innerHeight)) res.jumpFail.push(a.getAttribute("href"));
    }
    return res;
  });

  // 6. recital buttons: cited ones show entries, uncited show none, second click clears
  out.recitals = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = { checked: 0, fail: [] };
    const shown = () => [...document.querySelectorAll(".ai-entry")].filter((e) => !e.hidden).length;
    const grid = document.querySelector(".ai-rec-grid-ov");
    for (const btn of grid.querySelectorAll(".ai-rec-btn")) {
      res.checked++;
      const n = btn.getAttribute("data-recital"), cited = !btn.classList.contains("ai-rec-none");
      btn.click(); await sleep(5);
      const s = shown(), on = btn.classList.contains("is-on");
      const expectPos = [...document.querySelectorAll(".ai-entry[data-recitals]")].filter((e) => e.getAttribute("data-recitals").split(" ").includes(n)).length;
      if (!on || s !== expectPos || (cited && s === 0) || (!cited && s !== 0)) res.fail.push(n + ": shown " + s + " expected " + expectPos);
      btn.click(); await sleep(5);
      if (shown() !== 190 || btn.classList.contains("is-on")) res.fail.push(n + " did not clear");
    }
    // side grid mirrors
    const side = document.querySelector("#ai-tsub-rec .ai-rec-btn[data-recital='5']");
    side.click(); await sleep(5); const s5 = shown(); side.click(); await sleep(5);
    res.sideGridRecital5 = s5;
    return res;
  });

  // 7. filters: every option of every select gives at least one entry; clear resets
  out.filters = await p.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const shown = () => [...document.querySelectorAll(".ai-entry")].filter((e) => !e.hidden).length;
    const res = { empty: [], counts: {} };
    for (const id of ["ai-part", "ai-role", "ai-date", "ai-omni"]) {
      const sel = document.getElementById(id);
      for (const o of sel.options) {
        if (!o.value) continue;
        sel.value = o.value; sel.dispatchEvent(new Event("change")); await sleep(5);
        res.counts[id + "=" + o.value] = shown();
        if (shown() === 0) res.empty.push(id + "=" + o.value);
      }
      sel.value = ""; sel.dispatchEvent(new Event("change"));
    }
    const q = document.getElementById("ai-q");
    q.value = "zzzz-nothing"; q.dispatchEvent(new Event("input")); await sleep(5);
    res.noMatch = shown() + " / clear visible " + !document.getElementById("ai-clear").hidden + " / hidden parts " + document.querySelectorAll(".ai-part[hidden]").length;
    document.getElementById("ai-clear").click(); await sleep(5);
    res.afterClear = shown() + " / q=" + JSON.stringify(q.value);
    q.value = "GPAI"; q.dispatchEvent(new Event("input")); await sleep(5); res.gpai = shown();
    document.getElementById("ai-clear").click();
    return res;
  });

  // 8. keyboard
  await p.keyboard.press("Control+K");
  out.ctrlK = await p.evaluate(() => document.activeElement.id);
  await p.keyboard.press("Escape");

  // 9. mobile drawer
  await p.setViewportSize({ width: 390, height: 800 });
  await p.waitForTimeout(300);
  out.mobile = {};
  await p.click("#ai-toc-open");
  await p.waitForTimeout(300);
  out.mobile.open = await p.evaluate(() => ({ open: document.getElementById("ai-toc").classList.contains("is-open"), backdrop: !document.getElementById("ai-toc-backdrop").hidden, left: Math.round(document.getElementById("ai-toc").getBoundingClientRect().left), bodyLocked: document.body.classList.contains("ai-toc-drawer") }));
  await p.click("#ai-toc-close");
  await p.waitForTimeout(300);
  out.mobile.afterClose = await p.evaluate(() => ({ open: document.getElementById("ai-toc").classList.contains("is-open"), backdrop: !document.getElementById("ai-toc-backdrop").hidden }));
  await p.click("#ai-toc-open"); await p.waitForTimeout(300);
  await p.mouse.click(380, 400); await p.waitForTimeout(300);
  out.mobile.backdropClose = await p.evaluate(() => !document.getElementById("ai-toc").classList.contains("is-open"));
  await p.click("#ai-toc-open"); await p.waitForTimeout(300);
  await p.keyboard.press("Escape"); await p.waitForTimeout(200);
  out.mobile.escClose = await p.evaluate(() => !document.getElementById("ai-toc").classList.contains("is-open"));
  await p.click("#ai-toc-open"); await p.waitForTimeout(300);
  await p.evaluate(() => { const b = document.querySelector('button[aria-controls="ai-tsub-ch-13"]'); if (b.getAttribute("aria-expanded") !== "true") b.click(); });
  await p.click('#ai-tsub-ch-13 a[data-target="art-113"]');
  await p.waitForTimeout(500);
  out.mobile.jump = await p.evaluate(() => ({ closed: !document.getElementById("ai-toc").classList.contains("is-open"), top: Math.round(document.getElementById("art-113").getBoundingClientRect().top), bodyW: document.body.scrollWidth }));
  await p.click("#ai-toc-open"); await p.waitForTimeout(300);
  await p.click("#ai-toc-search"); await p.waitForTimeout(300);
  out.mobile.search = await p.evaluate(() => ({ closed: !document.getElementById("ai-toc").classList.contains("is-open"), focus: document.activeElement.id }));

  // 10. header and footer links
  out.chrome = await p.evaluate(() => ({ nav: [...document.querySelectorAll("#header nav a")].map((a) => a.getAttribute("href")), footer: [...document.querySelectorAll("#footer a")].map((a) => a.getAttribute("href")), active: document.querySelector("#header nav a.active") && document.querySelector("#header nav a.active").textContent }));

  out.errors = errs;
  fs.writeFileSync("/home/claude/aia/audit.json", JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
