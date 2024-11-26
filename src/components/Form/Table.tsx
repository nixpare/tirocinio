import { useContext, useState, MouseEvent } from "react";
import { FormTableFieldImageRef, FormTableTemplate, FormTableFieldTemplate, FormTableData, FormTableRowSpecial, FormTableRowData, calculateRowCellCount } from "../../models/Form";
import { DeleteImageCircleFunc, EditModeContext, HighlightImageCircleFunc } from "./Form";
import { Field, UpdateFieldFunc } from "./Field";

import './Table.css'

export type UpdateTableFunc = (fn: (tableData: FormTableData) => FormTableData) => void
type RenderRowFieldFunc = (rowIdx: number, field: FormTableFieldTemplate, fieldIdx: number, rowData?: FormTableRowData) => React.ReactNode

/**
 * Table rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function Table({ table, data, update, active, setActive, deleteCircle, highlightCircle }: {
	table: FormTableTemplate, data: FormTableData, update: UpdateTableFunc,
	active: boolean, setActive: () => void,
	deleteCircle: DeleteImageCircleFunc, highlightCircle: HighlightImageCircleFunc
}) {
	const renderRowField: RenderRowFieldFunc = (rowIdx, field, fieldIdx, row) => {
		// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
		const updateField: UpdateFieldFunc = (fn) => {
			update(tableData => {
				if (!tableData) {
					tableData = []
				}

				if (!tableData[rowIdx]) {
					tableData[rowIdx] = {}
				}

				tableData[rowIdx][fieldIdx] = fn(tableData?.[rowIdx]?.[fieldIdx])
				return tableData
			})
		}

		const key = `${rowIdx}-${fieldIdx}`
		const fieldData = row?.[fieldIdx]

		return <Field key={key}
			field={field} rowIdx={rowIdx}
			data={fieldData} update={updateField} />
	}

	const editMode = useContext(EditModeContext)

	const [editTable, setEditTable] = useState(useContext(EditModeContext))
	const toggleEditFields = () => {
		setEditTable(!editTable)
	}
	const editFieldsButton = editMode ? undefined : <>
		<button className="table-edit-button" onClick={toggleEditFields}>
			{editTable ? <i className="fa-regular fa-floppy-disk"></i> : <i className="fa-regular fa-pen-to-square"></i>}
		</button>
	</>

	const nRows = Math.max(
		data?.length ?? 0,
		table.fields
			.map(field => field.fixedArgs?.length ?? 0)
			.reduce((prev, curr) => { return prev > curr ? prev : curr }, 0)
	)

	const nCols = Math.max(
		table.headers.length,
		table.fields.length,
		data?.reduce((prev, curr) => {
			return Math.max(
				prev,
				calculateRowCellCount(curr, table.fields)
			)
		}, 0) ?? 0
	)

	const [activeRow, setActiveRow] = useState(-1)

	const addRow = (ev: MouseEvent): void => {
		ev.preventDefault()

		update(table => {
			if (!table)
				table = []

			if (table.length < nRows) {
				for (let i = table.length; i < nRows; i++) {
					table.push([])
				}
			}

			table.push([])
			return table
		})
	}

	const addButton = editTable && table.isVariadic ? <>
		<button className="table-add-row" onClick={addRow}>Aggiungi riga</button>
	</> : undefined

	const variadicHeaders = <>
		<th></th>
		{table.isVariadic ? <th>#</th> : undefined}
	</>

	const nHasDefault = table.fields.reduce((prev, curr, currIdx) => {
		if (curr.defaultValue != undefined)
			return currIdx
		return prev
	}, -1)

	return <div className="table">
		{editFieldsButton}
		<EditModeContext.Provider value={editTable}>
			<div className={`table-wrapper ${active ? 'active' : ''}`} onMouseEnter={setActive}>
				<table>
					<thead>
						<tr>
							{variadicHeaders}
							{/* Generazione degli header della tabella */}
							{table.headers.map((th, thIdx) => {
								return <th key={thIdx}>{th}</th>
							})}
							{(() => {
								const emptyCells: React.ReactNode[] = []
								for (let i = table.headers.length; i < nCols; i++) {
									emptyCells.push(<th key={i}></th>)
								}

								return emptyCells
							})()}
						</tr>
						{nHasDefault >= 0 ? <tr>
							<th></th>
							{table.fields.map((field, fieldIdx) => {
								if (field.defaultValue == undefined)
									return <th key={fieldIdx}></th>

								const setDefaultValue = (ev: MouseEvent): void => {
									ev.preventDefault()

									update(tableState => {
										if (!tableState)
											tableState = []

										for (let i = 0; i < nRows; i++) {
											if (!tableState[i])
												tableState[i] = {}
											// @ts-ignore
											tableState[i][fieldIdx] = field.defaultValue
										}

										return tableState
									})
								}

								return <th key={fieldIdx}>
									<button onClick={setDefaultValue}>
										Default value
									</button>
								</th>
							})}
							{(() => {
								const emptyCells: React.ReactNode[] = []
								for (let i = table.fields.length; i < nCols; i++) {
									emptyCells.push(<th key={i}></th>)
								}

								return emptyCells
							})()}
						</tr> : undefined}
					</thead>
					<tbody>
						{[...Array(nRows).keys()].map(rowIdx => {
							const row = data?.[rowIdx]

							const rowHasFixedField = table.fields.map(field => {
								return field.fixedArgs ? field.fixedArgs.length > rowIdx : false
							}).reduce((prev, curr) => {
								return prev || curr
							}, false)

							const circle = row?.[FormTableRowSpecial.CircleInfo] as FormTableFieldImageRef | undefined

							const deleteRow = (ev: MouseEvent): void => {
								ev.preventDefault()

								if (circle != undefined)
									deleteCircle(circle?.imageIdx, rowIdx)

								update(table => {
									if (table == undefined)
										return table

									return table.filter((_, index) => {
										return index !== rowIdx
									})
								})
							}

							const onRowHover = () => {
								if (circle != undefined)
									highlightCircle(circle.imageIdx, rowIdx)

								setActiveRow(rowIdx)
							}
							const className = active && activeRow === rowIdx ? 'active' : undefined

							return <tr key={rowIdx} className={className} onMouseEnter={onRowHover}>
								<TableVariadicControl
									rowIdx={rowIdx} editTable={editTable}
									isVariadic={table.isVariadic ?? false} rowHasFixedField={rowHasFixedField}
									deleteRow={deleteRow}
								/>
								{
									table.fields.map((field, fieldIdx) => renderRowField(rowIdx, field, fieldIdx, row))
								}
								{(() => {
									const emptyCells: React.ReactNode[] = []
									for (let i = calculateRowCellCount(row, table.fields); i < nCols - (table.isVariadic ? 1 : 0); i++) {
										emptyCells.push(<td key={i}></td>)
									}

									return emptyCells
								})()}
							</tr>
						})}
					</tbody>
				</table>
				{addButton}
			</div>
		</EditModeContext.Provider>
	</div>
}

function TableVariadicControl({ rowIdx, editTable, isVariadic, rowHasFixedField, deleteRow }: {
	rowIdx: number, editTable: boolean,
	isVariadic: boolean, rowHasFixedField: boolean,
	deleteRow: (ev: MouseEvent) => void
}) {
	const removeRowButton = editTable && !rowHasFixedField ? <>
		<button className="table-remove-row" onClick={deleteRow}>-</button>
	</> : undefined

	return <>
		<td>
			<div className="table-variadic-control">
				<span>&gt;</span>
				{removeRowButton}
			</div>
		</td>
		{isVariadic ? <>
			<td>{rowIdx + 1}</td>
		</> : undefined}
	</>
}
