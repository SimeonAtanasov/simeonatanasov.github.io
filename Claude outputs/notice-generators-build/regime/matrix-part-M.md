## Part M. Other US states: state consumer privacy laws

Added 12 November 2026. As of that day 22 states other than California have a comprehensive consumer
privacy law: 18 in force (Virginia, Colorado, Connecticut, Utah, Iowa, Indiana, Tennessee, Montana,
Texas, Oregon, Delaware, New Hampshire, New Jersey, Nebraska, Maryland, Minnesota, Kentucky, Rhode
Island) and 4 enacted in 2026 with later dates (Oklahoma and Louisiana 1 January 2027, Alabama 1 May
2027, Vermont 1 January 2028). Florida's narrower law is not covered. How each text was read, and what
it says, is in `build/us/notes.md`; the per-state data the generator uses is `US_STATES` in
`ng-data.js`.

**Sources.** Read in the official text: Virginia (law.lis.virginia.gov), Connecticut (cga.ct.gov 2026
Supplement, with P.A. 25-113), Utah (le.utah.gov), Iowa (Iowa Code 2026 PDF), Texas
(statutes.capitol.texas.gov), Montana (MCA 2025), Delaware (delcode, both versions), Maryland
(mgaleg), Minnesota (2026 Minnesota Statutes); Colorado's rules from the Attorney General's official
PDF, its statute from the 2024 C.R.S. as reproduced on colorado.public.law (the official C.R.S. is
hosted only by LexisNexis). Read through WebFetch summaries of the official page: Oregon, New Jersey
(chaptered law), Rhode Island. The independent review then read Indiana, Tennessee (the 2023 act), Oklahoma, Alabama,
Louisiana and Vermont in the official text, and New Hampshire's HB 1220 as reproduced. Still read only
through secondary sources or summaries, marked "s" in `US_STATES` and named in check M00 so the user
confirms them: New Hampshire, Nebraska, Kentucky.

**Why one module.** All these laws follow Virginia's notice model; the differences are additions, not
a different structure. So the generator has one "Other US states" section: tick the states, describe
each category of personal data once, and the text asks only for what the ticked states need. Rights
are listed once, with the states that give each where not all do. When these laws are the only ones
ticked, the document is a privacy policy; with the EU, UK or Swiss law leading, or with California
leading, it is an "Additional information for residents of other US states" section.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| M00 | Applicability | Each state's scope section | Always (check) | Each ticked state's thresholds, printed from `US_STATES`; states read only through secondary sources named for confirmation. Consumers act in a personal or household capacity |
| M01 | Categories processed | VA 59.1-578(C)(1); CO 6-1-1308(1)(a)(I), Rule 6.03(A)(1)(a); TX 541.102(a)(1); OR, MD incl. sensitive | Always | One row per category, granular (Colorado examples), what it includes, whether sensitive; sensitive rows are labelled in the table |
| M02 | Purposes | VA (C)(2); UT 13-61-302(1)(a)(ii); CO Rule 6.03(A)(1)(b); MN subd. 1(a)(2) | Always | Per category |
| M03 | Sensitive data | VA 59.1-578(A)(5), (6); CT 42-520(a)(1)(D), (G), (H), (a)(3); UT 13-61-302(3); IA 715D.4(2); MD 14-4707(a)(1), (2); OR 646A.578(2)(d) | A sensitive row | Consent, and the way to withdraw it (with the shortest ticked deadline); known child: COPPA. Utah and Iowa: notice and opportunity to opt out (consent meets both). Maryland: only where strictly necessary for a requested product or service (warn), and never sold (missing). Precise geolocation sold while VA, OR or CT (from 1 October 2026) is ticked: missing |
| M04 | Sharing with third parties | VA (C)(4), (5); CO Rule 6.03(A)(1)(d), (e); OR 646A.578(4)(d), (e); MD 14-4707(d)(4), (5); CT (b)(1)(D), (E); TN 47-18-3204(c)(4), (5); LA 51:1780.4(B)(1)(d), (e); VT 2415e(c)(1)(D), (E) | A shared or sold row | Categories of third parties with the data each receives and whether each buys it; for Colorado, Maryland and Oregon also what each does with it. Buyers not identified: missing where CT, TN, LA, VT, MN or MT is ticked, warn otherwise. None: the notice says so |
| M05 | Selling, targeted advertising, profiling | VA (D); CO 6-1-1308(1)(b), 6-1-1306(1)(a)(III); NJ sec. 3b; MD 14-4707(e); MN subd. 1(b) | Always | Per activity, the categories involved, and where to opt out; none: the notice says so |
| M06 | Opt-out preference signals (revised after review) | CO 6-1-1306(1)(a)(IV)(B), Rule 6.03(A)(4)(e); CT 42-520(c)(1)(A)(ii); OR 646A.578(5); MT 30-14-2809(3); DE 12D-106(e); MD 14-4707(f)(3); MN 325M.14 subd. 3; TX 541.055(e); NH; NJ sec. 8b; NE (conditional) | Selling or targeted advertising | Required in CO (1 July 2024), CT, MT, NH (1 January 2025), NJ (15 July 2025), MN (31 July 2025), OR, DE (1 January 2026), VT (1 January 2028); conditional in TX, NE, LA (an agent's signal where the controller already honours signals for another state); Maryland: the 14-4706(b) agent duty, a link or signal being optional methods. Colorado needs an explanation of how signals are processed |
| M07 | Rights | VA 59.1-577(A) and equivalents | Always | Access; correct (not Iowa; Indiana: data provided); delete (Utah, Iowa: data provided); portability (data provided or data processed, per state; Indiana: a copy or summary once a year); opt out of sale, targeted advertising (not Iowa), significant profiling (not Utah, Iowa); a list of specific third parties (OR, MN; DE from 2027); a list of the third parties sold to (CT, VT); a list of categories of third parties (DE now, MD); question a profiling decision (CT, MN, VT); no discrimination. The "In short" sentence names correction and appeal only where a ticked state gives them |
| M08 | Request methods | VA (E); TX 541.055; NE sec. 11; OK sec. 6; LA 51:1780.3(E); CO Rule 6.03(A)(4)(a) | Always | Methods with details; no new account; Texas, Nebraska, Oklahoma, Louisiana: two or more, and with a website a web mechanism (email only for a business that operates exclusively online with a direct relationship) |
| M09 | Authentication | CO Rule 6.03(A)(4)(d) | Always (missing for Colorado, warn otherwise) | How requests are authenticated |
| M10 | Authorised agents | CO 6-1-1306(1)(a)(II), Rule 6.03(A)(4)(b); CT 42-519; TX 541.055(e); MT 30-14-2809; MN subd. 2(d) | Opt-out processing (missing for Colorado) | How an agent submits an opt-out; VA, UT, IA, IN, TN, KY, OK have no agent provision (note) |
| M11 | Appeal | VA 59.1-577(C); CO 6-1-1306(3); OR 646A.576; NJ sec. 4f; MN subd. 5 | A state with an appeal right (all but Utah and Alabama) | How to appeal; answer within 60 days, 45 in CO, OR, NJ, MN, extendable by 60 in CO and MN; if denied (and with every answer in CO and MN), the Attorney General complaint route (MD: Consumer Protection Division; NJ: Division of Consumer Affairs) |
| M12 | Active email or online contact | CT (b)(1)(G); DE (c)(6); MT (5)(e); OR (4)(f); MD (d)(6); MN (a)(6); NH; NJ; RI; VT | Those states | The controller's email in section 1 |
| M13 | Date last updated | CO Rule 6.03(A)(8); CT (b)(1)(I) month and year; MT (5)(g); MN (a)(8); NH; NJ effective date; VT | Those states | Shown in the meta line or the section intro; month and year for CT and VT; New Jersey: "Effective and last updated" |
| M14 | Material changes | CO Rule 6.04; CT (b)(3); MT (8); MN subd. 1(e); NJ sec. 3a; VT | Those states | How changes are notified; an opportunity to withdraw consent for data already held |
| M15 | Large language models | CT (b)(1)(H) from 1 July 2026; VT from 1 January 2028 | Those states | Whether personal data is collected, used or sold to train large language models |
| M16 | Retention | MN subd. 1(a)(7) | Minnesota | Per category; "as long as necessary" fails |
| M17 | Oregon names | OR 646A.578(4)(g) | Oregon | Registered business name and any assumed name used in Oregon |
| M18 | Rhode Island buyers | RI 6-48.1-3 | Rhode Island and a sold row | Every third party to which personally identifiable information has been sold, or to which the controller plans to sell it |
| M19 | Statutory sale notices | TX 541.102(b), (c); LA SB 386 | Texas or Louisiana and sensitive data sold | "NOTICE: We may sell your sensitive personal data." and, for biometric data, "NOTICE: We may sell your biometric personal data." The wording is fixed, so the WP260 language check skips these two sentences |
| M20 | Colorado profiling | CO Rule 9.03(A) | Colorado and a profiling row | Decisions, data used, logic, how used with any human involvement, evaluation and outcome, benefits and consequences, how to opt out |
| M21 | Minors | CT (a)(1)(I); OR (2); MD (a)(4), (5); MT (2)(d); NJ sec. 9; DE; VA (F); CO | Selling, targeted advertising or profiling (check) | The ticked states' rules, printed |
| M23 | Laws not yet in force | Effective dates | A ticked state in force after the notice date (check) | Listed with dates |
| M24 | Consistency | Good practice | Another law leads (warn) | Special category data without a sensitive US row; an independent or joint controller recipient while nothing is shared or sold; a solely automated decision while no row is profiling |
| M25 | Publication | CO Rule 6.02(E); CT (b)(2); MT (6), (7), (10); MN subd. 1(c), (d), (g); VT | Delivery | "Privacy" link on homepage, app store page and app settings; offline medium; languages; accessibility (incl. NH after HB 1220) |
| M26 | Opt-out link and method outside the notice | CO 6-1-1306(1)(a)(III); CT (c)(1)(A)(i); MT (4); MN subd. 1(b); OR (5); DE (e); MD (f)(3); NH | Delivery, opt-out processing | Clear and conspicuous link; a method outside the notice in CO, MT, MN; signals with their dates |
| M27 | Consent for sensitive data | VA (A)(5); CT (a)(1)(D), (G); OR (1); MT (1)(c); DE; NJ; MN; RI; VT; MD; AL | Delivery, a sensitive row | Consent before processing by a clear affirmative act; withdrawal as easy; stop within 15 days (CT, OR, DE, NJ, MN, RI, VT), 30 (MD) or 45 (MT, AL) |
| M28 | Audience | Consumer definitions (VA 59.1-575; CT 42-515(8); TN 47-18-3201; OK sec. 1(8)) | Audience employees, job applicants, or client and supplier contacts | Missing: these laws do not cover people acting in an employment or commercial context |

**Documented, not generated.** Entity and data exemptions (GLBA, HIPAA, FCRA, FERPA and others); data
protection assessments; Colorado's sensitive data inferences deleted within 24 hours (Rule 6.03(A)(5))
and loyalty program disclosures (Rule 6.05); Connecticut's financial incentive terms presented after an
opt-out preference signal (42-520(c)(2)); Delaware's amended text from 1 January 2027 beyond the rights
noted in M07; Kentucky's 2026 amendments from 1 July 2027; New Jersey's proposed rules (N.J.A.C.
13:45L, proposed 2 June 2025; reported expired 2 June 2026 without adoption, to confirm); Washington's
My Health My Data Act and Nevada's consumer health data law, which are not comprehensive laws.

Reviewed independently on 12 November 2026: 22 findings (1 high, 11 medium, 10 low), all applied
(`review-2026-11-12-us/`). Row M22 (New Hampshire Secretary of State standards) was deleted: HB 1220
(2024) struck the requirement before the law took effect.
