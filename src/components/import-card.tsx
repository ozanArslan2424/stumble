import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TXT } from "@/lib/txt.namespace";
import { isObjectWith } from "@/lib/utils";
import { useAppContext } from "@/modules/context/app.context";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function ImportCard() {
	const [state, setState] = useState<"import" | "export">("export");
	const { card, collection } = useAppContext();
	const collectionQuery = useSuspenseQuery(collection.getActive());
	const listQuery = useSuspenseQuery(card.list(collectionQuery.data.id ?? -1));
	const importMutaion = useMutation(collection.import());

	const value = useMemo(
		() =>
			JSON.stringify(
				listQuery.data.map((item) => ({
					id: item.id,
					word: item.word,
					forbidden: item.forbidden,
				})),
				null,
				2,
			),
		[listQuery],
	);

	function handleCopy() {
		navigator.clipboard.writeText(value);
		toast.success("Copied");
	}

	function handleChangeState() {
		setState((p) => (p === "export" ? "import" : "export"));
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const collectionName = formData.get("collectionName")?.toString();
		if (!TXT.isDefined(collectionName)) {
			toast.error("Collections need names");
			return;
		}
		const dataString = formData.get("data")?.toString();
		if (!TXT.isDefined(dataString)) {
			toast.error("The import area is empty");
			return;
		}
		const data = JSON.parse(dataString);
		if (!Array.isArray(data)) {
			toast.error("Data needs to be an array ([] <- like this)");
			return;
		}
		if (data.some((item) => !isObjectWith(item, "forbidden") || !isObjectWith(item, "word"))) {
			toast.error("Your JSON is malformed");
			return;
		}

		importMutaion.mutate({ collectionName, data });
		e.currentTarget.reset();
	}

	if (state === "export") {
		return (
			<div className="card w-full sm:max-w-72">
				<header>
					<h3>{collectionQuery.data.name}</h3>
				</header>
				<pre className="bg-background text-foreground/90 h-52 overflow-y-auto border p-1.5 text-xs">
					<code>{value}</code>
				</pre>
				<footer className="flex flex-col gap-1.5">
					<button className="sm" type="button" onClick={handleCopy}>
						Copy Data
					</button>
					<button className="sm" type="button" onClick={handleChangeState}>
						Import new collection
					</button>
				</footer>
			</div>
		);
	}

	return (
		<form className="contents gap-0" onSubmit={handleSubmit} onReset={handleChangeState}>
			<div className="card w-full sm:max-w-72">
				<header className="flex items-center justify-between py-0">
					<input
						className="ghost py-4 sm:text-lg"
						placeholder="Collection Name"
						id="collectionName"
						name="collectionName"
					/>

					<HoverCard>
						<HoverCardTrigger delay={100} className="button sm ghost square">
							<InfoIcon />
						</HoverCardTrigger>

						<HoverCardContent>
							<div className="card">
								<header>
									<p className="text-base font-bold">Example data:</p>
								</header>
								<pre className="p-3 text-xs">
									<code>
										{JSON.stringify(
											[{ word: "hello", forbidden: ["world", "coding", "etc"] }],
											null,
											2,
										)}
									</code>
								</pre>
							</div>
						</HoverCardContent>
					</HoverCard>
				</header>

				<textarea
					id="data"
					name="data"
					className="h-52 w-full rounded-none p-1.5 font-mono text-xs"
					defaultValue="[]"
				/>

				<footer className="flex flex-col gap-1.5">
					<button className="sm" type="submit">
						Submit
					</button>
					<button className="sm" type="reset">
						Cancel
					</button>
				</footer>
			</div>
		</form>
	);
}
