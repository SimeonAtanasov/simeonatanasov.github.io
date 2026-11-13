SCEN_R = {
 "pn_uk_only": ("pn", {
    "audience": "client", "regimes": ["uk"], "channel": ["web"], "children": "No",
    "ctrlName": "Example Advisory Ltd", "ctrlAddress": "1 High Street\nLondon EC1A 1AA", "ctrlEmail": "privacy@example.co.uk", "ctrlPhone": "+44 20 0000 0000",
    "publicBody": "No", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
    "acts": [
      {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you"},
      {"purpose": "Sending you our client newsletter", "data": "Name, business email", "basis": "f", "li": "Keeping clients informed about our services", "retention": "Until you object", "required": "optional", "consequence": "You do not receive the newsletter"},
      {"purpose": "Detecting and preventing fraud against our clients", "data": "Name, payment details, transaction history", "basis": "ea", "rliCond": "5", "retention": "6 years", "required": "contractual", "consequence": "We cannot accept your payment"},
      {"purpose": "Recording access needs you tell us about for our events", "data": "Access needs", "basis": "a", "art9": "a", "retention": "Until the event ends", "required": "optional", "consequence": "We cannot make the adjustment"}
    ],
    "marketing": "Yes", "inferred": "No", "consequences": "We check payments against fraud indicators before accepting them.",
    "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}, {"who": "Support Partner Pvt Ltd", "role": "processor", "why": "Help desk", "where": "India"},
                   {"who": "Event Venue Ltda", "role": "controller", "why": "Hosting our client event", "where": "Brazil"}],
    "ukTransfers": "Yes",
    "ukTrows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "regs", "adeqScope": "Organisations certified under the UK Extension to the EU-US Data Privacy Framework"},
                {"country": "India", "recipient": "Support Partner Pvt Ltd", "mech": "idta", "copy": "on request from privacy@example.co.uk"},
                {"country": "Brazil", "recipient": "Event Venue Ltda", "mech": "derog", "derogPt": "a"}],
    "adm": "Yes", "admWhat": "Whether we offer your company payment on account", "admLogic": "We check your company's payment history with us and the size of the order",
    "admEffect": "Without payment on account, your company pays before we start work", "admSpecial": "No", "admActs": ["0"],
    "rightsContact": "privacy@example.co.uk", "withdrawHow": "Email privacy@example.co.uk", "ukComplaintRoute": "use the complaint form at example.co.uk/complaints, or write to our postal address",
    "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_eu_uk_ch": ("pn", {
    "audience": "visitor", "regimes": ["eu", "uk", "ch"], "channel": ["web", "app"], "children": "No",
    "ctrlName": "Example Shop Teoranta", "ctrlAddress": "1 Main Street\nDublin 2, Ireland", "ctrlEmail": "privacy@example.ie",
    "publicBody": "No", "euEstablished": "Yes", "ukEstablished": "No", "ctrlCountry": "Ireland", "ukRepExempt": "No", "ukRepName": "UK Rep Ltd", "ukRepContact": "uk-rep@example.co.uk",
    "chEstablished": "No", "chRepNeeded": "Yes", "chRepName": "Swiss Rep AG", "chRepAddress": "Bahnhofstrasse 1, 8001 Zurich",
    "dpo": "Yes", "dpoContact": "dpo@example.ie", "joint": "No", "source": "direct",
    "acts": [
      {"purpose": "Delivering your orders", "data": "Name, address, order details", "basis": "b", "retention": "7 years after the order, as tax law requires", "required": "contract", "consequence": "We cannot deliver your order"},
      {"purpose": "Preventing payment fraud", "data": "Payment details, device data", "basis": "f", "li": "Protecting us and our customers from fraud", "retention": "2 years", "required": "contractual", "consequence": "We cannot accept your payment"}
    ],
    "ukRliUse": "Yes", "ukRli": [{"act": "1", "cond": "5"}],
    "marketing": "No", "inferred": "Yes", "inferredWhat": "A fraud risk score from your payment and device data",
    "recipients": [{"who": "Pay Processor Inc.", "role": "processor", "why": "Payments", "where": "United States"}, {"who": "Courier Partner Pvt Ltd", "role": "processor", "why": "Delivery", "where": "India"}],
    "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Pay Processor Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
    "ukTransfers": "Yes", "ukTrows": [{"country": "United States", "recipient": "Pay Processor Inc.", "mech": "regs", "adeqScope": "Organisations certified under the UK Extension to the EU-US Data Privacy Framework"}],
    "chAbroad": "Yes", "chTrows": [{"country": "United States", "recipient": "Pay Processor Inc.", "mech": "guarantee", "guar": "d"},
                                   {"country": "India", "recipient": "Courier Partner Pvt Ltd", "mech": "exception", "exc": "b1"}],
    "adm": "Yes", "admWhat": "Whether we accept a card payment", "admLogic": "We compare the payment with known fraud patterns", "admEffect": "A flagged payment is declined",
    "admBasis": "contract", "admSpecial": "No", "chAdmExc": "contract", "admActs": ["0"],
    "rightsContact": "privacy@example.ie", "saName": "Data Protection Commission", "saContact": "www.dataprotection.ie",
    "ukComplaintRoute": "use the complaint form at example.ie/complaints",
    "restriction": "No", "version": "2.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_ch_only": ("pn", {
    "audience": "applicant", "regimes": ["ch"], "channel": ["web"], "children": "No", "languages": "German, French",
    "ctrlName": "Beispiel AG", "ctrlAddress": "Bahnhofstrasse 1\n8001 Zurich", "ctrlEmail": "datenschutz@beispiel-ch.example",
    "publicBody": "No", "chEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@beispiel-ch.example", "joint": "No", "source": "both",
    "sources": [{"name": "Recruitment agency Talent GmbH", "what": "CV and interview notes", "usedFor": "0", "pub": "No"}], "unattributable": "No",
    "acts": [
      {"purpose": "Assessing your application", "data": "CV, references, interview notes", "chGround": "contract", "retention": "6 months after the recruitment closes"},
      {"purpose": "Keeping your profile for future vacancies", "data": "CV", "chGround": "consent", "retention": "2 years, or until you withdraw consent"}
    ],
    "inferred": "No", "consequences": "We keep your CV for future vacancies only if you agree.",
    "recipients": [{"who": "HR Cloud GmbH", "role": "processor", "why": "Applicant tracking system", "where": "Germany"}, {"who": "Video Interview Inc.", "role": "processor", "why": "Video interviews", "where": "United States"}],
    "chAbroad": "Yes", "chTrows": [{"country": "Germany", "recipient": "HR Cloud GmbH", "mech": "adequacy"}, {"country": "United States", "recipient": "Video Interview Inc.", "mech": "guarantee", "guar": "d"}],
    "adm": "No", "profiling": "No",
    "rightsContact": "datenschutz@beispiel-ch.example", "withdrawHow": "Email datenschutz@beispiel-ch.example or use the link in our message",
    "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_ch_empty": ("pn", {"regimes": ["ch"]}),
 "pn_uk_empty": ("pn", {"regimes": ["uk"]}),

 "pn_uk_adm_rli": ("pn", {
    "audience": "visitor", "regimes": ["uk"], "ctrlName": "Card Shop Ltd", "ctrlEmail": "privacy@cardshop.example", "ctrlPhone": "+44 20 1111 1111", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
    "acts": [{"purpose": "Detecting and preventing card fraud", "data": "Payment details, device data", "basis": "ea", "rliCond": "5", "retention": "2 years", "required": "contractual", "consequence": "We cannot accept your payment"}],
    "marketing": "No", "recipients": [], "ukTransfers": "No",
    "adm": "Yes", "admWhat": "Whether we accept a card payment", "admLogic": "We compare the payment with known fraud patterns", "admEffect": "A flagged payment is declined",
    "admSpecial": "No", "admActs": ["0"], "rightsContact": "privacy@cardshop.example", "ukComplaintRoute": "the form at cardshop.example/complaints",
    "further": "Yes", "furtherWhat": "Sharing fraud alerts with the police on request", "furtherStart": "2027-03-01", "furtherData": "Payment details", "furtherBasis": "ea", "furtherRetention": "1 year",
    "furtherCompatUk": "Disclosure to prevent crime is treated as compatible (Annex 2)"
 }),
 "pn_uk_employee": ("pn", {
    "audience": "employee", "regimes": ["uk"], "ctrlName": "Example Works Ltd", "ctrlEmail": "hr@works.example", "ctrlAddress": "2 Mill Lane, Leeds", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
    "acts": [{"purpose": "Managing sick leave and sick pay", "data": "Fit notes, absence dates", "basis": "c", "lawRefUk": "the Social Security Contributions and Benefits Act 1992", "lawRef": "Spanish social security law",
              "art9": "b", "art9LawUk": "Part 1, paragraph 1 (employment, social security and social protection)", "art9Law": "Spanish Workers' Statute, Article 20",
              "crim": "Yes", "crimLawUk": "Part 1, paragraph 1 (employment)", "crimLaw": "Spanish Organic Law 10/1995",
              "retention": "6 years after employment ends", "required": "statutory", "consequence": "We cannot pay statutory sick pay"}],
    "marketing": "No", "recipients": [{"who": "Payroll Bureau Ltd", "role": "processor", "why": "Payroll", "where": "United Kingdom"}], "ukTransfers": "No", "adm": "No", "profiling": "No",
    "rightsContact": "hr@works.example", "ukComplaintRoute": "the HR complaint form or by post", "restriction": "Yes", "restrictionWhat": "Article 23 GDPR as applied in Spain", "restrictionUk": "No"
 }),
 "pn_ch_partial": ("pn", {
    "audience": "client", "regimes": ["ch"], "ctrlName": "Example Consulting Ltd", "ctrlEmail": "privacy@consult.example", "chEstablished": "No", "ctrlCountry": "United Kingdom", "chRepNeeded": "No",
    "dpo": "No", "joint": "No", "source": "direct",
    "acts": [{"purpose": "Running our consulting contract", "data": "Name, business email", "chGround": "contract", "retention": "5 years after the contract ends"}],
    "recipients": [{"who": "Cloud Docs Inc.", "role": "processor", "why": "Document storage", "where": "United States"}],
    "chAbroad": "Yes", "chTrows": [{"country": "United States", "recipient": "Cloud Docs Inc.", "mech": "adequacy"}],
    "adm": "Yes", "admWhat": "Whether we accept a new client", "admLogic": "A score from public company data", "admEffect": "A low score means we decline", "chAdmExc": "consent",
    "rightsContact": "privacy@consult.example", "restrictionCh": "Yes", "restrictionKind": "access", "restrictionWhatCh": "our own overriding interests where we do not disclose the data to third parties (Article 26(2)(a))"
 }),

 "pn_ca_only": ("pn", {
    "audience": "visitor", "regimes": ["ca"], "channel": ["web"], "ctrlName": "Example Outfitters Inc.", "ctrlAddress": "100 Market Street, San Francisco, CA 94105",
    "ctrlEmail": "privacy@outfitters.example", "publicBody": "No", "version": "3.0", "effective": "2026-12-01",
    "consequences": "We share your browsing on our site with advertising partners so they can show you our ads elsewhere.",
    "caCats": [
      {"cat": "A", "examples": "Name, email address, account name, IP address, cookie identifiers", "sources": "You, your browser and device", "purposes": "Running your account, processing orders, advertising our products", "retention": "For as long as your account is open, then 3 years", "sold": "No", "shared": "Yes", "past12": "Yes", "soldTo": "Advertising networks", "sp": "Yes"},
      {"cat": "F", "examples": "Pages viewed, links clicked, searches on our site", "sources": "Your browser, analytics providers", "purposes": "Measuring and improving our website, advertising our products", "retention": "13 months", "sold": "No", "shared": "Yes", "past12": "Yes", "soldTo": "Advertising networks and data analytics providers", "sp": "Yes"},
      {"cat": "D", "examples": "Products you bought or looked at, returns", "sources": "You", "purposes": "Processing orders and returns", "retention": "7 years after the order, for tax law", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes", "discTo": "Tax authorities, when the law requires"},
      {"cat": "S1B", "examples": "Your account log-in and password", "sources": "You", "purposes": "Letting you sign in securely", "retention": "Until you close your account", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"}
    ],
    "caSellPurpose": "Showing you our ads on other websites", "caOptOutLink": "outfitters.example/do-not-sell", "caUnder16": "No",
    "caSpPurpose": "Hosting, payment processing, delivery and customer support", "caSpiBeyond": "No", "caSpiOk": ["m1", "m2", "m6"],
    "caOnlineOnly": "Yes", "caMethods": ["web", "email"], "caWeb": "outfitters.example/privacy-requests", "caEmailReq": "privacy@outfitters.example",
    "caVerify": "We match the email address and the last order number you give us with our records",
    "caOopsScope": ["account"], "caOopsFriction": "Yes", "caOopsHow": "Turn on Global Privacy Control in a browser or extension that supports it",
    "caAdmt": "No", "caIncentive": "No", "ca10M": "No"
 }),
 "pn_ca_admt": ("pn", {
    "audience": "applicant", "regimes": ["ca"], "channel": ["web", "paper"], "ctrlName": "Example Logistics Corp.", "ctrlEmail": "careers-privacy@logistics.example", "ctrlPhone": "+1 800 555 0100",
    "publicBody": "No", "effective": "2026-12-01",
    "caCats": [
      {"cat": "A", "examples": "Name, email address, telephone number", "sources": "You, recruitment agencies", "purposes": "Assessing your application and contacting you", "retention": "2 years after the recruitment closes", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"},
      {"cat": "I", "examples": "Work history, qualifications, references", "sources": "You, your referees", "purposes": "Assessing your application", "retention": "2 years after the recruitment closes", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"},
      {"cat": "S1D", "examples": "Racial or ethnic origin, if you choose to give it", "sources": "You", "purposes": "Equal employment opportunity reporting", "retention": "As long as the reporting rules require, then deleted", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}
    ],
    "caSpPurpose": "Running our applicant tracking system", "caSpiBeyond": "No", "caSpiOk": ["m8"],
    "caPolicyUrl": "logistics.example/careers-privacy", "caAltFormat": "Call 1-800-555-0100 and we send it in large print or read it to you",
    "caOnlineOnly": "No", "caMethods": ["web", "phone"], "caWeb": "logistics.example/privacy-requests", "caPhone": "1-800-555-0100",
    "caVerify": "We ask for your name, email address and the role you applied for, and match them with our records", "caAgent": "through the same webform, with the signed permission attached",
    "caAdmt": "Yes", "caAdmtWhat": "Whether we invite you to a first interview for a warehouse role", "caAdmtHow": "Software scores your answers to the screening questions; your work history and qualifications affect the score",
    "caAdmtOutput": "A score from 0 to 100; applicants above 60 are invited, the rest are not", "caAdmtExc": "hiring", "caAdmtAccess": "Use the webform and choose \"Access ADMT\"",
    "caIncentive": "Yes", "caIncSummary": "A 10% discount at our staff shop if you join our talent pool", "caIncTerms": "You give us your name, email address and work history to keep for 2 years",
    "caIncOptIn": "Tick the talent pool box in your application", "caIncWithdraw": "Use the webform or call us", "caIncRelation": "The discount costs us less than what the data saves us in agency fees", "caIncValue": "We value the data at 5 US dollars, the average cost of finding a comparable applicant through an agency",
    "ca10M": "Yes", "caMetricsLink": "logistics.example/privacy-metrics"
 }),
 "pn_eu_ca": ("pn", {
    "audience": "client", "regimes": ["eu", "ca"], "ctrlName": "Example Advisory GmbH", "ctrlEmail": "privacy@example.de", "ctrlPhone": "+49 30 000000", "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No",
    "source": "direct", "acts": [{"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "3 years after the contract ends", "required": "contractual", "consequence": "We cannot work with you"}],
    "marketing": "No", "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}], "transfers": "Yes",
    "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@example.de", "restriction": "No", "further": "No", "effective": "2026-12-01",
    "caCats": [{"cat": "A", "examples": "Name, business email address, phone number", "sources": "You, your employer", "purposes": "Managing our contract with your employer", "retention": "3 years after the contract ends", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"},
               {"cat": "I", "examples": "Job title, employer", "sources": "You, your employer", "purposes": "Managing our contract with your employer", "retention": "3 years after the contract ends", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"}],
    "caSpPurpose": "Email and document hosting", "caOnlineOnly": "Yes", "caMethods": ["email"], "caEmailReq": "privacy@example.de", "caVerify": "We reply to the business email address we hold for you",
    "caAdmt": "No", "caIncentive": "No", "ca10M": "No"
 }),
 "pn_ca_limit": ("pn", {
    "audience": "visitor", "regimes": ["ca"], "channel": ["web", "app"], "ctrlName": "Example Lending Inc.", "ctrlEmail": "privacy@lending.example", "ctrlPhone": "1-800-555-0199",
    "publicBody": "No", "effective": "2026-12-01",
    "caCats": [
      {"cat": "A", "examples": "Name, email address, account number", "sources": "You", "purposes": "Assessing and running your loan", "retention": "7 years after the loan ends", "sold": "No", "shared": "No", "past12": "Yes", "soldTo": "Data brokers", "sp": "Yes"},
      {"cat": "S1A", "examples": "Social security number", "sources": "You", "purposes": "Checking your identity and credit", "retention": "7 years after the loan ends", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"}
    ],
    "caSellPurpose": "Earning referral fees", "caSpPurpose": "Credit checks and loan servicing",
    "caSpiBeyond": "Yes", "caSpiOk": ["m1"], "caSpiBeyondWhat": "Offering you other credit products based on your credit profile", "caLimitLink": "lending.example/limit",
    "caOnlineOnly": "No", "caMethods": ["web", "phone"], "caWeb": "lending.example/privacy-requests", "caPhone": "1-800-555-0199",
    "caVerify": "We match three pieces of information you give us with our records", "caAgent": "Through the webform, with your signed permission",
    "caAdmt": "Yes", "caAdmtWhat": "Whether we approve your loan application", "caAdmtHow": "A model scores your credit history and income",
    "caAdmtOutput": "A score; we approve applications above a set threshold", "caAdmtExc": "none", "caAdmtMethods": ["web", "phone"],
    "caAdmtOptOutHow": "lending.example/admt-opt-out or 1-800-555-0199", "caAdmtAlt": "a loan officer reviews your application", "caAdmtAccess": "Use the webform",
    "caIncentive": "No", "ca10M": "No"
 }),
 "pn_ch_ca": ("pn", {
    "audience": "client", "regimes": ["ch", "ca"], "ctrlName": "Example Consulting AG", "ctrlEmail": "privacy@consult.example", "chEstablished": "Yes",
    "dpo": "No", "joint": "No", "source": "direct",
    "acts": [{"purpose": "Running our consulting contract", "data": "Name, business email", "chGround": "contract", "retention": "5 years after the contract ends"}],
    "recipients": [{"who": "Cloud Docs Inc.", "role": "controller", "why": "Document storage", "where": "Switzerland"}], "chAbroad": "No", "adm": "No",
    "rightsContact": "privacy@consult.example", "restrictionCh": "No", "effective": "2026-12-01",
    "caCats": [{"cat": "A", "examples": "Name, business email address", "sources": "You", "purposes": "Running our consulting contract", "retention": "5 years after the contract ends", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caOnlineOnly": "Yes", "caMethods": ["email"], "caEmailReq": "privacy@consult.example", "caVerify": "We reply to the email address we hold for you",
    "caAdmt": "No", "caIncentive": "No", "ca10M": "No"
 }),
 "pn_us_only": ("pn", {
    "audience": "visitor", "regimes": ["us"], "channel": ["web", "app"], "ctrlName": "Example Outdoor Co.", "ctrlAddress": "1 Main Street, Denver, CO 80202",
    "ctrlEmail": "privacy@outdoor.example", "publicBody": "No", "effective": "2026-12-01",
    "usStates": ["VA", "CO", "CT", "TX", "OR", "MN", "IA", "UT"],
    "usCats": [
      {"cat": "Contact information", "examples": "Name, email address, postal address", "sensitive": "No", "purposes": "Delivering orders and answering questions", "retention": "3 years after your last order", "shared": "No", "sold": "No", "ta": "No", "prof": "No"},
      {"cat": "Information from cookies", "examples": "Device identifiers, pages viewed", "sensitive": "No", "purposes": "Advertising our products on other websites", "retention": "13 months", "shared": "Yes", "sold": "Yes", "ta": "Yes", "prof": "No"},
      {"cat": "Precise geolocation", "examples": "Location of your phone when you use the store finder", "sensitive": "Yes", "purposes": "Showing the nearest store", "retention": "Not stored after the search", "shared": "No", "sold": "No", "ta": "No", "prof": "No"}
    ],
    "usThird": [{"type": "Third-party advertisers", "what": "Show our ads on other websites and measure them", "data": "Information from cookies", "sold": "Yes"}],
    "usOptOutHow": "outdoor.example/your-privacy-choices", "usGpc": "Yes", "usGpcHow": "We apply it to the browser that sends it, and to your account when you are signed in.",
    "usConsentHow": "Turn off location access in the app settings", "usOrNames": "Example Outdoor Co., trading as Outdoor Example", "usLlm": "No",
    "usMethods": ["web", "email"], "usWeb": "outdoor.example/privacy-requests", "usEmailReq": "privacy@outdoor.example",
    "usVerify": "We match your email address and an order number with our records", "usAgent": "Agents use the same webform and attach your signed permission",
    "usAppeal": "Reply to our decision email with the subject Appeal", "usChangeHow": "By email and a notice on our homepage, 30 days before the change applies"
 }),
 "pn_us_sale": ("pn", {
    "audience": "visitor", "regimes": ["us"], "channel": ["web"], "ctrlName": "Example Data LLC", "ctrlEmail": "privacy@data.example", "effective": "2026-12-01",
    "usStates": ["TX", "LA", "RI", "CO", "NJ"],
    "usCats": [
      {"cat": "Health information", "examples": "Fitness goals you enter", "sensitive": "Yes", "purposes": "Personalising workout plans", "shared": "Yes", "sold": "Yes", "ta": "No", "prof": "Yes"},
      {"cat": "Biometric data", "examples": "Face geometry used to sign in", "sensitive": "Yes", "purposes": "Signing you in", "shared": "Yes", "sold": "Yes", "ta": "No", "prof": "No"}
    ],
    "usThird": [{"type": "Data brokers", "what": "Resell audience segments to insurers", "data": "Health information, biometric data", "sold": "Yes"}],
    "usOptOutHow": "data.example/opt-out", "usGpc": "Yes", "usGpcHow": "We apply it to the browser that sends it",
    "usConsentHow": "Use the privacy settings in your account", "usBioSale": "Yes", "usRiBuyers": "Acme Data Brokers Inc. and Beta Audiences LLC",
    "usProfDecisions": "Whether we offer you an insurance discount", "usProfLogic": "A score from your activity levels", "usProfUse": "The score decides the offer; staff review complaints",
    "usProfEval": "Tested for accuracy in 2026, no bias found", "usProfEffects": "A lower premium, or no offer",
    "usMethods": ["web", "email"], "usWeb": "data.example/requests", "usEmailReq": "privacy@data.example", "usVerify": "We send a code to your account email",
    "usAgent": "Through the webform", "usAppeal": "Reply to our decision email", "usChangeHow": "By email before the change applies"
 }),
 "pn_eu_us": ("pn", {
    "audience": "client", "regimes": ["eu", "us"], "ctrlName": "Example Advisory GmbH", "ctrlEmail": "privacy@example.de", "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No",
    "source": "direct", "acts": [{"purpose": "Managing our contract with you", "data": "Name, email", "basis": "b", "retention": "3 years after the contract ends", "required": "contractual", "consequence": "We cannot work with you"}],
    "marketing": "No", "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}], "transfers": "Yes",
    "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@example.de", "restriction": "No", "further": "No", "effective": "2026-12-01",
    "usStates": ["VA", "OK"],
    "usCats": [{"cat": "Contact information", "examples": "Name, email address", "sensitive": "No", "purposes": "Managing our contract with you", "shared": "No", "sold": "No", "ta": "No", "prof": "No"}],
    "usMethods": ["email"], "usEmailReq": "privacy@example.de", "usVerify": "We reply to the email address we hold", "usAppeal": "Email us with the subject Appeal"
 }),
 "pn_ca_us": ("pn", {
    "audience": "visitor", "regimes": ["ca", "us"], "channel": ["web"], "ctrlName": "Example Shop Inc.", "ctrlEmail": "privacy@shop.example", "effective": "2026-12-01",
    "caCats": [{"cat": "A", "examples": "Name, email address", "sources": "You", "purposes": "Processing orders", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "Yes"}],
    "caSpPurpose": "Hosting", "caOnlineOnly": "Yes", "caMethods": ["email"], "caEmailReq": "privacy@shop.example", "caVerify": "We reply to the email address we hold", "caAgent": "By email with signed permission",
    "caAdmt": "No", "caIncentive": "No", "ca10M": "No",
    "usStates": ["VA", "NJ"],
    "usCats": [{"cat": "Contact information", "examples": "Name, email address", "sensitive": "No", "purposes": "Processing orders", "shared": "No", "sold": "No", "ta": "No", "prof": "No"}],
    "usMethods": ["email"], "usEmailReq": "privacy@shop.example", "usVerify": "We reply to the email address we hold", "usAppeal": "Email us with the subject Appeal", "usChangeHow": "By email"
 }),
 "pn_us_ut_al": ("pn", {
    "audience": "visitor", "regimes": ["us"], "channel": ["web"], "ctrlName": "Example Games Inc.", "ctrlEmail": "privacy@games.example", "effective": "2026-12-01",
    "usStates": ["UT", "AL"],
    "usCats": [{"cat": "Account information", "examples": "Username, email address", "sensitive": "No", "purposes": "Running your account", "shared": "No", "sold": "No", "ta": "No", "prof": "No"}],
    "usMethods": ["web", "email"], "usWeb": "games.example/privacy", "usEmailReq": "privacy@games.example", "usVerify": "We send a code to your account email"
 }),
 "pn_us_geo": ("pn", {
    "audience": "visitor", "regimes": ["us"], "channel": ["web", "app"], "ctrlName": "Example Maps LLC", "ctrlEmail": "privacy@maps.example", "effective": "2026-12-01",
    "usStates": ["VA", "OR", "CT", "TX", "NE", "MD"],
    "usCats": [{"cat": "Precise geolocation", "examples": "GPS location", "sensitive": "Yes", "geo": "Yes", "purposes": "Navigation", "shared": "Yes", "sold": "Yes", "ta": "No", "prof": "No"}],
    "usThird": [{"type": "Data brokers", "what": "Build location audiences", "data": "Precise geolocation", "sold": "Yes"}],
    "usOptOutHow": "maps.example/opt-out", "usGpc": "No", "usConsentHow": "Turn off location in the app", "usOrNames": "Example Maps LLC", "usLlm": "No", "usOnlineOnly": "No",
    "usMethods": ["email"], "usEmailReq": "privacy@maps.example", "usVerify": "We send a code", "usAgent": "By email", "usAppeal": "Reply to our email", "usChangeHow": "By email"
 }),
 "pn_us_empty": ("pn", {"regimes": ["us"]}),
 "pn_ca_empty": ("pn", {"regimes": ["ca"]}),
}
