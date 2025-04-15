import createTheme from "@mui/material/styles/createTheme";
import { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { createContext, useState } from "react";
import { Outlet } from "react-router";

export const NavigationContextProvider = createContext<((nav: Navigation) => void) | undefined>(undefined);

export function AppLayout() {
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
					</NavigationContextProvider.Provider>
				</div>
			</DashboardLayout>
		</ReactRouterAppProvider>
	)
}

const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'data-toolpad-color-scheme',
	},
	colorSchemes: { light: true/* , dark: true */ },
});
