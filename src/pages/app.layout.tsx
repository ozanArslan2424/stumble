import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { Outlet } from "react-router";

export function AppLayout() {
	return (
		<div className="bg-background relative min-h-screen">
			<AppHeader />
			<Outlet />
			<AppFooter />
		</div>
	);
}
