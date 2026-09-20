# Check GDPR article citations against Regulation (EU) 2016/679

Entries on a public reference site cite GDPR articles in their takeaways. Your job is
narrow: for each cited GDPR article, does the article actually say what the takeaway
says it says? You are NOT re-verifying the underlying document, only the legal citation.

## How to reach the text

The GDPR is already loaded and cached in a browser tab on the user's computer. You read
it by running read-only JavaScript in that tab.

1. Load the tool once:
   `ToolSearch` with query `select:mcp__remote-devices__Claude_Browser__javascript_tool`
2. Call it with `action: "javascript_exec"` and `text: "<your expression>"`.

Globals (read-only for you):

- `window.__G` : Regulation (EU) 2016/679, keyed by article number as a string, `"1"` to
  `"99"`. Each value is `{title, text}`, the full article.
- `window.__L.gdpr` : the GDPR as published in the Official Journal, recitals included.
  Use this only when you need a recital.
- `window.__A` : the AI Act, keyed `"1"` to `"113"` plus `"4a"`, `"60a"`, `"75a"` to
  `"75d"`. Use it when an entry plainly means an AI Act article.

Examples of good calls:

- `window.__G['35'].text.slice(0,2500)`
- `var t=window.__G['6'].text; t.slice(t.indexOf('(f)'), t.indexOf('(f)')+600)`
- `JSON.stringify(window.__G['64'].title)`

Rules, strictly:

- NEVER navigate, reload, or assign to any `window.__*` global. Other agents share the
  tab. Read only.
- Keep each returned slice under about 3000 characters. Several small calls, not one
  huge one.
- If a global comes back undefined, say so in your reply and stop.

## Which citations are in scope

Read the takeaway and decide, from its subject, which instrument each "Article N" refers
to. Only GDPR citations are in scope. Skip, without flagging:

- ePrivacy Directive 2002/58/EC citations. In cookie and tracking entries "Article 5(3)"
  almost always means the ePrivacy Directive's consent rule for storing or accessing
  information on terminal equipment, not GDPR Article 5(3).
- AI Act citations (you may check these against `window.__A` if it is quick, and flag a
  clear error, but they are not the job).
- National law, Member State implementing acts, the Charter, the TFEU, the DSA, the DMA,
  the Data Act, the EUDPR (Regulation 2018/1725), NIS2, DORA, and any other instrument.
- A bare article number with no instrument that could be either: skip it.

When you are unsure which instrument is meant, skip it rather than guess.

## What to check for an in-scope citation

- The article number is right for the proposition (for example, a takeaway describing
  the one-stop-shop consistency mechanism should cite Article 63 to 67, not Article 60
  alone if it means the binding dispute resolution in Article 65).
- Any paragraph or point cited exists and says what is claimed.
- Figures and thresholds attributed to the article (fine tiers in Articles 83(4) and
  83(5), the 72 hours in Article 33(1), the one month in Article 12(3)).
- Who the article binds (controller, processor, supervisory authority, Board).

Do NOT flag style, brevity, or a correct paraphrase. A takeaway that cites a broader
article than strictly necessary is fine. Flag only a citation that is wrong or
misleading.

## Output

Write ONE JSON list to the results path in your task, with an object ONLY for entries
that have a problem. Skip clean entries entirely.

```
{
  "key": "<the entry key, unchanged>",
  "digest": "edpb" | "cookie",
  "issues": [
    {"claim": "<the words in the takeaway>",
     "gdpr_says": "<what the article says, with the paragraph or point>",
     "severity": "high" | "medium" | "low",
     "kind": "wrong-article" | "wrong-paragraph" | "wrong-substance" | "outdated"}
  ],
  "new_takeaway": "<full replacement, or null if you cannot fix it cleanly>",
  "note": "<one short line>"
}
```

Rules for `new_takeaway`: keep the original's structure and length exactly. EDPB written
takeaways are 2 to 4 sentences; one-liners stay one sentence; cookie takeaways keep
their fine amounts and article references. Change only the citation that is wrong.
British spelling. **No em dashes anywhere** (use a comma, colon or full stop).

When done, reply with: how many entries you checked, how many in-scope GDPR citations
you verified, how many entries you flagged, and one line per flagged entry.
