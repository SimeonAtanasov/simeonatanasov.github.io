# Tile animation build folder

Builds two things: `Claude outputs/index-image-animations-preview.html`, the standalone
page that shows the home page spotlights with switchable animations (the eight whole-tile
options A to H and one live scene per tile, Live row in the control bar), and, since
26 October 2026 (HOME-01), the live scenes on the home page itself:
`assets/css/home-tiles.css`, `assets/js/home-tiles.js` and the two lines in the head of
`index.html` that load them. Design notes: `claude/tile-animation-proposals.md`; the
change record: `claude/tool-change-log.md`, entry HOME-01.

Files
- `template.html`: the preview page without the live scenes (controls, options A to H,
  layer stack, page script). `<!--SPOTLIGHTS-->` marks where section #one from
  `index.html` goes.
- `tiles_build.py`: draws the nine live scenes (SVG plus CSS) and writes `tiles_css.txt`,
  `tiles_tpl.txt` and `tiles_meta.json`. Every coordinate was measured on the image it
  overlays. Imports the Asteroids geometry from `ast_build.py`. This is the master copy of
  every scene: the preview and the home page are both generated from its output.
- `ast_build.py`: the Asteroids scene geometry (rocks, trail, ship, hit times worked out with
  the game's own rules). Its own CSS section is superseded by `tiles_build.py`.
- `splice2.py`: `template.html` plus the three tiles files -> `template2.html` (preview).
- `build.py`: `template2.html` plus `index.html` -> `index-image-animations-preview.html`
  (rewrites image and link paths one level up, refuses em dashes).
- `live_build.py`: the three tiles files -> `out/assets/css/home-tiles.css` and
  `out/assets/js/home-tiles.js` (the home page runtime with the nine scenes embedded as
  strings). Entry selector `section.tl-in`, speed fixed at normal, reduced motion through
  the media query.
- `apply_home_tiles.py`: adds the stylesheet link and the deferred script to the head of
  `index.html`. Refuses any `index.html` whose md5 it was not written for, and asserts that
  everything from `<section id="two"` onwards is byte-identical before writing.
- `test_live.py`: Playwright smoke test of the wired home page (desktop, phone with touch,
  reduced motion): scenes attached under the veil, entries in step with the veil, hover and
  touch play, chips and links still clickable.
- `pp_cutout.py`: makes `assets/pp_card.webp` and `assets/pp_patch.webp` from
  `images/practical-privacy.jpg`; both are embedded in the scenes as data URIs.
- `capture.py`: Playwright capture of entry and hover frames per tile, used for the checks.

Rebuild, from this folder:

    python3 pp_cutout.py ../../images/practical-privacy.jpg   # only if the photo changed
    python3 tiles_build.py
    python3 splice2.py
    python3 build.py ../../index.html
    cp index-image-animations-preview.html ..
    python3 live_build.py
    cp out/assets/css/home-tiles.css ../../assets/css/
    cp out/assets/js/home-tiles.js ../../assets/js/

`index.html` needs `apply_home_tiles.py` only once (it is already applied); after a change
to a scene only the two asset files change. The service worker serves them stale while
revalidate, so a returning visitor runs the previous copy for one more visit; bump
`VERSION` in `sw.js` if that matters for the change.

Checking: serve the repo root with `python3 -m http.server 8765` and open
`Claude outputs/index-image-animations-preview.html?live=all` (the page also opens straight
from disk) or `index.html` for the home page. `capture.py <shots dir> 1440 scn,pp` writes
frame strips for the named tiles; `test_live.py` (edit `URL` first) runs the home page
checks.
