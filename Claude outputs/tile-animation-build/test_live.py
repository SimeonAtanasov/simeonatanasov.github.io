"""Smoke test of the home page with the tile scenes wired in (scratch copy on :8766)."""
import sys, time, json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8765/index.html"
SHOTS = "shots/"
KEYS = ["scn", "pp", "aia", "dig", "pbi", "wav", "rdy", "rmx", "ast"]

STATE = """() => Array.from(document.querySelectorAll('#one > section')).map((s, i) => {
  const sc = s.querySelector('.image > .tl-scene');
  const img = s.querySelector('.image img');
  const r = s.querySelector('.image').getBoundingClientRect();
  return { i, key: sc && sc.getAttribute('data-key'), inactive: s.classList.contains('inactive'),
    tlin: s.classList.contains('tl-in'), ready: !!(sc && sc.classList.contains('tl-ready')),
    play: !!(sc && sc.classList.contains('tl-play')), top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width),
    sceneZ: sc && getComputedStyle(sc).zIndex, veilZ: getComputedStyle(s.querySelector('.image'), '::before').zIndex,
    veilOp: getComputedStyle(s.querySelector('.image'), '::before').opacity, imgHidden: img && getComputedStyle(img).display };
})"""

def run(width, height, touch, rm, dpr, tag):
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": width, "height": height}, device_scale_factor=dpr,
                            has_touch=touch, is_mobile=touch, reduced_motion="reduce" if rm else "no-preference")
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append("pageerror " + str(e)))
        page.goto(URL, wait_until="load")
        page.wait_for_timeout(800)
        st = page.evaluate(STATE)
        print(tag, "attached:", [x["key"] for x in st], "errors:", errors)
        print(tag, "z:", set((x["sceneZ"], x["veilZ"]) for x in st), "img:", set(x["imgHidden"] for x in st), "w x h:", set((x["w"], x["h"]) for x in st))
        # chips still clickable over the scene
        chip = page.evaluate("""() => { const c = document.querySelector('.spotlight-assessment .tool-chip'); c.scrollIntoView({block:'center'});
            const r = c.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return e === c || c.contains(e); }""")
        print(tag, "chip hit-test:", chip)
        # the link itself receives clicks through the scene
        link = page.evaluate("""() => { const a = document.querySelector('#one > section > .image'); a.scrollIntoView({block:'center'});
            const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return e === a || a.contains(e) ? e.tagName + '.' + e.className : 'MISS ' + e.tagName; }""")
        print(tag, "link hit-test:", link)
        page.evaluate("window.scrollTo(0,0)"); page.wait_for_timeout(300)
        # scroll each tile to mid-screen, like a visitor
        for i in range(9):
            page.evaluate("(i) => { const s = document.querySelectorAll('#one > section')[i]; const r = s.getBoundingClientRect(); window.scrollBy(0, r.top + r.height/2 - innerHeight/2); }", i)
            page.wait_for_timeout(250)
            a = page.evaluate(STATE)[i]
            page.wait_for_timeout(1500)
            b_ = page.evaluate(STATE)[i]
            page.wait_for_timeout(1900)
            c = page.evaluate(STATE)[i]
            print(tag, a["key"], "at 0.25s: inactive=%s tl-in=%s ready=%s play=%s veil=%s" % (a["inactive"], a["tlin"], a["ready"], a["play"], a["veilOp"]),
                  "| 1.75s: ready=%s play=%s veil=%s" % (b_["ready"], b_["play"], b_["veilOp"]), "| 3.65s: ready=%s play=%s" % (c["ready"], c["play"]))
            if not touch and not rm:
                # hover plays a cycle
                sec = page.locator("#one > section").nth(i)
                sec.hover(position={"x": 60, "y": 60})
                page.wait_for_timeout(900)
                d = page.evaluate(STATE)[i]
                el = sec.locator(".image")
                el.screenshot(path=SHOTS + "live-%s-%s-hover.png" % (tag, d["key"]))
                page.mouse.move(5, 5)
                print(tag, d["key"], "hover 0.9s: play=%s" % d["play"])
            else:
                page.locator("#one > section").nth(i).locator(".image").screenshot(path=SHOTS + "live-%s-%s.png" % (tag, a["key"]))
        print(tag, "errors at end:", errors)
        b.close()

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("all", "desk"): run(1440, 900, False, False, 1, "desk")
    if which in ("all", "phone"): run(390, 844, True, False, 2, "phone")
    if which in ("all", "rm"): run(1440, 900, False, True, 1, "rm")
