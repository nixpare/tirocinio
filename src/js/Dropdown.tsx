import { MouseEvent, useState } from 'react'

import '../css/Dropdown.css'

/**
 * Dropdown simula il comportamento dell'elemento <select>. Normalmente il chiamante dovrebbe passare al componente uno stato e la sua funzione per cambiarlo
 * come argomenti, in modo che quando viene selezionata una nuova opzione, il componente chiami `setSelectField`, il quale modificherà
 * `selectField` e quindi poi il componente verrà renderizzato con la nuova selezione
 * @param options elenco delle opzioni disponibili
 * @param selectField (opzionale) opzione selezionata alla creazione
 * @param setSelectField funzione da chiamare quando viene selezionata una nuova opzione
 * @returns ReactNode
 */
export function Dropdown({ options, selectedField = 'Non selezionato', setSelectedField }: { options: string[], selectedField?: string, setSelectedField: (selected: string) => void }) {
	const [active, setActive] = useState(false)

	const handleDropdownButton = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault()
		setActive(!active)
	}

	return (
		<button className={`dropdown ${active ? 'active' : ''}`} onClick={handleDropdownButton}>
			{selectedField}
			<ul>
				{options.map(option => {
					function handleSelect() {
						setSelectedField(option)
					}

					return <li key={option} onClick={handleSelect}>{option}</li>
				})}
			</ul>
		</button>
	)
}
