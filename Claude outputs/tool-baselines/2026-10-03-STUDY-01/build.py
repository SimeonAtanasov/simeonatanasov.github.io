# -*- coding: utf-8 -*-
"""Assemble the printable study pack and render it to PDF with WeasyPrint."""
import json, re, html, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import study_pp, study_aia, study_tools, front

PAGES = json.load(open(os.path.join(HERE, "pages.json"), encoding="utf-8"))
A = json.load(open(os.path.join(HERE, "assessment.json"), encoding="utf-8"))
R = json.load(open(os.path.join(HERE, "readiness.json"), encoding="utf-8"))

toc_entries = []  # (level, id, text)


def esc(s):
    return html.escape(s, quote=False)


# ---------------------------------------------------------------- markdown ---
INLINE = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"(?<!\*)\*([^*]+?)\*(?!\*)"), r"<em>\1</em>"),
    (re.compile(r"`([^`]+?)`"), r"<code>\1</code>"),
]


def inline(t):
    t = esc(t)
    for rx, rep in INLINE:
        t = rx.sub(rep, t)
    return t


def md_block(b):
    """One extracted block string -> HTML."""
    b = b.strip()
    if not b:
        return ""
    if b.startswith("|"):
        return md_table(b)
    if b.startswith("#"):
        m = re.match(r"(#+)\s*(.*)", b)
        lvl = min(len(m.group(1)) + 1, 6)
        return "<h%d class=\"sub\">%s</h%d>" % (lvl, inline(m.group(2)), lvl)
    lines = b.split("\n")
    if re.match(r"^\s*(-|\d+\.)\s", lines[0]):
        return md_list(lines)
    if b.startswith("> "):
        return "<blockquote>%s</blockquote>" % inline(b[2:])
    return "<p>%s</p>" % inline(b)


def md_list(lines):
    out = []

    def rec(i, indent):
        ordered = bool(re.match(r"^\s*\d+\.", lines[i]))
        tag = "ol" if ordered else "ul"
        out.append("<%s>" % tag)
        while i < len(lines):
            ln = lines[i]
            ind = len(ln) - len(ln.lstrip())
            if ind < indent:
                break
            if ind > indent:
                i = rec(i, ind)
                continue
            m = re.match(r"^\s*(?:-|\d+\.)\s+(.*)$", ln)
            if not m:
                break
            out.append("<li>%s" % inline(m.group(1)))
            # peek for nested
            if i + 1 < len(lines):
                nxt = lines[i + 1]
                nind = len(nxt) - len(nxt.lstrip())
                if nind > indent:
                    i = rec(i + 1, nind) - 1
            out.append("</li>")
            i += 1
        out.append("</%s>" % tag)
        return i

    rec(0, len(lines[0]) - len(lines[0].lstrip()))
    return "".join(out)


def md_table(b):
    rows = [r for r in b.split("\n") if r.strip()]
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    head = cells[0]
    body = [c for c in cells[2:]]
    h = "<table><thead><tr>" + "".join("<th>%s</th>" % inline(c) for c in head) + "</tr></thead><tbody>"
    for r in body:
        h += "<tr>" + "".join("<td>%s</td>" % inline(c) for c in r) + "</tr>"
    return h + "</tbody></table>"


def md(blocks):
    return "".join(md_block(b) for b in blocks)


# ------------------------------------------------------------------ pieces ---
def heading(level, ident, text, cls=""):
    toc_entries.append((level, ident, text))
    tag = {1: "h1", 2: "h2", 3: "h3"}[level]
    return '<%s id="%s" class="%s">%s</%s>' % (tag, ident, cls, esc(text), tag)


def takeaway(bullets, label="Key takeaways"):
    return (
        '<aside class="takeaway"><h4>%s</h4><ul>%s</ul></aside>'
        % (label, "".join("<li>%s</li>" % inline(b) for b in bullets))
    )


def selftest(ident, title, items, answer_id):
    h = '<section class="selftest" id="%s">' % ident
    toc_entries.append((1, ident, title))
    h += '<h2 id="%s-h">%s</h2>' % (ident, esc(title))
    h += '<p class="hint">Cover the answers. Say or write your answer in full before you check it: recall you have to construct is worth several times a line you merely recognise. Answers begin on the next page.</p>'
    h += "<ol class=\"qlist\">"
    for q, _ in items:
        h += "<li>%s</li>" % inline(q)
    h += "</ol></section>"
    h += '<section class="answers" id="%s">' % answer_id
    h += "<h2>%s: answers</h2><ol class=\"alist\">" % esc(title)
    for q, a in items:
        h += "<li><span class=\"aq\">%s</span><span class=\"aa\">%s</span></li>" % (inline(q), inline(a))
    h += "</ol></section>"
    return h


# ----------------------------------------------------------------- part 1/2 ---
def advice_part(key, part_no, part_title, blurb, study, prefix, intro_refs=()):
    d = PAGES[key]
    h = '<section class="partopen" id="%s">' % prefix
    h += '<p class="partno">Part %s</p><h1 class="parttitle">%s</h1>' % (part_no, esc(part_title))
    toc_entries.append((0, prefix, "Part %s. %s" % (part_no, part_title)))
    h += '<div class="partblurb">%s</div>' % blurb
    h += "</section>"
    h += '<section class="intro">%s%s</section>' % (md(d["intro"]), refs_html(intro_refs))
    for it in d["items"]:
        ident = "%s-%s" % (prefix, it["num"])
        h += '<section class="topic">'
        h += heading(1, ident, "%s. %s" % (it["num"], it["title"]))
        h += md(it["blocks"])
        tk = study.TAKEAWAYS.get(it["num"])
        if tk:
            h += takeaway(tk)
        h += "</section>"
    h += selftest(
        prefix + "-test",
        "Part %s self-test" % part_no,
        study.SELFTEST,
        prefix + "-answers",
    )
    return h


# ------------------------------------------------------------------ part 3 ---
TYPE_LABEL = {
    "text": "short text",
    "textarea": "long text",
    "select": "choose one",
    "multiselect": "choose any",
    "yesno": "yes / no",
    "date": "date",
}

MODULE_ORDER = [
    ("privacy", "PRIVACY_STEPS", "Privacy Assessment"),
    ("dpia", "DPIA_STEPS", "Full DPIA"),
    ("lia", "LIA_STEPS", "Legitimate Interest Test"),
    ("ai", "AI_STEPS", "AI Risk Assessment"),
    ("incident", "INCIDENT_STEPS", "Incident & Breach Severity"),
    ("tpsa", "TPSA_STEPS", "Third-Party Security Assessment"),
]

LONG_LISTS = {}


def options_html(opts, qid):
    if not isinstance(opts, list):
        return ""
    if len(opts) > 40:
        key = "countries" if len(opts) > 150 else qid
        LONG_LISTS[key] = opts
        return '<p class="opts"><span class="t">options</span> %d entries, listed in Appendix A.</p>' % len(opts)
    return '<p class="opts"><span class="t">options</span> %s</p>' % " &middot; ".join(esc(o) for o in opts)


def fn_text(v):
    if isinstance(v, dict) and "__fn" in v:
        return v["__fn"]
    return None


def condition_note(v):
    """Turn a visibleIf function source into a readable condition, best effort."""
    src = fn_text(v)
    if not src:
        return ""
    m = re.search(r"return\s+(.*?);?\s*\}", src)
    body = m.group(1) if m else src
    body = body.replace("a.", "").replace("(v || [])", "the answer")
    body = re.sub(r"\s+", " ", body).strip()
    return body


def question_html(q):
    lab = q.get("label")
    if isinstance(lab, dict):
        lab = "(label depends on the previous answer)"
    h = '<div class="q">'
    h += '<p class="qlabel">%s <span class="qtype">%s</span></p>' % (
        inline(str(lab)),
        esc(TYPE_LABEL.get(q.get("type"), q.get("type") or "")),
    )
    h += options_html(q.get("options"), q.get("id", ""))
    note = q.get("note")
    if isinstance(note, dict):
        nl = note.get("label")
        if isinstance(nl, dict):
            nl = "a follow-up note, worded according to the answer"
        h += '<p class="note"><span class="t">follow-up</span> %s</p>' % inline(str(nl))
    cond = condition_note(q.get("visibleIf"))
    if cond:
        h += '<p class="cond"><span class="t">shown when</span> <code>%s</code></p>' % esc(cond)
    h += "</div>"
    return h


def refs_html(nums):
    return '<p class="refs"><span class="t">Sources</span> %s</p>' % " ".join("[%d]" % n for n in nums)


def cheatsheet_html(cs, extra=None, refs=None):
    h = '<aside class="cheat">'
    h += "<p><span class=\"t\">What it is for</span> %s</p>" % inline(cs["purpose"])
    h += "<p><span class=\"t\">Shape</span> %s</p>" % inline(cs["shape"])
    h += "<p><span class=\"t\">What it returns</span> %s</p>" % inline(cs["output"])
    h += "<h4>How the scoring works</h4><ul>"
    for line in cs["logic"]:
        if line in ("MATRIX", "RESIDUAL", "FORMULA"):
            h += "</ul>" + (extra or {}).get(line, "") + "<ul>"
            continue
        h += "<li>%s</li>" % inline(line)
    h += "</ul>"
    h += "<h4>Where people get it wrong</h4><ul>"
    for line in cs["traps"]:
        h += "<li>%s</li>" % inline(line)
    h += "</ul>"
    if refs:
        h += refs_html(refs)
    h += "</aside>"
    return h


def matrix_table(rows, cols, data, corner):
    h = '<table class="matrix"><thead><tr><th>%s</th>' % esc(corner)
    for c in cols:
        h += "<th>%s</th>" % esc(c)
    h += "</tr></thead><tbody>"
    for i, r in enumerate(rows):
        h += "<tr><th>%s</th>" % esc(r)
        for j in range(len(cols)):
            v = data[i][j]
            h += '<td class="lvl lvl-%s">%s</td>' % (v.lower().replace(" ", ""), esc(v))
        h += "</tr>"
    h += "</tbody></table>"
    return h


def scale_table(title, pairs):
    h = '<table class="scale"><thead><tr><th>%s</th><th>score</th></tr></thead><tbody>' % esc(title)
    for lab, sc in pairs:
        h += "<tr><td>%s</td><td>%s</td></tr>" % (esc(lab), "not involved" if sc is None else sc)
    h += "</tbody></table>"
    return h


def tools_part():
    h = '<section class="partopen" id="part3">'
    h += '<p class="partno">Part 3</p><h1 class="parttitle">The Assessment Suite</h1>'
    toc_entries.append((0, "part3", "Part 3. The Assessment Suite"))
    h += '<div class="partblurb"><p>Six tools, 68 steps and 338 questions, with the scoring model that turns the answers into a verdict.</p></div>'
    h += "</section>"
    h += '<section class="intro">%s%s</section>' % (md(study_tools.SUITE_INTRO.split("\n\n")), refs_html((3, 7, 8, 9, 12, 14, 15, 19)))

    sev = [s.split(" - ")[0] for s in A["SEVERITY_SCALE"]]
    lik = [s.split(" - ")[0] for s in A["LIKELIHOOD_SCALE"]]
    extras = {
        "MATRIX": matrix_table(sev, lik, A["RISK_MATRIX"], "severity \\ likelihood")
        + '<p class="fig">Severity and likelihood scales in full: %s.</p>'
        % esc("; ".join(A["SEVERITY_SCALE"])),
        "RESIDUAL": matrix_table(
            ["Low", "Medium", "High", "Critical"],
            A["TPSA_MATURITY_TIERS"],
            A["TPSA_RESIDUAL_MATRIX"],
            "inherent \\ maturity",
        ),
        "FORMULA": '<p class="formula">SE = (DPC &times; EI) + CB</p>',
    }

    for mid, arr, label in MODULE_ORDER:
        mod = A["MODULES"][mid]
        steps = A[arr]
        nq = sum(len(s.get("questions") or []) for s in steps)
        h += '<section class="tool">'
        h += heading(1, "tool-" + mid, label)
        h += '<p class="lede">%s</p>' % inline(mod["intro"])
        h += cheatsheet_html(study_tools.CHEATSHEETS[mid], extras, study_tools.CHEATSHEET_REFS[mid])
        if mid == "incident":
            h += "<h3 class=\"sub\">The ENISA scales in full</h3>"
            h += '<div class="scales">'
            for name, key in [
                ("DPC - simple data", "DPC_SIMPLE"),
                ("DPC - behavioural data", "DPC_BEHAVIOURAL"),
                ("DPC - financial data", "DPC_FINANCIAL"),
                ("DPC - sensitive data", "DPC_SENSITIVE"),
                ("EI - full name", "EI_NAME"),
                ("EI - ID number", "EI_ID"),
                ("EI - phone or postal address", "EI_CONTACT"),
                ("EI - email address", "EI_EMAIL"),
                ("EI - picture", "EI_PICTURE"),
                ("EI - code or pseudonym", "EI_CODE"),
                ("CB - confidentiality", "CB_CONFIDENTIALITY"),
                ("CB - integrity", "CB_INTEGRITY"),
                ("CB - availability", "CB_AVAILABILITY"),
            ]:
                h += scale_table(name, A[key])
            h += "</div>"
        h += '<h3 class="sub">The question bank, step by step</h3>'
        for i, st in enumerate(steps, 1):
            h += '<div class="step">'
            h += '<h4 class="stephead">Step %d of %d &middot; %s</h4>' % (i, len(steps), esc(st.get("title", "")))
            cond = condition_note(st.get("visibleIf"))
            if cond:
                h += '<p class="cond"><span class="t">step shown when</span> <code>%s</code></p>' % esc(cond)
            if st.get("intro"):
                h += '<p class="stepintro">%s</p>' % inline(st["intro"])
            for q in st.get("questions") or []:
                h += question_html(q)
            h += "</div>"
        h += '<p class="toolfoot">%s: %d steps, %d questions.</p>' % (esc(label), len(steps), nq)
        h += "</section>"

    h += selftest("part3-test", "Part 3 self-test", study_tools.SUITE_SELFTEST, "part3-answers")
    return h


# ------------------------------------------------------------------ part 4 ---
def readiness_part():
    cats = R["CATEGORIES"]
    acts = R["ACTIVITIES"]
    arts = R["ARTICLE_TITLES"]
    h = '<section class="partopen" id="part4">'
    h += '<p class="partno">Part 4</p><h1 class="parttitle">The GDPR Readiness Model</h1>'
    toc_entries.append((0, "part4", "Part 4. The GDPR Readiness Model"))
    h += '<div class="partblurb"><p>71 privacy management activities in 13 categories, mapped to 37 GDPR Articles, with the two evidence questions that decide each one.</p></div>'
    h += "</section>"

    h += '<section class="tool">'
    h += heading(1, "ra-method", "The method")
    h += cheatsheet_html(study_tools.READINESS_CHEATSHEET, None, study_tools.CHEATSHEET_REFS["readiness"])
    h += '<h3 class="sub">The four statuses</h3><table class="status"><thead><tr><th>Status</th><th>Score</th><th>What it means</th></tr></thead><tbody>'
    for s in R["STATUS"]:
        h += "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (
            esc(s["label"]),
            "excluded" if s["score"] is None else s["score"],
            esc(s["guide"]),
        )
    h += "</tbody></table>"
    h += '<h3 class="sub">The 13 scope questions</h3><p class="stepintro">Answering no to one of these removes the activities gated on it from scoring, rather than counting them as failures.</p><ol class="scope">'
    for c in R["CONDITIONS"]:
        h += "<li>%s <span class=\"qtype\">%s</span></li>" % (esc(c["text"]), esc(c["id"]))
    h += "</ol></section>"

    h += '<section class="tool">'
    h += heading(1, "ra-activities", "The 71 activities")
    h += '<p class="lede">Each activity carries two evidence questions. <strong>PO</strong> is the Privacy Office question: does the mechanism exist and is it built correctly. <strong>OU</strong> is the Operational Unit question: does it reflect what actually happens. The Articles listed are the ones the activity evidences.</p>'
    for ci, cname in enumerate(cats):
        items = [a for a in acts if a["cat"] == ci]
        h += '<div class="racat">'
        h += '<h3 class="sub" id="racat-%d">%s <span class="count">%d activities</span></h3>' % (
            ci,
            esc(cname),
            len(items),
        )
        toc_entries.append((3, "racat-%d" % ci, cname))
        for a in items:
            h += '<div class="act">'
            h += '<p class="actline"><span class="actid">%s</span> %s</p>' % (esc(a["id"]), inline(a["activity"]))
            h += '<p class="ev"><span class="t">PO</span> %s</p>' % inline(a["po"])
            h += '<p class="ev"><span class="t">OU</span> %s</p>' % inline(a["ou"])
            meta = "Art. " + ", ".join(str(x) for x in a["articles"])
            if a.get("cond"):
                meta += " &middot; scoped on: %s" % esc(a["cond"])
            h += '<p class="actmeta">%s</p>' % meta
            h += "</div>"
        h += "</div>"
    h += "</section>"

    # Article index
    h += '<section class="tool">'
    h += heading(1, "ra-articles", "Article index")
    h += '<p class="lede">The reverse view: which activities evidence each Article. An Article scores the mean of the activities listed against it, so an Article with one activity behind it is fragile and an Article with six is not.</p>'
    idx = {}
    for a in acts:
        for n in a["articles"]:
            idx.setdefault(n, []).append(a["id"])
    h += '<table class="artidx"><thead><tr><th>Art.</th><th>Title</th><th>Evidenced by</th></tr></thead><tbody>'
    for n in sorted(idx):
        h += "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (
            n,
            esc(arts.get(str(n), arts.get(n, ""))),
            ", ".join(idx[n]),
        )
    h += "</tbody></table></section>"

    h += selftest("part4-test", "Part 4 self-test", study_tools.READINESS_SELFTEST, "part4-answers")
    return h


# ---------------------------------------------------------------- appendix ---
def appendix():
    h = '<section class="partopen" id="appendix">'
    h += '<p class="partno">Appendix</p><h1 class="parttitle">Reference lists</h1>'
    toc_entries.append((0, "appendix", "Appendix. Reference lists"))
    h += "</section>"
    h += '<section class="tool">'
    h += heading(1, "app-a", "Appendix A. Long option lists")
    for key, opts in sorted(LONG_LISTS.items()):
        name = "Countries and regions" if key == "countries" else key
        h += '<h3 class="sub">%s <span class="count">%d entries</span></h3>' % (esc(name), len(opts))
        h += '<p class="cols">%s</p>' % " &middot; ".join(esc(o) for o in opts)
    h += "</section>"
    h += '<section class="tool">'
    h += heading(1, "app-b", "Appendix B. Fifteen-minute review card")
    h += front.REVIEW_CARD
    h += refs_html((5, 6, 9, 19))
    h += "</section>"
    h += '<section class="tool">'
    h += heading(1, "app-c", "Appendix C. Sources")
    h += '<p class="lede">Every [n] in this pack points here. The first four are the site itself, as extracted on the date shown; the rest are the primary texts and published methods the pages and tools rest on. For what has changed since the pages were written, see the companion verification report [19].</p>'
    h += '<ol class="sources">' + "".join("<li>%s</li>" % esc(x) for x in study_tools.PACK_SOURCES) + "</ol>"
    h += "</section>"
    return h


# -------------------------------------------------------------------- toc ---
def toc_html():
    h = '<section class="toc" id="toc"><h1>Contents</h1><ul>'
    for lvl, ident, text in toc_entries:
        if lvl > 1:
            continue
        cls = "l0" if lvl == 0 else "l1"
        h += '<li class="%s"><a href="#%s">%s</a></li>' % (cls, ident, esc(text))
    h += "</ul></section>"
    return h


# ------------------------------------------------------------------- build ---
def build():
    body = []
    body.append(front.COVER)
    body.append('<section class="front" id="howto">%s</section>' % front.HOWTO)
    body.append("@@TOC@@")
    body.append(
        advice_part(
            "practical_privacy",
            "1",
            "Practical Privacy",
            "<p>Eighteen situations that recur inside every organisation, and the decision rule for each.</p>",
            study_pp,
            "pp",
            (1, 5, 16, 17, 18, 19),
        )
    )
    body.append(
        advice_part(
            "ai_act",
            "2",
            "Practical AI Act Advice",
            "<p>Thirteen sections covering what applies to you, what you have to build, and what you have to go and check on other people's systems.</p>",
            study_aia,
            "aia",
            (2, 6, 19),
        )
    )
    body.append(tools_part())
    body.append(readiness_part())
    body.append(appendix())

    doc = "".join(body).replace("@@TOC@@", toc_html())
    page = (
        "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        "<title>Privacy, AI Act and Assessments: a study pack</title>"
        "<style>%s</style></head><body>%s</body></html>" % (open(os.path.join(HERE, "pack.css"), encoding="utf-8").read(), doc)
    )
    out_html = os.path.join(HERE, "pack.html")
    open(out_html, "w", encoding="utf-8").write(page)
    return out_html


if __name__ == "__main__":
    p = build()
    print("html:", p, os.path.getsize(p), "bytes")
    from weasyprint import HTML

    outdir = "/mnt/user-data/outputs"
    os.makedirs(outdir, exist_ok=True)
    pdf = os.path.join(outdir, "privacy-ai-act-assessments-study-pack.pdf")
    HTML(p).write_pdf(pdf)
    print("pdf:", pdf, os.path.getsize(pdf), "bytes")
