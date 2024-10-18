import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import { produce } from 'immer'
import { Bone as BoneType, BoneProperty, InputMode, BonePropertyPage, BonePropertyTemplate, BonePropertyPageSection } from './models/Bone'

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
		setState(produce(state, fn))
	}

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(state)
	}

	const pages = state.pages.length
	const [visiblePage, setVisiblePage] = useState(0)

	function slideLeft(ev: MouseEvent<HTMLButtonElement, PointerEvent>) {
		ev.preventDefault();

		if (visiblePage > 0) {
			setVisiblePage(visiblePage - 1)
		}
	}

	function slideRight(ev: MouseEvent<HTMLButtonElement, PointerEvent>) {
		ev.preventDefault();

		if (visiblePage < pages-1) {
			setVisiblePage(visiblePage + 1)
		}
	}

	return (
		<div className="container">
			<h4 className="bone-name">{state.name}</h4>
			<form className="bone-form" onSubmit={handleSubmit}>
				<div className="carousel">
					<button onClick={slideLeft}>Left</button>
					<div>
						{state.pages.map((page, pageIdx) => {
							function updatePage(fn: (page: BonePropertyPage) => BonePropertyPage) {
								updateState(state => {
									state.pages[pageIdx] = fn(state.pages[pageIdx])
									return state
								})
							}

							return <PropertyPage key={page.title} page={page} visible={visiblePage === pageIdx} update={updatePage} />;
						})}
					</div>
					<button onClick={slideRight}>Right</button>
				</div>
				<button type="submit">Invia</button>
			</form>
		</div>
	);
}

function PropertyPage({ page, visible, update }: { page: BonePropertyPage, visible: boolean, update: (fn: (page: BonePropertyPage) => BonePropertyPage) => void }) {
	return (
		<div className="split" style={visible ? {} : { display: 'none' }}>
			<div>
				{page.sections.map((section, sectionIdx) => {
					function updateSection(fn: (section: BonePropertyPageSection) => BonePropertyPageSection): void {
						update(page => {
							page.sections[sectionIdx] = fn(page.sections[sectionIdx])
							return page
						})
					}

					return <div className="bone-section" key={`${page.title}-${sectionIdx}`}><PropertyPageSection section={section} update={updateSection} /></div>
				})}
			</div>
			<div><img className="bone-page-image" src={page.image} alt={page.title} /></div>
		</div>
	)
}

function PropertyPageSection({ section, update }: { section: BonePropertyPageSection, update: (fn: (section: BonePropertyPageSection) => BonePropertyPageSection) => void }) {
	return (
		<table className="props-table">
			<thead>
				<tr>
					{section.table.headers.map(th => {
						return <th key={th}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{section.table.indexes.map((rowName, rowIdx) => {
					return (
						<tr key={rowName}>
							<td key={rowName}>{rowName}</td>

							{section.table.template.map((template, fieldIdx) => {
								function updatePropertyRow(fn: (state?: BoneProperty) => BoneProperty): void {
									update(section => {
										if (!section.props) {
											section.props = []
										}

										if (!section.props[rowIdx]) {
											section.props[rowIdx] = []
										}

										section.props[rowIdx][fieldIdx] = fn(section.props[rowIdx][fieldIdx])
										return section
									})
								}

								let value: string | undefined;
								if (section.props && section.props[rowIdx]) {
									value = section.props[rowIdx][fieldIdx]
								}

								return <td key={`${rowName}-${fieldIdx}`}><Property value={value} template={template} update={updatePropertyRow} /></td>
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
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
