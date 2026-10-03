// The eight Phase 8 scenarios. Intake answers drive the tier; later phases add the rest.
module.exports = function (T) {
  const AREA = (p) => T.FRIA_ANNEX_III.find((x) => x.indexOf(p) === 0);
  const NOT = "Not an Annex III high-risk system";
  return [
    { id: "classic-ml", name: "Demand forecasting model (classic ML, internal)", expect: "I",
      a: { aipDecisionEffect: "No decisions about people", aipReversibility: "Not applicable: its output has no effect on people", affectedScale: "Fewer than 100",
        friaVulnerable: [], autonomyLevel: "Low-impact actions only", oversightMode: "On flagged or contested cases only", annexIIIArea: NOT,
        gaiUsers: "Staff only", gaiPromptData: ["Confidential business information"], aipEu: "Yes", aipGenerates: "No", aipFoundationModel: "No", aipFreePrompts: "No" } },
    { id: "internal-genai", name: "Internal assistant over company documents (RAG)", expect: "I or II",
      a: { aipDecisionEffect: "No decisions about people", aipReversibility: "Easily, and quickly", affectedScale: "100 to 10,000",
        friaVulnerable: [], autonomyLevel: "None - a human approves every action", oversightMode: "Before every decision takes effect", annexIIIArea: NOT,
        gaiUsers: "Staff only", gaiPromptData: ["Personal data", "Confidential business information"], aipEu: "Yes", aipGenerates: "Yes", aipFoundationModel: "Yes", aipFreePrompts: "Yes" } },
    { id: "public-chatbot-eu", name: "Customer service chatbot for the public, EU", expect: "II or III",
      a: { aipDecisionEffect: "Supports decisions with minor effects on people", aipReversibility: "With effort, or after some time", affectedScale: "More than 1 million",
        friaVulnerable: [], autonomyLevel: "Low-impact actions only", oversightMode: "No human review", annexIIIArea: NOT,
        gaiUsers: "The public", gaiPromptData: ["Personal data"], aipEu: "Yes", aipGenerates: "Yes", aipFoundationModel: "Yes", aipFreePrompts: "Yes" } },
    { id: "genai-hiring", name: "LLM screening of job applications", expect: "III",
      a: { aipDecisionEffect: "Supports decisions with legal or similarly significant effects on people", aipReversibility: "Not, or only with great difficulty", affectedScale: "10,000 to 1 million",
        friaVulnerable: [], autonomyLevel: "Low-impact actions only", oversightMode: "Before every decision takes effect", annexIIIArea: AREA("4."),
        gaiUsers: "Staff only", gaiPromptData: ["Personal data"], aipEu: "Yes", aipGenerates: "Yes", aipFoundationModel: "Yes", aipFreePrompts: "No" } },
    { id: "public-body-fria", name: "Benefit eligibility scoring by a public body", expect: "III or IV",
      a: { aipDecisionEffect: "Supports decisions with legal or similarly significant effects on people", aipReversibility: "With effort, or after some time", affectedScale: "More than 1 million",
        friaVulnerable: ["People in financial hardship", "Persons with disabilities"], autonomyLevel: "Low-impact actions only", oversightMode: "On flagged or contested cases only", annexIIIArea: AREA("5(a)"),
        gaiUsers: "Staff only", gaiPromptData: ["Personal data", "Special category data"], aipEu: "Yes", aipGenerates: "No", aipFoundationModel: "No", aipFreePrompts: "No" } },
    { id: "gpai-provider", name: "Provider of a general-purpose model offered by API", expect: "II",
      a: { aipDecisionEffect: "No decisions about people", aipReversibility: "Not applicable: its output has no effect on people", affectedScale: "More than 1 million",
        friaVulnerable: [], autonomyLevel: "None - a human approves every action", oversightMode: "After the fact, by sampling", annexIIIArea: NOT,
        gaiUsers: "The public", gaiPromptData: ["Personal data"], aipEu: "Yes", aipGenerates: "Yes", aipFoundationModel: "Yes", aipFreePrompts: "Yes" } },
    { id: "prohibited", name: "Emotion recognition of staff in the workplace", expect: "III or IV (module ends at Art. 5)",
      a: { aipDecisionEffect: "Supports decisions with legal or similarly significant effects on people", aipReversibility: "With effort, or after some time", affectedScale: "100 to 10,000",
        friaVulnerable: ["People in a dependent position (employees, detainees, asylum seekers)"], autonomyLevel: "Low-impact actions only", oversightMode: "After the fact, by sampling", annexIIIArea: AREA("1."),
        gaiUsers: "Staff only", gaiPromptData: ["Personal data", "Special category data"], aipEu: "Yes", aipGenerates: "No", aipFoundationModel: "No", aipFreePrompts: "No" } },
    { id: "no-eu", name: "Coding assistant used only outside the EU", expect: "I",
      a: { aipDecisionEffect: "No decisions about people", aipReversibility: "Not applicable: its output has no effect on people", affectedScale: "100 to 10,000",
        friaVulnerable: [], autonomyLevel: "None - a human approves every action", oversightMode: "Before every decision takes effect", annexIIIArea: NOT,
        gaiUsers: "Staff only", gaiPromptData: ["Source code or credentials"], aipEu: "No", aipGenerates: "Yes", aipFoundationModel: "Yes", aipFreePrompts: "Yes" } }
  ];
};
