import { SkeletonData } from "./Skeleton"

export type BodyData = {
	generals: GeneralInfo
	skeleton: SkeletonData
}

export type GeneralInfo = {
	name: string
	age: number
}
