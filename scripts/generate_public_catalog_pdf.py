#!/usr/bin/env python3
"""Generate the downloadable bilingual Van Harvest product catalog."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / 'src/data/products.json'
MARKDOWN = ROOT / 'data/public-bilingual-catalog.md'
PDF = ROOT / 'public/catalog/van-harvest-product-catalog.pdf'

CATEGORY_NAMES = {
    'meat': ('Meat & Poultry', '肉类禽类'),
    'produce': ('Produce & Fruit', '蔬菜水果'),
    'seafood': ('Seafood', '海鲜'),
    'pantry': ('Sauces & Seasonings', '酱料调味'),
    'preserved': ('Canned & Preserved', '罐头腌制'),
    'supplies': ('Restaurant Supplies', '餐饮用品'),
    'dry': ('Rice, Noodles & Dry Goods', '米面干货'),
    'cleaning': ('Cleaning & Janitorial', '清洁用品'),
    'prepared': ('Frozen, Prepared & Snacks', '冷冻点心与零食'),
}
CATEGORY_ORDER = list(CATEGORY_NAMES)
STORAGE = {'frozen': 'Frozen / 冷冻', 'refrigerated': 'Refrigerated / 冷藏'}


def esc(value: str) -> str:
    return str(value or '—').replace('|', '\\|').replace('\n', ' ').strip()


def main() -> None:
    products = json.loads(PRODUCTS.read_text())
    lines = [
        '# Van Harvest Distribution', '## Bilingual Wholesale Product Catalog / 中英双语产品目录', '',
        '**Charlotte, North Carolina**  \\', '**Phone:** (704) 392-8717  \\', '**Sales:** ordersvhd@gmail.com  \\', '**Office:** vanharvestoffice2019@gmail.com', '',
        '> Search by Item #, English name or Chinese name. Apply for an account to see pricing.',
        '> 可按 Item #、英文名或中文名查找产品；申请开户查看价格。', ''
    ]
    for category in CATEGORY_ORDER:
        en, zh = CATEGORY_NAMES[category]
        rows = [product for product in products if product['category'] == category]
        if not rows:
            continue
        lines.extend([f'## {en} / {zh}', '', '| Item # | English name | 中文名称 | Pack format | Storage |', '| --- | --- | --- | --- | --- |'])
        for product in rows:
            storage_val = STORAGE.get(product.get('storage'), '—')
            lines.append(f"| {esc(product['id'])} | {esc(product['name'])} | {esc(product.get('nameZh'))} | {esc(product.get('packSize'))} | {esc(storage_val)} |")
        lines.append('')
    MARKDOWN.write_text('\n'.join(lines), encoding='utf-8')
    PDF.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['manus-md-to-pdf', str(MARKDOWN), str(PDF)], check=True)
    print(json.dumps({'products': len(products), 'markdown': str(MARKDOWN), 'pdf': str(PDF)}))

if __name__ == '__main__':
    main()
