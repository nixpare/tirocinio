import { Document } from './Document';
import { fetchSezione, Sezione } from './Form';
import { fetchQuery, headers } from './main';

export enum AnatomStructType {
	Osso = 'ossa'
}

export type AnatomStruct = Document & {
	Nome: string
	Sezioni: Sezione[]
}

export async function fetchAnatomStruct(url: string, typ: AnatomStructType, name: string): Promise<AnatomStruct> {
	url += `/${typ}`
	let response = await fetch(url, { headers });
	if (!response.ok) throw new Error(`Error fetching ${url}: ${await response.text()}`);

	const documents = (await response.json()).data as AnatomStruct[];
	const id = documents
		.filter(doc => doc.Nome.includes(name))
		.map(doc => doc.documentId)[0];

	url += `/${id}`
	const data: AnatomStruct = await fetchQuery(url, ['Sezioni']);

	for (let i = 0; i < data.Sezioni.length; i++) {
		data.Sezioni[i] = await fetchSezione(data.Sezioni[i].id, url)
	}

	return data;
};
