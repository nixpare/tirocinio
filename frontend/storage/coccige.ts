import { DeductionElement, DeductionResult } from "../models/Programmable";
import { FormSelectFieldTemplate, FormFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";

const coccigeNucleiImg = '/images/coccige_nuclei.png'
const coccigeSettoriImg = '/images/coccige_settori.png'

const nextNuclei: FormSelectFieldTemplate = {
	type: 'select',
	header: 'Stato',
	selectArgs: {
		'assente_per_immaturità': {
			display: 'Assente per Immaturità',
			next: [{ type: 'text', header: 'Commenti' }]
		},
		'assente_per_tafonomia': {
			display: 'Assente per Tafonomia',
			next: [{ type: 'text', header: 'Commenti' }]
		},
		'assente_non_valutabile': {
			display: 'Assente non valutabile',
			next: [{ type: 'text', header: 'Commenti' }]
		},
		'presente': {
			display: 'Presente',
			next: [{ type: 'text', header: 'Commenti' }]
		}
	}
}

const nextSettori: FormFieldTemplate[] = [
	{
		type: 'select',
		header: 'Presenza/assenza',
		selectArgs: {
			'assente': { display: 'Assente' },
			'presente': { display: 'Presente' }
		}
	},
	{
		type: 'select',
		header: 'Qualità',
		selectArgs: {
			'1-25': { display: '1 (1% - 25%)' },
			'26-50': { display: '2 (26% - 50%)' },
			'51-75': { display: '3 (51% - 75%)' },
			'76-99': { display: '4 (76% - 99%)' },
			'completo': { display: 'Completo (100%)' },
			'completo_ma_frammentario': { display: 'Completo ma frammentario (100%)' }
		}
	},
	{
		type: 'select',
		header: 'Quantità',
		selectArgs: {
			'0': { display: '0% of sound cortical surface' },
			'1-24': { display: '1-24% of sound cortical surface' },
			'25-49': { display: '25-49% of sound cortical surface' },
			'50-74': { display: '50-74% of sound cortical surface' },
			'75-99': { display: '75-99% of sound cortical surface' },
			'100': { display: '100% of sound cortical surface' }
		}
	},
	{
		type: 'select',
		header: 'Colore',
		selectArgs: {
			'marrone_marrone_scuro': { display: 'Da marrone a marrone scuro' },
			'grigio': { display: 'Grigio' },
			'naturale': { display: 'Naturale' },
			'arancione_marrone': { display: 'Da arancione a marrone' },
			'giallo_arancione': { display: 'Da giallo ad arancione' },
		}
	},
	{
		type: 'text',
		header: 'Commenti'
	}
]

const profiloBiologicoApprocciArgs: FormFieldTemplate[] = [
	{
		type: 'select',
		header: 'Approccio',
		selectArgs: {
			'metrico': { display: 'Metrico' },
			'morfologico': { display: 'Morfologico' },
			'altro': {
				display: 'Altro',
				next: [{ type: 'text', header: 'Nome dell\'approccio' }]
			}
		}
	},
	{
		type: 'text',
		header: 'Nome metodo (anno)'
	},
	{
		type: 'text',
		header: 'Scoring'
	}
]

const patologieSegniNextArgs: FormFieldTemplate[] = [
	{
		type: 'multi-select',
		selectArgs: {
			'perdita_sostanza': {
				display: 'Perdita di sostanza',
				next: [{
					type: 'select',
					selectArgs: {
						'porosità': {
							display: 'Porosità',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'lesione_osteolitica': {
							display: 'Lesione Osteolitica',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'lesioni_cribiotiche': {
							display: 'Lesioni Cribiotiche',
							next: [
								{
									type: 'deduction',
									header: 'Rinaldo (2019)',
									deductionID: 'coccige_rinaldo_2019'
								},
								{
									type: 'text',
									header: 'Descrizione'
								}
							]
						},
						'sospetta_lesività': {
							display: 'Sospetta Lesività',
							next: [
								{
									type: 'select',
									header: 'Dimensioni',
									selectArgs: {
										'<2cm': { display: 'Fino a 2 cm' },
										'2<5cm': { display: '2 - 5 cm' },
										'5<10cm': { display: '5 - 10 cm' },
										'>10cm': { display: 'Più di 10 cm' }
									}
								},
								{
									type: 'select',
									header: 'Margini',
									selectArgs: {
										'rimodellati': { display: 'Rimodellati' },
										'non_rimodellati': { display: 'Non rimodellati' }
									}
								},
								{
									type: 'select',
									header: 'Forma',
									selectArgs: {
										'regolare': { display: 'Regolare' },
										'irregolare': { display: 'Irregolare' }
									}
								},
								{
									type: 'text',
									header: 'Descrizione'
								}
							]
						},
						'eburneazione': {
							display: 'Eburneazione',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'eburneazione_sclerotica': {
							display: 'Eburneazione Sclerotica',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
					}
				}]
			},
			'proliferativi': {
				display: 'Proliferativi',
				next: [{
					type: 'select',
					selectArgs: {
						'periostite': {
							display: 'Periostite',
							next: [
								{
									type: 'select',
									selectArgs: {
										'recente': { display: 'Recente', next: [{ type: 'text', header: 'Descrizione' }] },
										'rimodellata': { display: 'Rimodellata', next: [{ type: 'text', header: 'Descrizione' }] },
										'mista': { display: 'Mista', next: [{ type: 'text', header: 'Descrizione' }] },
									}
								}
							]
						},
						'callo_semirecente': {
							display: 'Callo semirecente',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'callo_vecchio': {
							display: 'Callo vecchio',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'osteofiti': {
							display: 'Osteofiti',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'lesioni_blastiche': {
							display: 'Lesioni Blastiche',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'ossificazione_calcificazione': {
							display: 'Ossificazione e/o Calcificazione',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'calcificazioni_viscerali': {
							display: 'Calcificazioni Viscerali',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'altro': {
							display: 'Altro',
							next: [{ type: 'text', header: 'Descrizione' }]
						}
					}
				}]
			},
			'deformazione': {
				display: 'Deformazione',
				next: [{ type: 'text', header: 'Descrizione' }]
			},
			'altro': {
				display: 'Altro',
				next: [{ type: 'text', header: 'Descrizione' }]
			}
		}
	}
]

const lesivitàSegniNextArgs: FormFieldTemplate[] = [
	{
		type: 'select',
		selectArgs: {
			'soluzione_di_continuo': { display: 'Soluzione di Continuo' },
			'perdita_di_sostanza': { display: 'Perdita di Sostanza' }
		}
	}
]

export const coccige: Bone = {
	type: 'bone',
	name: 'Coccige',
	form: {
		title: "Coccige",
		sections: [
			{
				id: 'fusione',
				title: "Fusione/sviluppo",
				images: [coccigeNucleiImg],
				starters: [
					{
						type: 'multi-select',
						starterID: 'nuclei_di_ossificazione',
						header: 'Nuclei di Ossificazione',
						selectArgs: {
							'a': {
								display: 'A',
								next: [nextNuclei]
							},
							'b': {
								display: 'B',
								next: [nextNuclei]
							},
							'c': {
								display: 'C',
								next: [nextNuclei]
							},
							'd': {
								display: 'D',
								next: [nextNuclei]
							}
						}
					}
				]
			},
			{
				id: 'completezza',
				title: "Completezza, qualità, colore generale",
				images: [coccigeSettoriImg],
				starters: [
					{
						type: 'multi-select',
						starterID: 'settori',
						header: 'Settori',
						selectArgs: {
							'1': {
								display: '1',
								next: nextSettori
							},
							'2': {
								display: '2',
								next: nextSettori
							},
							'3': {
								display: '3',
								next: nextSettori
							},
							'4': {
								display: '4',
								next: nextSettori
							}
						}
					},
					{
						type: 'select',
						starterID: 'colore_generale',
						header: 'Colore Generale',
						selectArgs: {
							'marrone_marrone_scuro': { display: 'Da marrone a marrone scuro' },
							'grigio': { display: 'Grigio' },
							'naturale': { display: 'Naturale' },
							'arancione_marrone': { display: 'Da arancione a marrone' },
							'giallo_arancione': { display: 'Da giallo ad arancione' },
						}
					},
					{
						type: 'text',
						starterID: 'frammenti',
						header: 'Frammenti'
					}
				]
			},
			{
				id: 'caratteri_metrici',
				title: "Caratteri metrici",
				starters: [
					{
						type: 'expansion',
						starterID: 'caratteri_metrici',
						expansionArgs: [
							{
								type: 'text',
								header: 'Codice Misura'
							},
							{
								type: 'text',
								header: 'Nome Misura'
							}
						],
						next: [{
							type: 'number',
							header: 'Misura (mm)'
						}]
					}
				]
			},
			{
				id: 'caratteri_non_metrici',
				title: "Caratteri non metrici",
				starters: [
					{
						type: 'expansion',
						starterID: 'caratteri_non_metrici',
						expansionArgs: [
							{
								type: 'text',
								header: 'Nome Carattere'
							}
						],
						next: [{
							type: 'select',
							selectArgs: {
								'assente': { display: 'Assente' },
								'non_valutabile': { display: 'Non valutabile' },
								'presente': { display: 'Presente' }
							}
						}]
					}
				]
			},
			{
				id: 'profilo_biologico',
				title: "Profilo biologico",
				starters: [
					{
						type: 'expansion',
						starterID: 'diagnosi_sesso_biologico',
						header: 'Diagnosi di sesso biologico',
						expansionArgs: profiloBiologicoApprocciArgs,
					},
					{
						type: 'expansion',
						starterID: 'stima_età_alla_morte',
						header: 'Stima dell\'età alla morte',
						expansionArgs: profiloBiologicoApprocciArgs,
						fixed: [
							[{
								type: 'select',
								header: 'Approccio Morfologico',
								selectArgs: {
									'scheuer_&_black_2000': {
										display: 'Scheuer & Black 2000',
										next: [{
											type: 'deduction',
											deductionID: 'coccige_scheuer_&_black_2000'
										}]
									},
									'altro_metodo': {
										display: 'Altro metodo',
										next: [
											{
												type: 'text',
												header: 'Nome metodo (anno)'
											},
											{
												type: 'text',
												header: 'Scoring'
											}
										]
									}
								}
							}]
						]
					},
					{
						type: 'expansion',
						starterID: 'diagnosi_origine_biogeografica',
						header: 'Diagnosi di origine biogeografica',
						expansionArgs: profiloBiologicoApprocciArgs,
					},
					{
						type: 'expansion',
						starterID: 'stima_statura',
						header: 'Stima della statura',
						expansionArgs: profiloBiologicoApprocciArgs,
					}
				]
			},
			{
				id: 'patologie',
				title: "Patologie",
				starters: [
					{
						type: 'expansion',
						starterID: 'segni',
						header: 'Segni',
						incremental: true,
						prefix: 'PCe',
						next: [
							{
								type: 'multi-select',
								header: 'Settori',
								selectArgs: {
									'1': {
										display: '1',
										next: patologieSegniNextArgs
									},
									'2': {
										display: '2',
										next: patologieSegniNextArgs
									},
									'3': {
										display: '3',
										next: patologieSegniNextArgs
									},
									'4': {
										display: '4',
										next: patologieSegniNextArgs
									}
								}
							}
						],
					}
				]
			},
			{
				id: 'lesività',
				title: "Lesività",
				images: [coccigeSettoriImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'lesività_segni',
						header: 'Lesività Segni',
						incremental: true,
						next: [
							{
								type: 'multi-select',
								header: 'Settori',
								selectArgs: {
									'1': {
										display: '1',
										next: lesivitàSegniNextArgs
									},
									'2': {
										display: '2',
										next: lesivitàSegniNextArgs
									},
									'3': {
										display: '3',
										next: lesivitàSegniNextArgs
									},
									'4': {
										display: '4',
										next: lesivitàSegniNextArgs
									}
								}
							}
						],
					}
				]
			}
		]
	}
}

export const coccigeScheuerBlack2000: DeductionElement = {
	id: 'coccige_scheuer_&_black_2000',
	fn: CoccigeScheuerBlack2000
}

function CoccigeScheuerBlack2000(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const coccigeRinaldo2019: DeductionElement = {
	id: 'coccige_rinaldo_2019',
	fn: CoccigeRinaldo2019
}

function CoccigeRinaldo2019(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}
