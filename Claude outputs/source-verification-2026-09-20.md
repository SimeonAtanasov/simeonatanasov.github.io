# Source verification of the three digests

Date: 20 September 2026. Every takeaway checked against the official text of the
document it describes, from the downloads in `edpb-downloads` (899 PDFs converted to
text; 877 text files used here). Method: one packet of entries per agent, each claim
checked by searching the document text, results recorded per entry with a verdict and,
where something was wrong, a replacement takeaway. Raw results:
`Claude outputs/source-verification-2026-09-20/source-verification-results.json`.

## What was checked and what came back

| Digest | Entries checked | Confirmed | Minor | Correction | Source not usable |
|---|---|---|---|---|---|
| EDPB Digest | 199 | 141 | 53 | 4 | 1 |
| Cookie Compliance Digest | 100 | 50 | 23 | 9 | 18 |
| AI Act Digest (Part 2) | 5 | 1 | 3 | 0 | 1 |
| **Total** | **304** | **192** | **79** | **13** | **20** |

Plus 282 templated EDPB one-liners (BCR, accreditation, certification and national DPIA
list opinions) checked by script against their own documents: opinion number, authority,
company or group name and the controller or processor BCR type. All 282 matched. Five
were flagged and all five were line-wrap artefacts ("Controller Binding\nCorporate
Rules"), not errors.

Not checked: 64 EDPB entries, 159 cookie entries and 44 AI Act corpus entries whose
source could not be downloaded (bot-protected sites, dead links, or content that is a web
page rather than a PDF), and 21 EDPB written takeaways in the same position.

**Corrections applied: 92** (57 EDPB, 32 cookie, 3 AI Act), through
`apply_source_review.py` with `source_review_changes.json`, which matches each entry on
its exact current text and refuses to write if the text has moved on.

## The substantive errors found

These are the claims that were wrong, not merely loose. All are fixed.

**Exposure draft, Privacy Amendment (Personal Data Protection) Bill 2026 (tranche 2 reforms)** (cookie-109)  
- Said: require an opt-out from targeted online behavioural advertising with an ad-free alternative where a service relies on marketing revenue  
  Document says: The consultation paper's direct marketing section (p.19-20) says the framework 'retains the requirement for a simple opt-out mechanism' and 'provides flexibility for ad-supported services', and states plainly that 'the framework does not require consent for direct marketing'. Online behavioural adve  
- Said: confirm that IP addresses, device identifiers and cookie IDs are personal information where reasonably linkable  
  Document says: The bill's Note 1 to the 'reasonably identifiable' definition (line ~605) lists examples: name, date of birth, address, contact information, a pseudonym or identifier, location/geolocation data, and behavioural characteristics or patterns of activity. Neither 'IP address', 'device identifier' nor 'c  

**Data (Use and Access) Act 2025, section 112 and Schedule 12: new Schedule A1 to PECR (exceptions to the storag** (cookie-173)  
- Said: Paragraphs 5 and 6 require prior information, a simple free means of objecting, and no disclosure except to a party assisting with improvements.  
  Document says: Only paragraph 5 (statistical purposes) bars sharing the collected information except with a party assisting with improvements (para 5(1)(c), Sch 12, p.243-244). Paragraph 6 (website appearance/functionality) requires just clear information and a simple free means of objecting (para 6(1)(c)-(d), p.2  

**CNIL, Deliberation 2026-042: recommendation on tracking pixels in emails** (cookie-19)  
- Said: with one exemption: measuring the individual deliverability of emails tied to a service the recipient asked for  
  Document says: Section 3.2 (p.5) lists two exempted purposes: security measures contributing to user authentication, and individual measurement of open rates for deliverability, limited to what is strictly necessary to adapt or stop sending to inactive recipients. Both exemptions apply only to emails requested by   
- Said: consent to receive marketing does not exempt any other tracking purpose  
  Document says: Section 4 (pp.9 to 10): the pixel consent regime is independent of the regime for sending the email, but a single consent may cover direct marketing under article L.34-5 CPCE together with pixel purposes connected to it (personalisation, sending frequency, anti-fraud in contests); distinct, unconnec  

**California Privacy Protection Agency, Order of Decision against PlayOn Sports** (cookie-214)  
- Said: sold or shared data of consumers aged 13 to 15 without opt-in consent  
  Document says: The order's factual findings and violations (paras 1-64) cover forced acceptance of tracking before ticket purchase, referral to NAI/DAA instead of an operator opt-out, failure to honour opt-out preference signals, deficient privacy notices, and a stale privacy policy. Nowhere does the document ment  

**Gutierrez v. Converse Inc., No. 24-4797 (9th Cir.)** (cookie-219)  
- Said: Keep records showing that vendors store and process data only for the operator and do not use it for their own purposes; that evidence carried the case.  
  Document says: The panel affirmed because the record lacked evidence that Salesforce made an unauthorised connection with a telephone wire, or that it "read or attempted to read" the plaintiff's chat message; encryption and a login spreadsheet at most showed Salesforce "could read" messages, which was insufficient  

**Popa v. Microsoft Corp., No. 24-14 (9th Cir.)** (cookie-220)  
- Said: is now routinely applied to dismiss CIPA pen register claims  
  Document says: Popa's claims were brought under Pennsylvania's Wiretapping and Electronic Surveillance Control Act (WESCA), 18 Pa. Cons. Stat. sections 5702, 5725, and a common-law intrusion-upon-seclusion claim; the opinion never mentions California's CIPA or pen register claims.  

**Belgian DPA, decision 85/2022: Roularta Media Group fined 50,000 euros after the cookie sweep of 20 press site** (cookie-39)  
- Said: reliance on legitimate interest for non-essential cookies  
  Document says: Not a finding against Roularta. The Inspection findings (pp. 3-5) and the operative findings (paras 162-163, pp. 51-53) are: non-essential cookies placed before consent; statistics cookies treated as not subject to consent and always active by default; pre-ticked partner boxes (Planet49); a disclaim  

**EDPB letter on the Commission's draft principles for a voluntary cookie pledge** (cookie-75)  
- Said: principles on advertising business models and consent or pay had to be read with the Board's forthcoming opinion on that subject  
  Document says: The letter (13 December 2023) contains no reference to a forthcoming or planned EDPB opinion on consent or pay. It instead says the EDPB 'cannot in abstracto' assess whether a paid alternative secures valid consent, and that this depends on whether a less intrusive alternative (e.g. contextual adver  

**Digital Omnibus proposal, COM(2025) 837, 2025/0360(COD): new GDPR Articles 88a and 88b on terminal equipment a** (cookie-86)  
- Said: A new Article 88b ... with a six-month grace period  
  Document says: Article 88b(5): paragraphs 1 and 2 (honouring machine-readable consent/refusal signals) apply from 24 months after entry into force; Article 88b(7): paragraph 6 (browser providers) applies from 48 months after entry into force. The six-month period in the proposal belongs to Article 88a (its own app  

**Data Protection Officer training** (edpb-133)  
- Said: was completed in December 2023  
  Document says: The file provided (D3, public health sector module) states 'Document submitted in May 2024' (p. 2).  

**EDPB letter to the European Commission on the privacy implications of recent proposed legislative changes rega** (edpb-24)  
- Said: proposed changes to entry conditions for third-country nationals (border and travel data)  
  Document says: Letter of 10 March 2026 (p. 1) concerns the US Customs and Border Protection proposal to revise the ESTA visa-waiver process for EEA citizens travelling to the United States: collection of five years of social media activity, family members' data, mobile-app-only applications and possibly biometric   

**EDPB-EDPS Joint Opinion 03/2022 on the Proposal for a Regulation on the European Health Data Space** (edpb-260)  
- Said: and patients' opt-out  
  Document says: The opinion does not discuss an opt-out from secondary use (the term does not appear). On secondary use it asks to exclude wellness-app data or subject it to GDPR consent, to delineate the Article 34(1) purposes, to align access-permit criteria with Article 9(2) GDPR and not to extend GDPR rights ex  

**Binding decision 1/2021 on the dispute arisen on the draft decision of the Irish Supervisory Authority regardi** (edpb-312)  
- Said: The decision binds the Irish authority and WhatsApp Ireland.  
  Document says: Para 431 (p. 88): 'This binding decision is addressed to the IE SA and the CSAs. The IE SA shall adopt its final decision on the basis of this binding decision pursuant to Article 65(6) GDPR.' Article 65(2) makes it binding on the lead and concerned supervisory authorities; WhatsApp Ireland is bound  

## The imprecisions found

79 takeaways were accurate in substance but loose in a way worth fixing: a wrong
paragraph number, an adoption date given as the publication date, a version described as
correcting text when it only improved an image, a recommendation stated as a requirement,
a finding stated more broadly than the document states it. Each is recorded in the raw
results with the document's own wording. All 79 were rewritten.

## Entries whose source could not be used

19 entries came back `wrong_file`: the PDFs downloaded from the entry's page are not the
document the entry names. These are download artefacts, not digest errors, and nothing was
changed for them. They are the first candidates for a manual re-download.

| Entry | Title | What the downloaded files actually are |
|---|---|---|
| aia-doc-43 | EDPB Guidelines 02/2026 on anonymisation | None of the three files is Guidelines 02/2026 on anonymisation: they are the web scraping guidelines 03/2026, blockchain guidelines 02/2025 v2.0 and the blockch |
| cookie-142 | Philippines Data Privacy Act of 2012 (Republic Act 10173) and NPC guidelines on  | Neither provided file is the Data Privacy Act or NPC guidance on consent. One is a DICT/NPC/SEC public advisory on online lending platform harassment and contac |
| cookie-150 | IAB Multi-State Privacy Agreement (MSPA), Fifth Amended and Restated | both provided files are earlier versions of the agreement (the Second Amended and Restated MSPA and the Third Amended and Restated MSPA); neither contains a Fif |
| cookie-152 | W3C Global Privacy Control (GPC) specification, Working Draft | the supplied file is the California OAL final text of the CCPA regulations (Title 11, Division 1, Chapter 20); it discusses businesses honouring user-enabled gl |
| cookie-153 | Global Privacy Control reference site and adoption record (globalprivacycontrol. | GPC_for_Users.txt is a short consumer explainer ('Fly Your Privacy Flag') mentioning only California and Colorado, with no dates, no W3C reference and no state  |
| cookie-172 | PECR Regulation 6 (Privacy and Electronic Communications (EC Directive) Regulati | the supplied text is the original 'as made' 2003 instrument (SI 2003/2426); its regulation 6 has four paragraphs with the old wording (no Schedule A1, no instig |
| cookie-196 | Turkey: KVKK Guideline on Cookie Practices (Çerez Uygulamaları Hakkında Rehber) | None of the five downloaded files is that guideline. They are: the KVKK's own website cookie disclosure notice for its strictly-necessary cookies (cerezlere_dai |
| cookie-205 | People v. Sephora USA, Inc., California Attorney General CCPA settlement | This file is the Attorney General's initiating Complaint, not the settlement/consent judgment. It seeks statutory civil penalties of $2,500 per violation (lines |
| cookie-207 | California Privacy Protection Agency, Order against Todd Snyder, Inc. | 20250501_snyder_order.txt is the right document (cover Order of Decision naming Todd Snyder, Case No. ENF23-M-TO-26, dated 1 May 2025) but pages 2-13, which wou |
| cookie-234 | Minnesota Consumer Data Privacy Act, Minn. Stat. Chapter 325O (2024 Minn. Laws c | Both files are Minnesota House of Representatives internal directories: comroster.txt is a 2025-2026 committee roster (members, meeting times, staff phone numbe |
| cookie-35 | Verwaltungsgericht Hannover, judgment 10 A 5385/22: a reject all button on the f | The only file is the DSK 'Orientierungshilfe fuer Anbieter:innen von digitalen Diensten (OH Digitale Dienste)', Version 1.2, Stand November 2024. It contains no |
| cookie-54 | Datatilsynet (Norway), guidance on consent for cookies and other tracking techno | Neither supplied file is the cookie guidance: etiske-retningslinjer-dt-8-mai-2024 is Datatilsynet's internal staff ethics code, and slik-bruker-datatilsynet-kun |
| cookie-78 | CJEU, Case C-673/17, Bundesverband der Verbraucherzentralen v Planet49 GmbH | None of the six files is Planet49. They are, respectively: CJEU C-496/17 (customs/AEO status), a kafala child-guardianship citizenship case, a free-movement-of- |
| cookie-79 | CJEU, Case C-61/19, Orange Romania SA v ANSPDCP | The file opens 'JUDGMENT OF THE COURT (Grand Chamber) 1 October 2019 ... In Case C-673/17 ... Bundesverband der Verbraucherzentralen ... v Planet49 GmbH'. It is |
| cookie-80 | CJEU, Case C-40/17, Fashion ID GmbH & Co. KG v Verbraucherzentrale NRW eV | None of the ten files is Fashion ID or cites C-40/17. They are: C-210/16 Wirtschaftsakademie (5 June 2018, Facebook fan page), C-389/08 Base NV, a pregnant-work |
| cookie-81 | CJEU, Case C-252/21, Meta Platforms and Others v Bundeskartellamt | None of the 8 files supplied for this entry is that judgment. They are eight unrelated CJEU judgments (dated 1 Aug 2022, 24 Feb 2022, 25 Mar 2021, 7 Nov 2013, 1 |
| cookie-82 | CJEU, Case C-604/22, IAB Europe v Gegevensbeschermingsautoriteit | None of the 9 files is that judgment or mentions IAB Europe, C-604/22, the TC String or the Transparency and Consent Framework. They are unrelated CJEU judgment |
| cookie-83 | CJEU, Case C-654/23, Inteligo Media SA v ANSPDCP (soft opt-in and free accounts) | None of the 7 files is that judgment or mentions Inteligo, C-654/23 or ANSPDCP. One file (document.txt) is an unrelated 1983 customs case (Firma E. Merck v Haup |
| cookie-84 | CJEU, Case C-582/14, Patrick Breyer v Bundesrepublik Deutschland (dynamic IP add | The single file supplied (document-ddcfc0862c6d.txt) is the judgment in Scarlet Extended SA v SABAM, Case C-70/10 (24 November 2011), about filtering obligation |
| edpb-528 | Guidelines on the right to data portability under Regulation 2016/679, WP242 rev | The only file is a Danish DPA decision on a complaint about a retailer's Trustpilot reply (July 2022, 2 pages); it is not the WP242 rev.01 data portability guid |

The CJEU entries in that list (Planet49, Fashion ID, Orange Romania, Meta v
Bundeskartellamt, IAB Europe, Inteligo Media, Breyer) failed because a curia.europa.eu
page links many judgments and the downloader took the wrong ones. Their takeaways were
written from the judgments themselves in September 2026 and two of them (IAB Europe,
Inteligo Media) were separately confirmed on GDPRhub on 19 September 2026.

## Notes on wider-world claims

104 low-severity notes record a claim that a takeaway makes which its own document does
not address: a later fine amount, a subsequent adoption, a cross-reference to another
decision. These were left in place where they had already been verified from another
source, and removed only where the verification could not support them.

