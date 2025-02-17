import { createContext } from "react"
import { SkeletonData } from "./Skeleton"

export type BodyData = {
	generals: GeneralInfo
	skeleton: SkeletonData
}

export const BodyDataContext = createContext<BodyData | undefined>(undefined)

export type GeneralInfo = {
	name: string
	age: number
}
