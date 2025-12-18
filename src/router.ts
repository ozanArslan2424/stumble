import { AppLayout } from "./pages/app.layout";
import { clientRoutes } from "./client.routes";
import { DashboardPage } from "./pages/dashboard.page";
import { ErrorBoundary } from "./pages/error.boundary";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		Component: AppLayout,
		ErrorBoundary,
		children: [
			{ path: clientRoutes.landing, Component: DashboardPage },
			// Fallback route for 404 pages
			{ path: "*", Component: ErrorBoundary },
		],
	},
]);
