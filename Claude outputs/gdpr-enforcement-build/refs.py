# -*- coding: utf-8 -*-
"""Turns legal references in page text into links to the official text.

Targets, all checked in a browser on 2 October 2026:
- GDPR articles and recitals: EUR-Lex HTML of CELEX 32016R0679, anchors #art_N and #rct_N.
- Regulation (EU) 2025/2518: CELEX 32025R2518, anchors #art_N (Articles 1 to 37).
- TFEU articles: one EUR-Lex document per article, CELEX 12016E<NNN>.
- CJEU judgments: EUR-Lex CELEX 6<year>CJ<number>, only for the cases in KNOWN, each of which
  was opened and its date checked. A case number not in KNOWN (for example a pending reference)
  stays plain text rather than becoming a dead link.
- A few national statutes named in the overview, linked to the law URL in the country data.

Contexts decide what an unqualified "Art. N" means:
- "gdpr": the overview and EU-level text, where a bare article is a GDPR article.
- "pr": the Procedural Regulation box, where Art. 1 to 37 is Regulation 2025/2518 and higher
  numbers are GDPR articles.
- "card": country text, where a bare article is usually national law, so only references that
  name the GDPR (or the TFEU, or Regulation 2025/2518) are linked, plus CJEU cases.
An article followed by the name of another instrument (LOPDGDD, Codice, BDSG, Act, Law...) is
never linked to the GDPR in any context.
"""
import re

GDPR = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679"
PR = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32025R2518"
RAD = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32020L1828"
TFEU = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:12016E%03d"
CASE = "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:%s"

KNOWN = {
    "C-645/19": "62019CJ0645", "C-319/20": "62020CJ0319", "C-77/21": "62021CJ0077",
    "C-132/21": "62021CJ0132", "C-252/21": "62021CJ0252", "C-300/21": "62021CJ0300",
    "C-340/21": "62021CJ0340", "C-683/21": "62021CJ0683", "C-687/21": "62021CJ0687",
    "C-741/21": "62021CJ0741", "C-768/21": "62021CJ0768", "C-807/21": "62021CJ0807",
    "C-26/22": "62022CJ0026", "C-64/22": "62022CJ0026", "C-456/22": "62022CJ0456",
    "C-590/22": "62022CJ0590", "C-604/22": "62022CJ0604", "C-621/22": "62022CJ0621",
    "C-757/22": "62022CJ0757", "C-97/23 P": "62023CJ0097", "C-383/23": "62023CJ0383",
    "C-416/23": "62023CJ0416", "C-655/23": "62023CJ0655", "C-414/24": "62024CJ0414",
    "C-526/24": "62024CJ0526",
}

ITEM = r"\d+[a-z]?(?:\([0-9a-z]+\))*"
SEP = r"(?:, | and | or | to |-|–)"
ART_RE = re.compile(r"\b(Arts?\.|Articles?) (" + ITEM + r"(?:" + SEP + r"(?:" + ITEM + r"|\([0-9a-z]+\)))*)")
RCT_RE = re.compile(r"\b(Recitals?) (\d+(?:(?:, | and |-)\d+)*)")
CASE_RE = re.compile(r"\bC-\d+/\d{2}(?: P)?")
TOKEN_RE = re.compile(r"(?<![\(\w])(\d+)([a-z]?)((?:\([0-9a-z]+\))*)")

AFTER_TFEU = re.compile(r"\s*(?:of\s+the\s+)?TFEU\b")
AFTER_PR = re.compile(r"\s*(?:of\s+)?(?:Regulation \(EU\) 2025/2518|Regulation 2025/2518|of this Regulation)")
AFTER_GDPR = re.compile(r"\s*(?:of\s+)?(?:the\s+)?(?:GDPR|Regulation \(EU\) 2016/679|Regulation 2016/679)\b")
AFTER_OTHER = re.compile(r"\s*(?:of\s+(?:the\s+)?)?(?:[A-Z][A-Z0-9\-]{1,}|Codice|Infotv|Act\b|Law\b|Code\b|Loi\b|Constitution|Charter|Directive|Decision\b|Regulation\b|d\.lgs|Ley\b|Kp\.|Ákr\.|Infotv\.)")


def _a(url, text, fmt):
    if fmt == "md":
        return "[%s](%s)" % (text, url)
    return '<a href="%s" target="_blank" rel="noopener noreferrer" class="ge-ref">%s</a>' % (url.replace("&", "&amp;"), text)


def _instrument(tail, ctx, first_num):
    if re.match(r"\.\d", tail):
        return None  # dotted subsections (Art. 65.4) are national law, never GDPR
    if AFTER_TFEU.match(tail):
        return "tfeu"
    if AFTER_PR.match(tail):
        return "pr"
    if AFTER_GDPR.match(tail):
        return "gdpr"
    if AFTER_OTHER.match(tail):
        return None
    if ctx == "gdpr":
        return "gdpr"
    if ctx == "pr":
        return "pr" if first_num <= 37 else "gdpr"
    return None


def _url(inst, n):
    if inst == "gdpr":
        return GDPR + "#art_%d" % n if 1 <= n <= 99 else None
    if inst == "pr":
        return PR + "#art_%d" % n if 1 <= n <= 37 else None
    if inst == "tfeu":
        return TFEU % n
    return None


def _segments(s, fmt):
    """Yield (is_link, text) so existing links are never touched."""
    pat = re.compile(r"<a\b[^>]*>.*?</a>", re.S) if fmt == "html" else re.compile(r"\[[^\]]*\]\([^)]*\)|https?://\S+")
    pos = 0
    for m in pat.finditer(s):
        yield False, s[pos:m.start()]
        yield True, m.group(0)
        pos = m.end()
    yield False, s[pos:]


def _link_plain(s, ctx, fmt, national):
    out, pos = [], 0
    events = []
    for m in ART_RE.finditer(s):
        events.append(("art", m))
    for m in RCT_RE.finditer(s):
        events.append(("rct", m))
    for m in CASE_RE.finditer(s):
        events.append(("case", m))
    events.sort(key=lambda x: x[1].start())
    last = 0
    for kind, m in events:
        if m.start() < last:
            continue
        out.append(s[last:m.start()])
        if kind == "case":
            key = m.group(0)
            out.append(_a(CASE % KNOWN[key], key, fmt) if key in KNOWN else key)
        elif kind == "rct":
            tail = s[m.end():m.end() + 50]
            if AFTER_GDPR.match(tail) or (ctx in ("gdpr", "pr") and not AFTER_OTHER.match(tail)):
                nums = TOKEN_RE.sub(lambda t: _a(GDPR + "#rct_%s" % t.group(1), t.group(0), fmt), m.group(2))
                out.append(m.group(1) + " " + nums)
            else:
                out.append(m.group(0))
        else:
            run = m.group(2)
            first = int(re.match(r"\d+", run).group(0))
            inst = _instrument(s[m.end():m.end() + 50], ctx, first)
            if not inst:
                out.append(m.group(0))
            else:
                single = re.fullmatch(ITEM, run) is not None
                if single:
                    u = _url(inst, first)
                    out.append(_a(u, m.group(0), fmt) if u else m.group(0))
                else:
                    def rep(t):
                        n = int(t.group(1))
                        i2 = inst if inst != "pr" or ctx != "pr" or n <= 37 else "gdpr"
                        u = _url(i2, n)
                        return _a(u, t.group(0), fmt) if u else t.group(0)
                    out.append(m.group(1) + " " + TOKEN_RE.sub(rep, run))
        last = m.end()
    out.append(s[last:])
    res = "".join(out)
    if national and ctx == "gdpr":
        for phrase, url in national.items():
            parts = []
            for is_link, seg in _segments(res, fmt):
                if not is_link and phrase in seg:
                    seg = seg.replace(phrase, _a(url, phrase, fmt), 1)
                parts.append(seg)
            res = "".join(parts)
    return res


def linkify(s, ctx="gdpr", fmt="html", national=None):
    if not s:
        return s
    parts = []
    for is_link, seg in _segments(s, fmt):
        if is_link:
            parts.append(seg)
        else:
            # never touch text inside an HTML tag
            if fmt == "html":
                bits = re.split(r"(<[^>]+>)", seg)
                parts.append("".join(b if b.startswith("<") else _link_plain(b, ctx, fmt, national) for b in bits))
            else:
                parts.append(_link_plain(seg, ctx, fmt, national))
    return "".join(parts)
