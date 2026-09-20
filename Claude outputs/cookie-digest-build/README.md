# Cookie compliance digest: build files

Everything needed to regenerate cookie-digest.html and the PDF. Snapshot date: 19 September 2026.

- brief.txt and brief_<cluster>.txt: the research brief given per cluster (EU level, EU national,
  UK and Switzerland, United States, rest of world, standards). Each cluster was researched from
  primary sources where reachable and written to the same takeaway format: what it establishes with
  the operative article, who it binds, what to do; British spelling; no em dashes.
- items_<cluster>.json: the raw output per cluster (264 items).
- all_merged.json: after dedupe across clusters (259 items) and copy fixes. This is the data set.
- cookie_digest.json: the same with the "group" field the page uses.
- fix_cookie_review.py: the 18 corrections from the independent review of 19 September 2026
  (Article 3 scope, ICO child expectations, the Amazon Turkey fine allocation, California and
  Oregon figures, Nigeria and Mexico wording, Consent Mode mapping, Safari's seven-day cap, the
  Digital Omnibus joint opinion, DMA dates, "binds" to "applies to" for guidance). Already
  applied to all_merged.json.
- digest_nav.py: the shared side contents, results box, jump bar and Top button (the master
  copy is in site-nav-build; keep the two identical).
- build_cookie_page.py: renders cookie-digest.html and pages/cookie-digest/cookie-digest.css.
- build_cookie_pdf.py: renders the greyscale PDF (needs pack.css from the study pack build and
  WeasyPrint; 74 pages as of 20 September 2026, cover with six type counts including proposals).
- The links behind the page are also in cookie-compliance-inventory-2026-09-19.csv, one folder
  up (259 rows, grouped by region).

On 20 September 2026 the takeaways were checked against the official texts (see
`../source-verification-2026-09-20.md`): 32 entries were corrected by
`../source-verification-2026-09-20/apply_source_review.py`, already applied to all_merged.json.
Eighteen entries could not be checked because the downloaded PDFs are not the document the
entry names (mostly CJEU judgments from curia pages that link many cases); they are listed in
the verification register and are the first to re-download.

Also on 20 September 2026 the other 149 entries, the ones with no downloaded PDF, were
rechecked against the live source page (see `../live-recheck-2026-09-20/`): 110 confirmed,
28 tightened, 8 corrected, and every page reached. 63 field changes, 36 takeaways and 27
source links, were applied by `../live-recheck-2026-09-20/apply_recheck.py`. Rerun it after
any edit that regenerates all_merged.json. Three entries remain short and are named in that
report: the EDPB link for the Criteo item is dead with no replacement found, the Chinese
standard GB/T 35273-2020 sits behind a portal viewer, and the Nigeria Data Protection Act
2023 exists online only as an image scan or behind Cloudflare.

Two practical notes from that pass. A host that refuses one tool often answers the other:
the browser clears robots.txt refusals and bot checks, and the fetch tool extracts text from
PDFs that Chrome renders with nothing selectable. And a regulator press release is not the
decision, so a takeaway detail that is right but absent from the linked page is a link
problem, not a content error.

To add or update an item: edit all_merged.json (keep the field set: title, jurisdiction, type,
date, url, status, takeaway, topics, source), then run the two build scripts. Never edit
cookie_digest.json: build_cookie_page.py overwrites it on every run, so edits made there vanish.
build_cookie_page.py still carries the old header nav in its HEAD template: after a rebuild,
replace the header block with the current one (Home | Privacy | AI | Cookie Compliance) copied
from another root page, with Cookie Compliance and Cookie Digest marked active. Items marked
"source": "secondary" rest on a secondary source because the primary page could not be fetched;
they are marked on the page and are the first to re-verify.
