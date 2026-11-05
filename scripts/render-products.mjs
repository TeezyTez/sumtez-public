/* The project names themselves form the homepage composition. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const names = {'ainovel.html':'elselife', 'declaration.html':'MPCI', 'bl-reco.html':'BL_RECO', 'edi-agent.html':'EDI Agent', 'cloud-agent.html':'Cloud Agent', 'codegen-verify.html':'codegen'};
export const projectName = product => names[product.detailUrl] || product.title;
export function renderProducts(all) {
  return all.map((product, index) => `<article class="work-entry work-entry--${index+1}">
    <span class="work-number">${String(index+1).padStart(2,'0')}</span>
    <a class="work-name" href="${esc(product.detailUrl)}" aria-label="${esc(projectName(product))} — ${esc(product.title)}，查看作品"><span class="work-word">${esc(projectName(product))}</span><span class="work-name-arrow" aria-hidden="true">↗</span></a>
    <div class="work-caption"><h3>${esc(product.title)}</h3><a href="${esc(product.sourceUrl)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${esc(product.title)} 的 GitHub 源码">源码 ↗</a></div>
  </article>`).join('\n');
}
