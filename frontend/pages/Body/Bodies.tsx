import { Updater, useImmer } from 'use-immer';
import { addBody, getBodies } from '../../utils/api';
import './Bodies.css'
import { useLoaderData } from 'react-router';
import { FilteredBody } from '../../../backend/mongodb';
import { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs/Breadcrumbs';
import Typography from '@mui/material/Typography/Typography';
import { DocumentAddConfirm, DocumentList, DocumentToolbar } from '../../components/UI/Document';
import { DeepPartial } from '../../utils/types';
import { Body } from "../../../models/Body";
import { NavigationContextProvider } from '../../App';

export async function bodiesViewLoader() {
	return await getBodies();
}

export function BodiesView() {
	useBodiesNavigation();

	const [bodies, updateBodies] = useImmer(useLoaderData<FilteredBody[]>());
	const [search, setSearch] = useState('')

	return (
		<>
			<Breadcrumbs separator="›" aria-label="breadcrumb">
				<Typography sx={{ color: 'text.primary' }}>Home</Typography>
			</Breadcrumbs>
			<h1>Corpi</h1>
			<DocumentToolbar search={search} setSearch={setSearch}>
				<AddBody updateBodies={updateBodies} />
			</DocumentToolbar>
			<DocumentList
				documents={bodies?.map(body => ({
					name: body.generals.name,
					link: `/body/${body.generals.name}`,
					date: body.updatedAt
				})) ?? []}
				search={search}
			/>
		</>
	)
}

function AddBody({ updateBodies }: {
	updateBodies: Updater<FilteredBody[]>
}) {
	const [body, updateBody] = useImmer<DeepPartial<Body>>({
		bones: {},
		viscus: {},
		exteriors: {},
		updatedAt: new Date()
	})

	const onClickAddBody = () => {
		if (body.generals == undefined) {
			console.error('generals undefined')
			return
		}

		if (body.generals.name == undefined) {
			console.error('name undefined')
			return
		}

		if (body.generals.age == undefined) {
			console.error('age undefined')
			return
		}

		addBody(body as Body)
		updateBodies(bodies => {
			bodies.push(body as Body)
		})
	}

	return (
		<div className="add-body">
			<h3 className="add-body-title">Nuovo Corpo</h3>
			<div className='add-body-fields'>
				<AddBodyInput
					type="text"
					label='Nome:'
					htmlFor='body-name'
					value={body.generals?.name}
					onChange={(value => {
						updateBody(body => {
							if (body.generals == undefined) {
								body.generals = {}
							}

							body.generals.name = value !== '' ? value : undefined
						})
					})}
				/>
				<AddBodyInput
					type="number"
					label='Età:'
					htmlFor='body-age'
					value={body.generals?.age?.toString()}
					onChange={(value => {
						updateBody(body => {
							if (body.generals == undefined) {
								body.generals = {}
							}

							const age = Number(value);
							body.generals.age = !Number.isNaN(age) ? age : undefined
						})
					})}
				/>
			</div>
			<DocumentAddConfirm
				onClick={onClickAddBody}
			/>
		</div>
	)
}

function AddBodyInput({ label, htmlFor, onChange, ...props }: {
	label: string,
	htmlFor: string,
	onChange: (value: string) => void
} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'name' | 'onChange'>) {
	const { value, ...others } = props;

	return (
		<div className="add-body-field">
			<label htmlFor={htmlFor}>
				{label}
			</label>
			<input
				name={htmlFor}
				value={value ?? ''}
				onChange={(e) => {
					onChange(e.target.value)
				}}
				{...others}
			/>
		</div>
	)
}

function useBodiesNavigation() {
	const navigationContext = useContext(NavigationContextProvider);
	useEffect(() => {
		navigationContext?.([
			{
				segment: '',
				title: 'Corpi',
				icon: <i className="fa-solid fa-house"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: 'conversion',
				title: 'Conversione',
				icon: <i className="fa-solid fa-screwdriver-wrench"></i>
			}
		])
	}, [])
}
