import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { coccige } from '../storage/coccige'
import { loadProgrammableFunctions } from '../../models/Programmable'
import { BodyContextProvider, Body } from '../../models/Body'
import { testBody } from '../storage/body'
import { BoneData } from '../../models/AnatomStruct'
import { BrowserRouter, Route, Routes } from 'react-router'
import { CustomSnackbarProvider } from '../components/UI/Snackbar'
import Container from '@mui/material/Container'
import { BoneView } from '../components/Body/Bones'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/coccige" element={(
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
    name: coccige.name,
    form: {
        templ: coccige.form,
    }
}

console.log(coccige)

function App() {
    let bones: Record<string, BoneData> = {}
    bones[boneState.name] = boneState;

    const [body, updateBody] = useImmer<Body>({
        ...testBody,
        bones
    });

    return (
        <Container sx={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(coccige, body.bones[boneState.name]) }}>LOG in Console</button>
        </Container>
    )
}
