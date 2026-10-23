"""Written questions for the entries added on 23 October 2026 and fixes to questions the
update made stale. Run after remap_questions.py. Refuses to run twice."""
import json, os
QW = os.path.join(os.path.dirname(__file__), "..", "assistant-build", "questions_written.json")
q = json.load(open(QW, encoding="utf-8"))
assert "aia-doc-59" not in q, "already applied"
def swap(k, old, new):
    assert q[k].count(old) == 1, (k, old); q[k][q[k].index(old)] = new
swap("ck-d118", "When would SB 690 take effect if the Governor signs it?", "When does SB 690 take effect?")
q["ck-d118"].append("Has California SB 690 been signed into law?")
swap("ck-d005", "Where does the Digital Omnibus proposal stand as of September 2026?", "Where does the Digital Omnibus proposal stand now?")
swap("aia-doc-50", "Will Ireland set up a National AI Office?", "What does the AI Office of Ireland do?")
q["aia-doc-50"].append("What is Ireland's Regulation of Artificial Intelligence Act 2026?")
q["aia-doc-52"].append("What role does the CNIL have under the AI Act in France?")
BCR = {"ed-d083": "Michelin Group", "ed-d084": "Snowflake Group", "ed-d085": "Snowflake Group", "ed-d086": "HCL Tech Group",
       "ed-d087": "HCL Tech Group", "ed-d088": "DSM Firmenich Group", "ed-d089": "TGS Group"}
ROLE = {"ed-d085": "processor", "ed-d087": "processor"}
for k, g in BCR.items():
    r = ROLE.get(k, "controller")
    q[k] = ["Has the EDPB given an opinion on the %s %s binding corporate rules?" % (g, r),
            "Who approves the %s binding corporate rules of %s?" % (r, g)]
NEW = {
    "ed-d066": ["What does the EDPB say about smart glasses?",
                "Does the household exemption cover recording people with smart glasses?",
                "Is consent obtained after recording a bystander valid?",
                "How should smart glasses signal to bystanders that they are recording?"],
    "ed-d408": ["What is the EDPB expert report The connected gaze about?",
                "How do bystanders feel about smart glasses recording them?"],
    "ck-d001": ["What does the Council's Digital Omnibus mandate say about cookies?",
                "Which cookies would be exempt from consent under the Council position?",
                "How long must a site wait before asking for cookie consent again under the Council mandate?",
                "Does the Council keep the browser consent signal from the Digital Omnibus?"],
    "aia-doc-59": ["Which harmonised standards are cited under the AI Act?",
                   "Does EN 18286 give a presumption of conformity for the quality management system?",
                   "What is Commission Implementing Decision (EU) 2026/2274?"],
}
for k, v in NEW.items():
    assert k not in q; q[k] = v
for v in q.values():
    for x in v: assert chr(0x2014) not in x
open(QW, "w", encoding="utf-8").write(json.dumps(q, ensure_ascii=False, indent=1, sort_keys=True))
print("keys:", len(q))
