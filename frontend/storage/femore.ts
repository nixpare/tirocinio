import { FormFieldGenericSelectTemplate, FormFieldTemplate } from "../../models/Form";
import { DeductionElement, DeductionResult } from "../../models/Programmable";
import { Bone } from "../../models/AnatomStruct";

const femoreCentriImg = '/images/femore_centri.png'
const femoreSettoriImg = '/images/femore_settori.png'
const femoreMetricheImg = '/images/femore_metriche.png'

const caratteriNonMetriciNext: FormFieldTemplate = {
	id: 'Stato',
	type: 'select',
	header: 'Stato',
	selectArgs: [
		{ value: 'assente', display: 'Assente' },
		{ value: 'non_valutabile', display: 'Non valutabile' },
		{ value: 'presente', display: 'Presente' }
	]
}

const profiloMetodiSessoArgs: FormFieldGenericSelectTemplate = {
	selectArgs: [
		{ value: 'approccio_metrico', display: 'Approccio metrico' },
		{ value: 'approccio_morfologico', display: 'Approccio morfologico' }
	],
	nextArgs: [
		{
			options: ['approccio_metrico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					fixed: [
						[
							{ id: 'Metodo', type: 'fixed', header: 'Metodo', value: 'Purkait (2003)' },
							{ id: 'Esito', type: 'deduction', header: 'Esito', deductionID: 'femore_purkait_2003' }
						]
					],
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{
							id: 'Esito',
							type: 'select',
							header: 'Esito',
							selectArgs: [
								{ value: 'm', display: 'M' },
								{ value: 's', display: 'S' },
								{ value: 'incerto', display: 'Incerto' },
								{ value: 'nd', display: 'N/D' }
							]
						}
					]
				}
			]
		},
		{
			options: ['approccio_morfologico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{
							id: 'Esito',
							type: 'select',
							header: 'Esito',
							selectArgs: [
								{ value: 'm', display: 'M' },
								{ value: 's', display: 'S' },
								{ value: 'incerto', display: 'Incerto' },
								{ value: 'nd', display: 'N/D' }
							]
						}
					]
				}
			]
		}
	]
}

const profiloMetodiMorteSubadultoArgs: FormFieldGenericSelectTemplate = {
	selectArgs: [
		{
			value: 'approccio_metrico',
			display: 'Approccio metrico',
		},
		{
			value: 'approccio_morfologico',
			display: 'Approccio morfologico',
		}
	],
	nextArgs: [
		{
			options: ['approccio_metrico'],
			next: [
				{ id: 'Metodo', type: 'fixed', header: 'Nome metodo', value: 'Fazekas (1978)' },
				{ id: 'Esito', type: 'deduction', header: 'Esito', deductionID: 'femore_fusione_fazekas_1978' }
			]
		},
		{
			options: ['approccio_morfologico'],
			next: [
				{ id: 'Metodo', type: 'fixed', header: 'Nome metodo', value: 'Scheuer & Black 2000' },
				{ id: 'Esito', type: 'deduction', header: 'Esito generale', deductionID: 'femore_scheuer_&_black_2000' }
			]
		},
		{
			options: ['approccio_metrico', 'approccio_morfologico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{ id: 'Esito', type: 'text', header: 'Esito' }
					]
				}
			]
		}
	]
}

const profiloMetodiMorteAdultoArgs: FormFieldGenericSelectTemplate = {
	selectArgs: [
		{
			value: 'approccio_metrico',
			display: 'Approccio metrico',
		},
		{
			value: 'approccio_morfologico',
			display: 'Approccio morfologico',
		}
	],
	nextArgs: [
		{
			options: ['approccio_metrico', 'approccio_morfologico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{ id: 'Esito', type: 'text', header: 'Esito' }
					]
				}
			]
		}
	]
}

const profiloMetodiOrigineGeoArgs: FormFieldGenericSelectTemplate = {
	selectArgs: [
		{
			value: 'approccio_metrico',
			display: 'Approccio metrico',
		},
		{
			value: 'approccio_morfologico',
			display: 'Approccio morfologico',
		}
	],
	nextArgs: [
		{
			options: ['approccio_metrico'],
			next: [
				{ id: 'Metodo', type: 'fixed', header: 'Nome metodo', value: 'Fordisc' },
				{ id: 'Esito', type: 'deduction', header: 'Esito', deductionID: 'femore_fordisc' }
			]
		},
		{
			options: ['approccio_metrico', 'approccio_morfologico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{ id: 'Esito', type: 'text', header: 'Esito' }
					]
				}
			]
		}
	]
}

const profiloMetodiStaturaArgs: FormFieldGenericSelectTemplate = {
	selectArgs: [
		{
			value: 'approccio_metrico',
			display: 'Approccio metrico',
		},
		{
			value: 'approccio_morfologico',
			display: 'Approccio morfologico',
		}
	],
	nextArgs: [
		{
			options: ['approccio_metrico'],
			next: [
				{ id: 'Metodo', type: 'fixed', header: 'Nome metodo', value: 'Wilson (2010)' },
				{ id: 'Esito', type: 'deduction', header: 'Esito', deductionID: 'femore_wilson_2010' }
			]
		},
		{
			options: ['approccio_metrico', 'approccio_morfologico'],
			next: [
				{
					id: 'Metodo',
					type: 'expansion',
					header: 'Metodo',
					expansionArgs: [
						{ id: 'Metodo', type: 'text', header: 'Nome metodo (anno)' },
						{ id: 'Esito', type: 'number', header: 'Esito (cm)', min: 0, max: 250 }
					]
				}
			]
		}
	]
}

export const femore: Bone = {
	type: 'bone',
	name: 'Femore',
	form: {
		title: "Femore (Siding)",
		sections: [
			{
				id: 'fusione',
				title: "Fusione, Sviluppo",
				images: [femoreCentriImg],
				starters: [
					{
						id: 'centri',
						type: 'multi-select',
						header: 'Centri di Ossificazione',
						selectArgs: [
							{ value: 'a', display: 'A' },
							{ value: 'b', display: 'B' },
							{ value: 'c', display: 'C' },
							{ value: 'd', display: 'D' },
							{ value: 'e', display: 'E' },
						],
						nextArgs: [
							{
								options: ['a'],
								next: [
									{
										id: 'Stato',
										type: 'select',
										header: 'Stato',
										selectArgs: [
											{
												value: 'assente_per_immaturità',
												display: 'Assente per Immaturità',
											},
											{
												value: 'assente_per_tafonomia',
												display: 'Assente per Tafonomia',
											},
											{
												value: 'assente_non_valutabile',
												display: 'Assente non valutabile',
											},
											{
												value: 'presente_fusione_non_valutabile',
												display: 'Presente ma fusione non valutabile',
											},
											{
												value: 'presente_non_fuso',
												display: 'Presente non fuso',
											},
											{
												value: 'presente_in_fusione',
												display: 'Presente in fusione',
											},
											{
												value: 'presente_fuso',
												display: 'Presente fuso',
											}
										],
										nextArgs: [
											{
												options: ['presente_non_fuso'],
												next: [
													{
														id: 'Lunghezza massima (mm)',
														type: 'number',
														header: 'Lunghezza massima (mm)'
													},
													{
														id: 'Fazekas (1978)',
														type: 'deduction',
														header: 'Fazekas (1978)',
														deductionID: 'femore_fusione_fazekas_1978'
													}
												]
											}
										]
									}
								]
							},
							{
								options: ['b', 'c', 'd', 'e'],
								next: [
									{
										id: 'Stato',
										type: 'select',
										header: 'Stato',
										selectArgs: [
											{ value: 'assente_per_immaturità', display: 'Assente per Immaturità' },
											{ value: 'assente_per_tafonomia', display: 'Assente per Tafonomia' },
											{ value: 'assente_non_valutabile', display: 'Assente non valutabile' },
											{ value: 'presente_fusione_non_valutabile', display: 'Presente ma fusione non valutabile' },
											{ value: 'presente_non_fuso', display: 'Presente non fuso' },
											{ value: 'presente_in_fusione', display: 'Presente in fusione' },
											{ value: 'presente_fuso', display: 'Presente fuso' }
										]
									}
								]
							},
							{
								options: ['a', 'b', 'c', 'd', 'e'],
								next: [
									{
										id: 'Commenti',
										type: 'text',
										header: 'Commenti',
										multiline: true
									}
								]
							}
						]
					}
				]
			},
			{
				id: 'completezza',
				title: "Completezza, qualità, colore generale",
				images: [femoreSettoriImg],
				starters: [
					{
						id: 'settori',
						type: 'multi-select',
						header: 'Settori',
						selectArgs: [
							{ value: '1', display: '1' },
							{ value: '2', display: '2' },
							{ value: '3', display: '3' },
							{ value: '4', display: '4' },
							{ value: '5', display: '5' },
							{ value: '6', display: '6' },
							{ value: '7', display: '7' },
							{ value: '8', display: '8' },
							{ value: '9', display: '9' },
							{ value: '10', display: '10' },
							{ value: '11', display: '11' }
						],
						nextArgs: [
							{
								options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
								next: [
									{
										id: 'Qualità',
										type: 'select',
										header: 'Qualità',
										selectArgs: [
											{ value: '1-25', display: '1 (1% - 25%)' },
											{ value: '26-50', display: '2 (26% - 50%)' },
											{ value: '51-75', display: '3 (51% - 75%)' },
											{ value: '76-99', display: '4 (76% - 99%)' },
											{ value: 'completo', display: 'Completo (100%)' },
											{ value: 'completo_ma_frammentario', display: 'Completo ma frammentario (100%)' }
										]
									},
									{
										id: 'Quantità',
										type: 'select',
										header: 'Quantità',
										selectArgs: [
											{ value: '0', display: '0% of sound cortical surface' },
											{ value: '1-24', display: '1-24% of sound cortical surface' },
											{ value: '25-49', display: '25-49% of sound cortical surface' },
											{ value: '50-74', display: '50-74% of sound cortical surface' },
											{ value: '75-99', display: '75-99% of sound cortical surface' },
											{ value: '100', display: '100% of sound cortical surface' }
										]
									},
									{
										id: 'Colore',
										type: 'select',
										header: 'Colore',
										selectArgs: [
											{ value: 'marrone_marrone_scuro', display: 'Da marrone a marrone scuro' },
											{ value: 'grigio', display: 'Grigio' },
											{ value: 'naturale', display: 'Naturale' },
											{ value: 'arancione_marrone', display: 'Da arancione a marrone' },
											{ value: 'giallo_arancione', display: 'Da giallo ad arancione' },
										]
									},
									{
										id: 'Commenti',
										type: 'text',
										header: 'Commenti'
									}
								]
							}
						]
					},
					{
						type: 'select',
						id: 'colore_generale',
						header: 'Colore Generale',
						selectArgs: [
							{ value: 'marrone_marrone_scuro', display: 'Da marrone a marrone scuro' },
							{ value: 'grigio', display: 'Grigio' },
							{ value: 'naturale', display: 'Naturale' },
							{ value: 'arancione_marrone', display: 'Da arancione a marrone' },
							{ value: 'giallo_arancione', display: 'Da giallo ad arancione' },
						]
					},
					{
						type: 'expansion',
						id: 'frammenti',
						header: 'Frammenti minori di 2 cm',
						incremental: true,
						expansionArgs: [
							{
								id: 'Settore di appartenenza',
								type: 'select',
								header: 'Settore di appartenenza',
								selectArgs: [
									{ value: '1', display: '1' },
									{ value: '2', display: '2' },
									{ value: '3', display: '3' },
									{ value: '4', display: '4' },
									{ value: '5', display: '5' },
									{ value: '6', display: '6' },
									{ value: '7', display: '7' },
									{ value: '8', display: '8' },
									{ value: '9', display: '9' },
									{ value: '10', display: '10' },
									{ value: '11', display: '11' },
									{ value: '12', display: 'N/D' },
								]
							},
							{
								id: 'Colore',
								type: 'select',
								header: 'Colore',
								selectArgs: [
									{ value: 'marrone_marrone_scuro', display: 'Da marrone a marrone scuro' },
									{ value: 'grigio', display: 'Grigio' },
									{ value: 'naturale', display: 'Naturale' },
									{ value: 'arancione_marrone', display: 'Da arancione a marrone' },
									{ value: 'giallo_arancione', display: 'Da giallo ad arancione' },
								]
							}
						]
					}
				]
			},
			{
				id: 'caratteri_metrici',
				title: "Caratteri metrici",
				images: [femoreMetricheImg],
				starters: [
					{
						type: 'expansion',
						id: 'caratteri_metrici',
						fixed: [
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '75' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Lunghezza massima' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '76' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Lunghezza bicondirale' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '77' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Larghezza epicondirale' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '78' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Massimo diametro della testa' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '79' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Diametro trasverso subtrocanterico' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '80' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Diametro subtrocanterico antero-posteriore' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '81' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Diametro massimo a metà diafasi' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '82' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Diametro minimo a metà diafasi' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '83' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Circonferenza a metà diafasi' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '84' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Lunghezza antero-posteriore massima del condilo laterale' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							],
							[
								{ id: 'Codice Misura', type: 'fixed', header: 'Codice Misura', value: '85' },
								{ id: 'Nome Misura', type: 'fixed', header: 'Nome Misura', value: 'Lunghezza antero-posteriore massima del condilo mediale' },
								{ id: 'Misura (mm)', type: 'number', header: 'Misura (mm)' }
							]
						],
						expansionArgs: [
							{
								id: 'Codice Misura',
								type: 'text',
								header: 'Codice Misura'
							},
							{
								id: 'Nome Misura',
								type: 'text',
								header: 'Nome Misura'
							}
						],
						next: [
							{
								id: 'Misura (mm)',
								type: 'number',
								header: 'Misura (mm)'
							}
						]
					}
				]
			},
			{
				id: 'caratteri_non_metrici',
				title: "Caratteri non metrici",
				images: [femoreSettoriImg],
				starters: [
					{
						type: 'expansion',
						id: 'caratteri_non_metrici',
						fixed: [
							[{ id: 'Nome carattere', type: 'fixed', header: 'Nome carattere', value: 'Fossa di Allen' }, caratteriNonMetriciNext],
							[{ id: 'Nome carattere', type: 'fixed', header: 'Nome carattere', value: 'Faccetta di Poirier' }, caratteriNonMetriciNext],
							[{ id: 'Nome carattere', type: 'fixed', header: 'Nome carattere', value: 'Placca III trocantere' }, caratteriNonMetriciNext],
							[{ id: 'Nome carattere', type: 'fixed', header: 'Nome carattere', value: 'Fossa subtrocanterica' }, caratteriNonMetriciNext]
						],
						expansionArgs: [
							{
								id: 'Nome Carattere',
								type: 'text',
								header: 'Nome Carattere'
							}
						],
						next: [caratteriNonMetriciNext]
					}
				]
			},
			{
				id: 'profilo_biologico',
				title: "Profilo biologico",
				images: [femoreSettoriImg],
				starters: [
					{
						type: 'multi-select',
						id: 'diagnosi_sesso_biologico',
						header: 'Diagnosi di sesso biologico',
						...profiloMetodiSessoArgs
					},
					{
						type: 'multi-select',
						id: 'stima_età_alla_morte_subadulto',
						header: 'Stima dell\'età alla morte (subadulto)',
						...profiloMetodiMorteSubadultoArgs,
					},
					{
						type: 'multi-select',
						id: 'stima_età_alla_morte_adulto',
						header: 'Stima dell\'età alla morte (adulto)',
						...profiloMetodiMorteAdultoArgs,
					},
					{
						type: 'multi-select',
						id: 'diagnosi_origine_biogeografica',
						header: 'Diagnosi di origine biogeografica',
						...profiloMetodiOrigineGeoArgs,
					},
					{
						type: 'multi-select',
						id: 'stima_statura',
						header: 'Stima della statura',
						...profiloMetodiStaturaArgs,
					}
				]
			}
		]
	}
}

export const femoreFusioneFazekas1978: DeductionElement = {
	id: 'femore_fusione_fazekas_1978',
	fn: FemoreFusioneFazekas1978
}

function FemoreFusioneFazekas1978(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const femorePurkait2003: DeductionElement = {
	id: 'femore_purkait_2003',
	fn: FemorePurkait2003
}

function FemorePurkait2003(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const femoreProfiloFazekas1978: DeductionElement = {
	id: 'femore_profilo_fazekas_1978',
	fn: FemoreProfiloFazekas1978
}

function FemoreProfiloFazekas1978(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const femoreScheuerBlack2000: DeductionElement = {
	id: 'femore_scheuer_&_black_2000',
	fn: FemoreScheuerBlack2000
}

function FemoreScheuerBlack2000(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const femoreFordisc: DeductionElement = {
	id: 'femore_fordisc',
	fn: FemoreFordisc
}

function FemoreFordisc(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const femoreWilson2010: DeductionElement = {
	id: 'femore_wilson_2010',
	fn: FemoreWilson2010
}

function FemoreWilson2010(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}
