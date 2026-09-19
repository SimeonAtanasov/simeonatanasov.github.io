const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const w of [1280, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    p.on("pageerror", (e) => errs.push(String(e)));
    p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    await p.goto("file:///tmp/sitetest/ai-act-digest.html");
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null).length;
      const cs = getComputedStyle(document.querySelector("#ai-q"));
      return {
        entries: vis(".ai-entry"), groups: vis(".ai-group"), parts: vis(".ai-part"),
        count: document.querySelector(".ai-count") && document.querySelector(".ai-count").textContent,
        inputBg: cs.backgroundColor, inputColor: cs.color,
        navActive: document.querySelector("nav a.active, #nav a.active, header a.active") && document.querySelector("nav a.active, #nav a.active, header a.active").textContent,
        bodyW: document.body.scrollWidth,
      };
    });
    console.log(w, JSON.stringify(info));
    await p.screenshot({ path: `/home/claude/aia/shot-${w}.png`, fullPage: false });
    if (w === 1280) {
      // filters
      await p.fill("#ai-q", "biometric");
      await p.waitForTimeout(300);
      let r = await p.evaluate(() => ({ e: [...document.querySelectorAll(".ai-entry")].filter((x) => x.offsetParent !== null).length, c: document.querySelector(".ai-count").textContent }));
      console.log("search biometric", JSON.stringify(r));
      await p.fill("#ai-q", "");
      await p.selectOption("#ai-part", "regulation");
      await p.selectOption("#ai-role", "deployer");
      await p.waitForTimeout(300);
      r = await p.evaluate(() => ({ e: [...document.querySelectorAll(".ai-entry")].filter((x) => x.offsetParent !== null).length, parts: [...document.querySelectorAll(".ai-part")].filter((x) => x.offsetParent !== null).length, c: document.querySelector(".ai-count").textContent }));
      console.log("part=regulation role=deployer", JSON.stringify(r));
      await p.selectOption("#ai-part", "");
      await p.selectOption("#ai-role", "");
      await p.selectOption("#ai-omni", "yes");
      await p.waitForTimeout(300);
      r = await p.evaluate(() => ({ e: [...document.querySelectorAll(".ai-entry")].filter((x) => x.offsetParent !== null).length, c: document.querySelector(".ai-count").textContent }));
      console.log("omnibus=yes", JSON.stringify(r));
      await p.selectOption("#ai-omni", "");
      const opts = await p.evaluate(() => [...document.querySelectorAll("#ai-date option")].map((o) => o.value));
      console.log("date options", JSON.stringify(opts));
      if (opts.length > 1) {
        await p.selectOption("#ai-date", opts[1]);
        await p.waitForTimeout(300);
        r = await p.evaluate(() => ({ e: [...document.querySelectorAll(".ai-entry")].filter((x) => x.offsetParent !== null).length, c: document.querySelector(".ai-count").textContent }));
        console.log("date=" + opts[1], JSON.stringify(r));
        await p.selectOption("#ai-date", "");
      }
      // open first group and screenshot
      await p.evaluate(() => { const d = document.querySelector(".ai-group"); if (d) d.open = true; });
      await p.evaluate(() => document.querySelector(".ai-group").scrollIntoView());
      await p.waitForTimeout(200);
      await p.screenshot({ path: `/home/claude/aia/shot-open.png`, fullPage: false });
    }
    await p.close();
  }
  console.log("errors", JSON.stringify(errs));
  await b.close();
})();
