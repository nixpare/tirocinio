import { AnatomStructType } from './AnatomStruct';
import { FormFieldType } from './Form';

const anatomStructTypes: AnatomStructType[] = ['bone', 'exterior', 'viscera'];
export function isAnatomStructType(value: string): value is AnatomStructType {
	return anatomStructTypes.includes(value as AnatomStructType);
}

const formFieldTypes: FormFieldType[] = ['fixed', 'text', 'number', 'select', 'multi-select', 'expansion', 'deduction', 'group', 'reference'];
export function isFormFieldType(value: string): value is FormFieldType {
	return formFieldTypes.includes(value as FormFieldType);
}

export function convertLabelToID(label: string): string {
	return label.toLowerCase().replaceAll(' ', '_');
}