import { createContext } from "react"
import { Table, UpdateTableFunc } from "./Table"
import { AnatomStructTable, AnatomStructTableState } from "../../models/AnatomStructTypes"
import { EditModeContext } from "./AnatomStruct"

import "./EditTablePopup.css"

export const EditTablePopupContext = createContext(false)

export function EditTablePopup({ saveTable, table, state, update }: {
	saveTable: () => void
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
}) {
	return <div className="edit-table-popup">
		<EditTablePopupContext.Provider value={true}>
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
		</EditTablePopupContext.Provider>
		<button onClick={saveTable}>Salva Tabella</button>
	</div>
}

export function EditTableTemplate({ table, update }: {
	saveTable: () => void
	table: AnatomStructTable, state: AnatomStructTableState, update: UpdateTableFunc,
}) {
	return <div className="edit-table-popup">
		<EditTablePopupContext.Provider value={true}>
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
			
		</EditTablePopupContext.Provider>
		<button onClick={saveTable}>Salva Tabella</button>
	</div>
}