import {accessToken,mockMode,apiProvider} from './connection';
export async function metaLive(path:string,body?:unknown,overrideToken?:string,provider=apiProvider()):Promise<any>{
 const token=overrideToken||accessToken();if(!token)throw Error('Önce Instagram hesabını bağla.');
 const r=await fetch(`https://${provider==='facebook'?'graph.facebook.com':'graph.instagram.com'}/${process.env.META_API_VERSION||'v25.0'}/${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000),cache:'no-store'});
 const data=await r.json();if(!r.ok)throw Error(`Meta isteği başarısız (${r.status}, kod ${data.error?.code||'unknown'})`);return data;
}
export async function meta(path:string,body?:unknown):Promise<any>{if(mockMode())return {};return metaLive(path,body);}
