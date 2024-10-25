import { AnatomStruct } from './AnatomStruct'
import { AnatomStructState, AnatomStructTemplate, AnatomStructInputMode, AnatomStructTableType } from './models/AnatomStructTypes'
import { useState } from 'react'

import "../css/App.css"

const boneState: AnatomStructState = {
  name: "OSSO INNOMINATO",
  props: [
    // Page Test
    [
      // Table 0
      [
        // Row 0
        [
          { imageIdx: 0, x: 50, y: 50 },
          "assente",
          "Ciao"
        ]
      ]
    ]
  ]
}

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
              mode: AnatomStructInputMode.Dropdown,
              dropdownArgs: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
            },
            {
              mode: AnatomStructInputMode.Text
            }
          ],
          indexes: [["A"], ["B"], ["C"], ["D"], ["E"], ["F"]]
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
              mode: AnatomStructInputMode.Dropdown,
              dropdownArgs: ["Assente", "Presente"]
            },
            {
              mode: AnatomStructInputMode.Text
            }
          ],
          indexes: [["1"], ["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["10"], ["11"], ["12"]]
        },
        {
          type: AnatomStructTableType.Default,
          headers: ["Area", "Dettagli", "Colore"],
          fields: [
            {
              mode: AnatomStructInputMode.Text
            },
            {
              mode: AnatomStructInputMode.Dropdown,
              dropdownArgs: ["da marrone a marrone scuro", "grigio", "naturale", "da arancione a marrone", "da giallo ad arancione"]
            }
          ],
          indexes: [["A"], ["B"], ["C"], ["D"], ["E"], ["F"]]
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
              mode: AnatomStructInputMode.Text
            }
          ],
          indexes: [
            ["64", "Maximum Innominate Height"],
            ["65", "Maximum Iliac Breadth"],
            ["66", "Minimum Iliac Breadth"],
            ["67", "Maximum Pubis Length"],
            ["68", "Minimum Pubis Length"],
            ["69", "Ischial Length"],
            ["70", "Minimum Ischial Length"],
            ["71", "Maximum Ischiopubic Ramus Length"],
            ["72", "Anterior Superior Iliac Spine to Symphysion"],
            ["73", "Maximum Posterior Superior Iliac Spine to Symphysion"],
            ["74", "Minimum Apical Border to Symphysion"]
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
              mode: AnatomStructInputMode.Dropdown,
              dropdownArgs: ["Assente", "Non valutabile", "Presente"]
            }
          ],
          indexes: [["Accessory Sacroiliac Facet"], ["Pubic Spine"], ["Acetabular Crease"], ["Cotyloid bone"]]
        },
        {
          type: AnatomStructTableType.VariadicButton,
          headers: ["Caratteri non metrici", "Stato"],
          variadicPlaceholder: 'Aggiungi Carattere non Metrico',
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
          ],
          indexes: [["1"], ["2"], ["3"]]
        }
      ]
    }
  ]
}

function App() {
  const [state, setState] = useState(boneState)

  return (
    <div className="container app">
      <h1>Tirocinio</h1>
      <AnatomStruct template={boneTemplate} state={state} setState={setState} editMode={true} />
      {/* <Bone bone={bone} /> */}
    </div>
  )
}

export default App
