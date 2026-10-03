	/* ---------------- Answers seen by the result ----------------
	 * aipathAsked: the question ids the pathway showed for these answers.
	 * aipathDerive: a copy of the answers with every hidden answer removed (a
	 * stale answer to a question that is no longer shown never produces a
	 * finding) and with the values the standalone result functions expect under
	 * their own ids, taken from the question the pathway asked instead. */

	function aipathAsked(a) {
		var asked = {};
		AIPATH_STEPS.forEach(function (s) {
			if (s.visibleIf && !s.visibleIf(a)) return;
			s.questions.forEach(function (q) { if (!q.visibleIf || q.visibleIf(a)) asked[q.id] = true; });
		});
		if (aipGenAiOn(a)) {
			if (asked.oversightMode) asked.gaiHumanReview = true;
			if (aipEuOn(a) && !aipProhibited(a)) asked.gaiDisclosure = true;
		}
		if (aipEuOn(a) && !aipProhibited(a) && aipChat(a)) asked.aiaInteracts = true;
		return asked;
	}

	function aipathDerive(a) {
		var asked = aipathAsked(a), d = {};
		var pathIds = {};
		AIPATH_STEPS.forEach(function (s) { s.questions.forEach(function (q) { pathIds[q.id] = true; }); });
		Object.keys(a).forEach(function (k) {
			var base = /Note$/.test(k) && pathIds[k.slice(0, -4)] ? k.slice(0, -4) : k;
			if (pathIds[base] && !asked[base]) return;
			d[k] = a[k];
		});
		// AI Risk Assessment ids
		if (d.annexIIIArea) d.highRiskAnnexIII = aipIsAnnexIII(d) ? "Yes" : (d.annexIIIArea === "Not sure" ? "Unsure" : "No");
		if (d.oversightAssigned) d.humanOversight = d.oversightAssigned;
		if (d.gaiProviderUse) d.providerTraining = d.gaiProviderUse === "Yes" ? "Yes" : (d.gaiProviderUse === "Not sure" ? "Unsure" : "No");
		d.ownersAssigned = d.aipSystemOwner ? "Yes" : "No";
		d.auditFrequency = d.aipReviewDate ? "Yes" : "No";
		// Generative AI ids
		if (asked.gaiHumanReview && d.oversightMode) {
			d.gaiHumanReview = { "Before every decision takes effect": "Always", "On flagged or contested cases only": "For high-impact uses" }[d.oversightMode] || "No";
		}
		if (asked.gaiDisclosure) {
			if (aipTransparencyApplies(d)) { if (d.aiaTransparencyDone) d.gaiDisclosure = d.aiaTransparencyDone; else delete d.gaiDisclosure; }
			else d.gaiDisclosure = "Not applicable";
		}
		if (asked.aiaInteracts && aipChat(d)) d.aiaInteracts = "Yes";
		return d;
	}

	/* ---------------- Findings ----------------
	 * Every finding carries the question ids it rests on (qs, the first is the
	 * one it belongs to) and the part of the pathway that owns it. */

	var AIP_SEV = ["low", "medium", "high"];
	function aipF(title, detail, severity, qs) { return { title: title, detail: detail, severity: severity, qs: qs }; }

	// aiResult findings the pathway keeps, with the questions behind them. Its
	// regulatory findings are replaced by the AI Act module.
	var AIP_AI_FACTOR_QS = {
		"Broad autonomy without logging": ["loggingInPlace", "autonomyLevel"],
		"Undocumented multi-agent chain": ["multiAgentDocumented", "multiAgent"],
		"Broad access to sensitive systems/data": ["broadDataAccess"],
		"Business-critical data without full oversight": ["businessCriticalData", "loggingInPlace", "oversightAssigned"],
		"Possible competitor/external exposure": ["competitorExposure"],
		"Provider trains on your data": ["gaiProviderUse"],
		"Unclear if provider trains on your data": ["gaiProviderUse"],
		"No legal/compliance review on record": ["legalReview"],
		"No recurring audit cadence defined": ["aipReviewDate"]
	};

	function aipathOwnFindings(d, tier) {
		var f = [];
		var sig = aipSignificant(d);
		// Core
		if (d.oversightAssigned === "No") f.push(aipF("No assigned human oversight", "Name the people or roles who oversee the system, with the competence, training and authority to disregard or override its output.", sig ? "high" : "medium", ["oversightAssigned"]));
		if (d.oversightCompetence === "No" || d.oversightCompetence === "Partially") f.push(aipF("Oversight without full competence or authority", "Oversight only counts if the people assigned understand the output and can disregard or override it.", "medium", ["oversightCompetence"]));
		if (d.automationBias === "No") f.push(aipF("Automation bias not addressed", "Show the output with its confidence and limits, require a reason to follow it in sensitive cases, and keep the workload low enough for real review.", "medium", ["automationBias"]));
		if (d.gaiUserGuidance === "No" || d.gaiUserGuidance === "Partially") f.push(aipF("Users not trained on the system's limits", "Train the people who use or oversee the system on what it gets wrong, so they do not over-rely on it.", d.gaiUserGuidance === "No" ? "medium" : "low", ["gaiUserGuidance"]));
		if (d.biasEvaluated === "No" || d.biasEvaluated === "Not possible with the data available") f.push(aipF("No check for unequal outcomes", "Without error rates or outcomes compared across groups, a discrimination risk cannot be rated with confidence. Where the data does not allow it, record why and what is done instead.", sig ? "high" : "medium", ["biasEvaluated"]));
		if (d.loggingInPlace === "No") f.push(aipF("Actions and data access not logged", "Log what the system does and reads, attributable to an owner, so incidents can be traced and decisions reconstructed.", "medium", ["loggingInPlace"]));
		if (d.thirdPartyData === "Yes" && !d.thirdPartyDataNote) f.push(aipF("Third-party data without a provenance record", "Record where the training or input data comes from, under what licence or lawful access, and how its quality was checked.", "low", ["thirdPartyData"]));
		if (d.oversightMode === "No human review" && sig) f.push(aipF("Significant decisions without human review", "Decisions with legal or similarly significant effects reach people with no human acting on them. Add review before they take effect; where personal data is involved, Article 22 GDPR applies as well.", "high", ["oversightMode", "aipDecisionEffect"]));
		else if (tier.full && sig && d.oversightMode && d.oversightMode !== AIP_OVERSIGHT_MODES[0]) f.push(aipF("No human makes the final decision", "At impact level III and above a person should make the final decision on each case before it takes effect, as the Canadian Directive on Automated Decision-Making requires from its level III.", "medium", ["oversightMode", "aipDecisionEffect"]));
		// Impact
		var inh = riskLevelFor(FRIA_SEVERITY.indexOf(d.friaInherentSeverity), FRIA_LIKELIHOOD.indexOf(d.friaInherentLikelihood));
		var res = riskLevelFor(FRIA_SEVERITY.indexOf(d.friaResidualSeverity), FRIA_LIKELIHOOD.indexOf(d.friaResidualLikelihood));
		var ORDER = ["Low", "Medium", "High", "Very High"];
		if (!d.harmsDescription) f.push(aipF("Harms not described", "Describe what could go wrong, for whom, and how it would show up. The ratings below mean little without it.", "medium", ["harmsDescription"]));
		if (!inh) f.push(aipF("Inherent risk not rated", "Rate severity and likelihood before measures, so the effect of the measures can be shown.", "low", ["friaInherentSeverity"]));
		if (inh && !res) f.push(aipF("Residual risk not rated", "Rate severity and likelihood with every measure in place.", "low", ["friaResidualSeverity"]));
		if (inh && res && ORDER.indexOf(res) > ORDER.indexOf(inh)) f.push(aipF("Residual above inherent", "The residual rating is higher than the inherent one. Check both ratings.", "medium", ["friaResidualSeverity", "friaInherentSeverity"]));
		if (res === "High" || res === "Very High") f.push(aipF("High residual risk to people", "Do not deploy until further measures bring the risk down, or the decision to accept it is taken and recorded at the right level.", "high", ["friaResidualSeverity", "friaResidualLikelihood"]));
		if (inh && inh !== "Low" && !d.mitigationMeasures) f.push(aipF("No measures recorded", "The inherent risk is " + inh.toLowerCase() + " and no measure is recorded against it.", "medium", ["mitigationMeasures"]));
		if (tier.full) {
			if (!(d.rightsAtRisk || []).length) f.push(aipF("No rights identified", "Record which fundamental rights the system could interfere with, even where the risk is low.", "medium", ["rightsAtRisk"]));
			if (d.providerInfoReviewed === "No" || d.providerInfoReviewed === "Partially") f.push(aipF("Provider information not fully reviewed", "Read the provider's instructions, documentation or model card for known limitations, accuracy and foreseeable misuse before rating the risk.", "medium", ["providerInfoReviewed"]));
			if (!d.materialiseMeasures) f.push(aipF("No plan for when a risk materialises", "Say who is told, how affected people are contacted, and how decisions are corrected.", "medium", ["materialiseMeasures"]));
			if (!d.aipSocietalImpact) f.push(aipF("Effects beyond individuals not considered", "ISO/IEC 42005 asks for effects on groups, society and the environment as well as on individuals.", "low", ["aipSocietalImpact"]));
		}
		if (d.complaintMechanism === "No") f.push(aipF("No way to complain or contest", "Give affected people a way to contest an outcome.", sig ? "high" : "medium", ["complaintMechanism"]));
		if (d.explanationProcess === "No") f.push(aipF("No way to explain decisions", "Be able to tell an affected person what role the system played in a decision about them and the main elements of that decision.", "medium", ["explanationProcess"]));
		// Governance
		if (!d.aipSystemOwner) f.push(aipF("No system owner", "Name the person or role accountable for the system across its life.", "medium", ["aipSystemOwner"]));
		if (!d.aipApprover) f.push(aipF("No approver named", tier.index === 3 ? "At impact level IV the decision belongs at the most senior level that owns the risk (NIST AI RMF GOVERN 2.3)." : "Name who takes the decision to deploy.", tier.index === 3 ? "high" : "medium", ["aipApprover"]));
		if (d.aipDecision === AIP_DECISIONS[2]) f.push(aipF("Decision: reject", "The assessment ends in a decision not to deploy. Record the reasons and what would have to change.", "high", ["aipDecision"]));
		else if (d.aipDecision === AIP_DECISIONS[3] || !d.aipDecision) f.push(aipF("No decision recorded", "Record the decision: approve, approve with conditions, or reject.", "low", ["aipDecision"]));
		else if (d.aipDecision === AIP_DECISIONS[1] && !d.aipConditions) f.push(aipF("Conditions not recorded", "An approval with conditions needs the conditions, each with an owner and a date.", "medium", ["aipConditions", "aipDecision"]));
		if (!(d.aipReassessTriggers || []).length) f.push(aipF("No reassessment triggers", "Name the events that bring the assessment back before the review date: a new model, a new purpose, a new data source, an incident.", "low", ["aipReassessTriggers"]));
		if (d.suspensionProcess === "No") f.push(aipF("No route to suspend and report", "Decide who can stop the system, and how the provider and any authority are told, before it is needed.", "medium", ["suspensionProcess"]));
		else if (d.suspensionProcess === "Partially") f.push(aipF("Suspension and reporting route incomplete", "Complete the route to stop the system and report a risk or a serious incident.", "low", ["suspensionProcess"]));
		if (tier.full && !d.aipEvidence) f.push(aipF("No evidence referenced", "List the test reports, model cards, contracts and earlier assessments the answers rest on.", "low", ["aipEvidence"]));
		return f;
	}

	/* ---------------- EU AI Act module result ----------------
	 * Classification and the obligations for each role held, each linked to its
	 * crosswalk row and its AI Act Digest article. Closes the gap aiResult()
	 * states: Article 50 and the general-purpose AI model duties are screened. */

	var AIP_HR_III = "2 December 2027 (Annex III)";
	var AIP_HR_I = "2 August 2028 (Annex I)";
	function aipStatus(v) {
		if (v === "Yes") return "In place";
		if (v === "Partially") return "Partly";
		if (v === "No") return "Gap";
		return "Not assessed";
	}

	function aiActResult(a) {
		var ob = [], f = [];
		function add(title, role, applies, art, row, status) { ob.push({ title: title, role: role, applies: applies, art: art, row: row || null, status: status || "Applies" }); }
		var roles = a.aiaRole || [];
		if (!roles.length) f.push(aipF("Role not set", "Pick the role or roles you hold for this system; the obligations depend on it.", "medium", ["aiaRole"]));

		// Article 4 applies to every provider and deployer.
		add("AI literacy: support it among staff and others who operate the system on your behalf", "Provider and deployer", "2 February 2025", "art-4", "r01", aipStatus(a.gaiUserGuidance));

		if (a.prohibitedUse === "Yes") {
			add("Prohibited practice: do not place on the market, put into service or use", "Everyone", "2 February 2025 (points (ba) and (bb) from 2 December 2026)", "art-5", "r02", "Gap");
			f.push(aipF("Prohibited practice", "The use appears to fall under Article 5. Stop development or use and escalate to legal. The rest of the AI Act module is not shown.", "high", ["prohibitedUse"]));
			return { classification: "Prohibited", obligations: ob, findings: f };
		}
		add("Screen the use against the prohibited practices", "Everyone", "2 February 2025 (points (ba) and (bb) from 2 December 2026)", "art-5", "r02", a.prohibitedUse === "No" ? "In place" : "Not assessed");
		var unresolved = false;
		if (a.prohibitedUse === "Unsure") { unresolved = true; f.push(aipF("Prohibited-use status unclear", "Confirm with legal whether the use falls under Article 5 before going further. Until then the classification is unresolved.", "high", ["prohibitedUse"])); }

		var iii = aipIsAnnexIII(a), hrIII = aipHighRiskIII(a), hrI = a.highRiskAnnexI === "Yes";
		if (a.annexIIIArea === "Not sure") { unresolved = true; f.push(aipF("Annex III status unclear", "Confirm whether the intended purpose falls under an Annex III use; the high-risk obligations depend on it.", "medium", ["annexIIIArea"])); }
		if (a.highRiskAnnexI === "Unsure") { unresolved = true; f.push(aipF("Annex I status unclear", "Confirm whether the product falls under Annex I legislation that requires third-party conformity assessment.", "medium", ["highRiskAnnexI"])); }
		if (iii && a.aiaArt63 === "Not sure") { unresolved = true; f.push(aipF("Article 6(3) not settled", "Decide whether one of the four conditions applies and document it, or treat the system as high-risk.", "medium", ["aiaArt63"])); }
		if (iii && aipArt63Claimed(a) && a.aiaProfiling === "Yes") f.push(aipF("Article 6(3) not available: the system profiles people", "An Annex III system that profiles natural persons is always high-risk, whatever condition of Article 6(3) applies.", "high", ["aiaProfiling", "aiaArt63"]));
		if (aipArt63Exempt(a) && aipProviderRole(a)) {
			add("Document the Article 6(3) assessment before placing on the market and register under Article 49(2)", "Provider", AIP_HR_III, "art-6", "r03", a.aiaArt63Documented === "Yes" ? "In place" : (a.aiaArt63Documented === "No" ? "Gap" : "Not assessed"));
			if (a.aiaArt63Documented === "No") f.push(aipF("Article 6(3) reliance not documented", "A provider relying on Article 6(3) documents the assessment before placing the system on the market and registers it (Articles 6(4) and 49(2)).", "medium", ["aiaArt63Documented"]));
		}

		var classification = hrIII && hrI ? "High-risk (Annex I and III)" : (hrIII ? "High-risk (Annex III)" : (hrI ? "High-risk (Annex I)" : "Not high-risk"));
		if (unresolved && classification === "Not high-risk") classification = "Unresolved";
		var hrDate = hrIII && !hrI ? AIP_HR_III : (hrI && !hrIII ? AIP_HR_I : AIP_HR_III + "; " + AIP_HR_I);

		if (hrIII || hrI) {
			if (aipProviderRole(a)) {
				add("Classify against both high-risk routes and record it", "Provider", hrDate, "art-6", "r03");
				add("Risk management system across the lifecycle", "Provider", hrDate, "art-9", "r05");
				add("Data and data governance for training, validation and testing", "Provider", hrDate, "art-10", "r06");
				add("Annex IV technical documentation, kept for ten years", "Provider", hrDate, "art-11", "r07");
				add("Automatic event logging, logs kept at least six months", "Provider", hrDate, "art-12", "r08");
				add("Transparency and instructions for use for deployers", "Provider", hrDate, "art-13", "r09");
				add("Human oversight designed in", "Provider", hrDate, "art-14", "r10", aipStatus(a.oversightAssigned === "Yes" && a.oversightCompetence === "Yes" ? "Yes" : (a.oversightAssigned ? (a.oversightAssigned === "No" ? "No" : "Partially") : "")));
				add("Accuracy, robustness and cybersecurity", "Provider", hrDate, "art-15", "r11");
				add("Quality management system", "Provider", hrDate, "art-17", "r12");
				add("Conformity assessment, EU declaration, CE marking, registration", "Provider", hrDate, "art-43", "r13");
				add("Post-market monitoring", "Provider", hrDate, "art-72", "r14");
				add("Corrective action and serious incident reporting", "Provider", hrDate, "art-73", "r15");
				add("Name and contact on the system, accessibility", "Provider", hrDate, "art-16", "r27");
			}
			if (aipDeployer(a)) {
				add("Use according to the instructions for use, with assigned human oversight", "Deployer", hrDate, "art-26", "r16", aipStatus(a.oversightAssigned === "Yes" ? (a.oversightCompetence === "Yes" ? "Yes" : "Partially") : a.oversightAssigned));
				add("Input data relevant and representative, where you control it", "Deployer", hrDate, "art-26", "r17");
				add("Monitor, report risks and serious incidents, suspend use; keep logs six months", "Deployer", hrDate, "art-26", "r18", aipStatus(a.suspensionProcess));
				add("Inform workers' representatives before use at work, and inform people subject to decisions", "Deployer", hrDate, "art-26", "r19", aipStatus(a.affectedAware === "Planned" ? "Partially" : a.affectedAware));
				if (a.deployerType === "Body governed by public law") add("Register the use in the EU database", "Deployer (public authority)", hrDate, "art-49", "r20");
				if (hrIII) {
					var fa = friaApplicability(a);
					if (fa.status === "Required" || fa.status === "Check") add("Fundamental rights impact assessment before first use" + (fa.status === "Check" ? " (check applicability)" : ""), "Deployer", AIP_HR_III, "art-27", "r21", "Not assessed");
					if (aipDecides(a)) add("Explain the role of the system in individual decisions on request", "Deployer", AIP_HR_III, "art-86", "r22", aipStatus(a.explanationProcess === "Planned" ? "Partially" : a.explanationProcess));
				}
				if (a.affectedAware === "No") f.push(aipF("People are not told", "Deployers of Annex III systems that make or assist decisions about people must tell them they are subject to the system (Article 26(11)).", "medium", ["affectedAware"]));
			}
			if (aipHasRole(a, 2)) add("Importer: verify conformity assessment, documentation and marking before placing on the market", "Importer", hrDate, "art-23", null);
			if (aipHasRole(a, 3)) add("Distributor: verify marking, declaration and instructions before making available", "Distributor", hrDate, "art-24", null);
			if (aipDeployer(a) || aipHasRole(a, 2) || aipHasRole(a, 3)) add("Know when you become the provider (name, substantial modification, change of purpose)", "Deployer, importer, distributor", hrDate, "art-25", "r04");
		}
		if (aipDeployer(a) && a.intendedPurposeAligned === "No") f.push(aipF("Use outside the intended purpose", "Using a system outside the intended purpose in the provider's instructions can make you its provider under Article 25(1), with the full provider obligations if it is or becomes high-risk.", "high", ["intendedPurposeAligned"]));
		else if (aipDeployer(a) && (a.intendedPurposeAligned === "Partially" || a.intendedPurposeAligned === "Not sure")) f.push(aipF("Intended purpose not confirmed", "Check the use against the provider's instructions for use.", "medium", ["intendedPurposeAligned"]));

		// Article 50
		var tStatus = aipStatus(a.aiaTransparencyDone);
		var tAny = false;
		if (aipProviderRole(a) && aipInteracts(a)) { tAny = true; add("Tell people they are interacting with an AI system, unless obvious", "Provider", "2 August 2026", "art-50", "r23", tStatus); }
		if (aipProviderRole(a) && a.aipGenerates === "Yes") { tAny = true; add("Mark synthetic audio, image, video or text in a machine-readable way", "Provider", "2 August 2026; generators on the market before then by 2 December 2026", "art-50", "r23", tStatus); }
		if (aipDeployer(a) && a.aiaEmotion === "Yes") { tAny = true; add("Inform people exposed to emotion recognition or biometric categorisation", "Deployer", "2 August 2026", "art-50", "r24", tStatus); }
		if (aipDeployer(a) && (a.aiaDeepfake === AIA_DEEPFAKE[1] || a.aiaDeepfake === AIA_DEEPFAKE[3])) { tAny = true; add("Disclose deep fakes", "Deployer", "2 August 2026", "art-50", "r24", tStatus); }
		if (aipDeployer(a) && (a.aiaDeepfake === AIA_DEEPFAKE[2] || a.aiaDeepfake === AIA_DEEPFAKE[3])) { tAny = true; add("Disclose AI-generated text published on matters of public interest, unless under editorial responsibility", "Deployer", "2 August 2026", "art-50", "r24", tStatus); }
		if (tAny && a.aiaTransparencyDone === "No") f.push(aipF("Transparency duties not met", "The Article 50 duties that apply to your role are not in place. They apply from 2 August 2026.", "medium", ["aiaTransparencyDone"]));
		else if (tAny && a.aiaTransparencyDone === "Partially") f.push(aipF("Transparency duties partly met", "Complete the Article 50 measures that apply to your role.", "low", ["aiaTransparencyDone"]));

		// General-purpose AI models
		if (aipGpai(a)) {
			var gpDate = "2 August 2025; models on the market before then by 2 August 2027";
			var exempt = aipOpenSource(a) && !aipSystemic(a);
			if (aipSystemic(a)) add("Notify the Commission within two weeks of meeting the systemic risk threshold", "GPAI model provider", "2 August 2025", "art-52", "r28");
			if (a.aiaGpaiSystemic === "Not sure") f.push(aipF("Systemic risk status unclear", "Track cumulative training compute against the 10^25 FLOP presumption and check for a Commission designation.", "medium", ["aiaGpaiSystemic"]));
			if (!exempt) add("Technical documentation (Annex XI) and information for downstream providers (Annex XII)", "GPAI model provider", gpDate, "art-53", "r25", aipStatus(a.aiaGpaiDocs));
			add("Copyright policy, including rights reservations", "GPAI model provider", gpDate, "art-53", "r25", aipStatus(a.aiaGpaiCopyright));
			add("Public summary of training content on the AI Office template", "GPAI model provider", gpDate, "art-53", "r25", aipStatus(a.aiaGpaiSummary));
			if (a.aiaGpaiOutsideEu === "Yes" && !exempt) add("Authorised representative in the Union", "GPAI model provider", gpDate, "art-54", "r25", a.aiaGpaiRep === "Yes" ? "In place" : (a.aiaGpaiRep === "No" ? "Gap" : "Not assessed"));
			if (aipSystemic(a)) {
				add("Model evaluation including adversarial testing; assess and mitigate systemic risks", "GPAI model provider", gpDate, "art-55", "r26", aipStatus(a.aiaGpaiEval));
				add("Track and report serious incidents to the AI Office", "GPAI model provider", gpDate, "art-55", "r26", aipStatus(a.aiaGpaiIncidents));
				add("Cybersecurity for the model and its infrastructure", "GPAI model provider", gpDate, "art-55", "r26", aipStatus(a.aiaGpaiCyber));
			}
			[["aiaGpaiDocs", "Model documentation incomplete", "Keep the Annex XI documentation and give downstream providers the Annex XII information."],
			 ["aiaGpaiCopyright", "Copyright policy missing or partial", "Adopt a policy to comply with EU copyright law, including machine-readable rights reservations."],
			 ["aiaGpaiSummary", "Training content summary missing or partial", "Publish the summary of training content on the AI Office template."],
			 ["aiaGpaiEval", "Systemic risk evaluation missing or partial", "Evaluate the model with standardised protocols, including adversarial testing, and mitigate systemic risks."],
			 ["aiaGpaiIncidents", "Serious incident reporting missing or partial", "Track, document and report serious incidents to the AI Office without undue delay."],
			 ["aiaGpaiCyber", "Model cybersecurity missing or partial", "Protect the model and its physical infrastructure adequately."]].forEach(function (g) {
				if (g[0] === "aiaGpaiDocs" && exempt) return;
				if (/Eval|Incidents|Cyber/.test(g[0]) && !aipSystemic(a)) return;
				if (a[g[0]] === "No") f.push(aipF(g[1], g[2], "high", [g[0]]));
				else if (a[g[0]] === "Partially") f.push(aipF(g[1], g[2], "medium", [g[0]]));
			});
			if (a.aiaGpaiOutsideEu === "Yes" && !exempt && a.aiaGpaiRep === "No") f.push(aipF("No authorised representative in the Union", "A provider established outside the EU appoints one by written mandate before placing the model on the market (Article 54).", "high", ["aiaGpaiRep"]));
		}
		if (a.gaiUserGuidance === "No") f.push(aipF("AI literacy not supported", "Article 4 asks providers and deployers to take measures to support AI literacy among the people who operate the system for them.", "medium", ["gaiUserGuidance"]));
		return { classification: classification, obligations: ob, findings: f };
	}

