import './Form.css'

import { createContext, useContext, useState } from 'react'
import { Updater } from 'use-immer'
import { FormSectionTemplate, FormData, FormSectionData, FormSectionStarterData } from '../../models/Form'
import { Field, UpdateFieldFunc } from './Field'
import { Carousel } from '../UI/Carousel'

export type UpdateFormFunc = Updater<FormData>
export type UpdateSectionFunc = Updater<FormSectionData>

export const FormDataContext = createContext<FormData | undefined>(undefined)
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
					formData.sections[sectionIdx] = {}

				updater(formData.sections[sectionIdx])
			})
		}

		return <VerticalSplitContext.Provider value={false} key={section.title}>
			<FormDataContext.Provider value={data}>
				<FormSection section={section} data={data.sections?.[sectionIdx]} update={updateSection} />
			</FormDataContext.Provider>
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
			<form className="form-sections">
				<Carousel visibleState={{ visible: visiblePage, setVisible: setVisiblePage }}>
					{sections}
				</Carousel>
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
export function FormSection({ section, data, update }: {
	section: FormSectionTemplate, data: FormSectionData,
	update: UpdateSectionFunc
}) {
	const verticalSplit = useContext(VerticalSplitContext)

	const starters = section.starters.map((starter) => {
		// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
		const updateStarter: UpdateFieldFunc = (updater) => {
			update(sectionData => {
				if (!sectionData)
					throw new Error('updating state of non-existing form section data')

				if (typeof updater !== 'function') {
					sectionData[starter.starterID] = updater as FormSectionStarterData
					return
				}

				if (!sectionData[starter.starterID]) {
					sectionData[starter.starterID] = {
						type: starter.type
					} as FormSectionStarterData
				}

				updater(sectionData[starter.starterID])
			})
		}

		return <Field key={`${section.title}-${starter.starterID}`}
			field={starter}
			data={data?.[starter.starterID]} update={updateStarter}
		/>
	})

	if (!section.image) {
		return <div className="container form-section">
			<h3>{section.title}</h3>
			{starters}
		</div>
	}

	const splitClassName = verticalSplit ? undefined : 'split'

	return <div className="form-section">
		<h3>{section.title}</h3>
		<div className={splitClassName}>
			<div className="container">
				{starters}
			</div>
			<div className="container">
				<div className="images">
					<Carousel>
						{section.image?.map((image) => {
							return <div className="image">
								<img src={image} alt={section.title} />
							</div>
						})}
					</Carousel>
				</div>
			</div>
		</div>
	</div>
}
