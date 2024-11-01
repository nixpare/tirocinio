import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnatomStruct, EditModeContext } from '../components/AnatomStruct/AnatomStruct'
import { AnatomStructState, AnatomStructTemplate, AnatomStructInputMode, AnatomStructTableType, AnatomStructRowSpecial } from '../models/AnatomStructTypes'

import '../global.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const boneTemplate: AnatomStructTemplate = {
    name: "OSSO INNOMINATO",
    pages: [
        // Page Test
        {
            title: "Test variadic mouse",
            image: ['/images/slide-image-1.png', '/images/slide-image-2.png'],
            tables: [
                {
                    type: AnatomStructTableType.VariadicMouse,
                    headers: ["Nucleo", "Stato"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
                        },
                        {
                            mode: AnatomStructInputMode.Text
                        }
                    ]
                },
                {
                    type: AnatomStructTableType.VariadicMouse,
                    headers: ["Nucleo 2", "Stato 2"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
                        },
                        {
                            mode: AnatomStructInputMode.Text
                        }
                    ]
                }
            ]
        },
        // Page 1
        {
            title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
            image: ['/images/slide-image-1.png'],
            tables: [
                {
                    type: AnatomStructTableType.Default,
                    headers: ["Nucleo", "Stato", "Lunghezza (cm)"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: ["A", "B", "C", "D", "E", "F"]
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
                        },
                        {
                            mode: AnatomStructInputMode.Number
                        }
                    ]
                }
            ]
        },
        // Page 2
        {
            title: "Completezza, qualità, colore generale",
            image: ['/images/slide-image-2.png'],
            tables: [
                {
                    type: AnatomStructTableType.Default,
                    headers: ["Settore", "Presente/Assente", "Note"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["Assente", "Presente"]
                        },
                        {
                            mode: AnatomStructInputMode.Text
                        }
                    ]
                },
                {
                    type: AnatomStructTableType.Default,
                    headers: ["Area", "Dettagli", "Colore"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: ["A", "B", "C", "D", "E", "F"]
                        },
                        {
                            mode: AnatomStructInputMode.Text
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["da marrone a marrone scuro", "grigio", "naturale", "da arancione a marrone", "da giallo ad arancione"]
                        }
                    ]
                }
            ]
        },
        // Page 3
        {
            title: "Caratteri metrici",
            image: ['/images/slide-image-3.png', '/images/slide-image-4.png'],
            tables: [
                {
                    type: AnatomStructTableType.Default,
                    headers: ["Codice Misura", "Nome Misura", "Misura (cm)"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: ["64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74"]
                        },
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: [
                                "Maximum Innominate Height",
                                "Maximum Iliac Breadth",
                                "Minimum Iliac Breadth",
                                "Maximum Pubis Length",
                                "Minimum Pubis Length",
                                "Ischial Length",
                                "Minimum Ischial Length",
                                "Maximum Ischiopubic Ramus Length",
                                "Anterior Superior Iliac Spine to Symphysion",
                                "Maximum Posterior Superior Iliac Spine to Symphysion",
                                "Minimum Apical Border to Symphysion"
                            ]
                        },
                        {
                            mode: AnatomStructInputMode.Number
                        }
                    ]
                }
            ]
        },
        // Page 4
        {
            title: "Caratteri non metrici",
            tables: [
                {
                    type: AnatomStructTableType.Default,
                    headers: ["Caratteri non metrici", "Stato"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: [
                                "Accessory Sacroiliac Facet",
                                "Pubic Spine",
                                "Acetabular Crease",
                                "Cotyloid bone"
                            ]
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["Assente", "Non valutabile", "Presente"]
                        }
                    ]
                },
                {
                    type: AnatomStructTableType.VariadicButton,
                    headers: ["Caratteri non metrici", "Stato"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Text
                        },
                        {
                            mode: AnatomStructInputMode.Dropdown,
                            dropdownArgs: ["Assente", "Non valutabile", "Presente"]
                        }
                    ]
                }
            ]
        },
        // Page 5
        // Page 6
        // Page 7
        {
            title: "Lesività - Descrizione",
            image: ["/images/slide-image-5.png"],
            tables: [
                {
                    type: AnatomStructTableType.Default,
                    headers: ["#", "Classe", "Descrizione segni"],
                    fields: [
                        {
                            mode: AnatomStructInputMode.Fixed,
                            fixedArgs: ["1", "2", "3"]
                        },
                        {
                            mode: AnatomStructInputMode.Multistage,
                            multistageArgs: [
                                {
                                    value: "Soluzione di continuo",
                                    next: {
                                        mode: AnatomStructInputMode.Dropdown,
                                        dropdownArgs: [
                                            "A tutto spessore e tutta circonferenza",
                                            "A tutto spessore e parziale circonferenza",
                                            "Soluzione di continuo interessante lo strato corticale a tutta circonferenza",
                                            "Soluzione di continuo interessante lo strato corticale a parziale circonferenza",
                                            "Soluzione di continuo interessante lo strato di osso trabecolare (visibili in RX e TC)",
                                            "Multiple soluzioni di continuo (comminuzione)"
                                        ]
                                    }
                                },
                                {
                                    value: "Perdita di sostanza",
                                    next: { mode: AnatomStructInputMode.Text }
                                },
                                {
                                    value: "Aspetto margine (esempio nested multistage)",
                                    next: {
                                        mode: AnatomStructInputMode.Multistage,
                                        multistageArgs: [
                                            {
                                                value: "Aspetto della superficie di frattura (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
                                                next: { mode: AnatomStructInputMode.Text }
                                            },
                                            {
                                                value: "Aspetto superficie di taglio (indicare la localizzazione - mediale, laterale, anteriore e posteriore)",
                                                next: { mode: AnatomStructInputMode.Text }
                                            }
                                        ]
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
    template: boneTemplate,
    props: [
        // Page Test
        [
            // Table 0
            [
                // Row 0
                {
                    [AnatomStructRowSpecial.CircleInfo]: { imageIdx: 0, x: 50, y: 50 },
                    0: "assente",
                    1: "Ciao"
                }
            ]
        ]
    ]
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
