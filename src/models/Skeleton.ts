import { AnatomStruct, AnatomStructType } from "./AnatomStruct";
import { FormData } from "./Form"

export type Bone = AnatomStruct & {
	type: AnatomStructType.Bone;
};

export type BoneData = FormData

export type SkeletonData = Record<string, BoneData>
