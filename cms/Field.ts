import { walkObject, walkSetObject } from "../models/Programmable";
import { Component } from "./Document";
import { deeplog, fetchQuery } from "./main";

export type Campo = Component & {
	NomeCampo: string
	TipoCampo: TipoCampo
	ListaElementi: Elemento[]
}

enum TipoCampo {
	Text = 'text',
	Number = 'number',
	Select = 'select',
	MultiSelect = 'select-multi'
	// TODO: implementare il campo 'ID'
	// TODO: chiedere che cosa sia un tipo campo 'text-multi'
	// TODO: capire meglio il campo 'reference'
	// TODO: implementare il campo 'method'
}

export async function fetchCampo(
	id: number, url: string, query: any,
	breadcrumb: string[], filter: string[]
): Promise<Campo> {
	query = walkSetObject(
		query,
		{
			Campo: {
				filters: {
					id: {
						$eq: id
					}
				},
				populate: '*'
			}
		},
		breadcrumb.join('.')
	);

	breadcrumb = [...breadcrumb, 'Campo', 'populate'];
	filter = [...filter, 'Campo', '0'];

	const data = await fetchQuery(url, query);
	const campo = walkObject<Campo>(data, filter.join('.'));
	if (!campo) throw new Error("unable to walk campo");

	campo.ListaElementi = await fetchListaElementi(url, query, breadcrumb, filter);

	return campo;
};

type Elemento = Component & {
	NomeCampo: string
}

async function fetchListaElementi(
	url: string, query: any,
	breadcrumb: string[], filter: string[]
): Promise<Elemento[]> {
	query = walkSetObject(
		query,
		{
			ListaElementi: {
				populate: '*'
			}
		},
		breadcrumb.join('.')
	);

	breadcrumb = [...breadcrumb, 'ListaElementi', 'populate'];
	filter = [...filter, 'ListaElementi'];

	const data = await fetchQuery(url, query);
	const listaElementi = walkObject<Elemento[]>(data, filter.join('.'));
	if (listaElementi == undefined) throw new Error("unable to walk campo");

	return listaElementi;
};