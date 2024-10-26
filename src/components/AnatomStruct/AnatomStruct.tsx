import { createContext, FormEvent, MouseEvent, useContext, useState } from 'react'
import { produce } from 'immer'
import { AnatomStructPage, AnatomStructState, AnatomStructTableType, AnatomStructPageState, AnatomStructPropertyImageRef, AnatomStructRowSpecial } from '../../models/AnatomStructTypes'
import { Table, UpdateTableFunc } from './Table'
import { Carousel } from '../UI/Carousel'

import './AnatomStruct.css'

type UpdatePageFunc = (fn: (page: AnatomStructPageState) => AnatomStructPageState) => void

type CreateImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number, x: number, y: number) => void
type DeleteImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void
type HighlightImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void

export type DeleteImageCircleFunc = (imageIdx: number, circleIdx: number) => void
export type HighlightImageCircleFunc = (imageIdx: number, circleIdx: number) => void

export const EditModeContext = createContext(false)

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
 * @return ReactNode
 */
export function AnatomStruct({ anatomStruct, setAnatomStruct }: { anatomStruct: AnatomStructState, setAnatomStruct: (newState: AnatomStructState) => void }) {
	const editMode = useContext(EditModeContext)

	function updateState(fn: (prev: AnatomStructState) => AnatomStructState): void {
		setAnatomStruct(produce(anatomStruct, fn))
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(anatomStruct.props)
	}

	const pages = anatomStruct.template.pages.map((page, pageIdx) => {
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

		return <PropertyPage key={page.title} page={page} state={anatomStruct.props?.[pageIdx]} update={updatePage} />;
	})

	if (!editMode) {
		return <div className="container anatom-struct">
			<h4 className="anatom-struct-name">{anatomStruct.name}</h4>
			<div className="property-pages">
				<Carousel>
					{pages}
				</Carousel>
			</div>
		</div>
	}

	return (
		<div className="container anatom-struct">
			<h4 className="anatom-struct-name">{anatomStruct.name}</h4>
			<form className="property-pages" onSubmit={handleSubmit}>
				<Carousel>
					{pages}
				</Carousel>
				<button type="submit">Invia</button>
			</form>
		</div>
	);
}

type PropertyPageImageCircle = (((({ x: number, y: number } | undefined)[]) | undefined)[] | undefined)[] | undefined

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

	const circles: PropertyPageImageCircle = state?.map((table, tableIdx) => {
		if (page.tables[tableIdx].type !== AnatomStructTableType.VariadicMouse)
			return undefined

		return page.image?.map((_, imageIdx) => {
			return table?.map(row => {
				const circle = row[AnatomStructRowSpecial.CircleInfo] as AnatomStructPropertyImageRef

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

			page[tableIdx][circleIdx] = {
				[AnatomStructRowSpecial.CircleInfo]: {
					imageIdx: imageIdx,
					x: x,
					y: y
				}
			}

			return page
		})
	}

	const deleteCircleGeneric: DeleteImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		update(page => {
			if (!page || !page[tableIdx] || !page[tableIdx][imageIdx] || !page[tableIdx][imageIdx][circleIdx])
				return

			delete page[tableIdx][imageIdx][circleIdx]
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

		const deleteCircle: DeleteImageCircleFunc = (imageIdx, circleIdx) => {
			deleteCircleGeneric(tableIdx, imageIdx, circleIdx)
		}

		const highlightCircle: HighlightImageCircleFunc = (imageIdx, circleIdx) => {
			highlightCircleGeneric(tableIdx, imageIdx, circleIdx)
		}

		return <Table key={`${page.title}-${tableIdx}`}
			table={table} state={state?.[tableIdx]} update={updateTable}
			active={activeTable === tableIdx} setActive={setActive}
			deleteCircle={deleteCircle} highlightCircle={highlightCircle}
		/>
	})

	if (!page.image) {
		return <div className="property-page">
			<h3>{page.title}</h3>
			{tables}
		</div>
	}

	return <div className="property-page">
		<h3>{page.title}</h3>
		<div className="split">
			<div>
				{tables}
			</div>
			<div className="property-page-images">
				<Carousel visibleState={{ visible: activeImage, setVisible: setActiveImage }} >
					{page.image?.map((image, imageIdx) => {
						return <PropertyPageImage key={`${page.title}-${imageIdx}`}
							image={image} idx={imageIdx}
							page={page} pageState={state} activeTable={activeTable}
							circles={circles} activeCircles={activeCircles} createCircleGeneric={createCircleGeneric}
						/>
					})}
				</Carousel>
			</div>
		</div>
	</div>
}

function PropertyPageImage({ image, idx, page, pageState, activeTable, circles, activeCircles, createCircleGeneric }: {
	image: string, idx: number
	page: AnatomStructPage, pageState: AnatomStructPageState, activeTable: number,
	circles: PropertyPageImageCircle, activeCircles: boolean[][][], createCircleGeneric: CreateImageCircleGenericFunc
}) {
	const editMode = useContext(EditModeContext)

	const handleImageClick = (ev: MouseEvent<HTMLImageElement, PointerEvent>): void => {
		ev.preventDefault();
		
		if (!editMode)
			return

		if (page.tables[activeTable].type !== AnatomStructTableType.VariadicMouse)
			return

		const img = ev.nativeEvent.target as HTMLImageElement
		const imageLeft = Math.round(ev.nativeEvent.offsetX / img.offsetWidth * 100)
		const imageTop = Math.round(ev.nativeEvent.offsetY / img.offsetHeight * 100)

		const rowIdx = pageState?.[activeTable]?.length || 0

		createCircleGeneric(activeTable, idx, rowIdx, imageLeft, imageTop)
	}

	return <div className="property-page-image">
		<img
			src={image}
			alt={page.title}
			onClick={handleImageClick}
		/>
		{circles?.map((imageCircles, tableIdx) => {
			return imageCircles?.[idx]?.map((circle, circleIdx) => {
				if (!circle)
					return undefined

				const activeClassName = activeCircles[tableIdx]?.[idx]?.[circleIdx] ? ' active' : ''
				const className = 'property-page-image-circle' + activeClassName

				return <div key={`${tableIdx}-${idx}-${circleIdx}`} className={className} style={{
					left: `${circle.x}%`,
					top: `${circle.y}%`,
				}}></div>
			})
		})}
	</div>
}
