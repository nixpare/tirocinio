import express from 'express';
import path from 'path';
import { devMode } from './main';
import ProxyServer from 'http-proxy';
import morgan from 'morgan';

export function setupRoutes(app: express.Express, proxy: ProxyServer) {
	setupCommonRoutes(app);
    devMode ? setupDevRoutes(app, proxy) : setupProdRoutes(app);
}

function setupDevRoutes(app: express.Express, proxy: ProxyServer) {
	app.get('*', (req, res) => {
		proxy.web(req, res, {});
	});
}

function setupProdRoutes(app: express.Express) {
	app.use(express.static(path.join(__dirname, '../dist')));
}

function setupCommonRoutes(app: express.Express) {
	app.use(morgan('combined'));
}
