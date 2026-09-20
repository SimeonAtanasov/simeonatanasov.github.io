# Source verification of the three digests: scripts, change sets and raw results

The 20 September 2026 pass that checked every digest takeaway against the official text of
the document it describes, plus the link probe and the retry pass that followed it the same
day. This folder holds the machinery and the evidence.

**The reports are not here.** They sit at the `Claude outputs/` root:
`source-verification-2026-09-20.md` (what was checked and what came back),
`digest-source-coverage-2026-09-20.md` with its `.csv` (why 286 source links could not be
downloaded and what is behind each), and `retry-verification-2026-09-20.md` (the 70 entries
whose source page carried a direct PDF the downloader had missed).

## The two apply scripts, and when to rerun them

Both are keyed on the exact current value, so a rerun after another edit fails loudly
instead of writing the wrong thing, and a rerun on current data is a no-op.

- **apply_source_review.py**: the takeaway corrections. Run from the build folder that holds
  the data file:
  `python3 apply_source_review.py edpb <digest.json>`,
  `python3 apply_source_review.py cookie <all_merged.json>`,
  `python3 apply_source_review.py aia <items_corpus.json>`.
  It carries 98 changes as it stands: 60 EDPB, 34 cookie, 4 AI Act. Later passes added to
  the same change set, so the figure is higher than the 92 the report records.
- **apply_linkfix.py**: the 17 source links that did not reach their document.
  `python3 apply_linkfix.py <digest.json | items_corpus.json | all_merged.json>`.
  It is a flat map of old URL to new, so it is safe against any of the three data files.
  Thirteen of the seventeen are EDPB Article 64 opinion URLs whose slug omits
  `draft-decision-of-the` and which return HTTP 200 while serving the generic Documents
  listing; the rest were hard 404s or documents that had moved section.

**This is not the whole rerun chain.** Several builders regenerate their data file from
upstream inputs, which drops every correction applied to it, and these two scripts are only
the first of up to six that have to be replayed. The authoritative order for all four data
files is in `claude/verification-method.md` in the Claude project. Getting it wrong reverts
corrections silently.

## The change sets

- **source_review_changes.json**: keyed by digest (`edpb`, `cookie`, `aia`), then by entry
  index, each field carrying `old` and `new`.
- **linkfix.json**: 17 pairs of old URL to new URL.

## The raw results

- **source-verification-results.json**, 304 entries, one per entry checked against its
  downloaded text. Verdicts as the file now stands: 198 confirmed, 80 minor, 13 correction,
  12 `wrong_file`, 1 `unverifiable`. The seven CJEU cookie entries were resolved from EUR-Lex
  later the same day and are no longer `wrong_file`, which is why this differs from the
  summary table in the report. Each entry carries `file_used`, so a finding can always be
  traced back to the text that produced it.
- **retry-verification-results.json**, 70 entries, 49 EDPB, 13 cookie and 8 AI Act. Carries
  `better_pdf_url` where the source page's own PDF link turned out to be a different
  document. **Use those values for a second download run, not the probe's column.**
- **source-link-probe-results.json**, 277 rows, 161 cookie, 70 EDPB and 46 AI Act: what each
  non-downloaded source link actually serves, with `final_url`, `form`, `pdf_url` and
  `is_the_named_document`. It is one row per distinct URL, while
  `digest-source-coverage-2026-09-20.csv` at the root is one row per digest entry and so has
  286: nine entries share a source link with another entry.

## What this pass could not do, and what closed it

It could only check entries whose source had been downloaded as a PDF. Everything else was
unchecked, not wrong. Those entries were reached later the same day through their live
source pages: see `../live-recheck-2026-09-20/` and, for the sixteen cookie entries whose
download had taken the wrong file, `cookie-final-sixteen-2026-09-20.md` in that folder.
