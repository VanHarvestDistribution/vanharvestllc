/* Van Harvest product admin. Talks to /api/admin/* (Vercel functions), which commit to GitHub. */
(() => {
  const CATEGORIES = [
    ['meat', '肉类禽类'], ['produce', '蔬菜水果'], ['seafood', '海鲜'], ['pantry', '酱料调味'],
    ['preserved', '罐头腌制'], ['supplies', '餐饮用品'], ['dry', '米面干货'], ['cleaning', '清洁用品'],
    ['prepared', '冷冻点心与零食'],
  ];
  const CAT_NAME = Object.fromEntries(CATEGORIES);
  const FIELDS = ['name', 'nameZh', 'category', 'packSize', 'storage'];
  const STORAGE_NAME = { frozen: '冷冻', refrigerated: '冷藏', '': '' };
  const MAX_REQUEST_BYTES = 3_000_000; // stays under Vercel's 4.5 MB body limit
  const LIST_LIMIT = 200;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let state = null;           // { products: Map(id -> {id, base, override}), featured, studio, warehouse }
  const previews = {};        // id -> data URL of an image uploaded this session (until the site redeploys)
  let selectedId = null;
  let pendingImage = null;    // { base64, dataUrl, file } for the open editor
  let removeImage = false;

  // ---------- API ----------
  async function api(name, { method = 'GET', body } = {}) {
    const res = await fetch(`/api/admin/${name}/`, {
      method,
      credentials: 'same-origin',
      headers: { 'X-Admin-Request': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch { /* empty or non-JSON body */ }
    if (res.status === 401 && name !== 'login') { showLogin(); throw new Error(data.error || '请先登录'); }
    if (!res.ok) throw new Error(data.error || (res.status === 413 ? '图片太大，请少选几张再试' : `请求失败 (${res.status})`));
    return data;
  }

  function status(message, kind = 'info') {
    const bar = $('#status');
    bar.textContent = message;
    bar.className = `status-bar is-${kind}`;
    bar.hidden = !message;
  }

  // ---------- Data helpers ----------
  const effective = (p) => {
    const o = p.override || {};
    const out = { id: p.id };
    for (const f of FIELDS) out[f] = typeof o[f] === 'string' ? o[f] : p.base[f];
    out.hidden = Boolean(o.hidden);
    return out;
  };
  const imageOf = (id) => previews[id] || state.studio[id] || state.warehouse[id] || null;
  const imageKind = (id) => (previews[id] || state.studio[id] ? 'studio' : state.warehouse[id] ? 'warehouse' : 'none');
  const featuredCategoryOf = (id) => Object.keys(state.featured).find((k) => (state.featured[k] || []).includes(id)) || null;

  function diffFromBase(p, values) {
    const diff = {};
    for (const f of FIELDS) if (values[f] !== (p.base[f] || '')) diff[f] = values[f];
    if (values.hidden) diff.hidden = true;
    return Object.keys(diff).length ? diff : null;
  }

  async function loadState() {
    status('正在读取产品数据…');
    const data = await api('state');
    const products = new Map();
    for (const [id, name, nameZh, category, packSize, storage] of data.products) {
      products.set(id, { id, base: { name, nameZh, category, packSize, storage }, override: data.overrides[id] || null });
    }
    const featured = {};
    for (const [key] of CATEGORIES) featured[key] = (data.featured[key] || []).map(String);
    state = { products, featured, studio: data.studio, warehouse: data.warehouse };
    status('');
  }

  // ---------- Image framing (browser) ----------
  async function frameImage(file, fill) {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
    if (!bitmap) throw new Error(`${file.name}：无法读取这张图片`);
    const W = 1280, H = 960;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
    const scale = fill
      ? Math.max(W / bitmap.width, H / bitmap.height)
      : Math.min((W * 0.92) / bitmap.width, (H * 0.92) / bitmap.height);
    const w = bitmap.width * scale, h = bitmap.height * scale;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, (W - w) / 2, (H - h) / 2, w, h);
    bitmap.close?.();
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return { dataUrl, base64: dataUrl.split(',')[1] };
  }

  // ---------- Login ----------
  function showLogin() {
    $('#app').hidden = true;
    $('#login').hidden = false;
    $('#login-form input[name=password]').focus();
  }

  $('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = $('#login-form button');
    button.disabled = true;
    $('#login-error').textContent = '';
    try {
      await api('login', { method: 'POST', body: { password: event.target.password.value } });
      event.target.reset();
      await start();
    } catch (error) {
      $('#login-error').textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  $('#logout').addEventListener('click', async () => {
    await api('login', { method: 'DELETE' }).catch(() => {});
    showLogin();
  });

  // ---------- Tabs ----------
  $$('.tab').forEach((tab) => tab.addEventListener('click', () => {
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t === tab));
    $$('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
    if (tab.dataset.tab === 'featured') renderFeatured();
  }));

  // ---------- Product list ----------
  function renderList() {
    const q = $('#search').value.trim().toLowerCase();
    const cat = $('#filter-category').value;
    const img = $('#filter-image').value;
    const rows = [];
    let total = 0;
    for (const p of state.products.values()) {
      const e = effective(p);
      if (cat && e.category !== cat) continue;
      if (img === 'edited' && !p.override) continue;
      if (img === 'hidden' && !e.hidden) continue;
      if (['none', 'studio', 'warehouse'].includes(img) && imageKind(p.id) !== img) continue;
      if (q && !(`${p.id} ${e.name} ${e.nameZh}`.toLowerCase().includes(q))) continue;
      total++;
      if (rows.length < LIST_LIMIT) rows.push(e);
    }
    $('#result-count').textContent = total > LIST_LIMIT ? `共 ${total} 个，显示前 ${LIST_LIMIT} 个` : `共 ${total} 个`;
    $('#product-list').innerHTML = rows.map((e) => {
      const src = imageOf(e.id);
      const badges = [
        e.hidden ? '<span class="badge badge-warn">已隐藏</span>' : '',
        state.products.get(e.id).override ? '<span class="badge">已修改</span>' : '',
        featuredCategoryOf(e.id) ? '<span class="badge badge-gold">精选</span>' : '',
      ].join('');
      return `<button type="button" class="row${e.id === selectedId ? ' is-selected' : ''}" data-id="${e.id}">
        <span class="thumb">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : '<span class="no-img">无图</span>'}</span>
        <span class="row-text">
          <span class="row-top"><span class="mono">${e.id}</span><span class="muted">${esc(CAT_NAME[e.category] || e.category)}${STORAGE_NAME[e.storage] ? ` · ${STORAGE_NAME[e.storage]}` : ''}</span>${badges}</span>
          <span class="row-name">${esc(e.name)}</span>
          <span class="row-zh">${esc(e.nameZh)}</span>
        </span>
      </button>`;
    }).join('') || '<p class="empty">没有符合条件的产品</p>';
  }

  $('#product-list').addEventListener('click', (event) => {
    const row = event.target.closest('.row');
    if (row) openEditor(row.dataset.id);
  });
  let searchTimer;
  $('#search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderList, 120); });
  $('#filter-category').addEventListener('change', renderList);
  $('#filter-image').addEventListener('change', renderList);

  // ---------- Editor ----------
  function renderEditorImage() {
    const id = selectedId;
    const frame = $('#ed-image');
    const src = removeImage ? state.warehouse[id] : (pendingImage?.dataUrl || imageOf(id));
    frame.innerHTML = src ? `<img src="${esc(src)}" alt="">` : '<span class="no-img">暂无图片</span>';
    const note = $('#ed-image-note');
    const hasStudio = Boolean(previews[id] || state.studio[id]);
    $('#ed-remove-image').hidden = !(hasStudio && !pendingImage && !removeImage);
    if (pendingImage) note.textContent = '新图片会在保存后发布。';
    else if (removeImage) note.textContent = state.warehouse[id] ? '保存后删除白底图，改回显示仓库实拍图。' : '保存后删除图片，这个产品不再有详情页。';
    else if (hasStudio) note.textContent = '当前是白底产品图。';
    else if (state.warehouse[id]) note.textContent = '当前是仓库实拍图（带黄色标签），可以上传白底图替换。';
    else note.textContent = '没有图片的产品不会有详情页，也不能放进精选。';
  }

  function openEditor(id) {
    selectedId = id;
    pendingImage = null;
    removeImage = false;
    $('#ed-file').value = '';
    const p = state.products.get(id);
    const e = effective(p);
    const form = $('#editor');
    form.hidden = false;
    $('#editor-empty').hidden = true;
    $('#ed-id').textContent = id;
    $('#ed-title').textContent = e.nameZh || e.name;
    for (const f of FIELDS) form.elements[f].value = e[f] || '';
    form.elements.hidden.checked = e.hidden;
    form.elements.featured.checked = Boolean(featuredCategoryOf(id));
    $('#ed-view').href = `/products/${e.category}/${id}/`;
    $('#ed-view').hidden = !imageOf(id) || e.hidden;
    $('#ed-original').textContent = p.override
      ? `仓库系统原始数据：${p.base.name}${p.base.nameZh ? ` / ${p.base.nameZh}` : ''}（${CAT_NAME[p.base.category] || p.base.category}）`
      : '';
    $('#ed-error').textContent = '';
    renderEditorImage();
    $$('.row').forEach((row) => row.classList.toggle('is-selected', row.dataset.id === id));
  }

  $('#ed-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      pendingImage = await frameImage(file, $('#ed-fill').checked);
      pendingImage.file = file;
      removeImage = false;
      renderEditorImage();
    } catch (error) {
      $('#ed-error').textContent = error.message;
    }
  });
  $('#ed-fill').addEventListener('change', async () => {
    if (!pendingImage?.file) return;
    const file = pendingImage.file;
    pendingImage = await frameImage(file, $('#ed-fill').checked);
    pendingImage.file = file;
    renderEditorImage();
  });
  $('#ed-remove-image').addEventListener('click', () => { removeImage = true; renderEditorImage(); });
  $('#ed-reset').addEventListener('click', () => openEditor(selectedId));

  $('#editor').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = selectedId;
    const form = event.target;
    const p = state.products.get(id);
    const values = {};
    for (const f of FIELDS) values[f] = form.elements[f].value.trim();
    values.hidden = form.elements.hidden.checked;
    const wantFeatured = form.elements.featured.checked;

    const willHaveImage = Boolean(pendingImage || (!removeImage && imageOf(id)) || (removeImage && state.warehouse[id]));
    if (wantFeatured && !willHaveImage) { $('#ed-error').textContent = '没有图片的产品不能放进精选'; return; }

    const body = {};
    const before = effective(p);
    if (FIELDS.some((f) => values[f] !== before[f]) || values.hidden !== before.hidden) body.products = { [id]: values };
    if (pendingImage) body.images = { [id]: pendingImage.base64 };
    else if (removeImage) body.images = { [id]: null };

    // Keep the featured lists in step with this product.
    const featured = structuredClone(state.featured);
    for (const key of Object.keys(featured)) featured[key] = featured[key].filter((x) => x !== id);
    if (wantFeatured && !values.hidden) {
      const current = featuredCategoryOf(id);
      const list = featured[values.category];
      const oldIndex = current === values.category ? state.featured[current].indexOf(id) : -1;
      if (oldIndex >= 0) list.splice(oldIndex, 0, id); else list.push(id);
    }
    if (JSON.stringify(featured) !== JSON.stringify(state.featured)) body.featured = featured;

    if (!Object.keys(body).length) { status('没有需要保存的修改。'); return; }

    const button = $('#ed-save');
    button.disabled = true;
    $('#ed-error').textContent = '';
    status('正在保存…');
    try {
      const result = await api('save', { method: 'POST', body });
      if (body.products) p.override = diffFromBase(p, values);
      if (body.images) {
        if (pendingImage) { previews[id] = pendingImage.dataUrl; if (result.studio?.[id]) state.studio[id] = result.studio[id]; }
        else { delete previews[id]; delete state.studio[id]; }
      }
      if (body.featured) state.featured = featured;
      status('已保存。网站大约 1–2 分钟后更新。', 'ok');
      renderList();
      openEditor(id);
    } catch (error) {
      $('#ed-error').textContent = error.message;
      status('');
    } finally {
      button.disabled = false;
    }
  });

  // ---------- Bulk upload ----------
  let bulkItems = []; // { id, file, framed, error }

  async function addBulkFiles(files) {
    const fill = $('#bulk-fill').checked;
    for (const file of files) {
      const id = (file.name.match(/^\s*(\d{4,6})/) || [])[1];
      const item = { id, file, framed: null, error: null };
      if (!id) item.error = '文件名要以 Item # 开头';
      else if (!state.products.has(id)) item.error = `找不到产品 ${id}`;
      bulkItems = bulkItems.filter((x) => !(x.id && x.id === id)); // the latest file for an item wins
      bulkItems.push(item);
      if (!item.error) {
        try { item.framed = await frameImage(file, fill); } catch (error) { item.error = error.message; }
      }
      renderBulk();
    }
  }

  function renderBulk() {
    $('#bulk-grid').innerHTML = bulkItems.map((item, index) => {
      const p = item.id && state.products.get(item.id);
      const e = p ? effective(p) : null;
      return `<div class="bulk-card${item.error ? ' has-error' : ''}">
        <div class="bulk-img">${item.framed ? `<img src="${item.framed.dataUrl}" alt="">` : `<span class="no-img">${item.error ? '✕' : '处理中…'}</span>`}</div>
        <div class="bulk-meta">
          <div class="mono">${esc(item.id || '—')}</div>
          <div class="bulk-name">${esc(e ? (e.nameZh || e.name) : item.file.name)}</div>
          ${item.error ? `<div class="form-error">${esc(item.error)}</div>` : (state.studio[item.id] || state.warehouse[item.id] ? '<div class="muted">会替换现有图片</div>' : '<div class="muted">新图片</div>')}
        </div>
        <button type="button" class="bulk-remove" data-index="${index}" aria-label="移除">×</button>
      </div>`;
    }).join('');
    const ready = bulkItems.filter((x) => x.framed && !x.error);
    $('#bulk-actions').hidden = bulkItems.length === 0;
    $('#bulk-summary').textContent = `${ready.length} 张可以上传${bulkItems.length - ready.length ? `，${bulkItems.length - ready.length} 张有问题会跳过` : ''}`;
    $('#bulk-upload').disabled = ready.length === 0;
  }

  const dropzone = $('#dropzone');
  $('#bulk-files').addEventListener('change', (event) => { addBulkFiles([...event.target.files]); event.target.value = ''; });
  dropzone.addEventListener('dragover', (event) => { event.preventDefault(); dropzone.classList.add('is-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-over'));
  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-over');
    addBulkFiles([...event.dataTransfer.files].filter((f) => f.type.startsWith('image/')));
  });
  $('#bulk-grid').addEventListener('click', (event) => {
    const button = event.target.closest('.bulk-remove');
    if (!button) return;
    bulkItems.splice(Number(button.dataset.index), 1);
    renderBulk();
  });
  $('#bulk-clear').addEventListener('click', () => { bulkItems = []; renderBulk(); });

  $('#bulk-upload').addEventListener('click', async () => {
    const ready = bulkItems.filter((x) => x.framed && !x.error);
    // Group into requests under the body-size limit; each request is one commit.
    const batches = [];
    let current = {}, size = 0;
    for (const item of ready) {
      const bytes = item.framed.base64.length;
      if (size + bytes > MAX_REQUEST_BYTES && Object.keys(current).length) { batches.push(current); current = {}; size = 0; }
      current[item.id] = item.framed.base64;
      size += bytes;
    }
    if (Object.keys(current).length) batches.push(current);

    const button = $('#bulk-upload');
    button.disabled = true;
    let done = 0;
    try {
      for (const images of batches) {
        status(`正在上传… ${done}/${ready.length}`);
        const result = await api('save', { method: 'POST', body: { images } });
        for (const id of Object.keys(images)) {
          previews[id] = ready.find((x) => x.id === id).framed.dataUrl;
          if (result.studio?.[id]) state.studio[id] = result.studio[id];
        }
        done += Object.keys(images).length;
        bulkItems = bulkItems.filter((x) => !(x.id in images));
        renderBulk();
      }
      status(`已上传 ${done} 张图片。网站大约 1–2 分钟后更新。`, 'ok');
      renderList();
    } catch (error) {
      status(`上传了 ${done} 张后出错：${error.message}`, 'error');
    } finally {
      button.disabled = false;
    }
  });

  // ---------- Featured ----------
  let featDraft = null;

  function renderFeatured() {
    if (!featDraft) featDraft = structuredClone(state.featured);
    const cat = $('#feat-category').value;
    const ids = featDraft[cat] || [];
    $('#feat-list').innerHTML = ids.map((id, index) => {
      const p = state.products.get(id);
      const e = p ? effective(p) : null;
      const src = imageOf(id);
      const problem = !e ? '产品不存在' : e.hidden ? '已隐藏，不会显示' : e.category !== cat ? `已移到「${CAT_NAME[e.category]}」，不会显示` : !src ? '没有图片，不会显示' : '';
      return `<li class="feat-item${problem ? ' has-error' : ''}">
        <span class="thumb">${src ? `<img src="${esc(src)}" alt="">` : '<span class="no-img">无图</span>'}</span>
        <span class="row-text"><span class="mono">${id}</span> <span class="row-name">${esc(e ? (e.nameZh || e.name) : '')}</span>${problem ? `<span class="form-error">${problem}</span>` : ''}</span>
        <span class="feat-buttons">
          <button type="button" data-move="-1" data-index="${index}" ${index === 0 ? 'disabled' : ''} aria-label="上移">↑</button>
          <button type="button" data-move="1" data-index="${index}" ${index === ids.length - 1 ? 'disabled' : ''} aria-label="下移">↓</button>
          <button type="button" data-remove="${index}" aria-label="移除">×</button>
        </span>
      </li>`;
    }).join('') || '<p class="empty">这个品类还没有精选产品</p>';
    $('#feat-save').disabled = JSON.stringify(featDraft) === JSON.stringify(state.featured);
  }

  $('#feat-category').addEventListener('change', renderFeatured);
  $('#feat-list').addEventListener('click', (event) => {
    const cat = $('#feat-category').value;
    const list = featDraft[cat];
    const move = event.target.closest('[data-move]');
    const remove = event.target.closest('[data-remove]');
    if (move) {
      const i = Number(move.dataset.index), j = i + Number(move.dataset.move);
      [list[i], list[j]] = [list[j], list[i]];
    } else if (remove) {
      list.splice(Number(remove.dataset.remove), 1);
    } else return;
    renderFeatured();
  });
  function addFeatured() {
    const id = $('#feat-add').value.trim();
    const cat = $('#feat-category').value;
    $('#feat-error').textContent = '';
    const p = state.products.get(id);
    if (!p) { $('#feat-error').textContent = `找不到产品 ${id}`; return; }
    const e = effective(p);
    if (e.category !== cat) { $('#feat-error').textContent = `${id} 属于「${CAT_NAME[e.category]}」，请切换到那个品类添加`; return; }
    if (!imageOf(id)) { $('#feat-error').textContent = `${id} 没有图片，请先上传图片`; return; }
    if (featDraft[cat].includes(id)) { $('#feat-error').textContent = '已经在列表里了'; return; }
    featDraft[cat].push(id);
    $('#feat-add').value = '';
    renderFeatured();
  }
  $('#feat-add-btn').addEventListener('click', addFeatured);
  $('#feat-add').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); addFeatured(); } });
  $('#feat-save').addEventListener('click', async () => {
    const button = $('#feat-save');
    button.disabled = true;
    $('#feat-error').textContent = '';
    status('正在保存…');
    try {
      await api('save', { method: 'POST', body: { featured: featDraft } });
      state.featured = structuredClone(featDraft);
      status('精选产品已保存。网站大约 1–2 分钟后更新。', 'ok');
      renderFeatured();
      renderList();
    } catch (error) {
      $('#feat-error').textContent = error.message;
      status('');
      button.disabled = false;
    }
  });

  // ---------- Start ----------
  function fillCategorySelects() {
    const options = CATEGORIES.map(([key, name]) => `<option value="${key}">${name}</option>`).join('');
    $('#filter-category').insertAdjacentHTML('beforeend', options);
    $('#ed-category').innerHTML = options;
    $('#feat-category').innerHTML = options;
  }

  window.addEventListener('beforeunload', (event) => {
    if (bulkItems.some((x) => x.framed) || pendingImage) { event.preventDefault(); event.returnValue = ''; }
  });

  async function start() {
    $('#login').hidden = true;
    $('#app').hidden = false;
    try {
      await loadState();
      featDraft = null;
      renderList();
    } catch (error) {
      status(error.message, 'error');
    }
  }

  fillCategorySelects();
  api('login').then((r) => (r.signedIn ? start() : showLogin())).catch(() => showLogin());
})();
