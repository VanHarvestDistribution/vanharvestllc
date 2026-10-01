#!/usr/bin/env python3
"""Import the Van Harvest item-list PDF into a price-free, bilingual catalog layer."""
from __future__ import annotations
import argparse, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / 'data/source/082824itemlist.pdf'
DEFAULT_RULES = ROOT / 'data/catalog-rules.json'
DEFAULT_OUTPUT = ROOT / 'src/data/products.json'
DEFAULT_REPORT = ROOT / 'data/catalog-cleaning-report.json'

REPLACEMENTS = [
    (r'\bFRZ\b', 'Frozen'), (r'\bBnls\b', 'Boneless'), (r'\bFRESH\b', 'Fresh'),
    (r'Smithfiled', 'Smithfield'), (r'Smithfiled', 'Smithfield'),
    (r'Favor', 'Flavor'), (r'Murshrooms', 'Mushrooms'), (r'Approxmi', 'Approx.'),
    (r'Calender', 'Calendar'),
]
PLACEHOLDER_RE = re.compile(r'^(?:[*.\s_-]+|n/?a|none|unknown|\.\.\.)$', re.I)
PACK_RE = re.compile(r'(?i)(?:\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?\s*(?:oz|lb|lbs|g|kg|ml|pc|pcs)\b|\b\d+(?:\.\d+)?\s*(?:lb|lbs|oz|g|kg|ml|l|pc|pcs|pkg|cs)\b(?:\s*/\s*(?:cs|pkg|case))?)')

def clean_name(value: str) -> str:
    value = re.sub(r'\*[^*]*\*', ' ', value)
    value = value.replace('"', '').replace('“', '').replace('”', '')
    value = re.sub(r'(?<!\w)[*_]+|[*_]+(?!\w)', ' ', value)
    for pattern, replacement in REPLACEMENTS:
        value = re.sub(pattern, replacement, value, flags=re.I)
    value = re.sub(r'\s+', ' ', value).strip(' -_/')
    return value

def clean_zh(value: str) -> str:
    value = re.sub(r'\*[^*]*\*', ' ', value)
    value = re.sub(r'[*_]+', ' ', value)
    return re.sub(r'\s+', ' ', value).strip(' -_/')

def parse_source(source: Path) -> list[dict]:
    text_path = source.with_suffix('.txt')
    subprocess.run(['pdftotext', '-layout', str(source), str(text_path)], check=True)
    lines = text_path.read_text(errors='ignore').splitlines()
    marker = next(i for i, line in enumerate(lines) if line.strip() == 'Product_Chinese_Name')
    english_lines = [line for line in lines[1:marker] if line.strip()]
    chinese_lines = [line.strip() for line in lines[marker + 1:] if line.strip()]
    records = []
    for index, line in enumerate(english_lines):
        match = re.match(r'^\s*(\d+)\s+(.*)$', line)
        if not match:
            continue
        item_id, remainder = match.group(1), match.group(2).strip()
        chunks = [chunk.strip() for chunk in re.split(r'\s{2,}', remainder) if chunk.strip()]
        if len(chunks) >= 2:
            code, raw_name = chunks[0], ' '.join(chunks[1:])
        else:
            code, raw_name = '', remainder
        raw_zh = chinese_lines[index] if index < len(chinese_lines) else ''
        records.append({'id': item_id, 'code': code, 'rawName': raw_name, 'rawNameZh': raw_zh})
    return records

def category_for(record: dict, rules: dict) -> str:
    item_id, raw = record['id'], record['rawName']
    manual = rules.get('manual_item_category', {})
    if item_id in manual:
        return manual[item_id]
    lower = raw.lower()
    for category, keywords in rules.get('category_keyword_overrides', {}).items():
        if any(keyword.lower() in lower for keyword in keywords):
            return category
    prefix_map = rules.get('category_prefix_map', {})
    return prefix_map.get(item_id[0], 'dry')

def blocked(record: dict, rules: dict) -> tuple[bool, str]:
    raw = record['rawName'].strip()
    if record['id'] in rules.get('blocked_item_ids', []):
        return True, f"item:{record['id']}"
    zh = record.get('rawNameZh', '').strip()
    if PLACEHOLDER_RE.match(raw) and (not zh or PLACEHOLDER_RE.match(zh)):
        return True, 'placeholder-name'
    lower = (raw + ' ' + zh).lower()
    for pattern in rules.get('blocked_name_patterns', []):
        if pattern.lower() in lower:
            return True, f"keyword:{pattern}"
    return False, ''

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('--rules', type=Path, default=DEFAULT_RULES)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--report', type=Path, default=DEFAULT_REPORT)
    args = parser.parse_args()
    rules = json.loads(args.rules.read_text())
    raw = parse_source(args.source)
    products, blocked_rows, adjustments = [], [], []
    for record in raw:
        is_blocked, reason = blocked(record, rules)
        if is_blocked:
            blocked_rows.append({'id': record['id'], 'rawName': record['rawName'], 'rawNameZh': record['rawNameZh'], 'reason': reason})
            continue
        name = clean_name(record['rawName'])
        name_zh = clean_zh(record['rawNameZh'])
        if not name and name_zh:
            name = name_zh
        category = category_for(record, rules)
        if category != rules.get('category_prefix_map', {}).get(record['id'][0], 'dry'):
            adjustments.append({'id': record['id'], 'rawName': record['rawName'], 'category': category, 'reason': 'keyword/manual category override'})
        storage = 'frozen' if re.search(r'(?i)\bfrozen\b|\bfrz\b|冷冻', record['rawName'] + record['rawNameZh']) else ('refrigerated' if re.search(r'(?i)\bfresh\b|\bchilled\b|新鲜|冷藏', record['rawName'] + record['rawNameZh']) else 'dry')
        pack = PACK_RE.search(record['rawName'])
        products.append({
            'id': record['id'], 'code': record['code'], 'name': name or 'Unnamed product', 'nameZh': name_zh,
            'rawName': record['rawName'], 'rawNameZh': record['rawNameZh'], 'category': category,
            'packSize': pack.group(0) if pack else '', 'storage': storage, 'active': True
        })
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(products, ensure_ascii=False, separators=(',', ':')))
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps({'source': str(args.source), 'rawCount': len(raw), 'cleanCount': len(products), 'blockedCount': len(blocked_rows), 'blocked': blocked_rows, 'categoryAdjustments': adjustments}, ensure_ascii=False, indent=2))
    print(json.dumps({'raw': len(raw), 'clean': len(products), 'blocked': len(blocked_rows), 'adjustments': len(adjustments)}))

if __name__ == '__main__':
    main()
