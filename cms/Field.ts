import { Component } from "./Strapi";

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

type Elemento = Component & {
	NomeCampo: string
}
