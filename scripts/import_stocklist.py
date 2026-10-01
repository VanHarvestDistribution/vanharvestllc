#!/usr/bin/env python3
"""Build the public Van Harvest catalog from a private Stocklist.xls without exposing prices or stock quantities."""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/home/ubuntu/upload/Stocklist.xls')
OUTPUT = ROOT / 'src/data/products.json'
REPORT = ROOT / 'data/stocklist-import-report.json'
SAFE_SOURCE = ROOT / 'data/source/current-catalog.csv'
RULES = ROOT / 'data/catalog-rules.json'

PLACEHOLDER = re.compile(r'^(?:[*._\s-]+|n/?a|none|unknown|\*\*)$', re.I)
PACK = re.compile(r'(?i)(?:\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?\s*(?:oz|lb|lbs|g|kg|ml|pc|pcs)\b|\b\d+(?:\.\d+)?\s*(?:lb|lbs|oz|g|kg|ml|l|pc|pcs|pkg|cs)\b(?:\s*/\s*(?:cs|pkg|case))?)')
REPLACEMENTS = [(r'\bFRZ\b', 'Frozen'), (r'\bBnls\b', 'Boneless'), (r'Smithfiled', 'Smithfield'), (r'Favor', 'Flavor'), (r'Murshrooms', 'Mushrooms'), (r'Approxmi', 'Approx.')]


def clean(value: str, chinese: bool = False) -> str:
    value = str(value or '')
    value = re.sub(r'\*(?:\s*\d[\d\s/&.-]*)\*', ' ', value)
    value = value.replace('"', '').replace('“', '').replace('”', '')
    value = re.sub(r'(?<!\w)[*_]+|[*_]+(?!\w)', ' ', value)
    if not chinese:
        for pattern, replacement in REPLACEMENTS:
            value = re.sub(pattern, replacement, value, flags=re.I)
    return re.sub(r'\s+', ' ', value).strip(' -_/')


def has_keyword(text: str, keyword: str) -> bool:
    if re.search(r'[a-zA-Z]', keyword):
        return bool(re.search(rf'(?<![a-z]){re.escape(keyword.lower())}(?![a-z])', text))
    return keyword in text


def category_for(record: dict, rules: dict) -> str:
    manual = rules.get('manual_item_category', {})
    if record['id'] in manual:
        return manual[record['id']]
    text = f"{record['code']} {record['rawName']} {record['rawNameZh']}".lower()
    for category, keywords in rules.get('category_keyword_overrides', {}).items():
        if any(has_keyword(text, keyword.lower()) for keyword in keywords):
            return category
    return rules.get('category_prefix_map', {}).get(record['id'][:1], 'dry')


def blocked(record: dict, rules: dict) -> tuple[bool, str]:
    if record['id'] in rules.get('blocked_item_ids', []):
        return True, f"item:{record['id']}"
    en, zh = record['rawName'].strip(), record['rawNameZh'].strip()
    if PLACEHOLDER.match(en) and (not zh or PLACEHOLDER.match(zh)):
        return True, 'placeholder-name'
    text = f"{en} {zh}".lower()
    for pattern in rules.get('blocked_name_patterns', []):
        if pattern.lower() in text:
            return True, f"keyword:{pattern}"
    return False, ''


def main() -> None:
    rules = json.loads(RULES.read_text())
    df = pd.read_excel(SOURCE, dtype=str).fillna('')
    raw, public, rejected = [], [], []
    for row in df.to_dict('records'):
        item_id = str(row.get('Product_ID', '')).strip()
        if not item_id or not item_id.isdigit():
            continue
        if str(row.get('Discontinued', '')).strip().lower() == 'true':
            rejected.append({'id': item_id, 'reason': 'discontinued'})
            continue
        record = {'id': item_id, 'code': str(row.get('Code', '')).strip(), 'rawName': str(row.get('Product_English_Name', '')).strip(), 'rawNameZh': str(row.get('Product_Chinese_Name', '')).strip()}
        is_blocked, reason = blocked(record, rules)
        if is_blocked:
            rejected.append({'id': item_id, 'reason': reason})
            continue
        name, name_zh = clean(record['rawName']), clean(record['rawNameZh'], chinese=True)
        if not name and name_zh:
            name = name_zh
        if not name:
            rejected.append({'id': item_id, 'reason': 'empty-public-name'})
            continue
        storage_text = f"{record['rawName']} {record['rawNameZh']}".lower()
        storage = 'frozen' if any(term in storage_text for term in ['frozen', 'frz', '冷冻', '冷凍']) else ('refrigerated' if any(term in storage_text for term in ['fresh', 'chilled', '新鲜', '冷藏']) else 'dry')
        pack = PACK.search(record['rawName'])
        safe = {'id': item_id, 'code': record['code'], 'name': name, 'nameZh': name_zh, 'rawName': record['rawName'], 'rawNameZh': record['rawNameZh'], 'category': category_for(record, rules), 'packSize': pack.group(0) if pack else '', 'storage': storage, 'active': True}
        public.append(safe)
        raw.append({'Product_ID': item_id, 'Code': record['code'], 'Product_English_Name': name, 'Product_Chinese_Name': name_zh, 'Category_Name': safe['category']})
    public.sort(key=lambda item: int(item['id']))
    OUTPUT.write_text(json.dumps(public, ensure_ascii=False, separators=(',', ':')))
    SAFE_SOURCE.parent.mkdir(parents=True, exist_ok=True)
    with SAFE_SOURCE.open('w', newline='', encoding='utf-8') as fh:
        writer = csv.DictWriter(fh, fieldnames=['Product_ID', 'Code', 'Product_English_Name', 'Product_Chinese_Name', 'Category_Name'])
        writer.writeheader(); writer.writerows(raw)
    REPORT.write_text(json.dumps({'source': 'Stocklist.xls', 'publicFieldPolicy': 'Item #, Code, English name, Chinese name, category, pack format and storage only. No price, cost, quantity, allocation or reorder fields are imported.', 'rawCount': int(len(df)), 'cleanCount': len(public), 'rejectedCount': len(rejected), 'rejected': rejected}, ensure_ascii=False, indent=2))
    print(json.dumps({'raw': len(df), 'public': len(public), 'rejected': len(rejected)}))

if __name__ == '__main__':
    main()
