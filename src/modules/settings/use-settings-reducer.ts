import { Help } from "@/lib/help.namespace";
import { repeat } from "@/lib/utils";
import { useAppContext } from "@/modules/context/app.context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, type ComponentProps } from "react";

type State = {
	teamCount: number;
	forbiddenWordCount: number;
	teamColors: string[];
};

type Action =
	| { type: "teamColorChange"; payload: { n: number; color: string } }
	| { type: "teamColors"; payload: State["teamColors"] }
	| { type: "teamCount"; payload: State["teamCount"] }
	| { type: "forbiddenWordCount"; payload: State["forbiddenWordCount"] }
	| { type: "set"; payload: State };

const initialState: State = {
	teamCount: 4,
	forbiddenWordCount: 5,
	teamColors: [
		"#6B21A8", // purple-800
		"#065F46", // emerald-800
		"#9A3412", // orange-800
		"#155E75", // cyan-800
	],
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "teamCount":
			localStorage.setItem("teamCount", action.payload.toString());
			return { ...state, teamCount: action.payload };

		case "teamColors":
			action.payload.forEach((color, index) => {
				localStorage.setItem(`teamColors[${index}]`, color);
			});
			return { ...state, teamColors: action.payload };

		case "teamColorChange":
			localStorage.setItem(`teamColors[${action.payload.n}]`, action.payload.color);
			return {
				...state,
				teamColors: state.teamColors.map((c, i) =>
					i === action.payload.n ? action.payload.color : c,
				),
			};

		case "forbiddenWordCount":
			localStorage.setItem("forbiddenWordCount", action.payload.toString());
			return { ...state, forbiddenWordCount: action.payload };

		case "set":
			localStorage.setItem("teamCount", action.payload.teamCount.toString());
			localStorage.setItem("forbiddenWordCount", action.payload.forbiddenWordCount.toString());
			action.payload.teamColors.forEach((color, index) => {
				localStorage.setItem(`teamColors[${index}]`, color);
			});
			return action.payload;

		default:
			return initialState;
	}
};

export type SettingsReducer = ReturnType<typeof useSettingsReducer>;

export function useSettingsReducer() {
	const { collection } = useAppContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const collectionsQuery = useQuery(collection.list());
	const activeQuery = useQuery(collection.getActive());

	useEffect(() => {
		const storedTeamCount = parseInt(localStorage.getItem("teamCount") ?? "4");
		const storedForbiddenWordCount = localStorage.getItem("forbiddenWordCount");

		const storedTeamColors: string[] = [];
		for (let i = 0; i < storedTeamCount; i++) {
			const color = localStorage.getItem(`teamColors[${i}]`);
			if (color) storedTeamColors[i] = color;
		}

		const loadedState: State = {
			teamCount: storedTeamCount,
			forbiddenWordCount: storedForbiddenWordCount
				? parseInt(storedForbiddenWordCount)
				: initialState.forbiddenWordCount,
			teamColors:
				storedTeamColors.length > 0
					? repeat(4).map((i) => storedTeamColors[i] || initialState.teamColors[i])
					: initialState.teamColors,
		};

		dispatch({ type: "set", payload: loadedState });
	}, []);

	const teamCountInput: ComponentProps<"input"> = {
		id: "teamCount",
		name: "teamCount",
		type: "number",
		value: state.teamCount,
		onChange: (e) => dispatch({ type: "teamCount", payload: parseInt(e.target.value) }),
		min: 1,
		max: 4,
	};

	const forbiddenWordCountInput: ComponentProps<"input"> = {
		id: "forbiddenWordCount",
		name: "forbiddenWordCount",
		type: "number",
		value: state.forbiddenWordCount,
		onChange: (e) => dispatch({ type: "forbiddenWordCount", payload: parseInt(e.target.value) }),
		min: 5,
		max: 10,
	};

	const collectionOptions: ComponentProps<"option">[] = (collectionsQuery.data ?? []).map(
		(col) => ({
			id: col.id.toString(),
			name: `collection[${col.id}]`,
			value: col.id,
			children: col.name,
		}),
	);

	const collectionSelect: ComponentProps<"select"> = {
		value: activeQuery.data?.id,
		onChange: (e) => {
			const id = parseInt(e.target.value);
			const value = collectionsQuery.data?.find((c) => c.id === id);
			Help.assert(value);
			collection.setActive(value);
		},
	};

	const teamColorsInput = (n: number): ComponentProps<"input"> => ({
		type: "color",
		value: state.teamColors[n],
		onChange: (e) => {
			dispatch({ type: "teamColorChange", payload: { n, color: e.target.value } });
		},
	});

	return {
		...state,
		teamCountInput,
		forbiddenWordCountInput,
		teamColorsInput,
		collectionSelect,
		collectionOptions,
		dispatch,
	};
}
