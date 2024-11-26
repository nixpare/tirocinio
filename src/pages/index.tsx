import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Form, EditModeContext } from '../components/Form/Form'
import { FormData, FormTemplate, FormTableFieldType, FormTableRowSpecial } from '../models/Form'

import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

function App() {
    const [state, setState] = useState(boneState)

    return (
        <div className="container app">
            <EditModeContext.Provider value={true}>
                <Form data={state} setFormData={setState} />
            </EditModeContext.Provider>
        </div>
    )
}
