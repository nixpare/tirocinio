import { ChangeEvent, useContext } from "react";
import { FormTableFieldType, FormTableFieldData, FormTableMultistageFieldData, FormTableFieldTemplate, isFormTableMultistageFieldData } from "../../models/Form";
import { Dropdown } from "../UI/Dropdown";
import { EditModeContext } from "./Form";

import './Field.css'

export type UpdateFieldFunc = (fn: (fieldData: FormTableFieldData) => FormTableFieldData) => void
type UpdateMultistageFieldFunc = (fn: (multistageFieldData?: FormTableMultistageFieldData) => FormTableMultistageFieldData | undefined) => void

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

	switch (field.mode) {
		case FormTableFieldType.Blank:
			return <td></td>
		case FormTableFieldType.Text:
			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					return ev.target.value
				})
			}

			if (data != undefined && typeof data !== 'string')
				data = undefined

			return <td>
				{header}
				<input type="text"
					value={data ?? ''}
					onChange={handleTextInput} disabled={!editMode}
				/>
			</td>
		case FormTableFieldType.Number:
			const handleNumberInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update(() => {
					const n = Number(ev.target.value)
					return Number.isNaN(n) ? 0 : n
				})
			}

			if (data != undefined && typeof data !== 'number')
				data = undefined

			let className: string | undefined

			if (data != undefined && (
				(field.min != undefined && data < field.min) ||
				(field.max != undefined && data > field.max)
			)) {
				className = 'invalid'
			}

			return <td>
				{header}
				<input type="number" className={className}
					value={(data ?? 0).toString()}
					onChange={handleNumberInput} disabled={!editMode}
				/>
			</td>
		case FormTableFieldType.Dropdown:
			const setSelected = (selected?: string): void => {
				update(() => {
					return selected
				})
			}

			if (data != undefined && typeof data !== 'string')
				data = undefined

			return <td>
				{header}
				<Dropdown
					options={field.dropdownArgs ?? []}
					selectedField={data}
					setSelectedField={setSelected} disabled={!editMode}
				/>
			</td>
		case FormTableFieldType.Multistage:
			const updateMultistage: UpdateMultistageFieldFunc = (fn) => {
				update(fieldData => {
					return fn(fieldData as (FormTableMultistageFieldData | undefined))
				})
			}

			if (data != undefined && !isFormTableMultistageFieldData(data))
				data = undefined

			return <MultistageField
				field={field} rowIdx={rowIdx}
				data={data} update={updateMultistage}
				disabled={!editMode} header={header}
			/>
	}
}

function MultistageField({ field, rowIdx, data, update, disabled, header }: {
	field: FormTableFieldTemplate, rowIdx: number, data?: FormTableMultistageFieldData,
	update: UpdateMultistageFieldFunc, disabled: boolean, header?: JSX.Element
}) {
	const options: string[] | undefined = field.multistageArgs?.map(arg => arg.value)

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
			selectedField={data?.value ?? undefined}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</td>

	if (!data)
		return firstStage

	const nextFields = field.multistageArgs?.filter(arg => arg.value === data.value)[0]?.next
	if (!nextFields)
		return <>
			{firstStage}
			<td>Errore, nessun campo trovato per {data.value}</td>
		</>

	return <>
		{firstStage}
		{nextFields.map((next, nextIdx) => {
			const nextUpdate = (fn: (value?: FormTableFieldData) => FormTableFieldData): void => {
				update(multistageData => {
					if (!multistageData)
						throw new Error('multistage is undefined after the first stage')

					if (!multistageData.next)
						multistageData.next = []

					multistageData.next[nextIdx] = fn(multistageData.next[nextIdx])
					return multistageData
				})
			}

			return <Field key={nextIdx}
				field={next} rowIdx={rowIdx}
				data={data.next?.[nextIdx]} update={nextUpdate}
			/>
		})}

	</>
}
