import { StrapiAnatomStructType, convertStrapi, fetchStrapiDocument } from './AnatomStruct';

const strapiDoc = await fetchStrapiDocument(StrapiAnatomStructType.Osso, 'Femore destro');

const [ anatom, err ] = convertStrapi(strapiDoc, StrapiAnatomStructType.Osso);
if (err) {
	console.error(err.error, err.computed);
}
if (!anatom) {
	console.error("an unexpected error has occurred at anatom struct");
	process.exit(1);
}
