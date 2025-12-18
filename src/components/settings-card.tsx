import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import { useModal } from "@/hooks/use-modal";
import { Help } from "@/lib/help.namespace";
import { repeat } from "@/lib/utils";
import { useAppContext } from "@/modules/context/app.context";
import type { SettingsReducer } from "@/modules/settings/use-settings-reducer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function SettingsCard({ settings }: { settings: SettingsReducer }) {
	const { collection } = useAppContext();
	const confirmModal = useModal();
	const activeQuery = useQuery(collection.getActive());
	const removeMutation = useMutation(collection.remove());

	function handleRemoveCollection() {
		Help.assert(activeQuery.data?.id);
		removeMutation.mutate(activeQuery.data.id);
	}

	const len = useMemo(() => repeat(settings.teamCount), [settings.teamCount]);

	return (
		<div className="card w-full sm:max-w-72">
			<header>
				<h3>Settings</h3>
			</header>
			<article className="flex flex-col gap-3">
				<div className="flex items-center justify-between gap-4">
					<label className="w-full flex-1 text-xs" htmlFor="teamCount">
						Team Count
					</label>
					<input className="w-16 justify-self-end" {...settings.teamCountInput} />
				</div>

				<div className="unset flex flex-col gap-2">
					<label className="text-xs">Team Colors</label>
					<div className="grid grid-cols-4 gap-2">
						{len.map((n) => (
							<input key={n} {...settings.teamColorsInput(n)} />
						))}
					</div>
				</div>
				<div className="flex items-center justify-between gap-4">
					<label className="w-full flex-1 text-xs" htmlFor="forbiddenWordCount">
						Forbidden Word Count
					</label>
					<input className="w-16 justify-self-end" {...settings.forbiddenWordCountInput} />
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-xs" htmlFor="forbiddenWordCount">
						Select Collection
					</label>
					<select id="name" name="name" {...settings.collectionSelect}>
						{settings.collectionOptions.map((opt) => (
							<option key={opt.id} {...opt} />
						))}
					</select>
				</div>

				<ConfirmDialog
					{...confirmModal}
					title="You can't restore deleted collections"
					description="Are you sure?"
					onConfirm={handleRemoveCollection}
				/>
				<button
					type="button"
					className="sm ghost hover:bg-rose-500/70"
					onClick={() => confirmModal.onOpenChange(true)}
				>
					Delete current collection
				</button>
			</article>
		</div>
	);
}
