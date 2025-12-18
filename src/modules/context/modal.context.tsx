import { createContext, use, useState, type PropsWithChildren } from "react";

function useModalHook() {
	const [modal, setModal] = useState<string | null>(null);
	return { modal, setModal };
}

const ModalContext = createContext<ReturnType<typeof useModalHook> | null>(null);

export function useModalContext() {
	const context = use(ModalContext);
	if (!context) throw new Error("useModalContext missing provider");
	return context;
}

export function ModalContextProvider({ children }: PropsWithChildren) {
	const value = useModalHook();
	return <ModalContext value={value}>{children}</ModalContext>;
}
