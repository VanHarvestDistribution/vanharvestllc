#!/usr/bin/env python3
"""Build the public Van Harvest catalog data from Stocklist.xls with refined cleaning.

Requirements:
1. Re-classify non-seafood items out of Seafood:
   - Fries 34000-34089 (34064, etc.) -> prepared
   - Meat items (beef balls, pork sausage, kebabs, etc.) -> meat
   - Hot pot soup bases 3398x, seasonings, dashi, batter, vinegar, sauces -> pantry
   - Sushi trays, bento boxes, containers, chopsticks -> supplies
   - Only genuine fish, shrimp, crab, shellfish, squid, roe, and seafood products (fish balls, crab stick) remain in Seafood.
2. Storage semantics:
   - Explicit frozen: Frozen/FRZ/FZN/冷冻/冻/急冻/fries/tater tots/onion rings/chicken nuggets/dumplings/wonton/dim sum/potstickers/edamame/fish balls/etc. -> frozen
   - Explicit fresh OR category in (meat, seafood, produce) and not frozen -> refrigerated
   - Supplies & cleaning -> empty
   - Otherwise unidentifiable -> empty string (never default to shelf-stable)
3. Code cleaning:
   - Remove leading slash/dash codes like "90/63/00 ", "80/45/27 ", "2024/7415/9373 "
   - Remove leading internal IDs like "641614R ", "91914 ", "1400C "
   - Remove pure numeric brackets like "(13054)", "(13507)", "(19341)"
   - Remove "1-41310 "
   - Correct spellings: "Favor" -> "Flavor", "SoicyMini" -> "Spicy Mini"
   - Retain pack sizes like 12oz, 40LB, 2x5LB, and shrimp ranges like 16-20, 21-25.
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
    (re.compile(r'\bFavor\b', re.I), 'Flavor'),
    (re.compile(r'SoicyMini', re.I), 'Spicy Mini '),
    (re.compile(r'\b1400C\b', re.I), ''),
    (re.compile(r'\bPATEL\b', re.I), ''),
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
    re.compile(r'[（(]?\s*海鲜\s*[-—,:]?\s*保鲜不保活\s*[,，]?\s*不退货\s*[）)]?', re.I),
    re.compile(r'保鲜不保活\s*[,，]?\s*不退货', re.I),
    re.compile(r'保鲜不保活', re.I),
]

PACK_PATTERNS = [
    re.compile(r'\b(\d+(?:\.\d+)?\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PK|PKG|CS|CT|PC|PCS|BAG|BX|CASE|QT)(?:/[A-Z]+)?)\b', re.I),
    re.compile(r'\b(\d+\s*x\s*[\d\.]+\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PC|PKG|CT))\b', re.I),
    re.compile(r'(\d+LB(?:/[A-Z]+)?)', re.I),
    re.compile(r'(\d+/\d+\s*(?:OZ|LB|CS|BX))', re.I),
]

SHRIMP_RANGES = {
    '10-15', '10-20', '16-20', '16-22', '20-30', '21-25', '26-30', '26-40', '27/36',
    '30-40', '31-35', '31-40', '36-40', '40-50', '40-60', '40/50', '40/60', '41-50',
    '51-60', '61-70', '71-90', '80/100', '91-110', '1/2', '3/8', '5/16', '7/16', '1/4', '3/4'
}

def clean_brackets(text: str) -> str:
    """Safely strip tail digits in parentheses and guarantee paired brackets."""
    t = text.replace('（', '(').replace('）', ')')
    t = re.sub(r'\s*\(\d+\)\s*$', '', t)
    t = t.replace('VALAY)6000', 'VALAY 6000').replace("Ecopax/200')", "Ecopax 200'").replace('（独稻', '(独稻)')
    diff = t.count('(') - t.count(')')
    if diff > 0:
        t = re.sub(r'\(([^\)]*)$', r'\1', t)
    elif diff < 0:
        t = re.sub(r'^([^\(]*)\)', r'\1', t)
    return t.strip()

def clean_internal_codes_and_leading(s: str) -> str:
    """Strip leading slash/dash codes, item numbers, and pure numeric brackets while preserving pack sizes and counts."""
    # 1. 1-41310 prefix
    s = re.sub(r'^\s*1-\d{4,}\s+', '', s)
    s = re.sub(r'\b1-\d{4,}\b', '', s)
    s = re.sub(r'^\s*\d{3,}[A-Z]\s+', '', s)

    # Strip embedded/trailing slash numbers or internal codes like 2024/7415/9373 or 641614R
    s = re.sub(r'\b(?:\d{2,}/)+\d{2,}\b', '', s)
    s = re.sub(r'\b\d{5,}[A-Z]*\b', '', s)
    s = re.sub(r'\b\d{4,}[A-Z]\b', '', s)
    s = re.sub(r'[\(（]\s*\d{4,}\s*[\)）]', '', s)
    s = re.sub(r'[\(（]\s*(?:\d+[/&x\-]\d+)+\s*[\)）]', '', s)

    # 2. Leading slash/dash code e.g. "90/63/00 ", "2024/7415/9373 "
    m = re.match(r'^((?:\d+[/-])+\d+)\s+', s)
    if m:
        code = m.group(1)
        if code not in SHRIMP_RANGES and not re.match(r'^\d+/\d+\s*(?:oz|lb|can|ct|pk)', s, flags=re.I):
            s = s[len(m.group(0)):].strip()

    # 3. Leading numeric/alpha code e.g. "641614R ", "91914 ", "1400C ", "74915 "
    m2 = re.match(r'^(\d{4,}[A-Z]*)\s+', s)
    if m2:
        code = m2.group(1)
        if not re.match(r'^\d+\s*(?:lb|oz|gal|kg|g|ml|pc|ct|cs|pk|box|case)\b', s, flags=re.I):
            s = s[len(m2.group(0)):].strip()

    # 4. Pure numeric brackets e.g. (13054), (13507), (19341), (11445/35)
    s = re.sub(r'\(\s*\d{4,}\s*\)', '', s)
    s = re.sub(r'\(\s*\d{3,}/\d+\s*\)', '', s)
    s = re.sub(r'\(\s*(?:\d+[/&x\-]\d+)+\s*\)', '', s)

    return s.strip()

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
    s = re.sub(r'\*+\d*\*+', ' ', s)
    s = re.sub(r'[*#]', '', s)
    s = clean_internal_codes_and_leading(s)
    s = clean_brackets(s)
    s = re.sub(r'[\(（]\s*[\)）]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'[\s,\-/]+$', '', s).strip()
    return s

def classify_product(item_id: str, raw_en: str, raw_zh: str, manual_cats: dict[str, str]) -> str:
    # 1. Manual override if specified
    if item_id in manual_cats:
        return manual_cats[item_id]

    text = f"{raw_en} {raw_zh}".lower()

    # 2. Check items starting with '3' (originally in Seafood segment)
    if item_id.startswith('3'):
        # Non-food restaurant supplies
        if any(k in text for k in [
            'sushi box', 'bento box', 'sushi tray', 'sushi container', 'plates jn-10', 'lids jn-10',
            'baran yamagata', 'lunch box', 'envelope chopstick', 'bamboo chopstick', 'jn-78b', 'jn-68b',
            'tz-010', 'tz-008', 'fh-64', 'fh-63', 'op-1.0', 'op305', 'fh-307', 'fh-306', 'jn-810',
            'jn-305', 'fh-304', 'jn-10', '割箸', '竹箸'
        ]):
            return 'supplies'

        # Sauces, seasonings, vinegars, dashi, batter, soup bases
        if any(k in text for k in [
            'vinegar', 'sauce', 'seasoning', 'miso', 'wasabi', 'mayonnaise', 'glaze', 'bonito flake',
            'hondashi', 'soup base', 'soup stock', 'tempura batter', 'batter mix', 'kalbi sauce',
            'bulgogi sauce', 'bbq sauce', 'beef bouillon', 'dry pot seasoning', 'hot pot soup',
            'hot pot flavor', 'broth flavor', 'sesame seed', 'mustard powder', 'fried garlic',
            'fried onion', 'yuzu citrus juice', '味曾', '味增', '寿司醋', '寿司有味醋', '芥辣粉', '美乃滋',
            '照烧汁', '烧鳗汁', '柴鱼片', '鱼味精', '炸粉', '天妇罗粉', '底料', '汤料', '火锅底料', '香锅酱',
            '芝麻', '汤精', '牛肉汤粉', '干锅酱', '油蒜酥', '油葱酥', '柚子汁'
        ]):
            return 'pantry'

        # Meat items: beef balls, pork sausage, kebabs, chicken nuggets, etc.
        if any(k in text for k in [
            'beef kebab', 'cured pork', 'pork patty', 'pork sausage', 'taiwan brand porkpatty',
            'beef tendon ball', 'beef meat ball', 'beef patty ball', 'c-25 beef', 'c-28 beef',
            'chicken fritters', 'chicken nuggets', 'sweet & sour chicken', 'corn dogs', 'beef short plate',
            'lamb bnls', 'lamb shoulder', '亲亲肠', '牛肉丸', '牛筋丸', '牛肉串', '台湾香肠', '猪肉玉米亲亲肠',
            '鸡肉玉米亲亲肠', '甜酸鸡', '炸鸡块', '鸡粒', '精品肥牛', '羊肩肉'
        ]):
            return 'meat'

        # Fries, onion rings, okra, corn nuggets, dim sum, dumplings, noodles, edamame, seaweed salad, rice pudding, crackers
        if any(k in text for k in [
            'fries', 'french fried', 'tater tots', 'onion rings', 'okra', 'corn nugget', 'dumpling',
            'wonton', 'potsticker', 'gyoza', 'shumai', 'edamame', 'soybean', 'seaweed salad', 'wakame',
            'dried kelp', 'mashed taro', 'rice pudding', 'udon noodle', 'yaki soba', 'sushi nori',
            'sushi ginger', 'takoyaki', 'octopus ball', 'fish cake', 'kamaboko', 'fried fish cake',
            'fish bean curd', 'inari', 'sushi egg', 'tamago', 'fish ball', 'cuttle fish ball',
            'lobster ball', 'prawn flavored crackers', 'fortune pack', 'rice cake', 'soy crepe',
            '薯条', '洋葱环', '炸秋葵', '炸玉米粒', '饺', '馄饨', '煎饺', '烧卖', '毛豆', '海带沙拉', '海带芽',
            '昆布', '芋泥', '八宝饭', '乌冬面', '荞麦面', '紫菜', '姜片', '章鱼烧', '鱼饼', '鱼豆腐', '腐皮',
            '玉子烧', '鱼丸', '花枝丸', '龙虾球', '虾片', '福袋', '糍粑', '年糕'
        ]):
            return 'prepared'

    # Standard prefix map
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
    prefix = item_id[0] if item_id else ''
    return cat_map.get(prefix, 'pantry')

def determine_storage(raw_en: str, raw_zh: str, category: str) -> str:
    # Non-food categories (supplies, cleaning) never have refrigerated or frozen storage
    if category in ['supplies', 'cleaning']:
        return ''

    combined = f"{raw_en} {raw_zh}".lower()

    # 1. Explicit frozen keywords & frozen items
    if any(k in combined for k in [
        'frozen', 'frz', 'fzn', 'frn', '冷冻', '单冻', '排冻', '冻', '急冻',
        'fries', 'french fried', 'tater tots', 'spud queen', 'straight cut', 'crinkle cut',
        'onion ring', 'chicken nugget', 'dumpling', 'wonton', 'potsticker', 'gyoza',
        'dim sum', 'dimsum', 'edamame', 'soybean', 'spring roll', 'egg roll', 'shumai',
        'fish ball', 'beef ball', 'meat ball', 'fish cake', 'kamaboko', 'takoyaki',
        'cured pork', 'sausage', 'corn dog', 'fish tofu',
        '薯条', '洋葱环', '鸡块', '水饺', '锅贴', '馄饨', '煎饺', '烧卖', '小笼包',
        '亲亲肠', '牛肉丸', '牛筋丸', '鱼丸', '花枝丸', '鱼豆腐', '毛豆'
    ]):
        return 'frozen'

    # 2. Explicit fresh keywords
    zh_check = raw_zh.replace('保鲜', '').replace('海鲜', '')
    if any(k in raw_en.lower() for k in ['fresh']) or any(k in zh_check for k in ['新鲜', '鲜', '活']):
        return 'refrigerated'

    # 3. Meat, seafood, produce default to refrigerated when not frozen
    if category in ['meat', 'seafood', 'produce']:
        return 'refrigerated'

    # 4. Other categories: leave empty
    return ''

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
    reclassified_from_seafood = []

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

        # Determine category with refined logic
        cat = classify_product(item_id, raw_en, raw_zh, manual_cats)
        if item_id.startswith('3') and cat != 'seafood':
            reclassified_from_seafood.append({
                "id": item_id,
                "name": raw_en,
                "nameZh": raw_zh,
                "old_category": "seafood",
                "new_category": cat
            })

        name_en = clean_name(raw_en, is_zh=False)
        name_zh = clean_name(raw_zh, is_zh=True)
        placeholder_names = {'', '*', '**', '***', '****', 'n/a', 'na', '......', '...'}
        if name_en.strip().lower() in placeholder_names and name_zh.strip().lower() in placeholder_names:
            continue
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
        if raw_en != name_en or raw_zh != name_zh:
            code_cleaning_samples.append({
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
        "reclassified_from_seafood_count": len(reclassified_from_seafood),
        "reclassified_from_seafood": reclassified_from_seafood,
        "code_cleaning_count": len(code_cleaning_samples),
        "code_cleaning_sample": code_cleaning_samples[:30],
        "pack_size_extracted_count": sum(bool(p['packSize']) for p in products)
    }
    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Import finished. Total products: {len(products)}.")
    print(f"Seafood reclassified out: {len(reclassified_from_seafood)}")
    print(f"Storage counts: {dict(storage_counts)}")
    print(f"Cleaned names: {len(code_cleaning_samples)}")

if __name__ == '__main__':
    main()
