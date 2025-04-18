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
	id: string
	/** titolo della pagina */
	title: string
	/** le proprietà iniziali */
	starters: FormFieldTemplate[]
	/** immagini da affiancare alle tabelle delle proprietà */
	images?: string[]
}

/**
 * FormFieldTemplate contiene le caratteristiche di una proprietà.
 * Le varie proprietà opzionali sono dedicate alle varie modalità di input
 */
export type FormFieldTemplate = FormFieldBaseTemplate | FormFixedFieldTemplate | FormTextFieldTemplate | FormNumberFieldTemplate |
	FormSelectFieldTemplate | FormMultiSelectFieldTemplate | FormExpansionFieldTemplate | FormDeductionFieldTemplate

type FormFieldBaseTemplate = {
	id: string
	/** il tipo di input sottostante alla proprietà */
	type: FormFieldType
	/** un simil table header per questo campo specifico */
	header?: string
}

/**
 * FormFieldType contiene le varie tipologie di input supportate dalle proprietà:
 * + `fixed`: una cella con un testo fissato
 * + `text`: un semplice <input type="text" />
 * + `number`: un semplice <input type="number" />
 * + `select`: un componente simile a un elemento <select> con varie <option>, dove ad ogni valore selezionabile dal
 *     menu a tendina può corrispondere uno o più campi successivi della tabella.
 *     Questo permette di espandere la tabella in base agli input selezionati in
 *     precedenza. Un esempio è la creazione di due menu a tendina con varie opzioni,
 *     in cui i valori selezionabili dal secondo menu dipendono da quale valore si
 *     abbia selezionato nel primo
 * + `deduction`: un componente usato per la generazione di dati a partire da altri la cui unica proprietà fondamentale
 *     è chiave (`string`) che mappa, attraverso `deductionMap`, a una funzione (`FormDeductionFunction`) che riceve come argomenti:
 *     + `form`: i dati inseriti (`FormData`) presi dalla tabella
 *     + `rowIdx`: l'indice della riga nella tabella, per poter fare calcoli diversi in base alla riga
 */
export type FormFieldType = 'fixed' | 'text' | 'number' | 'select' | 'multi-select' | 'expansion' | 'deduction'

export type FormFixedFieldTemplate = FormFieldBaseTemplate & {
	type: 'fixed'
	value?: string
}
export type FormTextFieldTemplate = FormFieldBaseTemplate & {
	type: 'text'
	multiline?: boolean
}
export type FormNumberFieldTemplate = FormFieldBaseTemplate & {
	type: 'number'
	min?: number
	max?: number
}
export type FormFieldGenericSelectTemplate = {
	selectArgs: FormFieldSelectArgs | string
	nextArgs?: {
		options: string[]
		next: FormFieldTemplate[]
	}[]
}
export type FormSelectFieldTemplate = FormFieldBaseTemplate & {
	type: 'select'
} & FormFieldGenericSelectTemplate
export type FormMultiSelectFieldTemplate = FormFieldBaseTemplate & {
	type: 'multi-select'
} & FormFieldGenericSelectTemplate
export type FormExpansionFieldTemplate = FormFieldBaseTemplate & {
	type: 'expansion'
	incremental?: boolean
	prefix?: string
	fixed?: FormFieldTemplate[][]
	expansionArgs?: FormFieldTemplate[]
	next?: FormFieldTemplate[]
}
export type FormDeductionFieldTemplate = FormFieldBaseTemplate & {
	type: 'deduction'
	deductionID: string
}

export function formFieldIsFixed(f: FormFieldTemplate): f is FormFixedFieldTemplate {
	return f.type == 'fixed';
}
export function formFieldIsText(f: FormFieldTemplate): f is FormTextFieldTemplate {
	return f.type == 'text';
}
export function formFieldIsNumber(f: FormFieldTemplate): f is FormNumberFieldTemplate {
	return f.type == 'number';
}
export function formFieldIsSelect(f: FormFieldTemplate): f is FormSelectFieldTemplate {
	return f.type == 'select';
}
export function formFieldIsMultiSelect(f: FormFieldTemplate): f is FormMultiSelectFieldTemplate {
	return f.type == 'multi-select';
}
export function formFieldIsExpansion(f: FormFieldTemplate): f is FormExpansionFieldTemplate {
	return f.type == 'expansion';
}
export function formFieldIsDeduction(f: FormFieldTemplate): f is FormDeductionFieldTemplate {
	return f.type == 'deduction';
}

export type FormFieldSelectArgs = {
	value: string
	display: string
}[]

/**
 * AnatomStructState rappresenta le informazioni relative a una struttura anatomica
 * effettivamente esistente, non un template di creazione.
 * Il template è copiato all'interno dello stato per mantenere consistente la rappresentazione
 * dei dati, contenuta nella proprietà `props`, nel caso in cui venga apportata una modifica
 * al template della struttura anatomica di riferimento.
 */
export type FormData = {
	templ: FormTemplate
	sections?: Record<string, FormSectionData>
}

export type FormSectionData = Record<string, FormFieldData> | undefined

export type FormFieldData = FormFieldBaseData | FormTextFieldData | FormNumberFieldData |
	FormSelectFieldData | FormMultiSelectFieldData | FormExpansionFieldData | FormDeductionFieldData

type FormFieldBaseData = {
	type: FormFieldType
	value?: string | number | FormSelectFieldValue | FormMultiSelectFieldValue | FormExpansionFieldValue
}

export type FormTextFieldData = FormFieldBaseData & {
	type: 'text'
	value?: string
}
export type FormNumberFieldData = FormFieldBaseData & {
	type: 'number'
	value?: number
}
export type FormSelectFieldData = FormFieldBaseData & {
	type: 'select'
	value?: FormSelectFieldValue
}
export type FormMultiSelectFieldData = FormFieldBaseData & {
	type: 'multi-select'
	value?: FormMultiSelectFieldValue
}
export type FormExpansionFieldData = FormFieldBaseData & {
	type: 'expansion'
	value?: FormExpansionFieldValue
}
export type FormDeductionFieldData = FormFieldBaseData & {
	type: 'deduction'
}

export function formFieldDataIsText(f: FormFieldData): f is FormTextFieldData {
	return f.type == 'text';
}
export function formFieldDataIsNumber(f: FormFieldData): f is FormNumberFieldData {
	return f.type == 'number';
}
export function formFieldDataIsSelect(f: FormFieldData): f is FormSelectFieldData {
	return f.type == 'select';
}
export function formFieldDataIsMultiSelect(f: FormFieldData): f is FormMultiSelectFieldData {
	return f.type == 'multi-select';
}
export function formFieldDataIsExpansion(f: FormFieldData): f is FormExpansionFieldData {
	return f.type == 'expansion';
}
export function formFieldDataIsDeduction(f: FormFieldData): f is FormDeductionFieldData {
	return f.type == 'deduction';
}

/** FormSelectFieldValue contiene lo stato di una proprietà `Select` */
export type FormSelectFieldValue = {
	/** il valore selezionato dal menu a tendina */
	selection: string
	/** le `AnatomStructProperty` innestate, opzionale, indica i valori della proprietà derivate dalla selezione corrente */
	next?: Record<string, FormFieldData>
}

/** FormMultiSelectFieldValue contiene lo stato di una proprietà `Multi-Select` */
export type FormMultiSelectFieldValue = {
	/** il valore selezionato dal menu a tendina */
	selections: string[]
	/** le `AnatomStructProperty` innestate, opzionale, indica i valori della proprietà derivate dalla selezione corrente */
	next?: Record<string, Record<string, FormFieldData> | undefined>
}

// TODO: convert to Record
export type FormExpansionFieldValue = {
	fixed?: FormFieldData[][]
	additional?: FormFieldData[][]
}
