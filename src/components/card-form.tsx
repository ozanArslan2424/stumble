import { TXT } from "@/lib/txt.namespace";
import { repeat } from "@/lib/utils";
import type { CardData } from "@/modules/card/card.schema";
import { useAppContext } from "@/modules/context/app.context";
import { useSettingsContext } from "@/modules/context/settings.context";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

type CardFormProps = {
	card: CardData | null;
	onReset?: () => void;
};

export function CardForm({ card, onReset }: CardFormProps) {
	const settings = useSettingsContext();
	const { card: cardMod, collection } = useAppContext();
	const collectionQuery = useSuspenseQuery(collection.getActive());
	const collectionId = collectionQuery.data.id;
	const createMutation = useMutation(cardMod.create(collectionId));
	const updateMutation = useMutation(cardMod.update(collectionId));

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const word = formData.get("main")?.toString().toLocaleUpperCase();
		if (!word) {
			toast.error("You need to enter the main word");
			return;
		}
		const forbidden = formData
			.getAll("forbidden")
			.map((entry) => entry.toString().toLocaleUpperCase())
			.filter((entry) => TXT.isDefined(entry));
		if (forbidden.length < settings.forbiddenWordCount) {
			toast.error(`A card needs at least ${settings.forbiddenWordCount} forbidden words`);
			return;
		}
		if (card) {
			updateMutation.mutate({ id: card.id, word, forbidden });
		} else {
			createMutation.mutate({ word, forbidden });
		}
		e.currentTarget.reset();
	}

	const len = useMemo(() => repeat(settings.forbiddenWordCount), [settings.forbiddenWordCount]);

	return (
		<form className="contents" onSubmit={handleSubmit} onReset={onReset}>
			<div className="card w-full sm:max-w-72">
				<header className="py-2">
					<input
						className="ghost sm:text-lg"
						placeholder="New Card"
						id="main"
						name="main"
						defaultValue={card?.word}
					/>
				</header>
				<ul>
					{len.map((v) => (
						<li key={v}>
							<input
								className="hover:border-border hover:bg-background/10 focus-visible:bg-background bg-secondary/20 rounded-none px-4 py-3 focus-visible:ring-transparent"
								placeholder={`Forbidden word ${v + 1}`}
								type="text"
								id={`forbidden[${v}]`}
								name="forbidden"
								defaultValue={card?.forbidden[v]}
							/>
						</li>
					))}
				</ul>

				<footer className="flex gap-3">
					<button className="sm ghost" type="reset">
						Reset
					</button>
					<button className="sm flex-1" type="submit">
						Submit
					</button>
				</footer>
			</div>
		</form>
	);
}
