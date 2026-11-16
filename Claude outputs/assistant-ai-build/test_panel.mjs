/*
	Playwright test of the Ask panel with AI answers (SA-02).

	Needs two site copies served locally and the test stand:
	  python3 -m http.server 8765 --directory <patched copy>     (apply_sa02.py --test)
	  python3 -m http.server 8766 --directory <unpatched copy>
	  node test_stack.mjs <patched copy>

	  node test_panel.mjs [screenshot folder]
*/
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch (e) { playwright = require('/opt/npm-tools/node_modules/playwright'); }
const { chromium } = playwright;

const SITE = 'http://localhost:8765', BASE = 'http://localhost:8766', STAND = 'http://localhost:8788';
const shots = process.argv[2] || '';
let pass = 0, fail = 0;
function ok(cond, name) { if (cond) pass++; else { fail++; console.log('FAIL: ' + name); } }

const browser = await chromium.launch();

async function openPage(origin, viewport) {
	const context = await browser.newContext({ viewport: viewport || { width: 1400, height: 900 }, serviceWorkers: 'block' });
	await context.addInitScript(function () {
		try { localStorage.setItem('cc-consent', JSON.stringify({ v: 1, ts: Date.now(), groups: { C0001: true, C0002: false, C0003: false } })); } catch (e) {}
	});
	const page = await context.newPage();
	const log = [];
	page.on('request', function (r) { log.push({ url: r.url(), method: r.method() }); });
	const errors = [];
	page.on('pageerror', function (e) { errors.push(String(e)); });
	await page.goto(origin + '/privacy-notice.html');
	await page.waitForSelector('.sa-launch', { state: 'attached' });
	/* the cookie banner would sit over the launcher */
	await page.evaluate(function () { var b = document.querySelector('.cc-banner, #cc-banner'); if (b) b.remove(); });
	await page.evaluate(function () { window.siteAssistant.open(); });
	await page.waitForFunction(function () { var s = document.querySelector('.sa-status'); return s && /Ready|matches/.test(s.textContent); }, null, { timeout: 20000 });
	return { page: page, log: log, errors: errors, context: context };
}
async function searchFor(page, text) {
	await page.fill('.sa-input', text);
	await page.press('.sa-input', 'Enter');
	await page.waitForSelector('.sa-card');
}
function outside(log, origin) {
	return log.filter(function (r) { return r.url.indexOf(origin) !== 0 && r.url.indexOf('data:') !== 0; });
}

/* ------------------------------------------- 1. the unpatched site: baseline */
let t = await openPage(BASE);
await searchFor(t.page, 'legitimate interest');
ok(await t.page.locator('.sa-ai').count() === 0, 'unpatched site: no AI block');
const baseCards = await t.page.locator('.sa-card .sa-title').allTextContents();
ok(outside(t.log, BASE).length === 0, 'unpatched site: no request leaves the site');
await t.context.close();

/* ------------------------------------------------ 2. before the button */
await fetch(STAND + '/_reset');
t = await openPage(SITE);
const page = t.page;
ok((await page.locator('.sa-intro').textContent()).indexOf('unless you press the Ask AI button') > 0, 'the intro says when something leaves the browser');
await searchFor(page, 'legitimate interest');
ok(JSON.stringify(await page.locator('.sa-card .sa-title').allTextContents()) === JSON.stringify(baseCards), 'the search results are the same as without the patch');
ok(await page.locator('.sa-ai-btn').isVisible(), 'the Ask AI button is shown above the results');
ok(await page.evaluate(function () { return document.querySelector('.sa-results').firstElementChild.className === 'sa-ai'; }), 'the AI block is the first thing in the results');
const noteText = await page.locator('.sa-ai-note').textContent();
ok(/top 5 results/.test(noteText) && /AI-generated/.test(noteText) && /not legal advice/.test(noteText) && /personal or confidential/.test(noteText) && /Cloudflare/.test(noteText), 'the note under the button says what is sent, to whom, and what the answer is');
ok(await page.locator('.sa-ai-note a').getAttribute('href') === '/privacy-notice.html#ai-answers', 'the note links to the privacy notice section');
await page.fill('.sa-input', 'legitimate interest balancing test');
await page.waitForTimeout(700);
ok(outside(t.log, SITE).length === 0, 'typing and searching sends nothing outside the site, and loads no Turnstile script');
ok(await page.evaluate(function () { return typeof window.turnstile === 'undefined' && !document.querySelector('script[src*="turnstile"]'); }), 'no Turnstile before the press');
if (shots) await page.screenshot({ path: shots + '/1-button-desktop.png' });

/* ------------------------------------------------------ 3. the answer */
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-answer');
const ext = outside(t.log, SITE);
ok(ext.length === 2 && ext[0].url === STAND + '/turnstile.js' && ext[1].url === STAND + '/ask' && ext[1].method === 'POST', 'one press: the Turnstile script, then one POST to the Worker, nothing else (' + ext.map(function (r) { return r.method + ' ' + r.url; }).join(', ') + ')');
let st = await (await fetch(STAND + '/_state')).json();
const sent = st.asks[0];
ok(sent && Object.keys(sent).sort().join() === 'passages,q,token' && sent.q === 'legitimate interest balancing test' && sent.passages.length === 5 && sent.passages.every(function (p) { return Object.keys(p).sort().join() === 't,x'; }), 'the request holds the question, the token and five passages, and nothing else');
ok(await page.evaluate(function () { var p = window.__tsParams; return p.sitekey === 'test-site-key-000' && p.action === 'ask-ai' && p.appearance === 'interaction-only'; }), 'Turnstile is rendered with the site key and the action');
ok(await page.locator('.sa-ai-answer').getAttribute('data-ai-generated') === 'true' && (await page.locator('.sa-ai-label').textContent()) === 'AI-generated answer', 'the answer is labelled as AI-generated, visibly and in the markup');
ok(await page.locator('.sa-ai-text').count() === 2, 'two paragraphs are drawn as two paragraphs');
const cites = await page.locator('.sa-ai-cite').evaluateAll(function (as) { return as.map(function (a) { return a.textContent + ' ' + a.getAttribute('href'); }); });
const cardLinks = await page.locator('.sa-card .sa-title').evaluateAll(function (as) { return as.map(function (a) { return a.getAttribute('href'); }); });
ok(cites.length === 4 && cites[0] === '[1] ' + cardLinks[0] && cites[1] === '[2] ' + cardLinks[1], 'each [n] links to result n of the list below');
ok(await page.locator('.sa-ai-sources li').count() === 2 && /It can be wrong/.test(await page.locator('.sa-ai-warn').textContent()), 'the passages used are listed, with the warning');
ok(await page.locator('.sa-ai-btn').isHidden() && await page.locator('.sa-ai-form').isVisible(), 'the button gives way to the one follow-up field');
ok(await page.locator('.sa-card').count() >= 5, 'the search results stay under the answer');
if (shots) await page.screenshot({ path: shots + '/2-answer-desktop.png' });

/* ------------------------------------------------------- 4. follow-up */
await page.fill('.sa-ai-input', 'and what about direct marketing?');
await page.press('.sa-ai-input', 'Enter');
await page.waitForSelector('.sa-ai-end');
st = await (await fetch(STAND + '/_state')).json();
const fu = st.asks[1];
ok(fu && fu.prev && fu.prev.q === 'legitimate interest balancing test' && /^[0-9a-f]{64}$/.test(fu.prev.sig) && fu.passages.length >= 3 && fu.passages.length <= 6 && fu.token !== sent.token, 'the follow-up carries the signed first exchange, its own passages and a fresh token');
ok(await page.locator('.sa-ai-answer').count() === 2 && await page.locator('.sa-ai-form').count() === 0 && /one follow-up/.test(await page.locator('.sa-ai-end').textContent()), 'second answer shown, no third turn offered');
ok((await page.locator('.sa-ai-asked').textContent()) === 'Follow-up: and what about direct marketing?', 'the follow-up question is shown as text');
ok(await page.evaluate(function () { return window.__tsRenders === 1 && window.__tsResets === 1; }), 'Turnstile rendered once and reset once');
if (shots) await page.screenshot({ path: shots + '/3-followup-desktop.png' });

/* -------------------------------- 5. a new search drops the old answer */
await searchFor(page, 'cookie consent banner reject all');
ok(await page.locator('.sa-ai-answer').count() === 0 && await page.locator('.sa-ai-btn').isVisible(), 'a new search starts with a fresh button and no old answer');
await page.click('.sa-ai-btn');
await page.fill('.sa-input', 'data protection officer');
await page.press('.sa-input', 'Enter');
await page.waitForTimeout(900);
ok(await page.locator('.sa-ai-answer').count() === 0 && await page.locator('.sa-ai-wait').count() === 0, 'an answer on its way for the previous search is not drawn into the new one');

/* --------------------------------------------- 6. what cannot be answered */
await searchFor(page, 'what is the weather under the gdpr');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-msg');
ok(/could not answer this from the site/.test(await page.locator('.sa-ai-msg').textContent()) && await page.locator('.sa-ai-answer').count() === 0 && await page.locator('.sa-ai-form').count() === 0, 'not covered: said so, no answer, no follow-up');

/* ----------------------------------------- 7. markup from the model */
await searchFor(page, 'markup in a privacy notice');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-answer');
ok(await page.evaluate(function () { var a = document.querySelector('.sa-ai-answer'); return !a.querySelector('img, b, script') && !window.__xss && a.textContent.indexOf('evil.example') < 0; }), 'the Worker strips markup and links before they reach the page');

/* the page itself, with a Worker that misbehaves */
await page.route(STAND + '/ask', function (route) {
	if (route.request().method() !== 'POST') return route.continue();
	route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': SITE, 'Content-Type': 'application/json' },
		body: JSON.stringify({ status: 'ok', answer: '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script> text [1] [99] <a href="https://evil.example">x</a>', cites: [1, 99, 'x'], left: 3, followup: false }) });
});
await searchFor(page, 'processor agreement clauses');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-answer');
ok(await page.evaluate(function () {
	var a = document.querySelector('.sa-ai-answer');
	return !a.querySelector('img, script') && !window.__xss && a.querySelectorAll('a').length === 2 &&
		Array.prototype.every.call(a.querySelectorAll('a'), function (x) { return x.origin === location.origin; }) &&
		a.querySelector('.sa-ai-text').textContent.indexOf('<img') >= 0;
}), 'even a hostile answer is drawn as text; the only links are to the site\'s own results');
await page.unroute(STAND + '/ask');

/* ------------------------------------------------------- 8. refusals */
const refusals = [
	[429, 'visitor_cap', /used today/, true],
	[429, 'daily_cap', /midnight UTC/, true],
	[503, 'off', /switched off/, true],
	[409, 'stale', /Reload the page/, true],
	[403, 'robot_check', /not a robot did not pass/, false],
	[502, 'unavailable', /could not be reached/, false],
	[500, 'something_new', /could not be reached/, false]
];
for (const c of refusals) {
	await page.route(STAND + '/ask', function (route) {
		if (route.request().method() !== 'POST') return route.continue();
		route.fulfill({ status: c[0], headers: { 'Access-Control-Allow-Origin': SITE, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: c[1] }) });
	});
	await searchFor(page, 'consent ' + c[1].replace('_', ' '));
	await page.click('.sa-ai-btn');
	await page.waitForSelector('.sa-ai-msg');
	const hidden = await page.locator('.sa-ai-btn').isHidden();
	ok(c[2].test(await page.locator('.sa-ai-msg').textContent()) && hidden === c[3] && await page.locator('.sa-card').count() >= 1, 'refusal ' + c[1] + ': explained, search results kept, button ' + (c[3] ? 'removed' : 'left for another try'));
	await page.unroute(STAND + '/ask');
}
await page.route(STAND + '/ask', function (route) { route.abort(); });
await searchFor(page, 'consent network failure');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-msg');
ok(/could not be reached/.test(await page.locator('.sa-ai-msg').textContent()) && await page.locator('.sa-ai-btn').isEnabled(), 'Worker not reachable: said so, button usable again');
await page.unroute(STAND + '/ask');
await page.evaluate(function () { window.__tsFail = true; });
await searchFor(page, 'consent robot check');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-msg');
st = await (await fetch(STAND + '/_state')).json();
const asksBefore = st.asks.length;
ok(/not a robot did not pass/.test(await page.locator('.sa-ai-msg').textContent()), 'robot check failed in the browser: said so');
await page.evaluate(function () { window.__tsFail = false; });
st = await (await fetch(STAND + '/_state')).json();
ok(st.asks.length === asksBefore, 'and nothing was sent to the Worker');

/* --------------------------------------------------- 9. the real caps */
await fetch(STAND + '/_reset');
for (let i = 0; i < 5; i++) {
	await searchFor(page, 'consent question number ' + i);
	await page.click('.sa-ai-btn');
	await page.waitForSelector('.sa-ai-answer');
}
ok(/last AI answer for today/.test(await page.locator('.sa-ai-left').textContent()) && await page.locator('.sa-ai-form').count() === 0, 'fifth answer: told it was the last, no follow-up offered');
await searchFor(page, 'consent question number six');
await page.click('.sa-ai-btn');
await page.waitForSelector('.sa-ai-msg');
st = await (await fetch(STAND + '/_state')).json();
ok(/used today/.test(await page.locator('.sa-ai-msg').textContent()) && st.aiCalls === 5, 'sixth press: refused by the Worker, model called five times in all');
ok(st.kvKeys.every(function (k) { return /^(d|v|c|x):/.test(k); }), 'KV holds counters and stored answers only');
ok(t.errors.length === 0, 'no script error on the page (' + t.errors.join(' | ') + ')');
await t.context.close();

/* ------------------------------------------------------- 10. a phone */
await fetch(STAND + '/_reset');
t = await openPage(SITE, { width: 390, height: 844 });
await searchFor(t.page, 'legitimate interest');
await t.page.click('.sa-ai-btn');
await t.page.waitForSelector('.sa-ai-answer');
const fit = await t.page.evaluate(function () {
	var panel = document.querySelector('.sa-panel').getBoundingClientRect(), bad = [];
	Array.prototype.forEach.call(document.querySelectorAll('.sa-ai, .sa-ai *'), function (n) {
		var r = n.getBoundingClientRect();
		if (r.width && (r.right > panel.right + 1 || r.left < panel.left - 1)) bad.push(n.className);
	});
	var res = document.querySelector('.sa-results');
	return { bad: bad, overflowX: res.scrollWidth > res.clientWidth + 1, docWide: document.documentElement.scrollWidth > window.innerWidth + 1 };
});
ok(fit.bad.length === 0 && !fit.overflowX && !fit.docWide, 'at 390px nothing of the AI block is wider than the panel (' + fit.bad.join(',') + ')');
if (shots) await t.page.screenshot({ path: shots + '/4-answer-phone.png' });
await t.page.fill('.sa-ai-input', 'and for employees?');
await t.page.click('.sa-ai-go');
await t.page.waitForSelector('.sa-ai-end');
ok(await t.page.locator('.sa-ai-answer').count() === 2, 'the follow-up works by tapping Ask on a phone');
ok(t.errors.length === 0, 'no script error on the phone');
await t.context.close();

/* -------------------------------------------- 11. keyboard and focus */
await fetch(STAND + '/_reset');
t = await openPage(SITE);
await searchFor(t.page, 'legitimate interest');
await t.page.focus('.sa-ai-btn');
await t.page.keyboard.press('Enter');
await t.page.waitForSelector('.sa-ai-answer');
ok(await t.page.locator('.sa-ai-out').getAttribute('aria-live') === 'polite', 'the answer area is announced to screen readers');
await t.page.keyboard.press('Escape');
ok(await t.page.locator('.sa-panel').isHidden(), 'Escape still closes the panel');
await t.context.close();

await browser.close();
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
