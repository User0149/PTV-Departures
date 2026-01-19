import { createContext, useContext, type ReactNode } from "react";
import { DisruptionContext } from "./DisruptionContext";

interface IModalContext {
    hideModals: () => void;
}

interface ModalContextProviderProps {
    children: ReactNode;
}

export const ModalContext = createContext<IModalContext>({
    hideModals: () => {}
});

export default function ModalContextProvider({ children }: ModalContextProviderProps) {
    const { setShowDisruptions } = useContext(DisruptionContext);

    const hideModals = () => {
        setShowDisruptions(false);
    };

    const initialModalContext: IModalContext = {
        hideModals
    };

    return (
        <ModalContext value={initialModalContext}>
            {children}
        </ModalContext>
    );
}
