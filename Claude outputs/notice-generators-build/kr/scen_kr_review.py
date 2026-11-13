# Review scenarios for the Korea (PIPA) module, 13 November 2026. Each one demonstrates a finding in
# build/review-2026-11-13-kr/findings.json. Same format as SCEN_KR in scen_kr.py.
from scen_kr import BASE, S, XROW_US, XROW_FR

CONTRACT_ONLY = [dict(a) for a in BASE["acts"][:2]]

SCEN_RV = {
    # K02: provision to the police of data collected for a contract, on Art. 17(1)(2); no 18(2) option.
    "rv_kr_police_contract": S(regimes=["kr"], acts=CONTRACT_ONLY,
        recipients=BASE["recipients"] + [{"who": "Seoul Metropolitan Police Agency", "role": "authority", "why": "Criminal investigations, on a warrant", "where": "Seoul",
                                          "krProv": "collected", "krProvLaw": "Criminal Procedure Act, Article 215", "krItems": "Name, delivery address, order details", "krRet": "As the investigation requires"}]),
    # K03: EEA country under the equivalence basis is warned; resident registration numbers sent on that basis are not.
    "rv_kr_eea_norway": S(regimes=["kr"],
        recipients=BASE["recipients"] + [{"who": "Fjord Support AS", "role": "processor", "why": "Customer support", "where": "Oslo, Norway"},
                                          {"who": "Lumiere Analytics SAS", "role": "processor", "why": "Measuring sales", "where": "France"}],
        krAbroad="Yes", krXrows=[dict(XROW_FR, recipient="Fjord Support AS", country="Norway", items="Name, email address, order details", purpose="Customer support"),
                                 dict(XROW_FR, items="Name, resident registration number, order history")]),
    # K04: resident registration numbers on consent.
    "rv_kr_rrn_consent": S(regimes=["kr"], acts=BASE["acts"] + [
        {"purpose": "Checking identity for high-value orders", "data": "Name, resident registration number", "krBasis": "consent", "krRefuse": "You cannot place orders over KRW 1 million",
         "krSens": "Yes", "krSensBasis": "consent", "retention": "1 year"}]),
    # K01: business abroad with krAbroad Yes: a processor in the same foreign country is not required in the transfer list.
    "rv_kr_offshore_yes": S(regimes=["kr"], krScope="abroad", krOffWhere="Singapore", krRep="No", ctrlName="Hanbit Global Pte. Ltd.", languages="Korean, English",
        recipients=[{"who": "Lion Cloud Pte. Ltd.", "role": "processor", "why": "Hosting", "where": "Singapore"},
                    {"who": "Cloudnine Inc.", "role": "processor", "why": "Hosting our website and app", "where": "United States"}],
        krAbroad="Yes", krXrows=[XROW_US]),
    # K06: children under 14 with no consent-based processing: the policy still says it asks parents for consent.
    "rv_kr_kids_contract": S(regimes=["kr"], acts=CONTRACT_ONLY, withdrawHow="", krKids="Yes", krKidsHow="A mobile identity check by the parent"),
    # K11: no consent at all: "In short" and the rights list still offer withdrawal of consent.
    "rv_kr_noconsent": S(regimes=["kr"], acts=CONTRACT_ONLY, withdrawHow=""),
    # K10: channel and cookies unanswered: S18 says "No automatic collection".
    "rv_kr_unanswered_channel": S(regimes=["kr"], channel=[], krCookies=""),
    # K15: a third party on Art. 17(4) while the controller says it does no continuous further provision.
    "rv_kr_related_prov": S(regimes=["kr"], krFurtherUse="No",
        recipients=BASE["recipients"] + [{"who": "Seoul Publishers Co., Ltd.", "role": "controller", "why": "Sending signed copies", "where": "Seoul",
                                          "krProv": "related", "krItems": "Name, delivery address", "krRet": "Until the copy is delivered"}]),
    # K18: Korean-language place names and cloud regions are not recognised as abroad.
    "rv_kr_korean_places": S(regimes=["kr"], krAbroad="No",
        recipients=[{"who": "Hanjin Express Co., Ltd.", "role": "processor", "why": "Delivering your orders", "where": "\ubbf8\uad6d"},
                    {"who": "Lion Cloud Pte. Ltd.", "role": "processor", "why": "Hosting", "where": "\uc2f1\uac00\ud3ec\ub974"},
                    {"who": "Cloudnine Inc.", "role": "processor", "why": "Backups", "where": "AWS us-east-1"}]),
    # K17: sensitive information on the basis of a law: the law is never asked for or printed.
    "rv_kr_sens_law": S(regimes=["kr"], acts=BASE["acts"] + [
        {"purpose": "Health checks for delivery drivers", "data": "Health check results", "krBasis": "law", "krLaw": "Occupational Safety and Health Act, Article 129",
         "krSens": "Yes", "krSensBasis": "law", "retention": "5 years"}]),
    # K22: the department only: the heading still says the chief privacy officer.
    "rv_kr_dept_only": S(regimes=["kr"], krCpo="", krCpoContact="", krDept="Privacy Team", krDeptContact="02-1234-5679, privacy-team@hanbit.example.kr"),
    # K24: retention in words ("Five years") loses "for"; items keep their capital after a colon.
    "rv_kr_words": S(regimes=["kr"],
        recipients=BASE["recipients"] + [{"who": "Seoul Publishers Co., Ltd.", "role": "controller", "why": "Sending signed copies", "where": "Seoul",
                                          "krProv": "consent", "krItems": "Name, delivery address", "krRet": "Five years"}]),
    # K14: Korea relies on consent, no withdrawal route: no row flags it.
    "rv_kr_withdraw_empty": S(regimes=["kr"], withdrawHow=""),
    # K12: GDPR leads, Korea alone relies on consent.
    "rv_eu_kr_consent_only_kr": S(regimes=["eu", "kr"], euEstablished="No", ctrlCountry="Korea", repName="EU Rep GmbH", repContact="rep@eurep.example", dpo="No", joint="No",
        acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="f", liaInterest="Telling customers about events", liaBalance="Low impact; opt-out in every message")],
        transfers="No", withdrawHow="Untick event news in My Page"),
    # K16: a domestic recipient authority with no consent: retention forced to "missing".
    "rv_kr_authority_noret": S(regimes=["kr"], acts=BASE["acts"] + [
        {"purpose": "Issuing tax invoices", "data": "Name, business registration number, order value", "krBasis": "law", "krLaw": "Value-Added Tax Act, Article 32", "krSens": "No", "retention": "5 years"}],
        recipients=BASE["recipients"] + [{"who": "National Tax Service", "role": "authority", "why": "Tax audits", "where": "Sejong",
                                          "krProv": "collected", "krProvLaw": "Framework Act on National Taxes, Article 81-10", "krItems": "Order records"}]),
    # K21: first policy: S23 demands earlier versions.
    "rv_kr_first_policy": S(regimes=["kr"], krPrev="", version="1.0"),
}

# Expectations after the fixes (builder, 13 November 2026).
EXP_RV = {
 "rv_kr_police_contract": dict(texts=[], notexts=[], rows={"S09": "missing"}, notes=["such as Article 18(2)(2)"]),
 "rv_kr_eea_norway": dict(texts=[], notexts=[], rows={"S11": "missing"}, notes=["does not cover resident registration numbers or personal credit information"]),
 "rv_kr_rrn_consent": dict(texts=[], notexts=[], rows={"S06": "missing"}, notes=["Consent is never enough for them"]),
 "rv_kr_offshore_yes": dict(texts=["[Add Lion Cloud Pte. Ltd. (Singapore) to the transfers abroad"], notexts=[], rows={"S11": "missing", "S16": "missing"}, notes=["also in a country where you process the data"]),
 "rv_kr_kids_contract": dict(texts=["Where we need consent to process the personal information of a child under 14"], notexts=["we collect only the legal representative's name"], rows={"S17": "check"}),
 "rv_kr_noconsent": dict(texts=["You can ask to see, correct or delete your personal information and to stop its processing.", "Suspension of processing (Article 37)."], notexts=["withdraw consent", "withdraw your consent"], rows={"S04": "ok"}),
 "rv_kr_unanswered_channel": dict(texts=[], notexts=[], rows={"S18": "check"}),
 "rv_kr_related_prov": dict(texts=[], notexts=[], rows={"S21": "missing"}),
 "rv_kr_korean_places": dict(texts=["and Cloudnine Inc. (AWS us-east-1) are located abroad"], notexts=["We do not provide, entrust or store your personal information abroad."], rows={"S11": "missing"}),
 "rv_kr_sens_law": dict(texts=[], notexts=[], rows={"S06": "missing"}),
 "rv_kr_dept_only": dict(texts=["Privacy department", "The department below handles privacy work and complaints (Article 30(1)(6)):", "gives our privacy department"], notexts=["Our chief privacy officer is responsible"], rows={"S15": "ok"}),
 "rv_kr_words": dict(texts=["it keeps it for five years"], notexts=[], rows={}),
 "rv_kr_withdraw_empty": dict(texts=["To withdraw consent: [how to withdraw consent, as easily as you gave it]."], notexts=[], rows={"S13": "missing"}),
 "rv_eu_kr_consent_only_kr": dict(texts=['Additional information for people in Korea', 'For people in Korea, the Personal Information Protection Act (PIPA) applies'] + ["To withdraw consent: untick event news in My Page."], notexts=[], rows={}),
 "rv_kr_authority_noret": dict(texts=[], notexts=[], rows={"S09": "warn"}, notes=["retention period where a law sets it (recommended"]),
 "rv_kr_first_policy": dict(texts=[], notexts=[], rows={"S23": "missing"}, notes=["or answer that this is your first policy"]),
}
