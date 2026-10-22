import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {paths,render} from '../.ssr-build/prerender.js';
const origin=new URL(process.env.SITE_URL||'https://chornovil.com').origin;
const indexable=process.env.VERCEL_ENV!=='preview'&&process.env.SEO_NOINDEX!=='1'&&!['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname);
const titles=new Set();
let articleCount=0;
for(const url of paths){const page=render(url),file=url==='/'?'dist/index.html':path.join('dist',url,'index.html');const html=await readFile(file,'utf8');assert(html.includes(`<html lang="${page.lang}"`),`Wrong language: ${url}`);assert(html.includes(`rel="canonical" href="${origin+page.canonical}"`),`Wrong canonical: ${url}`);
assert(html.includes(`hreflang="${page.lang==='uk'?'en':'uk'}" href="${origin+page.other}"`),`Wrong language counterpart: ${url}`);
assert(html.includes(`hreflang="x-default" href="${origin+(page.lang==='uk'?page.canonical:page.other)}"`),`Wrong default language: ${url}`);
assert.equal((html.match(/<meta name="description"/g)||[]).length,1,`Duplicate description: ${url}`);
assert.equal((html.match(/rel="canonical"/g)||[]).length,1,`Duplicate canonical: ${url}`);
const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(title,`No title: ${url}`);if(url!=='/'){assert(!titles.has(title),`Duplicate title: ${url}`);titles.add(title)}
const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]||'null');assert(schema?.['@graph']?.some(n=>n['@type']==='Person'),`Missing person schema: ${url}`);
assert(html.includes(`content="${page.missing||!indexable?'noindex,follow':'index,follow,max-image-preview:large'}"`),`Wrong indexing directive: ${url}`);assert(html.includes('hreflang="uk"')&&html.includes('hreflang="en"'),`Missing alternates: ${url}`);assert(html.includes('application/ld+json'),`Missing schema: ${url}`);assert(html.includes('<h1'),`No prerendered heading: ${url}`);if(page.article){articleCount++;assert(html.includes(page.article.sections[0].text[page.lang]),`Article body absent: ${url}`);assert(html.includes('id="article-sources"'),`No sources: ${url}`)}for(const match of html.matchAll(/href="(\/[^"?#]*)/g)){const href=match[1];if(href.startsWith('//'))continue;const target=href.endsWith('/')?path.join('dist',href,'index.html'):path.join('dist',href);await access(target).catch(()=>{throw Error(`Broken built link ${href} in ${url}`)})}}
assert.equal(articleCount,18);const robots=await readFile('dist/robots.txt','utf8');assert(robots.includes(indexable?'Allow: /':'Disallow: /'));const sitemap=await readFile('dist/sitemap.xml','utf8');
assert(!sitemap.includes('/404/'),'404 must not appear in sitemap');
assert.equal((sitemap.match(/<loc>/g)||[]).length,22);
for(const url of paths.filter(p=>p!=='/'&&p!=='/404/'))assert(sitemap.includes(`<loc>${origin+url}</loc>`),`Sitemap missing ${url}`);
console.log(`Verified ${paths.length} HTML routes, ${articleCount} complete articles, local links, language metadata and robots.`);
