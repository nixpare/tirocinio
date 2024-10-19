/**
 * Bone contiene sia le informazioni di un osso già registrato, che il template
 * dell'osso per poterlo generare la prima volta.
 */
export type Bone = {
	/** il nome dell'osso */
	name: string
	/** le pagine di proprietà dell'osso */
	pages: BonePropertyPage[]
}

/**
 * BonePropertyPage è suddivisa in varie sezioni, una per tabella di proprietà,
 * ed eventualmente una o più immagini
 */
export type BonePropertyPage = {
	/** titolo della pagina */
	title: string
	/** immagini da affiancare alle tabelle delle proprietà */
	image?: string[]
	/** le sezioni contenenti le tabelle delle proprietà */
	sections: BonePropertyPageSection[]
}

/**
 * BonePropertyPageSection contiene il template della tabella per la sua generazione
 * ed eventualmente anche delle informazioni già esistendi.
 * Non c'è ancora nessun legame tra i campi fissi di una riga e i valori contenuti in `props`,
 * questi rimangono consistenti solo se il template non viene cambiato minimamente, compreso l'ordine
 * delle liste di campi fissi (`indexes`) della tabella
 */
export type BonePropertyPageSection = {
	/** template della tabella */
	table: BonePropertyTable
	/** proprietà già presenti relative alla tabella */
	props?: BoneProperty[][]
}

export type BonePropertyTable = {
	/** le intestazioni della tabella delle proprietà */
	headers: string[]
	/** elenco dei vari input presenti per ogni riga della tabella */
	template: BonePropertyTemplate[]
	/**  elenco dei campi fissi per ogni riga */
	indexes: string[][]
}

/** BonePropertyTemplate contiene le caratteristiche di una proprietà */
export type BonePropertyTemplate = {
	/** il tipo di input sottostante alla proprietà */
	mode: InputMode
	/** presente quando l'input è del tipo `Dropdown`, contiene la lista di valori possibili */
	options?: string[]
}

/** BoneProperty è il tipo che può avere una proprietà, per ora tutto è basato su stringhe */
export type BoneProperty = string

export enum InputMode {
	/** un semplice <input type="text" /> */
	Text,
	/** un componente che simula un elemento <select> */
	Dropdown
}
