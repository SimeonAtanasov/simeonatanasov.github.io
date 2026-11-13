# Notice and policy generators: build folder

Built 12 November 2026. The page is `notice-generators.html`; its assets are in
`pages/notice-generators/` (`ng.css`, `ng-data.js`, `ng.js`). It also loads
`pages/gdpr-readiness/readiness-data.js` read only, for the data protection policy
template. GDPR Readiness itself is frozen and nothing in its folder is changed.

Moved out of the repo on 13 November 2026 (MOVE-02): the thirteen `review-*` folders, `incoming/`
and `sg/pre-sg/`, `au/pre-au/`, `za/pre-za/` are in the `GitHub-projects-data` folder beside the repo, under `simeonatanasov.com/` with the same paths. Where this README names
them, look there. The test fixtures use invented organisations under the reserved `.example` domain.

The rules trace to the requirements matrix in the project doc
`claude/notice-generators-matrix.md`. Change a matrix row first, then `ng-data.js` or
`ng.js`, then rerun the test.

| File | What it does |
|---|---|
| `notice-generators.src.html` | Page template: head, explainer, limits, sources. Placeholders `__PANELS__`, `__HEADER_UL__`, `__OGIMAGE__` |
| `build_page.py` | `python3 build_page.py REPO` writes `notice-generators.html`. Takes the header from `gdpr-fine-calculator.html` and sets the active marks; takes og:image from `privacy-ai-assessment.html` |
| `wire_nav04.py` | NAV-04, run once: adds the two nav entries to the 19 pages and the three header templates, the category to `swap_header.py`, and the sitemap entry. Baselines kept outside the repo (`tool-baselines/2026-11-12-NAV-04/` there) |
| `wire_home02.py`, `home_check02.py` | HOME-02, run once: the home page flyout entries and the Privacy & AI card chip and sentence; the check confirms the chips fit inside the card image at six viewport sizes. Baseline kept outside the repo (`tool-baselines/2026-11-12-HOME-02/` there) |
| `diff_eu.py`, `scen_only.py` | Builds the EU privacy notice scenarios in two served trees (before and after a change) and prints any difference in text, checks or delivery rows. `python3 diff_eu.py OLD_TREE NEW_TREE` |
| `regime/` | `scen_regimes.py` (UK, Swiss, California and US state scenarios, also inside `test_ng.py`), `dump.py` (writes each scenario's notice, checks and delivery rows to text files), `matrix-parts-JK.md`, `matrix-part-L.md`, `matrix-part-M.md`, `matrix-part-N.md`, `matrix-part-O.md`, `matrix-part-P.md`, `matrix-part-Q.md`, `matrix-part-R.md`, `matrix-part-S.md`, `matrix-part-T.md`, `matrix-part-U.md` and `matrix-part-V.md` (the UK, Swiss, California, US state, Brazil, Canada, India, China, Japan, Korea, Singapore, Australia and South Africa matrix rows, as given to the reviewers and updated after them) |
| `sg/` | Singapore (Phase 6e): `notes.md` (what was read, where, and the design), `scen_sg.py` (the Singapore scenarios), `scen_sg_review.py` with `scen_sg_rvbase.py` (the reviewer's scenarios, frozen on the base they were written against, with their expectations), all also inside `test_ng.py`; `dump_sg.py` and `dump_rv_after.py` (write each to text), `sg_body.js` (the Singapore code; `sg_module.js` is the marker plus it, the Singapore part of `pn_block.js`), `rebuild.sh` (regenerates `sg_module.js`, splices the Canada, India, China, Japan, Korea and Singapore modules into `pn_block.js` and `ng.js` and dumps the Singapore scenarios; use it instead of `kr/rebuild.sh`), `diff_all.py` with `scen_all6.py` (the regression diff of the 245 earlier scenarios between two trees; `scen_all6.py` is the first 666 lines of `pre-sg/test_ng.py`, the test as it stood after Korea, with the two paths on line 18 fixed, saved from the build session by the audit of 13 November 2026; copy it to `/tmp`), `wire_sg.py` and `add_sg_data.py` (the one-off wiring and data, already applied), `add_sg_tests.py` (the one-off additions to `test_ng.py`: restore `pre-sg/test_ng.py` before rerunning), `pre-sg/` (the files as before Singapore), `pagecopy.py` (the page copy change) |
| `au/` | Australia (Phase 6f): `notes.md` (what was read, where, and the design), `scen_au.py` (the Australia scenarios), `scen_au_review.py` with `scen_au_rvbase.py` (the reviewer's scenarios, frozen on the base they were written against, with their expectations), all also inside `test_ng.py`; `dump_au.py` (writes each to text), `au_body.js` (the Australia code; `au_module.js` is the marker plus it, the Australia part of `pn_block.js`), `rebuild.sh` (regenerates `sg_module.js` and `au_module.js`, splices the seven modules into `pn_block.js` and `ng.js` and dumps the Australia scenarios; use it instead of `sg/rebuild.sh`), `diff_all.py` with `scen_all7.py` (the regression diff of the 295 earlier scenarios between two trees; copy `scen_all7.py` to `/tmp`), `wire_au.py`, `add_au_data.py` and `fix_review.py` (the one-off wiring, data and review fixes, already applied), `add_au_tests.py` (the one-off additions to `test_ng.py`: restore `pre-au/test_ng.py` before rerunning), `pre-au/` (the files as before Australia), `pagecopy.py` (the page copy change), `law_prompt_after_au.txt` (the monthly law check prompt) |
| `za/` | South Africa (Phase 6g): `notes.md` and `design.md` (what was read, where, and the design), `scen_za.py` (the South Africa scenarios), `scen_za_review.py` (the reviewer's scenarios with their expectations, plus three Australia location scenarios), all also inside `test_ng.py`; `dump_za.py` (writes each to text), `za_body.js` (the South Africa code; `za_module.js` is the marker plus the body), `wire_za.py`, `add_za_data.py`, `add_za_tests.py` (run once, in that order), `rebuild.sh` (splices the Canada, India, China, Japan, Korea, Singapore, Australia and South Africa modules into `pn_block.js` and `ng.js`, copies to the test tree and dumps the South Africa scenarios), `scen_all8.py` and `diff_all.py` (the 351 earlier scenarios, before and after), `pagecopy.py` (the page copy), `law_prompt_after_za.txt` (the monthly check prompt), `pre-za/` (the files as they were before) |
| `kr/` | South Korea (Phase 6d): `notes.md` (what was read, where, and the design), `scen_kr.py` and `scen_kr_review.py` (the Korea scenarios and those from the review, with their expectations, also inside `test_ng.py`), `dump_kr.py` (writes each to text), `kr_module.js` (the Korea part of `pn_block.js`), `rebuild.sh` (splices the Canada, India, China, Japan and Korea modules into `pn_block.js` and `ng.js` and dumps the Korea scenarios; use it instead of `jp/rebuild.sh`), `wire_kr.py`, `add_kr_data.py` and `wire_kr_review.py` (the one-off wiring, data and the form and data side of the review fixes, already applied), `add_kr_tests.py` (the one-off additions to `test_ng.py`, already applied), `pagecopy.py` (the page copy change) |
| `jp/` | Japan (Phase 6c): `notes.md` (what was read, where, and the design), `scen_jp.py` and `scen_jp_review.py` (the Japan scenarios and those from the review, with their expectations, also inside `test_ng.py`), `dump_jp.py` (writes each to text), `jp_module.js` (the Japan part of `pn_block.js`), `rebuild.sh` (splices the Canada, India, China and Japan modules into `pn_block.js` and `ng.js` and dumps the Japan scenarios; superseded by `kr/rebuild.sh`, which splices all five modules), `wire_jp.py` and `wire_jp_review.py` (the one-off wiring and the form and data side of the review fixes, already applied), `add_jp_tests.py` (the one-off additions to `test_ng.py`, already applied), `pagecopy.py` (the page copy change) |
| `cn/` | China (Phase 6b): `notes.md` (what was read, where, and the design), `scen_cn.py` and `scen_cn_review.py` (the China scenarios and those from the review, also inside `test_ng.py`), `dump_cn.py` (writes each to text), `cn_module.js` (the China part of `pn_block.js`), `rebuild.sh` (splices the Canada, India and China modules into `pn_block.js` and `ng.js` and dumps the China scenarios; superseded by `jp/rebuild.sh`, which splices all four modules), `wire_cn.py` and `wire_cn_review.py` (the one-off wiring and the form side of the review fixes, already applied), `add_cn_tests.py` (the one-off additions to `test_ng.py`, already applied), `pagecopy.py` (the page copy change) |
| `in/` | India (Phase 6a): `notes.md` (what was read, where, and the design), `scen_in.py` and `scen_in_review.py` (the India scenarios and those from the review, also inside `test_ng.py`), `dump_in.py` (writes each to text), `in_module.js` (the India part of `pn_block.js`), `rebuild.sh` (splices the Canada and India modules into `pn_block.js` and `ng.js` and dumps the India scenarios; superseded by `cn/rebuild.sh`, which splices all three modules), `wire_in.py` (the one-off wiring into the rest, already applied), `pagecopy.py` (the page copy change) |
| `can/` | Canada (Phase 5): `notes.md` (what was read, where, and the design), `scen_can.py` and `scen_can_review.py` (the Canada scenarios and those from the review, also inside `test_ng.py`), `dump_can.py` (writes each to text), `can_module.js` (the Canada part of `pn_block.js`), `rebuild.sh` (splices it into `pn_block.js` and `ng.js` and dumps the scenarios; superseded by `in/rebuild.sh`, which splices both modules), `pagecopy.py` (the page copy change) |
| `br/` | Brazil (Phase 4): `notes.md` (what was read, where, and the design), `scen_br.py` and `scen_br_review.py` (the Brazil scenarios and those from the review, also inside `test_ng.py`), `dump_br.py` (writes each to text), `br_module.js` (copy of the Brazil part of `pn_block.js`, for reading) |
| `us/` | Other US states (Phase 3): `notes.md`, the reading notes per state, including which were read only through secondary sources |
| `review-<date>/`, `review-<date>-<law>/` (outside the repo) | One folder per independent review, thirteen in all: `findings.json`, `coverage.md` (what was checked against what) and `review-fixes.md` (finding by finding, what changed); from Brazil on also the reviewer's scenarios, from India on the outputs before and after |
| `incoming/` (outside the repo) | The files of each deployment as they were handed over: the first build (12 November 2026) at the top level, then one folder per phase, `2026-11-12-regimes` to `2026-11-13-za`. Nothing was committed between phases, so this is the only record of the intermediate states; `sg/pre-sg/`, `au/pre-au/` and `za/pre-za/` repeat three of them (28 of their 32 files are byte-identical to files here). Nothing in the build reads these folders |
| `pn_block.js` | Working copy of the privacy notice part of `ng.js`, spliced in between the PRIVACY NOTICE and AI TRANSPARENCY NOTICE markers. `ng.js` is the source of truth |
| `test_ng.py` | Playwright test: scenarios for all four generators, a scan of every generated sentence for WP260 qualifiers ("may", "might", "some", "often", "possible"), doubled full stops and em dashes, UI behaviour, Save/Load/Clear/Forget, downloads, 390px overflow. Needs a served tree with the site chrome: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 test_ng.py TREE SHOTS` |

Generated wording never uses the WP260 qualifiers. The test enforces it, so a new
sentence that says "may" fails the build rather than reaching a notice.

Independent review, 12 November 2026: a separate reviewer that had not seen the build checked every
legal statement against the GDPR, WP260, the consolidated AI Act and the Article 50 guidelines
C(2026) 7702. 37 findings (3 high, 8 medium, 26 low), all applied. `review-2026-11-12/` holds
`findings.json`, `coverage.md` (what was checked against what) and `review-fixes.md` (finding by
finding, what changed). Two clauses of the data protection policy come from the frozen GDPR
Readiness labels; the generator overrides their wording (`DP_CLAUSE` in `ng.js`) and
`readiness-data.js` is untouched.

Regimes, 12 November 2026: the privacy notice covers the EU GDPR, the UK GDPR with the Data
Protection Act 2018, and the Swiss FADP. The first law ticked (in that order) leads the main
text; each other one adds its own section and rows (matrix Parts J and K). Nothing ticked reads
as the EU GDPR, so saved answers load unchanged. A second independent review of the UK and Swiss
rules found 23 points (2 high, 4 medium, 17 low), all applied: `review-2026-11-12-regimes/`
holds `findings.json`, `coverage.md` and `review-fixes.md`. Tests: 387 checks, 0 failures.
The plan for the next regimes is the project doc `claude/notice-generators-regimes-plan.md`.

California, 12 November 2026 (Phase 2 of that plan): the CCPA and its regulations, both effective
1 January 2026, ADMT included (matrix Part L, rows C00 to C26, in `regime/matrix-part-L.md`). The
CCPA works by statutory categories, so it has its own form section and builder (`caBody`,
`caChecks`, `caLead` in `ng.js`). California alone gives a privacy policy with the notice at
collection inside it; with another law leading, it is an "Additional information for California
residents" section. A third independent review found 25 points (1 high, 8 medium, 16 low), all
applied: `review-2026-11-12-california/` holds `findings.json`, `coverage.md` and
`review-fixes.md`. Tests: 555 checks, 0 failures; outside the California scenarios, no output
changed.

Other US states, 12 November 2026 (Phase 3): the consumer privacy laws of 22 states other than
California (18 in force; Oklahoma, Louisiana, Alabama and Vermont from 2027 and 2028), matrix Part M
(rows M00 to M27, `regime/matrix-part-M.md`). One module for all of them (`usBody`, `usChecks`,
`usLead` in `ng.js`; per-state data `US_STATES` in `ng-data.js`): tick the states, describe each
category once, and the text asks only for what the ticked states need. Reading notes per state,
including which were read only through secondary sources, are in `us/notes.md`. The independent
review is in `review-2026-11-12-us/`.

Brazil, 12 November 2026 (Phase 4): the LGPD (Law 13,709/2018, consolidated after Law 15,352/2026)
with the ANPD resolutions on small agents (2/2022), the encarregado (18/2024), international transfers
(19/2024) and EU adequacy (32/2026); matrix Part N (rows N01 to N25, `regime/matrix-part-N.md`). The
LGPD is built like the GDPR, so a Brazil-led notice reuses the shared answers with its own fields for
the Article 7 and 11 bases, the encarregado, Article 33 transfers, children and automated decisions
(`brLead`, `brSection`, `brChecks` in `ng.js`; `BR_BASES`, `BR_SENS`, `BR_MECH`, `RIGHTS_BR` in
`ng-data.js`). Brazil sits after Switzerland and before California in the order of laws. A fifth
independent review found 20 points (1 high, 6 medium, 13 low), all applied:
`review-2026-11-12-br/` holds `findings.json`, `coverage.md`, `review-fixes.md` and the reviewer's
scenarios. Tests: 966 checks, 0 failures; the 34 scenarios of the earlier regimes are byte-identical
to the build deployed before.

Canada, 12 November 2026 (Phase 5): PIPEDA (current to 19 October 2026) with the Privacy Commissioner's
guidelines on meaningful consent and on cross-border processing, Quebec's private-sector Act as amended by
Law 25 (current to 15 October 2026, read through extracts because LegisQuebec did not answer), and the
Alberta and British Columbia PIPAs; matrix Part O (rows Q01 to Q32, `regime/matrix-part-O.md`). The user
ticks the laws that apply; nothing ticked reads as PIPEDA. The Canadian laws have no legal bases, so a
Canada-led notice reuses the shared answers with its own fields per purpose (condition of service, form of
consent, sensitivity) and its own questions on the person accountable, processing outside Canada and
Quebec's duties (`canLead`, `canSection`, `canChecks` in `ng.js`; `CAN_JUR`, `CAN_CONSENT`, `RIGHTS_CAN`,
`CAN_REQ`, `CAN_COMPLAIN` in `ng-data.js`). Canada sits after Brazil and before California in the order of
laws. A sixth independent review found 19 points (2 high, 7 medium, 10 low), all applied:
`review-2026-11-12-can/` holds `findings.json`, `coverage.md`, `review-fixes.md` and the reviewer's
scenarios. Tests: 1,305 checks, 0 failures; the 57 scenarios of the earlier regimes are byte-identical to
the build deployed before.

India, 12 November 2026 (Phase 6a): the Digital Personal Data Protection Act, 2023 (sections 2 to 17)
and the Digital Personal Data Protection Rules, 2025 (Rules 1 to 23 and the Schedules), read on MeitY's
Gazette copies, with the corrigenda of 10 December 2025 and the commencement notification G.S.R. 843(E);
matrix Part P (rows I01 to I25, `regime/matrix-part-P.md`). The DPDP Act has no legal bases: each purpose
rests on consent or a legitimate use in section 7, set per purpose with the goods or services it enables
(Rule 3). The rest is in an India section of the form (contact person, link and other means, response
period, the Board, languages, Consent Manager, children, persons with disability, Third Schedule class,
processing outside India) (`inLead`, `inSection`, `inChecks`, `IN_SECTION` in `ng.js`; `IN_GROUNDS`,
`IN_ERASE` in `ng-data.js`). India sits after Canada and before California in the order of laws. A seventh
independent review found 22 points (3 high, 6 medium, 13 low), all applied: `review-2026-11-12-in/` holds
`findings.json`, `coverage.md`, `review-fixes.md`, the reviewer's scenarios and the outputs before and after.
Tests: 1,626 checks, 0 failures; the 88 scenarios of the earlier regimes are byte-identical to the build
deployed before.

China, 12 November 2026 (Phase 6b): the Personal Information Protection Law (all 74 articles), the Network
Data Security Management Regulations (Arts. 2, 21 to 28, 34 to 39 and 42), the Provisions on the Cyber
Protection of Children's Personal Information (Arts. 2, 8 to 10), the Compliance Audit Measures (Art. 12)
and the CAC announcement of 18 July 2025, all read in Chinese on the CAC's site; matrix Part Q (rows Z01 to
Z23, `regime/matrix-part-Q.md`). Each purpose has an Article 13 ground, a sensitive answer (with the
necessity and impact) and, with children's data, an under-14 answer; each recipient that is another
processor has its contact, method, categories and whether it relies on consent; overseas recipients have
their own list under transfers (Article 39). The rest is in a China section of the form (scope and the
representative in China, where an offshore processor processes, the officer, methods, handling after
retention, account deregistration, personalised push, children) (`cnLead`, `cnSection`, `cnChecks`,
`CN_SECTION` in `ng.js`; `CN_BASES` in `ng-data.js`). China sits after India and before California in the
order of laws. An eighth independent review found 30 points (2 high, 9 medium, 19 low), all applied:
`review-2026-11-12-cn/` holds `findings.json`, `coverage.md`, `review-fixes.md`, the reviewer's scenarios
and the outputs before and after. Tests: 1,962 checks, 0 failures; the 125 scenarios of the earlier regimes
are byte-identical to the build deployed before.

Japan, 12 November 2026 (Phase 6c): the Act on the Protection of Personal Information (as in force on
2 November 2026), its Enforcement Order and Enforcement Rules, read in Japanese on e-Gov, with PPC Notice
No. 1 of 2019 (designated countries) and the PPC general guidelines in part; matrix Part R (rows T01 to T27,
no T04, `regime/matrix-part-R.md`). The APPI has no legal bases: each purpose has a special care-required
answer (with its Article 20(2) ground), each third-party recipient an Article 27 basis (consent, law,
exception, joint use or the opt-out scheme), and third parties in foreign countries have their own list under
transfers (Article 28, with Rules Article 17 information for consent rows). The rest is in a Japan section of
the form (scope and where a business abroad is, kind of business and representative, joint use and opt-out
items, personal related information, pseudonymously and anonymously processed information, security measures,
requests and fee, complaints, accredited organisation, children) (`jpLead`, `jpSection`, `jpChecks`,
`JP_SECTION` in `ng.js`; `JP_SENS_GROUNDS`, `JP_PROV`, `JP_XBASIS` in `ng-data.js`). Japan sits after China
and before California in the order of laws. The 2026 amendment (Act No. 56 of 2026) is not in force and not
modelled. A ninth independent review found 27 points (3 high, 7 medium, 17 low), all applied:
`review-2026-11-12-jp/` holds `findings.json`, `coverage.md`, `review-fixes.md`, the reviewer's scenarios and
the outputs before and after. Tests: 2,354 checks, 0 failures; the 168 scenarios of the earlier regimes are
byte-identical to the build deployed before.

South Korea, 13 November 2026 (Phase 6d): the Personal Information Protection Act (as in force on 11 September
2026) and its Enforcement Decree (as in force on 10 November 2026), read in Korean on law.go.kr, with the PIPC's
privacy policy drafting guidelines (April 2026); matrix Part S (rows S01 to S34, `regime/matrix-part-S.md`). A
Korea-led document is the Article 30 privacy policy, titled "<name> Privacy Policy". Each purpose has an
Article 15(1) basis (with the law, or what follows a refusal of consent) and a sensitive data answer (sensitive
information, unique identifiers and resident registration numbers, each with its basis); data processed with
and without consent are in separate tables (Article 22(3)). Each third-party recipient has an Article 17 or
18(2) basis, the items and its retention; each service provider its sub-processors; transfers abroad have their
own list under transfers (Article 28-8, with the Article 28-8(2) items). The rest is in a Korea section of the
form (presence in Korea, domestic representative, chief privacy officer, destruction procedure and methods,
further use criteria, security measures, sensitive information made public, pseudonymised information,
cookies, requests, objections, fee, transmission, automated decisions, children under 14, earlier versions)
(`krLead`, `krSection`, `krChecks`, `KR_SECTION` in `ng.js`; `KR_BASES`, `KR_PROV`, `KR_XBASIS` in
`ng-data.js`). Korea sits after Japan and before California in the order of laws. The 2027 amendments are not
in force and not modelled. A tenth independent review found 30 points (3 high, 8 medium, 19 low), all applied:
`review-2026-11-13-kr/` holds `findings.json`, `coverage.md`, `review-fixes.md`, the reviewer's scenarios and
the outputs before and after. Tests: 2,720 checks, 0 failures; the 207 scenarios of the earlier regimes are
byte-identical to the build deployed before.

Singapore, 13 November 2026 (Phase 6e): the Personal Data Protection Act 2012 (2020 Revised Edition, current
version as at 13 November 2026) and the Personal Data Protection Regulations 2021 (reg 1A as amended by
S 580/2026, reg 12 by S 86/2026), read Part by Part on Singapore Statutes Online, with the Do Not Call Registry
Regulations 2013 (regs 15 to 17) and the PDPC's Advisory Guidelines on Key Concepts (29 April 2026), on
children's personal data (2024) and on NRIC numbers (2018) through extracts; matrix Part T (rows H01 to H30,
`regime/matrix-part-T.md`; G is taken by the data protection policy). A Singapore-led document is the "<name>
Data Protection Policy". Each purpose has how the PDPA allows it (consent, deemed consent by conduct, for a
contract or by notification, legitimate interests, business improvement, employment, another exception, or a
law); each recipient its role, purpose and location; transfers outside Singapore have their own list under
transfers (section 26, regs 9 to 12). The location test fails closed: a mixed or unrecognised location is not
read as Singapore. The rest is in a Singapore section of the form (scope, data protection officer, requests and
fee, complaints, security, corporation status for business improvement, NRIC numbers, children and the age of
consent, Do Not Call) (`sgLead`, `sgSection`, `sgChecks`, `SG_SECTION` in `ng.js`; `SG_BASES`, `SG_XBASIS` in
`ng-data.js`). Singapore sits after Korea and before California in the order of laws. Data portability
(Part 6B) is not in force and not modelled. An eleventh independent review found 26 points (3 high, 12 medium,
11 low), all applied: `review-2026-11-13-sg/` holds `findings.json`, `coverage.md`, `review-fixes.md`, the
reviewer's scenarios and tools, and the outputs before and after. Tests: 3,190 checks, 0 failures; the 245
scenarios of the earlier regimes are byte-identical to the build deployed before.

Australia, 13 November 2026 (Phase 6f): the Privacy Act 1988, Compilation No. 104 (4 June 2026), read on the
Federal Register of Legislation, with APP 1.7 to 1.9 from 10 December 2026 (Privacy and Other Legislation
Amendment Act 2024, Schedule 1, Part 15), the Privacy Regulations 2025 (no APP 8.3 countries) and the OAIC APP
Guidelines, Chapters B, 1 (version 2.0, 30 September 2026), 5 and 8; matrix Part U (rows U01 to U29,
`regime/matrix-part-U.md`). An Australia-led document is the "<name> Privacy Policy" (APP 1.4) carrying the APP 5
matters. Each purpose has whether it involves sensitive information and how APP 3.3 or 3.4 allows it, whether an
Australian law requires or authorises collection, and the main consequences of not providing it; each recipient
its purpose and location; overseas recipients have their own list under transfers (APP 8, s. 16C), with
storage-only providers and own offices apart from disclosures. The location test fails closed. The rest is in an
Australia section of the form (scope, small business, privacy contact, how information is collected and held,
anonymity, automated decisions under APP 1.7 to 1.9, direct marketing, requests, complaints with an external
dispute resolution scheme and a registered APP code, children) (`auLead`, `auSection`, `auChecks`, `AU_SECTION`
in `ng.js`; `AU_SENS`, `AU_PGS`, `AU_XBASIS`, `AU_SB` in `ng-data.js`). A small business operator with no exception
gets a voluntary policy without the OAIC route. Australia sits after Singapore and before California in the
order of laws. Organisations only: agencies are not modelled. A twelfth independent review found 20 points
(5 high, 8 medium, 7 low), all applied: `review-2026-11-13-au/` holds `findings.json`, `coverage.md`,
`review-fixes.md`, the reviewer's scenarios and tools, and the outputs before and after. Tests: 3,743 checks,
0 failures, with a rule that every Australia placeholder comes with a missing row; the 295 scenarios of the
earlier regimes are byte-identical to the build deployed before.

South Africa, 13 November 2026 (Phase 6g): the Protection of Personal Information Act 4 of 2013 (Gazette 37067),
read on gov.za, with the Regulations (2018, as amended from 17 April 2025: the right to object at collection, correction
outcome within 30 days, opt-out is not consent), the Health Information Regulations 2026 and the Information
Regulator's guidance notes on information officers, direct marketing and children; matrix Part V (rows V01 to V32,
`regime/matrix-part-V.md`). A South Africa-led document is the "<name> Privacy Notice" (s. 18). Each purpose has its
s. 11(1) basis, special personal information and how s. 27 allows it, any law requiring or authorising collection,
whether supply is voluntary or mandatory, and the consequences of not providing it; each recipient its purpose and
location; transfers outside South Africa have their own list under transfers (s. 72), each with the level of
protection the country affords. The location test fails closed. The rest is in a South Africa section of the form
(scope, Information Officer and registration, PAIA manual, children, direct marketing under s. 69, automated
decisions under s. 71, security, requests and fee, complaints, codes of conduct) (`zaLead`, `zaSection`, `zaChecks`,
`ZA_SECTION` in `ng.js`; `ZA_BASES`, `ZA_SPECIAL`, `ZA_SPECIAL_SEC`, `ZA_KIDS`, `ZA_XBASIS`, `ZA_FURTHER`, `ZA_DM`,
`ZA_ADM` in `ng-data.js`). The notice prints the Regulator's contact details from its contact page. South Africa
sits after Australia and before California in the order of laws. Private bodies only: public bodies get a warning. A
thirteenth independent review found 18 points (3 high, 3 medium, 12 low), all applied: `review-2026-11-13-za/` holds
`findings.json`, `coverage.md`, `review-fixes.md`, the reviewer's scenarios and tools, and the outputs before and
after. Its location fixes (a postcode never overrides other places; multi-country regions and unnamed backup sites
are left over) were applied to the Australia test too. Tests: 4,322 checks, 0 failures, with a rule that every South
Africa placeholder comes with a missing row; the 351 scenarios of the earlier regimes are byte-identical to the build
deployed before.

Done since the first pass: the home page flyout entries and the Privacy & AI card chip (HOME-02,
on Simeon's instruction); the site assistant index (SA-09, 13 November 2026: the page's explainer,
one passage per law and four catalogue entries, read from the page by `generators()` in
`assistant-build/build_index.py`). A new law also needs a row in `NG_LAWS` there, two or three
written questions for its chunk and an index rebuild.

Paths. The scripts in the per-law folders were written for the build session and carry its paths:
the build folder at `/home/claude/ng-build/build`, the served test tree at `/home/claude/ng-test`,
scratch output in `/tmp`. Put the folder there or change the paths before rerunning one of them.
`build_page.py` and `test_ng.py` take their paths as arguments. The regression diffs are a chain:
`za/diff_all.py` loads `/tmp/scen_all8.py` (a copy of `za/scen_all8.py`), which loads
`/tmp/scen_all7.py` (`au/scen_all7.py`), which loads `/tmp/scen_all6.py` (`sg/scen_all6.py`). All
406 scenarios and their expectations are also in `test_ng.py` (`SCEN`, `EXPECT`), the test to rerun.

Audit, 13 November 2026 (AUDIT-01), on the files as deployed (`ng.js` 112dc36bf26dc526569867e0589d718a,
`ng-data.js` 5957cdb6c251816d3f5a47a7a0590e87, `ng.css` ec5c56e061a2b61b3c060de9bd7bd16d,
`notice-generators.html` 5e99a074ab9bea96fa1597b8be2d5798): `ng.js` holds `pn_block.js` byte for byte
between its two markers, and the eight module files lie inside it one after the other, each byte for byte;
`build_page.py` reproduces the page byte for byte; `test_ng.py` gives 4,322 checks, 0 failures; all
382 rows of `MATRIX` in `ng-data.js` have a row in the matrix doc (the doc also has X01 to X05, which
are documentation only, and A11, a check `ng.js` creates inline); an HTML payload added to the
free-text answers of all 406 scenarios produced no element and ran no script in the form or in any
output. Record: `tool-baselines/2026-11-13-AUDIT-01/`, kept outside the repo.
