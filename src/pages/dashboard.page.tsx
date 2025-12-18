import { CardCard } from "@/components/card-card";
import { CardForm } from "@/components/card-form";
import { ImportCard } from "@/components/import-card";
import { InfoCard } from "@/components/info-card";
import { PageContent } from "@/components/layout/page-content";
import { Drawer } from "@/components/modals/drawer";
import { SettingsCard } from "@/components/settings-card";
import { useModal } from "@/hooks/use-modal";
import { useAppContext } from "@/modules/context/app.context";
import { useSettingsReducer } from "@/modules/settings/use-settings-reducer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export function DashboardPage() {
	const settings = useSettingsReducer();
	const { card, collection } = useAppContext();
	const collectionQuery = useSuspenseQuery(collection.getActive());
	const listQuery = useSuspenseQuery(card.list(collectionQuery.data.id ?? -1));
	const [currentModal, setCurrentModal] = useState<"info" | "settings" | "import" | null>(null);
	const modal = useModal();

	function handleModal(type: "info" | "settings" | "import") {
		setCurrentModal(type);
		modal.onOpenChange(true);
	}

	return (
		<PageContent className="px-6 pb-14">
			<div className="flex justify-center gap-3 sm:hidden">
				<button onClick={() => handleModal("info")} className="outlined sm">
					Information
				</button>
				<button onClick={() => handleModal("settings")} className="outlined sm">
					Settings
				</button>
				<button onClick={() => handleModal("import")} className="outlined sm">
					Import/Export
				</button>
			</div>

			<div className="sm:hidden">
				<CardForm settings={settings} card={null} />
			</div>

			<Drawer {...modal}>
				{currentModal === "info" ? (
					<InfoCard />
				) : currentModal === "settings" ? (
					<SettingsCard settings={settings} />
				) : currentModal === "import" ? (
					<ImportCard />
				) : null}
			</Drawer>

			<div className="hidden flex-wrap justify-center gap-6 sm:flex sm:justify-start">
				<InfoCard />
				<CardForm settings={settings} card={null} />
				<SettingsCard settings={settings} />
				<ImportCard />
			</div>
			<div className="flex flex-wrap justify-center gap-6 sm:justify-start">
				{listQuery.data.map((card, index) => (
					<CardCard
						key={card.id}
						index={index}
						card={card}
						collectionId={collectionQuery.data.id ?? -1}
						settings={settings}
					/>
				))}
			</div>
		</PageContent>
	);
}
