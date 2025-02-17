import { coccigeRinaldo2019, coccigeScheuerBlack2000 } from '../storage/coccige';
import { atlanteFusioneFazekas1978, atlanteProfiloFazekas1978, atlanteScheuerBlack2000, atlanteFordisc, atlantePatternLesivitàSegni } from '../storage/atlante';
import { femoreFusioneFazekas1978, femoreProfiloFazekas1978, femoreScheuerBlack2000, femoreFordisc, femorePurkait2003, femoreWilson2010 } from '../storage/femore';
import { AnatomStructData } from './AnatomStruct';
import { BodyData } from './Body';
import { farekasAtlante1, farekasAtlante2 } from '../storage/deduzione';
import { FormFieldSelectArgs } from './Form';

export type Programmable<T = Object> = (struct: AnatomStructData, body: BodyData, breadcrum: string[]) => T
export type ProgrammableElement<T = Object> = {
	id: string
	fn: Programmable<T>
}

export type DeductionResult = {
	result: string
}
export type DeductionFunction = Programmable<DeductionResult>
export type DeductionElement = ProgrammableElement<DeductionResult>
export const deductionFunctionMap: Record<string, DeductionFunction> = {}
function loadDeductionFunctions() {
	// coccige
	deductionFunctionMap[coccigeScheuerBlack2000.id] = coccigeScheuerBlack2000.fn
	deductionFunctionMap[coccigeRinaldo2019.id] = coccigeRinaldo2019.fn

	// atlante
	deductionFunctionMap[atlanteFusioneFazekas1978.id] = atlanteFusioneFazekas1978.fn
	deductionFunctionMap[atlanteProfiloFazekas1978.id] = atlanteProfiloFazekas1978.fn
	deductionFunctionMap[atlanteScheuerBlack2000.id] = atlanteScheuerBlack2000.fn
	deductionFunctionMap[atlanteFordisc.id] = atlanteFordisc.fn

	// femore
	deductionFunctionMap[femoreFusioneFazekas1978.id] = femoreFusioneFazekas1978.fn
	deductionFunctionMap[femorePurkait2003.id] = femorePurkait2003.fn
	deductionFunctionMap[femoreProfiloFazekas1978.id] = femoreProfiloFazekas1978.fn
	deductionFunctionMap[femoreScheuerBlack2000.id] = femoreScheuerBlack2000.fn
	deductionFunctionMap[femoreFordisc.id] = femoreFordisc.fn
	deductionFunctionMap[femoreWilson2010.id] = femoreWilson2010.fn

	// Testing
	deductionFunctionMap[farekasAtlante1.id] = farekasAtlante1.fn
	deductionFunctionMap[farekasAtlante2.id] = farekasAtlante2.fn
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
