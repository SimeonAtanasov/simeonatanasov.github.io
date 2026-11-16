# Two independent reviews of the privacy crosswalk, 16 November 2026

Both reviews were run with an AI model, each in a fresh session that had not seen the build
or the other review. The first checked the first draft. The second checked the rows and
notes changed after the first review, plus the NIST column after it became the site's own
reading. The two reports are below, unchanged. The text published is the text after the
corrections to the second review; those corrections were checked by the builder's asserts,
the render test and a reread of every changed note against its reference list, not by a
third review.

# Part 1: after the second review (pass 2)

## What changed before the second review

Simeon's decisions of 16 November 2026: the NIST column is the site's own mapping; the
NIST-hosted GDPR crosswalk is a cross-check only; the BSI deck is not used; the 2019
numbering stays. Every one of the 135 references of the first build was read again against
the GDPR provisions of its row and the subcategory text. Result of that reread: 118 kept,
1 corrected (r30: PR.PO-P9 replaced by ID.RA-P4), 16 dropped (r01 ID.IM-P5; r04 CT.DM-P1;
r06 ID.IM-P6; r09 CM.PO-P2; r13 CM.AW-P5; r15 CT.PO-P2; r17 PR.PT-P2; r21 GV.AT-P2,
GV.MT-P7; r24 ID.IM-P2; r26 GV.PO-P5; r29 ID.DE-P5, GV.AT-P4; r31 CM.AW-P7; r34 GV.PO-P5;
r36 GV.PO-P5). That left 119 references, 96 of them also in the crosswalk. The "via ISO
clause" tag was removed.

## What the second review found

5 errors, 16 should-fix items, 19 items to consider. Of the 119 references it judged 103 to
stand, 15 weak and 1 wrong, and proposed 9 missing ones, 2 more that depend on S3 and 4
optional. Its recomputation of the ISO lists and of the agreement marks showed no
difference from the build.

## What was done with it

- **E1 adopted.** r18 is marked partial; the note says the Framework has no outcome on
  making the record available to a supervisory authority, and "to amend the exemption".
- **E2 adopted.** r16: CT.DM-P10 removed.
- **E3 adopted.** r16 note names both clauses (7.2.2, 7.3.10); r19 and r27 say "among others".
- **E4 adopted.** r19 note: Article 36, not Article 35, ties the result to prior consultation.
- **E5 adopted.** r20, r22 and r23 each say what the crosswalk pairs with that article
  (five, six and one subcategory; checked against nist_hosted_pairs.json).
- **S1 adopted, preferred fix.** The 15 weak references were removed, not explained away:
  r01 GV.PO-P5, r06 ID.RA-P1, r08 PR.AC-P6, r16 ID.RA-P2, r17 ID.RA-P5, r21 GV.AT-P3,
  r24 ID.BE-P1, r26 GV.AT-P4, r27 ID.IM-P2, r28 GV.PO-P4, r31 GV.MT-P5, r32 PR.PO-P7,
  r33 CM.AW-P8, r34 ID.IM-P7, r36 CM.AW-P4. Notes of r21, r31, r33, r34 and r36 were
  reworded so that they describe only the references still cited; the r16 note says why
  ID.RA-P2 is not cited.
- **S2 adopted.** Added: r07 GV.MT-P2; r11 CT.PO-P2; r12 CT.PO-P2; r17 CT.DP-P1;
  r18 ID.IM-P4; r19 ID.IM-P8; r30 ID.DE-P3, PR.DS-P4, PR.DS-P6.
- **S3 adopted.** r12 and r13 state the Article 19 duty to tell the individual who the
  recipients are; CM.AW-P4 added to both; r13 note rewritten.
- **S4 to S9 adopted** with the proposed wording (r01, r02, r05, r08, r30, r35).
- **S10 adopted.** r21, r25, r30: "which the mapping project labels"; the method section
  says the project shortens the titles of clauses 5 to 8.
- **S11 adopted**, with "with the help of an AI model", because that is what happened.
  Simeon replaced the sentence the same evening with his own wording: "drafted and reviewed
  twice with an AI model", plus "It is a working reference: check a row against the
  Regulation before relying on it."
- **S12 to S16 adopted** with the proposed wording. The third statistic reads "of the 188
  ISO/IEC 27701:2019 clauses in the mapping project's list".
- **Consider, adopted:** C1 to C9, C10 (r32 marked partial, note on timing; r30 has ID.DE-P3,
  so it stays unmarked), C12, C13 (the two counts are computed by the builder), C14, C16,
  C17, C18, C19 and the note half of C15 (r01 cross-reference to Articles 12 to 14).
- **Consider, adopted in part:** C11. The intro keeps the sentence on the restructuring,
  which Simeon asked for in those words, drops the sentence on moving to 2025 numbers and
  links to Method and sources.
- **Consider, not adopted:** the optional references of C15 (r01 CM.AW-P1, r03 CT.DP-P5,
  r17 CT.DP-P3 and CT.DP-P5). The reviewer did not count them as missing.
- **Added by the author:** one sentence in the method section, "Agreement is a cross-check,
  not a test: a pairing in the crosswalk that did not pass this reading is not shown."
- **After the changes:** 36 rows; 114 NIST references, 92 that agree with the NIST-hosted
  GDPR crosswalk and 22 on the site's reading alone; 61 of 100 subcategories and 86 of 188
  listed clauses linked; 24 rows marked partial, 3 with no NIST equivalent, 9 unmarked.
  Against the 135 references of the first build: 102 kept, 1 corrected, 32 dropped (16 on
  the author's reread, 16 after the second review), 11 added after the second review.
  The render test (71 checks at 1600px and 390px) passes on the final build.

## Report of the second review, unchanged

# Review 2: GDPR, NIST Privacy Framework 1.0 and ISO/IEC 27701:2019 crosswalk

Independent review, 16 November 2026. Files reviewed: rows.py, built_data.json, page_template.html, checked against gdpr_text_dpmp.json, eurlex_supplement.txt, nist_pf.json, iso27701_2019.json, dpmp_mappings.json, nist_hosted_pairs.json and nist_hosted_support.json. No file other than this report was changed.

## Verdict

The computed parts are exact: my own recomputation of the ISO column (rule 3) and of the agreement marks (rule 2) matches built_data.json with no difference, and the three counts for the method section are 119, 96 and 23. The 36 paraphrases are accurate in substance; I found no wrong number, no wrong role and no wrong article on a card, six obligations need a small correction (a dropped condition or an imprecise clause, S4 to S9) and two need a sentence completed (S3). The weak part is the hand-written layer. One gap mark contradicts its own note and rule 5 (r18). Three notes present an incomplete clause list as the whole list (r16, r19, r27), one note attributes to Article 35 something that is in Article 36 (r19), and the sentence shared by r20, r22 and r23 about the NIST-hosted crosswalk is not true of each row. In the NIST column 103 of 119 references pass the page's own test, 15 are weak (mostly preconditions or generic governance, which the method section says were left out) and 1 fails it (r16, CT.DM-P10); 9 subcategories that pass the same test are missing. The page template has no forbidden ISO/IEC 27701:2025 claim and never presents the NIST references as taken from a crosswalk, but six of its statements go beyond the verified facts or the data (S11 to S16). Fix the five errors and the method statement (S1) before publishing; the rest can follow.

Limits of this review: the builder script was not supplied, so the placeholder values are stated as they should be, not as the builder prints them. Statements about how the work was done (order of selection and comparison, number of reviews) cannot be checked from the files. I made three look-ups outside the supplied files, each named where used: the public table of contents of ISO/IEC 27701:2019 (preview PDF on assets.vde-verlag.de), the NIST news release of April 2025 on the Privacy Framework 1.1 draft, and the target of the iso.org link. Recitals 51, 71 and 86 are cited from memory; they are not in the supplied files.

## Errors (must fix)

### E1. r18: the gap mark contradicts the row's own note and rule 5

- Text at fault: `"gap": ""`.
- Contradicted by: the note on the same row, "for less in others: none asks for erasure time limits, contact details or a description of security measures in the inventory", which is true of all 100 subcategories, and by Article 30(4) (30.4: "shall make the record available to the supervisory authority on request"), for which the Framework has no outcome (the notes on r20 and r23 say so). Rule 5: "partial" means a duty in the row is absent from the Framework or present only in part. r09 and r10 are marked "partial" for exactly this reason (a list of contents that the Framework does not carry).
- Replacement: `"gap": "partial"`.
- Replacement note in full: "The inventory subcategories of the Privacy Framework ask for more detail than Article 30 in some respects, for example data actions and data elements per system, and for less in others: none asks for erasure time limits, contact details or a description of security measures in the inventory. The Privacy Framework also has no outcome on making the record available to a supervisory authority. A Commission proposal to amend the exemption in Article 30(5), COM(2025) 501, was still in procedure on 16 November 2026; the row states the law in force."

### E2. r16: CT.DM-P10 fails the test of rule 1

- Text at fault: `"nist": ["ID.RA-P2", "CT.DM-P10", "CT.PO-P3"]`.
- Contradicted by: nist_pf.json, CT.DM-P10: "Stakeholder privacy preferences are included in algorithmic design objectives and outputs are evaluated against these preferences." Article 22 (22.1 to 22.4) is about not being subject to a solely automated decision, the three exceptions, human intervention, expressing a point of view, contesting the decision, and special categories. Achieving CT.DM-P10 implements or evidences none of these, and the row's note says the Framework "has no outcome on human intervention or on contesting a decision". The mark "A" on this reference changes nothing: rule 1 requires it to stand on the site's reading alone.
- Replacement: `"nist": ["ID.RA-P2", "CT.PO-P3"]` (ID.RA-P2 is weak, see the table; keep it only with the note below).

### E3. r16, r19, r27: the note names some clauses as if they were the whole list

The page uses "among others", "only", "one clause", "two clauses" elsewhere, so "lists the clause titled" reads as complete. In these three rows it is not.

- r16. Text at fault: "The published mapping lists the clause titled \"Automated decision making\" (7.3.10)." built_data.json gives `["7.2.2", "7.3.10"]` (7.2.2 comes from 22.2.a to 22.4 in gdpr_iso.pairs).
  Replacement note in full: "The published mapping lists the clauses titled \"Identify lawful basis\" (7.2.2) and \"Automated decision making\" (7.3.10). The Privacy Framework has an outcome on evaluating analytic inputs and outputs for bias, which this site reads as one possible safeguard among the suitable measures of Article 22(3) and (4). It has no outcome on human intervention, on expressing a point of view or on contesting a decision."
- r19. Text at fault: "The published mapping lists the clause titled \"Privacy impact assessment\" (7.2.5)." built_data.json gives `["5.2.2", "7.2.5", "8.2.1"]`.
  Replacement: see E4, which replaces the whole note.
- r27. Text at fault: "The published mapping lists the clauses titled \"Disclosure of subcontractors used to process PII\", \"Engagement of a subcontractor to process PII\" and \"Change of subcontractor to process PII\" (8.5.6 to 8.5.8)." built_data.json gives `["6.12.1.2", "6.15.1.1", "8.5.6", "8.5.7", "8.5.8"]` (the two clause 6 entries come from 28.3.d).
  Replacement note in full: "The published mapping lists among others the clauses titled \"Disclosure of subcontractors used to process PII\", \"Engagement of a subcontractor to process PII\" and \"Change of subcontractor to process PII\" (8.5.6 to 8.5.8). The Privacy Framework has third parties identified, assessed and bound by contract; it has no outcome on asking the customer before engaging one."

### E4. r19: wrong article in the note

- Text at fault: "Article 35 adds a trigger, required contents and a link to prior consultation."
- Contradicted by: gdpr_text_dpmp.json 35.1 to 35.11, none of which mentions prior consultation. The link is made by Article 36(1) (36.1: "The controller shall consult the supervisory authority prior to processing where a data protection impact assessment under Article 35 indicates ...").
- Replacement note in full: "The published mapping lists among others the clause titled \"Privacy impact assessment\" (7.2.5). The Privacy Framework runs risk assessment as a standing activity for all processing; Article 35 adds a trigger and required contents, and Article 36 ties the result to prior consultation."

### E5. r20, r22, r23: the shared sentence about the NIST-hosted crosswalk is not true of each row

- Text at fault (identical on the three rows): "The NIST-hosted GDPR crosswalk does pair this article with subcategories on inventory, roles or feedback; this site reads none of them as addressing the duty itself."
- Contradicted by: nist_hosted_pairs.json, enterprivacy_pf_gdpr. Article 31 is paired with one subcategory only, CM.AW-P2 (feedback from individuals), so "subcategories" and "none of them" are wrong on r23. Article 27 is paired with GV.PO-P3, GV.AT-P1, GV.AT-P2, GV.AT-P3, GV.MT-P2 and CM.PO-P2: nothing on inventory or feedback. Article 36 is paired with ID.IM-P5, ID.IM-P6, ID.IM-P7, ID.IM-P8 and CM.AW-P2: nothing on roles.
- Replacement note for r20 in full: "The Privacy Framework has no outcome about consulting a regulator before processing starts. The NIST-hosted GDPR crosswalk pairs this article with four inventory subcategories and with the one on feedback from individuals; this site reads none of them as addressing the duty to consult."
  (This also drops "The duty exists only because Article 36 creates it.", which says nothing a reader can use.)
- Replacement note for r22 in full: "The published mapping lists one clause, \"Information security roles and responsibilities\" (6.3.1.1). The Privacy Framework has no outcome about a representative in another jurisdiction. The NIST-hosted GDPR crosswalk pairs this article with six subcategories on workforce and communication roles, training and policy review; this site reads none of them as addressing the designation of a representative."
- Replacement note for r23 in full: "The published mapping lists the clause titled \"Understanding the needs and expectations of interested parties\" (5.2.2). The Privacy Framework has no outcome about dealing with a regulator. The NIST-hosted GDPR crosswalk pairs this article with one subcategory, on feedback from individuals; this site does not read it as addressing cooperation with a supervisory authority."

## Should fix

### S1. The method statement on preconditions and governance is not met by 15 references

- Text at fault (page_template.html, "How the NIST references were chosen"): "kept a subcategory only where achieving its outcome would implement or evidence part of the obligation. Outcomes that are only a precondition, or general governance, were left out unless the row is about them."
- Contradicted by: the 15 references marked weak in the table for check A. Seven are plain preconditions (r06 ID.RA-P1, r24 ID.BE-P1, r27 ID.IM-P2, r31 GV.MT-P5, r32 PR.PO-P7, r34 ID.IM-P7, and r36 CM.AW-P4 as a record that proves no condition), two are generic governance (r01 GV.PO-P5, r17 ID.RA-P5), and two notes say as much themselves (r34 "records where data are processed", r35 "the two references show only where a decision to transfer is authorised and governed by procedure"). Ten of the 16 weak or wrong references carry the mark "A", which shows that agreement with the crosswalk is not evidence that a reference passes the site's own test.
- Fix, preferred: apply the "Suggested action" column of the table, then let the builder recompute the three counts.
- Fix, alternative: keep the references and replace the two sentences with: "For each row the provisions of the GDPR were read against the text of all 100 subcategories. A subcategory was kept where achieving its outcome would implement or evidence part of the obligation. Outcomes that are only a precondition, or general governance, were left out unless the row is about them or the Privacy Framework has nothing closer; in that case the note on the row says that the reference is only the nearest outcome." Then each of the 15 rows needs that sentence in its note.

### S2. Nine subcategories that pass the same test are missing

Each is judged on the GDPR text and the subcategory text alone.

- r07 (Articles 5(2) and 24): GV.MT-P2, "Privacy values, policies, and training are reviewed and any updates are communicated." It implements 24.1 ("Those measures shall be reviewed and updated where necessary") for the policies of 24.2, on the one row that is about governance.
- r11 (Article 16): CT.PO-P2, "Policies, processes, and procedures for enabling data review, transfer, sharing or disclosure, alteration, and deletion are established and in place (e.g., to maintain data quality, manage data retention)." It names alteration; r04 and r10 already cite it on the same reasoning.
- r12 (Article 17): CT.PO-P2, same text. It names deletion.
- r17 (Article 25): CT.DP-P1, "Data are processed to limit observability and linkability (e.g., data actions take place on local devices, privacy-preserving cryptography)." It is a technical measure "designed to implement data-protection principles, such as data minimisation" (25.1) in the same family as CT.DP-P2 and CT.DP-P4, which the row cites.
- r18 (Article 30): ID.IM-P4, "Data actions of the systems/products/services are inventoried." A record of processing activities (30.1) and of "the categories of processing carried out on behalf of each controller" (30.2.b) is an inventory of data actions. The row already cites ID.IM-P6 and ID.IM-P8, which build on data actions, and the note names "data actions" as extra detail, so leaving ID.IM-P4 out is inconsistent.
- r19 (Article 35): ID.IM-P8, "Data processing is mapped, illustrating the data actions and associated data elements for systems/products/services, including components; roles of the component owners/operators; and interactions of individuals or third parties with the systems/products/services." It produces the "systematic description of the envisaged processing operations" that 35.7.a requires as content of the assessment, so it is more than a precondition.
- r30 (Article 28(3)(b) and (c)): ID.DE-P3, "Contracts with data processing ecosystem parties are used to implement appropriate measures designed to meet the objectives of an organization's privacy program." The third sentence of the obligation is about contract terms (28.3.b, 28.3.c) and no reference on the row addresses it; r26 and r27 cite ID.DE-P3 for contract terms.
- r30 (Article 32(1)(b)): PR.DS-P4, "Adequate capacity to ensure availability is maintained." and PR.DS-P6, "Integrity checking mechanisms are used to verify software, firmware, and information integrity." The note says the row "cites the subcategories nearest to the measures the article names"; 32.1.b names integrity and availability, and these two subcategories name them, yet neither is cited.

### S3. Article 19 is handled three different ways on r11, r12 and r13

- r11 states both duties of Article 19 and cites CM.AW-P4 for the second ("tell the individual who those recipients are on request"). r12 and r13 select the same provision ("19") but state only "notify recipients under Article 19" and do not cite CM.AW-P4. Article 19, second sentence: "The controller shall inform the data subject about those recipients if the data subject requests it." It applies to erasure and restriction as well.
- r12, replacement for the last sentence of the obligation: "Where the controller has made the data public, take reasonable steps, taking account of available technology and cost, to inform other controllers processing them that the individual has requested erasure of links and copies. Notify recipients under Article 19 and tell the individual who those recipients are on request."
- r12, `"nist": ["CT.DM-P4", "CT.DM-P5", "CT.PO-P2", "CT.PO-P3", "CM.AW-P5", "CM.AW-P4"]` (CT.PO-P2 from S2).
- r13, replacement for the last sentence of the obligation: "Restricted data may be stored but otherwise processed only with consent or on the limited grounds in Article 18(2). Tell the individual before the restriction is lifted, notify recipients under Article 19 and tell the individual who those recipients are on request."
- r13, `"nist": ["CT.PO-P3", "CT.DM-P7", "CM.AW-P4"]`, and replacement for the last sentence of the note: "The subcategory on passing corrections and deletions on to recipients (CM.AW-P5) does not mention restrictions, so notifying the recipients under Article 19 has no counterpart here; the record of disclosures supports telling the individual who the recipients are."

### S4. r01: a sentence on a duty that the row's provisions do not contain

- Text at fault: "Identify the basis for each purpose; it has to be known by the time the individual is informed under Articles 13 and 14."
- Source: 5.1.a, 6.1, 6.2 and 6.3 contain no duty to identify or record the basis; the sentence is an inference from 13.1.c and 14.1.c, which belong to r09. It also reads as a legal conclusion.
- Replacement obligation in full: "Process personal data lawfully, fairly and transparently, and only where one of the six legal bases in Article 6(1) applies. A basis in a legal obligation or a public task has to be laid down by Union law or by Member State law to which the controller is subject. The legal basis is part of the information due under Articles 13 and 14, which are a separate row."

### S5. r02: a condition is dropped from Article 6(4)

- Text at fault: "on a Union or Member State law that safeguards an objective listed in Article 23(1)" and "under Article 89(1) is not incompatible".
- Source: 6.4.a: "a Union or Member State law which constitutes a necessary and proportionate measure in a democratic society to safeguard the objectives referred to in Article 23(1)". Not every law that serves such an objective qualifies. 5.1.b: "shall, in accordance with Article 89(1), not be considered to be incompatible".
- Replacement obligation in full: "Collect personal data for specified, explicit and legitimate purposes and do not process them further in a way that is incompatible with those purposes. Further processing for archiving in the public interest, scientific or historical research or statistics in accordance with Article 89(1) is not considered incompatible. Where a new purpose rests neither on consent nor on a Union or Member State law that is a necessary and proportionate measure to safeguard an objective listed in Article 23(1), assess compatibility taking into account, among other things, the factors in Article 6(4): the link between the purposes, the context of collection, the nature of the data, the possible consequences for individuals and the existence of appropriate safeguards."

### S6. r05: the sentence on children omits that Article 8 applies only where consent is the basis

- Text at fault: "For an information society service offered directly to a child who is below the age of 16, ..., consent has to be given or authorised by the holder of parental responsibility".
- Source: 8.1: "Where point (a) of Article 6(1) applies, in relation to the offer of information society services directly to a child". Read alone, the sentence suggests that parental consent is always required for such a service.
- Replacement for that sentence: "Where consent is the basis for an information society service offered directly to a child who is below the age of 16, or below the lower age a Member State sets, which may not be under 13, the consent has to be given or authorised by the holder of parental responsibility, and the controller makes reasonable efforts to verify this, taking into consideration available technology."

### S7. r08: the extension is made conditional on telling the individual, and the starting point of the month is missing

- Text at fault: "without undue delay and within one month; the period can be extended by two further months where the complexity and number of requests make that necessary, if the individual is told of the extension and its reasons within the first month."
- Source: 12.3: "within one month of receipt of the request"; eurlex_supplement.txt, Article 12(3): "The controller shall inform the data subject of any such extension within one month of receipt of the request, together with the reasons for the delay." Informing is a separate duty, not a condition of the extension.
- Replacement for that sentence: "Tell the individual what was done about a request without undue delay and within one month of receiving it; the period can be extended by two further months where the complexity and number of requests make that necessary, and the individual has to be told of the extension and its reasons within the first month."

### S8. r30: Article 32(2) is about the level of security, not about assessing the risk

- Text at fault: "In assessing the risk, consider accidental or unlawful destruction, loss, alteration and unauthorised disclosure or access."
- Source: 32.2: "In assessing the appropriate level of security account shall be taken in particular of the risks that are presented by processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data".
- Replacement: "In assessing the appropriate level of security, take account in particular of the risks of accidental or unlawful destruction, loss or alteration of the data and of unauthorised disclosure of or access to them."

### S9. r35: the documentation duty is not the controller's alone

- Text at fault: "the controller informs the supervisory authority and the individuals and documents the assessment and the safeguards in the Article 30 record."
- Source: eurlex_supplement.txt, Article 49(6) (and 49.6): "The controller or processor shall document the assessment as well as the suitable safeguards". The row's role is "both".
- Replacement for the clause after the semicolon: "the controller informs the supervisory authority and the individuals, and the controller or processor documents the assessment and the safeguards in the Article 30 record."

### S10. r21, r25, r30 and the method section: "Guidance related to ISO/IEC 27002" is not the published title of clause 6

- Text at fault: "under clause 6, \"Guidance related to ISO/IEC 27002\"" (r21, r25, r30). The quotation matches iso27701_2019.json, so rule 4 is met, but the label is the mapping project's shortening. The public table of contents of ISO/IEC 27701:2019 (preview PDF, assets.vde-verlag.de, info_isoiec27701{ed1.0}en.pdf, read today) gives clause 5 as "PIMS-specific requirements related to ISO/IEC 27001", clause 6 as "PIMS-specific guidance related to ISO/IEC 27002", clause 7 as "Additional ISO/IEC 27002 guidance for PII controllers" and clause 8 as "Additional ISO/IEC 27002 guidance for PII processors". The sheet has "Requirements related to ISO/IEC 27001", "Guidance related to ISO/IEC 27002", "Guidance for Controllers" and "Guidance for Processors". A reader who holds the standard will see a misquoted title.
- Replacement in the three notes: "under clause 6, which the mapping project labels \"Guidance related to ISO/IEC 27002\"".
- Replacement in the method section, for "with one typing error in a title corrected.": "with one typing error in a title corrected. The project shortens the titles of clauses 5 to 8; the views show its labels." The same four labels appear in the views by clause, so the sentence is needed even if the notes are changed.

### S11. Template: "checked twice by separate reviewers"

- Text at fault: "Mapping written on 16 November 2026 and checked twice by separate reviewers against the GDPR text, the Privacy Framework Core and the published mappings. The text of ISO/IEC 27701 was not available to the author or to the reviewers."
- Problem: the data cannot support it, it was written before the second review was finished, and the text that will be published is the text after corrections, which no review has seen. "Reviewers" will be read as people with relevant qualifications; if either review was automated, the sentence overclaims.
- Replacement: "Mapping written on 16 November 2026. It was reviewed twice, each time independently of the author and of the other review, against the GDPR text, the Privacy Framework Core and the published mappings, and corrected after each review. The text of ISO/IEC 27701 was not available to the author or for the reviews." Add "with the help of an AI model" after "reviewed twice" if that is what happened.

### S12. Template: the description of the Privacy Framework 1.1 draft goes beyond the verified facts

- Text at fault: "The draft moves and renames categories in Govern-P and Protect-P, so the NIST column will be re-keyed once the final version is out".
- The verified facts cover only the existence, number and date of the draft. NIST's news release of April 2025 (nist.gov/news-events/news/2025/04/nist-updates-privacy-framework-tying-it-recent-cybersecurity-guidelines) says the draft Core is realigned with Cybersecurity Framework 2.0 in many places and names the Govern and Protect Functions; it does not say which categories move or are renamed.
- Replacement: "NIST describes the draft Core as realigned with Cybersecurity Framework 2.0, in particular in Govern-P and Protect-P, so the NIST column will be re-keyed once the final version is out, using NIST's mapping from 1.0 to 1.1 if it publishes one with it."

### S13. Template: a statement of copyright law

- Text at fault: "NIST publications are not subject to copyright in the United States."
- It is a legal conclusion (rule 6), it is not among the verified facts, and it says nothing about use outside the United States, where most readers of a GDPR page are.
- Replacement for the sentence that contains it: "Subcategory text is quoted as published, in its American spelling, with the source named."

### S14. Template: the coverage statement is wider than the rows

- Text at fault: "The page covers Articles 5 to 22, 24 to 39 and 44 to 49."
- Contradicted by: rows.py. No selector takes 28.5, 28.6, 28.10 or 32.3 (each has a clause in gdpr_iso.pairs), and Article 28(7) and (8) are in no row.
- Replacement: "The page covers Articles 5 to 22, 24 to 39 and 44 to 49, except Article 28(5) to (8) and (10) and Article 32(3), which concern codes of conduct, certification, standard contractual clauses and a processor that acts as a controller."

### S15. Template: "a provision of the row" is narrower than the matching rule

- Text at fault ("How to read this", item 3): "the GDPR crosswalk hosted by NIST, a third-party work, pairs the same subcategory with a provision of the row."
- Under rule 2 a pairing with a whole article, or with a parent paragraph, also counts. Six of the 96 marks rest on that: r01 GV.PO-P5 and r02 GV.PO-P1 (crosswalk: Article 6, no paragraph), r31 PR.PO-P7, r32 CM.AW-P7 and r32 PR.PO-P7 (Article 33, no paragraph), r28 GV.PO-P4 (Article 28(3)). On r31 and r32 the same article-level pairing gives the mark to two rows that split Article 33 between authority and controller. The method section already says "an article or provision of the row".
- Replacement: "the GDPR crosswalk hosted by NIST, a third-party work, pairs the same subcategory with a provision of the row, or with the whole article or paragraph that contains it."

### S16. Template: the total in the third statistic is not a count of the standard's clauses

- Text at fault: "<strong>@@ISO_USED@@</strong> of @@ISO_TOTAL@@ ISO/IEC 27701:2019 clauses linked".
- iso27701_2019.json holds 259 entries, 188 of them leaves; 86 distinct clauses are linked, all leaves. Whichever total the builder uses, it is the size of the mapping project's list. Nobody on the project has counted the clauses of the standard.
- Replacement: "<strong>@@ISO_USED@@</strong> of the @@ISO_TOTAL@@ ISO/IEC 27701:2019 clauses in the mapping project's list linked", with @@ISO_TOTAL@@ = 188 (leaves only). Expected values of the other placeholders: @@N_ROWS@@ 36, @@NIST_USED@@ 64, @@NIST_TOTAL@@ 100, @@ISO_USED@@ 86.

## Consider

- C1. r06 note, "That Article 6 applies alongside Article 9 follows from recital 51." A recital states a reading; it does not make a rule. Replacement: "Recital 51 says that the conditions for lawful processing apply in addition to the specific requirements for special categories." The obligation's "in addition to a legal basis under Article 6" then rests on a named source that is not in the row's provisions, which is acceptable once said this way.
- C2. r07 obligation: 24.1 is about compliance with the whole Regulation, and the paraphrase keeps only the principles. Replacement for the second sentence: "Implement appropriate technical and organisational measures, taking into account the nature, scope, context, purposes and risks of the processing, to ensure and to be able to demonstrate that processing complies with the Regulation; review and update them where necessary, and adopt data protection policies where that is proportionate."
- C3. r10 note: the transfer safeguards are in 15.2. Replace "comes from Article 15(1)" with "comes from Article 15(1) and (2)".
- C4. r12 obligation, "at the individual's request or on the controller's own obligation" is awkward and reads as a legal conclusion. Replacement for the first sentence: "Erase personal data without undue delay where a ground in Article 17(1) applies, for example the data are no longer necessary, consent is withdrawn and no other legal ground remains, an objection succeeds or the data were processed unlawfully. Article 17(1) states this both as a right of the individual and as an obligation of the controller." Also, the note's last sentence ("a legal assessment each time") is the same kind of statement that helps make r15 "partial"; the mark "" on r12 is defensible under rule 5 because no duty is absent, but say so or drop the sentence.
- C5. r18 note, "to widen the exemption": the verified fact is only that COM(2025) 501 concerns Article 30(5). Use "to amend" (done in E1). r18 obligation omits the name and contact details of 30.1.a although the note mentions contact details; add "the name and contact details of the controller and, where applicable, of the joint controller, the representative and the data protection officer," before "the purposes".
- C6. r21 obligation: add the exception in 37.1.a, "(courts acting in their judicial capacity excepted)", after "carries out the processing"; and "Choose the officer for expert knowledge" is narrower than 37.5. Replacement: "Choose the officer for professional qualities, in particular expert knowledge of data protection law and practice".
- C7. r26 note, "are on the rows that follow": two of the terms, Article 28(3)(b) and (c), are on r30 in another theme. Replacement: "are on the rows for those terms, including the security row".
- C8. r33 obligation narrows 34.3.a ("in particular those that render the personal data unintelligible"). Replacement: "No communication is needed where appropriate protection measures had been applied to the data, in particular measures that make them unintelligible to unauthorised persons, such as encryption, or where ...".
- C9. r34 obligation, "That means an adequacy decision or, failing that, appropriate safeguards": Chapter V has a third route. Add at the end: "Failing both, only the derogations of Article 49 remain, which are a separate row."
- C10. r32: gap "" although the Framework states no timing ("without undue delay", 33.2), while r08 and r31 count time limits as gaps. Either add to the note "The Privacy Framework sets no time for the notification." and mark "partial", or leave both rows as they are and accept the difference between a fixed period and "without undue delay". The same applies to r30 if ID.DE-P3 is not added: the contract terms of Article 28(3)(b) and (c) then have no reference and the row should be "partial".
- C11. Template: the paragraph on the 2019 and 2025 editions is given twice, almost word for word (intro and "ISO/IEC 27701" bullet). Keep the full version in the method section and shorten the intro to: "The ISO column uses the numbering of the 2019 edition, because that is the numbering the public mappings use. That edition is withdrawn and a 2019 number cannot be assumed to carry over to ISO/IEC 27701:2025; see Method and sources."
- C12. Template, "Both frameworks are voluntary and the GDPR is not": ISO/IEC 27701 is a standard. Replacement: "Neither the standard nor the framework is binding, and the GDPR is".
- C13. Template, "A processor carries far fewer obligations than a controller." On this page it is 13 rows against 33. Replacement: "Fewer rows apply to a processor (13) than to a controller (33)."
- C14. Template, "a table of correspondence with the 2019 edition (Annex F)": the verified title is "Correspondence with ISO/IEC 27701:2019"; drop "a table of". "buy the standard from ISO or a national standards body" reads as a sales pointer; replacement: "the standard is sold by ISO and by national standards bodies".
- C15. Optional references, not counted as missing. r01: CM.AW-P1 for the word "transparently" in 5.1.a, or add to the note "Transparency is worked out in the rows on Articles 12 to 14." r03: CT.DP-P5, "Attribute references are substituted for attribute values.", a minimisation technique. r17: CT.DP-P3 and CT.DP-P5, for the same reason as CT.DP-P1 in S2.
- C16. Template, "For each row the site read the provisions": a site does not read. Use the passive wording given in S1.
- C17. Template, "@@N_ALONE@@ are not in it for the provisions of their row" is hard to parse. Replacement: "Of the @@N_REFS@@ references, @@N_AGREE@@ agree with the NIST-hosted GDPR crosswalk; for the other @@N_ALONE@@ the crosswalk does not pair the subcategory with any provision of the row."
- C18. Notes that lean towards a legal conclusion: r01 "Which basis is valid for a purpose is decided by Article 6 and the case law." (replacement: "Which basis fits a purpose is a question of Article 6, not of the Framework."); r07 "can serve as evidence when demonstrating accountability under Article 5(2)" (replacement: "can support a demonstration of accountability under Article 5(2)").
- C19. Template, "It moves to the 2025 numbering when a checked source for it is available." reads as a present fact. Replacement: "It will move to the 2025 numbering once a checked source for it is available."

## Check A: the 119 NIST references

Verdicts are mine, from the GDPR provisions in `sel` and the subcategory text only. "Mark" is copied from built_data.json for information and played no part in the verdict. Totals: 103 stand, 15 weak, 1 wrong. Missing: 9 proposed (S2), 2 more that depend on S3, 4 optional (C15).

Narrow passes, counted as "stands": PR.PO-P7 on r31 and r33 (only for the measures and remedial action that 33.3.d, 33.5 and 34.2 require to be described or recorded); CT.PO-P2 on r34, r35 and r36 and CT.PO-P1 on r35 (the notes already say they show only where the decision is governed); GV.MT-P7 on r08 (complaints and questions, not rights requests as such); ID.DE-P1 on r25; CT.PO-P1 and GV.AT-P1 on r28.

| Row | Subcategory | Mark | Verdict | Reason (weak or wrong only) | Suggested action | Missing on this row |
|---|---|---|---|---|---|---|
| r01 | CT.PO-P1 | S+A | stands |  |  | Optional: CM.AW-P1 for the transparency limb of Article 5(1)(a), or a cross-reference in the note (C15). |
| r01 | GV.PO-P5 | S+A | weak | General governance outcome that fits every row. It bears on this row only through Article 6(1)(c) and 6(3) (knowing the law relied on), and the same logic is not applied on r06, where Article 9(2) and Article 10 also depend on Union or Member State law. | Remove, or add it to r06 as well and say why in both notes. |  |
| r02 | ID.IM-P5 | S+A | stands |  |  | none |
| r02 | CT.PO-P1 | S+A | stands |  |  |  |
| r02 | GV.PO-P1 | S+A | stands |  |  |  |
| r03 | CT.DP-P4 | S+A | stands |  |  | Optional: CT.DP-P5 (C15). |
| r03 | CT.DM-P5 | S+A | stands |  |  |  |
| r03 | CT.DP-P2 | S+A | stands |  |  |  |
| r03 | CT.PO-P2 | S | stands |  |  |  |
| r03 | GV.PO-P1 | S | stands |  |  |  |
| r04 | CT.PO-P2 | S+A | stands |  |  | none |
| r04 | CT.DM-P3 | S+A | stands |  |  |  |
| r04 | CT.DM-P4 | S+A | stands |  |  |  |
| r05 | CT.PO-P1 | S+A | stands |  |  | none |
| r05 | CT.PO-P3 | S+A | stands |  |  |  |
| r05 | CM.AW-P1 | S+A | stands |  |  |  |
| r06 | ID.RA-P1 | S | weak | Precondition. Knowing which data are sensitive does not implement the prohibition or any condition of Article 9(2); the note itself says the Framework defines no special categories. | Keep only if the method statement is softened (S1); otherwise remove. | none |
| r06 | CT.PO-P1 | S+A | stands |  |  |  |
| r07 | GV.PO-P1 | S+A | stands |  |  | GV.MT-P2 |
| r07 | GV.PO-P6 | S+A | stands |  |  |  |
| r07 | GV.MT-P3 | S | stands |  |  |  |
| r07 | GV.PO-P5 | S+A | stands |  |  |  |
| r07 | GV.MT-P1 | S | stands |  |  |  |
| r08 | CT.PO-P3 | S+A | stands |  |  | none |
| r08 | CM.PO-P1 | S+A | stands |  |  |  |
| r08 | CM.AW-P1 | S+A | stands |  |  |  |
| r08 | GV.MT-P7 | S+A | stands |  |  |  |
| r08 | PR.AC-P6 | S | weak | Article 12(6) is a permission, not a duty, and the outcome is written for access to systems. It supports the row only where requesters are authenticated through an account. | Keep with one sentence in the note, or remove. |  |
| r09 | CM.AW-P1 | S+A | stands |  |  | none |
| r09 | CM.PO-P1 | S+A | stands |  |  |  |
| r09 | CM.AW-P3 | S+A | stands |  |  |  |
| r10 | CT.DM-P1 | S+A | stands |  |  | none |
| r10 | CT.DM-P2 | S+A | stands |  |  |  |
| r10 | CT.PO-P3 | S+A | stands |  |  |  |
| r10 | CT.PO-P2 | S+A | stands |  |  |  |
| r10 | CM.AW-P4 | S | stands |  |  |  |
| r10 | CM.AW-P6 | S | stands |  |  |  |
| r11 | CT.DM-P3 | S+A | stands |  |  | CT.PO-P2 |
| r11 | CT.PO-P3 | S+A | stands |  |  |  |
| r11 | CM.AW-P5 | S+A | stands |  |  |  |
| r11 | CM.AW-P4 | S | stands |  |  |  |
| r12 | CT.DM-P4 | S+A | stands |  |  | CT.PO-P2; CM.AW-P4 if the obligation is completed (S3) |
| r12 | CT.DM-P5 | S | stands |  |  |  |
| r12 | CT.PO-P3 | S+A | stands |  |  |  |
| r12 | CM.AW-P5 | S+A | stands |  |  |  |
| r13 | CT.PO-P3 | S+A | stands |  |  | CM.AW-P4 if the obligation is completed (S3) |
| r13 | CT.DM-P7 | S | stands |  |  |  |
| r14 | CT.DM-P2 | S+A | stands |  |  | none |
| r14 | CT.DM-P6 | S+A | stands |  |  |  |
| r14 | CT.PO-P3 | S+A | stands |  |  |  |
| r15 | CT.PO-P3 | S+A | stands |  |  | none |
| r15 | CM.AW-P1 | S+A | stands |  |  |  |
| r16 | ID.RA-P2 | S+A | weak | Bias evaluation is not in Article 22. It can be read into the "suitable measures" of Article 22(3) and (4) only with recital 71. | Keep with the note wording in E3, or remove. | none |
| r16 | CT.DM-P10 | S+A | wrong | No part of the obligation is implemented or evidenced by putting stakeholder preferences into algorithm design. The note concedes that the Framework has no outcome on human intervention or on contesting a decision. | Remove (E2). |  |
| r16 | CT.PO-P3 | S+A | stands |  |  |  |
| r17 | GV.PO-P2 | S+A | stands |  |  | CT.DP-P1; optional CT.DP-P3, CT.DP-P5 (C15) |
| r17 | CT.PO-P4 | S+A | stands |  |  |  |
| r17 | CT.DP-P2 | S+A | stands |  |  |  |
| r17 | CT.DP-P4 | S+A | stands |  |  |  |
| r17 | ID.RA-P5 | S+A | weak | Generic risk-response outcome, not specific to design or defaults. It is not cited on r07 (Article 24) or r30 (Article 32), which rest on the same risk-based wording. | Remove. |  |
| r18 | ID.IM-P1 | S+A | stands |  |  | ID.IM-P4 |
| r18 | ID.IM-P2 | S+A | stands |  |  |  |
| r18 | ID.IM-P3 | S+A | stands |  |  |  |
| r18 | ID.IM-P5 | S+A | stands |  |  |  |
| r18 | ID.IM-P6 | S+A | stands |  |  |  |
| r18 | ID.IM-P7 | S+A | stands |  |  |  |
| r18 | ID.IM-P8 | S+A | stands |  |  |  |
| r18 | CM.AW-P4 | S+A | stands |  |  |  |
| r19 | ID.RA-P1 | S+A | stands |  |  | ID.IM-P8 |
| r19 | ID.RA-P3 | S | stands |  |  |  |
| r19 | ID.RA-P4 | S+A | stands |  |  |  |
| r19 | ID.RA-P5 | S+A | stands |  |  |  |
| r19 | GV.MT-P1 | S+A | stands |  |  |  |
| r19 | CM.AW-P2 | S+A | stands |  |  |  |
| r20 | (none) | | | | | none; the empty list is right |
| r21 | GV.PO-P3 | S+A | stands |  |  | none |
| r21 | GV.AT-P3 | S+A | weak | Personnel understanding their role is not the expert knowledge of Article 37(5) and not a duty of the controller or processor under Articles 37 to 39. | Remove. |  |
| r22 | (none) | | | | | none; the empty list is right |
| r23 | (none) | | | | | none; the empty list is right |
| r24 | ID.BE-P1 | S | weak | Precondition. Identifying the organisation's own role comes before Article 26; the arrangement itself is GV.PO-P4 and ID.DE-P3. | Remove. | none |
| r24 | GV.PO-P4 | S | stands |  |  |  |
| r24 | ID.DE-P3 | S+A | stands |  |  |  |
| r25 | ID.DE-P2 | S+A | stands |  |  | none |
| r25 | ID.DE-P5 | S+A | stands |  |  |  |
| r25 | ID.DE-P1 | S | stands |  |  |  |
| r26 | ID.DE-P3 | S+A | stands |  |  | none |
| r26 | GV.PO-P4 | S+A | stands |  |  |  |
| r26 | GV.AT-P4 | S+A | weak | Awareness outcome. It is neither the contract nor evidence of its terms, and adds nothing to ID.DE-P3 and GV.PO-P4. | Remove. |  |
| r27 | ID.DE-P2 | S | stands |  |  | none |
| r27 | ID.DE-P3 | S+A | stands |  |  |  |
| r27 | ID.IM-P2 | S+A | weak | Precondition. An inventory of operators shows which sub-processors exist, not that the controller authorised them or was told of a change. | Remove. |  |
| r28 | CT.PO-P1 | S+A | stands |  |  | none |
| r28 | GV.PO-P4 | S+A | weak | Aligning roles with third parties is not processing on documented instructions; the note says the Framework has no such outcome. | Remove, or keep with the softened method statement (S1). |  |
| r28 | GV.AT-P1 | S | stands |  |  |  |
| r29 | CT.PO-P3 | S+A | stands |  |  | none |
| r29 | CT.DM-P5 | S+A | stands |  |  |  |
| r29 | PR.DS-P3 | S+A | stands |  |  |  |
| r30 | ID.RA-P4 | S+A | stands |  |  | ID.DE-P3, PR.DS-P4, PR.DS-P6 |
| r30 | PR.DS-P1 | S+A | stands |  |  |  |
| r30 | PR.DS-P2 | S+A | stands |  |  |  |
| r30 | PR.AC-P4 | S+A | stands |  |  |  |
| r30 | PR.PO-P3 | S+A | stands |  |  |  |
| r30 | PR.PO-P7 | S+A | stands |  |  |  |
| r30 | PR.PO-P8 | S+A | stands |  |  |  |
| r30 | PR.PT-P4 | S+A | stands |  |  |  |
| r30 | CT.DM-P9 | S+A | stands |  |  |  |
| r30 | PR.PO-P10 | S+A | stands |  |  |  |
| r30 | CT.DP-P2 | S | stands |  |  |  |
| r31 | PR.PO-P7 | S+A | stands |  |  | none |
| r31 | GV.MT-P5 | S | weak | Covers intake and triage of reported problematic data actions, which is a precondition (becoming aware). It neither notifies the authority nor keeps the breach record. | Keep only with the softened method statement (S1). |  |
| r32 | CM.AW-P7 | S+A | stands |  |  | none |
| r32 | PR.PO-P7 | S+A | weak | The only duty in the row is to notify the controller, which CM.AW-P7 covers. A response plan is a precondition and its text does not mention notification. | Remove. |  |
| r33 | CM.AW-P7 | S+A | stands |  |  | none |
| r33 | CM.AW-P8 | S | weak | Article 34 requires telling individuals about the measures taken, not providing mitigation mechanisms; the nearest support is recital 86. | Remove, or keep with the softened method statement (S1). |  |
| r33 | PR.PO-P7 | S+A | stands |  |  |  |
| r34 | ID.IM-P7 | S | weak | Precondition. Knowing where data are processed shows that a transfer exists, not that a condition of Chapter V is met. | Remove, or keep with the softened method statement (S1). | none |
| r34 | CT.PO-P2 | S+A | stands |  |  |  |
| r34 | ID.DE-P3 | S | stands |  |  |  |
| r35 | CT.PO-P1 | S | stands |  |  | none |
| r35 | CT.PO-P2 | S+A | stands |  |  |  |
| r36 | CT.PO-P2 | S+A | stands |  |  | none |
| r36 | CM.AW-P4 | S+A | weak | Article 48 has no record-keeping duty. A record of disclosures shows that a disclosure took place, not that the foreign order met the test. | Remove. |  |

## Check B: recomputation

Script: /tmp/rv/recompute.py (my own, written from rules 2 and 3; the builder was not supplied).

- Rule 3, ISO column: 36 of 36 rows identical to built_data.json, same clauses and same order; 86 distinct clauses, all present in iso27701_2019.json, all leaves. "=28.3" selects nothing in gdpr_iso.pairs (28.3 has no clauses of its own), so r26 takes its two clauses from 28.9, as its note says. The selector "6.4" on r02 is not itself a key in the pairs (only 6.4.a to 6.4.e are); it resolves correctly through "everything under it".
- Rule 2, mark "A": 119 of 119 references identical. 96 carry "A", 23 do not; every reference carries "S". nist_hosted_support.json agrees with built_data.json row by row. The result does not depend on how "=28.3" is read for the "lies under it" case. Of the 96, 90 rest on a pairing at or below a selector, 5 on a pairing with the whole article, 1 on a parent paragraph (see S15).
- The three counts for the method section: @@N_REFS@@ = 119, @@N_AGREE@@ = 96, @@N_ALONE@@ = 23. They add up. They will change if references are removed or added after this review.
- Differences found: none.
- Also compared: `pub.gdprIso` (335 entries) equals the non-empty entries of gdpr_iso.pairs; `iso` and `nist` in built_data.json equal the source files; obligation, note, gap, role and theme of every built row equal rows.py.
- Not in the mapping project's sheet, so silent in the ISO column: for example Article 28(7), 28(8), 35(6), 36(2) and 36(4). No action needed; the method section already says the column repeats the sheet.

## Checked and found correct

- Check A: 103 of 119 references stand. r20, r22 and r23 are rightly empty: I found no subcategory among the 100 that implements or evidences prior consultation, the designation of a representative or cooperation with a supervisory authority.
- Check B: 36 ISO lists, 119 marks and 3 counts, no difference (details above).
- Check C: 36 obligations read against every provision in `sel` and against eurlex_supplement.txt. 28 need no change; 6 need a correction (S4 to S9) and 2 a completed sentence (S3); the points in C2, C4 to C6, C8 and C9 are optional. All numbers are right: six legal bases (6.1.a to 6.1.f), ages 16 and 13 (8.1 and supplement), one month and two further months (12.3 and supplement), one month (14.3.a), 250 employees (30.5), 72 hours (33.1), eight weeks and six weeks (supplement, Article 36(2)), three cases (35.3.a to 35.3.c). All 36 roles are right. All card labels match `sel`; the only provision selected by more than one row is Article 19 (r11, r12, r13), which is intended. The 16 recently rewritten rows were read twice; findings on them are S4 (r01), S5 (r02), S6 (r05), S7 (r08), S8 (r30), S9 (r35), S3 (r12, r13) and the minor points C4, C6, C9; r09, r10, r15, r19, r28 and r29 have no finding on the obligation.
- Check D: 34 non-empty notes. All 48 quoted strings exist as titles in iso27701_2019.json with the numbers given, and each belongs to a clause in the row's computed list or to a heading above one. Every statement about what the Privacy Framework contains or lacks was checked against all 100 subcategories and is true (including "all 30 subcategories of Protect-P": 10 + 6 + 8 + 2 + 4). No note describes what an ISO clause requires, contains or lacks. The two subcategories named in notes as not cited (CM.AW-P5 on r13, CM.AW-P7 on r31) are indeed not in those rows' lists, and every reference a note describes is in the list. "gap" is "none" exactly on the three rows with an empty list. The statements on r30 ("more clauses than for any other row", "most of them under clause 6") hold: 32 clauses, 24 under clause 6; the next row has 11. The claims in the method section about the mapping project's Privacy Framework sheet hold: 99 rows, 2 without a counterpart, and GV.PO-P1, CT.DM-P9 and CT.DM-P10 absent.
- Check E: no em dash or en dash in rows.py or page_template.html. No American spelling in the site's own copy ("Organization" and "minimization" occur only inside quoted ISO titles). No company-internal name. Nothing says or implies ISO/IEC 27701:2025 numbering or text, and the agreed wording on the 2025 edition is used ("restructured", "cannot be assumed to carry over"; no "every control"). Nothing describes the NIST references as taken from a crosswalk. The statements on the GDPR's status, the two Commission proposals, the Privacy Framework versions, the ISO editions and annexes, the Data Protection Mapping Project and the NIST-hosted crosswalk stay within the facts verified by the author, except where S12, S13 and C14 say otherwise. The link https://www.iso.org/standard/27701 resolves to ISO/IEC 27701:2025, edition 2 (checked today).

---

# Part 2: the first review (pass 1)

A separate reviewer, who had not seen the build, checked the first draft against the GDPR
text, the Privacy Framework Core and the published mappings. Its report is below, unchanged.
It found 14 errors, 26 should-fix items and 17 items to consider. This section records what
was done with them before the page was wired in.

## What was done

- **E1 fixed.** The extraction now splits references such as "Art. 28(1,3,4 &9)" and
  "Art. 12(3-6)" into one pair per paragraph and stops on anything it cannot parse;
  `make_support.py` refuses a malformed paragraph. Tags after the fix and the changes below:
  135 NIST references, 109 also in the NIST-hosted GDPR crosswalk, 86 sharing an ISO clause
  (all 86 also in the crosswalk), 26 on the site's reading alone.
- **E2, E3 adopted.** r28 is now "controller and processor" and states only the instruction
  duties; the duty to flag an infringing instruction moved to r29, which is marked partial.
- **E4 to E12 adopted** with the proposed wording (r30, r05, r12, r02, r10, r15, r22, r35).
  The builder now also checks the r30 claim (most clauses of any row).
- **E13 adopted.** The page says every NIST reference is the site's selection and that
  "via ISO clause" is an inference through a shared clause.
- **E14 adopted in the end.** The first build kept "renumbered every control" on Simeon's
  instruction. On 16 November 2026 he reversed it: the page now says the 2025 edition is
  restructured, with the management system in clauses 4 to 10 and the controls in Annex A,
  and that a 2019 number cannot be assumed to carry over. "Every control" is not used.
- **S1 to S10, S12, S14, S16 to S23, S25, S26 adopted.**
- **S11 adopted**, and from C6: r10 is marked partial as well; r12 stays unmarked (the
  grounds and exceptions of Article 17 are legal tests, not duties the framework lacks).
- **S13 adopted.** r15: CT.PO-P1 replaced by CT.PO-P2. r31: GV.MT-P6 removed.
- **S15 checked on EUR-Lex** on 16 November 2026: Article 8(1) second sentence, Article 36(2),
  the second subparagraph of Article 49(1) and Article 49(6) read as the rows say; r35
  reworded as proposed.
- **S24:** no change needed; the denominator is the 188 leaf clauses.
- **Consider:** C1, C2 (r04 CT.DM-P4), C3, C4 (r10 CT.DM-P2), C5 (r17 PR.PT-P2), C7 (the
  controller has to demonstrate the grounds), C8 (r18 ID.IM-P2), C9 (r26 note names Article
  28(9)), C10, C11 (r30 PR.PT-P4 and CT.DM-P9, contract wording), C13, C14 and most of C16
  adopted. C12 kept as written: the Commission's proposal text says it amends Article 33.
  C15 and C17 need no action.
- After the changes: 36 rows, 22 marked partial, 3 with no NIST equivalent, 11 unmarked.
  The render test (71 checks at 1600px and 390px) passes on the final build.

---

# Review of the GDPR, ISO/IEC 27701:2019 and NIST Privacy Framework 1.0 crosswalk

Reviewed on 16 November 2026 against the files in /home/claude/review/. Nothing but this file was changed.

## Verdict

The mechanical side is sound: all 36 ISO lists and all 130 source tags reproduce exactly from the raw files when the extracted pairs are read literally, rule 4 holds on every row, and all 31 quoted ISO titles exist with the stated number in the row's own list. The page is not ready to publish as it stands, for four reasons. First, the extraction of the NIST-hosted GDPR crosswalk cut four multi-paragraph references short, so seven tags understate the published support and one reference is shown as "site's reading" although the hosted crosswalk makes that pair. Second, six notes describe what ISO/IEC 27701 does or does not contain, which rule 3 forbids because nobody read the standard, and one note states a count that the data contradicts. Third, three obligation paraphrases misstate the law (r05, r12, r28) and one sentence sits on a row whose card and `sel` do not cover it (r28, belongs to r29). Fourth, the page copy overclaims in two places: it says a "via ISO clause" tag means a published mapping makes the same link, and it says the 2025 edition "renumbered every control", which no verified fact supports. Most of the remaining findings are missing conditions in paraphrases and gap marks applied unevenly. Totals: 14 errors, 26 should-fix items, 17 items to consider.

How to read the proposals: replacement text is given in full where a change is proposed, with plain double quotes that need escaping when pasted into `rows.py`. Curly apostrophes inside quoted ISO titles are as published.

## Errors

### E1. Tags: four Enterprivacy references were truncated at extraction, so 7 tags are wrong (r26, r27, r28, r29)

- Text at fault: in `nist_hosted_pairs.json`, `enterprivacy_pf_gdpr`, the paragraph string is `"(1"` for `ID.DE-P3` (label "Art. 28(1,3, 4,6 &9): Processors governed by contract") and for `ID.DE-P5`, `GV.PO-P4`, `GV.AT-P4` (label "Art. 28(1,3,4 &9): Processors governed by contract"). The builder reads `"(1"` as Article 28(1) only. Two more strings are malformed but change no tag: `"(3"` for `GV.MT-P7` (label "Art. 12(3-6)") and `".4"` for `ID.IM-P5` (label "Art. 32.4"); and `CT.PO-P3` carries an empty paragraph for the label "Art. 13)(2)(b)".
- Source that contradicts it: the labels in the same file. The hosted crosswalk pairs these four subcategories with Article 28(3), (4) and (9) as well, and `ID.DE-P3` also with 28(6).
- Effect under rule 2 (my recomputation, reading the paragraphs from the labels):

| Row | Reference | Built | Should be | Matching provision |
|---|---|---|---|---|
| r26 | ID.DE-P3 | C | G, C | 28(3), 28(9) |
| r26 | GV.PO-P4 | S | G | 28(3), 28(9) |
| r26 | GV.AT-P4 | C | G, C | 28(3), 28(9) |
| r27 | ID.DE-P3 | C | G, C | 28(4); 28(3) is parent of 28.3.d |
| r28 | GV.PO-P4 | C | G, C | 28(3) is parent of 28.3.a |
| r29 | ID.DE-P5 | C | G, C | 28(3) is parent of 28.3.e to h |
| r29 | GV.AT-P4 | C | G, C | 28(3) is parent of 28.3.e to h |

- Totals move from G 95, C 82, S 28 to G 102, C 82, S 27 (both tags 81, G only 21, C only 1, S 27). The page figures @@N_G@@ and @@N_S@@ change with them, and so does `nist_hosted_support.json` for r26 to r29.
- Proposed fix: in the extraction, split each multi-paragraph reference into one pair per paragraph: `[28,"(1)"], [28,"(3)"], [28,"(4)"], [28,"(6)"], [28,"(9)"]` for ID.DE-P3; `[28,"(1)"], [28,"(3)"], [28,"(4)"], [28,"(9)"]` for ID.DE-P5, GV.PO-P4 and GV.AT-P4; `[12,"(3)"]` to `[12,"(6)"]` for GV.MT-P7; `[32,"(4)"]` for ID.IM-P5; `[13,"(2)(b)"]` for CT.PO-P3. Add a build check that rejects any paragraph string that does not match `(\([0-9a-z]+\))*`. If the pair count 483 is shown anywhere, say that it counts source rows.

### E2. r28: wrong role

- Text at fault: `"role": "processor"` on a card that lists Article 29 and Article 32(4).
- Source: 32.4: "The controller and processor shall take steps to ensure that any natural person acting under the authority of the controller or the processor who has access to personal data does not process them except on instructions from the controller". Article 29 also covers "any person acting under the authority of the controller". A reader who filters for the controller role loses a duty that binds controllers.
- Proposed: `"role": "both"`, with the obligation text in E3.

### E3. r28 and r29: the sentence on infringing instructions is on the wrong row

- Text at fault (r28 obligation): "The processor tells the controller immediately if it considers that an instruction infringes data protection law." and (r28 note) "It has no outcome on refusing or flagging an unlawful instruction."
- Source: the duty is the second subparagraph of Article 28(3), which the Regulation ties to point (h); in the supplied text it sits in 28.3.h: "With regard to point (h) of the first subparagraph, the processor shall immediately inform the controller if, in its opinion, an instruction infringes this Regulation or other Union or Member State data protection provisions." r28's card (Article 29, 28(3)(a), 32(4)) and `sel` (`29`, `28.3.a`, `32.4`) do not cover it. r29's `sel` does (`28.3.h`), and r29's computed ISO list is where the clause titled "Infringing instruction" (8.2.4) appears, yet r29's paraphrase does not mention the duty.
- Also in r28: "documented" instructions come from 28.3.a and apply to the processor; Article 29 and 32.4 say "on instructions from the controller" for persons acting under authority. The qualifier "on important grounds of public interest" (28.3.a) is missing.
- Proposed r28 obligation: "A processor processes personal data only on documented instructions from the controller, including for transfers to a third country or an international organisation, unless Union or Member State law to which it is subject requires the processing; in that case it informs the controller of the legal requirement before processing, unless that law prohibits the information on important grounds of public interest. Controller and processor each take steps to ensure that anyone acting under their authority who has access to personal data processes them only on instructions from the controller, unless Union or Member State law requires otherwise."
- Proposed r28 note: "The Privacy Framework covers authorising processing and the workforce knowing its role. It has no outcome on processing only on the instructions of the organisation the data are processed for."
- Proposed r29 obligation: "Under the terms that Article 28(3)(e) to (h) requires in the contract, the processor assists the controller, as far as possible, with requests from individuals, and with security, breach notification, impact assessments and prior consultation. After the end of the service it deletes or returns all personal data, at the controller's choice, and deletes existing copies unless Union or Member State law requires storage. It makes available the information needed to demonstrate compliance with Article 28 and allows for and contributes to audits and inspections. It tells the controller immediately if it considers that an instruction infringes the GDPR or other Union or Member State data protection provisions."
- Proposed r29 note: "The published mapping lists among others the clauses titled "Obligations to PII principals" (8.3.1), "Return, transfer or disposal of PII" (8.4.2) and "Infringing instruction" (8.2.4). The Privacy Framework has no outcome on flagging an unlawful instruction."
- Proposed r29 gap: "partial" (the reason that made r28 partial moves here).

### E4. r30 note: the count is false, and one sentence breaks rule 3

- Text at fault: "the published mapping lists more clauses for Article 32 than for any other article, most of them in the security guidance" and "Neither framework decides what is appropriate to the risk in a given case."
- Source: `dpmp_mappings.json`, `gdpr_iso.pairs`. Distinct clauses per article: Article 5 has 37 (5.1.f alone has 24), Article 32 has 18, Article 28 has 15. Of Article 32's 18 clauses, 10 are under clause 6. The claim is true of the row, not of the article: r30 has 32 clauses (24 under clause 6), the next row has 11. The last sentence says what ISO/IEC 27701 does not contain; its text was not read.
- Proposed note: "This is the row with the most references on both sides: the published mapping lists more clauses for the provisions of this row than for any other row, most of them under clause 6, "Guidance related to ISO/IEC 27002", and all 30 subcategories of Protect-P bear on it. The row cites the subcategories nearest to the measures the article names. What is appropriate to the risk in a given case is for the controller or processor to assess under Article 32(1) and (2); the Privacy Framework does not decide it."

### E5. r05 obligation: Article 7(2) misstated

- Text at fault: "present a written request for it in a form clearly distinguishable from other matters".
- Source: 7.2: "If the data subject's consent is given in the context of a written declaration which also concerns other matters, the request for consent shall be presented in a manner which is clearly distinguishable from the other matters, in an intelligible and easily accessible form, using clear and plain language." The text does not require a written request; the rule applies only where a written declaration covers other matters too. The paraphrase also leaves out 7.3: "Prior to giving consent, the data subject shall be informed thereof." And "consent to data the contract does not need" should be consent to processing (7.4).
- Proposed obligation: "Where processing relies on consent, be able to demonstrate it. Where consent is given in a written declaration that also concerns other matters, present the request for consent so that it is clearly distinguishable from them, in an intelligible and easily accessible form and in clear and plain language. Tell individuals before they consent that they can withdraw at any time, and make withdrawal as easy as giving consent. When judging whether consent is freely given, take utmost account of whether the performance of a contract, including the provision of a service, is made conditional on consent to processing that the contract does not need. For an information society service offered directly to a child who is below the age of 16, or below the lower age a Member State sets, which may not be under 13, consent has to be given or authorised by the holder of parental responsibility, and the controller makes reasonable efforts to verify this, taking into consideration available technology."

### E6. r12 obligation: "on request" narrows Article 17(1)

- Text at fault: "Erase personal data without undue delay on request where a ground in Article 17(1) applies".
- Source: 17.1.a, opening words: "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data without undue delay where one of the following grounds applies". The duty to erase stands beside the right to ask; it is not conditional on a request. (From memory, to be checked before citing: the Court of Justice read the provision this way in C-46/23, judgment of 14 March 2024.) The example "consent is withdrawn" also drops the condition in 17.1.b, "and where there is no other legal ground for the processing".
- Proposed obligation: "Erase personal data without undue delay where a ground in Article 17(1) applies, at the individual's request or on the controller's own obligation: for example the data are no longer necessary, consent is withdrawn and no other legal ground remains, an objection succeeds or the data were processed unlawfully. The duty does not apply to the extent that an exception in Article 17(3) applies. Where the controller has made the data public, take reasonable steps, taking account of available technology and cost, to inform other controllers processing them that the individual has requested erasure of links and copies, and notify recipients under Article 19."

### E7. r02 note breaks rule 3

- Text at fault: "Both frameworks ask for purposes to be identified and recorded. Neither sets out the compatibility test of Article 6(4), so a recorded purpose shows that the question was asked, not that a new use passes it."
- Source: rule 3. The first sentence says what ISO clauses require; the second says what the standard does not contain. Neither can be known from titles. A recorded purpose also does not show that the compatibility question was asked.
- Proposed note: "The published mapping lists among others the clauses titled "Identify and document purpose" (7.2.1) and "Organization’s purposes" (8.2.2). The Privacy Framework asks for purposes to be inventoried; it does not set out the compatibility test of Article 6(4), so a recorded purpose shows what the purpose was, not that a new use is compatible with it."

### E8. r10 note breaks rule 3

- Text at fault: "Both frameworks support the mechanics: finding the data, the recipients and the source."
- Proposed note: "The published mapping lists among others the clauses titled "Providing copy of PII processed" (7.3.8) and "Handling requests" (7.3.9). The Privacy Framework supports the mechanics: finding the data, the recipients and the source. The time limit is in the row on Article 12."

### E9. r12 note breaks rule 3

- Text at fault: "The frameworks give the ability to delete and to pass the deletion on."
- Proposed note: "The published mapping lists among others the clauses titled "Access, correction and/or erasure" (7.3.6) and "PII controllers' obligations to inform third parties" (7.3.7). The Privacy Framework gives the ability to delete and to pass the deletion on. Whether a ground or an exception applies is a legal assessment each time."

### E10. r15 note breaks rule 3

- Text at fault: "The frameworks handle the request and the notice. The weighing of compelling grounds against the individual's interests is a legal test with no counterpart in either."
- Proposed note: "The published mapping lists among others the clause titled "Provide mechanism to object to PII processing" (7.3.5). The Privacy Framework handles the request and the notice; the weighing of compelling grounds against the individual's interests is a legal test with no counterpart in it."

### E11. r22 note breaks rule 3

- Text at fault: "Neither framework knows the role." and "one general clause".
- Proposed note: "The published mapping lists one clause, "Information security roles and responsibilities" (6.3.1.1). The Privacy Framework has no outcome about a representative in another jurisdiction." (See S12 for a sentence to add.)

### E12. r35 note breaks rule 3 and misdescribes the row's own references

- Text at fault: "Neither framework has a counterpart to the derogations; the references show only where a decision to transfer is authorised and recorded."
- Source: rule 3 for the first half. For the second half, the row cites CT.PO-P1 (authorising processing) and CT.PO-P2 (policies for enabling transfer, sharing or disclosure). Neither is about records; the records subcategory, CM.AW-P4, is not on the row.
- Proposed note: "The published mapping lists the same two clauses as for Articles 44 to 47, "Identify basis for PII transfer between jurisdictions" (7.5.1) and "Basis for PII transfer between jurisdictions" (8.5.1). The Privacy Framework has no counterpart to the derogations; the two references show only where a decision to transfer is authorised and governed by procedure."

### E13. Page copy: a "via ISO clause" tag is not a published mapping making the same link

- Text at fault (How to read, item 3): ""NIST-hosted crosswalk" and "via ISO clause" mean a published mapping makes the same link." And (intro): "Every reference shows where it comes from: a published mapping, or this site's own reading."
- Source: rule 2. Tag C means only that one ISO clause appears both in the row's computed list and in the project's Privacy Framework sheet for that subcategory. No published mapping pairs the subcategory with the GDPR provision; the link is inferred by chaining two mappings. The inference can be loose: r28 GV.PO-P4 is tagged C through "Addressing security within supplier agreements" (6.12.1.2), a clause the mapping lists for six rows; r31 GV.MT-P6 (lessons learned) is tagged C through 6.13.1.5. Also, every NIST reference is the site's pick (the method section says so); none "comes from" a mapping.
- Proposed item 3: "<strong>Check what supports each NIST reference.</strong> Every NIST reference is this site's selection. "NIST-hosted crosswalk" means the GDPR crosswalk hosted by NIST pairs the same subcategory with a provision of the row. "Via ISO clause" is weaker: the Data Protection Mapping Project lists at least one ISO/IEC 27701 clause both for a provision of the row and for the subcategory, so the link is inferred through the shared clause and no published mapping states it. "Site's reading" means neither of these two routes supports the reference, so weigh it accordingly."
- Proposed intro sentence: "Every ISO reference comes from a published mapping. Every NIST reference is this site's selection and shows whether a published mapping supports it."

### E14. Page copy: "renumbered every control" goes beyond the verified facts (twice)

- Text at fault (intro): "ISO replaced it with ISO/IEC 27701:2025 in October 2025, and the new edition renumbered every control." (Method): "was published in October 2025 as a stand-alone management system standard and renumbered every control."
- Source: the verified facts are edition 2, October 2025, stand-alone, 2019 edition withdrawn, and a table of contents that lists Annex D and Annex F. Nobody read the 2025 text, so "every control" is not established, and the iso.org page the bullet links to does not say it.
- Proposed intro: "That edition is withdrawn: ISO replaced it with ISO/IEC 27701:2025 in October 2025. The new edition is a stand-alone standard, and its table of contents lists a table of correspondence with the 2019 edition (Annex F)."
- Proposed method: "ISO/IEC 27701:2025, the second edition, was published in October 2025 as a stand-alone management system standard. Its table of contents lists its own mapping to the GDPR (Annex D) and a table of correspondence with the 2019 edition (Annex F); both are part of the paid standard and were not used here, so this page makes no statement about how the clause numbers changed."

## Should fix

### S1. r01: one step is not in the selected provisions; one claim about the Privacy Framework is too strong

- Obligation: "Settle the basis for each purpose before processing starts" is not in 5.1.a or 6.1 to 6.3. It follows from 13.1.c (the legal basis has to be stated at collection) and from 5.2. Proposed: "Identify the basis for each purpose; it has to be known by the time the individual is informed under Articles 13 and 14. A basis in a legal obligation or a public task has to be laid down by Union or Member State law to which the controller is subject."
- Note: "it names no legal bases". CT.PO-P1 gives "individual consent" as an example of an authorisation. Proposed: "The Privacy Framework asks for processing to be authorised, with consent as one example, and for legal requirements to be understood; it sets out no list of legal bases."

### S2. r02 obligation: qualifier dropped

- "Where a new purpose rests neither on consent nor on a law" omits the limit in 6.4.a: "a Union or Member State law which constitutes a necessary and proportionate measure in a democratic society to safeguard the objectives referred to in Article 23(1)". The list of factors is also open ("inter alia").
- Proposed second sentence: "Where a new purpose rests neither on consent nor on a Union or Member State law that safeguards an objective listed in Article 23(1), assess compatibility taking into account, among other things, the factors in Article 6(4): the link between the purposes, the context of collection, the nature of the data, the consequences for individuals and the safeguards."

### S3. r03 note: "the same ground" implies what the ISO clauses cover

- Proposed: "The Privacy Framework addresses minimisation and storage limitation through disassociated processing and destruction according to policy."

### S4. r07 note: characterises ISO/IEC 27701 and edges towards a legal conclusion

- Text: "This is the obligation a management framework serves most directly: both are ways of organising and evidencing the measures. Evidence of a working framework supports the demonstration Article 5(2) asks for".
- Proposed: "This is the obligation closest to what a management framework is for. Records produced under the Privacy Framework can serve as evidence when demonstrating accountability under Article 5(2); they do not replace the measures each of the other rows requires. The published mapping lists among others the clauses titled "Policies for information security" (6.2.1.1) and "Records related to processing PII" (7.2.8)."

### S5. r08 obligation: three duties missing, one permission turned into a duty, one condition dropped

- 12.3: "The controller shall inform the data subject of any such extension within one month of receipt of the request, together with the reasons for the delay." Missing.
- 12.4: where no action is taken, inform "without delay and at the latest within one month" of the reasons and of the right to complain and to seek a judicial remedy. Missing.
- 12.6: "the controller may request the provision of additional information". The paraphrase's imperative "ask for the information" reads as a duty.
- 11.2 applies only "in cases referred to in paragraph 1" (the purposes do not require identification) and adds a duty: "the controller shall inform the data subject accordingly, if possible".
- Proposed obligation: "Give information and communications to individuals in a concise, transparent, intelligible and easily accessible form, in clear and plain language, and make it easy for them to exercise their rights. Tell the individual what was done about a request without undue delay and within one month; the period can be extended by two further months where the complexity and number of requests make that necessary, if the individual is told of the extension and its reasons within the first month. If no action is taken, say why within one month and point to the right to complain and to go to court. Requests are handled free of charge unless manifestly unfounded or excessive, which the controller has to show; then a reasonable fee or a refusal is allowed. Where there are reasonable doubts about identity, the controller may ask for the information needed to confirm it. Where the purposes do not require identifying individuals and the controller can show that it cannot identify the person, it says so if possible, and Articles 15 to 20 do not apply unless the individual supplies information that enables identification."

### S6. r09: timing and content incomplete; one claim about the Privacy Framework too strong

- Timing: "otherwise within a reasonable period and at most one month" leaves out 14.3.b ("at the latest at the time of the first communication to that data subject") and 14.3.c ("at the latest when the personal data are first disclosed"), which can fall earlier.
- Content: the list reads as complete but omits the data protection officer's contact details (13.1.b), the legitimate interests pursued (13.1.d), the right to withdraw consent (13.2.c) and the "meaningful information about the logic involved" (13.2.f).
- Proposed obligation: "Tell individuals who the controller is and how to reach it and the data protection officer, the purposes and legal basis, the legitimate interests relied on, the recipients, any transfers and their safeguards, the retention period, their rights including withdrawal of consent, the right to complain, and whether automated decision-making takes place, with meaningful information about its logic and consequences. Do this at collection when the data come from the individual; otherwise within a reasonable period and at most one month, and no later than the first communication with the individual or the first disclosure to another recipient. Say whether providing the data is required when collecting directly, and name the source and the categories of data when collecting from elsewhere. Inform individuals again before processing for a new purpose. No information is due where the individual already has it; Article 14(5) lists further exceptions for data obtained from elsewhere."
- Note: "without fixing their content" is too strong, because CM.AW-P1 and CM.PO-P1 name "data processing purposes, practices, and associated privacy risks". Proposed: "The Privacy Framework asks for notices and transparency policies on purposes, practices and risks; the detailed list of items is in Articles 13 and 14."

### S7. r10 obligation: fee for further copies

- 15.3: "For any further copies requested by the data subject, the controller may charge a reasonable fee based on administrative costs." Proposed second sentence: "Provide a copy of the data, the first one free of charge and further copies for a reasonable fee at most, in a commonly used electronic form when the request is made electronically unless the individual asks otherwise, without adversely affecting the rights and freedoms of others."

### S8. r18 note: one-sided

- Text: "The inventory subcategories of the Privacy Framework ask for more detail than Article 30 does, for example data actions and data elements per system."
- Source: 30.1.a (names and contact details), 30.1.f (time limits for erasure) and 30.1.g (description of security measures) have no counterpart among ID.IM-P1 to P8.
- Proposed: "The inventory subcategories of the Privacy Framework ask for more detail than Article 30 in some respects, for example data actions and data elements per system, and for less in others: none asks for erasure time limits, contact details or a description of security measures in the inventory."

### S9. r19 obligation: Article 35(11) misdescribed, Article 35(3) missing

- "review the assessment when the risk changes": 35.11 requires "a review to assess if processing is performed in accordance with the data protection impact assessment at least when there is a change of the risk".
- 35.3 names three cases in which the assessment is "in particular" required; 35.4 adds the supervisory authority's list.
- Proposed obligation: "Before processing that is likely to result in a high risk to individuals, in particular with new technologies, assess its impact: describe the processing and its purposes, assess necessity and proportionality, assess the risks to individuals and set out the measures that address them. The assessment is required in particular in the three cases of Article 35(3) and for processing on the supervisory authority's list. Seek the advice of the data protection officer, where one is designated, and, where appropriate, the views of individuals. Where necessary, and at least when the risk changes, review whether the processing still matches the assessment."

### S10. r21: the card lists Article 39 but the paraphrase does not cover it; two duties missing

- Article 39 (tasks) has no sentence. 38.6 is missing: "The controller or processor shall ensure that any such tasks and duties do not result in a conflict of interests." 37.4 is missing: designation where "required by Union or Member State law". 37.1.a excepts "courts acting in their judicial capacity".
- Proposed obligation: "Designate a data protection officer where a public authority or body carries out the processing, where core activities consist of regular and systematic monitoring of individuals on a large scale or of large-scale processing of special category or criminal conviction data, or where Union or Member State law requires it. Choose the officer for expert knowledge, publish the contact details and give them to the supervisory authority, involve the officer properly and in good time in all data protection matters, and provide resources. Give no instructions on the tasks, do not dismiss or penalise the officer for performing them, have the officer report to the highest management level, and make sure other duties cause no conflict of interests. The officer's tasks are at least to inform and advise, to monitor compliance, to advise on impact assessments, and to cooperate with the supervisory authority and act as its contact point."

### S11. Gap marks are applied unevenly

- The page defines a gap mark as flagging "duties that exist only in the GDPR, such as time limits, required contract terms". By that test:
  - r19 has gap "" while its own note says "Article 35 adds a trigger, required contents and a link to prior consultation".
  - r33 has gap "" while r31 is "partial" for the same kind of reason; the high-risk threshold, the content of the communication and the three exemptions come from Article 34 alone.
  - r15 has gap "" while its note says the weighing test has "no counterpart"; the duty to present the right "clearly and separately" at the first communication (21.4) has none either.
- Proposed: set r19, r33 and r15 to "partial". For r33 add the note: "The Privacy Framework has affected individuals notified and mitigation offered; the high-risk threshold, the content of the communication and the exemptions come from Article 34." r10 and r12 are closer calls of the same kind (see C6).

### S12. r20, r22, r23: "No NIST equivalent" without saying that the NIST-hosted crosswalk lists subcategories for these articles

- Source: `enterprivacy_pf_gdpr` pairs Article 36 with ID.IM-P5, ID.IM-P6, ID.IM-P7, ID.IM-P8 and CM.AW-P2; Article 27 with GV.PO-P3, GV.AT-P1, GV.AT-P2, GV.AT-P3, GV.MT-P2 and CM.PO-P2; Article 31 with CM.AW-P2. Having read all of these subcategories, I agree that none addresses the duty itself, but a reader who opens the hosted crosswalk will see a contradiction the page does not explain.
- Proposed sentence to add to each of the three notes: "The NIST-hosted GDPR crosswalk does pair this article with subcategories on inventory, roles or feedback; this site reads none of them as addressing the duty itself."

### S13. Weak NIST references

- r15 CT.PO-P1 (tag S): the subcategory is about "authorizing data processing (e.g., organizational decisions, individual consent), revoking authorizations". An objection under Article 21 concerns processing that does not rest on the individual's authorisation. The hosted crosswalk pairs Article 21 with CT.PO-P2 and CT.PO-P3 instead. Proposed: remove CT.PO-P1 from r15, or keep it and add to the note: "CT.PO-P1 is cited for the controller's own decision to stop, not for the objection."
- r31 GV.MT-P6 (tag C only, through 6.13.1.5): "incorporate lessons learned from problematic data actions" does not address notification or documentation under Article 33. Proposed: remove it from r31.

### S14. r21, r25: "the security guidance" is a description, not a title

- Clause 6 is titled "Guidance related to ISO/IEC 27002" in `iso27701_2019.json`.
- Proposed r21: "The published mapping lists three clauses, all under clause 6, "Guidance related to ISO/IEC 27002": ..." Proposed r25: "The published mapping lists two clauses under clause 6, "Guidance related to ISO/IEC 27002": "Addressing security within supplier agreements" (6.12.1.2) and "Identification of applicable legislation and contractual requirements" (6.15.1.1)."

### S15. Three paraphrase statements rest on text that the supplied GDPR copy does not contain

- `gdpr_text_dpmp.json` has no Article 36(2) or 36(4), no 28(7) or 28(8), no 35(6), no second subparagraph of Article 49(1), and its 8.1 ends at "holder of parental responsibility over the child." without the sentence on a lower age.
- Affected: r05 "or the lower age a Member State sets, not below 13"; r20 "it gives written advice within eight weeks, extendable by six"; r35 "The last-resort ground of compelling legitimate interests ... informs the supervisory authority and the individuals".
- All three match the Regulation as I know it, but I could not confirm them from the files (EUR-Lex returned only its page header here). r35 leaves out one condition of that subparagraph: the interests must not be overridden by the interests or rights and freedoms of the individual. Proposed r35 wording: "The last-resort ground of compelling legitimate interests that the individual's interests and rights do not override covers only a transfer that is not repetitive and concerns a limited number of individuals, after an assessment and with suitable safeguards; the controller informs the supervisory authority and the individuals and documents the assessment and the safeguards in the Article 30 record."
- Proposed: check these three sentences directly on EUR-Lex, and in the method section replace "article titles and text from EUR-Lex" with "article titles from EUR-Lex; the paraphrases were checked against the text of the Regulation".

### S16. Page copy: "The obligation is the law."

- The obligation text is the site's paraphrase, as the caveat says. Proposed: "The obligation paraphrases a binding rule of law. The references are voluntary: they are where a framework gives you something to build or something to show."

### S17. Page copy: ""Site's reading" means no published mapping does"

- Only two mappings were tested. The replacement in E13 covers this ("neither of these two routes").

### S18. Page copy, item 4: two overstatements

- Text: "Treat a gap mark as work the frameworks leave to you. "NIST: partial match" and "No NIST equivalent" flag duties that exist only in the GDPR".
- The gap mark is a reading of the Privacy Framework only (the ISO side carries no judgement), and "exist only in the GDPR" is not what the mark shows.
- Proposed: "<strong>Treat a gap mark as work the Privacy Framework leaves to you.</strong> "NIST: partial match" and "No NIST equivalent" flag duties that the Privacy Framework does not contain or contains only in part, such as time limits, required contract terms or consulting the supervisory authority. The mark says nothing about ISO/IEC 27701."

### S19. Page copy: the three counts read as a partition but overlap

- Text: "Of the @@N_REFS@@ references, @@N_G@@ are also pairs in the NIST-hosted GDPR crosswalk, @@N_C@@ are reached through a shared ISO/IEC 27701 clause ..., and @@N_S@@ rest on this site's reading alone."
- Data: 130 references; G 95, C 82, S 28; 75 carry both tags, so 95 + 82 + 28 = 205.
- Proposed: "Of the @@N_REFS@@ references, @@N_G@@ are also pairs in the NIST-hosted GDPR crosswalk and @@N_C@@ share an ISO/IEC 27701 clause with the row in the Data Protection Mapping Project; @@N_GC@@ have both. @@N_S@@ have neither and rest on this site's reading alone." (New placeholder @@N_GC@@.)

### S20. Page copy: "exactly as the Data Protection Mapping Project publishes them"

- Source: `iso27701_2019.json`, `source`: "One title corrected: the sheet prints 7.4.4 as 'PII minimization objectivesves'." Proposed: "as the Data Protection Mapping Project publishes them, with one typing error in a title corrected."

### S21. Page copy: the matching of the project's Privacy Framework sheet is described incompletely

- Text: "its rows are matched to Version 1.0 where the subcategory text is identical, and by identifier where NIST reworded the text."
- Data: 83 rows matched by text, 14 by identifier, 2 not matched at all (printed GV.PP-P1 and CT.DP-P6), and three Version 1.0 subcategories have no row (GV.PO-P1, CT.DM-P9, CT.DM-P10), so they can never receive the "via ISO clause" tag. GV.PO-P1 and CT.DM-P10 are used on four rows (r02, r03, r07, r16).
- Proposed addition: "Two rows of the sheet have no counterpart in Version 1.0 and are left out, and three Version 1.0 subcategories (GV.PO-P1, CT.DM-P9, CT.DM-P10) have no row in the sheet, so they cannot be reached through an ISO clause."
- The `source` string of `pf_iso` in `dpmp_mappings.json` still says "matched here to Version 1.0 only where the subcategory text is identical"; correct it to match.

### S22. Page copy: the second NIST-hosted crosswalk is named but its use is not explained; "neither is reproduced"

- Only the GDPR crosswalk feeds a tag. The data shows the ISO crosswalk is used as a comparison (same clause list as the project for 95 of 97 matched subcategories; CT.DM-P5 and PR.DS-P5 differ). Say so, or drop the mention.
- "Neither file states a licence, so neither is reproduced" sits beside tags that reproduce the fact of individual pairs. Proposed: "Neither file states a licence, so neither is reproduced: the page shows only whether a pair chosen by this site also appears in the GDPR crosswalk. The ISO/IEC 27701 crosswalk was used as a check on the Data Protection Mapping Project's Privacy Framework sheet and is not shown."

### S23. Page copy: "checked by a separate review against the sources"

- The ISO/IEC 27701 text was not available to the review either, and this review found errors. Proposed, once the errors are fixed: "Mapping written on 16 November 2026 and checked by a separate review against the GDPR text, the Privacy Framework Core and the published mappings. The text of ISO/IEC 27701 was not available to either."

### S24. Page copy: denominator of "@@ISO_USED@@ of @@ISO_TOTAL@@ ISO/IEC 27701:2019 clauses linked"

- `iso27701_2019.json` has 259 items of which 71 are headings and 188 are leaf clauses; all 86 linked clauses are leaves. Make sure @@ISO_TOTAL@@ is 188, or say "of 259 clauses and headings". Note also that 86 is every clause that appears in the extracted GDPR sheet, so the figure measures the published mapping, not this page's coverage.

### S25. r13 obligation: one condition dropped

- "where the individual needs the data for legal claims": 18.1.c applies where "the controller no longer needs the personal data for the purposes of the processing, but they are required by the data subject" for legal claims. Proposed: "or where the controller no longer needs the data but the individual needs them for legal claims".

### S26. r06 note: exact titles

- "lists only the lawful basis and consent clauses (7.2.2, 7.2.4)" paraphrases the titles. Proposed: "The published mapping lists only the clauses titled "Identify lawful basis" (7.2.2) and "Obtain and record consent" (7.2.4)."

## Consider

- C1. r02: the paraphrase leaves out the second half of 5.1.b (further processing for archiving, research or statistics under Article 89(1) is not incompatible), although r03 includes the parallel carve-out for storage. Add: "Further processing for archiving in the public interest, research or statistics under Article 89(1) is not incompatible."
- C2. r04: CT.DM-P4 ("Data elements can be accessed for deletion") fits "erased"; it would be tagged G, C (hosted crosswalk Article 5(1)(d); shared clause 7.3.6).
- C3. r06: ID.IM-P6 (tag S) shows only that data elements are inventoried. It is defensible as the way to know that special category data are present; say that in the note or drop it.
- C4. r10: CT.DM-P2 ("Data elements can be accessed for transmission or disclosure") is the nearest subcategory to providing a copy and is missing; it would be tagged G, C (Article 15(3); shared clause 8.3.1).
- C5. r17: PR.PT-P2 (least functionality) is close to "by default"; it would be tagged G, C (Article 25(2); shared clause 7.4.2).
- C6. r10 and r12 keep gap "" although the list of items in 15.1 and the grounds and exceptions of Article 17 are GDPR-only, the reason given for "partial" on r09. Either mark them "partial" or define the mark more narrowly on the page.
- C7. r15: "unless compelling legitimate grounds override" drops that the controller has to demonstrate them (21.1). 21.6 (objection to research and statistics) and, in r14, 20.3 (no portability for public-task processing) are not mentioned.
- C8. r18: ID.IM-P2 (owners, operators and their roles) matches 30.1.a and 30.2.a and would be tagged G, C. The duty also falls on the controller's or processor's representative (30.1, 30.2, 30.4).
- C9. r26: `gdpr_iso.pairs["28.3"]` is empty, so the selector `=28.3` contributes nothing and the row's two clauses come from 28(9) alone. The result is the same, but the note's "the published mapping lists" then describes the mapping for the paragraph on written form.
- C10. r29: ID.DE-P5 and GV.AT-P4 are written from the side of the organisation that assesses or instructs a third party, while the row states the processor's duties. Say in the note that they are the mirror image.
- C11. r30: PR.PT-P4 (resilience mechanisms) answers "resilience" in 32.1.b and CT.DM-P9 (technical measures tested and assessed) answers 32.1.d more directly than PR.PO-P10; both would be tagged G with no shared clause. The last sentence states a contract term (28.3.b) as a direct duty and omits the alternative "or are under an appropriate statutory obligation of confidentiality".
- C12. r31: "would amend Article 33" goes beyond the verified fact (procedure 2025/0360/COD ongoing). If the proposal touches other articles on the page, a note on r31 alone is uneven; a single sentence in the method section may be enough. 33.4 (information in phases) is not mentioned.
- C13. r34: "binding corporate rules" should read "approved binding corporate rules" (47.1). The second sentence reads as if adequacy and safeguards were the only routes; add "The derogations of Article 49 are a separate row."
- C14. Rule 2 itself is generous: a reference with no paragraph matches any selector of the article (r02 GV.PO-P1 is tagged G through "Art. 6: Lawfulness of Processing"), and a parent matches a child. The method bullet says "for an article of the row", which is accurate; "for an article or provision of the row" would be closer to the rule.
- C15. Check E, identifier matches: all 14 clause lists are identical to the lists the NIST-hosted ISO/IEC 27701 crosswalk gives for the same Version 1.0 identifier, so no identifier looks wrong. Two clause lists are an odd fit for the final text and come from the published mapping itself: CT.DM-P7 (processing permissions transmitted with data) is listed against disposal and retention clauses (6.5.3.2, 6.8.2.7, 7.4.6, 7.4.7, 7.4.8, 8.4.1, 8.4.2), and CT.DP-P3 (limiting inferences) against "Infringing instruction" (8.2.4). Neither produces a tag on any row.
- C16. Page copy, smaller points:
  - "restrictions under national law (Article 23)": Article 23 covers Union law too. Use "restrictions under Union or Member State law".
  - "the supervisory authorities, remedies, penalties and specific processing situations (Articles 50 to 99)" omits international cooperation, the consistency mechanism and the final provisions; add "among others".
  - "NIST publications are in the public domain": more exact is "not subject to copyright in the United States".
  - "(NIST CSWP 01162020)" and "will be re-keyed with NIST's own mapping from 1.0 to 1.1" are outside the verified facts; the second promises a NIST mapping that may not exist. Use "if NIST publishes one".
  - "it states that its GDPR data builds on the mapping between the standard and the GDPR that already existed" is unclear (which mapping?) and cannot be checked from the files.
  - "NIST hosts contributions without endorsing them, and warns that ..." is outside the verified facts; keep only if the wording was read on the NIST page.
  - "Nothing is stored and nothing is sent" is a claim about the whole page, which also loads a service worker script; "The crosswalk stores nothing and sends nothing" is safer.
  - The link label "ISO/IEC 27701" leads to the 2025 edition on iso.org, inside a bullet about the 2019 numbering; label it "ISO/IEC 27701:2025 on iso.org".
  - "The text of the standard is copyright and is not reproduced" sits beside 259 reproduced titles; add "apart from clause titles, which come from the Data Protection Mapping Project".
  - The sentence "It moves to the 2025 numbering when a checked source for it is available" appears twice.
  - "Beside it stand the NIST Privacy Framework 1.0 subcategories that address it": on rows marked partial they address it in part; "that this site reads as addressing it, fully or in part".
- C17. Defects in the supplied GDPR copy that do not affect any paraphrase: 14.5.d ends with a page footer ("4.5.2016 L 119/42 Official Journal of the European Union EN"); 9.2.d begins "aragraph 1"; 5.1.e lacks its "(e)"; 12.3 reads "by electronic form means"; 40.11 and 42.5 begin "TThe" and "AA"; 49.2 lacks its prefix.

## Checked and found correct

- Rule 1: 36 of 36 ISO lists recomputed from `gdpr_iso.pairs` and `sel` are identical to `built_data.json`, including order. 86 distinct clauses, all present in `iso27701_2019.json`, all leaf clauses.
- Rule 2: 130 of 130 NIST references carry the tags my script produces when the paragraph strings are read as extracted (G 95, C 82, S 28; both 75, G only 20, C only 7). `nist_hosted_support.json` agrees with the G tags on all 36 rows. Read from the labels, 123 of 130 agree (E1).
- Rule 4: 36 of 36 rows (gap "none" exactly on r20, r22, r23, the three rows with no NIST reference).
- Quoted ISO titles: 31 quotations in 17 notes, all exact, all with the right number where one is given, all in the row's own ISO list. The unquoted numbers in r06 and r27 are also in the row lists.
- Obligation paraphrases: 36 read against the provisions in `sel`. 23 have no error or should-fix finding (r03, r04, r06, r07, r11, r14 to r18, r20, r22 to r27, r30 to r34, r36); 13 have one (r01, r02, r05, r08, r09, r10, r12, r13, r19, r21, r28, r29, r35). r05, r20 and r35 also depend on S15. Numbers checked: six legal bases, one month plus two, 72 hours, 250 employees, eight weeks plus six, ages 16 and 13.
- Cards and `sel`: 35 of 36 rows cover the same provisions as the paraphrase (exception r28, E3); r21 lists an article the paraphrase does not cover (S10). Roles: 35 of 36 correct (exception r28, E2).
- NIST references: 130 read against the subcategory text; 126 address the obligation, 2 are weak (S13), 2 are mirror images (C10). Of the 28 tagged S, 26 are sound, 1 is weak (r15 CT.PO-P1) and 1 is mis-tagged (r26 GV.PO-P4, E1).
- Claims about the Privacy Framework in notes: every "no outcome on" statement was checked by keyword search over all 100 subcategories and the 18 category texts (child, parent, regulator, authority, time limit, fee, plain language, human intervention, contest, representative, restriction, jurisdiction, instruction, independence, dismissal). All hold except the two reworded in S1 and S6. Protect-P has 30 subcategories, as r30 says.
- Published-mapping figures: 483 pairs and 95 mapped subcategories in the hosted GDPR crosswalk; 95 same and 2 different clause lists between the project and the hosted ISO crosswalk; 83, 14 and 2 match types. All confirmed.
- Identifier matches: 14 of 14 supported by the hosted Version 1.0 crosswalk (C15).
- Style: no em dashes or en dashes in `rows.py` or `page_template.html`; no American spelling in the site's own copy; no employer or internal names (Microsoft and Enterprivacy appear only as source attributions); no "compliant" or "satisfies" claims apart from the soft wording in S4. Nothing on the page suggests that 2025 numbering or text is used; the only problem on that front is E14.
- Coverage: every article in 5 to 22, 24 to 39 and 44 to 49 is on at least one card. All eight points of Article 28(3) are covered across r26 to r30. Provisions not selected by any row are 28(5), 28(6), 28(10) and 32(3), which create options, not duties. Article 19 is on three cards (r11, r12, r13), which is reasonable. Duties missing inside covered articles are listed above: 12(3) extension notice and 12(4) (S5), 14(3)(b) and (c) (S6), 35(3) (S9), 38(6) and Article 39 (S10), 7(3) information before consent (E5).
