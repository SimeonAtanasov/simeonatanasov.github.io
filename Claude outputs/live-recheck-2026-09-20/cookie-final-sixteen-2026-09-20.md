# The last sixteen cookie digest entries, closed

Date: 20 September 2026. Third and final companion to `cookie-live-recheck-2026-09-20.md`
and `edpb-aia-live-recheck-2026-09-20.md`.

Sixteen of the 259 cookie entries had never had their takeaway checked against their own
source. They were not hard because the documents were missing. They were hard because a
bulk downloader had, for each of them, taken **the wrong file**: a landing page that links
several documents, an annex, a press release rather than the decision, a committee roster
rather than the statute. Every earlier pass had then read a real document that simply was
not the one the entry describes, and recorded it honestly as a miss.

**Result: all sixteen reached. None left unverified.**

| Verdict | Entries |
| --- | --- |
| Confirmed as written | 11 |
| Correction | 3 |
| Minor fix | 2 |
| Not reached | 0 |

Ten were closed in a browser on the linked computer, four with the fetch tool, two needed
both. Seven source links now point at the document itself rather than a landing page, a
press release or a law firm note.

## The three corrections

**cookie-150, IAB Multi-State Privacy Agreement, Fifth Amended and Restated.** The two
signalling modes are gone. The entry said first parties operate in either Opt-Out Option
Mode or Service Provider Mode; the word "Mode" does not occur anywhere in the Fifth Amended
and Restated agreement or its Appendix I. Section 3.1 now requires a first party to process
under the U.S. National Approach wherever it reasonably determines the consumer is a US
resident, and section 3.2 lets only signatories from before 1 January 2026 keep a
state-specific approach, deemed removed on 31 December 2026. The National Approach is
therefore mandatory, not the option the entry described. Appendix I definition 1.80 puts it
as giving notice and opt-out choice "as if the Consumer is a resident of each and every
state with an Applicable State Privacy Law".

**cookie-142, Philippines Data Privacy Act of 2012.** The Act contains no right to object.
The word does not appear in Republic Act 10173, and section 16 lists only the rights to be
informed, to be furnished information, to reasonable access, to dispute inaccuracy, to
suspend or block, and to be indemnified. The right to object, including to direct marketing
and profiling, is in the Implementing Rules and Regulations, Rule VIII section 34(b). The
NPC guidance the entry means is Circular No. 2023-04 of 7 November 2023, whose section 10(A)
says consent can never be assumed and that non-response or implied consent is not valid
consent; neither that circular nor Advisory 2023-01 mentions pre-ticked boxes, so the
takeaway now quotes what the circular actually says.

**cookie-196, KVKK Guideline on Cookie Practices.** Two things were wrong and the link was
dead. The entry's URL, `kvkk.gov.tr/Icerik/7288/...`, now redirects to the KVKK home page;
the guideline is reachable from the Rehberler listing and is a later edition, KVKK Yayinlari
No. 69 of July 2025, not the June 2022 text the date field claimed. Section 5.9 of that
edition places first party analytics cookies under Criterion B, so they do **not** require
explicit consent; only social plugin tracking cookies (6.1) and online behavioural
advertising cookies (6.2) are listed as requiring explicit consent under Article 5(1). The
entry's "non-essential analytics require explicit consent" was the opposite of the rule.
Section 8 now applies the Article 9 transfer regime as amended in 2024, which did not exist
in 2022.

## The two smaller fixes

**cookie-139, Nigeria Data Protection Act 2023.** The Act does not replace the 2019
Regulation and nowhere mentions it. Section 63 gives the Act priority where another law is
inconsistent with it and section 64(2)(f) preserves orders, rules and regulations already in
effect; what section 64(1) does is transfer the Data Protection Bureau's functions to the
new Commission. Two smaller points: the standard penalty maximum in section 48(5) is the
greater of NGN 2,000,000 and 2 per cent of annual gross revenue, mirroring the structure of
the higher maximum rather than being a flat alternative; and section 2(2)(c) reaches
processing of "personal data of a data subject in Nigeria", which turns on presence rather
than nationality.

**cookie-155, California AB 566.** Civil Code section 1798.136(a)(1) requires the browser to
send the signal to "businesses with which the consumer interacts through the browser", not
to every business, and subdivision (a)(2) says the functionality "shall be easy for a
reasonable person to locate and configure", not easy to use.

## What the earlier passes had been reading

Worth recording, because it is the pattern that produced all sixteen.

| Entry | What the downloader took instead |
| --- | --- |
| cookie-35 | the DSK guidance on digital services, not the judgment |
| cookie-54 | unrelated PDFs linked from a page whose guidance is web content only |
| cookie-142 | an advisory on predatory lending apps |
| cookie-150 | the Second and Third Amended and Restated MSPA |
| cookie-152 | the California CCPA regulations |
| cookie-172 | the unamended 2003 PECR text |
| cookie-234 | Minnesota House roster and directory documents |

In every one of those cases the entry's own link was fine and the document was there. That
is the lesson to carry: a wrong-file result says nothing about the link.

## The four that needed a technique

**cookie-123, GB/T 35273-2020.** The Chinese national standards portal shows the text only
as an image mosaic: nine WebP strips in which each page is cut into a ten by ten grid of
tiles, deduplicated and scattered, with a span per tile whose CSS background position says
where it belongs. Reassembling each page into an offscreen canvas and reading the result
confirmed all four substantive claims: separate consent per function at clause 5.3 a), no
refusal of service at 5.3 e), third party and SDK controls at 9.7 a) to g), and a model
privacy policy at Annex D Table D.1. Three low caveats are recorded in the results file:
9.7 h) uses *should* rather than *shall* for SDK-specific measures, Annex D is informative
and holds one template rather than templates, and the claim that regulators treat the
standard as the benchmark is outside the document.

**cookie-205 and cookie-207.** Both are scans with no text layer, which is why earlier
passes reported pages as missing. The Sephora judgment is a seven page scan; the Todd Snyder
order has a machine-readable cover and twelve scanned pages behind it. Rendering them with
pdf.js in the browser and reading the pages visually confirmed the figures: paragraph 17 of
the judgment for the $1.2 million, paragraphs 11, 12 and 14 to 15 for the sale disclosure,
Global Privacy Control and the two year reporting terms; paragraphs 34 to 36, 63, 65 and 68
of the order for the banner findings, the $345,178 fine and the configuration and training
duties.

**cookie-91, OPC guidelines on online behavioural advertising.** `priv.gc.ca` is unreachable
from both routes, the fetch tool timing out on robots.txt and the browser refusing
navigation. The OPC text was read from a Wayback snapshot of January 2025 and every
condition in the takeaway confirmed, including zombie cookies, super cookies and device
fingerprinting under "Inability to Decline". The entry's own official link stays, because it
is the right link and the fault is ours, not theirs.

## Source links changed

| Entry | From | To |
| --- | --- | --- |
| cookie-139 | a CERT.ng copy behind Cloudflare | the NDPC's own Official Gazette text |
| cookie-150 | the iabprivacy.com home page | the Fifth Amended and Restated agreement |
| cookie-155 | a law firm note | the chaptered bill on leginfo.legislature.ca.gov |
| cookie-196 | `Icerik/7288`, now redirecting to the home page | the July 2025 guideline PDF |
| cookie-205 | the Attorney General press release | the filed judgment |
| cookie-207 | the CPPA press release | the Order of Decision |

cookie-155 loses its "secondary source" marker with that change, since the entry now links
the statute.

One better link was offered and declined: cookie-35's LfD background article on the judgment
is no improvement on the LfD press release the entry already links, and both are the same
authority on the same decision.

## Two date fields

cookie-207 moves from 6 May 2025 to **1 May 2025**. The Order of Decision, Case No.
ENF23-M-TO-26, is dated 1 May; 6 May is the CPPA press release announcing it, which is what
the entry used to link.

cookie-196 moves from 20 June 2022 to **July 2025**, the edition now published, whose
imprint gives a month and no day. It is the only entry of the 259 whose date is not a full
day, month and year. The page's year filter and sort both key off the year, so both still
work, and the entry now sits above the Swiss FADP in the Switzerland and other Europe group
rather than below it.

One date was left alone deliberately. cookie-91 is dated 6 December 2011, and the OPC text
as served today closes with "Updated in December 2015". The guidelines are cited by their
2011 date and the entry names them as the 2011 guidelines, so the first publication date
stands. It is a judgement call rather than an oversight, and it is recorded here so that the
next pass does not spend an hour rediscovering it.

## What changed on disk

| File | Change |
| --- | --- |
| `Claude outputs/cookie-digest-build/all_merged.json` | 14 field changes across 7 entries: 5 takeaways, 6 source links, 2 dates, 1 source marker |
| `Claude outputs/cookie-digest-build/cookie_digest.json` | regenerated by the page builder |
| `cookie-digest.html` | rebuilt, 513,832 bytes, 259 entries |
| `Claude outputs/cookie-compliance-digest-2026-09-19.pdf` | rebuilt, 75 pages |

`pages/cookie-digest/cookie-digest.css` is byte for byte unchanged, so it was not
redeployed.

`apply_close16.py` in this folder replays the change set against `all_merged.json`. Like its
predecessors it asserts on the exact text it expects, so a rerun after another edit fails
loudly and a rerun on current data is a no-op. Before the rebuild, the page was regenerated
from the **pre-change** data and came out byte for byte identical to the deployed
`cookie-digest.html`, which proves the build chain in the repo is the one that produced the
live page and that nothing else drifted into this rebuild.

## Coverage now

| Digest | Entries | Checked against the source |
| --- | --- | --- |
| EDPB | 543 | 541 |
| Cookie | 259 | **259** |
| AI Act Part 1 | 133 | 133, against EUR-Lex |
| AI Act Part 2 | 57 | 57 |

Every entry in the cookie digest has now been read against its own source. Two EDPB entries
remain outstanding and are named in the source verification register: edpb-520, which has no
reachable source, and edpb-528, whose downloaded file was a Danish supervisory decision
rather than WP242 rev.01.
