## Part R. Japan: Act on the Protection of Personal Information

Added 12 November 2026. Row IDs start with T (J was taken). How each text was read, and what it says, is in
`build/jp/notes.md`.

**Sources.** The Act on the Protection of Personal Information (APPI, Act No. 57 of 2003), the version in
force on 2 November 2026, read in Japanese on e-Gov (laws.e-gov.go.jp/law/415AC0000000057). The Enforcement
Order (Cabinet Order No. 507 of 2003): Arts. 2, 9, 10 to 13. The Enforcement Rules (PPC Rules No. 3 of 2016):
Arts. 11, 15 to 18. PPC Notice No. 1 of 2019 (as revised 18 April 2023): the designated countries are the 30
EEA states and the United Kingdom, for recipients subject to the GDPR or the UK GDPR. The PPC general
guidelines (通則編), sections 2-15, 2-16, 3-1-1, 3-6-2-1, 3-6-3, 3-8-1, 3-9 and 10-7. The amending Act No. 56
of 2026 (promulgated 17 July 2026, in force on a date set by Cabinet Order within two years) through the
PPC's outline only; not modelled. The Japanese text is the only authentic text; the English in the notice is
a translation.

**Why this structure.** The APPI is not built on legal bases. A business specifies its purposes of use as
far as possible and publishes or notifies them (Arts. 17, 21); acquires special care-required personal
information only with prior consent or on an Article 20(2) ground; provides personal data to third parties
only with prior consent, an Article 27(1) exception, entrustment, joint use or a filed opt-out scheme
(Art. 27); and needs prior consent, with information on the country, for a third party in a foreign
country unless the country is designated or the recipient has an equivalent system (Art. 28). The notice
itself is the Article 32 state the person can know: name, address and representative; all purposes; how to
make requests, with the fee; the security measures, the complaint contact and any accredited organisation
(Order Art. 10). A Japan-led notice reuses the shared answers and adds per purpose whether it uses special
care-required personal information (with its ground), per third-party recipient the Article 27 basis, and
a list of third parties in foreign countries under transfers. The rest sits in a Japan section of the form.
With another law leading, Japan adds an "Additional information for people in Japan" section. Japan sits
after China and before California in the order of laws.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| T01 | Business name, address and representative | Art. 32(1)(i); Art. 27(2)(i); Guidelines 3-8-1 | Always | Name (Japan leading) and address; a business abroad gives its country, added from the scope answer or flagged; the representative of a corporation, or of an association, none for an individual |
| T02 | Whether and how the APPI applies | Arts. 16, 171 | Always | Scope answered; outside Japan, the country where the business is and handles the data |
| T03 | Purposes of use | Arts. 17, 21, 32(1)(ii); Guidelines 3-1-1 | Always | Purposes and the information per purpose; vague purposes warned; analysis of behaviour or interests flagged |
| T05 | Special care-required personal information | Arts. 2(3), 20(2); Cabinet Order Arts. 2, 9 | Always | Answered for every purpose; the ground chosen per purpose; data another law treats as sensitive warned |
| T06 | Provision to third parties and entrusted handling | Arts. 25, 27(1), 27(5)(i), 28(1) | Always | An empty list needs confirmation; a role per recipient and an Article 27 basis per third party; recipients abroad missing from the foreign list warned; service providers abroad relied on through consent or an exception described as third parties in a foreign country |
| T07 | Joint use | Art. 27(5)(iii), (6); Guidelines 3-6-3 | Joint use | Items, joint users (named or a scope), their purposes, and the person responsible with name, address and representative; check that the joint users are identifiable |
| T08 | Opt-out scheme | Art. 27(2), (3); Rules Art. 11(4) | Opt-out | Items (ii) to (viii), including how the data is updated and the planned start; special care-required data, data acquired improperly and data received under the scheme excluded |
| T09 | Third parties in foreign countries | Art. 28; Rules Arts. 15 to 18; PPC Notice No. 1 of 2019 | Always | Answer required; recipient, country and basis per row; with consent, the country's system and the recipient's measures, or why they cannot be given; only listed countries designated; designated, contract and framework rows need an Article 27 basis too; recipients abroad missing from the list, or abroad while the answer is No, flagged; unrecognised places to check |
| T10 | How to make requests, and fees | Arts. 32 to 38; Cabinet Order Art. 12 | Always | Where, the form and identity checks; fee answered, the amount, and how it is paid |
| T11 | Security measures, and handling abroad | Cabinet Order Art. 10(i); Guidelines 3-8-1, 10-7 | Always | Measures described (a reference to the guidelines alone warned); a business abroad names its country; service providers abroad: the countries named |
| T12 | Complaint contact | Art. 40; Cabinet Order Art. 10(ii) | Always | A contact |
| T13 | Accredited personal information protection organisation | Cabinet Order Art. 10(iii) | Always | Answered; name and contact when a member |
| T14 | Changing the purposes of use | Arts. 17(2), 18(1), 21(3) | Always; new purpose planned | Change only within a reasonably related scope; for a new purpose, related or consent |
| T15 | Retention and deletion | Art. 22 | Purposes | Not required; deletion efforts stated |
| T16 | Language | Art. 32 (good practice) | Always | Japanese normally expected; the generator writes English |
| T17 | Children | Guidelines 2-16; 2026 amendment (not in force) | Always | Consent from a parent or legal representative where a minor cannot judge; the amendment's under-16 rules not modelled |
| T18 | 2026 amendment | Act No. 56 of 2026 | Always | Not in force; review when the Cabinet Order, Rules and guidelines are out |
| T19 | Public bodies | Arts. 2(11), 16(2), 58, 171; Chapter 5 | Public body | Warned: Chapter 5 for Japanese public bodies; Annex 2 bodies without Arts. 32 to 39; a body abroad told to check Art. 171 |
| T25 | Personal related information | Art. 31(1); Rules Art. 17 | Always | Receiving and providing answered; what is received and from whom; consent before receipt, and for a business abroad the information on its country |
| T26 | Pseudonymously and anonymously processed information | Arts. 41(4), (6), 43(3), (4) | Always | Answered; purposes of pseudonymously processed information published; items of anonymously processed information, and when provided the items and the method |
| T20 | Publication so people can know it (delivery) | Arts. 21(1), 32(1); Guidelines 2-15, 3-8-1 | Always | Purposes published, for example about one click from the top page; Article 32 matters also by answering on request; joint use and opt-out items easily knowable |
| T21 | Purpose stated at written collection (delivery) | Art. 21(2) | Direct collection | Expressly, beforehand |
| T22 | Information before consent to foreign provision (delivery) | Art. 28(2); Rules Art. 17 | Consent rows | The country's name, its system and the recipient's measures, or why not |
| T23 | Filing the opt-out provision (delivery) | Arts. 27(2), (3), 29; Rules Art. 11 | Opt-out | Tell people with time to object and file before starting; refile before changing items; after a change of item (i) or stopping, without delay; records |
| T24 | Checks on recipients with an equivalent system (delivery) | Art. 28(3); Rules Art. 18 | Contract or framework rows | Regular checks; stop when the measures cannot be ensured; information on request |
| T27 | Consent and confirmation for personal related information (delivery) | Art. 31(1) | Received or provided | Consent before receipt; the provider confirms consent, and for a recipient abroad the information given |

T04 is not used. In a Japan-led notice the WP260 delivery rows (D01, D03, D05 to D08, D12, D14) stay as good
practice and P21 (first layer) stays as good practice. The GDPR joint-controller questions, the Article 22
logic and effect, and the consent withdrawal field are not shown when Japan leads; the APPI has no general
rule on withdrawing consent.

Not modelled: public bodies under Chapter 5 (warned); the 2026 amendment (rules for people under 16,
biometric data, statistics and AI development, entrustment, breach notices); the record-keeping rules
(Arts. 29, 30) beyond delivery notes; breach reporting (Art. 26); the exceptions to notifying purposes
(Art. 21(4)); the duty to try to explain refusals beyond the notice sentence (Art. 36); a Japanese version
of the notice.

Independent review, 12 November 2026 (`review-2026-11-12-jp/`): 27 findings (3 high: recipients abroad not
compared with the foreign list when the answer was Yes, a business abroad's address without its country, and
an opt-out sentence that misstated the exclusion of special care-required data; 7 medium; 17 low), all
applied. The rows above are as updated after it. The reviewer read every source in Japanese through a web
fetch tool (the shell could not reach e-Gov); the builder read the law, the Order and the Rules in the
browser pane, and after the review read the provisions the fixes rely on there too.
