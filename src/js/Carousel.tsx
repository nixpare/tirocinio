import React, { ReactNode, MouseEvent, useState } from 'react'

import '../css/Carousel.css'

/**
 * Carousel implementa un semplice componente per mostrare più contenuti in successione,
 * uno alla volta. Se viene passato un elemento soltanto, in automatico non mostrerà i
 * controlli. Ogni figlio viene incapsulato in una `<div>` da usare per nascondere i vari
 * elementi, ogni div eredita la proprietà `key` per gestire le liste in React
 * @returns ReactNode
 */
export function Carousel({ children }: { children: ReactNode }) {
	const childs = React.Children.toArray(children)
	
	const pages = childs.length
	const [visible, setVisible] = useState(0)

	function slideLeft(ev: MouseEvent<HTMLButtonElement, PointerEvent>) {
		ev.preventDefault();

		if (visible > 0) {
			setVisible(visible - 1)
		}
	}

	function slideRight(ev: MouseEvent<HTMLButtonElement, PointerEvent>) {
		ev.preventDefault();

		if (visible < pages - 1) {
			setVisible(visible + 1)
		}
	}

	const buttonStyle = pages > 1 ? {} : {
		display: 'none'
	}
	
	return (
		<div className="carousel">
			<button style={buttonStyle} onClick={slideLeft} disabled={visible === 0}>&lt;</button>
			<div>
				{childs.map((child, childIdx) => {
					const key: string = React.isValidElement(child) && child.key ? child.key : childIdx.toString()
					const style = childIdx === visible ? {} : {
						display: 'none',
					}

					return (
						<div key={key} style={style}>
							{child}
						</div>
					);
				})}
			</div>
			<button style={buttonStyle} onClick={slideRight} disabled={visible === pages-1}>&gt;</button>
		</div>
	)
}