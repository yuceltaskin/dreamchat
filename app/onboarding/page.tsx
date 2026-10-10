import {requireUser} from '../../lib/auth';import {Welcome} from './welcome';export default async function Onboarding(){const u=await requireUser();return <Welcome name={u.name}/>}
