/* Playwright check of the live suggestions. Serve the repo root first
   (python3 -m http.server 8765) and run: node test_suggest_ui.js [base url] */
var pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/npm-tools/node_modules/playwright'); }
const { chromium } = pw;
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const browser = await chromium.launch();
  for (const vp of [{ w: 1600, h: 900 }, { w: 390, h: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, serviceWorkers: 'block' });
    await ctx.addInitScript(() => { try { localStorage.setItem('cc-consent', JSON.stringify({ v: 1, ts: Date.now(), groups: { C0001: true } })); } catch (e) {} });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await page.goto(BASE + 'ai-act-digest.html', { waitUntil: 'load' });
    await page.locator('.sa-launch').click();
    await page.waitForFunction(() => /Ready/.test(document.querySelector('.sa-status').textContent), null, { timeout: 20000 });
    const status = await page.locator('.sa-status').textContent();
    await page.type('.sa-input', 'prov', { delay: 30 });
    await page.waitForSelector('.sa-suggest:not([hidden]) li');
    const first = await page.locator('.sa-suggest li .sa-suggest-q').allTextContents();
    await page.type('.sa-input', 'ider obligations', { delay: 20 });
    await page.waitForTimeout(200);
    const second = await page.locator('.sa-suggest li .sa-suggest-q').allTextContents();
    await page.screenshot({ path: 'shot-suggest-' + vp.w + '.png' });
    await page.keyboard.press('ArrowDown');
    const active = await page.evaluate(() => ({ activeId: document.querySelector('.sa-input').getAttribute('aria-activedescendant'), expanded: document.querySelector('.sa-input').getAttribute('aria-expanded') }));
    await page.keyboard.press('Enter');
    await page.waitForSelector('.sa-card');
    const picked = await page.evaluate(() => ({ input: document.querySelector('.sa-input').value, firstBadge: (document.querySelector('.sa-card .sa-best') || {}).textContent || null, firstTitle: document.querySelector('.sa-card .sa-title').textContent.trim().slice(0, 70), listHidden: document.querySelector('.sa-suggest').hidden, cards: document.querySelectorAll('.sa-card').length }));
    // escape hides only the list first
    await page.fill('.sa-input', ''); await page.type('.sa-input', 'cookie', { delay: 20 }); await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
    const afterEsc = await page.evaluate(() => ({ listHidden: document.querySelector('.sa-suggest').hidden, panelHidden: document.querySelector('.sa-panel').hidden }));
    // click a suggestion with the mouse
    await page.type('.sa-input', ' ban', { delay: 20 }); await page.waitForTimeout(200);
    const clickText = await page.locator('.sa-suggest li').nth(1).locator('.sa-suggest-q').textContent();
    await page.locator('.sa-suggest li').nth(1).click();
    await page.waitForTimeout(200);
    const afterClick = await page.evaluate(() => ({ input: document.querySelector('.sa-input').value, badge: (document.querySelector('.sa-card .sa-best') || {}).textContent || null, scrollW: document.documentElement.scrollWidth }));
    console.log(vp.w, '|', status, '\n  prov ->', first.length, first.slice(0, 2), '\n  provider obligations ->', second.length, second.slice(0, 2), '\n  arrow:', JSON.stringify(active), '\n  enter:', JSON.stringify(picked), '\n  esc:', JSON.stringify(afterEsc), '\n  click:', clickText.slice(0, 50), '->', JSON.stringify(afterClick), errors.length ? '\n  ERRORS ' + errors.join(';') : '');
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
