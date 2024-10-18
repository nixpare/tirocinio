import { Bone } from './Bone'
import { Bone as BoneType, InputMode } from './models/Bone'
import '../css/App.css'

const bone: BoneType = {
  name: "OSSO INNOMINATO",
  pages: [
    // Page 1
    {
      title: "Centri di ossificazione: presenza/assenza, fusione lunghezza diafisi",
      image: '/images/slide-image-1.png',
      sections: [
        {
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
            indexes: [["A"], ["B"], ["C"], ["D"], ["E"], ["F"]]
          }
        }
      ]
    },
    // Page 2
    {
      title: "Completezza, qualità, colore generale",
      image: '/images/slide-image-2.png',
      sections: [
        {
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
            indexes: [["1"], ["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["10"], ["11"], ["12"]]
          }
        },
        {
          table: {
            headers: ["Area", "Dettagli", "Colore"],
            template: [
              {
                mode: InputMode.Text
              },
              {
                mode: InputMode.Dropdown,
                options: ["da marrone a marrone scuro", "grigio", "naturale", "da arancione a marrone", "da giallo ad arancione"]
              }
            ],
            indexes: [["A"], ["B"], ["C"]]
          }
        }
      ]
    },
    // Page 3
    {
      title: "Caratteri metrici",
      image: '/images/slide-image-3.png',
      sections: [
        {
          table: {
            headers: ["Codice Misura", "Nome Misura", "Misura (cm)"],
            template: [
              {
                mode: InputMode.Text
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
            ],
          }
        }
      ]
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
