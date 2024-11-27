import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { femore } from '../storage/femore'
import { ossoInnominato } from '../storage/ossoInnominato'
import { useImmer } from 'use-immer'
import { SkeletonData } from '../models/Skeleton'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const bones = [
    femore,
    ossoInnominato
]

function App() {
    const [skeletonData, updateSkeletonData] = useImmer<SkeletonData>({
        [ossoInnominato.name]: {
            name: ossoInnominato.name,
            template: ossoInnominato.template
        }
    })

    return (
        <div className="container app">
            <Skeleton
                data={skeletonData}
                updateData={updateSkeletonData}
                bones={bones} />
        </div>
    )
}
