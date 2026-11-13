# Applies the Japan review findings outside jp_module.js: pn_block.js (form fields that a Japan-led notice
# does not print, the foreign-country rows) and ng-data.js (Article 20(2) grounds, the contract basis, the
# matrix rows). Fails if already applied. Review: build/review-2026-11-12-jp/findings.json.
B = '/home/claude/ng-build/'
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

p = B + 'build/pn_block.js'; t = open(p).read()
assert 'noCountryWhy' not in t
# R20: the APPI has no general rule on withdrawing consent; a Japan-led notice prints no withdrawal answer.
t = rep(t, '\t\tif (prim(s) === "jp") return jpConsent(s);\n', '\t\tif (prim(s) === "jp") return false; /* the APPI has no general rule on withdrawing consent */\n')
# R20: GDPR joint controllers and the Article 22 logic and effect are not printed in a Japan-led notice.
t = rep(t, '{ id: "joint", type: "yesno", label: "Do you decide purposes and means jointly with another organisation for any of this processing?", show: function (s) { return !usStyle(s); } },',
          '{ id: "joint", type: "yesno", label: "Do you decide purposes and means jointly with another organisation for any of this processing?", show: function (s) { return !usStyle(s) && prim(s) !== "jp"; } },')
for f in ['jointWho', 'jointEssence', 'jointContact']:
    i = t.index('{ id: "' + f + '"'); j = t.index('\n', i)
    line = t[i:j]
    assert line.count('return !usStyle(s) && yes(s, "joint"); }') == 1, f
    t = t[:i] + line.replace('return !usStyle(s) && yes(s, "joint"); }', 'return !usStyle(s) && prim(s) !== "jp" && yes(s, "joint"); }') + t[j:]
t = rep(t, '{ id: "jointP", type: "yesno", label: "Is this purpose run jointly with the other controller?", show: function (s) { return yes(s, "joint"); } }',
          '{ id: "jointP", type: "yesno", label: "Is this purpose run jointly with the other controller?", show: function (s) { return yes(s, "joint") && prim(s) !== "jp"; } }')
t = rep(t, '{ id: "admLogic", type: "area", label: "Meaningful information about the logic involved", rows: 3, show: function (s) { return yes(s, "adm"); },',
          '{ id: "admLogic", type: "area", label: "Meaningful information about the logic involved", rows: 3, show: function (s) { return yes(s, "adm") && prim(s) !== "jp"; },')
t = rep(t, '{ id: "admEffect", type: "area", label: "Significance and envisaged consequences for the person", rows: 2, show: function (s) { return yes(s, "adm"); } },',
          '{ id: "admEffect", type: "area", label: "Significance and envisaged consequences for the person", rows: 2, show: function (s) { return yes(s, "adm") && prim(s) !== "jp"; } },')
# R15: consent rows where the country cannot be identified or the measures cannot be described (Rules Article 17(3), (4)).
old = ('\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient" },\n'
       '\t\t\t\t\t{ id: "country", type: "text", label: "Country or region" },\n'
       '\t\t\t\t\t{ id: "basis", type: "select", label: "Why the provision is permitted", opts: function () { return D.JP_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
       '\t\t\t\t\t{ id: "system", type: "text", label: "The country\'s system for protecting personal information", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
       '\t\t\t\t\t  hint: "Rules Article 17(2)(ii): obtained by an appropriate and reasonable method, for example the PPC\'s country reports." },\n'
       '\t\t\t\t\t{ id: "measures", type: "text", label: "The recipient\'s measures to protect personal information", show: function (s, r) { return v(r, "basis") === "consent"; } }\n')
new = ('\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },\n'
       '\t\t\t\t\t{ id: "country", type: "text", label: "Country or region", show: function (s, r) { return !(v(r, "basis") === "consent" && yes(r, "noCountry")); } },\n'
       '\t\t\t\t\t{ id: "basis", type: "select", label: "Why the provision is permitted", opts: function () { return D.JP_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); },\n'
       '\t\t\t\t\t  hint: "A designated country or an equivalent system removes only the need for consent under Article 28: the recipient still needs a basis under Article 27, such as entrustment." },\n'
       '\t\t\t\t\t{ id: "noCountry", type: "yesno", label: "The country cannot be identified when consent is asked", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
       '\t\t\t\t\t  hint: "Rules Article 17(3): say so, why, and give any information that helps instead." },\n'
       '\t\t\t\t\t{ id: "noCountryWhy", type: "text", label: "Why the country cannot be identified", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noCountry"); } },\n'
       '\t\t\t\t\t{ id: "noCountryInfo", type: "text", label: "Information that helps instead (optional)", ph: "for example the countries being considered", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noCountry"); } },\n'
       '\t\t\t\t\t{ id: "system", type: "text", label: "The country\'s system for protecting personal information", show: function (s, r) { return v(r, "basis") === "consent" && !yes(r, "noCountry"); },\n'
       '\t\t\t\t\t  hint: "Rules Article 17(2)(ii): obtained by an appropriate and reasonable method, for example the PPC\'s country reports." },\n'
       '\t\t\t\t\t{ id: "noMeasures", type: "yesno", label: "The recipient\'s measures cannot be described when consent is asked", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
       '\t\t\t\t\t  hint: "Rules Article 17(4): say so and why." },\n'
       '\t\t\t\t\t{ id: "noMeasuresWhy", type: "text", label: "Why they cannot be described", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noMeasures"); } },\n'
       '\t\t\t\t\t{ id: "measures", type: "text", label: "The recipient\'s measures to protect personal information", show: function (s, r) { return v(r, "basis") === "consent" && !yes(r, "noMeasures"); } }\n')
t = rep(t, old, new)
t = rep(t, '  hint: "Article 28. Entrusting handling to a party abroad counts. The EEA states and the United Kingdom are designated (PPC Notice No. 1 of 2019)." },',
          '  hint: "Article 28. Entrusting handling to a party abroad counts. The EEA states and the United Kingdom are designated, for recipients subject to the GDPR or the UK GDPR (PPC Notice No. 1 of 2019)." },')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

p = B + 'pages/notice-generators/ng-data.js'; t = open(p).read()
assert 'Cabinet Order Art. 9(i)' not in t
# R13: grounds; ref is printed after the text.
old = t[t.index('\tvar JP_SENS_GROUNDS = ['):t.index('\t/* APPI Art. 27: the basis for providing')]
new = ('\tvar JP_SENS_GROUNDS = [\n'
       '\t\t{ v: "consent", l: "Prior consent (Art. 20(2))", t: "With your prior consent", ref: "Article 20(2)" },\n'
       '\t\t{ v: "law", l: "Based on a law (Art. 20(2)(i))", t: "As a law requires or permits", ref: "Article 20(2)(i)" },\n'
       '\t\t{ v: "life", l: "Protecting life, body or property, consent hard to obtain (Art. 20(2)(ii))", t: "To protect a person\'s life, body or property, where your consent is hard to obtain", ref: "Article 20(2)(ii)" },\n'
       '\t\t{ v: "health", l: "Public health or children\'s healthy development, consent hard to obtain (Art. 20(2)(iii))", t: "To improve public health or promote children\'s healthy development, where your consent is hard to obtain", ref: "Article 20(2)(iii)" },\n'
       '\t\t{ v: "state", l: "Cooperating with the State, a local government or a person they entrust (Art. 20(2)(iv))", t: "To cooperate with a national or local government body, or a person it entrusts, carrying out duties under the law, where asking for consent would hinder them", ref: "Article 20(2)(iv)" },\n'
       '\t\t{ v: "academic", l: "Academic research (Art. 20(2)(v), (vi))", t: "For academic research by, or jointly with, an academic research institution", ref: "Article 20(2)(v), (vi)" },\n'
       '\t\t{ v: "published", l: "Made public by the person, a public body, the media or others listed (Art. 20(2)(vii))", t: "The information has been made public by you, a public body, the media or another person the law lists", ref: "Article 20(2)(vii)" },\n'
       '\t\t{ v: "visible", l: "Evident from the person\'s appearance when seen or filmed (Art. 20(2)(viii); Cabinet Order Art. 9(i))", t: "It is evident from your appearance when we see or film you", ref: "Article 20(2)(viii); Cabinet Order Article 9(i)" },\n'
       '\t\t{ v: "received", l: "Received from a business that entrusts it, transfers its business or uses it jointly (Art. 20(2)(viii); Cabinet Order Art. 9(ii))", t: "We receive it from another business that entrusts us with it, transfers its business to us or uses it jointly with us", ref: "Article 20(2)(viii); Cabinet Order Article 9(ii)" }\n'
       '\t];\n')
assert old.count('\n\t];\n') == 1
t = t.replace(old, new)
t = rep(t, '/* APPI Art. 20(2): acquiring special care-required personal information. t: wording in the notice.\n\t   Read in Japanese on e-Gov, 12 November 2026. */',
          '/* APPI Art. 20(2) and Cabinet Order Art. 9: acquiring special care-required personal information. t: wording\n\t   in the notice; ref: the provision. Read in Japanese on e-Gov, 12 November 2026. */')
# R14
t = rep(t, '{ v: "contract", l: "Recipient with an equivalent system under a contract with you (Rules Art. 16(i))" },',
          '{ v: "contract", l: "Recipient that ensures equivalent measures through a contract, group rules or another appropriate and reasonable method (Rules Art. 16(i))" },')
# Matrix rows
M = [('T01: { t: "Business name, address and representative", s: "APPI Art. 32(1)(i)" },', 'T01: { t: "Business name, address and representative", s: "APPI Art. 32(1)(i); Guidelines 3-8-1" },'),
     ('T06: { t: "Provision to third parties and entrusted handling", s: "APPI Arts. 25, 27(1), 27(5)(i)" },', 'T06: { t: "Provision to third parties and entrusted handling", s: "APPI Arts. 25, 27(1), 27(5)(i), 28(1)" },'),
     ('T07: { t: "Joint use", s: "APPI Art. 27(5)(iii), (6)" },', 'T07: { t: "Joint use", s: "APPI Art. 27(5)(iii), (6); Guidelines 3-6-3" },'),
     ('T08: { t: "Provision under the opt-out scheme", s: "APPI Art. 27(2), (3)" },', 'T08: { t: "Provision under the opt-out scheme", s: "APPI Art. 27(2), (3); Rules Art. 11(4)" },'),
     ('T17: { t: "Children", s: "2026 amendment (not in force)" },', 'T17: { t: "Children", s: "Guidelines 2-16; 2026 amendment (not in force)" },'),
     ('T19: { t: "Public bodies", s: "APPI Chapter 5" },', 'T19: { t: "Public bodies", s: "APPI Arts. 2(11), 16(2), 58, 171; Chapter 5" },'),
     ('T20: { t: "Publication so people can know it (delivery)", s: "APPI Arts. 21(1), 32(1); Guidelines 3-6-2-1, 3-8-1" },', 'T20: { t: "Publication so people can know it (delivery)", s: "APPI Arts. 21(1), 32(1); Guidelines 2-15, 3-8-1" },'),
     ('T23: { t: "Filing the opt-out provision (delivery)", s: "APPI Art. 27(2), (3)" },', 'T23: { t: "Filing the opt-out provision (delivery)", s: "APPI Arts. 27(2), (3), 29; Rules Art. 11" },')]
for a, b in M:
    t = rep(t, a, b)
old = '\t\tT24: { t: "Checks on recipients with an equivalent system (delivery)", s: "APPI Art. 28(3); Rules Art. 18" },\n'
t = rep(t, old, old +
        '\t\tT25: { t: "Personal related information", s: "APPI Art. 31(1)" },\n'
        '\t\tT26: { t: "Pseudonymously and anonymously processed information", s: "APPI Arts. 41(4), (6), 43(3), (4)" },\n'
        '\t\tT27: { t: "Consent and confirmation for personal related information (delivery)", s: "APPI Art. 31(1)" },\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)
print('Japan review wiring applied')
