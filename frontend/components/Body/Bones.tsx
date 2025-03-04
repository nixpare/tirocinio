import './Bones.css'

import { useContext, useEffect, useMemo, useState } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData } from '../../models/AnatomStruct'
import { Form } from '../Form/Form'
import { useQuery } from '@tanstack/react-query'
import { BodyContextProvider } from '../../models/Body'
import { AnatomStructDataContext } from '../../models/AnatomStruct'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router'
import { generateChildUpdater } from '../../utils/updater'
import { saveBone, saveBones } from '../../utils/api'
import { AccordionSummaryLeft } from '../UI/Accordion'
import Alert from '@mui/material/Alert'
import { enqueueSnackbar } from 'notistack'

export function Bones() {
	const bones_url = '/api/bones'
	const { data: bones, isLoading: bonesLoading, error: bonesError } = useQuery({
		queryKey: [bones_url],
		queryFn: async () => {
			const res = await fetch(bones_url)
			if (!res.ok)
				throw new Error(await res.text())

			const bones: Bone[] = await res.json()
			return bones
		},
		retry: false
	})

	if (bonesLoading)
		return (
			<div>
				<h3>Caricamento</h3>
			</div>
		)

	if (bonesError || !bones) {
		const errMessage = bonesError ? bonesError.message : 'Errore durante il caricamento delle ossa'

		return (
			<div>
				<h3>Errore</h3>
				<p>{errMessage}</p>
			</div>
		)
	}

	return (
		<BonesView bones={bones} />
	)
}

export function BonesView({ bones }: { bones: Bone[] }) {
	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('BonesView must be used within a BodyContext')

	const { body, updateBody } = bodyContext
	const updateBodyBones = generateChildUpdater(updateBody, 'bones')

	useEffect(() => {
		saveBones(body.generals.name, body.bones).catch((err: Error) => {
			enqueueSnackbar((
				<Alert severity='error'>{err.message}</Alert>
			), { key: 'bone-loading', preventDuplicate: true })
		})
	}, [body.bones])

	return (
		<div className="bones">
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link to={`/body/${body.generals.name}`}
					underline="hover"
					component={RouterLink}
				>
					{body.generals.name}
				</Link>
				<Typography sx={{ color: 'text.primary' }}>Ossa</Typography>
			</Breadcrumbs>
			<h1>Ossa</h1>
			<SelectBonesSection
				bones={bones}
				bonesData={body.bones}
				updateBonesData={updateBodyBones}
			/>
			<Divider variant="middle" sx={{ marginTop: '1em', marginBottom: '1em' }} />
			<EditBonesSection
				bonesData={body.bones}
				updateBonesData={updateBodyBones}
			/>
		</div>
	)
}

type SelectBonesSectionProps = {
	bones: Bone[]
	bonesData: Record<string, BoneData>
	updateBonesData: Updater<Record<string, BoneData>>
}

function SelectBonesSection({ bones, bonesData, updateBonesData }: SelectBonesSectionProps) {
	const [selectedBones, updateSelectedBones] = useImmer<BoneData[]>([])
	useEffect(() => {
		updateSelectedBones(Object.values(bonesData))
	}, [bonesData])

	const [search, setSearch] = useState('')
	const searchResults = useMemo(() => {
		return bones.filter(bone => {
			return !selectedBones.some(selectedBone => selectedBone.name === bone.name) &&
				bone.name.toLowerCase().includes(search)
		}).sort((a, b) => a.name.localeCompare(b.name))
	}, [bones, selectedBones, search])

	return (
			<Accordion className="select-bones" elevation={2}>
				<AccordionSummaryLeft
					expandIcon={<i className="fa-solid fa-circle-plus"></i>}
					sx={{ flexDirection: 'row-reverse', gap: 2 }}
				>
					<p>Aggiungi ossa</p>
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
							searchResults.map((bone) => {
								const addBone = () => {
									updateBonesData(data => {
										data[bone.name] = {
											type: bone.type,
											name: bone.name,
											form: {
												templ: bone.form
											}
										}
									})
								}

								return (
									<button key={bone.name} className="select-bone" onClick={addBone}>
										{bone.name}
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

type EditBonesSection = {
	bonesData: Record<string, BoneData>
	updateBonesData: Updater<Record<string, BoneData>>
}

function EditBonesSection({ bonesData, updateBonesData }: EditBonesSection) {
	const bones = Object.values(bonesData)

	const [search, setSearch] = useState('')
	const searchResults = useMemo(() => {
		return bones.filter(bone => {
			return bone.name.toLowerCase().includes(search)
		}).sort((a, b) => a.name.localeCompare(b.name))
	}, [bones, search])

	return (
		<Paper className="edit-bones" elevation={2}>
			<div className="search">
				<p>Ossa presenti:</p>
				<input type="text" placeholder="Cerca ..."
					onChange={(e) => {
						setSearch(e.target.value.toLowerCase())
					}}
				/>
			</div>
			<div className="options">
				{searchResults.length > 0 ? (
					searchResults.map((bone) => (
						<EditBone key={bone.name}
							bone={bone}
							updateBonesData={updateBonesData}
						/>
					))
				) : 'Nessuna'}
			</div>
		</Paper>
	)
}

type EditBoneProps = {
	bone: BoneData
	updateBonesData: Updater<Record<string, BoneData>>
}

function EditBone({ bone, updateBonesData }: EditBoneProps) {
	const deleteBone = () => {
		updateBonesData(bonesData => {
			delete bonesData[bone.name]
		})
	}

	return (
		<li className="edit-bone">
			{bone.name}
			<div>
				<Link to={bone.name}
					component={RouterLink}
					className="button icon-button"
				>
					<i className="fa-solid fa-eye"></i>
				</Link>
				<Link to={`${bone.name}?edit`}
					component={RouterLink}
					className="button icon-button"
				>
					<i className="fa-solid fa-pen-to-square"></i>
				</Link>
				<button className="icon-button delete-button" onClick={deleteBone}>
					<i className="fa-solid fa-trash"></i>
				</button>
			</div>
		</li>
	)
}

// TODO: remove optinal fallback 'id' parameter from BoneView component
export function BoneView({ fallbackId }: { fallbackId?: string }) {
	let { id } = useParams<{ id: string }>();
	if (!id && fallbackId) {
		id = fallbackId
	}
	if (!id) throw new Error('BoneView must be used with an id parameter')

	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('BoneView must be used within a BodyContext')

	const { body, updateBody } = bodyContext;
	const bone: BoneData | undefined = body.bones[id];

	if (!bone) throw new Error(`Bone with id ${id} not found`)
	useEffect(() => {
		saveBone(body.generals.name, bone, [bone.name])
	}, [bone])

	useEffect(() => {
		enqueueSnackbar((
			<Alert severity='info'>Osso {bone.name} caricato</Alert>
		), { key: 'bone-loading', preventDuplicate: true })
	}, [])

	const updateBodyBones = generateChildUpdater(updateBody, 'bones')
	const updateBodyBone = generateChildUpdater(updateBodyBones, id)
	const updateBodyBoneData = generateChildUpdater(updateBodyBone, 'form')

	const baseURL = `/body/${body.generals.name}`;
	
	const [searchParams] = useSearchParams();
	const editMode = searchParams.get('edit') !== null;
	
	return (
		<div className="bone">
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link to={baseURL}
					underline="hover"
					component={RouterLink}
				>
					{body.generals.name}
				</Link>
				<Link to={baseURL + '/ossa'}
					underline="hover"
					component={RouterLink}
				>
					Ossa
				</Link>
				<Typography sx={{ color: 'text.primary' }}>{bone.name}</Typography>
			</Breadcrumbs>
			<AnatomStructDataContext.Provider value={bone}>
				<Form
					data={bone.form}
					updateData={updateBodyBoneData}
					initialEditMode={editMode}
				/>
			</AnatomStructDataContext.Provider>
		</div>
	)
}
