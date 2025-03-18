import { createContext } from "react"
import { ObjectId } from "mongodb";
import { BoneData, ExteriorData, VisceraData } from "./AnatomStruct"
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
}

export type BodyContext = {
	body: Body
	updateBody: Updater<Body>
}

export const BodyContextProvider = createContext<BodyContext | null>(null)
