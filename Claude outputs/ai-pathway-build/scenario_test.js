// Phase 8: the eight scenarios end to end on the patched file.
const T = require("./harness.js")(process.env.SRC || "../../pages/privacy-ai-assessment/assessment.js", null);
const S = require("./scenarios_full.js")(T);
let fail = 0;
function check(c, msg) { if (!c) { fail++; console.log("   FAIL: " + msg); } }
// 1. No question id defined twice in the pathway.
const ids = {};
T.AIPATH_STEPS.forEach((s) => s.questions.forEach((q) => { ids[q.id] = (ids[q.id] || 0) + 1; }));
const dup = Object.keys(ids).filter((k) => ids[k] > 1);
console.log("question ids:", Object.keys(ids).length, "duplicates:", dup.length ? dup : "none");
check(!dup.length, "duplicate ids");
// 2. Every pathway id is mapped (except name and dates) and every mapped id exists or is derived.
const unmapped = Object.keys(ids).filter((k) => !T.AIPATH_FRAMEWORK_MAP[k] && ["name", "firstUseDate"].indexOf(k) < 0);
console.log("unmapped:", unmapped.length ? unmapped : "none");
check(!unmapped.length, "unmapped ids");
const derived = ["gaiHumanReview", "gaiDisclosure"];
const stray = Object.keys(T.AIPATH_FRAMEWORK_MAP).filter((k) => !ids[k] && derived.indexOf(k) < 0);
check(!stray.length, "mapped ids not in steps: " + stray);
// 3. Blank answers: every coverage row not assessed.
const blank = T.aipathResult({});
const cv = blank.coverage;
check(cv.nistCount.gap + cv.nistCount.ok === 0 && cv.isoCount.gap + cv.isoCount.ok === 0, "blank answers produce coverage");
console.log("blank: tier", blank.tier.level, "provisional missing", blank.tier.missing.length, "findings", blank.findings.length);
const expect = {
  "classic-ml": { level: "I", mods: "Core,Impact,AI Act,Governance", cls: "Not high-risk", fria: null, dpia: false },
  "internal-genai": { level: "I", mods: "Core,Impact,GenAI,AI Act,Governance", cls: "Not high-risk", fria: null, dpia: true },
  "public-chatbot-eu": { level: "II", mods: "Core,Impact,GenAI,AI Act,Governance", cls: "Not high-risk", fria: null, dpia: true },
  "genai-hiring": { level: "III", mods: "Core,Impact,GenAI,AI Act,Governance", cls: "High-risk (Annex III)", fria: null, dpia: true },
  "public-body-fria": { level: "III", mods: "Core,Impact,AI Act,Governance", cls: "High-risk (Annex III)", fria: "Required", dpia: true },
  "gpai-provider": { level: "II", mods: "Core,Impact,GenAI,AI Act,Governance", cls: "Not high-risk", fria: null, dpia: true },
  "prohibited": { level: "III", mods: "Core,Impact,AI Act,Governance", cls: "Prohibited", fria: null, dpia: true },
  "no-eu": { level: "I", mods: "Core,Impact,GenAI,Governance", cls: "Not in scope (no EU nexus)", fria: null, dpia: false }
};
const out = [];
for (const s of S) {
  const a = s.full;
  const r = T.aipathResult(a);
  const asked = T.aipathAsked(a);
  // shown questions: visible steps x visible questions; count and check unique
  const shown = [];
  T.AIPATH_STEPS.forEach((st) => { if (st.visibleIf && !st.visibleIf(a)) return; st.questions.forEach((q) => { if (!q.visibleIf || q.visibleIf(a)) shown.push(q.id); }); });
  const e = expect[s.id];
  console.log(`\n${s.id}: level ${r.tier.level} (${r.tier.pct}%), shown ${shown.length} questions, modules ${r.modules.join(",")}, AI Act ${r.classification}, obligations ${r.obligations.length}, findings ${r.findings.length} (worst ${r.overall}), FRIA ${r.handovers.fria}, DPIA ${r.handovers.dpia}`);
  check(new Set(shown).size === shown.length, "a question shown twice");
  check(r.tier.level === e.level, "tier " + r.tier.level + " != " + e.level);
  check(r.modules.join(",") === e.mods, "modules " + r.modules.join(","));
  check(r.classification === e.cls, "classification " + r.classification);
  check(r.handovers.fria === e.fria, "fria " + r.handovers.fria);
  check(r.handovers.dpia === e.dpia, "dpia " + r.handovers.dpia);
  // coverage: any row Addressed or Gap must rest on an asked and answered question
  const answeredAsked = Object.keys(T.AIPATH_FRAMEWORK_MAP).filter((q) => asked[q]);
  check(r.coverage.nist.every((row) => row[2] === "Not assessed" || answeredAsked.some((q) => T.AIPATH_FRAMEWORK_MAP[q][0].indexOf(row[0]) >= 0)), "nist row assessed without a question");
  r.obligations.forEach((o) => console.log(`   ob: ${o.title} [${o.role}] ${o.applies} -> ${o.status}`));
  r.findings.forEach((f) => console.log(`   ${f.severity.padEnd(6)} [${f.tag}${f.also.length ? ", also " + f.also.join(", ") : ""}] ${f.title} (${f.qs.join(",")})`));
  console.log(`   coverage NIST ${JSON.stringify(r.coverage.nistCount)} ISO ${JSON.stringify(r.coverage.isoCount)} SG ${JSON.stringify(r.coverage.sgCount)}; 600-1 tables ${r.gaiTables.length}`);
  out.push({ id: s.id, name: s.name, level: r.tier.level, pct: r.tier.pct, shown: shown.length, modules: r.modules, cls: r.classification, obligations: r.obligations, findings: r.findings.map((f) => ({ sev: f.severity, tag: f.tag, also: f.also, title: f.title })), fria: r.handovers.fria, dpia: r.handovers.dpia, answers: a });
  if (r.handovers.fria) { const fs = T.aipathSeedFria(a); console.log("   FRIA seed keys:", Object.keys(fs).length, Object.keys(fs).join(",")); }
  if (r.handovers.dpia) { const ds = T.aipathSeedDpia(a); console.log("   DPIA seed triggers:", ds.dpiaTriggers.length, ds.dpiaTriggers.map((x) => x.slice(0, 20)).join(" / ")); }
}
require("fs").writeFileSync("scenario_results.json", JSON.stringify(out, null, 1));
console.log("\n" + (fail ? fail + " FAILURES" : "ALL CHECKS PASS"));
process.exit(fail ? 1 : 0);
