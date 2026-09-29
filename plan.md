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

展示已确认电话 `(704) 392-8718` 与地址 `5226 Terminal St, Charlotte, NC 28208`。Sales、Customer Service、Purchasing、Human Resources 保留独立卡片；邮箱未提供时显示 “Email coming soon”，不构造虚假地址。网站提供电话拨号与 Google Maps 路线链接。

## 验证

TypeScript 检查、生产构建与现有交互检查将覆盖所有公开路由、2,390 条目录记录、九张图片分类卡、九个品类详情页、Featured Products 跳转、PDF 下载路径、电话和地图链接。Preview 启动后检查 `/manus-routes.json` 返回 200 JSON，并根据用户明确要求进行桌面和手机端视觉检查。


## 参考图片研究

已检查 Ideal Meat Shop 的肉类产品摄影和 US Foods 产品分类结构。Ideal Meat 图片 CDN 对直接下载请求返回 403，US Foods 产品页当前返回 CloudFront 403，因此不将外部热链或未经固化的图片写入生产资源；站点继续使用本地原创品类摄影，待用户提供正式产品图片后替换。
