import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const OUT = join(ROOT, 'public');
const YEAR = new Date().getFullYear();
const EMAIL = 'aliyanniazi370@gmail.com';
const THEME_INIT = `<meta name="theme-color" content="#07111f" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#F7FAFC" media="(prefers-color-scheme: light)"><script>try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}</script>`;
const POST_DESCRIPTIONS = {
  'my-first-post': 'A short introduction from Aliyan and the goals behind the Ayrix technical guide collection.',
  'codex-cli-ubuntu-guide': 'Install Codex CLI on Ubuntu, sign in, configure permissions, and start an AI-assisted coding session.',
  'claude-code-ubuntu-cli-guide': 'Install Claude Code on Ubuntu, authenticate safely, and use practical terminal workflows.',
  'codex-cli-ubuntu-openai-agent-guide': 'Set up OpenAI Codex CLI on Ubuntu, sign in securely, and run your first coding task.',
};
const IMAGE_DIMENSIONS = {
  'arch-cover': [1536, 1024], 'claude-ubuntu-cli-banner': [686, 608],
  'codex-ubuntu-cli-banner': [613, 653], 'github-cover': [1536, 1024],
  'hugo-cover': [1536, 1024], 'ubuntu-cover': [1536, 1024], 'welcome-cover': [1536, 1024],
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const files = [];
for await (const path of walk(OUT)) files.push(path);
const htmlFiles = files.filter((path) => path.endsWith('.html'));
const posts = [];

const cssParts = [
  'assets/css/stylesheet.4ea0df3983f223cad367032f4b80a5ef62ddcd0a18dcab9c723feaeb274b6e7c.css',
  'assets/css/ayrix-studio.css',
  'assets/css/ayrix-motion.css',
  'assets/css/ayrix-redesign.css',
  'assets/css/site-overrides.css',
];
const css = (await Promise.all(cssParts.map(async (part) => {
  try { return await readFile(join(OUT, part), 'utf8'); } catch { return ''; }
}))).join('\n').replace(/@import\s+url\(['"]?https:\/\/fonts\.googleapis\.com[^;]+;?/gi, '').replace(/@import\s+url\(['"]?\/assets\/css\/ayrix-studio\.css['"]?\);?/gi, '').replace(/\/\*[\s\S]*?PaperMod[\s\S]*?\*\//i, '');
await writeFile(join(OUT, 'assets/site.css'), css);

for (const file of htmlFiles) {
  const path = '/' + relative(OUT, file).replace(/\\/g, '/');
  let html = await readFile(file, 'utf8');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = (titleMatch?.[1] || 'Ayrix').replace(/\s*\|\s*Ayrix\s*$/i, '').replace(/&amp;/g, '&').replace(/AYRIX/g, 'Ayrix').replace('Firstt', 'First').trim();
  const canonicalTag = html.match(/<link\b[^>]*rel=["']?canonical["']?[^>]*>/i)?.[0] || '';
  const existingCanonical = canonicalTag.match(/href=["']?([^"' >]+)/i)?.[1]?.replaceAll('aayrix.github.io', 'ayrix.online');
  const initialDescription = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<meta\s+name=["']?description["']?\s+content="([^"]*)"/i)?.[1] || '';

  html = html
    .replaceAll(THEME_INIT, '')
    .replace(/<link rel="stylesheet" href="\/assets\/site\.css"><script type="module" src="\/assets\/site\.js"><\/script>/g, '')
    .replace(/<meta\s+name=generator[^>]*>\s*/gi, '')
    .replace(/<a class="skip-link" href="#main-content">Skip to content<\/a>/gi, '')
    .replace(/href="mailto:\?subject=[^"]*"/gi, 'href="/contact/"')
    .replace(/<script[^>]*src=["']\/assets\/js\/signal-loader\.js["'][^>]*><\/script>/gi, '')
    .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/gi, '')
    .replace(/<link[^>]+fonts\.gstatic\.com[^>]*>/gi, '')
    .replace(/<meta\s+name=theme-color[^>]*>/gi, '')
    .replace(/<meta\s+http-equiv="Content-Security-Policy"[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']?canonical["']?[^>]*>/gi, '')
    .replace(/<link[^>]+href=["']?\/assets\/css\/[^"' >]+\.css[^>]*>/gi, '')
    .replace(/\{year\}/g, String(YEAR))
    .replaceAll(EMAIL, 'name [at] gmail [dot] com')
    .replaceAll('aayrix.github.io', 'ayrix.online')
    .replaceAll('Install & Configure Codex CLI on Ubuntu — AYRIX', 'Install & Configure Codex CLI on Ubuntu — Ayrix')
    .replaceAll('My Firstt Post', 'My First Post')
    .replace(/a Artificial Intelligence/gi, 'an Artificial Intelligence')
    .replace(/Built with HTML\s*&amp;\s*CSS/gi, 'Built with HTML and CSS')
    .replace(/href=mailto:name\s*\[at\]\s*gmail\s*\[dot\]\s*com/gi, 'href="#contact-email"');
  html = html.replace(/lang=en-us/gi, 'lang=en');
  html = html.replace(/rel=noopener\b/gi, 'rel="noopener noreferrer"');
  html = html.replace(/rel="([^"]*)"/gi, (whole, rel) => rel.includes('noopener') && !rel.includes('noreferrer') ? `rel="${rel} noreferrer"` : whole);
  html = html.replace(/<a\b([^>]*\btarget=["']?_blank["']?[^>]*)>/gi, (whole, attrs) => /\brel=/i.test(attrs) ? whole : `<a${attrs} rel="noopener noreferrer">`);

  let pageTitle = path === '/index.html' ? 'Home' : (title || 'Page');
  if (/^\/tags\/[^/]+\/index\.html$/.test(path) && path !== '/tags/index.html') pageTitle = `Tag: ${pageTitle}`;
  if (/^\/categories\/[^/]+\/index\.html$/.test(path) && path !== '/categories/index.html') pageTitle = `Category: ${pageTitle}`;
  const pageSuffix = path.match(/\/page\/(\d+)\/index\.html$/)?.[1];
  if (pageSuffix) pageTitle += ` — Page ${pageSuffix}`;
  const normalizedTitle = `${pageTitle} | Ayrix`;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${normalizedTitle}</title>`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*">/i, `<meta property="og:title" content="${normalizedTitle}">`);
  html = html.replace(/<meta\s+name=twitter:title\s+content="[^"]*">/i, `<meta name="twitter:title" content="${normalizedTitle}">`);
  const canonical = existingCanonical || (path === '/index.html' ? 'https://ayrix.online/' : `https://ayrix.online${path.replace(/index\.html$/, '')}`);
  const description = path === '/index.html'
    ? 'Practical Linux, Ubuntu, Arch, GitHub, and AI coding tool guides with clear steps and copy-ready commands.'
    : (/\/(tags|categories)\/|\/page\//.test(path)
      ? `${path.startsWith('/tags/') ? 'Tag' : path.startsWith('/categories/') ? 'Category' : 'Archive'}: ${title || 'Topic archive'} — browse practical technical guides and tutorials from Ayrix.`
      : (POST_DESCRIPTIONS[path.match(/^\/posts\/([^/]+)\//)?.[1]] || initialDescription || `${title || 'Technical guides'} from Ayrix, a practical engineering publication by Aliyan.`));
  html = html.replace(/<meta\s+name=["']?description["']?\s+content="[^"]*">?/gi, '');
  html = html.replace(/<title>/i, `<link rel="canonical" href="${canonical}"><meta name="description" content="${description.replaceAll('"', '&quot;')}"><title>`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*">/i, `<meta property="og:description" content="${description.replaceAll('"', '&quot;')}">`);
  html = html.replace(/<meta\s+name=twitter:description\s+content="[^"]*">/i, `<meta name="twitter:description" content="${description.replaceAll('"', '&quot;')}">`);
  html = html.replace(/,\s*"mailto:[^"]*"/gi, '');
  if (!/property="og:image"/i.test(html)) html = html.replace(/<\/head>/i, '<meta property="og:image" content="https://ayrix.online/images/ayrix-social.svg"><meta name="twitter:image" content="https://ayrix.online/images/ayrix-social.svg"></head>');
  if (!/name="twitter:image"/i.test(html)) {
    const imageUrl = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] || 'https://ayrix.online/images/ayrix-social.svg';
    html = html.replace(/<\/head>/i, `<meta name="twitter:image" content="${imageUrl}"></head>`);
  }
  if (!/name=twitter:card|name="twitter:card"/i.test(html)) html = html.replace(/<\/head>/i, '<meta name="twitter:card" content="summary_large_image"></head>');
  html = html.replace(/,\s*"mailto:[^"]*"/gi, '');
  html = html.replace(/<head([^>]*)>/i, `<head$1>${THEME_INIT}<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'">`);
  html = html.replace(/<body([^>]*)>/i, '<body$1><a class="skip-link" href="#main-content">Skip to content</a>');
  html = html.replace(/localStorage\.setItem\("darkmode",e\)/g, 'localStorage.setItem("darkmode",e),localStorage.setItem("theme",e?"dark":"light")');
  html = html.replace(/<main\b([^>]*)>/i, (match, attrs) => `<main id="main-content"${attrs.replace(/\bid=["'][^"']*["']/i, '')}>`);
  html = html.replace(/<a class="site-search-link"[^>]*>[\s\S]*?<\/a>/gi, '');
  html = html.replace('</ul></nav></header>', '</ul><a class="site-search-link" href="/posts/" data-search-open aria-keyshortcuts="Control+K">Search <kbd>Ctrl K</kbd></a></nav></header>');
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=(['"]?)(\/images\/covers\/[^'"\s>]+)\1/i);
    if (!src || !src[2].endsWith('.png')) return tag;
    const base = src[2].slice('/images/covers/'.length, -4);
    const size = IMAGE_DIMENSIONS[base];
    if (!size) return tag;
    let updated = tag.replace(src[0], `src="/images/covers/${base}.webp"`);
    if (!/\bwidth=/i.test(updated)) updated = updated.replace(/<img\b/i, `<img width="${size[0]}" height="${size[1]}"`);
    if (!/\bdecoding=/i.test(updated)) updated = updated.replace(/<img\b/i, '<img decoding="async"');
    if (path === '/index.html' && base === 'welcome-cover') updated = updated.replace(/loading=lazy/i, 'loading=eager fetchpriority="high"');
    return updated;
  });
  html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/site.js"></script></head>');

  if (path === '/index.html') {
    html = html.replace('<span class=home-stat-value>10+</span>', '<span class=home-stat-value>11</span>');
    html = html.replace('<strong>Hugo</strong> Static site engineering', '<strong>AI Tools</strong> Coding workflows');
    html = html.replace(/— inquiries and collaboration/g, '— inquiries and collaboration');
    html = html.replace(/<span class=home-card-desc>name \[at\] gmail \[dot\] com[^<]*<\/span>/g, '<span class=home-card-desc>Email inquiries and collaboration</span>');
    html = html.replace(/<meta property="og:title" content="Home">/i, '<meta property="og:title" content="Home | Ayrix">');
  }

  if (path === '/contact/index.html') {
    html = html.replace(/<a class=contact-card-link href="#contact-email">name \[at\] gmail \[dot\] com<\/a>/, '<button class="contact-card-link" type="button" data-copy-email>Copy email</button> <a class="contact-card-link" href="#contact-email" data-send-email>Send email</a><noscript>aliyanniazi370 [at] gmail [dot] com</noscript>');
  }
  if (path !== '/contact/index.html') html = html.replaceAll('href="#contact-email"', 'href="/contact/"');
  if (path === '/404.html') html = html.replace('<div class=not-found>404</div>', '<section class="not-found not-found-panel"><p class="not-found-code">404</p><h1>Command not found</h1><p>The page you requested is not in this directory.</p><p><a class="btn btn-primary" href="/">Return home</a> <a class="btn btn-ghost" href="/posts/">Browse all guides</a></p><h2>Popular guides</h2><ul><li><a href="/posts/install-ubuntu-complete-guide/">Install Ubuntu</a></li><li><a href="/posts/install-arch-linux-complete-guide/">Install Arch Linux</a></li><li><a href="/posts/github-cli-complete-guide/">GitHub CLI guide</a></li></ul></section>');
  await writeFile(file, html);

  const isPost = /^\/posts\/[^/]+\/index\.html$/.test(path) && path !== '/posts/index.html';
  if (isPost) {
    const slug = path.split('/')[2];
    const humanDate = html.match(/\b([A-Z][a-z]+ \d{1,2}, 20\d{2})\b/)?.[1];
    const date = html.match(/article:published_time" content="([^"]+)/i)?.[1]?.slice(0, 10)
      || (humanDate ? new Date(`${humanDate} UTC`).toISOString().slice(0, 10) : '');
    const descriptionText = description;
    const inferred = {
      'my-first-post': { category: 'introduction', tags: ['introduction', 'blog'] },
      'codex-cli-ubuntu-guide': { category: 'ai-tools', tags: ['codex-cli', 'ubuntu', 'linux', 'ai', 'installation'] },
      'claude-code-ubuntu-cli-guide': { category: 'ai-tools', tags: ['claude-code', 'ubuntu', 'linux', 'ai', 'installation'] },
      'codex-cli-ubuntu-openai-agent-guide': { category: 'ai-tools', tags: ['codex-cli', 'ubuntu', 'linux', 'ai', 'openai'] },
    }[slug] || {};
    const tags = [...html.matchAll(/article:tag" content="([^"]+)/gi)].map((m) => m[1].toLowerCase());
    posts.push({ slug, title: title.replace('My Firstt Post', 'My First Post').replace('— AYRIX', '— Ayrix'), description: descriptionText, date, updated: date, category: inferred.category || tags[0] || 'Guides', tags: tags.length ? tags : (inferred.tags || []), cover: html.match(/og:image" content="https:\/\/ayrix\.online\/([^"?]+)/i)?.[1] || '' });
  }
}

await mkdir(join(ROOT, 'data'), { recursive: true });
const manifest = `${JSON.stringify(posts.sort((a,b) => a.date.localeCompare(b.date)), null, 2)}\n`;
await writeFile(join(ROOT, 'data/posts.json'), manifest);
await mkdir(join(OUT, 'data'), { recursive: true });
await writeFile(join(OUT, 'data/posts.json'), manifest);
await writeFile(join(OUT, '.nojekyll'), '');
await writeFile(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://ayrix.online/sitemap.xml\n');

const urls = files.filter((f) => f.endsWith('.html') && !f.includes('/page/')).map((f) => 'https://ayrix.online/' + relative(OUT, f).replace(/\\/g, '/').replace(/index\.html$/, '')).filter((u) => !u.endsWith('/404.html'));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(OUT, 'sitemap.xml'), sitemap);
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Ayrix</title><link>https://ayrix.online/</link><description>Practical technical guides by Aliyan.</description><language>en</language>${posts.map((post) => `<item><title>${escapeXml(post.title)}</title><link>https://ayrix.online/posts/${post.slug}/</link><guid>https://ayrix.online/posts/${post.slug}/</guid><description>${escapeXml(post.description)}</description><pubDate>${post.date ? new Date(`${post.date}T00:00:00Z`).toUTCString() : ''}</pubDate></item>`).join('')}</channel></rss>\n`;
await writeFile(join(OUT, 'index.xml'), feed);
await writeFile(join(OUT, 'rss.xml'), feed);
for (const file of files.filter((path) => path.endsWith('.xml'))) {
  const xml = await readFile(file, 'utf8');
  await writeFile(file, xml.replaceAll('//localhost:1313', 'https://ayrix.online').replaceAll('aayrix.github.io', 'ayrix.online'));
}
console.log(`Built metadata for ${htmlFiles.length} pages and ${posts.length} guides.`);
