import { FormEvent, MouseEvent, useState } from 'react'
import { produce } from 'immer'
import { AnatomStructPage, AnatomStructTemplate, AnatomStructState, AnatomStructTableType, AnatomStructPageState, AnatomStructPropertyImageRef } from './models/AnatomStructTypes'
import { TableDefault, TableVariadicButton, TableVariadicMouse, UpdateTableFunc } from './AnatomStructTable'
import { Carousel } from './Carousel'

import '../css/AnatomStruct.css'

type UpdatePageFunc = (fn: (page: AnatomStructPageState) => AnatomStructPageState) => void

type CreateImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number, x: number, y: number) => void
type DeleteImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void
type HighlightImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void

export type DeleteImageCircleFunc = (imageIdx: number, circleIdx: number) => void
export type HighlightImageCircleFunc = (imageIdx: number, circleIdx: number) => void

/**
 * AnatomStruct è il macro elemento che gestisce la visualizzazione e la modifica / inserimento
 * di una struttura anatomica. Il parametro `editMode` permette questa impostazione.
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
 * @param state stato utilizzato per la creazione del componente
 * @param editMode (opzionale) flag per indicare se abilitare la possibilità di modificare i campi
 * @return ReactNode
 */
export function AnatomStruct({ template, state, setState, editMode }: { template: AnatomStructTemplate, state: AnatomStructState, setState: (newState: AnatomStructState) => void, editMode?: boolean }) {
	// La editMode dovrebbe permettere la visualizzazione di una struttura anatomica
	// già inserita senza la presenza degli input, con la possibilità
	// di passare nella modalità di modifica con un pulsante esterno.
	//
	// C'è da capire se sia conveniente fare si che ogni componente
	// abbia una editMode così da avere le due versioni più "vicine"
	// oppure se duplicarne la natura
	if (!editMode) {
		return (
			<div className="container anatom-struct">
				<h4 className="anatom-struct-name">{template.name}</h4>
				<p>To be implemented</p>
			</div>
		)
	}

	function updateState(fn: (prev: AnatomStructState) => AnatomStructState): void {
		setState(produce(state, fn))
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(state)
	}

	return (
		<div className="container anatom-struct">
			<h4 className="anatom-struct-name">{state.name}</h4>
			<form className="anatom-struct-form" onSubmit={handleSubmit}>
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
 * PropertyPage rappresenta una pagina di opzioni per la struttura anatomica, la quale contiene, eventualmente, una o più immagini
 * relative alle opzioni della pagina e una o più sezioni (ogni sezione coincide con una tabella di opzioni).
 * Se non ci sono immagini associate alla pagina, vengono mostrare solo le sezioni, altrimenti la schermata è divisa
 * in due.
 * @param page attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function PropertyPage({ page, state, update }: { page: AnatomStructPage, state: AnatomStructPageState, update: UpdatePageFunc }) {
	const [activeTable, setActiveTable] = useState(0)
	const [activeImage, setActiveImage] = useState(0)
	const [activeCircles, setActiveCircles] = useState([] as boolean[][][])

	const circles: (((({ x: number, y: number } | undefined)[]) | undefined)[] | undefined)[] | undefined = state?.map((table, tableIdx) => {
		if (page.tables[tableIdx].type !== AnatomStructTableType.VariadicMouse)
			return undefined

		return page.image?.map((_, imageIdx) => {
			return table?.map(row => {
				const circle = row[0] as AnatomStructPropertyImageRef

				if (circle.imageIdx !== imageIdx)
					return undefined

				return { x: circle.x, y: circle.y }
			})
		})
	})

	const createCircleGeneric: CreateImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx, x, y) => {
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
		update(page => {
			if (!page || !page[tableIdx] || !page[tableIdx][imageIdx] || !page[tableIdx][imageIdx][circleIdx])
				return

			page[tableIdx][imageIdx].filter((_, index) => index !== circleIdx)
			return page
		})
	}

	const highlightCircleGeneric: HighlightImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		setActiveCircles(produce(activeCircles => {
			if (!circles || !circles[tableIdx] || !circles[tableIdx][imageIdx] || !circles[tableIdx][imageIdx][circleIdx])
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
			case AnatomStructTableType.Default:
				tableElem = <TableDefault
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
				/>
				break;
			case AnatomStructTableType.VariadicButton:
				tableElem = <TableVariadicButton
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
				/>
				break;
			case AnatomStructTableType.VariadicMouse:
				const deleteCircle: DeleteImageCircleFunc = (imageIdx, circleIdx) => {
					deleteCircleGeneric(tableIdx, imageIdx, circleIdx)
				}

				const highlightCircle: HighlightImageCircleFunc = (imageIdx, circleIdx) => {
					highlightCircleGeneric(tableIdx, imageIdx, circleIdx)
				}

				tableElem = <TableVariadicMouse
					table={table} state={state?.[tableIdx]} update={updateTable}
					active={activeTable === tableIdx} setActive={setActive}
					deleteCircle={deleteCircle} highlightCircle={highlightCircle}
				/>
				break;
		}

		return <div className="anatom-struct-table" key={`${page.title}-${tableIdx}`}>
			{tableElem}
		</div>
	})

	if (!page.image) {
		return <div className="anatom-struct-page">
			<h3>{page.title}</h3>
			{tables}
		</div>
	}

	return (
		<div className="anatom-struct-page">
			<h3>{page.title}</h3>
			<div className="split">
				<div>
					{tables}
				</div>
				<div className="anatom-struct-page-images">
					<Carousel visibleState={{ visible: activeImage, setVisible: setActiveImage }} >
						{page.image?.map((image, imageIdx) => {
							const handleImageClick = (ev: MouseEvent<HTMLImageElement, PointerEvent>): void => {
								ev.preventDefault();

								if (page.tables[activeTable].type !== AnatomStructTableType.VariadicMouse)
									return

								const img = ev.nativeEvent.target as HTMLImageElement
								const imageLeft = Math.round(ev.nativeEvent.offsetX / img.offsetWidth * 100)
								const imageTop = Math.round(ev.nativeEvent.offsetY / img.offsetHeight * 100)

								const rowIdx = state?.[activeTable]?.length || 0

								createCircleGeneric(activeTable, imageIdx, rowIdx, imageLeft, imageTop)
							}

							return <div className="anatom-struct-page-image" key={`${page.title}-${imageIdx}`}>
								<img
									src={image}
									alt={page.title}
									onClick={handleImageClick}
								/>
								{circles?.map((imageCircles, tableIdx) => {
									return imageCircles?.[imageIdx]?.map((circle, circleIdx) => {
										if (!circle)
											return undefined

										const activeClassName = activeCircles[tableIdx]?.[imageIdx]?.[circleIdx] ? ' active' : ''
										const className = 'anatom-struct-page-image-tracker' + activeClassName

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
