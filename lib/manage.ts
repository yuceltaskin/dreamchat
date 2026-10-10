import {validateFlow} from './flow';
import {sqlite, type Automation} from './db';
export function saveAutomation(form:FormData){
 const read=(k:string,max=1000)=>{const v=String(form.get(k)||'').trim();if(v.length>max)throw Error('Alan çok uzun: '+k);return v;};
 const id=Number(read('id')),name=read('name',120),media=read('media_id',100),keyword=read('keyword',60),url=read('final_url',2000),reel=read('reel_url',2000);
 if(!name||!media||!keyword)throw Error('Ad, Reel ve keyword gerekli.');
 if(!/^[\p{L}\p{N} _-]+$/u.test(keyword))throw Error('Keyword harf, sayı, boşluk, tire içerebilir.');
 const rawFlow=read('flow_json',200000);
 const draftFlow=rawFlow?validateFlow(rawFlow,true):null;
 const complete=!!url&&(!draftFlow||draftFlow.nodes.filter(n=>n.type==='link').every(n=>!!n.url?.trim()));
 const enabled=form.get('enabled')==='on'&&complete;
 if(url||enabled)try{if(new URL(url).protocol!=='https:')throw Error();}catch{throw Error('Prompt bağlantısı hatalı. https:// ile başlayan bir adres gir.');}
 if(reel)try{const u=new URL(reel);if(u.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(u.hostname))throw Error();}catch{throw Error('Geçerli bir Instagram Reel bağlantısı gir.');}
 const duplicate=sqlite.prepare('SELECT id FROM automations WHERE media_id=? AND id<>?').get(media,id||0);if(duplicate)throw Error('Bu Reel için zaten otomasyon var; mevcut otomasyonu düzenle.');
 const opening=read('opening_message'),final=read('final_message'),follow=read('follow_message'),replies=read('public_replies',100000);
 if(!opening||!final||!follow||!replies)throw Error('Mesaj alanlarını doldur.');
 const flow=rawFlow?JSON.stringify(validateFlow(rawFlow,!enabled)):'';
 const data=[name,media,reel,keyword,replies,opening,follow,final,url,form.get('require_follow')==='on'?1:0,enabled?1:0,flow];
 if(id){const old=sqlite.prepare('SELECT * FROM automations WHERE id=?').get(id) as Automation|undefined;if(!old)throw Error('Otomasyon bulunamadı.');if(old.media_id!==media&&sqlite.prepare('SELECT id FROM events WHERE automation_id=? LIMIT 1').get(id))throw Error('Verisi olan otomasyonun Reel’i değiştirilemez. Yeni otomasyon oluştur.');sqlite.prepare('UPDATE automations SET name=?,media_id=?,reel_url=?,keyword=?,public_replies=?,opening_message=?,follow_message=?,final_message=?,final_url=?,require_follow=?,enabled=?,flow_json=? WHERE id=?').run(...data,id);return id;}
 return Number(sqlite.prepare('INSERT INTO automations(name,media_id,reel_url,keyword,public_replies,opening_message,follow_message,final_message,final_url,require_follow,enabled,flow_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(...data).lastInsertRowid);
}
export function toggleAutomation(id:number){const a=sqlite.prepare('SELECT * FROM automations WHERE id=?').get(id) as Automation|undefined;if(!a)throw Error('Otomasyon bulunamadı.');if(!a.enabled&&(!a.media_id||!/^https:\/\//.test(a.final_url)))throw Error('Önce Reel ve gönderilecek linki tamamla.');if(!a.enabled&&a.flow_json)validateFlow(a.flow_json);sqlite.prepare('UPDATE automations SET enabled=? WHERE id=?').run(a.enabled?0:1,id);}
