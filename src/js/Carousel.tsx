import React, { ReactNode, MouseEvent, useState } from 'react'

import '../css/Carousel.css'

/**
 * Carousel implementa un semplice componente per mostrare più contenuti in successione,
 * uno alla volta. Se viene passato un elemento soltanto, in automatico non mostrerà i
 * controlli. Ogni figlio viene incapsulato in una `<div>` da usare per nascondere i vari
 * elementi, ogni div eredita la proprietà `key` per gestire le liste in React
 * @returns ReactNode
 */
export function Carousel({ children, visibleState }: { children: ReactNode, visibleState?: { visible: number, setVisible: (newState: number) => void } }) {
	const childs = React.Children.toArray(children)
	
	const pages = childs.length

	if (!visibleState) {
		const [visible, setVisible] = useState(0)
		visibleState = { visible: visible, setVisible: setVisible }
	}

	const slideLeft = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault();

		if (visibleState.visible > 0) {
			visibleState.setVisible(visibleState.visible - 1)
		}
	}

	const slideRight = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault();

		if (visibleState.visible < pages - 1) {
			visibleState.setVisible(visibleState.visible + 1)
		}
	}

	const buttonStyle = pages > 1 ? {} : {
		display: 'none'
	}
	
	return (
		<div className="carousel">
			<button style={buttonStyle} onClick={slideLeft} disabled={visibleState.visible === 0}>&lt;</button>
			<div>
				{childs.map((child, childIdx) => {
					const key: string = React.isValidElement(child) && child.key ? child.key : childIdx.toString()
					const style = childIdx === visibleState.visible ? {} : {
						display: 'none',
					}

					return (
						<div key={key} style={style}>
							{child}
						</div>
					);
				})}
			</div>
			<button style={buttonStyle} onClick={slideRight} disabled={visibleState.visible === pages-1}>&gt;</button>
		</div>
	)
}