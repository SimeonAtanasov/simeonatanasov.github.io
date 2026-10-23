# -*- coding: utf-8 -*-
"""AI Act digest update of 23 October 2026. Edits items_corpus.json, build_aia_page.py,
build_aia_pdf.py and aia_extras.py in place. Refuses to run twice. Run after
update_2026_09_28.py and the xref-verification apply scripts if items_corpus.json is ever
regenerated.

- doc-59 (new, Standards): Commission Implementing Decision (EU) 2026/2274 of 12 October
  2026 citing EN 18286:2026, the first harmonised standard under the AI Act. Read from the
  decision on EUR-Lex (CELEX 32026D2274): Article 1, Article 2, the one-row Annex and
  recitals 1, 3 and 5.
- doc-27 and doc-28: the closing sentences now record the citation.
- doc-50 (Ireland): rewritten from the Regulation of Artificial Intelligence Act 2026
  (No. 31 of 2026, Oireachtas PDF a3126.pdf) and S.I. No. 403 and No. 404 of 2026
  (commencement and establishment day 31 July 2026). The entry had still called the AI
  Office "expected".
- doc-52 (France): rewritten from the Senate amendments to the EU law adaptation bill
  (n. 348, 2025-2026), all government amendments marked adopted: 442 (CNIL), 437 (ACPR),
  438 (ANFR), 440 (ordinance for Article 77 authorities and sandboxes), 495 (penalties and
  application dates). Status stays draft.
- Obligations checker (aia_extras.py): "harmonised standards are still in preparation"
  now names EN 18286.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "items_corpus.json")
C = json.load(open(P, encoding="utf-8"))
if any(c["id"] == "doc-59" for c in C):
    sys.exit("already applied: doc-59 present")
assert len(C) == 58
D = {c["id"]: c for c in C}

def tail_replace(cid, old, new):
    t = D[cid]["takeaway"]
    assert t.count(old) == 1, (cid, old)
    D[cid]["takeaway"] = t.replace(old, new)

tail_replace("doc-27",
    "The first deliverable, prEN 18286 on quality management systems, entered public enquiry on 30 October 2025, so track OJ citations before relying on any standard.",
    "The first deliverable, EN 18286:2026 on quality management systems, was cited in the Official Journal by Implementing Decision (EU) 2026/2274 on 14 October 2026; the other areas have no cited standard yet, so check the OJ before relying on any of them.")
tail_replace("doc-28",
    "and on 9 July 2026 JTC 21 said publication of EN 18286 was expected in July 2026, with prEN 18228, prEN 18282, prEN 18229-1 and prEN 18288 still in public hearing. A published EN gives no presumption of conformity until cited in the Official Journal, so monitor both.",
    "and on 9 July 2026 JTC 21 expected EN 18286 to be published that month, with prEN 18228, prEN 18282, prEN 18229-1 and prEN 18288 still in public hearing. EN 18286:2026 was cited in the Official Journal on 14 October 2026 by Implementing Decision (EU) 2026/2274; the others give no presumption of conformity until they are published and cited, so monitor both.")

D["doc-50"].update({
    "title": "Ireland: Regulation of Artificial Intelligence Act 2026, the AI Office of Ireland and S.I. No. 366 of 2025",
    "date": "21 July 2026",
    "status": "in force",
    "url": "https://data.oireachtas.ie/ie/oireachtas/act/2026/31/eng/enacted/a3126.pdf",
    "takeaway": (
        "The Regulation of Artificial Intelligence Act 2026 (No. 31 of 2026), commenced on 31 July 2026 by S.I. No. 403 "
        "of 2026 with the same day as establishment day under S.I. No. 404, sets up the AI Office of Ireland (Oifig IS na "
        "hÉireann) as the single point of contact under Article 70(2), coordinator of the competent authorities, keeper "
        "of a register of prohibited practices and serious incidents, and operator of regulatory sandboxes. Market "
        "surveillance authorities remain those designated by S.I. No. 366 of 2025, a decentralised set of sectoral "
        "regulators, and the Act gives them contravention and prohibition notices and an adjudication process ending in "
        "administrative fines confirmed by the High Court. Operators established in Ireland, including many GPAI "
        "providers, should map each system to its sectoral regulator and use the AI Office as the entry point."
    ),
    "source": "page",
})

D["doc-52"].update({
    "title": "France: CNIL, ACPR, ANFR and DGCCRF roles under the EU law adaptation bill (Senate first reading, February 2026)",
    "date": "18 February 2026",
    "status": "draft",
    "url": "https://www.senat.fr/enseance/2025-2026/348/Amdt_442.html",
    "takeaway": (
        "France is implementing the Act through its general bill adapting French law to EU law, passed by the Senate at "
        "first reading under the accelerated procedure with government amendments of 12 and 18 February 2026. The CNIL "
        "becomes market surveillance authority for most prohibited practices (social scoring jointly with the DGCCRF), "
        "for emotion recognition and biometric categorisation transparency, and for Annex III biometrics, employment, "
        "law enforcement, migration and border control; the ACPR takes creditworthiness and insurance pricing, the ANFR "
        "radio equipment, and an ordinance within six months of promulgation is to settle the Article 77 authorities and "
        "sandboxes. The DGCCRF remains the coordinating authority and single point of contact on the Commission's list. "
        "Not yet law: check the bill's passage through the Assemblée nationale."
    ),
    "source": "page",
})

EN = {
    "id": "doc-59",
    "title": "Commission Implementing Decision (EU) 2026/2274 citing EN 18286:2026, the first harmonised standard for high-risk AI systems",
    "issuer": "European Commission",
    "type": "standards",
    "status": "in force",
    "articles": ["Art 40", "Art 17", "Art 72"],
    "date": "12 October 2026",
    "url": "https://eur-lex.europa.eu/eli/dec_impl/2026/2274/oj",
    "takeaway": (
        "Implementing Decision (EU) 2026/2274 of 12 October 2026, in force on its publication in the Official Journal on "
        "14 October 2026, cites EN 18286:2026, Artificial intelligence - Quality management system for EU AI Act "
        "regulatory purposes, the first harmonised standard under the Act. Under Article 40 a provider of a high-risk AI "
        "system whose quality management system conforms to it is presumed to meet the requirements the standard "
        "covers, which recital 3 describes as quality management systems for providers including post-market "
        "monitoring, so Article 17 and the processes behind Article 72. Use is voluntary and the presumption reaches no "
        "further than the standard: it says nothing about the system's own conformity with Articles 8 to 15. Map an "
        "Article 17 system to EN 18286 and watch the Official Journal for the other standards requested."
    ),
    "topics": ["standards", "conformity"],
    "source": "page",
}
C.append(EN)
for c in (D["doc-27"], D["doc-28"], D["doc-50"], D["doc-52"], EN):
    assert chr(0x2014) not in c["takeaway"] + c["title"], c["id"]
open(P, "w", encoding="utf-8").write(json.dumps(C, ensure_ascii=False, indent=1))

REPL = {
    "build_aia_page.py": [
        ("as of %s, with one report added on 28 September 2026: %d documents,",
         "as of %s, with documents added on 28 September and 23 October 2026: %d documents,"),
        ("Snapshot %s; one report added 28 September 2026.",
         "Snapshot %s; documents added 28 September and 23 October 2026."),
    ],
    "build_aia_pdf.py": [
        ("as of %s, with one report added on 28 September 2026, grouped by kind",
         "as of %s, with documents added on 28 September and 23 October 2026, grouped by kind"),
        ('"/mnt/user-data/outputs/ai-act-digest-2026-09-28.pdf"', '"/mnt/user-data/outputs/ai-act-digest-2026-10-23.pdf"'),
    ],
    "aia_extras.py": [
        ("harmonised standards are still in preparation (see Standards in Part 2).",
         "the first harmonised standard, EN 18286 on quality management, was cited on 14 October 2026 and the others are still in preparation (see Standards in Part 2)."),
    ],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for x, y in pairs:
        assert s.count(x) == 1, (f, x)
        s = s.replace(x, y)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)
print("items_corpus.json: %d documents" % len(C))
