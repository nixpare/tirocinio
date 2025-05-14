import express from 'express';
import path from 'path';
import ProxyServer from 'http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import { devMode } from './main';
import { getAnatomStructs, getBodies, getAnatomStruct, getBody, updateBodyAnatomStruct, updateBodyAnatomStructs, addBody } from './mongodb';

export function setupRoutes(app: express.Express, proxy: ProxyServer) {
	setupCommonRoutes(app);
	devMode ? setupDevRoutes(app, proxy) : setupProdRoutes(app);
}

function setupDevRoutes(app: express.Express, proxy: ProxyServer) {
	app.get('*', (req, res) => {
		proxy.web(req, res);
	});
}

function setupProdRoutes(app: express.Express) {
	const publicPath = path.join(import.meta.dirname, '../frontend/dist')

	app.use(express.static(publicPath));
	app.get('*', (_, res) => {
		res.sendFile(path.join(publicPath, 'index.html'));
	});
}

function setupCommonRoutes(app: express.Express) {
	app.use(morgan('tiny'));
	app.use(express.json());

	//
	// Bones
	//
	app.get('/api/anatoms/:anatomType', getAnatomStructs)
	app.get('/api/anatoms/:anatomType/:anatomName', getAnatomStruct)

	//
	// Body
	//
	app.get('/api/bodies', getBodies)
	app.get('/api/bodies/:bodyName', getBody)

	app.post('/api/bodies', addBody)

	app.put('/api/bodies/:bodyName/anatoms/:anatomType', updateBodyAnatomStructs)
	app.put('/api/bodies/:bodyName/anatoms/:anatomType/:anatomName', updateBodyAnatomStruct)

	//
	// CMS Reverse Proxy
	//

	app.use('/cms', createProxyMiddleware({
		target: 'http://labanof-backoffice.islab.di.unimi.it',
		changeOrigin: true,
		pathRewrite: {
			'^/cms': '', // replace /cms/* → /api/*
		},
		on: {
			proxyReq: (proxyReq, req, _) => {
				console.log(`[Proxy] ${req.method} ${req.url} → ${proxyReq.path}`);
			}
		}
	}));
}
