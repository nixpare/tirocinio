import './index.css'

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Skeleton } from '../components/Body/Skeleton'
import { FullScreenOverlay, FullscreenOverlayProps } from '../components/UI/FullscreenOverlay'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadDeductionFunctions } from '../models/Deduction'

export type SetOverlayFunc = (overlay: React.ReactNode, overlayProps?: FullscreenOverlayProps) => void
type OverlayContent = {
    content: React.ReactNode
    props?: FullscreenOverlayProps
}

const queryClient = new QueryClient()
loadDeductionFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
)

const bodyName = "Test body"

function App() {
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
                bodyName={bodyName}
                setOverlay={setOverlay}/>
            {overlayContent.content && <FullScreenOverlay {...overlayContent.props}>
                {overlayContent.content}
            </FullScreenOverlay>}
        </div>
    )
}
