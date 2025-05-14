import { AnatomStruct, AnatomStructData, AnatomStructType } from "../../models/AnatomStruct";
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
	return await resp.json();
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

export async function updateAnatomStructsData<T extends Record<string, AnatomStructData>>(bodyName: string, anatomType: AnatomStructType, anatoms: T): Promise<void> {
	const resp = await fetch(`/api/bodies/${bodyName}/anatoms/${anatomType}`, {
		method: 'PUT',
		body: JSON.stringify(anatoms),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore salvataggio strutture anatomiche "${anatomType}": ${await resp.text()}`);
	}
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
