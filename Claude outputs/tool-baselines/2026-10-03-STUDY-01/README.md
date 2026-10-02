# Study pack build

Generates `../privacy-ai-act-assessments-study-pack-v2.pdf` (145 pages, greyscale): the
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
| `assessment.json`, `readiness.json` | The two assessment tools' content, dumped from the live pages by `dump_assessment.js` and `dump_readiness.js` (Playwright). |
| `pack.css` | Print stylesheet, shared with the three digest PDF builders. |

## Rebuilding

    python3 build.py

It writes `pack.html` beside the script and the PDF to `/mnt/user-data/outputs/`. The
output file is named without `-v2`; the repo copy carries `-v2` because the first build
was open in another application when the second was written. Copy it over the `-v2` name.

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
