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
