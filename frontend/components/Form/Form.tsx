import './Form.css'

import { createContext, SyntheticEvent, useState } from 'react'
import { Updater } from 'use-immer'
import { FormSectionTemplate, FormData, FormSectionData } from '../../models/Form'
import { Field, UpdateFieldFunc } from './Field'
import { Carousel } from '../UI/Carousel'
import { Accordion, AccordionDetails, Paper, Stack, Switch, Tab, Tabs, Typography } from '@mui/material';
import { useSearchParams } from 'react-router'
import { AccordionSummaryLeft } from '../UI/Accordion'

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
export function Form({ data, updateData, initialEditMode }: { data: FormData, updateData: Updater<FormData>, initialEditMode: boolean }) {
	const [ searchParams, setSearchParams ] = useSearchParams();
	
	const [editMode, setEditMode] = useState(initialEditMode);
	const handleEditModeChange = () => {
		setEditMode(!editMode)
		
		!editMode ? searchParams.set('edit', '') : searchParams.delete('edit')
		setSearchParams(searchParams)
	}
	
	const tabIdxParam = searchParams.get('tab')
	const [tabIdx, setTabIdx] = useState(tabIdxParam ? parseInt(tabIdxParam) : 0)
	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTabIdx(newValue)

		searchParams.set('tab', newValue.toString())
		setSearchParams(searchParams)
	}

	return (
		<EditModeContext.Provider value={editMode}>
			<div className="form">
				<Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
					<h1 className="title">{data.templ.title}</h1>
					<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
						<Typography><i className="fa-solid fa-eye"></i></Typography>
						<Switch
							checked={editMode}
							onClick={handleEditModeChange}
						/>
						<Typography><i className="fa-solid fa-pen-to-square"></i></Typography>
					</Stack>
				</Stack>
				<div className="form-sections">
					<div>
						<Paper elevation={6}>
							<Tabs
								value={tabIdx}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
							>
								{data.templ.sections.map(section => {
									return <Tab label={section.title} key={section.title}
										sx={{ fontSize: '.8em', maxWidth: '30ch' }}
									/>
								})}
							</Tabs>
						</Paper>
						
						<Paper elevation={2} sx={{ marginTop: 2 }}>
							{data.templ.sections.map((section, sectionIdx) => {
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

								return (
									<div key={sectionIdx}
										role="tabpanel"
										hidden={tabIdx !== sectionIdx}
										style={{ display: tabIdx !== sectionIdx ? 'none' : undefined }}
									>
										<FormSection
											section={section}
											data={data.sections?.[section.id]}
											update={updateSection}
										/>
									</div>
								)
							})}
						</Paper>
					</div>
				</div>
			</div>
		</EditModeContext.Provider>
	)
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

		if (!starter.header) {
			return (
				<div className="starter-field">
					<Field field={starter}
						data={data?.[starter.starterID]} update={updateStarter}
						breadcrumb={[section.id, starter.starterID]}
						hideHeader
					/>
				</div>
			)
		}

		return (
			<Accordion key={`${section.title}-${starter.starterID}`}
				className="starter-field"
				elevation={4}
			>
				<AccordionSummaryLeft>
					<Typography className="field-header">
						{starter.header}
					</Typography>
				</AccordionSummaryLeft>
				<AccordionDetails>
					<Field field={starter}
						data={data?.[starter.starterID]} update={updateStarter}
						breadcrumb={[section.id, starter.starterID]}
						hideHeader
					/>
				</AccordionDetails>
			</Accordion>
		)
	})

	if (!section.images) {
		return <div className="form-section">
			<h3>{section.title}</h3>
			{starters}
		</div>
	}

	return <div className="form-section">
		<h3>{section.title}</h3>
		<div className="split">
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
