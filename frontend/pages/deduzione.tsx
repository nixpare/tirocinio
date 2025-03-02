import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { deduzione } from '../storage/deduzione'
import { loadProgrammableFunctions } from '../models/Programmable'
import { BodyContextProvider } from '../models/Body'
import { testBody } from '../storage/body'
import { AnatomStructDataContext, BoneData, generateUpdateForm } from '../models/AnatomStruct'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: BoneData = {
    type: 'bone',
    name: deduzione.name,
    form: {
        templ: deduzione.form,
    }
}

console.log(deduzione)

function App() {
    const [state, updateState] = useImmer(boneState)
    const updateForm = generateUpdateForm(updateState)

    return (
        <div className="container app">
            <BodyContextProvider.Provider value={testBody}>
                <AnatomStructDataContext.Provider value={state}>
                    <EditModeContext.Provider value={true}>

                        <Form data={state.form} updateData={updateForm} />

                    </EditModeContext.Provider>
                </AnatomStructDataContext.Provider>
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(deduzione, state) }}>LOG in Console</button>
        </div>
    )
}
