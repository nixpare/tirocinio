import { convertLabelToID } from "../models/conversion";
import { formFieldIsDeduction, formFieldIsExpansion, formFieldIsMultiSelect, formFieldIsNumber, formFieldIsReference, formFieldIsSelect, formFieldIsText, FormFieldSelectArgs, FormFieldTemplate, FormFieldType } from "../models/Form";
import { deepCopy, StrapiComponent } from "./Strapi";

export type StrapiCampo = StrapiComponent & {
	NomeCampo: string
	TipoCampo: StrapiTipoCampo
	ListaElementi: StrapiElemento[]
}

export enum StrapiTipoCampo {
	Text = 'text',
	Number = 'number',
	Select = 'select',
	MultiSelect = 'select-multi',
	TextMulti = 'text-multi',
	ID = 'ID',
	Reference = 'reference',
	Method = 'method'
}

type StrapiElemento = StrapiComponent & {
	NomeCampo: string
}

type StrapiCampoNodeSelector = {
	type: 'any' | 'foreach' | 'value'
	value?: string
}

type StrapiCampoNode = FormFieldTemplate & {
	path: {
		name: string
		selector?: StrapiCampoNodeSelector
	}[]
}

export function rebuildStrapiCampoTree(doc: StrapiCampo[]): StrapiCampoNode[] {
	const nodes: (StrapiCampoNode | undefined)[] = []

	doc.forEach(campo => {
		campo.NomeCampo = campo.NomeCampo.trim()
		campo.ListaElementi = campo.ListaElementi.map(elemento => {
			elemento.NomeCampo = elemento.NomeCampo.trim()
			return elemento
		})
		if (campo.TipoCampo == undefined) {
			campo.TipoCampo = StrapiTipoCampo.Text
		}

		const path: StrapiCampoNode["path"] = []

		let nextChar = 0;
		let segment = -1;
		while (nextChar >= 0 && nextChar < campo.NomeCampo.length) {
			let newNextChar = campo.NomeCampo.indexOf('/', nextChar);
			if (newNextChar == -1) {
				newNextChar = campo.NomeCampo.length
			}

			const needle = campo.NomeCampo.slice(nextChar, newNextChar);
			nextChar = newNextChar + 1;

			if (needle === '') {
				if (path[segment]?.selector?.type != undefined) {
					continue;
				}

				path[segment].selector = {
					type: "foreach"
				}
				continue;
			}

			if (needle.startsWith(':')) {
				path[segment].selector = {
					type: "value",
					value: needle.slice(1)
				}
				continue;
			}

			if (segment >= 0 && path[segment].selector == undefined) {
				path[segment].selector = {
					type: "any"
				}
			}

			path.push({
				name: needle
			})
			segment++;
		}

		const name = path[path.length - 1].name

		const node: StrapiCampoNode = {
			id: convertLabelToID(name),
			type: convertStrapiTipoCampo(campo.TipoCampo),
			header: name,
			path: path
		}

		if (formFieldIsText(node)) {
			if (campo.ListaElementi.length == 0) {
				nodes.push(node)
				return
			}

			const group: StrapiCampoNode = {
				...node,
				type: 'group',
				group: campo.ListaElementi.map(elemento => ({
					id: convertLabelToID(elemento.NomeCampo),
					type: node.type,
					header: elemento.NomeCampo
				}))
			}

			nodes.push(group)
			return
		}

		if (formFieldIsNumber(node)) {
			if (campo.ListaElementi.length == 0) {
				nodes.push(node)
				return
			}

			const group: StrapiCampoNode = {
				...node,
				type: 'group',
				group: campo.ListaElementi.map(elemento => ({
					id: convertLabelToID(elemento.NomeCampo),
					type: node.type,
					header: elemento.NomeCampo
				}))
			}

			nodes.push(group)
			return
		}

		if (formFieldIsSelect(node) || formFieldIsMultiSelect(node)) {
			const selectArgs: FormFieldSelectArgs = []

			campo.ListaElementi.forEach(elemento => {
				if (elemento.NomeCampo === 'Applica a tutti' && node.type === 'multi-select') {
					node.selectAllButton = true;
					return;
				}

				selectArgs.push({
					value: convertLabelToID(elemento.NomeCampo),
					display: elemento.NomeCampo,
				})
			})

			node.selectArgs = selectArgs

			nodes.push(node)
			return
		}

		if (formFieldIsExpansion(node)) {
			switch (campo.TipoCampo) {
				case StrapiTipoCampo.TextMulti:
					if (campo.ListaElementi.length == 0) {
						throw new Error('did not expect to receive empty ListaElementi for text-multi field')
					}

					if (campo.ListaElementi.length == 1) {
						const elem = campo.ListaElementi[0];
						node.expansionArg = {
							id: convertLabelToID(elem.NomeCampo),
							type: 'text',
							header: elem.NomeCampo
						}

						nodes.push(node)
						return;
					}
					
					const group: StrapiCampoNode = {
						...node,
						type: 'group',
						group: campo.ListaElementi.map(elemento => ({
							id: convertLabelToID(elemento.NomeCampo),
							type: 'text',
							header: elemento.NomeCampo,
						}))
					}

					nodes.push(group)
					return;

				case StrapiTipoCampo.ID:
					node.incremental = true
					node.expansionArg = {
						id: 'ID',
						type: 'fixed',
					}

					nodes.push(node)
					return;
				
				default:
					throw new Error(`field ${campo.TipoCampo} not implemented for expansion field`)
			}

			throw new Error('unreachable')
			return;
		}

		if (formFieldIsReference(node)) {
			if (campo.ListaElementi.length < 1) {
				throw new Error('was not expecting empty campo.ListaElementi.length for reference fields')
			}

			/* if (campo.ListaElementi.length === 1) {
				node.referenceID = convertLabelToID(campo.ListaElementi[0].NomeCampo)
				node.header = campo.ListaElementi[0].NomeCampo
				nodes.push(node)
				return;
			} */

			const group: StrapiCampoNode = {
				...node,
				type: 'group',
				header: undefined,
				group: campo.ListaElementi.map(elemento => ({
					id: convertLabelToID(elemento.NomeCampo) + "_reference",
					type: 'reference',
					header: elemento.NomeCampo,
					referenceID: convertLabelToID(elemento.NomeCampo)
				}))
			}

			nodes.push(group)
			return;
		}

		if (formFieldIsDeduction(node)) {
			if (campo.ListaElementi.length !== 1) {
				throw new Error('was not expecting campo.ListaElementi.length to differ from 1 for deduction fields')
			}

			node.deductionID = convertLabelToID(campo.ListaElementi[0].NomeCampo)

			nodes.push(node)
			return;
		}

		throw new Error(`unexpected field with type ${node.type}`)
	})

	console.log('intermediary result:', deepCopy(nodes))

	for (const i in nodes) {
		if (nodes[i] == undefined)
			continue;

		rebuildTree(nodes[i], nodes);
		delete nodes[i]
	}

	return nodes.filter(node => node != undefined);
}

function rebuildTree(node: StrapiCampoNode, prev: (FormFieldTemplate | undefined)[]) {
	const { path, ...field } = node;
	const selector = path[0].selector;
	const nextKey = convertLabelToID(path[0].name);

	if (path.length == 1) {
		prev.push(field)
		return;
	}

	path.shift()

	if (selector == undefined) {
		console.error(path, nextKey, selector, prev)
		throw new Error('node selector should not be undefined');
	}

	const parent = prev.find(el => el?.id === nextKey);
	if (parent == undefined) {
		// TODO: this should be fatal
		console.error('parent node should not be undefined, skipping', nextKey, deepCopy(field), deepCopy(prev), deepCopy(path), selector)
		//throw new Error('parent node should not be undefined');
		return
	}

	if (formFieldIsText(parent) || formFieldIsNumber(parent)) {
		// TODO: understand the difference between '/' and '//' for number and text fields
		selector.type = 'any'
	}

	if (formFieldIsSelect(parent) || formFieldIsMultiSelect(parent)) {
		const selectArgs = parent.selectArgs as FormFieldSelectArgs

		if (parent.nextArgs == undefined) {
			parent.nextArgs = []
		}

		switch (selector.type) {
			case "foreach":
				for (const arg of selectArgs) {
					let next = parent.nextArgs.find(nextArg => nextArg.options.includes(arg.value))
					if (next == undefined) {
						next = {
							options: [arg.value],
							next: []
						}
						parent.nextArgs.push(next)
					}

					rebuildTree({ path: [...path], ...field }, next.next)
				}

				return;
			case "value":
				const value = selector.value ? convertLabelToID(selector.value) : undefined
				if (!value) throw new Error(`value of selector with type "value" is undefined`)

				let next = parent.nextArgs.find(nextArg => nextArg.options.includes(value))
				if (next == undefined) {
					next = {
						options: [value],
						next: []
					}
					parent.nextArgs.push(next)
				}

				rebuildTree({ path: [...path], ...field }, next.next)
				return;
		}
	}

	if (formFieldIsExpansion(parent)) {
		switch (selector.type) {
			case 'value':
				// TODO: understand the importance and meaning of the :<value> selector for expansion fields (text-multi, ID, ecc.)
				/* if (selector.value !== 'ID') {
					throw new Error(`unknown selector value ${selector.value} for expansion field`)
				} */

				if (parent.next == undefined) {
					parent.next = []
				}

				rebuildTree({ path: [...path], ...field }, parent.next)
				return;

			default:
				throw new Error(`unknown selector type ${selector.type} for expansion field`)
		}
	}

	switch (selector.type) {
		case "any":
			if (parent.nextAnyValue == undefined) {
				parent.nextAnyValue = []
			}

			rebuildTree({ path: [...path], ...field }, parent.nextAnyValue)
			return
		case "foreach":
			console.log(`foreach selector not supported for field ${parent.type}, skipping`, parent, field, path, selector)
			//throw new Error(`foreach selector not supported for field ${parent.type}`)
			return;
		case "value":
			console.log(`value selector not supported for field ${parent.type}, skipping`, parent, field, path, selector)
			//throw new Error(`value selector not supported for field ${parent.type}`)
			return;
	}
}

function convertStrapiTipoCampo(typ: StrapiTipoCampo): FormFieldType {
	switch (typ) {
		case StrapiTipoCampo.Text:
			return 'text';
		case StrapiTipoCampo.Number:
			return 'number';
		case StrapiTipoCampo.Select:
			return 'select';
		case StrapiTipoCampo.MultiSelect:
			return 'multi-select';
		case StrapiTipoCampo.TextMulti:
			return 'expansion';
		case StrapiTipoCampo.ID:
			return 'expansion';
		case StrapiTipoCampo.Reference:
			// TODO: to be implemented
			return 'reference';
		case StrapiTipoCampo.Method:
			// TODO: to be implemented
			return 'deduction';
	}
}

export function validateFormField(field: Partial<FormFieldTemplate>): field is FormFieldTemplate {
	if (field.id == undefined) throw new Error('id in FormFieldTemplate is not defined');
	//if (field.title == undefined) throw new Error('title in FormFieldTemplate is not defined');
	//if (field.starters == undefined) throw new Error('starters in FormFieldTemplate are not defined');

	return true;
}
