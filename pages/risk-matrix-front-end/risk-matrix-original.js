// Catalog of Privacy, AI, LLM/GenAI, Cyber, and Operational risks. Privacy (115
// items across 18 toolbox topics) and Cyber (107 items across 14 sections) are
// grouped sets, rendered as <optgroup> headings in the picker; their
// likelihood/impact values are as supplied, and the matrix decides the rating.
// The AI/Operational entries are drawn from real practitioner guidance (genericized
// so nothing here is tied to a specific employer); the LLM entries are drawn
// from the EDPB Support Pool of Experts report "AI Privacy Risks &
// Mitigations - Large Language Models (LLMs)" (Barberá, 2025), a public GDPR-
// mapped source, phrased generically here in the same style as the rest of
// the catalog. Picking one prefills the risk/mitigation text and a suggested
// Likelihood/Impact below - everything stays editable afterward, and
// "Custom" skips this entirely.
// The rating each Likelihood/Impact pair carries, mirroring the coloured cells
// of the matrix in risk-matrix-original.html. Kept in sync with that table by
// hand: if a cell's class changes there, change it here too, or the Excel
// export will disagree with what the page shows.
const MATRIX_RATING = {
  Likely:   { Low: "high",   Medium: "critical", High: "critical", Critical: "critical" },
  Possible: { Low: "medium", Medium: "high",     High: "critical", Critical: "critical" },
  Unlikely: { Low: "low",    Medium: "medium",   High: "high",     Critical: "critical" },
  Rare:     { Low: "low",    Medium: "low",      High: "medium",   Critical: "high" }
};

// Same hex values as the .low/.medium/.high/.critical rules in the stylesheet,
// as AARRGGBB for Excel.
const RATING_FILL = {
  low:      "FFB6D7A8",
  medium:   "FFFFE599",
  high:     "FFF6B26B",
  critical: "FFE06666"
};

const RISK_CATALOG = {
  Privacy: [
    { group: "CCTV & Monitoring", label: "Monitoring deployed without assessment", text: "Surveillance or monitoring technology is put into use without a privacy assessment or a check against local privacy and labour law", mitigation: "Treat anything that records or tracks people as a personal data activity: complete a privacy assessment, confirm local privacy and labour law, define what is collected and why, and obtain the required approvals before deployment.", likelihood: "Likely", impact: "High" },
    { group: "CCTV & Monitoring", label: "Cameras cover private areas", text: "Cameras are positioned so they record bathrooms, locker rooms, private spaces, public streets, neighbouring property or individual workstations", mitigation: "Review camera placement and field of view before installation, exclude private and out-of-scope areas, and require documented exceptional approval for any coverage of individual workstations.", likelihood: "Unlikely", impact: "Critical" },
    { group: "CCTV & Monitoring", label: "Incomplete CCTV signage", text: "Signage does not identify the controller, the purpose, the retention period or how to exercise rights, so recording is not transparent", mitigation: "Use a standard sign covering controller identity, purpose, retention period, individual rights and a link or code for more information, and confirm it is in place before cameras go live.", likelihood: "Likely", impact: "Medium" },
    { group: "CCTV & Monitoring", label: "Facial recognition without approval", text: "Facial recognition or other biometric identification is switched on without a completed assessment and formal approval", mitigation: "Treat biometric identification as a decision in its own right: document why it is necessary and proportionate, complete an assessment, and obtain formal approval before any trial or activation.", likelihood: "Unlikely", impact: "Critical" },
    { group: "CCTV & Monitoring", label: "Footage shared or copied insecurely", text: "Recorded footage is shared outside the organisation without review, or copied onto personal devices or removable media", mitigation: "Route every external disclosure through privacy review, prohibit copies to personal devices, use secure transfer methods, and record who accessed or received footage and why.", likelihood: "Possible", impact: "High" },
    { group: "CCTV & Monitoring", label: "Footage kept beyond its purpose", text: "Recordings are retained after the purpose has ended because no deletion routine was ever applied", mitigation: "Set a defined retention period for each system, delete footage automatically once it expires, and securely destroy any removable media holding recordings.", likelihood: "Likely", impact: "Medium" },
    { group: "CCTV & Monitoring", label: "Event photography without notice", text: "Photographs or video of staff, visitors or customers are taken and published without notice, consent or a workable opt-out", mitigation: "Explain the purpose in invitations and on-site signage, obtain explicit consent where an individual is the focal subject, offer a genuine opt-out, and store media only on approved platforms.", likelihood: "Likely", impact: "Medium" },
    { group: "CCTV & Monitoring", label: "Location tracking on by default", text: "Location or vehicle tracking runs by default, covertly, or outside working hours, with no defined purpose", mitigation: "Limit tracking to work activity against a stated purpose, notify those being tracked, disable it outside working hours where possible, and never enable it covertly or use it for discipline without a legal basis.", likelihood: "Possible", impact: "High" },
    { group: "Offboarding", label: "Company files copied on exit", text: "A departing employee copies company files to personal devices or personal cloud storage before access is removed", mitigation: "Set out clearly at the start of the notice period what may and may not be taken, restrict bulk download and external sharing for leavers, and monitor for unusual export activity.", likelihood: "Possible", impact: "High" },
    { group: "Offboarding", label: "Work email forwarded to a personal account", text: "Work email is forwarded or exported to a personal mailbox during or after the notice period", mitigation: "Block automatic forwarding to external addresses, make the prohibition explicit in offboarding guidance, and review forwarding rules when a departure is notified.", likelihood: "Possible", impact: "High" },
    { group: "Offboarding", label: "Business records deleted on departure", text: "A leaver deletes business records while clearing personal content, leaving gaps in records that must be retained", mitigation: "Explain the difference between personal content and business records, require handover of records into approved locations before access is removed, and retain deleted-item recovery for a defined window.", likelihood: "Possible", impact: "High" },
    { group: "Offboarding", label: "Access left active after departure", text: "System, building or application access remains active after employment has ended", mitigation: "Trigger deprovisioning from the leaver process rather than manual requests, and reconcile active accounts against current staff on a regular cycle.", likelihood: "Possible", impact: "High" },
    { group: "Offboarding", label: "Devices not returned or wiped", text: "Laptops, phones or passes are not returned, or are reissued without a secure wipe", mitigation: "Make device and pass return part of the offboarding checklist, and require a mandatory secure wipe before any device is reissued or disposed of.", likelihood: "Possible", impact: "High" },
    { group: "Mailbox Access", label: "Mailbox accessed without approval", text: "Another person's mailbox is accessed without a documented business justification and the required approvals", mitigation: "Require a formal request with business justification, approval from the relevant people, privacy and security functions, and provisioning only through approved mechanisms.", likelihood: "Possible", impact: "High" },
    { group: "Mailbox Access", label: "Whole mailbox reviewed", text: "The entire mailbox is reviewed rather than only the specific content needed for the stated purpose", mitigation: "Apply least privilege to mailbox access: scope the request to specific senders, subjects or date ranges, and exclude clearly personal correspondence.", likelihood: "Possible", impact: "High" },
    { group: "Mailbox Access", label: "Access granted without an audit trail", text: "Access is provided without logging who accessed what and when, leaving no defensible record", mitigation: "Enforce access through identity and access management so user, timestamp, and read and update activity are captured, and protect those logs from deletion or tampering.", likelihood: "Possible", impact: "High" },
    { group: "Mailbox Access", label: "Passwords requested to grant access", text: "Access is arranged by asking the employee for their password, or through shared or generic accounts", mitigation: "Provide access only through approved delegation mechanisms under unique named credentials, and never request, share or use another person's password.", likelihood: "Unlikely", impact: "High" },
    { group: "Mailbox Access", label: "Privileged access left in place", text: "Elevated or delegated access remains after the business need has ended", mitigation: "Make privileged access temporary and justified by default, set an expiry at the point of approval, and remove it immediately when the need ends.", likelihood: "Possible", impact: "High" },
    { group: "Mailbox Access", label: "Employee not informed of access", text: "The mailbox owner is not told their mailbox was accessed, where no investigative or legal exemption applies", mitigation: "Inform the individual as the default position, and document the specific justification whenever notification is withheld.", likelihood: "Possible", impact: "Medium" },
    { group: "Meetings", label: "Recording without informing participants", text: "A meeting is recorded or transcribed without telling participants, or without explaining who will see the output", mitigation: "Tell participants recording or transcription is on, why, who will have access and how long it is kept, and confirm this before the discussion starts.", likelihood: "Likely", impact: "Medium" },
    { group: "Meetings", label: "Sensitive discussion recorded", text: "A grievance, investigation, health or legal discussion is recorded or transcribed when notes would have served the purpose", mitigation: "Ask whether a recording is necessary before enabling it, prefer notes or minutes for sensitive categories, and consult privacy or legal where the subject matter warrants it.", likelihood: "Possible", impact: "High" },
    { group: "Meetings", label: "Recording stored where others can reach it", text: "A recording or transcript lands in a location whose permissions expose it to a wider audience than intended", mitigation: "Use standalone meetings rather than channel meetings for sensitive topics, check where the output is stored and who inherits access, and restrict sharing explicitly.", likelihood: "Possible", impact: "High" },
    { group: "Meetings", label: "AI summary relied on without review", text: "An AI-generated summary, recap or action list is treated as an accurate record without being checked", mitigation: "Review and correct AI-generated meeting output before it is relied on or circulated, remove unnecessary personal data, and never treat it as an official record unchecked.", likelihood: "Likely", impact: "Medium" },
    { group: "Meetings", label: "Meeting content in an unapproved AI tool", text: "Recordings, transcripts or notes are uploaded into an AI tool that has not been approved for company information", mitigation: "Restrict use to approved AI tools within the managed environment, and make clear that meeting outputs are company information subject to the same rules as any other record.", likelihood: "Possible", impact: "High" },
    { group: "Meetings", label: "Whole screen shared", text: "An entire screen is shared, exposing email, notifications or documents unrelated to the meeting", mitigation: "Share a single application window rather than the full screen, silence notifications before presenting, and pause sharing before opening anything else.", likelihood: "Likely", impact: "Medium" },
    { group: "Meetings", label: "Recordings kept past retention", text: "Recordings, transcripts and chat content accumulate well beyond the period they are needed for", mitigation: "Apply defined retention to recordings, transcripts and chat, and remember that deleting a transcript does not necessarily delete a summary generated from it.", likelihood: "Likely", impact: "Medium" },
    { group: "Remote Working", label: "Work over untrusted networks", text: "Work involving personal data is carried out over public or unsecured networks without protected connectivity", mitigation: "Require approved VPN or a trusted hotspot for remote work, use encrypted connections, and avoid unknown VPN or proxy services.", likelihood: "Likely", impact: "High" },
    { group: "Remote Working", label: "Unmanaged device used for work data", text: "Personal or unmanaged devices are used to access or store work information", mitigation: "Restrict access to managed devices with encryption, anti-malware, patching and device management enrolment, and prevent work data from being stored on unmanaged equipment.", likelihood: "Possible", impact: "High" },
    { group: "Remote Working", label: "Device lost away from the office", text: "A laptop, phone or storage device holding personal data is lost or stolen outside the workplace", mitigation: "Enforce full-disk encryption and automatic locking, keep devices under personal control when travelling, and report loss immediately so remote wipe and containment can start.", likelihood: "Possible", impact: "High" },
    { group: "Remote Working", label: "Personal email or cloud used for work files", text: "Work files are moved through personal email, personal cloud storage or consumer messaging apps", mitigation: "Share links from approved systems rather than files, and make clear that personal channels bypass access control, logging and audit and are not an acceptable workaround.", likelihood: "Likely", impact: "High" },
    { group: "Remote Working", label: "Screens and papers visible in public", text: "Screens or printed material are visible to others in cafes, transport, shared homes or co-working spaces", mitigation: "Use privacy screen filters, angle screens away from others, keep papers secured, and avoid handling sensitive material in exposed settings.", likelihood: "Likely", impact: "Medium" },
    { group: "Remote Working", label: "Printed material not destroyed", text: "Documents printed at home are discarded in domestic waste rather than securely destroyed", mitigation: "Avoid printing where possible, file the content into approved systems, and securely destroy any paper containing personal data rather than binning it.", likelihood: "Possible", impact: "Medium" },
    { group: "Remote Working", label: "Live data in test environments", text: "Real personal data is copied into test, pilot or pre-production environments", mitigation: "Use anonymised, masked or synthetic data outside production, apply equivalent security where live data is unavoidable, and delete test datasets once testing is complete.", likelihood: "Possible", impact: "High" },
    { group: "Surveys & Competitions", label: "Consumer survey tool used", text: "A survey, quiz, poll or competition is run on a consumer tool that has not been reviewed or contracted", mitigation: "Restrict these activities to approved platforms and vendors that have passed privacy, security and retention review, and provide an approved alternative so teams are not tempted to improvise.", likelihood: "Likely", impact: "Medium" },
    { group: "Surveys & Competitions", label: "Participants not told how data is used", text: "Participants are not told whether responses are identifiable, where they are stored, who can see them or how long they are kept", mitigation: "Include a short, plain statement with every activity covering purpose, whether responses are identifiable, storage, access, retention and whether participation is voluntary.", likelihood: "Likely", impact: "Medium" },
    { group: "Surveys & Competitions", label: "More data collected than needed", text: "The activity collects personal details, or sensitive questions, beyond what its purpose requires", mitigation: "Limit each field to what the stated purpose genuinely needs, avoid sensitive questions unless specifically justified, and review the form before it goes out.", likelihood: "Likely", impact: "Medium" },
    { group: "Surveys & Competitions", label: "Responses reused for another purpose", text: "Survey or competition responses are reused for marketing, profiling, analytics or performance monitoring", mitigation: "Use responses only for the purpose participants were told about, and require fresh notice, approval or consent before any secondary use.", likelihood: "Possible", impact: "High" },
    { group: "Surveys & Competitions", label: "Anonymous respondents identified", text: "An attempt is made to identify anonymous respondents, or datasets are combined so individuals become identifiable", mitigation: "Keep anonymous activities genuinely anonymous by not collecting identifiers, and prohibit combining response data with other sources to re-identify participants.", likelihood: "Unlikely", impact: "High" },
    { group: "Surveys & Competitions", label: "Entries kept past retention", text: "Competition entries or survey responses are kept indefinitely after the activity closes", mitigation: "Set a retention period when the activity is designed, delete responses once it expires, and obtain confirmation that any vendor has deleted their copy.", likelihood: "Likely", impact: "Medium" },
    { group: "Talent Management", label: "Candidate files in personal folders", text: "CVs, interview notes or candidate records are downloaded into personal drives, folders or mailboxes", mitigation: "Keep recruitment records in the approved applicant system, restrict export, and make clear that local copies of candidate data are not acceptable.", likelihood: "Possible", impact: "High" },
    { group: "Talent Management", label: "Irrelevant questions asked", text: "Candidates are asked about age, family plans, health or background matters that are not relevant to the role", mitigation: "Limit questions to skills, experience and role requirements, brief interviewers before hiring rounds, and use structured question sets.", likelihood: "Possible", impact: "High" },
    { group: "Talent Management", label: "Unapproved background or social checks", text: "Social media or background checks are carried out without confirming they are permitted and formally approved", mitigation: "Confirm the check is legally permitted locally, use approved vendors and processes, inform the candidate, and obtain consent where it is required.", likelihood: "Possible", impact: "High" },
    { group: "Talent Management", label: "Identity documents stored locally", text: "Passports, licences or bank details are stored outside approved systems during onboarding", mitigation: "Capture identity documents directly into the approved system, restrict access to authorised administrators, and delete any working copies once verification is complete.", likelihood: "Possible", impact: "High" },
    { group: "Talent Management", label: "Talent data exported to spreadsheets", text: "Performance, potential or succession information is exported into personal spreadsheets or shared informally", mitigation: "Keep talent and performance data in the approved system, restrict access to authorised participants, and avoid informal sharing of readiness or potential ratings.", likelihood: "Likely", impact: "Medium" },
    { group: "Talent Management", label: "Employee data in external AI tools", text: "Employee information is pasted or uploaded into external AI tools or websites without approval", mitigation: "Restrict use to approved AI tools, train those handling people data on the boundary, and block known unapproved services where feasible.", likelihood: "Possible", impact: "High" },
    { group: "Data Subject Rights", label: "Rights request not recognised", text: "A request is not recognised as a rights request because the individual used everyday language rather than legal terms", mitigation: "Train staff that phrases such as asking for a copy of their data, asking to be deleted or asking you to stop contacting them are rights requests, and to escalate rather than judge.", likelihood: "Likely", impact: "High" },
    { group: "Data Subject Rights", label: "Request handled locally", text: "A manager or team tries to handle a rights request themselves instead of escalating it", mitigation: "Make the rule simple: forward rights requests immediately and do not investigate, verify identity independently, release information or respond substantively.", likelihood: "Possible", impact: "High" },
    { group: "Data Subject Rights", label: "Identity verified informally", text: "Personal data is released after an informal identity check, risking disclosure to the wrong person", mitigation: "Verify identity through the defined process before any data is compiled or released, and keep a record of how verification was carried out.", likelihood: "Unlikely", impact: "Critical" },
    { group: "Data Subject Rights", label: "Statutory deadline missed", text: "A request misses its legal response deadline because it was logged late or not tracked", mitigation: "Log every request centrally on receipt with its statutory deadline and reminders, and inform the individual within the first period where an extension is used.", likelihood: "Possible", impact: "High" },
    { group: "Data Subject Rights", label: "Third-party data not redacted", text: "A response discloses information about other people alongside the requester's own data", mitigation: "Have the response reviewed and redacted before release, excluding third-party data and applying any legal exemptions.", likelihood: "Possible", impact: "High" },
    { group: "Data Subject Rights", label: "Objection not applied downstream", text: "A marketing objection or consent withdrawal is accepted but not applied to suppression lists and downstream systems", mitigation: "Record the objection centrally, apply it to a suppression list, and confirm it has propagated to every system and vendor that could send communications.", likelihood: "Possible", impact: "High" },
    { group: "Sensitive Personal Data", label: "Sensitive data without a valid condition", text: "Special category data is collected without a legal obligation, explicit consent, or a necessary and proportionate purpose", mitigation: "Confirm which condition applies before collecting, document it, and do not collect at all if the task can be completed without that level of information.", likelihood: "Possible", impact: "Critical" },
    { group: "Sensitive Personal Data", label: "Sensitive data in unsecured locations", text: "Health certificates, identity documents or other sensitive material are kept in spreadsheets, local folders or personal email", mitigation: "Store sensitive data only in approved systems with restricted access, and remove copies from mailboxes and local drives once handled.", likelihood: "Likely", impact: "High" },
    { group: "Sensitive Personal Data", label: "Unassessed tool captures sensitive data", text: "A new tool or system captures health, biometric or other sensitive data without having been assessed", mitigation: "Assess any tool that may capture sensitive categories before it is contracted or activated, and treat sensitive capture as a trigger for formal review.", likelihood: "Possible", impact: "Critical" },
    { group: "Sensitive Personal Data", label: "Biometric tool trialled before review", text: "A biometric tool is trialled, or images and recordings are uploaded to a biometric service, before review", mitigation: "Pause biometric projects until review confirms what applies, complete an assessment, and do not contract a vendor or activate a system beforehand.", likelihood: "Possible", impact: "Critical" },
    { group: "Sensitive Personal Data", label: "Inference of emotion or characteristics", text: "Tools are used that infer emotion, mood, ethnicity, gender or other sensitive characteristics", mitigation: "Treat inference of sensitive characteristics as high risk and restricted: require specific justification and approval, and default to not deploying it.", likelihood: "Unlikely", impact: "Critical" },
    { group: "Sensitive Personal Data", label: "Sensitive data shared too widely", text: "Sensitive details are forwarded to people who do not need them, or discussed in open forums", mitigation: "Apply strict need-to-know, restrict distribution lists, and handle sensitive cases through the defined confidential process rather than general channels.", likelihood: "Possible", impact: "High" },
    { group: "Consent", label: "Consent used where there is no choice", text: "Consent is relied on for something the individual cannot realistically refuse, such as a workplace system or mandatory process", mitigation: "Choose the legal basis before designing the flow: use contract, legal obligation or legitimate interest for necessary activities, and reserve consent for genuinely optional ones.", likelihood: "Likely", impact: "High" },
    { group: "Consent", label: "Silence treated as consent", text: "Pre-ticked boxes, inactivity, continued browsing or prior agreement are treated as consent", mitigation: "Require a clear affirmative action, remove pre-ticked boxes, and treat ambiguity as no consent.", likelihood: "Likely", impact: "High" },
    { group: "Consent", label: "Purposes bundled together", text: "Several unrelated purposes are combined into a single all-or-nothing consent request", mitigation: "Present each purpose separately so people can accept some and refuse others, and never make consent for one purpose a condition of an unrelated service.", likelihood: "Likely", impact: "Medium" },
    { group: "Consent", label: "Consent sought without explanation", text: "Consent is collected without explaining what is collected, why, who receives it, how long it is kept and what refusing means", mitigation: "Give plain-language information covering data, purpose, recipients, retention, consequences and the right to withdraw, at the point consent is asked for.", likelihood: "Likely", impact: "Medium" },
    { group: "Consent", label: "Old consent relied on", text: "Consent given previously is relied on after the purpose, scope or context has changed", mitigation: "Re-confirm consent when the purpose or scope changes or significant time has passed, and tell people how long their consent is treated as current.", likelihood: "Possible", impact: "Medium" },
    { group: "Consent", label: "Notice treated as consent", text: "A privacy notice is treated as though it obtained consent, when it only informed", mitigation: "Keep notice and consent separate: notice is always required, consent only where the activity demands it, and a notice alone never constitutes permission.", likelihood: "Possible", impact: "High" },
    { group: "Consent", label: "Withdrawal difficult or ignored", text: "Withdrawing consent is harder than giving it, or withdrawal is not acted on promptly", mitigation: "Provide a withdrawal route as easy as the original opt-in, apply it promptly to future processing, and record both the consent and the withdrawal.", likelihood: "Possible", impact: "High" },
    { group: "Secondary Use", label: "Data reused without assessment", text: "Personal data is used for a new purpose without checking whether that purpose is compatible with the original one", mitigation: "Confirm the original purpose and what people were told before any new use, and treat any change of purpose, even a slight one, as secondary use requiring assessment.", likelihood: "Likely", impact: "High" },
    { group: "Secondary Use", label: "Existing consent assumed to cover new use", text: "Existing consents, notices or collection statements are assumed to extend to a new purpose", mitigation: "Check whether the new purpose needs updated notices, a fresh legal basis or new consent, rather than assuming previous permissions carry over.", likelihood: "Possible", impact: "High" },
    { group: "Secondary Use", label: "Datasets combined without assessment", text: "Datasets are combined for analytics or insight without assessing whether individuals become identifiable", mitigation: "Assess re-identification risk before combining sources, prefer aggregated or anonymised data, and document the assessment.", likelihood: "Possible", impact: "High" },
    { group: "Secondary Use", label: "Identifiable data used to train a model", text: "Identifiable personal data is used to train or tune a model without approval or a completed assessment", mitigation: "Prefer anonymised or pseudonymised datasets for model development, complete an assessment first, and test outputs for bias and fairness.", likelihood: "Possible", impact: "High" },
    { group: "Secondary Use", label: "New vendor without an agreement", text: "Personal data, including test extracts, is shared with a new vendor before a processing agreement and due diligence are in place", mitigation: "Make an executed processing agreement and completed security due diligence a precondition of sharing any data, including samples and test files.", likelihood: "Possible", impact: "High" },
    { group: "Secondary Use", label: "Secondary use decision undocumented", text: "A reuse decision is taken without recording the justification, legal basis and safeguards applied", mitigation: "Record the compatibility assessment, legal basis, consent position, safeguards and approval so the decision can be explained later.", likelihood: "Likely", impact: "Medium" },
    { group: "External Data Requests", label: "Data released directly to a requester", text: "An employee provides data straight to police, a regulator, an insurer or a lawyer without escalation", mitigation: "Make the rule absolute: never release data directly to an external requester, escalate every approach, and let privacy and legal determine whether disclosure is permitted.", likelihood: "Possible", impact: "High" },
    { group: "External Data Requests", label: "Lawful authority not verified", text: "Disclosure proceeds without confirming the requester's identity and the legal authority relied on", mitigation: "Capture requester identity, organisation, official contact details and the court order, notice or other authority before any disclosure is considered.", likelihood: "Possible", impact: "High" },
    { group: "External Data Requests", label: "Broad request fulfilled in full", text: "A sweeping request for all footage or all logs is fulfilled rather than narrowed to what is necessary", mitigation: "Narrow every disclosure to the specific incident, camera, system and time window required, and challenge broad or unclear scope before responding.", likelihood: "Possible", impact: "High" },
    { group: "External Data Requests", label: "Records sent by ordinary email", text: "Footage or records are sent as an ordinary email attachment with no protection or expiry", mitigation: "Use secure transfer with restricted recipients, password protection and link expiry, and never send personal data as an unprotected attachment.", likelihood: "Possible", impact: "High" },
    { group: "External Data Requests", label: "Disclosure not recorded", text: "No record is kept of who requested what, why, what was shared and how it was transferred", mitigation: "Record requester, justification, scope, approver, transfer method and date for every disclosure, so a chain of custody exists.", likelihood: "Possible", impact: "Medium" },
    { group: "External Data Requests", label: "Emergency disclosure undocumented", text: "An urgent disclosure is made without verifying identity, limiting scope or documenting the decision afterwards", mitigation: "Even in emergencies, verify who is asking, share only what is needed to address the emergency, document the decision, and notify privacy immediately afterwards.", likelihood: "Possible", impact: "High" },
    { group: "Website & Digital Compliance", label: "Site launched without review", text: "A website, microsite or portal goes live without governance review by privacy, legal, procurement and security", mitigation: "Require a documented pre-launch review for any externally facing digital asset, and treat material changes as requiring the same review.", likelihood: "Likely", impact: "High" },
    { group: "Website & Digital Compliance", label: "Tags fire before consent", text: "Analytics tags or advertising pixels load before the user has consented", mitigation: "Block non-essential tags until consent is given, test the banner against actual network activity rather than its configuration, and retest after each release.", likelihood: "Likely", impact: "High" },
    { group: "Website & Digital Compliance", label: "Undisclosed scripts present", text: "Third-party scripts or trackers are present on the site that are not in any inventory or notice", mitigation: "Maintain a tracking inventory, scan the live site periodically for undeclared scripts, and remove or document anything unexpected.", likelihood: "Likely", impact: "High" },
    { group: "Website & Digital Compliance", label: "Privacy notice outdated", text: "The published privacy or cookie notice no longer reflects what the site actually collects", mitigation: "Review notices whenever data collection or technology changes, and confirm the notice matches the entity and the actual processing before launch.", likelihood: "Likely", impact: "Medium" },
    { group: "Website & Digital Compliance", label: "Excessive form fields", text: "Forms collect more personal data than the purpose requires, simply because the fields exist", mitigation: "Justify each field against the stated purpose, remove the rest, and update the notice to match what is actually collected.", likelihood: "Likely", impact: "Medium" },
    { group: "Website & Digital Compliance", label: "Hosting location unassessed", text: "The site is hosted or its data processed somewhere that has not been assessed for transfer safeguards", mitigation: "Confirm where data will be hosted and processed before launch, and put transfer safeguards and an assessment in place where it leaves the region.", likelihood: "Possible", impact: "High" },
    { group: "Website & Digital Compliance", label: "Former users retain CMS access", text: "People who have left the project or the organisation still hold content management or admin access", mitigation: "Review platform access on a regular cycle and at every departure, remove accounts promptly, and check activity logs for use after departure.", likelihood: "Possible", impact: "High" },
    { group: "Regulator Relations", label: "Employee responds to a regulator", text: "An employee answers a regulator's call, email or letter directly rather than escalating it", mitigation: "Make it clear that nobody engages with a regulator independently: acknowledge politely, escalate immediately, and wait for coordinated guidance.", likelihood: "Possible", impact: "High" },
    { group: "Regulator Relations", label: "Documents handed over on a visit", text: "Documents or system access are provided during an unannounced inspection before authorised people arrive", mitigation: "Brief reception and site leadership to remain professional, notify leadership and privacy immediately, and provide no documents or access until the response is coordinated.", likelihood: "Unlikely", impact: "High" },
    { group: "Regulator Relations", label: "Regulatory contact not escalated", text: "A complaint, a threat of regulatory escalation or an incident is not passed on promptly", mitigation: "Escalate regulator contact, complaints that may escalate and suspected incidents immediately, since notification timelines are short and start early.", likelihood: "Possible", impact: "High" },
    { group: "Regulator Relations", label: "Information sent externally unreviewed", text: "Incident reports, data extracts, screenshots or investigation notes are sent externally without approval", mitigation: "Require review and approval before any external communication involving personal data or internal practices, however routine it appears.", likelihood: "Possible", impact: "High" },
    { group: "Regulator Relations", label: "Evidence not preserved", text: "Records and evidence relevant to an emerging issue are not preserved while it is assessed", mitigation: "Preserve relevant records and logs as soon as an issue is identified, and suspend routine deletion for anything within scope.", likelihood: "Possible", impact: "High" },
    { group: "Incidents & Breach Response", label: "Incident not reported while unsure", text: "Something looks wrong but is not reported because the person waits until they are certain it qualifies", mitigation: "Train people to report anything unusual immediately without confirming it themselves, make the channel obvious, and reinforce that early reporting is always preferred.", likelihood: "Likely", impact: "High" },
    { group: "Incidents & Breach Response", label: "Incident handled locally", text: "A team tries to investigate or contain an incident on its own before escalating", mitigation: "Require immediate escalation and prohibit independent investigation, so containment, assessment and notification decisions are made by the right people.", likelihood: "Possible", impact: "High" },
    { group: "Incidents & Breach Response", label: "Notification deadline missed", text: "A reportable breach misses its regulatory notification deadline because assessment took too long", mitigation: "Run intake, assessment and the notification decision as a timed workflow from the moment of awareness, so a short statutory deadline cannot pass unnoticed.", likelihood: "Unlikely", impact: "Critical" },
    { group: "Incidents & Breach Response", label: "Evidence lost during response", text: "Evidence is lost or contaminated because people delete messages, recall emails or reset systems before assessment", mitigation: "Preserve evidence first, coordinate containment through the response process, and record what was done and when.", likelihood: "Possible", impact: "High" },
    { group: "Incidents & Breach Response", label: "Misdirected email not reported", text: "An email sent to the wrong recipient is quietly recalled and never reported", mitigation: "Treat misdirected mail containing personal data as a reportable incident, ask recipients to delete it, and report it so severity can be assessed properly.", likelihood: "Likely", impact: "Medium" },
    { group: "Incidents & Breach Response", label: "Improper disposal", text: "Documents go into general waste, or hardware is disposed of without being wiped", mitigation: "Use secure destruction for anything containing personal data, and require certified wiping or destruction for hardware before disposal.", likelihood: "Possible", impact: "High" },
    { group: "Records & Retention", label: "Information stored outside approved systems", text: "Business information is kept on local drives, removable media or personal applications rather than approved systems", mitigation: "Direct working material into approved systems by default, prohibit local and removable storage for business data, and make the approved route the easier one.", likelihood: "Likely", impact: "High" },
    { group: "Records & Retention", label: "No retention label applied", text: "Content is never labelled, so it is either deleted automatically while still needed or kept indefinitely", mitigation: "Apply retention labels at creation, use the default schedule where none is chosen, and make clear which content will be removed automatically if unlabelled.", likelihood: "Likely", impact: "High" },
    { group: "Records & Retention", label: "Oversharing through broad permissions", text: "Sites, folders and files are shared with broad groups or open links rather than named recipients", mitigation: "Default sharing to specific people, make sites private by default, remove organisation-wide access where it is not needed, and review permissions on a regular cycle.", likelihood: "Likely", impact: "High" },
    { group: "Records & Retention", label: "Hidden content shared inside files", text: "A file is shared carrying hidden rows, filtered data, pivot caches, comments, tracked changes or earlier versions", mitigation: "Inspect documents before sharing, remove hidden and residual content, and share aggregated or masked extracts rather than full working files.", likelihood: "Likely", impact: "High" },
    { group: "Records & Retention", label: "Recipients not validated", text: "Information goes to the wrong person because autocomplete or an outdated distribution list was trusted", mitigation: "Check recipients deliberately rather than relying on autocomplete, confirm distribution list ownership and membership, and verify business need before sending.", likelihood: "Likely", impact: "Medium" },
    { group: "Records & Retention", label: "Duplicate copies proliferate", text: "Multiple copies of the same information exist with no single source of truth, so retention and accuracy break down", mitigation: "Keep one authoritative copy and share links rather than attachments, delete temporary copies once finished, and avoid exporting full datasets.", likelihood: "Likely", impact: "Medium" },
    { group: "Records & Retention", label: "Access never reviewed", text: "Site and folder permissions are never revisited, so leavers and former project members retain access", mitigation: "Review owners, members, guests and sharing links on a defined cycle, remove leavers promptly, and document the outcome of each review.", likelihood: "Likely", impact: "High" },
    { group: "Records & Retention", label: "Content deleted under hold", text: "Records are deleted during routine clean-up while subject to a legal, tax, audit or investigation hold", mitigation: "Check for an applicable hold before any deletion or archive clean-up, and apply holds formally so routine deletion is suspended automatically.", likelihood: "Unlikely", impact: "High" },
    { group: "Customer Communications", label: "Promotional content in a service message", text: "A single promotional line, link or offer is added to an operational message, converting it into marketing", mitigation: "Keep service and promotional content strictly separate, review templates for promotional wording, and remember that one promotional phrase changes the message's legal character.", likelihood: "Likely", impact: "High" },
    { group: "Customer Communications", label: "Marketing-sourced contacts used for service", text: "Contact details gathered from a competition, marketing list or lead form are used for operational messages", mitigation: "Use contact details only in the context they were collected, and check the collection source before adding anyone to an operational send.", likelihood: "Possible", impact: "High" },
    { group: "Customer Communications", label: "Message sent by a different entity", text: "A message is sent by a different legal entity from the one that collected the contact details", mitigation: "Confirm the sending entity matches the one that collected the data, or provide clear notice and a lawful basis before a different entity makes contact.", likelihood: "Possible", impact: "Medium" },
    { group: "Customer Communications", label: "Contact preferences ignored", text: "A customer has objected to a type of contact but still receives it", mitigation: "Record objections centrally, apply them across every sending system, and honour objections to non-essential contact even where the message is operational.", likelihood: "Possible", impact: "High" },
    { group: "Customer Communications", label: "Notice or preference link missing", text: "Messages go out without a privacy notice link or a way for the customer to manage contact settings", mitigation: "Include a privacy notice link and, where available, a preference centre link as standard elements of every customer message template.", likelihood: "Likely", impact: "Medium" },
    { group: "Customer Communications", label: "Platform used before approval", text: "An SMS gateway, automation tool, service platform or chatbot is used before vendor, contract and security review", mitigation: "Complete vendor, contract, technology and privacy review before any platform handles customer communications, including chatbots and ticketing tools.", likelihood: "Possible", impact: "High" },
    { group: "Marketing", label: "Marketing without valid opt-in", text: "Marketing is sent without a recorded, channel-specific opt-in from the recipient", mitigation: "Confirm a valid opt-in exists for the specific channel before any send, keep consent records with timestamp, wording and source, and do not launch if it is missing.", likelihood: "Possible", impact: "High" },
    { group: "Marketing", label: "No working unsubscribe", text: "A campaign goes out without a functioning, free unsubscribe mechanism", mitigation: "Test the unsubscribe path on every campaign before sending, and treat a broken unsubscribe as a blocker rather than a defect to fix later.", likelihood: "Possible", impact: "High" },
    { group: "Marketing", label: "Marketing misclassified", text: "A promotional message is classified and sent as a transactional or service communication", mitigation: "Classify by content rather than by system tag, and treat any promotional element as making the whole message marketing.", likelihood: "Possible", impact: "High" },
    { group: "Marketing", label: "Opt-outs processed slowly", text: "Unsubscribe requests are not actioned promptly, so recipients keep receiving messages", mitigation: "Process opt-outs into the suppression list within the shortest applicable deadline, and confirm suppression has reached every sending system and vendor.", likelihood: "Possible", impact: "High" },
    { group: "Marketing", label: "Profiling without transparency", text: "Segmentation, behavioural analytics or lookalike audiences are used without the notice covering it", mitigation: "Ensure the privacy notice describes the profiling actually performed, apply data minimisation, and avoid inferences based on sensitive characteristics.", likelihood: "Likely", impact: "Medium" },
    { group: "Marketing", label: "Children targeted or profiled", text: "Campaigns target, profile or track children without enhanced controls and review", mitigation: "Involve privacy and legal before any campaign that could reach minors, and do not profile or track children's behaviour without a clear lawful basis.", likelihood: "Unlikely", impact: "Critical" },
    { group: "Marketing", label: "Broker data used without diligence", text: "Data obtained from a broker is used for marketing without validating source, transparency and consent", mitigation: "Validate that broker data was lawfully collected and that individuals were informed, confirm consent and opt-out positions, and put contractual controls in place before use.", likelihood: "Possible", impact: "High" }
  ],
  AI: [
    { label: "AI tool deployed without prior review", text: "An AI or analytics tool is put into use without a privacy, ethics, and compliance review first", mitigation: "Require a privacy, ethics, and compliance review before any AI or analytics tool is implemented, not after.", likelihood: "Possible", impact: "Critical" },
    { label: "Confidential data in an unapproved AI tool", text: "Personal or confidential data is entered into an unapproved generative-AI tool", mitigation: "Restrict use to approved generative-AI tools and train staff not to paste personal or confidential data into any of them.", likelihood: "Likely", impact: "High" },
    { label: "Automated decision with no human oversight", text: "An automated or algorithmic decision that significantly affects individuals has no human-in-the-loop or override mechanism", mitigation: "Build a human-in-the-loop checkpoint and an opt-out/review path into any automated decision with a significant effect on people.", likelihood: "Possible", impact: "Critical" },
    { label: "Outputs not monitored for bias", text: "An AI or automated decision-making system's outputs aren't monitored for bias or discriminatory impact", mitigation: "Test model outputs for discriminatory impact across affected groups on a regular schedule, not just before launch.", likelihood: "Possible", impact: "High" },
    { label: "Decision logic not explainable", text: "An AI system's decision logic isn't explainable to the people it affects", mitigation: "Document and be able to explain, in plain language, the main factors behind each automated output.", likelihood: "Likely", impact: "Medium" },
    { label: "Datasets combined without a lawful purpose", text: "Datasets are combined for analytics or AI without a lawful purpose, increasing re-identification risk", mitigation: "Confirm a lawful purpose and assess re-identification risk before combining datasets for analytics or AI.", likelihood: "Possible", impact: "High" },
    { label: "AI content published without review", text: "AI-generated content is used or published without human review or verification", mitigation: "Verify and edit AI-generated content before it's relied on or published, especially for anything consequential.", likelihood: "Likely", impact: "Medium" }
  ],
  LLM: [
    { label: "Inadequate protection of personal data", text: "Sensitive user input, or the data used and produced during training and inference, isn't adequately protected (weak encryption, access control, or anonymization), creating a risk of unauthorized access or a data breach", mitigation: "Encrypt data in transit and at rest, enforce strong access control and authentication, apply anonymization or pseudonymization where feasible, and run regular security audits across the input, processing, and output stages.", likelihood: "Possible", impact: "High" },
    { label: "Training data wrongly treated as anonymous", text: "Training data is treated as anonymous when it can still, directly or by means reasonably likely to be used, be linked back to identifiable individuals", mitigation: "Test the model against state-of-the-art re-identification, membership-inference, and model-inversion attacks before relying on an anonymization claim, and document the assessment.", likelihood: "Possible", impact: "High" },
    { label: "No legal basis for training data", text: "Personal data is included in training datasets without a valid legal basis, adequate transparency, or (where relied on) valid consent", mitigation: "Document the legal basis for each training dataset, exclude unlawfully sourced or unnecessary personal data, and provide accessible information to data subjects about how their data may be used in training.", likelihood: "Possible", impact: "High" },
    { label: "Special category data in training data", text: "Special category data (health, criminal record, biometric, etc.) is present in training data without meeting a recognized exception for processing it", mitigation: "Screen and filter training sources for special category data before use, and rely only on a documented, narrow exception where such data can't be excluded entirely.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Inaccurate or biased model output", text: "The model produces inaccurate, misleading, or biased output that is then treated as reliable, negatively affecting the people it concerns", mitigation: "Disclose the probabilistic, non-factual nature of outputs to users, monitor for bias and inaccuracy on an ongoing basis, and use diverse, representative training and fine-tuning data.", likelihood: "Likely", impact: "Medium" },
    { label: "No human intervention in significant decisions", text: "An LLM-driven process makes a decision with a legal or similarly significant effect on someone without meaningful human review or an escalation path", mitigation: "Require human review before any high-risk automated output is acted on, define clear escalation procedures, and inform people about the automated processing and their right to contest it.", likelihood: "Possible", impact: "Critical" },
    { label: "Data subject rights can't be fulfilled", text: "A data subject's request to access, correct, delete, or object to the use of their data can't be fulfilled because it can't be located or removed from the model or its training data", mitigation: "Offer an opt-out before training data collection where feasible, evaluate machine-unlearning or targeted retraining for deletion requests, and provide a working process to handle rights requests tied to the model.", likelihood: "Possible", impact: "High" },
    { label: "Unlawful repurposing of personal data", text: "Personal data collected for one purpose (e.g. improving a specific feature) is reused for a broader or unrelated purpose (e.g. general model development) without checking compatibility", mitigation: "Define narrow, specific purposes for personal data use rather than broad catch-alls, and run a compatibility assessment or seek a fresh legal basis before reusing data for a new purpose.", likelihood: "Possible", impact: "Medium" },
    { label: "Unlimited retention of input and output data", text: "Input and output data, including logged queries, is retained longer than necessary because no retention period or deletion mechanism is defined", mitigation: "Agree retention periods with the provider as part of the contract or DPA, and set up deletion rules or automated purging for any locally stored input/output data.", likelihood: "Likely", impact: "Medium" },
    { label: "Unlawful international data transfer", text: "Input or training data is processed or stored in a country without an adequate level of protection, without appropriate safeguards in place", mitigation: "Verify where the provider actually processes data, put appropriate transfer safeguards in place, and run a transfer impact assessment where needed before selecting or using a vendor.", likelihood: "Possible", impact: "High" },
    { label: "Breach of data minimization", text: "More personal data is collected or processed for training or fine-tuning than is strictly necessary for the model's purpose", mitigation: "Apply privacy by design from the start, exclude unnecessary personal data at collection, and evaluate whether synthetic or anonymized data could meet the same need with less exposure.", likelihood: "Possible", impact: "Medium" }
  ],
  Cyber: [
    { group: "A. Identity and access management", label: "Stolen employee credentials", text: "Stolen employee credentials are used to access corporate systems", mitigation: "Phishing-resistant MFA; conditional access; passwordless authentication; impossible-travel detection; session monitoring; rapid credential revocation", likelihood: "Likely", impact: "High" },
    { group: "A. Identity and access management", label: "Privileged admin credentials compromised", text: "Privileged administrator credentials are compromised", mitigation: "Privileged access management; separate admin accounts; just-in-time access; hardware security keys; session recording; credential vaulting", likelihood: "Possible", impact: "Critical" },
    { group: "A. Identity and access management", label: "Excessive or accumulated access", text: "Excessive or accumulated access permits unauthorized activity", mitigation: "Role-based access control; least privilege; quarterly access reviews; joiner-mover-leaver automation; segregation of duties", likelihood: "Likely", impact: "High" },
    { group: "A. Identity and access management", label: "Former personnel retain access", text: "Former personnel retain active access", mitigation: "HR-triggered deprovisioning; centralized identity management; termination checklists; account reconciliation", likelihood: "Possible", impact: "High" },
    { group: "A. Identity and access management", label: "Poorly controlled service accounts", text: "Service accounts or API identities are poorly controlled", mitigation: "Workload identities; secrets vault; key rotation; scoped permissions; service-account ownership; non-interactive login restrictions", likelihood: "Likely", impact: "High" },
    { group: "A. Identity and access management", label: "MFA bypass", text: "MFA is bypassed through fatigue attacks, token theft, or social engineering", mitigation: "Number matching; phishing-resistant authentication; token binding; device compliance; risky-sign-in policies", likelihood: "Possible", impact: "High" },
    { group: "A. Identity and access management", label: "Authentication logic design flaws", text: "Authentication or authorization logic contains design flaws", mitigation: "Secure architecture reviews; automated access-control testing; threat modelling; penetration testing; deny-by-default design", likelihood: "Possible", impact: "Critical" },
    { group: "B. Social engineering and human factors", label: "Phishing causes disclosure", text: "Phishing causes credential or information disclosure", mitigation: "Secure email gateway; phishing-resistant MFA; simulations; reporting button; domain protection; browser isolation", likelihood: "Likely", impact: "High" },
    { group: "B. Social engineering and human factors", label: "Business email compromise", text: "Business email compromise leads to fraudulent payment or data disclosure", mitigation: "Out-of-band payment verification; dual approval; mailbox monitoring; DMARC/DKIM/SPF; supplier-change controls", likelihood: "Likely", impact: "Critical" },
    { group: "B. Social engineering and human factors", label: "Deepfake impersonation", text: "Voice, video, or image deepfakes impersonate executives or suppliers", mitigation: "Verification protocols; code words; call-back procedures; transaction limits; staff awareness; provenance checks", likelihood: "Possible", impact: "High" },
    { group: "B. Social engineering and human factors", label: "Help-desk social engineering", text: "Help-desk personnel are manipulated into resetting credentials", mitigation: "Strong identity verification; no knowledge-based authentication alone; supervisor approval; reset logging", likelihood: "Possible", impact: "High" },
    { group: "B. Social engineering and human factors", label: "Employee oversharing", text: "Employees disclose sensitive information through oversharing or manipulation", mitigation: "Data-handling training; classification labels; DLP; clear verification and escalation procedures", likelihood: "Likely", impact: "Medium" },
    { group: "B. Social engineering and human factors", label: "Malicious insider", text: "Malicious insiders deliberately steal data or disrupt systems", mitigation: "Segregation of duties; behavioral monitoring; privileged access controls; DLP; investigation and offboarding procedures", likelihood: "Unlikely", impact: "Critical" },
    { group: "B. Social engineering and human factors", label: "Negligent insider", text: "Negligent insiders mishandle information or systems", mitigation: "Training; least privilege; technical guardrails; classification; endpoint controls; secure defaults", likelihood: "Likely", impact: "High" },
    { group: "C. Malware, ransomware and endpoints", label: "Ransomware", text: "Ransomware encrypts systems and disrupts operations", mitigation: "EDR/XDR; network segmentation; immutable offline backups; application control; patching; tested recovery plans", likelihood: "Likely", impact: "Critical" },
    { group: "C. Malware, ransomware and endpoints", label: "Persistent endpoint malware", text: "Malware establishes persistent access to endpoints", mitigation: "EDR; restricted local administration; secure configurations; threat hunting; DNS and web filtering", likelihood: "Likely", impact: "High" },
    { group: "C. Malware, ransomware and endpoints", label: "Infostealer malware", text: "Information-stealing malware extracts passwords, cookies, or tokens", mitigation: "EDR; browser hardening; passwordless access; session revocation; managed devices; download controls", likelihood: "Likely", impact: "High" },
    { group: "C. Malware, ransomware and endpoints", label: "Unauthorized software", text: "Unauthorized software introduces malware or vulnerabilities", mitigation: "Application allowlisting; software inventory; managed deployment; restricted installation rights", likelihood: "Possible", impact: "High" },
    { group: "C. Malware, ransomware and endpoints", label: "Removable media", text: "Removable media introduces malware or causes data loss", mitigation: "USB controls; encryption; device allowlisting; malware scanning; DLP", likelihood: "Possible", impact: "Medium" },
    { group: "C. Malware, ransomware and endpoints", label: "Mobile device compromise", text: "Mobile devices are lost, compromised, or infected", mitigation: "Mobile-device management; encryption; remote wipe; application controls; device compliance", likelihood: "Possible", impact: "High" },
    { group: "C. Malware, ransomware and endpoints", label: "Firmware or hardware implants", text: "Firmware or hardware implants compromise devices", mitigation: "Trusted suppliers; secure boot; firmware validation; hardware lifecycle controls; tamper detection", likelihood: "Rare", impact: "Critical" },
    { group: "D. Vulnerability and configuration", label: "Unpatched known vulnerabilities", text: "Known vulnerabilities remain unpatched and are exploited", mitigation: "Risk-based vulnerability management; asset inventory; patch SLAs; exploit intelligence; exception governance", likelihood: "Likely", impact: "High" },
    { group: "D. Vulnerability and configuration", label: "Vulnerable internet-facing systems", text: "Internet-facing systems contain critical vulnerabilities", mitigation: "Continuous external scanning; attack-surface management; emergency patching; WAF; exposure reduction", likelihood: "Likely", impact: "Critical" },
    { group: "D. Vulnerability and configuration", label: "Zero-day exploitation", text: "Zero-day vulnerability is exploited before remediation is available", mitigation: "Defense in depth; EDR; segmentation; threat intelligence; virtual patching; rapid incident response", likelihood: "Possible", impact: "Critical" },
    { group: "D. Vulnerability and configuration", label: "Misconfigured resources", text: "Cloud, network, or application resources are misconfigured", mitigation: "Secure baselines; infrastructure as code; configuration scanning; policy-as-code; peer review", likelihood: "Likely", impact: "High" },
    { group: "D. Vulnerability and configuration", label: "Insecure defaults left active", text: "Default credentials or insecure default settings remain active", mitigation: "Hardened build standards; automated compliance checks; deployment gates; credential rotation", likelihood: "Possible", impact: "High" },
    { group: "D. Vulnerability and configuration", label: "End-of-life technology", text: "Unsupported or end-of-life technology is exploited", mitigation: "Lifecycle inventory; migration plans; network isolation; compensating controls; executive risk acceptance", likelihood: "Possible", impact: "High" },
    { group: "D. Vulnerability and configuration", label: "Shadow IT", text: "Shadow IT creates unmanaged security exposure", mitigation: "SaaS discovery; cloud access security controls; procurement integration; approved alternatives; data discovery", likelihood: "Likely", impact: "High" },
    { group: "E. Network and infrastructure", label: "DDoS attack", text: "Distributed denial-of-service attack makes services unavailable", mitigation: "DDoS protection; content delivery network; rate limiting; autoscaling; upstream-provider coordination", likelihood: "Possible", impact: "High" },
    { group: "E. Network and infrastructure", label: "Lateral movement after intrusion", text: "Network intrusion enables lateral movement", mitigation: "Zero-trust segmentation; EDR; strong administration controls; internal firewalls; anomaly detection", likelihood: "Possible", impact: "Critical" },
    { group: "E. Network and infrastructure", label: "Insecure remote access", text: "Insecure remote access is exploited", mitigation: "Zero-trust network access; MFA; managed endpoints; restricted protocols; session monitoring", likelihood: "Possible", impact: "High" },
    { group: "E. Network and infrastructure", label: "Wireless network compromise", text: "Wireless network compromise permits unauthorized access", mitigation: "WPA3 Enterprise; certificate authentication; guest isolation; rogue access-point detection", likelihood: "Unlikely", impact: "High" },
    { group: "E. Network and infrastructure", label: "DNS or domain compromise", text: "DNS or domain compromise redirects users or services", mitigation: "Registry lock; MFA; DNSSEC; restricted administrative access; change alerts", likelihood: "Unlikely", impact: "Critical" },
    { group: "E. Network and infrastructure", label: "Man-in-the-middle interception", text: "Man-in-the-middle interception exposes communications", mitigation: "TLS; certificate validation; VPN or zero-trust access; secure Wi-Fi policies", likelihood: "Unlikely", impact: "High" },
    { group: "E. Network and infrastructure", label: "Routing or telecom failure", text: "Routing or telecommunications failure disrupts connectivity", mitigation: "Redundant providers; diverse routes; failover testing; offline operational procedures", likelihood: "Possible", impact: "High" },
    { group: "F. Application and development", label: "Injection vulnerabilities", text: "Injection vulnerabilities allow data access or system compromise", mitigation: "Parameterized queries; input validation; SAST/DAST; code review; WAF", likelihood: "Possible", impact: "Critical" },
    { group: "F. Application and development", label: "Broken access control", text: "Broken access control exposes unauthorized functionality or data", mitigation: "Server-side authorization; deny-by-default rules; automated testing; penetration testing", likelihood: "Likely", impact: "High" },
    { group: "F. Application and development", label: "APIs expose excessive data", text: "Application programming interfaces expose excessive data", mitigation: "API gateway; schema validation; authentication; authorization; rate limits; data minimization", likelihood: "Likely", impact: "High" },
    { group: "F. Application and development", label: "Session weaknesses enable takeover", text: "Authentication or session-management weaknesses permit account takeover", mitigation: "Secure session handling; MFA; short-lived tokens; token rotation; security testing", likelihood: "Possible", impact: "High" },
    { group: "F. Application and development", label: "Cross-site scripting", text: "Cross-site scripting or browser-side vulnerabilities affect users", mitigation: "Output encoding; content security policy; framework protections; automated testing", likelihood: "Possible", impact: "Medium" },
    { group: "F. Application and development", label: "Sensitive data in logs or errors", text: "Sensitive information appears in logs, errors, or debug interfaces", mitigation: "Logging standards; masking; production debug restrictions; secret scanning; retention controls", likelihood: "Likely", impact: "High" },
    { group: "F. Application and development", label: "Insecure file uploads", text: "Insecure file uploads lead to malware distribution or code execution", mitigation: "Content validation; malware scanning; isolated storage; extension and size restrictions", likelihood: "Possible", impact: "High" },
    { group: "F. Application and development", label: "Business-logic flaws", text: "Business-logic flaws allow fraud or control bypass", mitigation: "Abuse-case testing; threat modelling; transaction monitoring; manual approval thresholds", likelihood: "Possible", impact: "High" },
    { group: "F. Application and development", label: "Risky production changes", text: "Production changes introduce security weaknesses or outages", mitigation: "Change control; CI/CD security gates; testing; staged deployment; rollback capability", likelihood: "Possible", impact: "High" },
    { group: "G. Supply chain and third parties", label: "Compromised dependency", text: "Compromised software dependency introduces malicious code", mitigation: "Software composition analysis; dependency pinning; provenance verification; SBOM; signed packages", likelihood: "Possible", impact: "Critical" },
    { group: "G. Supply chain and third parties", label: "Vendor compromise", text: "Vendor compromise provides attackers access to company systems or data", mitigation: "Third-party due diligence; minimum access; segmentation; contractual controls; continuous monitoring", likelihood: "Possible", impact: "Critical" },
    { group: "G. Supply chain and third parties", label: "Managed service provider compromise", text: "Managed service provider compromise affects multiple systems", mitigation: "Privileged-access restrictions; session monitoring; independent backups; exit and incident provisions", likelihood: "Unlikely", impact: "Critical" },
    { group: "G. Supply chain and third parties", label: "Supplier service failure", text: "Supplier service failure causes operational disruption", mitigation: "Resilience assessment; redundancy; exit plans; recovery obligations; concentration-risk reviews", likelihood: "Possible", impact: "High" },
    { group: "G. Supply chain and third parties", label: "Fourth-party processing", text: "Fourth parties or subcontractors process data without adequate security", mitigation: "Subprocessor transparency; contractual flow-down; approval requirements; supply-chain mapping", likelihood: "Possible", impact: "High" },
    { group: "G. Supply chain and third parties", label: "Abandoned open-source project", text: "Open-source project abandonment creates unmaintained exposure", mitigation: "Dependency governance; maintenance checks; supported alternatives; internal patch capability", likelihood: "Possible", impact: "Medium" },
    { group: "G. Supply chain and third parties", label: "Build pipeline compromise", text: "Build or deployment pipeline is compromised", mitigation: "Isolated runners; signed builds; protected branches; secrets management; artifact verification", likelihood: "Unlikely", impact: "Critical" },
    { group: "G. Supply chain and third parties", label: "Hardware supply chain", text: "Hardware supply chain introduces counterfeit or compromised components", mitigation: "Approved suppliers; chain-of-custody controls; component validation; tamper inspection", likelihood: "Rare", impact: "Critical" },
    { group: "H. Cloud, containers and virtualization", label: "Public cloud storage exposure", text: "Public cloud storage exposes sensitive data", mitigation: "Block public access; encryption; configuration monitoring; data discovery; access logging", likelihood: "Likely", impact: "High" },
    { group: "H. Cloud, containers and virtualization", label: "Overly broad cloud permissions", text: "Cloud permissions are overly broad", mitigation: "Least-privilege IAM; permission analytics; role boundaries; access reviews; just-in-time elevation", likelihood: "Likely", impact: "Critical" },
    { group: "H. Cloud, containers and virtualization", label: "Leaked cloud keys or secrets", text: "Cloud access keys or secrets are leaked", mitigation: "Secret scanning; workload identity; vaulting; short-lived credentials; automated rotation", likelihood: "Likely", impact: "High" },
    { group: "H. Cloud, containers and virtualization", label: "Cloud control-plane compromise", text: "Cloud control-plane account is compromised", mitigation: "Phishing-resistant MFA; separate admin accounts; conditional access; emergency access controls", likelihood: "Possible", impact: "Critical" },
    { group: "H. Cloud, containers and virtualization", label: "Vulnerable or privileged containers", text: "Containers run vulnerable images or excessive privileges", mitigation: "Image scanning; signed images; minimal base images; runtime policies; non-root execution", likelihood: "Likely", impact: "High" },
    { group: "H. Cloud, containers and virtualization", label: "Orchestration misconfiguration", text: "Kubernetes or orchestration platforms are misconfigured", mitigation: "Hardened configurations; admission controls; network policies; secrets management; audit logging", likelihood: "Possible", impact: "Critical" },
    { group: "H. Cloud, containers and virtualization", label: "Cloud provider outage", text: "Cloud provider outage affects critical services", mitigation: "Multi-zone design; tested backups; service continuity planning; defined recovery objectives", likelihood: "Possible", impact: "High" },
    { group: "H. Cloud, containers and virtualization", label: "Tenant isolation failure", text: "Tenant isolation or virtualization failure exposes workloads", mitigation: "Provider assurance; workload encryption; confidential computing where justified; exit planning", likelihood: "Rare", impact: "Critical" },
    { group: "I. Data security and privacy", label: "Unauthorized personal data access", text: "Personal data is accessed or disclosed without authorization", mitigation: "Access controls; encryption; DLP; minimization; monitoring; privacy-by-design assessments", likelihood: "Likely", impact: "High" },
    { group: "I. Data security and privacy", label: "Special-category data breach", text: "Highly sensitive or special-category data is breached", mitigation: "Strong segmentation; enhanced encryption; strict access; pseudonymisation; detailed audit trails", likelihood: "Possible", impact: "Critical" },
    { group: "I. Data security and privacy", label: "Data sent to wrong recipient", text: "Data is sent to the wrong recipient", mitigation: "Recipient confirmation; delayed sending; classification; DLP; secure sharing portals", likelihood: "Likely", impact: "Medium" },
    { group: "I. Data security and privacy", label: "Data retained too long", text: "Data is retained longer than necessary", mitigation: "Retention schedule; automated deletion; legal-hold governance; repository ownership", likelihood: "Likely", impact: "High" },
    { group: "I. Data security and privacy", label: "Data cannot be located or governed", text: "Data cannot be located, classified, or governed", mitigation: "Data inventory; classification; lineage; ownership; discovery scanning", likelihood: "Likely", impact: "High" },
    { group: "I. Data security and privacy", label: "Backup exposed or unrestorable", text: "Backup data is exposed or cannot be restored", mitigation: "Encryption; immutable backups; isolated credentials; restoration testing; backup monitoring", likelihood: "Possible", impact: "Critical" },
    { group: "I. Data security and privacy", label: "Undetected data corruption", text: "Data integrity is corrupted without timely detection", mitigation: "Hashing; reconciliation; versioning; immutable logs; integrity monitoring", likelihood: "Possible", impact: "High" },
    { group: "I. Data security and privacy", label: "Unauthorized data transfer", text: "Data is transferred to an unauthorized jurisdiction or recipient", mitigation: "Transfer assessments; approved transfer tools; contractual safeguards; location controls", likelihood: "Possible", impact: "High" },
    { group: "I. Data security and privacy", label: "Unlawful deletion or alteration", text: "Records are deleted or altered contrary to legal requirements", mitigation: "Legal holds; immutable archives; access controls; audit trails; disposal authorization", likelihood: "Unlikely", impact: "High" },
    { group: "J. Availability, resilience and OT", label: "Critical system outage", text: "Critical system outage interrupts business operations", mitigation: "Redundancy; monitoring; incident response; tested disaster recovery; defined RTO/RPO", likelihood: "Possible", impact: "Critical" },
    { group: "J. Availability, resilience and OT", label: "Disaster recovery fails", text: "Backup or disaster-recovery arrangements fail during an incident", mitigation: "Regular restoration exercises; immutable copies; independent credentials; recovery validation", likelihood: "Possible", impact: "Critical" },
    { group: "J. Availability, resilience and OT", label: "Capacity exhaustion", text: "Capacity exhaustion makes systems unavailable", mitigation: "Capacity monitoring; autoscaling; load testing; quotas and alerting", likelihood: "Possible", impact: "High" },
    { group: "J. Availability, resilience and OT", label: "Single point of failure", text: "Single points of failure cause widespread disruption", mitigation: "Architecture reviews; redundancy; failover; dependency mapping", likelihood: "Possible", impact: "High" },
    { group: "J. Availability, resilience and OT", label: "Operational technology compromise", text: "Industrial or operational technology is compromised", mitigation: "IT/OT segmentation; restricted remote access; allowlisting; passive monitoring; safety controls", likelihood: "Possible", impact: "Critical" },
    { group: "J. Availability, resilience and OT", label: "Attack affects physical safety", text: "Cyberattack affects physical safety or environmental systems", mitigation: "Safety-system independence; fail-safe operation; segmentation; emergency response exercises", likelihood: "Unlikely", impact: "Critical" },
    { group: "J. Availability, resilience and OT", label: "Environmental damage to technology", text: "Environmental events damage critical technology", mitigation: "Geographical resilience; environmental controls; alternate processing sites; tested continuity plans", likelihood: "Unlikely", impact: "Critical" },
    { group: "K. Detection and incident response", label: "Incomplete logging hides attackers", text: "Attackers remain undetected because logging is incomplete", mitigation: "Centralized logging; minimum log standards; SIEM; coverage reviews; time synchronization", likelihood: "Likely", impact: "High" },
    { group: "K. Detection and incident response", label: "Alerts not investigated promptly", text: "Security alerts are not investigated promptly", mitigation: "24/7 coverage for critical services; prioritization; automated triage; response SLAs", likelihood: "Likely", impact: "High" },
    { group: "K. Detection and incident response", label: "Unclear incident-response roles", text: "Incident-response responsibilities are unclear", mitigation: "Documented roles; escalation matrix; exercises; executive and legal participation", likelihood: "Possible", impact: "High" },
    { group: "K. Detection and incident response", label: "Evidence lost or contaminated", text: "Evidence is lost or contaminated during an investigation", mitigation: "Forensic procedures; log retention; chain-of-custody controls; trained responders", likelihood: "Possible", impact: "High" },
    { group: "K. Detection and incident response", label: "Notification deadlines missed", text: "Regulatory or contractual notification deadlines are missed", mitigation: "Notification playbooks; legal/privacy integration; incident classification; decision logs", likelihood: "Possible", impact: "High" },
    { group: "K. Detection and incident response", label: "Poor incident communications", text: "Public communications worsen reputational damage", mitigation: "Crisis communications plan; approved spokespeople; coordinated legal and executive review", likelihood: "Possible", impact: "High" },
    { group: "K. Detection and incident response", label: "Threat intelligence unused", text: "Threat intelligence is not translated into defensive action", mitigation: "Intelligence requirements; ownership; detection engineering; vulnerability prioritization", likelihood: "Possible", impact: "Medium" },
    { group: "L. Governance and compliance", label: "No clear governance accountability", text: "Cybersecurity governance lacks clear accountability", mitigation: "Board oversight; executive ownership; RACI; risk committees; defined reporting", likelihood: "Possible", impact: "High" },
    { group: "L. Governance and compliance", label: "Inconsistent risk assessment", text: "Cyber risks are not identified or assessed consistently", mitigation: "Common methodology; asset-based assessments; risk register; periodic reassessment", likelihood: "Likely", impact: "High" },
    { group: "L. Governance and compliance", label: "Outdated security policies", text: "Security policies are outdated or not implemented", mitigation: "Policy lifecycle; control mapping; ownership; exception process; compliance testing", likelihood: "Likely", impact: "Medium" },
    { group: "L. Governance and compliance", label: "Regulatory obligations breached", text: "Regulatory security obligations are breached", mitigation: "Obligations register; legal monitoring; control mapping; assurance; evidence retention", likelihood: "Possible", impact: "Critical" },
    { group: "L. Governance and compliance", label: "Contractual obligations unmet", text: "Contractual security obligations are not met", mitigation: "Contract review; obligation tracking; control owners; supplier and customer assurance", likelihood: "Possible", impact: "High" },
    { group: "L. Governance and compliance", label: "Open risk exceptions", text: "Risk exceptions remain open without remediation", mitigation: "Time-limited exceptions; compensating controls; accountable owners; executive acceptance", likelihood: "Likely", impact: "High" },
    { group: "L. Governance and compliance", label: "Insurance gap", text: "Cyber insurance does not cover the actual loss scenario", mitigation: "Coverage reviews; exclusions analysis; scenario testing; insurer notification procedures", likelihood: "Unlikely", impact: "High" },
    { group: "L. Governance and compliance", label: "Insufficient security resources", text: "Security resources or skills are insufficient", mitigation: "Workforce plan; managed services; training; succession planning; prioritized control roadmap", likelihood: "Likely", impact: "High" },
    { group: "L. Governance and compliance", label: "Metrics misrepresent exposure", text: "Security metrics fail to represent real exposure", mitigation: "Outcome-based KRIs; control-effectiveness testing; trend analysis; independent validation", likelihood: "Possible", impact: "High" },
    { group: "M. Emerging technology and AI", label: "Confidential data in public AI", text: "Employees enter confidential information into public AI services", mitigation: "Approved AI tools; DLP; contractual protections; user training; technical blocking where necessary", likelihood: "Likely", impact: "High" },
    { group: "M. Emerging technology and AI", label: "Prompt injection", text: "Prompt injection causes an AI system to reveal data or misuse tools", mitigation: "Input isolation; tool allowlists; least privilege; output filtering; red-team testing", likelihood: "Likely", impact: "High" },
    { group: "M. Emerging technology and AI", label: "AI agents act without authority", text: "AI agents perform unauthorized or harmful actions", mitigation: "Human approval for high-impact actions; transaction limits; sandboxing; complete activity logs", likelihood: "Possible", impact: "Critical" },
    { group: "M. Emerging technology and AI", label: "Vulnerable AI-generated code", text: "AI-generated code introduces security vulnerabilities", mitigation: "Mandatory review; SAST; dependency scanning; secure coding standards; test coverage", likelihood: "Likely", impact: "High" },
    { group: "M. Emerging technology and AI", label: "Data poisoning", text: "Training or retrieval data is poisoned or manipulated", mitigation: "Data provenance; integrity checks; trusted sources; anomaly detection; access controls", likelihood: "Possible", impact: "High" },
    { group: "M. Emerging technology and AI", label: "Model output exposes content", text: "Model outputs expose personal, confidential, or copyrighted content", mitigation: "Data minimization; output controls; evaluation; access restrictions; contractual safeguards", likelihood: "Possible", impact: "High" },
    { group: "M. Emerging technology and AI", label: "AI model or API supply chain", text: "AI model or API supply-chain compromise affects applications", mitigation: "Provider assessment; version governance; monitoring; fallback design; scoped API credentials", likelihood: "Possible", impact: "Critical" },
    { group: "M. Emerging technology and AI", label: "Shadow AI", text: "Shadow AI creates unrecorded processing and compliance exposure", mitigation: "AI inventory; discovery tools; acceptable-use policy; approved alternatives; governance reviews", likelihood: "Likely", impact: "High" },
    { group: "M. Emerging technology and AI", label: "Quantum threat to cryptography", text: "Cryptographic algorithms become vulnerable to quantum attacks", mitigation: "Cryptographic inventory; crypto-agility; migration roadmap; standards monitoring", likelihood: "Rare", impact: "Critical" },
    { group: "M. Emerging technology and AI", label: "Synthetic identity fraud", text: "Synthetic identities and automated fraud bypass existing verification", mitigation: "Strong identity proofing; liveness detection; transaction monitoring; multi-channel verification", likelihood: "Possible", impact: "High" },
    { group: "N. Physical and environmental", label: "Device theft", text: "Device theft results in unauthorized access or data disclosure", mitigation: "Full-disk encryption; MFA; remote wipe; screen locking; asset tracking", likelihood: "Possible", impact: "High" },
    { group: "N. Physical and environmental", label: "Unauthorized facility access", text: "Unauthorized individuals gain access to secure facilities", mitigation: "Badges; visitor controls; security monitoring; anti-tailgating measures", likelihood: "Unlikely", impact: "High" },
    { group: "N. Physical and environmental", label: "Equipment tampering or removal", text: "Equipment is tampered with or removed", mitigation: "Locked racks; CCTV; inventory controls; tamper evidence", likelihood: "Unlikely", impact: "High" },
    { group: "N. Physical and environmental", label: "Fire, flood or power failure", text: "Fire, flood, heat, or power failure affects technology services", mitigation: "Environmental monitoring; UPS/generators; fire suppression; geographic redundancy", likelihood: "Unlikely", impact: "Critical" },
    { group: "N. Physical and environmental", label: "Paper records exposed", text: "Paper records or printed information are exposed", mitigation: "Secure printing; clean-desk controls; locked storage; certified destruction", likelihood: "Possible", impact: "Medium" }
  ],
  Operational: [
    { label: "Incident not reported promptly", text: "A suspected privacy or security incident isn't reported promptly because staff aren't sure it qualifies", mitigation: "Train staff to report anything unusual immediately without waiting to confirm it themselves, and make the reporting channel obvious.", likelihood: "Likely", impact: "High" },
    { label: "Breach notification deadline missed", text: "A personal data breach misses its legal notification deadline because the severity assessment takes too long", mitigation: "Build the severity assessment and notification decision into a timed workflow so the legal deadline (e.g., 72 hours under GDPR) can't be missed silently.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Insecure disposal of data or devices", text: "Devices or documents containing personal data are disposed of without secure destruction", mitigation: "Use approved secure-destruction bins or certified disposal vendors for any document or device that held personal data.", likelihood: "Unlikely", impact: "High" },
    { label: "Rights request not tracked centrally", text: "A data subject rights request isn't logged or tracked centrally, so it misses its statutory response deadline", mitigation: "Log every rights request in a central tracker with its statutory deadline and automatic reminders.", likelihood: "Possible", impact: "High" },
    { label: "Requester identity not verified", text: "A rights requester's identity isn't verified before personal data is disclosed, risking disclosure to the wrong person", mitigation: "Verify the requester's identity before any personal data is compiled or disclosed in response to a rights request.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Go-live before privacy review completed", text: "A new system, tool, or process touching personal data goes live before its privacy review is completed", mitigation: "Gate the go-live decision on a completed privacy review; treat \"we'll assess it later\" as a blocker, not an option.", likelihood: "Possible", impact: "High" },
    { label: "Scope change without a review refresh", text: "A project's scope changes after its privacy review, but the review is never revisited", mitigation: "Require sign-off that the privacy review still reflects reality whenever a project's scope, data, or technology changes.", likelihood: "Possible", impact: "Medium" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#risk-matrix textarea");
  const saveButton = document.getElementById("save-data");
  const loadButton = document.getElementById("load-data");
  const clearButton = document.getElementById("clear-data");
  const exportButton = document.getElementById("export-excel");
  const addRiskButton = document.getElementById("add-risk");
  const newRiskInput = document.getElementById("new-risk");
  const newLikelihoodSelect = document.getElementById("new-likelihood");
  const newImpactSelect = document.getElementById("new-impact");
  const newCategorySelect = document.getElementById("new-category");
  const newPredefinedRiskSelect = document.getElementById("new-predefined-risk");
  const riskNotes = document.getElementById("risk-notes");

  let riskCounter = 1;
  const risksList = [];

  // Populate the predefined-risk dropdown for whichever category is chosen.
  function populatePredefinedRisks(category) {
    newPredefinedRiskSelect.innerHTML = "";

    if (!category) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select a category first...";
      newPredefinedRiskSelect.appendChild(placeholder);
      newPredefinedRiskSelect.disabled = true;
      return;
    }

    newPredefinedRiskSelect.disabled = false;

    const customOption = document.createElement("option");
    customOption.value = "";
    customOption.textContent = category === "Custom" ? "Type your own risk below" : "Custom risk in this category...";
    newPredefinedRiskSelect.appendChild(customOption);

    // Native <select> options can't wrap, so the dropdown shows a short label
    // and the full wording goes into the risk textarea below (and a tooltip).
    // Entries carrying a "group" are bucketed into <optgroup> headings (the
    // Cyber taxonomy uses this); entries without one are appended flat, so the
    // other categories render exactly as before. The option value stays the
    // index into the flat category array either way, which is what the change
    // handler below looks up.
    let currentGroup = null;
    let target = newPredefinedRiskSelect;

    (RISK_CATALOG[category] || []).forEach((risk, index) => {
      if (risk.group) {
        if (risk.group !== currentGroup) {
          currentGroup = risk.group;
          target = document.createElement("optgroup");
          target.label = risk.group;
          newPredefinedRiskSelect.appendChild(target);
        }
      } else {
        currentGroup = null;
        target = newPredefinedRiskSelect;
      }

      const option = document.createElement("option");
      option.value = index;
      option.textContent = risk.label || risk.text;
      option.title = risk.text;
      target.appendChild(option);
    });
  }

  // Grow a textarea to fit its content so long risk/mitigation text stays visible.
  // scrollHeight excludes the border, so under box-sizing: border-box the border
  // has to be added back or the last line ends up clipped by a couple of pixels.
  function autoGrow(el) {
    if (!el) return;
    el.style.height = "auto";
    const styles = window.getComputedStyle(el);
    const border = styles.boxSizing === "border-box"
      ? (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0)
      : 0;
    el.style.height = (el.scrollHeight + border) + "px";
  }

  const newMitigationInput = document.getElementById("new-mitigation");

  // Keep both fields sized to their content as the user types.
  [newRiskInput, newMitigationInput].forEach(field => {
    if (field) field.addEventListener("input", () => autoGrow(field));
  });

  // A narrower column wraps the same text onto more lines, so heights worked out
  // at one viewport width go stale at another. Re-fit every textarea on resize
  // (and on phone rotation), debounced so it doesn't run on every resize event.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document
        .querySelectorAll("#new-risk, #new-mitigation, #risk-notes textarea")
        .forEach(autoGrow);
    }, 100);
  });

  newCategorySelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    populatePredefinedRisks(category);
    newRiskInput.value = "";
    newMitigationInput.value = "";
    autoGrow(newRiskInput);
    autoGrow(newMitigationInput);
    if (category === "Custom") {
      newRiskInput.focus();
    }
  });

  newPredefinedRiskSelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    const index = newPredefinedRiskSelect.value;

    if (index === "" || !RISK_CATALOG[category]) {
      newRiskInput.value = "";
      newMitigationInput.value = "";
      autoGrow(newRiskInput);
      autoGrow(newMitigationInput);
      newRiskInput.focus();
      return;
    }

    const predefined = RISK_CATALOG[category][index];
    newRiskInput.value = predefined.text;
    newMitigationInput.value = predefined.mitigation;
    newLikelihoodSelect.value = predefined.likelihood;
    newImpactSelect.value = predefined.impact;
    autoGrow(newRiskInput);
    autoGrow(newMitigationInput);
  });

  populatePredefinedRisks("");

  // Save data to localStorage
  saveButton.addEventListener("click", () => {
    const risksWithNotes = risksList.map(risk => ({
      number: risk.number,
      text: risk.text,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigation: risk.mitigation,
      category: risk.category
    }));
    const matrixValues = Array.from(inputs).map(input => input.value);
    localStorage.setItem(
      "riskMatrix",
      JSON.stringify({ matrix: matrixValues, notes: risksWithNotes })
    );
    alert("Risks saved!");
  });

  // Load data from localStorage
  loadButton.addEventListener("click", () => {
    const savedData = JSON.parse(localStorage.getItem("riskMatrix"));
    if (savedData) {
      const { matrix, notes } = savedData;
  
      // Restore matrix
      inputs.forEach((input, index) => {
        input.value = matrix[index] || "";
      });
  
      // Clear and repopulate notes
      riskNotes.innerHTML = "";
      risksList.length = 0; // Clear the existing risks list
  
      // Load notes and set the riskCounter to the highest number + 1
      if (notes.length > 0) {
        notes.forEach(note => {
          risksList.push(note);
          addRiskToNotes(note);
        });
        riskCounter = Math.max(...notes.map(note => note.number)) + 1;
      } else {
        riskCounter = 1; // Reset to 1 if no notes
      }
  
      alert("Risks loaded!");
    } else {
      alert("No saved risks found.");
    }
  });
  

// Clear all data
clearButton.addEventListener("click", () => {
  // Show confirmation dialog
  const confirmation = confirm("Are you sure you want to clear all risks?");
  
  if (confirmation) {
    // Clear matrix cells
    const matrixInputs = document.querySelectorAll("#risk-matrix textarea");
    matrixInputs.forEach(input => input.value = ""); // Clear matrix textareas (if any)

    // Clear notes section
    riskNotes.innerHTML = ""; // Clear all risk notes in the notes list
    risksList.length = 0; // Clear the internal risks list array

    // Clear the matrix graph
    const allCells = document.querySelectorAll("#risk-matrix tbody td");
    allCells.forEach(cell => {
      cell.innerHTML = ""; // Remove all risk elements from the matrix
    });

    // Reset the risk counter
    riskCounter = 1; // Start risk numbering over

    // Clear the new risk form fields
    newRiskInput.value = ""; // Clear the risk description
    newLikelihoodSelect.value = "Likely"; // Reset likelihood dropdown to default value
    newImpactSelect.value = "Low"; // Reset impact dropdown to default value
    document.getElementById("new-mitigation").value = ""; // Clear the mitigation input field
    autoGrow(newRiskInput); // Shrink the textareas back to their base height
    autoGrow(document.getElementById("new-mitigation"));
    newCategorySelect.value = ""; // Reset category dropdown
    populatePredefinedRisks(""); // Reset and disable the predefined-risk dropdown

    alert("Risks and matrix cleared!");
  } else {
    alert("Action canceled. Risks were not cleared.");
  }
});

  

// Add risk
addRiskButton.addEventListener("click", () => {
  const riskText = newRiskInput.value.trim();
  const likelihood = newLikelihoodSelect.value;
  const impact = newImpactSelect.value;
  const mitigation = document.getElementById("new-mitigation").value.trim(); // Get mitigation text
  const category = newCategorySelect.value || "Custom";

  if (riskText) {
    // Get the last risk number from the existing risks list (notes)
    const lastRiskNumber = risksList.length > 0 ? risksList[risksList.length - 1].number : 0;

    // Set the new risk number as the next available number
    const riskNumber = lastRiskNumber + 1;

    const risk = {
      number: riskNumber,
      text: riskText,
      likelihood,
      impact,
      mitigation, // Store mitigation with risk
      category
    };

    risksList.push(risk);
    addRiskToNotes(risk);

    // Ready the form for the next risk, without forcing the category to be re-picked.
    newRiskInput.value = "";
    document.getElementById("new-mitigation").value = "";
    autoGrow(newRiskInput);
    autoGrow(document.getElementById("new-mitigation"));
    if (newPredefinedRiskSelect.options.length > 0) {
      newPredefinedRiskSelect.selectedIndex = 0;
    }
  } else {
    alert("Risk description cannot be empty.");
  }
});

// Add risk to notes and matrix
function addRiskToNotes(risk) {
  // Create note element
  const riskListItem = document.createElement("li");
  riskListItem.dataset.riskId = risk.number;

  // Add the risk number and other fields
  const category = risk.category || "Custom";
  riskListItem.innerHTML = `
    <span class="risk-number">#${risk.number}</span> <!-- Display the risk number -->
    <span class="risk-category cat-${category.toLowerCase()}">${category}</span>
    <textarea class="risk-text">${risk.text}</textarea> <!-- Risk Textarea -->
    <textarea class="mitigation-text" placeholder="Mitigation">${risk.mitigation || ''}</textarea>  <!-- Mitigation Textarea -->
    <select class="likelihood">
      <option value="Likely" ${risk.likelihood === "Likely" ? "selected" : ""}>Likely</option>
      <option value="Possible" ${risk.likelihood === "Possible" ? "selected" : ""}>Possible</option>
      <option value="Unlikely" ${risk.likelihood === "Unlikely" ? "selected" : ""}>Unlikely</option>
      <option value="Rare" ${risk.likelihood === "Rare" ? "selected" : ""}>Rare</option>
    </select>
    <select class="impact">
      <option value="Low" ${risk.impact === "Low" ? "selected" : ""}>Low Impact</option>
      <option value="Medium" ${risk.impact === "Medium" ? "selected" : ""}>Medium Impact</option>
      <option value="High" ${risk.impact === "High" ? "selected" : ""}>High Impact</option>
      <option value="Critical" ${risk.impact === "Critical" ? "selected" : ""}>Critical Impact</option>
    </select>
    <button class="delete-risk">Delete</button>
  `;

  // Event listeners for updates and deletion
  riskListItem.querySelector(".risk-text").addEventListener("input", e => {
    risk.text = e.target.value;
    autoGrow(e.target);
  });

  riskListItem.querySelector(".mitigation-text").addEventListener("input", e => {
    risk.mitigation = e.target.value;  // Update mitigation
    autoGrow(e.target);
  });

  riskListItem.querySelector(".likelihood").addEventListener("change", e => {
    risk.likelihood = e.target.value;
    updateRiskInMatrix(risk);
  });

  riskListItem.querySelector(".impact").addEventListener("change", e => {
    risk.impact = e.target.value;
    updateRiskInMatrix(risk);
  });

  riskListItem.querySelector(".delete-risk").addEventListener("click", () => {
    deleteRisk(riskListItem, risk.number);
  });

  // Append the updated risk item to the notes
  riskNotes.appendChild(riskListItem);

  // Size both textareas to their content now that they're in the document
  // (scrollHeight only reports correctly once the element is laid out).
  autoGrow(riskListItem.querySelector(".risk-text"));
  autoGrow(riskListItem.querySelector(".mitigation-text"));

  updateRiskInMatrix(risk);
}
 

 // Delete risk
function deleteRisk(riskItem, riskNumber) {
  // Find the index of the risk in the risks list
  const index = risksList.findIndex(risk => risk.number === riskNumber);
  if (index > -1) {
    // Remove the risk from the list
    risksList.splice(index, 1);
    
    // Re-number the remaining risks
    for (let i = index; i < risksList.length; i++) {
      risksList[i].number = i + 1;  // Update numbers starting from 1
    }
  }
  
  // Remove the risk item from the DOM
  riskItem.remove();
  
  // Update the matrix to reflect the removed risk
  removeRiskFromMatrix(riskNumber);

  // Re-render the risk notes with updated numbering
  riskNotes.innerHTML = "";
  risksList.forEach(note => addRiskToNotes(note));
  
  // Update the risk matrix with updated numbers
  updateAllRisksInMatrix();
}

// Update all risks in the matrix after deletion
function updateAllRisksInMatrix() {
  // Clear all risk elements in the matrix
  const allCells = document.querySelectorAll("#risk-matrix tbody td .risk-id");
  allCells.forEach(riskElement => riskElement.remove());

  // Re-add updated risks to the matrix
  risksList.forEach(risk => updateRiskInMatrix(risk));
}

// Update risk in the matrix
function updateRiskInMatrix(risk) {
  const rows = document.querySelectorAll("#risk-matrix tbody tr");
  rows.forEach(row => {
    row.querySelectorAll("td").forEach(cell => {
      const riskElement = cell.querySelector(`[data-risk-id="${risk.number}"]`);
      if (riskElement) {
        riskElement.remove(); // Remove existing element if present
      }
    });
  });

  const rowIndex = ["Likely", "Possible", "Unlikely", "Rare"].indexOf(risk.likelihood);
  const colIndex = ["Low", "Medium", "High", "Critical"].indexOf(risk.impact);
  const cell = document.querySelector(`#risk-matrix tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 2})`);

  if (cell) {
    // Create a div to hold the risk numbers
    const riskElement = document.createElement("div");
    riskElement.classList.add("risk-id");
    riskElement.textContent = `#${risk.number}`;
    riskElement.dataset.riskId = risk.number;

    // Wrap all risk numbers in a container with flex-wrap style
    let riskContainer = cell.querySelector('.risk-cell');
    if (!riskContainer) {
      riskContainer = document.createElement("div");
      riskContainer.classList.add("risk-cell");
      cell.appendChild(riskContainer);
    }

    // Append the new risk element to the container
    riskContainer.appendChild(riskElement);
  }
}



  // Remove risk from the matrix
  function removeRiskFromMatrix(riskNumber) {
    const rows = document.querySelectorAll("#risk-matrix tbody tr");
    rows.forEach(row => {
      row.querySelectorAll("td").forEach(cell => {
        const riskElement = cell.querySelector(`[data-risk-id="${riskNumber}"]`);
        if (riskElement) {
          riskElement.remove();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const risk = { likelihood: "Likely", impact: "High" };  // Example risk data (this could come from your data)
  
    // Function to update the likelihood dropdown
    function updateLikelihood() {
      const likelihoodSelect = document.getElementById("new-likelihood");
      const options = likelihoodSelect.querySelectorAll("option");
  
      options.forEach(option => {
        if (option.value === risk.likelihood) {
          option.selected = true;  // Select the option based on risk.likelihood
        }
      });
    }
  
    // Function to update the impact dropdown
    function updateImpact() {
      const impactSelect = document.getElementById("new-impact");
      const options = impactSelect.querySelectorAll("option");
  
      options.forEach(option => {
        if (option.value === risk.impact) {
          option.selected = true;  // Select the option based on risk.impact
        }
      });
    }
  
    // Call the functions to update selections
    updateLikelihood();
    updateImpact();
  });
  

  // Export data to Excel
exportButton.addEventListener("click", () => {
  // The spreadsheet library is loaded from a CDN; say so plainly rather than
  // failing with a console-only ReferenceError if it didn't arrive.
  if (typeof XLSX === "undefined") {
    alert("The spreadsheet library didn't load, so the export can't run. Check your connection and reload the page.");
    return;
  }

  const data = [];
  const headers = ["Risk Number", "Category", "Risk Text", "Likelihood", "Impact", "Mitigation"];
  data.push(headers);

  // Add risks to the risk list
  risksList.forEach(risk => {
    data.push([`#${risk.number}`, risk.category || "Custom", risk.text, risk.likelihood, risk.impact, risk.mitigation || ""]);
  });

  // Create a worksheet for the risk list
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 70 }, { wch: 12 }, { wch: 14 }, { wch: 70 }];
  styleHeaderRow(ws, headers.length);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Risk List");

  // Create risk matrix data based on likelihood and impact, then colour every
  // cell to match the matrix on the page.
  const riskMatrixData = generateRiskMatrixData();
  const matrixWs = XLSX.utils.aoa_to_sheet(riskMatrixData);
  styleRiskGraph(matrixWs);
  XLSX.utils.book_append_sheet(wb, matrixWs, "Risk Graph");

  // Write and download the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Risk_List_with_Graph.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// Function to generate risk matrix data based on likelihood and impact
function generateRiskMatrixData() {
  const matrixData = [];
  
  // Define Likelihood (columns) and Impact (rows)
  const likelihoods = ["Likely", "Possible", "Unlikely", "Rare"];
  const impacts = ["Low", "Medium", "High", "Critical"];

  // Add header row for the matrix (Likelihood categories)
  const headerRow = ["Impact\\Likelihood", ...likelihoods];
  matrixData.push(headerRow);

  // Loop through impacts (rows) and fill the matrix with appropriate risk numbers
  impacts.forEach((impact, rowIndex) => {
    const rowData = [impact]; // Start with the Impact category

    // Add risks that fit the current impact and likelihood combination
    likelihoods.forEach((likelihood, colIndex) => {
      // Get risks that match this likelihood and impact combination
      const risksInCategory = risksList.filter(risk => risk.likelihood === likelihood && risk.impact === impact);
      
      // If there are risks, display the risk numbers; otherwise, leave blank
      if (risksInCategory.length > 0) {
        // Add the risk numbers or just display the risk count if there are multiple risks
        const riskNumbers = risksInCategory.map(risk => `#${risk.number}`).join(", ");
        rowData.push(riskNumbers);
      } else {
        rowData.push(""); // No risks in this category
      }
    });

    matrixData.push(rowData);
  });

  // Legend, so the exported sheet explains its own colours.
  matrixData.push([]);
  matrixData.push(["Risk level"]);
  ["Low", "Medium", "High", "Critical"].forEach(level => matrixData.push([level]));

  return matrixData;
}

// Bold white-on-slate header row, used for both sheets.
function styleHeaderRow(sheet, columnCount) {
  for (let c = 0; c < columnCount; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c });
    if (!sheet[ref]) sheet[ref] = { t: "s", v: "" };
    sheet[ref].s = {
      font: { bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "FF4276A6" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
  }
}

// Colour the exported matrix so it reads like the one on the page.
function styleRiskGraph(sheet) {
  const likelihoods = ["Likely", "Possible", "Unlikely", "Rare"];
  const impacts = ["Low", "Medium", "High", "Critical"];
  const border = {
    top:    { style: "thin", color: { rgb: "FFAAAAAA" } },
    bottom: { style: "thin", color: { rgb: "FFAAAAAA" } },
    left:   { style: "thin", color: { rgb: "FFAAAAAA" } },
    right:  { style: "thin", color: { rgb: "FFAAAAAA" } }
  };

  const setCell = (r, c, style) => {
    const ref = XLSX.utils.encode_cell({ r, c });
    if (!sheet[ref]) sheet[ref] = { t: "s", v: "" };
    sheet[ref].s = style;
  };

  sheet["!cols"] = [{ wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];

  styleHeaderRow(sheet, likelihoods.length + 1);

  impacts.forEach((impact, rowOffset) => {
    const r = rowOffset + 1;

    // Impact label down the left edge.
    setCell(r, 0, {
      font: { bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "FF4276A6" } },
      alignment: { horizontal: "center", vertical: "center" },
      border
    });

    likelihoods.forEach((likelihood, colOffset) => {
      setCell(r, colOffset + 1, {
        fill: { patternType: "solid", fgColor: { rgb: RATING_FILL[MATRIX_RATING[likelihood][impact]] } },
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, color: { rgb: "FF335782" } },
        border
      });
    });
  });

  // Legend block: a blank row, a heading, then one swatch per level.
  setCell(6, 0, { font: { bold: true } });
  ["low", "medium", "high", "critical"].forEach((level, i) => {
    setCell(7 + i, 0, {
      fill: { patternType: "solid", fgColor: { rgb: RATING_FILL[level] } },
      alignment: { horizontal: "center" },
      border
    });
  });
}

});

/* ---------------------------------------------------------------------------
 * Rating guide: "How to rate this risk"
 *
 * Scale definitions for likelihood and impact, plus a reference scale for
 * mitigation effectiveness, shown in a collapsible panel under the Likelihood
 * and Impact selects. Adapted from practitioner risk-rating scales and written
 * generically. The panel re-renders whenever the category, the predefined
 * risk, either rating, or a Clear changes the form, so the levels currently
 * selected are always the ones highlighted.
 *
 * Impact is rated on the most severe dimension that applies. All four
 * dimensions are always shown so no single lens biases the rating; the
 * category only decides which one is listed first.
 * ------------------------------------------------------------------------- */
(function () {
  const LIKELIHOOD_GUIDE = [
    { level: "Likely", band: "More than 75%", text: "Expected to happen within one to two years without further action, or already happening somewhere comparable." },
    { level: "Possible", band: "50% to 75%", text: "More likely than not to happen within one to two years without further action." },
    { level: "Unlikely", band: "25% to 50%", text: "Could happen within one to two years, but less likely than not." },
    { level: "Rare", band: "Less than 25%", text: "Not expected within one to two years, though it cannot be ruled out." }
  ];

  const IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"];

  const IMPACT_DIMENSIONS = {
    individuals: {
      title: "Impact on individuals",
      levels: {
        Low: "Individuals are not affected, or meet a few inconveniences they will overcome without any problem.",
        Medium: "Individuals meet significant inconveniences they can overcome despite a few difficulties.",
        High: "Individuals face significant consequences they should overcome, but with real and serious difficulties.",
        Critical: "Individuals face significant or even irreversible consequences they may not overcome."
      }
    },
    compliance: {
      title: "Compliance",
      levels: {
        Low: "A single breach with no legal impact, such as non-compliance with an internal policy. Any past audit finding rated low. No need to inform a regulator or other authority.",
        Medium: "Repeated breaches of the same kind, still without legal impact. Any past audit finding rated low. Informal notification to a regulator or other authority may be needed.",
        High: "A considerable breach, or repeated breaches with legal impact, that could bring more inspections, fines or other consequences. Past audit finding rated medium. The regulator or authority, and the individuals affected, must be notified.",
        Critical: "A serious breakdown of the control environment, across several locations or with material losses, that could bring formal sanctions or material fines. Past audit finding rated high. Full disclosure to regulators, authorities and the individuals affected."
      }
    },
    operational: {
      title: "Operational",
      levels: {
        Low: "Core operations or financial transactions disrupted for under a day. Critical systems down for under 5 hours at a single location. Other activities or systems disrupted for under 5 days.",
        Medium: "Core operations disrupted for 1 to 2 days. Critical systems down for under 5 hours across several locations. Other activities or systems disrupted for 5 days to 2 weeks.",
        High: "Core operations disrupted for 2 to 5 days. Critical systems down for 5 to 24 hours. Other activities or systems disrupted for more than 2 weeks.",
        Critical: "Core operations disrupted for more than 5 days. Critical systems down for more than 24 hours."
      }
    },
    reputational: {
      title: "Reputational",
      levels: {
        Low: "Limited local or trade media coverage and social media mentions, isolated complaints, minimal stakeholder reaction, no regulator interest.",
        Medium: "Negative local or trade media coverage, some social media conversation, moderate levels of complaints, some attention from advocacy groups, regulator comments or questions.",
        High: "Negative national media coverage, growing social media conversation, advocacy groups contacting the organisation or campaigning publicly, a regulator debating intervention, escalations from senior customers.",
        Critical: "Extensive national and international coverage, a trending social media story, boycotts or public censure, protests or media on site, regulatory intervention, a parliamentary or police inquiry, customers cancelling orders."
      }
    }
  };

  // Which dimension leads for each category. The rest follow in this order.
  const DIMENSION_ORDER = {
    Privacy: ["individuals", "compliance", "reputational", "operational"],
    LLM: ["individuals", "compliance", "reputational", "operational"],
    AI: ["compliance", "individuals", "reputational", "operational"],
    Cyber: ["operational", "compliance", "individuals", "reputational"],
    Operational: ["operational", "reputational", "compliance", "individuals"],
    "": ["reputational", "operational", "compliance", "individuals"]
  };

  const CATEGORY_NAMES = { Privacy: "Privacy", LLM: "LLM / GenAI", AI: "AI", Cyber: "Cyber", Operational: "Operational" };

  const MITIGATION_GUIDE = [
    { level: "Strong", text: "Controls in place effectively mitigate the risk most of the time." },
    { level: "Reasonable", text: "Controls are in place, but not consistently effective." },
    { level: "Limited", text: "Controls are in place, but ineffective." },
    { level: "None", text: "No control in place." }
  ];

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function chip(level, label) {
    return el("span", "rg-chip rg-" + level.toLowerCase(), label || level);
  }

  function render() {
    const body = document.getElementById("rating-guide-body");
    if (!body) return;
    const category = (document.getElementById("new-category") || {}).value || "";
    const likelihood = (document.getElementById("new-likelihood") || {}).value || "";
    const impact = (document.getElementById("new-impact") || {}).value || "";
    const order = DIMENSION_ORDER[category] || DIMENSION_ORDER[""];

    body.innerHTML = "";

    // Current rating, read from the same table that colours the matrix.
    const rating = (typeof MATRIX_RATING !== "undefined" && MATRIX_RATING[likelihood]) ? MATRIX_RATING[likelihood][impact] : null;
    if (rating) {
      const now = el("p", "rg-current");
      now.appendChild(document.createTextNode(likelihood + " likelihood and " + impact.toLowerCase() + " impact place this risk in a "));
      now.appendChild(chip(rating, rating.charAt(0).toUpperCase() + rating.slice(1)));
      now.appendChild(document.createTextNode(" cell of the matrix."));
      body.appendChild(now);
    }

    body.appendChild(el("p", "rg-lead", "Rate the risk as it stands today. Count only controls that are already operating: planned measures belong in the mitigation text, but they do not lower the rating."));

    // Likelihood
    const lk = el("section", "rg-section");
    lk.appendChild(el("h3", "rg-heading", "Likelihood"));
    lk.appendChild(el("p", "rg-help", "The probability that the risk materialises within one to two years if no further action is taken."));
    const lkList = el("ul", "rg-list");
    LIKELIHOOD_GUIDE.forEach(row => {
      const li = el("li", "rg-row" + (row.level === likelihood ? " is-current" : ""));
      li.appendChild(el("span", "rg-level", row.level));
      li.appendChild(el("span", "rg-band", row.band));
      li.appendChild(el("span", "rg-text", row.text));
      lkList.appendChild(li);
    });
    lk.appendChild(lkList);
    body.appendChild(lk);

    // Impact
    const im = el("section", "rg-section");
    im.appendChild(el("h3", "rg-heading", "Impact"));
    im.appendChild(el("p", "rg-help", "The worst credible consequence if the risk occurs. Check every dimension and rate on the most severe one that applies. Several dimensions are shown so that no single lens biases the rating, and no amount of financial loss is assumed."));
    const grid = el("div", "rg-dimensions");
    order.forEach((key, i) => {
      const dim = IMPACT_DIMENSIONS[key];
      const card = el("div", "rg-dimension" + (i === 0 && category && category !== "Custom" ? " is-lead" : ""));
      const head = el("h4", "rg-dim-title", dim.title);
      if (i === 0 && CATEGORY_NAMES[category]) {
        head.appendChild(el("span", "rg-tag", "Leads for " + CATEGORY_NAMES[category] + " risks"));
      }
      card.appendChild(head);
      const list = el("ul", "rg-list");
      IMPACT_LEVELS.forEach(level => {
        const li = el("li", "rg-row rg-row-stacked" + (level === impact ? " is-current" : ""));
        li.appendChild(chip(level));
        li.appendChild(el("span", "rg-text", dim.levels[level]));
        list.appendChild(li);
      });
      card.appendChild(list);
      grid.appendChild(card);
    });
    im.appendChild(grid);
    body.appendChild(im);

    // Mitigation effectiveness (reference only)
    const mt = el("section", "rg-section");
    mt.appendChild(el("h3", "rg-heading", "Mitigation effectiveness"));
    mt.appendChild(el("p", "rg-help", "How strong the existing controls are, for example training, assessments, policies or agreements. Use it to sanity-check the likelihood: with limited or no controls, a Rare or Unlikely rating needs a reason other than the controls."));
    const mtList = el("ul", "rg-list");
    MITIGATION_GUIDE.forEach(row => {
      const li = el("li", "rg-row");
      li.appendChild(el("span", "rg-level", row.level));
      li.appendChild(el("span", "rg-text", row.text));
      mtList.appendChild(li);
    });
    mt.appendChild(mtList);
    body.appendChild(mt);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Registered after the page's own handlers, so a predefined risk has
    // already written its suggested ratings into the selects when this runs.
    ["new-category", "new-predefined-risk", "new-likelihood", "new-impact"].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.addEventListener("change", render);
    });
    const clear = document.getElementById("clear-data");
    if (clear) clear.addEventListener("click", render);
    render();
  });
})();
