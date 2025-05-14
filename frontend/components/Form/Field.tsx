import './Field.css'

import { ChangeEvent, createContext, MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { Updater, useImmer } from "use-immer";
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
	formFieldIsExpansion,
	formFieldDataIsExpansion,
	FormExpansionFieldData,
	FormExpansionFieldTemplate,
	FormFieldSelectArgs,
	formFieldIsGroup,
	formFieldDataIsGroup,
	FormFieldGroupData,
	FormFieldGroupTemplate,
	formFieldIsReference,
	FormReferenceFieldTemplate,
	formFieldDataIsReference,
	FormReferenceFieldData,
	FormDeductionFieldData,
	FormDeductionFieldTemplate,
	formFieldDataIsDeduction,
	FormSelectFieldValue,
	FormMultiSelectFieldValue,
	FormReferenceFieldValue,
} from "../../../models/Form";
import { EditModeContext } from "./Form";
import { DeductionElement, deductionFunctionMap, DeductionTable, selectArgsFunctionMap } from '../../../models/Programmable';
import { AnatomStructDataContext } from '../../../models/AnatomStruct';
import { BodyContextProvider } from '../../../models/Body';
import Typography from '@mui/material/Typography';
import { DeepUpdater } from '../../utils/updater';
import { enqueueSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion/Accordion';
import { AccordionSummaryLeft } from '../UI/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails/AccordionDetails';
import { convertLabelToID } from '../../../models/conversion';

export type UpdateFieldFunc = DeepUpdater<FormFieldData>
type UpdateSelectFieldFunc = DeepUpdater<FormSelectFieldData>
type UpdateMultiSelectFieldFunc = DeepUpdater<FormMultiSelectFieldData>
type UpdateExpansionFieldFunc = DeepUpdater<FormExpansionFieldData>
type UpdateDeductionFieldFunc = DeepUpdater<FormDeductionFieldData>
type UpdateFieldGroupFunc = DeepUpdater<FormFieldGroupData>
type UpdateReferenceFieldFunc = DeepUpdater<FormReferenceFieldData>

export function Field({ field, data, update, breadcrumb, referenceKeys, isReference }: {
	field: FormFieldTemplate,
	data?: FormFieldData,
	update: UpdateFieldFunc,
	breadcrumb: string[],
	referenceKeys?: string[],
	isReference?: boolean
}) {
	const [referenceMap, updateReferenceMap] = useContext(ReferenceFieldContext);
	const keys = [ field.id, ...(referenceKeys ?? [])]

	useEffect(() => {
		if (isReference || field.type === 'reference') {
			return;
		}

		if (data == undefined || data.value == undefined) {
			return;
		}
		
		const usedKeys: string[] = []

		keys.forEach(key => {
			const reference = referenceMap[key]
			if (reference != undefined && reference.field !== field) {
				return;
			}

			usedKeys.push(key)
			updateReferenceMap(referenceMap => {
				referenceMap[key] = { field, data }
			})
		})

		return () => {
			usedKeys.forEach(key => {
				updateReferenceMap(referenceMap => {
					delete referenceMap[key]
				})
			})
		}
	}, [data])

	return (
		<>
			<FieldSwitch
				field={field}
				data={data}
				update={update}
				breadcrumb={breadcrumb}
			/>
			{field.nextAnyValue && !isReference && (
				<FieldNextAnyValue
					fields={field.nextAnyValue}
					data={data}
					update={update}
					breadcrumb={breadcrumb}
				/>
			)}
		</>
	)
}

export function FieldSwitch({ field, data, update, breadcrumb }: {
	field: FormFieldTemplate,
	data?: FormFieldData,
	update: UpdateFieldFunc,
	breadcrumb: string[],
}) {
	const editMode = useContext(EditModeContext)

	switch (true) {
		case formFieldIsFixed(field):
			return field.value && (
				<div className="field fixed-field">
					{field.header && <p className="field-header">{field.header}</p>}
					<p className="fixed-value">{field.value}</p>
				</div>
			)
		case formFieldIsText(field):
			if (data != undefined && !formFieldDataIsText(data))
				data = undefined

			const handleTextInput = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
				update({
					type: 'text',
					value: ev.target.value === '' ? undefined : ev.target.value
				})
			}

			return (
				<div className="field text-field">
					{field.header && <p className="field-header">{field.header}</p>}
					{!field.multiline ? (
						<input
							type="text"
							placeholder={editMode ? 'Inserisci testo ...' : 'Nessun testo' }
							value={data?.value ?? ''}
							onChange={handleTextInput}
							disabled={!editMode}
						/>
					) : (
						<textarea
							placeholder={editMode ? 'Inserisci testo ...' : 'Nessun testo'}
							value={data?.value ?? ''}
							onChange={handleTextInput}
							disabled={!editMode}
						/>
					)}
				</div>
			)
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

			const handleNumberInput = (value: number | undefined): void => {
				update({
					type: 'number',
					value: value
				})
			}

			return (
				<div className="field number-field">
					{field.header && <p className="field-header">{field.header}</p>}
					<NumberInput
						className={className}
						placeholder={editMode ? 'Inserisci valore ...' : 'Nessun valore'}
						value={data?.value}
						onChange={handleNumberInput}
						disabled={!editMode}
					/>
				</div>
			)
		case formFieldIsSelect(field):
			if (data != undefined && !formFieldDataIsSelect(data))
				data = undefined

			return (
				<SelectField
					field={field}
					data={data} update={update as UpdateSelectFieldFunc}
					disabled={!editMode} breadcrumb={breadcrumb}
				/>
			)
		case formFieldIsMultiSelect(field):
			if (data != undefined && !formFieldDataIsMultiSelect(data))
				data = undefined

			return (
				<MultiSelectField
					field={field}
					data={data} update={update as UpdateMultiSelectFieldFunc}
					disabled={!editMode} breadcrumb={breadcrumb}
				/>
			)
		case formFieldIsExpansion(field):
			if (data != undefined && !formFieldDataIsExpansion(data))
				data = undefined

			return (
				<ExpansionField
					field={field}
					data={data} update={update as UpdateExpansionFieldFunc}
					disabled={!editMode} breadcrumb={breadcrumb}
				/>
			)
		case formFieldIsDeduction(field):
			if (data != undefined && !formFieldDataIsDeduction(data))
				data = undefined

			return (
				<DeductionField
					field={field}
					data={data} update={update as UpdateDeductionFieldFunc}
					disabled={!editMode} breadcrumb={breadcrumb}
				/>
			)
			
		case formFieldIsGroup(field):
			if (data != undefined && !formFieldDataIsGroup(data))
				data = undefined

			return (
				<FieldGroup
					field={field}
					data={data} update={update as UpdateFieldGroupFunc}
					disabled={!editMode} breadcrumb={breadcrumb}
				/>
			)
		case formFieldIsReference(field):
			if (data != undefined && !formFieldDataIsReference(data))
				data = undefined

			return (
				<ReferenceField
					field={field}
					data={data}
					update={update as UpdateReferenceFieldFunc}
					breadcrumb={breadcrumb}
				/>
			)
	}
}

function FieldNextAnyValue({ fields, data, update, breadcrumb }: {
	fields: FormFieldTemplate[],
	data?: FormFieldData,
	update: UpdateFieldFunc,
	breadcrumb: string[]
}) {
	if (data == undefined) {
		return <></>
	}

	if (data.value == undefined && data.type !== 'fixed') {
		return <></>
	}

	return (
		<>
			{fields.map(next => {
				const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
					update(fieldData => {
						if (fieldData.nextAnyValue == undefined)
							fieldData.nextAnyValue = {}

						if (typeof updater !== 'function') {
							fieldData.nextAnyValue[next.id] = updater
							return
						}

						if (fieldData.nextAnyValue[next.id] == undefined) {
							fieldData.nextAnyValue[next.id] = { type: next.type }
						}

						updater(fieldData.nextAnyValue[next.id])
					}, 'nextAnyValue', next.id, ...breadcrumb)
				}

				return (
					<Field key={next.id}
						field={next}
						data={data?.nextAnyValue?.[next.id]}
						update={updateNext}
						breadcrumb={[...breadcrumb, 'nextAnyValue', next.id]}
					/>
				)
			})}
		</>
	)
}

function NumberInput({ value, onChange, ...props }: Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type' | 'value' | 'onChange' | 'ref'> & {
	value?: number,
	onChange?: (value: number | undefined) => void
}) {
	const proxyOnChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		let value = ev.target.value

		// @ts-ignore
		if (ev.nativeEvent.inputType === 'insertText' && value === '') {
			return
		}
		
		onChange?.(value === '' ? undefined : Number(value))
	}

	return (
		<input
			type="number"
			value={value?.toString() ?? ''}
			onChange={proxyOnChange}
			{ ...props }
		/>
	)
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
	let selectArgs: FormFieldSelectArgs = [];
	
	const struct = useContext(AnatomStructDataContext)
	const body = useContext(BodyContextProvider)?.body

	if (typeof field.selectArgs === 'string') {
		try {
			if (!struct || !body) {
				throw new Error('informazioni sul form corrente non trovate')
			}

			const f = selectArgsFunctionMap[field.selectArgs]
			selectArgs = f(struct, body, breadcrumb)
		} catch (e: any) {
			console.error(e)
			enqueueSnackbar((
				<Alert severity='error'>{e.message}</Alert>
			))
		}
	} else {
		selectArgs = field.selectArgs
	}

	const options: SelectOption[] | undefined = selectArgs.map(arg => ({
		value: arg.value,
		label: arg.display
	}))

	const styles: StylesConfig<SelectOption> = {
		container: (base, _) => {
			return { ...base, maxWidth: '50ch' }
		}
	};

	const selectedOption: SelectOption | undefined = options.find(option => option.value == data?.value?.selection);

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

	const next: FormFieldTemplate[] = field.nextArgs?.filter(nextArg => {
		if (data == undefined || data.value == undefined)
			return

		return nextArg.options.includes(data.value.selection)
	}).reduce<FormFieldTemplate[]>((prev, curr) => {
		prev.push(...curr.next)
		return prev
	}, []) ?? []

	return (
		<>
			<div className="field select-field">
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
			{data && data.value && next.length > 0 && (
				<SelectNextFields
					next={next}
					data={data.value}
					update={update}
					breadcrumb={breadcrumb}
				/>
			)}
		</>
	)
}

function SelectNextFields({ next, data, update, breadcrumb }: {
	next: FormFieldTemplate[],
	data: FormSelectFieldValue, update: UpdateSelectFieldFunc,
	breadcrumb: string[]
}) {
	return (
		<>
			{next != undefined && Object.values(next).map(nextField => {
				const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
					update(selectData => {
						if (next == undefined)
							return

						if (selectData == undefined || selectData.value == undefined)
							throw new Error('select is undefined after the first stage')

						if (selectData.value.next == undefined)
							selectData.value.next = {}

						if (typeof updater !== 'function') {
							selectData.value.next[nextField.id] = updater
							return
						}

						if (selectData.value.next[nextField.id] == undefined) {
							const field = next.filter(nextEl => nextEl.id == nextField.id)[0]
							selectData.value.next[nextField.id] = { type: field.type }
						}

						updater(selectData.value.next[nextField.id])
					}, 'value', 'next', nextField.id, ...breadcrumb)
				}

				return (
					<Field key={nextField.id}
						field={nextField}
						data={data.next?.[nextField.id]}
						update={updateNext}
						breadcrumb={[...breadcrumb, 'value', 'next', nextField.id]}
						referenceKeys={[data.selection]}
					/>
				)
			})}
		</>
	)
}

function MultiSelectField({ field, data, update, disabled, breadcrumb, hideHeader }: {
	field: FormMultiSelectFieldTemplate,
	data?: FormMultiSelectFieldData, update: UpdateMultiSelectFieldFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	let selectArgs: FormFieldSelectArgs = []

	const struct = useContext(AnatomStructDataContext)
	const body = useContext(BodyContextProvider)?.body

	if (typeof field.selectArgs !== 'string') {
		selectArgs = field.selectArgs
	} else {
		try {
			if (!struct || !body) {
				throw new Error('informazioni sul form corrente non trovate')
			}

			const f = selectArgsFunctionMap[field.selectArgs]
			selectArgs = f(struct, body, breadcrumb)
		} catch (e: any) {
			console.error(e)
			enqueueSnackbar((
				<Alert severity='error'>{e.message}</Alert>
			))
		}
	}

	const options: SelectOption[] | undefined = selectArgs.map(arg => ({
		value: arg.value,
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
		container: (base, _) => {
			return { ...base, maxWidth: '50ch' }
		},
		multiValueLabel: (base, _) => {
			return { ...base, fontWeight: 'bold', paddingRight: 6, maxWidth: '12ch' };
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

	return (
		<div className="field multi-select-field">
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
			<div className='multi-select-next'>
				{selectedOptions.length > 0 ? (
					selectedOptions.map((sel) => {
						const selectedArg = selectArgs.find(arg => arg.value == sel.value)
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

						const next = field.nextArgs?.filter(nextArg => {
							if (data == undefined || data.value == undefined)
								return

							return nextArg.options.includes(selectedArg.value)
						}).reduce<FormFieldTemplate[]>((prev, curr) => {
							prev.push(...curr.next)
							return prev
						}, []) ?? []

						return (
							<div className="container container-horiz container-align-start no-wrap" key={sel.value}>
								{next.length > 0 ? (
									<>
										{!disabled && <button className="delete-row" onClick={deleteSelection}>
											<i className="fa-solid fa-trash"></i>
										</button>}
										<Accordion key={sel.value}
											className="multi-select-arg"
											elevation={4}
											defaultExpanded
										>
											<AccordionSummaryLeft>
												<div className='arg-display'>{selectedArg.display}</div>
											</AccordionSummaryLeft>
											<AccordionDetails>
												{data && data.value && (
													<MultiSelectNextFields selected={sel.value} next={next}
														data={data.value} update={update} breadcrumb={[...breadcrumb, sel.value]} />
												)}
											</AccordionDetails>
										</Accordion>
									</>
								) : (
									data && data.value && (
										<Paper className="multi-select-arg no-next" elevation={4}>
											{!disabled && <button className="delete-row" onClick={deleteSelection}>
												<i className="fa-solid fa-trash"></i>
											</button>}
											<div className='arg-display'>{selectedArg.display}</div>
										</Paper>
									)
								)}
								
							</div>
						)
					})
				) : (
					disabled && <Typography>Nessuna selezione</Typography>
				)}
			</div>
		</div>
	)
}

function MultiSelectNextFields({ selected, next, data, update, breadcrumb }: {
	selected: string, next: FormFieldTemplate[],
	data: FormMultiSelectFieldValue, update: UpdateMultiSelectFieldFunc,
	breadcrumb: string[],
}) {
	return <div className='next-fields'>
		{next && Object.values(next).map(nextField => {
			const updateNext: UpdateFieldFunc = (updater, ...breadcrumb) => {
				update(selectData => {
					if (next == undefined)
						return

					if (selectData == undefined || selectData.value == undefined)
						throw new Error('select is undefined after the first stage')

					if (selectData.value.next == undefined)
						selectData.value.next = {}

					if (selectData.value.next[selected] == undefined)
						selectData.value.next[selected] = {}

					if (typeof updater !== 'function') {
						selectData.value.next[selected][nextField.id] = updater
						return
					}

					if (selectData.value.next[selected][nextField.id] == undefined) {
						const field = next.filter(nextEl => nextEl.id == nextField.id)[0]
						selectData.value.next[selected][nextField.id] = { type: field.type }
					}

					updater(selectData.value.next[selected][nextField.id])
				}, 'value', 'next', selected, nextField.id, ...breadcrumb)
			}

			return (
				<Field key={nextField.id}
					field={nextField}
					data={data.next?.[selected]?.[nextField.id]}
					update={updateNext}
					breadcrumb={[...breadcrumb, 'value', 'next', selected, nextField.id]}
					referenceKeys={[selected]}
				/>
			)
		})}
	</div>
}

// TODO: optimize update logic
function ExpansionField({ field, data, update, disabled, breadcrumb, hideHeader }: {
	field: FormExpansionFieldTemplate,
	data?: FormExpansionFieldData, update: UpdateExpansionFieldFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	const [fakeData, updateFakeData] = useImmer<FormFieldData>({
		type: field.expansionArg.type
	})

	//const additionalRowCount = data?.value?.additional?.length ?? -1;
	const addRow = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
		ev.preventDefault()

		if (fakeData.value == undefined && fakeData.type != 'fixed') {
			enqueueSnackbar((
				<Alert severity='error'>Inserire tutti i campi prima di aggiungere la riga</Alert>
			), { key: 'add-expansion-row', preventDuplicate: false })
			return
		}

		update(data => {
			if (data.value == undefined)
				data.value = []

			data.value.push([fakeData])
		}/* , 'value', 'additional', (additionalRowCount + 1).toString() */)
		updateFakeData({
			type: field.expansionArg.type
		})
	}

	return <div className='field expansion-field'>
		{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
		<div className="expansion-data">
			{data?.value?.map((additionalData, rowIdx) => {
				const deleteAdditional = (ev: MouseEvent<HTMLButtonElement, PointerEvent>) => {
					ev.preventDefault()

					update(expansionData => {
						if (expansionData.value != undefined) {
							expansionData.value = expansionData.value.filter((_, idx) => {
								return idx != rowIdx
							})
						}
					}/* , 'value', 'additional' */)
				}

				const updateField: UpdateFieldFunc = (updater/* , ...breadcrumb */) => {
					update(expansionData => {
						if (expansionData.value == undefined || expansionData.value[rowIdx] == undefined)
							throw new Error("expansion data value undefined after being added")

						if (typeof updater !== 'function') {
							expansionData.value[rowIdx][0] = updater
							return
						}

						if (expansionData.value[rowIdx][0] == undefined)
							expansionData.value[rowIdx][0] = { type: field.expansionArg.type }

						updater(expansionData.value[rowIdx][0])
					}/* , 'value', 'additional', rowIdx.toString(), argIdx.toString(), ...breadcrumb */)
				}

				return (
					<div key={rowIdx}>
						{!disabled && <button className="delete-row" onClick={deleteAdditional}>
							<i className="fa-solid fa-trash"></i>
						</button>}
						{field.next ? (
							<Accordion
								className="expansion-row"
								elevation={4}
								defaultExpanded
							>
								<AccordionSummaryLeft>
									{field.incremental && <div className="row-counter">
										<p>{field.prefix ?? '# '}{rowIdx + 1}</p>
									</div>}
									<Field field={field.expansionArg}
										data={additionalData[0]} update={updateField}
										breadcrumb={[...breadcrumb, 'value', rowIdx.toString()]}
									/>
								</AccordionSummaryLeft>
								{additionalData.length > 0 && (
									<AccordionDetails className='input-fields'>
										<ExpansionFieldNext
											fields={field.next}
											data={additionalData}
											update={update}
											rowIdx={rowIdx}
											breadcrumb={breadcrumb}
										/>
									</AccordionDetails>
									
								)}
							</Accordion>
						) : (
							<Paper
								className="input-fields"
								elevation={4}
							>
								{field.incremental && <div className="row-counter">
									<p>{field.prefix ?? '# '}{rowIdx + 1}</p>
								</div>}
								<Field field={field.expansionArg}
									data={additionalData[0]} update={updateField}
									breadcrumb={[...breadcrumb, 'value', rowIdx.toString()]}
								/>
						</Paper>
					)}
					</div>
				)
			}) || (disabled && (
				<Typography>Nessun valore</Typography>
			))}
		</div>
		{!disabled && (
			<div className="additional">
				<Paper className="input-fields">
					<Field field={field.expansionArg}
						data={fakeData} update={updateFakeData}
						breadcrumb={[...breadcrumb, 'fake-field']}
					/>
				</Paper>
				{!disabled && <button className='add-row' onClick={addRow} disabled={disabled}>
					Aggiungi <i className="fa-solid fa-plus"></i>
				</button>}
			</div>
		)}
	</div>
}

function ExpansionFieldNext({ fields, data, update, rowIdx, breadcrumb }: {
	fields: FormFieldTemplate[],
	data: FormFieldData[],
	update: UpdateExpansionFieldFunc,
	rowIdx: number,
	breadcrumb: string[]
}) {
	const nextData = data.slice(1)
	
	const referenceKeys: string[] = []
	const leaderData = data[0]

	if (leaderData.value != undefined) {
		switch(true) {
			case formFieldDataIsText(leaderData):
				referenceKeys.push(convertLabelToID(leaderData.value))
				break;
			case formFieldDataIsNumber(leaderData):
				referenceKeys.push(convertLabelToID(leaderData.value.toString()))
				break;
			case formFieldDataIsSelect(leaderData):
				referenceKeys.push(convertLabelToID(leaderData.value.selection))
				break;
		}
	}

	return (
		<>
			{fields.map((field, fieldIdx) => {
				const updateField: UpdateFieldFunc = (updater/* , ...breadcrumb */) => {
					update(expansionData => {
						if (expansionData.value == undefined || expansionData.value[rowIdx] == undefined)
							throw new Error("expansion data value undefined after being added")

						if (typeof updater !== 'function') {
							expansionData.value[rowIdx][fieldIdx + 1] = updater
							return
						}

						if (expansionData.value[rowIdx][fieldIdx + 1] == undefined)
							expansionData.value[rowIdx][fieldIdx + 1] = { type: field.type }

						updater(expansionData.value[rowIdx][fieldIdx + 1])
					}/* , 'value', 'additional', rowIdx.toString(), argIdx.toString(), ...breadcrumb */)
				}

				return (
					<Field key={field.id}
						field={field}
						data={nextData[fieldIdx]}
						update={updateField}
						breadcrumb={[...breadcrumb, 'additional', rowIdx.toString(), fieldIdx.toString() + 1 ]}
						referenceKeys={referenceKeys}
					/>
				)
			})}
		</>
	)
}

function DeductionField({field, data, update, disabled, breadcrumb }: {
	field: FormDeductionFieldTemplate
	data?: FormDeductionFieldData
	update: UpdateDeductionFieldFunc
	disabled: boolean
	breadcrumb: string[]
}) {
	const deduction: DeductionElement | undefined = deductionFunctionMap[field.deductionID];
	const [result, setResult] = useState(data?.value ?? disabled
		? 'Calcolo non eseguito'
		: 'Calcolo ...'
	)

	useEffect(() => {
		if (data == undefined || data.value == undefined) {
			return
		}

		setResult(data.value)
	}, [data])

	useEffect(() => {
		if (disabled) {
			return;
		}

		if (!deduction) {
			const res = `Metodo '${field.deductionID}' non trovato`

			update(deductionData => {
				deductionData.value = undefined
			})
			setResult(res)
			enqueueSnackbar((
				<Alert severity='error'>{res}</Alert>
			), { key: `${field.id}_not_found`, preventDuplicate: true })

			return;
		}

		try {
			const struct = useContext(AnatomStructDataContext)
			const body = useContext(BodyContextProvider)?.body
			if (!struct || !body) {
				throw new Error('informazioni sul form corrente non trovate')
			}

			const { result: res } = deduction.fn(struct, body, breadcrumb)
			update(deductionData => {
				deductionData.value = res
			})

		} catch (e) {
			const res = 'Errore nel calcolo'

			console.error(e)
			update(deductionData => {
				deductionData.value = undefined
			})
			setResult(res)
			enqueueSnackbar((
				<Alert severity='error'>{res}</Alert>
			), { key: `${field.id}_error`, preventDuplicate: true })
		}
	})

	return (
		<div className="field deduction-field">
			{field.header && <p className="field-header">{field.header}</p>}
			<div>
				<p className="deduction-result">{result}</p>
				{deduction && deduction.hint && <DeductionHint hint={deduction.hint} />}
			</div>
		</div>
	)
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

function FieldGroup({ field, data, update, breadcrumb, hideHeader }: {
	field: FormFieldGroupTemplate,
	data?: FormFieldGroupData, update: UpdateFieldGroupFunc,
	disabled: boolean, breadcrumb: string[], hideHeader?: boolean
}) {
	return <div className="field field-group">
		{!hideHeader && field.header && <p className="field-header">{field.header}</p>}
		<div className='group'>
			{field.group.map(groupField => {
				const updateField: UpdateFieldFunc = (updater, ...breadcrumb) => {
					update(groupData => {
						if (groupData.value == undefined) {
							groupData.value = {}
						}

						if (typeof updater !== 'function') {
							groupData.value[groupField.id] = updater
							return
						}

						if (groupData.value[groupField.id] == undefined) {
							groupData.value[groupField.id] = { type: groupField.type }
						}

						updater(groupData.value[groupField.id])
					}, 'value', groupField.id, ...breadcrumb)
				}

				return (
					<Field key={groupField.id}
						field={groupField}
						data={data?.value?.[groupField.id]}
						update={updateField} breadcrumb={[...breadcrumb, 'value', groupField.id]}
					/>
				)
			})}
		</div>
	</div>
}

export type ReferenceFieldContextData = FormReferenceFieldValue | undefined

export type ReferenceFieldContextType = [
	Record<string, ReferenceFieldContextData>,
	Updater<Record<string, ReferenceFieldContextData>>
]

export const ReferenceFieldContext = createContext<ReferenceFieldContextType>([
	{},
	(_) => {}
])

function ReferenceField({ field, data, update, breadcrumb }: {
	field: FormReferenceFieldTemplate
	data?: FormReferenceFieldData
	update: UpdateReferenceFieldFunc
	breadcrumb: string[]
}) {
	const [referenceMap] = useContext(ReferenceFieldContext);
	
	useEffect(() => {
		const ref = referenceMap[field.referenceID]
		if (ref == undefined) {
			update(referenceData => {
				referenceData.value = undefined
			})
			return
		}

		if (ref.field.type != 'text' && ref.field.type != 'number') {
			console.error(`reference value type ${ref.field.type} not supported`)
			update(referenceData => {
				referenceData.value = undefined
			})
			return
		}

		update(referenceData => {
			referenceData.value = ref
		})
	}, [referenceMap])

	return (
		<div className="field reference-field">
			{field.header && <p className="field-header">{field.header}</p>}
			{data && data.value ? (
				<EditModeContext.Provider value={false}>
					<Field
						field={data.value.field}
						data={data.value.data}
						update={(_)=>{}}
						breadcrumb={[...breadcrumb, 'reference', data.value.field.id]}
						isReference
					/>
				</EditModeContext.Provider>
			) : (
				<p className='fixed-value'>Nessun valore presente</p>
			)}
		</div>
	)
}
