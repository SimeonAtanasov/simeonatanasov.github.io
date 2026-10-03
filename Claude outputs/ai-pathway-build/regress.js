// Regression: each existing tool run blank to its results on the baseline and the new file.
const { chromium } = require("playwright");
const MODS = ["privacy", "dpia", "lia", "ai", "incident", "tpsa", "fria", "genai", "tia"];
async function run(site, id, browser) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("file://" + site + "/privacy-ai-assessment.html#tool-" + id);
  await page.waitForSelector("#paa-app .paa-nav");
  for (let i = 0; i < 40; i++) {
    const btn = page.locator("#paa-app button", { hasText: /^(Next|See results)$/ }).last();
    if (!(await btn.count())) break;
    await btn.click();
  }
  const text = await page.locator("#paa-app").innerText();
  await page.close();
  return { text, errors };
}
(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  for (const id of MODS) {
    const a = await run("/home/claude/w/site-base", id, browser);
    const b = await run("/home/claude/w/site-new", id, browser);
    const strip = (t) => t.split("\n").filter((l) => !/AI Assessment Pathway/i.test(l)).join("\n").replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, "");
    const same = strip(a.text) === strip(b.text);
    if (!same || a.errors.length || b.errors.length) fail++;
    console.log(id.padEnd(9), same ? "identical" : "DIFFERENT", "len", a.text.length, b.text.length, "errors", a.errors.length, b.errors.length, b.errors.slice(0, 2));
    if (!same) {
      const al = strip(a.text).split("\n"), bl = strip(b.text).split("\n");
      for (let i = 0; i < Math.max(al.length, bl.length); i++) if (al[i] !== bl[i]) { console.log("  first diff at", i, JSON.stringify(al[i]), JSON.stringify(bl[i])); break; }
    }
  }
  await browser.close();
  console.log(fail ? fail + " FAIL" : "REGRESSION PASS (9 tools)");
})();
