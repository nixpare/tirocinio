import 'react-tabs/style/react-tabs.css';
import './Form.css'

import { createContext, useContext } from 'react'
import { Updater } from 'use-immer'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormSectionTemplate, FormData, FormSectionData } from '../../models/Form'
import { Field, UpdateFieldFunc } from './Field'
import { Carousel } from '../UI/Carousel'

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
export function Form({ data, updateData }: { data: FormData, updateData: Updater<FormData> }) {
	const sections = data.templ.sections.map(section => {
		// updatePage è la funzione di produzione sullo stato per la pagina specifica
		const updateSection: Updater<FormSectionData> = (updater) => {
			updateData(formData => {
				if (formData.sections == undefined)
					formData.sections = {}

				if (typeof updater !== 'function') {
					formData.sections[section.id] = updater
					return
				}

				if (formData.sections[section.id] == undefined)
					formData.sections[section.id] = {}

				updater(formData.sections[section.id])
			})
		}

		return <VerticalSplitContext.Provider value={false} key={section.title}>
			<FormSection section={section} data={data.sections?.[section.id]} update={updateSection} />
		</VerticalSplitContext.Provider>
	})

	return <div className="container form">
		<h4 className="title">{data.templ.title}</h4>
		<div className="form-sections">
			<Tabs>
				<TabList>
					{data.templ.sections.map(section => {
						return <Tab key={section.title}>
							{section.title}
						</Tab>
					})}
				</TabList>

				{sections.map((section, sectionIdx) => {
					return <TabPanel key={sectionIdx}>
						{section}
					</TabPanel>
				})}
			</Tabs>
		</div>
	</div>
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
	update: Updater<FormSectionData>
}) {
	const verticalSplit = useContext(VerticalSplitContext)

	const starters = section.starters.map((starter) => {
		// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
		const updateStarter: UpdateFieldFunc = (updater) => {
			update(sectionData => {
				if (!sectionData)
					throw new Error('updating state of non-existing form section data')

				if (typeof updater !== 'function') {
					sectionData[starter.starterID] = updater
					return
				}

				if (!sectionData[starter.starterID]) {
					sectionData[starter.starterID] = {
						type: starter.type
					}
				}

				updater(sectionData[starter.starterID])
			})
		}

		return <div className="starter-field" key={`${section.title}-${starter.starterID}`}>
			<Field field={starter}
				data={data?.[starter.starterID]} update={updateStarter}
				breadcrumb={[section.id, starter.starterID]}
			/>
		</div>
	})

	if (!section.images) {
		return <div className="container form-section">
			<h3>{section.title}</h3>
			{starters}
		</div>
	}

	const splitClassName = verticalSplit ? undefined : 'split'

	return <div className="container form-section">
		<h3>{section.title}</h3>
		<div className={splitClassName}>
			<div className="container container-start container-align-start">
				{starters}
			</div>
			<div className="container">
				<div className="images">
					<Carousel>
						{section.images?.map((image, imageIdx) => {
							return <div className="image" key={imageIdx}>
								<img src={image} alt={section.title} />
							</div>
						})}
					</Carousel>
				</div>
			</div>
		</div>
	</div>
}
