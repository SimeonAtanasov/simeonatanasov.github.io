"""Builds images/regulatory-digests.png, the home page tile for the Regulatory
Digests spotlight (21 September 2026).

A flat mock of a digest page: the filter field, four entry cards with a type
chip, a title bar and two takeaway lines each, and a caption. It deliberately
carries no source pills, because the three tool-chips the spotlight overlays on
the left half of the image already name the AI Act, cookie and EDPB digests, and
two sets of labels read as clutter.

Palette and proportions match images/risk-matrix-tile.png: 1000 x 1000, the
#2a3860 page navy, content held between y 290 and y 790 so the spotlight's
horizontal crop never cuts it, and drawn at 2x then resized for clean edges.

Needs Pillow and the DejaVu fonts. Run it from anywhere:
    python3 make_regulatory_digests_tile.py
"""

import os

from PIL import Image, ImageDraw, ImageFont

W = H = 1000
BG = (42, 56, 96)
CARD = (50, 65, 108)
CARD_EDGE = (66, 84, 133)
FIELD = (34, 47, 94)
MUTED = (139, 154, 190)
DIM = (96, 112, 152)
WHITE = (233, 239, 249)
ACCENT = (127, 178, 229)
TEAL = (59, 131, 167)
ROSE = (152, 76, 97)
OLIVE = (140, 126, 86)

B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

im = Image.new("RGB", (W * 2, H * 2), BG)
d = ImageDraw.Draw(im)
S = 2


def f(path, size):
    return ImageFont.truetype(path, size * S)


def tracked(x, y, text, font, fill, track=0):
    cx = x
    for ch in text:
        d.text((cx, y), ch, font=font, fill=fill)
        cx += d.textlength(ch, font=font) + track * S
    return cx


def tracked_width(text, font, track=0):
    w = 0
    for ch in text:
        w += d.textlength(ch, font=font) + track * S
    return w - track * S if text else 0


def rr(box, radius, fill=None, outline=None, width=1):
    d.rounded_rectangle([c * S for c in box], radius=radius * S, fill=fill,
                        outline=outline, width=width * S)


f_pill = f(B, 13)
f_chip = f(B, 10)
f_cap = f(B, 11)
f_field = f(R, 13)

LEFT, RIGHT = 165, 835

# Filter field.
rr((LEFT, 296, RIGHT, 340), 8, fill=FIELD, outline=CARD_EDGE, width=1)
# magnifier
d.ellipse([(LEFT + 20) * S, 310 * S, (LEFT + 36) * S, 326 * S], outline=DIM, width=2 * S)
d.line([(LEFT + 34) * S, 324 * S, (LEFT + 41) * S, 331 * S], fill=DIM, width=2 * S)
d.text(((LEFT + 54) * S, 309 * S), "filter by jurisdiction, type, year",
       font=f_field, fill=DIM)

# Entry cards: a chip, a title bar and two takeaway lines each.
entries = [
    ("ARTICLE", ACCENT, 0.62, 0.95, 0.58),
    ("GUIDANCE", TEAL, 0.50, 0.88, 0.71),
    ("DECISION", ROSE, 0.71, 0.92, 0.44),
    ("ENFORCEMENT", OLIVE, 0.44, 0.85, 0.66),
]

y = 368
for label, colour, t_w, l1, l2 in entries:
    rr((LEFT, y, RIGHT, y + 84), 8, fill=CARD, outline=CARD_EDGE, width=1)
    d.rounded_rectangle([LEFT * S, (y + 10) * S, (LEFT + 6) * S, (y + 74) * S],
                        radius=3 * S, fill=colour)

    cw = tracked_width(label, f_chip, 1.4) / S + 26
    rr((RIGHT - 24 - cw, y + 18, RIGHT - 24, y + 44), 13, outline=colour, width=2)
    tracked((RIGHT - 24 - cw + 13) * S, (y + 25) * S, label, f_chip, colour, 1.4)

    inner = LEFT + 26
    avail = RIGHT - 48 - cw - inner
    # title bar
    d.rounded_rectangle([inner * S, (y + 20) * S, (inner + avail * t_w) * S, (y + 32) * S],
                        radius=6 * S, fill=(176, 192, 222))
    # takeaway lines
    span = RIGHT - 26 - inner
    d.rounded_rectangle([inner * S, (y + 46) * S, (inner + span * l1 * 0.86) * S, (y + 54) * S],
                        radius=4 * S, fill=(88, 105, 147))
    d.rounded_rectangle([inner * S, (y + 62) * S, (inner + span * l2 * 0.86) * S, (y + 70) * S],
                        radius=4 * S, fill=(88, 105, 147))
    y += 96

tw = tracked_width("EVERY ENTRY CARRIES A WRITTEN TAKEAWAY", f_cap, 3.4) / S
tracked(((W - tw) / 2) * S, 778 * S, "EVERY ENTRY CARRIES A WRITTEN TAKEAWAY",
        f_cap, DIM, 3.4)

im = im.resize((W, H), Image.LANCZOS)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "..", "..", "images", "regulatory-digests.png")
im.save(out, optimize=True)
print(os.path.normpath(out), os.path.getsize(out))
