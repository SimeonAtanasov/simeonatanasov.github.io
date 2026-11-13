# Review scenarios for the Japan module (independent review, 12 November 2026).
# Each entry: name -> ("pn", state). Built from scen_jp.BASE with deep copies.
import copy
from scen_jp import BASE, JP_FIELDS, CA_US


def J(**kw):
    d = copy.deepcopy(BASE)
    d["regimes"] = ["jp"]
    d.update(copy.deepcopy(kw))
    return ("pn", d)


def ACT(purpose, data, **kw):
    a = {"purpose": purpose, "data": data, "jpSens": "No", "retention": "1 year"}
    a.update(kw)
    return a


PROC = [{"who": "Kuroneko Delivery Co., Ltd.", "role": "processor", "why": "Delivering your orders", "where": "Tokyo"}]

SCEN_RV = {
    # 1. Special care-required data with every Article 20(2) ground, purposes ending in a full stop.
    "rv_jp_sens_grounds": J(acts=[
        ACT("Delivering orders.", "Name, address"),
        ACT("Reporting to the labour inspectorate", "Health check results", jpSens="Yes", jpSensG="law"),
        ACT("First aid at events", "Medical history", jpSens="Yes", jpSensG="life"),
        ACT("Public health surveys", "Health check results", jpSens="Yes", jpSensG="health"),
        ACT("Police enquiries", "Criminal record", jpSens="Yes", jpSensG="state"),
        ACT("University study", "Disability", jpSens="Yes", jpSensG="academic"),
        ACT("Press monitoring", "Creed", jpSens="Yes", jpSensG="published"),
        ACT("CCTV in our shops", "Images showing visible disability", jpSens="Yes", jpSensG="visible"),
        ACT("Group health service", "Medical history", jpSens="Yes", jpSensG="received"),
        ACT("Recording allergies", "Food allergies", jpSens="Yes")]),
    # 2. Opt-out provision with every item, plus special care-required data elsewhere.
    "rv_jp_optout_full": J(
        recipients=PROC + [{"who": "List Brokers K.K.", "role": "controller", "why": "Selling mailing lists", "where": "Tokyo", "jpProv": "optout"}],
        jpOptItems="Name, address, age band", jpOptAcq="From our order forms", jpOptHow="Electronic file sent monthly", jpOptReq="Email optout@sakuratea-jp.example",
        jpOptUpdate="Monthly, from our order records", jpOptStart="2027-02-01",
        acts=BASE["acts"] + [ACT("Recording allergies", "Food allergies", jpSens="Yes", jpSensG="consent")]),
    # 3. Opt-out with items missing AND special care-required data: is the special-data warning kept?
    "rv_jp_optout_missing_sens": J(
        recipients=PROC + [{"who": "List Brokers K.K.", "role": "controller", "why": "Selling mailing lists", "where": "Tokyo", "jpProv": "optout"}],
        jpOptItems="Name, address",
        acts=BASE["acts"] + [ACT("Recording allergies", "Food allergies", jpSens="Yes", jpSensG="consent")]),
    # 4. Joint use with gaps: no recipient name, no purposes of joint users.
    "rv_jp_joint_partial": J(
        recipients=PROC + [{"role": "joint", "why": "Group marketing", "where": "Tokyo", "jpProv": "joint"}],
        jpJointItems="Name, email address", jpJointResp="Sakura Tea Co., Ltd."),
    # 5. Joint use complete, scope left to the recipient list (business itself not listed).
    "rv_jp_joint_full": J(
        recipients=PROC + [{"who": "Sakura Tea Holdings Co., Ltd.", "role": "controller", "why": "Group marketing", "where": "Tokyo", "jpProv": "joint"}],
        jpJointItems="Name, email address", jpJointPurpose="Group offers", jpJointResp="Sakura Tea Holdings Co., Ltd., 2-2-2 Ginza, Chuo-ku, Tokyo, Representative Director Ichiro Suzuki"),
    # 6. Third parties in foreign countries: consent without details, empty basis, exception, odd country names.
    "rv_jp_x_mixed": J(jpAbroad="Yes", jpForeignWhere="Singapore", jpXrows=[
        {"recipient": "Lion Data Pte. Ltd.", "country": "Singapore", "basis": "consent"},
        {"recipient": "Mystery Abroad", "country": "Brazil"},
        {"recipient": "Embassy liaison", "country": "Australia", "basis": "exception"},
        {"recipient": "Praha Tea s.r.o.", "country": "Czechia", "basis": "designated"},
        {"recipient": "London Tea Ltd", "country": "England", "basis": "designated"},
        {"recipient": "Zurich Tea AG", "country": "Switzerland", "basis": "designated"},
        {"recipient": "Seoul Tea Co.", "country": "South Korea", "basis": "framework"}]),
    # 7. A foreign processor provided on consent (non-designated, no system): is it called an entrusted party under Art. 27(5)(i)?
    "rv_jp_x_proc_consent": J(jpAbroad="Yes", jpForeignWhere="Viet Nam",
        recipients=PROC + [{"who": "Saigon Support Co.", "role": "processor", "why": "Customer support", "where": "Viet Nam"}],
        jpXrows=[{"recipient": "Saigon Support Co.", "country": "Viet Nam", "basis": "consent", "system": "Viet Nam's personal data protection law", "measures": "Contract with security clauses"}]),
    # 8. jpAbroad Yes, but a processor abroad is not in the foreign list.
    "rv_jp_x_unlisted": J(jpAbroad="Yes", jpForeignWhere="Singapore and the United States",
        recipients=PROC + [{"who": "Cloudbox Inc.", "role": "processor", "why": "Hosting", "where": "United States"},
                           {"who": "Lion Data Pte. Ltd.", "role": "processor", "why": "Analytics", "where": "Singapore"}],
        jpXrows=[{"recipient": "Lion Data Pte. Ltd.", "country": "Singapore", "basis": "consent", "system": "PDPA 2012", "measures": "Contract"}]),
    # 9. jpAbroad No, but an independent third party abroad is listed (consent basis).
    "rv_jp_abroad_no_ctrl": J(jpAbroad="No",
        recipients=PROC + [{"who": "Seoul Tea Co.", "role": "controller", "why": "Running a joint promotion", "where": "Seoul", "jpProv": "consent"}]),
    # 10. jpAbroad unanswered with processors abroad; no foreign-country names in security measures.
    "rv_jp_abroad_unans": J(jpAbroad="",
        recipients=PROC + [{"who": "Cloudbox Inc.", "role": "processor", "why": "Hosting", "where": "United States"}]),
    # 11. Offshore business: no country given, address without a country, no jpForeignWhere.
    "rv_jp_offshore_nowhere": J(jpScope="abroad", jpOffWhere="", ctrlName="Lotus Apps Pte. Ltd.", ctrlAddress="1 Marina Way\n018989",
        jpForeignWhere=""),
    # 12. Fee unanswered, accredited organisation partly filled, complaint contact falls back to email.
    "rv_jp_fee_acc": J(jpFee="", jpAcc="Yes", jpAccName="Japan Retail Privacy Association", jpAccContact="", jpComplaint=""),
    # 13. New purpose with consent; also answers the general withdrawal and retention fields.
    "rv_jp_further_consent": J(further="Yes", furtherWhat="Recommending teas", furtherStart="2027-08-01", furtherData="Purchase history",
        jpFurther="consent", furtherRetention="2 years", withdrawHow="Use the switch in your account settings"),
    # 14. No purposes at all.
    "rv_jp_noacts": J(acts=[]),
    # 15. Recipient without role, reasons beginning with proper nouns, empty reason.
    "rv_jp_recipients_text": J(recipients=[
        {"who": "Japan Post Co., Ltd.", "role": "processor", "why": "Japan Post delivers your parcels", "where": "Tokyo"},
        {"who": "Tokyo Tax Office", "role": "authority", "why": "", "where": "Tokyo", "jpProv": "law"},
        {"who": "Partner Shop K.K.", "role": "controller", "why": "Kyoto shop offers.", "where": "Kyoto", "jpProv": "exception"},
        {"who": "Unclear Ltd", "why": "Something", "where": "Nagano"}]),
    # 16. A sole trader (no corporation): representative left empty.
    "rv_jp_individual": J(ctrlName="Taro Yamada (sole trader)", jpRepName="", jpKind="indiv"),
    # 17. Japan-led with only special care-required data and no recipients answer; profiling with ADM fields.
    "rv_jp_adm": J(adm="Yes", admWhat="We decide automatically whether to offer you credit terms", admLogic="Payment history and order value", admEffect="You may pay later or not",
        profiling=""),
    # 18. Switzerland leads, Japan added.
    "rv_ch_jp": ("pn", dict(copy.deepcopy(JP_FIELDS), **{
        "audience": "visitor", "regimes": ["ch", "jp"], "channel": ["web"], "languages": "German, Japanese",
        "ctrlName": "Alpen Tee AG", "ctrlAddress": "Bahnhofstrasse 1\n8001 Zurich", "ctrlEmail": "privacy@alpentee-ch.example", "joint": "No", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "Switzerland", "jpRepName": "Anna Muster, CEO",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "jpSens": "No", "retention": "Until you close your account"}],
        "recipients": [], "chTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@alpentee-ch.example",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 19. Canada leads, Japan added.
    "rv_can_jp": ("pn", dict(copy.deepcopy(JP_FIELDS), **{
        "audience": "visitor", "regimes": ["can", "jp"], "channel": ["web"], "languages": "English, French, Japanese",
        "ctrlName": "Maple Tea Inc.", "ctrlAddress": "1 King Street\nToronto ON", "ctrlEmail": "privacy@mapletea-ca.example", "source": "direct",
        "canJur": ["fed"], "jpScope": "abroad", "jpOffWhere": "Canada",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "jpSens": "No", "retention": "Until you close your account", "canConsent": "express"}],
        "recipients": [], "adm": "No", "profiling": "No", "rightsContact": "privacy@mapletea-ca.example",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 20. India leads, Japan added.
    "rv_in_jp": ("pn", dict(copy.deepcopy(JP_FIELDS), **{
        "audience": "visitor", "regimes": ["in", "jp"], "channel": ["web"], "languages": "English, Japanese",
        "ctrlName": "Lotus Chai Pvt Ltd", "ctrlAddress": "1 MG Road\nBengaluru", "ctrlEmail": "privacy@lotuschai-in.example", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "India",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "jpSens": "No", "retention": "Until you close your account", "inGround": "consent"}],
        "recipients": [], "adm": "No", "profiling": "No", "rightsContact": "privacy@lotuschai-in.example",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 21. Japan leads with other US states only.
    "rv_jp_us": J(regimes=["jp", "us"], usStates=["CO"], usCats=[{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}]),
    # 22. EU leads: special category data marked for Japan too, Japan third-party basis, new purpose with Japan answer missing.
    "rv_eu_jp_sens": ("pn", dict(copy.deepcopy(JP_FIELDS), **{
        "audience": "client", "regimes": ["eu", "jp"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl",
        "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "the Netherlands", "jpRepName": "Jan de Vries, Managing Director",
        "acts": [
            {"purpose": "Inviting you to our client events", "data": "Name, business email, dietary requirements", "basis": "a", "art9": "a", "retention": "Until you withdraw consent", "required": "optional", "consequence": "No invitations", "jpSens": "Yes", "jpSensG": "consent"}],
        "marketing": "No", "inferred": "No",
        "recipients": [{"who": "Event Partner GmbH", "role": "controller", "why": "Co-hosting events", "where": "Germany", "jpProv": "consent"}],
        "transfers": "No", "jpAbroad": "Yes", "jpXrows": [{"recipient": "Event Partner GmbH", "country": "Germany", "basis": "designated"}],
        "adm": "No", "profiling": "No", "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl",
        "version": "2.0", "effective": "2027-01-01", "further": "Yes", "furtherWhat": "Client satisfaction research", "furtherStart": "2027-06-01",
        "furtherData": "Name, business email", "furtherBasis": "f", "furtherCompat": "Linked to client service"})),
    # 23. EU public body with people in Japan.
    "rv_eu_jp_public": ("pn", dict(copy.deepcopy(JP_FIELDS), **{
        "audience": "visitor", "regimes": ["eu", "jp"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "City Museum of Utrecht", "ctrlAddress": "Museumplein 1\nUtrecht\nthe Netherlands", "ctrlEmail": "privacy@museum.example.nl",
        "publicBody": "Yes", "euEstablished": "Yes", "dpo": "Yes", "dpoContact": "fg@museum.example.nl", "joint": "No", "source": "direct",
        "jpScope": "abroad", "jpOffWhere": "the Netherlands",
        "acts": [{"purpose": "Selling tickets", "data": "Name, email", "basis": "e", "retention": "1 year", "required": "contract", "consequence": "No ticket", "jpSens": "No"}],
        "recipients": [], "transfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@museum.example.nl",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 24. Indirect collection only, with sources.
    "rv_jp_indirect": J(source="indirect", sources=[{"name": "Partner tea shops", "what": "Name and order history", "usedFor": "1", "pub": "No"},
                                                     {"name": "Public trade register", "what": "Company officer names", "usedFor": "", "pub": "Yes"}]),
    # 25. Children answered Yes.
    "rv_jp_kids": J(jpKids="Yes", audience="children"),
    # 26. Japan in scope "in" but foreign processors marked as designated and contract; jpForeignWhere empty.
    "rv_jp_x_noforeignwhere": J(jpAbroad="Yes", jpForeignWhere="",
        recipients=PROC + [{"who": "Cloudbox Inc.", "role": "processor", "why": "Hosting", "where": "United States"}],
        jpXrows=[{"recipient": "Cloudbox Inc.", "country": "United States", "basis": "contract"}]),
}

# Expectations after the fixes (added by the builder when the findings were applied).
JPX = ["Additional information for people in Japan", "For people in Japan, the Act on the Protection of Personal Information (APPI) applies"]
EXP_RV = {
    "rv_jp_sens_grounds": dict(texts=["As a law requires or permits (Article 20(2)(i)).", "(Article 20(2)(v), (vi)).", "or a person it entrusts,",
                                      "It is evident from your appearance when we see or film you (Article 20(2)(viii); Cabinet Order Article 9(i)).",
                                      "(Article 20(2)(viii); Cabinet Order Article 9(ii)).", "- Delivering orders: Name, address."],
                               notexts=["Delivering orders.:", "In a case the Cabinet Order sets"], rows={"T05": "missing"}, notes=["\"Recording allergies\""]),
    "rv_jp_optout_full": dict(texts=["How we update it: Monthly, from our order records.", "Start of the provision: 1 February 2027.",
                                     "We never provide special care-required personal information this way, nor personal data we received from another business under this scheme."],
                              notexts=["This does not apply to special care-required"], rows={"T08": "warn"}, notes=["acquired in breach of Article 20(1)", "check that it is excluded"]),
    "rv_jp_optout_missing_sens": dict(texts=["[how the personal data provided is updated]"], notexts=[], rows={"T08": "missing"},
                                      notes=["Special care-required personal information, personal data acquired in breach of Article 20(1)", "check that it is excluded"]),
    "rv_jp_joint_partial": dict(texts=["Who uses it jointly: [recipient]."], notexts=[], rows={"T07": "missing"}),
    "rv_jp_joint_full": dict(texts=["Who uses it jointly: Sakura Tea Holdings Co., Ltd."], notexts=[], rows={"T07": "check"}, notes=["Guidelines 3-6-3"]),
    "rv_jp_x_mixed": dict(texts=["Praha Tea s.r.o. (Czechia): a country the Personal Information Protection Commission has designated", "London Tea Ltd (England): a country",
                                 "subject to the UK GDPR", "Zurich Tea AG (Switzerland): [This country is not designated: choose another basis under Article 28.]",
                                 "[List Seoul Tea Co. as a recipient"], notexts=[], rows={"T09": "missing"},
                          notes=["choose another basis for Zurich Tea AG (Switzerland).", "removes only the need for consent under Article 28"]),
    "rv_jp_x_proc_consent": dict(texts=["We also entrust the handling of personal data to Saigon Support Co. (customer support)", "It is a third party in a foreign country: section 4 explains the basis (Article 28)."],
                                 notexts=["Saigon Support Co. (customer support). We supervise"], rows={"T06": "ok", "T09": "check"}),
    "rv_jp_x_unlisted": dict(texts=["[Add Cloudbox Inc. (United States) to the third parties in foreign countries"], notexts=[], rows={"T06": "warn", "T09": "missing"}),
    "rv_jp_abroad_no_ctrl": dict(texts=["[Seoul Tea Co. (Seoul) is a third party in a foreign country"], notexts=["We do not provide your personal data to third parties in foreign countries."],
                                 rows={"T06": "warn", "T09": "missing"}),
    "rv_jp_abroad_unans": dict(texts=["[Say whether you provide personal data to third parties in foreign countries.]"], notexts=[], rows={"T06": "warn", "T09": "missing", "T11": "warn"}),
    "rv_jp_offshore_nowhere": dict(texts=["Lotus Apps Pte. Ltd., 1 Marina Way, 018989, [country]."], notexts=[], rows={"T01": "missing", "T02": "missing", "T11": "missing"}),
    "rv_jp_fee_acc": dict(texts=["Complaints about how we handle personal information: privacy@sakuratea-jp.example (Article 40"], notexts=[], rows={"T10": "missing", "T12": "ok", "T13": "missing"}),
    "rv_jp_further_consent": dict(texts=["For this new purpose we use purchase history, and keep it for 2 years.", "We will ask for your consent before we use your personal information for it (Article 18(1))."],
                                  notexts=["Use the switch in your account settings"], rows={"T14": "ok"}),
    "rv_jp_noacts": dict(texts=[], notexts=[], rows={"T03": "missing", "T05": "na", "T15": "na"}),
    "rv_jp_recipients_text": dict(texts=["Japan Post Co., Ltd. (Japan Post delivers your parcels)", "Partner Shop K.K.: Kyoto shop offers.", "- Tokyo Tax Office: We provide it as a law requires or permits"],
                                  notexts=["japan Post", "kyoto shop", "[purpose]"], rows={"T06": "missing", "T09": "na"}, notes=["Give each recipient's role: Unclear Ltd."]),
    "rv_jp_individual": dict(texts=["Taro Yamada (sole trader), 1-2-3 Marunouchi, Chiyoda-ku, Tokyo 100-0005."], notexts=["Person who represents", "Representative or administrator"], rows={"T01": "ok"}),
    "rv_jp_adm": dict(texts=["We analyse information about you: We decide automatically whether to offer you credit terms."], notexts=["Payment history and order value"], rows={"T03": "check"}),
    "rv_ch_jp": dict(texts=JPX + ["Alpen Tee AG, Bahnhofstrasse 1, 8001 Zurich, Switzerland. Person who represents the company: Anna Muster, CEO", "only where the FADP applies"], notexts=[], rows={"T01": "ok"}),
    "rv_can_jp": dict(texts=JPX + ["Maple Tea Inc., 1 King Street, Toronto ON, Canada.", "only where Canadian law applies"], notexts=[], rows={"T01": "ok"}),
    "rv_in_jp": dict(texts=JPX + ["Lotus Chai Pvt Ltd, 1 MG Road, Bengaluru, India.", "only where the DPDP Act applies"], notexts=[], rows={"T01": "ok"}),
    "rv_jp_us": dict(texts=["Additional information for residents of other US states", "only where the APPI applies"], notexts=[], rows={}),
    "rv_eu_jp_sens": dict(texts=["Event Partner GmbH (Germany): a country the Personal Information Protection Commission has designated", "subject to the GDPR (Article 28(1); Rules Article 15; PPC Notice No. 1 of 2019)"],
                          notexts=[], rows={"T05": "ok", "T09": "check", "T14": "missing"}),
    "rv_eu_jp_public": dict(texts=[], notexts=[], rows={"T19": "warn"}, notes=["A public body outside Japan is not an administrative organ under Article 2(11)"]),
    "rv_jp_indirect": dict(texts=["Public trade register: Company officer names (publicly available).", "Partner tea shops: Name and order history, used for sending you offers by email."],
                           notexts=["[purpose]"], rows={}),
    "rv_jp_kids": dict(texts=[], notexts=[], rows={"T17": "warn"}, notes=["Guidelines 2-16"]),
    "rv_jp_x_noforeignwhere": dict(texts=[], notexts=[], rows={"T09": "check", "T11": "warn"}),
}
