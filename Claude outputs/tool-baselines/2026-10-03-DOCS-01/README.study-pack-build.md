# Study pack build

Generates `../study-guides/privacy-ai-act-assessments-study-pack-v2.pdf` (161 pages since 3 October 2026, greyscale): the
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
