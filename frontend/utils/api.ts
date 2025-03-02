import { BoneData } from "../models/AnatomStruct";

export async function saveBones(bodyId: string, bones: Record<string, BoneData>): Promise<void> {
	const resp = await fetch(`/api/body/${bodyId}/bones`, {
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