import http from 'node:http';
import {readFileSync} from 'node:fs';
const privacy=readFileSync(new URL('./public/privacy.html',import.meta.url));
http.createServer((req,res)=>{
 const path=req.url?.split('?')[0];
 if(path==='/privacy'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(privacy);return;}
 if(!((path==='/api/meta/webhook'&&['GET','POST'].includes(req.method))||(path==='/api/instagram/callback'&&req.method==='GET'))){res.writeHead(404);res.end();return;}
 const upstream=http.request({hostname:'127.0.0.1',port:3000,path:req.url,method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res);});
 upstream.on('error',()=>{res.writeHead(502);res.end('Local app unavailable');});req.pipe(upstream);
}).listen(3001,'127.0.0.1',()=>console.log('Webhook and OAuth callback proxy on 127.0.0.1:3001'));
