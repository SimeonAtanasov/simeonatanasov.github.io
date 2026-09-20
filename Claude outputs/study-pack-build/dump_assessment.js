// Truncate assessment.js before its DOM access, then dump the data structures.
const fs = require("fs");
const SRC = "/home/claude/fix/assessment.js";
const lines = fs.readFileSync(SRC, "utf8").split("\n");

let cut = lines.findIndex((l) => l.includes('var root = document.getElementById("paa-app")'));
if (cut < 0) throw new Error("cut point not found");

const names = [
  "LEVELS", "ART6_BASES", "ART9_CONDITIONS", "DPIA_TRIGGERS", "DPIA_CONTROLS",
  "TRANSFER_SAFEGUARDS", "TIA_TRIGGERS", "NO_TIA_MECHANISMS", "DATA_SUBJECT_TYPES",
  "DATA_CATEGORIES", "VULNERABLE_TYPES", "PROCESSING_PURPOSES", "MARKETING_TECH",
  "ADVERTISING_BIAS", "COUNTRIES_REGIONS", "PRIVACY_STEPS", "GENAI_TYPES", "AI_STEPS",
  "DPC_SIMPLE", "DPC_BEHAVIOURAL", "DPC_FINANCIAL", "DPC_SENSITIVE",
  "EI_NAME", "EI_ID", "EI_CONTACT", "EI_EMAIL", "EI_PICTURE", "EI_CODE",
  "CB_CONFIDENTIALITY", "CB_INTEGRITY", "CB_AVAILABILITY",
  "DPC_AGGRAVATING", "DPC_MITIGATING", "LIKELY_IMPACTS", "EDPB_CASES", "EDPB_OUTCOME_TEXT",
  "AEPD_VOLUME", "IMPACT_OPTIONS", "AEPD_IMPACT", "AEPD_SENSITIVE_CATEGORIES",
  "INCIDENT_STEPS", "RISK_SOURCES", "THREATS", "SEVERITY_SCALE", "LIKELIHOOD_SCALE",
  "HARMS_TO_INDIVIDUALS", "HARM_MEASURE_CHECKS", "DPIA_STEPS", "RISK_LEVELS", "RISK_MATRIX",
  "LIA_SAFEGUARDS", "LIA_STEPS", "COMPLIANCE_OPTIONS", "COMPLIANCE_SCORE",
  "TPSA_DOMAINS", "TPSA_AI_DOMAINS", "TPSA_ALL_DOMAINS", "TPSA_ENGAGEMENT_TYPES",
  "TPSA_DATA_TYPES", "TPSA_USER_COUNTS", "TPSA_INTAKE_STEPS", "TPSA_STEPS",
  "TPSA_INHERENT_USER_SCORE", "TPSA_INHERENT_MAX", "TPSA_MATURITY_TIERS",
  "TPSA_RESIDUAL_MATRIX", "MODULES",
];

const head = lines.slice(0, cut).join("\n");
const dump =
  "\n globalThis.__DUMP = {};\n" +
  names.map((n) => `try { globalThis.__DUMP[${JSON.stringify(n)}] = ${n}; } catch(e) {}`).join("\n") +
  "\n})();\n";

const code = head + dump;
fs.writeFileSync("/tmp/harness.js", code);
require("/tmp/harness.js");

const D = globalThis.__DUMP;
// MODULES holds step arrays + compute functions; keep only labels/intros/step keys.
const mods = {};
for (const k of Object.keys(D.MODULES || {})) {
  const m = D.MODULES[k];
  mods[k] = { id: m.id, label: m.label, intro: m.intro, stepCount: (m.steps || []).length };
}
D.MODULES = mods;

function clone(v, ancestors) {
  if (typeof v === "function") return { __fn: v.toString().replace(/\s+/g, " ").slice(0, 400) };
  if (v === null || typeof v !== "object") return v;
  if (ancestors.indexOf(v) !== -1) return "[circular]";
  const a = ancestors.concat([v]);
  if (Array.isArray(v)) return v.map((x) => clone(x, a));
  const o = {};
  for (const k of Object.keys(v)) o[k] = clone(v[k], a);
  return o;
}
const out = JSON.stringify(clone(D, []), null, 1);
fs.writeFileSync("/home/claude/pack/src/assessment.json", out);
console.log("wrote", out.length, "bytes");
for (const k of Object.keys(mods)) console.log(k, mods[k].label, mods[k].stepCount, "steps");
