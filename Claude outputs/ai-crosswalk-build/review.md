# Crosswalk review: rows.py (26 rows)

Reviewed 3 October 2026 against ai_act_digest.json (takeaways as amended by Regulation (EU) 2026/1744), nist_ai_rmf.json, iso42001.json and its NIST-hosted crosswalk rows, plus web checks for the harmonised-standards claims. Every ISO, NIST and article id in rows.py resolves in the data files; no broken references.

Severity: **Error** = wrong or out of date, fix before publishing. **Should fix** = incomplete in a way that changes the legal meaning, or a mapping that does not support the obligation. **Consider** = improvement.

---

## Errors

### E1. r12 (and page_template.html): prEN 18286 is no longer "being drafted"
- **Problem:** The note says "the quality management standard being drafted for that purpose is prEN 18286". EN 18286:2026 was approved by CEN-CENELEC on 12 July 2026 and published on 22 July 2026. It has not yet been cited in the Official Journal, so it gives no presumption of conformity yet. The page template's "Method and sources" paragraph repeats the outdated wording ("prEN 18286, the quality management standard being drafted") and its only source is a CSA research note dated 28 April 2026, which was written before publication.
- **Evidence:** The digest's own corpus doc-28 (JTC 21 news, 9 July 2026) says "publication of EN 18286 was expected in July 2026". CEN-CENELEC news of 30 July 2026, "EN 18286 in the Spotlight", calls it the first published European standard for the AI Act. Modulos says "approved by CEN/CENELEC on 12 July 2026 ... as of July 2026 it has not yet been cited". krogrules.com (Edition 16, September 2026) says it "had not been published [in the OJ] as of 15 September 2026". aigovernancecheck.co.uk (checked 2 October 2026) says "At the start of October 2026 the reference had still not appeared in the Official Journal". The claim "ISO/IEC 42001 is not cited as a harmonised standard" is correct.
- **Replacement (r12 note):**
  > The widest overlap on the page: an AI management system covers much of the organisational frame of Article 17. Product-specific points such as conformity procedures, standards applied and communication with notified bodies are not covered. ISO/IEC 42001 is not cited as a harmonised standard under the AI Act, so certifying against it gives no presumption of conformity. EN 18286:2026, the quality management standard written for Article 17, was published in July 2026 but gives a presumption of conformity only once its reference is cited in the Official Journal, which had not happened by early October 2026. Check the Official Journal for cited harmonised standards.
- **Replacement (page_template.html, Harmonised standards item):**
  > Harmonised standards. ISO/IEC 42001 is not a harmonised standard under the AI Act, so certification is not a presumption of conformity. EN 18286:2026, the quality management standard for Article 17, was published in July 2026 and gives a presumption of conformity only once cited in the Official Journal.
  Also replace or supplement the April 2026 CSA link with the CEN-CENELEC news item (https://www.cencenelec.eu/news-events/news/2026/en-in-the-spotlight/2026-07-30-ai-quality-management/).

### E2. r22: the GDPR note contradicts Article 86(3)
- **Problem:** The note says "Article 22 GDPR applies alongside where the decision is solely automated." Article 86(3) makes the AI Act right residual: it applies only to the extent the right is not otherwise provided for under Union law. Where the GDPR already gives an explanation right (Article 15(1)(h) with Article 22 for solely automated decisions), the GDPR right applies and Article 86 does not. The two rights are not cumulative.
- **Evidence:** art-86 takeaway: "applies only to the extent the right is not otherwise provided for under Union law (paragraph 3)".
- **Replacement (note):**
  > Article 86 applies only where Union law does not already give the right (paragraph 3). For solely automated decisions under Article 22 GDPR, the explanation right in Article 15(1)(h) GDPR comes first, and Article 86 covers the remaining cases, such as decisions where a human is involved.

---

## Should fix

### S1. r22: the obligation is broader than Article 86
- **Problem:** The paraphrase leaves out the limits of the right: decisions based on the output of an Annex III high-risk system (other than point 2), and an adverse impact on health, safety or fundamental rights as the person sees it.
- **Evidence:** art-86 takeaway, paragraph 1.
- **Replacement (obligation):**
  > Where a decision based on the output of an Annex III high-risk system (other than critical infrastructure) has legal or similarly significant effects that the affected person considers adverse to their health, safety or fundamental rights, give that person, on request, a clear and meaningful explanation of the role the system played and of the main elements of the decision.

### S2. r15: the shorter Article 73 deadlines are incomplete
- **Problem:** "shorter for deaths and widespread infringements" leaves out the two-day deadline for a serious and irreversible disruption of critical infrastructure (Article 3(49)(b)). It also leaves out that the report goes to the authority of the Member State where the incident occurred.
- **Evidence:** art-73 takeaway: "no later than 15 days after awareness (paragraph 2), shortened to two days for widespread infringements or Article 3(49)(b) incidents (paragraph 3) and ten days for a death (paragraph 4)".
- **Replacement (obligation):**
  > Take corrective action on non-conforming systems and inform the operators concerned; report serious incidents to the market surveillance authority of the Member State where they occurred, immediately once a causal link is established or reasonably likely and at the latest 15 days after becoming aware, two days for a widespread infringement or a serious disruption of critical infrastructure, and ten days for a death.

### S3. r08 and r18: the six-month log retention is stated without its conditions
- **Problem:** Articles 19(1) and 26(6) set a period "appropriate to the intended purpose" of at least six months, unless Union or national law, in particular data protection law, provides otherwise. As written, a reader could take six months as a fixed rule that overrides the GDPR. The r08 note also implies six months is the target, when it is only the minimum.
- **Evidence:** art-19 takeaway: "for a period appropriate to the intended purpose and at least six months unless Union or national law, in particular data protection law, provides otherwise".
- **Replacement (r08 obligation, final clause):**
  > ... and keep the logs under your control for a period appropriate to the intended purpose, at least six months unless Union or national law, in particular data protection law, provides otherwise.
- **Replacement (r08 note):**
  > The six-month minimum is an AI Act figure; neither framework sets one. It is a floor, and data protection law can shorten or lengthen it.
- **Replacement (r18 obligation, final clause):**
  > ... and keep the logs under your control for a period appropriate to the intended purpose, at least six months unless other Union or national law, in particular data protection law, provides otherwise (Article 26(5) and (6)).

### S4. r03: the Annex I route is missing its condition
- **Problem:** "Annex I products" leaves out the requirement that the product, or the product whose safety component the system is, must need third-party conformity assessment. Profiling of natural persons, which always stays high-risk and so blocks the 6(3) exception, is also missing.
- **Evidence:** art-6 takeaway, paragraphs 1 and 3.
- **Replacement (obligation):**
  > Classify each system against the two high-risk routes: safety components of, or products under, Annex I legislation that require third-party conformity assessment, and the Annex III use cases. Where you rely on the Article 6(3) exception, which is never available for profiling of natural persons, document the assessment before placing the system on the market and register it (Article 6(4), Article 49(2)).

### S5. r04: the substantial-modification condition is missing, and so is Article 25(2)
- **Problem:** Under Article 25(1)(b), a substantial modification makes you the provider only if the system remains high-risk. As written, any substantial modification seems to trigger the role switch. The paraphrase also leaves out the amended Article 25(2) duties of the initial provider, which the omnibus brought into the Article 99(4) fine tier.
- **Evidence:** art-25 takeaway (paragraphs 1, 2 and 4); art-99 omnibus note on new point (da).
- **Replacement (obligation):**
  > Know when you become the provider: putting your name on a high-risk system, modifying a high-risk system substantially so that it remains high-risk, or changing a system's intended purpose so that it becomes high-risk. The initial provider must then supply technical documentation, known limitations and failure modes and technical access. Agree in writing what suppliers of tools, components and models provide.
- **Mapping (Consider):** add ISO `4.1`. Clause 4.1 of ISO/IEC 42001 requires the organisation to determine its roles with respect to AI systems, which is the closest anchor for this row. It is also the crosswalk pairing for MAP 4.1. Set `gap="partial"`, since the note already says the role switch has no equivalent.

### S6. r20: the "do not use if unregistered" rule is missing
- **Problem:** Article 26(8) also requires a public-authority deployer that finds the system is not registered in the EU database to not use it and to inform the provider or distributor. Registration under Article 49(3) also excludes Annex III point 2.
- **Evidence:** art-26 takeaway (paragraph 8); art-49 takeaway (paragraphs 3 and 5).
- **Replacement (obligation):**
  > Public authorities and Union bodies register themselves and their use of an Annex III system (other than critical infrastructure) in the EU database before use, and do not use a system that the provider has not registered, informing the provider or distributor instead (Article 26(8), Article 49(3)).

### S7. r21: who the FRIA applies to is left vague, and mitigation is missing
- **Problem:** "Where Article 27 applies" leaves the reader to find the scope, which is the most-asked question about the FRIA. The content list also leaves out the measures to take if the risks materialise.
- **Evidence:** art-27 takeaway (paragraph 1, and the listed content including "the mitigation and complaint arrangements").
- **Replacement (obligation):**
  > Bodies governed by public law, private operators providing public services, and deployers of Annex III credit scoring and life and health insurance pricing systems carry out a fundamental rights impact assessment before first use of an Annex III system (other than critical infrastructure). It covers the process, period and frequency of use, the people affected, the risks of harm, the oversight measures, and the measures if risks materialise, including governance and complaint arrangements. Notify the market surveillance authority of the results and update the assessment when elements change.
- **Mapping (Consider):** add NIST `MEASURE 3.3` ("Feedback processes for end users and impacted communities to report problems and appeal system outcomes"), which matches the complaint arrangements directly.

### S8. r23: the paraphrase drops the limits on the obligation
- **Problem:** Article 50(1) does not apply where it is obvious to the person that they are dealing with AI, and Article 50(2) applies "as far as technically feasible". The note also misses two things a practitioner needs: the Article 111(4) transition to 2 December 2026 for generators already on the market, and the transparency Code of Practice, which the Commission assessed as adequate on 8 July 2026.
- **Evidence:** art-50 takeaway; art-111 takeaway (paragraph 4); corpus doc-17 and doc-18.
- **Replacement (obligation):**
  > Design systems that interact with people so that they know they are dealing with AI, unless that is obvious, and mark synthetic audio, image, video and text output in a machine-readable, detectable way as far as technically feasible (Article 50(1) and (2)).
- **Replacement (note):**
  > Providers of generators already on the market before 2 August 2026 have until 2 December 2026 to meet Article 50(2) (Article 111(4)). The Commission has assessed the transparency Code of Practice as adequate for Article 50(2), which makes signing it a recognised route, though not conclusive evidence. NIST AI 600-1 treats content provenance under its information integrity risk.

### S9. r23 and r24: the only NIST link is weak, and the gap is not marked
- **Problem:** MEASURE 2.8 ("Risks associated with transparency and accountability ... are examined and documented") is about assessing risk. It does not require disclosure or marking, and nothing in AI RMF 1.0 does. In the NIST-hosted crosswalk, neither row's ISO items (A.6.2.2 and A.8.2; A.8.5 and A.9.2) are paired with MEASURE 2.8.
- **Replacement:** keep MEASURE 2.8 and add `GOVERN 1.1` (legal requirements understood and documented) as the honest anchor. For r24 also add ISO `7.4` (Communication). Set `gap="partial"` on both rows, and add to the r24 note:
  > AI RMF 1.0 has no disclosure or labelling outcome; the duty is the AI Act's own. The transparency Code of Practice (Section 2) and the EU AI-generated content icons are the recognised way to meet Article 50(4). The exceptions for artistic works and text under editorial responsibility apply.

### S10. r19: the NIST and ISO links do not fit an information duty
- **Problem:** GOVERN 5.1 is about collecting feedback from external parties, not about informing them. MEASURE 2.8 assesses transparency risk. A.8.2 is system documentation for users, meaning the operators, not the workers or affected persons. None of the row's ISO items appear among the crosswalk pairings for its NIST ids. Article 26(11) is also limited to Annex III systems.
- **Evidence:** NIST texts in nist_ai_rmf.json. Crosswalk pairs: GOVERN 5.1 to A.10.4, A.5.3, A.5.4, A.8.3; MEASURE 2.8 to 6.1.2, A.5.4, A.5.5, A.6.1.2, A.7.2, A.9.3. Neither includes A.8.2 or A.8.5.
- **Replacement:** `iso=["7.4", "A.8.5"]`, `nist=["GOVERN 4.2", "GOVERN 5.1"]`. GOVERN 4.2: teams "communicate about the impacts more broadly", paired in the crosswalk with 7.4. Obligation, final clause: "... and tell people that an Annex III high-risk system is used in decisions about them (Article 26(7) and (11))." Add note: "Neither framework requires notice to workers or affected persons; the duty is the AI Act's own." Set `gap="partial"`.

### S11. r08: MEASURE 2.8 does not support logging
- **Problem:** The text of MEASURE 2.8 says nothing about event recording. In the crosswalk, A.6.2.8 (event logs) is paired with MEASURE 2.4, MEASURE 2.6 and MEASURE 3.2.
- **Replacement:** `nist=["MEASURE 2.4", "MEASURE 2.6", "MANAGE 4.1"]`. MEASURE 2.6 covers "real-time monitoring, and response times for AI system failures". MANAGE 4.1 covers post-deployment monitoring plans, including incident response and change management, which is what traceability serves.

### S12. r25: the Code of Practice is "a", not "the", route
- **Problem:** Article 53(4) lets providers rely on codes of practice until a harmonised standard is published. Non-signatories can show compliance by adequate alternative means. "The recognised route" suggests it is the only one. The open-source carve-out from points (a) and (b) is also missing.
- **Evidence:** art-53 takeaway (paragraphs 2 and 4); corpus doc-10 ("Non-signatories must show compliance by other means").
- **Replacement (note):**
  > ISO/IEC 42001 was not written for model providers. The copyright policy and the public training summary are the AI Act's own. The GPAI Code of Practice, assessed as adequate by the Commission and the AI Board, is a recognised way to show compliance; non-signatories must show adequate alternative means. Free and open-source models with public weights are exempt from the documentation duties unless they carry systemic risk.

### S13. Application dates shown next to high-risk rows (r13, r14, r15, r20, r22)
- **Problem:** build_crosswalk.py shows each article's `applies_from` next to the obligation. For Articles 43, 47, 48, 49, 72, 73 and 86 that date is 2 August 2026, while the obligation can bite only once the system is high-risk under Chapter III: 2 December 2027 for Annex III, 2 August 2028 for Annex I. Next to row r13, "2 August 2026" will be read as "conformity assessment is due now". Articles 16 and 26, which apply from December 2027, are the actual triggers. The template caveat ("only apply once a system is high-risk, under the dates in the digest") does not resolve this, because the dates shown are the ones causing the confusion.
- **Evidence:** art-113 takeaway (point (c)); applies_from values in the digest.
- **Replacement:** in rows for high-risk systems, add `"art-16"` (provider rows r13 to r15) to `aia` so that the December 2027 / August 2028 dates appear, or add a row-level note: "Applies once the high-risk rules apply: 2 December 2027 (Annex III), 2 August 2028 (Annex I); systems already on the market are caught only on a significant design change, except those for public authorities (Article 111(2))."

### S14. Missing obligations (criterion 4)
These are core duties for providers, deployers or GPAI providers that no row covers:
1. **Article 16(b), (k), (l) and Article 21 (provider):** name and contact address on the system or its packaging, demonstrating conformity and giving log access on a reasoned request, and the accessibility requirements of Directives 2016/2102 and 2019/882. Suggested new row in "market":
   > Mark the system or its packaging with your name and contact address, meet the accessibility requirements of Directives (EU) 2016/2102 and 2019/882, and on reasoned request give the authorities the information, documentation and log access needed to demonstrate conformity (Article 16(b), (k) and (l), Article 21).
   `aia=["art-16","art-21"]`, `iso=["7.5.3", "A.8.3"]`, `nist=["GOVERN 1.1", "GOVERN 4.3"]`, `gap="partial"`.
2. **Article 52 (GPAI):** notify the Commission within two weeks of meeting the systemic-risk threshold (10^25 FLOP presumption) or learning that it will be met. Add to r26, or as a new row:
   > Track cumulative training compute and notify the Commission within two weeks once a model meets, or is known to be going to meet, the systemic-risk threshold (Article 51(2), Article 52(1)).
   `aia=["art-51","art-52"]`, `iso=[]`, `nist=["GOVERN 1.1"]`, `gap="none"`.
3. **Article 22 and Article 54 (non-EU providers):** appoint an EU authorised representative by written mandate before placing on the market. Suggested addition to r13: "Providers established outside the Union first appoint an authorised representative in the Union by written mandate (Article 22)", plus the same for r25 (Article 54).
4. **Article 43(4):** a substantial modification triggers a new conformity assessment. Add to r13: "Repeat the conformity assessment after a substantial modification, unless the change was pre-determined in the technical documentation (Article 43(4))."

---

## Consider

### C1. r02: overclaim about ISO/IEC 42001
"Both only require that legal requirements are identified and that a go or no-go decision is taken." NIST has an explicit go/no-go outcome (MANAGE 1.1). ISO/IEC 42001 has none as such: it requires legal requirements to be determined (4.1) and intended use to be defined (A.9.4).
Replacement:
> Neither framework lists prohibited uses. ISO/IEC 42001 requires legal requirements to be determined and intended use to be defined, and NIST MANAGE 1.1 requires a decision on whether development or deployment should proceed; the list itself comes from Article 5, including the new bans on non-consensual intimate imagery and child sexual abuse material that apply from 2 December 2026.

### C2. r01: "operate or use"
The amended Article 4 text says "persons operating the systems on their behalf". Drop "or use", or write "operate the systems on your behalf". Also consider adding "for any AI system, not only high-risk ones" to the obligation. The duty is not limited to high-risk systems, and readers on this page will assume it is.

### C3. r05: mapping additions
The obligation includes "test against predefined metrics before release" but cites no ISO V&V control. Add ISO `A.6.2.4` (AI system verification and validation) and NIST `MEASURE 2.3`. Also consider adding "evaluate post-market monitoring data" and "foreseeable misuse" to the paraphrase, since both are in Article 9(2).

### C4. r07: mapping and SME relief
GOVERN 4.2 (documenting risks and impacts) is only loosely tied to Annex IV. Add `MAP 2.1` (tasks and methods defined), which the crosswalk pairs with A.6.2.3. Add to the note:
> SMEs, start-ups and small mid-caps may use the Commission's simplified form, which notified bodies must accept (Article 11(1) as amended).
Also make "keep it for ten years" "keep it for ten years after the system is placed on the market or put into service" (Article 18(1)).

### C5. r09: add MANAGE 1.4
MANAGE 1.4 ("Negative residual risks ... to both downstream acquirers of AI systems and end users are documented") is the closest NIST outcome to telling deployers about known risks. It is also paired in the crosswalk with A.6.2.7 and A.8.2, both of which r09 cites. MEASURE 2.5 (documenting limitations of generalisability) fits too.

### C6. r10: the note and the references disagree
The note says oversight "sits in the design requirements and the responsible-use processes", but the row cites no responsible-use control. Add ISO `A.9.2`, or cut the second half of the sentence. Consider adding "measures proportionate to the risks and level of autonomy, built in or specified for the deployer" from Article 14(3).

### C7. r11: presumption routes for cybersecurity
Add to the note:
> Under Article 42(2) and the new Article 42(3), certification under a cybersecurity scheme cited in the Official Journal, or meeting the Cyber Resilience Act conditions (Regulation (EU) 2024/2847, Article 12(1)), presumes or deems compliance with the cybersecurity requirements of Article 15.

### C8. r12: add GOVERN 1.1
The first of the thirteen Article 17(1) areas is a strategy for regulatory compliance. GOVERN 1.1 is its direct NIST match.

### C9. r26: the paraphrase is shorter than Article 55(1)(c)
"report serious incidents to the AI Office" should read "track, document and report serious incidents and corrective measures to the AI Office and, where relevant, national authorities without undue delay". Also consider adding `MAP 5.1` (likelihood and magnitude of impacts) for the systemic-risk assessment. In the note, name the Code of Practice Safety and Security chapter as the recognised route for Article 55.

### C10. r06: Article 4a also covers deployers
The row is for providers, which is correct. Since Article 4a(2) now extends the permission to deployers of high-risk systems and to providers and deployers of other systems, a short clause in the note would stop readers assuming it is provider-only.

### C11. r24: Article 50(5)
Add "clearly, at the latest at the first interaction or exposure (Article 50(5))".

### C12. Other optional gaps
- Article 26(10): post-remote biometric identification in criminal investigations needs authorisation within 48 hours (niche, law enforcement deployers).
- Article 26(12): deployers cooperate with competent authorities.
- Articles 60 and 61: real-world testing plan and informed consent, if a provider tests outside a sandbox.
- Articles 23 and 24: importers and distributors. These are outside the page's stated scope, but a line in the intro saying so would help.

---

## Crosswalk consistency signal (criterion 3)
This uses the NIST-hosted crosswalk's `iso_annex_a_equiv`. Parent and child clauses count as a match, for example 7.5 and 7.5.3.

**Rows where none of our ISO items is paired with any of our NIST ids:** r19, r23, r24. r13 and r20 have no references by design. All three are handled in S9 and S10.

**NIST ids that have no crosswalk pairing with any ISO item in the same row** (the row has other paired ids, so this is informational only):
- r03 GOVERN 1.6
- r05 MANAGE 1.4
- r06 MEASURE 2.11
- r07 GOVERN 4.2
- r08 MEASURE 2.8 (see S11)
- r09 MEASURE 2.8
- r10 MAP 2.2
- r11 MEASURE 2.3, MEASURE 2.7
- r12 GOVERN 1.4, GOVERN 1.5
- r14 MEASURE 3.1
- r15 MANAGE 2.4, MANAGE 4.3
- r16 MAP 3.5
- r18 MANAGE 2.4
- r21 MAP 5.2
- r25 GOVERN 6.1, MAP 4.1
- r26 MEASURE 2.7, MANAGE 4.3

Most of these are defensible on the text, for example MANAGE 1.4 for residual risk and GOVERN 6.1 / MAP 4.1 for copyright. The crosswalk is a third-party mapping built against the FDIS, not an authority.

## Rows with no findings beyond the above
r14, r16 and r17 are accurate against the takeaways, and their mappings are sound.
