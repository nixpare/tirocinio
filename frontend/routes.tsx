import { createBrowserRouter } from "react-router";
import { AppLayout } from "./App";
import { BodyHome, BodyLayout, bodyLayoutLoader } from "./pages/Body/Body";
import { Conversion, conversionLoader, ConversionSelector, conversionSelectorLoader } from "./pages/Conversion/Conversion";
import { bodiesLoader, Index } from "./pages/Index";
import { BonesView, bonesViewLoader, BoneView, ExteriorsView, exteriorsViewLoader, ExteriorView, VisceraView, ViscusView, viscusViewLoader } from "./pages/Body/AnatomStruct";

const router = createBrowserRouter([
	{
		path: '/',
		Component: AppLayout,
		children: [
			{
				index: true,
				loader: bodiesLoader,
				Component: Index
			},
			{
				path: 'body/:bodyName',
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
