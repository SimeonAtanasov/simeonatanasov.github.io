/* GDPR, ISO/IEC 27701 (2019 numbering) and NIST Privacy Framework 1.0 crosswalk.
 * Reads window.PC_DATA (crosswalk-data.js, generated) and renders four views:
 * by GDPR obligation, by ISO/IEC 27701 clause, by NIST subcategory, and the
 * published mappings the page rests on. State lives in the URL hash so every
 * view, filter and item can be linked to. No storage, no network. */
(function () {
	"use strict";
	var D = window.PC_DATA;
	var app = document.getElementById("pc-app");
	if (!D || !app) return;

	var ISO = {};
	D.iso.forEach(function (x) { ISO[x.id] = x; });
	var NIST = {};
	D.nist.forEach(function (f) { f.cats.forEach(function (c) { c.subs.forEach(function (s) { NIST[s.id] = { id: s.id, text: s.text, cat: c.id }; }); }); });
	var THEME = {};
	D.themes.forEach(function (t) { THEME[t.id] = t.label; });
	var SRC = {
		S: ["site's reading", "This site's own reading of the GDPR provision and of the subcategory text"],
		A: ["agrees with NIST-hosted crosswalk", "Cross-check: the GDPR crosswalk hosted by NIST, a third-party work, pairs the same subcategory with a provision of this row"]
	};

	// Reverse indexes.
	var rowsByIso = {}, rowsByNist = {}, provByIso = {}, nistByIso = {}, isoByNist = {}, pfRowByNist = {};
	D.rows.forEach(function (r) {
		r.iso.forEach(function (i) { (rowsByIso[i] = rowsByIso[i] || []).push(r); });
		r.nist.forEach(function (n) { (rowsByNist[n.id] = rowsByNist[n.id] || []).push(r); });
	});
	D.pub.gdprIso.forEach(function (p) {
		p.iso.forEach(function (i) { (provByIso[i] = provByIso[i] || []).push(p.label); });
	});
	D.pub.pfIso.forEach(function (p) {
		if (!p.pf10) return;
		pfRowByNist[p.pf10] = p;
		isoByNist[p.pf10] = p.iso;
		p.iso.forEach(function (i) { (nistByIso[i] = nistByIso[i] || []).push(p.pf10); });
	});

	var state = { view: "gdpr", role: "all", theme: "all", q: "", gap: false };

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
	function ext(href, label) { return el("a", { href: href, target: "_blank", rel: "noopener noreferrer" }, [label]); }
	function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
	function isoAnchor(id) { return "iso-" + slug(id); }
	function nistAnchor(id) { return "nist-" + slug(id); }
	function rowAnchor(id) { return "pc-" + id; }
	function isoSort(a, b) {
		var x = a.split("."), y = b.split(".");
		for (var i = 0; i < Math.max(x.length, y.length); i++) {
			var d = (parseInt(x[i] || "0", 10)) - (parseInt(y[i] || "0", 10));
			if (d) return d;
		}
		return 0;
	}

	function roleMatches(r) {
		if (state.role === "all") return true;
		return r.role === state.role || r.role === "both";
	}
	function rowText(r) {
		return [r.obligation, r.note, r.gdpr.map(function (a) { return a.label + " " + a.title; }).join(" "),
			r.iso.map(function (i) { return i + " " + (ISO[i] ? ISO[i].title : ""); }).join(" "),
			r.nist.map(function (n) { return n.id + " " + (NIST[n.id] ? NIST[n.id].text : ""); }).join(" ")].join(" ").toLowerCase();
	}

	/* ---------------- links between views ---------------- */
	function goTo(view, anchor) {
		state.view = view;
		if (view === "gdpr") { state.role = "all"; state.theme = "all"; state.q = ""; state.gap = false; }
		render();
		writeHash(anchor);
		var t = anchor && document.getElementById(anchor);
		if (t) {
			t.classList.add("pc-flash");
			setTimeout(function () { t.classList.remove("pc-flash"); }, 1600);
			t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
		}
	}
	function linkTo(view, anchor, label, cls) {
		var a = el("a", { href: "#" + anchor, class: cls || "pc-ref" }, [label]);
		a.addEventListener("click", function (ev) { ev.preventDefault(); goTo(view, anchor); });
		return a;
	}
	function isoRef(id) {
		var x = ISO[id];
		return el("li", {}, [linkTo("iso", isoAnchor(id), id, "pc-ref pc-ref-id"), " ", el("span", { text: x ? x.title : "" })]);
	}
	function srcChips(src) {
		var w = el("span", { class: "pc-srcs" });
		src.forEach(function (k) { w.appendChild(el("span", { class: "pc-src pc-src-" + k.toLowerCase(), title: SRC[k][1], text: SRC[k][0] })); });
		return w;
	}
	function nistRef(n) {
		var x = NIST[n.id];
		return el("li", {}, [linkTo("nist", nistAnchor(n.id), n.id, "pc-ref pc-ref-id"), " ", el("span", { class: "pc-quote", text: x ? x.text : "" }), " ", srcChips(n.src)]);
	}
	function inlineRefs(view, ids, anchorFn) {
		var p = el("p", { class: "pc-inline-refs" });
		ids.forEach(function (i, k) { if (k) p.appendChild(document.createTextNode(", ")); p.appendChild(linkTo(view, anchorFn(i), i)); });
		return p;
	}
	function rowRefs(list, nistId) {
		if (!list || !list.length) return el("p", { class: "pc-none", text: "Not cited by a GDPR obligation on this page." });
		var ul = el("ul", { class: "pc-reflist" });
		list.forEach(function (r) {
			var kids = [
				linkTo("gdpr", rowAnchor(r.id), r.gdpr.map(function (a) { return a.label.replace("Article ", "Art. "); }).join(", "), "pc-ref pc-ref-id"),
				" ", el("span", { class: "pc-role pc-role-" + r.role, text: D.roles[r.role] }),
				" ", el("span", { text: r.obligation.split(". ")[0].replace(/\.$/, "") + "." })
			];
			if (nistId) r.nist.forEach(function (n) { if (n.id === nistId) { kids.push(" "); kids.push(srcChips(n.src)); } });
			ul.appendChild(el("li", {}, kids));
		});
		return ul;
	}

	/* ---------------- view: by GDPR obligation ---------------- */
	function renderGdpr(main) {
		var bar = el("div", { class: "pc-filters", role: "group", "aria-label": "Filters" });
		var roleWrap = el("div", { class: "pc-chips", role: "radiogroup", "aria-label": "Role" });
		[["all", "All roles"], ["controller", "Controller"], ["processor", "Processor"]].forEach(function (o) {
			var b = el("button", { type: "button", class: "pc-chip" + (state.role === o[0] ? " is-on" : ""), role: "radio", "aria-checked": String(state.role === o[0]) }, [o[1]]);
			b.addEventListener("click", function () { state.role = o[0]; render(); writeHash(); });
			roleWrap.appendChild(b);
		});
		var gapBtn = el("button", { type: "button", class: "pc-chip pc-chip-gap" + (state.gap ? " is-on" : ""), "aria-pressed": String(state.gap) }, ["Only where the Privacy Framework falls short"]);
		gapBtn.addEventListener("click", function () { state.gap = !state.gap; render(); writeHash(); });
		roleWrap.appendChild(gapBtn);
		var themeSel = el("select", { "aria-label": "Theme", class: "pc-select" });
		themeSel.appendChild(el("option", { value: "all" }, ["All themes"]));
		D.themes.forEach(function (t) {
			var o = el("option", { value: t.id }, [t.label]);
			if (state.theme === t.id) o.selected = true;
			themeSel.appendChild(o);
		});
		themeSel.addEventListener("change", function () { state.theme = themeSel.value; render(); writeHash(); });
		var search = el("input", { type: "text", class: "pc-search", placeholder: "Search obligations, articles, clauses, subcategories", "aria-label": "Search", value: state.q });
		search.addEventListener("input", function () {
			state.q = search.value;
			renderGdprList(list);
			writeHash();
		});
		bar.appendChild(roleWrap);
		bar.appendChild(el("div", { class: "pc-filter-row" }, [themeSel, search]));
		main.appendChild(bar);
		var legend = el("p", { class: "pc-legend" }, ["The marks on a NIST reference: "]);
		["S", "A"].forEach(function (k) {
			legend.appendChild(el("span", { class: "pc-src pc-src-" + k.toLowerCase(), text: SRC[k][0] }));
			legend.appendChild(document.createTextNode(" " + SRC[k][1].charAt(0).toLowerCase() + SRC[k][1].slice(1) + ". "));
		});
		legend.appendChild(document.createTextNode("Every ISO reference is as published in the Data Protection Mapping Project."));
		main.appendChild(legend);
		var list = el("div", { class: "pc-list" });
		main.appendChild(list);
		renderGdprList(list);
	}

	function renderGdprList(list) {
		list.innerHTML = "";
		var q = state.q.trim().toLowerCase();
		var shown = D.rows.filter(function (r) {
			return roleMatches(r) && (state.theme === "all" || r.theme === state.theme) && (!state.gap || r.gap) && (!q || rowText(r).indexOf(q) !== -1);
		});
		list.appendChild(el("p", { class: "pc-count", text: shown.length + " of " + D.rows.length + " obligations" }));
		var lastTheme = null;
		shown.forEach(function (r) {
			if (r.theme !== lastTheme) {
				list.appendChild(el("h3", { class: "pc-theme", text: THEME[r.theme] }));
				lastTheme = r.theme;
			}
			list.appendChild(rowCard(r));
		});
		if (!shown.length) list.appendChild(el("p", { class: "pc-none", text: "No obligation matches these filters." }));
	}

	function isoColumn(r) {
		var col = el("div", { class: "pc-col" }, [el("h4", { text: "ISO/IEC 27701:2019 numbering" })]);
		if (!r.iso.length) {
			col.appendChild(el("p", { class: "pc-none", text: "No clause listed in the published mapping." }));
			return col;
		}
		var main = r.iso.filter(function (i) { return i.charAt(0) !== "6"; });
		var sec = r.iso.filter(function (i) { return i.charAt(0) === "6"; });
		if (sec.length <= 4) { main = r.iso.slice(); sec = []; }
		if (main.length) {
			var ul = el("ul", { class: "pc-reflist" });
			main.forEach(function (i) { ul.appendChild(isoRef(i)); });
			col.appendChild(ul);
		}
		if (sec.length) {
			var det = el("details", { class: "pc-more" }, [el("summary", { text: sec.length + " clauses of the security guidance (clause 6)" })]);
			var ul2 = el("ul", { class: "pc-reflist" });
			sec.forEach(function (i) { ul2.appendChild(isoRef(i)); });
			det.appendChild(ul2);
			col.appendChild(det);
		}
		return col;
	}

	function rowCard(r) {
		var head = el("div", { class: "pc-card-head" });
		r.gdpr.forEach(function (a) {
			head.appendChild(el("a", { class: "pc-art", href: a.href, title: a.title + " (EUR-Lex)", target: "_blank", rel: "noopener noreferrer" }, [a.label]));
		});
		head.appendChild(el("span", { class: "pc-role pc-role-" + r.role, text: D.roles[r.role] }));
		if (r.gap === "none") head.appendChild(el("span", { class: "pc-gap pc-gap-none", text: "No NIST equivalent" }));
		else if (r.gap === "partial") head.appendChild(el("span", { class: "pc-gap pc-gap-partial", text: "NIST: partial match" }));

		var seen = {}, titles = [];
		r.gdpr.forEach(function (a) { if (!seen[a.n]) { seen[a.n] = 1; titles.push(a.title); } });
		var cols = el("div", { class: "pc-cols" });
		var nistCol = el("div", { class: "pc-col" }, [el("h4", { text: "NIST Privacy Framework 1.0" })]);
		if (r.nist.length) {
			var ul2 = el("ul", { class: "pc-reflist" });
			r.nist.forEach(function (n) { ul2.appendChild(nistRef(n)); });
			nistCol.appendChild(ul2);
		} else nistCol.appendChild(el("p", { class: "pc-none", text: "No equivalent." }));
		cols.appendChild(isoColumn(r));
		cols.appendChild(nistCol);

		var card = el("article", { class: "pc-card", id: rowAnchor(r.id) }, [
			head, el("p", { class: "pc-obl", text: r.obligation }), el("p", { class: "pc-art-titles", text: titles.join(" / ") + "." }), cols
		]);
		if (r.note) card.appendChild(el("p", { class: "pc-note" }, [el("strong", { text: "Note: " }), r.note]));
		if (r.tool) card.appendChild(el("p", { class: "pc-tool" }, ["Related tool: ", el("a", { href: r.tool.href }, [r.tool.label])]));
		card.appendChild(el("a", { href: "#" + rowAnchor(r.id), class: "pc-permalink", "aria-label": "Link to this obligation" }, ["Link"]));
		return card;
	}

	/* ---------------- view: by ISO/IEC 27701 clause ---------------- */
	function renderIso(main) {
		main.appendChild(el("p", { class: "pc-lede", text: "Every clause the Data Protection Mapping Project lists for ISO/IEC 27701, in the numbering of the 2019 edition, with the GDPR obligations on this page whose provisions it is paired with, the provisions themselves and the Privacy Framework subcategories the same project pairs it with. Numbers and titles only: the text of the standard is not reproduced, and the 2019 edition is withdrawn." }));
		var TOP = { "5": "Clause 5", "6": "Clause 6", "7": "Clause 7", "8": "Clause 8" };
		var lastTop = null, lastGroup = null, lastSub = null;
		D.iso.forEach(function (x) {
			var parts = x.id.split(".");
			if (parts.length === 1) {
				main.appendChild(el("h3", { class: "pc-theme", text: (TOP[x.id] || x.id) + ". " + x.title }));
				lastTop = x.id;
				return;
			}
			if (!x.leaf) {
				if (parts.length === 2) main.appendChild(el("h4", { class: "pc-group", text: x.id + " " + x.title }));
				else if (x.title) main.appendChild(el("p", { class: "pc-cat" }, [el("strong", { text: x.id + " " }), x.title]));
				return;
			}
			var item = el("article", { class: "pc-card pc-item", id: isoAnchor(x.id) }, [
				el("div", { class: "pc-card-head" }, [el("span", { class: "pc-id", text: x.id }), el("span", { class: "pc-item-title", text: x.title })])
			]);
			item.appendChild(el("h4", { text: "GDPR obligations on this page" }));
			item.appendChild(rowRefs(rowsByIso[x.id]));
			var pv = provByIso[x.id] || [];
			item.appendChild(el("h4", { text: "GDPR provisions (published mapping)" }));
			item.appendChild(pv.length ? el("p", { class: "pc-inline-refs", text: pv.join(", ") }) : el("p", { class: "pc-none", text: "None listed." }));
			var hn = (nistByIso[x.id] || []).slice();
			item.appendChild(el("h4", { text: "NIST subcategories (published mapping)" }));
			item.appendChild(hn.length ? inlineRefs("nist", hn, nistAnchor) : el("p", { class: "pc-none", text: "None listed." }));
			main.appendChild(item);
		});
	}

	/* ---------------- view: by NIST Privacy Framework ---------------- */
	function renderNist(main) {
		main.appendChild(el("p", { class: "pc-lede", text: "All 100 subcategories of the Privacy Framework Version 1.0 Core, quoted as NIST publishes them, with the GDPR obligations on this page that cite each one and the ISO/IEC 27701 clauses, in the 2019 numbering, that the Data Protection Mapping Project pairs it with." }));
		D.nist.forEach(function (f) {
			main.appendChild(el("h3", { class: "pc-theme", text: f.name + " (" + f.id + ")" }));
			f.cats.forEach(function (c) {
				main.appendChild(el("p", { class: "pc-cat" }, [el("strong", { text: c.name + " (" + c.id + "). " }), c.text]));
				c.subs.forEach(function (s) {
					var item = el("article", { class: "pc-card pc-item", id: nistAnchor(s.id) }, [
						el("div", { class: "pc-card-head" }, [el("span", { class: "pc-id", text: s.id })]),
						el("p", { class: "pc-quote", text: s.text })
					]);
					item.appendChild(el("h4", { text: "GDPR obligations on this page" }));
					item.appendChild(rowRefs(rowsByNist[s.id], s.id));
					item.appendChild(el("h4", { text: "ISO/IEC 27701:2019 numbering (published mapping)" }));
					var hi = isoByNist[s.id];
					if (hi && hi.length) {
						item.appendChild(inlineRefs("iso", hi, isoAnchor));
						var pr = pfRowByNist[s.id];
						if (pr.match !== "text") item.appendChild(el("p", { class: "pc-none", text: "The project's sheet carries the wording of the Privacy Framework preliminary draft for this subcategory; it is matched here by identifier." }));
						else if (pr.printed !== s.id) item.appendChild(el("p", { class: "pc-none", text: "Printed in the project's sheet as " + pr.printed + ", the identifier of the preliminary draft; the text is identical." }));
					} else item.appendChild(el("p", { class: "pc-none", text: "Not in the project's sheet, which follows the preliminary draft of the Privacy Framework. The NIST-hosted ISO/IEC 27701 crosswalk covers it; see the published mappings tab." }));
					main.appendChild(item);
				});
			});
		});
	}

	/* ---------------- view: published mappings ---------------- */
	function renderPub(main) {
		var M = D.pub.meta;
		main.appendChild(el("p", { class: "pc-lede" }, [
			"The mappings this page rests on, as published. Two come from the Data Protection Mapping Project, which is under the MIT licence and is reproduced here with its notice. Two are hosted by NIST and carry no licence, so they are described and linked, not reproduced. None has a column for ISO/IEC 27701:2025."
		]));

		main.appendChild(el("h3", { class: "pc-theme", id: "pub-gdpr-iso", text: "GDPR to ISO/IEC 27701:2019, Data Protection Mapping Project" }));
		main.appendChild(el("p", { class: "pc-attrib" }, [
			M.dpmp.copyright + " Used under the MIT licence. ", ext(M.dpmp.url, "Project"), ", ", ext(M.dpmp.licenceUrl, "licence"), ". Sheet \"GDPR\", commit " + M.dpmp.commit + ". " + D.pub.gdprIso.length + " GDPR provisions carry a clause; provisions without one are left out."
		]));
		var byArt = [], cur = null;
		D.pub.gdprIso.forEach(function (p) {
			if (!cur || cur.n !== p.n) { cur = { n: p.n, title: p.title, items: [] }; byArt.push(cur); }
			cur.items.push(p);
		});
		byArt.forEach(function (a) {
			var det = el("details", { class: "pc-more pc-pubart" }, [el("summary", {}, [el("strong", { text: "Article " + a.n }), " " + a.title + " (" + a.items.length + ")"])]);
			var t = el("table", { class: "pc-table" });
			t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Provision" }), el("th", { text: "ISO/IEC 27701:2019 clause" })])]));
			var tb = el("tbody");
			a.items.forEach(function (p) {
				var cell = el("td");
				p.iso.forEach(function (i, k) { if (k) cell.appendChild(document.createTextNode(", ")); cell.appendChild(linkTo("iso", isoAnchor(i), i)); });
				tb.appendChild(el("tr", {}, [el("td", { text: p.label }), cell]));
			});
			t.appendChild(tb);
			det.appendChild(el("div", { class: "pc-table-wrap" }, [t]));
			main.appendChild(det);
		});

		main.appendChild(el("h3", { class: "pc-theme", id: "pub-pf-iso", text: "Privacy Framework to ISO/IEC 27701:2019, Data Protection Mapping Project" }));
		main.appendChild(el("p", { class: "pc-attrib" }, [
			M.dpmp.copyright + " Used under the MIT licence. Sheet \"NIST PF\", commit " + M.dpmp.commit + ". The sheet follows the preliminary draft of the Privacy Framework: " + M.pf.text + " of its " + D.pub.pfIso.length + " rows match a Version 1.0 subcategory word for word, " + M.pf.id + " match by identifier with reworded text, and " + M.pf.none + " have no Version 1.0 counterpart. " + M.pf.absent.length + " Version 1.0 subcategories are not in the sheet: " + M.pf.absent.join(", ") + "."
		]));
		var wrap = el("div", { class: "pc-table-wrap" });
		var t2 = el("table", { class: "pc-table" });
		t2.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "As printed" }), el("th", { text: "Version 1.0" }), el("th", { text: "ISO/IEC 27701:2019 clause" })])]));
		var tb2 = el("tbody");
		D.pub.pfIso.forEach(function (p) {
			var c1 = el("td");
			if (p.pf10) {
				c1.appendChild(linkTo("nist", nistAnchor(p.pf10), p.pf10));
				if (p.match !== "text") c1.appendChild(el("span", { class: "pc-none", text: " (draft wording)" }));
			} else c1.appendChild(el("span", { class: "pc-none", text: "no counterpart" }));
			var cell = el("td");
			p.iso.forEach(function (i, k) { if (k) cell.appendChild(document.createTextNode(", ")); cell.appendChild(linkTo("iso", isoAnchor(i), i)); });
			tb2.appendChild(el("tr", {}, [el("td", { text: p.printed }), c1, cell]));
		});
		t2.appendChild(tb2);
		wrap.appendChild(t2);
		main.appendChild(wrap);

		main.appendChild(el("h3", { class: "pc-theme", id: "pub-nist-hosted", text: "NIST-hosted crosswalks, linked and not reproduced" }));
		main.appendChild(el("p", { class: "pc-lede", text: "Both were contributed by third parties to the Privacy Framework Resource Repository and first posted on 2 July 2020. NIST hosts them without endorsing them and warns that carrying out the Framework's activities does not mean a source's provisions are met. Neither file states a licence, so only what they cover is given here." }));
		var ms = M.hosted.ms, g = M.hosted.gdpr;
		main.appendChild(el("article", { class: "pc-card pc-item" }, [
			el("div", { class: "pc-card-head" }, [el("span", { class: "pc-item-title", text: "ISO/IEC 27701 Crosswalk by Microsoft" })]),
			el("p", {}, ["Privacy Framework Version 1.0 to the clauses of ISO/IEC 27701:2019. Covers all " + ms.subs + " subcategories with " + ms.clauses + " distinct clauses. For " + ms.same + " subcategories its clauses are identical to the Data Protection Mapping Project sheet above, for " + ms.differ.length + " they differ (" + ms.differ.join(", ") + ") and " + ms.absent.length + " are not in that sheet under a Version 1.0 identifier. It was used as a check on that sheet and is not shown. ", ext(ms.url, "Open on nist.gov"), "."])
		]));
		main.appendChild(el("article", { class: "pc-card pc-item" }, [
			el("div", { class: "pc-card-head" }, [el("span", { class: "pc-item-title", text: "GDPR Crosswalk by Enterprivacy Consulting Group" })]),
			el("p", {}, ["Privacy Framework Version 1.0 to GDPR articles and paragraphs, one direction only. Pairs " + g.mapped + " of the 100 subcategories with Articles " + g.articles + "; not paired: " + g.unmapped.join(", ") + ". Its author built it from the two Microsoft mappings, reviewed each link by hand and gives no warranty. It was used here as a cross-check: where a NIST reference on this page is also a pair in this crosswalk, the row says so. The crosswalk itself is not copied. ", ext(g.url, "Open on nist.gov"), "."])
		]));
	}

	/* ---------------- shell, tabs, hash ---------------- */
	var VIEWS = [["gdpr", "By GDPR obligation"], ["iso", "By ISO/IEC 27701:2019 numbering"], ["nist", "By NIST Privacy Framework"], ["pub", "Published mappings"]];

	function render() {
		app.innerHTML = "";
		var tabs = el("div", { class: "pc-tabs", role: "tablist", "aria-label": "Views" });
		VIEWS.forEach(function (v) {
			var b = el("button", { type: "button", class: "pc-tab" + (state.view === v[0] ? " is-on" : ""), role: "tab", "aria-selected": String(state.view === v[0]), id: "pc-tab-" + v[0] }, [v[1]]);
			b.addEventListener("click", function () { state.view = v[0]; render(); writeHash(); });
			tabs.appendChild(b);
		});
		app.appendChild(tabs);
		var main = el("div", { class: "pc-view", role: "tabpanel", "aria-labelledby": "pc-tab-" + state.view });
		app.appendChild(main);
		if (state.view === "iso") renderIso(main);
		else if (state.view === "nist") renderNist(main);
		else if (state.view === "pub") renderPub(main);
		else renderGdpr(main);
	}

	function writeHash(anchor) {
		var parts = ["view=" + state.view];
		if (state.view === "gdpr") {
			if (state.role !== "all") parts.push("role=" + state.role);
			if (state.theme !== "all") parts.push("theme=" + state.theme);
			if (state.gap) parts.push("gap=1");
			if (state.q) parts.push("q=" + encodeURIComponent(state.q));
		}
		var h = anchor ? anchor : parts.join("&");
		if (history.replaceState) history.replaceState(null, "", "#" + h);
	}

	function readHash() {
		var h = (location.hash || "").replace(/^#/, "");
		if (!h) return null;
		if (/^pc-r\d+$/.test(h)) { state.view = "gdpr"; state.role = "all"; state.theme = "all"; state.q = ""; state.gap = false; return h; }
		if (/^iso-/.test(h)) { state.view = "iso"; return h; }
		if (/^nist-/.test(h)) { state.view = "nist"; return h; }
		if (/^pub-/.test(h)) { state.view = "pub"; return h; }
		if (h.indexOf("=") === -1) return null;
		state.role = "all"; state.theme = "all"; state.q = ""; state.gap = false;
		h.split("&").forEach(function (kv) {
			var p = kv.split("=");
			var v = "";
			try { v = decodeURIComponent(p[1] || ""); } catch (e) { v = p[1] || ""; }
			if (p[0] === "view" && /^(gdpr|iso|nist|pub)$/.test(v)) state.view = v;
			if (p[0] === "role" && /^(all|controller|processor)$/.test(v)) state.role = v;
			if (p[0] === "theme" && THEME[v]) state.theme = v;
			if (p[0] === "gap") state.gap = v === "1";
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
