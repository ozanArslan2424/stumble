import { CardForm } from "@/components/card-form";
import type { CardData } from "@/modules/card/card.schema";
import { useAppContext } from "@/modules/context/app.context";
import type { SettingsReducer } from "@/modules/settings/use-settings-reducer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function CardCard({
	card,
	collectionId,
	settings,
	index,
}: {
	index: number;
	card: CardData;
	collectionId: number;
	settings: SettingsReducer;
}) {
	const [isUpdating, setIsUpdating] = useState(false);
	const { card: cardMod } = useAppContext();
	const removeMutation = useMutation(cardMod.remove(collectionId));

	function handleRemoveClick() {
		removeMutation.mutate(card.id);
	}

	function handleUpdateClick() {
		setIsUpdating(true);
	}

	if (isUpdating) {
		return <CardForm settings={settings} card={card} onReset={() => setIsUpdating(false)} />;
	}

	return (
		<div className="card min-h-60 w-full sm:max-w-72">
			<header
				className="text-white"
				style={{ backgroundColor: `${settings.teamColors[index % settings.teamCount]}CC` }}
			>
				<h3 className="text-center">{card.word}</h3>
			</header>

			<ul className="py-4">
				{card.forbidden.map((forbidden) => (
					<li className="text-center font-medium text-rose-500 dark:text-rose-400" key={forbidden}>
						{forbidden}
					</li>
				))}
			</ul>

			<footer className="flex gap-3">
				<button className="sm ghost w-full" type="button" onClick={handleUpdateClick}>
					Update
				</button>
				<button className="sm ghost w-full" type="button" onClick={handleRemoveClick}>
					Remove
				</button>
			</footer>
		</div>
	);
}
