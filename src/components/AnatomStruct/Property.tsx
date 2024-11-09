import { ChangeEvent, useContext } from "react";
import { AnatomStructInputMode, AnatomStructProperty, AnatomStructMultistageProperty, AnatomStructTableField, isAnatomStructMultistageProperty } from "../../models/AnatomStructTypes";
import { Dropdown } from "../UI/Dropdown";
import { EditModeContext } from "./AnatomStruct";

import './Property.css'

export type UpdatePropertyFunc = (fn: (prop: AnatomStructProperty) => AnatomStructProperty) => void
type UpdateMultistagePropertyFunc = (fn: (value?: AnatomStructMultistageProperty) => AnatomStructMultistageProperty | undefined) => void

/**
 * Property rappresenta un'opzione della tabella. In base al valore `mode` in `template` il componente genera l'input sottostante
 * corretto.
 * @param template attributo derivato dallo stato globale
 * @param state (opzionale) attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function Property({ template, rowIdx, state, update }: {
	template: AnatomStructTableField, rowIdx: number,
	state?: AnatomStructProperty, update: UpdatePropertyFunc
}) {
	const editMode = useContext(EditModeContext)

	const fixedArg = template.fixedArgs?.[rowIdx]
	if (fixedArg != undefined)
		return <td>{fixedArg}</td>

	const header = template.header ? <p className="property-header">{template.header}</p> : undefined

	switch (template.mode) {
		case AnatomStructInputMode.Blank:
			return <td></td>
		case AnatomStructInputMode.Text:
			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					return ev.target.value
				})
			}

			if (state != undefined && typeof state !== 'string')
				state = undefined

			return <td>
				{header}
				<input type="text"
					value={state ?? ''}
					onChange={handleTextInput} disabled={!editMode}
				/>
			</td>
		case AnatomStructInputMode.Number:
			const handleNumberInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					const n = Number(ev.target.value)
					return Number.isNaN(n) ? 0 : n
				})
			}

			if (state != undefined && typeof state !== 'number')
				state = undefined

			return <td>
				{header}
				<input type="number"
					value={(state ?? 0).toString()}
					onChange={handleNumberInput} disabled={!editMode}
				/>
			</td>
		case AnatomStructInputMode.Dropdown:
			const setSelected = (selected?: string): void => {
				update(() => {
					return selected
				})
			}

			if (state != undefined && typeof state !== 'string')
				state = undefined

			return <td>
				{header}
				<Dropdown
					options={template.dropdownArgs ?? []}
					selectedField={state}
					setSelectedField={setSelected} disabled={!editMode}
				/>
			</td>
		case AnatomStructInputMode.Multistage:
			const updateMultistage: UpdateMultistagePropertyFunc = (fn) => {
				update(value => {
					return fn(value as (AnatomStructMultistageProperty | undefined))
				})
			}

			if (state != undefined && !isAnatomStructMultistageProperty(state))
				state = undefined

			return <MultistageProperty
				template={template} rowIdx={rowIdx}
				state={state} update={updateMultistage}
				disabled={!editMode} header={header}
			/>
	}
}

function MultistageProperty({ template, rowIdx, state, update, disabled, header }: {
	template: AnatomStructTableField, rowIdx: number, state?: AnatomStructMultistageProperty,
	update: UpdateMultistagePropertyFunc, disabled: boolean, header?: JSX.Element
}) {
	const options: string[] | undefined = template.multistageArgs?.map(arg => arg.value)

	const setSelected = (selected?: string): void => {
		update(() => {
			if (!selected) {
				return undefined
			}

			return {
				value: selected
			}
		})
	}

	const firstStage = <td>
		{header}
		<Dropdown
			options={options ?? []}
			selectedField={state?.value ?? undefined}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</td>

	if (!state)
		return firstStage

	const nextTemplates = template.multistageArgs?.filter(arg => arg.value === state.value)[0]?.next
	if (!nextTemplates)
		return <>
			{firstStage}
			<td>Errore, template non trovato</td>
		</>

	return <>
		{firstStage}
		{nextTemplates.map((next, nextIdx) => {
			const nextUpdate = (fn: (value?: AnatomStructProperty) => AnatomStructProperty): void => {
				update(multistage => {
					if (!multistage)
						throw new Error('multistage is undefined after the first stage')

					if (!multistage.next)
						multistage.next = []

					multistage.next[nextIdx] = fn(multistage.next[nextIdx])
					return multistage
				})
			}

			return <Property key={nextIdx}
				template={next} rowIdx={rowIdx}
				state={state.next?.[nextIdx]} update={nextUpdate}
			/>
		})}
		
	</>
}
