import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { femore } from '../storage/femore'
import { loadProgrammableFunctions } from '../../models/Programmable'
import { BodyContextProvider, Body } from '../../models/Body'
import { testBody } from '../storage/body'
import { BoneData } from '../../models/AnatomStruct'
import { BoneView } from '../components/Body/Bones'
import { BrowserRouter, Route, Routes } from 'react-router'
import { CustomSnackbarProvider } from '../components/UI/Snackbar'
import Box from '@mui/material/Box'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/femore" element={(
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

    const [body, updateBody] = useImmer<Body>({
        ...testBody,
        bones
    });

    return (
        <Box sx={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(femore, body.bones[boneState.name]) }}>LOG in Console</button>
        </Box>
    )
}
