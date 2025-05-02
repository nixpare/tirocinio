import { useLoaderData } from 'react-router';
import { convertStrapi, fetchStrapiDocument, StrapiAnatomStructType } from '../../cms/AnatomStruct'
import { Body } from '../../models/Body';
import { AnatomStructDataContext, Bone } from '../../models/AnatomStruct';
import { BodyContextProvider } from '../../models/Body';
import { useImmer } from 'use-immer';
import { Form } from '../components/Form/Form';
import { childDeepUpdater, childUpdater, rootDeepUpdater } from '../utils/updater';
import { walkObject } from '../../models/Programmable';

export async function conversionLoader() {
	const strapiDoc = await fetchStrapiDocument(StrapiAnatomStructType.Osso, 'Femore destro');
	console.log(strapiDoc)

	const [anatom, err] = convertStrapi(strapiDoc, StrapiAnatomStructType.Osso);
	if (err) {
		console.error(err.error, err.computed);
	}
	if (!anatom) {
		console.error("an unexpected error has occurred at anatom struct");
	}

	return anatom
}

export function Conversion() {
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