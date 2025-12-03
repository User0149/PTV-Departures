import { createContext, useState, type ReactNode } from "react";

import type { disruptionType, setState } from "../types/types";

interface IDisruptionContext {
    showDisruptions: boolean,
    disruptionIDs: number[],
    disruptions: Record<string, disruptionType>,
    setShowDisruptions: setState<boolean>,
    setDisruptionIDs: setState<number[]>,
    setDisruptions: setState<Record<string, disruptionType>>
}

interface DisruptionContextProviderProps {
    children: ReactNode;
}

export const DisruptionContext = createContext<IDisruptionContext>({
    showDisruptions: false,
    setShowDisruptions: () => {},
    disruptionIDs: [],
    setDisruptionIDs: () => {},
    disruptions: {},
    setDisruptions: () => {}
});

export default function DisruptionContextProvider({ children }: DisruptionContextProviderProps) {
    const [showDisruptions, setShowDisruptions] = useState<boolean>(false);

    // disruptions for the selected run
    const [disruptionIDs, setDisruptionIDs] = useState<number[]>([]);
    // disruptions for the selected stop
    const [disruptions, setDisruptions] = useState<Record<string, disruptionType>>({});
    
    const initialDisruptionContext: IDisruptionContext = {
        showDisruptions,
        setShowDisruptions,
        disruptionIDs,
        setDisruptionIDs,
        disruptions,
        setDisruptions
    };

    return (
        <DisruptionContext value={initialDisruptionContext}>
            {children}
        </DisruptionContext>
    );
}
