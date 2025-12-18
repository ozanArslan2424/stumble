import { clientRoutes } from "@/client.routes";
import { Link } from "react-router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const title = "Error";
	const description = typeof error === "string" ? error : error?.message || "Retry";
	const back = "Go back";

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="card">
				<h1>{title}</h1>
				<p>{description}</p>
				<Link to={clientRoutes.landing}>
					<button>{back}</button>
				</Link>
			</div>
		</div>
	);
}
