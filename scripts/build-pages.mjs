import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

// Export only the public showcase. Auth, SQLite and Meta endpoints stay server-side.
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const build=join(root,'.pages-build');
const base='/dreamchat';
await rm(build,{recursive:true,force:true});
await mkdir(join(build,'app'),{recursive:true});
const files=['app/layout.tsx','app/page.tsx','app/globals.css','app/product.css','app/brand.css','app/icon.svg','app/components/brand.tsx','app/components/landing.tsx','app/dashboard/icons.tsx','app/demo/page.tsx','app/demo/preview.tsx','app/brand/page.tsx'];
function paths(source){source=source.replace(/(['"])(\/(?:demo|signup|login|dashboard|brand|privacy)\/?)\1/g,(_,quote,path)=>quote+base+path.replace(/\/$/,'')+'/'+quote);return source.replace(/href="\/([^"\s]*)"/g,(_,path)=>{if(path.startsWith('dreamchat/'))return `href="/${path}"`;const target=path&&!path.includes('.')&&!path.includes('#')&&!path.endsWith('/')?path+'/':path;return `href="${base}/${target}"`})}
for(const file of files){const target=join(build,file);await mkdir(resolve(target,'..'),{recursive:true});await writeFile(target,paths(await readFile(join(root,file),'utf8')))}
await cp(join(root,'public'),join(build,'public'),{recursive:true});
await writeFile(join(build,'package.json'),await readFile(join(root,'package.json')));
await writeFile(join(build,'tsconfig.json'),await readFile(join(root,'tsconfig.json')));
await writeFile(join(build,'next.config.mjs'),`export default {output:'export',basePath:${JSON.stringify(base)},trailingSlash:true,images:{unoptimized:true},turbopack:{root:${JSON.stringify(root)}}};\n`);
const welcome=`import {Brand,ChatBloom} from '../components/brand';export default function Welcome(){return <main className="brand-guide"><div className="bg-wrap"><Brand/><section className="bg-cover" style={{marginTop:40}}><span className="ds-label">DREAMCHAT / PAYLAŞILABİLİR ÜRÜN DEMOSU</span><h1 style={{fontSize:60}}>Birlikte<br/><em>deneyelim.</em></h1><p>Bu paylaşım sürümünde örnek bir çalışma alanını keşfedebilirsin. Gerçek Instagram bağlantısı ve yönetici hesabı, sunucuda çalışan uygulamada kullanılabilir.</p><ChatBloom/></section><a className="ds-btn" href="${base}/demo/" style={{marginTop:30}}>Demo alanını aç ↗</a> <a className="ds-btn outline" href="${base}/" style={{marginTop:30}}>Ana sayfa</a></div></main>}`;
for(const route of ['signup','login','dashboard']){await mkdir(join(build,'app',route),{recursive:true});await writeFile(join(build,'app',route,'page.tsx'),welcome)}
await mkdir(join(build,'app/privacy'),{recursive:true});
await writeFile(join(build,'app/privacy/page.tsx'),`import {Brand} from '../components/brand';export default function Privacy(){return <main className="policy-page"><Brand/><h1>Gizlilik, açık ve sade.</h1><p>Bu site Dreamchat’in paylaşılabilir ürün demosudur. Instagram’a bağlanmaz, mesaj göndermez, kullanıcı hesabı oluşturmaz ve ödeme almaz. Etkileşimler tarayıcı belleğinde örnek verilerle çalışır.</p><h2>Barındırma</h2><p>Site GitHub Pages üzerinde sunulur. GitHub, hizmetin çalışması için standart erişim kayıtları işleyebilir. Bu demoya ayrıca pazarlama çerezi veya analitik sağlayıcısı eklenmemiştir.</p><h2>Yerel uygulama</h2><p>Gerçek Instagram bağlantısı ve yönetici işlevleri ayrı, sunucuda çalışan Next.js uygulamasına aittir. Yerel uygulamanın gizli anahtarları, kullanıcıları ve veritabanı bu siteye yüklenmez.</p><a className="dc-button light" href="${base}/">← Ana sayfa</a></main>}`);
const result=spawnSync(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'build',build],{cwd:root,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
if(result.status!==0)process.exit(result.status||1);
await writeFile(join(build,'out','.nojekyll'),'');
console.log('GitHub Pages export ready: .pages-build/out');
