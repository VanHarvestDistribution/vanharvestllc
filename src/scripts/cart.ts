// Order cart kept in the visitor's own browser (localStorage). No prices, no payment:
// the cart page emails the list to the sales team, who call the customer to confirm.

export interface CartItem {
  id: string;
  name: string;
  nameZh?: string;
  category?: string;
  qty: number;
}

const KEY = 'vh-order-cart-v1';
export const MAX_QTY = 999;
const listeners = new Set<(items: CartItem[]) => void>();
let memory: CartItem[] = [];

const clampQty = (value: unknown) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), MAX_QTY) : 1;
};

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return memory;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === 'string' && /^[0-9A-Za-z-]{1,20}$/.test(item.id))
      .map((item) => ({
        id: item.id,
        name: String(item.name || '').slice(0, 200),
        nameZh: item.nameZh ? String(item.nameZh).slice(0, 200) : '',
        category: item.category ? String(item.category).slice(0, 40) : '',
        qty: clampQty(item.qty),
      }));
  } catch {
    return memory;
  }
}

function writeCart(items: CartItem[]) {
  memory = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode or blocked storage: keep the cart in memory for this page */
  }
  listeners.forEach((fn) => fn(items));
}

export const cartCount = (items = readCart()) => items.reduce((sum, item) => sum + item.qty, 0);

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const items = readCart();
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) existing.qty = clampQty(existing.qty + qty);
  else items.push({ ...item, qty: clampQty(qty) });
  writeCart(items);
}

export function setQty(id: string, qty: number) {
  writeCart(readCart().map((item) => (item.id === id ? { ...item, qty: clampQty(qty) } : item)));
}

export function removeItem(id: string) {
  writeCart(readCart().filter((item) => item.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function onCartChange(fn: (items: CartItem[]) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const isZh = () => document.documentElement.lang.startsWith('zh');
const cartHref = () => (isZh() ? '/zh/cart/' : '/cart/');

function updateBadges(items = readCart()) {
  const count = cartCount(items);
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((badge) => {
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.hidden = count === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-cart-link]').forEach((link) => {
    const label = isZh() ? `购物车，${items.length} 种产品` : `Order cart, ${items.length} ${items.length === 1 ? 'product' : 'products'}`;
    link.setAttribute('aria-label', label);
  });
}

let toastTimer: number | undefined;
function showToast(name: string) {
  let toast = document.querySelector<HTMLElement>('[data-cart-toast]');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.setAttribute('data-cart-toast', '');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.replaceChildren();
  const text = document.createElement('span');
  text.textContent = isZh() ? `已加入购物车：${name}` : `Added to cart: ${name}`;
  const link = document.createElement('a');
  link.href = cartHref();
  link.textContent = isZh() ? '查看购物车 →' : 'View cart →';
  toast.append(text, link);
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast?.classList.remove('is-visible'), 3200);
}

function bindAddButtons() {
  document.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-add-to-cart]');
    if (!button) return;
    event.preventDefault();
    const scope = button.closest('[data-cart-scope]');
    const qtyInput = scope?.querySelector<HTMLInputElement>('[data-cart-qty]');
    const qty = qtyInput ? clampQty(qtyInput.value) : 1;
    const { id = '', name = '', nameZh = '', category = '' } = button.dataset;
    if (!id) return;
    addToCart({ id, name, nameZh, category }, qty);
    button.classList.add('is-added');
    const label = button.querySelector('[data-add-label]');
    const original = label?.textContent;
    if (label) label.textContent = isZh() ? '已加入 ✓' : 'Added ✓';
    window.setTimeout(() => {
      button.classList.remove('is-added');
      if (label && original) label.textContent = original;
    }, 1600);
    showToast(isZh() && nameZh ? nameZh : name);
  });

  // Quantity steppers outside the cart page (product detail).
  document.addEventListener('click', (event) => {
    const step = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-qty-step]');
    if (!step || step.closest('[data-cart-page]')) return;
    const input = step.closest('[data-cart-scope]')?.querySelector<HTMLInputElement>('[data-cart-qty]');
    if (input) input.value = String(clampQty(Number(input.value) + Number(step.dataset.qtyStep)));
  });
}

updateBadges();
onCartChange(updateBadges);
window.addEventListener('storage', (event) => {
  if (event.key === KEY) updateBadges();
});
window.addEventListener('pageshow', () => updateBadges());
bindAddButtons();
