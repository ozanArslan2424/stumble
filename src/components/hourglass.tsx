import { AsciiPixelArt } from "@/components/ascii-art";
import { useEffect, useMemo, useState } from "react";

type HourglassProps = {
	pixelSize: number;
	colorMap: Record<string, string>;
};

export function Hourglass({ pixelSize, colorMap }: HourglassProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const sequence = [0, 1, 2, 1];

		let currentStep = 0;

		const interval = setInterval(() => {
			const nextIndex = sequence[currentStep];
			setIndex(nextIndex);

			currentStep = (currentStep + 1) % sequence.length;
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const asciiArt = useMemo(
		() =>
			[
				["___xxxxxxxxxxxxxxxx___"][0],
				["___xoooooooooooooox___"][0],
				["___xoooooooooooooox___"][0],
				["____xoooooooooooox____"][0],
				["____xoooooooooooox____"][0],
				["_____xoooooooooox_____"][0],
				["_____xoooooooooox_____"][0],
				["______xoooooooox______"][0],
				["______xxxxooooox______", "______xxxoooooxx______", "______xooooooxxx______"][index],
				["_______xxxxxxox_______", "_______xxxxxoxx_______", "_______xxxxoxxx_______"][index],
				["________xxxxxx________"][0],
				["________xxxxxx________"][0],
				["_________xxxx_________"][0],
				["__________xx__________"][0],
				["__________xx__________"][0],
				["_________xxxx_________"][0],
				["________xoxxox________"][0],
				["________xoxxox________"][0],
				["_______xoooxoox_______", "_______xooxxoox_______", "_______xooxxoox_______"][index],
				["______xooooxooox______", "______xoooxxooox______", "______xoooxoooox______"][index],
				["______xooooxooox______", "______xoooxxooox______", "______xoooxoooox______"][index],
				["_____xooooxooooox_____", "_____xooooxxoooox_____", "_____xoooooxoooox_____"][index],
				["_____xooooxooooox_____", "_____xooooxxoooox_____", "_____xoooooxoooox_____"][index],
				["____xoooooxoooooox____", "____xooooooxooooox____", "____xooooooxooooox____"][index],
				["____xoxxxxxxxxooox____", "____xooxxxxxxxooox____", "____xoooxxxxxxxxox____"][index],
				["___xxxxxxxxxxxoooox___", "___xoxxxxxxxxxxooox___", "___xooxxxxxxxxxxxox___"][index],
				["___xxxxxxxxxxxxxxxx___"][0],
				["___xxxxxxxxxxxxxxxx___"][0],
			].join("\n"),
		[index],
	);

	return (
		<AsciiPixelArt
			colorMap={colorMap}
			background="var(--color-background)"
			width={22}
			pixelSize={pixelSize}
			asciiArt={asciiArt}
		/>
	);
}
