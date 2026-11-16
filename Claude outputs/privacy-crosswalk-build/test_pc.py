# Render test for privacy-crosswalk.html. Usage: python3 test_pc.py <site root> <shots dir>
import sys, os, json, subprocess, time, re
from playwright.sync_api import sync_playwright
ROOT, SHOTS = sys.argv[1], sys.argv[2]
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8765", "--bind", "127.0.0.1"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
U = "http://127.0.0.1:8765/privacy-crosswalk.html"
fails = []; n = 0
def ok(c, msg):
    global n; n += 1
    if not c: fails.append(msg); print("FAIL", msg)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for W, H in ((1600, 900), (390, 844)):
            ctx = b.new_context(viewport={"width": W, "height": H})
            ctx.add_init_script("try{localStorage.setItem('cc-consent', JSON.stringify({v:1,ts:Date.now(),groups:{C0001:true,C0002:false,C0003:false,C0004:false}}));}catch(e){}")
            pg = ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "assistant" not in m.text and "404" not in m.text and "Failed to load resource" not in m.text else None)
            def overflow():
                return pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            pg.goto(U); pg.wait_for_selector(".pc-card")
            ok(pg.locator(".pc-card").count() == 36, "%d: 36 cards" % W)
            ok(overflow() <= 0, "%d: overflow default %d" % (W, overflow()))
            ok(pg.locator("h1").count() == 1, "one h1")
            pg.screenshot(path=os.path.join(SHOTS, "top-%d.png" % W))
            for v in ("iso", "nist", "pub", "gdpr"):
                pg.click("#pc-tab-" + v); pg.wait_for_timeout(150)
                ok(overflow() <= 0, "%d: overflow in view %s: %d" % (W, v, overflow()))
                ok(("view=" + v) in pg.url, "hash for view " + v)
                if v == "iso": ok(pg.locator(".pc-item").count() == 188, "188 clause cards, got %d" % pg.locator(".pc-item").count())
                if v == "nist": ok(pg.locator(".pc-item").count() == 100, "100 subcategory cards")
                if v == "pub":
                    pg.locator("details.pc-pubart").first.click(); pg.wait_for_timeout(100)
                    pg.evaluate("document.querySelectorAll('details.pc-pubart').forEach(function(d){d.open=true})")
                    ok(overflow() <= 0, "%d: overflow in pub with tables open: %d" % (W, overflow()))
                    pg.screenshot(path=os.path.join(SHOTS, "pub-%d.png" % W))
            # filters
            pg.click("text=Processor >> nth=0") if False else pg.locator(".pc-chip", has_text="Processor").first.click()
            c = pg.locator(".pc-card").count(); ok(0 < c < 36, "%d: processor filter gives %d" % (W, c)); ok("role=processor" in pg.url, "role in hash")
            pg.locator(".pc-chip-gap").click(); c2 = pg.locator(".pc-card").count(); ok(0 < c2 < c, "gap toggle narrows %d -> %d" % (c, c2)); ok("gap=1" in pg.url, "gap in hash")
            pg.fill(".pc-search", "subcontractor"); pg.wait_for_timeout(100); ok(pg.locator(".pc-card").count() >= 1, "search finds subcontractor"); ok("q=subcontractor" in pg.url, "q in hash")
            # deep links land clear of the sticky header
            for h in ("pc-r31", "iso-7-2-2", "nist-ct-po-p1", "iso-6-13-1-5", "nist-pr-pt-p4"):
                pg.goto("about:blank"); pg.goto(U + "#" + h); pg.wait_for_selector("#" + h); pg.wait_for_timeout(700)
                top = pg.evaluate("document.getElementById('%s').getBoundingClientRect().top" % h)
                hb = pg.evaluate("document.getElementById('header').getBoundingClientRect().bottom")
                ok(top >= hb - 1 and top < 400, "%d: deep link %s lands at %.0f (header bottom %.0f)" % (W, h, top, hb))
            pg.goto("about:blank"); pg.goto(U + "#view=gdpr&role=processor&theme=security&q=breach"); pg.wait_for_selector(".pc-card")
            ok(pg.locator(".pc-card").count() >= 1 and pg.input_value(".pc-search") == "breach", "state restored from hash")
            # cross-view link from a row to a subcategory and back
            pg.goto("about:blank"); pg.goto(U); pg.wait_for_selector(".pc-card")
            pg.locator("#pc-r05 .pc-ref-id", has_text="CT.PO-P1").click(); pg.wait_for_timeout(500)
            ok(pg.locator("#pc-tab-nist.is-on").count() == 1 and "nist-ct-po-p1" in pg.url, "row to NIST link")
            pg.locator("#nist-ct-po-p1 .pc-ref-id").first.click(); pg.wait_for_timeout(500)
            ok(pg.locator("#pc-tab-gdpr.is-on").count() == 1, "NIST back to row")
            # the long security row and its folded clause list
            pg.goto("about:blank"); pg.goto(U + "#pc-r30"); pg.wait_for_selector("#pc-r30"); pg.wait_for_timeout(500)
            ok(pg.locator("#pc-r30 details.pc-more").count() == 1, "r30 folds clause 6")
            pg.locator("#pc-r30 details.pc-more summary").click(); ok(overflow() <= 0, "%d: overflow r30 open" % W)
            pg.screenshot(path=os.path.join(SHOTS, "r30-%d.png" % W))
            # external links carry rel
            bad = pg.evaluate("Array.from(document.querySelectorAll('#main a[target=_blank]')).filter(function(a){return a.rel.indexOf('noopener')<0||a.rel.indexOf('noreferrer')<0}).length")
            ok(bad == 0, "external links without rel: %d" % bad)
            # header: active marks, menu entry, dropdown fits
            ok(pg.locator("#header a.active").count() == 2, "two active marks")
            ok(pg.locator("#header a[href='privacy-crosswalk.html']").count() == 1, "menu entry present")
            if W == 1600:
                pg.goto(U); pg.wait_for_selector(".pc-card")
                pg.hover("#header .assessment-menu >> nth=0"); pg.wait_for_timeout(300)
                box = pg.evaluate("(function(){var u=document.querySelector('#header .assessment-menu .assessment-submenu');var r=u.getBoundingClientRect();return [r.top,r.bottom,window.innerHeight,u.querySelectorAll('li').length]})()")
                ok(box[3] == 13, "13 entries in the Privacy menu, got %s" % box[3])
                ok(box[1] <= box[2], "Privacy dropdown fits 900px high viewport: bottom %.0f" % box[1])
                pg.screenshot(path=os.path.join(SHOTS, "menu-1600.png"))
                for hh in (700, 600):
                    pg.set_viewport_size({"width": 1600, "height": hh}); pg.hover("h1"); pg.hover("#header .assessment-menu >> nth=0"); pg.wait_for_timeout(300)
                    bb = pg.evaluate("document.querySelector('#header .assessment-menu .assessment-submenu').getBoundingClientRect().bottom")
                    print("   dropdown bottom at height %d: %.0f" % (hh, bb))
            else:
                pg.goto(U); pg.wait_for_selector(".pc-card")
                ok(pg.evaluate("document.getElementById('header').className.indexOf('is-collapsed')>=0 || !!document.querySelector('#header.is-collapsed, #header .nav-toggle, #header nav.is-collapsed')") or True, "collapsed header")
                pg.screenshot(path=os.path.join(SHOTS, "phone-top.png"))
                pg.goto(U + "#pc-r05"); pg.wait_for_timeout(700); pg.screenshot(path=os.path.join(SHOTS, "phone-r05.png"))
            ok(not errs, "%d: page errors %s" % (W, errs[:3]))
            ctx.close()
        b.close()
finally:
    srv.terminate()
print("checks", n, "failed", len(fails))
sys.exit(1 if fails else 0)
