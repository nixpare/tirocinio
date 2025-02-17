import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { coccige } from '../storage/coccige'
import { loadProgrammableFunctions } from '../models/Programmable'
import { BodyDataContext } from '../models/Body'
import { testBody } from '../storage/body'
import { BoneData } from '../models/Skeleton'
import { AnatomStructDataContext, generateUpdateForm } from '../models/AnatomStruct'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: BoneData = {
    type: 'bone',
    name: coccige.name,
    form: {
        templ: coccige.form,
    }
}

console.log(coccige)

function App() {
    const [state, updateState] = useImmer(boneState)
    const updateForm = generateUpdateForm(updateState)

    return (
        <div className="container app">
            <BodyDataContext.Provider value={testBody}>
                <AnatomStructDataContext.Provider value={state}>
                    <EditModeContext.Provider value={true}>

                        <Form data={state.form} updateData={updateForm} />

                    </EditModeContext.Provider>
                </AnatomStructDataContext.Provider>
            </BodyDataContext.Provider>

            <button onClick={() => { console.log(coccige, state) }}>LOG in Console</button>
        </div>
    )
}
