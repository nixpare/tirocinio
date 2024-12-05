import './Skeleton.css'

import { ChangeEvent, ChangeEventHandler, DetailedHTMLProps, HTMLAttributes, useState } from 'react'
import { Updater, useImmer } from 'use-immer'
import { Bone, BoneData, SkeletonData } from '../../models/Skeleton'
import { ConfirmPopup } from '../UI/ConfirmPopup'
import { EditModeContext, Form } from '../Form/Form'
import { FullScreenOverlay } from '../UI/FullscreenOverlay'

type SkeletonProps = {
	data: SkeletonData
	updateData: Updater<SkeletonData>
	bones: Bone[]
	setOverlay: (overlay: React.ReactNode) => void
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
			<SelectBones bones={bones} skeletonData={data} updateSkeletonData={updateData} 
				selectedBones={selectedBones} updateSelectedBones={updateSelectedBones}
				setOverlay={setOverlay}/>
			<AddBonesSection bones={newBones} updateSkeleton={updateData} />
			<EditBonesSection bones={availableBones} updateSkeleton={updateData} />
		</div>
	)
}

type SelectBonesProps = {
	bones: Bone[]
	skeletonData: SkeletonData
	updateSkeletonData: Updater<SkeletonData>
	selectedBones: (Bone | undefined)[]
	updateSelectedBones: Updater<(Bone | undefined)[]>
	setOverlay: (overlay: React.ReactNode) => void
}

function SelectBones({ bones, skeletonData, updateSkeletonData, selectedBones, updateSelectedBones, setOverlay }: SelectBonesProps) {
	const setChecked = (idx: number, checked: boolean) => {
		updateSelectedBones(selected => {
			const bone = bones[idx]

			if (!checked && skeletonData[bone.name] != undefined) {
				const deletePopup = (
					<DeleteBonePopup
						bone={bone} updateSkeleton={updateSkeletonData} setOverlay={setOverlay}
						confirmLabel='Conferma' cancelLabel='Cancella'>
						<div>Sei sicuro di voler cancellare {bone.name}?</div>
					</DeleteBonePopup>
				)
				
				setOverlay(deletePopup)
				return
			}

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
			<ul>
				{bones.map((bone, boneIdx) => {
					const setBoneChecked = (ev: ChangeEvent<HTMLInputElement>) => {
						setChecked(boneIdx, ev.target.checked)
					}

					return (
						<SelectBone bone={bone} key={bone.name}
							checked={selectedBones[boneIdx] != undefined}
							onChange={setBoneChecked} />
					)
				})}
			</ul>
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

type AddBonesSection = {
	bones: Bone[]
	updateSkeleton: Updater<SkeletonData>
}

function AddBonesSection({ bones, updateSkeleton }: AddBonesSection) {
	return (
		<div className="add-bones">
			<p>Aggiungi ossa:</p>
			{bones.length > 0 ? <ul>
				{bones.map(bone => <>
					<AddBone key={bone.name} bone={bone} updateSkeleton={updateSkeleton} />
				</>)}
			</ul> : <div>
				Nessuna
			</div>}
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
}

function EditBonesSection({ bones, updateSkeleton }: EditBonesSection) {
	return (
		<div className="edit-bones">
			<p>Gestisci ossa registrate:</p>
			{bones.length > 0 ? <ul>
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
						<EditBone key={bone.name} bone={bone} updateBone={updateBone} />
					)
				})}
			</ul> : <div>
				Nessuna
			</div>}
		</div>
	)
}

type EditBoneProps = {
	bone: BoneData
	updateBone: Updater<BoneData>
}

function EditBone({ bone, updateBone }: EditBoneProps) {
	const [popupOpened, setPopupOpened] = useState(false)

	const editBone = () => {
		setPopupOpened(true)
	}

	const closePopup = () => {
		setPopupOpened(false)
	}

	return (
		<li className="edit-bone">
			{bone.name}
			<button onClick={editBone}>Edit</button>
			{popupOpened && <>
				<BonePopup bone={bone} updateBone={updateBone} onClose={closePopup} editMode={true} />
			</>}
		</li>
	)
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
	bone: Bone
	updateSkeleton: Updater<SkeletonData>
	setOverlay: (overlay: React.ReactNode) => void
	confirmLabel?: string
	cancelLabel?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

function DeleteBonePopup({ bone, updateSkeleton, setOverlay, children, ...props }: DeleteBonePopupProps) {
	const deleteBone = () => {
		updateSkeleton(skeletonData => {
			delete skeletonData[bone.name]
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