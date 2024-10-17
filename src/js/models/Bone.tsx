export enum InputMode {
	Text,
	Number,
	Checkbox,
	MultilineText
}

export type BoneProperty = {
	mode: InputMode
	value: string | number | boolean
}

export type Bone = {
	name: string
	image: string
	props: {
		[key: string]: BoneProperty
	}
}
