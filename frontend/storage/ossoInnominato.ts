import { FormTableDropdownFieldTemplate, FormTableNumberFieldTemplate, FormTableTextFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";

export const ossoInnominato: Bone = {
	type: 'bone',
	name: 'Osso Innominato',
	template: {
		title: "OSSO INNOMINATO",
		sections: [
			// Page Test
			{
				title: "Test variadic mouse",
				images: ['/images/slide-image-1.png', '/images/slide-image-2.png'],
				tables: [
					{
						headers: ["Nucleo", "Stato"],
						fields: [
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "assente", display: "assente" },
									{ value: "presente non valutabile PND", display: "presente non valutabile PND" },
									{ value: "presente non fuso PN", display: "presente non fuso PN" },
									{ value: "presente in fusione PIF", display: "presente in fusione PIF" },
									{ value: "presente fuso PF", display: "presente fuso PF" }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'text'
							} as FormTableTextFieldTemplate
						],
						isVariadic: true,
						interactsWithImage: true
					},
					{
						headers: ["Nucleo 2", "Stato 2"],
						fields: [
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "assente", display: "assente" },
									{ value: "presente non valutabile PND", display: "presente non valutabile PND" },
									{ value: "presente non fuso PN", display: "presente non fuso PN" },
									{ value: "presente in fusione PIF", display: "presente in fusione PIF" },
									{ value: "presente fuso PF", display: "presente fuso PF" }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'text'
							} as FormTableTextFieldTemplate
						],
						isVariadic: true,
						interactsWithImage: true
					}
				]
			},
			// Page 1
			{
				title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
				images: ['/images/slide-image-1.png'],
				tables: [
					{
						headers: ["Nucleo", "Stato", "Lunghezza (cm)"],
						fields: [
							{
								type: 'text',
								fixedArgs: ["A", "B", "C", "D", "E", "F"]
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "assente", display: "assente" },
									{ value: "presente non valutabile PND", display: "presente non valutabile PND" },
									{ value: "presente non fuso PN", display: "presente non fuso PN" },
									{ value: "presente in fusione PIF", display: "presente in fusione PIF" },
									{ value: "presente fuso PF", display: "presente fuso PF" }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'number'
							} as FormTableNumberFieldTemplate
						]
					}
				]
			},
			// Page 2
			{
				title: "Completezza, qualità, colore generale",
				images: ['/images/slide-image-2.png'],
				tables: [
					{
						headers: ["Settore", "Presente/Assente", "Note"],
						fields: [
							{
								type: 'number',
								fixedArgs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
							} as FormTableNumberFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "Assente", display: "Assente" },
									{ value: "Presente", display: "Presente" }
								]
							} as FormTableDropdownFieldTemplate,
							{
								type: 'text'
							} as FormTableTextFieldTemplate
						]
					},
					{
						headers: ["Area", "Dettagli", "Colore"],
						fields: [
							{
								type: 'text',
								fixedArgs: ["A", "B", "C", "D", "E", "F"]
							} as FormTableTextFieldTemplate,
							{
								type: 'text'
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "da marrone a marrone scuro", display: "da marrone a marrone scuro" },
									{ value: "grigio", display: "grigio" },
									{ value: "naturale", display: "naturale" },
									{ value: "da arancione a marrone", display: "da arancione a marrone" },
									{ value: "da giallo ad arancione", display: "da giallo ad arancione" }
								]
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			},
			// Page 3
			{
				title: "Caratteri metrici",
				images: ['/images/slide-image-3.png', '/images/slide-image-4.png'],
				tables: [
					{
						headers: ["Codice Misura", "Nome Misura", "Misura (cm)"],
						fields: [
							{
								type: 'number',
								fixedArgs: ["64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74"]
							} as FormTableNumberFieldTemplate,
							{
								type: 'text',
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
							} as FormTableTextFieldTemplate,
							{
								type: 'number'
							} as FormTableNumberFieldTemplate
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
								type: 'text',
								fixedArgs: [
									"Accessory Sacroiliac Facet",
									"Pubic Spine",
									"Acetabular Crease",
									"Cotyloid bone"
								]
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{ value: "Assente", display: "Assente" },
									{ value: "Non valutabile", display: "Non valutabile" },
									{ value: "Presente", display: "Presente" }
								]
							} as FormTableDropdownFieldTemplate
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
				images: ["/images/slide-image-5.png"],
				tables: [
					{
						headers: ["#", "Classe", "Descrizione segni"],
						fields: [
							{
								type: 'text',
								fixedArgs: ["1", "2", "3"]
							} as FormTableTextFieldTemplate,
							{
								type: 'dropdown',
								dropdownArgs: [
									{
										value: "Soluzione di continuo",
										display: "Non valutabile",
										next: [{
											type: 'dropdown',
											dropdownArgs: [
												{
													value: "A tutto spessore e tutta circonferenza",
													display: "A tutto spessore e tutta circonferenza"
												},
												{
													value: "A tutto spessore e parziale circonferenza",
													display: "A tutto spessore e parziale circonferenza"
												},
												{
													value: "Soluzione di continuo interessante lo strato corticale a tutta circonferenza",
													display: "Soluzione di continuo interessante lo strato corticale a tutta circonferenza"
												},
												{
													value: "Soluzione di continuo interessante lo strato corticale a parziale circonferenza",
													display: "Soluzione di continuo interessante lo strato corticale a parziale circonferenza"
												},
												{
													value: "Soluzione di continuo interessante lo strato di osso trabecolare (visibili in RX e TC)",
													display: "Soluzione di continuo interessante lo strato di osso trabecolare (visibili in RX e TC)"
												},
												{
													value: "Multiple soluzioni di continuo (comminuzione)",
													display: "Multiple soluzioni di continuo (comminuzione)"
												}
											]
										} as FormTableDropdownFieldTemplate]
									},
									{
										value: "Perdita di sostanza",
										display: "Perdita di sostanza",
										next: [
											{ type: 'text' } as FormTableTextFieldTemplate
										]
									},
									{
										value: "Aspetto margine (esempio nested dropdown)",
										display: "Aspetto margine (esempio nested dropdown)",
										next: [{
											type: 'dropdown',
											dropdownArgs: [
												{
													value: "Aspetto della superficie di frattura (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													display: "Aspetto della superficie di frattura (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													next: [
														{ type: 'text' } as FormTableTextFieldTemplate
													]
												},
												{
													value: "Aspetto superficie di taglio (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													display: "Aspetto superficie di taglio (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
													next: [
														{ type: 'text' } as FormTableTextFieldTemplate
													]
												}
											]
										} as FormTableDropdownFieldTemplate]
									}
								]
							} as FormTableDropdownFieldTemplate
						]
					}
				]
			}
		]
	}
}
