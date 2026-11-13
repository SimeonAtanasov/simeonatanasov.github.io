# Wires the South Africa module into pn_block.js and the Canada, India, China, Japan, Korea and Singapore modules,
# and adds a South Africa section to the Australia lead. Fails if already wired. pn_block.js is edited with its
# spliced module region (CANADA marker to "var PN = {") reduced to the eight marker lines; za/rebuild.sh splices
# the modules back in.
import re
B = '/home/claude/ng-build/build/'
NAMES = ['CANADA', 'INDIA', 'CHINA', 'JAPAN', 'KOREA', 'SINGAPORE', 'AUSTRALIA', 'SOUTH AFRICA']
M = ['\t/* ' + '=' * (62 - len(h)) + ' ' + h + ' === */' for h in NAMES]

def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

def resub(t, pat, fn, count):
    r, n = re.subn(pat, fn, t)
    assert n == count, (n, pat[:100])
    return r

PTR = 'if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });\n'

def generic(t, n_inreg, n_AU, n_ptr, n_block, n_push1, n_push2):
    """After each Australia line in a lead builder, add the South Africa line."""
    t = resub(t, r'(\t+)if \(inReg\(s, "au"\)\) num\.au = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (inReg(s, "za")) num.za = c++;\n', n_inreg)
    t = resub(t, r'(\t+)if \(AU\) num\.au = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (ZA) num.za = c++;\n', n_AU)
    t = resub(t, r'(\t+)if \(num\.au\) first\.push\(\{ k: "p", x: auPointer\(s, num\.au\) \}\);\n', lambda m: m.group(0) + m.group(1) + PTR, n_ptr)
    pat = (r'(\t+)var auRes = null;\n\t+if \(num\.au\) \{\n\t+blocks\.push\(\{ k: "h2", x: num\.au \+ "\. " \+ auHead\(s\) \}\);\n'
           r'\t+Array\.prototype\.push\.apply\(blocks, auSection\(s, (\[[^\]]*\]|\w+), (.*)\)\);\n\t+auRes = auChecks\(s, false\);\n\t+\}\n')
    def blk(m):
        i = m.group(1)
        return (m.group(0) + i + 'var zaRes = null;\n' + i + 'if (num.za) {\n' + i + '\tblocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });\n'
                + i + '\tArray.prototype.push.apply(blocks, zaSection(s, ' + m.group(2) + ', ' + m.group(3) + '));\n' + i + '\tzaRes = zaChecks(s, false);\n' + i + '}\n')
    t = resub(t, pat, blk, n_block)
    t = resub(t, r'(\t+)if \(auRes\) \{ Array\.prototype\.push\.apply\(checks, auRes\.checks\); Array\.prototype\.push\.apply\(delivery, auRes\.delivery\); \}\n',
              lambda m: m.group(0) + m.group(1) + 'if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }\n', n_push1)
    t = resub(t, r'(\t+)if \(auRes\) Array\.prototype\.push\.apply\((checks|delivery), auRes\.(checks|delivery)\);\n',
              lambda m: m.group(0) + m.group(1) + 'if (zaRes) Array.prototype.push.apply(' + m.group(2) + ', zaRes.' + m.group(3) + ');\n', n_push2)
    return t

p = B + 'pn_block.js'; t = open(p).read()
assert 'zaLead' not in t
i = t.index(M[0]); j = t.index('\tvar PN = {\n')
t = t[:i] + '\n'.join(M) + '\n' + t[j:]
t = rep(t, 'Korea, Singapore, Australia, California, other US states, sets the main text', 'Korea, Singapore, Australia, South Africa, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "au", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "au", "za", "ca", "us"];')
t = rep(t, 'p === "au" ? "Au" : p === "ca" ? "Ca" : "Us"); }', 'p === "au" ? "Au" : p === "za" ? "Za" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "au") return auConsent(s);\n', '\t\tif (prim(s) === "au") return auConsent(s);\n\t\tif (prim(s) === "za") return zaConsent(s);\n')
# Fields hidden for a South Africa lead, as for Singapore and Australia: children, DPO, joint controllers, required/consequence, Article 22 logic and effect.
t = rep(t, 'prim(s) !== "sg" && prim(s) !== "au"', 'prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"', 12)
t = rep(t, 'prim(s) === "sg" || prim(s) === "au" ? "Organisation" : "Organisation (the controller)"; }', 'prim(s) === "sg" || prim(s) === "au" ? "Organisation" : prim(s) === "za" ? "Organisation (the responsible party)" : "Organisation (the controller)"; }')
# Per purpose
old = ('\t\t\t\t\t{ id: "auConseq", type: "text", label: function (s) { return (prim(s) === "au" ? "T" : "Australia: t") + "he main consequences if the person does not provide it (optional)"; }, show: function (s) { return auOn(s) && pnSourceDirect(s); },\n'
       '\t\t\t\t\t  ph: "for example we cannot process your application", hint: "APP 5.2(e). Leave empty if there are none." },\n')
ZL = '(prim(s) === "za" ? "%s" : "South Africa: %s") + "%s"'
def zl(word, rest):
    return ZL % (word[0].upper(), word[0].lower(), word[1:] + rest)
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "zaBasis", type: "select", label: function (s) { return ' + zl('legal', ' basis (s. 11(1))') + '; }, opts: function () { return D.ZA_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: zaOn,\n'
 '\t\t\t\t\t  hint: "Section 11(1). People can object to processing on (d), (e) or (f) (s. 11(3)(a))." },\n'
 '\t\t\t\t\t{ id: "zaBasisLaw", type: "text", label: "South Africa: the law that imposes the obligation", show: function (s, a) { return zaOn(s) && v(a, "zaBasis") === "law"; }, ph: "for example the Tax Administration Act 28 of 2011" },\n'
 '\t\t\t\t\t{ id: "zaBasisWhat", type: "text", label: function (s, a) { var b = v(a, "zaBasis"); return b === "dsli" ? "South Africa: the person\'s legitimate interest that the processing protects" : b === "public" ? "South Africa: the public law duty" : "South Africa: the legitimate interest"; },\n'
 '\t\t\t\t\t  show: function (s, a) { var b = v(a, "zaBasis"); return zaOn(s) && (b === "dsli" || b === "public" || b === "li"); } },\n'
 '\t\t\t\t\t{ id: "zaSpecial", type: "select", label: function (s) { return ' + zl('special', ' personal information, and how section 27 allows it') + '; }, opts: function () { return D.ZA_SPECIAL.map(function (x) { return { v: x.v, l: x.l }; }); }, show: zaOn,\n'
 '\t\t\t\t\t  hint: "Special personal information (s. 26): religious or philosophical beliefs, race or ethnic origin, trade union membership, political persuasion, health or sex life, biometric information, and criminal behaviour." },\n'
 '\t\t\t\t\t{ id: "zaSpecialWhat", type: "text", label: "South Africa: the special personal information", show: function (s, a) { return zaOn(s) && !!v(a, "zaSpecial") && v(a, "zaSpecial") !== "none"; }, ph: "for example health information about absence from work" },\n'
 '\t\t\t\t\t{ id: "zaSpecialSec", type: "select", label: "South Africa: the section that allows it", show: function (s, a) { return zaOn(s) && v(a, "zaSpecial") === "specific"; },\n'
 '\t\t\t\t\t  opts: function () { return D.ZA_SPECIAL_SEC.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "zaSpecialWhy", type: "text", label: function (s, a) { return v(a, "zaSpecial") === "auth" ? "South Africa: the Regulator\'s authorisation, with its Gazette notice" : v(a, "zaSpecialSec") === "32" ? "South Africa: how section 32 applies" : v(a, "zaSpecialSec") === "28" ? "South Africa: how section 28 applies" : "South Africa: details (optional)"; },\n'
 '\t\t\t\t\t  show: function (s, a) { return zaOn(s) && (v(a, "zaSpecial") === "auth" || v(a, "zaSpecial") === "specific"); }, hint: "Sections 28 and 32 list the bodies that can process religious or philosophical beliefs, or health or sex life information, and for what." },\n'
 '\t\t\t\t\t{ id: "zaLaw", type: "select", label: function (s) { return ' + zl('does', ' a particular law require or authorise collecting it?') + '; }, show: zaOn,\n'
 '\t\t\t\t\t  opts: [{ v: "no", l: "No" }, { v: "required", l: "Yes, it requires it" }, { v: "authorised", l: "Yes, it authorises it" }], hint: "Section 18(1)(f): the notice names it." },\n'
 '\t\t\t\t\t{ id: "zaLawName", type: "text", label: "South Africa: the law", show: function (s, a) { return zaOn(s) && (v(a, "zaLaw") === "required" || v(a, "zaLaw") === "authorised"); },\n'
 '\t\t\t\t\t  ph: "for example the Financial Intelligence Centre Act 38 of 2001" },\n'
 '\t\t\t\t\t{ id: "zaMand", type: "select", label: function (s) { return ' + zl('is', ' giving the information voluntary or mandatory?') + '; }, show: function (s) { return zaOn(s) && pnSourceDirect(s); },\n'
 '\t\t\t\t\t  opts: [{ v: "voluntary", l: "Voluntary" }, { v: "mandatory", l: "Mandatory" }], hint: "Section 18(1)(d)." },\n'
 '\t\t\t\t\t{ id: "zaConseq", type: "text", label: function (s) { return ' + zl('the', ' consequences if the person does not provide it') + '; }, show: function (s) { return zaOn(s) && pnSourceDirect(s); },\n'
 '\t\t\t\t\t  ph: "for example we cannot open your account", hint: "Section 18(1)(e). Leave empty to use your answer above, where there is one." },\n')
t = rep(t, 'inReg(s, "sg") ? "Singapore" : "", inReg(s, "au") ? "Australia" : ""].filter(Boolean);', 'inReg(s, "sg") ? "Singapore" : "", inReg(s, "au") ? "Australia" : "", inReg(s, "za") ? "South Africa" : ""].filter(Boolean);')
# Transfers
old = ('\t\t\t\t\t{ id: "pgs", type: "select", label: "The permitted general situation", show: function (s, r) { return v(r, "basis") === "pgs"; },\n'
       '\t\t\t\t\t  opts: function () { return D.AU_PGS.slice(0, 3).map(function (x) { return { v: x.v, l: x.l }; }); }, hint: "APP 8.2(d): items 4 and 5 of s. 16A do not apply." }\n'
       '\t\t\t\t  ] }\n')
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t{ id: "zaAbroad", type: "yesno", label: "South Africa: do you transfer personal information to third parties outside South Africa, or hold it outside South Africa?", show: zaOn,\n'
 '\t\t\t\t  hint: "Section 18(1)(g) and section 72. Include operators such as cloud providers, related companies, and your own offices or systems outside South Africa." },\n'
 '\t\t\t\t{ id: "zaXrows", type: "repeater", label: "Transfers outside South Africa", itemLabel: "Recipient outside South Africa", add: "Add a recipient outside South Africa", show: function (s) { return zaOn(s) && yes(s, "zaAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list; for your own offices or systems, your organisation\'s name." },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country" },\n'
 '\t\t\t\t\t{ id: "basis", type: "select", label: "How section 72 allows the transfer", opts: function () { return D.ZA_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The law that protects it" : "The agreement (optional)"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "agreement"; },\n'
 '\t\t\t\t\t  ph: "for example the GDPR (Regulation (EU) 2016/679)" },\n'
 '\t\t\t\t\t{ id: "protection", type: "area", rows: 2, label: function (s, r) { return v(r, "basis") === "law" ? "The level of protection in that country (optional)" : "The level of protection in that country"; },\n'
 '\t\t\t\t\t  show: function (s, r) { return !!v(r, "basis"); }, hint: "Section 18(1)(g): the level of protection the country itself affords, printed in the notice." }\n'
 '\t\t\t\t  ] }\n')
# Automated decisions
t = rep(t, '\t\t\t\t\t\tp === "au" ? "Do you make decisions about people with automated systems that use their personal information?" :\n',
          '\t\t\t\t\t\tp === "au" ? "Do you make decisions about people with automated systems that use their personal information?" :\n'
          '\t\t\t\t\t\tp === "za" ? "Do you make decisions about people with automated systems that use their personal information?" :\n')
old = '\t\t\t\t\t\tp === "au" ? "APP 1.7 to 1.9 apply from 10 December 2026: answer the Australia questions on computer programs below; this answer is for transparency." :\n'
t = rep(t, old, old + '\t\t\t\t\t\tp === "za" ? "Section 71 covers decisions based solely on automated processing that profiles people: answer the South Africa question below; this answer is for transparency." :\n')
t = rep(t, '\t\t\tAU_SECTION,\n', '\t\t\tAU_SECTION,\n\t\t\tZA_SECTION,\n')
# Withdrawal of consent
t = rep(t, '|| (auOn(s) && auConsent(s)); },', '|| (auOn(s) && auConsent(s)) || (zaOn(s) && zaConsent(s)); },')
old = '\t\t\t\t\tprim(s) === "au" ? "At any time, by an easy and accessible process (APP Guidelines B.54). Leave empty to use the privacy contact." :\n'
t = rep(t, old, old + '\t\t\t\t\tprim(s) === "za" ? "At any time (s. 11(2)(b)). Leave empty to use the Information Officer\'s email or the organisation\'s address." :\n')
old = ('\t\t\t\t{ id: "auFurtherPgs", type: "select", label: "Australia: the permitted general situation (s. 16A)", show: function (s) { return yes(s, "further") && auOn(s) && v(s, "auFurther") === "pgs"; },\n'
       '\t\t\t\t  opts: function () { return D.AU_PGS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n')
t = rep(t, old, old +
 '\t\t\t\t{ id: "zaFurther", type: "select", label: function (s) { return ' + zl('how', ' section 15 allows the new purpose') + '; }, show: function (s) { return yes(s, "further") && zaOn(s); },\n'
 '\t\t\t\t  opts: function () { return D.ZA_FURTHER.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t{ id: "zaFurtherLaw", type: "text", label: function (s) { return v(s, "zaFurther") === "exempt" ? "South Africa: the exemption notice" : "South Africa: the reason under section 15(3)(c)"; },\n'
 '\t\t\t\t  show: function (s) { return yes(s, "further") && zaOn(s) && (v(s, "zaFurther") === "law" || v(s, "zaFurther") === "exempt"); } },\n')
# build(): skeleton
t = rep(t, 'AU = inReg(s, "au"), CA = inReg(s, "ca")', 'AU = inReg(s, "au"), ZA = inReg(s, "za"), CA = inReg(s, "ca")')
t = rep(t, '\t\t\tif (P === "au") return auLead(s);\n', '\t\t\tif (P === "au") return auLead(s);\n\t\t\tif (P === "za") return zaLead(s);\n')
t = generic(t, 1, 1, 2, 2, 1, 2)
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

for d in ('can', 'in', 'cn', 'jp', 'kr'):
    mp = B + d + '/' + d + '_module.js'; m = open(mp).read()
    assert 'zaSection' not in m
    m = generic(m, 1, 0, 1, 1, 1, 0)
    assert all(ord(c) < 128 for c in m)
    open(mp, 'w').write(m)

mp = B + 'sg/sg_body.js'; m = open(mp).read()
assert 'zaSection' not in m
m = generic(m, 1, 0, 1, 1, 1, 0)
assert all(ord(c) < 128 for c in m)
open(mp, 'w').write(m)

# Australia module: its lead has no Australia section, so add South Africa after complaints, before California.
mp = B + 'au/au_body.js'; m = open(mp).read()
assert 'zaSection' not in m
m = rep(m, '\t\tnum.rights = c++; num.complaints = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;',
        '\t\tnum.rights = c++; num.complaints = c++;\n\t\tif (inReg(s, "za")) num.za = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n',
        '\t\t' + PTR + '\t\tif (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });\n')
m = rep(m, '\t\tvar caRes = null, usRes = null;\n',
        '\t\tvar zaRes = null;\n\t\tif (num.za) {\n\t\t\tblocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });\n\t\t\tArray.prototype.push.apply(blocks, zaSection(s, auSecs, "the Privacy Act"));\n\t\t\tzaRes = zaChecks(s, false);\n\t\t}\n'
        '\t\tvar caRes = null, usRes = null;\n')
m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
        '\t\tif (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }\n'
        '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
assert all(ord(c) < 128 for c in m)
open(mp, 'w').write(m)
print('South Africa wired')
