/* AI Act, ISO/IEC 42001 and NIST AI RMF crosswalk.
 * Reads window.CW_DATA (crosswalk-data.js, generated) and renders four views:
 * by AI Act obligation, by ISO/IEC 42001, by NIST AI RMF, and the published
 * AI RMF to ISO/IEC 42001 crosswalk. State lives in the URL hash so every view,
 * filter and item can be linked to. No storage, no network. */
(function () {
	"use strict";
	var D = window.CW_DATA;
	var app = document.getElementById("cw-app");
	if (!D || !app) return;

	var ISO = {};
	D.iso.forEach(function (x) { ISO[x.id] = x; });
	var NIST = {};
	D.nist.forEach(function (f) { f.cats.forEach(function (c) { c.subs.forEach(function (s) { NIST[s.id] = { id: s.id, text: s.text, cat: c.id }; }); }); });
	var THEME = {};
	D.themes.forEach(function (t) { THEME[t.id] = t.label; });

	// Reverse indexes: which rows cite an ISO item or a NIST subcategory, and what
	// the published crosswalk pairs with each.
	var rowsByIso = {}, rowsByNist = {}, hostedByNist = {}, hostedByIso = {};
	D.rows.forEach(function (r) {
		r.iso.forEach(function (i) { (rowsByIso[i] = rowsByIso[i] || []).push(r); });
		r.nist.forEach(function (n) { (rowsByNist[n] = rowsByNist[n] || []).push(r); });
	});
	D.hosted.forEach(function (h) {
		hostedByNist[h.nist] = h.equiv;
		h.equiv.forEach(function (i) { (hostedByIso[i] = hostedByIso[i] || []).push(h.nist); });
	});

	var state = { view: "aia", role: "all", theme: "all", q: "" };

	function el(tag, attrs, kids) {
		var e = document.createElement(tag);
		attrs = attrs || {};
		Object.keys(attrs).forEach(function (k) {
			if (k === "class") e.className = attrs[k];
			else if (k === "text") e.textContent = attrs[k];
			else e.setAttribute(k, attrs[k]);
		});
		(kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
		return e;
	}
	function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
	function isoAnchor(id) { return "iso-" + slug(id); }
	function nistAnchor(id) { return "nist-" + slug(id); }
	function rowAnchor(id) { return "cw-" + id; }

	function roleMatches(r) {
		if (state.role === "all") return true;
		if (state.role === "provider") return r.role === "provider" || r.role === "both";
		if (state.role === "deployer") return r.role === "deployer" || r.role === "both";
		return r.role === state.role;
	}
	function rowText(r) {
		return [r.obligation, r.note, r.aia.map(function (a) { return a.label + " " + a.title; }).join(" "),
			r.iso.map(function (i) { return i + " " + (ISO[i] ? ISO[i].title : ""); }).join(" "),
			r.nist.map(function (n) { return n + " " + (NIST[n] ? NIST[n].text : ""); }).join(" "),
			(r.related || []).map(function (x) { return x.id + " " + x.title; }).join(" ")].join(" ").toLowerCase();
	}

	/* ---------------- links between views ---------------- */
	function goTo(view, anchor) {
		state.view = view;
		if (view === "aia") { state.role = "all"; state.theme = "all"; state.q = ""; }
		render();
		writeHash(anchor);
		var t = anchor && document.getElementById(anchor);
		if (t) {
			t.classList.add("cw-flash");
			setTimeout(function () { t.classList.remove("cw-flash"); }, 1600);
			t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
		}
	}
	function linkTo(view, anchor, label, cls) {
		var a = el("a", { href: "#" + anchor, class: cls || "cw-ref" }, [label]);
		a.addEventListener("click", function (ev) { ev.preventDefault(); goTo(view, anchor); });
		return a;
	}
	function isoRef(id) {
		var x = ISO[id];
		return el("li", {}, [linkTo("iso", isoAnchor(id), id, "cw-ref cw-ref-id"), " ", el("span", { text: x ? x.title : "" })]);
	}
	function nistRef(id) {
		var x = NIST[id];
		return el("li", {}, [linkTo("nist", nistAnchor(id), id, "cw-ref cw-ref-id"), " ", el("span", { class: "cw-quote", text: x ? x.text : "" })]);
	}
	function rowRefs(list) {
		if (!list || !list.length) return el("p", { class: "cw-none", text: "Not linked to an AI Act obligation on this page." });
		var ul = el("ul", { class: "cw-reflist" });
		list.forEach(function (r) {
			ul.appendChild(el("li", {}, [
				linkTo("aia", rowAnchor(r.id), r.aia.map(function (a) { return a.label.replace("Article ", "Art. "); }).join(", "), "cw-ref cw-ref-id"),
				" ", el("span", { class: "cw-role cw-role-" + r.role, text: D.roles[r.role] }),
				" ", el("span", { text: r.obligation.split(". ")[0].replace(/\.$/, "") + "." })
			]));
		});
		return ul;
	}

	/* ---------------- view: by AI Act obligation ---------------- */
	function renderAia(main) {
		var bar = el("div", { class: "cw-filters", role: "group", "aria-label": "Filters" });
		var roleWrap = el("div", { class: "cw-chips", role: "radiogroup", "aria-label": "Role" });
		[["all", "All roles"], ["provider", "Provider"], ["deployer", "Deployer"], ["gpai", "GPAI model provider"]].forEach(function (o) {
			var b = el("button", { type: "button", class: "cw-chip" + (state.role === o[0] ? " is-on" : ""), role: "radio", "aria-checked": String(state.role === o[0]) }, [o[1]]);
			b.addEventListener("click", function () { state.role = o[0]; render(); writeHash(); });
			roleWrap.appendChild(b);
		});
		var themeSel = el("select", { "aria-label": "Theme", class: "cw-select" });
		themeSel.appendChild(el("option", { value: "all" }, ["All themes"]));
		D.themes.forEach(function (t) {
			var o = el("option", { value: t.id }, [t.label]);
			if (state.theme === t.id) o.selected = true;
			themeSel.appendChild(o);
		});
		themeSel.addEventListener("change", function () { state.theme = themeSel.value; render(); writeHash(); });
		var search = el("input", { type: "text", class: "cw-search", placeholder: "Search obligations, articles, controls, subcategories", "aria-label": "Search", value: state.q });
		search.addEventListener("input", function () {
			state.q = search.value;
			renderAiaList(list);
			writeHash();
		});
		bar.appendChild(roleWrap);
		bar.appendChild(el("div", { class: "cw-filter-row" }, [themeSel, search]));
		main.appendChild(bar);
		var list = el("div", { class: "cw-list" });
		main.appendChild(list);
		renderAiaList(list);
	}

	function renderAiaList(list) {
		list.innerHTML = "";
		var q = state.q.trim().toLowerCase();
		var shown = D.rows.filter(function (r) {
			return roleMatches(r) && (state.theme === "all" || r.theme === state.theme) && (!q || rowText(r).indexOf(q) !== -1);
		});
		list.appendChild(el("p", { class: "cw-count", text: shown.length + " of " + D.rows.length + " obligations" }));
		var lastTheme = null;
		shown.forEach(function (r) {
			if (r.theme !== lastTheme) {
				list.appendChild(el("h3", { class: "cw-theme", text: THEME[r.theme] }));
				lastTheme = r.theme;
			}
			list.appendChild(rowCard(r));
		});
		if (!shown.length) list.appendChild(el("p", { class: "cw-none", text: "No obligation matches these filters." }));
	}

	function rowCard(r) {
		var head = el("div", { class: "cw-card-head" });
		r.aia.forEach(function (a) {
			head.appendChild(el("a", { class: "cw-art", href: "ai-act-digest.html#" + a.id, title: a.title }, [a.label]));
		});
		head.appendChild(el("span", { class: "cw-role cw-role-" + r.role, text: D.roles[r.role] }));
		if (r.gap === "none") head.appendChild(el("span", { class: "cw-gap cw-gap-none", text: "No equivalent" }));
		else if (r.gap === "partial") head.appendChild(el("span", { class: "cw-gap cw-gap-partial", text: "Partial match" }));

		var titles = el("p", { class: "cw-art-titles", text: r.aia.map(function (a) { return a.title; }).join(" / ") + ". Applies: " + r.applies + "." });
		var cols = el("div", { class: "cw-cols" });
		var isoCol = el("div", { class: "cw-col" }, [el("h4", { text: "ISO/IEC 42001" })]);
		if (r.iso.length) {
			var ul1 = el("ul", { class: "cw-reflist" });
			r.iso.forEach(function (i) { ul1.appendChild(isoRef(i)); });
			isoCol.appendChild(ul1);
		} else isoCol.appendChild(el("p", { class: "cw-none", text: "No equivalent." }));
		(r.related || []).forEach(function (x) {
			isoCol.appendChild(el("p", { class: "cw-related" }, [el("strong", { text: "Related standard: " }), x.id + ", " + x.title + ". ", el("span", { class: "cw-quote", text: x.note })]));
		});
		var nistCol = el("div", { class: "cw-col" }, [el("h4", { text: "NIST AI RMF 1.0" })]);
		if (r.nist.length) {
			var ul2 = el("ul", { class: "cw-reflist" });
			r.nist.forEach(function (n) { ul2.appendChild(nistRef(n)); });
			nistCol.appendChild(ul2);
		} else nistCol.appendChild(el("p", { class: "cw-none", text: "No equivalent." }));
		cols.appendChild(isoCol);
		cols.appendChild(nistCol);

		var card = el("article", { class: "cw-card", id: rowAnchor(r.id) }, [
			head, el("p", { class: "cw-obl", text: r.obligation }), titles, cols
		]);
		if (r.note) card.appendChild(el("p", { class: "cw-note" }, [el("strong", { text: "Note: " }), r.note]));
		if (r.tool) {
			var label = { fria: "Fundamental Rights Impact Assessment", genai: "Generative AI Risk Assessment" }[r.tool];
			card.appendChild(el("p", { class: "cw-tool" }, ["Run it: ", el("a", { href: "privacy-ai-assessment.html#tool-" + r.tool }, [label])]));
		}
		var copy = el("a", { href: "#" + rowAnchor(r.id), class: "cw-permalink", "aria-label": "Link to this obligation" }, ["Link"]);
		card.appendChild(copy);
		return card;
	}

	/* ---------------- view: by ISO/IEC 42001 ---------------- */
	function renderIso(main) {
		main.appendChild(el("p", { class: "cw-lede", text: "Every clause of the management system and every Annex A control, with the AI Act obligations on this page that cite it and the NIST subcategories the published crosswalk pairs it with. Titles only; the standard's text is not reproduced." }));
		var clauses = D.iso.filter(function (x) { return x.kind === "clause"; });
		var controls = D.iso.filter(function (x) { return x.kind === "control"; });
		var groups = [];
		clauses.forEach(function (x) {
			var g = "c" + x.group;
			if (!groups.length || groups[groups.length - 1].key !== g) groups.push({ key: g, title: "Clause " + x.group + ". " + D.isoClauseGroups[x.group], items: [] });
			groups[groups.length - 1].items.push(x);
		});
		controls.forEach(function (x) {
			var g = "a" + x.group;
			if (!groups.length || groups[groups.length - 1].key !== g) groups.push({ key: g, title: "Annex " + x.group + ". " + D.isoAnnexGroups[x.group], items: [] });
			groups[groups.length - 1].items.push(x);
		});
		groups.forEach(function (g) {
			main.appendChild(el("h3", { class: "cw-theme", text: g.title }));
			g.items.forEach(function (x) {
				var item = el("article", { class: "cw-card cw-item", id: isoAnchor(x.id) }, [
					el("div", { class: "cw-card-head" }, [el("span", { class: "cw-id", text: x.id }), el("span", { class: "cw-item-title", text: x.title })])
				]);
				item.appendChild(el("h4", { text: "AI Act obligations" }));
				item.appendChild(rowRefs(rowsByIso[x.id]));
				var hn = hostedByIso[x.id] || [];
				item.appendChild(el("h4", { text: "NIST subcategories (published crosswalk)" }));
				if (hn.length) {
					var p = el("p", { class: "cw-inline-refs" });
					hn.forEach(function (n, i) { if (i) p.appendChild(document.createTextNode(", ")); p.appendChild(linkTo("nist", nistAnchor(n), n)); });
					item.appendChild(p);
				} else item.appendChild(el("p", { class: "cw-none", text: "None listed." }));
				main.appendChild(item);
			});
		});
	}

	/* ---------------- view: by NIST AI RMF ---------------- */
	function renderNist(main) {
		main.appendChild(el("p", { class: "cw-lede", text: "All 72 subcategories of the AI RMF Core, quoted from NIST AI 100-1, with the AI Act obligations on this page that cite each one and the ISO/IEC 42001 references the published crosswalk gives it." }));
		D.nist.forEach(function (f) {
			main.appendChild(el("h3", { class: "cw-theme", text: f.id }));
			f.cats.forEach(function (c) {
				main.appendChild(el("p", { class: "cw-cat" }, [el("strong", { text: c.id + ". " }), c.text]));
				c.subs.forEach(function (s) {
					var item = el("article", { class: "cw-card cw-item", id: nistAnchor(s.id) }, [
						el("div", { class: "cw-card-head" }, [el("span", { class: "cw-id", text: s.id })]),
						el("p", { class: "cw-quote", text: s.text })
					]);
					item.appendChild(el("h4", { text: "AI Act obligations" }));
					item.appendChild(rowRefs(rowsByNist[s.id]));
					var hi = hostedByNist[s.id] || [];
					item.appendChild(el("h4", { text: "ISO/IEC 42001 (published crosswalk)" }));
					if (hi.length) {
						var p = el("p", { class: "cw-inline-refs" });
						hi.forEach(function (i, k) {
							if (k) p.appendChild(document.createTextNode(", "));
							if (ISO[i]) p.appendChild(linkTo("iso", isoAnchor(i), i));
							else p.appendChild(document.createTextNode(i));
						});
						item.appendChild(p);
					} else item.appendChild(el("p", { class: "cw-none", text: "None listed." }));
					main.appendChild(item);
				});
			});
		});
	}

	/* ---------------- view: published crosswalk ---------------- */
	function renderHosted(main) {
		main.appendChild(el("p", { class: "cw-lede" }, [
			"The AI RMF to ISO/IEC 42001 crosswalk hosted by NIST, as printed, with the guidance annex references (B.x) converted to the matching Annex A controls (A.x). It was written against the final draft of the standard; NIST hosts it without endorsing it. Two entries look like errors in the source and are kept as printed: MAP 1.4 cites B.2.2 for customers, where B.10.4 would be expected, and MAP 1.5 cites 6.1.1 as “Objective”, a clause the standard titles General. ",
			el("a", { href: "https://airc.nist.gov/airmf-resources/crosswalks/", target: "_blank", rel: "noopener" }, ["Source"]), "."
		]));
		var wrap = el("div", { class: "cw-table-wrap" });
		var t = el("table", { class: "cw-table" });
		t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "NIST AI RMF" }), el("th", { text: "As printed" }), el("th", { text: "ISO/IEC 42001 clause or control" })])]));
		var tb = el("tbody");
		D.hosted.forEach(function (h) {
			var cell = el("td");
			h.equiv.forEach(function (i, k) {
				if (k) cell.appendChild(document.createTextNode(", "));
				if (ISO[i]) cell.appendChild(linkTo("iso", isoAnchor(i), i));
				else cell.appendChild(document.createTextNode(i));
			});
			tb.appendChild(el("tr", {}, [el("td", {}, [linkTo("nist", nistAnchor(h.nist), h.nist)]), el("td", { text: h.printed.join(", ") }), cell]));
		});
		t.appendChild(tb);
		wrap.appendChild(t);
		main.appendChild(wrap);
	}

	/* ---------------- shell, tabs, hash ---------------- */
	var VIEWS = [["aia", "By AI Act obligation"], ["iso", "By ISO/IEC 42001"], ["nist", "By NIST AI RMF"], ["hosted", "Published NIST to ISO crosswalk"]];

	function render() {
		app.innerHTML = "";
		var tabs = el("div", { class: "cw-tabs", role: "tablist", "aria-label": "Views" });
		VIEWS.forEach(function (v) {
			var b = el("button", { type: "button", class: "cw-tab" + (state.view === v[0] ? " is-on" : ""), role: "tab", "aria-selected": String(state.view === v[0]), id: "cw-tab-" + v[0] }, [v[1]]);
			b.addEventListener("click", function () { state.view = v[0]; render(); writeHash(); });
			tabs.appendChild(b);
		});
		app.appendChild(tabs);
		var main = el("div", { class: "cw-view", role: "tabpanel", "aria-labelledby": "cw-tab-" + state.view });
		app.appendChild(main);
		if (state.view === "iso") renderIso(main);
		else if (state.view === "nist") renderNist(main);
		else if (state.view === "hosted") renderHosted(main);
		else renderAia(main);
	}

	function writeHash(anchor) {
		var parts = ["view=" + state.view];
		if (state.view === "aia") {
			if (state.role !== "all") parts.push("role=" + state.role);
			if (state.theme !== "all") parts.push("theme=" + state.theme);
			if (state.q) parts.push("q=" + encodeURIComponent(state.q));
		}
		var h = anchor ? anchor : parts.join("&");
		if (history.replaceState) history.replaceState(null, "", "#" + h);
	}

	function readHash() {
		var h = (location.hash || "").replace(/^#/, "");
		if (!h) return null;
		if (/^cw-r\d+$/.test(h)) { state.view = "aia"; return h; }
		if (/^iso-/.test(h)) { state.view = "iso"; return h; }
		if (/^nist-/.test(h)) { state.view = "nist"; return h; }
		h.split("&").forEach(function (kv) {
			var p = kv.split("=");
			var v = decodeURIComponent(p[1] || "");
			if (p[0] === "view" && /^(aia|iso|nist|hosted)$/.test(v)) state.view = v;
			if (p[0] === "role" && /^(all|provider|deployer|gpai)$/.test(v)) state.role = v;
			if (p[0] === "theme" && THEME[v]) state.theme = v;
			if (p[0] === "q") state.q = v;
		});
		return null;
	}

	var anchor = readHash();
	render();
	if (anchor) {
		var t = document.getElementById(anchor);
		if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 0);
	}
	window.addEventListener("hashchange", function () {
		var a = readHash();
		render();
		if (a) { var t = document.getElementById(a); if (t) t.scrollIntoView({ block: "start" }); }
	});
})();
