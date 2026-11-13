# Wires the Singapore module into pn_block.js and the Canada, India, China, Japan and Korea modules. Fails if
# already wired. pn_block.js is edited with its spliced module region (CANADA marker to "var PN = {") reduced
# to the six marker lines; sg/rebuild.sh splices the modules back in.
import re
B = '/home/claude/ng-build/build/'
NAMES = ['CANADA', 'INDIA', 'CHINA', 'JAPAN', 'KOREA', 'SINGAPORE']
M = ['\t/* ' + '=' * (62 - len(h)) + ' ' + h + ' === */' for h in NAMES]

def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

def resub(t, pat, fn, count):
    r, n = re.subn(pat, fn, t)
    assert n == count, (n, pat[:100])
    return r

PTR = ('if (num.sg) first.push({ k: "p", x: "If you are in Singapore, section " + num.sg + " also applies to you. Our data protection officer: " + '
       '(v(s, "sgDpo") || "Data Protection Officer") + ", " + stop(v(s, "sgDpoContact") || "[business contact information]") });\n')

def generic(t, n_inreg, n_KR, n_ptr, n_block, n_push1, n_push2):
    """After each Korea line in a lead builder, add the Singapore line."""
    t = resub(t, r'(\t+)if \(inReg\(s, "kr"\)\) num\.kr = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (inReg(s, "sg")) num.sg = c++;\n', n_inreg)
    t = resub(t, r'(\t+)if \(KR\) num\.kr = c\+\+;\n', lambda m: m.group(0) + m.group(1) + 'if (SG) num.sg = c++;\n', n_KR)
    t = resub(t, r'(\t+)if \(num\.kr\) first\.push\(\{ k: "p", x: "If you are in Korea, section " \+ num\.kr \+ " also applies to you\." \}\);\n',
              lambda m: m.group(0) + m.group(1) + PTR, n_ptr)
    pat = (r'(\t+)var krRes = null;\n\t+if \(num\.kr\) \{\n\t+blocks\.push\(\{ k: "h2", x: num\.kr \+ "\. Additional information for people in Korea" \}\);\n'
           r'\t+Array\.prototype\.push\.apply\(blocks, krSection\(s, (\[[^\]]*\]|\w+), (.*)\)\);\n\t+krRes = krChecks\(s, false\);\n\t+\}\n')
    def blk(m):
        i = m.group(1)
        return (m.group(0) + i + 'var sgRes = null;\n' + i + 'if (num.sg) {\n' + i + '\tblocks.push({ k: "h2", x: num.sg + ". Additional information for people in Singapore" });\n'
                + i + '\tArray.prototype.push.apply(blocks, sgSection(s, ' + m.group(2) + ', ' + m.group(3) + '));\n' + i + '\tsgRes = sgChecks(s, false);\n' + i + '}\n')
    t = resub(t, pat, blk, n_block)
    t = resub(t, r'(\t+)if \(krRes\) \{ Array\.prototype\.push\.apply\(checks, krRes\.checks\); Array\.prototype\.push\.apply\(delivery, krRes\.delivery\); \}\n',
              lambda m: m.group(0) + m.group(1) + 'if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }\n', n_push1)
    t = resub(t, r'(\t+)if \(krRes\) Array\.prototype\.push\.apply\((checks|delivery), krRes\.(checks|delivery)\);\n',
              lambda m: m.group(0) + m.group(1) + 'if (sgRes) Array.prototype.push.apply(' + m.group(2) + ', sgRes.' + m.group(3) + ');\n', n_push2)
    return t

p = B + 'pn_block.js'; t = open(p).read()
assert 'sgLead' not in t
i = t.index(M[0]); j = t.index('\tvar PN = {\n')
t = t[:i] + '\n'.join(M) + '\n' + t[j:]
t = rep(t, 'India, China, Japan, Korea, California, other US states, sets the main text', 'India, China, Japan, Korea, Singapore, California, other US states, sets the main text')
t = rep(t, 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "ca", "us"];', 'var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "ca", "us"];')
t = rep(t, 'p === "kr" ? "Kr" : p === "ca" ? "Ca" : "Us"); }', 'p === "kr" ? "Kr" : p === "sg" ? "Sg" : p === "ca" ? "Ca" : "Us"); }')
t = rep(t, '\t\tif (prim(s) === "kr") return krConsent(s);\n', '\t\tif (prim(s) === "kr") return krConsent(s);\n\t\tif (prim(s) === "sg") return sgConsent(s);\n')
# Fields hidden for a Singapore lead, as for Korea: children, DPO, joint controllers, required/consequence, Article 22 logic and effect.
t = rep(t, 'prim(s) !== "kr"', 'prim(s) !== "kr" && prim(s) !== "sg"', 12)
t = rep(t, 'prim(s) === "kr" ? "Organisation (the personal information controller)" : "Organisation (the controller)"; }',
          'prim(s) === "kr" ? "Organisation (the personal information controller)" : prim(s) === "sg" ? "Organisation" : "Organisation (the controller)"; }')
# Per purpose
old = ('\t\t\t\t\t{ id: "krRrnLaw", type: "text", label: function (s, a) { return v(a, "krRrnBasis") === "notice" ? "Korea: the PIPC notice relied on" : "Korea: the law and article"; }, '
       'show: function (s, a) { return krOn(s) && krHasKind(a, "rrn") && (v(a, "krRrnBasis") === "law" || v(a, "krRrnBasis") === "notice"); } },\n')
t = rep(t, old, old +
 '\t\t\t\t\t{ id: "sgBasis", type: "select", label: function (s) { return (prim(s) === "sg" ? "How" : "Singapore: how") + " the PDPA allows it"; }, opts: function () { return D.SG_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: sgOn,\n'
 '\t\t\t\t\t  hint: "Consent, deemed consent (sections 15 and 15A), or an exception (section 17; First and Second Schedules). Its own answer: no other law\'s legal basis is read as one." },\n'
 '\t\t\t\t\t{ id: "sgOptOut", type: "text", label: "Singapore: how and by when people can opt out", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "notify"; },\n'
 '\t\t\t\t\t  ph: "for example use the link in our email of 1 March within 30 days", hint: "Section 15A(4)(b)(iii). Not for sending marketing messages (regulation 13)." },\n'
 '\t\t\t\t\t{ id: "sgLi", type: "text", label: "Singapore: the legitimate interest (optional)", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "li"; },\n'
 '\t\t\t\t\t  hint: "First Schedule, Part 3, paragraph 1. Not for sending marketing messages (paragraph 1(4))." },\n'
 '\t\t\t\t\t{ id: "sgExc", type: "text", label: "Singapore: the exception, with its Schedule, Part and paragraph", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "exception"; },\n'
 '\t\t\t\t\t  ph: "for example First Schedule, Part 3, paragraph 4: recovering a debt" },\n'
 '\t\t\t\t\t{ id: "sgLaw", type: "text", label: "Singapore: the law and section", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "law"; } },\n')
t = rep(t, 'inReg(s, "kr") ? "Korea" : ""].filter(Boolean);', 'inReg(s, "kr") ? "Korea" : "", inReg(s, "sg") ? "Singapore" : ""].filter(Boolean);')
# Transfers
old = ('\t\t\t\t\t{ id: "refuse", type: "text", label: "How to refuse the transfer, and what follows", ph: "for example email privacy@example.kr; we then cannot offer support from abroad", hint: "Article 28-8(2)(5)." }\n'
       '\t\t\t\t  ] }\n')
t = rep(t, old, old[:-1] + ',\n'
 '\t\t\t\t{ id: "sgAbroad", type: "yesno", label: "Singapore: is personal data transferred outside Singapore?", show: sgOn,\n'
 '\t\t\t\t  hint: "Section 26; regulations 9 to 12. Include service providers and storage outside Singapore, and your own systems abroad." },\n'
 '\t\t\t\t{ id: "sgXrows", type: "repeater", label: "Transfers outside Singapore", itemLabel: "Transfer outside Singapore", add: "Add a transfer outside Singapore", show: function (s) { return sgOn(s) && yes(s, "sgAbroad"); },\n'
 '\t\t\t\t  fields: [\n'
 '\t\t\t\t\t{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },\n'
 '\t\t\t\t\t{ id: "country", type: "text", label: "Country or territory" },\n'
 '\t\t\t\t\t{ id: "basis", type: "select", label: "How the transfer meets section 26", opts: function () { return D.SG_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n'
 '\t\t\t\t\t{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The law, with its section" : "The instrument"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "instrument"; } },\n'
 '\t\t\t\t\t{ id: "certKind", type: "select", label: "The certification the recipient holds", show: function (s, r) { return v(r, "basis") === "cert"; },\n'
 '\t\t\t\t\t  opts: [{ v: "apec-cbpr", l: "APEC Cross-Border Privacy Rules (CBPR)" }, { v: "global-cbpr", l: "Global Cross-Border Privacy Rules (CBPR)" },\n'
 '\t\t\t\t\t\t{ v: "apec-prp", l: "APEC Privacy Recognition for Processors (PRP): data intermediaries only" }, { v: "global-prp", l: "Global Privacy Recognition for Processors (PRP): data intermediaries only" }],\n'
 '\t\t\t\t\t  hint: "Regulation 12, as amended from 2 March 2026." },\n'
 '\t\t\t\t\t{ id: "summary", type: "area", rows: 2, label: "A reasonable summary of how the data is protected in that country", show: function (s, r) { return v(r, "basis") === "consent"; },\n'
 '\t\t\t\t\t  hint: "Regulation 10(3)(a): consent to the transfer is not valid without it. It is printed in the policy." }\n'
 '\t\t\t\t  ] }\n')
# Automated decisions
t = rep(t, '\t\t\t\t\t\tp === "kr" ? "Do you make decisions about people with a fully automated system, AI systems included, that processes their personal information?" :\n',
          '\t\t\t\t\t\tp === "kr" ? "Do you make decisions about people with a fully automated system, AI systems included, that processes their personal information?" :\n'
          '\t\t\t\t\t\tp === "sg" ? "Do you make decisions about people with automated systems that use their personal data?" :\n')
old = '\t\t\t\t\t\tp === "kr" ? "Article 37-2:'
t = rep(t, old, '\t\t\t\t\t\tp === "sg" ? "The PDPA has no rule of its own on automated decisions; the policy says what is decided, for transparency." :\n' + old)
t = rep(t, '\t\t\tKR_SECTION,\n', '\t\t\tKR_SECTION,\n\t\t\tSG_SECTION,\n')
# Withdrawal of consent
t = rep(t, '|| cnConsent(s) || (krOn(s) && krConsent(s)); },', '|| cnConsent(s) || (krOn(s) && krConsent(s)) || (sgOn(s) && sgConsent(s)); },')
t = rep(t, '\t\t\t\t\tprim(s) === "kr" ? "At any time, no harder than giving consent',
          '\t\t\t\t\tprim(s) === "sg" ? "At any time, on reasonable notice (section 16(1)). Leave empty to use the data protection officer\'s contact." :\n'
          '\t\t\t\t\tprim(s) === "kr" ? "At any time, no harder than giving consent')
old = '\t\t\t\t  opts: [{ v: "related", l: "Reasonably related to the original purpose (Article 15(3))" }, { v: "consent", l: "Separate consent first (Article 18(2)(1))" }] },\n'
t = rep(t, old, old +
 '\t\t\t\t{ id: "sgFurther", type: "select", label: function (s) { return (prim(s) === "sg" ? "" : "Singapore: ") + "how the PDPA allows the new purpose"; }, show: function (s) { return yes(s, "further") && sgOn(s); },\n'
 '\t\t\t\t  opts: [{ v: "consent", l: "Consent first (sections 14 and 20(1)(b))" }, { v: "notify", l: "Deemed consent by notification (section 15A)" },\n'
 '\t\t\t\t\t{ v: "li", l: "Legitimate interests (First Schedule, Part 3, paragraph 1)" }, { v: "exception", l: "Another exception, or a law that requires or authorises it (sections 13(b) and 17)" }] },\n'
 '\t\t\t\t{ id: "sgFurtherLaw", type: "text", label: "Singapore: the exception or law", show: function (s) { return yes(s, "further") && sgOn(s) && v(s, "sgFurther") === "exception"; } },\n')
# build(): skeleton
t = rep(t, 'KR = inReg(s, "kr"), CA = inReg(s, "ca")', 'KR = inReg(s, "kr"), SG = inReg(s, "sg"), CA = inReg(s, "ca")')
t = rep(t, '\t\t\tif (P === "kr") return krLead(s);\n', '\t\t\tif (P === "kr") return krLead(s);\n\t\t\tif (P === "sg") return sgLead(s);\n')
t = generic(t, 1, 1, 2, 2, 1, 2)
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

for d in ('can', 'in', 'cn', 'jp'):
    mp = B + d + '/' + d + '_module.js'; m = open(mp).read()
    assert 'sgSection' not in m
    m = generic(m, 1, 0, 1, 1, 1, 0)
    assert all(ord(c) < 128 for c in m)
    open(mp, 'w').write(m)

# Korea module: its lead has no Korea section, so add Singapore before California.
mp = B + 'kr/kr_module.js'; m = open(mp).read()
assert 'sgSection' not in m
m = rep(m, '\t\tif (inReg(s, "ca")) num.ca = c++;', '\t\tif (inReg(s, "sg")) num.sg = c++;\n\t\tif (inReg(s, "ca")) num.ca = c++;')
m = rep(m, '\n\t\tif (num.ca) first.push(', '\n\t\t' + PTR + '\t\tif (num.ca) first.push(')
m = rep(m, '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {',
        '\t\tvar sgRes = null;\n\t\tif (num.sg) {\n\t\t\tblocks.push({ k: "h2", x: num.sg + ". Additional information for people in Singapore" });\n'
        '\t\t\tArray.prototype.push.apply(blocks, sgSection(s, krSecs, "the PIPA"));\n\t\t\tsgRes = sgChecks(s, false);\n\t\t}\n'
        '\t\tvar caRes = null, usRes = null;\n\t\tif (num.ca) {')
m = rep(m, '\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n',
        '\t\tif (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }\n\t\tif (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }\n')
assert all(ord(c) < 128 for c in m)
open(mp, 'w').write(m)
print('Singapore wired')
