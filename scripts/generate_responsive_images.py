#!/usr/bin/env python3
"""Generate 400w, 800w, 1200w WebP and AVIF variants for responsive pictures."""
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'public/images/responsive'
OUT_DIR.mkdir(parents=True, exist_ok=True)

TARGET_IMAGES = [
    # Category images
    'public/images/category-cleaning.webp',
    'public/images/category-dry.webp',
    'public/images/category-meat.webp',
    'public/images/category-pantry.webp',
    'public/images/category-prepared.webp',
    'public/images/category-preserved.webp',
    'public/images/category-produce.webp',
    'public/images/category-seafood.webp',
    'public/images/category-supplies.webp',
    # Hero images
    'public/images/home/hero-beef-steaks.webp',
    'public/images/home/hero-fruit-still-life.webp',
    'public/images/home/hero-asian-produce.webp',
]

WIDTHS = [400, 800, 1200]

def main():
    for rel_path in TARGET_IMAGES:
        src = ROOT / rel_path
        if not src.exists():
            print(f"Skipping missing: {src}")
            continue

        base_name = src.stem
        with Image.open(src) as img:
            orig_w, orig_h = img.size
            for w in WIDTHS:
                # scale proportionally
                h = int(orig_h * (w / orig_w))
                resized = img.resize((w, h), Image.Resampling.LANCZOS)
                
                # Save WebP
                webp_out = OUT_DIR / f"{base_name}-{w}w.webp"
                resized.save(webp_out, 'WEBP', quality=82, method=6)

                # Save AVIF
                avif_out = OUT_DIR / f"{base_name}-{w}w.avif"
                resized.save(avif_out, 'AVIF', quality=75)

        print(f"Generated variants for: {base_name}")

if __name__ == '__main__':
    main()
