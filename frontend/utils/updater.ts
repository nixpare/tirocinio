import { current } from "immer";
import { DraftFunction, Updater } from "use-immer"

export type DeepUpdater<S> = (arg: S | DraftFunction<S>, ...breadcrumb: string[]) => void;

type NonFunctionChilds<T extends object> = {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export function rootDeepUpdater<S>(update: Updater<S>, onChange: (data: S, ...breadcrumb: string[]) => void): DeepUpdater<S> {
	return (deepUpdate, ...breadcrumb) => {
		update(data => {
			if (typeof deepUpdate !== 'function') {
				(data as S) = deepUpdate
			} else {
				// @ts-ignore
				deepUpdate(data)
			}

			onChange(current(data) as S, ...breadcrumb)
		})
	}
}

export function childUpdater<T extends object, K extends NonFunctionChilds<T>>(updateParent: Updater<T>, child: K): Updater<T[K]> {
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

export function childDeepUpdater<T extends object, K extends NonFunctionChilds<T>>(updateParent: DeepUpdater<T>, child: K): DeepUpdater<T[K]> {
	const childUpdater: DeepUpdater<T[K]> = (updater, ...breadcrumb) => {
		updateParent(parent => {
			if (typeof updater !== 'function') {
				(parent as T)[child] = updater
				return
			}

			// @ts-ignore
			updater(parent[child])
		}, ...breadcrumb)
	}

	return childUpdater
}
