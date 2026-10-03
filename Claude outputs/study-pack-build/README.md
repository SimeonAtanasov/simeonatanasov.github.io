# Study pack build

Generates `../study-guides/privacy-ai-act-assessments-study-pack-v2.pdf` (174 pages since 3 October 2026, greyscale): the
two advice pages plus an authored study layer and the two assessment tools, laid out for
print.

Added to the repo on 20 September 2026. Until then these files existed only in the working
sandbox, so the PDF could not be rebuilt from the repo.

## Files

| File | What it is |
| --- | --- |
| `build.py` | Assembles the whole pack into `pack.html` and renders it with WeasyPrint. Run it and nothing else. |
| `pages.json` | The prose of `practical-privacy.html` and `practical-ai-act-advice.html`, extracted to markdown. Two keys, `practical_privacy` and `ai_act`. **This is a copy of the site text, so it must be kept in step with the two pages.** |
| `extract_pages.py` | Regenerates `pages.json` from the two HTML pages with BeautifulSoup. Set `SRC` to the folder holding them. |
| `study_pp.py`, `study_aia.py`, `study_tools.py` | The authored study layer: key takeaways and self-test questions per section. Written by hand, not extracted. |
| `front.py` | Cover, how to use, and the closing matter. |
| `assessment.json`, `readiness.json` | The two assessment tools' content, dumped from the source by `dump_assessment.js` (node, `SRC=<assessment.js> OUT=<assessment.json> node dump_assessment.js`) and `dump_readiness.js`. |
| `pdf_to_md.py` | Converts a digest PDF to a Markdown text version beside it (needs pymupdf4llm). Used for the digest PDFs in `../study-guides/`. |
| `pack.css` | Print stylesheet, shared with the three digest PDF builders. |

## Rebuilding

    python3 build.py

It writes `pack.html` beside the script and the PDF to `/mnt/user-data/outputs/`. The
output file is named without `-v2`; the repo copy carries `-v2` because the first build
was open in another application when the second was written. Copy it over the `-v2` name in `../study-guides/`.

The build is deterministic: rebuilding from unchanged inputs reproduces the same text,
which is how the 20 September edits were confirmed to be the only change.

## Keeping it in step with the site

When prose changes on `practical-privacy.html` or `practical-ai-act-advice.html`, the same
change has to reach `pages.json`, either by rerunning `extract_pages.py` against the edited
pages or by editing the matching string. The extraction keeps `**bold**` and `*italic*`
markers and drops links, so a straight string edit is usually safer for a one-sentence fix.

On 20 September 2026 four sentences were changed this way, matching the edits made to the
two pages after the primary law check: the Article 48 GDPR saving clause, Article 27(5) of
the AI Act, Article 4(1) on AI literacy, and naming the data arm of the Digital Omnibus.
See `../law-verification-2026-09-20.md`.

## Style

British spelling in new material, no em dashes anywhere, no company, employer or product
names. The extracted page text keeps the site's own American spelling, which is the
existing style of those two pages; do not convert it.

## 3 October 2026: three tools added to Part 3

The Fundamental Rights Impact Assessment, the Generative AI Risk Assessment and the
Transfer Impact Assessment were added to the site on 2 October 2026 (see the tool change
log, TC-01 to TC-03). `assessment.json` was re-dumped from the new `assessment.js`; the
entries for the six original tools came out byte-identical to the previous dump. Added: three
cheat sheets and four self-test questions in `study_tools.py`, sources 20 (NIST AI 600-1)
and 21 (MITRE ATLAS), three `MODULE_ORDER` rows and a `GAICHECKS` table in `build.py`,
and the counts and review card lines in `front.py`. The Part 3 blurb now computes its
step and question counts instead of hard-coding them. Rebuilt text compared with the
previous PDF: Parts 1, 2 and 4 unchanged; the only removed lines are the edited counts,
two reworded source entries and table of contents page numbers. Before-images of every
file are in `../tool-baselines/2026-10-03-STUDY-01/`.

## Markdown version

Since 3 October 2026 `build.py` also writes `privacy-ai-act-assessments-study-pack.md`
beside the PDF, converted by pandoc from `pack.html` (skipped if pandoc is missing). Copy it
to `../study-guides/` with the `-v2` name, next to the PDF.

## 3 October 2026: the AI Assessment Pathway added to Part 3 (STUDY-02)

`dump_assessment.js` now also dumps the pathway's arrays (`AIPATH_STEPS`, the framework map,
the tier factors and the vocabularies); every entry for the nine earlier tools came out
identical to the previous dump. `build.py` has a tenth `MODULE_ORDER` row, a `TIER` table
read from `aipath_tier.json` (written by `../ai-pathway-build/guide_data.js` from the shipped
code, so the points are never retyped) and prints the pathway's visibility conditions from
`study_tools.AIPATH_CONDITIONS` and `AIPATH_STEP_CONDITIONS` instead of the function source,
which only calls helpers. `study_tools.py`: the pathway cheat sheet, four self-test questions
(78 in all), the suite intro, source 3 updated and sources 23 to 26 (NIST AI RMF 1.0, ISO/IEC
42001, the Singapore framework, the Canadian AIA) added. `front.py`: ten tools, 534
questions, 78 self-test questions, a review card line. Rebuilt from unchanged inputs first:
text identical to the 161-page PDF. After: 174 pages; text removed is only the counts, the
reflowed suite intro and the table of contents page numbers. Before-images in
`../tool-baselines/2026-10-03-STUDY-02/`.
