import { createBrowserRouter } from "react-router";
import { Index } from './pages/Index';
import { TemplateHome } from "./pages/Template/Template";
import { AppLayout } from "./App";
import { BodyHome, BodyLoader } from "./pages/Body/Body";
import { Bones, BoneView } from "./pages/Body/Bones";
import { AtlanteTest } from "./pages/Test/Atlante";
import { CoccigeTest } from "./pages/Test/Coccige";
import { DeduzioneTest } from "./pages/Test/Deduzione";
import { FemoreTest } from "./pages/Test/Femore";

const router = createBrowserRouter([
	{
		path: '/',
		Component: AppLayout,
		children: [
			{
				index: true,
				Component: Index
			},
			{
				path: 'body/:name',
				Component: BodyLoader,
				children: [
					{
						index: true,
						Component: BodyHome,
					},
					{
						path: 'bones',
						children: [
							{
								index: true,
								Component: Bones
							},
							{
								path: ':id',
								Component: BoneView
							}
						]
					}
				]
			},
			{
				path: 'templates',
				Component: TemplateHome
			},
			{
				path: 'test',
				children: [
					{
						path: 'atlante',
						Component: AtlanteTest
					},
					{
						path: 'coccige',
						Component: CoccigeTest
					},
					{
						path: 'deduzione',
						Component: DeduzioneTest
					},
					{
						path: 'femore',
						Component: FemoreTest
					}
				]
			}
		]
	}
]);
export default router;
