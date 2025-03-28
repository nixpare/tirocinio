import 'dotenv/config';
import qs from 'qs';
import util from 'util';
import { StrapiAnatomStructType, convertStrapi, fetchStrapiDocument } from './AnatomStruct';
import { convertFormSectionStarters } from './Form';
import { rebuildStrapiCampoTree, StrapiCampo, StrapiTipoCampo } from './Field';

const apiToken = process.env['STRAPI_API_KEY'];
const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';
export const headers = {
	'Authorization': `Bearer ${apiToken}`
};

export async function fetchQuery<T = any>(url: string, populate: any): Promise<T> {
	const compiledQuery = qs.stringify({
		populate: populate,
		status: 'draft'
	}, { encodeValuesOnly: true });

	const queryUrl = url + `?${compiledQuery}`;
	const response = await fetch(queryUrl, { headers });
	if (!response.ok) throw new Error(`Error fetching ${queryUrl}: ${await response.text()}`);

	let data = (await response.json()).data as T;
	return data;
}

export function deeplog(a: any) {
	console.log(util.inspect(a, { showHidden: false, depth: null, colors: true }));
}

const strapiDoc = await fetchStrapiDocument(baseURL, StrapiAnatomStructType.Osso, 'Femore destro');

const [ anatom, err ] = convertStrapi(strapiDoc, StrapiAnatomStructType.Osso);
if (err) {
	console.error(err.error, err.computed);
}
if (!anatom) {
	console.error("an unexpected error has occurred at anatom struct");
	process.exit(1);
}

anatom.name += ' (Strapi decoded)';

/* deeplog(anatom);
console.log('\n------------------------\n'); */

const strapiSec = strapiDoc.Sezioni[0];

/* deeplog(strapiSec);
console.log('\n------------------------\n'); */

const nodes = rebuildStrapiCampoTree(strapiSec.Campo);
deeplog(nodes);
