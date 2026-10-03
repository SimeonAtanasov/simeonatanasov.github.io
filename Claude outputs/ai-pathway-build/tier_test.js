const T = require("./harness.js")(process.env.SRC || "../../pages/privacy-ai-assessment/assessment.js", "aipath_block.js");
const S = require("./scenarios.js")(T);
const rows = [];
for (const s of S) {
  const t = T.aipathTier(s.a);
  rows.push({ s, t });
  console.log(`${s.id.padEnd(18)} raw ${String(t.raw).padStart(2)}/${t.max} = ${String(t.pct).padStart(3)}%  scored ${t.scoredLevel.padEnd(3)} final ${t.level.padEnd(3)} expect ${s.expect}  floors: ${t.floors.join("; ") || "-"}  missing: ${t.missing.length}`);
  console.log("   " + t.parts.map((p) => `${p.key} ${p.points}/${p.max}`).join(", "));
}
module.exports = rows;
