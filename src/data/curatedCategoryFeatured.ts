/**
 * Curated Featured Product IDs for the 9 Foodservice Departments.
 * Each list contains 8-12 real, verified Item #s present in Stocklist.xls / products.json.
 * Items with genuine photos and clear, high-volume foodservice relevance are prioritized.
 * No adjacent near-duplicates (e.g. M/L glove variants or red/white dragon fruit) are paired together.
 */
export const curatedCategoryFeaturedIds: Record<string, string[]> = {
  meat: [
    '10022', // Pork Tenderloin (Indiana Kitchen) | 梅花肉
    '10033', // FRZ Bnls Pork Butt (Smithfield) | 冷冻无骨猪肉
    '10087', // Black Oak Smoked Sausage 10LB | 香肠
    '10089', // Wei Chuan Taiwan Sausage 12oz | 味全台湾香肠
    '10109', // Pork Loin Back Ribs Portions | 短排骨
    '11042', // General Tso's Chicken 33LB /CS | 酥脆左宗鸡 /箱
    '11113', // Bnls Breast (Pilgrim's) | 无骨鸡胸
    '11321', // FRZ Med Whole Wing (PERDUE) | 冷冻中鸡翅
    '11358', // FRZ Tyson Med Wing | TYSON 冷冻中鸡翅
    '12097', // Australian Flank Steak Midfield | 冷冻澳洲方牛
    '12151', // Beef Strip Loin (Cargill) | 鲜牛肉条
    '12152'  // Beef Tenderloin Filet Mignon Excel | 菲力牛排
  ],
  produce: [
    '20000', // Ho Jing Gai Lan Broccoli | 好劲芥兰
    '20100', // Napa Cabbage | 绍菜/箱
    '20410', // Yellow Jumbo Onion 50LB | 黄洋葱
    '21162', // White Dragon Fruit 20LB | 白色火龙果/箱
    '21384', // Asian Pear | 亚洲梨
    '21408', // Enoki Mushroom 11LB | 金针菇/箱
    '21618', // Fuji Apple (USA) 40LB | 富士苹果-美国
    '22001', // Shanghai Bok Choy | 上海青江菜
    '22031', // Thai Basil 10LB/CS | 九层塔/箱
    '22051', // Chinese Celery | 中国芹菜
    '22135', // Mango Vietnam | 越南芒果
    '22307'  // Fresh Lotus Root 3LB/Pkg | 新鲜莲藕
  ],
  seafood: [
    '36101', // Black Tobiko Frz Fish Roe 1.1LB | 黑色鱼籽 1.1LB
    '36102', // Wasabi Tobiko Frz Fish Roe 1.1LB | 绿色鱼籽 1.1LB
    '36107', // Shoichi Tuna Saku 22LB AAA | 吞拿鱼 22LB/箱
    '36109', // Ruby Tuna Saku 22LB AAA | RUBY 吞拿鱼
    '36248', // Frz Octopus Ball Takoyaki | 章鱼烧 /箱
    '36340', // Shrimp Shumai (Ajinomoto) 50pc | 鮮蝦燒賣 50pc
    '37101', // ACC Lobster Ball 5LB/Pkg | 龙虾球
    '37102', // JNK Fish Ball with Pork Filling 5LB | 灌汤鱼丸
    '37106', // Tempura Shrimp 21-25 135pcs | 炸甜不辣虾 135条
    '37600'  // BBQ Squid Cut Tube Skewers | 龙尾串/包
  ],
  pantry: [
    '41002', // LKK Hoisin Sauce 6 Can | 李锦记海鲜酱
    '41130', // Sriracha Chili Sauce 12x28oz | 是拉差甜辣椒酱(公鸡)
    '41144', // LKK Sriracha Sauce 12x18oz | 是拉差甜辣椒酱(李锦记)
    '41152', // Mae Ploy Sweet Chili Sauce 12x730ml | 甜辣椒酱(Mae Ploy)
    '41183', // LGM Chili Oil with Soybeans 24x280g | 老干妈风味豆豉油制辣椒
    '41200', // Bull Head BBQ Sacha Sauce 12x26oz | 沙茶酱(牛头)
    '42304', // LKK Pure Sesame Oil 7.2oz X 10 | 李锦记纯芝麻油
    '43000', // Ajinomoto MSG 44LB | 味精 (日本味之素) 44LB
    '43110', // Knorr Chicken Bouillon 4.4LB | 家乐牌鸡粉 4.4LB
    '43200', // Kikkoman 5 Gal Soy Sauce | 万字酱油 5GAL
    '45026'  // LKK Chili Garlic Sauce 4lbx6 | 李锦记蒜蓉辣酱
  ],
  preserved: [
    '53095', // Welluck Cut Baby Corn 6 Can | 切断玉米罐头
    '54011', // Dole Pineapple Chunk 6x108oz | 菠萝角罐头(Dole)
    '54031', // Chaokoh Lychee in Syrup 24x565g | 荔枝罐头
    '54037', // Chaokoh Coconut Milk 6x2900ml | 椰子奶 6x2900ml
    '54038', // Chaokoh Coconut Milk 24x13.5oz | 椰子奶 24x13.5oz
    '54101', // Hunts Ketchup 6x114oz | 番茄酱(HUNTS) 6罐
    '54102', // Red Gold Ketchup 6 Can | 金红番茄酱 6罐
    '54358', // Mandarin Orange Slice 6 Can | 桔罐 6罐/箱
    '54365', // Tropical Fruit Cocktail 6 Can | 杂果罐头
    '54371', // Canned Pear 6x3KG Five Star | 梨罐 6罐/箱
    '54463', // Asian Best Cooking Tamarind 16oz | 罗望子酱 16oz
    '54464'  // Asian Best Tapioca Pearls 16oz | 西米 16oz
  ],
  supplies: [
    '60020', // Heavy Aluminum Foil 18" Roll | 614 锡纸-18寸
    '67014', // Black 6-in-1 Cutlery Kit 250ct | 刀叉羹盐椒纸(黑)
    '67015', // White 6-in-1 Cutlery Kit 250ct | 刀叉羹盐椒纸(白)
    '67016', // Medium Weight 3-in-1 Cutlery Kit 500ct | 叉羹纸(白) 500
    '67201', // FiHood Beverage Straws 24x400 | 吸管 24盒
    '67402', // White Vinyl Foodservice Gloves 1000ct | 白胶手套 1000只
    '67408', // Biocean Portion Cups 3.25oz 2500ct | 3.25oz 酱料杯 2500个
    '67421', // Biocean 3-Compartment Black Container 8x8 | PP883 黑三隔盒 150套
    '67422', // Biocean 3-Compartment Black Container 9x9 | PP993 黑三隔盒 150套
    '67424', // Biocean 1-Compartment White Container 9x9 | PP991 白一格盒 150套
    '67426'  // Biocean 3-Compartment White Container 8x8 | PP883 白三隔盒 150套
  ],
  dry: [
    '73332', // Nongshim Shin Ramyun Noodle Case | 农心辛拉面/箱
    '74501', // Twin Marquis Shanghai Dumpling Wrapper 16oz | 上海式水饺皮 1LB
    '74505', // Twin Marquis HK Style Dumpling Wrapper 16oz | 港式水饺皮 16oz
    '74515', // Twin Marquis Spinach Dumpling Wrapper 14oz | 菠菜水饺皮 14oz
    '74602', // Maggi Seasoning Sauce Large 6x27oz | 美极鲜酱油(大) 6x27oz
    '74603', // Wei Chuan Dried Shrimp 3.5oz | 味全大号虾米 3.5oz
    '74605', // Wei Chuan Sour Mustard Greens 10.5oz | 味全咸酸菜
    '74608', // Knorr Chili Liquid Seasoning 12x250ml | 辣鲜露酱油 (家乐牌)
    '74612', // Wei Chuan Spring Roll Pastry 11oz | 味全润饼皮
    '74613', // Wei Chuan Green Onion & Sesame Roll | 味全葱香大饼 330g
    '74618', // Wei Chuan Glutinous Rice Dumpling 4ct | 味全荷叶糯米饭
    '74710'  // Golden Bowl Crispy Bulk Noodles 10LB | 金碗面干 10LB
  ],
  cleaning: [
    '80001', // Theochem Soap Powder 100139 | 砚粉(白纸箱装)
    '80004', // So-Kleen Soap Powder Pink Tub | 砚粉-粉红桶装
    '80010', // LYE-12 Commercial Drain Opener | 强力通渠水
    '80100', // Commercial Bleach 6x1GAL | 漂白水 6x1GAL
    '80115', // Pot & Pan Green Detergent 4 Bottles | 洗洁精(绿) 4瓶
    '80125', // Heavy Duty Oven & Grill Cleaner | 强力炉头水 4瓶
    '80127', // Dish Detergent Pink 4 Bottles | 洗洁精(粉红) 4瓶
    '81000', // 32" Heavy Mop Head | 地拖布(块)
    '81001', // Commercial Mop Head 12pc | 地拖布(箱)
    '81020', // Deck & Grill Scrub Brush | 炉头刷
    '85104'  // Blue Nitrile Foodservice Gloves | 蓝色胶手套
  ],
  prepared: [
    '25943', // Master Kong Green Tea 15x500ml | 康师傅绿茶 15x500ml
    '92643', // JNK Mini Pork Pan Fry Bun 1LB | 生煎包
    '92651', // JNK Pork & Shrimp Shumai 24LB | 虾&猪肉烧麦 24LB
    '92653', // JNK Crystal Shrimp Dumpling 16LB | 水晶虾饺 16LB
    '92790', // Scallion Layered Pancake Little Alley | 小巷口葱油饼
    '25521', // East Green Citrus Pu-erh Tea | 东方树叶青柑普洱茶
    '25655', // Oriental Taste Pork Dumpling 50pcx8 | 全美猪肉锅贴
    '25940', // Master Kong Jasmine Long Jing Tea | 康师傅茉莉龙井
    '91002', // Spicy Roasted Tofu 108g | 劲仔厚豆干(香辣味)
    '91005'  // Zhou Hei Ya Duck Neck Strip 140g | 周黑鸭鸭脖子
  ]
};
