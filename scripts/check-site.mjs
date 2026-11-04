#!/usr/bin/env node
// Read-only, dependency-free checks of published files; never runs a generator.
// Usage: node scripts/check-site.mjs [site-directory]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requested = process.argv[2] ? path.resolve(process.argv[2]) : repository;
const root = [path.join(requested, 'dist'), requested].find(directory =>
  ['index.html', 'content.js', 'tools-data.js'].every(file => fs.existsSync(path.join(directory, file))));
if (!root) {
  console.error(`FAIL: no published site with index.html, content.js and tools-data.js in ${requested} or its dist/.`);
  process.exit(1);
}

const errors = [];
const notes = [];
let localReferences = 0;
const relative = file => path.relative(root, file).split(path.sep).join('/');
const fail = (file, message, line) => errors.push(`${relative(file)}${line ? `:${line}` : ''}: ${message}`);
const normalize = value => String(value ?? '').replace(/\s+/g, '');
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
  if (entity[0] !== '#') return ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' })[entity.toLowerCase()];
  const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '\ufffd';
});

// A small tokenizer for this site's explicit HTML. It preserves ancestry and
// ignores comments/raw script text, so markup in JavaScript cannot pass checks.
function parseHTML(source) {
  const document = { tag: '#document', attrs: {}, children: [], parent: null };
  const stack = [document];
  const nodes = [];
  const tokens = /<!--[\s\S]*?-->|<![^>]*>|<\/?([a-z][\w:-]*)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  let cursor = 0;
  for (let match; (match = tokens.exec(source));) {
    stack.at(-1).children.push(source.slice(cursor, match.index));
    cursor = tokens.lastIndex;
    if (!match[1]) continue;
    const tag = match[1].toLowerCase();
    if (match[0].startsWith('</')) {
      const index = stack.findLastIndex(node => node.tag === tag);
      if (index > 0) stack.length = index;
      continue;
    }
    const attrs = {};
    const attributes = match[0].slice(match[0].indexOf(match[1]) + match[1].length).replace(/\/?\s*>$/, '');
    for (const attribute of attributes.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[attribute[1].toLowerCase()] = decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
    }
    const node = { tag, attrs, parent: stack.at(-1), children: [], line: source.slice(0, match.index).split('\n').length };
    node.parent.children.push(node);
    nodes.push(node);
    if (tag === 'script' || tag === 'style') {
      const closing = new RegExp(`</${tag}\\s*>`, 'gi');
      closing.lastIndex = cursor;
      const end = closing.exec(source);
      cursor = tokens.lastIndex = end ? closing.lastIndex : source.length;
    } else if (!voidTags.has(tag) && !/\/\s*>$/.test(match[0])) stack.push(node);
  }
  stack.at(-1).children.push(source.slice(cursor));
  return { document, nodes };
}

function readable(node) {
  for (let current = node; current; current = current.parent) {
    if (['script', 'style', 'template', 'noscript'].includes(current.tag) ||
        Object.hasOwn(current.attrs, 'hidden') || current.attrs['aria-hidden'] === 'true' ||
        /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(current.attrs.style || '')) return false;
  }
  return true;
}
const within = (node, ancestor) => {
  for (let current = node.parent; current; current = current.parent) if (current === ancestor) return true;
  return false;
};
const visibleText = node => readable(node) ? node.children.map(child =>
  typeof child === 'string' ? decode(child) : visibleText(child)).join(' ') : '';

function localTarget(value, file) {
  if (!value.trim() || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(value.trim())) return null;
  const url = new URL(value.trim(), `https://static-check.invalid/${relative(file)}`);
  const target = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error('path escapes the published directory');
  return fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target;
}
const isFile = file => fs.existsSync(file) && fs.statSync(file).isFile();
function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    if (entry.name.startsWith('.') || ['node_modules', 'scripts', 'docs'].includes(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.isFile() && /\.html$/i.test(entry.name) ? [file] : [];
  });
}

const pages = new Map();
for (const file of htmlFiles(root)) {
  const page = parseHTML(fs.readFileSync(file, 'utf8'));
  pages.set(file, page);
  const html = page.nodes.find(node => node.tag === 'html');
  if (!html?.attrs.lang?.trim()) fail(file, '<html> requires a non-empty lang');
  if (!page.nodes.some(node => node.tag === 'meta' && node.attrs.name?.toLowerCase() === 'viewport' && node.attrs.content?.trim())) {
    fail(file, 'missing viewport meta');
  }
  const headings = page.nodes.filter(node => node.tag === 'h1' && readable(node));
  const dynamicGuide = relative(file) === 'guide.html' && page.nodes.some(node => node.attrs.id === 'guide-article') &&
    page.nodes.some(node => node.tag === 'script' && /^hub\.js(?:[?#]|$)/.test(node.attrs.src || ''));
  if (dynamicGuide && headings.length === 0) notes.push('guide.html: h1 is rendered by the guide runtime; static h1 check skipped.');
  else if (headings.length !== 1) fail(file, `expected exactly one readable h1, found ${headings.length}`);
  for (const node of page.nodes) {
    if (node.tag === 'base' && node.attrs.href) fail(file, '<base href> is not supported by this site checker', node.line);
    if (node.tag === 'img' && !Object.hasOwn(node.attrs, 'alt')) fail(file, '<img> is missing alt (empty alt is valid for decoration)', node.line);
    if (node.attrs.target?.toLowerCase() === '_blank' && /^(?:https?:|\/\/)/i.test(node.attrs.href || '') &&
        !node.attrs.rel?.toLowerCase().split(/\s+/).includes('noopener')) fail(file, 'external target="_blank" link is missing rel="noopener"', node.line);
    for (const attribute of ['src', 'href']) {
      if (!Object.hasOwn(node.attrs, attribute)) continue;
      try {
        const target = localTarget(node.attrs[attribute], file);
        if (!target) continue;
        localReferences++;
        if (!isFile(target)) fail(file, `${attribute}="${node.attrs[attribute]}" points to missing file ${relative(target)}`, node.line);
      } catch (error) { fail(file, `invalid ${attribute}="${node.attrs[attribute]}": ${error.message}`, node.line); }
    }
  }
}

function readData(filename, name) {
  const file = path.join(root, filename);
  try {
    const source = fs.readFileSync(file, 'utf8');
    const assignment = source.match(new RegExp(`\\bwindow\\.${name}\\s*=\\s*([\\s\\S]*?)\\s*;?\\s*$`));
    if (!assignment) throw new Error(`missing window.${name} JSON assignment`);
    return JSON.parse(assignment[1]); // Data only: do not execute site scripts.
  } catch (error) { fail(file, `cannot read catalogue: ${error.message}`); return null; }
}

const contentFile = path.join(root, 'content.js');
const toolsFile = path.join(root, 'tools-data.js');
const content = readData('content.js', 'SUMTEZ_CONTENT');
const catalogue = readData('tools-data.js', 'SUMTEZ_TOOLS');
const products = content?.products && typeof content.products === 'object' && !Array.isArray(content.products) ? Object.values(content.products) : [];
const tools = Array.isArray(catalogue?.tools) ? catalogue.tools : [];
if (products.length !== 6) fail(contentFile, `expected 6 products, found ${products.length}`);
if (tools.length !== 32) fail(toolsFile, `expected 32 tools, found ${tools.length}`);
const categories = new Set((Array.isArray(catalogue?.categories) ? catalogue.categories : []).map(category => category.id));
const toolIds = new Set();
for (const tool of tools) {
  if (!tool?.id || toolIds.has(tool.id)) fail(toolsFile, `missing or duplicate tool id: ${tool?.id ?? '(empty)'}`);
  toolIds.add(tool?.id);
  if (!tool?.name?.trim() || !tool?.url?.trim() || !categories.has(tool?.category)) fail(toolsFile, `tool ${tool?.id}: missing name/url or unknown category`);
}
const featured = tools.filter(tool => tool?.featured).length;
if (featured !== 16) fail(toolsFile, `expected 16 featured tools, found ${featured}`);

const indexFile = path.join(root, 'index.html');
const home = pages.get(indexFile);
const collectionFile = path.join(root, 'work.html');
const cataloguePage = pages.get(collectionFile);
if (!cataloguePage) fail(collectionFile, 'missing the work index page');
const hasCollectionEntry = home?.nodes.some(node => {
  if (node.tag !== 'a' || !readable(node) || !node.attrs.href) return false;
  try { return localTarget(node.attrs.href, indexFile) === collectionFile; }
  catch { return false; }
});
if (!hasCollectionEntry) fail(indexFile, 'landing page requires a readable static link to work.html');
const collection = cataloguePage?.nodes.find(node => node.attrs.id === 'published-products');
const cards = collection ? cataloguePage.nodes.filter(node => node.tag === 'article' && within(node, collection) && readable(node)) : [];
if (cards.length !== 6) fail(collectionFile, `expected 6 readable static product articles in #published-products, found ${cards.length}`);
const productTargets = new Set();
const matchedCards = new Set();
for (const product of products) {
  if (!product?.title || !product?.summary || !product?.detailUrl || product.sample) {
    fail(contentFile, 'each public product needs title, summary and detailUrl, and must not be a sample');
    continue;
  }
  try {
    const target = localTarget(product.detailUrl, collectionFile);
    if (!target || !/\.html$/i.test(target) || !isFile(target)) {
      fail(contentFile, `${product.title}: missing local HTML product page ${product.detailUrl}`);
      continue;
    }
    if (productTargets.has(target)) fail(contentFile, `duplicate product detailUrl: ${product.detailUrl}`);
    productTargets.add(target);
    const matches = cards.filter(card => cataloguePage.nodes.some(node => node.tag === 'a' && readable(node) && within(node, card) &&
      node.attrs.href && localTarget(node.attrs.href, collectionFile) === target));
    if (matches.length !== 1) { fail(collectionFile, `${product.title}: expected one static card linking to ${product.detailUrl}, found ${matches.length}`); continue; }
    const card = matches[0];
    matchedCards.add(card);
    if (!cataloguePage.nodes.some(node => /^h[2-6]$/.test(node.tag) && within(node, card) && normalize(visibleText(node)) === normalize(product.title))) {
      fail(collectionFile, `${product.title}: static card heading does not match content.js`, card.line);
    }
    // The work index intentionally omits descriptive copy; validate it if rendered.
    const summary = cataloguePage.nodes.find(node => within(node, card) && (node.attrs.class || '').split(/\s+/).includes('future-project-summary'));
    if (summary && !normalize(visibleText(summary)).includes(normalize(product.summary))) fail(collectionFile, `${product.title}: static summary is stale`, card.line);
  } catch (error) { fail(contentFile, `${product.title}: ${error.message}`); }
}
if (matchedCards.size !== 6) fail(collectionFile, `only ${matchedCards.size} distinct static cards match the product catalogue`);

console.log(`Checked ${relative(root) || root}: ${pages.size} HTML pages, ${localReferences} local src/href references, ${products.length} products, ${tools.length} tools (${featured} featured).`);
for (const note of notes) console.log(`NOTE: ${note}`);
if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  console.error(`${errors.length} static regression issue(s). No files were changed.`);
  process.exitCode = 1;
} else {
  console.log('PASS: static links, document basics, landing entry, catalogue counts and six no-JavaScript product cards in work.html are consistent.');
}
console.log('Scope: local files and static HTML only; no network requests, CSS visibility/layout, or browser runtime checks.');
