export type StrapiComponent = {
	id: number
}

export type StrapiDocument = StrapiComponent & {
	documentId: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}

export type ValidateObjectResult<T extends Object> = [
	res: T | undefined,
	err: ValidateObjectError<T> | undefined
]
export type ValidateObjectError<T extends Object> = {
	computed: Partial<T>
	error: Error
}
export type ValidateObjectFunc<T extends Object> = (obj: Partial<T>) => obj is T

export function validateObject<T extends Object>(obj: Partial<T>, validate: ValidateObjectFunc<T>): ValidateObjectResult<T> {
	try {
		if (validate(obj)) {
			return [obj, undefined];
		}
	} catch (err) {
		return [undefined, err as ValidateObjectError<T>];
	}

	return [undefined, undefined];
}

export function convertLabelToID(label: string): string {
	return label.toLowerCase().replaceAll(' ', '_');
}
