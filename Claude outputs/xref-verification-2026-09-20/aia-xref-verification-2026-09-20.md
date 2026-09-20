# AI Act Digest Part 2: the article cross-references, checked against the Act

Date: 20 September 2026. This closes the last standing item from the law verification of the
same day: the 57 corpus entries in Part 2 had been verified against the documents they
describe, but the article and annex references they carry had never been checked against the
Act itself.

Every entry prints a set of article chips saying which provisions of the AI Act the document
relates to, and most takeaways cite articles in their text as well. **162 chips and 91
in-takeaway citations, 253 references across 57 entries**, all checked.

**Result: 53 entries clean, 2 minor, 2 corrections. Four references were wrong; 249 held.**

| Verdict | Entries |
| --- | --- |
| Clean | 53 |
| Minor | 2 |
| Correction | 2 |

## The reference text, and why it matters here

The consolidated Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, the
Digital Omnibus on AI: CELEX `02024R1689-20260727`. **119 articles** (1 to 113 plus the
inserted 4a, 60a and 75a to 75d) and **14 annexes**. It carries `▼M1` and `▼B` markers
showing which passages the Omnibus changed, which is what made the renumbering question
answerable at all.

Checking against the as-published 2024 text would have been the wrong call. Several entries
describe documents written before the Omnibus and cite articles that have since moved or
been deleted, and that gap is exactly what this pass was looking for.

The text was pulled into a per-article cache in the browser on the linked computer and read
in slices, so the Act itself never passed through the coordinating context. The build script
is in `XREF.md` in this folder and reproduces the cache in about twenty lines.

## The two corrections

**doc-23, the AI Act Service Desk FAQ on the Digital Omnibus, chipped `Art 4`.** Article 4
is "AI literacy". The takeaway never mentions AI literacy; what it does mention is
"special-category data for bias detection", which is **Article 4a**, "Processing of special
categories of personal data for bias detection and correction", the article the Omnibus
inserted. A one-letter miss, and the kind a reader would follow straight into the wrong
provision. Chip changed to `Art 4a`.

**doc-40, the EDPB-EDPS Joint Opinion 1/2026, chipped `Art 10(5)`.** That paragraph no
longer exists. In the consolidated text Article 10, "Data and data governance", runs 1, 2, 3,
4, then a `▼M1` deletion rule where 5 was, then 6. The special-categories rule
paragraph 5 used to carry has moved into Article 4a, and the new Article 10(6) cross-refers
to "Article 4a(1)" in terms. The entry already chips `Art 4a`, so the stale reference was
dropped rather than replaced: the opinion's three asks map onto `Art 4a`, `Art 74` and
`Art 49`, and adding a fourth pointer the entry says nothing about would have been worse than
none.

This is the only true renumbering casualty in the corpus. Everything else the Omnibus touched
kept its number.

## The two smaller fixes

**doc-09, the Commission Guidelines on the scope of GPAI provider obligations, chipped
`Art 51-55`.** The takeaway says the guidelines set out "how the Commission will enforce
Chapter V" and closes by pointing at the GPAI Code of Practice. Chapter V runs Article 51 to
Article 56; Article 56, "Codes of practice", closes it and Chapter VI does not begin until
Article 57. The range was one article short of the chapter the entry names. Changed to
`Art 51-56`.

**doc-42, the EDPB web scraping guidelines,** said the guidelines "require both an Article 6
basis and an Article 9 exception for special-category data". Those are GDPR articles. In an
AI Act digest, unlabelled, Article 6 reads as "Classification rules for high-risk AI systems"
and Article 9 as "Risk management system". One word added: "a GDPR Article 6 basis".

**doc-12 was deliberately left at `Art 51-55`** even though doc-09 moved to 51-56. The two
entries are not inconsistent: doc-12 is a Q&A on the provider obligations and its takeaway
covers Articles 51, 53, 91 to 93 and 101 without ever touching codes of practice, so
Articles 51 to 55 is the precise run for it. Recorded here so the difference is not read as
an oversight later.

## What was checked and held

Worth recording, because several of these look like errors until you read the article.

- **`Art 74(8)`** appears on three entries and is real. Article 74 has fourteen paragraphs in
  the consolidated text, and (8) is precisely the provision requiring Member States to
  designate data protection supervisory authorities as market surveillance authorities for
  Annex III point 1 law enforcement, border and justice uses and for Annex III points 6, 7
  and 8.
- **`Art 111(4)`** is a genuine Omnibus insertion: generative systems placed on the market
  before 2 August 2026 have until 2 December 2026 to meet Article 50(2).
- **`Art 53(1)(d)`** exists and is the training-content summary duty, and Article 53(2)
  exempts only points (a) and (b) for free and open source models, which is what two entries
  say.
- **`Art 6(1a)` to `(1c)`** exist, with `▼M1` markers confirming them as Omnibus insertions.
- **`Art 43(3)`** literally contains the 28 January 2028 notified body deadline, `Art 97(2)`
  the two five-year delegation periods behind the 1 August 2029 and 27 July 2031 expiries,
  and `Art 99(3)`, `(4)` and `(5)` the 35M/7, 15M/3 and 7.5M/1 percent tiers.
- **`Art 8-15`** holds as a range on two entries: Article 15 ends where Section 3 begins, so
  the run really is the Chapter III Section 2 requirements.
- **`Art 56` on doc-18** looked wrong, since it sits in the GPAI chapter, but the
  Omnibus-amended Article 50(7) routes the adequacy assessment of a transparency code through
  "the procedure laid down in Article 56(6)". The chip is right.
- **`Art 70` on doc-39**, the 2021 joint opinion, is not a renumbering error. The opinion
  argued against the proposal's Article 59 on national supervisory authorities, and Article 70
  is where the adopted Act settled that question, so a reader following the chip lands on the
  regime the opinion was addressing.

## One process note

The agent checking entries 31 to 40 merged doc-40's finding into doc-39's result object and
dropped doc-40 entirely, which would have written doc-40's chip list over doc-39's and
destroyed that entry. It was caught by checking the returned ids against the packet ids and
the count per packet, not by reading the findings. Both entries were then rechecked by a
fresh agent told explicitly to keep them apart.

The check is cheap and it is the only thing that catches this class of error, so it is worth
making standard: **verify that every packet came back with the ids it was given, in the right
number, before reading a single finding.**

## What changed on disk

| File | Change |
| --- | --- |
| `Claude outputs/ai-act-digest-build/items_corpus.json` | 4 field changes across 4 entries: 3 chip lists, 1 takeaway |
| `Claude outputs/ai-act-digest-build/ai_act_digest.json` | regenerated by the page builder |
| `ai-act-digest.html` | rebuilt, 190 entries |
| `Claude outputs/ai-act-digest-2026-09-19-v2.pdf` | rebuilt, 80 pages |

`pages/ai-act-digest/ai-act-digest.css` is byte for byte unchanged and was not redeployed.

`apply_xref.py` in this folder replays the change set against `items_corpus.json`. Like its
predecessors it asserts on the exact value it expects, so a rerun after another edit fails
loudly and a rerun on current data is a no-op. Add it to the list that has to be rerun after
anything regenerating `items_corpus.json`.

**One thing to know about the rebuild.** Before applying anything, the page was regenerated
from the unchanged data and compared to the deployed `ai-act-digest.html`. It matched
everywhere except a single newline between `</div>` and `<div class="ai-toc-fold">`, which
the current builder emits and the deployed file does not have. The CSS reproduced byte for
byte. So the deployed page was produced by a slightly earlier state of the build chain, or had
that whitespace stripped afterwards. It is cosmetically and functionally irrelevant, the
rebuild is the repo's own build chain, and it is recorded here only so the one-byte difference
is not mistaken later for a content change.

## Coverage now

| Digest | Entries | Checked against the source | Article references checked against the Act |
| --- | --- | --- | --- |
| EDPB | 543 | 541 | not applicable |
| Cookie | 259 | 259 | not applicable |
| AI Act Part 1 | 133 | 133, against EUR-Lex | the entries are the Act |
| AI Act Part 2 | 57 | 57 | **57** |

Part 2's article cross-references were the last unchecked thing in the three digests that a
document could settle. What remains open is of a different kind: the non-citation prose of the
two advice pages, which is practical advice rather than a claim about a text, and the two EDPB
entries whose sources cannot be read.
