(() => {
  const content = window.SUMTEZ_CONTENT;
  const el = (tag, text, cls) => { const node = document.createElement(tag); node.textContent = text; if (cls) node.className = cls; return node; };
  const grid = document.querySelector('#published-products');
  Object.values(content.products).filter(product => !product.sample).forEach((product, index) => {
    if (!product.image) {
      const card = el('article', '', `project-card ${product.tone || ''}`);
      const meta = el('div', '', 'project-meta');
      meta.append(el('span', `${String(index + 1).padStart(2, '0')} / ${product.type}`, 'eyebrow'), el('span', product.mark, 'project-mark'));
      const title = el('h3', product.title);
      const flow = el('ol', '', 'mini-flow'); flow.setAttribute('aria-label', '主要工作流程');
      product.flow.forEach(step => flow.append(el('li', step)));
      const actions = el('div', '', 'project-links');
      const detail = el('a', '了解产品 ↗', 'text-link'); detail.href = product.detailUrl; detail.setAttribute('aria-label', `了解 ${product.title}`);
      const source = el('a', '查看源码 ↗', 'text-link'); source.href = product.sourceUrl; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.setAttribute('aria-label', `查看 ${product.title} 的 GitHub 源码`);
      actions.append(detail, source);
      card.append(meta, el('p', product.repo, 'project-repo'), title, el('p', product.summary, 'project-summary'), flow, el('span', product.status, 'project-state'), actions);
      grid.append(card);
      return;
    }
    const card = el('article', '', 'published-product');
    const copy = el('div', '', 'published-copy');
    const title = el('h3', product.title);
    const status = el('span', product.status, 'product-status');
    const actions = el('div', '', 'product-actions');
    const action = el('a', '走进这个作品 ↗', 'button light'); action.href = product.detailUrl;
    const source = el('a', 'GitHub ↗', 'text-link'); source.href = product.sourceUrl; source.target = '_blank'; source.rel = 'noopener noreferrer';
    actions.append(action, source);
    copy.append(el('span', `${String(index + 1).padStart(2, '0')} / ${product.type}`, 'eyebrow'), title, el('p', product.summary), status, actions);
    const preview = el('a', '', 'published-preview'); preview.href = product.detailUrl; preview.setAttribute('aria-label', `查看 ${product.title} 产品详情`);
    const frame = el('div', '', 'preview-window');
    const bar = el('div', '', 'preview-bar'); bar.append(el('span', '● ● ●'), el('span', product.title));
    const image = document.createElement('img'); image.src = product.image; image.alt = product.title + ' 原型首页界面'; image.width = 1430; image.height = 993; image.loading = 'lazy';
    frame.append(bar, image); preview.append(frame, el('span', '原型界面 · 持续迭代中 ↗', 'preview-caption'));
    card.append(copy, preview); grid.append(card);
  });
  const button = document.querySelector('#contact-button');
  const dialog = document.querySelector('#detail-dialog');
  if (content.email || content.wechat) {
    button.hidden = false;
    const sections = document.querySelector('#dialog-sections');
    if (content.email) { const link = el('a', content.email, 'contact-email'); link.href = 'mailto:' + encodeURIComponent(content.email); sections.append(el('h3', '邮箱'), link); }
    if (content.wechat) sections.append(el('h3', '微信'), el('p', content.wechat));
    button.addEventListener('click', () => dialog.showModal());
  }
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
})();
