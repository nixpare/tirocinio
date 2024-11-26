import { AnatomStruct, AnatomStructType } from "./AnatomStruct";

export type Skeleton = Record<string, Bone>

export type Bone = AnatomStruct & {
	type: AnatomStructType.Bone;
};

export type SkeletonData = Record<string, BoneData>

export type BoneData = FormData
