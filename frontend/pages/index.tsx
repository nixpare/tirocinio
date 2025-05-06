import { useContext, useEffect } from 'react'
import Container from '@mui/material/Container'
import { NavigationContextProvider } from '../App'
import Breadcrumbs from '@mui/material/Breadcrumbs/Breadcrumbs'
import Typography from '@mui/material/Typography/Typography'
import Divider from '@mui/material/Divider/Divider'

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
                kind: 'divider'
            },
            {
                segment: 'body/Test body',
                title: 'Test body',
                icon: <i className="fa-solid fa-user"></i>
            },
            {
                segment: 'conversion',
                title: 'Conversione',
                icon: <i className="fa-solid fa-screwdriver-wrench"></i>
            }
        ])
    }, [])

    return (
        <>
            <Container>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Typography sx={{ color: 'text.primary' }}>Home</Typography>
                </Breadcrumbs>
                <h1>Corpi</h1>
                {/* bodies from db */}
            </Container>
            <Divider variant="middle" sx={{ marginTop: '1em', marginBottom: '1em' }} />
            <Container>
                {/* create new body */}
            </Container>
        </>
    )
}
