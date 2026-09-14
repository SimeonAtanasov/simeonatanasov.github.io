/* GDPR Readiness Assessment - data model.
 *
 * Method: accountability-based. The unit of assessment is a privacy management
 * activity, not a legal requirement. You record which activities are in place;
 * the tool derives which GDPR Articles those activities evidence. That
 * inversion is what makes the assessment repeatable, because activities are
 * finite and observable while legal requirements are open-ended.
 *
 * Article titles and numbers are from Regulation (EU) 2016/679, which is public
 * law. The activity statements, the evidence questions and the activity-to-
 * Article mapping here are written for this tool and are deliberately
 * organisation-agnostic, so the assessment can be reused by anyone.
 *
 * Coverage note: this measures demonstrable accountability, not blanket
 * compliance. Only the Articles that a management activity can evidence are
 * scored; scope, definitions and Member State provisions are out of scope.
 */

const ARTICLE_TITLES = {
  5:  "Principles relating to processing of personal data",
  6:  "Lawfulness of processing",
  7:  "Conditions for consent",
  8:  "Conditions applicable to child's consent for information society services",
  9:  "Processing of special categories of personal data",
  10: "Processing relating to criminal convictions and offences",
  12: "Transparent information, communication and modalities",
  13: "Information to be provided where data are collected from the data subject",
  14: "Information to be provided where data have not been obtained from the data subject",
  15: "Right of access by the data subject",
  16: "Right to rectification",
  17: "Right to erasure (right to be forgotten)",
  18: "Right to restriction of processing",
  19: "Notification obligation regarding rectification, erasure or restriction",
  20: "Right to data portability",
  21: "Right to object",
  22: "Automated individual decision-making, including profiling",
  24: "Responsibility of the controller",
  25: "Data protection by design and by default",
  26: "Joint controllers",
  27: "Representatives of controllers or processors not established in the Union",
  28: "Processor",
  29: "Processing under the authority of the controller or processor",
  30: "Records of processing activities",
  32: "Security of processing",
  33: "Notification of a personal data breach to the supervisory authority",
  34: "Communication of a personal data breach to the data subject",
  35: "Data protection impact assessment",
  36: "Prior consultation",
  37: "Designation of the data protection officer",
  38: "Position of the data protection officer",
  39: "Tasks of the data protection officer",
  44: "General principle for transfers",
  45: "Transfers on the basis of an adequacy decision",
  46: "Transfers subject to appropriate safeguards",
  49: "Derogations for specific situations",
  89: "Safeguards for archiving, research and statistical purposes"
};

/* Scoping questions. Answering "no" removes the activities gated on that
 * condition from scoring entirely, rather than counting them as failures. */
const CONDITIONS = [
  { id: "processor",   text: "Does the organisation process personal data on behalf of another organisation, acting as a processor?" },
  { id: "special",     text: "Does the organisation process special categories of personal data, such as health, biometric or trade union data?" },
  { id: "criminal",    text: "Does the organisation process personal data relating to criminal convictions or offences?" },
  { id: "outsideEU",   text: "Is the organisation established outside the EU while offering goods or services to, or monitoring, people in the EU?" },
  { id: "dpo",         text: "Has the organisation appointed a Data Protection Officer, or is it required to appoint one?" },
  { id: "consent",     text: "Does the organisation rely on consent as a legal basis for any processing?" },
  { id: "children",    text: "Does the organisation offer online services directly to children?" },
  { id: "automated",   text: "Does the organisation make automated decisions, including profiling, that have legal or similarly significant effects on people?" },
  { id: "transfers",   text: "Does the organisation transfer personal data outside the EEA?" },
  { id: "derogations", text: "Does the organisation rely on the Article 49 derogations for any occasional transfers?" },
  { id: "joint",       text: "Does the organisation act as a joint controller with another organisation?" },
  { id: "indirect",    text: "Does the organisation obtain personal data from sources other than the individual concerned?" },
  { id: "research",    text: "Does the organisation process personal data for archiving in the public interest, scientific or historical research, or statistical purposes?" }
];

const CATEGORIES = [
  "1. Governance and accountability",
  "2. Personal data inventory and records",
  "3. Policies and internal rules",
  "4. Embedding privacy into operations",
  "5. Training and awareness",
  "6. Information security",
  "7. Third parties and processors",
  "8. Transparency and notices",
  "9. Handling individual rights",
  "10. Assessing new and changed processing",
  "11. Breach management",
  "12. Monitoring and assurance",
  "13. Tracking external requirements"
];

/* id, cat, activity, articles, po (privacy office question),
   ou (operational unit question), cond (scoping gate or null) */
const ACTIVITIES = [
  // 1. Governance and accountability
  { id:"G1", cat:0, activity:"Assign overall responsibility for data protection to a named individual", articles:[24], po:"Is there a named individual with documented overall responsibility for data protection?", ou:"Does your area know who to approach for data protection decisions and escalations?", cond:null },
  { id:"G2", cat:0, activity:"Appoint a Data Protection Officer with an independent reporting line", articles:[37], po:"Has a Data Protection Officer been appointed and their contact details published and notified to the supervisory authority?", ou:"", cond:"dpo" },
  { id:"G3", cat:0, activity:"Define the DPO's tasks, resources and independence in writing", articles:[38,39], po:"Are the DPO's tasks, resourcing and freedom from instruction documented, with direct access to senior management?", ou:"Is the DPO involved early in matters in your area that affect personal data?", cond:"dpo" },
  { id:"G4", cat:0, activity:"Define data protection roles and responsibilities across functions", articles:[24], po:"Are data protection responsibilities documented for each function that handles personal data?", ou:"Does your area have a named person responsible for data protection matters?", cond:null },
  { id:"G5", cat:0, activity:"Report on data protection performance to senior management", articles:[24], po:"Is data protection performance reported to senior management on a defined cycle?", ou:"Does your area contribute data or metrics to that reporting?", cond:null },
  { id:"G6", cat:0, activity:"Appoint a representative in the Union", articles:[27], po:"Has a representative in the Union been appointed in writing and identified in privacy notices?", ou:"", cond:"outsideEU" },

  // 2. Personal data inventory and records
  { id:"I1", cat:1, activity:"Maintain a record of processing activities carried out as controller", articles:[30], po:"Is a record of processing activities maintained, covering purposes, categories of data and recipients, retention and security measures?", ou:"Have your area's processing activities been recorded and confirmed as current?", cond:null },
  { id:"I2", cat:1, activity:"Maintain a record of processing carried out on behalf of others", articles:[30], po:"Is a separate record maintained for processing carried out on behalf of other controllers?", ou:"Does your area carry out processing on behalf of a client, and is it recorded?", cond:"processor" },
  { id:"I3", cat:1, activity:"Document the legal basis for each processing activity", articles:[5,6], po:"Is the legal basis identified and documented for every processing activity?", ou:"Do you know the legal basis for the personal data your area processes?", cond:null },
  { id:"I4", cat:1, activity:"Document the condition relied on for special category data", articles:[9], po:"Is the Article 9 condition documented for each activity involving special category data?", ou:"Does your area process special category data, and is the basis for doing so recorded?", cond:"special" },
  { id:"I5", cat:1, activity:"Document the authority for processing criminal offence data", articles:[10], po:"Is processing of criminal conviction and offence data carried out under official authority or authorised by law, and documented?", ou:"Does your area process criminal record information, and under what authority?", cond:"criminal" },
  { id:"I6", cat:1, activity:"Record international transfers and the safeguards applied", articles:[30,44], po:"Does the record of processing identify transfers outside the EEA and the safeguard relied on for each?", ou:"Does your area send personal data outside the EEA, including to vendors or affiliates?", cond:"transfers" },

  // 3. Policies and internal rules
  { id:"P1", cat:2, activity:"Maintain a data protection policy approved at senior level", articles:[24], po:"Is there an approved data protection policy that applies across the organisation?", ou:"Is your area aware of the data protection policy and how it applies to its work?", cond:null },
  { id:"P2", cat:2, activity:"Maintain procedures that give effect to the data protection principles", articles:[5], po:"Are there working procedures covering lawfulness, fairness, transparency, minimisation, accuracy, storage limitation and security?", ou:"Does your area follow documented procedures when handling personal data?", cond:null },
  { id:"P3", cat:2, activity:"Review and update policies and procedures on a defined cycle", articles:[24], po:"Are policies reviewed on a defined cycle and after material change, with the review evidenced?", ou:"Is your area notified when a policy change affects how it must work?", cond:null },

  // 4. Embedding privacy into operations
  { id:"E1", cat:3, activity:"Apply data protection by design to new systems and processes", articles:[25], po:"Is data protection built into the design stage of new systems, products and processes, with the consideration evidenced?", ou:"Is data protection considered before your area starts a new system or process, rather than afterwards?", cond:null },
  { id:"E2", cat:3, activity:"Apply data protection by default to settings and data volumes", articles:[25], po:"Are default settings configured so that only the personal data necessary for each purpose is processed?", ou:"Are the defaults in your area's tools set to collect and expose the minimum necessary?", cond:null },
  { id:"E3", cat:3, activity:"Maintain procedures for obtaining and recording valid consent", articles:[7], po:"Where consent is relied on, is it freely given, specific, informed and unambiguous, and is a record of it kept?", ou:"Does your area collect consent, and is what the person agreed to recorded?", cond:"consent" },
  { id:"E4", cat:3, activity:"Provide a withdrawal mechanism as easy to use as giving consent", articles:[7], po:"Can individuals withdraw consent as easily as they gave it, with withdrawal applied promptly?", ou:"Can people your area deals with withdraw consent easily, and is it acted on?", cond:"consent" },
  { id:"E5", cat:3, activity:"Verify parental authorisation for children's online services", articles:[8], po:"Are reasonable efforts made to verify parental authorisation where online services are offered to children below the applicable age?", ou:"Does your area's service reach children, and is age or parental authorisation checked?", cond:"children" },
  { id:"E6", cat:3, activity:"Assess compatibility before using data for a new purpose", articles:[5,6], po:"Is a compatibility assessment carried out, or a fresh basis obtained, before personal data is used for a new purpose?", ou:"Does your area check the original purpose before reusing personal data for something new?", cond:null },
  { id:"E7", cat:3, activity:"Apply data minimisation controls at the point of collection", articles:[5], po:"Are collection points reviewed so that only adequate, relevant and necessary data is gathered?", ou:"Are your area's forms and systems limited to the fields actually needed?", cond:null },
  { id:"E8", cat:3, activity:"Maintain controls that keep personal data accurate and current", articles:[5], po:"Are there controls to keep personal data accurate and to correct it without delay?", ou:"Does your area have a way to correct inaccurate personal data it holds?", cond:null },
  { id:"E9", cat:3, activity:"Maintain retention schedules and routine deletion", articles:[5], po:"Is a retention schedule defined for each category of personal data, with deletion carried out when it expires?", ou:"Does your area know how long it may keep personal data, and is it deleted on time?", cond:null },
  { id:"E10", cat:3, activity:"Apply safeguards for archiving, research and statistical processing", articles:[89], po:"Are safeguards such as minimisation and pseudonymisation applied to archiving, research or statistical processing?", ou:"Does your area use personal data for research or statistics, and with what safeguards?", cond:"research" },
  { id:"E11", cat:3, activity:"Control automated decision-making and profiling", articles:[22], po:"Are automated decisions with legal or similarly significant effects identified, justified and subject to human intervention?", ou:"Does your area make decisions about people automatically, and can a person intervene?", cond:"automated" },

  // 5. Training and awareness
  { id:"T1", cat:4, activity:"Deliver data protection training to all staff", articles:[24,39], po:"Do all staff who handle personal data receive data protection training on joining and periodically thereafter?", ou:"Has everyone in your area who handles personal data completed the training?", cond:null },
  { id:"T2", cat:4, activity:"Deliver role-specific training to higher-risk functions", articles:[39], po:"Do functions handling higher-risk processing receive training tailored to their activities?", ou:"Has your area received training specific to the personal data it actually handles?", cond:null },
  { id:"T3", cat:4, activity:"Maintain records of training completion", articles:[24], po:"Are training completion records kept and followed up where training is outstanding?", ou:"Can your area evidence who has completed training and when?", cond:null },

  // 6. Information security
  { id:"S1", cat:5, activity:"Implement security measures appropriate to the risk", articles:[32], po:"Are technical and organisational security measures determined by reference to the risk to individuals, and documented?", ou:"Are the systems your area uses covered by the organisation's security controls?", cond:null },
  { id:"S2", cat:5, activity:"Apply pseudonymisation or encryption where appropriate", articles:[32], po:"Are pseudonymisation and encryption applied where they are an appropriate measure for the risk?", ou:"Is personal data in your area encrypted at rest and in transit where required?", cond:null },
  { id:"S3", cat:5, activity:"Maintain confidentiality, integrity, availability and resilience", articles:[32], po:"Are measures in place to maintain confidentiality, integrity, availability and resilience, including restoration after an incident?", ou:"Can your area restore access to personal data after a system failure?", cond:null },
  { id:"S4", cat:5, activity:"Test and evaluate the effectiveness of security measures", articles:[32], po:"Are security measures tested and evaluated on a regular basis, with findings remediated?", ou:"Are the systems your area relies on included in security testing?", cond:null },
  { id:"S5", cat:5, activity:"Ensure staff process personal data only on documented instruction", articles:[29,32], po:"Are staff and contractors bound to process personal data only on documented instruction and under a duty of confidence?", ou:"Do people in your area understand they may only use personal data as instructed?", cond:null },
  { id:"S6", cat:5, activity:"Maintain access control and periodic access review", articles:[32], po:"Is access to personal data restricted by role and reviewed periodically, with leavers removed promptly?", ou:"Is access in your area limited to those who need it, and reviewed?", cond:null },

  // 7. Third parties and processors
  { id:"V1", cat:6, activity:"Carry out due diligence on processors before engagement", articles:[28], po:"Are processors assessed for sufficient guarantees before they are engaged, with the assessment recorded?", ou:"Does your area check a supplier's data protection measures before sharing personal data?", cond:null },
  { id:"V2", cat:6, activity:"Put a written processing agreement in place with each processor", articles:[28], po:"Is a written contract covering the Article 28 terms in place with every processor?", ou:"Do your area's suppliers who handle personal data have a signed agreement in place?", cond:null },
  { id:"V3", cat:6, activity:"Control the engagement of sub-processors", articles:[28], po:"Are sub-processors engaged only with authorisation, and are they bound to equivalent obligations?", ou:"Do you know whether your area's suppliers subcontract any handling of personal data?", cond:null },
  { id:"V4", cat:6, activity:"Maintain a lawful mechanism for transfers outside the EEA", articles:[44,45,46], po:"Is every transfer outside the EEA covered by an adequacy decision or appropriate safeguards, and documented?", ou:"Are your area's transfers outside the EEA covered by an approved mechanism?", cond:"transfers" },
  { id:"V5", cat:6, activity:"Document derogations relied on for occasional transfers", articles:[49], po:"Where a derogation is relied on, is the transfer occasional, necessary and documented?", ou:"Does your area rely on one-off exceptions to transfer data abroad?", cond:"derogations" },
  { id:"V6", cat:6, activity:"Define and publish joint controller arrangements", articles:[26], po:"Is there an arrangement setting out respective responsibilities with each joint controller, the essence of which is available to individuals?", ou:"Does your area decide purposes jointly with another organisation?", cond:"joint" },

  // 8. Transparency and notices
  { id:"N1", cat:7, activity:"Provide privacy information at the point of collection", articles:[13], po:"Is privacy information provided at the time personal data is collected from the individual?", ou:"Does every point where your area collects personal data show a privacy notice?", cond:null },
  { id:"N2", cat:7, activity:"Provide privacy information where data is obtained indirectly", articles:[14], po:"Where data is obtained from another source, is the individual informed within the required period, including the source?", ou:"Does your area obtain personal data from third parties, and are those people informed?", cond:"indirect" },
  { id:"N3", cat:7, activity:"Maintain notices in clear, plain and accessible language", articles:[12], po:"Are privacy notices concise, transparent, intelligible and easily accessible, in plain language?", ou:"Are the notices your area uses understandable to the people who receive them?", cond:null },
  { id:"N4", cat:7, activity:"Keep notices aligned with actual processing", articles:[12,13,14], po:"Are notices reviewed and updated when processing changes, so they describe what actually happens?", ou:"Does your area's notice still match what it actually does with personal data?", cond:null },

  // 9. Handling individual rights
  { id:"R1", cat:8, activity:"Maintain a procedure to receive and log rights requests", articles:[12], po:"Is there a defined route for receiving rights requests through any channel, with central logging?", ou:"Does your area know how to recognise a rights request and where to send it?", cond:null },
  { id:"R2", cat:8, activity:"Verify the identity of the requester before disclosure", articles:[12], po:"Is identity verified proportionately before personal data is disclosed in response to a request?", ou:"Does your area avoid releasing data before identity has been confirmed centrally?", cond:null },
  { id:"R3", cat:8, activity:"Track and meet the statutory response deadline", articles:[12], po:"Are requests tracked against the one-month deadline, with extensions notified within the first month?", ou:"Does your area supply information for requests within the internal deadline it is given?", cond:null },
  { id:"R4", cat:8, activity:"Handle access requests and provide a copy of the data", articles:[15], po:"Can the organisation locate and provide a copy of an individual's personal data along with the required supplementary information?", ou:"Can your area locate all personal data it holds about a named individual?", cond:null },
  { id:"R5", cat:8, activity:"Handle rectification requests", articles:[16], po:"Are inaccurate data corrected without undue delay, including incomplete data?", ou:"Can your area correct personal data in its systems when asked?", cond:null },
  { id:"R6", cat:8, activity:"Handle erasure requests and notify recipients", articles:[17,19], po:"Are erasure requests assessed against the grounds and exemptions, with recipients notified where required?", ou:"Can your area delete an individual's data across its systems when instructed?", cond:null },
  { id:"R7", cat:8, activity:"Handle restriction requests and notify recipients", articles:[18,19], po:"Can processing be restricted rather than deleted where the grounds apply, with recipients notified?", ou:"Can your area suspend use of a record without deleting it?", cond:null },
  { id:"R8", cat:8, activity:"Handle portability requests in a machine-readable format", articles:[20], po:"Can data provided by the individual and processed by consent or contract be exported in a structured, commonly used, machine-readable format?", ou:"Can your area export an individual's data in a reusable format?", cond:null },
  { id:"R9", cat:8, activity:"Handle objections, including to direct marketing", articles:[21], po:"Are objections acted on, with direct marketing stopped immediately and suppression applied?", ou:"Are objections and marketing opt-outs applied in your area's systems without delay?", cond:null },
  { id:"R10", cat:8, activity:"Handle requests concerning automated decisions", articles:[22], po:"Can individuals obtain human intervention, express their point of view and contest an automated decision?", ou:"Is there a route for someone to challenge an automated decision made in your area?", cond:"automated" },

  // 10. Assessing new and changed processing
  { id:"A1", cat:9, activity:"Screen new processing for whether a DPIA is required", articles:[35], po:"Is new processing screened against DPIA criteria, with the screening decision recorded either way?", ou:"Does your area flag new processing for assessment before it starts?", cond:null },
  { id:"A2", cat:9, activity:"Conduct DPIAs where processing is likely to be high risk", articles:[35], po:"Are DPIAs carried out where processing is likely to result in a high risk, covering necessity, proportionality and mitigation?", ou:"Has your area completed an assessment for its higher-risk processing?", cond:null },
  { id:"A3", cat:9, activity:"Seek the DPO's advice when carrying out a DPIA", articles:[35], po:"Is the DPO's advice sought and recorded when a DPIA is carried out?", ou:"", cond:"dpo" },
  { id:"A4", cat:9, activity:"Consult the supervisory authority where high residual risk remains", articles:[36], po:"Is the supervisory authority consulted before processing where a DPIA shows high risk that cannot be mitigated?", ou:"", cond:null },
  { id:"A5", cat:9, activity:"Reassess when processing changes materially", articles:[35], po:"Is an existing assessment revisited when the scope, data or technology of the processing changes?", ou:"Does your area revisit its assessment when a project's scope changes?", cond:null },

  // 11. Breach management
  { id:"B1", cat:10, activity:"Maintain a breach detection, reporting and escalation procedure", articles:[33], po:"Is there a documented procedure for detecting, reporting and escalating personal data breaches?", ou:"Does your area know how to report a suspected breach and to whom, without delay?", cond:null },
  { id:"B2", cat:10, activity:"Assess breach severity against the notification threshold", articles:[33], po:"Is each breach assessed for risk to individuals to determine whether notification is required?", ou:"Does your area provide the facts needed to assess a breach quickly?", cond:null },
  { id:"B3", cat:10, activity:"Notify the supervisory authority within 72 hours where required", articles:[33], po:"Can a notifiable breach be reported to the supervisory authority within 72 hours of awareness?", ou:"", cond:null },
  { id:"B4", cat:10, activity:"Communicate to affected individuals where the risk is high", articles:[34], po:"Are individuals informed without undue delay where a breach is likely to result in a high risk to them?", ou:"Can your area help identify and reach the individuals affected by a breach?", cond:null },
  { id:"B5", cat:10, activity:"Maintain an internal record of all breaches", articles:[33], po:"Are all breaches recorded, including those not notified, with the facts, effects and remedial action?", ou:"Are incidents in your area recorded even when they are not reportable?", cond:null },

  // 12. Monitoring and assurance
  { id:"M1", cat:11, activity:"Monitor operational compliance with policies and procedures", articles:[24], po:"Is compliance with data protection policies monitored in practice rather than assumed?", ou:"Is your area's handling of personal data checked periodically?", cond:null },
  { id:"M2", cat:11, activity:"Audit processing activities periodically", articles:[24], po:"Are processing activities audited on a risk-based cycle, with findings tracked to closure?", ou:"Has your area's processing been audited, and were findings addressed?", cond:null },
  { id:"M3", cat:11, activity:"Monitor processor compliance during the engagement", articles:[28], po:"Are processors monitored during the engagement, not only assessed at onboarding?", ou:"Does your area review supplier performance against data protection obligations?", cond:null },
  { id:"M4", cat:11, activity:"Maintain documentation sufficient to demonstrate compliance", articles:[5,24], po:"Is documentation maintained such that compliance could be demonstrated to a supervisory authority on request?", ou:"Could your area evidence how it handles personal data if asked?", cond:null },

  // 13. Tracking external requirements
  { id:"X1", cat:12, activity:"Track changes in data protection law and guidance", articles:[24], po:"Is there a defined way of tracking legal change and translating it into required action?", ou:"Is your area told when a legal change affects how it must operate?", cond:null },
  { id:"X2", cat:12, activity:"Track supervisory authority guidance and enforcement", articles:[24], po:"Is regulator guidance and enforcement activity monitored and reflected in internal practice?", ou:"Does your area receive relevant regulator guidance affecting its work?", cond:null }
];

/* The four statuses, with the guidance shown in the on-page legend.
 * score drives the maths: 1, 0.5, 0, and null for "not applicable", which is
 * excluded from the denominator rather than counted as a failure. */
const STATUS = [
  {
    key: "implemented", label: "Implemented", score: 1,
    hint: "In place, operating, and you could evidence it today",
    guide: "You actually do this, it is operating now, and you could put evidence in front of a regulator today. Having a policy that says you should do it is not the same as doing it."
  },
  {
    key: "partial", label: "In progress", score: 0.5,
    hint: "Started but not finished, or only in some areas",
    guide: "Started but not finished. Approved and underway, partially rolled out, or working in some parts of the business but not others. Counts as half."
  },
  {
    key: "none", label: "Not in place", score: 0,
    hint: "Not happening, or nothing to evidence it",
    guide: "Not happening, or happening informally with nothing to show for it. This is also the right answer when you do not know, because an activity nobody can confirm is not evidence of anything."
  },
  {
    key: "na", label: "Not applicable", score: null,
    hint: "Genuinely cannot apply here; removed from scoring",
    guide: "Genuinely cannot apply to your organisation. This one is removed from the score rather than counted against you, so it is the only status that can flatter the result. Use it sparingly, and prefer Not in place if you are unsure. Most cases that truly do not apply are already handled by the scope questions above."
  }
];
