import express from 'express';
import path from 'path';

const devMode = process.argv.includes('dev');

export function setupRoutes(app: express.Express) {
	setupCommonRoutes(app);
    devMode ? setupDevRoutes(app) : setupProdRoutes(app);
}

function setupDevRoutes(app: express.Express) {
	app.get('*', /* proxy('http://localhost:3000') */);
}

function setupProdRoutes(app: express.Express) {
	app.use(express.static(path.join(__dirname, '../dist')));
}

function setupCommonRoutes(app: express.Express) {

}