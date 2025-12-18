import { apiRoutes } from "@/api.routes";
import { Help } from "@/lib/help.namespace";
import type { CardData } from "@/modules/card/card.schema";
import type { CollectionData } from "@/modules/collection/collection.schema";
import type { QueryModule } from "@/modules/query/query.module";
import type { DexieModule } from "@/modules/store/dexie.module";

export class CollectionModule {
	constructor(
		private readonly query: QueryModule,
		private readonly dexie: DexieModule,
	) {}

	import = () =>
		this.query.makeMutation<
			{
				collectionName: string;
				data: Omit<CardData, "collectionId" | "id">[];
			},
			CollectionData
		>({
			mutationFn: async (body) => {
				const collectionId = await this.dexie.collections.add({
					name: body.collectionName,
				} as CollectionData);
				const items = body.data.map((item) => ({
					...item,
					collectionId,
				}));
				await this.dexie.cards.bulkAdd(items as CardData[]);
				return { id: collectionId, name: body.collectionName };
			},
			onSuccess: async (res) => {
				await this.query.invalidateAll([apiRoutes.collections], [apiRoutes.cards]);
				this.query.setQueryData([apiRoutes.collections, "active"], res);
			},
		});

	setActive(value: CollectionData) {
		localStorage.setItem("collectionId", value.id?.toString() ?? "");
		this.query.setQueryData([apiRoutes.collections, "active"], value);
	}

	create = () =>
		this.query.makeMutation<string, CollectionData>({
			mutationFn: async (name) => {
				const id = await this.dexie.collections.add({ name } as CollectionData);
				return { id, name };
			},
			onSuccess: (collection) => {
				this.setActive(collection);
				this.query.invalidateAll([apiRoutes.collections], [apiRoutes.collections, "active"]);
			},
		});

	list = () =>
		this.query.makeQuery<CollectionData[]>({
			queryKey: [apiRoutes.collections],
			queryFn: () => this.dexie.collections.toArray(),
		});

	getActive = () =>
		this.query.makeQuery<CollectionData>({
			queryKey: [apiRoutes.collections, "active"],
			queryFn: async () => {
				const stored = localStorage.getItem("collectionId");
				if (stored) {
					const found = await this.dexie.collections.get(parseInt(stored));
					if (found) return found;
				}

				const all = await this.dexie.collections.toArray();

				if (all.length === 0) {
					const id = await this.dexie.collections.add({
						name: "First Collection",
					} as CollectionData);
					const created = await this.dexie.collections.get(id);
					Help.assert(created, "Collection can't be found or created!!!");
					return created;
				}

				const first = all[0];
				return first;
			},
		});

	remove = () =>
		this.query.makeMutation<number>({
			mutationFn: (data) => this.dexie.collections.delete(data),
			onSuccess: () => {
				this.query.invalidateAll(
					[apiRoutes.collections],
					[apiRoutes.collections, "active"],
					[apiRoutes.cards],
				);
			},
		});
}
