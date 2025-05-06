import { createBrowserRouter } from "react-router";
import { TemplateHome } from "./pages/Template/Template";
import { AppLayout } from "./App";
import { BodyHome, BodyLoader } from "./pages/Body/Body";
import { Bones, BoneView } from "./pages/Body/Bones";
import { Conversion, conversionLoader, ConversionSelector } from "./pages/Conversion";
import { Index } from "./pages";

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
				path: 'template',
				Component: TemplateHome
			},
			{
				path: 'conversion',
				children: [
					{
						index: true,
						Component: ConversionSelector,
					},
					{
						path: ':anatomType/:anatomName',
						loader: conversionLoader,
						Component: Conversion,
					}
				]
			}
		]
	}
]);
export default router;
