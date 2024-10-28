export type AnatomStructTemplate = {
	/** il nome della struttura anatomica */
	name: string
	/** le pagine di proprietà della struttura anatomica */
	pages: AnatomStructPage[]
}

/**
 * AnatomStructPage è suddivisa in varie sezioni, una per tabella di proprietà,
 * ed eventualmente una o più immagini
 */
export type AnatomStructPage = {
	/** titolo della pagina */
	title: string
	/** immagini da affiancare alle tabelle delle proprietà */
	image?: string[]
	/** le tabelle delle proprietà */
	tables: AnatomStructTable[]
}

/**
 * AnatomStructTable contiene il template della tabella per la sua generazione
 * ed eventualmente anche delle informazioni già esistendi.
 * Non c'è ancora nessun legame tra i campi fissi di una riga e i valori contenuti in `props`,
 * questi rimangono consistenti solo se il template non viene cambiato minimamente, compreso l'ordine
 * delle liste di campi fissi (`indexes`) della tabella
 */
export type AnatomStructTable = {
	type: AnatomStructTableType
	/** le intestazioni della tabella delle proprietà */
	headers: string[]
	/** elenco dei vari campi di input presenti per ogni riga della tabella */
	fields: AnatomStructTableField[]
}

export enum AnatomStructTableType {
	Default,
	VariadicButton,
	VariadicMouse
}
export const anatomStructTableTypes: Record<string, AnatomStructTableType> = {
	"Default": AnatomStructTableType.Default,
	"Variabile con pulsante": AnatomStructTableType.VariadicButton,
	"Variabile su immagine": AnatomStructTableType.VariadicMouse
}

export function getTableTypeID(table: AnatomStructTableType): string | undefined {
	return Object.entries(anatomStructTableTypes).filter(([_, tableType]) => {
		return tableType === table
	}).map(([tableID, _]) => tableID)[0] ?? undefined
}

/** AnatomStructTableField contiene le caratteristiche di una proprietà */
export type AnatomStructTableField = {
	/** il tipo di input sottostante alla proprietà */
	mode: AnatomStructInputMode
	/** presente quando l'input è del tipo `Fixed`, contiene la lista dei campi fissi indicizzata sulle righe */
	fixedArgs?: string[]
	/** presente quando l'input è del tipo `Dropdown`, contiene la lista di valori possibili */
	dropdownArgs?: string[]
	/** presente quando l'input è del tipo `Multistage`, contiene la lista di valori possibili */
	multistageArgs?: AnatomStructMultistageArg[]
}

export enum AnatomStructInputMode {
	/** una semplice stringa non modificabile */
	Fixed,
	/** un semplice <input type="text" /> */
	Text,
	/** un semplice <input type="number" /> */
	Number,
	/** un componente che simula un elemento <select> */
	Dropdown,
	/**  */
	Multistage
}
export const anatomStructInputModes: Record<string, AnatomStructInputMode> = {
	"Fissato": AnatomStructInputMode.Fixed,
	"Testo": AnatomStructInputMode.Text,
	"Numbero": AnatomStructInputMode.Number,
	"Scelta multipla": AnatomStructInputMode.Dropdown,
	"Variabile (?)": AnatomStructInputMode.Multistage
}

export function getInputModeID(mode: AnatomStructInputMode): string | undefined {
	return Object.entries(anatomStructInputModes).filter(([_, inputMode]) => {
		return inputMode === mode
	}).map(([modeID, _]) => modeID)[0] ?? undefined
}

export type AnatomStructMultistageArg = {
	value: string
	next: AnatomStructTableField
}

export type AnatomStructState = {
	/** il nome della struttura anatomica */
	name: string
	/** una copia del template della struttura anatomica */
	template: AnatomStructTemplate,
	/** quadrivettore: pagina x tabella x riga x colonna */
	props?: AnatomStructPageState[]
}

export type AnatomStructPageState = AnatomStructTableState[] | undefined
export type AnatomStructTableState = TableRowState[] | undefined
export type TableRowState = Record<number, AnatomStructProperty>

/** AnatomStructProperty è il tipo che può avere una proprietà, per ora tutto è basato su stringhe */
export type AnatomStructProperty = string | number | AnatomStructMultistageProperty | AnatomStructPropertyImageRef | undefined

export enum AnatomStructRowSpecial {
	CircleInfo = -1,
}

export type AnatomStructMultistageProperty = {
	value: string
	next?: AnatomStructProperty
}
export function isAnatomStructMultistageProperty(object: any): object is AnatomStructMultistageProperty {
	return typeof object === 'object' && 'value' in object
}

export type AnatomStructPropertyImageRef = {
	imageIdx: number
	x: number
	y: number
}
