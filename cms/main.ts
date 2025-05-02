import 'dotenv/config';
import qs from 'qs';
import util from 'util';
import { StrapiAnatomStructType, convertStrapi, fetchStrapiDocument } from './AnatomStruct';

const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';

export async function fetchQuery<T = any>(url: string, populate: any): Promise<T> {
	const compiledQuery = qs.stringify({
		populate: populate,
		status: 'draft'
	}, { encodeValuesOnly: true });

	const queryUrl = url + `?${compiledQuery}`;
	const response = await fetch(queryUrl);
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

deeplog(anatom);
console.log('\n------------------------\n');

deeplog(anatom.form.sections[0])

// const strapiSec = strapiDoc.Sezioni[0];

/* deeplog(strapiSec);
console.log('\n------------------------\n'); */

/* const nodes = rebuildStrapiCampoTree(strapiSec.Campo);
deeplog(nodes); */
