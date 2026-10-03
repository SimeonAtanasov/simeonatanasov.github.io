	/* ---------------- Steps ----------------
	 * Reused questions are copied from the other tools' step arrays by id, with
	 * a pathway label where the original wording is specific to that tool. The
	 * originals are never modified. */

	function aipFind(steps, id) {
		for (var i = 0; i < steps.length; i++) {
			for (var j = 0; j < steps[i].questions.length; j++) {
				if (steps[i].questions[j].id === id) return steps[i].questions[j];
			}
		}
		throw new Error("aipath: question not found: " + id);
	}
	function aipReuse(steps, id, over) {
		var src = aipFind(steps, id), copy = {};
		Object.keys(src).forEach(function (k) { copy[k] = src[k]; });
		Object.keys(over || {}).forEach(function (k) { copy[k] = over[k]; });
		return copy;
	}

	function aipGenAiOn(a) { return a.aipGenerates === "Yes" || a.aipFoundationModel === "Yes" || a.aipFreePrompts === "Yes"; }
	function aipEuOn(a) { return a.aipEu === "Yes" || a.aipEu === "Not sure"; }
	function aipDecides(a) { var i = AIP_DECISION_EFFECTS.indexOf(a.aipDecisionEffect); return i > 0; }
	function aipSignificant(a) { var i = AIP_DECISION_EFFECTS.indexOf(a.aipDecisionEffect); return i >= 2; }
	function aipPublic(a) { return a.gaiUsers === "The public" || (a.gaiPatterns || []).indexOf(GAI_PATTERNS[1]) !== -1; }
	function aipChat(a) { var p = a.gaiPatterns || []; return p.indexOf(GAI_PATTERNS[0]) !== -1 || p.indexOf(GAI_PATTERNS[1]) !== -1; }
	function aipPersonal(a) { return gaiPersonalData(a); }
	function aipProhibited(a) { return a.prohibitedUse === "Yes"; }

	var AIA_ROLES = [
		"Provider of the AI system",
		"Deployer",
		"Importer",
		"Distributor",
		"Product manufacturer (the AI system is placed on the market with our product, under our name)",
		"Provider of a general-purpose AI model"
	];
	function aipHasRole(a, i) { return (a.aiaRole || []).indexOf(AIA_ROLES[i]) !== -1; }
	function aipProviderRole(a) { return aipHasRole(a, 0) || aipHasRole(a, 4); }
	function aipDeployer(a) { return aipHasRole(a, 1); }
	function aipGpai(a) { return aipHasRole(a, 5); }

	var AIA_ART63 = [
		"No, none of them applies",
		"It performs a narrow procedural task",
		"It improves the result of a previously completed human activity",
		"It detects decision-making patterns or deviations from earlier patterns, and does not replace or influence the earlier human assessment without proper human review",
		"It performs a preparatory task to an assessment relevant to an Annex III use",
		"Not sure"
	];
	function aipArt63Claimed(a) { var i = AIA_ART63.indexOf(a.aiaArt63); return i >= 1 && i <= 4; }
	function aipArt63Exempt(a) { return aipIsAnnexIII(a) && aipArt63Claimed(a) && a.aiaProfiling === "No"; }
	function aipHighRiskIII(a) { return aipIsAnnexIII(a) && !aipArt63Exempt(a); }
	function aipHighRisk(a) { return aipHighRiskIII(a) || a.highRiskAnnexI === "Yes"; }

	var AIA_GPAI_SYSTEMIC = ["No", "Yes: cumulative training compute above 10^25 FLOP (presumed)", "Yes: designated by the Commission", "Not sure"];
	function aipSystemic(a) { var i = AIA_GPAI_SYSTEMIC.indexOf(a.aiaGpaiSystemic); return i >= 1; }
	function aipOpenSource(a) { return a.aiaGpaiOpenSource === "Yes"; }
	var AIA_DEEPFAKE = ["No", "Deep fakes", "Text published to inform the public on matters of public interest", "Both"];
	function aipInteracts(a) { return a.aiaInteracts === "Yes" || aipChat(a); }
	function aipTransparencyApplies(a) {
		return aipInteracts(a) || a.aipGenerates === "Yes" || a.aiaEmotion === "Yes" || (!!a.aiaDeepfake && a.aiaDeepfake !== "No");
	}
	function aipGenAiDepth(a) { return aipFull(a) || aipPublic(a); }

	var AIP_YPN = ["Yes", "Partially", "No"];
	var AIP_DECISIONS = ["Approve", "Approve with conditions", "Reject", "Not yet decided"];
	var AIP_REASSESS = [
		"A new model, or a new version of the model",
		"A new purpose, or new groups of users or affected people",
		"A new data source, or a change to the training data",
		"Use in a new country or jurisdiction",
		"An incident, a complaint or a near miss",
		"Performance or accuracy drifting from what was measured",
		"A change in the law or in regulatory guidance"
	];

	var AIP_GROUP_LABEL = { intake: "Intake", triggers: "Triggers", core: "Core", impact: "Impact", genai: "GenAI", aiact: "AI Act", governance: "Governance" };

	var AIP_INTAKE_STEPS = [
		{
			key: "aip-system", group: "intake",
			title: "The system and its use",
			intro: "One intake for the whole pathway. Every question below is asked once; the later steps read these answers, and the impact level (I to IV) is worked out from them.",
			questions: [
				aipReuse(AI_STEPS, "name", { label: "AI system or use case name" }),
				aipReuse(AI_STEPS, "description", { label: "What it does: its purpose, the decision or task it supports, who uses it and where" }),
				aipReuse(AI_STEPS, "lifecycle"),
				aipReuse(FRIA_STEPS, "provider", { label: "Vendor and model: who provides the system or the model it runs on, and which version or release is assessed" }),
				aipReuse(FRIA_STEPS, "firstUseDate", { label: "Date of first use (planned or actual)" }),
				aipReuse(FRIA_STEPS, "annexIIIArea", { label: "Use area: does the intended purpose fall in one of the high-risk areas of Annex III of the EU AI Act? Answer this even outside the EU; the area also sets the sector factor of the impact level." })
			]
		},
		{
			key: "aip-people", group: "intake",
			title: "People and data",
			questions: [
				aipReuse(FRIA_STEPS, "affectedCategories", { label: "Who is affected by the system's output?" }),
				aipReuse(FRIA_STEPS, "friaVulnerable"),
				aipReuse(FRIA_STEPS, "affectedScale"),
				{ id: "aipDecisionEffect", type: "select", label: "Does the output make or support decisions about people?", options: AIP_DECISION_EFFECTS },
				{ id: "aipReversibility", type: "select", label: "If an output is wrong, can its effect on a person be reversed?", options: AIP_REVERSIBILITY },
				aipReuse(GAI_STEPS, "gaiUsers"),
				aipReuse(GAI_STEPS, "gaiPromptData", { label: "What data does the system take in, retrieve or produce?" })
			]
		},
		{
			key: "aip-control", group: "intake",
			title: "Autonomy and human review",
			questions: [
				aipReuse(AI_STEPS, "autonomyLevel"),
				aipReuse(FRIA_STEPS, "oversightMode", { label: "When does a human act on an individual case or output before it takes effect?" })
			]
		}
	];

	var AIP_TRIGGER_STEP = {
		key: "aip-triggers", group: "triggers",
		title: "What applies",
		intro: "These answers open the modules that apply. The generative AI module opens if any of the first three is Yes; the AI Act module opens if the fourth is Yes or Not sure. Two more triggers come from the intake without a question: personal data (from the data question) opens the DPIA handover, and output that reaches people without review (from the review question) raises the findings on oversight.",
		questions: [
			{ id: "aipGenerates", type: "yesno", label: "Does it generate text, images, audio, video or code?" },
			{ id: "aipFoundationModel", type: "yesno", label: "Is it built on, or does it call, a foundation or general-purpose model?" },
			{ id: "aipFreePrompts", type: "yesno", label: "Can users give it free-form prompts?" },
			{ id: "aipEu", type: "select", label: "Is it placed on the EU market or put into service in the EU, used in the EU, or is its output used in the EU (EU AI Act Article 2(1))?", options: ["Yes", "No", "Not sure"] }
		]
	};

	var AIP_CORE_STEPS = [
		{
			key: "aip-core-oversight", group: "core",
			title: "Core: oversight, fairness and logging",
			intro: "Questions every AI system answers. Some show only at impact levels III and IV; the level is worked out from the intake and shown with the result.",
			questions: [
				aipReuse(FRIA_STEPS, "oversightAssigned", { label: "Are named people or roles assigned to oversee the system and its output?" }),
				aipReuse(FRIA_STEPS, "oversightCompetence", { visibleIf: function (a) { return a.oversightAssigned === "Yes"; } }),
				aipReuse(FRIA_STEPS, "automationBias", { visibleIf: function (a) { return aipDecides(a) && aipFull(a); } }),
				aipReuse(GAI_STEPS, "gaiUserGuidance", { label: "Are the people who use or oversee the system trained on its limits, so they do not over-rely on it? (This is also the AI literacy measure of EU AI Act Article 4.)" }),
				aipReuse(FRIA_STEPS, "biasEvaluated", { label: "Has the output been checked for different error rates or outcomes across groups of the people it affects?", visibleIf: aipDecides }),
				aipReuse(AI_STEPS, "loggingInPlace", { label: "Are the system's actions and data access logged, auditable and attributable to a responsible owner?" })
			]
		},
		{
			key: "aip-core-data", group: "core",
			title: "Core: data, access and third parties",
			questions: [
				aipReuse(AI_STEPS, "thirdPartyData"),
				aipReuse(GAI_STEPS, "gaiProviderUse", { label: "Can the provider of the system or model retain your inputs or use them for training?" }),
				aipReuse(AI_STEPS, "broadDataAccess"),
				aipReuse(AI_STEPS, "multiAgent"),
				aipReuse(AI_STEPS, "multiAgentDocumented"),
				aipReuse(AI_STEPS, "businessCriticalData", { visibleIf: aipFull }),
				aipReuse(AI_STEPS, "competitorExposure", { visibleIf: aipFull })
			]
		}
	];

	var AIP_IMPACT_STEP = {
		key: "aip-impact", group: "impact",
		title: "Impact on people",
		intro: "The effects of the system on the people and groups it reaches, rated before and after the measures, on the same severity and likelihood matrix as the Full DPIA and the FRIA. Short at levels I and II, full at III and IV. The method follows ISO/IEC 42005:2025 (AI system impact assessment). These answers use the FRIA's own questions, so they carry into a FRIA if you start one from the result.",
		sources: [{ label: "ISO/IEC 42005:2025 (method guidance)", url: ISO_42005_URL }, { label: "EU AI Act, Article 27", url: AIA_ART27_URL }],
		questions: [
			aipReuse(FRIA_STEPS, "harmsDescription", { label: "Describe the specific harms: what could go wrong, for whom, and how it would show up (a wrong answer relied on, a biased score, an intrusive inference, an unsafe action)" }),
			aipReuse(FRIA_STEPS, "rightsAtRisk", { visibleIf: aipFull }),
			{ id: "aipSocietalImpact", type: "textarea", label: "Effects beyond individuals: on groups, communities, society or the environment", visibleIf: aipFull },
			aipReuse(FRIA_STEPS, "providerInfoReviewed", { label: "Have the provider's instructions, documentation or model card been reviewed, including known limitations, accuracy levels and foreseeable misuse?", visibleIf: aipFull }),
			aipReuse(FRIA_STEPS, "friaInherentSeverity", { label: "Inherent severity: how serious would the worst credible harm be, before any measures?" }),
			aipReuse(FRIA_STEPS, "friaInherentLikelihood", { label: "Inherent likelihood: how likely is it, before any measures?" }),
			aipReuse(FRIA_STEPS, "mitigationMeasures"),
			aipReuse(FRIA_STEPS, "materialiseMeasures", { visibleIf: aipFull }),
			aipReuse(FRIA_STEPS, "complaintMechanism", { visibleIf: function (a) { return aipFull(a) && aipDecides(a); } }),
			aipReuse(FRIA_STEPS, "explanationProcess", { label: "Can you give an affected person a clear explanation of the role the system played in a decision about them?", visibleIf: function (a) { return aipFull(a) && aipDecides(a); } }),
			aipReuse(FRIA_STEPS, "friaResidualSeverity"),
			aipReuse(FRIA_STEPS, "friaResidualLikelihood")
		]
	};

	// GenAI module: the Generative AI tool's steps without what the pathway has
	// already asked. Five questions follow the depth rule, except for systems
	// the public uses, where they always show.
	var AIP_GENAI_SKIP = { name: 1, description: 1, gaiUsers: 1, gaiPromptData: 1, gaiProviderUse: 1, gaiHumanReview: 1, gaiUserGuidance: 1 };
	var AIP_GENAI_DEPTH = { gaiInputFiltering: 1, gaiEmbeddingStore: 1, gaiRateLimits: 1, gaiThreatModel: 1, gaiEnergy: 1 };
	var AIP_GENAI_STEPS = GAI_STEPS.map(function (s) {
		var copy = {
			key: "aip-gai-" + s.key, group: "genai",
			title: "Generative AI: " + (s.key === "profile" ? "patterns and model" : s.title.charAt(0).toLowerCase() + s.title.slice(1)),
			visibleIf: aipGenAiOn,
			questions: []
		};
		if (s.key === "profile") {
			copy.intro = "Opened because the system generates content, runs on a foundation model or takes free-form prompts. Risks specific to generative models, mapped to the twelve risks of NIST AI 600-1 and the OWASP Top 10 for LLM Applications. Questions the intake or the core steps already asked are not repeated.";
			copy.sources = s.sources;
		} else if (s.intro) {
			copy.intro = s.intro;
		}
		s.questions.forEach(function (q) {
			if (AIP_GENAI_SKIP[q.id]) return;
			var over = {};
			if (AIP_GENAI_DEPTH[q.id]) {
				over.visibleIf = q.visibleIf
					? (function (orig) { return function (a) { return orig(a) && aipGenAiDepth(a); }; })(q.visibleIf)
					: aipGenAiDepth;
			}
			if (q.id === "gaiDisclosure") {
				over.visibleIf = function (a) { return !aipEuOn(a); };
				over.label = "Are people told when they interact with AI, and is synthetic content marked as such?";
			}
			copy.questions.push(aipReuse(GAI_STEPS, q.id, over));
		});
		return copy;
	});

	var AIP_AIACT_STEPS = [
		{
			key: "aip-aia-role", group: "aiact",
			title: "EU AI Act: role and prohibited practices",
			visibleIf: aipEuOn,
			intro: "Opened because the system is placed on the EU market, used in the EU, or its output is used there (Article 2(1)). A provider develops an AI system or model, or has it developed, and places it on the market or puts it into service under its own name; a deployer uses it under its authority (Article 3). One organisation can hold several roles. Article 2 also excludes some uses: military, defence and national security, scientific research, testing before placing on the market, purely personal use, and free and open-source systems unless they are high-risk or caught by Article 5 or 50.",
			sources: [{ label: "AI Act Digest, Article 2", url: "ai-act-digest.html#art-2" }, { label: "AI Act Digest, Article 5", url: "ai-act-digest.html#art-5" }],
			questions: [
				{ id: "aiaRole", type: "multiselect", label: "What is your role for this system?", options: AIA_ROLES },
				aipReuse(FRIA_STEPS, "deployerType", { visibleIf: aipDeployer }),
				aipReuse(FRIA_STEPS, "intendedPurposeAligned", { visibleIf: aipDeployer }),
				aipReuse(AI_STEPS, "prohibitedUse")
			]
		},
		{
			key: "aip-aia-highrisk", group: "aiact",
			title: "EU AI Act: high-risk classification",
			visibleIf: function (a) { return aipEuOn(a) && !aipProhibited(a); },
			intro: "Two routes to high risk (Article 6): a product, or a safety component of a product, under the Annex I legislation that requires third-party conformity assessment; and the Annex III uses, which the intake already asked about. An Annex III system is not high-risk where one of the four conditions of Article 6(3) applies, unless it profiles natural persons, in which case it always is. High-risk rules apply from 2 December 2027 (Annex III) and 2 August 2028 (Annex I), under Regulation (EU) 2026/1744.",
			sources: [{ label: "AI Act Digest, Article 6", url: "ai-act-digest.html#art-6" }],
			questions: [
				aipReuse(AI_STEPS, "highRiskAnnexI"),
				{ id: "aiaArt63", type: "select", label: "Does one of the Article 6(3) conditions apply, so that the system does not pose a significant risk of harm?", options: AIA_ART63, visibleIf: aipIsAnnexIII },
				{ id: "aiaProfiling", type: "yesno", label: "Does the system profile natural persons?", visibleIf: function (a) { return aipIsAnnexIII(a) && aipArt63Claimed(a); } },
				{ id: "aiaArt63Documented", type: "yesno", label: "Is the Article 6(3) assessment documented before the system is placed on the market, and the system registered under Article 49(2)?", visibleIf: function (a) { return aipArt63Exempt(a) && aipProviderRole(a); } },
				aipReuse(FRIA_STEPS, "affectedAware", { visibleIf: function (a) { return aipDeployer(a) && aipHighRiskIII(a) && aipDecides(a); } })
			]
		},
		{
			key: "aip-aia-gpai", group: "aiact",
			title: "EU AI Act: general-purpose AI model",
			visibleIf: function (a) { return aipEuOn(a) && !aipProhibited(a) && aipGpai(a); },
			intro: "Duties of providers of general-purpose AI models (Articles 51 to 55), applying since 2 August 2025; models already on the market before then comply by 2 August 2027 (Article 111(3)). A model is presumed to have systemic risk above 10^25 floating point operations of cumulative training compute, or the Commission designates it (Article 51).",
			sources: [{ label: "AI Act Digest, Article 53", url: "ai-act-digest.html#art-53" }, { label: "AI Act Digest, Article 55", url: "ai-act-digest.html#art-55" }],
			questions: [
				{ id: "aiaGpaiSystemic", type: "select", label: "Does the model have systemic risk?", options: AIA_GPAI_SYSTEMIC },
				{ id: "aiaGpaiOpenSource", type: "yesno", label: "Is it released under a free and open-source licence, with its weights, architecture and usage information public (Article 53(2))?" },
				{ id: "aiaGpaiOutsideEu", type: "yesno", label: "Is the model provider established outside the EU?" },
				{ id: "aiaGpaiDocs", type: "select", label: "Is the Annex XI technical documentation kept, and the Annex XII information available to downstream providers (Article 53(1)(a) and (b))?", options: AIP_YPN,
					visibleIf: function (a) { return !aipOpenSource(a) || aipSystemic(a); } },
				{ id: "aiaGpaiCopyright", type: "select", label: "Is there a policy to comply with EU copyright law, including rights reservations under Article 4(3) of Directive (EU) 2019/790 (Article 53(1)(c))?", options: AIP_YPN },
				{ id: "aiaGpaiSummary", type: "select", label: "Is a sufficiently detailed summary of the training content published, on the AI Office template (Article 53(1)(d))?", options: AIP_YPN },
				{ id: "aiaGpaiRep", type: "yesno", label: "Is an authorised representative established in the Union appointed by written mandate (Article 54)?",
					visibleIf: function (a) { return a.aiaGpaiOutsideEu === "Yes" && (!aipOpenSource(a) || aipSystemic(a)); } },
				{ id: "aiaGpaiEval", type: "select", label: "Systemic risk: is the model evaluated with standardised protocols, including adversarial testing, and are systemic risks assessed and mitigated (Article 55(1)(a) and (b))?", options: AIP_YPN, visibleIf: aipSystemic },
				{ id: "aiaGpaiIncidents", type: "select", label: "Systemic risk: are serious incidents tracked, documented and reported to the AI Office without undue delay (Article 55(1)(c))?", options: AIP_YPN, visibleIf: aipSystemic },
				{ id: "aiaGpaiCyber", type: "select", label: "Systemic risk: is the model and its physical infrastructure adequately protected (Article 55(1)(d))?", options: AIP_YPN, visibleIf: aipSystemic }
			]
		},
		{
			key: "aip-aia-transparency", group: "aiact",
			title: "EU AI Act: transparency (Article 50)",
			visibleIf: function (a) { return aipEuOn(a) && !aipProhibited(a); },
			intro: "Article 50 applies from 2 August 2026, whatever the risk level. Providers design systems that interact with people so they know it is AI, unless that is obvious, and mark synthetic audio, image, video and text in a machine-readable way (generators already on the market before 2 August 2026 have until 2 December 2026 for the marking, Article 111(4)). Deployers inform people exposed to emotion recognition or biometric categorisation, and disclose deep fakes and AI-generated text published to inform the public on matters of public interest. Whether the system generates content was asked in the triggers.",
			sources: [{ label: "AI Act Digest, Article 50", url: "ai-act-digest.html#art-50" }],
			questions: [
				{ id: "aiaInteracts", type: "yesno", label: "Is it intended to interact directly with people (a chatbot, a voice assistant, an agent that writes to people)?", visibleIf: function (a) { return !aipChat(a); } },
				{ id: "aiaEmotion", type: "yesno", label: "Does it recognise emotions or sort people into categories from biometric data?" },
				{ id: "aiaDeepfake", type: "select", label: "Is it used to produce deep fakes (image, audio or video resembling real people, objects, places or events), or text published to inform the public on matters of public interest?", options: AIA_DEEPFAKE,
					visibleIf: function (a) { return a.aipGenerates === "Yes"; } },
				{ id: "aiaTransparencyDone", type: "select", label: "Are the transparency measures that apply in place: disclosure at the first interaction, machine-readable marking, information to people exposed, deep fake disclosure?", options: AIP_YPN,
					visibleIf: aipTransparencyApplies }
			]
		}
	];

	var AIP_GOVERNANCE_STEP = {
		key: "aip-governance", group: "governance",
		title: "Governance and decision",
		intro: "Who owns the system, who assessed it, who decides, and when it is looked at again. ISO/IEC 42001 asks for the same records (clauses 6.1.2, 6.1.4 and 8.2 to 8.4), as does the NIST AI RMF Govern function; both are voluntary.",
		questions: [
			{ id: "aipSystemOwner", type: "text", label: "System owner (name or role)" },
			{ id: "aipAssessor", type: "text", label: "Assessor (name or role)" },
			{ id: "aipApprover", type: "text", label: "Approver (name or role)" },
			{ id: "aipDecision", type: "select", label: "Decision", options: AIP_DECISIONS },
			{ id: "aipConditions", type: "textarea", label: "Conditions of the approval, each with an owner and a date", visibleIf: function (a) { return a.aipDecision === AIP_DECISIONS[1]; } },
			{ id: "aipEvidence", type: "textarea", label: "Evidence references: test reports, model cards, contracts, earlier assessments", visibleIf: aipFull },
			aipReuse(AI_STEPS, "legalReview"),
			aipReuse(FRIA_STEPS, "suspensionProcess", { label: "Is there a process to suspend use, and to report to the provider and any authority, where the system presents a risk or a serious incident occurs?", visibleIf: aipFull }),
			{ id: "aipReviewDate", type: "date", label: "Next review date" },
			{ id: "aipReassessTriggers", type: "multiselect", label: "Events that trigger a reassessment before that date", options: AIP_REASSESS }
		]
	};

	var AIPATH_STEPS = AIP_INTAKE_STEPS
		.concat([AIP_TRIGGER_STEP])
		.concat(AIP_CORE_STEPS)
		.concat([AIP_IMPACT_STEP])
		.concat(AIP_GENAI_STEPS)
		.concat(AIP_AIACT_STEPS)
		.concat([AIP_GOVERNANCE_STEP]);

