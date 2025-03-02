import './Bones.css'

import { ChangeEvent, ChangeEventHandler, useContext, useEffect } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData } from '../../models/AnatomStruct'
import { EditModeContext, Form } from '../Form/Form'
import { useQuery } from '@tanstack/react-query'
import { BodyContextProvider } from '../../models/Body'
import { AnatomStructDataContext } from '../../models/AnatomStruct'
import { Breadcrumbs, Container, Link, Typography } from '@mui/material'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router'
import { generateChildUpdater } from '../../utils/updater'

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

	const saveChanges = async () => {
		const resp = await fetch(`/api/body/${body.generals.name}/bones`, {
			method: 'PUT',
			body: JSON.stringify(body.bones),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		if (!resp.ok) {
			//showMessage(await resp.text(), setOverlay)
		}
	}

	useEffect(() => {
		saveChanges()
	}, [body.bones])

	return (
		<Container className="bones">
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link to={`/body/${body.generals.name}`} underline="hover"
					component={RouterLink}>
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
			<EditBonesSection
				bonesData={body.bones}
				updateBonesData={updateBodyBones}
			/>
		</Container >
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

	const selectBone = (idx: number, checked: boolean) => {
		const bone = bones[idx]

		if (!checked) {
			//showMessage(`Non puoi deselezionare ${bone.name} perchè sono registrati dei dati. Eliminali prima nella sezione sotto`, setOverlay);
			return;
		}

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
		<div className="select-bones">
			<p>Seleziona le ossa presenti:</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map((bone, boneIdx) => {
						const checked = selectedBones.filter(selectedBone => selectedBone.name == bone.name).length != 0

						const setBoneChecked = (ev: ChangeEvent<HTMLInputElement>) => {
							selectBone(boneIdx, ev.target.checked)
						}

						return (
							<SelectBone key={bone.name}
								bone={bone} checked={checked}
								onChange={setBoneChecked} />
						)
					})}
				</ul>
			) : (
				<div>Nessuna</div>
			)}

		</div>
	)
}

type SelectBoneProps = {
	bone: Bone
	checked: boolean
	onChange: ChangeEventHandler<HTMLInputElement>
}

function SelectBone({ bone, checked, onChange }: SelectBoneProps) {
	return <li className="select-bone">
		<input
			type="checkbox" name={bone.name}
			checked={checked}
			onChange={onChange} />
		<label htmlFor={bone.name}>{bone.name}</label>
	</li>
}

type EditBonesSection = {
	bonesData: Record<string, BoneData>
	updateBonesData: Updater<Record<string, BoneData>>
}

function EditBonesSection({ bonesData, updateBonesData }: EditBonesSection) {
	const bones = Object.values(bonesData)

	return (
		<div className="edit-bones">
			<p>Gestisci ossa registrate:</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map(bone => (
						<EditBone key={bone.name}
							bone={bone}
							updateBonesData={updateBonesData}
						/>
					))}
				</ul>
			) : (
				<div>Nessuna registrata</div>
			)}
		</div>
	)
}

type EditBoneProps = {
	bone: BoneData
	updateBonesData: Updater<Record<string, BoneData>>
}

function EditBone({ bone/* , updateBonesData */ }: EditBoneProps) {
	const deleteBone = () => {
		/* setOverlay((
			<DeleteBonePopup className="delete-bone-popup"
				boneName={bone.name} updateBonesData={updateBonesData}
				setOverlay={setOverlay}
			>
				<div>
					Sei sicuro di voler eliminare <span className="bone-name">{bone.name}</span>?
				</div>
			</DeleteBonePopup>
		)) */
	}

	return (
		<li className="edit-bone">
			{bone.name}
			<div>
				<Link to={bone.name} component={RouterLink}
					className="button icon-button"
				>
					<i className="fa-solid fa-eye"></i>
				</Link>
				<Link to={`${bone.name}?edit`} component={RouterLink}
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

export function BoneView() {
	const { id } = useParams<{ id: string }>();
	if (!id) throw new Error('BoneView must be used with an id parameter')

	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('BoneView must be used within a BodyContext')

	const { body, updateBody } = bodyContext;
	const bone = body.bones[id];

	const updateBodyBones = generateChildUpdater(updateBody, 'bones')
	const updateBodyBone = generateChildUpdater(updateBodyBones, id)
	const updateBodyBoneData = generateChildUpdater(updateBodyBone, 'form')

	const baseURL = `/body/${body.generals.name}`;
	
	const [searchParams] = useSearchParams();
	const editMode = searchParams.get('edit') !== null;
	
	return (
		<Container>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link to={baseURL} underline="hover"
					component={RouterLink}>
					{body.generals.name}
				</Link>
				<Link to={baseURL + '/ossa'} underline="hover"
					component={RouterLink}>
					Ossa
				</Link>
				<Typography sx={{ color: 'text.primary' }}>{bone.name}</Typography>
			</Breadcrumbs>
			<AnatomStructDataContext.Provider value={bone}>
				<EditModeContext.Provider value={editMode}>
					<Form data={bone.form} updateData={updateBodyBoneData} />
				</EditModeContext.Provider>
			</AnatomStructDataContext.Provider>
		</Container>
	)
}

/* type DeleteBonePopupProps = {
	boneName: string
	updateBonesData: Updater<Record<string, BoneData>>
	setOverlay: SetOverlayFunc
	confirmLabel?: string
	cancelLabel?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function DeleteBonePopup({ boneName, updateBonesData, setOverlay, children, ...props }: DeleteBonePopupProps) {
	const deleteBone = () => {
		updateBonesData(bonesData => {
			delete bonesData[boneName]
		})
		closeOverlay()
	}

	const closeOverlay = () => {
		setOverlay(undefined);
	}

	return (
		<ConfirmPopup {...props}
			onConfirm={deleteBone} onCancel={closeOverlay}
			confirmLabel='Conferma' cancelLabel='Annulla' >
			{children}
		</ConfirmPopup>
	)
} */