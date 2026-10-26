"""Live Asteroids tile: SVG + CSS for the preview, spliced into template.html.
Geometry measured from pic02.jpg (438 x 438); ship path from my-asteroids-game.js.
Hits follow the game: circleCollision (sum of radii) removes the asteroid and
that one projectile at once, +10 points, no explosion; other projectiles fly on
until they leave the screen."""
import math, random
random.seed(7)
X0, W, H = -231, 900, 438
PURPLE = "#5c00cc"
BR = 3.8                                   # bullet radius: the game's 5 at the photo's 0.757 scale
SPEED = 12.0                               # bullet travel, world units per 1% of the cycle
# measured from pic02.jpg (blob centroids and areas)
rocks = [(142.0,85.1,40.2),(267.4,78.2,31.5),(263.6,178.8,28.4),(219.0,218.4,19.9),(21.8,302.3,28.4),(177.0,391.3,30.5),(348.9,397.4,33.4),
         (-150,120,34),(-95,365,26),(-205,250,18),(520,92,38),(600,262,24),(470,300,16),(575,405,27)]
stars=[(round(random.uniform(X0+4,X0+W-4),1),round(random.uniform(4,H-4),1),random.choice([0.7,0.8,1,1,1.2,1.5]),round(random.uniform(0,2.5),2)) for _ in range(90)]

# Ship as the game draws it: nose 30 ahead of the centre, scaled to the photo
# (the nose measures 22.7 from the centre, so the scale is 0.757).
SC=(159.1,273.9); S=0.757; NOSE=30*S; IDLE=-66.9
# The trail as photographed, oldest first. In the game a projectile starts at
# the nose and moves along the ship's heading at the moment it was fired, so
# each one sits on its own ray from the ship's centre; the curve of the trail
# shows the ship was turning while it fired.
trail=[(180.1,149.8,"#ff0009"),(182.3,171.5,"#24a907"),(182.0,192.5,"#1a38fa"),(179.3,212.7,"#fa0704"),(174.7,231.8,"#20ac00")]

def contact(px,py,v,rock):
    cx,cy,r=rock; dx,dy=cx-px,cy-py; perp=abs(dx*v[1]-dy*v[0]); along=dx*v[0]+dy*v[1]; R=r+BR
    if perp>R or along<0: return None
    return max(0.0, along-math.sqrt(R*R-perp*perp))
def exit_dist(px,py,v):
    ds=[]
    if v[1]<0: ds.append((py+10)/-v[1])
    if v[1]>0: ds.append((H+10-py)/v[1])
    if v[0]<0: ds.append((px-X0+10)/-v[0])
    if v[0]>0: ds.append((X0+W+10-px)/v[0])
    return min(ds)

bullets=[]
A0=2.0
for k,(x,y,c) in enumerate(trail):
    dx,dy=x-SC[0],y-SC[1]; L=math.hypot(dx,dy)
    bullets.append(dict(t0=A0,x=x,y=y,v=(dx/L,dy/L),c=c,id=f"t{k}",deg=math.degrees(math.atan2(dy,dx))))
# Phase B: the ship turns to face the small asteroid and fires three shots.
SMALL=3
AIM=math.degrees(math.atan2(rocks[SMALL][1]-SC[1], rocks[SMALL][0]-SC[0]))
TURN=(22.0,25.0); BACK=(84.0,88.0)
av=(math.cos(math.radians(AIM)),math.sin(math.radians(AIM)))
for k,(st,c) in enumerate(zip([27.0,31.0,35.0],["#ff0009","#24a907","#1a38fa"])):
    bullets.append(dict(t0=st,x=SC[0]+av[0]*NOSE,y=SC[1]+av[1]*NOSE,v=av,c=c,id=f"s{k}",deg=AIM))

# Play it out with the game's rule: the earliest contact removes the asteroid
# and that bullet, +10; repeat until no live bullet meets a live asteroid.
gone={}
for bl in bullets: bl["end"]=None
while True:
    best=None
    for bi,bl in enumerate(bullets):
        if bl["end"] is not None: continue
        for ri,rk in enumerate(rocks):
            if ri in gone: continue
            d=contact(bl["x"],bl["y"],bl["v"],rk)
            if d is None: continue
            t=bl["t0"]+d/SPEED
            if best is None or t<best[0]: best=(t,bi,ri,d)
    if best is None: break
    t,bi,ri,d=best
    bullets[bi].update(end=t,dist=d,hit=ri); gone[ri]=t
for bl in bullets:
    if bl["end"] is None:
        bl["dist"]=exit_dist(bl["x"],bl["y"],bl["v"]); bl["end"]=bl["t0"]+bl["dist"]/SPEED; bl["hit"]=None
for bl in bullets: print(bl["id"], round(bl["deg"],1), "hits", bl["hit"], "at", round(bl["end"],1))
HITS=sorted(gone.values())
print("hits at %", [round(h,1) for h in HITS], "rocks", {k: round(v,1) for k,v in gone.items()})

KF=[]; RULES=[]
for bl in bullets:
    dx,dy=round(bl["v"][0]*bl["dist"],1),round(bl["v"][1]*bl["dist"],1); st=bl["t0"]; en=bl["end"]
    if bl["id"].startswith("t"):
        KF.append(f"@keyframes ast-b-{bl['id']} {{ 0%, {st}% {{ opacity: 1; transform: none; }} {en:.1f}% {{ opacity: 1; transform: translate({dx}px, {dy}px); }} "
                  f"{en+0.1:.1f}%, 86% {{ opacity: 0; transform: translate({dx}px, {dy}px); }} 87% {{ opacity: 0; transform: none; }} 100% {{ opacity: 1; transform: none; }} }}")
    else:
        KF.append(f"@keyframes ast-b-{bl['id']} {{ 0%, {st-0.1:.1f}% {{ opacity: 0; transform: none; }} {st}% {{ opacity: 1; transform: none; }} "
                  f"{en:.1f}% {{ opacity: 1; transform: translate({dx}px, {dy}px); }} {en+0.1:.1f}%, 100% {{ opacity: 0; transform: translate({dx}px, {dy}px); }} }}")
    RULES.append(f"#one .ast-scene.ast-play .ast-{bl['id']} {{ animation: ast-b-{bl['id']} var(--ast-t) linear both; }}")
for ri,t in gone.items():
    KF.append(f"@keyframes ast-gone-{ri} {{ 0%, {t:.1f}% {{ opacity: 1; transform: none; }} {t+0.1:.1f}%, 84% {{ opacity: 0; transform: scale(0.4); }} 94%, 100% {{ opacity: 1; transform: none; }} }}")
    RULES.append(f"#one .ast-scene.ast-play .ast-r{ri} {{ animation: ast-gone-{ri} var(--ast-t) linear both; }}")
KF.append(f"@keyframes ast-aim {{ 0%, {TURN[0]}% {{ transform: rotate({IDLE}deg); }} {TURN[1]}%, {BACK[0]}% {{ transform: rotate({AIM:.1f}deg); }} {BACK[1]}%, 100% {{ transform: rotate({IDLE}deg); }} }}")

svg=[f'<svg class="ast" viewBox="{X0} 0 {W} {H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">',
     f'<rect x="{X0}" y="0" width="{W}" height="{H}" fill="#060808"/>','<g class="ast-stars">']
svg+= [f'<circle class="ast-star" cx="{x}" cy="{y}" r="{r}" style="--d:{dl}"/>' for (x,y,r,dl) in stars]
svg.append('</g>')
for i,(x,y,r) in enumerate(rocks):
    svg.append(f'<circle class="ast-rock ast-r{i}" cx="{x}" cy="{y}" r="{r}" fill="{PURPLE}" style="--e:{i%7}"/>')
for bl in bullets:
    cls="ast-trail" if bl["id"].startswith("t") else "ast-shot"
    style=f' style="--e:{4-int(bl["id"][1])}"' if cls=="ast-trail" else ""
    svg.append(f'<circle class="{cls} ast-{bl["id"]}" cx="{bl["x"]:.1f}" cy="{bl["y"]:.1f}" r="{BR}" fill="{bl["c"]}"{style}/>')
svg.append(f'<g transform="translate({SC[0]} {SC[1]}) scale({S})"><g class="ast-ship"><g class="ast-ship-rot"><circle r="5" fill="#ff0808"/>'
           '<path d="M30 0 L-10 -10 L-7 0 L-10 10 Z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></g></g></g>')
svg.append('</svg><span class="ast-hud"><span>Score: <b class="ast-score">90</b></span><span>Highest Score: 390</span></span>')
SVG="".join(svg)

CSS = """
/* opt:AST  Live Asteroids tile: an inline vector redraw of pic02.jpg whose
   pieces move. Transform and opacity only. Entry plays once when the tile
   first scrolls into view (.pv-in) and runs straight into one play cycle;
   after that the cycle runs on hover or focus, and on touch screens once
   each time the tile reaches mid-screen. Hits work as in the game: the first
   contact removes the asteroid and that bullet at once, +10, no explosion,
   and the other bullets fly on until they leave the screen. Every bullet flies
   straight out along the heading the ship had when it fired it, so each trail
   bullet keeps to its own ray from the ship's centre. Paths and hit times are
   worked out by the build script from the game's rules, not placed by hand. */
.ast-scene { position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: block; background: #060808; }
.ast { position: absolute; width: 100%; height: 100%; display: block; }
.ast circle { transform-box: fill-box; transform-origin: center; }
.ast .ast-ship, .ast .ast-ship-rot { transform-box: view-box; transform-origin: 0 0; }
.ast-ship-rot { transform: rotate(-66.9deg); }
.ast-star { fill: #fff; opacity: 0.75; }
.ast-shot { opacity: 0; }
.ast-hud { position: absolute; left: 5%; top: 4%; display: flex; flex-direction: column; color: #fff;
	font: 12px/1.45 Arial, Helvetica, sans-serif; letter-spacing: 0; text-transform: none; pointer-events: none; }
.ast-hud b { font-weight: normal; display: inline-block; }

/* entry, once */
.ast-scene .ast-rock, .ast-scene .ast-ship, .ast-scene .ast-trail, .ast-scene .ast-hud, .ast-scene .ast-stars { opacity: 0; }
section.pv-in .ast-scene .ast-stars { animation: ast-fade calc(var(--ast-e) * 0.6) ease-out both; }
section.pv-in .ast-scene .ast-rock { animation: ast-rock-in calc(var(--ast-e) * 0.55) cubic-bezier(.2,.8,.3,1.2) calc(var(--e) * var(--ast-e) * 0.07) both; }
section.pv-in .ast-scene .ast-ship { animation: ast-ship-in calc(var(--ast-e) * 0.6) cubic-bezier(.2,.8,.2,1) calc(var(--ast-e) * 0.3) both; }
section.pv-in .ast-scene .ast-trail { animation: ast-fade calc(var(--ast-e) * 0.12) linear calc(var(--ast-e) * (0.72 + var(--e) * 0.07)) both; }
section.pv-in .ast-scene .ast-hud { animation: ast-fade calc(var(--ast-e) * 0.3) ease-out calc(var(--ast-e) * 1.05) both; }
@keyframes ast-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ast-rock-in { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
@keyframes ast-ship-in { from { opacity: 0; transform: translate(-70px, 60px); } to { opacity: 1; transform: none; } }

/* after the entry: hold the opening frame, so ending a play cycle does not restart the entry */
#one .ast-scene.ast-ready .ast-rock, #one .ast-scene.ast-ready .ast-ship, #one .ast-scene.ast-ready .ast-trail,
#one .ast-scene.ast-ready .ast-hud, #one .ast-scene.ast-ready .ast-stars { animation: none; opacity: 1; }

/* play cycle */
#one .ast-scene.ast-play .ast-ship-rot { animation: ast-aim var(--ast-t) linear both; }
#one .ast-scene.ast-play .ast-star:nth-child(3n) { animation: ast-twinkle calc(var(--ast-t) * 0.5) ease-in-out calc(var(--d) * 0.4s) 2 alternate; }
@keyframes ast-twinkle { from { opacity: 0.75; } to { opacity: 0.15; } }
""" + "\n".join(RULES) + "\n" + "\n".join(KF) + """

/* reduced motion: the still frame, no entry and no play */
body.pv-rm .ast-scene *, body.pv-rm .ast-scene { animation: none !important; }
body.pv-rm .ast-scene .ast-rock, body.pv-rm .ast-scene .ast-ship, body.pv-rm .ast-scene .ast-trail,
body.pv-rm .ast-scene .ast-hud, body.pv-rm .ast-scene .ast-stars { opacity: 1; }
body.pv-rm .ast-scene .ast-star { opacity: 0.75; }
/* preview only: the photo toggle */
body:not(.pv-live) .ast-scene { display: none; }
body.pv-live #one > section .pv-zoom:has(.ast-scene) > .pv-pic { visibility: hidden; }
/* /opt:AST */
"""
TPL = '<template data-hits="' + ",".join(f"{h/100:.4f}" for h in HITS) + '" id="ast-template"><span class="ast-scene">' + SVG + '</span></template>'
assert "\u2014" not in CSS + TPL
open("ast_parts.txt","w",encoding="utf-8").write(CSS + "\n@@SPLIT@@\n" + TPL)
print("svg bytes", len(SVG.encode()), "css bytes", len(CSS.encode()))
