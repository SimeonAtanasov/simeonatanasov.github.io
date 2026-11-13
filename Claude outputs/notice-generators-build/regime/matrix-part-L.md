## Part L. California: California Consumer Privacy Act (CCPA)

Added 12 November 2026. Read on cppa.ca.gov: the CCPA (Civil Code 1798.100 onwards) as in force
from 1 January 2026, and the CCPA regulations (Cal. Code Regs. tit. 11, 7000 onwards) effective
1 January 2026, with the ADMT, risk assessment and cybersecurity audit package approved on
22 September 2025. No proposed regulations were pending on 12 November 2026; preliminary
activities on notices and disclosures, employee data, friction in exercising rights and
opt-out preference signals closed in April and May 2026. Monetary thresholds: the CPPA page
of 17 December 2024, effective 1 January 2025 (next adjustment in an odd year, 2027).

**Why California is built differently.** The CCPA asks for a privacy policy (7011) that
contains, or links directly to, a notice at collection (7012), plus separate notices when the
business sells or shares (7013), uses sensitive personal information beyond 7027(m) (7014),
offers a financial incentive (7016) or uses ADMT for a significant decision (7220). It is
organised by statutory categories of personal information (1798.140(v)(1)(A) to (K) and the
sensitive personal information of 1798.140(ae)), not by purposes and legal bases. So the
California text has its own builder and its own fields (a "California (CCPA)" form section with
one row per category). When California is the only law ticked, the document is a privacy policy
and the GDPR sections of the form are hidden. When another law leads, the same text becomes an
"Additional information for California residents" section, which says that the CCPA rights and
how to exercise them are the ones in that section. The CCPA protects California residents,
including employees, job applicants and business contacts.

| ID | Element | Source | Trigger | Rule |
|---|---|---|---|---|
| C00 | Applicability | 1798.140(d), (i); 1798.199.95(d) | Always (check) | For-profit business that collects personal information, determines its purposes and means, does business in California and has annual gross revenue above $26,625,000 in the preceding calendar year (adjusted from 1 January 2025), or buys, sells or shares the personal information of 100,000 or more consumers or households a year, or derives 50% or more of revenue from selling or sharing it. Also an entity that controls or is controlled by such a business, shares its branding and receives personal information from it; joint ventures of businesses with at least 40% each; businesses that certify voluntarily (1798.140(d)(2) to (4)). Public bodies are not businesses |
| C01 | Categories collected in the past 12 months | 1798.100(a), 1798.130(a)(5)(B), (c); 7011(e)(1)(A), 7012(e)(1) | Always | Each category in the statutory terms, with what it includes in plain words; sensitive categories named as such |
| C02 | Categories of sources | 1798.130(a)(5)(B)(ii); 7011(e)(1)(B) | Always | Per category |
| C03 | Business or commercial purposes | 1798.100(a); 7011(e)(1)(C), 7012(e)(2) | Always | Per category, specific enough for a meaningful understanding |
| C04 | Selling and sharing | 1798.130(a)(5)(C)(i); 7011(e)(1)(D) to (F), 7012(e)(3) | Always | Per category, three answers: sold now, shared now (the notice at collection), and sold or shared in the past 12 months (the policy's look-back); for any of them, the categories of third parties and the purpose. "We have not sold or shared in the past 12 months" prints only when every row says so, "and we do not sell or share it" only when nothing is sold or shared now; a business that stopped says it no longer does. No selling or sharing removes the need for an opt-out notice (7013(g)); data collected without a posted opt-out notice cannot later be sold or shared without consent (7013(h)). Sharing is disclosure for cross-context behavioral advertising (1798.140(ah), (k)); selling is for monetary or other valuable consideration (1798.140(ad)) |
| C05 | Consumers under 16 | 7011(e)(1)(G), 7011(e)(3)(I), 7070, 7071 | Always | Selling or sharing: whether the business has actual knowledge that it sells or shares the personal information of consumers under 16; if it does, the opt-in processes (13 to 15: the consumer; under 13: a parent or guardian). No selling or sharing: the policy says this means none of their data is sold or shared |
| C06 | Disclosures to service providers and contractors | 1798.130(a)(5)(C)(ii); 7011(e)(1)(H), (I) | Always | Categories disclosed for a business purpose in the past 12 months and the purpose, or that there were none |
| C07 | Sensitive personal information | 1798.121(a); 7011(e)(1)(J), (e)(2)(E), (e)(3)(D), 7014, 7027(m) | Always | A statement whether it is used or disclosed beyond the 7027(m) purposes; the 7027(m) purposes actually relied on, ticked from (1) to (8) and printed "only as reasonably necessary and proportionate" (goods or services expected, security, fraud and illegal acts, physical safety, short-term transient use, services for the business, product quality and safety, processing not to infer characteristics). If beyond: the other, specified purposes, the right to limit and where to exercise it. If not: the statement removes the need for a Notice of Right to Limit (7014(g)), and data collected without one cannot later be used beyond 7027(m) without consent (7014(h)). "Including sensitive personal information" prints only when a sensitive category is listed; otherwise "We do not collect sensitive personal information" |
| C08 | Retention | 1798.100(a)(3); 7012(e)(4) | Always | Per category, a period or the criteria; "as long as necessary" fails |
| C09 | Rights | 1798.130(a)(5)(A); 7011(e)(2) | Always | Know (categories, sources, purposes, third parties, specific pieces; beyond 12 months back to 1 January 2022 unless impossible or disproportionate, 1798.130(a)(2)(B)), delete (with exceptions), correct, opt out of sale or sharing (if any), limit (if beyond 7027(m)), opt out of ADMT (unless an exception), access ADMT, no retaliation including applicants, employees, contractors and students |
| C10 | Methods for requests | 1798.130(a)(1); 7011(e)(3)(A), (B), 7020 | Always | Exclusively online with a direct relationship: an email address is enough. Otherwise two or more methods including a toll-free number; with a website, a web method |
| C11 | Verification | 7011(e)(3)(E) | Always | A general description and what the consumer provides, covering ADMT access requests (and appeals, for that exception) when ADMT is used. Requests to opt out and to limit need no verification (7026(d), 7027(e), 7221(f)) |
| C12 | Opt-out preference signals | 7011(e)(3)(F), (G), 7025 | Always | The signal always applies to the browser or device and every profile associated with it, pseudonymous ones included (7025(c)); where the consumer is known, also to their account and, if chosen, offline selling or sharing. Whether it is processed frictionlessly (no fee, no change of experience, no pop-up or other content in response, 7025(f)), and how to turn it on. With no selling or sharing, the policy says the signal changes nothing |
| C13 | Authorized agents | 7011(e)(3)(H), 7026(j), 7027(j), 7063, 7221(j) | Always (warn if no route) | Where and how agents submit. Know, delete, correct: signed permission; the consumer can be asked to verify or confirm; not where the agent holds a power of attorney under Probate Code 4121 to 4130. Opt-out, limit and ADMT opt-out: only signed permission, no verification of the consumer |
| C14 | Notice of right to opt out | 1798.120, 1798.135; 7011(e)(3)(C), 7012(e)(5), 7013(f) | The business sells or shares | The right and the form to use, in the policy and in the notice at collection |
| C15 | Contact | 7011(e)(3)(J) | Always | A contact for questions, in the way the business mainly interacts with consumers |
| C16 | Date last updated | 1798.130(a)(5); 7011(e)(4) | Always | Updated at least once every 12 months |
| C17 | Pre-use notice for ADMT | 7010(c), (d), 7200(b), 7220, 7221(b), (c), 7222 | ADMT that replaces or substantially replaces human decisionmaking for a significant decision (financial or lending services, housing, education, employment or compensation, healthcare; not advertising) | The specific decision; how it processes personal information and the categories that affect the output; the output and how it is used, with any human role; the opt-out and the alternative process, or the human appeal with how to appeal, or the hiring or allocation exception named; access and how; no retaliation. The opt-out right is granted only when "no exception" is chosen. Two or more ways to opt out, with an online method when there is a website (7221(c)). Uses that began before 1 January 2027 comply by that date, later ones from the start (7200(b)). The two non-appeal exceptions hold only if the technology works for its purpose without unlawful discrimination (warn); the appeal exception only with a qualified human reviewer who can change the decision (7221(b)(1), warn) |
| C18 | Notice of financial incentive | 1798.125(b); 7016(c), (d) | An incentive or price or service difference | Summary, material terms with the categories involved, how to opt in, the right to withdraw and how, how the incentive is reasonably related to the value of the data, a good-faith estimate of that value and the method |
| C19 | Request metrics | 7011(e)(5), 7102 | The business knows or reasonably should know that it buys, receives for commercial purposes, sells, shares or makes available the personal information of 10,000,000 or more consumers a year | Where the metrics for the previous year are, published by 1 July; say so if they cover all individuals (7102(b)) |
| C20 | Notice at collection timing | 1798.100(a); 7012(c), (d), (e)(5), (e)(6), (f) | Delivery | At or before collection; online, a link straight to the section is enough, and that section carries the opt-out link when the business sells or shares; offline, where the policy is online; without the notice, no collection |
| C21 | Policy placement | 7003(c), (d), 7011(c), (d) | Delivery | Built from the channels: a conspicuous homepage link with the word "privacy"; for an app, the download or landing page, and optionally the settings menu; without a website, conspicuously available; printable |
| C22 | Form | 7003(a), (b) | Delivery | Plain language, readable on small screens, the languages used with California consumers, accessible: online WCAG 2.1; elsewhere, how a person with a disability gets it in another format |
| C23 | Opt-out and limit links | 1798.135; 7013(c) to (e), 7014(c), 7015, 7025(c)(6), (g), 7026(a), (g), 7027(b), (h) | Delivery, when selling, sharing or limiting applies | "Do Not Sell or Share My Personal Information" in the header or footer, or the alternative link or frictionless signal processing (not when the signal also covers offline selling or sharing, 7025(g)(3)); online, the signal plus at least one other method, and a cookie banner alone is not an opt-out method; show whether a visitor's signal was processed; a way to confirm an opt-out. "Limit the Use of My Sensitive Personal Information" in the header or footer, or the alternative link; two or more ways to limit; a way to confirm a limit request |
| C24 | Pre-use notice timing and link | 7220(b), 7221(c), (h) | Delivery, ADMT | Prominent, at or before collecting the data the ADMT will process, in the way the business mainly interacts; with an opt-out: online, a link that says what is opted out of, two or more ways, and a way to confirm an opt-out was processed |
| C25 | Offline notices | 7012(e)(6), 7003(b)(3) | Paper, telephone or a device without a screen | Where the policy is online, printed in the notice at collection, and how a person with a disability gets the policy in another format |
| C26 | Consistency with the rest of the notice | 7011(a) | Another law leads (warn) | A purpose with special category data but no sensitive California category; a solely automated decision but ADMT answered No; an independent or joint controller as recipient while every California row says not sold or shared. The California section names the sections that apply only where the leading law applies |

The policy also states the response times: confirmation within 10 business days and a response
within 45 calendar days, extendable by 45 with notice and reasons (1798.130(a)(2); 7021);
opt-out of sale or sharing and requests to limit acted on as soon as feasible and within 15
business days (7026(f), 7027(g)); an ADMT opt-out after use began stops it within 15 business
days (7221(n)); requests to opt out and to limit need no verification (7026(d), 7027(e),
7221(f)). The notice at collection says no further categories are collected without a new
notice and no incompatible use is made without consent (1798.100(a), (c); 7002(e), (f)). A
California-led policy promises no direct advance notice of changes: it says it is reviewed at
least every 12 months and that a new notice at collection comes first. Reviewed independently
on 12 November 2026 (25 findings, all applied: `review-2026-11-12-california/`).

**California points documented, not generated.** The CCPA's exemptions (1798.145, for example
data covered by HIPAA, the GLBA or the FCRA), the alternative opt-out link (7015) as a design
choice, risk assessments and cybersecurity audits (7120 onwards, 7150 onwards), and data broker
duties under the Delete Act.
