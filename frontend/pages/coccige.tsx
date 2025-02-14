import './coccige.css'

import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { FormData } from '../models/Form'
import { coccige } from '../storage/coccige'
import { loadDeductionFunctions } from '../models/Deduction'
import { BodyDataContext } from '../components/Body/Body'
import { testBody } from '../storage/body'

loadDeductionFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: FormData = {
    name: coccige.name,
    template: coccige.template
}

console.log(coccige)

function App() {
    const [state, updateState] = useImmer(boneState)

    return (
        <div className="container app">
            <BodyDataContext.Provider value={testBody}>
                <EditModeContext.Provider value={true}>
                    <Form data={state} updateData={updateState} />
                </EditModeContext.Provider>
            </BodyDataContext.Provider>
            <button onClick={() => { console.log(coccige, state) }}>LOG in Console</button>
        </div>
    )
}
