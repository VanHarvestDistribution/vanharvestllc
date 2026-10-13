#!/usr/bin/env python3
"""Build the public Van Harvest catalog from Stocklist.xls.

Public data stays price-free and does not expose supplier/internal remarks.  Product
categories are determined from bilingual product names first; Item # bands are only
a legacy fallback for records with no usable product language.
"""
from __future__ import annotations

import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
# Excel export from the warehouse system. Pass a path as the first argument, set STOCKLIST_PATH,
# or drop the file at data/source/Stocklist.xls (git-ignored).
EXCEL_PATH = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get('STOCKLIST_PATH', ROOT / 'data/source/Stocklist.xls'))
RULES_PATH = ROOT / 'data/catalog-rules.json'
OUT_JSON = ROOT / 'src/data/products.json'
REPORT_JSON = ROOT / 'data/stocklist-import-report.json'
ROUTE_HISTORY_PATH = ROOT / 'data/product-route-redirects.json'
RAW_NAME_LEDGER_PATH = ROOT / 'data/catalog-source-name-ledger.json'

# Existing verified Chinese drafts are kept when source cells contain only English.
TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH: dict[str, str] = {
    '11412': '冷冻鸡腿肉', '11413': '冷冻全鸡腿', '12127': '带骨牛眼排 (Ribeye)',
    '12268': '冷冻牛后腿眼肉 (Eye Round)', '12279': '冷冻牛针扒 (Inside Round)',
    '21404': '舞菇 (灰树花)', '21405': '有机真姬菇 (蟹味菇)', '21406': '真姬菇 (蟹味菇)',
    '24491': '无骨羊腿肉 (Blue Sky)', '32011': '40/60 带子 (蓝宝牌)', '37202': '无骨羊肩肉',
    '53008': '300UP 珍珠小玉米', '60524': 'Morsoft 白色大卷卫生纸 (12卷)',
    '65007': 'Kari-Out 205 发泡餐盒 (200套)', '65340': 'Ecopax PP883S 单格塑料打包餐盒 (象牙白)',
    '65350': 'Ecopax PP225 单格塑料餐盒 (白色)', '65378': 'PP993S 单格发泡餐盒 (象牙白)',
    '65379': 'Ecopax RE993S 单格发泡餐盒 (200套)', '67053': 'A204S 白色塑料汤匙 (1000支)',
    '67420': 'Biocean PP225 单格打包盒 6x6 (250套)', '71053': '商用植物棕榈油',
    '85060': '标准瓦楞纸箱 12x12x18',
}

# Source rows whose English column is an internal code or missing now receive a
# concise public English draft derived from their Chinese product name.
ENGLISH_NAME_DRAFTS: dict[str, str] = {
    '25687': 'Peanut Tangyuan',
    '26332': 'Yonghe Original Soy Milk Powder',
    '26350': 'Dao Xiang Cun Old-Style Bread',
    '26353': 'Durian Crispy Pastry',
    '26804': 'I Mei Scallion Soda Crackers',
    '28105': 'Eel Fish Paste',
    '28108': 'Hot Pot Tripe Layers',
    '28109': 'Hot Pot Beef Tripe',
    '28142': 'Synear Premium Shrimp Dumplings',
    '28143': 'Synear Shrimp and Celery Dumplings',
    '28144': 'Synear Shrimp and Pea Shoot Dumplings',
    '28145': 'Synear Shrimp and Corn Dumplings',
    '40420': 'Frozen Duckling (Fortune)',
    '43205': 'Lee Kum Kee Less Sodium Soy Sauce 5 Gal',
    '44524': 'Prik Curry Paste 48 x 4 oz',
    '64544': 'FH-78W White Container 150/CS',
    '65348': 'Q-1 White Single-Compartment Container 200/CS',
    '67413': 'Biocean Large Paper Bag 13 x 7 x 17 in (250)',
    '67414': 'Biocean Small Paper Bag 10 x 5 x 13 in (250)',
    '73145': 'Oyster Pancake Mix 270g',
    '73259': "Chef's Choice XL Rice Stick 10mm 30x12oz",
    '73539': 'Lianjiang Fish Noodles 200g',
    '74060': 'Spaghetti 2x10LB',
    '74125': 'Dah Sing Large Egg Roll Wrappers 7x7',
    '80157': 'Sanitizing Hand Soap and Alcohol Kit',
    '81060': 'Chef Hat 100pcs',
    '81601': '50LB Grease Filter',
    '92961': 'Scallion Oil Steamed Roll 300g',
    '99915': 'Chicken Leg 40LB/CS',
}

# Exact supplier/model prefixes requested for food names only.  The function below
# never applies this map to restaurant-supply or cleaning items.
FOOD_PREFIXES_BY_ITEM: dict[str, tuple[str, ...]] = {
    '12151': ('W58030',), '20032': ('MACAU99',), '21043': ('V5122',),
    '24403': ('LL0166',), '24490': ('G456',), '25532': ('A04103',),
    '32009': ('U-10', 'U/10'), '33250': ('U-10', 'U10'), '33257': ('OLDF',),
    '33258': ('U-10', 'U10'), '33259': ('OLDF',), '34064': ('LW204',),
    '34065': ('CTC8701',), '34081': ('CTE94',), '35131': ('SD-51',),
    '37100': ('C-28', 'ACC'), '37104': ('C-26', 'ACC'), '37105': ('C-20', 'ACC'),
    '37202': ('LL0339',), '40314': ('NJ0804NT',), '72049': ('A10011',),
    '91004': ('E102001',), '92603': ('B-07',), '92624': ('B-02', 'ACC'),
    '92626': ('B-08',), '92841': ('A-11T', 'ACC'), '92635': ('E06',),
}

SPELLING_FIXES = [
    (r'\bSpareib\b', 'Sparerib'), (r'\bPomegrante\b', 'Pomegranate'),
    (r'\bMurshrooms?\b', 'Mushroom'), (r'\bContaiuer\b', 'Container'),
    (r'\bTeriyke\b', 'Teriyaki'), (r'\bSchredded\b', 'Shredded'),
    (r'\bFack Mask\b', 'Face Mask'), (r'\bSeedweed\b', 'Seaweed'),
    (r'\bApproxmi\b', 'Approx.'), (r'\bappox\b', 'approx.'),
    (r'\bFEZ\b', 'Frozen'), (r'\bWholeWing\b', 'Whole Wing'),
    (r'\(Med\)Wing', 'Medium Wing'), (r'\bSmithfiled\b', 'Smithfield'), (r'\bBNLS\b', 'Boneless'),
    (r'\bFavor\b', 'Flavor'), (r'\bBISUIT\b', 'Biscuit'), (r'SoicyMini', 'Spicy Mini'),
]

SUPPLIER_CODE_PATTERNS = [
    r'\bPVC-\d+\b', r'\bFLS-\d+(?:/\d+)?\b', r'\bBA-FLS\b', r'\bA-FLS\b',
    r'\bPATEL\s*\d*[A-Z]?\b', r'\bLIPON\s+LGT\b', r'\b10014/Ramarc\b',
    r'\bRamarc/10014\b', r'\b68/4941\b', r'\b011334\b', r'\b#\d+#',
    r'\(#\d+[\)）]', r'\bDU\d+\b', r'[\(（]\s*K\s*[\)）]', r'\bK\d{5,}\b',
]

INTERNAL_REMARK_PATTERNS = [
    r'[\(（]\s*棕色箱\s*[）\)]\s*H\s*\d*', r'[\(（]\s*白箱\s*[）\)]\s*H\s*\d*',
    r'[\(（]\s*请当场检查[^\)）]*[\)）]', r'[\(（]\s*Check Immediately\s*[\)）]',
    r'\bNO RETURN\b', r'\b100%\b', r'[\-\s]+PC\b',
    r'[\(（]\s*海鲜\s*[）\)]\s*[\-—]?\s*磅', r'[\(（]\s*海鲜\s*[）\)]',
    r'[（(]?\s*海鲜\s*[-—,:]?\s*保鲜不保活\s*[,，]?\s*不退货\s*[）)]?',
    r'保鲜不保活\s*[,，]?\s*不退货', r'保鲜不保活',
]

PACK_PATTERNS = [
    re.compile(r'\b(\d+(?:\.\d+)?\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PK|PKG|CS|CT|PC|PCS|BAG|BX|CASE|QT)(?:/[A-Z]+)?)\b', re.I),
    re.compile(r'\b(\d+\s*x\s*[\d\.]+\s*(?:LB|LBS|OZ|GAL|KG|G|ML|PC|PKG|CT))\b', re.I),
    re.compile(r'(\d+LB(?:/[A-Z]+)?)', re.I), re.compile(r'(\d+/\d+\s*(?:OZ|LB|CS|BX))', re.I),
]

SHRIMP_RANGES = {
    '10-15', '10-20', '16-20', '16-22', '20-30', '21-25', '26-30', '26-40', '27/36',
    '30-40', '31-35', '31-40', '36-40', '40-50', '40-60', '40/50', '40/60', '41-50',
    '51-60', '61-70', '71-90', '80/100', '91-110', '1/2', '3/8', '5/16', '7/16', '1/4', '3/4',
}

# Specific items the owner identified during the Seafood review.
FORCED_CATEGORIES = {
    '35188': 'pantry', '35199': 'pantry', '35224': 'supplies', '35149': 'supplies', '35650': 'supplies',
}


def contains(text: str, terms: tuple[str, ...]) -> bool:
    """Match English terms on word boundaries; retain literal matching for CJK terms.

    Plain substring checks turn ``watermelon`` into ``water`` and ``peeled`` into
    ``eel``.  Public catalog classification must not make those false matches.
    """
    for term in terms:
        if re.search(r'[a-z0-9]', term, flags=re.I):
            if re.search(rf'(?<![a-z0-9]){re.escape(term)}(?![a-z0-9])', text, flags=re.I):
                return True
        elif term in text:
            return True
    return False


def clean_brackets(text: str) -> str:
    """Remove only complete trailing numeric brackets and preserve paired brackets."""
    value = text.replace('（', '(').replace('）', ')')
    value = re.sub(r'\s*\(\d+\)\s*$', '', value)
    value = value.replace('VALAY)6000', 'VALAY 6000').replace("Ecopax/200')", "Ecopax 200'")
    while value.count('(') > value.count(')'):
        value = re.sub(r'\(([^()]*)$', r'\1', value)
    while value.count(')') > value.count('('):
        value = re.sub(r'^([^()]*)\)', r'\1', value)
    return value.strip()


def remove_item_prefixes(value: str, item_id: str, category: str) -> str:
    if category in {'supplies', 'cleaning'}:
        return value
    for prefix in FOOD_PREFIXES_BY_ITEM.get(item_id, ()):
        value = re.sub(re.escape(prefix), '', value, flags=re.I)
    # ACC is an internal maker label when it remains next to a food name/pack value.
    if item_id in {'37100', '37104', '37105', '92624', '92841'}:
        value = re.sub(r'ACC', '', value, flags=re.I)
    return value


def clean_internal_codes_and_leading(value: str) -> str:
    # Preserve saleable pack and shrimp-count values while removing internal source IDs.
    value = re.sub(r'^\s*1-\d{4,}\s+', '', value)
    value = re.sub(r'\b1-\d{4,}\b', '', value)
    value = re.sub(r'\b(?:\d{2,}/){2,}\d{2,}\b', '', value)
    value = re.sub(r'\b\d{5,}[A-Z]*\b', '', value)
    value = re.sub(r'\b\d{4,}[A-Z]\b', '', value)
    value = re.sub(r'[\(（]\s*\d{4,}\s*[\)）]', '', value)
    value = re.sub(r'[\(（]\s*(?:\d+[/&x\-]\d+)+\s*[\)）]', '', value)

    match = re.match(r'^((?:\d+[/-])+\d+)\s+', value)
    if match:
        code = match.group(1)
        if code not in SHRIMP_RANGES and not re.match(r'^\d+/\d+\s*(?:oz|lb|can|ct|pk)', value, flags=re.I):
            value = value[len(match.group(0)):].strip()

    match = re.match(r'^(\d{4,}[A-Z]*)\s+', value)
    if match and not re.match(r'^\d+\s*(?:lb|oz|gal|kg|g|ml|pc|ct|cs|pk|box|case)\b', value, flags=re.I):
        value = value[len(match.group(0)):].strip()
    return value


def split_joined_english_words(value: str) -> str:
    # Safe CamelCase split, then targeted joins missed by capitalization boundaries.
    value = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', value)
    value = re.sub(r'(Onion)(?=\d)', r'\1 ', value)
    substitutions = {
        'Cured Pork Patty Link': 'Cured Pork Patty Link', 'Spicy Mini': 'Spicy Mini',
        'Iceless Green Onion': 'Iceless Green Onion', 'Green Onion': 'Green Onion',
        'Pork Spare Ribs': 'Pork Spare Ribs', 'Milk Bun': 'Milk Bun',
        'Pork Bun': 'Pork Bun', 'Soupy Dumpling': 'Soupy Dumpling',
    }
    for before, after in substitutions.items():
        value = value.replace(before, after)
    return value


def clean_name(raw: str, item_id: str, category: str, is_zh: bool = False) -> str:
    value = raw.strip()
    for pattern, replacement in SPELLING_FIXES:
        value = re.sub(pattern, replacement, value, flags=re.I)
    for pattern in SUPPLIER_CODE_PATTERNS:
        value = re.sub(pattern, '', value, flags=re.I)
    for pattern in INTERNAL_REMARK_PATTERNS:
        value = re.sub(pattern, '', value, flags=re.I)
    value = re.sub(r'PVC-\d+', '', value, flags=re.I)
    value = re.sub(r'\*+\d*\*+', ' ', value)
    value = value.replace('*', '').replace('#', '')
    value = remove_item_prefixes(value, item_id, category)
    value = clean_internal_codes_and_leading(value)
    value = clean_brackets(value)
    value = re.sub(r'[\(（]\s*[\)）]', '', value)
    if not is_zh:
        value = split_joined_english_words(value)
    value = re.sub(r'\s+', ' ', value).strip()
    value = re.sub(r'[\s,\-/]+$', '', value).strip()
    value = re.sub(r'^[-–—]+\s*', '', value).strip()
    return value


def classify_2xx_product(text: str) -> str | None:
    """Classify former Produce products by bilingual product semantics, not Item #."""
    # Non-food restaurant materials.
    if contains(text, ('sushi box', 'sushi tray', 'bento box', 'container', 'tray', 'chopstick', 'joss paper', 'joss stick', '金银纸', '香线', '寿司盒', '寿司盘', '筷子', '餐盒', '纸袋')):
        return 'supplies'
    # Canned, pickled, salted and preserved foods take precedence over ingredient words.
    if contains(text, ('preserved', 'perserved', 'pickled', 'canned', 'salted', 'fermented', 'saline', 'bean curd', 'eagle coin', 'dace', 'congee', 'peanut soup', 'white fungus soup', '榨菜', '腌', '罐头', '罐装', '咸蛋', '皮蛋', '豆豉', '肉松', '泡菜', '鱼罐', '腐乳', '笋干', '海带丝', '八宝粥', '银耳羹')):
        return 'preserved'
    # Pantry liquids, sauces, dairy drinks and seasonings.
    if contains(text, ('sauce', 'seasoning', 'soup base', 'hot pot base', 'oil', 'vinegar', 'drink', 'beverage', 'soda', 'tea', 'juice', 'milk tea', 'soy milk', 'coconut milk', 'yogurt', 'water', 'curry paste', 'cooking wine', 'egg', '料酒', '酱', '醋', '调料', '底料', '饮料', '汽水', '凉茶', '豆奶', '豆浆', '椰奶', '酸奶', '鸡蛋', '鹌鹑蛋')):
        return 'pantry'
    # Dry staples and powders.
    if contains(text, ('rice noodle', 'rice stick', 'vermicelli', 'noodle', 'flour', 'powder', 'cornmeal', 'bean thread', 'ramen', 'cracker meal', 'dried mango', 'freeze dried', 'dried fruit', '米粉', '面粉', '粉丝', '干面', '米线', '豆浆粉', '柿饼', '芒果干')):
        return 'dry'
    # Prepared/frozen meals and snack products precede raw meat and seafood words.
    if contains(text, ('fries', 'tater', 'onion ring', 'dumpling', 'wonton', 'gyoza', 'potsticker', 'bun', 'shumai', 'dim sum', 'rice cake', 'tangyuan', 'snack', 'biscuit', 'cookie', 'cake', 'pastry', 'bread', 'candy', 'jelly', 'chip', 'crisp', 'mochi', 'fish paste', 'fish ball', 'fish cake', 'fish tofu', 'crab stick', 'shrimp paste', 'seafood tofu', 'frozen simulated', 'hot pot combo', 'frozen vegan', 'skewer', 'fried tofu', 'tofu pudding', 'roasted green peas', 'roasted sunflower', 'sunflower seed', 'broad bean', 'peanut', 'potato twist', '薯条', '洋葱环', '水饺', '馄饨', '煎饺', '烧卖', '包子', '馒头', '汤圆', '糍粑', '年糕', '零食', '饼干', '蛋糕', '面包', '月饼', '果冻', '薯片', '鱼滑', '鱼丸', '鱼饼', '鱼豆腐', '虾滑', '花枝丸', '龙虾球', '蟹棒', '火锅珍宝', '盐酥鸡', '麻糬', '瓜子', '花生', '青豆', '豆腐花', '香脆')):
        return 'prepared'
    # Strict Produce must win over misleading Chinese animal/seafood characters in product names
    # such as 牛角椒、牛油果、鸡心黄皮、海鲜菇 and 蟹味菇.
    if contains(text, ('broccoli', 'napa', 'cabbage', 'onion', 'celery', 'pepper', 'carrot', 'pea', 'bean', 'corn', 'potato', 'yam', 'avocado', 'watermelon', 'fruit', 'pear', 'mushroom', 'tofu', 'bok choy', 'choy', 'spinach', 'eggplant', 'chive', 'daikon', 'taro', 'beet', 'bamboo', 'lettuce', 'cucumber', 'melon', 'longan', 'dragon fruit', 'grape', 'lemon', 'plum', 'pomelo', 'jicama', 'chestnut', 'durian', 'vegetable', 'gobo', '冷冻蔬菜', '芥兰', '白菜', '青菜', '青葱', '洋葱', '萝卜', '芹菜', '辣椒', '红椒', '玉米', '土豆', '番薯', '牛油果', '西瓜', '菇', '豆腐', '油菜', '菠菜', '茄子', '韭菜', '白萝卜', '芋头', '茭白', '百香果', '芦笋', '莴笋', '水果', '蔬菜', '黄瓜', '龙眼', '火龙果', '葡萄', '柠檬', '柚子', '凉薯', '板栗', '榴莲', '牛蒡')):
        return 'produce'
    # Raw fish and shellfish (all sauces/canned/ready-to-cook cases were handled above).
    if contains(text, ('fish', 'saury', 'mackerel', 'sole', 'croaker', 'tilapia', 'salmon', 'squid', 'octopus', 'cuttlefish', 'shrimp', 'prawn', 'crab', 'lobster', 'scallop', 'clam', 'mussel', 'oyster', 'eel', 'sea cucumber', 'catfish', 'pompano', 'cod', 'halibut', 'sea bass', 'butterfish', 'fish roe', '酸菜鱼', '鱼片', '鱼头', '鱿', '章鱼', '墨鱼', '虾', '蟹', '龙虾', '贝', '生蚝', '鳗', '带鱼', '鲳', '黄花鱼', '鲈鱼', '干贝', '海鲜', '秋刀鱼', '龙蜊鱼', '黄瓜鱼')):
        return 'seafood'
    # Meat and poultry including offal, frog legs, squab and quail.
    if contains(text, ('chicken', 'duck', 'goose', 'pork', 'beef', 'lamb', 'goat', 'mutton', 'sausage', 'tripe', 'tendon', 'belly', 'chicken wing', 'duck wing', 'paws', 'feet', 'frog leg', 'squab', 'quail', '鸡', '鸭', '鹅', '乌鸡', '猪', '牛', '羊', '凤爪', '五花肉', '百叶', '毛肚', '肚', '肉串', '牛腩', '牛筋', '乳鸽', '鹌鹑', '鸡翅', '鸡翼', '鸭翅', '鸭翼')):
        return 'meat'
    return None

def classify_product(item_id: str, raw_en: str, raw_zh: str, manual_cats: dict[str, str]) -> str:
    if item_id in FORCED_CATEGORIES:
        return FORCED_CATEGORIES[item_id]
    if item_id in manual_cats:
        return manual_cats[item_id]
    text = f'{raw_en} {raw_zh}'.lower()

    # Every current 2xx row is assessed from its bilingual product text.
    if item_id.startswith('2'):
        semantic_category = classify_2xx_product(text)
        if semantic_category:
            return semantic_category
        return 'produce'  # only an explicit legacy fallback if no usable product signal exists

    # 3xxxx seafood review: reclassify non-seafood packaging, pantry and prepared foods by name.
    if item_id.startswith('3'):
        if contains(text, ('sushi box', 'bento box', 'sushi tray', 'sushi container', 'plates jn-10', 'lids jn-10', 'baran yamagata', 'lunch box', 'envelope chopstick', 'bamboo chopstick', 'chopstick', '筷子', '寿司盒', '寿司盘', 'tz-010', 'tz-008', 'fh-64', 'fh-63', 'op-1.0', 'op305', 'fh-307', 'fh-306', 'jn-810', 'jn-305', 'fh-304', 'jn-10', '割箸', '竹箸')):
            return 'supplies'
        if contains(text, ('vinegar', 'sauce', 'seasoning', 'miso', 'wasabi', 'mayonnaise', 'glaze', 'bonito flake', 'hondashi', 'soup base', 'soup stock', 'tempura batter', 'batter mix', 'kalbi sauce', 'bulgogi sauce', 'bbq sauce', 'beef bouillon', 'dry pot seasoning', 'hot pot soup', 'hot pot flavor', 'broth flavor', 'sesame seed', 'mustard powder', 'fried garlic', 'fried onion', 'yuzu citrus juice', 'cooking wine', '味曾', '味增', '寿司醋', '寿司有味醋', '芥辣粉', '美乃滋', '照烧汁', '烧鳗汁', '柴鱼片', '鱼味精', '炸粉', '天妇罗粉', '底料', '汤料', '火锅底料', '香锅酱', '芝麻', '汤精', '牛肉汤粉', '干锅酱', '油蒜酥', '油葱酥', '柚子汁', '甜酒')):
            return 'pantry'
        if contains(text, ('beef kebab', 'cured pork', 'pork patty', 'pork sausage', 'taiwan brand porkpatty', 'beef tendon ball', 'beef meat ball', 'beef patty ball', 'c-25 beef', 'c-28 beef', 'chicken fritters', 'chicken nuggets', 'sweet & sour chicken', 'corn dogs', 'beef short plate', 'lamb bnls', 'lamb shoulder', '亲亲肠', '牛肉丸', '牛筋丸', '牛肉串', '台湾香肠', '猪肉玉米亲亲肠', '鸡肉玉米亲亲肠', '甜酸鸡', '炸鸡块', '鸡粒', '精品肥牛', '羊肩肉')):
            return 'meat'
        if contains(text, ('fries', 'french fried', 'spud queen', 'straight cut', 'crinkle cut', 'tater tots', 'onion rings', 'okra', 'corn nugget', 'dumpling', 'wonton', 'potsticker', 'gyoza', 'shumai', 'edamame', 'soybean', 'seaweed salad', 'wakame', 'dried kelp', 'mashed taro', 'rice pudding', 'udon noodle', 'yaki soba', 'sushi nori', 'sushi ginger', 'takoyaki', 'octopus ball', 'fish cake', 'kamaboko', 'fried fish cake', 'fish bean curd', 'inari', 'sushi egg', 'tamago', 'fish ball', 'cuttle fish ball', 'lobster ball', 'prawn flavored crackers', 'fortune pack', 'rice cake', 'soy crepe', '薯条', '洋葱环', '炸秋葵', '炸玉米粒', '饺', '馄饨', '煎饺', '烧卖', '毛豆', '海带沙拉', '海带芽', '昆布', '芋泥', '八宝饭', '乌冬面', '荞麦面', '紫菜', '姜片', '章鱼烧', '鱼饼', '鱼豆腐', '腐皮', '玉子烧', '鱼丸', '花枝丸', '龙虾球', '虾片', '福袋', '糍粑', '年糕')):
            return 'prepared'

    prefix_map = {'1': 'meat', '2': 'produce', '3': 'seafood', '4': 'pantry', '5': 'preserved', '6': 'supplies', '7': 'dry', '8': 'cleaning', '9': 'prepared'}
    return prefix_map.get(item_id[:1], 'pantry')


def determine_storage(raw_en: str, raw_zh: str, category: str) -> str:
    if category in {'supplies', 'cleaning'}:
        return ''
    text = f'{raw_en} {raw_zh}'.lower()
    frozen_terms = ('frozen', 'frz', 'fzn', 'frn', '冷冻', '单冻', '排冻', '冻', '急冻', 'fries', 'french fried', 'tater tots', 'spud queen', 'straight cut', 'crinkle cut', 'onion ring', 'chicken nugget', 'chicken nuggets', 'scallop nugget', 'corn nugget', 'dumpling', 'dumplings', 'wonton', 'wontons', 'potsticker', 'potstickers', 'gyoza', 'dim sum', 'dimsum', 'edamame', 'soybean', 'spring roll', 'spring rolls', 'egg roll', 'egg rolls', 'shumai', 'fish ball', 'beef ball', 'meat ball', 'fish cake', 'kamaboko', 'takoyaki', 'cured pork', 'sausage', 'corn dog', 'corn dogs', 'fish tofu', '薯条', '洋葱环', '鸡块', '水饺', '锅贴', '馄饨', '煎饺', '烧卖', '小笼包', '亲亲肠', '牛肉丸', '牛筋丸', '鱼丸', '花枝丸', '鱼豆腐', '毛豆')
    if contains(text, frozen_terms):
        return 'frozen'
    fresh_text = raw_zh.replace('保鲜', '').replace('海鲜', '')
    if category in {'meat', 'seafood', 'produce'} and ('fresh' in raw_en.lower() or contains(fresh_text, ('新鲜', '鲜', '活'))):
        return 'refrigerated'
    return ''


def extract_pack(text: str) -> str:
    for pattern in PACK_PATTERNS:
        match = pattern.search(text)
        if match:
            return re.sub(r'\s+', '', match.group(1).strip()).upper()
    return ''


def load_previous_categories() -> dict[str, str]:
    if not OUT_JSON.exists():
        return {}
    try:
        return {str(p['id']): str(p['category']) for p in json.loads(OUT_JSON.read_text(encoding='utf-8'))}
    except (json.JSONDecodeError, KeyError):
        return {}


def update_route_history(changes: list[dict[str, str]]) -> list[dict[str, str]]:
    try:
        existing = json.loads(ROUTE_HISTORY_PATH.read_text(encoding='utf-8')).get('redirects', [])
    except (FileNotFoundError, json.JSONDecodeError):
        existing = []
    destinations: dict[str, str] = {}
    source_sets: dict[str, set[str]] = {}
    for entry in existing:
        item_id, source, target = str(entry['id']), str(entry['from']), str(entry['to'])
        source_sets.setdefault(item_id, set()).add(source)
        destinations[item_id] = target
    for change in changes:
        item_id, source, target = change['id'], change['old_category'], change['new_category']
        source_sets.setdefault(item_id, set()).add(source)
        destinations[item_id] = target
    redirects = []
    for item_id in sorted(destinations, key=lambda value: (int(value) if value.isdigit() else value)):
        target = destinations[item_id]
        for source in sorted(source_sets.get(item_id, set())):
            if source != target:
                redirects.append({'id': item_id, 'from': source, 'to': target})
    ROUTE_HISTORY_PATH.write_text(json.dumps({'redirects': redirects}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return redirects


def main() -> None:
    rules = json.loads(RULES_PATH.read_text(encoding='utf-8'))
    blocked_ids = set(rules.get('blocked_item_ids', []))
    blocked_patterns = [str(pattern).lower() for pattern in rules.get('blocked_name_patterns', [])]
    manual_cats = {**rules.get('manual_item_category', {}), **FORCED_CATEGORIES}
    previous_categories = load_previous_categories()

    df = pd.read_excel(EXCEL_PATH, dtype=str).fillna('')
    products: list[dict] = []
    raw_name_ledger: list[dict[str, str]] = []
    name_diffs: list[dict] = []
    bracket_fixes: list[dict] = []
    translated_english: list[dict] = []
    category_changes: list[dict] = []
    has_cjk = re.compile(r'[\u4e00-\u9fff]')
    placeholders = {'', '*', '**', '***', '****', 'n/a', 'na', '......', '...'}

    for _, row in df.iterrows():
        item_id = str(row.get('Product_ID', '')).strip()
        raw_en = str(row.get('Product_English_Name', '')).strip()
        raw_zh = str(row.get('Product_Chinese_Name', '')).strip()
        combined_raw = f'{raw_en} {raw_zh}'.lower()
        if not item_id or item_id in blocked_ids or any(pattern in combined_raw for pattern in blocked_patterns):
            continue

        if not has_cjk.search(raw_zh) and item_id in TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH:
            raw_zh = TRANSLATIONS_FOR_REAL_ITEMS_WITHOUT_ZH[item_id]

        category = classify_product(item_id, raw_en, raw_zh, manual_cats)
        name_en = clean_name(raw_en, item_id, category, is_zh=False)
        name_zh = clean_name(raw_zh, item_id, category, is_zh=True)
        if not name_en and item_id in ENGLISH_NAME_DRAFTS:
            name_en = ENGLISH_NAME_DRAFTS[item_id]
            translated_english.append({'id': item_id, 'nameZh': name_zh, 'englishDraft': name_en})
        if name_en.lower() in placeholders and name_zh.lower() in placeholders:
            continue

        if name_en.count('(') != name_en.count(')'):
            name_en = name_en.replace('(', '').replace(')', '')
        if name_zh.count('(') != name_zh.count(')'):
            name_zh = name_zh.replace('(', '').replace(')', '')
        original_zh = raw_zh.replace('（', '(').replace('）', ')')
        if re.search(r'\(\d+\)\s*$', original_zh) and not re.search(r'\(\d+\)\s*$', name_zh):
            bracket_fixes.append({'id': item_id, 'before': raw_zh, 'after': name_zh, 'balanced': True})

        old_category = previous_categories.get(item_id)
        if old_category and old_category != category:
            category_changes.append({
                'id': item_id, 'name': name_en, 'nameZh': name_zh,
                'old_category': old_category, 'new_category': category,
            })
        if raw_en != name_en or raw_zh != name_zh:
            name_diffs.append({
                'id': item_id, 'before_en': raw_en, 'after_en': name_en,
                'before_zh': raw_zh, 'after_zh': name_zh,
            })

        products.append({
            'id': item_id, 'name': name_en, 'nameZh': name_zh,
            'category': category, 'packSize': extract_pack(raw_en) or extract_pack(raw_zh),
            'storage': determine_storage(f'{raw_en} {name_en}', raw_zh, category), 'active': True,
        })
        raw_name_ledger.append({'id': item_id, 'rawName': raw_en, 'rawNameZh': raw_zh})

    products.sort(key=lambda product: (int(product['id']) if product['id'].isdigit() else product['id']))
    raw_name_ledger.sort(key=lambda product: (int(product['id']) if product['id'].isdigit() else product['id']))
    OUT_JSON.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    RAW_NAME_LEDGER_PATH.write_text(json.dumps(raw_name_ledger, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    legacy_three_prefix_changes = [
        {'id': product['id'], 'old_category': 'seafood', 'new_category': product['category']}
        for product in products
        if product['id'].startswith('3') and product['category'] != 'seafood'
    ]
    redirects = update_route_history(category_changes + legacy_three_prefix_changes)

    storage_counts = Counter(product['storage'] or 'unspecified' for product in products)
    category_storage: dict[str, Counter] = {}
    for product in products:
        category_storage.setdefault(product['category'], Counter())[product['storage'] or 'unspecified'] += 1
    category_counts = Counter(product['category'] for product in products)
    report = {
        'total_active_products': len(products),
        'category_counts': dict(sorted(category_counts.items())),
        'storage_summary': dict(storage_counts),
        'storage_by_category': {key: dict(value) for key, value in sorted(category_storage.items())},
        'category_changes_count': len(category_changes),
        'category_changes': category_changes,
        'reclassified_from_produce': [change for change in category_changes if change['old_category'] == 'produce'],
        'reclassified_from_seafood': [change for change in category_changes if change['old_category'] == 'seafood'],
        'route_redirect_count': len(redirects),
        'name_cleaning_count': len(name_diffs),
        'name_cleaning_samples': name_diffs,
        'bracket_fixes': bracket_fixes,
        'english_translation_drafts': translated_english,
        'pack_size_extracted_count': sum(bool(product['packSize']) for product in products),
        'unbalanced_parentheses': sum(product['name'].count('(') != product['name'].count(')') or product['nameZh'].count('(') != product['nameZh'].count(')') for product in products),
    }
    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Import finished. Total products: {len(products)}.')
    print(f'Category changes from prior catalog: {len(category_changes)}.')
    print(f'Category counts: {dict(sorted(category_counts.items()))}')
    print(f'Storage counts: {dict(storage_counts)}')
    print(f'English drafts applied: {len(translated_english)}.')


if __name__ == '__main__':
    main()
