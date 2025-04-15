import { useImmer } from 'use-immer'
import { BodyContextProvider, Body } from '../../../models/Body'
import { BoneData } from '../../../models/AnatomStruct'
import Container from '@mui/material/Container'
import { BoneView } from '../Body/Bones'
import { useEffect } from 'react'
import { atlante } from './storage/atlante'
import { testBody } from './storage/body'

export function AtlanteTest() {
    const boneState: BoneData = {
        type: 'bone',
        name: atlante.name,
        form: {
            templ: atlante.form,
        }
    }

    let bones: Record<string, BoneData> = {}
    bones[boneState.name] = boneState;

    const [body, updateBody] = useImmer<Body>({
        ...testBody,
        bones
    });

    useEffect(() => {
        console.log(atlante)
    }, [])

    return (
        <Container>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(atlante, body.bones[boneState.name]) }}>LOG in Console</button>
        </Container>
    )
}
