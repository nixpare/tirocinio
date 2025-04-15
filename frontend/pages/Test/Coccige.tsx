import { useImmer } from 'use-immer'
import { BodyContextProvider, Body } from '../../../models/Body'
import { BoneData } from '../../../models/AnatomStruct'
import Container from '@mui/material/Container'
import { BoneView } from '../Body/Bones'
import { useEffect } from 'react'
import { coccige } from './storage/coccige'
import { testBody } from './storage/body'

export function CoccigeTest() {
    const boneState: BoneData = {
        type: 'bone',
        name: coccige.name,
        form: {
            templ: coccige.form,
        }
    }

    let bones: Record<string, BoneData> = {}
    bones[boneState.name] = boneState;

    const [body, updateBody] = useImmer<Body>({
        ...testBody,
        bones
    });

    useEffect(() => {
        console.log(coccige)
    }, [])

    return (
        <Container>
            <BodyContextProvider.Provider value={{ body, updateBody }}>
                <BoneView fallbackId={boneState.name} />
            </BodyContextProvider.Provider>

            <button onClick={() => { console.log(coccige, body.bones[boneState.name]) }}>LOG in Console</button>
        </Container>
    )
}
