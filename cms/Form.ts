import { StrapiComponent, StrapiImage, validateObject, ValidateObjectResult } from "./Strapi"
import { rebuildStrapiCampoTree, StrapiCampo } from "./Field";
import { FormFieldTemplate, FormSectionTemplate, FormTemplate } from "../models/Form";
import { convertLabelToID } from "../models/conversion";
import { StrapiAnatomStruct } from "./AnatomStruct";
import { deeplog } from "./main";

export type StrapiSezione = StrapiComponent & {
	Nome: string
	Immagine: StrapiImage | null
	Campo: StrapiCampo[]
}

export function convertForm(doc: StrapiAnatomStruct): ValidateObjectResult<FormTemplate> {
	const form: Partial<FormTemplate> = {};

	form.title = doc.Nome;
	form.sections = doc.Sezioni.map<FormSectionTemplate>(sezione => {
		const [formSection, err] = convertFormSection(sezione);
		if (err) throw err;
		if (!formSection) throw new Error("an unexpected error has occurred at FormSectionTemplate");
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
	
	/* const [starters, err] = convertFormSectionStarters(doc.Campo);
	if (err) throw err;
	if (!starters) throw new Error("an unexpected error has occurred at FormSectionStarterTemplate[]");
	section.starters = starters; */
	section.starters = [];

	section.images = doc.Immagine ? [doc.Immagine.url] : undefined

	return validateObject(section, validateFormSection);
}

function validateFormSection(section: Partial<FormSectionTemplate>): section is FormSectionTemplate {
	if (section.id == undefined) throw new Error('id in FormSectionTemplate is not defined');
	if (section.title == undefined) throw new Error('title in FormSectionTemplate is not defined');
	if (section.starters == undefined) throw new Error('starters in FormSectionTemplate are not defined');

	return true;
}

export function convertFormSectionStarters(doc: StrapiCampo[]): ValidateObjectResult<Record<string, FormFieldTemplate>> {
	const starters: Record<string, Partial<FormFieldTemplate>> = {};

	const nodes = rebuildStrapiCampoTree(doc);
	deeplog(nodes);

	return [{}, undefined];
}
