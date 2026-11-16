# Privacy crosswalk: build files

Generates `privacy-crosswalk.html` and `pages/privacy-crosswalk/` (`crosswalk-data.js`
generated, `crosswalk.js` and `crosswalk.css` copied). Written 16 November 2026.
Project doc: `claude/privacy-crosswalk.md`. Plan: `claude/privacy-crosswalk-plan.md`.

    python3 "Claude outputs/privacy-crosswalk-build/build_privacy_crosswalk.py" .

from the repo root. The builder reads the header nav from `gdpr-fine-calculator.html` at
build time, so there is no header template here to go stale, and it writes the head block
exactly as `apply_seo.py` does (`seo_block.html`). After a rebuild, run
`python3 "Claude outputs/seo-build/apply_seo.py"`: it must report `written: 0 file(s)`.
Then rebuild the Ask panel index (`assistant-build/build_index.py --repo .`).

## What the page is

36 GDPR obligations, each with the NIST Privacy Framework 1.0 subcategories that the site
reads as addressing it (its own reading, cross-checked against a third-party crosswalk hosted
by NIST) and the ISO/IEC 27701 clauses that a published mapping pairs with its provisions.
**The ISO side uses the numbering of the withdrawn 2019 edition**, because the only free
public mappings use it. No 2025 number appears anywhere. See "Next step" below.

## Files

| File | What it is |
| --- | --- |
| `rows.py` | The crosswalk. Per row: the GDPR articles, the provisions (`sel`), the paraphrased obligation, the chosen NIST subcategories, the gap mark for NIST and a note. Hand-written. **Edit here.** The ISO column is not in this file: it is computed. |
| `gdpr.json` | Article titles and EUR-Lex anchors for Articles 5 to 49, read from EUR-Lex on 16 November 2026. |
| `nist_pf.json` | NIST Privacy Framework Version 1.0 Core, 5 Functions, 18 Categories, 100 Subcategories, verbatim, taken from NIST's own crosswalk workbook (`csf-pf-to-sp800-53r5-mappings.xlsx`) and identical in two other NIST-hosted workbooks. |
| `iso27701_2019.json` | ISO/IEC 27701:2019 clause numbers and titles as the Data Protection Mapping Project prints them (259 items, 188 leaf clauses). Numbers and titles only. One title corrected: the sheet prints 7.4.4 as "PII minimization objectivesves". |
| `dpmp_mappings.json` | The two mappings of the Data Protection Mapping Project (MIT): GDPR provision to clause (405 provisions, 335 with a clause) and Privacy Framework subcategory to clause (99 rows; the sheet follows the preliminary draft of the framework, so each row carries how it was matched to Version 1.0: `text`, `id` or `none`). |
| `nist_hosted_support.json` | Written by `make_support.py`. The cross-check: per row, which of the row's own NIST references the NIST-hosted GDPR crosswalk also makes, plus counts that describe the two NIST-hosted files. Nothing else from those files is in the repo. |
| `make_support.py` | Recomputes `nist_hosted_support.json` from the identifier pairs kept outside the repo. Run it whenever `sel` or `nist` changes in `rows.py`. |
| `LICENSE-data-protection-mapping-project.txt` | The MIT notice. The builder copies it into the head of `crosswalk-data.js`, which is where the project's data is republished. |
| `page_template.html` | The page around the app: head, intro, how to read, method and sources. |
| `seo_block.html` | The head block as `apply_seo.py` writes it. After changing the title or the description (in the template and in the `PAGES` table of `apply_seo.py`), run `apply_seo.py` and copy the new block from the page into this file. |
| `crosswalk.js`, `crosswalk.css` | The app (`pc-` prefix): four views, filters, deep links (`#pc-r05`, `#iso-7-2-2`, `#nist-ct-po-p1`, `#view=nist`, `#view=gdpr&role=processor&theme=security&gap=1&q=breach`). State in the hash only. |
| `build_privacy_crosswalk.py` | The builder. |
| `wire_nav05.py`, `wire_sa11.py` | The scripts that wired the page in (NAV-05 with HOME-04, and SA-11). Run once on 16 November 2026; kept as the record of what was changed. |
| `test_pc.py` | Playwright render test at 1600px and 390px (71 checks): card counts per view, no horizontal overflow, filters and hash state, deep links clear of the sticky header, links between views, the Privacy menu. Runs where Playwright is installed, on a copy of the site served over HTTP. |
| `review.md` | The two independent reviews of the mapping against the sources (first draft, then the corrected rows and the NIST column as the site's own reading), and what was done with each finding. |

## What the builder asserts

- Every selector in `sel` matches a provision; the articles on the card and in `sel` agree.
- The ISO column of a row is the union of the project's clauses for the row's provisions.
- A title quoted in a note is the title of a clause in that row's ISO column, and a clause
  number in a note is in that column. Notes say what the published mapping lists and what
  the titles say, nothing about what a clause requires: the standard's text was not read.
- Every NIST reference is the site's own reading and is marked `S`. The mark `A` ("agrees
  with NIST-hosted crosswalk") is added where the third-party GDPR crosswalk hosted by NIST
  pairs the same subcategory with a provision of the row, or with the whole article or
  paragraph that contains it. It is a cross-check: a reference is
  never added because the crosswalk has it. The test for listing a subcategory is in the
  docstring of `rows.py`.
- `gap` is `none` exactly when the NIST list is empty.
- No em dash in any output; description 160 characters or fewer and free of "27701:2025".

## Sources and licences

| Source | Licence | Used how |
| --- | --- | --- |
| Regulation (EU) 2016/679, EUR-Lex | EU law, reusable | Paraphrased; titles and links |
| NIST Privacy Framework 1.0 | US government work, public domain | Quoted verbatim |
| Data Protection Mapping Project, `github.com/microsoft/data-protection-mapping-project`, commit `2ff78ec` (26 July 2022) | MIT, Copyright 2020 Data Protection Mapping Project | Republished with the notice: clause numbers and titles, both mappings. Its sheet also carries text of the standard in a "body" column; that column is never read for a leaf clause and the workbook is not in the repo. |
| "GDPR Crosswalk by Enterprivacy Consulting Group", NIST Privacy Framework Resource Repository, commit `4b9d9b7` | None stated | Not republished. Used as a cross-check: the page marks where it agrees with a reference the site chose. It is a third-party work hosted by NIST, not written by NIST, and the page says so. |
| "ISO/IEC 27701 Crosswalk by Microsoft", same repository | None stated | Not republished. Described by counts and linked. Identical to the project's sheet for 95 subcategories. |
| ISO/IEC 27701:2019 and :2025 | Copyright ISO, paid | Not read, not used. |

The workbooks and the extraction script (`extract.py`) are outside the repo, in
`GitHub-projects-data/simeonatanasov.com/Claude outputs/privacy-crosswalk-work/`.

## Next step: the 2025 numbering

ISO/IEC 27701:2025 (edition 2, October 2025) is restructured: the management system is in
clauses 4 to 10 and the controls are in Annex A, so a 2019 number cannot be assumed to carry
over. It carries its own GDPR mapping (Annex D) and a correspondence table with the 2019
edition (Annex F). Do not write that it "renumbered every control": nobody here has read it.
The page moves to the 2025 numbering only from a checked source: the standard itself, or a
correspondence published free of charge by ISO or a national standards body, shown to
Simeon before use. Tables from certification bodies are not to be used; the BSI webinar deck
of November 2025 was looked at and rejected on 16 November 2026. When that source
exists: add the 2025 number beside each 2019 number in `iso27701_2019.json`, show both in
the app, relabel the column and the tab, and redraft the h1, the description (also in
`apply_seo.py`) and the method section.

## Recheck when

1. NIST publishes Privacy Framework 1.1 final (only a draft on 16 November 2026): re-key
   `nist_pf.json` and `rows.py` with NIST's own 1.0 to 1.1 mapping.
2. ISO publishes an amendment to ISO/IEC 27701:2025, or ISO or a national standards body
   publishes a free 2019 to 2025 correspondence: see "Next step".
3. The Digital Omnibus (COM(2025) 837, procedure 2025/0360/COD) or the Article 30(5)
   proposal (COM(2025) 501, 2025/0130/COD) is adopted: rows r18 and r31 name them, and the
   rows on rights and transparency need re-reading.
4. The NIST repository changes either crosswalk (pinned at commit `4b9d9b7`), or the Data
   Protection Mapping Project changes its data (pinned at `2ff78ec`).
