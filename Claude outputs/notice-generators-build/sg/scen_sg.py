CA_US = {
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Running your account", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacy@merlion.example.sg", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
}

SG_FIELDS = {
    "sgScope": "in", "sgDpo": "Tan Mei Ling, Data Protection Officer", "sgDpoContact": "dpo@merlion.example.sg, +65 6123 4567",
    "sgFee": "No", "sgKids": "No", "sgNric": "No", "sgAbroad": "No", "sgDnc": "No",
    "sgSecurity": "Encryption of stored data, access limited to named staff, yearly staff training and penetration tests",
}

BASE = dict(SG_FIELDS, **{
    "audience": "visitor", "channel": ["web", "app"], "languages": "English",
    "ctrlName": "Merlion Learning Pte. Ltd.", "ctrlAddress": "10 Anson Road #20-01\nSingapore 079903", "ctrlEmail": "privacy@merlion.example.sg", "ctrlPhone": "+65 6123 4567",
    "publicBody": "No", "source": "direct",
    "acts": [
        {"purpose": "Signing you up and running your account", "data": "Name, email address, mobile number, password", "sgBasis": "deemed", "retention": "Until you close your account, then 30 days"},
        {"purpose": "Taking payment for courses", "data": "Name, billing address, card details", "sgBasis": "deemed", "retention": "5 years after payment, as tax law requires"},
        {"purpose": "Sending you course news and offers", "data": "Name, email address", "sgBasis": "consent", "retention": "Until you withdraw consent"},
    ],
    "inferred": "No", "consequences": "We send course news only if you agree to it.",
    "recipients": [{"who": "Lion Pay Pte. Ltd.", "role": "processor", "why": "Processing card payments", "where": "Singapore"},
                   {"who": "Kampong Cloud Pte. Ltd.", "role": "processor", "why": "Hosting our website and app", "where": "Singapore (ap-southeast-1)"}],
    "adm": "No", "profiling": "No", "withdrawHow": "Untick course news in your account settings, or use the link in each email",
    "version": "1.0", "effective": "2027-01-01", "further": "No",
})

def S(**kw):
    d = dict(BASE); d.update(kw); return ("pn", d)

XROWS = [
    {"recipient": "Redwood Cloud Inc.", "country": "United States", "basis": "contract"},
    {"recipient": "Sakura Support K.K.", "country": "Japan", "basis": "cert", "certKind": "apec-cbpr"},
    {"recipient": "Koala Tutors Pty Ltd", "country": "Australia", "basis": "consent",
     "summary": "Australia's Privacy Act 1988 protects your data there, and our contract with Koala Tutors requires it to protect your data as the PDPA does"},
    {"recipient": "Merlion Learning Pte. Ltd.", "country": "Malaysia", "basis": "own"},
]

FULL = dict(
    sgAbroad="Yes", sgXrows=XROWS, sgFee="Yes", sgKids="Yes", sgKids13="Yes", sgKidsHow="A parent signs up and confirms by email",
    sgNric="Yes", sgNricWhy="law", sgNricDetail="the Private Education Act 2009 and its regulations, for registering students",
    sgDnc="Yes", sgComplaint="Email dpo@merlion.example.sg; we reply within 10 working days",
    sgReqHow="Write to dpo@merlion.example.sg, or use the form in your account settings",
    adm="Yes", admWhat="Whether you qualify for a scholarship, based on your test scores",
    acts=BASE["acts"] + [
        {"purpose": "Arranging tutoring sessions you book with our partner tutors", "data": "Name, email address, course", "sgBasis": "contract", "retention": "1 year after the session"},
        {"purpose": "Suggesting courses that match your progress", "data": "Course history, test scores", "sgBasis": "notify", "sgOptOut": "use the link in our email of 1 March 2027 within 30 days", "retention": "2 years"},
        {"purpose": "Detecting fraud and misuse of accounts", "data": "Login records, device identifiers", "sgBasis": "li", "sgLi": "keeping our platform and our learners safe", "retention": "1 year"},
        {"purpose": "Registering students with the Committee for Private Education", "data": "Name, NRIC number, date of birth, course", "sgBasis": "law", "sgLaw": "Private Education Act 2009", "retention": "As the Act requires"},
        {"purpose": "Recovering unpaid fees", "data": "Name, contact details, amount owed", "sgBasis": "exception", "sgExc": "First Schedule, Part 3, paragraph 4: recovering a debt", "retention": "Until the debt is settled"},
    ],
    recipients=[{"who": "Lion Pay Pte. Ltd.", "role": "processor", "why": "Processing card payments", "where": "Singapore"},
                {"who": "Redwood Cloud Inc.", "role": "processor", "why": "Hosting our website and app", "where": "Oregon, United States"},
                {"who": "Sakura Support K.K.", "role": "processor", "why": "Answering support requests", "where": "Tokyo, Japan"},
                {"who": "Koala Tutors Pty Ltd", "role": "controller", "why": "Running the tutoring sessions you book with it", "where": "Sydney, Australia"},
                {"who": "Committee for Private Education", "role": "authority", "why": "Student registration", "where": "Singapore"}],
    further="Yes", furtherWhat="Training our course recommendation model", furtherStart="2027-06-01", furtherData="Course history and test scores", furtherRetention="2 years", sgFurther="notify",
)

SCEN_SG = {
    "pn_sg_only": S(regimes=["sg"]),
    "pn_sg_full": S(regimes=["sg"], **FULL),
    "pn_sg_empty": ("pn", {"regimes": ["sg"]}),
    "pn_sg_bad": S(regimes=["sg"], sgScope="", sgDpo="", sgDpoContact="", sgFee="", sgKids="Yes", sgKids13="Yes", sgKidsHow="", sgNric="Yes", sgNricWhy="", sgNricDetail="", withdrawHow="",
                   sgAbroad="Yes", sgXrows=[{"recipient": "Koala Tutors Pty Ltd", "country": "Australia", "basis": "consent"},
                                            {"recipient": "Nordic Analytics AB", "country": "Sweden", "basis": "cert", "certKind": "global-prp"},
                                            {"recipient": "Treaty Co", "country": "", "basis": "law"},
                                            {"recipient": "Someone Else Ltd", "country": "Malaysia", "basis": "own"}],
                   acts=[{"purpose": "Sending you offers", "data": "", "sgBasis": "li", "retention": "As long as necessary"},
                         {"purpose": "Other purposes", "data": "Name", "sgBasis": "", "retention": ""},
                         {"purpose": "Newsletter", "data": "Email", "sgBasis": "notify", "sgOptOut": "", "retention": "1 year"},
                         {"purpose": "Tax filing", "data": "Name", "sgBasis": "law", "sgLaw": "", "retention": "5 years"},
                         {"purpose": "Debt recovery", "data": "Name", "sgBasis": "exception", "sgExc": "", "retention": "1 year"},
                         {"purpose": "Staff rota", "data": "Name", "sgBasis": "employ", "retention": "1 year"}],
                   recipients=[{"who": "Koala Tutors Pty Ltd", "role": "controller", "why": "Tutoring", "where": "Sydney, Australia"},
                               {"who": "Nordic Analytics AB", "role": "controller", "why": "Analytics", "where": "Stockholm, Sweden"},
                               {"who": "Hidden Partner Ltd", "role": "processor", "why": "", "where": "Frankfurt, Germany"},
                               {"who": "Mystery Co", "role": "", "why": "Unknown", "where": "Atlantis"}],
                   effective=""),
    "pn_sg_offshore": S(regimes=["sg"], sgScope="abroad", sgOffWhere="Malaysia and the United States", ctrlName="Merlion Learning Sdn. Bhd.", ctrlAddress="Jalan Ampang\nKuala Lumpur",
                        recipients=[{"who": "Redwood Cloud Inc.", "role": "processor", "why": "Hosting our website and app", "where": "United States"}], sgAbroad="No"),
    "pn_sg_abroad_missing": S(regimes=["sg"], recipients=[{"who": "Redwood Cloud Inc.", "role": "processor", "why": "Hosting our website and app", "where": "Frankfurt"}], sgAbroad="No"),
    "pn_sg_unknown": S(regimes=["sg"], recipients=[{"who": "Mystery Hosting", "role": "processor", "why": "Hosting", "where": "Data centre"}], sgAbroad="No"),
    "pn_sg_rows_missing": S(regimes=["sg"], recipients=[{"who": "Redwood Cloud Inc.", "role": "processor", "why": "Hosting our website and app", "where": "United States"},
                                                       {"who": "Sakura Support K.K.", "role": "processor", "why": "Support", "where": "Japan"}],
                            sgAbroad="Yes", sgXrows=[XROWS[0]]),
    "pn_sg_norecip": S(regimes=["sg"], recipients=[], sgNoRecip="Yes", channel=["paper"]),
    "pn_sg_employee": S(regimes=["sg"], audience="employee", acts=[{"purpose": "Paying salaries and managing your employment", "data": "Name, NRIC number, bank account, salary", "sgBasis": "employ", "retention": "7 years after you leave"}],
                        sgNric="Yes", sgNricWhy="law", sgNricDetail="the Income Tax Act 1947, for filing employment income", withdrawHow=""),
    "pn_sg_public": S(regimes=["sg"], publicBody="Yes"),
    "pn_sg_ca_us": S(regimes=["sg", "ca", "us"], **CA_US),
    "pn_eu_sg": S(regimes=["eu", "sg"], euEstablished="No", ctrlCountry="Singapore", repName="EU Rep GmbH", repContact="rep@eurep.example", dpo="No", joint="No",
                  acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="a")], transfers="No"),
    "pn_uk_sg": S(regimes=["uk", "sg"], ukEstablished="No", ctrlCountry="Singapore", ukRepExempt="Yes", dpo="No", joint="No",
                  acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="a")], ukComplaintRoute="privacy@merlion.example.sg"),
    "pn_br_sg": S(regimes=["br", "sg"], brKids="No", brEstablished="No", ctrlCountry="Singapore", brSmall="No", brEncKind="person", brEncName="Lee Wei", brEncContact="dpo@merlion.example.sg",
                  acts=[dict(a, brBasis="V") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], brBasis="I")], brTransfers="No"),
    "pn_can_sg": S(regimes=["can", "sg"], canJur=["fed"], canPicName="Privacy Officer", canPicContact="privacy@merlion.example.sg",
                   acts=[dict(a, canNeed="Yes", canConsent="implied", canSens="No") for a in BASE["acts"]]),
    "pn_in_sg": S(regimes=["in", "sg"], acts=[dict(a, inGround="consent", inEnables="Your account and courses") for a in BASE["acts"]]),
    "pn_cn_sg": S(regimes=["cn", "sg"], acts=[dict(a, cnBasis="contract", cnSens="No") for a in BASE["acts"]]),
    "pn_jp_sg": S(regimes=["jp", "sg"], jpScope="abroad", jpOffWhere="Singapore", jpKind="corp", jpRepName="Lim Wei, CEO", jpSecurity="A basic policy; staff training; access control",
                  jpFee="No", jpAcc="No", jpAbroad="No", jpKids="No", jpRelIn="No", jpRelOut="No", jpPseudo="No", jpAnon="No", jpReqHow="Write to privacy@merlion.example.sg",
                  jpComplaint="privacy@merlion.example.sg", acts=[dict(a, jpSens="No") for a in BASE["acts"]]),
    "pn_kr_sg": S(regimes=["kr", "sg"], krScope="abroad", krOffWhere="Singapore", krRepNeed="No", krRep="No", krCpo="Lim Wei, Director", krCpoContact="+65 6123 4567, privacy@merlion.example.sg",
                  krSecurity="Encryption; access control; staff training", krKids="No", krSensPublic="No", krPseudo="No", krCookies="No", krFurtherUse="No", krFee="No", krPort="No",
                  krObject="Reply to our answer within 30 days", krFirst="Yes", krAbroad="No", krDestroyProc="We delete data at the end of its retention period", krDestroyHow=["del"],
                  acts=[dict(a, krBasis="contract" if i < 2 else "consent", krRefuse="You do not receive course news", krSens="No") for i, a in enumerate(BASE["acts"])]),
}
