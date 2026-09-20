# EDPB and AI Act digests: rechecking the entries with no archived source

Date: 20 September 2026. Companion to `cookie-live-recheck-2026-09-20.md`, which did the
same for the cookie digest.

Two gaps were left after the source verification and the primary law check: 31 EDPB
entries and 44 AI Act Part 2 corpus entries had never been checked against anything,
because no PDF of their source had been downloaded. Most of the AI Act corpus is
Commission guidance published only as a web page, so a PDF downloader was never going to
reach it.

**Result: all 75 were reached. None was left unverified for want of access.**

| Digest | Entries | Confirmed | Minor | Correction |
| --- | --- | --- | --- | --- |
| EDPB | 31 | 24 | 6 | 1 |
| AI Act Part 2 | 44 | 26 | 14 | 4 |
| **Total** | **75** | **50** | **20** | **5** |

65 read with the fetch tool, 10 in a browser on the linked computer.

The AI Act corpus carried a noticeably higher error rate than the EDPB set, which is what
you would expect: those entries describe living web pages that have moved on since they
were written, while the EDPB documents are fixed PDFs.

## The five substantive corrections

- **aia-doc-40, EDPB-EDPS Joint Opinion 1/2026 on the Digital Omnibus.** The entry had the
  recommendation **backwards**. It said the authorities asked that the bias-detection
  exception "not extend beyond high-risk systems without justification". Paragraph 11 in
  fact supports extending it to non-high-risk systems, asking only that those cases be
  "clearly circumscribed and limited to cases where the risk of adverse effects caused by
  such bias is sufficiently serious". The entry also listed pseudonymisation, access
  controls and deletion as the safeguards asked for; the opinion refers generically to
  appropriate safeguards complementing the GDPR, the EUDPR and the Law Enforcement
  Directive.
- **aia-doc-32, Commission Implementing Regulation (EU) 2025/454.** Dated **7 March 2025**,
  not 5 March, in force 30 March 2025. A qualified alert routes to measures under Articles
  91 to 93, not to a classification decision, and the chair and vice-chair are nominated by
  the members and selected by the Commission.
- **aia-doc-41, the EDPB expert report on LLMs.** 102 pages, not 99, and there is no single
  six-stage data flow: the report gives a different flow per service model, four phases for
  LLM as a service and eight for a self-developed model.
- **aia-doc-21, the AI Act Service Desk.** The platform is in six languages (English,
  French, German, Spanish, Italian, Polish). The entry promised all 24 by early 2026, which
  has passed.
- **edpb-486, the draft administrative arrangement after Opinion 4/2019.** The link serves
  the arrangement itself, not an opinion on it, the parties are securities and derivatives
  market regulators rather than public bodies generally, and the arrangement expressly
  creates no legally binding obligations.

## The twenty smaller fixes

Three patterns account for most of them.

**Living pages drift.** The AI Act Explorer now counts 119 articles, not 113, because the
Omnibus inserted lettered articles. The AI Pact page no longer gives a total, so "more than
500 pledging organisations" had to go. The training-content template has been re-issued as
Commission Communication C(2025) 8311 final of 5 December 2025 while its landing page still
says 24 July 2025. The EDPS generative AI orientations are now version 2 of 28 October
2025, which says in terms that the EDPS issues them as a data protection supervisory
authority **and not** in his new role as market surveillance authority, the opposite of
what the entry said.

**Adoption dates versus consultation dates.** Three EDPB entries dated a document by the
day its consultation opened. The DPIA template was adopted 10 March 2026 and consulted from
14 April; Guidelines 3/2025 were adopted 11 September 2025 and consulted from 12 September.

**Claims attributed to the wrong document.** Three national implementation entries said the
Commission's consolidated list "marks X as pending final adoption". The tracker never uses
that phrase; it labels France and the Netherlands "partial clarity". The AI Act
standardisation overview was credited with naming ISO/IEC 42001 and 23894; it names
neither.

One logical inversion is worth singling out: `edpb-532` on anonymisation said the three
criteria were ones "none of which may be met", where the guidelines require **all three** to
hold for anonymity. The sense was exactly reversed.

## What refused what

Eight entries failed a first attempt. All eight were recovered.

| Entries | Obstacle | What worked |
| --- | --- | --- |
| edpb-518, 519, 521, 526, 527, 530 | the six 2018 WP29 guidelines sit in the legacy EC newsroom archive, which serves `Content-Disposition: attachment`; the fetch tool gets robots refusals, HTTP 500 or raw binary | browser, fetching each PDF same-origin from an `ec.europa.eu` page and extracting the text in the page |
| edpb-524 | same, and the item page exposes no download link | browser, reading the document ids out of the item page markup, then the same same-origin route |
| aia-doc-11, 15, 16, 18, 19 | the same newsroom attachment behaviour | browser, same route |
| aia-doc-41 | the EDPB server returns 200 headers then kills the body mid-stream on a whole-file request | browser, range requests in 64 KB chunks |
| aia-doc-32 | EUR-Lex serves only metadata to the fetch tool | browser, on the CELEX HTML rendition |

The lesson from the cookie pass held again: the two tools fail in opposite directions, and
almost everything that resists one yields to the other.

## Source links

Only three were changed, all where the link was an index or a superseded version:

| Entry | From | To |
| --- | --- | --- |
| aia-doc-28 | the JTC 21 news archive | the 9 July 2026 item itself |
| aia-doc-32 | a Commission policy page that names the regulation | the EUR-Lex ELI for the regulation |
| aia-doc-45 | the June 2024 first orientations | the October 2025 version 2 |

**Seven EDPB links were repointed to the documents themselves.** The EDPB pages for the
2018 WP29 guidelines are metadata stubs: they name the document and link out to the legacy
EC newsroom archive, which is where the text actually lives. They were held back at first
because one item URL had been seen serving a different document on reload, so before
changing them each URL was fetched twice, the two attempts separated by six other requests,
and identified from three independent signals: the WP number in the PDF's own first-page
header, the `Content-Disposition` filename, and the XMP title. All seven were stable and
correct, byte for byte identical across attempts, and the reload swap could not be
reproduced.

| Entry | Document | Link now |
| --- | --- | --- |
| edpb-518 | breach notification, wp250rev.01 | `ec.europa.eu/newsroom/article29/redirection/document/49827` |
| edpb-519 | data portability, wp242rev.01 | `ec.europa.eu/newsroom/just/redirection/document/44099` |
| edpb-521 | data protection officers, wp243rev.01 | `ec.europa.eu/newsroom/just/redirection/document/44100` |
| edpb-524 | DPIA, wp248rev.01 | `ec.europa.eu/newsroom/just/redirection/document/47711` |
| edpb-526 | automated decisions, wp251rev.01 | `ec.europa.eu/newsroom/article29/redirection/document/49826` |
| edpb-527 | lead authority, wp244rev.01 | `ec.europa.eu/newsroom/just/redirection/document/44102` |
| edpb-530 | Article 30(5) position paper | `ec.europa.eu/newsroom/article29/redirection/document/51422` |

Four of these were originally found under the older `document.cfm?doc_id=` spelling or the
`/dae/` path, both of which 302 to `/just/redirection/document/<id>`. The post-redirect form
was fetched directly and confirmed to serve the same file, so the shorter one-hop URL is
what is stored.

Two things to know about these links. They carry `Content-Disposition: attachment`, so a
click downloads the PDF rather than opening a page. And the server returns a malformed
`Content-Type` of `application/` with no subtype on all seven, even though the bodies are
genuine PDFs, so a link checker that validates content type will flag them. Neither is a
reason to distrust the link, but both will look odd if they are not expected.

## The cookie-11 link, now fixed

The dead EDPB link on the CNIL Criteo entry is replaced by the Conseil d'Etat decision:

`https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-03-04/482872`

Both CNIL pages on that sanction are gone too, and not by accident: the deliberation
ordered publication identifying Criteo for only two years, after which it is anonymised.
So there is no surviving cnil.fr source, and this is structural rather than a broken link.
The Conseil d'Etat decision is a complete substitute, reciting the 15 June 2023
deliberation, the 40 million euro fine and each of articles 7, 12, 13, 15, 17 and 26 before
rejecting the appeal on 4 March 2026.

Two things in the takeaway had to change with it. The reduction from a proposed 60 million
has no reachable primary source any more, so it is gone. And the article 15 finding is
upheld on the undisclosed second purpose, the reuse of the data to train targeting
algorithms, not on "deficient access responses" as the entry said.

## What changed on disk

| File | Change |
| --- | --- |
| `Claude outputs/edpb-digest-build/digest.json` | 7 takeaways and 7 source links |
| `Claude outputs/ai-act-digest-build/items_corpus.json` | 20 field changes across 17 entries: 17 takeaways, 3 source links |
| `Claude outputs/cookie-digest-build/all_merged.json` | cookie-11 takeaway and link |
| `edpb-digest.html`, `ai-act-digest.html`, `cookie-digest.html` | rebuilt |
| `Claude outputs/edpb-digest-2026-09-19.pdf` | rebuilt, 111 pages |
| `Claude outputs/ai-act-digest-2026-09-19-v2.pdf` | rebuilt, 80 pages |
| `Claude outputs/cookie-compliance-digest-2026-09-19.pdf` | rebuilt, 75 pages |

`apply_recheck2.py` in this folder replays the EDPB and AI Act changes; `apply_recheck.py`
replays the cookie ones, cookie-11 included. Both assert on the exact text they expect, so
a rerun after another edit fails loudly and a rerun on current data is a no-op.

## Coverage now

| Digest | Entries | Checked against the source |
| --- | --- | --- |
| EDPB | 543 | **541** |
| Cookie | 259 | **259** |
| AI Act Part 1 | 133 | 133, against EUR-Lex |
| AI Act Part 2 | 57 | **57** |

Both parts of the AI Act digest have now been checked in full against their sources. Two
EDPB entries remain outstanding: edpb-520, which has no reachable source, and edpb-528,
whose downloaded file was a Danish supervisory decision rather than WP242 rev.01. The
cookie digest was finished on 20 September 2026 by a third pass on the sixteen entries whose
takeaway had never been read against its own source, reported in
`cookie-final-sixteen-2026-09-20.md`. The table above shows the position after that pass.
