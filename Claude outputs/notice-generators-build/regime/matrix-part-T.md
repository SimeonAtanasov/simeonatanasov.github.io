## Part T. Singapore: Personal Data Protection Act 2012

Added 13 November 2026. Row IDs start with H (G is used by the data protection policy's own checks). How each
text was read, and what it says, is in `build/sg/notes.md`.

**Sources.** The Personal Data Protection Act 2012 (PDPA), 2020 Revised Edition, "current version as at 13 Nov
2026" on Singapore Statutes Online (sso.agc.gov.sg), read Part by Part in the browser pane (the whole-document
view loads later Parts through requests that answered HTTP 202 with no content): ss. 2, 4, 11 to 26, 48G, 48H,
48O and the First Schedule. Part 6B (data portability) is not in the current version, so it is not in force.
The Personal Data Protection Regulations 2021 (S 63/2021), current version, with reg 1A as amended by
S 580/2026 (from 1 September 2026) and reg 12 as amended by S 86/2026 (from 2 March 2026): regs 1A to 15. The
PDPC's Advisory Guidelines on Key Concepts in the PDPA (revised 29 April 2026), chapters 12, 14, 15, 18 to 21,
and its Advisory Guidelines on children's personal data in the digital environment (28 March 2024), read
through a web fetch tool (the PDPC site blocks pdf.js in the browser pane and the shell's proxy refused it).
The Advisory Guidelines on NRIC and other national identification numbers (2018) only through the PDPC's media
release and two PDPC practical guidance letters. The guidelines are advisory, not legally binding.

**Why this structure.** The PDPA is built on consent with exceptions. An organisation collects, uses or
discloses personal data only with consent, deemed consent (by conduct, for contracts, or by notification with an
opt-out period, ss. 15, 15A) or where the Act or another law allows it without consent (ss. 13, 17 and the First
and Second Schedules, legitimate interests and business improvement among them). The notice duty is narrow:
the purposes, on or before collection, and on request a contact who can answer questions (s. 20). The rest of a
policy comes from other duties: the data protection officer's business contact information made public
(s. 11(5)), information on request about policies, practices and the complaint process (s. 12), reasonable
access to information about reliance on legitimate interests (First Schedule, Part 3, para 1(2)(b)), and the
written summary before consent to a transfer (reg 10(3)(a)). A Singapore-led document is a "Data Protection
Policy" (the PDPC's term). It reuses the shared answers and adds per purpose how the PDPA allows it, with the
opt-out for deemed consent by notification, the interest for legitimate interests, the exception or the law;
the location of each recipient; and a list of transfers outside Singapore under transfers. The rest sits in a
Singapore section of the form. With another law leading, Singapore adds a section: "Additional information under
Singapore's PDPA" for an organisation in Singapore (the PDPA applies to its activities in Singapore, whoever the
person is: s. 2(1)), or "Additional information for people in Singapore" for an organisation abroad. Singapore
sits after Korea and before California in the order of laws.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| H01 | Organisation's name and effective date | s. 20; Key Concepts, ch. 14 | Singapore leading | Both required (needed for the policy text) |
| H02 | How the PDPA applies | ss. 2(1), 4(1) | Always | In Singapore or from abroad answered; from abroad, the countries of processing (printed); public agencies warned (s. 4(1)(c)) |
| H03 | Purposes | ss. 18, 20(1)(a); Key Concepts, ch. 14 | Always | Required, each named; vague purposes warned |
| H04 | Personal data for each purpose | s. 20(1)(a); Key Concepts, ch. 14 | Always | Required (good practice; printed per purpose) |
| H30 | Inferred data, automated decisions and profiling | s. 20(1)(a) (no rule of its own) | Singapore leading | A description when answered Yes (needed for the policy text) |
| H05 | How the PDPA allows each purpose | ss. 13 to 17; First and Second Schedules | Always | One of nine answers; the law or the exception named; s. 15(3) to (8) needs an organisation recipient (not your own collection and use); business improvement needs whether you are a corporation (First Schedule Part 5, or Second Schedule Part 2 Division 2); s. 15(1) with data from others warned; marketing messages on legitimate interests, business improvement or deemed consent by notification warned (First Schedule, Part 3, para 1(4), Part 5, para 1(6); reg 13); the employment exception outside an employee or applicant audience warned |
| H06 | Deemed consent by notification | s. 15A; regs 13, 14 | A purpose on it | How and by when to opt out, printed; the assessment and notification steps as a check; not for marketing messages |
| H07 | Legitimate interests | First Schedule, Part 3, para 1; reg 15(2)(d); Key Concepts, ch. 12 | A purpose on it | Reliance disclosed with the data protection officer as contact; the interest named, and another person's interests named (good practice, warned if not); the assessment as a check; not for marketing messages |
| H08 | Data protection officer's business contact information | ss. 11(3), 11(5), 20(1)(c); regs 1A, 3; Key Concepts 21.6, 21.7 | Always | A business email or postal address required (a telephone number alone is missing); title "Data Protection Officer" when no name; reachable from Singapore in business hours; official website or the PDPC record |
| H09 | Recipients and purposes of disclosure | ss. 4(2), 4(3), 20(1)(a) | Always | An empty list needs confirmation; a name, a role, a purpose and a location for each (location needed for the policy text) |
| H10 | Transfers outside Singapore | s. 26; regs 9 to 12 | Always | Answered; per row the recipient, country and basis (contract, binding corporate rules, law, other instrument, certification, consent with the written summary, deemed consent for a contract, vital or national interest, data in transit, publicly available, PDPC exemption with its notice, own systems); PRP only for data intermediaries; own systems only for the organisation itself; a row naming Singapore missing; recipients outside Singapore, or of unknown or no location, missing from the list or with the answer No, missing (a location naming Singapore and another place is outside Singapore); organisations abroad: not modelled, a check |
| H11 | Retention | s. 25; Key Concepts 18.3, 18.8 | Always | A period or criteria per purpose (good practice, warned); without one the s. 25 rule is printed |
| H12 | Protection | s. 24 | Always | The duty stated; measures optional |
| H13 | Withdrawing consent | s. 16 | Consent or deemed consent, the new purpose included | How (or the data protection officer's email or address, the rights contact, the organisation's email); the s. 16 effects stated |
| H14 | Access and correction | ss. 21, 22; regs 3 to 7 | Always | Where to send written requests (the request field, the rights contact, the data protection officer's email or address, or the organisation's email); access fee answered (needed for the policy text); correction free; the 30-day notice in writing; refusals with reasons |
| H15 | Complaints, policies on request, and the PDPC | ss. 12, 48H, 48O | Always | A complaint route (or the data protection officer, or the organisation's email); the PDPC review and the right of private action |
| H16 | Children | Children's Guidelines (2024), 4.2 to 4.5 | Always (check if unanswered) | Where consent is relied on: 13 (or a higher age set, up to 17) to 17 consent where they understand; under that age a parent or guardian, with how |
| H17 | NRIC and other national identification numbers | NRIC Guidelines (2018); PDPC announcement of 2 Feb 2026; s. 24 | Always (check if unanswered) | Why: a law, a PDPA exception, or identity verified to a high degree of fidelity; use for authentication warned (enforcement from 1 January 2027) |
| H18 | New purpose | ss. 18, 20(1)(b), 20(3)(b) | New purpose planned | Singapore leading: purpose, start, data; always: how the PDPA allows it; marketing on notification or legitimate interests warned; under an exception, no notice promised |
| H19 | Employees and applicants | s. 20(4), (5) | Employee or applicant audience | Purposes notified even under the employment exception or deemed consent |
| H20 | Not modelled | Parts 6A, 6B, 9; First Schedule, Part 4; s. 4(2) | Always | Breach notification, portability (not in force), Do Not Call beyond a delivery check, business asset transactions, data intermediary duties |
| H21 | Purposes on or before collection (delivery) | s. 20(1)(a), (2); Key Concepts, ch. 14 | Always | At each collection point; specific purpose where the policy is general; to another organisation when collecting from it without consent |
| H22 | Consent requests (delivery) | s. 14 | Consent | Purposes first; not beyond what is reasonable; not misleading |
| H23 | Publishing the data protection officer's contact (delivery) | s. 11(5); reg 1A | Always | Official website or the PDPC record |
| H24 | Handling withdrawal (delivery) | s. 16(2), (4) | Consent or deemed consent | Consequences told; stop, with intermediaries and agents |
| H25 | Handling access requests (delivery) | ss. 21, 22A; regs 4, 5, 7, 8 | Always | Timing, fee estimate, refusal notice, refused data kept 30 days |
| H26 | Before transferring (delivery) | regs 10 to 12 | Transfers | Legally enforceable obligations in place; the written summary before consent |
| H27 | Deemed consent by notification (delivery) | s. 15A(4)(b); Key Concepts, ch. 12 | A purpose on it | Adequate and effective notice; wait for the period |
| H28 | Do Not Call provisions (delivery) | ss. 43 to 47; DNC Registry Regulations 2013, regs 15 to 17; DNC Guidelines (2021) | Marketing to Singapore numbers, by any channel | Check the registers within 21 days before sending unless there is evidenced consent; identification; calling line shown; stop within 21 days of withdrawal |
| H29 | Children (delivery) | Children's Guidelines (2024), 4.2, 4.5 | Children | Age-appropriate language; parent or guardian for under 13 |

In a Singapore-led policy the WP260 delivery rows (D01, D03, D05 to D08, D14) stay as good practice and P21
(first layer) stays as good practice. The GDPR DPO, children, joint-controller, "is providing the data required"
questions and the Article 22 logic and effect are not shown when Singapore leads.

Not modelled: data breach notification (Part 6A), data portability (Part 6B, not in force), the Do Not Call
provisions beyond a delivery check (Part 9), business asset transactions (First Schedule, Part 4), the
Second Schedule exceptions beyond the "another exception" answer, an organisation's duties as a data
intermediary for others, whether onward disclosures by an organisation outside Singapore are transfers under
s. 26, and other official languages.

**Independent review, 13 November 2026.** 26 findings (3 high, 12 medium, 11 low), all applied after re-reading
the provisions concerned: the location test fails closed (mixed entries abroad, unrecognised or empty
locations unknown), s. 15(3) to (8) needs an organisation recipient, the section is framed by activity for an
organisation in Singapore, business improvement follows corporation status, contacts must be writable, and
row H30 was added. Details in `build/review-2026-11-13-sg/review-fixes.md`.
