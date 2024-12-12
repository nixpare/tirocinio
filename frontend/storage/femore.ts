import { FormTableDropdownFieldTemplate, FormTableMultistageFieldTemplate, FormTableNumberFieldTemplate, FormTableTextFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";

export const femore: Bone = {
	type: 'bone',
	name: 'Femore',
	template: {
		name: "Femore",
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
								type: 'multistage',
								defaultValue: {
									type: 'multistage',
									value: {
										selection: 'Presente fuso'
									}
								},
								multistageArgs: [
									{
										value: 'Assente per immaturità',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Assente per tafonomia',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Assente non valutabile',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente ma fusione non valutabile',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente non fuso',
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
										value: 'Presente in fusione',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente fuso',
										next: [{
											type: 'text',
											header: 'Commenti'
										} as FormTableTextFieldTemplate]
									}
								]
							} as FormTableMultistageFieldTemplate
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
								type: 'multistage',
								defaultValue: {
									type: 'multistage',
									value: {
										selection: 'Presente fuso'
									}
								},
								multistageArgs: [
									{
										value: 'Assente per immaturità',
										next: []
									},
									{
										value: 'Assente per tafonomia',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Assente non valutabile',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente ma fusione non valutabile',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente non fuso',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente in fusione',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									},
									{
										value: 'Presente fuso',
										next: [{
											type: 'text',
										} as FormTableTextFieldTemplate]
									}
								]
							} as FormTableMultistageFieldTemplate
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
								dropdownArgs: ['Assente', 'Presente']
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: ['1 (1%-25%)', '2 (26% - 50%)']
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: ['0% of sound cortical surface', '1-24% of sound cortical surface']
							} as FormTableDropdownFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: ['da marrone a marrone scuro', 'grigio']
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
							} as FormTableTextFieldTemplate,
							{
								type: 'number'
							} as FormTableTextFieldTemplate
						]
					},
					{
						headers: ['Settore di appartenenza'],
						isVariadic: true,
						fields: [
							{
								type: 'dropdown',
								dropdownArgs: ['1', '2', '3', '...', '11', 'ND']
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
								dropdownArgs: ['Assente', 'Non valutabile', 'Presente']
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			}
		]
	}
}
