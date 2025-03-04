import express from "express";
import dotenv from "dotenv";
import { setupRoutes } from "./routes.ts";

dotenv.config();

const app = express();
const port = process.env.APP_HTTP_PORT ? Number.parseInt(process.env.APP_HTTP_PORT) : 8080;

setupRoutes(app)

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});