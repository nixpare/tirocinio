import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnatomStruct, EditModeContext } from '../components/AnatomStruct/AnatomStruct'
import { AnatomStructState, AnatomStructTemplate, AnatomStructInputMode } from '../models/AnatomStructTypes'

import '../global.css'
import './femore.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneTemplate: AnatomStructTemplate = {
    name: "Femore",
    pages: [
        {
            title: 'Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi',
            tables: [
                {
                    headers: ['Centri di ossificazione', 'Stato'/* , 'Commenti' */],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Text,
                            fixedArgs: ['A', 'B', 'C', 'D', 'E']
                        },
                        {
                            mode: AnatomStructInputMode.Multistage,
                            defaultValue: { value: 'Presente fuso' },
                            multistageArgs: [
                                {
                                    value: 'Assente per immaturità',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                },
                                {
                                    value: 'Assente per tafonomia',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                },
                                {
                                    value: 'Assente non valutabile',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                },
                                {
                                    value: 'Presente ma fusione non valutabile',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                },
                                {
                                    value: 'Presente non fuso',
                                    next: {
                                        mode: AnatomStructInputMode.Blank
                                    }
                                },
                                {
                                    value: 'Presente in fusione',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                },
                                {
                                    value: 'Presente fuso',
                                    next: {
                                        mode: AnatomStructInputMode.Text
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

const boneState: AnatomStructState = {
    name: "OSSO INNOMINATO",
    template: boneTemplate
}

function App() {
    const [state, setState] = useState(boneState)

    return (
        <div className="container app">
            <EditModeContext.Provider value={true}>
                <AnatomStruct anatomStruct={state} setAnatomStruct={setState} />
            </EditModeContext.Provider>
        </div>
    )
}
