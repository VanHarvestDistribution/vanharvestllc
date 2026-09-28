# Van Harvest 网站实现计划

## 目标

构建一个以产品目录为核心的响应式食品批发企业官网，准确呈现 Van Harvest LLC 的已知联系信息，并为后续真实图片、部门邮箱与品牌资料更新保留低成本入口。

## 架构

- **框架**：Vite + React + TypeScript。
- **路由**：React Router；`/`、`/products`、`/company`、`/services`、`/contact`。
- **数据**：将用户提供 PDF 提取并清洗为 2,390 条有效静态 JSON 数据；首版保留 Product ID、Code、English Name，并使用编号前缀形成九类一级分类。
- **交互**：前端即时搜索、分类筛选、加载更多；无后端和数据库。
- **部署**：静态构建输出到 `dist`。页面路由通过 SPA fallback；版本化 assets 使用长期缓存，HTML 保持可更新。
- **SEO**：每个路由提供唯一标题与描述；公开页面均含可读正文、语义化标题、Open Graph 基础信息、robots 和 sitemap。生产域名未确定前不猜测 canonical。

## 项目结构

- `src/components/`：Header、Footer、PageHero、CTA、产品搜索和共享 UI。
- `src/pages/`：Home、Products、Company、Services、Contact、NotFound。
- `src/data/`：完整产品目录、分类元数据与联系信息。
- `src/styles/`：设计令牌、布局、组件和响应式样式。
- `public/images/`：原创首版食品摄影与品牌图形。
- `public/catalog/`：用户提供的完整产品目录 PDF。
- `public/manus-routes.json`：平台路由清单。

## 分类映射

- `1` Meat & Poultry
- `2` Produce & Fruit
- `3` Seafood
- `4` Sauces, Seasonings & Beverages
- `5` Canned & Preserved Foods
- `6` Restaurant Supplies
- `7` Rice, Noodles & Dry Goods
- `8` Cleaning & Janitorial
- `9` Frozen & Prepared Foods

此映射基于目录代表性条目，后续可由用户调整名称或移动具体产品。

## 联系策略

- 展示已确认电话 `(704) 392-8718` 与地址 `5226 Terminal St, Charlotte, NC 28208`。
- Sales、Customer Service、Purchasing、Human Resources 四个入口保留独立卡片。
- 邮箱未提供时明确显示 “Email coming soon”，不构造虚假地址。
- 提供电话拨号与 Google Maps 路线链接。
- 联系表单首版不声称真实投递；在邮箱到位前引导拨号并保留未来接入邮件服务的位置。

## 验证

- TypeScript 检查和生产构建。
- 代码级验证 5 条路由、2,390 条有效目录数据、搜索与分类状态、PDF 下载路径、电话和地图链接。
- 启动 Preview 后检查 `/manus-routes.json` 返回 200 JSON，并进行允许的桌面与移动端视觉检查。
- 按已确认蓝图执行一次只读独立验收，修复明确问题后保存 checkpoint。
