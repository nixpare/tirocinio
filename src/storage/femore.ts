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
								mode: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								mode: FormTableFieldType.Multistage,
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
								mode: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								mode: FormTableFieldType.Multistage,
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
								mode: FormTableFieldType.Text,
								fixedArgs: ['A', 'B', 'C', 'D', 'E']
							},
							{
								mode: FormTableFieldType.Dropdown,
								defaultValue: 'Presente',
								dropdownArgs: ['Assente', 'Presente']
							},
							{
								mode: FormTableFieldType.Dropdown,
								dropdownArgs: ['1 (1%-25%)', '2 (26% - 50%)']
							},
							{
								mode: FormTableFieldType.Dropdown,
								dropdownArgs: ['0% of sound cortical surface', '1-24% of sound cortical surface']
							},
							{
								mode: FormTableFieldType.Dropdown,
								dropdownArgs: ['da marrone a marrone scuro', 'grigio']
							},
							{
								mode: FormTableFieldType.Text
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
								mode: FormTableFieldType.Text,
								fixedArgs: ['Frammenti']
							},
							{ mode: FormTableFieldType.Number },
							{ mode: FormTableFieldType.Number }
						]
					},
					{
						headers: ['Settore di appartenenza'],
						isVariadic: true,
						fields: [
							{
								mode: FormTableFieldType.Dropdown,
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
								mode: FormTableFieldType.Number,
								fixedArgs: ['75', '76', '...', '85']
							},
							{
								mode: FormTableFieldType.Text,
								fixedArgs: ['Lunghezza massima', 'Lunghezza bicondilare', '...', 'Lunghezza antero-posteriore massima del condilomediale']
							},
							{
								mode: FormTableFieldType.Number,
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
								mode: FormTableFieldType.Text,
								fixedArgs: ['Fossa di Allen', 'Faccetta di Poirier', 'Placca III trocantere', 'Fossa subtrocanterica']
							},
							{
								mode: FormTableFieldType.Dropdown,
								dropdownArgs: ['Assente', 'Non valutabile', 'Presente']
							}
						]
					}
				]
			}
		]
	}
}