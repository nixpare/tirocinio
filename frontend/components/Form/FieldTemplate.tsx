import "./FieldTemplate.css"

import { ChangeEvent, MouseEvent, useState } from 'react'
import { Updater, useImmer } from "use-immer"
import { formFieldIsBlank, formFieldIsDropdown, formFieldIsNumber, formFieldIsText, FormTableDropdownFieldTemplate, FormTableFieldDropdownArg, FormTableFieldTemplate, FormTableFieldType } from "../../models/Form"
import { Dropdown, DropdownOption } from "../UI/Dropdown"

export type UpdateFieldTemplateFunc = Updater<FormTableFieldTemplate>
export type UpdateDropdownFieldTemplateFunc = Updater<FormTableDropdownFieldTemplate>
type UpdateDropdownArgTemplateFunc = Updater<FormTableFieldDropdownArg>

export function FieldTemplate({ field, updateField, deleteField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc, deleteField: () => void }) {
	const setSelectedField = (selected?: DropdownOption) => {
		updateField(field => {
			field.type = selected?.value as FormTableFieldType
		})
	}

	const handleDeleteField = (ev: MouseEvent): void => {
		ev.preventDefault()
		deleteField()
	}

	return <div className="field-template">
		<button className="delete-field" onClick={handleDeleteField}>
			<i className="fa-solid fa-trash"></i>
		</button>
		<Dropdown name="table-fields"
			options={fieldTypeValues}
			selectedField={field.type} setSelectedField={setSelectedField}
		/>
		<FieldTemplateArgs field={field} updateField={updateField} />
	</div>
}

function FieldTemplateArgs({ field, updateField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc }) {
	switch (true) {
		case formFieldIsBlank(field):
			return undefined
		case formFieldIsText(field):
			return <FixedFieldTemplate field={field} updateField={updateField} />
		case formFieldIsNumber(field):
			return <FixedFieldTemplate field={field} updateField={updateField} />
		case formFieldIsDropdown(field):
			// @ts-ignore
			const updateDropdownField: Updater<FormTableDropdownFieldTemplate> = updateField

			return <div>
				<DropdownFieldTemplate field={field} updateField={updateDropdownField} />
				<FixedFieldTemplate field={field} updateField={updateField} />
			</div>
	}
}

function FixedFieldTemplate({ field, updateField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc }) {
	const [arg, setArg] = useState('')
	const addArg = (ev: MouseEvent) => {
		ev.preventDefault()

		updateField(field => {
			if (!field.fixedArgs)
				field.fixedArgs = []

			field.fixedArgs.push(arg)
		})
		setArg('')
	}

	const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setArg(ev.target.value ?? '')
	}

	return <div className="container w-100 m-0 fixed-field">
		<div className="container container-horiz container-start w-100">
			<label htmlFor="fixed-arg">Aggiungi campo fisso:</label>
			<div>
				<input type="text" name="fixed-arg" value={arg} onChange={handleInputChange} />
				<button className="add-arg" onClick={addArg}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
		{field.fixedArgs && field.fixedArgs.length > 0 ? <div className="container container-horiz container-start w-100 m-0">
			{field.fixedArgs?.map((arg, argIdx) => {
				const onArgChange = (ev: ChangeEvent<HTMLInputElement>): void => {
					updateField(field => {
						if (!field.fixedArgs)
							return

						field.fixedArgs[argIdx] = ev.target.value
					})
				}

				const inputStyle: React.CSSProperties = {
					width: `${arg.length + 4}ch`
				}

				const deleteHeader = (ev: MouseEvent) => {
					ev.preventDefault()

					updateField(field => {
						if (!field.fixedArgs)
							return

						field.fixedArgs = field.fixedArgs.filter((_, idx) => idx !== argIdx)
					})
				}

				return <div key={argIdx} className="arg-input">
					<input type="text" style={inputStyle} value={arg} onChange={onArgChange} />
					<div>
						<button onClick={deleteHeader}>
							<i className="fa-solid fa-circle-minus"></i>
						</button>
					</div>
				</div>
			})}
		</div> : undefined}
	</div>
}

function DropdownFieldTemplate({ field, updateField }: { field: FormTableDropdownFieldTemplate, updateField: UpdateDropdownFieldTemplateFunc }) {
	const [stage, updateStage] = useImmer({} as Partial<FormTableFieldDropdownArg>)
	
	const addStage = (ev: MouseEvent) => {
		ev.preventDefault()

		if (stage.next == undefined)
			return //TODO: error
		if (stage.value == undefined)
			return //TODO: error

		updateField(field => {
			if (!field.dropdownArgs)
				field.dropdownArgs = []

			field.dropdownArgs.push(stage as FormTableFieldDropdownArg)
		})

		updateStage({})
		setNextFieldType(undefined)
	}

	const handleStageValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
		updateStage(stage => {
			stage.value = ev.target.value
		})
	}

	const nextFieldType = stage.next?.[0].type // TODO: fix for stage.next being a slice
	const setNextFieldType = (nextFieldType?: DropdownOption): void => {
		updateStage(stage => {
			if (!nextFieldType) {
				stage.next = undefined
				return
			}
				
			stage.next = [{ // TODO: fix for stage.next being a slice
				type: nextFieldType.value as FormTableFieldType
			}]
		})
	}

	return <div className="container w-100 m-0">
		{field.dropdownArgs && field.dropdownArgs.length > 0 ? <div className="w-100 container section">
			{field.dropdownArgs?.map((arg, argIdx) => {
				const updateArg: UpdateDropdownArgTemplateFunc = (updater) => {
					updateField(field => {
						if (!field.dropdownArgs)
							return field

						if (typeof updater !== 'function') {
							field.dropdownArgs[argIdx] = updater
							return
						}

						updater(field.dropdownArgs[argIdx])
					})
				}

				const deleteArg = () => {
					updateField(field => {
						field.dropdownArgs = field.dropdownArgs?.filter((_, idx) => idx !== argIdx)
					})
				}

				return <DropdownNextArgTemplate key={argIdx}
					arg={arg} updateArg={updateArg} deleteArg={deleteArg}
				/>
			})}
		</div> : undefined}
		<div className="container container-horiz container-start w-100">
			<label htmlFor="dropdown-arg">Aggiungi opzione:</label>
			<input type="text" name="dropdown-arg" value={stage.value ?? ''} onChange={handleStageValueChange} />
			<Dropdown name="table-fields"
				options={fieldTypeValues}
				selectedField={nextFieldType} setSelectedField={setNextFieldType}
			/>
			<button className="add-arg" onClick={addStage}>
				<i className="fa-solid fa-circle-plus"></i>
			</button>
		</div>
	</div>
}

function DropdownNextArgTemplate({ arg, updateArg, deleteArg }: { arg: FormTableFieldDropdownArg, updateArg: UpdateDropdownArgTemplateFunc, deleteArg: () => void }) {
	const onArgChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		updateArg(arg => {
			arg.value = ev.target.value
		})
	}

	const inputStyle: React.CSSProperties = {
		width: `${arg.value.length + 3}ch`,
		boxSizing: 'content-box'
	}

	const deleteDropdownArg = (ev: MouseEvent) => {
		ev.preventDefault()
		deleteArg()
	}

	const fieldType = arg.next?.[0].type // TODO: fix for stage.next being a slice
	const setFieldType = (fieldType?: DropdownOption): void => {
		updateArg(arg => {
			if (!fieldType) {
				arg.next = undefined
				return
			}

			arg.next = [{
				type: fieldType.value as FormTableFieldType
			}] // TODO: fix for stage.next being a slice
		})
	}

	const updateNextField: UpdateFieldTemplateFunc = (updater) => {
		updateArg(arg => {
			if (!arg.next)
				return

			if (typeof updater !== 'function') {
				arg.next[0] = updater // TODO: fix for stage.next being a slice
				return
			}

			updater(arg.next[0]) // TODO: fix for stage.next being a slice
		})
	}

	return <div className="container container-start w-100 m-0 dropdown-arg">
		<div className="w-100 arg-input">
			<button className="delete-field" onClick={deleteDropdownArg}>
				<i className="fa-solid fa-trash"></i>
			</button>
			<label htmlFor="arg-value">Valore:</label>
			<input type="text" name="arg-value" style={inputStyle} value={arg.value} onChange={onArgChange} />
			<label htmlFor="arg-value">Campo:</label>
			<Dropdown name="table-fields"
				options={fieldTypeValues}
				selectedField={fieldType} setSelectedField={setFieldType}
			/>
		</div>
		{arg.next && <FieldTemplateArgs field={arg.next[0]} updateField={updateNextField} />} {/* TODO: fix for stage.next being a slice */}
	</div>
}

export const fieldTypeValues: DropdownOption[] = [
	{ value: 'blank', display: 'Vuoto' },
	{ value: 'text', display: 'Testo' },
	{ value: 'number', display: 'Numbero' },
	{ value: 'dropdown', display: 'Scelta multipla' }
]
