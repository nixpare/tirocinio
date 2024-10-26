import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react"
import { AnatomStructInputMode, anatomStructInputModes, AnatomStructTable, AnatomStructTableField, AnatomStructTableType, anatomStructTableTypes } from "../../models/AnatomStructTypes"
import { Dropdown } from "../UI/Dropdown"
import { produce } from "immer"

import "./TableTemplate.css"

type UpdateTableTemplateFunc = (fn: (table: Partial<AnatomStructTable>) => (Partial<AnatomStructTable> | void)) => void

export function TableTemplate() {
	const [table, setTable] = useState({} as Partial<AnatomStructTable>)
	const saveTable = (ev: FormEvent): void => {
		ev.preventDefault()
		console.log(table)
	}
	const updateTable: UpdateTableTemplateFunc = (fn) => {
		setTable(produce(fn))
	}

	const [tableType, setTableType] = useState(undefined as (string | undefined))
	useEffect(() => {
		updateTable(table => {
			table.type = Object.entries(anatomStructTableTypes).filter(([tableTypeID, _]) => {
				return tableTypeID === tableType
			}).map(([_, tableTypeValue]) => tableTypeValue)[0]
		})
	}, [tableType])

	const [header, setHeader] = useState('')
	const onHeaderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		setHeader(ev.target.value)
	}
	const addHeader = (ev: MouseEvent) => {
		ev.preventDefault()

		updateTable(table => {
			if (!table.headers)
				table.headers = []

			table.headers.push(header)
			setHeader('')
		})
	}

	return <div className="container table-template">
		<form className="" onSubmit={saveTable}>
			<TableTemplateType tableType={tableType} setTableType={setTableType} />
			<TableTemplateHeaders
				table={table} updateTable={updateTable}
				header={header} addHeader={addHeader} onNewHeaderChange={onHeaderChange}
			/>
			<TableTemplateFields table={table} updateTable={updateTable} />
			<button type="submit">Salva Tabella</button>
		</form>
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
	table: Partial<AnatomStructTable>, updateTable: UpdateTableTemplateFunc,
	header: string, addHeader: (ev: MouseEvent) => void, onNewHeaderChange: (ev: ChangeEvent<HTMLInputElement>) => void
}) {
	return <div className="container container-horiz container-start">
		<label htmlFor="table-headers">Intestazioni della tabella:</label>
		{table.headers?.map((header, headerIdx) => {
			const onHeaderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
				updateTable(table => {
					if (!table.headers)
						return
					table.headers[headerIdx] = ev.target.value
				})
			}

			const inputStyle: React.CSSProperties = {
				width: `${header.length + 3}ch`,
				boxSizing: 'content-box'
			}

			const deleteHeader = () => {
				updateTable(table => {
					if (!table.headers)
						return
					table.headers = table.headers.filter((_, idx) => idx !== headerIdx)
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
		<div>
			<input type="text" name="table-headers" value={header} onChange={onNewHeaderChange} />
			<button className="add-header" onClick={addHeader}>
				<i className="fa-solid fa-circle-plus"></i>
			</button>
		</div>
	</div>
}

function TableTemplateFields({ table, updateTable }: { table: Partial<AnatomStructTable>, updateTable: UpdateTableTemplateFunc }) {
	if (table.type == undefined)
		return
	
	switch (table.type) {
		case AnatomStructTableType.Default:
			return <DefaultTableTemplateFields table={table} updateTable={updateTable} />
	}
}

function DefaultTableTemplateFields({ table, updateTable }: { table: Partial<AnatomStructTable>, updateTable: UpdateTableTemplateFunc }) {
	const [field, setField] = useState({} as AnatomStructTableField)
	const updateField = (fn: (field: AnatomStructTableField) => (AnatomStructTableField | void)): void => {
		setField(produce(fn))
	}
	
	const [fieldType, setFieldType] = useState(undefined as (string | undefined))
	useEffect(() => {
		updateField(() => {
			return {
				mode: Object.entries(anatomStructInputModes).filter(([fieldID, _]) => {
					return fieldID === fieldType
				}).map(([_, field]) => field)[0] || AnatomStructInputMode.Text
			}
		})
	}, [fieldType])
	
	const addField = (ev: MouseEvent) => {
		ev.preventDefault()

		updateTable(table => {
			if (!table.fields)
				table.fields = []
			table.fields.push(field)
		})
		setFieldType(undefined)
	}

	return <div className="container container-horiz container-start">
		<label htmlFor="table-fields">Aggiungi campo:</label>
		{table.fields?.map((fiedld, fieldIdx) => {
			const selectedField = Object.entries(anatomStructInputModes).filter(([_, inputMode]) => {
				return inputMode === field.mode
			}).map(([modeID, _]) => modeID)[0]

			const setSelectedField = (selected: string) => {
				const field = anatomStructInputModes[selected] ?? AnatomStructInputMode.Text
				console.log(field)
				updateTable(table => {
					if (!table.fields)
						return
					table.fields[fieldIdx] = { mode: field }
				})
			}

			return <div key={fieldIdx} className="header-input">
				<Dropdown name="table-fields"
					options={Object.keys(anatomStructInputModes)}
					selectedField={selectedField} setSelectedField={setSelectedField}
				/>
				<div>
					<button onClick={() => { console.log('delete') }}>
						<i className="fa-solid fa-circle-minus"></i>
					</button>
				</div>
			</div>
		})}
		<Dropdown name="table-fields"
			options={Object.keys(anatomStructInputModes)}
			selectedField={fieldType} setSelectedField={setFieldType}
		/>
		<button className="add-field" onClick={addField}>
			<i className="fa-solid fa-circle-plus"></i>
		</button>
	</div>
}
