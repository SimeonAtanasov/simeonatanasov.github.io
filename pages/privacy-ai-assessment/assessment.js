(function () {
	"use strict";

	/* =================================================================
	 *  Privacy Assessment (DPIA screening) and AI Risk Assessment.
	 *  Modeled on real-world practitioner assessment structures
	 *  (a DPIA screening assessment and an EU AI Act risk
	 *  assessment / AI inventory), fully genericized - no company-
	 *  specific process names, teams, or systems.
	 * ================================================================= */

	var LEVELS = ["Low", "Medium", "High"]; // ascending order for escalate()
	function escalate(current, next) {
		return LEVELS.indexOf(next) > LEVELS.indexOf(current) ? next : current;
	}

	/* ---------------- SHARED VOCABULARIES ----------------
	 * Used by more than one module so answers carry across intact
	 * (the Privacy Assessment hands its lawful bases and DPIA criteria
	 * straight to the full DPIA rather than being re-inferred). */

	var ART6_BASES = [
		"Consent of the individual",
		"Necessary for the performance of a contract with the individual",
		"Necessary for compliance with a legal obligation",
		"Necessary to protect vital interests",
		"Necessary for a task carried out in the public interest or official authority",
		"Necessary for the legitimate interests of the organization or a third party"
	];

	var ART9_CONDITIONS = [
		"Explicit consent of the individual",
		"Obligations and rights in employment, social security and social protection law",
		"Protection of vital interests where the individual cannot consent",
		"Processing relating to members of a not-for-profit body",
		"Data manifestly made public by the individual",
		"Establishment, exercise or defence of legal claims",
		"Substantial public interest, on the basis of law",
		"Preventive or occupational medicine, assessment of working capacity, or health or social care",
		"Public interest in the area of public health",
		"Archiving, scientific or historical research, or statistical purposes"
	];

	// Art. 35(3) as expanded by the European guidance. Two or more
	// normally means a full DPIA is required.
	var DPIA_TRIGGERS = [
		"Evaluation, scoring, profiling or prediction",
		"Automated decision-making with a legal or similarly significant effect",
		"Systematic monitoring, including of a publicly accessible area or of employees",
		"Special category data, criminal offence data, or data of a highly personal nature",
		"Large-scale processing",
		"Matching or combining datasets",
		"Data concerning vulnerable individuals (children, employees, patients, the elderly)",
		"Innovative use, or a new technology or organisational solution",
		"Processing that prevents individuals from exercising a right, using a service, or entering a contract"
	];

	var DPIA_CONTROLS = [
		"Access rights management and least privilege",
		"Access logging and monitoring",
		"Encryption in transit and at rest",
		"Pseudonymisation",
		"Anonymisation or aggregation for secondary uses",
		"Data masking in non-production environments",
		"Data processing agreement with the supplier",
		"Data protection clauses in third-party contracts",
		"Intra-group data processing agreement",
		"Appropriate safeguards for transfers outside the home region",
		"Legitimate interest balancing test completed",
		"Processing recorded in the RoPA",
		"Retention and deletion rules implemented in the system",
		"Backup and tested restore procedure",
		"Security testing or penetration testing",
		"Training for staff handling this data",
		"Incident response and breach notification procedure",
		"DPIA performed",
		"Prior consultation with the supervisory authority"
	];

	var TRANSFER_SAFEGUARDS = [
		"Adequacy decision",
		"Standard contractual clauses (controller to processor)",
		"Standard contractual clauses (controller to controller)",
		"Binding corporate rules",
		"Approved code of conduct",
		"Approved certification mechanism",
		"Approved ad hoc contractual clauses",
		"UK international data transfer addendum",
		"Derogation for a specific situation",
		"None identified yet"
	];

	// Vendor characteristics that make a transfer impact assessment
	// necessary, because they raise the risk of foreign authority access.
	var TIA_TRIGGERS = [
		"The supplier is a telecommunications carrier or internet service provider",
		"The supplier provides a communications service (email, messaging, video)",
		"The supplier provides cloud storage available to the general public",
		"The supplier provides remote computing services (virtual machines, AI, financial processing)",
		"The supplier can access communications between our users, or between us and our users",
		"The supplier is wholly or partly state-owned",
		"The supplier processes or stores financial or payment information",
		"The supplier or its subcontractors store data in a country without an adequacy decision"
	];

	var DATA_SUBJECT_TYPES = [
		"Customers",
		"Consumers",
		"Employees and contractors",
		"Job candidates",
		"Suppliers and business partners",
		"Website or app users",
		"Children",
		"Other"
	];

	// Grouped the way a data inventory usually groups elements.
	var DATA_CATEGORIES = [
		"Basic identity and personal characteristics (name, date of birth, nationality)",
		"Private contact information (home address, personal email, personal phone)",
		"Business contact information (job title, work email, work phone, department)",
		"Official identification (passport, national ID, tax or social security number)",
		"Employment administration data (contract, working time, absence, leavers)",
		"Compensation and benefits (salary, bonuses, pension, deductions)",
		"Education, qualifications and training records",
		"Work activities and performance (objectives, appraisals, disciplinary records)",
		"Bank and card data (account details, payment card data)",
		"Financial and credit data (credit checks, financial history)",
		"Assigned company assets (devices, access badges, company car, fines)",
		"Travel and expense data",
		"Family relations and dependants",
		"Location, movement or telematics data",
		"Logs, recordings and monitoring data (CCTV, call recordings, system logs)",
		"Technical identifiers, authentication and authorisation data",
		"Social media and internet activity",
		"Lifestyle and preferences",
		"Workplace safety and incident data",
		"Background checks (employment, education, criminal record)",
		"Special category data (health, biometric, genetic, racial or ethnic origin, religion, political opinion, trade union membership, sex life or orientation)",
		"Criminal offence data",
		"Other"
	];

	var VULNERABLE_TYPES = [
		"Children (under 13)",
		"Employees and other staff members",
		"Patients, or people with a mental or physical illness",
		"Elderly people",
		"People in financial hardship or debt",
		"Asylum seekers or people in a dependent position",
		"Other"
	];

	var PROCESSING_PURPOSES = [
		"Service delivery or contract performance",
		"HR administration and workforce management",
		"Recruitment and candidate assessment",
		"Payroll, benefits and expenses",
		"Customer service and support",
		"Marketing, advertising and audience analytics",
		"Sales, CRM and account management",
		"Product or service improvement and research",
		"Business intelligence and reporting",
		"Legal and regulatory compliance",
		"Security, fraud prevention and investigations",
		"Health, safety and workplace incident management",
		"Supplier and third-party management",
		"Other"
	];

	var MARKETING_TECH = [
		"Cookies",
		"Pixel tags or web beacons",
		"Browser fingerprinting",
		"Analytics tools",
		"Profiling or audience-segmentation tools",
		"Movement sensors",
		"Cameras",
		"Location tracking",
		"Automated decision-making or algorithmic targeting",
		"None of these",
		"Other"
	];

	var ADVERTISING_BIAS = [
		"Race or ethnic origin",
		"Gender",
		"Age",
		"Physical characteristics",
		"Socioeconomic status",
		"Health status",
		"No identified bias",
		"Other"
	];

	// Region shortcuts first (so ticking one covers a whole group without
	// hunting down every member state), then the full country list
	// alphabetically, then "Other" for anything not listed. Shared across
	// modules so the Privacy Assessment's answer carries over to the DPIA
	// intact rather than being retyped.
	var COUNTRIES_REGIONS = [
		"Global / worldwide (all countries)",
		"Whole EU/EEA (all member states)",
		"Whole European Union (EU) only",
		"Whole EFTA (Iceland, Liechtenstein, Norway, Switzerland)",
		"Whole United Kingdom",
		"Whole North America (US & Canada)",
		"Whole Latin America & the Caribbean",
		"Whole Asia-Pacific (APAC)",
		"Whole Middle East",
		"Whole Africa",
		"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
		"Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
		"Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
		"Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Republic of the)", "Congo (Democratic Republic of the)",
		"Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
		"Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
		"Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
		"Guyana", "Haiti", "Honduras", "Hong Kong SAR", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
		"Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
		"Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
		"Luxembourg", "Macau SAR", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
		"Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
		"Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
		"Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
		"Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
		"San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
		"Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
		"Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
		"Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
		"Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
		"Other"
	];

	/* ---------------- PRIVACY ASSESSMENT ---------------- */
	var PRIVACY_STEPS = [
		{
			key: "basics",
			title: "Project information",
			questions: [
				{ id: "name", type: "text", label: "Process or project name" },
				{ id: "description", type: "textarea", label: "Describe the project or planned activity: what it does, for whom, and why it is needed" },
				{ id: "projectTypes", type: "multiselect", label: "What type of project is this?", options: [
					"General project",
					"Marketing project",
					"Business analytics project",
					"Involves an AI system"
				] },
				{ id: "changeType", type: "select", label: "Is this a new activity or a change to an existing one?", options: ["New activity", "Changed activity", "Not sure"] },
				{ id: "goLiveDate", type: "date", label: "When will it become operational? (leave blank if already live or not set)" },
				{ id: "countries", type: "multiselect", label: "Which countries or regions does this process apply to?", options: COUNTRIES_REGIONS,
					note: { label: "Specify the other country or countries", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "area", type: "select", label: "Which business area does this belong to?", options: ["HR & People", "Marketing & Sales", "Customer Service", "Finance", "IT & Technology", "Supply Chain & Operations", "Legal & Compliance", "Other"],
					note: { label: "Specify the business area", visibleIf: function (v) { return v === "Other"; } } },
				{ id: "projectOwner", type: "text", label: "Who owns this project? (name or role of the business owner, and any other team contacts)" },
				{ id: "referenceNumbers", type: "text", label: "Reference numbers (ticket, project or demand IDs) so this assessment can be traced back" }
			]
		},
		{
			key: "gate",
			title: "Screening",
			questions: [
				{ id: "hasPersonalData", type: "yesno", label: "Will personal data be processed - any information relating to an identified or identifiable individual?",
					note: { label: function (v) { return v === "Yes" ? "Briefly clarify what personal data is involved" : "Explain why no personal data is involved (e.g. fully anonymous or aggregate data only)"; }, visibleIf: function (v) { return !!v; } } }
			]
		},
		{
			key: "subjects",
			title: "Whose data, and what data",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			questions: [
				{ id: "dataSubjects", type: "multiselect", label: "Whose personal data will be processed?", options: DATA_SUBJECT_TYPES,
					note: { label: "Specify the other data subjects", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "dataCategories", type: "multiselect", label: "What categories of personal data will be processed?", options: DATA_CATEGORIES,
					note: { label: "Specify the other data categories", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "vulnerableTypes", type: "multiselect", label: "Are any of the individuals vulnerable? Select all that apply - leave blank if none.", options: VULNERABLE_TYPES,
					note: { label: "Specify the other vulnerable group", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "businessCriticalData", type: "select", label: "Apart from personal data, is any business-critical data processed - evidence of business decisions, contracts, activities or transactions that may be needed for audit or legal purposes?", options: ["Yes", "No", "Not sure"],
					note: { label: "What business-critical data, and which retention rules apply to it?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "recordVolume", type: "select", label: "Roughly how many individuals will be involved?", options: [
					"Fewer than 100", "100 to 1,000", "1,000 to 10,000", "10,000 to 100,000", "More than 100,000", "Not yet known"
				] }
			]
		},
		{
			key: "purposes",
			title: "Purposes, lawful basis & retention",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			intro: "Personal data cannot be kept indefinitely - every purpose needs its own retention period, defined before processing starts.",
			questions: [
				{ id: "purposes", type: "multiselect", label: "What are the purposes of processing?", options: PROCESSING_PURPOSES,
					note: { label: "Specify the other purpose(s)", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "purposeRetention", type: "textarea", label: "List each purpose with its retention period. Be specific - \"business analytics\" is not a purpose.",
					placeholder: "Purpose: … / Retention: …" },
				{ id: "retentionDefined", type: "select", label: "Is a retention period defined and documented for every purpose above?", options: ["Yes", "Partially", "No"],
					note: { label: "Specify the retention period(s) and how deletion is enforced", visibleIf: function (v) { return v === "Yes" || v === "Partially"; } } },
				{ id: "legalGrounds", type: "multiselect", label: "What is the lawful basis for processing (Art. 6)?", options: ART6_BASES },
				{ id: "specialCategoryGrounds", type: "multiselect", label: "Which Art. 9 condition applies to the special category data?", options: ART9_CONDITIONS,
					visibleIf: function (a) { return computeSpecialCategory(a); } },
				{ id: "deIdentificationPossible", type: "select", label: "Could the purposes be achieved using de-identified data instead?", options: ["Yes - and we will", "Yes, partially", "No - identifiable data is necessary", "Not yet assessed"],
					note: { label: "Explain why identifiable data is necessary, or what will be de-identified", visibleIf: function (v) { return !!v; } } },
				{ id: "privacyNotice", type: "select", label: "Is this purpose covered by an existing privacy notice?", options: ["Yes", "No", "Not sure"],
					note: { label: function (v) { return v === "Yes" ? "Which notice, and where is it published?" : "What is the plan and timeline to inform individuals?"; }, visibleIf: function (v) { return !!v; } } }
			]
		},
		{
			key: "access",
			title: "Access, systems & outputs",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			questions: [
				{ id: "internalAccess", type: "textarea", label: "Which departments, functions or roles will have access to the personal data, and why does each need it?" },
				{ id: "systemsAssets", type: "textarea", label: "Which systems, applications or services will hold or process the data?" },
				{ id: "systemOfRecord", type: "select", label: "Will any system here act as the system of record - the authoritative and only storage location for this data?", options: ["Yes", "No", "Not sure"],
					note: { label: "Which system, and are retention and deletion rules defined in it?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "appDecommissioning", type: "select", label: "Does this require decommissioning an old application?", options: ["Yes", "No", "Not sure"],
					note: { label: "What happens to the data in the old system - migrated, archived or securely destroyed?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "mobileComponent", type: "select", label: "Is there a mobile component (mobile app, wearable, handheld device)?", options: ["Yes", "No", "Not sure"],
					note: { label: "Describe the mobile component", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "dataExtracts", type: "select", label: "Can personal data be extracted to other systems or formats (spreadsheet, email, PDF)?", options: ["Yes", "No", "Not sure"],
					note: { label: "Who can extract data, and what controls apply to the extracts?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "automatedReports", type: "select", label: "Does it allow self-made or automated reports containing personal data?", options: ["Yes", "No", "Not sure"],
					note: { label: "Who can build reports, and who receives them?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "reportControls", type: "textarea", label: "What controls govern report creation, distribution, storage and deletion?",
					visibleIf: function (a) { return a.automatedReports === "Yes" || a.dataExtracts === "Yes"; } }
			]
		},
		{
			key: "thirdparties",
			title: "Third parties & transfers",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			questions: [
				{ id: "thirdPartySharing", type: "yesno", label: "Will any organization outside your own come into contact with the personal data?",
					note: { label: "Who are they, and what will they do with the data?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "processorsInvolved", type: "yesno", label: "Are any of them acting on your behalf as a processor?",
					visibleIf: function (a) { return a.thirdPartySharing === "Yes"; },
					note: { label: "Is a data processing agreement in place with each of them?", visibleIf: function (v) { return !!v; } } },
				{ id: "processorCountries", type: "text", label: "In which countries will they process or access the data (including hosting)?",
					visibleIf: function (a) { return a.processorsInvolved === "Yes"; } },
				{ id: "transfersOutside", type: "select", label: "Will personal data be transferred outside your home region (remote access counts as a transfer)?", options: ["No", "Yes", "Not sure", "Not applicable"] },
				{ id: "transferSafeguards", type: "multiselect", label: "Which safeguard will make that transfer lawful?", options: TRANSFER_SAFEGUARDS,
					visibleIf: function (a) { return a.transfersOutside === "Yes"; },
					note: { label: "Which countries is the data transferred to?", visibleIf: function () { return true; } } },
				{ id: "tiaTriggers", type: "multiselect", label: "Do any of these apply to the supplier? Each one points to a transfer impact assessment.", options: TIA_TRIGGERS,
					visibleIf: function (a) { return a.transfersOutside === "Yes"; } }
			]
		},
		{
			key: "marketing",
			title: "Marketing",
			visibleIf: function (a) { return a.hasPersonalData === "Yes" && (a.projectTypes || []).indexOf("Marketing project") !== -1; },
			questions: [
				{ id: "marketingTech", type: "multiselect", label: "Does the activity use any technology for tracking, profiling, aggregating or predicting behaviour?", options: MARKETING_TECH,
					note: { label: "Describe the technology in full - avoid abbreviations", visibleIf: function () { return true; } } },
				{ id: "socialMedia", type: "textarea", label: "Which social media or online networks are involved, and what is each party's data protection role?" },
				{ id: "furtherProcessing", type: "textarea", label: "Is there any intention to use the data later for something outside the original purpose? Describe it." },
				{ id: "consentManagement", type: "textarea", label: "If the processing relies on consent, how is it obtained, layered, recorded and withdrawn?" },
				{ id: "externalPerception", type: "textarea", label: "How could this activity be perceived by people outside the organization if the details became public?" },
				{ id: "consumerExperience", type: "textarea", label: "Describe the consumer or customer experience: profiles created, accounts, forms, and what individuals see." },
				{ id: "advertisingBias", type: "multiselect", label: "Is there potential bias in the behavioural or targeted advertising?", options: ADVERTISING_BIAS,
					note: { label: "Describe the bias and how it will be addressed", visibleIf: function (v) { return (v || []).length && (v || []).indexOf("No identified bias") === -1; } } },
				{ id: "vendorSanctioned", type: "select", label: "Have the chosen suppliers ever been sanctioned or audited by a supervisory authority?", options: ["No", "Yes", "Not sure"],
					note: { label: "Which supplier, and what was the outcome?", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "analytics",
			title: "Business analytics",
			visibleIf: function (a) { return a.hasPersonalData === "Yes" && (a.projectTypes || []).indexOf("Business analytics project") !== -1; },
			questions: [
				{ id: "dataSources", type: "textarea", label: "Describe every source of data used, including the systems the data is pulled from and how any combined dataset was assembled." },
				{ id: "thirdPartySourced", type: "yesno", label: "Is any data sourced through a relationship with third parties (wholesalers, data providers, B2B platforms, agencies)?",
					note: { label: "Which parties, and on what contractual basis?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "publicPlatformSourced", type: "yesno", label: "Is any data sourced from independent platforms or publicly accessible sources?",
					note: { label: "Which sources, and does their licensing permit this use?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "competitorData", type: "yesno", label: "Does the data include competitor product data (in any form, including image recognition)?",
					note: { label: "Describe the data and which roles can access it", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "competitorDataAccess", type: "textarea", label: "Which departments or roles will have access to the competitor product data, and to the analytics output?",
					visibleIf: function (a) { return a.competitorData === "Yes"; } },
				{ id: "intermediateControls", type: "textarea", label: "What controls apply to intermediate extracts and exchanges before the final analytics output?" },
				{ id: "sharingWithAffiliates", type: "yesno", label: "Will the data be shared with a parent company or affiliates?",
					note: { label: "Which entities, and under what agreement?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "sharingWithCompetitors", type: "yesno", label: "Will the data be shared with competitors (e.g. an open-innovation or industry initiative)?",
					note: { label: "Describe the arrangement and any competition-law review", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "ethics",
			title: "Ethics & fairness",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			intro: "Beyond strict legal compliance: whether the processing is fair, proportionate and defensible to the people whose data it is.",
			questions: [
				{ id: "benefitToIndividuals", type: "select", label: "Does the use of the data benefit the individuals as much as it benefits the organization?", options: ["Yes", "No", "Not applicable"],
					note: { label: function (v) { return v === "Yes" ? "How do they benefit?" : "Why is the processing necessary despite that?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "continuousMinimisation", type: "select", label: "Is there an active effort to minimise the data used over time?", options: ["Yes", "No", "Not applicable"],
					note: { label: "Explain", visibleIf: function (v) { return !!v; } } },
				{ id: "insightsSustainable", type: "select", label: "Are the insights meaningful over the long term, or a one-off observation?", options: ["Meaningful long term", "One-off observation", "Not sure"] },
				{ id: "transparentInclusive", type: "select", label: "Is the use of data transparent and inclusive?", options: ["Yes", "No", "Not applicable"],
					note: { label: "Explain how", visibleIf: function (v) { return !!v; } } },
				{ id: "minorityGroups", type: "textarea", label: "How do you make sure the processing does not negatively affect minority or under-represented groups?" },
				{ id: "individualReaction", type: "textarea", label: "How would individuals react if they knew every detail of this processing? What complaints can you anticipate?" }
			]
		},
		{
			key: "dpia-screening",
			title: "DPIA screening",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			intro: "These are the Art. 35(3) criteria. Two or more normally means a full DPIA is required.",
			questions: [
				{ id: "dpiaTriggers", type: "multiselect", label: "Which of these apply to the processing?", options: DPIA_TRIGGERS,
					note: { label: "Any national blacklist or whitelist entry, or sector-specific requirement, that applies", visibleIf: function () { return true; } } },
				{ id: "inventoried", type: "yesno", label: "Is this processing already recorded in your data inventory / RoPA?",
					note: { label: "When will it be added?", visibleIf: function (v) { return v === "No"; } } }
			]
		},
		{
			key: "controls",
			title: "Controls already in place",
			visibleIf: function (a) { return a.hasPersonalData === "Yes"; },
			questions: [
				{ id: "controlsInPlace", type: "multiselect", label: "Which data protection controls are already in place for this processing?", options: DPIA_CONTROLS,
					note: { label: "Any other control worth recording", visibleIf: function () { return true; } } }
			]
		}
	];

	function computeSpecialCategory(a) {
		return (a.dataCategories || []).some(function (c) {
			return c.indexOf("Special category data") === 0 || c.indexOf("Criminal offence data") === 0;
		});
	}

	function hasVulnerable(a) {
		return (a.vulnerableTypes || []).length > 0;
	}

	function privacyResult(a) {
		if (a.hasPersonalData !== "Yes") {
			return { na: true, level: "Not Applicable", dpia: "Not required", triggers: [], factors: [
				{ title: "No personal data identified", detail: "Based on your answer, this process does not appear to involve personal data. Keep this screening as the record of that decision, and re-screen if the scope changes.", severity: "low" }
			] };
		}

		var factors = [];
		var level = "Low";
		var specialCat = computeSpecialCategory(a);
		var triggers = (a.dpiaTriggers || []);

		if (specialCat) {
			factors.push({ title: "Special category or criminal offence data", detail: "This needs a condition under Art. 9 (or Art. 10) in addition to the Art. 6 lawful basis, and attracts extra safeguards.", severity: "high" });
			level = escalate(level, "Medium");
		}
		if (specialCat && !(a.specialCategoryGrounds || []).length) {
			factors.push({ title: "No Art. 9 condition selected", detail: "Special category data cannot be processed on an Art. 6 basis alone. Identify the Art. 9 condition explicitly before processing starts.", severity: "high" });
			level = escalate(level, "High");
		}
		if (!(a.legalGrounds || []).length) {
			factors.push({ title: "No lawful basis recorded", detail: "Every processing activity needs a lawful basis identified before processing begins, and stated in the privacy notice.", severity: "high" });
			level = escalate(level, "Medium");
		}
		if ((a.legalGrounds || []).indexOf(ART6_BASES[5]) !== -1 && (a.controlsInPlace || []).indexOf("Legitimate interest balancing test completed") === -1) {
			factors.push({ title: "Legitimate interests without a balancing test", detail: "Where legitimate interests is the basis, document a three-part balancing test - purpose, necessity, and the balance against individuals' rights - and keep it with this assessment.", severity: "medium" });
			level = escalate(level, "Medium");
		}

		if (triggers.indexOf(DPIA_TRIGGERS[1]) !== -1) {
			factors.push({ title: "Automated decision-making with significant effect", detail: "This is a mandatory DPIA trigger under Art. 35(3)(a), and brings individual rights under Art. 22 including the right to human intervention.", severity: "high" });
			level = escalate(level, "High");
		}
		if (triggers.indexOf(DPIA_TRIGGERS[2]) !== -1 || triggers.indexOf(DPIA_TRIGGERS[4]) !== -1) {
			factors.push({ title: "Large-scale or systematic monitoring", detail: "Large-scale processing and systematic monitoring are mandatory DPIA triggers under Art. 35(3)(b) and (c).", severity: "high" });
			level = escalate(level, "High");
		}
		if (hasVulnerable(a)) {
			if (specialCat) {
				factors.push({ title: "Vulnerable individuals and special category data", detail: "Vulnerable individuals - including employees, who cannot freely refuse - combined with special category data substantially raises the risk.", severity: "high" });
				level = escalate(level, "High");
			} else {
				factors.push({ title: "Vulnerable individuals involved", detail: "Where there is an imbalance of power between the individual and the organization, consent is rarely a valid basis and extra care is expected.", severity: "medium" });
				level = escalate(level, "Medium");
			}
		}
		if (a.recordVolume === "More than 100,000" || a.recordVolume === "10,000 to 100,000") {
			factors.push({ title: "Large number of individuals affected", detail: "Volume raises both the regulatory profile of the processing and the practical impact of anything going wrong.", severity: "medium" });
			level = escalate(level, "Medium");
		}

		if (a.retentionDefined !== "Yes") {
			factors.push({ title: "Retention periods not fully defined", detail: "Set a specific period per purpose and make sure deletion is enforced in the system, not just stated in policy.", severity: "medium" });
			level = escalate(level, "Medium");
		}
		if (a.deIdentificationPossible === "Yes - and we will" || a.deIdentificationPossible === "Yes, partially") {
			factors.push({ title: "De-identification is possible", detail: "You have said the purposes could be met with de-identified data. Data minimisation under Art. 5(1)(c) means doing so wherever it is workable - record the decision either way.", severity: "medium" });
		} else if (a.deIdentificationPossible === "Not yet assessed") {
			factors.push({ title: "De-identification not yet assessed", detail: "Assess whether pseudonymised or aggregated data would meet the purpose. It is one of the strongest risk reducers available and regulators expect it to have been considered.", severity: "medium" });
		}
		if (a.privacyNotice === "No") {
			factors.push({ title: "No privacy notice covers this purpose", detail: "Individuals must be told what is processed, why, and their rights, at or before collection. This is usually the quickest gap to close and the most visible if left open.", severity: "high" });
			level = escalate(level, "Medium");
		} else if (a.privacyNotice === "Not sure") {
			factors.push({ title: "Privacy notice coverage unconfirmed", detail: "Check the existing notice actually covers this purpose and these data categories - an existing notice does not automatically extend to a new use.", severity: "medium" });
			level = escalate(level, "Medium");
		}

		if (a.dataExtracts === "Yes" || a.automatedReports === "Yes") {
			if (!a.reportControls) {
				factors.push({ title: "Extracts or reports without documented controls", detail: "Data that leaves the system into spreadsheets, email or reports is where retention rules and access controls usually break down. Record how creation, distribution, storage and deletion are governed.", severity: "medium" });
				level = escalate(level, "Medium");
			}
		}
		if (a.mobileComponent === "Yes") {
			factors.push({ title: "Mobile component involved", detail: "Mobile and wearable components add device-level risks - local storage, background collection, permissions, and loss or theft of the device.", severity: "medium" });
		}
		if (a.systemOfRecord === "Yes") {
			factors.push({ title: "System of record", detail: "If this is the authoritative and only home for the data, retention and deletion rules have to be enforced in this system specifically - there is no upstream copy to fall back on, and nothing else will delete it for you.", severity: "medium" });
			level = escalate(level, "Medium");
		}
		if (a.appDecommissioning === "Yes") {
			factors.push({ title: "Old application being decommissioned", detail: "Decommissioning is where personal data quietly survives - in exports taken \"just in case\", backups, and archived instances. Decide per data set whether it is migrated, archived under a retention rule, or securely destroyed, and record the disposal.", severity: "medium" });
			level = escalate(level, "Medium");
		}
		if (a.businessCriticalData === "Yes") {
			factors.push({ title: "Business-critical data alongside personal data", detail: "Records kept as evidence of decisions, contracts or transactions usually carry their own statutory retention periods, which can be longer than the privacy minimum. Reconcile the two so one rule does not silently override the other.", severity: "medium" });
		}

		if (a.thirdPartySharing === "Yes") {
			factors.push({ title: "Third parties involved", detail: "Confirm each party's role (controller, joint controller or processor) and that an Art. 28 data processing agreement is in place for every processor.", severity: "medium" });
			level = escalate(level, "Medium");
		}
		if (a.transfersOutside === "Yes") {
			var safeguards = a.transferSafeguards || [];
			if (!safeguards.length || safeguards.indexOf("None identified yet") !== -1) {
				factors.push({ title: "International transfer with no safeguard identified", detail: "A transfer outside the home region needs a valid mechanism in place before it starts - adequacy, standard contractual clauses, binding corporate rules or a derogation.", severity: "high" });
				level = escalate(level, "High");
			} else {
				factors.push({ title: "International transfer", detail: "Keep the transfer mechanism and its supporting documentation with this assessment, and re-check it if the destination or supplier changes.", severity: "medium" });
				level = escalate(level, "Medium");
			}
			if ((a.tiaTriggers || []).length) {
				factors.push({ title: "Transfer impact assessment needed", detail: (a.tiaTriggers || []).length + " supplier characteristic(s) you selected raise the risk of foreign authority access. Complete a transfer impact assessment and identify supplementary measures.", severity: "high" });
				level = escalate(level, "High");
			}
		} else if (a.transfersOutside === "Not sure") {
			factors.push({ title: "Transfer status unclear", detail: "Remote access from outside the region counts as a transfer, including support and administration access. Confirm this before go-live.", severity: "medium" });
			level = escalate(level, "Medium");
		}

		if ((a.marketingTech || []).length && (a.marketingTech || []).indexOf("None of these") === -1) {
			factors.push({ title: "Tracking or profiling technology in use", detail: "Cookies and similar technologies generally need consent under the ePrivacy rules, separately from the GDPR lawful basis for what you then do with the data.", severity: "medium" });
			level = escalate(level, "Medium");
		}
		var bias = (a.advertisingBias || []).filter(function (b) { return b !== "No identified bias"; });
		if (bias.length) {
			factors.push({ title: "Potential bias in targeting", detail: "Targeting that correlates with " + bias.join(", ").toLowerCase() + " risks discriminatory outcomes. Document the mitigation, and be careful where the attribute is a special category.", severity: "high" });
			level = escalate(level, "High");
		}
		if (a.furtherProcessing) {
			factors.push({ title: "Further use of the data is planned", detail: "A new purpose needs its own compatibility assessment, lawful basis and notice. Build the controls in now rather than retrofitting them.", severity: "medium" });
		}
		if (a.sharingWithCompetitors === "Yes") {
			factors.push({ title: "Data sharing with competitors", detail: "Beyond data protection, this needs competition-law review before it goes ahead.", severity: "high" });
			level = escalate(level, "High");
		}
		if (a.publicPlatformSourced === "Yes" || a.thirdPartySourced === "Yes") {
			factors.push({ title: "Data sourced from third parties or public sources", detail: "Where data is not collected from the individual, Art. 14 requires you to inform them - normally within a month - and to confirm the source permitted the reuse.", severity: "medium" });
			level = escalate(level, "Medium");
		}

		if (a.benefitToIndividuals === "No") {
			factors.push({ title: "Little benefit to the individuals", detail: "Processing that benefits only the organization is harder to justify under a fairness and legitimate-interests analysis, and is the kind of thing complaints are made about.", severity: "medium" });
		}
		if (a.inventoried === "No") {
			factors.push({ title: "Not yet in the data inventory / RoPA", detail: "Add this processing activity to your Record of Processing Activities so it is tracked and auditable.", severity: "medium" });
		}

		// DPIA determination follows the trigger count, but sensitive data
		// or an unmitigated high risk level pulls it up as well.
		var dpia;
		if (triggers.length >= 2) dpia = "Required";
		else if (triggers.length === 1) dpia = level === "High" ? "Required" : "Recommended";
		else dpia = level === "High" ? "Recommended" : (level === "Medium" ? "Recommended" : "Not required");

		if (triggers.length >= 2) {
			factors.unshift({ title: "A full DPIA is required", detail: "The processing meets " + triggers.length + " of the Art. 35(3) criteria. Two or more normally makes a DPIA mandatory before processing starts.", severity: "high" });
		} else if (dpia === "Recommended") {
			factors.unshift({ title: "A full DPIA is recommended", detail: "The criteria alone do not make it mandatory, but the risk profile here warrants one. Record your reasoning either way - the decision not to do a DPIA has to be defensible too.", severity: "medium" });
		}

		return { na: false, level: level, dpia: dpia, triggers: triggers, factors: factors };
	}

	/* ---------------- AI RISK ASSESSMENT ---------------- */
	var GENAI_TYPES = ["Generative AI (content generation)", "AI Agent (single, tool-using)", "Agentic AI (multi-agent, autonomous orchestration)"];

	var AI_STEPS = [
		{
			key: "inventory",
			title: "System inventory",
			questions: [
				{ id: "name", type: "text", label: "AI system / use case name" },
				{ id: "description", type: "textarea", label: "Brief description of what it does" },
				{ id: "aiType", type: "select", label: "What type of AI capability is this?", options: ["Traditional ML / predictive model"].concat(GENAI_TYPES).concat(["Decision-support / rules-based AI"]) },
				{ id: "lifecycle", type: "select", label: "Lifecycle stage", options: ["Idea / concept", "Pilot", "Production", "Retired"] },
				{ id: "ownersAssigned", type: "yesno", label: "Are a business owner and a technical owner formally assigned?",
					note: { label: "Who should be assigned, and by when?", visibleIf: function (v) { return v === "No"; } } }
			]
		},
		{
			key: "regulatory",
			title: "Regulatory screening",
			questions: [
				{ id: "prohibitedUse", type: "select", label: "Does the system fall into a prohibited-use category under the EU AI Act (e.g. social scoring, manipulative/subliminal techniques causing harm, exploiting vulnerabilities, untargeted facial-recognition scraping, workplace/education emotion inference, biometric categorization inferring protected attributes)?", options: ["No", "Yes", "Unsure"],
					note: { label: "Briefly explain why / what triggered this concern", visibleIf: function (v) { return v === "Yes" || v === "Unsure"; } } },
				{ id: "highRiskAnnexIII", type: "select", label: "Does it fall under an EU AI Act Annex III high-risk category (e.g. employment/HR decisions, access to essential services, credit scoring, biometric identification, law enforcement, migration/border control, education/exam scoring, critical infrastructure safety)?", options: ["No", "Yes", "Unsure"],
					note: { label: "Which Annex III category applies (or is suspected)?", visibleIf: function (v) { return v === "Yes" || v === "Unsure"; } } },
				{ id: "humanOversight", type: "yesno", label: "Does a documented human-oversight and override capability exist for this system's decisions?",
					note: { label: "What oversight mechanism is planned?", visibleIf: function (v) { return v === "No"; } } }
			]
		},
		{
			key: "autonomy",
			title: "Autonomy & agentic risk",
			questions: [
				{ id: "autonomyLevel", type: "select", label: "What actions can the system take without human approval?", options: ["None - a human approves every action", "Low-impact actions only", "Broad autonomous action"],
					note: { label: "Briefly describe what it can do without approval", visibleIf: function (v) { return v === "Broad autonomous action"; } } },
				{ id: "loggingInPlace", type: "yesno", label: "Are all autonomous actions and data access logged, auditable, and attributable to a responsible owner?",
					note: { label: "What's missing, and what's the plan to close the gap?", visibleIf: function (v) { return v === "No"; } } },
				{ id: "multiAgent", type: "yesno", label: "Does the system coordinate with other AI agents, models, or external services (multi-agent orchestration)?" },
				{ id: "multiAgentDocumented", type: "yesno", label: "Are all connected agents/systems identified and documented?", visibleIf: function (a) { return a.multiAgent === "Yes"; },
					note: { label: function (v) { return v === "Yes" ? "List the connected agents/systems and their roles" : "What's missing / what's the plan to document them?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "broadDataAccess", type: "yesno", label: "Does it have access to sensitive or business-critical systems/data beyond what's strictly needed for its task?",
					note: { label: "Which systems/data, and why is that scope needed?", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "data",
			title: "Data sourcing & third-party risk",
			questions: [
				{ id: "thirdPartyData", type: "yesno", label: "Is training or input data sourced from third parties or public/external platforms?",
					note: { label: "Which third parties/platforms?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "providerTraining", type: "select", label: "Does the AI provider use your organization's data to train its underlying model?", options: ["No", "Yes", "Unsure"],
					note: { label: "Note any contractual restriction or opt-out status", visibleIf: function (v) { return v === "Yes" || v === "Unsure"; } } },
				{ id: "businessCriticalData", type: "yesno", label: "Does the system process business-critical data (contracts, transactions, financial, legal, or audit records)?",
					note: { label: "Which records?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "competitorExposure", type: "yesno", label: "Could its output or data be exposed to competitors or unauthorized external parties?",
					note: { label: "Describe how exposure could occur and any controls in place", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "genai",
			title: "Generative AI & context risk",
			visibleIf: function (a) { return GENAI_TYPES.indexOf(a.aiType) !== -1; },
			questions: [
				{ id: "contextSafeguards", type: "select", label: "Are safeguards in place to prevent context poisoning, data leakage, or use of outdated information in the system's memory/context?", options: ["Yes", "Partially", "No"],
					note: { label: "Describe the gap and mitigation plan", visibleIf: function (v) { return v === "Partially" || v === "No"; } } },
				{ id: "outputGuardrails", type: "yesno", label: "Are guardrails in place to prevent unsafe, non-compliant, or unintended outputs?",
					note: { label: "What guardrails are planned?", visibleIf: function (v) { return v === "No"; } } }
			]
		},
		{
			key: "governance",
			title: "Governance",
			questions: [
				{ id: "legalReview", type: "yesno", label: "Has this use case been reviewed by legal/compliance for regulatory risk?",
					note: { label: "When is legal/compliance review planned?", visibleIf: function (v) { return v === "No"; } } },
				{ id: "auditFrequency", type: "yesno", label: "Is a recurring audit or monitoring frequency defined for this system?",
					note: { label: function (v) { return v === "Yes" ? "What's the defined frequency (e.g. quarterly, annual)?" : "What frequency should be defined?"; }, visibleIf: function (v) { return !!v; } } }
			]
		}
	];

	function aiResult(a) {
		var factors = [];
		var regLevel, bizLevel = "Low";

		if (a.prohibitedUse === "Yes") {
			regLevel = "Prohibited";
			factors.push({ title: "Prohibited use", detail: "This use case appears to fall under an EU AI Act prohibited-use category. Stop deployment and escalate to legal immediately.", severity: "high" });
		} else {
			if (a.prohibitedUse === "Unsure") {
				factors.push({ title: "Prohibited-use status unclear", detail: "Confirm with legal/compliance whether this use case falls under a prohibited category before proceeding.", severity: "high" });
			}
			if (a.highRiskAnnexIII === "Yes") {
				regLevel = "High";
				factors.push({ title: "Likely high-risk (Annex III)", detail: "High-risk systems carry conformity assessment, documentation, human oversight, and monitoring obligations under the EU AI Act.", severity: "high" });
			} else if (a.highRiskAnnexIII === "Unsure") {
				regLevel = "Limited";
				factors.push({ title: "High-risk classification unclear", detail: "Confirm Annex III applicability with legal/compliance - this drives which obligations apply.", severity: "medium" });
			} else {
				regLevel = "Minimal";
			}
		}

		if (a.humanOversight === "No" && regLevel === "High") {
			factors.push({ title: "No documented human oversight", detail: "High-risk systems require meaningful human oversight and an override capability.", severity: "high" });
		}

		if (a.autonomyLevel === "Broad autonomous action" && a.loggingInPlace !== "Yes") {
			factors.push({ title: "Broad autonomy without logging", detail: "Systems with broad autonomous action need full logging and auditability of every action and data access.", severity: "high" });
			bizLevel = escalate(bizLevel, "High");
		} else if (a.autonomyLevel === "Broad autonomous action") {
			bizLevel = escalate(bizLevel, "Medium");
		}

		if (a.multiAgent === "Yes" && a.multiAgentDocumented !== "Yes") {
			factors.push({ title: "Undocumented multi-agent chain", detail: "Identify and document every connected agent, model, and external service this system coordinates with.", severity: "medium" });
			bizLevel = escalate(bizLevel, "Medium");
		}

		if (a.broadDataAccess === "Yes") {
			factors.push({ title: "Broad access to sensitive systems/data", detail: "Apply least-privilege access - scope data and system access to only what the task requires.", severity: "medium" });
			bizLevel = escalate(bizLevel, "Medium");
		}

		if (a.businessCriticalData === "Yes" && (a.loggingInPlace !== "Yes" || a.humanOversight !== "Yes")) {
			factors.push({ title: "Business-critical data without full oversight", detail: "Processing contracts, financial, legal, or audit records calls for both logging and human oversight.", severity: "high" });
			bizLevel = escalate(bizLevel, "High");
		}

		if (a.competitorExposure === "Yes") {
			factors.push({ title: "Possible competitor/external exposure", detail: "Review data segregation and access controls to prevent leakage of sensitive output or data.", severity: "high" });
			bizLevel = escalate(bizLevel, "High");
		}

		if (a.providerTraining === "Yes") {
			factors.push({ title: "Provider trains on your data", detail: "Confirm contractual terms restrict use of your data for the provider's model training, or opt out where possible.", severity: "medium" });
			bizLevel = escalate(bizLevel, "Medium");
		} else if (a.providerTraining === "Unsure") {
			factors.push({ title: "Unclear if provider trains on your data", detail: "Confirm this in the vendor's data processing terms.", severity: "medium" });
		}

		if (a.contextSafeguards === "No") {
			factors.push({ title: "No context/memory safeguards", detail: "Add safeguards against context poisoning, leakage, or reliance on outdated information.", severity: "medium" });
			bizLevel = escalate(bizLevel, "Medium");
		} else if (a.contextSafeguards === "Partially") {
			bizLevel = escalate(bizLevel, "Medium");
		}

		if (a.outputGuardrails === "No") {
			factors.push({ title: "No output guardrails", detail: "Add guardrails to catch unsafe, non-compliant, or unintended outputs before they reach users or downstream systems.", severity: "medium" });
			bizLevel = escalate(bizLevel, "Medium");
		}

		if (a.legalReview !== "Yes") {
			factors.push({ title: "No legal/compliance review on record", detail: "Route this use case through legal/compliance review, especially given its risk profile.", severity: "low" });
		}
		if (a.auditFrequency !== "Yes") {
			factors.push({ title: "No recurring audit cadence defined", detail: "Define a monitoring/audit frequency so risk and performance are reassessed over time, not just at launch.", severity: "low" });
		}

		return { regLevel: regLevel, bizLevel: bizLevel, factors: factors };
	}

	/* =================================================================
	 *  INCIDENT & BREACH SEVERITY ASSESSMENT
	 *
	 *  Intake questionnaire follows the structure of a standard privacy
	 *  incident record (description, reporting, timing, scope, cause,
	 *  communications, mitigation, notification decision).
	 *
	 *  Scoring uses the published ENISA methodology for assessing the
	 *  severity of personal data breaches:
	 *        SE = (DPC x EI) + CB
	 *  where DPC = data processing context, EI = ease of identification
	 *  (a correcting factor, 0.25-1), CB = circumstances of the breach.
	 *  Band thresholds and notification guidance follow the same source.
	 * ================================================================= */

	// Each option: [label, score]. A null score means "not involved".
	var DPC_SIMPLE = [
		["Not involved", null],
		["Simple data is involved and there are no aggravating factors", 1],
		["The data can be used for profiling (e.g. social or financial status)", 2],
		["The data can support assumptions about special-category information", 3],
		["The data is critical to the physical or psychological safety of a vulnerable group", 4]
	];
	var DPC_BEHAVIOURAL = [
		["Not involved", null],
		["The data gives little insight, or could be collected just as easily from public sources", 1],
		["Behavioural data is involved and there are no aggravating factors", 2],
		["The volume and type allow a profile exposing the individual's life or habits", 3],
		["A profile can be built from sensitive data affected by the breach", 4]
	];
	var DPC_FINANCIAL = [
		["Not involved", null],
		["The data gives no real insight into financial status (e.g. only that someone is a customer)", 1],
		["Some financial information, but no significant insight into financial status (e.g. an account number alone)", 2],
		["Financial data is involved and there are no aggravating factors", 3],
		["Full financial information that could enable fraud or financial/social profiling", 4]
	];
	var DPC_SENSITIVE = [
		["Not involved", null],
		["The data gives little insight, or could be collected just as easily from public sources", 1],
		["The nature of the data supports only general assumptions", 2],
		["The nature of the data supports assumptions about sensitive information", 3],
		["Sensitive data is involved and there are no lessening factors", 4]
	];

	var EI_NAME = [
		["Not involved", null],
		["Many people in the country share the same full name", 0.25],
		["Few or no people in the country share the same full name", 0.5],
		["Few or no people in a small city share the same full name", 0.75],
		["Many share the name, but date of birth or email/postal address was also exposed", 1]
	];
	var EI_ID = [
		["Not involved", null],
		["No other information is available, and more cannot be found without access to the reference database", 0.25],
		["The identifier reveals further identifying detail and is linked to other data (address, email)", 0.75],
		["Information from the reference database is also available (ID card, full name, picture)", 1]
	];
	var EI_CONTACT = [
		["Not involved", null],
		["The number or address is not listed in any publicly available register", 0.25],
		["Not listed publicly, but the population concerned is a small city", 0.5],
		["The number or address is listed in a publicly available register", 1]
	];
	var EI_EMAIL = [
		["Not involved", null],
		["Reveals no identifying detail and is not the individual's primary address online", 0.25],
		["Reveals no identifying detail but is the individual's primary address online", 0.75],
		["Reveals the individual's name and is their primary address online", 1]
	];
	var EI_PICTURE = [
		["Not involved", null],
		["Unclear or vague (e.g. distant CCTV footage)", 0.25],
		["Unclear, but the surroundings hint at further identifying detail (e.g. a specific location)", 0.5],
		["Clear, with no other identifying information attached", 0.75],
		["Clear and linked to further information (home address, membership)", 1]
	];
	var EI_CODE = [
		["Not involved", null],
		["Cannot be linked to other personal data without access to the reference database", 0.25],
		["Reveals some detail (e.g. a first name) and is linked to other personal data", 0.75],
		["Reveals the individual's full name, or reference-database data is also available", 1]
	];

	var CB_CONFIDENTIALITY = [
		["No loss of confidentiality", 0],
		["Data was encrypted or pseudonymised, and the key was not affected and remains secure", 0],
		["No evidence that anyone accessed the data", 0],
		["The recipients are known and are cooperating", 0.25],
		["The recipients are unknown, uncooperative, numerous or potentially unlimited", 0.5]
	];
	var CB_INTEGRITY = [
		["No loss of integrity", 0],
		["Data was altered, but there is no sign of incorrect or unlawful use and the originals remain available", 0],
		["Data was altered and possibly misused, but the correct data can be recovered", 0.25],
		["Data was replaced with untrue or unrelated data and cannot be recovered by the organization", 0.5]
	];
	var CB_AVAILABILITY = [
		["No loss of availability", 0],
		["Data can be restored quickly with no consequences for individuals", 0],
		["Data can be restored, but it will take some processing", 0],
		["Data is lost but can be supplied again by the individuals concerned", 0.25],
		["Data is permanently lost, with no backup and no way for individuals to supply it again", 0.5]
	];

	function optionLabels(pairs) { return pairs.map(function (p) { return p[0]; }); }
	function scoreOf(pairs, label) {
		for (var i = 0; i < pairs.length; i++) { if (pairs[i][0] === label) return pairs[i][1]; }
		return null;
	}

	var DPC_AGGRAVATING = [
		"Large volume of data about the same individual (in content or over an extended period)",
		"The individuals are children or otherwise vulnerable",
		"The individuals have special characteristics or public profiles (e.g. elected officials, police)",
		"The breach could lead to one or more further negative consequences"
	];
	var DPC_MITIGATING = [
		"The data is invalid, outdated or inaccurate, which makes it less significant",
		"The data is already publicly available",
		"The data does not reveal significant information about the individual"
	];

	var LIKELY_IMPACTS = [
		"No impact",
		"Mere inconvenience",
		"Loss of control over their own data",
		"Feeling of invasion of privacy",
		"Embarrassment or reputational damage",
		"Discrimination",
		"Financial loss",
		"Fraud",
		"Identity theft",
		"Loss of employment or opportunity",
		"Physical harm or a risk to safety"
	];

	/* -----------------------------------------------------------------
	 *  Alternative, optional cross-checks against two other published
	 *  breach-severity methods. Both sit alongside the ENISA score above
	 *  (which remains the tool's primary result) rather than replacing it.
	 * ----------------------------------------------------------------- */

	// EDPB Guidelines 01/2021 "Examples regarding Data Breach Notification":
	// 18 published example scenarios, each mapped by the EDPB itself to an
	// outcome. Matching one is a sanity check against the EDPB's own
	// published reasoning, not a scoring input.
	// The EDPB's own landing page for Guidelines 01/2021, which carries the
	// adopted final text in every EU language. Linked from the question step and
	// from the result so the assessor can read the case in the EDPB's words.
	var EDPB_SOURCE_URL = "https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-012021-examples-regarding-personal-data-breach_en";

	var EDPB_CASES = [
		{ label: "Ransomware - properly backed up, no evidence of exfiltration (EDPB example, case 1)", outcome: "low" },
		{ label: "Ransomware - no proper backup in place (EDPB example, case 2)", outcome: "medium" },
		{ label: "Ransomware - backed up, no evidence of exfiltration, but in a hospital or similarly critical setting (EDPB example, case 3)", outcome: "context" },
		{ label: "Ransomware - no backup, with evidence of exfiltration (EDPB example, case 4)", outcome: "high" },
		{ label: "Exfiltration of job-application data from a website (EDPB example, case 5)", outcome: "high" },
		{ label: "Exfiltration of hashed passwords from a website (EDPB example, case 6)", outcome: "low" },
		{ label: "Credential-stuffing attack on a banking website (EDPB example, case 7)", outcome: "high" },
		{ label: "Exfiltration of business data by a former employee (EDPB example, case 8)", outcome: "medium" },
		{ label: "Accidental transmission of data to a trusted third party (EDPB example, case 9)", outcome: "low" },
		{ label: "Stolen device or media storing encrypted personal data (EDPB example, case 10)", outcome: "low" },
		{ label: "Stolen device or media storing unencrypted personal data (EDPB example, case 11)", outcome: "high" },
		{ label: "Stolen paper files containing sensitive data (EDPB example, case 12)", outcome: "high" },
		{ label: "Mail sent to the wrong recipient - no sensitive data involved (EDPB example, case 13)", outcome: "low" },
		{ label: "Sensitive personal data sent by mail to the wrong recipient (EDPB example, case 14)", outcome: "high" },
		{ label: "Personal data sent by mail to the wrong recipient (EDPB example, case 15)", outcome: "low" },
		{ label: "Mail sent to the wrong recipient - a further, separately published example (EDPB example, case 16)", outcome: "medium" },
		{ label: "Identity theft via social engineering (EDPB example, case 17)", outcome: "high" },
		{ label: "Email data exfiltrated via social engineering (EDPB example, case 18)", outcome: "high" }
	];
	var EDPB_OUTCOME_TEXT = {
		low: "Low risk - the EDPB's own example says notification is not required.",
		medium: "A risk identified - the EDPB's own example says to consider notifying the supervisory authority.",
		high: "High risk - the EDPB's own example says to consider notifying both the supervisory authority and the affected individuals.",
		context: "Context-dependent - the EDPB does not give this example a single answer; the setting changes the outcome, so it needs its own case-by-case judgement."
	};
	function edpbResult(a) {
		if (!a.edpbCase) return null;
		var found = null;
		EDPB_CASES.forEach(function (c) { if (c.label === a.edpbCase) found = c; });
		return found;
	}

	// AEPD (Spanish supervisory authority) published volume/type/impact
	// method: Score = V x T x I, with a separate 0-3 "threshold" count used
	// alongside the score to indicate notification. Volume reuses the
	// records-affected answer already given; type of data is derived from
	// the data categories already selected (sensitive under Art. 9/10, or
	// not); impact of disclosure is the one extra question this cross-check
	// asks for.
	var AEPD_VOLUME = {
		"Fewer than 100": 1,
		"100 to 1,000": 2,
		"1,000 to 100,000": 3,
		"100,000 to 1,000,000": 4,
		"More than 1,000,000": 5
	};
	var IMPACT_OPTIONS = [
		"No impact",
		"Controlled internal impact (stays within the organization)",
		"External impact (customers, suppliers, or other outside parties)",
		"Public impact (widely public, or freely accessible online)",
		"Not yet known"
	];
	var AEPD_IMPACT = {
		"No impact": 2,
		"Controlled internal impact (stays within the organization)": 4,
		"External impact (customers, suppliers, or other outside parties)": 6,
		"Public impact (widely public, or freely accessible online)": 8,
		"Not yet known": 10
	};
	var AEPD_SENSITIVE_CATEGORIES = [
		"Special category data (health, biometric, genetic, racial or ethnic origin, religion, political opinion, trade union membership, sex life or orientation)",
		"Criminal offence data"
	];
	function aepdResult(a) {
		var volume = AEPD_VOLUME[a.recordsAffected] || null;
		var categories = a.dataCategoriesAffected || [];
		var hasSensitive = categories.filter(function (c) { return AEPD_SENSITIVE_CATEGORIES.indexOf(c) !== -1; }).length > 0;
		var type = categories.length ? (hasSensitive ? 2 : 1) : null;
		var impact = AEPD_IMPACT[a.impactOfDisclosure] || null;
		if (volume === null || type === null || impact === null) return { scored: false };

		var score = volume * type * impact;
		var tV = volume > 3 ? 1 : 0;
		var tT = type > 1 ? 1 : 0;
		var tI = impact > 4 ? 1 : 0;
		var threshold = tV + tT + tI;
		return {
			scored: true,
			volume: volume, type: type, impact: impact, score: score, threshold: threshold,
			notifyAuthority: score > 20 && threshold >= 2,
			notifySubjects: score > 40 && threshold >= 2
		};
	}

	var INCIDENT_STEPS = [
		{
			key: "description",
			title: "Incident description",
			questions: [
				{ id: "name", type: "text", label: "Incident reference or short name" },
				{ id: "description", type: "textarea", label: "General description of what happened" },
				{ id: "incidentType", type: "select", label: "Incident type", options: [
					"Unauthorized disclosure of information",
					"Misdirected email",
					"Misdirected postal mail",
					"Lost or stolen device",
					"Lost or stolen paper records",
					"User account compromise",
					"Ransomware or malware",
					"Technical vulnerability or misconfiguration",
					"Insider misuse",
					"Third-party or supplier incident",
					"Other"
				], note: { label: "Describe the incident type", visibleIf: function (v) { return v === "Other"; } } }
			]
		},
		{
			key: "reporting",
			title: "Reporting & timing",
			questions: [
				{ id: "reporterOrigin", type: "select", label: "Was the incident reported by someone internal or external to the organization?", options: ["Internal", "External", "Unknown"],
					note: { label: "Describe the reporter's relationship to the organization", visibleIf: function (v) { return !!v; } } },
				{ id: "incidentLead", type: "text", label: "Who is leading the management of this incident?" },
				{ id: "initialReporter", type: "text", label: "Who first reported it? (include contact details if they are external)" },
				{ id: "contactPersons", type: "textarea", label: "Who can give further detail on the incident? Name, role and contact details." },
				{ id: "intakeChannel", type: "select", label: "How did the incident reach the privacy team?", options: [
					"Directly to the privacy team",
					"Via the legal team",
					"Via IT / security",
					"Via the IT service desk or ticketing system",
					"Via customer service",
					"Via a supplier or third party",
					"Other"
				], note: { label: "Describe the intake route", visibleIf: function (v) { return v === "Other"; } } },
				{ id: "dateOccurred", type: "date", label: "When did the incident first happen? (best estimate is fine)" },
				{ id: "dateDiscovered", type: "date", label: "When was it discovered or first reported?" },
				{ id: "dateQualified", type: "date", label: "When was it qualified as a personal data breach? (leave blank if it wasn't, or not yet)" }
			]
		},
		{
			key: "scope",
			title: "Scope & context",
			questions: [
				{ id: "jurisdictions", type: "multiselect", label: "Which countries or jurisdictions are affected?", options: COUNTRIES_REGIONS,
					note: { label: "Specify the other country or countries", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "functionalArea", type: "select", label: "In which functional area did the incident happen?", options: ["HR & People", "Marketing & Sales", "Customer Service", "Finance", "IT & Technology", "Supply Chain & Operations", "Legal & Compliance", "Other"],
					note: { label: "Specify the functional area", visibleIf: function (v) { return v === "Other"; } } },
				{ id: "thirdPartyIncident", type: "yesno", label: "Is this a third-party or supplier incident?",
					note: { label: "Describe the third party's role and what they have told you (no need to name them here)", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "processingActivities", type: "textarea", label: "Which processing activities in your RoPA does this relate to? (describe it here if you cannot find one)" },
				{ id: "systemsAffected", type: "yesno", label: "Does the incident involve one or more specific applications, systems or services?",
					note: { label: "Which systems or services are involved?", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "cause",
			title: "Details & cause",
			questions: [
				{ id: "personalDataAffected", type: "yesno", label: "Was personal data exposed, altered or made unavailable - i.e. does this qualify as a personal data breach?" },
				{ id: "breachCategory", type: "multiselect", label: "Which category or categories of breach apply?", visibleIf: function (a) { return a.personalDataAffected === "Yes"; }, options: [
					"Confidentiality breach (unauthorized disclosure or access)",
					"Integrity breach (unauthorized or accidental alteration)",
					"Availability breach (accidental or unauthorized loss of access or destruction)"
				] },
				{ id: "rootCause", type: "select", label: "What was the root cause?", options: [
					"Human error",
					"Process failure or missing control",
					"Malicious external actor",
					"Malicious or negligent insider",
					"Technical or system failure",
					"Third-party or supplier failure",
					"Unknown / still under investigation",
					"Other"
				], note: { label: "Describe the root cause", visibleIf: function (v) { return !!v; } } },
				{ id: "intentional", type: "select", label: "Was the incident intentional or accidental?", options: ["Accidental", "Intentional", "Unknown"] },
				{ id: "recordsAffected", type: "select", label: "How many records are or could be affected?", options: [
					"Fewer than 100", "100 to 1,000", "1,000 to 100,000", "100,000 to 1,000,000", "More than 1,000,000", "Not yet known"
				] },
				{ id: "subjectsAffected", type: "select", label: "How many individuals are or could be affected?", options: [
					"1 to 10", "11 to 100", "101 to 1,000", "1,001 to 100,000", "More than 100,000", "Not yet known"
				] },
				{ id: "dataSubjectsAffected", type: "multiselect", label: "Whose personal data was exposed or potentially exposed?", options: DATA_SUBJECT_TYPES,
					visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
					note: { label: "Specify the other data subjects", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "dataCategoriesAffected", type: "multiselect", label: "Which categories of personal data were exposed or potentially exposed?", options: DATA_CATEGORIES,
					visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
					note: { label: "Specify the other data categories", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "externalSubjects", type: "yesno", label: "Are any of the affected individuals external to the organization (customers, consumers, candidates, suppliers, former staff)?",
					note: { label: "Who are they, and is the impact on them different?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "externalImpactDifferent", type: "textarea", label: "Is the impact different for those external individuals, and what is being done to mitigate it for them?",
					visibleIf: function (a) { return a.externalSubjects === "Yes"; } },
				{ id: "disciplinary", type: "yesno", label: "Could the incident lead to disciplinary measures (e.g. repeat incidents or gross negligence)?",
					note: { label: "Explain", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "dpc-data",
			title: "Severity 1 of 4 - data processing context",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "For each data type involved, pick the statement that best fits. The highest single score sets the base data processing context (DPC).",
			questions: [
				{ id: "dpcSimple", type: "select", label: "Simple data - name, address, education, family status, professional experience, other biographical data", options: optionLabels(DPC_SIMPLE) },
				{ id: "dpcBehavioural", type: "select", label: "Behavioural data - location, traffic, preferences, habits, performance", options: optionLabels(DPC_BEHAVIOURAL) },
				{ id: "dpcFinancial", type: "select", label: "Financial data - income, tax, bank statements, investments, risk profile, card data", options: optionLabels(DPC_FINANCIAL) },
				{ id: "dpcSensitive", type: "select", label: "Special category data - health, racial or ethnic origin, political views, religious or philosophical beliefs, trade union membership, genetic or biometric data, sex life or orientation, criminal offences", options: optionLabels(DPC_SENSITIVE) }
			]
		},
		{
			key: "dpc-factors",
			title: "Severity 2 of 4 - adjusting factors",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "The original methodology leaves the size of these adjustments to the assessor's judgement. This tool applies a consistent ±0.5 per selected factor so scores stay comparable - override it in your own record if your judgement differs.",
			questions: [
				{ id: "dpcAggravating", type: "multiselect", label: "Aggravating factors (each adds 0.5 to the data processing context)", options: DPC_AGGRAVATING,
					note: { label: "Any other aggravating factor - describe it (not scored automatically)", visibleIf: function () { return true; } } },
				{ id: "dpcMitigating", type: "multiselect", label: "Mitigating factors (each subtracts 0.5)", options: DPC_MITIGATING,
					note: { label: "Any other mitigating factor - describe it (not scored automatically)", visibleIf: function () { return true; } } }
			]
		},
		{
			key: "ei",
			title: "Severity 3 of 4 - ease of identification",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "How easily can individuals be identified from the data involved? This is a correcting factor between 0.25 and 1 - the highest single value applies.",
			questions: [
				{ id: "eiName", type: "select", label: "Full name", options: optionLabels(EI_NAME) },
				{ id: "eiIdentifier", type: "select", label: "Unique identifier - national ID, social security or passport number", options: optionLabels(EI_ID) },
				{ id: "eiContact", type: "select", label: "Telephone number or home address", options: optionLabels(EI_CONTACT) },
				{ id: "eiEmail", type: "select", label: "Email address", options: optionLabels(EI_EMAIL) },
				{ id: "eiPicture", type: "select", label: "Picture or footage", options: optionLabels(EI_PICTURE) },
				{ id: "eiCode", type: "select", label: "Customer or employee number, code, initials or alias", options: optionLabels(EI_CODE) }
			]
		},
		{
			key: "cb",
			title: "Severity 4 of 4 - circumstances of the breach",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "These add to the score. Pick the statement that fits for each type of security loss.",
			questions: [
				{ id: "cbConfidentiality", type: "select", label: "Loss of confidentiality", options: optionLabels(CB_CONFIDENTIALITY) },
				{ id: "cbIntegrity", type: "select", label: "Loss of integrity", options: optionLabels(CB_INTEGRITY) },
				{ id: "cbAvailability", type: "select", label: "Loss of availability", options: optionLabels(CB_AVAILABILITY) },
				{ id: "cbMalicious", type: "yesno", label: "Was the breach the result of deliberate action intended to harm the organization or the individuals? (adds 0.5)" }
			]
		},
		{
			key: "cross-check",
			title: "Optional - cross-check against other published methods",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "The ENISA score is this tool's primary result. These two are independent, separately published methods you can optionally line up against it - leave either blank to skip it.",
			sources: [{ label: "EDPB Guidelines 01/2021, the 18 worked examples", url: EDPB_SOURCE_URL }],
			questions: [
				{ id: "impactOfDisclosure", type: "select", label: "AEPD method - if this data got out, what would the impact of disclosure be? (Combines with the records-affected and data-category answers already given, to score volume × type × impact per the Spanish supervisory authority's published guide.)", options: IMPACT_OPTIONS },
				{ id: "edpbCase", type: "select", label: "EDPB method - does one of the EDPB's own published example breaches closely match this one? Pick the closest, if any.", options: EDPB_CASES.map(function (c) { return c.label; }) }
			]
		},
		{
			key: "communications",
			title: "Communications & mitigation",
			questions: [
				{ id: "complaints", type: "yesno", label: "Have any individuals complained about the incident?",
					note: { label: "Summarize the complaints", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "madePublic", type: "yesno", label: "Has the incident become public (media, social media)?",
					note: { label: "Where, and what has been said?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "likelyImpact", type: "multiselect", label: "What is the likely or potential impact on the individuals? Select all that apply.", options: LIKELY_IMPACTS,
					visibleIf: function (a) { return a.personalDataAffected === "Yes"; } },
				{ id: "communicatedToSubjects", type: "select", label: "Has there been any communication with the affected individuals?", options: [
					"Yes",
					"Not yet, but planned",
					"No - not yet decided",
					"No - we will not communicate",
					"Not applicable"
				],
					note: { label: "What was communicated, and when?", visibleIf: function (v) { return !!v; } } },
				{ id: "mitigationActions", type: "textarea", label: "What actions have been taken to contain the breach or reduce the impact on individuals?" },
				{ id: "lessonsLearned", type: "textarea", label: "Lessons learned and follow-up actions" }
			]
		},
		{
			key: "notification",
			title: "Notification",
			visibleIf: function (a) { return a.personalDataAffected === "Yes"; },
			intro: "Record the decision actually taken and when. The clock for notifying the supervisory authority runs from the moment the incident was qualified as a personal data breach, not from when it was discovered.",
			questions: [
				{ id: "notifyAuthority", type: "select", label: "Will you notify the supervisory authority?", options: ["Yes", "No", "Not yet decided"],
					note: { label: function (v) { return v === "No" ? "Record the reasoning - a decision not to notify has to be defensible" : "Which authority or authorities?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "notificationDate", type: "date", label: "When was the notification submitted? (leave blank if not yet)",
					visibleIf: function (a) { return a.notifyAuthority === "Yes"; } },
				{ id: "notificationDelay", type: "yesno", label: "Was the notification later than 72 hours after the breach was qualified?",
					visibleIf: function (a) { return a.notifyAuthority === "Yes"; },
					note: { label: "Give the reasoned justification for the delay - this must accompany the notification", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "phasedNotification", type: "yesno", label: "Was the notification made in phases?",
					visibleIf: function (a) { return a.notifyAuthority === "Yes"; },
					note: { label: "Date of the first notification, and the deadline communicated for the final one", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "notifySubjects", type: "select", label: "Will you notify the affected individuals?", options: ["Yes", "No", "Not yet decided", "Not applicable"],
					note: { label: function (v) { return v === "No" ? "Record why - e.g. the data was unintelligible, or measures since taken make the high risk unlikely" : "How and when will they be told?"; }, visibleIf: function (v) { return !!v; } } }
			]
		}
	];

	function severityBand(se) {
		if (se < 2) return { label: "Low", key: "low",
			meaning: "Individuals either will not be affected, or may meet minor inconveniences they will overcome without real difficulty.",
			dpa: false, subjects: false };
		if (se < 3) return { label: "Medium", key: "medium",
			meaning: "Individuals may meet significant inconveniences they can overcome despite some difficulty (extra costs, denial of access to services, stress, minor ailments).",
			dpa: true, subjects: false };
		if (se < 4) return { label: "High", key: "high",
			meaning: "Individuals may meet significant consequences they should be able to overcome, but only with serious difficulty (misappropriation of funds, blacklisting, property damage, loss of employment, worsening health).",
			dpa: true, subjects: true };
		return { label: "Very High", key: "veryhigh",
			meaning: "Individuals may meet significant or irreversible consequences they may not overcome (substantial debt, inability to work, long-term psychological or physical harm).",
			dpa: true, subjects: true };
	}

	function incidentResult(a) {
		if (a.personalDataAffected !== "Yes") {
			return {
				na: true,
				factors: [{ title: "No personal data breach identified", detail: "On your answers this is a security or operational incident that did not expose, alter or destroy personal data, so no breach severity score applies. Record it, and re-assess if new information shows personal data was involved after all.", severity: "low" }]
			};
		}

		// --- DPC: highest applicable data-category score, plus adjustments ---
		var catInputs = [
			{ id: "dpcSimple", name: "Simple data", pairs: DPC_SIMPLE },
			{ id: "dpcBehavioural", name: "Behavioural data", pairs: DPC_BEHAVIOURAL },
			{ id: "dpcFinancial", name: "Financial data", pairs: DPC_FINANCIAL },
			{ id: "dpcSensitive", name: "Special category data", pairs: DPC_SENSITIVE }
		];
		var baseDpc = 0, dpcDriver = null;
		catInputs.forEach(function (cat) {
			var s = scoreOf(cat.pairs, a[cat.id]);
			if (s !== null && s > baseDpc) { baseDpc = s; dpcDriver = { name: cat.name, score: s, statement: a[cat.id] }; }
		});
		var aggravating = (a.dpcAggravating || []).length;
		var mitigating = (a.dpcMitigating || []).length;
		var rawDpc = baseDpc + (aggravating * 0.5) - (mitigating * 0.5);
		// The methodology caps the data processing context at 4, so adjustments
		// move the score within that range rather than beyond it.
		var dpc = Math.max(0, Math.min(4, rawDpc));
		var dpcCapped = rawDpc > 4;

		// --- EI: highest applicable identifier value (correcting factor) ---
		var eiInputs = [
			{ id: "eiName", name: "Full name", pairs: EI_NAME },
			{ id: "eiIdentifier", name: "Unique identifier", pairs: EI_ID },
			{ id: "eiContact", name: "Phone number or home address", pairs: EI_CONTACT },
			{ id: "eiEmail", name: "Email address", pairs: EI_EMAIL },
			{ id: "eiPicture", name: "Picture or footage", pairs: EI_PICTURE },
			{ id: "eiCode", name: "Customer/employee number or alias", pairs: EI_CODE }
		];
		var ei = 0, eiDriver = null;
		eiInputs.forEach(function (f) {
			var s = scoreOf(f.pairs, a[f.id]);
			if (s !== null && s > ei) { ei = s; eiDriver = { name: f.name, score: s, statement: a[f.id] }; }
		});
		var noIdentifierSelected = ei === 0;
		if (noIdentifierSelected) ei = 0.25; // methodology floor

		// --- CB: circumstances add up ---
		var cbParts = [];
		var cbInputs = [
			{ id: "cbConfidentiality", name: "Loss of confidentiality", pairs: CB_CONFIDENTIALITY },
			{ id: "cbIntegrity", name: "Loss of integrity", pairs: CB_INTEGRITY },
			{ id: "cbAvailability", name: "Loss of availability", pairs: CB_AVAILABILITY }
		];
		var cb = 0;
		cbInputs.forEach(function (f) {
			var s = scoreOf(f.pairs, a[f.id]);
			if (s) { cb += s; cbParts.push({ name: f.name, score: s, statement: a[f.id] }); }
		});
		if (a.cbMalicious === "Yes") { cb += 0.5; cbParts.push({ name: "Malicious intent", score: 0.5, statement: "The breach resulted from deliberate action" }); }

		var se = (dpc * ei) + cb;
		var band = severityBand(se);
		var edpb = edpbResult(a);
		var aepd = aepdResult(a);
		var rBase = { dpc: dpc, ei: ei, cb: cb, se: se, band: band, cbParts: cbParts, dpcDriver: dpcDriver, noIdentifierSelected: noIdentifierSelected, edpb: edpb, aepd: aepd };

		return {
			na: false,
			dpc: dpc, baseDpc: baseDpc, aggravating: aggravating, mitigating: mitigating, dpcDriver: dpcDriver, dpcCapped: dpcCapped,
			ei: ei, eiDriver: eiDriver, noIdentifierSelected: noIdentifierSelected,
			cb: cb, cbParts: cbParts,
			se: se, band: band,
			edpb: edpb, aepd: aepd,
			factors: incidentFactors(a, rBase)
		};
	}

	function fmt(n) { return (Math.round(n * 100) / 100).toFixed(2); }

	function incidentFactors(a, r) {
		var f = [];

		if (r.band.dpa) {
			f.push({ title: "Notification to the supervisory authority indicated", detail: "At this severity the methodology points to notifying the supervisory authority. Under GDPR Art. 33 that must happen without undue delay and, where feasible, within 72 hours of becoming aware - with a reasoned justification recorded if you go beyond it.", severity: "high" });
		} else {
			f.push({ title: "Notification not indicated by the score alone", detail: "The score does not by itself point to notification. Art. 33 still requires you to document the breach, the reasoning, and the effects - a decision not to notify has to be defensible on the record.", severity: "low" });
		}
		if (r.band.subjects) {
			f.push({ title: "Communication to affected individuals indicated", detail: "At this severity individuals should normally be told without undue delay under GDPR Art. 34, unless the data was unintelligible to unauthorized parties (e.g. strong encryption) or you have since taken measures that make the high risk unlikely to materialise.", severity: "high" });
		}

		if (r.dpcDriver && r.dpcDriver.score >= 3) {
			f.push({ title: "Data type is driving the score", detail: r.dpcDriver.name + " set the base context at " + fmt(r.dpcDriver.score) + " of a possible 4. This is the single biggest lever in the calculation, because it is multiplied by the ease of identification.", severity: r.dpcDriver.score >= 4 ? "high" : "medium" });
		}
		if (r.noIdentifierSelected) {
			f.push({ title: "No identifier type selected - ease of identification defaulted to its floor", detail: "The correcting factor was set to its minimum of 0.25. If any identifier (name, email, ID number, image, account reference) was in fact exposed, go back and select it - the score will rise, potentially by a lot.", severity: "medium" });
		}
		if (r.ei === 1) {
			f.push({ title: "Individuals are directly identifiable", detail: "The ease of identification is at its maximum, so the data context score passes through to the result undiluted. Pseudonymisation or separating identifiers from the payload is what reduces this on future processing.", severity: "medium" });
		}

		r.cbParts.forEach(function (p) {
			if (p.name === "Loss of confidentiality" && p.score === 0.5) {
				f.push({ title: "Recipients unknown or uncooperative", detail: "This adds 0.5. If you can identify the recipients and confirm they have deleted the data or are cooperating, this drops to 0.25 - and to 0 where there is no evidence anyone accessed it.", severity: "high" });
			}
			if (p.name === "Loss of availability" && p.score === 0.5) {
				f.push({ title: "Data permanently unavailable", detail: "This adds 0.5. Restorable backups, or the ability for individuals to supply the data again, is what reduces this component.", severity: "high" });
			}
			if (p.name === "Loss of integrity" && p.score === 0.5) {
				f.push({ title: "Altered data cannot be recovered", detail: "This adds 0.5. Recoverable originals reduce it to 0.25, and to 0 where unaltered records remain available.", severity: "high" });
			}
			if (p.name === "Malicious intent") {
				f.push({ title: "Deliberate action involved", detail: "Malicious intent adds a fixed 0.5 and cannot be mitigated after the fact. It also tends to raise regulator and individual expectations about how quickly you communicate.", severity: "high" });
			}
		});

		if (a.externalSubjects === "Yes") {
			f.push({ title: "External individuals affected", detail: "Consumers, customers, candidates or former staff usually have less visibility and fewer internal routes to remedy than employees, which weighs towards communicating even at borderline scores.", severity: "medium" });
		}
		if ((a.dpcAggravating || []).indexOf("The individuals are children or otherwise vulnerable") !== -1) {
			f.push({ title: "Vulnerable individuals involved", detail: "Regulators consistently treat breaches affecting children or vulnerable people as higher risk than the arithmetic alone suggests. Treat the score as a floor, not a ceiling.", severity: "high" });
		}
		if (a.madePublic === "Yes") {
			f.push({ title: "Incident is already public", detail: "Public exposure raises the practical risk to individuals and usually shortens the window for proactive communication, regardless of the calculated band.", severity: "medium" });
		}
		if (a.complaints === "Yes") {
			f.push({ title: "Individuals have already complained", detail: "Complaints often precede a supervisory-authority query. Make sure the incident record, the reasoning behind your notification decision, and your response to each complainant are consistent.", severity: "medium" });
		}
		if (a.recordsAffected === "Not yet known" || a.subjectsAffected === "Not yet known") {
			f.push({ title: "Scale still unknown", detail: "Volume is not part of the ENISA formula, but it drives regulator interest and the practicality of individual notification. Re-run this assessment once the numbers are confirmed.", severity: "medium" });
		}
		if (a.thirdPartyIncident === "Yes") {
			f.push({ title: "Third-party incident", detail: "Where the third party is your processor, your notification clock starts when you become aware - not when they finish investigating. Check the breach-notification terms in the contract and record what they told you and when.", severity: "medium" });
		}
		if (a.rootCause === "Unknown / still under investigation") {
			f.push({ title: "Root cause not yet established", detail: "You can and should notify on the basis of what you know, in phases if necessary, rather than waiting for a complete picture.", severity: "medium" });
		}
		if (!a.mitigationActions) {
			f.push({ title: "No mitigation actions recorded", detail: "Measures taken after the breach can reduce the residual risk to individuals, and are explicitly relevant to whether communication under Art. 34 is required. Record them.", severity: "low" });
		}

		// --- The 72-hour clock, which runs from qualification as a breach ---
		var qualified = parseDate(a.dateQualified);
		if (qualified) {
			var deadline = new Date(qualified.getTime() + 72 * 3600 * 1000);
			var submitted = parseDate(a.notificationDate);
			var deadlineStr = deadline.toLocaleDateString();
			if (a.notifyAuthority === "Yes" && submitted) {
				if (submitted.getTime() > deadline.getTime()) {
					f.push({ title: "Notification submitted after the 72-hour deadline", detail: "The breach was qualified on " + qualified.toLocaleDateString() + ", making the deadline " + deadlineStr + ", and the notification went in on " + submitted.toLocaleDateString() + ". A late notification must be accompanied by a reasoned justification for the delay.", severity: "high" });
				} else {
					f.push({ title: "Notification within the 72-hour deadline", detail: "Qualified " + qualified.toLocaleDateString() + ", deadline " + deadlineStr + ", submitted " + submitted.toLocaleDateString() + ".", severity: "low" });
				}
			} else if (r.band.dpa) {
				f.push({ title: "Notification deadline: " + deadlineStr, detail: "72 hours from the moment the incident was qualified as a personal data breach (" + qualified.toLocaleDateString() + "). If you cannot supply everything by then, notify in phases rather than waiting.", severity: "high" });
			}
		} else if (r.band.dpa) {
			f.push({ title: "No qualification date recorded", detail: "The 72-hour clock runs from when the incident was qualified as a personal data breach, so without that date the deadline cannot be evidenced. Record it.", severity: "medium" });
		}
		if (a.notificationDelay === "Yes" && !a.notificationDelayNote) {
			f.push({ title: "Delay recorded without a justification", detail: "Art. 33(1) requires a late notification to be accompanied by the reasons for the delay. Write them down here.", severity: "high" });
		}

		// --- Recorded decision vs what the score indicates ---
		if (r.band.dpa && a.notifyAuthority === "No") {
			f.push({ title: "Decision not to notify conflicts with the severity score", detail: "The score puts this in the " + r.band.label.toLowerCase() + " band, which indicates notifying the supervisory authority, but the record says you will not. That is a defensible position only if the reasoning is written down and stands on its own - make sure it is.", severity: "high" });
		}
		if (r.band.subjects && (a.notifySubjects === "No" || a.notifySubjects === "Not applicable")) {
			f.push({ title: "Individuals not being told despite a high-risk score", detail: "Art. 34 allows this only where the data was unintelligible to unauthorized parties, where measures since taken make the high risk unlikely to materialise, or where it would take disproportionate effort (in which case a public communication is required instead). Record which applies.", severity: "high" });
		}
		if (!r.band.dpa && a.notifyAuthority === "Yes") {
			f.push({ title: "Notifying although the score does not require it", detail: "Nothing wrong with notifying anyway, but note the score does not compel it - record why you chose to, so the decision is consistent with how you handle similar incidents.", severity: "low" });
		}
		if (a.notifyAuthority === "Not yet decided" || a.notifySubjects === "Not yet decided") {
			f.push({ title: "Notification decision still open", detail: "The 72-hour clock does not pause while the decision is being made. Set a time to close it out, and notify in phases if the picture is still incomplete.", severity: "medium" });
		}

		var impacts = (a.likelyImpact || []).filter(function (i) { return i !== "No impact" && i !== "Mere inconvenience"; });
		if (impacts.length) {
			f.push({ title: "Material impacts identified for individuals", detail: "You recorded: " + impacts.join(", ").toLowerCase() + ". These are what the notification to individuals has to describe in plain language, along with what they can do about it.", severity: impacts.length > 2 ? "high" : "medium" });
		}

		// --- Cross-check against the AEPD and EDPB methods, where answered ---
		if (r.aepd && r.aepd.scored) {
			var aepdAuthority = r.aepd.notifyAuthority, aepdSubjects = r.aepd.notifySubjects;
			if (aepdAuthority !== r.band.dpa || aepdSubjects !== r.band.subjects) {
				f.push({ title: "AEPD method points to a different notification outcome", detail: "The AEPD volume × type × impact method (score " + fmt(r.aepd.score) + ", threshold " + r.aepd.threshold + " of 3) indicates " + (aepdSubjects ? "notifying both the supervisory authority and individuals" : (aepdAuthority ? "notifying the supervisory authority" : "no notification")) + ", where the ENISA score here indicates " + (r.band.subjects ? "notifying both" : (r.band.dpa ? "notifying the authority only" : "no notification")) + ". Worth a second look before you finalise the decision.", severity: "medium" });
			}
		}
		if (r.edpb) {
			var edpbHigh = r.edpb.outcome === "high", edpbLow = r.edpb.outcome === "low";
			if ((edpbHigh && !r.band.subjects) || (edpbLow && r.band.dpa)) {
				f.push({ title: "EDPB published example points to a different outcome", detail: "The closest EDPB example you selected is treated by the EDPB as " + (edpbHigh ? "high risk (notify both the authority and individuals)" : "low risk (no notification required)") + ", which " + (edpbHigh ? "goes further than" : "is more lenient than") + " what the ENISA score alone indicates here. Treat it as a prompt to double-check, not as an override.", severity: "medium" });
			}
		}
		return f;
	}

	// Dates come from date inputs as YYYY-MM-DD; anything else is ignored.
	function parseDate(v) {
		if (!v) return null;
		var d = new Date(v);
		return isNaN(d.getTime()) ? null : d;
	}

	/* =================================================================
	 *  FULL DPIA (Data Protection Impact Assessment)
	 *
	 *  Runs when the Privacy Assessment indicates a DPIA is needed.
	 *  Structure follows a standard full-DPIA template: scoping, the
	 *  Art. 35(3) / WP248 trigger screening, necessity & proportionality,
	 *  data subject rights, assets and transfers, then a risk assessment
	 *  built on the three classic feared events (illegitimate access,
	 *  unwanted modification, data disappearance) scored on the CNIL
	 *  severity and likelihood scales, and finally the controls in place.
	 * ================================================================= */




	var RISK_SOURCES = [
		"Internal staff acting accidentally",
		"Internal staff acting deliberately",
		"External people acting accidentally",
		"External people acting deliberately",
		"A supplier, processor or subcontractor",
		"Hardware (device, media, network equipment)",
		"Software (application, operating system, misconfiguration)",
		"Non-human sources (fire, flood, power loss, malware outbreak)"
	];

	var THREATS = [
		"Account or password theft",
		"Phishing or social engineering",
		"Malware or ransomware",
		"Lost or stolen device or media with unencrypted content",
		"Unauthorized physical access to a device or location",
		"System failure exposing stored data",
		"Excessive or stale access rights",
		"Data sent to the wrong recipient",
		"Insecure data extract, export or interface",
		"Fraudulent or malicious data subject request",
		"Backup failure or accidental deletion",
		"Supplier or subcontractor security failure"
	];

	// CNIL scales. Index order matters - it drives the risk matrix.
	var SEVERITY_SCALE = [
		"Negligible - no impact, or a mere inconvenience individuals will overcome without difficulty",
		"Limited - significant inconveniences individuals can overcome despite a few difficulties",
		"Significant - significant consequences individuals should overcome, but with serious difficulties",
		"Maximum - significant or irreversible consequences individuals may not overcome"
	];
	var LIKELIHOOD_SCALE = [
		"Negligible - it does not seem possible for the identified risk sources to realise the threat",
		"Limited - it seems difficult for the identified risk sources to realise the threat",
		"Significant - it seems possible for the identified risk sources to realise the threat",
		"Maximum - it seems extremely easy for the identified risk sources to realise the threat"
	];


	// Builds one feared-event step; the three events differ only in wording.
	function fearedEventStep(key, title, eventName, intro, prefix) {
		return {
			key: key,
			title: title,
			intro: intro,
			questions: [
				{ id: prefix + "Sources", type: "multiselect", label: "Which risk sources could cause " + eventName + "?", options: RISK_SOURCES },
				{ id: prefix + "Threats", type: "multiselect", label: "Which threats are realistic for this processing?", options: THREATS },
				{ id: prefix + "Impact", type: "textarea", label: "What would the impact on individuals be if this happened?" },
				{ id: prefix + "Severity", type: "select", label: "Severity - how serious would the impact on individuals be?", options: SEVERITY_SCALE },
				{ id: prefix + "Likelihood", type: "select", label: "Likelihood - how easily could this happen, given the controls you have?", options: LIKELIHOOD_SCALE }
			]
		};
	}

	var DPIA_STEPS = [
		{
			key: "scoping",
			title: "Scope of the processing",
			questions: [
				{ id: "name", type: "text", label: "Processing activity or project name" },
				{ id: "description", type: "textarea", label: "Describe the processing: what it does, for whom, and why it is needed" },
				{ id: "changeType", type: "select", label: "Is this a new activity or a change to an existing one?", options: ["New activity", "Changed activity", "Not sure"] },
				{ id: "goLiveDate", type: "date", label: "Planned go-live date (leave blank if not set)" },
				{ id: "countries", type: "multiselect", label: "Which countries or regions does the processing cover?", options: COUNTRIES_REGIONS,
					note: { label: "Specify the other country or countries", visibleIf: function (v) { return (v || []).indexOf("Other") !== -1; } } },
				{ id: "controllerRole", type: "select", label: "What is your organization's role?", options: ["Controller", "Joint controller", "Processor", "Not sure"] },
				{ id: "businessArea", type: "select", label: "Which business area owns this?", options: ["HR & People", "Marketing & Sales", "Customer Service", "Finance", "IT & Technology", "Supply Chain & Operations", "Legal & Compliance", "Other"],
					note: { label: "Specify the business area", visibleIf: function (v) { return v === "Other"; } } }
			]
		},
		{
			key: "triggers",
			title: "Why a DPIA is needed",
			intro: "These are the Art. 35(3) criteria as expanded by the European guidance. Meeting two or more normally means a DPIA is required; one may still warrant it depending on the processing.",
			questions: [
				{ id: "dpiaTriggers", type: "multiselect", label: "Which criteria does this processing meet?", options: DPIA_TRIGGERS,
					note: { label: "Any national blacklist/whitelist entry or sector-specific requirement that applies", visibleIf: function () { return true; } } }
			]
		},
		{
			key: "necessity",
			title: "Necessity & proportionality",
			intro: "Art. 35(7)(b) requires an assessment of whether the processing is necessary and proportionate to its purpose. Describe it in your own words - these narratives are the substance of the DPIA.",
			questions: [
				{ id: "purposes", type: "textarea", label: "What are the specified, explicit and legitimate purposes of the processing?" },
				{ id: "legalBasis", type: "multiselect", label: "Which lawful basis or bases apply (Art. 6)?", options: ART6_BASES },
				{ id: "specialCategory", type: "yesno", label: "Does the processing involve special category or criminal offence data?" },
				{ id: "art9Condition", type: "select", label: "Which Art. 9 condition applies?", options: ["Not applicable - no special category data"].concat(ART9_CONDITIONS), visibleIf: function (a) { return a.specialCategory === "Yes"; } },
				{ id: "legitimacy", type: "textarea", label: "Legitimacy - why is this processing lawful, fair and justified for these purposes?" },
				{ id: "proportionality", type: "textarea", label: "Proportionality - why is the data adequate, relevant and limited to what is necessary? What less intrusive alternatives were considered?" },
				{ id: "dataQuality", type: "textarea", label: "Data quality - how is the data kept accurate and up to date?" },
				{ id: "retentionDefined", type: "select", label: "Is a retention period defined and documented for every purpose?", options: ["Yes", "Partially", "No"],
					note: { label: "Specify the retention period(s) and how deletion is enforced", visibleIf: function (v) { return !!v; } } },
				{ id: "deIdentification", type: "select", label: "Is the data de-identified in any way?", options: ["Anonymised", "Pseudonymised", "Partially - some fields only", "No", "Not possible for this purpose"] }
			]
		},
		{
			key: "rights",
			title: "Transparency & individual rights",
			questions: [
				{ id: "noticeInPlace", type: "yesno", label: "Are individuals informed through a privacy notice that covers this processing?",
					note: { label: function (v) { return v === "Yes" ? "Where is the notice published, and when is it shown?" : "What is the plan and timeline for informing individuals?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "transparency", type: "textarea", label: "Transparency - what are individuals told, and when?" },
				{ id: "consentMechanism", type: "select", label: "If consent is a basis, how is it captured and withdrawn?", options: [
					"Not applicable - consent is not a basis here",
					"Captured explicitly, and can be withdrawn as easily as it was given",
					"Captured, but withdrawal is harder than giving it",
					"Not yet implemented"
				] },
				{ id: "rightsAccess", type: "yesno", label: "Can access and portability requests be fulfilled for this processing?",
					note: { label: "How, and what is the gap if not?", visibleIf: function (v) { return v === "No"; } } },
				{ id: "rightsErasure", type: "yesno", label: "Can rectification and erasure requests be fulfilled?",
					note: { label: "How, and what is the gap if not?", visibleIf: function (v) { return v === "No"; } } },
				{ id: "rightsObject", type: "yesno", label: "Can restriction and objection requests be fulfilled?",
					note: { label: "How, and what is the gap if not?", visibleIf: function (v) { return v === "No"; } } }
			]
		},
		{
			key: "assets",
			title: "Systems, suppliers & transfers",
			questions: [
				{ id: "assets", type: "textarea", label: "Which systems, applications or physical assets hold or process the data?" },
				{ id: "processorsInvolved", type: "yesno", label: "Are any processors, suppliers or subcontractors involved?",
					note: { label: "What do they do, and is a data processing agreement in place?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "hostingLocation", type: "select", label: "Where is the data hosted?", options: ["Within the home country", "Within the home region (e.g. EEA)", "Outside the home region", "Mixed", "Not sure"] },
				{ id: "transfersOutside", type: "select", label: "Is personal data transferred outside your home region?", options: ["No", "Yes", "Not sure"] },
				{ id: "transferMechanism", type: "multiselect", label: "Which transfer mechanism applies?", visibleIf: function (a) { return a.transfersOutside === "Yes"; }, options: [
					"Adequacy decision",
					"Standard contractual clauses",
					"Binding corporate rules",
					"Derogation for a specific situation",
					"None identified yet"
				] },
				{ id: "tiaDone", type: "yesno", label: "Has a transfer impact assessment been completed?", visibleIf: function (a) { return a.transfersOutside === "Yes"; },
					note: { label: "What supplementary measures were identified?", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		fearedEventStep("risk-access", "Risk 1 of 3 - illegitimate access to data", "unauthorized people to see the data",
			"The first of the three feared events: someone who should not see the data gains access to it.", "access"),
		fearedEventStep("risk-modification", "Risk 2 of 3 - unwanted modification of data", "the data to be changed without authorization",
			"The second feared event: the data is altered, corrupted or replaced when it should not be.", "modif"),
		fearedEventStep("risk-disappearance", "Risk 3 of 3 - data disappearance", "the data to be lost or become unavailable",
			"The third feared event: the data is deleted, lost or cannot be accessed when it is needed.", "disap"),
		{
			key: "controls",
			title: "Controls & conclusion",
			questions: [
				{ id: "controlsInPlace", type: "multiselect", label: "Which controls are in place for this processing?", options: DPIA_CONTROLS,
					note: { label: "Any other control worth recording", visibleIf: function () { return true; } } },
				{ id: "residualAcceptable", type: "yesno", label: "After these controls, is the residual risk to individuals acceptable?",
					note: { label: function (v) { return v === "Yes" ? "Briefly justify why the residual risk is acceptable" : "What remains unmitigated, and what would be needed to reduce it?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "dpoConsulted", type: "yesno", label: "Has the DPO or privacy team been consulted on this DPIA? (Art. 35(2))" },
				{ id: "reviewDate", type: "date", label: "When will this DPIA be reviewed?" }
			]
		}
	];

	var RISK_LEVELS = ["Low", "Medium", "High", "Very High"];

	/* Explicit severity x likelihood mapping rather than a product. A product
	 * under-weights severity: it would rate "maximum severity, limited
	 * likelihood" (4x2) below "significant/significant" (3x3), even though an
	 * irreversible impact on individuals is the more serious case. Rows are
	 * severity (negligible -> maximum), columns likelihood (negligible ->
	 * maximum), so nothing at maximum severity ever falls below High. */
	var RISK_MATRIX = [
		["Low",    "Low",    "Low",       "Medium"],
		["Low",    "Medium", "Medium",    "High"],
		["Medium", "High",   "High",      "Very High"],
		["High",   "High",   "Very High", "Very High"]
	];
	function riskLevelFor(sevIdx, likIdx) {
		if (sevIdx < 0 || likIdx < 0) return null;
		return RISK_MATRIX[sevIdx][likIdx];
	}

	function dpiaResult(a) {
		var events = [
			{ key: "access", short: "A", name: "Illegitimate access" },
			{ key: "modif", short: "M", name: "Unwanted modification" },
			{ key: "disap", short: "D", name: "Data disappearance" }
		].map(function (ev) {
			var sevIdx = SEVERITY_SCALE.indexOf(a[ev.key + "Severity"]);
			var likIdx = LIKELIHOOD_SCALE.indexOf(a[ev.key + "Likelihood"]);
			return {
				key: ev.key, short: ev.short, name: ev.name,
				sevIdx: sevIdx, likIdx: likIdx,
				level: riskLevelFor(sevIdx, likIdx),
				sources: a[ev.key + "Sources"] || [],
				threats: a[ev.key + "Threats"] || []
			};
		});

		var scored = events.filter(function (e) { return e.level !== null; });
		var highest = "Low", highestIdx = -1;
		scored.forEach(function (e) {
			var i = RISK_LEVELS.indexOf(e.level);
			if (i > highestIdx) { highestIdx = i; highest = e.level; }
		});
		if (!scored.length) highest = null;

		var triggers = a.dpiaTriggers || [];
		var dpiaStatus = triggers.length >= 2 ? "Required"
			: (triggers.length === 1 ? "Likely required" : "Not indicated by these criteria");

		// Art. 36: high residual risk the controller cannot mitigate means
		// the supervisory authority must be consulted before processing.
		var priorConsultation = (highest === "Very High" || highest === "High") && a.residualAcceptable === "No";

		var controls = a.controlsInPlace || [];
		return {
			events: events, scored: scored, highest: highest,
			triggers: triggers, dpiaStatus: dpiaStatus,
			priorConsultation: priorConsultation,
			controls: controls,
			factors: dpiaFactors(a, {
				events: events, scored: scored, highest: highest, triggers: triggers,
				dpiaStatus: dpiaStatus, priorConsultation: priorConsultation, controls: controls
			})
		};
	}

	function dpiaFactors(a, r) {
		var f = [];

		if (r.priorConsultation) {
			f.push({ title: "Prior consultation with the supervisory authority indicated", detail: "You have recorded " + r.highest.toLowerCase() + " residual risk that the controls do not bring down to an acceptable level. Under GDPR Art. 36 the supervisory authority must be consulted before the processing starts. Do not go live on the strength of this assessment alone.", severity: "high" });
		} else if ((r.highest === "Very High" || r.highest === "High") && a.residualAcceptable === "Yes") {
			f.push({ title: "High residual risk recorded as acceptable", detail: "The matrix puts at least one feared event at " + r.highest.toLowerCase() + " risk, but you have judged the residual risk acceptable. Make sure the justification for that judgement is written down - it is exactly what a supervisory authority would ask to see.", severity: "high" });
		} else if (r.highest === "Very High" || r.highest === "High") {
			f.push({ title: "High residual risk, but no acceptance decision recorded", detail: "The matrix puts at least one feared event at " + r.highest.toLowerCase() + " risk, and the question of whether the residual risk is acceptable has not been answered yet. Record that decision explicitly - and the reasoning behind it - before treating this DPIA as complete.", severity: "high" });
		}

		if (r.dpiaStatus === "Required") {
			f.push({ title: "DPIA is required", detail: "The processing meets " + r.triggers.length + " of the Art. 35(3) criteria. Two or more normally means a DPIA is mandatory, so this assessment needs to be completed, signed off and kept.", severity: "medium" });
		} else if (r.dpiaStatus === "Likely required") {
			f.push({ title: "One trigger criterion met", detail: "A single criterion does not automatically make a DPIA mandatory, but many supervisory authorities expect one where the processing is otherwise sensitive or large. Record your reasoning either way.", severity: "medium" });
		} else {
			f.push({ title: "No trigger criteria selected", detail: "On these answers a DPIA is not mandatory. Check your authority's own published list of processing that always requires one, and keep this screening as the record of the decision.", severity: "low" });
		}

		if (r.scored.length < 3) {
			f.push({ title: "Not all three feared events were scored", detail: "Illegitimate access, unwanted modification and data disappearance are assessed together because controls that address one often leave the others open. Score all three.", severity: "medium" });
		}

		r.scored.forEach(function (e) {
			if (e.level === "Very High" || e.level === "High") {
				f.push({ title: e.name + " is a " + e.level.toLowerCase() + " risk", detail: "Severity and likelihood combine to put this event in the " + e.level.toLowerCase() + " band. Reducing likelihood is usually the practical lever - additional controls against " + (e.threats.length ? e.threats.slice(0, 2).join(" and ").toLowerCase() : "the identified threats") + " would move it down the matrix.", severity: "high" });
			}
			if (!e.sources.length || !e.threats.length) {
				f.push({ title: "Risk sources or threats not identified for " + e.name.toLowerCase(), detail: "A severity and likelihood rating without named sources and threats is hard to defend, and hard to revisit later. Record what you actually had in mind.", severity: "medium" });
			}
		});

		if (!(a.legalBasis || []).length) {
			f.push({ title: "No lawful basis recorded", detail: "Every processing activity needs a lawful basis under Art. 6, identified before processing starts and reflected in the privacy notice.", severity: "high" });
		}
		if ((a.legalBasis || []).indexOf("Necessary for the legitimate interests of the organization or a third party") !== -1 &&
			r.controls.indexOf("Legitimate interest balancing test completed") === -1) {
			f.push({ title: "Legitimate interests relied on without a balancing test", detail: "Where legitimate interests is the basis, a three-part balancing test (purpose, necessity, balance against individuals' rights) should be documented and kept with this DPIA.", severity: "medium" });
		}
		if (a.specialCategory === "Yes" && (!a.art9Condition || a.art9Condition.indexOf("Not applicable") === 0)) {
			f.push({ title: "Special category data without an Art. 9 condition", detail: "Special category data needs a condition under Art. 9 in addition to the Art. 6 basis. Identify it explicitly.", severity: "high" });
		}
		if (a.retentionDefined !== "Yes") {
			f.push({ title: "Retention not fully defined", detail: "Set a specific period per purpose and make sure deletion is actually enforced in the system, not just stated in policy.", severity: "medium" });
		}
		if (a.noticeInPlace === "No") {
			f.push({ title: "No privacy notice covering this processing", detail: "Individuals must be informed at or before collection. This is usually the quickest compliance gap to close, and its absence is very visible to regulators.", severity: "high" });
		}
		["rightsAccess", "rightsErasure", "rightsObject"].forEach(function (id) {
			if (a[id] === "No") {
				var names = { rightsAccess: "Access and portability", rightsErasure: "Rectification and erasure", rightsObject: "Restriction and objection" };
				f.push({ title: names[id] + " requests cannot be fulfilled", detail: "If the system cannot support this right, that is a design gap to fix before go-live, not a process gap to work around.", severity: "high" });
			}
		});
		if (a.transfersOutside === "Yes" && (a.transferMechanism || []).indexOf("None identified yet") !== -1) {
			f.push({ title: "Transfer outside the home region with no mechanism identified", detail: "A transfer needs a valid mechanism (adequacy, SCCs, BCRs or a derogation) in place before it starts.", severity: "high" });
		}
		if (a.transfersOutside === "Yes" && a.tiaDone === "No") {
			f.push({ title: "No transfer impact assessment", detail: "Where transfers rely on SCCs or BCRs, assess the destination country's laws and any supplementary measures needed, and record the outcome.", severity: "medium" });
		}
		if (a.processorsInvolved === "Yes" && r.controls.indexOf("Data processing agreement with the supplier") === -1) {
			f.push({ title: "Processor involved without a recorded data processing agreement", detail: "Art. 28 requires a written contract with every processor covering the mandated terms. Record it as a control here once it is in place.", severity: "high" });
		}
		if (r.controls.indexOf("Processing recorded in the RoPA") === -1) {
			f.push({ title: "Not recorded in the RoPA", detail: "Add the processing activity to your Record of Processing Activities so it is tracked, auditable and consistent with this DPIA.", severity: "medium" });
		}
		if (a.dpoConsulted === "No") {
			f.push({ title: "DPO not consulted", detail: "Art. 35(2) requires the controller to seek the DPO's advice when carrying out a DPIA, where a DPO is designated. Record the advice given.", severity: "medium" });
		}
		if (!a.reviewDate) {
			f.push({ title: "No review date set", detail: "A DPIA is a living document - set a review date, and revisit it whenever the processing, the risk or the controls change.", severity: "low" });
		}
		return f;
	}


	/* =================================================================
	 *  LEGITIMATE INTEREST TEST (LIA)
	 *
	 *  The three-part test: a purpose test (is there a legitimate
	 *  interest?), a necessity test (is the processing necessary for
	 *  it?), and a balancing test (do the individual's interests,
	 *  rights and freedoms override it?). Structure follows a standard
	 *  standalone LIA template; the weighing below is transparent
	 *  rather than a hidden score - both sides are shown.
	 * ================================================================= */

	var LIA_SAFEGUARDS = [
		"Data minimisation - only the fields actually needed",
		"Pseudonymisation or de-identification",
		"Aggregation for any secondary use",
		"Strict retention limits with enforced deletion",
		"Access restrictions and least privilege",
		"Technical and organisational security measures",
		"A clear, specific privacy notice covering this purpose",
		"An easy opt-out or objection mechanism",
		"Human review of any automated outcome",
		"Contractual controls on third parties",
		"Training for the staff involved",
		"A DPIA covering this processing"
	];

	var LIA_STEPS = [
		{
			key: "purpose",
			title: "Part 1 - the purpose test",
			intro: "First, identify the interest. A legitimate interest can be your own or a third party's, and it must be real and specific rather than vague.",
			questions: [
				{ id: "name", type: "text", label: "Which processing activity is this assessment for?" },
				{ id: "purpose", type: "textarea", label: "What is the purpose of the processing, and whose interest does it serve?" },
				{ id: "legitimateByLaw", type: "select", label: "Does the GDPR, the ePrivacy rules or national law specifically recognise this kind of processing as a legitimate activity (subject to a balancing test)?", options: ["Yes", "No", "Not sure"],
					note: { label: "Which provision or recital, or why you consider the interest legitimate", visibleIf: function (v) { return !!v; } } }
			]
		},
		{
			key: "necessity",
			title: "Part 2 - the necessity test",
			intro: "Necessary does not mean convenient. If the objective can reasonably be achieved another way, or with less data, legitimate interests will not hold.",
			questions: [
				{ id: "necessaryOrg", type: "yesno", label: "Is the processing necessary to meet one or more specific objectives of your organization?",
					note: { label: "Explain why it matters to the organization", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "necessaryThirdParty", type: "yesno", label: "Is the processing necessary to meet a specific objective of a third party?",
					note: { label: "Name the third party and explain why it matters to them", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "alternativeExists", type: "select", label: "Is there another reasonable way of achieving the same objective - with less data, or without personal data at all?", options: ["No", "Yes", "Not sure"],
					note: { label: function (v) { return v === "Yes" ? "Describe the alternative and why it was not chosen" : "What alternatives were considered and ruled out?"; }, visibleIf: function (v) { return !!v; } } }
			]
		},
		{
			key: "expectations",
			title: "Part 3a - what the individual would expect",
			intro: "The balancing test starts from the individual's reasonable expectations, not the organization's intentions.",
			questions: [
				{ id: "expectation", type: "select", label: "Would the individual expect this processing to take place?", options: ["Yes", "No", "Not sure"] },
				{ id: "purposeExpectation", type: "select", label: "Would they expect their data to be used specifically for this purpose?", options: ["Yes", "No", "Not sure"] },
				{ id: "intrusive", type: "select", label: "Could the processing be seen as intrusive or inappropriate - by the individual, or given the nature of the relationship?", options: ["No", "Yes", "Not sure"],
					note: { label: "Explain what could be perceived as intrusive", visibleIf: function (v) { return v === "Yes" || v === "Not sure"; } } },
				{ id: "distress", type: "select", label: "Is the processing likely to cause unwarranted harm or distress to the individual?", options: ["No", "Yes", "Not sure"],
					note: { label: "Describe the harm or distress and who it would affect", visibleIf: function (v) { return v === "Yes" || v === "Not sure"; } } }
			]
		},
		{
			key: "relationship",
			title: "Part 3b - the relationship",
			questions: [
				{ id: "connection", type: "select", label: "What is the individual's connection to the organization?", options: ["Customer", "Consumer", "Employee", "Job candidate", "Supplier or contractor", "No existing relationship", "Other"],
					note: { label: "Describe the connection", visibleIf: function (v) { return v === "Other"; } } },
				{ id: "relationshipType", type: "select", label: "Is there a two-way relationship, and how close is it?", options: ["Ongoing", "Periodic", "One-off", "None"] },
				{ id: "collection", type: "select", label: "Was the data obtained directly from the individual, or indirectly?", options: ["Directly", "Indirectly", "Both"] },
				{ id: "imbalance", type: "select", label: "Is there an imbalance of power between the organization and the individual?", options: ["No", "Yes", "Not sure"],
					note: { label: "Explain the imbalance", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "interests",
			title: "Part 3c - the interests at stake",
			questions: [
				{ id: "controllerPrejudice", type: "select", label: "Would the organization be prejudiced if the processing did not happen?", options: ["Yes", "No", "Not sure"],
					note: { label: "What would the impact be?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "thirdPartyPrejudice", type: "select", label: "Would a third party be prejudiced if the processing did not happen?", options: ["Yes", "No", "Not applicable"],
					note: { label: "Which third party, and what impact?", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "subjectInterest", type: "select", label: "Is the processing in the individual's own interest - does it add value to something they use?", options: ["Yes", "Partly", "No"],
					note: { label: "Explain the benefit to the individual", visibleIf: function (v) { return v === "Yes" || v === "Partly"; } } },
				{ id: "alignedInterests", type: "select", label: "Are the individual's interests aligned with the interest being relied on?", options: ["Yes", "Partly", "No"] }
			]
		},
		{
			key: "data-rights",
			title: "Part 3d - the data and the individual's rights",
			questions: [
				{ id: "dataNature", type: "textarea", label: "What is the nature of the data being processed?" },
				{ id: "specialCategories", type: "yesno", label: "Does the data include special category or criminal offence data?" },
				{ id: "rightsLimitation", type: "select", label: "Would the processing limit or undermine the individual's rights?", options: ["No", "Yes", "Not sure"],
					note: { label: "Which rights, and how", visibleIf: function (v) { return v === "Yes" || v === "Not sure"; } } },
				{ id: "notice", type: "select", label: "Is a privacy notice provided that is clear and up front about this purpose?", options: ["Yes", "Partly", "No"],
					note: { label: function (v) { return v === "Yes" ? "Where is it provided, and when do they see it?" : "What is missing, and what is the plan?"; }, visibleIf: function (v) { return !!v; } } },
				{ id: "objection", type: "select", label: "Can the individual control the processing or object to it easily?", options: ["Yes", "Partly", "No"],
					note: { label: "How can they object, or why can they not?", visibleIf: function (v) { return !!v; } } },
				{ id: "mitigation", type: "select", label: "Could the scope of the processing be reduced to lower the privacy impact?", options: ["Yes", "No", "Already minimised"],
					note: { label: "What could be reduced, and will it be?", visibleIf: function (v) { return v === "Yes"; } } }
			]
		},
		{
			key: "safeguards",
			title: "Part 4 - safeguards and compensating controls",
			intro: "Safeguards are what can tip a finely balanced assessment. They only count if they are actually in place, or committed to with a date.",
			questions: [
				{ id: "safeguards", type: "multiselect", label: "Which safeguards or compensating controls are in place?", options: LIA_SAFEGUARDS,
					note: { label: "Any other safeguard, and anything still to be implemented (with a target date)", visibleIf: function () { return true; } } }
			]
		},
		{
			key: "outcome",
			title: "Part 5 - your conclusion",
			intro: "The tool weighs your answers below, but the recorded decision is yours. Write the reasoning in your own words - this is the part a regulator would read.",
			questions: [
				{ id: "outcomeNote", type: "textarea", label: "Can you rely on legitimate interests for this processing? Set out why, drawing on the answers above." },
				{ id: "reviewDate", type: "date", label: "When will this assessment be reviewed?" }
			]
		}
	];

	function liaResult(a) {
		var forF = [], againstF = [], blockers = [];

		// --- Purpose test ---
		var purposeOk = !!a.purpose;
		if (!purposeOk) blockers.push({ title: "No purpose recorded", detail: "The purpose test starts with a specific, articulated interest. A vague or unstated purpose cannot support legitimate interests.", severity: "high" });
		if (a.legitimateByLaw === "Yes") forF.push({ title: "Recognised in law as a legitimate activity", detail: "The processing is of a kind the legislation itself acknowledges, which strengthens the purpose test - though it does not remove the need to balance." });

		// --- Necessity test ---
		var necessary = a.necessaryOrg === "Yes" || a.necessaryThirdParty === "Yes";
		if (!necessary) {
			blockers.push({ title: "Necessity test not met", detail: "Neither an organizational nor a third-party objective was identified as making this processing necessary. Without that, legitimate interests is not available regardless of how the balancing test comes out.", severity: "high" });
		} else {
			forF.push({ title: "A specific objective makes the processing necessary", detail: a.necessaryOrg === "Yes" ? "An organizational objective was identified." : "A third-party objective was identified." });
		}
		if (a.alternativeExists === "Yes") {
			blockers.push({ title: "A less intrusive alternative exists", detail: "If the objective can reasonably be achieved another way, or with less personal data, the processing is not \"necessary\" in the sense the law requires. Either take the alternative, or record why it is not reasonably available.", severity: "high" });
		} else if (a.alternativeExists === "Not sure") {
			againstF.push({ title: "Alternatives not fully explored", detail: "Necessity is judged against what could reasonably have been done instead. Document the alternatives you considered and why they were ruled out.", weight: 2 });
		} else if (a.alternativeExists === "No") {
			forF.push({ title: "No reasonable alternative identified", detail: "You have recorded that the objective cannot reasonably be met another way." });
		}

		// --- Special category data is a hard stop for this basis alone ---
		if (a.specialCategories === "Yes") {
			blockers.push({ title: "Special category or criminal offence data", detail: "Legitimate interests is an Art. 6 basis only. Special category data additionally needs an Art. 9 condition, and criminal offence data needs an Art. 10 basis - neither of which legitimate interests can supply. Identify the separate condition, or do not process this data on this basis.", severity: "high" });
		}

		function against(cond, title, detail, weight) { if (cond) againstF.push({ title: title, detail: detail, weight: weight }); }
		function favour(cond, title, detail) { if (cond) forF.push({ title: title, detail: detail }); }

		// --- Expectations ---
		against(a.expectation === "No", "The individual would not expect this", "Reasonable expectations carry a lot of weight in the balance. Processing people would not anticipate needs strong justification and, usually, prominent transparency.", 3);
		against(a.expectation === "Not sure", "Unclear whether the individual would expect this", "If you cannot say confidently that they would expect it, assume they would not and design accordingly.", 2);
		favour(a.expectation === "Yes", "Within the individual's reasonable expectations", "The processing is the kind of thing they would anticipate given the relationship.");
		against(a.purposeExpectation === "No", "They would not expect this specific purpose", "Expecting the relationship is not the same as expecting this use of their data.", 2);
		against(a.intrusive === "Yes", "Could be perceived as intrusive", "Perceived intrusiveness weighs directly against the organization in the balance, whatever the intent behind it.", 3);
		against(a.intrusive === "Not sure", "Possible perception of intrusiveness", "Test this with a sample of the people affected rather than assuming.", 1);
		against(a.distress === "Yes", "Likely to cause harm or distress", "This is close to decisive. Unwarranted harm or distress will normally mean the individual's interests override the legitimate interest.", 4);
		against(a.distress === "Not sure", "Potential for harm or distress not ruled out", "Work out what the worst realistic outcome for an individual is before relying on this basis.", 2);

		// --- Relationship ---
		against(a.relationshipType === "None", "No existing relationship", "Legitimate interests is hardest to sustain where there is no relationship at all - the individual has no context in which to expect the processing.", 3);
		against(a.relationshipType === "One-off", "Only a one-off relationship", "A single past interaction supports a much narrower range of processing than an ongoing one.", 2);
		favour(a.relationshipType === "Ongoing", "Ongoing relationship", "An active, continuing relationship broadens what an individual would reasonably expect.");
		against(a.collection === "Indirectly", "Data obtained indirectly", "Where data did not come from the individual, they may not know you hold it. Art. 14 information duties apply, and the balance is harder to satisfy.", 2);
		favour(a.collection === "Directly", "Data collected directly from the individual", "They were present at collection, which supports both transparency and expectation.");
		against(a.imbalance === "Yes", "Imbalance of power", "Where the individual is not free to walk away, their apparent acceptance carries less weight, and more is expected of the organization.", 2);
		against(a.connection === "Employee" || a.connection === "Job candidate", "Employment context", "Employees and candidates are in a dependent position. Regulators scrutinise legitimate interests here closely, and consent is generally not a valid alternative.", 2);

		// --- Interests ---
		favour(a.controllerPrejudice === "Yes", "Real prejudice if the processing does not happen", "A concrete detriment to the organization strengthens the weight on its side of the balance.");
		favour(a.thirdPartyPrejudice === "Yes", "Third party would be prejudiced", "A third-party interest is a legitimate interest in its own right under Art. 6(1)(f).");
		against(a.controllerPrejudice === "No" && a.thirdPartyPrejudice !== "Yes", "Little prejudice if the processing does not happen", "If nothing much is lost by not processing, there is little to weigh against the individual's interests.", 3);
		favour(a.subjectInterest === "Yes", "The processing benefits the individual", "A direct benefit to the person whose data it is weighs meaningfully in favour.");
		against(a.subjectInterest === "No", "No benefit to the individual", "Processing that serves only the organization has to clear a higher bar on every other factor.", 2);
		favour(a.alignedInterests === "Yes", "Interests are aligned", "Where both sides want the same outcome, the balance is much easier to satisfy.");
		against(a.alignedInterests === "No", "Interests are not aligned", "Directly opposed interests are the classic case where the individual's rights override.", 2);

		// --- Rights and controls ---
		against(a.rightsLimitation === "Yes", "The processing limits or undermines individual rights", "Anything that erodes the rights the law grants weighs heavily against relying on this basis.", 4);
		against(a.rightsLimitation === "Not sure", "Effect on individual rights unclear", "Work through each right - access, erasure, objection, portability - and confirm the processing does not obstruct it.", 2);
		against(a.notice === "No", "No privacy notice covering this purpose", "Transparency is not optional for legitimate interests. Individuals must be told what you are doing, the interest relied on, and their right to object.", 4);
		against(a.notice === "Partly", "Privacy notice does not fully cover this purpose", "The notice must name the legitimate interest being relied on and the right to object, specifically enough that the individual can act on it.", 2);
		favour(a.notice === "Yes", "Clear, up-front privacy notice", "Transparency about the interest relied on is a precondition for this basis, and you have it.");
		against(a.objection === "No", "The individual cannot easily object", "The right to object under Art. 21 is central to legitimate interests. If objecting is impractical, the basis is very hard to defend.", 4);
		against(a.objection === "Partly", "Objecting is possible but not easy", "Make the route to object as easy as the route into the processing.", 2);
		favour(a.objection === "Yes", "Easy to object or opt out", "A working, easy objection route is one of the strongest points in favour.");
		against(a.mitigation === "Yes", "Scope could be reduced but has not been", "If the impact can be lowered and you have not lowered it, you are not processing the minimum necessary - which undermines both necessity and the balance.", 3);
		favour(a.mitigation === "Already minimised", "Scope already minimised", "The processing has been pared back to what is needed.");

		var safeguards = a.safeguards || [];
		if (safeguards.length >= 3) {
			forF.push({ title: safeguards.length + " safeguards in place", detail: "Compensating controls are what shift a finely balanced case. Keep them documented and verifiable - a safeguard you cannot evidence does not count." });
		} else if (safeguards.length) {
			againstF.push({ title: "Few safeguards recorded", detail: "Only " + safeguards.length + " control(s) recorded. Safeguards are the main lever you have for tipping the balance in your favour.", weight: 1 });
		} else {
			againstF.push({ title: "No safeguards recorded", detail: "Without compensating controls there is nothing to offset the impact on the individual.", weight: 3 });
		}

		// --- Weigh it up ---
		var againstWeight = againstF.reduce(function (t, f) { return t + (f.weight || 1); }, 0);
		var forWeight = forF.length * 2;

		var verdict, verdictKey, verdictDetail;
		if (blockers.length) {
			verdict = "Cannot rely on legitimate interests";
			verdictKey = "veryhigh";
			verdictDetail = "One or more issues below are not a matter of balance - they remove this basis entirely until resolved.";
		} else if (againstWeight >= 12) {
			verdict = "Unlikely to be available";
			verdictKey = "high";
			verdictDetail = "The factors weighing against outweigh those in favour by a clear margin. Either address the points below, or use a different lawful basis.";
		} else if (againstWeight >= 6 || againstWeight >= forWeight) {
			verdict = "Finely balanced";
			verdictKey = "medium";
			verdictDetail = "This could go either way. It is defensible only if you address the points against and record the reasoning - this is exactly the case a regulator would want to see written down.";
		} else {
			verdict = "Legitimate interests can likely be relied on";
			verdictKey = "low";
			verdictDetail = "The balance favours the processing on these answers. Keep the assessment, review it if anything changes, and make sure the notice and objection route stay in place.";
		}

		return {
			verdict: verdict, verdictKey: verdictKey, verdictDetail: verdictDetail,
			forF: forF, againstF: againstF, blockers: blockers,
			forWeight: forWeight, againstWeight: againstWeight,
			necessary: necessary && a.alternativeExists !== "Yes",
			purposeOk: purposeOk
		};
	}

	/* =================================================================
	 *  THIRD-PARTY SECURITY ASSESSMENT (TPSA)
	 *
	 *  Structure follows a standard vendor/third-party security due-
	 *  diligence questionnaire: intake (what the engagement involves,
	 *  what data it touches), then roughly twenty security domains
	 *  covering governance, people, assets, development, access,
	 *  operations, networks, cryptography, incident response, physical
	 *  security, continuity and compliance monitoring - the same domains
	 *  a SIG-style or ISO/IEC 27001-aligned vendor questionnaire covers -
	 *  plus an AI/ML supplement (OWASP-style model-attack resistance and
	 *  data-handling assurance) for engagements that involve an AI system.
	 *
	 *  Each control is answered on a four-point scale (Fully / Partially
	 *  / Not in place / Not applicable). Scoring combines two independent
	 *  reads, in the same spirit as a standard TPRM program:
	 *    - Inherent risk: what is at stake, from the intake answers alone
	 *      (data sensitivity, connectivity, exposure, scale, AI use) -
	 *      independent of how well the third party is actually controlled.
	 *    - Control maturity: a weighted average of the domain scores,
	 *      from the actual control answers.
	 *  The two are combined into a residual risk band via an explicit
	 *  lookup table (not a raw product) - the same approach, and for the
	 *  same reason, as the DPIA's severity x likelihood matrix: a raw
	 *  multiplication lets strong controls fully cancel out a critical
	 *  amount at stake, which understates risk at the extremes.
	 * ================================================================= */

	var COMPLIANCE_OPTIONS = ["Fully in place", "Partially in place", "Not in place", "Not applicable"];
	var COMPLIANCE_SCORE = { "Fully in place": 1, "Partially in place": 0.5, "Not in place": 0 };

	// One reusable question shape for every control: a four-point compliance
	// select, with a note that opens up only when there is a gap to explain.
	function controlQ(id, label) {
		return {
			id: id, type: "select", label: label, options: COMPLIANCE_OPTIONS,
			note: { label: "Describe the compensating controls in place, or the plan and timeline to close this gap", visibleIf: function (v) { return v === "Partially in place" || v === "Not in place"; } }
		};
	}

	// Domains that always apply. "weight" nudges a handful of domains that
	// third-party risk programs commonly treat as higher priority - identity
	// & access, incident response, cryptography, supply chain. Adjust the
	// weights in your own record if your program weights differently.
	var TPSA_DOMAINS = [
		{ key: "governance", title: "Governance & risk management", weight: 1, controls: [
			["govOversight", "There is a role with information-security oversight that sets direction for the organization's security program."],
			["riskProgramFormal", "There is a formal, documented and implemented information-risk management program."],
			["riskProgramOwner", "The risk management program has a dedicated owner responsible for maintaining and reviewing it."],
			["secPolicyApproved", "There is an information security policy, approved by management and reviewed periodically."],
			["secRolesDefined", "Information security roles and responsibilities are defined and documented."]
		] },
		{ key: "people", title: "People & personnel security", weight: 1, controls: [
			["peopleScreening", "Job applicants are screened, including prior-employment and reference checks."],
			["peopleNda", "Staff are required to sign a non-disclosure agreement and an acceptable-use policy."],
			["peopleTraining", "Staff receive regular security-awareness training."],
			["peopleOffboarding", "Access rights are automatically removed, or promptly adjusted, when someone's employment or role changes."]
		] },
		{ key: "assets", title: "Information asset management", weight: 1, controls: [
			["assetInventory", "There is a formal asset-management program with an inventory of critical assets, including any assets accessible to third parties."],
			["assetOwnership", "Ownership of information assets is formally assigned."],
			["assetClassification", "There is a formal information-classification policy."],
			["assetMediaHandling", "The asset-management program covers the handling, disposal, destruction and reuse of media."]
		] },
		{ key: "devices", title: "Devices, mobile & remote access", weight: 1, controls: [
			["mobileEncryption", "Sensitive data is encrypted when copied to removable media."],
			["remoteAccessMfa", "Remote access to systems, applications or network devices requires multi-factor authentication and encryption."],
			["deviceInventory", "Physical devices and systems are inventoried."],
			["mediaTransport", "There are processes to ensure the secure physical transport of removable media."]
		] },
		{ key: "sdlc", title: "Secure development lifecycle", weight: 1, controls: [
			["sdlcMethodology", "There is a maintained, up-to-date development methodology covering techniques, delivery methods, architectures and security standards."],
			["sdlcQA", "Quality assurance in the development lifecycle covers: assessing development risks; confirming security requirements are defined; confirming the agreed security controls were built; and verifying they are effectively met."],
			["sdlcVersionControl", "There is a clearly defined process for version control over development software."],
			["sdlcSecureEnv", "There is a secure development environment that accounts for data sensitivity, applicable requirements, existing controls, environment segregation, access control, change monitoring, offsite backups and data movement in and out."],
			["sdlcCodingTraining", "Software developers receive periodic secure-coding training."]
		] },
		{ key: "release", title: "Release, testing & code security", weight: 1, controls: [
			["releasePostImplementation", "Post-implementation reviews, including information security, are conducted for all new systems."],
			["releaseFinalSecurityAssessment", "There is a final security assessment on applications before they go live."],
			["releaseTestResultsShared", "Customers are provided with the results of that final security assessment on request."],
			["releaseOutdatedReview", "There are periodic reviews for outdated protocols and libraries."],
			["releaseNoLiveDataInTest", "Controls are in place to ensure confidential or live data is never used in testing."],
			["releaseSourceSanitized", "Source code and data in development environments have unnecessary sensitive information removed (credentials, developer comments, organizational detail)."]
		] },
		{ key: "appmgmt", title: "Application & environment segregation", weight: 1, controls: [
			["appDevProdSegregation", "Developers do not have access to production systems and data."],
			["appEnvSeparation", "Test, development and production systems are hosted in separate environments."],
			["appTenantSegregation", "Systems used to store or process your data are separated from systems processing other customers' data."],
			["appWebEncryption", "Web-server communications are encrypted, with non-repudiation ensured via digital certificates."]
		] },
		{ key: "iam", title: "Identity & access management", weight: 1.25, controls: [
			["iamAccessPolicy", "There is a formal access-control policy: role-based access, a unique ID per individual, no shared or generic IDs, and need-to-know / least-privilege principles."],
			["iamPasswordPolicy", "There is a formal password policy: no sharing, forced change at first login, periodic changes, complexity, and secure storage."],
			["iamPasswordComplexity", "Good password practice is enforced in the solution itself (a minimum length, mixed case, digits and special characters)."],
			["iamLockout", "Accounts are locked or disabled after a defined number of failed login attempts (a common baseline is 5)."],
			["iamPasswordExpiry", "Passwords expire after a defined period (a common baseline is 90-120 days)."],
			["iamSso", "Single sign-on (SSO) is supported, so access can be centrally managed and revoked."]
		] },
		{ key: "accessreview", title: "Access review & session controls", weight: 1.25, controls: [
			["accessAnnualReview", "Access rights to systems, applications and network devices are reviewed at least annually."],
			["firewallAnnualReview", "Firewall rules are reviewed at least annually."],
			["sessionTimeout", "Workstations lock automatically after a period of inactivity."],
			["privilegedAccessControl", "Privileged users and administrative tools are subject to specific controls."],
			["breakGlassAccounts", "Any emergency 'break-glass' accounts that exist are tightly controlled and accounted for."],
			["loggingStandard", "There is a documented standard for security-event logging: generation, storage, protection, retention, and the attributes captured (date, time, user ID, filename, IP address)."],
			["logRetention", "Security-event logs are retained for a defined minimum period (a common baseline is 90 days)."]
		] },
		{ key: "sysmgmt", title: "Change, configuration & patch management", weight: 1, controls: [
			["changeManagement", "There is a formal change-management process that tracks relevant changes."],
			["configStandardization", "Devices are built to a standard configuration and periodically reviewed for deviation."],
			["endpointSecuritySoftware", "Servers and endpoints run security software that users cannot disable."],
			["edrSolution", "An endpoint detection and response (EDR) solution investigates suspicious activity on hosts and endpoints."],
			["serverPatching", "Servers, workstations, applications and network devices are patched on a regular basis."],
			["emergencyPatching", "There is an emergency-patch process for rapid response to critical vulnerabilities."],
			["vulnAssessmentPolicy", "There is a formal vulnerability-assessment policy: regular assessments, severity classification, and required remediation of high-risk findings."]
		] },
		{ key: "resilience", title: "Backup & monitoring", weight: 1, controls: [
			["backupsRegular", "Systems holding sensitive data are backed up on a regular basis."],
			["backupRestoreTesting", "Restoration of backups is tested regularly."],
			["idsIpsMonitoring", "External network connections are monitored by an IPS/IDS."],
			["physicalMaintenance", "Physical equipment is subject to a regular maintenance process."]
		] },
		{ key: "network", title: "Networks & communications", weight: 1, controls: [
			["emailSecurity", "Email systems are protected by technical security controls."],
			["insecureProtocolsDisabled", "Insecure protocols (Telnet, FTP, unencrypted instant messaging) are disabled at the network boundary."],
			["transmissionEncryption", "Sensitive data is encrypted, in transit and on physical media, before it leaves the environment."],
			["antiDdos", "Anti-DDoS mechanisms are in place at infrastructure and application level."],
			["internetMonitoring", "Internet access is monitored, and access to known-harmful sites is blocked."],
			["phishingDefense", "Phishing defenses (email filtering, simulation or training, or similar) are in place."]
		] },
		{ key: "supplychain", title: "Supply chain & sub-processors", weight: 1.25, extra: [
			{ id: "subcontractorsUsed", type: "yesno", label: "Are subcontractors or sub-processors used to perform the service?",
				note: { label: "Name their role (not their identity, if that's easier) and how their access is controlled", visibleIf: function (v) { return v === "Yes"; } } }
		], controls: [
			["thirdPartyHostingContracts", "Where the solution is hosted by another third party, that hosting contract incorporates information-security requirements."],
			["supplierSecurityPolicy", "There are information-security policies governing supplier relationships and the risk of supplier access to assets."],
			["thirdPartyMonitoring", "The security of the organization's own suppliers is actively monitored."]
		] },
		{ key: "crypto", title: "Cryptography & key management", weight: 1.25, controls: [
			["tlsInTransit", "Connections between servers and back-office systems are encrypted (e.g. TLS 1.2 or higher, or IPsec)."],
			["encryptionAtRest", "Data is encrypted at rest (e.g. AES-256 or equivalent)."],
			["passwordHashing", "Passwords are never stored in plaintext - only salted hashes are used to identify users."],
			["cryptoPolicy", "There is a defined policy on the use of cryptographic controls: what must be encrypted, mobile/removable media, the key-management approach, applicable standards, and roles."],
			["keyManagement", "There is a defined key-management procedure covering the full key lifecycle: generation, storage, archival, retrieval, distribution, removal and destruction."],
			["perCustomerKeys", "Unique encryption keys can be issued on a per-customer basis."]
		] },
		{ key: "incident", title: "Threat & incident management", weight: 1.25, controls: [
			["incidentReportingObligation", "Employees are contractually obliged to report security incidents."],
			["incidentResponseProcess", "There is a formal incident-response process: an obligation to report, client notification in the event of a breach, and a response team with defined roles."],
			["emergencyResponseProcess", "There is an emergency-response process for a fast, effective reaction to serious attacks."],
			["authorityNotification", "Relevant authorities are notified where criminal or fraudulent activity is suspected."]
		] },
		{ key: "physical", title: "Physical security & business continuity", weight: 1, controls: [
			["physicalAccessControl", "Buildings housing critical facilities are protected against unauthorized access."],
			["environmentalProtection", "Critical facilities are protected against fire, flood and other environmental hazards."],
			["powerAcProtection", "Critical-facility equipment is protected from power failure and, where needed, climate-controlled."],
			["secureHostingLocation", "The solution, and your data within it, is hosted in a clearly defined, secure location."],
			["surveillanceSystems", "Critical facilities are protected by surveillance, alarm and intrusion-detection systems."],
			["continuityPlan", "A continuity plan is in place, based on a risk assessment, for the event of a disaster."],
			["bcmClauseSla", "There is a business-continuity clause or SLA covering the recovery plan, recovery time and recovery point objectives."],
			["bcTestingAnnual", "Business-continuity tests are performed annually, with results, lessons learned and action plans reported to customers."]
		] },
		{ key: "compliance", title: "Compliance, monitoring & improvement", weight: 1, controls: [
			["complianceProgram", "There is an established program covering legal, regulatory and contractual requirements (e.g. GDPR, PCI DSS) and relevant standards (e.g. ISO/IEC 27001)."],
			["complianceMonitoringDocs", "There are documented procedures for monitoring information-security compliance across the organization."],
			["breachReportingToCustomer", "Breaches of the security policy, or suspected weaknesses, are reported to you as the customer."],
			["riskTransferInsurance", "There is a process to transfer part of the risk in the event of an incident (e.g. cyber insurance)."],
			["networkDocumentation", "Networks are supported by documentation, including network configuration diagrams."]
		] }
	];

	// AI/ML supplement - only relevant, and only shown, when the intake says
	// this engagement involves an AI or machine-learning system. Split into
	// two steps so no single step runs too long: attack resistance (the
	// OWASP-style model-attack surface), then data handling & assurance.
	var TPSA_AI_DOMAINS = [
		{ key: "aiAttacks", title: "AI / ML - attack resistance", weight: 1.25, visibleIf: function (a) { return a.involvesAI === "Yes"; }, controls: [
			["aiPromptInjection", "For generative AI/ML applications that interact with users: prompt-injection attacks are mitigated (e.g. input validation and sanitisation before prompts reach the model)."],
			["aiModelInversion", "Model-inversion attacks are mitigated (e.g. privacy-preserving techniques, restricted model access, monitoring)."],
			["aiDataPoisoning", "Training or model data-poisoning attacks are mitigated (e.g. strict data validation and anomaly detection on training and deployment inputs)."],
			["aiModelTheft", "Model-theft is mitigated (e.g. limiting the specificity of model outputs, or encrypting model files)."],
			["aiModelIsolation", "The trained model is isolated from other customers' data and information."]
		] },
		{ key: "aiAssurance", title: "AI / ML - data handling & assurance", weight: 1.25, visibleIf: function (a) { return a.involvesAI === "Yes"; }, controls: [
			["aiDataHostingGdpr", "Data ingested by the AI model is hosted in a clearly defined, secure location, in line with GDPR (EU hosting where required)."],
			["aiRegularAudits", "The AI system's data handling, model security and deployment environment are audited regularly (e.g. penetration testing)."],
			["aiCertifications", "The AI solution holds relevant AI-specific certification (e.g. ISO/IEC 42001)."],
			["aiTestReports", "The AI solution has documented test reports evaluating its accuracy and performance."]
		] }
	];

	var TPSA_ALL_DOMAINS = TPSA_DOMAINS.concat(TPSA_AI_DOMAINS);

	function domainToStep(d) {
		var qs = (d.extra || []).concat(d.controls.map(function (c) { return controlQ(c[0], c[1]); }));
		return { key: "tpsa-" + d.key, title: d.title, visibleIf: d.visibleIf, questions: qs };
	}

	var TPSA_ENGAGEMENT_TYPES = [
		"Software / SaaS provider",
		"Data processor or outsourced service",
		"Cloud hosting or infrastructure provider",
		"Operational technology or industrial supplier",
		"Consulting or professional services",
		"Other"
	];
	var TPSA_DATA_TYPES = [
		"Personal data (names, contact details, and similar)",
		"Payment card or bank account data",
		"HR / employee data",
		"Other confidential or proprietary business data",
		"None of the above"
	];
	var TPSA_USER_COUNTS = ["Fewer than 10", "10 to 100", "100 to 1,000", "More than 1,000"];

	var TPSA_INTAKE_STEPS = [
		{
			key: "tpsa-engagement",
			title: "Engagement details",
			questions: [
				{ id: "name", type: "text", label: "Third-party or vendor name" },
				{ id: "servicesProvided", type: "textarea", label: "What services will this third party provide?" },
				{ id: "engagementType", type: "select", label: "What kind of engagement is this?", options: TPSA_ENGAGEMENT_TYPES,
					note: { label: "Describe the engagement", visibleIf: function (v) { return v === "Other"; } } },
				{ id: "manufacturingProcesses", type: "textarea", label: "Which operational or manufacturing processes does this involve?",
					visibleIf: function (a) { return a.engagementType === "Operational technology or industrial supplier"; } },
				{ id: "involvesAI", type: "yesno", label: "Does this engagement involve an AI or machine-learning system - a model the third party operates, trains, or exposes to your users?" },
				{ id: "connectsToInternalSystems", type: "yesno", label: "Will there be any connection to your organization's internal systems?",
					note: { label: "Describe the type of connection", visibleIf: function (v) { return v === "Yes"; } } },
				{ id: "addsNewDataFlow", type: "textarea", label: "If that connection adds a new data flow, describe it",
					visibleIf: function (a) { return a.connectsToInternalSystems === "Yes"; } }
			]
		},
		{
			key: "tpsa-data",
			title: "Data & access",
			questions: [
				{ id: "dataTypesAccessed", type: "multiselect", label: "Which categories of data will the third party access, store or process?", options: TPSA_DATA_TYPES,
					note: { label: "Specify the personal data types involved (name, address, email, etc.)", visibleIf: function (v) { return (v || []).indexOf("Personal data (names, contact details, and similar)") !== -1; } } },
				{ id: "transferMethod", type: "text", label: "How will data be transferred, and by what technology (API, SFTP, HTTPS, etc.)?" },
				{ id: "publicFacing", type: "yesno", label: "Will the service have a public-facing website or application?" },
				{ id: "numberOfUsers", type: "select", label: "How many of your people will have access to the service?", options: TPSA_USER_COUNTS },
				{ id: "internalReference", type: "text", label: "Is this engagement tracked under an internal onboarding, procurement or project reference? (optional)" },
				{ id: "thirdPartyContact", type: "text", label: "Third-party security or privacy contact (name and/or email, optional)" }
			]
		}
	];

	var TPSA_STEPS = TPSA_INTAKE_STEPS.concat(TPSA_ALL_DOMAINS.map(domainToStep));

	/* --- Scoring --- */

	var TPSA_INHERENT_USER_SCORE = { "Fewer than 10": 0, "10 to 100": 0.5, "100 to 1,000": 1, "More than 1,000": 1.5 };
	// Theoretical max: all 4 data types (1+1.5+1+0.5=4) + internal connection (1)
	// + public-facing (1) + largest user tier (1.5) + AI (1) + processor engagement (0.5) = 9.
	var TPSA_INHERENT_MAX = 9;

	function tpsaInherentRisk(a) {
		var score = 0;
		var drivers = [];
		var dt = a.dataTypesAccessed || [];
		if (dt.indexOf("Personal data (names, contact details, and similar)") !== -1) { score += 1; drivers.push("personal data"); }
		if (dt.indexOf("Payment card or bank account data") !== -1) { score += 1.5; drivers.push("payment or bank account data"); }
		if (dt.indexOf("HR / employee data") !== -1) { score += 1; drivers.push("HR data"); }
		if (dt.indexOf("Other confidential or proprietary business data") !== -1) { score += 0.5; drivers.push("other confidential data"); }
		if (a.connectsToInternalSystems === "Yes") { score += 1; drivers.push("connects to internal systems"); }
		if (a.publicFacing === "Yes") { score += 1; drivers.push("a public-facing service"); }
		if (TPSA_INHERENT_USER_SCORE[a.numberOfUsers] !== undefined) score += TPSA_INHERENT_USER_SCORE[a.numberOfUsers];
		if (a.involvesAI === "Yes") { score += 1; drivers.push("an AI/ML system"); }
		if (a.engagementType === "Data processor or outsourced service") { score += 0.5; }

		var tier, tierIdx;
		if (score < 2) { tier = "Low"; tierIdx = 0; }
		else if (score < 4) { tier = "Medium"; tierIdx = 1; }
		else if (score < 6) { tier = "High"; tierIdx = 2; }
		else { tier = "Critical"; tierIdx = 3; }
		return { score: score, max: TPSA_INHERENT_MAX, tier: tier, tierIdx: tierIdx, drivers: drivers };
	}

	function tpsaDomainScore(a, d) {
		var total = 0, count = 0;
		var gaps = [];
		d.controls.forEach(function (c) {
			var id = c[0], label = c[1];
			var v = a[id];
			if (!v || v === "Not applicable") return;
			count++;
			total += COMPLIANCE_SCORE[v];
			if (v !== "Fully in place") gaps.push({ domainTitle: d.title, weight: d.weight, id: id, label: label, status: v, note: a[id + "Note"] || "" });
		});
		return { score: count ? (total / count) : null, answered: count, total: d.controls.length, gaps: gaps };
	}

	var TPSA_MATURITY_TIERS = ["Poor", "Weak", "Adequate", "Strong"];
	function tpsaMaturityTier(m) {
		if (m === null) return { tier: "Not yet assessed", tierIdx: null };
		if (m >= 0.85) return { tier: "Strong", tierIdx: 3 };
		if (m >= 0.65) return { tier: "Adequate", tierIdx: 2 };
		if (m >= 0.4) return { tier: "Weak", tierIdx: 1 };
		return { tier: "Poor", tierIdx: 0 };
	}

	// Residual = inherent risk tempered by control maturity, via an explicit
	// lookup rather than a raw product - see the note at the top of this
	// section. Rows: inherent tier (Low..Critical). Columns: maturity tier
	// (Poor..Strong). Nothing at Critical inherent risk falls below Medium,
	// whatever the control maturity - the same floor the DPIA matrix applies.
	var TPSA_RESIDUAL_MATRIX = [
		["Medium", "Low", "Low", "Low"],
		["High", "Medium", "Medium", "Low"],
		["Critical", "High", "Medium", "Medium"],
		["Critical", "Critical", "High", "Medium"]
	];

	function tpsaResult(a) {
		var domainResults = [];
		var weightedSum = 0, weightedWeight = 0;
		var allGaps = [];
		var answeredControls = 0, totalControls = 0;
		var aiAnswered = 0;

		TPSA_ALL_DOMAINS.forEach(function (d) {
			if (d.visibleIf && !d.visibleIf(a)) return;
			var r = tpsaDomainScore(a, d);
			domainResults.push({ domain: d, result: r });
			if (r.score !== null) { weightedSum += r.score * d.weight; weightedWeight += d.weight; }
			answeredControls += r.answered;
			totalControls += r.total;
			if (d.key === "aiAttacks" || d.key === "aiAssurance") aiAnswered += r.answered;
			allGaps = allGaps.concat(r.gaps);
		});

		var maturityScore = weightedWeight ? (weightedSum / weightedWeight) : null;
		var maturity = tpsaMaturityTier(maturityScore);
		var inherent = tpsaInherentRisk(a);
		var residual = maturity.tierIdx === null ? inherent.tier : TPSA_RESIDUAL_MATRIX[inherent.tierIdx][maturity.tierIdx];
		var residualProvisional = maturity.tierIdx === null;

		return {
			inherent: inherent, maturity: maturity, maturityScore: maturityScore,
			residual: residual, residualProvisional: residualProvisional,
			domainResults: domainResults, allGaps: allGaps,
			answeredControls: answeredControls, totalControls: totalControls,
			aiAnswered: aiAnswered,
			factors: tpsaFactors(a, { inherent: inherent, maturity: maturity, residual: residual, residualProvisional: residualProvisional, allGaps: allGaps, answeredControls: answeredControls, totalControls: totalControls, aiAnswered: aiAnswered })
		};
	}

	function tpsaFactors(a, r) {
		var f = [];
		var actionText = {
			Low: "Standard onboarding. Re-assess on your normal cycle (many programs use every 2-3 years, or on material change to the engagement).",
			Medium: "Onboard with monitoring in place. Track every open gap to closure and re-assess annually.",
			High: "Require a remediation plan and timeline for open gaps before go-live, and increase the review cadence.",
			Critical: "Escalate for a risk-acceptance decision at the appropriate governance level before proceeding. Treat open gaps in the priority domains (identity & access, incident response, cryptography, supply chain) as blocking."
		};
		if (r.residualProvisional) {
			f.push({ title: "Residual risk is provisional - based on inherent risk only", detail: "None of the security-domain controls have been answered yet, so this can't yet be tempered by the third party's actual control maturity. On inherent risk alone: " + (actionText[r.inherent.tier] || ""), severity: r.inherent.tier === "Critical" || r.inherent.tier === "High" ? "high" : "medium" });
		} else if (actionText[r.residual]) {
			f.push({ title: "Residual risk: " + r.residual, detail: actionText[r.residual], severity: (r.residual === "Critical" || r.residual === "High") ? "high" : (r.residual === "Medium" ? "medium" : "low") });
		}

		if (!r.residualProvisional && r.answeredControls < r.totalControls) {
			f.push({ title: "Assessment is partially complete", detail: "You've answered " + r.answeredControls + " of " + r.totalControls + " applicable controls across the visible domains. Treat the residual rating as provisional until the rest are answered.", severity: "low" });
		}

		var priorityNotInPlace = r.allGaps.filter(function (g) { return g.status === "Not in place" && g.weight >= 1.25; });
		priorityNotInPlace.slice(0, 8).forEach(function (g) {
			f.push({ title: g.domainTitle + " - " + g.label, detail: "Marked not in place, in a domain this tool treats as higher priority (identity & access, incident response, cryptography, or supply chain). " + (g.note ? ("Noted: " + g.note) : "Ask for a remediation plan and timeline before relying on this control."), severity: "high" });
		});
		if (priorityNotInPlace.length > 8) {
			f.push({ title: (priorityNotInPlace.length - 8) + " more priority-domain gaps not shown here", detail: "See the full gap list below for every control marked partially or not in place.", severity: "medium" });
		}

		var priorityPartial = r.allGaps.filter(function (g) { return g.status === "Partially in place" && g.weight >= 1.25; });
		if (priorityPartial.length) {
			f.push({ title: priorityPartial.length + " priority-domain control" + (priorityPartial.length === 1 ? "" : "s") + " only partially in place", detail: "In identity & access, incident response, cryptography, or supply chain - not a full gap, but worth confirming the compensating control actually covers the risk. See the gap list below for each one.", severity: "medium" });
		}

		var otherGaps = r.allGaps.filter(function (g) { return g.weight < 1.25 && g.status !== "Fully in place"; });
		if (otherGaps.length) {
			f.push({ title: otherGaps.length + " additional control" + (otherGaps.length === 1 ? "" : "s") + " outside the priority domains " + (otherGaps.length === 1 ? "is" : "are") + " not fully in place", detail: "See the gap list below for the detail on each.", severity: "low" });
		}

		if (a.involvesAI === "Yes" && r.aiAnswered === 0) {
			f.push({ title: "AI/ML supplement not answered", detail: "This engagement was flagged as involving an AI or machine-learning system, but none of the AI-specific questions were answered. The general security domains don't cover model-attack resistance or AI-specific data handling - go back and complete them.", severity: "medium" });
		}
		return f;
	}

	/* =================================================================
	 *  Generic step-based engine
	 * ================================================================= */
	var MODULES = {
		privacy: { id: "privacy", label: "Privacy Assessment", steps: PRIVACY_STEPS, compute: privacyResult,
			intro: "Screen a process end to end: what data, whose, for what purposes, on what lawful basis, with what retention, who it is shared with and where it goes \u2014 then get a risk level and whether a full DPIA is needed. If it is, it hands straight over." },
		dpia: { id: "dpia", label: "Full DPIA", steps: DPIA_STEPS, compute: dpiaResult,
			intro: "The full assessment that follows when the Privacy Assessment says a DPIA is needed: necessity and proportionality, individual rights, transfers, and a risk assessment of the three feared events plotted on a severity × likelihood matrix." },
		lia: { id: "lia", label: "Legitimate Interest Test", steps: LIA_STEPS, compute: liaResult,
			intro: "The three-part test for relying on legitimate interests: is the interest legitimate, is the processing necessary for it, and do the individual\u2019s interests override it? Weighs both sides and shows the reasoning." },
		ai: { id: "ai", label: "AI Risk Assessment", steps: AI_STEPS, compute: aiResult,
			intro: "An EU AI Act-aligned risk assessment: register the AI system, screen it for prohibited/high-risk status, and check autonomy, data, and governance controls." },
		incident: { id: "incident", label: "Incident & Breach Severity", steps: INCIDENT_STEPS, compute: incidentResult,
			intro: "Record a privacy incident and, where it qualifies as a personal data breach, score its severity using the published ENISA method - SE = (DPC × EI) + CB - with an analysis of what drives the score and what would change it." },
		tpsa: { id: "tpsa", label: "Third-Party Security Assessment", steps: TPSA_STEPS, compute: tpsaResult,
			intro: "A detailed vendor security questionnaire across governance, people, assets, development, access, operations, cryptography, incident response, physical security, continuity and compliance - plus an AI/ML supplement - scored as inherent risk tempered by control maturity, with a full list of gaps to close." }
	};

	var state = { moduleId: null, stepIndex: 0, answers: {} };
	// Set right after a JSON restore, read once by renderLanding and cleared -
	// carries the outcome message across the renderLanding() rebuild it triggers.
	var importStatus = null;

	function history() {
		try { return JSON.parse(localStorage.getItem("paa-history") || "[]"); } catch (e) { return []; }
	}
	function saveHistory(entry) {
		try {
			var h = history();
			h.unshift(entry);
			localStorage.setItem("paa-history", JSON.stringify(h.slice(0, 20)));
		} catch (e) { /* ignore */ }
	}

	// Merges restored entries with whatever is already saved on this device,
	// de-duplicating on module + timestamp (the pair a legitimate re-import of
	// the same export would repeat), newest first, capped at the same 20.
	function mergeHistoryEntries(existing, imported) {
		var byKey = {};
		var order = [];
		existing.concat(imported).forEach(function (h) {
			if (!h || typeof h !== "object" || !h.moduleId || !h.date) return;
			var key = h.moduleId + "|" + h.date;
			if (!byKey[key]) order.push(key);
			byKey[key] = h;
		});
		var merged = order.map(function (k) { return byKey[k]; });
		merged.sort(function (x, y) { return new Date(y.date).getTime() - new Date(x.date).getTime(); });
		return merged.slice(0, 20);
	}

	// Reads a previously-downloaded "Download all (JSON)" export back in,
	// merging it into this browser's saved history - the way history survives
	// a browser change, a cleared profile, or moving to a new device.
	function importHistoryFile(file, done) {
		if (!file) { done("No file selected", 0); return; }
		var reader = new FileReader();
		reader.onload = function () {
			var count = 0;
			try {
				var data = JSON.parse(String(reader.result));
				if (!Array.isArray(data)) throw new Error("that file doesn't look like a Privacy & AI Assessment export");
				var valid = data.filter(function (h) { return h && typeof h === "object" && h.moduleId && MODULES[h.moduleId] && h.date; });
				if (!valid.length) throw new Error("no valid assessments were found in that file");
				count = valid.length;
				var merged = mergeHistoryEntries(history(), valid);
				localStorage.setItem("paa-history", JSON.stringify(merged));
			} catch (e) {
				done((e && e.message) || "could not read that file", 0);
				return;
			}
			done(null, count);
		};
		reader.onerror = function () { done("could not read that file", 0); };
		reader.readAsText(file);
	}

	function triggerDownload(content, mime, filename) {
		var blob = new Blob([content], { type: mime });
		var url = URL.createObjectURL(blob);
		var a = el("a", { href: url, download: filename });
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
	}

	// A short, filesystem-safe stub for filenames: lowercase, non-alphanumerics
	// collapsed to a single hyphen, capped so a long project name doesn't
	// produce an unwieldy filename.
	function slugify(s) {
		return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "assessment";
	}

	// Both the "download everything" buttons on the overview and the
	// "download my answers" button at the end of a single assessment call
	// through here - entries defaults to the full saved history, but a
	// single just-finished assessment (not yet necessarily in localStorage
	// history, e.g. if it couldn't be saved) can be passed directly so the
	// download always reflects exactly what's on screen.
	function downloadEntriesJSON(entries, filenameBase) {
		triggerDownload(JSON.stringify(entries, null, 2), "application/json", filenameBase + "-" + new Date().toISOString().slice(0, 10) + ".json");
	}

	function downloadHistoryJSON() {
		downloadEntriesJSON(history(), "privacy-ai-assessments");
	}

	// Per-module label for every question/note id. Privacy and AI each have
	// their own "name"/"description" questions with different wording, so
	// labels are kept per moduleId rather than merged into one map (a flat
	// merge would let one module's label silently overwrite the other's).
	function fieldLabelsByModule() {
		var byModule = {};
		Object.keys(MODULES).forEach(function (moduleId) {
			byModule[moduleId] = {};
			MODULES[moduleId].steps.forEach(function (step) {
				step.questions.forEach(function (q) {
					byModule[moduleId][q.id] = q.label;
					if (q.note) {
						byModule[moduleId][q.id + "Note"] = typeof q.note.label === "string" ? q.note.label : (q.label + " - detail");
					}
				});
			});
		});
		return byModule;
	}

	function csvCell(v) {
		if (v === undefined || v === null) return "";
		if (Array.isArray(v)) v = v.join("; ");
		v = String(v);
		if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
		return v;
	}

	function downloadEntriesCSV(hist, filenameBase) {
		if (!hist.length) return;
		var byModule = fieldLabelsByModule();

		// "name" is already covered by the leading "Name" column, so it's
		// dropped from the dynamic answer columns. Any other id whose label
		// actually differs between modules (currently just "description")
		// gets a module-scoped column so the two questions never collide;
		// ids that mean the same thing in both modules share one column.
		function labelFor(moduleId, id) { return (byModule[moduleId] || {})[id]; }
		function colKeyFor(moduleId, id) {
			// Collides when two or more modules use this id with different wording.
			var labels = [];
			Object.keys(byModule).forEach(function (m) {
				var l = byModule[m][id];
				if (l && labels.indexOf(l) === -1) labels.push(l);
			});
			return labels.length > 1 ? (id + "::" + moduleId) : id;
		}

		var keyOrder = []; // ordered list of {col, moduleId, id}
		var seenCols = {};
		hist.forEach(function (h) {
			Object.keys(h.answers || {}).forEach(function (id) {
				if (id === "name") return;
				var col = colKeyFor(h.moduleId, id);
				if (!seenCols[col]) {
					seenCols[col] = true;
					keyOrder.push({ col: col, moduleId: h.moduleId, id: id });
				}
			});
		});

		var header = ["Name", "Module", "Date", "Result"]
			.concat(keyOrder.map(function (e) {
				var label = labelFor(e.moduleId, e.id) || e.id;
				return e.col.indexOf("::") !== -1 ? (MODULES[e.moduleId].label + ": " + label) : label;
			}))
			.concat(["Risk factors"]);
		var rows = [header];

		hist.forEach(function (h) {
			var row = [
				h.name || "",
				MODULES[h.moduleId] ? MODULES[h.moduleId].label : h.moduleId,
				new Date(h.date).toLocaleString(),
				h.resultLabel || ""
			];
			keyOrder.forEach(function (e) {
				row.push(e.moduleId === h.moduleId ? (h.answers || {})[e.id] : "");
			});
			var factors = ((h.result && h.result.factors) || []).map(function (f) { return f.title + ": " + f.detail; }).join(" | ");
			row.push(factors);
			rows.push(row);
		});

		var csv = "﻿" + rows.map(function (r) { return r.map(csvCell).join(","); }).join("\r\n");
		triggerDownload(csv, "text/csv;charset=utf-8;", filenameBase + "-" + new Date().toISOString().slice(0, 10) + ".csv");
	}

	function downloadHistoryCSV() {
		downloadEntriesCSV(history(), "privacy-ai-assessments");
	}

	var root = document.getElementById("paa-app");

	/* Every view change rebuilds #paa-app from scratch. Without this the page
	 * keeps whatever scroll offset it had, so stepping from a long question set
	 * to a short one drops the reader below the tool entirely, down in the
	 * advice sections at the foot of the page. Put them at the top of whatever
	 * just rendered, clear of the sticky site header. */
	function scrollToTool() {
		if (!root) return;
		var gap = 14;
		var header = document.getElementById("header");
		if (header && window.getComputedStyle(header).position === "sticky") {
			gap += header.getBoundingClientRect().height;
		}
		var y = root.getBoundingClientRect().top + window.pageYOffset - gap;
		if (y < 0) y = 0;
		var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		try {
			window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
		} catch (e) {
			window.scrollTo(0, y);
		}
	}

	/* Returning to the landing page from inside a tool should also put the
	 * reader at the top of it. The very first render on page load must not, or
	 * arriving at the page would scroll past its introduction. */
	function goLanding() {
		renderLanding();
		scrollToTool();
	}

	function el(tag, attrs, children) {
		var e = document.createElement(tag);
		attrs = attrs || {};
		for (var k in attrs) {
			if (k === "class") e.className = attrs[k];
			else if (k === "html") e.innerHTML = attrs[k];
			else e.setAttribute(k, attrs[k]);
		}
		(children || []).forEach(function (c) {
			if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
		});
		return e;
	}

	// Escape hatch shown at the top of every module's questions and results:
	// a way back to the overview plus one-click links to every other tool,
	// for whoever started the wrong assessment and wants a different one
	// without losing their place entirely.
	function renderModuleSwitchHeader(mod) {
		var wrap = el("div", { class: "paa-module-switch" });

		var back = el("button", { class: "button alt" }, ["← Back to overview"]);
		back.addEventListener("click", goLanding);
		wrap.appendChild(el("div", { class: "paa-nav" }, [back]));

		wrap.appendChild(el("h2", { class: "paa-module-title" }, [mod.label]));

		var switchTools = el("div", { class: "paa-switch-tools" }, [
			el("span", { class: "paa-switch-label" }, ["Picked the wrong one? Switch to:"])
		]);
		Object.keys(MODULES).forEach(function (id) {
			if (id === mod.id) return;
			var other = MODULES[id];
			var btn = el("button", { class: "button" }, [other.label]);
			btn.addEventListener("click", function () { startModule(id); });
			switchTools.appendChild(btn);
		});
		wrap.appendChild(switchTools);

		return wrap;
	}

	function visibleSteps(mod) {
		return mod.steps.filter(function (s) { return !s.visibleIf || s.visibleIf(state.answers); });
	}
	function visibleQuestions(step) {
		return step.questions.filter(function (q) { return !q.visibleIf || q.visibleIf(state.answers); });
	}

	function renderLanding() {
		root.innerHTML = "";
		root.className = "";
		var grid = el("div", { class: "paa-grid" });
		Object.keys(MODULES).forEach(function (id) {
			var mod = MODULES[id];
			var card = el("div", { class: "paa-card" }, [
				el("h3", {}, [mod.label]),
				el("p", {}, [mod.intro]),
				el("button", { class: "button paa-start", "data-module": id }, ["Start assessment"])
			]);
			grid.appendChild(card);
		});
		var restoreInput = el("input", { type: "file", accept: "application/json,.json", class: "paa-restore-input" });
		restoreInput.style.display = "none";
		var restoreBtn = el("button", { type: "button", class: "button alt paa-restore-btn" }, ["Restore from file (JSON)"]);
		root.appendChild(el("div", { class: "paa-intro" }, [
			el("p", {}, ["Everything runs in your browser only - nothing is submitted anywhere. Past assessments on this device are listed below so you can track them over time."]),
			el("div", { class: "paa-restore-row" }, [
				restoreBtn, restoreInput,
				el("span", { class: "paa-help" }, ["Switched browsers, cleared your data, or moved to a new device? Restore a previously downloaded JSON export here - it merges with anything already saved on this device."])
			])
		]));
		root.appendChild(grid);

		if (importStatus) {
			root.appendChild(el("p", { class: "paa-import-status" + (importStatus.ok ? " ok" : " error") }, [importStatus.message]));
			importStatus = null;
		}

		var hist = history();
		if (hist.length) {
			var histHead = el("div", { class: "paa-hist-head" }, [
				el("h3", {}, ["Recent assessments"]),
				el("div", { class: "paa-download-group" }, [
					el("button", { class: "button alt paa-download-json" }, ["Download all (JSON)"]),
					el("button", { class: "button alt paa-download-csv" }, ["Download all (CSV)"])
				])
			]);
			root.appendChild(histHead);
			root.appendChild(el("p", { class: "paa-help" }, ["Includes every question, answer, and comment you entered for each saved assessment - kept only in this browser, in full, until you clear it."]));
			var table = el("table", { class: "paa-table" });
			hist.forEach(function (h) {
				table.appendChild(el("tr", {}, [
					el("td", {}, [h.name || "(untitled)"]),
					el("td", {}, [MODULES[h.moduleId] ? MODULES[h.moduleId].label : h.moduleId]),
					el("td", {}, [new Date(h.date).toLocaleDateString()]),
					el("td", {}, [h.resultLabel])
				]));
			});
			root.appendChild(table);
		}

		root.querySelectorAll(".paa-start").forEach(function (btn) {
			btn.addEventListener("click", function () { startModule(btn.getAttribute("data-module")); });
		});
		var dlJsonBtn = root.querySelector(".paa-download-json");
		if (dlJsonBtn) dlJsonBtn.addEventListener("click", downloadHistoryJSON);
		var dlCsvBtn = root.querySelector(".paa-download-csv");
		if (dlCsvBtn) dlCsvBtn.addEventListener("click", downloadHistoryCSV);

		restoreBtn.addEventListener("click", function () { restoreInput.click(); });
		restoreInput.addEventListener("change", function () {
			var file = restoreInput.files && restoreInput.files[0];
			if (!file) return;
			importHistoryFile(file, function (error, count) {
				importStatus = error
					? { ok: false, message: "Could not restore that file: " + error }
					: { ok: true, message: "Restored " + count + " assessment" + (count === 1 ? "" : "s") + " from the file." };
				goLanding();
			});
		});
	}

	function startModule(id, seed) {
		state.moduleId = id;
		state.stepIndex = 0;
		state.answers = seed || {};
		renderStep();
		scrollToTool();
	}

	/* Carries what the Privacy Assessment already established into the full DPIA, so
	 * the assessor doesn't retype it - including pre-ticking the Art. 35(3)
	 * criteria those answers already imply. */
	function seedLiaFromPrivacyAssessment(a) {
		var seed = {
			name: a.name || "",
			specialCategories: computeSpecialCategory(a) ? "Yes" : "No",
			dataNature: (a.dataCategories || []).join("; "),
			notice: a.privacyNotice === "Yes" ? "Yes" : (a.privacyNotice === "No" ? "No" : ""),
			noticeNote: a.privacyNoticeNote || ""
		};
		var purposes = (a.purposes || []).filter(function (p) { return p !== "Other"; });
		if (a.purposesNote) purposes = purposes.concat([a.purposesNote]);
		if (purposes.length) seed.purpose = purposes.join("; ");
		// Employees and candidates carry an inherent imbalance, which the
		// Privacy Assessment already asked about.
		var vuln = a.vulnerableTypes || [];
		if (vuln.indexOf("Employees and other staff members") !== -1) {
			seed.connection = "Employee";
			seed.imbalance = "Yes";
		}
		if (a.rightsObject === "No") seed.objection = "No";
		return seed;
	}

	function seedDpiaFromPrivacyAssessment(a) {
		var seed = {
			name: a.name || "",
			description: a.description || "",
			changeType: a.changeType || "",
			goLiveDate: a.goLiveDate || "",
			countries: (a.countries || []).slice(),
			countriesNote: a.countriesNote || "",
			businessArea: a.area || "",
			businessAreaNote: a.areaNote || "",
			// The Privacy Assessment asks these in the same vocabulary, so they
			// transfer as answers rather than being re-derived.
			dpiaTriggers: (a.dpiaTriggers || []).slice(),
			legalBasis: (a.legalGrounds || []).slice(),
			specialCategory: computeSpecialCategory(a) ? "Yes" : "No",
			retentionDefined: a.retentionDefined || "",
			retentionDefinedNote: a.retentionDefinedNote || a.purposeRetention || "",
			noticeInPlace: a.privacyNotice === "Yes" ? "Yes" : (a.privacyNotice === "No" ? "No" : ""),
			noticeInPlaceNote: a.privacyNoticeNote || "",
			assets: a.systemsAssets || "",
			processorsInvolved: a.processorsInvolved || (a.thirdPartySharing === "Yes" ? "Yes" : ""),
			processorsInvolvedNote: a.processorsInvolvedNote || a.thirdPartySharingNote || "",
			transfersOutside: (a.transfersOutside === "Yes" || a.transfersOutside === "No" || a.transfersOutside === "Not sure") ? a.transfersOutside : "",
			controlsInPlace: (a.controlsInPlace || []).slice()
		};

		// Only the first Art. 9 condition carries over - the DPIA asks for one.
		if ((a.specialCategoryGrounds || []).length) seed.art9Condition = a.specialCategoryGrounds[0];

		// Map the Privacy Assessment's safeguard list onto the DPIA's shorter one.
		var SAFEGUARD_MAP = {
			"Adequacy decision": "Adequacy decision",
			"Standard contractual clauses (controller to processor)": "Standard contractual clauses",
			"Standard contractual clauses (controller to controller)": "Standard contractual clauses",
			"Binding corporate rules": "Binding corporate rules",
			"Derogation for a specific situation": "Derogation for a specific situation",
			"None identified yet": "None identified yet"
		};
		var mechanisms = [];
		(a.transferSafeguards || []).forEach(function (s) {
			var m = SAFEGUARD_MAP[s];
			if (m && mechanisms.indexOf(m) === -1) mechanisms.push(m);
		});
		if (mechanisms.length) seed.transferMechanism = mechanisms;

		var purposeText = a.purposeRetention || "";
		var purposes = (a.purposes || []).filter(function (p) { return p !== "Other"; });
		if (a.purposesNote) purposes = purposes.concat([a.purposesNote]);
		if (purposes.length) {
			purposeText = purposes.join("; ") + (purposeText ? "\n\n" + purposeText : "");
		}
		if (purposeText) seed.purposes = purposeText;

		return seed;
	}

	/* Optional free-text elaboration shown under a question once it's answered
	 * in a way that makes detail useful (e.g. "how long" once retention is
	 * confirmed, "which parties" once third-party sharing is confirmed).
	 * q.note = { label: string|fn(value), placeholder?: string, visibleIf?: fn(value, answers) } */
	function noteFieldFor(q) {
		var note = q.note;
		if (!note) return null;
		var value = state.answers[q.id];
		var visible = note.visibleIf ? note.visibleIf(value, state.answers) : !!value;
		if (!visible) return null;
		var key = q.id + "Note";
		var label = typeof note.label === "function" ? note.label(value) : note.label;
		var noteWrap = el("div", { class: "paa-note" });
		noteWrap.appendChild(el("p", { class: "paa-note-label" }, [label]));
		var ta = el("textarea", { placeholder: note.placeholder || "Optional - add detail" });
		ta.value = state.answers[key] || "";
		ta.addEventListener("input", function () { state.answers[key] = ta.value; });
		noteWrap.appendChild(ta);
		return noteWrap;
	}

	function fieldFor(q, onAnswerChange) {
		var wrap = el("div", { class: "paa-field", "data-qid": q.id });
		wrap.appendChild(el("p", {}, [q.label]));

		if (q.type === "text") {
			var input = el("input", { type: "text" });
			input.value = state.answers[q.id] || "";
			input.addEventListener("input", function () { state.answers[q.id] = input.value; });
			wrap.appendChild(input);
		} else if (q.type === "date") {
			// Native date input so the browser supplies its own calendar picker.
			var dateInput = el("input", { type: "date" });
			dateInput.value = state.answers[q.id] || "";
			dateInput.addEventListener("input", function () { state.answers[q.id] = dateInput.value; });
			wrap.appendChild(dateInput);
		} else if (q.type === "textarea") {
			var ta = el("textarea", q.placeholder ? { placeholder: q.placeholder } : {});
			ta.value = state.answers[q.id] || "";
			ta.addEventListener("input", function () { state.answers[q.id] = ta.value; });
			wrap.appendChild(ta);
		} else if (q.type === "select") {
			var sel = el("select", {});
			sel.appendChild(el("option", { value: "" }, ["Select…"]));
			q.options.forEach(function (opt) {
				var o = el("option", { value: opt }, [opt]);
				if (state.answers[q.id] === opt) o.setAttribute("selected", "selected");
				sel.appendChild(o);
			});
			sel.addEventListener("change", function () {
				state.answers[q.id] = sel.value;
				if (onAnswerChange) onAnswerChange();
			});
			wrap.appendChild(sel);
		} else if (q.type === "yesno") {
			var group = el("div", { class: "paa-scale" });
			["Yes", "No"].forEach(function (opt) {
				var selected = state.answers[q.id] === opt;
				var btn = el("button", { type: "button", class: "paa-scale-opt" + (selected ? " is-selected" : "") }, [opt]);
				btn.addEventListener("click", function () {
					state.answers[q.id] = opt;
					group.querySelectorAll(".paa-scale-opt").forEach(function (b) { b.classList.remove("is-selected"); });
					btn.classList.add("is-selected");
					if (onAnswerChange) onAnswerChange();
				});
				group.appendChild(btn);
			});
			wrap.appendChild(group);
		} else if (q.type === "multiselect") {
			// Custom checkbox rendering: the site's global stylesheet expects
			// "input + label" siblings with a Font-Awesome check icon, which
			// doesn't apply to our "label wraps input" markup and leaves the
			// native checkbox invisible (0 opacity, no visible replacement).
			// So we hide the native input (kept for accessibility/semantics)
			// and draw our own checkbox glyph that reflects state on rebuild.
			// A long option list (e.g. the country/region picker) gets a filter
			// box and a scrollable, capped-height list so the page doesn't turn
			// into one giant checklist - the filter only hides/shows labels,
			// it never touches the answer array.
			var isLong = q.options.length > 15;
			var list = el("div", { class: "paa-checklist" + (isLong ? " paa-checklist-scroll" : "") });
			var current = state.answers[q.id] || [];
			if (isLong) {
				var filter = el("input", { type: "text", class: "paa-checklist-filter", placeholder: "Filter " + q.options.length + " options…" });
				filter.addEventListener("input", function () {
					var term = filter.value.trim().toLowerCase();
					list.querySelectorAll("label").forEach(function (lbl) {
						var text = lbl.textContent.toLowerCase();
						lbl.style.display = (!term || text.indexOf(term) !== -1) ? "" : "none";
					});
				});
				wrap.appendChild(filter);
			}
			q.options.forEach(function (opt) {
				var checked = current.indexOf(opt) !== -1;
				var cb = el("input", { type: "checkbox", class: "paa-sr-checkbox" });
				cb.checked = checked;
				cb.addEventListener("change", function () {
					var arr = state.answers[q.id] || [];
					if (cb.checked) { if (arr.indexOf(opt) === -1) arr.push(opt); }
					else { arr = arr.filter(function (x) { return x !== opt; }); }
					state.answers[q.id] = arr;
					box.className = "paa-check-box" + (cb.checked ? " is-selected" : "");
					box.textContent = cb.checked ? "✓" : "";
					label.className = cb.checked ? "is-selected" : "";
					if (onAnswerChange) onAnswerChange();
				});
				var box = el("span", { class: "paa-check-box" + (checked ? " is-selected" : "") }, [checked ? "✓" : ""]);
				var label = el("label", { class: checked ? "is-selected" : "" }, [cb, box, document.createTextNode(opt)]);
				list.appendChild(label);
			});
			wrap.appendChild(list);
		}

		var noteEl = noteFieldFor(q);
		if (noteEl) wrap.appendChild(noteEl);

		return wrap;
	}

	/* The step rail: every step of the current module listed by name, so an
	 * assessor can jump straight to one instead of pressing Back or Next through
	 * everything in between. Built from visibleSteps, so a step an earlier answer
	 * has not opened up yet never appears. Nothing has to be answered to move on,
	 * so every step listed is reachable in either direction. */
	function buildStepRail(steps) {
		var rail = el("nav", { class: "paa-rail", "aria-label": "Assessment steps" });
		rail.appendChild(el("p", { class: "paa-rail-head" }, ["Steps"]));

		var list = el("ol", { class: "paa-rail-list" });
		steps.forEach(function (s, i) {
			var cls = "paa-rail-item";
			if (i === state.stepIndex) cls += " is-current";
			else if (i < state.stepIndex) cls += " is-done";

			var btn = el("button", {
				type: "button",
				class: cls,
				title: "Step " + (i + 1) + ": " + s.title,
				"aria-label": "Step " + (i + 1) + ": " + s.title
			}, [
				el("span", { class: "paa-rail-num" }, [String(i + 1)]),
				el("span", { class: "paa-rail-title" }, [s.title])
			]);

			if (i === state.stepIndex) {
				btn.setAttribute("aria-current", "step");
			} else {
				btn.addEventListener("click", function () {
					state.stepIndex = i;
					renderStep();
					scrollToTool();
				});
			}

			list.appendChild(el("li", {}, [btn]));
		});

		rail.appendChild(list);
		return rail;
	}

	function renderStep() {
		var mod = MODULES[state.moduleId];
		var steps = visibleSteps(mod);
		if (state.stepIndex >= steps.length) { finishModule(); return; }
		var step = steps[state.stepIndex];

		root.innerHTML = "";
		/* Widens the container so the rail sits beside the questions rather than
		 * eating into their reading measure. Cleared again by the landing page
		 * and the results, which have no rail and read better narrow. */
		root.className = "paa-wide";
		root.appendChild(renderModuleSwitchHeader(mod));

		/* Two columns on a wide screen: a rail down the left listing every step by
		 * name, and the current step on the right. Below the layout breakpoint the
		 * same rail turns into a compact numbered strip above the questions, so it
		 * costs almost no height on a phone. */
		var layout = el("div", { class: "paa-layout" });
		var main = el("div", { class: "paa-main" });
		var railEl = steps.length > 1 ? buildStepRail(steps) : null;
		if (railEl) layout.appendChild(railEl);
		layout.appendChild(main);
		root.appendChild(layout);

		var bar = el("div", { class: "paa-progress-bar" });
		main.appendChild(el("div", { class: "paa-progress" }, [bar]));
		// Some steps only appear once an earlier answer opens them up, so the
		// total is "up to N" until every step in the module is in play -
		// otherwise the count jumps (e.g. "1 of 2" then "3 of 11").
		// Some steps only appear once an earlier answer opens them up, so the
		// total is "up to N" until every step in the module is in play -
		// otherwise the count jumps (e.g. "1 of 2" then "3 of 11").
		function stepCountLabel() {
			var total = steps.length === mod.steps.length ? String(steps.length) : ("up to " + mod.steps.length);
			return "Step " + (state.stepIndex + 1) + " of " + total + " - " + mod.label;
		}
		function progressWidth() {
			return Math.round((state.stepIndex / steps.length) * 100) + "%";
		}
		function nextLabel() {
			return state.stepIndex === steps.length - 1 ? "See results" : "Next";
		}

		bar.style.width = progressWidth();
		var stepLabel = el("p", { class: "paa-step" }, [stepCountLabel()]);
		main.appendChild(stepLabel);
		main.appendChild(el("h3", {}, [step.title]));
		if (step.intro) main.appendChild(el("p", { class: "paa-step-intro" }, [step.intro]));

		// Where a step leans on someone else's published method, link out to it
		// so the assessor can read the source rather than take this tool's word
		// for it. step.sources is [{ label, url }].
		if (step.sources && step.sources.length) {
			var srcP = el("p", { class: "paa-step-sources" }, ["Read the source: "]);
			step.sources.forEach(function (src, i) {
				if (i) srcP.appendChild(document.createTextNode(" | "));
				srcP.appendChild(el("a", {
					href: src.url, target: "_blank", rel: "noopener noreferrer"
				}, [src.label]));
			});
			main.appendChild(srcP);
		}

		var qlist = el("div", { class: "paa-questions" });
		/* Rebuilding the list is what makes conditional questions and their note
		 * boxes appear and disappear, but it also throws away the filter text and
		 * scroll position of a long picker such as the country list. Carry those
		 * across, keyed by question id, so ticking a country does not send the
		 * reader back to the top of 200 options with the filter cleared. */
		function pickerState() {
			var keep = {};
			qlist.querySelectorAll(".paa-field[data-qid]").forEach(function (f) {
				var flt = f.querySelector(".paa-checklist-filter");
				var lst = f.querySelector(".paa-checklist");
				if (flt || lst) {
					keep[f.getAttribute("data-qid")] = {
						filter: flt ? flt.value : "",
						scroll: lst ? lst.scrollTop : 0
					};
				}
			});
			return keep;
		}

		function restorePickerState(keep) {
			qlist.querySelectorAll(".paa-field[data-qid]").forEach(function (f) {
				var saved = keep[f.getAttribute("data-qid")];
				if (!saved) return;

				var flt = f.querySelector(".paa-checklist-filter");
				if (flt && saved.filter) {
					flt.value = saved.filter;
					var term = saved.filter.trim().toLowerCase();
					f.querySelectorAll(".paa-checklist label").forEach(function (lbl) {
						lbl.style.display = (!term || lbl.textContent.toLowerCase().indexOf(term) !== -1) ? "" : "none";
					});
				}

				var lst = f.querySelector(".paa-checklist");
				if (lst) lst.scrollTop = saved.scroll;
			});
		}

		function refreshQuestions() {
			var keep = pickerState();
			qlist.innerHTML = "";
			visibleQuestions(step).forEach(function (q) {
				qlist.appendChild(el("div", { class: "paa-question" }, [fieldFor(q, onAnswerChanged)]));
			});
			restorePickerState(keep);
		}

		/* An answer can open up later steps or close them down again, so the step
		 * count, the progress bar, the rail and the Next button all have to be
		 * recomputed when one changes. Without this, answering "yes" on a screening
		 * step left the button reading "See results" even though that answer had
		 * just added nine more steps, and the rail still listed only the two steps
		 * that were in play before. */
		function refreshChrome() {
			steps = visibleSteps(mod);

			var at = steps.indexOf(step);
			if (at === -1) {
				// This step is itself no longer in play, so there is nothing to
				// patch up: rebuild from whatever now sits at this position.
				if (state.stepIndex >= steps.length) state.stepIndex = Math.max(0, steps.length - 1);
				renderStep();
				return;
			}
			state.stepIndex = at;

			bar.style.width = progressWidth();
			stepLabel.textContent = stepCountLabel();
			next.textContent = nextLabel();

			var fresh = steps.length > 1 ? buildStepRail(steps) : null;
			if (railEl && fresh) { layout.replaceChild(fresh, railEl); railEl = fresh; }
			else if (railEl && !fresh) { layout.removeChild(railEl); railEl = null; }
			else if (!railEl && fresh) { layout.insertBefore(fresh, main); railEl = fresh; }
		}

		function onAnswerChanged() {
			refreshQuestions();
			refreshChrome();
		}

		refreshQuestions();
		main.appendChild(qlist);

		var nav = el("div", { class: "paa-nav actions" });
		if (state.stepIndex > 0) {
			var back = el("button", { class: "button alt" }, ["Back"]);
			back.addEventListener("click", function () { state.stepIndex--; renderStep(); scrollToTool(); });
			nav.appendChild(back);
		} else {
			var cancel = el("button", { class: "button alt" }, ["Cancel"]);
			cancel.addEventListener("click", goLanding);
			nav.appendChild(cancel);
		}
		var next = el("button", { class: "button" }, [nextLabel()]);
		next.addEventListener("click", function () {
			state.stepIndex++;
			renderStep();
			scrollToTool();
		});
		nav.appendChild(next);
		main.appendChild(nav);
	}

	function badgeClass(level) {
		if (level === "Prohibited") return "paa-badge-prohibited";
		if (level === "High") return "paa-badge-high";
		if (level === "Medium" || level === "Limited") return "paa-badge-medium";
		if (level === "Not Applicable") return "paa-badge-na";
		return "paa-badge-low";
	}

	function renderFactors(factors) {
		if (!factors.length) return el("p", { class: "paa-no-factors" }, ["No specific risk factors identified from your answers."]);
		var list = el("div", {});
		factors.forEach(function (f) {
			list.appendChild(el("div", { class: "paa-factor sev-" + f.severity }, [
				el("p", {}, [el("strong", {}, [f.title + ": "]), f.detail])
			]));
		});
		return list;
	}

	/* Severity band meter: a segmented track (Low / Medium / High / Very High)
	 * with a marker showing where this score lands. Scale runs 0-6, the
	 * theoretical maximum of (DPC 4 x EI 1) + CB 2 (0.5 each for
	 * confidentiality, integrity and availability, plus 0.5 for malicious intent). */
	function renderSeverityMeter(se) {
		var MAX = 6;
		var bands = [
			{ label: "Low", from: 0, to: 2, key: "low" },
			{ label: "Medium", from: 2, to: 3, key: "medium" },
			{ label: "High", from: 3, to: 4, key: "high" },
			{ label: "Very High", from: 4, to: MAX, key: "veryhigh" }
		];
		var track = el("div", { class: "paa-meter-track" });
		bands.forEach(function (b) {
			var seg = el("div", { class: "paa-meter-seg sev-" + b.key, style: "flex-grow:" + (b.to - b.from) });
			seg.appendChild(el("span", { class: "paa-meter-seg-label" }, [b.label]));
			track.appendChild(seg);
		});
		var pct = Math.max(0, Math.min(1, se / MAX)) * 100;
		var marker = el("div", { class: "paa-meter-marker", style: "left:" + pct + "%" });
		marker.appendChild(el("span", { class: "paa-meter-marker-value" }, [fmt(se)]));
		var wrap = el("div", { class: "paa-meter" }, [track, marker]);
		// Ticks sit at their true proportional position, not evenly spaced -
		// the bands are unequal widths (0-2, 2-3, 3-4, 4-6).
		var scale = el("div", { class: "paa-meter-scale" });
		[0, 2, 3, 4, MAX].forEach(function (v) {
			var align = v === 0 ? "left:0" : (v === MAX ? "right:0" : "left:" + ((v / MAX) * 100) + "%;transform:translateX(-50%)");
			scale.appendChild(el("span", { class: "paa-meter-tick", style: align }, [String(v)]));
		});
		return el("div", { class: "paa-meter-wrap" }, [wrap, scale]);
	}

	function statTile(label, value, sub) {
		return el("div", { class: "paa-stat" }, [
			el("div", { class: "paa-stat-label" }, [label]),
			el("div", { class: "paa-stat-value" }, [value]),
			sub ? el("div", { class: "paa-stat-sub" }, [sub]) : null
		]);
	}

	function renderIncidentResult(r) {
		if (r.na) {
			root.appendChild(el("div", { class: "paa-result-head" }, [
				el("span", { class: "paa-badge paa-badge-na" }, ["No breach - not scored"])
			]));
			root.appendChild(el("div", { class: "paa-result-item" }, [renderFactors(r.factors)]));
			return;
		}

		// Hero figure + band
		root.appendChild(el("div", { class: "paa-hero" }, [
			el("div", { class: "paa-hero-figure sev-" + r.band.key }, [fmt(r.se)]),
			el("div", { class: "paa-hero-side" }, [
				el("div", { class: "paa-hero-label" }, ["Severity score (SE)"]),
				el("span", { class: "paa-badge " + badgeClass(r.band.label === "Very High" ? "Prohibited" : r.band.label) }, [r.band.label + " severity"]),
				el("p", { class: "paa-hero-meaning" }, [r.band.meaning])
			])
		]));

		root.appendChild(renderSeverityMeter(r.se));

		// Notification outcome
		var notif = r.band.dpa
			? (r.band.subjects ? "Notify the supervisory authority and the affected individuals" : "Notify the supervisory authority")
			: "No notification indicated by the score";
		root.appendChild(el("div", { class: "paa-callout sev-" + (r.band.dpa ? (r.band.subjects ? "high" : "medium") : "low") }, [
			el("strong", {}, ["Indicated action: "]), notif
		]));

		// Component breakdown + formula
		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["How the score was calculated"]),
			el("div", { class: "paa-stats" }, [
				statTile("Data processing context (DPC)", fmt(r.dpc),
					r.dpcDriver ? ("set by " + r.dpcDriver.name.toLowerCase()) : "no data category selected"),
				statTile("Ease of identification (EI)", fmt(r.ei),
					r.eiDriver ? ("set by " + r.eiDriver.name.toLowerCase()) : "defaulted to the 0.25 floor"),
				statTile("Circumstances of breach (CB)", fmt(r.cb),
					r.cbParts.length ? (r.cbParts.length + (r.cbParts.length === 1 ? " factor" : " factors")) : "no aggravating circumstances")
			]),
			el("p", { class: "paa-formula" }, ["SE = (DPC " + fmt(r.dpc) + " × EI " + fmt(r.ei) + ") + CB " + fmt(r.cb) + " = " + fmt(r.se)])
		]));

		// DPC composition detail
		var detail = [];
		if (r.dpcDriver) {
			detail.push(el("li", {}, [el("strong", {}, [r.dpcDriver.name + " - " + fmt(r.dpcDriver.score) + ": "]), r.dpcDriver.statement]));
		}
		if (r.aggravating) detail.push(el("li", {}, [el("strong", {}, ["Aggravating factors - +" + fmt(r.aggravating * 0.5) + ": "]), r.aggravating + " selected" + (r.dpcCapped ? " (the data processing context is capped at 4.00, so part of this uplift does not change the score)" : "")]));
		if (r.mitigating) detail.push(el("li", {}, [el("strong", {}, ["Mitigating factors - −" + fmt(r.mitigating * 0.5) + ": "]), r.mitigating + " selected"]));
		if (r.eiDriver) detail.push(el("li", {}, [el("strong", {}, ["Ease of identification - " + fmt(r.eiDriver.score) + ": "]), r.eiDriver.statement]));
		r.cbParts.forEach(function (p) {
			detail.push(el("li", {}, [el("strong", {}, [p.name + " - +" + fmt(p.score) + ": "]), p.statement]));
		});
		if (detail.length) {
			var ul = el("ul", { class: "paa-breakdown" });
			detail.forEach(function (li) { ul.appendChild(li); });
			root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["What went into it"]), ul]));
		}

		// Sensitivity: distance to the neighbouring bands
		var sens = [];
		var upper = r.se < 2 ? 2 : (r.se < 3 ? 3 : (r.se < 4 ? 4 : null));
		var lower = r.se >= 4 ? 4 : (r.se >= 3 ? 3 : (r.se >= 2 ? 2 : null));
		if (upper !== null) {
			sens.push("It would take " + fmt(upper - r.se) + " more points to reach the " + severityBand(upper).label + " band.");
		}
		if (lower !== null) {
			var margin = r.se - lower;
			sens.push(margin <= 0.5
				? ("It sits only " + fmt(margin) + " above the " + severityBand(lower).label + " threshold, so a small change in any component could move it down a band.")
				: ("It is " + fmt(margin) + " clear of the " + severityBand(lower).label + " threshold, so the band is not borderline."));
		}
		if (r.ei < 1 && r.dpc > 0) {
			sens.push("If the individuals had been directly identifiable (EI 1 instead of " + fmt(r.ei) + "), the score would be " + fmt((r.dpc * 1) + r.cb) + ".");
		}
		if (r.cb > 0) {
			sens.push("If none of the aggravating circumstances applied (CB 0 instead of " + fmt(r.cb) + "), the score would be " + fmt(r.dpc * r.ei) + ".");
		}
		if (sens.length) {
			var sl = el("ul", { class: "paa-breakdown" });
			sens.forEach(function (s) { sl.appendChild(el("li", {}, [s])); });
			root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["How sensitive the result is"]), sl]));
		}

		renderCrossCheck(r);

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Analysis & next steps"]),
			renderFactors(r.factors)
		]));

		root.appendChild(el("p", { class: "paa-help" }, ["Scoring follows the published ENISA methodology for assessing the severity of personal data breaches. It is decision support for a trained assessor, not a substitute for legal advice or for your supervisory authority's own guidance - several authorities publish their own criteria and thresholds."]));
	}

	/* Optional cross-check panel: the AEPD volume x type x impact score and/or
	 * the matched EDPB published example, shown only for whichever the
	 * assessor actually answered. Neither changes the ENISA score above -
	 * they are independent published methods shown side by side with it. */
	function renderCrossCheck(r) {
		var hasAepd = r.aepd && r.aepd.scored;
		var hasEdpb = !!r.edpb;
		if (!hasAepd && !hasEdpb) return;

		var body = [];
		if (hasAepd) {
			var a = r.aepd;
			var aepdOutcome = a.notifySubjects ? "Notify the supervisory authority and individuals"
				: (a.notifyAuthority ? "Notify the supervisory authority" : "No notification indicated");
			body.push(el("div", {}, [
				el("p", {}, [el("strong", {}, ["AEPD method (volume × type × impact): "])]),
				el("div", { class: "paa-stats" }, [
					statTile("Volume (V)", String(a.volume)),
					statTile("Type of data (T)", String(a.type)),
					statTile("Impact (I)", String(a.impact)),
					statTile("Score V×T×I", String(a.score), "threshold " + a.threshold + " of 3")
				]),
				el("p", { class: "paa-callout sev-" + (a.notifySubjects ? "high" : (a.notifyAuthority ? "medium" : "low")) }, [
					el("strong", {}, ["Indicated: "]), aepdOutcome
				])
			]));
		}
		if (hasEdpb) {
			var e = r.edpb;
			body.push(el("div", {}, [
				el("p", {}, [
					el("strong", {}, ["EDPB published example: "]), e.label
				]),
				el("p", { class: "paa-callout sev-" + (e.outcome === "high" ? "high" : (e.outcome === "medium" ? "medium" : (e.outcome === "low" ? "low" : "medium"))) }, [
					EDPB_OUTCOME_TEXT[e.outcome]
				]),
				el("p", { class: "paa-help" }, [
					"That is the EDPB's conclusion on its own worked example, summarised here. ",
					el("a", { href: EDPB_SOURCE_URL, target: "_blank", rel: "noopener noreferrer" },
						["Read the case in full in Guidelines 01/2021"]),
					", where each example sets out the facts, the risk assessment and the notification decision."
				])
			]));
		}

		root.appendChild(el("div", { class: "paa-result-item paa-crosscheck" }, [
			el("h4", {}, ["Cross-check against other published methods"]),
			el("p", { class: "paa-help" }, ["The ENISA score above is this tool's primary result. This is shown alongside it, not instead of it."])
		].concat(body)));
	}

	var LEVEL_KEY = { "Low": "low", "Medium": "medium", "High": "high", "Very High": "veryhigh" };

	/* CNIL-style 4x4 risk matrix: likelihood across, severity up.
	 * Each scored feared event is placed in its cell, marked by letter and
	 * named in the legend so identity never depends on colour alone. */
	function renderRiskMatrix(events) {
		var grid = el("div", { class: "paa-matrix" });
		var shortSev = ["Negligible", "Limited", "Significant", "Maximum"];
		var shortLik = ["Negligible", "Limited", "Significant", "Maximum"];

		grid.appendChild(el("div", { class: "paa-matrix-corner" }, [
			el("span", { class: "paa-matrix-axis-y" }, ["Severity"])
		]));
		shortLik.forEach(function (l) {
			grid.appendChild(el("div", { class: "paa-matrix-collabel" }, [l]));
		});

		for (var s = 3; s >= 0; s--) {
			grid.appendChild(el("div", { class: "paa-matrix-rowlabel" }, [shortSev[s]]));
			for (var l = 0; l < 4; l++) {
				var lvl = riskLevelFor(s, l);
				var cell = el("div", { class: "paa-matrix-cell sev-" + LEVEL_KEY[lvl], title: lvl + " risk" });
				// Name the level in every cell so the grid never depends on
				// colour alone to say what a cell means.
				cell.appendChild(el("span", { class: "paa-matrix-lvl" }, [lvl]));
				var dots = el("span", { class: "paa-matrix-dots" });
				events.forEach(function (e) {
					if (e.sevIdx === s && e.likIdx === l) {
						dots.appendChild(el("span", { class: "paa-matrix-dot", title: e.name }, [e.short]));
					}
				});
				cell.appendChild(dots);
				grid.appendChild(cell);
			}
		}

		var legend = el("div", { class: "paa-matrix-legend" });
		events.forEach(function (e) {
			legend.appendChild(el("span", { class: "paa-matrix-legend-item" }, [
				el("span", { class: "paa-matrix-dot" }, [e.short]),
				e.name + (e.level ? " - " + e.level : " - not scored")
			]));
		});

		return el("div", { class: "paa-matrix-wrap" }, [
			grid,
			el("p", { class: "paa-matrix-axis-x" }, ["Likelihood"]),
			legend
		]);
	}

	/* The balancing test is shown as two columns rather than a single number:
	 * the weighing is a judgement, and the assessor needs to see both sides
	 * to write the conclusion the record actually rests on. */
	function renderLiaResult(r) {
		var badgeMap = { low: "Low", medium: "Medium", high: "High", veryhigh: "Prohibited" };
		root.appendChild(el("div", { class: "paa-result-head" }, [
			el("span", { class: "paa-badge " + badgeClass(badgeMap[r.verdictKey]) }, [r.verdict])
		]));
		root.appendChild(el("p", { class: "paa-hero-meaning" }, [r.verdictDetail]));

		var tests = el("div", { class: "paa-stats" }, [
			statTile("Purpose test", r.purposeOk ? "Met" : "Not met", r.purposeOk ? "an interest is articulated" : "no purpose recorded"),
			statTile("Necessity test", r.necessary ? "Met" : "Not met", r.necessary ? "no reasonable alternative" : "alternative available, or no objective"),
			statTile("Balancing test", r.againstWeight + " vs " + r.forWeight, "weight against vs in favour")
		]);
		root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["The three-part test"]), tests]));

		if (r.blockers.length) {
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Blocking issues"]),
				renderFactors(r.blockers)
			]));
		}

		var cols = el("div", { class: "paa-balance" });
		var left = el("div", { class: "paa-balance-col" }, [el("h4", {}, ["Weighing against - the individual's interests"])]);
		if (r.againstF.length) {
			r.againstF.forEach(function (f) {
				left.appendChild(el("div", { class: "paa-factor sev-" + ((f.weight || 1) >= 3 ? "high" : ((f.weight || 1) >= 2 ? "medium" : "low")) }, [
					el("p", {}, [el("strong", {}, [f.title + ": "]), f.detail])
				]));
			});
		} else {
			left.appendChild(el("p", { class: "paa-no-factors" }, ["Nothing recorded against."]));
		}
		var right = el("div", { class: "paa-balance-col" }, [el("h4", {}, ["Weighing in favour - the legitimate interest"])]);
		if (r.forF.length) {
			r.forF.forEach(function (f) {
				right.appendChild(el("div", { class: "paa-factor sev-low" }, [
					el("p", {}, [el("strong", {}, [f.title + ": "]), f.detail])
				]));
			});
		} else {
			right.appendChild(el("p", { class: "paa-no-factors" }, ["Nothing recorded in favour."]));
		}
		cols.appendChild(left);
		cols.appendChild(right);
		root.appendChild(cols);

		root.appendChild(el("p", { class: "paa-help" }, ["The weighing above is a transparent tally of the answers you gave, not a legal determination - the balancing test is a judgement and the recorded conclusion is yours. Whatever the outcome, keep this assessment: relying on legitimate interests without a documented balancing test is itself a compliance gap, and individuals must be told which interest you rely on and how to object."]));
	}

	function renderDpiaResult(r) {
		var statusKey = r.dpiaStatus === "Required" ? "high" : (r.dpiaStatus === "Likely required" ? "medium" : "low");
		root.appendChild(el("div", { class: "paa-result-head" }, [
			el("span", { class: "paa-badge " + (r.highest ? badgeClass(r.highest === "Very High" ? "Prohibited" : r.highest) : "paa-badge-na") },
				[r.highest ? ("Highest risk: " + r.highest) : "Risk not scored"]),
			el("span", { class: "paa-badge paa-badge-" + statusKey }, ["DPIA: " + r.dpiaStatus])
		]));

		if (r.priorConsultation) {
			root.appendChild(el("div", { class: "paa-callout sev-high" }, [
				el("strong", {}, ["Prior consultation indicated: "]),
				"high residual risk that controls do not reduce to an acceptable level must be referred to the supervisory authority under Art. 36 before processing begins."
			]));
		}

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Risk matrix"]),
			renderRiskMatrix(r.events)
		]));

		if (r.scored.length) {
			var tbl = el("table", { class: "paa-table" });
			r.scored.forEach(function (e) {
				tbl.appendChild(el("tr", {}, [
					el("td", {}, [e.name]),
					el("td", {}, [SEVERITY_SCALE[e.sevIdx].split(" - ")[0] + " severity"]),
					el("td", {}, [LIKELIHOOD_SCALE[e.likIdx].split(" - ")[0] + " likelihood"]),
					el("td", {}, [e.level])
				]));
			});
			root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["Feared events"]), tbl]));
		}

		if (r.triggers.length) {
			var ul = el("ul", { class: "paa-breakdown" });
			r.triggers.forEach(function (t) { ul.appendChild(el("li", {}, [t])); });
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Criteria met (" + r.triggers.length + " of " + DPIA_TRIGGERS.length + ")"]), ul
			]));
		}

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Findings & recommended actions"]),
			renderFactors(r.factors)
		]));

		root.appendChild(el("p", { class: "paa-help" }, ["Risk scoring uses the severity and likelihood scales from the CNIL privacy impact assessment method; the trigger criteria follow Art. 35(3) as expanded by the European Data Protection Board's guidance. This is decision support for a trained assessor, not legal advice - check your own supervisory authority's published lists and templates."]));
	}

	var TPSA_BADGE_MAP = { Low: "Low", Medium: "Medium", High: "High", Critical: "Prohibited" };

	/* Small 4x4 heat map marking where this assessment landed: inherent risk
	 * (rows, Low..Critical) against control maturity (columns, Poor..Strong).
	 * Same visual language as the DPIA's severity x likelihood matrix - one
	 * cell marked, rather than several event dots, since there is only one
	 * vendor being assessed here. */
	function renderTpsaMatrix(inherent, maturity) {
		var grid = el("div", { class: "paa-matrix" });
		grid.appendChild(el("div", { class: "paa-matrix-corner" }, [
			el("span", { class: "paa-matrix-axis-y" }, ["Inherent risk"])
		]));
		TPSA_MATURITY_TIERS.forEach(function (t) { grid.appendChild(el("div", { class: "paa-matrix-collabel" }, [t])); });

		var inherentTiers = ["Low", "Medium", "High", "Critical"];
		for (var s = 3; s >= 0; s--) {
			grid.appendChild(el("div", { class: "paa-matrix-rowlabel" }, [inherentTiers[s]]));
			for (var l = 0; l < 4; l++) {
				var lvl = TPSA_RESIDUAL_MATRIX[s][l];
				var cell = el("div", { class: "paa-matrix-cell sev-" + LEVEL_KEY[lvl === "Critical" ? "Very High" : lvl], title: lvl + " residual risk" });
				cell.appendChild(el("span", { class: "paa-matrix-lvl" }, [lvl]));
				if (maturity.tierIdx !== null && s === inherent.tierIdx && l === maturity.tierIdx) {
					cell.appendChild(el("span", { class: "paa-matrix-dots" }, [el("span", { class: "paa-matrix-dot", title: "This assessment" }, ["●"])]));
				}
				grid.appendChild(cell);
			}
		}
		return el("div", { class: "paa-matrix-wrap" }, [
			grid,
			el("p", { class: "paa-matrix-axis-x" }, ["Control maturity"])
		]);
	}

	function renderTpsaResult(r) {
		var badgeLabel = TPSA_BADGE_MAP[r.residual] || r.residual;
		root.appendChild(el("div", { class: "paa-result-head" }, [
			el("span", { class: "paa-badge " + badgeClass(badgeLabel) }, ["Residual risk: " + r.residual + (r.residualProvisional ? " (provisional)" : "")]),
			el("span", {}, ["Control maturity: " + r.maturity.tier])
		]));

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["How the rating was reached"]),
			el("div", { class: "paa-stats" }, [
				statTile("Inherent risk", r.inherent.tier, r.inherent.drivers.length ? ("driven by " + r.inherent.drivers.join(", ")) : "no elevated data or access factors"),
				statTile("Control maturity", r.maturity.tier, r.maturityScore !== null ? (Math.round(r.maturityScore * 100) + "% average across weighted domains") : "no controls answered yet"),
				statTile("Residual risk", r.residual, r.residualProvisional ? "based on inherent risk only" : "inherent risk tempered by control maturity")
			])
		]));

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Residual risk matrix"]),
			renderTpsaMatrix(r.inherent, r.maturity)
		]));

		// Domain-by-domain breakdown
		var domainRows = r.domainResults.filter(function (dr) { return dr.result.total > 0; });
		if (domainRows.length) {
			var tbl = el("table", { class: "paa-table" });
			domainRows.forEach(function (dr) {
				var d = dr.domain, res = dr.result;
				var pct = res.score !== null ? (Math.round(res.score * 100) + "%") : "-";
				var tier = tpsaMaturityTier(res.score).tier;
				tbl.appendChild(el("tr", {}, [
					el("td", {}, [d.title]),
					el("td", {}, [res.answered + " of " + res.total + " answered"]),
					el("td", {}, [pct]),
					el("td", {}, [res.score === null ? "Not yet assessed" : tier])
				]));
			});
			root.appendChild(el("div", { class: "paa-result-item" }, [el("h4", {}, ["Domain-by-domain breakdown"]), tbl]));
		}

		// Full gap list - every control not marked "Fully in place"
		if (r.allGaps.length) {
			var gapList = el("div", {});
			r.allGaps.forEach(function (g) {
				var sev = g.status === "Not in place" ? (g.weight >= 1.25 ? "high" : "medium") : (g.weight >= 1.25 ? "medium" : "low");
				gapList.appendChild(el("div", { class: "paa-factor sev-" + sev }, [
					el("p", {}, [el("strong", {}, [g.domainTitle + " - " + g.status + ": "]), g.label]),
					g.note ? el("p", { class: "paa-help" }, [g.note]) : null
				]));
			});
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Gaps to close (" + r.allGaps.length + ")"]), gapList
			]));
		} else if (r.answeredControls > 0) {
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Gaps to close"]),
				el("p", { class: "paa-no-factors" }, ["Every answered control is marked fully in place."])
			]));
		}

		root.appendChild(el("div", { class: "paa-result-item" }, [
			el("h4", {}, ["Analysis & next steps"]),
			renderFactors(r.factors)
		]));

		root.appendChild(el("p", { class: "paa-help" }, ["Domain structure follows a standard vendor/third-party security due-diligence questionnaire (the same domains a SIG-style or ISO/IEC 27001-aligned assessment covers). Scoring and weighting are this tool's own, transparent methodology, not a published standard - treat it as decision support for a trained assessor, not a substitute for your own third-party risk program's sign-off criteria."]));
	}

	function finishModule() {
		var mod = MODULES[state.moduleId];
		var result = mod.compute(state.answers);
		var name = state.answers.name || "(untitled)";
		// Captured by whichever branch below runs, then used both to save to
		// history and to drive the "download my answers" buttons in the nav -
		// so what you can download always matches exactly what got saved.
		var entry;

		root.innerHTML = "";
		root.className = "";
		root.appendChild(renderModuleSwitchHeader(mod));
		root.appendChild(el("h3", {}, [mod.label + " - Results"]));
		root.appendChild(el("p", {}, [el("strong", {}, [name])]));

		if (state.moduleId === "privacy") {
			root.appendChild(el("div", { class: "paa-result-head" }, [
				el("span", { class: "paa-badge " + badgeClass(result.level) }, [result.level + " risk"]),
				el("span", {}, ["DPIA: " + result.dpia])
			]));
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Risk factors & recommendations"]),
				renderFactors(result.factors)
			]));
			if ((state.answers.legalGrounds || []).indexOf(ART6_BASES[5]) !== -1 &&
				(state.answers.controlsInPlace || []).indexOf("Legitimate interest balancing test completed") === -1) {
				var liaAnswers = state.answers;
				var liaBox = el("div", { class: "paa-callout sev-medium" }, [
					el("strong", {}, ["You are relying on legitimate interests. "]),
					"That basis requires a documented three-part balancing test, and individuals have to be told which interest you rely on and how to object. The test picks up from here, carrying over what you have already answered."
				]);
				var toLia = el("button", { class: "button paa-to-lia" }, ["Run the Legitimate Interest Test"]);
				toLia.addEventListener("click", function () { startModule("lia", seedLiaFromPrivacyAssessment(liaAnswers)); });
				liaBox.appendChild(el("div", { class: "paa-callout-action" }, [toLia]));
				root.appendChild(liaBox);
			}
			if (result.dpia !== "Not required") {
				var handoffAnswers = state.answers;
				var handoff = el("div", { class: "paa-callout sev-" + (result.dpia === "Required" ? "high" : "medium") }, [
					el("strong", {}, ["A DPIA is " + result.dpia.toLowerCase() + ". "]),
					"The full assessment picks up from here - necessity and proportionality, individual rights, transfers, and a risk assessment of the three feared events. What you have already answered carries over."
				]);
				var toDpia = el("button", { class: "button paa-to-dpia" }, ["Continue to the full DPIA"]);
				toDpia.addEventListener("click", function () { startModule("dpia", seedDpiaFromPrivacyAssessment(handoffAnswers)); });
				handoff.appendChild(el("div", { class: "paa-callout-action" }, [toDpia]));
				root.appendChild(handoff);
			}
			entry = { moduleId: "privacy", name: name, date: new Date().toISOString(), resultLabel: result.level + " (DPIA " + result.dpia.toLowerCase() + ")", answers: state.answers, result: result };
			saveHistory(entry);
		} else if (state.moduleId === "lia") {
			renderLiaResult(result);
			entry = { moduleId: "lia", name: name, date: new Date().toISOString(),
				resultLabel: result.verdict, answers: state.answers, result: result };
			saveHistory(entry);
		} else if (state.moduleId === "dpia") {
			renderDpiaResult(result);
			entry = { moduleId: "dpia", name: name, date: new Date().toISOString(),
				resultLabel: (result.highest ? result.highest + " risk" : "Not scored") + " - DPIA " + result.dpiaStatus.toLowerCase(),
				answers: state.answers, result: result };
			saveHistory(entry);
		} else if (state.moduleId === "incident") {
			renderIncidentResult(result);
			entry = { moduleId: "incident", name: name, date: new Date().toISOString(),
				resultLabel: result.na ? "No breach - not scored" : ("SE " + fmt(result.se) + " - " + result.band.label),
				answers: state.answers, result: result };
			saveHistory(entry);
		} else if (state.moduleId === "tpsa") {
			renderTpsaResult(result);
			entry = { moduleId: "tpsa", name: name, date: new Date().toISOString(),
				resultLabel: "Residual: " + result.residual + (result.residualProvisional ? " (provisional)" : "") + " - maturity " + result.maturity.tier,
				answers: state.answers, result: result };
			saveHistory(entry);
		} else {
			root.appendChild(el("div", { class: "paa-result-head" }, [
				el("span", { class: "paa-badge " + badgeClass(result.regLevel) }, ["Regulatory: " + result.regLevel]),
				el("span", { class: "paa-badge " + badgeClass(result.bizLevel) }, ["Business risk: " + result.bizLevel])
			]));
			root.appendChild(el("div", { class: "paa-result-item" }, [
				el("h4", {}, ["Risk factors & recommendations"]),
				renderFactors(result.factors)
			]));
			entry = { moduleId: "ai", name: name, date: new Date().toISOString(), resultLabel: result.regLevel + " / " + result.bizLevel, answers: state.answers, result: result };
			saveHistory(entry);
		}

		var nav = el("div", { class: "paa-nav actions" });
		var again = el("button", { class: "button alt" }, ["New " + mod.label.toLowerCase()]);
		again.addEventListener("click", function () { startModule(state.moduleId); });
		nav.appendChild(again);
		Object.keys(MODULES).forEach(function (id) {
			if (id === state.moduleId) return;
			var go = el("button", { class: "button alt" }, ["Try the " + MODULES[id].label]);
			go.addEventListener("click", function () { startModule(id); });
			nav.appendChild(go);
		});
		var home = el("button", { class: "button alt" }, ["Back to overview"]);
		home.addEventListener("click", goLanding);
		nav.appendChild(home);
		var printBtn = el("button", { class: "button alt" }, ["Print / Save as PDF"]);
		printBtn.addEventListener("click", function () { window.print(); });
		nav.appendChild(printBtn);
		root.appendChild(nav);

		// Every question, answer, and comment from this specific assessment -
		// not just the result shown above - available the moment it finishes,
		// without having to go back to the overview and download the whole
		// saved history to get at just this one.
		var downloadRow = el("div", { class: "paa-nav actions paa-download-answers" });
		var filenameBase = "privacy-ai-assessment-" + slugify(mod.label) + "-" + slugify(name);
		var dlJson = el("button", { class: "button alt paa-download-entry-json" }, ["Download my answers (JSON)"]);
		dlJson.addEventListener("click", function () { downloadEntriesJSON([entry], filenameBase); });
		downloadRow.appendChild(dlJson);
		var dlCsv = el("button", { class: "button alt paa-download-entry-csv" }, ["Download my answers (CSV)"]);
		dlCsv.addEventListener("click", function () { downloadEntriesCSV([entry], filenameBase); });
		downloadRow.appendChild(dlCsv);
		root.appendChild(downloadRow);
		root.appendChild(el("p", { class: "paa-help" }, ["Includes every question and answer you entered for this assessment, plus the note you can restore later from the overview page (\"Restore from file\") if you switch browsers or devices."]));
	}

	// Deep-link support: a link like privacy-ai-assessment.html#tool-dpia jumps
	// straight into that module's first question instead of the landing page,
	// so a homepage button can send someone directly to the tool they want.
	function startFromHash() {
		var m = /^#tool-([a-z]+)$/.exec(window.location.hash || "");
		if (m && MODULES[m[1]]) {
			startModule(m[1]);
			return true;
		}
		return false;
	}

	if (!startFromHash()) {
		renderLanding();
	}

	/* startFromHash only ran once, at load. Clicking a nav link for a tool while
	   already on this page changes the hash without reloading, so nothing
	   happened: the link looked broken from every page except the one you
	   arrived from. Re-read the hash whenever it changes. */
	window.addEventListener("hashchange", function () {
		if (startFromHash()) scrollToTool();
	});
})();
