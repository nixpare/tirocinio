import './Bones.css'

import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData } from '../../models/AnatomStruct'
import { EditModeContext, Form } from '../Form/Form'
import { FullScreenOverlay } from '../UI/FullscreenOverlay'
import { useQuery } from '@tanstack/react-query'
import { BodyContext } from '../../models/Body'
import { AnatomStructDataContext, generateUpdateForm } from '../../models/AnatomStruct'
import { Breadcrumbs, Container, Link, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router'

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
	const body = useContext(BodyContext);
	if (!body) throw new Error('BonesView must be used within a BodyContext')

	const [data, updateData] = useImmer(body.bones)

	const saveChanges = async () => {
		const resp = await fetch(`/api/body/${body.generals.name}/bones`, {
			method: 'PUT',
			body: JSON.stringify(data),
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
	}, [data])

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
				bonesData={data}
				updateBonesData={updateData}
			/>
			<EditBonesSection
				bonesData={data}
				updateBonesData={updateData}
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
					{bones.map(bone => {
						const updateBone: Updater<BoneData> = (updater) => {
							updateBonesData(bonesData => {
								if (typeof updater !== 'function') {
									bonesData[bone.name] = updater
									return
								}

								updater(bonesData[bone.name])
							})
						}

						return (
							<EditBone key={bone.name}
								bone={bone}
								updateBone={updateBone}
								updateBonesData={updateBonesData}
							/>
						)
					})}
				</ul>
			) : (
				<div>Nessuna registrata</div>
			)}
		</div>
	)
}

type EditBoneProps = {
	bone: BoneData
	updateBone: Updater<BoneData>
	updateBonesData: Updater<Record<string, BoneData>>
}

function EditBone({ bone, updateBone, updateBonesData }: EditBoneProps) {
	type BonePopupProps = {
		opened: boolean
		editMode: boolean
	}
	const [popupOpened, setPopupOpened] = useState<BonePopupProps>({
		opened: false,
		editMode: false
	})

	const viewBone = () => {
		setPopupOpened({
			opened: true,
			editMode: false
		})
	}

	const editBone = () => {
		setPopupOpened({
			opened: true,
			editMode: true
		})
	}

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

	const closePopup = () => {
		setPopupOpened({
			opened: false,
			editMode: false
		})
	}

	return (
		<li className="edit-bone">
			{bone.name}
			<div>
				{/* <button className="icon-button" onClick={viewBone}>
					<i className="fa-solid fa-eye"></i>
				</button>
				<button className="icon-button" onClick={editBone}>
					<i className="fa-solid fa-pen-to-square"></i>
				</button> */}
				<Link to={bone.name} component={RouterLink}>
					<i className="fa-solid fa-eye"></i>
				</Link>
				<button className="icon-button delete-button" onClick={deleteBone}>
					<i className="fa-solid fa-trash"></i>
				</button>
			</div>
			{popupOpened.opened && <>
				<BonePopup bone={bone} updateBone={updateBone} onClose={closePopup} editMode={popupOpened.editMode} />
			</>}
		</li>
	)
}

export function BoneView() {
	const { id } = useParams<{ id: string }>();
	if (!id) throw new Error('BoneView must be used with an id parameter')

	const body = useContext(BodyContext);
	if (!body) throw new Error('BoneView must be used within a BodyContext')

	const bone = body.bones[id];

	const baseURL = `/body/${body.generals.name}`;

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
				<EditModeContext.Provider value={false}>
					<Form data={bone.form} updateData={() => {}} />
				</EditModeContext.Provider>
			</AnatomStructDataContext.Provider>
		</Container>
	)
}

type BonePopupProps = {
	bone: BoneData
	updateBone: Updater<BoneData>
	onClose: () => void
	editMode?: boolean
}

function BonePopup({ bone, updateBone, onClose, editMode = false }: BonePopupProps) {
	const updateForm = generateUpdateForm(updateBone);

	return (
		<FullScreenOverlay>
			<div className="edit-bone-popup">
				<AnatomStructDataContext.Provider value={bone}>
					<EditModeContext.Provider value={editMode}>

						<Form data={bone.form} updateData={updateForm} />

					</EditModeContext.Provider>
				</AnatomStructDataContext.Provider>
				<button onClick={onClose}>
					<i className="fa-solid fa-xmark"></i>
				</button>
			</div>
		</FullScreenOverlay>
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