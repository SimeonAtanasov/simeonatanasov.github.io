# SA-11 (16 November 2026): the privacy crosswalk in the Ask panel index.
#
# Patches the assistant build, not the assistant: assistant.js, assistant.css, pwa.js and
# sw.js are not touched, so no service worker bump is needed.
#   dump_js_data.js         also evaluates pages/privacy-crosswalk/crosswalk-data.js
#   build_index.py          a catalogue entry, the sentence that lists what is searched, one
#                           chunk per crosswalk row (pc-r01 ...), a template question
#   questions_written.json  written questions for the 36 rows and the catalogue entry
# Then rebuild: python3 "Claude outputs/assistant-build/build_index.py" --repo .
#
# Read-modify-write with assertions; before-images go to BASE/2026-11-16-SA-11/ (outside
# the repo). Usage: python3 wire_sa11.py REPO BASE [--dry]
import sys, os, json, hashlib

R = sys.argv[1]; BASE = sys.argv[2]; DRY = "--dry" in sys.argv
EM = chr(0x2014)
AB = "Claude outputs/assistant-build/"


def rd(p):
    return open(os.path.join(R, p), "rb").read().decode("utf-8")


def rep(s, a, b, what):
    assert s.count(a) == 1, what + ": anchor found %d times" % s.count(a)
    return s.replace(a, b)


out = {}

# ---------------------------------------------------------------- dump_js_data.js
p = AB + "dump_js_data.js"; s = rd(p)
assert "privacy-crosswalk" not in s, "already patched"
s = rep(s, "   Reads pages/gdpr-readiness/readiness-data.js and pages/ai-crosswalk/crosswalk-data.js. */",
        "   Reads pages/gdpr-readiness/readiness-data.js, pages/ai-crosswalk/crosswalk-data.js and\n"
        "   pages/privacy-crosswalk/crosswalk-data.js. */", "dump header")
s = rep(s, 'console.log("readiness activities:", readiness.ACTIVITIES.length, "crosswalk rows:", w.CW_DATA.rows.length);',
        'var pc = read("pages/privacy-crosswalk/crosswalk-data.js");\n'
        'var w2 = {};\n'
        'new Function("window", pc)(w2);\n'
        'fs.writeFileSync(path.join(out, "privacy_crosswalk.json"), JSON.stringify(w2.PC_DATA));\n'
        'console.log("readiness activities:", readiness.ACTIVITIES.length, "crosswalk rows:", w.CW_DATA.rows.length, "privacy crosswalk rows:", w2.PC_DATA.rows.length);',
        "dump log line")
out[p] = s

# ---------------------------------------------------------------- build_index.py
p = AB + "build_index.py"; s = rd(p)
assert "privacy_crosswalk" not in s, "already patched"
s = rep(s, '''        "returns": "A reference table with deep links per obligation. No state is kept.",
        "shape": "Reference page.",
    },
''', '''        "returns": "A reference table with deep links per obligation. No state is kept.",
        "shape": "Reference page.",
    },
    {
        "id": "pcrosswalk", "name": "Privacy Crosswalk", "url": "privacy-crosswalk.html",
        "what": "36 GDPR obligations for controllers and processors, each mapped to NIST Privacy Framework 1.0 subcategories and to ISO/IEC 27701 clauses in the 2019 numbering, with the source of every reference and the gaps marked, plus reverse views by clause and by subcategory.",
        "when": "Use it when you already run a privacy management system or the NIST Privacy Framework and want to see which GDPR obligations it addresses and which duties exist only in the law.",
        "returns": "A reference table with deep links per obligation. The ISO numbers are those of the withdrawn 2019 edition, as the public mappings print them. No state is kept.",
        "shape": "Reference page.",
    },
''', "catalogue entry")
s = rep(s, "the GDPR readiness activities, the AI governance crosswalk, the enforcement pages",
        "the GDPR readiness activities, the AI governance crosswalk, the privacy crosswalk, the enforcement pages", "faq sentence")
s = rep(s, '''def enforcement(repo, out, rel, kind, page_label):
''', '''def privacy_crosswalk(repo, out, work):
    """One chunk per row of privacy-crosswalk.html (SA-11, 16 November 2026)."""
    data = json.load(open(os.path.join(work, "privacy_crosswalk.json"), encoding="utf-8"))
    roles = data.get("roles", {})
    themes = {t["id"]: t["label"] for t in data.get("themes", [])}
    titles = {x["id"]: x["title"] for x in data.get("iso", [])}
    gaps = {"partial": "The NIST Privacy Framework matches this only in part.", "none": "The NIST Privacy Framework has no equivalent."}
    for r in data["rows"]:
        seen = []
        for a in r.get("gdpr", []):
            if a.get("title") not in seen:
                seen.append(a.get("title"))
        arts = "; ".join(a.get("label", "") for a in r.get("gdpr", [])) + " GDPR (" + " / ".join(seen) + ")"
        role = roles.get(r.get("role", ""), r.get("role", ""))
        text = "%s. %s. %s" % (arts, role, r.get("obligation", ""))
        if r.get("nist"):
            text += " NIST Privacy Framework: %s." % ", ".join(n["id"] for n in r["nist"])
        main = [i for i in r.get("iso", []) if not i.startswith("6.")]
        sec = [i for i in r.get("iso", []) if i.startswith("6.")]
        if main:
            text += " ISO/IEC 27701, 2019 numbering: %s." % "; ".join("%s %s" % (i, titles.get(i, "")) for i in main)
        if sec:
            text += " Security guidance clauses: %s." % ", ".join(sec)
        if r.get("note"):
            text += " " + r["note"]
        if r.get("gap"):
            text += " " + gaps[r["gap"]]
        title = "GDPR obligation %s: %s" % (r["id"][1:].lstrip("0"), r["gdpr"][0]["label"] + " " + r["gdpr"][0]["title"])
        out.add_split("pc-" + r["id"], "crosswalk", "Privacy Crosswalk", title,
                      "privacy-crosswalk.html#pc-" + r["id"], text, meta=themes.get(r.get("theme", ""), ""), cap=3000)
    return len(data["rows"])


def enforcement(repo, out, rel, kind, page_label):
''', "privacy_crosswalk function")
s = rep(s, '''                out.append(("How does %s map to ISO/IEC 42001 and NIST AI RMF?" % m.group(1), cid))
''', '''                out.append(("How does %s map to ISO/IEC 42001 and NIST AI RMF?" % m.group(1), cid))
            m = re.match(r"^GDPR obligation \\d+: (Article \\d+)", t)
            if m:
                out.append(("How does %s of the GDPR map to ISO/IEC 27701 and the NIST Privacy Framework?" % m.group(1), cid))
''', "template question")
s = rep(s, '''    counts["crosswalk"] = crosswalk(repo, out, args.work)
''', '''    counts["crosswalk"] = crosswalk(repo, out, args.work)
    counts["privacy_crosswalk"] = privacy_crosswalk(repo, out, args.work)
''', "main call")
out[p] = s

# ---------------------------------------------------------------- questions_written.json
Q = {
 "tool-cat-pcrosswalk": ["Is there a crosswalk between the GDPR, ISO 27701 and the NIST Privacy Framework?", "Which GDPR obligations does the NIST Privacy Framework not cover?", "Does the privacy crosswalk use the ISO/IEC 27701:2025 numbering?", "Where do the mappings in the privacy crosswalk come from?", "We run the NIST Privacy Framework, which GDPR duties are left over?"],
 "pc-r01": ["Which NIST Privacy Framework subcategories cover the lawful basis under Article 6 GDPR?", "Does ISO 27701 cover identifying a legal basis for processing?", "Do the privacy frameworks tell me which legal basis to use?"],
 "pc-r02": ["How does purpose limitation map to ISO 27701 and the NIST Privacy Framework?", "Does any privacy framework cover the compatibility test for a new purpose?"],
 "pc-r03": ["Which framework controls support data minimisation and retention?", "How does storage limitation map to the NIST Privacy Framework?"],
 "pc-r04": ["Which NIST Privacy Framework subcategories cover the accuracy principle?", "How does data accuracy map to ISO 27701?"],
 "pc-r05": ["Which ISO 27701 clauses deal with consent?", "Do the privacy frameworks cover children's consent under Article 8 GDPR?", "How does withdrawal of consent map to the NIST Privacy Framework?"],
 "pc-r06": ["Do ISO 27701 or the NIST Privacy Framework cover special category data?", "How is Article 9 GDPR reflected in the privacy frameworks?"],
 "pc-r07": ["How does accountability under Article 5(2) map to a privacy management framework?", "Which NIST Privacy Framework subcategories support Article 24 GDPR?"],
 "pc-r08": ["Do the privacy frameworks set the one month deadline for data subject requests?", "Which NIST subcategories cover handling requests from individuals?"],
 "pc-r09": ["Which framework controls cover privacy notices under Articles 13 and 14?", "Does the NIST Privacy Framework say what a privacy notice must contain?"],
 "pc-r10": ["How does the right of access map to ISO 27701 and the NIST Privacy Framework?", "Which NIST subcategories help answer a subject access request?"],
 "pc-r11": ["Which controls support the right to rectification?", "How do I map the duty to tell recipients about a correction?"],
 "pc-r12": ["How does the right to erasure map to the NIST Privacy Framework?", "Which ISO 27701 clauses relate to deletion requests?"],
 "pc-r13": ["Is the right to restriction of processing covered by the NIST Privacy Framework?", "How do I implement restriction of processing with framework controls?"],
 "pc-r14": ["Which controls support data portability under Article 20?", "How does data portability map to ISO 27701?"],
 "pc-r15": ["How does the right to object map to the privacy frameworks?", "Which controls cover objections to direct marketing?"],
 "pc-r16": ["Do the privacy frameworks cover automated decision-making under Article 22 GDPR?", "Is human intervention in automated decisions covered by the NIST Privacy Framework?"],
 "pc-r17": ["How does data protection by design and by default map to NIST and ISO 27701?", "Which NIST Privacy Framework subcategories support privacy by design?"],
 "pc-r18": ["Which NIST subcategories correspond to the record of processing activities?", "Does a NIST data inventory cover what Article 30 GDPR asks for?", "Is the Article 30(5) exemption for small organisations changing?"],
 "pc-r19": ["How does a DPIA map to the NIST Privacy Framework risk assessment?", "Which ISO 27701 clause covers privacy impact assessment?"],
 "pc-r20": ["Do the privacy frameworks cover prior consultation with the supervisory authority?", "Is there a NIST equivalent of Article 36 GDPR?"],
 "pc-r21": ["Do ISO 27701 or the NIST Privacy Framework cover the data protection officer?", "Does any privacy framework address the independence of the DPO?"],
 "pc-r22": ["Is the EU representative under Article 27 GDPR covered by any framework?", "Which controls map to appointing an EU representative?"],
 "pc-r23": ["Is cooperation with the supervisory authority covered by the privacy frameworks?"],
 "pc-r24": ["How do joint controller arrangements map to ISO 27701 and NIST?", "Which ISO 27701 clause covers joint controllers?"],
 "pc-r25": ["Which controls support choosing a processor with sufficient guarantees?", "How does vendor due diligence under Article 28(1) map to the NIST Privacy Framework?"],
 "pc-r26": ["Do the privacy frameworks list the terms a processor contract must contain?", "Which ISO 27701 clauses cover contracts between controller and processor?"],
 "pc-r27": ["Which ISO 27701 clauses cover sub-processors?", "Does the NIST Privacy Framework cover authorisation of sub-processors?"],
 "pc-r28": ["How does processing only on the controller's instructions map to the frameworks?", "What must a processor do with an instruction it considers unlawful?"],
 "pc-r29": ["Which controls cover returning or deleting data at the end of a processing contract?", "How does a processor's audit duty map to the privacy frameworks?"],
 "pc-r30": ["How does Article 32 security of processing map to ISO 27701 and NIST Protect-P?", "Which NIST Privacy Framework subcategories cover encryption and resilience?", "Do the frameworks decide what security is appropriate to the risk?"],
 "pc-r31": ["Do the privacy frameworks contain the 72 hour breach notification deadline?", "Which controls support notifying a breach to the supervisory authority?"],
 "pc-r32": ["Which controls cover a processor telling the controller about a breach?"],
 "pc-r33": ["How does telling individuals about a data breach map to the NIST Privacy Framework?"],
 "pc-r34": ["Do ISO 27701 or the NIST Privacy Framework cover international data transfers under Chapter V?", "Which framework controls relate to standard contractual clauses and adequacy decisions?"],
 "pc-r35": ["Are the Article 49 derogations covered by any privacy framework?"],
 "pc-r36": ["Which controls cover disclosure demands from foreign authorities under Article 48 GDPR?"],
}
p = AB + "questions_written.json"; raw = open(os.path.join(R, p), "rb").read(); s = raw.decode("utf-8")
qw = json.loads(s)
assert not any(k in qw for k in Q), "already patched"
assert sum(1 for k in Q if k.startswith("pc-r")) == 36
qw.update(Q)
# keep the file's own formatting: detect indent and the ensure_ascii choice by round trip
fmt = None
orig = json.loads(s)
for indent in (1, 2, None, 4):
    for ascii_ in (False, True):
        t = json.dumps(orig, ensure_ascii=ascii_, indent=indent)
        for tail in ("", "\n"):
            if t + tail == s:
                fmt = (indent, ascii_, tail)
assert fmt, "questions_written.json formatting not recognised; stop rather than reformat the file"
out[p] = json.dumps(qw, ensure_ascii=fmt[1], indent=fmt[0]) + fmt[2]

# ---------------------------------------------------------------- write
for p in sorted(out):
    s = out[p]; old = open(os.path.join(R, p), "rb").read()
    assert EM not in s or EM in old.decode("utf-8"), p + ": em dash introduced"
    assert ("\r\n" in old.decode("utf-8")) == ("\r\n" in s), p + ": line endings changed"
    b = s.encode("utf-8")
    if not DRY:
        bdir = os.path.join(BASE, "2026-11-16-SA-11"); os.makedirs(bdir, exist_ok=True)
        bp = os.path.join(bdir, os.path.basename(p))
        if not os.path.exists(bp):
            open(bp, "wb").write(old)
        open(os.path.join(R, p), "wb").write(b)
    print("SA-11 %-52s %7d %s -> %7d %s" % (p, len(old), hashlib.md5(old).hexdigest(), len(b), hashlib.md5(b).hexdigest()))
print("dry run, nothing written" if DRY else "written: %d files" % len(out))
