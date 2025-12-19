import { clientRoutes } from "@/client.routes";
import { CardCard } from "@/components/card-card";
import { Hourglass } from "@/components/hourglass";
import { PageContent } from "@/components/layout/page-content";
import { Help } from "@/lib/help.namespace";
import { cn } from "@/lib/utils";
import type { CardData } from "@/modules/card/card.schema";
import { useAppContext } from "@/modules/context/app.context";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

export function PlayPage() {
	const { query, card, collection } = useAppContext();
	const collectionsQuery = useQuery(collection.list());

	const [started, setStarted] = useState(false);
	const [cards, setCards] = useState<CardData[]>([]);
	const [index, setIndex] = useState(0);
	const [collectionId, setCollectionId] = useState<number | null>(null);
	const [seconds, setSeconds] = useState(10);
	const [timeLeft, setTimeLeft] = useState(seconds);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timerRef.current) clearInterval(timerRef.current);

		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (timerRef.current) clearInterval(timerRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [index]);

	function handleNext() {
		setIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
		setTimeLeft(seconds);
	}

	async function handleStartGame(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const scnds = formData.get("seconds")?.toString();
		const colId = formData.get("colId")?.toString();
		Help.assert(scnds);
		Help.assert(colId);

		const list = await query.ensureQueryData(card.list(parseInt(colId)));
		const copy = [...list];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}

		setSeconds(parseInt(scnds));
		setCards(copy);
		setTimeLeft(parseInt(scnds));
		setCollectionId(parseInt(colId));
		setStarted(true);
	}

	if (!started) {
		return (
			<PageContent className="px-4">
				<h1 className="pt-12 text-center text-2xl font-bold wrap-break-word">
					Select a collection and set rules to start playing
				</h1>

				<form className="flex flex-col gap-4" onSubmit={handleStartGame}>
					<div>
						<label className="text-base" htmlFor="seconds">
							Seconds per turn
						</label>
						<input id="seconds" name="seconds" type="number" defaultValue={10} />
					</div>

					<div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
						{(collectionsQuery.data ?? []).map((col) => (
							<label key={col.id} className="button outlined w-full justify-start sm:w-max">
								<input
									className="unset"
									id={`col[${col.id}]`}
									name="colId"
									type="radio"
									value={col.id}
								/>
								<span>{col.name}</span>
							</label>
						))}
					</div>

					<button type="submit">Start the game!</button>
				</form>
			</PageContent>
		);
	}

	return (
		<PageContent>
			<div className="mx-auto grid max-w-6xl grid-cols-3 place-items-center gap-4 sm:pt-12">
				<div className="order-2 col-span-3 flex w-full items-center justify-center gap-2 sm:order-0 sm:col-span-1 sm:flex-col">
					<Hourglass
						pixelSize={4}
						colorMap={{
							x: timeLeft === 0 ? "var(--color-rose-500)" : "var(--color-primary)",
							o: "var(--color-secondary)",
							_: "var(--color-background)",
						}}
					/>
					<p className="w-full text-center font-bold">{timeLeft} seconds left</p>
				</div>

				<div className="col-span-3 sm:col-span-2">
					{cards.length === 0 || !collectionId ? (
						<Loader2Icon className="animate-spin" />
					) : (
						<CardCard
							card={cards[index]}
							index={index}
							collectionId={collectionId}
							hideButtons
							className="min-w-72"
						/>
					)}
				</div>

				<p className="text-foreground/70 col-span-1 w-full min-w-[105px] text-right font-bold whitespace-nowrap">
					{index + 1} of {cards.length}
				</p>

				<button
					className={cn("col-span-2 w-full", timeLeft === 0 ? "" : "outlined")}
					onClick={handleNext}
				>
					Next
				</button>

				<div className="order-4 col-span-3 pt-12">
					<div className="flex items-end gap-4">
						<Link to={clientRoutes.landing} className="button outlined text-sm font-normal">
							Back to dashboard
						</Link>
					</div>
				</div>
			</div>
		</PageContent>
	);
}
