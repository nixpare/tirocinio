import './femore.css'

import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { FormData } from '../models/Form'
import { femore } from '../storage/femore'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneState: FormData = {
    name: femore.name,
    template: femore.template
}

function App() {
    const [state, updateState] = useImmer(boneState)

    return (
        <div className="container app">
            <EditModeContext.Provider value={true}>
                <Form data={state} updateData={updateState} />
            </EditModeContext.Provider>
        </div>
    )
}
