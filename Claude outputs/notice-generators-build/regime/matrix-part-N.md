## Part N. Brazil: General Data Protection Law (LGPD)

Added 12 November 2026. Law 13,709/2018 as consolidated on 25 February 2026 (Law 15,352/2026 turned
the ANPD into the National Data Protection Agency; the rules on processing, rights and transfers were
not amended). How each text was read, and what it says, is in `build/br/notes.md`.

**Sources.** The LGPD from the Senate's consolidated text on normas.leg.br, read through its public API
(planalto.gov.br refused automated access). Resolution CD/ANPD 2/2022 (small processing agents) from the
Official Gazette print; Resolution CD/ANPD 18/2024 (encarregado) from the Official Gazette print and the
ANPD's summary; the International Data Transfer Regulation (Resolution CD/ANPD 19/2024) in the English
version the ANPD publishes; Resolution CD/ANPD 32/2026 (EU adequacy): the builder had only the ANPD's
transfer page and secondary sources; the independent review read the ANPD's official Spanish version
(Article 1, sole paragraph: the EU Member States, Iceland, Liechtenstein and Norway, and EU institutions,
bodies and agencies; Article 2: not for transfers made only for public security, national defence, State
security or criminal investigation), and Article 1 was confirmed against the Portuguese text as
reproduced by legismap. Enunciado CD/ANPD 1/2023 and the ANPD guide on
legitimate interest (February 2024) through secondary sources and a hosted copy of the guide. The ANPD's
regulation on data subject rights (Articles 9, 18, 19, 20) was not adopted on 12 November 2026.

**Why this structure.** The LGPD follows the GDPR's model: purposes, legal bases, recipients, transfers,
rights. So a Brazil-led notice reuses the shared answers (purposes, data, retention, recipients,
sources, automated decisions) with the LGPD's own fields for legal bases (Article 7), sensitive data
(Article 11), the encarregado, transfers (Article 33) and children. With the EU, UK or Swiss law leading,
Brazil adds an "Additional information for people in Brazil" section. Brazil sits after Switzerland and
before California in the order of laws, so a Brazil-led notice can carry the California and US sections.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| N01 | Controller identity and contact | Art. 9, III, IV | Brazil leads | Name and at least one channel |
| N02 | Encarregado, or a channel | Art. 41, para. 1; 23, III; Res. 18/2024 Arts. 5, 8, 9, 13; Res. 2/2022 Arts. 2 to 4, 11 | Always | Natural person: full name; legal entity: business name and the full name of the person responsible (Res. 18 Art. 9, para. 1); contact details that let people exercise rights and the ANPD reach them (para. 2); published prominently; the encarregado communicates in Portuguese (Art. 13). Small agent: asks whether any processing is high-risk; only a small agent without high-risk processing may skip the encarregado (then a channel). Small agent with sensitive data, children's data or solely automated decisions: warn. Public body: never a small agent (missing), appointment published in the Official Gazette (Res. 18 Art. 5). In the first layer of a notice led by another law too |
| N03 | Specific purpose | Art. 9, I; 6, I | Brazil leads | Every row; vague purposes warned |
| N04 | Legal basis per purpose | Art. 7; 6, VI; 23, I; 5, XVIII | Always | Article 7 basis, or Article 11 for a purpose that uses only sensitive data; the planned new purpose included. Article 7, III or 11, II, b without a public body: warn. Article 7, IV or 11, II, c: warn, only for a research body. Public body on legitimate interests: warn (ANPD guide). Legal obligation or public policy without the law named: warn. Art. 9 does not list the legal basis; stating it is good practice and required of public bodies (Art. 23, I) |
| N05 | Legitimate interests | Art. 7, IX; 10; ANPD guide 2024 | Article 7, IX used, for a purpose or the planned new one | The interest and the concrete situation; data strictly necessary; objection (Art. 18, para. 2). Combined with sensitive data on the same purpose: warn (Art. 11 has no legitimate interests) |
| N06 | Sensitive data | Art. 11; 5, II | Article 11 basis chosen, or GDPR special category data marked | The Article 11 basis per purpose; consent specific and highlighted. A purpose with GDPR special category data and no Article 11 basis: warn. Public body on Art. 11, II, a or b: the notice states that consent is not required (Art. 11, para. 2) |
| N07 | Form and duration | Art. 9, II; 15, 16 | Brazil leads | Retention per purpose; "as long as necessary" is missing. The form of the processing (how the data is collected and processed): its own field, printed under the purposes table; empty is warn |
| N08 | Shared use and its purpose | Art. 9, V; 5, XVI | Brazil leads | Recipients with role and purpose; names in transfer rows listed as recipients |
| N09 | Responsibilities of the agents | Art. 9, VI; 37 to 39, 42 | Brazil leads | Controller decides, operators follow instructions, liability (Art. 42); joint controllers jointly liable (Art. 42, para. 1, II) |
| N10 | International transfers | Art. 33; Regulation Arts. 3, 5, 6, 9; Res. 32/2026 Arts. 1, 2 | Always | Country and mechanism per row. Adequacy: the EU Member States, Iceland, Liechtenstein and Norway, and EU institutions (warn for any other destination); public body: warn that Article 2 excludes security, defence and criminal investigation transfers. Seals, certificates, codes: not yet regulated (warn). Consent: specific and highlighted (warn). Art. 33, III, VI, VII without a public body: warn. Own organisation named: warn, keep only where the data reaches you from another agent in Brazil. Transfers answered No while recipients are outside Brazil: warn, the exporter can be abroad. Established abroad: the notice says where data is processed; collection directly from people abroad is not a transfer |
| N11 | Transfers under ANPD clauses or rules | Regulation Arts. 16, 17, 32 | Standard or specific clauses, or global corporate rules | Form, duration and specific purpose per row; security measures; full clauses within 15 days on request; Portuguese (warn without it) |
| N12 | Rights, each mentioned | Art. 9, VII; 18 | Always | The nine Article 18 rights, objection (para. 2), review of automated decisions (Art. 20); how to exercise them |
| N13 | Confirmation and access times | Art. 19; 23, para. 3; Res. 2/2022 Arts. 3, 14, 15 | Always | Simplified reply at once, full declaration within 15 days; small agents without high-risk processing 15 and 30 days; public bodies: the times of the Habeas Data, Administrative Procedure and Access to Information Laws (check); electronic or printed at the person's choice; full electronic copy for consent (Art. 7, I or 11, I) or contract. The rights regulation is pending (noted) |
| N14 | Petition | Art. 18, para. 1, 8; 55-J, V | Always | ANPD, once a request to the controller was not resolved; consumer protection bodies |
| N15 | Consent | Art. 8, para. 5; 18, VIII, IX | Consent relied on (Art. 7, I; 11, I; 33, VIII; the planned new purpose) | How to withdraw (free and easy); what happens on refusal per purpose, the new one included (warn); withdrawal does not undo earlier processing, and deletion on request (Art. 18, VI; 16) |
| N16 | Condition for a product, service or right | Art. 9, para. 3 | Data collected from the person | Required purposes in a highlighted box with consequences and the rights reminder |
| N17 | Automated decisions | Art. 20 | Always | Brazil leads: the main question in Article 20 wording; an earlier "Yes" to the Brazil question with the main answer not Yes: placeholder and warn, never a denial. Section: its own question, broader than Art. 22 GDPR; "No" while the GDPR decision exists: warn. Review and information on criteria and procedures |
| N18 | Children and adolescents | Art. 14; Enunciado 1/2023; ECA Digital Arts. 7, 16, 22, 26 | Always (question) | Best interest; the types of data (own optional field), uses and rights procedures (para. 2); parental consent where consent is relied on for a child (warn without how). With children's data: check, naming the ECA Digital duties (information for informed choices, risks and security measures, no profiling for targeted advertising), not modelled |
| N19 | Public bodies | Art. 23, I; 11, para. 2 | Public body | Check: add procedures and practices; with Art. 11, II, a or b, the notice states that consent is not required |
| N20 | Changes | Art. 8, para. 6; 9, para. 2; 6, I | Always | Changes to purpose, form, duration, controller or shared use highlighted; where consent is relied on and the new purpose is incompatible with it, prior notice and withdrawal. New purpose (Brazil leads): purpose, start, data, Art. 7 basis, retention, compatibility |
| N21 | Origin of the data | Art. 19, II | Brazil leads | Sources named (good practice; the origin is due on request) |
| N22 | Portuguese | Regulation Art. 17, para. 2; CDC Art. 31 | Always | Warn unless the languages include Portuguese |
| N23 | Information before consent (delivery) | Art. 9, para. 1; 8, para. 4 | Consent relied on | Give it beforehand; misleading information voids consent; no generic authorisations |
| N24 | Sharing data obtained with consent (delivery) | Art. 7, para. 5 | Consent and a controller or joint controller among recipients | Specific consent for that sharing |
| N25 | Children's version (delivery) | Art. 14, para. 6 | Children's data | Simple, clear, accessible, audiovisual where appropriate |

In a Brazil-led notice the WP260 delivery rows (D01, D03 to D08, D10, D12, D14) stay as good practice,
and P19 (joint controllers) and P21 (first layer) are kept as good practice, as in a Swiss-led notice.

Independent review, 12 November 2026 (`review-2026-11-12-br/`): 20 findings (1 high: the EU adequacy
decision also covers Iceland, Liechtenstein and Norway; 6 medium; 13 low), all applied. The rows above
are as updated after it.
