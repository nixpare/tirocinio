import { ChangeEvent, MouseEvent, useState } from 'react'
import { AnatomStructInputMode, anatomStructInputModes, AnatomStructTableField } from "../../models/AnatomStructTypes"
import { Dropdown } from "../UI/Dropdown"
import "./FieldTemplate.css"

export type UpdateFieldTemplateFunc = (fn: (table: AnatomStructTableField) => (AnatomStructTableField | undefined)) => void

export function FieldTemplate({ field, updateField }: { field: AnatomStructTableField, updateField: UpdateFieldTemplateFunc }) {
	const selectedField = Object.entries(anatomStructInputModes).filter(([_, inputMode]) => {
		return inputMode === field.mode
	}).map(([modeID, _]) => modeID)[0]

	const setSelectedField = (selected: string) => {
		const field = anatomStructInputModes[selected] ?? AnatomStructInputMode.Text
		updateField(() => {
			return { mode: field }
		})
	}

	const deleteField = (ev: MouseEvent): void => {
		ev.preventDefault()
		updateField(() => { return undefined })
	}

	let fieldTemplate: React.ReactNode | undefined = undefined
	switch (field.mode) {
		case AnatomStructInputMode.Fixed:
			fieldTemplate = undefined
			break;
		case AnatomStructInputMode.Text:
			fieldTemplate = undefined
			break;
		case AnatomStructInputMode.Number:
			fieldTemplate = undefined
			break;
		case AnatomStructInputMode.Dropdown:
			fieldTemplate = <DropdownFieldTemplate field={field} updateField={updateField} />
			break;
		case AnatomStructInputMode.Multistage:
			fieldTemplate = <div>To be implemented</div>
			break;
	}

	return <div className="field-template">
		<button className="delete-field" onClick={deleteField}>
			<i className="fa-solid fa-trash"></i>
		</button>
		<Dropdown name="table-fields"
			options={Object.keys(anatomStructInputModes)}
			selectedField={selectedField} setSelectedField={setSelectedField}
		/>
		{fieldTemplate}
	</div>
}

function DropdownFieldTemplate({ field, updateField }: { field: AnatomStructTableField, updateField: UpdateFieldTemplateFunc }) {
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

	return <div className="container w-100 dropdown-field">
		<div className="container container-horiz container-start w-100">
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

				const deleteHeader = () => {
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
		</div>
		<div className="container container-horiz container-start w-100">
			<label htmlFor="dropdown-arg">Aggiungi opzione:</label>
			<div>
				<input type="text" name="dropdown-arg" value={arg} onChange={handleInputChange} />
				<button className="add-arg" onClick={addArg}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
	</div>
}