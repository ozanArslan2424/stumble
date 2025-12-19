export function InfoCard() {
	return (
		<div className="card h-full w-full sm:max-w-72">
			<header>
				<h3>Information</h3>
			</header>
			<div className="text-foreground/70 space-y-2 px-4 py-2 text-sm font-medium">
				<p>
					Create your game cards using the template card, change any setting you want using the
					settings card, import or export using the import card.
				</p>
				<p>
					All data is local. If you clear your browser storage, your cards will be destroyed but if
					you just close the browser, you can continue where you left off.
				</p>
			</div>
		</div>
	);
}
