import {graphComment,graphReply} from './flow-engine';
import {sqlite,type Automation} from './db';import {meta} from './meta';import {accountId,mockMode} from './connection';
function claim(id:string,type:string,a:number){return sqlite.prepare("INSERT OR IGNORE INTO events(id,type,status,automation_id) VALUES(?,?,'processing',?)").run(id,type,a).changes>0;}
function status(id:string,s:string){sqlite.prepare('UPDATE events SET status=? WHERE id=?').run(s,id);}
async function effect(id:string,type:string,a:number,fn:()=>Promise<unknown>){if(!claim(id,type,a))return;try{await fn();status(id,'sent');}catch(e){status(id,'failed');throw e;}}
function contact(id:string,a:number,state:string,follow:string|null=null){sqlite.prepare('INSERT INTO contacts(id,automation_id,state,follow) VALUES(?,?,?,?) ON CONFLICT(id,automation_id) DO UPDATE SET state=excluded.state,follow=COALESCE(excluded.follow,contacts.follow)').run(id,a,state,follow);}
async function dm(id:string,user:string,message:string,a:number,type='dm'){await effect(id,type,a,()=>meta(`${accountId()}/messages`,{recipient:{id:user},message:{text:message}}));}
export const normalize=(s:string)=>s.normalize('NFKC').toLocaleUpperCase('tr-TR').trim();
function matches(text:string,key:string){const t=normalize(text),k=normalize(key);const i=t.indexOf(k);if(i<0)return false;const word=(c:string)=>/[\p{L}\p{N}_]/u.test(c);return (!i||!word(t[i-1]))&&(!t[i+k.length]||!word(t[i+k.length]));}
export async function processWebhook(payload:any){
 if(payload.object!=='instagram')return;
 for(const entry of payload.entry||[]){
 if(!mockMode()&&entry.id!==accountId())continue;
 for(const change of entry.changes||[]){
 const v=change.value;if(change.field!=='comments'||!v?.id||!v.from?.id||v.from.id===entry.id)continue;
 const a=sqlite.prepare('SELECT * FROM automations WHERE media_id=? AND enabled=1').get(v.media?.id||'') as Automation|undefined;
 if(!a||!matches(v.text||'',a.keyword))continue;
 if(entry.time&&Date.now()-entry.time*1000>7*86400000)continue;
 if(a.flow_json){await graphComment(a,v);continue;}
 if(!claim(`comment:${v.id}`,'comment',a.id))continue;
 try{
 const replies=a.public_replies.split('\n').map(x=>x.trim()).filter(Boolean);
 if(replies.length)await effect(`public:${v.id}`,'public',a.id,()=>meta(`${v.id}/replies`,{message:replies[Math.floor(Math.random()*replies.length)]}));
 const opening=a.opening_message.replaceAll('{keyword}',`${a.keyword} ${a.id}`);
 await effect(`private:${v.id}`,'dm',a.id,()=>meta(`${entry.id}/messages`,{recipient:{comment_id:v.id},message:{text:opening+`\nDevam etmek için: ${a.keyword} ${a.id}`}}));
 const old=sqlite.prepare('SELECT state FROM contacts WHERE id=? AND automation_id=?').get(v.from.id,a.id);
 if(!old)contact(v.from.id,a.id,'waiting_reply');status(`comment:${v.id}`,'processed');
 }catch(e){status(`comment:${v.id}`,'failed');throw e;}
 }
 for(const m of entry.messaging||[]){
 if(m.message?.is_echo)continue;if(m.timestamp&&Date.now()-m.timestamp>86400000)continue;
 if(await graphReply(m))continue;
 if(!m.message?.mid||m.message.is_echo||!m.sender?.id||!m.message.text)continue;
 if(m.timestamp&&Date.now()-m.timestamp>86400000)continue;
 const user=m.sender.id,t=normalize(m.message.text);
 const pending=sqlite.prepare("SELECT a.*,c.state FROM contacts c JOIN automations a ON a.id=c.automation_id WHERE c.id=? AND c.state<>'delivered' AND a.enabled=1 AND a.flow_json=''").all(user) as (Automation&{state:string})[];
 const candidates=pending.filter(a=>t===normalize(a.keyword)||t===normalize(`${a.keyword} ${a.id}`)||(a.state==='waiting_follow'&&(t==='TAKİP ETTİM'||t===`TAKİP ETTİM ${a.id}`)));
 if(!candidates.length)continue;
 if(candidates.length>1){await dm(`select:${m.message.mid}`,user,'Hangi Reel için devam edelim? İlgili kodu yaz:\n'+candidates.map(a=>`${a.name}: ${a.keyword} ${a.id}${a.state==='waiting_follow'?` veya TAKİP ETTİM ${a.id}`:''}`).join('\n'),0);continue;}
 const a=candidates[0];if(!claim(`message:${m.message.mid}`,'incoming_dm',a.id))continue;
 try{
 let follows:boolean|undefined;
 if(a.require_follow)try{const profile=await meta(`${user}?fields=is_user_follow_business`);if(typeof profile.is_user_follow_business==='boolean')follows=profile.is_user_follow_business;}catch{/* API context unavailable: explicit self confirmation */}
 const self=a.state==='waiting_follow'&&(t==='TAKİP ETTİM'||t===`TAKİP ETTİM ${a.id}`);
 const confirmed=!a.require_follow||follows===true||(follows===undefined&&self);
 if(confirmed){
 if(!/^https:\/\//.test(a.final_url))throw Error('Otomasyon linki eksik');
 await dm(`link:${a.id}:${user}`,user,`${a.final_message}\n${a.final_url}`,a.id,'link');contact(user,a.id,'delivered',!a.require_follow?'not_required':follows===true?'verified':'self_confirmed');
 }else{await dm(`follow:${m.message.mid}`,user,`${a.follow_message}\nTakip ettikten sonra TAKİP ETTİM ${a.id} yaz.`,a.id);contact(user,a.id,'waiting_follow');}
 status(`message:${m.message.mid}`,'processed');
 }catch(e){status(`message:${m.message.mid}`,'failed');throw e;}
 }
 }
}
