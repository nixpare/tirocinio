import mongoDB from "mongodb";
import { Request, Response } from "express";
import { AnatomStruct, AnatomStructData, AnatomStructType } from "../models/AnatomStruct";
import { anatomTypeToBodyField, Body } from "../models/Body";
import { services } from "./main";

export async function connectToMongoDB(): Promise<{
	db: mongoDB.Db
	anatomStructs: mongoDB.Collection<AnatomStruct>
	bodies: mongoDB.Collection<Body>
}> {
	if (!process.env.MONGO_URL) throw new Error("MONGO_URL env variable not found");
	if (!process.env.MONGO_DB_NAME) throw new Error("MONGO_DB_NAME env variable not found");

	const client = new mongoDB.MongoClient(process.env.MONGO_URL);
	await client.connect();

	const db = client.db(process.env.MONGO_DB_NAME);

	console.log('Successfully connected to MongoDB');
	return {
		db: db,
		anatomStructs: db.collection('anatom-struct'),
		bodies: db.collection('body')
	}
}

export type FilteredAnatomStruct = Pick<AnatomStruct, '_id' | 'type' | 'name'>

export async function getAnatomStructs(req: Request<{ anatomType: AnatomStructType }>, res: Response) {
	try {
		const bones = await services.anatomStructs
			.find({ type: req.params.anatomType })
			.project({ type: 1, name: 1 })
			.toArray();

		res.status(200).send(bones);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getAnatomStruct(req: Request<{ anatomType: AnatomStructType, anatomName: string }>, res: Response) {
	try {
		const bone = await services.anatomStructs.findOne({
			type: req.params.anatomType,
			name: req.params.anatomName
		});

		if (!bone) throw new Error("not found");
		res.status(200).send(bone);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching anamtom struct "${req.params.anatomName}": ${err.message}`);
	}
}

export async function saveAnatomStruct(req: Request<{}, any, AnatomStruct>, res: Response) {
	const anatom = req.body;

	try {
		const result = await services.anatomStructs.replaceOne(
			{ name: anatom.name },
			anatom,
			{ upsert: true }
		);

		result
			? res.status(200).send(`Successfully updated anatom struct ${anatom.name}`)
			: res.status(304).send(`Anatom struct "${anatom.name}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to update anatom struct "${anatom.name}": ${err.message}`);
	}
}

export type FilteredBody = Pick<Body, '_id' | 'generals' | 'updatedAt'>

export async function getBodies(_: Request, res: Response) {
	try {
		const bodies = await services.bodies
			.find({})
			.project<FilteredBody>({ generals: 1, updatedAt: 1 })
			.toArray();

		res.status(200).send(bodies);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getBody(req: Request<{ bodyName: string }>, res: Response) {
	try {
		const body = await services.bodies.findOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": req.params.bodyName
		});

		if (!body) throw new Error("not found");
		res.status(200).send(body);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching body "${req.params.bodyName}": ${err.message}`);
	}
}

export async function addBody(req: Request<{}, any, Body>, res: Response) {
	const body = req.body;

	try {
		const result = await services.bodies.insertOne(body);

		result
			? res.status(200).send(`Successfully added body ${body.generals.name}`)
			: res.status(304).send(`Body "${body.generals.name}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to insert body "${body.generals.name}": ${err.message}`);
	}
}

export async function updateBodyAnatomStructs(req: Request<
	{ bodyName: string, anatomType: AnatomStructType },
	any,
	Record<string, AnatomStructData>
>, res: Response) {
	const anatoms = req.body;
	const anatomKey = anatomTypeToBodyField(req.params.anatomType)

	try {


		const result = await services.bodies.updateOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": req.params.bodyName
		}, {
			$set: {
				[anatomKey as string]: anatoms
			}
		});

		result
			? res.status(200).send(`Successfully updated body ${req.params.bodyName}`)
			: res.status(304).send(`Body "${req.params.bodyName}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to update body "${req.params.bodyName}" anatoms "${anatomKey}": ${err.message}`);
	}
}

export async function updateBodyAnatomStruct(req: Request<
	{ bodyName: string, anatomType: AnatomStructType, anatomName: string },
	any,
	{ payload: any, breadcrumb: string[] }
>, res: Response) {
	try {
		if (!req.body.payload || !req.body.breadcrumb) throw new Error("invalid payload provided")

		const anatomKey = anatomTypeToBodyField(req.params.anatomType)
		const query = [anatomKey, req.params.anatomName, ...req.body.breadcrumb].join('.');

		const result = await services.bodies.updateOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": req.params.bodyName
		}, {
			$set: {
				[query]: req.body.payload
			}
		});

		result
			? res.status(200).send(`Successfully updated body ${req.params.bodyName}`)
			: res.status(304).send(`Body "${req.params.bodyName}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.bodyName}": ${err.message}`);
	}
}
