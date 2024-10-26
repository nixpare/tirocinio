import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnatomStruct, EditModeContext } from '../components/AnatomStruct/AnatomStruct'
import { AnatomStructState, AnatomStructTemplate, AnatomStructInputMode, AnatomStructTableType } from '../models/AnatomStructTypes'

import '../global.css'
import './edit.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const boneTemplate: AnatomStructTemplate = {
  name: "OSSO INNOMINATO",
  pages: [
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
              mode: AnatomStructInputMode.Number
            }
          ],
          indexes: [["A"], ["B"], ["C"], ["D"], ["E"], ["F"]]
        }
      ]
    }
  ]
}

const boneState: AnatomStructState = {
  name: "OSSO INNOMINATO",
  template: boneTemplate,
}

function App() {
  const [state, setState] = useState(boneState)

  return (
    <div className="container app">
      <h1>Tirocinio</h1>
      <EditModeContext.Provider value={false}>
        <AnatomStruct anatomStruct={state} setAnatomStruct={setState} />
      </EditModeContext.Provider>
    </div>
  )
}
