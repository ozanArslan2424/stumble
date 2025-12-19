import { useMemo } from "react";

export type ColorMap = Record<string, string>;

export const defaultColorMap: ColorMap = {
	"#": "#000000", // black
	"@": "#FF0000", // red
	"&": "#00FF00", // green
	"*": "#0000FF", // blue
	"+": "#FFFF00", // yellow
	"=": "#FF00FF", // magenta
	"%": "#00FFFF", // cyan
	O: "#FFFFFF", // white
	".": "#CCCCCC", // light gray
	",": "#666666", // dark gray
	" ": "#FFFFFF00", // transparent
};

export function asciiToGrid(
	asciiArt: string,
	colorMap: ColorMap = defaultColorMap,
	background: string = "#FFFFFF",
): string[][] {
	const lines = asciiArt.split("\n");
	const height = lines.length;
	const width = Math.max(...lines.map((line) => line.length));

	// Create grid with background color
	const grid: string[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => background),
	);

	// Fill grid with colors from ASCII
	lines.forEach((line, row) => {
		[...line].forEach((char, col) => {
			if (colorMap[char]) {
				grid[row][col] = colorMap[char];
			}
		});
	});

	return grid;
}

export function centerGrid(
	grid: string[][],
	targetWidth: number = 32,
	targetHeight: number = 32,
	background: string = "#FFFFFF",
): string[][] {
	const srcHeight = grid.length;
	const srcWidth = grid[0]?.length || 0;

	// Create target grid with background
	const targetGrid: string[][] = Array.from({ length: targetHeight }, () =>
		Array.from({ length: targetWidth }, () => background),
	);

	// Calculate centering offsets
	const offsetX = Math.floor((targetWidth - srcWidth) / 2);
	const offsetY = Math.floor((targetHeight - srcHeight) / 2);

	// Copy source grid into center of target grid
	for (let y = 0; y < srcHeight; y++) {
		for (let x = 0; x < srcWidth; x++) {
			const targetY = y + offsetY;
			const targetX = x + offsetX;

			if (targetY >= 0 && targetY < targetHeight && targetX >= 0 && targetX < targetWidth) {
				targetGrid[targetY][targetX] = grid[y][x];
			}
		}
	}

	return targetGrid;
}

// Helper to create a grid from ASCII art
export function createGridFromAscii(
	asciiArt: string,
	options?: {
		colorMap?: ColorMap;
		width?: number;
		height?: number;
		background?: string;
	},
): string[][] {
	const {
		colorMap = defaultColorMap,
		width = 32,
		height = 32,
		background = "#FFFFFF",
	} = options || {};

	const grid = asciiToGrid(asciiArt, colorMap, background);
	return centerGrid(grid, width, height, background);
}

type AsciiPixelArtProps = {
	asciiArt: string;
	colorMap?: ColorMap;
	width?: number;
	height?: number;
	pixelSize?: number;
	spacing?: number;
	background?: string;
};

export function AsciiPixelArt({
	asciiArt,
	colorMap = defaultColorMap,
	width = 32,
	height = 32,
	pixelSize = 16,
	spacing = 1,
	background = "#FFFFFF",
}: AsciiPixelArtProps) {
	const grid = useMemo(() => {
		return createGridFromAscii(asciiArt, { colorMap, width, height, background });
	}, [asciiArt, colorMap, width, height, background]);

	return (
		<div className="relative">
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${width}, ${pixelSize}px)`,
					gap: `${spacing}px`,
				}}
			>
				{grid.map((row, rowIndex) =>
					row.map((color, colIndex) => (
						<span
							key={`${rowIndex}-${colIndex}`}
							className="border-0 p-0"
							style={{
								width: `${pixelSize}px`,
								height: `${pixelSize}px`,
								backgroundColor: color,
								borderRadius: "2px",
							}}
							title={`Pixel (${rowIndex}, ${colIndex}): ${color}`}
						/>
					)),
				)}
			</div>
		</div>
	);
}
