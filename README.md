# Van Harvest Distribution — website

Public website for Van Harvest Distribution LLC (萬昌), a wholesale Asian food distributor in Charlotte, NC.
Live at **https://vanharvestllc.com** (English) and **https://vanharvestllc.com/zh/** (Chinese).

- **Framework:** [Astro](https://astro.build) 5, fully static output (no server, no database)
- **Hosting:** Vercel, auto-deploys every push to `main`
- **Forms:** FormSubmit (`ordersvhd@gmail.com`), no backend needed
- **Prices are never published.** The public catalog only contains item #, names, category and storage type.

## Run it locally

Requires Node 20+ and pnpm (`npm i -g pnpm`).

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build into dist/
pnpm preview    # serve the built site
```

`pnpm build` also regenerates the catalog data files, the sitemap, runs type checks and writes
redirect pages for products that moved category.

## Project layout

| Path | What it is |
|---|---|
| `src/pages/` | Every page. `src/pages/zh/` holds the Chinese versions. |
| `src/components/` | Shared page sections (header, footer, catalog, forms, product detail). |
| `src/data/products.json` | **The public catalog** (generated from the warehouse Excel export). |
| `src/data/site.ts`, `src/data/seo.ts` | Company info, contact details, page titles and descriptions. |
| `public/images/products/ai/{item#}.webp` | White-background studio images, one per Item #. Takes priority over a warehouse photo. Shown with a "representative image" note. |
| `src/data/yellowLabelProductImages.ts` | Warehouse photos (`public/images/products/uploaded/`) mapped to Item #. |
| `src/data/productImages.ts` | Merged lookup. Any product with an image here gets a detail page. |
| `src/data/curatedCategoryFeatured.ts` | Featured Products on each category page. |
| `public/data/` | Search index and per-category JSON used by the catalog page (generated). |
| `data/catalog-rules.json` | Name-cleaning and category rules used by the importer. |
| `data/product-route-redirects.json` | History of products that changed category (drives redirects). |
| `scripts/` | Catalog import, data generation, sitemap, redirects, image resizing. |
| `vercel.json` | Hosting config: cache headers and permanent redirects (generated, see below). |
| `docs/manus-reports/` | Reports and plans from the original build, kept for reference only. |

## Updating products from the warehouse system

1. Export the stock list from the warehouse system as Excel (the same `Stock_list.xls` export used so far).
2. Save it as `data/source/Stocklist.xls` (this path is git-ignored because the export contains cost
   and price columns — **never commit it**).
3. Run:

   ```bash
   pip install pandas openpyxl xlrd
   pnpm catalog:import                      # rebuilds src/data/products.json + public data + sitemap
   node scripts/generate_vercel_config.mjs  # refresh redirects for any products that changed category
   pnpm build                               # make sure everything still builds
   ```

   You can also point the importer at another file: `python3 scripts/import_stocklist.py /path/to/export.xls`.
4. Review the summary printed by the importer (`data/stocklist-import-report.json` has the details),
   then commit and push. Vercel deploys automatically.

## Adding product photos

1. Save the image as `{item#}.webp` (1280×960, white background, under ~200 KB) in `public/images/products/ai/`.
   Replacing a file with the same name replaces the picture.
2. `pnpm build` (it regenerates `src/data/studioProductImages.ts`), then run `node scripts/generate_vercel_config.mjs`.
3. Commit and push.

(A browser-based admin page for photos and Excel uploads is planned so this won't require code changes.)

## Deploying

Vercel project settings (already captured in `vercel.json`):

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm build`
- Output: `dist`
- Domains: `vanharvestllc.com` (primary) and `www.vanharvestllc.com` (redirects to the apex)

Keep the DNS email records (MX, SPF and the `mx`, `mail`, `pop`, `smtp`, `imap`, `webmail` hosts) untouched when changing
website DNS. Also keep the Bing verification CNAME (`daedecc5655378c1c2c15e8682110521` → `verify.bing.com`) and the
Google `google-site-verification` TXT record.

## SEO notes

- Canonical domain is the apex `https://vanharvestllc.com` with trailing slashes.
- Every page has an English/Chinese `hreflang` pair; structured data lives in the page layout.
- Google Search Console (domain property) and Bing Webmaster Tools are verified; the sitemap is
  `https://vanharvestllc.com/sitemap.xml`.
- If a product moves category, its old URL must keep working: the importer records the move in
  `data/product-route-redirects.json`; run `node scripts/generate_vercel_config.mjs` to turn that into 301 redirects.
