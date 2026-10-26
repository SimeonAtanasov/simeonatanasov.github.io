"""Builds every live tile scene for the preview page: CSS plus one <template> per tile.
Each scene is either a redraw (inline SVG replaces the photo), an overlay (a transparent
SVG in the photo's own pixel coordinates sits on top of it) or, for Practical Privacy, an
overlay carrying one cut-out layer of the photo. Only transform and opacity animate.

Scene kinds for the page script:
  entry="css"   the entry runs from CSS on section.pv-in (hold scenes: readiness, matrix,
                 privacy card); the play cycle animates different elements.
  entry="play"  the entry is one play cycle (transient overlays: scanner, AI Act, digests,
                 fines); every element ends invisible, so the photo is the resting state.
  entry="ast"   the Asteroids scene keeps its own hold logic (tl-ready).
  entry="none"  the wave field: a loop, no entry and no play.
Writes tiles_css.txt and tiles_tpl.txt next to this script."""
import math, random, base64, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
TILES = os.path.join(HERE, "assets")
CSS = []      # css chunks
TPL = []      # template elements
META = []     # per-tile metadata for the page script

def scene(key, file, kind, label, entry, cycle, entry_len, autoplay, inner, css, extra_attrs=""):
    """Register one scene. cycle and entry_len in seconds at normal speed."""
    TPL.append(
        '<template class="tl-tpl" data-key="%s" data-for="%s" data-kind="%s" data-label="%s" data-entry="%s" '
        'data-cycle="%s" data-entry-len="%s" data-autoplay="%s"%s><span class="tl-scene tl-%s" data-key="%s">%s</span></template>'
        % (key, file, kind, label, entry, cycle, entry_len, "1" if autoplay else "0", extra_attrs, kind, key, inner))
    CSS.append("/* ---- tile:%s  %s (%s) ---- */\n" % (key, label, kind) + css.strip() + "\n/* ---- /tile:%s ---- */\n" % key)
    META.append(dict(key=key, file=file, kind=kind, label=label))

def S(key):
    """Selector prefixes for a scene: (any state, entry on pv-in, play cycle, ready)."""
    base = '.tl-scene[data-key="%s"]' % key
    return base, 'section.pv-in ' + base, '#one ' + base + '.tl-play', '#one ' + base + '.tl-ready'

# ---------------------------------------------------------------- base
CSS.append("""
/* ===== live tiles: shared layer rules ===== */
.tl-scene { position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: block; pointer-events: none; }
.tl-scene[hidden] { display: none; }
.tl-scene > svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }
.tl-scene svg * { transform-box: fill-box; transform-origin: center; }
.pv-zoom.tl-hidepic > .pv-pic { visibility: hidden; }
/* speed: --tl-k is 1 at normal speed; each scene derives its own durations from it */
.tl-scene { --tl-k: var(--pv-tlk, 1); }
/* reduced motion: every animation jumps to its end state, so entries show their final
   frame, transient overlays stay invisible and loops stand still */
body.pv-rm .tl-scene, body.pv-rm .tl-scene * { animation-duration: 0s !important; animation-delay: 0s !important; }
""")

# ---------------------------------------------------------------- 7. readiness (redraw)
def build_rdy():
    key = "rdy"; W = H = 1200
    rows = [  # (cy, fill end x, colour)
        (177, 937, "g"), (270.5, 806, "y"), (365, 688, "y"), (459, 889, "g"), (553, 605, "o"),
        (647, 770, "y"), (741, 954, "g"), (835, 559, "o"), (929, 842, "g"), (1023, 735, "y")]
    col = {"g": "#abcaa0", "y": "#f2d593", "o": "#e7a767"}
    X0, X1, PX0, PX1, HH = 382, 975, 229, 348, 22
    # hover re-score: row index -> (new end, new colour or None for a plain shrink)
    change = {1: (900, "g"), 4: (760, "y"), 7: (480, None)}
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<defs><linearGradient id="rdy-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070d1b"/>'
         '<stop offset="0.45" stop-color="#101c36"/><stop offset="1" stop-color="#182a4a"/></linearGradient></defs>',
         '<rect width="%d" height="%d" fill="url(#rdy-bg)"/>' % (W, H)]
    for i, (cy, end, c) in enumerate(rows):
        y = cy - HH / 2
        s.append('<g class="rdy-row" style="--i:%d">' % i)
        s.append('<rect x="%d" y="%.1f" width="%d" height="%d" rx="11" fill="#363c4c"/>' % (PX0, y, PX1 - PX0, HH))
        s.append('<rect x="%d" y="%.1f" width="%d" height="%d" rx="11" fill="#2b3549"/>' % (X0, y, X1 - X0, HH))
        s.append('<g class="rdy-in"><rect class="rdy-fill rdy-f%d" x="%d" y="%.1f" width="%d" height="%d" rx="11" fill="%s"/>' % (i, X0, y, end - X0, HH, col[c]))
        if i in change and change[i][1]:
            ne, nc = change[i]
            s.append('<rect class="rdy-alt rdy-a%d" x="%d" y="%.1f" width="%d" height="%d" rx="11" fill="%s" style="--k:%.4f"/>' % (i, X0, y, ne - X0, HH, col[nc], (end - X0) / (ne - X0)))
        s.append('</g></g>')
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(4s * var(--tl-k)); --tl-e: calc(1.5s * var(--tl-k)); }
%(base)s .rdy-row { opacity: 0; }
%(base)s .rdy-in { transform-origin: left center; }
%(base)s .rdy-fill, %(base)s .rdy-alt { transform-origin: left center; }
%(base)s .rdy-alt { opacity: 0; }
%(entry)s .rdy-row { animation: rdy-row calc(var(--tl-e) * 0.3) ease-out calc(var(--i) * var(--tl-e) * 0.06) both; }
%(entry)s .rdy-in { animation: rdy-grow calc(var(--tl-e) * 0.5) cubic-bezier(.2,.7,.2,1) calc(var(--tl-e) * (0.15 + var(--i) * 0.06)) both; }
@keyframes rdy-row { from { opacity: 0; } to { opacity: 1; } }
@keyframes rdy-grow { from { transform: scaleX(0); } to { transform: none; } }
/* hover: three activities re-scored; two improve and change colour, one slips */
%(play)s .rdy-a1, %(play)s .rdy-a4 { animation: rdy-alt var(--tl-t) ease-in-out both; }
%(play)s .rdy-f1, %(play)s .rdy-f4 { animation: rdy-base var(--tl-t) ease-in-out both; }
%(play)s .rdy-f7 { animation: rdy-shrink var(--tl-t) ease-in-out both; }
@keyframes rdy-alt { 0%%, 12%% { opacity: 0; transform: scaleX(var(--k)); } 30%%, 72%% { opacity: 1; transform: none; } 90%%, 100%% { opacity: 0; transform: scaleX(var(--k)); } }
@keyframes rdy-base { 0%%, 12%% { opacity: 1; } 30%%, 72%% { opacity: 0; } 90%%, 100%% { opacity: 1; } }
@keyframes rdy-shrink { 0%%, 18%% { transform: none; } 36%%, 72%% { transform: scaleX(0.845); } 90%%, 100%% { transform: none; } }
""" % dict(base=base, entry=entry, play=play)
    scene(key, "gdpr-readiness.jpg", "redraw", "Readiness", "css", 4, 1.5, True, "".join(s), css)

# ---------------------------------------------------------------- 8. risk matrix (redraw)
def build_rmx():
    key = "rmx"; W = H = 1000
    cols = [(187, 370), (372, 555), (557, 741), (743, 926)]
    rows = [(363, 422), (425, 510), (513, 573), (575, 635)]
    level = [["HIGH", "CRITICAL", "CRITICAL", "CRITICAL"],
             ["MEDIUM", "HIGH", "CRITICAL", "CRITICAL"],
             ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
             ["LOW", "LOW", "MEDIUM", "HIGH"]]
    colour = {"LOW": "#396d69", "MEDIUM": "#766b51", "HIGH": "#805250", "CRITICAL": "#883f51"}
    # cells whose label sits at the top because chips sit under it
    top_label = {(0, 2), (1, 3), (2, 1), (3, 3)}
    chips = [("#1", 632, 403, 26), ("#2", 666, 403, 26), ("#3", 464, 554, 26), ("#4", 835, 616, 26),
             ("#5", 769, 464, 26), ("#6", 801, 464, 26), ("#7", 835, 464, 26), ("#8", 867, 464, 26), ("#9", 900, 464, 26),
             ("#10", 774, 493, 33), ("#11", 814, 493, 33), ("#12", 855, 493, 33), ("#13", 894, 493, 33)]
    LAB = 'class="rmx-t"'
    CEL = 'class="rmx-t rmx-ct"'
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<rect width="%d" height="%d" fill="#2a3860"/>' % (W, H), '<g class="rmx-lab">']
    s.append('<text x="115" y="350" %s>LIKELIHOOD</text>' % LAB)
    for (x0, x1), name in zip(cols, ["LOW", "MEDIUM", "HIGH", "CRITICAL"]):
        s.append('<text x="%d" y="350" %s>%s</text>' % ((x0 + x1) // 2, LAB, name))
    for (y0, y1), name in zip(rows, ["LIKELY", "POSSIBLE", "UNLIKELY", "RARE"]):
        s.append('<text x="181" y="%d" class="rmx-t rmx-r">%s</text>' % ((y0 + y1) // 2 + 5, name))
    s.append('<text x="498" y="658" %s>IMPACT</text></g>' % LAB)
    for ri, (y0, y1) in enumerate(rows):
        for ci, (x0, x1) in enumerate(cols):
            lv = level[ri][ci]
            ty = y0 + 18 if (ri, ci) in top_label else (y0 + y1) // 2 + 5
            s.append('<g class="rmx-cell" style="--r:%d"><g class="rmx-c%d%d"><rect x="%d" y="%d" width="%d" height="%d" rx="3" fill="%s"/>'
                     '<text x="%d" y="%d" %s>%s</text></g></g>' % (ri, ri, ci, x0, y0, x1 - x0, y1 - y0, colour[lv], (x0 + x1) // 2, ty, CEL, lv))
    for i, (t, cx, cy, w) in enumerate(chips):
        s.append('<g class="rmx-chip-in" style="--i:%d"><g class="rmx-chip rmx-k%d"><rect x="%.1f" y="%d" width="%d" height="20" rx="10" fill="#ffffff"/>'
                 '<text x="%d" y="%d" class="rmx-t rmx-kt">%s</text></g></g>'
                 % (i, i + 1, cx - w / 2, cy - 10, w, cx, cy + 4, t))
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(4s * var(--tl-k)); --tl-e: calc(1.6s * var(--tl-k)); }
%(base)s .rmx-t { font-family: "Source Sans Pro", Arial, Helvetica, sans-serif; font-size: 13px; letter-spacing: 1.6px; text-anchor: middle; fill: #9ea5bb; }
%(base)s .rmx-ct { fill: #ece7e4; letter-spacing: 1.2px; }
%(base)s .rmx-r { text-anchor: end; }
%(base)s .rmx-kt { fill: #0b1f4f; font-size: 12px; font-weight: bold; letter-spacing: 0; }
%(base)s .rmx-lab, %(base)s .rmx-cell, %(base)s .rmx-chip-in { opacity: 0; }
%(entry)s .rmx-lab { animation: rmx-fade calc(var(--tl-e) * 0.4) ease-out both; }
%(entry)s .rmx-cell { animation: rmx-cell calc(var(--tl-e) * 0.35) cubic-bezier(.2,.8,.3,1.1) calc(var(--tl-e) * (0.1 + var(--r) * 0.08)) both; }
%(entry)s .rmx-chip-in { animation: rmx-drop calc(var(--tl-e) * 0.3) cubic-bezier(.2,.8,.3,1.2) calc(var(--tl-e) * (0.5 + var(--i) * 0.035)) both; }
@keyframes rmx-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes rmx-cell { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; } }
@keyframes rmx-drop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
/* hover: two risks are moved to other cells and the cells they land in pulse, then they return */
%(play)s .rmx-k3 { animation: rmx-move3 var(--tl-t) cubic-bezier(.4,0,.2,1) both; }
%(play)s .rmx-k4 { animation: rmx-move4 var(--tl-t) cubic-bezier(.4,0,.2,1) both; }
%(play)s .rmx-c22, %(play)s .rmx-c23 { animation: rmx-pulse var(--tl-t) ease-in-out both; }
@keyframes rmx-move3 { 0%%, 12%% { transform: none; } 32%%, 70%% { transform: translate(185px, -6px); } 88%%, 100%% { transform: none; } }
@keyframes rmx-move4 { 0%%, 16%% { transform: none; } 36%%, 70%% { transform: translate(0, -56px); } 90%%, 100%% { transform: none; } }
@keyframes rmx-pulse { 0%%, 28%% { transform: none; } 36%% { transform: scale(1.05); } 46%%, 100%% { transform: none; } }
""" % dict(base=base, entry=entry, play=play)
    scene(key, "risk-matrix-tile.png", "redraw", "Risk matrix", "css", 4, 1.6, True, "".join(s), css)

# ---------------------------------------------------------------- 6. wave field (redraw, replaces pic04)
def build_wav():
    key = "wav"; W, H = 1400, 800; P = 1400  # pattern period = viewBox width, so a shift of one period is seamless
    def wave_path(base, amp1, amp2, k2, step=100):
        # one smooth line over three periods (x from -P to 2P); the copies are shifted left by up to a period
        xs = list(range(-P, 2 * P + 1, step))
        ys = [base + amp1 * math.sin(2 * math.pi * x / P) + amp2 * math.sin(2 * math.pi * x * 2 / P * k2) for x in xs]
        pts = list(zip(xs, ys))
        d = "M%d,%.0f" % pts[0]
        for i in range(len(pts) - 1):        # Catmull-Rom to cubic Bezier
            p0 = pts[max(i - 1, 0)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(i + 2, len(pts) - 1)]
            c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
            c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
            d += " C%d,%.0f %d,%.0f %d,%.0f" % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
        return d
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<rect width="%d" height="%d" fill="#0a183d"/>' % (W, H),
         '<defs><path id="wav-pa" d="%s"/><path id="wav-pb" d="%s"/></defs>' % (wave_path(150, 150, 40, 1.0), wave_path(520, 110, 30, 1.0))]
    s.append('<g class="wav-a" fill="none" stroke="#3646c6" stroke-width="2">')
    for i in range(16):
        s.append('<use href="#wav-pa" transform="translate(%d %d)"/>' % (-i * 46, i * 11))
    s.append('</g><g class="wav-b" fill="none" stroke="#2f3fb4" stroke-width="1.6" opacity="0.7">')
    for i in range(14):
        s.append('<use href="#wav-pb" transform="translate(%d %d)"/>' % (i * 38, i * 10))
    s.append('</g></svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(60s * var(--tl-k)); }
%(base)s .wav-a { animation: wav-left var(--tl-t) linear infinite; }
%(base)s .wav-b { animation: wav-right calc(var(--tl-t) * 1.5) linear infinite; }
@keyframes wav-left { from { transform: translateX(0); } to { transform: translateX(-%(P)dpx); } }
@keyframes wav-right { from { transform: translateX(-%(P)dpx); } to { transform: translateX(0); } }
""" % dict(base=base, P=P)
    scene(key, "pic04.jpg", "redraw", "Wave field", "none", 0, 0, False, "".join(s), css)

# ---------------------------------------------------------------- 1. scanner (overlay)
def build_scn():
    key = "scn"; W, H = 1536, 1024
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<defs><linearGradient id="scn-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34e08a" stop-opacity="0"/>'
         '<stop offset="0.7" stop-color="#34e08a" stop-opacity="0.35"/><stop offset="1" stop-color="#8dffc4" stop-opacity="0.9"/></linearGradient></defs>',
         '<rect class="scn-band" x="128" y="186" width="716" height="70" fill="url(#scn-band)"/>']
    G = 'fill="none" stroke="#5ff79a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"'
    for d in ("M138,560 L138,528 L170,528", "M790,528 L825,528 L825,560", "M138,612 L138,643 L170,643", "M825,612 L825,643 L790,643"):
        s.append('<path class="scn-br" d="%s" %s/>' % (d, G))
    s.append('<rect class="scn-badge" x="406" y="506" width="176" height="54" rx="12" fill="none" stroke="#6dffb0" stroke-width="6"/>')
    for i, cy in enumerate((419, 463, 507, 551, 596)):
        s.append('<circle class="scn-tick" cx="1272" cy="%d" r="11" fill="#5ff7c0" fill-opacity="0.35" stroke="#8dffd6" stroke-width="3" style="--i:%d"/>' % (cy, i))
    s.append('<circle class="scn-exp" cx="1475" cy="562" r="18" fill="none" stroke="#a6ffe0" stroke-width="4"/>')
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(2.8s * var(--tl-k)); }
%(base)s .scn-band, %(base)s .scn-br, %(base)s .scn-badge, %(base)s .scn-tick, %(base)s .scn-exp { opacity: 0; }
%(base)s .scn-br { transform-box: view-box; transform-origin: 480px 585px; }
%(play)s .scn-band { animation: scn-band var(--tl-t) linear both; }
%(play)s .scn-br { animation: scn-br var(--tl-t) cubic-bezier(.2,.8,.2,1) both; }
%(play)s .scn-badge { animation: scn-badge var(--tl-t) ease-out both; }
%(play)s .scn-tick { animation: scn-tick var(--tl-t) ease-out both; animation-delay: calc(var(--i) * var(--tl-t) * 0.045); }
%(play)s .scn-exp { animation: scn-exp var(--tl-t) ease-out both; }
@keyframes scn-band { 0%% { opacity: 0; transform: none; } 6%% { opacity: 1; } 34%% { opacity: 1; transform: translateY(395px); } 40%%, 100%% { opacity: 0; transform: translateY(395px); } }
@keyframes scn-br { 0%%, 30%% { opacity: 0; transform: scale(1.3); } 42%% { opacity: 1; transform: none; } 56%% { opacity: 0.9; } 70%%, 100%% { opacity: 0; transform: none; } }
@keyframes scn-badge { 0%%, 40%% { opacity: 0; transform: scale(0.7); } 50%% { opacity: 1; transform: scale(1.06); } 58%% { transform: none; } 78%%, 100%% { opacity: 0; transform: none; } }
@keyframes scn-tick { 0%%, 54%% { opacity: 0; transform: scale(0.4); } 60%% { opacity: 1; transform: scale(1.15); } 64%% { opacity: 0.9; transform: none; } 78%%, 100%% { opacity: 0; transform: scale(2); } }
@keyframes scn-exp { 0%%, 76%% { opacity: 0; transform: scale(0.8); } 84%% { opacity: 1; transform: scale(1.1); } 100%% { opacity: 0; transform: scale(1.9); } }
""" % dict(base=base, play=play)
    scene(key, "automated-cookie-banner-scanner.jpg", "overlay", "Scanner", "play", 3.3, 0, False, "".join(s), css)

# ---------------------------------------------------------------- 3. AI Act (overlay)
def build_aia():
    key = "aia"; W, H = 1536, 1024
    # the three plates, corners measured on the image: left top/bottom, back, right top/bottom,
    # front top/bottom (each plate is a slab with a visible thickness)
    # (the back corner of each plate is where its two far edges meet, found by fitting those
    # edges on a thin-bright-line image of the photo: x about 690 to 710 on all three)
    # (right ends and bottom rims fitted the same way: the rims sit 30 to 75 px under the
    # top faces, more at the front corner than at the ends, and the right ends are at x 1310)
    # (front corners of the top faces: the brightest fit of the two front edges puts them at
    # y 316, 514 and 720, lower than the highlight at the corner suggests)
    slabs = [dict(lt=(225, 245), lb=(225, 281), bk=(695, 174), rt=(1310, 224), rb=(1310, 255), ft=(912, 316), fb=(912, 352)),
             dict(lt=(230, 410), lb=(230, 454), bk=(712, 315), rt=(1310, 393), rb=(1310, 430), ft=(914, 514), fb=(914, 558)),
             dict(lt=(232, 585), lb=(232, 636), bk=(686, 468), rt=(1310, 566), rb=(1310, 612), ft=(918, 720), fb=(918, 774))]
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<defs><radialGradient id="aia-flare" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#5fc8ff" stop-opacity="0.55"/><stop offset="1" stop-color="#5fc8ff" stop-opacity="0"/></radialGradient></defs>']
    E = 'fill="none" stroke="#bfefff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"'
    P = lambda p: "%d,%d" % p
    for i, q in enumerate(slabs):
        d = ("M%s L%s L%s L%s L%s L%s Z M%s L%s L%s M%s L%s"
             % (P(q["lt"]), P(q["bk"]), P(q["rt"]), P(q["rb"]), P(q["fb"]), P(q["lb"]), P(q["lt"]), P(q["ft"]), P(q["rt"]), P(q["ft"]), P(q["fb"])))
        s.append('<path class="aia-edge" d="%s" %s style="--i:%d"/>' % (d, E, i))
    s.append('<g class="aia-blob"><circle cx="765" cy="18" r="26" fill="#9fe3ff" fill-opacity="0.35"/><circle cx="765" cy="18" r="13" fill="#e4fbff"/></g>')
    s.append('<ellipse class="aia-flare" cx="775" cy="640" rx="540" ry="130" fill="url(#aia-flare)"/>')
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(2.8s * var(--tl-k)); }
%(base)s .aia-edge, %(base)s .aia-blob, %(base)s .aia-flare { opacity: 0; }
/* the energy ball runs down the beam; each plate's edges light as it passes, the circuitry flares at the bottom */
%(play)s .aia-blob { animation: aia-blob var(--tl-t) linear both; }
%(play)s .aia-edge { animation: aia-edge var(--tl-t) ease-in-out both; animation-delay: calc(var(--i) * var(--tl-t) * 0.14); }
%(play)s .aia-flare { animation: aia-flare var(--tl-t) ease-in-out both; }
@keyframes aia-blob { 0%% { opacity: 0; transform: none; } 6%% { opacity: 1; } 62%% { opacity: 1; transform: translateY(700px); } 68%%, 100%% { opacity: 0; transform: translateY(700px); } }
@keyframes aia-edge { 0%%, 20%% { opacity: 0; } 30%% { opacity: 0.9; } 44%%, 100%% { opacity: 0; } }
@keyframes aia-flare { 0%%, 56%% { opacity: 0; transform: scale(0.8); } 66%% { opacity: 1; transform: none; } 92%%, 100%% { opacity: 0; transform: scale(1.05); } }
""" % dict(base=base, play=play)
    scene(key, "practical-ai-act.jpg", "overlay", "AI Act", "play", 3.1, 0, False, "".join(s), css)

# ---------------------------------------------------------------- 4. digests (overlay)
def build_dig():
    key = "dig"; W = H = 1254
    # The orbit line, traced from the image: four visible arcs (left of the AI book, right of
    # the cookie book, left of the GDPR book, right of the GDPR book) joined by the stretches
    # that pass behind the books. One light runs along it at constant speed and is hidden
    # while the line is behind a book. (x, y, visible)
    arc1 = [(387, 301), (377, 310), (343, 332), (332, 344), (325, 356), (322, 369), (324, 378), (334, 393), (341, 399), (356, 406), (372, 412)]
    arc2 = [(866, 451), (881, 459), (900, 470), (919, 483), (928, 495), (929, 505), (929, 517), (924, 528), (908, 540)]
    arc3 = [(392, 706), (379, 712), (354, 724), (335, 736), (326, 743), (314, 752), (302, 764), (295, 776), (291, 788), (292, 801), (296, 811), (303, 821), (317, 832), (330, 841), (345, 848)]
    arc4 = [(870, 889), (888, 898), (913, 910), (936, 922), (952, 934), (964, 948), (967, 958), (966, 968), (963, 982), (958, 991), (948, 1003), (933, 1014), (923, 1021), (905, 1030)]
    pts = ([(p, True) for p in arc1] + [((520, 428), False), ((700, 440), False)] +
           [(p, True) for p in arc2] + [((780, 585), False), ((600, 640), False), ((470, 690), False)] +
           [(p, True) for p in arc3] + [((480, 866), False), ((660, 878), False)] +
           [(p, True) for p in arc4] + [((780, 1055), False), ((640, 1070), False)])
    # Catmull-Rom through the points, sampled finely, then resampled at equal spacing
    P = [p for p, v in pts]; V = [v for p, v in pts]
    fine = []
    for i in range(len(P) - 1):
        p0 = P[max(i - 1, 0)]; p1 = P[i]; p2 = P[i + 1]; p3 = P[min(i + 2, len(P) - 1)]
        for k in range(12):
            t = k / 12.0
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t * t + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t ** 3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t ** 3)
            fine.append((x, y, V[i] and V[i + 1]))
    fine.append((P[-1][0], P[-1][1], False))
    total = sum(math.hypot(fine[i + 1][0] - fine[i][0], fine[i + 1][1] - fine[i][1]) for i in range(len(fine) - 1))
    N = 90; step = total / N; keys = []; acc = 0.0; nxt = 0.0
    for i in range(len(fine) - 1):
        seg = math.hypot(fine[i + 1][0] - fine[i][0], fine[i + 1][1] - fine[i][1])
        while nxt <= acc + seg and len(keys) < N:
            u = (nxt - acc) / seg if seg else 0
            keys.append((fine[i][0] + (fine[i + 1][0] - fine[i][0]) * u, fine[i][1] + (fine[i + 1][1] - fine[i][1]) * u, fine[i][2]))
            nxt += step
        acc += seg
    kf = []
    for j, (x, y, vis) in enumerate(keys):
        pc = 96.0 * j / (N - 1)
        kf.append("%.1f%% { transform: translate(%.0fpx, %.0fpx); opacity: %s; }" % (pc, x, y, "1" if vis else "0"))
    x0, y0 = keys[0][0], keys[0][1]
    kf.append("100%% { transform: translate(%.0fpx, %.0fpx); opacity: 0; }" % (x0, y0))
    print("dig orbit length", round(total), "visible share", round(sum(1 for k in keys if k[2]) / N, 2))
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<g class="dig-light"><circle r="24" fill="#9fd4ff" fill-opacity="0.3"/><circle r="10" fill="#ffffff"/></g>']
    for i, (x, y, w, h, c) in enumerate(((382, 809, 484, 337, "#ffc54a"), (400, 470, 450, 330, "#a46bff"), (415, 66, 391, 390, "#4fd8ff"))):
        s.append('<rect class="dig-glow" x="%d" y="%d" width="%d" height="%d" rx="34" fill="%s" style="--i:%d"/>' % (x, y, w, h, c, i))
    for cy in (462, 790):
        s.append('<circle class="dig-mag" cx="608" cy="%d" r="42" fill="none" stroke="#d6ecff" stroke-width="5"/>' % cy)
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(2.6s * var(--tl-k)); --tl-loop: calc(14s * var(--tl-k)); }
%(base)s .dig-light { transform-box: view-box; transform-origin: 0 0; opacity: 0; animation: dig-orbit var(--tl-loop) linear infinite; }
@keyframes dig-orbit { %(orbit)s }
%(base)s .dig-glow, %(base)s .dig-mag { opacity: 0; }
%(play)s .dig-glow { animation: dig-glow var(--tl-t) ease-in-out both; animation-delay: calc(var(--i) * var(--tl-t) * 0.14); }
%(play)s .dig-mag { animation: dig-mag var(--tl-t) ease-out both; }
@keyframes dig-glow { 0%% { opacity: 0; transform: scale(0.96); } 28%% { opacity: 0.3; transform: none; } 60%%, 100%% { opacity: 0; transform: none; } }
@keyframes dig-mag { 0%%, 50%% { opacity: 0; transform: none; } 58%% { opacity: 0.9; transform: scale(1.05); } 82%%, 100%% { opacity: 0; transform: scale(1.45); } }
""" % dict(base=base, play=play, orbit=" ".join(kf))
    scene(key, "regulatory-digests.png", "overlay", "Digests", "play", 3.4, 0, False, "".join(s), css)

# ---------------------------------------------------------------- 5. fines dashboard (overlay, contained)
def build_pbi():
    key = "pbi"; W, H = 1317, 1075
    # the five bar charts: (x0, bar ends, bar tops, bar height, label room); within each chart
    # the bars grow from the bottom row up
    charts = [
        (725, [900, 833, 832, 826, 820, 806, 787, 785, 775, 753, 748], [385, 407, 430, 453, 476, 499, 522, 545, 568, 590, 613], 17, 52),
        (482, [915, 853, 760, 627, 580, 561, 505, 492, 490, 490], [726, 751, 777, 802, 828, 853, 879, 904, 930, 956], 18, 52),
        (1028, [1118, 1189, 1151, 1240, 1256, 1221, 1184, 1094, 1031], [375, 387, 399, 411, 424, 436, 448, 460, 472], 8, 36),
        (1028, [1117, 1121, 1130, 1201, 1097, 1071, 1041, 1034], [542, 555, 568, 581, 593, 606, 619, 631], 9, 36),
        (1088, [1093, 1092, 1092, 1092, 1092, 1091, 1091, 1091, 1090, 1090, 1090, 1090], [727, 748, 768, 788, 809, 829, 849, 870, 890, 910, 931, 951], 15, 40)]
    bubbles = [(503.5, 414.5, 5.5), (419.2, 453.4, 5.8), (440.1, 456.0, 6.0), (500.3, 466.0, 5.2), (497.0, 486.0, 5.0), (409.4, 495.0, 5.2),
               (491.5, 500.7, 5.5), (314.7, 524.5, 20.0), (346.1, 514.4, 7.2), (391.1, 529.1, 13.2), (465.9, 530.3, 6.0), (417.1, 540.3, 7.2),
               (444.6, 552.1, 5.8), (438.0, 570.0, 6.5), (373.1, 578.1, 12.0), (496.6, 583.1, 5.2), (427.0, 602.5, 9.2), (339.6, 625.9, 7.8),
               (481.7, 636.0, 6.2), (439.8, 657.8, 5.0), (543.6, 664.0, 5.2)]
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' % (W, H)]
    for (x0, ends, ys, h, room) in charts:
        n = len(ends)
        for i, (e, y) in enumerate(zip(ends, ys)):
            s.append('<rect class="pbi-mask" x="%d" y="%d" width="%d" height="%d" fill="#ffffff"/>' % (x0, y - 1, e - x0 + room, h + 2))
            s.append('<rect class="pbi-bar" x="%d" y="%d" width="%d" height="%d" fill="#118dff" style="--d:%.3f"/>' % (x0, y, e - x0, h, (n - 1 - i) / (n - 1)))
    for i, (cx, cy, r) in enumerate(bubbles):
        s.append('<circle class="pbi-ping" cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#118dff" stroke-width="2.5" style="--i:%d"/>' % (cx, cy, r + 2, i))
    s.append('<g class="pbi-kpi"><rect x="36" y="758" width="222" height="56" fill="#0d6abf"/>'
             '<text class="pbi-num" x="146" y="803" fill="#ffffff" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="46" font-weight="bold" text-anchor="middle">&#8364; 0.00bn</text></g>')
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(3s * var(--tl-k)); }
%(base)s .pbi-mask, %(base)s .pbi-bar, %(base)s .pbi-ping, %(base)s .pbi-kpi { opacity: 0; }
%(base)s .pbi-bar { transform-origin: left center; }
%(play)s .pbi-mask { animation: pbi-mask var(--tl-t) linear both; }
%(play)s .pbi-bar { animation: pbi-bar var(--tl-t) cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--d) * var(--tl-t) * 0.3); }
%(play)s .pbi-ping { animation: pbi-ping var(--tl-t) ease-out both; animation-delay: calc(var(--i) * var(--tl-t) * 0.02); }
%(play)s .pbi-kpi { animation: pbi-kpi var(--tl-t) linear both; }
@keyframes pbi-mask { 0%%, 70%% { opacity: 1; } 84%%, 100%% { opacity: 0; } }
@keyframes pbi-bar { 0%%, 4%% { opacity: 1; transform: scaleX(0); } 26%%, 70%% { opacity: 1; transform: none; } 84%%, 100%% { opacity: 0; transform: none; } }
@keyframes pbi-ping { 0%%, 20%% { opacity: 0; transform: none; } 24%% { opacity: 0.9; transform: none; } 50%%, 100%% { opacity: 0; transform: scale(2.6); } }
@keyframes pbi-kpi { 0%%, 72%% { opacity: 1; } 86%%, 100%% { opacity: 0; } }
""" % dict(base=base, play=play)
    scene(key, "power-bi-tile.png", "overlay", "Fines dashboard", "play", 3.6, 0, False, "".join(s), css)

# ---------------------------------------------------------------- 2. practical privacy (overlay + cut-out)
def build_pp():
    key = "pp"; W, H = 1536, 1024
    x0, y0, x1, y1 = 640, 105, 975, 373
    card = base64.b64encode(open(os.path.join(TILES, "pp_card.webp"), "rb").read()).decode()
    patch = base64.b64encode(open(os.path.join(TILES, "pp_patch.webp"), "rb").read()).decode()
    # the fifteen cards of the stack: left edge x, measured; tops and bottoms follow the perspective lines
    edges = [424, 453, 479, 506, 533, 561, 589, 618, 647, 677, 707, 738, 770, 803, 843]
    top = lambda x: 331 + 0.37 * (x - 424)
    bot = lambda x: 506 + 0.425 * (x - 424)
    s = ['<svg viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' % (W, H),
         '<image x="%d" y="%d" width="%d" height="%d" href="data:image/webp;base64,%s"/>' % (x0, y0, x1 - x0, y1 - y0, patch),
         '<g class="pp-blinks">']
    n = len(edges)
    for i, x in enumerate(edges):
        xn = edges[i + 1] if i + 1 < n else 1122          # the front card's face runs to its right edge
        tn, bn = (top(xn), bot(xn)) if i + 1 < n else (420, 690)
        order = n - 1 - i                                   # 0 for the front card, so the wave runs front to back
        s.append('<g class="pp-blink" style="--i:%d"><polygon points="%d,%.0f %d,%.0f %d,%.0f %d,%.0f" fill="#7fe0ff" fill-opacity="0.12"/>'
                 '<line x1="%d" y1="%.0f" x2="%d" y2="%.0f" stroke="#e6fdff" stroke-width="7" stroke-linecap="round"/></g>'
                 % (order, x, top(x), xn, tn, xn, bn, x, bot(x), x, top(x) + 4, x, bot(x) - 4))
    s.append('</g>')
    s.append('<g class="pp-in"><g class="pp-float"><g class="pp-lift"><image x="%d" y="%d" width="%d" height="%d" href="data:image/webp;base64,%s"/></g></g></g>' % (x0, y0, x1 - x0, y1 - y0, card))
    s.append('</svg>')
    base, entry, play, ready = S(key)
    css = """
%(base)s { --tl-t: calc(2.4s * var(--tl-k)); --tl-e: calc(1.4s * var(--tl-k)); --tl-loop: calc(6s * var(--tl-k)); }
%(base)s .pp-in { opacity: 0; }
%(entry)s .pp-in { animation: pp-rise var(--tl-e) cubic-bezier(.2,.8,.2,1) both; }
%(base)s .pp-float { animation: pp-float calc(6s * var(--tl-k)) ease-in-out infinite; }
@keyframes pp-rise { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: none; } }
@keyframes pp-float { 0%%, 100%% { transform: translateY(0); } 50%% { transform: translateY(-3px); } }
/* the stack blinks gently, one card after another from the front card to the back, then rests */
%(base)s .pp-blinks { mix-blend-mode: screen; }
%(base)s .pp-blink { opacity: 0; animation: pp-blink var(--tl-loop) ease-in-out infinite; animation-delay: calc(var(--i) * var(--tl-loop) * 0.025); }
@keyframes pp-blink { 0%% { opacity: 0; } 4.5%% { opacity: 0.75; } 10%%, 100%% { opacity: 0; } }
/* hover: the lifted card rises a little further and settles */
%(play)s .pp-lift { animation: pp-lift var(--tl-t) ease-in-out both; }
@keyframes pp-lift { 0%% { transform: none; } 30%%, 60%% { transform: translateY(-12px); } 100%% { transform: none; } }
""" % dict(base=base, entry=entry, play=play)
    scene(key, "practical-privacy.jpg", "overlay", "Privacy card", "css", 2.4, 1.6, False, "".join(s), css)

# ---------------------------------------------------------------- 9. asteroids (redraw, ported from ast_build.py)
def build_ast():
    src = open(os.path.join(HERE, "ast_build.py"), encoding="utf-8").read()
    geom = src[:src.index('CSS = """')]
    ns = {}
    exec(geom, ns)
    SVG = ns["SVG"]; RULES = ns["RULES"]; KF = ns["KF"]; HITS = ns["HITS"]
    inner = SVG.replace('<svg class="ast"', '<svg class="ast"')
    # the HUD lives outside the svg, as before
    base, entry, play, ready = S("ast")
    rules = "\n".join(RULES).replace("#one .ast-scene.ast-play", play).replace("var(--ast-t)", "var(--tl-t)")
    assert "--ast-" not in rules and "--ast-" not in "".join(KF)
    css = """
%(base)s { --tl-t: calc(5.5s * var(--tl-k)); --tl-e: calc(1.6s * var(--tl-k)); background: #060808; }
%(base)s .ast circle { transform-box: fill-box; transform-origin: center; }
%(base)s .ast .ast-ship, %(base)s .ast .ast-ship-rot { transform-box: view-box; transform-origin: 0 0; }
%(base)s .ast-ship-rot { transform: rotate(-66.9deg); }
%(base)s .ast-star { fill: #fff; opacity: 0.75; }
%(base)s .ast-shot { opacity: 0; }
%(base)s .ast-hud { position: absolute; left: 5%%; top: 4%%; display: flex; flex-direction: column; color: #fff;
	font: 12px/1.45 Arial, Helvetica, sans-serif; letter-spacing: 0; text-transform: none; pointer-events: none; }
%(base)s .ast-hud b { font-weight: normal; display: inline-block; }
/* entry, once */
%(base)s .ast-rock, %(base)s .ast-ship, %(base)s .ast-trail, %(base)s .ast-hud, %(base)s .ast-stars { opacity: 0; }
%(entry)s .ast-stars { animation: ast-fade calc(var(--tl-e) * 0.6) ease-out both; }
%(entry)s .ast-rock { animation: ast-rock-in calc(var(--tl-e) * 0.55) cubic-bezier(.2,.8,.3,1.2) calc(var(--e) * var(--tl-e) * 0.07) both; }
%(entry)s .ast-ship { animation: ast-ship-in calc(var(--tl-e) * 0.6) cubic-bezier(.2,.8,.2,1) calc(var(--tl-e) * 0.3) both; }
%(entry)s .ast-trail { animation: ast-fade calc(var(--tl-e) * 0.12) linear calc(var(--tl-e) * (0.72 + var(--e) * 0.07)) both; }
%(entry)s .ast-hud { animation: ast-fade calc(var(--tl-e) * 0.3) ease-out calc(var(--tl-e) * 1.05) both; }
@keyframes ast-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ast-rock-in { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes ast-ship-in { from { opacity: 0; transform: translate(-70px, 60px); } to { opacity: 1; transform: none; } }
/* after the entry: hold the opening frame, so ending a play cycle does not restart the entry */
%(ready)s .ast-rock, %(ready)s .ast-ship, %(ready)s .ast-trail, %(ready)s .ast-hud, %(ready)s .ast-stars { animation: none; opacity: 1; }
/* play cycle: the game's own rules, worked out by the build script */
%(play)s .ast-ship-rot { animation: ast-aim var(--tl-t) linear both; }
%(play)s .ast-star:nth-child(3n) { animation: ast-twinkle calc(var(--tl-t) * 0.5) ease-in-out calc(var(--d) * 0.4s) 2 alternate; }
@keyframes ast-twinkle { from { opacity: 0.75; } to { opacity: 0.15; } }
""" % dict(base=base, entry=entry, play=play, ready=ready) + rules + "\n" + "\n".join(KF) + "\n"
    scene("ast", "pic02.jpg", "redraw", "Asteroids", "ast", 5.5, 1.6, True, inner, css,
          ' data-hits="' + ",".join("%.4f" % (h / 100) for h in HITS) + '"')

for b in (build_scn, build_pp, build_aia, build_dig, build_pbi, build_wav, build_rdy, build_rmx, build_ast):
    b()
css_all = "\n".join(CSS)
tpl_all = "\n".join(TPL)
for chunk in (css_all, tpl_all):
    assert "\u2014" not in chunk, "em dash"
open(os.path.join(HERE, "tiles_css.txt"), "w", encoding="utf-8").write(css_all)
open(os.path.join(HERE, "tiles_tpl.txt"), "w", encoding="utf-8").write(tpl_all)
open(os.path.join(HERE, "tiles_meta.json"), "w", encoding="utf-8").write(json.dumps(META))
for m, t, c in zip(META, TPL, CSS):
    print("%-5s %-16s svg %6d  css %5d" % (m["key"], m["label"], len(t.encode()), len(c.encode())))
print("total css", len(css_all.encode()), "tpl", len(tpl_all.encode()))
