import { FormSectionData } from "../../../models/Form";

export const initialSections: Record<string, FormSectionData> = {
	"anatom_struct": {
		"name_and_type": {
			"type": "group",
			"value": {
				"name": {
					"type": "text",
					"value": "Femore"
				},
				"type": {
					"type": "select",
					"value": {
						"selection": "bone"
					}
				}
			},
			"nextAnyValue": {
				"sections": {
					"type": "expansion",
					"value": [
						[
							{
								"type": "text",
								"value": "Metriche"
							},
							{
								"type": "expansion",
								"value": [
									[
										{
											"type": "group",
											"value": {
												"header": {
													"type": "text",
													"value": "Select Test"
												},
												"type": {
													"type": "select",
													"value": {
														"selection": "select",
														"next": {
															"select_options": {
																"type": "expansion",
																"value": [
																	[
																		{
																			"type": "text",
																			"value": "1"
																		}
																	]
																],
																"nextAnyValue": {
																	"next_fields": {
																		"type": "expansion",
																		"value": [
																			[
																				{
																					"type": "multi-select",
																					"value": {
																						"selections": [
																							"1"
																						]
																					},
																					"nextAnyValue": {
																						"next_new_fields": {
																							"type": "expansion",
																							"value": [
																								[
																									{
																										"type": "group",
																										"value": {
																											"header": {
																												"type": "text",
																												"value": "A"
																											},
																											"type": {
																												"type": "select",
																												"value": {
																													"selection": "text"
																												}
																											}
																										}
																									}
																								]
																							]
																						}
																					}
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
						]
					]
				}
			}
		}
	}
}
