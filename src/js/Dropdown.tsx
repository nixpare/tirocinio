import { MouseEvent, useState } from 'react'

import '../css/Dropdown.css'

export function Dropdown({ options, selectedField, setSelectedField }: { options: string[], selectedField: string, setSelectedField: (selected: string) => void }) {
	const [active, setActive] = useState(false)
	//const [selected, setSelected] = useState(selectedField)

	function handleDropdownButton(ev: MouseEvent<HTMLButtonElement, PointerEvent>) {
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
