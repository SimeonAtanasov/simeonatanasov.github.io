	/* ------------------------------------------------- AI answers (SA-02) */

	/* Off unless both settings at the top of this file are filled in. Until
	   the visitor presses the Ask AI button nothing below runs, no script is
	   loaded from another host and no request leaves the page. On the press:
	   the Cloudflare Turnstile check is loaded and run, then the question and
	   the passages shown are posted to the site's own Worker, which answers
	   from those passages only. The answer is put on the page as text nodes,
	   never as HTML; the links are built here from the search results, not
	   taken from the model. */
	var AI_ON = !!(AI_ENDPOINT && AI_SITEKEY);
	var AI_NOTES = {
		not_covered: 'The AI could not answer this from the site’s own passages. The results below are the closest matches.',
		visitor_cap: 'You have used today’s AI answers. The search results below still work.',
		daily_cap: 'Today’s AI answers are used up; they return after midnight UTC. The search results below still work.',
		off: 'AI answers are switched off at the moment. The search results below still work.',
		robot_check: 'The check that you are not a robot did not pass. Try again.',
		stale: 'The site was updated a moment ago. Reload the page and ask again.',
		bad_followup: 'The follow-up could not be linked to the first answer. Ask it as a new question in the search box.',
		unavailable: 'The AI service could not be reached. Try again in a moment; the search results below still work.'
	};
	var AI_RETRY = { robot_check: true, unavailable: true };
	var aiRun = 0, tsLoading = null, tsWidget = null, tsBox = null, tsWaiting = null, tsTimer = null;

	function tsSettle(token, failed) {
		var w = tsWaiting;
		tsWaiting = null;
		clearTimeout(tsTimer);
		if (!w) return;
		if (failed) w.reject(new Error('robot_check')); else w.resolve(token);
	}

	function loadTurnstile() {
		if (window.turnstile && window.turnstile.render) return Promise.resolve();
		if (!tsLoading) {
			tsLoading = new Promise(function (resolve, reject) {
				var s = document.createElement('script');
				s.src = AI_TURNSTILE_SRC;
				s.async = true;
				s.onload = function () { if (window.turnstile && window.turnstile.render) resolve(); else { tsLoading = null; reject(new Error('robot_check')); } };
				s.onerror = function () { tsLoading = null; reject(new Error('robot_check')); };
				document.head.appendChild(s);
			});
		}
		return tsLoading;
	}

	/* One fresh token per request: a Turnstile token can be used once. */
	function aiToken() {
		return loadTurnstile().then(function () {
			return new Promise(function (resolve, reject) {
				if (tsWaiting) tsSettle('', true);
				tsWaiting = { resolve: resolve, reject: reject };
				tsTimer = setTimeout(function () { tsSettle('', true); }, 60000);
				try {
					if (tsWidget === null) {
						tsWidget = window.turnstile.render(tsBox, {
							sitekey: AI_SITEKEY,
							action: 'ask-ai',
							appearance: 'interaction-only',
							size: 'flexible',
							callback: function (token) { tsSettle(token, false); },
							'error-callback': function () { tsSettle('', true); return true; },
							'timeout-callback': function () { tsSettle('', true); }
						});
					} else {
						window.turnstile.reset(tsWidget);
					}
				} catch (e) {
					tsSettle('', true);
				}
			});
		});
	}

	function aiLink(d, label, cls) {
		var a = el('a', { class: cls, href: '/' + d.u, text: label, title: d.t });
		a.addEventListener('click', function (e) {
			if (samePage(d.u) && d.u.indexOf('#') > 0) {
				e.preventDefault();
				close();
				jumpTo(d.u.split('#')[1]);
			}
		});
		return a;
	}

	function aiPost(out, q, picked, prev, done) {
		var mine = aiRun;
		var wait = el('p', { class: 'sa-ai-wait', text: 'Checking that you are not a robot…' });
		out.appendChild(wait);
		aiToken().then(function (token) {
			if (mine !== aiRun) throw new Error('gone');
			wait.textContent = 'Writing an answer from the results…';
			var payload = { q: q, token: token, passages: picked.map(function (d) { return { t: d.t, x: d.x }; }) };
			if (prev) payload.prev = prev;
			return fetch(AI_ENDPOINT, {
				method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
		}).then(function (r) {
			return r.json().catch(function () { return {}; }).then(function (data) { return { http: r.status, data: data || {} }; });
		}).then(function (res) {
			if (mine !== aiRun) return;
			wait.remove();
			if (res.http === 200 && res.data.status === 'ok' && typeof res.data.answer === 'string') done('', res.data);
			else if (res.http === 200) done('not_covered', res.data);
			else done(AI_NOTES[res.data.error] ? res.data.error : 'unavailable', res.data);
		}).catch(function (e) {
			if (mine !== aiRun || (e && e.message === 'gone')) return;
			wait.remove();
			done(e && e.message === 'robot_check' ? 'robot_check' : 'unavailable', {});
		});
	}

	/* The answer as text nodes; a [n] the Worker let through becomes a link
	   to result n. */
	function aiAnswer(data, picked) {
		var wrap = el('div', { class: 'sa-ai-answer', 'data-ai-generated': 'true' });
		wrap.appendChild(el('p', { class: 'sa-ai-label', text: 'AI-generated answer' }));
		String(data.answer).split(/\n\n+/).forEach(function (para) {
			var p = el('p', { class: 'sa-ai-text' });
			para.split(/(\[\d+\])/).forEach(function (part) {
				var m = /^\[(\d+)\]$/.exec(part);
				var d = m ? picked[parseInt(m[1], 10) - 1] : null;
				if (d) p.appendChild(aiLink(d, '[' + m[1] + ']', 'sa-ai-cite'));
				else if (part && !m) p.appendChild(document.createTextNode(part));
			});
			wrap.appendChild(p);
		});
		var list = el('ol', { class: 'sa-ai-sources' });
		(Array.isArray(data.cites) ? data.cites : []).forEach(function (n) {
			var d = picked[n - 1];
			if (d) list.appendChild(el('li', { value: String(n) }, [aiLink(d, d.t, 'sa-ai-source'), el('span', { class: 'sa-ai-page', text: ' (' + d.p + ')' })]));
		});
		if (list.children.length) {
			wrap.appendChild(el('p', { class: 'sa-ai-based', text: 'Based on these passages of the site:' }));
			wrap.appendChild(list);
		}
		wrap.appendChild(el('p', { class: 'sa-ai-warn', text: 'Written by an AI model from the passages above. It can be wrong or incomplete: check the passages. Not legal advice.' }));
		return wrap;
	}

	function aiNote(code) {
		return el('p', { class: 'sa-ai-msg', text: AI_NOTES[code] || AI_NOTES.unavailable });
	}

	function aiLeft(data) {
		if (typeof data.left !== 'number' || data.left > 2) return null;
		return el('p', { class: 'sa-ai-left', text: data.left === 0 ? 'That was your last AI answer for today.' : 'AI answers left for you today: ' + data.left + '.' });
	}

	function aiFollowUp(out, firstQ, first, picked) {
		var form = el('form', { class: 'sa-ai-form' });
		var field = el('input', { type: 'text', class: 'sa-ai-input', maxlength: '300', placeholder: 'One follow-up question', 'aria-label': 'One follow-up question', autocomplete: 'off' });
		var go = el('button', { type: 'submit', class: 'sa-ai-go', text: 'Ask' });
		form.appendChild(field);
		form.appendChild(go);
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var q2 = field.value.replace(/\s+/g, ' ').trim();
			if (q2.length < 3 || go.disabled) return;
			/* passages for the follow-up: the best of the first round plus the best for the new wording */
			var next = picked.slice(0, 3);
			search(q2, '').results.some(function (x) {
				if (next.indexOf(x.doc) < 0) next.push(x.doc);
				return next.length >= AI_PASSAGES + 1;
			});
			field.disabled = true;
			go.disabled = true;
			var asked = el('p', { class: 'sa-ai-asked' }, [el('span', { class: 'sa-ai-you', text: 'Follow-up: ' }), q2]);
			out.insertBefore(asked, form);
			aiPost(out, q2, next, { q: firstQ, a: first.answer, sig: first.sig }, function (code, data) {
				if (code && AI_RETRY[code]) {
					asked.remove();
					out.appendChild(aiNote(code));
					field.disabled = false;
					go.disabled = false;
					return;
				}
				form.remove();
				out.appendChild(code ? aiNote(code) : aiAnswer(data, next));
				var left = aiLeft(data);
				if (left) out.appendChild(left);
				out.appendChild(el('p', { class: 'sa-ai-end', text: 'That was the one follow-up. For another question, use the search box above.' }));
			});
		});
		return form;
	}

	/* The block above the results: the button, what pressing it does, and
	   then the answer. Rebuilt with every search, which also drops any
	   answer still on its way for the previous wording. */
	function aiBox(query, picked) {
		var box = el('div', { class: 'sa-ai' });
		var btn = el('button', { type: 'button', class: 'sa-ai-btn', text: 'Ask AI to answer from these results' });
		var note = el('p', { class: 'sa-ai-note' }, [
			'Optional. Pressing the button sends your question and the top ' + (picked.length === 1 ? 'result' : picked.length + ' results') +
			' to an AI model hosted by Cloudflare, after a check that you are not a robot. The answer is AI-generated and can be wrong; it is not legal advice. Do not include personal or confidential information. ',
			el('a', { href: '/privacy-notice.html#ai-answers', text: 'What happens to your question' })
		]);
		var out = el('div', { class: 'sa-ai-out', 'aria-live': 'polite' });
		btn.addEventListener('click', function () {
			if (btn.disabled) return;
			btn.disabled = true;
			out.innerHTML = '';
			aiPost(out, query, picked, null, function (code, data) {
				if (code) {
					out.appendChild(aiNote(code));
					if (AI_RETRY[code]) btn.disabled = false; else btn.hidden = true;
				} else {
					btn.hidden = true;
					note.hidden = true;
					out.appendChild(aiAnswer(data, picked));
				}
				var left = aiLeft(data);
				if (left) out.appendChild(left);
				if (!code && data.followup && typeof data.sig === 'string' && data.left !== 0) out.appendChild(aiFollowUp(out, query, data, picked));
			});
		});
		box.appendChild(btn);
		box.appendChild(note);
		box.appendChild(out);
		return box;
	}

