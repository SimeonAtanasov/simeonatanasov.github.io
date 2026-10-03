// Drives the AI Assessment Pathway in Chromium with scenario answers, checks results,
// handovers, duplicate questions and horizontal overflow; screenshots at 1600 and 390.
const { chromium } = require("playwright");
const T = require("../build/harness.js")("/home/claude/w/assessment.new.js", null);
const S = require("../build/scenarios_full.js")(T);
const SITE = "file:///home/claude/w/site-new/privacy-ai-assessment.html#tool-aipath";
async function answerStep(page, a, seen) {
  const done = new Set();
  for (let pass = 0; pass < 30; pass++) {
    const qids = await page.$$eval("#paa-app .paa-questions .paa-field[data-qid]", (els) => els.map((e) => e.getAttribute("data-qid")));
    const next = qids.find((q) => !done.has(q));
    if (!next) break;
    done.add(next); seen.push(next);
    const v = a[next];
    if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) continue;
    const f = page.locator(`#paa-app .paa-field[data-qid="${next}"]`).first();
    if (await f.locator("select").count()) await f.locator("select").first().selectOption(v);
    else if (await f.locator(".paa-scale").count()) await f.locator(".paa-scale button", { hasText: new RegExp("^" + v + "$") }).click();
    else if (await f.locator(".paa-checklist").count()) { for (const o of v) await f.locator(".paa-checklist label", { hasText: o }).first().click(); }
    else if (await f.locator("textarea").count()) await f.locator("textarea").first().fill(v);
    else if (await f.locator("input[type=date]").count()) await f.locator("input[type=date]").first().fill(v);
    else if (await f.locator("input[type=text]").count()) await f.locator("input[type=text]").first().fill(v);
  }
}
(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  for (const id of ["public-body-fria", "gpai-provider", "no-eu", "genai-hiring"]) {
    const s = S.find((x) => x.id === id);
    for (const width of [1600, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(SITE);
      await page.waitForSelector("#paa-app .paa-questions");
      const seen = []; let steps = 0, overflow = 0;
      for (let i = 0; i < 30; i++) {
        if (!(await page.locator("#paa-app .paa-questions").count())) break;
        await answerStep(page, s.full, seen);
        const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (ow > 1) overflow = Math.max(overflow, ow);
        steps++;
        await page.locator("#paa-app button", { hasText: /^(Next|See results)$/ }).last().click();
      }
      const dupQ = seen.filter((q, i) => seen.indexOf(q) !== i);
      const text = await page.locator("#paa-app").innerText();
      const ow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (ow2 > 1) overflow = Math.max(overflow, ow2);
      await page.screenshot({ path: `aipath-${id}-${width}.png`, fullPage: true });
      const ok = !errors.length && !dupQ.length && /Risk register/.test(text) && /IMPACT LEVEL|Impact level/.test(text) && !overflow;
      if (!ok) fail++;
      console.log(id, width, "steps", steps, "questions", seen.length, "dup", dupQ, "errors", errors, "overflow", overflow, ok ? "OK" : "FAIL");
      if (width === 1600) console.log("   " + text.split("\n").filter((l) => /risk$|Impact level|EU AI Act:|Continue to/i.test(l)).slice(0, 8).join(" | "));
      if (id === "public-body-fria" && width === 1600) {
        await page.locator("button", { hasText: "Continue to the FRIA" }).click();
        await page.waitForSelector("#paa-app .paa-questions");
        const nm = await page.locator('.paa-field[data-qid="name"] input').inputValue();
        const dt = await page.locator('.paa-field[data-qid="deployerType"] select').inputValue();
        console.log("   FRIA handover: name =", JSON.stringify(nm), "deployerType =", dt);
        if (nm !== s.full.name || dt !== "Body governed by public law") { fail++; console.log("   FRIA seed FAIL"); }
        await page.goto(SITE.replace("#tool-aipath", "")); await page.waitForTimeout(300);
        const hist = await page.locator("#paa-app").innerText();
        console.log("   history row:", hist.split("\n").filter((l) => /Level III/.test(l)).slice(0, 1));
      }
      if (id === "gpai-provider" && width === 1600) {
        await page.locator("button", { hasText: "Continue to the Full DPIA" }).click();
        await page.waitForSelector("#paa-app .paa-questions");
        const nm = await page.locator('.paa-field[data-qid="name"] input').inputValue();
        console.log("   DPIA handover: name =", JSON.stringify(nm));
        if (nm !== s.full.name) { fail++; console.log("   DPIA seed FAIL"); }
      }
      await page.close();
    }
  }
  await browser.close();
  console.log(fail ? fail + " FAIL" : "PATHWAY UI PASS");
})();
