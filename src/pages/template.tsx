import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TableTemplate } from '../components/AnatomStruct/TableTemplate'

import './template.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className="container app">
            <TableTemplate />
        </div>
    </StrictMode>,
)
