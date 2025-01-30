import './Field.css'

import { ChangeEvent, useContext } from "react";
import { Updater } from "use-immer";
import { FormTableFieldData, FormTableFieldTemplate, formFieldIsBlank, formFieldIsText, formFieldDataIsText, formFieldIsNumber, formFieldDataIsNumber, formFieldIsDropdown, formFieldDataIsDropdown, FormTableDropdownFieldTemplate, FormTableDropdownFieldValue, FormTableDropdownFieldData, formFieldIsDeduction } from "../../models/Form";
import { Dropdown, DropdownOption } from "../UI/Dropdown";
import { EditModeContext, FormDataContext } from "./Form";
import { deductionMap } from '../../models/Deduction';

export type UpdateFieldFunc = Updater<FormTableFieldData>
type UpdateDropdownFieldFunc = Updater<FormTableDropdownFieldData>

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

	const header = field.header ? <p className="field-header">{field.header}</p> : undefined

	const fixedArg = field.fixedArgs?.[rowIdx]
	if (fixedArg != undefined)
		return <td>
			{header}
			{fixedArg}
		</td>

	switch (true) {
		case formFieldIsBlank(field):
			console.log('ciao')
			return <td>
				{header}
			</td>
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
			const updateDropdown: UpdateDropdownFieldFunc = (updater) => {
				if (typeof updater !== 'function') {
					update(updater)
					return
				}

				update(fieldData => {
					updater(fieldData as FormTableDropdownFieldData)
				})
			}

			if (data != undefined && !formFieldDataIsDropdown(data))
				data = undefined

			return <DropdownField
				field={field} rowIdx={rowIdx}
				data={data} update={updateDropdown}
				disabled={!editMode} header={header}
			/>
		case formFieldIsDeduction(field):
			let deductionResult: string
			try {
				const formData = useContext(FormDataContext)
				if (!formData)
					throw new Error('informazioni sul form corrente non trovate')

				deductionResult = deductionMap[field.deductionID](formData, rowIdx)
			} catch (e) {
				console.error(e)
				deductionResult = 'Errore nel calcolo'
			}

			return <td>
				{header}
				{deductionResult}
			</td>
	}
}

function DropdownField({ field, rowIdx, data, update, disabled, header }: {
	field: FormTableDropdownFieldTemplate, rowIdx: number, data?: FormTableDropdownFieldData,
	update: UpdateDropdownFieldFunc, disabled: boolean, header?: JSX.Element
}) {
	const options: DropdownOption[] | undefined = field.dropdownArgs?.map(arg => ({
		value: arg.value,
		display: arg.display
	}))

	const setSelected = (selected?: DropdownOption): void => {
		update({
			type: 'dropdown',
			value: selected ? {
				selection: selected.value
			} : undefined
		})
	}

	const selectedValue = data?.value?.selection
	const selectedDisplay = selectedValue != undefined ? field.dropdownArgs.reduce<string | undefined>((prev, curr) => {
		if (prev)
			return prev

		return curr.value == selectedValue ? curr.display : undefined
	}, undefined) : undefined

	const firstStage = <td>
		{header}
		<Dropdown
			options={options ?? []}
			selectedField={selectedDisplay}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</td>

	if (data == undefined || data.value == undefined)
		return firstStage

	const matchedArg = field.dropdownArgs?.filter(arg => {
		// @ts-ignore
		return arg.value === data.value.selection
	})[0]
	if (!matchedArg)
		return <>
			{firstStage}
			<td>Errore, nessun campo trovato per {data.value.selection}</td>
		</>

	const nextFields = matchedArg.next
	if (!nextFields)
		return firstStage

	return <>
		{firstStage}
		{nextFields.map((next, nextIdx) => {
			const nextUpdate: Updater<FormTableFieldData> = (updater) => {
				update(dropdownData => {
					if (dropdownData == undefined || dropdownData.value == undefined)
						throw new Error('dropdown is undefined after the first stage')

					if (dropdownData.value.next == undefined)
						dropdownData.value.next = []

					if (typeof updater !== 'function') {
						dropdownData.value.next[nextIdx] = updater
						return
					}

					updater(dropdownData.value.next[nextIdx])
				})
			}

			return <Field key={nextIdx}
				field={next} rowIdx={rowIdx}
				data={(data.value as FormTableDropdownFieldValue).next?.[nextIdx]} update={nextUpdate}
			/>
		})}

	</>
}
