import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnatomStruct, EditModeContext } from '../components/AnatomStruct/AnatomStruct'
import { AnatomStructState, AnatomStructTemplate, AnatomStructInputMode } from '../models/AnatomStructTypes'

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
                    headers: ['Nuclei di ossificazione', 'Stato'],
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
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                },
                                {
                                    value: 'Assente per tafonomia',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                },
                                {
                                    value: 'Assente non valutabile',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                },
                                {
                                    value: 'Presente ma fusione non valutabile',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                },
                                {
                                    value: 'Presente non fuso',
                                    next: [
                                        {
                                            mode: AnatomStructInputMode.Number,
                                            header: 'dimensione massima (mm)'
                                        },
                                        {
                                            mode: AnatomStructInputMode.Text,
                                            header: 'Commenti'
                                        }
                                    ]
                                },
                                {
                                    value: 'Presente in fusione',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                },
                                {
                                    value: 'Presente fuso',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                        header: 'Commenti'
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: 'Completezza, qualità, colore generale',
            tables: [
                {
                    headers: ['Nuclei di ossificazione', 'Stato', 'Commenti'],
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
                                    next: []
                                },
                                {
                                    value: 'Assente per tafonomia',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                },
                                {
                                    value: 'Assente non valutabile',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                },
                                {
                                    value: 'Presente ma fusione non valutabile',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                },
                                {
                                    value: 'Presente non fuso',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                },
                                {
                                    value: 'Presente in fusione',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                },
                                {
                                    value: 'Presente fuso',
                                    next: [{
                                        mode: AnatomStructInputMode.Text,
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: ['Nuclei di ossificazione', 'Presenza / Assenza', 'Quantità', 'Qualità', 'Colore', 'Commenti'],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Text,
                            fixedArgs: ['A', 'B', 'C', 'D', 'E']
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            defaultValue: 'Presente',
                            dropdownArgs: ['Assente', 'Presente']
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ['1 (1%-25%)', '2 (26% - 50%)']
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ['0% of sound cortical surface', '1-24% of sound cortical surface']
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ['da marrone a marrone scuro', 'grigio']
                        },
                        {
                            mode: AnatomStructInputMode.Text
                        }
                    ]
                }
            ]
        },
        {
            title: 'Completezza, qualità, colore generale',
            tables: [
                {
                    headers: ['', 'Numero', 'Numero < di 2cm'],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Text,
                            fixedArgs: ['Frammenti']
                        },
                        { mode: AnatomStructInputMode.Number },
                        { mode: AnatomStructInputMode.Number }
                    ]
                },
                {
                    headers: ['Settore di appartenenza'],
                    isVariadic: true,
                    fields: [
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ['1', '2', '3', '...', '11', 'ND']
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
