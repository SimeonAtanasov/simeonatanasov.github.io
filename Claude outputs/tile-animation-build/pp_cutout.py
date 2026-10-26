"""Makes the two layers the Practical Privacy tile needs from images/practical-privacy.jpg:
assets/pp_card.webp, the lifted card alone (its own four-sided outline, dilated 12 px and
feathered 14 px, so none of the stack under it travels with it) and assets/pp_patch.webp,
the same region with the card painted out (filled from the background either side), which sits under it.
Run from this folder: python3 pp_cutout.py ../../images/practical-privacy.jpg"""
import sys, os, cv2, numpy as np
from PIL import Image
src = sys.argv[1]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
os.makedirs(out, exist_ok=True)
img = cv2.imread(src)
x0, y0, x1, y1 = 640, 105, 975, 373                       # layer rectangle, same for both files
card = np.array([[666, 196], [946, 130], [946, 298], [666, 364]], np.int32)   # the card's corners
poly = np.zeros(img.shape[:2], np.uint8); cv2.fillPoly(poly, [card], 255)
k = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
hole = cv2.dilate(poly, k(5))
# fill the hole row by row with a blend of the pixels just outside it on each side: the
# surroundings are plain background, so this leaves no bright core where the card was
patched = img.copy()
for y in range(img.shape[0]):
    xs = np.where(hole[y] > 0)[0]
    if len(xs) == 0: continue
    xl, xr = xs.min(), xs.max()
    left = img[y, max(xl - 10, 0)].astype(np.float32); right = img[y, min(xr + 10, img.shape[1] - 1)].astype(np.float32)
    t = (np.arange(xl, xr + 1) - xl) / max(xr - xl, 1)
    patched[y, xl:xr + 1] = (left[None, :] * (1 - t[:, None]) + right[None, :] * t[:, None]).astype(np.uint8)
blur = cv2.GaussianBlur(patched, (0, 0), 4)
patched = np.where(hole[..., None] > 0, blur, patched)
cv2.imwrite(os.path.join(out, "pp_patch.png"), patched[y0:y1, x0:x1])
alpha = cv2.dilate(poly, k(12)).astype(np.float32) / 255
alpha = cv2.GaussianBlur(alpha, (0, 0), 6)                 # 14 px feather, roughly
rgba = np.dstack([img, (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
cv2.imwrite(os.path.join(out, "pp_card.png"), rgba)
Image.open(os.path.join(out, "pp_card.png")).save(os.path.join(out, "pp_card.webp"), quality=88, method=6)
Image.open(os.path.join(out, "pp_patch.png")).convert("RGB").save(os.path.join(out, "pp_patch.webp"), quality=85, method=6)
os.remove(os.path.join(out, "pp_card.png")); os.remove(os.path.join(out, "pp_patch.png"))
print("written", sorted(os.listdir(out)), [os.path.getsize(os.path.join(out, f)) for f in sorted(os.listdir(out))])
