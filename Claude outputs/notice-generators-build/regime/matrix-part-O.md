## Part O. Canada: PIPEDA and the Quebec, Alberta and British Columbia private-sector laws

Added 12 November 2026. Row IDs start with Q (the letter O is taken by the open points in Part I).
How each text was read, and what it says, is in `build/can/notes.md`.

**Sources.** PIPEDA (S.C. 2000, c. 5) from laws-lois.justice.gc.ca, current to 19 October 2026, last
amended 4 March 2025: ss. 2, 4, 4.01, 5, 6.1, 7, 8, 10, 11 and Schedule 1 read in full. Bill C-36 (the
Protecting Privacy and Consumer Data Act) is at second reading in the House of Commons (LEGISinfo, 12
November 2026) and is not modelled. The OPC Guidelines for obtaining meaningful consent (2018, page
modified 11 August 2025, issued with the OIPCs of Alberta and British Columbia) and the OPC Guidelines
for processing personal data across borders (2009), on priv.gc.ca. Quebec's Act respecting the
protection of personal information in the private sector (CQLR c P-39.1), current to 15 October 2026:
LegisQuebec answered the browser pane with HTTP 502, so the builder read it through an extractor that
returns paraphrase with short quotes (ss. 1, 3.1, 3.2, 4 to 8.3, 9.1, 12 to 14, 17, 18.3, 22, 23, 27, 28,
28.1, 30, 32 to 34, 42, 43, 81, 90.1). The Charter of the French language (CQLR c C-11) ss. 50.2, 52, 55,
the same way. Alberta's PIPA (SA 2003, c P-6.5), King's Printer PDF current as of 1 September 2025: ss. 4
to 9, 13, 13.1, 24, 28, 32, 46, 47, 56. British Columbia's PIPA (SBC 2003, c 63), bclaws, current to 10
November 2026: ss. 3 to 10, 23, 24, 27, 29, 32, 46, 47.

**Why this structure.** The Canadian laws follow the fair information principles: purposes identified
at or before collection, knowledge and consent, openness, access. They have no legal bases, so a
Canada-led notice reuses the shared answers (purposes, data, retention, sources, recipients) and adds
Canada's own fields per purpose: whether it is a condition of service, the form of consent, and whether
the information is sensitive. The user ticks each law that applies (federal, Quebec, Alberta, British
Columbia): an organisation in a province with its own law is under PIPEDA as well for information that
crosses a border. With the EU, UK, Swiss or Brazilian law leading, Canada adds an "Additional
information for people in Canada" section. Canada sits after Brazil and before California in the order
of laws.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| Q01 | Organisation identity and contact | PIPEDA Sch. 1, 4.8.2(a) | Canada leads | Name and at least one channel |
| Q02 | Person accountable, or in charge | PIPEDA 4.1, 4.8.2(a); QC s. 3.1; AB s. 13(1)(b); BC ss. 4(5), 10(1)(b) | Always | Name or title, and address or contact details. Quebec: published on the website |
| Q03 | Which laws apply | PIPEDA s. 4; QC s. 1; AB s. 4; BC s. 3, 3(2)(c) | Always | Nothing ticked reads as PIPEDA; public bodies warned (private-sector laws); PIPEDA not ticked while information leaves Canada, leaves Quebec, or goes to a recipient (or the organisation is) outside the ticked provinces: warn. Note names Bill C-36, PIPEDA's data mobility amendments (S.C. 2026, c. 3, not in force) and BC's credit reporting changes from 1 August 2027 |
| Q04 | Purposes | PIPEDA 4.2, 4.3.2; QC ss. 4, 8; AB s. 13(1)(a); BC s. 10(1)(a); OPC key element 3 | Canada leads | Every row; vague purposes warned (OPC: "service improvement" is too vague) |
| Q05 | Information collected | PIPEDA 4.4.1, 4.8.2(c); OPC key element 1 | Canada leads | The personal information for every purpose |
| Q06 | Condition of service, and the person's choice | PIPEDA 4.3.3; QC s. 9; AB s. 7(2); BC s. 7(2); OPC principle 3 | Always | For every purpose: needed for the service, and the form of consent. All problems listed: a needed use on opt-out; any use without consent with no provision named (the notice prints a placeholder; being needed is not an exception); a provision that names no ticked law |
| Q07 | Sensitive information | PIPEDA 4.3.4, 4.3.6; QC ss. 12, 13; OPC form of consent | Always | Sensitive on implied or opt-out consent: warn (OPC: generally express; Quebec: express for a secondary use or a communication to a third person). GDPR special category data not marked sensitive: warn |
| Q08 | Who the information is shared with | OPC key element 2; QC s. 8, para. 2 | Canada leads | Recipients named with what for; third parties using it for their own purposes flagged, with the opt-out uses to check (outside reasonable expectations: express consent) |
| Q09 | Related organisations | PIPEDA 4.8.2(e) | Always | Answer; if yes, what is made available and to whom |
| Q10 | How the information is collected | QC s. 8, para. 1(2) | Always | Quebec: required; otherwise good practice |
| Q11 | Processing outside Canada | OPC cross-border guidelines (2009); PIPEDA 4.1.3; AB ss. 6(2), 13.1 | Always | Answer; countries; Alberta: purposes of service providers outside Canada. Recipients listed outside Canada with "No": warn. The notice says foreign authorities can access it |
| Q12 | Communication outside Quebec | QC s. 8, para. 2; s. 17 | Quebec | Answer; "No" while processed outside Canada, or with a recipient or the organisation outside Quebec: warn, and the notice prints a placeholder instead of the denial |
| Q13 | Technology that identifies, locates or profiles | QC s. 8.1 | Quebec | Answer; if yes, the technology and how to turn the functions on, warn if any use is on opt-out (functions are off until turned on). "No" while the notice describes profiling or inferred information: warn and print a placeholder, never the denial; with automated decisions: warn |
| Q14 | Decisions based exclusively on automated processing | QC s. 12.1 | Quebec | Canada leads: the main question in s. 12.1 wording; an earlier "Yes" to the Quebec question with the main answer not Yes: placeholder and warn, never a denial; "No": check (a No given under another law's wording can carry over). Section: its own question |
| Q15 | Children | OPC consent guidelines (under 13); QC ss. 4.1, 14 (under 14) | Always (question) | Parent or guardian consent; how, warned if empty. Section: the general children answer Yes with the Canada answer No: warn. The general question is hidden when Canada leads |
| Q16 | Retention | PIPEDA 4.5; QC s. 8, para. 3 | Canada leads | For every purpose (warn: due on request in Quebec, good practice elsewhere) |
| Q17 | Rights and how to exercise them | PIPEDA 4.9, s. 8, s. 10; QC ss. 7, 8, 27, 28, 28.1, 30, 32, 33; AB ss. 9, 24, 25, 28, 32; BC ss. 9, 23, 24, 29, 32 | Always | Per ticked law; how to make a request |
| Q18 | Complaints | PIPEDA 4.10, s. 11; QC ss. 3.2, 42, 43, 81; AB ss. 46, 47; BC ss. 46, 47 | Always | To the organisation, then the regulator of each ticked law |
| Q19 | Withdrawing consent | PIPEDA 4.3.8; QC s. 8, para. 1(4); AB s. 9; BC s. 9 | Consent relied on | How to withdraw; the limits printed follow the ticked laws (PIPEDA: legal or contractual restrictions; Alberta and BC: a legal obligation; Quebec: none) |
| Q20 | Risk of harm | OPC key element 4 | Always | Check: describe meaningful residual risks of significant harm; with sensitive information, warn if empty; a risk stated while optional uses rest on implied or opt-out consent: warn (express consent expected) |
| Q21 | Governance policies | QC s. 3.2 | Quebec | Where the detailed information is published |
| Q22 | Commercial or philanthropic prospecting | QC s. 22 | Quebec | Answer; the notice states the right to withdraw |
| Q23 | Changes and new purposes | PIPEDA 4.2.4; QC s. 12; AB, BC s. 8(4); OPC principle 6 | Always | New purpose: consent before use unless required by law; significant changes notified with consent first, unless the law requires them |
| Q24 | French | Charter of the French language ss. 50.2, 52, 55 | Quebec | Warn unless the languages include French |
| Q25 | Sources | QC s. 7; PIPEDA 4.9.1 | Canada leads, indirect | Sources named (good practice; the source is due on request in Quebec) |
| Q26 | Timing (delivery) | PIPEDA 4.2; QC s. 8; AB s. 13; BC s. 10 | Always | Purposes at or before collection, on each form |
| Q27 | Quebec publication (delivery) | QC ss. 3.1, 3.2, 8.2 | Quebec | Confidentiality policy, person in charge and governance information on the website |
| Q28 | Privacy by default (delivery) | QC s. 9.1 | Quebec | Highest confidentiality settings by default (cookies excepted) |
| Q29 | Outside Quebec (delivery) | QC ss. 17, 18.3 | Quebec, communication outside Quebec | Privacy impact assessment and written agreement first |
| Q30 | Asking for consent (delivery) | QC s. 14; OPC principles 3, 4 | Express or opt-out consent | Each purpose separately, clear and simple language, just in time |
| Q31 | Automated decision notice (delivery) | QC s. 12.1 | Automated decisions | Tell the person no later than when the decision is communicated |
| Q32 | Service providers outside Canada (delivery) | AB s. 13.1 | Alberta, processing outside Canada | Notify before or at the time of collecting or transferring |

Citations in the check notes follow the ticked laws (review R09).

In a Canada-led notice the WP260 delivery rows (D01, D03 to D08, D10, D12, D14) stay as good practice,
and P21 (first layer) is kept as good practice, as in a Brazil-led notice.

Independent review, 12 November 2026 (`review-2026-11-12-can/`): 19 findings (2 high: a denial of
communication outside Quebec while the notice lists recipients outside it, and a denial of section 8.1
technology next to a statement of profiling; 7 medium; 10 low), all applied. The rows above are as updated
after it. Quebec's Act was read by builder and reviewer only through extracted fragments (LegisQuebec
answered HTTP 502 all evening); confirm against the official page when it answers.
