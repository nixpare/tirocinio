import { convertLabelToID } from "../models/conversion";
import { formFieldIsMultiSelect, formFieldIsSelect, FormFieldSelectArgs, FormFieldTemplate, FormFieldType } from "../models/Form";
import { deepCopy, StrapiComponent, validateObject, ValidateObjectResult } from "./Strapi";

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
	
	doc.slice(0, 2).forEach(campo => {
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

		const name = path[path.length-1].name

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

				const key = convertLabelToID(elemento.NomeCampo)
				selectArgs.push({
					value: key,
					display: elemento.NomeCampo,
				})
			})

			node.selectArgs = selectArgs
		}

		nodes.push(node)
	})
	
	for (const i in nodes) {
		if (nodes[i] == undefined)
			continue;

		const isRootNode = nodes[i].path.length > 1
		rebuildTree(nodes[i], nodes);

		if (!isRootNode) {
			delete nodes[i]
		}
	}

	return nodes.filter(node => node != undefined);
}

function rebuildTree(node: StrapiCampoNode, prev: (StrapiCampoNode | undefined)[]) {
	if (node.path.length == 1) {
		return;
	}

	const { path, ...field } = node;

	const [nextName, selector] = [path[0].name, path[0].selector];
	const nextKey = convertLabelToID(nextName);

	if (selector == undefined)
		throw new Error(`selector should not be undefined: <${path}> <${nextKey}> <${selector}>, <${Object.keys(prev)}>`);

	const parent = prev.find(el => el?.id === nextKey);
	if (parent == undefined)
		throw new Error(`parent node should not be undefined: <${path}> <${nextKey}> <${selector}>, <${Object.keys(prev)}>`);

	path.shift();

	if (formFieldIsSelect(parent) || formFieldIsMultiSelect(parent)) {
		const selectArgs = parent.selectArgs as FormFieldSelectArgs

		switch (selector.type) {
			case "any":
				break;
			case "foreach":
				selectArgs.forEach(arg => {
					if (parent.nextArgs == undefined) {
						parent.nextArgs = []
					}

					parent.nextArgs.push({
						options: [arg.value],
						next: [field]
					})
				})

				break;
			case "value":
				const value = selector.value
				if (!value) throw new Error(`value of selector with type "value" is undefined`)

				if (parent.nextArgs == undefined) {
					parent.nextArgs = []
				}

				parent.nextArgs.push({
					options: [value],
					next: [field]
				})

				break;
		}
		
		/* if (selection == undefined) {
			Object.values(parent.selectArgs).forEach(arg => {
				if (arg.next == undefined) {
					arg.next = {}
				}
				// @ts-ignore
				rebuildTree(deepCopy(node), arg.next);
			});
		} else {
			const selectionKey = convertLabelToID(selection);
			// @ts-ignore
			const arg = parent.selectArgs[selectionKey];
			// @ts-ignore
			rebuildTree(node, arg.next);
		} */

		return;
	}

	return;
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
	}
}

export function validateFormField(field: Partial<FormFieldTemplate>): field is FormFieldTemplate {
	if (field.id == undefined) throw new Error('id in FormFieldTemplate is not defined');
	//if (field.title == undefined) throw new Error('title in FormFieldTemplate is not defined');
	//if (field.starters == undefined) throw new Error('starters in FormFieldTemplate are not defined');

	return true;
}
