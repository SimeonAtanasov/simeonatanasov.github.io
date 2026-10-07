# assistant-build

Builds `assets/assistant/index.json`, the search index behind the site assistant
(the "Ask" launcher on every page, `assets/js/assistant.js` and
`assets/css/assistant.css`, loaded by `assets/js/pwa.js`). Change SA-01, 7 October 2026.
The design decisions and the measurements are in the project doc `claude/site-assistant.md`.

## Rebuild the index

Needed after any digest rebuild, any edit to the advice pages or the study pack, any
tool change in `assessment.js` that the study pack reflects, any enforcement or crosswalk
rebuild, or an edit to the two notices. The assistant shows the index, not the live pages.

```
pip install beautifulsoup4 lxml          # once
python3 build_index.py --repo <repo root>
```

Writes `<repo>/assets/assistant/index.json` (about 2 MB, 490 KB over the wire) and
`work/chunks.json` for inspection, and prints counts, the longest chunk and the md5.
Node must be on PATH: `dump_js_data.js` evaluates `readiness-data.js` and
`crosswalk-data.js` to get at their data. The script refuses nothing silently: every
chunk id must be unique, any em dash in a source is replaced and counted in a warning.

What goes in, and where each chunk links:

| Source | Chunks | Link |
|---|---|---|
| `edpb-digest.html` entries (enriched from `edpb-digest-build/digest.json` by URL) | 544 | `edpb-digest.html#ed-dNNN` |
| `cookie-digest.html` entries (enriched from `cookie-digest-build/cookie_digest.json`) | 259 | `cookie-digest.html#ck-dNNN` |
| `ai-act-digest-build/ai_act_digest.json`, regulation and corpus, Omnibus notes separate | 191 (236 with the notes) | `ai-act-digest.html#art-N`, `#annex-N`, `#doc-NN` |
| `study-pack-build/pages.json`, the two advice pages, split at about 1,400 characters | 31 sections | `practical-privacy.html#<section>`, `practical-ai-act-advice.html#<section>` |
| Study pack, "The Assessment Suite": per tool the overview, how the scoring works, where people get it wrong, every question step | 10 tools | `privacy-ai-assessment.html#tool-<id>` |
| Study pack, "The GDPR Readiness Model" and `readiness-data.js`, one chunk per activity | 71 activities plus the method | `gdpr-readiness.html#ra-how`, `#ra-step-2` |
| `crosswalk-data.js` rows | 28 | `ai-governance-crosswalk.html#cw-rNN` |
| Enforcement pages: sections, and per country the plain-words paragraph and one chunk per block | 40 + 27 countries | `gdpr-enforcement.html#ge-c-xx`, `privacy-enforcement-worldwide.html#ge-c-xx` |
| `study-guides/ai-assessment-pathway-guide.md` sections 1 to 8 (not the question list, self-test or sources) | 17 | `privacy-ai-assessment.html#tool-aipath` |
| `study-guides/gdpr-fine-calculator-explained.md` sections 1 to 7 | 15 | `gdpr-fine-calculator.html#fc-method` |
| `cookie-notice.html`, `privacy-notice.html` sections | 22 | the page |
| Tool catalogue and FAQ, hand-written in `build_index.py` (`TOOLS`, `FAQ`) | 24 + 8 | the tool |

2,101 chunks on 7 October 2026, median 724 characters, longest 1,783. The digest entry ids
are read from the pages, not from the JSON: `ed-dNNN` is positional on the page and does
not match the JSON `id`, which is why the HTML is the source for those two.

The tool catalogue and the FAQ are site copy. Keep them company-agnostic and keep them
true: the FAQ about data staying on the device is checked against `privacy-notice.html`.

## How the ranking works

All in `assets/js/assistant.js`, built in the browser from the index in about 250 ms:

- Tokens: lowercase, split on anything that is not a letter or digit (so `high-risk`
  matches `high risk`), stop words dropped, `-ise` spellings normalised to `-ize`, Porter
  stemmed. `search_text.py` and `porter.py` are the Python mirror; `test_tokenizer.js`
  checks the two agree on every word in the corpus (10,429 words, 0 mismatches).
- Index text per chunk: title three times, the text, the page label and the meta line.
  The page label is what lets "penalties under the AI Act" rank Article 99 above the
  guidance documents: every AI Act chunk matches "AI Act", so the rare word decides.
- BM25, k1 1.2, b 0.5. The question is expanded with the synonym and abbreviation table
  (`SYNONYMS` in `build_index.py`, shipped in the index) at half weight; the chunks are
  not expanded, which keeps the inverse document frequency of words like "penalty" intact.
- Adjacent question words found adjacent in a chunk add 10 percent each.

## Why there is no model

Measured on 7 October 2026 on 50 realistic questions with expected hits
(`eval_retrieval.py`, `eval_bm25.py`; the model files are not in the repo, see below):

| Ranker | hit@5 | hit@10 | MRR |
|---|---|---|---|
| First keyword baseline (light stemming, synonyms on both sides) | 0.82 | 0.86 | 0.71 |
| all-MiniLM-L6-v2, both sides (the full model, 23 to 45 MB in the browser) | 0.86 | 0.92 | 0.68 |
| Full model fused with keyword search | 0.88 | 0.96 | 0.70 |
| Static table distilled from the model (Model2Vec method, 256 dims, 7 MB) | 0.62 | 0.68 | 0.47 |
| Static table fused with keyword search | 0.76 | 0.88 | 0.60 |
| **Keyword search as shipped** (stemming, expansion, title and page weighting) | **0.94** | **0.96** | **0.84** |

The distilled table, the only model small enough to ship on a static site, made the
combined results worse than keyword search alone, and the full model is too large for
phones and the installed app for a two-point gain. Meaning-based matching is the API's job
if the assistant ever gets an answering model (the Part 2 plan in `claude/site-assistant.md`).

To rerun the measurement: `pip install numpy scikit-learn onnxruntime tokenizers`, put
`model.onnx` and `tokenizer.json` of `sentence-transformers/all-MiniLM-L6-v2` (ONNX export;
SHA-256 of the model `6fd5d72fe4589f189f8ebc006442dbb529bb7ce38f8082112682524616046452`) in
`model/`, run `build_index.py --embed` once, then `eval_retrieval.py`. `eval_bm25.py` needs
only the index.

## Tests

- `node test_tokenizer.js [index.json]`: tokenizer parity and the JS ranker against the 50
  questions. Needs `work/words.json` and `work/tests.json`, which `eval_bm25.py` writes.
- `node test_ui.js [base url]` and `node test_jump.js [base url]`: Playwright over eight
  pages at 1600, 1000 and 390 px: the launcher overlaps no other floating control, results
  come back, the chooser recommends a tool, the panel fits, no horizontal overflow, no page
  errors, no request leaves the origin, the cookie banner hides the launcher, a same-page
  result opens its `<details>` and lands below the sticky header, Escape closes. Serve the
  repo root first (`python3 -m http.server 8765`).

## Files

- `build_index.py`: the builder (sources, chunking, catalogue, FAQ, synonyms).
- `dump_js_data.js`: evaluates the two data scripts for the builder.
- `porter.py`, `search_text.py`: the tokenizer in Python, for the measurements.
- `eval_retrieval.py`, `eval_bm25.py`: the measurements above.
- `test_tokenizer.js`, `test_ui.js`, `test_jump.js`: the tests.
- `patch_site.py`: the SA-01 edits to `pwa.js`, `sw.js` and the root README, with md5 guards.
