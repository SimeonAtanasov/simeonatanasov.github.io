"""Remap the positional cookie chunk ids (ck-dNNN) in questions_written.json after the
27 October 2026 digest update (DIG-02) inserted one entry at ck-d031 and shifted every later
id by one. Old ids come from the baseline page in tool-baselines/2026-10-27-DIG-02/, new ids
from the live page; an entry is matched by its source URL, with the title as tie-break.
Same method as digest-update-2026-10-23/remap_questions.py. Refuses to run twice."""
import json, re, os, html
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = os.path.join(REPO, "Claude outputs", "tool-baselines", "2026-10-27-DIG-02")
QW = os.path.join(REPO, "Claude outputs", "assistant-build", "questions_written.json")
assert open(QW, "rb").read() == open(os.path.join(BASE, "questions_written.json"), "rb").read(), "questions_written.json changed since baseline: already remapped?"
ART = re.compile(r'<article class="ck-entry[^"]*" id="(ck-d\d+)"[^>]*>\s*<h3 class="ck-title"><a href="([^"]+)"[^>]*>(.*?)</a>', re.S)
def entries(path):
    return [(i, html.unescape(u), html.unescape(t)) for i, u, t in ART.findall(open(path, encoding="utf-8").read())]
q = json.load(open(QW, encoding="utf-8"))
out = {k: v for k, v in q.items() if not re.fullmatch(r"ck-d\d+", k)}
page, n_old, n_new = "cookie-digest.html", 260, 261
old = entries(os.path.join(BASE, page)); new = entries(os.path.join(REPO, page))
assert len(old) == n_old and len(new) == n_new, (page, len(old), len(new))
by_url = {}
for i, u, t in new: by_url.setdefault(u, []).append((i, t))
moved = 0
for i, u, t in old:
    cands = by_url.get(u, [])
    if len(cands) > 1: cands = [c for c in cands if c[1] == t] or cands
    assert len(cands) == 1, (page, i, u, cands)
    ni = cands[0][0]
    if i in q:
        assert ni not in out, (ni, "collision")
        out[ni] = q[i]
    moved += (ni != i)
assert len(out) == len(q), (len(out), len(q))
open(QW, "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1, sort_keys=True))
print("remapped; cookie ids that moved:", moved, "keys:", len(out))
