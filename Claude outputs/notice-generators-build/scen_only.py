# The EU privacy notice scenarios of test_ng.py as they were before the regimes change (12 November 2026), for diff_eu.py.
SCEN = {
 "pn_employee": ("pn", {
    "audience": "employee", "memberState": "Spain", "channel": ["web", "paper"], "children": "No", "languages": "English, Spanish",
    "ctrlName": "Example Logistics S.L.", "ctrlAddress": "Calle Mayor 1\n08001 Barcelona", "ctrlEmail": "privacy@example.com", "ctrlPhone": "+34 900 000 000",
    "publicBody": "No", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@example.com", "joint": "No",
    "source": "both", "sources": [{"name": "Previous employer references", "what": "Dates of employment and role", "usedFor": "4", "pub": "No"}], "unattributable": "No",
    "acts": [
      {"purpose": "Paying your salary and benefits", "data": "Bank details, salary, tax data", "basis": "b", "retention": "6 years after employment ends, as tax law requires", "required": "contract", "consequence": "We cannot pay you"},
      {"purpose": "Meeting tax and social security duties", "data": "Tax identification number, salary", "basis": "c", "lawRef": "national tax and social security law", "retention": "As set by tax law, currently 6 years", "required": "statutory", "consequence": "We cannot employ you"},
      {"purpose": "Keeping the building and systems secure", "data": "Access card logs", "basis": "f", "li": "Protecting staff, premises and information from unauthorised access", "retention": "90 days", "required": "contractual", "consequence": "You cannot enter the building"},
      {"purpose": "Managing sick leave", "data": "Fit notes", "basis": "c", "lawRef": "employment law", "art9": "b", "art9Law": "the national employment law on sick leave", "retention": "4 years", "required": "statutory", "consequence": "Your absence is unpaid"},
      {"purpose": "Checking your employment history before hiring", "data": "Dates of employment and role", "basis": "f", "li": "Confirming the experience you told us about", "retention": "Until the end of your probation period", "required": "optional", "consequence": "We ask your previous employer directly"}
    ],
    "marketing": "No", "inferred": "No", "consequences": "Access card logs show when you enter and leave the building.",
    "recipients": [{"who": "Payroll Services Ltd", "role": "processor", "why": "Running payroll", "where": "Spain"}, {"who": "Tax authority", "role": "authority", "why": "Tax reporting", "where": "Spain"}],
    "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud HR Inc.", "mech": "scc", "copy": "by emailing privacy@example.com"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@example.com", "saName": "Agencia Espanola de Proteccion de Datos", "saContact": "www.aepd.es",
    "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_visitor_consent_adm": ("pn", {
    "audience": "visitor", "channel": ["web", "app"], "children": "Yes", "ctrlName": "Shop Example", "ctrlEmail": "hello@example.com",
    "euEstablished": "No", "ctrlCountry": "Switzerland", "repExempt": "No", "repName": "EU Rep GmbH", "repContact": "rep@example.eu", "dpo": "No", "joint": "Yes", "jointWho": "Partner Ads B.V.",
    "jointEssence": "We decide jointly on the analytics on our website; Partner Ads answers access requests", "jointContact": "hello@example.com", "source": "direct",
    "acts": [{"purpose": "Sending our newsletter", "data": "Email address", "basis": "a", "retention": "Until you unsubscribe", "required": "optional", "consequence": "You do not receive the newsletter"},
             {"purpose": "Measuring how visitors use our website", "data": "Pages viewed, device type", "basis": "a", "retention": "13 months", "required": "optional", "consequence": "Your visit is not counted", "jointP": "Yes"},
             {"purpose": "Deciding whether to offer you payment by instalments", "data": "Order history, address", "basis": "b", "retention": "2 years", "required": "contract", "consequence": "We cannot offer instalments"}],
    "marketing": "Yes", "inferred": "Yes", "inferredWhat": "A credit score from your order history",
    "recipients": [{"who": "Partner Ads B.V.", "role": "joint", "why": "Website analytics", "where": "Netherlands"}], "transfers": "No", "adm": "Yes", "admWhat": "Whether we offer payment by instalments", "admLogic": "We score order history and delivery address against repayment data",
    "admEffect": "A low score means you pay in full at checkout", "admBasis": "contract", "admSpecial": "No", "rightsContact": "hello@example.com", "withdrawHow": "Use the unsubscribe link in every email",
    "further": "Yes", "furtherWhat": "Training our fraud model", "furtherStart": "2027-02-01", "furtherData": "Order history", "furtherBasis": "f", "furtherRetention": "3 years",
    "furtherCompat": "Fraud prevention is linked to the original purpose of taking payment"
 }),
 "pn_transfers": ("pn", {
    "audience": "client", "ctrlName": "Example Advisory GmbH", "ctrlEmail": "privacy@example.de", "ctrlPhone": "+49 30 000000", "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No",
    "source": "direct", "acts": [{"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "f", "li": "Running the contract with our client", "retention": "3 years after the contract ends", "required": "contractual", "consequence": "We cannot work with you"}],
    "marketing": "No", "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}], "transfers": "Yes",
    "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"},
              {"country": "India", "recipient": "Support Partner Pvt Ltd", "mech": "other46", "instr46": "46-3-a", "copy": "on request from privacy@example.de"},
              {"country": "Brazil", "recipient": "Event Venue Ltda", "mech": "derog", "derogPt": "a"},
              {"country": "Singapore", "recipient": "Expert Witness Pte Ltd", "mech": "compelling", "cInterest": "Defending a claim brought against us", "cSafeguards": "Encryption and a confidentiality undertaking", "copy": "on request"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@example.de", "restriction": "No", "further": "No"
 }),
 "pn_empty": ("pn", {}),
 "ai_chatbot": ("ai", {
    "org": "Example Bank", "sysName": "Help chat", "sysWhat": "Answers questions about your account and hands you to a person when needed", "role": "both",
    "limits": "It cannot give financial advice", "human": "A person reviews any complaint it receives", "contact": "help@example.com",
    "interacts": "Yes", "channels": ["chat", "voice"], "audience": "public", "riskier": "Yes", "generates": ["text"], "preExisting": "Yes",
    "deepfakes": "No", "publicText": "Yes", "review": "Yes", "editor": "Editor-in-chief, editor@example.com", "erbc": [],
    "highRisk": "annex3", "legacy": "No", "decisions": "Yes", "workplace": "No", "explainRoute": "explain@example.com", "personal": "Yes", "adm": "No", "privacyLink": "https://example.com/privacy"
 }),
 "ai_legacy_crit": ("ai", {"org": "Grid Co", "sysName": "Load balancer", "sysWhat": "Decides which customers are disconnected first in a supply emergency", "role": "deployer",
    "interacts": "No", "deepfakes": "No", "publicText": "No", "highRisk": "annex3crit", "legacy": "Yes", "sigChange": "No", "decisions": "Yes", "workplace": "Yes",
    "reps": "The works council, under national law", "explainRoute": "explain@grid.example", "personal": "Yes", "adm": "No", "privacyLink": "https://grid.example/privacy"}),
 "ai_er_permitted": ("ai", {"org": "Example Games", "sysName": "Mood play", "sysWhat": "Adapts the game to the player's facial expressions", "role": "deployer", "interacts": "No",
    "erbc": ["er"], "erContext": "other", "erWhere": "the game launch screen", "deepfakes": "No", "publicText": "No", "highRisk": "no", "personal": "Yes", "privacyLink": "https://games.example/privacy"}),
 "ai_provider_only": ("ai", {"org": "Model Maker", "sysName": "Face tagger", "sysWhat": "Groups photos by age band", "role": "provider", "interacts": "No",
    "erbc": ["bc"], "bcProtected": "No", "deepfakes": "Yes", "artistic": "No", "publicText": "No", "highRisk": "annex3", "decisions": "Yes", "personal": "No"}),
 "ai_prohibited": ("ai", {"org": "Example Corp", "sysName": "Mood monitor", "sysWhat": "Reads staff facial expressions", "role": "deployer", "interacts": "No",
    "erbc": ["er"], "erContext": "work", "erMedical": "No", "erWhere": "office entrance", "deepfakes": "No", "publicText": "No", "highRisk": "no", "personal": "Yes", "privacyLink": "x"}),
 "ai_staff_obvious": ("ai", {"org": "Example Corp", "sysName": "Policy helper", "sysWhat": "Answers staff questions about internal policies", "role": "provider",
    "interacts": "Yes", "audience": "staff", "obvious": "Yes", "obviousWhy": "Trained staff open it from the AI menu of the intranet", "deepfakes": "No", "publicText": "No", "highRisk": "no", "personal": "No"}),
 "dp_full": ("dp", {"org": "Example Logistics S.L.", "scope": "All employees and contractors of the organisation", "owner": "Head of Privacy", "approver": "the Management Board",
    "review": "12", "version": "2.0", "effective": "2026-12-01", "breachContact": "security@example.com", "rightsContact": "privacy@example.com",
    "c_processor": "No", "c_special": "Yes", "c_criminal": "No", "c_outsideEU": "No", "c_dpo": "Yes", "c_consent": "Yes", "c_children": "No",
    "c_automated": "No", "c_transfers": "Yes", "c_derogations": "No", "c_joint": "No", "c_indirect": "Yes", "c_research": "No"}),
 "dp_empty": ("dp", {}),
 "aip_full": ("aip", {"org": "Example Logistics S.L.", "scope": "All employees and contractors", "owner": "Head of Digital", "approver": "the Management Board",
    "approvalRoute": "The AI review group, with privacy and security", "concerns": "ai-concerns@example.com", "review": "12", "roles": ["deployer", "provider"],
    "tools": "Approved chat tool\nCode assistant", "personalData": "approved", "confidential": "approved", "humanReview": ["decision", "publish"],
    "highRisk": "Yes", "extraBans": "Using AI to monitor individual productivity", "literacy": ["all", "tool", "oversight"], "media": "Yes", "statement": "Yes"}),
}

