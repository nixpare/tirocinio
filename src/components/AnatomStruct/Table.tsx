import { useContext, useState } from "react";
import { AnatomStructPropertyImageRef, AnatomStructTable, AnatomStructTableState, AnatomStructTableType } from "../../models/AnatomStructTypes";
import { DeleteImageCircleFunc, EditModeContext, HighlightImageCircleFunc } from "./AnatomStruct";
import { Property, UpdatePropertyFunc } from "./Property";
import { EditTablePopup, EditTablePopupContext, SaveTableTemplateFunc } from "./EditTablePopup";

import './Table.css'

export type UpdateTableFunc = (fn: (table: AnatomStructTableState) => AnatomStructTableState) => void

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
	const tableElem = (() => {
		switch (table.type) {
			case AnatomStructTableType.Default:
				return <TableDefault table={table} state={state} update={update} />
			case AnatomStructTableType.VariadicButton:
				return <TableVariadicButton table={table} state={state} update={update} />
			case AnatomStructTableType.VariadicMouse:
				return <TableVariadicMouse
					table={table} state={state} update={update}
					active={active} deleteCircle={deleteCircle} highlightCircle={highlightCircle}
				/>
		}
	})()

	const editMode = useContext(EditModeContext)
	const inEditTablePopup = useContext(EditTablePopupContext)

	const [editFields, setEditFields] = useState(useContext(EditModeContext))
	const toggleEditFields = () => {
		setEditFields(!editFields)
	}
	const editFieldsButton = editMode ? undefined : <>
		<button onClick={toggleEditFields}>
			{editFields ? 'Save' : 'Edit' }
		</button>
	</>

	const [editTable, setEditTable] = useState(false)
	const saveTableTemplate: SaveTableTemplateFunc = (fn) => {
		console.log(fn(table))
	}
	const editTablePopup = editTable && !inEditTablePopup ? <>
		<EditTablePopup saveTableTemplate={saveTableTemplate} table={table} state={state} update={update} />
	</> : undefined

	const editControls = inEditTablePopup ? undefined : <>
		<div className="table-edit-controls">
			<button onClick={() => { setEditTable(true) }}>Edit Table</button>
			{editFieldsButton}
		</div>
	</>

	return <div className="table">
		{editControls}
		<EditModeContext.Provider value={editFields}>
			<div className={`table-wrapper ${active ? 'active' : ''}`} onMouseEnter={setActive}>
				{tableElem}
			</div>
		</EditModeContext.Provider>
		{editTablePopup}
	</div>
}

/**
 * TableDefault rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableDefault({ table, state, update }: { table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc }) {
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
				{state?.map((row, rowIdx) => {
					return <tr key={rowIdx}>
						{row?.map((field, fieldIdx) => {
							// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
							const updateProperty: UpdatePropertyFunc = (fn) => {
								update(table => {
									const newProp = fn(table?.[rowIdx]?.[fieldIdx])
									if (newProp == undefined)
										return table

									if (!table) {
										table = []
									}

									if (!table[rowIdx]) {
										table[rowIdx] = []
									}

									table[rowIdx][fieldIdx] = newProp
									return table
								})
							}

							const key = `${rowIdx}-${fieldIdx}`
							const fieldTemplate = table.fields[fieldIdx]

							return <Property key={key} state={field} template={fieldTemplate} update={updateProperty} />
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
function TableVariadicButton({ table, state, update }: { table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc }) {
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

	const tableBody = <>
		{/* Generazione dei valori già esistenti della tabella */}
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
				{row?.map((field, fieldIdx) => {
					// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
					const updateProperty: UpdatePropertyFunc = (fn) => {
						update(table => {
							const newProp = fn(table?.[rowIdx]?.[fieldIdx])
							if (newProp == undefined)
								return table

							if (!table) {
								table = []
							}

							if (!table[rowIdx]) {
								table[rowIdx] = []
							}

							table[rowIdx][fieldIdx] = newProp
							return table
						})
					}

					const key = `${rowIdx}-${fieldIdx}`
					const fieldTemplate = table.fields[fieldIdx]

					return <Property key={key} state={field} template={fieldTemplate} update={updateProperty} />
				})}
			</tr>
		})}
	</>

	const addButton = editMode ? <>
		<button className="table-add-row" onClick={addRow}>{table.variadicPlaceholder || '+'}</button>
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
				{tableBody}
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
function TableVariadicMouse({ table, state, update, active, deleteCircle, highlightCircle }: {
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
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
						const circle = row[0] as AnatomStructPropertyImageRef
						deleteCircle(circle.imageIdx, rowIdx)

						update(table => {
							if (!table)
								return table

							return table.filter((_, index) => {
								return index !== rowIdx
							})
						})
					}

					const circle = row[0] as AnatomStructPropertyImageRef

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
						{table.fields.map((input, fieldIdx) => {
							// updatePropertyRow è la funzione di produzione sullo stato per la proprietà specifica
							const updateProperty: UpdatePropertyFunc = (fn) => {
								update(table => {
									const newProp = fn(table?.[rowIdx]?.[fieldIdx + 1]) // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine
									if (newProp == undefined)
										return table

									if (!table) {
										table = []
									}

									if (!table[rowIdx]) {
										table[rowIdx] = []
									}

									table[rowIdx][fieldIdx + 1] = newProp  // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine
									return table
								})
							}

							const key = `${rowIdx}-${fieldIdx}`
							const propertyState = row?.[fieldIdx + 1]  // fieldIdx+1 perchè il primo field contiene le informazioni per l'immagine

							return <Property key={key} state={propertyState} template={input} update={updateProperty} />
						})}
					</tr>
				})}
			</tbody>
		</table>
	</>
}
