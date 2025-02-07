import { FormSelectFieldTemplate, FormFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";

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
	} as FormSelectFieldTemplate,
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
	} as FormSelectFieldTemplate,
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
	} as FormSelectFieldTemplate,
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
	} as FormSelectFieldTemplate,
	{
		type: 'text',
		header: 'Commenti'
	}
]

export const coccige: Bone = {
	type: 'bone',
	name: 'Coccige',
	template: {
		title: "Coccige",
		sections: [
			{
				title: "Fusione/sviluppo",
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
				title: "Completezza, qualità, colore generale",
				starters: [
					{
						type: 'multi-select',
						starterID: 'nuclei_di_ossificazione',
						header: 'Nuclei di Ossificazione',
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
					}
				]
			}
		]
	}
}
