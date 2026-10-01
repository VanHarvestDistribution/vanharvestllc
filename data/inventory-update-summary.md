# Van Harvest 库存清洗与产品图片对应报告

## 一、基本事实与库存导入
- **来源文件**：`/home/ubuntu/upload/Stocklist.xls`
- **原始记录**：2954 条
- **安全公开目录**：2821 条（无价格、无成本、无在手数量、无采购字段）
- **剔除无效/停售记录**：133 条
- **仓库面积确认**：29,000 SF
- **合作配送区域确认**：North Carolina、South Carolina、Atlanta, GA、Virginia

## 二、产品图片与精选对应
- **用户上传实拍照片**：358 张
- **中文/英文标签高置信度匹配商品**：89 项（例如海天南乳 25025、全美猪肉水饺 25655、东方树叶 25521、巧克力派 91054、真味水饺皮/云吞皮/粗面等）
- **补齐并固化的代表性包装图片**：
  - 是拉差（公鸡牌 41130） -> `public/images/products/catalog/sriracha-41130.webp`
  - 农心辛辣面（73332） -> `public/images/products/catalog/shin-73332.webp`
  - 康师傅绿茶（25943） -> `public/images/products/catalog/kangshifu-25943.webp`
  - 好劲芥兰（20000）、绍菜（20100）、黄洋葱（20410）、铝箔纸（60020）、漂白水（80100）、洗洁精（80115）等

## 三、页面结构清理
- 已彻底移除 Products 页面上的两个临时/未分类展示区：
  - `Recently uploaded / Real products. Being matched.`
  - `From the current assortment / Real products. Real supply.`
- 所有产品展示已收敛到**九大品类**（Meat、Produce、Seafood、Pantry、Preserved、Supplies、Dry、Cleaning、Frozen & Prepared & Snacks）。
- Contact 页面已重构为纯 HTML 原生表格 + 内嵌 Google Maps，彻底避免脚本异常导致的空白。