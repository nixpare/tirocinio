import { Document } from './Strapi';
import { Sezione } from './Form';
import { fetchQuery, headers } from './main';

export enum AnatomStructType {
	Osso = 'ossa'
}

export type AnatomStruct = Document & {
	Nome: string
	Sezioni: Sezione[]
}

/* const anatomStructQuery = [
	'Sezioni',
	'Sezioni.Campo',
	'Sezioni.Immagine',
	'Sezioni.Campo.ListaElementi'
]; */
const anatomStructQuery = {
	Sezioni: {
		populate: {
			Campo: {
				populate: {
					ListaElementi: {
						populate: '*'
					}
				}
			},
			Immagine: {
				populate: '*'
			}
		}
	}
};

export async function fetchStrapiDocument(url: string, typ: AnatomStructType, name: string): Promise<AnatomStruct> {
	url += `/${typ}`
	let response = await fetch(url, { headers });
	if (!response.ok) throw new Error(`Error fetching ${url}: ${await response.text()}`);

	const documents = (await response.json()).data as AnatomStruct[];
	const id = documents
		.filter(doc => doc.Nome.includes(name))
		.map(doc => doc.documentId)[0];

	url += `/${id}`
	const data: AnatomStruct = await fetchQuery(url, anatomStructQuery);

	return data;
};
