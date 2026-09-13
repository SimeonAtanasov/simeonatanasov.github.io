# SimeonAtanasov.github.io

Personal portfolio website for Simeon Atanasov, published through GitHub Pages and available at `https://www.simeonatanasov.com`.

## Main Pages

- `index.html`: Homepage and portfolio
- `cookie-banner-scanner.html`: Cookie Banner Scanner frontend
- `privacy-ai-assessment.html`: Privacy and AI assessment tools
- `power-bi.html`: GDPR fines dashboard
- `risk-matrix-original.html`: Interactive risk matrix
- `my-asteroids-game.html`: Asteroids game

## Homepage Portfolio Order

The intended portfolio order is:

1. Cookie Banner Scanner
2. Practical Privacy and AI Act Advice
3. GDPR Fines in Europe Dashboard
4. Privacy and AI Risk Assessments
5. Interactive Risk Matrix
6. Asteroids Game

## Portfolio Menu

The homepage sidebar includes a `Portfolio` item with a project submenu in `index.html`, styled in `assets/css/home-extra.css` and driven by `assets/js/portfolio-menu.js`.

### Required Behavior

- On wide desktop screens (`>=1281px`) where the left sidebar is visible, hovering over `Portfolio` must show a small floating context menu to the right of the sidebar.
- On medium/tablet screens (`737px-1280px`), where the sidebar collapses into a horizontal top bar, hovering over `Portfolio` must show the same menu as a dropdown below the item instead.
- The menu must show all six project links as visible stacked rows.
- The menu must remain visible while the pointer moves from `Portfolio` into the floating menu.
- Each item must navigate to its corresponding project page.
- The menu must not overlap the homepage content, cover the intro section, change page spacing, or create horizontal page scrolling.
- The Portfolio text must remain a plain menu item. Do not add an arrow, a `Projects` button, or an inline expanding list.
- On mobile layouts (`<=736px`, where `#sidebar` is hidden entirely), preserve the existing responsive navigation. Do not show a clipped or overlapping hover menu.
- Regardless of breakpoint, the spacing between `Portfolio` and the other sidebar/top-bar nav items must match the site's existing nav item spacing - no touching/zero-gap items.

### Current State (resolved)

`#sidebar` is a fixed column with `overflow-y: auto`, which by spec forces `overflow-x` to compute as `auto` even when it's set to `visible` - so a submenu nested inside the sidebar could never truly escape its right edge; it was always clipped.

The fix moves `.portfolio-submenu` out of the sidebar and appends it to `<body>` at load time (`assets/js/portfolio-menu.js`), then floats it with `position: fixed` using coordinates computed from the sidebar's and the `Portfolio` item's own bounding boxes. This sidesteps the clipping entirely instead of fighting it with `overflow` overrides. The behavior is gated in both JS and CSS to two ranges: `>=1281px` (wide desktop, flyout to the right of the sidebar) and `737px-1280px` (medium/tablet, dropdown below the item, matching the horizontal top-bar layout at that width). Below `736px` the sidebar is hidden entirely and the menu stays off, untouched. Verified with headless-browser tests across all of these widths: the menu shows all six links, stays open when the pointer moves from `Portfolio` into it, closes when the pointer leaves, links navigate correctly, and no horizontal scrolling is introduced.

A related bug was also fixed: `#sidebar .portfolio-menu` had a blanket `margin: 0` in `home-extra.css`, which collapsed the gap between `Intro` and `Portfolio` to 0px on the medium/tablet top-bar layout (they touched with no space between them). The `margin: 0` was removed, leaving only the `position: relative` that rule actually needed; spacing now comes from the site's normal nav-item margin at every breakpoint.

## Local Preview

Run a static server in this folder:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

Commit and push this repository with GitHub Desktop or Git. GitHub Pages publishes frontend changes automatically. The cookie scanner backend is a separate project, `scan-banner-api`, deployed on Render.