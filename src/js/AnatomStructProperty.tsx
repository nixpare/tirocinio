import { ChangeEvent } from "react";
import { AnatomStructInputMode, AnatomStructProperty, AnatomStructPropertyMultistage, AnatomStructTableField } from "./models/AnatomStructTypes";
import { Dropdown } from "./Dropdown";

import '../css/AnatomStructProperty.css'

export type UpdatePropertyFunc = (fn: (prop: AnatomStructProperty) => AnatomStructProperty) => void

/**
 * Property rappresenta un'opzione della tabella. In base al valore `mode` in `template` il componente genera l'input sottostante
 * corretto.
 * @param template attributo derivato dallo stato globale
 * @param state (opzionale) attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function Property({ template, state, update }: { template: AnatomStructTableField, state?: AnatomStructProperty, update: UpdatePropertyFunc }) {
	switch (template.mode) {
		case AnatomStructInputMode.Text:
			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					return ev.target.value
				})
			}

			return <td>
				<input type="text"
					value={state as (string | undefined) || ''}
					onChange={handleTextInput}
				/>
			</td>;
		case AnatomStructInputMode.Number:
			const handleNumberInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					const n = Number(ev.target.value)
					return Number.isNaN(n) ? 0 : n
				})
			}

			state = (state as (number | undefined) || 0).toString()

			return <td>
				<input type="number"
					value={state}
					onChange={handleNumberInput}
				/>
			</td>;
		case AnatomStructInputMode.Dropdown:
			const setSelected = (selected: string): void => {
				update(() => {
					return selected
				})
			}

			return <td>
				<Dropdown
					options={template.dropdownArgs || []}
					selectedField={state as (string | undefined)}
					setSelectedField={setSelected}
				/>
			</td>
		case AnatomStructInputMode.Multistage:
			const updateMultistage = (fn: (value?: AnatomStructPropertyMultistage) => AnatomStructPropertyMultistage): void => {
				update(value => {
					return fn(value as (AnatomStructPropertyMultistage | undefined))
				})
			}

			return <MultistageProperty
				template={template}
				state={state as (AnatomStructPropertyMultistage | undefined)}
				update={updateMultistage}
			/>
	}
}

function MultistageProperty({ template, state, update }: { template: AnatomStructTableField, state?: AnatomStructPropertyMultistage, update: (fn: (value?: AnatomStructPropertyMultistage) => AnatomStructPropertyMultistage) => void }) {
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
				options={options || []}
				setSelectedField={setSelected}
			/>
		</td>
	}

	const firstStage = (<td>
		<Dropdown
			options={options || []}
			selectedField={state.value}
			setSelectedField={setSelected}
		/>
	</td>)

	const nextTemplate = template.multistageArgs?.filter(arg => arg.value === state.value)[0].next
	if (!nextTemplate) {
		return <>
			{firstStage}
			<td>Errore, template non trovato</td>
		</>
	}
	const nextValue = state.next
	const nextUpdate = (fn: (value?: AnatomStructProperty) => AnatomStructProperty): void => {
		update(multistage => {
			if (!multistage) {
				throw new Error('multistage is undefined after the first stage')
			}

			multistage.next = fn(multistage?.next)
			return multistage
		})
	}

	return <>
		{firstStage}
		<Property template={nextTemplate} state={nextValue} update={nextUpdate} />
	</>
}
