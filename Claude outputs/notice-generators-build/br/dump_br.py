import sys, os, json, threading, http.server, socketserver, functools
sys.path.insert(0, "/home/claude/ng-build/build/br")
from scen_br import SCEN_BR
from scen_br_review import SCEN_BR_REVIEW
from playwright.sync_api import sync_playwright
root, outdir = sys.argv[1], sys.argv[2]; os.makedirs(outdir, exist_ok=True)
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
class Q(h.func):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=root))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/notice-generators.html"); pg.wait_for_function("window.__NG")
    for name, (g, st) in list(SCEN_BR.items()) + list(SCEN_BR_REVIEW.items()):
        txt = pg.evaluate("""([k, s]) => { const g = window.__NG.GENS.find(x => x.key === k); const r = g.build(JSON.parse(JSON.stringify(s)));
            return window.__NG.blocksToText(r.blocks) + "\\n\\n--CHECKS--\\n" + r.checks.map(c => c.id + " | " + c.status + " | " + c.note + " | " + (c.s||"")).join("\\n") + "\\n\\n--DELIVERY--\\n" + (r.extra||"").replace(/<\\/tr>/g,"\\n").replace(/<[^>]+>/g, " ").replace(/[ ]+/g," "); }""", [g, st])
        open(os.path.join(outdir, name + ".txt"), "w", encoding="utf-8").write(txt)
    print("errors", errs); b.close()
srv.shutdown()
