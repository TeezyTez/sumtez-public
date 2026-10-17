(() => {
  const { guides } = window.SUMTEZ_HUB;
  const tools = window.SUMTEZ_TOOLS.tools;
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const link = (text, href, cls, external = false) => { const a = el('a', text, cls); a.href = href; if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; };
  const guideUrl = id => `guide.html?guide=${encodeURIComponent(id)}`;
  const state = window.SUMTEZ_STATE;
  const guideGrid = document.querySelector('#guide-grid');
  if (guideGrid) {
    guides.forEach(guide => {
      const card = link('', guideUrl(guide.id), `guide-card ${guide.color}`);
      const meta = el('div', '', 'guide-meta'); meta.append(el('span', guide.category), el('span', '↗'));
      const progress = state.read(`steps:${guide.id}`, []);
      const done = Array.isArray(progress) ? new Set(progress.filter(i => Number.isInteger(i) && i >= 0 && i < guide.steps.length)).size : 0;
      card.append(meta, el('span', guide.number, 'guide-number'), el('h3', guide.title), el('p', guide.summary), el('span', done ? `已完成 ${done}/${guide.steps.length} 步 · 继续实践 →` : `${guide.minutes} · 可填写提示词`, 'guide-time'));
      document.querySelector('#guide-grid').append(card);
    });
  }
  const article = document.querySelector('#guide-article');
  if (!article) return;
  const guide = guides.find(item => item.id === new URLSearchParams(location.search).get('guide'));
  if (!guide) {
    document.title = '未找到指南 — Sumtez';
    article.append(el('h1', '这篇指南还没有收录'), el('p', '从指南列表选择一篇，开始新的实践。'), link('返回使用指南 ↗', 'index.html#guides', 'button primary'));
    return;
  }
  document.title = `${guide.title} — Sumtez 使用指南`;
  const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = `https://sumtez.com/${guideUrl(guide.id)}`; document.head.append(canonical);
  document.querySelector('meta[name="description"]').content = guide.summary;
  article.append(link('← 返回使用指南', 'index.html#guides', 'text-link guide-back'), el('p', `${guide.category} / ${guide.minutes}`, 'eyebrow muted'), el('h1', guide.title), el('p', guide.intro, 'guide-intro'));
  const outcome = el('div', '', 'guide-outcome'); outcome.append(el('strong', '完成后，你会得到'), el('p', guide.outcome)); article.append(outcome);
  const savedSteps = state.read(`steps:${guide.id}`, []);
  const completed = new Set(Array.isArray(savedSteps) ? savedSteps.filter(i => Number.isInteger(i) && i >= 0 && i < guide.steps.length) : []);
  const progress = el('section', '', 'reading-progress');
  const progressLabel = el('span'); progressLabel.setAttribute('role', 'status');
  const progressBar = document.createElement('progress'); progressBar.max = guide.steps.length; progressBar.setAttribute('aria-label', '实践完成进度');
  const restart = el('button', '重置进度', 'text-link'); restart.type = 'button';
  const progressNote = el('p', '勾选已完成的步骤；进度仅保存在当前浏览器。', 'local-note');
  const checkboxes = [];
  const updateProgress = (persist = false) => {
    progressLabel.textContent = completed.size === guide.steps.length ? '本篇实践已完成 ✓' : `实践进度 ${completed.size} / ${guide.steps.length}`;
    progressBar.value = completed.size;
    if (persist && !state.write(`steps:${guide.id}`, [...completed])) progressNote.textContent = '浏览器未允许本地保存，进度仅在本页有效。';
  };
  restart.addEventListener('click', () => { completed.clear(); checkboxes.forEach(input => { input.checked = false; }); updateProgress(true); });
  progress.append(progressLabel, progressBar, restart, progressNote); article.append(progress);
  updateProgress();
  const jump = link('直接填写提示词 ↓', '#prompt-builder', 'text-link prompt-jump'); article.append(jump);
  const steps = el('ol', '', 'guide-steps');
  guide.steps.forEach(([title, body], index) => {
    const li = el('li'); const label = el('label', '', 'step-complete');
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = completed.has(index); input.setAttribute('aria-label', `完成第 ${index + 1} 步：${title}`);
    input.addEventListener('change', () => { if (input.checked) completed.add(index); else completed.delete(index); updateProgress(true); });
    checkboxes.push(input); label.append(input, el('span', '这一步完成了'));
    li.append(el('h2', title), el('p', body), label); steps.append(li);
  }); article.append(steps);
  const builder = el('section', '', 'prompt-builder'); builder.id = 'prompt-builder';
  builder.append(el('span', '你的任务 / YOUR PROMPT', 'eyebrow muted'), el('h2', '把提示词，变成你的任务'), el('p', '填写与你有关的素材，下方模板会同步更新。留空项会保留提示，方便稍后补充。', 'builder-intro'));
  const form = el('form', '', 'prompt-form');
  form.addEventListener('submit', event => event.preventDefault());
  const promptLines = guide.prompt.split('\n'); const inputs = new Map();
  promptLines.forEach((line, index) => {
    const match = line.match(/^([^：:]+)[：:]\s*(\[[^\]]+\])$/);
    if (!match) return;
    const label = el('label', '', 'prompt-field'); const input = el('textarea');
    input.rows = 2; input.maxLength = 2000; input.placeholder = match[2].slice(1, -1); input.autocomplete = 'off';
    label.append(el('span', match[1]), input); form.append(label); inputs.set(index, {input, label: match[1]});
    input.addEventListener('input', () => { field.value = buildPrompt(); status.textContent = '提示词已更新，可复制到你选择的 AI 工具。'; });
  });
  function buildPrompt() { return promptLines.map((line, index) => { const item = inputs.get(index); return item && item.input.value.trim() ? `${item.label}：${item.input.value.trim()}` : line; }).join('\n'); }
  const clear = el('button', '清空填写内容', 'text-link'); clear.type = 'reset';
  form.addEventListener('reset', () => { inputs.forEach(({input}) => { input.value = ''; }); field.value = guide.prompt; status.textContent = '已恢复原始模板。'; });
  form.append(clear); builder.append(form, el('p', '填写内容只在本页生成模板，不会发送给 AI，也不会写入网站的本地存储。', 'local-note')); article.append(builder);
  const prompt = el('section', '', 'prompt-section'); const row = el('div', '', 'prompt-heading');
  const copy = el('button', '复制提示词', 'copy-button'); copy.type = 'button';
  row.append(el('h2', '你的提示词'), copy);
  const field = el('textarea', '', 'prompt-text'); field.value = guide.prompt; field.readOnly = true; field.setAttribute('aria-label', '可复制的提示词');
  const status = el('p', '将方括号中的内容换成你的真实资料。', 'copy-status'); status.setAttribute('role', 'status');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(field.value); status.textContent = '已复制，可以粘贴到你选择的 AI 工具中。'; }
    catch { field.focus(); field.select(); status.textContent = '自动复制不可用，已选中文本。请按 Ctrl+C 或 ⌘C 复制。'; }
  });
  prompt.append(row, field, status); article.append(prompt);
  const check = el('section', '', 'guide-check'); check.append(el('h2', '完成前，检查一下'), el('p', guide.check)); article.append(check);
  const related = el('section', '', 'related-tools'); related.append(el('h2', '可以搭配的工具'));
  guide.tools.forEach(id => { const tool = tools.find(t => t.id === id); if (tool) related.append(link(`${tool.name} ↗`, tool.url, 'related-pill', true)); });
  related.append(el('p', '以上是完成任务的可选工具，具体功能和收费以官网为准。', 'source-note')); article.append(related);
  const next = guides[(guides.indexOf(guide) + 1) % guides.length];
  const onward = link('', guideUrl(next.id), 'guide-next'); onward.append(el('span', '继续探索 →'), el('strong', next.title)); article.append(onward);
})();
