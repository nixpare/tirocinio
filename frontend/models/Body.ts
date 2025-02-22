import { createContext } from "react"
import { BoneData, ExteriorData, VisceraData } from "./AnatomStruct"

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

export const BodyDataContext = createContext<BodyData | undefined>(undefined)
