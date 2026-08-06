#!/usr/bin/env python3
"""Regenerate src/app/opengraph-image.jpg — the site-wide social share card.

The card is the Insomnia 2026 wide stage frame with the SHOOBYDOO wordmark and
a tagline set across the bottom, over the dark crowd so nothing in the photo is
covered. Type matches SiteWordmark.tsx: Fraunces, uppercase, 0.08em tracking,
#ededeb.

Fraunces reaches the browser via next/font/google, which only ever writes woff2
into .next/. PIL can't read woff2 and .next/ is regenerable, so the latin subset
is instantiated at wght=400 and kept in scripts/og-assets/. To re-extract it
after a font change, pull the Fraunces woff2 out of the build cache:

    grep -A1 'font-family: Fraunces' .next/dev/static/chunks/*fraunces*.css

then, for the subset that has the latin glyphs:

    python3 -c "
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    f = TTFont('<that>.woff2'); f.flavor = None
    instancer.instantiateVariableFont(f, {'wght': 400}, inplace=True)
    f.save('scripts/og-assets/fraunces-400.ttf')"

Usage:  python3 scripts/make-og.py     (needs Pillow)
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/events/insomnia-2026/_7R45554-Enhanced-NR.jpg"
FONT = ROOT / "scripts/og-assets/fraunces-400.ttf"
OUT = ROOT / "src/app/opengraph-image.jpg"

W, H = 1200, 630  # the Open Graph standard; below this some scrapers use the small card
INK = (237, 237, 235)  # #ededeb, the site's foreground
MUTED = (198, 198, 194)

WORDMARK = "SHOOBYDOO"
TAGLINE = "CONCERT PHOTOGRAPHY"
WORDMARK_SIZE = 88
TAGLINE_SIZE = 26
TRACKING = 0.08  # matches SiteWordmark.tsx letterSpacing
TAGLINE_TRACKING = 0.30
BASELINE_INSET = 64
SCRIM_HEIGHT, SCRIM_STRENGTH = 370, 195


def cover_crop(img: Image.Image) -> Image.Image:
    """Crop to the 1200x630 aspect from the centre, then resize."""
    w, h = img.size
    target = W / H
    if w / h > target:
        nw = int(h * target)
        x = (w - nw) // 2
        box = (x, 0, x + nw, h)
    else:
        nh = int(w / target)
        y = (h - nh) // 2
        box = (0, y, w, y + nh)
    return img.crop(box).resize((W, H), Image.LANCZOS)


def bottom_scrim(img: Image.Image) -> Image.Image:
    """Fade the lower band toward black so the type stays legible."""
    column = Image.new("L", (1, H), 0)
    px = column.load()
    for y in range(H):
        px[0, y] = int(SCRIM_STRENGTH * max(0.0, 1 - ((H - y) / SCRIM_HEIGHT)))
    return Image.composite(Image.new("RGB", (W, H), (6, 6, 8)), img, column.resize((W, H)))


def draw_tracked(draw, text, font, centre_x, y, tracking, fill):
    """PIL has no letter-spacing, so step the pen manually per glyph."""
    widths = [draw.textlength(c, font=font) for c in text]
    x = centre_x - (sum(widths) + tracking * (len(text) - 1)) / 2
    for char, width in zip(text, widths):
        draw.text((x, y), char, font=font, fill=fill)
        x += width + tracking


def main() -> None:
    img = bottom_scrim(cover_crop(Image.open(SOURCE).convert("RGB")))
    draw = ImageDraw.Draw(img)

    wordmark = ImageFont.truetype(str(FONT), WORDMARK_SIZE)
    tagline = ImageFont.truetype(str(FONT), TAGLINE_SIZE)
    wordmark_ascent = wordmark.getmetrics()[0]
    tagline_ascent = tagline.getmetrics()[0]

    tagline_y = H - BASELINE_INSET - tagline_ascent
    wordmark_y = tagline_y - int(WORDMARK_SIZE * 0.34) - wordmark_ascent

    draw_tracked(draw, WORDMARK, wordmark, W / 2, wordmark_y, WORDMARK_SIZE * TRACKING, INK)
    draw_tracked(draw, TAGLINE, tagline, W / 2, tagline_y, TAGLINE_SIZE * TAGLINE_TRACKING, MUTED)

    img.save(OUT, quality=91)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB, {W}x{H})")


if __name__ == "__main__":
    main()
