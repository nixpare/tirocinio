import { createContext } from "react"
import { ObjectId } from "mongodb";
import { AnatomStructData, AnatomStructType, BoneData, ExteriorData, VisceraData } from "./AnatomStruct"
import { Updater } from "use-immer"

export type GeneralInfo = {
	name: string
	age: number
}

export type Body = {
	_id?: ObjectId
	generals: GeneralInfo
	bones: Record<string, BoneData>
	viscus: Record<string, VisceraData>
	exteriors: Record<string, ExteriorData>
	updatedAt: Date
}

export type BodyContext = {
	body: Body
	updateBody: Updater<Body>
}

export const BodyContextProvider = createContext<BodyContext | null>(null)

export type AnatomStructBodyChilds = {
	[K in keyof Body]: Body[K] extends Record<string, AnatomStructData> ? K : never
}[keyof Body]

export function anatomTypeToBodyField(type: AnatomStructType): AnatomStructBodyChilds | undefined {
	switch (type) {
		case 'bone':
			return 'bones'
		case 'viscera':
			return 'viscus'
		case 'exterior':
			return 'exteriors'
	}
}
