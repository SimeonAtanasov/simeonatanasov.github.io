/*
	Site assistant: search across the digests, the advice pages, the
	assessment tools, the readiness activities, the crosswalk, the enforcement
	pages and the site's own notices, from any page.

	Everything runs in the browser. The index (assets/assistant/index.json,
	built by Claude outputs/assistant-build/build_index.py) is fetched the
	first time the panel opens; the ranking is BM25 over Porter-stemmed
	tokens, with the question expanded by a synonym and abbreviation table
	that ships inside the index. A question bank (questions.json, about
	7,000 questions each tied to the passage that answers it, ranked by
	plausibility) feeds the five suggestions shown while the visitor types.
	Nothing the visitor types leaves the page.

	Loaded on every page by assets/js/pwa.js, like the consent layer, so a
	page added without the PWA block gets no assistant either.

	Two things the rest of the site relies on live here as well:
	  - openDetailsForHash: a deep link into a closed <details> (a digest
	    group, a country card) opens it on load and on hashchange, on every
	    page, whether or not the link came from the assistant.
	  - The launcher measures the floating controls already in the bottom
	    right corner (Top, Contents) and sits above them, so it never covers
	    one of them.
*/
(function () {
	'use strict';

	/* SA-07: a page loaded inside the Ask panel's preview window gets no
	   assistant of its own; the parent page drives it. */
	try { if (window.frameElement && window.frameElement.className.indexOf('sa-preview-frame') >= 0) return; } catch (e) {}

	if (window.__saLoaded) return;
	window.__saLoaded = true;

	var INDEX_URL = '/assets/assistant/index.json';
	var QUESTIONS_URL = '/assets/assistant/questions.json';
	var SUGGESTIONS = 5;
	var RESULTS = 8;
	var CANDIDATES = 60;
	var LIVE_DELAY = 250;   // ms after the last keystroke before the results refresh
	var K1 = 1.2, B = 0.5, TITLE_WEIGHT = 3, EXPANSION_WEIGHT = 0.5, BIGRAM_BONUS = 0.1;

	/* ------------------------------------------------------------ text */

	var STOP = {};
	('a an and are as at be been being but by can could do does for from has have how i if in into is it its ' +
	 'me my of on or our should that the their them then there these they this to us was we were what when where which who ' +
	 'why will with would you your about also any just more most not no only other some such than too very s t').split(' ')
		.forEach(function (w) { STOP[w] = true; });

	/* Porter stemmer (1980), the same steps as porter.py in the build folder. */
	var step2 = { ational: 'ate', tional: 'tion', enci: 'ence', anci: 'ance', izer: 'ize', bli: 'ble', alli: 'al', entli: 'ent', eli: 'e', ousli: 'ous', ization: 'ize', ation: 'ate', ator: 'ate', alism: 'al', iveness: 'ive', fulness: 'ful', ousness: 'ous', aliti: 'al', iviti: 'ive', biliti: 'ble', logi: 'log' };
	var step3 = { icate: 'ic', ative: '', alize: 'al', iciti: 'ic', ical: 'ic', ful: '', ness: '' };
	var c = '[^aeiou]', v = '[aeiouy]', C = c + '[^aeiouy]*', V = v + '[aeiou]*';
	var mgr0 = new RegExp('^(' + C + ')?' + V + C);
	var meq1 = new RegExp('^(' + C + ')?' + V + C + '(' + V + ')?$');
	var mgr1 = new RegExp('^(' + C + ')?' + V + C + V + C);
	var s_v = new RegExp('^(' + C + ')?' + v);
	var re2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
	var re3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
	var re4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
	var re4b = /^(.+?)(s|t)(ion)$/;
	var re1a1 = /^(.+?)(ss|i)es$/, re1a2 = /^(.+?)([^s])s$/;
	var re1b1 = /^(.+?)eed$/, re1b2 = /^(.+?)(ed|ing)$/, re1b3 = /(at|bl|iz)$/, re1b4 = /([^aeiouylsz])\1$/;
	var re1b5 = new RegExp('^' + C + v + '[^aeiouwxy]$');
	var re1c = /^(.+?)y$/, re5 = /^(.+?)e$/, re5b = /ll$/;
	var reIse = /^(.{3,})is(e|ed|es|ing|ation|ations)$/;

	function porter(w) {
		if (w.length < 3) return w;
		var first = w.charAt(0), m, stem;
		if (first === 'y') w = 'Y' + w.slice(1);
		if ((m = re1a1.exec(w))) w = m[1] + m[2];
		else if ((m = re1a2.exec(w))) w = m[1] + m[2];
		if ((m = re1b1.exec(w))) { if (mgr0.test(m[1])) w = w.slice(0, -1); }
		else if ((m = re1b2.exec(w))) {
			stem = m[1];
			if (s_v.test(stem)) {
				w = stem;
				if (re1b3.test(w)) w = w + 'e';
				else if (re1b4.test(w)) w = w.slice(0, -1);
				else if (re1b5.test(w)) w = w + 'e';
			}
		}
		if ((m = re1c.exec(w)) && s_v.test(m[1])) w = m[1] + 'i';
		if ((m = re2.exec(w)) && mgr0.test(m[1])) w = m[1] + step2[m[2]];
		if ((m = re3.exec(w)) && mgr0.test(m[1])) w = m[1] + step3[m[2]];
		if ((m = re4.exec(w))) { if (mgr1.test(m[1])) w = m[1]; }
		else if ((m = re4b.exec(w)) && mgr1.test(m[1] + m[2])) w = m[1] + m[2];
		if ((m = re5.exec(w))) {
			stem = m[1];
			if (mgr1.test(stem) || (meq1.test(stem) && !re1b5.test(stem))) w = stem;
		}
		if (re5b.test(w) && mgr1.test(w)) w = w.slice(0, -1);
		if (first === 'y') w = 'y' + w.slice(1);
		return w;
	}

	function stem(t) {
		var m = reIse.exec(t);
		if (m) t = m[1] + 'iz' + m[2];
		return porter(t);
	}

	var wordRe = /[a-z0-9]+/g;

	/* Tokens of a text. With `synonyms`, each token's expansion is appended;
	   the ranker weights expansion terms down by comparing with the plain
	   token list. */
	function tokenize(text, synonyms) {
		var out = [], words = text.toLowerCase().replace(/['’]/g, '').match(wordRe) || [];
		for (var i = 0; i < words.length; i++) {
			var t = words[i];
			if (t.length < 2 || STOP[t]) continue;
			var s = stem(t);
			out.push(s);
			if (synonyms) {
				var exp = synonyms[t] || synonyms[s];
				if (exp) {
					var ew = exp.match(wordRe) || [];
					for (var j = 0; j < ew.length; j++) {
						if (ew[j].length > 1 && !STOP[ew[j]]) out.push(stem(ew[j]));
					}
				}
			}
		}
		return out;
	}

	/* ----------------------------------------------------------- index */

	var index = null;       // the fetched JSON
	var docs = null;        // index.docs
	var postings = null;    // term -> [doc, tf, doc, tf, ...]
	var docLen = null, avgLen = 0, docTokens = null, idf = null;
	var loading = null;

	function buildIndex(data) {
		index = data;
		docs = data.docs;
		postings = Object.create(null);
		docLen = new Float32Array(docs.length);
		docTokens = new Array(docs.length);
		var total = 0;
		for (var i = 0; i < docs.length; i++) {
			var d = docs[i];
			var tt = tokenize(d.t), tx = tokenize(d.x), tp = tokenize(d.p + ' ' + (d.m || ''));
			var toks = tx.concat(tp);
			for (var r = 0; r < TITLE_WEIGHT; r++) toks = toks.concat(tt);
			docTokens[i] = ' ' + tt.concat(tx).join(' ') + ' ';
			docLen[i] = toks.length;
			total += toks.length;
			var tf = Object.create(null);
			for (var k = 0; k < toks.length; k++) tf[toks[k]] = (tf[toks[k]] || 0) + 1;
			for (var term in tf) {
				var p = postings[term];
				if (!p) p = postings[term] = [];
				p.push(i, tf[term]);
			}
		}
		avgLen = total / docs.length;
		idf = Object.create(null);
		var n = docs.length;
		for (var term2 in postings) {
			var df = postings[term2].length / 2;
			idf[term2] = Math.log(1 + (n - df + 0.5) / (df + 0.5));
		}
	}

	function search(query, pageFilter) {
		if (!docs) return [];
		var base = tokenize(query);
		var qt = tokenize(query, index.synonyms);
		var seen = {}, scores = new Float32Array(docs.length);
		for (var i = 0; i < qt.length; i++) {
			var t = qt[i];
			if (seen[t]) continue;
			seen[t] = true;
			var w = base.indexOf(t) >= 0 ? 1 : EXPANSION_WEIGHT;
			var p = postings[t];
			if (!p) continue;
			var f0 = idf[t] * w;
			for (var j = 0; j < p.length; j += 2) {
				var doc = p[j], f = p[j + 1];
				scores[doc] += f0 * f * (K1 + 1) / (f + K1 * (1 - B + B * docLen[doc] / avgLen));
			}
		}
		var order = [];
		for (var d = 0; d < docs.length; d++) if (scores[d] > 0) order.push(d);
		order.sort(function (a, b) { return scores[b] - scores[a]; });
		order = order.slice(0, CANDIDATES);
		/* adjacent query words that appear adjacent in the text count extra */
		if (base.length > 1) {
			for (var o = 0; o < order.length; o++) {
				var hits = 0, dt = docTokens[order[o]];
				for (var q = 0; q < base.length - 1; q++) {
					if (dt.indexOf(' ' + base[q] + ' ' + base[q + 1] + ' ') >= 0) hits++;
				}
				if (hits) scores[order[o]] *= 1 + BIGRAM_BONUS * hits;
			}
			order.sort(function (a, b) { return scores[b] - scores[a]; });
		}
		var out = [];
		for (var m = 0; m < order.length; m++) {
			var dd = docs[order[m]];
			if (pageFilter && dd.p !== pageFilter) continue;
			out.push({ doc: dd, score: scores[order[m]] });
		}
		return { results: out, terms: Object.keys(seen), base: base };
	}

	/* SA-04: while the last word is still being typed it is usually not a word
	   yet ("germ"), so live results complete it to the most frequent word on
	   the site that starts with it. The word list is built once, on first use. */
	var vocab = null;
	function completeLast(q) {
		if (!docs || /\s$/.test(q)) return q;
		var m = q.toLowerCase().match(/([a-z0-9]+)$/);
		if (!m || m[1].length < 2 || STOP[m[1]] || postings[stem(m[1])]) return q;
		if (!vocab) {
			vocab = Object.create(null);
			for (var i = 0; i < docs.length; i++) {
				var ws = (docs[i].t + ' ' + docs[i].x).toLowerCase().match(wordRe) || [];
				for (var j = 0; j < ws.length; j++) vocab[ws[j]] = (vocab[ws[j]] || 0) + 1;
			}
		}
		var w = m[1], best = null, bestN = 0;
		for (var v in vocab) if (vocab[v] > bestN && v.length > w.length && v.indexOf(w) === 0) { best = v; bestN = vocab[v]; }
		return best ? q.slice(0, q.length - w.length) + best : q;
	}

	var questions = null;   // [{t: text, d: doc index, s: score, k: tokens}]
	var docById = null;

	function buildQuestions(data) {
		docById = Object.create(null);
		for (var i = 0; i < docs.length; i++) docById[docs[i].id] = i;
		questions = [];
		var rows = (data && data.q) || [];
		for (var j = 0; j < rows.length; j++) {
			var d = docById[rows[j][1]];
			if (d === undefined) continue;   // the two files can be one build apart
			questions.push({ t: rows[j][0], d: d, s: rows[j][2], k: tokenize(rows[j][0]), l: rows[j][0].toLowerCase() });
		}
	}

	function load() {
		if (loading) return loading;
		var indexReq = fetch(INDEX_URL, { credentials: 'omit' }).then(function (r) {
			if (!r.ok) throw new Error('index ' + r.status);
			return r.json();
		});
		/* the question bank is optional: without it the panel still searches */
		var questionsReq = fetch(QUESTIONS_URL, { credentials: 'omit' }).then(function (r) {
			return r.ok ? r.json() : null;
		}).catch(function () { return null; });
		loading = Promise.all([indexReq, questionsReq]).then(function (both) {
			var t0 = performance.now();
			buildIndex(both[0]);
			buildQuestions(both[1]);
			index.buildMs = Math.round(performance.now() - t0);
			return index;
		});
		loading.catch(function () { loading = null; });
		return loading;
	}

	/* The suggestions for what has been typed so far: every typed word must
	   match a question word (earlier words by stem, the last one as a prefix,
	   since it is still being typed), ranked by the question's plausibility
	   score plus how much of the question the typed words cover. Short inputs
	   that are only stop words fall back to a plain prefix on the question. */
	function suggest(text) {
		if (!questions || !questions.length) return [];
		var raw = text.toLowerCase().replace(/['\u2019]/g, '').match(wordRe) || [];
		if (!raw.length) return [];
		var last = raw[raw.length - 1];
		var syn = (index && index.synonyms) || {};
		function alts(word) {
			var exp = syn[word] || syn[stem(word)];
			return exp ? tokenize(exp) : [];
		}
		var words = [];   // [stem, [alternative stems]] for every typed word but the last
		for (var i = 0; i < raw.length - 1; i++) if (!STOP[raw[i]] && raw[i].length > 1) words.push([stem(raw[i]), alts(raw[i])]);
		var lastStem = stem(last), lastAlts = alts(last);
		var lastIsStop = !!STOP[last] || last.length < 2;
		var lower = text.toLowerCase().replace(/\s+/g, ' ').trim();
		var first = raw[0] + ' ';
		var hits = [];
		/* a word matched through its synonym expansion counts half: the
		   expansions of an abbreviation are ordinary words that many
		   questions contain */
		for (var q = 0; q < questions.length; q++) {
			var item = questions[q], ok = true, covered = 0, direct = 0;
			for (var w = 0; w < words.length && ok; w++) {
				if (item.k.indexOf(words[w][0]) >= 0) { covered++; direct++; continue; }
				var found = false;
				for (var a = 0; a < words[w][1].length && !found; a++) found = item.k.indexOf(words[w][1][a]) >= 0;
				if (found) covered += 0.5; else ok = false;
			}
			if (!ok) continue;
			if (!lastIsStop) {
				var lastHit = 0;
				for (var k = 0; k < item.k.length && !lastHit; k++) {
					if (item.k[k].indexOf(lastStem) === 0 || item.k[k].indexOf(last) === 0) lastHit = 1;
				}
				if (!lastHit) {
					for (var k2 = 0; k2 < item.k.length && !lastHit; k2++) if (lastAlts.indexOf(item.k[k2]) >= 0) lastHit = 0.5;
				}
				if (!lastHit) continue;
				covered += lastHit;
				if (lastHit === 1) direct++;
			}
			var typed = words.length + (lastIsStop ? 0 : 1);
			var starts = item.l.indexOf(lower) === 0;
			if (!typed && !starts) continue;
			var score = item.s + 0.4 * (item.k.length ? covered / item.k.length : 0) + 0.5 * (typed ? direct / typed : 0) + (starts ? 0.3 : 0) + (item.l.indexOf(first) === 0 ? 0.1 : 0);
			hits.push({ item: item, score: score, exact: direct === typed });
		}
		hits.sort(function (a, b) { return b.score - a.score; });
		/* SA-04: when enough answers contain every typed word as written, drop the
		   ones that only match through a synonym, so "deployer obligation" no
		   longer offers notified bodies. Counted per answer passage. */
		var exactDocs = {}, exactCount = 0;
		for (var e = 0; e < hits.length && exactCount < SUGGESTIONS; e++) {
			if (hits[e].exact && !exactDocs[hits[e].item.d]) { exactDocs[hits[e].item.d] = true; exactCount++; }
		}
		if (exactCount >= SUGGESTIONS) hits = hits.filter(function (x) { return x.exact; });
		var out = [], seenDoc = {};
		for (var h = 0; h < hits.length && out.length < SUGGESTIONS; h++) {
			var dd = hits[h].item.d;
			if (seenDoc[dd]) continue;   // one suggestion per answer passage
			seenDoc[dd] = true;
			out.push(hits[h].item);
		}
		return out;
	}

	/* ------------------------------------------------------------- UI */

	var TOOL_FINDER = {
		q: 'What are you assessing?',
		options: [
			{ label: 'A process or project that uses personal data', tool: 'privacy',
			  note: 'The Privacy Assessment screens it end to end and hands over to the Full DPIA when one is required. If the lawful basis is legitimate interests, run the Legitimate Interest Test as well.', also: ['dpia', 'lia'] },
			{ label: 'An AI system', next: {
				q: 'What do you need?',
				options: [
					{ label: 'One assessment that covers the system end to end', tool: 'aipath', note: 'The pathway asks the intake once, sets an impact level and opens the generative AI and EU AI Act modules only when they apply. It hands over to the FRIA and the Full DPIA when those are needed.', also: ['fria', 'dpia'] },
					{ label: 'Only its classification under the EU AI Act', tool: 'ai', note: 'The AI Risk Assessment screens one system against the Act and lists the obligations for your role.', also: ['crosswalk'] },
					{ label: 'The risks specific to a generative model or LLM', tool: 'genai', note: 'Prompts and inputs, training data and intellectual property, outputs and accuracy, agency and supply chain, with gaps mapped to NIST AI 600-1 and the OWASP LLM Top 10.', also: ['aipath'] },
					{ label: 'A fundamental rights impact assessment as a deployer', tool: 'fria', note: 'Article 27 of the AI Act, for public bodies, bodies providing public services, and creditworthiness or life and health insurance pricing. It can start from a saved DPIA.', also: ['dpia'] },
					{ label: 'How the Act maps to ISO/IEC 42001 and NIST AI RMF', tool: 'crosswalk', note: 'A reference table of 28 obligations with the clauses and subcategories that cover them and the gaps that do not.', also: ['aipath'] }
				] } },
			{ label: 'A vendor, supplier or processor', tool: 'tpsa', note: 'The Third-Party Security Assessment combines the data at stake with the vendor\'s controls through a lookup table, so strong controls never erase a critical amount of data at stake.', also: ['tia'] },
			{ label: 'A transfer of personal data outside the EEA', tool: 'tia', note: 'For transfers resting on standard contractual clauses or binding corporate rules: the destination\'s laws and practices, the supplementary measures, and a contract action per importer.', also: ['privacy'] },
			{ label: 'A data breach or security incident', tool: 'incident', note: 'The ENISA severity method gives a level and says whether to notify the supervisory authority and the people affected.', also: ['readiness'] },
			{ label: 'Whether legitimate interests is a valid basis', tool: 'lia', note: 'The three-part test: purpose, necessity and the balance against the individual\'s interests, with safeguards.', also: ['privacy'] },
			{ label: 'The organisation\'s privacy programme as a whole', tool: 'readiness', note: 'Record which of 71 activities you perform and the tool derives which GDPR Articles they evidence, with a gap list ordered worst first.', also: ['privacy'] },
			{ label: 'Fine exposure or enforcement risk', tool: 'calculator', note: 'The calculator estimates exposure from what authorities have imposed on comparable organisations; the enforcement pages show what happens after a complaint or a fine in each country.', also: ['enforcement', 'analytics'] }
		]
	};

	var FINDER_LABEL = 'Which assessment do I need?';

	var PAGE_PROMPTS = {
		'edpb-digest': ['Consent or pay', 'Facial recognition', 'Legitimate interests guidelines', 'Data privacy framework'],
		'cookie-digest': ['Cookie rules in France', 'Reject all button', 'Google Analytics without consent', 'Consent or pay'],
		'ai-act-digest': ['High-risk AI systems', 'Deepfake labelling', 'Penalties under the AI Act', 'General-purpose AI with systemic risk'],
		'practical-privacy': ['Recording meetings', 'Accessing a leaver\'s mailbox', 'Breach notification deadline', 'Marketing emails opt out'],
		'practical-ai-act-advice': ['Prohibited AI practices', 'Obligations for deployers', 'Vetting AI vendors', 'AI literacy'],
		'privacy-ai-assessment': [FINDER_LABEL, 'How is the DPIA risk level worked out?', 'What triggers a DPIA?', 'ENISA severity scale'],
		'gdpr-readiness': ['How the readiness score works', 'The 13 scope questions', 'Do I need a DPO?', 'Records of processing'],
		'ai-governance-crosswalk': ['AI literacy obligation', 'Human oversight', 'Transparency obligations', 'NIST AI RMF govern function'],
		'gdpr-enforcement': ['Appeal against a fine in Spain', 'One-stop-shop', 'Can public bodies be fined?', 'Suing for damages'],
		'privacy-enforcement-worldwide': ['Who enforces privacy law in Brazil', 'Penalties in the United States', 'Appeals in Singapore', 'Private claims in Japan'],
		'gdpr-fine-calculator': ['How the fine is worked out', 'Which peers are compared', 'Turnover and fine index', 'Where the data comes from'],
		'gdpr-fines-analytics': ['How the fine is worked out', 'Largest fines', 'Fines by country', 'Fines over time'],
		'power-bi': ['How the fine is worked out', 'Largest fines', 'Fines by country', 'Fines over time'],
		'cookie-banner-scanner': ['Cookie rules in Germany', 'Reject all button', 'Strictly necessary cookies', 'Is the scanned URL sent anywhere?'],
		'risk-matrix-original': [FINDER_LABEL, 'How is the DPIA risk level worked out?', 'Breach notification deadline', 'Vendor security assessment'],
		'cookie-notice': ['What cookies does this site set', 'How do I change my cookie choices', 'Storage that is not a cookie'],
		'privacy-notice': ['Do my answers leave my device?', 'Contact form', 'Transfers outside the EEA'],
		'default': [FINDER_LABEL, 'Breach notification deadline', 'Cookie consent rules in Germany', 'High-risk AI systems', 'Do my answers leave my device?']
	};

	function pageKey() {
		var m = /([a-z0-9-]+)\.html$/i.exec(location.pathname);
		return m ? m[1].toLowerCase() : 'default';
	}

	function el(tag, attrs, children) {
		var e = document.createElement(tag);
		if (attrs) for (var k in attrs) {
			if (k === 'class') e.className = attrs[k];
			else if (k === 'text') e.textContent = attrs[k];
			else if (k === 'html') e.innerHTML = attrs[k];
			else e.setAttribute(k, attrs[k]);
		}
		if (children) for (var i = 0; i < children.length; i++) {
			if (children[i] == null) continue;
			e.appendChild(typeof children[i] === 'string' ? document.createTextNode(children[i]) : children[i]);
		}
		return e;
	}

	var launcher, panel, input, results, prompts, status, filterRow, intro, suggestBox, lastQuery = '', lastFilter = '', lastFocus = null;
	var activeSuggestion = -1, suggestTimer = null, liveTimer = null, pinnedDoc = -1;

	function build() {
		launcher = el('button', { type: 'button', class: 'sa-launch', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'sa-panel' }, [
			el('span', { class: 'sa-launch-icon', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24" width="18" height="18" focusable="false"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3 5v2h10V8H7zm0 4v2h7v-2H7z"/></svg>' }),
			el('span', { class: 'sa-launch-text', text: 'Ask' })
		]);
		launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
		launcher.addEventListener('mouseenter', function () { load(); }, { once: true });
		launcher.addEventListener('focus', function () { load(); }, { once: true });
		document.body.appendChild(launcher);

		panel = el('section', { id: 'sa-panel', class: 'sa-panel', role: 'dialog', 'aria-labelledby': 'sa-title', hidden: '' });
		var head = el('div', { class: 'sa-head' }, [
			el('h2', { id: 'sa-title', text: 'Ask this site' }),
			el('button', { type: 'button', class: 'sa-close', 'aria-label': 'Close' , html: '&times;' })
		]);
		head.lastChild.addEventListener('click', close);
		intro = el('p', { class: 'sa-intro', text: 'Searches the digests, the assessment tools, the guides and the enforcement pages. Runs in your browser: nothing you type leaves it.' });
		var form = el('form', { class: 'sa-form', role: 'search' });
		input = el('input', { type: 'text', class: 'sa-input', placeholder: 'Ask a question or type a few words', 'aria-label': 'Your question', autocomplete: 'off', maxlength: '300' });
		var go = el('button', { type: 'submit', class: 'sa-go', text: 'Search' });
		form.appendChild(input);
		form.appendChild(go);
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			clearTimeout(liveTimer);
			if (activeSuggestion >= 0 && suggestBox.children[activeSuggestion]) { pick(suggestBox.children[activeSuggestion]); return; }
			hideSuggestions();
			pinnedDoc = -1;
			run(input.value, '');
		});
		suggestBox = el('ul', { class: 'sa-suggest', id: 'sa-suggest', role: 'listbox', 'aria-label': 'Suggested questions', hidden: '' });
		input.setAttribute('role', 'combobox');
		input.setAttribute('aria-autocomplete', 'list');
		input.setAttribute('aria-controls', 'sa-suggest');
		input.setAttribute('aria-expanded', 'false');
		input.addEventListener('input', function () {
			pinnedDoc = -1;   // a picked answer no longer applies once the text changes
			clearTimeout(suggestTimer);
			suggestTimer = setTimeout(showSuggestions, 60);
			clearTimeout(liveTimer);
			liveTimer = setTimeout(liveSearch, LIVE_DELAY);
		});
		input.addEventListener('keydown', function (e) {
			if (suggestBox.hidden) return;
			var n = suggestBox.children.length;
			if (e.key === 'ArrowDown') { e.preventDefault(); setActive((activeSuggestion + 1) % n); }
			else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((activeSuggestion - 1 + n) % n); }
			else if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); e.stopPropagation(); hideSuggestions(); }
		});
		input.addEventListener('blur', function () { setTimeout(hideSuggestions, 150); });
		input.addEventListener('focus', function () { if (input.value.length >= 2) showSuggestions(); });
		suggestBox.addEventListener('mousedown', function (e) { e.preventDefault(); });
		suggestBox.addEventListener('click', function (e) {
			var li = e.target && e.target.closest ? e.target.closest('li') : null;
			if (li) pick(li);
		});
		prompts = el('div', { class: 'sa-prompts', 'aria-label': 'Suggestions' });
		filterRow = el('div', { class: 'sa-filters', hidden: '' });
		status = el('p', { class: 'sa-status', 'aria-live': 'polite' });
		results = el('div', { class: 'sa-results' });
		var foot = el('p', { class: 'sa-foot', html: 'Reference material and self-assessment tooling, not legal advice. Results link to the page they come from.' });
		panel.appendChild(head);
		panel.appendChild(intro);
		panel.appendChild(form);
		panel.appendChild(suggestBox);
		panel.appendChild(prompts);
		panel.appendChild(filterRow);
		panel.appendChild(status);
		panel.appendChild(results);
		panel.appendChild(foot);
		document.body.appendChild(panel);
		renderPrompts();

		document.addEventListener('keydown', function (e) {
			if ((e.key === 'Escape' || e.key === 'Esc') && !panel.hidden) {
				if (preview && !preview.hidden) hidePreview(); else close();
			}
		});
		window.addEventListener('resize', placeLauncher);
		window.addEventListener('resize', function () { if (preview && !preview.hidden) { if (previewAllowed()) placePreview(); else hidePreview(); } });
		placeLauncher();

		/* The cookie banner sits across the bottom of the viewport until the
		   visitor chooses, so the launcher waits behind it. The banner is
		   appended to body when shown and removed on a choice. */
		if (window.MutationObserver) {
			new MutationObserver(syncWithBanner).observe(document.body, { childList: true });
		}
		syncWithBanner();
	}

	function syncWithBanner() {
		var banner = document.querySelector('.cc-banner');
		var hide = !!banner && panel.hidden;
		if (launcher.hidden !== hide) {
			launcher.hidden = hide;
			if (!hide) placeLauncher();
		}
	}

	function showSuggestions() {
		var text = input.value.trim();
		if (text.length < 2 || !questions) { hideSuggestions(); if (text.length >= 2 && !questions) load().then(showSuggestions); return; }
		var list = suggest(text);
		suggestBox.innerHTML = '';
		if (!list.length) { hideSuggestions(); return; }
		list.forEach(function (item, i) {
			var li = el('li', { role: 'option', id: 'sa-opt-' + i, 'aria-selected': 'false', 'data-doc': String(item.d) }, [
				el('span', { class: 'sa-suggest-q', text: item.t }),
				el('span', { class: 'sa-suggest-p', text: docs[item.d].p })
			]);
			suggestBox.appendChild(li);
		});
		suggestBox.hidden = false;
		input.setAttribute('aria-expanded', 'true');
		activeSuggestion = -1;
		input.removeAttribute('aria-activedescendant');
	}

	function hideSuggestions() {
		suggestBox.hidden = true;
		input.setAttribute('aria-expanded', 'false');
		input.removeAttribute('aria-activedescendant');
		activeSuggestion = -1;
	}

	function setActive(i) {
		var items = suggestBox.children;
		for (var k = 0; k < items.length; k++) {
			items[k].setAttribute('aria-selected', k === i ? 'true' : 'false');
			items[k].classList.toggle('is-active', k === i);
		}
		activeSuggestion = i;
		if (items[i]) input.setAttribute('aria-activedescendant', items[i].id);
	}

	/* SA-04: results follow the typing, without pressing Search. Three
	   characters at least, so one or two letters do not flood the list. */
	function liveSearch() {
		var q = input.value.trim();
		if (q.length >= 3) run(completeLast(q), '');
		else if (lastQuery) run('', '');
	}

	function pick(li) {
		clearTimeout(liveTimer);
		var text = li.querySelector('.sa-suggest-q').textContent;
		input.value = text;
		pinnedDoc = parseInt(li.getAttribute('data-doc'), 10);
		hideSuggestions();
		run(text, '');
	}

	function renderPrompts() {
		prompts.innerHTML = '';
		var list = PAGE_PROMPTS[pageKey()] || PAGE_PROMPTS['default'];
		if (list.indexOf(FINDER_LABEL) < 0) list = [FINDER_LABEL].concat(list);
		list.forEach(function (label) {
			var b = el('button', { type: 'button', class: 'sa-chip' + (label === FINDER_LABEL ? ' sa-chip-finder' : ''), text: label });
			b.addEventListener('click', function () {
				clearTimeout(liveTimer);
				if (label === FINDER_LABEL) finder(TOOL_FINDER, []);
				else { input.value = label; pinnedDoc = -1; hideSuggestions(); run(label, ''); }
			});
			prompts.appendChild(b);
		});
	}

	/* The launcher sits above whatever floating control already occupies the
	   bottom right corner: the Top button (hidden until the page scrolls, so
	   its slot is read from its styles) and the Contents button on narrow
	   screens. */
	function placeLauncher() {
		var bodyPx = parseFloat(getComputedStyle(document.body).fontSize) || 16;
		var top = 0;
		var els = document.querySelectorAll('.site-top, [class$="-top"], [id$="-toc-open"]');
		for (var i = 0; i < els.length; i++) {
			var cs = getComputedStyle(els[i]);
			if (cs.position !== 'fixed') continue;
			var r = els[i].getBoundingClientRect();
			var edge;
			if (cs.display === 'none' || r.width === 0) {
				var h = (parseFloat(cs.lineHeight) || 0) + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
				var bottom = parseFloat(cs.bottom);
				if (!(h > 0) || isNaN(bottom)) continue;
				edge = bottom + h;
			} else {
				if (r.right < window.innerWidth - 160) continue;
				edge = window.innerHeight - r.top;
			}
			if (edge > top) top = edge;
		}
		launcher.style.bottom = (top > 0 ? top + 0.45 * bodyPx : 1.25 * bodyPx) + 'px';
	}

	function open() {
		lastFocus = document.activeElement;
		panel.hidden = false;
		launcher.setAttribute('aria-expanded', 'true');
		launcher.classList.add('is-open');
		document.documentElement.classList.add('sa-panel-open');
		input.focus();
		if (!docs) {
			status.textContent = 'Loading the index…';
			load().then(function () {
				status.textContent = 'Ready: ' + docs.length.toLocaleString() + ' entries' + (questions && questions.length ? ' and ' + questions.length.toLocaleString() + ' questions' : '') + '. Start typing, or pick a suggestion.';
				if (lastQuery) run(lastQuery, lastFilter);
			}).catch(function () {
				status.textContent = 'The index could not be loaded. Check the connection and try again.';
			});
		}
	}

	function close() {
		hidePreview();
		panel.hidden = true;
		launcher.setAttribute('aria-expanded', 'false');
		launcher.classList.remove('is-open');
		document.documentElement.classList.remove('sa-panel-open');
		if (lastFocus && lastFocus.focus) lastFocus.focus(); else launcher.focus();
	}

	function escapeHtml(s) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	/* A window of the text around the first matched word, with matches marked. */
	function snippet(text, terms, full) {
		var words = text.split(/(\s+)/);
		var firstHit = -1, marked = [];
		for (var i = 0; i < words.length; i++) {
			var w = words[i];
			var core = w.toLowerCase().replace(/['’]/g, '').match(wordRe);
			var hit = false;
			if (core) for (var j = 0; j < core.length && !hit; j++) hit = terms.indexOf(stem(core[j])) >= 0 && !STOP[core[j]];
			if (hit && firstHit < 0) firstHit = i;
			marked.push(hit ? '<mark>' + escapeHtml(w) + '</mark>' : escapeHtml(w));
		}
		if (full) return marked.join('');
		var limit = 320;
		if (text.length <= limit) return marked.join('');
		var start = 0;
		if (firstHit > 0) {
			var before = words.slice(0, firstHit).join('').length;
			if (before > limit * 0.55) {
				var chars = 0;
				for (var k = firstHit; k >= 0 && chars < limit * 0.3; k--) { chars += words[k].length; start = k; }
				while (start > 0 && !/[.!?]$/.test(words[start - 1]) && words.slice(0, firstHit).join('').length - words.slice(0, start).join('').length < limit * 0.5) start--;
			}
		}
		var out = '', len = 0, i2 = start;
		for (; i2 < words.length; i2++) {
			if (len + words[i2].length > limit && len > limit * 0.6) break;
			out += marked[i2];
			len += words[i2].length;
		}
		return (start > 0 ? '… ' : '') + out + (i2 < words.length ? '…' : '');
	}

	function run(query, filter) {
		query = (query || '').trim();
		lastQuery = query;
		lastFilter = filter || '';
		hidePreview();
		results.innerHTML = '';
		filterRow.hidden = true;
		if (!query) { status.textContent = ''; return; }
		if (!docs) { status.textContent = 'Loading the index…'; load().then(function () { run(query, filter); }); return; }
		intro.hidden = true;
		var t0 = performance.now();
		var r = search(query, lastFilter);
		var all = search(query, '');
		var ms = Math.round(performance.now() - t0);
		if (!all.results.length) {
			status.textContent = 'Nothing on the site matches that wording. Try different words, an abbreviation such as DPIA, or a country name.';
			return;
		}
		/* page filter chips, from the pages present in the candidates */
		var counts = {}, order = [];
		all.results.forEach(function (x) { if (!counts[x.doc.p]) { counts[x.doc.p] = 0; order.push(x.doc.p); } counts[x.doc.p]++; });
		filterRow.innerHTML = '';
		if (order.length > 1) {
			var allChip = el('button', { type: 'button', class: 'sa-filter' + (lastFilter ? '' : ' is-on'), text: 'All' });
			allChip.addEventListener('click', function () { run(query, ''); });
			filterRow.appendChild(allChip);
			order.slice(0, 6).forEach(function (p) {
				var b = el('button', { type: 'button', class: 'sa-filter' + (lastFilter === p ? ' is-on' : ''), text: p + ' (' + counts[p] + ')' });
				b.addEventListener('click', function () { run(query, p); });
				filterRow.appendChild(b);
			});
			filterRow.hidden = false;
		}
		var list = r.results;
		if (pinnedDoc >= 0 && docs[pinnedDoc] && (!lastFilter || docs[pinnedDoc].p === lastFilter)) {
			list = [{ doc: docs[pinnedDoc], pinned: true }].concat(r.results.filter(function (x) { return x.doc !== docs[pinnedDoc]; }));
		}
		var shown = list.slice(0, RESULTS);
		status.textContent = (list.length >= CANDIDATES ? 'Top ' + shown.length + ' of many matches' : shown.length + ' of ' + list.length + ' matches') + (lastFilter ? ' in ' + lastFilter : '') + ', ' + ms + ' ms.';
		shown.forEach(function (x) { results.appendChild(card(x.doc, r.terms, x.pinned)); });
		r.results = list;
		if (r.results.length > RESULTS) {
			var more = el('button', { type: 'button', class: 'sa-more', text: 'Show more results' });
			more.addEventListener('click', function () {
				more.remove();
				r.results.slice(RESULTS, RESULTS * 3).forEach(function (x) { results.appendChild(card(x.doc, r.terms)); });
			});
			results.appendChild(more);
		}
	}

	function samePage(url) {
		var path = url.split('#')[0];
		var here = location.pathname.replace(/^\//, '');
		if (here === '') here = 'index.html';
		return path === here || ('/' + path) === location.pathname;
	}

	function card(d, terms, pinned) {
		var a = el('a', { class: 'sa-title', href: '/' + d.u, html: snippet(d.t, terms, true) });
		a.addEventListener('click', function (e) {
			if (samePage(d.u) && d.u.indexOf('#') > 0) {
				e.preventDefault();
				close();
				jumpTo(d.u.split('#')[1]);
			}
		});
		var meta = el('p', { class: 'sa-meta' }, [pinned ? el('span', { class: 'sa-best', text: 'Answer' }) : null, el('span', { class: 'sa-page', text: d.p }), d.m ? el('span', { class: 'sa-m', text: d.m }) : null]);
		var body = el('p', { class: 'sa-text', html: snippet(d.x, terms, false) });
		var art = el('article', { class: 'sa-card' }, [meta, a, body]);
		/* SA-07: on a desktop with room beside the panel, resting on a result
		   opens its page in the preview window */
		art.addEventListener('mouseenter', function () { schedulePreview(d, art); });
		art.addEventListener('mouseleave', function () { clearTimeout(pvTimer); });
		a.addEventListener('focus', function () { schedulePreview(d, art); });
		if (d.x.length > 320) {
			var toggle = el('button', { type: 'button', class: 'sa-toggle', text: 'Show all' });
			toggle.addEventListener('click', function () {
				var open = toggle.textContent === 'Show all';
				body.innerHTML = snippet(d.x, terms, open);
				toggle.textContent = open ? 'Show less' : 'Show all';
			});
			art.appendChild(toggle);
		}
		return art;
	}

	function finder(node, trail) {
		hidePreview();
		intro.hidden = true;
		results.innerHTML = '';
		filterRow.hidden = true;
		status.textContent = '';
		var box = el('div', { class: 'sa-finder' });
		if (trail.length) {
			var crumbs = el('p', { class: 'sa-crumbs' }, [trail.join(' › ')]);
			box.appendChild(crumbs);
		}
		box.appendChild(el('h3', { text: node.q }));
		node.options.forEach(function (opt) {
			var b = el('button', { type: 'button', class: 'sa-option', text: opt.label });
			b.addEventListener('click', function () {
				if (opt.next) finder(opt.next, trail.concat([opt.label]));
				else recommend(opt, trail.concat([opt.label]));
			});
			box.appendChild(b);
		});
		results.appendChild(box);
	}

	function toolById(id) {
		var list = (index && index.tools) || [];
		for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
		return null;
	}

	function recommend(opt, trail) {
		if (!docs) { status.textContent = 'Loading the index…'; load().then(function () { recommend(opt, trail); }); return; }
		results.innerHTML = '';
		var tool = toolById(opt.tool);
		var box = el('div', { class: 'sa-finder' });
		box.appendChild(el('p', { class: 'sa-crumbs' }, [trail.join(' › ')]));
		box.appendChild(el('h3', { text: tool ? tool.name : opt.tool }));
		box.appendChild(el('p', { text: opt.note }));
		if (tool) box.appendChild(el('a', { class: 'sa-open', href: '/' + tool.url, text: 'Open ' + tool.name }));
		if (opt.also && opt.also.length) {
			var also = el('p', { class: 'sa-also' }, ['Also consider: ']);
			opt.also.forEach(function (id, i) {
				var t = toolById(id);
				if (!t) return;
				if (i) also.appendChild(document.createTextNode(', '));
				also.appendChild(el('a', { href: '/' + t.url, text: t.name }));
			});
			box.appendChild(also);
		}
		var again = el('button', { type: 'button', class: 'sa-chip', text: 'Start over' });
		again.addEventListener('click', function () { finder(TOOL_FINDER, []); });
		box.appendChild(again);
		results.appendChild(box);
	}


	/* ------------------------------------------------ preview (SA-07) */

	/* Resting the pointer on a result for a moment opens the page it comes
	   from in a window to the left of the panel, scrolled to the passage,
	   which is outlined. The window stays while the visitor scrolls or reads
	   in it and switches when another result is hovered; its bar carries
	   "Go to this section", "Open page" and a close button. Desktop only: it
	   needs a fine pointer with hover and room beside the panel. The page is
	   the site's own, loaded same origin in an iframe, so nothing new is
	   requested from anywhere else. Up to PREVIEW_KEEP pages stay loaded, so
	   moving between results on the same page does not reload it. */
	var PREVIEW_DELAY = 260, PREVIEW_MIN_W = 440, PREVIEW_MAX_W = 820, PREVIEW_KEEP = 3, PREVIEW_GAP = 12;
	var preview = null, pvBody, pvLabel, pvTitle, pvSection, pvPage, pvLoading;
	var pvFrames = [], pvCurrent = null, pvTimer = null, pvCard = null, pvDoc = null;
	var pvMedia = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

	var PREVIEW_CSS = [
		'#header { display: none !important; }',
		'html { scroll-behavior: auto !important; }',
		'.sa-pv-target { outline: 2px solid #f2c94c !important; outline-offset: 4px; border-radius: 3px; }'
	].join('\n');

	function previewAllowed() {
		if (!pvMedia || !pvMedia.matches || !panel || panel.hidden) return false;
		return panel.getBoundingClientRect().left - PREVIEW_GAP - 16 >= PREVIEW_MIN_W;
	}

	function buildPreview() {
		preview = el('section', { class: 'sa-preview', 'aria-label': 'Page preview', hidden: '' });
		pvLabel = el('span', { class: 'sa-page' });
		pvTitle = el('span', { class: 'sa-pv-title' });
		pvSection = el('a', { class: 'sa-pv-btn sa-pv-main', href: '#', text: 'Go to this section' });
		pvPage = el('a', { class: 'sa-pv-btn', href: '#', text: 'Open page' });
		var x = el('button', { type: 'button', class: 'sa-close sa-pv-close', 'aria-label': 'Close preview', html: '&times;' });
		x.addEventListener('click', hidePreview);
		pvSection.addEventListener('click', function (e) {
			if (pvDoc && samePage(pvDoc.u) && pvDoc.u.indexOf('#') > 0) {
				e.preventDefault();
				var id = pvDoc.u.split('#')[1];
				close();
				jumpTo(id);
			}
		});
		pvPage.addEventListener('click', function (e) {
			if (pvDoc && samePage(pvDoc.u)) { e.preventDefault(); close(); window.scrollTo(0, 0); }
		});
		var head = el('div', { class: 'sa-pv-head' }, [
			el('div', { class: 'sa-pv-label' }, [pvLabel, pvTitle]),
			el('div', { class: 'sa-pv-actions' }, [pvSection, pvPage, x])
		]);
		pvLoading = el('p', { class: 'sa-pv-loading', text: 'Loading the page…' });
		pvBody = el('div', { class: 'sa-pv-body' }, [pvLoading]);
		preview.appendChild(head);
		preview.appendChild(pvBody);
		/* keep the pointer's way from the panel to the preview from switching it */
		preview.addEventListener('mouseenter', function () { clearTimeout(pvTimer); });
		document.body.appendChild(preview);
	}

	function placePreview() {
		var r = panel.getBoundingClientRect();
		var w = Math.min(PREVIEW_MAX_W, r.left - PREVIEW_GAP - 16);
		var bottom = Math.max(0, window.innerHeight - r.bottom);
		var h = Math.min(window.innerHeight - bottom - 16, Math.max(r.height, window.innerHeight * 0.84));
		preview.style.right = (window.innerWidth - r.left + PREVIEW_GAP) + 'px';
		preview.style.bottom = bottom + 'px';
		preview.style.width = w + 'px';
		preview.style.height = h + 'px';
	}

	function schedulePreview(d, art) {
		clearTimeout(pvTimer);
		if (!previewAllowed()) return;
		if (pvDoc === d && preview && !preview.hidden) return;
		pvTimer = setTimeout(function () { showPreview(d, art); }, PREVIEW_DELAY);
	}

	function showPreview(d, art) {
		if (!previewAllowed()) return;
		if (!preview) buildPreview();
		var parts = d.u.split('#'), path = parts[0], hash = parts[1] || '';
		pvDoc = d;
		if (pvCard) pvCard.classList.remove('is-previewed');
		pvCard = art;
		if (art) art.classList.add('is-previewed');
		pvLabel.textContent = d.p;
		pvTitle.textContent = d.t;
		pvSection.href = '/' + d.u;
		pvSection.hidden = !hash;
		pvPage.href = '/' + path;
		placePreview();
		preview.hidden = false;

		var entry = null;
		for (var i = 0; i < pvFrames.length; i++) if (pvFrames[i].path === path) entry = pvFrames[i];
		if (!entry) {
			var frame = el('iframe', { class: 'sa-preview-frame', title: 'Preview: ' + d.p, src: '/' + d.u });
			entry = { path: path, frame: frame, ready: false, hash: hash };
			frame.addEventListener('load', function () { frameLoaded(entry); });
			pvBody.appendChild(frame);
			pvFrames.push(entry);
			while (pvFrames.length > PREVIEW_KEEP) {
				var old = null;
				for (var k = 0; k < pvFrames.length && !old; k++) if (pvFrames[k] !== entry) old = pvFrames[k];
				pvFrames.splice(pvFrames.indexOf(old), 1);
				old.frame.remove();
			}
		}
		entry.hash = hash;
		pvCurrent = entry;
		for (var j = 0; j < pvFrames.length; j++) pvFrames[j].frame.classList.toggle('is-on', pvFrames[j] === entry && entry.ready);
		pvLoading.hidden = entry.ready;
		if (entry.ready) scrollFrame(entry, false);
	}

	function frameLoaded(entry) {
		var doc, win;
		try { doc = entry.frame.contentDocument; win = entry.frame.contentWindow; } catch (e) { doc = null; }
		if (!doc || !doc.body) return;
		/* a later load is a link the visitor followed inside the preview:
		   tidy that page too, but leave its scroll position alone */
		var first = !entry.ready;
		entry.ready = true;
		try { entry.path = win.location.pathname.replace(/^\//, '') || 'index.html'; } catch (e) {}
		var style = doc.createElement('style');
		style.textContent = PREVIEW_CSS;
		(doc.head || doc.documentElement).appendChild(style);
		/* floating controls (Top, rail, Contents, Prev / Next, the consent
		   banner) are no use in a small window and cover the text */
		var all = doc.body.getElementsByTagName('*');
		for (var i = 0; i < all.length; i++) {
			if (win.getComputedStyle(all[i]).position === 'fixed') all[i].style.setProperty('display', 'none', 'important');
		}
		if (first && pvCurrent === entry) {
			entry.frame.classList.add('is-on');
			pvLoading.hidden = true;
			scrollFrame(entry, true);
		}
	}

	function scrollFrame(entry, first) {
		var doc, win;
		try { doc = entry.frame.contentDocument; win = entry.frame.contentWindow; } catch (e) { return; }
		if (!doc) return;
		var prev = doc.querySelectorAll('.sa-pv-target');
		for (var i = 0; i < prev.length; i++) prev[i].classList.remove('sa-pv-target');
		var target = entry.hash ? doc.getElementById(entry.hash) : null;
		if (!target) {
			/* not an element: a hash the page's own script routes (a tool) */
			if (entry.hash && !first) { try { win.location.hash = entry.hash; } catch (e) {} }
			else if (!entry.hash) win.scrollTo(0, 0);
			return;
		}
		var p = target.parentNode;
		while (p && p !== doc.body) {
			if (p.tagName === 'DETAILS' && !p.open) p.open = true;
			p = p.parentNode;
		}
		target.classList.add('sa-pv-target');
		function go() { win.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + win.pageYOffset - 16)); }
		go();
		/* opened details and late fonts move things; settle once more */
		setTimeout(go, first ? 400 : 120);
	}

	function hidePreview() {
		clearTimeout(pvTimer);
		if (!preview || preview.hidden) return;
		preview.hidden = true;
		pvDoc = null;
		if (pvCard) pvCard.classList.remove('is-previewed');
		pvCard = null;
	}

	/* ------------------------------------------------- deep links */

	function openDetailsFor(target) {
		var p = target;
		while (p && p !== document.body) {
			if (p.tagName === 'DETAILS' && !p.open) p.open = true;
			p = p.parentNode;
		}
	}

	function jumpTo(id) {
		var target = document.getElementById(id);
		if (!target) { location.hash = '#' + id; return; }
		openDetailsFor(target);
		if (location.hash !== '#' + id) {
			try { history.pushState(null, '', '#' + id); } catch (e) { location.hash = '#' + id; }
		}
		target.scrollIntoView({ block: 'start' });
		target.classList.add('sa-flash');
		setTimeout(function () { target.classList.remove('sa-flash'); }, 2200);
		if (target.tabIndex < 0) target.setAttribute('tabindex', '-1');
		target.focus({ preventScroll: true });
	}

	function openDetailsForHash() {
		if (!location.hash || location.hash.length < 2) return;
		var target;
		try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { return; }
		if (!target) return;
		var p = target.parentNode;
		while (p && p !== document.body) {
			if (p.tagName === 'DETAILS' && !p.open) p.open = true;
			p = p.parentNode;
		}
		/* The browser scrolls to the fragment before fonts and late layout have
		   settled, which can leave the target a few pixels under the sticky
		   header; scroll again once things are stable. scrollIntoView honours
		   the page's scroll-margin-top. */
		setTimeout(function () { target.scrollIntoView({ block: 'start' }); }, 0);
		setTimeout(function () { target.scrollIntoView({ block: 'start' }); }, 400);
	}

	/* ------------------------------------------------------- boot */

	function boot() {
		if (!document.body) return;
		build();
		openDetailsForHash();
		window.addEventListener('hashchange', openDetailsForHash);
		if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
			/* on a hover device the index is cheap to fetch early; on a phone wait for the tap */
			setTimeout(function () { if ('requestIdleCallback' in window) requestIdleCallback(function () { load(); }); }, 4000);
		}
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
	else boot();

	window.siteAssistant = { open: function () { if (panel) open(); }, search: function (q) { return search(q, ''); }, suggest: suggest, load: load, tokenize: tokenize, _build: buildIndex, _buildQuestions: buildQuestions };
})();
