import { StrapiComponent } from "./Strapi";

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
