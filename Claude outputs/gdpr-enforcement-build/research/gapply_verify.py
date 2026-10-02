# -*- coding: utf-8 -*-
"""Applies the verification pass to the worldwide research: graw/<code>.json plus
graw/<code>.verify.json -> ../gdata/<code>.json. Same rules as apply_verify.py; an index one past
the end of a list appends (a verifier adding a case). Usage: python3 gapply_verify.py"""
import json, glob, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "graw")
DATA = os.path.join(HERE, "..", "gdata")
os.makedirs(DATA, exist_ok=True)


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
    last = toks[-1]
    if isinstance(obj, list) and last == len(obj):
        obj.append(val)
    else:
        obj[last]  # must exist
        obj[last] = val


MANUAL = {}


def _sg(d):
    # Verifier note: reconsideration (s 48N) and appeal (s 48Q) are alternatives (s 48Q(3)).
    d["complaint"]["complainant_status"] = d["complaint"]["complainant_status"].replace(
        "can seek reconsideration and appeal (ss 48N and 48Q)",
        "can seek reconsideration (s 48N) or appeal (s 48Q), which are alternatives (s 48Q(3))")
    for i, st in enumerate(d["procedure"]["stages"]):
        if "s 48N" in st and "s 48Q" in st:
            d["procedure"]["stages"][i] = "Reconsideration by the PDPC (s 48N) or appeal to the Data Protection Appeal Panel (s 48Q), then the High Court (s 48R)."
    for k in ("further",):
        d["appeal"][k] = d["appeal"][k].replace("Reed v Bellingham", "Bellingham v Reed")
    for k in ("courts", "damages", "collective"):
        d["private"][k] = d["private"][k].replace("Reed v Bellingham", "Bellingham v Reed")


def _mx(d):
    # Verifier: cases[1] is not an enforcement case; dropped.
    d["cases"] = [c for c in d["cases"] if not c["title"].startswith("No published fines")]


def _ph(d):
    # Verifier: the BDO entry has no year or outcome; dropped rather than kept unsourced.
    d["cases"] = [c for c in d["cases"] if "BDO" not in c["title"]]


def _ar(d):
    # Verifier: Resolution 126/2024 is a rule change, not a case; moved to quirks.
    d["cases"] = [c for c in d["cases"] if not c["title"].startswith("Resolution 126/2024")]
    d["quirks"].append("Fines are graded under AAIP Resolution 126/2024, which sets 16 grading criteria and replaced the earlier sanction rules.")


MANUAL.update({"sg": _sg, "mx": _mx, "ph": _ph, "ar": _ar})
n, report = 0, []
for f in sorted(glob.glob(os.path.join(RAW, "*.json"))):
    if f.endswith(".verify.json"):
        continue
    code = os.path.basename(f)[:-5]
    d = json.load(open(f, encoding="utf-8"))
    vf = os.path.join(RAW, code + ".verify.json")
    if os.path.exists(vf):
        for c in json.load(open(vf, encoding="utf-8")).get("checked", []):
            if c.get("verdict") in ("corrected", "wrong"):
                if c.get("replacement") in (None, ""):
                    report.append("%s %s %s: no replacement" % (code, c["field"], c["verdict"]))
                    continue
                rep = c["replacement"]
                if isinstance(rep, str) and rep.strip().startswith("{"):
                    try:
                        rep = json.loads(rep)
                    except ValueError:
                        pass
                try:
                    setp(d, parse(c["field"].strip()), rep)
                    n += 1
                except Exception as ex:
                    report.append("%s %s FAILED %r" % (code, c["field"], ex))
    if code in MANUAL:
        MANUAL[code](d)
    json.dump(d, open(os.path.join(DATA, code + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(n, "corrections applied")
print("\n".join(report))
