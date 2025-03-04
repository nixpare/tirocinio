import './Body.css'

import { useQuery } from '@tanstack/react-query'
import { BodyData, BodyContextProvider, BodyContext } from '../../models/Body'
import { Outlet, useParams } from 'react-router';
import { createTheme } from '@mui/material/styles';
import { type Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useContext, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';
import { enqueueSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';

export function BodyLayout() {
	const [body, updateBody] = useImmer<BodyData | null>(null);
	const { name } = useParams();
	if (!name) {
		return <h3>Nome non specificato</h3>;
	}

	const url = `/api/body/${name}`
	const { isLoading, error } = useQuery({
		queryKey: [url],
		queryFn: async () => {
			const res = await fetch(url)
			if (!res.ok)
				throw new Error(await res.text())

			const data: BodyData = await res.json();
			updateBody(data);
			return data;
		},
		retry: false
	})

	if (isLoading)
		return (
			<div>
				<h3>Caricamento</h3>
			</div>
		)

	if (error || !body) {
		const errMessage = error ? error.message : 'Errore durante il caricamento del corpo'

		return (
			<div>
				<h3>Errore</h3>
				<p>{errMessage}</p>
			</div>
		)
	}

	return (
		<BodyContent body={body} updateBody={updateBody as Updater<BodyData>} />
	);
}

function BodyContent({ body, updateBody }: { body: BodyData, updateBody: Updater<BodyData> }) {
	useEffect(() => {
		enqueueSnackbar((
			<Alert severity='info'>Corpo {body.generals.name} caricato</Alert>
		), { key: 'body-loading', preventDuplicate: true })
	}, [])

	const context: BodyContext = { body, updateBody }

	const baseURL = `body/${encodeURIComponent(body.generals.name)}`
	const navigation: Navigation = [
		{
			segment: '',
			title: body.generals.name,
			icon: <i className="fa-solid fa-house"></i>
		},
		{
			segment: baseURL,
			title: body.generals.name,
			icon: <i className="fa-solid fa-user"></i>
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
						<div className="body-content">
							<Outlet />
						</div>
					</DashboardLayout>
				</div>
			</ReactRouterAppProvider>
		</BodyContextProvider.Provider>
	)
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
	colorSchemes: { light: true/* , dark: true */ },
});
