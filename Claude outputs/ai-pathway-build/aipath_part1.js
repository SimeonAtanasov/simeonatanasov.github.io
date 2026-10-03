	/* =================================================================
	 *  ADDED 2026-10-03 (tool change log TC-08): AI ASSESSMENT PATHWAY.
	 *  One entry point for assessing an AI system. A shared intake runs
	 *  once, a scored impact level (I to IV) sets how deep each part goes,
	 *  and trigger answers open only the modules that apply. Questions are
	 *  reused by id from the AI Risk, Generative AI and FRIA tools, so the
	 *  answers carry into the FRIA and DPIA handovers. Nothing above this
	 *  block is changed; it reads the shared vocabularies and the step and
	 *  check arrays of the other tools and edits none of them.
	 * ================================================================= */

	var NIST_AI_RMF_URL = "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf";
	var ISO_42001_URL = "https://www.iso.org/standard/42001";
	var ISO_42005_URL = "https://www.iso.org/standard/42005";
	var SG_GENAI_URL = "https://aiverifyfoundation.sg/resources/mgf-gen-ai/";
	var CANADA_AIA_URL = "https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html";

	/* ---------------- Mapping layer ----------------
	 * Each question the pathway asks (or derives) is mapped to NIST AI RMF 1.0
	 * subcategories, ISO/IEC 42001 clauses and Annex A controls (numbers and
	 * titles only), and the nine dimensions of the Singapore Model AI
	 * Governance Framework for Generative AI. NIST AI 600-1 and OWASP come from
	 * GAI_CHECKS, unchanged. The mapping is this tool's own. A row that no
	 * answered question touches is "Not assessed", never a pass. */

	var SG_DIMENSIONS = [
		"Accountability",
		"Data",
		"Trusted Development and Deployment",
		"Incident Reporting",
		"Testing and Assurance",
		"Security",
		"Content Provenance",
		"Safety and Alignment R&D",
		"AI for Public Good"
	];

	// Generated from ai-crosswalk-build/nist_ai_rmf.json and iso42001.json by
	// Claude outputs/ai-pathway-build/build_aipath.py: only the ids mapped below.
	var AIPATH_NIST_TEXT = /*@@NIST_TEXT@@*/{};
	var AIPATH_ISO_TITLES = /*@@ISO_TITLES@@*/{};

	// id: [NIST AI RMF subcategories], [ISO/IEC 42001 clauses and controls], [Singapore dimension indexes]
	var AIPATH_FRAMEWORK_MAP = {
		// Intake
		description: [["MAP 1.1", "MAP 2.1"], ["A.9.4"], []],
		lifecycle: [["GOVERN 1.6"], ["A.6.2.5"], []],
		provider: [["GOVERN 6.1", "MAP 4.1"], ["A.10.3"], [0]],
		annexIIIArea: [["GOVERN 1.1", "MAP 1.1", "MAP 3.3"], ["4.1"], []],
		affectedCategories: [["MAP 1.1", "MAP 5.1"], ["A.5.4"], []],
		friaVulnerable: [["MAP 5.1"], ["A.5.4"], []],
		affectedScale: [["MAP 5.1"], ["6.1.4"], []],
		aipDecisionEffect: [["MAP 3.3", "MAP 5.1"], ["6.1.4"], []],
		aipReversibility: [["MAP 5.1"], ["6.1.4"], []],
		gaiUsers: [["MAP 1.1"], ["A.9.4"], []],
		gaiPromptData: [["MEASURE 2.10"], ["A.7.2"], [1]],
		autonomyLevel: [["GOVERN 3.2", "MAP 3.5"], ["A.9.2"], []],
		oversightMode: [["GOVERN 3.2", "MAP 3.5"], ["A.9.2"], [0]],
		// Triggers
		aipGenerates: [["MAP 2.1"], [], []],
		aipFoundationModel: [["MAP 2.1", "MAP 4.1"], [], []],
		aipFreePrompts: [["MAP 2.1"], [], []],
		aipEu: [["GOVERN 1.1"], ["4.1"], []],
		// Core
		loggingInPlace: [["MEASURE 2.4", "MANAGE 4.1"], ["A.6.2.8"], [0]],
		multiAgent: [["MAP 4.1"], ["A.10.3"], []],
		multiAgentDocumented: [["GOVERN 1.6", "MAP 4.1"], ["A.10.3"], [0]],
		broadDataAccess: [["MEASURE 2.7"], [], [5]],
		thirdPartyData: [["GOVERN 6.1", "MAP 4.1"], ["A.7.3", "A.7.5"], [1]],
		gaiProviderUse: [["GOVERN 6.1", "MEASURE 2.10"], ["A.10.3"], [1]],
		businessCriticalData: [["MAP 4.2"], [], [5]],
		competitorExposure: [["MEASURE 2.7"], [], [5]],
		biasEvaluated: [["MEASURE 2.11"], ["A.5.4", "A.7.4"], [4]],
		oversightAssigned: [["GOVERN 2.1", "GOVERN 3.2", "MAP 3.5"], ["A.3.2", "A.9.2"], [0]],
		oversightCompetence: [["GOVERN 2.2", "MAP 3.4"], ["7.2"], [0]],
		automationBias: [["MAP 3.5", "MEASURE 2.9"], ["A.9.2"], []],
		gaiUserGuidance: [["GOVERN 2.2", "MAP 3.4"], ["7.2", "7.3", "A.4.6"], []],
		// Impact
		rightsAtRisk: [["MAP 5.1"], ["A.5.4"], []],
		harmsDescription: [["MAP 3.2", "MAP 5.1"], ["6.1.4", "8.4", "A.5.4"], []],
		providerInfoReviewed: [["GOVERN 6.1", "MAP 2.2"], ["A.8.2"], []],
		friaInherentSeverity: [["MAP 5.1"], ["8.4", "A.5.2"], []],
		friaInherentLikelihood: [["MAP 5.1"], ["8.4", "A.5.2"], []],
		mitigationMeasures: [["MANAGE 1.3"], ["6.1.3", "8.3"], []],
		friaResidualSeverity: [["MANAGE 1.4"], ["8.3"], []],
		friaResidualLikelihood: [["MANAGE 1.4"], ["8.3"], []],
		materialiseMeasures: [["MANAGE 2.3", "MANAGE 4.3"], ["A.8.4"], [3]],
		complaintMechanism: [["GOVERN 5.1", "MEASURE 3.3"], ["A.8.5"], [0]],
		explanationProcess: [["MEASURE 2.8", "MEASURE 2.9"], ["A.8.5"], []],
		aipSocietalImpact: [["MAP 5.1"], ["A.5.5"], [8]],
		// Generative AI (NIST AI 600-1 and OWASP come from GAI_CHECKS)
		gaiPatterns: [["MAP 2.1"], [], []],
		gaiModelSource: [["MAP 4.1"], ["A.10.3"], [0]],
		gaiUntrustedContent: [["MAP 4.1"], [], [5]],
		gaiInjectionTested: [["MEASURE 2.7"], ["A.6.2.4"], [4, 5]],
		gaiSystemPromptSecrets: [["MEASURE 2.7"], [], [5]],
		gaiInputFiltering: [["MANAGE 1.3", "MEASURE 2.7"], [], [5]],
		gaiOutputLeakCheck: [["MEASURE 2.10"], [], [1]],
		gaiRagPermissions: [["MEASURE 2.7", "MEASURE 2.10"], [], [1, 5]],
		gaiEmbeddingStore: [["MEASURE 2.7"], [], [5]],
		gaiIpCheck: [["GOVERN 6.1", "MAP 4.1"], [], [1]],
		gaiOutputHandling: [["MEASURE 2.7"], ["A.6.2.4"], [5]],
		gaiGrounding: [["MEASURE 2.5", "MEASURE 2.9"], [], [2]],
		gaiHumanReview: [["MAP 3.5"], ["A.9.2"], []],
		gaiContentFilters: [["MANAGE 1.3", "MEASURE 2.6"], [], [2]],
		gaiDisclosure: [["MEASURE 2.8"], ["A.8.2"], [6]],
		gaiToolPermissions: [["GOVERN 3.2", "MAP 3.5"], ["A.9.2"], [2]],
		gaiApproval: [["MAP 3.5"], ["A.9.2"], [0]],
		gaiProvenance: [["MANAGE 3.2", "MAP 4.1"], ["A.6.2.7", "A.10.3"], [2]],
		gaiTrainingDataVetted: [["MAP 2.3", "MEASURE 2.7"], ["A.7.4", "A.7.5"], [1]],
		gaiRateLimits: [["MEASURE 2.7"], [], [5]],
		gaiRedTeam: [["MEASURE 1.3", "MEASURE 2.7"], ["A.6.2.4"], [4]],
		gaiThreatModel: [["MAP 4.2", "MEASURE 2.7"], [], [5]],
		gaiBiasEval: [["MEASURE 2.11"], [], [4]],
		gaiMonitoring: [["MANAGE 4.1", "MANAGE 4.3", "MEASURE 2.4"], ["A.6.2.6", "A.8.4"], [3]],
		gaiEnergy: [["MEASURE 2.12"], [], [8]],
		// AI Act module
		aiaRole: [["GOVERN 2.1", "GOVERN 6.1"], ["A.10.2"], [0]],
		deployerType: [["GOVERN 1.1"], [], []],
		intendedPurposeAligned: [["MAP 1.1", "MAP 3.3"], ["A.9.4"], []],
		prohibitedUse: [["GOVERN 1.1", "MANAGE 1.1"], ["4.1", "A.9.4"], []],
		highRiskAnnexI: [["GOVERN 1.1", "MAP 3.3"], ["4.1"], []],
		aiaArt63: [["GOVERN 1.1", "MAP 3.3"], ["4.1"], []],
		aiaProfiling: [["GOVERN 1.1", "MAP 3.3"], ["4.1"], []],
		aiaArt63Documented: [["GOVERN 1.1", "GOVERN 1.6"], ["7.5"], [0]],
		affectedAware: [["GOVERN 5.1", "MEASURE 2.8"], ["A.8.5"], [0]],
		aiaInteracts: [["GOVERN 1.1", "MEASURE 2.8"], ["A.8.2"], []],
		aiaEmotion: [["GOVERN 1.1", "MEASURE 2.8"], ["7.4", "A.8.5"], []],
		aiaDeepfake: [["GOVERN 1.1", "MEASURE 2.8"], ["7.4", "A.8.5"], [6]],
		aiaTransparencyDone: [["MEASURE 2.8"], ["A.8.2", "A.8.5"], [6]],
		aiaGpaiSystemic: [["GOVERN 1.1"], [], []],
		aiaGpaiOpenSource: [["GOVERN 1.1"], [], []],
		aiaGpaiOutsideEu: [["GOVERN 1.1"], [], [0]],
		aiaGpaiRep: [["GOVERN 1.1"], [], [0]],
		aiaGpaiDocs: [["MAP 2.2"], ["A.6.2.7", "A.8.2"], [2]],
		aiaGpaiCopyright: [["GOVERN 6.1"], ["A.7.5"], [1]],
		aiaGpaiSummary: [["MAP 2.2"], ["A.7.5"], [1, 2]],
		aiaGpaiEval: [["MEASURE 1.3", "MEASURE 2.6"], ["A.6.2.4"], [4, 7]],
		aiaGpaiIncidents: [["MANAGE 4.3"], ["A.8.4"], [3]],
		aiaGpaiCyber: [["MEASURE 2.7"], [], [5]],
		// Governance
		aipSystemOwner: [["GOVERN 2.1"], ["5.3", "A.3.2"], [0]],
		aipAssessor: [["GOVERN 2.1", "MEASURE 1.3"], ["6.1.2", "8.2", "A.3.2"], []],
		aipApprover: [["GOVERN 2.3"], ["5.3"], [0]],
		aipDecision: [["MANAGE 1.1"], ["6.1.3", "8.3"], []],
		aipConditions: [["MANAGE 1.3"], ["8.3"], []],
		aipEvidence: [["GOVERN 4.2"], ["7.5"], []],
		aipReviewDate: [["GOVERN 1.5", "MEASURE 3.1"], ["8.2", "9.1"], []],
		aipReassessTriggers: [["GOVERN 1.5", "MANAGE 4.2"], ["6.3", "8.2"], []],
		legalReview: [["GOVERN 1.1"], ["4.1"], []],
		suspensionProcess: [["MANAGE 2.4", "MANAGE 4.3"], ["A.8.4"], [3]]
	};

	function aipathAnswered(v) {
		if (v === undefined || v === null || v === "") return false;
		if (Array.isArray(v)) return v.length > 0;
		return true;
	}

	/* Coverage per framework. `asked` is the set of question ids the pathway
	 * showed (or derived) for this assessment; `qSev` maps a question id to the
	 * worst severity of the findings tied to it. A row is a gap if any mapped
	 * question carries a finding, addressed if at least one mapped question was
	 * answered with none, and not assessed otherwise. */
	function aipathCoverage(d, asked, qSev) {
		var SEV = ["low", "medium", "high"];
		function blank() { return { gap: null, ok: 0 }; }
		var nist = {}, iso = {}, sg = SG_DIMENSIONS.map(blank);
		Object.keys(AIPATH_FRAMEWORK_MAP).forEach(function (q) {
			var m = AIPATH_FRAMEWORK_MAP[q];
			m[0].forEach(function (id) { if (!nist[id]) nist[id] = blank(); });
			m[1].forEach(function (id) { if (!iso[id]) iso[id] = blank(); });
			if (!asked[q] || !aipathAnswered(d[q])) return;
			var sev = qSev[q] || null;
			function mark(s) {
				if (sev) { if (!s.gap || SEV.indexOf(sev) > SEV.indexOf(s.gap)) s.gap = sev; }
				else s.ok++;
			}
			m[0].forEach(function (id) { mark(nist[id]); });
			m[1].forEach(function (id) { mark(iso[id]); });
			m[2].forEach(function (i) { mark(sg[i]); });
		});
		function status(s) { return s.gap ? "Gap (" + s.gap + ")" : (s.ok ? "Addressed" : "Not assessed"); }
		function nistKey(id) {
			var p = id.split(" "), f = ["GOVERN", "MAP", "MEASURE", "MANAGE"].indexOf(p[0]);
			var n = p[1].split(".");
			return f * 10000 + parseInt(n[0], 10) * 100 + parseInt(n[1], 10);
		}
		function isoKey(id) {
			var annex = id.indexOf("A.") === 0 ? 1 : 0;
			var n = id.replace("A.", "").split(".").map(function (x) { return parseInt(x, 10); });
			return annex * 1e6 + n[0] * 1e4 + (n[1] || 0) * 1e2 + (n[2] || 0);
		}
		var nistRows = Object.keys(nist).sort(function (x, y) { return nistKey(x) - nistKey(y); })
			.map(function (id) { return [id, AIPATH_NIST_TEXT[id] || "", status(nist[id])]; });
		var isoRows = Object.keys(iso).sort(function (x, y) { return isoKey(x) - isoKey(y); })
			.map(function (id) { return [id, AIPATH_ISO_TITLES[id] || "", status(iso[id])]; });
		var sgRows = SG_DIMENSIONS.map(function (n, i) { return [n, status(sg[i])]; });
		function count(rows, col) {
			var c = { gap: 0, ok: 0, na: 0 };
			rows.forEach(function (r) { var s = r[col]; if (s.indexOf("Gap") === 0) c.gap++; else if (s === "Addressed") c.ok++; else c.na++; });
			return c;
		}
		return { nist: nistRows, iso: isoRows, sg: sgRows, nistCount: count(nistRows, 2), isoCount: count(isoRows, 2), sgCount: count(sgRows, 1) };
	}

