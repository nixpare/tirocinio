import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react"
import { AnatomStructTable, anatomStructTableTypes } from "../../models/AnatomStructTypes"
import { Dropdown } from "../UI/Dropdown"
import { produce } from "immer"

import "./TableTemplate.css"

export function TableTemplate() {
	const [table, setTable] = useState({} as Partial<AnatomStructTable>)
	const saveTable = (ev: FormEvent): void => {
		ev.preventDefault()
		console.log(table)
	}
	const updateTable = (fn: (table: Partial<AnatomStructTable>) => Partial<AnatomStructTable>): void => {
		setTable(produce(table => {
			table = fn(table)
		}))
	}

	const [tableType, setTableType] = useState(undefined as (string | undefined))
	useEffect(() => {
		updateTable(table => {
			table.type = Object.entries(anatomStructTableTypes).filter(([tableTypeID, _]) => {
				return tableTypeID === tableType
			}).map(([_, tableTypeValue]) => tableTypeValue)[0]
			return table
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

			return table
		})
	}

	return <div className="container table-template">
		<form className="" onSubmit={saveTable}>
			<TableTemplateType tableType={tableType} setTableType={setTableType} />
			<TableTemplateHeaders
				table={table} updateTable={updateTable}
				header={header} addHeader={addHeader} onNewHeaderChange={onHeaderChange}
			/>
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
	table: Partial<AnatomStructTable>, updateTable: (fn: (table: Partial<AnatomStructTable>) => Partial<AnatomStructTable>) => void,
	header: string, addHeader: (ev: MouseEvent) => void, onNewHeaderChange: (ev: ChangeEvent<HTMLInputElement>) => void
}) {
	return <div className="container container-horiz container-start">
		<label htmlFor="table-headers">Intestazioni della tabella:</label>
		{table.headers?.map((header, headerIdx) => {
			const onHeaderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
				updateTable(table => {
					if (!table.headers)
						return table

					table.headers[headerIdx] = ev.target.value
					return table
				})
			}

			const inputStyle: React.CSSProperties = {
				width: `${header.length + 3}ch`,
				boxSizing: 'content-box'
			}

			const deleteHeader = () => {
				updateTable(table => {
					if (!table.headers)
						return table

					table.headers = table.headers.filter((_, idx) => idx !== headerIdx)
					return table
				})
			}

			return <div key={headerIdx} className="header-input">
				<input type="text" style={inputStyle} value={header} onChange={onHeaderChange} />
				<div className="">
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
