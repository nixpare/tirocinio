import { AnatomStruct } from "../../../models/AnatomStruct"
import { convertLabelToID, isAnatomStructType, isFormFieldType } from "../../../models/conversion"
import { FormData, FormDeductionFieldTemplate, FormExpansionFieldData, FormExpansionFieldTemplate, FormFieldData, FormFieldGroupData, FormFieldTemplate, FormFixedFieldTemplate, FormMultiSelectFieldData, FormMultiSelectFieldTemplate, FormNumberFieldTemplate, FormSectionTemplate, FormSelectFieldData, FormSelectFieldTemplate, FormSelectFieldValue, FormTextFieldData, FormTextFieldTemplate } from "../../../models/Form"
import { FieldInitiatorsType } from "./Template"

export function convertAnatomStruct(form: FormData): AnatomStruct {
	const nameAndType = form.sections?.anatom_struct?.name_and_type as FormFieldGroupData | undefined
	if (!nameAndType) throw new Error("name and type object not found")

	const name = (nameAndType.value?.['name'] as FormTextFieldData)?.value ?? undefined
	if (!name) throw new Error("name not found")

	const type = (nameAndType.value?.['type'] as FormSelectFieldData)?.value?.selection ?? undefined
	if (!type) throw new Error("type not found")

	if (!isAnatomStructType(type)) throw new Error(`type ${type} is not valid`);

	const sections = nameAndType.nextAnyValue?.sections ?? []

	const anatomStruct: AnatomStruct = {
		type: type,
		name: name,
		form: {
			title: name,
			sections: convertFormSections(sections as FormExpansionFieldData)
		},
		templateDate: new Date(),
		updatedAt: new Date()
	}

	return anatomStruct
}

function convertFormSections(sections: FormExpansionFieldData): FormSectionTemplate[] {
	return sections.value?.map<FormSectionTemplate>(section => {
		const [titleField, startersField] = [section[0], section[1]] as [FormTextFieldData | undefined, FormExpansionFieldData | undefined]

		const title = titleField?.value ?? undefined
		if (!title) throw new Error("section title not found")

		const starters = startersField?.value?.map(starter => {
			// @ts-ignore
			return starter[0] && convertFormField(starter[0] as FormFieldGroupData)
		}) ?? []

		return {
			id: convertLabelToID(title),
			title: title,
			starters: starters
		}
	}) ?? []
}

function convertFormField(data: FormFieldGroupData): FormFieldTemplate {
	const header = (data.value?.header as FormTextFieldData).value ?? undefined
	if (!header) throw new Error("field header not found")

	const typeData = data.value?.type as FormSelectFieldData | undefined
	const type = typeData?.value?.selection ?? undefined
	if (!typeData || !type) throw new Error("field type not found")

	if (!isFormFieldType(type)) throw new Error(`field type ${type} is not a valid type`)

	const field: FormFieldTemplate = {
		id: convertLabelToID(header),
		header: header,
		type: type
	}

	const next = typeData.value?.next

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
		case "deduction":
			convertFormDeductionField(field as FormDeductionFieldTemplate, next);
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

	const options = nextData['select_options']?.value as [FormTextFieldData][] | undefined;
	if (!options) throw new Error("select field options not found");

	const values = options?.map(([option]) => {
		const value = option.value ?? undefined;
		if (!value) throw new Error("select field option value not found");

		return value;
	}) ?? []

	field.selectArgs = values.map(value => ({
		value: convertLabelToID(value),
		display: value
	}))

	const next = nextData['select_options'].nextAnyValue?.next_fields as FormExpansionFieldData | undefined;
	if (!next || !next.value) return;

	field.nextArgs = (next.value as [FormMultiSelectFieldData | undefined][]).map(([optionsData]) => {
		const options = optionsData?.value?.selections
		if (!options) throw new Error("select field next option selector empty or not found")

		const optionsNextData = optionsData?.nextAnyValue?.['next_new_fields'] as FormExpansionFieldData | undefined
		const next = optionsNextData?.value?.map(field => {
			return convertFormField(field[0] as FormFieldGroupData)
		}) ?? []
		//if (!next) throw new Error("select field next fields not found")

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

	const args = nextData['expansion_args']?.value as FormExpansionFieldValue | undefined
	field.expansionArgs = args?.additional?.map(field => {
		return convertFormField(field as FieldInitiatorData)
	}) ?? []

	const next = nextData['expansion_next']?.value as FormExpansionFieldValue | undefined
	field.next = next?.additional?.map(field => {
		return convertFormField(field as FieldInitiatorData)
	}) ?? []
}

function convertFormDeductionField(field: FormDeductionFieldTemplate, nextData: Record<string, FormFieldData> | undefined) {
	if (!nextData) {
		return
	}

	const value = nextData['deduction_id']?.value as string | undefined
	if (!value) throw new Error("deduction method id not found")
	field.deductionID = value
}
