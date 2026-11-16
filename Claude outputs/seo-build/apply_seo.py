"""Search and AI crawler metadata for simeonatanasov.com, from one definition.

Run from the repo root:  python3 "Claude outputs/seo-build/apply_seo.py"

Idempotent. Rerun it after any rebuild of a page that writes its own head (the three
digest builders, apply_nav.py, the GDPR enforcement builders, the crosswalk builder, the
notice generators' build_page.py), the same way swap_header.py is rerun: a builder puts
back its own description and metadata block.

What it does, per page listed in PAGES:
  1. Rewrites the apex host https://simeonatanasov.com to https://www.simeonatanasov.com
     (CNAME serves www; canonicals, og:url and the sitemap must match it).
  2. Sets the meta description (asserted at 160 characters or fewer, no em dash).
  3. Removes any hand-written og: and twitter: tags and any JSON-LD block in the head, and
     writes one block between <!-- seo:start --> and <!-- seo:end --> after the canonical
     link: Open Graph, Twitter card and JSON-LD structured data.
Then it rewrites the host in the other root HTML files, robots.txt and the three digest
builders, and regenerates llms.txt.

Checks, all made before anything is written; any failure stops the run with no file changed:
  - every page in sitemap.xml has a PAGES entry, and every PAGES entry is in sitemap.xml;
  - every description is 160 characters or fewer and has no em dash;
  - every OG image exists, every page has a <title>, a meta description and a canonical link.

sitemap.xml: the host is fixed and the lastmod dates are left as they are (until
16 November 2026 they were reset to the file dates on every run, which dated every page
to the day of the last checkout). To date a page deliberately:
  --lastmod gdpr-readiness.html               (today)
  --lastmod gdpr-readiness.html=2026-11-16    (a given day; repeat the option per page)
The home page is "index.html".

Only files whose content changes are written; the run lists them.

Edited 16 November 2026 (SEO-01): five pages added, the digest counts and the assessments
description brought up to date, three descriptions shortened, the sitemap check, lastmod
left alone, LLMS_TEXT for the pages whose llms.txt line is longer than the meta description.
"""
import datetime, glob, html, json, os, re, sys

HOST = "https://www.simeonatanasov.com"
APEX = "https://simeonatanasov.com"
PERSON_ID = HOST + "/#person"
SITE_ID = HOST + "/#website"
MAX_DESC = 160

# file: (kind, description, og image, short name for llms.txt, llms.txt section)
# The order inside each llms.txt section follows the order of this table.
# kind: home | article (TechArticle) | collection (CollectionPage) | app | game
#       (WebApplication) | page (WebPage)
PAGES = {
    "index.html": ("home",
        "Simeon Atanasov's portfolio: free privacy, AI Act and cookie compliance tools, "
        "regulatory digests, GDPR fine benchmarks and practical advice.",
        "images/avatar.png", "Home", None),
    "practical-privacy.html": ("article",
        "A practitioner-tested privacy playbook for eighteen recurring situations, "
        "from surveillance and offboarding to marketing and breach response.",
        "images/practical-privacy.jpg", "Practical Privacy", "Advice"),
    "practical-ai-act-advice.html": ("article",
        "A working reference on the EU AI Act in thirteen topics: what applies to you, "
        "what you have to build, and what to check on other people's systems.",
        "images/practical-ai-act.jpg", "Practical AI Act Advice", "Advice"),
    "gdpr-enforcement.html": ("article",
        "How a GDPR complaint becomes a fine, where the courts come in, and the enforcement "
        "route in all 30 EEA countries, with the UK and Switzerland for contrast.",
        "images/avatar.png", "GDPR Enforcement in Europe", "Advice"),
    "privacy-enforcement-worldwide.html": ("article",
        "Who can fine for a privacy breach outside Europe, where the courts come in, and the "
        "enforcement route in 23 jurisdictions from the United States to Australia.",
        "images/avatar.png", "Privacy Enforcement Worldwide", "Advice"),
    "ai-act-digest.html": ("collection",
        "The EU AI Act article by article, as amended by the 2026 Digital Omnibus, "
        "with takeaways, application dates and the guidance around it.",
        "images/regulatory-digests.png", "AI Act Digest", "Digests"),
    "ai-governance-crosswalk.html": ("page",
        "Crosswalk of EU AI Act obligations for providers and deployers to ISO/IEC 42001 "
        "clauses and Annex A controls and NIST AI RMF subcategories, with gaps marked.",
        "images/avatar.png", "AI Act, ISO/IEC 42001 and NIST AI RMF Crosswalk", "Digests"),
    "edpb-digest.html": ("collection",
        "Every European Data Protection Board document, 553 in all, with one takeaway "
        "each: what it establishes, who it binds and what to do.",
        "images/regulatory-digests.png", "EDPB Digest", "Digests"),
    "cookie-digest.html": ("collection",
        "263 cookie and tracking laws, regulator guidance documents, court decisions and "
        "enforcement actions across 66 jurisdictions, each with a takeaway.",
        "images/regulatory-digests.png", "Cookie Compliance Digest", "Digests"),
    "privacy-ai-assessment.html": ("app",
        "Ten free privacy and AI assessments: privacy check, DPIA, legitimate interest, AI "
        "and generative AI risk, FRIA, transfer impact, breach severity, vendor risk.",
        "images/pic04.jpg", "Privacy & AI Risk Assessments", "Tools"),
    "notice-generators.html": ("app",
        "Free generators: a privacy notice for the GDPR and other major privacy laws, an AI "
        "Act transparency notice, a data protection policy and an AI policy.",
        "images/pic04.jpg", "Notice and Policy Generators", "Tools"),
    "gdpr-readiness.html": ("app",
        "An accountability-based GDPR readiness assessment: record the privacy activities "
        "you perform and see which GDPR Articles they evidence.",
        "images/gdpr-readiness.jpg", "GDPR Readiness Assessment", "Tools"),
    "gdpr-fine-calculator.html": ("app",
        "Benchmark a possible GDPR fine against published enforcement decisions: see what "
        "comparable organisations paid and the statutory ceiling.",
        "images/power-bi-tile.png", "GDPR Fine Calculator", "Tools"),
    "gdpr-fines-analytics.html": ("app",
        "Build your own chart of published GDPR fines by country, sector, authority, Article "
        "or year, then download it as PNG or CSV.",
        "images/power-bi-tile.png", "GDPR Fines Analytics", "Tools"),
    "power-bi.html": ("page",
        "A Power BI dashboard of GDPR fines across Europe since 2018: enforcement trends, "
        "country breakdowns and company-level analysis.",
        "images/power-bi-tile.png", "GDPR Fines Dashboard", "Tools"),
    "risk-matrix-original.html": ("app",
        "An interactive risk matrix for privacy and data protection: add risks, place them "
        "by likelihood and impact, assign mitigations and export.",
        "images/risk-matrix-tile.png", "Interactive Risk Matrix", "Tools"),
    "cookie-banner-scanner.html": ("app",
        "Run a cookie banner scan and export the results to Excel.",
        "images/automated-cookie-banner-scanner.jpg", "Cookie Banner Scanner", "Tools"),
    "my-asteroids-game.html": ("game",
        "A browser Asteroids game written in JavaScript: pilot a ship, dodge and destroy "
        "asteroids, with keyboard and touch controls.",
        "images/pic02.jpg", "Asteroids Game", "Other"),
    "privacy-notice.html": ("page",
        "How this website collects, uses and protects personal data, and your rights as a "
        "data subject, including access, rectification and erasure.",
        "images/avatar.png", "Privacy Notice", "Legal"),
    "cookie-notice.html": ("page",
        "The cookies used on this website, what each one does, and how to manage your "
        "cookie preferences.",
        "images/avatar.png", "Cookie Notice", "Legal"),
    "terms.html": ("page",
        "Terms of Use for this website: acceptable use, intellectual property, the "
        "informational nature of the tools and demos, and liability.",
        "images/avatar.png", "Terms of Use", "Legal"),
}

# llms.txt has no length limit, so a page may carry a fuller line there than its meta
# description. Pages not listed here use their description.
LLMS_TEXT = {
    "ai-governance-crosswalk.html":
        "EU AI Act obligations for providers, deployers and GPAI model providers mapped to "
        "ISO/IEC 42001 clauses and Annex A controls and NIST AI RMF subcategories, with gaps "
        "marked, plus the NIST-hosted AI RMF to ISO/IEC 42001 crosswalk.",
    "privacy-ai-assessment.html":
        "Free privacy and AI governance assessments: privacy check, full DPIA, legitimate "
        "interest test, AI Act risk, breach severity, third-party security, fundamental "
        "rights impact, generative AI risk, transfer impact, and an AI assessment pathway "
        "that runs the AI tools as one with an impact level and framework coverage.",
    "notice-generators.html":
        "Generate a privacy notice under the GDPR, the UK GDPR, the Swiss FADP, Brazil's LGPD, "
        "Canada's PIPEDA and provincial laws, India's DPDP Act, China's PIPL, Japan's APPI, "
        "South Korea's PIPA, Singapore's PDPA, Australia's Privacy Act, South Africa's POPIA, "
        "the California CCPA or the other US state privacy laws, an AI Act transparency "
        "notice, a data protection policy and an AI policy, each with a completeness check "
        "against the law.",
}

SAME_AS = [
    "https://www.linkedin.com/in/simeon-atanasov-atanasov/",
    "https://github.com/SimeonAtanasov",
]

LLMS_INTRO = (
    "Free, practitioner-built resources on data protection, the EU AI Act and cookie "
    "compliance: reference digests of primary sources, practical advice, and browser-based "
    "assessment tools. Content is informational, not legal advice."
)
LLMS_ORDER = ["Digests", "Advice", "Tools", "Legal", "Other"]


def rd(p):
    with open(p, "rb") as f:
        return f.read().decode("utf-8")


def wr(p, s):
    b = s.encode("utf-8")
    with open(p, "wb") as f:
        f.write(b)


def host_fix(s):
    return s.replace(APEX, HOST)


def url_of(fn):
    return HOST + "/" if fn == "index.html" else HOST + "/" + fn


def file_of(loc):
    loc = host_fix(loc)
    if not loc.startswith(HOST + "/"):
        return None
    rest = loc[len(HOST) + 1:]
    return "index.html" if rest == "" else rest


def title_of(s):
    return html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip())


def jsonld(fn, kind, title, desc, img):
    url = url_of(fn)
    name = title.split("|", 1)[1].strip() if title.startswith("Simeon Atanasov |") else title
    author = {"@id": PERSON_ID}
    site = {"@id": SITE_ID}
    if kind == "home":
        graph = [
            {"@type": "WebSite", "@id": SITE_ID, "url": HOST + "/", "name": "Simeon Atanasov",
             "description": desc, "inLanguage": "en", "publisher": author},
            {"@type": "Person", "@id": PERSON_ID, "name": "Simeon Atanasov", "url": HOST + "/",
             "image": HOST + "/images/avatar.png",
             "jobTitle": "Privacy Manager, AI Governance, Software Developer",
             "knowsAbout": ["Data protection", "GDPR", "EU AI Act", "AI governance",
                            "Cookie compliance", "Privacy engineering", "Software development"],
             "sameAs": SAME_AS},
            {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title,
             "description": desc, "isPartOf": site, "about": author, "inLanguage": "en"},
        ]
        return {"@context": "https://schema.org", "@graph": graph}
    base = {"@context": "https://schema.org", "url": url, "name": name,
            "description": desc, "inLanguage": "en", "image": HOST + "/" + img,
            "isPartOf": site, "author": author}
    if kind == "article":
        base.update({"@type": "TechArticle", "headline": name, "publisher": author,
                     "mainEntityOfPage": url})
    elif kind == "collection":
        base.update({"@type": "CollectionPage"})
    elif kind in ("app", "game"):
        base.update({"@type": "WebApplication",
                     "applicationCategory": "GameApplication" if kind == "game" else "BusinessApplication",
                     "operatingSystem": "Any", "browserRequirements": "Requires JavaScript",
                     "isAccessibleForFree": True,
                     "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}})
    else:
        base.update({"@type": "WebPage"})
    return base


def block(fn, kind, title, desc, img):
    url = url_of(fn)
    card = "summary" if img.endswith("avatar.png") else "summary_large_image"
    e = lambda v: html.escape(v, quote=True)
    ld = json.dumps(jsonld(fn, kind, title, desc, img), ensure_ascii=False, indent=1)
    ld = ld.replace("</", "<\\/").replace("\n", "\n\t\t")
    lines = [
        "<!-- seo:start (generated by Claude outputs/seo-build/apply_seo.py) -->",
        '<meta property="og:type" content="%s">' % ("article" if kind == "article" else "website"),
        '<meta property="og:site_name" content="Simeon Atanasov">',
        '<meta property="og:title" content="%s">' % e(title),
        '<meta property="og:description" content="%s">' % e(desc),
        '<meta property="og:url" content="%s">' % url,
        '<meta property="og:image" content="%s/%s">' % (HOST, img),
        '<meta name="twitter:card" content="%s">' % card,
        '<meta name="twitter:title" content="%s">' % e(title),
        '<meta name="twitter:description" content="%s">' % e(desc),
        '<meta name="twitter:image" content="%s/%s">' % (HOST, img),
        '<script type="application/ld+json">',
        ld,
        "</script>",
        "<!-- seo:end -->",
    ]
    return "\n\t\t".join(lines)


DESC_RE = r'(<meta\s+name="description"\s+content=")[^"]*(")'
CANON_RE = r'\n([ \t]*)<link rel="canonical"[^>]*>'


def check_page(fn, spec, problems):
    kind, desc, img, name, sec = spec
    if kind not in ("home", "article", "collection", "app", "game", "page"):
        problems.append("%s: unknown kind %r" % (fn, kind))
    if len(desc) > MAX_DESC:
        problems.append("%s: description is %d characters, the limit is %d" % (fn, len(desc), MAX_DESC))
    for label, text in (("description", desc), ("llms.txt name", name),
                        ("llms.txt text", LLMS_TEXT.get(fn, ""))):
        if "\u2014" in text:
            problems.append("%s: em dash in the %s" % (fn, label))
    if sec is not None and sec not in LLMS_ORDER:
        problems.append("%s: unknown llms.txt section %r" % (fn, sec))
    if not os.path.exists(img):
        problems.append("%s: OG image %s not found" % (fn, img))
    if not os.path.exists(fn):
        problems.append("%s: page not found" % fn)
        return
    s = rd(fn)
    if not re.search(r"<title>(.*?)</title>", s, re.S):
        problems.append("%s: no <title>" % fn)
    if len(re.findall(DESC_RE, s)) != 1:
        problems.append("%s: expected one meta description" % fn)
    if not re.search(CANON_RE, s):
        problems.append("%s: no canonical link" % fn)


def page_text(fn, spec):
    kind, desc, img, _, _ = spec
    s = host_fix(rd(fn))
    title = title_of(s)
    edesc = html.escape(desc, quote=True)
    s, n = re.subn(DESC_RE, lambda m: m.group(1) + edesc + m.group(2), s, count=1)
    assert n == 1, (fn, "description")
    # drop the previous block (generated, builder-written or hand-written in the same shape),
    # then any loose og/twitter tags and any other JSON-LD block in the head
    s = re.sub(r"\n[ \t]*<!-- seo:start.*?<!-- seo:end -->", "", s, flags=re.S)
    s = re.sub(r'\n[ \t]*<meta\s+(?:property="og:|name="twitter:)[^>]*>', "", s)
    s = re.sub(r"\n[ \t]*<!-- (?:Open Graph|Twitter Card) Meta Tags -->", "", s)
    hi = s.find("</head>")
    head = re.sub(r'\n[ \t]*<script type="application/ld\+json">.*?</script>', "", s[:hi], flags=re.S)
    s = head + s[hi:]
    m = re.search(CANON_RE, s)
    assert m, (fn, "canonical")
    ins = "\n" + m.group(1) + block(fn, kind, title, desc, img).replace("\n\t\t", "\n" + m.group(1))
    return s[:m.end()] + ins + s[m.end():]


def llms_text():
    out = ["# Simeon Atanasov", "", "> " + LLMS_INTRO, ""]
    for sec in LLMS_ORDER:
        items = [(fn, v) for fn, v in PAGES.items() if v[4] == sec]
        if not items:
            continue
        out.append("## " + sec)
        out.append("")
        for fn, v in items:
            out.append("- [%s](%s): %s" % (v[3], url_of(fn), LLMS_TEXT.get(fn, v[1])))
        out.append("")
    return "\n".join(out)


def parse_lastmod(args):
    wanted = {}
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--lastmod" and i + 1 < len(args):
            v = args[i + 1]
            i += 2
        elif a.startswith("--lastmod="):
            v = a.split("=", 1)[1]
            i += 1
        else:
            sys.exit("unknown argument: %s" % a)
        fn, _, d = v.partition("=")
        d = d or datetime.date.today().isoformat()
        try:
            datetime.date.fromisoformat(d)
        except ValueError:
            sys.exit("not a date: %s" % d)
        wanted[fn] = d
    return wanted


def sitemap_text(sm, wanted):
    sm = host_fix(sm)
    def lm(m):
        fn = file_of(m.group(1))
        if fn not in wanted:
            return m.group(0)
        return re.sub(r"<lastmod>[^<]*</lastmod>", "<lastmod>%s</lastmod>" % wanted[fn], m.group(0))
    return re.sub(r"<loc>([^<]*)</loc>\s*<lastmod>[^<]*</lastmod>", lm, sm)


def main(argv):
    if not os.path.exists("CNAME"):
        sys.exit("run from the repo root")
    wanted = parse_lastmod(argv)

    # checks first: nothing is written unless all of them pass
    problems = []
    sm = rd("sitemap.xml")
    in_sitemap = [file_of(l) for l in re.findall(r"<loc>([^<]*)</loc>", sm)]
    for l, fn in zip(re.findall(r"<loc>([^<]*)</loc>", sm), in_sitemap):
        if fn is None:
            problems.append("sitemap.xml: %s is not on %s" % (l, HOST))
    missing = [fn for fn in in_sitemap if fn and fn not in PAGES]
    extra = [fn for fn in PAGES if fn not in in_sitemap]
    for fn in missing:
        problems.append("sitemap.xml lists %s, which has no PAGES entry: add it to the table" % fn)
    for fn in extra:
        problems.append("PAGES has %s, which sitemap.xml does not list" % fn)
    for fn in wanted:
        if fn not in in_sitemap:
            problems.append("--lastmod %s: not in sitemap.xml" % fn)
    for fn, spec in PAGES.items():
        check_page(fn, spec, problems)
    if problems:
        print("apply_seo.py: stopped, nothing written:", file=sys.stderr)
        for p in problems:
            print("  - " + p, file=sys.stderr)
        sys.exit(1)

    # build every output in memory, then write the ones that change
    outputs = {}
    for fn, spec in PAGES.items():
        outputs[fn] = page_text(fn, spec)
    others = [f for f in sorted(glob.glob("*.html")) if f not in PAGES]
    others += ["robots.txt",
               "Claude outputs/ai-act-digest-build/build_aia_page.py",
               "Claude outputs/cookie-digest-build/build_cookie_page.py",
               "Claude outputs/edpb-digest-build/build_digest_page.py"]
    for f in others:
        if os.path.exists(f):
            s = rd(f)
            if APEX in s:
                outputs[f] = host_fix(s)
    outputs["llms.txt"] = llms_text()
    outputs["sitemap.xml"] = sitemap_text(sm, wanted)

    changed = []
    for f, s in outputs.items():
        if not os.path.exists(f) or rd(f) != s:
            wr(f, s)
            changed.append(f)
    print("checked: %d pages in PAGES, %d in sitemap.xml, all matched" % (len(PAGES), len(in_sitemap)))
    print("written: %d file(s)" % len(changed))
    for f in changed:
        print("  " + f)


if __name__ == "__main__":
    main(sys.argv[1:])
