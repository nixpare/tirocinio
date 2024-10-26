import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TableTemplate } from '../components/AnatomStruct/TableTemplate' 

import '../global.css'
import './template.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="container app">
      <h1>Tirocinio</h1>
      <TableTemplate />
    </div>
  </StrictMode>,
)
