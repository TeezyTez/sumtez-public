/* The portfolio is rendered at build time; this file only enhances contact. */
(() => {
  const content = window.SUMTEZ_CONTENT;
  const button = document.querySelector('#contact-button');
  const dialog = document.querySelector('#detail-dialog');
  if (!content || !button || !dialog) return;
  const sections = document.querySelector('#dialog-sections');
  const append = (tag, text) => {
    const node = document.createElement(tag);
    node.textContent = text;
    sections.append(node);
    return node;
  };
  if (content.email || content.wechat) {
    button.hidden = false;
    if (content.email) {
      append('h3', '邮箱');
      const link = append('a', content.email);
      link.className = 'contact-email';
      link.href = 'mailto:' + encodeURIComponent(content.email);
    }
    if (content.wechat) { append('h3', '微信'); append('p', content.wechat); }
    button.addEventListener('click', () => dialog.showModal());
  }
  dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(close => close.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
})();
