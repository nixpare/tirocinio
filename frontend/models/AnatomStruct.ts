import { createContext } from "react"
import { FormTemplate, FormData } from "./Form"

export type AnatomStructType = 'bone' | 'viscera' | 'exterior'

export type AnatomStruct = Bone | Viscera | Exterior

type AnatomStructBase = {
	type: AnatomStructType
	name: string
	form: FormTemplate
}

export type AnatomStructData = BoneData | VisceraData | ExteriorData

export type AnatomStructDataBase = {
	type: AnatomStructType
	name: string
	form: FormData
}

export const AnatomStructDataContext = createContext<AnatomStructData | undefined>(undefined)

export type Bone = AnatomStructBase & {
	type: 'bone'
};

export type BoneData = AnatomStructDataBase & {
	type: 'bone'
}

export type Viscera = AnatomStructBase & {
	type: 'viscera'
};

export type VisceraData = AnatomStructDataBase & {
	type: 'viscera'
}

export type Exterior = AnatomStructBase & {
	type: 'exterior'
};

export type ExteriorData = AnatomStructDataBase & {
	type: 'exterior'
}
