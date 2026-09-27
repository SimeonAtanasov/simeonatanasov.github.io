"""Builds images/power-bi-tile.png, the home page tile for the GDPR fines card.

Layout: the Power BI wordmark on top, a dashboard screenshot below, on white,
trimmed tight so the spotlight (background-size: contain) shows no white slab.

Sources:
  - wordmark: images/power-bi-dashboard.png (the 1254 x 1254 composite of
    21 September 2026; only its top block, the wordmark, is used)
  - dashboard: power-bi-screenshot.png in this folder, a screenshot of the
    published report. Replaced on 27 September 2026 after the date fix, when
    the Total Fines card went from EUR 6.24bn to EUR 7.16bn. To refresh the
    tile, overwrite that file with a new screenshot and rerun.

The Power BI viewer's grey footer bar (page counter, share icons) is cut off
where the white report canvas ends. The wordmark is scaled so its width keeps
the proportion to the dashboard it had in the 21 September tile (0.89).

Quantized to 256 colours with no dithering; flat UI screenshots survive that
almost losslessly. Check the printed mean difference before accepting.

Needs Pillow and numpy:
    python3 make_power_bi_tile.py
"""

import os

import numpy as np
from PIL import Image, ImageChops

here = os.path.dirname(os.path.abspath(__file__))
images = os.path.join(here, "..", "..", "images")

MARGIN = 22
GAP = 44
LOGO_TO_DASH = 0.89


def ink_mask(img, level=245):
    return np.array(img).astype(int).sum(axis=2) < level * 3


def bbox(mask, y0, y1):
    sub = mask[y0:y1]
    cols = np.where(sub.any(axis=0))[0]
    rows = np.where(sub.any(axis=1))[0]
    return (int(cols.min()), y0 + int(rows.min()), int(cols.max()) + 1, y0 + int(rows.max()) + 1)


# Wordmark from the old composite.
comp = Image.open(os.path.join(images, "power-bi-dashboard.png")).convert("RGB")
logo = comp.crop(bbox(ink_mask(comp), 0, 400))

# Dashboard: stop at the first row of the viewer's footer bar, a full-width
# grey line, then trim the white around the report.
shot = Image.open(os.path.join(here, "power-bi-screenshot.png")).convert("RGB")
a = np.array(shot).astype(int)
row_mean = a.mean(axis=(1, 2))
row_flat = a.std(axis=(1, 2))
footer = next((y for y in range(shot.size[1] // 2, shot.size[1])
               if row_mean[y] < 235 and row_flat[y] < 3), shot.size[1])
dash = shot.crop((0, 0, shot.size[0], footer))
dash = dash.crop(bbox(ink_mask(dash), 0, dash.size[1]))

target_w = round(dash.size[0] * LOGO_TO_DASH)
logo = logo.resize((target_w, round(logo.size[1] * target_w / logo.size[0])), Image.LANCZOS)

lw, lh = logo.size
dw, dh = dash.size
W = max(lw, dw) + 2 * MARGIN
H = MARGIN + lh + GAP + dh + MARGIN

tile = Image.new("RGB", (W, H), (255, 255, 255))
tile.paste(logo, ((W - lw) // 2, MARGIN))
tile.paste(dash, ((W - dw) // 2, MARGIN + lh + GAP))

out = tile.quantize(colors=256, dither=Image.NONE)
path = os.path.join(images, "power-bi-tile.png")
out.save(path, optimize=True)

diff = np.array(ImageChops.difference(tile, out.convert("RGB")))
print(os.path.normpath(path), out.size, os.path.getsize(path),
      "bytes; footer cut at", footer, "; quantization mean", round(diff.mean(), 3), "max", diff.max())
