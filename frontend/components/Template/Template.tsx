import { useImmer } from "use-immer"
import { FormTemplate, FormData, FormFieldTemplate, FormFieldSelectArgs, FormTextFieldData } from "../../../models/Form"
import { Body } from "../../../models/Body"
import { Form } from "../Form/Form"
import { SelectArgsElement, walkObject } from "../../../models/Programmable";
import { AnatomStructData, AnatomStructDataContext } from "../../../models/AnatomStruct";

export function Template() {
	const [data, updateData] = useImmer<FormData>({
		templ: template,
		sections: {
			"template": {
				"title": {
					"type": "text",
					"value": "Femore (Siding)"
				},
				"sections": {
					"type": "expansion",
					"value": {
						"additional": [
							[
								{
									"type": "text",
									"value": "Fusione, Sviluppo"
								},
								{
									"type": "expansion",
									"value": {
										"additional": [
											[
												{
													"type": "text",
													"value": "Centri di Ossificazione"
												},
												{
													"type": "select",
													"value": {
														"selection": "multi-select",
														"next": {
															"select_options": {
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

	/* useEffect(() => {
		console.log(data.sections)
	}, [data]) */

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

export const templateFieldScopeSelector: SelectArgsElement = {
	id: 'field_scope_selector_args',
	fn: fieldScopeSelectorArgs
}

const fieldInitiator: FormFieldTemplate[] = [
	{
		id: 'header',
		type: 'text',
		header: 'Intestazione'
	},
	{
		id: 'type',
		type: 'select',
		header: 'Tipo campo',
		selectArgs: [
			{
				value: 'fixed',
				display: 'Fisso',
			},
			{
				value: 'text',
				display: 'Testo',
			},
			{
				value: 'number',
				display: 'Numero',
			},
			{
				value: 'select',
				display: 'Selezione',
			},
			{
				value: 'multi-select',
				display: 'Multi-Selezione',
			}
		],
		nextArgs: [
			{
				options: ['fixed'],
				next: [
					{
						id: 'value',
						type: 'text',
						header: 'Valore'
					}
				]
			},
			{
				options: ['text'],
				next: [
					{
						id: 'multiline',
						type: 'select',
						header: 'Multilinea?',
						selectArgs: [
							{ value: 'yes', display: 'Sì' },
							{ value: 'no', display: 'No' }
						]
					}
				]
			},
			{
				options: ['number'],
				next: [
					{
						id: 'min',
						type: 'number',
						header: 'Minimo',
					},
					{
						id: 'max',
						type: 'number',
						header: 'Massimo',
					}
				]
			},
			{
				options: ['select', 'multi-select'],
				next: [
					{
						id: 'select_options',
						type: 'expansion',
						header: 'Opzioni',
						expansionArgs: [
							{
								id: 'value',
								type: 'text',
								header: 'Valore'
							}
						]
					},
					{
						id: 'next_fields',
						type: 'expansion',
						header: 'Prossimi Campi',
						expansionArgs: [
							{
								id: 'values',
								type: 'multi-select',
								header: 'Valori',
								selectArgs: templateFieldScopeSelector.id
							}
						],
						next: [
							{
								id: 'next_new_fields',
								type: 'expansion',
								header: 'Campi',
								expansionArgs: [] // Filled below because of recursive call
							}
						]
					}
				]
			}
		]
	}
]

//@ts-ignore
fieldInitiator[1].nextArgs[3].next[1].next[0].expansionArgs = fieldInitiator

function fieldScopeSelectorArgs(struct: AnatomStructData, _: Body, breadcrumb: string[]): FormFieldSelectArgs {
	const form = struct.form;

	const commonPath = breadcrumb.slice(0, breadcrumb.lastIndexOf('next_fields'))
	const commonObject = walkObject(form.sections, commonPath.join('.'))
	const fields = walkObject<FormTextFieldData[][]>(commonObject, 'select_options.value.additional')

	if (!fields) return []

	const values: FormFieldSelectArgs = fields
		.map(field => {
			return field[0].value as string
		})
		.filter(value => value != undefined)
		.map(value => ({
			value: value,
			display: value // TODO: fix
		}))

	console.log(values)

	return values
}

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
							id: 'new_fields',
							type: 'expansion',
							header: 'Campi iniziali',
							expansionArgs: fieldInitiator
						}
					]
				}
			]
		}
	]
}
