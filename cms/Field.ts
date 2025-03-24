import { formFieldIsMultiSelect, formFieldIsSelect, FormFieldSelectArg, FormFieldSelectArgs, FormFieldTemplate, FormFieldType } from "../models/Form";
import { convertLabelToID, deepCopy, StrapiComponent, validateObject, ValidateObjectResult } from "./Strapi";

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

type StrapiCampoNode = FormFieldTemplate & {
	path: string[]
}

export function rebuildStrapiCampoTree(doc: StrapiCampo[]): Record<string, StrapiCampoNode> {
	const nodes: Record<string, StrapiCampoNode> = {}
	
	doc.forEach(campo => {
		campo.NomeCampo = campo.NomeCampo.replaceAll('//', '/');
		const path = campo.NomeCampo.split('/');
		const [name] = path[path.length-1].split(':');

		const node: StrapiCampoNode = {
			id: convertLabelToID(name),
			type: convertStrapiTipoCampo(campo.TipoCampo),
			header: name,
			path: path
		}

		if (formFieldIsSelect(node) || formFieldIsMultiSelect(node)) {
			node.selectArgs = {}
			campo.ListaElementi.forEach(elemento => {
				if (elemento.NomeCampo === 'Applica a tutti') {
					//TODO: vedere se aggiungere un modo per attivare/disattivare il 'seleziona tutti'
					//node.selectAllButton = true;
					return;
				}

				const key = convertLabelToID(elemento.NomeCampo)
				// @ts-ignore
				node.selectArgs[key] = {
					value: key,
					display: elemento.NomeCampo,
				} as FormFieldSelectArg
			})
		}

		nodes[campo.NomeCampo] = node
	})

	const keys = Object.keys(nodes)
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const node = nodes[key];

		rebuildTree(node, nodes);
		delete nodes[key];
	}

	return nodes;
}

function rebuildTree(node: StrapiCampoNode, prev: Record<string, StrapiCampoNode>) {
	if (node.path.length == 1) {
		prev[node.id] = node;
		return;
	}

	const [nextName, selection] = node.path[0].split(':') as [string, string | undefined];
	const nextKey = convertLabelToID(nextName);

	const parent: StrapiCampoNode | undefined = prev[nextKey];
	if (parent == undefined) throw new Error(`this should not be possible: <${node.path}> <${nextKey}> <${selection}>, <${Object.keys(prev)}>`);

	node.path.shift();

	if (formFieldIsSelect(parent) || formFieldIsMultiSelect(parent)) {
		if (selection == undefined) {
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
		}

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
	}
}
