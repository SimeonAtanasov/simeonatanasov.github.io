"""Builds images/power-bi-tile.png from images/power-bi-dashboard.png
(21 September 2026).

The source is a 1254 x 1254 square carrying the Power BI wordmark above a
dashboard screenshot, with wide white margins: 101px above the wordmark, 110px
between the wordmark and the dashboard, 67px below it, and 43px and 34px at the
sides. The spotlight shows the tile with background-size: contain, so all of
that white was being painted into the card and the result read as a white slab
against the blue.

This trims to the two content blocks, restacks them with a 22px margin and a
44px gap, and quantizes to 256 colours with no dithering. Result: 1222 x 1065
and about 370KB, down from 1.16MB, with a mean per-channel difference under 1.
Flat UI screenshots quantize almost losslessly; check the number printed below
before accepting a rebuild.

Needs Pillow and numpy. Run it from anywhere:
    python3 make_power_bi_tile.py
"""

import os

import numpy as np
from PIL import Image, ImageChops

here = os.path.dirname(os.path.abspath(__file__))
images = os.path.join(here, "..", "..", "images")
src = Image.open(os.path.join(images, "power-bi-dashboard.png")).convert("RGB")

a = np.array(src)
ink = a.astype(int).sum(axis=2) < 245 * 3


def bbox(y0, y1):
    """Tight box around the non-white pixels in a horizontal slice."""
    sub = ink[y0:y1]
    cols = np.where(sub.any(axis=0))[0]
    rows = np.where(sub.any(axis=1))[0]
    return (cols.min(), y0 + rows.min(), cols.max() + 1, y0 + rows.max() + 1)


logo = bbox(0, 400)
dash = bbox(430, src.size[1])

MARGIN = 22
GAP = 44

lw, lh = logo[2] - logo[0], logo[3] - logo[1]
dw, dh = dash[2] - dash[0], dash[3] - dash[1]
W = max(lw, dw) + 2 * MARGIN
H = MARGIN + lh + GAP + dh + MARGIN

tile = Image.new("RGB", (W, H), (255, 255, 255))
tile.paste(src.crop(logo), ((W - lw) // 2, MARGIN))
tile.paste(src.crop(dash), ((W - dw) // 2, MARGIN + lh + GAP))

out = tile.quantize(colors=256, dither=Image.NONE)
path = os.path.join(images, "power-bi-tile.png")
out.save(path, optimize=True)

diff = np.array(ImageChops.difference(tile, out.convert("RGB")))
print(os.path.normpath(path), out.size, os.path.getsize(path),
      "bytes; quantization mean", round(diff.mean(), 3), "max", diff.max())
