(() => {
  const grid = document.querySelector('#tool-grid');
  const data = window.SUMTEZ_TOOLS;
  if (!grid || !data) return;
  const state = window.SUMTEZ_STATE;
  const featuredOnly = grid.closest('[data-tool-scope]')?.dataset.toolScope === 'featured';
  const tools = data.tools.filter(tool => !featuredOnly || tool.featured);
  const categories = data.categories.filter(category => tools.some(tool => tool.category === category.id));
  const categoryNames = Object.fromEntries(data.categories.map(category => [category.id, category.label]));
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const external = (text, url, className = '') => {
    const node = el('a', text, className);
    node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer';
    return node;
  };
  const readFavorites = () => {
    const saved = state.read('favorites', []);
    return new Set(Array.isArray(saved) ? saved.filter(id => data.tools.some(tool => tool.id === id)) : []);
  };
  let favorites = readFavorites();
  let category = 'all';
  let favoritesOnly = false;
  const search = document.querySelector('#tool-search');
  const sort = document.querySelector('#tool-sort');
  const free = document.querySelector('#tool-free');
  const chinese = document.querySelector('#tool-chinese');
  const favoriteFilter = document.querySelector('#favorite-filter');
  const storageStatus = document.querySelector('#storage-status');
  const empty = document.querySelector('#tool-empty');
  const clear = document.querySelector('#tool-clear');
  const filterContainer = document.querySelector('#tool-categories');
  const buttons = [{id:'all', label:'全部'}, ...categories].map(item => {
    const button = el('button', item.label, 'tool-filter');
    button.type = 'button';
    button.dataset.toolFilter = item.id;
    button.addEventListener('click', () => { category = item.id; filter(); });
    filterContainer.append(button);
    return button;
  });
  const dialog = el('dialog', '', 'tool-dialog');
  dialog.setAttribute('aria-labelledby', 'tool-detail-title');
  const close = el('button', '×', 'dialog-close');
  close.type = 'button'; close.setAttribute('aria-label', '关闭工具详情'); close.autofocus = true;
  close.addEventListener('click', () => dialog.close());
  const detailBody = el('div', '', 'tool-detail-body');
  dialog.append(close, detailBody);
  document.body.append(dialog);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  const detailSection = (title, body, sourceUrl, sourceLabel) => {
    const section = el('section', '', 'tool-detail-section');
    section.append(el('h3', title), el('p', body));
    if (sourceUrl) section.append(external(sourceLabel, sourceUrl, 'text-link'));
    return section;
  };
  function showDetails(tool) {
    detailBody.replaceChildren();
    const title = el('h2', tool.name); title.id = 'tool-detail-title';
    detailBody.append(el('p', categoryNames[tool.category] + ' / 第三方工具', 'eyebrow muted'), title, el('p', tool.summary, 'tool-detail-intro'));
    detailBody.append(detailSection('收费与使用方式', tool.pricing, tool.pricingUrl, '查看收费说明 ↗'));
    detailBody.append(detailSection('更新记录 · ' + tool.updateDate.replaceAll('-', '.'), tool.updateSummary, tool.updateUrl, '查看官方更新 ↗'));
    detailBody.append(detailSection('关注依据', tool.popularity, tool.popularityUrl, '查看资料来源 ↗'));
    if (tool.notes) detailBody.append(detailSection('使用前了解', tool.notes));
    const actions = el('div', '', 'tool-detail-actions');
    actions.append(external('前往官网 ↗', tool.url, 'button primary'));
    if (tool.guide) {
      const guide = el('a', '打开相关实践指南 →', 'text-link');
      guide.href = 'guide.html?guide=' + encodeURIComponent(tool.guide);
      actions.append(guide);
    }
    detailBody.append(actions, el('p', '公开资料核对于 ' + data.checkedAt.replaceAll('-', '.') + ' · 尚未逐款实测', 'source-note'));
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  const cards = tools.map((tool, index) => {
    const card = el('article', '', 'tool-card library-card');
    card.dataset.toolId = tool.id;
    const mark = el('span', tool.mark, 'tool-mark ' + tool.color); mark.setAttribute('aria-hidden', 'true');
    const heading = el('div', '', 'library-card-heading');
    heading.append(el('h3', tool.name), el('span', categoryNames[tool.category], 'library-category'));
    const favorite = el('button', '', 'favorite-button'); favorite.type = 'button';
    function updateFavorite() {
      const selected = favorites.has(tool.id);
      favorite.textContent = selected ? '♥' : '♡';
      favorite.setAttribute('aria-label', (selected ? '取消收藏 ' : '收藏 ') + tool.name);
      favorite.setAttribute('aria-pressed', String(selected));
    }
    updateFavorite();
    favorite.addEventListener('click', () => {
      if (favorites.has(tool.id)) favorites.delete(tool.id); else favorites.add(tool.id);
      const persisted = state.write('favorites', [...favorites]);
      storageStatus.textContent = persisted ? '收藏已更新，仅保存在当前浏览器。' : '浏览器未允许本地保存，收藏仅在本页有效。';
      updateFavorite(); filter();
      if (card.hidden) favoriteFilter.focus();
    });
    const badges = el('div', '', 'library-badges');
    badges.append(el('span', tool.pricingLabel, 'price-badge'));
    if (tool.chineseFriendly) badges.append(el('span', '中文优先', 'language-badge'));
    const update = el('p', '', 'library-update');
    const date = el('time', tool.updateDate.replaceAll('-', '.')); date.dateTime = tool.updateDate;
    update.append(el('span', '更新记录'), date);
    const actions = el('div', '', 'tool-actions');
    const details = el('button', '详情与来源 ↗', 'tool-details-button');
    details.type = 'button'; details.setAttribute('aria-label', '查看 ' + tool.name + ' 的详情与来源');
    details.addEventListener('click', () => showDetails(tool));
    actions.append(external('前往官网 ↗', tool.url, 'tool-official'), details);
    card.append(mark, heading, favorite, el('p', tool.summary, 'library-summary'), badges, update, actions);
    grid.append(card);
    const text = [tool.name, ...(tool.aliases || []), categoryNames[tool.category], tool.summary].join(' ').toLocaleLowerCase();
    return {tool, card, index, text, updateFavorite};
  });
  let currentOrder = "";
  function filter() {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(({tool, card, text}) => {
      const matches = (category === 'all' || category === tool.category)
        && (!favoritesOnly || favorites.has(tool.id))
        && (!free?.checked || tool.freeAccess)
        && (!chinese?.checked || tool.chineseFriendly)
        && words.every(word => text.includes(word));
      card.hidden = !matches;
      if (matches) count++;
    });
    const ordered = [...cards].sort((a, b) => {
      if (sort?.value === 'updated') return b.tool.updateDate.localeCompare(a.tool.updateDate) || a.index - b.index;
      if (sort?.value === 'name') return a.tool.name.localeCompare(b.tool.name, 'zh-CN') || a.index - b.index;
      return Number(b.tool.featured) - Number(a.tool.featured) || a.index - b.index;
    });
    const orderKey = ordered.map(({tool}) => tool.id).join(',');
    if (currentOrder !== orderKey) {
      ordered.forEach(({card}) => grid.append(card));
      currentOrder = orderKey;
    }
    buttons.forEach(button => {
      const active = button.dataset.toolFilter === category;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#tool-count').textContent = count + ' / ' + tools.length + (featuredOnly ? ' 款精选' : ' 款工具');
    document.querySelector('#favorite-count').textContent = tools.filter(tool => favorites.has(tool.id)).length;
    favoriteFilter.classList.toggle('active', favoritesOnly);
    favoriteFilter.setAttribute('aria-pressed', String(favoritesOnly));
    empty.hidden = count !== 0;
    empty.querySelector('h3').textContent = favoritesOnly ? '当前筛选下还没有收藏' : '还没有匹配的工具';
    if (clear) clear.hidden = category === 'all' && !favoritesOnly && !words.length && !free?.checked && !chinese?.checked;
  }
  function reset() {
    category = 'all'; favoritesOnly = false; search.value = '';
    if (free) free.checked = false;
    if (chinese) chinese.checked = false;
    if (sort) sort.value = 'curated';
    filter();
  }
  search.addEventListener('input', filter);
  sort?.addEventListener('change', filter);
  free?.addEventListener('change', filter);
  chinese?.addEventListener('change', filter);
  favoriteFilter.addEventListener('click', () => { favoritesOnly = !favoritesOnly; filter(); });
  document.querySelector('#tool-reset').addEventListener('click', () => { reset(); search.focus(); });
  clear?.addEventListener('click', reset);
  document.querySelectorAll('[data-quick-query], [data-quick-category]').forEach(button => button.addEventListener('click', () => {
    reset();
    if (button.dataset.quickQuery) search.value = button.dataset.quickQuery;
    if (button.dataset.quickCategory) category = button.dataset.quickCategory;
    filter();
  }));
  window.addEventListener('storage', event => {
    if (event.key !== 'sumtez:favorites' && event.key !== null) return;
    favorites = readFavorites(); cards.forEach(({updateFavorite}) => updateFavorite()); filter();
  });
  filter();
})();
