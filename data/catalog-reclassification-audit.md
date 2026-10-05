# Catalog Reclassification & Name-Cleaning Audit

> Generated from `Stocklist.xls`, the public catalog data layer, and the automatic redirect history. The public catalog contains no prices, costs, supplier remarks, or source-only internal fields.

## Final public catalog

- **Active catalog products:** 2,820
- **Storage:** frozen: 358 · refrigerated: 90 · not shown: 2,372
- **Storage rule:** only explicit fresh/new/freshness signals produce `Refrigerated`; explicit frozen terms and frozen prepared foods produce `Frozen`; otherwise storage is not displayed.
- **Parenthesis check:** 0 unbalanced English or Chinese public names.

| Category | Products |
|---|---:|
| Meat & Poultry (`meat`) | 325 |
| Produce & Fruit (`produce`) | 330 |
| Seafood (`seafood`) | 256 |
| Sauces & Seasonings (`pantry`) | 565 |
| Canned & Preserved (`preserved`) | 186 |
| Restaurant Supplies (`supplies`) | 391 |
| Rice, Noodles & Dry Goods (`dry`) | 331 |
| Cleaning & Janitorial (`cleaning`) | 35 |
| Frozen, Prepared & Snacks (`prepared`) | 401 |

## Category migration and old-detail URL policy

**599 legacy category paths** are emitted in `public/_redirects`, each in English and Chinese. A migrated product with an uploaded photo redirects to its new static detail page. A migrated product without a generated detail page redirects to its current category page, preventing a 301-to-404 chain.

### Legacy `produce` paths → current categories (387)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 21029 | FRZ Green Peas 12x40oz FINE LINE | 冷冻青豆 | `produce` → `prepared` |
| 21030 | Green Peas IQF | 青豆-1.20.2 | `produce` → `prepared` |
| 21250 | Special Egg(WOOD Box) | 特价鸡蛋 | `produce` → `pantry` |
| 21251 | Large Egg 15 Doz | 蛋(大) 15打 | `produce` → `pantry` |
| 21253 | Large Egg 30 Doz | 蛋 (大) 30打 | `produce` → `pantry` |
| 21256 | X-Large Egg 30 Doz | 蛋 (特大) 30打 | `produce` → `pantry` |
| 21283 | Brown Egg Large-Doz/Pkg | 超市装黄皮鸡蛋(L)1 打 | `produce` → `pantry` |
| 21466 | Pickled Minced Vegetables 1LB | 碎米芽菜 | `produce` → `preserved` |
| 21504 | EGG Tofu 222g / PKG | 玉子豆腐- 222g/包 | `produce` → `pantry` |
| 21515 | FZN Hunan Tofu (w/ Seasoning) 10x1148g | 湖南臭豆腐 (帶料包) 10x1148g | `produce` → `pantry` |
| 21572 | Organic Unsweet Soy Drink | 原味有机豆浆 | `produce` → `pantry` |
| 21573 | Sweet Soy Drink | 原味甜豆浆 | `produce` → `pantry` |
| 21574 | Organic Sweet Soy Drink | 有机甜豆浆 | `produce` → `pantry` |
| 21575 | Deep Fried Tofu 30Pkg | 福臨門油炸豆腐/箱 | `produce` → `prepared` |
| 23002 | Frz. Whole Round Butterfish | 银昌鱼 22LB | `produce` → `seafood` |
| 23043 | Pacific Saury 23.1LB | 秋刀魚 23.1LB | `produce` → `seafood` |
| 23044 | Mackerel Pick 21.50LB | 秋刀魚 | `produce` → `seafood` |
| 23046 | Whole Tilapia Gutted 40LB | 海鲫鱼-无肚40LB/箱 | `produce` → `seafood` |
| 23080 | Halibut Tail Off Size 0.5--1 | 冻格凌兰比目鱼 22LB | `produce` → `seafood` |
| 23091 | "JNK"Rocket Shaped Squid Wing 2lb/ PKG | 火箭鱿鱼 2lb /包 | `produce` → `seafood` |
| 23092 | Baby Octopus | 小章鱼-12oz/包 | `produce` → `seafood` |
| 23093 | Squid 3LB/Pkg ANGELS GATE | 小尤鱼3磅 (12盒/箱) | `produce` → `seafood` |
| 23094 | Winter Squid /PKG 1lb | 红尤鱼 /包 | `produce` → `seafood` |
| 23095 | Squid 400/600 (TOMI/FISHBAY) | 大鱿鱼 400/600 | `produce` → `seafood` |
| 23096 | Frozen Frog Leg 5LB /PKG | 田鸡腿 5LB | `produce` → `meat` |
| 23097 | Frozen Frog Leg 30LB | 田鸡腿 30LB | `produce` → `meat` |
| 23098 | JNK FRZ Squid Carved 2LB/Pkg | 鱿鱼花 2LB/包 | `produce` → `seafood` |
| 23099 | Squid 400/600 (ILLEX) 30LB | 大鱿鱼 (ILLEX) 400/600 30LB (GAL) | `produce` → `seafood` |
| 23119 | Moon Fish | 月亮鱼 | `produce` → `seafood` |
| 23166 | Grey Sole -33LB | 龙蜊鱼--33LB/箱 | `produce` → `seafood` |
| 23171 | Sole -22LB / CS | 龙蜊鱼-22 LB/箱 around 45pcs | `produce` → `seafood` |
| 23208 | Jumbo Squid 400/600 36lb TXF | 大鱿鱼400/600 36lb (TXF) | `produce` → `seafood` |
| 23260 | JNK King Fish Head W/Double Pepper 1060g | 双椒霸王鲶鱼头/袋 | `produce` → `seafood` |
| 23261 | JNK Seasoned Catfish Spicy Flavor/ PKG | 香辣烤鱼(700/900g) | `produce` → `seafood` |
| 23286 | Belt Fish (1000+) 22LB | 带鱼 22LB | `produce` → `seafood` |
| 23287 | Belt Fish | 带鱼 | `produce` → `seafood` |
| 23291 | FZN Cuttlefish Whole Round 22LB | 冷冻墨鱼22磅/箱 | `produce` → `seafood` |
| 23292 | JNK Snakehead Fish Fillets 250g /PKG | JNK功夫黑鱼片无刺带皮 250g/包 | `produce` → `seafood` |
| 23293 | JNKGrass Fish Fillets 8.8oz/PK | JNK脆肉皖鱼片/包 | `produce` → `seafood` |
| 23302 | Frozen . CUTTLE FISH 44LB | 大目鱼 BEAUTY WING | `produce` → `seafood` |
| 23317 | Wine Lees Yellow Crocker / PKG | 酒糟黄瓜鱼- 包 | `produce` → `seafood` |
| 23321 | Whole Black Conger Pike EEL FRZ | 冻海鳗 ~44Lb /箱 | `produce` → `seafood` |
| 23325 | FROZEN CONGER PIKE 22LB | 去肚海鳗 | `produce` → `seafood` |
| 23331 | Croaker Yellow Fish 10LB | 真黄花鱼 | `produce` → `seafood` |
| 23333 | FRZ.YELLOW CORVINA 28LB / CS | 真黄花鱼 | `produce` → `seafood` |
| 23342 | Golden Pompano (800+) 40LB | 金鲳鱼 (800+) 40LB | `produce` → `seafood` |
| 23343 | Golden Pompano Fish 40LB | 金鲳鱼 | `produce` → `seafood` |
| 23350 | Silver Pomfret 20LB | 白鲳鱼 | `produce` → `seafood` |
| 23351 | Silver Pomfret 22LB | 白鲳鱼 22LB | `produce` → `seafood` |
| 23603 | Tilapia With Pickled Veg&Chili | 酸菜鱼片(X.T)-500g/合 | `produce` → `preserved` |
| 23607 | Sea Bass Clean 500g /PKG | 功夫鲈鱼- 500g/包 | `produce` → `seafood` |
| 24001 | Black Chicken | 乌鸡-头 | `produce` → `meat` |
| 24002 | FRESH COOK CHICKEN Fortune Chicken | 平安鸡(公)-约4Lb / 头 4214 | `produce` → `meat` |
| 24006 | Hot Pepper Boneless Chicken Feet / PKG | 无骨泡椒凤爪 / 包 | `produce` → `meat` |
| 24007 | Chicken Paws 44 LB | 鸡脚 44LB/箱 | `produce` → `meat` |
| 24008 | CASE FARM Chicken Paws 33.07LB | 鸡脚33.07LB /箱 CASE FARM | `produce` → `meat` |
| 24009 | Chicken Paws 5LB | 鸡脚 5LB | `produce` → `meat` |
| 24010 | Aged Chicken | 老鸡-头 | `produce` → `meat` |
| 24030 | Squab | 乳鸽 - 头 | `produce` → `meat` |
| 24037 | Quail 6PC/Pkg | 鹌鹑 | `produce` → `meat` |
| 24038 | JONG'S Fresh Quail Eggs 15pc /PKG | 新鲜鹌鹑蛋 15颗 /盒 | `produce` → `pantry` |
| 24049 | Ranged Chicken 4LB/PKG | 走地鸡(约4LB)/头 | `produce` → `meat` |
| 24064 | Aged Chicken | 老鸡 | `produce` → `meat` |
| 24100 | CULVER Head&Feet On Duck | 有头冻鸭5.5LBCULVER | `produce` → `meat` |
| 24101 | Winona Duck Without Neck | PN0000014 无头鸭 | `produce` → `meat` |
| 24102 | Bay Brand Duckling Headless 5.5 | 无头冻鸭 5.5 Bay Brand | `produce` → `meat` |
| 24103 | "CULVER" Head&Feet On Duck | 有头冻鸭5.0LB"CULVER" | `produce` → `meat` |
| 24104 | Buddhist (Blue) Duck W/Head 5.5 | 有头冻鸭5.5 Premium Poultry | `produce` → `meat` |
| 24105 | Buddhist (Blue) Duck W/Head 6 | 有头冻鸭6 Premium Poultry | `produce` → `meat` |
| 24106 | VALLEY FORGE Duckling Headless 4.5 | 无头冻鸭 (VALLEY FORGE) | `produce` → `meat` |
| 24107 | Bay Brand Duckling Headless 6.0 | 无头冻鸭 6.0 Bay Brand | `produce` → `meat` |
| 24108 | CULVER Duckling Headless 5.0 | 无头冻鸭 (6pc) CULVER | `produce` → `meat` |
| 24109 | "CULVER" Head&Feet On Duck | 有头冻鸭6.0LB"CULVER" | `produce` → `meat` |
| 24110 | Mature Duck | 老鸭-头 | `produce` → `meat` |
| 24111 | ACC Roasted Duck Hong Kong/PC | Duck-1 烧鸭/只ACCHong Kong | `produce` → `meat` |
| 24112 | Duck Head - CS | 鸭头 - 箱 | `produce` → `meat` |
| 24113 | Duck Wing - CS | 鸭翼-箱 | `produce` → `meat` |
| 24114 | Duck Feet (KEYSTONE KATIE) | 鸭掌-箱 | `produce` → `meat` |
| 24115 | Duck Chitterlings 8oz / PKG | 鸭肠 8oz - 包 | `produce` → `meat` |
| 24116 | Mature Duck 6PC / CS | 老鸭(6只) - 箱 | `produce` → `meat` |
| 24117 | Roasted Duck Halves - PK | 烤半鸭 - 包 | `produce` → `meat` |
| 24118 | Wood Whole duck 5.25-5.75 | 无头鸭 6pc | `produce` → `meat` |
| 24119 | Ugly Duckling Parts Missing 6pc | 残鸭 | `produce` → `meat` |
| 24120 | Duck Neck - CS | 鸭脖 - 箱 | `produce` → `meat` |
| 24121 | Duck Necks 30LB | 鸭脖 30LB | `produce` → `meat` |
| 24131 | Duck Feet Boneless 1LB | 无骨鸭掌 | `produce` → `meat` |
| 24161 | DF Duck Feet Boneless 30LB | 无骨鸭掌 30LB (D HFTC t30) | `produce` → `meat` |
| 24166 | Goose | 冻鹅-约10LB/只 | `produce` → `meat` |
| 24178 | Chicken Paw | 日旺豉汁凤爪454g/包 | `produce` → `meat` |
| 24181 | (HAOYASHUANG)300g/Pkg | 好呀爽 300g | `produce` → `prepared` |
| 24202 | Pork Stomach 10LB (A.L. Beck) | 猪肚(切块) | `produce` → `meat` |
| 24203 | Pork Stomach 30LB (IBP) | 猪肚30LB | `produce` → `meat` |
| 24204 | Pork Stomach 22.05LB | 猪肚(整块)22.05LB | `produce` → `meat` |
| 24205 | Pork Stomach 30LB RANTOUL | 猪肚30LB | `produce` → `meat` |
| 24213 | Cut Pork Feet 10LB /CS | 切好猪脚10LB/箱 | `produce` → `meat` |
| 24214 | Pork Feet Cut 3LB | 切好猪脚 | `produce` → `meat` |
| 24215 | Pork Feet Cut 5LB/ PKG | 切好猪脚 5 磅 包 | `produce` → `meat` |
| 24216 | Pork Hind Feet 30LB /CS 0649 | 猪长后手/ 箱 | `produce` → `meat` |
| 24217 | Pork Front Feet (uncut) 45LB | 猪长后手(未切) 45LB | `produce` → `meat` |
| 24220 | Pork Bellies 5LB/Pkg | 五花肉 5LB/包 | `produce` → `meat` |
| 24221 | Fresh Pork Bellies (A.L. Beck) RED | 新鲜五花肉(A) | `produce` → `meat` |
| 24222 | FRZ Pork Belly Boneless Skinless | 冷冻去皮去骨五花肉 | `produce` → `meat` |
| 24223 | DANISH Skinless Pork Bellies FRN 1808 | 丹麦无皮五花肉-冷冻 | `produce` → `meat` |
| 24224 | / Boneless Pork Belly Skin On | 冷冻有皮无骨五花肉(A) /2111Cwhite box | `produce` → `meat` |
| 24225 | FRN Brazilian Pork Bellies Skin-On Seara | 巴西有皮无骨五花肉-冷冻 | `produce` → `meat` |
| 24226 | Frz Pork Sheet Ribbed Belly | 冷冻无皮无骨五花肉(A) Red box | `produce` → `meat` |
| 24227 | AGROSUPER Pork Bellies Skinless RIb | 智利上等单肋去皮去骨五花肉(A) | `produce` → `meat` |
| 24228 | FRN Brazilian Pork Bellies Skinless Seara | 巴西去皮去骨五花肉-冷冻(B) | `produce` → `meat` |
| 24229 | FRZ Pork Belly Boneless Skin On | 冷冻有皮去骨五花肉 | `produce` → `meat` |
| 24230 | Roasted Pork Chunk 6x5LB /CS | 港式叉烧肉 6x5LB | `produce` → `meat` |
| 24232 | JNK H.K Roasted Pork Chunk 5LB /PKG | 港式叉烧块5LB | `produce` → `meat` |
| 24234 | (BROWN) Pork Femur Bone 35LB/CS | 整箱猪筒骨 (棕色箱) | `produce` → `meat` |
| 24238 | Pork Back Bone 40LB / CS Lot No.9861 | 整箱切猪龙骨 40LB | `produce` → `meat` |
| 24241 | Pork Bellies Skinless (KEKEN) | 去皮去骨五花肉 (KEKEN)(A) | `produce` → `meat` |
| 24243 | Chinese Syle Pork Strips-Bacon/PKG | 腊肉/包 | `produce` → `meat` |
| 24258 | Pork Tongue | 猪舌头-约5磅 | `produce` → `meat` |
| 24260 | Roasted WHOLE Pig - 30-40 LB | 整只烧猪 / 只 | `produce` → `meat` |
| 24270 | Pork Bungs 22LB | 猪大肠 22LB | `produce` → `meat` |
| 24271 | Pork Bung 5LB/Pkg | 猪大肠 5LB/包 | `produce` → `meat` |
| 24280 | Pork Head CUT 3PCS/CS | 猪头 (切)/箱 | `produce` → `meat` |
| 24281 | FZ Pork Brain 12x1LB /CS | 猪腦12x1LB(独立包装) | `produce` → `meat` |
| 24288 | Pork Femur (Neck) Bone 5LB | 切猪筒骨 | `produce` → `meat` |
| 24289 | Beef Wagyu Femure Bone (North Georgia) | 冷冻牛骨 约60磅 | `produce` → `meat` |
| 24294 | Pork Back Bone 5LB /PKG (WHITE BOX) | 猪背脊骨 5LB/包 | `produce` → `meat` |
| 24306 | Beef Honey Comb Tripe 10LB | 牛肚 | `produce` → `meat` |
| 24307 | Beef Honey Comb Tripe 15LB | 牛肚 15LB | `produce` → `meat` |
| 24308 | Beef Honeycomb Tripe 22.1lb | 牛肚 (NICHOLAS) | `produce` → `meat` |
| 24321 | Beef Book Tripe (Omasum) 5LB | 牛百叶(发) | `produce` → `meat` |
| 24323 | Beef Omasum 22LB | 牛百叶 | `produce` → `meat` |
| 24326 | Beef Omasum 30LBS (Any Brand) | 牛百叶-30LB /箱 | `produce` → `meat` |
| 24330 | Beef Brisket 5LB/PKG | 牛腩 5LB/包 | `produce` → `meat` |
| 24331 | Boneless Beef Flank (Four Star) | 牛腩 (Four Star) 约35磅 /箱 | `produce` → `meat` |
| 24332 | Beef Rough Flank Steak | 牛腩 | `produce` → `meat` |
| 24333 | Beef Wagyu Brisket (North Georgia) | 冷冻牛腩 约50磅 | `produce` → `meat` |
| 24340 | Beef Tendon 10LB (A.L. Beck) | 牛筋 | `produce` → `meat` |
| 24341 | BEEF AORTA 30LB/CS | 黃喉/牛心頂 30 磅 箱 | `produce` → `meat` |
| 24342 | Beef Shank Meat 10LB(A.L. Beck) | 牛腱 | `produce` → `meat` |
| 24343 | Beef Tendon Flexor 22LB SWIFT | 牛双筋 22LB SWIFT | `produce` → `meat` |
| 24344 | Boneless Beef Shank | 牛腱-大箱 | `produce` → `meat` |
| 24345 | Beef Shanks 30LB (A.L.B) | 牛腱 30LB | `produce` → `meat` |
| 24346 | Beef Tendon 22LB | 牛双筋 | `produce` → `meat` |
| 24347 | Beef Back Ribs 20LB (A.L. Beck) | 牛背排 20LB | `produce` → `meat` |
| 24348 | Beef Flap Meat 10LB (A.L. Beck) | 牛腩 10LB | `produce` → `meat` |
| 24371 | Beef Tongue 1 | 牛舌头 | `produce` → `meat` |
| 24372 | Ox Tail 5LB /PKG (PACKAGE ONLY) | 切好牛尾 5LB | `produce` → `meat` |
| 24403 | Boneless Lamb Leg (Thomas) | 无骨羊腿 | `produce` → `meat` |
| 24404 | Lamb Kebab 1.25LB/PKG | 羊肉串1.25LB/PKG | `produce` → `meat` |
| 24405 | FRZ Bone In Lamb PKG | 羊排 (~1.2LB/PKG) | `produce` → `meat` |
| 24406 | Lamb Kebab -141.25LB/CS EF | 羊肉串141.25LB/箱 | `produce` → `meat` |
| 24407 | Lamb Neck Cut Select Cut 40LB/CS | 切羊颈骨(羊蝎子)40LB | `produce` → `meat` |
| 24414 | Pork Slice | 猪劲肉片-约1LB/合 | `produce` → `meat` |
| 24450 | Sliced Lamb 16oz - Hot Pot | 火锅羊肉片 | `produce` → `meat` |
| 24451 | Sliced Beef 1LB - Hot Pot | 火锅肥牛片 | `produce` → `meat` |
| 24474 | Bone In Cubes Goat 2.2LB (BLUE) | 欧洲切块带骨草羊2.2LB | `produce` → `meat` |
| 24475 | Bone In Cubes Goat 5LB | 带皮切块全羊 | `produce` → `meat` |
| 24490 | Bone In Lamb | 有骨羊腩 (FLETCHER) | `produce` → `meat` |
| 24491 | Boneless LAMB LEG BLUE SKY 46.87LB | 无骨羊腿肉 (Blue Sky) | `produce` → `meat` |
| 24557 | Pork Ear Retail PKG | 猪耳朵-5LB/包 | `produce` → `meat` |
| 24558 | Pork Jowl (Face) 5LB | 猪脸肉 | `produce` → `meat` |
| 24559 | Pork Tail 3LB PKG | 猪尾 3LB PKG | `produce` → `meat` |
| 24560 | Duck Wing 3LB PKG | 鸭翅 3LB PKG | `produce` → `meat` |
| 24566 | Pork Femur Bone 35LB/CS BRIGHTON | (整箱) 猪筒骨 BROWN BOX | `produce` → `meat` |
| 24568 | Pork Jowl (Face) - CS | 猪脸肉 - 箱 | `produce` → `meat` |
| 24615 | Boneless Beef Heel Muscle | 金钱腱 约57LB/箱 | `produce` → `meat` |
| 24735 | Red Bead Flavor Rice Cake - 34.5 oz / PKG | 台湾红豆年糕 / 盒 | `produce` → `prepared` |
| 25022 | Preserved Bean Curd 24 Bottle | 豆腐乳(黄日香) | `produce` → `preserved` |
| 25023 | Perserved Bean Curd | 豆腐乳辣(黄日香)-瓶 | `produce` → `preserved` |
| 25024 | Haday Perserved Beancurd 288g/ PKG | 海天 南腐乳 288g/ 瓶 | `produce` → `preserved` |
| 25026 | Fermented Red Bean Curd 288g /Bottle 3 | 味全 南乳(珠江桥牌) 288g/ 瓶 | `produce` → `preserved` |
| 25030 | Hot Oil Bamboo | 辣油香笋-13oz/瓶 | `produce` → `pantry` |
| 25031 | Arawana Vegetable Oil 4x1.05gal | 金龙鱼 食用植物调和油 4x1.05gal | `produce` → `pantry` |
| 25032 | LGM Spicy Chili Crisp 210g/Pkg | 香辣脆油(老干妈)瓶 | `produce` → `prepared` |
| 25041 | Fried Gluten W/Peanut In Soy Sauce 24x13oz | 花生面筋(吉祥)瓶 | `produce` → `prepared` |
| 25045 | LGM Spicy Chili Crisp 670g /PKG | 老干妈 香辣脆油 670g /瓶 | `produce` → `prepared` |
| 25046 | LGM Fried Chili in Oil 12x730g /CS | 老干马油辣椒(大瓶装) / 箱 | `produce` → `pantry` |
| 25080 | Saline Bamboo Shoot 400g | 明筍干 | `produce` → `preserved` |
| 25099 | Mini Pickled Cucumber | 爱之味鲜脆条瓜-180g/瓶 | `produce` → `preserved` |
| 25100 | Szchuan Preserved 12oz /PKG | 榨菜丝 | `produce` → `preserved` |
| 25101 | Szchuan Preserved (Cha Choy See) 48Can | 榨菜丝 | `produce` → `preserved` |
| 25120 | Eagle Coin Fried Dace 6.5oz /PKG | 鲜炸鲮鱼 | `produce` → `preserved` |
| 25122 | Black Bean Fish 24x3.5oz | 豆豉鲮鱼 | `produce` → `preserved` |
| 25125 | Black Bean Fish 24' | 豆豉鲮鱼 | `produce` → `preserved` |
| 25202 | Pickled Mustard 36x300G | 酸菜 | `produce` → `preserved` |
| 25203 | Pickled Mustard Green 500g | 小葉酸菜 | `produce` → `preserved` |
| 25204 | Pickled Mustard Green 150g | 小叶酸菜 | `produce` → `preserved` |
| 25207 | Sweet Beans 100g | 甜豆(巧阿嫂)-100g/包 | `produce` → `prepared` |
| 25210 | Preserved Daikon | 贝奇脆萝卜-包 | `produce` → `preserved` |
| 25220 | Preserved Vegetable 2.4oz | 老板菜-2.4oz/包 | `produce` → `preserved` |
| 25222 | Preserved Vegetable 100x70gm | 老板菜 | `produce` → `preserved` |
| 25248 | Preserved Mustard Stem 70g /PKG (Yu Quan) | (鱼泉) 榨菜 70g /包 | `produce` → `preserved` |
| 25275 | Pickled Vegetable 75g | 糟菜 | `produce` → `preserved` |
| 25284 | PRESERVED Bamboo Shoots 400g /PKG | 香脆筍 (东之味) 400g/包 | `produce` → `preserved` |
| 25287 | Spicy Sansi 150g /PKG | 麻辣三丝 (吉香居) 150g | `produce` → `preserved` |
| 25288 | Vegetable W/Chili Oil 138g /PKG | 味聚特 红油榨菜 /包 | `produce` → `preserved` |
| 25289 | Mixed Vegetable138g /PKG | 味聚特 黄花什锦 /包 | `produce` → `preserved` |
| 25290 | Spicy Shedded Mustard 138g /PKG | 味聚特 麻辣三丝 /包 | `produce` → `preserved` |
| 25291 | Tasty Mustard 138g /PKG | 味聚特 爽口下饭菜 /包 | `produce` → `preserved` |
| 25298 | KELP-SPICY | 特级麻辣海带丝-60G/包 | `produce` → `preserved` |
| 25302 | Preserved Duck Egg 6' /PKG | 皮蛋6颗/盒 (东之味) | `produce` → `preserved` |
| 25306 | Salted Duck Egg | 熟海鸭咸蛋-6粒/盒 | `produce` → `preserved` |
| 25311 | Salted Duck Egg CASE | 醎蛋 | `produce` → `preserved` |
| 25330 | Pork Sung 18oz /PKG | (宝岛) 肉松 18oz /罐 | `produce` → `preserved` |
| 25331 | Pork Sung 25lb | (宝岛) 肉松 25lb | `produce` → `preserved` |
| 25340 | JNKQuail Eggs 15oz/PKG | JNK鹌鹑蛋 | `produce` → `pantry` |
| 25341 | Master Lee Canned Quail Eggs 22.5LB/ CS | 李先生鹌鹑蛋罐头 | `produce` → `preserved` |
| 25400 | Chinese Seaweed | 紫菜饼-包 | `produce` → `prepared` |
| 25404 | Fuzhou Fish Ball 3LB (7) PKG | 福州鱼丸 3LB PKG | `produce` → `prepared` |
| 25426 | FRZ Salted Seaweed Knot 15KG | 大箱海带结15KG EF | `produce` → `preserved` |
| 25477 | Seafood dumplings 10.58LB/Pkg | 鱼皮海鲜饺 | `produce` → `seafood` |
| 25482 | BEST Fried Tofu PKG | 特级鱼豆腐(极佳) 1lb/包 | `produce` → `prepared` |
| 25484 | BEST Fried Fish Cake | 炸鱼饼(极佳) 14oz/包 | `produce` → `prepared` |
| 25486 | JNK Cuttle Fish Ball 908g /PKG | 墨鱼丸(花枝丸) 908g /包 | `produce` → `prepared` |
| 25488 | "JNK"FRZ Whold Squid Skewer Color Bag PKG | 整支鱿鱼串彩色包装/包 | `produce` → `prepared` |
| 25489 | Frozen Cuttefish Ball PKG | 珍珍花枝丸-8oz/包 | `produce` → `prepared` |
| 25490 | JNK FRZ Vegan Skewer 50g /PKG | 面筋串 50g /包 | `produce` → `prepared` |
| 25491 | JNKFRZ Tornado Potato Skewer 500g /PKG | 旋風薯塔串 /包 | `produce` → `prepared` |
| 25492 | JNK TW Popcorn Chicken 1lb /PKG | 台式盐酥鸡 1lb/包 | `produce` → `prepared` |
| 25493 | Frozen Simulated Lobster Ball 8oz | 珍珍龙虾球 | `produce` → `prepared` |
| 25494 | JNKFortune pack with fish roe 2LB /PKG | 火锅福袋 2LB /包 | `produce` → `seafood` |
| 25495 | JNK Fish Ball With Fish Roe 2LB /PKG | 鱼籽包心丸 2LB /包 | `produce` → `prepared` |
| 25496 | JNK Frozen Shrimp Paste 2LB /PKG | 南美白虾滑 2LB /包 | `produce` → `prepared` |
| 25497 | JNK Frz Eel Strip 8oz /PKG | 冷冻去骨黄鳝丝 8oz /包 | `produce` → `seafood` |
| 25498 | GREEN Hot Pot Combo & Mush.Soup 600g /PKG | 火锅珍宝-菌汤 600g /包 | `produce` → `prepared` |
| 25499 | RED Hot Pot Combo & Mala Soup 600g /PKG | 火锅珍宝-麻辣汤 600g /包 | `produce` → `prepared` |
| 25500 | Green Apple Sparkling Water 15x480m L CHI | 元气森林 (青苹果) 15瓶 /箱 | `produce` → `pantry` |
| 25501 | PLUM Sparkling Water 15x480m L CHI | 元气森林 (盐系青梅) 15瓶 /箱 | `produce` → `pantry` |
| 25502 | Lemon Sparkling Water 15x480m L CHI | 元气森林 (青柠) 15瓶 /箱 | `produce` → `pantry` |
| 25503 | GRAPE DELIGHT Sparkling Water 15x480m L CHI | 元气森林 (夏黑葡萄) 15瓶 /箱 | `produce` → `pantry` |
| 25504 | PEACH Sparkling Water 15x480m L CHI | 元气森林 (白桃) 15瓶 /箱 | `produce` → `pantry` |
| 25505 | LYCHEE Sparkling Water 15x480m L CHI | 元气森林 (荔枝) 15瓶 /箱 | `produce` → `pantry` |
| 25508 | Ye Shu- Natural Coconut Drink 24x245ml | 椰树牌 椰子汁(纸包) 24x245ml | `produce` → `pantry` |
| 25509 | Taisun Mixed Congee 24x375g | 泰山 八宝粥 24罐 | `produce` → `preserved` |
| 25510 | Taisun Peanut Soup 24x320g | 泰山 花生仁汤 320gx24罐 | `produce` → `preserved` |
| 25511 | HOT-KID Milk Drink 24x245ml | 旺仔牛奶 | `produce` → `pantry` |
| 25520 | SUNTORY Oolong Tea | 三得利无糖桂花乌龙茶 | `produce` → `pantry` |
| 25522 | East Jasmine Tea | 东方树叶 茉莉花茶 | `produce` → `pantry` |
| 25523 | East Olong Tea | 东方树叶 乌龙茶 | `produce` → `pantry` |
| 25524 | Autumn Pear Beverage | 生龙 秋梨枇杷冰酿 24CAN /CS | `produce` → `pantry` |
| 25528 | VITA Peach Tea 24x250ml | 維他水蜜桃茶 24x250ml | `produce` → `pantry` |
| 25529 | Yeo's White Gourd Drink 24x300ml | 杨协成冬瓜茶 (罐装) | `produce` → `preserved` |
| 25530 | Yeo's Grass Jelly Drink 24x300ml | 杨协成仙草蜜 (罐装) | `produce` → `preserved` |
| 25531 | Yeo's Lychee Drink 24x300ml | 杨协成荔枝水 (罐装) | `produce` → `preserved` |
| 25532 | Mandarin Soda 24can/cs | 北冰洋 桔子味汽水24罐 | `produce` → `pantry` |
| 25533 | Yeo's Sugar Canned Tea 24x300ml | 杨协成甘蔗水 (罐装) | `produce` → `preserved` |
| 25534 | JNK White Fungus Soup 12x7oz /CS | 枸杞红枣银耳羹(12瓶) 箱 | `produce` → `preserved` |
| 25535 | Yeo's Chrysanthemum Tea 24x300ml | 杨协成菊花茶 (罐装) | `produce` → `preserved` |
| 25536 | Yeo's Soy Milk Drink 24x300ml | 杨协成豆奶 (罐装) | `produce` → `preserved` |
| 25537 | 1/2 Gal Sweetened Soy Milk Organic/Pkg | 甜豆奶1/2 Gal | `produce` → `pantry` |
| 25538 | Milk Peanut Drink 24x365g | 花生牛奶 | `produce` → `pantry` |
| 25539 | ORGANIC 1/2 Gal Sweetened Soy Milk/Pkg | 福臨門有机甜豆奶- 1/2 Gal | `produce` → `pantry` |
| 25540 | ASSAM Milk Tea Drink 15X500ML | 统一阿萨姆奶茶 15X500ML | `produce` → `pantry` |
| 25541 | Herbal Tea Drink 24x310ml | 王老吉凉茶 | `produce` → `pantry` |
| 25542 | Taisun Grass Jelly Drink 24x310ml | 泰山 鲜草蜜 24x310ml | `produce` → `pantry` |
| 25550 | Hanasia Aloe Drink 20x500ML /CS | 韩亚芦荟饮料 20x500ML/箱 | `produce` → `pantry` |
| 25551 | ASSI Aloe Drink 20x16.9oz /CS | 韩国芦荟饮料-20x16.9oz/箱 | `produce` → `pantry` |
| 25553 | Afternoon milk tea | 午后红茶奶茶 | `produce` → `pantry` |
| 25563 | RAMUNE Melon 24x6.7oz /CS | 日本弹珠汽水 (哈密瓜味) 24瓶 /箱 | `produce` → `pantry` |
| 25565 | RAMUNE Original 5x6x6.76oz /CS | 日本弹珠汽水 (原味) 30瓶 /箱 | `produce` → `pantry` |
| 25568 | RAMUNE Orange 24x6.7oz /CS | 日本弹珠汽水 (柑味) 24瓶 /箱 | `produce` → `pantry` |
| 25589 | RAMUNE Grape 24x6.7oz /CS | 日本弹珠汽水 (葡萄味) 24瓶 /箱 | `produce` → `pantry` |
| 25594 | Yogurt Drink 4pk | 旺旺乳酸菌饮品 | `produce` → `pantry` |
| 25600 | ACC B-13 Lotus Seed Bun 25pc /PKG | B-13 莲蓉包 25pc | `produce` → `prepared` |
| 25601 | ACC E-16 Marat Cake 12pc /PKG | E-16 港式马拉糕12pc | `produce` → `prepared` |
| 25602 | ACC C-01 Seafood Shao Mai 18gx54x4 | C-01 海鲜烧卖 | `produce` → `prepared` |
| 25604 | ACC B-26 Steamed Milk Bun 6pc/Pkg | B-26 牛奶馒头6pc | `produce` → `prepared` |
| 25605 | ACC B-30 Brown Sugar Bun/ PKG | B-30 红糖馒头 | `produce` → `prepared` |
| 25608 | ACC B-29 Wheat Steamed Bun 6pc/Pkg | B-29 全麦馒头6pc | `produce` → `prepared` |
| 25609 | ACC B-28 Roasted Pork Bun 27pc/Pkg | B-28 港式叉烧包 27pc | `produce` → `prepared` |
| 25611 | ACC E-17 Pumpkin Cake 12pc /PKG | E-17 港式南瓜糕12pc | `produce` → `prepared` |
| 25612 | ACC E-26 Date Chiffon Cake 12pc /PKG | E-26 桂圆红枣糕12pc | `produce` → `prepared` |
| 25616 | Banh Pho 10LB /PKG | 鲜潮州稞条(Sincere)-10LB/包 | `produce` → `dry` |
| 25618 | JNKHandmade Glutinous Rice Cake | JNK手工糍粑300g/包 | `produce` → `prepared` |
| 25619 | ACC E-19 Brown Sugar Glutinous Rice Cake/PKG | E-19红糖糍粑(麻薯) | `produce` → `prepared` |
| 25620 | "JNK"Sweet Rice Cake 300g | 红糖爆浆糍粑 | `produce` → `prepared` |
| 25633 | Fu Zhou FIsh Ball 400g/PKG | 福州鱼丸 400g | `produce` → `prepared` |
| 25635 | FISH CAKE .50/PKG F3S4A | 鱼饼 .50/PKG F3S4A | `produce` → `prepared` |
| 25641 | Seafood Tofu 40x400g | 鱼豆腐 | `produce` → `prepared` |
| 25642 | Seafood Tofu LAMSHENG KEE 240g/Pkg | 鱼豆腐 | `produce` → `prepared` |
| 25644 | "JNK"Shrimp Ball Lychee Shape 200g | 荔枝虾球 | `produce` → `seafood` |
| 25645 | ACC C-30 Shrimp Ball w/ Filling 5LB/PKG | C-30 灌汤虾丸5LB | `produce` → `seafood` |
| 25646 | ACC C-44 Mini Curd Pork Link 5LB | C-44 亲亲肠 | `produce` → `meat` |
| 25656 | (O.Tasty) Dumping Chicken/Veg 50pcx8Pkg | 鸡肉锅贴(全美) | `produce` → `meat` |
| 25657 | Chicken&Veg OCM Gyoza 12x32oz | (李先生)鸡肉煎饺 | `produce` → `prepared` |
| 25659 | Pork&Veg OCM GYOZA 12x32oz | (李先生)猪肉煎饺 | `produce` → `prepared` |
| 25661 | WC Veg&Pork Potsticker 2- 8x32oz | 王府井猪肉锅贴(味全) | `produce` → `meat` |
| 25665 | WC Veg&Pork GYOZA 2- 8x32oz | 猪肉煎饺(味全) | `produce` → `prepared` |
| 25666 | WC Pork&Veg Potsticker 12x21oz | 王府井猪肉锅贴(味全)1LB装 | `produce` → `meat` |
| 25685 | Seame Ball PKG | 芝麻汤圆(第一家)-10粒/包 | `produce` → `prepared` |
| 25687 | Peanut Tangyuan | 花生汤圆(第一家)-10粒/包 | `produce` → `prepared` |
| 25698 | Fu Zhou Fish Ball 340g /PKG | 福州鱼丸 340g /包 | `produce` → `prepared` |
| 25700 | Joss Stick | 香线-扎 | `produce` → `supplies` |
| 25701 | ACC C-17 White Fish Balls 5LB | 白鱼丸C-17 | `produce` → `prepared` |
| 25720 | Joss Paper | 金银纸&旗盘-包 | `produce` → `supplies` |
| 25730 | New Year Candy 1LB/PKG | 新年-年糖年饼 1LB/包 | `produce` → `prepared` |
| 25731 | Red Rice Cake 17.64oz/PKG | (香叶)红糖年糕 17.64oz/盒 | `produce` → `prepared` |
| 25734 | Original Flavor Rice Cake - 34.5 oz / PKG | 台湾原味年糕 / 盒 | `produce` → `prepared` |
| 25735 | Red Bean Flavor Rice Cake - 34.5 oz / PKG | 台湾红豆年糕 / 盒 | `produce` → `prepared` |
| 25736 | Mixed Flavor Rice Cake - 34.5 oz / PKG | 台湾八宝年糕 / 盒 | `produce` → `prepared` |
| 25739 | Red Bean Rice Cake - 18.3oz | 台湾红豆年糕(方) | `produce` → `prepared` |
| 25744 | Red Bean Flavor Rice Cake - Box | 红豆年糕-(盒) | `produce` → `prepared` |
| 25755 | Moon Cake 4PC/Pkg | 双黄白莲蓉月饼/盒 | `produce` → `prepared` |
| 25761 | Moon Cake 22.5oz/Pkg | /盒 | `produce` → `prepared` |
| 25762 | Preserved Meats Gift Box 500g | 皇上皇广式腊味礼盒 | `produce` → `preserved` |
| 25767 | Moon Cake Mix 22.5 oz/Pkg | 月饼-/盒 | `produce` → `prepared` |
| 25770 | DXC Moon Cake Gift Set | 富贵中秋月餅禮盒 600g | `produce` → `prepared` |
| 25902 | Peach Oolong Tea 15x500ml | 茶兀-蜜桃乌龙 | `produce` → `pantry` |
| 25913 | KSF Jasmine Tea Drink 15x500ml | 康师傅茉莉清茶 | `produce` → `pantry` |
| 25933 | KSF Sour Plum Drink 15x500ml | 康师傅酸梅汤 | `produce` → `pantry` |
| 25938 | RAMUNE Blue Hawaii 24x6.7oz /CS | 日本弹珠汽水 (夏威夷味) 24瓶 /箱 | `produce` → `pantry` |
| 25941 | MD Peach Vitamin Drink15x600ml (PINK) | 脉动水蜜桃饮料 | `produce` → `pantry` |
| 25942 | KSF Ice Peach Drink 15x500ml | 康师傅水蜜桃水果饮料 | `produce` → `pantry` |
| 25945 | KSF Pear/ Rock Sugar Drink 15x500ml | 康师傅冰糖雪梨/ 箱 | `produce` → `pantry` |
| 25950 | Ye Shu- Natural Coconut Milk12x1000ml | 椰树牌-椰奶 | `produce` → `pantry` |
| 25973 | KSF Honey Grapefruit Drink 15x500ml | 康师傅 蜜茶柚子 | `produce` → `pantry` |
| 25974 | KSF Bowl Ramen Green Pep Per Beef 12x110g /CS | 康師傅 藤椒牛肉桶麵 12x109g /CS | `produce` → `dry` |
| 25975 | KSF Honey Jasmine Tea 15x500ml | 康师傅茉莉蜜茶 | `produce` → `pantry` |
| 25976 | KSF Ramen-Beef (RED)/CS | 康師傅紅燒牛肉麵/箱 包装 | `produce` → `dry` |
| 25977 | KSF Bowl Ramen Beef w/ Pickled Veg 12x122g /CS | 康師傅 老坛酸菜桶麵 12碗 /箱 | `produce` → `preserved` |
| 25978 | KSF Ramen-Pork&Shallot /CS | 康師傅香葱排骨麵/箱 | `produce` → `dry` |
| 25979 | KSF Bowl Ramen Hot&Spice 12x108g /CS | 康師傅 香辣牛肉桶麵 12碗 /箱 | `produce` → `dry` |
| 25980 | KSF Ramen-Chicken&Mushroom /CS GREEN | 康師傅香菇炖鸡面 /CS | `produce` → `dry` |
| 25981 | KSF Ramen-Beef w/ Pickled Veg (PURPLE)/CS | 康師傅老坛酸菜牛肉麵/箱 包装 | `produce` → `preserved` |
| 25982 | KSF Ramen-Shrimp/Fish (BLUE)/CS | 康師傅鲜虾鱼板麵/箱 包装 | `produce` → `dry` |
| 25983 | KSF Bowl Ramen Beef 12x110g /CS | 康師傅 红烧牛肉桶麵 12碗 /箱 | `produce` → `dry` |
| 25984 | KSF Bowl Ramen-Pork&Shallot (YELLOW)/CS | 康師傅香葱排骨桶麵/箱 | `produce` → `dry` |
| 25999 | RAMUNE Plum 24x6.7oz /CS | 日本弹珠汽水 (莓味) 24瓶 /箱 | `produce` → `pantry` |
| 26111 | Moncher Cake Cream | 乐天摩卡派-13.54oz/盒 | `produce` → `prepared` |
| 26117 | Royal Family Mixed Mochi 15.8oz /Pkg | 皇族 日式綜合麻糬 15.8oz/盒 | `produce` → `prepared` |
| 26118 | Roasted Green Peas | 烤青豆-4.9oz/罐 | `produce` → `prepared` |
| 26124 | Garlic Flv Peanut | 蒜蓉花生-10.5oz/袋 | `produce` → `prepared` |
| 26143 | BOBA Milk Tea | 喜之郎杯装珍珠奶茶-原味-4x70G/条 | `produce` → `pantry` |
| 26161 | Pineapple Cake | 凤梨酥(雪之恋)-250g/盒 | `produce` → `prepared` |
| 26169 | PANPAN Bread Roll 480g /PKG | 盼盼手撕面包 (奶香味)-480g/包 | `produce` → `prepared` |
| 26200 | RAMUNE Drink Mixed Favor 24x6.7oz | 日本汽水(混合装)/箱 | `produce` → `pantry` |
| 26207 | RAMUNE Strawberry 24x6.7oz /CS | 日本弹珠汽水 (草莓味) 24瓶 /箱 | `produce` → `pantry` |
| 26218 | RAMUNE Coconut 24x6.7oz /CS | 日本弹珠汽水 (椰子味) 24瓶 /箱 | `produce` → `pantry` |
| 26219 | RAMUNE Pineapple 24x6.7oz /CS | 日本弹珠汽水 (菠萝味) 24瓶 /箱 | `produce` → `pantry` |
| 26223 | RAMUNE Lychee 24x6.7oz /CS | 日本弹珠汽水 (荔枝味) 24瓶 /箱 | `produce` → `pantry` |
| 26332 | Yonghe Original Soy Milk Powder | 永和经典原味豆浆粉(350g)12条/包 | `produce` → `pantry` |
| 26344 | Freeze Dried Persimmon | 柿饼 | `produce` → `dry` |
| 26347 | Evergreen Biscuit - BOX | 万年青饼干- 合 | `produce` → `prepared` |
| 26348 | Evergreen Biscuit | 万年青饼干 | `produce` → `prepared` |
| 26349 | Shousi Mianbao | 原味手撕面包 (稻香村)-258g/包 | `produce` → `prepared` |
| 26350 | Dao Xiang Cun Old-Style Bread | 老面包 (稻香村)-310克/包 | `produce` → `prepared` |
| 26353 | Durian Crispy Pastry | 榴莲香酥饼-280g/包 | `produce` → `prepared` |
| 26365 | Ma Zao | 香脆麻枣 | `produce` → `prepared` |
| 26405 | Sichuan Pepper Sunflower Seeds 160g /PKG | 藤椒瓜子(洽洽) 18x160g | `produce` → `prepared` |
| 26406 | Sea Salted Sunflower Seeds 160g /PKG | 盐焗瓜子(洽洽) 160g | `produce` → `preserved` |
| 26407 | Roasted Sunflower Seeds 160g /PKG | 山桃核瓜子(洽洽) 160g | `produce` → `prepared` |
| 26408 | Sunflower Seed Spiced Flavor 250g/Pkg | 五香瓜子(洽洽) 250g /包 | `produce` → `prepared` |
| 26409 | CHACHA Sunflower Seed (Natural) 250g/Pkg | 原味瓜子 (洽洽) 250g /包 | `produce` → `prepared` |
| 26422 | Caramel Sunflower Seeds 160g /PKG | 焦糖瓜子(洽洽) 160g | `produce` → `prepared` |
| 26470 | Jalap.& Cheese O!TUBE 115g /PKG | 墨西哥辣椒奶酪薯棒 115g | `produce` → `prepared` |
| 26471 | ORION Turtle Chip Corn Flavor 7x80g | 忍者龟薯片-玉米味 (7包) | `produce` → `prepared` |
| 26472 | ORION Turtle Chip Choco Churros Flavor 7x80g | 乌龟酥薯片-肉桂巧克力 (7包) | `produce` → `prepared` |
| 26473 | Herbal Cuisine Hotpot Soup Seasoning /CS | 药膳风味火锅底料 (10包) /箱 | `produce` → `pantry` |
| 26495 | Fruits Mix Gummy Candy | 徐福记混合味新年糖-328g/包 | `produce` → `prepared` |
| 26636 | WW (Tomato) Potato Twist 12x70G | 旺旺浪味仙薯捲 (番茄味) 12x70G | `produce` → `prepared` |
| 26637 | WW Shelly Senbei 520g /PKG | 旺旺雪饼 520g /包 | `produce` → `prepared` |
| 26638 | WW Rice Cracker 520g /PKG | 旺旺仙贝 520g /包 | `produce` → `seafood` |
| 26657 | JIN JIN Assorted Coconut Jelly 1500g | 晶晶 综合椰果果冻 1500g /桶 | `produce` → `prepared` |
| 26690 | PEACH Greek Yogurt 10x200g /PKG | 安慕希 黄桃燕麦酸奶 200g10瓶 | `produce` → `pantry` |
| 26691 | STRAWBERRY Greek Yogurt 12x7.2oz /PKG | 安慕希 草莓酸奶 7.2oz10瓶 | `produce` → `pantry` |
| 26692 | ORIGINAL Greek Yogurt 10x230g /PKG | 安慕希高端原味酸奶 230g10瓶 | `produce` → `pantry` |
| 26694 | ORIGINAL Greek Yogurt 12x205g /PKG | 安慕希 原味酸奶 205g12瓶 | `produce` → `pantry` |
| 26700 | Dried Mango | 芒果干-9.88oz/包 | `produce` → `dry` |
| 26735 | senbei rice cracker | 旺旺仙贝-3.95oz/包 | `produce` → `seafood` |
| 26746 | 3IN1 Instant Thai Tea 8x1KG | 易发牌三合一泰式奶茶 8x1KG | `produce` → `pantry` |
| 26766 | taro Choco roll | 香芋巧克力卷-4.83oz/盒 | `produce` → `prepared` |
| 26767 | Tofu Pudding /CS | 豆腐花 | `produce` → `prepared` |
| 26782 | I MEI EGG MILK Biscuit | 义美鲜乳薄饼-240g/包 | `produce` → `prepared` |
| 26804 | I Mei Scallion Soda Crackers | 义美鲜葱苏打饼干-140g/袋 | `produce` → `prepared` |
| 26925 | Squid Silk | 尤鱼丝-50g/包 | `produce` → `seafood` |
| 26926 | Crispy Fried Fish 2LB | 小酥鱼 | `produce` → `seafood` |
| 26927 | JNKCrispy Fried Pork 1LB /PKG | 小酥肉 1LB /包 | `produce` → `meat` |
| 26959 | Stick Fish Cake | 韩国鱼肠-9.59oz/盒 | `produce` → `prepared` |
| 26994 | Garlic Flavor Broad Bean | 蒜味莲花豆-8oz/包 | `produce` → `prepared` |
| 26996 | Broad Bean BEEF Flavor 22LB | 开花蚕豆(牛肉味) | `produce` → `prepared` |
| 26997 | Broad Bean BEEF Flavor 2LB | 开花蚕豆(牛肉味) | `produce` → `prepared` |
| 28105 | Eel Fish Paste | 了不得鳗鱼鱼滑-400G/包 | `produce` → `prepared` |
| 28108 | Hot Pot Tripe Layers | 日旺千层肚(火锅专用)-170G/包 | `produce` → `meat` |
| 28109 | Hot Pot Beef Tripe | 日旺牛百叶(火锅专用)-150G/包 | `produce` → `meat` |
| 28141 | Fish Tofu | 珍珍鱼豆腐-8oz/包 | `produce` → `prepared` |
| 28142 | Synear Premium Shrimp Dumplings | 思念金牌虾-至臻虾皇饺-12.69oz/袋 | `produce` → `prepared` |
| 28143 | Synear Shrimp and Celery Dumplings | 思念金牌虾-虾仁芹菜-12.69oz/袋 | `produce` → `prepared` |
| 28144 | Synear Shrimp and Pea Shoot Dumplings | 思念金牌虾-虾仁豆苗-12.69oz/袋 | `produce` → `prepared` |
| 28145 | Synear Shrimp and Corn Dumplings | 思念金牌虾-虾仁玉米-12.69oz/袋 | `produce` → `prepared` |

### Legacy `seafood` paths → current categories (166)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 21397 | Seafood Mushrooms 40Pkg | 海鲜菇- 中国 | `seafood` → `produce` |
| 21398 | Chinese Oyster Mushroom 3LB pkg | 中国蚝菇 3LB pkg | `seafood` → `produce` |
| 21399 | King Oyster Mushrooms 11LB | 中国-杏鲍菇 | `seafood` → `produce` |
| 21401 | Oyster Mushroom5LB | 新鲜蚝菇 | `seafood` → `produce` |
| 21402 | King Oyster Mushrooms PKG (HOKTO)-ORGANIC | 杏鲍菇-袋装(HOKTO) | `seafood` → `produce` |
| 21403 | King Oyster Mushrooms USA (HOKTO) | 杏鲍菇 USA (HOKTO) | `seafood` → `produce` |
| 21405 | Brown Beech Mushroom ORG | 有机真姬菇 (蟹味菇) | `seafood` → `produce` |
| 21406 | Brown Beech Mushroom | 真姬菇 (蟹味菇) | `seafood` → `produce` |
| 21603 | Peeled Garlic 5LB/PKG | 去皮蒜头 5LB/罐 | `seafood` → `produce` |
| 28142 | Synear Premium Shrimp Dumplings | 思念金牌虾-至臻虾皇饺-12.69oz/袋 | `seafood` → `prepared` |
| 28143 | Synear Shrimp and Celery Dumplings | 思念金牌虾-虾仁芹菜-12.69oz/袋 | `seafood` → `prepared` |
| 28144 | Synear Shrimp and Pea Shoot Dumplings | 思念金牌虾-虾仁豆苗-12.69oz/袋 | `seafood` → `prepared` |
| 28145 | Synear Shrimp and Corn Dumplings | 思念金牌虾-虾仁玉米-12.69oz/袋 | `seafood` → `prepared` |
| 33401 | Prawn Flavored Crackers 30LB | 虾片 30LB/箱 | `seafood` → `prepared` |
| 33900 | Beef Kebab 1.25LB/Pkg | 牛肉串/包 | `seafood` → `meat` |
| 33901 | Frozen Mashed Taro /pkg | 芋泥 380g/ 包 | `seafood` → `prepared` |
| 33902 | Pollock Fish Dumpling 90g /PKG LAUREL'S | 桂冠 鱼饺 90g /包 | `seafood` → `prepared` |
| 33903 | Pollock Fish Roll 100g /PKG LAUREL'S | 桂冠 火锅饺 100g /包 | `seafood` → `prepared` |
| 33904 | Spicy Mini Cured Pork Patty Link | 辣味亲亲肠-10oz/包 | `seafood` → `meat` |
| 33905 | Mini Cured Pork Sausage 10oz | 亲亲肠 (PS4700) | `seafood` → `meat` |
| 33906 | (Prime Food)Taiwan Brand Pork Patty | 亲亲肠 PS4766 | `seafood` → `meat` |
| 33907 | Mini Cured Pork Patty Link/Corn | 猪肉玉米亲亲肠-10oz/包 | `seafood` → `meat` |
| 33910 | Mini Cured Chicken Patty Link/Corn | 鸡肉玉米亲亲肠-10oz/包 | `seafood` → `meat` |
| 33918 | WC Beef Tendon Ball 8oz/Pkg | 味全牛筋丸WC | `seafood` → `meat` |
| 33919 | Beef Meat Ball 8oz | 牛肉丸 | `seafood` → `meat` |
| 33920 | ACC C-25 Beef Patty Ball 5LBS /PKG | C-25 牛肉丸 5LBS / 包 | `seafood` → `meat` |
| 33926 | FZN Crab Bun Fish Ball - 5LB/Pkg | 蟹粉蟹籽包丸 | `seafood` → `prepared` |
| 33932 | Rice Pudding 350g | 八宝饭 | `seafood` → `prepared` |
| 33944 | Fish Dumpling | 西北鱼饺 | `seafood` → `prepared` |
| 33950 | WC Pork&Chinese Spinach Wonton / CS | (味全)猪肉菠菜馄饨 | `seafood` → `prepared` |
| 33951 | WC Pork,Leek&Shrimp Dumpling | (味全)韭菜鲜虾水饺 | `seafood` → `prepared` |
| 33966 | Mini Cured Pork | 亲亲肠-10oz/包 | `seafood` → `meat` |
| 33974 | Beef Meat Ball | 牛筋丸-8oz/包 | `seafood` → `meat` |
| 33976 | Cuttle Fish Ball | 味全花枝丸30x8oz/箱 | `seafood` → `prepared` |
| 33977 | Cuttle Fish Ball | 味全花枝丸-8oz/包 | `seafood` → `prepared` |
| 33980 | Tomato Flavor | 川香厨房番茄火锅底料-200g/包 | `seafood` → `pantry` |
| 33981 | JNKSpicy Dry Pot Seasoning 5kg/ JUG | JNK 香辣干锅酱/桶 | `seafood` → `pantry` |
| 33982 | Knorr Beef Bouillon 2.2oz | 家乐牌 牛肉汤精 | `seafood` → `pantry` |
| 33983 | Hot & Spicy Pot Soup Seasoning 3.6KG /JUG | 麻辣香锅酱/桶 | `seafood` → `pantry` |
| 33984 | Hot Pot Soup Base 360g /PKG | 手工老火锅底料(好人家) 360g /包 | `seafood` → `pantry` |
| 33985 | Hot Pot Soup-Hot | 小肥羊辣汤火锅底料-235g/包 | `seafood` → `pantry` |
| 33991 | Tomato Hot Pot Flavor 220g PKG | 海底捞火锅底料-220g/包 | `seafood` → `pantry` |
| 33992 | Broth Flavor | 海底捞清油火锅底料-220g/包 | `seafood` → `pantry` |
| 34000 | 3/8 SPUD QUEEN Steak Fries Unseasoned 30LB 469 | 无味宽薯条 469 | `seafood` → `prepared` |
| 34001 | SPUD QUEEN 3/8 straight cut seasoned 427 | 鹽6pkg/ 箱 SPUD QUEEN | `seafood` → `prepared` |
| 34060 | 1/2" Crinkle Cut Fries 30LB (Unseasoned) | 1/2寸 粗花纹无味薯条 30LB FarmerJack | `seafood` → `prepared` |
| 34061 | 3/8" Straight Cut Fries 30LB (ECOVALLEY) | 3/8寸无味细薯条 30LB (ECOVALLEY) | `seafood` → `prepared` |
| 34062 | 7/16 Crinkle Fries 30LB (Unseasoned) | 1/2寸 粗花纹无味薯条 30LB | `seafood` → `prepared` |
| 34063 | 1/2" Crinkle Cut Fries 30LB (Eco Valley) | 1/2寸 粗花纹无味薯条 30LB (EcoValley) | `seafood` → `prepared` |
| 34064 | 5/16'' Thin Regular Cut Fries 30LB | 细有味薯条 30LB | `seafood` → `prepared` |
| 34065 | 1/2" Straight Fries 30LB | 有味粗薯条 30LB | `seafood` → `prepared` |
| 34066 | 3/8" Straight Cut Seasoned Fries 27LB | 3/8寸 有味麦当劳薯条 27LB | `seafood` → `prepared` |
| 34067 | French Fried Potatoes 3/8" Straight Cut 6x5lb | 细薯条3/8寸 30LBS Straight Cut | `seafood` → `prepared` |
| 34076 | Tater Tots/ French Potatoes - 30LB / CS | 炸薯球 / 箱 | `seafood` → `prepared` |
| 34081 | 3/8" Straight Cut Fries 30LB | 麦当劳细薯条 30LB | `seafood` → `prepared` |
| 34082 | Seasoned 1/2 Straight Fries 30LB | 1/2 直有味薯条 | `seafood` → `prepared` |
| 34084 | Mini Turkey Corn Dogs 10.75LB | 迷你玉米热狗 10.75LB | `seafood` → `meat` |
| 34206 | Onion Rings (RED ROBIN) 5.25lb | 棕箱洋葱环-5.25Lb/箱 | `seafood` → `prepared` |
| 34207 | Onion Rings 10lb | 洋葱环-10Lb/箱 | `seafood` → `prepared` |
| 34208 | Heavy Breaded Okra 10LB | 炸秋葵 | `seafood` → `prepared` |
| 34251 | WC Fried Garlic -6oz / PKG | 油蒜酥 | `seafood` → `pantry` |
| 34254 | Crispy Fried Onion CS | 油葱酥(荘园)-10x1Lb/箱 | `seafood` → `pantry` |
| 34300 | Chicken Pattie Fritters 20LB | 麦当劳 鸡粒 20LB | `seafood` → `meat` |
| 34301 | Sweet & Sour Chicken 30LB | 甜酸鸡 30LB | `seafood` → `meat` |
| 34305 | Chicken Nuggets 20LB | 炸鸡块 /箱 | `seafood` → `meat` |
| 34320 | Chicken Nuggets (CTC626A) 30LB | 炸鸡块 麦当劳 (CTC626A) /箱 | `seafood` → `meat` |
| 34363 | Sweet & Sour Chicken 24LB | 冷冻甜酸鸡块 24LB | `seafood` → `meat` |
| 34501 | Corn Nugget 6x2LB /CS | 炸玉米粒12LB | `seafood` → `prepared` |
| 34906 | DASIDA Beef Soup Stock CJ10x1KG | CJ 牛肉汤粉10x1KG | `seafood` → `pantry` |
| 34907 | ASSI FRIED FISH CAKE 22x14oz | ASSI韩国三角鱼豆腐 | `seafood` → `prepared` |
| 35010 | Pink Sushi Ginger 20LB | 日本姜片- 红 | `seafood` → `prepared` |
| 35012 | Taifeng Mini Pink Sushi Ginger 200x6g /PKG | Taifeng 小包日本姜片200x6g /包 | `seafood` → `prepared` |
| 35013 | Taifeng White Sushi Ginger 3.3kg /Jug | Taifeng 日本姜片3.3kg | `seafood` → `prepared` |
| 35014 | White Sushi Ginger 20LB | 白- 日本姜片 | `seafood` → `prepared` |
| 35040 | EBI Shumai Nissu/ 25PC | 鲜虾烧卖Nissui 25PC | `seafood` → `prepared` |
| 35050 | Edamame Soy Bean 20x400G | 毛豆仁(没壳)20x400G (翔一) | `seafood` → `prepared` |
| 35052 | Edamame 20x14oz(B) | 毛豆荚带壳(翔一) | `seafood` → `prepared` |
| 35054 | Edamame FRZ Soybeans 20Pkg Kouu | 毛豆荚-雨(KOUU)(B) | `seafood` → `prepared` |
| 35056 | JNK Edamame 20x14oz | 毛豆荚(JNK)(A) | `seafood` → `prepared` |
| 35065 | Spicy Miso RED WHITE BOX | 红味曾 | `seafood` → `pantry` |
| 35066 | BLUE Miso Soup Base 44LB (WHT BOX) | 日本白味曾 44LB | `seafood` → `pantry` |
| 35070 | Seaweed Salad 4.4LB/Pkg(Tai Wan) | 日本海带沙拉-(台湾) | `seafood` → `prepared` |
| 35074 | Seaweed Salad 4 x 4.4LB(Tai Wan) | 日本海带沙拉-(台湾) | `seafood` → `prepared` |
| 35111 | PINK Soy Crepe 60g /PKG (Takaokaya) | 粉 寿司豆腐皮20张 /包 | `seafood` → `prepared` |
| 35112 | YELLOW Soy Crepe 60g /PKG (Takaokaya) | 黄 寿司豆腐皮20张 /包 | `seafood` → `prepared` |
| 35113 | GREEN Soy Crepe 60g /PKG (Takaokaya) | 绿 寿司豆腐皮20张 /包 | `seafood` → `prepared` |
| 35115 | (HALF) Yaki Sushi Nori 10PKG /BOX | (鑫) 寿司紫菜半张10x100张 /盒 | `seafood` → `prepared` |
| 35116 | (FULL) Yaki Sushi Nori 10PKG /BOX | (鑫) 寿司紫菜全张 10x100张 /盒 | `seafood` → `prepared` |
| 35126 | Powder Wasabi - 2.2LB (SR) | 日本芥辣粉-2.2LB/包 | `seafood` → `pantry` |
| 35131 | Sushi Seasoning 5.28GAL | 寿司有味醋5.28GAL(味滋康) | `seafood` → `pantry` |
| 35132 | FUJI Sushi Vinegar 3.97GAL USA | 寿司醋 (富士) | `seafood` → `pantry` |
| 35133 | MIZKAN Fuji Sushi Vinegar 3.97GAL | 寿司调味醋 3.97GAL (MIZKAN) | `seafood` → `pantry` |
| 35136 | (SR)B-Powder Wasabi 10x2.2LB | 日本芥辣粉 | `seafood` → `pantry` |
| 35149 | Bamb. Chopstick White 10Pkg | 白封日本筷子 | `seafood` → `supplies` |
| 35150 | Tempura Batter 30LB | 日本炸粉 | `seafood` → `pantry` |
| 35153 | Tempura Batter Mix-44LB | 天妇罗粉 | `seafood` → `pantry` |
| 35160 | Kewpie Mayonnaise 500g /pkg | Kewpie日本美乃滋 | `seafood` → `pantry` |
| 35171 | Wakame Dried Seaweed 1lb /PKG | 日本海带芽1LB/包 | `seafood` → `prepared` |
| 35180 | Dried Kelp (Seaweed) 2.2lb /PKG | 昆布 2.2LB/包 | `seafood` → `prepared` |
| 35188 | Mirin Fu (Kouu) 4.76GL / CS | 米林甜酒(雨) / 箱 | `seafood` → `pantry` |
| 35199 | Mirin Sweet Wine (Honteri) 3.97GL | 米林甜酒(Mirin) | `seafood` → `pantry` |
| 35206 | Sushi Box (OP-1.0) 400' | 寿司盒(OP-1.0)400' | `seafood` → `supplies` |
| 35221 | FH10 (TZ-010) Sushi Tray 400' /CS | 日本寿司盒 (TZ-010)-400套/箱 | `seafood` → `supplies` |
| 35224 | Sushi Container | 日本高合寿司合(TZ-815)-450套/箱 | `seafood` → `supplies` |
| 35226 | FH08 Sushi Tray 400' /CS | 日本寿司盒 (TZ-008)-400套/箱 | `seafood` → `supplies` |
| 35227 | FH-64 Round Sushi Tray 120' /CS | 日本圆寿司盒 (FH-64) 120套/箱 | `seafood` → `supplies` |
| 35228 | FH-63 Round Sushi Tray 120' /CS | 日本圆寿司盒 (FH-63) 120套/箱 | `seafood` → `supplies` |
| 35230 | Bento Box | 五格寿司盒 (OP305)-300/箱 | `seafood` → `supplies` |
| 35235 | FH-307 Bento Box 5 Comp 100' | FH-307 日本便当5隔盒 100套 | `seafood` → `supplies` |
| 35274 | JN-78B BLACK Container150' 30oz | 方椭圆黑底胶盒JN-78B 30oz | `seafood` → `supplies` |
| 35276 | JN-68B Black Container 150' | 方椭圆黑底胶盒 JN-68B | `seafood` → `supplies` |
| 35292 | FH-306 Bento Box 200 Set | FH-306 日本便当盒 200套 | `seafood` → `supplies` |
| 35300 | Roasted Cooked Sesame Seed 2.2 LB /PKG | (熟) 日本白芝麻 2.2LB/包 | `seafood` → `pantry` |
| 35304 | Roasted Black Sesame Seed 2.2LB /PKG | 熟黑芝麻 2.2LB /包 | `seafood` → `pantry` |
| 35305 | ASSI Roasted Sesame Seed 40lb | 熟白芝麻40lb | `seafood` → `pantry` |
| 35321 | Teriyaki Glaze Kikkoman 6x5LB | 万字 照烧汁 | `seafood` → `pantry` |
| 35328 | Sushi Rice Vinegar(Marukan)5.28GL | (Marukan)日本寿司醋 | `seafood` → `pantry` |
| 35329 | Teriyaki Sauce Kikkoman 4x1Gal | 万字烧烤酱 | `seafood` → `pantry` |
| 35331 | Sushi Sauce (EEL) Kikkoman 6x5LB | 万字(K-Unagi Tare)寿司酱(鳗鱼酱) | `seafood` → `pantry` |
| 35332 | KANEI Bonito Flake 2x20x1.4oz /CS | 日本柴鱼片 2x20x1.4oz | `seafood` → `pantry` |
| 35333 | KOUU Bonito Flake 500g /PKG | 日本柴鱼片 500g/包 | `seafood` → `pantry` |
| 35372 | Welna Tempura Batter Mix 20KG | 日本日清炸粉(正宗) 44Lb/包 | `seafood` → `pantry` |
| 35397 | (BROWN) Korean BBQ Kalbi Sauce 1.85LB | 韩式牛小排烧烤酱1.85LB/ 瓶 | `seafood` → `pantry` |
| 35398 | (PURPLE) Korean BBQ Bulgogi Sauce 1.85LB | 韩式牛肉烧烤酱1.85LB/ 瓶 | `seafood` → `pantry` |
| 35419 | Udon Noodle 6x1.25kg Shoichi | 乌冬面SHOICHI 翔一 | `seafood` → `prepared` |
| 35465 | Frozen Udon Noodle | 乌冬面 | `seafood` → `prepared` |
| 35472 | Frozen Udon Noodle KOUU 6x5x250g | 乌冬面-雨(Kouu) | `seafood` → `prepared` |
| 35489 | FRZ. Soy Bean Pea 18.83Lb Kernrls | 冷冻毛豆仁 | `seafood` → `prepared` |
| 35624 | Yuzu Citrus Juice Mizkan - 32oz / PKG | 柚子汁(Mizkan) / 瓶 | `seafood` → `pantry` |
| 35628 | Eel Sauce | 烧鳗汁(TOYO)-1.8L/罐 | `seafood` → `pantry` |
| 35629 | Eel Sauce | 烧鳗汁(万字)-5L/瓶 | `seafood` → `pantry` |
| 35650 | White Envelop Chopstick L:23 | 白封套筷子 | `seafood` → `supplies` |
| 35651 | Premium Bamboo Chopstick (WHT) 1600' | 御膳高级白封套筷子 (K.B) | `seafood` → `supplies` |
| 35652 | Bamboo Chopsticks(GREEN PRINT) White Envelope 10Pkg | 日本白封筷子绿字(割箸)680prs | `seafood` → `supplies` |
| 35653 | L:21 WHITE Envelope Chopsticks 60x20 | 日本白封套双生筷黑字(竹箸 )60x20 | `seafood` → `supplies` |
| 35661 | Hondashi Soup Stock (Ajinomoto) 12x2.2Lb | 日本鱼味精-12x2.2Lb/箱 | `seafood` → `pantry` |
| 35662 | KOUU Hondashi 1KG /PKG | 日本鱼味精-1KG /盒 (10) (B) | `seafood` → `pantry` |
| 35663 | Hondashi Soup Stock - PKG | 日本鱼味精 2.2Lb /盒 (12) (A) | `seafood` → `pantry` |
| 35664 | JNK Mushroom/Fungus Soup Base 20PKG/CS | JNK 菌菇汤底500gx20/箱 | `seafood` → `pantry` |
| 35665 | JNK Tomato Soup Base 12x1kg /CS | JNK 番茄火锅汤底 12x1kg /箱 | `seafood` → `pantry` |
| 35666 | JNKSpicy Golden Soup Seasoning 60x200g | JNK酸辣金汤料 200gx60/箱 | `seafood` → `pantry` |
| 35730 | Baran Yamagata 1GO | 日本山型1号-1000pc/盒 | `seafood` → `supplies` |
| 35763 | Lunch Box | 日本午餐合(JN-810)-500套/箱 | `seafood` → `supplies` |
| 35767 | Sushi Tray | 日本便当合(JN-305)-252/箱 | `seafood` → `supplies` |
| 35776 | Sushi Tray | 日本便当合(FH-304)-252/箱 | `seafood` → `supplies` |
| 35808 | Sushi Containers Plates JN-10 | 日本寿司盒 (1200') JN-10 | `seafood` → `supplies` |
| 35811 | Sushi Containers Lids JN-10 | 日本寿司盖 (1200') JN-10 | `seafood` → `supplies` |
| 36100 | Sushi INARI Bean Curd 2.2LB /PKG | 日本壽司腐皮 2.2LB | `seafood` → `prepared` |
| 36104 | Tamago (Sushi Egg) 1.1LB /PKG | 寿司日式蛋(玉子烧)1.1LB | `seafood` → `prepared` |
| 36108 | Red Kamaboko (Fish Cake) 6oz /PKG | 拉面红鱼板 6oz /包 | `seafood` → `prepared` |
| 36110 | Fish Cake 20x135g (Wismettac) | 日本拉面鱼饼 20根x135g | `seafood` → `prepared` |
| 36111 | NAMA Yaki Soba 10x16.93oz /CS | 荞麦面10x16.93oz /CS | `seafood` → `prepared` |
| 36248 | Frz Octopus Ball /CS(Takoyaki) | 章鱼烧 /箱 (4pkgx45pcs) | `seafood` → `prepared` |
| 36340 | Shrimp Shumai (Ajinomoto) 50PC/ PKG | 鮮蝦燒賣 (Ajinomoto) 50pc/箱 | `seafood` → `prepared` |
| 36612 | Tempura Batter Mix Kikkoman 25lb | 日本甜不辣粉(万字)-25Lb/包 | `seafood` → `pantry` |
| 37100 | Beef Tendon Ball 5LB/Pkg | 牛筋丸 | `seafood` → `meat` |
| 37101 | ACC C-18 Lobster Ball 5LB/Pkg | C-18 龙虾球 | `seafood` → `prepared` |
| 37102 | JNK Fish Ball with Pork Filling 5LB/ PKG | JNK 灌汤鱼丸 /包 | `seafood` → `prepared` |
| 37104 | Fried Fish Ball - 5LB / PKG | 炸鱼丸 / 包 | `seafood` → `prepared` |
| 37105 | Fish Cake Patty - 5LB / PKG | 鱼豆腐 / 包 | `seafood` → `prepared` |
| 37107 | ACC A-02 Fish Bean Curd Roll 2x80PC | A-02 腐皮卷 2X80pc | `seafood` → `prepared` |
| 37108 | Mini Cured Pork Patty Link - 5LB / PKG | 亲亲肠 5LB / 包 | `seafood` → `meat` |
| 37200 | Beef Short Plate IBP 50-70LB | 精品肥牛 IBP | `seafood` → `meat` |
| 37201 | Lamb Boneless Shoulder Roll (ANY BRAND) | 无骨羊肩肉筒 (B401/10-361) | `seafood` → `meat` |
| 37202 | Boneless LAMB SHOULDER MEAT | 无骨羊肩肉 | `seafood` → `meat` |
| 37203 | Lamb Boneless Shoulder Roll (ANY BRAND) | 无骨羊肩肉筒 (B401) | `seafood` → `meat` |

### Legacy `meat` paths → current categories (14)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 20702 | Long Hot Pepper 15LB | 牛角椒 15LB | `meat` → `produce` |
| 20703 | Long Hot Pepper 5LB /PKG | 牛角椒5LB | `meat` → `produce` |
| 21165 | Avocado 48' | 牛油果 | `meat` → `produce` |
| 21250 | Special Egg(WOOD Box) | 特价鸡蛋 | `meat` → `pantry` |
| 21283 | Brown Egg Large-Doz/Pkg | 超市装黄皮鸡蛋(L)1 打 | `meat` → `pantry` |
| 21328 | Vampee Fruit 10LB / CS | 鸡心黄皮 / 箱 | `meat` → `produce` |
| 21721 | Durian Seedless | 冻无籽榴莲(金牛王)-454g/包 | `meat` → `produce` |
| 22107 | CASE GOBO 22/CS | CASE 牛蒡 22/CS | `meat` → `produce` |
| 23046 | Whole Tilapia Gutted 40LB | 海鲫鱼-无肚40LB/箱 | `meat` → `seafood` |
| 23091 | "JNK"Rocket Shaped Squid Wing 2lb/ PKG | 火箭鱿鱼 2lb /包 | `meat` → `seafood` |
| 23302 | Frozen . CUTTLE FISH 44LB | 大目鱼 BEAUTY WING | `meat` → `seafood` |
| 23325 | FROZEN CONGER PIKE 22LB | 去肚海鳗 | `meat` → `seafood` |
| 26996 | Broad Bean BEEF Flavor 22LB | 开花蚕豆(牛肉味) | `meat` → `prepared` |
| 26997 | Broad Bean BEEF Flavor 2LB | 开花蚕豆(牛肉味) | `meat` → `prepared` |

### Legacy `pantry` paths → current categories (19)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 21190 | Watermelon (40)RED INSIDE | 西瓜/粒 (40)红肉 | `pantry` → `produce` |
| 21191 | Watermelon Seedless | 西瓜无籽 (个) | `pantry` → `produce` |
| 21193 | Yellow Watermelon | 黄西瓜/粒 | `pantry` → `produce` |
| 21425 | Watercress 24' | 西洋菜/箱 | `pantry` → `produce` |
| 21426 | Watercress 6'/Pkg | 西洋菜 | `pantry` → `produce` |
| 21625 | Water Caltrop 5LB /PKG | 菱角5LB | `pantry` → `produce` |
| 21630 | Watermelon - Bin | 西瓜 (大筐) | `pantry` → `produce` |
| 21647 | Watermelon-6CT/CS(40LB) | 西瓜-6个40LB/箱 | `pantry` → `produce` |
| 22021 | Eggplant | 中国茄子/箱 | `pantry` → `produce` |
| 22022 | Eggplant 3LB/Pkg | 中国茄子/包 | `pantry` → `produce` |
| 22048 | Fresh Water Bamboo 5LB/PKG | 新鲜茭白 5lb/包 | `pantry` → `produce` |
| 22112 | Thai Eggplant 30LB | 泰国茄子/箱 | `pantry` → `produce` |
| 24332 | Beef Rough Flank Steak | 牛腩 | `pantry` → `meat` |
| 25041 | Fried Gluten W/Peanut In Soy Sauce 24x13oz | 花生面筋(吉祥)瓶 | `pantry` → `prepared` |
| 25604 | ACC B-26 Steamed Milk Bun 6pc/Pkg | B-26 牛奶馒头6pc | `pantry` → `prepared` |
| 25608 | ACC B-29 Wheat Steamed Bun 6pc/Pkg | B-29 全麦馒头6pc | `pantry` → `prepared` |
| 25923 | Peach Oolong Tea15x500ml (ORANGE) | 茶兀蜜桃乌龙茶 | `pantry` → `produce` |
| 25989 | KSF Black Tea 15x500ml | 康师傅冰红茶 | `pantry` → `produce` |
| 26782 | I MEI EGG MILK Biscuit | 义美鲜乳薄饼-240g/包 | `pantry` → `prepared` |

### Legacy `prepared` paths → current categories (10)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 22039 | Chives Flower 5 BUNDLE/ 2LB | 韭菜花 5 捆/2磅 | `prepared` → `produce` |
| 24270 | Pork Bungs 22LB | 猪大肠 22LB | `prepared` → `meat` |
| 24271 | Pork Bung 5LB/Pkg | 猪大肠 5LB/包 | `prepared` → `meat` |
| 25292 | Crispy Cow Pea 138g /PKG | 味聚特 脆豇豆 /包 | `prepared` → `produce` |
| 25477 | Seafood dumplings 10.58LB/Pkg | 鱼皮海鲜饺 | `prepared` → `seafood` |
| 25607 | ACC B-21 Fuzhou Pork Bun 4pc/Pkg | B-21 福州大肉包 | `prepared` → `produce` |
| 25661 | WC Veg&Pork Potsticker 2- 8x32oz | 王府井猪肉锅贴(味全) | `prepared` → `meat` |
| 25666 | WC Pork&Veg Potsticker 12x21oz | 王府井猪肉锅贴(味全)1LB装 | `prepared` → `meat` |
| 26926 | Crispy Fried Fish 2LB | 小酥鱼 | `prepared` → `seafood` |
| 26927 | JNKCrispy Fried Pork 1LB /PKG | 小酥肉 1LB /包 | `prepared` → `meat` |

### Legacy `dry` paths → current categories (3)

| Item # | Public English name | Public Chinese name | Legacy → Current |
|---:|---|---|---|
| 21519 | (PINK) Extra Firm Tofu 12ozx12 | 日本豆腐 - 特老(粉红) HOUSE | `dry` → `produce` |
| 21576 | Ho Fun Rice Noodle-RED | 大田河粉12包 | `dry` → `produce` |
| 21577 | Jasmine Fresh Rice Noodle10x2LB(No Cut) | 新鲜沙河粉10包 | `dry` → `produce` |

## Requested food-prefix cleanup — before → after

| Item # | Raw English source name | Public English name | Current category |
|---:|---|---|---|
| 12151 | *W58030* Beef Strip Loin (Cargill) | Beef Strip Loin (Cargill) | Meat & Poultry |
| 20032 | MACAU99 Broccoli (Check Immediately) | Broccoli | Produce & Fruit |
| 21043 | *V5122* FRZ Sweet Cut Corn 26.45LB | FRZ Sweet Cut Corn 26.45LB | Produce & Fruit |
| 24403 | *LL0166* Bnls Lamb Leg (Thomas) | Boneless Lamb Leg (Thomas) | Meat & Poultry |
| 24490 | *G456* Bone In Lamb | Bone In Lamb | Meat & Poultry |
| 25532 | A04103 Mandarin Soda 24can/cs | Mandarin Soda 24can/cs | Sauces & Seasonings |
| 32009 | U-10 Scallop Millennium - 30LB / CS | Scallop Millennium - 30LB / CS | Seafood |
| 33250 | U-10 Crawfish (Fisherman) 2x5LB | Crawfish (Fisherman) 2x5LB | Seafood |
| 33257 | *OLDF*10-15 CRAWFISH 8x3LB | 10-15 CRAWFISH 8x3LB | Seafood |
| 33258 | U-10 Crawfish (Fisherman) 2x5LB LINEAGE | Crawfish (Fisherman) 2x5LB LINEAGE | Seafood |
| 33259 | *OLDF*10-15 CRAWFISH 2x5LB | 10-15 CRAWFISH 2x5LB | Seafood |
| 34064 | *LW204* 5/16'' Thin Regular Cut Fries 30LB | 5/16'' Thin Regular Cut Fries 30LB | Frozen, Prepared & Snacks |
| 34065 | *CTC8701* 1/2" Straight Fries 30LB | 1/2" Straight Fries 30LB | Frozen, Prepared & Snacks |
| 34081 | *CTE94* 3/8" Straight Cut Fries 30LB | 3/8" Straight Cut Fries 30LB | Frozen, Prepared & Snacks |
| 35131 | *SD-51* Sushi Seasoning 5.28GAL | Sushi Seasoning 5.28GAL | Sauces & Seasonings |
| 37100 | C-28 Beef TendonBall 5LB/Pkg *ACC* | Beef Tendon Ball 5LB/Pkg | Meat & Poultry |
| 37104 | C-26 Fried Fish Ball - 5LB*ACC* / PKG | Fried Fish Ball - 5LB / PKG | Frozen, Prepared & Snacks |
| 37105 | C-20 Fish Cake Patty - 5LB*ACC* / PKG | Fish Cake Patty - 5LB / PKG | Frozen, Prepared & Snacks |
| 37202 | LL0339 BNLS LAMB SHOULDER MEAT | Boneless LAMB SHOULDER MEAT | Meat & Poultry |
| 40314 | *NJ0804NT* Fukein cooking Wine 12x750ml | Fukein cooking Wine 12x750ml | Sauces & Seasonings |
| 72049 | A10011 -Cornmeal (Cracker Meal) / CS | Cornmeal (Cracker Meal) / CS | Rice, Noodles & Dry Goods |
| 91004 | *E102001* Spicy Fried Fish (BOX) 240g /PKG | Spicy Fried Fish (BOX) 240g /PKG | Frozen, Prepared & Snacks |
| 92603 | B-07 Custard Bun | Custard Bun | Frozen, Prepared & Snacks |
| 92624 | B-02 Steamed Twisted Roll Bun *ACC* /PKG | Steamed Twisted Roll Bun /PKG | Frozen, Prepared & Snacks |
| 92626 | B-08 Steam Taro Paste Bun | Steam Taro Paste Bun | Frozen, Prepared & Snacks |
| 92841 | A-11T NanXiang SoupyDumpling/Pkg*ACC* (blue) | Nan Xiang Soupy Dumpling/Pkg (blue) | Frozen, Prepared & Snacks |

The same importer corrects joined or misspelled words, including `SoicyMini → Spicy Mini`, `Favor → Flavor`, `IcelessGreenOnion → Iceless Green Onion`, and `BISUIT → Biscuit`, while retaining product-pack information.

## English drafts for source rows without English names

The current workbook has **34** blank-English rows. **5** are blacklisted non-public records, leaving **29** active products with English drafts for review.

| Item # | Chinese name | English draft |
|---:|---|---|
| 25687 | 花生汤圆(第一家)-10粒/包 | Peanut Tangyuan |
| 26332 | 永和经典原味豆浆粉(350g)12条/包 | Yonghe Original Soy Milk Powder |
| 26350 | 老面包 (稻香村)-310克/包 | Dao Xiang Cun Old-Style Bread |
| 26353 | 榴莲香酥饼-280g/包 | Durian Crispy Pastry |
| 26804 | 义美鲜葱苏打饼干-140g/袋 | I Mei Scallion Soda Crackers |
| 28105 | 了不得鳗鱼鱼滑-400G/包 | Eel Fish Paste |
| 28108 | 日旺千层肚(火锅专用)-170G/包 | Hot Pot Tripe Layers |
| 28109 | 日旺牛百叶(火锅专用)-150G/包 | Hot Pot Beef Tripe |
| 28142 | 思念金牌虾-至臻虾皇饺-12.69oz/袋 | Synear Premium Shrimp Dumplings |
| 28143 | 思念金牌虾-虾仁芹菜-12.69oz/袋 | Synear Shrimp and Celery Dumplings |
| 28144 | 思念金牌虾-虾仁豆苗-12.69oz/袋 | Synear Shrimp and Pea Shoot Dumplings |
| 28145 | 思念金牌虾-虾仁玉米-12.69oz/袋 | Synear Shrimp and Corn Dumplings |
| 40420 | 冻鸭-Duckling-(恭贺新禧) | Frozen Duckling (Fortune) |
| 43205 | 低盐万字(李Lee)Less Sodium 5GL/桶 | Lee Kum Kee Less Sodium Soy Sauce 5 Gal |
| 44524 | Prik Curry Paste-48罐 x4oz/箱 | Prik Curry Paste 48 x 4 oz |
| 64544 | 小库-FH-78W-白-150/箱 | FH-78W White Container 150/CS |
| 65348 | Q-1无隔盒 白-8-1/8x8-1/8x3 Darnel-200/箱 | Q-1 White Single-Compartment Container 200/CS |
| 67413 | (Biocean)13''x7''x17'' 250个 | Biocean Large Paper Bag 13 x 7 x 17 in (250) |
| 67414 | (Biocean)小 10''x5''x13'' 250个 | Biocean Small Paper Bag 10 x 5 x 13 in (250) |
| 73145 | 蛎饼粉-270g/包 | Oyster Pancake Mix 270g |
| 73259 | 沙河粉(Chef"s Choice)10mm(XL)Rice Stick-30x12oz/箱 | Chef's Choice XL Rice Stick 10mm 30x12oz |
| 73539 | 连江鱼面-200g/包 | Lianjiang Fish Noodles 200g |
| 74060 | 条形意大利面Spaghetti-2x10Lb/箱 | Spaghetti 2x10LB |
| 74125 | 7X7春卷皮(大升)Dah SingEgg Roll Skin30LB/箱 | Dah Sing Large Egg Roll Wrappers 7x7 |
| 80157 | 抗疫双煞(杀菌洗手液x2+酒精x2)/箱 | Sanitizing Hand Soap and Alcohol Kit |
| 81060 | 厨帽Chef"s Hat(100pcs)/盒 | Chef Hat 100pcs |
| 81601 | 50LB油格-个 | 50LB Grease Filter |
| 92961 | 葱油花卷-300g/袋 | Scallion Oil Steamed Roll 300g |
| 99915 | 鸡腿40磅/箱 | Chicken Leg 40LB/CS |

## Verified examples

| Item # | Final public result |
|---:|---|
| 34064 | `prepared` · `Frozen` · `5/16'' Thin Regular Cut Fries 30LB` |
| 35188 / 35199 | `pantry` · Mirin products |
| 35224 / 35149 / 35650 | `supplies` · sushi container / chopsticks |
| 21190 / 21425 / 21603 | `produce` · watermelon / watercress / peeled garlic |
| 23046 | `seafood` · Whole Tilapia Gutted 40LB |

Redirect generation runs inside `pnpm build` through `scripts/generate_redirects.mjs`; future imports preserve and regenerate the appropriate legacy paths automatically.
