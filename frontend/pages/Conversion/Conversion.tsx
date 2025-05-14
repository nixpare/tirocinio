import { useLoaderData } from 'react-router';
import { convertStrapi, fetchStrapiDocument, fetchStrapiDocumentList, StrapiAnatomStruct, StrapiAnatomStructType } from '../../../cms/AnatomStruct'
import { anatomTypeToBodyField, Body, BodyContextProvider } from '../../../models/Body';
import { AnatomStruct, AnatomStructDataContext } from '../../../models/AnatomStruct';
import { useImmer } from 'use-immer';
import { Form } from '../../components/Form/Form';
import { childDeepUpdater, childUpdater, rootDeepUpdater } from '../../utils/updater';
import { useContext, useEffect, useState } from 'react';
import { NavigationContextProvider } from '../../App';
import { Accordion, AccordionDetails, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { AccordionSummaryLeft } from '../../components/UI/Accordion';
import './Conversion.css';
import { saveAnatomStruct } from '../../utils/api';

type StrapiDocumentList = {
	bones: StrapiAnatomStruct[]
	viscera: StrapiAnatomStruct[]
	exteriors: StrapiAnatomStruct[]
}

export async function conversionSelectorLoader() {
	const list: StrapiDocumentList = {
		bones: await fetchStrapiDocumentList(StrapiAnatomStructType.Osso),
		viscera: await fetchStrapiDocumentList(StrapiAnatomStructType.Viscera),
		exteriors: await fetchStrapiDocumentList(StrapiAnatomStructType.Esterno)
	}
	return list
}

export function ConversionSelector() {
	useConversionNavigation()

	const { bones, viscera, exteriors } = useLoaderData<StrapiDocumentList>();

	const [search, setSearch] = useState('')

	return (
		<>
			<h1>Documenti da Strapi</h1>
			<div className="search">
				<p>Cerca: </p>
				<input
					type="text"
					placeholder="Cerca ..."
					onChange={(e) => {
						setSearch(e.target.value.toLowerCase())
					}}
				/>
			</div>
			<ConversionDocumentList
				title="Ossa"
				documents={bones}
				search={search}
			/>
			<ConversionDocumentList
				title="Viscere"
				documents={viscera}
				search={search}
			/>
			<ConversionDocumentList
				title="Esterni"
				documents={exteriors}
				search={search}
			/>
		</>
	)
}

function ConversionDocumentList({ title, documents, search }: {
	title: string
	documents: StrapiAnatomStruct[]
	search: string
}) {
	return (
		<Accordion className="document-section" elevation={4} defaultExpanded>
			<AccordionSummaryLeft>
				<h2>{title}</h2>
			</AccordionSummaryLeft>
			<AccordionDetails className="document-list">
				{documents.sort(
					(a, b) => a.Nome.localeCompare(b.Nome)
				).filter(
					document => document.Nome.toLowerCase().includes(search)
				).map(
					document => (
						<Paper className="document" elevation={3} key={document.documentId}>
							<Link component={RouterLink} to={`/conversion/${StrapiAnatomStructType.Osso}/${document.documentId}`}>
								<p className="document-name">{document.Nome}</p>
								<p className="document-update">{new Date(document.updatedAt).toLocaleString()}</p>
							</Link>
						</Paper>
					)
				)}
			</AccordionDetails>
		</Accordion>
	)
}

const anatomCache = new Map<string, any>();

export async function conversionLoader({ params }: {
	params: any
}) {
	const cacheKey = JSON.stringify(params)
	const cachedAnatom = anatomCache.get(cacheKey)
	if (cachedAnatom != undefined) {
		console.log('returning anatom struct from cache')
		return cachedAnatom
	}

	console.log('fetching anatom struct')

	const { anatomType, anatomID } = params as {
		anatomType: StrapiAnatomStructType,
		anatomID: string
	};

	const strapiDoc = await fetchStrapiDocument(anatomType, anatomID);
	console.log(strapiDoc)

	const [anatom, err] = convertStrapi(strapiDoc, anatomType);
	if (err) {
		console.error(err.error, err.computed);
	}
	if (!anatom) {
		console.error("an unexpected error has occurred at anatom struct");
	}

	anatomCache.set(cacheKey, anatom)
	return anatom
}

export function Conversion() {
	useConversionNavigation()

	const anatom = useLoaderData<AnatomStruct>();
	console.log(anatom)

	const anatomKey = anatomTypeToBodyField(anatom.type)
	if (!anatomKey) throw new Error("unknown anatom key")

	const fakeBody = {
		generals: {
			name: 'Test body',
			age: 20
		},
		bones: {},
		viscus: {},
		exteriors: {},
		updatedAt: new Date()
	}

	// @ts-ignore
	fakeBody[anatomKey][anatom.name] = {
		type: anatom.type,
		name: anatom.name,
		form: {
			templ: anatom.form
		},
		templateDate: new Date(),
		updatedAt: new Date()
	}

	const [body, updateBody] = useImmer<Body>(fakeBody)

	const onClickSave = () => {
		saveAnatomStruct(anatom)
	}

	//const boneData = body.bones[bone.name].form.sections

	/* useEffect(() => {
		console.log(boneData)
	}, [boneData]) */

	const data = body.bones[anatom.name]

	const updateAnatomStructs = childUpdater(updateBody, anatomKey)
	const updateAnatomStruct = childUpdater(updateAnatomStructs, anatom.name)
	const updateAnatomStructDeep = rootDeepUpdater(updateAnatomStruct, (anatom, ...breadcrumb) => {
		/* const payload =  walkObject<any>(anatom, breadcrumb.join('.'))
		console.log(payload) */
	})
	const updateForm = childDeepUpdater(updateAnatomStructDeep, 'form', 'form')

	return (
		<>
			<button onClick={onClickSave}>
				Salva nel database
			</button>
			<BodyContextProvider.Provider value={{ body, updateBody }}>
				<AnatomStructDataContext.Provider value={data}>
					<Form
						form={data.form}
						update={updateForm}
						initialEditMode={true}
					/>
				</AnatomStructDataContext.Provider>
			</BodyContextProvider.Provider>
		</>
	)
}

function useConversionNavigation() {
	const navigationContext = useContext(NavigationContextProvider);
	useEffect(() => {
		navigationContext?.([
			{
				segment: '',
				title: 'Home',
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