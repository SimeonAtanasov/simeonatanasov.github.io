# Check the AI Act digest's article cross-references against the Act

Part 2 of the AI Act Digest is a corpus of 57 guidance documents, opinions, national laws
and tools. Every entry carries a set of **article chips** naming the provisions of the AI
Act it relates to, and most takeaways also cite articles in their text. Those citations have
been written but never checked against the Act itself. That is your job.

The takeaways themselves were verified against their own source documents on 20 September
2026. **You are not re-checking the takeaway.** You are checking one thing only: do the
article and annex references point at the provisions they claim to.

## The reference text

The **consolidated** Regulation (EU) 2024/1689, as amended by Regulation (EU) 2026/1744 (the
Digital Omnibus on AI). Consolidated CELEX `02024R1689-20260727`. It has 119 articles (1 to
113 plus the inserted 4a, 60a and 75a to 75d) and 14 annexes, and it carries `▼M1` and `▼B`
markers showing which passages the Omnibus changed.

Build your own copy of it in your own browser tab. Do not reuse another agent's tab.

1. `mcp__remote-devices__Claude_Browser__preview_start` with
   `https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02024R1689-20260727`
   Keep the `tabId` it returns and pass it to every later call.
2. Run this in `javascript_tool` on that tab, exactly as written. It returns only counts.

```js
const txt = document.body.innerText;
const re = /^[ \t]*Article\s+(\d+[a-z]?)[ \t]*$/gmi;
const marks = []; let m;
while ((m = re.exec(txt)) !== null) marks.push({num: m[1], start: m.index, after: m.index + m[0].length});
const A = {};
for (let i = 0; i < marks.length; i++) {
  const end = (i + 1 < marks.length) ? marks[i+1].start : txt.length;
  const body = txt.slice(marks[i].after, end).replace(/\n{3,}/g, '\n\n').trim();
  A[marks[i].num] = {title: (body.split('\n')[0] || '').trim(), text: body};
}
const last = A['113']; const cut = last.text.search(/^[ \t]*ANNEX\s+I[ \t]*$/mi);
if (cut > 0) last.text = last.text.slice(0, cut).trim();
const axRe = /^[ \t]*ANNEX\s+([IVX]+)[ \t]*$/gmi; const ax = []; let a;
while ((a = axRe.exec(txt)) !== null) ax.push({n: a[1], start: a.index, after: a.index + a[0].length});
const AX = {};
for (let i = 0; i < ax.length; i++) {
  const end = (i + 1 < ax.length) ? ax[i+1].start : txt.length;
  AX[ax[i].n] = txt.slice(ax[i].after, end).replace(/\n{3,}/g, '\n\n').trim();
}
window.__A = A; window.__AX = AX;
window.__titles = () => Object.fromEntries(Object.entries(A).map(([k,v]) => [k, v.title]));
window.__art = (k, from, len) => A[k] ? A[k].text.slice(from||0, (from||0)+(len||5000)) : ('NO SUCH ARTICLE ' + k);
window.__annex = (k, from, len) => AX[k] ? AX[k].slice(from||0, (from||0)+(len||5000)) : ('NO SUCH ANNEX ' + k);
window.__find = (q, ctx) => { const out = []; for (const [k,v] of Object.entries(A)) { let i = v.text.indexOf(q); while (i >= 0) { out.push({art:k, at:i, s: v.text.slice(Math.max(0,i-(ctx||120)), i+(ctx||120))}); i = v.text.indexOf(q, i+1); if (out.length > 20) return out; } } return out; };
({articles: Object.keys(A).length, annexes: Object.keys(AX).length});
```

It must answer `{articles: 119, annexes: 14}`. If it does not, stop and say so.

Then read with `window.__titles()` for the whole map of article numbers to headings (start
here, it is small and answers most questions at once), `window.__art('53')` for an article's
text, `window.__annex('III')` for an annex, and `window.__find('serious incident')` to locate
a phrase. Page through a long article with the `from` argument. Ask for what you need; do not
dump whole articles you will not read.

## Input

A packet JSON file (path in your task). Each entry has

- `idx`, `id` : echo `id` back unchanged
- `title`, `issuer`, `type`, `status`, `date`, `url` : what the entry is
- `chips` : the article references printed on the entry as chips. **These are the main
  thing you are checking.**
- `takeaway` : the entry's text
- `in_takeaway` : the article and annex references found in the takeaway text, for
  convenience. Check the takeaway itself as well, in case the extraction missed one.

## What makes a reference right or wrong

A reference is **right** when the article or annex exists and its subject matter is what the
entry treats it as. Judge it against the entry as a whole: a chip is a pointer saying "this
document is about that provision", so it is right if a reader following it lands somewhere
that bears on the entry.

A reference is **wrong** when the provision does not exist, or exists but is about something
else. Examples of what to look for:

- an article number that is not in the Act at all, or an annex that does not exist
- a paragraph or point that does not exist in that article: `Art 53(1)(d)` when article 53(1)
  stops at (c), `Art 74(8)` when article 74 has six paragraphs
- an article about a different subject entirely, usually an off-by-one or a digit swap
- a range that does not hold together: `Art 51-55` is right only if the run really is the
  GPAI chapter; `Art 8-15` only if that run is the high-risk requirements
- a claim in the takeaway that attributes a rule to an article that does not contain it

**Renumbering is its own category, and it matters here.** The Digital Omnibus inserted
articles (4a, 60a, 75a to 75d) and amended others, and several entries describe documents
written before it. If a reference was right against the Act as published in 2024 but points
somewhere else in the consolidated text, record it as `renumbered`, say what it was and what
it is now, and do not call it wrong. Equally, if an entry about a pre-Omnibus document cites
a post-Omnibus article correctly, that is right, not an anachronism.

Do not flag style, spelling, chip ordering, or a chip you merely think could be more
specific. Do not flag a chip for being broad: `Art 5` on a document about prohibited
practices is right even though the document discusses only part of article 5.

## Output

Write ONE JSON list to the results path in your task, one object per entry, same order:

```
{
  "id": "<entry id>",
  "verdict": "clean" | "minor" | "correction",
  "checked": <number of references you actually checked>,
  "issues": [
    {"ref": "<the reference as the entry prints it>",
     "where": "chip" | "takeaway",
     "act_says": "<what that article or annex actually is, with its heading>",
     "severity": "high" | "medium" | "low",
     "kind": "wrong" | "missing_provision" | "renumbered" | "imprecise" | "range",
     "suggest": "<the reference that would be right, or null if none is>"}
  ],
  "proposed_chips": ["<the corrected chip list>"] or null,
  "proposed_takeaway": "<full replacement, only where a takeaway sentence cites the wrong article, else null>",
  "note": "<one short line>"
}
```

`verdict` is `clean` when every reference holds, `minor` for low-severity issues only,
`correction` when at least one reference is wrong or points at a provision that does not
exist.

Rules for `proposed_chips`: keep the original order and the original spelling style
(`Art 5`, `Art 51-55`, `Art 3(1)`, `Annex III`). Change only what is wrong. Do not add chips
just because you think another article is relevant.

Rules for `proposed_takeaway`: keep the original's structure, length, wording and every
other figure and date. Change only the article citation that is wrong. British spelling.
**No em dashes anywhere.** No company or product names beyond those the entry already has.

When done, reply with counts per verdict and a one-line summary of every issue you found,
naming the entry, the reference and what the article actually is.
