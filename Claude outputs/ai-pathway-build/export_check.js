const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ acceptDownloads: true });
  await p.goto("file:///home/claude/w/site-new/privacy-ai-assessment.html#tool-aipath");
  await p.waitForSelector("#paa-app .paa-questions");
  await p.locator('.paa-field[data-qid="name"] input').fill("Export test");
  await p.locator('.paa-field[data-qid="description"] textarea').fill("desc");
  for (let i = 0; i < 3; i++) await p.locator("#paa-app button", { hasText: /^(Next|See results)$/ }).last().click();
  await p.locator('.paa-field[data-qid="aipGenerates"] button', { hasText: "Yes" }).click();
  await p.locator('.paa-field[data-qid="aipEu"] select').selectOption("Yes");
  for (let i = 0; i < 25; i++) { const n = p.locator("#paa-app button", { hasText: /^(Next|See results)$/ }); if (!(await n.count())) break; await n.last().click(); }
  for (const [btn, f] of [["Download my answers (CSV)", "a.csv"], ["Download my answers (JSON)", "a.json"]]) {
    const [dl] = await Promise.all([p.waitForEvent("download"), p.locator("button", { hasText: btn }).click()]);
    await dl.saveAs(f);
  }
  const csv = fs.readFileSync("a.csv", "utf8"); const head = csv.split("\n")[0];
  console.log("CSV columns:", head.split(",").length, "has aipEu label:", /EU market/.test(head), "has gaiInjectionTested label:", /prompt injection/.test(head));
  const j = JSON.parse(fs.readFileSync("a.json", "utf8"));
  console.log("JSON entry:", j[0].moduleId, j[0].resultLabel, "coverage rows:", j[0].result.coverage.nist.length, j[0].result.coverage.iso.length, j[0].result.coverage.sg.length);
  // restore round trip
  await p.goto("file:///home/claude/w/site-new/privacy-ai-assessment.html"); await p.waitForTimeout(300);
  console.log("landing cards:", await p.locator(".paa-card").count(), "| last card:", (await p.locator(".paa-card h3").last().innerText()));
  await b.close();
})();
