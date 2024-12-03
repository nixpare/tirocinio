import './Skeleton.css'

import { Bone, BoneData, SkeletonData } from '../../models/Skeleton'
import { ChangeEvent, DetailedHTMLProps, HTMLAttributes } from 'react'
import { DraftFunction, Updater, useImmer } from 'use-immer'
import { ConfirmPopup } from '../UI/ConfirmPopup'
import { Form } from '../Form/Form'

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
	
	const setChecked = (idx: number, checked: boolean) => {
		updateSelectedBones(selected => {
			const bone = bones[idx]

			if (!checked && data[bone.name] != undefined) {
				setOverlay(<DeleteBonePopup
					bone={bone} updateSkeleton={updateData} setOverlay={setOverlay}
					confirmLabel='Conferma' cancelLabel='Cancella'>
						<div>Sei sicuro di voler cancellare {bone.name}?</div>
				</DeleteBonePopup>)
				return
			}

			selected[idx] = checked ? bone : undefined
		})
	}

	const newBones = selectedBones.filter(bone => {
		return bone && data[bone.name] == undefined
	}) as Bone[]

	return (
		<div className="container skeleton">
			<h1>Scheletro</h1>
			<div className="bones-selection">
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
						const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
							setChecked(boneIdx, ev.target.checked)
						}

						return <li key={bone.name}>
							<input
								type="checkbox" name={bone.name}
								checked={selectedBones[boneIdx] != undefined}
								onChange={onChange} />
							<label htmlFor={bone.name}>{bone.name}</label>
						</li>
					})}
				</ul>
			</div>
			<AddBonesSection bones={newBones} updateSkeleton={updateData} />
			<EditBonesSection bones={availableBones} updateSkeleton={updateData} setOverlay={setOverlay} />
		</div>
	)
}

type AddBonesSection = {
	bones: Bone[]
	updateSkeleton: Updater<SkeletonData>
}

function AddBonesSection({ bones, updateSkeleton }: AddBonesSection) {
	return (
		<div className="add-bones">
			<p>Nuove ossa:</p>
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
	setOverlay: (overlay: React.ReactNode) => void
}

function EditBonesSection({ bones, updateSkeleton, setOverlay }: EditBonesSection) {
	return (
		<div className="edit-bones">
			<p>Ossa disponibili:</p>
			{bones.length > 0 ? <ul>
				{bones.map(bone => {
					const updateBone = (fn: DraftFunction<BoneData>) => {
						updateSkeleton(skeletonData => {
							fn(skeletonData[bone.name])
						})
					}

					return (
						<EditBone key={bone.name}
							bone={bone} updateBone={updateBone}
							setOverlay={setOverlay} />
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
	updateBone: (fn: DraftFunction<BoneData>) => void
	setOverlay: (overlay: React.ReactNode) => void
}

function EditBone({ bone, updateBone, setOverlay }: EditBoneProps) {
	const editBone = () => {
		const onClick = () => {
			setOverlay(undefined)
		}

		setOverlay(<>
			<div className="edit-bone-popup">
				<Form data={bone} updateData={updateBone} />
				<button onClick={onClick}>Close</button>
			</div>
		</>)
	}

	return (
		<li className="edit-bone">
			{bone.name}
			<button onClick={editBone}>Edit</button>
		</li>
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