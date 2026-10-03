// Data for the AI Assessment Pathway study guide and the study pack chapter, read from the
// shipped assessment.js (never retyped). Writes guide_data.json and aipath_tier.json.
// Usage: SRC=<assessment.js> OUT_DIR=<dir> PACK_DIR=<study-pack-build dir> node guide_data.js
const fs = require("fs"), path = require("path");
const SRC = process.env.SRC || "../../pages/privacy-ai-assessment/assessment.js";
const T = require("./harness.js")(SRC, null);
const extra = ["AIP_SCALES", "AIP_AUTONOMY", "AIP_OVERSIGHT_MODES", "AIP_USERS", "GAI_PROMPT_DATA", "SG_DIMENSIONS", "AIPATH_NIST_TEXT", "AIPATH_ISO_TITLES", "NIST_GAI_RISKS", "OWASP_LLM", "AIPATH_TIER_BANDS", "AIPATH_LEVEL_TEXT", "AIP_GENAI_DEPTH"];
// second harness pass for extra names
const lines = fs.readFileSync(SRC, "utf8").split("\n");
const cut = lines.findIndex((l) => l.includes('var root = document.getElementById("paa-app")'));
const tmp = "/tmp/aipath_guide_" + process.pid + ".js";
fs.writeFileSync(tmp, lines.slice(0, cut).join("\n") + "\nglobalThis.__G = {};\n" + extra.map((n) => `globalThis.__G.${n} = ${n};`).join("\n") + "\n})();\n");
require(tmp); const G = globalThis.__G;

const qById = {};
T.AIPATH_STEPS.forEach((s) => s.questions.forEach((q) => { qById[q.id] = q; }));
// Tier: points for each answer of each factor.
const tier = T.AIPATH_TIER_FACTORS.map((f) => {
  const q = qById[f.q];
  let opts = q.options.map((o) => [o, q.type === "multiselect" ? [o] : o]);
  if (f.q === "friaVulnerable") opts = [["none (left blank)", []]].concat(opts);
  return { key: f.key, label: f.label, q: f.q, max: f.max, points: opts.map(([lab, v]) => [lab, f.points({ [f.q]: v })]) };
});
// Steps and questions as shipped.
const steps = T.AIPATH_STEPS.map((s) => ({
  key: s.key, group: s.group, title: s.title, intro: s.intro || "", conditional: !!s.visibleIf,
  questions: s.questions.map((q) => ({ id: q.id, type: q.type, label: typeof q.label === "string" ? q.label : "(label depends on the answer)",
    options: q.options || null, conditional: !!q.visibleIf,
    note: q.note ? (typeof q.note.label === "string" ? q.note.label : "a follow-up note, worded according to the answer") : null,
    map: T.AIPATH_FRAMEWORK_MAP[q.id] || null }))
}));
// Scenarios.
const S = require("./scenarios_full.js")(T);
const scen = S.map((s) => {
  const a = s.full, r = T.aipathResult(a);
  const shown = [];
  T.AIPATH_STEPS.forEach((st) => { if (st.visibleIf && !st.visibleIf(a)) return; st.questions.forEach((q) => { if (!q.visibleIf || q.visibleIf(a)) shown.push(q.id); }); });
  return { id: s.id, name: s.name, intake: s.a, answers: a, shown: shown.length, tier: r.tier, overall: r.overall, classification: r.classification, modules: r.modules,
    obligations: r.obligations, findings: r.findings.map((f) => ({ severity: f.severity, tag: f.tag, also: f.also, title: f.title, qs: f.qs })),
    handovers: r.handovers, coverage: { nist: r.coverage.nistCount, iso: r.coverage.isoCount, sg: r.coverage.sgCount }, gaiTables: r.gaiTables.length };
});
const out = { source: path.basename(SRC), tier, bands: G.AIPATH_TIER_BANDS, levelText: G.AIPATH_LEVEL_TEXT, steps, map: T.AIPATH_FRAMEWORK_MAP,
  nistText: G.AIPATH_NIST_TEXT, isoTitles: G.AIPATH_ISO_TITLES, sg: G.SG_DIMENSIONS, nistGai: G.NIST_GAI_RISKS, owasp: G.OWASP_LLM,
  gaiChecks: T.GAI_CHECKS.map((c) => ({ q: c.q, title: c.title, gaps: c.gaps, nist: c.nist, owasp: c.owasp })), scenarios: scen };
const dir = process.env.OUT_DIR || ".";
fs.writeFileSync(path.join(dir, "guide_data.json"), JSON.stringify(out, null, 1));
if (process.env.PACK_DIR) fs.writeFileSync(path.join(process.env.PACK_DIR, "aipath_tier.json"), JSON.stringify(tier, null, 1));
console.log("guide_data.json:", steps.length, "steps,", Object.keys(qById).length, "questions,", scen.length, "scenarios");
tier.forEach((f) => console.log(" ", f.label, JSON.stringify(f.points.map((p) => p[1]))));
