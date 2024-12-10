import './Field.css'

import { ChangeEvent, useContext } from "react";
import { Updater } from "use-immer";
import { FormTableFieldData, FormTableMultistageFieldData, FormTableFieldTemplate, formFieldIsBlank, formFieldIsText, formFieldDataIsText, formFieldIsNumber, formFieldDataIsNumber, formFieldIsDropdown, formFieldDataIsDropdown, formFieldIsMultistage, formFieldDataIsMultistage, FormTableMultistageFieldTemplate, FormTableMultistageFieldValue } from "../../models/Form";
import { Dropdown } from "../UI/Dropdown";
import { EditModeContext } from "./Form";

export type UpdateFieldFunc = Updater<FormTableFieldData>
type UpdateMultistageFieldFunc = Updater<FormTableMultistageFieldData>

/**
 * Property rappresenta un'opzione della tabella. In base al valore `mode` in `template` il componente genera l'input sottostante
 * corretto.
 * @param template attributo derivato dallo stato globale
 * @param state (opzionale) attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function Field({ field, rowIdx, data, update }: {
	field: FormTableFieldTemplate, rowIdx: number,
	data?: FormTableFieldData, update: UpdateFieldFunc
}) {
	const editMode = useContext(EditModeContext)

	const fixedArg = field.fixedArgs?.[rowIdx]
	if (fixedArg != undefined)
		return <td>{fixedArg}</td>

	const header = field.header ? <p className="field-header">{field.header}</p> : undefined

	switch (true) {
		case formFieldIsBlank(field):
			return <td></td>
		case formFieldIsText(field):
			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update({
					type: 'text',
					value: ev.target.value
				})
			}

			if (data != undefined && !formFieldDataIsText(data))
				data = undefined

			return <td>
				{header}
				<input type="text"
					value={data?.value ?? ''}
					onChange={handleTextInput} disabled={!editMode}
				/>
			</td>
		case formFieldIsNumber(field):
			const handleNumberInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				const n = Number(ev.target.value)
				update({
					type: 'number',
					value: Number.isNaN(n) ? 0 : n
				})
			}

			if (data != undefined && !formFieldDataIsNumber(data))
				data = undefined

			let className: string | undefined

			if (data != undefined && data.value != undefined && (
				(field.min != undefined && data.value < field.min) ||
				(field.max != undefined && data.value > field.max)
			)) {
				className = 'invalid'
			}

			return <td>
				{header}
				<input type="number" className={className}
					value={(data?.value ?? 0).toString()}
					onChange={handleNumberInput} disabled={!editMode}
				/>
			</td>
		case formFieldIsDropdown(field):
			const setSelected = (selected?: string): void => {
				update({
					type: 'dropdown',
					value: selected
				})
			}

			if (data != undefined && !formFieldDataIsDropdown(data))
				data = undefined

			return <td>
				{header}
				<Dropdown
					options={field.dropdownArgs ?? []}
					selectedField={data?.value}
					setSelectedField={setSelected} disabled={!editMode}
				/>
			</td>
		case formFieldIsMultistage(field):
			const updateMultistage: UpdateMultistageFieldFunc = (updater) => {
				if (typeof updater !== 'function') {
					update(updater)
					return
				}

				update(fieldData => {
					updater(fieldData as FormTableMultistageFieldData)
				})
			}

			if (data != undefined && !formFieldDataIsMultistage(data))
				data = undefined

			return <MultistageField
				field={field} rowIdx={rowIdx}
				data={data} update={updateMultistage}
				disabled={!editMode} header={header}
			/>
	}
}

function MultistageField({ field, rowIdx, data, update, disabled, header }: {
	field: FormTableMultistageFieldTemplate, rowIdx: number, data?: FormTableMultistageFieldData,
	update: UpdateMultistageFieldFunc, disabled: boolean, header?: JSX.Element
}) {
	const options: string[] | undefined = field.multistageArgs?.map(arg => arg.value)

	const setSelected = (selected?: string): void => {
		update({
			type: 'multistage',
			value: selected ? {
				selection: selected
			} : undefined
		})
	}

	const firstStage = <td>
		{header}
		<Dropdown
			options={options ?? []}
			selectedField={data?.value?.selection ?? undefined}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</td>

	if (data == undefined || data.value == undefined)
		return firstStage

	const nextFields = field.multistageArgs?.filter(arg => {
		// @ts-ignore
		return arg.value === data.value.selection
	})[0]?.next
	if (!nextFields)
		return <>
			{firstStage}
			<td>Errore, nessun campo trovato per {data.value.selection}</td>
		</>

	return <>
		{firstStage}
		{nextFields.map((next, nextIdx) => {
			const nextUpdate: Updater<FormTableFieldData> = (updater) => {
				update(multistageData => {
					if (multistageData == undefined || multistageData.value == undefined)
						throw new Error('multistage is undefined after the first stage')

					if (multistageData.value.next == undefined)
						multistageData.value.next = []

					if (typeof updater !== 'function') {
						multistageData.value.next[nextIdx] = updater
						return
					}

					updater(multistageData.value.next[nextIdx])
				})
			}

			return <Field key={nextIdx}
				field={next} rowIdx={rowIdx}
				data={(data.value as FormTableMultistageFieldValue).next?.[nextIdx]} update={nextUpdate}
			/>
		})}

	</>
}
