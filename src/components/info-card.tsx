export function InfoCard() {
	return (
		<div className="card w-full sm:max-w-72">
			<header>
				<h3>Information</h3>
			</header>
			<ul className="text-foreground/70 space-y-2 px-4 py-2 text-sm font-medium">
				<li>Create your game cards using the template card,</li>
				<li>Change any setting you want using the settings card,</li>
				<li>Import or export using the import card,</li>
				<li>
					All data is local. If you clear your browser storage, your cards will be destroyed but if
					you just close the browser, you can continue where you left off.
				</li>
			</ul>
		</div>
	);
}
