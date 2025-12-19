import { CardForm } from "@/components/card-form";
import { cn } from "@/lib/utils";
import type { CardData } from "@/modules/card/card.schema";
import { useAppContext } from "@/modules/context/app.context";
import { useSettingsContext } from "@/modules/context/settings.context";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type CardCardProps = {
	index: number;
	card: CardData;
	collectionId: number;
	hideButtons?: boolean;
	className?: string;
};

export function CardCard({
	card,
	index,
	collectionId,
	hideButtons = false,
	className,
}: CardCardProps) {
	const [isUpdating, setIsUpdating] = useState(false);
	const settings = useSettingsContext();
	const { card: cardMod } = useAppContext();
	const removeMutation = useMutation(cardMod.remove(collectionId));

	function handleRemoveClick() {
		removeMutation.mutate(card.id);
	}

	function handleUpdateClick() {
		setIsUpdating(true);
	}

	if (isUpdating) {
		return <CardForm card={card} onReset={() => setIsUpdating(false)} />;
	}

	return (
		<div className={cn("card min-h-60 w-full sm:max-w-72", className)}>
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

			{hideButtons === false && (
				<footer className="flex gap-3">
					<button className="sm ghost w-full" type="button" onClick={handleUpdateClick}>
						Update
					</button>
					<button className="sm ghost w-full" type="button" onClick={handleRemoveClick}>
						Remove
					</button>
				</footer>
			)}
		</div>
	);
}
