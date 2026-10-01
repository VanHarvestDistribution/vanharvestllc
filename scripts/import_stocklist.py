#!/usr/bin/env python3
"""Build the public Van Harvest catalog data from Stocklist.xls with refined cleaning.

Strict P0 Requirements:
1. Storage semantics:
   - Contains Frozen/FRZ/FZN/冷冻/冻 -> frozen
   - Contains Fresh/新鲜/鲜 OR category in (meat, seafood, produce) and not frozen -> refrigerated
   - Otherwise -> empty string (never default to dry/shelf-stable)
2. Parentheses & clean names:
   - Re-read raw Stocklist.xls directly.
   - Only remove tail complete patterns like (数字) or (纯数字) when completely paired: r'[\(（]\s*\d+\s*[\)）]\s*$'
   - Verify every single English and Chinese name has balanced parentheses.
3. Supplier / Internal codes:
   - PATEL / PVC-xxx
   - FLS-xxx / BA-FLS / A-FLS
   - 10014/Ramarc, 68/4941, LIPON LGT 4/BX 011334
   - Internal remarks: (棕色箱）H 40, (白箱） H 50, appox, 100%, (海鲜)磅, - PC, (Check Immediately), NO RETURN
4. Spelling corrections:
   - Spareib->Sparerib, Pomegrante->Pomegranate, Murshroom->Mushroom, Contaiuer->Container,
     Teriyke->Teriyaki, Schredded->Shredded, Fack Mask->Face Mask, Seedweed->Seaweed,
     FEZ->Frozen, WholeWing->Whole Wing, (Med)Wing->Medium Wing.
5. Missing Chinese names:
   - Detect real goods that lack Chinese characters in Product_Chinese_Name.
   - Provide accurate foodservice Chinese translation drafts.
6. Pack sizes:
   - Parse pack size from raw text into clean packSize field.
"""
from __future__ import annotations
import json, re
from collections import Counter
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
EXCEL_PATH = Path('/home/ubuntu/upload/Stocklist.xls')
RULES_PATH = ROOT / 'data/catalog-rules.json'
OUT_JSON = ROOT / 'src/data/products.json'
REPORT_JSON = ROOT / 'data/stocklist-import-report.json'

# Professional bilingual foodservice translations for active real items missing Chinese characters
TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH: dict[str, str] = {
    "11412": "冷冻鸡腿肉",
    "11413": "冷冻全鸡腿",
    "12127": "带骨牛眼排 (Ribeye)",
    "12268": "冷冻牛后腿眼肉 (Eye Round)",
    "12279": "冷冻牛针扒 (Inside Round)",
    "21404": "舞菇 (灰树花)",
    "21405": "有机真姬菇 (蟹味菇)",
    "21406": "真姬菇 (蟹味菇)",
    "24491": "无骨羊腿肉 (Blue Sky)",
    "32011": "40/60 带子 (蓝宝牌)",
    "37202": "无骨羊肩肉",
    "53008": "300UP 珍珠小玉米",
    "60524": "Morsoft 白色大卷卫生纸 (12卷)",
    "65007": "Kari-Out 205 发泡餐盒 (200套)",
    "65340": "Ecopax PP883S 单格塑料打包餐盒 (象牙白)",
    "65350": "Ecopax PP225 单格塑料餐盒 (白色)",
    "65378": "PP993S 单格发泡餐盒 (象牙白)",
    "65379": "Ecopax RE993S 单格发泡餐盒 (200套)",
    "67053": "A204S 白色塑料汤匙 (1000支)",
    "67420": "Biocean PP225 单格打包盒 6x6 (250套)",
    "71053": "商用植物棕榈油",
    "85060": "标准瓦楞纸箱 12x12x18"
}

SPELLING_FIXES = [
    (re.compile(r'\bSpareib\b', re.I), 'Sparerib'),
    (re.compile(r'\bPomegrante\b', re.I), 'Pomegranate'),
    (re.compile(r'\bMurshrooms?\b', re.I), 'Mushroom'),
    (re.compile(r'\bContaiuer\b', re.I), 'Container'),
    (re.compile(r'\bTeriyke\b', re.I), 'Teriyaki'),
    (re.compile(r'\bSchredded\b', re.I), 'Shredded'),
    (re.compile(r'\bFack Mask\b', re.I), 'Face Mask'),
    (re.compile(r'\bSeedweed\b', re.I), 'Seaweed'),
    (re.compile(r'\bApproxmi\b', re.I), 'Approx.'),
    (re.compile(r'\bappox\b', re.I), 'approx.'),
    (re.compile(r'\bFEZ\b', re.I), 'Frozen'),
    (re.compile(r'\bWholeWing\b', re.I), 'Whole Wing'),
    (re.compile(r'\(Med\)Wing', re.I), 'Medium Wing'),
    (re.compile(r'\bSmithfiled\b', re.I), 'Smithfield'),
]

SUPPLIER_CODE_PATTERNS = [
    re.compile(r'\bPVC-\d+\b', re.I),
    re.compile(r'\bFLS-\d+(?:/\d+)?\b', re.I),
    re.compile(r'\bBA-FLS\b', re.I),
    re.compile(r'\bA-FLS\b', re.I),
    re.compile(r'\bPATEL\s*\d*[A-Z]?\b', re.I),
    re.compile(r'\bLIPON\s+LGT\b', re.I),
    re.compile(r'\b10014/Ramarc\b', re.I),
    re.compile(r'\bRamarc/10014\b', re.I),
    re.compile(r'\b68/4941\b'),
    re.compile(r'\b011334\b'),
    re.compile(r'\b#\d+#'),
    re.compile(r'\(#\d+[\)）]'),
    re.compile(r'\bDU\d+\b', re.I),
]

INTERNAL_REMARKS = [
    re.compile(r'[\(（]\s*棕色箱\s*[）\)]\s*H\s*\d*', re.I),
    re.compile(r'[\(（]\s*白箱\s*[）\)]\s*H\s*\d*', re.I),
    re.compile(r'[\(（]\s*请当场检查[^\)）]*[\)）]', re.I),
    re.compile(r'[\(（]\s*Check Immediately\s*[\)）]', re.I),
    re.compile(r'\bNO RETURN\b', re.I),
    re.compile(r'\b100%\b'),
    re.compile(r'[\-\s]+PC\b', re.I),
    re.compile(r'[\(（]\s*海鲜\s*[）\)]\s*[\-—]?\s*磅', re.I),
    re.compile(r'[\(（]\s*海鲜\s*[）\)]', re.I),
    re.compile(r'\*保鲜不保活[^\*]*\*', re.I),
]

PACK_PATTERNS = [
    re.compile(r'\b(\d+(?:\.\d+)?\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PK|PKG|CS|CT|PC|PCS|BAG|BX|CASE|QT)(?:/[A-Z]+)?)\b', re.I),
    re.compile(r'\b(\d+\s*x\s*[\d\.]+\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PC|PKG|CT))\b', re.I),
    re.compile(r'(\d+LB(?:/[A-Z]+)?)', re.I),
    re.compile(r'(\d+/\d+\s*(?:OZ|LB|CS|BX))', re.I),
]

def clean_brackets(text: str) -> str:
    """Safely strip tail digits in parentheses and guarantee paired brackets."""
    t = text.replace('（', '(').replace('）', ')')

    # 1. Only remove trailing complete (digits) such as (30), (16), (24)
    # Using strict pattern: optional space + '(' + digits + ')' at end of string
    t = re.sub(r'\s*\(\d+\)\s*$', '', t)

    # 2. Fix known single-bracket typos in raw vendor data
    t = t.replace('VALAY)6000', 'VALAY 6000').replace("Ecopax/200')", "Ecopax 200'").replace('（独稻', '(独稻)')

    # 3. If still unbalanced, resolve trailing orphan bracket
    diff = t.count('(') - t.count(')')
    if diff > 0:
        # Extra left bracket at the end
        t = re.sub(r'\(([^\)]*)$', r'\1', t)
    elif diff < 0:
        # Extra right bracket
        t = re.sub(r'^([^\(]*)\)', r'\1', t)

    return t.strip()

def determine_storage(raw_en: str, raw_zh: str, category: str) -> str:
    # Non-food categories (supplies, cleaning) never have refrigerated storage
    if category in ['supplies', 'cleaning']:
        return ''

    combined = f"{raw_en} {raw_zh}".lower()
    # 1. Explicit frozen
    if any(k in combined for k in ['frozen', 'frz', 'fzn', '冷冻', '单冻', '排冻', '冻']):
        return 'frozen'
    # 2. Explicit fresh
    zh_check = raw_zh.replace('保鲜', '').replace('海鲜', '')
    if any(k in raw_en.lower() for k in ['fresh']) or any(k in zh_check for k in ['新鲜', '鲜', '活']):
        return 'refrigerated'
    # 3. Meat, seafood, produce default to refrigerated when not frozen
    if category in ['meat', 'seafood', 'produce']:
        return 'refrigerated'
    # 4. Other categories: do NOT default to shelf-stable/dry; leave empty
    return ''

def clean_name(raw: str, is_zh: bool = False) -> str:
    s = raw.strip()
    for pat, repl in SPELLING_FIXES:
        s = pat.sub(repl, s)
    for pat in SUPPLIER_CODE_PATTERNS:
        s = pat.sub('', s)
    for pat in INTERNAL_REMARKS:
        s = pat.sub('', s)
    s = re.sub(r'PVC-\d+', '', s, flags=re.I)
    s = re.sub(r'100%', '', s)
    s = re.sub(r'[\(（]\s*(?:BROWN|WHITE)\s*CASE\s*[）\)]', '', s, flags=re.I)
    # Remove standalone star markers like *28033* or *
    s = re.sub(r'\*+\d*\*+', ' ', s)
    s = re.sub(r'[*#]', '', s)
    # Strip tail box count parentheses safely
    s = clean_brackets(s)
    s = re.sub(r'[\(（]\s*[\)）]', '', s)
    # Clean whitespace and trailing punctuation
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'[\s,\-/]+$', '', s).strip()
    return s

def extract_pack(text: str) -> str:
    for pat in PACK_PATTERNS:
        m = pat.search(text)
        if m:
            val = m.group(1).strip()
            val = re.sub(r'\s+', '', val)
            return val.upper()
    return ''

def main():
    rules = json.loads(RULES_PATH.read_text())
    blocked_ids = set(rules.get('blocked_item_ids', []))
    blocked_patterns = [p.lower() for p in rules.get('blocked_name_patterns', [])]
    manual_cats = rules.get('manual_item_category', {})

    df = pd.read_excel(EXCEL_PATH, dtype=str).fillna('')
    products = []
    cleaning_diffs = []
    bracket_fixes = []
    code_cleaning_samples = []

    has_cjk = re.compile(r'[\u4e00-\u9fff]')

    for _, row in df.iterrows():
        item_id = str(row.get('Product_ID', '')).strip()
        raw_en = str(row.get('Product_English_Name', '')).strip()
        raw_zh = str(row.get('Product_Chinese_Name', '')).strip()

        if not item_id or item_id in blocked_ids:
            continue
        lower_en = raw_en.lower()
        if any(bp in lower_en for bp in blocked_patterns):
            continue

        # If item has no Chinese characters in raw data, check verified translation list
        if not has_cjk.search(raw_zh) and item_id in TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH:
            raw_zh = TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH[item_id]

        # Determine category
        cat = manual_cats.get(item_id)
        if not cat:
            prefix = item_id[0] if item_id else ''
            cat_map = {
                '1': 'meat',
                '2': 'produce',
                '3': 'seafood',
                '4': 'pantry',
                '5': 'preserved',
                '6': 'supplies',
                '7': 'dry',
                '8': 'cleaning',
                '9': 'prepared'
            }
            cat = cat_map.get(prefix, 'pantry')

        name_en = clean_name(raw_en, is_zh=False)
        name_zh = clean_name(raw_zh, is_zh=True)
        pack = extract_pack(raw_en) or extract_pack(raw_zh)
        storage = determine_storage(raw_en, raw_zh, cat)

        # Strictly ensure parenthesis balance
        if name_en.count('(') != name_en.count(')'):
            name_en = name_en.replace('(', '').replace(')', '')
        if name_zh.count('(') != name_zh.count(')'):
            name_zh = name_zh.replace('(', '').replace(')', '')

        # Record bracket fix samples
        orig_zh_norm = raw_zh.replace('（', '(').replace('）', ')')
        if re.search(r'\(\d+\)$', orig_zh_norm) and not re.search(r'\(\d+\)$', name_zh):
            bracket_fixes.append({
                "id": item_id,
                "raw_zh": raw_zh,
                "clean_zh": name_zh,
                "balanced": name_zh.count('(') == name_zh.count(')')
            })

        # Record supplier code cleaning samples
        if any(pat.search(raw_en) or pat.search(raw_zh) for pat in SUPPLIER_CODE_PATTERNS):
            code_cleaning_samples.append({
                "id": item_id,
                "raw_en": raw_en,
                "clean_en": name_en,
                "raw_zh": raw_zh,
                "clean_zh": name_zh
            })

        if name_en != raw_en or name_zh != raw_zh:
            cleaning_diffs.append({
                "id": item_id,
                "before_en": raw_en,
                "after_en": name_en,
                "before_zh": raw_zh,
                "after_zh": name_zh
            })

        products.append({
            "id": item_id,
            "name": name_en,
            "nameZh": name_zh,
            "rawName": raw_en,
            "category": cat,
            "packSize": pack,
            "storage": storage,
            "active": True
        })

    OUT_JSON.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    storage_counts = Counter(p['storage'] or 'unspecified' for p in products)
    category_storage: dict[str, dict[str, int]] = {}
    for p in products:
        c = p['category']
        s = p['storage'] or 'unspecified'
        category_storage.setdefault(c, Counter())[s] += 1

    report = {
        "total_active_products": len(products),
        "storage_summary": dict(storage_counts),
        "storage_by_category": {k: dict(v) for k, v in category_storage.items()},
        "bracket_fixes_count": len(bracket_fixes),
        "bracket_fixes_sample": bracket_fixes[:15],
        "code_cleaning_count": len(code_cleaning_samples),
        "code_cleaning_sample": code_cleaning_samples[:15],
        "cleaning_diffs_count": len(cleaning_diffs),
        "cleaning_diffs_sample": cleaning_diffs[:20],
        "real_items_translated_count": len(TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH),
        "translations_applied": [
            {"id": k, "en": next((p['name'] for p in products if p['id'] == k), ''), "zh_draft": v}
            for k, v in TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH.items()
        ],
        "pack_size_extracted_count": sum(bool(p['packSize']) for p in products)
    }
    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Import finished. Products: {len(products)}. Storage: {dict(storage_counts)}. Bracket fixes: {len(bracket_fixes)}. Code removals: {len(code_cleaning_samples)}")

if __name__ == '__main__':
    main()
