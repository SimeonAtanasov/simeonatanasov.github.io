# What is behind the links the downloader could not take

Date: 20 September 2026. Simeon's `edpb-downloads` folder holds one inventory CSV per
digest, each with a `Downloaded` column. This is the answer to the obvious next question:
of the links marked No, why, and what is actually at the other end.

Method: the 286 rows marked No cover 277 distinct URLs. Every one was fetched and
described. The EDPB findings were then re-checked in a real browser, because a site that
renders through JavaScript can fool a fetcher.

## Coverage per digest

| Digest | Rows | PDF downloaded | Not downloaded |
|---|---|---|---|
| EDPB Digest | 532 | 462 | 70 |
| Cookie Compliance Digest | 259 | 96 | 163 |
| AI Act Digest Part 2 | 57 | 4 | 53 |
| **Total** | **848** | **562** | **286** |

The EDPB digest downloaded well (462 of 532) because the EDPB publishes one PDF per
document from a predictable page. The cookie digest did not (96 of 259) because most of its
sources are not PDFs at all: they are statutes, regulator guidance and court opinions
published as web pages. The AI Act corpus is the same story in the extreme (4 of 57): the
Commission publishes AI Act guidance as HTML on digital-strategy.ec.europa.eu.

## What the 286 failures actually are

| Digest | Link is fine, the PDF can be fetched | Source is a web page, there is no PDF | Link lands on an index or hub | Site blocks automated fetching | Behind a JavaScript viewer | Link is broken |
|---|---|---|---|---|---|---|
| EDPB | 49 | 2 | 1 | 0 | 4 | 13 |
| Cookie | 18 | 94 | 18 | 25 | 6 | 0 |
| AI Act | 12 | 32 | 3 | 1 | 1 | 2 |

Read the columns this way.

- **Link is fine, the PDF can be fetched.** 71 rows. The document page is live and carries a
  direct PDF link. The downloader failed on a transient network error (`IncompleteRead`,
  timeout) or a user-agent block. These are worth a second run; the direct PDF URLs are in
  the CSV beside this report, so they can be fetched without crawling the pages again.
- **Source is a web page.** 122 rows. Nothing was ever going to be downloaded, because the
  source is HTML: EU Commission policy pages, Cornell LII, Justia, noyb articles, ICO and
  CNIL guidance pages, the Korean and Chinese regulators. Not a defect.
- **Link lands on an index or hub.** The link is live but one click short of the document:
  a statute chapter's table of contents (Virginia, Washington, Rhode Island, Utah), a bill
  tracker (LegiScan, LEGISinfo), a regulator's landing hub (ICO storage and access
  technologies, Texas AG, Kenya ODPC), a paginated notice board (Korea's PIPC). The takeaway
  is still right; the link just does not deep-link.
- **Site blocks automated fetching.** 26 rows. Legifrance, Singapore's AGC and PDPC,
  gesetze-im-internet.de, lovdata.no, priv.gc.ca, Thailand's PDPC, Nigeria's CERT, Brazil's
  ANPD, Saudi SDAIA, the Dutch AP, Colombia's Funcion Publica, the EDPS. A person with a
  browser gets the document; a script does not. Not a defect.
- **Behind a JavaScript viewer.** EUR-Lex `/oj` pages, Swiss Fedlex, Denmark's
  Retsinformation, India's MeitY. Same conclusion.
- **Link is broken.** 17 rows, and the only real defect. Detail below.

## The broken links, and their repairs

Thirteen EDPB Article 64 opinion links return HTTP 200 and look healthy to a link checker,
but the page they serve is the EDPB's generic Documents listing, not the opinion. The cause
is the slug: the site's URLs read `opinion-292023-on-the-french_en` where the EDPB's own are
`opinion-292023-on-the-draft-decision-of-the-french_en`. Two more return a hard 404 because
the document sits under a different section of the EDPB site than the link assumes.

Each replacement below was opened in a browser and confirmed to be the named document. All
seventeen are now applied (the last two were found in the browser pass recorded further down) to `digest.json` and `items_corpus.json`, and both pages and their
PDFs have been rebuilt.

| Digest | Document | Was | Now |
|---|---|---|---|
| EDPB | Opinion 13/2026 on the draft decision of the Office of the Data Protection Ombud | `/documents/opinion-of-the-board-art-64/opinion-132026-on-the-office-of-the_en` | `/documents/opinion-of-the-board-art-64/opinion-132026-on-the-draft-decision-of-the-office-of-the_en` |
| EDPB | Opinion 29/2025 on the draft decision of the Dutch Supervisory Authority regardi | `/documents/opinion-of-the-board-art-64/opinion-292025-on-the-dutch-supervisory_en` | `/documents/opinion-of-the-board-art-64/opinion-292025-on-the-draft-decision-of-the-dutch-supervisory_en` |
| EDPB | Opinion 34/2025 on the draft decision of the Greek Supervisory Authority regardi | `/documents/opinion-of-the-board-art-64/opinion-342025-on-the-greek-supervisory_en` | `/documents/opinion-of-the-board-art-64/opinion-342025-on-the-draft-decision-of-the-greek-supervisory_en` |
| EDPB | Opinion 26/2023 on the draft decision of the Romanian Supervisory Authority rega | `/documents/opinion-of-the-board-art-64/opinion-262023-on-the-romanian_en` | `/documents/opinion-of-the-board-art-64/opinion-262023-on-the-draft-decision-of-the-romanian_en` |
| EDPB | Opinion 30/2023 on the draft decision of the French Supervisory Authority regard | `/documents/opinion-of-the-board-art-64/opinion-302023-on-the-french_en` | `/documents/opinion-of-the-board-art-64/opinion-302023-on-the-draft-decision-of-the-french_en` |
| EDPB | Opinion 29/2023 on the draft decision of the French Supervisory Authority regard | `/documents/opinion-of-the-board-art-64/opinion-292023-on-the-french_en` | `/documents/opinion-of-the-board-art-64/opinion-292023-on-the-draft-decision-of-the-french_en` |
| EDPB | Opinion 28/2023 on the draft decision of the French Supervisory Authority regard | `/documents/opinion-of-the-board-art-64/opinion-282023-on-the-french_en` | `/documents/opinion-of-the-board-art-64/opinion-282023-on-the-draft-decision-of-the-french_en` |
| EDPB | Opinion 24/2023 on the draft decision of the French Supervisory Authority regard | `/documents/opinion-of-the-board-art-64/opinion-242023-on-the-french_en` | `/documents/opinion-of-the-board-art-64/opinion-242023-on-the-draft-decision-of-the-french_en` |
| EDPB | Opinion 21/2022 on the draft decision of the Irish Supervisory Authority regardi | `/documents/opinion-of-the-board-art-64/opinion-212022-on-the-irish-supervisory_en` | `/documents/opinion-of-the-board-art-64/opinion-212022-on-the-draft-decision-of-the-irish-supervisory_en` |
| EDPB | Opinion 12/2026 on the draft decision of the Spanish Supervisory Authority regar | `/documents/opinion-of-the-board-art-64/opinion-122026-on-the-spanish_en` | `/documents/opinion-of-the-board-art-64/opinion-122026-on-the-draft-decision-of-the-spanish_en` |
| EDPB | Opinion 11/2026 on the draft decision of the Belgian Supervisory Authority regar | `/documents/opinion-of-the-board-art-64/opinion-112026-on-the-belgian_en` | `/documents/opinion-of-the-board-art-64/opinion-112026-on-the-draft-decision-of-the-belgian_en` |
| EDPB | Opinion 08/2021 on the draft decision of the Baden-Wurttemberg Supervisory Autho | `/documents/opinion-of-the-board-art-64/opinion-082021-on-the-baden-wurttemberg_en` | `/documents/opinion-of-the-board-art-64/opinion-082021-on-the-draft-decision-of-the-baden-wurttemberg_en` |
| EDPB | Opinion 09/2021 on the draft decision of the Baden-Wurttemberg Supervisory Autho | `/documents/opinion-of-the-board-art-64/opinion-092021-on-the-baden-wurttemberg_en` | `/documents/opinion-of-the-board-art-64/opinion-092021-on-the-draft-decision-of-the-baden-wurttemberg_en` |
| AI Act | EDPB Statement 3/2024 on data protection authorities' role in the Artificial Int | `/our-work-tools/our-documents/statements/statement-32024-data-protection-authorities-role-artificial-intelligence-act-framework_en` | `/documents/reports-statements-and-letters/statement-32024-on-data-protection-authorities-role-in-the_en` |
| AI Act | EDPB-EDPS Joint Opinion 1/2026 on the proposal for a Digital Omnibus on AI | `/our-work-tools/our-documents/edpbedps-joint-opinion/edpb-edps-joint-opinion-12026-proposal-regulation-regards_en` | `/documents/legislative-opinion/edpb-edps-joint-opinion-12026-on-the-proposal-for-a-regulation-as_en` |
| AI Act | EDPS orientations on generative AI for EU institutions | `edps.europa.eu/.../2024-06-03-first-edps-orientations-eu-institutions-using-generative-ai_en` | `edps.europa.eu/.../2024-06-03-first-edps-orientations-euis-using-generative-ai_en` |
| Cookie | Saudi Arabia Personal Data Protection Law and Implementing Regulations | `sdaia.gov.sa/en/SDAIA/about/Pages/PDPL.aspx` | `sdaia.gov.sa/en/SDAIA/about/Pages/RegulationsAndPolicies.aspx` |

A soft 404 like this is invisible to an ordinary link check, which is why the September
audit did not catch it: the server answers 200 and the page renders. It only shows up when
something reads the page and asks whether it is the document it was meant to be.

## Re-checked in a real browser after access was granted (20 September 2026, evening)

Simeon allowed the browser pane to reach the 36 hosts behind the failing links, so the ones
a script could not open were opened properly. Result:

- **Live and correct, only refusing scripts:** the German TDDDG section 25 and the EinwV,
  Singapore's PDPA 2012 and the PDPC advisory guidelines, Norway's ekomloven, the Swiss FADP
  on Fedlex, the Belgian APD press release on the IAB Europe case, the Dutch AP cookie banner
  press release, the Bavarian judgment portal. Nothing to fix; these simply need a person or
  a browser rather than a downloader.
- **Two more broken links, now fixed.** The EDPS orientations on generative AI 404 because
  the slug is `euis-using-generative-ai`, not
  `eu-institutions-using-generative-artificial-intelligence`. Saudi Arabia's PDPL page has
  moved: `Pages/PDPL.aspx` 404s and the law now sits under `Pages/RegulationsAndPolicies.aspx`.
  That brings the total repaired to **17**.
- **Two hosts still cannot be opened by any automated browser:** Legifrance and Nigeria's
  CERT sit behind a Cloudflare bot challenge. The links are almost certainly fine for a
  person; they were not verified and no attempt was made to defeat the challenge.

### The seven CJEU judgments, finally verified

The source verification earlier the same day could not check seven cookie entries because the
downloader had taken the wrong judgments from the curia pages. With EUR-Lex reachable, the
full text of each was fetched by CELEX number and the operative part read:

| Entry | Judgment | Verdict |
|---|---|---|
| Planet49 | C-673/17 | confirmed, all three operative points |
| Orange Romania | C-61/19 | confirmed, including the three limbs on pre-ticking, misleading terms and the extra form |
| Fashion ID | C-40/17 | confirmed, joint controllership limited to collection and disclosure by transmission |
| Meta v Bundeskartellamt | C-252/21 | corrected, see below |
| IAB Europe | C-604/22 | confirmed, TC String is personal data, joint controllership does not extend automatically to later processing |
| Inteligo Media | C-654/23 | confirmed, including the RON 42,714 fine of about EUR 9,000 |
| Breyer | C-582/14 | confirmed |

The Meta takeaway said personalised advertising "is not necessary for the contract under
Article 6(1)(b) and cannot be justified as a legitimate interest under Article 6(1)(f)".
Operative points 4 and 5 do not say that: they set conditions. Article 6(1)(b) applies where
the processing is objectively indispensable to a purpose integral to the contract, and
Article 6(1)(f) where users were informed of the interest, the processing is strictly
necessary, and the balancing does not favour the users. The takeaway now states the
conditions and the practical conclusion separately.

## What to do next

1. **Nothing is required.** The 17 broken links are already fixed on the pages and in the
   PDFs. Everything else in the No column is either an HTML source or a site that refuses
   scripts, neither of which is a fault in the site.
2. **A second download run** would pick up roughly 71 more PDFs using the direct URLs in
   `digest-source-coverage-2026-09-20.csv`, which would extend the source verification to
   more entries. That is the only reason to bother.
3. **The deep-link cases** (a statute's table of contents rather than the section) could be
   tightened if you ever want the links to land exactly on the text, but they are not wrong.
4. The full per-row picture, including the fetch note for each URL, is in
   `Claude outputs/digest-source-coverage-2026-09-20.csv`.

