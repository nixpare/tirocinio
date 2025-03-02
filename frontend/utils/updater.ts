import { Updater } from "use-immer"

type NonFunctionChilds<T extends object> = {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export function generateChildUpdater<T extends object, K extends NonFunctionChilds<T>>(updateParent: Updater<T>, child: K): Updater<T[K]> {
	const childUpdater: Updater<T[K]> = (updater) => {
		updateParent(parent => {
			if (typeof updater !== 'function') {
				(parent as T)[child] = updater
				return
			}

			// @ts-ignore
			updater(parent[child])
		})
	}

	return childUpdater
}