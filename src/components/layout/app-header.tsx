import { CONFIG } from "@/lib/config";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function AppHeader() {
	const { setTheme, resolvedTheme } = useTheme();

	function handleToggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	return (
		<div className="top-4 right-4 p-4 sm:fixed sm:p-0">
			<div className="flex items-center justify-between gap-4 sm:justify-end">
				<h1 className="text-xl font-bold">{CONFIG.appTitle}</h1>
				<button
					type="button"
					className="outlined text-sm shadow-none"
					onClick={handleToggleTheme}
					tabIndex={-1}
				>
					{resolvedTheme === "dark" ? (
						<SunIcon className="size-4" />
					) : (
						<MoonIcon className="size-4" />
					)}
				</button>
			</div>
		</div>
	);
}
