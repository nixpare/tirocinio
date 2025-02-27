import "primereact/resources/themes/lara-light-cyan/theme.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route } from "react-router";
import { PrimeReactProvider } from 'primereact/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loadProgrammableFunctions } from '../models/Programmable'
import Body from '../components/Body/Body'
import { Routes } from 'react-router';
import TopNav from '../components/UI/Nav';
import { TestOssa } from './ossa';


const queryClient = new QueryClient()
loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider>
                    <App />
                </PrimeReactProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)

function App() {
    return <div>
        <TopNav />
        <Routes>
            <Route path="/" element={<TestOssa />} />
            <Route path="/body/:name" element={<Body />}>
                <Route index element={<h1>Home</h1>} />
                <Route path="ossa" element={<h1>Ossa</h1>} />
            </Route>
        </Routes>
    </div>
}
