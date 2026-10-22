import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {paths,render} from '../.ssr-build/prerender.js';
const base=await readFile('dist/index.html','utf8');
// The production origin is explicit and shared by every canonical, schema and sitemap.
const origin=new URL(process.env.SITE_URL||'https://chornovil.com').origin;
const preview=process.env.VERCEL_ENV==='preview'||process.env.SEO_NOINDEX==='1';
const publicHost=!preview&&!['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname);
if(publicHost&&!origin.startsWith('https://'))throw new Error('Production SITE_URL must use HTTPS');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const pagePath of paths){const r=render(pagePath);const url=origin+r.canonical;const uk=r.lang==='uk'?r.canonical:r.other;const en=r.lang==='en'?r.canonical:r.other;const person={'@type':'Person','@id':origin+'/#chornovil',name:'В’ячеслав Максимович Чорновіл',alternateName:['В’ячеслав Чорновіл','Viacheslav Chornovil','Vyacheslav Chornovil'],birthDate:'1937-12-24',deathDate:'1999-03-25',image:origin+'/images/chornovil-uinp.jpeg',description:'Український журналіст, дисидент, політичний діяч.',sameAs:['https://uinp.gov.ua/istorychnyy-kalendar/gruden/24/1937-narodyvsya-vyacheslav-chornovil']};
const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Чорновіл — живий архів',inLanguage:['uk','en'],about:{'@id':person['@id']}};
const page={'@type':r.article?'Article':r.canonical.includes('/archive/')?'CollectionPage':'WebPage','@id':url+'#page',url,name:r.title,description:r.description,inLanguage:r.lang,isPartOf:{'@id':website['@id']},about:{'@id':person['@id']},...(r.article?{headline:r.article.title[r.lang],mainEntityOfPage:url,image:origin+'/images/'+r.article.image,citation:r.sourceUrls}:{}),...(r.canonical==='/uk/'||r.canonical==='/en/'?{mainEntity:{'@id':person['@id']}}:{})};
const crumbs=[{name:r.lang==='uk'?'Чорновіл':'Chornovil',item:origin+`/${r.lang}/`}];
if(r.canonical.includes('/archive/'))crumbs.push({name:r.lang==='uk'?'Архів':'Archive',item:origin+`/${r.lang}/archive/`});
if(r.article)crumbs.push({name:r.title,item:url});
const schema={'@context':'https://schema.org','@graph':[website,person,page,...(crumbs.length>1?[{'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))}]:[])]};
const pageTitle=r.article||r.canonical.includes('/archive/')?r.title+' | '+(r.lang==='uk'?'Чорновіл':'Chornovil'):r.title;
const meta=`<link rel="canonical" href="${esc(url)}"/><link rel="alternate" hreflang="uk" href="${esc(origin+uk)}"/><link rel="alternate" hreflang="en" href="${esc(origin+en)}"/><link rel="alternate" hreflang="x-default" href="${esc(origin+uk)}"/><meta property="og:site_name" content="CHORNOVIL — living archive"/><meta property="og:locale:alternate" content="${r.lang==='uk'?'en_GB':'uk_UA'}"/><meta property="og:type" content="${r.article?'article':'website'}"/><meta property="og:title" content="${esc(r.title)}"/><meta property="og:description" content="${esc(r.description)}"/><meta property="og:url" content="${esc(url)}"/><meta property="og:locale" content="${r.lang==='uk'?'uk_UA':'en_GB'}"/><meta property="og:image" content="${esc(origin+'/images/'+(r.article?.image||'chornovil-uinp.jpeg'))}"/><meta name="twitter:card" content="summary_large_image"/><meta name="robots" content="${r.missing||!publicHost?'noindex,follow':'index,follow,max-image-preview:large'}"/><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
let html=base.replace(/<html lang="[^"]*"/,`<html lang="${r.lang}"`).replace(/<title>.*?<\/title>/,`<title>${esc(pageTitle)}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(r.description)}"/>`).replace('</head>',meta+'</head>').replace('<div id="root"></div>',`<div id="root">${r.html}</div>`);
const directory=pagePath==='/'?'dist':path.join('dist',pagePath);await mkdir(directory,{recursive:true});await writeFile(path.join(directory,'index.html'),html);if(r.missing)await writeFile('dist/404.html',html);
}
const pages=paths.filter(p=>p!=='/'&&p!=='/404/');await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${esc(origin+p)}</loc></url>`).join('')}</urlset>`);await writeFile('dist/robots.txt',publicHost?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
console.log(`Prerendered ${paths.length} routes in Ukrainian and English. ${publicHost?'Indexing enabled for '+origin:'Preview indexing disabled.'}`);
