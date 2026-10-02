# -*- coding: utf-8 -*-
"""Builds the GDPR enforcement study guide (Markdown and PDF) from the same verified data
as gdpr-enforcement.html. Usage: python3 build_study_guide.py
Writes out/gdpr-enforcement-study-guide.md, .html and .pdf (PDF via Playwright Chromium)."""
import os, sys, json, subprocess, asyncio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_enforcement_page as P
from summary import ORDER, MODELS, PUBLIC, SUSP, S

OUT = P.OUT
EM = chr(0x2014)
C, EU = P.C, P.EU


def cap(s):
    return P.cap(s)


def md_escape_cell(s):
    return str(s).replace("|", "/").replace("\n", " ")


def table(heads, rows):
    out = ["| " + " | ".join(heads) + " |", "|" + "---|" * len(heads)]
    for r in rows:
        out.append("| " + " | ".join(md_escape_cell(x) for x in r) + " |")
    return "\n".join(out)


def group(pred):
    return ", ".join(C[c]["country"] + (" (non-GDPR)" if C[c]["membership"].startswith("non") else "") for c in ORDER if pred(c))


QUIZ = [
    ("Who imposes a GDPR fine in most EEA countries?", "The data protection authority itself, by administrative decision (Art. 58(2)(i), Art. 83). A court is involved only if the decision is challenged."),
    ("Name the two countries Recital 151 deals with, and how each fines.", "Denmark: the authority reports to the police, the prosecution charges, and a district court imposes the fine. Estonia: the authority fines through misdemeanour proceedings, challenged in the county court."),
    ("What is special about a fine from the Irish DPC?", "It is not payable until a court confirms it. If there is no appeal within 28 days the DPC must apply to the Circuit Court for confirmation (s.143 Data Protection Act 2018); appeals go to the Circuit Court up to EUR 75,000, otherwise the High Court."),
    ("Does a complainant receive any part of the fine?", "No. Fines go to the state (in Portugal 40 percent goes to the authority). Money for the person comes only from a compensation claim under Art. 82."),
    ("Can a person complain to the authority and sue in court at the same time?", "Yes. C-132/21 Nemzeti: Art. 77/78 and Art. 79 remedies are concurrent and independent. C-414/24: an authority cannot reject a complaint only because court proceedings were brought."),
    ("What can a complainant do if the authority does nothing?", "Go to court under Art. 78(2) if the authority does not handle the complaint or report back within three months. Some countries add their own route, for example Ireland s.150(7) and Sweden since May 2025."),
    ("Which authority leads in a cross-border case?", "The authority of the main establishment of the controller or processor (Art. 56(1)). The complainant's own authority becomes a concerned authority."),
    ("What happens when a concerned authority objects and the lead authority disagrees?", "The EDPB adopts a binding decision under Art. 65, and the lead authority adopts its final decision within one month. That decision can now be challenged at the EU General Court (C-97/23 P, 10 February 2026)."),
    ("What is Regulation (EU) 2025/2518 and when does it bite?", "The GDPR Procedural Regulation, harmonising the cross-border procedure (admissibility, right to be heard, access to file, deadlines). In force 1 January 2026; it applies to complaints lodged and investigations opened more than 15 months later, so from about 2 April 2027."),
    ("What deadline does the Procedural Regulation set for a lead authority's draft decision?", "15 months from confirming competence, extendable once by up to 12 months; 12 months under the simple cooperation procedure (Art. 12 Regulation (EU) 2025/2518)."),
    ("Is an authority obliged to fine every infringement it finds?", "No. It must act to remedy the infringement but chooses the measure; a fine is not compulsory where it is not appropriate, necessary or proportionate (C-768/21 Land Hessen)."),
    ("Can a company be fined without proof of fault?", "No. A fine requires an intentional or negligent infringement, but national law cannot require that a specific manager be identified (C-807/21 Deutsche Wohnen, C-683/21)."),
    ("Whose turnover sets the cap?", "That of the whole undertaking in the competition-law sense, including the parent group (C-383/23 ILVA)."),
    ("Name four countries where public bodies cannot be fined at all.", "Any four of: " + group(lambda c: S[c][1] == "no" and C[c]["membership"] != "non-GDPR (contrast)") + "."),
    ("Name four countries that fine public bodies but with a national cap.", "Any four of: " + group(lambda c: S[c][1] == "capped") + "."),
    ("In which two countries is the supreme administrative court both the first and the last instance for a fine?", "France (Conseil d'État) and Greece (Council of State)."),
    ("Which kind of court hears an appeal against a Garante fine in Italy?", "The ordinary civil court, the Tribunale, within 30 days (60 if abroad); then only the Corte di Cassazione."),
    ("Where does a company appeal an AEPD fine, and how can it reduce the fine before that?", "Before the Audiencia Nacional (after an optional reposición); acknowledging liability and paying voluntarily each earn at least 20 percent off the proposed fine, conditional on waiving an administrative appeal."),
    ("Does an infringement on its own give a right to compensation?", "No. Damage and causation must be shown (C-300/21), though there is no seriousness threshold (C-456/22) and proven fear of misuse can count (C-340/21)."),
    ("How does Switzerland differ?", "It is outside the GDPR. Under the revised FADP the FDPIC cannot fine; fines up to CHF 250,000 are criminal, imposed by cantonal authorities on the responsible individuals for wilful breaches."),
]


def build_md():
    L = []
    L.append("# GDPR enforcement in Europe: study guide")
    L.append("")
    L.append("How a complaint becomes a fine, where the courts come in, and the route in each EU and EEA country, with the United Kingdom and Switzerland for contrast. Researched on %s from national laws, authority websites and court reports, then checked by an independent pass against the cited sources. *Not confirmed* means no source was found either way. This maps procedure; it is not legal advice." % P.CHECKED)
    L.append("")
    L.append("Companion web page: https://www.simeonatanasov.com/gdpr-enforcement.html")
    L.append("")
    L.append("## How to use this guide")
    L.append("")
    L.append("1. Read Part 1 until you can draw the two tracks from memory. Everything else hangs off it.")
    L.append("2. Learn the four fining models and the exceptions in Part 6 (memory aids), because exam and interview questions go straight to the exceptions.")
    L.append("3. Use Part 7 as reference, country by country, and test yourself with Part 9.")
    L.append("")
    L.append("## Part 1. The core idea: two tracks")
    L.append("")
    L.append("**Track 1, the authority.** Ends in a fine paid to the state.")
    L.append("")
    for i, (t, x) in enumerate([
        ("Something starts it", "A complaint (Art. 77) or the authority's own initiative: breach notification, press, sector audit."),
        ("The authority investigates", "Art. 58(1) powers. In cross-border cases the lead authority runs it."),
        ("The authority decides", "Findings, orders and, where it chooses, a fine (Art. 58(2), Art. 83). An administrative decision, not a judgment."),
        ("Someone may appeal", "The organisation or the complainant goes to a national court (Art. 78). Only now is a court involved."),
        ("The court may ask Luxembourg", "Preliminary reference to the CJEU (Art. 267 TFEU); EFTA Court advisory opinion for Norway, Iceland, Liechtenstein."),
    ], 1):
        L.append("%d. **%s.** %s" % (i, t, x))
    L.append("")
    L.append("**Track 2, the court directly.** Ends in compensation paid to the person.")
    L.append("")
    for i, (t, x) in enumerate([
        ("A person or a representative body", "Acts with or without a complaint to the authority (Art. 79, Art. 80)."),
        ("Sues the organisation", "Civil, sometimes administrative, court where the organisation is established or where the person lives (Art. 79(2))."),
        ("The court rules", "Compensation (Art. 82) and orders. Never a fine."),
    ], 1):
        L.append("%d. **%s.** %s" % (i, t, x))
    L.append("")
    L.append("```")
    L.append("Complaint or own initiative")
    L.append("        |")
    L.append("Authority investigates  (lead authority + EDPB if cross-border)")
    L.append("        |")
    L.append("Decision + fine         <- the administrative phase ends here")
    L.append("        |")
    L.append("Appeal to national court (Art. 78)  ->  possible CJEU reference")
    L.append("")
    L.append("In parallel, at any time:")
    L.append("Person -> court -> damages / orders (Art. 79, 82), never a fine")
    L.append("```")
    L.append("")
    L.append("The tracks are independent and can run together (C-132/21). In practice they feed each other: a final infringement decision is strong evidence in a damages claim.")
    L.append("")
    L.append("### Seven questions people actually ask")
    L.append("")
    L.append(table(["Question", "Answer", "Basis"], P.TRACK_TABLE))
    L.append("")
    L.append("## Part 2. From complaint to fine: the authority track")
    L.append("")
    for i, (t, x) in enumerate(P.STEPS, 1):
        L.append("%d. **%s.** %s" % (i, t, x))
    L.append("")
    L.append("### Deadlines some authorities work to")
    L.append("")
    L.append(table(["Where", "Deadline", "Basis"], P.DEADLINES))
    L.append("")
    L.append("## Part 3. Cross-border cases: the one-stop-shop")
    L.append("")
    for i, (t, x) in enumerate([
        ("Complaint to the local authority", "In the person's own language."),
        ("Lead authority takes the case", "Main establishment (Art. 56(1)); the local authority becomes concerned."),
        ("Draft decision circulated", "To every concerned authority (Art. 60(3))."),
        ("Objections", "Four weeks for a relevant and reasoned objection (Art. 60(4))."),
        ("EDPB settles disputes", "Binding decision by two-thirds majority (Art. 65)."),
        ("Final decision", "Within one month of a binding decision; a rejection is notified by the complainant's authority (Art. 60(8), Art. 65(6))."),
        ("Courts", "In the lead authority's country; the EDPB decision itself at the EU General Court (C-97/23 P)."),
    ], 1):
        L.append("%d. **%s.** %s" % (i, t, x))
    L.append("")
    L.append("### EDPB binding decisions that changed outcomes")
    L.append("")
    L.append(table(["Decision", "Year", "Effect"], [(b["title"], b["year"], cap(b["effect"])) for b in EU["edpb_binding"]]))
    L.append("")
    pr = EU["procedural_regulation"]
    L.append("### The GDPR Procedural Regulation")
    L.append("")
    L.append("%s. Published %s; in force %s. %s" % (pr["citation"], pr["published"], pr["in_force"], cap(pr["applies_from"])))
    L.append("")
    for x in pr["changes"]:
        L.append("- " + cap(x))
    L.append("")
    L.append("## Part 4. Where the courts come in")
    L.append("")
    L.append("There is no GDPR court. The authority's decision ends the administrative phase; each party then has a deadline to go to the court national law names.")
    L.append("")
    L.append(table(["Who", "Against what", "Where", "Basis"], P.COURTS))
    L.append("")
    L.append("## Part 5. Suing the organisation directly")
    L.append("")
    L.append("Art. 79 gives an action against the controller or processor without a prior complaint; Art. 82 gives compensation for material or non-material damage; Art. 80 lets a not-for-profit body act for people, and without a mandate where national law allows. The Representative Actions Directive (EU) 2020/1828 lists the GDPR in Annex I, so qualified entities can bring collective actions for GDPR breaches under the national transposition (deadline 25 December 2022, applying from 25 June 2023).")
    L.append("")
    L.append(table(["Principle", "What it means", "Case"], P.DAMAGES))
    L.append("")
    L.append("## Part 6. Comparison and memory aids")
    L.append("")
    rows = []
    for c in ORDER:
        d = C[c]
        m, p, s_, first, _ = S[c]
        abbr = d["dpa"].get("abbr") or ""
        abbr = "" if abbr.lower().startswith("not confirmed") else abbr.split("(")[0].split(";")[0].strip()
        rows.append((d["country"], abbr or d["dpa"]["name_en"], MODELS[m][0], first, PUBLIC[p][0], SUSP[s_][0]))
    L.append(table(["Country", "Authority", "Who fines", "First court for a fine", "Public bodies fined?", "Appeal holds payment?"], rows))
    L.append("")
    L.append("**Memory aids.** These compress the country text; check it before relying on one.")
    L.append("")
    for k, (lbl, _, _) in MODELS.items():
        L.append("- **%s:** %s." % (lbl, group(lambda c, k=k: S[c][0] == k)))
    for k in ["no", "capped", "partly"]:
        L.append("- **Public bodies, %s:** %s." % (PUBLIC[k][0].lower(), group(lambda c, k=k: S[c][1] == k)))
    L.append("- **One court level only:** France (Conseil d'État), Greece (Council of State).")
    L.append("- **Internal review before court:** Netherlands (objection to the AP), Czechia and Slovakia (rozklad to the President), Latvia (DVI director), Norway (Privacy Appeals Board), Liechtenstein (Complaints Commission), Spain (optional reposición).")
    L.append("- **Shortest appeal windows:** Slovenia 8 days (minor offence), Germany two weeks (objection), Bulgaria 14 days (complaint decisions), Estonia and Romania 15 days.")
    L.append("")
    L.append("## Part 7. Country by country")
    L.append("")
    for c in ORDER:
        d = C[c]
        m, p, s_, first, route = S[c]
        L.append("### %s" % d["country"])
        L.append("")
        L.append("*%s.* %s" % ("Not under the GDPR, shown for contrast" if d["membership"].startswith("non") else d["membership"] + " member", cap(d["plain"])))
        L.append("")
        L.append("**Route of a fine:** " + " -> ".join(route))
        L.append("")
        dpa = d["dpa"]
        L.append("- **Authority:** %s (%s). %s" % (dpa["name_en"], dpa["name_native"], cap(dpa.get("structure"))))
        if dpa.get("regional") and not dpa["regional"].lower().startswith("no"):
            L.append("- **Regional authorities:** " + cap(dpa["regional"]))
        L.append("- **Law:** " + d["law"]["name"])
        L.append("- **Complaint:** %s %s" % (cap(d["complaint"].get("how")), cap(d["complaint"].get("deadlines"))))
        L.append("- **Contact the organisation first?** " + cap(d["complaint"].get("contact_controller_first")))
        L.append("- **Who decides:** " + cap(d["procedure"].get("decision_maker")))
        L.append("- **Limitation:** " + cap(d["procedure"].get("limitation")))
        L.append("- **Who fines:** " + cap(d["fines"].get("imposed_by")))
        L.append("- **Public bodies:** " + cap(d["fines"].get("public_bodies")))
        if d["fines"].get("quirks"):
            L.append("- **National specifics:** " + cap(d["fines"]["quirks"]))
        L.append("- **Appeal:** %s Deadline: %s Payment: %s" % (cap(d["appeal"].get("court")), cap(d["appeal"].get("deadline")), cap(d["appeal"].get("suspensive"))))
        L.append("- **Further appeal:** " + cap(d["appeal"].get("further")))
        L.append("- **If the authority does nothing:** " + cap(d["appeal"].get("inaction")))
        L.append("- **Suing directly:** %s %s" % (cap(d["private"].get("courts")), cap(d["private"].get("collective"))))
        for cs in d.get("cases", []):
            L.append("- **Case: %s (%s).** %s" % (cs.get("title"), cs.get("year"), cap(cs.get("summary"))))
        for q in d.get("quirks", []):
            if q:
                L.append("- " + cap(q))
        L.append("")
    L.append("## Part 8. CJEU judgments that shape enforcement")
    L.append("")
    L.append(table(["Case", "Date", "Name", "What it settled"], [(x["case"], x["date"], x["name"], cap(x["holding"])) for x in EU["cjeu"]]))
    L.append("")
    L.append("### The numbers")
    L.append("")
    for s_ in EU["stats"]:
        L.append("- %s (%s)" % (cap(s_["figure"]), s_["source"]))
    L.append("")
    L.append("## Part 9. Test yourself")
    L.append("")
    for i, (q, a) in enumerate(QUIZ, 1):
        L.append("**%d. %s**" % (i, q))
        L.append("")
        L.append("> " + a)
        L.append("")
    L.append("## Part 10. Method and limits")
    L.append("")
    L.append("- Each country was researched from its implementing act, the authority's pages and published decisions; law firm and press sources were used to locate facts. A second, independent pass re-read the cited sources and corrected %d points." % P.CORRECTIONS)
    L.append("- Several official law portals refuse automated reading, so some article numbers rest on consolidated copies or translations.")
    L.append("- Appeal deadlines and suspensive effect are the least certain fields, because many countries set them in general administrative procedure law.")
    L.append("- Court cases move. Everything after %s is not reflected. The web page carries the source list for every country." % P.CHECKED)
    L.append("")
    s = link_md("\n".join(L))
    assert EM not in s
    return s


def link_md(text):
    """Link legal references the same way the web page does. The context follows the part:
    overview and EU parts read a bare article as GDPR, the Procedural Regulation bullets as
    Regulation 2025/2518, and the comparison and country parts link only named instruments."""
    from refs import linkify
    ctx, in_code, out = None, False, []
    for line in text.split("\n"):
        if line.startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        if line.startswith("## Part "):
            n = int(line.split()[2].rstrip("."))
            ctx = "card" if n in (6, 7) else (None if n == 10 else "gdpr")
        elif line.startswith("### The GDPR Procedural Regulation"):
            ctx = "pr"
        elif line.startswith("## Part 4") or (line.startswith("## ") and ctx == "pr"):
            ctx = "gdpr"
        if in_code or ctx is None or line.startswith("#") or line.startswith("Companion web page"):
            out.append(line)
        else:
            out.append(linkify(line, ctx, "md", P.NATIONAL))
    return "\n".join(out)


CSS = """
@page { size: A4; }
body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 9.6pt; line-height: 1.45; color: #1d2433; }
h1 { font-size: 21pt; color: #2a3860; border-bottom: 3px solid #4f8fd6; padding-bottom: 6px; margin-top: 0; }
h2 { font-size: 14.5pt; color: #2a3860; margin-top: 22px; border-bottom: 1px solid #c9d3e6; padding-bottom: 3px; page-break-after: avoid; }
h2:nth-of-type(n+3) { page-break-before: always; }
h3 { font-size: 11.5pt; color: #2a3860; margin: 16px 0 6px 0; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px 0; font-size: 8.3pt; page-break-inside: auto; }
th, td { border: 1px solid #c9d3e6; padding: 4px 5px; text-align: left; vertical-align: top; }
thead th { background: #2a3860; color: #fff; }
tr { page-break-inside: avoid; }
tbody tr:nth-child(even) td { background: #f3f6fb; }
pre { background: #f3f6fb; border-left: 3px solid #4f8fd6; padding: 8px 10px; font-size: 8.5pt; }
blockquote { margin: 4px 0 12px 0; padding: 6px 10px; background: #eef6f2; border-left: 3px solid #199e70; }
blockquote p { margin: 0; }
ul, ol { padding-left: 18px; }
li { margin-bottom: 3px; }
h3 + p em:first-child { color: #4a5570; }
"""


async def pdf(html_path, pdf_path):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto("file://" + html_path)
        await pg.pdf(path=pdf_path, format="A4", print_background=True,
                     margin={"top": "16mm", "bottom": "18mm", "left": "15mm", "right": "15mm"},
                     display_header_footer=True, header_template="<span></span>",
                     footer_template='<div style="font-size:8px;width:100%;text-align:center;color:#777">GDPR enforcement in Europe: study guide, ' + P.CHECKED + ' <span style="float:right;margin-right:15mm" class="pageNumber"></span></div>')
        await b.close()


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    md = build_md()
    mdp = os.path.join(OUT, "gdpr-enforcement-study-guide.md")
    open(mdp, "w", encoding="utf-8", newline="\n").write(md)
    htmlp = os.path.join(OUT, "gdpr-enforcement-study-guide.html")
    body = subprocess.run(["pandoc", "-f", "gfm", "-t", "html5", mdp], capture_output=True, text=True, check=True).stdout
    open(htmlp, "w", encoding="utf-8").write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GDPR enforcement in Europe: study guide</title><style>%s</style></head><body>%s</body></html>' % (CSS, body))
    pdfp = os.path.join(OUT, "gdpr-enforcement-study-guide.pdf")
    asyncio.run(pdf(htmlp, pdfp))
    print(mdp, len(md.encode("utf-8")), "bytes;", pdfp, os.path.getsize(pdfp), "bytes")
