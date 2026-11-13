# Reviewer scenarios for the Canada module (12 November 2026). Builds on BASE from the builder's scen_can.py (copied here).
import copy
from scen_can import BASE, CA_US

def S(**kw):
    d = copy.deepcopy(BASE); d.update(kw); return ("pn", d)

CAN_ONLY_RECIPS = [{"who": "PayFast Canada Ltd", "role": "processor", "why": "Payment processing", "where": "Canada"},
                   {"who": "Courier Express", "role": "controller", "why": "Delivering your parcels", "where": "Ontario"}]

# Stale Canada / Quebec answers left in the state while "can" or "qc" is not ticked.
STALE_CAN = {"canJur": ["fed", "qc", "ab", "bc"], "canPicName": "Stale CPO", "canPicContact": "stale@example.ca", "canGovUrl": "stale.example/gov",
             "canForWhom": "Stale Partner", "canRelated": "Yes", "canRelatedWhat": "STALE related", "canKids": "Yes", "canKidsHow": "STALE kids",
             "canMeans": "STALE means", "canProspect": "Yes", "canTech": "Yes", "canTechWhat": "STALE tech", "canTechHow": "STALE how", "canRisk": "STALE risk",
             "canAbroad": "Yes", "canAbroadWhere": "STALE country", "canAbroadWhy": "STALE why", "canOutQc": "Yes", "canAdm": "Yes", "canAdmWhat": "STALE adm",
             "canFurther": "law", "canFurtherLaw": "STALE law"}

SCEN_RV = {
    # 1. Quebec ticked, organisation in Toronto, a recipient in Ontario, nothing outside Canada: "outside Quebec" answered No.
    "rv_qc_ontario_no": S(regimes=["can"], canJur=["fed", "qc"], languages="French, English", recipients=CAN_ONLY_RECIPS, canAbroad="No", canOutQc="No",
                          canGovUrl="maplegoods-ca.example/gov", canProspect="No", canTech="No", adm="No", profiling="No"),
    # 2. A purpose needed for the service, "without consent", no provision named.
    "rv_need_none_nolaw": S(regimes=["can"], canJur=["fed"],
                            acts=[{"purpose": "Processing and delivering your orders", "data": "Name, address", "canNeed": "Yes", "canConsent": "none", "canSens": "No", "retention": "2 years"}]),
    # 3. A new purpose the law requires: box vs the generic "Changes" paragraph.
    "rv_further_law": S(regimes=["can"], canJur=["fed"], further="Yes", furtherWhat="Reporting large cash transactions", furtherStart="2027-03-01",
                        furtherData="Name, transaction details", furtherRetention="5 years", canFurther="law", canFurtherLaw="Proceeds of Crime (Money Laundering) and Terrorist Financing Act, section 7"),
    # 4. Quebec, profiling Yes and section 8.1 technology No, opt-out recommendations based on browsing.
    "rv_qc_profiling_tech_no": S(regimes=["can"], canJur=["qc"], languages="French", canAbroad="No", canOutQc="No", recipients=[{"who": "PayFast Quebec Inc.", "role": "processor", "why": "Payment processing", "where": "Montreal"}],
                                 canGovUrl="x-ca.example/gov", canProspect="Yes", canTech="No", adm="No", profiling="Yes"),
    # 5. Canada federal only, stale Quebec answers in the state (Quebec unticked after being ticked).
    "rv_fed_stale_qc": S(regimes=["can"], canJur=["fed"], canGovUrl="stale.example/gov", canForWhom="Stale Partner", canProspect="Yes", canTech="Yes",
                         canTechWhat="STALE tech", canTechHow="STALE how", canOutQc="Yes", canAdm="Yes", canAdmWhat="STALE adm"),
    # 6. EU-led, Canada federal only, stale Quebec answers; adm Yes.
    "rv_eu_can_fed_stale_qc": ("pn", {
        "audience": "client", "regimes": ["eu", "can"], "canJur": ["fed"], "channel": ["web"], "children": "No", "canKids": "No", "languages": "English",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "canPicName": "Head of Privacy", "canPicContact": "Herengracht 1, Amsterdam, privacy@example.nl", "canRelated": "No", "canGovUrl": "STALE", "canProspect": "Yes", "canTech": "Yes", "canTechWhat": "STALE", "canTechHow": "STALE", "canOutQc": "Yes", "canAdm": "Yes", "canAdmWhat": "STALE adm",
        "acts": [{"purpose": "Managing our contract with your employer", "data": "Name, business email", "basis": "b", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you",
                  "canNeed": "Yes", "canConsent": "implied", "canSens": "No"}],
        "marketing": "No", "inferred": "No", "recipients": [], "transfers": "No", "canAbroad": "Yes", "canAbroadWhere": "the Netherlands",
        "adm": "Yes", "admWhat": "We screen clients automatically against sanctions lists", "admLogic": "Name matching", "admEffect": "A match blocks the contract", "admBasis": "law", "admLaw": "EU sanctions regulations",
        "rightsContact": "privacy@example.nl", "saName": "Autoriteit Persoonsgegevens", "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"}),
    # 7. Alberta only, Canada-led, service provider outside Canada.
    "rv_ab_only": S(regimes=["can"], canJur=["ab"], canAbroad="Yes", canAbroadWhere="the United States", canAbroadWhy="Host our customer database"),
    # 8. British Columbia only, all in Canada.
    "rv_bc_only": S(regimes=["can"], canJur=["bc"], canAbroad="No", recipients=CAN_ONLY_RECIPS),
    # 9. Quebec, children, no description of how a parent consents, no consent-based purpose except "none".
    "rv_qc_kids_nohow": S(regimes=["can"], canJur=["qc"], languages="French", canKids="Yes", canKidsHow="", canGovUrl="x-ca.example/gov", canProspect="No", canTech="No", canAbroad="No", canOutQc="No",
                          recipients=[{"who": "PayFast Quebec Inc.", "role": "processor", "why": "Payment processing", "where": "Montreal"}],
                          acts=[{"purpose": "Running a youth chess club", "data": "Name, age", "canNeed": "Yes", "canConsent": "none", "canLaw": "a law", "canSens": "No", "retention": "1 year"}]),
    # 10. EU-led WITHOUT Canada ticked, but with every Canada answer stale in the state: must equal the deployed version.
    "rv_eu_stale_can": ("pn", dict(copy.deepcopy(BASE), **STALE_CAN, **{"regimes": ["eu"], "acts": [dict(a, basis="b") for a in BASE["acts"]], "euEstablished": "No", "ctrlCountry": "Canada", "repExempt": "Yes", "transfers": "No"})),
    # 11. Brazil + California without Canada, stale Canada answers.
    "rv_br_ca_stale_can": ("pn", dict(copy.deepcopy(BASE), **STALE_CAN, **CA_US, **{"regimes": ["br", "ca"], "brEstablished": "No", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana", "brEncContact": "a@x-br.example",
                                                                                  "acts": [dict(a, brBasis="V") for a in BASE["acts"]], "brTransfers": "No", "brAdm": "No"})),
    # 12. Quebec, sensitive information used with express consent, and a residual risk; opt-out use with a residual risk of significant harm.
    "rv_qc_risk_optout": S(regimes=["can"], canJur=["fed", "qc"], languages="French", canGovUrl="x-ca.example/gov", canProspect="No", canTech="No", canOutQc="Yes",
                           acts=[{"purpose": "Sharing your purchase history with advertising partners", "data": "Purchase history, email", "canNeed": "No", "canConsent": "optout", "canSens": "No", "retention": "2 years"}],
                           canRisk="Advertising partners can combine your purchase history with other data about you."),
    # 13. Canada-led, adm Yes but Quebec not ticked: no section 12.1 text expected.
    "rv_fed_adm": S(regimes=["can"], canJur=["fed"], adm="Yes", admWhat="We approve or refuse store credit applications automatically", admLogic="Payment history", admEffect="A refusal means you pay up front"),
    # 14. Quebec-led, prospecting Yes with only express-consent newsletter: section 22 statement and withdraw.
    "rv_qc_only_full": S(regimes=["can"], canJur=["qc"], languages="French", canGovUrl="x-ca.example/gov", canProspect="Yes", canTech="No", canAbroad="Yes", canAbroadWhere="the United States", canOutQc="Yes", adm="No", profiling="No"),
    # 15. Canada with UK lead and Quebec: section numbers and the "only where" sentence.
    "rv_uk_can_qc": ("pn", {
        "audience": "client", "regimes": ["uk", "can"], "canJur": ["qc"], "channel": ["web"], "children": "No", "canKids": "No", "languages": "English",
        "ctrlName": "Example Ltd", "ctrlAddress": "1 High Street\nLondon", "ctrlEmail": "privacy@example.co.uk", "publicBody": "No", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "canPicName": "Data Protection Lead", "canPicContact": "1 High Street, London, privacy@example.co.uk", "canGovUrl": "example.co.uk/gov", "canProspect": "Yes", "canTech": "No", "canOutQc": "Yes",
        "acts": [{"purpose": "Sending you offers", "data": "Name, email", "basis": "f", "li": "Promoting our services", "retention": "2 years", "required": "optional", "consequence": "No offers", "canNeed": "No", "canConsent": "optout", "canSens": "No"}],
        "marketing": "Yes", "inferred": "No", "recipients": [], "ukTransfers": "No", "canAbroad": "Yes", "canAbroadWhere": "the United Kingdom",
        "adm": "No", "profiling": "No", "canAdm": "No", "rightsContact": "privacy@example.co.uk", "withdrawHow": "Unsubscribe link", "ukComplaintRoute": "the form at example.co.uk/complaints",
        "restrictionUk": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"}),
}

# 16. EU-led with Quebec: profiling Yes in the GDPR section, section 8.1 technology No in the Canada section.
_e = copy.deepcopy(SCEN_RV["rv_eu_can_fed_stale_qc"][1])
_e.update({"canJur": ["fed", "qc"], "adm": "No", "profiling": "Yes", "profilingWhat": "We score clients by engagement to decide whom to invite to events",
           "canTech": "No", "canGovUrl": "example.nl/gov", "canProspect": "No", "canOutQc": "Yes", "canAdm": "No", "canAdmWhat": "", "canMeans": "Event registration form", "languages": "English, French"})
SCEN_RV["rv_eu_can_qc_profiling"] = ("pn", _e)
# 17. Canada-led with Quebec, main automated decision question answered No (for example carried over from a GDPR-led draft), Quebec question never answered.
SCEN_RV["rv_qc_adm_no_carried"] = S(regimes=["can"], canJur=["fed", "qc"], languages="French", canGovUrl="x-ca.example/gov", canProspect="No", canTech="No", canOutQc="Yes", adm="No", profiling="No", canAdm="")
