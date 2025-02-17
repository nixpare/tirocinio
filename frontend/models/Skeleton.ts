import { AnatomStruct, AnatomStructData } from "./AnatomStruct";

export type Bone = AnatomStruct & {
	type: 'bone'
};

export type BoneData = AnatomStructData & {
	type: 'bone'
}

export type SkeletonData = Record<string, BoneData>
