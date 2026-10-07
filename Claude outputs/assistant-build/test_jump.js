/* Playwright check of the assistant on a local copy of the site.
   Serve the repo root first (python3 -m http.server 8765 from the repo root, with
   assets/assistant/index.json built) and run: node test_jump.js [base url] */
var pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/npm-tools/node_modules/playwright'); }
const { chromium } = pw;
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, serviceWorkers: 'block' });
  await ctx.addInitScript(() => { try { localStorage.setItem('cc-consent', JSON.stringify({ v: 1, ts: Date.now(), groups: { C0001: true, C0002: false, C0003: false } })); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(BASE + 'cookie-digest.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  // close some details groups to prove the jump opens them
  await page.evaluate(() => document.querySelectorAll('details.ck-group').forEach(d => d.open = false));
  await page.locator('.sa-launch').click();
  await page.waitForFunction(() => /Ready/.test(document.querySelector('.sa-status').textContent), null, { timeout: 15000 });
  await page.fill('.sa-input', 'google analytics without consent');
  await page.press('.sa-input', 'Enter');
  await page.waitForSelector('.sa-card');
  const titles = await page.locator('.sa-card .sa-title').allTextContents();
  console.log('results:', titles.slice(0, 4).map(t => t.trim().slice(0, 60)));
  const href = await page.locator('.sa-card .sa-title').first().getAttribute('href');
  await page.locator('.sa-card .sa-title').first().click();
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const id = location.hash.slice(1); const t = document.getElementById(id); const rect = t.getBoundingClientRect();
    const header = document.getElementById('header'); const hb = header ? header.getBoundingClientRect().bottom : 0;
    let p = t, closed = false; while (p) { if (p.tagName === 'DETAILS' && !p.open) closed = true; p = p.parentElement; }
    return { href: location.pathname + location.hash, top: Math.round(rect.top), headerBottom: Math.round(hb), closedAncestor: closed, flash: t.classList.contains('sa-flash'), panelHidden: document.querySelector('.sa-panel').hidden, focused: document.activeElement === t };
  });
  console.log('jump', href, JSON.stringify(r));
  await page.screenshot({ path: 'shot-jump.png' });
  // hash deep link on load into a closed details (simulates arriving from another page)
  await page.goto(BASE + 'edpb-digest.html', { waitUntil: 'load' });
  await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = false));
  const someId = await page.evaluate(() => { const d = document.querySelector('details:not([open]) article.ed-entry'); return d ? d.id : null; });
  await page.goto(BASE + 'edpb-digest.html#' + someId, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const r2 = await page.evaluate(() => { const t = document.getElementById(location.hash.slice(1)); let p = t, closed = false; while (p) { if (p.tagName === 'DETAILS' && !p.open) closed = true; p = p.parentElement; } return { id: t && t.id, closedAncestor: closed, top: Math.round(t.getBoundingClientRect().top) }; });
  console.log('load with hash', JSON.stringify(r2));
  // Escape closes, focus returns
  await page.locator('.sa-launch').click(); await page.keyboard.press('Escape');
  console.log('esc closes:', await page.locator('.sa-panel').isHidden(), 'focus on launcher:', await page.evaluate(() => document.activeElement.className));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
