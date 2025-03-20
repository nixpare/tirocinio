import { FormFieldTemplate } from "../models/Form";
import { StrapiComponent, validateObject, ValidateObjectResult } from "./Strapi";

export type StrapiCampo = StrapiComponent & {
	NomeCampo: string
	TipoCampo: StrapiTipoCampo
	ListaElementi: StrapiElemento[]
}

enum StrapiTipoCampo {
	Text = 'text',
	Number = 'number',
	Select = 'select',
	MultiSelect = 'select-multi'
	// TODO: implementare il campo 'ID'
	// TODO: chiedere che cosa sia un tipo campo 'text-multi'
	// TODO: capire meglio il campo 'reference'
	// TODO: implementare il campo 'method'
}

type StrapiElemento = StrapiComponent & {
	NomeCampo: string
}

type StrapiCampoNode = StrapiCampo & {
	path: string[]
}

export function rebuildStrapiCampoTree(doc: StrapiCampo[]): StrapiCampoNode[] {
	return doc.map<StrapiCampoNode>(campo => {
		const path = campo.NomeCampo.split('//');

		return {
			...campo,
			path: path
		}
	})
}
