import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form } from '../components/Form/Form'
import { deduzione } from '../storage/deduzione'
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
    name: deduzione.name,
    form: {
        templ: deduzione.form,
    }
}

console.log(deduzione)

function App() {
    const [body, updateBody] = useImmer(testBody);
       
       const [state, updateState] = useImmer(boneState)
       const updateForm = generateChildUpdater(updateState, 'form')
   
       return (
           <div className="container app">
               <BodyContextProvider.Provider value={{ body, updateBody }}>
                <AnatomStructDataContext.Provider value={state}>
                    <Form data={state.form} updateData={updateForm} initialEditMode={true} />
                </AnatomStructDataContext.Provider>
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(deduzione, state) }}>LOG in Console</button>
        </div>
    )
}
