/* Van Harvest product admin.
   Edits collect into a draft (kept in this browser), images upload in the background as soon as
   they are picked, and "发布到网站" sends everything as one commit via /api/admin/save. */
(() => {
  const CATEGORIES = [
    ['meat', '肉类禽类'], ['produce', '蔬菜水果'], ['seafood', '海鲜'], ['pantry', '酱料调味'],
    ['preserved', '罐头腌制'], ['supplies', '餐饮用品'], ['dry', '米面干货'], ['cleaning', '清洁用品'],
    ['prepared', '冷冻点心与零食'],
  ];
  const CAT_NAME = Object.fromEntries(CATEGORIES);
  const FIELDS = ['name', 'nameZh', 'category', 'packSize', 'storage'];
  const STORAGE_NAME = { frozen: '冷冻', refrigerated: '冷藏' };
  const LIST_LIMIT = 200;
  const DRAFT_KEY = 'vh-admin-draft-v1';
  const ID_RE = /^\d{3,6}$/;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tag = (id) => `<span class="tag"><span class="tag-no">${esc(id)}</span></span>`;
  const clone = (v) => JSON.parse(JSON.stringify(v));

  // Saved state from GitHub
  let base = new Map();     // id -> warehouse fields
  let overrides = {};       // data/product-overrides.json
  let featuredSaved = {};
  let studio = {};
  let warehouse = {};
  // Draft (unpublished) changes
  let draft = emptyDraft();
  const recent = {};        // id -> preview of an image published this session (until the site redeploys)

  let selectedId = null;    // product open in the editor ('' = new product)
  let publishing = false;
  let editorImage = null;   // image picked in the editor, not yet added to the draft
  let editorRemoveImage = false;

  function emptyDraft() { return { products: {}, images: {}, featured: null }; }

  // ---------- API ----------
  async function api(name, { method = 'GET', body } = {}) {
    const res = await fetch(`/api/admin/${name}/`, {
      method,
      credentials: 'same-origin',
      headers: { 'X-Admin-Request': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch { /* not JSON */ }
    if (res.status === 401 && name !== 'login') { showLogin(); throw new Error('登录已过期，请重新登录'); }
    if (!res.ok) throw new Error(data.error || (res.status === 413 ? '图片太大' : `请求失败（${res.status}）`));
    return data;
  }

  let toastTimer;
  function toast(message, kind = '') {
    const el = $('#toast');
    el.textContent = message;
    el.className = `toast${kind ? ` is-${kind}` : ''}`;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, kind === 'error' ? 8000 : 4000);
  }

  // ---------- Draft storage ----------
  function persist() {
    // Full-size image data stays in memory only; the stored draft keeps thumbnails and uploaded blob ids.
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft, (key, value) => (key === 'full' ? undefined : value))); } catch { /* storage full or blocked; draft stays in memory */ }
    renderDock();
  }
  function restoreDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!saved) return;
      draft = { ...emptyDraft(), ...saved };
      for (const [id, image] of Object.entries(draft.images)) {
        if (image && !image.blob) draft.images[id] = { ...image, status: 'error', error: '上传没有完成，请重新选择图片' };
      }
    } catch { draft = emptyDraft(); }
  }

  // ---------- Product model ----------
  const isAdded = (id) => Boolean(overrides[id]?.added) && !base.has(id);
  function savedProduct(id) {
    const o = overrides[id] || {};
    if (!base.has(id)) {
      if (!o.added) return null;
      return { id, name: o.name || '', nameZh: o.nameZh || '', category: o.category, packSize: o.packSize || '', storage: o.storage || '', deleted: Boolean(o.hidden) };
    }
    const b = base.get(id);
    const out = { id };
    for (const f of FIELDS) out[f] = typeof o[f] === 'string' ? o[f] : b[f];
    out.deleted = Boolean(o.hidden);
    return out;
  }
  function current(id) {
    if (id in draft.products) {
      const d = draft.products[id];
      if (d === null) return { ...(savedProduct(id) || { id }), deleted: true };
      return { id, ...d, deleted: false };
    }
    return savedProduct(id);
  }
  function allIds() {
    const ids = new Set(base.keys());
    for (const id of Object.keys(overrides)) if (overrides[id].added) ids.add(id);
    for (const id of Object.keys(draft.products)) ids.add(id);
    return [...ids].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  }
  const featured = () => draft.featured || featuredSaved;
  const featuredCategoryOf = (id) => Object.keys(featured()).find((k) => (featured()[k] || []).includes(id)) || null;
  function imageOf(id) {
    if (id in draft.images) return draft.images[id] ? draft.images[id].thumb : (warehouse[id] || null);
    return recent[id] || studio[id] || warehouse[id] || null;
  }
  function imageKind(id) {
    if (id in draft.images) return draft.images[id] ? 'studio' : (warehouse[id] ? 'warehouse' : 'none');
    return recent[id] || studio[id] ? 'studio' : warehouse[id] ? 'warehouse' : 'none';
  }
  const isPending = (id) => id in draft.products || id in draft.images;

  async function loadState() {
    $('#sync').textContent = '正在读取…';
    const data = await api('state');
    base = new Map(data.products.map(([id, name, nameZh, category, packSize, storage]) => [id, { name, nameZh, category, packSize, storage }]));
    overrides = data.overrides || {};
    featuredSaved = {};
    for (const [key] of CATEGORIES) featuredSaved[key] = (data.featured[key] || []).map(String);
    studio = data.studio || {};
    warehouse = data.warehouse || {};
    $('#sync').textContent = '';
  }

  // ---------- Images ----------
  async function frame(file, fill, width, height, quality) {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
    if (!bitmap) throw new Error(`${file.name} 无法读取`);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    const scale = fill
      ? Math.max(width / bitmap.width, height / bitmap.height)
      : Math.min((width * 0.92) / bitmap.width, (height * 0.92) / bitmap.height);
    const w = bitmap.width * scale, h = bitmap.height * scale;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h);
    bitmap.close?.();
    return canvas.toDataURL('image/jpeg', quality);
  }
  async function prepareImage(file, fill) {
    const [full, thumb] = await Promise.all([frame(file, fill, 1280, 960, 0.9), frame(file, fill, 400, 300, 0.75)]);
    return { full: full.split(',')[1], thumb };
  }

  // Background uploads, three at a time.
  const queue = [];
  let active = 0;
  function enqueueUpload(id, full) {
    queue.push({ id, full });
    pump();
  }
  function pump() {
    while (active < 3 && queue.length) {
      const { id, full } = queue.shift();
      const image = draft.images[id];
      if (!image || image.full !== full) continue;
      active++;
      api('upload', { method: 'POST', body: { data: full } })
        .then((result) => {
          if (draft.images[id]?.full !== full) return;
          draft.images[id] = { thumb: draft.images[id].thumb, blob: result.blob, status: 'ready' };
        })
        .catch((error) => {
          if (draft.images[id]?.full !== full) return;
          draft.images[id] = { thumb: draft.images[id].thumb, status: 'error', error: error.message };
        })
        .finally(() => { active--; persist(); refreshRows([id]); pump(); });
    }
  }
  function setDraftImage(id, prepared) {
    // `full` stays in memory only (too big for browser storage); it is dropped once uploaded.
    draft.images[id] = { thumb: prepared.thumb, status: 'uploading', full: prepared.full };
    enqueueUpload(id, prepared.full);
  }

  // ---------- Login ----------
  function showLogin() {
    $('#app').hidden = true;
    $('#login').hidden = false;
    setTimeout(() => $('#login-form input[name=password]').focus(), 0);
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
  $$('.nav-item').forEach((item) => item.addEventListener('click', () => {
    $$('.nav-item').forEach((t) => t.classList.toggle('is-active', t === item));
    $$('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== item.dataset.tab; });
    if (item.dataset.tab === 'featured') renderFeatured();
  }));

  // ---------- List ----------
  function rowHtml(id) {
    const p = current(id);
    const src = imageOf(id);
    const image = draft.images[id];
    let flag = '';
    if (image?.status === 'uploading') flag = '<span class="flag">图片上传中</span>';
    else if (image?.status === 'error') flag = '<span class="flag-danger">图片上传失败</span>';
    else if (isPending(id)) flag = '<span class="flag">待发布</span>';
    else if (p.deleted) flag = '<span class="flag-danger">已删除</span>';
    else if (isAdded(id)) flag = '新增';
    else if (overrides[id]) flag = '已修改';
    if (!flag && featuredCategoryOf(id)) flag = '精选';
    const classes = ['row', id === selectedId ? 'is-selected' : '', isPending(id) ? 'is-pending' : '', p.deleted ? 'is-deleted' : ''].join(' ');
    return `<button type="button" class="${classes}" data-id="${id}">
      ${tag(id)}
      <span class="thumb">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : '<span class="no-img">无图</span>'}</span>
      <span class="row-text"><span class="row-name">${esc(p.name)}</span><span class="row-zh">${esc(p.nameZh)}</span></span>
      <span class="row-meta"><b>${esc(CAT_NAME[p.category] || '')}${STORAGE_NAME[p.storage] ? `，${STORAGE_NAME[p.storage]}` : ''}</b>${flag}</span>
    </button>`;
  }

  function renderList() {
    const q = $('#search').value.trim().toLowerCase();
    const cat = $('#filter-category').value;
    const filter = $('#filter-state').value;
    const ids = [];
    let total = 0;
    for (const id of allIds()) {
      const p = current(id);
      if (!p) continue;
      if (filter === 'deleted' ? !p.deleted : p.deleted && !isPending(id)) continue;
      if (cat && p.category !== cat) continue;
      if (filter === 'pending' && !isPending(id)) continue;
      if (filter === 'edited' && !overrides[id]) continue;
      if (filter === 'added' && !isAdded(id) && !(draft.products[id]?.create)) continue;
      if (['none', 'studio', 'warehouse'].includes(filter) && imageKind(id) !== filter) continue;
      if (q && !`${id} ${p.name} ${p.nameZh}`.toLowerCase().includes(q)) continue;
      total++;
      if (ids.length < LIST_LIMIT) ids.push(id);
    }
    $('#result-count').textContent = total > LIST_LIMIT ? `${total} 个，显示前 ${LIST_LIMIT} 个` : `${total} 个`;
    $('#product-list').innerHTML = ids.map(rowHtml).join('') || '<p class="empty">没有符合条件的产品</p>';
  }
  function refreshRows(ids) {
    for (const id of ids) {
      const row = $(`.row[data-id="${id}"]`);
      if (row) row.outerHTML = rowHtml(id);
    }
    if (ids.includes(selectedId)) renderEditorImage();
  }

  $('#product-list').addEventListener('click', (event) => {
    const row = event.target.closest('.row');
    if (row) openEditor(row.dataset.id);
  });
  let searchTimer;
  $('#search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderList, 120); });
  $('#filter-category').addEventListener('change', renderList);
  $('#filter-state').addEventListener('change', renderList);

  // ---------- Editor ----------
  const form = $('#editor');

  function renderEditorImage() {
    const id = selectedId;
    const box = $('#ed-image');
    let src = null;
    if (editorImage) src = editorImage.thumb;
    else if (editorRemoveImage) src = id && warehouse[id];
    else if (id) src = imageOf(id);
    box.innerHTML = src ? `<img src="${esc(src)}" alt="">` : '<span class="no-img">暂无图片</span>';
    const hasStudio = id && imageKind(id) === 'studio';
    $('#ed-remove-image').hidden = !(hasStudio && !editorImage && !editorRemoveImage);
    const note = $('#ed-image-note');
    const image = id && draft.images[id];
    if (editorImage) note.textContent = '点"加入待发布"后开始上传。';
    else if (editorRemoveImage) note.textContent = id && warehouse[id] ? '白底图会被删除，改回显示仓库实拍图。' : '图片会被删除。';
    else if (image?.status === 'uploading') note.textContent = '图片上传中…';
    else if (image?.status === 'error') note.textContent = `图片上传失败：${image.error || ''} 请重新选择。`;
    else if (image) note.textContent = '新图片已上传，发布后显示在网站上。';
    else if (hasStudio) note.textContent = '白底产品图。';
    else if (id && warehouse[id]) note.textContent = '仓库实拍图，可以换成白底图。';
    else note.textContent = '没有图片的产品不会有详情页，也不能放进精选。';
  }

  function openEditor(id) {
    selectedId = id;
    editorImage = null;
    editorRemoveImage = false;
    $('#ed-file').value = '';
    $('#ed-error').textContent = '';
    resetDeleteConfirm();
    const creating = id === '';
    const p = creating ? { id: '', name: '', nameZh: '', category: $('#filter-category').value || 'meat', packSize: '', storage: '' } : current(id);
    form.hidden = false;
    $('#detail-empty').hidden = true;
    $('#ed-id-field').hidden = !creating;
    form.elements.id.value = '';
    $('#ed-id-text').textContent = creating ? '新产品' : id;
    $('#ed-title').textContent = creating ? '填写 Item # 和名称' : (p.nameZh || p.name);
    for (const f of FIELDS) form.elements[f].value = p[f] || '';
    form.elements.featured.checked = !creating && Boolean(featuredCategoryOf(id));
    form.elements.featured.disabled = Boolean(p.deleted);

    const notice = $('#ed-notice');
    notice.hidden = true;
    if (p.deleted) {
      notice.hidden = false;
      notice.textContent = '这个产品已从网站删除（或等待删除）。点"恢复产品"可以放回网站。';
    }
    $('#ed-apply').textContent = p.deleted ? '恢复产品' : '加入待发布';
    $('#ed-delete-wrap').hidden = creating || p.deleted;
    $('#ed-cancel').textContent = isPending(id) ? '撤销这个产品的修改' : '关闭';

    const saved = !creating && savedProduct(id);
    const b = base.get(id);
    $('#ed-original').textContent = b && overrides[id] && !p.deleted
      ? `仓库系统原始名称：${b.name}${b.nameZh ? ` / ${b.nameZh}` : ''}（${CAT_NAME[b.category] || b.category}）`
      : (!b && saved ? '这是在后台新增的产品，仓库系统里没有。' : '');
    renderEditorImage();
    $$('.row').forEach((row) => row.classList.toggle('is-selected', row.dataset.id === id));
    if (creating) form.elements.id.focus();
  }
  function closeEditor() {
    selectedId = null;
    form.hidden = true;
    $('#detail-empty').hidden = false;
    $$('.row.is-selected').forEach((row) => row.classList.remove('is-selected'));
  }

  $('#new-product').addEventListener('click', () => openEditor(''));
  $('#ed-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      editorImage = await prepareImage(file, $('#ed-fill').checked);
      editorImage.file = file;
      editorRemoveImage = false;
      renderEditorImage();
    } catch (error) { $('#ed-error').textContent = error.message; }
  });
  $('#ed-fill').addEventListener('change', async () => {
    if (!editorImage?.file) return;
    const file = editorImage.file;
    editorImage = await prepareImage(file, $('#ed-fill').checked);
    editorImage.file = file;
    renderEditorImage();
  });
  $('#ed-remove-image').addEventListener('click', () => { editorRemoveImage = true; renderEditorImage(); });

  $('#ed-cancel').addEventListener('click', () => {
    const id = selectedId;
    if (id && isPending(id)) {
      discard(id);
      openEditor(id);
      renderList();
    } else closeEditor();
  });

  function resetDeleteConfirm() {
    $('#ed-delete-wrap').innerHTML = '<button type="button" class="btn-text danger" id="ed-delete">删除产品</button>';
  }
  $('#ed-delete-wrap').addEventListener('click', (event) => {
    if (event.target.id === 'ed-delete') {
      $('#ed-delete-wrap').innerHTML = '确定从网站删除？<button type="button" class="btn-text danger" id="ed-delete-yes">删除</button><button type="button" class="btn-text" id="ed-delete-no">不删</button>';
    } else if (event.target.id === 'ed-delete-no') {
      resetDeleteConfirm();
    } else if (event.target.id === 'ed-delete-yes') {
      const id = selectedId;
      if (draft.products[id]?.create) {
        // Never published: just drop it from the draft.
        discard(id);
        closeEditor();
      } else {
        draft.products[id] = null;
        delete draft.images[id];
        removeFromFeatured(id);
        openEditor(id);
      }
      persist();
      renderList();
    }
  });

  function removeFromFeatured(id) {
    if (!featuredCategoryOf(id)) return;
    const next = clone(featured());
    for (const key of Object.keys(next)) next[key] = next[key].filter((x) => x !== id);
    setFeaturedDraft(next);
  }
  function setFeaturedDraft(next) {
    draft.featured = JSON.stringify(next) === JSON.stringify(featuredSaved) ? null : next;
  }

  function discard(id) {
    delete draft.products[id];
    delete draft.images[id];
    if (draft.featured) {
      // Put this product's featured placement back the way it was published.
      const next = clone(draft.featured);
      for (const key of Object.keys(next)) next[key] = next[key].filter((x) => x !== id);
      const savedKey = Object.keys(featuredSaved).find((k) => featuredSaved[k].includes(id));
      if (savedKey) next[savedKey].splice(Math.min(featuredSaved[savedKey].indexOf(id), next[savedKey].length), 0, id);
      setFeaturedDraft(next);
    }
    persist();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    $('#ed-error').textContent = '';
    const creating = selectedId === '';
    const id = creating ? form.elements.id.value.trim() : selectedId;
    const values = {};
    for (const f of FIELDS) values[f] = form.elements[f].value.trim().replace(/\s+/g, ' ');
    if (creating) {
      if (!ID_RE.test(id)) { $('#ed-error').textContent = 'Item # 应该是 3 到 6 位数字'; return; }
      if (current(id)) { $('#ed-error').textContent = `${id} 已经存在，请在列表里搜索它`; return; }
    }
    if (!values.name) { $('#ed-error').textContent = '请填写英文名称'; return; }

    const before = creating ? null : current(id);
    const wasDeleted = before?.deleted;
    const willHaveImage = Boolean(editorImage || (!editorRemoveImage && imageOf(id)) || (editorRemoveImage && warehouse[id]));
    const wantFeatured = form.elements.featured.checked && !form.elements.featured.disabled;
    if (wantFeatured && !willHaveImage) { $('#ed-error').textContent = '没有图片的产品不能放进精选'; return; }

    // Product fields
    const saved = savedProduct(id);
    const sameAsSaved = saved && !saved.deleted && FIELDS.every((f) => values[f] === (saved[f] || ''));
    if (creating) draft.products[id] = { ...values, create: true };
    else if (sameAsSaved) delete draft.products[id];
    else draft.products[id] = draft.products[id]?.create ? { ...values, create: true } : values;

    // Image
    if (editorImage) setDraftImage(id, editorImage);
    else if (editorRemoveImage) draft.images[id] = null;

    // Featured placement follows the category
    const next = clone(featured());
    const was = featuredCategoryOf(id);
    for (const key of Object.keys(next)) next[key] = next[key].filter((x) => x !== id);
    if (wantFeatured && !wasDeleted) {
      const list = next[values.category];
      const oldIndex = was === values.category ? featured()[was].indexOf(id) : -1;
      if (oldIndex >= 0) list.splice(oldIndex, 0, id); else list.push(id);
    }
    setFeaturedDraft(next);

    persist();
    renderList();
    openEditor(id);
    toast(wasDeleted ? '已加入待发布：恢复产品' : '已加入待发布。全部改完后点下面的"发布到网站"。');
  });

  // ---------- Bulk images ----------
  $('#bulk-files').addEventListener('change', async (event) => {
    const files = [...event.target.files];
    event.target.value = '';
    const fill = $('#ed-fill').checked;
    const skipped = [];
    let added = 0;
    for (const file of files) {
      const id = (file.name.match(/^\s*(\d{3,6})/) || [])[1];
      const p = id && current(id);
      if (!p || p.deleted) { skipped.push(file.name); continue; }
      try {
        setDraftImage(id, await prepareImage(file, fill));
        added++;
      } catch { skipped.push(file.name); }
    }
    persist();
    renderList();
    if (skipped.length) toast(`${added} 张已加入待发布。${skipped.length} 张没有对应的产品，已跳过：${skipped.slice(0, 5).join('、')}${skipped.length > 5 ? '…' : ''}`, 'error');
    else toast(`${added} 张图片已加入待发布，正在上传。`);
  });

  // ---------- Featured ----------
  function renderFeatured() {
    const cat = $('#feat-category').value;
    const ids = featured()[cat] || [];
    $('#feat-list').innerHTML = ids.map((id, index) => {
      const p = current(id);
      const src = imageOf(id);
      const problem = !p ? '产品不存在' : p.deleted ? '已删除，不会显示' : p.category !== cat ? `已移到${CAT_NAME[p.category]}，不会显示` : !src ? '没有图片，不会显示' : '';
      return `<li class="feat-item${problem ? ' has-problem' : ''}">
        <span class="feat-pos">${index + 1}</span>
        ${tag(id)}
        <span class="thumb">${src ? `<img src="${esc(src)}" alt="">` : '<span class="no-img">无图</span>'}</span>
        <span class="row-text"><span class="row-name">${esc(p ? (p.nameZh || p.name) : '')}</span>${problem ? `<span class="row-zh danger">${problem}</span>` : `<span class="row-zh">${esc(p?.name || '')}</span>`}</span>
        <span class="feat-buttons">
          <button type="button" data-move="-1" data-index="${index}" ${index === 0 ? 'disabled' : ''} aria-label="上移">↑</button>
          <button type="button" data-move="1" data-index="${index}" ${index === ids.length - 1 ? 'disabled' : ''} aria-label="下移">↓</button>
          <button type="button" data-remove="${index}" aria-label="移出精选">×</button>
        </span>
      </li>`;
    }).join('') || '<li class="empty">这个品类还没有精选产品。在上面输入 Item # 添加。</li>';
  }
  $('#feat-category').addEventListener('change', () => { $('#feat-error').textContent = ''; renderFeatured(); });
  $('#feat-list').addEventListener('click', (event) => {
    const cat = $('#feat-category').value;
    const next = clone(featured());
    const list = next[cat];
    const move = event.target.closest('[data-move]');
    const remove = event.target.closest('[data-remove]');
    if (move) {
      const i = Number(move.dataset.index), j = i + Number(move.dataset.move);
      [list[i], list[j]] = [list[j], list[i]];
    } else if (remove) list.splice(Number(remove.dataset.remove), 1);
    else return;
    setFeaturedDraft(next);
    persist();
    renderFeatured();
  });
  function addFeatured() {
    const id = $('#feat-add').value.trim();
    const cat = $('#feat-category').value;
    const p = current(id);
    $('#feat-error').textContent = '';
    if (!p || p.deleted) { $('#feat-error').textContent = `找不到产品 ${id}`; return; }
    if (p.category !== cat) { $('#feat-error').textContent = `${id} 属于${CAT_NAME[p.category]}，请切换到那个品类再添加`; return; }
    if (!imageOf(id)) { $('#feat-error').textContent = `${id} 还没有图片，先在产品页上传图片`; return; }
    if (featured()[cat].includes(id)) { $('#feat-error').textContent = `${id} 已经在列表里`; return; }
    const next = clone(featured());
    next[cat].push(id);
    setFeaturedDraft(next);
    persist();
    $('#feat-add').value = '';
    renderFeatured();
  }
  $('#feat-add-btn').addEventListener('click', addFeatured);
  $('#feat-add').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); addFeatured(); } });

  // ---------- Pending dock & publish ----------
  function pendingItems() {
    const items = [];
    const ids = new Set([...Object.keys(draft.products), ...Object.keys(draft.images)]);
    for (const id of [...ids].sort()) {
      const d = draft.products[id];
      const parts = [];
      if (d === null) parts.push('删除');
      else if (d?.create) parts.push('新增');
      else if (d) parts.push(savedProduct(id)?.deleted ? '恢复' : '修改信息');
      if (id in draft.images) {
        const image = draft.images[id];
        parts.push(image === null ? '删除图片' : image.status === 'uploading' ? '新图片（上传中）' : image.status === 'error' ? '新图片（上传失败）' : '新图片');
      }
      const p = current(id);
      items.push({ id, text: `${parts.join('，')}：${p?.nameZh || p?.name || ''}` });
    }
    if (draft.featured) items.push({ id: null, text: '调整了精选产品' });
    return items;
  }
  function renderDock() {
    const items = pendingItems();
    $('#dock').hidden = items.length === 0;
    if (!items.length) { $('#dock-list').hidden = true; return; }
    const uploading = Object.values(draft.images).filter((x) => x?.status === 'uploading').length;
    const failed = Object.values(draft.images).filter((x) => x?.status === 'error').length;
    $('#dock-count').textContent = `${items.length} 项修改待发布`;
    $('#dock-detail').textContent = uploading ? `${uploading} 张图片上传中…` : failed ? `${failed} 张图片上传失败，请重新选择或撤销` : items.map((x) => x.text).slice(0, 3).join('；');
    const publish = $('#dock-publish');
    publish.disabled = uploading > 0 || failed > 0 || publishing;
    publish.textContent = publishing ? '正在发布…' : '发布到网站';
    $('#dock-list').innerHTML = items.map((x) => `<li>${x.id ? tag(x.id) : '<span class="tag"><span class="tag-no">精选</span></span>'}<span>${esc(x.text)}</span><button type="button" data-undo="${x.id ?? ''}">撤销</button></li>`).join('');
  }
  $('#dock-review').addEventListener('click', () => {
    const list = $('#dock-list');
    list.hidden = !list.hidden;
    $('#dock-review').textContent = list.hidden ? '查看' : '收起';
  });
  $('#dock-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-undo]');
    if (!button) return;
    const id = button.dataset.undo;
    if (id) discard(id); else { draft.featured = null; persist(); }
    renderList();
    renderFeatured();
    if (selectedId === id) openEditor(id);
  });
  $('#dock-discard').addEventListener('click', () => {
    const button = $('#dock-discard');
    if (button.dataset.armed !== '1') {
      button.dataset.armed = '1';
      button.textContent = '再点一次确认放弃';
      setTimeout(() => { button.dataset.armed = ''; button.textContent = '全部放弃'; }, 4000);
      return;
    }
    button.dataset.armed = '';
    button.textContent = '全部放弃';
    draft = emptyDraft();
    persist();
    renderList();
    renderFeatured();
    if (selectedId !== null) (selectedId === '' ? closeEditor() : openEditor(selectedId));
    toast('已放弃所有未发布的修改');
  });

  $('#dock-publish').addEventListener('click', async () => {
    publishing = true;
    renderDock();
    const body = {};
    if (Object.keys(draft.products).length) body.products = draft.products;
    if (Object.keys(draft.images).length) body.images = Object.fromEntries(Object.entries(draft.images).map(([id, x]) => [id, x ? x.blob : null]));
    if (draft.featured) body.featured = draft.featured;
    try {
      const result = await api('save', { method: 'POST', body });
      for (const [id, image] of Object.entries(draft.images)) if (image) recent[id] = image.thumb; else delete recent[id];
      const count = pendingItems().length;
      draft = emptyDraft();
      persist();
      await loadState();
      Object.assign(studio, result.studio || {});
      renderList();
      renderFeatured();
      if (selectedId && current(selectedId)) openEditor(selectedId); else if (selectedId !== null) closeEditor();
      toast(`已发布 ${count} 项修改。网站大约 1 到 2 分钟后更新。`, 'ok');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      publishing = false;
      renderDock();
    }
  });

  window.addEventListener('beforeunload', (event) => {
    if (Object.values(draft.images).some((x) => x?.status === 'uploading')) { event.preventDefault(); event.returnValue = ''; }
  });

  // ---------- Start ----------
  function fillCategorySelects() {
    const options = CATEGORIES.map(([key, name]) => `<option value="${key}">${name}</option>`).join('');
    $('#filter-category').insertAdjacentHTML('beforeend', options);
    $('#ed-category').innerHTML = options;
    $('#feat-category').innerHTML = options;
  }

  async function start() {
    $('#login').hidden = true;
    $('#app').hidden = false;
    try {
      await loadState();
      restoreDraft();
      renderList();
      renderDock();
      if (Object.keys(draft.products).length || Object.keys(draft.images).length || draft.featured) toast('已恢复上次没有发布的修改');
    } catch (error) {
      $('#sync').textContent = '';
      toast(error.message, 'error');
    }
  }

  fillCategorySelects();
  api('login').then((r) => (r.signedIn ? start() : showLogin())).catch(() => showLogin());
})();
