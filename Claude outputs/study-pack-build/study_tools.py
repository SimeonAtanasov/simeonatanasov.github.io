# Cheat sheets and self-tests for Part 3 (the six assessment tools)
# and Part 4 (the GDPR Readiness model). Authored, not extracted.

SUITE_INTRO = """The six tools share one stepper, one country and region list of 209 entries, and one
result format: a headline level, a list of factors that drove it, and an export. What differs is the
model underneath. Read the cheat sheet for a tool before reading its question bank: the questions only
make sense once you know what the scoring does with the answers.

**How the six fit together.** The Privacy Assessment is the front door and the only one that routes to
another tool: it screens a process end to end and, on the Article 35(3) trigger count, hands over to the
Full DPIA. The Legitimate Interest Test is the side door taken when the lawful basis is Article 6(1)(f),
and the Privacy Assessment flags its absence as a factor. The AI Risk Assessment runs the EU AI Act
screen over the same process when an AI system is involved. The Incident tool runs after the fact, on a
breach rather than a plan. The Third-Party Security Assessment runs on a vendor rather than a process.

**One design decision runs through three of them.** The DPIA, the Third-Party Security Assessment and
the readiness model in Part 4 all combine two dimensions through an explicit lookup table rather than
multiplying them. A product lets a strong score on one axis cancel a critical score on the other:
maximum severity at limited likelihood (4 x 2) would rank below significant/significant (3 x 3), and
strong vendor controls would fully erase a critical amount of data at stake. The lookup tables set
floors instead, so nothing at maximum severity ever falls below High, and nothing at critical inherent
risk ever falls below Medium."""

CHEATSHEETS = {
 "privacy": {
  "purpose": "Screen a process end to end and decide whether a full DPIA is needed.",
  "shape": "11 steps, 62 questions. Steps 3 onward are gated on the screening answer: if no personal data is processed, the assessment ends with a recorded Not Applicable result rather than a risk level.",
  "output": "A risk level (Low / Medium / High, or Not Applicable), a DPIA verdict (Required / Recommended / Not required), the list of Article 35(3) triggers selected, and a factor list with severities.",
  "logic": [
   "The level starts at Low and only ever escalates. No answer can pull it back down, which is why a single High factor decides the outcome.",
   "Escalates to High: special-category data with no Article 9 condition selected; automated decision-making with significant effect; large-scale or systematic monitoring; vulnerable individuals combined with special-category data; an international transfer with no safeguard identified; a transfer impact assessment triggered by supplier characteristics; potential bias in targeting; sharing with competitors.",
   "Escalates to Medium: special-category data; no lawful basis recorded; legitimate interests without a balancing test; vulnerable individuals alone; 10,000 or more records; retention not fully defined; no privacy notice or unconfirmed coverage; extracts or reports without documented controls; system of record; application being decommissioned; employee data with no labour law check; third parties involved; unclear transfer status; tracking or profiling technology; data sourced from third parties or public sources.",
   "DPIA verdict: two or more Article 35(3) triggers makes it Required. One trigger makes it Required at High level, otherwise Recommended. No triggers makes it Recommended at High or Medium level, otherwise Not required.",
  ],
  "traps": [
   "Special-category data cannot run on an Article 6 basis alone. Selecting it without an Article 9 condition is the fastest route to High.",
   "Employees count as vulnerable, because they cannot freely refuse. That single fact moves many ordinary HR processes to Medium.",
   "Remote access from outside the region is a transfer, including support and administration access. 'Not sure' on transfers is itself scored.",
   "A labour law check is separate from anything the GDPR requires. A missing works council agreement can stop processing whatever the assessment says.",
  ],
 },
 "dpia": {
  "purpose": "The full assessment that follows when the Privacy Assessment says a DPIA is needed.",
  "shape": "11 steps, 60 questions. Steps 7, 8 and 9 are the same four questions asked three times, once per feared event: illegitimate access, unwanted modification, data disappearance.",
  "output": "A risk level per feared event, the highest of the three, an inherent and a residual overall level, a DPIA status, and a prior-consultation flag.",
  "logic": [
   "Every risk is rated on two four-point scales. Severity: Negligible, Limited, Significant, Maximum. Likelihood: Negligible, Limited, Significant, Maximum.",
   "The two combine through a fixed 4 x 4 matrix, not a product. Rows are severity, columns likelihood:",
   "MATRIX",
   "DPIA status: two or more triggers makes it Required; one makes it Recommended.",
   "Prior consultation with the supervisory authority is flagged when residual risk is High or Very High and the residual risk was answered as not acceptable.",
  ],
  "traps": [
   "Nothing at Maximum severity ever falls below High, whatever the likelihood. That floor is the entire reason the matrix exists rather than a multiplication.",
   "Inherent and residual are asked separately, so an unchanged residual level is itself a finding: it says the mitigation measures did not move anything.",
   "The three feared events come from the EBIOS-style method and are deliberately exhaustive of what can go wrong with data: someone sees it who should not, it is changed, or it is gone.",
  ],
 },
 "lia": {
  "purpose": "The three-part test for relying on legitimate interests under Article 6(1)(f).",
  "shape": "8 steps, 27 questions: purpose, necessity, then four parts of the balancing test (expectations, relationship, interests, rights and controls), then safeguards and conclusion.",
  "output": "One of four verdicts: Cannot rely on legitimate interests; Unlikely to be available; Finely balanced; Legitimate interests can likely be relied on. Plus the factors for and against, with weights.",
  "logic": [
   "Four answers are blockers, and a blocker overrides the balance entirely: no purpose recorded; necessity not met on either the organisational or the third-party limb; a less intrusive alternative exists; special-category or criminal-offence data is involved.",
   "Everything else is weighed. Factors against carry weights of 1 to 4; factors in favour count 2 each.",
   "Heaviest factors against, at weight 4: likely to cause harm or distress; the processing limits or undermines individual rights; no privacy notice covering this purpose; the individual cannot easily object.",
   "Weight 3: the individual would not expect this; could be perceived as intrusive; no existing relationship; little prejudice to anyone if the processing does not happen; scope could be reduced but has not been; no safeguards recorded.",
   "Thresholds on the weighted total against: 12 or more is Unlikely to be available; 6 or more, or simply outweighing the total in favour, is Finely balanced; below that the basis is likely available.",
  ],
  "traps": [
   "Legitimate interests is an Article 6 basis only. It can never supply the Article 9 condition special-category data needs, or the Article 10 basis criminal-offence data needs.",
   "Three or more documented safeguards count in favour; one or two count against. A safeguard you cannot evidence does not count at all.",
   "Employees and job candidates carry a standing weight against, because the relationship is dependent and consent is generally not a valid alternative.",
   "'Not sure' is never neutral. Every uncertain answer carries a weight against, typically half the weight of the equivalent 'no'.",
  ],
 },
 "ai": {
  "purpose": "An EU AI Act-aligned screen of an AI system, plus the operational risk of running it.",
  "shape": "6 steps, 22 questions: inventory, regulatory screening, autonomy and agentic risk, data sourcing and third-party risk, generative AI and context risk, governance.",
  "output": "Two independent levels. A regulatory level (Prohibited / High / Unresolved / Minimal) and a business level (Low / Medium / High), the latter an internal triage score, not a legal assessment.",
  "logic": [
   "The regulatory level comes from three gates. A prohibited use sets Prohibited outright. Otherwise a yes on either high-risk route (Annex III use case, or Annex I product with third-party conformity assessment) sets High; an Unsure on any gate that is not overtaken by a High sets Unresolved, and an Unsure on the prohibited gate sets Unresolved even over a High; No on all three sets Minimal, with a reminder that Article 50 transparency and GPAI duties are not screened.",
   "The business level starts at Low and escalates on operational answers: broad autonomous action without logging, business-critical data without both logging and oversight, and possible competitor exposure all set High.",
   "Escalate to Medium: broad autonomy with logging; an undocumented multi-agent chain; broad access to sensitive systems or data; the provider training on your data; missing or partial context and memory safeguards; no output guardrails.",
   "Unsure is never Minimal and never Limited. Any Unsure on a legal gate returns Unresolved with a factor that says legal review is required before approval.",
  ],
  "traps": [
   "The two levels are independent by design. A Minimal regulatory system with broad autonomy and no logging is a genuine High business risk, and the tool will say so.",
   "A missing legal review and an undefined audit cadence produce factors but do not escalate the business level; treat them as gaps that can hide legal risk, which is why the regulatory level, not the business score, decides whether the use case may proceed.",
  ],
 },
 "incident": {
  "purpose": "Record a privacy incident and, where it is a personal data breach, score its severity using the published ENISA method.",
  "shape": "11 steps, 56 questions: description, reporting and timing, scope and context, details and cause, four severity steps, an optional cross-check, communications and mitigation, notification.",
  "output": "A severity score SE and a band, notification guidance for the authority and for individuals, the 72-hour deadline arithmetic, and optional EDPB and AEPD cross-checks.",
  "logic": [
   "FORMULA",
   "DPC, the data processing context, runs 1 to 4 across four data families: simple, behavioural, financial, sensitive. The highest of the four is the base.",
   "Aggravating factors add 0.5 each, mitigating factors subtract 0.5 each, and the result is capped at 4 and floored at 0.",
   "EI, ease of identification, is a correcting factor from 0.25 to 1 across six identifier families: name, ID number, contact details, email, picture, code or pseudonym. The highest applies.",
   "CB, circumstances of the breach, adds up to 0.5 each for loss of confidentiality, integrity and availability, so at most 1.5.",
   "Bands: below 2 is Low, below 3 is Medium, below 4 is High, 4 and above is Very High.",
   "Notification: Low means neither; Medium means notify the authority; High and Very High mean notify the authority and the individuals.",
  ],
  "traps": [
   "EI is a multiplier, not an addition. Data that cannot be linked to a person at all collapses the whole score, which is why pseudonymisation with a secure key is worth so much here.",
   "DPC is capped at 4 even when aggravating factors push it higher, so the cap is itself worth recording as a finding.",
   "The optional step cross-checks the same facts against the EDPB guidelines examples and the Spanish AEPD method, whose formula is volume x type x impact with a separate three-part threshold test. Three methods agreeing is a much stronger record than one.",
   "The 72-hour clock runs from the moment the breach qualified, not from when it was discovered or confirmed.",
  ],
 },
 "tpsa": {
  "purpose": "A vendor security questionnaire scored as inherent risk tempered by control maturity.",
  "shape": "21 steps, 111 questions: two intake steps, then 17 security domains, then two AI/ML domains that apply only when the engagement involves an AI system.",
  "output": "An inherent risk tier, a control maturity tier, a residual risk band, per-domain scores, and a gap list ordered by weight and status.",
  "logic": [
   "Every control is answered on four points: Fully in place (1), Partially in place (0.5), Not in place (0), Not applicable (removed from scoring).",
   "Inherent risk is scored from the intake answers alone, out of a theoretical 9: personal data 1, payment or bank data 1.5, HR data 1, other confidential data 0.5, connects to internal systems 1, public-facing 1, AI/ML 1, processor engagement 0.5, plus user count (fewer than 10 scores 0, 10 to 100 scores 0.5, 100 to 1,000 scores 1, more than 1,000 scores 1.5).",
   "Inherent tiers: below 2 Low, below 4 Medium, below 6 High, 6 and above Critical.",
   "Control maturity is the weighted average of the domain scores. Tiers: 0.85 and above Strong, 0.65 and above Adequate, 0.4 and above Weak, below that Poor.",
   "Residual risk comes from a lookup table, rows inherent tier, columns maturity tier:",
   "RESIDUAL",
  ],
  "traps": [
   "Not applicable is the only answer that can flatter the result, because it leaves the scoring set rather than counting zero. Use it sparingly.",
   "Nothing at Critical inherent risk falls below Medium residual, however strong the controls. The vendor cannot control its way out of holding your payment data.",
   "Domain weight decides gap priority: gaps at weight 1.25 and above are surfaced first, split into Not in place and Partially in place.",
   "Leaving controls unanswered does not lower the score, it withholds the maturity tier entirely and the residual band is reported as provisional.",
  ],
 },
}

SUITE_SELFTEST = [
 ("A process involves special-category data and the assessor selects no Article 9 condition. What happens to the risk level, and why?",
  "It escalates to High. Special-category data cannot be processed on an Article 6 lawful basis alone, so a missing Article 9 condition is not a documentation gap, it is a lawfulness gap."),
 ("How many Article 35(3) triggers make a DPIA mandatory, and what happens at one trigger?",
  "Two or more makes it Required. One makes it Required if the risk level is already High, and Recommended otherwise."),
 ("Why does the Privacy Assessment risk level never go down?",
  "It uses an escalate-only function. Each factor can raise the level but nothing lowers it, so the outcome is set by the single worst finding rather than by an average that good answers could dilute."),
 ("Severity Maximum, likelihood Limited. What is the DPIA risk level, and what would a multiplication have given?",
  "High. A product would have given 4 x 2 = 8, ranking it below significant severity at significant likelihood (3 x 3 = 9), which understates an irreversible impact on individuals. The matrix sets a floor so nothing at Maximum severity falls below High."),
 ("Name the three feared events the DPIA rates, and say why those three.",
  "Illegitimate access, unwanted modification, and data disappearance. Between them they exhaust what can go wrong with data: someone sees it who should not, it is changed, or it is gone."),
 ("What triggers the prior-consultation flag in the DPIA?",
  "Residual risk at High or Very High combined with an answer that the residual risk is not acceptable."),
 ("List the four LIA blockers.",
  "No purpose recorded; the necessity test not met on either limb; a less intrusive alternative exists; special-category or criminal-offence data is involved."),
 ("In the LIA, which four factors carry the maximum weight of 4 against?",
  "Likely to cause harm or distress; the processing limits or undermines individual rights; no privacy notice covering the purpose; the individual cannot easily object."),
 ("Two safeguards are recorded in an LIA. Does that help or hurt?",
  "It hurts slightly. Three or more count as a factor in favour; one or two are recorded as a factor against, because safeguards are the main lever available for tipping a balance."),
 ("The AI Risk Assessment returns Minimal regulatory risk and High business risk. Is that a contradiction?",
  "No. The two levels are independent by design. A system outside both high-risk routes can still have broad autonomous action without logging, or process business-critical data without oversight, which is a real operational risk even where the Act imposes little. Minimal also says nothing about the Article 50 transparency duties, which are not screened."),
 ("Write out the ENISA severity formula and say what each term does.",
  "SE = (DPC x EI) + CB. DPC is the data processing context, 1 to 4, from the most serious data family involved. EI is ease of identification, a correcting factor from 0.25 to 1. CB is the circumstances of the breach, up to 1.5, from loss of confidentiality, integrity and availability."),
 ("Why does pseudonymisation with a secure key move the severity score so much?",
  "Because EI multiplies rather than adds. Driving ease of identification down toward 0.25 cuts the DPC term by three quarters before CB is even added."),
 ("Give the four ENISA severity bands and the notification outcome of each.",
  "Below 2 Low: no notification. Below 3 Medium: notify the authority. Below 4 High: notify the authority and the individuals. 4 and above Very High: the same, with the highest urgency."),
 ("When does the 72-hour clock start?",
  "From the moment the incident qualified as a personal data breach, not from discovery and not from confirmation of the full facts."),
 ("A vendor holds payment card data, connects to internal systems, is public-facing and serves more than 1,000 users. What is the inherent score and tier?",
  "1.5 + 1 + 1 + 1.5 = 5, which is High (the High band runs from 4 up to but not including 6). Adding personal data as well would take it to 6 and into Critical."),
 ("A Critical inherent risk vendor scores Strong on control maturity. What is the residual band?",
  "Medium. Nothing at Critical inherent risk falls below Medium residual, whatever the controls, for the same reason the DPIA matrix sets a floor."),
 ("Why should Not applicable be used sparingly in the vendor assessment?",
  "It is the only answer removed from scoring rather than counted as zero, so it is the only one that can flatter the maturity average. Not in place is the honest answer when you are unsure."),
 ("What happens to the residual band if half the controls are left unanswered?",
  "The maturity tier is withheld and the residual band is reported as provisional, falling back to the inherent tier. Unanswered is not the same as good."),
]

READINESS_CHEATSHEET = {
 "purpose": "Measure demonstrable accountability by recording which privacy management activities you perform, then deriving which GDPR Articles those activities evidence.",
 "shape": "13 scope questions, then 71 activities in 13 categories. Each activity carries two evidence questions: a Privacy Office question (does the mechanism exist and is it built correctly) and an Operational Unit question (does it reflect what actually happens).",
 "output": "An overall percentage, a score per category, a score per Article, and a gap list ordered worst first. State lives in localStorage only, with Save, Load, Clear, Forget and an Excel export.",
 "logic": [
  "The inversion is the method. The unit of assessment is an activity you perform, not a legal requirement you must meet, because activities are finite and observable while legal requirements are open-ended.",
  "Four statuses: Implemented scores 1, In progress scores 0.5, Not in place scores 0, Not applicable is removed from the scoring set entirely.",
  "The 13 scope questions come first. Answering no removes the activities gated on that condition from scoring, rather than counting them as failures.",
  "The overall score is the mean activity score across in-scope, non-excluded activities. A category score is the mean of its activities. An Article score is the mean of the activities that evidence it.",
  "Bands: 0.85 and above is good, 0.5 and above is fair, above 0 is weak, 0 is bad.",
  "The gap list sorts by score ascending, then by the number of Articles the activity evidences descending, so the lowest-scoring activity touching the most Articles comes first.",
 ],
 "traps": [
  "Implemented means you could put evidence in front of a regulator today. A policy saying you should do it is not the same as doing it.",
  "Not in place is also the correct answer when you do not know, because an activity nobody can confirm is not evidence of anything.",
  "Not applicable is the only status that can flatter the result. Most genuine non-applicability is already handled by the scope questions.",
  "Coverage is deliberately partial: only Articles a management activity can evidence are scored. Scope, definitions and Member State provisions are out of scope, so a high score is not a claim of blanket compliance.",
  "One weak activity can drag several Article scores at once, which is exactly what the gap ordering is designed to surface.",
 ],
}

READINESS_SELFTEST = [
 ("What is inverted in this model, and why does the inversion matter?",
  "The unit of assessment. Instead of asking whether you meet each legal requirement, it asks which management activities you perform and derives the Articles those evidence. Activities are finite and observable, which makes the assessment repeatable; legal requirements are open-ended, which makes checklists against them drift."),
 ("Give the four statuses and their scores.",
  "Implemented 1, In progress 0.5, Not in place 0, Not applicable removed from the scoring set."),
 ("Why are there 13 scope questions before the activities?",
  "So that activities which genuinely cannot apply are removed from scoring rather than counted as failures. Answering no to a scope question drops the activities gated on it."),
 ("You have a written policy requiring annual privacy training but no training has run this year. What status?",
  "Not in place, or In progress at best. Implemented means the activity is operating now and you could evidence it today; a policy saying you should do it is not evidence that you do."),
 ("Someone answers Not applicable to an activity they are unsure about. What is wrong with that?",
  "Not applicable is the only status removed from the scoring set, so it is the only one that can inflate the result. The correct answer when unsure is Not in place, since an activity nobody can confirm evidences nothing."),
 ("How is an Article's score calculated?",
  "As the mean of the scores of the in-scope activities that evidence that Article. One weak activity therefore drags every Article it maps to."),
 ("What are the two evidence questions on each activity for, and why two?",
  "The Privacy Office question asks whether the mechanism exists and is built correctly. The Operational Unit question asks whether it reflects what actually happens on the ground. Two questions because a mechanism that exists centrally and is ignored locally scores well on the first and badly on the second, and that gap is the finding."),
 ("What does a score of 90% not tell you?",
  "That you are compliant. The model measures demonstrable accountability across the Articles a management activity can evidence. Scope, definitions and Member State provisions are outside it entirely."),
 ("How is the gap list ordered, and why that order?",
  "By activity score ascending, then by the number of Articles the activity evidences descending. It puts the lowest-scoring activity with the widest Article footprint first, so the first fix buys the most evidential coverage."),
]

# Numbered sources for the study pack. Referenced as [n] in the cheat sheets,
# the part intros and the review card; listed in full in Appendix C.
PACK_SOURCES = [
 "Practical Privacy, site page (practical-privacy.html), as extracted on 19 September 2026.",
 "Practical AI Act Advice, site page (practical-ai-act-advice.html), as extracted on 19 September 2026.",
 "Privacy & AI Assessment tools, source file pages/privacy-ai-assessment/assessment.js (six tools, 68 steps, 338 questions), as extracted on 19 September 2026.",
 "GDPR Readiness model, source files pages/gdpr-readiness/readiness-data.js and readiness.js (71 activities, 13 categories, 13 scope questions, 37 Articles), as extracted on 19 September 2026.",
 "Regulation (EU) 2016/679 (GDPR), Articles 5, 6, 9, 12, 14, 22, 28, 30, 33 to 36, 44 to 49: https://eur-lex.europa.eu/eli/reg/2016/679/oj",
 "Regulation (EU) 2024/1689 (AI Act) as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI, in force 27 July 2026): https://eur-lex.europa.eu/eli/reg/2024/1689/oj and https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
 "Article 29 Working Party, Guidelines on Data Protection Impact Assessment, WP248 rev.01 (endorsed by the EDPB): the nine criteria and the two-criteria rule used by the Privacy Assessment: https://ec.europa.eu/newsroom/article29/items/611236",
 "EDPB Guidelines 1/2024 on processing of personal data based on Article 6(1)(f) GDPR (version for consultation, 8 October 2024): the three-step test used by the Legitimate Interest Test: https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2024/guidelines-12024-processing-personal-data-based_en",
 "ENISA, Recommendations for a methodology of the assessment of severity of personal data breaches (December 2013): SE = (DPC x EI) + CB, scales and bands used by the Incident tool: https://www.enisa.europa.eu/publications/dbn-severity",
 "EDPB Guidelines 01/2021 on examples regarding personal data breach notification (v2.0, December 2021): the EDPB cross-check in the Incident tool: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-012021-examples-regarding-personal-data-breach_en",
 "EDPB Guidelines 9/2022 on personal data breach notification under GDPR (v2.0, March 2023): awareness and the 72-hour clock: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-92022-personal-data-breach-notification-under_en",
 "CNIL, Privacy Impact Assessment methodology and knowledge bases (EBIOS-based): the four-point severity and likelihood scales and the three feared events used by the Full DPIA: https://www.cnil.fr/en/privacy-impact-assessment-pia",
 "EDPB Recommendations 01/2020 on measures that supplement transfer tools (v2.0, June 2021): the transfer impact assessment factor in the Privacy Assessment: https://www.edpb.europa.eu/our-work-tools/our-documents/recommendations/recommendations-012020-measures-supplement-transfer_en",
 "ISO/IEC 27001:2022 and the Standardized Information Gathering (SIG) questionnaire: the domain structure the Third-Party Security Assessment follows: https://www.iso.org/standard/27001",
 "OWASP Top 10 for Large Language Model Applications (2025): the attack-resistance controls in the AI/ML supplement of the Third-Party Security Assessment: https://owasp.org/www-project-top-10-for-large-language-model-applications/",
 "EDPB Guidelines 05/2020 on consent under Regulation 2016/679 (May 2020): topic 10: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en",
 "Article 29 Working Party, Guidelines on transparency, WP260 rev.01 (endorsed by the EDPB): topic 15 and the readiness transparency activities: https://ec.europa.eu/newsroom/article29/items/622227",
 "EDPB Guidelines 3/2019 on processing of personal data through video devices (v2.0, January 2020): topic 1: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32019-processing-personal-data-through-video_en",
 "Companion verification report, The site against the law, as of 19 September 2026 (site-verification-report-2026-09-19.pdf): what has changed since the pages were written, rated High to Low, with 90 sources.",
]

# Reference numbers per cheat sheet (index into PACK_SOURCES, 1-based).
CHEATSHEET_REFS = {
 "privacy": [3, 5, 7, 13],
 "dpia": [3, 5, 7, 12],
 "lia": [3, 5, 8],
 "ai": [3, 6],
 "incident": [3, 5, 9, 10, 11],
 "tpsa": [3, 14, 15],
 "readiness": [4, 5, 17],
}
