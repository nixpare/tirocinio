import { useState } from 'react'
import { Bones } from '../components/Body/Bones'
import { FullScreenOverlay, FullscreenOverlayProps } from '../components/UI/FullscreenOverlay'

export type SetOverlayFunc = (overlay: React.ReactNode, overlayProps?: FullscreenOverlayProps) => void
type OverlayContent = {
    content: React.ReactNode
    props?: FullscreenOverlayProps
}

const bodyName = "Test body"

export function TestOssa() {
    const [overlayContent, setOverlayContent] = useState<OverlayContent>({ content: null })
    const setOverlay: SetOverlayFunc = (overlay, overlayProps) => {
        setOverlayContent({
            content: overlay,
            props: overlayProps
        })
    }

    return <>
        <div className="container">
            <h1>Tirocinio</h1>
            <h3>Altre pagine del progetto:</h3>
            <div className="container container-horiz">
                <a href="/body/Test%20body">Prototipo Principale</a>
                <a href="/coccige">Prototipo coccige</a>
                <a href="/atlante">Prototipo atlante</a>
                <a href="/femore">Prototipo femore</a>
                <a href="/deduzione">Prototipo deduzione</a>
            </div>
        </div>
        <div className="container app">
            <Bones
                bodyName={bodyName}
                setOverlay={setOverlay} />
            {overlayContent.content && <FullScreenOverlay {...overlayContent.props}>
                {overlayContent.content}
            </FullScreenOverlay>}
        </div>
    </>
}
