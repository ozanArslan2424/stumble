import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer } from "@/components/modals/drawer";
import { useModal } from "@/hooks/use-modal";

type HoverCardProps = PreviewCardPrimitive.Popup.Props &
	Pick<PreviewCardPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
		triggerClassName?: string;
		trigger: (open: boolean) => ReactNode;
	};

export function HoverCard({
	className,
	side = "bottom",
	sideOffset = 4,
	align = "center",
	alignOffset = 4,
	trigger,
	triggerClassName,
	children,
	...props
}: HoverCardProps) {
	const isMobile = useIsMobile();
	const modal = useModal();

	if (isMobile) {
		return (
			<Drawer {...modal} trigger={trigger}>
				{children}
			</Drawer>
		);
	}

	return (
		<PreviewCardPrimitive.Root data-slot="hover-card">
			<PreviewCardPrimitive.Trigger
				data-slot="hover-card-trigger"
				delay={100}
				className={triggerClassName}
			>
				{trigger(false)}
			</PreviewCardPrimitive.Trigger>

			<PreviewCardPrimitive.Portal data-slot="hover-card-portal">
				<PreviewCardPrimitive.Positioner
					align={align}
					alignOffset={alignOffset}
					side={side}
					sideOffset={sideOffset}
					className="isolate z-50"
				>
					<PreviewCardPrimitive.Popup
						data-slot="hover-card-content"
						className={cn(
							"data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-background text-foreground z-50 w-72 origin-(--transform-origin) rounded-lg p-2.5 text-xs/relaxed shadow-md ring-1 outline-hidden duration-100",
							className,
						)}
						{...props}
					>
						{children}
					</PreviewCardPrimitive.Popup>
				</PreviewCardPrimitive.Positioner>
			</PreviewCardPrimitive.Portal>
		</PreviewCardPrimitive.Root>
	);
}
