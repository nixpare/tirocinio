import express from 'express';
import path from 'path';
import ProxyServer from 'http-proxy';
import morgan from 'morgan';
import { devMode } from './main';
import { getAllBodies, getAllBones, getBody, getBone, updateBodyBone, updateBodyBones } from './mongodb';

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

	// TODO: replace with an insert for new bones
	app.put('/api/bodies/:id/bones', updateBodyBones)
	app.put('/api/bodies/:id/bones/:boneId', updateBodyBone)
}
