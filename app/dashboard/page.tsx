import {requireUser} from '../../lib/auth';
import {connectionInfo,mockMode} from '../../lib/connection';import {oauthConfig} from '../../lib/oauth';
import {sqlite,type Automation} from '../../lib/db';import {Studio} from './studio';import type {Reel} from './editor';
export const dynamic='force-dynamic';
export default async function Dashboard({searchParams}:{searchParams:Promise<{reel?:string;new?:string;view?:string;connection?:string}>}){
 const user=await requireUser();const profile=JSON.parse(user.onboarding);const query=await searchParams;
 const automations=sqlite.prepare(`SELECT a.*,
 (SELECT COUNT(*) FROM events e WHERE e.automation_id=a.id AND e.type='comment') comments,
 (SELECT COUNT(*) FROM events e WHERE e.automation_id=a.id AND e.type='link' AND e.status='sent') links,
 (SELECT COUNT(*) FROM contacts c WHERE c.automation_id=a.id) people
 FROM automations a ORDER BY a.id DESC`).all() as (Automation&{comments:number;links:number;people:number})[];
 const reels=sqlite.prepare('SELECT id,caption,permalink FROM reels ORDER BY published_at DESC').all() as Reel[];
 const contacts=sqlite.prepare('SELECT c.*,a.name FROM contacts c LEFT JOIN automations a ON a.id=c.automation_id ORDER BY c.rowid DESC LIMIT 200').all() as {id:string;automation_id:number;state:string;follow:string|null;name:string}[];
 const events=sqlite.prepare('SELECT e.*,a.name FROM events e LEFT JOIN automations a ON a.id=e.automation_id ORDER BY e.rowid DESC LIMIT 100').all() as {id:string;automation_id:number;type:string;status:string;created_at:string;name:string}[];
 const count=(q:string)=>(sqlite.prepare(q).get() as {n:number}).n;
 const stats={comments:count("SELECT COUNT(*) n FROM events WHERE type='comment'"),dms:count("SELECT COUNT(*) n FROM events WHERE type IN ('dm','link') AND status='sent'"),waiting:count("SELECT COUNT(*) n FROM contacts WHERE state='waiting_follow'"),verified:count("SELECT COUNT(*) n FROM contacts WHERE follow='verified'"),confirmed:count("SELECT COUNT(*) n FROM contacts WHERE follow='self_confirmed'"),links:count("SELECT COUNT(*) n FROM events WHERE type='link' AND status='sent'")};
 return <Studio ownerName={user.name} workspaceName={profile.workspace||user.name+'’ın çalışma alanı'} automations={automations} reels={reels} contacts={contacts} events={events} stats={stats} query={query} mock={mockMode()} connected={connectionInfo().connected} connection={connectionInfo()} oauthReady={!!oauthConfig()} redirectUri={process.env.INSTAGRAM_REDIRECT_URI||''}/>;
}
