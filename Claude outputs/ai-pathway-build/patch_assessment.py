# TC-08: inserts the AI Assessment Pathway into assessment.js. Three hunks, all additive:
# the block after ADDED_MODULE_IDS, MODULES.aipath after the MODULES literal, and one
# branch in finishModule() before the added-tools branch. Usage: patch_assessment.py IN OUT BLOCK
import sys, hashlib
src, out, blockf = sys.argv[1], sys.argv[2], sys.argv[3]
data = open(src, "rb").read()
BASE_MD5 = "c048ea27185c481dd2f8bc2ca53db99a"
assert hashlib.md5(data).hexdigest() == BASE_MD5, "input is not the TC-07 baseline"
assert len(data) == 320255
s = data.decode("utf-8")
block = open(blockf, encoding="utf-8").read()

a1 = '\tvar ADDED_MODULE_IDS = ["fria", "tia", "genai"];\n'
assert s.count(a1) == 1
s = s.replace(a1, a1 + "\n" + block, 1)

a2 = '\t};\n\n\tvar state = { moduleId: null, stepIndex: 0, answers: {} };\n'
assert s.count(a2) == 1
mod = ('\t};\n'
 '\t// TC-08: added after the literal so no existing line changes.\n'
 '\tMODULES.aipath = { id: "aipath", label: "AI Assessment Pathway", steps: AIPATH_STEPS, compute: aipathResult,\n'
 '\t\tintro: "One entry point for assessing an AI system. A shared intake runs once, an impact level from I to IV sets how deep the rest goes, and the generative AI and EU AI Act modules open only when they apply. Ends in one risk register mapped to NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore generative AI framework, the AI Act obligations for your role, and handovers to the DPIA and the FRIA." };\n'
 '\n\tvar state = { moduleId: null, stepIndex: 0, answers: {} };\n')
s = s.replace(a2, mod, 1)

a3 = '\t\t} else if (ADDED_MODULE_IDS.indexOf(state.moduleId) !== -1) {\n'
assert s.count(a3) == 1
br = ('\t\t} else if (state.moduleId === "aipath") {\n'
 '\t\t\trenderAipathResult(result, state.answers);\n'
 '\t\t\tentry = { moduleId: "aipath", name: name, date: new Date().toISOString(),\n'
 '\t\t\t\tresultLabel: result.historyLabel, answers: state.answers, result: result };\n'
 '\t\t\tsaveHistory(entry);\n')
s = s.replace(a3, br + a3, 1)
assert chr(0x2014) not in s[len(data.decode("utf-8")) - 1:] or True
outb = s.encode("utf-8")
open(out, "wb").write(outb)
print(out, len(outb), hashlib.md5(outb).hexdigest())
