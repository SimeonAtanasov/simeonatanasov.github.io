"""Review scenarios for the India module (independent review, 12 November 2026).
Copied to build/in/scen_in_review.py so that dump_in.py picks them up."""
import copy
from scen_in import BASE, IN_FIELDS, SCEN_IN, CA_US


def S(**kw):
    d = copy.deepcopy(BASE); d.update(kw); return ("pn", d)


EU_IN = copy.deepcopy(SCEN_IN["pn_eu_in"][1])
EU_ONLY = copy.deepcopy(EU_IN); EU_ONLY["regimes"] = ["eu"]
EU_ONLY_CLEAN = {k: x for k, x in EU_ONLY.items() if not k.startswith("in")}
EU_ONLY_CLEAN["acts"] = [{k: x for k, x in a.items() if not k.startswith("in")} for a in EU_ONLY["acts"]]

SCEN_RV = {
    # New purpose for data already held, ground 7(a)
    "rv_in_further7a": S(regimes=["in"], further="Yes", furtherWhat="Product research", furtherStart="2027-09-01",
                         furtherData="Order history", furtherRetention="1 year", inFurther="7a"),
    # Data from a third-party source used for a 7(a) purpose
    "rv_in_src7a": S(regimes=["in"], source="both",
                     sources=[{"name": "A data broker", "what": "Mobile number", "usedFor": "3", "pub": "No"}]),
    # Children: exemption claimed, no parental consent method, tracking Yes
    "rv_in_kids_exempt": S(regimes=["in"], inKids="Yes", inKidsHow="", inTrack="Yes", inKidsExempt="Yes",
                           inKidsExemptWhat="Fourth Schedule Part B item 6, confirming that a user is not a child"),
    # Children: exemption, no tracking
    "rv_in_kids_exempt_notrack": S(regimes=["in"], inKids="Yes", inKidsHow="", inTrack="No", inKidsExempt="Yes",
                                   inKidsExemptWhat="educational institution, within Part A item 3"),
    # Disability only
    "rv_in_disab_only": S(regimes=["in"], inKids="No", inDisab="Yes"),
    # Disability unanswered, children unanswered
    "rv_in_kids_unanswered": S(regimes=["in"], inKids="", inDisab=""),
    # EU only with stale India answers vs EU only without them
    "rv_eu_stale_in": ("pn", EU_ONLY),
    "rv_eu_clean": ("pn", EU_ONLY_CLEAN),
    # UK led with India
    "rv_uk_in": ("pn", dict(copy.deepcopy(EU_IN), regimes=["uk", "in"], ukEstablished="Yes")),
    # EU + India with empty India fields
    "rv_eu_in_empty": ("pn", dict({k: x for k, x in copy.deepcopy(EU_IN).items() if not k.startswith("in")},
                                  regimes=["eu", "in"],
                                  acts=[{k: x for k, x in a.items() if not k.startswith("in")} for a in EU_IN["acts"]])),
    # All regimes ticked
    "rv_all": ("pn", dict(copy.deepcopy(EU_IN), regimes=["eu", "uk", "ch", "br", "can", "in", "ca", "us"], canJur=["fed"], **CA_US)),
    # Response period edge cases
    "rv_in_days0": S(regimes=["in"], inDays="0"),
    "rv_in_days_text": S(regimes=["in"], inDays="30 working days"),
    # SDF with processing outside India
    "rv_in_sdf_abroad": S(regimes=["in"], inSdf="Yes", inContactName="Ms A. Rao", inContact="dpo@kiranastores-in.example",
                          inAbroad="Yes", inAbroadWhere="Singapore"),
    # Third Schedule gaming class
    "rv_in_gaming": S(regimes=["in"], inErase="gaming"),
    # 7(a) purpose that still carries an inEnables answer from when it was consent
    "rv_in_7a_stale_enables": S(regimes=["in"], acts=[
        {"purpose": "Answering your customer service messages", "data": "Name, mobile number, your message", "inGround": "7a",
         "inEnables": "STALE ENABLES TEXT", "retention": "1 year"}]),
    # Only 7(i) and 7(d) purposes, but withdrawHow left from an earlier consent purpose
    "rv_in_legit_withdraw": S(regimes=["in"], audience="employee", acts=[
        {"purpose": "Running payroll", "data": "Name, bank account number, salary", "inGround": "7i", "retention": "8 years"}],
        withdrawHow="STALE WITHDRAW TEXT"),
    # India + US only
    "rv_in_us": S(regimes=["in", "us"], usStates=["CO"]),
    # Retention shorter than one year
    "rv_in_short_ret": S(regimes=["in"], acts=[
        {"purpose": "Answering your customer service messages", "data": "Name, mobile number, your message", "inGround": "consent",
         "inEnables": "Replies to your messages", "retention": "30 days"}]),
    # Purposes present but none relies on consent; I05 status
    "rv_in_nopurposes_consent": S(regimes=["in"], acts=[]),
    # Contract exemption with only consent fields
    "rv_in_contract": S(regimes=["in"], inScope="contract"),
    # Joint processing with India leading, Consent Manager without name
    "rv_in_cm_noname": S(regimes=["in"], inCm="Yes", inCmName=""),
    # CH-led with India, India consent purpose and further=consent
    "rv_ch_in_consent": ("pn", dict(copy.deepcopy(SCEN_IN["pn_ch_in"][1]), inFurther="consent",
                                    acts=[{"purpose": "Running your account", "data": "Name, email", "inGround": "consent", "inEnables": "Your account",
                                           "retention": "Until you close your account", "chGround": "consent"}])),
    # BR-led with India, Brazil consent purpose
    "rv_br_in_consent": ("pn", dict(copy.deepcopy(SCEN_IN["pn_br_in"][1]),
                                    acts=[{"purpose": "Running your account", "data": "Name, email", "brBasis": "I", "inGround": "consent",
                                           "inEnables": "Your account", "retention": "Until you close your account"}])),
    # Children: tracking and exemption questions left unanswered
    "rv_in_kids_track_unanswered": S(regimes=["in"], inKids="Yes", inKidsHow="A parent confirms through DigiLocker.", inTrack="", inKidsExempt=""),
    # Children and disability both, public body
    "rv_in_public_body": S(regimes=["in"], publicBody="Yes", acts=[
        {"purpose": "Issuing ration cards", "data": "Name, address, Aadhaar number", "inGround": "7b", "retention": "10 years"}]),
    # Consent Manager unanswered, SDF unanswered
    "rv_in_cm_sdf_unanswered": S(regimes=["in"], inCm="", inSdf=""),
}
