# Adds the Australia lists and the matrix Part U rows to ng-data.js. Fails if already added.
p = '/home/claude/ng-build/pages/notice-generators/ng-data.js'; t = open(p).read()
assert 'AU_SENS' not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('\t\t{ v: "sg", l: "Singapore: Personal Data Protection Act 2012 (PDPA)" },\n',
    '\t\t{ v: "sg", l: "Singapore: Personal Data Protection Act 2012 (PDPA)" },\n\t\t{ v: "au", l: "Australia: Privacy Act 1988 and the Australian Privacy Principles (APPs)" },\n')

LISTS = '''	/* Privacy Act 1988 (Cth), Compilation No. 104: APP 3.3, 3.4 and s. 6(1) (sensitive information); s. 16A (permitted
	   general situations, items 1 to 5 for organisations); APP 8 and s. 16C; ss. 6C to 6EA (small business). Read on
	   legislation.gov.au, 13 November 2026. */
	var AU_SENS = [
		{ v: "none", l: "No sensitive information" },
		{ v: "consent", l: "Sensitive information, with consent (APP 3.3(a))" },
		{ v: "law", l: "Sensitive information, required or authorised by an Australian law or a court or tribunal order (APP 3.4(a))" },
		{ v: "pgs", l: "Sensitive information, in a permitted general situation (APP 3.4(b); s. 16A)" },
		{ v: "phs", l: "Health information, in a permitted health situation (APP 3.4(c); s. 16B)" },
		{ v: "nonprofit", l: "Sensitive information, by a non-profit organisation about its members or regular contacts (APP 3.4(e))" }
	];
	var AU_PGS = [
		{ v: "1", l: "Lessening or preventing a serious threat to life, health or safety, where consent is unreasonable or impracticable (item 1)" },
		{ v: "2", l: "Taking action on suspected unlawful activity or serious misconduct (item 2)" },
		{ v: "3", l: "Helping locate a person reported as missing (item 3)" },
		{ v: "4", l: "Establishing, exercising or defending a legal or equitable claim (item 4)" },
		{ v: "5", l: "A confidential alternative dispute resolution process (item 5)" }
	];
	var AU_XBASIS = [
		{ v: "steps", l: "Reasonable steps, such as contract terms, so the recipient does not breach the APPs; we stay accountable (APP 8.1; s. 16C)" },
		{ v: "similar", l: "The recipient is bound by a law or binding scheme substantially similar to the APPs, which people can enforce (APP 8.2(a))" },
		{ v: "consent", l: "Consent, after telling the person expressly that APP 8.1 will not apply (APP 8.2(b))" },
		{ v: "law", l: "Required or authorised by an Australian law or a court or tribunal order (APP 8.2(c))" },
		{ v: "pgs", l: "A permitted general situation, items 1 to 3 of s. 16A (APP 8.2(d))" },
		{ v: "prescribed", l: "A country or binding scheme prescribed by the regulations (APP 8.2(aa), 8.3): none is prescribed yet" },
		{ v: "storage", l: "Storage only: a provider holds it for us under a contract limiting it to storage, and we keep effective control (a use, not a disclosure: APP Guidelines 8.14)" },
		{ v: "own", l: "Our own offices or systems abroad: no other entity receives it (not a disclosure: APP Guidelines 8.6)" }
	];
	var AU_SB = [
		{ v: "none", l: "None of these" },
		{ v: "earlier", l: "Our turnover was more than $3,000,000 in a financial year since we started the business (s. 6D(4)(a))" },
		{ v: "health", l: "We provide a health service and hold health information (s. 6D(4)(b))" },
		{ v: "trade", l: "We disclose personal information for a benefit, service or advantage, or give one to collect it (s. 6D(4)(c), (d))" },
		{ v: "cth", l: "We are a contracted service provider for a Commonwealth contract (s. 6D(4)(e))" },
		{ v: "crb", l: "We are a credit reporting body (s. 6D(4)(f))" },
		{ v: "related", l: "We are related to a body corporate whose business is not a small business (s. 6D(9))" },
		{ v: "aml", l: "We are an AML/CTF reporting entity, or the authorised agent of one (s. 6E(1A))" },
		{ v: "other6e", l: "A protected action ballot agent, a registered association of employees, a consumer data right accredited person, or prescribed by regulations (s. 6E)" },
		{ v: "optin", l: "We chose to be treated as an organisation, registered by the Commissioner (s. 6EA)" }
	];
'''
rep('\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n', LISTS + '\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n')

ROWS = [
 ("U01", "Organisation's name and the date the policy applies from", "APP 1.3"),
 ("U02", "How the Act applies: Australian link, small business, agencies", "Privacy Act ss. 5B, 6C to 6EA"),
 ("U03", "Kinds of personal information and purposes", "APP 1.4(a), (c), 5.2(d); APP Guidelines 1.8"),
 ("U04", "How personal information is collected and held", "APP 1.4(b), 5.2(b); APP Guidelines 5.10, 5.11"),
 ("U05", "Sensitive information", "APP 3.3, 3.4; Privacy Act s. 6(1)"),
 ("U06", "Collection required or authorised by law", "APP 5.2(c); APP Guidelines 5.12 to 5.14"),
 ("U07", "Main consequences of not providing it", "APP 5.2(e); APP Guidelines 5.18 to 5.20"),
 ("U08", "Identity and contact details", "APP 5.2(a); APP Guidelines 1.23, 5.9"),
 ("U09", "Usual disclosures", "APP 1.4(c), 5.2(f); APP Guidelines 5.21 to 5.25"),
 ("U10", "Overseas recipients", "APP 1.4(f), (g), 5.2(i), (j), APP 8; Privacy Act s. 16C; APP Guidelines 1.30 to 1.33, ch. 8"),
 ("U11", "Retention and destruction", "APP 11.2; APP Guidelines 1.80"),
 ("U12", "Security", "APP 11.1, 11.3"),
 ("U13", "Access and correction", "APP 1.4(d), 12, 13"),
 ("U14", "Complaints", "APP 1.4(e); Privacy Act s. 40(1A); APP Guidelines 1.28"),
 ("U15", "Direct marketing", "APP 7"),
 ("U16", "Anonymity and pseudonymity", "APP 2; APP Guidelines 1.80"),
 ("U17", "Automated decisions", "APP 1.7 to 1.9 (from 10 December 2026); APP Guidelines 1.35 to 1.73"),
 ("U18", "Registered APP code", "APP 1.4(e); APP Guidelines 1.27"),
 ("U19", "Children", "APP Guidelines B.59 to B.61; Children's Online Privacy Code (pending)"),
 ("U20", "New purpose", "APP 6.1, 6.2"),
 ("U21", "Withdrawing consent", "APP Guidelines B.54"),
 ("U22", "Employees and applicants", "Privacy Act s. 7B(3)"),
 ("U23", "Not modelled", "Privacy Act Parts IIIA, IIIC, Schedule 2; APP 4, 9"),
 ("U24", "Collection notice (delivery)", "APP 5.1; APP Guidelines 5.5, 5.6"),
 ("U25", "Policy free and in an appropriate form (delivery)", "APP 1.5, 1.6; APP Guidelines 1.81 to 1.88"),
 ("U26", "Consent to an overseas disclosure (delivery)", "APP 8.2(b); APP Guidelines 8.31 to 8.37"),
 ("U27", "Spam Act and Do Not Call Register (delivery)", "APP 7.8; Spam Act 2003; Do Not Call Register Act 2006"),
 ("U28", "Handling access and correction requests (delivery)", "APP 12, 13"),
 ("U29", "Keeping the policy up to date (delivery)", "APP 1.2, 1.3, 1.7 to 1.9"),
]
lines = ''.join('\t\t%s: { t: "%s", s: "%s" },\n' % r for r in ROWS)
old = '\t\tH29: { t: "Children (delivery)", s: "PDPC Advisory Guidelines on children\'s personal data (2024), 4.2, 4.5" },\n'
rep(old, old + lines)
rep('SG_BASES: SG_BASES, SG_XBASIS: SG_XBASIS,', 'SG_BASES: SG_BASES, SG_XBASIS: SG_XBASIS, AU_SENS: AU_SENS, AU_PGS: AU_PGS, AU_XBASIS: AU_XBASIS, AU_SB: AU_SB,')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)
print('ng-data: Australia added')
