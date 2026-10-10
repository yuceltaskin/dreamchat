import {createHmac,timingSafeEqual} from 'node:crypto';
import {mockMode} from '../../../../lib/connection';
import {processWebhook} from '../../../../lib/engine';
export const runtime='nodejs';
let queue=Promise.resolve();
export async function GET(req:Request){const q=new URL(req.url).searchParams;return q.get('hub.mode')==='subscribe'&&!!process.env.WEBHOOK_VERIFY_TOKEN&&q.get('hub.verify_token')===process.env.WEBHOOK_VERIFY_TOKEN?new Response(q.get('hub.challenge')):new Response('Forbidden',{status:403});}
export async function POST(req:Request){
 const raw=await req.text();if(raw.length>1_000_000)return new Response('Too large',{status:413});
 const secret=mockMode()?process.env.LOCAL_TEST_SIGNING_SECRET:process.env.META_APP_SECRET;if(!secret)return new Response('Webhook not configured',{status:503});
 const expected=Buffer.from('sha256='+createHmac('sha256',secret).update(raw).digest('hex'));const got=Buffer.from(req.headers.get('x-hub-signature-256')||'');
 if(got.length!==expected.length||!timingSafeEqual(got,expected))return new Response('Forbidden',{status:403});
 let payload;try{payload=JSON.parse(raw);}catch{return new Response('Invalid JSON',{status:400});}
 const job=queue.then(()=>processWebhook(payload));queue=job.catch(()=>{});
 try{await job;return Response.json({ok:true});}catch{return Response.json({error:'Processing failed; inspect failed events locally. Automatic retries are blocked to prevent duplicate sends.'},{status:500});}
}
