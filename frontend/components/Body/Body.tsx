import './Body.css'

import { useQuery } from '@tanstack/react-query'
import { BodyData, BodyContext } from '../../models/Body'
import { Outlet, useParams } from 'react-router';
import { createTheme } from '@mui/material/styles';
import { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Breadcrumbs, Container, Typography } from '@mui/material';
import { useContext } from 'react';

export function BodyLayout() {
	const { name } = useParams();
	if (!name) {
		return <h3>Nome non specificato</h3>;
	}

	const body_url = `/api/body/${name}`
	const { data: body, isLoading: bodyLoading, error: bodyError } = useQuery({
		queryKey: [body_url],
		queryFn: async () => {
			const res = await fetch(body_url)
			if (!res.ok)
				throw new Error(await res.text())

			const body: BodyData = await res.json()
			return body
		},
		retry: false
	})

	if (bodyLoading)
		return (
			<div>
				<h3>Caricamento</h3>
			</div>
		)

	if (bodyError || !body) {
		const errMessage = bodyError ? bodyError.message : 'Errore durante il caricamento del corpo'

		return (
			<div>
				<h3>Errore</h3>
				<p>{errMessage}</p>
			</div>
		)
	}

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
		<BodyContext.Provider value={body}>
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
		</BodyContext.Provider>
	)
}

export function BodyHome() {
	const body = useContext(BodyContext);
	if (!body) throw new Error('BodyHome must be used within a BodyContext')

	return (
		<Container>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Typography sx={{ color: 'text.primary' }}>{body.generals.name}</Typography>
			</Breadcrumbs>
			<h1>{body.generals.name}</h1>
		</Container>
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
