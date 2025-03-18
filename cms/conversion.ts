import 'dotenv/config';
import qs from 'qs';
import util from 'util';
import { AnatomStruct, AnatomStructType, Sezione } from './AnatomStruct';

// API token for authentication
const apiToken = process.env['STRAPI_API_KEY'];

// Base URL for the API
const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';

// Headers for API requests, including authorization
const headers = {
	'Authorization': `Bearer ${apiToken}`
};

async function fetchQuery<T = any>(url: string, populate: any): Promise<T> {
	const compiledQuery = qs.stringify({
		populate: populate
	}, { encodeValuesOnly: true });

	const queryUrl = url + `?${compiledQuery}`
	const response = await fetch(queryUrl, { headers });
	if (!response.ok) throw new Error(`Error fetching ${queryUrl}: ${await response.text()}`);

	let data = (await response.json()).data as T;
	return data;
}

fetchAnatomStruct(AnatomStructType.Osso, 'Femore destro')
	.catch(err => {
		console.error(err)
	})
	.then(data => {
		deeplog(data)
	});

function deeplog(a: any) {
	console.log(util.inspect(a, {showHidden: false, depth: null, colors: true}))
}

// Function to fetch a single page of data
async function fetchAnatomStruct(typ: AnatomStructType, name: string): Promise<AnatomStruct> {
	let url = `${baseURL}/${typ}`
	let response = await fetch(url, { headers });
	if (!response.ok) throw new Error(`Error fetching ${url}: ${await response.text()}`);

	const documents = (await response.json()).data as AnatomStruct[];
	const id = documents
		.filter(doc => doc.Nome.includes(name))
		.map(doc => doc.documentId)[0];

	url += `/${id}`
	const query = ['Sezioni']
	let data: AnatomStruct = await fetchQuery(url, query);

	await fetchSezione(data.Sezioni[0].id, url)
	/* for (let i = 0; i < data.Sezioni.length; i++) {
		data.Sezioni[i] = await fetchSezione(data.Sezioni[i].id, url, ['Sezioni'])
	} */

	return data;
};

// Function to fetch a single page of data
async function fetchSezione(id: number, url: string): Promise<void> {
	const query = {
		Sezioni: {
			filters: {
				id: {
					$eq: id
				}
			},
			populate: {
				Campo: {
					populate: '*'
				}
			}
		}
	};

	const data: Sezione = await fetchQuery(url, query);
	deeplog(data)
};
