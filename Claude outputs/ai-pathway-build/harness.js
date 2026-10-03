// Loads assessment.js up to its DOM access, appends a block (or the patched file
// as is), and exposes the pathway functions for headless tests.
const fs = require("fs");
module.exports = function load(src, block) {
  const lines = fs.readFileSync(src, "utf8").split("\n");
  const cut = lines.findIndex((l) => l.includes('var root = document.getElementById("paa-app")'));
  let head = lines.slice(0, cut).join("\n");
  if (block) head += "\n" + fs.readFileSync(block, "utf8");
  const names = ["aipathTier", "aipathCoverage", "AIPATH_FRAMEWORK_MAP", "AIPATH_TIER_FACTORS", "AIP_DECISION_EFFECTS", "AIP_REVERSIBILITY",
    "AIPATH_STEPS", "aipathResult", "aiActResult", "aipathDerive", "aipathAsked", "aipathSeedFria", "aipathSeedDpia", "aiResult", "gaiResult",
    "friaApplicability", "MODULES", "GAI_CHECKS", "FRIA_ANNEX_III", "GAI_PATTERNS", "AI_STEPS", "GAI_STEPS", "FRIA_STEPS", "DPIA_STEPS"];
  const code = head + "\nglobalThis.__T = {};\n" + names.map((n) => `try { globalThis.__T.${n} = ${n}; } catch (e) {}`).join("\n") + "\n})();\n";
  const tmp = "/tmp/aipath_harness_" + process.pid + ".js";
  fs.writeFileSync(tmp, code);
  delete require.cache[tmp];
  require(tmp);
  return globalThis.__T;
};
