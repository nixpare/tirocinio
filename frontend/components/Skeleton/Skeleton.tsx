import './Skeleton.css'

import { ChangeEvent, ChangeEventHandler, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData, SkeletonData } from '../../models/Skeleton'
import { ConfirmPopup } from '../UI/ConfirmPopup'
import { EditModeContext, Form } from '../Form/Form'
import { FullScreenOverlay } from '../UI/FullscreenOverlay'
import { SetOverlayFunc } from '../../pages'
import { useQuery } from '@tanstack/react-query'
import { BodyData } from '../../models/Body'

type SkeletonProps = {
	bodyName: string
	setOverlay: SetOverlayFunc
}

export function Skeleton({ bodyName, setOverlay }: SkeletonProps) {
	const bones_url = '/bones'
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

	const body_url = `/body/${bodyName}`
	const { data: body, isLoading: bodyLoading, error: bodyError } = useQuery({
		queryKey: [body_url],
		queryFn: async () => {
			const res = await fetch(body_url)
			if (!res.ok)
				throw new Error(await res.text())

			const body: BodyData = await res.json()
			return body
		},
		retry: false
	})

	if (bonesLoading || bodyLoading)
		return (
			<div>
				<h3>Caricamento</h3>
			</div>
		)

	if (bonesError || bodyError || !bones || !body)
		return (
			<div>
				<h3>Errore</h3>
				{bonesError && (
					<p>{bonesError.message}</p>
				)}
				{bodyError && (
					<p>{bodyError.message}</p>
				)}
			</div>
		)

	return (
		<SkeletonView bodyName={bodyName}
			skeleton={body.skeleton} bones={bones}
			setOverlay={setOverlay} />
	)
}

type SkeletonViewProps = {
	bodyName: string
	skeleton: SkeletonData
	bones: Bone[]
	setOverlay: SetOverlayFunc
}

export function SkeletonView({ bodyName, skeleton, bones, setOverlay }: SkeletonViewProps) {
	const [data, updateData] = useImmer<SkeletonData>(skeleton)

	const saveChanges = async () => {
		const resp = await fetch(`/body/${bodyName}/skeleton`, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		if (!resp.ok)
			showMessage(await resp.text(), setOverlay)
	}
	useEffect(() => {
		saveChanges()
	}, [data])

	return (
		<div className="container skeleton">
			<h1>Scheletro</h1>
			<SelectBonesSection bones={bones}
				skeletonData={data} updateSkeletonData={updateData}
				setOverlay={setOverlay} />
			<EditBonesSection skeletonData={data} updateSkeletonData={updateData} setOverlay={setOverlay} />
		</div>
	)
}

type SelectBonesSectionProps = {
	bones: Bone[]
	skeletonData: SkeletonData
	updateSkeletonData: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
}

function SelectBonesSection({ bones, skeletonData, updateSkeletonData, setOverlay }: SelectBonesSectionProps) {
	const [selectedBones, updateSelectedBones] = useImmer<BoneData[]>([])
	useEffect(() => {
		updateSelectedBones(Object.values(skeletonData))
	}, [skeletonData])
	
	const selectBone = (idx: number, checked: boolean) => {
		const bone = bones[idx]

		if (!checked) {
			showMessage(`Non puoi deselezionare ${bone.name} perchè sono registrati dei dati. Eliminali prima nella sezione sotto`, setOverlay);
			return;
		}

		updateSkeletonData(data => {
			data[bone.name] = {
				name: bone.name,
				template: bone.template
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
								onChange={setBoneChecked}/>
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
	skeletonData: SkeletonData
	updateSkeletonData: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
}

function EditBonesSection({ skeletonData, updateSkeletonData, setOverlay }: EditBonesSection) {
	const bones = Object.values(skeletonData)

	return (
		<div className="edit-bones">
			<p>Gestisci ossa registrate:</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map(bone => {
						const updateBone: Updater<BoneData> = (updater) => {
							updateSkeletonData(skeletonData => {
								if (typeof updater !== 'function') {
									skeletonData[bone.name] = updater
									return
								}

								updater(skeletonData[bone.name])
							})
						}

						return (
							<EditBone key={bone.name}
								bone={bone} updateBone={updateBone}
								updateSkeletonData={updateSkeletonData}
								setOverlay={setOverlay}/>
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
	updateSkeletonData: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
}

function EditBone({ bone, updateBone, updateSkeletonData, setOverlay }: EditBoneProps) {
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
		setOverlay((
			<DeleteBonePopup className="delete-bone-popup"
				boneName={bone.name} updateSkeletonData={updateSkeletonData}
				setOverlay={setOverlay}
			>
				<div>
					Sei sicuro di voler eliminare <span className="bone-name">{bone.name}</span>?
				</div>
			</DeleteBonePopup>
		))
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
				<button className="icon-button" onClick={viewBone}>
					<i className="fa-solid fa-eye"></i>
				</button>
				<button className="icon-button" onClick={editBone}>
					<i className="fa-solid fa-pen-to-square"></i>
				</button>
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

function showMessage(message: string, setOverlay: SetOverlayFunc) {
	const MessageNode = () => {
		const [stateClass, setStateClass] = useState('')
		
		const dismiss = () => {
			setStateClass('hide')
			setTimeout(() => {
				setOverlay(null)
			}, 600)
		}

		useEffect(() => {
			setStateClass('show')
		}, [])

		return (
			<div className={`message ${stateClass}`}>
				<div>{message}</div>
				<button onClick={dismiss}>Chiudi</button>
			</div>
		)
	}
	
	setOverlay(<MessageNode />, {
		className: 'window-message'
	})
}

type BonePopupProps = {
	bone: BoneData
	updateBone: Updater<BoneData>
	onClose: () => void
	editMode?: boolean
}

function BonePopup({ bone, updateBone, onClose, editMode = false }: BonePopupProps) {
	return (
		<FullScreenOverlay>
			<div className="edit-bone-popup">
				<EditModeContext.Provider value={editMode}>
					<Form data={bone} updateData={updateBone} />
				</EditModeContext.Provider>
				<button onClick={onClose}>
					<i className="fa-solid fa-xmark"></i>
				</button>
			</div>
		</FullScreenOverlay>
	)
}

type DeleteBonePopupProps = {
	boneName: string
	updateSkeletonData: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
	confirmLabel?: string
	cancelLabel?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function DeleteBonePopup({ boneName, updateSkeletonData, setOverlay, children, ...props }: DeleteBonePopupProps) {
	const deleteBone = () => {
		updateSkeletonData(skeletonData => {
			delete skeletonData[boneName]
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
}