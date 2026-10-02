# Brief: verify country research before publication

Another agent researched how GDPR enforcement works in each country and wrote one JSON file
per country in /tmp/claude-0/-home-claude/d71ff206-7de3-5035-9bcd-caf06b7987d1/scratchpad/build/research/graw/.
It will be published on a public reference site for privacy practitioners. Your job is an
independent check. You have not seen how the file was produced; treat every claim as unproven.

Today is 2 October 2026. Budget: at most 3 WebSearch calls in total. Use WebFetch on the URLs
already in the file (its `sources`, `cases[].url`, `law.url`, `dpa.url`) and on links you find
inside those pages. Do not use curl; the shell has no internet. If a host refuses WebFetch, say
so and move on; do not count a refusal as the claim being false.

For each country file you are given, check, in this order of priority:

1. Every `cases[]` entry: the amount, the year, the court outcome and its date. These are the
   claims most likely to be wrong and the most embarrassing if wrong.
2. `fines.imposed_by`, `fines.public_bodies`, `appeal.court`, `appeal.deadline`,
   `appeal.suspensive`: the structural claims a reader will act on.
3. `complaint.deadlines` and `procedure.limitation` where a number is given.
4. Anything in `quirks` that states a number, a date or a court.

Also check plausibility against what you know of the law. Flag anything that contradicts the
GDPR (e.g. claims a complainant gets the fine money) or is internally inconsistent.

Output: write `<code>.verify.json` beside each country file, shape:

```json
{"code": "xx",
 "checked": [{"field": "cases[0].summary", "claim": "...", "verdict": "confirmed | corrected | unverifiable | wrong",
              "evidence": "what the source says, short quote or paraphrase", "url": "...",
              "replacement": "the corrected text for that field, only if corrected or wrong"}],
 "notes": "anything else"}
```

`field` must be a path into the JSON that a script can apply (e.g. `appeal.deadline`,
`cases[1].summary`, `quirks[2]`). `replacement` must be the full new value of that field, in the
same style: no em dashes, British spelling, tight. If a claim cannot be supported and you think
it should be softened rather than removed, write the softened text as the replacement with
verdict `corrected`.

Do not edit the country files yourself. Return a short message: counts of confirmed, corrected,
wrong, unverifiable per country, and the most serious problem you found.

## Additions for the worldwide files

- These jurisdictions are outside the GDPR; check them against their own law.
- Also check the `map` object: are `who_penalises`, `cap` and `private_action` right under the
  definitions in GBRIEF.md (same folder as this brief)? A wrong map value goes in `checked` with
  field `map.who_penalises` (etc.) and the replacement value.
- Budget: at most 4 WebSearch calls. WebFetch may refuse a URL that has not appeared in a search
  result or earlier fetch. If a regulator or statute site refuses WebFetch, you may use the
  built-in browser tools (load them with ToolSearch, query "mcp__remote-devices__Claude_Browser__",
  max_results 20): call `preview_start` with the URL yourself, keep the `tabId` it returns and pass
  it to every later call, and read with `get_page_text` or `javascript_tool`. Never use a tab you
  did not open: other agents share the browser. Close your tab with `tabs_close` when done.
- Do not try to defeat a CAPTCHA or bot check.
