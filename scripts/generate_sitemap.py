#!/usr/bin/env python3
"""Generate a valid absolute-url sitemap once PUBLIC_SITE_ORIGIN is configured."""
from __future__ import annotations
import json, os, sys
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = os.getenv('PUBLIC_SITE_ORIGIN', '').rstrip('/')
if not ORIGIN.startswith('https://'):
    sys.exit('PUBLIC_SITE_ORIGIN must be a confirmed https:// production domain before generating sitemap.xml')

products = json.loads((ROOT / 'src/data/products.json').read_text())
base_routes = ['/', '/products', '/products/catalog', '/company', '/services', '/contact', '/apply', '/delivery', '/industries', '/careers', '/suppliers', '/privacy', '/terms']
paths = set(base_routes)
for lang in ['en', 'zh']:
    paths.update(f'/{lang}{route if route != "/" else ""}' for route in base_routes)
for product in products:
    route = f"/products/{product['category']}/{product['id']}"
    paths.add(route)
    paths.add(f'/en{route}')
    paths.add(f'/zh{route}')

lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path in sorted(paths):
    lines += ['  <url>', f'    <loc>{escape(ORIGIN + path)}</loc>', '  </url>']
lines.append('</urlset>')
(ROOT / 'public/sitemap.xml').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'Wrote {len(paths)} sitemap URLs for {ORIGIN}')
