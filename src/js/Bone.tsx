import { ChangeEvent, FormEvent, useState } from 'react'
import { produce } from 'immer'
import { Bone as BoneType, BoneProperty, InputMode, BonePropertyPage, BonePropertyTemplate } from './models/Bone'

import { Dropdown } from './Dropdown'

import '../css/Bone.css'

export function Bone({ bone, editMode }: { bone: BoneType, editMode?: boolean }) {
	if (!editMode) {
		return (
			<div className="container">
				<h4 className="bone-name">{bone.name}</h4>
				<p>To be implemented</p>
			</div>
		)
	}
	
	const [state, setState] = useState(bone)
	function updateState(fn: (prev: BoneType) => BoneType): void {
		const newState = produce(state, fn)
		console.log(newState)
		setState(newState)
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(state)
	}

	return (
		<div className="container">
			<h4 className="bone-name">{state.name}</h4>
			<form className="bone-form" onSubmit={handleSubmit}>
				{state.pages.map((page, pageIdx) => {
					function updatePage(fn: (page: BonePropertyPage) => BonePropertyPage) {
						updateState(state => {
							state.pages[pageIdx] = fn(state.pages[pageIdx])
							return state
						})
					}

					return <PropertyPage key={page.title} page={page} update={updatePage} />;
				})}
				<button type="submit">Invia</button>
			</form>
		</div>
	);
}

function PropertyPage({ page, update }: { page: BonePropertyPage, update: (fn: (page: BonePropertyPage) => BonePropertyPage) => void }) {
	return (
		<div className="split">
			<div>
				<table className="props-table">
					<thead>
						<tr>
							{page.table.headers.map(th => {
								return <th key={th}>{th}</th>
							})}
						</tr>
					</thead>
					<tbody>
						{page.table.indexes.map((rowName, rowIdx) => {
							return (
								<tr key={rowName}>
									<td>{rowName}</td>
									
									{page.table.template.map((template, fieldIdx) => {
										const updatePropertyRow: (fn: (state?: BoneProperty) => BoneProperty) => void = (fn) => {
											update(page => {
												if (!page.props) {
													page.props = []
												}

												if (!page.props[rowIdx]) {
													page.props[rowIdx] = []
												}

												page.props[rowIdx][fieldIdx] = fn(page.props[rowIdx][fieldIdx])
												return page
											})
										}

										let value: string | undefined;
										if (page.props && page.props[rowIdx]) {
											value = page.props[rowIdx][fieldIdx]
										}

										return <td><Property value={value} template={template} update={updatePropertyRow} /></td>
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			<div className="container"><img src={page.image} alt={page.title} /></div>
		</div>
	)
}

function Property({ template, value, update }: { template: BonePropertyTemplate, value?: BoneProperty, update: (fn: (value?: BoneProperty) => BoneProperty) => void }) {
	switch (template.mode) {
		case InputMode.Text:
			function handleTextInput(ev: ChangeEvent<HTMLInputElement>) {
				update(() => {
					return ev.target.value
				})
			}

			return <input type="text" value={value ? value : ''} onChange={handleTextInput} />;
		case InputMode.Dropdown:
			function setSelected(selected: string) {
				update(() => {
					return selected
				})
			}

			return <Dropdown
				options={template.options || []}
				selectedField={value || 'Non selezionato' }
				setSelectedField={setSelected}
			/>
	}
}
