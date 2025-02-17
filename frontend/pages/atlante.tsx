import './atlante.css'

import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { FormData } from '../models/Form'
import { atlante } from '../storage/atlante'
import { loadDeductionFunctions } from '../models/Programmable'
import { BodyDataContext } from '../components/Body/Body'
import { testBody } from '../storage/body'

loadDeductionFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: FormData = {
    name: atlante.name,
    template: atlante.template
}

console.log(atlante)

function App() {
    const [state, updateState] = useImmer(boneState)

    return (
        <div className="container app">
            <BodyDataContext.Provider value={testBody}>
                <EditModeContext.Provider value={true}>
                    <Form data={state} updateData={updateState} />
                </EditModeContext.Provider>
            </BodyDataContext.Provider>
            <button onClick={() => { console.log(atlante, state) }}>LOG in Console</button>
        </div>
    )
}
