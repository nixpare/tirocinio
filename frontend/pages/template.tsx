import './template.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TableTemplate } from '../components/Form/TableTemplate'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className="container app">
            <TableTemplate />
        </div>
    </StrictMode>,
)
