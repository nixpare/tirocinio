import './Skeleton.css'

import { ChangeEvent, ChangeEventHandler, DetailedHTMLProps, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData, SkeletonData } from '../../models/Skeleton'
import { ConfirmPopup } from '../UI/ConfirmPopup'
import { EditModeContext, Form } from '../Form/Form'
import { FullScreenOverlay } from '../UI/FullscreenOverlay'
import { SetOverlayFunc } from '../../pages'

type SkeletonProps = {
	data: SkeletonData
	updateData: Updater<SkeletonData>
	bones: Bone[]
	setOverlay: SetOverlayFunc
}

export function Skeleton({ data, updateData, bones, setOverlay }: SkeletonProps) {
	const availableBones = Object.values<BoneData>(data)
	
	const initialBones = bones.map(bone => {
		return availableBones.findIndex(availBone => {
			return availBone.name == bone.name
		}) != -1 ? bone : undefined
	})

	const [selectedBones, updateSelectedBones] = useImmer<(Bone | undefined)[]>(initialBones)

	const newBones = selectedBones.filter(bone => {
		return bone && data[bone.name] == undefined
	}) as Bone[]

	return (
		<div className="container skeleton">
			<h1>Scheletro</h1>
			<SelectBonesSection bones={bones} skeletonData={data}
				selectedBones={selectedBones} updateSelectedBones={updateSelectedBones}
				setOverlay={setOverlay}/>
			<AddBonesSection bones={newBones} updateSkeleton={updateData} />
			<EditBonesSection bones={availableBones} updateSkeleton={updateData} setOverlay={setOverlay} />
		</div>
	)
}

type SelectBonesSectionProps = {
	bones: Bone[]
	skeletonData: SkeletonData
	selectedBones: (Bone | undefined)[]
	updateSelectedBones: Updater<(Bone | undefined)[]>
	setOverlay: SetOverlayFunc
}

function SelectBonesSection({ bones, skeletonData, selectedBones, updateSelectedBones, setOverlay }: SelectBonesSectionProps) {
	const setChecked = (idx: number, checked: boolean) => {
		updateSelectedBones(selected => {
			const bone = bones[idx]
			selected[idx] = checked ? bone : undefined
		})
	}

	return (
		<div className="select-bones">
			<p>Seleziona le ossa presenti:
				<span>(Selezionati: {
					selectedBones
						.filter(bone => bone != undefined)
						.map(bone => bone.name)
						.join(', ') || 'Nessuno'
				})</span>
			</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map((bone, boneIdx) => {
						const checked = selectedBones[boneIdx] != undefined
						const disabled = checked && skeletonData[bone.name] != undefined

						const setBoneChecked = (ev: ChangeEvent<HTMLInputElement>) => {
							setChecked(boneIdx, ev.target.checked)
						}

						return (
							<SelectBone bone={bone} key={bone.name}
								checked={checked} disabled={disabled}
								onChange={setBoneChecked} setOverlay={setOverlay}/>
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
	disabled: boolean
	onChange: ChangeEventHandler<HTMLInputElement>
	setOverlay: SetOverlayFunc
}

function SelectBone({ bone, checked, disabled, onChange, setOverlay }: SelectBoneProps) {
	const onClick: ChangeEventHandler<HTMLInputElement> = (ev) => {
		if (checked && disabled) {
			showMessage(`Non puoi deselezionare ${bone.name} perchè sono registrati dei dati. Eliminali prima nella sezione sotto`, setOverlay);
			return;
		}
		
		onChange(ev)
	}

	const className = disabled ? 'disabled' : undefined

	const inputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.checked = checked
		}
	}, [inputRef, checked])
	
	return <li className="select-bone">
		<input className={className} ref={inputRef}
			type="checkbox" name={bone.name}
			onChange={onClick} />
		<label htmlFor={bone.name}>{bone.name}</label>
	</li>
}

type AddBonesSection = {
	bones: Bone[]
	updateSkeleton: Updater<SkeletonData>
}

function AddBonesSection({ bones, updateSkeleton }: AddBonesSection) {
	return (
		<div className="add-bones">
			<p>Aggiungi ossa:</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map(bone => (
						<AddBone key={bone.name} bone={bone} updateSkeleton={updateSkeleton} />
					))}
				</ul>
			) : (
				<div>Nessuna</div>
			)}
		</div>
	)
}

type AddBoneProps = {
	bone: Bone,
	updateSkeleton: Updater<SkeletonData>
}

function AddBone({ bone, updateSkeleton }: AddBoneProps) {
	const addNewBone = () => {
		updateSkeleton(skeletonData => {
			skeletonData[bone.name] = {
				name: bone.name,
				template: bone.template,
			}
		})
	}

	return <li className="add-bone">
		{bone.name}
		<button onClick={addNewBone}>Add</button>
	</li>
}

type EditBonesSection = {
	bones: BoneData[]
	updateSkeleton: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
}

function EditBonesSection({ bones, updateSkeleton, setOverlay }: EditBonesSection) {
	return (
		<div className="edit-bones">
			<p>Gestisci ossa registrate:</p>
			{bones.length > 0 ? (
				<ul>
					{bones.map(bone => {
						const updateBone: Updater<BoneData> = (updater) => {
							updateSkeleton(skeletonData => {
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
								updateSkeleton={updateSkeleton}
								setOverlay={setOverlay}/>
						)
					})}
				</ul>
			) : (
				<div>Nessuna</div>
			)}
		</div>
	)
}

type EditBoneProps = {
	bone: BoneData
	updateBone: Updater<BoneData>
	updateSkeleton: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
}

function EditBone({ bone, updateBone, updateSkeleton, setOverlay }: EditBoneProps) {
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
			<DeleteBonePopup
				boneName={bone.name} updateSkeleton={updateSkeleton}
				setOverlay={setOverlay}
			>
				<div>Sei sicuro di voler eliminare {bone.name}?</div>
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
			<button onClick={viewBone}>View</button>
			<button onClick={editBone}>Edit</button>
			<button onClick={deleteBone}>Delete</button>
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
				<button onClick={dismiss}>Dismiss</button>
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
	updateSkeleton: Updater<SkeletonData>
	setOverlay: SetOverlayFunc
	confirmLabel?: string
	cancelLabel?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function DeleteBonePopup({ boneName, updateSkeleton, setOverlay, children, ...props }: DeleteBonePopupProps) {
	const deleteBone = () => {
		updateSkeleton(skeletonData => {
			delete skeletonData[boneName]
		})
		closeOverlay()
	}

	const closeOverlay = () => {
		setOverlay(undefined);
	}
	
	return (
		<ConfirmPopup {...props} onConfirm={deleteBone} onCancel={closeOverlay}>
			{children}
		</ConfirmPopup>
	)
}