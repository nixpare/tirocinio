import { convertLabelToID, StrapiComponent, validateObject, ValidateObjectResult } from "./Strapi"
import { StrapiCampo } from "./Field";
import { FormSectionTemplate, FormTemplate } from "../models/Form";
import { StrapiAnatomStruct } from "./AnatomStruct";

export type StrapiSezione = StrapiComponent & {
	Nome: string
	Immagine: Object | null
	Campo: StrapiCampo[]
}

export function convertForm(doc: StrapiAnatomStruct): ValidateObjectResult<FormTemplate> {
	const form: Partial<FormTemplate> = {};

	form.title = doc.Nome;
	form.sections = doc.Sezioni.map<FormSectionTemplate>(sezione => {
		const [formSection, err] = convertFormSection(sezione);
		if (err) throw err;
		if (!formSection) throw new Error("an unexpected error has occurred at formSection");
		return formSection;
	})

	return validateObject(form, validateForm);
}

function validateForm(form: Partial<FormTemplate>): form is FormTemplate {
	if (form.title == undefined) throw new Error("title in FormTemplate is not defined");
	if (form.sections == undefined) throw new Error("sections in FormTemplate is not defined");
	
	return true;
}

export function convertFormSection(doc: StrapiSezione): ValidateObjectResult<FormSectionTemplate> {
	const section: Partial<FormSectionTemplate> = {};

	section.id = convertLabelToID(doc.Nome);
	section.title = doc.Nome;
	// TODO: section.starters
	// TODO: section.images

	return validateObject(section, validateFormSection);
}

function validateFormSection(section: Partial<FormSectionTemplate>): section is FormSectionTemplate {
	if (section.id == undefined) throw new Error('id in FormSectionTemplate is not defined');
	if (section.title == undefined) throw new Error('title in FormSectionTemplate is not defined');

	// TODO: check section.starters

	return true;
}
