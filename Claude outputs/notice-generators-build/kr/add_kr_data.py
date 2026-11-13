# Adds the Korea lists and the matrix Part S rows to ng-data.js. Fails if already added.
p = '/home/claude/ng-build/pages/notice-generators/ng-data.js'; t = open(p).read()
assert 'KR_BASES' not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('\t\t{ v: "jp", l: "Japan: Act on the Protection of Personal Information (APPI)" },\n',
    '\t\t{ v: "jp", l: "Japan: Act on the Protection of Personal Information (APPI)" },\n\t\t{ v: "kr", l: "South Korea: Personal Information Protection Act (PIPA)" },\n')

LISTS = '''	/* PIPA Art. 15(1): the bases for collecting and using personal information. t: wording in the notice;
	   ref: the provision. Read in Korean on law.go.kr, 12 November 2026 (version in force on 11 September 2026). */
	var KR_BASES = [
		{ v: "consent", l: "Consent (Article 15(1)(1))", t: "Your consent", ref: "Article 15(1)(1)" },
		{ v: "law", l: "A special provision of law, or unavoidable to comply with a legal obligation (Article 15(1)(2))", t: "A special provision of law, or a legal obligation", ref: "Article 15(1)(2)" },
		{ v: "public", l: "Unavoidable for a public institution's duties under law (Article 15(1)(3))", t: "Unavoidable for our duties as a public institution under the law", ref: "Article 15(1)(3)" },
		{ v: "contract", l: "Needed to conclude or perform a contract with the person, or for steps they ask for before one (Article 15(1)(4))", t: "Needed to conclude or perform a contract with you, or to take steps you ask for before one", ref: "Article 15(1)(4)" },
		{ v: "vital", l: "Clearly needed to protect life, body or property urgently (Article 15(1)(5))", t: "Clearly needed to protect your life, body or property, or someone else's, urgently", ref: "Article 15(1)(5)" },
		{ v: "legit", l: "Legitimate interests that clearly override the person's rights (Article 15(1)(6))", t: "Needed for our legitimate interests, which clearly override your rights, substantially related to them and within a reasonable scope", ref: "Article 15(1)(6)" },
		{ v: "safety", l: "Urgently needed for public safety, such as public health (Article 15(1)(7))", t: "Urgently needed for public safety, such as public health", ref: "Article 15(1)(7)" }
	];
	/* PIPA Art. 17(1), (4): the basis for providing personal information to a third party. */
	var KR_PROV = [
		{ v: "consent", l: "Consent (Art. 17(1)(1))", t: "with your consent", ref: "Article 17(1)(1)" },
		{ v: "collected", l: "Within the purposes it was collected for without consent, under Art. 15(1)(2), (3) or (5) to (7) (Art. 17(1)(2))", t: "within the purposes for which we collected it without consent", ref: "Article 17(1)(2)" },
		{ v: "related", l: "Reasonably related to the original purpose (Art. 17(4))", t: "within a scope reasonably related to the purpose for which we collected it", ref: "Article 17(4); Enforcement Decree Article 14-2" }
	];
	/* PIPA Art. 28-8(1): the basis for a transfer abroad. The PIPC recognised the European Union as equivalent
	   on 16 September 2025 (news reports; the PIPC notice itself not read). */
	var KR_XBASIS = [
		{ v: "consent", l: "Separate consent to the transfer (Art. 28-8(1)(1))", ref: "Article 28-8(1)(1)" },
		{ v: "law", l: "A law, or a treaty or international agreement Korea is party to (Art. 28-8(1)(2))", ref: "Article 28-8(1)(2)" },
		{ v: "contract", l: "Entrusted processing or storage needed for a contract with the person, disclosed in this policy (Art. 28-8(1)(3))", ref: "Article 28-8(1)(3)" },
		{ v: "cert", l: "The recipient holds a certification the PIPC designates (Art. 28-8(1)(4))", ref: "Article 28-8(1)(4)" },
		{ v: "equiv", l: "The PIPC recognises the country's protection as equivalent: the European Union (Art. 28-8(1)(5))", ref: "Article 28-8(1)(5)" }
	];
'''
rep('\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n', LISTS + '\t/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */\n')

ROWS = [
 ("S01", "Title \\\"Privacy Policy\\\" and the controller's name", "PIPA Art. 30(1); PIPC drafting guidelines, item 1"),
 ("S02", "Presence in Korea, and the countries where data collected from abroad is processed", "Enforcement Decree Art. 31(1)(4); PIPC drafting guidelines, p. 12 and item 10"),
 ("S03", "Purposes of processing", "PIPA Art. 30(1)(1); PIPC drafting guidelines, item 2"),
 ("S04", "Items processed, with consent and without consent set apart", "PIPA Art. 22(3); Enforcement Decree Art. 31(1)(1); PIPC drafting guidelines, item 3"),
 ("S05", "Basis for each purpose, and consent", "PIPA Arts. 15, 16, 22"),
 ("S06", "Sensitive information and unique identifiers", "PIPA Arts. 23, 24; Enforcement Decree Art. 18"),
 ("S07", "Processing and retention periods", "PIPA Art. 30(1)(2); PIPC drafting guidelines, item 5"),
 ("S08", "Destruction procedure and method, and data kept under other laws", "PIPA Arts. 21, 30(1)(3-2); Enforcement Decree Art. 16"),
 ("S09", "Provision to third parties", "PIPA Arts. 17, 30(1)(3); PIPC drafting guidelines, item 7"),
 ("S10", "Entrustment of processing", "PIPA Arts. 26(2), 30(1)(4); Enforcement Decree Art. 28"),
 ("S11", "Transfers abroad", "PIPA Arts. 28-8, 28-11; Enforcement Decree Arts. 29-10, 31(1)(2); PIPC drafting guidelines, item 10"),
 ("S12", "Security measures", "PIPA Art. 29; Enforcement Decree Arts. 30, 31(1)(3)"),
 ("S13", "Rights of data subjects and legal representatives, how to exercise them, and objections", "PIPA Arts. 30(1)(5), 35 to 38; Enforcement Decree Arts. 41, 47"),
 ("S14", "Automated decisions", "PIPA Art. 37-2; Enforcement Decree Arts. 44-2, 44-4"),
 ("S15", "Chief privacy officer or department, with contacts", "PIPA Arts. 30(1)(6), 31; PIPC drafting guidelines, item 18"),
 ("S16", "Domestic representative", "PIPA Art. 31-2; Enforcement Decree Art. 32-3"),
 ("S17", "Children under 14", "PIPA Art. 22-2; Enforcement Decree Art. 17-2"),
 ("S18", "Cookies and other automatic collection, and how to refuse", "PIPA Art. 30(1)(7); PIPC drafting guidelines, items 14, 15"),
 ("S19", "Sensitive information that can become public", "PIPA Arts. 23(3), 30(1)(3-3)"),
 ("S20", "Pseudonymised information", "PIPA Arts. 28-2, 30(1)(4-2)"),
 ("S21", "Criteria for further use or provision without consent", "PIPA Arts. 15(3), 17(4); Enforcement Decree Art. 14-2"),
 ("S22", "Remedies for infringement (recommended)", "PIPC drafting guidelines, item 20"),
 ("S23", "Effective date, changes and earlier versions", "PIPC drafting guidelines, item 24"),
 ("S24", "Language", "PIPC drafting guidelines, p. 12"),
 ("S25", "Amendments not yet in force", "PIPA Arts. 28-12 to 28-15 (from 9 March 2027), 32-2(1) (from 1 July 2027)"),
 ("S26", "Public institutions", "PIPA Arts. 18(2), (4), 30(1), 32"),
 ("S27", "Publication of the privacy policy (delivery)", "PIPA Art. 30(2); Enforcement Decree Art. 31(2), (3); PIPC drafting guidelines, item 1"),
 ("S28", "Consent requests (delivery)", "PIPA Arts. 15(2), 17(2), 22, 28-8(2); Enforcement Decree Art. 17"),
 ("S29", "Data from other sources (delivery)", "PIPA Arts. 20, 20-2; Enforcement Decree Art. 15-2"),
 ("S30", "Entrustment (delivery)", "PIPA Art. 26(1) to (3); Enforcement Decree Art. 28"),
 ("S31", "Confirming the legal representative's consent (delivery)", "PIPA Art. 22-2; Enforcement Decree Art. 17-2"),
 ("S32", "New purpose", "PIPA Arts. 15(3), 18(2)"),
]
lines = ''.join('\t\t%s: { t: "%s", s: "%s" },\n' % r for r in ROWS)
old = '\t\tT27: { t: "Consent and confirmation for personal related information (delivery)", s: "APPI Art. 31(1)" },\n'
rep(old, old + lines)
rep('JP_PROV: JP_PROV, JP_XBASIS: JP_XBASIS,', 'JP_PROV: JP_PROV, JP_XBASIS: JP_XBASIS, KR_BASES: KR_BASES, KR_PROV: KR_PROV, KR_XBASIS: KR_XBASIS,')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)
print('ng-data: Korea added')
