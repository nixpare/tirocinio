import { StrapiDocument, validateObject, ValidateObjectResult } from './Strapi';
import { convertForm, StrapiSezione } from './Form';
import { fetchQuery } from './main';
import { AnatomStruct } from '../models/AnatomStruct';
import { isAnatomStructType } from '../models/conversion';

export enum StrapiAnatomStructType {
	Osso = 'ossa'
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

export async function fetchStrapiDocument(url: string, typ: StrapiAnatomStructType, name: string): Promise<StrapiAnatomStruct> {
	url += `/${typ}`
	let response = await fetch(url);
	if (!response.ok) throw new Error(`Error fetching ${url}: ${await response.text()}`);

	const documents = (await response.json()).data as StrapiAnatomStruct[];
	const id = documents
		.filter(doc => doc.Nome.includes(name))
		.map(doc => doc.documentId)[0];

	url += `/${id}`
	const data: StrapiAnatomStruct = await fetchQuery(url, anatomStructQuery);

	return data;
};

export function convertStrapi(doc: StrapiAnatomStruct, typ: StrapiAnatomStructType): ValidateObjectResult<AnatomStruct> {
	const anatomStruct: Partial<AnatomStruct> = {};
	
	anatomStruct.name = doc.Nome;
	switch (typ) {
		case StrapiAnatomStructType.Osso:
			anatomStruct.type = 'bone';
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
