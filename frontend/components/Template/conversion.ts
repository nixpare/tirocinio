import { AnatomStruct } from "../../../models/AnatomStruct"
import { convertLabelToID, isAnatomStructType, isFormFieldType } from "../../../models/conversion"
import { FormData, FormExpansionFieldData, FormExpansionFieldTemplate, FormExpansionFieldValue, FormFieldData, FormFieldTemplate, FormFixedFieldTemplate, FormMultiSelectFieldData, FormMultiSelectFieldTemplate, FormNumberFieldTemplate, FormSectionTemplate, FormSelectFieldData, FormSelectFieldTemplate, FormSelectFieldValue, FormTextFieldData, FormTextFieldTemplate } from "../../../models/Form"
import { FieldInitiatorData } from "./Template"

export function convertAnatomStruct(form: FormData): AnatomStruct {
	
	const nameAndType = (form.sections?.anatom_struct?.name_and_type as FormExpansionFieldData | undefined)
						?.value?.fixed?.[0] as [FormTextFieldData, FormSelectFieldData]
	if (!nameAndType) throw new Error("name and type object not found")

	const name = nameAndType[0].value ?? undefined
	if (!name) throw new Error("name not found")

	const type = nameAndType[1]?.value?.selection
	if (!type) throw new Error("type not found")

	if (!isAnatomStructType(type)) throw new Error(`type ${type} is not valid`);

	const sections = form.sections?.anatom_struct?.sections
	if (!sections) throw new Error("sections object not found")

	const anatomStruct: AnatomStruct = {
		type: type,
		name: name,
		form: {
			title: name,
			sections: convertFormSections(sections as FormExpansionFieldData)
		}
	}

	return anatomStruct
}

function convertFormSections(sections: FormExpansionFieldData): FormSectionTemplate[] {
	return sections.value?.additional?.map<FormSectionTemplate>(section => {
		const [titleField, startersField] = [section[0], section[1]] as [FormTextFieldData | undefined, FormExpansionFieldData | undefined]

		const title = titleField?.value ?? undefined
		if (!title) throw new Error("section title not found")

		const starters = startersField?.value?.additional?.map(starter => {
			return convertFormField(starter as FieldInitiatorData)
		}) ?? []
		
		return {
			id: convertLabelToID(title),
			title: title,
			starters: starters
		}
	}) ?? []
}

function convertFormField(fieldData: FieldInitiatorData): FormFieldTemplate {
	const header = fieldData[0].value ?? undefined
	if (!header) throw new Error("field header not found")

	const type = fieldData[1].value?.selection
	if (!type) throw new Error("field type not found")

	if (!isFormFieldType(type)) throw new Error(`field type ${type} is not a valid type`)

	const field: FormFieldTemplate = {
		id: convertLabelToID(header),
		header: header,
		type: type
	}

	const next = fieldData[1].value?.next

	switch (type) {
		case "fixed":
			convertFormFixedField(field as FormFixedFieldTemplate, next);
			break;
		case "text":
			convertFormTextField(field as FormTextFieldTemplate, next);
			break;
		case "number":
			convertFormNumberField(field as FormNumberFieldTemplate, next);
			break;
		case "select":
			convertFormSelectField(field as FormSelectFieldTemplate, next);
			break;
		case "multi-select":
			convertFormMultiSelectField(field as FormMultiSelectFieldTemplate, next);
			break;
		case "expansion":
			convertFormExpansionField(field as FormExpansionFieldTemplate, next);
			break;
	}
	
	return field
}


function convertFormFixedField(field: FormFixedFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		return
	}

	const value = nextData['value']?.value as string | undefined
	field.value = value
}

function convertFormTextField(field: FormTextFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		return
	}

	const multiline = nextData['multiline']?.value as FormSelectFieldValue | undefined
	field.multiline = multiline?.selection === 'yes'
}

function convertFormNumberField(field: FormNumberFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		return
	}

	const min = nextData['min']?.value as number | undefined
	field.min = min

	const max = nextData['max']?.value as number | undefined
	field.max = max
}

function convertFormSelectField(field: FormSelectFieldTemplate | FormMultiSelectFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		field.selectArgs = []
		return
	}

	const options = nextData['select_options']?.value as FormExpansionFieldValue | undefined;
	if (!options) throw new Error("select field options not found");
	
	const values = (options.additional as [FormTextFieldData][] | undefined)?.map(([option]) => {
		const value = option.value ?? undefined;
		if (!value) throw new Error("select field option value not found");
		
		return value;
	}) ?? []

	field.selectArgs = values.map(value => ({
		value: convertLabelToID(value),
		display: value
	}))

	const next = nextData['next_fields']?.value as FormExpansionFieldValue | undefined;
	if (!next || !next.additional) return;

	field.nextArgs = (next.additional as [FormMultiSelectFieldData | undefined, FormExpansionFieldData | undefined][]).map(([optionsData, optionsNextData]) => {
		const options = optionsData?.value?.selections
		if (!options) throw new Error("select field next option selector empty or not found")

		const next = optionsNextData?.value?.additional?.map(field => {
			return convertFormField(field as FieldInitiatorData)
		})
		if (!next) throw new Error("select field next fields not found")

		return {
			options: options,
			next: next
		}
	})
}

function convertFormMultiSelectField(field: FormMultiSelectFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	return convertFormSelectField(field, nextData)
}

function convertFormExpansionField(field: FormExpansionFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		return
	}
	
	const incremental = nextData['expansion_incremental']?.value as FormSelectFieldValue | undefined
	field.incremental = incremental?.selection === 'yes'

	const prefix = nextData['expansion_prefix']?.value as string | undefined
	field.prefix = prefix

	const fixed = nextData['expansion_fixed']?.value as FormExpansionFieldValue | undefined
	field.fixed = fixed?.additional?.map(fixedRow => {
		const fields = (fixedRow[0] as FormExpansionFieldData).value?.additional
		if (!fields) throw new Error("expansion field fixed row fields empty or not found")

		return fields.map(field => {
			return convertFormField(field as FieldInitiatorData)
		})
	}) ?? []
}
