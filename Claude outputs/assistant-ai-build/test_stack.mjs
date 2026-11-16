/*
	Test stand for the panel (SA-02): serves the real worker.js at
	http://localhost:8788/ask with stand-ins for Workers AI, KV, Turnstile
	and with the index taken from the site copy on port 8765, plus a
	stand-in for the Turnstile script at /turnstile.js.

	  node test_stack.mjs <site copy root>

	The stand-in model answers by keyword in the question:
	  "weather"  -> NOT_COVERED
	  "markup"   -> an answer full of markup and links, for the cleaning
	  otherwise  -> two sentences citing passages 1 and 2
*/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const siteRoot = process.argv[2];
const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(fs.mkdtempSync('/tmp/sa02-stack-'), 'worker.mjs');
fs.copyFileSync(path.join(here, 'worker.js'), tmp);
const worker = (await import(pathToFileURL(tmp).href)).default;
const indexText = fs.readFileSync(path.join(siteRoot, 'assets/assistant/index.json'), 'utf8');

const kv = new Map();
const state = { aiCalls: 0, asks: [] };
const realFetch = globalThis.fetch;
globalThis.fetch = async function (url, init) {
	url = String(url);
	if (url.indexOf('turnstile/v0/siteverify') >= 0) {
		const token = init.body.get('response');
		return new Response(JSON.stringify(token.indexOf('tok-') === 0 ? { success: true, hostname: 'localhost', action: 'ask-ai' } : { success: false }));
	}
	if (url.indexOf('/assets/assistant/index.json') >= 0) return new Response(indexText);
	return realFetch(url, init);
};
const env = {
	ALLOWED_ORIGINS: 'http://localhost:8765',
	INDEX_URL: 'http://localhost:8765/assets/assistant/index.json',
	TURNSTILE_SECRET: 's', SIGNING_SECRET: 'test-signing-secret',
	KV: {
		get: async function (k, type) { const v = kv.get(k); if (v === undefined) return null; return type === 'json' ? JSON.parse(v) : v; },
		put: async function (k, v) { kv.set(k, v); }
	},
	AI: {
		run: async function (model, input) {
			state.aiCalls++;
			const user = input.messages[1].content;
			const q = user.slice(user.lastIndexOf('QUESTION: '));
			await new Promise(function (r) { setTimeout(r, 150); });
			if (/weather/i.test(q)) return { response: 'NOT_COVERED' };
			if (/markup/i.test(q)) return { response: '<b>Bold</b> claim [1]. <img src=x onerror="window.__xss=1"> See [this](https://evil.example/a) or https://evil.example/b [2][7].' };
			if (user.indexOf('EARLIER QUESTION: ') >= 0) return { response: 'The follow-up is answered from the second passage [2].' };
			return { response: 'The first passage says this [1]. The second adds that [2].\n\nA second paragraph draws on both [1][2].' };
		}
	}
};

const TURNSTILE_STUB = `
	(function () {
		var n = 0, cb = null;
		window.__tsRenders = 0; window.__tsResets = 0;
		function run() { setTimeout(function () { if (window.__tsFail) { cb['error-callback'](); } else { cb.callback('tok-' + (++n)); } }, 60); }
		window.turnstile = {
			render: function (box, params) { window.__tsRenders++; window.__tsParams = { sitekey: params.sitekey, action: params.action, appearance: params.appearance }; cb = params; run(); return 'w1'; },
			reset: function () { window.__tsResets++; run(); }
		};
	})();`;

http.createServer(async function (req, res) {
	const url = new URL(req.url, 'http://localhost:8788');
	if (url.pathname === '/turnstile.js') { res.writeHead(200, { 'Content-Type': 'text/javascript' }); res.end(TURNSTILE_STUB); return; }
	if (url.pathname === '/_state') { res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify({ aiCalls: state.aiCalls, asks: state.asks, kvKeys: Array.from(kv.keys()) })); return; }
	if (url.pathname === '/_reset') { kv.clear(); state.aiCalls = 0; state.asks = []; worker._internals.reset(); res.writeHead(200); res.end('ok'); return; }
	const chunks = [];
	req.on('data', function (c) { chunks.push(c); });
	req.on('end', async function () {
		const body = Buffer.concat(chunks);
		const headers = new Headers();
		for (const k in req.headers) headers.set(k, req.headers[k]);
		headers.set('CF-Connecting-IP', '203.0.113.50');
		if (req.method === 'POST' && url.pathname === '/ask') { try { state.asks.push(JSON.parse(body.toString('utf8'))); } catch (e) {} }
		const request = new Request(url.href, { method: req.method, headers: headers, body: (req.method === 'POST') ? body : undefined });
		const r = await worker.fetch(request, env);
		const out = {};
		r.headers.forEach(function (v, k) { out[k] = v; });
		res.writeHead(r.status, out);
		res.end(Buffer.from(await r.arrayBuffer()));
	});
}).listen(8788, function () { console.log('test stand on 8788'); });
