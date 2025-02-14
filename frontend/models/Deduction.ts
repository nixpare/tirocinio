import { coccigeRinaldo2019, coccigeScheuerBlack2000 } from '../storage/coccige';
import { FormData } from './Form';

export type DeductionFunction = (form: FormData) => string
export type DeductionElement = {
	id: string
	fn: DeductionFunction
}

export const deductionMap: Record<string, DeductionFunction> = {}

export function loadDeductionFunctions() {
	deductionMap[coccigeScheuerBlack2000.id] = coccigeScheuerBlack2000.fn
	deductionMap[coccigeRinaldo2019.id] = coccigeRinaldo2019.fn
}

export function walkObject<T = any>(obj: any, query: string): T | undefined {
	const steps = query.split('.')
	const value = steps.reduce<any>((prev, curr) => {
		if (prev == undefined)
			return prev

		return prev[curr]
	}, obj)

	return value
}
