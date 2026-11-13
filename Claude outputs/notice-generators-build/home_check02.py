"""HOME-02 layout check: the Privacy & AI card's 11 chips stay inside the image at the six sizes
used for NAV-03, no horizontal overflow, no page errors. Usage: python3 home_check02.py TREE SHOTS"""
import sys, os, functools, threading, http.server, socketserver, json
from playwright.sync_api import sync_playwright
ROOT, SHOTS = sys.argv[1], sys.argv[2]; os.makedirs(SHOTS, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
fail = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in [(1600, 900), (1000, 800), (900, 800), (900, 560), (390, 844), (390, 640)]:
        ctx = b.new_context(viewport={"width": w, "height": h})
        ctx.add_init_script("try{localStorage.setItem('cc-consent', JSON.stringify({v:1, ts:Date.now(), groups:{C0001:true,C0002:false,C0003:false,C0004:false}}));}catch(e){}")
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"http://127.0.0.1:{port}/index.html")
        sec = pg.locator("section.spotlight-assessment", has=pg.locator(".image-tools-many"))
        sec.scroll_into_view_if_needed(); pg.wait_for_timeout(900)
        r = pg.evaluate("""() => {
          const s = document.querySelector('.image-tools-many').closest('section'), img = s.querySelector('.image').getBoundingClientRect();
          const chips = [...s.querySelectorAll('.tool-chip')].map(c => c.getBoundingClientRect());
          const out = chips.filter(c => c.top < img.top - 1 || c.bottom > img.bottom + 1 || c.left < img.left - 1 || c.right > img.right + 1).length;
          return { n: chips.length, outside: out, overflow: document.documentElement.scrollWidth - window.innerWidth, img: [Math.round(img.width), Math.round(img.height)],
                   flyout: !!document.querySelector('.portfolio-submenu a[href="notice-generators.html"]') && !!document.querySelector('.portfolio-submenu a[href="notice-generators.html#ai-notice"]') };
        }""")
        ok = r["n"] == 11 and not r["outside"] and r["overflow"] <= 0 and r["flyout"] and not errs
        fail += 0 if ok else 1
        print(f"{w}x{h}", json.dumps(r), len(errs), "OK" if ok else "FAIL")
        sec.screenshot(path=os.path.join(SHOTS, f"home-card-{w}x{h}.png"))
        ctx.close()
    b.close()
srv.shutdown()
print(f"{fail} FAIL" if fail else "HOME CARD PASS"); sys.exit(1 if fail else 0)
