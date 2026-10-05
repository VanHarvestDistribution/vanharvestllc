#!/usr/bin/env python3
"""Write a reviewable public-catalog audit from the source workbook and generated data."""
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = {x['id']: x for x in json.loads((ROOT / 'src/data/products.json').read_text(encoding='utf-8'))}
HISTORY = json.loads((ROOT / 'data/product-route-redirects.json').read_text(encoding='utf-8'))['redirects']
IMPORT_REPORT = json.loads((ROOT / 'data/stocklist-import-report.json').read_text(encoding='utf-8'))
RAW_DF = pd.read_excel('/home/ubuntu/upload/Stocklist.xls', dtype=str).fillna('')
RAW = {str(row.Product_ID).strip(): row for _, row in RAW_DF.iterrows()}
OUT = ROOT / 'data/catalog-reclassification-audit.md'

LABELS = {
    'meat': 'Meat & Poultry', 'produce': 'Produce & Fruit', 'seafood': 'Seafood',
    'pantry': 'Sauces & Seasonings', 'preserved': 'Canned & Preserved',
    'supplies': 'Restaurant Supplies', 'dry': 'Rice, Noodles & Dry Goods',
    'cleaning': 'Cleaning & Janitorial', 'prepared': 'Frozen, Prepared & Snacks',
}
ORDER = ['meat', 'produce', 'seafood', 'pantry', 'preserved', 'supplies', 'dry', 'cleaning', 'prepared']
PREFIX_IDS = '12151 20032 21043 24403 24490 25532 32009 33250 33257 33258 33259 34064 34065 34081 35131 37100 37104 37105 37202 40314 72049 91004 92603 92624 92626 92841'.split()


def cell(value: object) -> str:
    return str(value).replace('|', '/').replace('\n', ' ').strip()


def main() -> None:
    counts = Counter(x['category'] for x in PRODUCTS.values())
    storage = Counter(x['storage'] or 'not shown' for x in PRODUCTS.values())
    redirects_by_source: dict[str, list[dict[str, str]]] = defaultdict(list)
    for item in HISTORY:
        redirects_by_source[item['from']].append(item)

    lines = [
        '# Catalog Reclassification & Name-Cleaning Audit',
        '',
        '> Generated from `Stocklist.xls`, the public catalog data layer, and the automatic redirect history. The public catalog contains no prices, costs, supplier remarks, or source-only internal fields.',
        '',
        '## Final public catalog',
        '',
        f'- **Active catalog products:** {len(PRODUCTS):,}',
        f'- **Storage:** frozen: {storage["frozen"]:,} · refrigerated: {storage["refrigerated"]:,} · not shown: {storage["not shown"]:,}',
        '- **Storage rule:** only explicit fresh/new/freshness signals produce `Refrigerated`; explicit frozen terms and frozen prepared foods produce `Frozen`; otherwise storage is not displayed.',
        f'- **Parenthesis check:** {IMPORT_REPORT["unbalanced_parentheses"]} unbalanced English or Chinese public names.',
        '',
        '| Category | Products |', '|---|---:|',
    ]
    for category in ORDER:
        lines.append(f'| {LABELS[category]} (`{category}`) | {counts[category]:,} |')

    lines += [
        '', '## Category migration and old-detail URL policy', '',
        f'**{len(HISTORY):,} legacy category paths** are emitted in `public/_redirects`, each in English and Chinese. A migrated product with an uploaded photo redirects to its new static detail page. A migrated product without a generated detail page redirects to its current category page, preventing a 301-to-404 chain.',
        '',
    ]
    for source in ('produce', 'seafood', 'meat', 'pantry', 'prepared', 'preserved', 'supplies', 'dry', 'cleaning'):
        entries = redirects_by_source.get(source, [])
        if not entries:
            continue
        lines += [f'### Legacy `{source}` paths → current categories ({len(entries):,})', '', '| Item # | Public English name | Public Chinese name | Legacy → Current |', '|---:|---|---|---|']
        for entry in entries:
            product = PRODUCTS.get(entry['id'])
            if product:
                lines.append(f'| {entry["id"]} | {cell(product["name"])} | {cell(product["nameZh"])} | `{entry["from"]}` → `{entry["to"]}` |')
        lines.append('')

    lines += [
        '## Requested food-prefix cleanup — before → after', '',
        '| Item # | Raw English source name | Public English name | Current category |', '|---:|---|---|---|',
    ]
    for item_id in PREFIX_IDS:
        product = PRODUCTS[item_id]
        raw = RAW.get(item_id)
        before = cell(raw.Product_English_Name) if raw is not None else '—'
        lines.append(f'| {item_id} | {before} | {cell(product["name"])} | {LABELS[product["category"]]} |')

    lines += [
        '',
        'The same importer corrects joined or misspelled words, including `SoicyMini → Spicy Mini`, `Favor → Flavor`, `IcelessGreenOnion → Iceless Green Onion`, and `BISUIT → Biscuit`, while retaining product-pack information.',
        '',
        '## English drafts for source rows without English names', '',
        f'The current workbook has **34** blank-English rows. **5** are blacklisted non-public records, leaving **{len(IMPORT_REPORT["english_translation_drafts"])}** active products with English drafts for review.',
        '', '| Item # | Chinese name | English draft |', '|---:|---|---|',
    ]
    for item in IMPORT_REPORT['english_translation_drafts']:
        lines.append(f'| {item["id"]} | {cell(item["nameZh"])} | {cell(item["englishDraft"])} |')

    lines += [
        '', '## Verified examples', '',
        '| Item # | Final public result |', '|---:|---|',
        "| 34064 | `prepared` · `Frozen` · `5/16'' Thin Regular Cut Fries 30LB` |",
        '| 35188 / 35199 | `pantry` · Mirin products |',
        '| 35224 / 35149 / 35650 | `supplies` · sushi container / chopsticks |',
        '| 21190 / 21425 / 21603 | `produce` · watermelon / watercress / peeled garlic |',
        '| 23046 | `seafood` · Whole Tilapia Gutted 40LB |',
        '', 'Redirect generation runs inside `pnpm build` through `scripts/generate_redirects.mjs`; future imports preserve and regenerate the appropriate legacy paths automatically.',
    ]
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote {OUT.relative_to(ROOT)} with {len(lines)} lines.')


if __name__ == '__main__':
    main()
