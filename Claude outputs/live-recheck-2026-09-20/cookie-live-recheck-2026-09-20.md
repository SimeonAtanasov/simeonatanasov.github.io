# Cookie digest: rechecking the 149 entries with no downloaded source

Date: 20 September 2026.

The source verification of 20 September could only check the 110 cookie entries whose
source had been downloaded as a PDF. The other 149 have no archived copy, because the
document exists only as a web page, sits behind a bot wall or a JavaScript viewer, or was
read from the live page when the entry was written and never saved. This pass went back to
those 149 source pages and checked every takeaway against what is there now.

**Result: all 149 were reached. None was left unverified for want of access.**

| Verdict | Entries |
| --- | --- |
| Confirmed | 110 |
| Minor, a small imprecision fixed | 28 |
| Correction, wrong in substance | 8 |
| Unverifiable, document reached but its text is not readable | 2 |
| Wrong document, the link no longer serves what the entry names | 1 |
| **Not reached** | **0** |

114 were read with the fetch tool, 35 in a real browser on the linked computer.

## Approach

The earlier coverage work had already probed all 286 non-downloaded source links, so the
tiering came from that rather than from guesswork:

1. **Tier A, 116 entries, fetch tool.** The 102 the probe had reached as the named
   document, plus 7 never probed and 7 that had failed transiently. Ten agents in
   parallel, each reading the page and putting precise questions to it rather than asking
   for a summary.
2. **Tier B, 33 entries, browser on the linked computer.** The 16 hosts that refuse the
   fetcher and the 17 URLs that land on an index, a hub or a table of contents. Each agent
   opened its own tab so they did not fight over one, and followed an index through to the
   document, two or three hops at most.
3. **Tier B second pass, 9 entries.** Everything Tier A could not reach or could not read,
   retried in the browser. The browser cleared every robots.txt refusal.
4. **Last resort, 14 entries, both tools together.** This is where most of the remaining
   ground was made up, because the two tools fail in opposite directions: a real browser
   gets past robots.txt and bot checks, and the fetch tool extracts text from PDFs that
   Chrome renders as images with nothing selectable.

That last point is the reusable lesson. Six entries were recovered purely by handing a PDF
the browser had opened to the fetch tool instead.

## What refused what

Twenty-two entries failed at least one attempt. Every one of them was eventually read
except three, and the record of what blocked what is worth keeping for the next pass.

| Entry | Host on the site's link | Refused by | Finally read |
| --- | --- | --- | --- |
| cookie-4, 7, 8, 9 | legifrance.gouv.fr | bot wall, both tools | browser, via a third-party full text of the same DILA record |
| cookie-27 | gesetze-im-internet.de | robots, fetch | browser |
| cookie-33 | gesetze-bayern.de | robots, fetch | browser |
| cookie-37, 38 | dataprotectionauthority.be | robots, fetch | browser |
| cookie-64 | eur-lex.europa.eu | JavaScript viewer | browser, on the HTML rendition |
| cookie-102 | gov.br | login wall | browser, Ministry of Justice digital library |
| cookie-106 | oaic.gov.au, then austlii | "access denied for AI crawlers" | browser, media release only |
| cookie-116 | pipc.go.kr | document not on that board | browser, the renamed KCC site |
| cookie-123 | openstd.samr.gov.cn | preview viewer serves nothing | **still unread** |
| cookie-129 | pdpc.gov.sg | PDF with no text layer | fetch tool on the PDF |
| cookie-130 | pdpc.or.th | bot wall | fetch tool, official translation elsewhere |
| cookie-132 | sdaia.gov.sa | 403 | browser |
| cookie-138 | odpc.go.ke | homepage only | fetch tool on the Act and the Regulations |
| cookie-139 | cert.gov.ng | Cloudflare | **directive read, Act still unread** |
| cookie-197 | kvkk.gov.tr | robots, fetch | browser |
| cookie-239 | wapp.capitol.tn.gov | 403 | fetch tool on the chaptered PDF |
| cookie-242 | webserver.rilegislature.gov | browser refused | fetch tool, same host |

Note cookie-242: the browser could not open the host at all while the fetch tool read it
normally. The refusals are not a property of the site alone.

### The three that are still short

- **cookie-123, GB/T 35273-2020, the Chinese personal information security standard.** The
  catalogue entry confirms the metadata (published 6 March 2020, in force 1 October 2020,
  current, recommended rather than mandatory). The text sits behind the portal's online
  preview, which answers that the browser does not support the preview service and serves
  nothing. The clause-level claims in the takeaway stay unchecked. There is no free
  official full text.
- **cookie-139, the Nigeria Data Protection Act 2023.** The 2025 General Application and
  Implementation Directive was read in full and that half of the takeaway is confirmed.
  The Act itself is not reachable in text: the site's own link is behind Cloudflare, the
  widely mirrored copy is an image-only scan, and the regulator hosts no PDF of it. The
  penalty and consent claims that rest on the Act are unchecked.
- **cookie-11, the EDPB news item on the CNIL's Criteo fine.** The link is dead. The EDPB
  rebuilt its site in June 2026 and no page for that item survived; site search and web
  search both come back empty. The takeaway itself is sound, checked against CNIL
  deliberation SAN-2023-009: 40 million euros on Criteo SA under Articles 7, 12, 13, 15,
  17 and 26 GDPR. **This entry needs a new source link and there is no obvious
  replacement, so it is left for you to decide.**

## The eight substantive corrections

- **cookie-118, Korea, Meta.** The fine was **KRW 6.6 million**, not KRW 660 million. The
  entry was out by a factor of one hundred. The PIPC press release also gives the legal
  basis as Article 39-3(3) and the decision date as 8 February 2023, published 9 March.
- **cookie-132, Saudi Arabia.** The Implementing Regulations have **no existing-customer
  carve-out** for direct marketing. Article 29 requires consent under Article 11 in every
  case, plus a stop mechanism as easy as consenting. The entry said marketing to existing
  customers with an opt-out was permitted.
- **cookie-9, CNIL, Microsoft.** The injunction was not about the refusal mechanism. Its
  operative words require consent on arrival at bing.com before any write for advertising
  fraud detection.
- **cookie-34, OLG Koeln.** The court found no equivalent reject option on **either**
  layer, not just the first, and decided on section 25 TTDSG alone.
- **cookie-42, Netherlands.** Structural checks began in **April 2025**, not February 2024,
  and the 200 figure counts websites, not organisations.
- **cookie-88, Commission cookie pledge.** The Commission did publish after January 2024:
  it closed the project on 8 November 2024 with a summary and three annexes, including the
  EDPB opinion.
- **cookie-224, Colorado.** The public list of universal opt-out mechanisms sits under
  **Rule 5.07**, not Rule 6.03.
- **cookie-231, New Jersey.** The Division of Consumer Affairs **may** adopt rules for the
  opt-out mechanism, not must, and the 18-month cure window runs from the effective date.

## The 28 smaller fixes

Mostly wrong paragraph or rule numbers, a figure quoted without its floor or its
"whichever is higher", a permissive provision read as mandatory, a date that was the
publication date rather than the adoption date, and several claims that were true but
belonged to a different document than the one linked. Each is recorded per entry with the
source's own wording in `cookie-live-recheck-results.json`.

Three patterns worth noting because they recur:

- **A regulator's press release is not the decision.** Several takeaways carried detail
  that is in the underlying decision but not on the page the site links to. Those were
  marked as claims the document does not address rather than errors, and left alone.
- **Table-of-contents URLs.** Several US state statute links point at a chapter index. Two
  hosts offer a full-chapter view that is far easier to read and to cite:
  `law.lis.virginia.gov/vacodefull/` and `app.leg.wa.gov/RCW/...&full=true`.
- **Bill trackers versus bill text.** Two California entries linked a third-party bill
  tracker behind a bot wall; both now link the legislature's own text.

## Source links changed

27 links were repointed, all to an official host serving the document itself rather than an
index, a dead page or a tracker. Among them: both California bills now go to
leginfo.legislature.ca.gov, Texas to the statute rather than the Attorney General's hub,
Korea's two PIPC notices to the notice itself rather than page 18 or 19 of a list, Saudi
Arabia to the PDPL PDF, Israel to the Authority's Amendment 13 guide, Kenya to the General
Regulations, Thailand to the Ministry of Digital Economy text, and the Commission cookie
pledge to the November 2024 project summary.

Four proposed replacements were declined and the original left in place:

| Entry | Proposed | Why not |
| --- | --- | --- |
| cookie-106 | AustLII determination | AustLII blocks automated access, and the OAIC release is the official page |
| cookie-149 | the GPP GitHub repository | a companion to the official IAB Tech Lab page, not a replacement |
| cookie-240 | law.justia.com | a third-party mirror; the state's own link stays |
| cookie-139 | the NDPC 2025 directive | not the Act that the entry also names |

## What changed on disk

| File | Change |
| --- | --- |
| `Claude outputs/cookie-digest-build/all_merged.json` | 63 field changes across 53 entries: 36 takeaways, 27 source links |
| `Claude outputs/cookie-digest-build/cookie_digest.json` | rebuilt |
| `cookie-digest.html` | rebuilt |
| `Claude outputs/cookie-compliance-digest-2026-09-19.pdf` | rebuilt, 74 pages, was 71 |

`apply_recheck.py` in this folder replays the 63 changes against `all_merged.json`. Each
carries the exact text it expects to find, so a rerun after another edit fails loudly and a
rerun on current data is a no-op. Remember the build trap: `build_cookie_page.py` reads
`all_merged.json` and overwrites `cookie_digest.json`, so edits belong in the former.

## Coverage now

| Digest | Entries | Checked against the source |
| --- | --- | --- |
| Cookie | 259 | **259** |

This pass left sixteen entries whose takeaway had still never been read against its own
source, among them cookie-11 (link dead, takeaway verified from the underlying
deliberation), cookie-123 (text behind a portal viewer) and cookie-139 (the Nigerian Act
itself). All sixteen were closed on 20 September 2026 in a third pass, reported in
`cookie-final-sixteen-2026-09-20.md`, which took the cookie digest to 259 of 259. The table
above shows the position after that pass, not after this one.
