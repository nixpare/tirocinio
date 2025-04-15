import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadProgrammableFunctions } from "../models/Programmable";
import { CustomSnackbarProvider } from "./components/UI/Snackbar";
import { RouterProvider } from "react-router";
import router from "./routes";

import './global.css'

const queryClient = new QueryClient()
loadProgrammableFunctions()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<CustomSnackbarProvider>
				<RouterProvider router={router} />
			</CustomSnackbarProvider>
		</QueryClientProvider>
	</StrictMode>,
)

