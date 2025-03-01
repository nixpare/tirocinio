import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadProgrammableFunctions } from '../models/Programmable'
import { BodyHome, BodyLayout } from '../components/Body/Body'
import { Routes } from 'react-router';
import { Bones, BoneView } from '../components/Body/Bones';
import { Container } from '@mui/material';

const queryClient = new QueryClient()
loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)

function App() {
    return <div>
        <Routes>
            <Route path="/" element={<RedirectToTestBody />} />
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

function RedirectToTestBody() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate('/body/Test body');
    }, 1000)

    return (
        <Container>
            <h1>Redirecting to Test Body...</h1>
        </Container>
    )
}
