# Wires the Korea module into pn_block.js and the Canada, India, China and Japan modules. Fails if already wired.
# pn_block.js is edited with its spliced module region (CANADA marker to "var PN = {") reduced to the five
# marker lines; kr/rebuild.sh splices the modules back in.
B = '/home/claude/ng-build/build/'
M = ['\t/* ======================================================== CANADA === */', '\t/* ========================================================= INDIA === */',
     '\t/* ========================================================= CHINA === */', '\t/* ========================================================= JAPAN === */',
     '\t/* ========================================================= KOREA === */']
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

PTR = 'if (num.kr) first.push({ k: "p", x: "If you are in Korea, section " + num.kr + " also applies to you." });\n'
THIRD = '["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1'

p = B + 'pn_block.js'; t = open(p).read()
assert 'krLead' not in t
i = t.index(M[0]); j = t.index('\tvar PN = {\n')
t = t[:i] + '\n'.join(M) + '\n' + t[j:]
t = rep(t, 'India, China, Japan, California, other US states, sets the main text', 'India, China, Japan, Korea, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "ca", "us"];')
t = rep(t, 'p === "jp" ? "Jp" : p === "ca" ? "Ca" : "Us"); }', 'p === "jp" ? "Jp" : p === "kr" ? "Kr" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "jp") return false; /* the APPI has no general rule on withdrawing consent */\n',
          '\t\tif (prim(s) === "jp") return false; /* the APPI has no general rule on withdrawing consent */\n\t\tif (prim(s) === "kr") return krConsent(s);\n')
# Fields hidden for a Korea lead: children (krKids), DPO (chief privacy officer), joint controllers, required/consequence (krRefuse).
t = rep(t, 'show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp"; } },',
          'show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr"; } },')
t = rep(t, 'prim(s) === "jp" ? "Organisation (the business handling personal information)" : "Organisation (the controller)"; }',
          'prim(s) === "jp" ? "Organisation (the business handling personal information)" : prim(s) === "kr" ? "Organisation (the personal information controller)" : "Organisation (the controller)"; }')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp"; } },\n', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr"; } },\n')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && yes(s, "dpo"); },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && yes(s, "dpo"); },')
t = rep(t, 'return !usStyle(s) && prim(s) !== "jp"; } },', 'return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr"; } },')
t = rep(t, 'return !usStyle(s) && prim(s) !== "jp" && yes(s, "joint"); }', 'return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr" && yes(s, "joint"); }', 3)
t = rep(t, 'return yes(s, "joint") && prim(s) !== "jp"; } }', 'return yes(s, "joint") && prim(s) !== "jp" && prim(s) !== "kr"; } }')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" || inReg(s, "br")) && pnSourceDirect(s); } },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" || inReg(s, "br")) && pnSourceDirect(s); } },')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },')
# Per purpose
old = '\t\t\t\t\t{ id: "jpSensG", type: "select", label: "Japan: ground for acquiring it (Article 20(2))", opts: function () { return D.JP_SENS_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, a) { return jpOn(s) && yes(a, "jpSens"); } },\n'
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "krBasis", type: "select", label: function (s) { return (prim(s) === "kr" ? "Basis" : "Korea: basis") + " under the PIPA (Article 15(1))"; }, opts: function () { return D.KR_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: krOn,\n'
 '\t\t\t\t\t  hint: "Consent, or one of the six cases that need no consent. Its own answer: no other law\'s legal basis is read as one. Data processed without consent is listed apart, with its basis (Article 22(3))." },\n'
 '\t\t\t\t\t{ id: "krLaw", type: "text", label: "Korea: the law and article", show: function (s, a) { return krOn(s) && v(a, "krBasis") === "law"; } },\n'
 '\t\t\t\t\t{ id: "krRefuse", type: "text", label: "Korea: what follows if the person refuses consent", show: function (s, a) { return krOn(s) && v(a, "krBasis") === "consent"; },\n'
 '\t\t\t\t\t  ph: "for example you do not receive event news; you can still use the service", hint: "Article 15(2)(4). Refusing optional consent cannot cost people the goods or services (Articles 16(3), 22(5))." },\n'
 '\t\t\t\t\t{ id: "krSens", type: "yesno", label: function (s) { return (prim(s) === "kr" ? "Does" : "Korea: does") + " this purpose use sensitive information or unique identifiers?"; }, show: krOn,\n'
 '\t\t\t\t\t  hint: "Article 23 and Enforcement Decree Article 18: beliefs, trade union or party membership, political views, health, sex life, genetic test and criminal record data, biometric data used to identify a person, race or ethnicity. Article 24: unique identifiers such as passport, driving licence and alien registration numbers." },\n'
 '\t\t\t\t\t{ id: "krSensBasis", type: "select", label: "Korea: basis for it", show: function (s, a) { return krOn(s) && yes(a, "krSens"); },\n'
 '\t\t\t\t\t  opts: [{ v: "consent", l: "Consent given separately from other consents (Articles 23(1)(1), 24(1)(1))" }, { v: "law", l: "A law requires or allows it (Articles 23(1)(2), 24(1)(2))" }] },\n')
# Per recipient
old = '\t\t\t\t\t  hint: "Article 27. A service provider you entrust with handling is not a third party (Article 27(5)(i)): give it the processor role." }\n'
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t\t{ id: "krProv", type: "select", label: "Korea: basis for providing personal information to it", opts: function () { return D.KR_PROV.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, r) { return krOn(s) && ' + THIRD + '; },\n'
 '\t\t\t\t\t  hint: "Article 17. A service provider you entrust with processing is not a third party (Article 26): give it the processor role." },\n'
 '\t\t\t\t\t{ id: "krProvLaw", type: "text", label: "Korea: the legal basis, for example the law and article (optional)", show: function (s, r) { return krOn(s) && ' + THIRD + ' && v(r, "krProv") === "collected"; } },\n'
 '\t\t\t\t\t{ id: "krItems", type: "text", label: "Korea: the personal information provided", show: function (s, r) { return krOn(s) && ' + THIRD + '; }, hint: "Each item, not \\"etc.\\" (PIPC drafting guidelines, item 7)." },\n'
 '\t\t\t\t\t{ id: "krRet", type: "text", label: "Korea: how long it keeps it", show: function (s, r) { return krOn(s) && ' + THIRD + '; } }\n')
t = rep(t, 'inReg(s, "jp") ? "Japan" : ""].filter(Boolean);', 'inReg(s, "jp") ? "Japan" : "", inReg(s, "kr") ? "Korea" : ""].filter(Boolean);')
# Transfers
old = '\t\t\t\t\t{ id: "measures", type: "text", label: "The recipient\'s measures to protect personal information", show: function (s, r) { return v(r, "basis") === "consent" && !yes(r, "noMeasures"); } }\n\t\t\t\t  ] }\n'
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t{ id: "krAbroad", type: "yesno", label: "Korea: is personal information provided, entrusted or stored abroad?", show: krOn,\n'
 '\t\t\t\t  hint: "Article 28-8: provision (including access from abroad), entrusted processing and storage abroad are all transfers. Name every country of a cloud service (PIPC drafting guidelines, item 10)." },\n'
 '\t\t\t\t{ id: "krXrows", type: "repeater", label: "Transfers abroad under the PIPA", itemLabel: "Transfer abroad", add: "Add a transfer abroad", show: function (s) { return krOn(s) && yes(s, "krAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country" },\n'
 '\t\t\t\t\t{ id: "basis", type: "select", label: "Basis for the transfer (Article 28-8(1))", opts: function () { return D.KR_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "lawName", type: "text", label: "The law, treaty or international agreement, with its article", show: function (s, r) { return v(r, "basis") === "law"; } },\n'
 '\t\t\t\t\t{ id: "certName", type: "text", label: "The certification the recipient holds", show: function (s, r) { return v(r, "basis") === "cert"; },\n'
 '\t\t\t\t\t  hint: "A certification the PIPC designates, with the measures to apply it in the destination country (Article 28-8(1)(4))." },\n'
 '\t\t\t\t\t{ id: "contact", type: "text", label: "The recipient\'s contact details", hint: "Article 28-8(2)(3)." },\n'
 '\t\t\t\t\t{ id: "items", type: "text", label: "The personal information transferred" },\n'
 '\t\t\t\t\t{ id: "when", type: "text", label: "When and how it is transferred", ph: "for example continuously over the network as you use the service" },\n'
 '\t\t\t\t\t{ id: "purpose", type: "text", label: "The recipient\'s purposes" },\n'
 '\t\t\t\t\t{ id: "keep", type: "text", label: "How long the recipient keeps it" },\n'
 '\t\t\t\t\t{ id: "refuse", type: "text", label: "How to refuse the transfer, and what follows", ph: "for example email privacy@example.kr; we then cannot offer support from abroad", hint: "Article 28-8(2)(5)." }\n'
 '\t\t\t\t  ] }\n')
# Automated decisions
t = rep(t, '\t\t\t\t\t\tp === "jp" ? "Do you make decisions about people based solely on automated processing of their personal information?" :\n',
          '\t\t\t\t\t\tp === "jp" ? "Do you make decisions about people based solely on automated processing of their personal information?" :\n'
          '\t\t\t\t\t\tp === "kr" ? "Do you make decisions about people with a fully automated system, AI systems included, that processes their personal information?" :\n')
old = '\t\t\t\t\t\tp === "jp" ? "The APPI has no rule of its own on automated decisions.'
t = rep(t, old, '\t\t\t\t\t\tp === "kr" ? "Article 37-2: people can refuse such a decision where it significantly affects their rights or duties, and ask for an explanation of any. Publish the criteria and the procedure (Enforcement Decree Article 44-4)." :\n' + old)
t = rep(t, 'label: "Meaningful information about the logic involved", rows: 3, show: function (s) { return yes(s, "adm") && prim(s) !== "jp"; },',
          'label: "Meaningful information about the logic involved", rows: 3, show: function (s) { return yes(s, "adm") && prim(s) !== "jp" && prim(s) !== "kr"; },')
t = rep(t, 'label: "Significance and envisaged consequences for the person", rows: 2, show: function (s) { return yes(s, "adm") && prim(s) !== "jp"; } },',
          'label: "Significance and envisaged consequences for the person", rows: 2, show: function (s) { return yes(s, "adm") && prim(s) !== "jp" && prim(s) !== "kr"; } },')
t = rep(t, '\t\t\tJP_SECTION,\n', '\t\t\tJP_SECTION,\n\t\t\tKR_SECTION,\n')
# Withdrawal of consent
t = rep(t, 'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s) || cnConsent(s); },',
          'show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s) || cnConsent(s) || (krOn(s) && krConsent(s)); },')
t = rep(t, '\t\t\t\t\tprim(s) === "cn" ? "A convenient way to withdraw (Article 15).',
          '\t\t\t\t\tprim(s) === "kr" ? "At any time, no harder than giving consent (Articles 37(1), 38(4)). If consent was a tick box, withdrawal is a click, not a letter." :\n'
          '\t\t\t\t\tprim(s) === "cn" ? "A convenient way to withdraw (Article 15).')
old = '\t\t\t\t  opts: [{ v: "related", l: "Reasonably related to the original purposes (Article 17(2))" }, { v: "consent", l: "Consent first (Article 18(1))" }] },\n'
t = rep(t, old, old +
 '\t\t\t\t{ id: "krFurther", type: "select", label: function (s) { return (prim(s) === "kr" ? "" : "Korea: ") + "how the new purpose is allowed"; }, show: function (s) { return yes(s, "further") && krOn(s); },\n'
 '\t\t\t\t  opts: [{ v: "related", l: "Reasonably related to the original purpose (Article 15(3))" }, { v: "consent", l: "Separate consent first (Article 18(2)(1))" }] },\n')
# build(): skeleton
t = rep(t, 'JP = inReg(s, "jp"), CA = inReg(s, "ca")', 'JP = inReg(s, "jp"), KR = inReg(s, "kr"), CA = inReg(s, "ca")')
t = rep(t, '\t\t\tif (P === "jp") return jpLead(s);\n', '\t\t\tif (P === "jp") return jpLead(s);\n\t\t\tif (P === "kr") return krLead(s);\n')
t = rep(t, '\t\t\tif (JP) num.jp = c++;\n', '\t\t\tif (JP) num.jp = c++;\n\t\t\tif (KR) num.kr = c++;\n')
t = rep(t, '\n\t\t\tif (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });\n',
          '\n\t\t\tif (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });\n\t\t\t' + PTR)
t = rep(t, '\t\t\t\tjpRes = jpChecks(s, false);\n\t\t\t}\n',
          '\t\t\t\tjpRes = jpChecks(s, false);\n\t\t\t}\n'
          '\t\t\tvar krRes = null;\n\t\t\tif (num.kr) {\n\t\t\t\tblocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });\n'
          '\t\t\t\tArray.prototype.push.apply(blocks, krSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));\n\t\t\t\tkrRes = krChecks(s, false);\n\t\t\t}\n')
t = rep(t, '\t\t\tif (jpRes) Array.prototype.push.apply(checks, jpRes.checks);\n', '\t\t\tif (jpRes) Array.prototype.push.apply(checks, jpRes.checks);\n\t\t\tif (krRes) Array.prototype.push.apply(checks, krRes.checks);\n')
t = rep(t, '\t\t\tif (jpRes) Array.prototype.push.apply(delivery, jpRes.delivery);\n', '\t\t\tif (jpRes) Array.prototype.push.apply(delivery, jpRes.delivery);\n\t\t\tif (krRes) Array.prototype.push.apply(delivery, krRes.delivery);\n')
# brLead
t = rep(t, '\n\t\tif (inReg(s, "jp")) num.jp = c++;\n', '\n\t\tif (inReg(s, "jp")) num.jp = c++;\n\t\tif (inReg(s, "kr")) num.kr = c++;\n')
t = rep(t, '\n\t\tif (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });\n',
          '\n\t\tif (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });\n\t\t' + PTR)
t = rep(t, '\t\t\tjpRes = jpChecks(s, false);\n\t\t}\n',
          '\t\t\tjpRes = jpChecks(s, false);\n\t\t}\n'
          '\t\tvar krRes = null;\n\t\tif (num.kr) {\n\t\t\tblocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, krSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));\n\t\t\tkrRes = krChecks(s, false);\n\t\t}\n')
t = rep(t, '\t\tif (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }\n',
          '\t\tif (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }\n\t\tif (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

def lead_mod(path, secsExpr, lawName):
    m = open(path).read()
    assert 'krSection' not in m
    m = rep(m, '\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "kr")) num.kr = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
    m = rep(m, '\n\t\tif (num.ca) first.push(', '\n\t\t' + PTR + '\t\tif (num.ca) first.push(')
    m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {',
            '\t\tvar krRes = null;\n\t\tif (num.kr) {\n\t\t\tblocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });\n'
            '\t\t\tArray.prototype.push.apply(blocks, krSection(s, ' + secsExpr + ', "' + lawName + '"));\n\t\t\tkrRes = krChecks(s, false);\n\t\t}\n'
            '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {')
    m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
            '\t\tif (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
    assert all(ord(c) < 128 for c in m)
    open(path, 'w').write(m)
lead_mod(B + 'can/can_module.js', 'canSecs', 'Canadian law')
lead_mod(B + 'in/in_module.js', 'inSecs', 'the DPDP Act')
lead_mod(B + 'cn/cn_module.js', 'cnSecs', 'the PIPL')
lead_mod(B + 'jp/jp_module.js', 'jpSecs', 'the APPI')
print('Korea wired')
