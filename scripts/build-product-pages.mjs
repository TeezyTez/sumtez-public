// Rebuild the static product pages after updating dist/content.js. No dependencies.
import fs from 'node:fs';
import vm from 'node:vm';
const assets = fs.existsSync('dist/content.js') ? 'dist' : '.';
const ctx = {window:{}};
vm.runInNewContext(fs.readFileSync(`${assets}/content.js`,'utf8'),ctx);
const all = Object.values(ctx.window.SUMTEZ_CONTENT.products).filter(p=>!p.sample);
const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const links = all.map(p=>`<a href="${esc(p.detailUrl)}">${esc(p.title)} →</a>`).join('');
const home = fs.readFileSync(`${assets}/index.html`,'utf8').replace(/<noscript><article class="noscript-product">[\s\S]*?<\/article><\/noscript>|<noscript><div class="all-project-links">[\s\S]*?<\/div><\/noscript>/,`<noscript><div class="all-project-links"><p>我的产品 · 点击查看介绍</p>${links}</div></noscript>`);
fs.writeFileSync(`${assets}/index.html`,home);
for(const [index,p] of all.entries()) {
  if (!p.headline) continue;
  const source = `${p.sourceUrl}/blob/${p.commit || 'HEAD'}/${p.evidence}`;
  const related = all.filter(q=>q!==p).slice(0,2);
  const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f6f2"><meta name="description" content="${esc(p.intro)}"><title>${esc(p.title)} — Sumtez</title><meta property="og:title" content="${esc(p.title)} — Sumtez"><meta property="og:description" content="${esc(p.summary)}"><meta property="og:type" content="website"><meta property="og:url" content="https://sumtez.com/${p.detailUrl}"><link rel="canonical" href="https://sumtez.com/${p.detailUrl}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css?v=20261017-toolbox"><link rel="stylesheet" href="products.css?v=20261018-projects"></head>
<body id="top" class="product-page project-case"><a class="skip-link" href="#product-main">跳到产品介绍</a><header class="header"><a class="brand" href="index.html" aria-label="Sumtez 首页">sumtez<span class="brand-dot">.</span></a><nav aria-label="主导航"><a href="index.html#work" aria-current="page">我的产品</a><a href="tools.html">工具箱</a><a href="index.html#guides">使用指南</a><a href="index.html#about">关于</a></nav><a class="header-note" href="https://github.com/TeezyTez" target="_blank" rel="noopener noreferrer">GitHub ↗</a></header>
<main id="product-main"><section class="section product-intro"><a class="text-link" href="index.html#work">← 返回我的产品</a><div class="product-intro-row"><div><p class="eyebrow muted">作品 ${String(index+1).padStart(3,'0')} / ${esc(p.type)}</p><h1>${esc(p.headline[0])}<br><span class="serif-word">${esc(p.headline[1])}</span></h1><p class="product-subtitle">${esc(p.title)} / ${esc(p.repo)}</p></div><div class="product-intro-description"><span class="status-pill">${esc(p.status)}</span><p>${esc(p.intro)}</p><div class="hero-actions"><a class="button primary" href="#getting-started">如何体验 ↓</a><a class="text-link" href="${p.sourceUrl}" target="_blank" rel="noopener noreferrer">查看 GitHub ↗</a></div></div></div>
<div class="project-workflow"><p>从输入到结果 / 工作流程示意</p><ol class="workflow-steps">${p.steps.map(([title,body],i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><h2>${esc(title)}</h2><p>${esc(body)}</p></li>`).join('')}</ol><small>展示当前代码中的主要流程，具体体验以项目版本与配置为准。</small></div><dl class="case-facts"><div><dt>适合谁</dt><dd>${esc(p.audience)}</dd></div><div><dt>当前阶段</dt><dd>${esc(p.status)}</dd></div><div><dt>技术组成</dt><dd>${esc(p.stack)}</dd></div></dl></section>
<section class="section product-capabilities"><div class="section-heading"><div><p class="eyebrow muted">INSIDE THE PROJECT</p><h2>为具体的问题，做具体的工具。</h2></div></div><div class="capability-grid">${p.sections.map(([title,body],i)=>`<article><span>0${i+1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div><aside class="case-limits"><h3>当前版本的边界</h3><p>${esc(p.limits)}</p></aside><p class="case-source">内容依据：<a href="${source}" target="_blank" rel="noopener noreferrer">项目公开源码 ↗</a> · 整理于 2026.10.18。此页为产品介绍，未运行或托管该项目的服务。</p></section>
<section class="section getting-started" id="getting-started"><div><p class="eyebrow muted">START WITH THE SOURCE</p><h2>从源码开始，<br>了解它如何工作。</h2><p>当前提供公开代码与部署说明，尚未提供已验证的在线试玩或购买入口。按项目说明准备自己的运行环境后，可以进一步探索。</p><a class="button primary" href="${p.sourceUrl}#readme" target="_blank" rel="noopener noreferrer">阅读安装与使用说明 ↗</a></div><ol class="start-steps">${p.start.map(([title,body],i)=>`<li><span>0${i+1}</span><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></li>`).join('')}</ol></section>
<section class="section product-outro"><p class="eyebrow muted">MORE FROM SUMTEZ</p><h2>换一个问题，继续探索。</h2><div class="related-projects">${related.map(q=>`<a href="${q.detailUrl}"><span>${esc(q.type)}</span><strong>${esc(q.title)} ↗</strong></a>`).join('')}</div><a class="text-link" href="index.html#work">查看全部 ${all.length} 个产品与项目 →</a></section></main>
<footer><a class="footer-brand" href="index.html">sumtez.</a><span>© <span id="year">2026</span> Sumtez · 保持好奇，持续创造。</span><a href="#top">回到顶部 ↑</a></footer><script src="site.js?v=20261018-projects"></script></body></html>\n`;
  fs.writeFileSync(`${assets}/${p.detailUrl}`,html);
}
console.log(`Generated ${all.filter(p=>p.headline).length} static product pages; ${all.length} products in the collection.`);
