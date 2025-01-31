import { farekasAtlante } from '../storage/deduzione';
import { FormData } from './Form';

export type DeductionFunction = (form: FormData, rowIdx: number) => string
export type DeductionElement = {
	id: string
	fn: DeductionFunction
}

export const deductionMap: Record<string, DeductionFunction> = {}

export function loadDeductionFunctions() {
	deductionMap[farekasAtlante.id] = farekasAtlante.fn
}
