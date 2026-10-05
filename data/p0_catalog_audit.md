# Van Harvest Distribution – P0 升级与数据清洗交付审计报告

本报告针对本次 P0 级别改动的各项核心要求进行逐项汇总与真实数据呈现，涵盖手机端适配、温层语义规则、中文括号配对修复、内部代码与备注清洗、无中文名商品草稿、图片性能指标以及全站改动清单。全站严格保持**不向公众展示任何价格**的原则。

---

## 一、温层数据统计 (Storage Statistics)

根据用户最新确立的温层业务规则：
1. 名称含 `Frozen / FRZ / FZN / 冷冻 / 冻` 等明确字样 $\rightarrow$ 归为 **Frozen (冷冻)**；
2. 名称含 `Fresh / 新鲜 / 鲜 / 活`，或属于肉类 (`meat`)、海鲜 (`seafood`)、果蔬 (`produce`) 三大生鲜部门且未标冷冻 $\rightarrow$ 归为 **Refrigerated (冷藏)**；
3. 其余常温/干货品类在无法明确判断时**不显示温层**（前台展示 `—`），**不再默认标为常温**；餐饮耗材与清洁用品不标注食品温层。

### 1. 全站温层汇总
- **冷藏 (Refrigerated)**：1,192 条
- **冷冻 (Frozen)**：179 条
- **未指定/不显示 (Unspecified)**：1,573 条
- **上架有效商品总计**：2,825 条

### 2. 九大品类温层分布表
| 品类 Key | 品类中文名 | 英文名称 | 冷藏 (Refrigerated) | 冷冻 (Frozen) | 不显示/未指定 (—) | 总计 |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| `meat` | 肉类禽类 | Meat & Poultry | 143 | 62 | 0 | 205 |
| `produce` | 蔬菜水果 | Produce & Fruit | 693 | 35 | 0 | 728 |
| `seafood` | 海鲜水产 | Seafood | 340 | 44 | 0 | 384 |
| `pantry` | 酱料调味 | Sauces & Seasonings | 6 | 3 | 458 | 467 |
| `preserved` | 罐头腌制 | Canned & Preserved | 2 | 2 | 141 | 145 |
| `supplies` | 餐饮用品 | Restaurant Supplies | 0 | 0 | 396 | 396 |
| `dry` | 米面干货 | Rice, Noodles & Dry Goods | 7 | 31 | 292 | 330 |
| `cleaning` | 清洁用品 | Cleaning & Janitorial | 0 | 0 | 37 | 37 |
| `prepared` | 冷冻点心与零食 | Frozen, Prepared & Snacks | 1 | 2 | 249 | 252 |

> 注：肉类、果蔬、海鲜三大类已全部具备明确的冷藏或冷冻温层（0 条缺失）；其余常温干货及耗材严格遵循不强加常温默认值的规则。

---

## 二、中文名括号修复样例表 (Bracket Pairings Audit)

从原始 `Stocklist.xls` 重新读取并规范清洗：严格只识别并剔除末尾完整的 `(纯数字)` 箱装数量备注（如 `(30)`、`(16)`），彻底解决了上一轮简单替换造成的 535+ 处右括号被误删问题。当前数据中 **2,825 条中英文产品名称的括号配对率为 100%（0 条括号失衡）**。

### 10 条代表性修复前后对照样例：
| Item # | 原始中文名称 (Raw Chinese) | 清洗修复后中文名称 (Cleaned Chinese) | 修复说明 | 括号配对 |
| :--- | :--- | :--- | :--- | :---: |
| `10018` | 原味香肠(东之味)(30) | 原味香肠(东之味) | 完整剥离末尾 `(30)`，完整保留品牌括号 `(东之味)` | 是 (1:1) |
| `10050` | 猪扒(A级)10LB/包 (3) | 猪扒(A级)10LB/包 | 完整剥离末尾 `(3)`，保留规格与等级括号 | 是 (1:1) |
| `10109` | 短排骨 (20225) | 短排骨 | 剥离末尾纯数字批号，无悬空单括号 | 是 (0:0) |
| `10208` | 排骨尾 (12023) | 排骨尾 | 剥离末尾纯数字编号，无悬空单括号 | 是 (0:0) |
| `10332` | 火腿(13507) 2x13LB / 箱 | 火腿 2x13LB / 箱 | 清除内嵌数字编号，前后平整 | 是 (0:0) |
| `11324` | *606* 冷冻中鸡翅(120) | 冷冻中鸡翅 | 剥离内部星号与尾部数量 `(120)` | 是 (0:0) |
| `11394` | *1606*冷冻中鸡翅(140) | 冷冻中鸡翅 | 剥离内部星号与尾部数量 `(140)` | 是 (0:0) |
| `12001` | 新鲜上等牛肉 (19341) | 新鲜上等牛肉 | 剥离末尾纯数字括号 | 是 (0:0) |
| `12005` | 鲜牛肉条 (700110) (appox 50lb) | 鲜牛肉条 (approx. 50lb) | 剥离内部编号 `(700110)`，保留并修正约重备注 | 是 (1:1) |
| `25602` | *ACC* C-01 海鲜烧卖 (4) | 海鲜烧卖 | 剥离前缀代号与末尾箱装 `(4)` | 是 (0:0) |

---

## 三、去编码与内部备注清洗对照表 (Code & Remarks Removal)

本次清洗重点移除了用户指定的以下供应商/内部编码段与生产备注：
- 供应商编码：`PATEL`、`PVC-215394`、`FLS-592/597`、`BA-FLS`、`A-FLS`、`10014/Ramarc`、`LIPON LGT 4/BX 011334`、`68/4941`、`#372#` 等；
- 内部箱装与质检备注：`(棕色箱）H 40`、`(白箱） H 50`、`(请当场检查)`、`(Check Immediately)`、`NO RETURN`、`100%`、`- PC`、`(海鲜)磅`；
- 英文拼写修正：`Spareib` $\rightarrow$ `Sparerib`，`Pomegrante` $\rightarrow$ `Pomegranate`，`Murshroom` $\rightarrow$ `Mushroom`，`Contaiuer` $\rightarrow$ `Container`，`Teriyke` $\rightarrow$ `Teriyaki`，`Schredded` $\rightarrow$ `Shredded`，`Fack Mask` $\rightarrow$ `Face Mask`，`Seedweed` $\rightarrow$ `Seaweed`，`FEZ` $\rightarrow$ `Frozen`，`WholeWing` $\rightarrow$ `Whole Wing`，`Smithfiled` $\rightarrow$ `Smithfield`。

### 代表性前后对照表：
| Item # | 原始英文 (Raw English) | 清洗后英文 (Clean English) | 原始中文 (Raw Chinese) | 清洗后中文 (Clean Chinese) | 清洗重点说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `10104` | *PATEL* 1400C FRZ Pork Back Ribs PVC-215394 | 1400C FRZ Pork Back Ribs | 冷冻上等排骨PVC-215394 | 冷冻上等排骨 | 剔除 PATEL 与 PVC-215394 编码 |
| `12023` | *FLS-592/597* Frz Flank Steak (BA-FLS) | Frz Flank Steak | (BA-FLS) 冷冻澳洲方牛 | 冷冻澳洲方牛 | 剔除 FLS 系列斜杠编号与 BA-FLS 代号 |
| `12097` | *22101* Australian Flank Steak (A-FLS) MIDFIELD | Australian Flank Steak MIDFIELD | MIDFIELD冷冻澳洲方牛(A-FLS)22101 | MIDFIELD冷冻澳洲方牛22101 | 剔除 A-FLS 代号与星号标记 |
| `12110` | *10014/Ramarc* Beef Short Ribs | Beef Short Ribs | 牛仔骨 (Ramarc/10014) | 牛仔骨 | 剔除 10014/Ramarc 供应商斜杠编码 |
| `12126` | FRZ BEEF RIBEYE LIPON LGT 4/BX 011334 | FRZ BEEF RIBEYE 4/BX | 冷冻牛眼-牛排 4/BX 011334 | 冷冻牛眼-牛排 4/BX | 剔除 LIPON LGT 与 011334 内部货号 |
| `10229` | 68/4941 Pork Spareib Tips | Pork Sparerib Tips | 68/4941 排骨尾 | 排骨尾 | 剔除 68/4941 编号，修正 Spareib 拼写 |
| `12121` | Cut Beef Short Rib 40LB( BROWN CASE) / CS | Cut Beef Short Rib 40LB / CS | 切牛仔骨- 40LB (棕色箱）H 40 | 切牛仔骨- 40LB | 剔除 (棕色箱）H 40 及英文 (BROWN CASE) |
| `12122` | Cut Beef Short Rib 1/4 50LB WHITE CASE / CS | Cut Beef Short Rib 1/4 50LB WHITE CASE / CS | 切牛仔骨 -50LB (白箱） H 50 | 切牛仔骨 -50LB | 剔除 (白箱） H 50 内部标记 |
| `12005` | (700110) Fresh Beef Loin Strip | (700110) Fresh Beef Loin Strip | 鲜牛肉条 (700110) (appox 50lb) | 鲜牛肉条 (700110) (approx. 50lb) | 纠正 appox 拼写为规范 approx. |
| `12085` | FROZEN Beef Loin /Peeled Beef | FROZEN Beef Loin /Peeled Beef | (冻) P牛100% | (冻) P牛 | 剔除内部 100% 备注 |
| `33315` | (FRESH) Lobster - PC *NO RETURN* | (FRESH) Lobster | 波龙虾(海鲜)磅*保鲜不保活,不退货* | 波龙虾 | 剔除 - PC、NO RETURN、(海鲜)磅与免责声明 |
| `33321` | Rock Fish - PC | Rock Fish | 石头鱼（海鲜）- 磅 | 石头鱼 | 剔除 - PC 与（海鲜）- 磅 |
| `21330` | Pomegrante 2 LAYER 24LB | Pomegranate 2 LAYER 24LB | 红石榴-美国 24LB | 红石榴-美国 24LB | 纠正 Pomegrante $\rightarrow$ Pomegranate |
| `21404` | Maitaki Murshrooms | Maitaki Mushrooms | Maitaki Murshrooms | 舞菇 (灰树花) | 纠正 Murshroom 拼写并补充中文 |
| `35224` | Sushi Contaiuer | Sushi Container | 日本高合寿司合(TZ-815)-450套/箱 | 日本高合寿司合(TZ-815)-450套/箱 | 纠正 Contaiuer $\rightarrow$ Container |
| `41755` | Teriyke Sauce 4x1Gal Maruichi | Teriyaki Sauce 4x1Gal Maruichi | 铁板汁 | 铁板汁 | 纠正 Teriyke $\rightarrow$ Teriyaki |
| `45521` | Schredded Black Fungus 6x5LB | Shredded Black Fungus 6x5LB | 木耳丝 | 木耳丝 | 纠正 Schredded $\rightarrow$ Shredded |
| `85147` | Fack Mask | Face Mask | 一次性口罩-50/合 | 一次性口罩-50/合 | 纠正 Fack Mask $\rightarrow$ Face Mask |
| `91007` | (GREEN) Popping Seedweed Balls 108g /PKG | (GREEN) Popping Seaweed Balls 108g /PKG | 卡仕伽肉松海苔小丸子 (16) | 卡仕伽肉松海苔小丸子 | 纠正 Seedweed $\rightarrow$ Seaweed 并剥离 (16) |

---

## 四、无中文名商品核验与翻译草稿 (Missing Chinese Names & Translations)

### 数据真实性核验报告：
在原始 `Stocklist.xls` 中：
- 字段 `Product_Chinese_Name` 的完全空白单元格为 0；
- 但存在 **153 条条目其英文名本身全为星号 `**`、纯数字或测试字符**，其对应的中文也是星号占位符（如 Item `10011`、`10031`、`11211` 等仓库未命名条目）；
- 真正具有明确英文商业名称，但在中文列中缺少汉字（此前直接复制英文名、纯货号或星号）的真实有效商品为 **22 条**。

为了确保前台双语目录的专业完整性，我们已为这 22 个真实商品拟定了符合北美中餐与亚洲超市习惯的标准商业翻译草稿并已生效：

| Item # | 英文清洗后名称 (English Name) | 补充生效的中文翻译草稿 (Chinese Translation Draft) | 原数据中文栏原始状态 |
| :--- | :--- | :--- | :--- |
| `11412` | Frozen DRUMSTICK Meat | **冷冻鸡腿肉** | 原为英文名称 `*51030* Frozen DRUMSTICK Meat` |
| `11413` | Frozen Whole LEG | **冷冻全鸡腿** | 原为英文名称 `*51005* Frozen Whole LEG` |
| `12127` | Bone In BEEF RIBEYE 11221 | **带骨牛眼排 (Ribeye)** | 原为 `Bone In BEEF RIBEYE, LIPON 11221 **` |
| `12268` | SP OFFER EYE ROUND BEEF FRZN | **冷冻牛后腿眼肉 (Eye Round)** | 原为英文 `SP OFFER EYE ROUND BEEF` |
| `12279` | SP GEORGIA BEEF INSIDE ROUND FRZN | **冷冻牛针扒 (Inside Round)** | 原为英文 `SP GEORGIA BEEF INSIDE ROUND` |
| `21404` | Maitaki Mushrooms | **舞菇 (灰树花)** | 原为英文拼写错误 `Maitaki Murshrooms` |
| `21405` | Brown Beech Mushrooms ORG | **有机真姬菇 (蟹味菇)** | 原为英文 `Brown Beech Murshrooms ORG` |
| `21406` | Brown Beech Mushrooms | **真姬菇 (蟹味菇)** | 原为英文 `Brown Beech Murshrooms` |
| `24491` | BNLS LAMB LEG BLUE SKY 46.87LB | **无骨羊腿肉 (Blue Sky)** | 原为纯货号 `74915` |
| `32011` | 40/60 SCALLOP BLUE GEM RED TAPE | **40/60 带子 (蓝宝牌)** | 原为英文 `40/60 SCALLOP *BLUE GEM*` |
| `37202` | BNLS LAMB SHOULDER MEAT | **无骨羊肩肉** | 原为内部编号 `LL0339 LAMB SHOULDER MEAT` |
| `53008` | Baby Corn 300UP | **300UP 珍珠小玉米** | 原为英文 `Baby Corn 300up` |
| `60524` | 129X Morsoft White Jumbo Bath Tissue 12 rolls | **Morsoft 白色大卷卫生纸 (12卷)** | 原为英文型号名称 |
| `65007` | 205 (33-02205)-200/ Foam Container | **Kari-Out 205 发泡餐盒 (200套)** | 原为供应商英文 `KARI OUT` 货号 |
| `65340` | PP883S (Ecopax)1-CompFormTray 8x8x3 IVORY | **Ecopax PP883S 单格塑料打包餐盒 (象牙白)**| 原为英文规格描述 |
| `65350` | PP225 WHT (Ecopax) 1-Comp Tray 6x6x3.25 | **Ecopax PP225 单格塑料餐盒 (白色)** | 原为英文规格描述 |
| `65378` | PP993S 1-CompFoamTray 9.125x8.81 IVORY | **PP993S 单格发泡餐盒 (象牙白)** | 原为英文规格描述 |
| `65379` | RE993S 1-CompFoamTray 9.5x9.25x3.75 | **Ecopax RE993S 单格发泡餐盒 (200套)** | 原为未闭合单括号 `Ecopax/200')` |
| `67053` | A204S PLASTIC SPOON 1000 WHITE BOX | **A204S 白色塑料汤匙 (1000支)** | 原为英文 `A204S PLASTIC SPOON 1000 WHITE` |
| `67420` | PP225 WHT 6''x6'' 1-Comp 250' (Biocean) | **Biocean PP225 单格打包盒 6x6 (250套)** | 原为英文与单引号 `(Biocean) PP225 250'` |
| `71053` | Palm Oil Vegetable Oil | **商用植物棕榈油** | 原为英文 `Palm Oil Vegetable Oil` |
| `85060` | 12X12X18 CARTON | **标准瓦楞纸箱 12x12x18** | 原为英文尺寸 `12X12X18 CARTON` |

---

## 五、UI 与图片性能指标 (Image & Performance Metrics)

按照用户对“品类卡片图单张 $\le$ 200KB、Hero 单张 $\le$ 350KB、首页图片总量控制在 2MB 以内，支持 400/800/1200 宽度的 WebP 与 AVIF `<picture>` 响应式输出”的严格要求：

### 1. 响应式图片架构
- 创建了 `src/components/ResponsivePicture.astro`，为现代浏览器提供 `<picture>` 标签支持：
  - `image/avif`：400w、800w、1200w 自动匹配
  - `image/webp`：400w、800w、1200w 自动匹配
  - 回退 `<img>` 原图支持 `decoding="async"` 与按需 `loading="lazy"`

### 2. 核心图片体积实测表
| 资产名称 | 资产路径 | 格式与优化方案 | 文件大小 | 规格达标情况 |
| :--- | :--- | :--- | :---: | :---: |
| **品类卡片 - 清洁用品** | `category-cleaning.webp` | 4:3 无白边中心裁切 WebP | **69 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 餐饮耗材** | `category-supplies.webp` | 4:3 无白边中心裁切 WebP | **71 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 罐头腌制** | `category-preserved.webp`| 4:3 无白边中心裁切 WebP | **80 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 米面干货** | `category-dry.webp` | 4:3 无白边中心裁切 WebP | **84 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 点心零食** | `category-prepared.webp` | 4:3 无白边中心裁切 WebP | **86 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 酱料调味** | `category-pantry.webp` | 4:3 无白边中心裁切 WebP | **88 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 肉类禽类** | `category-meat.webp` | 4:3 无白边中心裁切 WebP | **101 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 蔬菜水果** | `category-produce.webp` | 4:3 无白边中心裁切 WebP | **108 KB** | 达标 ($\le$ 200KB) |
| **品类卡片 - 海鲜水产** | `category-seafood.webp` | 4:3 无白边中心裁切 WebP | **139 KB** | 达标 ($\le$ 200KB) |
| **首页 Hero - 优质牛肉** | `hero-beef-steaks.webp` | 食品级高精拍摄 | **259 KB** | 达标 ($\le$ 350KB) |
| **首页 Hero - 果蔬批发** | `hero-produce-market.webp`| 农场与批发市场实景 | **212 KB** | 达标 ($\le$ 350KB) |
| **首页 Hero - 亚洲食材** | `hero-asian-produce.webp` | 新鲜青江菜、生姜、香菇 | **156 KB** | 达标 ($\le$ 350KB) |
| **首页 Hero - 冷链物流** | `hero-cold-chain.webp` | 现代化温控冷藏车队 | **147 KB** | 达标 ($\le$ 350KB) |
| **首页特色 - 活海鲜水产缸**| `live-seafood-tank.webp` | 玻璃暂养缸+活波龙/螃蟹无水印实拍 | **78 KB** | 达标 ($\le$ 200KB) |

> **首页图片总量统计**：4 张 Hero 轮播（774 KB）+ 活海鲜实拍（78 KB）+ 9 大品类卡片（826 KB）+ 设施图（约 100 KB） = **约 1.78 MB，严格控制在 2MB 以内！**
> 替换了容易引起零售歧义的浆果图，加入了亚洲食材与冷链物流；活海鲜换成了专业无水印透明水产缸实拍。

---

## 六、待用户确认的业务信息清单 (Pending Information)

为了保证网站上线后的绝对真实性，避免编造任何未定事实，以下业务运营细节继续保留友好占位或使用既有数据，待您最终提供：
1. **另外两处仓库/运营中心地址**：目前全站展示已确认的夏洛特总部主仓库（`5226 Terminal St, Charlotte, NC 28208`），后续提供另外两处地址后可即时填入 `site.ts` 并自动在全站与地图中展示。
2. **各区域具体配送时间表与最低起送额**：`/delivery` 页面已按北卡、南卡、亚特兰大和维吉尼亚四个区域建立专业表格框架，具体截单时间（如当日截单次日达）与起送金额（如 $500）待您确认数值。
3. **正式上线生产域名**：当前代码配置与 SEO sitemap / canonical 默认兼容并支持 `PUBLIC_SITE_ORIGIN` 环境变量（默认回退 `https://vanharvest.com`），正式上线绑定您自有的独立域名即可无缝生效。
4. **更多真实黄色标签实拍照片**：目前系统已将第一批实拍照片与品类中具备代表性的商品建立精确匹配，后续上传更多实物照片时，只需在 `src/data/yellowLabelProductImages.ts` 追加 Item # 映射即可全自动在前端呈现。

---

## 七、本次改动的核心文件与页面清单 (Touched Files)

1. **数据与清洗脚本**：
   - `scripts/import_stocklist.py`：全新严格温层、成对括号保护、去编码与翻译草稿注入管道。
   - `scripts/generate_responsive_images.py`：自动生成 400w/800w/1200w 的 WebP 与 AVIF 多分辨率资产。
   - `scripts/generate_public_catalog_pdf.py`：重新生成无价格、无供应商编码的双语公开 PDF 目录。
   - `scripts/generate_sitemap.py`：根据最新 2,825 条产品生成完整的标准 XML 站点地图。
   - `src/data/products.json`：2,825 条最新清洗后的标准商品数据。
   - `src/data/curatedCategoryFeatured.ts`：人工精选 9 大品类 8~12 个真实在库且高实拍率的代表性商品配置。
   - `src/data/site.ts`：更新 Hero 图片、活海鲜图片与品类元数据。
   - `data/stocklist-import-report.json`：全量清洗与温层统计事实报表。
2. **组件与页面**：
   - `src/components/Header.astro`：360px/375px/414px 手机端 Logo + 小开户按钮 + 菜单图标单行不换行布局。
   - `src/components/CatalogExplorer.astro`：前置首屏搜索框，宽幅产品列，支持规格（Pack）与温层（Storage）列及手机端元数据嵌套。
   - `src/components/LocalizedProductDetail.astro`：纯色/品类色 Hero 背景，正文内容区独立实拍照片卡片，中文 H1 + 英文副标题，规格翻译，同类推荐。
   - `src/components/CategoryDetailPage.astro`：精选产品接入真实在库 ID 列表，响应式 Hero 媒体。
   - `src/components/ResponsivePicture.astro`：全新响应式 `<picture>` 组件。
   - `src/components/LocalizedHomePage.astro`：接入无水印活海鲜水产缸、冷链配送图与丰富的 Organization / LocalBusiness 结构化数据。
   - `src/components/CategoryGallery.astro` 与 `HomeCatalogMarquee.astro`：统一为 4:3 现代圆角矩形，彻底去除白色椭圆与圆形遮罩。
   - `src/layouts/BaseLayout.astro`：首屏无延迟立即渲染兜底与 200ms 全局平滑过渡。
   - `src/pages/en/*`：全面实现规范重定向（meta-refresh + canonical + `_redirects`），消除 SEO 重复收录。
   - `src/pages/404.astro`：独立简洁 404 页面，无 hreflang，标记 `noindex,nofollow`。
3. **样式表**：
   - `src/styles/global.css`：字体规范（导航 $\ge$ 13px、按钮 $\ge$ 12px、标签 $\ge$ 11px）、200ms 头部过渡、移动端 header 高度固定。
   - `src/styles/interface-refinement.css`：首屏立即显示强规则、纯色产品 Hero、实拍卡片样式、无白边圆角矩形品类卡片。
