// Catalog of Privacy, AI, LLM/GenAI, Cyber, and Operational risks. The Cyber
// set is a 107-item enterprise taxonomy grouped into 14 sections, rendered as
// <optgroup> headings in the picker; its likelihood/impact values are as
// supplied, and the matrix above decides the resulting rating.
// The Privacy/AI/Operational entries are drawn from real practitioner guidance (genericized
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
    { label: "Invalid or bundled consent", text: "Consent is collected through pre-ticked boxes, vague language, or bundled with an unrelated purpose or terms & conditions", mitigation: "Redesign consent flows so each purpose is opted into separately, remove pre-ticked boxes, and make withdrawing consent as easy as giving it.", likelihood: "Likely", impact: "Medium" },
    { label: "Non-compliant cookie banner", text: "A cookie or tracking banner allows non-essential cookies to load before consent, or doesn't give \"Reject All\" the same visual weight as \"Accept All\"", mitigation: "Block non-essential cookies by default until the user actively consents, and present \"Reject All\" on equal footing with \"Accept All\".", likelihood: "Likely", impact: "Medium" },
    { label: "Data kept past its retention period", text: "Personal data is kept past its retention period because no deletion trigger or schedule was ever applied", mitigation: "Apply a retention label or schedule to each data category at creation, with deletion triggered automatically once it expires.", likelihood: "Likely", impact: "High" },
    { label: "Data reused for an unrelated purpose", text: "Personal data collected for one purpose is reused for an unrelated purpose without a fresh legal basis or consent", mitigation: "Check the original purpose and legal basis before any new use; obtain fresh consent or document a compatibility assessment when the new purpose isn't compatible.", likelihood: "Possible", impact: "High" },
    { label: "Obsolete website left active", text: "An obsolete or unused website or microsite is left active instead of being deactivated or secured", mitigation: "Maintain an inventory of live web properties and deactivate or secure any that are no longer in active use.", likelihood: "Unlikely", impact: "Medium" },
    { label: "Monitoring without a proportionality check", text: "Employee monitoring or location-tracking tools are deployed without a proportionality check, notice, or consent", mitigation: "Assess proportionality before deploying monitoring or tracking tools, disable non-essential tracking by default, and notify those being monitored.", likelihood: "Possible", impact: "High" },
    { label: "Third-party access without a DPA", text: "A third party is given access to personal data without a signed data processing agreement in place", mitigation: "Make an executed data processing agreement a condition of any third party gaining access to personal data.", likelihood: "Possible", impact: "High" }
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
