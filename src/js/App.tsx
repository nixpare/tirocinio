import { Bone } from './Bone'
import { Bone as BoneType, InputMode } from './models/Bone'
import '../css/App.css'

const bone: BoneType = {
  name: "Nome osso",
  pages: [
    {
      title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
      image: "https://www.my-personaltrainer.it/imgs/2018/01/03/omero-anatomia-orig.jpeg",
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
