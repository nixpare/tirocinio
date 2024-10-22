export type BoneState = {
	/** il nome dell'osso */
	name: string
	/** quadrivettore: pagina x tabella x riga x colonna */
	props?: BoneProperty[][][][]
}

export type BoneTemplate = {
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
	/** le tabelle delle proprietà */
	tables: BonePropertyPageTable[]
}

/**
 * BonePropertyPageTable contiene il template della tabella per la sua generazione
 * ed eventualmente anche delle informazioni già esistendi.
 * Non c'è ancora nessun legame tra i campi fissi di una riga e i valori contenuti in `props`,
 * questi rimangono consistenti solo se il template non viene cambiato minimamente, compreso l'ordine
 * delle liste di campi fissi (`indexes`) della tabella
 */
export type BonePropertyPageTable = {
	type: PropertyTableType
	/** le intestazioni della tabella delle proprietà */
	headers: string[]
	/** elenco dei vari input presenti per ogni riga della tabella */
	inputs: BonePropertyInput[]
	/**  elenco dei campi fissi per ogni riga, presente se la tabella è di tipo Default */
	indexes?: string[][]
}

export enum PropertyTableType {
	Default,
	VariadicButton,
	VariadicMouse
}

/** BonePropertyInput contiene le caratteristiche di una proprietà */
export type BonePropertyInput = {
	/** il tipo di input sottostante alla proprietà */
	mode: InputMode
	/** presente quando l'input è del tipo `Dropdown`, contiene la lista di valori possibili */
	dropdownArgs?: string[]
	/** presente quando l'input è del tipo `Multistage`, contiene la lista di valori possibili */
	multistageArgs?: MultistageArg[]
}

/** BoneProperty è il tipo che può avere una proprietà, per ora tutto è basato su stringhe */
export type BoneProperty = string | BonePropertyMultistage

export enum InputMode {
	/** un semplice <input type="text" /> */
	Text,
	/** un componente che simula un elemento <select> */
	Dropdown,
	/**  */
	Multistage
}

export type BonePropertyMultistage = {
	value?: string
	next?: BoneProperty
}

export type MultistageArg = {
	value: string
	next: BonePropertyInput
}
