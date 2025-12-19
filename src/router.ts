import { AppLayout } from "./pages/app.layout";
import { clientRoutes } from "./client.routes";
import { DashboardPage } from "./pages/dashboard.page";
import { ErrorBoundary } from "./pages/error.boundary";
import { createBrowserRouter } from "react-router";
import { PlayPage } from "@/pages/play.page";

export const router = createBrowserRouter([
	{
		Component: AppLayout,
		ErrorBoundary,
		children: [
			{ path: clientRoutes.landing, Component: DashboardPage },
			{ path: clientRoutes.play, Component: PlayPage },
			// Fallback route for 404 pages
			{ path: "*", Component: ErrorBoundary },
		],
	},
]);
