import './Body.css'

import { Body, BodyContextProvider } from '../../../models/Body'
import { Outlet, useLoaderData } from 'react-router';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useContext, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import { NavigationContextProvider } from '../../App';
import { Link as RouterLink } from 'react-router';
import Link from '@mui/material/Link/Link';
import { getBody } from '../../utils/api';
import { useImmer } from 'use-immer';

export async function bodyLayoutLoader({ params }: {
	params: any
}) {
	const { bodyName } = params;
	if (!bodyName) throw new Error('Body name must be provided')
		
	return await getBody(bodyName)
}

export function BodyLayout() {
	const loadedBody = useLoaderData<Body>();
	if (!loadedBody) throw new Error('BodyLayout did not receve body')

	const [body, updateBody] = useImmer(loadedBody);

	useEffect(() => {
		enqueueSnackbar((
			<Alert severity='info'>Corpo {body.generals.name} caricato</Alert>
		), { key: 'body-loading', preventDuplicate: true })
	}, [])

	return (
		<BodyContextProvider.Provider value={{ body, updateBody }}>
			<Outlet />
		</BodyContextProvider.Provider>
	)
}

export function BodyHome() {
	const body = useContext(BodyContextProvider)?.body;
	if (!body) throw new Error('BodyHome must be used within a BodyContextProvider')

	useBodyNavigation(body.generals.name)

	return (
		<Box sx={{ padding: '2em 4em' }}>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Link
					to="./.."
					underline="hover"
					component={RouterLink}
					sx={{ ":visited": { color: 'unset' }}}
				>
					<Typography>
						<i className="fa-solid fa-home"></i>
					</Typography>
				</Link>
				<Typography sx={{ color: 'text.primary' }}>{body.generals.name}</Typography>
			</Breadcrumbs>
			<h1>{body.generals.name}</h1>
			<div className="anatom-struct-links">
				<Link
					to="bones"
					underline="hover"
					className='anatom-struct-link'
					component={RouterLink}
				>
					Ossa
					<i className="fa-solid fa-bone"></i>
				</Link>
				<Link
					to="viscus"
					underline="hover"
					className='anatom-struct-link'
					component={RouterLink}
				>
					Visceri
					<i className="fa-solid fa-lungs"></i>
				</Link>
				<Link
					to="exteriors"
					underline="hover"
					className='anatom-struct-link'
					component={RouterLink}
				>
					Esterno
					<i className="fa-solid fa-shield"></i>
				</Link>
			</div>
		</Box>
	)
}

function useBodyNavigation(bodyName: string) {
	const navigationContext = useContext(NavigationContextProvider);

	useEffect(() => {
		navigationContext?.([
			{
				segment: './..',
				title: 'Home',
				icon: <i className="fa-solid fa-house"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: '.',
				title: bodyName,
				icon: <i className="fa-solid fa-user"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: 'bones',
				title: 'Ossa',
				icon: <i className="fa-solid fa-bone"></i>
			},
			{
				segment: 'viscus',
				title: 'Visceri',
				icon: <i className="fa-solid fa-lungs"></i>
			},
			{
				segment: 'exteriors',
				title: 'Esterno',
				icon: <i className="fa-solid fa-shield"></i>
			}
		])
	}, [])
}
