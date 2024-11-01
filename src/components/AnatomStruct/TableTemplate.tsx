import { ChangeEvent, FormEvent, MouseEvent, useState } from "react"
import { AnatomStructInputMode, anatomStructInputModes, AnatomStructTable, AnatomStructTableField, AnatomStructTableState, AnatomStructTableType, anatomStructTableTypes, getInputModeID, getTableTypeID } from "../../models/AnatomStructTypes"
import { Dropdown } from "../UI/Dropdown"
import { produce } from "immer"

import "./TableTemplate.css"
import { FieldTemplate, UpdateFieldTemplateFunc } from "./FieldTemplate"
import { Table, UpdateTableFunc } from "./Table"
import { EditModeContext } from "./AnatomStruct"

type UpdateTableTemplateFunc = (fn: (table: AnatomStructTable) => AnatomStructTable) => void

export function TableTemplate() {
	const [table, setTable] = useState({
		type: undefined as unknown as AnatomStructTableType,
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

	const tableType = getTableTypeID(table.type)
	const setTableType = (value?: string): void => {
		updateTable(table => {
			// Non imposto il tipo della tabella di fallback apposta così che lo switch
			// non selezioni nulla se il tipo della tabella non è stata ancora selezionato
			table.type = anatomStructTableTypes[value ?? '']
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

	const tableTemplateHeader = table.type != undefined ? <TableTemplateHeaders
		table={table} updateTable={updateTable}
		header={header} addHeader={addHeader} onNewHeaderChange={onHeaderChange}
	/> : undefined

	return <div className="container table-template">
		<div className="split">
			<form onSubmit={saveTable}>
				<TableTemplateType tableType={tableType} setTableType={setTableType} />
				{tableTemplateHeader}
				<TableTemplateFields table={table} updateTable={updateTable} />
				<button type="submit">Salva Tabella</button>
			</form>
			<div className="fake-table">
				<h3>Prototipo Tabella</h3>
				<FakeTable table={table} />
			</div>
		</div>
	</div>
}

function TableTemplateType({ tableType, setTableType }: { tableType?: string, setTableType: (newState?: string) => void }) {
	return <div className="container container-horiz container-start">
		<label htmlFor="table-type">Tipo della tabella:</label>
		<Dropdown name="table-type"
			options={Object.keys(anatomStructTableTypes)}
			selectedField={tableType} setSelectedField={setTableType}
		/>
	</div>
}

function TableTemplateHeaders({ table, updateTable, header, addHeader, onNewHeaderChange }: {
	table: AnatomStructTable, updateTable: UpdateTableTemplateFunc,
	header: string, addHeader: (ev: MouseEvent) => void, onNewHeaderChange: (ev: ChangeEvent<HTMLInputElement>) => void
}) {
	return <div className="container container-start section">
		<h4>Intestazioni Tabella</h4>
		<div className="container container-horiz container-start">
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
		</div>
		<div className="container container-horiz container-start">
			<label htmlFor="table-headers">Aggiungi intestazione:</label>
			<div>
				<input type="text" name="table-headers" value={header} onChange={onNewHeaderChange} />
				<button className="add-header" onClick={addHeader}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
		</div>
		
	</div>
}

function TableTemplateFields({ table, updateTable }: { table: AnatomStructTable, updateTable: UpdateTableTemplateFunc }) {
	switch (table.type) {
		case AnatomStructTableType.Default:
			return <DefaultTableTemplateFields table={table} updateTable={updateTable} />
		case AnatomStructTableType.VariadicButton:
			return <DefaultTableTemplateFields table={table} updateTable={updateTable} />
		case AnatomStructTableType.VariadicMouse:
			return <h2>To be implemented</h2>
	}
}

function DefaultTableTemplateFields({ table, updateTable }: { table: AnatomStructTable, updateTable: UpdateTableTemplateFunc }) {
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
		<div>
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
		</div>
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

function FakeTable({ table }: { table: AnatomStructTable }) {
	const [fakeState, setFakeState] = useState([] as AnatomStructTableState)
	const updateFakeState: UpdateTableFunc = (fn) => {
		setFakeState(produce(state => {
			return fn(state)
		}))
	}

	return <EditModeContext.Provider value={true}>
		<Table
			table={table} state={fakeState} update={updateFakeState}
			active={true} setActive={() => {}}
			deleteCircle={() => {}} highlightCircle={() => {}}
		/>
	</EditModeContext.Provider>
}
