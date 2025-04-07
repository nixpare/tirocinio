import { useImmer } from "use-immer"
import { FormTemplate, FormData, FormFieldTemplate, FormSelectFieldTemplate, FormFieldSelectArgs, FormExpansionFieldTemplate, FormSelectFieldData } from "../../../models/Form"
import { Body } from "../../../models/Body"
import { Form } from "../Form/Form"
import { SelectArgsElement, walkObject } from "../../../models/Programmable";
import { AnatomStructData, AnatomStructDataContext } from "../../../models/AnatomStruct";

export function Template() {
	const [data, updateData] = useImmer<FormData>({
		templ: template,
		sections: {
			"template": {
				"sections": {
					"type": "expansion",
					"value": {
						"additional": [
							[
								{
									"type": "text",
									"value": "Fuzione e Sviluppo"
								},
								{
									"type": "expansion",
									"value": {
										"additional": [
											[
												{
													"type": "select",
													"value": {
														"selection": "standard",
														"next": {
															"header": {
																"type": "text",
																"value": "Nuclei di Ossificazione"
															},
															"type": {
																"type": "select",
																"value": {
																	"selection": "select",
																	"next": {
																		"options": {
																			"type": "expansion",
																			"value": {
																				"additional": [
																					[
																						{
																							"type": "text",
																							"value": "A"
																						}
																					],
																					[
																						{
																							"type": "text",
																							"value": "B"
																						}
																					],
																					[
																						{
																							"type": "text",
																							"value": "C"
																						}
																					],
																					[
																						{
																							"type": "text",
																							"value": "D"
																						}
																					],
																					[
																						{
																							"type": "text",
																							"value": "E"
																						}
																					]
																				]
																			}
																		}
																	}
																}
															}
														}
													}
												}
											]
										]
									}
								}
							]
						]
					}
				}
			}
		}
	});

	return (
		<AnatomStructDataContext.Provider
			//@ts-ignore
			value={{form: data}}
		>
			<Form
				form={data}
				update={updateData}
				initialEditMode={true}
			/>
		</AnatomStructDataContext.Provider>
	)
}

const fieldInitiator: Record<string, FormFieldTemplate> = {
	'header': {
		id: 'header',
		type: 'text',
		header: 'Intestazione'
	},
	'type': {
		id: 'type',
		type: 'select',
		header: 'Tipo campo',
		selectArgs: {
			'fixed': {
				value: 'fixed',
				display: 'Fisso',
				next: {
					'value': {
						id: 'value',
						type: 'text',
						header: 'Valore'
					}
				}
			},
			'text': {
				value: 'text',
				display: 'Testo',
				next: {
					'multiline': {
						id: 'multiline',
						type: 'select',
						header: 'Multilinea?',
						selectArgs: {
							'yes': { value: 'yes', display: 'Sì' },
							'no': { value: 'no', display: 'No' }
						}
					}
				}
			},
			'number': {
				value: 'number',
				display: 'Numero',
				next: {
					'min': {
						id: 'min',
						type: 'number',
						header: 'Minimo',
					},
					'max': {
						id: 'max',
						type: 'number',
						header: 'Massimo',
					}
				}
			},
			'select': {
				value: 'select',
				display: 'Selezione',
				next: {
					'options': {
						id: 'options',
						type: 'expansion',
						header: 'Opzioni',
						expansionArgs: [
							{
								id: 'value',
								type: 'text',
								header: 'Valore'
							}
						],
						next: [
							{
								id: 'next',
								header: 'Prossimi campi',
								type: 'expansion',
								expansionArgs: [] // Filled below for circular dependency
							}
						]
					}
				}
			},
			'multi-select': {
				value: 'multi-select',
				display: 'Multi-Selezione',
				next: {
					'options': {
						id: 'options',
						type: 'expansion',
						header: 'Opzioni',
						expansionArgs: [
							{
								id: 'value',
								type: 'text',
								header: 'Valore'
							}
						],
						next: [
							{
								id: 'next',
								header: 'Prossimi campi',
								type: 'expansion',
								expansionArgs: [] // Filled below for circular dependency
							}
						]
					}
				}
			}
		}
	}
}

export const templateFieldScopeSelector: SelectArgsElement = {
	id: 'field_scope_selector_args',
	fn: fieldScopeSelectorArgs
}

const fieldScopeSelector: FormSelectFieldTemplate = {
	id: 'field_scope',
	header: 'Scope',
	type: 'select',
	selectArgs: templateFieldScopeSelector.id
}

function fieldScopeSelectorArgs(struct: AnatomStructData, _: Body, breadcrumb: string[]): FormFieldSelectArgs {
	const form = struct.form;
	console.log(form.sections, breadcrumb)

	const dependency = breadcrumb.slice(0, breadcrumb.indexOf('add-input'))
	const fields = walkObject<FormSelectFieldData[][]>(struct.form.sections, `${dependency.join('.') }.value.additional`)
	if (!fields) return {}

	console.log(fields)

	return {}
	/* const nSegni = walkObject<number>(struct.form.sections, 'lesività.lesività_segni.value.additional.length')
	if (nSegni == undefined)
		return {}

	const [lesività] = struct.form.templ.sections.filter(section => section.id == 'lesività')
	const [segni] = lesività.starters.filter(field => field.starterID == 'lesività_segni')
	const prefix = (segni as FormExpansionFieldTemplate).prefix ?? ''

	const result: FormFieldSelectArgs = {}
	for (let i = 0; i < nSegni; i++) {
		const key = prefix + (i + 1)
		result[key] = { display: key }
	}

	return result */
}

const newFieldsTemplate: FormExpansionFieldTemplate = {
	id: 'new_fields',
	type: 'expansion',
	header: 'Nuovi Campi',
	expansionArgs: [
		{
			id: 'new_field',
			type: 'select',
			header: 'Nuovo Campo',
			selectArgs: {
				'standard': {
					value: 'standard',
					display: 'Standard',
					next: fieldInitiator
				},
				'extended': {
					value: 'extended',
					display: 'Esteso',
					next: {
						[fieldScopeSelector.id]: fieldScopeSelector,
						...fieldInitiator
					}
				}
			}
		}
	]
}

//@ts-ignore
fieldInitiator['type'].selectArgs['select'].next['options'].next[0].expansionArgs = [newFieldsTemplate]
//@ts-ignore
fieldInitiator['type'].selectArgs['multi-select'].next['options'].next[0].expansionArgs = [newFieldsTemplate]

const template: FormTemplate = {
	title: 'Template',
	sections: [
		{
			id: 'template',
			title: 'Template',
			starters: [
				{
					id: 'title',
					type: 'text',
					header: 'Titolo'
				},
				{
					id: 'sections',
					type: 'expansion',
					header: 'Sezioni',
					expansionArgs: [
						{
							id: 'title',
							type: 'text',
							header: 'Titolo Sezione',
						}
					],
					next: [
						{
							...newFieldsTemplate,
							header: 'Campi iniziali',
						}
					]
				}
			]
		}
	]
}
