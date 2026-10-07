/* Playwright check of the assistant on a local copy of the site.
   Serve the repo root first (python3 -m http.server 8765 from the repo root, with
   assets/assistant/index.json built) and run: node test_ui.js [base url] */
var pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/npm-tools/node_modules/playwright'); }
const { chromium } = pw;
const fs = require('fs');
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const browser = await chromium.launch();
  const report = [];
  const pages = ['edpb-digest.html', 'privacy-ai-assessment.html', 'gdpr-readiness.html', 'index.html', 'gdpr-enforcement.html', 'risk-matrix-original.html', 'practical-privacy.html', 'ai-governance-crosswalk.html'];
  for (const vp of [{ w: 1600, h: 900 }, { w: 1000, h: 800 }, { w: 390, h: 844 }]) {
    for (const p of pages) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, serviceWorkers: 'block' });
      await ctx.addInitScript(() => { try { localStorage.setItem('cc-consent', JSON.stringify({ v: 1, ts: Date.now(), groups: { C0001: true, C0002: false, C0003: false } })); } catch (e) {} });
      const page = await ctx.newPage();
      const errors = [], requests = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      page.on('request', r => requests.push(r.url()));
      await page.goto(BASE + p, { waitUntil: 'load' });
      await page.waitForTimeout(600);
      const launcher = page.locator('.sa-launch');
      const lb = await launcher.boundingBox();
      // scroll so the Top button appears, then measure overlaps with other fixed controls
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(500);
      const overlap = await page.evaluate(() => {
        const l = document.querySelector('.sa-launch').getBoundingClientRect();
        const out = [];
        document.querySelectorAll('button, a.button, [role=button]').forEach(el => {
          if (el.classList.contains('sa-launch')) return;
          const cs = getComputedStyle(el); if (cs.position !== 'fixed' || cs.display === 'none') return;
          const r = el.getBoundingClientRect(); if (r.width === 0) return;
          const hit = !(r.right < l.left || r.left > l.right || r.bottom < l.top || r.top > l.bottom);
          out.push({ id: el.id || el.className, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], hit });
        });
        return { launcher: [Math.round(l.left), Math.round(l.top), Math.round(l.width), Math.round(l.height)], others: out };
      });
      const hits = overlap.others.filter(o => o.hit);
      report.push({ vp: vp.w, page: p, launcher: overlap.launcher, fixed: overlap.others.map(o => o.id + '@' + o.rect.join(',')).join(' | '), overlaps: hits.map(h => h.id), errors });
      // open, search, check results and panel geometry
      await launcher.click();
      await page.waitForSelector('.sa-panel:not([hidden])');
      await page.waitForFunction(() => /Ready|entries/.test(document.querySelector('.sa-status').textContent), null, { timeout: 15000 });
      await page.fill('.sa-input', 'cookie consent rules in germany');
      await page.press('.sa-input', 'Enter');
      await page.waitForSelector('.sa-card');
      const n = await page.locator('.sa-card').count();
      const first = await page.locator('.sa-card .sa-title').first().textContent();
      const pb = await page.locator('.sa-panel').boundingBox();
      const docW = await page.evaluate(() => document.documentElement.scrollWidth);
      report[report.length - 1].search = { n, first: first.trim().slice(0, 70), panel: [Math.round(pb.x), Math.round(pb.y), Math.round(pb.width), Math.round(pb.height)], scrollWidth: docW, viewport: vp.w };
      report[report.length - 1].external = requests.filter(u => !u.startsWith(BASE)).slice(0, 5);
      if (vp.w === 1600 && p === 'edpb-digest.html') {
        await page.screenshot({ path: 'shot-desktop-results.png' });
        // same-page deep link: click the first result and check the hash and a flash
        await page.locator('.sa-card .sa-title').first().click();
        await page.waitForTimeout(400);
        report[report.length - 1].jump = { hash: await page.evaluate(() => location.hash), panelHidden: await page.locator('.sa-panel').isHidden(), flashed: await page.evaluate(() => !!document.querySelector('.sa-flash')) };
      }
      if (vp.w === 390 && p === 'privacy-ai-assessment.html') {
        await page.screenshot({ path: 'shot-phone-results.png' });
        await page.locator('.sa-chip-finder').click();
        await page.locator('.sa-option', { hasText: 'An AI system' }).click();
        await page.locator('.sa-option', { hasText: 'generative' }).click();
        const rec = await page.locator('.sa-finder h3').textContent();
        report[report.length - 1].finder = rec;
        await page.screenshot({ path: 'shot-phone-finder.png' });
      }
      if (vp.w === 1000 && p === 'index.html') await page.screenshot({ path: 'shot-home-1000.png' });
      if (vp.w === 1000 && p === 'edpb-digest.html') await page.screenshot({ path: 'shot-edpb-1000.png' });
      await ctx.close();
    }
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(BASE + 'edpb-digest.html', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const withBanner = await page.evaluate(() => ({ banner: !!document.querySelector('.cc-banner'), launcherHidden: document.querySelector('.sa-launch').hidden }));
    await page.locator('.cc-banner button', { hasText: /reject|decline|necessary/i }).first().click();
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => ({ banner: !!document.querySelector('.cc-banner'), launcherHidden: document.querySelector('.sa-launch').hidden }));
    console.log('banner test:', JSON.stringify(withBanner), '->', JSON.stringify(after));
    await ctx.close();
  }
  fs.writeFileSync('report.json', JSON.stringify(report, null, 1));
  for (const r of report) console.log(r.vp, r.page, 'launcher', r.launcher.join(','), 'overlaps:', r.overlaps.join(',') || 'none', '| results', r.search.n, '|', r.search.first, '| panel', r.search.panel.join(','), 'scrollW', r.search.scrollWidth, r.errors.length ? '| ERRORS ' + r.errors.join(' ; ') : '', r.external.length ? '| EXTERNAL ' + r.external.join(' ') : '', r.jump ? '| jump ' + JSON.stringify(r.jump) : '', r.finder ? '| finder ' + r.finder : '');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
