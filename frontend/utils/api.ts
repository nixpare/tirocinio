import { BoneData } from "../../models/AnatomStruct";

export async function saveBones(bodyId: string, bones: Record<string, BoneData>): Promise<void> {
	const resp = await fetch(`/api/bodies/${bodyId}/bones`, {
		method: 'PUT',
		body: JSON.stringify(bones),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore salvataggio ossa: ${await resp.text()}`);
	}
}

export async function updateBoneData(body: string, bone: string, payload: any, breadcrumb: string[]): Promise<void> {
	const resp = await fetch(`/api/bodies/${body}/bones/${bone}`, {
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
		throw new Error(`Errore salvataggio osso ${name}: ${await resp.text()}`);
	}
}