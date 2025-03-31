import { DeductionElement, DeductionResult, SelectArgsElement, walkObject } from "../../models/Programmable";
import { FormExpansionFieldTemplate, FormFieldSelectArg, FormFieldSelectArgs, FormFieldTemplate, FormSelectFieldTemplate } from "../../models/Form";
import { AnatomStructData, Bone } from "../../models/AnatomStruct";

const atlanteImg = '/images/atlante.png';
const atlanteCentriImg = '/images/atlante_centri.png';
const atlanteSettoriImg = '/images/atlante_settori.png';

const nextCentri_A_B: FormSelectFieldTemplate = {
	id: 'Stato',
	type: 'select',
	header: 'Stato',
	selectArgs: {
		'assente_per_immaturità': {
			value: 'assente_per_immaturità',
			display: 'Assente per Immaturità',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'assente_per_tafonomia': {
			value: 'assente_per_tafonomia',
			display: 'Assente per Tafonomia',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'assente_non_valutabile': {
			value: 'assente_non_valutabile',
			display: 'Assente non valutabile',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'presente_fusione_non_valutabile': {
			value: 'presente_fusione_non_valutabile',
			display: 'Presente ma fusione non valutabile',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'presente_non_fuso': {
			value: 'presente_non_fuso',
			display: 'Presente non fuso',
			next: {
				'Lunghezza massima (mm)': { id: 'Lunghezza massima (mm)', type: 'number', header: 'Lunghezza massima (mm)' },
				'Fazekas (1978)': { id: 'Fazekas (1978)', type: 'deduction', header: 'Fazekas (1978)', deductionID: 'atlante_fusione_fazekas_1978' },
				'Commenti': { id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'presente_in_fusione': {
			value: 'presente_in_fusione',
			display: 'Presente in fusione',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		},
		'presente_fuso': {
			value: 'presente_fuso',
			display: 'Presente fuso',
			next: {
				'Commenti' :{ id: 'Commenti', type: 'text', header: 'Commenti' }
			}
		}
	}
}

const nextCentri_C: Record<string, FormFieldTemplate> = {
	'Stato': {
		id: 'Stato',
		type: 'select',
		header: 'Stato',
		selectArgs: {
			'assente_per_immaturità': { value: 'assente_per_immaturità', display: 'Assente per Immaturità' },
			'assente_per_tafonomia': { value: 'assente_per_tafonomia', display: 'Assente per Tafonomia' },
			'assente_non_valutabile': { value: 'assente_non_valutabile', display: 'Assente non valutabile' },
			'presente_fusione_non_valutabile': { value: 'presente_fusione_non_valutabile', display: 'Presente ma fusione non valutabile' },
			'presente_non_fuso': { value: 'presente_non_fuso', display: 'Presente non fuso' },
			'presente_in_fusione': { value: 'presente_in_fusione', display: 'Presente in fusione' },
			'presente_fuso': { value: 'presente_fuso', display: 'Presente fuso' }
		}
	},
	'Commenti': { id: 'Commenti', type: 'text', header: 'Commenti' }
}

const nextSettori: Record<string, FormFieldTemplate> = {
	'Qualità': {
		id: 'Qualità',
		type: 'select',
		header: 'Qualità',
		selectArgs: {
			'1-25': { value: '', display: '1 (1% - 25%)' },
			'26-50': { value: '', display: '2 (26% - 50%)' },
			'51-75': { value: '', display: '3 (51% - 75%)' },
			'76-99': { value: '', display: '4 (76% - 99%)' },
			'completo': { value: '', display: 'Completo (100%)' },
			'completo_ma_frammentario': { value: '', display: 'Completo ma frammentario (100%)' }
		}
	},
	'Quantità': {
		id: 'Quantità',
		type: 'select',
		header: 'Quantità',
		selectArgs: {
			'0': { value: '0', display: '0% of sound cortical surface' },
			'1-24': { value: '1-24', display: '1-24% of sound cortical surface' },
			'25-49': { value: '25-49', display: '25-49% of sound cortical surface' },
			'50-74': { value: '50-74', display: '50-74% of sound cortical surface' },
			'75-99': { value: '75-99', display: '75-99% of sound cortical surface' },
			'100': { value: '100', display: '100% of sound cortical surface' }
		}
	},
	'Colore': {
		id: 'Colore',
		type: 'select',
		header: 'Colore',
		selectArgs: {
			'marrone_marrone_scuro': { value: 'marrone_marrone_scuro', display: 'Da marrone a marrone scuro' },
			'grigio': { value: 'grigio', display: 'Grigio' },
			'naturale': { value: 'naturale', display: 'Naturale' },
			'arancione_marrone': { value: 'arancione_marrone', display: 'Da arancione a marrone' },
			'giallo_arancione': { value: 'giallo_arancione', display: 'Da giallo ad arancione' },
		}
	},
	'Commenti': {
		id: 'Commenti',
		type: 'text',
		header: 'Commenti'
	}
}

const caratteriNonMetriciNext: FormFieldTemplate = {
	id: 'Stato',
	type: 'select',
	header: 'Stato',
	selectArgs: {
		'assente': { value: 'assente', display: 'Assente' },
		'non_valutabile': { value: 'non_valutabile', display: 'Non valutabile' },
		'presente': { value: 'presente', display: 'Presente' }
	}
}

const profiloMetodiSessoArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			id: 'Metodo',
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{
					type: 'select',
					header: 'Esito',
					selectArgs: {
						'm': { display: 'M' },
						's': { display: 'S' },
						'incerto': { display: 'Incerto' },
						'nd': { display: 'N/D' }
					}
				}
			]
		}]
	},
	'approccio_morfologico': {
		display: 'Approccio morfologico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{
					type: 'select',
					header: 'Esito',
					selectArgs: {
						'm': { display: 'M' },
						's': { display: 'S' },
						'incerto': { display: 'Incerto' },
						'nd': { display: 'N/D' }
					}
				}
			]
		}]
	}
}

const profiloMetodiMorteSubadultoArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			fixed: [
				[
					{ type: 'fixed', header: 'Nome metodo', value: 'Fazekas (1978)' },
					{ type: 'deduction', header: 'Esito', deductionID: 'atlante_fazekas_1978' }
				]
			],
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	},
	'approccio_morfologico': {
		display: 'Approccio morfologico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			fixed: [
				[
					{ type: 'fixed', header: 'Nome metodo', value: 'Scheuer & Black 2000' },
					{ type: 'deduction', header: 'Esito generale', deductionID: 'atlante_scheuer_&_black_2000' }
				]
			],
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	}
}

const profiloMetodiMorteAdultoArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	},
	'approccio_morfologico': {
		display: 'Approccio morfologico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	}
}

const profiloMetodiOrigineGeoArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			fixed: [
				[
					{ type: 'fixed', header: 'Nome metodo', value: 'Fordisc' },
					{ type: 'deduction', header: 'Esito', deductionID: 'atlante_fordisc' }
				]
			],
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	},
	'approccio_morfologico': {
		display: 'Approccio morfologico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'text', header: 'Esito' }
			]
		}]
	}
}

const profiloMetodiStaturaArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'number', header: 'Esito (cm)', min: 0, max: 250 }
			]
		}]
	},
	'approccio_morfologico': {
		display: 'Approccio morfologico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			expansionArgs: [
				{ type: 'text', header: 'Nome metodo (anno)' },
				{ type: 'number', header: 'Esito (cm)', min: 0, max: 250 }
			]
		}]
	}
}

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
			'protesi': {
				display: 'Protesi',
				next: [{
					type: 'select',
					selectArgs: {
						'placca_vite': {
							display: 'Impianti placca e vite',
							next: [{ type: 'text', header: 'Descrizione' }]
						},
						'altro': {
							display: 'Altro',
							next: [{ type: 'text', header: 'Descrizione' }]
						}
					}
				}]
			},
			'ossificazione_calcificazione': {
				display: 'Ossificazione e/o Calcificazione',
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
			'soluzione_di_continuo': {
				display: 'Soluzione di Continuo',
				next: [
					{
						type: 'select',
						header: 'Tipo',
						selectArgs: {
							'a_tutto_spessore_e_tutta_circonferenza': { display: 'A tutto spessore e tutta circonferenza' },
							'a_tutto_spessore_e_parziale_circonferenza': { display: 'A tutto spessore e parziale circonferenza' },
							'soluzione_di_continuo_interessante_lo_strato_corticale_a_tutta_circonferenza': { display: 'Soluzione di continuo interessante lo strato corticale a tutta circonferenza' },
							'soluzione_di_continuo_interessante_lo_strato_corticale_a_parziale_circonferenza': { display: 'Soluzione di continuo interessante lo strato corticale a parziale circonferenza' },
							'soluzione_di_continuo_interessante_lo_strato_di_osso_trabecolare': { display: 'Soluzione di continuo interessante lo strato di osso trabecolare (visibili in RX e TC)' },
							'multiple_soluzioni_di_continuo': { display: 'Multiple soluzioni di continuo (comminuzione)' }
						}
					},
					{
						type: 'select',
						header: 'Aspetto della superficie (indicare la localizzazione - mediale, laterale, anteriore e posteriore)',
						selectArgs: {
							'aspetto_granulare': {
								display: 'Con aspetto granulare (grained)'
							},
							'intaccature_indentature': {
								display: 'Con intaccature/indentature (linee di interruzione a gradino - cantilever curl)'
							},
							'strie_regolari_rettilinee_e_parallele_alla_lunghezza_della_lesione': {
								display: 'strie regolari, rettilinee e parallele alla lunghezza della lesione, poste lungo le pareti (utile per lesività da arma bianca)'
							},
							'strie_rettilinee_e_irregolari_con_pattern_generale_parallelo_alla_lunghezza_della_lesione': {
								display: 'strie rettilinee e irregolari con pattern generale parallelo alla lunghezza della lesione, poste lungo le pareti (utile per lesività da arma bianca)'
							},
							'strie_regolari_semicircolari_parallele_tra_loro': {
								display: 'strie regolari, semicircolari, parallele tra loro, poste lungo le pareti (utile per lesività da arma bianca)'
							},
							'linea_mammellonata': {
								display: 'Linea mammellonata (indicare la distanza tra i picchi)'
							},
							'con_o_senza_presenza_di_sperone': {
								display: 'con o senza presenza di sperone (indicare la localizzazione - mediale, laterale, anteriore e posteriore)',
							}
						}
					},
					{
						type: 'select',
						header: 'Aspetto margine',
						selectArgs: {
							'dello_stesso_colore_del_tessuto_circostante': { display: 'Dello stesso colore del tessuto circostante' },
							'a_tutto_spessore_e_parziale_circonferenza': { display: 'Di colore diverso rispetto al tessuto circostante' },
							'netto': { display: 'Netto' },
							'irregolare': { display: 'Irregolare' },
							'finemente_irregolare': { display: 'Finemente irregolare' },
							'con_spicole_estroflesse': { display: 'Con spicole estroflesse' },
							'con_spicole_introflesse': { display: 'Con spicole introflesse' },
							'con_sfaldatura_della_corticale': { display: 'Con sfaldatura della corticale (flaking), frammento deformato di osso corticale' }
						}
					}
				]
			},
			'perdita_di_sostanza': {
				display: 'Perdita di Sostanza',
				next: [{ type: 'fixed', header: 'TODO', value: 'Ancora da implementare' }]
			}
		}
	}
]

export const atlante: Bone = {
	type: 'bone',
	name: 'Atlante',
	form: {
		title: "Atlante",
		sections: [
			{
				id: 'fusione',
				title: "Fusione/sviluppo",
				images: [atlanteCentriImg],
				starters: [
					{
						type: 'multi-select',
						starterID: 'centri_di_ossificazione',
						header: 'Centri di Ossificazione',
						selectArgs: {
							'a': {
								display: 'A',
								next: [nextCentri_A_B]
							},
							'b': {
								display: 'B',
								next: [nextCentri_A_B]
							},
							'c': {
								display: 'C',
								next: nextCentri_C
							}
						}
					}
				]
			},
			{
				id: 'completezza',
				title: "Completezza, qualità, colore generale",
				images: [atlanteSettoriImg],
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
						type: 'expansion',
						starterID: 'frammenti',
						header: 'Frammenti minori di 2 cm',
						incremental: true,
						expansionArgs: [
							{
								type: 'select',
								header: 'Settore di appartenenza',
								selectArgs: {
									'1': { display: '1' },
									'2': { display: '2' },
									'3': { display: '3' },
									'nd': { display: 'N/D' },
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
							}
						]
					}
				]
			},
			{
				id: 'caratteri_metrici',
				title: "Caratteri metrici",
				images: [atlanteImg],
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
				images: [atlanteImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'caratteri_non_metrici',
						fixed: [
							[{ type: 'fixed', header: 'Nome carattere', value: 'Faccetta bipartita' }, caratteriNonMetriciNext],
							[{ type: 'fixed', header: 'Nome carattere', value: 'Ponte posteriore' }, caratteriNonMetriciNext],
							[{ type: 'fixed', header: 'Nome carattere', value: 'Ponte laterale' }, caratteriNonMetriciNext]
						],
						expansionArgs: [
							{
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
				images: [atlanteCentriImg],
				starters: [
					{
						type: 'multi-select',
						starterID: 'diagnosi_sesso_biologico',
						header: 'Diagnosi di sesso biologico',
						selectArgs: profiloMetodiSessoArgs,
					},
					{
						type: 'multi-select',
						starterID: 'stima_età_alla_morte_subadulto',
						header: 'Stima dell\'età alla morte (subadulto)',
						selectArgs: profiloMetodiMorteSubadultoArgs,
					},
					{
						type: 'multi-select',
						starterID: 'stima_età_alla_morte_adulto',
						header: 'Stima dell\'età alla morte (adulto)',
						selectArgs: profiloMetodiMorteAdultoArgs,
					},
					{
						type: 'multi-select',
						starterID: 'diagnosi_origine_biogeografica',
						header: 'Diagnosi di origine biogeografica',
						selectArgs: profiloMetodiOrigineGeoArgs,
					},
					{
						type: 'multi-select',
						starterID: 'stima_statura',
						header: 'Stima della statura',
						selectArgs: profiloMetodiStaturaArgs,
					}
				]
			},
			{
				id: 'patologie',
				title: "Patologie",
				images: [atlanteSettoriImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'segni',
						header: 'Segni',
						incremental: true,
						prefix: 'PAtl',
						next: [
							{
								type: 'multi-select',
								header: 'Settori',
								selectArgs: {
									'1': {
										display: '1',
										next: [{ type: 'fixed', value: 'Non fornito' }]
									},
									'2': {
										display: '2',
										next: patologieSegniNextArgs
									},
									'3': {
										display: '3',
										next: [{ type: 'fixed', value: 'Non fornito' }]
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
				images: [atlanteSettoriImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'lesività_segni',
						header: 'Lesività Segni',
						incremental: true,
						prefix: 'LAtl',
						next: [
							{
								type: 'multi-select',
								header: 'Settori',
								selectArgs: {
									'1': {
										display: '1',
										next: [{ type: 'fixed', value: 'Non fornito' }]
									},
									'2': {
										display: '2',
										next: lesivitàSegniNextArgs
									},
									'3': {
										display: '3',
										next: [{ type: 'fixed', value: 'Non fornito' }]
									}
								}
							}
						],
					},
					{
						type: 'expansion',
						starterID: 'lesività_pattern',
						header: 'Pattern',
						expansionArgs: [
							{
								type: 'multi-select',
								header: 'Segni',
								selectArgs: 'atlante_pattern_lesività_segni',
							},
							{
								type: 'select',
								selectArgs: {
									'frattura_arco_posteriore': { display: 'Frattura dell’arco posteriore' },
									'frattura_arco_anteriore': { display: 'Frattura dell’arco anteriore' },
									'frattura_masse_laterali': { display: 'Frattura delle masse laterali' },
									'frattura_jefferson': { display: 'Frattura di Jefferson' },
									'frattura_jefferson_a_tre_parti': { display: 'Frattura di Jefferson a tre parti' },
									'frattura_vomere': { display: 'Frattura a vomere' },
									'frattura_processo_trasverso': { display: 'Frattura del processo trasverso' },
								}
							}
						]
					}
				]
			}
		]
	}
}

export const atlanteFusioneFazekas1978: DeductionElement = {
	id: 'atlante_fusione_fazekas_1978',
	fn: AtlanteFusioneFazekas1978
}

function AtlanteFusioneFazekas1978(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const atlanteProfiloFazekas1978: DeductionElement = {
	id: 'atlante_profilo_fazekas_1978',
	fn: AtlanteProfiloFazekas1978
}

function AtlanteProfiloFazekas1978(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const atlanteScheuerBlack2000: DeductionElement = {
	id: 'atlante_scheuer_&_black_2000',
	fn: AtlanteScheuerBlack2000
}

function AtlanteScheuerBlack2000(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const atlanteFordisc: DeductionElement = {
	id: 'atlante_fordisc',
	fn: AtlanteFordisc
}

function AtlanteFordisc(): DeductionResult {
	return {
		result: "Metodo presente ed eseguito: non ancora implementato"
	}
}

export const atlantePatternLesivitàSegni: SelectArgsElement = {
	id: 'atlante_pattern_lesività_segni',
	fn: AtlantePatternLesivitàSegni
}

function AtlantePatternLesivitàSegni(struct: AnatomStructData): FormFieldSelectArgs {
	const nSegni = walkObject<number>(struct.form.sections, 'lesività.lesività_segni.value.additional.length')
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

	return result
}
