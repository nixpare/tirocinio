/**
 * AnatomStructTemplate contiene la rappresentazione delle informazioni
 * di una struttura anatomica, intese come "forma dei dati" senza contenere
 * alcuna informazione specifica, usata per la generazione delle pagine e
 * tabelle e per interpretare i dati associati a una struttura anatomica
 */
export type AnatomStructTemplate = {
	/** il nome della struttura anatomica */
	name: string
	/** le pagine di proprietà della struttura anatomica */
	pages: AnatomStructPage[]
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
 * ed eventualmente anche delle informazioni già esistenti (es. i campi fissi di una tabella).
 */
export type AnatomStructTable = {
	/** la tipologia di tabella */
	type: AnatomStructTableType
	/** le intestazioni della tabella */
	headers: string[]
	/** elenco dei vari campi di input presenti per ogni riga della tabella */
	fields: AnatomStructTableField[]
}

/** AnatomStructTableType contiene le varie tipologie di tabella supportate */
export enum AnatomStructTableType {
	/**
	 * Default è una tabella non variabile nel numero di righe,
	 * quindi la presenza delle righe è definita dai campi che hanno
	 * tipo AnatomStructInputMode.Fixed
	 */
	Default,
	/**
	 * VariadicButton è una tabella variabile nel numero di righe.
	 * Il numero di righe è aggiunto dinamicamente con un pulsante e viene
	 * aggiunto in automatico l'intestazione "#" come prima intestazione
	 * e un numero crescente per ogni riga.
	 * Quando si caricano dei dati già presenti nella tabella, il numero di
	 * righe è preso dinamicamente dai dati
	 */
	VariadicButton,
	/**
	 * VariadicButton è una tabella variabile nel numero di righe.
	 * Il numero di righe è aggiunto dinamicamente cliccando su una delle
	 * immagini presenti a lato della pagina, quando la tabella è attiva
	 * (evidenziata), viene aggiunto in automatico l'intestazione "#" come
	 * prima intestazione e un numero crescente per ogni riga e quando si
	 * fa hovering sulla riga in automatico viene portato in evidenza il punto
	 * selezionato originariamente sull'immagine.
	 * Quando si caricano dei dati già presenti nella tabella, il numero di
	 * righe è preso dinamicamente dai dati, inclusa la posizione del punto
	 * selezionato nell'immagine
	 */
	VariadicMouse
}

/** anatomStructTableTypes è usato per mappare nomi dedicati all'UI con i tipi di tabella */
export const anatomStructTableTypes: Record<string, AnatomStructTableType> = {
	"Default": AnatomStructTableType.Default,
	"Variabile con pulsante": AnatomStructTableType.VariadicButton,
	"Variabile su immagine": AnatomStructTableType.VariadicMouse
}

/** getTableTypeID è usato per mappare i tipi di tabella con i nomi dedicati all'UI */
export function getTableTypeID(table?: AnatomStructTableType): string | undefined {
	return Object.entries(anatomStructTableTypes).filter(([_, tableType]) => {
		return tableType === table
	}).map(([tableID, _]) => tableID)[0] ?? undefined
}

/**
 * AnatomStructTableField contiene le caratteristiche di una proprietà.
 * Le varie proprietà opzionali sono dedicate alle varie modalità di input
 */
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

/** AnatomStructInputMode contiene le varie tipologie di input supportate dalle proprietà */
export enum AnatomStructInputMode {
	/** una semplice stringa non modificabile */
	Fixed,
	/** un semplice <input type="text" /> */
	Text,
	/** un semplice <input type="number" /> */
	Number,
	/** un componente che simula un elemento <select> con varie <option> */
	Dropdown,
	/**
	 * un componente simile a Dropdown, dove ad ogni valore selezionabile dal
	 * menu a tendina corrisponde un successivo campo della tabella.
	 * Questo permette di espandere la tabella in base agli input selezionati in
	 * precedenza. Un esempio è la creazione di due menu a tendina con varie opzioni,
	 * in cui i valori selezionabili dal secondo menu dipendono da quale valore si
	 * abbia selezionato nel primo
	*/
	Multistage
}

/** anatomStructInputModes è usato per mappare nomi dedicati all'UI con i tipi di modalità di input */
export const anatomStructInputModes: Record<string, AnatomStructInputMode> = {
	"Fissato": AnatomStructInputMode.Fixed,
	"Testo": AnatomStructInputMode.Text,
	"Numbero": AnatomStructInputMode.Number,
	"Scelta multipla": AnatomStructInputMode.Dropdown,
	"Variabile (?)": AnatomStructInputMode.Multistage
}

/** getInputModeID è usato per mappare i tipi di modalità di input con i nomi dedicati all'UI */
export function getInputModeID(mode?: AnatomStructInputMode): string | undefined {
	return Object.entries(anatomStructInputModes).filter(([_, inputMode]) => {
		return inputMode === mode
	}).map(([modeID, _]) => modeID)[0] ?? undefined
}

/** AnatomStructMultistageArg rappresenta un'opzione di un campo Multistage */
export type AnatomStructMultistageArg = {
	/** il valore selezionabile nel menu a tendina */
	value: string
	/** il template del campo della tabella generato alla selezione del valore sopra */
	next: AnatomStructTableField
}

/**
 * AnatomStructState rappresenta le informazioni relative a una struttura anatomica
 * effettivamente esistente, non un template di creazione.
 * Il template è copiato all'interno dello stato per mantenere consistente la rappresentazione
 * dei dati, contenuta nella proprietà `props`, nel caso in cui venga apportata una modifica
 * al template della struttura anatomica di riferimento.
 */
export type AnatomStructState = {
	/** il nome della struttura anatomica */
	name: string
	/** una copia del template della struttura anatomica */
	template: AnatomStructTemplate,
	/**
	 * quadrivettore: pagina x tabella x riga x colonna.
	 * In realtà l'ultima dimensione del quadrivettore (ciò che indicizza i campi all'interno di
	 * una riga) è un `Record<number, AnatomStructProperty>` (vedere `TableRowState` per dettagli)
	 */
	props?: AnatomStructPageState[]
}

export type AnatomStructPageState = AnatomStructTableState[] | undefined
export type AnatomStructTableState = TableRowState[] | undefined
/**
 * TableRowState ha la stessa funzione di un array `AnatomStructProperty[]`, quindi
 * indicizza da 0 in poi a `AnatomStructProperty`, ma permette di aggiungere campi
 * speciali utilizzando indici speciali dedicati, negativi, elencati in `AnatomStructRowSpecial`
 */
export type TableRowState = Record<number, AnatomStructProperty> | undefined

/**
 * AnatomStructProperty è il tipo che può avere una proprietà, ogni proprietà ha il suo tipo
 * e prima di utilizzare il dato deve fare i controlli necassari per garantire type-safety
 */
export type AnatomStructProperty = string | number | AnatomStructMultistageProperty | AnatomStructPropertyImageRef | undefined

/** AnatomStructRowSpecial contiene gli indici speciali per salvare determinate informazioni su una riga */
export enum AnatomStructRowSpecial {
	/** Indice per contenere informazioni relative ai cerchi nella tabella `VariadicMouse` */
	CircleInfo = -1,
}

/** AnatomStructMultistageProperty contiene lo stato di una proprietà `Multistage` */
export type AnatomStructMultistageProperty = {
	/** il valore selezionato dal menu a tendina */
	value: string
	/** la `AnatomStructProperty` innestata, opzionale, indica il valore della proprietà derivata dalla selezione corrente */
	next?: AnatomStructProperty
}

/** isAnatomStructMultistageProperty determina il risultato in base alla presenza del campo `value` */
export function isAnatomStructMultistageProperty(object: any): object is AnatomStructMultistageProperty {
	return typeof object === 'object' && 'value' in object
}

/** AnatomStructPropertyImageRef contiene le informazioni relative al cerchio selezionato per una riga */
export type AnatomStructPropertyImageRef = {
	/** l'indice dell'immagine all'interno della pagina */
	imageIdx: number
	/** posizione percentuale (0 <= x <= 100) sulle x relative all'immagine */
	x: number
	/** posizione percentuale (0 <= x <= 100) sulle y relative all'immagine */
	y: number
}
