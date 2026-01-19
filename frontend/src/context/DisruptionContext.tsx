import { createContext, useState, type ReactNode } from "react";

import type { Disruption, StateSetter } from "../types/types";

interface IDisruptionContext {
    showDisruptions: boolean,
    disruptionIDs: number[],
    disruptions: Record<string, Disruption>,
    setShowDisruptions: StateSetter<boolean>,
    setDisruptionIDs: StateSetter<number[]>,
    setDisruptions: StateSetter<Record<string, Disruption>>
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
    const [disruptions, setDisruptions] = useState<Record<string, Disruption>>({});
    
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
