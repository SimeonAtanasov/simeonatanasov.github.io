# Verify EDPB and AI Act digest takeaways against the live source page

These entries on a public reference site describe an EDPB document, a Commission
guideline, a code of practice, a standard or a national implementation measure. None of
them has a downloaded PDF copy, so the only way to check them is to read the source page
itself. Your job: reach the page, find the document the entry names, and check the
takeaway against it.

## Input

A packet JSON file (path in your task): a list of entries with

- `digest` : `edpb` or `aia`. Echo `id` back unchanged.
- `title`, `type`, `date`, `status_field` : what the entry claims the document is.
- `tier` (EDPB only) : `written` means a 2 to 4 sentence takeaway, `oneliner` a single
  sentence. Judge the entry by the depth it is meant to have.
- `issuer`, `articles` (AI Act only) : who issued it and which AI Act articles it
  interprets. Check the article numbers too.
- `source_field` : `title` means the one-liner was written from the listing title alone,
  `page` from the document's own page, `knowledge` from prior knowledge with no fetch, and
  `edpb-pdf` / `document` from the document itself. An entry marked `knowledge` has never
  been checked against anything, so treat it with extra care.
- `url` : the source link printed on the site
- `takeaway` : the text to verify
- `probe` : what an earlier automated probe found at that URL, or null. A hint, not truth.

## Reaching the page

**Tier A packets (`a01` onwards): use `WebFetch`.** Load it once with `ToolSearch` query
`select:WebFetch`, then call it with the `url` and a precise question. Responses are cached
per URL for 15 minutes, so vary the prompt rather than repeating one.

Good prompts are specific:

- "Quote the passage that states <the thing the takeaway claims>. If the page does not
  address it, say so plainly."
- "What legal status does this document claim for itself: binding, guidance, voluntary, a
  draft for consultation? Quote the words."
- "Which articles of the Regulation does it interpret, and what date does it carry?"
- "List the obligations it places on providers, and on deployers, in its own words."

If `WebFetch` reports a redirect, call it once on the redirect URL. If the page carries a
PDF of the document, fetch the PDF URL instead: `WebFetch` extracts PDF text. Note that
`WebFetch` refuses URLs that have not appeared in your conversation, so a variant of the
packet URL is fine but an unrelated host has to come from a link you already fetched.

**Tier B packets (`b01`, `b02`): use the browser on the user's computer.** Load the tools
in one call: `ToolSearch` with query
`select:mcp__remote-devices__Claude_Browser__preview_start,mcp__remote-devices__Claude_Browser__navigate,mcp__remote-devices__Claude_Browser__get_page_text,mcp__remote-devices__Claude_Browser__find,mcp__remote-devices__Claude_Browser__request_access,mcp__remote-devices__Claude_Browser__tabs_close`

`preview_start` ONCE to get your own `tabId`, then pass it to every later call. Read with
`get_page_text`, not screenshots. Close your tab when you finish.

If a browser call says access to a site must be requested first, call `request_access` with
that URL and scope `"once"`, wait, then retry once. If declined, record the entry as not
reached with `not_reached_reason: "access declined"`.

## Rules

- Two or three fetches per entry is normal, six at most.
- Never fetch a URL through Bash, curl or python. If the tool cannot get it, it is not
  reached.
- When the URL is an index, a hub or a news archive, follow it through to the document the
  entry names and record where you ended in `reached_url`. Two or three hops, then stop.
- A page that exists but is the wrong document is `wrong_document`, not `not_reached`.
- The two tools fail in opposite directions. A real browser gets past robots.txt and bot
  checks; `WebFetch` extracts text from PDFs the browser renders with nothing selectable.
  If your tier's tool fails on a PDF or a bot wall, say so precisely in the note so the
  entry can be retried with the other one.

## What to check

Every factual claim in the takeaway, against the page:

1. What the document establishes, and the article or paragraph numbers it quotes.
2. Who it binds or applies to, and whether it binds at all: a great many of these are
   guidance, codes of practice or voluntary tools, and a takeaway that says "requires"
   where the document says "recommends" is an error worth fixing.
3. Dates: adoption, publication, application, deadlines, version numbers, and the date the
   entry claims.
4. Figures: amounts, percentages, thresholds, counts.
5. Names: bodies, companies, authorities, case and opinion numbers.
6. Status words: final, draft, consultation, superseded, withdrawn, adopted, living.
7. For AI Act entries, the `articles` list: are those the articles the document actually
   interprets?

Do NOT flag style, tone, brevity or British spelling, and do not flag a claim about the
wider world that this document does not address: mark that `not_in_document`, low
severity.

## Output

Write ONE JSON list to the results path in your task, one object per entry, same order:

```
{
  "id": "<entry id>",
  "reached": true | false,
  "reached_url": "<the URL you actually read, if different from url, else null>",
  "how": "webfetch" | "browser" | null,
  "not_reached_reason": "<short: 403, robots, consent wall, javascript viewer, dead link, access declined, timeout>",
  "verdict": "confirmed" | "minor" | "correction" | "wrong_document" | "unverifiable" | "not_reached",
  "issues": [
    {"claim": "<the words in the takeaway>",
     "source_says": "<what the page says, with the article, section or paragraph>",
     "severity": "high" | "medium" | "low",
     "kind": "wrong" | "imprecise" | "outdated" | "not_in_document"}
  ],
  "better_url": "<a URL that is the document itself, when the entry's link is an index or the wrong page, else null>",
  "proposed_takeaway": "<full replacement, only for minor or correction, else null>",
  "proposed_articles": [<corrected AI Act article numbers, only when the articles list is wrong, else null>],
  "note": "<one short line>"
}
```

`confirmed` = every checkable claim matches. `minor` = a small imprecision, with a fix.
`correction` = something is wrong in substance. `wrong_document` = the page is live but is
not the document the entry names. `unverifiable` = you reached the document but the claims
cannot be checked from it, say why. `not_reached` = you could not get the page at all.

Rules for `proposed_takeaway`: keep the original's structure and length. EDPB written
takeaways are 2 to 4 sentences (what it establishes, who it binds, what to do); one-liners
stay one sentence; AI Act corpus takeaways keep their legal status, their article
references and their "what to do with it" closing. Change only what is wrong. British
spelling. **No em dashes anywhere** (use a comma, colon or full stop). No company or
product names beyond those the document itself names.

When done, reply with counts per verdict, how many entries you could not reach, and one
line per entry you could not reach saying why.
