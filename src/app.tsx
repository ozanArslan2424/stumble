import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";
import { AppContextProvider } from "@/modules/context/app.context";
import { ModalContextProvider } from "@/modules/context/modal.context";

export function App() {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<AppContextProvider>
				<ModalContextProvider>
					<Toaster richColors position="top-right" />
					<RouterProvider router={router} />
				</ModalContextProvider>
			</AppContextProvider>
		</ThemeProvider>
	);
}
