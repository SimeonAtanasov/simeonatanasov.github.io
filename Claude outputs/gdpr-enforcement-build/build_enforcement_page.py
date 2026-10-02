# -*- coding: utf-8 -*-
"""Builds gdpr-enforcement.html from the verified country research.

Inputs (same folder): data/*.json (one per country plus eu.json), summary.py.
Outputs: out/gdpr-enforcement.html, out/pages/gdpr-enforcement/enforcement.css,
out/pages/gdpr-enforcement/enforcement.js.
Usage: python3 build_enforcement_page.py"""
import json, os, re, html, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from summary import ORDER, MODELS, PUBLIC, SUSP, S, GRID

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
OUT = os.path.join(HERE, "out")
CHECKED = "2 October 2026"
EM = chr(0x2014)

C = {c: json.load(open(os.path.join(DATA, c + ".json"), encoding="utf-8")) for c in ORDER}
EU = json.load(open(os.path.join(DATA, "eu.json"), encoding="utf-8"))


def e(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def cap(s):
    s = str(s or "").strip()
    return s[:1].upper() + s[1:] if s else s


def para(s):
    return e(cap(s))


def link(url, text):
    return '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>' % (e(url), e(text))


def conf_level(s):
    s = (s or "").lower()
    for lvl in ["medium-high", "medium high", "low to medium", "medium-low", "high", "medium", "low"]:
        if s.startswith(lvl):
            return lvl.replace(" ", "-")
    return "medium"


# --------------------------------------------------------------------- pieces ---

def flow(nodes, cls=""):
    out = ['<ol class="ge-flow %s">' % cls]
    for i, (title, sub) in enumerate(nodes):
        out.append('<li class="ge-node"><span class="ge-node-n">%d</span><strong>%s</strong>%s</li>'
                   % (i + 1, title, ('<span>%s</span>' % sub) if sub else ""))
    out.append("</ol>")
    return "".join(out)


def route(code):
    steps = S[code][4]
    return ('<ol class="ge-route" aria-label="Route of a fine">' +
            "".join('<li><span>%s</span></li>' % e(x) for x in steps) + "</ol>")


def chip(table, key, prefix, show=False):
    label, bg, fg = table[key]
    text = (prefix + ": " + label) if show else label
    return '<span class="ge-chip" style="background:%s;color:%s" title="%s">%s</span>' % (bg, fg, e(prefix), e(text))


def tile_map():
    tw, gap = 52, 6
    cols = max(x for x, _ in GRID.values()) + 1
    rows = max(y for _, y in GRID.values()) + 1
    W, H = cols * (tw + gap), rows * (tw + gap)
    parts = ['<svg class="ge-tiles" viewBox="0 0 %d %d" role="img" aria-labelledby="ge-tiles-t">' % (W, H),
             '<title id="ge-tiles-t">Tile map of the 30 EEA countries plus the United Kingdom and Switzerland, coloured by the selected question</title>']
    for code in ORDER:
        x, y = GRID[code]
        m, p, s_ = S[code][0], S[code][1], S[code][2]
        name = C[code]["country"]
        parts.append(
            '<a href="#ge-c-%s" class="ge-tile" data-code="%s" data-model="%s" data-public="%s" data-susp="%s" '
            'aria-label="%s"><rect x="%d" y="%d" width="%d" height="%d" rx="7" fill="%s"></rect>'
            '<text x="%d" y="%d" fill="%s">%s</text></a>'
            % (code, code, m, p, s_, e(name), x * (tw + gap), y * (tw + gap), tw, tw, MODELS[m][1],
               x * (tw + gap) + tw // 2, y * (tw + gap) + tw // 2 + 6, MODELS[m][2], code.upper()))
    parts.append("</svg>")
    return "".join(parts)


def legend(table, key):
    return ('<ul class="ge-legend" data-view="%s">' % key +
            "".join('<li><i style="background:%s"></i>%s</li>' % (bg, e(lbl)) for _, (lbl, bg, fg) in table.items()) +
            "</ul>")


def dl(rows):
    out = ['<dl class="ge-dl">']
    for k, v in rows:
        if v is None or v == "":
            continue
        out.append("<dt>%s</dt><dd>%s</dd>" % (e(k), v))
    out.append("</dl>")
    return "".join(out)


def country_card(code):
    d = C[code]
    m, p, s_, first, _ = S[code]
    dpa, law, comp, proc, fines, app, priv = d["dpa"], d["law"], d["complaint"], d["procedure"], d["fines"], d["appeal"], d["private"]
    contrast = d["membership"].startswith("non-GDPR")
    mem = "Not under the GDPR, shown for contrast" if contrast else ("EEA member, GDPR applies through the EEA Agreement" if d["membership"] == "EEA" else "EU member state")
    abbr = dpa.get("abbr") or ""
    if abbr.lower().startswith("not confirmed"):
        abbr = ""
    head_abbr = abbr.split("(")[0].split(";")[0].strip() if abbr else ""
    stages = "".join("<li>%s</li>" % para(x) for x in proc.get("stages", []))
    cases = "".join(
        '<li><strong>%s</strong> <span class="ge-year">%s</span><br>%s%s</li>'
        % (e(c.get("title")), e(c.get("year")), para(c.get("summary")),
           (" " + link(c["url"], "Source")) if c.get("url", "").startswith("http") else "")
        for c in d.get("cases", []))
    quirks = "".join("<li>%s</li>" % para(q) for q in d.get("quirks", []) if q)
    srcs = "".join("<li>%s%s</li>" % (link(s_["url"], s_.get("title") or s_["url"]),
                                     ' <span class="ge-src">secondary</span>' if s_.get("source_type") == "secondary" else "")
                   for s_ in d.get("sources", []) if s_.get("url", "").startswith("http"))
    authority = "%s (%s%s)" % (e(dpa.get("name_en")), e(dpa.get("name_native")), (", " + e(abbr)) if abbr else "")
    if dpa.get("url", "").startswith("http"):
        authority += " " + link(dpa["url"], "Website")
    law_html = e(law.get("name"))
    if law.get("url", "").startswith("http"):
        law_html += " " + link(law["url"], "Text")
    lvl = conf_level(d.get("confidence"))
    body = [
        '<div class="ge-plain"><h4>In plain words</h4><p>%s</p></div>' % para(d.get("plain")),
        '<h4>Route of a fine</h4>' + route(code),
        '<div class="ge-chips">%s%s%s</div>' % (
            chip(MODELS, m, "Who fines"), chip(PUBLIC, p, "Public bodies fined", True), chip(SUSP, s_, "Payment during appeal", True)),
        '<div class="ge-grid">',
        '<section><h4>The authority</h4>' + dl([("Name", authority), ("How it is organised", para(dpa.get("structure"))),
                                                ("Regional authorities", para(dpa.get("regional"))), ("National law", law_html)]) + "</section>",
        '<section><h4>Complaining</h4>' + dl([("How", para(comp.get("how"))),
                                              ("Contact the organisation first?", para(comp.get("contact_controller_first"))),
                                              ("Deadlines", para(comp.get("deadlines"))),
                                              ("The complainant's position", para(comp.get("complainant_status")))]) + "</section>",
        '<section><h4>Procedure</h4>' + ('<ol class="ge-stages">%s</ol>' % stages if stages else "") +
        dl([("Who decides", para(proc.get("decision_maker"))), ("Limitation", para(proc.get("limitation")))]) + "</section>",
        '<section><h4>Fines</h4>' + dl([("Who imposes them", para(fines.get("imposed_by"))),
                                        ("Public bodies", para(fines.get("public_bodies"))),
                                        ("National specifics", para(fines.get("quirks")))]) + "</section>",
        '<section><h4>Appeals</h4>' + dl([("First court", para(app.get("court"))), ("Deadline", para(app.get("deadline"))),
                                          ("Does it hold payment?", para(app.get("suspensive"))),
                                          ("Further appeal", para(app.get("further"))),
                                          ("If the authority does nothing", para(app.get("inaction")))]) + "</section>",
        '<section><h4>Suing the organisation directly</h4>' + dl([("Courts", para(priv.get("courts"))),
                                                                  ("Compensation", para(priv.get("damages"))),
                                                                  ("Collective actions", para(priv.get("collective")))]) + "</section>",
        "</div>",
        ('<h4>Cases worth knowing</h4><ul class="ge-cases">%s</ul>' % cases) if cases else "",
        ('<h4>Worth knowing</h4><ul class="ge-quirks">%s</ul>' % quirks) if quirks else "",
        '<details class="ge-sources"><summary>Sources (%d) <span class="ge-conf ge-conf-%s">research confidence: %s</span></summary><ul>%s</ul></details>'
        % (srcs.count("<li>"), lvl, lvl.replace("-", " "), srcs),
    ]
    search = " ".join([d["country"], dpa.get("name_en", ""), dpa.get("name_native", ""), abbr, law.get("name", "")]).lower()
    return ('<details class="ge-country" id="ge-c-%s" data-mem="%s" data-model="%s" data-search="%s">'
            '<summary><span class="ge-cname">%s</span><span class="ge-cabbr">%s</span><span class="ge-cmem">%s</span>'
            '<span class="ge-cdots"><i style="background:%s" title="%s"></i><i style="background:%s" title="Public bodies: %s"></i><i style="background:%s" title="Payment during appeal: %s"></i></span></summary>'
            '<div class="ge-cbody">%s</div></details>'
            % (code, "contrast" if contrast else d["membership"].lower(), m, e(search),
               e(d["country"]), e(head_abbr), e(mem),
               MODELS[m][1], e(MODELS[m][0]), PUBLIC[p][1], e(PUBLIC[p][0]), SUSP[s_][1], e(SUSP[s_][0]),
               "".join(body)))


def compare_table():
    rows = []
    for code in ORDER:
        d = C[code]
        m, p, s_, first, _ = S[code]
        abbr = (d["dpa"].get("abbr") or "")
        abbr = "" if abbr.lower().startswith("not confirmed") else abbr.split("(")[0].split(";")[0].strip()
        rows.append('<tr data-mem="%s"><th scope="row"><a href="#ge-c-%s">%s</a></th><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                    % ("contrast" if d["membership"].startswith("non") else d["membership"].lower(), code, e(d["country"]),
                       e(abbr or d["dpa"].get("name_en")), chip(MODELS, m, "Who fines"), e(first),
                       chip(PUBLIC, p, "Public bodies"), chip(SUSP, s_, "Payment during appeal")))
    return ('<div class="ge-tablewrap"><table class="ge-table ge-compare"><thead><tr><th scope="col">Country</th><th scope="col">Authority</th>'
            '<th scope="col">Who fines</th><th scope="col">First court for a fine</th><th scope="col">Public bodies fined?</th>'
            '<th scope="col">Appeal holds payment?</th></tr></thead><tbody>%s</tbody></table></div>' % "".join(rows))


def cjeu_table():
    rows = []
    for c in EU["cjeu"]:
        rows.append('<tr><th scope="row">%s<br><span class="ge-year">%s</span></th><td><strong>%s</strong><br>%s</td><td>%s</td></tr>'
                    % (e(c["case"]), e(c["date"]), e(c["name"]), para(c["holding"]),
                       link(c["url"], "Judgment") if c.get("url", "").startswith("http") else ""))
    return ('<div class="ge-tablewrap"><table class="ge-table"><thead><tr><th scope="col">Case</th><th scope="col">What it settled</th>'
            '<th scope="col">Text</th></tr></thead><tbody>%s</tbody></table></div>' % "".join(rows))


def edpb_table():
    rows = []
    for b in EU["edpb_binding"]:
        rows.append("<tr><th scope=\"row\">%s</th><td>%s</td><td>%s</td><td>%s</td></tr>"
                    % (e(b["title"]), e(b["year"]), para(b["effect"]),
                       link(b["url"], "Decision") if b.get("url", "").startswith("http") else ""))
    return ('<div class="ge-tablewrap"><table class="ge-table"><thead><tr><th scope="col">Binding decision</th><th scope="col">Year</th>'
            '<th scope="col">Effect on the outcome</th><th scope="col">Text</th></tr></thead><tbody>%s</tbody></table></div>' % "".join(rows))


# ----------------------------------------------------------------------- page ---

PR = EU["procedural_regulation"]
GDPR = "https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng"

SHORT = flow([
    ("Something starts it", "A complaint from a person (Art. 77), or the authority's own initiative: a breach notification, a press story, a sector audit."),
    ("The authority investigates", "Requests for information, inspections, audits (Art. 58(1)). In cross-border cases the lead authority runs it."),
    ("The authority decides", "Findings, corrective orders and, where it chooses, a fine (Art. 58(2), Art. 83). This is an administrative decision, not a judgment."),
    ("Someone may appeal", "The organisation, or the complainant, takes the decision to a national court (Art. 78). Only now is a court involved."),
    ("The court may ask Luxembourg", "A national court unsure how the GDPR should be read refers a question to the CJEU (Art. 267 TFEU). The answer binds every court in the EU."),
], "ge-flow-public") + flow([
    ("A person or a representative body", "Acts on its own, with or without a complaint to the authority (Art. 79, Art. 80)."),
    ("Sues the organisation", "In a civil, sometimes administrative, court where the organisation is established or where the person lives (Art. 79(2))."),
    ("The court rules", "Compensation for material or non-material damage (Art. 82), orders to stop or comply. Never a fine."),
], "ge-flow-private")

TRACK_TABLE = [
    ("Who imposes a GDPR fine?", "The data protection authority, by administrative decision. Two exceptions: in Denmark a court imposes it on a police report from the authority; in Estonia the authority fines through misdemeanour proceedings. In Ireland the authority decides but a court must confirm the fine before it is payable.", "Art. 58(2)(i), Art. 83, Recital 151"),
    ("Does there have to be a complaint?", "No. Authorities open cases on their own initiative, from breach notifications, press reports and sector sweeps. A complaint is one trigger among several.", "Art. 57(1)(h), Art. 58(1)"),
    ("Does the complainant receive the fine?", "No. The fine goes to the state budget (in Portugal partly to the authority). A complainant who wants money has to sue for compensation.", "National law; Art. 82"),
    ("Is there a special court for GDPR complaints?", "No. Complaints go to the authority. Its decisions are challenged in the ordinary court system of that country: an administrative court in most, a civil or criminal court in some, a specialist tribunal in a few.", "Art. 78"),
    ("When does the court phase start?", "When the authority's decision is served and someone challenges it within the deadline, which runs from eight days (Slovenia) to three months (Luxembourg) across the countries below.", "National procedural law"),
    ("Can a court fine in a damages case?", "No. A civil court awards compensation and makes orders. Fining is the authority's power (or, in Denmark, the criminal court's).", "Art. 79, Art. 82, Art. 83"),
    ("Is the authority obliged to fine?", "No. It must act on an infringement it finds, but chooses the corrective measure. A fine also needs intent or negligence; there is no strict liability.", "C-768/21; C-807/21"),
]

STEPS = [
    ("The complaint", "Free of charge, usually through an online form, normally to the authority where the person lives or works or where the infringement happened. Several countries expect the person to have asked the organisation first, and Spain requires it for rights requests. The authority must tell the complainant how the complaint is progressing within three months, or the complainant can go to court (Art. 77(2), Art. 78(2))."),
    ("Admissibility and triage", "The authority checks the complaint falls within its remit and may pass it to the organisation for a response first (Spain gives the organisation a month). It may refuse a manifestly unfounded or excessive request, but a high number of complaints alone does not make them excessive (C-416/23). Many cases end here, settled or closed."),
    ("Investigation", "Requests for information, inspections and audits under Art. 58(1). Where the organisation has its main establishment in another country, the case goes to that country's authority as lead (see the next section)."),
    ("Findings and the right to be heard", "The organisation receives the findings and replies before any decision. In several countries a separate body inside the authority decides on sanctions: the restricted committee in France, the restricted formation in Luxembourg, the Litigation Chamber in Belgium, the Sanctions Board in Finland."),
    ("Decision", "Findings, corrective orders under Art. 58(2), and a fine where the authority judges it effective, proportionate and dissuasive, weighed on the Art. 83(2) criteria and set against the turnover of the whole undertaking (C-383/23). The cap is 2% or EUR 10 million, or 4% or EUR 20 million, whichever is higher."),
    ("Publication and payment", "Most authorities publish decisions, often anonymised. When the fine falls due is national law: in many countries payment waits for the appeal, in others it does not (see the map)."),
]

DEADLINES = [
    ("Spain", "Admissibility within 3 months; sanction procedure within 12 months of opening (raised from 9 by Ley 11/2023); preliminary investigation up to 18 months.", "Art. 64, 65, 67 LOPDGDD"),
    ("Italy", "9 months, extendable to 12, paused while EU cooperation runs.", "Art. 143 Codice"),
    ("Hungary", "150 days for a formal case; if missed, the authority pays the applicant HUF 10,000.", "Infotv. s.60/A"),
    ("Slovakia", "90 days, extendable by up to 180 days.", "Act 18/2018"),
    ("Cross-border cases (from 2027)", "Lead authority's draft decision within 15 months of confirming competence, extendable once by 12; 12 months in the simple procedure.", "Art. 12 Regulation (EU) 2025/2518"),
]

COURTS = [
    ("The fined organisation", "The authority's decision: the finding, the orders, the fine", "The national court that hears challenges to that authority (see the comparison)", "Art. 78(1)"),
    ("The complainant", "A decision rejecting the complaint or upholding only part of it. The court reviews it in full on the merits.", "The same court", "Art. 78(1); C-26/22 and C-64/22"),
    ("The complainant", "Inaction: the authority does not handle the complaint or report back within three months", "The same court; some countries have their own route (Ireland s.150(7), Sweden since May 2025, the UK First-tier Tribunal)", "Art. 78(2)"),
    ("The organisation or an authority", "An EDPB binding decision in a cross-border dispute", "The EU General Court", "Art. 263 TFEU; C-97/23 P, 10 February 2026"),
    ("Any national court", "A question about how the GDPR must be read", "The CJEU by preliminary reference; for Norway, Iceland and Liechtenstein, an advisory opinion from the EFTA Court", "Art. 267 TFEU"),
    ("The data subject", "The organisation itself, without going through the authority", "A civil (in some countries administrative) court where the organisation is established or where the person lives", "Art. 79(2)"),
]

DAMAGES = [
    ("No damage, no compensation", "An infringement alone does not give a right to compensation: damage and a causal link must be shown.", "C-300/21"),
    ("No seriousness threshold", "National rules cannot require non-material damage to reach a minimum level of seriousness.", "C-300/21; C-456/22"),
    ("Fear can count", "Fear of misuse of leaked data can be non-material damage, if the person proves it. A purely hypothetical risk is not enough.", "C-340/21; C-687/21; C-590/22"),
    ("Compensatory, not punitive", "Damages compensate in full but have no deterrent function, and the Art. 83 fining criteria do not apply to them.", "C-741/21; C-590/22"),
    ("Burden on the controller", "The controller must prove its security measures were appropriate; it cannot simply blame an employee.", "C-340/21; C-741/21"),
    ("Representative actions", "Member States may let consumer associations sue without a mandate from individuals, including for breaches of the duty to inform.", "C-319/20; C-757/22"),
]

RAIL = [("ge-short", "The short version"), ("ge-authority", "The authority track"), ("ge-cross", "Cross-border cases"),
        ("ge-courts", "Where the courts come in"), ("ge-private", "Suing directly"), ("ge-map", "The map"),
        ("ge-compare", "Comparison"), ("ge-countries", "Country by country"), ("ge-cjeu", "CJEU judgments"),
        ("ge-limits", "Method and limits")]


def rows3(items, heads):
    return ('<div class="ge-tablewrap"><table class="ge-table"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>'
            % ("".join('<th scope="col">%s</th>' % e(h) for h in heads),
               "".join("<tr><th scope=\"row\">%s</th>%s</tr>" % (e(r[0]), "".join("<td>%s</td>" % e(x) for x in r[1:])) for r in items)))


def stats():
    return '<ul class="ge-stats">' + "".join(
        "<li>%s <span class=\"ge-src\">%s</span></li>" % (para(s_["figure"]), link(s_["url"], s_["source"]))
        for s_ in EU["stats"]) + "</ul>"


def main_html():
    eu_n = sum(1 for c in ORDER if C[c]["membership"] == "EU")
    eea_n = sum(1 for c in ORDER if C[c]["membership"] == "EEA")
    assert (eu_n, eea_n) == (27, 3), (eu_n, eea_n)
    cards = "".join(country_card(c) for c in ORDER)
    pr_changes = "".join("<li>%s</li>" % para(x) for x in PR["changes"])
    out = []
    out.append('''<div class="ge">
<p class="ge-intro">A GDPR fine is not a court judgment. In almost every EEA country the data protection authority investigates, decides and fines in one administrative decision, and a court becomes involved only if someone challenges that decision. Separately, and at the same time if they choose, individuals can sue the organisation for compensation, but a court in that track never fines. This page sets out the two tracks, how cross-border cases move between authorities and the EDPB, and then the route in each of the %d EU and %d EEA countries, with the United Kingdom and Switzerland for contrast.</p>
<p class="ge-status">Researched on %s from national laws, authority websites and court reports, then checked a second time by an independent pass against the cited sources. Where a point could not be confirmed it says <em>not confirmed</em> rather than guessing. This maps procedure; it is not legal advice. Deadlines in particular should be read from the decision you are holding, which states its own appeal route.</p>
''' % (eu_n, eea_n, CHECKED))

    out.append('''<section class="ge-block" id="ge-short"><h2>The short version</h2>
<p class="ge-lead">Two tracks, one public and one private. They are independent: neither has to finish before the other starts, and the CJEU has confirmed a person can use both at once (C-132/21). National systems are expected to keep the outcomes consistent, nothing more.</p>
<div class="ge-tracks"><div class="ge-track ge-track-public"><h3>Track 1: the authority</h3><p>Ends in a fine, paid to the state.</p>%s</div>
<div class="ge-track ge-track-private"><h3>Track 2: the court, directly</h3><p>Ends in compensation, paid to the person.</p>%s</div></div>
<p class="ge-note">In practice the tracks feed each other. A final infringement decision from the authority is strong evidence in a damages claim, and a large published decision is often what starts a wave of claims.</p>
<h3>Seven questions people actually ask</h3>%s
</section>''' % (SHORT.split('</ol>')[0] + '</ol>', SHORT.split('</ol>', 1)[1], rows3(TRACK_TABLE, ["Question", "Answer", "Where it comes from"])))

    out.append('''<section class="ge-block" id="ge-authority"><h2>From complaint to fine: the authority track</h2>
<p class="ge-lead">The sequence below is common to every country, because the GDPR sets the powers and the safeguards. What varies is the procedure law wrapped around it, which is national, and that is what the country sections describe.</p>
<ol class="ge-steps">%s</ol>
<h3>Deadlines some authorities work to</h3>
<p class="ge-note">Most national laws set no binding deadline for deciding a complaint. These are the ones confirmed in the research, plus the EU rule coming for cross-border cases.</p>%s
</section>''' % ("".join('<li><strong>%s.</strong> %s</li>' % (e(t), e(x)) for t, x in STEPS),
                 rows3(DEADLINES, ["Where", "Deadline", "Basis"])))

    out.append('''<section class="ge-block" id="ge-cross"><h2>Cross-border cases: the one-stop-shop</h2>
<p class="ge-lead">When an organisation processes data in several Member States, or its processing substantially affects people in several, one authority leads: the one where it has its main establishment (Art. 56). This is why so many large technology fines come from Dublin and Luxembourg. The complainant still deals only with their own authority.</p>
%s
<p class="ge-note">The binding decision route is what turned several Irish draft decisions into much larger fines. The EDPB did not adopt any Art. 65 binding decision in 2024 or 2025, and adopted one in May 2026.</p>
%s
<div class="ge-box"><h3>The GDPR Procedural Regulation</h3>
<p>%s, published %s, in force %s. %s It harmonises the cross-border procedure only; purely domestic cases stay under national law.</p>
<ul>%s</ul>%s</div>
</section>''' % (flow([
        ("Complaint to the local authority", "The person complains at home, in their own language."),
        ("Lead authority takes the case", "The authority of the main establishment (Art. 56(1)). The local authority becomes a concerned authority."),
        ("Draft decision circulated", "The lead authority shares its draft with every concerned authority (Art. 60(3))."),
        ("Objections?", "Concerned authorities have four weeks to raise a relevant and reasoned objection (Art. 60(4))."),
        ("EDPB settles disputes", "If the lead authority will not follow an objection, the EDPB adopts a binding decision by two-thirds majority (Art. 65)."),
        ("Final decision", "The lead authority adopts it, within one month of a binding decision; the complainant's authority notifies a rejection (Art. 60(8), Art. 65(6))."),
        ("Courts", "The decision is challenged in the lead authority's country. An EDPB binding decision can be challenged at the EU General Court (C-97/23 P)."),
    ], "ge-flow-cross"), edpb_table(), e(PR["citation"]), e(PR["published"]), e(PR["in_force"]), e(cap(PR["applies_from"])),
        pr_changes, (" " + link(PR["url"], "Text on EUR-Lex")) if PR.get("url") else ""))

    out.append('''<section class="ge-block" id="ge-courts"><h2>Where the courts come in</h2>
<p class="ge-lead">There is no GDPR court. The authority's decision is the end of the administrative phase, and each party then has a deadline to take it to the court the national law names. The table shows who can go to court against what.</p>%s
<p class="ge-note">The court that hears an appeal against a fine is not always an administrative court. In Germany, Bulgaria, Estonia, Latvia and Slovenia fines are challenged in the courts that handle minor offences; in Italy, Iceland and Norway in the ordinary civil courts; in Belgium in the Market Court; in Malta and the United Kingdom in a specialist tribunal. France and Greece have a single level: the supreme administrative court hears the case first and last.</p>
</section>''' % rows3(COURTS, ["Who", "Against what", "Where", "Basis"]))

    out.append('''<section class="ge-block" id="ge-private"><h2>Suing the organisation directly</h2>
<p class="ge-lead">Art. 79 gives every data subject an action against the controller or processor in court, without needing a complaint to the authority first, and Art. 82 a right to compensation for material or non-material damage. Art. 80 lets a not-for-profit body act on a person's behalf, and Member States may let it act without a mandate. The Representative Actions Directive (EU) 2020/1828 lists the GDPR in its Annex I, so qualified entities can bring collective actions for GDPR breaches under the national transposition. The CJEU has built the compensation rules over a run of judgments since 2023:</p>%s
<p class="ge-note">How much a court awards is national law, and awards for non-material damage alone are usually modest. Each country section notes the courts and any collective action route.</p>
</section>''' % rows3(DAMAGES, ["Principle", "What it means", "Case"]))

    out.append('''<section class="ge-block" id="ge-map"><h2>The map: three questions across Europe</h2>
<p class="ge-lead">Choose a question. Each tile is a country; select one to jump to its section.</p>
<div class="ge-views" role="group" aria-label="Question shown on the map">
<button type="button" class="ge-btn is-on" data-view="model">Who fines, and who reviews it?</button>
<button type="button" class="ge-btn" data-view="public">Can public bodies be fined?</button>
<button type="button" class="ge-btn" data-view="susp">Does an appeal hold payment?</button></div>
<div class="ge-mapwrap" data-view="model">%s<div class="ge-legends">%s%s%s</div></div>
<p class="ge-note">The classification is a simplification of the country text below, which is the authority. <em>Not confirmed</em> means the research found no source either way, not that the answer is no. The United Kingdom and Switzerland are outside the GDPR: Switzerland fines individuals through the criminal courts, and its authority has no fining power at all.</p>
</section>''' % (tile_map(), legend(MODELS, "model"), legend(PUBLIC, "public"), legend(SUSP, "susp")))

    out.append('''<section class="ge-block" id="ge-compare"><h2>Comparison</h2>
<p class="ge-lead">One row per country. Select a country name for the full section.</p>%s</section>''' % compare_table())

    out.append('''<section class="ge-block" id="ge-countries"><h2>Country by country</h2>
<p class="ge-lead">Each section opens with the journey in plain words, then the detail a practitioner needs: the authority, the complaint, the procedure, the fine, the appeal, direct claims, cases that tested the system, and sources.</p>
<div class="ge-filters">
<input type="text" id="ge-q" placeholder="Search a country, authority or law" aria-label="Search countries" autocomplete="off">
<div class="ge-views" role="group" aria-label="Show">
<button type="button" class="ge-btn ge-mem is-on" data-mem="all">All</button>
<button type="button" class="ge-btn ge-mem" data-mem="eu">EU</button>
<button type="button" class="ge-btn ge-mem" data-mem="eea">EEA</button>
<button type="button" class="ge-btn ge-mem" data-mem="contrast">UK and Switzerland</button></div>
<div class="ge-views"><button type="button" class="ge-btn" id="ge-open">Expand all</button><button type="button" class="ge-btn" id="ge-close">Collapse all</button></div>
<p class="ge-count" id="ge-count" aria-live="polite"></p></div>
<div class="ge-countries">%s</div></section>''' % cards)

    out.append('''<section class="ge-block" id="ge-cjeu"><h2>CJEU judgments that shape enforcement</h2>
<p class="ge-lead">The Court of Justice does not hear complaints. It answers questions national courts send it, and those answers bind every court and authority in the EU. These are the ones that decide how the two tracks work.</p>%s
<h3>The numbers</h3>%s</section>''' % (cjeu_table(), stats()))

    out.append('''<section class="ge-block" id="ge-limits"><h2>Method and limits</h2>
<p class="ge-lead">Each country was researched from the national implementing act, the authority's own pages and published court decisions, with law firm and press sources used to locate facts and marked <em>secondary</em> in the source lists. A second, independent pass then re-read the cited sources and corrected %d points, from court outcomes that had moved on since the first reading to misread statute sections.</p>
<ul class="ge-quirks">
<li>Several official law portals refuse automated reading (Lovdata, Legifrance, Finlex, Riigi Teataja, several others), so some article numbers rest on consolidated copies or translations. The source lists say which.</li>
<li>Appeal deadlines and whether an appeal holds payment are the least certain fields, because many countries set them in general administrative procedure law rather than the data protection act. Where that is the basis, the text says so.</li>
<li>Court cases move. Every outcome is dated; anything after %s is not reflected.</li>
<li>The classifications on the map and in the comparison compress paragraphs into one label. Read the country section before relying on one.</li>
</ul>
<p class="ge-note">Related on this site: the <a href="gdpr-fines-analytics.html">GDPR Fines Analytics</a>, the <a href="power-bi.html">GDPR Fines Dashboard</a> and the <a href="gdpr-fine-calculator.html">GDPR Fine Calculator</a> for what the fines have been; the <a href="edpb-digest.html">EDPB Digest</a> for the binding decisions and guidelines cited here. The Regulation itself: %s.</p>
</section></div>''' % (CORRECTIONS, CHECKED, link(GDPR, "Regulation (EU) 2016/679 on EUR-Lex")))
    return "\n".join(out)


CORRECTIONS = int(os.environ.get("GE_CORRECTIONS", "90"))

HEADER = open(os.path.join(HERE, "header.html"), encoding="utf-8").read()
DESC = "How a GDPR complaint becomes a fine, where the courts come in, and the enforcement route in each of the 30 EEA countries, with the UK and Switzerland for contrast."


def page():
    rail = "".join('<a href="#%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>' % (i, i, e(t)) for i, t in RAIL)
    return '''<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Simeon Atanasov | GDPR Enforcement in Europe</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<meta name="description" content="%(desc)s">
		<link rel="stylesheet" href="pages/gdpr-enforcement/enforcement.css">
		<link rel="stylesheet" href="assets/css/main.css" />
		<link rel="stylesheet" href="assets/css/back-to-top.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		<link rel="canonical" href="https://www.simeonatanasov.com/gdpr-enforcement.html">
		<meta property="og:type" content="article">
		<meta property="og:site_name" content="Simeon Atanasov">
		<meta property="og:title" content="Simeon Atanasov | GDPR Enforcement in Europe">
		<meta property="og:description" content="%(desc)s">
		<meta property="og:url" content="https://www.simeonatanasov.com/gdpr-enforcement.html">
		<meta name="twitter:card" content="summary">
		<meta name="twitter:title" content="Simeon Atanasov | GDPR Enforcement in Europe">
		<meta name="twitter:description" content="%(desc)s">
		<script type="application/ld+json">
		{
		 "@context": "https://schema.org",
		 "@type": "Article",
		 "url": "https://www.simeonatanasov.com/gdpr-enforcement.html",
		 "headline": "GDPR enforcement in Europe",
		 "description": "%(desc)s",
		 "inLanguage": "en",
		 "dateModified": "2026-10-02",
		 "isPartOf": {"@id": "https://www.simeonatanasov.com/#website"},
		 "author": {"@id": "https://www.simeonatanasov.com/#person"}
		}
		</script>
		<!-- Progressive web app -->
		<link rel="manifest" href="/manifest.webmanifest" />
		<meta name="theme-color" content="#2a3860" />
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		<meta name="apple-mobile-web-app-title" content="S" />
		<link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png" />
		<script src="/assets/js/pwa.js" defer></script>
	</head>
	<body class="is-preload">
		<!-- Header -->
%(header)s

		<!-- Wrapper -->
			<div id="wrapper">
				<!-- Main -->
					<section id="main" class="wrapper">
						<div class="inner">
							<header>
								<h1 class="major">GDPR enforcement in Europe &#9878;&#65039;</h1>
							</header>
%(main)s
						</div>
					</section>
			</div>

		<nav class="ge-rail" id="ge-rail" aria-label="On this page">%(rail)s</nav>

		<!-- Footer -->
		<footer id="footer" class="wrapper style1-alt">
			<div class="inner">
				<ul class="menu">
					<li>&copy; Simeon. All rights reserved.</li>
					<li><a href="terms.html">Terms of use</a></li>
					<li><a href="privacy-notice.html">Privacy notice</a></li>
					<li><a href="cookie-notice.html">Cookie notice</a></li>
				</ul>
			</div>
		</footer>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/jquery.scrollex.min.js"></script>
			<script src="assets/js/jquery.scrolly.min.js"></script>
			<script src="assets/js/browser.min.js"></script>
			<script src="assets/js/breakpoints.min.js"></script>
			<script src="assets/js/util.js"></script>
			<script src="assets/js/main.js"></script>
			<script src="assets/js/back-to-top.js"></script>
			<script src="pages/gdpr-enforcement/enforcement.js"></script>
	</body>
</html>
''' % {"desc": e(DESC), "header": HEADER.rstrip("\n"), "main": main_html(), "rail": rail}


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "pages", "gdpr-enforcement"), exist_ok=True)
    s = page()
    assert EM not in s, "em dash in page"
    open(os.path.join(OUT, "gdpr-enforcement.html"), "w", encoding="utf-8", newline="\n").write(s)
    for name in ["enforcement.css", "enforcement.js"]:
        src = open(os.path.join(HERE, name), encoding="utf-8").read()
        assert EM not in src, name
        open(os.path.join(OUT, "pages", "gdpr-enforcement", name), "w", encoding="utf-8", newline="\n").write(src)
    print("gdpr-enforcement.html", len(s.encode("utf-8")), "bytes")
