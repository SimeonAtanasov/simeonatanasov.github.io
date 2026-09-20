/* GDPR Fine Calculator.
   Reads FINE_ROWS from calculator-data.js and benchmarks a turnover figure
   against comparable enforcement decisions.

   Method, in short:
     1. Select peers: same violation type, turnover within a band of the figure
        entered, optionally the same sector.
     2. Collapse to one index per company (the median of that company's cases),
        so a regulator that fines the same operator sixty times does not decide
        the answer on its own.
     3. Report the median and the 25th to 90th percentile across companies,
        alongside the Art. 83 statutory ceiling.

   Nothing is sent anywhere. All of this runs in the browser. */

(function () {
	"use strict";

	var F = {};
	FINE_FIELDS.forEach(function (name, i) { F[name] = i; });

	var ROWS = FINE_ROWS.map(function (r) {
		return {
			etid: r[F.etid], company: r[F.company], country: r[F.country],
			year: r[F.year], fine: r[F.fine], turnover: r[F.turnover],
			type: r[F.type], sector: r[F.sector], articles: r[F.articles],
			tier: r[F.tier], conf: r[F.conf], fin: r[F.fin],
			tyear: r[F.tyear], tbasis: r[F.tbasis], tsource: r[F.tsource],
			ep: r[F.ep],
			index: r[F.fine] / r[F.turnover],
			key: normKey(r[F.company])
		};
	});

	function normKey(name) {
		return String(name || "").toLowerCase()
			.normalize("NFD").replace(/[̀-ͯ]/g, "")
			.replace(/[^a-z0-9 ]/g, " ")
			.replace(/\b(sau|sa|slu|sl|spa|srl|gmbh|ag|ab|as|oy|nv|bv|plc|ltd|limited|llc|inc|corp|co|kg|group|holding|international|espana|espagne)\b/g, " ")
			.replace(/\s+/g, " ").trim();
	}

	/* ------------------------------------------------------------ formatting --- */

	function eur(v) {
		if (v == null || !isFinite(v)) return "n/a";
		var abs = Math.abs(v);
		if (abs >= 1e9) return "€ " + (v / 1e9).toFixed(v / 1e9 >= 10 ? 0 : 1) + " bn";
		if (abs >= 1e6) return "€ " + (v / 1e6).toFixed(v / 1e6 >= 10 ? 0 : 1) + " m";
		return "€ " + Math.round(v).toLocaleString("en-GB");
	}

	function eurFull(v) {
		if (v == null || !isFinite(v)) return "n/a";
		return "€ " + Math.round(v).toLocaleString("en-GB");
	}

	function pct(v) {
		if (v == null || !isFinite(v)) return "n/a";
		if (v >= 0.01) return (v * 100).toFixed(2) + "%";
		if (v >= 0.0001) return (v * 100).toFixed(3) + "%";
		return (v * 100).toFixed(5) + "%";
	}

	function parseMoney(s) {
		var t = String(s || "").toLowerCase().replace(/[\s, €]/g, "");
		var mult = 1;
		if (/bn$|b$|billion$/.test(t)) { mult = 1e9; t = t.replace(/(bn|b|billion)$/, ""); }
		else if (/m$|mn$|million$/.test(t)) { mult = 1e6; t = t.replace(/(mn|m|million)$/, ""); }
		else if (/k$|thousand$/.test(t)) { mult = 1e3; t = t.replace(/(k|thousand)$/, ""); }
		var n = parseFloat(t);
		return isFinite(n) && n > 0 ? n * mult : null;
	}

	/* ------------------------------------------------------------- statistics --- */

	function quantile(sorted, p) {
		if (!sorted.length) return null;
		if (sorted.length === 1) return sorted[0];
		var pos = (sorted.length - 1) * p;
		var lo = Math.floor(pos), hi = Math.ceil(pos);
		if (lo === hi) return sorted[lo];
		return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
	}

	/* One index per company, so a heavily fined operator counts once. */
	function byCompany(rows) {
		var m = {};
		rows.forEach(function (r) { (m[r.key] = m[r.key] || []).push(r); });
		return Object.keys(m).map(function (k) {
			var idx = m[k].map(function (r) { return r.index; }).sort(function (a, b) { return a - b; });
			return { key: k, rows: m[k], index: quantile(idx, 0.5), n: m[k].length };
		});
	}

	/* -------------------------------------------------------- peer selection --- */

	/* Widen in defined steps rather than silently returning two peers.

	   The order matters and is set by the data, not by intuition. Within the
	   1bn to 100bn band the median index for the five well populated violation
	   types runs from 0.000020 to 0.000023, which is no difference at all.
	   Within a single violation type, moving from the 1m to 100m band to the
	   10bn plus band moves the median by a factor of several hundred. Size is
	   therefore the control worth protecting, so the ladder drops the sector
	   and then the violation type before it widens the turnover band. */
	var BANDS = [
		{ lo: 0.5, hi: 1.5, label: "within 50% of your turnover" },
		{ lo: 0.25, hi: 4, label: "within a quarter to four times your turnover" },
		{ lo: 0.1, hi: 10, label: "within a tenth to ten times your turnover" }
	];
	var MIN_COMPANIES = 8;

	function selectPeers(turnover, type, sector, sourcedOnly, excludeFin, excludeEp) {
		var pool = ROWS.filter(function (r) {
			if (sourcedOnly && r.conf < 1) return false;
			if (excludeFin && r.fin) return false;
			if (excludeEp && r.ep) return false;
			return true;
		});

		var steps = [];
		BANDS.forEach(function (b) {
			if (sector) steps.push({ band: b, type: type, sector: sector });
			steps.push({ band: b, type: type, sector: null });
			steps.push({ band: b, type: null, sector: null });
		});

		for (var i = 0; i < steps.length; i++) {
			var s = steps[i];
			var sel = pool.filter(function (r) {
				if (r.turnover < turnover * s.band.lo || r.turnover > turnover * s.band.hi) return false;
				if (s.type && r.type !== s.type) return false;
				if (s.sector && r.sector !== s.sector) return false;
				return true;
			});
			var comps = byCompany(sel);
			if (comps.length >= MIN_COMPANIES || i === steps.length - 1) {
				return {
					rows: sel, companies: comps, band: s.band,
					usedType: s.type, usedSector: s.sector,
					droppedType: !s.type, droppedSector: !!sector && !s.sector,
					widened: s.band !== BANDS[0],
					relaxed: i > 0, enough: comps.length >= MIN_COMPANIES
				};
			}
		}
		return null;
	}

	/* ------------------------------------------------------------ the ceiling --- */

	/* Art. 83(4): 2% of worldwide annual turnover or EUR 10 million, whichever is
	   higher. Art. 83(5): 4% or EUR 20 million. The absolute floor is what binds
	   for anyone under EUR 500 million of turnover, which is most organisations. */
	var TIER_BY_TYPE = {
		"security":    { tier: 2, why: "Art. 32 alone sits in the 2% tier, but most security decisions also cite Art. 5(1)(f), which moves them to 4%." },
		"legal-basis": { tier: 4, why: "Art. 6 and Art. 5 are both in the 4% tier." },
		"principles":  { tier: 4, why: "Art. 5 is in the 4% tier." },
		"rights":      { tier: 4, why: "Art. 12 to 22 are in the 4% tier." },
		"cooperation": { tier: 2, why: "Art. 31 and 58 sit in the 2% tier." },
		"information": { tier: 4, why: "Art. 12 to 14 are in the 4% tier." },
		"breach":      { tier: 2, why: "Art. 33 and 34 sit in the 2% tier." },
		"dpo":         { tier: 2, why: "Art. 37 to 39 sit in the 2% tier." },
		"dpa":         { tier: 2, why: "Art. 28 sits in the 2% tier." }
	};

	function ceiling(turnover, tier) {
		return tier === 4
			? Math.max(0.04 * turnover, 20000000)
			: Math.max(0.02 * turnover, 10000000);
	}

	/* ------------------------------------------------------------------- chart --- */

	var C_PEER = "#199e70", C_YOU = "#d95926", C_OTHER = "#5c6684";

	function drawChart(el, peers, turnover, estimate) {
		var W = 860, H = 420, ML = 66, MR = 18, MT = 16, MB = 48;
		var pw = W - ML - MR, ph = H - MT - MB;
		var all = ROWS;
		var xs = all.map(function (r) { return Math.log10(r.turnover); }).concat([Math.log10(turnover)]);
		var ys = all.map(function (r) { return Math.log10(r.fine); });
		if (estimate) ys = ys.concat([Math.log10(estimate)]);
		var x0 = Math.floor(Math.min.apply(null, xs)), x1 = Math.ceil(Math.max.apply(null, xs));
		var y0 = Math.floor(Math.min.apply(null, ys)), y1 = Math.ceil(Math.max.apply(null, ys));
		var X = function (v) { return ML + (Math.log10(v) - x0) / (x1 - x0) * pw; };
		var Y = function (v) { return MT + ph - (Math.log10(v) - y0) / (y1 - y0) * ph; };
		var tick = function (e) { return e >= 9 ? (Math.pow(10, e - 9)) + "bn" : e >= 6 ? (Math.pow(10, e - 6)) + "m" : e >= 3 ? (Math.pow(10, e - 3)) + "k" : Math.pow(10, e); };

		var peerSet = {};
		peers.rows.forEach(function (r) { peerSet[r.etid] = 1; });

		var s = '<svg class="fc-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" '
			+ 'aria-label="Fine against turnover, both on logarithmic scales. Comparable peers are highlighted and your position is marked.">';

		for (var e = y0; e <= y1; e++) {
			var yy = Y(Math.pow(10, e));
			s += '<line x1="' + ML + '" y1="' + yy + '" x2="' + (W - MR) + '" y2="' + yy + '" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>';
			s += '<text x="' + (ML - 10) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="rgba(255,255,255,0.65)">€' + tick(e) + '</text>';
		}
		for (var e2 = x0; e2 <= x1; e2++) {
			var xx = X(Math.pow(10, e2));
			s += '<line x1="' + xx + '" y1="' + MT + '" x2="' + xx + '" y2="' + (MT + ph) + '" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>';
			s += '<text x="' + xx + '" y="' + (MT + ph + 18) + '" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.65)">€' + tick(e2) + '</text>';
		}
		s += '<text x="' + (ML + pw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.8)">Annual turnover of the undertaking</text>';
		s += '<text x="14" y="' + (MT + ph / 2) + '" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.8)" transform="rotate(-90 14 ' + (MT + ph / 2) + ')">Fine imposed</text>';

		all.forEach(function (r) {
			if (peerSet[r.etid]) return;
			s += '<circle cx="' + X(r.turnover).toFixed(1) + '" cy="' + Y(r.fine).toFixed(1) + '" r="3" fill="' + C_OTHER + '"><title>'
				+ esc(r.company) + ", " + r.year + ": " + eur(r.fine) + " on " + eur(r.turnover) + '</title></circle>';
		});
		peers.rows.forEach(function (r) {
			s += '<circle cx="' + X(r.turnover).toFixed(1) + '" cy="' + Y(r.fine).toFixed(1) + '" r="5.5" fill="' + C_PEER
				+ '" stroke="#1e2a4d" stroke-width="2"><title>' + esc(r.company) + ", " + r.year + ": " + eur(r.fine)
				+ " on " + eur(r.turnover) + " (" + pct(r.index) + ')</title></circle>';
		});

		if (estimate) {
			var cx = X(turnover), cy = Y(estimate);
			s += '<line x1="' + cx + '" y1="' + MT + '" x2="' + cx + '" y2="' + (MT + ph) + '" stroke="' + C_YOU + '" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>';
			s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="8" fill="' + C_YOU + '" stroke="#1e2a4d" stroke-width="2"><title>Your organisation: median estimate '
				+ eur(estimate) + " on " + eur(turnover) + '</title></circle>';
			var lx = cx < ML + pw - 120 ? cx + 14 : cx - 14;
			s += '<text x="' + lx.toFixed(1) + '" y="' + (cy - 12).toFixed(1) + '" text-anchor="' + (cx < ML + pw - 120 ? "start" : "end")
				+ '" font-size="12" font-weight="600" fill="#ffffff">You: ' + eur(estimate) + '</text>';
		}
		s += "</svg>";
		el.innerHTML = s;
	}

	/* Article numbers with the Regulation's own headings on hover, from the
	   lookup table the Power BI model uses. */
	function artChips(list) {
		return list.map(function (n) {
			var name = (typeof ARTICLE_NAMES !== "undefined" && ARTICLE_NAMES[n]) || "";
			return '<span class="fc-art"' + (name ? ' title="Art. ' + esc(n) + ": " + esc(name) + '"' : "") + ">Art. " + esc(n) + "</span>";
		}).join(" ");
	}

	function esc(t) {
		return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	/* --------------------------------------------------------------- rendering --- */

	var CONF_LABEL = { 3: "sourced, high", 2: "sourced, medium", 1: "sourced, low", 0: "unsourced" };

	function render() {
		var out = document.getElementById("fc-output");
		var turnover = parseMoney(document.getElementById("fc-turnover").value);
		if (!turnover) {
			out.innerHTML = '<p class="fc-note">Enter an annual turnover figure to see a benchmark.</p>';
			return;
		}

		var type = document.getElementById("fc-type").value;
		var sector = document.getElementById("fc-sector").value || null;
		var sourcedOnly = document.getElementById("fc-sourced").checked;
		var excludeFin = document.getElementById("fc-nofin").checked;
		var excludeEp = document.getElementById("fc-noep").checked;

		var peers = selectPeers(turnover, type, sector, sourcedOnly, excludeFin, excludeEp);
		var idx = peers.companies.map(function (c) { return c.index; }).sort(function (a, b) { return a - b; });
		var p25 = quantile(idx, 0.25), p50 = quantile(idx, 0.5), p90 = quantile(idx, 0.90);
		var tierInfo = TIER_BY_TYPE[type] || TIER_BY_TYPE["principles"];
		var cap = ceiling(turnover, tierInfo.tier);
		var capIsFloor = (tierInfo.tier === 4 ? 0.04 : 0.02) * turnover < (tierInfo.tier === 4 ? 20000000 : 10000000);

		var est = p50 != null ? p50 * turnover : null;
		var lo = p25 != null ? p25 * turnover : null;
		var hi = p90 != null ? p90 * turnover : null;

		var h = "";

		h += '<div class="fc-cards">';
		h += card("Typical outcome", est != null ? eur(Math.min(est, cap)) : "not enough data",
			est != null ? "The median of " + peers.companies.length + " comparable organisations, " + pct(p50) + " of turnover" : "", "fc-card-main");
		h += card("Realistic range", (lo != null ? eur(Math.min(lo, cap)) + " to " + eur(Math.min(hi, cap)) : "not enough data"),
			lo != null ? "25th to 90th percentile, " + pct(p25) + " to " + pct(p90) + " of turnover" : "");
		h += card("Statutory ceiling", eur(cap),
			capIsFloor
				? "The flat € " + (tierInfo.tier === 4 ? "20" : "10") + " million floor, which is higher than " + (tierInfo.tier === 4 ? "4%" : "2%") + " of your turnover"
				: (tierInfo.tier === 4 ? "4%" : "2%") + " of turnover, Art. 83(" + (tierInfo.tier === 4 ? "5" : "4") + ")", "fc-card-cap");
		h += "</div>";

		h += '<div class="fc-basis"><strong>What this is built on.</strong> '
			+ peers.companies.length + " comparable organisations across " + peers.rows.length + " decisions, "
			+ (peers.usedType ? "for " + typeLabel(peers.usedType).toLowerCase() : "across all violation types")
			+ (peers.usedSector ? ", in " + peers.usedSector : "")
			+ ", " + peers.band.label + ". "
			+ "The ceiling assumes the " + (tierInfo.tier === 4 ? "4%" : "2%") + " tier. " + tierInfo.why
			+ "</div>";

		if (!peers.enough) {
			h += '<div class="fc-warn"><strong>Too few comparable cases.</strong> Even after widening the turnover band and dropping the filters, '
				+ "only " + peers.companies.length + " organisations of a similar size have a published fine with a known turnover. "
				+ "Treat the figures above as an illustration of the method rather than an estimate. "
				+ "This is most common at the small end: regulators fine small companies often, but small companies rarely publish accounts that are free to read.</div>";
		} else if (peers.relaxed) {
			var what = [];
			if (peers.droppedSector) what.push("the sector filter was dropped");
			if (peers.droppedType) what.push("the violation type was dropped and these peers are cases of <em>every</em> kind, not just " + typeLabel(type).toLowerCase());
			if (peers.widened) what.push("the turnover band was widened to " + peers.band.label);
			h += '<div class="fc-warn"><strong>Filters were relaxed to find enough peers.</strong> '
				+ "Fewer than " + MIN_COMPANIES + " organisations matched your exact selection, so "
				+ what.join(", and ") + ". ";
			if (peers.droppedType) {
				h += "That costs less than it sounds: once organisations of a similar size are compared with each other, "
					+ "the violation type barely moves the index. The five well evidenced categories all sit between 0.0020% and 0.0023% "
					+ "of turnover in the 1bn to 100bn band. Size is what moves the number, which is why the band is protected first.";
			}
			h += "</div>";
		}

		h += '<div class="fc-chart-wrap"><h3>Where you sit</h3>'
			+ '<p class="fc-note">Both axes are logarithmic. Each dot is one published decision. Hover a dot for the case.</p>'
			+ '<div class="fc-legend">'
			+ '<span><i class="fc-swatch" style="background:' + C_PEER + '"></i>Comparable peers (' + peers.rows.length + ')</span>'
			+ '<span><i class="fc-swatch" style="background:' + C_YOU + '"></i>Your organisation</span>'
			+ '<span><i class="fc-swatch" style="background:#5c6684"></i>All other cases in the data</span>'
			+ "</div><div id=\"fc-chart-slot\"></div></div>";

		h += sectorView(turnover, sourcedOnly, excludeFin, excludeEp, sector);

		h += "<h3 style=\"margin-top:2em\">The cases behind the number</h3>";
		h += '<p class="fc-note">Every peer used in the calculation, largest index first. The index is the fine divided by turnover. '
			+ "Confidence describes the turnover figure, not the fine: fines come from the public enforcement tracker, turnover was researched separately.</p>";
		h += '<div class="fc-table-scroll"><table class="fc-table"><thead><tr>'
			+ "<th>Organisation</th><th>Country</th><th>Year</th><th>Fine</th><th>Turnover</th><th>Index</th><th>Turnover source</th><th>Case</th>"
			+ "</tr></thead><tbody>";
		peers.rows.slice().sort(function (a, b) { return b.index - a.index; }).forEach(function (r) {
			h += "<tr>"
				+ "<td>" + esc(r.company) + (r.ep ? ' <span class="fc-tag" title="National ePrivacy or cookie rules, not GDPR Art. 83">ePrivacy</span>' : "")
				+ (r.articles && r.articles.length ? '<br><span class="fc-arts">' + artChips(r.articles) + "</span>" : "") + "</td>"
				+ "<td>" + esc(r.country) + ""
				+ '<td class="fc-num">' + (r.year || "") + "</td>"
				+ '<td class="fc-num">' + eurFull(r.fine) + "</td>"
				+ '<td class="fc-num">' + eur(r.turnover) + "</td>"
				+ '<td class="fc-num">' + pct(r.index) + "</td>"
				+ '<td><span class="fc-conf fc-conf-' + r.conf + '">' + CONF_LABEL[r.conf] + "</span>"
				+ (r.tsource ? '<br><span class="fc-note">' + esc(r.tsource) + (r.tyear ? " (FY" + esc(r.tyear) + ")" : "") + "</span>" : "")
				+ "</td>"
				+ '<td><a href="https://www.enforcementtracker.com/' + esc(r.etid) + '" target="_blank" rel="noopener">' + esc(r.etid) + "</a></td>"
				+ "</tr>";
		});
		h += "</tbody></table></div>";

		out.innerHTML = h;
		drawChart(document.getElementById("fc-chart-slot"), peers, turnover, est != null ? Math.min(est, cap) : null);
	}

	/* ------------------------------------------------------- sector comparison --- */

	/* Shows whether the sector filter is worth using at this size. One series,
	   so no legend: the heading names it. Bars are direct labelled rather than
	   carrying an axis, because the interesting comparison is between rows. */
	function sectorView(turnover, sourcedOnly, excludeFin, excludeEp, selected) {
		var pool = ROWS.filter(function (r) {
			if (sourcedOnly && r.conf < 1) return false;
			if (excludeFin && r.fin) return false;
			if (excludeEp && r.ep) return false;
			if (!r.sector || r.sector === "Not assigned") return false;
			return r.turnover >= turnover * 0.1 && r.turnover <= turnover * 10;
		});
		var bySector = {};
		pool.forEach(function (r) { (bySector[r.sector] = bySector[r.sector] || []).push(r); });

		var rows = [];
		Object.keys(bySector).forEach(function (s) {
			var comps = byCompany(bySector[s]);
			if (comps.length < 3) return;
			var idx = comps.map(function (c) { return c.index; }).sort(function (a, b) { return a - b; });
			rows.push({ sector: s, n: comps.length, cases: bySector[s].length, med: quantile(idx, 0.5) });
		});
		if (rows.length < 3) return "";
		rows.sort(function (a, b) { return b.med - a.med; });
		var max = rows[0].med;
		var overall = quantile(byCompany(pool).map(function (c) { return c.index; }).sort(function (a, b) { return a - b; }), 0.5);

		var h = '<h3 style="margin-top:2em">Does sector matter at your size?</h3>';
		h += '<p class="fc-note">Median index by sector, across organisations within a tenth to ten times your turnover. '
			+ "Sectors with fewer than three organisations are left out. The dashed line is the median across all sectors at this size ("
			+ pct(overall) + "). Read the counts: a sector sitting high on four organisations is not evidence of much.</p>";
		h += '<div class="fc-table-scroll"><table class="fc-table fc-sector-table"><thead><tr>'
			+ "<th>Sector</th><th>Organisations</th><th>Decisions</th><th>Median index</th><th>Relative</th>"
			+ "</tr></thead><tbody>";
		rows.forEach(function (r) {
			var w = max > 0 ? Math.max(2, (r.med / max) * 100) : 0;
			var mark = overall > 0 && max > 0 ? (overall / max) * 100 : -1;
			h += '<tr' + (r.sector === selected ? ' class="fc-sector-on"' : "") + ">"
				+ "<td>" + esc(r.sector) + (r.sector === selected ? " <strong>(selected)</strong>" : "") + "</td>"
				+ '<td class="fc-num">' + r.n + "</td>"
				+ '<td class="fc-num">' + r.cases + "</td>"
				+ '<td class="fc-num">' + pct(r.med) + "</td>"
				+ '<td class="fc-barcell"><span class="fc-bartrack">'
				+ '<span class="fc-bar" style="width:' + w.toFixed(1) + '%"></span>'
				+ (mark >= 0 ? '<span class="fc-barmark" style="left:' + mark.toFixed(1) + '%"></span>' : "")
				+ "</span></td></tr>";
		});
		h += "</tbody></table></div>";
		return h;
	}

	function card(label, value, sub, cls) {
		return '<div class="fc-card ' + (cls || "") + '">'
			+ '<div class="fc-card-label">' + label + "</div>"
			+ '<div class="fc-card-value">' + value + "</div>"
			+ (sub ? '<div class="fc-card-sub">' + sub + "</div>" : "")
			+ "</div>";
	}

	function typeLabel(code) {
		for (var i = 0; i < FINE_TYPES.length; i++) if (FINE_TYPES[i].code === code) return FINE_TYPES[i].label;
		return code;
	}

	/* --------------------------------------------------------------------- init --- */

	function init() {
		var root = document.getElementById("fc-app");
		if (!root) return;

		var typeSel = document.getElementById("fc-type");
		FINE_TYPES.forEach(function (t) {
			var n = ROWS.filter(function (r) { return r.type === t.code; }).length;
			var o = document.createElement("option");
			o.value = t.code;
			o.textContent = t.label + "  (" + n + " cases with a turnover)";
			if (t.thin) o.textContent += "  [thin]";
			typeSel.appendChild(o);
		});
		typeSel.value = "security";

		var secSel = document.getElementById("fc-sector");
		FINE_SECTORS.forEach(function (s) {
			var o = document.createElement("option");
			o.value = s; o.textContent = s;
			secSel.appendChild(o);
		});

		document.getElementById("fc-typenote").textContent =
			(FINE_TYPES.filter(function (t) { return t.code === "security"; })[0] || {}).note || "";

		typeSel.addEventListener("change", function () {
			var t = FINE_TYPES.filter(function (x) { return x.code === typeSel.value; })[0];
			document.getElementById("fc-typenote").textContent = t ? t.note : "";
			render();
		});

		["fc-turnover", "fc-sector", "fc-sourced", "fc-nofin", "fc-noep"].forEach(function (id) {
			var el = document.getElementById(id);
			el.addEventListener("input", render);
			el.addEventListener("change", render);
		});

		document.getElementById("fc-reset").addEventListener("click", function () {
			document.getElementById("fc-turnover").value = "";
			document.getElementById("fc-sector").value = "";
			document.getElementById("fc-sourced").checked = false;
			document.getElementById("fc-nofin").checked = false;
			document.getElementById("fc-noep").checked = false;
			typeSel.value = "security";
			render();
		});

		document.getElementById("fc-count").textContent =
			ROWS.length + " decisions across " + byCompany(ROWS).length + " organisations";

		render();
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
