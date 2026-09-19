# AI Act digest: build files

Everything needed to regenerate ai-act-digest.html and the PDF. Snapshot date: 19 September 2026.

- brief_a.txt to brief_d.txt: the research brief per slice of the Regulation (Articles 1 to 30,
  31 to 65, 66 to 113, Annexes I to XIII). Each provision was read on the AI Act Explorer at
  artificialintelligenceact.eu, which carries the consolidated text after Regulation (EU) 2026/1744,
  and written to one format: what it establishes, who it binds, what to do, date of application,
  Omnibus change note, recitals, roles, topics.
- brief_corpus.txt: the brief for Part 2, the guidance and implementation corpus.
- items_a.json to items_d.json: the 113 articles and 13 annexes (126 entries).
- items_corpus.json: the 57 corpus documents. Entries with "source": "knowledge" could not be
  fetched and were written from the linking page or prior knowledge; they are marked on the page
  and in the PDF and are the first to re-verify.
- ai_act_digest.json: the merged data set as the page builder leaves it (normalised dates, chapter
  order, corpus groups).
- build_aia_page.py: renders ai-act-digest.html and pages/ai-act-digest/ai-act-digest.css.
- build_aia_pdf.py: renders the greyscale PDF with WeasyPrint. pack.css is the shared print
  stylesheet from the study pack build.
- rendertest.js: Playwright check of the page with the site chrome (filters, 1280 and 390 px).

Field set for a provision: id, number, title, chapter, section, takeaway, applies_from, omnibus
(empty string when the Omnibus did not touch it), binds, recitals, topics, url, fetched, source.
Field set for a corpus document: id, title, issuer, type, status, articles, date, url, takeaway,
topics, source.

To add or correct an entry: edit the items file, then run build_aia_page.py and build_aia_pdf.py.
Application dates follow Article 113 as amended: Annex III high-risk from 2 December 2027, Annex I
high-risk from 2 August 2028, Article 50 grace to 2 December 2026, the two new prohibitions in
Article 5(1)(ba) and (bb) from 2 December 2026. British spelling, no em dashes, company-agnostic.
