import { useImmer } from 'use-immer'
import { BodyContextProvider, Body } from '../../../models/Body'
import { BoneData } from '../../../models/AnatomStruct'
import Container from '@mui/material/Container'
import { BoneView } from '../Body/Bones'
import { useEffect } from 'react'
import { femore } from './storage/femore'
import { testBody } from './storage/body'

export function FemoreTest() {
    const boneState: BoneData = {
        type: 'bone',
        name: femore.name,
        form: {
            templ: femore.form,
        }
    }

    let bones: Record<string, BoneData> = {}
    bones[boneState.name] = boneState;

    const [body, updateBody] = useImmer<Body>({
        ...testBody,
        bones
    });

    useEffect(() => {
        console.log(femore)
    }, [])

    return (
        <Container>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(femore, body.bones[boneState.name]) }}>LOG in Console</button>
        </Container>
    )
}
