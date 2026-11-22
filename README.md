# simeonatanasov.com: site map

Personal portfolio and privacy reference site, published through GitHub Pages at
`https://www.simeonatanasov.com`. This file is the map: what each page is, where its
code lives, how to rebuild the generated pages, and where the build material is kept
(`Claude outputs/`, a separate private repository since 22 November 2026). Last updated
22 November 2026.

## Pages

Page HTML sits at the repo root. Each page's own CSS and JS live in `pages/<name>/`.
Shared chrome is `assets/css/main.css` (html5up template plus custom blocks appended at
the end) and `assets/js/main.js` (template code plus two appended IIFEs: the measured
nav collapse and the assessment dropdown).

### Tools (interactive, state stays in the browser)

| Page | What it is | Code |
|---|---|---|
| `gdpr-readiness.html` | GDPR Readiness Assessment. Record which of 71 privacy management activities you perform (13 categories, 13 scope questions) and the tool derives which GDPR Articles they evidence. Scores by category, by Article and as a gap list; Save / Load / Clear / Forget; Excel export. | `pages/gdpr-readiness/` : `readiness.js`, `readiness-data.js` (the model), `readiness.css` |
| `ai-governance-crosswalk.html` | AI Act, ISO/IEC 42001 and NIST AI RMF crosswalk (3 October 2026): 28 AI Act obligations split by provider, deployer and GPAI provider, each mapped to ISO/IEC 42001 clauses and Annex A controls (numbers and titles only) and NIST AI RMF subcategories (verbatim), with gaps marked; reverse views by ISO and by NIST; the NIST-hosted AI RMF to ISO/IEC 42001 crosswalk. Generated from `Claude outputs/ai-crosswalk-build/`. | `pages/ai-crosswalk/` : `crosswalk-data.js` (generated), `crosswalk.js`, `crosswalk.css` |
| `privacy-crosswalk.html` | GDPR, ISO/IEC 27701 and NIST Privacy Framework crosswalk (16 November 2026): 36 GDPR obligations for controllers and processors, each with the NIST Privacy Framework 1.0 subcategories that address it (verbatim; every reference is the site's own reading, marked where the third-party GDPR crosswalk hosted by NIST agrees) and the ISO/IEC 27701 clauses a published mapping pairs with its provisions, **in the numbering of the withdrawn 2019 edition** (numbers and titles only); gaps marked for NIST; reverse views by clause and by subcategory; the two Data Protection Mapping Project mappings as published (MIT). Generated from `Claude outputs/privacy-crosswalk-build/`. | `pages/privacy-crosswalk/` : `crosswalk-data.js` (generated), `crosswalk.js`, `crosswalk.css` |
| `privacy-ai-assessment.html` | Ten assessment tools behind one landing page: Privacy Assessment (DPIA screening), Full DPIA, Legitimate Interest Test, AI Risk Assessment, Incident & Breach Severity (ENISA method), Third-Party Security Assessment, and since 2 October 2026 Fundamental Rights Impact Assessment (AI Act Art. 27), Generative AI Risk Assessment (NIST AI 600-1, OWASP LLM Top 10) and Transfer Impact Assessment (EDPB Rec. 01/2020), and since 3 October 2026 the AI Assessment Pathway (`#tool-aipath`: one intake, impact level I to IV, generative AI and EU AI Act modules on triggers, one register mapped to NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore GenAI framework, FRIA and DPIA handovers). 104 steps, 534 questions (the AI Risk Assessment gained the Annex I product-route question and an Unresolved outcome on 19 September 2026). | `pages/privacy-ai-assessment/` : `assessment.js` (all ten tools and their scoring), `assessment.css` |
| `risk-matrix-original.html` | Interactive risk matrix over a risk library. | `pages/risk-matrix-front-end/` |
| `cookie-banner-scanner.html` | Front end for the cookie banner scanner. The backend is a separate project, `scan-banner-api`, deployed on Render. | inline; keeps a `localhost:3005` dev fallback on purpose |
| `power-bi.html` | GDPR fines in Europe dashboard (embedded). The iframe is consent gated: it carries `data-cc-src` rather than `src`, so Microsoft is not contacted until the visitor allows group C0002, and a click to load card stands in its place until then. A `<noscript>` block explains the same thing when JavaScript is off. | inline |
| `gdpr-fine-calculator.html` | GDPR Fine Calculator. Enter an annual turnover and a violation type and the tool benchmarks it against published enforcement decisions where the fined undertaking's turnover is known: peer median, 25th to 90th percentile, and the Art. 83 statutory ceiling (percentage or the absolute floor, whichever is higher). Shows the peer cases used and a log-log scatter. No state. | `pages/gdpr-fine-calculator/` : `calculator.js`, `calculator-data.js` (353 indexed decisions), `calculator.css` |
| `gdpr-fines-analytics.html` | GDPR Fines Analytics. Build your own chart of every published fine: measure (count, total, average, median), group by country, sector, authority, violation type, GDPR Article or year, optionally split by a second dimension, filter by search, country, sector, violation type and year. Bar, column, donut and line charts, a linear or log scale for money, a data table, PNG and CSV download, and a Copy link button that reopens the exact view (the state lives in the URL hash). Data is the enforcement tracker's case list (3,275 decisions to 3 Sept 2026), rebuilt with `Claude outputs/fines-analytics-build/`. No state. | `pages/gdpr-fines-analytics/` : `analytics.js`, `analytics-data.js`, `analytics.css`, `chart.umd.min.js` (Chart.js 4.5.1, MIT, self-hosted so nothing third-party loads) |
| `notice-generators.html` | Notice and policy generators (12 and 13 November 2026): a privacy notice for four audiences under the GDPR (Articles 12 to 14 and WP260) and, when ticked, the UK GDPR, the Swiss FADP, Brazil's LGPD, Canada's PIPEDA with the Quebec, Alberta and British Columbia laws, India's DPDP Act, China's PIPL, Japan's APPI, South Korea's PIPA, Singapore's PDPA, Australia's Privacy Act, South Africa's POPIA, the California CCPA and the consumer privacy laws of 22 other US states; an AI transparency notice (Article 50 AI Act and the Commission guidelines C(2026) 7702, plus Articles 26(7), 26(11) and 86), a data protection policy template built from the 71 GDPR Readiness activities, and an AI policy template with an optional responsible AI statement. Each output carries a completeness check citing its source row. Live preview, Save/Load/Clear/Forget in localStorage key `ng-v1`, downloads as HTML or Markdown, print to PDF. Built from `Claude outputs/notice-generators-build/`; rules in the project doc `claude/notice-generators-matrix.md`. | `pages/notice-generators/` : `ng.css`, `ng-data.js`, `ng.js`; also loads `pages/gdpr-readiness/readiness-data.js` read only |
| `my-asteroids-game.html` | Asteroids game, keyboard and touch. | `pages/my-asteroids-game/` |

### Reference pages (written content, no state)

| Page | What it is | Code |
|---|---|---|
| `practical-privacy.html` | Practical Privacy: 18 recurring situations (surveillance, offboarding, mailbox access, meetings, remote work, surveys, talent data, rights requests, sensitive data, consent, secondary use, external requests, AI, regulators, digital products, breach response, records, marketing), each with key actions, never-do list and worked examples; updated 19 September 2026 with the report's add-later items (soft opt-in, Article 48, Digital Omnibus note, recent case law, EDPB citations, UK and Australian dates). Side contents (each situation with its parts), search with results, on-this-page bar, Top button. | `pages/privacy-ai-assessment/practical-privacy.css`; navigation added by `Claude outputs/site-nav-build/apply_nav.py` |
| `practical-ai-act-advice.html` | Practical AI Act Advice: 13 sections from scope and prohibitions through provider and deployer duties, GPAI, conformity, governance, then program building, risk questions, vendor vetting, literacy and copyright. Updated for Regulation (EU) 2026/1744 on 19 September 2026, plus the report's add-later items (governance status, EDPB AI references) and, the same night, the corrections from an independent review (governance and penalty dates, open-source GPAI relief, both Article 6 routes, registration scope, SME fine cap, Article 4a, Article 50 in four parts, FRIA mechanics, log retention, deployer suspension duty). Side contents (each section with its parts), search with results, on-this-page bar, Top button. | `pages/privacy-ai-assessment/practical-ai-act.css`; navigation added by `Claude outputs/site-nav-build/apply_nav.py` |
| `edpb-digest.html` | EDPB Digest: every document on the EDPB listing (533 as of 28 September 2026) plus the 11 documents then at consultation stage (Guidelines 1/2024 on legitimate interests, 01/2025 on pseudonymisation, 04/2026 on imposing fines, 1/2026 on scientific research, 02/2026 on anonymisation, 03/2026 on web scraping, the DPIA and breach templates, two Recommendations and the DMA joint guidelines) in a group of their own, with one takeaway each, 118 written from the document and 426 one-line descriptions; filters by type, year and relevance. Corrected 19 September 2026 after an independent review (six one-liners described the wrong document, status updates for Europrivacy and the EPO and Brazil adequacy decisions, dates, and the BCR and accreditation one-liners now say the EDPB gave an opinion and the authority approves). Updated 28 September 2026: Guidelines 3/2025 on the DSA and the GDPR moved from consultation to final, Guidelines 04/2026 on imposing fines added as a consultation version. Updated 23 October 2026: nine documents added (Statement 1/2026 on smart glasses with a written takeaway, the smart glasses expert report, Opinions 22 to 28/2026 on BCRs), 553 entries, 119 written; the EDPB listing now also shows consultation-stage documents, which the digest keeps in their own group. | `pages/edpb-digest/edpb-digest.css`; generated from `Claude outputs/edpb-digest-build/` |
| `cookie-digest.html` | Cookie Compliance Digest: 263 laws, regulator guidance documents, court decisions, enforcement actions and standards on cookies and tracking across 66 jurisdictions (EU, member states, UK, Switzerland, US federal and states, rest of world, standards), each with a practitioner takeaway; filters by jurisdiction, type and year. Fourteen entries corrected 19 September 2026 after an independent review (Article 3 scope, ICO child expectations, the Amazon Turkey fine allocation, California and Oregon figures, Nigeria and Mexico wording, Consent Mode mapping, Safari's seven-day cap, the Digital Omnibus joint opinion, DMA dates). Updated 23 October 2026: California SB 690 signed (Chapter 976, Statutes of 2026), the Council's Digital Omnibus mandate added (cookie rules stay in ePrivacy Article 5(3)), GPC Working Draft of 24 September 2026. Updated 27 October 2026: Article 29 Working Party Opinion 04/2012 on Cookie Consent Exemption (WP 194) added, the EU-level reading of the two Article 5(3) exemptions and the rule that a cookie with several purposes is exempt only if every purpose is. Updated 2 November 2026: the CNIL consolidated recommendation on cookies and other trackers (16 January 2026) and Deliberation 2025-131 on multi-device consent (18 December 2025) added; recommendation 2020-092 marked superseded as a document. | `pages/cookie-digest/cookie-digest.css`; generated from `Claude outputs/cookie-digest-build/` |
| `ai-act-digest.html` | AI Act Digest in two parts. Part 1: Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, all 119 articles (including 4a, 60a and 75a to 75d) and 14 annexes by chapter, each with a takeaway, date of application, roles bound, recitals and a note on the 43 provisions the Omnibus changed. Part 2: 59 guidance and implementation documents (Commission guidelines, codes, templates, Q&As, standards, data protection authorities: the EDPB and EDPS including Opinion 28/2024, and since 28 September 2026 the Irish DPC's AI supervision report, national laws, reference tools; since 23 October 2026 Implementing Decision (EU) 2026/2274 citing EN 18286, with Ireland and France rewritten). A high-level summary of the Act in ten sections, an obligations checker (role, scope, prohibitions, Annex I and III, GPAI, Article 50; result with the articles to read and the dates), a sticky side contents (chapters with sections, or all articles flat; a drawer on small screens), a Structure of the Act overview with a 180-recital grid that filters the provisions citing a recital, plus filters by part, role, application date, Omnibus flag and search. | `pages/ai-act-digest/ai-act-digest.css`; generated from `Claude outputs/ai-act-digest-build/` |
| `gdpr-enforcement.html` | GDPR Enforcement in Europe: how a complaint becomes a fine and where the courts come in. The two tracks (authority and direct court claims) as flow diagrams, the authority procedure step by step, the one-stop-shop and EDPB binding decisions, the GDPR Procedural Regulation (EU) 2025/2518, who can go to which court, the CJEU compensation rules, a tile map answering three questions (who fines and which court reviews it, can public bodies be fined, does an appeal hold payment), a comparison table, and a section per country for the 27 EU and 3 EEA states plus the UK and Switzerland for contrast (authority, law, complaint, procedure, fines, appeals, direct claims, cases, sources). Researched and independently verified 2 October 2026; pending cases, bills and officeholders rechecked 23 October 2026 (Clearview Court of Appeal, TikTok fine reference to the CJEU, Dillon, the BfDI, the Dutch publication duty, a Swiss bodycam ruling, the EDPB fining guidelines). Country search and EU / EEA filters, on-this-page rail. No state. | `pages/gdpr-enforcement/` : `enforcement.css`, `enforcement.js`; generated from `Claude outputs/gdpr-enforcement-build/` |
| `privacy-enforcement-worldwide.html` | Privacy Enforcement Worldwide, the companion of GDPR Enforcement in Europe: four enforcement models (regulator fines, regulator must go to court, courts or prosecutors only, nobody yet), six differences from the GDPR, a world tile map with three views (who can impose a penalty, is the maximum linked to turnover, can individuals sue for damages) and an EU tile linking back, a comparison table, and a section per jurisdiction for the 23 outside Europe that the digests cover (United States, Canada, Mexico, Colombia, Brazil, Argentina, Turkey, Israel, Saudi Arabia, UAE, Nigeria, Kenya, South Africa, India, China, South Korea, Japan, Thailand, Vietnam, Philippines, Singapore, Indonesia, Australia). Researched and independently verified 2 October 2026; pending cases, bills and laws in transition rechecked 23 October 2026 (Coupang's court challenge, Indonesia's Constitutional Court case number, Brazil's Law 15.352, the US SECURE Data Act, Australia's tranche 2 draft); Israel's enforcement record checked against the PPA's own notices on 2 November 2026 (four Amendment 13 sanctions, the earlier administrative fine, findings without a sanction). Region filter and search, on-this-page rail. No state. | shares `pages/gdpr-enforcement/` : `enforcement.css`, `enforcement.js`; generated by `build_world_page.py` in `Claude outputs/gdpr-enforcement-build/` |

**Header nav (19 September 2026).** Every page except the home page carries the same
four-item header: Home, Privacy, AI, Cookie Compliance. The three topics are dropdowns
(the `assessment-menu` / `assessment-submenu` classes in `main.css`, reused as they are):
Privacy holds Practical Privacy, Privacy & AI Assessment, GDPR Readiness, EDPB Digest, GDPR
Fines Dashboard and Risk Matrix; AI holds AI Act Advice, AI Act Digest and AI Risk Assessment;
Cookie Compliance holds Cookie Digest and Cookie Scanner. The current page's topic and entry
are marked active. Below 736px `main.js` now always collapses the header into the Menu
panel, where each topic lists its pages inline, because the dropdowns open on hover. The
Asteroids game is reachable from the home page Portfolio menu and the sitemap only. The home
page sidebar's Portfolio submenu is grouped the same way (Privacy, AI, Cookie Compliance,
Other) with the three digests added; the page sections themselves are unchanged.

`assets/js/back-to-top.js` and `assets/css/back-to-top.css` add a Top button to the three
long tool pages (GDPR Readiness, Privacy & AI Assessment, Risk Matrix); the digests and
advice pages carry their own. `.site-top` sets `width: auto` on purpose: the risk matrix
stylesheet gives bare `button` elements `width: 100%` below 736px, which stretched the
fixed Top button across the footer and hid the cookie notice link (fixed 20 September 2026).
A page stylesheet that styles bare `button` will do the same to any future floating control. Short pages (home, dashboard, scanner, game, legal) have none.

The three digests and the two advice pages share one navigation pattern: an on-this-page bar, a sticky side contents
(grouped, with an all-documents view, scrollspy, copy-link and open-source actions, a drawer
on small screens), a filters box with a first-result button, a list of the first ten matches
and an explainer, a Top button, and two small floating buttons at the bottom left (double
chevron plus EXP or COL) that open or close every block of the side contents (added 20
September 2026; narrow enough to sit in the gutter beside the contents column; they
appear once the contents has scrolled into the upper half of the screen, the way the Top
button appears on the right; grouped view only; on small screens only while the drawer
is open). The EDPB and cookie pages take it from `digest_nav.py` in their build folders; the
AI Act page carries its own copy. All three
digests are in the header nav, the home page Portfolio menu and `sitemap.xml`; they are
not in the `sw.js` precache (deliberately, given their size).

### Home, legal and leftovers

| Page | Notes |
|---|---|
| `index.html` | Home and portfolio. The Career & Education section is maintained by hand and is off limits to any automated edit. Sidebar portfolio menu: `assets/css/home-extra.css` and `assets/js/portfolio-menu.js` (behaviour spec below). Since 26 October 2026 (HOME-01) the nine portfolio tiles carry a small animated scene over or in place of their image: `assets/css/home-tiles.css` and `assets/js/home-tiles.js`, loaded from the head and used by no other page. Only transform and opacity animate; the scene enters when the tile lights up, plays again on hover or focus (on a phone, when the tile reaches mid-screen), and stands still under `prefers-reduced-motion`. Both files are generated: see `Claude outputs/tile-animation-build/`. |
| `cookie-notice.html` | Cookie notice, rewritten 24 September 2026 from a full site scan rather than from the previous version. Cookies are grouped by what triggers them (home page, dashboard page, everything else), and the "last verified against a full site scan" date at the top is the thing to update after each rescan. Native `<details>`, no script of its own. See `claude/cookie-consent.md`. |
| `privacy-notice.html` | Privacy notice, rewritten 24 September 2026 against what the site actually does: one block per processing activity (contact form, cookie banner scanner, plain page visits, embedded content, browser storage), each with its data, purpose, Article 6 basis, recipients and retention, plus transfers, an explicit "what does not happen" section, rights and the supervisory authority. Controller is Simeon Atanasov as a private individual in Bulgaria. See `claude/legal-pages.md`. |
| `terms.html` | Terms of use. Governing law is Bulgaria as of 24 September 2026 (it said Spain, which did not match where the author is established), and the intro now names `simeonatanasov.com` rather than the old `github.io` host. |
| `offline.html` | Offline fallback served by the service worker. |
| `404.html` | Custom not-found page in the same style as `offline.html`, served by GitHub Pages for any missing URL. Added 20 September 2026. |
| `pages/cookie-notice/draft-*.html` | Three unlinked cookie banner drafts, noindexed 20 September 2026. Delete when no longer needed. |

### PWA layer

`manifest.webmanifest`, `sw.js` and `.nojekyll` at the root, `assets/js/pwa.js` registering
the worker, `images/favicon/maskable-512x512.png` as the Android adaptive icon. Every root
page carries a PWA block before `</head>`. `.nojekyll` is what lets `.well-known/` be served;
deleting it silently breaks the Android app's domain verification. `images/favicon/site.webmanifest`
is stale and unreferenced; the live manifest is the root one.

`pwa.js` does one more job since 24 September 2026: it injects the consent pair into the
head of every page. That is why the consent layer needed no per-page script tag. A page
added without the PWA block therefore gets no cookie banner. Since 7 October 2026 it
injects the site assistant pair the same way (see Site assistant below).

### Consent layer

`assets/js/cookie-consent.js` and `assets/css/cookie-consent.css`, added 24 September 2026.
A banner on first visit, a preference centre with per-category switches, and an expanding
cookie details panel per category. No OneTrust, no third-party request, no cookie of its
own: the choice lives in `localStorage` under `cc-consent`, versioned, expiring after a
year.

Two groups, named on the OneTrust convention so a later migration maps cleanly: C0001
strictly necessary (locked: the consent record, and since 22 November 2026 the browser
storage entry of the robot check behind AI answers) and C0002 performance (the Power BI
embed). C0003 functional (certificate badges and institution logos) was removed on 22
November 2026 (CONSENT-01): those images have been served from this site since 17 November,
so it gated nothing. A consent record saved before that still loads; its C0003 entry is
ignored.

**How to block something.** Give the element `data-cc-src` instead of `src`, plus
`data-cc-group="C0002"` or whichever group applies. Nothing is requested until the script
puts the URL back. Add `data-cc-placeholder` to an iframe and a click to load card is drawn
in its place. Nothing else is needed; there is no list of hosts to maintain.

**What the details panel lists** comes from the `items` array on each group at the top of
`cookie-consent.js`. That array and `cookie-notice.html` describe the same cookies in two
places, so after a scan update both, or they drift apart.

Both files are in the `sw.js` precache, and `VERSION` went to `v2` when they shipped.

**Revocation runs the same logic in reverse.** Turning a category off unloads its content
immediately, with no reload: the URL moves back from `src` to `data-cc-src` and the
placeholder returns. For an iframe the element is replaced with a clone carrying no
source, because removing `src` does not unload the document already inside one, and its
scripts and timers would otherwise keep running. What it cannot do is delete cookies a
provider has already set, since no site can reach another origin's storage, and both
notices say so.

The banner and the preference centre each link to `cookie-notice.html` and
`privacy-notice.html`.

`window.CookieConsent` exposes `isAllowed(id)`, `accepted()`, `groups()`, `acceptAll()`,
`rejectAll()`, `showPreferences()`, `onChange(fn)` and `reset()`.

### Site assistant

`assets/js/assistant.js` and `assets/css/assistant.css`, added 7 October 2026, loaded on
every page by `pwa.js` like the consent pair. An "Ask" launcher at the bottom right (placed
at runtime above whatever Top or Contents button the page already has, and hidden while the
cookie banner is up) opens a panel that searches the whole site: the three digests, the two
advice pages, the explanation and question bank of each assessment tool, the readiness
activities, the crosswalk rows, the enforcement sections and country cards, the fine
calculator explainer, the two notices, the notice and policy generators page (its explainer and
one passage per law the privacy notice covers; SA-09, 13 November 2026), a tool catalogue and a
short FAQ. Every result deep
links to the entry it came from; a "Which assessment do I need?" chooser recommends a tool.
From the second character typed, five suggested questions appear under the box and change
with every keystroke (`assets/assistant/questions.json`, 8,803 questions on 22 November 2026, each tied to
the passage that answers it, ranked by plausibility; the written layer lives in
`Claude outputs/assistant-build/questions_written.json`, and questions real visitors asked go
in `questions_asked.json` there, where they outrank the rest); choosing one pins its answer
first.

Everything runs in the browser. The index, `assets/assistant/index.json` (about 2 MB, 490 KB
compressed, fetched when the panel first opens), is built by
`Claude outputs/assistant-build/build_index.py` from the digest JSON, the study guides and
the page data files; the ranking is BM25 over Porter-stemmed tokens with the question
expanded by a synonym and abbreviation table that ships inside the index. The search
itself sends nothing anywhere and stores nothing (only an AI answer does, below, and only
on request), and the ranking uses no language model: a distilled on-device model was measured
and scored lower than this (see the build folder's README). **Rebuild the index after any digest rebuild, advice page edit, study pack rebuild
or tool change**, or the assistant keeps showing the old text. Both files are in the
`sw.js` precache; `VERSION` went to `v8` when they shipped and `v9` with the question bank. The script also opens a closed
`<details>` that a deep link points into, on every page, on load and on hash change.

**AI answers (SA-02, live since 22 November 2026).** Under the results, a button asks an AI
to answer from them. Only that press sends anything: the robot check (Cloudflare Turnstile)
runs, and the question, up to five of the passages found and the check's one-time code go
to a Cloudflare Worker, where Workers AI writes a short answer with Llama 3.3 that cites the
passages it rests on and is labelled as AI-generated (`data-ai-generated="true"`). Ten
answers a day per visitor and 50 a day across the site (the Worker variables `VISITOR_CAP` and
`DAILY_CAP`, raised from 5 and 30 on 22 November 2026); the same question with the same
passages is answered from a store for up to 30 days instead of running the model again. The
Worker, its tests and the list of protections are in `Claude outputs/assistant-ai-build/`
(README there). The privacy notice covers it in its `#ai-answers` block, and the cookie
notice and C0001 list the robot check's browser storage entry. Setting the Worker variable
`ENABLED` to `0` switches the feature off.

### Libraries served from this site

`assets/js/vendor/` (22 November 2026, CONSENT-01): `xlsx.full.min.js` (SheetJS 0.18.5, the
Excel export of the cookie banner scanner), `xlsx-js-style.bundle.js` (xlsx-js-style 1.2.0,
the Excel exports of GDPR Readiness and the risk matrix) and `chart.umd.min.js` (Chart.js
4.6.1, the risk matrix), each unchanged from its npm package, with the licences beside them
as `LICENSE-*.txt`. The three pages loaded them from cdn.jsdelivr.net before, without asking.
No page now loads anything from another organisation except the Power BI embed, behind
consent, and, on request, the robot check and the Worker behind AI answers. The two Excel
libraries contain the em dash character in their character-set tables: that is data, kept
as published. To update one, replace the file with a newer npm release, test the page's
export and bump `VERSION` in `sw.js`: the service worker serves same-origin scripts stale
while it revalidates, so without the bump a returning visitor gets the old copy once more.

## Claude outputs/ (a separate private repository)

Since 22 November 2026 (MOVE-05) the build scripts, tests, study guides, working docs and
the to-do list (`TODO.md`) live in `Claude outputs/` as a repository of their own, kept
private. This repository ignores the folder (`.gitignore`), so none of it is published
here or on the site; the paths named in this file stay valid on disk. Its own `README.md`
lists every file in it. Versions pushed before that date remain in this repository's
history.

## Working notes kept outside the repo

The Claude project "Simeon" holds the carry-over documentation for whoever edits the site
with Claude: `site-context.md` (rules, deploy procedure, technical traps, open items),
`content-voice.md` (how the site is written), `assessment-tools-spec.md` and
`gdpr-readiness-model.md` (the two large tools), `pwa-and-play-store.md`,
`content-verification-2026-09.md` (the rated action list from the verification),
`edpb-digest.md`, `cookie-digest.md` and `ai-act-digest.md` (what the digests are and how to
rebuild them), `gdpr-fine-calculator.md` (the build log for the fine calculator: the dataset,
the turnover research rules, the Power BI date defect and the Article parser) and
`gdpr-fine-calculator-explained.md` (how it works, for explaining it; copied into
`Claude outputs/`), `chatgpt-review-audit-2026-09.md` and `site-link-audit-2026-09.md` (copies of
the two audits above), `folder-map.md` (which folder to connect). For the verification work:
`verification-method.md` (how to run a check, the techniques, and the authoritative rerun
order after a rebuild) and, one per pass, `source-verification-2026-09.md`,
`digest-source-coverage-2026-09.md`, `retry-verification-2026-09.md`,
`live-recheck-2026-09.md` and `law-verification-2026-09.md`.

## Rules that apply to every edit

- No em dashes anywhere: page copy, code comments, commit text.
- British spelling. Company-agnostic content: no employer, team or system names.
- Sentence case headings, one `h1.major` per content page, titles `Simeon Atanasov | <Page>`.
- **Page copy sits on a dark navy wrapper.** Any panel or card added to a content page has
  to set its own text colour, or it inherits near-white and disappears. Use a translucent
  white background (`rgba(255, 255, 255, 0.07)`) rather than a light fill, and check the
  result: the notice pages measure 6:1 or better on every element.
- `assets/css/main.css` is CRLF; edit it in binary mode or it silently converts to LF. Root
  HTML files are LF.
- The html5up template styles every `button` (tall, uppercase, nowrap); custom buttons must
  reset height and line-height, and declare their own `width`, `min-width`, `max-width` and
  `left` so a page rule like the risk matrix page's `button { width: 100% }` cannot claim
  them. It does not style `input[type="search"]`; use `type="text"`. It also hides native
  checkboxes in favour of a styled sibling label, so a standalone checkbox renders invisible:
  use `<button role="switch">` instead, as the consent preference centre does.
- Changing `assets/js/pwa.js` or either consent file means bumping `VERSION` in `sw.js`.
  Both are `.js` or `.css`, so the service worker serves them stale while revalidate, and
  without a bump a returning visitor runs the previous copy for one more visit. With the
  consent layer that visit has no banner and a blank gap where a gated embed should be.
- The site assistant pair (`assets/js/assistant.js`, `assets/css/assistant.css`) is loaded
  by `pwa.js` as well, so the same bump rule applies to it, and its index
  (`assets/assistant/index.json`) must be rebuilt after any content change it covers.
- The home tile scenes (`assets/css/home-tiles.css`, `assets/js/home-tiles.js`) load on the home
  page only, so a change to them needs no `VERSION` bump for the rest of the site, but the
  service worker serves them stale while revalidate like any asset: a returning visitor sees
  the previous scenes for one more visit unless `VERSION` is bumped. Edit the generator in
  `Claude outputs/tile-animation-build/`, not the two files.
- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.
- The generated pages (three digests, two advice pages) are written by builders whose header
  template predates the current four-item nav: after any rebuild, copy the current header block
  from another root page and set the active marks. Details in each build folder's README.
- Canonical tags, `sitemap.xml`, `robots.txt`, `llms.txt` and `og:url` use
  `https://www.simeonatanasov.com/`, matching `CNAME` (switched from the apex on 23 September 2026).
- Meta descriptions, Open Graph and Twitter tags and JSON-LD structured data are generated by
  `Claude outputs/seo-build/apply_seo.py` from one table, between `<!-- seo:start -->` and
  `<!-- seo:end -->` in each page head. It also regenerates `llms.txt` (a page may carry a longer
  line there, `LLMS_TEXT`). Edit the table, not the pages, and rerun it after any rebuild of a page
  whose builder writes its own head: the three digests, `apply_nav.py`, the two enforcement
  builders, the two crosswalk builders and the notice generators' `build_page.py`. It is idempotent,
  checks before writing that every sitemap page is in its table, and leaves the sitemap `lastmod`
  dates alone (`--lastmod page.html[=YYYY-MM-DD]` sets one on purpose). Brought up to date on
  16 November 2026 (SEO-01): 21 pages, as in the sitemap; 22 since the privacy crosswalk was added the same day (NAV-05).

## Homepage portfolio menu: required behaviour

- On wide desktop (`>=1281px`) with the sidebar visible, hovering `Portfolio` shows a floating
  menu to the right of the sidebar. On medium screens (`737px-1280px`) the same menu drops
  below the item. Below `736px` the sidebar is hidden and the menu stays off.
- The menu shows all project links as stacked rows, stays open while the pointer moves into
  it, navigates on click, and must not overlap content, change spacing or create horizontal
  scroll. `Portfolio` stays a plain menu item, no arrow.
- Implementation: `.portfolio-submenu` is moved out of the sidebar to `<body>` at load and
  positioned `fixed` from the sidebar's and item's bounding boxes, because `overflow-y: auto`
  on the sidebar forces `overflow-x` to `auto` and would clip it. Nav item spacing comes
  from the site's normal margin; do not add `margin: 0` to `.portfolio-menu`.

## Local preview

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`. The site's own domain is not reachable from Claude's
sandbox, so live checks of headers and redirects are done in a browser.

## Deployment

Commit and push with GitHub Desktop. GitHub Pages publishes automatically. The cookie
scanner backend (`scan-banner-api`) deploys separately on Render.
