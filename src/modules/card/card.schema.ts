export type CardData = {
	id: number;
	collectionId: number;
	word: string;
	forbidden: string[];
};

export type CardCreateData = { word: string; forbidden: string[] };

export type CardUpdateData = CardCreateData & { id: number };
