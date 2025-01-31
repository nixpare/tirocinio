import "./FieldTemplate.css"

import { ChangeEvent, MouseEvent, useState } from 'react'
import { Updater } from "use-immer"
import { formFieldIsBlank, formFieldIsDropdown, formFieldIsNumber, formFieldIsText, FormTableDropdownFieldTemplate, FormTableFieldDropdownArg, FormTableFieldTemplate, FormTableFieldType } from "../../models/Form"
import { Dropdown, DropdownOption } from "../UI/Dropdown"

export type UpdateFieldTemplateFunc = Updater<FormTableFieldTemplate>
export type UpdateDropdownFieldTemplateFunc = Updater<FormTableDropdownFieldTemplate>
type UpdateDropdownArgTemplateFunc = Updater<FormTableFieldDropdownArg>

export function FieldTemplate({ field, updateField, deleteField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc, deleteField: () => void }) {
	const [fieldDisplay, setFieldDisplay] = useState(fieldDisplayFromType(field.type))
	
	const setSelectedField = (selected?: DropdownOption) => {
		if (!selected)
			return

		updateField(field => {
			field.type = selected.value as FormTableFieldType
		})
		setFieldDisplay(selected.display)
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
			selectedField={fieldDisplay} setSelectedField={setSelectedField}
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
		{field.fixedArgs && field.fixedArgs.length > 0 ? <div className="container container-horiz container-start w-100 pt-0">
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
	const [option, setOption] = useState({} as Partial<FormTableFieldDropdownArg>)
	
	const addOption = (ev: MouseEvent) => {
		ev.preventDefault()

		if (option.value == undefined)
			return
		if (option.display == undefined)
			return

		updateField(field => {
			if (!field.dropdownArgs)
				field.dropdownArgs = []

			field.dropdownArgs.push(option as FormTableFieldDropdownArg)
		})

		setOption({})
	}

	const handleOptionValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setOption({
			value: ev.target.value,
			display: ev.target.value
		})
	}

	return <div className="container w-100 m-0 pw-0 gap-0">
		{field.dropdownArgs && field.dropdownArgs.length > 0 ? <div className="w-100 container mb-0 section">
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

				return <DropdownArgTemplate key={argIdx}
					arg={arg} updateArg={updateArg} deleteArg={deleteArg}
				/>
			})}
		</div> : undefined}
		<div className="container container-horiz container-start w-100">
			<label htmlFor="dropdown-arg">Aggiungi opzione:</label>
			<input type="text" name="dropdown-arg" value={option.value ?? ''} onChange={handleOptionValueChange} />
			<button className="add-arg" onClick={addOption}>
				<i className="fa-solid fa-circle-plus"></i>
			</button>
		</div>
	</div>
}

function DropdownArgTemplate({ arg, updateArg, deleteArg }: { arg: FormTableFieldDropdownArg, updateArg: UpdateDropdownArgTemplateFunc, deleteArg: () => void }) {
	const onArgValueChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		updateArg(arg => {
			arg.value = ev.target.value
		})
	}
	const onArgDisplayChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		updateArg(arg => {
			arg.display = ev.target.value
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

	const addNextField = (fieldType?: DropdownOption) => {
		if (!fieldType)
			return

		updateArg(arg => {
			if (arg.next == undefined)
				arg.next = []

			arg.next.push({
				type: fieldType.value as FormTableFieldType
			})
		})
	}

	return <div className="container container-start w-100 m-0 dropdown-arg">
		<div className="w-100 arg-input">
			<button className="delete-field" onClick={deleteDropdownArg}>
				<i className="fa-solid fa-trash"></i>
			</button>
			<label htmlFor="arg-value">Valore:</label>
			<input type="text" name="arg-value" style={inputStyle} value={arg.value} onChange={onArgValueChange} />
			<label htmlFor="arg-value">Etichetta:</label>
			<input type="text" name="arg-value" style={inputStyle} value={arg.display} onChange={onArgDisplayChange} />
		</div>
		{arg.next?.map((field, fieldIdx) => {
			const updateField: UpdateFieldTemplateFunc = (updater) => {
				updateArg(arg => {
					if (arg.next == undefined)
						return

					if (typeof updater !== 'function') {
						arg.next[fieldIdx] = updater
						return
					}

					updater(arg.next[fieldIdx])
				})
			}

			const deleteField = () => {
				updateArg(arg => {
					if (arg.next == undefined)
						return

					arg.next = arg.next.filter((_, idx) => idx !== fieldIdx)
				})
			}

			return <FieldTemplate key={fieldIdx} field={field} updateField={updateField} deleteField={deleteField} />
		})}
		<div className="container container-horiz container-start">
			<label htmlFor="table-fields">Aggiungi campo:</label>
			<div>
				<Dropdown name="table-fields"
					options={fieldTypeValues}
					selectedField={'Prossimo'} setSelectedField={addNextField}
				/>
			</div>
		</div>
	</div>
}

export const fieldTypeValues: DropdownOption[] = [
	{ value: 'blank', display: 'Vuoto' },
	{ value: 'text', display: 'Testo' },
	{ value: 'number', display: 'Numbero' },
	{ value: 'dropdown', display: 'Scelta multipla' }
]

function fieldDisplayFromType(typ: FormTableFieldType): string | undefined {
	return fieldTypeValues.reduce<string | undefined>((prev, curr) => {
		if (prev)
			return prev

		return curr.value == typ ? curr.display : undefined
	}, undefined)
}
