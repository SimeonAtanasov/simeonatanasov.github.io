# -*- coding: utf-8 -*-
"""Builds privacy-enforcement-worldwide.html, the companion of gdpr-enforcement.html, from the
verified research in gdata/ and the hand fields in summary_world.py. Reuses the European page's
CSS, JS, card and tile-map code from build_enforcement_page.py.
Usage: python3 build_world_page.py   (writes out/privacy-enforcement-worldwide.html)"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_enforcement_page as P
import summary_world as W

HERE = P.HERE
GDATA = os.path.join(HERE, "gdata")
EM = chr(0x2014)
CHECKED = P.CHECKED
e, link, cap = P.e, P.link, P.cap

C = {c: json.load(open(os.path.join(GDATA, c + ".json"), encoding="utf-8")) for c in W.ORDER}
assert len(C) == 23

S = {}
for c in W.ORDER:
    mp = dict(C[c]["map"])
    mp.update(W.OVERRIDE.get(c, {}))
    assert mp["who_penalises"] in W.MODELS and mp["cap"] in W.PUBLIC and mp["private_action"] in W.SUSP, (c, mp)
    S[c] = (mp["who_penalises"], mp["cap"], mp["private_action"], W.FIRST[c], W.ROUTE[c])

# The European page, rendered before the helpers are repointed, is the template for the head,
# header, rail, footer and scripts.
TEMPLATE = P.page()
EU_DESC = P.DESC

# Point the shared European helpers at the worldwide data
P.C, P.S, P.ORDER, P.GRID = C, S, W.ORDER, W.GRID
P.MODELS, P.PUBLIC, P.SUSP = W.MODELS, W.PUBLIC, W.SUSP
P.CHIP_LABELS = ("Who penalises", "Maximum penalty", "Private damages action")
P.TILE_TITLE = "Tile map of 23 jurisdictions outside Europe, coloured by the selected question; the EU tile leads to the European page"
P.EXTRA_TILES = W.EXTRA_TILES


def names(pred):
    return ", ".join(C[c]["country"] for c in W.ORDER if pred(c))


def rows(items, heads):
    return ('<div class="ge-tablewrap"><table class="ge-table ge-stack"><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>'
            % ("".join('<th scope="col">%s</th>' % e(h) for h in heads),
               "".join("<tr><th scope=\"row\">%s</th>%s</tr>" % (e(r[0]), "".join('<td data-label="%s">%s</td>' % (e(h), x) for h, x in zip(heads[1:], r[1:]))) for r in items)))


MODEL_TEXT = {
    "regulator": ("The regulator penalises by its own decision",
                  "As under the GDPR: the regulator investigates and imposes the penalty in one administrative decision, and the organisation challenges it afterwards in a court or tribunal."),
    "regulator-court": ("The regulator has to go to court",
                        "The regulator investigates and negotiates, but a monetary penalty needs a court order. In practice most of the money comes from settlements and consent orders rather than judgments."),
    "court": ("Courts or prosecutors only",
              "The regulator has no fining power. Money penalties come through prosecution for offences, typically breaching a regulator's order, or through court proceedings the regulator or a complainant starts."),
    "none-yet": ("Nobody can penalise yet",
                 "The law is in force on paper, but the penalty machinery is not: an implementing regulation, a penalty schedule or the regulator itself is still missing."),
}


def models_block():
    out = ['<div class="ge-models">']
    for k, (title, text) in MODEL_TEXT.items():
        lbl, bg, fg = W.MODELS[k]
        out.append('<div class="ge-model" style="border-top-color:%s"><h3>%s</h3><p>%s</p><p class="ge-model-ex"><strong>Here:</strong> %s.</p></div>'
                   % (bg, e(title), e(text), e(names(lambda c, k=k: S[c][0] == k))))
    out.append("</div>")
    return "".join(out)


DIFF = [
    ("Fining power",
     "Not every regulator can fine. Canada's federal Commissioner and Japan's Commission cannot; Australia's OAIC and the US FTC must ask a court; India's Board gets its penalty powers only in May 2027.",
     "Ask first who can actually impose a penalty, and on what route, before reading the maximum."),
    ("The ceiling",
     "Turnover-linked maximums now exist well beyond Europe: " + names(lambda c: S[c][1] == "turnover") + ". Elsewhere the maximum is a fixed amount, often per violation, so several violations stack.",
     "A fixed per-violation cap is not a low cap when violations are counted per person or per day."),
    ("Suing directly",
     "In some places individuals have stronger tools than in Europe: statutory damages under the California CCPA for data breaches, statutory damages without proof of harm in Israel, punitive damages up to twice the actual loss in Thailand, and in Kenya the regulator itself orders compensation to complainants.",
     "Litigation exposure can exceed regulatory exposure, especially in the United States."),
    ("Criminal and personal liability",
     "Several regimes back their orders with criminal offences (Japan, Saudi Arabia, the Philippines, Indonesia), and some fine the responsible managers as well as the company (China).",
     "Who is personally exposed matters for governance, not only the company's balance sheet."),
    ("Laws in transition",
     "India's penalties start in May 2027; Indonesia's agency does not exist yet and its regulation applies from January 2027; the UAE federal law still lacks its penalty decision; Japan's surcharge takes effect within two years of July 2026; South Korea's cap rose to 10% for serious cases in September 2026; Vietnam's fines became enforceable in August 2026; Canada's reform bill was only tabled in June 2026.",
     "The date a law entered into force is often not the date it became enforceable."),
    ("More than one enforcer",
     "The United States splits enforcement between the FTC, state attorneys general, California's privacy agency and sector regulators; Nigeria's consumer authority fined Meta separately from the data protection commission; the UAE free zones run their own regimes beside the federal law; Quebec has its own regulator beside Canada's.",
     "Map every enforcer that can reach you, not just the data protection authority."),
]


def compare():
    out = []
    for c in W.ORDER:
        d = C[c]
        m, p, s_, first, _ = S[c]
        abbr = d["dpa"].get("abbr") or d["dpa"]["name_en"]
        out.append('<tr data-mem="%s"><th scope="row"><a href="#ge-c-%s">%s</a></th><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
                   % (re.sub(r"[^a-z]+", "-", d["region"].lower()).strip("-"), c, e(d["country"]), e(abbr),
                      P.chip(W.MODELS, m, "Who penalises"), e(first), P.chip(W.PUBLIC, p, "Maximum penalty"), P.chip(W.SUSP, s_, "Private damages action")))
    return ('<div class="ge-tablewrap"><table class="ge-table ge-compare"><thead><tr><th scope="col">Jurisdiction</th><th scope="col">Regulator</th>'
            '<th scope="col">Who penalises</th><th scope="col">First court</th><th scope="col">Maximum penalty</th>'
            '<th scope="col">Private damages action</th></tr></thead><tbody>%s</tbody></table></div>' % "".join(out))


RAIL = [("ge-short", "Four models"), ("ge-diff", "What changes outside the GDPR"), ("ge-map", "The map"),
        ("ge-compare", "Comparison"), ("ge-countries", "Jurisdiction by jurisdiction"), ("ge-limits", "Method and limits")]


def main_html(corrections):
    cards = "".join(P.country_card(c) for c in W.ORDER)
    region_btns = "".join('<button type="button" class="ge-btn ge-mem" data-mem="%s">%s</button>'
                          % (re.sub(r"[^a-z]+", "-", r.lower()).strip("-"), e(r)) for r in W.REGIONS)
    diff = rows([(a, e(b), e(c_)) for a, b, c_ in DIFF], ["Difference", "What it looks like", "Why it matters"])
    return '''<div class="ge">
<p class="ge-intro">Outside Europe there is no single answer to who fines. The GDPR gives every authority the power to fine by its own decision; elsewhere that power runs from regulators that fine directly, to regulators that must ask a court, to regulators with no fining power at all, to laws whose penalties are not yet enforceable. This page maps the route in the %d jurisdictions outside Europe covered elsewhere on this site. For the EU, the EEA, the United Kingdom and Switzerland, see <a href="gdpr-enforcement.html">GDPR enforcement in Europe</a>.</p>
<p class="ge-status">Researched on %s from statutes, regulator websites and court reports, then checked a second time by an independent pass against the cited sources. Where a point could not be confirmed it says <em>not confirmed</em> rather than guessing. Several of these regimes changed in 2025 and 2026, and the page describes them as they stood on that date. This maps procedure; it is not legal advice.</p>
<section class="ge-block" id="ge-short"><h2>Four models of enforcement</h2>
<p class="ge-lead">The first question is not how large the fine can be but who can impose it. Every jurisdiction on this page falls into one of four models, and the model decides where the courts come in.</p>
%s</section>
<section class="ge-block" id="ge-diff"><h2>What changes outside the GDPR</h2>
<p class="ge-lead">Six differences a European practitioner meets first. Each country section has the detail and the sources.</p>%s</section>
<section class="ge-block" id="ge-map"><h2>The map: three questions across the world</h2>
<p class="ge-lead">Choose a question. Each tile is a jurisdiction; select one to jump to its section. The EU tile leads to the European page.</p>
<div class="ge-views" role="group" aria-label="Question shown on the map">
<button type="button" class="ge-btn is-on" data-view="model">Who can impose a penalty?</button>
<button type="button" class="ge-btn" data-view="public">Is the maximum linked to turnover?</button>
<button type="button" class="ge-btn" data-view="susp">Can individuals sue for damages?</button></div>
<div class="ge-mapwrap" data-view="model">%s<div class="ge-legends">%s%s%s</div></div>
<p class="ge-note">The classification compresses each jurisdiction's text into one label; the section below is the authority. For the United States the label reflects the FTC and the state attorneys general, with California's privacy agency the exception that fines by its own decision. For the UAE it reflects the federal law; the DIFC and ADGM free zones fine directly. For Canada it reflects the federal Commissioner; Quebec's regulator fines directly. Israel's maximum is shown as not confirmed because the reported turnover ceiling rests on a single secondary source.</p>
</section>
<section class="ge-block" id="ge-compare"><h2>Comparison</h2>
<p class="ge-lead">One row per jurisdiction. Select a name for the full section.</p>%s</section>
<section class="ge-block" id="ge-countries"><h2>Jurisdiction by jurisdiction</h2>
<p class="ge-lead">Each section opens with the journey in plain words, then the regulator, the complaint, the procedure, the penalty, the appeal, direct claims, cases that tested the system, and sources.</p>
<div class="ge-filters">
<input type="text" id="ge-q" placeholder="Search a country, regulator or law" aria-label="Search jurisdictions" autocomplete="off">
<div class="ge-views" role="group" aria-label="Show">
<button type="button" class="ge-btn ge-mem is-on" data-mem="all">All</button>%s</div>
<div class="ge-views"><button type="button" class="ge-btn" id="ge-open">Expand all</button><button type="button" class="ge-btn" id="ge-close">Collapse all</button></div>
<p class="ge-count" id="ge-count" aria-live="polite"></p></div>
<div class="ge-countries">%s</div></section>
<section class="ge-block" id="ge-limits"><h2>Method and limits</h2>
<p class="ge-lead">Each jurisdiction was researched from its statute, the regulator's own pages and published decisions, with law firm and press sources used to locate facts and marked <em>secondary</em> in the source lists. A second, independent pass re-read the cited sources and corrected %d points, among them a Nigerian fine that had been set aside by consent, a Korean record fine whose amount and date were wrong, and a Singapore appeal route described as sequential when the statute makes it a choice.</p>
<ul class="ge-quirks">
<li>Many statute portals refuse automated reading, so some section numbers rest on consolidated copies or secondary summaries. The source lists say which.</li>
<li>Appeal deadlines and whether an appeal holds payment are the least certain fields, as on the European page.</li>
<li>Laws in transition are described as they stood on %s. Anything after that date is not reflected.</li>
<li>The map and the comparison compress paragraphs into one label. Read the section before relying on one.</li>
</ul>
<p class="ge-note">Related on this site: <a href="gdpr-enforcement.html">GDPR enforcement in Europe</a> for the EEA, the <a href="cookie-digest.html">Cookie Compliance Digest</a> for cookie and tracking rules in these jurisdictions, and the <a href="practical-privacy.html">Practical Privacy</a> playbook.</p>
</section></div>''' % (len(W.ORDER), CHECKED, models_block(), diff, P.tile_map(), P.legend(W.MODELS, "model"),
                       P.legend(W.PUBLIC, "public", True), P.legend(W.SUSP, "susp", True), compare(), region_btns, cards,
                       corrections, CHECKED)


DESC = "Who can fine for a privacy breach outside Europe, where the courts come in, and the enforcement route in 23 jurisdictions from the United States to Australia."


def page(corrections):
    s = TEMPLATE
    # title, description, canonical, og and JSON-LD
    s = s.replace("Simeon Atanasov | GDPR Enforcement in Europe", "Simeon Atanasov | Privacy Enforcement Worldwide")
    s = s.replace(e(EU_DESC), e(DESC)).replace('"headline": "GDPR enforcement in Europe"', '"headline": "Privacy enforcement worldwide"')
    s = s.replace("https://www.simeonatanasov.com/gdpr-enforcement.html", "https://www.simeonatanasov.com/privacy-enforcement-worldwide.html")
    s = s.replace('<h1 class="major">GDPR enforcement in Europe &#9878;&#65039;</h1>', '<h1 class="major">Privacy enforcement worldwide &#127757;</h1>')
    # main body
    a = s.index('<div class="ge">')
    b = s.index('</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</section>', a)
    s = s[:a] + main_html(corrections) + s[b + len('</div>'):]
    # rail
    ra = s.index('<nav class="ge-rail"')
    rb = s.index('</nav>', ra) + len('</nav>')
    rail = "".join('<a href="#%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>' % (i, i, e(t)) for i, t in RAIL)
    s = s[:ra] + '<nav class="ge-rail" id="ge-rail" aria-label="On this page">' + rail + '</nav>' + s[rb:]
    # header active mark
    s = s.replace('<li><a href="gdpr-enforcement.html" class="active">', '<li><a href="gdpr-enforcement.html">')
    s = s.replace('<li><a href="privacy-enforcement-worldwide.html">', '<li><a href="privacy-enforcement-worldwide.html" class="active">')
    return s


if __name__ == "__main__":
    n = sum(1 for f in os.listdir(os.path.join(HERE, "research", "graw")) if f.endswith(".verify.json"))
    corr = 0
    for f in os.listdir(os.path.join(HERE, "research", "graw")):
        if f.endswith(".verify.json"):
            for c in json.load(open(os.path.join(HERE, "research", "graw", f), encoding="utf-8")).get("checked", []):
                if c.get("verdict") in ("corrected", "wrong") and c.get("replacement") not in (None, ""):
                    corr += 1
    s = page(corr)
    assert EM not in s
    assert s.count("<h1") == 1 and "gdpr-enforcement.html" in s
    os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
    open(os.path.join(HERE, "out", "privacy-enforcement-worldwide.html"), "w", encoding="utf-8", newline="\n").write(s)
    print("privacy-enforcement-worldwide.html", len(s.encode("utf-8")), "bytes;", corr, "corrections from", n, "verify files")
