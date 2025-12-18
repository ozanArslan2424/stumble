import type { ModalState } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Drawer as Vaul } from "vaul";

type DrawerProps = Omit<ModalState, "ref"> & {
	trigger?: (open: boolean) => ReactNode;
	className?: string;
	children: ReactNode;
};

export function Drawer({ trigger, className, children, ...modal }: DrawerProps) {
	return (
		<Vaul.Root data-slot="drawer" {...modal}>
			{trigger && (
				<Vaul.Trigger data-slot="drawer-trigger" asChild>
					{trigger(modal.open)}
				</Vaul.Trigger>
			)}

			<Vaul.Portal data-slot="drawer-portal">
				<Vaul.Overlay
					data-slot="drawer-overlay"
					className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
				/>
				<Vaul.Content
					data-slot="drawer-content"
					className={cn(
						"group/drawer-content bg-card fixed z-50 flex h-auto flex-col",
						"data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
						"data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
						"data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
						"data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
						"pb-20 [&_.card]:rounded-none [&_.card]:border-0 [&_.card>header]:mb-3",
						className,
					)}
				>
					<div className="bg-secondary mx-auto my-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />

					{children}
				</Vaul.Content>
			</Vaul.Portal>
		</Vaul.Root>
	);
}
