# Adds the Singapore lists and the matrix Part T rows to ng-data.js. Fails if already added.
p = '/home/claude/ng-build/pages/notice-generators/ng-data.js'; t = open(p).read()
assert 'SG_BASES' not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('\t\t{ v: "kr", l: "South Korea: Personal Information Protection Act (PIPA)" },\n',
    '\t\t{ v: "kr", l: "South Korea: Personal Information Protection Act (PIPA)" },\n\t\t{ v: "sg", l: "Singapore: Personal Data Protection Act 2012 (PDPA)" },\n')

LISTS = '''	/* PDPA ss. 13 to 17 and the First Schedule: how the Act allows each purpose. t: wording in the policy;
	   ref: the provision. Read on sso.agc.gov.sg, 13 November 2026 (2020 Revised Edition, current version). */
	var SG_BASES = [
		{ v: "consent", l: "Consent (sections 13 and 14)", t: "Your consent", ref: "sections 13 and 14" },
		{ v: "deemed", l: "Deemed consent: the person gives the data voluntarily for this purpose (section 15(1))", t: "Deemed consent: you give it to us for this purpose", ref: "section 15(1)" },
		{ v: "contract", l: "Deemed consent: disclosure to and use by other organisations reasonably necessary for a contract with the person (section 15(3) to (8))", t: "Deemed consent: disclosure to other organisations reasonably necessary for a contract with you", ref: "section 15(3) to (8)" },
		{ v: "notify", l: "Deemed consent by notification, with an opt-out period (section 15A)", t: "Deemed consent by notification", ref: "section 15A" },
		{ v: "li", l: "Legitimate interests (First Schedule, Part 3, paragraph 1)", t: "Our legitimate interests", ref: "First Schedule, Part 3, paragraph 1" },
		{ v: "bip", l: "Business improvement within a group of related corporations (First Schedule, Part 5)", t: "Business improvement within our group", ref: "First Schedule, Part 5" },
		{ v: "employ", l: "Entering into, managing or ending employment or an appointment (First Schedule, Part 3, paragraph 10)", t: "Reasonable for entering into, managing or ending your employment or appointment", ref: "First Schedule, Part 3, paragraph 10" },
		{ v: "exception", l: "Another exception in the First or Second Schedule (section 17)", t: "An exception to consent", ref: "section 17" },
		{ v: "law", l: "Required or authorised by another written law (section 13(b))", t: "Required or authorised by law", ref: "section 13(b)" }
	];
	/* PDPA s. 26; Personal Data Protection Regulations 2021, regs 9 to 12 (reg 12 as amended by S 86/2026). */
	var SG_XBASIS = [
		{ v: "contract", l: "A contract requiring a comparable standard and naming the countries (regulation 11(1)(b), (2))" },
		{ v: "bcr", l: "Binding corporate rules, for related recipients (regulation 11(1)(c), (3))" },
		{ v: "law", l: "The law that applies to the recipient (regulation 11(1)(a))" },
		{ v: "instrument", l: "Another legally binding instrument (regulation 11(1)(d))" },
		{ v: "cert", l: "A certification the recipient holds: CBPR, or PRP for a data intermediary (regulation 12)" },
		{ v: "consent", l: "Consent to the transfer, after a written summary of the protection (regulation 10(2)(a), (3))" },
		{ v: "contractNeed", l: "Reasonably necessary for a contract with the person (section 15(3) to (8); regulation 10(2)(b))" },
		{ v: "vital", l: "Needed for vital interests or the national interest (regulation 10(2)(c))" },
		{ v: "public", l: "Publicly available in Singapore (regulation 10(2)(e))" },
		{ v: "own", l: "Our own systems or offices abroad: no other organisation receives it (regulation 9)" }
	];
'''
rep('\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n', LISTS + '\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n')

ROWS = [
 ("H01", "Organisation's name and the date the policy applies from", "PDPA s. 20; Key Concepts, ch. 14"),
 ("H02", "How the PDPA applies: in Singapore or from abroad; public agencies", "PDPA ss. 2(1), 4(1)"),
 ("H03", "Purposes of collection, use and disclosure", "PDPA ss. 18, 20(1)(a); Key Concepts, ch. 14"),
 ("H04", "Personal data for each purpose", "PDPA s. 20(1)(a); Key Concepts, ch. 14 (good practice)"),
 ("H05", "How the PDPA allows each purpose", "PDPA ss. 13 to 17; First and Second Schedules"),
 ("H06", "Deemed consent by notification", "PDPA s. 15A; PDP Regulations 2021, regs 13, 14"),
 ("H07", "Legitimate interests", "PDPA First Schedule, Part 3, para 1; PDP Regulations 2021, reg 15; Key Concepts, ch. 12"),
 ("H08", "Data protection officer's business contact information", "PDPA ss. 11(3), 11(5), 20(1)(c); PDP Regulations 2021, reg 1A; Key Concepts 21.6, 21.7"),
 ("H09", "Recipients and purposes of disclosure", "PDPA ss. 4(2), 4(3), 20(1)(a)"),
 ("H10", "Transfers outside Singapore", "PDPA s. 26; PDP Regulations 2021, regs 9 to 12"),
 ("H11", "Retention", "PDPA s. 25; Key Concepts 18.3, 18.8"),
 ("H12", "Protection", "PDPA s. 24"),
 ("H13", "Withdrawing consent", "PDPA s. 16"),
 ("H14", "Access and correction", "PDPA ss. 21, 22; PDP Regulations 2021, regs 3 to 7"),
 ("H15", "Complaints, policies on request, and the PDPC", "PDPA ss. 12, 48H, 48O"),
 ("H16", "Children", "PDPC Advisory Guidelines on children's personal data (2024), 4.2 to 4.5"),
 ("H17", "NRIC and other national identification numbers", "PDPC Advisory Guidelines on NRIC numbers (2018)"),
 ("H18", "New purpose", "PDPA ss. 18, 20(1)(b)"),
 ("H19", "Employees and applicants", "PDPA s. 20(4), (5)"),
 ("H20", "Not modelled", "PDPA Parts 6A, 6B, 9; First Schedule, Part 4; s. 4(2)"),
 ("H21", "Purposes on or before collection (delivery)", "PDPA s. 20(1)(a), (2); Key Concepts, ch. 14"),
 ("H22", "Consent requests (delivery)", "PDPA s. 14"),
 ("H23", "Publishing the data protection officer's contact (delivery)", "PDPA s. 11(5); PDP Regulations 2021, reg 1A"),
 ("H24", "Handling withdrawal of consent (delivery)", "PDPA s. 16(2), (4)"),
 ("H25", "Handling access requests (delivery)", "PDPA ss. 21, 22A; PDP Regulations 2021, regs 4, 5, 7, 8"),
 ("H26", "Before transferring outside Singapore (delivery)", "PDP Regulations 2021, regs 10 to 12"),
 ("H27", "Deemed consent by notification (delivery)", "PDPA s. 15A(4)(b); Key Concepts, ch. 12"),
 ("H28", "Do Not Call provisions (delivery)", "PDPA Part 9; Key Concepts 26.4"),
 ("H29", "Children (delivery)", "PDPC Advisory Guidelines on children's personal data (2024), 4.2, 4.5"),
]
lines = ''.join('\t\t%s: { t: "%s", s: "%s" },\n' % r for r in ROWS)
old = '\t\tS34: { t: "Use and provision history notice (delivery)", s: "PIPA Art. 20-2; Enforcement Decree Art. 15-3" },\n'
rep(old, old + lines)
rep('KR_BASES: KR_BASES, KR_PROV: KR_PROV, KR_XBASIS: KR_XBASIS,', 'KR_BASES: KR_BASES, KR_PROV: KR_PROV, KR_XBASIS: KR_XBASIS, SG_BASES: SG_BASES, SG_XBASIS: SG_XBASIS,')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)
print('ng-data: Singapore added')
