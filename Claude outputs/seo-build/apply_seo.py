"""Search and AI crawler metadata for simeonatanasov.com, from one definition.

Run from the repo root:  python3 "Claude outputs/seo-build/apply_seo.py"

Idempotent. Rerun it after any digest rebuild or apply_nav.py run, the same way
swap_header.py is rerun: the builders write their own head, so a rebuild puts
back the long meta description and drops the metadata block.

What it does, per page listed in PAGES:
  1. Rewrites the apex host https://simeonatanasov.com to https://www.simeonatanasov.com
     (CNAME serves www; canonicals, og:url and the sitemap must match it).
  2. Sets the meta description (asserted at 160 characters or fewer).
  3. Removes any hand-written og: and twitter: tags and writes one block between
     <!-- seo:start --> and <!-- seo:end --> after the canonical link: Open Graph,
     Twitter card and JSON-LD structured data.
Then it rewrites the host in the other root HTML files, robots.txt and the three
digest builders, regenerates llms.txt, and refreshes sitemap.xml lastmod dates from
each page's modification time.
"""
import datetime, glob, html, json, os, re, sys

HOST = "https://www.simeonatanasov.com"
APEX = "https://simeonatanasov.com"
PERSON_ID = HOST + "/#person"
SITE_ID = HOST + "/#website"
MAX_DESC = 160

# file: (kind, description, og image, short name for llms.txt, llms.txt section)
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
    "ai-act-digest.html": ("collection",
        "The EU AI Act article by article, as amended by the 2026 Digital Omnibus, "
        "with takeaways, application dates and the guidance around it.",
        "images/regulatory-digests.png", "AI Act Digest", "Digests"),
    "edpb-digest.html": ("collection",
        "Every European Data Protection Board document, 543 in all, with one takeaway "
        "each: what it establishes, who it binds and what to do.",
        "images/regulatory-digests.png", "EDPB Digest", "Digests"),
    "cookie-digest.html": ("collection",
        "259 cookie and tracking laws, regulator guidance documents, court decisions and "
        "enforcement actions across 66 jurisdictions, each with a takeaway.",
        "images/regulatory-digests.png", "Cookie Compliance Digest", "Digests"),
    "privacy-ai-assessment.html": ("app",
        "Free privacy and AI governance assessments: privacy check, full DPIA, legitimate "
        "interest test, AI Act risk, breach severity and third-party security.",
        "images/pic04.jpg", "Privacy & AI Risk Assessments", "Tools"),
    "gdpr-readiness.html": ("app",
        "An accountability-based GDPR readiness assessment: record the privacy activities "
        "you perform and see which GDPR Articles they evidence.",
        "images/gdpr-readiness.jpg", "GDPR Readiness Assessment", "Tools"),
    "gdpr-fine-calculator.html": ("app",
        "Benchmark a possible GDPR fine against published enforcement decisions: see what "
        "comparable organisations paid and the statutory ceiling.",
        "images/power-bi-tile.png", "GDPR Fine Calculator", "Tools"),
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


def apply_page(fn, spec):
    kind, desc, img, _, _ = spec
    assert len(desc) <= MAX_DESC, (fn, len(desc))
    assert "\u2014" not in desc, fn
    assert os.path.exists(img), (fn, img)
    s = host_fix(rd(fn))
    title = title_of(s)
    # description
    edesc = html.escape(desc, quote=True)
    s, n = re.subn(r'(<meta\s+name="description"\s+content=")[^"]*(")',
                   lambda m: m.group(1) + edesc + m.group(2), s, count=1)
    assert n == 1, (fn, "description")
    # drop previous generated block and any hand-written og/twitter tags
    s = re.sub(r"\n[ \t]*<!-- seo:start.*?<!-- seo:end -->", "", s, flags=re.S)
    s = re.sub(r'\n[ \t]*<meta\s+(?:property="og:|name="twitter:)[^>]*>', "", s)
    s = re.sub(r"\n[ \t]*<!-- (?:Open Graph|Twitter Card) Meta Tags -->", "", s)
    m = re.search(r'\n([ \t]*)<link rel="canonical"[^>]*>', s)
    assert m, (fn, "canonical")
    ins = "\n" + m.group(1) + block(fn, kind, title, desc, img).replace("\n\t\t", "\n" + m.group(1))
    s = s[:m.end()] + ins + s[m.end():]
    wr(fn, s)


def main():
    if not os.path.exists("CNAME"):
        sys.exit("run from the repo root")
    for fn, spec in PAGES.items():
        apply_page(fn, spec)
    # host fix only: every other root page, robots.txt, the digest builders
    others = [f for f in glob.glob("*.html") if f not in PAGES]
    others += ["robots.txt",
               "Claude outputs/ai-act-digest-build/build_aia_page.py",
               "Claude outputs/cookie-digest-build/build_cookie_page.py",
               "Claude outputs/edpb-digest-build/build_digest_page.py"]
    for f in others:
        if os.path.exists(f):
            s = rd(f)
            if APEX in s:
                wr(f, host_fix(s))
    # llms.txt
    out = ["# Simeon Atanasov", "", "> " + LLMS_INTRO, ""]
    for sec in LLMS_ORDER:
        items = [(fn, v) for fn, v in PAGES.items() if v[4] == sec]
        if not items:
            continue
        out.append("## " + sec)
        out.append("")
        for fn, v in items:
            out.append("- [%s](%s): %s" % (v[3], url_of(fn), v[1]))
        out.append("")
    wr("llms.txt", "\n".join(out))
    # sitemap: host and lastmod from file mtime
    sm = host_fix(rd("sitemap.xml"))
    def lm(m):
        loc = m.group(1)
        fn = "index.html" if loc.endswith("/") else loc.rsplit("/", 1)[1]
        d = datetime.date.fromtimestamp(os.path.getmtime(fn)).isoformat() if os.path.exists(fn) else None
        return m.group(0) if not d else re.sub(r"<lastmod>[^<]*</lastmod>", "<lastmod>%s</lastmod>" % d, m.group(0))
    sm = re.sub(r"<loc>([^<]*)</loc>\s*<lastmod>[^<]*</lastmod>", lm, sm)
    wr("sitemap.xml", sm)
    print("done:", len(PAGES), "pages,", len(others), "host-only files, llms.txt, sitemap.xml")


if __name__ == "__main__":
    main()
