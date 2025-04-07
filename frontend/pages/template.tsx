import { StrictMode, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { loadProgrammableFunctions } from '../../models/Programmable'
import { BrowserRouter, Route, Routes } from 'react-router'
import { CustomSnackbarProvider } from '../components/UI/Snackbar'
import Box from '@mui/material/Box'
import { Template } from '../components/Template/Template'
import { EditModeContext, Form } from '../components/Form/Form'
import { BodyContext, BodyContextProvider } from '../../models/Body'
import { testBody } from '../storage/body'
import { AnatomStruct, AnatomStructData } from '../../models/AnatomStruct'
import { childUpdater } from '../utils/updater'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/template" element={(
                    <CustomSnackbarProvider>
                        <App />
                    </CustomSnackbarProvider>
                )} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)

function App() {
    const [anatomStruct, updateAnatomStruct] = useImmer<AnatomStruct | undefined>(undefined);
    const [anatomStructData, updateAnatomStructData] = useImmer<AnatomStructData>({
        type: 'bone',
        name: 'Placeholder',
        form: {
            templ: {
                title: 'Placeholder',
                sections: []
            }
        }
    });
    const updateForm = childUpdater(updateAnatomStructData, 'form')

    useEffect(() => {
        if (!anatomStruct) {
            return;
        }

        updateAnatomStructData({
            type: anatomStruct.type,
            name: anatomStruct.name,
            form: {
                templ: anatomStruct.form,
                sections: {}
            }
        })
    }, [anatomStruct])

    const [body, updateBody] = useImmer(testBody);
    const bodyContext: BodyContext = {
        body: body,
        updateBody: updateBody
    }

    return (
        <EditModeContext.Provider value={true}>
            <BodyContextProvider.Provider value={bodyContext}>
                <Box sx={{
                    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4em',
                    padding: '2em'
                }}>
                    <Template updateAnatomStruct={updateAnatomStruct} />
                    {anatomStructData && <Form
                        form={anatomStructData.form} update={updateForm}
                        initialEditMode
                    />}

                    <button onClick={() => { console.log(anatomStructData) }}>LOG in Console</button>
                </Box>
            </BodyContextProvider.Provider>
        </EditModeContext.Provider>
    )
}
