import { ChangeEvent, FormEvent, useState } from 'react'
import { Bone as BoneTyp, BoneProperty, InputMode } from './models/Bone'

import '../css/Bone.css'

export function Bone({ props }: { props: BoneTyp }) {
	const [state, setState] = useState(props)

	function handleSubmit(ev: FormEvent) {
		ev.preventDefault()
		console.log(state)
	}

	return (
		<div className="container">
			<h4 className="bone-name">{state.name}</h4>

			<div className="split">
				<div>
					<table className="props-table">
						<thead>
							<tr>
								<th>Proprietà</th>
								<th>Valore</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(state.props).map(([propName, prop]) => {
								return <PropertyView key={propName} name={propName} prop={prop} />;
							})}
						</tbody>
					</table>
				</div>
				<div><img src={props.image} alt={props.name} /></div>
			</div>

			<div className="split">
				<form className="bone-form" onSubmit={handleSubmit}>
					<table className="props-table">
						<thead>
							<tr>
								<th>Proprietà</th>
								<th>Valore</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(state.props).map(([propName, prop]) => {
								return <PropertyInput key={propName} name={propName} prop={prop} state={state} setState={setState} />;
							})}
						</tbody>
					</table>
					<button type="submit">Invia</button>
				</form>
				<div><img src={props.image} alt={props.name} /></div>
			</div>
		</div>
	);
}

function PropertyView({ name, prop }: { name: string, prop: BoneProperty }) {
	return (<tr>
		<td>{name}</td>
		<td>{prop.value.toString()}</td>
	</tr>);
}

function PropertyInput({ name, prop, state, setState }: { name: string, prop: BoneProperty, state: BoneTyp, setState: (state: BoneTyp) => void }) {
	switch (prop.mode) {
		case InputMode.Text:
			function handleTextInput(ev: ChangeEvent<HTMLInputElement>) {
				console.log(ev.target.value)
				//prop.value = ev.target.value
				state.props[name] = {
					...state.props[name],
					value: ev.target.value
				}
				setState({
					...state,
					props: {
						...state.props,
						name: {
							...state.props[name],
							value: ev.target.value
						}
					}
				})
			}

			return (<tr>
				<td><label htmlFor={name}>{name}</label></td>
				<td><input
					type="text" name={name} placeholder={name}
					value={prop.value as string} onChange={handleTextInput}
				/></td>
			</tr>)
		case InputMode.Number:
			const [number, setNumber] = useState(prop.value as number)

			function handleNumberInput(ev: ChangeEvent<HTMLInputElement>) {
				setNumber(Number(ev.target.value))
			}

			return (<tr>
				<td><label htmlFor={name}>{name}</label></td>
				<td><input
					type="number" name={name} placeholder={name}
					value={number !== 0 ? number : ""} onChange={handleNumberInput} /></td>
			</tr>)
		case InputMode.Checkbox:
			const [checked, setChecked] = useState(prop.value as boolean)

			function handleCheckbox() {
				setChecked(!checked)
			}

			return (<tr>
				<td><label htmlFor={name}>{name}</label></td>
				<td><input
					type="checkbox" name={name} placeholder={name}
					checked={checked} onChange={handleCheckbox}
				/></td >
			</tr>)
		case InputMode.MultilineText:
			const [multiline, setMultiline] = useState(prop.value as string)

			function handleMultilineInput(ev: ChangeEvent<HTMLTextAreaElement>) {
				setMultiline(ev.target.value)
			}

			return (<tr>
				<td><label htmlFor={name}>{name}</label></td>
				<td><textarea
					name={name} placeholder={name}
					value={multiline} onChange={handleMultilineInput}
				></textarea></td>
			</tr>)
	}
}
