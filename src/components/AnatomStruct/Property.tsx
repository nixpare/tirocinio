import { ChangeEvent, useContext } from "react";
import { AnatomStructInputMode, AnatomStructProperty, AnatomStructMultistageProperty, AnatomStructTableField } from "../../models/AnatomStructTypes";
import { Dropdown } from "../UI/Dropdown";
import { EditModeContext } from "./AnatomStruct";

import './Property.css'

export type UpdatePropertyFunc = (fn: (prop: AnatomStructProperty) => AnatomStructProperty) => void

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

	switch (template.mode) {
		case AnatomStructInputMode.Fixed:
			return <td>{template.fixedArgs?.[rowIdx]}</td>
		case AnatomStructInputMode.Text:
			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					return ev.target.value
				})
			}

			return <td>
				<input type="text"
					value={state as (string | undefined) ?? ''}
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

			return <td>
				<input type="number"
					value={(state as (number | undefined) ?? 0).toString()}
					onChange={handleNumberInput} disabled={!editMode}
				/>
			</td>
		case AnatomStructInputMode.Dropdown:
			const setSelected = (selected: string): void => {
				update(() => {
					return selected
				})
			}

			return <td>
				<Dropdown
					options={template.dropdownArgs ?? []}
					selectedField={state as (string | undefined)}
					setSelectedField={setSelected} disabled={!editMode}
				/>
			</td>
		case AnatomStructInputMode.Multistage:
			const updateMultistage = (fn: (value?: AnatomStructMultistageProperty) => AnatomStructMultistageProperty): void => {
				update(value => {
					return fn(value as (AnatomStructMultistageProperty | undefined))
				})
			}

			return <MultistageProperty
				template={template} rowIdx={rowIdx}
				state={state as (AnatomStructMultistageProperty | undefined)}
				update={updateMultistage} disabled={!editMode}
			/>
	}
}

function MultistageProperty({ template, rowIdx, state, update, disabled }: {
	template: AnatomStructTableField, rowIdx: number, state?: AnatomStructMultistageProperty,
	update: (fn: (value?: AnatomStructMultistageProperty) => AnatomStructMultistageProperty) => void, disabled: boolean
}) {
	const options: string[] | undefined = template.multistageArgs?.map(arg => arg.value)

	const setSelected = (selected: string): void => {
		update(multistage => {
			if (!multistage) {
				return { value: selected }
			}

			if (multistage.value === selected) {
				return multistage
			}

			multistage.value = selected
			multistage.next = undefined
			return multistage
		})
	}

	if (!state) {
		return <td>
			<Dropdown
				options={options ?? []}
				setSelectedField={setSelected}
				disabled={disabled}
			/>
		</td>
	}

	const firstStage = <td>
		<Dropdown
			options={options ?? []}
			selectedField={state.value}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</td>

	const nextTemplate = template.multistageArgs?.filter(arg => arg.value === state.value)[0].next
	if (!nextTemplate)
		return <>
			{firstStage}
			<td>Errore, template non trovato</td>
		</>

	const nextValue = state.next
	const nextUpdate = (fn: (value?: AnatomStructProperty) => AnatomStructProperty): void => {
		update(multistage => {
			if (!multistage)
				throw new Error('multistage is undefined after the first stage')

			multistage.next = fn(multistage?.next)
			return multistage
		})
	}

	return <>
		{firstStage}
		<Property
			template={nextTemplate} rowIdx={rowIdx}
			state={nextValue} update={nextUpdate}
		/>
	</>
}
