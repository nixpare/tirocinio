import { Updater, useImmer } from "use-immer"
import { FormTemplate, FormData, FormFieldSelectArgs, FormTextFieldData, FormSelectFieldData, FormTextFieldTemplate, FormSelectFieldTemplate } from "../../../models/Form"
import { Body, BodyContext, BodyContextProvider } from "../../../models/Body"
import { EditModeContext, Form } from "../../components/Form/Form"
import { SelectArgsElement, walkObject } from "../../../models/Programmable";
import { AnatomStruct, AnatomStructData, AnatomStructDataContext } from "../../../models/AnatomStruct";
import { useContext, useEffect } from "react";
import { convertAnatomStruct } from "./conversion";
import { convertLabelToID } from "../../../models/conversion";
import { childUpdater } from "../../utils/updater";
import Box from "@mui/material/Box/Box";
import initialSections from "./initial";
import { NavigationContextProvider } from "../../App";

const testBody: Body = {
	generals: {
		name: "Test body",
		age: 100
	},
	bones: {},
	viscus: {},
	exteriors: {}
}

export function TemplateHome() {
	const navigationContext = useContext(NavigationContextProvider)
	
	useEffect(() => {
		navigationContext?.([
			{
				segment: '',
				title: 'Home',
				icon: <i className="fa-solid fa-house"></i>
			},
			{
				segment: 'template',
				title: 'Template editor',
				icon: <i className="fa-solid fa-screwdriver-wrench"></i>
			},
			{
				kind: 'divider'
			},
			{
				segment: 'body/Test body',
				title: 'Test body',
				icon: <i className="fa-solid fa-user"></i>
			}
		])
	}, [])

	const [anatomStruct, updateAnatomStruct] = useImmer<AnatomStruct | undefined>(undefined);
	const [anatomStructData, updateAnatomStructData] = useImmer<AnatomStructData>({
		type: 'bone',
		name: 'Placeholder',
		form: {
			templ: {
				title: 'Placeholder',
				sections: []
			}
		}
	});
	const updateForm = childUpdater(updateAnatomStructData, 'form')

	useEffect(() => {
		if (!anatomStruct) {
			return;
		}

		updateAnatomStructData({
			type: anatomStruct.type,
			name: anatomStruct.name,
			form: {
				templ: anatomStruct.form,
				sections: {}
			}
		})
	}, [anatomStruct])

	const [body, updateBody] = useImmer(testBody);
	const bodyContext: BodyContext = {
		body: body,
		updateBody: updateBody
	}

	return (
		<EditModeContext.Provider value={true}>
			<BodyContextProvider.Provider value={bodyContext}>
				<Box sx={{
					fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
					display: 'flex',
					flexDirection: 'column',
					gap: '4em',
					padding: '2em'
				}}>
					<Template updateAnatomStruct={updateAnatomStruct} />
					{anatomStructData && <Form
						form={anatomStructData.form} update={updateForm}
						initialEditMode
					/>}

					<button onClick={() => { console.log(anatomStructData) }}>LOG in Console</button>
				</Box>
			</BodyContextProvider.Provider>
		</EditModeContext.Provider>
	)
}

export function Template({ updateAnatomStruct }: {
	updateAnatomStruct: Updater<AnatomStruct | undefined>
}) {
	const [data, updateData] = useImmer<FormData>({
		templ: template,
		sections: initialSections
	});

	useEffect(() => {
		//console.log(data.sections)
		const anatomStruct = convertAnatomStruct(data)
		updateAnatomStruct(anatomStruct)
	}, [data])

	return (
		<AnatomStructDataContext.Provider
			//@ts-ignore
			value={{ form: data }}
		>
			<Form
				form={data}
				update={updateData}
				initialEditMode={true}
			/>
		</AnatomStructDataContext.Provider>
	)
}

export const templateFieldScopeSelector: SelectArgsElement = {
	id: 'field_scope_selector_args',
	fn: fieldScopeSelectorArgs
}

export type FieldInitiatorData = [FormTextFieldData, FormSelectFieldData]
const fieldInitiator: [FormTextFieldTemplate, FormSelectFieldTemplate] = [
	{
		id: 'header',
		type: 'text',
		header: 'Intestazione'
	},
	{
		id: 'type',
		type: 'select',
		header: 'Tipo campo',
		selectArgs: [
			{
				value: 'fixed',
				display: 'Fisso',
			},
			{
				value: 'text',
				display: 'Testo',
			},
			{
				value: 'number',
				display: 'Numero',
			},
			{
				value: 'select',
				display: 'Selezione',
			},
			{
				value: 'multi-select',
				display: 'Multi-Selezione',
			},
			{
				value: 'expansion',
				display: 'Espansione'
			},
			{
				value: 'deduction',
				display: 'Metodo'
			}
		],
		nextArgs: [
			{
				options: ['fixed'],
				next: [
					{
						id: 'value',
						type: 'text',
						header: 'Valore'
					}
				]
			},
			{
				options: ['text'],
				next: [
					{
						id: 'multiline',
						type: 'select',
						header: 'Multilinea?',
						selectArgs: [
							{ value: 'yes', display: 'Sì' },
							{ value: 'no', display: 'No' }
						]
					}
				]
			},
			{
				options: ['number'],
				next: [
					{
						id: 'min',
						type: 'number',
						header: 'Minimo',
					},
					{
						id: 'max',
						type: 'number',
						header: 'Massimo',
					}
				]
			},
			{
				options: ['select', 'multi-select'],
				next: [
					{
						id: 'select_options',
						type: 'expansion',
						header: 'Opzioni',
						expansionArgs: [
							{
								id: 'value',
								type: 'text',
								header: 'Valore'
							}
						]
					},
					{
						id: 'next_fields',
						type: 'expansion',
						header: 'Prossimi Campi',
						expansionArgs: [
							{
								id: 'values',
								type: 'multi-select',
								header: 'Valori',
								selectArgs: templateFieldScopeSelector.id
							}
						],
						next: [
							{
								id: 'next_new_fields',
								type: 'expansion',
								header: 'Campi',
								expansionArgs: [] // Filled below because of recursive call
							}
						]
					}
				]
			},
			{
				options: ['expansion'],
				next: [
					{
						id: 'expansion_incremental',
						type: 'select',
						header: 'Incrementale?',
						selectArgs: [
							{ value: 'yes', display: 'Sì' },
							{ value: 'no', display: 'No' }
						]
					},
					{
						id: 'expansion_prefix',
						type: 'text',
						header: 'Prefisso?',
					},
					{
						id: 'expansion_fixed',
						type: 'expansion',
						header: 'Campi Fissati',
						incremental: true,
						expansionArgs: [
							{
								id: 'expansion_fixed_fields',
								type: 'expansion',
								header: 'Campi',
								expansionArgs: [] // Filled below because of recursive call
							}
						]
					},
					{
						id: 'expansion_args',
						type: 'expansion',
						header: 'Campi Aggiuntivi',
						expansionArgs: [], // Filled below because of recursive call
					},
					{
						id: 'expansion_next',
						type: 'expansion',
						header: 'Campi Successivi',
						expansionArgs: [] // Filled below because of recursive call
					}
				]
			},
			{
				options: ['deduction'],
				next: [
					{
						id: 'deduction_id',
						type: 'text',
						header: 'Nome metodo'
					}
				]
			},
		]
	}
]

//@ts-ignore
fieldInitiator[1].nextArgs[3].next[1].next[0].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[2].expansionArgs[0].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[3].expansionArgs = fieldInitiator
//@ts-ignore
fieldInitiator[1].nextArgs[4].next[4].expansionArgs = fieldInitiator

function fieldScopeSelectorArgs(struct: AnatomStructData, _: Body, breadcrumb: string[]): FormFieldSelectArgs {
	const form = struct.form;

	const commonPath = breadcrumb.slice(0, breadcrumb.lastIndexOf('next_fields'))
	const commonObject = walkObject(form.sections, commonPath.join('.'))
	const fields = walkObject<FormTextFieldData[][]>(commonObject, 'select_options.value.additional')

	if (!fields) return []

	const values: FormFieldSelectArgs = fields
		.map(field => {
			return field[0].value as string
		})
		.filter(value => value != undefined)
		.map(value => ({
			value: convertLabelToID(value),
			display: value
		}))

	return values
}

const template: FormTemplate = {
	title: 'Template',
	sections: [
		{
			id: 'anatom_struct',
			title: 'Struttura Anatomica',
			starters: [
				{
					id: 'name_and_type',
					type: 'expansion',
					header: 'Nome e Tipo',
					fixed: [
						[
							{
								id: 'name',
								type: 'text',
								header: 'Nome'
							},
							{
								id: 'type',
								type: 'select',
								header: 'Tipo',
								selectArgs: [
									{ value: 'bone', display: 'Osso' },
									{ value: 'viscera', display: 'Viscera' },
									{ value: 'exterior', display: 'Esterno' }
								]
							}
						]
					]
				},
				{
					id: 'sections',
					type: 'expansion',
					header: 'Sezioni',
					expansionArgs: [
						{
							id: 'title',
							type: 'text',
							header: 'Titolo Sezione',
						}
					],
					next: [
						{
							id: 'new_fields',
							type: 'expansion',
							header: 'Campi iniziali',
							expansionArgs: fieldInitiator
						}
					]
				}
			]
		}
	]
}
