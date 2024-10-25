import { useContext, useState } from "react";
import { AnatomStructProperty, AnatomStructPropertyImageRef, AnatomStructTable, AnatomStructTableState, AnatomStructTableType } from "../models/AnatomStructTypes";
import { DeleteImageCircleFunc, EditModeContext, HighlightImageCircleFunc } from "./AnatomStruct";
import { Property, UpdatePropertyFunc } from "./AnatomStructProperty";

import './AnatomStructTable.css'

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
	switch (table.type) {
		case AnatomStructTableType.Default:
			return <TableDefault
				table={table} state={state} update={update}
				active={active} setActive={setActive}
			/>
		case AnatomStructTableType.VariadicButton:
			return <TableVariadicButton
				table={table} state={state} update={update}
				active={active} setActive={setActive}
			/>
		case AnatomStructTableType.VariadicMouse:
			return <TableVariadicMouse
				table={table} state={state} update={update}
				active={active} setActive={setActive}
				deleteCircle={deleteCircle} highlightCircle={highlightCircle}
			/>
	}
}

/**
 * TableDefault rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableDefault({ table, state, update, active, setActive }: {
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void
}) {
	return (
		<div className={active ? 'active' : undefined} onMouseEnter={setActive}>
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
					{table.indexes?.map((row, rowIdx) => {
						const rowName = row[0]
						const colOffset = row.length;

						return (
							<tr key={rowName}>
								{/* Generazione dei campi fissi di ogni riga della tabella */}
								{row.map((rowConst, rowConstIdx) => {
									return <td key={`${rowName}-${rowConstIdx}`}>{rowConst}</td>
								})}

								{/* Generazione degli input della tabella dal template */}
								{table.fields.map((input, fieldIdx) => {
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

									let propertyState: AnatomStructProperty | undefined;
									if (state && state[rowIdx]) {
										propertyState = state[rowIdx][fieldIdx]
									}

									const key = `${rowName}-${fieldIdx + colOffset}`

									return <Property key={key} state={propertyState} template={input} update={updateProperty} />
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

/**
 * TableVariadicButton rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableVariadicButton({ table, state, update, active, setActive }: {
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void
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
				<button className="anatom-struct-table-remove-row" onClick={deleteRow}>-</button>
			</> : undefined

			return <tr key={rowIdx}>
				<td>
					{removeRowButton}
				</td>
				<td>
					{rowIdx + 1}
				</td>
				{table.fields.map((input, fieldIdx) => {
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
					const propertyState = row?.[fieldIdx] || undefined

					return <Property key={key} state={propertyState} template={input} update={updateProperty} />
				})}
			</tr>
		})}
	</>

	const addButton = editMode ? <>
		<button className="anatom-struct-table-add-row" onClick={addRow}>{table.variadicPlaceholder || '+'}</button>
	</> : undefined

	return (
		<div className={active ? 'active' : undefined} onMouseEnter={setActive}>
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
		</div>
	)
}

/**
 * TableVariadicMouse rappresenta la sezione di una pagina con la tabella di opzioni.
 * TODO
 * @param table attributo derivato dallo stato globale
 * @param update funzione di produzione per informare lo stato globale dei cambiamenti
 * @return ReactNode
 */
function TableVariadicMouse({ table, state, update, active, setActive, deleteCircle, highlightCircle }: {
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
	active: boolean, setActive: () => void,
	deleteCircle: DeleteImageCircleFunc, highlightCircle: HighlightImageCircleFunc
}) {
	const editMode = useContext(EditModeContext)
	const [activeRow, setActiveRow] = useState(-1)

	return (
		<div className={active ? 'active' : undefined} onMouseEnter={setActive}>
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
							<button className="anatom-struct-table-remove-row" onClick={deleteRow}>-</button>
						</> : undefined

						return <tr key={rowIdx} className={className} onMouseEnter={onRowHover}>
							<td>
								<div className="anatom-struct-table-variadic-control">
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
		</div>
	)
}
