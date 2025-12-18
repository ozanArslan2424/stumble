import type { CardData } from "@/modules/card/card.schema";
import type { CollectionData } from "@/modules/collection/collection.schema";
import Dexie from "dexie";

export class DexieModule extends Dexie {
	cards: Dexie.Table<CardData, number>;
	collections: Dexie.Table<CollectionData, number>;

	constructor() {
		super("Store");
		this.version(1).stores({
			cards: "++id, collectionId, word, forbidden",
			collections: "++id, name",
		});

		this.cards = this.table("cards");
		this.collections = this.table("collections");
	}
}
