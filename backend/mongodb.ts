import mongoDB, { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { AnatomStruct, Bone, BoneData } from "../models/AnatomStruct";
import { Body } from "../models/Body";
import { services } from "./main";

export async function connectToMongoDB(): Promise<{
	db: mongoDB.Db
	anatomStructs: mongoDB.Collection<AnatomStruct>
	bodies: mongoDB.Collection<Body>
}> {
	if (!process.env.DB_CONN_STRING) throw new Error("DB_CONN_STRING env variable not found");
	if (!process.env.DB_CONN_STRING) throw new Error("DB_CONN_STRING env variable not found");

	const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
	await client.connect();

	const db = client.db(process.env.DB_NAME);

	console.log('Successfully connected to MongoDB');
	return {
		db: db,
		anatomStructs: db.collection('anatom-struct'),
		bodies: db.collection('body')
	}
}

export async function getAllBones(_: Request, res: Response) {
	try {
		const games = await services.anatomStructs.find({
			type: 'bone'
		}).toArray();

		res.status(200).send(games);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getBone(req: Request, res: Response) {
	const id = req?.params.id;

	try {
		const game = await services.anatomStructs.findOne({
			_id: new ObjectId(id),
			type: 'bone'
		});

		if (!game) throw new Error("not found");
		res.status(200).send(game);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}

export async function getAllBodies(_: Request, res: Response) {
	try {
		const games = await services.bodies.find({}).toArray();

		res.status(200).send(games);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getBody(req: Request, res: Response) {
	const id = req?.params.id;

	try {
		// TODO: discuss about "_id" or "name"-like primary keys usage
		/* const game = await services.bodies.findOne({
			_id: new ObjectId(id)
		}); */
		const game = await services.bodies.findOne({
			"generals.name": id
		});

		if (!game) throw new Error("not found");
		res.status(200).send(game);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}

export async function updateBodyBones(req: Request, res: Response) {
	const id = req.params.id;
	
	try {
		const bones = req.body as Record<string, BoneData>;
		
		// TODO: discuss about "_id" or "name"-like primary keys usage
		/* const game = await services.bodies.findOne({
			_id: new ObjectId(id)
		}); */
		const result = await services.bodies.updateOne(
			{
				"generals.name": id
			},
			{
				$set: {
					"bones": bones
				}
			}
		);

		result
			? res.status(200).send(`Successfully updated body ${id}`)
			: res.status(304).send(`Body "${id}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}

export async function updateBodyBone(req: Request, res: Response) {
	const id = req.params.id;
	const boneId = req.params.boneId;

	try {
		const { bone, breadcrumb } = req.body as {
			bone: Bone,
			breadcrumb: string[]
		};
		if (!bone || !breadcrumb) throw new Error("invalid payload provided")

		console.log(breadcrumb)

		// TODO: discuss about "_id" or "name"-like primary keys usage
		/* const game = await services.bodies.findOne({
			_id: new ObjectId(id)
		}); */
		const result = await services.bodies.updateOne(
			{
				"generals.name": id
			},
			{
				$set: {
					[`bones.${boneId}`]: bone
				}
			}
		);

		result
			? res.status(200).send(`Successfully updated body ${id}`)
			: res.status(304).send(`Body "${id}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}
