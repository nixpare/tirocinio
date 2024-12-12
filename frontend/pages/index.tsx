import './index.css'

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useImmer } from 'use-immer'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { Bone, SkeletonData } from '../models/Skeleton'
import { FullScreenOverlay, FullscreenOverlayProps } from '../components/UI/FullscreenOverlay'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

export type SetOverlayFunc = (overlay: React.ReactNode, overlayProps?: FullscreenOverlayProps) => void
type OverlayContent = {
    content: React.ReactNode
    props?: FullscreenOverlayProps
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
)

function App() {
    const { data } = useQuery({
        queryKey: ['/bones'],
        queryFn: async () => {
            const res = await fetch('/bones')
            const bones: Bone[] = await res.json()
            return bones
        }
    })
    const [skeletonData, updateSkeletonData] = useImmer<SkeletonData>({})

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
                bones={data ?? []}
                setOverlay={setOverlay}/>
            {overlayContent.content && <FullScreenOverlay {...overlayContent.props}>
                {overlayContent.content}
            </FullScreenOverlay>}
        </div>
    )
}
