import { createContext } from "react"
import { BoneData, ExteriorData, VisceraData } from "./AnatomStruct"
import { Updater } from "use-immer"

export type GeneralInfo = {
	name: string
	age: number
}

export type BodyData = {
	generals: GeneralInfo
	bones: Record<string, BoneData>
	viscus: Record<string, VisceraData>
	exteriors: Record<string, ExteriorData>
}

export type BodyContext = {
	body: BodyData
	updateBody: Updater<BodyData>
}

export const BodyContextProvider = createContext<BodyContext | null>(null)
