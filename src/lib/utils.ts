import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isObjectWith<T extends Record<string, unknown>>(
	item: unknown,
	key: keyof T | string,
): item is T {
	return !!item && typeof item === "object" && key in item;
}

export function repeat(length: number = 4) {
	return Array.from({ length }, (_, index) => index);
}

export function prefixId(id: number | string, prefix?: string): string {
	if (prefix) {
		return `${prefix}_${id}`;
	}

	return id.toString().split("_")[1] as string;
}
