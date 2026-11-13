# HOME-02 (12 November 2026, on Simeon's instruction): the notice and policy generators on the
# home page. Portfolio flyout: an entry in the Privacy group after Transfer Impact Assessment and
# one in the AI group after Fundamental Rights Impact Assessment. Privacy & AI card: an eleventh
# chip and one sentence naming the companion page. Everything from <section id="two"> onwards
# (Career & Education and after) must stay byte-identical; the script refuses to write otherwise.
# Baseline in Claude outputs/tool-baselines/2026-11-12-HOME-02/. Usage: python3 wire_home02.py REPO [--dry]
import sys, os, hashlib, shutil
R = sys.argv[1]; DRY = "--dry" in sys.argv
p = os.path.join(R, "index.html")
raw = open(p, "rb").read(); s = raw.decode("utf-8")
assert "notice-generators.html" not in s, "already wired"
tail = s[s.index('<section id="two"'):]
T = "\t" * 9
def rep(s, a, b):
    assert s.count(a) == 1, a[:80]
    return s.replace(a, b)
s = rep(s, T + '<li><a href="privacy-ai-assessment.html#tool-tia">Transfer Impact Assessment</a></li>\n',
        T + '<li><a href="privacy-ai-assessment.html#tool-tia">Transfer Impact Assessment</a></li>\n' +
        T + '<li><a href="notice-generators.html">Notice and Policy Generators</a></li>\n')
s = rep(s, T + '<li><a href="privacy-ai-assessment.html#tool-fria">Fundamental Rights Impact Assessment</a></li>\n',
        T + '<li><a href="privacy-ai-assessment.html#tool-fria">Fundamental Rights Impact Assessment</a></li>\n' +
        T + '<li><a href="notice-generators.html#ai-notice">AI Notice and Policy Generators</a></li>\n')
C = "\t" * 8
s = rep(s, C + '<a href="privacy-ai-assessment.html#tool-tpsa" class="tool-chip">Third-Party Security</a>\n',
        C + '<a href="privacy-ai-assessment.html#tool-tpsa" class="tool-chip">Third-Party Security</a>\n' +
        C + '<a href="notice-generators.html" class="tool-chip">Notice &amp; Policy Generators</a>\n')
s = rep(s, "get an instant result with recommended actions - all in your browser.</p>",
        "get an instant result with recommended actions - all in your browser. A companion page, the notice and policy generators, drafts a privacy notice, an AI transparency notice and two policy templates, each with a completeness check against the law.</p>")
assert s[s.index('<section id="two"'):] == tail, "section two changed"
assert chr(0x2014) not in s
b = s.encode("utf-8")
print("index.html", len(raw), "->", len(b), hashlib.md5(b).hexdigest())
if not DRY:
    base = os.path.join(R, "Claude outputs", "tool-baselines", "2026-11-12-HOME-02")
    os.makedirs(base, exist_ok=True)
    bp = os.path.join(base, "index.html")
    if not os.path.exists(bp): open(bp, "wb").write(raw)
    open(p, "wb").write(b)
