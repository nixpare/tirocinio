import { useContext, useState, MouseEvent } from "react";
import { AnatomStructPropertyImageRef, AnatomStructTable, AnatomStructTableField, AnatomStructTableState, AnatomStructRowSpecial, TableRowState, propertyDepth } from "../../models/AnatomStructTypes";
import { DeleteImageCircleFunc, EditModeContext, HighlightImageCircleFunc } from "./AnatomStruct";
import { Property, UpdatePropertyFunc } from "./Property";

import './Table.css'

export type UpdateTableFunc = (fn: (table: AnatomStructTableState) => AnatomStructTableState) => void
type RenderRowFieldFunc = (rowIdx: number, field: AnatomStructTableField, fieldIdx: number, row?: TableRowState) => React.ReactNode

/**
 * Table rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
export function Table({ table, state, update, active, setActive, deleteCircle, highlightCircle }: {
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void,
	deleteCircle: DeleteImageCircleFunc, highlightCircle: HighlightImageCircleFunc
}) {
	const renderRowField: RenderRowFieldFunc = (rowIdx, field, fieldIdx, row) => {
		// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
		const updateProperty: UpdatePropertyFunc = (fn) => {
			update(table => {
				if (!table) {
					table = []
				}

				if (!table[rowIdx]) {
					table[rowIdx] = {}
				}

				table[rowIdx][fieldIdx] = fn(table?.[rowIdx]?.[fieldIdx])
				return table
			})
		}

		const key = `${rowIdx}-${fieldIdx}`
		const propertyState = row?.[fieldIdx]

		return <Property key={key}
			template={field} rowIdx={rowIdx}
			state={propertyState} update={updateProperty} />
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
		state?.length ?? 0,
		table.fields
			.map(field => field.fixedArgs?.length ?? 0)
			.reduce((prev, curr) => { return prev > curr ? prev : curr }, 0)
	)

	const nCols = Math.max(
		table.headers.length,
		table.fields.length,
		state?.reduce((prev, curr) => {
			if (curr == undefined)
				return prev

			return Math.max(
				prev,
				Object.entries(curr).reduce((prev, [key, value]) => {
					const idx = Number(key)
					if (idx < 0)
						return 0

					return Math.max(
						prev,
						idx+1 + propertyDepth(value)
					)
				}, 0)
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

	const someHasDefault = table.fields.reduce((prev, curr) => {
		if (curr.defaultValue != undefined)
			prev++
		return prev
	}, 0) > 0

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
							{table.headers.length < nCols ? (() => {
								const emptyCells: React.ReactNode[] = []
								for (let i = table.headers.length; i < nCols; i++) {
									emptyCells.push(<th key={i}></th>)
								}

								return emptyCells
							})() : undefined}
						</tr>
						{someHasDefault ? <tr>
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
							{table.fields.length < nCols ? (() => {
								const emptyCells: React.ReactNode[] = []
								for (let i = table.headers.length; i < nCols; i++) {
									emptyCells.push(<th key={i}></th>)
								}

								return emptyCells
							})() : undefined}
						</tr> : undefined}
					</thead>
					<tbody>
						{[...Array(nRows).keys()].map(rowIdx => {
							const row = state?.[rowIdx]

							const rowHasFixedField = table.fields.map(field => {
								return field.fixedArgs ? field.fixedArgs.length > rowIdx : false
							}).reduce((prev, curr) => {
								return prev || curr
							}, false)

							const circle = row?.[AnatomStructRowSpecial.CircleInfo] as AnatomStructPropertyImageRef | undefined

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
									table.fields.map((field, fieldIdx) => {
										const fieldState = state?.[rowIdx]?.[fieldIdx] ?? undefined
									})
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
