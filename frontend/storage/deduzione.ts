import { useContext } from "react";
import { BodyDataContext } from "../components/Body/Body";
import { FormData, FormTableDeductionFieldTemplate, FormTableDropdownFieldTemplate, FormTableNumberFieldTemplate } from "../models/Form";
import { Bone } from "../models/Skeleton";
import { DeductionElement } from "../models/Deduction";

export const farekasAtlante: DeductionElement = {
	id: 'farekas_atlante',
	fn: FarekasAtlante
}

function FarekasAtlante(anatom: FormData, rowIdx: number): string {
	const body = useContext(BodyDataContext)
	if (!body)
		throw new Error('informazioni sul corpo non trovate')

	const name = walkObject<string>(body, 'generals.name')
	const age = walkObject<number>(body, 'generals.age')

	console.log(name, age)

	const section = 0
	const table = 0
	const row = walkObject(anatom, `sections.${section}.${table}.${rowIdx}`)

	const stateField = 1
	const lengthField = 0
	const length = walkObject(row, `${stateField}.value.next.${lengthField}.value`) as number | undefined

	/* const section = data.sections?.[0]
	const table = section?.[0]
	const row = table?.[rowIdx]
	const state = row?.[1]?.value as FormTableDropdownFieldValue | undefined
	const length = state?.next?.[0]?.value as number | undefined */

	if (!length)
		return 'Lunghezza non presente'

	const possibleAges = []

	if (length >= 3.8 && length <= 5.0) {
		possibleAges.push(16)
	}
	if (length >= 4.9 && length <= 5.9) {
		possibleAges.push(18)
	}
	if (length >= 5.5 && length <= 6.9) {
		possibleAges.push(20)
	}
	if (length >= 6.5 && length <= 7.9) {
		possibleAges.push(22)
	}
	if (length >= 6.9 && length <= 9.1) {
		possibleAges.push(24)
	}

	if (possibleAges.length == 0) {
		return 'Nessuna età deducibile'
	}

	return possibleAges.toString()
}

const metodoEtaPrenatale = {
	type: 'dropdown',
	header: 'Metodo età prenatale',
	dropdownArgs: [
		{
			value: 'farekas_1978_atlante',
			display: 'Fazekas (1978)',
			next: [
				{
					type: 'deduction',
					header: 'Età prenatale',
					deductionID: farekasAtlante.id
				} as FormTableDeductionFieldTemplate
			]
		},
		{
			value: 'custom_method',
			display: 'Altro',
			next: [
				{
					type: 'text',
					header: 'Nome metodo (anno)'
				},
				{
					type: 'text',
					header: 'Età prenatale'
				}
			]
		}
	]
} as FormTableDropdownFieldTemplate

export const deduzioneBone: Bone = {
	type: 'bone',
	name: 'Osso con Deduzione',
	template: {
		title: "Osso con Deduzione",
		sections: [
			{
				title: 'Fusione e Sviluppo Atlante',
				tables: [
					{
						headers: ['Centri di ossifocazione', 'Stato'],
						fields: [
							{
								type: 'text',
								fixedArgs: ['A', 'B', 'C'],
							},
							{
								type: 'dropdown',
								defaultValue: {
									type: 'dropdown',
									display: 'Tutto Presente',
									value: {
										selection: 'presente_fuso'
									}
								},
								dropdownArgs: [
									{
										value: 'assente_per_immaturità',
										display: 'Assente per Immaturità'
									},
									{
										value: 'assente_per_tafonomia',
										display: 'Assente per Tafonomia'
									},
									{
										value: 'assente_non_valutabile',
										display: 'Assente non valutabile'
									},
									{
										value: 'presente_ma_fusione_non_valutabile',
										display: 'Presente ma fusione non valutabile'
									},
									{
										value: 'presente_non_fuso',
										display: 'Presente non Fuso',
										next: [
											{
												type: 'number',
												header: 'Lunghezza massima (mm)'
											} as FormTableNumberFieldTemplate,
											metodoEtaPrenatale,
											{
												type: 'text',
												header: 'Commenti'
											}
										]
									},
									{
										value: 'presente_in_fusione',
										display: 'Presente in Fusione'
									},
									{
										value: 'presente_fuso',
										display: 'Presente Fuso'
									}
								]
							} as FormTableDropdownFieldTemplate
						]
					},
					{
						headers: ['Deduzione da sopra', 'Valore'],
						fields: [
							{
								type: 'blank',
								fixedArgs: ['A', 'B', 'C']
							},
							{
								...metodoEtaPrenatale,
								defaultValue: {
									type: 'dropdown',
									value: {
										selection: 'farekas_1978_atlante'
									}
								}
							}
						]
					}
				]
			}
		]
	}
}

function walkObject<T = any>(obj: any, query: string): T | undefined {
	const steps = query.split('.')
	const value = steps.reduce<any>((prev, curr) => {
		if (prev == undefined)
			return prev

		return prev[curr]
	}, obj)

	return value
}
