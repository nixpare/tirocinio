import { useState } from 'react'
import './Document.css'
import Accordion from '@mui/material/Accordion/Accordion'
import { AccordionSummaryLeft } from './Accordion'
import AccordionDetails from '@mui/material/AccordionDetails/AccordionDetails'
import Paper from '@mui/material/Paper/Paper'
import Link from '@mui/material/Link/Link'
import { Link as RouterLink } from 'react-router'

export type DocumentType = {
	name: string
	link: string
	date: Date
}

export function Documents({ lists }: {
	lists: {
		title: string,
		documents: DocumentType[]
	}[]
}) {
	const [search, setSearch] = useState('')

	return (
		<>
			<DocumentToolbar search={search} setSearch={setSearch} />
			{lists.map(list => (
				<DocumentListAccordion key={list.title}
					title={list.title}
					documents={list.documents}
					search={search}
				/>
			))}
		</>
	)
}

export function DocumentToolbar({ search, setSearch, children }: {
	search: string,
	setSearch: (value: string) => void,
	children?: React.ReactNode
}) {
	const [addExpanded, setAddExpanded] = useState(false);

	return (
		<div className="document-toolbar">
			<div>
				<div className="document-search">
					<label htmlFor="search">Cerca: </label>
					<input
						type="text"
						name="search"
						placeholder="Cerca ..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value.toLowerCase())
						}}
					/>
				</div>
				{children != undefined && (
					<button className='document-add-button' onClick={() => {
						setAddExpanded(!addExpanded)
					}}>
						Aggiungi
					</button>
				)}
			</div>
			{children != undefined && (
				<Accordion
					expanded={addExpanded}
					sx={{ "::before": { display: 'none' } }}
				>
					<AccordionSummaryLeft sx={{ display: 'none' }} />
					<AccordionDetails className='document-add'>
						{children}
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	)
}

export function DocumentAddConfirm(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	return (
		<button {...props}>Invia</button>
	)
}

export function DocumentListAccordion({ title, documents, search }: {
	title: string
	documents: DocumentType[]
	search: string
}) {
	return (
		<Accordion className="document-section" elevation={4} defaultExpanded>
			<AccordionSummaryLeft>
				<h2>{title}</h2>
			</AccordionSummaryLeft>
			<AccordionDetails className="document-list">
				{documents.sort(
					(a, b) => a.name.localeCompare(b.name)
				).filter(
					document => document.name.toLowerCase().includes(search)
				).map(
					document => (
						<Paper className="document" elevation={3} key={document.name}>
							<Link component={RouterLink} to={document.link}>
								<p className="document-name">{document.name}</p>
								<p className="document-update">{document.date.toLocaleString()}</p>
							</Link>
						</Paper>
					)
				)}
			</AccordionDetails>
		</Accordion>
	)
}

export function DocumentList({ documents, search }: {
	documents: DocumentType[]
	search: string
}) {
	const docs = documents
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter(document => document.name.toLowerCase().includes(search))

	return (
		<Paper className="document-list">
			{docs.length > 0
				? docs.map(
					document => (
						<Paper className="document" elevation={3} key={document.name}>
							<Link component={RouterLink} to={document.link}>
								<p className="document-name">{document.name}</p>
								<p className="document-update">{new Date(document.date).toLocaleString()}</p>
							</Link>
						</Paper>
					)
				)
				: 'Nessun elemento'
			}
		</Paper>
	)
}