import { CardModule } from "@/modules/card/card.module";
import { CollectionModule } from "@/modules/collection/collection.module";
import { queryConfig } from "@/modules/query/query.config";
import { QueryModule } from "@/modules/query/query.module";
import { DexieModule } from "@/modules/store/dexie.module";
import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, use, type PropsWithChildren } from "react";

function makeContext() {
	const query = new QueryModule(queryConfig);
	const dexie = new DexieModule();
	const collection = new CollectionModule(query, dexie);
	const card = new CardModule(query, dexie);
	return { query, dexie, collection, card };
}

const context = makeContext();

const AppContext = createContext<typeof context>(context);

export function useAppContext() {
	const value = use(AppContext);
	if (!value) throw new Error("AppContext requires a provider.");
	return value;
}

export function AppContextProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={context.query}>
			<AppContext value={context}>{children}</AppContext>
		</QueryClientProvider>
	);
}
