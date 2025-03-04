import { current } from "immer";
import { DraftFunction, Updater } from "use-immer"

export type DeepUpdater<S> = (arg: S | DraftFunction<S>, action: UpdateAction, breadcrumb: string[]) => void;

type NonFunctionChilds<T extends object> = {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type UpdateAction = 'add' | 'set' | 'delete'

export function rootDeepUpdater<S>(update: Updater<S>, onChange: (data: S, action: UpdateAction, breadcrumb: string[]) => void): DeepUpdater<S> {
	return (deepUpdate, action, breadcrumb) => {
		update(data => {
			if (typeof deepUpdate !== 'function') {
				(data as S) = deepUpdate
			} else {
				// @ts-ignore
				deepUpdate(data)
			}

			onChange(current(data) as S, action, breadcrumb)
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
	const childUpdater: DeepUpdater<T[K]> = (updater, action, breadcrumb) => {
		updateParent(parent => {
			if (typeof updater !== 'function') {
				(parent as T)[child] = updater
				return
			}

			// @ts-ignore
			updater(parent[child])
		}, action, breadcrumb)
	}

	return childUpdater
}

export function prependDeepUpdater<S>(update: DeepUpdater<S>, extension: string[]): DeepUpdater<S> {
	return (extendedUpdate, action, breadcrumb) => {
		breadcrumb = [...extension, ...breadcrumb];
		update(extendedUpdate, action, breadcrumb);
	}
}
