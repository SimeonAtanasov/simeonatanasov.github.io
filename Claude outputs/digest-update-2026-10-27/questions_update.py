"""Written questions for the entry added on 27 October 2026 (ck-d031, Article 29 Working Party
Opinion 04/2012 on Cookie Consent Exemption). Run after remap_questions.py. Refuses to run twice."""
import json, os
QW = os.path.join(os.path.dirname(__file__), "..", "assistant-build", "questions_written.json")
q = json.load(open(QW, encoding="utf-8"))
assert "ck-d031" not in q, "already applied"
q["ck-d031"] = [
    "What does the Article 29 Working Party say about a cookie used for several purposes?",
    "Which cookies are exempt from consent under WP29 Opinion 04/2012?",
    "Are first-party analytics cookies exempt from consent under the ePrivacy Directive?",
    "What are Criterion A and Criterion B for the cookie consent exemption?",
    "Can the same cookie be strictly necessary for one purpose and need consent for another?",
]
for v in q.values():
    for x in v: assert chr(0x2014) not in x
open(QW, "w", encoding="utf-8").write(json.dumps(q, ensure_ascii=False, indent=1, sort_keys=True))
print("keys:", len(q))
