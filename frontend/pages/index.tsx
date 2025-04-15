import { useContext, useEffect } from 'react'
import Container from '@mui/material/Container'
import { NavigationContextProvider } from '../App'
import { Link } from 'react-router'

export function Index() {
    const navigationContext = useContext(NavigationContextProvider)

    useEffect(() => {
        navigationContext?.([
            {
                segment: '',
                title: 'Home',
                icon: <i className="fa-solid fa-house"></i>
            },
            {
                segment: 'templates',
                title: 'Template editor',
                icon: <i className="fa-solid fa-screwdriver-wrench"></i>
            },
            {
                kind: 'divider'
            },
            {
                segment: 'body/Test body',
                title: 'Test body',
                icon: <i className="fa-solid fa-user"></i>
            }
        ])
    }, [])

    return (
        <Container>
            <h1>Home</h1>
            <h3>Altre pagine del progetto:</h3>
            <div className="container container-horiz">
                <Link to="/coccige">Prototipo coccige</Link>
                <Link to="/atlante">Prototipo atlante</Link>
                <Link to="/femore">Prototipo femore</Link>
                <Link to="/deduzione">Prototipo deduzione</Link>
            </div>
        </Container>
    )
}
