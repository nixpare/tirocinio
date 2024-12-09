import { AnatomStructType } from "../models/AnatomStruct";
import { FormTableFieldType } from "../models/Form";
import { Bone } from "../models/Skeleton";

export const ossoInnominato: Bone = {
	type: AnatomStructType.Bone,
	name: 'Osso Innominato',
	template: {
		name: "OSSO INNOMINATO",
		sections: [
			// Page Test
			{
				title: "Test variadic mouse",
				image: ['/images/slide-image-1.png', '/images/slide-image-2.png'],
				tables: [
					{
						headers: ["Nucleo", "Stato"],
						fields: [
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
							},
							{
								type: FormTableFieldType.Text
							}
						],
						isVariadic: true,
						interactsWithImage: true
					},
					{
						headers: ["Nucleo 2", "Stato 2"],
						fields: [
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
							},
							{
								type: FormTableFieldType.Text
							}
						],
						isVariadic: true,
						interactsWithImage: true
					}
				]
			},
			// Page 1
			{
				title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
				image: ['/images/slide-image-1.png'],
				tables: [
					{
						headers: ["Nucleo", "Stato", "Lunghezza (cm)"],
						fields: [
							{
								type: FormTableFieldType.Text,
								fixedArgs: ["A", "B", "C", "D", "E", "F"]
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
							},
							{
								type: FormTableFieldType.Number
							}
						]
					}
				]
			},
			// Page 2
			{
				title: "Completezza, qualità, colore generale",
				image: ['/images/slide-image-2.png'],
				tables: [
					{
						headers: ["Settore", "Presente/Assente", "Note"],
						fields: [
							{
								type: FormTableFieldType.Number,
								fixedArgs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["Assente", "Presente"]
							},
							{
								type: FormTableFieldType.Text
							}
						]
					},
					{
						headers: ["Area", "Dettagli", "Colore"],
						fields: [
							{
								type: FormTableFieldType.Text,
								fixedArgs: ["A", "B", "C", "D", "E", "F"]
							},
							{
								type: FormTableFieldType.Text
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["da marrone a marrone scuro", "grigio", "naturale", "da arancione a marrone", "da giallo ad arancione"]
							}
						]
					}
				]
			},
			// Page 3
			{
				title: "Caratteri metrici",
				image: ['/images/slide-image-3.png', '/images/slide-image-4.png'],
				tables: [
					{
						headers: ["Codice Misura", "Nome Misura", "Misura (cm)"],
						fields: [
							{
								type: FormTableFieldType.Number,
								fixedArgs: ["64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74"]
							},
							{
								type: FormTableFieldType.Text,
								fixedArgs: [
									"Maximum Innominate Height",
									"Maximum Iliac Breadth",
									"Minimum Iliac Breadth",
									"Maximum Pubis Length",
									"Minimum Pubis Length",
									"Ischial Length",
									"Minimum Ischial Length",
									"Maximum Ischiopubic Ramus Length",
									"Anterior Superior Iliac Spine to Symphysion",
									"Maximum Posterior Superior Iliac Spine to Symphysion",
									"Minimum Apical Border to Symphysion"
								]
							},
							{
								type: FormTableFieldType.Number
							}
						]
					}
				]
			},
			// Page 4
			{
				title: "Caratteri non metrici",
				tables: [
					{
						headers: ["Caratteri non metrici", "Stato"],
						fields: [
							{
								type: FormTableFieldType.Text,
								fixedArgs: [
									"Accessory Sacroiliac Facet",
									"Pubic Spine",
									"Acetabular Crease",
									"Cotyloid bone"
								]
							},
							{
								type: FormTableFieldType.Dropdown,
								dropdownArgs: ["Assente", "Non valutabile", "Presente"]
							}
						],
						isVariadic: true,
					}
				]
			},
			// Page 5
			// Page 6
			// Page 7
			{
				title: "Lesività - Descrizione",
				image: ["/images/slide-image-5.png"],
				tables: [
					{
						headers: ["#", "Classe", "Descrizione segni"],
						fields: [
							{
								type: FormTableFieldType.Text,
								fixedArgs: ["1", "2", "3"]
							},
							{
								type: FormTableFieldType.Multistage,
								multistageArgs: [
									{
										value: "Soluzione di continuo",
										next: [{
											mode: FormTableFieldType.Dropdown,
											dropdownArgs: [
												"A tutto spessore e tutta circonferenza",
												"A tutto spessore e parziale circonferenza",
												"Soluzione di continuo interessante lo strato corticale a tutta circonferenza",
												"Soluzione di continuo interessante lo strato corticale a parziale circonferenza",
												"Soluzione di continuo interessante lo strato di osso trabecolare (visibili in RX e TC)",
												"Multiple soluzioni di continuo (comminuzione)"
											]
										}]
									},
									{
										value: "Perdita di sostanza",
										next: [{ mode: FormTableFieldType.Text }]
									},
									{
										value: "Aspetto margine (esempio nested multistage)",
										next: [{
											mode: FormTableFieldType.Multistage,
											multistageArgs: [
												{
													value: "Aspetto della superficie di frattura (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													next: [{ mode: FormTableFieldType.Text }]
												},
												{
													value: "Aspetto superficie di taglio (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													next: [{ mode: FormTableFieldType.Text }]
												}
											]
										}]
									}
								]
							}
						]
					}
				]
			}
		]
	}
}