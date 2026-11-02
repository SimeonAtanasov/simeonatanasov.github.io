"""After the 2 November 2026 Israel update (ENF-02) three Israel chunks on the worldwide page grew
past the chunk limit and split into -1 and -2: fines, cases worth knowing, worth knowing. Moves
their written questions to the half that answers them and writes new ones for the new content,
including the phrasings that gave no suggestion in the Ask check of the same evening (karting,
DPO reduction, how a sanction is calculated, late breach reports, the Ministry of Education,
findings without a sanction, the administrative fine, DPOas). The suggester matches "israel" and
"israeli" as different words, so some questions name Israel on purpose. Refuses to run twice."""
import json, os
QW = os.path.join(os.path.dirname(__file__), "..", "assistant-build", "questions_written.json")
q = json.load(open(QW, encoding="utf-8"))
P = "world-ge-c-il-"
assert P + "fines" in q and P + "fines-1" not in q, "already applied"
fines = q.pop(P + "fines")
cases = q.pop(P + "cases-worth-knowing")
wk = q.pop(P + "worth-knowing")
assert fines[3] == "What prison terms exist for privacy offences in Israel?", fines
assert cases[2] == "Which sanctions has the Israeli PPA imposed recently?", cases
q[P + "fines-1"] = fines[:3] + [
    "How does the Israeli PPA set the base amount of a monetary sanction?",
    "Has the Israeli PPA sanctioned a municipality?",
    "How is a privacy sanction calculated in Israel?"]
q[P + "fines-2"] = [fines[3],
    "Does appointing a DPO reduce a privacy sanction in Israel?",
    "What reductions can the Israeli PPA apply to a monetary sanction?",
    "Is there a DPO reduction for privacy sanctions in Israel?"]
q[P + "cases-worth-knowing-1"] = cases[:2] + [
    "Was the National Insurance employee fine an Amendment 13 sanction?",
    "Why did the Israeli PPA sanction the Meuhedet Health Fund?",
    "Was the National Insurance fine in Israel an administrative fine?"]
q[P + "cases-worth-knowing-2"] = [
    "How did the Israeli PPA calculate the Menora Mivtachim sanction?",
    "Why was the Beit Shemesh Municipality sanctioned over its vendor?",
    "Must a serious security event in Israel be reported before the internal investigation ends?",
    "What happens in Israel when a breach report is late?"]
q[P + "worth-knowing-1"] = wk + [cases[2],
    "How many monetary sanctions has the Israeli PPA imposed under Amendment 13?",
    "Does the Israeli PPA publish findings of violation without a sanction?",
    "Why was a karting company sanctioned in Israel?",
    "What did the PPA find against the Ministry of Education in Israel?",
    "Does the PPA in Israel publish findings without a sanction?"]
q[P + "worth-knowing-2"] = [
    "Where can I read the Israeli PPA's enforcement notices?",
    "Which sources track Israeli privacy enforcement actions?",
    "Is the DPOas enforcement tracker a source for Israel?"]
s = json.dumps(q, ensure_ascii=False, indent=1, sort_keys=True)
assert chr(0x2014) not in s
open(QW, "w", encoding="utf-8").write(s)
print("keys:", len(q))
