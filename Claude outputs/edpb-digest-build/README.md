# EDPB digest: build files

Everything needed to regenerate edpb-digest.html and the PDF after the EDPB publishes
new documents. Snapshot date: 19 September 2026. The page holds 543 entries: the 532
documents on the EDPB listing plus 11 consultation versions; 117 written takeaways and
426 one-line descriptions.

- edpb_documents.json: the 532-item inventory scraped from the EDPB documents listing
  (title, type, date, url), one entry per document.
- classify_edpb.py: rates every document R / B / N for the site (explicit map plus
  type and title patterns) and writes edpb_ratings.json and the CSV inventory
  (edpb-documents-inventory-2026-09-19.csv, one folder up).
- takeaways: the 107 written takeaways for listed documents (plus ten for the
  consultation versions) were produced by reading each document, using
  the brief in agent_brief.txt (2 to 4 sentences: what it establishes, who it binds,
  what to do; British spelling; no em dashes). They live in digest.json.
- oneliners_manual.py: hand-written one-line descriptions for the 115 substantive
  documents rated N. oneliners_build.py: templates for the 310 routine ones (BCR
  approvals, accreditation, DPIA lists, certification, internal procedure, annual
  reports) and the merge that writes digest.json.
- fix_edpb_review.py: the 28 individual corrections from the independent review of
  19 September 2026 (six one-liners that described the wrong document, status and date
  updates) plus the rewritten BCR, accreditation and Article 28 templates. Already applied
  to digest.json and oneliners_build.py.
- add_consultations.py: adds the 11 consultation-stage documents (type "Consultation
  version", status chip "consultation") as a group of their own. Already applied; it
  asserts the group is not there yet, so it cannot run twice.
- digest_nav.py: the shared side contents, results box, jump bar and Top button (the
  master copy is in site-nav-build; keep the two identical).
- build_digest_page.py: renders edpb-digest.html and pages/edpb-digest/edpb-digest.css
  from digest.json, entries within a group ordered by full date (datekey()).
  build_digest_pdf.py: renders the greyscale PDF (needs pack.css from the study pack build
  and WeasyPrint; 111 pages as of 19 September 2026).

To add new documents: append them to edpb_documents.json, run classify_edpb.py, write a
takeaway for anything rated R or B following agent_brief.txt, add a MANUAL one-liner for
any substantive N, run oneliners_build.py, then the two build scripts.

On 20 September 2026 thirteen Article 64 opinion URLs were found to serve the EDPB's generic
Documents listing rather than the opinion, because the slug omits `draft-decision-of-the`.
They are repaired in digest.json by `../source-verification-2026-09-20/apply_linkfix.py`.
If you scrape new opinions, take the href from the listing rather than building the slug
from the title, and check that the page you land on carries the opinion's own title: the
EDPB answers 200 for an unknown slug, so a link checker will not catch it.

On 20 September 2026 the takeaways were checked against the official texts (see
`../source-verification-2026-09-20.md`): 57 EDPB entries were corrected by
`../source-verification-2026-09-20/apply_source_review.py`, already applied to digest.json.
Rerun it after any rebuild that regenerates digest.json.

Two traps:

- oneliners_build.py regenerates digest.json, which drops the fix_edpb_review.py entry
  edits and the consultation group. After rerunning it, rerun fix_edpb_review.py and
  add_consultations.py.
- build_digest_page.py still carries the old header nav in its HEAD template. After a
  rebuild, replace the header block with the current one (Home | Privacy | AI | Cookie
  Compliance) copied from another root page, with Privacy and EDPB Digest marked active.

When a final version of a consultation document lands on the EDPB listing, add it as a
normal entry and drop or mark the consultation one.
