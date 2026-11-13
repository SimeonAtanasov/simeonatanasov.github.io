# Applies the form side of the China review (12 November 2026) to pn_block.js and ng-data.js. Fails if already applied.
B = '/home/claude/ng-build/build/'
D = '/home/claude/ng-build/pages/notice-generators/ng-data.js'
def rep(t, old, new, count=1):
    n = t.count(old)
    assert n == count, (n, old[:140])
    return t.replace(old, new)

p = B + 'pn_block.js'; t = open(p).read()
assert 'cnKidsP' not in t
# R08, R29: per-purpose children and method fields; cnSensWhy follows cnSensOn
t = rep(t, '{ id: "cnSensWhy", type: "text", label: "China: why the sensitive personal information is necessary, and its impact on the person", show: function (s, a) { return cnOn(s) && yes(a, "cnSens"); },\n'
           '\t\t\t\t\t  hint: "Article 30 and Regulations Article 21(1)(2): both go in the notice." },\n',
        '{ id: "cnKidsP", type: "yesno", label: "China: does this purpose use the personal information of minors under 14?", show: function (s) { return cnOn(s) && yes(s, "cnKids"); },\n'
        '\t\t\t\t\t  hint: "Article 28: it is sensitive personal information, so the notice says why it is necessary and its impact (Article 30)." },\n'
        '\t\t\t\t\t{ id: "cnSensWhy", type: "text", label: "China: why the sensitive personal information is necessary, and its impact on the person", show: function (s, a) { return cnOn(s) && cnSensOn(s, a); },\n'
        '\t\t\t\t\t  hint: "Article 30 and Regulations Article 21(1)(2): both go in the notice." },\n'
        '\t\t\t\t\t{ id: "cnMethodP", type: "text", label: "China: how this purpose is processed, if it differs from the general answer (optional)", show: cnOn,\n'
        '\t\t\t\t\t  hint: "Regulations Article 21, second paragraph: purposes, methods and categories are set out as a list. Filled for any purpose, the China table gets a column for it." },\n')
# R23: separate consent per recipient and per overseas recipient
old = '\t\t\t\t\t{ id: "cnData", type: "text", label: "China: the categories of personal information it receives", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; } }\n'
t = rep(t, old, old[:-1] + ',\n'
        '\t\t\t\t\t{ id: "cnCons", type: "yesno", label: "China: does providing personal information to it rely on consent?", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },\n'
        '\t\t\t\t\t  hint: "Article 23: where it does, ask for separate consent. Answer No where another ground in Article 13 covers it (Article 13, second paragraph)." }\n')
old = '\t\t\t\t\t{ id: "rights", type: "text", label: "How people exercise their PIPL rights against it", ph: "for example by writing to us at the address in section 1; we pass the request on and answer within 15 working days" }\n'
t = rep(t, old, old[:-1] + ',\n'
        '\t\t\t\t\t{ id: "consent", type: "yesno", label: "Does providing it rely on consent?", hint: "Article 39: where it does, ask for separate consent." }\n')
# R10: the rights channel for China when India leads
t = rep(t, '{ id: "rightsContact", type: "text", label: "How people exercise their rights", ph: "email address, web form or postal address", show: function (s) { return !usStyle(s) && prim(s) !== "in"; } },',
        '{ id: "rightsContact", type: "text", label: function (s) { return prim(s) === "in" ? "China: how people exercise their rights" : "How people exercise their rights"; }, ph: "email address, web form or postal address", show: function (s) { return !usStyle(s) && (prim(s) !== "in" || cnOn(s)); } },')
# R19: the law for a new purpose
old = '\t\t\t\t  show: function (s) { return yes(s, "further") && cnOn(s); }, hint: "Article 14: a change of purpose needs new consent where consent is the ground. Otherwise name the ground in Article 13 that covers it." },\n'
t = rep(t, old, old + '\t\t\t\t{ id: "cnFurtherLaw", type: "text", label: "China: the law or administrative regulation", show: function (s) { return yes(s, "further") && cnOn(s) && v(s, "cnFurther") === "law"; } },\n')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

d = open(D).read()
d = rep(d, '{ v: "news", l: "News reporting and media supervision in the public interest (Article 13(1)(5))", t: "news reporting and media supervision in the public interest, within a reasonable scope", sec: "13(1)(5)" },',
        '{ v: "news", l: "News reporting, supervision by public opinion and similar acts in the public interest (Article 13(1)(5))", t: "news reporting, supervision by public opinion and similar acts in the public interest, within a reasonable scope", sec: "13(1)(5)" },')
d = rep(d, 'Z02: { t: "Whether the PIPL applies, and the entity or representative in China", s: "PIPL Arts. 3, 53; NDSMR Art. 26" },',
        'Z02: { t: "Whether the PIPL applies, and the dedicated body or representative in China", s: "PIPL Arts. 3, 53; NDSMR Art. 26" },')
d = rep(d, 'Z03: { t: "Personal information protection officer", s: "PIPL Art. 52; CAC announcement of 18 July 2025" },',
        'Z03: { t: "Personal information protection officer", s: "PIPL Art. 52; Compliance Audit Measures (2025) Art. 12" },')
d = rep(d, 'Z09: { t: "Overseas recipients", s: "PIPL Arts. 38, 39; NDSMR Art. 35; CAC Order No. 16 (2024) Arts. 5, 8" },',
        'Z09: { t: "Overseas recipients, and processing outside mainland China", s: "PIPL Arts. 3, 36, 38 to 40; NDSMR Art. 35; CAC Order No. 16 (2024) Art. 5" },')
d = rep(d, 'Z12: { t: "Automated decision-making and personalised push", s: "PIPL Arts. 24, 55, 73" },',
        'Z12: { t: "Automated decision-making and personalised push", s: "PIPL Arts. 24, 55, 73; NDSMR Art. 42" },')
d = rep(d, 'Z14: { t: "Complaints and court action", s: "PIPL Arts. 50, 65" },', 'Z14: { t: "Complaints, and court action after a refused request", s: "PIPL Arts. 50, 65" },')
d = rep(d, 'Z20: { t: "Notice to the parent or guardian (delivery)", s: "CAC Order No. 4 (2019) Arts. 9, 10" },',
        'Z20: { t: "Notice to the parent or guardian, user agreement and designated person (delivery)", s: "CAC Order No. 4 (2019) Arts. 8 to 10" },')
d = rep(d, 'Z22: { t: "Report the entity or representative in China (delivery)", s: "PIPL Art. 53; NDSMR Art. 26" },',
        'Z22: { t: "Report the dedicated body or representative in China (delivery)", s: "PIPL Art. 53; NDSMR Art. 26" },')
assert all(ord(c) < 128 for c in d)
open(D, 'w').write(d)
print('review wiring applied')
