// Official API fallback for webhook delivery gaps. No browser automation or scraping.
import {sqlite,type Automation} from '../lib/db';
import {metaLive} from '../lib/meta';
import {accountId,mockMode} from '../lib/connection';
import {processWebhook} from '../lib/engine';
const started=Date.now()-15*60_000;
let running=false,lastComments=0,retryAfter=0;
async function tick(){if(running||mockMode()||Date.now()<retryAfter)return;running=true;try{
 const account=accountId();const automations=sqlite.prepare('SELECT * FROM automations WHERE enabled=1').all() as Automation[];
 if(Date.now()-lastComments>=6000){lastComments=Date.now();for(const a of automations){const comments=await metaLive(`${a.media_id}/comments?fields=id,text,from,timestamp&limit=50`);for(const c of (comments.data||[]).reverse()){const time=Date.parse(c.timestamp);if(!Number.isFinite(time)||time<started||time<Date.now()-7*86400000)continue;await processWebhook({object:'instagram',entry:[{id:account,time:Math.floor(time/1000),changes:[{field:'comments',value:{...c,media:{id:a.media_id}}}]}]});}}}
 const pending=sqlite.prepare('SELECT DISTINCT user_id FROM flow_runs').all() as {user_id:string}[];if(pending.length){const users=new Set(pending.map(r=>r.user_id));const conversations=await metaLive(`${account}/conversations?platform=instagram&fields=id,updated_time,messages.limit(10){id,message,from,created_time}&limit=30`);for(const c of conversations.data||[]){if(Date.parse(c.updated_time)<started)continue;const messages=c.messages||{data:[]};for(const m of (messages.data||[]).reverse()){const time=Date.parse(m.created_time);if(!users.has(m.from?.id)||!m.message||time<started||time<Date.now()-86400000)continue;await processWebhook({object:'instagram',entry:[{id:account,messaging:[{sender:{id:m.from.id},timestamp:time,message:{mid:m.id,text:m.message}}]}]});}}}
}catch(e){retryAfter=Date.now()+30000;console.error('Meta fallback:',e instanceof Error?e.message:'failed');}finally{running=false}}
console.log('Official Meta API fallback running DMs every 3 seconds, comments every 6 seconds.');await tick();setInterval(tick,3_000);
