"""Splice the rebuilt cookie digest body into the live page without a full rebuild
(2 November 2026 update, DIG-03).

usage: python3 splice.py [--write]

The old body is regenerated from the baseline copies in tool-baselines/2026-11-02-DIG-03/cookie/
(builder plus data, in a temporary copy of the build folder), must occur exactly once in the
live page, and is replaced by the body the current builder produces. The four head counts
("261 cookie and tracking laws") become 263. Prints sizes and md5s; writes only with --write.
Same method as digest-update-2026-10-27/splice.py.
"""
import sys, os, shutil, tempfile, subprocess, hashlib
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(REPO, "Claude outputs")
BASE = os.path.join(OUT, "tool-baselines", "2026-11-02-DIG-03", "cookie")
D, MOD, PAGE = "cookie-digest-build", "build_cookie_page", "cookie-digest.html"
write = "--write" in sys.argv
CODE = "import sys,os;sys.path.insert(0,os.getcwd());import %s as m;sys.stdout.buffer.write(m.build_body().replace('\\r\\n','\\n').encode('utf-8'))" % MOD

def body_in(folder):
    r = subprocess.run([sys.executable, "-c", CODE], cwd=folder, capture_output=True)
    if r.returncode: sys.exit(r.stderr.decode())
    return r.stdout.decode("utf-8")

tmp = tempfile.mkdtemp()
old_dir = os.path.join(tmp, D)
shutil.copytree(os.path.join(OUT, D), old_dir, ignore=shutil.ignore_patterns("__pycache__"))
for f in os.listdir(BASE):
    shutil.copy(os.path.join(BASE, f), os.path.join(old_dir, f))
old = body_in(old_dir)
new = body_in(os.path.join(OUT, D))
shutil.rmtree(tmp)
p = os.path.join(REPO, PAGE)
live = open(p, encoding="utf-8").read()
assert live.count(old) == 1, "old body found %d times" % live.count(old)
out = live.replace(old, new)
a, b = "261 cookie and tracking laws", "263 cookie and tracking laws"
assert out.count(a) == 4 and out.count(b) == 0, out.count(a)
out = out.replace(a, b)
print(PAGE, "old body", len(old), "new body", len(new), "page", len(live), "->", len(out))
print("entries", out.count('<article class="ck-entry"'), "em dashes in new page:", out.count(chr(0x2014)))
if write:
    open(p, "w", encoding="utf-8", newline="\n").write(out)
    print("written md5", hashlib.md5(open(p, "rb").read()).hexdigest(), "bytes", os.path.getsize(p))
