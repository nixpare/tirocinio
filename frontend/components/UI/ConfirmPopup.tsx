import './ConfirmPopup.css'

import { DetailedHTMLProps, HTMLAttributes } from 'react'

export type ConfirmPopupProps = {
	confirmLabel?: string
	cancelLabel?: string
	onConfirm: () => void
	onCancel: () => void
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function ConfirmPopup({
	confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel,
	children, className, ...props
}: ConfirmPopupProps) {
	return (
		<div className={['confirm-popup', className].join(' ')} {...props}>
			{children}
			<div className="buttons">
				<button className="confirm-button" onClick={onConfirm}>{confirmLabel}</button>
				<button className="cancel-button" onClick={onCancel}>{cancelLabel}</button>
			</div>
		</div>
	)
}