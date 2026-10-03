# Cheat sheets and self-tests for Part 3 (the nine assessment tools)
# and Part 4 (the GDPR Readiness model). Authored, not extracted.

SUITE_INTRO = """The nine tools share one stepper, one country and region list of 209 entries, and one
result format: a headline level, a list of factors that drove it, and an export. What differs is the
model underneath. Read the cheat sheet for a tool before reading its question bank: the questions only
make sense once you know what the scoring does with the answers.

**How the nine fit together.** The Privacy Assessment is the front door and the only one that routes to
another tool: it screens a process end to end and, on the Article 35(3) trigger count, hands over to the
Full DPIA. The Legitimate Interest Test is the side door taken when the lawful basis is Article 6(1)(f),
and the Privacy Assessment flags its absence as a factor. The AI Risk Assessment runs the EU AI Act
screen over the same process when an AI system is involved. The Incident tool runs after the fact, on a
breach rather than a plan. The Third-Party Security Assessment runs on a vendor rather than a process.

**The three added in October 2026 extend the same routes.** The Transfer Impact Assessment picks up where the Privacy Assessment finds a transfer resting on standard contractual clauses or another Article 46 tool. The Fundamental Rights Impact Assessment follows the AI Risk Assessment when a deployer in scope of Article 27 uses a high-risk system, and can start from a saved DPIA. The Generative AI Risk Assessment sits beside the AI Risk Assessment: one classifies the system under the AI Act, the other screens the risks specific to generative models.

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
 "fria": {
  "purpose": "The fundamental rights impact assessment that Article 27 of the AI Act requires from certain deployers of high-risk systems, before first use.",
  "shape": "7 steps, 36 questions: scope and applicability, then the six elements of Article 27(1)(a) to (f) (process, period and frequency, people affected, risks of harm, human oversight, measures and complaints), then the DPIA link, reuse of an earlier assessment and notification.",
  "output": "An applicability verdict (Required / Not required / Check / Not determined), an inherent and a residual risk level to rights, and a list of gaps against Articles 26, 27 and 86.",
  "logic": [
   "Applicability comes first and is a fixed rule. Annex III point 2, critical infrastructure, is excluded outright. Points 5(b), creditworthiness and credit scoring, and 5(c), life and health insurance pricing, are in scope for every deployer. Every other Annex III area is in scope only for bodies governed by public law and private entities providing public services. A system outside Annex III is not in scope; Not sure returns Check.",
   "Risk to rights is rated on four-point severity and likelihood scales worded for rights rather than security, then combined through the same 4 x 4 lookup the Full DPIA uses, so the floors carry over: nothing at Maximum severity falls below High.",
   "The lookup also returns Very High, which is shown with the High badge. A residual of High or Very High produces the finding not to deploy until the risk comes down or its acceptance is recorded at the right level.",
   "High-severity gaps: use outside the intended purpose (Article 25(1)(c) can make the deployer a provider); no assigned human oversight (Article 26(2)); no human review of individual cases; no complaint mechanism (Article 27(1)(f)).",
   "Medium-severity gaps include people not told a high-risk system is used (Article 26(11)), provider information not reviewed (Article 13), no check for unequal outcomes, no suspension and reporting process (Article 26(5)), no way to explain decisions (Article 86), no DPIA alongside, an earlier assessment out of date (Article 27(2)), and the authority not yet notified (Article 27(3)).",
   "With a DPIA saved on the same device, the tool offers to start from it: name, description and harms carry over and the DPIA is recorded as done, which is Article 27(4) in practice.",
  ],
  "traps": [
   "The FRIA belongs to the deployer, not the provider. A vendor's documentation feeds it (Article 13 information) but cannot discharge it.",
   "Private deployers outside 5(b) and 5(c) are not in scope however sensitive the use. A private employer screening candidates with an Annex III point 4 system needs a DPIA, not a FRIA.",
   "Article 27(4), as amended by Regulation (EU) 2026/1744, lets the FRIA cross-refer to the relevant sections of a DPIA or incorporate them, so nothing is assessed twice. It does not let a DPIA replace a FRIA: the rights beyond data protection still need their own assessment.",
   "Article 46(1) exemptions from conformity assessment also exempt from notifying the authority, which is why the notification question has an exemption answer.",
   "ISO/IEC 42005:2025 is the method guidance for AI system impact assessments and is cited as a source. It helps with how to assess; it does not tell you who must do a FRIA or that the authority must be notified, which are Article 27's own.",
  ],
 },
 "genai": {
  "purpose": "Screen a generative AI system for the risks specific to generative models, and map every gap to two published lists.",
  "shape": "6 steps, 31 questions: system profile, inputs and prompts, data and intellectual property, outputs and accuracy, agency and supply chain, testing and monitoring. Questions on retrieval, tool permissions and training data appear only when the profile makes them relevant.",
  "output": "An overall level (Low / Medium / High, or Not assessed), a coverage table for the twelve NIST Generative AI Profile risks, a coverage table for the OWASP Top 10 for LLM Applications 2025, and the findings ordered by severity.",
  "logic": [
   "Twenty-four checks drive everything. Each names one question, the answers that count as a gap with a severity, the NIST risks and the OWASP items it maps to, and optionally when it applies. The coverage tables are derived from the checks, not written separately:",
   "GAICHECKS",
   "A check counts only when its question is visible and answered. An item no answered check touches is Not assessed, which is not a pass; with nothing assessed at all, the result is Not assessed rather than Low.",
   "The overall level is the highest gap severity. Public-facing systems escalate two gaps: missing content filters stay High, and a system that has not been red-teamed becomes High.",
   "One extra finding sits outside the checks: personal data in prompts sent to a model provider whose terms do not exclude retention or training is treated as a processor relationship needing its own privacy assessment.",
  ],
  "traps": [
   "Not assessed is the trap. A table full of Not assessed reads as clean at a glance and means the opposite.",
   "The mapping of questions to NIST and OWASP items is the tool's own, made for triage. Neither list publishes a questionnaire.",
   "CBRN information is screened only through content filters and red-teaming. A model that could provide such information needs specialist review the questionnaire cannot give.",
   "This tool does not classify the system under the AI Act. Run the AI Risk Assessment on the same system for the prohibited and high-risk gates.",
  ],
 },
 "tia": {
  "purpose": "A transfer impact assessment following the six steps of EDPB Recommendations 01/2020.",
  "shape": "5 screens, 28 questions: know your transfer (step 1), the transfer tool (step 2), the law and practice of the destination (step 3), supplementary measures (step 4), procedure and re-evaluation (steps 5 and 6). Steps 3 and 4 are hidden when the tool is an adequacy decision or the EU-US Data Privacy Framework.",
  "output": "One of seven outcomes: No TIA needed, Check certification, Transfer can proceed, Proceed with supplementary measures, Do not transfer or suspend, Wrong transfer tool, Incomplete. Plus a contract action for the importer and findings on onward transfers, minimisation, procedure and review.",
  "logic": [
   "Adequacy, or a Data Privacy Framework certification confirmed to be active and to cover the data, ends the assessment at No TIA needed. An unconfirmed certification returns Check certification.",
   "A derogation used for a regular transfer returns Wrong transfer tool: the Article 49 derogations are exceptions, interpreted restrictively, and not suited to regular or systematic transfers.",
   "For an Article 46 tool, step 3 decides. If the destination's law does not allow access beyond what is necessary and proportionate, or the importer is not in scope of it, the transfer can proceed.",
   "If laws of concern apply and the importer needs the data in the clear, the outcome is Do not transfer or suspend, following the EDPB's use cases 6 and 7, where no effective technical measure was found. Contractual and organisational measures alone do not change that.",
   "If laws of concern apply and a technical measure prevents access in the clear (encryption with keys held by the exporter, pseudonymisation with the additional information held by the exporter, split processing), the outcome is Proceed with supplementary measures. Without one, Do not transfer.",
   "Unclear answers in step 3 are treated as a problem, not as a pass.",
   "The contract action turns the outcome into the work to be done with this importer, from the roles (which module of the clauses) and where the clauses stand today: no change; a new data processing agreement with the clauses; an amendment adding them to an existing agreement; either of those with the supplementary measures; clauses for a controller importer, which need no Article 28 agreement; or do not sign or renew. Run across a transfer inventory, it sorts importers into work queues. Modules 2 and 3 of the 2021 clauses already contain the Article 28 terms, so they can be signed on their own; where they are added to an existing agreement they must prevail over any conflicting term.",
  ],
  "traps": [
   "Remote access from a third country is a transfer, including support and administration access.",
   "Changing the text of the standard contractual clauses in a way that contradicts them means they are no longer standard contractual clauses.",
   "Contractual measures cannot bind a public authority. They support a technical measure; they do not replace one.",
   "Step 6 is a real step: a TIA without a re-evaluation date and an owner watching the destination goes stale silently.",
   "Adequacy or a confirmed Data Privacy Framework certification removes the need for clauses, not for an Article 28 agreement where the importer is a processor.",
   "The 2021 clauses do not work for an importer whose processing is itself subject to the GDPR under Article 3(2), as the Commission states in its questions and answers. The tool flags it; check whether clauses for that case have been adopted.",
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
 ("Which deployers must carry out a fundamental rights impact assessment under Article 27, and which Annex III area is excluded?",
  "Bodies governed by public law and private entities providing public services, for any Annex III system except point 2 (critical infrastructure); and every deployer of a system for creditworthiness or credit scoring (5(b)) or life and health insurance pricing (5(c)). A private employer using an Annex III point 4 system is not in scope."),
 ("The Generative AI Risk Assessment shows Not assessed against eight of the twelve NIST risks. What does that tell you?",
  "That none of the answered questions touches those risks, not that they are under control. Not assessed is not a pass; go back and answer the questions that apply."),
 ("Under the Transfer Impact Assessment, an importer is subject to surveillance laws of concern and needs the data in the clear to provide its service. What is the outcome, and why do contractual measures not save it?",
  "Do not transfer, or suspend. The EDPB found no effective technical measure where the importer needs the data in the clear (use cases 6 and 7), and contractual and organisational measures cannot bind a public authority, so they cannot close the gap alone."),
 ("A controller exports to a processor under an existing data processing agreement that does not contain the 2021 clauses, and step 3 finds no problematic law. What is the contract action?",
  "Amend the existing data processing agreement to incorporate the standard contractual clauses, Module 2 (controller to processor). Had step 3 found laws of concern with an effective technical measure, the amendment would also carry the supplementary measures."),
 ("Which transfer tools skip steps 3 and 4 of the TIA, and what still has to be checked?",
  "An adequacy decision, and the EU-US Data Privacy Framework for a certified recipient. For the DPF, check that the certification is active and covers the type of data; for a partial adequacy decision, that it covers the sector or recipient."),
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
 "Privacy & AI Assessment tools, source file pages/privacy-ai-assessment/assessment.js (nine tools, 86 steps, 433 questions), as extracted on 19 September 2026, with the three added tools extracted on 2 October 2026 and the Transfer Impact Assessment contract action on 3 October 2026.",
 "GDPR Readiness model, source files pages/gdpr-readiness/readiness-data.js and readiness.js (71 activities, 13 categories, 13 scope questions, 37 Articles), as extracted on 19 September 2026.",
 "Regulation (EU) 2016/679 (GDPR), Articles 5, 6, 9, 12, 14, 22, 28, 30, 33 to 36, 44 to 49: https://eur-lex.europa.eu/eli/reg/2016/679/oj",
 "Regulation (EU) 2024/1689 (AI Act) as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI, in force 27 July 2026): https://eur-lex.europa.eu/eli/reg/2024/1689/oj and https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
 "Article 29 Working Party, Guidelines on Data Protection Impact Assessment, WP248 rev.01 (endorsed by the EDPB): the nine criteria and the two-criteria rule used by the Privacy Assessment: https://ec.europa.eu/newsroom/article29/items/611236",
 "EDPB Guidelines 1/2024 on processing of personal data based on Article 6(1)(f) GDPR (version for consultation, 8 October 2024): the three-step test used by the Legitimate Interest Test: https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2024/guidelines-12024-processing-personal-data-based_en",
 "ENISA, Recommendations for a methodology of the assessment of severity of personal data breaches (December 2013): SE = (DPC x EI) + CB, scales and bands used by the Incident tool: https://www.enisa.europa.eu/publications/dbn-severity",
 "EDPB Guidelines 01/2021 on examples regarding personal data breach notification (v2.0, December 2021): the EDPB cross-check in the Incident tool: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-012021-examples-regarding-personal-data-breach_en",
 "EDPB Guidelines 9/2022 on personal data breach notification under GDPR (v2.0, March 2023): awareness and the 72-hour clock: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-92022-personal-data-breach-notification-under_en",
 "CNIL, Privacy Impact Assessment methodology and knowledge bases (EBIOS-based): the four-point severity and likelihood scales and the three feared events used by the Full DPIA: https://www.cnil.fr/en/privacy-impact-assessment-pia",
 "EDPB Recommendations 01/2020 on measures that supplement transfer tools (v2.0, June 2021): the transfer impact assessment factor in the Privacy Assessment and the six steps of the Transfer Impact Assessment: https://www.edpb.europa.eu/our-work-tools/our-documents/recommendations/recommendations-012020-measures-supplement-transfer_en",
 "ISO/IEC 27001:2022 and the Standardized Information Gathering (SIG) questionnaire: the domain structure the Third-Party Security Assessment follows: https://www.iso.org/standard/27001",
 "OWASP Top 10 for Large Language Model Applications (2025): the attack-resistance controls in the AI/ML supplement of the Third-Party Security Assessment, and the coverage table of the Generative AI Risk Assessment: https://owasp.org/www-project-top-10-for-large-language-model-applications/",
 "EDPB Guidelines 05/2020 on consent under Regulation 2016/679 (May 2020): topic 10: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en",
 "Article 29 Working Party, Guidelines on transparency, WP260 rev.01 (endorsed by the EDPB): topic 15 and the readiness transparency activities: https://ec.europa.eu/newsroom/article29/items/622227",
 "EDPB Guidelines 3/2019 on processing of personal data through video devices (v2.0, January 2020): topic 1: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32019-processing-personal-data-through-video_en",
 "Companion verification report, The site against the law, as of 19 September 2026 (site-verification-report-2026-09-19.pdf): what has changed since the pages were written, rated High to Low, with 90 sources.",
 "NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (July 2024): the twelve risks in the Generative AI Risk Assessment: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
 "MITRE ATLAS, Adversarial Threat Landscape for Artificial-Intelligence Systems: the threat-modelling question in the Generative AI Risk Assessment: https://atlas.mitre.org/",
 "ISO/IEC 42005:2025, Information technology, Artificial intelligence, AI system impact assessment: the method source cited by the Fundamental Rights Impact Assessment: https://www.iso.org/standard/42005",
]

# Reference numbers per cheat sheet (index into PACK_SOURCES, 1-based).
CHEATSHEET_REFS = {
 "privacy": [3, 5, 7, 13],
 "dpia": [3, 5, 7, 12],
 "lia": [3, 5, 8],
 "ai": [3, 6],
 "incident": [3, 5, 9, 10, 11],
 "tpsa": [3, 14, 15],
 "fria": [3, 6, 5, 22],
 "genai": [3, 20, 15, 21, 6],
 "tia": [3, 13, 5],
 "readiness": [4, 5, 17],
}


# ---- AI Assessment Pathway (added 3 October 2026, STUDY-02) ----------------------------
# Readable visibility conditions for the pathway, keyed by question id and step key.
# build.py uses them in place of the function source; the pathway study guide uses them
# too. Every pathway question or step with a visibleIf must have an entry (checked).
AIPATH_STEP_CONDITIONS = {
 "aip-gai-profile": "a generative AI trigger is Yes (generates content, foundation model, or free-form prompts)",
 "aip-gai-input": "a generative AI trigger is Yes",
 "aip-gai-data": "a generative AI trigger is Yes",
 "aip-gai-output": "a generative AI trigger is Yes",
 "aip-gai-agency": "a generative AI trigger is Yes",
 "aip-gai-testing": "a generative AI trigger is Yes",
 "aip-aia-role": "the EU trigger is Yes or Not sure",
 "aip-aia-highrisk": "the EU trigger is Yes or Not sure, and the use is not a prohibited practice",
 "aip-aia-gpai": "the EU trigger is Yes or Not sure, not prohibited, and the role includes provider of a general-purpose AI model",
 "aip-aia-transparency": "the EU trigger is Yes or Not sure, and the use is not a prohibited practice",
}
AIPATH_CONDITIONS = {
 "oversightCompetence": "oversight is assigned",
 "automationBias": "the output supports or makes decisions about people, at impact level III or IV",
 "biasEvaluated": "the output supports or makes decisions about people",
 "multiAgentDocumented": "the system coordinates with other agents or services",
 "businessCriticalData": "impact level III or IV",
 "competitorExposure": "impact level III or IV",
 "rightsAtRisk": "impact level III or IV",
 "aipSocietalImpact": "impact level III or IV",
 "providerInfoReviewed": "impact level III or IV",
 "materialiseMeasures": "impact level III or IV",
 "complaintMechanism": "impact level III or IV, and the output supports or makes decisions about people",
 "explanationProcess": "impact level III or IV, and the output supports or makes decisions about people",
 "gaiInputFiltering": "impact level III or IV, or the system is public-facing",
 "gaiRagPermissions": "the patterns include search or question answering over own documents (RAG)",
 "gaiEmbeddingStore": "RAG, and impact level III or IV or a public-facing system",
 "gaiDisclosure": "the AI Act module is closed (EU trigger No); otherwise Article 50 asks it",
 "gaiToolPermissions": "the patterns include an agent that calls tools",
 "gaiApproval": "an agent with limited or broad write actions",
 "gaiTrainingDataVetted": "the model is fine-tuned or trained in-house",
 "gaiRateLimits": "impact level III or IV, or the system is public-facing",
 "gaiThreatModel": "impact level III or IV, or the system is public-facing",
 "gaiEnergy": "impact level III or IV, or the system is public-facing",
 "deployerType": "the role includes deployer",
 "intendedPurposeAligned": "the role includes deployer",
 "aiaArt63": "the use area is an Annex III area",
 "aiaProfiling": "an Annex III area and an Article 6(3) condition is claimed",
 "aiaArt63Documented": "the Article 6(3) exemption holds and the role includes provider or product manufacturer",
 "affectedAware": "deployer of an Annex III high-risk system whose output supports or makes decisions about people",
 "aiaGpaiDocs": "the model is not open-source, or it has systemic risk",
 "aiaGpaiRep": "the provider is outside the EU, and the model is not open-source or has systemic risk",
 "aiaGpaiEval": "the model has systemic risk (presumed, designated or not sure)",
 "aiaGpaiIncidents": "the model has systemic risk (presumed, designated or not sure)",
 "aiaGpaiCyber": "the model has systemic risk (presumed, designated or not sure)",
 "aiaInteracts": "the generative AI patterns do not already say chat or assistant",
 "aiaDeepfake": "the system generates content",
 "aiaTransparencyDone": "at least one Article 50 duty is in play (interaction, synthetic content, emotion recognition or biometric categorisation, deep fakes or public-interest text)",
 "aipConditions": "the decision is approve with conditions",
 "aipEvidence": "impact level III or IV",
 "suspensionProcess": "impact level III or IV",
}

CHEATSHEETS["aipath"] = {
 "purpose": "Assess an AI system once, end to end: one intake, an impact level that sets the depth, the generative AI and EU AI Act modules only where they apply, one risk register, and handovers to the FRIA and the DPIA.",
 "shape": "18 steps, 101 questions, of which 68 are reused by id from the AI Risk, Generative AI and FRIA tools and 33 are new. Intake (3 steps), triggers, Core (2), Impact, Generative AI (6), EU AI Act (4: role and Article 5; high-risk and Article 6(3); general-purpose AI models; Article 50), Governance. In the worked scenarios a classic ML forecasting model sees 48 questions, a public chatbot in the EU 68 and a general-purpose model provider 77.",
 "output": "An impact level I to IV with the factor points, an overall level from the worst finding (or Prohibited practice), the AI Act classification, one register with every finding tagged by its owner and mapped to the framework entries its questions touch, the AI Act obligations for the roles held with dates and links, coverage tables for NIST AI RMF 1.0, ISO/IEC 42001 and, for generative systems, NIST AI 600-1, OWASP and the nine Singapore dimensions, and buttons into the FRIA and the Full DPIA.",
 "logic": [
  "Ask once. A topic has one owner: Core for accuracy, privacy, security, fairness, third parties and oversight; the Impact step for effects on people; the AI Act module for transparency (the GenAI module when there is no EU nexus); Governance for ownership and review. Where a standalone result function expects an answer under its own id, the pathway derives it from the owner's question instead of asking again.",
  "The impact level follows the method of the Canadian Algorithmic Impact Assessment: nine intake factors, maximum 29 points, banded I up to 25 percent, II up to 50, III up to 75, IV above:",
  "TIER",
  "Two floors lift the level to III: a use in an Annex III area, and a system that makes significant decisions on its own. There is no mitigation deduction; mitigations show in the residual rating instead. An unanswered factor scores zero and the level is marked provisional.",
  "Level III and IV add 16 questions across Core, Impact, GenAI and Governance, a finding where a significant decision has no human making the final call, and at IV a high finding for a missing approver. Five GenAI security questions also show at every level when the system is public-facing.",
  "One register. Findings come from the AI Risk Assessment's business checks, the Generative AI checks, the AI Act module and the pathway's own core, impact and governance checks. Two findings on the same question merge into one line at the higher severity. A framework row is a gap if a mapped question carries a finding, addressed if one was answered without a finding, and not assessed otherwise.",
  "AI Act module: role, prohibited practices (a Yes ends the module), the Annex I route, Article 6(3) with the profiling override, Article 26(11), the general-purpose AI model duties of Articles 51 to 55 with the open-source exemption and the authorised representative, and the Article 50 duties split by provider and deployer. Article 4 literacy is always listed.",
  "Handovers: the FRIA when a deployer uses an Annex III high-risk system and Article 27 applies or may apply; the Full DPIA when personal data is involved. The FRIA seed is mostly a copy, because the pathway asks the FRIA's own questions under the same ids.",
 ],
 "traps": [
  "The impact level is not the risk level. Level I with a High finding is a small system with a serious gap; level IV with Low findings is a high-impact system that is well controlled.",
  "Annex III in intake is asked of every system, EU or not, because it is the sector signal. The AI Act reading of it is shown only when the EU trigger opens the module.",
  "Not assessed is still not a pass, here as in the Generative AI tool. The Singapore dimensions on safety research and public good will usually stay Not assessed for a deployer, correctly.",
  "The DPIA handover leaves severity and likelihood unrated on purpose: the DPIA rates harm from the processing, the pathway rated interference with rights.",
  "The pathway does not replace the FRIA, the DPIA or a conformity assessment, and the mapping to frameworks is its own.",
 ],
}
CHEATSHEET_REFS["aipath"] = [3, 6, 23, 20, 24, 22, 25, 26]

SUITE_SELFTEST.extend([
 ("In the AI Assessment Pathway, a public customer chatbot reaching more than a million people scores 48 percent. Which level is it, and which GenAI questions does it still see?",
  "Level II, because 48 percent is under the 50 percent band. It still sees input filtering, rate limits, the threat model, vector store protection and energy use, because those five show at every level for a public-facing system."),
 ("A low-volume CV screening tool scores 30 percent in the pathway. Why is it at level III anyway?",
  "Employment is an Annex III area, and a use in an Annex III area is never below level III. Without the floor it would skip the rights, complaints and explanation questions that Articles 27 and 86 depend on."),
 ("The pathway's FRIA handover carries most of the FRIA's answers. Why can it, and what is left for the FRIA to ask?",
  "Because the pathway's intake, oversight and impact steps ask the FRIA's own questions under the same ids, so the seed is a copy. What is left: the period and frequency of use, whether an earlier assessment is reused, and notification of the authority."),
 ("Two findings in the pathway rest on the same question, one from the Core checks at medium and one from the GenAI checks at low. What does the register show?",
  "One line, at medium, tagged with the owner of the question and 'also' the other part that raised it, and listed against every framework entry its questions map to."),
])

SUITE_INTRO = SUITE_INTRO.replace("The nine tools share", "The ten tools share").replace("**How the nine fit together.**", "**How the first nine fit together.**")
SUITE_INTRO += """

**The AI Assessment Pathway, added on 3 October 2026, runs the AI tools as one.** It asks the intake once, sets an impact level from I to IV that decides how deep the rest goes, opens the generative AI and EU AI Act modules only when they apply, and ends in one register mapped to the NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore framework for generative AI. It hands over to the FRIA and the Full DPIA rather than replacing them, and the standalone tools are unchanged."""

PACK_SOURCES[2] = "Privacy & AI Assessment tools, source file pages/privacy-ai-assessment/assessment.js (ten tools, 104 steps, 534 questions), as extracted on 19 September 2026, with the three added tools extracted on 2 October 2026, the Transfer Impact Assessment contract action and the AI Assessment Pathway on 3 October 2026."
PACK_SOURCES.extend([
 "NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0), January 2023: the subcategories the AI Assessment Pathway maps its questions to. NIST has announced a revision: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
 "ISO/IEC 42001:2023, Information technology, Artificial intelligence, Management system: clauses and Annex A controls cited by number and title in the AI Assessment Pathway (voluntary): https://www.iso.org/standard/42001",
 "AI Verify Foundation and IMDA, Model AI Governance Framework for Generative AI (30 May 2024): the nine dimensions in the AI Assessment Pathway's coverage table: https://aiverifyfoundation.sg/resources/mgf-gen-ai/",
 "Government of Canada, Algorithmic Impact Assessment tool and Directive on Automated Decision-Making (as amended 24 June 2025): the method of the pathway's impact level, not its questions or weights: https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html",
])
