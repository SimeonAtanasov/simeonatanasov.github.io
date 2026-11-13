CA_US = {
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Running your account", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacy@lanterntea-cn.example", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
}

CN_FIELDS = {
    "cnScope": "in", "cnPipo": "No", "cnMethod": "Collected through our app and website, stored on servers in Shanghai, and used by our staff to fill and deliver orders",
    "cnAfter": "It is deleted, or anonymised so that no one can be identified", "cnAccount": "Yes", "cnAccountHow": "Settings, then Account, then Deregister account, in the app",
    "cnPush": "No", "cnKids": "No", "cnAbroad": "No", "cnNoRecip": "Yes",
}

BASE = dict(CN_FIELDS, **{
    "audience": "visitor", "channel": ["web", "app"], "languages": "Chinese, English",
    "ctrlName": "Lantern Tea (Shanghai) Co., Ltd.", "ctrlAddress": "88 Huaihai Road\nShanghai 200021", "ctrlEmail": "privacy@lanterntea-cn.example", "ctrlPhone": "+86 21 5000 1234",
    "publicBody": "No", "joint": "No", "source": "direct",
    "acts": [
        {"purpose": "Delivering your tea orders", "data": "Name, delivery address, mobile number, order details", "cnBasis": "contract", "retention": "3 years after the order, as the E-Commerce Law requires"},
        {"purpose": "Taking payment", "data": "Payment account reference", "cnBasis": "contract", "retention": "3 years"},
        {"purpose": "Sending you offers by SMS", "data": "Name, mobile number, purchase history", "cnBasis": "consent", "retention": "Until you withdraw consent"},
        {"purpose": "Keeping invoice records", "data": "Name, invoice details", "cnBasis": "legal", "retention": "10 years"},
    ],
    "inferred": "No", "consequences": "We use your purchase history to choose which offers we send you.",
    "recipients": [{"who": "Yunpay Technology Co., Ltd.", "role": "processor", "why": "Payment processing", "where": "Shanghai"},
                   {"who": "Swift Courier Co., Ltd.", "role": "processor", "why": "Delivering your orders", "where": "Shanghai"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@lanterntea-cn.example, or Settings, then Privacy, in the app",
    "withdrawHow": "Tap Stop offers in the app, or reply TD to any offer SMS",
    "version": "1.0", "effective": "2027-01-01", "further": "No",
})

def S(**kw):
    d = dict(BASE); d.update(kw); return ("pn", d)

XROW = {"consent": "Yes", "name": "Lantern Tea Holdings Pte. Ltd.", "country": "Singapore", "contact": "privacy@lanterntea-sg.example", "purpose": "Group customer service",
        "how": "Stored and read by the group customer service team", "data": "Name, mobile number, order history",
        "rights": "Write to us at privacy@lanterntea-cn.example; we pass the request on and answer within 15 working days"}

SCEN_CN = {
    "pn_cn_only": S(regimes=["cn"]),
    "pn_cn_full": S(regimes=["cn"], cnScope="offer", cnOffWhere="Singapore", ctrlAddress="1 Raffles Place\nSingapore 048616", cnRepKind="rep", cnRep="Shanghai Lantern Consulting Co., Ltd., rep@lanterntea-cn.example",
                    cnPipo="Yes", cnPipoName="Ms Li Wen, Personal Information Protection Officer", cnPipoContact="pipo@lanterntea-cn.example",
                    cnPush="Yes", cnPushKind="both", cnPushHow="Turn off Personalised recommendations in Settings, then Privacy",
                    cnKids="Yes", cnKidsHow="A parent confirms by SMS code before the child's account opens", cnKidsRules="lanterntea-cn.example/privacy/children",
                    cnAbroad="Yes", cnXrows=[XROW], source="both",
                    sources=[{"name": "Our partner tea houses", "what": "Name and order history", "usedFor": "0", "pub": "No"}],
                    inferred="Yes", inferredWhat="Your tea preferences, from your orders",
                    adm="Yes", admWhat="We block orders that our fraud model scores as high risk", admLogic="Order value, device and delivery address history", admEffect="A blocked order is cancelled and refunded",
                    further="Yes", furtherWhat="Training our customer service chatbot", furtherStart="2027-08-01", furtherData="Customer service messages", furtherRetention="2 years", cnFurther="consent",
                    joint="Yes", jointWho="Lantern Tea Wholesale Co., Ltd.", jointEssence="We run the membership programme together; we answer your requests.", jointContact="privacy@lanterntea-cn.example",
                    recipients=BASE["recipients"] + [{"who": "Lantern Tea Holdings Pte. Ltd.", "role": "controller", "why": "Group customer service", "where": "Singapore",
                                                      "cnContact": "privacy@lanterntea-sg.example", "cnHow": "Stored and read by the group customer service team", "cnData": "Name, mobile number, order history", "cnCons": "Yes"},
                                                     {"who": "Teahouse Rewards Co., Ltd.", "role": "controller", "why": "Running the joint rewards scheme", "where": "Hangzhou",
                                                      "cnContact": "service@teahouserewards-cn.example", "cnHow": "Records the points and sends reward vouchers", "cnData": "Name, mobile number, points balance", "cnCons": "Yes"}],
                    acts=BASE["acts"] + [
                        {"purpose": "Membership programme", "data": "Name, mobile number, points balance", "cnBasis": "consent", "retention": "2 years after your last purchase", "jointP": "Yes", "cnKidsP": "Yes",
                         "cnSensWhy": "Children under 14 can join with a parent's consent; we use only the points balance, and a leak would show what a child buys"},
                        {"purpose": "Verifying your identity for large orders", "data": "Face image", "cnBasis": "consent", "cnSens": "Yes",
                         "cnSensWhy": "A face check stops others ordering with your account; a leak of a face image cannot be undone, so we keep only a template", "retention": "Until you close your account"}],
                    changeSummary="Added the membership programme."),
    "pn_cn_empty": ("pn", {"regimes": ["cn"]}),
    "pn_cn_bad": S(regimes=["cn"], cnScope="assess", cnRep="", cnPipo="Yes", cnPipoName="", cnPipoContact="", cnMethod="", cnAfter="", cnAccountHow="",
                   cnPush="Yes", cnPushHow="", cnKids="Yes", cnKidsHow="", cnKidsRules="", languages="English", withdrawHow="",
                   recipients=[{"who": "AdNet Ltd", "role": "controller", "why": "Advertising", "where": "Singapore"}, {"who": "Mystery Co", "why": "Unknown"}],
                   further="Yes", furtherWhat="Research", furtherStart="2027-09-01", furtherData="Usage data", furtherRetention="1 year",
                   acts=[{"purpose": "To personalise services", "data": "", "cnBasis": "consent", "retention": "As long as necessary"},
                         {"purpose": "Staff scheduling", "data": "Name", "cnBasis": "hr", "retention": "1 year"},
                         {"purpose": "Reporting", "data": "Name", "cnBasis": "law", "retention": "5 years"},
                         {"purpose": "Health check", "data": "Health certificate", "cnBasis": "consent", "cnSens": "Yes", "retention": "1 year"},
                         {"purpose": "No ground", "data": "Email"}]),
    "pn_cn_noconsent": S(regimes=["cn"], audience="employee", withdrawHow="", cnAccount="No", cnAbroad="Yes",
                         cnXrows=[dict(XROW, consent="No", purpose="Group payroll", data="Name, salary", how="Runs the payroll")],
                         acts=[{"purpose": "Running payroll", "data": "Name, bank account number, salary", "cnBasis": "hr", "retention": "Until the end of employment and 2 years after"},
                               {"purpose": "Paying social insurance", "data": "Name, ID card number, salary", "cnBasis": "legal", "retention": "30 years"}],
                         recipients=[{"who": "Lantern Tea Holdings Pte. Ltd.", "role": "processor", "why": "Group payroll", "where": "Singapore"},
                                     {"who": "Social insurance agency", "role": "authority", "why": "Social insurance", "where": "Shanghai",
                                      "cnContact": "12333", "cnHow": "Records contributions", "cnData": "Name, ID card number, salary", "cnCons": "No"}]),
    "pn_cn_profiling": S(regimes=["cn"], profiling="Yes", profilingWhat="We group customers by what they buy to plan our stock"),
    "pn_cn_public": S(regimes=["cn"], publicBody="Yes"),
    "pn_cn_ca_us": S(regimes=["cn", "ca", "us"], **CA_US),
    "pn_eu_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "client", "regimes": ["eu", "cn"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "ctrlPhone": "+31 20 000 0000",
        "publicBody": "No", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@example.nl", "joint": "No", "source": "direct",
        "cnScope": "offer", "cnOffWhere": "the Netherlands", "cnRepKind": "entity", "cnRep": "Example Advisory (Shanghai) Co., Ltd., +86 21 6000 0000",
        "acts": [
            {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you",
             "cnBasis": "contract"},
            {"purpose": "Inviting you to our client events", "data": "Name, business email, dietary requirements", "basis": "a", "art9": "a", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive invitations",
             "cnBasis": "consent"}
        ],
        "marketing": "No", "inferred": "No",
        "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}],
        "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
        "cnAbroad": "Yes", "cnXrows": [{"name": "Example Advisory B.V.", "country": "the Netherlands", "contact": "privacy@example.nl", "purpose": "Managing the contract and inviting you to events",
                                       "how": "Stored in our systems in the Netherlands", "data": "Name, business email, phone", "rights": "Email privacy@example.nl", "consent": "No"}],
        "adm": "No", "profiling": "No", "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl",
        "version": "2.0", "effective": "2027-01-01", "further": "No"})),
    "pn_uk_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["uk", "cn"], "channel": ["web"], "children": "No", "languages": "English, Chinese",
        "ctrlName": "Example Ltd", "ctrlEmail": "privacy@example.co.uk", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "basis": "b", "retention": "Until you close your account", "required": "contract", "consequence": "No account", "cnBasis": "contract"}],
        "recipients": [], "ukTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@example.co.uk",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    "pn_ch_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["ch", "cn"], "channel": ["web"], "languages": "German, Chinese",
        "ctrlName": "Beispiel AG", "ctrlEmail": "datenschutz@beispiel-ch.example", "chEstablished": "Yes", "dpo": "No", "source": "direct",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "cnBasis": "contract", "retention": "Until you close your account"}],
        "recipients": [], "chAbroad": "No", "adm": "No", "profiling": "No", "rightsContact": "datenschutz@beispiel-ch.example",
        "version": "1", "effective": "2027-01-01", "further": "Yes", "furtherWhat": "Product research", "furtherStart": "2027-09-01", "furtherData": "Usage data", "furtherRetention": "1 year", "cnFurther": "consent",
        "furtherCompatCh": "Close to the original purpose"})),
    "pn_br_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["br", "cn"], "channel": ["web"], "languages": "Portuguese, Chinese",
        "ctrlName": "Exemplo Ltda", "ctrlEmail": "privacidade@exemplo-br.example", "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "dpo@exemplo-br.example",
        "source": "direct", "acts": [{"purpose": "Running your account", "data": "Name, email", "brBasis": "V", "cnBasis": "consent", "retention": "Until you close your account"}],
        "brForm": "Through our website", "recipients": [], "brTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacidade@exemplo-br.example", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    "pn_can_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["can", "cn"], "canJur": ["fed"], "channel": ["web"], "languages": "English, Chinese",
        "ctrlName": "Maple Goods Inc.", "ctrlEmail": "privacy@maplegoods-ca.example", "canPicName": "Chief Privacy Officer", "canPicContact": "privacy@maplegoods-ca.example", "canRelated": "No", "canKids": "No",
        "source": "direct", "acts": [{"purpose": "Processing your orders", "data": "Name, address, email", "canNeed": "Yes", "canConsent": "implied", "canSens": "No", "cnBasis": "contract", "retention": "7 years"}],
        "recipients": [], "canAbroad": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@maplegoods-ca.example", "withdrawHow": "Email us",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    "pn_in_cn": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["in", "cn"], "channel": ["web"], "languages": "English, Hindi, Chinese",
        "inScope": "india", "inSdf": "No", "inContactName": "Grievance Officer", "inContact": "grievance@kiranastores-in.example",
        "inLink": "kiranastores-in.example/privacy/requests", "inOtherMeans": "", "inIdentifier": "your mobile number", "inDays": "30", "inBoard": "the Board's online complaint platform",
        "inLangHow": "choose a language at the top of this page", "inCm": "No", "inKids": "No", "inDisab": "No", "inErase": "none", "inAbroad": "Yes", "inAbroadWhere": "China",
        "ctrlName": "Kirana Stores Online Private Limited", "ctrlEmail": "privacy@kiranastores-in.example", "source": "direct",
        "acts": [{"purpose": "Delivering your orders", "data": "Name, address, mobile number", "inGround": "consent", "inEnables": "Ordering and delivery", "cnBasis": "consent", "retention": "8 years"}],
        "recipients": [], "adm": "No", "profiling": "No", "rightsContact": "grievance@kiranastores-in.example", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-05-13", "further": "No"})),
}

# Review R07: an unanswered sensitive question is now missing. Every builder scenario except pn_cn_bad and
# pn_cn_empty answers it: No unless the purpose says otherwise.
for _k, (_g, _st) in SCEN_CN.items():
    if _k in ("pn_cn_bad", "pn_cn_empty"): continue
    for _a in _st.get("acts", []): _a.setdefault("cnSens", "No")
