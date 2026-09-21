# simeonatanasov.com: site map

Personal portfolio and privacy reference site, published through GitHub Pages at
`https://www.simeonatanasov.com`. This file is the map: what each page is, where its
code lives, what sits in `Claude outputs/`, and how to rebuild the generated pages.
Last updated 21 September 2026.

## Pages

Page HTML sits at the repo root. Each page's own CSS and JS live in `pages/<name>/`.
Shared chrome is `assets/css/main.css` (html5up template plus custom blocks appended at
the end) and `assets/js/main.js` (template code plus two appended IIFEs: the measured
nav collapse and the assessment dropdown).

### Tools (interactive, state stays in the browser)

| Page | What it is | Code |
|---|---|---|
| `gdpr-readiness.html` | GDPR Readiness Assessment. Record which of 71 privacy management activities you perform (13 categories, 13 scope questions) and the tool derives which GDPR Articles they evidence. Scores by category, by Article and as a gap list; Save / Load / Clear / Forget; Excel export. | `pages/gdpr-readiness/` : `readiness.js`, `readiness-data.js` (the model), `readiness.css` |
| `privacy-ai-assessment.html` | Six assessment tools behind one landing page: Privacy Assessment (DPIA screening), Full DPIA, Legitimate Interest Test, AI Risk Assessment, Incident & Breach Severity (ENISA method), Third-Party Security Assessment. 68 steps, 338 questions (the AI Risk Assessment gained the Annex I product-route question and an Unresolved outcome on 19 September 2026). | `pages/privacy-ai-assessment/` : `assessment.js` (all six tools and their scoring), `assessment.css` |
| `risk-matrix-original.html` | Interactive risk matrix over a risk library. | `pages/risk-matrix-front-end/` |
| `cookie-banner-scanner.html` | Front end for the cookie banner scanner. The backend is a separate project, `scan-banner-api`, deployed on Render. | inline; keeps a `localhost:3005` dev fallback on purpose |
| `power-bi.html` | GDPR fines in Europe dashboard (embedded). | inline |
| `gdpr-fine-calculator.html` | GDPR Fine Calculator. Enter an annual turnover and a violation type and the tool benchmarks it against published enforcement decisions where the fined undertaking's turnover is known: peer median, 25th to 90th percentile, and the Art. 83 statutory ceiling (percentage or the absolute floor, whichever is higher). Shows the peer cases used and a log-log scatter. No state. | `pages/gdpr-fine-calculator/` : `calculator.js`, `calculator-data.js` (353 indexed decisions), `calculator.css` |
| `my-asteroids-game.html` | Asteroids game, keyboard and touch. | `pages/my-asteroids-game/` |

### Reference pages (written content, no state)

| Page | What it is | Code |
|---|---|---|
| `practical-privacy.html` | Practical Privacy: 18 recurring situations (surveillance, offboarding, mailbox access, meetings, remote work, surveys, talent data, rights requests, sensitive data, consent, secondary use, external requests, AI, regulators, digital products, breach response, records, marketing), each with key actions, never-do list and worked examples; updated 19 September 2026 with the report's add-later items (soft opt-in, Article 48, Digital Omnibus note, recent case law, EDPB citations, UK and Australian dates). Side contents (each situation with its parts), search with results, on-this-page bar, Top button. | `pages/privacy-ai-assessment/practical-privacy.css`; navigation added by `Claude outputs/site-nav-build/apply_nav.py` |
| `practical-ai-act-advice.html` | Practical AI Act Advice: 13 sections from scope and prohibitions through provider and deployer duties, GPAI, conformity, governance, then program building, risk questions, vendor vetting, literacy and copyright. Updated for Regulation (EU) 2026/1744 on 19 September 2026, plus the report's add-later items (governance status, EDPB AI references) and, the same night, the corrections from an independent review (governance and penalty dates, open-source GPAI relief, both Article 6 routes, registration scope, SME fine cap, Article 4a, Article 50 in four parts, FRIA mechanics, log retention, deployer suspension duty). Side contents (each section with its parts), search with results, on-this-page bar, Top button. | `pages/privacy-ai-assessment/practical-ai-act.css`; navigation added by `Claude outputs/site-nav-build/apply_nav.py` |
| `edpb-digest.html` | EDPB Digest: every document on the EDPB listing (532 as of 19 September 2026) plus the 11 documents then at consultation stage (Guidelines 1/2024 on legitimate interests, 01/2025 on pseudonymisation, 3/2025 on the DSA, 1/2026 on scientific research, 02/2026 on anonymisation, 03/2026 on web scraping, the DPIA and breach templates, two Recommendations and the DMA joint guidelines) in a group of their own, with one takeaway each, 117 written from the document and 426 one-line descriptions; filters by type, year and relevance. Corrected 19 September 2026 after an independent review (six one-liners described the wrong document, status updates for Europrivacy and the EPO and Brazil adequacy decisions, dates, and the BCR and accreditation one-liners now say the EDPB gave an opinion and the authority approves). | `pages/edpb-digest/edpb-digest.css`; generated from `Claude outputs/edpb-digest-build/` |
| `cookie-digest.html` | Cookie Compliance Digest: 259 laws, regulator guidance documents, court decisions, enforcement actions and standards on cookies and tracking across 60 jurisdictions (EU, member states, UK, Switzerland, US federal and states, rest of world, standards), each with a practitioner takeaway; filters by jurisdiction, type and year. Fourteen entries corrected 19 September 2026 after an independent review (Article 3 scope, ICO child expectations, the Amazon Turkey fine allocation, California and Oregon figures, Nigeria and Mexico wording, Consent Mode mapping, Safari's seven-day cap, the Digital Omnibus joint opinion, DMA dates). | `pages/cookie-digest/cookie-digest.css`; generated from `Claude outputs/cookie-digest-build/` |
| `ai-act-digest.html` | AI Act Digest in two parts. Part 1: Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, all 119 articles (including 4a, 60a and 75a to 75d) and 14 annexes by chapter, each with a takeaway, date of application, roles bound, recitals and a note on the 43 provisions the Omnibus changed. Part 2: 57 guidance and implementation documents (Commission guidelines, codes, templates, Q&As, standards, EDPB and EDPS including Opinion 28/2024, national laws, reference tools). A high-level summary of the Act in ten sections, an obligations checker (role, scope, prohibitions, Annex I and III, GPAI, Article 50; result with the articles to read and the dates), a sticky side contents (chapters with sections, or all articles flat; a drawer on small screens), a Structure of the Act overview with a 180-recital grid that filters the provisions citing a recital, plus filters by part, role, application date, Omnibus flag and search. | `pages/ai-act-digest/ai-act-digest.css`; generated from `Claude outputs/ai-act-digest-build/` |

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
| `index.html` | Home and portfolio. The Career & Education section is maintained by hand and is off limits to any automated edit. Sidebar portfolio menu: `assets/css/home-extra.css` and `assets/js/portfolio-menu.js` (behaviour spec below). |
| `cookie-notice.html`, `privacy-notice.html`, `terms.html` | Legal pages. |
| `offline.html` | Offline fallback served by the service worker. |
| `404.html` | Custom not-found page in the same style as `offline.html`, served by GitHub Pages for any missing URL. Added 20 September 2026. |
| `draft.html`, `elements.html`, `test-page.html` | Template leftovers, noindexed, kept rather than deleted. |
| `pages/cookie-notice/draft-*.html` | Three unlinked cookie banner drafts, noindexed 20 September 2026. Delete when no longer needed. |

### PWA layer

`manifest.webmanifest`, `sw.js` and `.nojekyll` at the root, `assets/js/pwa.js` registering
the worker, `images/favicon/maskable-512x512.png` as the Android adaptive icon. Every root
page carries a PWA block before `</head>`. `.nojekyll` is what lets `.well-known/` be served;
deleting it silently breaks the Android app's domain verification. `images/favicon/site.webmanifest`
is stale and unreferenced; the live manifest is the root one.

## Claude outputs/

Non-site deliverables. Nothing in here is referenced by any page.

Two conventions worth knowing before you go looking. A verification pass keeps its
scripts, change sets and raw results in a dated folder, but its **report** may sit
either at this root or inside that folder: the source verification, retry, coverage,
link audit and review audit reports are at the root, while the law verification, live
recheck and cross-reference reports are inside their own folders. The table below says
which. And a build folder or a pass folder carries its own README where one would help;
the rerun order for the apply scripts across all four digest data files is in
`claude/verification-method.md` in the Claude project, not here.

| File or folder | What it is | Read it when |
|---|---|---|
| `privacy-ai-act-assessments-study-pack-v2.pdf` | 145-page greyscale study pack (rebuilt 20 September 2026 from the corrected pages and tool; build files now in `study-pack-build/`): both reference pages in full with key-takeaway boxes, all six assessment tools with cheat sheets and full question banks, the readiness model with all 71 activities, 69 self-test questions with answers, a four-week study plan, a review card, numbered sources. | You want to learn or re-learn the site's content. |
| `site-verification-report-2026-09-19-v2.pdf` | 40-page check of the site's legal claims against GDPR, the AI Act as amended by Regulation (EU) 2026/1744, EDPB and Commission guidance, courts and national rules. Every change rated High / Medium / Low, open items, a sweep of all 47 EDPB consultations and all 532 EDPB documents, 90 sources. All fix-now and add-later items are marked done (applied 19 September 2026); the four open items on the incident and DPIA tools wait on EDPB templates. A second-pass section records the corrections applied after the independent review of 19 September 2026 (the finding-by-finding audit is `chatgpt-review-audit-2026-09-19.md`). | Before editing any legal content. |
| `edpb-documents-inventory-2026-09-19.csv` | All 532 EDPB documents with type, date, relevance rating (R / B / N), where each lands on the site, and URL. Filterable. | You want to know whether an EDPB document matters to a page. |
| `ai-act-guidance-inventory-2026-09-19.csv` | The 57 guidance and implementation documents of the AI Act Digest's Part 2 in their eight groups (the Regulation and its amendment, Commission guidelines and Q&As, codes of practice and templates, governance and policy, standards, EDPB and EDPS, national implementation, reference tools): group link, date, issuer, type, status, title, articles concerned, topics, document URL and the digest entry link. | You want the links behind Part 2 in a sheet. |
| `cookie-compliance-inventory-2026-09-19.csv` | The 259 Cookie Compliance Digest documents in their nine region groups (European Union 30, EU member states 57, United Kingdom 18, Switzerland and other Europe 11, United States: California 23, federal 14, other states 24, rest of world 53, standards and frameworks 29): group link, jurisdiction, date, type, status, title, topics, primary or secondary source, document URL and the digest entry link. | You want the links behind the cookie digest in a sheet. |
| `edpb-digest-2026-09-19.pdf` | Print version of the EDPB Digest page, 111 pages, one numbered source per document. | You want to read the digest on paper. |
| `cookie-compliance-digest-2026-09-19.pdf` | Print version of the Cookie Compliance Digest, 75 pages, one numbered source per document. | Same, for cookies. |
| `ai-act-digest-2026-09-19-v2.pdf` | Print version of the AI Act Digest, 80 pages: high-level summary, structure of the Act, application dates at a glance, the Omnibus change table, then every provision and document with a numbered source. | Same, for the AI Act. |
| `source-verification-2026-09-20.md` | Check of all three digests against the official text of the documents themselves (899 PDFs downloaded and converted in the separate `edpb-downloads` folder). 304 takeaways checked claim by claim plus 282 templated one-liners checked by script: 192 confirmed, 79 loose wordings tightened, 13 substantive errors fixed, 20 entries whose downloaded file turned out to be the wrong document. 92 corrections applied. Raw results and the change set are in `source-verification-2026-09-20/`. | Before trusting or editing a digest takeaway, and to see which entries still have no verified source. |
| `live-recheck-2026-09-20/` | Every digest entry that had no downloaded PDF, rechecked against the source page itself: 149 cookie, 31 EDPB and 44 AI Act Part 2 entries, 224 in all. **All 224 were reached.** 160 confirmed, 48 tightened, 13 substantive corrections, 3 cookie entries that did not yield a readable text. A fourth pass the same day went at the sixteen cookie entries whose takeaway had still never been read against its own source, reached every one and closed them all (11 confirmed, 3 corrections, 2 minor fixes), taking the cookie digest to 259 of 259. The corrections include a Korean fine out by a factor of one hundred, a Saudi direct-marketing carve-out that does not exist, and an EDPB-EDPS joint opinion whose recommendation the digest had backwards. 37 source links were repointed from indexes, trackers, superseded versions, metadata stubs and dead pages to the document itself: among them the seven 2018 WP29 guidelines, whose EDPB pages only name the document, and the CNIL Criteo entry, whose EDPB link died and now goes to the Conseil d'Etat decision. Three reports (`cookie-live-recheck-2026-09-20.md`, `edpb-aia-live-recheck-2026-09-20.md` and `cookie-final-sixteen-2026-09-20.md`) name every host that refused, what refused it and what finally worked, plus the full per-entry results, every attempt, the change sets and the three apply scripts. | Before re-running a link check or a download pass, and when a source link looks wrong. |
| `law-verification-2026-09-20/` | Check of the site against the two regulations themselves, not the documents that comment on them: all 133 AI Act Digest Part 1 entries against the consolidated text of Regulation (EU) 2024/1689 as amended by the Digital Omnibus (EUR-Lex CELEX 02024R1689-20260727), and every GDPR article citation in the EDPB and cookie digests against Regulation 2016/679. 85 entries confirmed, 34 tightened, 14 substantive corrections: the application dates of Articles 78 and 101 were wrong, four Omnibus notes described the law backwards, five amended provisions had no note, and two counts had gone stale. Of about 350 GDPR citations one was wrong. The same pass covered the two advice pages, which had never been verified: of 37 citations three were wrong and are fixed in place (Article 48 GDPR stated without its saving clause for other Chapter V grounds, Article 27(5) of the AI Act credited to the Omnibus, and Article 4(1)'s own words attributed to Commission guidance). The report is `law-verification-2026-09-20.md` inside this folder, with the raw results, the change set, `apply_law_review.py` and the agent briefs beside it. | Before trusting an application date, an Omnibus note or an article citation, and before editing a Part 1 entry. |
| `xref-verification-2026-09-20/` | The article and annex references carried by the 57 AI Act Digest Part 2 entries, checked against the consolidated Regulation (EU) 2024/1689 as amended by the Digital Omnibus (EUR-Lex CELEX 02024R1689-20260727, 119 articles and 14 annexes). 162 article chips and 91 citations inside the takeaways, 253 references in all: 249 held and four were wrong, leaving 53 entries clean, 2 minor and 2 corrections. A Service Desk FAQ pointed at Article 4, AI literacy, where it meant the inserted Article 4a on special-category data for bias detection; a joint opinion still cited Article 10(5), which the Omnibus deleted after moving its rule into Article 4a, the only true renumbering casualty in the corpus; a range stopped one article short of Chapter V; and an unlabelled GDPR Article 6 read as the AI Act's high-risk classification rules. The report is `aia-xref-verification-2026-09-20.md` inside this folder, with the per-entry results, every attempt, the change set, `apply_xref.py` and the agent brief beside it. | Before trusting an article chip on a Part 2 entry, and before adding or editing one. |
| `digest-source-coverage-2026-09-20.md` | Why 286 of the 848 digest source links could not be downloaded as PDFs, and what is actually behind each one: 122 are web pages with no PDF, 71 are live pages whose PDF a retry would get, 26 are sites that block scripts, the rest are indexes or JavaScript viewers. Seventeen links were genuinely broken (thirteen EDPB opinion slugs missing `draft-decision-of-the`, serving a soft 404, two EDPB documents that moved section, the EDPS generative AI orientations, and Saudi Arabia's PDPL page) and are now repaired in the data and the pages. A second pass in a real browser, after access to the 36 blocked hosts was granted, also confirmed that the sites refusing scripts (Singapore, Norway, Switzerland, Germany, Belgium, the Netherlands) hold the right documents, and let the seven CJEU judgments be verified from EUR-Lex. | When a source link looks wrong, or before another download run. |
| `digest-source-coverage-2026-09-20.csv` | The same 286 rows one by one: digest, title, source URL, the downloader's reason, what the fetch actually found, whether it is the named document, a direct PDF URL to retry where one exists, and the corrected URL where the link was broken. | You want to rerun the downloader or fix a link. |
| `retry-verification-2026-09-20.md` | The 70 entries whose source page carries a direct PDF the downloader missed, read through the fetch tool and checked: 58 confirmed, 4 tightened, 1 substantive error (Binding Decision 5/2022 was credited with an order that came from the 2021 WhatsApp decision), 6 whose PDF link turned out to be a different document, 1 that would not fetch. Also explains why the coverage report's count of retryable PDFs was optimistic. | Before a second download run, or when a digest link points at the wrong PDF. |
| `retry-download-list-2026-09-20.csv` | Those 70 entries with the PDF URL to use, 13 of them corrected during verification, plus the verdict and a note per entry. 65 have a usable direct PDF URL. | You want to complete the PDF archive in `edpb-downloads`. |
| `chatgpt-review-audit-2026-09-19.md` | Finding-by-finding audit of two independent reviews (30 findings on the AI Act study pack, 41 plus 3 presentation points on the cookie and EDPB digests): each finding checked against the digests, the published text and the sources, with a verdict and what was changed. Status: all accepted findings applied. | You want to know why a takeaway reads the way it does, or before re-reviewing the digests. |
| `gdpr-fine-calculator-explained.md` | How the GDPR Fine Calculator works and why, written to be explained to someone else. Sections 1 to 7 need no technical background: the index, one calculation followed start to finish at EUR 20bn turnover, the five decisions the data forced (median not mean, size before violation type, one vote per organisation, and the R squared of 0.10 that makes the range the finding), the two legal points people get wrong (the cap is a percentage **or** a flat floor, whichever is higher; CNIL cookie fines are ePrivacy not GDPR), the data's weak points, and short answers to the three questions you will be asked. A marked Implementation half covers the files, the peer selection ladder, the statistics, the chart and how to refresh the data. Copy of the Claude project document of the same name, which is the master. | Before explaining or demonstrating the calculator, or before changing how it computes. |
| `fines_master_v3.csv` | The dataset behind the calculator: 3,088 enforcement tracker cases, 357 of them carrying both a fine and a turnover across 170 organisations. Per row: the fine, country, year, sector, the parsed GDPR Articles and the 2%/4% tier, the violation type, the turnover with its year, basis, source and confidence, the computed index, an ePrivacy flag for national cookie cases, and which source the row came from. Also carries `company_key` (the normalised organisation name the per-organisation median groups on), `conf_rank` and `has_turnover`, which exist so a Power BI model can read the file without reimplementing the name normalisation in M. | You need the underlying numbers, or you are rebuilding `calculator-data.js`, or you are building the Power BI version. |
| `site-link-audit-2026-09-20.md` | Link and search audit of the live site (20 September 2026): internal links and anchors, external link coverage and its limits, the www versus apex canonical mismatch, page metadata lengths, files served that should not be, backlinks found, what was applied and what is recommended. | Before changing canonical URLs, the sitemap or `CNAME`, or when planning SEO work. |
| `edpb-digest-build/` | Data and scripts that generate `edpb-digest.html`: the scraped inventory, the ratings script, the 117 written takeaways, the hand-written and templated one-liners, the page and PDF renderers, `fix_edpb_review.py` (the 19 September 2026 corrections, already applied to `digest.json`) and `add_consultations.py` (the 11 consultation versions, already applied). README inside. | You need to add EDPB documents or regenerate the page. |
| `cookie-digest-build/` | Data and scripts that generate `cookie-digest.html`: six research briefs, six raw cluster outputs, the merged data set (`all_merged.json` is what the page builder reads; `cookie_digest.json` is its output), the page and PDF renderers, and `fix_cookie_review.py` (the 19 September 2026 corrections, already applied). README inside. | You need to add or correct a cookie entry (17 entries rest on secondary sources and are marked). |
| `ai-act-digest-build/` | Data and scripts that generate `ai-act-digest.html`: five research briefs, the 133 provision entries and 57 corpus entries as JSON, the merged data set, the page and PDF renderers, the link audit and the render test. README inside. | You need to add or correct an AI Act entry (5 corpus entries could not be fetched and are marked). |
| `study-pack-build/` | Data and scripts that generate `privacy-ai-act-assessments-study-pack-v2.pdf`: `pages.json` (the prose of the two advice pages extracted to markdown), `extract_pages.py` that regenerates it from the HTML, the authored study layer (`study_pp.py`, `study_aia.py`, `study_tools.py`), the front matter, the two tools' content dumped from the live pages, and `build.py`. README inside. Added 20 September 2026; before that the pack could not be rebuilt from the repo. | You edit prose on either advice page, or need to reprint the study pack. Note `pages.json` is a copy of the site text and has to be kept in step. |
| `site-nav-build/` | `digest_nav.py` (the master copy of the shared side contents, results box, jump bar and Top button; the EDPB and cookie builds carry identical copies), `swap_header.py` (replaces a generated page's header block with the current four-item nav; run it after every page rebuild) and `apply_nav.py` (adds them to the two advice pages without touching their copy; the advice jump bar is Search and All situations only). README inside. | You change the navigation pattern or rebuild an advice page after editing its text. |
| `home-tile-build/` | Two scripts that draw home page tiles. `make_power_bi_tile.py` rebuilds `images/power-bi-tile.png` from `images/power-bi-dashboard.png`: it trims the wide white margins off the wordmark and the dashboard, restacks them with a 22px margin and a 44px gap, and quantizes to 256 colours, which takes 1.16MB down to about 370KB. The spotlight contains rather than covers that tile and sets no background colour, so the untrimmed white used to paint a slab across the card. `make_regulatory_digests_tile.py` draws `images/regulatory-digests.png`, the 1000 x 1000 tile behind the Regulatory Digests spotlight on the home page. Flat mock of a digest page in the site navy, drawn at 2x and resized; needs Pillow and the DejaVu fonts. No source pills in the image on purpose: the three tool-chips the spotlight lays over the left half of it already name the three digests. | You want to redraw or restyle the home page digests tile. |
| `risk-matrix-desktop.png`, `risk-matrix-phone.png` | Screenshots from the risk matrix layout work. The home tile the site uses is `images/risk-matrix-tile.png` (1000 x 1000, matrix centred at mid size); `images/risk-matrix-desktop.png`, `risk-matrix-phone.png` and `risk-matrix-tile2.png` are earlier attempts no page references. | Reference only. |

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
- `assets/css/main.css` is CRLF; edit it in binary mode or it silently converts to LF. Root
  HTML files are LF.
- The html5up template styles every `button` (tall, uppercase, nowrap); custom buttons must
  reset height and line-height. It does not style `input[type="search"]`; use `type="text"`.
- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.
- The generated pages (three digests, two advice pages) are written by builders whose header
  template predates the current four-item nav: after any rebuild, copy the current header block
  from another root page and set the active marks. Details in each build folder's README.
- Canonical tags, `sitemap.xml`, `robots.txt` and `og:url` use the apex `https://simeonatanasov.com/`
  while `CNAME` serves `www`. Keep whichever host is chosen consistent across all of them
  (see `Claude outputs/site-link-audit-2026-09-20.md`).

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
