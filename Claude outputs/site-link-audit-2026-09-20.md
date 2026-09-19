# Site link audit: simeonatanasov.com

Date: 20 September 2026. Scope: every HTML page in the repository, the live site, the service worker and manifest, external links, search presence and backlinks. Method: a crawl of the repository on disk (`crawl.py`, 22 pages), live fetches through the browser, and web searches. What could not be checked is stated, not guessed.

## 1. Internal links and anchors

- 22 HTML pages crawled. Every internal `href`, `src`, CSS `url()` and manifest reference resolves to a file on disk. Broken internal links: 0.
- In-page anchors: every `#id` target exists, with one class of exception. The homepage and the nav link to `privacy-ai-assessment.html#tool-privacy`, `#tool-dpia`, `#tool-lia`, `#tool-ai`, `#tool-incident`, `#tool-tpsa`. Those ids are not in the HTML because `startFromHash()` in `assessment.js` reads the hash and opens the module. Not a defect (21 such links).
- `sw.js` precache list (offline page, the assessment page, main.css, main.js, one icon): all five files exist. `manifest.webmanifest` icons and shortcuts: all targets exist.
- The two digests (794 KB and 504 KB) are not in the precache list, as intended.
- Line endings: LF everywhere. Em dashes: none.
- 15 URLs in `sitemap.xml`, all real pages. `robots.txt` points to the sitemap.

## 2. External links

1,198 unique outbound URLs across the site. 1,152 of them are the source links of the three digests; 46 are everything else (certificates, badges, employer sites, CDN scripts, Formspree, Power BI, GitHub, LinkedIn, Instagram).

What was checked:

- The 46 non-digest URLs: the hosts are all live services. Two deserve a look by hand because they carry account-specific identifiers that expire or move: the Accredible certificate embed with a `?key=` parameter and the `images.credential.net` badge URL. The eDX, SoftUni, Codecademy and Accredible certificate links open only if the issuer still hosts them.
- Digest sources: the independent review of 19 September 2026 retrieved 736 of the 791 digest URLs it tested. The 55 it could not open are bot-protected or session-bound sites (Legifrance, privacy.ca.gov, law.justia, LegiScan, US state legislature sites, iso.org), not dead links. Sources marked as secondary in the cookie digest (17 entries) and the five AI Act corpus entries with source "knowledge" are listed in the two digest build READMEs as the first to re-verify.

Not checked: a full status-code sweep of all 1,198 URLs. The session's outbound proxy blocks bulk fetching (403 on `curl` both here and on your computer, and the fetch tool asks for confirmation per repository-derived URL). A sweep with a link checker on your computer is cheap and is recommended below.

Two links that work but point the wrong way:

- `index.html` line 221: the resume button links to the GitHub raw URL (`github.com/.../raw/master/resume/resume-simeon-atanasov.pdf`). The same file is served by the site at `resume/resume-simeon-atanasov.pdf` (200, 305,715 bytes). A site path keeps the visitor on the domain and survives a branch rename.
- `index.html` line 11 and 17: `og:image` and `twitter:image` are relative (`images/avatar.png`). Open Graph requires an absolute URL; LinkedIn and Slack previews of the homepage show no image. Fixed today (section 7).

## 3. Domain, redirects and canonical

Observed live:

| Request | Result |
|---|---|
| `https://simeonatanasov.com/` | redirects to `https://www.simeonatanasov.com/` (this is what `CNAME` says: `www.simeonatanasov.com`) |
| `https://www.simeonatanasov.com/` | 200, the site |
| `https://simeonatanasov.github.io/` | 302 to `https://www.simeonatanasov.com/` (no duplicate host, good) |
| `https://www.simeonatanasov.com/no-such-page` | 404, GitHub's default page |

The problem: every `<link rel="canonical">`, `og:url`, `sitemap.xml` and `robots.txt` entry says the apex `https://simeonatanasov.com/...`, but the apex redirects to www. Google resolves this (it follows the redirect and indexes www, which is what `site:` searches show) but it is a standing inconsistency: the sitemap lists 15 URLs that all redirect, and the canonical of every page points to a URL that is not the served one.

Pick one host and make the files agree. Two ways:

- Keep www as the served host (no DNS change): change canonical, `og:url`, `sitemap.xml` and `robots.txt` to `https://www.simeonatanasov.com/...`. 20 files, mechanical, I can do it on request.
- Make the apex the served host: change `CNAME` to `simeonatanasov.com` and make sure the apex has the four GitHub Pages A records (185.199.108.153, .109.153, .110.153, .111.153) and AAAA records at your DNS provider, then GitHub redirects www to apex and the existing canonicals become right. GitHub re-issues the certificate after a CNAME change, which can take up to an hour. This one is your call; I have not touched `CNAME`.

## 4. Page metadata

| Page | Title length | Description length | Notes |
|---|---|---|---|
| index.html | 68 | 173 | OG and Twitter tags present; og:image was relative (fixed); title slightly long |
| ai-act-digest.html | 31 | 293 | description far too long |
| cookie-digest.html | 42 | 285 | description far too long |
| privacy-ai-assessment.html | 57 | 328 | description far too long |
| risk-matrix-original.html | 91 | 227 | title and description too long |
| practical-privacy.html | 35 | 207 | description long |
| privacy-notice.html | 74 | 206 | title and description long |
| practical-ai-act-advice.html | 41 | 200 | description long |
| edpb-digest.html | 29 | 199 | description long |
| gdpr-readiness.html | 43 | 193 | description long |
| power-bi.html | 81 | 192 | title and description long |
| my-asteroids-game.html | 62 | 192 | title and description slightly long |
| cookie-notice.html | 78 | 189 | title and description long |
| terms.html | 30 | 168 | description slightly long |
| cookie-banner-scanner.html | 39 | 57 | description short; the only one under 160 |
| draft.html, elements.html, test-page.html | | | noindex, nofollow: fine |
| offline.html | | | noindex, no canonical: fine for a service-worker page |
| pages/cookie-notice/draft-combined.html, draft-cookies-banner.html, draft-cookies-notice.html | 11 to 17 | none | no canonical, no h1, no robots tag, not linked from anywhere, publicly served and indexable. Added `noindex, nofollow` today (section 7) |

Search engines cut descriptions at roughly 155 to 160 characters and titles at roughly 60. Nothing breaks, the snippet is just truncated. Only the homepage has Open Graph and Twitter Card tags, so shares of the digests, the tools and the advice pages get a bare link preview. Adding `og:title`, `og:description`, `og:image` (absolute) and `og:url` to the 14 public pages is a head-only edit that touches no content; I have not done it because you edited the repository today and the tags should carry the descriptions you want, which are the same ones worth shortening. Say the word and I will do both in one pass.

No JSON-LD structured data on any page. A `Person` block on the homepage (name, job title, sameAs LinkedIn and GitHub) is the one that matters for a personal site.

## 5. Things publicly served that probably should not be

Everything in the repository is served by GitHub Pages, whether linked or not:

- `Privacy Assessment.txt` (308,848 bytes, 200 on the live site): a saved copy of a third-party web application page (`mfe-host` markup, inline styles). It is not referenced by any page. It looks like a working file, not site content. If it is, delete it from the repository.
- `draft-about.txt` (981 bytes): a draft of the About block. Same.
- `onetrust-cookie-banner/` (Readme.txt, `oneTrust_production`, `oneTrust_test`): served file by file (the directory listing itself is a 404). If these carry a real OneTrust script id or domain script, they are public.
- The three `pages/cookie-notice/draft-*.html` pages, now noindexed but still reachable. Delete if unused.
- `images/risk-matrix-desktop.png`, `risk-matrix-phone.png`, `risk-matrix-tile2.png`, `risk-matrix.psd`, `risk-matrix.tif`, `Risk_List_with_Graph.xlsx`: the site uses only `risk-matrix-tile.png`. The PSD and TIF are source files; harmless but public.

None of these is a link problem; they are listed because a link audit is when they get noticed.

## 6. Search presence and backlinks

- `site:simeonatanasov.com`: the homepage and the cookie notice are indexed, on the www host. The digests and tools added on 19 September are too new to show; the sitemap is in place, so they will follow. Submitting the sitemap in Google Search Console (property `www.simeonatanasov.com` or a Domain property) speeds this up and is the only way to see which pages Google actually holds.
- `"simeonatanasov.com"` and `"simeonatanasov.github.io"` outside the site: the only pages that mention the domain are the GitHub profile and the repository itself. A Substack privacy newsletter that surfaced in a name search was checked and does not mention you. No third-party backlinks were found through web search. Web search is a weak backlink tool; Search Console's Links report (free, needs the property verified) and a one-off check in a backlink index (Ahrefs Webmaster Tools is free for a verified site) are the way to know.
- The repository README on GitHub is the one inbound link, and it is `nofollow`. The links that would carry weight for a site like this are the LinkedIn profile website field (check it points at the site, not the github.io host), the IAPP member directory if it allows a URL, and the certificate pages that can link back.

## 7. Applied today

Head-only or new-file changes, no content touched, every write verified by hash:

1. `index.html`: `og:image` and `twitter:image` now `https://simeonatanasov.com/images/avatar.png`. Nothing else in the file changed.
2. `pages/cookie-notice/draft-combined.html`, `draft-cookies-banner.html`, `draft-cookies-notice.html`: `<meta name="robots" content="noindex, nofollow">` added in the head.
3. `404.html` added at the root, in the style of `offline.html`, with links to the homepage and the four main sections. GitHub Pages serves it automatically for any missing URL; the default GitHub 404 is gone.
4. `Claude outputs/edpb-documents-inventory-2026-09-19.csv` written (the README listed it but the file was missing from the repository).
5. `README.md`: the three "delete it" notes on the study pack, the report and the AI Act digest removed, since the old builds are gone; `404.html`, the draft pages and this audit added to the tables.
6. `favicon.ico` at the root, a copy of `images/favicon/favicon.ico`, so the bare `/favicon.ico` request browsers and crawlers make stops answering 404.

## 8. Recommended, not applied

In order of value:

1. Decide the host (section 3) and make canonical, sitemap, `og:url` and `robots.txt` agree with `CNAME`.
2. Verify the site in Google Search Console and submit `sitemap.xml`. This is also where backlinks and index coverage become visible.
3. Shorten the descriptions over 160 characters (14 of the 15 public pages; the three over 280 first) and the six titles over 60 (section 4), and add OG tags to the 14 public pages in the same pass.
4. Point the resume button at `resume/resume-simeon-atanasov.pdf`.
5. Remove `Privacy Assessment.txt`, `draft-about.txt` and the unused risk matrix images from the repository; decide on `onetrust-cookie-banner/`.
6. Run a link checker over the 1,198 external URLs from your computer (for example `npx linkinator https://www.simeonatanasov.com --recurse --skip "github.com|linkedin.com|instagram.com"`; LinkedIn and Instagram always answer 999 or 429 to bots). Expect the Legifrance, iso.org and US legislature sources to fail the same way they failed the reviewer; open those by hand.
7. Add a `Person` JSON-LD block to the homepage.
