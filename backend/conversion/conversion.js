import 'dotenv/config';
import 'qs';

// API token for authentication
const apiToken = process.env['STRAPI_API_KEY'];

// Base URL for the API
const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';

// Headers for API requests, including authorization
const headers = {
	'Authorization': `Bearer ${apiToken}`
};

// Function to fetch a single page of data
const fetchPage = async (endpoint, documentName) => {
	try {
		let url = `${baseURL}/${endpoint}`
		let response = await fetch(url, { headers });
		if (!response.ok) {
			console.error(`Error fetching ${url}:`, await response.text());
			return null;
		}

		const documents = (await response.json()).data;
		const id = documents
			.filter(doc => doc.Nome.includes(documentName))
			.map(doc => doc.documentId)[0];
		
		url += `/${id}?populate[0]=Sezioni&populate[1]=Sezioni.Immagine&populate[2]=Sezioni.Campo`
		response = await fetch(url, { headers });
		if (!response.ok) {
			console.error(`Error fetching ${url}:`, await response.text());
			return null;
		}

		const data = (await response.json()).data
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

fetchPage('ossa', 'Coccige').then(data => {
	if (!data) {
		return;
	}

	console.log(data)
	console.log(data.Sezioni[0].Immagine)
	console.log(data.Sezioni[0].Campo)
})

// Function to fetch all data from a specific endpoint
/* const fetchAllData = async (endpoint) => {
	let allData = [];
	let currentPage = 1;
	let hasNextPage = true;

	while (hasNextPage) {
		const pageData = await fetchPage(endpoint, currentPage);

		if (!pageData) {
			break;
		}

		allData = [...allData, ...pageData.data];

		hasNextPage = currentPage < pageData.meta.pagination.pageCount;
		currentPage++;
	}

	return allData;
};

// Function to fetch data from both tables and create JSON files
const fetchAllDataAndDoSomethingWithIt = async () => {
	// Fetch data from your desired table *remember it should be the plural name*
	const yourTableName = await fetchAllData('yourTableName');

	console.log('All operations completed.');
};
fetchAllDataAndDoSomethingWithIt() */