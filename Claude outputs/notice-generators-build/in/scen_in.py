CA_US = {
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Running your account", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacy@kiranastores-in.example", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
}

IN_FIELDS = {
    "inScope": "india", "inSdf": "No", "inContactName": "Grievance Officer", "inContact": "grievance@kiranastores-in.example, +91 80 4000 1234",
    "inLink": "kiranastores-in.example/privacy/requests", "inOtherMeans": "the Privacy screen in our app", "inIdentifier": "the mobile number of your account",
    "inDays": "30", "inBoard": "the Board's online complaint platform", "inLangHow": "choose a language at the top of this page",
    "inCm": "No", "inKids": "No", "inDisab": "No", "inErase": "none", "inAbroad": "No",
}

BASE = dict(IN_FIELDS, **{
    "audience": "visitor", "channel": ["web", "app"], "languages": "English, Hindi, Tamil",
    "ctrlName": "Kirana Stores Online Private Limited", "ctrlAddress": "12 MG Road\nBengaluru 560001", "ctrlEmail": "privacy@kiranastores-in.example", "ctrlPhone": "+91 80 4000 1234",
    "publicBody": "No", "joint": "No", "source": "direct",
    "acts": [
        {"purpose": "Delivering your grocery orders", "data": "Name, delivery address, mobile number, order details", "inGround": "consent", "inEnables": "Placing orders on our app and delivering them to your door", "retention": "8 years after the order, as the tax laws require"},
        {"purpose": "Taking payment", "data": "UPI ID, payment reference", "inGround": "consent", "inEnables": "Paying for your orders", "retention": "8 years"},
        {"purpose": "Sending you offers by SMS", "data": "Name, mobile number, purchase history", "inGround": "consent", "inEnables": "Weekly offers on products you buy", "retention": "Until you withdraw consent"},
        {"purpose": "Answering your customer service messages", "data": "Name, mobile number, your message", "inGround": "7a", "retention": "1 year"},
    ],
    "inferred": "No", "consequences": "We use your purchase history to choose which offers we send you.",
    "recipients": [{"who": "PayRail Payments Pvt Ltd", "role": "processor", "why": "Payment processing", "where": "India"},
                   {"who": "QuickDrop Logistics", "role": "processor", "why": "Delivering your orders", "where": "India"}],
    "adm": "No", "profiling": "No",
    "withdrawHow": "Tap Stop offers in the app, or reply STOP to any offer SMS",
    "version": "1.0", "effective": "2027-05-13", "further": "No",
})

def S(**kw):
    d = dict(BASE); d.update(kw); return ("pn", d)

SCEN_IN = {
    "pn_in_only": S(regimes=["in"]),
    "pn_in_full": S(regimes=["in"], inSdf="Yes", inContactName="Ms A. Rao, Data Protection Officer", inContact="dpo@kiranastores-in.example, 12 MG Road, Bengaluru 560001",
                    inCm="Yes", inCmName="ConsentHub, at consenthub.example.in", inKids="Yes", inKidsHow="A parent confirms through DigiLocker before the child's account opens.",
                    inTrack="No", inKidsAds="No", inKidsExempt="No", inDisab="Yes", inErase="ecom", inAbroad="Yes", inAbroadWhere="Singapore",
                    inNominate="Use the nominee form in your account settings", source="both",
                    sources=[{"name": "Our partner stores", "what": "Name and order history", "usedFor": "0", "pub": "No"}],
                    adm="Yes", admWhat="We block orders that our fraud model scores as high risk", admLogic="Order value, device and delivery address history", admEffect="A blocked order is cancelled and refunded",
                    further="Yes", furtherWhat="Training our support chatbot", furtherStart="2027-08-01", furtherData="Customer service messages", furtherRetention="2 years", inFurther="consent",
                    joint="Yes", jointWho="Kirana Wholesale Ltd", jointEssence="We run the loyalty programme together; we answer your requests.", jointContact="grievance@kiranastores-in.example",
                    acts=BASE["acts"] + [{"purpose": "Loyalty programme points", "data": "Name, mobile number, points balance", "inGround": "consent", "inEnables": "Earning and spending loyalty points", "retention": "2 years after your last purchase", "jointP": "Yes"}],
                    regimes_note="all branches"),
    "pn_in_empty": ("pn", {"regimes": ["in"]}),
    "pn_in_bad": S(regimes=["in"], inScope="contract", inDays="120", inKids="Yes", inTrack="Yes", inKidsExempt="No", inLangHow="", inBoard="", inLink="",
                   inOtherMeans="", withdrawHow="", inErase="",
                   acts=[{"purpose": "To personalise services", "data": "Personal details etc.", "inGround": "consent", "retention": "As long as necessary"},
                         {"purpose": "Staff rota", "data": "Name", "inGround": "7i", "retention": "1 year"},
                         {"purpose": "Ration card issue", "data": "Name, address", "inGround": "7b", "retention": "1 year"},
                         {"purpose": "No ground", "data": "Email"}]),
    "pn_in_legit_only": S(regimes=["in"], audience="employee", acts=[
        {"purpose": "Running payroll", "data": "Name, bank account number, salary", "inGround": "7i", "retention": "8 years"},
        {"purpose": "Reporting to the tax authorities", "data": "Name, PAN, salary", "inGround": "7d", "retention": "8 years"}], withdrawHow=""),
    "pn_in_ca_us": S(regimes=["in", "ca", "us"], **CA_US),
    "pn_eu_in": ("pn", dict(IN_FIELDS, **{
        "audience": "client", "regimes": ["eu", "in"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "ctrlPhone": "+31 20 000 0000",
        "publicBody": "No", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@example.nl", "joint": "No", "source": "direct",
        "inScope": "offer", "inContactName": "Privacy Lead", "inContact": "privacy@example.nl",
        "acts": [
            {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you",
             "inGround": "consent", "inEnables": "Advisory services under the contract"},
            {"purpose": "Inviting you to our client events", "data": "Name, business email", "basis": "a", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive invitations",
             "inGround": "consent", "inEnables": "Invitations to our events"}
        ],
        "marketing": "No", "inferred": "No",
        "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}],
        "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
        "inAbroad": "Yes", "inAbroadWhere": "the Netherlands and the United States",
        "adm": "No", "profiling": "No", "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl",
        "version": "2.0", "effective": "2027-05-13", "further": "No"})),
    "pn_br_in": ("pn", dict(IN_FIELDS, **{
        "audience": "visitor", "regimes": ["br", "in"], "channel": ["web"], "languages": "Portuguese, English",
        "ctrlName": "Exemplo Ltda", "ctrlEmail": "privacidade@exemplo-br.example", "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "dpo@exemplo-br.example",
        "source": "direct", "acts": [{"purpose": "Running your account", "data": "Name, email", "brBasis": "V", "inGround": "consent", "inEnables": "Your account on our site", "retention": "Until you close your account"}],
        "brForm": "Through our website", "recipients": [], "brTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacidade@exemplo-br.example", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-05-13", "further": "No"})),
    "pn_can_in": ("pn", dict(IN_FIELDS, **{
        "audience": "visitor", "regimes": ["can", "in"], "canJur": ["fed"], "channel": ["web"], "languages": "English",
        "ctrlName": "Maple Goods Inc.", "ctrlEmail": "privacy@maplegoods-ca.example", "canPicName": "Chief Privacy Officer", "canPicContact": "privacy@maplegoods-ca.example", "canRelated": "No", "canKids": "No",
        "source": "direct", "acts": [{"purpose": "Processing your orders", "data": "Name, address, email", "canNeed": "Yes", "canConsent": "implied", "canSens": "No", "inGround": "consent", "inEnables": "Delivering your orders", "retention": "7 years"}],
        "recipients": [], "canAbroad": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@maplegoods-ca.example", "withdrawHow": "Email us",
        "version": "1", "effective": "2027-05-13", "further": "No"})),
    "pn_ch_in": ("pn", dict(IN_FIELDS, **{
        "audience": "visitor", "regimes": ["ch", "in"], "channel": ["web"], "languages": "German, English",
        "ctrlName": "Beispiel AG", "ctrlEmail": "datenschutz@beispiel-ch.example", "chEstablished": "Yes", "dpo": "No", "source": "direct",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "inGround": "7a", "retention": "Until you close your account"}],
        "recipients": [], "chAbroad": "No", "adm": "No", "profiling": "No", "rightsContact": "datenschutz@beispiel-ch.example",
        "version": "1", "effective": "2027-05-13", "further": "Yes", "furtherWhat": "Product research", "furtherStart": "2027-09-01", "furtherData": "Usage data", "furtherRetention": "1 year", "inFurther": "7a",
        "furtherCompatCh": "Close to the original purpose"})),
}
