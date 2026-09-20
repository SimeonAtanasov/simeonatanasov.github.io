# Primary law verification, 20 September 2026

Everything on the site had been checked against the documents it describes. Nothing had
been checked against the two regulations themselves. This pass closes that gap.

## Sources

| What | Where |
| --- | --- |
| AI Act, consolidated | EUR-Lex CELEX 02024R1689-20260727, Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744 |
| AI Act, as published | EUR-Lex ELI reg/2024/1689, used for the 180 recitals |
| Digital Omnibus on AI | Regulation (EU) 2026/1744, OJ L of 24 July 2026, in force 27 July 2026 |
| GDPR | EUR-Lex ELI reg/2016/679 |

Neither the cloud sandbox nor the shell on the linked computer can reach eur-lex.europa.eu
through the egress proxy. The texts were pulled through the browser pane on the linked
computer and held in page memory, and the checking agents read them from there.

## Scope

| Pass | Checked | Confirmed | Minor | Correction |
| --- | --- | --- | --- | --- |
| AI Act Digest, Part 1 | 133 entries | 85 | 34 | 14 |
| GDPR citations, EDPB and cookie digests | 386 entries, about 350 in-scope citations | 385 | 0 | 1 |

For Part 1 every field was checked: the takeaway, the application date against Article 113,
the Omnibus note against the amendment markers in the consolidated text, the roles the
entry says the provision binds, and every recital number cited.

## The material errors

Two application dates were wrong in a way that would mislead a reader planning work.

- **Article 78, Confidentiality.** The entry said 2 August 2026. Article 113, point (b)
  names Article 78 expressly among the provisions that apply from **2 August 2025**. The
  entry's own takeaway had it right, so the date field contradicted the body.
- **Article 101, Fines for providers of general-purpose AI models.** The entry said
  2 August 2025. Article 113, point (b) excepts Article 101 from that date, so it falls
  under the default, **2 August 2026**. Again the takeaway had it right.

Four Omnibus notes described the law backwards or attributed base text to the amendment.

- **Article 56(6), codes of practice.** The note said the amendment confirmed that the
  Commission approves a code and gives it general validity by implementing act. The
  amendment did the opposite: it removed that power. Consolidated 56(6) is monitoring,
  an adequacy assessment and publication of that assessment. The takeaway carried the
  same error and was corrected too.
- **Article 50(7), marking of generated content.** Same error in the other direction: the
  note kept the pre-Omnibus approval power. The Commission now assesses adequacy under
  the Article 56(6) procedure, and may set common rules by implementing act only if it
  finds a code inadequate.
- **Article 25(4), value chain.** The note credited the amendment with the AI Office
  voluntary model contract terms. That subparagraph is unamended base text. The real
  change replaced the first subparagraph of paragraph 4.
- **Article 27, fundamental rights impact assessment.** The note described the original
  paragraph 5 wording as new. The amendment replaced paragraph 4: the assessment no
  longer has to complement a data protection impact assessment, it may cross-refer to it.

Others of substance: Article 76(1) was said to name the European Data Protection
Supervisor, which it does not; Article 69 named the wrong paragraph; Article 30 called
unamended text new; Article 57's national sandbox deadline moved to 2 August 2027 and
the entry still said 2026; Article 60a's paragraph 6 was read backwards; Article 96
attributed a paragraph 1 duty to paragraph 2; and the Annex I entry still used the
pre-Omnibus Article 2(2) scope of Article 6(1) and Articles 102 to 109, which is now
Article 6(1), Article 60a and Articles 102 to 112.

## Omissions found

Five provisions carry an Omnibus amendment but had no note: Articles 1, 40, and parts of
2, 77 and 99. All now carry one. Article 6(5) is expressly carved out of the deferred
dates in Article 113(c) and applies from 2 August 2026; that is now in the takeaway.

## Counts corrected

Two counts had gone stale against the consolidated text. Article 3 now holds 70
definitions, not 68, because the Omnibus inserted points 14a and 14b. Article 5(1) now
prohibits ten practices, not eight, because of the new points (ba) and (bb).

## Recitals

All 133 entries' recital citations were checked against the 180 recitals of the published
text. Every number cited exists. Seven citations were off topic and were replaced or
dropped: recital 3 on Article 5, 145 on Articles 16 and 31, 4 and 26 on Article 27, 147
on Article 43, 166 on Article 95 and 33 on Annex I.

## GDPR citations

386 takeaways across the EDPB and cookie digests cite an article. Citations to the
ePrivacy Directive, the DSA, the DMA, the Charter, national implementing acts and
non-EU laws were identified and left alone. About 350 GDPR citations were read against
Regulation 2016/679. One was wrong:

- **EDPB Opinion 04/2024, main establishment.** The entry said that unless the place of
  central administration takes the decisions on purposes and means, the one-stop-shop
  does not apply. Article 4(16)(a) instead moves the main establishment to whichever
  Union establishment does take those decisions. The one-stop-shop falls away only when
  no Union establishment takes them.

Everything else held, including the 100-odd Article 64(1)(f) binding corporate rules
one-liners, the Article 35(4) national list opinions, the fine tiers in Article 83, the
72 hours in Article 33(1) and the one month in Article 12(3).

## The two advice pages

`practical-privacy.html` and `practical-ai-act-advice.html` had never been through any
verification pass. Their citations were read against the same texts: 4 on the privacy page
and 33 on the AI Act page, all verified except one reference to Japanese copyright law.
Three needed fixing, all now applied.

- **Article 48 GDPR**, privacy page. It said a foreign court order can only be acted on
  where an international agreement applies. Article 48 ends "without prejudice to other
  grounds for transfer pursuant to this Chapter", so an Article 49 derogation can still
  carry the transfer. Restated.
- **Article 27(5) AI Act**, advice page. Same error as the digest: the AI Office
  questionnaire template and automated tool were credited to the Omnibus. They are 2024
  text.
- **Article 4 AI Act**, advice page. It attributed "no specific level is mandated" to
  Commission guidance. Since the Omnibus that sentence is in Article 4(1) itself.

A fourth change removes an ambiguity rather than an error: the privacy page said the
Digital Omnibus "is a proposal under negotiation", which now reads oddly beside the AI arm
adopted as Regulation (EU) 2026/1744. It now names the data arm.

The rest held, including the whole Article 99 penalty table, the Article 73 reporting
deadlines, the Article 111 transitional dates, the Annex I machinery move, and the correct
treatment of GDPR Articles 88a and 88b as proposed rather than enacted.

One point left alone: the advice page dates the Article 49 EU database registration duty to
2 December 2027. Strictly Article 49 sits in Chapter III Section 5, which Article 113(c)
does not defer, so it applies from 2 August 2026. The page's framing holds because Article
6(2) does not apply until 2 December 2027 and the duty has no object before then.

## What changed on disk

| File | Change |
| --- | --- |
| `Claude outputs/ai-act-digest-build/items_a.json` to `items_e.json` | 66 field changes across 50 entries |
| `Claude outputs/ai-act-digest-build/ai_act_digest.json` | rebuilt |
| `ai-act-digest.html` | rebuilt, 45 provisions now flagged as Omnibus-amended, up from 43 |
| `Claude outputs/ai-act-digest-2026-09-19-v2.pdf` | rebuilt, 80 pages |
| `Claude outputs/edpb-digest-build/digest.json` | 1 takeaway |
| `edpb-digest.html` | rebuilt |
| `Claude outputs/edpb-digest-2026-09-19.pdf` | rebuilt |
| `Claude outputs/source-verification-2026-09-20/source_review_changes.json` | EDPB entry 157 added, 60 EDPB changes now |
| `practical-privacy.html`, `practical-ai-act-advice.html` | four sentences edited in place |
| `Claude outputs/privacy-ai-act-assessments-study-pack-v2.pdf` | rebuilt, 145 pages: it reprints both advice pages, so it carried the same four sentences |
| `Claude outputs/study-pack-build/` | new: the study pack's build files, which until now existed only in the working sandbox |

The cookie digest was not touched: no GDPR citation in it was wrong.

## PDFs

All five print files in `Claude outputs/` were checked against their current data, not
assumed:

| PDF | State |
| --- | --- |
| `ai-act-digest-2026-09-19-v2.pdf` | rebuilt, 80 pages |
| `edpb-digest-2026-09-19.pdf` | rebuilt, 111 pages |
| `cookie-compliance-digest-2026-09-19.pdf` | already current. Rebuilding from the repo data produced a byte-identical page and identical PDF text, 71 pages, so it was left alone |
| `privacy-ai-act-assessments-study-pack-v2.pdf` | rebuilt, 145 pages. It reprints the two advice pages, so it carried the same three citation errors |
| `site-verification-report-2026-09-19-v2.pdf` | left alone: it is a dated record of the 19 September pass, not living content |

## Reproducing

`apply_law_review.py` in this folder replays the 66 AI Act field changes against
`items_a.json` to `items_e.json`. Every change carries the exact text it expects to find,
so a rerun after another edit fails loudly rather than writing the wrong thing, and a
rerun on already-current data is a no-op. Run it after any rebuild that regenerates those
files.

`LAWCHECK.md` and `GDPRCHECK.md` are the briefs the checking agents worked from.

## Still unchecked

- Part 2 of the AI Act Digest, the corpus of guidelines, codes of practice and opinions,
  was verified against the documents themselves in the 20 September source pass but its
  article cross-references have not been checked against the Act.
