// Full answers for the eight scenarios: intake from scenarios.js plus the later steps.
module.exports = function (T) {
  const S = require("./scenarios.js")(T);
  const common = {
    name: "", description: "Scenario system", lifecycle: "Production", provider: "Vendor X, v2", firstUseDate: "2027-01-15",
    affectedCategories: ["Consumers or customers"],
    oversightAssigned: "Yes", oversightCompetence: "Yes", automationBias: "Partially", gaiUserGuidance: "Partially",
    biasEvaluated: "Planned", loggingInPlace: "Yes", thirdPartyData: "No", gaiProviderUse: "No, contractually excluded",
    broadDataAccess: "No", multiAgent: "No", businessCriticalData: "No", competitorExposure: "No",
    harmsDescription: "Wrong output relied on.", friaInherentSeverity: T.FRIA_STEPS[3].questions[4].options[1], friaInherentLikelihood: T.FRIA_STEPS[3].questions[5].options[2],
    mitigationMeasures: "Review and thresholds.", friaResidualSeverity: T.FRIA_STEPS[3].questions[4].options[1], friaResidualLikelihood: T.FRIA_STEPS[3].questions[5].options[1],
    rightsAtRisk: ["Protection of personal data (Art. 8)"], aipSocietalImpact: "None identified.", providerInfoReviewed: "Yes", materialiseMeasures: "Incident process.",
    complaintMechanism: "Yes", explanationProcess: "Planned",
    aipSystemOwner: "Product owner", aipAssessor: "Risk lead", aipApprover: "Head of unit", aipDecision: "Approve with conditions", aipConditions: "Bias test by Q1",
    aipEvidence: "Test report 12", legalReview: "Yes", suspensionProcess: "Yes", aipReviewDate: "2027-06-30", aipReassessTriggers: ["A new model, or a new version of the model"]
  };
  const genai = {
    gaiModelSource: "Third-party model through an API", gaiUntrustedContent: "Yes", gaiInjectionTested: "Once", gaiSystemPromptSecrets: "No", gaiInputFiltering: "Partially",
    gaiOutputLeakCheck: "Partially", gaiRagPermissions: "Yes", gaiEmbeddingStore: "Yes", gaiIpCheck: "Outputs are not used externally", gaiOutputHandling: "No, it is validated or only shown as text",
    gaiGrounding: "Yes", gaiContentFilters: "Yes, provider defaults only", gaiDisclosure: "Yes", gaiProvenance: "Partially", gaiRateLimits: "Yes", gaiRedTeam: "Yes, internally",
    gaiThreatModel: "No", gaiBiasEval: "Partially", gaiMonitoring: "Yes", gaiEnergy: "No"
  };
  const extra = {
    "classic-ml": { aiaRole: ["Deployer"], prohibitedUse: "No", highRiskAnnexI: "No", aiaEmotion: "No", aiaInteracts: "No", affectedCategories: [] },
    "internal-genai": Object.assign({}, genai, { gaiPatterns: ["Internal assistant or chat", "Search or question answering over our own documents (RAG)"], aiaRole: ["Deployer"], prohibitedUse: "No", highRiskAnnexI: "No", aiaEmotion: "No", aiaDeepfake: "No", aiaTransparencyDone: "Yes", affectedCategories: ["Job applicants or employees"] }),
    "public-chatbot-eu": Object.assign({}, genai, { gaiPatterns: ["Customer-facing chat or assistant"], aiaRole: ["Provider of the AI system", "Deployer"], prohibitedUse: "No", highRiskAnnexI: "No", aiaEmotion: "No", aiaDeepfake: "No", aiaTransparencyDone: "Partially", gaiRedTeam: "No" }),
    "genai-hiring": Object.assign({}, genai, { gaiPatterns: ["Content generation (text, images, audio, video)"], aiaRole: ["Deployer"], deployerType: "Other private entity", intendedPurposeAligned: "Yes", prohibitedUse: "No", highRiskAnnexI: "No", aiaArt63: "No, none of them applies", affectedAware: "Planned", aiaEmotion: "No", aiaInteracts: "No", aiaDeepfake: "No", aiaTransparencyDone: "Yes", affectedCategories: ["Job applicants or employees"], biasEvaluated: "No" }),
    "public-body-fria": { aiaRole: ["Deployer"], deployerType: "Body governed by public law", intendedPurposeAligned: "Yes", prohibitedUse: "No", highRiskAnnexI: "No", aiaArt63: "No, none of them applies", affectedAware: "Yes", aiaEmotion: "No", aiaInteracts: "No", affectedCategories: ["Applicants for or recipients of public benefits"], complaintMechanism: "Yes" },
    "gpai-provider": Object.assign({}, genai, { gaiPatterns: ["Content generation (text, images, audio, video)", "Code generation"], gaiModelSource: "Model we trained ourselves", gaiTrainingDataVetted: "Partially", aiaRole: ["Provider of a general-purpose AI model", "Provider of the AI system"], prohibitedUse: "No", highRiskAnnexI: "No", aiaGpaiSystemic: "Yes: cumulative training compute above 10^25 FLOP (presumed)", aiaGpaiOpenSource: "No", aiaGpaiOutsideEu: "Yes", aiaGpaiDocs: "Yes", aiaGpaiCopyright: "Partially", aiaGpaiSummary: "No", aiaGpaiRep: "Yes", aiaGpaiEval: "Yes", aiaGpaiIncidents: "Partially", aiaGpaiCyber: "Yes", aiaInteracts: "Yes", aiaEmotion: "No", aiaDeepfake: "No", aiaTransparencyDone: "Partially", affectedCategories: ["Consumers or customers"] }),
    "prohibited": { aiaRole: ["Deployer"], deployerType: "Other private entity", intendedPurposeAligned: "Yes", prohibitedUse: "Yes", affectedCategories: ["Job applicants or employees"] },
    "no-eu": Object.assign({}, genai, { gaiPatterns: ["Code generation"], affectedCategories: [] })
  };
  return S.map((s) => ({ ...s, full: Object.assign({}, common, extra[s.id], s.a, { name: s.name }) }));
};
