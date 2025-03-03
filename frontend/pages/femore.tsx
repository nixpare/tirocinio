import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { femore } from '../storage/femore'
import { loadProgrammableFunctions } from '../models/Programmable'
import { BodyContextProvider, BodyData } from '../models/Body'
import { testBody } from '../storage/body'
import { BoneData } from '../models/AnatomStruct'
import { Container } from '@mui/material'
import { BoneView } from '../components/Body/Bones'
import { BrowserRouter, Route, Routes } from 'react-router'
import { CustomSnackbarProvider } from '../components/UI/Snackbar'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/deduzione" element={(
                    <CustomSnackbarProvider>
                        <App />
                    </CustomSnackbarProvider>
                )} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)

const boneState: BoneData = {
    type: 'bone',
    name: femore.name,
    form: {
        templ: femore.form,
    }
}

console.log(femore)

function App() {
    let bones: Record<string, BoneData> = {}
    bones[boneState.name] = boneState;

    const [body, updateBody] = useImmer<BodyData>({
        ...testBody,
        bones
    });

    return (
        <Container sx={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(femore, body.bones[boneState.name]) }}>LOG in Console</button>
        </Container>
    )
}
