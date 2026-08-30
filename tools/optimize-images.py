"""Generate AVIF/WebP derivatives for images/*.jpg.

Widths are capped at the source width so nothing is ever upscaled. Output goes
to images/opt/<stem>-<width>.<ext>; the original JPEGs stay as the <img> fallback.
"""
from PIL import Image
import glob, os

ROOT = "C:/Users/User/Desktop/poduzetnistvo/SubGourmet"
OUT = os.path.join(ROOT, "images", "opt")
WIDTHS = [800, 1600]
EXTRA = {"p1": [2200]}          # hero runs full-bleed, needs the native width
AVIF_Q, WEBP_Q = 50, 78

os.makedirs(OUT, exist_ok=True)
src_total = new_total = 0
for path in sorted(glob.glob(os.path.join(ROOT, "images", "*.jpg"))):
    stem = os.path.splitext(os.path.basename(path))[0]
    im = Image.open(path).convert("RGB")
    src_total += os.path.getsize(path)
    targets = sorted({min(w, im.width) for w in WIDTHS + EXTRA.get(stem, [])})
    for w in targets:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        for ext, kw in (("avif", dict(quality=AVIF_Q)),
                        ("webp", dict(quality=WEBP_Q, method=6))):
            dst = os.path.join(OUT, f"{stem}-{w}.{ext}")
            r.save(dst, ext.upper(), **kw)
            new_total += os.path.getsize(dst)
    print(f"  {stem:5s} {im.width}x{im.height} -> {targets}")

print("\nsource JPEGs : %.2f MB" % (src_total/1048576))
print("derivatives  : %.2f MB (all formats+widths combined)" % (new_total/1048576))
