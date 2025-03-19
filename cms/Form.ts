import { walkObject } from "../models/Programmable";
import { Component } from "./Document"
import { Campo, fetchCampo } from "./Field";
import { fetchQuery } from "./main";

export type Sezione = Component & {
	Nome: string
	Immagine: Object | null
	Campo: Campo[]
}

export async function fetchSezione(id: number, url: string): Promise<Sezione> {
	const query = {
		Sezioni: {
			filters: {
				id: {
					$eq: id
				}
			},
			populate: '*'
		}
	};

	const data = await fetchQuery(url, query);

	const filter = ['Sezioni', '0'];
	const sezione = walkObject<Sezione>(data, filter.join('.'));
	if (!sezione) throw new Error("unable to walk sezione");

	for (let i = 0; i < sezione.Campo.length; i++) {
		sezione.Campo[i] = await fetchCampo(
			sezione.Campo[i].id,
			url,
			query,
			['Sezioni', 'populate'],
			filter
		);
	}

	// TODO: fetch Sezione.Immagine
	
	return sezione;
};