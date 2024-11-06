import { ChangeEvent, FormEvent, MouseEvent, useState } from "react"
import { produce } from "immer"
import { AnatomStructInputMode, anatomStructInputModes, AnatomStructPage, AnatomStructPageState, AnatomStructTable, AnatomStructTableField, getInputModeID } from "../../models/AnatomStructTypes"
import { FieldTemplate, UpdateFieldTemplateFunc } from "./FieldTemplate"
import { EditModeContext, PropertyPage, UpdatePageFunc, VerticalSplitContext } from "./AnatomStruct"
import { Dropdown } from "../UI/Dropdown"

import "./TableTemplate.css"

type UpdateTableTemplateFunc = (fn: (table: AnatomStructTable) => AnatomStructTable) => void

export function TableTemplate() {
	const [table, setTable] = useState({
		headers: [],
		fields: []
	} as AnatomStructTable)

	const saveTable = (ev: FormEvent): void => {
		ev.preventDefault()
		console.log(table)
	}
	const updateTable: UpdateTableTemplateFunc = (fn) => {
		setTable(produce(fn))
	}

	const toggleVariadicTable = () => {
		updateTable(table => {
			table.isVariadic = !table.isVariadic
			return table
		})
	}
	const toggleImageIteractiveTable = () => {
		updateTable(table => {
			table.interactsWithImage = !table.interactsWithImage
			return table
		})
	}

	const [header, setHeader] = useState('')
	const onHeaderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		setHeader(ev.target.value)
	}
	const addHeader = (ev: MouseEvent) => {
		ev.preventDefault()

		updateTable(table => {
			table.headers.push(header)
			setHeader('')
			return table
		})
	}

	return <div className="container table-template">
		<div className="split">
			<form onSubmit={saveTable}>
				<div className="w-100 container container-horiz container-start section">
					<h4>Opzioni Tabella:</h4>
					<div className="container container-horiz">
						<label htmlFor="isVariadic">Variabile:</label>
						<input type="checkbox" name="isVariadic" checked={table.isVariadic ?? false} onChange={toggleVariadicTable} />
					</div>
					<div className="container container-horiz">
						<label htmlFor="isVariadic">Interattiva:</label>
						<input type="checkbox" name="interactsWithImage" checked={table.interactsWithImage ?? false} onChange={toggleImageIteractiveTable} />
					</div>
				</div>
				<TableTemplateHeaders
					table={table} updateTable={updateTable}
					header={header} addHeader={addHeader} onNewHeaderChange={onHeaderChange}
				/>
				<TableTemplateFields table={table} updateTable={updateTable} />
				<button type="submit">Salva Tabella</button>
			</form>
			<div className="fake-table">
				<VerticalSplitContext.Provider value={true}>
					<FakePage table={table} />
				</VerticalSplitContext.Provider>
			</div>
		</div>
	</div>
}

function TableTemplateHeaders({ table, updateTable, header, addHeader, onNewHeaderChange }: {
	table: AnatomStructTable, updateTable: UpdateTableTemplateFunc,
	header: string, addHeader: (ev: MouseEvent) => void, onNewHeaderChange: (ev: ChangeEvent<HTMLInputElement>) => void
}) {
	return <div className="container container-start section">
		<h4>Intestazioni Tabella</h4>
		<div className="w-100 container container-horiz container-start">
			<label htmlFor="table-headers">Aggiungi intestazione:</label>
			<div>
				<input type="text" name="table-headers" value={header} onChange={onNewHeaderChange} />
				<button className="add-header" onClick={addHeader}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
		{table.headers.length > 0 ? <div className="w-100 container container-horiz container-start mt-0">
			{table.headers.map((header, headerIdx) => {
				const onHeaderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
					updateTable(table => {
						table.headers[headerIdx] = ev.target.value
						return table
					})
				}

				const inputStyle: React.CSSProperties = {
					width: `${header.length + 3}ch`,
					boxSizing: 'content-box'
				}

				const deleteHeader = (ev: MouseEvent) => {
					ev.preventDefault()

					updateTable(table => {
						table.headers = table.headers.filter((_, idx) => idx !== headerIdx)
						return table
					})
				}

				return <div key={headerIdx} className="header-input">
					<input type="text" style={inputStyle} value={header} onChange={onHeaderChange} />
					<div>
						<button onClick={deleteHeader}>
							<i className="fa-solid fa-circle-minus"></i>
						</button>
					</div>
				</div>
			})}
		</div> : undefined }
	</div>
}

function TableTemplateFields({ table, updateTable }: { table: AnatomStructTable, updateTable: UpdateTableTemplateFunc }) {
	const [field, setField] = useState({} as AnatomStructTableField)
	const updateField = (fn: (field: AnatomStructTableField) => AnatomStructTableField): void => {
		setField(produce(field => {
			return fn(field)
		}))
	}

	const fieldType = getInputModeID(field.mode)
	const setFieldType = (fieldType?: string) => {
		updateField(() => {
			return {
				mode: anatomStructInputModes[fieldType ?? ''] ?? AnatomStructInputMode.Text
			}
		})
	}
	
	const addField = (ev: MouseEvent) => {
		ev.preventDefault()

		updateTable(table => {
			table.fields.push(field)
			return table
		})
		setFieldType(undefined)
	}

	return <div className="container container-start section">
		<h4>Campi Tabella</h4>
		{table.fields.map((field, fieldIdx) => {
			const updateField: UpdateFieldTemplateFunc = (fn) => {
				updateTable(table => {
					table.fields[fieldIdx] = fn(table.fields[fieldIdx])
					return table
				})
			}

			const deleteField = () => {
				updateTable(table => {
					table.fields = table.fields.filter((_, idx) => idx !== fieldIdx)
					return table
				})
			}

			return <FieldTemplate key={fieldIdx} field={field} updateField={updateField} deleteField={deleteField} />
		})}
		<div className="container container-horiz container-start">
			<label htmlFor="table-fields">Aggiungi campo:</label>
			<div>
				<Dropdown name="table-fields"
					options={Object.keys(anatomStructInputModes)}
					selectedField={fieldType} setSelectedField={setFieldType}
				/>
				<button className="add-field" onClick={addField}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
	</div>
}

function FakePage({ table }: { table: AnatomStructTable }) {
	const [fakeState, setFakeState] = useState([] as AnatomStructPageState)
	const updateFakeState: UpdatePageFunc = (fn) => {
		setFakeState(produce(page => {
			return fn(page)
		}))
	}

	const fakePage: AnatomStructPage = {
		title: 'Prototipo Tabella',
		tables: [table],
		image: table.interactsWithImage ? ['/images/template_placeholder.png'] : undefined,
	}

	return <EditModeContext.Provider value={true}>
		<PropertyPage page={fakePage} state={fakeState} update={updateFakeState} />
	</EditModeContext.Provider>
}
