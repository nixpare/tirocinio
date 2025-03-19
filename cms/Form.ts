import { Component } from "./Strapi"
import { Campo } from "./Field";

export type Sezione = Component & {
	Nome: string
	Immagine: Object | null
	Campo: Campo[]
}
