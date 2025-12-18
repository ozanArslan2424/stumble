import { Dialog } from "./dialog";
import type { ModalState } from "@/hooks/use-modal";
import { cn, prefixId } from "@/lib/utils";
import type { ComponentProps } from "react";

type ConfirmDialogProps = ModalState & {
	title: string;
	description: string;
	confirmProps?: Omit<ComponentProps<"button">, "onClick">;
	cancelProps?: Omit<ComponentProps<"button">, "onClick">;
	onCancel?: () => void;
	onConfirm: () => void;
};

export function ConfirmDialog({
	confirmProps,
	cancelProps,
	onConfirm,
	onCancel,
	id,
	...dialog
}: ConfirmDialogProps) {
	function handleCancel() {
		onCancel?.();
		dialog.onOpenChange(false);
	}

	function handleConfirm() {
		onConfirm();
		dialog.onOpenChange(false);
	}

	return (
		<Dialog showTitle showDescription id={prefixId(id, "confirm")} {...dialog}>
			<div className="grid grid-cols-3 gap-4">
				<button
					onClick={handleCancel}
					{...cancelProps}
					className={cn("ghost relative col-span-1", cancelProps?.className)}
				>
					{cancelProps?.children ?? "Cancel"}
				</button>
				<button
					onClick={handleConfirm}
					{...confirmProps}
					className={cn("relative col-span-2", confirmProps?.className)}
				>
					{confirmProps?.children ?? "Confirm"}
				</button>
			</div>
		</Dialog>
	);
}
