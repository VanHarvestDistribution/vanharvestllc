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
    // List-row buttons turn into a quantity box right away; only the product-page button flashes "Added".
    if (button.classList.contains('add-cart-btn')) {
      showToast(isZh() && nameZh ? nameZh : name);
      return;
    }
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

// ---------- Inline quantity on list rows ----------
// Once a product is in the cart, its "Add" button in the list turns into − [qty] +, so a customer can
// type 15 instead of tapping Add 15 times. Setting it to 0 removes the product.
const qtyFor = (id: string, items = readCart()) => items.find((item) => item.id === id)?.qty || 0;

function ensureRowStepper(button: HTMLButtonElement) {
  const cell = button.parentElement;
  if (!cell) return null;
  let stepper = cell.querySelector<HTMLElement>('.row-qty');
  if (!stepper) {
    const zh = isZh();
    const name = (zh && button.dataset.nameZh) || button.dataset.name || '';
    stepper = document.createElement('div');
    stepper.className = 'row-qty';
    stepper.dataset.id = button.dataset.id || '';
    stepper.hidden = true;
    stepper.innerHTML = '<button type="button" data-row-step="-1">−</button><input type="number" inputmode="numeric" min="0" max="999" data-row-qty /><button type="button" data-row-step="1">+</button>';
    const [minus, input, plus] = Array.from(stepper.children) as HTMLElement[];
    minus.setAttribute('aria-label', zh ? `减少 ${name} 的数量` : `Decrease quantity of ${name}`);
    plus.setAttribute('aria-label', zh ? `增加 ${name} 的数量` : `Increase quantity of ${name}`);
    input.setAttribute('aria-label', zh ? `${name} 的数量` : `Quantity of ${name}`);
    cell.appendChild(stepper);
  }
  return stepper;
}

function syncRows(items = readCart()) {
  document.querySelectorAll<HTMLButtonElement>('.add-cart-btn[data-add-to-cart]').forEach((button) => {
    const id = button.dataset.id || '';
    const qty = qtyFor(id, items);
    const stepper = qty || button.parentElement?.querySelector('.row-qty') ? ensureRowStepper(button) : null;
    button.hidden = qty > 0;
    if (!stepper) return;
    stepper.hidden = qty === 0;
    const input = stepper.querySelector<HTMLInputElement>('[data-row-qty]');
    if (input && document.activeElement !== input) input.value = String(qty);
  });
}

function setRowQty(id: string, qty: number) {
  if (!Number.isFinite(qty) || qty <= 0) removeItem(id);
  else setQty(id, qty);
}

document.addEventListener('click', (event) => {
  const step = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-row-step]');
  if (!step) return;
  const stepper = step.closest<HTMLElement>('.row-qty');
  const id = stepper?.dataset.id;
  if (!id) return;
  setRowQty(id, qtyFor(id) + Number(step.dataset.rowStep));
});
document.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (!input.matches?.('[data-row-qty]')) return;
  const id = input.closest<HTMLElement>('.row-qty')?.dataset.id;
  if (id) setRowQty(id, input.value.trim() === '' ? 0 : Math.floor(Number(input.value)));
});
document.addEventListener('keydown', (event) => {
  const input = event.target as HTMLInputElement;
  if (event.key === 'Enter' && input.matches?.('[data-row-qty]')) input.blur();
});
// After "Add" in a list, put the cursor in the new quantity box so the customer can type a number.
document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('.add-cart-btn[data-add-to-cart]');
  if (!button) return;
  window.setTimeout(() => {
    const input = button.parentElement?.querySelector<HTMLInputElement>('.row-qty [data-row-qty]');
    if (input && !matchMedia('(pointer: coarse)').matches) input.select();
  }, 0);
});

syncRows();
onCartChange(syncRows);
window.addEventListener('pageshow', () => syncRows());
window.addEventListener('storage', (event) => { if (event.key === KEY) syncRows(); });
// The full catalog renders its rows after loading data, and re-renders on search / page change.
let pending = 0;
new MutationObserver(() => {
  if (pending) return;
  pending = requestAnimationFrame(() => { pending = 0; syncRows(); });
}).observe(document.body, { childList: true, subtree: true });
