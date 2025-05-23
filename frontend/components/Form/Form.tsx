import './Form.css'

import { createContext, MouseEvent, SyntheticEvent, useState } from 'react'
import { FormSectionTemplate, FormData, FormSectionData } from '../../../models/Form'
import { Field, ReferenceFieldContext, ReferenceFieldContextData, UpdateFieldFunc } from './Field'
import { Carousel } from '../UI/Carousel'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router'
import { AccordionSummaryLeft } from '../UI/Accordion'
import { DeepUpdater } from '../../utils/updater'
import { useImmer } from 'use-immer'

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
export function Form({ form, update, initialEditMode }: {
	form: FormData, update: DeepUpdater<FormData>,
	initialEditMode: boolean
}) {
	const [searchParams, setSearchParams] = useSearchParams();

	const [editMode, setEditMode] = useState(initialEditMode);
	const handleEditModeChange = () => {
		setEditMode(!editMode)

		!editMode ? searchParams.set('edit', '') : searchParams.delete('edit')
		setSearchParams(searchParams)
	}

	const tabIdxParam = parseInt((searchParams.get('tab') ?? '0'))
	const [tabIdx, setTabIdx] = useState(tabIdxParam < form.templ.sections.length ? tabIdxParam : 0)
	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTabIdx(newValue)

		searchParams.set('tab', newValue.toString())
		setSearchParams(searchParams)
	}

	const referenceFieldContextValue = useImmer<Record<string, ReferenceFieldContextData>>({})

	return (
		<EditModeContext.Provider value={editMode}>
			<ReferenceFieldContext.Provider value={referenceFieldContextValue}>
				<div className="form">
					<Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
						<h1 className="title">{form.templ.title}</h1>
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
									{form.templ.sections.map(section => {
										return <Tab label={section.title} key={section.title}
											sx={{ fontSize: '.8em', maxWidth: '30ch' }}
										/>
									})}
								</Tabs>
							</Paper>

							<Paper elevation={2} sx={{ marginTop: 2 }}>
								{form.templ.sections.map((section, sectionIdx) => {
									const updateSection: DeepUpdater<FormSectionData> = (updater, ...breadcrumb) => {
										update((formData) => {
											if (formData.sections == undefined)
												formData.sections = {}

											if (typeof updater !== 'function') {
												formData.sections[section.id] = updater
												return
											}

											if (formData.sections[section.id] == undefined)
												formData.sections[section.id] = {}

											updater(formData.sections[section.id])
										}, 'sections', section.id, ...breadcrumb)
									}

									return (
										<div key={sectionIdx}
											role="tabpanel"
											hidden={tabIdx !== sectionIdx}
											style={{ display: tabIdx !== sectionIdx ? 'none' : undefined }}
										>
											<FormSection
												section={section}
												data={form.sections?.[section.id]}
												update={updateSection}
											/>
										</div>
									)
								})}
							</Paper>
						</div>
					</div>
				</div>
			</ReferenceFieldContext.Provider>
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
	update: DeepUpdater<FormSectionData>
}) {
	const [showImages, setShowImages] = useState(true);
	const toggleShowImages = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		setShowImages(!showImages)
	}

	if (!section.images) {
		return <div className="form-section">
			<h3>{section.title}</h3>
			<FormSectionStarters
				section={section}
				data={data}
				update={update}
			/>
		</div>
	}

	return <div className="form-section">
		<h3>{section.title}</h3>
		<div className="section-split">
			<div className="container container-start container-align-start">
				<FormSectionStarters
					section={section}
					data={data}
					update={update}
				/>
			</div>
			<button className="toggle-show-images" data-toggled={showImages} onClick={toggleShowImages}>
				<i className="fa-solid fa-chevron-left"></i>
			</button>
			<div className={`container images ${showImages ? '' : 'hidden'}`}>
				<Carousel>
					{section.images?.map((image, imageIdx) => {
						return (
							<img src={image} alt={section.title} key={imageIdx} />
						)
					})}
				</Carousel>
			</div>
		</div>
	</div>
}

function FormSectionStarters({ section, data, update }: {
	section: FormSectionTemplate,
	data?: FormSectionData
	update: DeepUpdater<FormSectionData>
}) {
	return section.starters.map(starter => {
		// updateSection è la funzione di produzione sullo stato per la sezione specifica della pagina
		const updateStarter: UpdateFieldFunc = (updater, ...breadcrumb) => {
			update(sectionData => {
				if (!sectionData)
					throw new Error('updating state of non-existing form section data')

				if (typeof updater !== 'function') {
					sectionData[starter.id] = updater
					return
				}

				if (!sectionData[starter.id]) {
					sectionData[starter.id] = {
						type: starter.type
					}
				}

				updater(sectionData[starter.id])
			}, starter.id, ...breadcrumb)
		}

		if (!starter.header) {
			return (
				<div className="starter-field" key={starter.id}>
					<Field
						field={starter}
						data={data?.[starter.id]}
						update={updateStarter}
						breadcrumb={[section.id, starter.id]}
						hideHeader
					/>
				</div>
			)
		}

		return (
			<Accordion key={starter.id}
				className="starter-field"
				elevation={4}
				defaultExpanded
			>
				<AccordionSummaryLeft>
					<Typography className="starter-field-header">
						{starter.header}
					</Typography>
				</AccordionSummaryLeft>
				<AccordionDetails className="starter-field-details">
					<Field
						field={starter}
						data={data?.[starter.id]}
						update={updateStarter}
						breadcrumb={[section.id, starter.id]}
						hideHeader
					/>
				</AccordionDetails>
			</Accordion>
		)
	})
}
