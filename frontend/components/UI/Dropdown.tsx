import './Dropdown.css'

import { MouseEvent, useState } from 'react'

/**
 * Dropdown simula il comportamento dell'elemento <select>. Normalmente il chiamante dovrebbe passare al componente uno stato e la sua funzione per cambiarlo
 * come argomenti, in modo che quando viene selezionata una nuova opzione, il componente chiami `setSelectField`, il quale modificherà
 * `selectField` e quindi poi il componente verrà renderizzato con la nuova selezione
 * @param options elenco delle opzioni disponibili
 * @param selectField (opzionale) opzione selezionata alla creazione
 * @param setSelectField funzione da chiamare quando viene selezionata una nuova opzione
 * @returns ReactNode
 */
export function Dropdown({ options, selectedField = 'Non selezionato', setSelectedField, name, disabled }: {
	options: string[], selectedField?: string, setSelectedField: (selected?: string) => void,
	name?: string, disabled?: boolean
}) {
	const [active, setActive] = useState(false)

	const handleDropdownButton = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault()
		setActive(!active)
	}

	return <button
		name={name} className={`dropdown ${active ? 'active' : ''}`}
		onClick={handleDropdownButton} disabled={disabled}
	>
		{selectedField}
		<ul>
			{options.map(option => {
				function handleSelect() {
					setSelectedField(option)
				}

				return <li key={option} onClick={handleSelect}>{option}</li>
			})}
			<hr />
			<li className="no-selection" onClick={() => { setSelectedField(undefined) }}>
				<i className="fa-solid fa-trash"></i>
				Annulla selezione
			</li>
		</ul>
	</button>
}
