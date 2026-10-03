	/* ---------------- Pathway result ----------------
	 * One register: the findings of the AI Risk Assessment (business factors),
	 * the Generative AI Risk Assessment, the AI Act module and the pathway's own
	 * core, impact and governance checks. Findings on the same question merge
	 * into one line, kept at the higher severity, tagged with its owner and any
	 * other part that raised it, and listed against every framework entry its
	 * questions map to. */

	var AIP_Q_GROUP = (function () {
		var g = {};
		AIPATH_STEPS.forEach(function (s) { s.questions.forEach(function (q) { g[q.id] = s.group; }); });
		g.gaiHumanReview = "core";
		return g;
	})();
	function aipTag(q, a) {
		var grp = AIP_Q_GROUP[q] || "core";
		if (q === "gaiDisclosure") grp = aipEuOn(a) ? "aiact" : "genai";
		if (grp === "intake" || grp === "triggers") grp = "core";
		return AIP_GROUP_LABEL[grp];
	}

	function aipathResult(a) {
		var tier = aipathTier(a);
		var d = aipathDerive(a);
		var asked = aipathAsked(a);
		var gen = aipGenAiOn(d), eu = aipEuOn(d);
		var raw = [];

		aiResult(d).factors.forEach(function (x) {
			var qs = AIP_AI_FACTOR_QS[x.title];
			if (qs) raw.push({ title: x.title, detail: x.detail, severity: x.severity, qs: qs, by: "Core" });
		});
		var g = null;
		if (gen) {
			g = gaiResult(d);
			(g.factors || []).forEach(function (x) {
				var qs = null;
				GAI_CHECKS.forEach(function (c) { if (c.title === x.title) qs = [c.q]; });
				if (x.title === "Personal data sent to a model provider") qs = ["gaiProviderUse", "gaiPromptData"];
				if (qs) raw.push({ title: x.title, detail: x.detail, severity: x.severity, qs: qs, by: "GenAI", gai: true });
			});
		}
		aipathOwnFindings(d, tier).forEach(function (x) { x.by = aipTag(x.qs[0], d); raw.push(x); });
		var act = null;
		if (eu) {
			act = aiActResult(d);
			act.findings.forEach(function (x) { x.by = "AI Act"; raw.push(x); });
		}

		// Merge on the question each finding belongs to.
		var byQ = {}, order = [];
		raw.forEach(function (x) {
			var k = x.qs[0];
			var cur = byQ[k];
			if (!cur) {
				byQ[k] = { title: x.title, detail: x.detail, severity: x.severity, qs: x.qs.slice(), tag: aipTag(k, d), also: [], gai: !!x.gai };
				if (x.by !== byQ[k].tag) byQ[k].also.push(x.by);
				order.push(k);
				return;
			}
			if (AIP_SEV.indexOf(x.severity) > AIP_SEV.indexOf(cur.severity)) { cur.title = x.title; cur.detail = x.detail; cur.severity = x.severity; }
			x.qs.forEach(function (q) { if (cur.qs.indexOf(q) === -1) cur.qs.push(q); });
			if (x.by !== cur.tag && cur.also.indexOf(x.by) === -1) cur.also.push(x.by);
			if (x.gai) cur.gai = true;
		});
		var findings = order.map(function (k) { return byQ[k]; });
		findings.sort(function (x, y) { return AIP_SEV.indexOf(y.severity) - AIP_SEV.indexOf(x.severity); });

		var qSev = {};
		findings.forEach(function (x) {
			x.qs.forEach(function (q) { if (!qSev[q] || AIP_SEV.indexOf(x.severity) > AIP_SEV.indexOf(qSev[q])) qSev[q] = x.severity; });
			var nist = [], iso = [], sg = [], gai = [], owasp = [];
			x.qs.forEach(function (q) {
				var m = AIPATH_FRAMEWORK_MAP[q];
				if (m) {
					m[0].forEach(function (i) { if (nist.indexOf(i) === -1) nist.push(i); });
					m[1].forEach(function (i) { if (iso.indexOf(i) === -1) iso.push(i); });
					if (gen) m[2].forEach(function (i) { if (sg.indexOf(SG_DIMENSIONS[i]) === -1) sg.push(SG_DIMENSIONS[i]); });
				}
				if (gen) GAI_CHECKS.forEach(function (c) {
					if (c.q !== q) return;
					c.nist.forEach(function (i) { if (gai.indexOf(NIST_GAI_RISKS[i]) === -1) gai.push(NIST_GAI_RISKS[i]); });
					c.owasp.forEach(function (i) { var o = OWASP_LLM[i].split(" ")[0]; if (owasp.indexOf(o) === -1) owasp.push(o); });
				});
			});
			x.refs = { nist: nist, iso: iso, sg: sg, gai: gai, owasp: owasp };
		});

		var cov = aipathCoverage(d, asked, qSev);
		var worst = findings.length ? findings[0].severity : null;
		var overall = worst === "high" ? "High" : (worst === "medium" ? "Medium" : "Low");
		var classification = act ? act.classification : (eu ? "Not screened" : "Not in scope (no EU nexus)");
		var modules = ["Core", "Impact"];
		if (gen) modules.push("GenAI");
		if (eu) modules.push("AI Act");
		modules.push("Governance");

		var friaStatus = null;
		if (eu && act && act.classification !== "Prohibited" && aipDeployer(d) && aipHighRiskIII(d)) {
			var fa = friaApplicability(d);
			if (fa.status === "Required" || fa.status === "Check") friaStatus = fa;
		}
		var dpia = aipPersonal(d);

		var prohibited = classification === "Prohibited";
		var badgeLevel = prohibited ? "High" : overall;
		var verdict = prohibited
			? "The use appears to be a prohibited practice under Article 5 of the EU AI Act. Stop and escalate before anything else on this page."
			: (overall === "High"
				? "At least one finding is serious enough to resolve before deployment or wider rollout."
				: (overall === "Medium" ? "No blocking finding, but several controls are missing or partial. Plan them with owners and dates." : "No significant finding from your answers. Reassess on the events listed in governance."));
		var level = "Level " + tier.level;
		return {
			aipath: true,
			badgeLevel: badgeLevel,
			badgeText: prohibited ? "Prohibited practice" : (overall + " risk"),
			verdictDetail: verdict,
			tier: tier,
			overall: overall,
			classification: classification,
			modules: modules,
			findings: findings,
			factors: findings.map(function (x) { return { title: x.title, detail: x.detail, severity: x.severity }; }),
			obligations: act ? act.obligations : [],
			coverage: cov,
			gaiTables: g && g.tables ? g.tables : [],
			handovers: { dpia: dpia, fria: friaStatus ? friaStatus.status : null, friaDetail: friaStatus ? friaStatus.detail : "" },
			stats: [
				["Impact level", tier.level + (tier.missing.length ? " (provisional)" : ""), tier.pct + " percent of the maximum score"],
				["Highest finding", overall, findings.length + " finding" + (findings.length === 1 ? "" : "s")],
				["EU AI Act", classification, eu ? (act ? act.obligations.length + " obligations listed" : "") : "module not opened"],
				["Modules opened", String(modules.length), modules.join(", ")]
			],
			tables: [],
			help: "",
			historyLabel: level + " - " + (prohibited ? "Prohibited" : overall + " risk") + " - AI Act: " + classification,
			level: overall
		};
	}

	/* ---------------- Handovers ----------------
	 * The FRIA and the DPIA stay separate tools. The FRIA seed is mostly a copy:
	 * the impact, oversight and intake questions use the FRIA's own ids. */

	function aipathSeedFria(a) {
		var d = aipathDerive(a), seed = {};
		FRIA_STEPS.forEach(function (s) {
			s.questions.forEach(function (q) {
				if (d[q.id] !== undefined) seed[q.id] = Array.isArray(d[q.id]) ? d[q.id].slice() : d[q.id];
				if (d[q.id + "Note"] !== undefined) seed[q.id + "Note"] = d[q.id + "Note"];
			});
		});
		if (d.description) seed.deployerProcess = d.description;
		if (d.aipApprover) seed.friaGovernance = d.aipApprover;
		if (d.aipReviewDate) seed.friaReviewDate = d.aipReviewDate;
		seed.friaDpia = aipPersonal(d) ? "In progress" : "Not applicable (no personal data)";
		return seed;
	}

	function aipathSeedDpia(a) {
		var d = aipathDerive(a);
		var t = [DPIA_TRIGGERS[7]];
		if (aipDecides(d)) t.unshift(DPIA_TRIGGERS[0]);
		if (d.aipDecisionEffect === AIP_DECISION_EFFECTS[3] || (aipSignificant(d) && d.oversightMode === "No human review")) t.splice(t.indexOf(DPIA_TRIGGERS[7]), 0, DPIA_TRIGGERS[1]);
		var data = d.gaiPromptData || [];
		if (data.indexOf("Special category data") !== -1) t.push(DPIA_TRIGGERS[3]);
		if (AIP_SCALES.indexOf(d.affectedScale) >= 2) t.push(DPIA_TRIGGERS[4]);
		if ((d.friaVulnerable || []).length) t.push(DPIA_TRIGGERS[6]);
		var order = DPIA_TRIGGERS.slice();
		t.sort(function (x, y) { return order.indexOf(x) - order.indexOf(y); });
		var seed = {
			name: d.name || "",
			description: d.description || "",
			dpiaTriggers: t,
			specialCategory: data.indexOf("Special category data") !== -1 ? "Yes" : "No"
		};
		if (d.firstUseDate) seed.goLiveDate = d.firstUseDate;
		if (d.gaiModelSource === "Third-party model through an API") seed.processorsInvolved = "Yes";
		if (d.harmsDescription) seed.harmsDetail = d.harmsDescription;
		if (d.aipReviewDate) seed.reviewDate = d.aipReviewDate;
		return seed;
	}

	/* ---------------- Rendering ---------------- */

	function aipTable(head, rows) {
		var tbl = el("table", { class: "paa-table" });
		tbl.appendChild(el("tr", {}, head.map(function (h) { return el("th", {}, [h]); })));
		rows.forEach(function (r) { tbl.appendChild(el("tr", {}, r.map(function (c) { return el("td", {}, [c]); }))); });
		return tbl;
	}
	function aipLink(href, text) {
		var ext = /^https?:/.test(href);
		return ext ? el("a", { href: href, target: "_blank", rel: "noopener noreferrer" }, [text]) : el("a", { href: href }, [text]);
	}

	function renderAipathResult(r, answers) {
		root.appendChild(el("div", { class: "paa-result-head" }, [
			el("span", { class: "paa-badge " + badgeClass(r.badgeLevel) }, [r.badgeText]),
			el("span", { class: "paa-badge " + badgeClass(r.tier.index >= 2 ? "High" : (r.tier.index === 1 ? "Medium" : "Low")) }, ["Impact level " + r.tier.level]),
			el("span", {}, ["EU AI Act: " + r.classification])
		]));
		root.appendChild(el("p", { class: "paa-hero-meaning" }, [r.verdictDetail]));
		root.appendChild(el("div", { class: "paa-stats" }, r.stats.map(function (s) { return statTile(s[0], s[1], s[2]); })));

		// Handovers
		if (r.handovers.fria) {
			var fBox = el("div", { class: "paa-callout sev-high" }, [
				el("strong", {}, ["A fundamental rights impact assessment is " + (r.handovers.fria === "Required" ? "required" : "possibly required") + ". "]),
				r.handovers.friaDetail + " The FRIA picks up from here: the intake, oversight and impact answers carry over under the same questions, and it asks only what is left (period and frequency of use, reuse of earlier assessments, notification)."
			]);
			var toFria = el("button", { class: "button" }, ["Continue to the FRIA"]);
			toFria.addEventListener("click", function () { startModule("fria", aipathSeedFria(answers)); });
			fBox.appendChild(el("div", { class: "paa-callout-action" }, [toFria]));
			root.appendChild(fBox);
		}
		if (r.handovers.dpia) {
			var dBox = el("div", { class: "paa-callout sev-medium" }, [
				el("strong", {}, ["Personal data is involved. "]),
				"Whether a DPIA is required turns on the Article 35(3) criteria, which the Full DPIA asks first. Name, description, date, harms, special category data, processors and the criteria these answers already imply carry over. Severity and likelihood are left for you to rate there, because the DPIA rates harm from the processing, not the interference with rights rated here."
			]);
			var toDpia = el("button", { class: "button" }, ["Continue to the Full DPIA"]);
			toDpia.addEventListener("click", function () { startModule("dpia", aipathSeedDpia(answers)); });
			dBox.appendChild(el("div", { class: "paa-callout-action" }, [toDpia]));
			root.appendChild(dBox);
		}

		// Register
		var list = el("div", {});
		if (!r.findings.length) list.appendChild(el("p", { class: "paa-no-factors" }, ["No findings from your answers."]));
		r.findings.forEach(function (x) {
			var refs = [];
			if (x.refs.nist.length) refs.push("NIST AI RMF " + x.refs.nist.join(", "));
			if (x.refs.gai.length) refs.push("NIST AI 600-1: " + x.refs.gai.join(", "));
			if (x.refs.owasp.length) refs.push("OWASP " + x.refs.owasp.join(", "));
			if (x.refs.iso.length) refs.push("ISO/IEC 42001 " + x.refs.iso.join(", "));
			if (x.refs.sg.length) refs.push("Singapore: " + x.refs.sg.join(", "));
			list.appendChild(el("div", { class: "paa-factor sev-" + x.severity }, [
				el("p", {}, [el("strong", {}, ["[" + x.tag + (x.also.length ? ", also " + x.also.join(", ") : "") + "] " + x.title + ": "]), x.detail]),
				refs.length ? el("p", { class: "paa-help" }, [refs.join(" | ")]) : null
			]));
		});
		root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["Risk register (" + r.findings.length + ")"]), list]));

		// Obligations
		if (r.obligations.length) {
			// Two columns, so the table fits a phone: role, date and links sit under the title.
			var otbl = el("table", { class: "paa-table" });
			otbl.appendChild(el("tr", {}, ["Obligation", "Status"].map(function (h) { return el("th", {}, [h]); })));
			r.obligations.forEach(function (o) {
				var meta = el("p", { class: "paa-help" }, [o.role + ". Applies from " + o.applies + ". "]);
				meta.appendChild(aipLink("ai-act-digest.html#" + o.art, "Art. " + o.art.replace("art-", "")));
				if (o.row) { meta.appendChild(document.createTextNode(" | ")); meta.appendChild(aipLink("ai-governance-crosswalk.html#cw-" + o.row, "Crosswalk")); }
				otbl.appendChild(el("tr", {}, [el("td", {}, [el("strong", {}, [o.title]), meta]), el("td", {}, [o.status])]));
			});
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["EU AI Act obligations for your role"]), otbl,
				el("p", { class: "paa-help" }, ["Dates follow the Regulation as amended by Regulation (EU) 2026/1744. \"Applies\" means the obligation is listed for your role and risk level with no question on it here; \"Not assessed\" means its question was not answered."])
			]));
		}

		// Impact level
		var t = r.tier;
		var trows = t.parts.map(function (p) { return [p.label, p.points + " of " + p.max]; });
		var tnote = "Raw score " + t.raw + " of " + t.max + " (" + t.pct + " percent): level " + t.scoredLevel + " on the bands I up to 25, II up to 50, III up to 75, IV above." +
			(t.floors.length && t.scoredLevel !== t.level ? " Raised to level " + t.level + " by the floor: " + t.floors.join("; ") + "." : "") +
			(t.missing.length ? " Provisional: not answered, counted as zero: " + t.missing.join(", ") + "." : "") + " " + t.text;
		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Impact level " + t.level]), aipTable(["Factor", "Points"], trows), el("p", { class: "paa-help" }, [tnote])
		]));

		// Framework coverage
		var c = r.coverage;
		function covNote(n) { return n.gap + " with a gap, " + n.ok + " addressed, " + n.na + " not assessed"; }
		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Coverage: NIST AI RMF 1.0 (" + covNote(c.nistCount) + ")"]), aipTable(["Subcategory", "Text", "Status"], c.nist)
		]));
		r.gaiTables.forEach(function (gt) {
			root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["Coverage: " + gt.title.replace(/^Coverage against the /, "")]), aipTable(["Item", "Status"], gt.rows)]));
		});
		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Coverage: ISO/IEC 42001, voluntary (" + covNote(c.isoCount) + ")"]), aipTable(["Clause or control", "Title", "Status"], c.iso)
		]));
		if (r.gaiTables.length) {
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Coverage: Singapore Model AI Governance Framework for Generative AI (" + covNote(c.sgCount) + ")"]), aipTable(["Dimension", "Status"], c.sg)
			]));
		}

		var help = el("p", { class: "paa-help" }, [
			"How to read this. The mapping of questions to framework entries is this tool's own, made for triage. \"Not assessed\" means no question you answered touches that entry; it is not a pass. \"Addressed\" means the questions on it were answered without a finding, not that the framework is met. ISO/IEC 42001 and ISO/IEC 42005 are voluntary standards, cited by number and title only; the Singapore framework is guidance, not law, and its dimensions on safety research and public good are mostly for governments and model developers. The impact level follows the method of the ",
			aipLink(CANADA_AIA_URL, "Canadian Algorithmic Impact Assessment"),
			" with this tool's own factors and weights and no mitigation deduction. Sources: ",
			aipLink(NIST_AI_RMF_URL, "NIST AI RMF 1.0"), ", ",
			aipLink(NIST_AI_600_1_URL, "NIST AI 600-1"), ", ",
			aipLink(ISO_42001_URL, "ISO/IEC 42001"), ", ",
			aipLink(ISO_42005_URL, "ISO/IEC 42005"), ", ",
			aipLink(SG_GENAI_URL, "Singapore Model AI Governance Framework for Generative AI"), ". This is decision support, not a legal determination, a DPIA, a FRIA or a conformity assessment."
		]);
		root.appendChild(help);
	}
