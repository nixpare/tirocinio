import { createContext } from "react"
import { FormTemplate, FormData } from "./Form"
import { Updater } from "use-immer"

export type AnatomStruct = {
	type: AnatomStructType
	name: string
	form: FormTemplate
}

export type AnatomStructData = {
	type: AnatomStructType
	name: string
	form: FormData
}

export const AnatomStructDataContext = createContext<AnatomStructData | undefined>(undefined)

export type AnatomStructType = 'bone'

export function generateUpdateForm(update: Updater<AnatomStructData>): Updater<FormData> {
	return (updater) => {
		update(state => {
			if (typeof updater !== 'function') {
				state.form = updater
				return
			}

			updater(state.form)
		})
	}
}