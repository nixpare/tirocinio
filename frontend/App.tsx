import createTheme from "@mui/material/styles/createTheme";
import { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import { isRouteErrorResponse, Outlet, useRouteError } from "react-router";

export const NavigationContextProvider = createContext<((nav: Navigation) => void) | undefined>(undefined);

export function AppLayout({ children }: {
	children?: React.ReactNode
}) {
	const [navigation, setNavigation] = useState<Navigation>([]);

	return (
		<ReactRouterAppProvider
			navigation={navigation}
			theme={theme}
			branding={{
				title: 'Tirocinio',
				logo: <img
					src="/favicon.ico" alt="Logo"
					style={{ height: '100%', padding: '.6em' }}
				/>,
				homeUrl: '/'
			}}
		>
			<DashboardLayout defaultSidebarCollapsed>
				<div className='app-content'>
					<NavigationContextProvider.Provider value={setNavigation}>
						<Outlet />
						{children}
					</NavigationContextProvider.Provider>
				</div>
			</DashboardLayout>
		</ReactRouterAppProvider>
	)
}

export function AppErrorBoundary() {
	return (
		<AppLayout>
			<ErrorBoundary />
		</AppLayout>
	)
}

function ErrorBoundary() {
	useAppBaseNavigation();

	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</>
		);
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	} else {
		return <h1>Unknown Error</h1>;
	}
}

function useAppBaseNavigation() {
	const navigationContext = useContext(NavigationContextProvider);
	useEffect(() => {
		navigationContext?.([
			{
				segment: '',
				title: 'Home',
				icon: <i className="fa-solid fa-house"></i>
			}
		])
	}, [])
}

const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'data-toolpad-color-scheme',
	},
	colorSchemes: { light: true/* , dark: true */ },
});
