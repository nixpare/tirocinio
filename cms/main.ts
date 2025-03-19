import 'dotenv/config';
import qs from 'qs';
import util from 'util';
import { AnatomStructType, fetchAnatomStruct } from './AnatomStruct';

const apiToken = process.env['STRAPI_API_KEY'];
const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';
export const headers = {
	'Authorization': `Bearer ${apiToken}`
};

export async function fetchQuery<T = any>(url: string, populate: any): Promise<T> {
	const compiledQuery = qs.stringify({
		populate: populate
	}, { encodeValuesOnly: true });

	const queryUrl = url + `?${compiledQuery}`
	const response = await fetch(queryUrl, { headers });
	if (!response.ok) throw new Error(`Error fetching ${queryUrl}: ${await response.text()}`);

	let data = (await response.json()).data as T;
	return data;
}

export function deeplog(a: any) {
	console.log(util.inspect(a, {showHidden: false, depth: null, colors: true}))
}

fetchAnatomStruct(baseURL, AnatomStructType.Osso, 'Femore destro')
	.catch(err => {
		console.error(err)
	})
	.then(data => {
		deeplog(data)
	});
