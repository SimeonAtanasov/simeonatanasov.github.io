"""HOME-01 edits to the root README.md (read-modify-write, exact anchors)."""
import sys, hashlib
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
assert "\r" not in s
def rep(old, new):
    global s
    assert s.count(old) == 1, old[:60]
    s = s.replace(old, new)
rep("| `index.html` | Home and portfolio. The Career & Education section is maintained by hand and is off limits to any automated edit. Sidebar portfolio menu: `assets/css/home-extra.css` and `assets/js/portfolio-menu.js` (behaviour spec below). |",
    "| `index.html` | Home and portfolio. The Career & Education section is maintained by hand and is off limits to any automated edit. Sidebar portfolio menu: `assets/css/home-extra.css` and `assets/js/portfolio-menu.js` (behaviour spec below). Since 26 October 2026 (HOME-01) the nine portfolio tiles carry a small animated scene over or in place of their image: `assets/css/home-tiles.css` and `assets/js/home-tiles.js`, loaded from the head and used by no other page. Only transform and opacity animate; the scene enters when the tile lights up, plays again on hover or focus (on a phone, when the tile reaches mid-screen), and stands still under `prefers-reduced-motion`. Both files are generated: see `Claude outputs/tile-animation-build/`. |")
rep("| `tool-baselines/` | Before-images of files changed in existing tools,",
    "| `tile-animation-build/` | Builds the home page tile scenes (HOME-01, 26 October 2026) and the preview page `index-image-animations-preview.html` one level up, which shows the same nine tiles with switchable whole-tile options A to H and a Live switch per tile. `tiles_build.py` draws the nine scenes (every coordinate measured on the image it overlays), `live_build.py` writes `assets/css/home-tiles.css` and `assets/js/home-tiles.js`, `apply_home_tiles.py` wires them into `index.html`, `splice2.py` and `build.py` make the preview, `test_live.py` and `capture.py` are the Playwright checks, `pp_cutout.py` cuts the Practical Privacy card out of its photo. README inside. | You want to change a tile's animation, add one for a new tile, or rebuild the preview. |\n| `tool-baselines/` | Before-images of files changed in existing tools,")
rep("- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.",
    "- The home tile scenes (`assets/css/home-tiles.css`, `assets/js/home-tiles.js`) load on the home\n  page only, so a change to them needs no `VERSION` bump for the rest of the site, but the\n  service worker serves them stale while revalidate like any asset: a returning visitor sees\n  the previous scenes for one more visit unless `VERSION` is bumped. Edit the generator in\n  `Claude outputs/tile-animation-build/`, not the two files.\n- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.")
assert "\u2014" not in s
open(p, "w", encoding="utf-8", newline="\n").write(s)
print("readme", len(s.encode()), hashlib.md5(s.encode()).hexdigest())
