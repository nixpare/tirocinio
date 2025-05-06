import { useLoaderData } from 'react-router';
import { convertStrapi, fetchStrapiDocument, StrapiAnatomStructType } from '../../cms/AnatomStruct'
import { Body, BodyContextProvider } from '../../models/Body';
import { AnatomStructDataContext, Bone } from '../../models/AnatomStruct';
import { useImmer } from 'use-immer';
import { Form } from '../components/Form/Form';
import { childDeepUpdater, childUpdater, rootDeepUpdater } from '../utils/updater';
import { walkObject } from '../../models/Programmable';
import Select from 'react-select';
import { useContext, useEffect, useState } from 'react';
import { NavigationContextProvider } from '../App';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';

type AnatomTypeOption = {
	label: string,
	value: StrapiAnatomStructType
}

export function ConversionSelector() {
	useConversionNavigation()

	const options: AnatomTypeOption[] = [
		{ label: 'Osso', value: StrapiAnatomStructType.Osso },
		{ label: 'Viscera', value: StrapiAnatomStructType.Viscera },
		{ label: 'Esterno', value: StrapiAnatomStructType.Esterno }
	]

	const [anatomType, setAnatomType] = useState<string>('')
	const [anatomName, setAnatomName] = useState<string>('')

	return (
		<>
			<div className='container container-horiz container-start'>
				<Select
					options={options}
					value={options.find(option => option.value === anatomType)}
					onChange={(newValue) => {
						setAnatomType(newValue?.value ?? '')
					}}
					isClearable
				/>
				<input type="text"
					value={anatomName}
					onChange={(ev) => {
						setAnatomName(ev.target.value)
					}}
				/>
			</div>
			{anatomType !== '' && anatomName !== '' && (
				<Link
					component={RouterLink}
					to={`/conversion/${anatomType}/${anatomName}`}
				>
					Converti
				</Link>
			)}		
		</>
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

	const { anatomType, anatomName } = params as {
		anatomType: StrapiAnatomStructType,
		anatomName: string
	};

	const strapiDoc = await fetchStrapiDocument(anatomType, anatomName);
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

	const bone = useLoaderData<Bone>();
	console.log(bone)

	const [body, updateBody] = useImmer<Body>({
		generals: {
			name: 'Test body',
			age: 20
		},
		bones: {
			[bone.name]: {
				type: 'bone',
				name: bone.name,
				form: {
					templ: bone.form
				}
			}
		},
		viscus: {},
		exteriors: {}
	})

	const boneData = body.bones[bone.name].form.sections

	useEffect(() => {
		console.log(boneData)
	}, [boneData])

	const data = body.bones[bone.name]

	const updateBodyBones = childUpdater(updateBody, 'bones')
	const updateBodyBone = childUpdater(updateBodyBones, bone.name)
	const updateBodyBoneDataDeep = rootDeepUpdater(updateBodyBone, (bone, ...breadcrumb) => {
		const payload = walkObject<any>(bone, breadcrumb.join('.'))
		console.log(payload)
	})
	const updateBodyBoneData = childDeepUpdater(updateBodyBoneDataDeep, 'form', 'form')

	return (
		<BodyContextProvider.Provider value={{ body, updateBody }}>
			<AnatomStructDataContext.Provider value={data}>
				<Form
					form={data.form}
					update={updateBodyBoneData}
					initialEditMode={true}
				/>
			</AnatomStructDataContext.Provider>
		</BodyContextProvider.Provider>
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