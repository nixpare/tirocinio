import { FormFieldSelectArg, FormFieldTemplate } from "../models/Form";
import { DeductionElement, DeductionResult } from "../models/Programmable";
import { Bone } from "../models/Skeleton";

const femoreCentriImg = '/images/femore_centri.png'
const femoreSettoriImg = '/images/femore_settori.png'
const femoreMetricheImg = '/images/femore_metriche.png'

const fusioneCentriNext: FormFieldTemplate[] = [
	{
		type: 'select',
		header: 'Stato',
		selectArgs: {
			'assente_per_immaturità': { display: 'Assente per Immaturità' },
			'assente_per_tafonomia': { display: 'Assente per Tafonomia' },
			'assente_non_valutabile': { display: 'Assente non valutabile' },
			'presente_fusione_non_valutabile': { display: 'Presente ma fusione non valutabile' },
			'presente_non_fuso': { display: 'Presente non fuso' },
			'presente_in_fusione': { display: 'Presente in fusione' },
			'presente_fuso': { display: 'Presente fuso' }
		}
	},
	{
		type: 'text',
		header: 'Commenti'
	}
]

const nextSettori: FormFieldTemplate[] = [
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

const caratteriNonMetriciNext: FormFieldTemplate = {
	type: 'select',
	selectArgs: {
		'assente': { display: 'Assente' },
		'non_valutabile': { display: 'Non valutabile' },
		'presente': { display: 'Presente' }
	}
}

const profiloMetodiSessoArgs: Record<string, FormFieldSelectArg> = {
	'approccio_metrico': {
		display: 'Approccio metrico',
		next: [{
			type: 'expansion',
			header: 'Metodo',
			fixed: [
				[
					{ type: 'fixed', header: 'Metodo', value: 'Purkait (2003)'},
					{ type: 'deduction', header: 'Esito', deductionID: 'femore_purkait_2003' }
				]
			],
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
					{ type: 'deduction', header: 'Esito', deductionID: 'femore_fusione_fazekas_1978' }
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
					{ type: 'deduction', header: 'Esito generale', deductionID: 'femore_scheuer_&_black_2000' }
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
					{ type: 'deduction', header: 'Esito', deductionID: 'femore_fordisc' }
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
			fixed: [
				[
					{ type: 'fixed', header: 'Nome metodo', value: 'Wilson (2010)' },
					{ type: 'deduction', header: 'Esito', deductionID: 'femore_wilson_2010' }
				]
			],
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
						type: 'multi-select',
						starterID: 'centri',
						header: 'Centri di Ossificazione',
						selectArgs: {
							'a': {
								display: 'A',
								next: [{
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
										'presente_fusione_non_valutabile': {
											display: 'Presente ma fusione non valutabile',
											next: [{ type: 'text', header: 'Commenti' }]
										},
										'presente_non_fuso': {
											display: 'Presente non fuso',
											next: [
												{ type: 'number', header: 'Lunghezza massima (mm)' },
												{ type: 'deduction', header: 'Fazekas (1978)', deductionID: 'femore_fazekas_1978' },
												{ type: 'text', header: 'Commenti' }
											]
										},
										'presente_in_fusione': {
											display: 'Presente in fusione',
											next: [{ type: 'text', header: 'Commenti' }]
										},
										'presente_fuso': {
											display: 'Presente fuso',
											next: [{ type: 'text', header: 'Commenti' }]
										}
									}
								}]
							},
							'b': {
								display: 'B',
								next: fusioneCentriNext
							},
							'c': {
								display: 'C',
								next: fusioneCentriNext
							},
							'd': {
								display: 'D',
								next: fusioneCentriNext
							},
							'e': {
								display: 'E',
								next: fusioneCentriNext
							}
						}
					}
				]
			},
			{
				id: 'completezza',
				title: "Completezza, qualità, colore generale",
				images: [femoreSettoriImg],
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
							},
							'5': {
								display: '5',
								next: nextSettori
							},
							'6': {
								display: '6',
								next: nextSettori
							},
							'7': {
								display: '7',
								next: nextSettori
							},
							'8': {
								display: '8',
								next: nextSettori
							},
							'9': {
								display: '9',
								next: nextSettori
							},
							'10': {
								display: '10',
								next: nextSettori
							},
							'11': {
								display: '11',
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
									'4': { display: '4' },
									'5': { display: '5' },
									'6': { display: '6' },
									'7': { display: '7' },
									'8': { display: '8' },
									'9': { display: '9' },
									'10': { display: '10' },
									'11': { display: '11' },
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
				images: [femoreMetricheImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'caratteri_metrici',
						fixed: [
							[
								{ type: 'fixed', header: 'Codice Misura', value: '75' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Lunghezza massima' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '76' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Lunghezza bicondirale' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '77' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Larghezza epicondirale' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '78' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Massimo diametro della testa' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '79' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Diametro trasverso subtrocanterico' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '80' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Diametro subtrocanterico antero-posteriore' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '81' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Diametro massimo a metà diafasi' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '82' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Diametro minimo a metà diafasi' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '83' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Circonferenza a metà diafasi' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '84' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Lunghezza antero-posteriore massima del condilo laterale' },
								{ type: 'number', header: 'Misura (mm)' }
							],
							[
								{ type: 'fixed', header: 'Codice Misura', value: '85' },
								{ type: 'fixed', header: 'Nome Misura', value: 'Lunghezza antero-posteriore massima del condilo mediale' },
								{ type: 'number', header: 'Misura (mm)' }
							]
						],
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
				images: [femoreSettoriImg],
				starters: [
					{
						type: 'expansion',
						starterID: 'caratteri_non_metrici',
						fixed: [
							[{ type: 'fixed', header: 'Nome carattere', value: 'Fossa di Allen' }, caratteriNonMetriciNext],
							[{ type: 'fixed', header: 'Nome carattere', value: 'Faccetta di Poirier' }, caratteriNonMetriciNext],
							[{ type: 'fixed', header: 'Nome carattere', value: 'Placca III trocantere' }, caratteriNonMetriciNext],
							[{ type: 'fixed', header: 'Nome carattere', value: 'Fossa subtrocanterica' }, caratteriNonMetriciNext]
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
				images: [femoreSettoriImg],
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
