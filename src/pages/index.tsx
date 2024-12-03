import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { femore } from '../storage/femore'
import { ossoInnominato } from '../storage/ossoInnominato'
import { useImmer } from 'use-immer'
import { SkeletonData } from '../models/Skeleton'
import { FullScreenOverlay } from '../components/UI/FullscreenOverlay'

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

    const [overlay, setOverlay] = useState(null as React.ReactNode)

    return (
        <div className="container app">
            <Skeleton
                data={skeletonData}
                updateData={updateSkeletonData}
                bones={bones}
                setOverlay={setOverlay}/>
            {overlay && <FullScreenOverlay>
                {overlay}
            </FullScreenOverlay>}
        </div>
    )
}
