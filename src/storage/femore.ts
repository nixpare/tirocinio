import { AnatomStructType } from "../models/AnatomStruct";
import { FormTableFieldType } from "../models/Form";
import { Bone } from "../models/Skeleton";

export const femore: Bone = {
	type: AnatomStructType.Bone,
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
								type: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								type: FormTableFieldType.Multistage,
								defaultValue: { value: 'Presente fuso' },
								multistageArgs: [
									{
										value: 'Assente per immaturità',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									},
									{
										value: 'Assente per tafonomia',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									},
									{
										value: 'Assente non valutabile',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									},
									{
										value: 'Presente ma fusione non valutabile',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									},
									{
										value: 'Presente non fuso',
										next: [
											{
												mode: FormTableFieldType.Number,
												header: 'dimensione massima (mm)'
											},
											{
												mode: FormTableFieldType.Text,
												header: 'Commenti'
											}
										]
									},
									{
										value: 'Presente in fusione',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									},
									{
										value: 'Presente fuso',
										next: [{
											mode: FormTableFieldType.Text,
											header: 'Commenti'
										}]
									}
								]
							}
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
								type: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								type: FormTableFieldType.Multistage,
								defaultValue: { value: 'Presente fuso' },
								multistageArgs: [
									{
										value: 'Assente per immaturità',
										next: []
									},
									{
										value: 'Assente per tafonomia',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									},
									{
										value: 'Assente non valutabile',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									},
									{
										value: 'Presente ma fusione non valutabile',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									},
									{
										value: 'Presente non fuso',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									},
									{
										value: 'Presente in fusione',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									},
									{
										value: 'Presente fuso',
										next: [{
											mode: FormTableFieldType.Text,
										}]
									}
								]
							}
						]
					},
					{
						headers: ['Nuclei di ossificazione', 'Presenza / Assenza', 'Quantità', 'Qualità', 'Colore', 'Commenti'],
						fields: [
							{
								type: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								type: FormTableFieldType.Dropdown,
								defaultValue: 'Presente',
								dropdownArgs: ['Assente', 'Presente']
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ['1 (1%-25%)', '2 (26% - 50%)']
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ['0% of sound cortical surface', '1-24% of sound cortical surface']
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ['da marrone a marrone scuro', 'grigio']
							},
							{
								type: FormTableFieldType.Text
							}
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
								type: FormTableFieldType.Text,
								fixedArgs: ['Frammenti']
							},
							{ type: FormTableFieldType.Number },
							{ type: FormTableFieldType.Number }
						]
					},
					{
						headers: ['Settore di appartenenza'],
						isVariadic: true,
						fields: [
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ['1', '2', '3', '...', '11', 'ND']
							}
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
								type: FormTableFieldType.Number,
								fixedArgs: ['75', '76', '...', '85']
							},
							{
								type: FormTableFieldType.Text,
								fixedArgs: ['Lunghezza massima', 'Lunghezza bicondilare', '...', 'Lunghezza antero-posteriore massima del condilomediale']
							},
							{
								type: FormTableFieldType.Number,
								max: 100,
								min: 0
							}
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
								type: FormTableFieldType.Text,
								fixedArgs: ['Fossa di Allen', 'Faccetta di Poirier', 'Placca III trocantere', 'Fossa subtrocanterica']
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ['Assente', 'Non valutabile', 'Presente']
							}
						]
					}
				]
			}
		]
	}
}