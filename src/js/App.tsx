import { Bone } from './Bone'
import { InputMode } from './models/Bone'
import '../css/App.css'

function App() {
  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <Bone
        props={{
          name: "Omero",
          image: "https://www.my-personaltrainer.it/imgs/2018/01/03/omero-anatomia-orig.jpeg",
          props: {
            state: { value: "good", mode: InputMode.Text },
            integrity: { value: 10, mode: InputMode.Number },
            missing_parts: { value: false, mode: InputMode.Checkbox },
            description: { value: "Multiline\nDescription\n...", mode: InputMode.MultilineText },
          }
        }}
      />
    </div>
  )
}

export default App
