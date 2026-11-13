"""Independent review of the South Africa module (13 November 2026): scenarios that reproduce each finding in
findings.json (SCEN_RV) and the result each should give AFTER the fix (EXP_RV). Pins only what each finding needs."""
import sys
sys.path.insert(0, "/home/claude/ng-build/build/za")
from scen_za import BASE, FULL, XROWS, CA_US, ACTS, S

def rec(who, where, why="Hosting our website and app", role="processor"):
    return {"who": who, "role": role, "why": why, "where": where}

SCEN_RV = {
    # ZA01: a four-digit postcode after a province or "South Africa" overrides leftover foreign words.
    "rv_pc_override": S(regimes=["za"], zaAbroad="No",
                        recipients=[rec("Fynbos Pay (Pty) Ltd", "Johannesburg", "Processing card payments"),
                                    rec("Kelp Edge Ltd", "Teraco CT1, Western Cape 7441; DR in Slough"),
                                    rec("Karoo Cable Ltd", "Cape Town 8001 South Africa and Ashburn", "Delivering our content")]),
    # ZA02: EMEA, MEA, Africa, southern and sub-Saharan Africa are stripped as filler next to a South African name.
    "rv_emea": S(regimes=["za"], zaAbroad="No",
                 recipients=[rec("Fynbos Pay (Pty) Ltd", "Johannesburg", "Processing card payments"),
                             rec("Savanna Support Ltd", "Johannesburg and EMEA", "Answering support requests"),
                             rec("Acacia Analytics Ltd", "Cape Town and Africa", "Analysing app use")]),
    # ZA03: names shared with places abroad count as South African anywhere in the entry, not only next to a South African name.
    "rv_amb_pair": S(regimes=["za"], zaAbroad="No",
                     recipients=[rec("Fynbos Pay (Pty) Ltd", "Johannesburg", "Processing card payments"),
                                 rec("Harbour Mail Ltd", "Cape Town and Wellington", "Sending our emails"),
                                 rec("Tyne Print Ltd", "Johannesburg and Newcastle", "Printing certificates")]),
    # ZA04: words for an unnamed second location (disaster recovery, backups, cloud) are stripped as filler.
    "rv_dr_unnamed": S(regimes=["za"], zaAbroad="No",
                       recipients=[rec("Fynbos Pay (Pty) Ltd", "Johannesburg", "Processing card payments"),
                                   rec("Table Mountain Cloud (Pty) Ltd", "Cape Town, with disaster recovery"),
                                   rec("Blouberg Backup (Pty) Ltd", "Cape Town with backups on Google Cloud", "Backing up our data")]),
    # ZA05: s. 18(1)(g) level of protection is not given for information held in the organisation's own offices abroad.
    "rv_own_level": S(regimes=["za"], zaAbroad="Yes", zaXrows=[{"recipient": "Protea Learning (Pty) Ltd", "country": "Mauritius", "basis": "own"}]),
    "rv_offshore_level": S(regimes=["za"], zaScope="means", zaOffWhere="Ireland", ctrlName="Protea Learning Ltd", ctrlAddress="1 Grand Canal Square\nDublin 2, Ireland",
                           recipients=[rec("Fynbos Pay (Pty) Ltd", "Johannesburg", "Processing card payments")], zaAbroad="Yes",
                           zaXrows=[{"recipient": "Protea Learning Ltd", "country": "Ireland", "basis": "own"}]),
    # ZA06: a ZA-led notice prints the shared automated-decision placeholder with no missing row.
    "rv_adm_blank": S(regimes=["za"], adm="Yes", admWhat="", zaAdm="No"),
    # ZA07: "It is free of charge." follows a fee for access.
    "rv_fee_free": S(regimes=["za"], zaFee="Yes"),
    # ZA08: section 28 text names only religious organisations and institutions; s. 28(1)(c) other institutions are misdescribed.
    "rv_s28_other": S(regimes=["za"], acts=ACTS + [{"purpose": "Offering chaplaincy support to students who ask for it", "data": "Name, course", "zaBasis": "consent",
                                                     "zaSpecial": "specific", "zaSpecialSec": "28", "zaSpecialWhat": "Your religious beliefs", "zaLaw": "no",
                                                     "zaMand": "voluntary", "zaConseq": "We do not arrange chaplaincy support", "retention": "Until the course ends"}]),
    # ZA09: "East London" alone, an office park called Woodlands in Woodmead, and Marine Parade in Durban are classed as abroad.
    "rv_false_abroad": S(regimes=["za"], zaAbroad="No",
                         recipients=[rec("Buffalo Print (Pty) Ltd", "East London", "Printing certificates"),
                                     rec("Woodmead Hosting (Pty) Ltd", "Woodlands Office Park, Woodmead"),
                                     rec("Golden Mile Couriers (Pty) Ltd", "Marine Parade, Durban", "Delivering course packs")]),
    # ZA10: direct marketing Yes, no channel: the notice says no electronic marketing but gives an unsubscribe route.
    "rv_dm_none_route": S(regimes=["za"], zaDmElec="none", zaDmPost="No"),
    # ZA11: complain to the Regulator "at any time"; postal address not on the Regulator's contact page.
    "rv_regulator": S(regimes=["za"]),
    # ZA12: V11 "No recipients, confirmed." when there are recipients but no operator.
    "rv_v11_note": S(regimes=["za"], recipients=[rec("Services SETA", "Johannesburg, Gauteng", "Reporting on funded learnerships", "authority")]),
    # ZA13: domiciled in South Africa, with a foreign address.
    "rv_scope_addr": S(regimes=["za"], zaScope="in", ctrlAddress="1 Grand Canal Square\nDublin 2, Ireland"),
    # ZA14: special personal information sent abroad under a binding agreement: no s. 57(1)(d) note in V12.
    "rv_s57_agreement": S(regimes=["za"], zaAbroad="Yes", zaXrows=[XROWS[0]],
                          recipients=[rec("Redwood Cloud Inc.", "Oregon, United States")],
                          acts=ACTS + [FULL["acts"][3]]),
    # ZA15: electronic direct marketing to both customers and others, while the marketing purpose rests only on legitimate interests.
    "rv_dm_both_li": S(regimes=["za"], zaDmElec="both", acts=ACTS[:2] + [dict(ACTS[2], zaBasis="li", zaBasisWhat="marketing our courses")]),
    # ZA16: a transfer row and the recipients list give the same recipient two locations, one South African; V12 is only a check.
    "rv_loc_conflict": S(regimes=["za"], zaAbroad="Yes", zaXrows=[XROWS[0]], recipients=[rec("Redwood Cloud Inc.", "Cape Town (af-south-1)")]),
    # ZA17: children's information on a competent person's consent: withdrawal names only "your consent".
    "rv_kids_withdraw": S(regimes=["za"], zaKids="Yes", zaKidsBasis="competent", zaKidsHow="A parent or guardian signs up and confirms by email",
                          zaDmElec="customers", acts=[dict(a, zaBasis="contract") for a in ACTS]),
    # ZA18: wording and citations: V12 note on unknown places, V10 citation, s. 27(1)(d) research text, s. 33 text for a private body.
    "rv_wording": S(regimes=["za"], zaIo="", zaAbroad="No", recipients=[rec("Mystery Hosting", "Data centre", "Hosting")],
                    acts=ACTS + [{"purpose": "Studying learner outcomes", "data": "Course results", "zaBasis": "li", "zaBasisWhat": "improving our courses",
                                  "zaSpecial": "research", "zaSpecialWhat": "Disability information", "zaLaw": "no", "zaMand": "voluntary", "zaConseq": "Nothing changes for you", "retention": "3 years"},
                                 {"purpose": "Access control at our offices", "data": "Name", "zaBasis": "li", "zaBasisWhat": "keeping our premises secure", "zaSpecial": "specific", "zaSpecialSec": "33",
                                  "zaSpecialWhat": "Fingerprint templates", "zaLaw": "no", "zaMand": "voluntary", "zaConseq": "You sign in at reception instead", "retention": "Until you leave"}]),
    # ZA02 in a notice led by the GDPR: EU lead with the location bug.
    "rv_eu_emea": S(regimes=["eu", "za"], euEstablished="No", ctrlCountry="South Africa", repName="EU Rep GmbH", repContact="rep@eurep.example", dpo="No", joint="No",
                    acts=[dict(a, basis="b") for a in ACTS[:2]] + [dict(ACTS[2], basis="a")], transfers="No", withdrawHow="Use the unsubscribe link in each email",
                    zaAbroad="No", recipients=[rec("Savanna Support Ltd", "Johannesburg and EMEA", "Answering support requests")]),
}

NO_XFER = "We do not transfer personal information to third parties outside South Africa."
EXP_RV = {
    "rv_pc_override": dict(notexts=[NO_XFER], rows={"V12": "missing"}),
    "rv_emea": dict(notexts=[NO_XFER], rows={"V12": "missing"}),
    "rv_amb_pair": dict(notexts=[NO_XFER], rows={"V12": "missing"}),
    "rv_dr_unnamed": dict(notexts=[NO_XFER], rows={"V12": "missing"}),
    "rv_own_level": dict(texts=["- Protea Learning (Pty) Ltd (Mauritius): It stays within our own organisation, on our own systems or at our own offices there; no third party receives it. [The level of protection in that country (s. 18(1)(g)).]"],
                         rows={"V12": "missing"}),
    "rv_offshore_level": dict(texts=["[The level of protection in that country (s. 18(1)(g)).]"], rows={"V12": "missing"}),
    "rv_adm_blank": dict(texts=["[the decisions and what they are based on]"], rows={"V19": "missing"}),
    "rv_fee_free": dict(notexts=["It is free of charge."], texts=["Objections and requests for correction or deletion are free of charge."]),
    "rv_s28_other": dict(notexts=["we are a spiritual or religious organisation, or an institution founded on religious or philosophical principles"],
                         texts=["because section 28 allows it: [how section 28 applies to you]; we do not supply it to third parties without your consent (s. 28(1), (3))."], rows={"V05": "missing"}),
    "rv_false_abroad": dict(notexts=["are outside South Africa. Answer Yes", "is outside South Africa. Answer Yes"]),
    "rv_dm_none_route": dict(notexts=["To stop direct marketing: use the unsubscribe link"], rows={"V18": "missing"}),
    "rv_regulator": dict(notexts=["complain to the Information Regulator at any time", "P.O. Box 31533"],
                         texts=["You can also complain to the Information Regulator, in writing on its Form 5 or online (s. 74; Regulations, reg 7):"]),
    "rv_v11_note": dict(rows={"V11": "ok"}, notes=["Recipients, each with what it does with the information and where it is located."]),
    "rv_scope_addr": dict(rows={"V02": "check"}, notes=["You answered that you are domiciled in South Africa, but your address is outside South Africa"]),
    "rv_s57_agreement": dict(notes=["Section 57(1)(d) speaks of a foreign country that does not provide an adequate level of protection"]),
    "rv_dm_both_li": dict(rows={"V18": "warn"}, notes=["People who are not your customers can receive electronic direct marketing only with their consent (s. 69(1)(a))"]),
    "rv_loc_conflict": dict(rows={"V12": "warn"}, notes=["The recipients list places Redwood Cloud Inc. in South Africa"]),
    "rv_kids_withdraw": dict(texts=["Where we rely on your consent, or on the consent of a parent, guardian or other competent person for a child, you or they can withdraw it at any time:"]),
    "rv_wording": dict(notes=["until each location names only South African places", "(PAIA s. 1; Guidance Note on Information Officers, 1.3, 2.2)"],
                       texts=["for historical, statistical or research purposes, where the purpose serves a public interest and the processing is necessary for it, or where asking for consent is impossible or would take disproportionate effort",
                              "We process it because we obtained the information in accordance with the law (s. 33(1))."],
                       notexts=["we are charged by law with applying criminal law"]),
    "rv_eu_emea": dict(notexts=[NO_XFER], rows={"V12": "missing"}),
}

# Applied to the Australia module as well (ZA01, ZA02, ZA04): the same location rules in auWhere. Added by the builder.
sys.path.insert(0, "/home/claude/ng-build/build/au")
from scen_au import S as S_AU, BASE as BASE_AU
_AUREC = BASE_AU["recipients"]
def _au(where):
    return S_AU(regimes=["au"], auAbroad="No", recipients=_AUREC + [{"who": "Kelp Edge Ltd", "role": "processor", "why": "Hosting our backups", "where": where}])
SCEN_RV.update({
    "rv_au_pc_override": _au("Sydney NSW 2000 and Reykjavik"),
    "rv_au_apac": _au("Sydney and APAC"),
    "rv_au_dr": _au("Sydney, with disaster recovery"),
})
_AU_NO = "We are not likely to disclose personal information to recipients outside Australia."
EXP_RV.update({
    "rv_au_pc_override": dict(texts=["[Check where Kelp Edge Ltd (Sydney NSW 2000 and Reykjavik) is located."], notexts=[_AU_NO], rows={"U10": "missing"}),
    "rv_au_apac": dict(texts=["[Check where Kelp Edge Ltd (Sydney and APAC) is located."], notexts=[_AU_NO], rows={"U10": "missing"}),
    "rv_au_dr": dict(texts=["[Check where Kelp Edge Ltd (Sydney, with disaster recovery) is located."], notexts=[_AU_NO], rows={"U10": "missing"}),
})
