# Wires the China module into pn_block.js, can_module.js and in_module.js. Fails if already wired.
B = '/home/claude/ng-build/build/'
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

PTR = ('if (num.cn) first.push({ k: "p", x: "If you are in mainland China, section " + num.cn + " also applies to you." + (yes(s, "cnPipo") ? " Our personal information protection officer: " + '
       '(v(s, "cnPipoName") || "[name or title]") + ", " + stop(v(s, "cnPipoContact") || "[contact details]") : "") });\n')

p = B + 'pn_block.js'; t = open(p).read()
assert 'cnLead' not in t
t = rep(t, 'Switzerland, Brazil, Canada, India, California, other US states, sets the main text', 'Switzerland, Brazil, Canada, India, China, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "ca", "us"];')
t = rep(t, 'p === "in" ? "In" : p === "ca" ? "Ca" : "Us"); }', 'p === "in" ? "In" : p === "cn" ? "Cn" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "in") return inConsent(s);\n', '\t\tif (prim(s) === "in") return inConsent(s);\n\t\tif (prim(s) === "cn") return cnConsent(s);\n')
t = rep(t, 'show: function (s) { return prim(s) !== "can" && prim(s) !== "in"; } },', 'show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn"; } },')
t = rep(t, 'prim(s) === "in" ? "Organisation (the Data Fiduciary)" : "Organisation (the controller)"; }',
          'prim(s) === "in" ? "Organisation (the Data Fiduciary)" : prim(s) === "cn" ? "Organisation (the personal information processor)" : "Organisation (the controller)"; }')
t = rep(t, '\t\t\t\t  show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in"; } },',
          '\t\t\t\t  show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn"; } },')
t = rep(t, 'show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && yes(s, "dpo"); },',
          'show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && yes(s, "dpo"); },')
# per-purpose fields after inEnables
old = 'ph: "for example delivering your order and sending its tracking updates", hint: "Rule 3(b)(ii): the notice describes them specifically, next to the itemised personal data." },\n'
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "cnBasis", type: "select", label: function (s) { return (prim(s) === "cn" ? "Ground" : "China: ground") + " under the PIPL (Article 13)"; }, opts: function () { return D.CN_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: cnOn,\n'
 '\t\t\t\t\t  hint: "Consent, or one of the six grounds that need no consent (Article 13, second paragraph). Its own answer: no other law\'s legal basis is read as one. The PIPL has no legitimate interests ground." },\n'
 '\t\t\t\t\t{ id: "cnLaw", type: "text", label: "China: the law or administrative regulation", show: function (s, a) { return cnOn(s) && v(a, "cnBasis") === "law"; } },\n'
 '\t\t\t\t\t{ id: "cnSens", type: "yesno", label: function (s) { return (prim(s) === "cn" ? "Does" : "China: does") + " this purpose use sensitive personal information?"; }, show: cnOn,\n'
 '\t\t\t\t\t  hint: "Article 28: biometric, religious belief, specific identity, medical health, financial account and whereabouts information, the personal information of minors under 14, and any information whose leak or misuse can easily harm a person\'s dignity, or personal or property safety." },\n'
 '\t\t\t\t\t{ id: "cnSensWhy", type: "text", label: "China: why the sensitive personal information is necessary, and its impact on the person", show: function (s, a) { return cnOn(s) && yes(a, "cnSens"); },\n'
 '\t\t\t\t\t  hint: "Article 30 and Regulations Article 21(1)(2): both go in the notice." },\n')
t = rep(t, 'show: function (s) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" || inReg(s, "br")) && pnSourceDirect(s); } },',
          'show: function (s) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" || inReg(s, "br")) && pnSourceDirect(s); } },')
t = rep(t, 'show: function (s, a) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },',
          'show: function (s, a) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },')
# recipients: Article 23 details
t = rep(t, '\t\t\t\t\t{ id: "where", type: "text", label: "Where located" }\n\t\t\t\t  ] }\n\t\t\t] },\n',
 '\t\t\t\t\t{ id: "where", type: "text", label: "Where located" },\n'
 '\t\t\t\t\t{ id: "cnContact", type: "text", label: "China: its contact details", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },\n'
 '\t\t\t\t\t  hint: "Article 23: for another processor, the notice gives its name, contact, purpose, processing method and categories." },\n'
 '\t\t\t\t\t{ id: "cnHow", type: "text", label: "China: how it processes the personal information", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; } },\n'
 '\t\t\t\t\t{ id: "cnData", type: "text", label: "China: the categories of personal information it receives", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; } }\n'
 '\t\t\t\t  ] }\n\t\t\t] },\n')
t = rep(t, 'inReg(s, "in") ? "India" : ""].filter(Boolean);', 'inReg(s, "in") ? "India" : "", inReg(s, "cn") ? "mainland China" : ""].filter(Boolean);')
old = '\t\t\t\t{ id: "inAbroadWhere", type: "text", label: "India: in which countries", show: function (s) { return inOn(s) && yes(s, "inAbroad"); } }\n'
t = rep(t, old, old[:-1] + ',\n' +
 '\t\t\t\t{ id: "cnAbroad", type: "yesno", label: "China: is personal information provided to recipients outside mainland China?", show: cnOn,\n'
 '\t\t\t\t  hint: "Article 39. Hong Kong, Macao and Taiwan count as outside mainland China. A service provider abroad that can access the data counts as a recipient." },\n'
 '\t\t\t\t{ id: "cnXrows", type: "repeater", label: "Overseas recipients under the PIPL", itemLabel: "Overseas recipient", add: "Add an overseas recipient", show: function (s) { return cnOn(s) && yes(s, "cnAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "name", type: "text", label: "Recipient" },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country or region" },\n'
 '\t\t\t\t\t{ id: "contact", type: "text", label: "Its contact details" },\n'
 '\t\t\t\t\t{ id: "purpose", type: "text", label: "Purpose" },\n'
 '\t\t\t\t\t{ id: "how", type: "text", label: "How it processes the personal information" },\n'
 '\t\t\t\t\t{ id: "data", type: "text", label: "Categories of personal information" },\n'
 '\t\t\t\t\t{ id: "rights", type: "text", label: "How people exercise their PIPL rights against it", ph: "for example by writing to us at the address in section 1; we pass the request on and answer within 15 working days" }\n'
 '\t\t\t\t  ] }\n')
t = rep(t, '\t\t\t\t\t\tp === "in" ? "Do you take decisions about people based solely on automated processing of their personal data?" :\n',
          '\t\t\t\t\t\tp === "in" ? "Do you take decisions about people based solely on automated processing of their personal data?" :\n'
          '\t\t\t\t\t\tp === "cn" ? "Do you make decisions through automated decision-making that have a major impact on people\'s rights and interests?" :\n')
t = rep(t, '\t\t\t\t\t\tp === "in" ? "The DPDP Act has no rule of its own on automated decisions. Personal data used to make a decision that affects the person must be complete, accurate and consistent (section 8(3))." :\n',
          '\t\t\t\t\t\tp === "in" ? "The DPDP Act has no rule of its own on automated decisions. Personal data used to make a decision that affects the person must be complete, accurate and consistent (section 8(3))." :\n'
          '\t\t\t\t\t\tp === "cn" ? "Articles 24 and 73: a computer program analyses and assesses a person\'s behaviour, interests, or economic, health or credit status, and makes a decision. For a decision with a major impact, people can ask for an explanation and refuse a decision made solely by automated means. Personalised push and marketing is asked in the China section." :\n')
t = rep(t, '\t\t\tIN_SECTION,\n\t\t\tCA_SECTION,\n', '\t\t\tIN_SECTION,\n\t\t\tCN_SECTION,\n\t\t\tCA_SECTION,\n')
t = rep(t, 'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s); },', 'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s) || cnConsent(s); },')
t = rep(t, '\t\t\t\t\tprim(s) === "in" ? "As easily as consent was given (section 6(4); Rule 3(c)(i)). If consent was a tick box, withdrawal is a click, not a letter. Leave empty to point to the link in the India section." :',
          '\t\t\t\t\tprim(s) === "in" ? "As easily as consent was given (section 6(4); Rule 3(c)(i)). If consent was a tick box, withdrawal is a click, not a letter. Leave empty to point to the link in the India section." :\n'
          '\t\t\t\t\tprim(s) === "cn" ? "A convenient way to withdraw (Article 15). If consent was a tick box, withdrawal is a click, not a letter." :')
old = '\t\t\t\t  show: function (s) { return yes(s, "further") && inOn(s); }, hint: "The purpose in the notice is the specified purpose (section 2(za)). A new one needs a new notice and consent, unless a legitimate use in section 7 applies." },\n'
t = rep(t, old, old +
 '\t\t\t\t{ id: "cnFurther", type: "select", label: function (s) { return (prim(s) === "cn" ? "Ground" : "China: ground") + " for the new purpose"; }, opts: function () { return D.CN_BASES.map(function (x) { return { v: x.v, l: x.l }; }); },\n'
 '\t\t\t\t  show: function (s) { return yes(s, "further") && cnOn(s); }, hint: "Article 14: a change of purpose needs new consent where consent is the ground. Otherwise name the ground in Article 13 that covers it." },\n')
# build(): skeleton
t = rep(t, 'IN = inReg(s, "in"), CA = inReg(s, "ca"), US = inReg(s, "us"), GL = P !== "ch";\n', 'IN = inReg(s, "in"), CN = inReg(s, "cn"), CA = inReg(s, "ca"), US = inReg(s, "us"), GL = P !== "ch";\n')
t = rep(t, '\t\t\tif (P === "in") return inLead(s);\n', '\t\t\tif (P === "in") return inLead(s);\n\t\t\tif (P === "cn") return cnLead(s);\n')
t = rep(t, '\t\t\tif (IN) num.in = c++;\n', '\t\t\tif (IN) num.in = c++;\n\t\t\tif (CN) num.cn = c++;\n')
t = rep(t, '\t\t\tif (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });\n\t\t\tif (num.ca)',
          '\t\t\tif (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });\n\t\t\t' + PTR + '\t\t\tif (num.ca)')
t = rep(t, '\t\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));\n\t\t\t\tinRes = inChecks(s, false);\n\t\t\t}\n',
          '\t\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));\n\t\t\t\tinRes = inChecks(s, false);\n\t\t\t}\n'
          '\t\t\tvar cnRes = null;\n\t\t\tif (num.cn) {\n\t\t\t\tblocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });\n'
          '\t\t\t\tArray.prototype.push.apply(blocks, cnSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));\n\t\t\t\tcnRes = cnChecks(s, false);\n\t\t\t}\n')
t = rep(t, '\t\t\tif (inRes) Array.prototype.push.apply(checks, inRes.checks);\n', '\t\t\tif (inRes) Array.prototype.push.apply(checks, inRes.checks);\n\t\t\tif (cnRes) Array.prototype.push.apply(checks, cnRes.checks);\n')
t = rep(t, '\t\t\tif (inRes) Array.prototype.push.apply(delivery, inRes.delivery);\n', '\t\t\tif (inRes) Array.prototype.push.apply(delivery, inRes.delivery);\n\t\t\tif (cnRes) Array.prototype.push.apply(delivery, cnRes.delivery);\n')
# brLead (lives in pn_block)
t = rep(t, '\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "cn")) num.cn = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', 2)  # brLead and the spliced canLead copy
t = rep(t, '\t\tif (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });\n\t\tif (num.ca)',
          '\t\tif (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });\n\t\t' + PTR + '\t\tif (num.ca)', 2)
t = rep(t, '\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));\n\t\t\tinRes = inChecks(s, false);\n\t\t}\n',
          '\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));\n\t\t\tinRes = inChecks(s, false);\n\t\t}\n'
          '\t\tvar cnRes = null;\n\t\tif (num.cn) {\n\t\t\tblocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, cnSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));\n\t\t\tcnRes = cnChecks(s, false);\n\t\t}\n')
t = rep(t, '\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n',
          '\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n\t\tif (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }\n', 2)
# marker for the China module, right before var PN
t = rep(t, '\tvar PN = {\n', '\t/* ========================================================= CHINA === */\n\tvar PN = {\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

# Canada module: China section in a Canada-led notice
p = B + 'can/can_module.js'; m = open(p).read()
m = rep(m, '\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "cn")) num.cn = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n',
          '\t\t' + PTR + '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n')
m = rep(m, '\t\t\tinRes = inChecks(s, false);\n\t\t}\n',
          '\t\t\tinRes = inChecks(s, false);\n\t\t}\n'
          '\t\tvar cnRes = null;\n\t\tif (num.cn) {\n\t\t\tblocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, cnSection(s, canSecs, "Canadian law"));\n\t\t\tcnRes = cnChecks(s, false);\n\t\t}\n')
m = rep(m, '\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n',
          '\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n\t\tif (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }\n')
assert all(ord(c) < 128 for c in m)
open(p, 'w').write(m)

# India module: China section in an India-led notice
p = B + 'in/in_module.js'; m = open(p).read()
m = rep(m, '\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "cn")) num.cn = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n',
          '\t\t' + PTR + '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n')
m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {',
          '\t\tvar cnRes = null;\n\t\tif (num.cn) {\n\t\t\tblocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, cnSection(s, inSecs, "the DPDP Act"));\n\t\t\tcnRes = cnChecks(s, false);\n\t\t}\n'
          '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {')
m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
          '\t\tif (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
assert all(ord(c) < 128 for c in m)
open(p, 'w').write(m)
print('pn_block, can_module and in_module wired')
