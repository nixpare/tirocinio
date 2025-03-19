import { walkObject, walkSetObject } from "../models/Programmable";
import { deeplog, fetchQuery } from "./main";

export type Campo = {
	id: number
	NomeCampo: string
	TipoCampo: string
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

	

	return campo;
};