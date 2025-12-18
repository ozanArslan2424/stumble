import { apiRoutes } from "@/api.routes";
import type { CardCreateData, CardData, CardUpdateData } from "@/modules/card/card.schema";
import { Module } from "@/modules/module.class";
import type { QueryModule } from "@/modules/query/query.module";
import type { DexieModule } from "@/modules/store/dexie.module";

export class CardModule extends Module {
	constructor(
		private readonly query: QueryModule,
		private readonly dexie: DexieModule,
	) {
		super();
	}

	make(data: Partial<CardData>): CardData {
		return {
			id: data.id ?? -1,
			collectionId: data.collectionId ?? -1,
			word: data.word ?? "",
			forbidden: data.forbidden ?? [],
		};
	}

	list = (collectionId: number) =>
		this.query.makeQuery<CardData[]>({
			queryKey: [apiRoutes.cards, collectionId],
			queryFn: async () => {
				return this.dexie.cards.where("collectionId").equals(collectionId).toArray();
			},
		});

	create = (collectionId: number) =>
		this.query.makeOptimisticMutation<
			CardCreateData,
			Omit<CardData, "id"> & { id: number },
			CardData[]
		>({
			queryKey: [apiRoutes.cards, collectionId],
			mutationFn: async (data) => {
				const id = await this.dexie.cards.add({ collectionId, ...data } as CardData);
				return { id, collectionId, ...data };
			},
			updater: (prev, vars) => {
				const placeholder = this.make({ collectionId, ...vars });
				return [...prev, placeholder];
			},
			onSuccess: (res) => {
				this.query.updateListData({
					queryKey: [apiRoutes.cards, collectionId],
					action: "replace",
					data: res,
					prevId: -1,
				});
			},
		});

	update = (collectionId: number) =>
		this.query.makeOptimisticMutation<
			CardUpdateData,
			Omit<CardData, "id"> & { id: number },
			CardData[]
		>({
			queryKey: [apiRoutes.cards, collectionId],
			mutationFn: async (data) => {
				await this.dexie.cards.update(data.id, data);
				return { collectionId, ...data };
			},
			updater: (prev, vars) => prev.map((c) => (c.id === vars.id ? { ...c, ...vars } : c)),
		});

	remove = (collectionId: number) =>
		this.query.makeOptimisticMutation<number, void, CardData[]>({
			queryKey: [apiRoutes.cards, collectionId],
			mutationFn: (data) => this.dexie.cards.delete(data),
			updater: (prev, vars) => prev.filter((c) => c.id !== vars),
		});
}
