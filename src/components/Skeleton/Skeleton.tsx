import './Skeleton.css'

import { Bone, SkeletonData } from '../../models/Skeleton'
import { ChangeEvent } from 'react'
import { Updater, useImmer } from 'use-immer'

type SkeletonProps = {
	data: SkeletonData
	updateData: Updater<SkeletonData>
	bones: Bone[]
}

export function Skeleton({ data, updateData, bones }: SkeletonProps) {
	const availableBones = Object.values(data)
	
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
				console.log('prevent')
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
			<div className="add-bone">
					<p>Nuove ossa:</p>
					{newBones.length > 0 ? <ul>
						{newBones.map(bone => {
							const addNewBone = () => {
								updateData(skeletonData => {
									skeletonData[bone.name] = {
										name: bone.name,
										template: bone.template,
									}
								})
							}

							return <li key={bone.name}>
								{bone.name}
								<button onClick={addNewBone}>Add</button>
							</li>
						})}
					</ul> : <div>
						Nessuna
					</div>}
			</div>
			<div className="edit-bone">
				<p>Ossa disponibili:</p>
				{availableBones.length > 0 ? <ul>
					{availableBones.map(bone => {
						return <li key={bone.name}>
							{bone.name}
						</li>
					})}
				</ul> : <div>
					Nessuna
				</div>}
			</div>
		</div>
	)
}