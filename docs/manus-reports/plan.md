# Van Harvest 网站实现计划

## 目标

构建一个以产品目录为核心的响应式食品批发企业官网，准确呈现 Van Harvest LLC 的已知联系信息，并为后续真实图片、部门邮箱与品牌资料更新保留低成本入口。

## 架构

- **框架**：Astro + React + TypeScript；公开页面通过 Astro 静态生成，搜索目录作为 React 交互岛。
- **路由**：`/`、`/products`、`/products/:category`、`/company`、`/services`、`/contact`。
- **数据**：用户提供 PDF 已被提取并清洗为 2,390 条有效静态 JSON 数据，包含 Product ID、Code、English Name；编号前缀形成九类一级分类。
- **图片目录**：`/products` 首先呈现九张可点击的圆形原创品类摄影卡，取代原有的 1–9 文本列表。首页则以四张图片首屏轮播和一个包含九个部门的图片无限循环画廊展示目录，悬停时暂停并放大，点击进入品类详情页；不再重复展示 Core departments 三卡区块。每张卡链接至静态生成的品类详情页。
- **Featured Products**：每个品类页从真实目录中选择四条有代表性的产品作为 Featured Products；产品卡链接回带有类别和产品编号搜索参数的完整目录。
- **交互**：前端即时搜索、类别筛选、加载更多和无结果状态；无后端和数据库。
- **部署**：静态构建输出到 `dist`。HTML 使用更新友好的 no-cache 策略；构建指纹资源使用长期 immutable 缓存。
- **SEO**：每个路由提供唯一标题与描述；公开页面均含可读正文、语义化标题、Open Graph 基础信息和 robots。生产域名未确定前不猜测 canonical 或绝对 sitemap 地址。首页轮播和循环画廊均提供有意义的 alt 文本、真实链接和 reduced-motion 降级。

## 项目结构

- `src/components/`：Header、Footer、CategoryGallery、CTA、产品搜索和共享 UI。
- `src/pages/`：Home、Products、动态生成的 Product Category、Company、Services、Contact、NotFound。
- `src/data/`：完整产品目录、分类元数据、Featured Product ID 与联系信息。
- `src/styles/`：设计令牌、布局、图片目录、品类页和响应式样式。
- `public/images/`：原创首版食品摄影与品牌图形，全部采用静态可发布资源，集中由数据层引用，便于替换。
- `public/catalog/`：用户提供的完整产品目录 PDF。
- `public/manus-routes.json`：平台路由清单。

## 分类映射

| 编号前缀 | 网站分类 |
| --- | --- |
| `1` | Meat & Poultry |
| `2` | Produce & Fruit |
| `3` | Seafood |
| `4` | Sauces & Seasonings |
| `5` | Canned & Preserved |
| `6` | Restaurant Supplies |
| `7` | Rice, Noodles & Dry Goods |
| `8` | Cleaning & Janitorial |
| `9` | Frozen & Prepared |

此映射基于目录代表性条目，后续可由用户调整名称或移动具体产品。

## 联系策略

展示已确认电话 `(704) 392-8717` 与地址 `5226 Terminal St, Charlotte, NC 28208`。Sales、Customer Service、Purchasing、Human Resources 保留独立卡片；销售表单直达 `ordersvhd@gmail.com`，客服、采购与人事表单发送至办公室邮箱 `vanharvestoffice2019@gmail.com`。网站提供电话拨号与 Google Maps 路线链接。

## 验证

TypeScript 检查、生产构建与现有交互检查将覆盖所有公开路由、2,390 条目录记录、九张图片分类卡、九个品类详情页、Featured Products 跳转、PDF 下载路径、电话和地图链接。Preview 启动后检查 `/manus-routes.json` 返回 200 JSON，并根据用户明确要求进行桌面和手机端视觉检查。


## 参考图片研究

已检查 Ideal Meat Shop 的肉类产品摄影和 US Foods 产品分类结构。Ideal Meat 图片 CDN 对直接下载请求返回 403，US Foods 产品页当前返回 CloudFront 403，因此不将外部热链或未经固化的图片写入生产资源；站点继续使用本地原创品类摄影，待用户提供正式产品图片后替换。


## 用户资料更新（2026-10-01）

办公室电话已按确认更新为 `(704) 392-8717`，办公室邮箱暂用 `vanharvestoffice2019@gmail.com`。用户上传 PDF 中不含经理姓名的 VH / Van Harvest Distribution 标识已裁切为本地 Logo 资源。FoodMart 草稿中的五张真实产品促销图片已固化并接入 `/products` 产品目录展示区；图片已裁掉两侧黑色留白，后续可继续追加用户提供的真实产品图片。

## Catalog and conversion expansion (2026-10-01)

- Product data now flows through `scripts/import_catalog.py` with editable rules in `data/catalog-rules.json`; the importer reads the bilingual PDF, removes blocked records, normalizes names, assigns editable categories, and writes a price-free `src/data/products.json` plus reports.
- The product directory now searches both English and Chinese names, hides internal Code from the UI, and links every active Item # to `/products/:category/:itemNumber` with bilingual metadata, storage, pack-size parsing, category placeholder imagery, and Product JSON-LD without offers or prices.
- The clean catalog PDF is regenerated from the cleaned bilingual data at `public/catalog/van-harvest-product-catalog.pdf`.
- New public conversion/information routes include `/apply`, `/delivery`, `/industries`, `/careers`, `/suppliers`, `/privacy`, `/terms`, plus `/en` and `/zh` entry points and localized information routes.
- Delivery territory, delivery days, cutoff time, minimum order, business history and legal copy remain visibly marked placeholders until Van Harvest confirms them. Forms use the existing office mailbox through a mailto draft; private uploads and server-side persistence require a later backend/email-storage integration.

## Brand, facilities and expanded featured products (2026-10-01)

- 首页改用更明亮的红、深蓝、米色品牌体系，并以仓库、冷库和配送运营摄影取代过暗背景；保持首屏文字可读性。
- 首页新增设施展示：100,000 SF 仓库、冷链能力、North Carolina / South Carolina / Atlanta, GA / Virginia 配送覆盖。三处运营地点的完整地址待 Van Harvest 提供后写入。
- 九大分类页将升级为每类至少 12 个 Featured Products；优先关联用户上传实拍，缺图时使用经公开来源核验的准确产品包装或产品摄影。

## Product landing and downloadable catalog refinement (2026-10-01)

- 首页主视觉改用食品、食材与产品摄影；仓库、冷库和配送图片仅保留在设施介绍区。
- `/products`、`/en/products` 与 `/zh/products` 仅承担九大品类浏览；完整可搜索目录迁移到对应的 `/products/catalog` 子页面，支持带品类筛选的深链接。
- `scripts/import_stocklist.py` 的公开 JSON 输出不再包含内部 Code 与原始供应商字段，并清除名称中的内部编号；`scripts/generate_public_catalog_pdf.py` 从同一公开数据层重建中英双语、无价格、无内部编号的 PDF。

## Homepage, catalog visibility and company narrative (2026-10-01)

- 首页采用一张专属、明亮的食品批发主视觉，不复用 Products 的九类图片；仓库、冷库和运输照片仅在设施展示中承担供应链说明。
- Full Catalog 通过首页首屏按钮、首页提前出现的图片目录带、主导航和 Products 子导航四处进入；中英文切换保留当前 pathname，例如 `/products/catalog` 对应 `/zh/products/catalog`。
- Company 页面改为创始于 2019 年的长文案叙事，使用用户提供的公司海报，并以 Charlotte 为中心连接 NC、SC、Atlanta 和 Virginia 的网络图替代编号式概览卡片。

## Full catalog rendering, navigation hierarchy, and button palette (2026-10-01)

- 完整目录搜索从客户端 React 岛升级为服务端优先预渲染加原生轻量脚本，首屏直接渲染前 50 条产品、分类药丸和搜索框，消除无水合时的空白现象。
- Full Catalog 纯化为 Products 的子页面，不再出现在桌面与移动主菜单第一层；Products 子导航去掉 `01/02` 编号，保留「按品类浏览」与「完整产品目录」两个干净的子栏目标签。
- 全站按钮彻底去除暗红色，统一采用 Van Harvest 的深海蓝为主色、暖金色（Gold/Sand）为悬停和线框辅助色；右下角浮动联系按钮同步切换为深蓝金边。
- 移动端抽屉菜单条目改用 flex 两端对齐，箭头符号与右侧对齐并保持垂直居中，排除了由于宽度不同导致的箭头位移问题。

## Conversion, content, catalog quality and SEO refinement (2026-10-01)

- **公开文案与表单**：删除所有开发过程、清洗逻辑、待确认占位和价格政策说明；用客户导向的 B2B 食品批发语言替换。价格相关行动仅表达「申请开户查看价格 / Apply for an account to see pricing」。招聘与供应商页改为明确的美国 B2B 表单字段和常规法律文本；文件字段保留在浏览器表单内，并在现有无后端架构中通过邮件草稿回退。
- **转化与导航**：桌面导航最右端放置实心开户按钮；移动端把开户、配送范围、服务客户和语言入口纳入抽屉菜单。首页优先引导开户与产品搜索，页尾同时提供开户和电话联系。
- **目录与产品页面**：完整目录把搜索控件前置至首屏并缩短手机端提示。导入器记录清洗前后名称、扩展敏感文本清理和剩余特殊符号审核报告；搜索在静态数据上增加拼写纠正和常用食材中英同义词。产品详情只使用明确的 Item # 产品图，缺图采用统一品类图标占位；添加同类产品，并防止单页重复产品图。
- **双语质量**：建立统一的九大类中英名称和自然商务中文文案；所有详情页面包屑、精选产品和主要转化文案遵循同一语言路径。
- **SEO**：为公开路由使用描述性 title/description；产品 JSON-LD 仅添加可从名称识别的商品品牌，使用绝对产品图 URL。站点保留可配置的生产域名入口，实际域名确认后生成符合 sitemap 协议的绝对 sitemap、canonical、hreflang 和 Organization / LocalBusiness JSON-LD；不使用临时 Preview 域名冒充正式站点。
