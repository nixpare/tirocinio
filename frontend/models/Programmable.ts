import { coccigeRinaldo2019, coccigeScheuerBlack2000 } from '../storage/coccige';
import { atlanteFazekas1978, atlanteScheuerBlack2000, atlanteFordisc } from '../storage/atlante';
import { FormData } from './Form';

export type Programmable<T = Object> = (form: FormData) => T
export type ProgrammableElement<T = Object> = {
	id: string
	fn: Programmable<T>
}

export type DeductionResult = {
	result: string
}
export type DeductionFunction = Programmable<DeductionResult>
export type DeductionElement = ProgrammableElement<DeductionResult>
export const deductionMap: Record<string, DeductionFunction> = {}

export function loadDeductionFunctions() {
	deductionMap[coccigeScheuerBlack2000.id] = coccigeScheuerBlack2000.fn
	deductionMap[coccigeRinaldo2019.id] = coccigeRinaldo2019.fn
	deductionMap[atlanteFazekas1978.id] = atlanteFazekas1978.fn
	deductionMap[atlanteScheuerBlack2000.id] = atlanteScheuerBlack2000.fn
	deductionMap[atlanteFordisc.id] = atlanteFordisc.fn
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
