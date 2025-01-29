/**
 * AnatomStructTemplate contiene la rappresentazione delle informazioni
 * di una struttura anatomica, intese come "forma dei dati" senza contenere
 * alcuna informazione specifica, usata per la generazione delle pagine e
 * tabelle e per interpretare i dati associati a una struttura anatomica
 */
export type FormTemplate = {
	/** il titolo della struttura anatomica */
	title: string
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
	/**
	 * un componente simile a un elemento <select> con varie <option>, dove ad ogni valore selezionabile dal
	 * menu a tendina può corrispondere uno o più campi successivi della tabella.
	 * Questo permette di espandere la tabella in base agli input selezionati in
	 * precedenza. Un esempio è la creazione di due menu a tendina con varie opzioni,
	 * in cui i valori selezionabili dal secondo menu dipendono da quale valore si
	 * abbia selezionato nel primo
	*/
	'dropdown'

export type FormTableBlankFieldTemplate = FormTableFieldTemplate & {
	type: 'blank'
	defaultValue: undefined
}
export type FormTableTextFieldTemplate = FormTableFieldTemplate & {
	type: 'text'
	defaultValue?: FormTableTextFieldData
}
export type FormTableNumberFieldTemplate = FormTableFieldTemplate & {
	type: 'number'
	defaultValue?: FormTableNumberFieldData
	min?: number
	max?: number
}
export type FormTableDropdownFieldTemplate = FormTableFieldTemplate & {
	type: 'dropdown'
	defaultValue?: FormTableDropdownFieldData
	/** contiene la lista di valori possibili */
	dropdownArgs: FormTableFieldDropdownArg[]
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

/** FormTableFieldDropdownArg rappresenta un'opzione di un campo Multistage */
export type FormTableFieldDropdownArg = {
	/** il valore selezionabile nel menu a tendina */
	value: string
	/** il valore mostrato in grafica */
	display: string
	/** i template dei campi della tabella generati alla selezione del valore sopra */
	next?: FormTableFieldTemplate[]
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
	value: string | number | FormTableDropdownFieldValue | FormTableFieldImageRef | undefined
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
	value?: FormTableDropdownFieldValue
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

// special cases

export function formFieldDataIsImage(f: FormTableFieldData): f is FormTableImageFieldData {
	return f.type == 'image';
}

function calculateAdditionalCells(field: FormTableFieldTemplate, data?: FormTableFieldData): number {
	// La cella è disponibile all'utente ma non è stato ancora impostato un suo valore
	if (data == undefined)
		return 0

	// prop non è del tipo Dropdown, quindi ha per forza dimensione 1 cella,
	// oppure prop è Multistage, ma il suo valore non è stato ancora impostato,
	if (!formFieldIsDropdown(field))
		return 0
	if (!formFieldDataIsDropdown(data))
		return 0

	// il Dropdown non ha un valore selezionato, quindi non ci sono caselle successive
	if (data.value == undefined)
		return 0

	const selectedIndex = field.dropdownArgs.reduce((prev, arg, argIdx) => {
		if (arg.value == data.value?.selection)
			return argIdx

		return prev
	}, -1)

	if (selectedIndex == -1)
		return 0

	// Multistage non ha next e quindi nessun valore delle proprietà successive è stato impostato
	if (data.value.next == undefined) {
		const nextLength = field.dropdownArgs[selectedIndex].next?.length ?? 0
		return nextLength
	}

	return 1 + data.value.next.reduce<number>((prev, nextProp, nextPropIdx) => {
		const nextField = field.dropdownArgs[selectedIndex].next?.[nextPropIdx]
		if (!nextField)
			return prev

		return prev + calculateAdditionalCells(nextField, nextProp)
	}, 0)
}

export function calculateRowCellCount(rowData: FormTableRowData, fields: FormTableFieldTemplate[]): number {
	if (rowData == undefined)
		return fields.length

	let additionalCells = Object.entries(rowData).reduce((prev, [key, value]) => {
		const idx = Number(key)
		if (idx < 0)
			return prev

		const calc = calculateAdditionalCells(fields[idx], value);
		return prev + calc
	}, 0)

	return fields.length + additionalCells
}

/** AnatomStructRowSpecial contiene gli indici speciali per salvare determinate informazioni su una riga */
export enum FormTableRowSpecial {
	/** Indice per contenere informazioni relative ai cerchi nella tabella `VariadicMouse` */
	CircleInfo = -1,
}

/** FormTableDropdownFieldValue contiene lo stato di una proprietà `Multistage` */
export type FormTableDropdownFieldValue = {
	/** il valore selezionato dal menu a tendina */
	selection: string
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
