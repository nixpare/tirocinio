import React, { ReactNode, MouseEvent, useState } from 'react'

import '../css/Carousel.css'

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
					const key = child.key ?? childIdx
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