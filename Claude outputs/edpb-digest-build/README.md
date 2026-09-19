# EDPB digest: build files

Everything needed to regenerate edpb-digest.html and the PDF after the EDPB publishes
new documents. Snapshot date: 19 September 2026.

- edpb_documents.json: the 532-item inventory scraped from the EDPB documents listing
  (title, type, date, url), one entry per document.
- classify_edpb.py: rates every document R / B / N for the site (explicit map plus
  type and title patterns) and writes edpb_ratings.json and the CSV inventory.
- takeaways: the 107 written takeaways were produced by reading each document, using
  the brief in agent_brief.txt (2 to 4 sentences: what it establishes, who it binds,
  what to do; British spelling; no em dashes). They live in digest.json.
- oneliners_manual.py: hand-written one-line descriptions for the 115 substantive
  documents rated N. oneliners_build.py: templates for the 310 routine ones (BCR
  approvals, accreditation, DPIA lists, certification, internal procedure, annual
  reports) and the merge that writes digest.json.
- build_digest_page.py: renders edpb-digest.html and pages/edpb-digest/edpb-digest.css
  from digest.json. build_digest_pdf.py: renders the greyscale PDF (needs pack.css from
  the study pack build and WeasyPrint).

To add new documents: append them to edpb_documents.json, run classify_edpb.py, write a
takeaway for anything rated R or B following agent_brief.txt, add a MANUAL one-liner for
any substantive N, run oneliners_build.py, then the two build scripts.
