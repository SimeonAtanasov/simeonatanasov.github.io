	/* ---------------- Impact level (tier) ----------------
	 * Method after the Government of Canada Algorithmic Impact Assessment: a
	 * raw score from weighted answers, expressed as a share of the maximum and
	 * banded into four levels (I up to 25 percent, II up to 50, III up to 75, IV
	 * above). The factors and weights are this tool's own, and every factor is
	 * read from an intake answer, so the tier needs no extra questions. Unlike
	 * the AIA there is no mitigation deduction: the level is set before the
	 * mitigations are asked, and they show in the residual rating instead. Two
	 * floors: a use in an Annex III area, or a system that makes significant
	 * decisions on its own, is never below level III. */

	var AIP_DECISION_EFFECTS = [
		"No decisions about people",
		"Supports decisions with minor effects on people",
		"Supports decisions with legal or similarly significant effects on people",
		"Makes decisions with legal or similarly significant effects on its own",
		"Not sure"
	];
	var AIP_REVERSIBILITY = [
		"Easily, and quickly",
		"With effort, or after some time",
		"Not, or only with great difficulty",
		"Not applicable: its output has no effect on people",
		"Not sure"
	];
	var AIP_SCALES = ["Fewer than 100", "100 to 10,000", "10,000 to 1 million", "More than 1 million"];
	var AIP_OVERSIGHT_MODES = ["Before every decision takes effect", "On flagged or contested cases only", "After the fact, by sampling", "No human review"];
	var AIP_AUTONOMY = ["None - a human approves every action", "Low-impact actions only", "Broad autonomous action"];
	var AIP_USERS = ["Staff only", "Selected business partners", "The public"];
	var AIP_DATA = GAI_PROMPT_DATA;

	// Annex III areas with the deepest intrusion into liberty, identity or legal status.
	function aipSectorPoints(area) {
		if (!area) return null;
		if (area === "Not an Annex III high-risk system") return 0;
		if (area === "Not sure") return 2;
		if (/^(1\.|6\.|7\.|8\.)/.test(area)) return 4;
		return 3;
	}
	function aipIsAnnexIII(a) {
		var area = a.annexIIIArea || "";
		return !!area && area !== "Not an Annex III high-risk system" && area !== "Not sure";
	}

	var AIPATH_TIER_FACTORS = [
		{ key: "decision", label: "Effect of the output on people", q: "aipDecisionEffect", max: 4,
			points: function (a) { var i = AIP_DECISION_EFFECTS.indexOf(a.aipDecisionEffect); return i < 0 ? null : [0, 1, 3, 4, 3][i]; } },
		{ key: "reversibility", label: "Reversibility of a wrong output", q: "aipReversibility", max: 4,
			points: function (a) { var i = AIP_REVERSIBILITY.indexOf(a.aipReversibility); return i < 0 ? null : [0, 2, 4, 0, 2][i]; } },
		{ key: "scale", label: "Number of people affected each year", q: "affectedScale", max: 3,
			points: function (a) { var i = AIP_SCALES.indexOf(a.affectedScale); return i < 0 ? null : i; } },
		{ key: "vulnerable", label: "People in a vulnerable situation", q: "friaVulnerable", max: 3,
			points: function (a) {
				// Left blank means none, as the question says, so blank is not "missing".
				var v = a.friaVulnerable;
				if (!Array.isArray(v) || !v.length) return 0;
				return v.indexOf("Children") !== -1 ? 3 : 2;
			} },
		{ key: "autonomy", label: "Actions taken without human approval", q: "autonomyLevel", max: 3,
			points: function (a) { var i = AIP_AUTONOMY.indexOf(a.autonomyLevel); return i < 0 ? null : [0, 1, 3][i]; } },
		{ key: "review", label: "When a human acts on an individual case", q: "oversightMode", max: 3,
			points: function (a) { var i = AIP_OVERSIGHT_MODES.indexOf(a.oversightMode); return i < 0 ? null : i; } },
		{ key: "sector", label: "Use area (Annex III)", q: "annexIIIArea", max: 4,
			points: function (a) { return aipSectorPoints(a.annexIIIArea); } },
		{ key: "exposure", label: "Who uses it", q: "gaiUsers", max: 2,
			points: function (a) { var i = AIP_USERS.indexOf(a.gaiUsers); return i < 0 ? null : i; } },
		{ key: "data", label: "Sensitivity of the data", q: "gaiPromptData", max: 3,
			points: function (a) {
				var d = a.gaiPromptData;
				if (!Array.isArray(d) || !d.length) return null;
				if (d.indexOf("Special category data") !== -1) return 3;
				if (d.indexOf("Personal data") !== -1) return 2;
				if (d.indexOf("Confidential business information") !== -1 || d.indexOf("Source code or credentials") !== -1) return 1;
				return 0;
			} }
	];
	var AIPATH_TIER_BANDS = [25, 50, 75]; // upper bounds in percent for levels I, II, III
	var AIPATH_LEVEL_NAMES = ["I", "II", "III", "IV"];
	var AIPATH_LEVEL_TEXT = [
		"Little to no impact: effects on people are brief and easily reversed.",
		"Moderate impact: effects are likely reversible and short-term.",
		"High impact: effects are difficult to reverse and may be ongoing.",
		"Very high impact: effects may be irreversible and lasting."
	];

	function aipathTier(a) {
		var max = 0, raw = 0, missing = [], parts = [];
		AIPATH_TIER_FACTORS.forEach(function (f) {
			max += f.max;
			var p = f.points(a);
			if (p === null) { missing.push(f.label); p = 0; }
			raw += p;
			parts.push({ key: f.key, label: f.label, points: p, max: f.max });
		});
		var pct = Math.round((raw / max) * 100);
		var idx = pct <= AIPATH_TIER_BANDS[0] ? 0 : (pct <= AIPATH_TIER_BANDS[1] ? 1 : (pct <= AIPATH_TIER_BANDS[2] ? 2 : 3));
		var floors = [];
		if (aipIsAnnexIII(a)) floors.push("Use in an Annex III area");
		if (a.aipDecisionEffect === AIP_DECISION_EFFECTS[3]) floors.push("Makes significant decisions on its own");
		var scored = idx;
		if (floors.length && idx < 2) idx = 2;
		return {
			index: idx, level: AIPATH_LEVEL_NAMES[idx], scoredLevel: AIPATH_LEVEL_NAMES[scored],
			raw: raw, max: max, pct: pct, parts: parts, floors: floors, missing: missing,
			full: idx >= 2, text: AIPATH_LEVEL_TEXT[idx]
		};
	}
	// Depth rule used by visibleIf: questions marked III+ show only at levels III and IV.
	function aipFull(a) { return aipathTier(a).full; }

