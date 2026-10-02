# gdpr-enforcement-build

Builds `gdpr-enforcement.html` (GDPR Enforcement in Europe) and the study guide.

## Files

- `research/BRIEF.md`: the research brief each country agent ran (2 October 2026).
- `research/VERIFY.md`: the independent verification brief.
- `research/raw/`: the raw research JSON per country plus `eu.json`, and the `.verify.json` beside each.
- `research/apply_verify.py`: applies every verified correction (90) and three manual patches from the verifiers' notes, writing `data/`. Rerun after editing anything in `raw/`.
- `data/`: the verified JSON the page and guide are built from. Edit `raw/` and rerun, or edit here and accept that a rerun of `apply_verify.py` overwrites it.
- `summary.py`: hand classifications for the map and comparison (who fines, public bodies, suspensive effect, first court, route) plus the tile map grid. Keep it in step with `data/`.
- `refs.py`: turns legal references into links (GDPR and Regulation 2025/2518 articles and recitals, TFEU articles, CJEU judgments, five national statutes). Each target and every case in `KNOWN` was opened in a browser on 2 October 2026. A case number not in `KNOWN` stays plain text. Used by both builders.
- `header.html`: the site header embedded in the page. It must match `site-nav-build/swap_header.py`; after any nav change update both.
- `enforcement.css`, `enforcement.js`: copied to `pages/gdpr-enforcement/` by the builder.
- `build_enforcement_page.py`: writes `out/gdpr-enforcement.html` and `out/pages/gdpr-enforcement/`.
- `build_study_guide.py`: writes `out/gdpr-enforcement-study-guide.md`, `.html` and `.pdf` (needs pandoc and Playwright Chromium).

## Rebuild

1. `python3 research/apply_verify.py` (only if `raw/` changed)
2. `python3 build_enforcement_page.py`
3. `python3 build_study_guide.py`
4. Copy `out/gdpr-enforcement.html` to the repo root and `out/pages/gdpr-enforcement/*` to `pages/gdpr-enforcement/`.
5. Check: no em dashes, every `#ge-c-xx` anchor resolves, no horizontal overflow at 390px.
