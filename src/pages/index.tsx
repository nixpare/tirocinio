import './index.css'

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useImmer } from 'use-immer'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { femore } from '../storage/femore'
import { ossoInnominato } from '../storage/ossoInnominato'
import { SkeletonData } from '../models/Skeleton'
import { FullScreenOverlay, FullscreenOverlayProps } from '../components/UI/FullscreenOverlay'

export type SetOverlayFunc = (overlay: React.ReactNode, overlayProps?: FullscreenOverlayProps) => void
type OverlayContent = {
    content: React.ReactNode
    props?: FullscreenOverlayProps
}

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

    const [overlayContent, setOverlayContent] = useState<OverlayContent>({ content: null })
    const setOverlay: SetOverlayFunc = (overlay, overlayProps) => {
        setOverlayContent({
            content: overlay,
            props: overlayProps
        })
    }

    return (
        <div className="container app">
            <Skeleton
                data={skeletonData}
                updateData={updateSkeletonData}
                bones={bones}
                setOverlay={setOverlay}/>
            {overlayContent.content && <FullScreenOverlay {...overlayContent.props}>
                {overlayContent.content}
            </FullScreenOverlay>}
        </div>
    )
}
