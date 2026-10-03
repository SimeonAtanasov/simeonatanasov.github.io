# AI Assessment Pathway build

The tenth tool of `privacy-ai-assessment.html` (TC-08, NAV-03 and STUDY-02 in the tool change
log, 3 October 2026). Spec and build record are project docs: `claude/ai-assessment-pathway.md`
and `claude/ai-pathway-progress.md`.

| File | What it is |
|---|---|
| `aipath_part1.js` to `aipath_part5.js` | The source of the pathway block: mapping layer and coverage; tier; steps; derive, findings and the AI Act module; result, seeds and renderer |
| `build_aipath.py` | Assembles the parts into `aipath_block.js` and fills the NIST and ISO texts from `../ai-crosswalk-build/` (fails on an unknown id or an em dash) |
| `patch_assessment.py` | Inserts the block into `assessment.js` (asserts the TC-07 input md5; three additive hunks) |
| `wire_nav03.py` | Header nav on the 19 pages and the three header templates, home flyout and chip, page copy |
| `harness.js` | Loads `assessment.js` headlessly for the node tests |
| `scenarios.js`, `scenarios_full.js` | The eight scenarios (intake, then all answers) |
| `tier_test.js`, `scenario_test.js` | Tier and end-to-end checks in node; outputs `tier_test.out`, `scenario_test.out`, `scenario_results.json` |
| `regress.js`, `pathway_ui.js`, `home_check.js`, `export_check.js` | Playwright tests: nine tools unchanged, the pathway in the UI at 1600 and 390, ten home chips, export |
| `guide_data.js`, `build_guide.py` | The study guide: data read from the shipped code, then Markdown and PDF (`../study-guides/ai-assessment-pathway-guide.*`) |
| `ai-pathway-overlap.md`, `overlap.py`, `overlap-tail.md` | Phase 1 overlap matrix |
| `ai-pathway-sources.md`, `ai-pathway-tier.md` | Phase 2 source notes, Phase 4 tier review |
| `incoming/` | Copies of the files written over existing ones on 3 October (they went through the new-file route, then `cp`); safe to delete |

To change the pathway: edit a part, `python3 build_aipath.py`, run `patch_assessment.py` on
the baseline file (or adapt its anchors to the current file), run the tests, deploy by
read-modify-write in the device shell, check md5. Rebuild the guide with
`SRC=<assessment.js> PACK_DIR=../study-pack-build node guide_data.js` then
`python3 build_guide.py`.
