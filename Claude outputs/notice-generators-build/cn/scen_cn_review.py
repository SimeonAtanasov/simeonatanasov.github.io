# Reviewer scenarios for the China module (review of 12 November 2026). Same shape as scen_cn.py.
# All organisation names are fictional.
from scen_cn import BASE, CN_FIELDS, CA_US, XROW


def S(**kw):
    d = dict(BASE)
    d.update(kw)
    return ("pn", d)


HARBOUR = {"who": "Harbour Cloud Hosting Inc.", "role": "processor", "why": "Hosting our order system", "where": "United States"}
PLUM = {"who": "Plum Blossom Loyalty Co., Ltd.", "role": "controller", "why": "SMS reminders for loyalty points", "where": "Hangzhou",
        "cnContact": "service@plumblossom.example", "cnHow": "CRM records and SMS sends", "cnData": "Mobile number, points balance"}

SCEN_RV = {
    # 1. Recipients never entered: does the notice deny any recipient?
    "rv_cn_norecip": S(regimes=["cn"], recipients=[], cnNoRecip=""),
    # 2. Automated decision question left blank, push answered No.
    "rv_cn_adm_blank": S(regimes=["cn"], adm="", profiling="", cnPush="No"),
    # 3. Automated decision with major impact but a human reviews every result.
    "rv_cn_adm_human": S(regimes=["cn"], adm="Yes", admWhat="We set your credit limit with a scoring model; a credit officer reviews every result before it applies",
                         admLogic="Order history and repayment record", admEffect="A lower limit restricts how much you can order on credit"),
    # 4. Overseas list given, but a service provider abroad is missing from it; a recipient in Hong Kong.
    "rv_cn_abroad_mixed": S(regimes=["cn"], cnAbroad="Yes", cnXrows=[XROW],
                            recipients=BASE["recipients"] + [HARBOUR,
                                                             {"who": "Pearl Harbour Logistics Ltd", "role": "controller", "why": "Cross-border delivery", "where": "Hong Kong, China",
                                                              "cnContact": "cs@pearlharbour.example", "cnHow": "Delivers parcels", "cnData": "Name, address, mobile number"}]),
    # 5. Answer No to overseas recipients while recipients sit in Hong Kong and Taipei.
    "rv_cn_hk_no": S(regimes=["cn"], cnAbroad="No",
                     recipients=[{"who": "Kowloon Mail Services Ltd", "role": "processor", "why": "Email", "where": "Hong Kong, China"},
                                 {"who": "Formosa Data Ltd", "role": "processor", "why": "Backups", "where": "Taipei"}]),
    # 6. Answers that begin with an acronym or a proper noun.
    "rv_cn_lcfirst": S(regimes=["cn"], recipients=BASE["recipients"] + [PLUM], cnAfter="IT deletes it within 30 days",
                       cnKids="Yes", cnKidsHow="SMS code sent to the parent's phone", cnKidsRules="example.cn/privacy/children",
                       cnAbroad="Yes", cnXrows=[dict(XROW, purpose="HR system hosting", how="ERP storage in Singapore")],
                       further="Yes", furtherWhat="Analysing feedback", furtherStart="2027-09-01", furtherData="WeChat messages you send us", furtherRetention="1 year", cnFurther="consent"),
    # 7. No purpose relies on consent; only the planned new purpose does.
    "rv_cn_further_only_consent": S(regimes=["cn"], withdrawHow="",
                                    acts=[a for a in BASE["acts"] if a["cnBasis"] != "consent"],
                                    further="Yes", furtherWhat="Market research", furtherStart="2027-09-01", furtherData="Order history", furtherRetention="1 year", cnFurther="consent"),
    # 8. Children's data under a statutory duty, no purpose marked sensitive.
    "rv_cn_kids_school": S(regimes=["cn"], audience="other", audienceOther="Pupils and their parents", cnKids="Yes",
                           cnKidsHow="A parent signs the enrolment form", cnKidsRules="example.cn/privacy/children", withdrawHow="",
                           acts=[{"purpose": "Enrolling pupils", "data": "Pupil's name, date of birth, class", "cnBasis": "legal", "retention": "Until the pupil leaves and 3 years after"},
                                 {"purpose": "Contacting parents", "data": "Parent's name and mobile number", "cnBasis": "contract", "retention": "Until the pupil leaves"}]),
    # 9. Joint processing plus a recipient with role joint, and an authority with no China details.
    "rv_cn_joint_recip": S(regimes=["cn"], joint="Yes", jointWho="Lantern Tea Wholesale Co., Ltd.", jointEssence="We run the membership programme together; we answer your requests.", jointContact="privacy@lanterntea-cn.example",
                           acts=BASE["acts"] + [{"purpose": "Membership programme", "data": "Name, mobile number, points balance", "cnBasis": "consent", "retention": "2 years", "jointP": "Yes"}],
                           recipients=[{"who": "Lantern Tea Wholesale Co., Ltd.", "role": "joint", "why": "Membership programme", "where": "Shanghai",
                                        "cnContact": "privacy@lanterntea-wholesale.example", "cnHow": "Runs the points ledger", "cnData": "Name, mobile number, points balance"},
                                       {"who": "Tax bureau", "role": "authority", "why": "Tax filings", "where": "Shanghai"}]),
    # 10. Outside China, representative named but its kind not chosen.
    "rv_cn_rep_nokind": S(regimes=["cn"], cnScope="assess", cnRep="Jade Rep Consulting (Shenzhen) Co., Ltd., rep@jaderep.example"),
    # 11. Personalised push only.
    "rv_cn_push_only": S(regimes=["cn"], cnPush="Yes", cnPushHow="Switch off Personalised recommendations under Settings, then Privacy"),
    # 12. A public body with an overseas recipient.
    "rv_cn_public": S(regimes=["cn"], publicBody="Yes", audience="other", audienceOther="Residents using our online services", withdrawHow="", cnAccount="No",
                      acts=[{"purpose": "Processing applications for permits", "data": "Name, ID card number, address", "cnBasis": "legal", "retention": "10 years"}],
                      recipients=[], cnAbroad="Yes", cnXrows=[dict(XROW, name="Overseas Cloud Services Ltd", purpose="Hosting", data="Name, ID card number, address")]),
    # 13. EU leads; automated decision under Article 22; China consent purpose with GDPR special category.
    "rv_eu_cn_adm": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["eu", "cn"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Lending B.V.", "ctrlAddress": "Keizersgracht 2\nAmsterdam", "ctrlEmail": "privacy@lending.example", "publicBody": "No", "euEstablished": "Yes", "dpo": "No",
        "joint": "No", "source": "direct", "cnScope": "offer", "cnRepKind": "entity", "cnRep": "Example Lending (Shanghai) Co., Ltd., +86 21 6000 0001",
        "acts": [{"purpose": "Assessing your loan application", "data": "Name, income, credit history", "basis": "b", "retention": "5 years", "required": "contract", "consequence": "We cannot assess your application", "cnBasis": "contract"},
                 {"purpose": "Health-related loan insurance", "data": "Health declaration", "basis": "a", "art9": "a", "retention": "5 years", "required": "optional", "consequence": "No insurance", "cnBasis": "consent", "cnSens": "Yes",
                  "cnSensWhy": "The insurer needs it to price the cover; a leak could reveal your health"}],
        "marketing": "No", "inferred": "No", "recipients": [], "transfers": "No",
        "adm": "Yes", "admWhat": "We decide automatically whether to offer you a loan", "admLogic": "Income and credit history", "admEffect": "You may be refused a loan", "admBasis": "contract",
        "rightsContact": "privacy@lending.example", "withdrawHow": "Email privacy@lending.example", "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 14. UK leads; China ticked but none of the China answers given; a controller recipient.
    "rv_uk_cn_blank": ("pn", {
        "audience": "visitor", "regimes": ["uk", "cn"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Ltd", "ctrlEmail": "privacy@example.co.uk", "ukEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "basis": "b", "retention": "Until you close your account", "required": "contract", "consequence": "No account"}],
        "recipients": [{"who": "Partner Rewards Ltd", "role": "controller", "why": "Rewards", "where": "London"}], "ukTransfers": "No", "adm": "No", "profiling": "No",
        "rightsContact": "privacy@example.co.uk", "version": "1", "effective": "2027-01-01", "further": "No"}),
    # 15. Brazil leads; LGPD sensitive data, not marked for China.
    "rv_br_cn_sens": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["br", "cn"], "channel": ["web"], "languages": "Portuguese, Chinese",
        "ctrlName": "Exemplo Saude Ltda", "ctrlEmail": "privacidade@saude.example", "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "dpo@saude.example",
        "source": "direct", "acts": [{"purpose": "Booking your clinic appointments", "data": "Name, symptoms, appointment history", "brBasis": "V", "brSens": "I", "cnBasis": "contract", "retention": "20 years"}],
        "brForm": "Through our website", "recipients": [], "brTransfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacidade@saude.example", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 16. Canada leads; China with officer, overseas recipient, consent, children.
    "rv_can_cn_full": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["can", "cn"], "canJur": ["fed"], "channel": ["web"], "languages": "English, Chinese",
        "ctrlName": "Maple Goods Inc.", "ctrlEmail": "privacy@maplegoods.example", "canPicName": "Chief Privacy Officer", "canPicContact": "privacy@maplegoods.example", "canRelated": "No", "canKids": "No",
        "source": "direct", "acts": [{"purpose": "Processing your orders", "data": "Name, address, email", "canNeed": "Yes", "canConsent": "implied", "canSens": "No", "cnBasis": "contract", "retention": "7 years"},
                                     {"purpose": "Newsletter", "data": "Email", "canNeed": "No", "canConsent": "express", "canSens": "No", "cnBasis": "consent", "retention": "Until you unsubscribe"}],
        "recipients": [], "canAbroad": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@maplegoods.example", "withdrawHow": "Use the unsubscribe link",
        "cnScope": "offer", "cnRepKind": "rep", "cnRep": "Maple Rep (Beijing) Co., Ltd., rep@maplerep.example", "cnPipo": "Yes", "cnPipoName": "Head of Privacy", "cnPipoContact": "pipo@maplegoods.example",
        "cnAbroad": "Yes", "cnXrows": [dict(XROW, name="Maple Goods Inc.", country="Canada", contact="privacy@maplegoods.example")],
        "cnKids": "Yes", "cnKidsHow": "A parent confirms by email", "cnKidsRules": "maplegoods.example/children",
        "version": "1", "effective": "2027-01-01", "further": "No"})),
    # 17. India leads; China with officer and push.
    "rv_in_cn_full": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["in", "cn"], "channel": ["web"], "languages": "English, Hindi, Chinese",
        "inScope": "india", "inSdf": "No", "inContactName": "Grievance Officer", "inContact": "grievance@kirana.example",
        "inLink": "kirana.example/privacy/requests", "inOtherMeans": "", "inIdentifier": "your mobile number", "inDays": "30", "inBoard": "the Board's online complaint platform",
        "inLangHow": "choose a language at the top of this page", "inCm": "No", "inKids": "No", "inDisab": "No", "inErase": "none", "inAbroad": "Yes", "inAbroadWhere": "China",
        "ctrlName": "Kirana Example Private Limited", "ctrlEmail": "privacy@kirana.example", "source": "direct",
        "acts": [{"purpose": "Delivering your orders", "data": "Name, address, mobile number", "inGround": "consent", "inEnables": "Ordering and delivery", "cnBasis": "contract", "retention": "8 years"}],
        "recipients": [], "adm": "No", "profiling": "No", "rightsContact": "grievance@kirana.example", "withdrawHow": "In your account settings",
        "cnPipo": "Yes", "cnPipoName": "Data Protection Lead", "cnPipoContact": "pipo@kirana.example", "cnPush": "Yes", "cnPushHow": "Turn off recommendations in your profile",
        "version": "1", "effective": "2027-05-13", "further": "No"})),
    # 18. Other US states plus China: China leads.
    "rv_us_cn": S(regimes=["us", "cn"], **{k: v for k, v in CA_US.items() if k.startswith("us")}),
    # 19. New purpose under Article 13(1)(7) with no law named.
    "rv_cn_further_law": S(regimes=["cn"], further="Yes", furtherWhat="Reporting to the market regulator", furtherStart="2027-09-01", furtherData="Order records", furtherRetention="3 years", cnFurther="law"),
    # 20. Sensitive personal information under the contract ground (no consent).
    "rv_cn_sens_contract": S(regimes=["cn"], acts=[{"purpose": "Delivering your orders", "data": "Name, delivery address, precise location while the courier is on the way", "cnBasis": "contract",
                                                     "cnSens": "Yes", "cnSensWhy": "The courier needs your location to find you; a leak could show where you are", "retention": "30 days"}], withdrawHow=""),
    # 21. Recipients listed with no role at all.
    "rv_cn_roles_missing": S(regimes=["cn"], recipients=[{"who": "Mystery Co", "why": "Unknown", "where": "Shanghai"}]),
    # 22. EU, India, China and California together: numbering and cross-references.
    "rv_eu_in_cn_ca": ("pn", dict(CN_FIELDS, **dict(CA_US, **{
        "audience": "visitor", "regimes": ["eu", "in", "cn", "ca"], "channel": ["web"], "children": "No", "languages": "English",
        "ctrlName": "Example Global B.V.", "ctrlAddress": "Damrak 3\nAmsterdam", "ctrlEmail": "privacy@global.example", "publicBody": "No", "euEstablished": "Yes", "dpo": "No", "joint": "No", "source": "direct",
        "inScope": "india", "inSdf": "No", "inContactName": "Grievance Officer", "inContact": "grievance@global.example", "inLink": "global.example/requests", "inOtherMeans": "", "inIdentifier": "your email",
        "inDays": "30", "inBoard": "the Board's online complaint platform", "inLangHow": "choose a language", "inCm": "No", "inKids": "No", "inDisab": "No", "inErase": "none", "inAbroad": "No",
        "acts": [{"purpose": "Running your account", "data": "Name, email", "basis": "b", "retention": "Until you close your account", "required": "contract", "consequence": "No account",
                  "inGround": "consent", "inEnables": "Your account", "cnBasis": "consent"}],
        "marketing": "No", "inferred": "No", "recipients": [], "transfers": "No", "adm": "No", "profiling": "No", "rightsContact": "privacy@global.example", "withdrawHow": "In your account settings",
        "cnPipo": "Yes", "cnPipoName": "Privacy Lead", "cnPipoContact": "pipo@global.example",
        "version": "1", "effective": "2027-01-01", "further": "No"}))),
    # 23. Overseas recipient with only a name and country.
    "rv_cn_xrow_partial": S(regimes=["cn"], cnAbroad="Yes", cnXrows=[{"name": "Sakura Analytics KK", "country": "Japan"}]),
    # 24. Profiling and push, no decisions; job applicants under the human resources ground.
    "rv_cn_applicant_hr": S(regimes=["cn"], audience="applicant", withdrawHow="", cnAccount="No", profiling="Yes", profilingWhat="We score CVs to rank applicants for the recruiter",
                            acts=[{"purpose": "Assessing your application", "data": "Name, CV, interview notes", "cnBasis": "hr", "retention": "6 months after the vacancy closes"}]),
    # 25. Retention answered as a bare phrase and the period-end answer as a fragment.
    "rv_cn_fragment": S(regimes=["cn"], cnAfter="Deleted or anonymised", cnAccountHow="Settings > Account > Deregister."),
    # 26. Processor outside China (Article 3(2)) that answers No to overseas recipients.
    "rv_cn_offshore_no": S(regimes=["cn"], ctrlName="Lotus Apps Pte. Ltd.", ctrlAddress="1 Marina Way\nSingapore 018989", ctrlEmail="privacy@lotusapps.example", ctrlPhone="",
                           cnScope="offer", cnRepKind="rep", cnRep="Lotus Rep (Shanghai) Co., Ltd., rep@lotusrep.example", cnAbroad="No",
                           cnMethod="Collected through our app and stored on our servers in Singapore", recipients=[]),
    # 27. India leads; no email and no rights contact (the rights contact field is hidden when India leads).
    "rv_in_cn_norights": ("pn", dict(CN_FIELDS, **{
        "audience": "visitor", "regimes": ["in", "cn"], "channel": ["web"], "languages": "English, Chinese",
        "inScope": "india", "inSdf": "No", "inContactName": "Grievance Officer", "inContact": "grievance@kirana.example",
        "inLink": "kirana.example/privacy/requests", "inOtherMeans": "", "inIdentifier": "your mobile number", "inDays": "30", "inBoard": "the Board's online complaint platform",
        "inLangHow": "choose a language at the top of this page", "inCm": "No", "inKids": "No", "inDisab": "No", "inErase": "none", "inAbroad": "No",
        "ctrlName": "Kirana Example Private Limited", "source": "direct",
        "acts": [{"purpose": "Delivering your orders", "data": "Name, address, mobile number", "inGround": "consent", "inEnables": "Ordering and delivery", "cnBasis": "contract", "retention": "8 years"}],
        "recipients": [], "adm": "No", "profiling": "No", "withdrawHow": "In your account settings",
        "version": "1", "effective": "2027-05-13", "further": "No"})),
    # 28. Children's data in an unmarked purpose while another purpose is marked sensitive.
    "rv_cn_kids_partial": S(regimes=["cn"], cnKids="Yes", cnKidsHow="A parent confirms by SMS code", cnKidsRules="example.cn/privacy/children",
                            acts=[{"purpose": "Children's tea club", "data": "Child's name, age, parent's mobile number", "cnBasis": "consent", "retention": "Until the child turns 14"},
                                  {"purpose": "Verifying your identity for large orders", "data": "Face image", "cnBasis": "consent", "cnSens": "Yes",
                                   "cnSensWhy": "A face check stops others ordering with your account", "retention": "Until you close your account"}]),
    # 29. As 28, but the purpose that uses under-14 data does not mention children in its wording.
    "rv_cn_kids_partial2": S(regimes=["cn"], cnKids="Yes", cnKidsHow="A parent confirms by SMS code", cnKidsRules="example.cn/privacy/children",
                             acts=[{"purpose": "Junior tea tasting club", "data": "Member's name, age, school year, parent's mobile number", "cnBasis": "consent", "retention": "Until the member turns 14"},
                                   {"purpose": "Verifying your identity for large orders", "data": "Face image", "cnBasis": "consent", "cnSens": "Yes",
                                    "cnSensWhy": "A face check stops others ordering with your account", "retention": "Until you close your account"}]),
}
