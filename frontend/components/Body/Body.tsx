import './Body.css'

import { useQuery } from '@tanstack/react-query'
import { BodyData, BodyContextProvider, BodyContext } from '../../models/Body'
import { Outlet, useParams } from 'react-router';
import { createTheme } from '@mui/material/styles';
import { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Alert, Box, Breadcrumbs, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { saveBones } from '../../utils/api';
import { enqueueSnackbar } from 'notistack';

export function BodyLayout() {
	const { name } = useParams();
	if (!name) {
		return <h3>Nome non specificato</h3>;
	}

	const url = `/api/body/${name}`
	const { data, isLoading, error } = useQuery<BodyData>({
		queryKey: [url],
		queryFn: async () => {
			const res = await fetch(url)
			if (!res.ok)
				throw new Error(await res.text())

			return await res.json()
		},
		retry: false
	})

	if (isLoading)
		return (
			<div>
				<h3>Caricamento</h3>
			</div>
		)

	if (error || !data) {
		const errMessage = error ? error.message : 'Errore durante il caricamento del corpo'

		return (
			<div>
				<h3>Errore</h3>
				<p>{errMessage}</p>
			</div>
		)
	}

	const Content = () => {
		const [body, updateBody] = useImmer(data)
		useEffect(() => {
			saveBones(body.generals.name, body.bones).catch((err: Error) => {
				enqueueSnackbar(
					<Alert severity='error'>
						{err.message}
					</Alert>
				)
			})
		}, [body.bones])
		
		const context: BodyContext = { body, updateBody }

		const baseURL = `body/${encodeURIComponent(name)}`
		const navigation: Navigation = [
			{
				segment: baseURL,
				title: name,
				icon: <i className="fa-solid fa-house"></i>,
			},
			{
				segment: baseURL + '/ossa',
				title: 'Ossa',
				icon: <i className="fa-solid fa-bone"></i>
			}
		]

		return (
			<BodyContextProvider.Provider value={context}>
				<ReactRouterAppProvider
					navigation={navigation}
					theme={theme}
					branding={{
						title: 'Tirocinio',
						logo: <img
							src="/favicon.ico" alt="Logo"
							style={{ height: '100%', padding: '.6em' }}
						/>,
						homeUrl: '/'
					}}
				>
					<div className="body">
						<DashboardLayout defaultSidebarCollapsed>
							<Outlet />
						</DashboardLayout>
					</div>
				</ReactRouterAppProvider>
			</BodyContextProvider.Provider>
		)
	}

	return (
		<Content />
	);
}

export function BodyHome() {
	const bodyContext = useContext(BodyContextProvider);
	if (!bodyContext) throw new Error('BodyHome must be used within a BodyContextProvider')

	const { body } = bodyContext;

	return (
		<Box sx={{ padding: '2em 4em' }}>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Typography sx={{ color: 'text.primary' }}>{body.generals.name}</Typography>
			</Breadcrumbs>
			<h1>{body.generals.name}</h1>
		</Box>
	)
}

const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'data-toolpad-color-scheme',
	},
	colorSchemes: { light: true, dark: true },
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 600,
			lg: 1200,
			xl: 1536,
		},
	},
});
