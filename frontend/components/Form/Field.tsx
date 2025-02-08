import './Field.css'

import { ChangeEvent, MouseEvent, useContext, useRef, useState } from "react";
import { Updater, useImmer } from "use-immer";
import Select, { ActionMeta, MultiValue, SelectInstance, StylesConfig } from 'react-select'
import { FormFieldData, FormFieldTemplate, formFieldIsBlank, formFieldIsText, formFieldDataIsText, formFieldIsNumber, formFieldDataIsNumber, formFieldIsSelect, formFieldDataIsSelect, FormSelectFieldTemplate, FormSelectFieldData, formFieldIsDeduction, formFieldIsMultiSelect, FormMultiSelectFieldData, FormMultiSelectFieldTemplate, formFieldDataIsMultiSelect, FormFieldSelectArg, formFieldIsExpansion, formFieldDataIsExpansion, FormExpansionFieldData, FormExpansionFieldTemplate } from "../../models/Form";
import { EditModeContext, FormDataContext } from "./Form";
import { deductionMap } from '../../models/Deduction';

export type UpdateFieldFunc = Updater<FormFieldData>
type UpdateSelectFieldFunc = Updater<FormSelectFieldData>
type UpdateMultiSelectFieldFunc = Updater<FormMultiSelectFieldData>
type UpdateExpansionFieldFunc = Updater<FormExpansionFieldData>

export function Field({ field, data, update, hideHeader }: {
	field: FormFieldTemplate,
	data?: FormFieldData, update: UpdateFieldFunc,
	hideHeader?: boolean
}) {
	const editMode = useContext(EditModeContext)

	switch (true) {
		case formFieldIsBlank(field):
			return <div className="field">
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

			return <div className="field text-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
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

			return <div className="field number-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
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
				disabled={!editMode} hideHeader={hideHeader}
			/>
		case formFieldIsMultiSelect(field):
			if (data != undefined && !formFieldDataIsMultiSelect(data))
				data = undefined

			return <MultiSelectField
				field={field}
				data={data} update={update as UpdateMultiSelectFieldFunc}
				disabled={!editMode} hideHeader={hideHeader}
			/>
		case formFieldIsExpansion(field):
			if (data != undefined && !formFieldDataIsExpansion(data))
				data = undefined

			return <ExpansionField
				field={field}
				data={data} update={update as UpdateExpansionFieldFunc}
				disabled={!editMode} hideHeader={hideHeader}
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

			return <div className="field deduction-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
				<p>{deductionResult}</p>
			</div>
	}
}

type SelectOption = {
	value: string
	label: string
}

function SelectField({ field, data, update, disabled, hideHeader }: {
	field: FormSelectFieldTemplate,
	data?: FormSelectFieldData, update: UpdateSelectFieldFunc,
	disabled: boolean, hideHeader?: boolean
}) {
	const options: SelectOption[] | undefined = Object.entries(field.selectArgs).map(([value, arg]) => ({
		value: value,
		label: arg.display
	}))

	const styles: StylesConfig<SelectOption, true> = {
		multiValueLabel: (base, _) => {
			return { ...base, fontWeight: 'bold', paddingRight: 6 };
		},
	};

	const onChange = (newValue: SelectOption, _: ActionMeta<SelectOption>) => {
		update(selectData => {
			if (newValue == undefined) {
				selectData.value = undefined
				return
			}

			if (selectData.value == undefined)
				selectData.value = { selection: '' }

			selectData.value.selection = newValue?.value
		})
	}

	return <div className="field select-field">
		<div className="select-input">
			{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
			<Select options={options} isClearable={true} isDisabled={disabled}
				placeholder={field.header}
				styles={styles}
				defaultValue={options.filter(opt => data && data.value && data.value.selection == opt.value)}
				// @ts-ignore
				onChange={onChange} />
		</div>
		{ data && data.value &&
			<SelectNextFields arg={field.selectArgs[data.value.selection]}
				data={data} update={update} /> }
	</div>
}

function SelectNextFields({ arg, data, update }: {
	arg: FormFieldSelectArg,
	data?: FormSelectFieldData, update: UpdateSelectFieldFunc,
}) {
	return <div className='next-fields'>
		{arg.next?.map((next, nextIdx) => {
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

			return <Field field={next} key={nextIdx}
				data={data?.value?.next?.[nextIdx]}
				update={updateNext} />
		})}
	</div>
}

function MultiSelectField({ field, data, update, disabled, hideHeader }: {
	field: FormMultiSelectFieldTemplate,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
	disabled: boolean, hideHeader?: boolean
}) {
	const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])
	const selectRef = useRef<SelectInstance<SelectOption> | null>(null);

	const options: SelectOption[] | undefined = Object.entries(field.selectArgs).map(([value, arg]) => ({
		value: value,
		label: arg.display
	}))

	const styles: StylesConfig<SelectOption, true> = {
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

	const onChange = (newValue: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
		setSelectedOptions(newValue as SelectOption[])
		
		update(selectData => {
			if (actionMeta.option == undefined)
				return

			if (!selectData.value)
				selectData.value = { selections: [] }

			selectData.value.selections.push(actionMeta.option.value)
		})
	}

	return <div className="field">
		<div className="select-input">
			{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
			<Select options={options} isMulti isClearable={false} isDisabled={disabled}
				// @ts-ignore
				ref={selectRef}
				placeholder={field.header}
				styles={styles}
				onChange={onChange} />
		</div>
		<div className='multi-select'>
			{selectedOptions.map((sel) => {
				const selectedArg = field.selectArgs[sel.value]

				const deleteSelection = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
					ev.preventDefault()
					selectRef?.current?.removeValue(sel)
				}

				return <div className='container container-horiz multi-select-arg' key={sel.value}>
					<div className='arg-display'>{selectedArg.display}</div>
					<MultiSelectNextFields selected={sel.value} arg={selectedArg}
						data={data} update={update} />
					<button className="delete-select-arg" onClick={deleteSelection}>
						<i className="fa-solid fa-trash"></i>
					</button>
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
					if (arg.next == undefined)
						return

					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = {}

					if (selectData.value.next[selected] == undefined)
						selectData.value.next[selected] = []

					if (typeof updater !== 'function') {
						selectData.value.next[selected][nextIdx] = updater
						return
					}

					if (selectData.value.next[selected][nextIdx] == undefined)
						selectData.value.next[selected][nextIdx] = { type: arg.next[nextIdx].type }

					updater(selectData.value.next[selected][nextIdx])
				})
			}

			return <Field field={next} key={nextIdx}
				data={data?.value?.next?.[selected]?.[nextIdx]}
				update={updateNext} />
		})}
	</div>
}

function ExpansionField({ field, data, update, disabled, hideHeader }: {
	field: FormExpansionFieldTemplate,
	data?: FormExpansionFieldData, update: UpdateExpansionFieldFunc,
	disabled: boolean, hideHeader?: boolean
}) {
	const [expansionData, updateExpansionData] = useImmer<FormFieldData[]>([])

	const addRow = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
		ev.preventDefault()
		update(data => {
			if (data.value == undefined)
				data.value = {}

			if (data.value.additional == undefined)
				data.value.additional = []

			data.value.additional.push(expansionData)
			console.log(expansionData, data.value.additional)
		})
		updateExpansionData([])
	}

	return <div className='field expansion-field'>
		{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
		<div className="fixed-data">
			{field.fixed?.map((fixedRow, rowIdx) => {
				return <div key={rowIdx}>
					{fixedRow.map((field, fieldIdx) => {
						const updateField: Updater<FormFieldData> = (updater) => {
							update(expansionData => {
								if (expansionData == undefined)
									throw new Error('expansion is undefined after the first stage')

								if (expansionData.value == undefined)
									expansionData.value = {}

								if (expansionData.value.fixed == undefined)
									expansionData.value.fixed = []

								if (expansionData.value.fixed[rowIdx] == undefined)
									expansionData.value.fixed[rowIdx] = []

								if (typeof updater !== 'function') {
									expansionData.value.fixed[rowIdx][fieldIdx] = updater
									return
								}

								if (expansionData.value.fixed[rowIdx][fieldIdx] == undefined)
									expansionData.value.fixed[rowIdx][fieldIdx] = { type: field.type }

								updater(expansionData.value.fixed[rowIdx][fieldIdx])
							})
						}

						return <Field field={field} key={fieldIdx}
							data={data?.value?.fixed?.[rowIdx]?.[fieldIdx]} update={updateField}
							hideHeader
						/>
					})}
					{data?.value?.additional?.[rowIdx] && field.next && (() => {
						const updateNextFields: Updater<FormFieldData[]> = (updater) => {
							update(expansionData => {
								if (expansionData == undefined || expansionData.value == undefined ||
									expansionData.value.additional == undefined || expansionData.value.additional[rowIdx] == undefined) {
									throw new Error('expansion is undefined after the first stage')
								}

								if (typeof updater !== 'function') {
									expansionData.value.additional[rowIdx] = updater
									return
								}

								updater(expansionData.value.additional[rowIdx])
							})
						}

						return <ExpansionNextFields next={field.next} dataOffset={field.expansionArgs.length}
							data={data.value?.additional?.[rowIdx]} update={updateNextFields}
						/>
					})()}
				</div>
			})}
		</div>
		<div className="additional">
			<div className="input-fields">
				{field.expansionArgs.map((arg, argIdx) => {
					const updateField: Updater<FormFieldData> = (updater) => {
						updateExpansionData(data => {
							if (typeof updater !== 'function') {
								data[argIdx] = updater
								return
							}

							if (data[argIdx] == undefined)
								data[argIdx] = { type: arg.type }

							updater(data[argIdx])
						})
					}

					return <Field field={arg} key={argIdx}
						data={expansionData[argIdx]} update={updateField}
					/>
				})}
			</div>
			<button className='add-row' onClick={addRow} disabled={disabled}>
				Aggiungi <i className="fa-solid fa-plus"></i>
			</button>
		</div>
		<div className="expansion-data">
			{data?.value?.additional?.map((additionalData, rowIdx) => {
				return <div key={rowIdx}>
					{field.expansionArgs.map((arg, argIdx) => {
						const updateField: Updater<FormFieldData> = (updater) => {
							update(expansionData => {
								if (expansionData == undefined || expansionData.value == undefined || expansionData.value.additional == undefined)
									throw new Error('expansion is undefined after the first stage')

								if (expansionData.value.additional[rowIdx] == undefined)
									expansionData.value.additional[rowIdx] = []

								if (typeof updater !== 'function') {
									expansionData.value.additional[rowIdx][argIdx] = updater
									return
								}

								if (expansionData.value.additional[rowIdx][argIdx] == undefined)
									expansionData.value.additional[rowIdx][argIdx] = { type: arg.type }

								updater(expansionData.value.additional[rowIdx][argIdx])
							})
						}

						return <Field field={arg} key={argIdx}
							data={additionalData[argIdx]} update={updateField}
							hideHeader
						/>
					})}
					{data?.value?.additional?.[rowIdx] && field.next && (() => {
						const updateNextFields: Updater<FormFieldData[]> = (updater) => {
							update(expansionData => {
								if (expansionData == undefined || expansionData.value == undefined ||
									expansionData.value.additional == undefined || expansionData.value.additional[rowIdx] == undefined) {
									throw new Error('expansion is undefined after the first stage')
								}

								if (typeof updater !== 'function') {
									expansionData.value.additional[rowIdx] = updater
									return
								}

								updater(expansionData.value.additional[rowIdx])
							})
						}

						return <ExpansionNextFields next={field.next} dataOffset={field.expansionArgs.length}
							data={data.value?.additional?.[rowIdx]} update={updateNextFields}
						/>
					})()}
				</div>
			})}
		</div>
	</div>
}

function ExpansionNextFields({ next, dataOffset, data, update }: {
	next: FormFieldTemplate[], dataOffset: number,
	data?: FormFieldData[], update: Updater<FormFieldData[]>,
}) {
	return <div className='next-fields'>
		{next.map((field, nextIdx) => {
			const updateNext: Updater<FormFieldData> = (updater) => {
				update(nextData => {
					if (nextData == undefined)
						throw new Error('select is undefined after the first stage')

					if (typeof updater !== 'function') {
						nextData[dataOffset + nextIdx] = updater
						return
					}

					if (nextData[dataOffset + nextIdx] == undefined)
						nextData[dataOffset + nextIdx] = { type: field.type }

					updater(nextData[dataOffset + nextIdx])
				})
			}

			return <Field field={field} key={nextIdx}
				data={data?.[dataOffset + nextIdx]}
				update={updateNext} />
		})}
	</div>
}
