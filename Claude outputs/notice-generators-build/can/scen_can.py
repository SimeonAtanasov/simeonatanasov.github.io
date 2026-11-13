CA_US = {
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Running your account", "retention": "3 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacy@maplegoods-ca.example", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
}

BASE = {
    "audience": "visitor", "channel": ["web", "app"], "children": "No", "languages": "English",
    "ctrlName": "Maple Goods Inc.", "ctrlAddress": "100 King Street West\nToronto ON M5X 1A9", "ctrlEmail": "privacy@maplegoods-ca.example", "ctrlPhone": "+1 416 555 0100",
    "publicBody": "No", "canPicName": "Chief Privacy Officer", "canPicContact": "100 King Street West, Toronto ON M5X 1A9, privacy@maplegoods-ca.example",
    "canRelated": "No", "canKids": "No", "joint": "No", "source": "direct",
    "acts": [
        {"purpose": "Processing and delivering your orders", "data": "Name, address, email, phone, order details", "canNeed": "Yes", "canConsent": "implied", "canSens": "No", "retention": "7 years after the order, as tax law requires"},
        {"purpose": "Taking payment", "data": "Card details, billing address", "canNeed": "Yes", "canConsent": "implied", "canSens": "Yes", "retention": "18 months"},
        {"purpose": "Sending you our newsletter", "data": "Name, email", "canNeed": "No", "canConsent": "express", "canSens": "No", "retention": "Until you unsubscribe"},
        {"purpose": "Recommending products based on what you browse", "data": "Browsing and purchase history", "canNeed": "No", "canConsent": "optout", "canSens": "No", "retention": "2 years"},
        {"purpose": "Detecting payment fraud", "data": "Order history, device data", "canNeed": "No", "canConsent": "none", "canLaw": "PIPEDA section 7(2)(a)", "canSens": "No", "retention": "2 years"}
    ],
    "inferred": "Yes", "inferredWhat": "Product preferences from your browsing", "consequences": "We use your browsing history to recommend products, unless you opt out.",
    "canMeans": "Through our website and app forms, cookies on our website, and calls to our customer service",
    "canRisk": "If our payment provider were breached, card details could be used for fraud. We use tokenisation to limit this.",
    "recipients": [{"who": "PayFast Canada Ltd", "role": "processor", "why": "Payment processing", "where": "Canada"},
                   {"who": "CloudHost Inc.", "role": "processor", "why": "Hosting our website and customer database", "where": "United States"},
                   {"who": "Courier Express", "role": "controller", "why": "Delivering your parcels", "where": "Ontario"}],
    "canAbroad": "Yes", "canAbroadWhere": "the United States", "canAbroadWhy": "Host our website and customer database",
    "adm": "No", "profiling": "Yes", "profilingWhat": "We group customers by purchase history to tailor recommendations.",
    "rightsContact": "privacy@maplegoods-ca.example", "withdrawHow": "Use the unsubscribe link, or email privacy@maplegoods-ca.example",
    "version": "1.0", "effective": "2026-12-01", "further": "No"
}

def S(**kw):
    d = dict(BASE); d.update(kw); return ("pn", d)

SCEN_CAN = {
    "pn_can_only": S(regimes=["can"], canJur=["fed"]),
    "pn_can_qc": S(regimes=["can"], canJur=["fed", "qc"], languages="French, English", canKids="Yes", canKidsHow="A parent confirms by email before the account opens.",
                   canGovUrl="maplegoods-ca.example/privacy/governance", canForWhom="", canProspect="Yes", canTech="Yes",
                   canTechWhat="Location services in our app, to show the nearest store", canTechHow="Turn on location in the app settings", canOutQc="Yes",
                   adm="Yes", admWhat="We approve or refuse store credit applications automatically", admLogic="Your payment history and order value", admEffect="A refusal means you pay up front"),
    "pn_can_all": S(regimes=["can"], canJur=["fed", "qc", "ab", "bc"], languages="English, French", canGovUrl="maplegoods-ca.example/privacy/governance", canProspect="No",
                    canTech="Yes", canTechWhat="Cookies that record what you browse, to recommend products", canTechHow="Accept recommendation cookies in our cookie settings", canOutQc="Yes", adm="No", canRelated="Yes", canRelatedWhat="Customer name and order history, to Maple Goods Logistics Ltd, our subsidiary, to plan deliveries",
                    further="Yes", furtherWhat="Training our customer service assistant", furtherStart="2027-03-01", furtherData="Customer service emails", furtherRetention="2 years", canFurther="consent"),
    "pn_can_empty": ("pn", {"regimes": ["can"]}),
    "pn_can_qc_empty": ("pn", {"regimes": ["can"], "canJur": ["qc"]}),
    "pn_eu_can": ("pn", {
        "audience": "client", "regimes": ["eu", "can"], "canJur": ["fed", "qc"], "channel": ["web"], "children": "No", "canKids": "No", "languages": "English, French",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "ctrlPhone": "+31 20 000 0000",
        "publicBody": "No", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "dpo@example.nl", "joint": "No", "source": "direct",
        "canPicName": "Head of Privacy", "canPicContact": "Herengracht 1, Amsterdam, privacy@example.nl", "canRelated": "No", "canGovUrl": "example.nl/governance",
        "acts": [
            {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you",
             "canNeed": "Yes", "canConsent": "implied", "canSens": "No"},
            {"purpose": "Inviting you to our client events", "data": "Name, business email, dietary needs", "basis": "a", "art9": "a", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive invitations",
             "canNeed": "No", "canConsent": "express", "canSens": "No"}
        ],
        "marketing": "No", "inferred": "No", "canMeans": "Business cards and our event registration form", "canProspect": "No", "canTech": "No",
        "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}],
        "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
        "canAbroad": "Yes", "canAbroadWhere": "the Netherlands and the United States", "canOutQc": "Yes",
        "adm": "Yes", "admWhat": "We screen event registrations automatically against sanctions lists", "admLogic": "Name matching", "admEffect": "A match blocks registration", "admBasis": "law", "admLaw": "EU sanctions regulations",
        "canAdm": "Yes", "canAdmWhat": "",
        "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl", "saName": "Autoriteit Persoonsgegevens",
        "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
    }),
    "pn_br_can": ("pn", {
        "audience": "visitor", "regimes": ["br", "can"], "canJur": ["fed"], "channel": ["web"], "children": "No", "brKids": "No", "canKids": "No", "languages": "Portuguese, English",
        "ctrlName": "Loja Exemplo Ltda", "ctrlEmail": "privacidade@lojaexemplo-br.example", "publicBody": "No", "brEstablished": "Yes", "brSmall": "No",
        "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "encarregado@lojaexemplo-br.example", "joint": "No", "source": "direct",
        "canPicName": "Ana Souza, Privacy Officer", "canPicContact": "Avenida Paulista 1000, Sao Paulo, encarregado@lojaexemplo-br.example", "canRelated": "No",
        "acts": [{"purpose": "Delivering your orders", "data": "Name, address, order details", "brBasis": "V", "retention": "5 years", "required": "contract", "consequence": "We cannot deliver your order",
                  "canNeed": "Yes", "canConsent": "implied", "canSens": "No"},
                 {"purpose": "Sending you our newsletter", "data": "Name, email", "brBasis": "I", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive the newsletter",
                  "canNeed": "No", "canConsent": "express", "canSens": "No"}],
        "inferred": "No", "recipients": [{"who": "Cloud Hosting Inc.", "role": "processor", "why": "Hosting", "where": "United States"}],
        "brTransfers": "Yes", "brTrows": [{"country": "United States", "recipient": "Cloud Hosting Inc.", "mech": "scc", "form": "Customer records, by encrypted connection, for hosting, for the life of the account"}], "brSecurity": "Encryption in transit and at rest",
        "canAbroad": "Yes", "canAbroadWhere": "Brazil and the United States",
        "adm": "No", "profiling": "No", "brAdm": "No",
        "rightsContact": "privacidade@lojaexemplo-br.example", "withdrawHow": "Use the unsubscribe link", "version": "1.0", "effective": "2026-12-01", "further": "No"
    }),
    "pn_can_ca_us": S(regimes=["can", "ca", "us"], canJur=["fed"], **CA_US),
    "pn_can_stale_adm": S(regimes=["can"], canJur=["fed", "qc"], languages="French", canGovUrl="maplegoods-ca.example/gov", canProspect="No", canTech="No", canOutQc="Yes", adm="", canAdm="Yes", canAdmWhat="Credit decisions"),
    "pn_ch_can": ("pn", {
        "audience": "client", "regimes": ["ch", "can"], "canJur": ["bc"], "channel": ["web"], "children": "No", "canKids": "No", "languages": "German, English",
        "ctrlName": "Beispiel AG", "ctrlAddress": "Bahnhofstrasse 1\nZurich", "ctrlEmail": "privacy@beispiel-ch.example", "publicBody": "No", "chEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "canPicName": "Privacy Officer", "canPicContact": "privacy@beispiel-ch.example",
        "acts": [{"purpose": "Managing client accounts", "data": "Name, email", "retention": "10 years", "canNeed": "Yes", "canConsent": "implied", "canSens": "No"}],
        "inferred": "No", "recipients": [], "chAbroad": "No", "canAbroad": "Yes", "canAbroadWhere": "Switzerland", "adm": "No", "profiling": "No",
        "rightsContact": "privacy@beispiel-ch.example", "version": "1.0", "effective": "2026-12-01", "further": "No"
    }),
    "pn_can_public": S(regimes=["can"], canJur=["fed"], publicBody="Yes",
                       acts=[{"purpose": "Running your account", "data": "Name, email", "canNeed": "Yes", "canConsent": "optout", "canSens": "No", "retention": "3 years"},
                             {"purpose": "Health survey", "data": "Health information", "canNeed": "No", "canConsent": "implied", "canSens": "Yes", "retention": "1 year"},
                             {"purpose": "Market research", "data": "Purchase history", "canNeed": "No", "canConsent": "none", "canSens": "No", "retention": "1 year"}],
                       canAbroad="No", canRisk=""),
    "pn_uk_can": ("pn", {
        "audience": "applicant", "regimes": ["uk", "can"], "canJur": ["ab"], "channel": ["web"], "children": "No", "canKids": "No", "languages": "English",
        "ctrlName": "Example Recruiting Ltd", "ctrlAddress": "1 High Street\nLondon", "ctrlEmail": "privacy@example.co.uk", "publicBody": "No", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "canPicName": "Data Protection Lead", "canPicContact": "1 High Street, London, privacy@example.co.uk",
        "acts": [{"purpose": "Assessing your application", "data": "CV, references", "basis": "b", "retention": "6 months after the recruitment closes", "required": "contract", "consequence": "We cannot consider you",
                  "canNeed": "Yes", "canConsent": "implied", "canSens": "No"}],
        "inferred": "No", "recipients": [{"who": "ATS Cloud Ltd", "role": "processor", "why": "Applicant tracking", "where": "United Kingdom"}],
        "ukTransfers": "No", "canAbroad": "Yes", "canAbroadWhere": "the United Kingdom", "canAbroadWhy": "",
        "adm": "No", "profiling": "No", "rightsContact": "privacy@example.co.uk", "ukComplaintRoute": "the form at example.co.uk/complaints",
        "restrictionUk": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
    }),
    "pn_can_indirect": S(regimes=["can"], canJur=["qc"], languages="French", source="both",
                         sources=[{"name": "Your employer", "what": "Name, work email", "usedFor": "0", "pub": "No"}],
                         canGovUrl="", canProspect="", canTech="No", canOutQc="No", adm="No"),
    "pn_can_mismatch": S(regimes=["can"], canJur=["fed", "qc"], languages="English", canAbroad="No", canOutQc="No", canTech="No", canProspect="No", canGovUrl="x-ca.example/gov",
                         adm="No", canRelated=""),
}
