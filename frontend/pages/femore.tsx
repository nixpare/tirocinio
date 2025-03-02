import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { femore } from '../storage/femore'
import { loadProgrammableFunctions } from '../models/Programmable'
import { BodyContextProvider } from '../models/Body'
import { testBody } from '../storage/body'
import { AnatomStructDataContext, BoneData } from '../models/AnatomStruct'
import { generateChildUpdater } from '../utils/updater'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: BoneData = {
    type: 'bone',
    name: femore.name,
    form: {
        templ: femore.form,
    }
}

console.log(femore)

function App() {
     const [body, updateBody] = useImmer(testBody);
        
        const [state, updateState] = useImmer(boneState)
        const updateForm = generateChildUpdater(updateState, 'form')
    
        return (
            <div className="container app">
                <BodyContextProvider.Provider value={{ body, updateBody }}>
                <AnatomStructDataContext.Provider value={state}>
                    <EditModeContext.Provider value={true}>

                        <Form data={state.form} updateData={updateForm} />

                    </EditModeContext.Provider>
                </AnatomStructDataContext.Provider>
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(femore, state) }}>LOG in Console</button>
        </div>
    )
}
