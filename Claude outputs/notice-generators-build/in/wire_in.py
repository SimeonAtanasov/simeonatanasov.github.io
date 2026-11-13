# Wires the India module into pn_block.js, can_module.js and ng-data.js. Idempotent guard: fails if already wired.
import sys
B='/home/claude/ng-build/build/'
D='/home/claude/ng-build/pages/notice-generators/ng-data.js'
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:120])
    return t.replace(old, new)

p = B + 'pn_block.js'; t = open(p).read()
assert 'inLead' not in t
t = rep(t, 'Switzerland, Brazil, Canada, California, other US states, sets the main text', 'Switzerland, Brazil, Canada, India, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "ca", "us"];')
t = rep(t, 'p === "can" ? "Can" : p === "ca" ? "Ca" : "Us"); }', 'p === "can" ? "Can" : p === "in" ? "In" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "can") return canConsent(s);\n\t\tif (usStyle(s)) return false;', '\t\tif (prim(s) === "can") return canConsent(s);\n\t\tif (prim(s) === "in") return inConsent(s);\n\t\tif (usStyle(s)) return false;')
t = rep(t, '{ id: "children", type: "yesno", label: "Are children a significant part of the audience?", show: function (s) { return prim(s) !== "can"; } },',
          '{ id: "children", type: "yesno", label: "Are children a significant part of the audience?", show: function (s) { return prim(s) !== "can" && prim(s) !== "in"; } },')
t = rep(t, 'label: function (s) { return prim(s) === "can" ? "Organisation" : "Organisation (the controller)"; }, ph: "Legal name" },',
          'label: function (s) { return prim(s) === "can" ? "Organisation" : prim(s) === "in" ? "Organisation (the Data Fiduciary)" : "Organisation (the controller)"; }, ph: "Legal name" },')
t = rep(t, '\t\t\t\t  show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can"; } },', '\t\t\t\t  show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in"; } },')
t = rep(t, 'show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && yes(s, "dpo"); },', 'show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && yes(s, "dpo"); },')
# per-purpose fields after canSens
old_sens_end = 'Quebec: information that, by its nature or context, gives rise to a high level of reasonable expectation of privacy (section 12)." },\n'
assert t.count(old_sens_end) == 1
t = t.replace(old_sens_end, old_sens_end +
 '\t\t\t\t\t{ id: "inGround", type: "select", label: function (s) { return (prim(s) === "in" ? "Ground" : "India: ground") + " under the DPDP Act (section 4)"; }, opts: function () { return D.IN_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: inOn,\n'
 '\t\t\t\t\t  hint: "Consent, or one of the legitimate uses in section 7, which need no consent. Its own answer: no other law\'s legal basis is read as one." },\n'
 '\t\t\t\t\t{ id: "inEnables", type: "text", label: function (s) { return (prim(s) === "in" ? "" : "India: ") + "the goods or services provided, or the uses enabled, by this processing"; }, show: function (s, a) { return inOn(s) && v(a, "inGround") === "consent"; },\n'
 '\t\t\t\t\t  ph: "for example delivering your order and sending its tracking updates", hint: "Rule 3(b)(ii): the notice describes them specifically, next to the itemised personal data." },\n')
t = rep(t, 'show: function (s) { return (prim(s) !== "ch" && prim(s) !== "can" || inReg(s, "br")) && pnSourceDirect(s); } },',
          'show: function (s) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" || inReg(s, "br")) && pnSourceDirect(s); } },')
t = rep(t, 'show: function (s, a) { return (prim(s) !== "ch" && prim(s) !== "can" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },',
          'show: function (s, a) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },')
t = rep(t, 'inReg(s, "can") ? "Canada" : ""].filter(Boolean);', 'inReg(s, "can") ? "Canada" : "", inReg(s, "in") ? "India" : ""].filter(Boolean);')
old_outqc = 'hint: "Section 8: people are told of the possibility. Section 17: a privacy impact assessment and a written agreement come first. Service providers outside Quebec count." }\n'
assert t.count(old_outqc) == 1
t = t.replace(old_outqc, old_outqc[:-1] + ',\n' +
 '\t\t\t\t{ id: "inAbroad", type: "yesno", label: "India: is personal data processed outside India, by you or by Data Processors?", show: inOn,\n'
 '\t\t\t\t  hint: "The DPDP Act allows it unless the Central Government restricts transfers to a country by notification (section 16), subject to any requirements it sets for making data available to a foreign State (Rule 15). A sector law with stricter rules prevails (section 16(2))." },\n'
 '\t\t\t\t{ id: "inAbroadWhere", type: "text", label: "India: in which countries", show: function (s) { return inOn(s) && yes(s, "inAbroad"); } }\n')
t = rep(t, '\t\t\t\t\t\tp === "can" ? "Do you make decisions about people based exclusively on automated processing of their personal information?" :\n',
          '\t\t\t\t\t\tp === "can" ? "Do you make decisions about people based exclusively on automated processing of their personal information?" :\n\t\t\t\t\t\tp === "in" ? "Do you take decisions about people based solely on automated processing of their personal data?" :\n')
t = rep(t, '\t\t\t\t\t\tp === "can" ? "Quebec\'s Act, section 12.1: any decision made without a person taking part in it, whatever its effect." :\n',
          '\t\t\t\t\t\tp === "can" ? "Quebec\'s Act, section 12.1: any decision made without a person taking part in it, whatever its effect." :\n\t\t\t\t\t\tp === "in" ? "The DPDP Act has no rule of its own on automated decisions. Personal data used to make a decision that affects the person must be complete, accurate and consistent (section 8(3))." :\n')
t = rep(t, '\t\t\tCA_SECTION,\n\t\t\tUS_SECTION,\n', '\t\t\tIN_SECTION,\n\t\t\tCA_SECTION,\n\t\t\tUS_SECTION,\n')
t = rep(t, '{ id: "rightsContact", type: "text", label: "How people exercise their rights", ph: "email address, web form or postal address", show: function (s) { return !usStyle(s); } },',
          '{ id: "rightsContact", type: "text", label: "How people exercise their rights", ph: "email address, web form or postal address", show: function (s) { return !usStyle(s) && prim(s) !== "in"; } },')
t = rep(t, 'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s); },', 'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s); },')
t = rep(t, '\t\t\t\t\tprim(s) === "can" ? "At any time, on reasonable notice (PIPEDA principle 4.3.8). If consent was a tick box, withdrawal is a click, not a letter." :',
          '\t\t\t\t\tprim(s) === "can" ? "At any time, on reasonable notice (PIPEDA principle 4.3.8). If consent was a tick box, withdrawal is a click, not a letter." :\n\t\t\t\t\tprim(s) === "in" ? "As easily as consent was given (section 6(4); Rule 3(c)(i)). If consent was a tick box, withdrawal is a click, not a letter. Leave empty to point to the link in the India section." :')
old_cfl = '{ id: "canFurtherLaw", type: "text", label: "Canada: the law that requires it", show: function (s) { return yes(s, "further") && canOn(s) && v(s, "canFurther") === "law"; } },\n'
assert t.count(old_cfl) == 1
t = t.replace(old_cfl, old_cfl +
 '\t\t\t\t{ id: "inFurther", type: "select", label: function (s) { return (prim(s) === "in" ? "Ground" : "India: ground") + " for the new purpose"; }, opts: function () { return D.IN_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); },\n'
 '\t\t\t\t  show: function (s) { return yes(s, "further") && inOn(s); }, hint: "The purpose in the notice is the specified purpose (section 2(za)). A new one needs a new notice and consent, unless a legitimate use in section 7 applies." },\n')
# build(): skeleton
t = rep(t, 'var P = prim(s), EU = inReg(s, "eu"), UK = inReg(s, "uk"), CH = inReg(s, "ch"), BR = inReg(s, "br"), CAN = inReg(s, "can"), CA = inReg(s, "ca"), US = inReg(s, "us"), GL = P !== "ch";\n\t\t\tif (P === "br") return brLead(s);\n\t\t\tif (P === "can") return canLead(s);\n',
          'var P = prim(s), EU = inReg(s, "eu"), UK = inReg(s, "uk"), CH = inReg(s, "ch"), BR = inReg(s, "br"), CAN = inReg(s, "can"), IN = inReg(s, "in"), CA = inReg(s, "ca"), US = inReg(s, "us"), GL = P !== "ch";\n\t\t\tif (P === "br") return brLead(s);\n\t\t\tif (P === "can") return canLead(s);\n\t\t\tif (P === "in") return inLead(s);\n')
t = rep(t, '\t\t\tif (CAN) num.can = c++;\n\t\t\tif (CA) num.ca = c++;', '\t\t\tif (CAN) num.can = c++;\n\t\t\tif (IN) num.in = c++;\n\t\t\tif (CA) num.ca = c++;')
PTR = 'if (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });\n'
t = rep(t, '\t\t\tif (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });\n\t\t\tif (num.ca)',
          '\t\t\tif (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });\n\t\t\t' + PTR + '\t\t\tif (num.ca)')
t = rep(t, '\t\t\t\tArray.prototype.push.apply(blocks, canSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "FADP" : A("GDPR"), num.adm));\n\t\t\t\tcanRes = canChecks(s, false);\n\t\t\t}\n',
          '\t\t\t\tArray.prototype.push.apply(blocks, canSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "FADP" : A("GDPR"), num.adm));\n\t\t\t\tcanRes = canChecks(s, false);\n\t\t\t}\n'
          '\t\t\tvar inRes = null;\n\t\t\tif (num.in) {\n\t\t\t\tblocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });\n'
          '\t\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "FADP" : A("GDPR")));\n\t\t\t\tinRes = inChecks(s, false);\n\t\t\t}\n')
t = rep(t, '\t\t\tif (canRes) Array.prototype.push.apply(checks, canRes.checks);\n', '\t\t\tif (canRes) Array.prototype.push.apply(checks, canRes.checks);\n\t\t\tif (inRes) Array.prototype.push.apply(checks, inRes.checks);\n')
t = rep(t, '\t\t\tif (canRes) Array.prototype.push.apply(delivery, canRes.delivery);\n', '\t\t\tif (canRes) Array.prototype.push.apply(delivery, canRes.delivery);\n\t\t\tif (inRes) Array.prototype.push.apply(delivery, inRes.delivery);\n')
# brLead
t = rep(t, '\t\tif (inReg(s, "can")) num.can = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "can")) num.can = c++;\n\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', 1)
t = rep(t, '\t\tif (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });\n\t\tif (num.ca)',
          '\t\tif (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });\n\t\t' + PTR + '\t\tif (num.ca)')
t = rep(t, '\t\t\tArray.prototype.push.apply(blocks, canSection(s, [num.rights, num.consent, num.complaints], "LGPD", num.adm));\n\t\t\tcanRes = canChecks(s, false);\n\t\t}\n',
          '\t\t\tArray.prototype.push.apply(blocks, canSection(s, [num.rights, num.consent, num.complaints], "LGPD", num.adm));\n\t\t\tcanRes = canChecks(s, false);\n\t\t}\n'
          '\t\tvar inRes = null;\n\t\tif (num.in) {\n\t\t\tblocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, inSection(s, [num.rights, num.consent, num.complaints], "LGPD"));\n\t\t\tinRes = inChecks(s, false);\n\t\t}\n')
t = rep(t, '\t\tif (canRes) { Array.prototype.push.apply(checks, canRes.checks); Array.prototype.push.apply(delivery, canRes.delivery); }\n',
          '\t\tif (canRes) { Array.prototype.push.apply(checks, canRes.checks); Array.prototype.push.apply(delivery, canRes.delivery); }\n\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n')
# insert marker for the India module right before var PN
t = rep(t, '\tvar PN = {\n', '\t/* ========================================================= INDIA === */\n\tvar PN = {\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

# Canada module: India section in a Canada-led notice
p = B + 'can/can_module.js'; m = open(p).read()
m = rep(m, '\t\tif (qc) num.gov = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (qc) num.gov = c++;\n\t\tif (inReg(s, "in")) num.in = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n',
          '\t\t' + PTR + '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n')
m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {',
          '\t\tvar inRes = null;\n\t\tif (num.in) {\n\t\t\tblocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, inSection(s, canSecs, "Canadian law"));\n\t\t\tinRes = inChecks(s, false);\n\t\t}\n'
          '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {')
m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
          '\t\tif (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
assert all(ord(c) < 128 for c in m)
open(p, 'w').write(m)
print('pn_block and can_module wired')
