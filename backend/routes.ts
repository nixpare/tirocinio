import express from 'express';
import path from 'path';
import ProxyServer from 'http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import { devMode } from './main';
import { getAllBodies, getAllBones, getBody, getBone, updateBodyBone, updateBodyBones } from './mongodb';

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
	app.get('/api/bones', getAllBones)
	app.get('/api/bones/:id', getBone)

	//
	// Body
	//
	app.get('/api/bodies', getAllBodies)
	app.get('/api/bodies/:id', getBody)

	//
	// CMS Reverse Proxy
	//

	/* app.get('/cms/:path(*)', async (req, res) => {
		const path = req.params.path;
		const query = req.url.split('?')[1] || '';
		const target = `http://labanof-backoffice.islab.di.unimi.it/${path}${query ? '?' + query : ''}`;

		console.log(`[Proxy] → ${target}`);

		const resp = await fetch(target)
			.catch((err: Error) => console.error(`Reverse Proxy error: ${err.message}`))

		if (!resp) {
			res.status(502).send('Reverse Proxy error')
			return;
		}
		
		if (!resp.ok) {
			const message = `Reverse Proxy error: ${await resp.text() }`
			console.error(message)
			res.status(502).send(message)
			return
		}

		res.setHeaders(resp.headers)

		res.status(resp.status).send(await resp.text());
	}); */

	app.use('/cms', createProxyMiddleware({
		target: 'http://labanof-backoffice.islab.di.unimi.it',     // backend HTTP non sicuro
		changeOrigin: true,
		pathRewrite: {
			'^/cms': '',                // riscrive /cms/abc → /api/abc
		},
		on: {
			proxyReq: (proxyReq, req, _) => {
				// facoltativo: puoi loggare o modificare le intestazioni
				console.log(`[Proxy] ${req.method} ${req.url} → ${proxyReq.path}`);
			}
		}
	}));

	// TODO: replace with an insert for new bones
	app.put('/api/bodies/:id/bones', updateBodyBones)
	app.put('/api/bodies/:id/bones/:boneId', updateBodyBone)
}
