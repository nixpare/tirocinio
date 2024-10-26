import { createContext, useState } from "react"
import { produce } from "immer"
import { Table, UpdateTableFunc } from "./Table"
import { AnatomStructTable, AnatomStructTableState } from "../../models/AnatomStructTypes"
import { EditModeContext } from "./AnatomStruct"

import "./EditTablePopup.css"

export type SaveTableTemplateFunc = (fn: (table: AnatomStructTable) => AnatomStructTable) => void

export const EditTablePopupContext = createContext(false)

export function EditTablePopup({ saveTableTemplate, table, state, update }: {
	saveTableTemplate: SaveTableTemplateFunc,
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
}) {
	const [newTableTemplate, setNewTableTemplate] = useState(table)
	const saveNewTableTemplate: SaveTableTemplateFunc = (fn) => {
		setNewTableTemplate(produce(tableTemplate => {
			return fn(tableTemplate)
		}))
	}

	return <div className="edit-table-popup">
		<EditTablePopupContext.Provider value={true}>
			<EditTableTemplate table={newTableTemplate} saveTableTemplate={saveNewTableTemplate} />
			<div className="split split-no-gap">
				<div className="container container-horiz">
					<EditModeContext.Provider value={false}>
						<Table
							table={table} state={state} update={update}
							active={false} setActive={()=>{}}
							deleteCircle={() => { console.log('deleteCircle') }} highlightCircle={() => { console.log('highlightCircle') }}
						/>
					</EditModeContext.Provider>
					<i className="fa-solid fa-arrow-right"></i>
				</div>
				
				<EditModeContext.Provider value={true}>
					<Table
						table={table} state={state} update={update}
						active={true} setActive={()=>{}}
						deleteCircle={() => { console.log('deleteCircle') }} highlightCircle={() => { console.log('highlightCircle') }}
					/>
				</EditModeContext.Provider>
			</div>
			<button onClick={() => { saveTableTemplate(() => { return newTableTemplate })}}>Salva Tabella</button>
		</EditTablePopupContext.Provider>
	</div>
}

export function EditTableTemplate({ table, saveTableTemplate }: {
	table: AnatomStructTable, saveTableTemplate: SaveTableTemplateFunc
}) {
	return <div>ciao</div>
}