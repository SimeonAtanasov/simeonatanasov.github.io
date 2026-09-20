# AI Act digest: build files

Everything needed to regenerate ai-act-digest.html and the PDF. Snapshot date: 19 September 2026.

- brief_a.txt to brief_d.txt: the research brief per slice of the Regulation (Articles 1 to 30,
  31 to 65, 66 to 113, Annexes I to XIII). The seven provisions the Omnibus inserted (Articles 4a,
  60a, 75a to 75d and Annex XIV) were fetched afterwards with the same schema into items_e.json. Each provision was read on the AI Act Explorer at
  artificialintelligenceact.eu, which carries the consolidated text after Regulation (EU) 2026/1744,
  and written to one format: what it establishes, who it binds, what to do, date of application,
  Omnibus change note, recitals, roles, topics.
- brief_corpus.txt: the brief for Part 2, the guidance and implementation corpus.
- items_a.json to items_e.json: the 119 articles and 14 annexes (133 entries).
- items_corpus.json: the 57 corpus documents. Entries with "source": "knowledge" could not be
  fetched and were written from the linking page or prior knowledge; they are marked on the page
  and in the PDF and are the first to re-verify. The same 57 documents are listed in
  ai-act-guidance-inventory-2026-09-19.csv, one folder up, grouped as on the page.
- ai_act_digest.json: the merged data set as the page builder leaves it (normalised dates, chapter
  order, corpus groups).
- aia_extras.py: the high-level summary (ten sections, shared by page and PDF; {art-N} markers
  become links to the entries) and the obligations checker (question flow, result logic, CSS).
- build_aia_page.py: renders ai-act-digest.html and pages/ai-act-digest/ai-act-digest.css. Its
  side contents, results box and drawer are written inline (the ai- prefixed functions); the
  digest_nav.py beside it is an unused copy of the shared module kept for reference.
- build_aia_pdf.py: renders the greyscale PDF with WeasyPrint (ai-act-digest-2026-09-19-v2.pdf,
  79 pages). pack.css is the shared print stylesheet from the study pack build.
- audit.js: Playwright audit of every link and action on the page (internal anchors, contents
  links in both views, toggles, copy link, overview cards, jump lists, all 180 recital buttons,
  every filter option, Ctrl+K, the mobile drawer). Writes audit.json.
- rendertest.js: Playwright check of the page with the site chrome at 1280, 1024 and 390 px:
  filters, the side contents (chapter and section toggles, chapters and all-articles views,
  scrollspy, copy link, Ctrl+K), the recital grid filter and the mobile drawer.

Field set for a provision: id, number, title, chapter, section, takeaway, applies_from, omnibus
(empty string when the Omnibus did not touch it), binds, recitals, topics, url, fetched, source.
Field set for a corpus document: id, title, issuer, type, status, articles, date, url, takeaway,
topics, source.

On 20 September 2026 two corpus links were found to 404 because the documents sit under a
different EDPB section than the link assumed (Statement 3/2024 and Joint Opinion 1/2026);
both are repaired by `../source-verification-2026-09-20/apply_linkfix.py`. Only 4 of the 57
corpus documents exist as PDFs at all: the Commission publishes AI Act guidance as HTML, so
a PDF downloader is the wrong tool for this corpus.

On 20 September 2026 the five corpus entries with a downloaded EDPB source were checked
against the official texts (see `../source-verification-2026-09-20.md`): three were corrected
by `../source-verification-2026-09-20/apply_source_review.py`, already applied to
items_corpus.json.

On 20 September 2026 all 133 Part 1 entries were checked against the official consolidated
text of the Act on EUR-Lex, CELEX 02024R1689-20260727 (see `../law-verification-2026-09-20.md`):
66 field changes across 50 entries were applied by
`../law-verification-2026-09-20/apply_law_review.py`, already applied to items_a.json to
items_e.json. Rerun it after any rebuild that regenerates those files. The material fixes
were the application dates of Articles 78 (2 August 2025, not 2026) and 101 (2 August 2026,
not 2025), four Omnibus notes that had the amendment backwards (Articles 25, 27, 50 and 56),
five amended provisions that carried no note (Articles 1, 2, 40, 77, 99), and two stale
counts (Article 3 now has 70 definitions, Article 5 prohibits ten practices).

To add or correct an entry: edit the items file, then run build_aia_page.py and build_aia_pdf.py.
The page builder still carries the old header nav in its HEAD template: after a rebuild, replace
the header block with the current one (Home | Privacy | AI | Cookie Compliance) copied from another
root page, with AI and AI Act Digest marked active.
The page builder also produces the Structure of the Act overview and the side contents from the
same data: chapter ranges come from the first and last article of each chapter, sections from the
"section" field, and the recital grids from the union of every entry's "recitals" list.
Application dates follow Article 113 as amended: Annex III high-risk from 2 December 2027, Annex I
high-risk from 2 August 2028, Article 50 grace to 2 December 2026, the two new prohibitions in
Article 5(1)(ba) and (bb) from 2 December 2026. British spelling, no em dashes, company-agnostic.
