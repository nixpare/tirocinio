import { BodiesView, bodiesViewLoader } from "./Body/Bodies";

export async function indexLoader() {
    return await bodiesViewLoader()
}

export function Index() {
    return (
        <BodiesView />
    )
}
