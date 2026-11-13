# Wires the Australia module into pn_block.js and the Canada, India, China, Japan and Korea modules. Fails if
# already wired. pn_block.js is edited with its spliced module region (CANADA marker to "var PN = {") reduced
# to the seven marker lines; au/rebuild.sh splices the modules back in. The Singapore module (sg_body.js) is
# edited by hand-written replacements below, since its lead has no Singapore section.
import re
B = '/home/claude/ng-build/build/'
NAMES = ['CANADA', 'INDIA', 'CHINA', 'JAPAN', 'KOREA', 'SINGAPORE', 'AUSTRALIA']
M = ['\t/* ' + '=' * (62 - len(h)) + ' ' + h + ' === */' for h in NAMES]

def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

def resub(t, pat, fn, count):
    r, n = re.subn(pat, fn, t)
    assert n == count, (n, pat[:100])
    return r

PTR = 'if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });\n'

def generic(t, n_inreg, n_SG, n_ptr, n_block, n_push1, n_push2):
    """After each Singapore line in a lead builder, add the Australia line."""
    t = resub(t, r'(\t+)if \(inReg\(s, "sg"\)\) num\.sg = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (inReg(s, "au")) num.au = c++;\n', n_inreg)
    t = resub(t, r'(\t+)if \(SG\) num\.sg = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (AU) num.au = c++;\n', n_SG)
    t = resub(t, r'(\t+)if \(num\.sg\) first\.push\(\{ k: "p", x: sgPointer\(s, num\.sg\) \}\);\n', lambda m: m.group(0) + m.group(1) + PTR, n_ptr)
    pat = (r'(\t+)var sgRes = null;\n\t+if \(num\.sg\) \{\n\t+blocks\.push\(\{ k: "h2", x: num\.sg \+ "\. " \+ sgHead\(s\) \}\);\n'
           r'\t+Array\.prototype\.push\.apply\(blocks, sgSection\(s, (\[[^\]]*\]|\w+), (.*)\)\);\n\t+sgRes = sgChecks\(s, false\);\n\t+\}\n')
    def blk(m):
        i = m.group(1)
        return (m.group(0) + i + 'var auRes = null;\n' + i + 'if (num.au) {\n' + i + '\tblocks.push({ k: "h2", x: num.au + ". " + auHead(s) });\n'
                + i + '\tArray.prototype.push.apply(blocks, auSection(s, ' + m.group(2) + ', ' + m.group(3) + '));\n' + i + '\tauRes = auChecks(s, false);\n' + i + '}\n')
    t = resub(t, pat, blk, n_block)
    t = resub(t, r'(\t+)if \(sgRes\) \{ Array\.prototype\.push\.apply\(checks, sgRes\.checks\); Array\.prototype\.push\.apply\(delivery, sgRes\.delivery\); \}\n',
              lambda m: m.group(0) + m.group(1) + 'if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }\n', n_push1)
    t = resub(t, r'(\t+)if \(sgRes\) Array\.prototype\.push\.apply\((checks|delivery), sgRes\.(checks|delivery)\);\n',
              lambda m: m.group(0) + m.group(1) + 'if (auRes) Array.prototype.push.apply(' + m.group(2) + ', auRes.' + m.group(3) + ');\n', n_push2)
    return t

p = B + 'pn_block.js'; t = open(p).read()
assert 'auLead' not in t
i = t.index(M[0]); j = t.index('\tvar PN = {\n')
t = t[:i] + '\n'.join(M) + '\n' + t[j:]
t = rep(t, 'Korea, Singapore, California, other US states, sets the main text', 'Korea, Singapore, Australia, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "au", "ca", "us"];')
t = rep(t, 'p === "sg" ? "Sg" : p === "ca" ? "Ca" : "Us"); }', 'p === "sg" ? "Sg" : p === "au" ? "Au" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "sg") return sgConsent(s);\n', '\t\tif (prim(s) === "sg") return sgConsent(s);\n\t\tif (prim(s) === "au") return auConsent(s);\n')
# Fields hidden for an Australia lead, as for Singapore: children, DPO, joint controllers, required/consequence, Article 22 logic and effect.
t = rep(t, 'prim(s) !== "sg"', 'prim(s) !== "sg" && prim(s) !== "au"', 12)
t = rep(t, 'prim(s) === "sg" ? "Organisation" : "Organisation (the controller)"; }', 'prim(s) === "sg" || prim(s) === "au" ? "Organisation" : "Organisation (the controller)"; }')
# Per purpose
old = '\t\t\t\t\t{ id: "sgLaw", type: "text", label: "Singapore: the law and section", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "law"; } },\n'
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "auSens", type: "select", label: function (s) { return (prim(s) === "au" ? "S" : "Australia: s") + "ensitive information, and how the APPs allow collecting it"; }, opts: function () { return D.AU_SENS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: auOn,\n'
 '\t\t\t\t\t  hint: "Sensitive information (s. 6(1)): racial or ethnic origin, political opinions or association membership, religious or philosophical beliefs, professional or trade association or trade union membership, sexual orientation or practices, criminal record, health or genetic information, biometric information for automated verification or identification, biometric templates. APP 3.3 and 3.4." },\n'
 '\t\t\t\t\t{ id: "auSensLaw", type: "text", label: "Australia: the law, or the details of the court or tribunal order", show: function (s, a) { return auOn(s) && v(a, "auSens") === "law"; } },\n'
 '\t\t\t\t\t{ id: "auSensPgs", type: "select", label: "Australia: the permitted general situation (s. 16A)", show: function (s, a) { return auOn(s) && v(a, "auSens") === "pgs"; },\n'
 '\t\t\t\t\t  opts: function () { return D.AU_PGS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "auSensPhs", type: "text", label: "Australia: the permitted health situation (s. 16B)", show: function (s, a) { return auOn(s) && v(a, "auSens") === "phs"; },\n'
 '\t\t\t\t\t  ph: "for example necessary to provide a health service to you, and required by law" },\n'
 '\t\t\t\t\t{ id: "auLaw", type: "select", label: function (s) { return (prim(s) === "au" ? "D" : "Australia: d") + "oes an Australian law or a court or tribunal order require or authorise collecting it?"; }, show: auOn,\n'
 '\t\t\t\t\t  opts: [{ v: "no", l: "No" }, { v: "required", l: "Yes, it requires it" }, { v: "authorised", l: "Yes, it authorises it" }], hint: "APP 5.2(c): the policy names it." },\n'
 '\t\t\t\t\t{ id: "auLawName", type: "text", label: "Australia: the law, or the details of the order", show: function (s, a) { return auOn(s) && (v(a, "auLaw") === "required" || v(a, "auLaw") === "authorised"); },\n'
 '\t\t\t\t\t  ph: "for example Taxation Administration Act 1953" },\n'
 '\t\t\t\t\t{ id: "auConseq", type: "text", label: function (s) { return (prim(s) === "au" ? "T" : "Australia: t") + "he main consequences if the person does not provide it (optional)"; }, show: function (s) { return auOn(s) && pnSourceDirect(s); },\n'
 '\t\t\t\t\t  ph: "for example we cannot process your application", hint: "APP 5.2(e). Leave empty if there are none." },\n')
t = rep(t, 'inReg(s, "kr") ? "Korea" : "", inReg(s, "sg") ? "Singapore" : ""].filter(Boolean);', 'inReg(s, "kr") ? "Korea" : "", inReg(s, "sg") ? "Singapore" : "", inReg(s, "au") ? "Australia" : ""].filter(Boolean);')
# Transfers
old = ('\t\t\t\t\t{ id: "summary", type: "area", rows: 2, label: "A reasonable summary of how the data is protected in that country", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
       '\t\t\t\t\t  hint: "Regulation 10(3)(a): consent to the transfer is not valid without it. It is printed in the policy." }\n'
       '\t\t\t\t  ] }\n')
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t{ id: "auAbroad", type: "yesno", label: "Australia: does personal information go to recipients outside Australia, or is it held outside Australia?", show: auOn,\n'
 '\t\t\t\t  hint: "APP 1.4(f), (g), 5.2(i), (j) and APP 8. Include service providers, related companies, storage outside Australia, and your own offices or systems abroad." },\n'
 '\t\t\t\t{ id: "auXrows", type: "repeater", label: "Overseas recipients (Australia)", itemLabel: "Overseas recipient", add: "Add an overseas recipient", show: function (s) { return auOn(s) && yes(s, "auAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list; for your own offices or systems abroad, your organisation\'s name." },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country, or region where listing countries is impracticable" },\n'
 '\t\t\t\t\t{ id: "basis", type: "select", label: "How APP 8 is met", opts: function () { return D.AU_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The Australian law, or the details of the order" : "The law or binding scheme"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "similar"; } },\n'
 '\t\t\t\t\t{ id: "pgs", type: "select", label: "The permitted general situation", show: function (s, r) { return v(r, "basis") === "pgs"; },\n'
 '\t\t\t\t\t  opts: function () { return D.AU_PGS.slice(0, 3).map(function (x) { return { v: x.v, l: x.l }; }); }, hint: "APP 8.2(d): items 4 and 5 of s. 16A do not apply." }\n'
 '\t\t\t\t  ] }\n')
# Automated decisions
t = rep(t, '\t\t\t\t\t\tp === "sg" ? "Do you make decisions about people with automated systems that use their personal data?" :\n',
          '\t\t\t\t\t\tp === "sg" ? "Do you make decisions about people with automated systems that use their personal data?" :\n'
          '\t\t\t\t\t\tp === "au" ? "Do you make decisions about people with automated systems that use their personal information?" :\n')
old = '\t\t\t\t\t\tp === "sg" ? "The PDPA has no rule of its own on automated decisions; the policy says what is decided, for transparency." :\n'
t = rep(t, old, old + '\t\t\t\t\t\tp === "au" ? "APP 1.7 to 1.9 apply from 10 December 2026: answer the Australia questions on computer programs below; this answer is for transparency." :\n')
t = rep(t, '\t\t\tSG_SECTION,\n', '\t\t\tSG_SECTION,\n\t\t\tAU_SECTION,\n')
# Withdrawal of consent
t = rep(t, '|| (sgOn(s) && sgConsent(s)); },', '|| (sgOn(s) && sgConsent(s)) || (auOn(s) && auConsent(s)); },')
t = rep(t, '\t\t\t\t\tprim(s) === "sg" ? "At any time, on reasonable notice (section 16(1)). Leave empty to use the data protection officer\'s contact." :\n',
          '\t\t\t\t\tprim(s) === "sg" ? "At any time, on reasonable notice (section 16(1)). Leave empty to use the data protection officer\'s contact." :\n'
          '\t\t\t\t\tprim(s) === "au" ? "At any time, by an easy and accessible process (APP Guidelines B.54). Leave empty to use the privacy contact." :\n')
old = '\t\t\t\t{ id: "sgFurtherLaw", type: "text", label: "Singapore: the exception or law", show: function (s) { return yes(s, "further") && sgOn(s) && v(s, "sgFurther") === "exception"; } },\n'
t = rep(t, old, old +
 '\t\t\t\t{ id: "auFurther", type: "select", label: function (s) { return (prim(s) === "au" ? "H" : "Australia: h") + "ow APP 6 allows the new purpose"; }, show: function (s) { return yes(s, "further") && auOn(s); },\n'
 '\t\t\t\t  opts: [{ v: "consent", l: "Consent first (APP 6.1(a))" }, { v: "related", l: "People would reasonably expect it, and it is related to the original purpose, or directly related for sensitive information (APP 6.2(a))" },\n'
 '\t\t\t\t\t{ v: "law", l: "Required or authorised by an Australian law or a court or tribunal order (APP 6.2(b))" }, { v: "pgs", l: "A permitted general situation (APP 6.2(c); s. 16A)" }] },\n'
 '\t\t\t\t{ id: "auFurtherLaw", type: "text", label: function (s) { return v(s, "auFurther") === "pgs" ? "Australia: the permitted general situation" : "Australia: the law or order"; },\n'
 '\t\t\t\t  show: function (s) { return yes(s, "further") && auOn(s) && (v(s, "auFurther") === "law" || v(s, "auFurther") === "pgs"); } },\n')
# build(): skeleton
t = rep(t, 'SG = inReg(s, "sg"), CA = inReg(s, "ca")', 'SG = inReg(s, "sg"), AU = inReg(s, "au"), CA = inReg(s, "ca")')
t = rep(t, '\t\t\tif (P === "sg") return sgLead(s);\n', '\t\t\tif (P === "sg") return sgLead(s);\n\t\t\tif (P === "au") return auLead(s);\n')
t = generic(t, 1, 1, 2, 2, 1, 2)
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

for d in ('can', 'in', 'cn', 'jp', 'kr'):
    mp = B + d + '/' + d + '_module.js'; m = open(mp).read()
    assert 'auSection' not in m
    m = generic(m, 1, 0, 1, 1, 1, 0)
    assert all(ord(c) < 128 for c in m)
    open(mp, 'w').write(m)

# Singapore module: its lead has no Singapore section, so add Australia after the data protection officer, before California.
mp = B + 'sg/sg_body.js'; m = open(mp).read()
assert 'auSection' not in m
m = rep(m, '\t\tnum.rights = c++; num.complaints = c++; num.dpo = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;',
        '\t\tnum.rights = c++; num.complaints = c++; num.dpo = c++;\n\t\tif (inReg(s, "au")) num.au = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\n\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n\t\tif (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });\n\t\tblocks.push({ k: "box", title: "In short", blocks: first });\n\n\t\tblocks.push({ k: "h2", x: "1. Purposes and personal data" });',
        '\n\t\t' + PTR + '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n\t\tif (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });\n\t\tblocks.push({ k: "box", title: "In short", blocks: first });\n\n\t\tblocks.push({ k: "h2", x: "1. Purposes and personal data" });')
m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {\n\t\t\tblocks.push({ k: "h2", x: num.ca + ". Additional information for California residents" });\n\t\t\tblocks.push({ k: "p", x: "If you are a California resident, the California Consumer Privacy Act (CCPA) applies to your personal information. This section is our notice at collection and privacy policy for California residents. The rest of this policy describes our processing too, but your rights under the CCPA, and how to exercise them, are the ones set out here." +\n\t\t\t\tonly',
        '\t\tvar auRes = null;\n\t\tif (num.au) {\n\t\t\tblocks.push({ k: "h2", x: num.au + ". " + auHead(s) });\n\t\t\tArray.prototype.push.apply(blocks, auSection(s, sgSecs, "the PDPA"));\n\t\t\tauRes = auChecks(s, false);\n\t\t}\n'
        '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {\n\t\t\tblocks.push({ k: "h2", x: num.ca + ". Additional information for California residents" });\n\t\t\tblocks.push({ k: "p", x: "If you are a California resident, the California Consumer Privacy Act (CCPA) applies to your personal information. This section is our notice at collection and privacy policy for California residents. The rest of this policy describes our processing too, but your rights under the CCPA, and how to exercise them, are the ones set out here." +\n\t\t\t\tonly')
m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n\t\tif (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }\n\t\tvar lintHits = lintText(blocks);\n\t\tchecks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \\"may\\", \\"might\\", \\"some\\", \\"often\\", \\"possible\\"", "PDPA',
        '\t\tif (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n\t\tif (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }\n\t\tvar lintHits = lintText(blocks);\n\t\tchecks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \\"may\\", \\"might\\", \\"some\\", \\"often\\", \\"possible\\"", "PDPA')
assert all(ord(c) < 128 for c in m)
open(mp, 'w').write(m)
print('Australia wired')
