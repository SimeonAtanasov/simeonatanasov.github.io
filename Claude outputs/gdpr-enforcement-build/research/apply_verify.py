# -*- coding: utf-8 -*-
"""Applies the independent verification pass to the raw country research.
Reads raw/<code>.json and raw/<code>.verify.json, applies every replacement whose verdict
is 'corrected' or 'wrong', then the three manual patches below (taken from the verifiers'
notes), and writes ../data/<code>.json. Rerun after editing anything in raw/.
Usage: python3 apply_verify.py"""
import json, glob, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
DATA = os.path.join(HERE, "..", "data")


def parse(path):
    toks = []
    for part in path.split("."):
        m = re.match(r"^([^\[]+)((?:\[\d+\])*)$", part)
        toks.append(m.group(1))
        toks += [int(x) for x in re.findall(r"\[(\d+)\]", m.group(2))]
    return toks


def setp(obj, toks, val):
    for t in toks[:-1]:
        obj = obj[t]
    obj[toks[-1]]  # must exist
    obj[toks[-1]] = val


MANUAL = {
    "ie": lambda d: d["appeal"].__setitem__("inaction", "Section 150(7) of the Data Protection Act 2018 lets a complainant appeal to the court if the DPC fails to meet the required timelines on a complaint; judicial review in the High Court remains available otherwise."),
    "hu": lambda d: d["complaint"].__setitem__("deadlines", d["complaint"]["deadlines"] + " If NAIH misses the 150-day deadline it must pay the applicant HUF 10,000."),
}


def bg(d):
    d["quirks"][2] = "Data subjects can sue controllers directly in the administrative courts, including for damages (Art. 39 PDPA). The Act is reported to bar a court claim while CPDP proceedings on the same infringement are pending; check the current text before relying on it."
    d["plain"] = "You complain to the Commission in writing within six months of discovering the problem. The five-member Commission investigates and decides; if it fines the company, the chair issues a penalty decree that can be challenged in the local district court and then the administrative court. You can also sue the company directly in the administrative court, including for compensation, though not, it appears, while a complaint on the same issue is still pending."


MANUAL["bg"] = bg


def it(d):
    # External audit, 2 October 2026: one source dates the judgment 18 March, ANSA reported it on
    # 20 March. Give the month and the report date rather than pick one.
    for c in d["cases"]:
        if "annulled it on 20 March 2026" in c["summary"]:
            c["summary"] = c["summary"].replace("annulled it on 20 March 2026", "annulled it in March 2026 (reported 20 March 2026)")
            break
    else:
        raise AssertionError("OpenAI summary not found")


MANUAL["it"] = it


def de(d):
    # Checked 2 October 2026: the Bundestag and BfDI releases confirm the 25 June 2026 election and
    # that the predecessor stayed until 30 September 2026, but no source states the start date.
    old = "took office on 1 October 2026, succeeding Louisa Specht-Riemenschneider."
    new = "succeeds Louisa Specht-Riemenschneider, who stayed in office until 30 September 2026."
    assert old in d["dpa"]["structure"]
    d["dpa"]["structure"] = d["dpa"]["structure"].replace(old, new)


MANUAL["de"] = de

n = 0
for f in sorted(glob.glob(os.path.join(RAW, "*.json"))):
    if f.endswith(".verify.json"):
        continue
    code = os.path.basename(f)[:-5]
    d = json.load(open(f, encoding="utf-8"))
    vf = os.path.join(RAW, code + ".verify.json")
    if os.path.exists(vf):
        for c in json.load(open(vf, encoding="utf-8")).get("checked", []):
            if c.get("verdict") in ("corrected", "wrong") and c.get("replacement"):
                setp(d, parse(c["field"].strip()), c["replacement"])
                n += 1
    if code in MANUAL:
        MANUAL[code](d)
    json.dump(d, open(os.path.join(DATA, code + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(n, "corrections applied")
