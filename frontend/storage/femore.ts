import { FormTableDropdownFieldTemplate, FormTableNumberFieldTemplate, FormTableTextFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";

export const femore: Bone = {
	type: 'bone',
	name: 'Femore',
	template: {
		title: "Femore",
		sections: [
			{
				title: 'Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi',
				tables: [
					{
						headers: ['Nuclei di ossificazione', 'Stato'],
						fields: [
							{
								type: 'text',
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								defaultValue: {
									type: 'dropdown',
									value: {
										selection: 'presente_fuso'
									}
								},
								dropdownArgs: [
									{
										value: 'assente_per_immaturità',
										display: 'Assente per immaturità',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'assente_per_tafonomia',
										display: 'Assente per tafonomia',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'assente_non_valutabile',
										display: 'Assente non valutabile',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'presente_ma_fusione_non_valutabile',
										display: 'Presente ma fusione non valutabile',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'presente_non_fuso',
										display: 'Presente non fuso',
										next: [
											{
												type: 'number',
												header: 'dimensione massima (mm)'
											} as FormTableNumberFieldTemplate,
											{
												type: 'text',
												header: 'Commenti'
											} as FormTableTextFieldTemplate
										]
									},
									{
										value: 'presente_in_fusione',
										display: 'Presente in fusione',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'presente_fuso',
										display: 'Presente fuso',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									}
								]
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			},
			{
				title: 'Completezza, qualità, colore generale',
				tables: [
					{
						headers: ['Nuclei di ossificazione', 'Stato', 'Commenti'],
						fields: [
							{
								type: 'text',
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								defaultValue: {
									type: 'dropdown',
									value: {
										selection: 'Presente fuso'
									}
								},
								dropdownArgs: [
									{
										value: 'Assente per immaturità',
										display: 'Assente per immaturità',
										next: []
									},
									{
										value: 'Assente per tafonomia',
										display: 'Assente per tafonomia',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Assente non valutabile',
										display: 'Assente non valutabile',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente ma fusione non valutabile',
										display: 'Presente ma fusione non valutabile',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente non fuso',
										display: 'Presente non fuso',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente in fusione',
										display: 'Presente in fusione',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente fuso',
										display: 'Presente fuso',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									}
								]
							} as FormTableDropdownFieldTemplate
						]
					},
					{
						headers: ['Nuclei di ossificazione', 'Presenza / Assenza', 'Quantità', 'Qualità', 'Colore', 'Commenti'],
						fields: [
							{
								type: 'text',
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								defaultValue: {
									type: 'dropdown',
									value: {
										selection: 'Presente'
									}
								},
								dropdownArgs: [
									{ value: 'Assente', display: 'Assente' },
									{ value: 'Presente', display: 'Presente' }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: '1 (1%-25%)', display: '1 (1%-25%)' },
									{ value: '2 (26% - 50%)', display: '2 (26% - 50%)' }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: '0% of sound cortical surface', display: '0% of sound cortical surface' },
									{ value: '1-24% of sound cortical surface', display: '1-24% of sound cortical surface' }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: 'da marrone a marrone scuro', display: 'da marrone a marrone scuro' },
									{ value: 'grigio', display: 'grigio' }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'text'
							} as FormTableTextFieldTemplate
						]
					}
				]
			},
			{
				title: 'Completezza, qualità, colore generale 2',
				tables: [
					{
						headers: ['', 'Numero', 'Numero < di 2cm'],
						fields: [
							{
								type: 'text',
								fixedArgs: ['Frammenti']
							} as FormTableTextFieldTemplate,
							{
								type: 'number'
							} as FormTableNumberFieldTemplate,
							{
								type: 'number'
							} as FormTableNumberFieldTemplate
						]
					},
					{
						headers: ['Settore di appartenenza'],
						isVariadic: true,
						fields: [
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: '1', display: '1' },
									{ value: '2', display: '2' },
									{ value: '3', display: '3' },
									{ value: '...', display: '...' },
									{ value: '11', display: '11' },
									{ value: 'ND', display: 'ND' }
								]
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			},
			{
				title: 'Caratteri metrici',
				tables: [
					{
						headers: ['Codice Misura', 'Nome Misura', 'Misura (mm)'],
						isVariadic: true,
						fields: [
							{
								type: 'number',
								fixedArgs: ['75', '76', '...', '85']
							} as FormTableNumberFieldTemplate,
							{
								type: 'text',
								fixedArgs: ['Lunghezza massima', 'Lunghezza bicondilare', '...', 'Lunghezza antero-posteriore massima del condilomediale']
							} as FormTableTextFieldTemplate,
							{
								type: 'number',
								max: 100,
								min: 0
							} as FormTableNumberFieldTemplate
						]
					}
				]
			},
			{
				title: 'Caratteri non metrici',
				tables: [
					{
						headers: ['Carattere non metrico', 'Stato'],
						isVariadic: true,
						fields: [
							{
								type: 'text',
								fixedArgs: ['Fossa di Allen', 'Faccetta di Poirier', 'Placca III trocantere', 'Fossa subtrocanterica']
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: 'Assente', display: 'Assente' },
									{ value: 'Non valutabile', display: 'Non valutabile' },
									{ value: 'Presente', display: 'Presente' }
								]
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			}
		]
	}
}
