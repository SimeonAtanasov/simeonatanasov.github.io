"""Written questions for the two entries added on 2 November 2026 (DIG-03): ck-d036, the CNIL
consolidated recommendation on cookies and other trackers (16 January 2026), and ck-d038 (two chunks), CNIL
Deliberation 2025-131 on multi-device consent (18 December 2025). Run after remap_questions.py.
Refuses to run twice."""
import json, os
QW = os.path.join(os.path.dirname(__file__), "..", "assistant-build", "questions_written.json")
q = json.load(open(QW, encoding="utf-8"))
assert "ck-d036" not in q and "ck-d038-1" not in q, "already applied"
q["ck-d036"] = [
    "What is the current version of the CNIL cookie recommendation?",
    "Is CNIL recommendation 2020-092 still the text to cite?",
    "How long does the CNIL say consent and refusal choices should be kept?",
    "What lifetime does the CNIL recommend for consent-exempt audience measurement cookies?",
    "How does the CNIL expect proof of cookie consent to be kept?",
]
# The index splits this long entry into two chunks, ck-d038-1 (scope, information, conflicts)
# and ck-d038-2 (shared devices, identifiers, re-consent).
q["ck-d038-1"] = [
    "Can cookie consent given on one device apply to all of a user's logged-in devices in France?",
    "What does the CNIL say about cross-device or multi-device consent?",
    "What happens when a cookie choice made before login conflicts with the choice saved on the account?",
]
q["ck-d038-2"] = [
    "Do I need fresh consent to switch to multi-device consent under the CNIL recommendation?",
    "Can the account identifier be sent to the consent management platform?",
    "How should multi-device consent work on a shared family computer or smart TV?",
]
for v in q.values():
    for x in v: assert chr(0x2014) not in x
open(QW, "w", encoding="utf-8").write(json.dumps(q, ensure_ascii=False, indent=1, sort_keys=True))
print("keys:", len(q))
