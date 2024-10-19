import { ChangeEvent, FormEvent, useState } from 'react'
import { produce } from 'immer'
import { Bone as BoneType, BoneProperty, InputMode, BonePropertyPage, BonePropertyTemplate, BonePropertyPageSection, BonePropertyMultistage } from './models/Bone'

import { Dropdown } from './Dropdown'
import { Carousel } from './Carousel'

import '../css/Bone.css'

/**
 * Bone è il macro elemento che gestisce la visualizzazione e la modifica / inserimento
 * di un osso. Il parametro `editMode` permette questa impostazione.
 * 
 * Il form all'interno è composto da un carosello di pagine, dove ogni pagina contiene
 * delle tabelle per impostare i vari campi.
 * 
 * Gli update si basano sui metodi 'setState' e sulla funzione `produce`, per permettere
 * una modifica più granulare e più ergonomica dello state sottostante. Ogni componente
 * derivato (`PropertyPage`, `PropertyPageSection`, ecc.) riceve dal padre una funzione
 * leggermente modificata che gli permette di modificare solo la parte corrispondente
 * dello stato generale, senza quindi dover passare sempre più campi nei figli, man mano
 * che si va in profondità, per tenere traccia dei vari indici delle proprietà. Inoltre
 * questo approccio puà permettere una ricorsione delle proprietà più flessibile (proprietà
 * che in base al loro valore determinano la natura delle proprietà successive)
 * @param bone stato utilizzato per la creazione del componente
 * @param editMode (opzionale) flag per indicare se abilitare la possibilità di modificare i campi
 * @return ReactNode
 */
export function Bone({ bone, editMode }: { bone: BoneType, editMode?: boolean }) {
	// La editMode dovrebbe permettere la visualizzazione di un osso
	// già inserito senza la presenza degli input, con la possibilità
	// di passare nella modalità di modifica con un pulsante esterno
	//
	// C'è da capire se sia conveniente fare si che ogni componente
	// abbia una editMode così da avere le due versioni più "vicine"
	// oppure se duplicarne la natura
	if (!editMode) {
		return (
			<div className="container">
				<h4 className="bone-name">{bone.name}</h4>
				<p>To be implemented</p>
			</div>
		)
	}

	const [state, setState] = useState(bone)
	function updateState(fn: (prev: BoneType) => BoneType): void {
		setState(produce(state, fn))
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(state)
	}

	return (
		<div className="container">
			<h4 className="bone-name">{state.name}</h4>
			<form className="bone-form" onSubmit={handleSubmit}>
				<Carousel>
					{state.pages.map((page, pageIdx) => {
						// updatePage è la funzione di produzione sullo stato per la pagina specifica
						function updatePage(fn: (page: BonePropertyPage) => BonePropertyPage) {
							updateState(state => {
								state.pages[pageIdx] = fn(state.pages[pageIdx])
								return state
							})
						}

						return <PropertyPage key={page.title} page={page} update={updatePage} />;
					})}
				</Carousel>
				<button type="submit">Invia</button>
			</form>
		</div>
	);
}

/**
 * PropertyPage rappresenta una pagina di opzioni per l'osso, la quale contiene, eventualmente, una o più immagini
 * relative alle opzioni della pagina e una o più sezioni (ogni sezione coincide con una tabella di opzioni).
 * Se non ci sono immagini associate alla pagina, vengono mostrare solo le sezioni, altrimenti la schermata è divisa
 * in due.
 * @param page attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPage({ page, update }: { page: BonePropertyPage, update: (fn: (page: BonePropertyPage) => BonePropertyPage) => void }) {
	if (!page.image) {
		return <div>
			{page.sections.map((section, sectionIdx) => {
				// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
				function updateSection(fn: (section: BonePropertyPageSection) => BonePropertyPageSection): void {
					update(page => {
						page.sections[sectionIdx] = fn(page.sections[sectionIdx])
						return page
					})
				}

				return <div className="bone-section" key={`${page.title}-${sectionIdx}`}><PropertyPageSection section={section} update={updateSection} /></div>
			})}
		</div>
	}

	return (
		<div className="split">
			<div>
				{page.sections.map((section, sectionIdx) => {
					// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
					function updateSection(fn: (section: BonePropertyPageSection) => BonePropertyPageSection): void {
						update(page => {
							page.sections[sectionIdx] = fn(page.sections[sectionIdx])
							return page
						})
					}

					return <div className="bone-section" key={`${page.title}-${sectionIdx}`}><PropertyPageSection section={section} update={updateSection} /></div>
				})}
			</div>
			<div>
				<Carousel>
					{page.image?.map((image, imageIdx) => {
						return <img key={`${page.title}-${imageIdx}`} className="bone-page-image" src={image} alt={page.title} />
					})}
				</Carousel>
			</div>
		</div>
	)
}

/**
 * PropertyPageSection rappresenta la sezione di una pagina con la tabella di opzioni.
 * L'attributo `section` contiene il template della tabella, quindi genera prima gli header della tabella,
 * poi per ogni riga della tabella prima genera i campi fissi di ogni riga, quindi a seguire i vari input segnati
 * nel template.
 * @param section attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPageSection({ section, update }: { section: BonePropertyPageSection, update: (fn: (section: BonePropertyPageSection) => BonePropertyPageSection) => void }) {
	return (
		<table className="props-table">
			<thead>
				<tr>
					{/* Generazione degli header della tabella */}
					{section.table.headers.map(th => {
						return <th key={th}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{section.table.indexes.map((row, rowIdx) => {
					const rowName = row[0]
					const colOffset = row.length;

					return (
						<tr key={rowName}>
							{/* Generazione dei campi fissi di ogni riga della tabella */}
							{row.map((rowConst, rowConstIdx) => {
								return <td key={`${rowName}-${rowConstIdx}`}>{rowConst}</td>
							})}

							{/* Generazione degli input della tabella dal template */}
							{section.table.template.map((template, fieldIdx) => {
								// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
								function updatePropertyRow(fn: (state?: BoneProperty) => BoneProperty): void {
									update(section => {
										if (!section.props) {
											section.props = []
										}

										if (!section.props[rowIdx]) {
											section.props[rowIdx] = []
										}

										section.props[rowIdx][fieldIdx] = fn(section.props[rowIdx][fieldIdx])
										return section
									})
								}

								let value: BoneProperty | undefined;
								if (section.props && section.props[rowIdx]) {
									value = section.props[rowIdx][fieldIdx]
								}

								const key = `${rowName}-${fieldIdx + colOffset}`

								return <Property key={key} value={value} template={template} update={updatePropertyRow} />
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

/**
 * Property rappresenta un'opzione della tabella. In base al valore `mode` in `template` il componente genera l'input sottostante
 * corretto.
 * @param template attributo derivato dallo stato globale
 * @param value (opzionale) attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function Property({ template, value, update }: { template: BonePropertyTemplate, value?: BoneProperty, update: (fn: (value?: BoneProperty) => BoneProperty) => void }) {
	switch (template.mode) {
		case InputMode.Text:
			function handleTextInput(ev: ChangeEvent<HTMLInputElement>) {
				update(() => {
					return ev.target.value
				})
			}

			value = (value as (string | undefined)) || ''

			return <td><input type="text" value={value} onChange={handleTextInput} /></td>;
		case InputMode.Dropdown:
			function setSelected(selected: string) {
				update(() => {
					return selected
				})
			}

			return <td><Dropdown
				options={template.dropdownArgs || []}
				selectedField={value as (string | undefined)}
				setSelectedField={setSelected}
			/></td>
		case InputMode.Multistage:
			function updateMultistage(fn: (value?: BonePropertyMultistage) => BonePropertyMultistage) {
				update(value => {
					return fn(value as (BonePropertyMultistage | undefined))
				})
			}

			return <MultistageProperty template={template} multistage={value as (BonePropertyMultistage | undefined)} update={updateMultistage} />
	}
}

function MultistageProperty({ template, multistage, update }: { template: BonePropertyTemplate, multistage?: BonePropertyMultistage, update: (fn: (value?: BonePropertyMultistage) => BonePropertyMultistage) => void }) {
	const options: string[] | undefined = template.multistageArgs?.map(arg => arg.value)

	function setSelected(selected: string) {
		update(multistage => {
			if (!multistage) {
				return { value: selected }
			}

			if (multistage.value === selected) {
				return multistage
			}

			multistage.value = selected
			multistage.next = undefined
			return multistage
		})
	}
	
	if (!multistage) {
		return <td>
			<Dropdown
				options={options || []}
				setSelectedField={setSelected}
			/>
		</td>
	}

	function FirstStage() {
		return <td><Dropdown
			options={options || []}
			selectedField={multistage?.value}
			setSelectedField={setSelected}
		/></td>
	}

	const nextTemplate = template.multistageArgs?.filter(arg => arg.value === multistage.value)[0].next
	if (!nextTemplate) {
		return <>
			<FirstStage />
			<td>Errore, template non trovato</td>
		</>
	}
	const nextValue = multistage.next
	function nextUpdate(fn: (value?: BoneProperty) => BoneProperty) {
		update(multistage => {
			if (!multistage) {
				throw new Error('multistage is undefined after the first stage')
			}

			multistage.next = fn(multistage?.next)
			return multistage
		})
	}

	return <>
		<FirstStage />
		<Property template={nextTemplate} value={nextValue} update={nextUpdate} />
	</>
}
