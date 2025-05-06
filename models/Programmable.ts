import { AnatomStructData } from './AnatomStruct';
import { Body } from './Body';
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
	
}

export type SelectArgsFunction = Programmable<FormFieldSelectArgs>
export type SelectArgsElement = ProgrammableElement<FormFieldSelectArgs>

export const selectArgsFunctionMap: Record<string, SelectArgsFunction> = {}

function loadSelectArgsFunctions() {

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
	value[steps[steps.length - 1]] = set

	return obj
}
