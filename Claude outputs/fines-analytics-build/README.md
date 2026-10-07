# fines-analytics-build

Builds `pages/gdpr-fines-analytics/analytics-data.js`, the data behind
`gdpr-fines-analytics.html`.

## Source

The public GDPR enforcement tracker's Analytics page carries every case as JSON in
`<script type="application/json" id="et-analytics">`. Save that page's HTML (or just the
JSON inside the tag) and extract the array to `raw.json`. Each row has:
`e` case number, `c`/`C` country code and name, `a` authority, `d` decision date
(`YYYY-MM-DD`, `YYYY-MM` or `YYYY`), `y` year, `f` fine in EUR or null, `p` controller,
`s` sector, `r` quoted Articles, `t` violation type.

## Run

    python3 build_analytics_data.py raw.json analytics-data.js

then copy `analytics-data.js` into `pages/gdpr-fines-analytics/`. The script prints the
case count, the number with an amount and the total, which should match the KPI line on
the tracker's own Analytics page (on 27 Sept 2026: 3,275 cases, 3,141 with an amount,
EUR 7,159,322,834, decisions to 3 Sept 2026).

## What it changes on the way through

- GDPR Articles are re-derived from `r` with the fine calculator's rule: an `Art. N` is
  kept when the text up to the next `Art.` names the Regulation (GDPR, GPDR, GDRP, DSGVO,
  RGPD) or holds no word of three or more letters once bracketed text is removed.
  National statutes drop out; 114 cases cite no GDPR Article at all.
- The two DPO violation labels the tracker renamed over time are merged.
- "Accomodation" is spelled correctly.
- Countries are title cased.

## Pseudonymisation

The tracker names some fined natural persons in the controller field: individuals, sole
traders and partnerships named after their partners. `pseudonymise.json` maps each of
those names to a role label ("Private individual", "Physician", "Sole trader", ...) and
`build_analytics_data.py` applies it to every row, so a rebuild stays clean. Officials
fined in a public role keep their names. Limited companies are legal persons and are not
in the map. When the tracker adds cases, check the new controller names and extend the
JSON before publishing. The same labels were applied to the `company` and `company_key`
columns of `fines_master_v3.csv` and `v4.csv` (change PII-01, 7 Oct 2026, baseline in
`tool-baselines/2026-10-07-PII-01/`).

## Chart library

`pages/gdpr-fines-analytics/chart.umd.min.js` is Chart.js 4.5.1 (MIT), self-hosted so
the page makes no third-party request and needs no consent entry. To update it, take
`dist/chart.umd.min.js` from the `chart.js` npm package.
