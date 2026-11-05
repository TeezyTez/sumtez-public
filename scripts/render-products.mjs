/* Static, accessible project cards enhanced by the homepage stack controller. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const names = {'ainovel.html':'elselife', 'declaration.html':'MPCI', 'bl-reco.html':'BL_RECO', 'edi-agent.html':'EDI Agent', 'cloud-agent.html':'Cloud Agent', 'codegen-verify.html':'codegen'};
const covers = {
  'ainovel.html': ['e.', 'CHOICE / STORY', '', '走进一个世界，用自己的话行动，让选择长出下一段故事。'],
  'declaration.html': ['?', 'ASK / RETRIEVE', '', '把手册里的业务规则，变成可以直接提问、回到来源核对的知识助手。'],
  'bl-reco.html': ['[ ]', 'DOCUMENT / DATA', 'map', '从一张提单开始，把 PDF、图片和文本整理成结构化字段与 EDI 草稿。'],
  'edi-agent.html': ['a:b', 'SOURCE / TARGET', 'code', '把源字段、目标字段和人工审核组织成可复用的字段对齐流程。'],
  'cloud-agent.html': ['↗', 'TASK / ACTION', 'flow', '把一句自然语言任务组织成执行流程，跟踪工具调用、状态和结果。'],
  'codegen-verify.html': ['{✓}', 'SPEC / VERIFY', 'code', '让生成的代码接受规约检验，把任务约束、候选代码与验证反馈串起来。']
};
export const projectName = product => names[product.detailUrl] || product.title;
export function renderProducts(all) {
  return all.map((product, index) => {
    const number = String(index + 1).padStart(2, '0');
    const [glyph, label, kind, description] = covers[product.detailUrl] || ['↗', 'SUMTEZ / WORK', '', product.summary];
    return `<article class="project-stack-card" data-project-name="${esc(projectName(product))}" aria-labelledby="project-title-${number}">
      <div class="project-stack-surface">
        <div class="project-stack-copy">
          <p class="project-stack-kicker"><span>${number}</span><span>${esc(product.type)}</span></p>
          <p class="project-stack-name" aria-hidden="true">${esc(projectName(product))}</p>
          <h2 class="project-stack-title" id="project-title-${number}">${esc(product.title)}</h2>
          <p class="project-stack-description">${esc(description)}</p>
          <div class="project-stack-actions"><a href="${esc(product.detailUrl)}" aria-label="查看 ${esc(projectName(product))} 作品">查看作品 ↗</a><a href="${esc(product.sourceUrl)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${esc(projectName(product))} 的 GitHub 源码">源码 ↗</a></div>
        </div>
        <div class="project-stack-art project-stack-art--${kind || 'orbit'}" aria-hidden="true"><span class="project-stack-glyph">${glyph}</span><div class="project-stack-art-label"><span>${label}</span><span>SUMTEZ / ${number}</span></div></div>
      </div>
    </article>`;
  }).join('\n');
}
