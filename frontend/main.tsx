import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadProgrammableFunctions } from "../models/Programmable";
import { CustomSnackbarProvider } from "./components/UI/Snackbar";
import { RouterProvider } from "react-router";
import router from "./routes";

import './global.css'

loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CustomSnackbarProvider>
			<RouterProvider router={router} />
		</CustomSnackbarProvider>
	</StrictMode>,
)

