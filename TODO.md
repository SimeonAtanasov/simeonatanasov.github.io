# To do

Future work on simeonatanasov.com that is not started. Each item says what it is, what it
needs and what has to be decided before work begins. Finished work is recorded in the
`Claude outputs/` READMEs and in the project's change log, not here. Updated 16 November 2026.

## 1. AI answers in the Ask panel (SA-02): built, waiting for the Cloudflare set-up

**Status, 16 November 2026.** Decided, built and tested; not live. Nothing on the site has
changed yet. Everything is in `Claude outputs/assistant-ai-build/` (README there: files,
protections, steps, the drafts for the notices). Design record: `claude/sa-02-ai-answers.md`
(project doc).

**Decisions taken (12 and 16 November 2026).** Build it. Free tier only: an open model on
Cloudflare Workers AI inside the daily free allowance of the existing Cloudflare account
(Workers Free, where use above the allowance fails and is never charged), not a paid API.
One follow-up question. Cloudflare Turnstile as the robot check, loaded only on the press.
The button is shown to every visitor whenever a search has results. Host: a Cloudflare
Worker. All protections built in (list in the build README).

**Next step, Simeon (about ten minutes, "Step 1" of the build README).** In Cloudflare: a KV
namespace, a Turnstile widget for `simeonatanasov.com`, a Worker with the content of
`worker.js`, its two bindings (`KV`, `AI`) and two secrets (`TURNSTILE_SECRET`,
`SIGNING_SECRET`). Then give Claude the Worker's address and the Turnstile site key (never
the secret key).

**Then, Claude ("Step 2" of the build README).** Baselines to the outside folder; run
`apply_sa02.py` (patches `assistant.js`, `assistant.css`, `sw.js` to `v13`); the privacy
notice section and the cookie notice entry from the drafts, after Simeon's review; the FAQ
line of the Ask panel index that says nothing leaves the browser, and an index rebuild;
both test files again; one real question on the live site; a comparison of two or three
models on real questions; the Worker's CPU time against the 10 ms of the free plan; change
log entry SA-02; a site scan for the Turnstile row of the cookie notice.

**Standing rule from this.** Do not move the Cloudflare account to Workers Paid without
first setting a spend limit for Workers: on the paid plan, AI use above the free allowance
is billed.

**To check before it goes live.** Cloudflare's certification under the EU-US Data Privacy
Framework; Cloudflare's role for Turnstile data (its Turnstile privacy addendum); whether
Article 50(2) AI Act (marking of generated text) reaches a short answer on this site, against
the AI Act Digest and the Commission guidelines of November 2026. Article 50(1) is covered:
the button, the note under it and the answer label all say AI.

**Also fixed by the same patch.** The hint text in the Ask panel's search box has been
invisible since launch (the template colours every placeholder white with `!important`);
the patch gives both input boxes a readable grey.

## 2. Assistant follow-ups (small)

- Untrack `Claude outputs/assistant-build/work/` and add it to `.gitignore`: committed by
  accident on 7 October 2026 (868bde8), harmless, but `chunks.json` adds a 2.5 MB diff on
  every rebuild.
- Rule, not a task: rebuild the index after any content change
  (`python3 "Claude outputs/assistant-build/build_index.py" --repo .`). A freshness check
  could join the rerun order in `claude/verification-method.md`.
- Retrieval test set out of date (the ranker is not worse): on 13 November 2026 the 50 questions
  in `eval_retrieval.py` gave hit@5 0.86 and hit@10 0.88 with the shipped ranker, against 0.94
  and 0.96 on 7 October 2026. The index of 2 November and today's give the same figures, so
  SA-09 changed no test result. Seven tests name digest entries by position (`ed-dNNN`,
  `ck-dNNN`) and the digest updates since 23 October moved those numbers: four of the seven now
  fail although the documents on their subject come first ("consent or pay models", "dark
  patterns in cookie banners", "google analytics without consent") or fifth ("sending personal
  data to the US"). Counted as hits they give 47 and 48 of 50, the October figures. The other
  three misses: "how is the DPIA risk level calculated" (the query rule below), "processor
  contract requirements" (the pattern expects readiness ids starting c or t; the processor
  activities are V1 to V3, and V2 comes third) and "do I have to label deepfakes" (Article 50
  is eighth, behind the labelling code, the Article 50 guidelines and the pathway step). To do:
  match digest entries by title or source instead of number, correct the readiness pattern,
  record a new baseline.
  `node "Claude outputs/assistant-build/sa_audit_check.js"` prints the figures (arguments in
  the script; the 50 tests are `sa_audit_tests.json` beside it).
- A query rule for "how is X calculated / scored / worked out" that prefers the
  `*-scoring` chunks over a tool's overview.
- A query rule for enforcement questions about a country (found 13 November 2026): the per-law
  chunks of the notice generators (SA-09) also match a country name next to "privacy law". On 84
  enforcement questions (seven phrasings, twelve jurisdictions) a generator chunk came first in
  4 and in the top three in 20; in those 4 the enforcement card had been first and is now second
  ("who enforces privacy law in" Switzerland, Brazil and Japan, "who can fine for a privacy
  breach in South Africa"). On 117 questions meant for the generators the right law chunk came
  first in 106. For "who enforces", "who can fine", "authority", "complain", "appeal" and "sue",
  prefer the `enforce` and `world` chunks. The same script measures it.
- Ids on the blocks inside the enforcement country cards, so a result can link to the
  block rather than the card.
- Replace the 50 test questions in `eval_retrieval.py` with real ones as they come up.
- Written questions for new content: a new digest entry or section gets only template
  suggestions until two or three questions are written for its chunk id in
  `questions_written.json`; the build prints how many chunks are in that state.
- Monthly, five minutes: add the questions people actually asked you (email, calls, the
  contact form) to `Claude outputs/assistant-build/questions_asked.json`, in their words,
  with the id of the passage that answers each (ids in `work/chunks.json`), then rebuild
  the index. Those rank above every generated question; the file is empty at launch.

## 3. Roadmap from 2 October 2026, not started

The privacy crosswalk from this list was built on 16 November 2026 (`privacy-crosswalk.html`);
its follow-ups are in section 8.

- AI Readiness Assessment: a copy of the readiness engine in its own folder; GDPR
  Readiness stays frozen and untouched.

## 4. Deferred tool changes

- TC-04: WP248 and CNIL criteria in the Full DPIA screening, to be done together with the
  alignment to the EDPB harmonised DPIA template once the final version lands.
- Incident & Breach Severity (ENISA), one change: the malicious intent +0.5 factor; the
  AEPD "volume x type x impact" cross-check needs a traceable source or removal; align the
  intake fields with the EDPB breach notification template when final.
- Crosswalk: a harmonised standards column once standards are cited in the Official
  Journal (the monthly check reports this); re-check the NIST texts when the AI RMF
  revision is published.

## 5. Site housekeeping, decisions pending

- Home page third-party logos (HOME-03). Decided 16 November 2026: self-host the five
  images, and the edit of their five addresses inside Career & Education is allowed (nothing
  else in that section). Not done: the network refused the download from the device shell
  (proxy 403 on all five hosts). Save the five files into `images/` by hand (hosts:
  `images.credential.net`, `api.accredible.com`, `upload.wikimedia.org`, `softacademy.bg`,
  `softuni.bg`), then ask for the swap. Afterwards confirm the home page loads no third-party
  image; `sw.js` needs no bump (new image URLs, never cached before, page is network first).
- `CNAME` says www. Checked 16 November 2026: the canonical tag and `og:url` of all 21
  pages, `sitemap.xml` (21 URLs), `llms.txt` (20 lines) and `robots.txt` all read www. What
  is left is the Play Console host declaration for the Android app, which no file shows.
- Spelling, decided 16 November 2026: nothing is converted. The digests and the tools use
  British spelling, the advice pages American; match the page being edited. Recorded in
  `claude/content-voice.md`.
- Unreferenced files left in `images/`: `power-bi-dashboard.png` (source of the Power BI tile
  script) and the `.psd`, `.tif`, `.xlsx` and `.pdf` working files. Keep or move. The playbook
  PNG, the three risk matrix PNGs and the screenshot moved out on 16 November 2026.
- Service worker: the digests are not precached; revisit if offline use matters.
- `images/pic04.jpg` is a banner in a tall slot; it wants a tile made for the slot.
- Obsidian vault: the vault copy of the study pack is one version behind since the rebuild of
  16 November 2026 (STUDY-03): `privacy-ai-act-assessments-study-pack-v2.md` at the vault top level
  and the PDF in `910_Attachments/`. Copy both from `Claude outputs/study-guides/` when the vault is
  connected, and check the md5 against the repo copies.
- SEO generator: up to date and run on 16 November 2026 (SEO-01, SEO-02); rerun it after any
  rebuild of a page that writes its own head. Nothing open.
- Merge the two side docs: `claude/site-context-addendum-2026-11-16.md` into
  `claude/site-context.md`, and the side change logs of 16 November 2026
  (`claude/tool-change-log-2026-11-16.md`, `-c.md` and `-d.md`) into `claude/tool-change-log.md`.
  The lines to merge for the housekeeping of the evening of 16 November are in `-d.md`.
- Two stale lines in `claude/notice-generators-matrix.md`: O6 and Part G still call the readiness
  labels S5 and V6 unfixed; since TC-10 (16 November 2026) they follow Articles 29 and 26(2).
  Correct both the next time the matrix is edited.

## 6. Re-verification when sources land

- Full DPIA against the final EDPB harmonised DPIA template, step by step.
- AI Act Digest: 5 of 57 corpus entries marked "not fetched"; re-read the high-risk
  classification guidelines and the serious incident guidance when final.
- Cookie Digest: 16 entries on secondary sources; SB 690 (California); Digital Omnibus
  status.
- Cookie notice and the banner's `items` arrays after each site rescan, plus the "last
  verified" date on the notice.
- `privacy-notice.html`: confirm the transfer mechanism per provider (Formspree, Render,
  GitHub) and the scanner's actual logging in `scan-banner-api`.

## 7. Notice and policy generators, follow-ups (12 November 2026)

- **Home page.** Done 12 November 2026 on Simeon's instruction (HOME-02): Portfolio flyout entries and a
  Privacy & AI card chip. Baseline kept outside the repo (MOVE-02).
- **Other regimes for the privacy notice.** UK GDPR, Swiss FADP, California CCPA, the 22 other US state
  consumer privacy laws, Brazil's LGPD, Canada (PIPEDA with the Quebec, Alberta and British Columbia
  private-sector laws), India (DPDP Act 2023 and DPDP Rules 2025), China (PIPL with the Network Data
  Security Management Regulations), Japan (APPI), South Korea (PIPA, 13 November 2026), Singapore (PDPA,
  13 November 2026), Australia (Privacy Act 1988, 13 November 2026) and South Africa (POPIA, 13 November 2026)
  are in (matrix Parts J to V). The five decided on 12 November 2026 are done; further regimes only on demand.
  A new law also needs a row in `NG_LAWS` in `Claude outputs/assistant-build/build_index.py`, two or three
  written questions for its chunk and an index rebuild (SA-09).
  Plan and method: project doc `claude/notice-generators-regimes-plan.md`.
- **Brazil open points.** The ANPD's regulation on data subject rights (LGPD Articles 9, 18, 19, 20) was not
  adopted on 12 November 2026: when it is, update the response times in `brRightsBody` and rows N12, N13.
  New ANPD adequacy decisions go into `BR_EU` and the mechanism hint (Resolution 32/2026 is reassessed
  within four years, by January 2030). The ANPD has no rules yet on seals, certificates or codes of conduct
  for transfers (N10 warns). The ECA Digital (Law 15,211/2025) is named in N18 but not modelled: decide
  whether a child audience needs its own rows. The generator writes English; Portuguese is required for the
  transfer information and N22 warns: consider a Portuguese output. Not read in the original: the
  standard contractual clauses clause by clause, the August 2025 correction to Resolution 19/2024,
  Enunciado CD/ANPD 1/2023 (secondary sources only) and CDC Article 31.
- **Canada open points.** Quebec's Act (CQLR c P-39.1) was read by the builder and the reviewer only through
  extracted fragments, because LegisQuebec answered HTTP 502 on 12 November 2026: read sections 1 to 34, 42,
  43 and 81 on the official page, in English and French, and correct `RIGHTS_CAN.qc`, `CAN_REQ.qc` and the
  Quebec rows of matrix Part O if anything differs. Bill C-36 (Protecting Privacy and Consumer Data Act) was
  at second reading: once it is in force, PIPEDA's privacy rules and its regulator change and Part O needs a
  rework. Not yet in force: PIPEDA's data mobility amendments (S.C. 2026, c. 3, ss. 389 to 397) and British
  Columbia's PIPA changes for credit reporting agencies (S.B.C. 2025, c. 31, from 1 August 2027). Alberta
  consulted on updating PIPA (February to May 2026): watch for a bill. Q13 reads section 8.1 as requiring
  identifying, locating and profiling functions to be off until the person turns them on: confirm against
  the CAI's guidance (its consent guidelines 2023-1 were read only through an unofficial translation). Not
  modelled: CASL, the provincial health information laws, Quebec's public-sector Act, a French output (Q24
  warns).
- **India open points.** The notice duty (DPDP Act s. 5; Rule 3) and the rights apply from 13 May 2027:
  before then, confirm that no notification has changed the commencement (a January 2026 proposal to cut
  the 18 months for Significant Data Fiduciaries was never notified). The Data Protection Board had no
  published complaint link on 12 November 2026 (I11 warns, the notice prints a placeholder): when the Board
  publishes its platform or app, put the link into the `inBoard` hint and row I11. Rule 14(3) as printed is
  missing words (read as a published period of at most 90 days): update I10 if a corrigendum fixes it. The
  Removal of Difficulties Order, 2026 (S.O. 5458(E)) was read only through law firm summaries: read the
  Gazette copy. Watch for notifications under s. 10 (Significant Data Fiduciaries), s. 16(1) (restricted
  countries), s. 17(3) and (5) (exemptions) and Rule 13(4) (data kept in India). Not modelled: other s. 17
  exemptions, State processing beyond a warning, breach intimation, translations into the 22 Eighth Schedule
  languages (I12 says the generator writes English only).
- **China open points.** Whether a processor outside China that collects directly from people in China
  (PIPL Art. 3(2)) is providing personal information abroad under Arts. 38 and 39 is not settled: no CAC
  guidance was found on 12 November 2026, and Z09 tells the user to take advice. Watch for CAC guidance or
  FAQs. Not read in full (the generator asks about the mechanism but does not decide it): the Provisions on
  Promoting and Regulating Cross-Border Data Flows (CAC Order No. 16, Arts. 5, 7 and 8 read as quoted), the
  Standard Contract Measures (2023), the Security Assessment Measures (2022), the outbound certification
  measures in force 1 January 2026, and the recommended standards GB/T 35273 (revision drafted June 2026)
  and GB/T 45574-2025. Not modelled: the Art. 18 exceptions to the notice, public disclosure and image
  capture (Arts. 25, 26), State organs (Arts. 33 to 37; Z17 warns), the Art. 40 volumes, large platforms
  (Art. 58; Regulations Arts. 44 to 46), written consent where other laws require it. Only the Chinese
  text is authentic and the generator writes English (Z16 warns): consider a Chinese output. Watch for PIPL
  or Regulations amendments and changes to the 1 million officer threshold (Compliance Audit Measures,
  Art. 12) or the 100,000 transfer exemption.
- **Japan open points.** The 2026 amendment (Act No. 56 of 2026, promulgated 17 July 2026) takes effect on a
  date set by Cabinet Order within two years: when the Cabinet Order, the amended Rules and guidelines are out,
  read the promulgated text and rework T17 and T18 (people under 16, consent and notices through the legal
  representative; the new biometric category, which the reviewer read as specified biometric personal
  information (特定生体個人情報) in a summarised comparison table and the PPC outline calls facial feature data;
  statistics and AI development; entrustment; breach notices). Penalties change in part from 17 January 2027
  (secondary source only). The PPC general guidelines were read only in part (2-15, 2-16, 3-1-1, 3-6-2-1,
  3-6-3, 3-8-1, 3-9, 10-7) and through a web fetch: read the rest against the rows. Not modelled: public
  bodies under Chapter 5 (T19 warns), records (Arts. 29, 30) beyond delivery notes, breach reporting
  (Art. 26), the Art. 21(4) exceptions. Only the Japanese text is authentic and the generator writes English
  (T16 warns): consider a Japanese output. New designated countries (PPC Notice No. 1 of 2019) go into
  `JP_DESIG` in `ng.js` and the basis label.
- **Korea open points.** Amendments in force on 9 March 2027 (use of personal information to develop AI,
  PIPA Arts. 28-12 to 28-15; Art. 28-12(5) adds the purposes and types to the privacy policy) and 1 July 2027
  (mandatory certification above thresholds, Art. 32-2(1) proviso): read the enforcement decree changes when
  published and rework S25. The PIPC's equivalence recognition of the EU and EEA (announcement No. 2025-68)
  was read only through a law firm update and news reports: read the announcement itself, and update
  `krEuName` and the KR_XBASIS label when it changes or when the review due before 15 September 2028 ends
  (the UK was under review in October 2026). Decree criteria for transmission (Art. 35-2) and the CPO
  qualifications (Decree Art. 32(3), Annex 1) were not modelled. Not modelled: public institutions (S26),
  video devices and generative AI services (S33), business transfers (Art. 27), breach notices (Art. 34).
  Only the Korean text is authentic and the generator writes English (S24 warns): consider a Korean output.
- **Singapore open points.** Regulation 1A (as amended by S 580/2026 from 1 September 2026) lets the data
  protection officer's contact be published in the organisation's record on the PDPC website, while Key
  Concepts 21.7 (29 April 2026) still names BizFile+: H08 and H23 follow the regulation; check the next
  revision of the guidelines. The NRIC Advisory Guidelines (2018) were read through the PDPC's media release,
  two guidance letters and the reviewer's fetch; the PDPC says they are being updated, and private
  organisations must stop using NRIC numbers for authentication by 31 December 2026 (H17 warns): update H17 when
  the new guidelines appear. Not modelled: breach notification (Part 6A), data portability (Part 6B, not in
  force: model it when it commences), the Do Not Call provisions beyond the delivery check (Part 9), business
  asset transactions, onward transfers by an organisation abroad. The Children's Guidelines (2024) were read
  through a web fetch only. The location test (`sgWhere` in `ng.js`) recognises listed places only; anything
  else is "unknown" and asks the user to check: add places when users report false "unknown" results.
- **Australia open points.** APP 1.7 to 1.9 (automated decisions in the privacy policy) apply from
  10 December 2026, to decisions made after that date: U17 is missing until the question is answered, and U29
  reminds organisations to update by then. The OAIC's APP 1.7 to 1.9 fact sheet and flowchart PDFs could not
  be read (the shell's proxy refuses oaic.gov.au and the web fetch failed); Chapter 1 version 2.0 covers the
  same ground: read them when reachable. Chapter 6 (APP 6) was not reachable for the reviewer either; the APP 6
  points rest on the Act. No country or binding scheme is prescribed for APP 8.3 (Privacy Regulations 2025):
  when one is, remove the fail-closed "prescribed" basis (`auXbasis`, U10) and model the regulation. Pending:
  the Children's Online Privacy Code (must be registered by 10 December 2026; commencement not set): read it
  when registered and decide whether it adds policy content (U19 is a check today); the tranche 2 Bill (the
  exposure draft of 31 August 2026 keeps the small business and employee records exemptions, per most
  summaries). Not modelled: agencies, credit reporting (Part IIIA), notifiable data breaches (Part IIIC), APP 4
  and 9, tax file numbers beyond a check (Privacy (Tax File Number) Rule 2015), the statutory tort, State and
  Territory laws, a separate APP 5 collection notice (a delivery row). The location test (`auWhere` in `ng.js`)
  recognises listed places only; anything else is "unknown": add places when users report false results.
- **South Africa open points.** The Information Regulator's contact details are printed in every notice (s. 18(1)(h)(v)):
  the contact page (13 November 2026) gives Woodmead North Office Park and no postal address, while the guidance notes
  still give JD House and P.O. Box 31533, Braamfontein. Confirm the postal address with the Regulator before adding it
  back (`ZA_IR` in `ng.js`, row V20); the monthly check watches the details. The POPIA and PAIA amendment proposals of
  31 August 2026 had no bill: when one is tabled, read it against Part V. The Regulator's guidance note on special
  personal information, the 2018 Regulations as first made, and the PAIA text and fee regulations were not read by
  the reviewer (the builder read the 2018 and 2025 Regulations): read them against V05 and V15. No list of countries
  with adequate protection exists (s. 72(1)(a)); if the Regulator publishes one, model it. Proposed codes of conduct
  (direct marketing, research and others): add issued codes to the V21 note. Not modelled: public bodies beyond a
  warning, the exclusions and exemptions (ss. 6, 7, 37, 38), s. 18(4) exceptions, directories (s. 70), information
  matching, the PAIA manual content, breach notification beyond a delivery row, the Consumer Protection Act, ECTA and
  the National Credit Act, languages other than English. The location test (`zaWhere` in `ng.js`) recognises listed
  places only; anything else is "unknown": add places when users report false results.
- **US state open points.** New Hampshire, Nebraska and Kentucky were read only through secondary sources
  or summaries (the official sites refused automated reading): confirm RSA 507-H, Neb. Rev. Stat. 87-1101
  onwards and KRS 367.3615 and 367.3617 against the official text and update `US_STATES` in `ng-data.js`.
  Colorado's nonprofit coverage and whether New Jersey adopted its rules (N.J.A.C. 13:45L) are unverified.
  Dated changes to watch: Connecticut P.A. 26-64 (1 October 2026, partly modelled), Delaware's amended text
  and Oklahoma and Louisiana (1 January 2027), Alabama (1 May 2027), Kentucky's amendments (1 July 2027),
  Vermont (1 January 2028). The monthly law check covers new laws and amendments.
- **California open points.** The CPPA ran preliminary rulemaking on notices and disclosures, employee data,
  friction in exercising rights and opt-out preference signals (comments closed April and May 2026): when
  proposed text appears, check matrix Part L against it. The monetary threshold ($26,625,000) is adjusted in
  January of odd years: update C00 in `ng.js` and the matrix in January 2027. ADMT uses that began before
  1 January 2027 must comply by that date (C17 says so). Documented, not generated: the 1798.145 exemptions
  (HIPAA, GLBA, FCRA data and others), the alternative opt-out link of 7015 as a design choice, risk
  assessments, cybersecurity audits and Delete Act duties of data brokers.
- **Monthly law check (scheduled task `site-notice-generators-law-check`, 1st of each month, 09:05).**
  Research only: California, UK, Swiss, EU, Brazil, Canada, India, China, Japan, Korea, Singapore, Australia, South
  Africa and US state changes that affect the matrix (Brazil, Canada, India, China and Japan added to its prompt on
  12 November 2026, Korea, Singapore, Australia and South Africa on 13 November 2026). It reports the
  rows to update; the update itself is done in a session and logged here.
- **UK and Swiss open points.** The UK Schedule 1 conditions (Parts 2 and 3) and the DPA 2018 exemptions in
  Schedules 2 to 4 are recorded as typed, not tested. The regulator plans new versions of the IDTA and the
  UK Addendum in 2026: when they land, update `TRANSFER_MECH_UK` in `ng-data.js`. Check the regulator's
  2026 transfer guidance on whether a controller abroad collecting directly from people in the UK makes a
  restricted transfer (the generator states where the controller processes the data and lists onward
  transfers only).
- **AI Act Digest doc-19.** It dates the Article 50 guidelines 20 July 2026. The document now on the
  Commission page is the Communication C(2026) 7702 final of 5 November 2026. Update in the next digest pass.
- **EDPB Digest entry 520.** Recorded as having no reachable source; the WP260 rev.01 PDF supplied on
  12 November 2026 is that source. Mark it verified in the next EDPB pass.
- **Article 86 date.** The AI Act Digest dates it 2 August 2026, crosswalk row r22 with the high-risk rules.
  The generators show both. Settle one reading across the site.
- **2026 coordinated enforcement action on transparency.** Check the requirements matrix against the EDPB
  report when it is published.
- **`ng.js` comments.** Line 13 names `test_ng.js`; the test is `test_ng.py`. The comment above
  `DP_CLAUSE` says `readiness-data.js` is frozen and keeps its label: since TC-10 (16 November 2026) the
  S5 and V6 labels follow Articles 29 and 26(2), so the comment is out of date (the two overrides still
  fit and stay). Correct both with the next change to `ng.js`.
- **Test fixtures.** Done 13 November 2026 (MOVE-02): the invented organisations in `test_ng.py` and the
  scenario files use names under the reserved `.example` domain; 4,322 checks, 0 failures afterwards.
- **Build leftovers.** Moved out of the repo on 13 November 2026 (MOVE-02), on Simeon's decision: `incoming/`
  (each phase's files as deployed, the revert chain of NG-01 in `claude/tool-change-log.md`), `sg/pre-sg/`,
  `au/pre-au/`, `za/pre-za/`, the thirteen `review-*` folders and the NAV-04, HOME-02, SA-09 and AUDIT-01
  baselines, 1,072 files, 52.7 MB, each checked by md5. They are in the `GitHub-projects-data` folder beside
  the repo, under `simeonatanasov.com/` with the same paths. New baselines and build leftovers go there too.

## 8. Privacy crosswalk, follow-ups (16 November 2026)

Page `privacy-crosswalk.html`, build folder `Claude outputs/privacy-crosswalk-build/` (README
there), project doc `claude/privacy-crosswalk.md`.

- **Next step: move to the 2025 numbering.** The ISO column and the ISO tab use the numbering
  of ISO/IEC 27701:2019, which is withdrawn, because the free public mappings use it.
  ISO/IEC 27701:2025 is restructured (management system in clauses 4 to 10, controls in
  Annex A), so a 2019 number cannot be assumed to carry over. The page moves only from a
  checked source: the standard itself (Annex D maps to the GDPR, Annex F to the 2019 edition),
  or a correspondence published free of charge by ISO or a national standards body, shown to
  Simeon before use. No table from a certification body. Decided on 16 November 2026: the BSI
  webinar deck of November 2025 (a 2025 to 2019 table for all 78 controls, from BSI's
  certification side) is not used. When a source is accepted: the steps are in the build README.
- **Recheck when** (no scheduled task of its own; add the four lines to the monthly
  "site-ai-act-standards-check", see the project doc for the wording):
  1. NIST publishes Privacy Framework 1.1 final (draft only on 16 November 2026).
  2. ISO amends ISO/IEC 27701:2025, or ISO or a national standards body publishes a free
     2019 to 2025 correspondence.
  3. The Digital Omnibus (COM(2025) 837) or the Article 30(5) proposal (COM(2025) 501) is
     adopted; both were ongoing on EUR-Lex on 16 November 2026. Rows r18 and r31 name them.
  4. The NIST repository changes either crosswalk (pinned at commit `4b9d9b7`), or the Data
     Protection Mapping Project changes its data (pinned at `2ff78ec`).
- **Licences.** The two NIST-hosted crosswalks state no licence, so the page links them and
  does not reproduce them. The GDPR crosswalk is used as a cross-check only: the NIST column is
  the site's own reading, and a reference is marked where that crosswalk agrees. If either
  author publishes a licence that allows reuse, tab 4 can show the crosswalk itself.
- **Ask panel: example questions and chooser entry (not started; Simeon, 16 November 2026: not
  now).** The index has the 36 rows (SA-11), so the page is found by search. Still to add in
  `assets/js/assistant.js`: example questions for `privacy-crosswalk` in the per-page examples,
  and the page in the "Which assessment do I need?" chooser, beside the AI crosswalk. Both mean
  a change to `assistant.js`, so bump `VERSION` in `sw.js` in the same change and log it as an
  SA entry.
- **GDPR Readiness article titles.** `readiness-data.js` shortens seven article titles
  (Articles 8, 10, 12, 13, 14, 17, 19) compared with EUR-Lex. Noticed while reading the titles
  for the crosswalk; the tool is frozen and nothing was changed.
