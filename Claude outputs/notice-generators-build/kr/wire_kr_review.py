# Applies the independent review of 13 November 2026 (build/review-2026-11-13-kr/findings.json) to the
# shared form in pn_block.js and to ng-data.js. kr_module.js was rewritten separately. Fails if already applied.
B = '/home/claude/ng-build/build/'
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)
THIRD = '["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1'

p = B + 'pn_block.js'; t = open(p).read()
assert 'krSensKinds' not in t
# K12: the public-institution basis is not offered to a body that is not public
t = rep(t, 'opts: function () { return D.KR_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: krOn,',
          'opts: function (s) { return D.KR_BASES.filter(function (x) { return x.v !== "public" || !no(s, "publicBody"); }).map(function (x) { return { v: x.v, l: x.l }; }); }, show: krOn,')
# K04, K17: kinds of special data, with a basis and a law for each
old = ('\t\t\t\t\t{ id: "krSens", type: "yesno", label: function (s) { return (prim(s) === "kr" ? "Does" : "Korea: does") + " this purpose use sensitive information or unique identifiers?"; }, show: krOn,\n'
       '\t\t\t\t\t  hint: "Article 23 and Enforcement Decree Article 18: beliefs, trade union or party membership, political views, health, sex life, genetic test and criminal record data, biometric data used to identify a person, race or ethnicity. Article 24: unique identifiers such as passport, driving licence and alien registration numbers." },\n'
       '\t\t\t\t\t{ id: "krSensBasis", type: "select", label: "Korea: basis for it", show: function (s, a) { return krOn(s) && yes(a, "krSens"); },\n'
       '\t\t\t\t\t  opts: [{ v: "consent", l: "Consent given separately from other consents (Articles 23(1)(1), 24(1)(1))" }, { v: "law", l: "A law requires or allows it (Articles 23(1)(2), 24(1)(2))" }] },\n')
new = ('\t\t\t\t\t{ id: "krSens", type: "yesno", label: function (s) { return (prim(s) === "kr" ? "Does" : "Korea: does") + " this purpose use sensitive information or unique identifiers, including resident registration numbers?"; }, show: krOn,\n'
       '\t\t\t\t\t  hint: "Article 23 and Enforcement Decree Article 18: beliefs, trade union or party membership, political views, health, sex life, genetic test and criminal record data, biometric data used to identify a person, race or ethnicity. Article 24 and Enforcement Decree Article 19: resident registration, passport, driving licence and alien registration numbers." },\n'
       '\t\t\t\t\t{ id: "krSensKinds", type: "checks", label: "Korea: which of them", show: function (s, a) { return krOn(s) && yes(a, "krSens"); },\n'
       '\t\t\t\t\t  opts: [{ v: "sens", l: "Sensitive information (Article 23)" }, { v: "uid", l: "Passport, driving licence or alien registration numbers (Article 24)" }, { v: "rrn", l: "Resident registration numbers (Article 24-2)" }] },\n'
       '\t\t\t\t\t{ id: "krSensBasis", type: "select", label: "Korea: basis for the sensitive information", show: function (s, a) { return krOn(s) && krHasKind(a, "sens"); },\n'
       '\t\t\t\t\t  opts: [{ v: "consent", l: "Consent given separately from other consents (Article 23(1)(1))" }, { v: "law", l: "A law requires or allows it (Article 23(1)(2))" }] },\n'
       '\t\t\t\t\t{ id: "krSensLaw", type: "text", label: "Korea: the law and article for the sensitive information", show: function (s, a) { return krOn(s) && krHasKind(a, "sens") && v(a, "krSensBasis") === "law"; } },\n'
       '\t\t\t\t\t{ id: "krUidBasis", type: "select", label: "Korea: basis for the unique identifiers", show: function (s, a) { return krOn(s) && krHasKind(a, "uid"); },\n'
       '\t\t\t\t\t  opts: [{ v: "consent", l: "Consent given separately from other consents (Article 24(1)(1))" }, { v: "law", l: "A law specifically requires or allows it (Article 24(1)(2))" }] },\n'
       '\t\t\t\t\t{ id: "krUidLaw", type: "text", label: "Korea: the law and article for the unique identifiers", show: function (s, a) { return krOn(s) && krHasKind(a, "uid") && v(a, "krUidBasis") === "law"; } },\n'
       '\t\t\t\t\t{ id: "krRrnBasis", type: "select", label: "Korea: basis for the resident registration numbers (Article 24-2(1))", show: function (s, a) { return krOn(s) && krHasKind(a, "rrn"); },\n'
       '\t\t\t\t\t  opts: [{ v: "law", l: "A law, decree or rule specifically requires or allows it (Article 24-2(1)(1))" }, { v: "urgent", l: "Clearly needed for urgent life, body or property (Article 24-2(1)(2))" }, { v: "notice", l: "A case the PIPC sets by notice (Article 24-2(1)(3))" }],\n'
       '\t\t\t\t\t  hint: "Consent is not a basis for resident registration numbers." },\n'
       '\t\t\t\t\t{ id: "krRrnLaw", type: "text", label: function (s, a) { return v(a, "krRrnBasis") === "notice" ? "Korea: the PIPC notice relied on" : "Korea: the law and article"; }, show: function (s, a) { return krOn(s) && krHasKind(a, "rrn") && (v(a, "krRrnBasis") === "law" || v(a, "krRrnBasis") === "notice"); } },\n')
t = rep(t, old, new)
# K02: the law for Article 17(1)(2) and 18(2)(2); K09: sub-processors
old = ('\t\t\t\t\t{ id: "krProvLaw", type: "text", label: "Korea: the legal basis, for example the law and article (optional)", show: function (s, r) { return krOn(s) && ' + THIRD + ' && v(r, "krProv") === "collected"; } },\n')
new = ('\t\t\t\t\t{ id: "krProvLaw", type: "text", label: function (s, r) { return v(r, "krProv") === "otherlaw" ? "Korea: the law and article that provides for it" : "Korea: the law and article, where a law is the basis"; },\n'
       '\t\t\t\t\t  show: function (s, r) { return krOn(s) && ' + THIRD + ' && (v(r, "krProv") === "collected" || v(r, "krProv") === "otherlaw"); }, ph: "for example Criminal Procedure Act, Article 215" },\n')
t = rep(t, old, new)
old = '\t\t\t\t\t{ id: "krRet", type: "text", label: "Korea: how long it keeps it", show: function (s, r) { return krOn(s) && ' + THIRD + '; } }\n'
new = ('\t\t\t\t\t{ id: "krRet", type: "text", label: "Korea: how long it keeps it", show: function (s, r) { return krOn(s) && ' + THIRD + '; }, hint: "Required where you provide on consent; recommended where a law sets it." },\n'
       '\t\t\t\t\t{ id: "krSub", type: "text", label: "Korea: its sub-processors and their work, or where its list is published, or none", show: function (s, r) { return krOn(s) && v(r, "role") === "processor"; },\n'
       '\t\t\t\t\t  hint: "Article 26(2): re-entrustees are disclosed too; Article 26(6): re-entrusting needs your consent." }\n')
t = rep(t, old, new)
# K01: transfers by a business collecting from abroad
old = '\t\t\t\t{ id: "krAbroad", type: "yesno", label: "Korea: is personal information provided, entrusted or stored abroad?", show: krOn,\n'
i = t.index(old); j = t.index('\n', i + len(old))
hint_line = t[i + len(old):j + 1]
assert 'hint:' in hint_line
t = t[:i] + old + '\t\t\t\t  hint: function (s) { return "Article 28-8: provision (including access from abroad), entrusted processing and storage abroad are all transfers. Name every country of a cloud service (PIPC drafting guidelines, item 10)." + (krOffshore(s) ? " Collecting from abroad, list every recipient outside Korea, also in the countries where you process the data." : ""); } },\n' + t[j + 1:]
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

d = '/home/claude/ng-build/pages/notice-generators/ng-data.js'; g = open(d).read()
assert '"otherlaw"' not in g
g = rep(g, '{ v: "contract", l: "Needed to conclude or perform a contract with the person, or for steps they ask for before one (Article 15(1)(4))", t: "Needed to conclude or perform a contract with you, or to take steps you ask for before one", ref: "Article 15(1)(4)" },',
          '{ v: "contract", l: "Needed to perform a contract with the person, or for steps they ask for while concluding one (Article 15(1)(4))", t: "Needed to perform a contract with you, or to take steps you ask for while we conclude one", ref: "Article 15(1)(4)" },')
old = g[g.index('\tvar KR_PROV = ['):g.index('\t/* PIPA Art. 28-8(1): the basis for a transfer abroad.')]
new = ('\tvar KR_PROV = [\n'
       '\t\t{ v: "consent", l: "Consent (Art. 17(1)(1))", t: "with your consent", ref: "Article 17(1)(1)" },\n'
       '\t\t{ v: "collected", l: "Within the purposes of data collected under Art. 15(1)(2), (3) or (5) to (7), not contract data (Art. 17(1)(2))", t: "within the purposes for which we collected it under a law or legal obligation, for urgent interests, for our legitimate interests or for public safety", ref: "Article 17(1)(2)" },\n'
       '\t\t{ v: "related", l: "Reasonably related to the original purpose (Art. 17(4))", t: "within a scope reasonably related to the purpose for which we collected it", ref: "Article 17(4); Enforcement Decree Article 14-2" },\n'
       '\t\t{ v: "sep", l: "Beyond the original purpose: separate consent (Art. 18(2)(1))", t: "beyond the original purpose, with your separate consent", ref: "Article 18(2)(1)" },\n'
       '\t\t{ v: "otherlaw", l: "Beyond the original purpose: another law\'s special provision, such as a warrant (Art. 18(2)(2))", t: "beyond the original purpose, because another law specifically provides for it", ref: "Article 18(2)(2)" },\n'
       '\t\t{ v: "urgent", l: "Beyond the original purpose: urgent life, body or property (Art. 18(2)(3))", t: "beyond the original purpose, where clearly needed to protect the urgent life, body or property interests of you or someone else", ref: "Article 18(2)(3)" },\n'
       '\t\t{ v: "safety", l: "Beyond the original purpose: urgent public safety (Art. 18(2)(10))", t: "beyond the original purpose, where urgently needed for public safety, such as public health", ref: "Article 18(2)(10)" }\n'
       '\t];\n')
g = g.replace(old, new)
g = rep(g, '\t/* PIPA Art. 17(1), (4): the basis for providing personal information to a third party. */', '\t/* PIPA Arts. 17(1), (4) and 18(2): the basis for providing personal information to a third party. Article 18(2)(5) to (9)\n\t   are for public institutions only and not offered (review K02). */')
g = rep(g, '{ v: "contract", l: "Entrusted processing or storage needed for a contract with the person, disclosed in this policy (Art. 28-8(1)(3))", ref: "Article 28-8(1)(3)" },',
          '{ v: "contract", l: "Entrusted processing or storage, including on your own systems, needed for a contract with the person, disclosed in this policy (Art. 28-8(1)(3))", ref: "Article 28-8(1)(3)" },')
g = rep(g, '{ v: "equiv", l: "The PIPC recognises the country\'s protection as equivalent: the European Union (Art. 28-8(1)(5))", ref: "Article 28-8(1)(5)" }',
          '{ v: "equiv", l: "The PIPC recognises the country\'s protection as equivalent: the EU and EEA states, until 15 September 2028 (Art. 28-8(1)(5))", ref: "Article 28-8(1)(5)" }')
g = rep(g, '\t/* PIPA Art. 28-8(1): the basis for a transfer abroad. The PIPC recognised the European Union as equivalent\n\t   on 16 September 2025 (news reports; the PIPC notice itself not read). */',
          '\t/* PIPA Art. 28-8(1): the basis for a transfer abroad. The PIPC recognised the EU and EEA states as equivalent on\n\t   16 September 2025, until 15 September 2028, excluding resident registration numbers and personal credit\n\t   information (PIPC announcement No. 2025-68, through a law firm update and news reports; review K03). */')
rows = {
 "S06": ("Sensitive information, unique identifiers and resident registration numbers", "PIPA Arts. 23, 24, 24-2; Enforcement Decree Arts. 18, 19"),
 "S08": ("Destruction procedure and method, and data kept under other laws", "PIPA Arts. 21, 30(1)(3-2); Enforcement Decree Art. 16; PIPC drafting guidelines, item 6"),
 "S09": ("Provision to third parties", "PIPA Arts. 17, 18(2), 30(1)(3); PIPC drafting guidelines, item 7"),
 "S10": ("Entrustment of processing, with sub-processors", "PIPA Arts. 26(2), (6), 30(1)(4); Enforcement Decree Art. 28; PIPC drafting guidelines, item 9"),
 "S14": ("Automated decisions", "PIPA Art. 37-2; Enforcement Decree Arts. 44-2 to 44-4"),
 "S16": ("Domestic representative", "PIPA Art. 31-2; Enforcement Decree Art. 32-3"),
 "S25": ("Amendments not yet in force", "PIPA Arts. 28-12 to 28-15 (from 9 March 2027), 32-2(1) (from 1 July 2027)"),
}
for k, (tt, ss) in rows.items():
    i = g.index('\t\t' + k + ': { t: "'); j = g.index('\n', i)
    g = g[:i] + '\t\t%s: { t: "%s", s: "%s" },' % (k, tt, ss) + g[j:]
old = '\t\tS32: { t: "New purpose", s: "PIPA Arts. 15(3), 18(2)" },\n'
g = rep(g, old, '\t\tS32: { t: "New purpose", s: "PIPA Arts. 15(3), 17(4), 18(2)" },\n'
          '\t\tS33: { t: "Video devices and generative AI services (not modelled)", s: "PIPA Arts. 25, 25-2; PIPC drafting guidelines, items 21, 22 and appendix" },\n'
          '\t\tS34: { t: "Use and provision history notice (delivery)", s: "PIPA Art. 20-2; Enforcement Decree Art. 15-3" },\n')
assert all(ord(c) < 128 for c in g)
open(d, 'w').write(g)
print('review wiring applied')
