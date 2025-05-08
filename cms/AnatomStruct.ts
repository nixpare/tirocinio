import { baseURL, StrapiDocument, validateObject, ValidateObjectResult } from './Strapi';
import { convertForm, StrapiSezione } from './Form';
import { AnatomStruct } from '../models/AnatomStruct';
import { isAnatomStructType } from '../models/conversion';
import qs from 'qs';

export enum StrapiAnatomStructType {
	Osso = 'ossa',
	Viscera = 'viscere',
	Esterno = 'esterni'
}

export type StrapiAnatomStruct = StrapiDocument & {
	Nome: string
	Sezioni: StrapiSezione[]
}

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
				fields: ['url']
			}
		}
	}
};

async function fetchQuery<T = any>(url: string, populate: any): Promise<T> {
	const compiledQuery = qs.stringify({
		populate: populate,
		status: 'draft'
	}, { encodeValuesOnly: true });

	const queryUrl = url + `?${compiledQuery}`;
	const response = await fetch(queryUrl);
	if (!response.ok) throw new Error(`Error fetching ${queryUrl}: ${await response.text()}`);

	let data = (await response.json()).data as T;
	return data;
}

export async function fetchStrapiDocumentList(typ: StrapiAnatomStructType): Promise<StrapiAnatomStruct[]> {
	let url = `${baseURL}/api/${typ}/`;
	let response = await fetch(url + '?status=draft');
	if (!response.ok) throw new Error(`Error fetching ${url}: ${await response.text()}`);

	const documents = (await response.json()).data as StrapiAnatomStruct[];
	return documents;
};

export async function fetchStrapiDocument(typ: StrapiAnatomStructType, id: string): Promise<StrapiAnatomStruct> {
	const url = `${baseURL}/api/${typ}/${id}`
	const data: StrapiAnatomStruct = await fetchQuery(url, anatomStructQuery);
	return data;
};

export async function findStrapiDocument(typ: StrapiAnatomStructType, name: string): Promise<StrapiAnatomStruct> {
	const documents = await fetchStrapiDocumentList(typ)

	const id = documents.find(doc => doc.Nome.trim() === name.trim())?.documentId
	if (id == undefined) throw new Error(`Document ${name} not found`);

	return await fetchStrapiDocument(typ, id)
};

export function convertStrapi(doc: StrapiAnatomStruct, typ: StrapiAnatomStructType): ValidateObjectResult<AnatomStruct> {
	const anatomStruct: Partial<AnatomStruct> = {};
	
	anatomStruct.name = doc.Nome;
	switch (typ) {
		case StrapiAnatomStructType.Osso:
			anatomStruct.type = 'bone';
			break;
		case StrapiAnatomStructType.Viscera:
			anatomStruct.type = 'viscera';
			break;
		case StrapiAnatomStructType.Esterno:
			anatomStruct.type = 'exterior';
			break;
	}

	const [ form, err ] = convertForm(doc);
	if (err) throw err;
	if (!form) throw new Error("an unexpected error has occurred at FormTemplate");
	anatomStruct.form = form;

	return validateObject(anatomStruct, validateAnatomStruct);
}

function validateAnatomStruct(anatom: Partial<AnatomStruct>): anatom is AnatomStruct {
	if (anatom.name == undefined) throw new Error("name in AnatomStruct is not defined");

	if (anatom.type == undefined) throw new Error("type in AnatomStruct is not defined");
	if (!isAnatomStructType(anatom.type)) throw new Error(`type in AnatomStruct is not valid: ${anatom.type}`);

	if (!anatom.form == undefined) throw new Error("form in AnatomStruct is not defined");

	return true;
}
