import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { Skeleton } from '../components/Skeleton/Skeleton'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

function App() {
    return (
        <div className="container app">
            <Skeleton />
        </div>
    )
}
