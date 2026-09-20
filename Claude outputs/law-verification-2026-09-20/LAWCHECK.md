# Verify AI Act digest entries against the official consolidated text

You are checking entries written for a public reference site against the official
consolidated text of Regulation (EU) 2024/1689 (the AI Act) as amended by Regulation
(EU) 2026/1744 (the Digital Omnibus), CELEX 02024R1689-20260727 on EUR-Lex.

## How to reach the text

The law is already loaded and cached in a browser tab on the user's computer. You read
it by running read-only JavaScript in that tab.

1. Load the tool once:
   `ToolSearch` with query `select:mcp__remote-devices__Claude_Browser__javascript_tool`
2. Call it with `action: "javascript_exec"` and `text: "<your expression>"`.

Available globals in that tab (all read-only for you):

- `window.__A` : object keyed by article number as a string. Keys are `"1"` .. `"113"`
  plus the inserted articles `"4a"`, `"60a"`, `"75a"`, `"75b"`, `"75c"`, `"75d"`.
  Each value is `{title, text}`. `text` is the full consolidated article including the
  amendment markers: `▼M1` opens text inserted or replaced by the Omnibus, `▼B` returns
  to unamended base text, and `▼M1 ————— ▼B` marks a deleted point.
- `window.__AX` : object keyed by annex numeral, `"I"` .. `"XIV"`, value is the annex text.
- `window.__CT` : the whole consolidated act as one string. It holds the enacting terms
  ONLY, with no preamble, so do not look for recitals here. Use it to search across
  articles and annexes.
- `window.__L.ai` : the AI Act as first published in the Official Journal, recitals
  included (580k characters). This is where you check recital numbers. Recital
  numbering is the AI Act's own and the consolidation does not change it.
- `window.__L.gdpr` : Regulation (EU) 2016/679 as published, recitals included.
- `window.__M` : the full text of amending Regulation (EU) 2026/1744, recitals included.
  Use it when you need the reason for an amendment.
- `window.__G` : Regulation (EU) 2016/679 (GDPR), keyed `"1"` .. `"99"`, `{title, text}`.

Read in slices, never whole objects. Examples of good calls:

- `window.__A['17'].text.slice(0,2500)`
- `var t=window.__A['72'].text; t.slice(t.indexOf(' 3.'), t.indexOf(' 3.')+1200)`
- `var t=window.__L.ai; var i=t.indexOf('(81) '); t.slice(i, i+900)`
- `var i=window.__M.indexOf('Article 17'); window.__M.slice(i-300, i+600)`
- `window.__AX['IV'].slice(0,3000)`

Rules, strictly:

- NEVER navigate, reload, or assign to any `window.__*` global. Other agents share the
  tab. Read only.
- You may set your own scratch variable with a unique prefix if you must, e.g.
  `window.__tmp_p03`, but prefer plain `var` inside the expression.
- If a global comes back undefined, say so in your reply and stop; do not try to rebuild
  it or fetch the law another way.
- Keep each returned slice under about 3000 characters. Make several calls rather than
  one huge one.

## Input

A packet JSON file (path in your task): a list of entries with

- `id` : echo it back unchanged
- `number` : "Article N" or "Annex N" (this is what to look up)
- `title`, `chapter`, `section`
- `takeaway` : the main text to verify
- `applies_from` : the application date the entry claims
- `omnibus` : a note about what Regulation 2026/1744 changed in this provision, or ""
- `binds` : who the entry says the provision binds (provider, deployer, importer,
  distributor, authority, notified-body, member-state, commission, ai-office, board, etc.)
- `recitals` : recital numbers the entry cites

## What to check

1. **takeaway** : every factual claim. Paragraph and point numbers quoted, article
   cross-references, who is bound, dates, deadlines, figures (fines, percentages,
   thresholds, counts, periods), names of bodies, and anything the entry tells the
   reader to do. Check against the CONSOLIDATED text: if the Omnibus changed a
   paragraph, the consolidated wording is what counts.
2. **applies_from** : check against Article 113 (`window.__A['113'].text`). Its
   consolidated form is:
   - default: 2 August 2026
   - (a) Chapters I and II from 2 February 2025, except Article 5(1) first subparagraph
     points (ba) and (bb) and Article 5(1a) and (1b), which apply from 2 December 2026
   - (b) Chapter III Section 4, Chapter V, Chapter VII, Chapter XII and Article 78 from
     2 August 2025, with the exception of Article 101
   - (c) Chapter III Sections 1, 2 and 3, with the exception of Article 6(5), from
     2 December 2027 for Annex III high-risk systems and 2 August 2028 for Annex I
     high-risk systems
   - (d) Articles 102 to 110 from 27 July 2026
   Articles inserted by the Omnibus apply from its entry into force, 27 July 2026.
   Annex entries have no date of their own in Article 113: judge the claimed date by the
   articles that use the annex, and only flag it if it is clearly inconsistent.
3. **omnibus** : is the note accurate? Check the `▼M1` blocks in the article text. Two
   failure modes to watch for: a note that describes the OLD wording as if it were new,
   and a note that attributes base `▼B` text to the amendment. If a provision carries a
   `▼M1` change and the note is empty, that is an omission worth flagging (medium).
   If the note describes a change that is not in the consolidated text, that is high.
4. **binds** : loose is fine. Only flag if the list names someone the provision plainly
   does not bind, or omits the provision's principal addressee.
5. **recitals** : check each cited recital number exists and is on topic. Search
   `window.__L.ai` for the recital marker, for example
   `var t=window.__L.ai; t.slice(t.indexOf('(81) '), t.indexOf('(81) ')+700)`.
   The AI Act has 180 recitals. A recital that is off topic is a low or medium issue.
   Report it as an issue with `"field": "recitals"`; there is no replacement field, so
   name the better recital number in `source_says`.

Do NOT flag style, tone, brevity, British spelling, or things the entry leaves out
unless the omission makes it misleading.

## Output

Write ONE JSON list to the results path in your task, one object per entry, same order:

```
{
  "id": "<entry id>",
  "verdict": "confirmed" | "minor" | "correction",
  "issues": [
    {"field": "takeaway" | "applies_from" | "omnibus" | "binds" | "recitals",
     "claim": "<the words in the entry>",
     "source_says": "<what the consolidated text says, with the paragraph or point>",
     "severity": "high" | "medium" | "low",
     "kind": "wrong" | "imprecise" | "outdated" | "missing"}
  ],
  "new_takeaway": "<full replacement, or null>",
  "new_applies_from": "<full replacement, or null>",
  "new_omnibus": "<full replacement, or null>",
  "note": "<one short line>"
}
```

`confirmed` = every checkable claim matches. `minor` = a small imprecision, with a fix.
`correction` = something is wrong in substance.

Rules for replacement text: keep the original's structure and length. Change only what
is wrong. British spelling. **No em dashes anywhere** (use a comma, colon or full stop).
Give a replacement for a field only when that field has an issue; otherwise null.

When done, reply with counts per verdict and one line per `correction`.
