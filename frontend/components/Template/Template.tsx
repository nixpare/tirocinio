import { Updater, useImmer } from "use-immer"
import { FormTemplate, FormData, FormFieldSelectArgs, FormTextFieldData, FormSelectFieldData, FormTextFieldTemplate, FormSelectFieldTemplate } from "../../../models/Form"
import { Body } from "../../../models/Body"
import { Form } from "../Form/Form"
import { SelectArgsElement, walkObject } from "../../../models/Programmable";
import { AnatomStruct, AnatomStructData, AnatomStructDataContext } from "../../../models/AnatomStruct";
import { useEffect } from "react";
import { convertAnatomStruct } from "./conversion";
import { convertLabelToID } from "../../../models/conversion";

export function Template({ updateAnatomStruct }: {
	updateAnatomStruct: Updater<AnatomStruct | undefined>
}) {
	const [data, updateData] = useImmer<FormData>({
		templ: template,
		sections: {
			"anatom_struct": {
				"name_and_type": {
					"type": "expansion",
					"value": {
						"fixed": [
							[
								{
									"type": "text",
									"value": "Femore"
								},
								{
									"type": "select",
									"value": {
										"selection": "bone"
									}
								}
							]
						]
					}
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
															},
															"next_fields": {
																"type": "expansion",
																"value": {
																	"additional": [
																		[
																			{
																				"type": "multi-select",
																				"value": {
																					"selections": [
																						"a",
																						"b",
																						"c",
																						"d",
																						"e"
																					]
																				}
																			},
																			{
																				"type": "expansion",
																				"value": {
																					"additional": [
																						[
																							{
																								"type": "text",
																								"value": "Commenti"
																							},
																							{
																								"type": "select",
																								"value": {
																									"selection": "text",
																									"next": {
																										"multiline": {
																											"type": "select",
																											"value": {
																												"selection": "yes"
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
												}
											]
										]
									}
								}
							],
							[
								{
									"type": "text",
									"value": "Espansione"
								},
								{
									"type": "expansion",
									"value": {
										"additional": [
											[
												{
													"type": "text",
													"value": "Test Espansione"
												},
												{
													"type": "select",
													"value": {
														"selection": "expansion",
														"next": {
															"expansion_incremental": {
																"type": "select",
																"value": {
																	"selection": "yes"
																}
															},
															"expansion_prefix": {
																"type": "text",
																"value": "Pre"
															},
															"expansion_fixed": {
																"type": "expansion",
																"value": {
																	"additional": [
																		[
																			{
																				"type": "expansion",
																				"value": {
																					"additional": [
																						[
																							{
																								"type": "text",
																								"value": "Misura"
																							},
																							{
																								"type": "select",
																								"value": {
																									"selection": "fixed",
																									"next": {
																										"value": {
																											"type": "text",
																											"value": "Misura 1"
																										}
																									}
																								}
																							}
																						],
																						[
																							{
																								"type": "text",
																								"value": "Valore"
																							},
																							{
																								"type": "select",
																								"value": {
																									"selection": "number"
																								}
																							}
																						]
																					]
																				}
																			}
																		]
																	]
																}
															},
															"expansion_args": {
																"type": "expansion",
																"value": {
																	"additional": [
																		[
																			{
																				"type": "text",
																				"value": "Codice Misura"
																			},
																			{
																				"type": "select",
																				"value": {
																					"selection": "text"
																				}
																			}
																		],
																		[
																			{
																				"type": "text",
																				"value": "Nome Misura"
																			},
																			{
																				"type": "select",
																				"value": {
																					"selection": "text"
																				}
																			}
																		]
																	]
																}
															},
															"expansion_next": {
																"type": "expansion",
																"value": {
																	"additional": [
																		[
																			{
																				"type": "text",
																				"value": "Valore"
																			},
																			{
																				"type": "select",
																				"value": {
																					"selection": "number"
																				}
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
							],
							[
								{
									"type": "text",
									"value": "Metodo"
								},
								{
									"type": "expansion",
									"value": {
										"additional": [
											[
												{
													"type": "text",
													"value": "Test Metodo"
												},
												{
													"type": "select",
													"value": {
														"selection": "deduction",
														"next": {
															"deduction_id": {
																"type": "text",
																"value": "Fazekas (1982)"
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

	useEffect(() => {
		//console.log(data.sections)
		const anatomStruct = convertAnatomStruct(data)
		updateAnatomStruct(anatomStruct)
	}, [data])

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

export type FieldInitiatorData = [FormTextFieldData, FormSelectFieldData]
const fieldInitiator: [FormTextFieldTemplate, FormSelectFieldTemplate] = [
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
			},
			{
				value: 'expansion',
				display: 'Espansione'
			},
			{
				value: 'deduction',
				display: 'Metodo'
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
			},
			{
				options: ['expansion'],
				next: [
					{
						id: 'expansion_incremental',
						type: 'select',
						header: 'Incrementale?',
						selectArgs: [
							{ value: 'yes', display: 'Sì' },
							{ value: 'no', display: 'No' }
						]
					},
					{
						id: 'expansion_prefix',
						type: 'text',
						header: 'Prefisso?',
					},
					{
						id: 'expansion_fixed',
						type: 'expansion',
						header: 'Campi Fissati',
						incremental: true,
						expansionArgs: [
							{
								id: 'expansion_fixed_fields',
								type: 'expansion',
								header: 'Campi',
								expansionArgs: [] // Filled below because of recursive call
							}
						]
					},
					{
						id: 'expansion_args',
						type: 'expansion',
						header: 'Campi Aggiuntivi',
						expansionArgs: [], // Filled below because of recursive call
					},
					{
						id: 'expansion_next',
						type: 'expansion',
						header: 'Campi Successivi',
						expansionArgs: [] // Filled below because of recursive call
					}
				]
			},
			{
				options: ['deduction'],
				next: [
					{
						id: 'deduction_id',
						type: 'text',
						header: 'Nome metodo'
					}
				]
			},
		]
	}
]

//@ts-ignore
fieldInitiator[1].nextArgs[3].next[1].next[0].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[2].expansionArgs[0].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[3].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[4].expansionArgs = fieldInitiator

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
			value: convertLabelToID(value),
			display: value
		}))

	return values
}

const template: FormTemplate = {
	title: 'Template',
	sections: [
		{
			id: 'anatom_struct',
			title: 'Struttura Anatomica',
			starters: [
				{
					id: 'name_and_type',
					type: 'expansion',
					header: 'Nome e Tipo',
					fixed: [
						[
							{
								id: 'name',
								type: 'text',
								header: 'Nome'
							},
							{
								id: 'type',
								type: 'select',
								header: 'Tipo',
								selectArgs: [
									{ value: 'bone', display: 'Osso' },
									{ value: 'viscera', display: 'Viscera' },
									{ value: 'exterior', display: 'Esterno' }
								]
							}
						]
					]
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
