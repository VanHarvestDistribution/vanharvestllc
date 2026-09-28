import { useEffect, useMemo, useState } from 'react';
import productsData from '@/data/products.json';
import { categories } from '@/data/site';

type Product = { id: string; code: string; name: string; category: string };
const products = productsData as Product[];
const STEP = 50;

export default function CatalogExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(STEP);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('category');
    if (value && categories.some((item) => item.key === value)) setCategory(value);
  }, []);

  const counts = useMemo(() => products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {}), []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = category === 'all' || product.category === category;
      const inSearch = !term || `${product.id} ${product.code} ${product.name}`.toLowerCase().includes(term);
      return inCategory && inSearch;
    });
  }, [category, query]);

  const chooseCategory = (value: string) => { setCategory(value); setLimit(STEP); };
  const reset = () => { setCategory('all'); setQuery(''); setLimit(STEP); };
  const currentName = category === 'all' ? 'All products' : categories.find((item) => item.key === category)?.name;

  return <div className="catalog-shell">
    <aside className="catalog-sidebar" aria-label="Product categories">
      <p>Filter by category</p>
      <div className="filter-list">
        <button className={`filter-button ${category === 'all' ? 'is-active' : ''}`} onClick={() => chooseCategory('all')} aria-pressed={category === 'all'}><span>00</span><b>All products</b><small>{products.length}</small></button>
        {categories.map((item) => <button key={item.key} className={`filter-button ${category === item.key ? 'is-active' : ''}`} onClick={() => chooseCategory(item.key)} aria-pressed={category === item.key}><span>{item.index}</span><b>{item.name}</b><small>{counts[item.key] || 0}</small></button>)}
      </div>
    </aside>
    <div className="catalog-main">
      <div className="catalog-search">
        <label htmlFor="product-search">Search the catalog</label>
        <input id="product-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(STEP); }} placeholder="Search by item, code or product name" autoComplete="off" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
      </div>
      <div className="catalog-summary" aria-live="polite"><span>{currentName}</span><span>{filtered.length.toLocaleString()} results</span></div>
      <div className="product-table" role="table" aria-label="Van Harvest product catalog">
        <div className="product-head" role="row"><span role="columnheader">Item</span><span role="columnheader">Code</span><span role="columnheader">Product description</span></div>
        {filtered.length ? filtered.slice(0, limit).map((product) => <div className="product-row" role="row" key={product.id}><code role="cell">{product.id}</code><span role="cell">{product.code || '—'}</span><strong role="cell">{product.name}</strong></div>) : <div className="empty-state"><h3>No products found.</h3><p>Try another item number, code, product name or category.</p><button onClick={reset}>Clear filters</button></div>}
      </div>
      {limit < filtered.length && <div className="load-more"><button onClick={() => setLimit((value) => value + STEP)}>Load more · {Math.min(STEP, filtered.length - limit)} items</button></div>}
    </div>
  </div>;
}
