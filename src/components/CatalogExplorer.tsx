import { useEffect, useMemo, useState } from 'react';
import productsData from '@/data/products.json';
import { categories } from '@/data/site';

type Product = { id: string; code: string; name: string; nameZh: string; category: string; packSize?: string; storage?: string };
const products = productsData as Product[];
const STEP = 50;

export default function CatalogExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(STEP);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryValue = params.get('category');
    const searchValue = params.get('q');
    if (categoryValue && categories.some((item) => item.key === categoryValue)) setCategory(categoryValue);
    if (searchValue) setQuery(searchValue);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = category === 'all' || product.category === category;
      const inSearch = !term || `${product.id} ${product.name} ${product.nameZh}`.toLowerCase().includes(term);
      return inCategory && inSearch;
    });
  }, [category, query]);
  const chooseCategory = (value: string) => { setCategory(value); setLimit(STEP); };
  const reset = () => { setCategory('all'); setQuery(''); setLimit(STEP); };
  const currentName = category === 'all' ? 'All products' : categories.find((item) => item.key === category)?.name;

  return <div className="catalog-shell catalog-shell-wide">
    <div className="catalog-main">
      <div className="catalog-search"><label htmlFor="product-search">Search the catalog / 搜索目录</label><input id="product-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(STEP); }} placeholder="Search Item #, English or Chinese name / 搜索编号、中英文名" autoComplete="off" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></div>
      <div className="catalog-filter-row" aria-label="Quick category filter"><span>Quick filter</span><div><button type="button" className={`category-pill ${category === 'all' ? 'is-active' : ''}`} onClick={() => chooseCategory('all')} aria-pressed={category === 'all'}>All</button>{categories.map((item) => <button type="button" key={item.key} className={`category-pill ${category === item.key ? 'is-active' : ''}`} onClick={() => chooseCategory(item.key)} aria-pressed={category === item.key}>{item.name}</button>)}</div></div>
      <div className="catalog-summary" aria-live="polite"><span>{currentName}</span><span>{filtered.length.toLocaleString()} results / 结果</span></div>
      <div className="product-table" role="table" aria-label="Van Harvest product catalog"><div className="product-head" role="row"><span role="columnheader">Item #</span><span role="columnheader">Product / 产品</span></div>{filtered.length ? filtered.slice(0, limit).map((product) => <a className="product-row" role="row" key={product.id} href={`/products/${product.category}/${product.id}`}><code role="cell">{product.id}</code><strong role="cell"><span>{product.name}</span>{product.nameZh && <small>{product.nameZh}</small>}</strong></a>) : <div className="empty-state"><h3>No products found / 暂无结果</h3><p>Try an Item #, English name, Chinese name or category.</p><button type="button" onClick={reset}>Clear filters / 清除筛选</button></div>}</div>
      {limit < filtered.length && <div className="load-more"><button type="button" onClick={() => setLimit((value) => value + STEP)}>Load more · {Math.min(STEP, filtered.length - limit)} items</button></div>}
    </div>
  </div>;
}
