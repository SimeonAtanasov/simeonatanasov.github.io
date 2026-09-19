# simeonatanasov.com: site map

Personal portfolio and privacy reference site, published through GitHub Pages at
`https://www.simeonatanasov.com`. This file is the map: what each page is, where its
code lives, what sits in `Claude outputs/`, and how to rebuild the generated pages.
Last updated 19 September 2026.

## Pages

Page HTML sits at the repo root. Each page's own CSS and JS live in `pages/<name>/`.
Shared chrome is `assets/css/main.css` (html5up template plus custom blocks appended at
the end) and `assets/js/main.js` (template code plus two appended IIFEs: the measured
nav collapse and the assessment dropdown).

### Tools (interactive, state stays in the browser)

| Page | What it is | Code |
|---|---|---|
| `gdpr-readiness.html` | GDPR Readiness Assessment. Record which of 71 privacy management activities you perform (13 categories, 13 scope questions) and the tool derives which GDPR Articles they evidence. Scores by category, by Article and as a gap list; Save / Load / Clear / Forget; Excel export. | `pages/gdpr-readiness/` : `readiness.js`, `readiness-data.js` (the model), `readiness.css` |
| `privacy-ai-assessment.html` | Six assessment tools behind one landing page: Privacy Assessment (DPIA screening), Full DPIA, Legitimate Interest Test, AI Risk Assessment, Incident & Breach Severity (ENISA method), Third-Party Security Assessment. 68 steps, 337 questions. | `pages/privacy-ai-assessment/` : `assessment.js` (all six tools and their scoring), `assessment.css` |
| `risk-matrix-original.html` | Interactive risk matrix over a risk library. | `pages/risk-matrix-front-end/` |
| `cookie-banner-scanner.html` | Front end for the cookie banner scanner. The backend is a separate project, `scan-banner-api`, deployed on Render. | inline; keeps a `localhost:3005` dev fallback on purpose |
| `power-bi.html` | GDPR fines in Europe dashboard (embedded). | inline |
| `my-asteroids-game.html` | Asteroids game, keyboard and touch. | `pages/my-asteroids-game/` |

### Reference pages (written content, no state)

| Page | What it is | Code |
|---|---|---|
| `practical-privacy.html` | Practical Privacy: 18 recurring situations (surveillance, offboarding, mailbox access, meetings, remote work, surveys, talent data, rights requests, sensitive data, consent, secondary use, external requests, AI, regulators, digital products, breach response, records, marketing), each with key actions, never-do list and worked examples. | `pages/privacy-ai-assessment/practical-privacy.css` |
| `practical-ai-act-advice.html` | Practical AI Act Advice: 13 sections from scope and prohibitions through provider and deployer duties, GPAI, conformity, governance, then program building, risk questions, vendor vetting, literacy and copyright. Needs the September 2026 updates listed in `Claude outputs/site-verification-report-2026-09-19.pdf`. | `pages/privacy-ai-assessment/practical-ai-act.css` |
| `edpb-digest.html` | EDPB Digest: every document on the EDPB listing (532 as of 19 September 2026) with one takeaway each, 107 written from the document and 425 one-line descriptions; filters by type, year and relevance. | `pages/edpb-digest/edpb-digest.css`; generated from `Claude outputs/edpb-digest-build/` |
| `cookie-digest.html` | Cookie Compliance Digest: 259 laws, regulator guidance documents, court decisions, enforcement actions and standards on cookies and tracking across 60 jurisdictions (EU, member states, UK, Switzerland, US federal and states, rest of world, standards), each with a practitioner takeaway; filters by jurisdiction, type and year. | `pages/cookie-digest/cookie-digest.css`; generated from `Claude outputs/cookie-digest-build/` |
| `ai-act-digest.html` | AI Act Digest in two parts. Part 1: Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, all 113 articles and 13 annexes by chapter, each with a takeaway, date of application, roles bound, recitals and a note on the 36 provisions the Omnibus changed. Part 2: 57 guidance and implementation documents (Commission guidelines, codes, templates, Q&As, standards, EDPB and EDPS including Opinion 28/2024, national laws, reference tools). Filters by part, role, application date, Omnibus flag and search. | `pages/ai-act-digest/ai-act-digest.css`; generated from `Claude outputs/ai-act-digest-build/` |

The three digests are on disk but not yet linked from the other pages' header nav or from
`sitemap.xml`. Each digest's own nav carries links to the other two.

### Home, legal and leftovers

| Page | Notes |
|---|---|
| `index.html` | Home and portfolio. The Career & Education section is maintained by hand and is off limits to any automated edit. Sidebar portfolio menu: `assets/css/home-extra.css` and `assets/js/portfolio-menu.js` (behaviour spec below). |
| `cookie-notice.html`, `privacy-notice.html`, `terms.html` | Legal pages. |
| `offline.html` | Offline fallback served by the service worker. |
| `draft.html`, `elements.html`, `test-page.html` | Template leftovers, noindexed, kept rather than deleted. |

### PWA layer

`manifest.webmanifest`, `sw.js` and `.nojekyll` at the root, `assets/js/pwa.js` registering
the worker, `images/favicon/maskable-512x512.png` as the Android adaptive icon. Every root
page carries a PWA block before `</head>`. `.nojekyll` is what lets `.well-known/` be served;
deleting it silently breaks the Android app's domain verification. `images/favicon/site.webmanifest`
is stale and unreferenced; the live manifest is the root one.

## Claude outputs/

Non-site deliverables. Nothing in here is referenced by any page.

| File or folder | What it is | Read it when |
|---|---|---|
| `privacy-ai-act-assessments-study-pack.pdf` | 138-page greyscale study pack: both reference pages in full with key-takeaway boxes, all six assessment tools with cheat sheets and full question banks, the readiness model with all 71 activities, 69 self-test questions with answers, a four-week study plan, a review card, numbered sources. | You want to learn or re-learn the site's content. |
| `site-verification-report-2026-09-19.pdf` | 32-page check of the site's legal claims against GDPR, the AI Act as amended by Regulation (EU) 2026/1744, EDPB and Commission guidance, courts and national rules. Every change rated High / Medium / Low, open items, a sweep of all 47 EDPB consultations and all 532 EDPB documents, 90 sources. | Before editing any legal content. The High items are the AI Act dates, the two new prohibitions, the Article 4 wording and the copyright rewrite. |
| `edpb-documents-inventory-2026-09-19.csv` | All 532 EDPB documents with type, date, relevance rating (R / B / N), where each lands on the site, and URL. Filterable. | You want to know whether an EDPB document matters to a page. |
| `edpb-digest-2026-09-19.pdf` | Print version of the EDPB Digest page, 108 pages, one numbered source per document. | You want to read the digest on paper. |
| `cookie-compliance-digest-2026-09-19.pdf` | Print version of the Cookie Compliance Digest, 71 pages, one numbered source per document. | Same, for cookies. |
| `ai-act-digest-2026-09-19.pdf` | Print version of the AI Act Digest, 71 pages: application dates at a glance, the Omnibus change table, then every provision and document with a numbered source. | Same, for the AI Act. |
| `edpb-digest-build/` | Data and scripts that generate `edpb-digest.html`: the scraped inventory, the ratings script, the 107 written takeaways, the hand-written and templated one-liners, the page and PDF renderers. README inside. | You need to add EDPB documents or regenerate the page. |
| `cookie-digest-build/` | Data and scripts that generate `cookie-digest.html`: six research briefs, six raw cluster outputs, the merged data set, the page and PDF renderers. README inside. | You need to add or correct a cookie entry (17 entries rest on secondary sources and are marked). |
| `ai-act-digest-build/` | Data and scripts that generate `ai-act-digest.html`: five research briefs, the 126 provision entries and 57 corpus entries as JSON, the merged data set, the page and PDF renderers, the render test. README inside. | You need to add or correct an AI Act entry (5 corpus entries could not be fetched and are marked). |
| `risk-matrix-desktop.png`, `risk-matrix-phone.png` | Screenshots from the risk matrix layout work. | Reference only. |

## Working notes kept outside the repo

The Claude project "Simeon" holds the carry-over documentation for whoever edits the site
with Claude: `site-context.md` (rules, deploy procedure, technical traps, open items),
`content-voice.md` (how the site is written), `assessment-tools-spec.md` and
`gdpr-readiness-model.md` (the two large tools), `pwa-and-play-store.md`,
`content-verification-2026-09.md` (the rated action list from the verification),
`edpb-digest.md`, `cookie-digest.md` and `ai-act-digest.md` (what the digests are and how to
rebuild them).

## Rules that apply to every edit

- No em dashes anywhere: page copy, code comments, commit text.
- British spelling. Company-agnostic content: no employer, team or system names.
- Sentence case headings, one `h1.major` per content page, titles `Simeon Atanasov | <Page>`.
- `assets/css/main.css` is CRLF; edit it in binary mode or it silently converts to LF. Root
  HTML files are LF.
- The html5up template styles every `button` (tall, uppercase, nowrap); custom buttons must
  reset height and line-height. It does not style `input[type="search"]`; use `type="text"`.
- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.

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
