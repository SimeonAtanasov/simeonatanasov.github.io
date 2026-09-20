# Retry of the 70 entries with a direct PDF link

Date: 20 September 2026, late. The coverage check found 70 digest entries whose source page
carries a direct PDF link that the bulk downloader had missed. Neither shell in this session
can reach the internet (the egress proxy refuses CONNECT), so the PDFs were not archived.
They were read instead through the fetch tool, which extracts PDF text, and each entry's
takeaway was checked against what the document says.

## Outcome

| Digest | Entries | Confirmed | Minor | Correction | PDF was the wrong document | Could not fetch |
|---|---|---|---|---|---|---|
| EDPB Digest | 49 | 44 | 2 | 1 | 1 | 1 |
| Cookie Compliance Digest | 13 | 9 | 1 | 0 | 3 | 0 |
| AI Act Digest Part 2 | 8 | 5 | 1 | 0 | 2 | 0 |
| **Total** | **70** | **58** | **4** | **1** | **6** | **1** |

63 of 70 entries were checked against the document itself. Four takeaways were corrected and
one substantive error was fixed. Six entries could not be checked because no PDF of that
document exists or is reachable, and one PDF that the source page itself lists returned 404.

## What was corrected

**Commission Guidelines on the scope of obligations for providers of general-purpose AI models** (aia-8, minor)  
- Said: last updated 28 April 2026  
  Document says: The Commission's guidelines library page states the guidelines were last updated 20 April 2026.  

**FDPIC Guidelines on data processing using cookies and similar technologies, version 1.1** (cookie-192, minor)  
- Said: Penalties reach CHF 250,000 (FADP) and CHF 5,000 (TCA)  
  Document says: The guidelines state only the CHF 5,000 fine under Article 45c TCA (Art. 53 TCA); no CHF 250,000 figure appears anywhere in the document, so attributing it to the FADP as if the guidelines said so overstates the source.  

**Internal EDPB Document 2/2020 on how to deal with complaints relating to data protection infringements st** (edpb-407, minor)  
- Said: Governs how the Board itself works  
  Document says: The document gives supervisory authorities practical guidance on resolving cross-border competence disputes for complaints about infringements that started before 25 May 2018 and continue after, not internal Board governance.  

**Binding Decision 5/2022 on the dispute submitted by the Irish SA regarding WhatsApp Ireland Limited (Art.** (edpb-235, correction)  
- Said: to order the privacy policy into compliance with Articles 12(1) and 13(1)(c)  
  Document says: This order was made in the EDPB's earlier, separate Binding Decision 1/2021 on WhatsApp. In Binding Decision 5/2022 the IE SA only 'reiterates that in a previous inquiry on WhatsApp IE, an infringement of the GDPR was found as to its compliance with Article 12(1) and Article 13(1  
- Said: to increase the administrative fine beyond its draft  
  Document says: The operative part instructs the IE SA to record the Article 5(1)(a)/6(1) infringement and impose a fine calculated under Article 83 GDPR; a fine of EUR 5.5 million was confirmed for this specific infringement, but the retrievable text does not state the LSA's draft figure or fra  

**Data Protection Officer training** (edpb-133, minor)  
- Said: the health module was submitted in May 2024  
  Document says: The linked PDF is the general module itself, which states it was submitted in May 2024; the EDPB source page instead lists the health sector module PDF as completed in December 2023. The May 2024 date is not confirmed for the health module specifically.  
- Said: a public health sector module covering hospitals, clinics, pharmacies and the national health information systems... each with questions from practice  
  Document says: Fetch attempts on the health-sector module PDF failed (server error), and the EDPB source page gives no description of that module's specific coverage or confirms Q&A content for it; the general programme description mentions Q&As only in general terms.  

The one substantive error is Binding Decision 5/2022 on WhatsApp. The takeaway credited it
with ordering WhatsApp's privacy policy into compliance with Articles 12(1) and 13(1)(c).
That order came from the EDPB's earlier 2021 binding decision on WhatsApp; Decision 5/2022
only refers back to it while deciding a different dispute about Article 6(1)(b) and service
improvement. The Article 6(1)(b) substance was right and is kept.

## A caveat about the direct PDF links

The coverage report described these 70 as "the link is fine and the PDF can be fetched".
That was too generous. The probe had taken the first PDF link on each source page, and on a
page that carries annexes, other language versions or unrelated attachments the first link is
often not the document. On the EDPB pages the link was almost always right, because those
pages carry one document. On the cookie and AI Act pages it frequently was not: a Federal
Register notice attached to an IAB Europe entry, a Montana bill attached to a W3C note, a
Danish cookie guide attached to an EDPB binding decision.

The verifying agents caught this each time and went back to the source page, finding the
correct PDF for 13 entries. Those corrected links are recorded in the results file as
`better_pdf_url`. For the remaining six the document simply has no PDF: a W3C note, a French
court decision, a company blog post, a Canadian findings report and two Commission pages that
exist only as HTML.

So the practical figure for a second download run is lower than 70. Use the `better_pdf_url`
values plus the EDPB links, not the original probe column.

## What is still unverified

Across both passes, 367 of the 848 digest entries have now been checked against the text of
the document they describe. The rest have no reachable source: they are web pages rather than
PDFs, or they sit behind bot protection. That is a limit of automated checking, not a sign
that anything is wrong with them.

