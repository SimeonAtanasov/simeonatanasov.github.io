# Adds the South Africa lists and the matrix Part V rows to ng-data.js. Fails if already added.
p = '/home/claude/ng-build/pages/notice-generators/ng-data.js'; t = open(p).read()
assert 'ZA_BASES' not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('\t\t{ v: "au", l: "Australia: Privacy Act 1988 and the Australian Privacy Principles (APPs)" },\n',
    '\t\t{ v: "au", l: "Australia: Privacy Act 1988 and the Australian Privacy Principles (APPs)" },\n\t\t{ v: "za", l: "South Africa: Protection of Personal Information Act 4 of 2013 (POPIA)" },\n')

LISTS = '''	/* Protection of Personal Information Act 4 of 2013 (Gazette 37067): s. 11(1) bases; ss. 26 to 33 (special personal
	   information); ss. 34, 35 (children); s. 72(1) (transborder flows); s. 15 (further processing); s. 69 (electronic direct
	   marketing); s. 71(2) (automated decisions). Read on gov.za, 13 November 2026. */
	var ZA_BASES = [
		{ v: "consent", l: "Consent, or a competent person's consent for a child (s. 11(1)(a))" },
		{ v: "contract", l: "Necessary to conclude or perform a contract with the person (s. 11(1)(b))" },
		{ v: "law", l: "Complies with an obligation the law imposes on us (s. 11(1)(c))" },
		{ v: "dsli", l: "Protects a legitimate interest of the person (s. 11(1)(d))" },
		{ v: "public", l: "Necessary for the proper performance of a public law duty by a public body (s. 11(1)(e))" },
		{ v: "li", l: "Necessary for our legitimate interests, or those of a third party we supply it to (s. 11(1)(f))" }
	];
	var ZA_SPECIAL = [
		{ v: "none", l: "No special personal information" },
		{ v: "consent", l: "Special personal information, with consent (s. 27(1)(a))" },
		{ v: "right", l: "Necessary to establish, exercise or defend a right or obligation in law (s. 27(1)(b))" },
		{ v: "intl", l: "Necessary to comply with an obligation of international public law (s. 27(1)(c))" },
		{ v: "research", l: "Historical, statistical or research purposes in the public interest, with guarantees (s. 27(1)(d))" },
		{ v: "public", l: "Deliberately made public by the person (s. 27(1)(e))" },
		{ v: "specific", l: "Allowed by the section for that kind of information, sections 28 to 33 (s. 27(1)(f))" },
		{ v: "auth", l: "An authorisation from the Information Regulator (s. 27(2))" }
	];
	var ZA_SPECIAL_SEC = [
		{ v: "28", l: "Religious or philosophical beliefs (s. 28)" },
		{ v: "29", l: "Race or ethnic origin (s. 29)" },
		{ v: "30", l: "Trade union membership (s. 30)" },
		{ v: "31", l: "Political persuasion (s. 31)" },
		{ v: "32", l: "Health or sex life (s. 32)" },
		{ v: "33", l: "Criminal behaviour or biometric information (s. 33)" }
	];
	var ZA_KIDS = [
		{ v: "competent", l: "Prior consent of a competent person, such as a parent or guardian (s. 35(1)(a))" },
		{ v: "right", l: "Necessary to establish, exercise or defend a right or obligation in law (s. 35(1)(b))" },
		{ v: "intl", l: "Necessary to comply with an obligation of international public law (s. 35(1)(c))" },
		{ v: "research", l: "Historical, statistical or research purposes in the public interest, with guarantees (s. 35(1)(d))" },
		{ v: "public", l: "Deliberately made public by the child with a competent person's consent (s. 35(1)(e))" },
		{ v: "auth", l: "An authorisation from the Information Regulator (s. 35(2))" }
	];
	var ZA_XBASIS = [
		{ v: "law", l: "The recipient is subject to a law that gives adequate protection (s. 72(1)(a))" },
		{ v: "bcr", l: "Binding corporate rules within our group give adequate protection (s. 72(1)(a), (2))" },
		{ v: "agreement", l: "A binding agreement with the recipient gives adequate protection (s. 72(1)(a))" },
		{ v: "consent", l: "The person consents (s. 72(1)(b))" },
		{ v: "contract", l: "Necessary for a contract with the person, or for steps before one at their request (s. 72(1)(c))" },
		{ v: "contract3", l: "Necessary for a contract in the person's interest between us and a third party (s. 72(1)(d))" },
		{ v: "benefit", l: "For the person's benefit, consent not reasonably practicable, and they would be likely to give it (s. 72(1)(e))" },
		{ v: "own", l: "Our own offices or systems outside South Africa: no third party receives it" }
	];
	var ZA_FURTHER = [
		{ v: "compatible", l: "Compatible with the purpose of collection (s. 15(1), (2))" },
		{ v: "consent", l: "Consent first (s. 15(3)(a))" },
		{ v: "public", l: "In a public record, or deliberately made public by the person (s. 15(3)(b))" },
		{ v: "law", l: "Law enforcement, an obligation imposed by law, court proceedings or national security (s. 15(3)(c))" },
		{ v: "threat", l: "A serious and imminent threat to public health or safety, or to someone's life or health (s. 15(3)(d))" },
		{ v: "research", l: "Historical, statistical or research purposes, not published in identifiable form (s. 15(3)(e))" },
		{ v: "exempt", l: "An exemption granted by the Information Regulator (s. 15(3)(f); s. 37)" }
	];
	var ZA_DM = [
		{ v: "none", l: "We do not market by electronic communication" },
		{ v: "consent", l: "Only to people who consented (s. 69(1)(a))" },
		{ v: "customers", l: "Only to our customers, about our own similar products or services (s. 69(1)(b), (3))" },
		{ v: "both", l: "To people who consented, and to customers about our own similar products or services (s. 69(1))" }
	];
	var ZA_ADM = [
		{ v: "contract_met", l: "In connection with a contract, where the person's request under the contract has been met (s. 71(2)(a)(i))" },
		{ v: "contract_measures", l: "In connection with a contract, with measures that protect the person's legitimate interests (s. 71(2)(a)(ii), (3))" },
		{ v: "law", l: "Governed by a law or code of conduct that sets such measures (s. 71(2)(b))" }
	];
'''
rep('\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n', LISTS + '\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n')

ROWS = [
 ("V01", "Responsible party's name and address, and the date", "POPIA s. 18(1)(b)"),
 ("V02", "How POPIA applies: domicile or means in South Africa; private and public bodies", "POPIA ss. 1, 3(1)(b)"),
 ("V03", "Purposes and the information collected", "POPIA ss. 13(1), 18(1)(a), (c)"),
 ("V04", "Legal basis", "POPIA s. 11(1), (2)"),
 ("V05", "Special personal information", "POPIA ss. 26 to 33; Health Information Regulations 2026 (GN 7198)"),
 ("V06", "Children", "POPIA ss. 1, 34, 35"),
 ("V07", "A law requiring or authorising collection", "POPIA s. 18(1)(f)"),
 ("V08", "Voluntary or mandatory, and the consequences of not providing it", "POPIA s. 18(1)(d), (e)"),
 ("V09", "Sources", "POPIA ss. 12, 18(1)(a), 18(2)(b)"),
 ("V10", "Information Officer and contact details", "POPIA ss. 18(1)(b), 55, 56; PAIA s. 1; Guidance Note on Information Officers (2021)"),
 ("V11", "Recipients and operators", "POPIA ss. 18(1)(h)(i), 20, 21"),
 ("V12", "Transfers outside South Africa", "POPIA ss. 18(1)(g), 57(1)(d), 72"),
 ("V13", "Retention", "POPIA s. 14"),
 ("V14", "Security", "POPIA s. 19"),
 ("V15", "Access, correction and deletion", "POPIA ss. 18(1)(h)(iii), 23, 24; Regulations, reg 3"),
 ("V16", "Right to object", "POPIA ss. 11(3), (4), 18(1)(h)(iv); Regulations, reg 2.4"),
 ("V17", "Withdrawing consent", "POPIA s. 11(2)(b)"),
 ("V18", "Direct marketing", "POPIA ss. 11(3)(b), 69; Regulations, reg 6; Guidance Note on Direct Marketing"),
 ("V19", "Automated decisions", "POPIA s. 71"),
 ("V20", "Complaints and the Information Regulator", "POPIA ss. 18(1)(h)(v), 74, 99; Regulations, reg 7"),
 ("V21", "Codes of conduct", "POPIA ss. 60, 77(1)(f)"),
 ("V22", "New purpose", "POPIA s. 15"),
 ("V23", "Employees and applicants", "POPIA s. 33(2); Health Information Regulations 2026 (GN 7198)"),
 ("V24", "Prior authorisation", "POPIA ss. 57, 58"),
 ("V25", "Not modelled", "POPIA ss. 6, 7, 18(4), 37, 38, 70; PAIA s. 51; sector laws"),
 ("V26", "Timing of the notice (delivery)", "POPIA s. 18(2) to (4)"),
 ("V27", "PAIA manual (delivery)", "PAIA s. 51(1)(c), (3), as amended by POPIA"),
 ("V28", "Routes for objections and correction requests (delivery)", "Regulations, regs 2, 3 (as amended, 2025)"),
 ("V29", "Consent to electronic direct marketing (delivery)", "POPIA s. 69(2); Regulations, reg 6; Guidance Note on Direct Marketing 6.4, 7.3.5, 8"),
 ("V30", "Operator contracts (delivery)", "POPIA s. 21"),
 ("V31", "Security compromises (delivery)", "POPIA s. 22"),
 ("V32", "Consent to a transfer (delivery)", "POPIA ss. 11(2)(a), 18(1)(g), 72(1)(b)"),
]
lines = ''.join('\t\t%s: { t: "%s", s: "%s" },\n' % r for r in ROWS)
old = '\t\tU29: { t: "Keeping the policy up to date (delivery)", s: "APP 1.2, 1.3, 1.7 to 1.9" },\n'
rep(old, old + lines)
rep('AU_SENS: AU_SENS, AU_PGS: AU_PGS, AU_XBASIS: AU_XBASIS, AU_SB: AU_SB,', 'AU_SENS: AU_SENS, AU_PGS: AU_PGS, AU_XBASIS: AU_XBASIS, AU_SB: AU_SB, ZA_BASES: ZA_BASES, ZA_SPECIAL: ZA_SPECIAL, ZA_SPECIAL_SEC: ZA_SPECIAL_SEC, ZA_KIDS: ZA_KIDS, ZA_XBASIS: ZA_XBASIS, ZA_FURTHER: ZA_FURTHER, ZA_DM: ZA_DM, ZA_ADM: ZA_ADM,')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)
print('ng-data: South Africa added')
