import './AnatomStruct.css'

import { useContext, useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import { AnatomStructDataContext, AnatomStructType, AnatomStruct, AnatomStructData } from '../../../models/AnatomStruct'
import { anatomTypeToBodyField, BodyContextProvider } from '../../../models/Body'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useLoaderData, useParams, useSearchParams } from 'react-router'
import { childDeepUpdater, childUpdater, rootDeepUpdater } from '../../utils/updater'
import { getAnatomStructs, updateAnatomStructData, updateAnatomStructsData } from '../../utils/api'
import Alert from '@mui/material/Alert'
import { enqueueSnackbar } from 'notistack'
import { walkObject } from '../../../models/Programmable'
import { AccordionSummaryLeft } from '../../components/UI/Accordion'
import { Form } from '../../components/Form/Form'
import { useBodyNavigation } from './Body'

export async function anatomStructsViewLoader(type: AnatomStructType) {
	return await getAnatomStructs(type)
}

function AnatomStructsView({ anatomType, displayName }: {
	anatomType: AnatomStructType
	displayName: string
}) {
	const anatoms = useLoaderData<AnatomStruct[]>()
	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('AnatomStructsView must be used within a BodyContext')

	const anatomsKey = anatomTypeToBodyField(anatomType)
	if (!anatomsKey) {
		throw new Error('Invalid anatomType: cannot resolve anatomsKey');
	}
	
	const { body } = bodyContext;

	useAnatomStructsViewNavigation(body.generals.name)

	useEffect(() => {
		console.log('UPDATE', body[anatomsKey])
		updateAnatomStructsData(body.generals.name, anatomType, body[anatomsKey]).catch((err: Error) => {
			enqueueSnackbar((
				<Alert severity='error'>{err.message}</Alert>
			), { key: 'anatoms-loading', preventDuplicate: true })
		})
	}, [body[anatomsKey]])

	return (
		<div className="anatoms">
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link
					to="./../.."
					underline="hover"
					component={RouterLink}
					sx={{ ":visited": { color: 'unset' } }}
				>
					<Typography>
						<i className="fa-solid fa-home"></i>
					</Typography>
				</Link>
				<Link to="./.."
					underline="hover"
					component={RouterLink}
				>
					{body.generals.name}
				</Link>
				<Typography sx={{ color: 'text.primary' }}>
					{displayName}
				</Typography>
			</Breadcrumbs>
			<h1>
				{displayName}
			</h1>
			<SelectAnatomStructs
				anatoms={anatoms}
				anatomsData={body[anatomsKey]}
			/>
			<Divider variant="middle" sx={{ marginTop: '1em', marginBottom: '1em' }} />
			<EditAnatoms
				anatomsData={body[anatomsKey]}
			/>
		</div>
	)
}

function SelectAnatomStructs<T extends Record<string, AnatomStructData>>({ anatoms, anatomsData }: {
	anatoms: AnatomStruct[]
	anatomsData: T
}) {
	const [selectedAnatoms, updateSelectedAnatoms] = useImmer<AnatomStructData[]>([])
	useEffect(() => {
		updateSelectedAnatoms(Object.values(anatomsData))
	}, [anatomsData])

	const [search, setSearch] = useState('')
	const searchResults = useMemo(() => {
		return anatoms.filter(anatom => {
			return !selectedAnatoms.some(selected => selected.name === anatom.name) &&
				anatom.name.toLowerCase().includes(search)
		}).sort((a, b) => a.name.localeCompare(b.name))
	}, [anatoms, selectedAnatoms, search])

	return (
		<Accordion className="select-anatoms" elevation={2}>
			<AccordionSummaryLeft
				expandIcon={<i className="fa-solid fa-circle-plus"></i>}
				sx={{ flexDirection: 'row-reverse', gap: 2 }}
			>
				<p>Aggiungi</p>
			</AccordionSummaryLeft>
			<AccordionDetails>
				<div className="search">
					<p>Cerca: </p>
					<input type="text" placeholder="Cerca ..."
						onChange={(e) => {
							setSearch(e.target.value.toLowerCase())
						}}
					/>
				</div>
				<div className="options">
					{searchResults.length > 0 ? (
						searchResults.map((anatom) => {
							const addAnatom = () => {
								// TODO: make an add endpoint to optimize
							}

							return (
								<button key={anatom.name} className="select-anatom" onClick={addAnatom}>
									{anatom.name}
									<div className="show-on-hover">
										<i className="fa-solid fa-plus"></i>
									</div>
								</button>
							)
						})
					) : 'Nessuna'}
				</div>
			</AccordionDetails>
		</Accordion>
	)
}

function EditAnatoms<T extends Record<string, AnatomStructData>>({ anatomsData }: {
	anatomsData: T
}) {
	const anatoms = Object.values(anatomsData)

	const [search, setSearch] = useState('')
	const searchResults = useMemo(() => {
		return anatoms.filter(anatom => {
			return anatom.name.toLowerCase().includes(search)
		}).sort((a, b) => a.name.localeCompare(b.name))
	}, [anatoms, search])

	return (
		<Paper className="edit-anatoms" elevation={2}>
			<div className="search">
				<p>Presenti:</p>
				<input type="text" placeholder="Cerca ..."
					onChange={(e) => {
						setSearch(e.target.value.toLowerCase())
					}}
				/>
			</div>
			<div className="options">
				{searchResults.length > 0 ? (
					searchResults.map((anatom) => (
						<EditAnatom key={anatom.name}
							anatom={anatom}
						/>
					))
				) : 'Nessuna'}
			</div>
		</Paper>
	)
}

function EditAnatom<T extends AnatomStructData>({ anatom }: {
	anatom: T,
}) {
	const deleteAnatom = () => {
		// TODO: make a delete endpoint to optimize
	}

	return (
		<li className="edit-anatom">
			{anatom.name}
			<div>
				<Link to={anatom.name}
					component={RouterLink}
					className="button icon-button"
				>
					<i className="fa-solid fa-eye"></i>
				</Link>
				<Link to={`${anatom.name}?edit`}
					component={RouterLink}
					className="button icon-button"
				>
					<i className="fa-solid fa-pen-to-square"></i>
				</Link>
				<button className="icon-button delete-button" onClick={deleteAnatom}>
					<i className="fa-solid fa-trash"></i>
				</button>
			</div>
		</li>
	)
}

function useAnatomStructsViewNavigation(bodyName: string) {
	useBodyNavigation(bodyName)
}

function AnatomStructView({ anatomType, displayName }: {
	anatomType: AnatomStructType
	displayName: string
}) {
	let { anatomName } = useParams();
	if (!anatomName) throw new Error('AnatomStructView must be used with a name parameter')

	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('AnatomStructView must be used within a BodyContext')

	const { body, updateBody } = bodyContext;

	useAnatomStructViewNavigation(body.generals.name)

	const anatomKey = anatomTypeToBodyField(anatomType)
	if (!anatomKey) {
		throw new Error('Invalid anatomType: cannot resolve anatomsKey');
	}

	const anatom: AnatomStructData | undefined = body[anatomKey][anatomName];
	console.log(anatom)

	if (!anatom) throw new Error(`AnatomStruct ${anatomName} not found`)

	useEffect(() => {
		enqueueSnackbar((
			<Alert severity='info'>{anatom.name} caricato</Alert>
		), { key: 'anatom-loading', preventDuplicate: true })
	}, [])

	const updateAnatoms = childUpdater(updateBody, anatomKey)
	const updateAnatom = childUpdater(updateAnatoms, anatomName)
	const updateBodyAnatomDeep = rootDeepUpdater(updateAnatom, (anatom, ...breadcrumb) => {
		const payload = walkObject<any>(anatom, breadcrumb.join('.'))
		updateAnatomStructData(body.generals.name, anatomType, anatom.name, payload, breadcrumb)
	})
	const updateAnatomForm = childDeepUpdater(updateBodyAnatomDeep, 'form', 'form')

	const baseURL = `/body/${body.generals.name}`;

	const [searchParams] = useSearchParams();
	const editMode = searchParams.get('edit') !== null;

	return (
		<div className="anatom">
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link to={baseURL}
					underline="hover"
					component={RouterLink}
				>
					{body.generals.name}
				</Link>
				<Link to={`${baseURL}/${anatomTypeToBodyField(anatomType)}`}
					underline="hover"
					component={RouterLink}
				>
					{displayName}
				</Link>
				<Typography sx={{ color: 'text.primary' }}>{anatom.name}</Typography>
			</Breadcrumbs>
			<AnatomStructDataContext.Provider value={anatom}>
				<Form
					form={anatom.form}
					update={updateAnatomForm}
					initialEditMode={editMode}
				/>
			</AnatomStructDataContext.Provider>
		</div>
	)
}

function useAnatomStructViewNavigation(bodyName: string) {
	useBodyNavigation(bodyName)
}

//
// BONES
//

export async function bonesViewLoader() {
	return await anatomStructsViewLoader('bone')
}

export function BonesView() {
	return (
		<AnatomStructsView anatomType="bone" displayName='Ossa' />
	)
}

export function BoneView() {
	return (
		<AnatomStructView anatomType="bone" displayName='Ossa' />
	)
}

//
// VISCUS
//

export async function viscusViewLoader() {
	return await anatomStructsViewLoader('viscera')
}

export function ViscusView() {
	return (
		<AnatomStructsView anatomType="viscera" displayName='Viscere' />
	)
}

export function VisceraView() {
	return (
		<AnatomStructView anatomType="viscera" displayName='Viscere' />
	)
}

//
// EXTERIORS
//

export async function exteriorsViewLoader() {
	return await anatomStructsViewLoader('exterior')
}

export function ExteriorsView() {
	return (
		<AnatomStructsView anatomType="exterior" displayName='Esterni' />
	)
}

export function ExteriorView() {
	return (
		<AnatomStructView anatomType="exterior" displayName='Esterni' />
	)
}
