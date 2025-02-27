import './Body.css'

import { useQuery } from '@tanstack/react-query'
import { BodyData, BodyDataContext } from '../../models/Body'
import { Link, Outlet, useParams } from 'react-router';
import { MenuItem } from 'primereact/menuitem';
import { PageNav } from '../UI/Nav';

export default function Body() {
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
		

	return (
		<BodyDataContext.Provider value={body}>
			<BodyHome name={name} />
		</BodyDataContext.Provider>
	)
}

export function BodyHome({ name }: { name: string }) {
	const sitemap: MenuItem[] = [
		{
			label: name,
			items: [
				{ template: <Link to={`/body/${name}`}>Home</Link> },
				{ template: <Link to={`/body/${name}/ossa`}>ossa</Link> }
			]
		},
	]

	return <div className="body-home">
		<PageNav sitemap={sitemap} />		
		<div className="container content">
			<Outlet />
		</div>
	</div>
}
