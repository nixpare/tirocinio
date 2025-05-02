import { convertLabelToID } from "../models/conversion";
import { formFieldIsExpansion, formFieldIsMultiSelect, formFieldIsNumber, formFieldIsSelect, formFieldIsText, FormFieldSelectArgs, FormFieldTemplate, FormFieldType } from "../models/Form";
import { StrapiComponent } from "./Strapi";

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
	ID = 'ID'
	// TODO: implementare il campo 'ID'
	// TODO: chiedere che cosa sia un tipo campo 'text-multi'
	// TODO: capire meglio il campo 'reference'
	// TODO: implementare il campo 'method'
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

		if (formFieldIsSelect(node) || formFieldIsMultiSelect(node)) {
			const selectArgs: FormFieldSelectArgs = []

			campo.ListaElementi.forEach(elemento => {
				if (elemento.NomeCampo === 'Applica a tutti') {
					//TODO: vedere se aggiungere un modo per attivare/disattivare il 'seleziona tutti'
					//node.selectAllButton = true;
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
					node.expansionArgs = campo.ListaElementi.map(elemento => ({
						id: convertLabelToID(elemento.NomeCampo),
						type: 'text',
						header: elemento.NomeCampo,
					}))

					nodes.push(node)
					break;

				case StrapiTipoCampo.ID:
					node.incremental = true

					nodes.push(node)
					break;
			}

			return;
		}

		nodes.push(node)
	})

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
		console.error(prev, path, nextKey, selector, prev)
		throw new Error('parent node should not be undefined');
	}

	if (formFieldIsSelect(parent) || formFieldIsMultiSelect(parent)) {
		const selectArgs = parent.selectArgs as FormFieldSelectArgs

		if (parent.nextArgs == undefined) {
			parent.nextArgs = []
		}

		switch (selector.type) {
			case "any":
				if (parent.nextAnyValue == undefined) {
					parent.nextAnyValue = []
				}

				console.log(field, parent)

				rebuildTree({ path: [...path], ...field }, parent.nextAnyValue)
				break;
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

				break;
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
				break;
		}

		return;
	}

	switch (selector.type) {
		case "any":
			if (parent.nextAnyValue == undefined) {
				parent.nextAnyValue = []
			}

			rebuildTree({ path: [...path], ...field }, parent.nextAnyValue)
			break;
		case "foreach":
			console.log(`foreach selector not supported for field ${parent.type}, skipping`, parent, field, path, selector)
			//throw new Error(`foreach selector not supported for field ${parent.type}`)
			break;
		case "value":
			console.log(`value selector not supported for field ${parent.type}, skipping`, parent, field, path, selector)
			//throw new Error(`value selector not supported for field ${parent.type}`)
			break;
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
	}
}

export function validateFormField(field: Partial<FormFieldTemplate>): field is FormFieldTemplate {
	if (field.id == undefined) throw new Error('id in FormFieldTemplate is not defined');
	//if (field.title == undefined) throw new Error('title in FormFieldTemplate is not defined');
	//if (field.starters == undefined) throw new Error('starters in FormFieldTemplate are not defined');

	return true;
}
