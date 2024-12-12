import { AnatomStruct } from "./AnatomStruct";
import { FormData } from "./Form"

export type Bone = AnatomStruct & {
	type: 'bone';
};

export type BoneData = FormData

export type SkeletonData = Record<string, BoneData>
