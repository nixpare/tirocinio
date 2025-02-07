import './Field.css'

import { ChangeEvent, useContext, useState } from "react";
import { Updater } from "use-immer";
import Select, { ActionMeta, MultiValue, StylesConfig } from 'react-select'
import { FormFieldData, FormFieldTemplate, formFieldIsBlank, formFieldIsText, formFieldDataIsText, formFieldIsNumber, formFieldDataIsNumber, formFieldIsSelect, formFieldDataIsSelect, FormSelectFieldTemplate, FormSelectFieldValue, FormSelectFieldData, formFieldIsDeduction, formFieldIsMultiSelect, FormMultiSelectFieldData, FormMultiSelectFieldTemplate, formFieldDataIsMultiSelect, FormFieldSelectArg } from "../../models/Form";
import { Dropdown, DropdownOption } from "../UI/Dropdown";
import { EditModeContext, FormDataContext } from "./Form";
import { deductionMap } from '../../models/Deduction';

export type UpdateFieldFunc = Updater<FormFieldData>
type UpdateSelectFieldFunc = Updater<FormSelectFieldData>
type UpdateMultiSelectFieldFunc = Updater<FormMultiSelectFieldData>

export function Field({ field, data, update }: {
	field: FormFieldTemplate,
	data?: FormFieldData, update: UpdateFieldFunc
}) {
	const editMode = useContext(EditModeContext)

	switch (true) {
		case formFieldIsBlank(field):
			return <div>
				<p className="field-header">{field.header}</p>
			</div>
		case formFieldIsText(field):
			if (data != undefined && !formFieldDataIsText(data))
				data = undefined

			const handleTextInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				update({
					type: 'text',
					value: ev.target.value
				})
			}

			return <div>
				<p className="field-header">{field.header}</p>
				<input type="text"
					value={data?.value ?? ''}
					onChange={handleTextInput} disabled={!editMode}
				/>
			</div>
		case formFieldIsNumber(field):
			if (data != undefined && !formFieldDataIsNumber(data))
				data = undefined

			let className: string | undefined

			if (data != undefined && data.value != undefined && (
				(field.min != undefined && data.value < field.min) ||
				(field.max != undefined && data.value > field.max)
			)) {
				className = 'invalid'
			}

			const handleNumberInput = (ev: ChangeEvent<HTMLInputElement>): void => {
				const n = Number(ev.target.value)
				update({
					type: 'number',
					value: Number.isNaN(n) ? 0 : n
				})
			}

			return <div>
				<p className="field-header">{field.header}</p>
				<input type="number" className={className}
					value={(data?.value ?? 0).toString()}
					onChange={handleNumberInput} disabled={!editMode}
				/>
			</div>
		case formFieldIsSelect(field):
			if (data != undefined && !formFieldDataIsSelect(data))
				data = undefined

			return <SelectField
				field={field}
				data={data} update={update as UpdateSelectFieldFunc}
				disabled={!editMode}
			/>
		case formFieldIsMultiSelect(field):
			if (data != undefined && !formFieldDataIsMultiSelect(data))
				data = undefined

			return <MultiSelectField
				field={field}
				data={data} update={update as UpdateMultiSelectFieldFunc}
				disabled={!editMode}
			/>
		case formFieldIsDeduction(field):
			let deductionResult: string
			try {
				const formData = useContext(FormDataContext)
				if (!formData)
					throw new Error('informazioni sul form corrente non trovate')

				deductionResult = deductionMap[field.deductionID](formData)
			} catch (e) {
				console.error(e)
				deductionResult = 'Errore nel calcolo'
			}

			return <div>
				<p className="field-header">{field.header}</p>
				{deductionResult}
			</div>
	}
}

function SelectField({ field, data, update, disabled }: {
	field: FormSelectFieldTemplate,
	data?: FormSelectFieldData, update: UpdateSelectFieldFunc,
	disabled: boolean
}) {
	const options = Object.entries(field.selectArgs).map<DropdownOption>(([value, arg]) => ({
		value: value,
		display: arg.display
	}))

	const setSelected = (selected?: DropdownOption): void => {
		update({
			type: 'select',
			value: selected ? {
				selection: selected.value
			} : undefined
		})
	}

	const selectedValue = data?.value?.selection
	const selectedDisplay = selectedValue != undefined ? Object.entries(field.selectArgs).reduce<string | undefined>((prev, [currValue, currArg]) => {
		if (prev)
			return prev

		return currValue == selectedValue ? currArg.display : undefined
	}, undefined) : undefined

	const firstStage = <div>
		<p className="field-header">{field.header}</p>
		<Dropdown
			options={options ?? []}
			selectedField={selectedDisplay}
			setSelectedField={setSelected}
			disabled={disabled}
		/>
	</div>

	if (data == undefined || data.value == undefined)
		return firstStage

	const [_, matchedArg] = Object.entries(field.selectArgs).filter(([value, _]) => {
		return data.value != undefined && value === data.value.selection
	})[0]
	if (!matchedArg)
		return <>
			{firstStage}
			<div>Errore, nessun campo trovato per {data.value.selection}</div>
		</>

	if (!matchedArg.next)
		return firstStage

	return <>
		{firstStage}
		{matchedArg.next.map((next, nextIdx) => {
			const updateNext: Updater<FormFieldData> = (updater) => {
				update(selectData => {
					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = []

					if (typeof updater !== 'function') {
						selectData.value.next[nextIdx] = updater
						return
					}

					updater(selectData.value.next[nextIdx])
				})
			}

			return <Field key={nextIdx}
				field={next}
				data={(data.value as FormSelectFieldValue).next?.[nextIdx]} update={updateNext}
			/>
		})}

	</>
}

type MultiSelectOption = {
	value: string
	label: string
}

function MultiSelectField({ field, data, update, disabled }: {
	field: FormMultiSelectFieldTemplate,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
	disabled: boolean
}) {
	const options: MultiSelectOption[] | undefined = Object.entries(field.selectArgs).map(([value, arg]) => ({
		value: value,
		label: arg.display
	}))

	const [selectedOptions, setSelectedOptions] = useState<MultiSelectOption[]>([])

	const styles: StylesConfig<MultiSelectOption, true> = {
		container: (base, _) => {
			return disabled ? { ...base, display: 'none' } : base;
		},
		multiValueLabel: (base, _) => {
			return { ...base, fontWeight: 'bold', paddingRight: 6 };
		},
		multiValueRemove: (base, _) => {
			return { ...base, display: 'none' };
		},
	};

	const onChange = (newValue: MultiValue<MultiSelectOption>, actionMeta: ActionMeta<MultiSelectOption>) => {
		setSelectedOptions(newValue as MultiSelectOption[])
		
		update(selectData => {
			if (actionMeta.option == undefined)
				return

			if (!selectData.value)
				selectData.value = { selections: [] }

			selectData.value.selections.push(actionMeta.option.value)
		})
	}

	return <div>
		<p className="field-header">{field.header}</p>
		<Select options={options} isMulti isClearable={false}
			placeholder={field.header}
			styles={styles}
			onChange={onChange} />
		<div className='multi-select'>
			{selectedOptions.map((sel) => {
				const selectedArg = field.selectArgs[sel.value]

				return <div className='container container-horiz multi-select-arg' key={sel.value}>
					<div className='arg-display'>{selectedArg.display}</div>
					<MultiSelectNextFields selected={sel.value} arg={selectedArg}
						data={data} update={update} />
				</div>
			})}
		</div>
	</div>
}

function MultiSelectNextFields({ selected, arg, data, update } : {
	selected: string, arg: FormFieldSelectArg,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
}) {
	return <div className='next-fields'>
		{arg.next?.map((next, nextIdx) => {
			const updateNext: Updater<FormFieldData> = (updater) => {
				update(selectData => {
					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = {}

					if (selectData.value.next[selected] == undefined)
						selectData.value.next[selected] = []

					if (typeof updater !== 'function') {
						// @ts-ignore
						selectData.value.next[selected][nextIdx] = updater
						return
					}

					// @ts-ignore
					updater(selectData.value.next[selected][nextIdx])
				})
			}

			return <Field field={next} key={next.header}
				data={data?.value?.next?.[selected]?.[nextIdx]}
				update={updateNext} />
		})}
	</div>
}
