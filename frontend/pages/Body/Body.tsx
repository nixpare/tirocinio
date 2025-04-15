import './Body.css'

import { useQuery } from '@tanstack/react-query'
import { Body, BodyContextProvider, BodyContext } from '../../../models/Body'
import { Link, Outlet, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useContext, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';
import { enqueueSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import { NavigationContextProvider } from '../../App';

export function BodyLoader() {
	const [body, updateBody] = useImmer<Body | null>(null);
	const { name } = useParams();
	if (!name) {
		return <h3>Nome non specificato</h3>;
	}

	const url = `/api/bodies/${name}`
	const { isLoading, error } = useQuery({
		queryKey: [url],
		queryFn: async () => {
			const res = await fetch(url)
			if (!res.ok)
				throw new Error(await res.text())

			const data: Body = await res.json();
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
		<BodyContent body={body} updateBody={updateBody as Updater<Body>} />
	);
}

function BodyContent({ body, updateBody }: { body: Body, updateBody: Updater<Body> }) {
	const context: BodyContext = { body, updateBody }
	useEffect(() => {
		enqueueSnackbar((
			<Alert severity='info'>Corpo {body.generals.name} caricato</Alert>
		), { key: 'body-loading', preventDuplicate: true })
	}, [])

	return (
		<BodyContextProvider.Provider value={context}>
			<Outlet />
		</BodyContextProvider.Provider>
	)
}

export function BodyHome() {
	const bodyContext = useContext(BodyContextProvider);
	const navigationContext = useContext(NavigationContextProvider);

	useEffect(() => {
		const baseURL = `body/${encodeURIComponent(body.generals.name)}`
		navigationContext?.([
			{
				segment: '',
				title: 'Home',
				icon: <i className="fa-solid fa-house"></i>
			},
			{
				segment: 'templates',
				title: 'Template editor',
				icon: <i className="fa-solid fa-screwdriver-wrench"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: baseURL,
				title: body.generals.name,
				icon: <i className="fa-solid fa-user"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: baseURL + '/bones',
				title: 'Ossa',
				icon: <i className="fa-solid fa-bone"></i>
			},
			{
				segment: baseURL + '/viscus',
				title: 'Visceri',
				icon: <i className="fa-solid fa-lungs"></i>
			},
			{
				segment: baseURL + '/exteriors',
				title: 'Esterno',
				icon: <i className="fa-solid fa-shield"></i>
			}
		])
	}, [])

	if (!bodyContext) throw new Error('BodyHome must be used within a BodyContextProvider')

	const { body } = bodyContext;

	return (
		<Box sx={{ padding: '2em 4em' }}>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Typography sx={{ color: 'text.primary' }}>{body.generals.name}</Typography>
			</Breadcrumbs>
			<h1>{body.generals.name}</h1>
			<div className="anatom-struct-links">
				<Link to="bones" className='anatom-struct-link'>
					Ossa
					<i className="fa-solid fa-bone"></i>
				</Link>
				<Link to="viscus" className='anatom-struct-link'>
					Visceri
					<i className="fa-solid fa-lungs"></i>
				</Link>
				<Link to="exteriors" className='anatom-struct-link'>
					Esterno
					<i className="fa-solid fa-shield"></i>
				</Link>
			</div>
		</Box>
	)
}
