# Verify cookie digest takeaways against the live source page

These entries on a public reference site describe a law, a regulator decision, a court
judgment, a guidance document or a standard. None of them has a downloaded PDF copy, so
the only way to check them is to read the source page itself. Your job: reach the page,
find the document the entry names, and check the takeaway against it.

## Input

A packet JSON file (path in your task): a list of entries with

- `idx`, `id` : echo `id` back unchanged
- `title`, `jurisdiction`, `type`, `date`, `status_field`, `source` : what the entry claims
  the document is. `source: primary` means the takeaway is supposed to rest on the document
  itself; `secondary` means it rests on a report about it.
- `url` : the source link printed on the site
- `takeaway` : the text to verify
- `probe` : what an earlier automated probe found at that URL, or null. Use it as a hint,
  not as truth: `form` tells you whether the document is HTML, a PDF behind the page, or a
  JavaScript viewer, and `note` often names what is actually there.

## Reaching the page

**Tier A packets (`a01` to `a10`): use `WebFetch`.** Load it once with `ToolSearch` query
`select:WebFetch`, then call it with the `url` and a precise question. Responses are cached
per URL for 15 minutes, so vary the prompt rather than repeating one.

Good prompts are specific:

- "Quote the article or section that governs consent for storing information on terminal
  equipment. Give its number and its exact words."
- "What penalty does this decision impose, on whom, and for what? Quote the operative part."
- "Does this page state an adoption date, an entry into force date, or a deadline? Quote
  each one."
- "Quote the passage about <the thing the takeaway claims>. If the page does not address
  it, say so plainly."

If `WebFetch` reports a redirect, call it once on the redirect URL. If the page carries a
PDF of the document (`form: html_with_pdf`, or you see a PDF link), fetch the PDF URL
instead: `WebFetch` extracts PDF text.

**Tier B packets (`b01` to `b05`): use the browser on the user's computer.** These URLs
either refuse the fetcher or land on an index. Load the tools in one call:
`ToolSearch` with query
`select:mcp__remote-devices__Claude_Browser__preview_start,mcp__remote-devices__Claude_Browser__navigate,mcp__remote-devices__Claude_Browser__get_page_text,mcp__remote-devices__Claude_Browser__find,mcp__remote-devices__Claude_Browser__tabs_close`

Then `preview_start` ONCE with your first URL to get your own `tabId`, and pass that
`tabId` to every later call so you do not disturb other agents' tabs. `navigate` to each
subsequent URL in the same tab. Read with `get_page_text`, not screenshots.

When the URL is an index, a hub or a table of contents, follow it through to the document
the entry names and record the URL you ended on in `reached_url`. Do not wander: two or
three hops at most, then give up and record it as not reached.

If a browser call says access to a site must be requested first, call
`mcp__remote-devices__Claude_Browser__request_access` with that URL and scope `"once"`,
wait for the answer, then retry once. If it is declined or nothing comes back, record the
entry as not reached with `not_reached_reason: "access declined"`. Do not work around it.

Close your tab with `tabs_close` when you finish.

## Rules for both tiers

- Two or three fetches per entry is normal. Do not exceed six.
- Never fetch a URL through Bash, curl, python or any other route. If the tool cannot get
  it, it is not reached.
- Non-English pages are fine. Read them in the original and quote in the original where a
  precise word matters, with a short English gloss.
- A page that exists but is the wrong document is `wrong_document`, not `not_reached`.

## What to check

Every factual claim in the takeaway, against the page:

1. The rule, finding or holding, and the article, section or paragraph numbers quoted.
2. Who it binds or applies to.
3. Dates: adoption, entry into force, application, deadlines, the date the entry claims.
4. Figures: fines, amounts, percentages, thresholds, counts.
5. Names: companies, authorities, courts, case numbers.
6. Status words: in force, draft, consultation, superseded, repealed, proposed.
7. Anything the takeaway tells the reader to do: is it grounded in the document?

Do NOT flag style, tone, brevity or British spelling, and do not flag a claim about the
wider world that this document does not address: mark that `not_in_document`, low severity.

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
  "better_url": "<a URL that is the document itself, when the entry's own link is an index or the wrong page, else null>",
  "proposed_takeaway": "<full replacement, only for minor or correction, else null>",
  "note": "<one short line>"
}
```

`confirmed` = every checkable claim matches. `minor` = a small imprecision, with a fix.
`correction` = something is wrong in substance. `wrong_document` = the page is live but is
not the document the entry names. `unverifiable` = you reached the document but the claims
cannot be checked from it, say why. `not_reached` = you could not get the page at all.

Rules for `proposed_takeaway`: keep the original's structure and length. Cookie takeaways
keep their article references, fine amounts and dates. Change only what is wrong. British
spelling. **No em dashes anywhere** (use a comma, colon or full stop). No company or
product names beyond those the document itself names.

When done, reply with counts per verdict, how many entries you could not reach, and one
line per entry you could not reach saying why.
