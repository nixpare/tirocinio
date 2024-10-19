import { ChangeEvent, FormEvent, useState } from 'react'
import { produce } from 'immer'
import { Bone as BoneType, BoneProperty, InputMode, BonePropertyPage, BonePropertyTemplate, BonePropertyPageSection } from './models/Bone'

import { Dropdown } from './Dropdown'
import { Carousel } from './Carousel'

import '../css/Bone.css'

/**
 * Bone è il macro elemento che gestisce la visualizzazione e la modifica / inserimento
 * di un osso. Il parametro `editMode` permette questa impostazione.
 * 
 * Il parametro `bone` invece è lo stato utilizzato per la creazione del componente,
 * dal quale verrà creato un react state, per eventuali modifiche.
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
						// updatePage è la funzione di produzione sullo state per la pagina specifica
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


function PropertyPage({ page, update }: { page: BonePropertyPage, update: (fn: (page: BonePropertyPage) => BonePropertyPage) => void }) {
	function PageSection() {
		return page.sections.map((section, sectionIdx) => {
			function updateSection(fn: (section: BonePropertyPageSection) => BonePropertyPageSection): void {
				update(page => {
					page.sections[sectionIdx] = fn(page.sections[sectionIdx])
					return page
				})
			}

			return <div className="bone-section" key={`${page.title}-${sectionIdx}`}><PropertyPageSection section={section} update={updateSection} /></div>
		})
	}
	
	function PageImage() {
		return (
			<Carousel>
				{page.image?.map((image, imageIdx) => {
					return <img key={`${page.title}-${imageIdx}`} className="bone-page-image" src={image} alt={page.title} />
				})}
			</Carousel>
		)
	}

	if (!page.image) {
		return <div><PageSection /></div>
	}
	
	return (
		<div className="split">
			<div><PageSection /></div>
			<div><PageImage /></div>
		</div>
	)
}

function PropertyPageSection({ section, update }: { section: BonePropertyPageSection, update: (fn: (section: BonePropertyPageSection) => BonePropertyPageSection) => void }) {
	return (
		<table className="props-table">
			<thead>
				<tr>
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
							{row.map((rowConst, rowConstIdx) => {
								return <td key={`${rowName}-${rowConstIdx}`}>{rowConst}</td>
							})}

							{section.table.template.map((template, fieldIdx) => {
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

								let value: string | undefined;
								if (section.props && section.props[rowIdx]) {
									value = section.props[rowIdx][fieldIdx]
								}

								return <td key={`${rowName}-${fieldIdx + colOffset}`}><Property value={value} template={template} update={updatePropertyRow} /></td>
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

function Property({ template, value, update }: { template: BonePropertyTemplate, value?: BoneProperty, update: (fn: (value?: BoneProperty) => BoneProperty) => void }) {
	switch (template.mode) {
		case InputMode.Text:
			function handleTextInput(ev: ChangeEvent<HTMLInputElement>) {
				update(() => {
					return ev.target.value
				})
			}

			return <input type="text" value={value ? value : ''} onChange={handleTextInput} />;
		case InputMode.Dropdown:
			function setSelected(selected: string) {
				update(() => {
					return selected
				})
			}

			return <Dropdown
				options={template.options || []}
				selectedField={value || 'Non selezionato'}
				setSelectedField={setSelected}
			/>
	}
}
