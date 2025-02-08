import { FormTemplate } from "./Form"

export type AnatomStruct = {
	type: AnatomStructType
	name: string
	template: FormTemplate
}

export type AnatomStructType = 'bone'
