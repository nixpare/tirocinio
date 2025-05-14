import { createBrowserRouter } from "react-router";
import { AppLayout } from "./App";
import { BodyHome, BodyLayout, bodyLayoutLoader } from "./pages/Body/Body";
import { Conversion, conversionLoader, ConversionSelector, conversionSelectorLoader } from "./pages/Conversion/Conversion";
import { Index, indexLoader } from "./pages";
import { BonesView, bonesViewLoader, BoneView, ExteriorsView, exteriorsViewLoader, ExteriorView, VisceraView, ViscusView, viscusViewLoader } from "./pages/Body/AnatomStruct";
import { BodiesView, bodiesViewLoader } from "./pages/Body/Bodies";

const router = createBrowserRouter([
	{
		path: '/',
		Component: AppLayout,
		children: [
			{
				index: true,
				loader: indexLoader,
				Component: Index
			},
			{
				path: 'body',
				children: [
					{
						index: true,
						loader: bodiesViewLoader,
						Component: BodiesView
					},
					{
						path: ':bodyName',
						loader: bodyLayoutLoader,
						Component: BodyLayout,
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
										loader: bonesViewLoader,
										Component: BonesView
									},
									{
										path: ':anatomName',
										Component: BoneView
									}
								]
							},
							{
								path: 'viscus',
								children: [
									{
										index: true,
										loader: viscusViewLoader,
										Component: ViscusView
									},
									{
										path: ':anatomName',
										Component: VisceraView
									}
								]
							},
							{
								path: 'exteriors',
								children: [
									{
										index: true,
										loader: exteriorsViewLoader,
										Component: ExteriorsView
									},
									{
										path: ':anatomName',
										Component: ExteriorView
									}
								]
							}
						]
					}
				]
			},
			{
				path: 'conversion',
				children: [
					{
						index: true,
						loader: conversionSelectorLoader,
						Component: ConversionSelector,
					},
					{
						path: ':anatomType/:anatomID',
						loader: conversionLoader,
						Component: Conversion,
					}
				]
			}
		]
	}
]);
export default router;
