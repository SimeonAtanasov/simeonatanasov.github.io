# Singapore: Personal Data Protection Act 2012 (PDPA) - build notes

Read 13 November 2026 on Singapore Statutes Online (sso.agc.gov.sg) in the browser pane, "Current version as
at 13 Nov 2026" (2020 Revised Edition, incorporating amendments up to 1 December 2021; site last updated
11 Nov 2026). The whole-document view loads later parts lazily and those requests answered HTTP 202 with an
empty body, so each Part and Schedule was opened on its own (`?ProvIds=P13-`, `P14-`, `Sc1-` ...).

## Act: what was read

- s. 2 definitions: "organisation" includes any individual, company, association or body, whether or not
  formed or resident in Singapore; "data intermediary" processes personal data on behalf of another
  organisation; "business contact information"; "publicly available"; "public agency"; "user activity
  data"; "user-provided data"; "derived personal data".
- s. 4 application: Parts 3 to 6B impose no obligation on individuals acting in a personal or domestic
  capacity, employees acting in the course of employment, or any public agency (4(1)). A data intermediary
  processing under a written contract has only ss. 24, 25 and 26C(3)(a), 26E (4(2)). The organisation has
  the same obligations for data processed on its behalf by a data intermediary (4(3)). Not to records 100
  years old or deceased individuals beyond 10 years (4(4)). Parts 3 to 6A do not apply to business contact
  information unless expressly mentioned (4(5)). Other written law prevails on inconsistency (4(6)(b)).
- Part 6B (data portability) is mentioned in s. 4 but is not in the current version on SSO: its table of
  contents has Parts 6 and 6A only (6A: notification of data breaches, ss. 26A to 26E). Portability is
  therefore not in force on 13 November 2026. Not modelled as a right.
- s. 11: reasonable person standard (11(1)); responsible for data in its possession or under its control
  (11(2)); must designate one or more individuals responsible for compliance (11(3), the "data protection
  officer" in PDPC guidance), may delegate (11(4)); must make available to the public the business contact
  information of at least one of them (11(5)); deemed satisfied if made available in a prescribed manner
  (11(5A)).
- s. 12: develop and implement policies and practices; a process to receive and respond to complaints;
  communicate them to staff; make information available on request about the policies and practices and
  the complaint process (12(d)).
- s. 13: no collection, use or disclosure without consent (given or deemed) unless required or authorised
  under the Act or other written law.
- s. 14: consent is not given unless the individual was provided with the information required under
  s. 20 (14(1)(a)); no consent beyond what is reasonable as a condition of a product or service (14(2)(a));
  no false or misleading information or deceptive practices (14(2)(b)); such consent is not valid (14(3)).
- s. 15: deemed consent by conduct (voluntarily provides data for a purpose, reasonable) (15(1)); onward
  disclosure where consent was given to disclosure (15(2)); deemed consent by contractual necessity, for
  disclosure to and use by other organisations reasonably necessary to conclude or perform the contract
  (15(3) to (9), from 1 February 2021).
- s. 15A: deemed consent by notification, from 1 February 2021: not for prescribed purposes (15A(3));
  before collection, use or disclosure: an assessment that it is not likely to have an adverse effect,
  reasonable steps to bring to the individual's attention the intention, the purpose, and a reasonable
  period and manner to notify that they do not consent (15A(4)); the assessment identifies adverse effects
  and measures (15A(5)).
- s. 16: withdrawal of consent (given or deemed) at any time on reasonable notice (16(1)); the organisation
  must inform the individual of the likely consequences (16(2)); must not prohibit withdrawal (16(3)); must
  cease, and cause data intermediaries and agents to cease, unless required or authorised without consent
  (16(4)), subject to s. 25.
- s. 17: without consent in the circumstances of the First Schedule or the Second Schedule (Part 1
  collection, Part 2 use, Part 3 disclosure) (17(1)); data received or collected under (1) can be used for
  consistent purposes (17(2)).
- s. 18: purposes a reasonable person would consider appropriate and that the individual has been informed
  of under s. 20, if applicable.
- s. 20: inform the individual of (a) the purposes on or before collecting; (b) any other purpose before
  use or disclosure for it; (c) on request, the business contact information of a person able to answer
  questions on behalf of the organisation (20(1)). Collecting from another organisation without consent:
  give that organisation enough information on the purpose (20(2)). 20(1) does not apply to deemed consent
  under ss. 15 or 15A or to collection without consent under s. 17 (20(3)), except that for entering into,
  managing or terminating an employment relationship or appointment the organisation must inform of the
  purpose and, on request, the contact (20(4), (5)).
- s. 21 access: on request, as soon as reasonably possible, the personal data and information about the
  ways it has been or may have been used or disclosed within a year before the request (21(1)); Fifth
  Schedule exceptions (21(2)); must-not cases (21(3)); not law enforcement disclosures (21(4)); partial
  access (21(5)); notify rejection within the prescribed time (21(6)) and exclusions (21(7)).
- s. 22 correction: correct an error or omission unless satisfied on reasonable grounds it should not be
  made; send to organisations disclosed to within a year unless not needed (22(2)); annotate if not
  corrected (22(5)); no duty to alter opinions (22(6)); Sixth Schedule exceptions (22(7)).
- s. 22A: preserve a copy of refused personal data for the prescribed period.
- s. 23 accuracy; s. 24 protection (reasonable security arrangements); s. 25 retention (cease to retain, or
  anonymise, as soon as it is reasonable to assume the purpose is no longer served and retention is no
  longer necessary for legal or business purposes); s. 26 transfer outside Singapore only in accordance
  with prescribed requirements for a comparable standard of protection; PDPC exemptions (26(2)).
- First Schedule (without consent): Part 1 vital interests (para 1(2): notify as soon as practicable of the
  collection, use or disclosure and its purpose); Part 2 matters affecting the public (publicly available,
  national interest, artistic or literary, archival or historical, news organisations); Part 3 legitimate
  interests: para 1 (legitimate interests of the organisation or another person outweigh any adverse effect;
  assessment beforehand and "provide the individual with reasonable access to information about the
  organisation's collection, use or disclosure" in accordance with it (1(2)(b)); not for sending messages
  for an applicable purpose, i.e. marketing, s. 37(6) (1(4))), and paras 2 to 10: evaluative purposes,
  investigation or proceedings, debt recovery or payment, legal services, credit bureau, trust or benefit
  plan, service for the personal purposes of another individual, documents produced in employment, business
  or profession, and employment (reasonable for entering into, managing or terminating employment or an
  appointment); Part 4 business asset transactions (notify individuals after the transaction, para 1(4)(c));
  Part 5 business improvement purposes within related corporations (not for marketing messages, para 1(6)).

## Personal Data Protection Regulations 2021 (S 63/2021), current version as at 13 Nov 2026

- reg 1A (from 1 October 2021; amended by S 580/2026 from 1 September 2026): s. 11(5) is deemed satisfied if
  the business contact information of a designated individual is made available (a) in a record about the
  organisation on the PDPC website, or (b) in a readily accessible part of the organisation's official
  website (a website accessible by the public through which it gives information about itself).
- reg 2: "data protection officer" means an individual designated under s. 11(3) or delegated under 11(4).
- reg 3: access and correction requests in writing, with enough detail to identify the applicant and what is
  requested; sent under s. 48A of the Interpretation Act, to the data protection officer at the business
  contact information under s. 11(5), or in another manner acceptable to the organisation.
- reg 4: respond as accurately and completely as necessary and reasonably possible; access by a copy in
  documentary form, or a reasonable opportunity to examine, or another form requested and acceptable.
- reg 5: if unable to respond within 30 days after receiving a request, inform the applicant in writing
  within that time of when it will respond.
- reg 6: may refuse to confirm or deny certain matters (investigations).
- reg 7: a reasonable fee for access requests, only after a written estimate (and written notice of any
  higher fee); the PDPC can review fees (s. 48H); no fee for correction (7(4)).
- reg 8: preserve refused data at least 30 days after the refusal, longer while a review or appeal runs.
- reg 9: "recipient" excludes the transferring organisation, its employees, network service providers or
  carriers, and onward recipients; "data in transit".
- reg 10: before transferring outside Singapore, take appropriate steps to ascertain and ensure that the
  recipient is bound by legally enforceable obligations to a standard at least comparable to the Act
  (10(1)). Taken as satisfied if (a) the individual consents (subject to 10(3)), (b) deemed consent under
  s. 15(3) to (8) (contract), (c) necessary for use or disclosure under First Schedule Part 1 (vital
  interests) or Part 2 para 2 (national interest), with reasonable steps against other use, (d) data in
  transit, (e) publicly available in Singapore (10(2)). Consent to transfer is not valid unless the
  individual was first given "a reasonable summary in writing of the extent to which the personal data to
  be transferred to that country or territory will be protected to a standard comparable to the protection
  under the Act" (10(3)(a)); not as a condition of a product or service unless reasonably necessary
  (10(3)(b)); not by misleading practices (10(3)(c)); can be withdrawn (10(4)).
- reg 11: legally enforceable obligations include law, contract (comparable standard and the countries and
  territories to which data may be transferred under it), binding corporate rules (related recipients;
  specify recipients, countries and rights and obligations), or another legally binding instrument.
- reg 12 (amended by S 86/2026 from 2 March 2026): a recipient holding a specified certification granted or
  recognised under the law of the destination is taken to be bound: for a data intermediary APEC PRP, APEC
  CBPR, Global PRP or Global CBPR; otherwise APEC CBPR or Global CBPR.
- reg 13: deemed consent by notification cannot be used to send messages for an applicable purpose (Tenth
  Schedule: marketing messages).
- reg 14: the s. 15A assessment specifies types and volume, purposes, methods, the mode of notification, the
  opt-out period and mode, and the rationale; kept while the processing lasts.
- reg 15: the legitimate interests assessment specifies types and volume, purposes, methods; residual adverse
  effects; the legitimate interests; the other person by name or description where the interests are a
  third party's; the reasons they outweigh; kept while the processing lasts.

## Act: enforcement provisions read

- s. 48G: the PDPC may refer a complaint to mediation or direct the parties to resolve it.
- s. 48H: on a complainant's application the PDPC may review a refusal of access (s. 21) or correction
  (s. 22), a failure to provide them within a reasonable time, or a fee for either; it can confirm, direct
  access or correction, or reduce or disallow the fee (porting provisions also listed, Part 6B not in force).
- s. 48O: a person who suffers loss or damage directly from a contravention of Part 4, 5, 6, 6A or 6B (or
  the Do Not Call provisions) has a right of action in civil proceedings, after any PDPC decision is final.

## PDPC guidance (advisory, not legally binding)

- Advisory Guidelines on Key Concepts in the PDPA, revised 29 April 2026 (the page says the transfer section
  was updated on that date for the Global CBPR and PRP systems). The PDF (pdpc.gov.sg/assets/34058be5-...)
  could not be parsed in the browser pane (the PDPC site's content security policy blocks pdf.js) or
  downloaded from the shell (proxy 403); it was read through a web fetch tool in four parts, so the passages
  below are the tool's extracts and short quotes, checked for consistency, not a full reading.
  - Ch. 12, legitimate interests (pp. 62 to 63): take reasonable steps to give individuals reasonable access
    to information that the organisation relies on the exception, by any reasonably effective means, for
    example its public data protection policy; make it known that it relies on the exception; give the
    business contact information of a person who can answer questions about it; the assessment need not be
    made public.
  - Ch. 12, deemed consent by notification (pp. 47 to 49): the method of notification is not prescribed; it
    must be adequate and effective in making the individual aware; consent is deemed only after the opt-out
    period lapses; the period must be reasonable.
  - Ch. 12, withdrawal (pp. 55 to 60): explain the form and manner of the notice and to whom; individuals can
    withdraw for optional purposes without withdrawing for necessary ones; tell them the likely consequences
    on receipt (s. 16(2)) even if stated elsewhere; rule of thumb of at least ten business days.
  - Ch. 14, notification (pp. 83 to 86): purposes on or before collecting; no prescribed form; writing is good
    practice; a Data Protection Policy can notify the purposes, with the chance to view it before collection
    where it is not a physical document; general purposes may need a more specific description to the
    individual at collection; purposes at an appropriate level of detail, not every activity.
  - Ch. 15, access (pp. 96 to 105): as soon as reasonably possible; 30 calendar days, else tell the person in
    writing within 30 days when; fees recover incremental costs with a written estimate; give reasons when
    refusing.
  - Ch. 18, retention (pp. 118 to 120): no fixed period is prescribed; good practice is a retention policy
    with the approach to periods.
  - Ch. 19, transfers (pp. 123 to 130): consent after being told how the data will be protected in the
    destination; certifications as in reg 12 (a PRP certificate is not enough for a recipient that is not a
    data intermediary).
  - Ch. 20, breach notification to individuals (pp. 144 to 151): not notice content.
  - Ch. 21, accountability (pp. 152 to 156): the DPO's business contact information on BizFile+ (ACRA) or in
    a readily accessible part of the official website; accessible from Singapore and operational in
    Singapore business hours; Singapore telephone numbers; at least one postal or email address for written
    access and correction requests (fn 85); complaint process (s. 12(b)); information on request (s. 12(d));
    individuals can complain to the PDPC and bring civil proceedings (21.14).
  - Contradiction: the Guidelines (29 April 2026) name BizFile+, but reg 1A(1)(a) as amended by S 580/2026
    from 1 September 2026 now reads "a record relating to the organisation that is made available on the
    Internet website of the Commission". The generator follows the Regulations (row H08).
- Advisory Guidelines on the PDPA for Children's Personal Data in the Digital Environment (28 March 2024),
  read through a web fetch tool: "child" means below 18; a child between 13 and 17 may give valid consent
  where the policies are readily understandable to them (4.2), otherwise the parent or guardian; below 13
  consent from a parent or guardian, who should be told the purposes (4.5); withdrawal as easy as consent
  (4.4); language readily understandable by children.
- Advisory Guidelines on the PDPA for NRIC and other National Identification Numbers (31 August 2018, applied
  from 1 September 2019): read only through the PDPC media release of 31 August 2018 and two PDPC practical
  guidance letters (2019). Organisations should not collect, use or disclose NRIC numbers (or copies of the
  NRIC) unless required under the law (or a PDPA exception applies) or necessary to accurately establish or
  verify identity to a high degree of fidelity; the same for birth certificate numbers, FIN, work permit and
  passport numbers; physical NRICs are retained only where required under the law. Row H17 is a check, with
  the guidelines named.

## Design

- Lead document: "<Organisation> Data Protection Policy" (the PDPC's term, Key Concepts 14.12 to 14.13).
  Section in a notice led by another law: "Additional information under Singapore's PDPA" (for an organisation
  abroad: "Additional information for people in Singapore"; SG06 of the review). Singapore sits
  after Korea and before California (REG_ORDER), checkbox index 9.
- Per purpose: `sgBasis` (consent; deemed consent by conduct, s. 15(1); deemed consent for contract
  disclosures, s. 15(3) to (8); deemed consent by notification, s. 15A, with `sgOptOut`; legitimate
  interests, with `sgLi`; business improvement (First Schedule Part 5 or Second Schedule Part 2 Division 2,
  by `sgCorp`); employment; another First or Second Schedule
  exception, with `sgExc`; required or authorised by law, with `sgLaw`).
- Recipients: data intermediaries (processor role) and other organisations, each with its purpose and
  location. Transfers outside Singapore (`sgAbroad`, `sgXrows`): the reg 10 to 12 basis per row, the written
  summary for consent rows, the certification kind (PRP only for data intermediaries), own systems abroad
  (reg 9: not a recipient).
- Section fields: scope (in Singapore or abroad), countries of processing for an organisation abroad, DPO
  business contact, how to make access and correction requests, access fee, complaint route, security
  measures, NRIC numbers, children (under 13), marketing to Singapore telephone numbers (Do Not Call
  check), confirmation of no recipients, new purpose route (`sgFurther`).
- Rows H01 to H30 (matrix Part T; G was taken by the data protection policy checks). No rights that are not in force (Part 6B portability) are printed.

## Build

- `build/sg/sg_module.js` (marker + `sg_body.js`), spliced into `pn_block.js` after the Korea module by
  `build/sg/rebuild.sh`; `build/sg/wire_sg.py` wired the form fields, the Singapore lead and the Singapore
  section into the EU/UK/Swiss build, the Brazil lead and the Canada, India, China, Japan and Korea modules;
  `build/sg/add_sg_data.py` added the regime option, `SG_BASES`, `SG_XBASIS` and rows H01 to H29 to
  `ng-data.js`; `build/sg/add_sg_tests.py` added the scenarios (`scen_sg.py`), their expectations and a UI
  block to `test_ng.py`, and moved the California and US checkboxes to indexes 10 and 11.
- Tests before the review: 2,981 checks, 0 failures (265 scenarios). The 245 scenarios from before Singapore
  are byte-identical against the Korea deploy (`diff_all.py`, tree `/home/claude/ng-test-kr`).

## After the independent review (13 November 2026)

- 26 findings (3 high, 12 medium, 11 low), all applied: `build/review-2026-11-13-sg/review-fixes.md` lists each
  fix. Provisions re-read first on SSO: ss. 15, 16, 20 to 22A, 36, 43 to 48, 48H, 48O; First Schedule Parts 3
  and 5; Second Schedule Part 2 Division 2; Fifth and Sixth Schedules; regs 3 to 10 and 15; DNC Registry
  Regulations 2013 regs 15 to 17.
- The location test now fails closed: only an entry with nothing but Singapore places, regions and filler
  words is Singapore; a mixed entry is abroad; anything unrecognised, or no location, is unknown.
- Section 15(3) to (8) is for disclosure to another organisation; with no organisation recipient the policy
  prints a placeholder instead of the denials, and H05 is missing. The base scenario now uses s. 15(1) for
  payment; the full scenario has a contract purpose with an organisation recipient.
- New fields: `sgCorp` (business improvement), `sgKidsAge` (13 to 17). New transfer bases: data in transit,
  PDPC exemption. New NRIC reason: a PDPA exception. New row H30.
- Tests after the fixes: 3,190 checks, 0 failures (295 scenarios, the reviewer's 30 included); the 245
  scenarios from before Singapore are byte-identical against the Korea deploy.
