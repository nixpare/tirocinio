import express from "express";
import ProxyServer from "http-proxy";
import { createServer } from 'http';
import dotenv from "dotenv";
import { setupRoutes } from "./routes.ts";

dotenv.config();
export const devMode = process.argv.includes('dev');

const app = express();
const proxy = ProxyServer.createProxyServer({ target: 'http://localhost:3000', ws: true });
const port = process.env.APP_HTTP_PORT ? Number.parseInt(process.env.APP_HTTP_PORT) : 8080;
const server = createServer(app);

setupRoutes(app, proxy);
devMode && server.on('upgrade', (req, sock, head) => {
	console.log('proxy ws');
	proxy.ws(req, sock, head);
});

proxy.on('error', (e) => {
	console.log(`Proxy error: ${e.message}`);
});
server.on('error', (e) => {
	console.log(`Server error: ${e.message}`);
});

server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
