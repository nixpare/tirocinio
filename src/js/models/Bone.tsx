export type Bone = {
	name: string
	pages: BonePropertyPage[]
}

export type BonePropertyPage = {
	title: string
	image: string
	table: BonePropertyTable
	props?: BoneProperty[][]
}

export type BonePropertyTable = {
	headers: string[]
	template: BonePropertyTemplate[]
	indexes: string[]
}

export type BonePropertyTemplate = {
	mode: InputMode
	options?: string[]
}

export type BoneProperty = string

export enum InputMode {
	Text,
	Dropdown
}
