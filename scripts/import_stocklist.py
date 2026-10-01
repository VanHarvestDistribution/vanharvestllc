#!/usr/bin/env python3
"""Build the public Van Harvest catalog from Stocklist.xls without prices or stock quantities."""
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
MARKDOWN_REPORT = ROOT / 'data/catalog-name-cleaning-report.md'
SAFE_SOURCE = ROOT / 'data/source/current-catalog.csv'
RULES = ROOT / 'data/catalog-rules.json'

PLACEHOLDER = re.compile(r'^(?:[*._\s-]+|n/?a|none|unknown|\*\*)$', re.I)
PACK = re.compile(r'(?i)(?:\b\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?\s*(?:oz|lb|lbs|g|kg|ml|pc|pcs)\b|\b\d+(?:\.\d+)?\s*(?:lb|lbs|oz|g|kg|ml|l|pc|pcs|pkg|cs)\b(?:\s*/\s*(?:cs|pkg|case))?)')
REPLACEMENTS = [
    (r'\bFRZ\b', 'Frozen', 'FRZ → Frozen'),
    (r'\bFEZ\b', 'Frozen', 'FEZ → Frozen'),
    (r'\bBnls\b', 'Boneless', 'Bnls → Boneless'),
    (r'Smithfiled', 'Smithfield', 'Smithfiled → Smithfield'),
    (r'Favor', 'Flavor', 'Favor → Flavor'),
    (r'Murshrooms', 'Mushrooms', 'Murshrooms → Mushrooms'),
    (r'Approxmi', 'Approx.', 'Approxmi → Approx.'),
    (r'WholeWing', 'Whole Wing', 'WholeWing → Whole Wing'),
    (r'\(\s*Med\s*\)\s*Wing', 'Medium Wing', '(Med)Wing → Medium Wing'),
]
INTERNAL_PAREN_CODE = re.compile(r'\(\s*(?:[A-Z]{1,4}\s*[-/]?\s*)?\d{4,}[A-Z0-9./-]*\s*\)', re.I)
LEADING_INTERNAL_CODE = re.compile(r'^(?:[A-Z]{1,3}\d{3,}|[A-Z]\s*-\s*\d{3,})\s*[-/:]?\s*', re.I)
TRAILING_INTERNAL_CODE = re.compile(r'\s+(?:\d{1,2}-\d{4,}|[A-Z]\d[A-Z]\d[A-Z]|[A-Z]{1,3}\d{4,})\s*$', re.I)
INTERNAL_ITEM_TOKEN = re.compile(r'\b(?:item\s*#?\s*|sku\s*#?\s*)\d{4,}\b', re.I)
STAR_INTERNAL_NUMBER = re.compile(r'\*+\s*\d[\d\s/&.-]*\*+')
HASH_INTERNAL_NUMBER = re.compile(r'#\s*\d+\s*#')
TRAILING_ZH_CASE_COUNT = re.compile(r'\s*[（(]\s*\d{1,3}\s*[)）]\s*$')
TRAILING_ZH_INTERNAL_NUMBER = re.compile(r'\s*-\s*\d{3,}\s*$')
SPECIAL_REMAINING = re.compile(r'[\*#]')


def apply_rule(value: str, pattern: str | re.Pattern[str], replacement: str, reason: str, reasons: list[str], flags: int = 0) -> str:
    updated, count = re.subn(pattern, replacement, value, flags=flags)
    if count:
        reasons.append(reason)
    return updated


def clean(value: str, chinese: bool = False) -> tuple[str, list[str]]:
    value = str(value or '')
    reasons: list[str] = []
    value = apply_rule(value, r'\(?\s*Check\s*Immediately\s*\)?', ' ', 'removed Check Immediately', reasons, re.I)
    value = apply_rule(value, r'\*?\s*NO\s*RETURN\s*\*?', ' ', 'removed NO RETURN', reasons, re.I)
    value = apply_rule(value, r'\s*-\s*PC\b', ' ', 'removed - PC', reasons, re.I)
    value = apply_rule(value, r'[（(]?\s*请当场检查\s*[)）]?', ' ', 'removed (请当场检查)', reasons)
    value = apply_rule(value, r'海鲜-保鲜不保活,不退货|不退货|不做退换|不退|保鲜不保活', ' ', 'removed return restrictions', reasons)
    value = apply_rule(value, r'\s*[（(]\s*\d{1,4}\s*(?:pc|pcs|包|盒|个|ct)?\s*[)）]\s*$', '', 'removed trailing case count', reasons)
    value = apply_rule(value, r'\s*\(BOX\(\d+\)\)', '', 'removed BOX(case count)', reasons)
    value = apply_rule(value, r'\s*\(\d{2,4}\)\s*$', '', 'removed trailing parenthesized number', reasons)
    value = apply_rule(value, STAR_INTERNAL_NUMBER, ' ', 'removed internal *number* marker', reasons)
    value = apply_rule(value, HASH_INTERNAL_NUMBER, ' ', 'removed internal #number# marker', reasons)
    value = apply_rule(value, INTERNAL_PAREN_CODE, ' ', 'removed internal parenthesized code', reasons)
    value = apply_rule(value, INTERNAL_ITEM_TOKEN, ' ', 'removed internal item token', reasons)
    value = apply_rule(value, LEADING_INTERNAL_CODE, '', 'removed leading internal code', reasons)
    value = apply_rule(value, TRAILING_INTERNAL_CODE, '', 'removed trailing internal code', reasons)
    if chinese:
        value = apply_rule(value, TRAILING_ZH_CASE_COUNT, '', 'removed trailing Chinese case count', reasons)
        value = apply_rule(value, TRAILING_ZH_INTERNAL_NUMBER, '', 'removed trailing Chinese internal number', reasons)
        value = apply_rule(value, r'\s*[（(]\s*隔天\s*,?\s*$', '', 'removed trailing order note', reasons)
        value = apply_rule(value, r'\s*[）)]\s*$', '', 'removed dangling closing paren', reasons)
    else:
        for pattern, replacement, reason in REPLACEMENTS:
            value = apply_rule(value, pattern, replacement, reason, reasons, re.I)
    if '*' in value:
        value = value.replace('*', ' ')
        reasons.append('removed residual * marker')
    if '#' in value:
        value = value.replace('#', '')
        reasons.append('removed residual # marker')
    value = value.replace('"', '').replace('“', '').replace('”', '')
    value = re.sub(r'\s*\([A-Za-z]*\(?\d+\)?\)\s*$', '', value)
    value = re.sub(r'\s+', ' ', value).strip(' -_/')
    return value, list(dict.fromkeys(reasons))


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


def escape_cell(value: str) -> str:
    return value.replace('|', '\\|').replace('\n', ' ').strip()


def write_markdown(changes: list[dict], special: list[dict], public_count: int) -> None:
    lines = [
        '# Van Harvest 产品名称清洗对照',
        '',
        f'公开目录共 **{public_count:,}** 个产品。本报告记录了所有触发本轮名称清洗规则的项目；不会展示价格、库存或内部代码。',
        '',
        '## 清洗前后对照',
        '',
        '| Item # | English before | English after | 中文名称前 | 中文名称后 | 清洗规则 |',
        '| --- | --- | --- | --- | --- | --- |',
    ]
    for change in changes:
        lines.append(f"| {change['id']} | {escape_cell(change['englishBefore'])} | {escape_cell(change['englishAfter'])} | {escape_cell(change['chineseBefore'])} | {escape_cell(change['chineseAfter'])} | {escape_cell('；'.join(change['rules']))} |")
    if not changes:
        lines.append('| — | — | — | — | — | 本轮没有触发的清洗规则 |')
    lines += ['', '## 仍含待审核特殊标记的条目', '']
    if special:
        lines += ['| Item # | English name | 中文名称 | 标记 |', '| --- | --- | --- | --- |']
        for item in special:
            lines.append(f"| {item['id']} | {escape_cell(item['name'])} | {escape_cell(item['nameZh'])} | {escape_cell(item['symbols'])} |")
    else:
        lines.append('本轮规则清除了 `*` 与 `#数字#` 形式的内部标记；公开名称中没有剩余此类标记。')
    MARKDOWN_REPORT.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main() -> None:
    rules = json.loads(RULES.read_text())
    df = pd.read_excel(SOURCE, dtype=str).fillna('')
    raw, public, rejected, changes = [], [], [], []
    for row in df.to_dict('records'):
        item_id = str(row.get('Product_ID', '')).strip()
        if not item_id or not item_id.isdigit():
            continue
        if str(row.get('Discontinued', '')).strip().lower() == 'true':
            rejected.append({'id': item_id, 'reason': 'discontinued'})
            continue
        record = {
            'id': item_id,
            'code': str(row.get('Code', '')).strip(),
            'rawName': str(row.get('Product_English_Name', '')).strip(),
            'rawNameZh': str(row.get('Product_Chinese_Name', '')).strip(),
        }
        is_blocked, reason = blocked(record, rules)
        if is_blocked:
            rejected.append({'id': item_id, 'reason': reason})
            continue
        name, en_reasons = clean(record['rawName'])
        name_zh, zh_reasons = clean(record['rawNameZh'], chinese=True)
        if not name and name_zh:
            name = name_zh
        if not name:
            rejected.append({'id': item_id, 'reason': 'empty-public-name'})
            continue
        if name != record['rawName'] or name_zh != record['rawNameZh']:
            changes.append({
                'id': item_id,
                'englishBefore': record['rawName'], 'englishAfter': name,
                'chineseBefore': record['rawNameZh'], 'chineseAfter': name_zh,
                'rules': list(dict.fromkeys(en_reasons + zh_reasons)),
            })
        storage_text = f"{record['rawName']} {record['rawNameZh']}".lower()
        storage = 'frozen' if any(term in storage_text for term in ['frozen', 'frz', '冷冻', '冷凍']) else ('refrigerated' if any(term in storage_text for term in ['fresh', 'chilled', '新鲜', '冷藏']) else 'dry')
        pack = PACK.search(record['rawName'])
        safe = {'id': item_id, 'name': name, 'nameZh': name_zh, 'category': category_for(record, rules), 'packSize': pack.group(0) if pack else '', 'storage': storage, 'active': True}
        public.append(safe)
        raw.append({'Product_ID': item_id, 'Code': record['code'], 'Product_English_Name': name, 'Product_Chinese_Name': name_zh, 'Category_Name': safe['category']})
    public.sort(key=lambda item: int(item['id']))
    special = [{'id': item['id'], 'name': item['name'], 'nameZh': item['nameZh'], 'symbols': ''.join(sorted(set(SPECIAL_REMAINING.findall(f"{item['name']} {item['nameZh']}"))))} for item in public if SPECIAL_REMAINING.search(f"{item['name']} {item['nameZh']}")]
    OUTPUT.write_text(json.dumps(public, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    SAFE_SOURCE.parent.mkdir(parents=True, exist_ok=True)
    with SAFE_SOURCE.open('w', newline='', encoding='utf-8') as fh:
        writer = csv.DictWriter(fh, fieldnames=['Product_ID', 'Code', 'Product_English_Name', 'Product_Chinese_Name', 'Category_Name'])
        writer.writeheader(); writer.writerows(raw)
    report = {
        'source': 'Stocklist.xls', 'publicProductCount': len(public), 'rejectedCount': len(rejected),
        'rejected': rejected, 'cleanedNameCount': len(changes), 'cleanedNameChanges': changes,
        'remainingSpecialSymbolCount': len(special), 'remainingSpecialSymbolItems': special,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    write_markdown(changes, special, len(public))
    print(json.dumps({'raw': len(df), 'public': len(public), 'rejected': len(rejected), 'nameChanges': len(changes), 'remainingSpecialSymbols': len(special)}))

if __name__ == '__main__':
    main()
