import './Carousel.css'

import React, { ReactNode, MouseEvent, useState } from 'react'

/**
 * Carousel implementa un semplice componente per mostrare più contenuti in successione,
 * uno alla volta. Se viene passato un elemento soltanto, in automatico non mostrerà i
 * controlli. Ogni figlio viene incapsulato in una `<div>` da usare per nascondere i vari
 * elementi, ogni div eredita la proprietà `key` per gestire le liste in React
 * @returns ReactNode
 */
export function Carousel({ children, ...props }: {
	children: ReactNode
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
	const [visible, setVisible] = useState(0)
	const childs = React.Children.toArray(children)

	const slideLeft = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault();

		if (visible > 0) {
			setVisible(visible - 1)
		}
	}

	const slideRight = (ev: MouseEvent<HTMLButtonElement, PointerEvent>): void => {
		ev.preventDefault();

		if (visible < childs.length - 1) {
			setVisible(visible + 1)
		}
	}

	const buttonStyle = childs.length > 1 ? {} : {
		display: 'none'
	}
	
	return (
		<div className="carousel" { ...props }>
			<button style={buttonStyle} onClick={slideLeft} disabled={visible === 0}>
				<i className="fa-solid fa-chevron-left"></i>
			</button>
			<div>
				{childs.map((child, childIdx) => {
					const style = childIdx === visible ? {} : {
						display: 'none',
					}

					return (
						<div style={style} key={childIdx}>
							{child}
						</div>
					);
				})}
			</div>
			<button style={buttonStyle} onClick={slideRight} disabled={visible === childs.length -1}>
				<i className="fa-solid fa-chevron-right"></i>
			</button>
		</div>
	)
}