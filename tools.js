(() => {
  const grid = document.querySelector('#tool-grid');
  const data = window.SUMTEZ_TOOLS;
  if (!grid || !data) return;
  const state = window.SUMTEZ_STATE;
  const scope = grid.closest('[data-tool-scope]');
  const featuredOnly = scope?.dataset.toolScope === 'featured';
  const previewLimit = featuredOnly ? Math.max(0, Number(scope.dataset.previewLimit) || 0) : 0;
  const tools = data.tools.filter(tool => !featuredOnly || tool.featured);
  const previewIds = (scope?.dataset.previewIds || '').split(/\s+/).filter(id => tools.some(tool => tool.id === id));
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
  const focusVisible = (target, options) => {
    const disclosure = target?.closest('details');
    if (disclosure && !disclosure.open) disclosure.open = true;
    target?.focus(options);
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
  // Share only filter choices; favorite IDs remain in the existing local store.
  if (search) search.name = 'q';
  if (sort) sort.name = 'sort';
  if (free) free.name = 'free';
  if (chinese) chinese.name = 'zh';
  let urlTimer = 0;
  let composing = false;
  const defaultSort = sort?.querySelector('option[value="curated"]') ? 'curated' : sort?.options[0]?.value;
  function cancelUrlWrite() {
    window.clearTimeout(urlTimer);
    urlTimer = 0;
  }
  function writeUrl() {
    cancelUrlWrite();
    if (featuredOnly || composing) return;
    const url = new URL(window.location.href);
    const values = {
      q: search.value,
      category: category === 'all' ? '' : category,
      sort: sort && sort.value !== defaultSort ? sort.value : '',
      free: free?.checked ? '1' : '',
      zh: chinese?.checked ? '1' : '',
      favorites: favoritesOnly ? '1' : ''
    };
    Object.entries(values).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    if (url.href === window.location.href) return;
    // Some file/embedded previews disallow history writes; filtering still works.
    try { window.history.replaceState(window.history.state, '', url); } catch {}
  }
  function scheduleUrlWrite() {
    if (featuredOnly || composing) return;
    cancelUrlWrite();
    urlTimer = window.setTimeout(writeUrl, 180);
  }
  function restoreUrl() {
    cancelUrlWrite();
    if (featuredOnly) return;
    composing = false;
    const params = new URL(window.location.href).searchParams;
    search.value = params.get('q') || '';
    const requestedCategory = params.get('category');
    category = categories.some(item => item.id === requestedCategory) ? requestedCategory : 'all';
    if (sort) {
      const requestedSort = params.get('sort');
      sort.value = [...sort.options].some(option => option.value === requestedSort) ? requestedSort : defaultSort;
    }
    if (free) free.checked = params.get('free') === '1';
    if (chinese) chinese.checked = params.get('zh') === '1';
    favoritesOnly = params.get('favorites') === '1';
  }
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
  let detailTrigger = null;
  const close = el('button', '×', 'dialog-close');
  close.type = 'button'; close.setAttribute('aria-label', '关闭工具详情'); close.autofocus = true;
  close.addEventListener('click', () => dialog.close());
  const detailBody = el('div', '', 'tool-detail-body');
  dialog.append(close, detailBody);
  document.body.append(dialog);
  dialog.addEventListener('close', () => {
    if (detailTrigger?.isConnected && !detailTrigger.closest('[hidden]')) {
      detailTrigger.focus({preventScroll: true});
    } else if (detailTrigger) {
      focusVisible(search, {preventScroll: true});
    }
    detailTrigger = null;
  });
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
  function showDetails(tool, trigger) {
    detailTrigger = trigger;
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
      if (card.hidden) focusVisible(favoriteFilter);
    });
    const actions = el('div', '', 'tool-actions');
    const details = el('button', '详情与来源 ↗', 'tool-details-button');
    details.type = 'button'; details.setAttribute('aria-label', '查看 ' + tool.name + ' 的详情与来源');
    details.setAttribute('aria-haspopup', 'dialog');
    details.addEventListener('click', () => showDetails(tool, details));
    actions.append(external('前往官网 ↗', tool.url, 'tool-official'), details);
    card.append(mark, heading, favorite);
    if (!featuredOnly) {
      const badges = el('div', '', 'library-badges');
      badges.append(el('span', tool.pricingLabel, 'price-badge'));
      if (tool.chineseFriendly) badges.append(el('span', '中文优先', 'language-badge'));
      const update = el('p', '', 'library-update');
      const date = el('time', tool.updateDate.replaceAll('-', '.')); date.dateTime = tool.updateDate;
      update.append(el('span', '更新记录'), date);
      card.append(el('p', tool.summary, 'library-summary'), badges, update);
    }
    card.append(actions);
    grid.append(card);
    const text = [tool.name, ...(tool.aliases || []), categoryNames[tool.category], tool.summary].join(' ').toLocaleLowerCase();
    return {tool, card, index, text, updateFavorite};
  });
  let currentOrder = "";
  function filter({syncUrl = true} = {}) {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const hasFilters = category !== 'all' || favoritesOnly || words.length > 0 || free?.checked || chinese?.checked;
    const isPreview = previewLimit > 0 && !hasFilters && (!sort || sort.value === 'curated');
    const ordered = [...cards].sort((a, b) => {
      if (sort?.value === 'updated') return b.tool.updateDate.localeCompare(a.tool.updateDate) || a.index - b.index;
      if (sort?.value === 'name') return a.tool.name.localeCompare(b.tool.name, 'zh-CN') || a.index - b.index;
      if (isPreview && previewIds.length) {
        const aRank = previewIds.indexOf(a.tool.id), bRank = previewIds.indexOf(b.tool.id);
        const rank = (aRank < 0 ? Infinity : aRank) - (bRank < 0 ? Infinity : bRank);
        if (rank && !Number.isNaN(rank)) return rank;
      }
      return Number(b.tool.featured) - Number(a.tool.featured) || a.index - b.index;
    });
    let count = 0;
    let shown = 0;
    ordered.forEach(({tool, card, text}) => {
      const matches = (category === 'all' || category === tool.category)
        && (!favoritesOnly || favorites.has(tool.id))
        && (!free?.checked || tool.freeAccess)
        && (!chinese?.checked || tool.chineseFriendly)
        && words.every(word => text.includes(word));
      if (matches) count++;
      card.hidden = !matches || (isPreview && shown >= previewLimit);
      if (!card.hidden) shown++;
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
    document.querySelector('#tool-count').textContent = isPreview
      ? '精选展示 ' + shown + ' / ' + tools.length
      : count + ' / ' + tools.length + (featuredOnly ? ' 款精选' : ' 款工具');
    document.querySelector('#favorite-count').textContent = tools.filter(tool => favorites.has(tool.id)).length;
    favoriteFilter.classList.toggle('active', favoritesOnly);
    favoriteFilter.setAttribute('aria-pressed', String(favoritesOnly));
    empty.hidden = count !== 0;
    empty.querySelector('h3').textContent = favoritesOnly ? '当前筛选下还没有收藏' : '还没有匹配的工具';
    if (clear) clear.hidden = !hasFilters && (!sort || sort.value === 'curated');
    if (syncUrl) scheduleUrlWrite();
  }
  function reset() {
    category = 'all'; favoritesOnly = false; search.value = '';
    if (free) free.checked = false;
    if (chinese) chinese.checked = false;
    if (sort) sort.value = 'curated';
    filter();
  }
  search.addEventListener('compositionstart', () => {
    composing = true;
    cancelUrlWrite();
  });
  search.addEventListener('compositionend', () => {
    composing = false;
    filter();
  });
  search.addEventListener('input', event => {
    if (!composing && !event.isComposing) filter();
  });
  sort?.addEventListener('change', filter);
  free?.addEventListener('change', filter);
  chinese?.addEventListener('change', filter);
  favoriteFilter.addEventListener('click', () => { favoritesOnly = !favoritesOnly; filter(); });
  document.querySelector('#tool-reset').addEventListener('click', () => { reset(); focusVisible(search); });
  clear?.addEventListener('click', () => { reset(); focusVisible(search); });
  document.querySelectorAll('[data-quick-query], [data-quick-category]').forEach(button => button.addEventListener('click', () => {
    reset();
    if (button.dataset.quickQuery) search.value = button.dataset.quickQuery;
    if (button.dataset.quickCategory) category = button.dataset.quickCategory;
    filter();
    // Commit before the link's hash navigation triggers popstate restoration.
    writeUrl();
  }));
  window.addEventListener('storage', event => {
    if (event.key !== 'sumtez:favorites' && event.key !== null) return;
    favorites = readFavorites(); cards.forEach(({updateFavorite}) => updateFavorite()); filter();
    if (document.activeElement?.closest('.library-card[hidden]')) focusVisible(favoriteFilter);
  });
  if (!featuredOnly) {
    const restoreFilters = () => {
      restoreUrl();
      favorites = readFavorites();
      cards.forEach(({updateFavorite}) => updateFavorite());
      filter({syncUrl: false});
    };
    window.addEventListener('popstate', restoreFilters);
    window.addEventListener('pageshow', event => {
      // Initial setup already restored the URL; preserve input made while assets load.
      if (event.persisted) restoreFilters();
    });
    window.addEventListener('pagehide', () => {
      if (urlTimer) writeUrl();
      cancelUrlWrite();
    });
    restoreUrl();
  }
  filter({syncUrl: false});
})();
