import { BodyData } from "../models/Body";
import { Bone } from "../models/Skeleton";
import { DeductionElement, DeductionResult, walkBreadcrumb } from "../models/Programmable";
import { AnatomStructData } from "../models/AnatomStruct";
import { FormFieldTemplate } from "../models/Form";

export const farekasAtlante1: DeductionElement = {
	id: 'farekas_atlante_1',
	fn: (struct, body, breadcrumb) => {
		return FarekasAtlante(struct, body, breadcrumb, 'sec_1.test_1')
	}
}

export const farekasAtlante2: DeductionElement = {
	id: 'farekas_atlante_2',
	fn: (struct, body, breadcrumb) => {
		return FarekasAtlante(struct, body, breadcrumb, 'sec_2.test_2')
	}
}

function FarekasAtlante(struct: AnatomStructData, body: BodyData, breadcrumb: string[], breadcrumbQuery: string): DeductionResult {
	const name = walkObject<string>(body, 'generals.name')
	const age = walkObject<number>(body, 'generals.age')

	console.log(name, age)

	const [settore] = walkBreadcrumb(breadcrumb, breadcrumbQuery)
	const length = walkObject<number>(struct.form.sections, `sec_1.test_1.value.next.${settore}.0.value`)
	if (!length)
		return { result: 'Lunghezza non presente' }

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
		return { result: 'Nessuna età deducibile' }
	}

	return { result: possibleAges.toString() }
}

const metodoEtaPrenatale1: FormFieldTemplate = {
	type: 'select',
	header: 'Metodo età prenatale',
	selectArgs: {
		'farekas_1978_atlante': {
			display: 'Fazekas (1978)',
			next: [
				{
					type: 'deduction',
					header: 'Età prenatale',
					deductionID: farekasAtlante1.id
				}
			]
		},
		'custom_method': {
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
	}
}

const metodoEtaPrenatale2: FormFieldTemplate = {
	type: 'select',
	header: 'Metodo età prenatale',
	selectArgs: {
		'farekas_1978_atlante': {
			display: 'Fazekas (1978)',
			next: [
				{
					type: 'deduction',
					header: 'Età prenatale',
					deductionID: farekasAtlante2.id
				}
			]
		},
		'custom_method': {
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
	}
}

export const deduzione: Bone = {
	type: 'bone',
	name: 'Osso con Deduzione',
	form: {
		title: "Osso con Deduzione",
		sections: [
			{
				id: 'sec_1',
				title: 'Sezione Deduzione',
				starters: [
					{
						type: 'multi-select',
						starterID: 'test_1',
						header: 'Test Deduzione',
						selectArgs: {
							'a': {
								display: 'A',
								next: [
									{
										type: 'number',
										header: 'Lunghezza massima (mm)'
									},
									metodoEtaPrenatale1,
									{
										type: 'text',
										header: 'Commenti'
									}
								]
							},
							'b': {
								display: 'B',
								next: [
									{
										type: 'number',
										header: 'Lunghezza massima (mm)'
									},
									metodoEtaPrenatale1,
									{
										type: 'text',
										header: 'Commenti'
									}
								]
							},
							'c': {
								display: 'C',
								next: [
									{
										type: 'number',
										header: 'Lunghezza massima (mm)'
									},
									metodoEtaPrenatale1,
									{
										type: 'text',
										header: 'Commenti'
									}
								]
							}
						}
					}
				]
			},
			{
				id: 'sec_2',
				title: 'Altra Sezione',
				starters: [
					{
						type: 'multi-select',
						starterID: 'test_2',
						header: 'Test Deduzione da altra sezione',
						selectArgs: {
							'a': {
								display: 'A',
								next: [metodoEtaPrenatale2]
							},
							'b': {
								display: 'B',
								next: [metodoEtaPrenatale2]
							},
							'c': {
								display: 'C',
								next: [metodoEtaPrenatale2]
							}
						}
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
