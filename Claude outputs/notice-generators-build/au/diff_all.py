"""Builds every privacy-notice scenario in two trees (before and after a change) and diffs the
generated text and the check rows. scen_only.py holds the EU scenarios as they were before the
regimes change of 12 November 2026. Usage: python3 diff_eu.py <old tree> <new tree>"""
import json, sys, os, threading, http.server, socketserver, functools, difflib, importlib.util
from playwright.sync_api import sync_playwright
spec = importlib.util.spec_from_file_location("t", "/tmp/scen_all7.py")
t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
def serve(root):
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
    class Q(h.func):
        def log_message(self, *a): pass
    srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=root))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv
out = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for tag, root in (("old", sys.argv[1]), ("new", sys.argv[2])):
        srv = serve(root)
        pg = b.new_page()
        pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/notice-generators.html")
        pg.wait_for_function("window.__NG")
        for name, (g, st) in t.SCEN.items():
            out[(tag, name)] = pg.evaluate("""([k, s]) => { const g = window.__NG.GENS.find(x => x.key === k); const r = g.build(JSON.parse(JSON.stringify(s)));
                return window.__NG.blocksToText(r.blocks) + "\\n--CHECKS--\\n" + r.checks.map(c => c.id + " " + c.status + " " + c.note + " | " + (c.s||"")).join("\\n") + "\\n--EXTRA--\\n" + (r.extra||"").replace(/<[^>]+>/g, " ").replace(/\\s+/g," "); }""", [g, st])
        srv.shutdown()
    b.close()
diffs = 0
for name in t.SCEN:
    a, c = out[("old", name)], out[("new", name)]
    if a != c:
        diffs += 1
        print("=== DIFF", name)
        for l in difflib.unified_diff(a.split("\n"), c.split("\n"), lineterm="", n=0): print(l)
print("scenarios differing:", diffs)
