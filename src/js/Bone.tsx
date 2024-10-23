import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import { produce } from 'immer'
import { BoneProperty, InputMode, BonePropertyPage, BonePropertyPageTable, BonePropertyMultistage, BoneTemplate, BoneState, BonePropertyInput, PropertyTableType, BonePageState, BoneTableState, BonePropertyImageRef } from './models/Bone'

import { Dropdown } from './Dropdown'
import { Carousel } from './Carousel'

import '../css/Bone.css'

type UpdatePageFunc = (fn: (page: BonePageState) => BonePageState) => void
type UpdateTableFunc = (fn: (table: BoneTableState) => BoneTableState) => void
type UpdatePropertyFunc = (fn: (prop: BoneProperty) => BoneProperty) => void

type CreateImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number, x: number, y: number, shouldUpdate: boolean) => void
type DeleteImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void
type HighlightImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void

type CreateImageCircleFunc = (imageIdx: number, circleIdx: number, x: number, y: number) => void
type DeleteImageCircleFunc = (imageIdx: number, circleIdx: number) => void
type HighlightImageCircleFunc = (imageIdx: number, circleIdx: number) => void

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
export function Bone({ template, state, setState, editMode }: { template: BoneTemplate, state: BoneState, setState: (newState: BoneState) => void, editMode?: boolean }) {
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
				<h4 className="bone-name">{template.name}</h4>
				<p>To be implemented</p>
			</div>
		)
	}

	function updateState(fn: (prev: BoneState) => BoneState): void {
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
					{template.pages.map((page, pageIdx) => {
						// updatePage è la funzione di produzione sullo stato per la pagina specifica
						const updatePage: UpdatePageFunc = (fn) => {
							updateState(state => {
								const newPage = fn(state.props?.[pageIdx])
								if (!newPage)
									return state

								if (!state.props) {
									state.props = []
								}

								state.props[pageIdx] = newPage
								return state
							})
						}

						return <PropertyPage key={page.title} page={page} state={state.props?.[pageIdx]} update={updatePage} />;
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
function PropertyPage({ page, state, update }: { page: BonePropertyPage, state: BonePageState, update: UpdatePageFunc }) {
	const [circles, setCircles] = useState([] as { x: number, y: number }[][][])
	const [activeTable, setActiveTable] = useState(0)
	const [activeCircles, setActiveCircles] = useState([] as boolean[][][])
	const [activeImage, setActiveImage] = useState(0)

	const createCircleGeneric: CreateImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx, x, y, shouldUpdate) => {
		if (circles[tableIdx] && circles[tableIdx][imageIdx] && circles[tableIdx][imageIdx][circleIdx])
			return

		setCircles(produce(circles => {
			if (!circles[tableIdx])
				circles[tableIdx] = []

			if (!circles[tableIdx][imageIdx])
				circles[tableIdx][imageIdx] = []

			circles[tableIdx][imageIdx][circleIdx] = { x: x, y: y }
		}))

		if (!shouldUpdate)
			return

		update(page => {
			if (!page)
				page = []

			if (!page[tableIdx])
				page[tableIdx] = []

			page[tableIdx][circleIdx] = [{
				imageIdx: imageIdx,
				x: x,
				y: y
			}]

			return page
		})
	}

	const deleteCircleGeneric: DeleteImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		setCircles(produce(circles => {
			if (!circles[tableIdx] || !circles[tableIdx][imageIdx])
				return

			circles[tableIdx][imageIdx] = circles[tableIdx][imageIdx].filter((_, index) => index !== circleIdx)
			return circles
		}))
	}

	const highlightCircleGeneric: HighlightImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		setActiveCircles(produce(activeCircles => {
			if (!circles[tableIdx] || !circles[tableIdx][imageIdx] || !circles[tableIdx][imageIdx][circleIdx])
				return

			activeCircles = []
			activeCircles[tableIdx] = []
			activeCircles[tableIdx][imageIdx] = []

			activeCircles[tableIdx][imageIdx][circleIdx] = true
			return activeCircles
		}))
		
		setActiveImage(imageIdx)
	}
	
	const tables = page.tables.map((table, tableIdx) => {
		// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
		const updateTable: UpdateTableFunc = (fn) => {
			update(page => {
				const newTable = fn(page?.[tableIdx])
				if (!newTable)
					return page

				if (!page) {
					page = []
				}

				page[tableIdx] = newTable
				return page
			})
		}

		const setActive = () => {
			setActiveTable(tableIdx)
		}

		let tableElem: React.JSX.Element
		switch (table.type) {
			case PropertyTableType.Default:
				tableElem = <PropertyPageTableDefault
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
				/>
				break;
			case PropertyTableType.VariadicButton:
				tableElem = <PropertyPageTableVariadicButton
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
				/>
				break;
			case PropertyTableType.VariadicMouse:
				const createCircle: CreateImageCircleFunc = (imageIdx, circleIdx, x, y) => {
					createCircleGeneric(tableIdx, imageIdx, circleIdx, x, y, false)
				}

				const deleteCircle: DeleteImageCircleFunc = (imageIdx, circleIdx) => {
					deleteCircleGeneric(tableIdx, imageIdx, circleIdx)
				}

				const highlightCircle: HighlightImageCircleFunc = (imageIdx, circleIdx) => {
					highlightCircleGeneric(tableIdx, imageIdx, circleIdx)
				}

				tableElem = <PropertyPageTableVariadicMouse
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
					createCircle={createCircle} deleteCircle={deleteCircle} highlightCircle={highlightCircle}
				/>
				break;
		}

		return <div className="bone-table" key={`${page.title}-${tableIdx}`}>
			{tableElem}
		</div>
	})

	if (!page.image) {
		return <div className="bone-page">
			<h3>{page.title}</h3>
			{tables}
		</div>
	}

	return (
		<div className="bone-page">
			<h3>{page.title}</h3>
			<div className="split">
				<div>
					{tables}
				</div>
				<div>
					<Carousel visibleState={{ visible: activeImage, setVisible: setActiveImage }} >
						{page.image?.map((image, imageIdx) => {
							const handleImageClick = (ev: MouseEvent<HTMLImageElement, PointerEvent>): void => {
								if (page.tables[activeTable].type !== PropertyTableType.VariadicMouse)
									return
								
								const img = ev.nativeEvent.target as HTMLImageElement
								const imageLeft = Math.round(ev.nativeEvent.offsetX / img.offsetWidth * 100)
								const imageTop = Math.round(ev.nativeEvent.offsetY / img.offsetHeight * 100)

								const rowIdx = state?.[activeTable]?.length || 0

								createCircleGeneric(activeTable, imageIdx, rowIdx, imageLeft, imageTop, true)
							}

							return <div className="bone-page-image" key={`${page.title}-${imageIdx}`}>
								<img
									src={image}
									alt={page.title}
									onClick={handleImageClick}
								/>
								{circles.map((imageCircles, tableIdx) => {
									return imageCircles[imageIdx]?.map((circle, circleIdx) => {
										const activeClassName = activeCircles[tableIdx]?.[imageIdx]?.[circleIdx] ? ' active' : ''
										const className = 'bone-page-image-tracker' + activeClassName

										return <div key={`${tableIdx}-${imageIdx}-${circleIdx}`} className={className} style={{
											left: `${circle.x}%`,
											top: `${circle.y}%`,
										}}></div>
									})
								})}
							</div>
						})}
					</Carousel>
				</div>
			</div>
		</div>
	)
}

/**
 * PropertyPageTable rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPageTableDefault({ table, state, update, active, setActive }: {
	table: BonePropertyPageTable, state: BoneTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void
}) {
	return (
		<table className={`${active ? 'active' : ''}`} onMouseEnter={setActive}>
			<thead>
				<tr>
					{/* Generazione degli header della tabella */}
					{table.headers.map(th => {
						return <th key={th}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{table.indexes?.map((row, rowIdx) => {
					const rowName = row[0]
					const colOffset = row.length;

					return (
						<tr key={rowName}>
							{/* Generazione dei campi fissi di ogni riga della tabella */}
							{row.map((rowConst, rowConstIdx) => {
								return <td key={`${rowName}-${rowConstIdx}`}>{rowConst}</td>
							})}

							{/* Generazione degli input della tabella dal template */}
							{table.inputs.map((input, fieldIdx) => {
								// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
								const updateProperty: UpdatePropertyFunc = (fn) => {
									update(table => {
										const newProp = fn(table?.[rowIdx][fieldIdx])
										if (!newProp)
											return table

										if (!table) {
											table = []
										}

										if (!table[rowIdx]) {
											table[rowIdx] = []
										}

										table[rowIdx][fieldIdx] = newProp
										return table
									})
								}

								let propertyState: BoneProperty | undefined;
								if (state && state[rowIdx]) {
									propertyState = state[rowIdx][fieldIdx]
								}

								const key = `${rowName}-${fieldIdx + colOffset}`

								return <Property key={key} state={propertyState} template={input} update={updateProperty} />
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

/**
 * PropertyPageTable rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPageTableVariadicButton({ table, state, update, active, setActive }: {
	table: BonePropertyPageTable, state: BoneTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void
}) {
	function addRow() {
		update(table => {
			if (!table) {
				table = []
			}

			table.push([])
			return table
		})
	}
	
	return (
		<div>
			<table className={`${active ? 'active' : ''}`} onMouseEnter={setActive}>
				<thead>
					<tr>
						<th key={0}></th>
						<th key={1}>#</th>
						{/* Generazione degli header della tabella */}
						{table.headers.map((th, thIdx) => {
							return <th key={thIdx + 2}>{th}</th>
						})}
					</tr>
				</thead>
				<tbody>
					{/* Generazione dei valori già esistenti della tabella */}
					{state?.map((row, rowIdx) => {
						const deleteRow: () => void = () => {
							update(table => {
								if (!table)
									return table

								return table.filter((_, index) => {
									return index !== rowIdx
								})
							})
						}

						return <tr key={rowIdx}>
							<td>
								<button onClick={deleteRow}>-</button>
							</td>
							<td>
								{rowIdx + 1}
							</td>
							{table.inputs.map((input, fieldIdx) => {
								// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
								const updateProperty: UpdatePropertyFunc = (fn) => {
									update(table => {
										const newProp = fn(table?.[rowIdx][fieldIdx])
										if (!newProp)
											return table

										if (!table) {
											table = []
										}

										if (!table[rowIdx]) {
											table[rowIdx] = []
										}

										table[rowIdx][fieldIdx] = newProp
										return table
									})
								}

								const key = `${rowIdx}-${fieldIdx}`
								const propertyState = row?.[fieldIdx] || undefined

								return <Property key={key} state={propertyState} template={input} update={updateProperty} />
							})}
						</tr>
					})}
				</tbody>
			</table>
			<button onClick={addRow}>{table.variadicPlaceholder || '+'}</button>
		</div>
	)
}

/**
 * PropertyPageTable rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPageTableVariadicMouse({ table, state, update, active, setActive, createCircle, deleteCircle, highlightCircle }: {
	table: BonePropertyPageTable, state: BoneTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void,
	createCircle: CreateImageCircleFunc, deleteCircle: DeleteImageCircleFunc, highlightCircle: HighlightImageCircleFunc
}) {
	return (
		<table className={`${active ? 'active' : ''}`} onMouseEnter={setActive}>
			<thead>
				<tr>
					<th key={0}></th>
					<th key={1}>#</th>
					{/* Generazione degli header della tabella */}
					{table.headers.map((th, thIdx) => {
						return <th key={thIdx + 2}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{/* Generazione dei valori già esistenti della tabella */}
				{state?.map((row, rowIdx) => {
					const deleteRow: () => void = () => {
						const circle = row[0] as BonePropertyImageRef
						deleteCircle(circle.imageIdx, rowIdx)

						update(table => {
							if (!table)
								return table

							return table.filter((_, index) => {
								return index !== rowIdx
							})
						})
					}

					const circle = row[0] as BonePropertyImageRef
					createCircle(circle.imageIdx, rowIdx, circle.x, circle.y)

					const onRowHover = () => {
						highlightCircle(circle.imageIdx, rowIdx)
					}

					return <tr key={rowIdx} onMouseEnter={onRowHover}>
						<td>
							<button onClick={deleteRow}>-</button>
						</td>
						<td>
							{rowIdx + 1}
						</td>
						{table.inputs.map((input, fieldIdx) => {
							// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
							const updateProperty: UpdatePropertyFunc = (fn) => {
								update(table => {
									const newProp = fn(table?.[rowIdx][fieldIdx+1]) // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine
									if (!newProp)
										return table

									if (!table) {
										table = []
									}

									if (!table[rowIdx]) {
										table[rowIdx] = []
									}

									table[rowIdx][fieldIdx + 1] = newProp  // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine
									return table
								})
							}

							const key = `${rowIdx}-${fieldIdx}`
							const propertyState = row?.[fieldIdx + 1]  // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine

							return <Property key={key} state={propertyState} template={input} update={updateProperty} />
						})}
					</tr>
				})}
			</tbody>
		</table>
	)
}

/**
 * Property rappresenta un'opzione della tabella. In base al valore `mode` in `template` il componente genera l'input sottostante
 * corretto.
 * @param template attributo derivato dallo stato globale
 * @param state (opzionale) attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function Property({ template, state, update }: { template: BonePropertyInput, state?: BoneProperty, update: (fn: (value?: BoneProperty) => BoneProperty) => void }) {
	switch (template.mode) {
		case InputMode.Text:
			function handleTextInput(ev: ChangeEvent<HTMLInputElement>) {
				update(() => {
					return ev.target.value
				})
			}

			state = (state as (string | undefined)) || ''

			return <td><input type="text" value={state} onChange={handleTextInput} /></td>;
		case InputMode.Dropdown:
			function setSelected(selected: string) {
				update(() => {
					return selected
				})
			}

			return <td><Dropdown
				options={template.dropdownArgs || []}
				selectedField={state as (string | undefined)}
				setSelectedField={setSelected}
			/></td>
		case InputMode.Multistage:
			function updateMultistage(fn: (value?: BonePropertyMultistage) => BonePropertyMultistage) {
				update(value => {
					return fn(value as (BonePropertyMultistage | undefined))
				})
			}

			return <MultistageProperty template={template} state={state as (BonePropertyMultistage | undefined)} update={updateMultistage} />
	}
}

function MultistageProperty({ template, state, update }: { template: BonePropertyInput, state?: BonePropertyMultistage, update: (fn: (value?: BonePropertyMultistage) => BonePropertyMultistage) => void }) {
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

	if (!state) {
		return <td>
			<Dropdown
				options={options || []}
				setSelectedField={setSelected}
			/>
		</td>
	}

	const firstStage = (<td>
		<Dropdown
			options={options || []}
			selectedField={state.value}
			setSelectedField={setSelected}
		/>
	</td>)

	const nextTemplate = template.multistageArgs?.filter(arg => arg.value === state.value)[0].next
	if (!nextTemplate) {
		return <>
			{firstStage}
			<td>Errore, template non trovato</td>
		</>
	}
	const nextValue = state.next
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
		{firstStage}
		<Property template={nextTemplate} state={nextValue} update={nextUpdate} />
	</>
}
