"""After the 23 October 2026 enforcement update the Australia route chunk grew past the chunk
limit and split into -1 and -2. Moves its written questions to -1 and writes two for -2
(the tranche 2 exposure draft). Refuses to run twice."""
import json, os
QW = os.path.join(os.path.dirname(__file__), "..", "assistant-build", "questions_written.json")
q = json.load(open(QW, encoding="utf-8"))
old = "world-ge-c-au-route-of-a-fine-and-the-authority"
assert old in q and old + "-1" not in q, "already applied"
q[old + "-1"] = q.pop(old)
q[old + "-2"] = ["What is in Australia's tranche 2 privacy reform exposure draft?",
                 "Will Australia's tranche 2 privacy reform add a direct right of action?"]
open(QW, "w", encoding="utf-8").write(json.dumps(q, ensure_ascii=False, indent=1, sort_keys=True))
print("keys:", len(q))
