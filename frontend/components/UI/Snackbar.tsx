import { SnackbarMessage, SnackbarProvider, SnackbarProviderProps } from 'notistack';
import React from 'react';

export function CustomSnackbarProvider(props: SnackbarProviderProps) {
	return (
		<SnackbarProvider {...props}
			Components={{
				default: React.forwardRef<HTMLDivElement, { message: SnackbarMessage; divProps?: React.HTMLAttributes<HTMLDivElement> }>((props, ref) => {
					return (
						<div ref={ref} {...props.divProps}>
							{props.message}
						</div>
					)
				})
			}}
		/>
	);
}
