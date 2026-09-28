# -*- coding: utf-8 -*-
"""AI Act digest update of 28 September 2026: the Irish Data Protection Commission's AI
Insights Report (published 25 September 2026) added to Part 2 as doc-58.

- New corpus type "national-dpa" for guidance and reports of national data protection
  authorities.
- The Part 2 group "EDPB and EDPS" is renamed "Data protection authorities" and takes both
  "edpb-edps" and "national-dpa". Its anchor moves from #ai-edpb-and-edps to
  #ai-data-protection-authorities; nothing outside the page linked to the old one.
- Intro and PDF wording updated to match; the snapshot date stays 19 September 2026, with
  the addition stated beside it.

Takeaway written from the report itself (edpb-downloads/ai-act-downloads/DPC-AI-Insights-Report-AC.pdf,
executive summary, the engagement figures on page 12 of the PDF and Appendix A).
Edits items_corpus.json, build_aia_page.py and build_aia_pdf.py in place. Refuses to run twice.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "items_corpus.json")
C = json.load(open(P, encoding="utf-8"))
if any(c["id"] == "doc-58" for c in C):
    sys.exit("already applied: doc-58 present")
assert len(C) == 57

DPC = {
    "id": "doc-58",
    "title": "Responsible Artificial Intelligence Innovation: Insights from the Data Protection Commission's Supervision of AI (2021-2025)",
    "issuer": "Data Protection Commission (Ireland)",
    "type": "national-dpa",
    "status": "final",
    "articles": ["Art 2(7)"],
    "date": "25 September 2026",
    "url": "https://www.dataprotection.ie/en/news-media/latest-news/data-protection-commission-publishes-ai-insights-report",
    "takeaway": (
        "Report of the Irish Data Protection Commission on about 180 AI engagements with controllers between 2021 and "
        "2025, 143 of them on generative AI, run through its voluntary supervision function rather than formal inquiries. "
        "Not binding, but it states how the lead authority for many large technology providers applies the GDPR: clear "
        "notice and a reasonable notice period before personal data is used for training, repeated when a user turns 18; "
        "objection routes with as little friction as possible; enhanced transparency where historical data is reused, "
        "and private messages unlikely to be within users' expectations; a DPIA likely for training a new model, kept as "
        "a living document after launch; and a human trigger or appeal does not by itself take a decision outside "
        "Article 22 GDPR. Use it as a pre-training checklist beside Opinion 28/2024, which it follows."
    ),
    "topics": ["data", "transparency"],
    "source": "page",
}
assert chr(0x2014) not in DPC["takeaway"] + DPC["title"]
C.append(DPC)
open(P, "w", encoding="utf-8").write(json.dumps(C, ensure_ascii=False, indent=1))

REPL = {
    "build_aia_page.py": [
        ('    ("EDPB and EDPS", ["edpb-edps"]),', '    ("Data protection authorities", ["edpb-edps", "national-dpa"]),'),
        ("Part 2 is the corpus around the Act as of %s: %d documents,",
         "Part 2 is the corpus around the Act as of %s, with one report added on 28 September 2026: %d documents,"),
        ("EDPB and EDPS opinions including Opinion 28/2024 on AI models,",
         "EDPB and EDPS opinions including Opinion 28/2024 on AI models and a national data protection authority\\'s report on supervising AI,"),
        ("numbered sources. Snapshot %s.</p>", "numbered sources. Snapshot %s; one report added 28 September 2026.</p>"),
    ],
    "build_aia_pdf.py": [
        ('"edpb-edps": "EDPB / EDPS",', '"edpb-edps": "EDPB / EDPS", "national-dpa": "national DPA",'),
        ("the EDPB and EDPS positions including Opinion 28/2024 on AI models,",
         "the EDPB and EDPS positions including Opinion 28/2024 on AI models, a national data protection authority\\'s report on supervising AI,"),
        ("%d documents around the Act as of %s, grouped by kind",
         "%d documents around the Act as of %s, with one report added on 28 September 2026, grouped by kind"),
    ],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (f, a)
        s = s.replace(a, b)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)

print("items_corpus.json: %d documents" % len(C))
