import './FullscreenOverlay.css';

import { DetailedHTMLProps, HTMLAttributes } from 'react';

export type FullscreenOverlayProps = {
	
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function FullScreenOverlay({ className, children, ...props }: FullscreenOverlayProps) {
	return (
		<div className={['fullscreen-overlay', className].join(' ')} {...props}>
			<div>
				{children}
			</div>
		</div>
	)
}