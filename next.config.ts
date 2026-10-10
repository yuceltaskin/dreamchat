import type {NextConfig} from 'next';
const config:NextConfig={turbopack:{root:process.cwd()},logging:{fetches:{fullUrl:false},incomingRequests:{ignore:[/\/api\/instagram\/(callback|complete)/,/\/api\/meta\/webhook/]}}};export default config;
