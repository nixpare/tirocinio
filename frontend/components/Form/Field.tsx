import './Field.css'

import { ChangeEvent, MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import Select, { ActionMeta, MultiValue, SelectInstance, SingleValue, StylesConfig } from 'react-select'
import {
	FormFieldData,
	FormFieldTemplate,
	formFieldIsFixed,
	formFieldIsText,
	formFieldDataIsText,
	formFieldIsNumber,
	formFieldDataIsNumber,
	formFieldIsSelect,
	formFieldDataIsSelect,
	FormSelectFieldTemplate,
	FormSelectFieldData,
	formFieldIsDeduction,
	formFieldIsMultiSelect,
	FormMultiSelectFieldData,
	FormMultiSelectFieldTemplate,
	formFieldDataIsMultiSelect,
	FormFieldSelectArg,
	formFieldIsExpansion,
	formFieldDataIsExpansion,
	FormExpansionFieldData,
	FormExpansionFieldTemplate,
	FormFieldSelectArgs
} from "../../../models/Form";
import { EditModeContext } from "./Form";
import { deductionFunctionMap, DeductionTable, selectArgsFunctionMap } from '../../../models/Programmable';
import { AnatomStructDataContext } from '../../../models/AnatomStruct';
import { BodyContextProvider } from '../../../models/Body';
import Typography from '@mui/material/Typography';
import { DeepUpdater } from '../../utils/updater';
import { enqueueSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';

export type UpdateFieldFunc = DeepUpdater<FormFieldData>
type UpdateSelectFieldFunc = DeepUpdater<FormSelectFieldData>
type UpdateMultiSelectFieldFunc = DeepUpdater<FormMultiSelectFieldData>
type UpdateExpansionFieldFunc = DeepUpdater<FormExpansionFieldData>

export function Field({ field, data, update, breadcrumb, hideHeader }: {
	field: FormFieldTemplate,
	data?: FormFieldData, update: UpdateFieldFunc,
	breadcrumb: string[], hideHeader?: boolean
}) {
	const editMode = useContext(EditModeContext)

	switch (true) {
		case formFieldIsFixed(field):
			return <div className="field fixed-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
				<p className="fixed-value">{field.value}</p>
			</div>
		case formFieldIsText(field):
			if (data != undefined && !formFieldDataIsText(data))
				data = undefined

			const handleTextInput = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
				update({
					type: 'text',
					value: ev.target.value
				})
			}

			return <div className="field text-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
				{!field.multiline ? <>
					<input type="text"
						value={data?.value ?? ''}
						onChange={handleTextInput} disabled={!editMode}
					/>
				</> : <>
					<textarea
						value={data?.value ?? ''}
						onChange={handleTextInput} disabled={!editMode}
					/>
				</>}

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
				disabled={!editMode} breadcrumb={breadcrumb} hideHeader={hideHeader}
			/>
		case formFieldIsMultiSelect(field):
			if (data != undefined && !formFieldDataIsMultiSelect(data))
				data = undefined

			return <MultiSelectField
				field={field}
				data={data} update={update as UpdateMultiSelectFieldFunc}
				disabled={!editMode} breadcrumb={breadcrumb} hideHeader={hideHeader}
			/>
		case formFieldIsExpansion(field):
			if (data != undefined && !formFieldDataIsExpansion(data))
				data = undefined

			return <ExpansionField
				field={field}
				data={data} update={update as UpdateExpansionFieldFunc}
				disabled={!editMode} breadcrumb={breadcrumb} hideHeader={hideHeader}
			/>
		case formFieldIsDeduction(field):
			const deduction = deductionFunctionMap[field.deductionID];

			let result: string;
			try {
				const struct = useContext(AnatomStructDataContext)
				const bodyContext = useContext(BodyContextProvider)
				if (!struct || !bodyContext) {
					throw new Error('informazioni sul form corrente non trovate')
				}

				({ result } = deduction.fn(struct, bodyContext.body, breadcrumb))
			} catch (e) {
				console.error(e)
				result = 'Errore nel calcolo'
			}

			return <div className="field deduction-field">
				{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
				<div>
					<p className="deduction-result">{result}</p>
					{deduction.hint && <DeductionHint hint={deduction.hint} />}
				</div>
			</div>
	}
}

type SelectOption = {
	value: string
	label: string
}

function SelectField({ field, data, update, disabled, breadcrumb, hideHeader }: {
	field: FormSelectFieldTemplate,
	data?: FormSelectFieldData, update: UpdateSelectFieldFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	const [selectArgs, setSelectArgs] = useState < FormFieldSelectArgs>({});
	const struct = useContext(AnatomStructDataContext)
	const bodyContext = useContext(BodyContextProvider)

	useEffect(() => {
		// TODO: rivedere questa parte degli argomenti programmabili
		if (typeof field.selectArgs === 'string') {
			try {
				if (!struct || !bodyContext) {
					throw new Error('informazioni sul form corrente non trovate')
				}

				const f = selectArgsFunctionMap[field.selectArgs]
				setSelectArgs(f(struct, bodyContext.body, breadcrumb))
			} catch (e: any) {
				enqueueSnackbar((
					<Alert severity='error'>{e.message}</Alert>
				))
			}
		} else {
			setSelectArgs(field.selectArgs)
		}
	}, [field.selectArgs])

	const options: SelectOption[] | undefined = Object.values(selectArgs).map(arg => ({
		value: arg.value,
		label: arg.display
	}))

	const styles: StylesConfig<SelectOption> = {
		multiValueLabel: (base, _) => {
			return { ...base, fontWeight: 'bold', paddingRight: 6 };
		},
	};

	const selectedOption: SelectOption | undefined = options.filter(option => option.value == data?.value?.selection)[0];

	const selectRef = useRef<SelectInstance<SelectOption> | null>(null);
	useEffect(() => {
		if (selectRef.current == null || !selectedOption)
			return

		if (data == undefined || data.value == undefined) {
			selectRef.current.clearValue()
			return
		}
	}, [selectRef.current, data])

	const onChange = (newValue: SingleValue<SelectOption>, _: ActionMeta<SelectOption>) => {
		update(selectData => {
			if (newValue == undefined) {
				selectData.value = undefined
				return
			}

			if (selectData.value == undefined) {
				selectData.value = { selection: newValue.value }
			} else {
				selectData.value.selection = newValue.value
			}
		})
	}

	return <div className="field select-field">
		<div className="select-input">
			{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
			{!disabled ? (
				<Select options={options} isClearable={true} isDisabled={disabled}
					ref={selectRef}
					placeholder={field.header}
					styles={styles}
					value={selectedOption}
					onChange={onChange}
				/>
			) : (
				selectedOption ? (
					<Typography className="fixed-value">{selectedOption.label}</Typography>
				) : (
					<Typography className="no-value">Nessuna selezione</Typography>
				)
			)}
		</div>
		{data && data.value && selectArgs[data.value.selection] && (
			<SelectNextFields arg={selectArgs[data.value.selection]}
				data={data} update={update}
				breadcrumb={[...breadcrumb, data.value.selection]}
			/>
		)}
	</div>
}

function SelectNextFields({ arg, data, update, breadcrumb }: {
	arg: FormFieldSelectArg,
	data?: FormSelectFieldData, update: UpdateSelectFieldFunc,
	breadcrumb: string[]
}) {
	const [showNext, setShowNext] = useState(false);
	const toggleShowNext = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		setShowNext(!showNext)
	}

	return <div className='next-fields'>
		<button className="toggle-show-next" data-toggled={showNext} onClick={toggleShowNext}>
			<i className="fa-solid fa-chevron-right"></i>
		</button>
		{arg.next != undefined && Object.values(arg.next).map(next => {
			const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
				update(selectData => {
					if (arg.next == undefined)
						return

					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = {}

					if (typeof updater !== 'function') {
						selectData.value.next[next.id] = updater
						return
					}

					if (selectData.value.next[next.id] == undefined)
						selectData.value.next[next.id] = { type: arg.next[next.id].type }

					updater(selectData.value.next[next.id])
				}, 'value', 'next', next.id, ...breadcrumb)
			}

			return <div style={showNext ? undefined : { display: 'none' }} key={next.id}>
				<Field field={next}
					data={data?.value?.next?.[next.id]}
					update={updateNext} breadcrumb={[...breadcrumb, next.id]} />
			</div>
		})}
	</div>
}

function MultiSelectField({ field, data, update, disabled, breadcrumb, hideHeader }: {
	field: FormMultiSelectFieldTemplate,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	const [selectArgs, setSelectArgs] = useState<FormFieldSelectArgs>({});
	const struct = useContext(AnatomStructDataContext)
	const bodyContext = useContext(BodyContextProvider)

	useEffect(() => {
		// TODO: rivedere questa parte degli argomenti programmabili
		if (typeof field.selectArgs === 'string') {
			try {
				if (!struct || !bodyContext) {
					throw new Error('informazioni sul form corrente non trovate')
				}

				const f = selectArgsFunctionMap[field.selectArgs]
				setSelectArgs(f(struct, bodyContext.body, breadcrumb))
			} catch (e: any) {
				enqueueSnackbar((
					<Alert severity='error'>{e.message}</Alert>
				))
			}
		} else {
			setSelectArgs(field.selectArgs)
		}
	}, [field.selectArgs])

	const options: SelectOption[] | undefined = Object.entries(selectArgs).map(([value, arg]) => ({
		value: value,
		label: arg.display
	}))

	const selectedOptions = options.filter(opt => {
		return data && data.value && data.value.selections.includes(opt.value)
	})

	const selectRef = useRef<SelectInstance<SelectOption, true> | null>(null);
	useEffect(() => {
		if (selectRef.current == null || selectedOptions.length == 0)
			return

		if (data == undefined || data.value == undefined) {
			selectRef.current.clearValue()
			return
		}
	}, [selectRef.current, data])

	const styles: StylesConfig<SelectOption, true> = {
		multiValueLabel: (base, _) => {
			return { ...base, fontWeight: 'bold', paddingRight: 6 };
		},
		multiValueRemove: (base, _) => {
			return { ...base, display: 'none' };
		},
	};

	const onChange = (_: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
		update(selectData => {
			if (actionMeta.option == undefined)
				return

			if (selectData.value == undefined)
				selectData.value = { selections: [] }

			if (selectData.value.selections.includes(actionMeta.option.value))
				return

			selectData.value.selections.push(actionMeta.option.value)
		})
	}

	const selectAll = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
		ev.preventDefault()

		update(selectData => {
			if (selectData.value == undefined) {
				selectData.value = { selections: options.map(option => option.value) }
				return
			}

			selectData.value.selections = options.map(option => option.value)
		})
	}

	return <div className="field multi-select-field">
		<div className="select-input">
			{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
			{!disabled && <button className="select-all" onClick={selectAll}>SELEZIONA TUTTO</button>}
			{!disabled && <Select options={options} isMulti isClearable={false} isDisabled={disabled}
				ref={selectRef}
				placeholder={field.header}
				styles={styles}
				value={selectedOptions}
				onChange={onChange}
			/>}
		</div>
		<div className='multi-select'>
			{selectedOptions.length > 0 ? (
				selectedOptions.map((sel) => {
					const selectedArg = selectArgs[sel.value]
					if (selectedArg == undefined)
						return undefined

					const deleteSelection = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
						ev.preventDefault()
						selectRef?.current?.removeValue(sel)

						update(selectData => {
							if (selectData.value) {
								selectData.value.selections = selectData.value.selections.filter((selection) => {
									return selection !== sel.value
								})

								delete selectData.value.next?.[sel.value]
							}
						})
					}

					return <div className='container container-horiz multi-select-arg' key={sel.value}>
						{!disabled && <button className="delete-row" onClick={deleteSelection}>
							<i className="fa-solid fa-trash"></i>
						</button>}
						<div className='arg-display'>{selectedArg.display}</div>
						<MultiSelectNextFields selected={sel.value} arg={selectedArg}
							data={data} update={update} breadcrumb={[...breadcrumb, sel.value]} />
					</div>
				})
			) : (
				disabled && <Typography>Nessuna selezione</Typography>
			)}
		</div>
	</div>
}

function MultiSelectNextFields({ selected, arg, data, update, breadcrumb }: {
	selected: string, arg: FormFieldSelectArg,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
	breadcrumb: string[],
}) {
	const [showNext, setShowNext] = useState(false);
	const toggleShowNext = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		setShowNext(!showNext)
	}

	return <div className='next-fields'>
		<button className="toggle-show-next" data-toggled={showNext} onClick={toggleShowNext}>
			<i className="fa-solid fa-chevron-right"></i>
		</button>
		{arg.next && Object.values(arg.next).map(next => {
			const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
				update(selectData => {
					if (arg.next == undefined)
						return

					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = {}

					if (selectData.value.next[selected] == undefined)
						selectData.value.next[selected] = {}

					if (typeof updater !== 'function') {
						selectData.value.next[selected][next.id] = updater
						return
					}

					if (selectData.value.next[selected][next.id] == undefined)
						selectData.value.next[selected][next.id] = { type: arg.next[next.id].type }

					updater(selectData.value.next[selected][next.id])
				}, 'value', 'next', selected, next.id, ...breadcrumb)
			}

			return <div style={showNext ? undefined : { display: 'none' }} key={next.id}>
				<Field field={next}
					data={data?.value?.next?.[selected]?.[next.id]}
					update={updateNext} breadcrumb={[...breadcrumb, next.id]} />
			</div>
		})}
	</div>
}

// TODO: optimize update logic
function ExpansionField({ field, data, update, disabled, breadcrumb, hideHeader }: {
	field: FormExpansionFieldTemplate,
	data?: FormExpansionFieldData, update: UpdateExpansionFieldFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	const [additionalTempData, updateAdditionalTempData] = useImmer<FormFieldData[]>([])

	//const additionalRowCount = data?.value?.additional?.length ?? -1;
	const addRow = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
		ev.preventDefault()

		if (additionalTempData.length != field.expansionArgs?.length) {
			enqueueSnackbar((
				<Alert severity='error'>Inserire tutti i campi prima di aggiungere la riga</Alert>
			), { key: 'add-expansion-row', preventDuplicate: false })
			return
		}

		let allFieldsFilled = true
		for (let i = 0; i < additionalTempData.length; i++) {
			const additionalFieldData: FormFieldData | undefined = additionalTempData[i]
			if (!additionalFieldData || additionalFieldData.value == undefined) {
				allFieldsFilled = false
				break;
			}
		}
		if (!allFieldsFilled) {
			enqueueSnackbar((
				<Alert severity='error'>Inserire tutti i campi prima di aggiungere la riga</Alert>
			))
			return
		}

		update(data => {
			if (data.value == undefined)
				data.value = {}

			if (data.value.additional == undefined)
				data.value.additional = []

			data.value.additional.push(additionalTempData)
		}/* , 'value', 'additional', (additionalRowCount + 1).toString() */)
		updateAdditionalTempData([])
	}

	return <div className='field expansion-field'>
		{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
		<div className="fixed-data">
			{field.fixed?.map((fixedRow, rowIdx) => {
				return <div key={rowIdx}>
					{fixedRow.map((field, fieldIdx) => {
						const updateField: UpdateFieldFunc = (updater/* , ...breadcrumb */) => {
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
							}/* , 'value', 'fixed', rowIdx.toString(), fieldIdx.toString(), ...breadcrumb */)
						}

						return <Field field={field} key={fieldIdx}
							data={data?.value?.fixed?.[rowIdx]?.[fieldIdx]} update={updateField}
							breadcrumb={[...breadcrumb, 'fixed', rowIdx.toString(), fieldIdx.toString()]}
						/>
					})}
				</div>
			})}
		</div>
		<div className="expansion-data">
			{data?.value?.additional?.map((additionalData, rowIdx) => {
				const deleteAdditional = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
					ev.preventDefault()

					update(expansionData => {
						if (expansionData.value && expansionData.value.additional) {
							expansionData.value.additional = expansionData.value.additional.filter((_, idx) => {
								return idx != rowIdx
							})
						}
					}/* , 'value', 'additional' */)
				}

				return <Paper sx={{ backgroundColor: '#fff7', padding: '1em' }} key={rowIdx}>
					{!disabled && <button className="delete-row" onClick={deleteAdditional}>
						<i className="fa-solid fa-trash"></i>
					</button>}
					{field.incremental && <div className="row-counter">
						<p>{field.prefix ?? '# '}{rowIdx + 1}</p>
					</div>}
					{field.expansionArgs?.map((arg, argIdx) => {
						const updateField: UpdateFieldFunc = (updater/* , ...breadcrumb */) => {
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
							}/* , 'value', 'additional', rowIdx.toString(), argIdx.toString(), ...breadcrumb */)
						}

						return <Field field={arg} key={argIdx}
							data={additionalData[argIdx]} update={updateField}
							breadcrumb={[...breadcrumb, 'additional', rowIdx.toString(), argIdx.toString()]}
						/>
					})}
					{data?.value?.additional?.[rowIdx] && field.next && (() => {
						const updateNextFields: DeepUpdater<FormFieldData[]> = (updater/* , ...breadcrumb */) => {
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
							}/* , 'value', 'additional', rowIdx.toString(), ...breadcrumb */)
						}

						return <ExpansionNextFields next={field.next} dataOffset={field.expansionArgs?.length ?? 0}
							data={data.value?.additional?.[rowIdx]} update={updateNextFields}
							breadcrumb={[...breadcrumb, 'value', 'additional', rowIdx.toString()]}
						/>
					})()}
				</Paper>
			}) || (disabled && (
				<Typography>Nessun valore</Typography>
			))}
		</div>
		{!disabled && <div className="additional">
			<Paper sx={{ backgroundColor: '#fff7', padding: '1em' }} className="input-fields">
				{field.expansionArgs?.map((arg, argIdx) => {
					const updateField: UpdateFieldFunc = (updater/* , ...breadcrumb */) => {
						updateAdditionalTempData(data => {
							if (typeof updater !== 'function') {
								data[argIdx] = updater
								return
							}

							if (data[argIdx] == undefined)
								data[argIdx] = { type: arg.type }

							updater(data[argIdx])
						}/*  */)
					}

					return <Field field={arg} key={argIdx}
						data={additionalTempData[argIdx]} update={updateField}
						breadcrumb={[...breadcrumb, 'add-input', argIdx.toString()]}
					/>
				})}
			</Paper>
			{!disabled && <button className='add-row' onClick={addRow} disabled={disabled}>
				Aggiungi <i className="fa-solid fa-plus"></i>
			</button>}
		</div>}
	</div>
}

function ExpansionNextFields({ next, dataOffset, data, update, breadcrumb }: {
	next: FormFieldTemplate[], dataOffset: number,
	data?: FormFieldData[], update: DeepUpdater<FormFieldData[]>,
	breadcrumb: string[]
}) {
	const [showNext, setShowNext] = useState(false);
	const toggleShowNext = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		setShowNext(!showNext)
	}

	return <div className='next-fields'>
		<button className="toggle-show-next" data-toggled={showNext} onClick={toggleShowNext}>
			<i className="fa-solid fa-chevron-right"></i>
		</button>
		{next.map((field, nextIdx) => {
			const offset = dataOffset + nextIdx

			const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
				update(nextData => {
					if (nextData == undefined)
						throw new Error('select is undefined after the first stage')

					if (typeof updater !== 'function') {
						nextData[offset] = updater
						return
					}

					if (nextData[offset] == undefined)
						nextData[offset] = { type: field.type }

					updater(nextData[offset])
				}, offset.toString(), ...breadcrumb)
			}

			return <div style={showNext ? undefined : { display: 'none' }} key={offset}>
				<Field field={field}
					data={data?.[offset]}
					update={updateNext}
					breadcrumb={[...breadcrumb, offset.toString()]} />
			</div>
		})}
	</div>
}

function DeductionHint({ hint }: { hint: DeductionTable }) {
	const [show, setShow] = useState(false)
	const toggle = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		setShow(!show)
	}

	return <div className={`deduction-hint ${show ? 'show-hint' : ''}`}>
		<button className="toggle-hint" onClick={toggle}>
			<i className="fa-solid fa-chevron-right"></i>
		</button>
		<table>
			<thead>
				<tr>
					{hint.headers?.map(header => <th>{header}</th>)}
				</tr>
			</thead>
			<tbody>
				{hint.body.map(row => {
					return <tr>
						{row.map(el => <td>{el}</td>)}
					</tr>
				})}
			</tbody>
		</table>
	</div>
}
