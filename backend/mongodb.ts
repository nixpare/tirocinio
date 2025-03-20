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

export async function getAllBones(_: Request, res: Response) {
	try {
		const bones = await services.anatomStructs.find({
			type: 'bone'
		}).toArray();

		res.status(200).send(bones);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getBone(req: Request, res: Response) {
	const id = req?.params.id;

	try {
		const bone = await services.anatomStructs.findOne({
			_id: new ObjectId(id),
			type: 'bone'
		});

		if (!bone) throw new Error("not found");
		res.status(200).send(bone);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}

export async function getAllBodies(_: Request, res: Response) {
	try {
		const bodies = await services.bodies.find({}).toArray();

		res.status(200).send(bodies);
	} catch (err: any) {
		res.status(500).send(err.message);
	}
}

export async function getBody(req: Request, res: Response) {
	const id = req?.params.id;

	try {
		const body = await services.bodies.findOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": id
		});

		if (!body) throw new Error("not found");
		res.status(200).send(body);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}

export async function updateBodyBones(req: Request, res: Response) {
	const id = req.params.id;
	
	try {
		const bones = req.body as Record<string, BoneData>;
		
		const result = await services.bodies.updateOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": id
		}, {
			$set: {
				"bones": bones
			}
		});

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

		const result = await services.bodies.updateOne({
			// TODO: discuss about "_id" or "name"-like primary keys usage
			// _id: new ObjectId(id)
			"generals.name": id
		}, {
			$set: {
				[`bones.${boneId}`]: bone
			}
		});

		result
			? res.status(200).send(`Successfully updated body ${id}`)
			: res.status(304).send(`Body "${id}" not updated`);
	} catch (err: any) {
		res.status(404).send(`Unable to find matching document with id "${req.params.id}": ${err.message}`);
	}
}
