import { useContext, useState } from "react";
import { AnatomStructPropertyImageRef, AnatomStructTable, AnatomStructTableField, AnatomStructTableState, AnatomStructTableType, AnatomStructRowSpecial, TableRowState, AnatomStructInputMode } from "../../models/AnatomStructTypes";
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

	const tableElem = (() => {
		switch (table.type) {
			case AnatomStructTableType.Default:
				return <TableDefault table={table} state={state} renderRowField={renderRowField} />
			case AnatomStructTableType.VariadicButton:
				return <TableVariadicButton table={table} state={state} update={update} renderRowField={renderRowField} />
			case AnatomStructTableType.VariadicMouse:
				return <TableVariadicMouse
					table={table} state={state} update={update} renderRowField={renderRowField}
					active={active} deleteCircle={deleteCircle} highlightCircle={highlightCircle}
				/>
		}
	})()

	const editMode = useContext(EditModeContext)

	const [editFields, setEditFields] = useState(useContext(EditModeContext))
	const toggleEditFields = () => {
		setEditFields(!editFields)
	}
	const editFieldsButton = editMode ? undefined : <>
		<button className="table-edit-button" onClick={toggleEditFields}>
			{editFields ? <i className="fa-regular fa-floppy-disk"></i> : <i className="fa-regular fa-pen-to-square"></i> }
		</button>
	</>

	return <div className="table">
		{editFieldsButton}
		<EditModeContext.Provider value={editFields}>
			<div className={`table-wrapper ${active ? 'active' : ''}`} onMouseEnter={setActive}>
				{tableElem}
			</div>
		</EditModeContext.Provider>
	</div>
}

/**
 * TableDefault rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableDefault({ table, state, renderRowField }: {
	table: AnatomStructTable, state: AnatomStructTableState,
	renderRowField: RenderRowFieldFunc
}) {
	const rows = table.fields
		.filter(field => field.mode === AnatomStructInputMode.Fixed)
		.map(field => field.fixedArgs?.length ?? 0)
		.reduce((prev, curr) => { return prev > curr ? prev : curr }, 0)

	return <>
		<table>
			<thead>
				<tr>
					{/* Generazione degli header della tabella */}
					{table.headers.map(th => {
						return <th key={th}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{[...Array(rows).keys()].map(rowIdx => {
					return <tr key={rowIdx}>
						{table.fields.map((field, fieldIdx) => {
							const row = state?.[rowIdx]
							return renderRowField(rowIdx, field, fieldIdx, row)
						})}
					</tr>
					
				})}
			</tbody>
		</table>
	</>
}

/**
 * TableVariadicButton rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableVariadicButton({ table, state, update, renderRowField }: {
	table: AnatomStructTable, state: AnatomStructTableState,
	update: UpdateTableFunc, renderRowField: RenderRowFieldFunc
}) {
	const editMode = useContext(EditModeContext)

	const addRow = (): void => {
		update(table => {
			if (!table) {
				table = []
			}

			table.push([])
			return table
		})
	}

	const addButton = editMode ? <>
		<button className="table-add-row" onClick={addRow}>Aggiungi riga</button>
	</> : undefined

	return <>
		<table>
			<thead>
				<tr>
					<th key={0}></th>
					<th key={1}>#</th>
					{/* Generazione degli header della tabella */}
					{table.headers.map((th, thIdx) => {
						return <th key={thIdx + 2}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{state?.map((row, rowIdx) => {
					const deleteRow: () => void = () => {
						update(table => {
							if (table == undefined)
								return table

							return table.filter((_, index) => {
								return index !== rowIdx
							})
						})
					}

					const removeRowButton = editMode ? <>
						<button className="table-remove-row" onClick={deleteRow}>-</button>
					</> : undefined

					return <tr key={rowIdx}>
						<td>
							{removeRowButton}
						</td>
						<td>
							{rowIdx + 1}
						</td>
						{table.fields.map((field, fieldIdx) => renderRowField(rowIdx, field, fieldIdx, row))}
					</tr>
				})}
			</tbody>
		</table>
		{addButton}
	</>
}

/**
 * TableVariadicMouse rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableVariadicMouse({ table, state, update, renderRowField, active, deleteCircle, highlightCircle }: {
	table: AnatomStructTable, state: AnatomStructTableState,
	update: UpdateTableFunc, renderRowField: RenderRowFieldFunc,
	active: boolean, deleteCircle: DeleteImageCircleFunc, highlightCircle: HighlightImageCircleFunc
}) {
	const editMode = useContext(EditModeContext)
	const [activeRow, setActiveRow] = useState(-1)

	return <>
		<table>
			<thead>
				<tr>
					<th key={0}></th>
					<th key={1}>#</th>
					{/* Generazione degli header della tabella */}
					{table.headers.map((th, thIdx) => {
						return <th key={thIdx + 2}>{th}</th>
					})}
				</tr>
			</thead>
			<tbody>
				{/* Generazione dei valori già esistenti della tabella */}
				{state?.map((row, rowIdx) => {
					const deleteRow: () => void = () => {
						const circle = row[AnatomStructRowSpecial.CircleInfo] as AnatomStructPropertyImageRef
						deleteCircle(circle.imageIdx, rowIdx)

						update(table => {
							if (!table)
								return table

							return table.filter((_, index) => {
								return index !== rowIdx
							})
						})
					}

					const circle = row[AnatomStructRowSpecial.CircleInfo] as AnatomStructPropertyImageRef

					const onRowHover = () => {
						highlightCircle(circle.imageIdx, rowIdx)
						setActiveRow(rowIdx)
					}

					const className = active && activeRow === rowIdx ? 'active' : undefined

					const variadicControl = editMode ? <>
						<button className="table-remove-row" onClick={deleteRow}>-</button>
					</> : undefined

					return <tr key={rowIdx} className={className} onMouseEnter={onRowHover}>
						<td>
							<div className="table-variadic-control">
								<span>&gt;</span>
								{variadicControl}
							</div>
						</td>
						<td>
							{rowIdx + 1}
						</td>
						{table.fields.map((field, fieldIdx) => renderRowField(rowIdx, field, fieldIdx, row))}
					</tr>
				})}
			</tbody>
		</table>
	</>
}
