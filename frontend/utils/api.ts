import { AnatomStruct, AnatomStructType } from "../../models/AnatomStruct";
import { Body } from "../../models/Body";
import { FilteredAnatomStruct, FilteredBody } from "../../backend/mongodb";

export async function getAnatomStructs(type: AnatomStructType): Promise<FilteredAnatomStruct[]> {
	const resp = await fetch(`/api/anatoms/${type}`)
	if (!resp.ok) {
		throw new Error(`Errore ricezione strutture anatomiche: ${await resp.text()}`);
	}
	return await resp.json();
}

export async function getAnatomStruct(type: AnatomStructType, name: string): Promise<AnatomStruct> {
	const resp = await fetch(`/api/anatoms/${type}/${name}`)
	if (!resp.ok) {
		throw new Error(`Errore ricezione struttura anatomica: ${await resp.text()}`);
	}
	return await resp.json();
}

export async function saveAnatomStruct(anatom: AnatomStruct): Promise<string> {
	const resp = await fetch(`/api/anatoms/${anatom.type}/${anatom.name}`, {
		method: 'POST',
		body: JSON.stringify(anatom),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore aggiornamento struttura anatomica: ${await resp.text()}`);
	}
	return await resp.text();
}

export async function getBodies(): Promise<FilteredBody[]> {
	const resp = await fetch(`/api/bodies`)
	if (!resp.ok) {
		throw new Error(`Errore ricezione corpi: ${await resp.text()}`);
	}
	return await resp.json();
}

export async function getBody(name: string): Promise<Body> {
	const resp = await fetch(`/api/bodies/${name}`)
	if (!resp.ok) {
		throw new Error(`Errore ricezione corpo "${name}": ${await resp.text()}`);
	}

	const body = await resp.json();
	return body;
}

export async function addBody(body: Body): Promise<string> {
	const resp = await fetch(`/api/bodies`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore aggiunta corpo: ${await resp.text()}`);
	}
	return await resp.text();
}

export async function addBodyAnatomStruct(bodyName: string, anatom: FilteredAnatomStruct): Promise<string> {
	const resp = await fetch(`/api/bodies/${bodyName}/anatoms`, {
		method: 'POST',
		body: JSON.stringify(anatom),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore aggiunta struttura anatomica: ${await resp.text()}`);
	}
	return await resp.text();
}

export async function removeBodyAnatomStruct(bodyName: string, anatom: FilteredAnatomStruct): Promise<string> {
	const resp = await fetch(`/api/bodies/${bodyName}/anatoms/${anatom.type}/${anatom.name}`, {
		method: 'DELETE',
	})
	if (!resp.ok) {
		throw new Error(`Errore rimozione struttura anatomica: ${await resp.text()}`);
	}
	return await resp.text();
}

export async function updateAnatomStructData(bodyName: string, anatomType: AnatomStructType, anatomName: string, payload: any, breadcrumb: string[]): Promise<void> {
	const resp = await fetch(`/api/bodies/${bodyName}/anatoms/${anatomType}/${anatomName}`, {
		method: 'PUT',
		body: JSON.stringify({
			payload,
			breadcrumb
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore salvataggio struttura anatomica ${anatomName}: ${await resp.text()}`);
	}
}
