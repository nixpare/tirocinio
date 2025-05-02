export const baseURL = 'http://labanof-backoffice.islab.di.unimi.it/api';

export type StrapiComponent = {
	id: number
}

export type StrapiDocument = StrapiComponent & {
	documentId: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}

export type StrapiImage = StrapiComponent & {
	documentId: string
	url: string
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

export type ValidateObjectListResult<T extends Object> = [
	res: T[] | undefined,
	err: ValidateObjectListError<T> | undefined
]
export type ValidateObjectListError<T extends Object> = {
	computed: Partial<T>[]
	error: Error
}

export function validateObjectList<T extends Object>(objs: Partial<T>[], validate: ValidateObjectFunc<T>): ValidateObjectListResult<T> {
	const error: ValidateObjectListError<T> = {
		computed: [],
		error: new Error()
	}
	
	for (const el of objs) {
		try {
			if (!validate(el)) {
				return [undefined, undefined];
			}

			error.computed.push(el)
		} catch (err) {
			error.error = (err as ValidateObjectError<T>).error;
			error.computed.push(el);
			return [undefined, error];
		}
	}

	return [objs as T[], undefined]
}

export function deepCopy<T>(a: T): T {
	return JSON.parse(JSON.stringify(a));
}
