# Verify the last sixteen cookie digest entries

These are the only entries in a 259-document cookie compliance digest whose takeaway has
never been checked against its source. Every other entry has been. Your job is to close
them, or to establish precisely why one cannot be closed.

They are hard for a specific reason worth understanding before you start. A bulk
downloader fetched a PDF from each entry's source page, and for these it took **the wrong
file**: a page that links several documents, an annex, a press release rather than the
decision, a committee roster rather than the statute. So the earlier pass read a real
document that simply was not the one the entry describes. **The entry's own link is
usually fine. The document is usually there. It was the download that failed, not the
source.** Three others were reached but their text could not be extracted.

## Input

A packet JSON file (path in your task). Each entry has

- `idx`, `id` : echo `id` back unchanged
- `title`, `jurisdiction`, `type`, `date`, `status_field`, `source` : what the entry claims
- `url` : the source link printed on the site
- `takeaway` : the text to verify
- `prior_attempts` : what each earlier pass tried and what went wrong, including which file
  it wrongly read and, sometimes, a better URL it found. **Read this first for each entry.
  It tells you what not to repeat.**

## Tools: use both from the start

Load them in one call:

`ToolSearch` with query
`select:WebFetch,mcp__remote-devices__Claude_Browser__preview_start,mcp__remote-devices__Claude_Browser__navigate,mcp__remote-devices__Claude_Browser__get_page_text,mcp__remote-devices__Claude_Browser__find,mcp__remote-devices__Claude_Browser__javascript_tool,mcp__remote-devices__Claude_Browser__request_access,mcp__remote-devices__Claude_Browser__tabs_close`

**They fail in opposite directions and that is the whole technique here.**

- The **browser** runs on the user's computer. It clears robots.txt refusals, bot checks
  and JavaScript viewers that the fetch tool cannot pass. Open your own tab with
  `preview_start`, pass that `tabId` to every later call, close it when you finish.
- **WebFetch** extracts text from PDFs that Chrome renders as images with nothing
  selectable, and reaches hosts the browser refuses. It enforces provenance: it will not
  fetch a URL that has not appeared in your conversation or in an earlier fetch result, so
  a variant of a packet URL is fine but a new host must come from a link you already have.

Two techniques that worked elsewhere on this site and will likely be needed here:

- A page that serves a file with `Content-Disposition: attachment` will not render in a
  browser tab. Park the tab on that host and pull the file with a same-origin `fetch()` in
  `javascript_tool`, then extract the text in the page.
- If the browser opens a PDF you cannot read, hand its URL to WebFetch instead.

Do not attempt to defeat a bot check, a CAPTCHA or a verification code. Do not fetch
through Bash, curl or python.

## Method per entry

1. Read `prior_attempts`.
2. Go to the entry's `url` and find the document the `title` names. Most of these pages
   link several documents, so read the page and pick the right link rather than the first.
3. If the entry's own link does not lead to it, go to the issuing body's site: the
   regulator, the court, the legislature, the standards body. Record where you ended in
   `reached_url`, and put it in `better_url` if it is a better link than the entry's.
4. Read the document and check the takeaway against it.

Three or four fetches per entry is normal; ten is too many. If an entry defeats you, say
exactly what stopped you, in words specific enough that someone could judge whether a
different route exists.

## What to check

Every factual claim: the rule, finding or holding and the article, section or paragraph
numbers quoted; who it binds; dates, including adoption, entry into force and the date the
entry itself claims; figures, fines, thresholds and counts; names of bodies, companies and
cases; status words such as in force, draft, superseded, withdrawn; and anything the
takeaway tells the reader to do.

Do not flag style, brevity or British spelling. A claim about the wider world that the
document does not address is `not_in_document` at low severity, not an error.

## Output

Write ONE JSON list to the results path in your task, one object per entry, same order:

```
{
  "id": "<entry id>",
  "reached": true | false,
  "reached_url": "<the URL you actually read, else null>",
  "how": "webfetch" | "browser" | "both" | null,
  "not_reached_reason": "<short and specific, or null>",
  "verdict": "confirmed" | "minor" | "correction" | "wrong_document" | "unverifiable" | "not_reached",
  "issues": [
    {"claim": "<the words in the takeaway>",
     "source_says": "<what the document says, with the article, section or paragraph>",
     "severity": "high" | "medium" | "low",
     "kind": "wrong" | "imprecise" | "outdated" | "not_in_document"}
  ],
  "better_url": "<a URL that is the document itself, else null>",
  "proposed_takeaway": "<full replacement, only for minor or correction, else null>",
  "note": "<one short line>"
}
```

Rules for `proposed_takeaway`: keep the original's structure and length, and its article
references, fine amounts and dates. Change only what is wrong. British spelling. **No em
dashes anywhere.** No company or product names beyond those the document itself names.

When done, reply with counts per verdict, and for every entry you could not close, one
line naming the exact obstacle.
