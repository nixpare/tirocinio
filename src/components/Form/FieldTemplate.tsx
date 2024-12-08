import "./FieldTemplate.css"

import { ChangeEvent, MouseEvent, useState } from 'react'
import { produce } from 'immer'
import { FormTableFieldType, formTableFieldTypes, FormTableFieldMultistageArg, FormTableFieldTemplate, getFormTableFieldTypeID } from "../../models/Form"
import { Dropdown } from "../UI/Dropdown"

export type UpdateFieldTemplateFunc = (fn: (table: FormTableFieldTemplate) => FormTableFieldTemplate) => void
type UpdateMultistageArgTemplateFunc = (fn: (arg: FormTableFieldMultistageArg) => FormTableFieldMultistageArg) => void

export function FieldTemplate({ field, updateField, deleteField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc, deleteField: () => void }) {
	const selectedField = getFormTableFieldTypeID(field.type)

	const setSelectedField = (selected?: string) => {
		const fieldID = formTableFieldTypes[selected ?? ''] ?? FormTableFieldType.Text
		updateField(field => {
			field.type = fieldID
			return field
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
			options={Object.keys(formTableFieldTypes)}
			selectedField={selectedField} setSelectedField={setSelectedField}
		/>
		<FieldTemplateArgs field={field} updateField={updateField} />
	</div>
}

function FieldTemplateArgs({ field, updateField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc }) {
	switch (field.type) {
		case FormTableFieldType.Blank:
			return undefined
		case FormTableFieldType.Text:
			return <FixedFieldTemplate field={field} updateField={updateField} />
		case FormTableFieldType.Number:
			return <FixedFieldTemplate field={field} updateField={updateField} />
		case FormTableFieldType.Dropdown:
			return <>
				<DropdownFieldTemplate field={field} updateField={updateField} />
				<FixedFieldTemplate field={field} updateField={updateField} />
			</>
		case FormTableFieldType.Multistage:
			return <div>
				<MultistageFieldTemplate field={field} updateField={updateField} />
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
			return field
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
							return field

						field.fixedArgs[argIdx] = ev.target.value
						return field
					})
				}

				const inputStyle: React.CSSProperties = {
					width: `${arg.length + 4}ch`
				}

				const deleteHeader = (ev: MouseEvent) => {
					ev.preventDefault()

					updateField(field => {
						if (!field.fixedArgs)
							return field

						field.fixedArgs = field.fixedArgs.filter((_, idx) => idx !== argIdx)
						return field
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

function DropdownFieldTemplate({ field, updateField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc }) {
	const [arg, setArg] = useState('')
	const addArg = (ev: MouseEvent) => {
		ev.preventDefault()

		updateField(field => {
			if (!field.dropdownArgs)
				field.dropdownArgs = []

			field.dropdownArgs.push(arg)
			return field
		})
		setArg('')
	}

	const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setArg(ev.target.value ?? '')
	}

	return <div className="container w-100 dropdown-field m-0">
		<div className="container container-horiz container-start w-100">
			<label htmlFor="dropdown-arg">Aggiungi opzione:</label>
			<div>
				<input type="text" name="dropdown-arg" value={arg} onChange={handleInputChange} />
				<button className="add-arg" onClick={addArg}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
		{field.dropdownArgs && field.dropdownArgs.length > 0 ? <div className="container container-horiz container-start w-100">
			{field.dropdownArgs?.map((arg, argIdx) => {
				const onArgChange = (ev: ChangeEvent<HTMLInputElement>): void => {
					updateField(field => {
						if (!field.dropdownArgs)
							return field

						field.dropdownArgs[argIdx] = ev.target.value
						return field
					})
				}

				const inputStyle: React.CSSProperties = {
					width: `${arg.length + 3}ch`,
					boxSizing: 'content-box'
				}

				const deleteHeader = (ev: MouseEvent) => {
					ev.preventDefault()

					updateField(field => {
						if (!field.dropdownArgs)
							return field

						field.dropdownArgs = field.dropdownArgs.filter((_, idx) => idx !== argIdx)
						return field
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

function MultistageFieldTemplate({ field, updateField }: { field: FormTableFieldTemplate, updateField: UpdateFieldTemplateFunc }) {
	const [stage, setStage] = useState({} as Partial<FormTableFieldMultistageArg>)
	const updateStage = (fn: (stage: Partial<FormTableFieldMultistageArg>) => Partial<FormTableFieldMultistageArg>): void => {
		setStage(produce(stage => fn(stage)))
	}
	const addStage = (ev: MouseEvent) => {
		ev.preventDefault()

		if (stage.next == undefined)
			return //TODO: error
		if (stage.value == undefined)
			return //TODO: error

		updateField(field => {
			if (!field.multistageArgs)
				field.multistageArgs = []

			field.multistageArgs.push(stage as FormTableFieldMultistageArg)
			return field
		})

		setStage({})
		setNextFieldType(undefined)
	}

	const handleStageValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
		updateStage(stage => {
			stage.value = ev.target.value
			return stage
		})
	}

	const nextFieldType = getFormTableFieldTypeID(stage.next?.[0].type) // TODO: fix for stage.next being a slice
	const setNextFieldType = (nextFieldType?: string): void => {
		updateStage(stage => {
			stage.next = [{ // TODO: fix for stage.next being a slice
				type: formTableFieldTypes[nextFieldType ?? '']
			}]
			return stage
		})
	}

	return <div className="container w-100 m-0">
		{field.multistageArgs && field.multistageArgs.length > 0 ? <div className="w-100 container section">
			{field.multistageArgs?.map((arg, argIdx) => {
				const updateArg: UpdateMultistageArgTemplateFunc = (fn) => {
					updateField(field => {
						if (!field.multistageArgs)
							return field

						field.multistageArgs[argIdx] = fn(field.multistageArgs[argIdx])
						return field
					})
				}

				const deleteArg = () => {
					updateField(field => {
						field.multistageArgs = field.multistageArgs?.filter((_, idx) => idx !== argIdx)
						return field
					})
				}

				return <MultistageNextArgTemplate key={argIdx}
					arg={arg} updateArg={updateArg} deleteArg={deleteArg}
				/>
			})}
		</div> : undefined}
		<div className="container container-horiz container-start w-100">
			<label htmlFor="multistage-arg">Aggiungi opzione:</label>
			<input type="text" name="multistage-arg" value={stage.value ?? ''} onChange={handleStageValueChange} />
			<Dropdown name="table-fields"
				options={Object.keys(formTableFieldTypes)}
				selectedField={nextFieldType} setSelectedField={setNextFieldType}
			/>
			<button className="add-arg" onClick={addStage}>
				<i className="fa-solid fa-circle-plus"></i>
			</button>
		</div>
	</div>
}

function MultistageNextArgTemplate({ arg, updateArg, deleteArg }: { arg: FormTableFieldMultistageArg, updateArg: UpdateMultistageArgTemplateFunc, deleteArg: () => void }) {
	const onArgChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		updateArg(arg => {
			arg.value = ev.target.value
			return arg
		})
	}

	const inputStyle: React.CSSProperties = {
		width: `${arg.value.length + 3}ch`,
		boxSizing: 'content-box'
	}

	const deleteMultistageArg = (ev: MouseEvent) => {
		ev.preventDefault()
		deleteArg()
	}

	const fieldType = getFormTableFieldTypeID(arg.next[0].type) // TODO: fix for stage.next being a slice
	const setFieldType = (modeID?: string): void => {
		updateArg(arg => {
			arg.next = [{ type: formTableFieldTypes[modeID ?? ''] ?? FormTableFieldType.Text }] // TODO: fix for stage.next being a slice
			return arg
		})
	}

	const updateNextField: UpdateFieldTemplateFunc = (fn) => {
		updateArg(arg => {
			arg.next[0] = fn(arg.next[0]) // TODO: fix for stage.next being a slice
			return arg
		})
	}

	return <div className="container container-start w-100 m-0 multistage-arg">
		<div className="w-100 arg-input">
			<button className="delete-field" onClick={deleteMultistageArg}>
				<i className="fa-solid fa-trash"></i>
			</button>
			<label htmlFor="arg-value">Valore:</label>
			<input type="text" name="arg-value" style={inputStyle} value={arg.value} onChange={onArgChange} />
			<label htmlFor="arg-value">Campo:</label>
			<Dropdown name="table-fields"
				options={Object.keys(formTableFieldTypes)}
				selectedField={fieldType} setSelectedField={setFieldType}
			/>
		</div>
		<FieldTemplateArgs field={arg.next[0]} updateField={updateNextField} /> {/* TODO: fix for stage.next being a slice */}
	</div>
}
