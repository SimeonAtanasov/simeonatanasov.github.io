"""Splice a rebuilt digest body into the live page without a full rebuild.

usage: python3 splice.py edpb|cookie|aia [--write]

The old body is regenerated from the baseline copies in
tool-baselines/2026-10-23-DIG-01/<key>/ (builder plus data, in a temporary copy of the build
folder), must occur exactly once in the live page, and is replaced by the body the current
builder produces. Prints sizes and md5s; writes only with --write.
"""
import sys, os, shutil, tempfile, subprocess, hashlib, json
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(REPO, "Claude outputs")
SPEC = {"edpb": ("edpb-digest-build", "build_digest_page", "edpb-digest.html", "edpb"),
        "cookie": ("cookie-digest-build", "build_cookie_page", "cookie-digest.html", "cookie"),
        "aia": ("ai-act-digest-build", "build_aia_page", "ai-act-digest.html", "aia")}
key = sys.argv[1]; write = "--write" in sys.argv
d, mod, page, base = SPEC[key]
CODE = "import sys,os;sys.path.insert(0,os.getcwd());import %s as m;sys.stdout.buffer.write(m.build_body().replace('\\r\\n','\\n').encode('utf-8'))" % mod

def body_in(folder):
    r = subprocess.run([sys.executable, "-c", CODE], cwd=folder, capture_output=True)
    if r.returncode: sys.exit(r.stderr.decode())
    return r.stdout.decode("utf-8")

tmp = tempfile.mkdtemp()
old_dir = os.path.join(tmp, d)
shutil.copytree(os.path.join(OUT, d), old_dir, ignore=shutil.ignore_patterns("__pycache__"))
bdir = os.path.join(OUT, "tool-baselines", "2026-10-23-DIG-01", base)
for f in os.listdir(bdir):
    shutil.copy(os.path.join(bdir, f), os.path.join(old_dir, f))
old = body_in(old_dir)
new = body_in(os.path.join(OUT, d))
shutil.rmtree(tmp)
p = os.path.join(REPO, page)
live = open(p, encoding="utf-8").read()
assert live.count(old) == 1, "old body found %d times" % live.count(old)
out = live.replace(old, new)
print(page, "old body", len(old), "new body", len(new), "page", len(live), "->", len(out))
print("em dashes in new page:", out.count(chr(0x2014)))
if write:
    open(p, "w", encoding="utf-8", newline="\n").write(out)
    print("written md5", hashlib.md5(open(p, "rb").read()).hexdigest())
