CA_US = {
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Running your account", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacy@sakuratea-jp.example", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
}

JP_FIELDS = {
    "jpScope": "in", "jpRepName": "Hanako Sato, Representative Director", "jpNoRecip": "Yes",
    "jpSecurity": "A basic policy and handling rules for personal data; a person responsible and reporting lines; staff training; locked offices; access control, encryption and logs on our systems",
    "jpFee": "No", "jpAcc": "No", "jpAbroad": "No", "jpKids": "No",
    "jpRelIn": "No", "jpRelOut": "No", "jpPseudo": "No", "jpAnon": "No",
}

BASE = dict(JP_FIELDS, **{
    "jpReqHow": "Write to privacy@sakuratea-jp.example or use the form at sakuratea-jp.example/privacy/request; we check your identity with your account login or a copy of an identity document",
    "jpComplaint": "privacy@sakuratea-jp.example, or 03-1234-5678 on weekdays",
    "audience": "visitor", "channel": ["web", "app"], "languages": "Japanese, English",
    "ctrlName": "Sakura Tea Co., Ltd.", "ctrlAddress": "1-2-3 Marunouchi, Chiyoda-ku\nTokyo 100-0005", "ctrlEmail": "privacy@sakuratea-jp.example", "ctrlPhone": "+81 3 1234 5678",
    "publicBody": "No", "joint": "No", "source": "direct",
    "acts": [
        {"purpose": "Delivering your tea orders", "data": "Name, delivery address, phone number, order details", "jpSens": "No", "retention": "7 years after the order, as the tax laws require"},
        {"purpose": "Sending you offers by email", "data": "Name, email address, purchase history", "jpSens": "No", "retention": "Until you unsubscribe"},
        {"purpose": "Answering your questions", "data": "Name, email address, your message", "jpSens": "No", "retention": "2 years"},
    ],
    "inferred": "No", "consequences": "We use your purchase history to choose which offers we send you.",
    "recipients": [{"who": "Kuroneko Delivery Co., Ltd.", "role": "processor", "why": "Delivering your orders", "where": "Tokyo"},
                   {"who": "Mailwave K.K.", "role": "processor", "why": "Sending our emails", "where": "Osaka"}],
    "adm": "No", "profiling": "No", "rightsContact": "privacy@sakuratea-jp.example",
    "version": "1.0", "effective": "2027-01-01", "further": "No",
})

def S(**kw):
    d = dict(BASE); d.update(kw); return ("pn", d)

XROW_SG = {"recipient": "Sakura Tea Asia Pte. Ltd.", "country": "Singapore", "basis": "consent",
           "system": "Singapore's Personal Data Protection Act 2012 applies; the PPC's report on Singapore is at ppc.go.jp", "measures": "A group data agreement with the APPI's security and use limits"}

SCEN_JP = {
    "pn_jp_only": S(regimes=["jp"]),
    "pn_jp_full": S(regimes=["jp"], jpAcc="Yes", jpAccName="Japan Retail Privacy Association", jpAccContact="consult@jrpa.example.jp",
                    jpFee="Yes", jpFeeAmount="1,000 yen per request", jpForeignWhere="Singapore and the United States (cloud servers)",
                    jpAbroad="Yes", jpXrows=[XROW_SG,
                                             {"recipient": "Cloudbox Inc.", "country": "United States", "basis": "contract"},
                                             {"recipient": "Tea Partners GmbH", "country": "Germany", "basis": "designated"}],
                    jpKids="Yes", source="both", sources=[{"name": "Our partner tea shops", "what": "Name and order history", "usedFor": "0", "pub": "No"}],
                    profiling="Yes", profilingWhat="We analyse your purchase history to choose which offers we send you",
                    further="Yes", furtherWhat="Recommending teas in our app", furtherStart="2027-08-01", furtherData="Purchase history", jpFurther="related",
                    recipients=BASE["recipients"] + [
                        {"who": "Sakura Tea Asia Pte. Ltd.", "role": "processor", "why": "Customer service for orders from abroad", "where": "Singapore"},
                        {"who": "Cloudbox Inc.", "role": "processor", "why": "Hosting our order system", "where": "United States"},
                        {"who": "Tea Partners GmbH", "role": "controller", "why": "Running the joint loyalty scheme", "where": "Germany", "jpProv": "consent"},
                        {"who": "Sakura Tea Holdings Co., Ltd.", "role": "joint", "why": "Group customer analysis", "where": "Tokyo", "jpProv": "joint"},
                        {"who": "Tokyo Tax Office", "role": "authority", "why": "Tax reporting", "where": "Tokyo", "jpProv": "law"}],
                    jpJointItems="Name, email address, purchase history", jpJointPurpose="Customer analysis and group offers",
                    jpJointResp="Sakura Tea Co., Ltd., 1-2-3 Marunouchi, Chiyoda-ku, Tokyo, Representative Director Hanako Sato",
                    acts=BASE["acts"] + [{"purpose": "Recording allergy information for tasting events", "data": "Name, food allergies", "jpSens": "Yes", "jpSensG": "consent", "retention": "Until the event ends"}],
                    changeSummary="Added tasting events."),
    "pn_jp_empty": ("pn", {"regimes": ["jp"]}),
    "pn_jp_bad": S(regimes=["jp"], jpRepName="", ctrlAddress="", jpSecurity="We follow the PPC guidelines.", jpReqHow="", rightsContact="", ctrlEmail="", jpFee="Yes", jpFeeAmount="",
                   jpComplaint="", jpAcc="Yes", jpAccName="", languages="English", jpAbroad="No",
                   recipients=[{"who": "AdNet Ltd", "role": "controller", "why": "Advertising", "where": "Singapore"}, {"who": "Mystery Co", "why": "Unknown"},
                               {"who": "List Brokers K.K.", "role": "controller", "why": "Selling mailing lists", "where": "Tokyo", "jpProv": "optout"}],
                   further="Yes", furtherWhat="Research", furtherStart="2027-09-01", furtherData="Usage data",
                   acts=[{"purpose": "To personalise services", "data": "", "retention": ""},
                         {"purpose": "Health check records", "data": "Health check results", "jpSens": "Yes"}]),
    "pn_jp_offshore": S(regimes=["jp"], jpScope="abroad", jpOffWhere="Singapore", ctrlName="Lotus Apps Pte. Ltd.", ctrlAddress="1 Marina Way\nSingapore 018989",
                        jpForeignWhere="Singapore"),
    "pn_jp_public": S(regimes=["jp"], publicBody="Yes"),
    # After the review: an association, Article 31, pseudonymised and anonymised information, the fee payment method,
    # and consent rows where the country or the measures cannot be given (Rules Article 17(3), (4)).
    "pn_jp_more": S(regimes=["jp"], jpKind="assoc", jpRepName="Ichiro Suzuki, Chair", ctrlName="Tea Lovers Association",
                    jpRelIn="Yes", jpRelWhat="Browsing history on partner tea sites, from Leaf Ads K.K.", jpRelOut="Yes",
                    jpPseudo="Yes", jpPseudoPurpose="Analysing which teas sell together", jpAnon="Yes", jpAnonItems="Age band, prefecture, teas bought",
                    jpAnonProv="Age band and teas bought, sent as a file to tea growers",
                    jpFee="Yes", jpFeeAmount="500 yen", jpFeeHow="By bank transfer before we reply", jpForeignWhere="Viet Nam",
                    jpAbroad="Yes", jpXrows=[{"recipient": "Mekong Support Co.", "basis": "consent", "noCountry": "Yes", "noCountryWhy": "We are still choosing the provider",
                                              "noCountryInfo": "The provider will be in Viet Nam or Thailand", "noMeasures": "Yes", "noMeasuresWhy": "The contract is not yet signed"}],
                    recipients=BASE["recipients"] + [{"who": "Mekong Support Co.", "role": "processor", "why": "Customer support", "where": "Viet Nam or Thailand"}]),
    "pn_jp_offshore_rel": S(regimes=["jp"], jpScope="abroad", jpOffWhere="Singapore", ctrlName="Lotus Apps Pte. Ltd.", ctrlAddress="1 Marina Way\n018989",
                            jpForeignWhere="Singapore", jpRelIn="Yes", jpRelWhat="App usage identifiers, from Leaf Ads K.K.", jpRelOut="No"),
    "pn_jp_ca_us": S(regimes=["jp", "ca", "us"], **CA_US),
    "pn_eu_jp": ("pn", dict(JP_FIELDS, **{
        "audience": "client", "regimes": ["eu", "jp"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "ctrlPhone": "+31 20 000 0000",
        "publicBody": "No", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@example.nl", "joint": "No", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "the Netherlands", "jpRepName": "Jan de Vries, Managing Director", "jpForeignWhere": "the Netherlands and the United States",
        "acts": [
            {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you", "jpSens": "No"},
            {"purpose": "Inviting you to our client events", "data": "Name, business email, dietary requirements", "basis": "a", "art9": "a", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive invitations", "jpSens": "No"}
        ],
        "marketing": "No", "inferred": "No",
        "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}],
        "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
        "jpAbroad": "Yes", "jpXrows": [{"recipient": "Cloud Mail Inc.", "country": "United States", "basis": "contract"}],
        "adm": "No", "profiling": "No", "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl",
        "version": "2.0", "effective": "2027-01-01", "further": "No"})),
    "pn_uk_jp": ("pn", dict(JP_FIELDS, **{
        "audience": "visitor", "regimes": ["uk", "jp"], "channel": ["web"], "children": "No", "languages": "English, Japanese",
        "ctrlName": "Example Ltd", "ctrlAddress": "1 High Street\nLondon", "ctrlEmail": "privacy@example.co.uk", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "the United Kingdom",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "basis": "b", "retention": "Until you close your account", "required": "contract", "consequence": "No account", "jpSens": "No"}],
        "recipients": [], "ukTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@example.co.uk",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    "pn_cn_jp": ("pn", dict(JP_FIELDS, **{
        "audience": "visitor", "regimes": ["cn", "jp"], "channel": ["web"], "languages": "Chinese, Japanese",
        "ctrlName": "Lantern Tea (Shanghai) Co., Ltd.", "ctrlAddress": "88 Huaihai Road\nShanghai 200021", "ctrlEmail": "privacy@lanterntea-cn.example", "source": "direct",
        "cnScope": "in", "cnPipo": "No", "cnMethod": "Collected through our website and stored in Shanghai", "cnAfter": "It is deleted", "cnAccount": "No", "cnPush": "No", "cnKids": "No", "cnAbroad": "No", "cnNoRecip": "Yes",
        "jpScope": "abroad", "jpOffWhere": "mainland China",
        "acts": [{"purpose": "Delivering your orders", "data": "Name, address", "cnBasis": "contract", "cnSens": "No", "jpSens": "No", "retention": "3 years"}],
        "recipients": [], "adm": "No", "profiling": "No", "rightsContact": "privacy@lanterntea-cn.example",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    "pn_br_jp": ("pn", dict(JP_FIELDS, **{
        "audience": "visitor", "regimes": ["br", "jp"], "channel": ["web"], "languages": "Portuguese, Japanese",
        "ctrlName": "Exemplo Ltda", "ctrlAddress": "Av. Paulista 1000\nSao Paulo", "ctrlEmail": "privacidade@exemplo-br.example", "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "dpo@exemplo-br.example",
        "jpScope": "abroad", "jpOffWhere": "Brazil",
        "source": "direct", "acts": [{"purpose": "Running your account", "data": "Name, email", "brBasis": "V", "jpSens": "No", "retention": "Until you close your account"}],
        "brForm": "Through our website", "recipients": [], "brTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacidade@exemplo-br.example", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
}
