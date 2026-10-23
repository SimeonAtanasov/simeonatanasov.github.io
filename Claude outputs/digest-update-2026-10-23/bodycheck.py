"""Check that each digest builder's build_body() appears verbatim in the live page."""
import sys, os, importlib, hashlib
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SPECS = [("edpb-digest-build", "build_digest_page", "edpb-digest.html"),
         ("cookie-digest-build", "build_cookie_page", "cookie-digest.html"),
         ("ai-act-digest-build", "build_aia_page", "ai-act-digest.html")]
for d, mod, page in SPECS:
    bd = os.path.join(REPO, "Claude outputs", d)
    sys.path.insert(0, bd); os.chdir(bd)
    m = importlib.import_module(mod)
    body = m.build_body().replace("\r\n", "\n")
    live = open(os.path.join(REPO, page), encoding="utf-8").read()
    print(page, "body", len(body), "found" if body in live else "NOT FOUND", "count", live.count(body), hashlib.md5(live.encode()).hexdigest())
    sys.path.pop(0)
