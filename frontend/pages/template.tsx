import { StrictMode } from 'react'
import { useImmer } from 'use-immer'
import { createRoot } from 'react-dom/client'
import { loadProgrammableFunctions } from '../../models/Programmable'
import { BrowserRouter, Route, Routes } from 'react-router'
import { CustomSnackbarProvider } from '../components/UI/Snackbar'
import Box from '@mui/material/Box'
import { FormFieldData, FormFieldTemplate } from '../../models/Form'
import { Template } from '../components/Template/Template'
import { Field } from '../components/Form/Field'
import { EditModeContext } from '../components/Form/Form'
import { BodyContext, BodyContextProvider } from '../../models/Body'
import { testBody } from '../storage/body'

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
    const [field, updateField] = useImmer<FormFieldTemplate | undefined>(undefined);
    // @ts-ignore
    const [data, updateFieldData] = useImmer<FormFieldData>({});

    const [body, updateBody] = useImmer(testBody);
    const bodyContext: BodyContext = {
        body: body,
        updateBody: updateBody
    }

    return (
        <EditModeContext.Provider value={true}>
            <BodyContextProvider.Provider value={bodyContext}>
                <Box sx={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
                    <Template />
                    {field && <Field
                        field={field} data={data} update={updateFieldData}
                        breadcrumb={[]}
                    />}

                    <button onClick={() => { console.log(field) }}>LOG in Console</button>
                </Box>
            </BodyContextProvider.Provider>
        </EditModeContext.Provider>
    )
}
