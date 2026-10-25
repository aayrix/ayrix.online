import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('../public/', import.meta.url).pathname;
const files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p); else files.push(p);
  }
}
await walk(ROOT);
const html = files.filter((p) => p.endsWith('.html'));
const known = new Set(files.map((p) => '/' + relative(ROOT, p).replace(/\\/g, '/')));
const errors = [];
for (const file of html) {
  const source = await readFile(file, 'utf8');
  const label = relative(ROOT, file);
  const pageText = source.replace(/<script\s+type=["']?application\/ld\+json["']?>[\s\S]*?<\/script>/gi, '').replace(/<pre\b[\s\S]*?<\/pre>/gi, '');
  if (/\{\{|\{year\}/i.test(pageText)) errors.push(`${label}: unresolved template placeholder`);
  if (!/<title>[^<]+\| Ayrix<\/title>/i.test(source)) errors.push(`${label}: missing branded title`);
  if (!/<meta\s+name="description"\s+content="[^"]{20,}"/i.test(source)) errors.push(`${label}: missing description`);
  if (/<meta\s+name=generator/i.test(source)) errors.push(`${label}: generator metadata remains`);
  if (/aliyanniazi370@gmail\.com|mailto:name \[at\]/i.test(source)) errors.push(`${label}: email is exposed in source`);
  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${label}: duplicate IDs`);
  for (const m of source.matchAll(/<img\b[^>]*>/gi)) if (!/\balt\s*=/.test(m[0])) errors.push(`${label}: image missing alt text`);
  for (const m of source.matchAll(/\b(?:href|src)=["'](\/[A-Za-z0-9_./-]+)["']/g)) {
    let target = decodeURIComponent(m[1]);
    if (target === '/') target = '/index.html';
    else if (target.endsWith('/')) target += 'index.html';
    if (!known.has(target) && !target.match(/\.(?:xml|txt|svg|png|jpg|webp|avif|css|js)$/)) errors.push(`${label}: missing local target ${m[1]}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Static checks passed for ${html.length} HTML pages and ${files.length} published files.`);
