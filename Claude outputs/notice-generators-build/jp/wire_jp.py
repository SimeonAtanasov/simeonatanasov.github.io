# Wires the Japan module into pn_block.js and the Canada, India and China modules. Fails if already wired.
# pn_block.js is edited with its spliced module region (CANADA marker to "var PN = {") reduced to the four
# marker lines; jp/rebuild.sh splices the modules back in.
B = '/home/claude/ng-build/build/'
M = ['\t/* ======================================================== CANADA === */', '\t/* ========================================================= INDIA === */',
     '\t/* ========================================================= CHINA === */', '\t/* ========================================================= JAPAN === */']
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

PTR = 'if (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });\n'

p = B + 'pn_block.js'; t = open(p).read()
assert 'jpLead' not in t
i = t.index(M[0]); j = t.index('\tvar PN = {\n')
t = t[:i] + '\n'.join(M) + '\n' + t[j:]
t = rep(t, 'India, China, California, other US states, sets the main text', 'India, China, Japan, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "ca", "us"];')
t = rep(t, 'p === "cn" ? "Cn" : p === "ca" ? "Ca" : "Us"); }', 'p === "cn" ? "Cn" : p === "jp" ? "Jp" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "cn") return cnConsent(s);\n', '\t\tif (prim(s) === "cn") return cnConsent(s);\n\t\tif (prim(s) === "jp") return jpConsent(s);\n')
t = rep(t, 'show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn"; } },', 'show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp"; } },')
t = rep(t, 'prim(s) === "cn" ? "Organisation (the personal information processor)" : "Organisation (the controller)"; }',
          'prim(s) === "cn" ? "Organisation (the personal information processor)" : prim(s) === "jp" ? "Organisation (the business handling personal information)" : "Organisation (the controller)"; }')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn"; } },\n', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp"; } },\n')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" && yes(s, "dpo"); },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && yes(s, "dpo"); },')
old = '\t\t\t\t\t  hint: "Regulations Article 21, second paragraph: purposes, methods and categories are set out as a list. Filled for any purpose, the China table gets a column for it." },\n'
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "jpSens", type: "yesno", label: function (s) { return (prim(s) === "jp" ? "Does" : "Japan: does") + " this purpose use special care-required personal information?"; }, show: jpOn,\n'
 '\t\t\t\t\t  hint: "Article 2(3) and Cabinet Order Article 2: race, creed, social status, medical history, criminal record, having been a victim of crime, disabilities, health checks and treatment, criminal or juvenile proceedings." },\n'
 '\t\t\t\t\t{ id: "jpSensG", type: "select", label: "Japan: ground for acquiring it (Article 20(2))", opts: function () { return D.JP_SENS_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, a) { return jpOn(s) && yes(a, "jpSens"); } },\n')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" || inReg(s, "br")) && pnSourceDirect(s); } },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" || inReg(s, "br")) && pnSourceDirect(s); } },')
t = rep(t, 'prim(s) !== "in" && prim(s) !== "cn" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },', 'prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },')
old = '\t\t\t\t\t  hint: "Article 23: where it does, ask for separate consent. Answer No where another ground in Article 13 covers it (Article 13, second paragraph)." }\n'
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t\t{ id: "jpProv", type: "select", label: "Japan: basis for providing personal data to it", opts: function () { return D.JP_PROV.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, r) { return jpOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },\n'
 '\t\t\t\t\t  hint: "Article 27. A service provider you entrust with handling is not a third party (Article 27(5)(i)): give it the processor role." }\n')
t = rep(t, 'inReg(s, "cn") ? "mainland China" : ""].filter(Boolean);', 'inReg(s, "cn") ? "mainland China" : "", inReg(s, "jp") ? "Japan" : ""].filter(Boolean);')
old = '\t\t\t\t\t{ id: "consent", type: "yesno", label: "Does providing it rely on consent?", hint: "Article 39: where it does, ask for separate consent." }\n\t\t\t\t  ] }\n'
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t{ id: "jpAbroad", type: "yesno", label: "Japan: is personal data provided to third parties in foreign countries, including service providers abroad you entrust it to?", show: jpOn,\n'
 '\t\t\t\t  hint: "Article 28. Entrusting handling to a party abroad counts. The EEA states and the United Kingdom are designated (PPC Notice No. 1 of 2019)." },\n'
 '\t\t\t\t{ id: "jpXrows", type: "repeater", label: "Third parties in foreign countries under the APPI", itemLabel: "Third party abroad", add: "Add a third party abroad", show: function (s) { return jpOn(s) && yes(s, "jpAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient" },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country or region" },\n'
 '\t\t\t\t\t{ id: "basis", type: "select", label: "Why the provision is permitted", opts: function () { return D.JP_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "system", type: "text", label: "The country\'s system for protecting personal information", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
 '\t\t\t\t\t  hint: "Rules Article 17(2)(ii): obtained by an appropriate and reasonable method, for example the PPC\'s country reports." },\n'
 '\t\t\t\t\t{ id: "measures", type: "text", label: "The recipient\'s measures to protect personal information", show: function (s, r) { return v(r, "basis") === "consent"; } }\n'
 '\t\t\t\t  ] }\n')
t = rep(t, '\t\t\t\t\t\tp === "cn" ? "Do you make decisions through automated decision-making that have a major impact on people\'s rights and interests?" :\n',
          '\t\t\t\t\t\tp === "cn" ? "Do you make decisions through automated decision-making that have a major impact on people\'s rights and interests?" :\n'
          '\t\t\t\t\t\tp === "jp" ? "Do you make decisions about people based solely on automated processing of their personal information?" :\n')
old = '\t\t\t\t\t\tp === "cn" ? "Articles 24 and 73:'
t = rep(t, old, '\t\t\t\t\t\tp === "jp" ? "The APPI has no rule of its own on automated decisions. Where you analyse behaviour or interests, the purpose of use must let people predict it (Guidelines 3-1-1)." :\n' + old)
t = rep(t, '\t\t\tCN_SECTION,\n', '\t\t\tCN_SECTION,\n\t\t\tJP_SECTION,\n')
old = '\t\t\t\t{ id: "cnFurtherLaw", type: "text", label: "China: the law or administrative regulation", show: function (s) { return yes(s, "further") && cnOn(s) && v(s, "cnFurther") === "law"; } },\n'
t = rep(t, old, old +
 '\t\t\t\t{ id: "jpFurther", type: "select", label: function (s) { return (prim(s) === "jp" ? "" : "Japan: ") + "how the new purpose is allowed"; }, show: function (s) { return yes(s, "further") && jpOn(s); },\n'
 '\t\t\t\t  opts: [{ v: "related", l: "Reasonably related to the original purposes (Article 17(2))" }, { v: "consent", l: "Consent first (Article 18(1))" }] },\n')
# build(): skeleton
t = rep(t, 'CN = inReg(s, "cn"), CA = inReg(s, "ca")', 'CN = inReg(s, "cn"), JP = inReg(s, "jp"), CA = inReg(s, "ca")')
t = rep(t, '\t\t\tif (P === "cn") return cnLead(s);\n', '\t\t\tif (P === "cn") return cnLead(s);\n\t\t\tif (P === "jp") return jpLead(s);\n')
t = rep(t, '\t\t\tif (CN) num.cn = c++;\n', '\t\t\tif (CN) num.cn = c++;\n\t\t\tif (JP) num.jp = c++;\n')
t = rep(t, '\n\t\t\tif (num.ca) first.push(', '\n\t\t\t' + PTR + '\t\t\tif (num.ca) first.push(')
t = rep(t, '\t\t\t\tcnRes = cnChecks(s, false);\n\t\t\t}\n',
          '\t\t\t\tcnRes = cnChecks(s, false);\n\t\t\t}\n'
          '\t\t\tvar jpRes = null;\n\t\t\tif (num.jp) {\n\t\t\t\tblocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });\n'
          '\t\t\t\tArray.prototype.push.apply(blocks, jpSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));\n\t\t\t\tjpRes = jpChecks(s, false);\n\t\t\t}\n')
t = rep(t, '\t\t\tif (cnRes) Array.prototype.push.apply(checks, cnRes.checks);\n', '\t\t\tif (cnRes) Array.prototype.push.apply(checks, cnRes.checks);\n\t\t\tif (jpRes) Array.prototype.push.apply(checks, jpRes.checks);\n')
t = rep(t, '\t\t\tif (cnRes) Array.prototype.push.apply(delivery, cnRes.delivery);\n', '\t\t\tif (cnRes) Array.prototype.push.apply(delivery, cnRes.delivery);\n\t\t\tif (jpRes) Array.prototype.push.apply(delivery, jpRes.delivery);\n')
# brLead
t = rep(t, '\t\tif (inReg(s, "cn")) num.cn = c++;\n', '\t\tif (inReg(s, "cn")) num.cn = c++;\n\t\tif (inReg(s, "jp")) num.jp = c++;\n')
t = rep(t, '\n\t\tif (num.ca) first.push(', '\n\t\t' + PTR + '\t\tif (num.ca) first.push(')
t = rep(t, '\t\t\tcnRes = cnChecks(s, false);\n\t\t}\n',
          '\t\t\tcnRes = cnChecks(s, false);\n\t\t}\n'
          '\t\tvar jpRes = null;\n\t\tif (num.jp) {\n\t\t\tblocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });\n'
          '\t\t\tArray.prototype.push.apply(blocks, jpSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));\n\t\t\tjpRes = jpChecks(s, false);\n\t\t}\n')
t = rep(t, '\t\tif (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }\n',
          '\t\tif (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }\n\t\tif (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

def lead_mod(path, secsExpr, lawName):
    m = open(path).read()
    m = rep(m, '\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "jp")) num.jp = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
    m = rep(m, '\n\t\tif (num.ca) first.push(', '\n\t\t' + PTR + '\t\tif (num.ca) first.push(')
    m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {',
            '\t\tvar jpRes = null;\n\t\tif (num.jp) {\n\t\t\tblocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });\n'
            '\t\t\tArray.prototype.push.apply(blocks, jpSection(s, ' + secsExpr + ', "' + lawName + '"));\n\t\t\tjpRes = jpChecks(s, false);\n\t\t}\n'
            '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {')
    m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
            '\t\tif (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
    assert all(ord(c) < 128 for c in m)
    open(path, 'w').write(m)
lead_mod(B + 'can/can_module.js', 'canSecs', 'Canadian law')
lead_mod(B + 'in/in_module.js', 'inSecs', 'the DPDP Act')
lead_mod(B + 'cn/cn_module.js', 'cnSecs', 'the PIPL')
print('Japan wired')
