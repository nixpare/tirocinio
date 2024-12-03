import './Form.css'

import { createContext, FormEvent, MouseEvent, useContext, useState } from 'react'
import { Updater } from 'use-immer'
import { FormSectionTemplate, FormData, FormSectionData, FormTableFieldImageRef, FormTableRowSpecial } from '../../models/Form'
import { Table, UpdateTableFunc } from './Table'
import { Carousel } from '../UI/Carousel'

export type UpdateFormFunc = Updater<FormData>
export type UpdateSectionFunc = Updater<FormSectionData>

type CreateImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number, x: number, y: number) => void
type DeleteImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void
type HighlightImageCircleGenericFunc = (tableIdx: number, imageIdx: number, circleIdx: number) => void

export type DeleteImageCircleFunc = (imageIdx: number, circleIdx: number) => void
export type HighlightImageCircleFunc = (imageIdx: number, circleIdx: number) => void

export const EditModeContext = createContext(false)
export const VerticalSplitContext = createContext(false)

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
export function Form({ data, updateData, initialSection }: {
	data: FormData, updateData: UpdateFormFunc,
	initialSection?: number
}) {
	const editMode = useContext(EditModeContext)

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()

		console.log(data)
	}

	const sections = data.template.sections.map((section, sectionIdx) => {
		// updatePage è la funzione di produzione sullo stato per la pagina specifica
		const updateSection: UpdateSectionFunc = (updater) => {
			updateData(formData => {
				if (!formData.sections)
					formData.sections = []

				if (typeof updater !== 'function') {
					formData.sections[sectionIdx] = updater
					return
				}

				if (!formData.sections[sectionIdx])
					formData.sections[sectionIdx] = []

				updater(formData.sections[sectionIdx])
			})
		}

		return <VerticalSplitContext.Provider value={false} key={section.title}>
			<FormSection section={section} data={data.sections?.[sectionIdx]} update={updateSection} />
		</VerticalSplitContext.Provider>
	})

	if (!editMode) {
		return <div className="container form">
			<h4 className="name">{data.name}</h4>
			<div className="form-sections">
				<Carousel>
					{sections}
				</Carousel>
			</div>
		</div>
	}

	const [visiblePage, setVisiblePage] = useState(initialSection && initialSection < data.template.sections.length ? initialSection : 0)

	return (
		<div className="container form">
			<h4 className="name">{data.name}</h4>
			<form className="form-sections" onSubmit={handleSubmit}>
				<Carousel visibleState={{ visible: visiblePage, setVisible: setVisiblePage }}>
					{sections}
				</Carousel>
				<button type="submit">Invia</button>
			</form>
		</div>
	);
}

type FormSectionImageCircle = (((({ x: number, y: number } | undefined)[]) | undefined)[] | undefined)[] | undefined
type FormSectionActiveImageCircle = boolean[][][]

/**
 * PropertyPage rappresenta una pagina di opzioni per la struttura anatomica, la quale contiene, eventualmente, una o più immagini
 * relative alle opzioni della pagina e una o più sezioni (ogni sezione coincide con una tabella di opzioni).
 * Se non ci sono immagini associate alla pagina, vengono mostrare solo le sezioni, altrimenti la schermata è divisa
 * in due.
 * @param page attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function FormSection({ section, data, update }: {
	section: FormSectionTemplate, data: FormSectionData,
	update: UpdateSectionFunc
}) {
	const [activeTable, setActiveTable] = useState(0)
	const [activeImage, setActiveImage] = useState(0)
	const [activeCircles, setActiveCircles] = useState([] as FormSectionActiveImageCircle)
	const verticalSplit = useContext(VerticalSplitContext)

	const circles: FormSectionImageCircle = data?.map((table, tableIdx) => {
		if (!section.tables[tableIdx].interactsWithImage)
			return undefined

		return section.image?.map((_, imageIdx) => {
			return table?.map(row => {
				const circle = row?.[FormTableRowSpecial.CircleInfo] as FormTableFieldImageRef | undefined
				if (circle == undefined)
					return undefined

				if (circle.imageIdx !== imageIdx)
					return undefined

				return { x: circle.x, y: circle.y }
			})
		})
	})

	const createCircleGeneric: CreateImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx, x, y) => {
		update(sectionData => {
			if (!sectionData)
				throw new Error('updating state of non-existing form section data')

			if (!sectionData[tableIdx])
				sectionData[tableIdx] = []

			sectionData[tableIdx][circleIdx] = {
				[FormTableRowSpecial.CircleInfo]: {
					imageIdx: imageIdx,
					x: x,
					y: y
				}
			}
		})
	}

	const deleteCircleGeneric: DeleteImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		update(sectionData => {
			if (!sectionData)
				throw new Error('updating state of non-existing form section data')

			if (!sectionData[tableIdx] || !sectionData[tableIdx][imageIdx] || !sectionData[tableIdx][imageIdx][circleIdx])
				return

			delete sectionData[tableIdx][imageIdx][circleIdx]
		})
	}

	const highlightCircleGeneric: HighlightImageCircleGenericFunc = (tableIdx, imageIdx, circleIdx) => {
		if (!circles || !circles[tableIdx] || !circles[tableIdx][imageIdx] || !circles[tableIdx][imageIdx][circleIdx]) {
			setActiveCircles([])
			return
		}

		let newActiveCircles: FormSectionActiveImageCircle = []
		newActiveCircles[tableIdx] = []
		newActiveCircles[tableIdx][imageIdx] = []
		newActiveCircles[tableIdx][imageIdx][circleIdx] = true

		setActiveCircles(newActiveCircles)
	}

	const tables = section.tables.map((table, tableIdx) => {
		// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
		const updateTable: UpdateTableFunc = (updater) => {
			update(sectionData => {
				if (!sectionData)
					throw new Error('updating state of non-existing form section data')

				if (typeof updater !== 'function') {
					sectionData[tableIdx] = updater
					return
				}

				if (!sectionData[tableIdx]) {
					sectionData[tableIdx] = []
				}

				updater(sectionData[tableIdx])
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

		return <Table key={`${section.title}-${tableIdx}`}
			table={table} data={data?.[tableIdx]} update={updateTable}
			active={activeTable === tableIdx} setActive={setActive}
			deleteCircle={deleteCircle} highlightCircle={highlightCircle}
		/>
	})

	if (!section.image) {
		return <div className="container form-section">
			<h3>{section.title}</h3>
			{tables}
		</div>
	}

	const splitClassName = verticalSplit ? undefined : 'split'

	return <div className="form-section">
		<h3>{section.title}</h3>
		<div className={splitClassName}>
			<div className="container">
				{tables}
			</div>
			<div className="container">
				<div className="images">
					<Carousel visibleState={{ visible: activeImage, setVisible: setActiveImage }} >
						{section.image?.map((image, imageIdx) => {
							return <FormSectionImage key={`${section.title}-${imageIdx}`}
								image={image} idx={imageIdx}
								section={section} sectionData={data} activeTable={activeTable}
								circles={circles} activeCircles={activeCircles} createCircleGeneric={createCircleGeneric}
							/>
						})}
					</Carousel>
				</div>
			</div>
		</div>
	</div>
}

function FormSectionImage({ image, idx, section, sectionData, activeTable, circles, activeCircles, createCircleGeneric }: {
	image: string, idx: number
	section: FormSectionTemplate, sectionData: FormSectionData, activeTable: number,
	circles: FormSectionImageCircle, activeCircles: boolean[][][], createCircleGeneric: CreateImageCircleGenericFunc
}) {
	const editMode = useContext(EditModeContext)

	const handleImageClick = (ev: MouseEvent<HTMLImageElement, PointerEvent>): void => {
		ev.preventDefault();

		if (!editMode)
			return

		if (!section.tables[activeTable].interactsWithImage)
			return

		const img = ev.nativeEvent.target as HTMLImageElement
		const imageLeft = Math.round(ev.nativeEvent.offsetX / img.offsetWidth * 100)
		const imageTop = Math.round(ev.nativeEvent.offsetY / img.offsetHeight * 100)

		const rowIdx = sectionData?.[activeTable]?.length || 0

		createCircleGeneric(activeTable, idx, rowIdx, imageLeft, imageTop)
	}

	return <div className="image">
		<img
			src={image}
			alt={section.title}
			onClick={handleImageClick}
		/>
		{circles?.map((imageCircles, tableIdx) => {
			return imageCircles?.[idx]?.map((circle, circleIdx) => {
				if (!circle)
					return undefined

				const activeClassName = activeCircles[tableIdx]?.[idx]?.[circleIdx] ? ' active' : ''
				const className = 'image-circle' + activeClassName

				return <div key={`${tableIdx}-${idx}-${circleIdx}`} className={className} style={{
					left: `${circle.x}%`,
					top: `${circle.y}%`,
				}}></div>
			})
		})}
	</div>
}
