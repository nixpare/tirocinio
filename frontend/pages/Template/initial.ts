import { FormSectionData } from "../../../models/Form";

const initialSections: Record<string, FormSectionData> = {
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
export default initialSections;