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

export async function saveBone(bodyId: string, bone: BoneData, breadcrumb: string[]): Promise<void> {
	console.log(breadcrumb)

	const resp = await fetch(`/api/bodies/${bodyId}/bones/${bone.name}`, {
		method: 'PUT',
		body: JSON.stringify({
			bone,
			breadcrumb
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	if (!resp.ok) {
		throw new Error(`Errore salvataggio osso ${bone.name}: ${await resp.text()}`);
	}
}