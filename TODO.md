# To do

Future work on simeonatanasov.com that is not started. Each item says what it is, what it
needs and what has to be decided before work begins. Finished work is recorded in the
`Claude outputs/` READMEs and in the project's change log, not here. Updated 13 November 2026.

## 1. AI answers in the Ask panel (SA-02): to be decided

**What it adds.** The Ask panel keeps today's search. Under the results an "Ask AI" button
appears; nothing is sent until it is clicked. On click the page sends the question plus the
top five or six passages (about 4,000 tokens) to a Cloudflare Worker that holds the API
key, checks the caps and calls Claude with a system prompt that allows answering only from
those passages, with a link per claim, or says "the site does not cover this". The answer
streams into the panel, labelled as AI-generated. One follow-up at most; no long chats.

**What the visitor gains.** An answer in sentences; two passages combined into one answer;
questions in words the site never uses; comparisons and plain-language explanations of a
scoring rule. **What stays impossible by design**: inventing, because the model only sees
the retrieved passages; reading a visitor's saved assessment answers automatically.

**Cost.** Claude Haiku 4.5 is USD 1 per million input tokens and USD 5 per million output
tokens (platform.claude.com pricing, read 7 October 2026). One answer is about 4,500 input
and 300 output tokens, roughly 0.6 cents; USD 5 covers about 800 answers. Caching the fixed
system prompt cuts the input part further. Sonnet 5.5 is double (USD 2 and USD 10).

**Caps, in order of importance.**
1. Prepaid credits with auto-reload off, in a workspace of their own with a monthly limit.
   Worst case the button stops working; search keeps working.
2. In the Worker: a daily total (for example 30 answers) and a per-visitor limit by hashed
   IP (for example 5), both falling back to search with a short note.
3. Cloudflare Turnstile on the AI button only (bots are what drain budgets); requests
   accepted from the site's origin only; questions capped at 500 characters.
4. A cache keyed by the normalised question, so a repeat is served free.

**Legal checklist before it goes live.**
- Article 50(1) AI Act (applies since 2 August 2026; the site is the provider): the panel
  says at the first interaction that the answer comes from an AI system. Today's search
  needs no such notice.
- `privacy-notice.html`: a section for the AI part. The question goes to Cloudflare and
  Anthropic; legal basis Article 6(1)(f); Anthropic's API retention period, checked and
  stated; the transfer mechanism named.
- "Not legal advice" and "do not paste confidential information" next to the button.
- Turnstile is a third-party service: load it only on use, add it to `cookie-notice.html`
  and to the `items` arrays in `cookie-consent.js` after the next scan.
- Never read saved assessment answers automatically. An "explain my result" feature, if
  ever, is a deliberate click that shows exactly what will be sent.

**Needs from Simeon.** A Cloudflare account (free tier is enough), an Anthropic API key
with prepaid credit, and the key pasted into the Worker's settings. Claude writes the
Worker and the panel changes; the two accounts are the only steps it cannot do.

**Decisions to take first.**
1. Do it at all, and when.
2. Monthly budget, and from it the daily and per-visitor caps.
3. Model: Haiku 4.5 (cheaper, fine for summarising retrieved text) or Sonnet 5.5.
4. One follow-up question allowed, or none.
5. Turnstile yes or no (a third party in the cookie notice, against bot drain).
6. Show the AI button to every visitor, or only once search has returned results.
7. Cloudflare Worker, or another host for the key.

**Build steps, once decided.** Worker (key, caps, origin check, cache, Turnstile check,
streaming); panel changes (button, answer area, disclosure, follow-up limit); notice
updates; tests (caps hit, origin refused, no passages means "not covered", no request
before the click); change log entry SA-02; design record in `claude/site-assistant.md`
(project doc), which already holds the full design.

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

- AI Readiness Assessment: a copy of the readiness engine in its own folder; GDPR
  Readiness stays frozen and untouched.
- GDPR to ISO/IEC 27701 to NIST Privacy Framework crosswalk page, on the pattern of the AI
  governance crosswalk.

## 4. Deferred tool changes

- TC-04: WP248 and CNIL criteria in the Full DPIA screening, to be done together with the
  alignment to the EDPB harmonised DPIA template once the final version lands.
- Incident & Breach Severity (ENISA), one change: the malicious intent +0.5 factor; the
  AEPD "volume x type x impact" cross-check needs a traceable source or removal; align the
  intake fields with the EDPB breach notification template when final.
- "Pseudonymisation" listed twice in `DPIA_CONTROLS` (a modifying change to verified tools;
  log it when done).
- Crosswalk: a harmonised standards column once standards are cited in the Official
  Journal (the monthly check reports this); re-check the NIST texts when the AI RMF
  revision is published.

## 5. Site housekeeping, decisions pending

- Home page third-party logos are not consent gated. They sit inside the Career & Education
  section, which is off limits without an explicit go-ahead. Self-hosting the five images
  is the better fix; gating in place is five attribute swaps.
- `CNAME` says www; check that every canonical tag, `og:url`, `sitemap.xml` and
  `robots.txt` now agree (they read www on 3 October 2026).
- From the September link audit: meta descriptions over 160 characters on 15 pages; Open
  Graph tags only on the home page; the resume button pointing at the GitHub raw URL;
  `Privacy Assessment.txt`, `draft-about.txt` and unused risk matrix images served publicly.
- British spelling in the digests, American in the advice pages: qualify the rule or
  convert the advice pages (which means regenerating `pages.json` and the study pack).
- `onetrust-cookie-banner/`, `draft.html`, `elements.html`, `test-page.html`: delete or keep.
- Four unreferenced source PNGs in `images/`, about 7 MB: keep as sources or remove.
- Service worker: the digests are not precached; revisit if offline use matters.
- `images/pic04.jpg` is a banner in a tall slot; it wants a tile made for the slot.
- Search Console is not set up, so index coverage and backlinks are unknown.
- SEO generator behind the pages (found 13 November 2026). `Claude outputs/seo-build/apply_seo.py`
  has not been run since late September 2026. Its `PAGES` table lacks five sitemap pages
  (`ai-governance-crosswalk.html`, `gdpr-enforcement.html`, `gdpr-fines-analytics.html`,
  `privacy-enforcement-worldwide.html`, `notice-generators.html`), holds the old digest counts
  (543 and 259; the pages say 553 and 263) and the September description of the assessments
  page. `llms.txt` and the counts in the page heads have been edited by hand since. A rerun
  today would put the old counts and description back, drop the five pages from `llms.txt` and
  set every sitemap `lastmod` to the file dates: do not rerun it before the table is updated.
  Decide: update the table (its 160-character limit then needs shorter descriptions for the
  assessments page, 240 characters, `gdpr-enforcement.html`, 163, and `notice-generators.html`,
  424, or a higher limit; the two enforcement pages have no seo block and would get one), or
  retire the script and keep editing by hand. The root README (which now warns),
  `claude/seo-and-crawlers.md`, `claude/legal-pages.md` and `claude/cookie-consent.md` still
  describe "edit the table and rerun".

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
- **GDPR Readiness labels (frozen tool).** The independent review of 12 November 2026 found two
  activity labels looser than the Articles they cite: S5 "only on documented instruction" (Article 29
  says instructions; documented instructions are Article 28(3)(a) for processors) and V6 "publish"
  joint controller arrangements (Article 26(2) asks for the essence to be made available). The
  data protection policy generator overrides both; fix the labels when the readiness tool is next opened.
- **`ng.js` header comment.** Line 13 names `test_ng.js`; the test is `test_ng.py`. Correct it with the next
  change to `ng.js`.
- **Test fixtures.** Done 13 November 2026 (MOVE-02): the invented organisations in `test_ng.py` and the
  scenario files use names under the reserved `.example` domain; 4,322 checks, 0 failures afterwards.
- **Build leftovers.** Moved out of the repo on 13 November 2026 (MOVE-02), on Simeon's decision: `incoming/`
  (each phase's files as deployed, the revert chain of NG-01 in `claude/tool-change-log.md`), `sg/pre-sg/`,
  `au/pre-au/`, `za/pre-za/`, the thirteen `review-*` folders and the NAV-04, HOME-02, SA-09 and AUDIT-01
  baselines, 1,072 files, 52.7 MB, each checked by md5. They are in the `GitHub-projects-data` folder beside
  the repo, under `simeonatanasov.com/` with the same paths. New baselines and build leftovers go there too.
