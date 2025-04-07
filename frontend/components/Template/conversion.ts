// @ts-nocheck

import { AnatomStruct, isAnatomStructType } from "../../../models/AnatomStruct"
import { FormData } from "../../../models/Form"

export function convertAnatomStruct(form: FormData): AnatomStruct {
	const nameAndType = form.sections?.anatom_struct?.name_and_type?.value?.fixed?.[0]
	if (!nameAndType) throw new Error("name and type object not found")

	const name = nameAndType[0]?.value
	if (!name) throw new Error("name not found")

	const type = nameAndType[1]?.value?.selection
	if (!name) throw new Error("type not found")

	if (!isAnatomStructType(type)) throw new Error(`type ${type} is not valid`);

	const sections = form.sections?.anatom_struct?.sections
	if (!sections) throw new Error("sections object not found")

	const anatomStruct: AnatomStruct = {
		type: type,
		name: name,
		form: {
			title: name,
			sections: convertFormSections(sections)
		}
	}

	return anatomStruct
}

function convertFormSections(sections) {
	const formSections = []

	return formSections
}