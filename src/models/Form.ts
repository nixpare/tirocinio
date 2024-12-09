/**
 * AnatomStructTemplate contiene la rappresentazione delle informazioni
 * di una struttura anatomica, intese come "forma dei dati" senza contenere
 * alcuna informazione specifica, usata per la generazione delle pagine e
 * tabelle e per interpretare i dati associati a una struttura anatomica
 */
export type FormTemplate = {
	/** il nome della struttura anatomica */
	name: string
	/** le pagine di proprietà della struttura anatomica */
	sections: FormSectionTemplate[]
}

/**
 * AnatomStructPage principalmente ha una funzionalità grafica, per
 * rappresentare le tabelle e proprietà di una struttura anatomica su più
 * pagine con un effetto a carosello.
 * Ogni pagina contiene un numero variabile di tabelle e delle immagini a cui
 * le tabelle possono fare riferimento:
 * + può essere un collegamento logico (dei campi delle tabelle fanno riferimento
 *   a una sezione evidenziata nelle immagini, quindi un collegamento logico/manuale)
 * + può essere un collegamento reale (una riga è strettamente legata ad un punto
 *   delle immagini, aggiunto ad-hoc dall'utente e modificabile/rimovibile)
 */
export type FormSectionTemplate = {
	/** titolo della pagina */
	title: string
	/** le tabelle delle proprietà */
	tables: FormTableTemplate[]
	/** immagini da affiancare alle tabelle delle proprietà */
	image?: string[]
}

/**
 * AnatomStructTable contiene il template della tabella per la sua generazione
 * ed eventualmente anche delle informazioni già esistenti (es. i campi fissi di una tabella).
 * 
 * TODO: importare documentazione precedente
 */
export type FormTableTemplate = {
	/** le intestazioni della tabella */
	headers: string[]
	/** elenco dei vari campi di input presenti per ogni riga della tabella */
	fields: FormTableFieldTemplate[]
	/** se la tabella è espandibile */
	isVariadic?: boolean,
	/** se la tabella interagisce tramite cerchi con le immagini */
	interactsWithImage?: boolean,
}

/**
 * AnatomStructTableField contiene le caratteristiche di una proprietà.
 * Le varie proprietà opzionali sono dedicate alle varie modalità di input
 */
export type FormTableFieldTemplate = {
	/** il tipo di input sottostante alla proprietà */
	type: FormTableFieldType
	/** un simil table header per questo campo specifico */
	header?: string
	/** presente quando l'input è del tipo `Fixed`, contiene la lista dei campi fissi indicizzata sulle righe */
	fixedArgs?: string[]
	/** se presente crea un pulsante che imposta a tutte le celle sottostanti il valore di default */
	defaultValue?: FormTableFieldData
}

/** AnatomStructInputMode contiene le varie tipologie di input supportate dalle proprietà */
export type FormTableFieldType =
	/** una cella vuota */
	'blank' |
	/** un semplice <input type="text" /> */
	'text' |
	/** un semplice <input type="number" /> */
	'number' |
	/** un componente che simula un elemento <select> con varie <option> */
	'dropdown' |
	/**
	 * un componente simile a Dropdown, dove ad ogni valore selezionabile dal
	 * menu a tendina corrisponde un successivo campo della tabella.
	 * Questo permette di espandere la tabella in base agli input selezionati in
	 * precedenza. Un esempio è la creazione di due menu a tendina con varie opzioni,
	 * in cui i valori selezionabili dal secondo menu dipendono da quale valore si
	 * abbia selezionato nel primo
	*/
	'multistage'

export type FormTableBlankFieldTemplate = FormTableFieldTemplate & {
	mode: 'blank'
}
export type FormTableTextFieldTemplate = FormTableFieldTemplate & {
	mode: 'text'
}
export type FormTableNumberFieldTemplate = FormTableFieldTemplate & {
	mode: 'number'
	min?: number
	max?: number
}
export type FormTableDropdownFieldTemplate = FormTableFieldTemplate & {
	mode: 'dropdown'
	/** contiene la lista di valori possibili */
	dropdownArgs?: string[]
}
export type FormTableMultistageFieldTemplate = FormTableFieldTemplate & {
	mode: 'multistage'
	/** contiene la lista di valori possibili */
	multistageArgs?: FormTableFieldMultistageArg[]
}

export function formFieldIsBlank(f: FormTableFieldTemplate): f is FormTableBlankFieldTemplate {
	return f.type == 'blank';
}
export function formFieldIsText(f: FormTableFieldTemplate): f is FormTableTextFieldTemplate {
	return f.type == 'text';
}
export function formFieldIsNumber(f: FormTableFieldTemplate): f is FormTableNumberFieldTemplate {
	return f.type == 'number';
}
export function formFieldIsDropdown(f: FormTableFieldTemplate): f is FormTableDropdownFieldTemplate {
	return f.type == 'dropdown';
}
export function formFieldIsMultistage(f: FormTableFieldTemplate): f is FormTableMultistageFieldTemplate {
	return f.type == 'multistage';
}

/** AnatomStructMultistageArg rappresenta un'opzione di un campo Multistage */
export type FormTableFieldMultistageArg = {
	/** il valore selezionabile nel menu a tendina */
	value: string
	/** i template dei campi della tabella generati alla selezione del valore sopra */
	next: FormTableFieldTemplate[]
}

/**
 * AnatomStructState rappresenta le informazioni relative a una struttura anatomica
 * effettivamente esistente, non un template di creazione.
 * Il template è copiato all'interno dello stato per mantenere consistente la rappresentazione
 * dei dati, contenuta nella proprietà `props`, nel caso in cui venga apportata una modifica
 * al template della struttura anatomica di riferimento.
 */
export type FormData = {
	/** il nome della struttura anatomica */
	name: string
	/** una copia del template della struttura anatomica */
	template: FormTemplate,
	/**
	 * quadrivettore: pagina x tabella x riga x colonna.
	 * In realtà l'ultima dimensione del quadrivettore (ciò che indicizza i campi all'interno di
	 * una riga) è un `Record<number, AnatomStructProperty>` (vedere `TableRowState` per dettagli)
	 */
	sections?: FormSectionData[]
}

export type FormSectionData = FormTableData[] | undefined
export type FormTableData = FormTableRowData[] | undefined
/**
 * TableRowState ha la stessa funzione di un array `AnatomStructProperty[]`, quindi
 * indicizza da 0 in poi a `AnatomStructProperty`, ma permette di aggiungere campi
 * speciali utilizzando indici speciali dedicati, negativi, elencati in `AnatomStructRowSpecial`
 */
export type FormTableRowData = Record<number, FormTableFieldData> | undefined

/**
 * AnatomStructProperty è il tipo che può avere una proprietà, ogni proprietà ha il suo tipo
 * e prima di utilizzare il dato deve fare i controlli necassari per garantire type-safety
 */
export type FormTableFieldData = {
	type: FormTableFieldType | 'image'
	value: string | number | FormTableMultistageFieldValue | FormTableFieldImageRef | undefined
}

export type FormTableBlankFieldData = FormTableFieldData & {
	type: 'blank'
}
export type FormTableTextFieldData = FormTableFieldData & {
	type: 'text'
	value?: string
}
export type FormTableNumberFieldData = FormTableFieldData & {
	type: 'number'
	value?: number
}
export type FormTableDropdownFieldData = FormTableFieldData & {
	type: 'dropdown'
	value?: string
}
export type FormTableMultistageFieldData = FormTableFieldData & {
	type: 'multistage'
	value?: FormTableMultistageFieldValue
}

// special data types

export type FormTableImageFieldData = FormTableFieldData & {
	type: 'image'
	value?: FormTableFieldImageRef
}

export function formFieldDataIsBlank(f: FormTableFieldData): f is FormTableBlankFieldData {
	return f.type == 'blank';
}
export function formFieldDataIsText(f: FormTableFieldData): f is FormTableTextFieldData {
	return f.type == 'text';
}
export function formFieldDataIsNumber(f: FormTableFieldData): f is FormTableNumberFieldData {
	return f.type == 'number';
}
export function formFieldDataIsDropdown(f: FormTableFieldData): f is FormTableDropdownFieldData {
	return f.type == 'dropdown';
}
export function formFieldDataIsMultistage(f: FormTableFieldData): f is FormTableMultistageFieldData {
	return f.type == 'multistage';
}

// special cases

export function formFieldDataIsImage(f: FormTableFieldData): f is FormTableImageFieldData {
	return f.type == 'image';
}

function calculateFieldCellCount(field: FormTableFieldTemplate, data?: FormTableFieldData): number {
	// La cella è disponibile all'utente ma non è stato ancora impostato un suo valore
	if (data == undefined)
		return 1

	// prop non è del tipo Multistage, quindi ha per forza dimensione 1 cella,
	// oppure prop è Multistage, ma il suo valore non è stato ancora impostato,
	if (!formFieldIsMultistage(field))
		return 1
	if (!formFieldDataIsMultistage(data))
		return 1

	// il Multistage in realtà funziona come un Dropdown senza opzioni
	if (field.multistageArgs == undefined || data.value == undefined)
		return 1

	const selectedIndex = field.multistageArgs.reduce((prev, arg, argIdx) => {
		if (arg.value != data.value)
			return prev
		return argIdx
	}, 0)

	// Multistage non ha next e quindi nessun valore delle proprietà successive è stato impostato
	if (data.value.next == undefined)
		return 1 + field.multistageArgs[selectedIndex].next.length

	return 1 + data.value.next.reduce<number>((prev, nextProp, nextPropIdx) => {
		return prev + calculateFieldCellCount(
			// @ts-ignore
			field.multistageArgs[selectedIndex].next[nextPropIdx],
			nextProp
		)
	}, 0)
}

export function calculateRowCellCount(rowData: FormTableRowData, fields: FormTableFieldTemplate[]): number {
	if (rowData == undefined)
		return fields.length

	return Object.entries(rowData).reduce((prev, [key, value]) => {
		const idx = Number(key)
		if (idx < 0)
			return prev

		return Math.max(
			prev,
			idx + calculateFieldCellCount(fields[idx], value)
		)
	}, 0)
}

/** AnatomStructRowSpecial contiene gli indici speciali per salvare determinate informazioni su una riga */
export enum FormTableRowSpecial {
	/** Indice per contenere informazioni relative ai cerchi nella tabella `VariadicMouse` */
	CircleInfo = -1,
}

/** FormTableMultistageFieldValue contiene lo stato di una proprietà `Multistage` */
export type FormTableMultistageFieldValue = {
	/** il valore selezionato dal menu a tendina */
	value: string
	/** le `AnatomStructProperty` innestate, opzionale, indica i valori della proprietà derivate dalla selezione corrente */
	next?: FormTableFieldData[]
}

/** AnatomStructPropertyImageRef contiene le informazioni relative al cerchio selezionato per una riga */
export type FormTableFieldImageRef = {
	/** l'indice dell'immagine all'interno della pagina */
	imageIdx: number
	/** posizione percentuale (0 <= x <= 100) sulle x relative all'immagine */
	x: number
	/** posizione percentuale (0 <= x <= 100) sulle y relative all'immagine */
	y: number
}
