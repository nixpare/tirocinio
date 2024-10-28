import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { AnatomStructInputMode, anatomStructInputModes, AnatomStructMultistageArg, AnatomStructTableField } from "../../models/AnatomStructTypes"
import { Dropdown } from "../UI/Dropdown"
import "./FieldTemplate.css"
import { produce } from 'immer'

export type UpdateFieldTemplateFunc = (fn: (table: AnatomStructTableField) => (AnatomStructTableField | undefined)) => void
type UpdateMultistageArgTemplateFunc = (fn: (arg: AnatomStructMultistageArg) => (AnatomStructMultistageArg | undefined)) => void

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
			fieldTemplate = <FixedFieldTemplate field={field} updateField={updateField} />
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
			fieldTemplate = <MultistageFieldTemplate field={field} updateField={updateField} />
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

function FixedFieldTemplate({ field, updateField }: { field: AnatomStructTableField, updateField: UpdateFieldTemplateFunc }) {
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

	return <div className="container w-100 fixed-field">
		<div className="container container-horiz container-start w-100">
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
					width: `${arg.length + 3}ch`,
					boxSizing: 'content-box'
				}

				const deleteHeader = () => {
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
		</div>
		<div className="container container-horiz container-start w-100">
			<label htmlFor="fixed-arg">Aggiungi campo fisso:</label>
			<div>
				<input type="text" name="fixed-arg" value={arg} onChange={handleInputChange} />
				<button className="add-arg" onClick={addArg}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
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

function MultistageFieldTemplate({ field, updateField }: { field: AnatomStructTableField, updateField: UpdateFieldTemplateFunc }) {
	const [stage, setStage] = useState({} as Partial<AnatomStructMultistageArg>)
	const updateStage = (fn: (stage: Partial<AnatomStructMultistageArg>) => Partial<AnatomStructMultistageArg>): void => {
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

			field.multistageArgs.push(stage as AnatomStructMultistageArg)
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
	
	const [nextFieldType, setNextFieldType] = useState(undefined as (string | undefined))
	useEffect(() => {
		updateStage(stage => {
			stage.next = {
				mode: Object.entries(anatomStructInputModes).filter(([fieldID, _]) => {
					return fieldID === nextFieldType
				}).map(([_, field]) => field)[0] ?? AnatomStructInputMode.Text
			}
			return stage
		})
	}, [nextFieldType])

	return <div className="container w-100 multistage-field">
		<div className="container container-horiz container-start w-100">
			{field.multistageArgs?.map((arg, argIdx) => {
				const updateArg: UpdateMultistageArgTemplateFunc = (fn) => {
					updateField(field => {
						if (!field.multistageArgs)
							return

						const newArg = fn(field.multistageArgs[argIdx])
						if (!newArg) {
							field.multistageArgs = field.multistageArgs.filter((_, idx) => idx !== argIdx)
						} else {
							field.multistageArgs[argIdx] = newArg
						}
						
						return field
					})
				}

				return <MultistageNextArgTemplate key={argIdx}
					arg={arg} updateArg={updateArg}
				/>
			})}
		</div>
		<div className="container container-horiz container-start w-100">
			<label htmlFor="multistage-arg">Aggiungi opzione:</label>
			<div>
				<input type="text" name="multistage-arg" value={stage.value ?? ''} onChange={handleStageValueChange} />
				<Dropdown name="table-fields"
					options={Object.keys(anatomStructInputModes)}
					selectedField={nextFieldType} setSelectedField={setNextFieldType}
				/>
				<button className="add-arg" onClick={addStage}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
	</div>
}

function MultistageNextArgTemplate({ arg, updateArg }: { arg: AnatomStructMultistageArg, updateArg: UpdateMultistageArgTemplateFunc }) {
	const onArgChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		/* updateField(field => {
			if (!field.multistageArgs)
				return field

			field.multistageArgs[argIdx] = ev.target.value
			return field
		}) */
		console.log(ev.target.value)
	}

	const inputStyle: React.CSSProperties = {
		width: `${arg.value.length + 3}ch`,
		boxSizing: 'content-box'
	}

	const deleteHeader = (ev: MouseEvent) => {
		ev.preventDefault()

		updateArg(() => {
			return undefined
		})
	}

	return <div className="arg-input">
		<input type="text" style={inputStyle} value={arg.value} onChange={onArgChange} />
		<div>
			<button onClick={deleteHeader}>
				<i className="fa-solid fa-circle-minus"></i>
			</button>
		</div>
	</div>
}
