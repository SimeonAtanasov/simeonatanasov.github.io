# STUDY-02 and TC-08 documentation in the repo: root README, llms.txt, the two build READMEs,
# and a README for ai-pathway-build. Read-modify-write with assertions.
import sys, os, hashlib
R = sys.argv[1]
def rd(p): return open(os.path.join(R, p), "rb").read().decode("utf-8")
def wr(p, s):
    open(os.path.join(R, p), "wb").write(s.encode("utf-8")); b = s.encode("utf-8")
    print("%-60s %7d %s" % (p, len(b), hashlib.md5(b).hexdigest()))
def rep(s, a, b):
    assert s.count(a) == 1, (a[:60], s.count(a)); return s.replace(a, b)

p = "README.md"; s = rd(p)
s = rep(s, "| `privacy-ai-assessment.html` | Nine assessment tools behind one landing page:", "| `privacy-ai-assessment.html` | Ten assessment tools behind one landing page:")
s = rep(s, "and Transfer Impact Assessment (EDPB Rec. 01/2020). 86 steps, 433 questions (the AI Risk Assessment gained", "and Transfer Impact Assessment (EDPB Rec. 01/2020), and since 3 October 2026 the AI Assessment Pathway (`#tool-aipath`: one intake, impact level I to IV, generative AI and EU AI Act modules on triggers, one register mapped to NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore GenAI framework, FRIA and DPIA handovers). 104 steps, 534 questions (the AI Risk Assessment gained")
s = rep(s, "`assessment.js` (all nine tools and their scoring)", "`assessment.js` (all ten tools and their scoring)")
s = rep(s, "| `study-guides/privacy-ai-act-assessments-study-pack-v2.pdf` | 161-page greyscale study pack (rebuilt 3 October 2026 to add the three new tools;", "| `study-guides/privacy-ai-act-assessments-study-pack-v2.pdf` | 174-page greyscale study pack (rebuilt 3 October 2026 for the three new tools and the AI Assessment Pathway;")
s = rep(s, "all nine assessment tools with cheat sheets and full question banks, the readiness model with all 71 activities, 74 self-test questions", "all ten assessment tools with cheat sheets and full question banks, the readiness model with all 71 activities, 78 self-test questions")
row = "| `study-guides/privacy-ai-act-assessments-study-pack-v2.pdf` |"
i = s.index(row); j = s.index("\n", i)
s = s[:j + 1] + "| `study-guides/ai-assessment-pathway-guide.pdf` and `.md` | AI Assessment Pathway study guide (30 pages, 3 October 2026): AI versus generative AI risk assessment, which assessment for which case, the six benchmarks, how the pathway works, the EU AI Act module, the impact level, coverage tables, the eight worked scenarios, every question with its condition and mappings, 15 practice questions. Built by `ai-pathway-build/build_guide.py` from the shipped `assessment.js`. | You want to learn or explain the pathway. |\n" + s[j + 1:]
a = "| `ai-crosswalk-build/` | Builds `ai-governance-crosswalk.html`"
i = s.index(a)
s = s[:i] + "| `ai-pathway-build/` | Build, test and documentation files of the AI Assessment Pathway (TC-08, NAV-03, 3 October 2026): the five source parts and `build_aipath.py` that assembles the block, `patch_assessment.py` that inserts it into `assessment.js`, `wire_nav03.py` for the nav and home page, the scenario, regression, UI, home card and export tests, the overlap matrix, source notes and tier review, and `build_guide.py` with `guide_data.js` for the study guide. README inside. | You change the pathway, rerun its tests, or rebuild its study guide. |\n" + s[i:]
wr(p, s)

p = "llms.txt"; s = rd(p)
s = rep(s, "fundamental rights impact, generative AI risk and transfer impact.", "fundamental rights impact, generative AI risk, transfer impact, and an AI assessment pathway that runs the AI tools as one with an impact level and framework coverage.")
wr(p, s)

p = "Claude outputs/study-guides/README.md"; s = rd(p)
s = rep(s, "| Study pack: Practical Privacy, Practical AI Act Advice, the nine assessment tools, the GDPR Readiness model (161 pages, 74 self-test questions) |", "| Study pack: Practical Privacy, Practical AI Act Advice, the ten assessment tools, the GDPR Readiness model (174 pages, 78 self-test questions) |")
a = "| GDPR and privacy enforcement, Europe and worldwide"
i = s.index(a)
s = s[:i] + "| AI Assessment Pathway study guide (30 pages, 15 practice questions) | `ai-assessment-pathway-guide.pdf` | `ai-assessment-pathway-guide.md` | the Markdown is the source; the PDF is printed from it by the same script | `../ai-pathway-build/build_guide.py` |\n" + s[i:]
wr(p, s)

p = "Claude outputs/study-pack-build/README.md"; s = rd(p)
s = rep(s, "(161 pages since 3 October 2026, greyscale)", "(174 pages since 3 October 2026, greyscale)")
s += """
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
"""
wr(p, s)

p = "Claude outputs/ai-pathway-build/README.md"
assert not os.path.exists(os.path.join(R, p))
wr(p, """# AI Assessment Pathway build

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
""")
