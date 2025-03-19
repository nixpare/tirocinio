import { coccigeRinaldo2019, coccigeScheuerBlack2000 } from '../frontend/storage/coccige';
import { atlanteFusioneFazekas1978, atlanteProfiloFazekas1978, atlanteScheuerBlack2000, atlanteFordisc, atlantePatternLesivitàSegni } from '../frontend/storage/atlante';
import { femoreFusioneFazekas1978, femoreProfiloFazekas1978, femoreScheuerBlack2000, femoreFordisc, femorePurkait2003, femoreWilson2010 } from '../frontend/storage/femore';
import { AnatomStructData } from './AnatomStruct';
import { Body } from './Body';
import { farekasAtlante1, farekasAtlante2 } from '../frontend/storage/deduzione';
import { FormFieldSelectArgs } from './Form';

export type Programmable<T = Object> = (struct: AnatomStructData, body: Body, breadcrum: string[]) => T
export type ProgrammableElement<T = Object> = {
	id: string
	fn: Programmable<T>
}

export type DeductionResult = {
	result: string
}
export type DeductionFunction = Programmable<DeductionResult>
export type DeductionTableElem = string
export type DeductionTable = {
	headers?: string[]
	body: DeductionTableElem[][]
}
export type DeductionElement = ProgrammableElement<DeductionResult> & {
	hint?: DeductionTable
}

export const deductionFunctionMap: Record<string, DeductionElement> = {}

function loadDeductionFunctions() {
	// coccige
	deductionFunctionMap[coccigeScheuerBlack2000.id] = coccigeScheuerBlack2000
	deductionFunctionMap[coccigeRinaldo2019.id] = coccigeRinaldo2019

	// atlante
	deductionFunctionMap[atlanteFusioneFazekas1978.id] = atlanteFusioneFazekas1978
	deductionFunctionMap[atlanteProfiloFazekas1978.id] = atlanteProfiloFazekas1978
	deductionFunctionMap[atlanteScheuerBlack2000.id] = atlanteScheuerBlack2000
	deductionFunctionMap[atlanteFordisc.id] = atlanteFordisc

	// femore
	deductionFunctionMap[femoreFusioneFazekas1978.id] = femoreFusioneFazekas1978
	deductionFunctionMap[femorePurkait2003.id] = femorePurkait2003
	deductionFunctionMap[femoreProfiloFazekas1978.id] = femoreProfiloFazekas1978
	deductionFunctionMap[femoreScheuerBlack2000.id] = femoreScheuerBlack2000
	deductionFunctionMap[femoreFordisc.id] = femoreFordisc
	deductionFunctionMap[femoreWilson2010.id] = femoreWilson2010

	// Testing
	deductionFunctionMap[farekasAtlante1.id] = farekasAtlante1
	deductionFunctionMap[farekasAtlante2.id] = farekasAtlante2
}

export type SelectArgsFunction = Programmable<FormFieldSelectArgs>
export type SelectArgsElement = ProgrammableElement<FormFieldSelectArgs>

export const selectArgsFunctionMap: Record<string, SelectArgsFunction> = {}

function loadSelectArgsFunctions() {
	// atlante
	selectArgsFunctionMap[atlantePatternLesivitàSegni.id] = atlantePatternLesivitàSegni.fn
}

export function loadProgrammableFunctions() {
	loadDeductionFunctions()
	loadSelectArgsFunctions()
}

export function walkObject<T = Object>(obj: any, query: string, split: string = '.'): T | undefined {
	const steps = query.split(split)
	const value = steps.reduce<any>((prev, curr) => {
		if (prev == undefined)
			return prev

		return prev[curr]
	}, obj)

	return value
}

export function walkBreadcrumb(breadcrumb: string[], query: string, split: string = '.'): [string | undefined, string[]] {
	let i = 0;

	const steps = query.split(split)
	for (; i < steps.length; i++) {
		if (breadcrumb[i] != steps[i]) {
			return [undefined, breadcrumb.slice(i + 1)]
		}
	}

	return [breadcrumb[i], breadcrumb.slice(i + 1)]
}

export function walkSetObject<T>(obj: T, set: any, query: string, split: string = '.'): T {
	const steps = query.split(split)

	const value = steps.slice(0, -1).reduce<any>((prev, curr) => {
		return prev[curr]
	}, obj)
	value[steps[steps.length-1]] = set

	return obj
}
