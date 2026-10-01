# Van Harvest 网站交付与数据审核记录 (2026-10-01)

本记录汇整了本轮在公开文案、导航转化、UI 细节、产品数据清洗、中英双语与 SEO 方面的全部更新。所有公开页面继续遵循不公开价格的原则，价格位置统一呈现「申请开户查看价格 / Apply for an account to see pricing」。

---

## 仍需用户提供与确认的待定信息

| 待定项目 | 当前实现与线上状态 | 建议后续补充的正式内容 | 对网站功能的影响 |
| --- | --- | --- | --- |
| **正式生产域名** | 当前使用相对路径与本地预览服务；未绑定假设的外部生产域名。 | 例如 `https://vanharvestnc.com` 或 `https://vanharvestdistribution.com`。 | 配置后可运行 `scripts/generate_sitemap.py` 生成包含全部公开页面及 2,821 个产品页的 `sitemap.xml`，并激活全站 canonical 与绝对图片 URL。 |
| **路线配送日与截单时间** | 明确列出北卡、南卡、亚特兰大和维吉尼亚四大配送区域，文案引导客户在开户后按路线确认。 | 各区域的固定送货日（如每周一、三、五）与截单时间点（如前一日 17:00）。 | 补充后可直接替换配送范围页（`/delivery` 与 `/zh/delivery`）的说明卡片。 |
| **各区域最低起送额** | 未编造起送美金金额，统一由开户后的业务沟通确定。 | 例如夏洛特本地起送金额（如 $300）及外州跨路线起送金额（如 $800）。 | 补充后可在配送范围与开户页呈现清晰的起送门槛。 |
| **另外两处设施的正式地址** | 主仓库使用已确认的 `5226 Terminal St, Charlotte, NC 28208`；冷库与配送运营卡片重点展示运营能力。 | 另外两处仓库或中转站的精确门牌号、城市与联系电话。 | 补充后可在首页设施网络和公司介绍页中展示三处设施的详细定位。 |
| **正式营业与收货时间** | 未编造具体的上下班时间。 | 办公室接单时间（如周一至周五 08:00 - 17:00）与仓库提卸货时间。 | 补充后可完善首页 LocalBusiness 结构化数据的 `openingHoursSpecification`。 |
| **采购与人事独立邮箱** | 销售直达 `ordersvhd@gmail.com`，客服、采购、招聘均由办公室邮箱 `vanharvestoffice2019@gmail.com` 转交。 | 若后续配置专用采购与人事邮箱（如 purchasing@ 或 hr@）。 | 补充后可在表单与联系方式中直接实现独立部门分流。 |

---

## 名称清洗前后对照表（部分代表条目）

数据来源为用户提供的 `Stocklist.xls`。全表共计 2,954 行原始数据，清洗后上架 2,821 个公开产品，剔除停售及中英文均为空白条目 133 项。触发名称清洗规则的产品共计 1,604 个。清洗后公开产品名称中剩余特殊符号（`*`、`#数字#`）为 0。完整的逐条对照保存在项目文件 `data/catalog-name-cleaning-report.md` 与 `data/stocklist-import-report.json` 中。

| Item # | 英文清洗前 | 英文清洗后 | 中文清洗前 | 中文清洗后 | 清洗规则说明 |
| --- | --- | --- | --- | --- | --- |
| **10004** | `*38840* Fresh Bnls Cushion Meat` | `Fresh Boneless Cushion Meat` | `新鲜无骨无肥猪肉` | `新鲜无骨无肥猪肉` | 清除内部编号 `*38840*`；替换 `Bnls` 为 `Boneless` |
| **10012** | `*90/63/00* Bone In Butt (FRESH)` | `Bone In Butt (FRESH)` | `新鲜有骨猪肉` | `新鲜有骨猪肉` | 清除内部编号 `*90/63/00*` |
| **10018** | `Sausage Original Flavor 12oz/Pkg` | `Sausage Original Flavor 12oz/Pkg` | `原味香肠(东之味)(30)` | `原味香肠(东之味)` | 清除中文末尾箱内数量 `(30)` |
| **10022** | `*18103* Pork Tenderloin (Indiana Kitchen)` | `Pork Tenderloin (Indiana Kitchen)` | `梅花肉` | `梅花肉` | 清除内部编号 `*18103*` |
| **11320** | `FRZ *14701&14702* Whole (Med)Wing*Sanderson* / CS` | `Frozen Whole Medium Wing Sanderson / CS` | `*14701&14702*冷冻中鸡翅 / 箱` | `冷冻中鸡翅 / 箱` | `FRZ` 替换为 `Frozen`；`(Med)Wing` 替换为 `Medium Wing`；清除星号内部编号 |
| **11325** | `*268* WholeWing 140pc (Perdue)` | `Whole Wing 140pc (Perdue)` | `*268*新鲜中鸡翅(140pc)` | `新鲜中鸡翅(140pc)` | `WholeWing` 替换为 `Whole Wing`；清除内部编号 `*268*` |
| **11399** | `#372# FEZ Chicken Wing` | `Frozen Chicken Wing` | `鸡翅(冻)-372` | `鸡翅(冻)` | 清除 `#372#`；`FEZ` 替换为 `Frozen`；清除中文末尾内部编号 `-372` |
| **20000** | `Ho Jing Broccoli (Check Immediately)` | `Ho Jing Broccoli` | `好劲芥兰(Ho Jing)(请当场检查)` | `好劲芥兰(Ho Jing)` | 清除 `(Check Immediately)` 与 `(请当场检查)` |
| **21191** | `Watermelon Seedless - PC` | `Watermelon Seedless` | `西瓜无籽 (个)` | `西瓜无籽 (个)` | 清除内部计价单位 `- PC` |
| **33302** | `(FRESH) BlackCod Fish-PC *NO RETURN*` | `(FRESH) BlackCod Fish` | `黑鳕鱼 **海鲜-保鲜不保活,不退货**` | `黑鳕鱼 海鲜-保鲜不保活,不退货` | 清除 `*NO RETURN*` 标记与 `- PC` |
| **41130** | `Sriracha Chili Sauce 12x28oz (TU'ONG)` | `Sriracha Chili Sauce 12x28oz (TU'ONG)` | `是拉差甜辣椒酱(公鸡)12x28oz` | `是拉差甜辣椒酱(公鸡)12x28oz` | 纠正错误映射的汇丰公鸡瓶装图，改为品类占位图，确保品牌与包装完全对应 |

---

## 本次改动的页面、组件与数据文件清单

| 类别 | 文件路径 | 主要调整内容 |
| --- | --- | --- |
| **共享布局与导航** | `src/components/Header.astro` | 桌面最右增加实心开户按钮；滚动后深色文字对比度自适应；移动端抽屉菜单加入开户、配送范围、服务客户与顶部语言切换，保留完整地址换行。 |
| **共享布局与导航** | `src/layouts/BaseLayout.astro` | 增加双向中英 `hreflang`（含 `x-default`）、可配置 canonical 逻辑、浅色/深色双态 Logo 及 1.5 秒 .reveal 保底脚本。 |
| **共享布局与导航** | `src/components/CallToAction.astro` | 底部行动区统一改为「申请开户 + 电话联系」双转化通道。 |
| **首页与设施展示** | `src/components/LocalizedHomePage.astro` | Hero 主按钮为申请开户、副按钮为搜索产品；活海鲜区改为左图右文；中文改用自然商务语言；挂载 Organization / LocalBusiness 结构化数据。 |
| **首页与设施展示** | `src/components/FacilityNetwork.astro` | 调整设施卡片信息层级，小标签置于标题上方单独一行，标题与说明左对齐。 |
| **首页与设施展示** | `src/components/HomeCatalogMarquee.astro` | 统一品类卡片图片为标准圆角矩形，全站九大类中文名称统一。 |
| **目录与搜索** | `src/components/CatalogExplorer.astro` | 搜索框置于首屏标题下方；手机提示缩短为「Item #、英文或中文名」；增加拼写容错（chiken→chicken）与常用同义词（wing/鸡翅/chicken wing、shrimp/虾、tofu/豆腐）；单数显示为 `1 result`。 |
| **目录与品类页** | `src/components/CategoryGallery.astro` | 统一九大品类中文名，展示 12 项精选产品，去除内部数据清洗说明。 |
| **目录与品类页** | `src/components/CategoryDetailPage.astro` | 精选卡片展示中英名称、温层与包装；同图在一页仅出现一次；缺图展示语义化品类占位。 |
| **产品详情页** | `src/components/LocalizedProductDetail.astro` | 主视觉仅显示一次商品图；缺图采用 `[品类] placeholder`；面包屑中文化；价格统一显示「申请开户查看价格」；JSON-LD 提取品牌。 |
| **产品详情页** | `src/components/RelatedProducts.astro` | 详情页底部新增 6–8 个同类产品推荐，且与首屏主图去重。 |
| **转化与信息页** | `src/components/LocalizedInfoPage.astro` | 开户（含转售证明）、配送、招聘（含 CDL、可上班时间）、供应商（含目录上传）和标准 B2B 隐私政策/条款页全面重构。 |
| **服务与联系页** | `src/components/LocalizedServicesPage.astro` | 重写为配送、开户与下单售后支持等客户关心内容，去除占位词。 |
| **服务与联系页`** | `src/components/LocalizedContactPage.astro` | 移除编号标记，保留真实电话、销售邮箱、办公室邮箱、地图组件与部门表单。 |
| **路由入口** | `src/pages/` 下全部主路由与 `en/`、`zh/` 路由 | 同步多语言路径、描述性 SEO title 与统一视觉规则。 |
| **数据与脚本工具** | `src/data/site.ts` | 统一九大品类中英名称（肉类禽类、蔬菜水果、海鲜、酱料调味、罐头腌制、餐饮用品、米面干货、清洁用品、冷冻点心与零食）。 |
| **数据与脚本工具** | `src/data/productImages.ts` | 纠正 41130 图片映射，建立品牌识别字典。 |
| **数据与脚本工具`** | `scripts/import_stocklist.py` | 扩展特殊字符过滤、中文内部尾号清除与清洗审计输出。 |
| **数据与脚本工具`** | `scripts/generate_public_catalog_pdf.py` | 生成无内部编号与无价格文案的中英双语 PDF 产品目录。 |
| **数据与脚本工具`** | `scripts/generate_sitemap.py` | 准备正式域名配置后的一键 XML Sitemap 生成脚本。 |
