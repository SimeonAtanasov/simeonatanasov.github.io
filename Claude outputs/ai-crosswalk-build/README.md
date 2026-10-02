# AI governance crosswalk: build files

Generates `ai-governance-crosswalk.html` and `pages/ai-crosswalk/crosswalk-data.js`.
Written 3 October 2026.

    python3 build_crosswalk.py <repo root>

writes the page and the data file into the repo and copies `crosswalk.js` and
`crosswalk.css` beside the data file. Run it, then check the header nav of the
written page against another root page: the header is copied from
`page_template.html`, which carries the nav as it stood on 3 October 2026, so after
any nav change update the template too (or run `../site-nav-build/swap_header.py` on
the page with `ai-governance-crosswalk.html` as the active page).

## Files

| File | What it is |
| --- | --- |
| `rows.py` | The crosswalk itself: 28 AI Act obligations, each with role, articles, application date, ISO/IEC 42001 references, NIST AI RMF subcategories, a note and a gap flag. Hand-written. Edit here. |
| `nist_ai_rmf.json` | NIST AI 100-1 Tables 1 to 4: 19 categories, 72 subcategories, verbatim. |
| `iso42001.json` | ISO/IEC 42001:2023 clause and Annex A control numbers and titles (titles only, no standard text), and the NIST-hosted AI RMF to ISO/IEC 42001 crosswalk as printed, with B.x converted to A.x. |
| `ai_act_digest.json` | Copy of `../ai-act-digest-build/ai_act_digest.json`, used for article titles. Refresh it when the digest is rebuilt. |
| `page_template.html` | The page around the app: head, nav, intro, method and sources. |
| `crosswalk.js`, `crosswalk.css` | The app: four views, filters, deep links (`#cw-r05`, `#iso-a-6-2-4`, `#nist-govern-1-1`, `#view=nist`). |
| `iso42005.json` | The NIST-hosted ISO/IEC 42005 to AI RMF crosswalk (INCITS/AI, against the DIS, category level), used to check row r21. Added 3 October 2026 with the "Related standard" field in `rows.py`. |
| `review.md` | The independent review of the first draft (2 errors, 14 should-fix, 12 consider). All errors and should-fix items were applied, and most consider items. |
| `build_crosswalk.py` | The builder. Asserts every ISO and NIST reference resolves and that no em dash reaches the output. |

## Sources and limits

- The AI Act to ISO and NIST mapping is the site's own reading. There is no official one.
- ISO text is copyright: the page cites numbers and titles only.
- The NIST-hosted crosswalk was written against the FDIS of ISO/IEC 42001 by a third
  party; two of its entries look wrong (MAP 1.4 cites B.2.2 for customers; MAP 1.5 cites
  6.1.1 as "Objective"). They are shown as printed and flagged on the page.
- Recheck when: harmonised standards are cited in the Official Journal (EN 18286 and the
  rest of the JTC 21 programme), ISO/IEC 42001 is revised, NIST publishes AI RMF updates,
  or the AI Act Digest is rebuilt.
