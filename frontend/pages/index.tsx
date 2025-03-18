import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadProgrammableFunctions } from '../../models/Programmable'
import { BodyHome, BodyLayout } from '../components/Body/Body'
import { Routes } from 'react-router';
import { Bones, BoneView } from '../components/Body/Bones';
import Container from '@mui/material/Container'
import { CustomSnackbarProvider } from '../components/UI/Snackbar';

const queryClient = new QueryClient()
loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <CustomSnackbarProvider>
                    <App />
                </CustomSnackbarProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)

function App() {
    return <div>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/body/:name" element={<BodyLayout />}>
                <Route index element={<BodyHome />} />
                <Route path="ossa">
                    <Route index element={<Bones />} />
                    <Route path=":id" element={<BoneView />} />
                </Route>
            </Route>
        </Routes>
    </div>
}

function Index() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/body/Test body/ossa');
        }, 3000)
    }, [])

    return (
        <Container>
            <h1>Redirecting to Test Body...</h1>
            <h3>Altre pagine del progetto:</h3>
            <div className="container container-horiz">
                <a href="/coccige">Prototipo coccige</a>
                <a href="/atlante">Prototipo atlante</a>
                <a href="/femore">Prototipo femore</a>
                <a href="/deduzione">Prototipo deduzione</a>
            </div>
        </Container>
    )
}
