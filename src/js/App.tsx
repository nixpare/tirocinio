import { Bone } from './Bone'
import { Bone as BoneType, InputMode } from './models/Bone'
import '../css/App.css'

import slideImage1 from '../images/slide-image-1.png'
import slideImage2 from '../images/slide-image-2.png'

const bone: BoneType = {
  name: "OSSO INNOMINATO",
  pages: [
    {
      title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
      image: slideImage1,
      table: {
        headers: ["Nucleo", "Stato", "Lunghezza (cm)"],
        template: [
          {
            mode: InputMode.Dropdown,
            options: ["assente", "presente non valutabile PND", "presente non fuso PN", "presente in fusione PIF", "presente fuso PF"]
          },
          {
            mode: InputMode.Text
          }
        ],
        indexes: ["A", "B", "C", "D", "E", "F"]
      }
    },
    {
      title: "Completezza, qualità, colore generale",
      image: slideImage2,
      table: {
        headers: ["Settore", "Presente/Assente", "Note"],
        template: [
          {
            mode: InputMode.Dropdown,
            options: ["Assente", "Presente"]
          },
          {
            mode: InputMode.Text
          }
        ],
        indexes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
      }
    }
  ]
}

function App() {
  return (
    <div className="container">
      <h1>Tirocinio</h1>
      <Bone bone={bone} editMode={true} />
      <Bone bone={bone} />
    </div>
  )
}

export default App
