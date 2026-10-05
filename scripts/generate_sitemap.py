#!/usr/bin/env python3
"""Generate a valid absolute-url sitemap.xml for all canonical pages and active products."""
from __future__ import annotations
import json, os
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = os.getenv('PUBLIC_SITE_ORIGIN', 'https://vanharvestllc.com').rstrip('/')

products = json.loads((ROOT / 'src/data/products.json').read_text())

# Base pages in English (canonical default) and Chinese (/zh)
base_routes = [
    '',
    '/products',
    '/products/catalog',
    '/company',
    '/services',
    '/contact',
    '/apply',
    '/delivery',
    '/industries',
    '/careers',
    '/suppliers',
    '/privacy',
    '/terms',
    '/charlotte-food-distributor',
    '/chinese-restaurant-supplier',
    '/live-seafood-wholesale',
    '/nc-sc-food-delivery'
]

urls = []
for r in base_routes:
    urls.append(f"{ORIGIN}{r or '/'}/" if r else f"{ORIGIN}/")
    urls.append(f"{ORIGIN}/zh{r}/" if r else f"{ORIGIN}/zh/")

# Department pages
departments = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared']
for d in departments:
    urls.append(f"{ORIGIN}/products/{d}/")
    urls.append(f"{ORIGIN}/zh/products/{d}/")

# Product detail pages
for p in products:
    # Only products with an uploaded product photo have static detail pages.
    pid = str(p['id'])
    image_map = (ROOT / 'src/data/yellowLabelProductImages.ts').read_text(encoding='utf-8')
    if f"'{pid}'" not in image_map and f'"{pid}"' not in image_map:
        continue
    cat = p['category']
    urls.append(f"{ORIGIN}/products/{cat}/{pid}/")
    urls.append(f"{ORIGIN}/zh/products/{cat}/{pid}/")

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]
for u in sorted(set(urls)):
    lines.append('  <url>')
    lines.append(f'    <loc>{escape(u)}</loc>')
    lines.append('  </url>')
lines.append('</urlset>')

out_file = ROOT / 'public/sitemap.xml'
out_file.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f"Generated {len(urls)} sitemap entries at {out_file}")
